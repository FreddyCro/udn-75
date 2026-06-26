<template>
  <section ref="sectionRef" class="gallery">
    <!-- 隱藏的母路徑（單峰常態分佈鐘形）；getPointAtLength 取沿線座標 -->
    <svg class="path-def" viewBox="0 0 1000 1000" aria-hidden="true">
      <path ref="pathRef" :d="BELL_D" fill="none" />
    </svg>

    <div ref="stageRef" class="stage">
      <img
        v-for="(c, i) in cards"
        :key="i"
        ref="cardRefs"
        class="card"
        :src="c.src"
        :alt="c.alt"
        draggable="false"
      />
    </div>

    <div ref="counterRef" class="counter">0%</div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import face from '~/assets/img/face.png';
import einstein from '~/assets/img/einstein.png';
import glitch1 from '~/assets/img/glitch-01.jpg';
import glitch2 from '~/assets/img/glitch-02.jpg';
import glitch3 from '~/assets/img/glitch-03.jpg';

const props = defineProps({
  /** 圖片來源（字串陣列）；張數不足會自動循環填滿 count */
  images: {
    type: Array as () => string[],
    default: () => [face, einstein, glitch1, glitch2, glitch3],
  },
  /** 同時鋪在路徑上的卡片數（越多越像連續 stream） */
  count: { type: Number, default: 12 },
  /** pin 期間可捲動距離（px）；越大動得越慢 */
  pinDistance: { type: Number, default: 2000 },
  /** 端點最小縮放（路徑兩端） */
  minScale: { type: Number, default: 0.12 },
  /** 峰頂最大縮放 */
  maxScale: { type: Number, default: 1.1 },
  /** 卡片基準寬（相對 min(視窗寬高) 的比例） */
  cardWidthRatio: { type: Number, default: 0.22 },
  /** 元件寬度：路徑兩端（出現/消失點）占視窗寬的比例。1=貼齊兩側、<1=往內縮、>1=推到畫面外 */
  widthRatio: { type: Number, default: 0.9 },
  /** 每張 rotateX 的分佈上限（度）；各卡分散在 [-range, +range]，±180 = 上下鏡像 */
  rotateXRange: { type: Number, default: 180 },
  /** 每張 scaleY 的下/上限（改各自鐘形的峰高） */
  scaleYMin: { type: Number, default: 0.6 },
  scaleYMax: { type: Number, default: 1.3 },
});

// 母路徑：單峰常態分佈鐘形（左右對稱）。改這條即可調整波形。
const BELL_D =
  'M 120,591 Q 240,538 270,506 Q 300,474 330,431 Q 360,388 390,345.5 ' +
  'Q 420,303 460,276.5 Q 500,250 540,276.5 Q 580,303 610,345.5 ' +
  'Q 640,388 670,431 Q 700,474 730,506 Q 760,538 820,564.5 L 880,591';

const sectionRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
const counterRef = ref<HTMLDivElement | null>(null);
const cardRefs = ref<HTMLImageElement[]>([]);

