<template>
  <div ref="wrapRef" class="stage" />
</template>

<script setup lang="ts">
// @ts-nocheck
import * as THREE from 'three';
import { gsap } from 'gsap';

const wrapRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const wrap = wrapRef.value;
  if (!wrap) return;
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  wrap.appendChild(renderer.domElement);

  // ---------- mouse (world coords on z=0 plane) ----------
  const mouse = new THREE.Vector3(9999, 9999, 0);
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  const onMove = (e: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) mouse.copy(hit);
  };
  const onLeave = () => mouse.set(9999, 9999, 0);
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerleave', onLeave);

  // ============================================================
  // PART 1 — network nodes + lines
  // ============================================================
  const NODE_COUNT = 80;
  const LINK_DIST = 90;
  const SPREAD_X = 520;
  const SPREAD_Y = 260;
  const SPREAD_Z = 80;

  const PALETTE = [
    [0x0E, 0x9D, 0xA8],
    [0x2B, 0xCF, 0xE0],
    [0x4F, 0xB8, 0xC4],
    [0x7A, 0xD9, 0xDE],
    [0xB9, 0xEF, 0xEC],
    [0x0D, 0x5A, 0x6F],
  ].map(([r, g, b]) => [r! / 255, g! / 255, b! / 255]);

  const fillRandomColorsAndSizes = (
    count: number,
    sizeMin: number,
    sizeMax: number,
  ) => {
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
      colors[i * 3] = c[0]!;
      colors[i * 3 + 1] = c[1]!;
      colors[i * 3 + 2] = c[2]!;
      sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
    }
    return { colors, sizes };
  };

  const nodeBase = new Float32Array(NODE_COUNT * 3);
  const nodePos = new Float32Array(NODE_COUNT * 3);
  const nodeVel = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    const i3 = i * 3;
    nodeBase[i3] = (Math.random() - 0.5) * SPREAD_X;
    nodeBase[i3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
    nodeBase[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
    nodePos[i3] = nodeBase[i3];
    nodePos[i3 + 1] = nodeBase[i3 + 1];
    nodePos[i3 + 2] = nodeBase[i3 + 2];
    nodeVel[i3] = (Math.random() - 0.5) * 0.15;
    nodeVel[i3 + 1] = (Math.random() - 0.5) * 0.15;
    nodeVel[i3 + 2] = (Math.random() - 0.5) * 0.05;
  }

  const nodeGeom = new THREE.BufferGeometry();
  nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  const nodeReveal = new Float32Array(NODE_COUNT);
  for (let i = 0; i < NODE_COUNT; i++) nodeReveal[i] = i / NODE_COUNT;
  nodeGeom.setAttribute('aReveal', new THREE.BufferAttribute(nodeReveal, 1));
  const nodeAttrs = fillRandomColorsAndSizes(NODE_COUNT, 2, 18);
  nodeGeom.setAttribute('aColor', new THREE.BufferAttribute(nodeAttrs.colors, 3));
  nodeGeom.setAttribute('aSize', new THREE.BufferAttribute(nodeAttrs.sizes, 1));

  const nodeMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: /* glsl */ `
      attribute float aReveal;
      attribute vec3 aColor;
      attribute float aSize;
      uniform float uProgress;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        float reveal = smoothstep(aReveal, aReveal + 0.15, uProgress);
        vAlpha = reveal;
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float breath = 1.0 + 0.25 * sin(uTime * 1.6 + aSize * 7.0);
        gl_PointSize = aSize * breath * reveal * uPixelRatio * (300.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float edge = smoothstep(0.5, 0.35, d);
        gl_FragColor = vec4(vColor, edge * vAlpha);
      }
    `,
  });

  const nodes = new THREE.Points(nodeGeom, nodeMat);
  scene.add(nodes);

  const maxLinks = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linkPos = new Float32Array(maxLinks * 2 * 3);
  const linkGeom = new THREE.BufferGeometry();
  linkGeom.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
  const linkMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });
  const links = new THREE.LineSegments(linkGeom, linkMat);
  scene.add(links);

  // ============================================================
  // PART 2 — "75" particles
  // ============================================================
  const sampleText = (text: string): number[] => {
    const c = document.createElement('canvas');
    const W = 1024;
    const H = 512;
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 380px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, W / 2, H / 2);
    const data = ctx.getImageData(0, 0, W, H).data;
    const pts: number[] = [];
    const step = 4;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const idx = (y * W + x) * 4;
        if ((data[idx] ?? 0) > 128) {
          pts.push((x - W / 2) * 0.6, -(y - H / 2) * 0.6, (Math.random() - 0.5) * 20);
        }
      }
    }
    return pts;
  };

  const raw = sampleText('75');
  const TEXT_COUNT = raw.length / 3;
  const textTarget = new Float32Array(raw);
  const textStart = new Float32Array(raw.length);
  const textOrder = new Float32Array(TEXT_COUNT);

  // draw-order by x so reveal feels like left-to-right strokes
  const indices = Array.from({ length: TEXT_COUNT }, (_, i) => i);
  indices.sort((a, b) => (textTarget[a * 3] ?? 0) - (textTarget[b * 3] ?? 0));
  for (let rank = 0; rank < TEXT_COUNT; rank++) {
    const i = indices[rank] ?? 0;
    textOrder[i] = rank / TEXT_COUNT;
    const a = Math.random() * Math.PI * 2;
    const r = 60 + Math.random() * 40;
    const tx = textTarget[i * 3] ?? 0;
    const ty = textTarget[i * 3 + 1] ?? 0;
    const tz = textTarget[i * 3 + 2] ?? 0;
    textStart[i * 3] = tx + Math.cos(a) * r;
    textStart[i * 3 + 1] = ty + Math.sin(a) * r;
    textStart[i * 3 + 2] = tz;
  }

  const textGeom = new THREE.BufferGeometry();
  textGeom.setAttribute('position', new THREE.BufferAttribute(textStart.slice(), 3));
  textGeom.setAttribute('aTarget', new THREE.BufferAttribute(textTarget, 3));
  textGeom.setAttribute('aStart', new THREE.BufferAttribute(textStart, 3));
  textGeom.setAttribute('aOrder', new THREE.BufferAttribute(textOrder, 1));
  const textAttrs = fillRandomColorsAndSizes(TEXT_COUNT, 0.8, 6.0);
  textGeom.setAttribute('aColor', new THREE.BufferAttribute(textAttrs.colors, 3));
  textGeom.setAttribute('aSize', new THREE.BufferAttribute(textAttrs.sizes, 1));

  const textMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aTarget;
      attribute vec3 aStart;
      attribute float aOrder;
      attribute vec3 aColor;
      attribute float aSize;
      uniform float uProgress;
      uniform float uTime;
      uniform vec3 uMouse;
      uniform float uPixelRatio;
      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        float local = smoothstep(aOrder, aOrder + 0.1, uProgress);
        vec3 pos = mix(aStart, aTarget, local);

        vec3 toMouse = pos - uMouse;
        float d = length(toMouse.xy);
        float force = smoothstep(120.0, 0.0, d);
        pos.xy += normalize(toMouse.xy + 0.0001) * force * 60.0;

        vAlpha = local;
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        float breath = 1.0 + 0.3 * sin(uTime * 2.0 + aSize * 9.0);
        gl_PointSize = aSize * breath * uPixelRatio * (300.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        if (length(c) > 0.5) discard;
        gl_FragColor = vec4(vColor, vAlpha);
      }
    `,
  });

  const textPoints = new THREE.Points(textGeom, textMat);
  scene.add(textPoints);

  gsap.to(nodeMat.uniforms.uProgress, { value: 1, duration: 2.5, ease: 'power2.out' });
  gsap.to(linkMat, { opacity: 0.25, duration: 2.5, delay: 0.5 });
  gsap.to(textMat.uniforms.uProgress!, { value: 1, duration: 3, delay: 0.5, ease: 'power2.inOut' });

  const clock = new THREE.Clock();
  let raf = 0;

  const animate = () => {
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();
    nodeMat.uniforms.uTime!.value = t;
    textMat.uniforms.uTime!.value = t;
    textMat.uniforms.uMouse!.value.copy(mouse);

    const pa = nodeGeom.attributes.position.array as Float32Array;
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      let x = pa[i3] + nodeVel[i3] * dt * 60;
      let y = pa[i3 + 1] + nodeVel[i3 + 1] * dt * 60;
      let z = pa[i3 + 2] + nodeVel[i3 + 2] * dt * 60;

      x += (nodeBase[i3] - x) * 0.005;
      y += (nodeBase[i3 + 1] - y) * 0.005;
      z += (nodeBase[i3 + 2] - z) * 0.005;

      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 140 * 140) {
        const d = Math.sqrt(dist2) + 0.001;
        const f = (1 - d / 140) * 4;
        x += (dx / d) * f;
        y += (dy / d) * f;
      }

      pa[i3] = x;
      pa[i3 + 1] = y;
      pa[i3 + 2] = z;
    }
    nodeGeom.attributes.position.needsUpdate = true;

    const la = linkGeom.attributes.position.array as Float32Array;
    let lp = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = pa[i * 3];
      const iy = pa[i * 3 + 1];
      const iz = pa[i * 3 + 2];
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pa[j * 3] - ix;
        const dy = pa[j * 3 + 1] - iy;
        const dz = pa[j * 3 + 2] - iz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < LINK_DIST * LINK_DIST) {
          la[lp++] = ix;
          la[lp++] = iy;
          la[lp++] = iz;
          la[lp++] = pa[j * 3];
          la[lp++] = pa[j * 3 + 1];
          la[lp++] = pa[j * 3 + 2];
        }
      }
    }
    linkGeom.setDrawRange(0, lp / 3);
    linkGeom.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  // resize
  const onResize = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    renderer.domElement.removeEventListener('pointermove', onMove);
    renderer.domElement.removeEventListener('pointerleave', onLeave);
    renderer.dispose();
    nodeGeom.dispose();
    linkGeom.dispose();
    textGeom.dispose();
    nodeMat.dispose();
    linkMat.dispose();
    textMat.dispose();
    wrap.removeChild(renderer.domElement);
  });
});
</script>

<style scoped>
.stage {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  cursor: crosshair;
}
</style>
