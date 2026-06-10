<template>
  <section ref="wrapRef" class="metaballs" />
</template>

<script setup lang="ts">
import * as THREE from 'three';

const props = withDefaults(
  defineProps<{
    /** 上層純色遮罩顏色 */
    maskColor?: string;
    /** 拖尾 metaball 數量 */
    ballCount?: number;
    /** 拼貼格子尺寸（CSS px） */
    cellSize?: number;
    /** 拼貼色票 */
    palette?: string[];
  }>(),
  {
    maskColor: '#ffffff',
    ballCount: 7,
    cellSize: 14,
    palette: () => ['#9cc9f0', '#bdddf7', '#dcedfb'],
  },
);

const wrapRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const wrap = wrapRef.value;
  if (!wrap) return;

  const COUNT = props.ballCount;
  let width = wrap.clientWidth;
  let height = wrap.clientHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // 頂點著色器直接輸出 clip space，相機僅為 render API 所需
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let texture = makeMosaicTexture(width, height, props.cellSize, props.palette);

  const uniforms = {
    uTex: { value: texture },
    uRes: { value: new THREE.Vector2(width, height) },
    uMaskColor: { value: new THREE.Color(props.maskColor) },
    // xy = 位置（CSS px，y 向上）、z = 半徑
    uBalls: {
      value: Array.from({ length: COUNT }, () => new THREE.Vector3(-9999, -9999, 0)),
    },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      uniform vec2 uRes;
      uniform vec3 uMaskColor;
      uniform vec3 uBalls[${COUNT}];
      varying vec2 vUv;

      void main() {
        vec2 p = vUv * uRes;

        // metaball 場函式：Σ r² / d²，threshold 附近 smoothstep 出黏合邊緣
        float field = 0.0;
        for (int i = 0; i < ${COUNT}; i++) {
          vec3 b = uBalls[i];
          vec2 d = p - b.xy;
          field += (b.z * b.z) / (dot(d, d) + 1.0);
        }
        float mask = smoothstep(0.85, 1.15, field);

        vec3 bg = texture2D(uTex, vUv).rgb;
        gl_FragColor = vec4(mix(uMaskColor, bg, mask), 1.0);
      }
    `,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  // ---------- 拖尾球鏈狀態（CSS px，y 向上） ----------
  const balls = Array.from({ length: COUNT }, () => ({
    x: width / 2,
    y: height / 2,
    scale: 0,
  }));
  const pointer = { x: width / 2, y: height / 2 };

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  let pointerActive = false;
  let lastTouchAt = -Infinity;
  const TOUCH_HOLD = 2; // 秒：touch 結束後維持跟隨的時間

  const toLocal = (clientX: number, clientY: number) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = clientX - rect.left;
    pointer.y = rect.height - (clientY - rect.top);
  };

  const onPointerMove = (e: PointerEvent) => {
    toLocal(e.clientX, e.clientY);
    if (e.pointerType === 'touch') {
      lastTouchAt = clock.getElapsedTime();
    } else {
      pointerActive = true;
    }
  };
  const onPointerLeave = () => {
    pointerActive = false;
  };
  wrap.addEventListener('pointermove', onPointerMove);
  wrap.addEventListener('pointerdown', onPointerMove);
  wrap.addEventListener('pointerleave', onPointerLeave);

  // ---------- render loop（IntersectionObserver 控制啟停） ----------
  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;

  const animate = () => {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();

    const touchFollowing = t - lastTouchAt < TOUCH_HOLD;
    const roaming = !isFinePointer && !touchFollowing;

    // 自動漫遊：多組不同頻率的 sin 疊出偽 noise 路徑
    if (roaming) {
      pointer.x =
        width * 0.5 +
        Math.sin(t * 0.5) * width * 0.3 +
        Math.sin(t * 0.23 + 1.7) * width * 0.12;
      pointer.y =
        height * 0.5 +
        Math.cos(t * 0.41) * height * 0.28 +
        Math.sin(t * 0.19 + 0.7) * height * 0.1;
    }

    const visible = pointerActive || touchFollowing || roaming;
    const baseRadius = Math.min(width, height) * 0.16;

    for (let i = 0; i < COUNT; i++) {
      const b = balls[i]!;
      // 鏈式跟隨：頭球追 pointer，其餘追前一顆；exponential smoothing 不受幀率影響
      const target = i === 0 ? pointer : balls[i - 1]!;
      const k = 1 - Math.exp(-dt * (i === 0 ? 8 : 10));
      b.x += (target.x - b.x) * k;
      b.y += (target.y - b.y) * k;

      const ks = 1 - Math.exp(-dt * 5);
      b.scale += ((visible ? 1 : 0) - b.scale) * ks;

      const pulse = 1 + 0.08 * Math.sin(t * 2 + i * 1.3);
      const radius = baseRadius * Math.pow(0.85, i) * pulse * b.scale;
      uniforms.uBalls.value[i]!.set(b.x, b.y, radius);
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver(([entry]) => {
    const shouldRun = entry?.isIntersecting ?? false;
    if (shouldRun && !running) {
      running = true;
      clock.getDelta(); // 重設 delta，避免暫停期間累積
      animate();
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  observer.observe(wrap);

  const resizeObserver = new ResizeObserver(() => {
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    renderer.setSize(width, height);
    uniforms.uRes.value.set(width, height);
    // 重新生成拼貼，維持格子實際尺寸一致
    texture.dispose();
    texture = makeMosaicTexture(width, height, props.cellSize, props.palette);
    uniforms.uTex.value = texture;
  });
  resizeObserver.observe(wrap);

  onBeforeUnmount(() => {
    running = false;
    cancelAnimationFrame(raf);
    observer.disconnect();
    resizeObserver.disconnect();
    wrap.removeEventListener('pointermove', onPointerMove);
    wrap.removeEventListener('pointerdown', onPointerMove);
    wrap.removeEventListener('pointerleave', onPointerLeave);
    material.dispose();
    texture.dispose();
    renderer.dispose();
    wrap.removeChild(renderer.domElement);
  });
});
</script>

<style scoped>
.metaballs {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: none;
}

.metaballs :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