const cards = computed(() =>
  Array.from({ length: props.count }, (_, i) => ({
    src: props.images[i % props.images.length]!,
    alt: `showcase ${i + 1}`,
  })),
);

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  const section = sectionRef.value;
  const stage = stageRef.value;
  const path = pathRef.value;
  if (!section || !stage || !path) return;

  const total = path.getTotalLength();

  // 取樣路徑量出 x / y 範圍（path 改了也自動跟著）
  let yMin = Infinity;
  let yMax = -Infinity;
  let xMin = Infinity;
  let xMax = -Infinity;
  for (let s = 0; s <= 1; s += 0.02) {
    const pp = path.getPointAtLength(s * total);
    if (pp.y < yMin) yMin = pp.y;
    if (pp.y > yMax) yMax = pp.y;
    if (pp.x < xMin) xMin = pp.x;
    if (pp.x > xMax) xMax = pp.x;
  }
  const ySpan = yMax - yMin || 1;
  const xExtent = (xMax - xMin) / 1000 || 1; // 路徑水平總寬（正規化 0..1）

  let S = 0; // 垂直 / 卡片尺寸基準（依 min(視窗寬高) 等比）
  let SX = 0; // 水平展開基準（由 widthRatio × 視窗寬 決定）
  const measure = () => {
    const w = section.clientWidth;
    S = Math.min(w, section.clientHeight) * 0.95;
    SX = (props.widthRatio * w) / xExtent; // 路徑兩端落在 ±widthRatio×寬/2
    stage.style.setProperty('--card-w', `${S * props.cardWidthRatio}px`);
  };
  measure();

  const state = { p: 0 };
  const N = props.count;

  // 每張一條不同的 path：同一條 base bell 套各自的 rotateX(θ) + scaleY。
  // θ 與 scaleY 皆「隨機」取，使相鄰路徑之間的差距不固定（非等差）。
  const DEG = Math.PI / 180;
  const cosθ: number[] = []; // rotateX 的 cos（=垂直 scaleY；負值=上下鏡像、0=俯視收成一線）
  const sclY: number[] = []; // 各自的 scaleY（峰高）
  for (let i = 0; i < N; i++) {
    const theta = (Math.random() * 2 - 1) * props.rotateXRange * DEG; // 隨機 θ ∈ [-range, +range]
    cosθ[i] = Math.cos(theta);
    sclY[i] = props.scaleYMin + Math.random() * (props.scaleYMax - props.scaleYMin); // 隨機峰高
  }

  const render = () => {
    const els = cardRefs.value;
    for (let i = 0; i < N; i++) {
      const el = els[i];
      if (!el) continue;
      const t = (i / N + state.p) % 1; // 輸送帶：每張各自的相位 + 全域進度（左 → 右）
      const pt = path.getPointAtLength(t * total);
      const c = cosθ[i]!;
      // rotateX（正交投影）：軌跡 Y 乘 cosθ → 同一條 bell 被垂直壓縮/翻轉成各自路徑
      const hx = (pt.x - 500) / 1000; // 水平不受 rotateX 影響
      const hy = ((pt.y - 500) / 1000) * sclY[i]! * c; // scaleY 峰高 × rotateX 垂直翻轉
      const heightFactor = (yMax - pt.y) / ySpan; // 0=端、1=峰
      const vs =
        props.minScale + (props.maxScale - props.minScale) * heightFactor;
      el.style.left = `calc(50% + ${hx * SX}px)`;
      el.style.top = `calc(50% + ${hy * S}px)`;
      // 只有 path（hy 乘 cosθ）會 rotate；圖片本身保持正立，不壓縮/翻轉
      el.style.transform = `translate(-50%, -50%) scale(${vs})`;
      el.style.zIndex = String(Math.round(vs * 100));
      el.style.opacity = String(Math.min(1, heightFactor * 2.4)); // 端點淡出，藏接縫
    }
    if (counterRef.value) {
      counterRef.value.textContent = `${Math.round(state.p * 100)}%`;
    }
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${props.pinDistance}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.to(state, { p: 1, ease: 'none', onUpdate: render });

  render(); // 初始定位

  const onRefresh = () => {
    measure();
    render();
  };
  ScrollTrigger.addEventListener('refreshInit', onRefresh);

  onBeforeUnmount(() => {
    ScrollTrigger.removeEventListener('refreshInit', onRefresh);
    tl.scrollTrigger?.kill();
    tl.kill();
  });
});
</script>

<style>
.gallery {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* 隱藏母路徑，但保留幾何可量測（不可用 display:none） */
.path-def {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: visible;
  opacity: 0;
  pointer-events: none;
}

.stage {
  position: absolute;
  inset: 0;
}

.card {
  position: absolute;
  width: var(--card-w, 240px);
  height: auto;
  border-radius: 10px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  will-change: transform, opacity;
  user-select: none;
}

.counter {
  position: absolute;
  right: 32px;
  bottom: 28px;
  z-index: 9999;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #b6f24a;
  pointer-events: none;
}

path {
  stroke: #fff;
}
</style>
