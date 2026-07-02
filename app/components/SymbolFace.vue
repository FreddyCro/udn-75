<template>
  <div ref="wrapRef" class="stage">
    <button class="go" @click="dispersed = !dispersed">
      {{ dispersed ? '集合' : '分散' }}
    </button>
    <!-- 彩蛋：定位/透明度由 JS 每幀控制；內容走 slot（預設純文字） -->
    <div ref="eggRef" class="egg" aria-hidden="true">
      <slot name="phrase" :index="activeEgg" :text="displayText">
        {{ displayText }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import * as THREE from 'three';
import { gsap } from 'gsap';
import portraitUrl from '~/assets/img/face.png';
// import portraitUrl from '~/assets/img/einstein.png';

const props = defineProps({
  /** 人像圖片（需含透明背景，alpha 即輪廓遮罩） */
  src: { type: String, default: portraitUrl },
  /** 符號字元集（設計稿定案前先用範例集） */
  chars: {
    type: Array as () => string[],
    default: () => ['M', 'F', 'O', 'A', 'B', 'I', '7', '5'],
  },
  /** 顏色：單色字串，或多色標漸層陣列（如 ['#000','#77c6e0','#fff']），依 colorMode 取色 */
  color: {
    type: [String, Array] as () => string | string[],
    default: '#88beef',
  },
  /** 漸層取色方式：'tone' 依明暗對應（暗→左端、亮→右端）/ 'random' 每顆隨機取色 */
  colorMode: { type: String, default: 'tone' },
  /** 採樣間距（px），越小越密 */
  sampleStep: { type: Number, default: 6 },
  /** 目標框寬（world 單位）：圖以 contain 方式塞入，正規化 render 大小 */
  fitWidth: { type: Number, default: 500 },
  /** 目標框高（world 單位）：圖以 contain 方式塞入，正規化 render 大小 */
  fitHeight: { type: Number, default: 500 },
  /** 貼合後的額外縮放倍率（手動微調用；1 = 純貼合目標框） */
  worldScale: { type: Number, default: 1.0 },
  /** 亮部最低採樣機率（0 會讓亮部完全消失） */
  minDensity: { type: Number, default: 0.8 },
  /** 暗度 → 機率的 gamma，越大暗部對比越強 */
  densityGamma: { type: Number, default: 2.0 },
  /** 暗度增益，放大中間調的明暗差（對比強度） */
  darkBoost: { type: Number, default: 1.8 },
  sizeMin: { type: Number, default: 18 },
  sizeMax: { type: Number, default: 36 },
  /** 粒子數上限（行動裝置可降）；慣性物理在 CPU 端積分，原型先降到 6000 確認效能/手感 */
  maxParticles: { type: Number, default: 6000 },

  // ---------- 場景 / 動畫節奏 ----------
  /** 背景色 */
  bgColor: { type: String, default: '#ffffff' },
  /** 組合（reveal）動畫秒數 */
  revealDuration: { type: Number, default: 3 },
  /** 散場（disperse）動畫秒數 */
  disperseDuration: { type: Number, default: 2.2 },
  /** 散場擴散範圍 [x, y, z] */
  disperseSpread: {
    type: Array as () => number[],
    default: () => [900, 520, 240],
  },

  // ---------- 無互動時的整體漂浮 ----------
  /** 整體漂浮幅度（全部 symbol 同步隨機遊走，做出「整片在飄」） */
  floatAmp: { type: Number, default: 22 },
  /** 每顆 symbol 額外微擾幅度（organic 感） */
  floatMicro: { type: Number, default: 4 },
  /** 漂浮速度倍率 */
  floatSpeed: { type: Number, default: 1.0 },

  // ---------- 滑鼠真空（斥力） ----------
  /** 真空半徑：游標圈內完全清空 */
  holeRadius: { type: Number, default: 90 },
  /** 擴散範圍：圈外再延伸多遠做遞減外推（柔化邊界、擴散到周圍） */
  holeSpread: { type: Number, default: 140 },

  // ---------- 慣性物理（動量 + 指數 ease 回位；撞散→帶動量四散→平順歸位，不 overshoot） ----------
  // 對照 LIU_FEEDBACK_2 #2-3：脫離「果凍感」＝回位改「指數 ease」而非彈簧力
  // （彈簧回復力加到速度會 overshoot→bounce＝果凍）。參考 codepen BaxvVdJ：
  // x += (vx *= friction) + (origin - x) * ease —— 速度只保留動量（往外散），位置直接對原位做 lerp（單調趨近）。
  /** 回位速率（1/秒）：對原位做指數 ease；越大回得越快，但始終單調趨近、不 overshoot。越小＝回彈更慢更遠、更散 */
  returnEase: { type: Number, default: 2.5 },
  /** 動量衰減 friction（1/秒）：速度每幀 ×exp(-friction·dt)。越小越「滑」、滯空越久越散；越大越快靜止 */
  friction: { type: Number, default: 1.8 },
  /** 游標外推力道：越大洞越大、撞得越開 */
  impulseStrength: { type: Number, default: 6000 },
  /** 撞散方向發散角（弧度）：0=整齊徑向放射；越大每顆旋轉固定隨機角 → 炸裂不規則四散 */
  impulseSpray: { type: Number, default: 0.9 },
  /** z 方向散射倍率：撞散時往鏡頭前後散開的立體炸開感（維持人臉平面感，宜小） */
  impulseSprayZ: { type: Number, default: 0.6 },
  /** 沿游標移動方向甩出的比例：拖曳時粒子順移動方向飛濺（0=只有徑向斥力） */
  velocityFollow: { type: Number, default: 0.35 },
  /** 粒子速度上限（world 單位/秒）：friction 值偏低（動量保留高）時避免無限加速、維持炸裂又穩定 */
  maxSpeed: { type: Number, default: 2600 },

  // ---------- 整體避讓（symbol 群閃避游標） ----------
  /** 游標越遠，整群往反方向（遠離游標）位移的最大量（微微一動） */
  groupShift: { type: Number, default: 11 },
  /** 此距離內（游標貼近/重疊群中心）不位移，以保留中心環形真空 */
  groupShiftNear: { type: Number, default: 120 },
  /** 游標離群中心到此距離時達最大位移、之後停住 */
  groupShiftFar: { type: Number, default: 380 },
  /** 滑鼠互動平滑速度：越大越跟手、越小越柔（進入/移動/離開都會緩動，不瞬移） */
  mouseEase: { type: Number, default: 8 },
  /** 自動游標：無 hover 環境（手機）以虛擬游標在人像內隨機遊走，沿用真空/避讓效果 */
  autoMouse: { type: Boolean, default: false },
  /** 自動游標遊走速度倍率 */
  autoMouseSpeed: { type: Number, default: 1.0 },

  // ---------- 彩蛋：宮格 → 句子 ----------
  /** 句子陣列：index 以 row-major 對應宮格（空字串或不足格數的格子不顯示） */
  phrases: {
    type: Array as () => string[],
    default: () => ['1', '2', '3', '4', '5', '6'],
  },
  /** 宮格欄數（橫向切幾格） */
  gridCols: { type: Number, default: 3 },
  /** 宮格列數（縱向切幾格） */
  gridRows: { type: Number, default: 2 },
  /** 彩蛋文字顏色 */
  phraseColor: { type: String, default: '#ffffff' },
});

const wrapRef = ref<HTMLDivElement | null>(null);
const eggRef = ref<HTMLDivElement | null>(null);
// 目前游標所在宮格 index（-1 = 無），只在換格時更新 → slot 內容僅換格才 re-render
const activeEgg = ref(-1);

// 彩蛋切換時的「亂碼跑動」出現動畫：activeEgg 換格時，文字由隨機字元逐步落定成句子，
// 讓「切換到另一則彩蛋」更明顯。displayText 取代直接顯示 phrases[activeEgg]。
const displayText = ref('');
const GLITCH_CHARS = 'AMFOBI7501<>/\\[]{}#%&@十人工智慧能力未來';
const SCRAMBLE_MS = 480;
let scrambleRaf = 0;
const runScramble = (target: string) => {
  cancelAnimationFrame(scrambleRaf);
  if (!target) {
    displayText.value = '';
    return;
  }
  const startT = performance.now();
  const tick = (nowT: number) => {
    const p = Math.min((nowT - startT) / SCRAMBLE_MS, 1);
    const revealed = Math.floor(p * target.length); // 由左到右逐字落定
    let s = '';
    for (let i = 0; i < target.length; i++) {
      const ch = target[i]!;
      s +=
        i < revealed || ch === ' '
          ? ch
          : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    displayText.value = s;
    if (p < 1) scrambleRaf = requestAnimationFrame(tick);
    else displayText.value = target;
  };
  scrambleRaf = requestAnimationFrame(tick);
};
watch(activeEgg, (idx) => {
  runScramble(idx >= 0 ? (props.phrases[idx] ?? '') : '');
});
onBeforeUnmount(() => cancelAnimationFrame(scrambleRaf));
// 兩種狀態：false = 集合（人像）/ true = 分散（散場漂浮）。
// v-model 由父層決定預設值並隨意切換；元件內按鈕也只是翻轉它。
const dispersed = defineModel<boolean>('dispersed', { default: false });
let disperseFn: ((animated?: boolean) => void) | null = null;

// 狀態改變時，可逆地補間 uDisperse（0↔1）
watch(dispersed, () => disperseFn?.(true));

// 把字元集畫成 sprite sheet，fragment shader 以 gl_PointCoord + cell offset 取樣
const makeGlyphAtlas = (chars: string[]) => {
  const cell = 64;
  const cols = Math.ceil(Math.sqrt(chars.length));
  const rows = Math.ceil(chars.length / cols);
  const c = document.createElement('canvas');
  c.width = cols * cell;
  c.height = rows * cell;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${cell * 0.78}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  chars.forEach((ch, i) => {
    const cx = (i % cols) * cell + cell / 2;
    const cy = Math.floor(i / cols) * cell + cell / 2;
    ctx.fillText(ch, cx, cy);
  });
  const texture = new THREE.CanvasTexture(c);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return { texture, cols, rows };
};

// 把單色/多色標漸層畫成 1D 漸層貼圖，shader 以 vT 取色
const makeColorRamp = (color: string | string[]) => {
  const stops = Array.isArray(color) ? color : [color];
  const w = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = 1;
  const ctx = c.getContext('2d')!;
  if (stops.length === 1) {
    ctx.fillStyle = stops[0]!;
    ctx.fillRect(0, 0, w, 1);
  } else {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, 1);
  }
  const texture = new THREE.CanvasTexture(c);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

onMounted(() => {
  const wrap = wrapRef.value;
  if (!wrap) return;
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(props.bgColor);

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  wrap.appendChild(renderer.domElement);

  // ---------- mouse (world coords on z=0 plane) ----------
  const mouse = new THREE.Vector3(9999, 9999, 0); // 原始目標（最後命中點）
  const smoothMouse = new THREE.Vector3(9999, 9999, 0); // 緩動後餵給 shader 的座標
  let targetInfluence = 0; // 目標影響強度（進入=1 / 離開=0）
  let influence = 0; // 緩動後的影響強度，shader 以此淡入淡出整段互動
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  const onMove = (e: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      mouse.copy(hit);
      targetInfluence = 1;
    }
  };
  // 離開只把影響淡出，不把座標拉回 9999（否則真空會橫掃到角落）
  const onLeave = () => {
    targetInfluence = 0;
  };
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerleave', onLeave);

  const atlas = makeGlyphAtlas(props.chars);
  const colorRamp = makeColorRamp(props.color);

  let geom: THREE.BufferGeometry | null = null;
  let mat: THREE.ShaderMaterial | null = null;
  let unmounted = false;
  // ---- 慣性物理狀態（buildFromImage 建立；animate 每幀積分後寫回 aDisp）----
  let dispArr: Float32Array | null = null; // 相對 formation 的附加位移
  let velArr: Float32Array | null = null; // 對應速度
  let targetArr: Float32Array | null = null; // formation 座標（命中測試用）
  let seedArr: Float32Array | null = null; // 每顆隨機種子（impulse 發散角／z 散射用）
  let dispAttr: THREE.BufferAttribute | null = null;
  let pCount = 0;
  // 人像半寬高 + 自動游標遊走半徑（buildFromImage 依人像實際範圍設定）
  let halfW = 0;
  let halfH = 0;
  let roamX = 150;
  let roamY = 150;

  // ---------- 圖片亮度採樣：暗密亮疏、暗大亮小 ----------
  const buildFromImage = (img: HTMLImageElement) => {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, W, H).data;

    // contain-fit：把圖（W×H）等比例塞進目標框（fitWidth×fitHeight），正規化 render 大小，
    // 與圖片解析度、視窗 aspect 脫鉤（換圖不爆框）
    const scale =
      Math.min(props.fitWidth / W, props.fitHeight / H) * props.worldScale;
    // 人像置中於原點，半寬高 = W*scale/2、H*scale/2；自動游標在 ~70% 內遊走
    halfW = (W * scale) / 2;
    halfH = (H * scale) / 2;
    roamX = halfW * 0.7;
    roamY = halfH * 0.7;
    const positions: number[] = [];
    const sizes: number[] = [];
    const darks: number[] = [];
    const step = props.sampleStep;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        // 整格平均，比單點採樣穩定（鉛筆稿紋理噪點大）
        let lumSum = 0;
        let aSum = 0;
        let n = 0;
        for (let dy = 0; dy < step && y + dy < H; dy++) {
          for (let dx = 0; dx < step && x + dx < W; dx++) {
            const i = ((y + dy) * W + (x + dx)) * 4;
            lumSum +=
              (0.299 * (data[i] ?? 0) +
                0.587 * (data[i + 1] ?? 0) +
                0.114 * (data[i + 2] ?? 0)) /
              255;
            aSum += (data[i + 3] ?? 0) / 255;
            n++;
          }
        }
        const a = aSum / n;
        if (a < 0.5) continue; // 透明背景 = 輪廓外
        const dark = Math.min(1, (1 - lumSum / n) * props.darkBoost);
        const prob =
          (props.minDensity +
            (1 - props.minDensity) * Math.pow(dark, props.densityGamma)) *
          a;
        if (Math.random() > prob) continue;
        positions.push(
          (x - W / 2) * scale,
          -(y - H / 2) * scale,
          (Math.random() - 0.5) * 8,
        );
        sizes.push(props.sizeMin + (props.sizeMax - props.sizeMin) * dark);
        darks.push(dark);
      }
    }

    let count = positions.length / 3;
    if (count > props.maxParticles) {
      const keep = props.maxParticles / count;
      let w = 0;
      for (let i = 0; i < count; i++) {
        if (Math.random() > keep) continue;
        positions[w * 3] = positions[i * 3]!;
        positions[w * 3 + 1] = positions[i * 3 + 1]!;
        positions[w * 3 + 2] = positions[i * 3 + 2]!;
        sizes[w] = sizes[i]!;
        darks[w] = darks[i]!;
        w++;
      }
      positions.length = w * 3;
      sizes.length = w;
      darks.length = w;
      count = w;
    }

    const target = new Float32Array(positions);
    const start = new Float32Array(count * 3);
    const floatPos = new Float32Array(count * 3);
    const order = new Float32Array(count);
    const size = new Float32Array(sizes);
    const glyph = new Float32Array(count);
    const seed = new Float32Array(count);

    const FLOAT_X = props.disperseSpread[0] ?? 900;
    const FLOAT_Y = props.disperseSpread[1] ?? 520;
    const FLOAT_Z = props.disperseSpread[2] ?? 240;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ang = Math.random() * Math.PI * 2;
      const r = 80 + Math.random() * 120;
      start[i3] = target[i3]! + Math.cos(ang) * r;
      start[i3 + 1] = target[i3 + 1]! + Math.sin(ang) * r;
      start[i3 + 2] = target[i3 + 2]!;
      floatPos[i3] = (Math.random() - 0.5) * FLOAT_X;
      floatPos[i3 + 1] = (Math.random() - 0.5) * FLOAT_Y;
      floatPos[i3 + 2] = (Math.random() - 0.5) * FLOAT_Z;
      order[i] = Math.random() * 0.85;
      glyph[i] = Math.floor(Math.random() * props.chars.length);
      seed[i] = Math.random();
    }

    geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(start.slice(), 3));
    geom.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
    geom.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geom.setAttribute('aFloat', new THREE.BufferAttribute(floatPos, 3));
    geom.setAttribute('aOrder', new THREE.BufferAttribute(order, 1));
    geom.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geom.setAttribute(
      'aDark',
      new THREE.BufferAttribute(new Float32Array(darks), 1),
    );
    geom.setAttribute('aGlyph', new THREE.BufferAttribute(glyph, 1));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

    // 慣性物理：附加位移 aDisp（初始 0），CPU 每幀積分後上傳
    dispArr = new Float32Array(count * 3);
    velArr = new Float32Array(count * 3);
    targetArr = target;
    seedArr = seed; // 與 aSeed 共用同一份（CPU 只讀）：impulse 發散用
    pCount = count;
    dispAttr = new THREE.BufferAttribute(dispArr, 3);
    dispAttr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute('aDisp', dispAttr);

    mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uDisperse: { value: 0 },
        uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
        uMouseInfluence: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uFloatAmp: { value: props.floatAmp },
        uFloatMicro: { value: props.floatMicro },
        uFloatSpeed: { value: props.floatSpeed },
        uHoleRadius: { value: props.holeRadius },
        uHoleSpread: { value: props.holeSpread },
        uGroupShift: { value: props.groupShift },
        uGroupNear: { value: props.groupShiftNear },
        uGroupFar: { value: props.groupShiftFar },
        uAtlas: { value: atlas.texture },
        uAtlasGrid: { value: new THREE.Vector2(atlas.cols, atlas.rows) },
        uGlyphCount: { value: props.chars.length },
        uColorRamp: { value: colorRamp },
        uColorRandom: { value: props.colorMode === 'random' ? 1 : 0 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aStart;
        attribute vec3 aTarget;
        attribute vec3 aFloat;
        attribute vec3 aDisp;
        attribute float aOrder;
        attribute float aSize;
        attribute float aGlyph;
        attribute float aSeed;
        attribute float aDark;
        uniform float uProgress;
        uniform float uTime;
        uniform float uDisperse;
        uniform vec3 uMouse;
        uniform float uMouseInfluence;
        uniform float uPixelRatio;
        uniform float uGlyphCount;
        uniform float uFloatAmp;
        uniform float uFloatMicro;
        uniform float uFloatSpeed;
        uniform float uHoleRadius;
        uniform float uHoleSpread;
        uniform float uGroupShift;
        uniform float uGroupNear;
        uniform float uGroupFar;
        uniform float uColorRandom;
        varying float vAlpha;
        varying float vGlyph;
        varying float vShade;
        varying float vT;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
          float local = smoothstep(aOrder, aOrder + 0.12, uProgress);
          vec3 pos = mix(aStart, aTarget, local);

          // 無互動時的整體漂浮：全粒子同步的低頻隨機遊走（不帶 seed）做出「整片在飄」，
          // 再疊一層每顆微擾（帶 seed）增加 organic 感；散場時淡出交棒給下方 drift
          float idle = local * (1.0 - uDisperse);
          float ts = uTime * uFloatSpeed;
          vec3 sway;
          sway.x = (sin(ts * 0.23) + 0.6 * sin(ts * 0.37 + 1.7)) * uFloatAmp;
          sway.y = (cos(ts * 0.19) + 0.6 * cos(ts * 0.31 + 0.5)) * uFloatAmp;
          sway.z = sin(ts * 0.15) * uFloatAmp * 0.4;
          vec3 micro;
          micro.x = sin(ts * 0.50 + aSeed * 6.2831) * uFloatMicro;
          micro.y = cos(ts * 0.44 + aSeed * 5.0)    * uFloatMicro;
          micro.z = sin(ts * 0.62 + aSeed * 3.1416) * uFloatMicro * 0.5;
          pos += (sway + micro) * idle;

          // 離場：target -> 隨機漂浮位置，並持續緩慢漂移
          vec3 drift = aFloat;
          drift.x += sin(uTime * 0.30 + aSeed * 6.2831) * 28.0;
          drift.y += cos(uTime * 0.22 + aSeed * 12.566) * 22.0;
          drift.z += sin(uTime * 0.18 + aSeed * 3.1416) * 10.0;
          pos = mix(pos, drift, uDisperse);

          // 整體避讓：以游標到群中心(原點)的距離決定整群往反方向(遠離游標)的平移量，
          // uGroupNear 內(重疊)≈0 以保留中心環形真空、到 uGroupFar 達上限即停。
          // uMouseInfluence 由 JS 緩動(進入/離開淡入淡出)；散場後關閉。
          float dCenter = length(uMouse.xy);
          float shiftAmt = uGroupShift * smoothstep(uGroupNear, uGroupFar, dCenter) * uMouseInfluence * (1.0 - uDisperse);
          pos.xy += normalize(-uMouse.xy + 0.0001) * shiftAmt;

          // 慣性位移：游標斥力/回位改由 CPU 端「動量 + 指數 ease」積分（見 animate()），
          // 結果存在 aDisp，這裡直接疊加 → 撞散後帶動量四散、再平順 ease 歸位（不 overshoot、無果凍回彈）。
          // 散場時讓位移淡出，交棒給 drift。
          pos += aDisp * (1.0 - uDisperse);

          // 隨機換字閃爍：每 1/3 秒抽一次，少數粒子暫時換成別的字元
          float tick = floor(uTime * 3.0);
          float h = hash(aSeed * 127.1 + tick * 311.7);
          vGlyph = h > 0.92 ? mod(aGlyph + floor(h * 91.0), uGlyphCount) : aGlyph;

          float twinkle = 0.82 + 0.18 * sin(uTime * 2.2 + aSeed * 40.0);
          // 亮部稍透明、暗部不透明，再疊一層深淺：對比靠 alpha + 色深 + 大小 + 密度
          vAlpha = local * twinkle * mix(0.55, 1.0, aDark) * mix(1.0, 0.5, uDisperse);
          // 取色位置：tone=依明暗(暗→漸層左端) / random=每顆隨機；色調由漸層主導，vShade 僅輕微明暗+抖動
          vT = mix(1.0 - aDark, hash(aSeed * 53.7), uColorRandom);
          vShade = mix(1.1, 0.7, aDark) * (0.92 + 0.16 * hash(aSeed * 17.7));

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float breath = 1.0 + 0.12 * sin(uTime * 2.0 + aSeed * 9.0);
          float size = aSize * mix(1.0, 0.65, uDisperse);
          gl_PointSize = size * breath * local * uPixelRatio * (300.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uAtlas;
        uniform vec2 uAtlasGrid;
        uniform sampler2D uColorRamp;
        varying float vAlpha;
        varying float vGlyph;
        varying float vShade;
        varying float vT;
        void main() {
          vec2 cell = vec2(mod(vGlyph, uAtlasGrid.x), floor(vGlyph / uAtlasGrid.x));
          vec2 uv = vec2(
            (cell.x + gl_PointCoord.x) / uAtlasGrid.x,
            1.0 - (cell.y + gl_PointCoord.y) / uAtlasGrid.y
          );
          float a = texture2D(uAtlas, uv).a * vAlpha;
          if (a < 0.02) discard;
          vec3 col = texture2D(uColorRamp, vec2(clamp(vT, 0.0, 1.0), 0.5)).rgb;
          gl_FragColor = vec4(col * vShade, a);
        }
      `,
    });

    const points = new THREE.Points(geom, mat);
    scene.add(points);
    tryReveal();

    // 依目前狀態補間到 0(集合) 或 1(分散)；animated=false 用於初始直接定位
    disperseFn = (animated = true) => {
      if (!mat) return;
      const targetVal = dispersed.value ? 1 : 0;
      gsap.killTweensOf(mat.uniforms.uDisperse);
      if (animated) {
        gsap.to(mat.uniforms.uDisperse, {
          value: targetVal,
          duration: props.disperseDuration,
          ease: 'power2.inOut',
        });
      } else {
        mat.uniforms.uDisperse.value = targetVal;
      }
    };
    disperseFn(false); // 套用初始預設狀態（不動畫）
  };

  // 進入視口且圖片採樣完成後才開始 reveal
  let inView = false;
  let revealStarted = false;
  const tryReveal = () => {
    if (!inView || !mat || revealStarted) return;
    revealStarted = true;
    gsap.to(mat.uniforms.uProgress, {
      value: 1,
      duration: props.revealDuration,
      ease: 'power2.inOut',
    });
  };
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        inView = true;
        tryReveal();
        observer.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  observer.observe(wrap);

  const img = new Image();
  img.src = props.src;
  img.onload = () => {
    if (!unmounted) buildFromImage(img);
  };

  const clock = new THREE.Clock();
  let raf = 0;
  let prevT = 0;
  // 上一幀游標位置（算游標速度 → 沿移動方向甩出粒子）；9999 = 尚未接觸
  let prevMx = 9999;
  let prevMy = 9999;
  // 彩蛋：world → 螢幕像素投影用；viewW/H 隨 resize 更新
  const proj = new THREE.Vector3();
  let viewW = width;
  let viewH = height;
  if (eggRef.value) eggRef.value.style.color = props.phraseColor;

  const animate = () => {
    const t = clock.getElapsedTime();
    const dt = Math.min(t - prevT, 0.1); // clamp 避免分頁切回時大跳
    prevT = t;
    // 自動游標：以多頻率正弦疊加做出非重複的平滑遊走，覆寫真實游標
    if (props.autoMouse) {
      const at = t * props.autoMouseSpeed;
      mouse.set(
        Math.sin(at * 0.7) * roamX * 0.6 + Math.sin(at * 0.23 + 1.3) * roamX * 0.4,
        Math.cos(at * 0.53) * roamY * 0.6 + Math.cos(at * 0.31 + 0.7) * roamY * 0.4,
        0,
      );
      targetInfluence = 1;
    }
    // 與幀率無關的指數緩動係數
    const k = 1 - Math.exp(-props.mouseEase * dt);
    if (influence < 0.001 && targetInfluence > 0) {
      smoothMouse.copy(mouse); // 首次接觸：位置直接到位，靠 influence 淡入強度（不橫掃畫面）
    } else {
      smoothMouse.lerp(mouse, k); // 移動中：座標平滑跟隨
    }
    influence += (targetInfluence - influence) * k;
    if (mat) {
      mat.uniforms.uTime!.value = t;
      mat.uniforms.uMouse!.value.copy(smoothMouse);
      mat.uniforms.uMouseInfluence!.value = influence;
    }

    // ---- 慣性物理：附加位移的「動量 + 指數 ease」積分（撞散→帶動量四散→平順歸位，不 overshoot）----
    // 每顆粒子維持 disp(位移)+vel(速度)：速度只保留動量並靠 friction 衰減（負責往外散）；
    // 位置每幀對原位(0)做指數 lerp（單調趨近、不會回彈）。游標半徑內持續注入外推速度 → 在時開洞、
    // 離開後速度衰減、位置 ease 回原位（脫離果凍感）。
    if (dispArr && velArr && targetArr && dispAttr) {
      const disp = dispArr;
      const vel = velArr;
      const tgt = targetArr;
      const seeds = seedArr;
      const velDecay = Math.exp(-props.friction * dt); // 與幀率無關的動量衰減（friction）
      const easeAmt = 1 - Math.exp(-props.returnEase * dt); // 與幀率無關的回位 lerp 係數（趨近 0）
      const hitR = props.holeRadius + props.holeSpread;
      const hitR2 = hitR * hitR;
      const canHit = !dispersed.value && influence > 0.01;
      const mx = smoothMouse.x;
      const my = smoothMouse.y;
      const kick = props.impulseStrength * influence;
      const spray = props.impulseSpray;
      const sprayZ = props.impulseSprayZ;
      const velFollow = props.velocityFollow;
      const maxV2 = props.maxSpeed * props.maxSpeed;
      // 游標移動速度（world/秒）→ 沿移動方向甩出粒子（拖曳發散）；靜止 hover 則 ≈0。
      // prevMx<9000 確保有上一幀有效座標，避免從 9999 起跳造成爆衝；並夾住上限。
      let mvx = 0;
      let mvy = 0;
      if (canHit && prevMx < 9000) {
        const idt = 1 / Math.max(dt, 1e-3);
        mvx = (mx - prevMx) * idt;
        mvy = (my - prevMy) * idt;
        const sp = Math.hypot(mvx, mvy);
        const cap = 4000;
        if (sp > cap) {
          const s = cap / sp;
          mvx *= s;
          mvy *= s;
        }
      }
      prevMx = mx;
      prevMy = my;
      for (let i = 0; i < pCount; i++) {
        const i3 = i * 3;
        // 動量：速度只做 friction 衰減，不加彈簧回復力 → 不會 overshoot/bounce（回位改由下方位置 ease 處理）
        let vx = vel[i3]! * velDecay;
        let vy = vel[i3 + 1]! * velDecay;
        let vz = vel[i3 + 2]! * velDecay;
        // 游標外推 impulse：以 formation+目前位移近似命中（idle sway 幅度小，可忽略）
        if (canHit) {
          const px = tgt[i3]! + disp[i3]! - mx;
          const py = tgt[i3 + 1]! + disp[i3 + 1]! - my;
          const d2 = px * px + py * py;
          if (d2 < hitR2) {
            const d = Math.sqrt(d2) + 0.0001;
            const falloff = 1 - d / hitR; // 近強遠弱
            const mag = kick * falloff * falloff * dt; // 速度增量量級
            // 方向：徑向外推，但每顆旋轉一個「固定」隨機角（由 seed 決定，逐幀穩定不抖），
            // 讓四散方向不規則 → 炸裂感而非整齊放射。spray=0 退回純徑向。
            const sj = seeds ? seeds[i]! : 0.5;
            const ang = (sj - 0.5) * spray;
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);
            const nx = px / d;
            const ny = py / d;
            vx += (nx * ca - ny * sa) * mag;
            vy += (nx * sa + ny * ca) * mag;
            // 沿游標移動方向甩出：拖曳時粒子順移動方向飛濺（靜止 hover 此項 ≈0）
            vx += mvx * velFollow * falloff;
            vy += mvy * velFollow * falloff;
            // z 少量散射：立體炸開（第二組偽隨機由 seed 導出，維持平面感故幅度小）
            const sj2 = Math.sin(sj * 91.7) * 0.5 + 0.5;
            vz += (sj2 - 0.5) * mag * sprayZ;
          }
        }
        // 速度上限：friction 值偏低（動量保留高）時避免持續 impulse 累積成無限加速、維持炸裂又穩定
        const v2 = vx * vx + vy * vy + vz * vz;
        if (v2 > maxV2) {
          const s = props.maxSpeed / Math.sqrt(v2);
          vx *= s;
          vy *= s;
          vz *= s;
        }
        vel[i3] = vx;
        vel[i3 + 1] = vy;
        vel[i3 + 2] = vz;
        // 位置：動量位移 + 對原位(0)做指數 ease（disp*(1-easeAmt) 單調趨近，無回彈）。
        // 等價於 reference 的 x += vx + (origin - x)*ease，這裡 origin=0（disp 是相對 formation 的位移）。
        disp[i3] = disp[i3]! * (1 - easeAmt) + vx * dt;
        disp[i3 + 1] = disp[i3 + 1]! * (1 - easeAmt) + vy * dt;
        disp[i3 + 2] = disp[i3 + 2]! * (1 - easeAmt) + vz * dt;
      }
      dispAttr.needsUpdate = true;
    }

    // 彩蛋：算游標所在宮格 → 顯示對應句子（只在集合狀態、influence 夠高時）
    const eggEl = eggRef.value;
    if (eggEl && halfW > 0) {
      let idx = -1;
      if (!dispersed.value && influence > 0.4 && props.phrases.length) {
        const nx = (smoothMouse.x + halfW) / (2 * halfW); // 0..1 左→右
        const ny = (halfH - smoothMouse.y) / (2 * halfH); // 0..1 上→下
        if (nx >= 0 && nx < 1 && ny >= 0 && ny < 1) {
          const col = Math.min(props.gridCols - 1, Math.floor(nx * props.gridCols));
          const row = Math.min(props.gridRows - 1, Math.floor(ny * props.gridRows));
          const i = row * props.gridCols + col;
          if (i < props.phrases.length && props.phrases[i]) idx = i;
        }
      }
      if (idx !== activeEgg.value) activeEgg.value = idx; // 僅換格才觸發 re-render
      if (idx >= 0) {
        proj.copy(smoothMouse).project(camera);
        const sx = (proj.x * 0.5 + 0.5) * viewW;
        const sy = (-proj.y * 0.5 + 0.5) * viewH;
        // 文字中心對齊真空中心（游標位置）：水平+垂直皆置中
        eggEl.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
        eggEl.style.opacity = String(Math.min(1, influence));
      } else {
        eggEl.style.opacity = '0';
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  const onResize = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    viewW = w;
    viewH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  onBeforeUnmount(() => {
    unmounted = true;
    observer.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    renderer.domElement.removeEventListener('pointermove', onMove);
    renderer.domElement.removeEventListener('pointerleave', onLeave);
    renderer.dispose();
    geom?.dispose();
    mat?.dispose();
    atlas.texture.dispose();
    colorRamp.dispose();
    wrap.removeChild(renderer.domElement);
  });
});
</script>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  cursor: crosshair;
}

/* 彩蛋文字：定位/透明度由 JS 每幀以 transform/opacity 控制 */
.egg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  max-width: 16em;
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.02em;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  will-change: transform, opacity;
}

.go {
  position: absolute;
  right: 32px;
  bottom: 32px;
  z-index: 1;
  padding: 12px 28px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #333;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    opacity 0.3s;
}

.go:hover:not(:disabled) {
  background: #333;
  color: #fff;
}

.go:disabled {
  opacity: 0.3;
  cursor: default;
}
</style>
