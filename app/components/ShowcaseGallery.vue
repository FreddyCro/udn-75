<template>
  <section ref="sectionRef" class="showcase-gallery">
    <!-- 隱藏的母路徑（單峰常態分佈鐘形）；getPointAtLength 取沿線座標 -->
    <svg class="showcase-gallery__path-def" viewBox="0 0 1000 1000" aria-hidden="true">
      <path ref="pathRef" :d="BELL_D" fill="none" />
    </svg>

    <div ref="stageRef" class="showcase-gallery__stage">
      <div
        v-for="(c, i) in cards"
        :key="i"
        ref="cardRefs"
        class="showcase-gallery__card"
        :style="{ width: `${(c.w / designW) * 100}%`, aspectRatio: `${c.w} / ${c.h}` }"
      >
        <UPic
          v-if="c.src"
          :src="c.src"
          :use-prefix="false"
          :srcset="['mob']"
          classname="showcase-gallery__img"
          :alt="c.alt ?? ''"
        />
        <!-- 【測試用】左上角白底黑字的順序編號，僅供確認卡片排序／滾動方向；
             正式上線時把 DEBUG_SHOW_INDEX 設為 false（或整段連同樣式一起刪除） -->
        <span v-if="DEBUG_SHOW_INDEX" class="showcase-gallery__card-index">
          {{ i + 1 }}
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/** 單張卡片：設計稿尺寸（px @1280 stage）＋（可選）正式素材 */
export interface ShowcaseSlide {
  w: number;
  h: number;
  src?: string;
  alt?: string;
}

// 「綁滾動多圖輪播」正式素材 udn75_pic30_01~15：寬度沿用設計稿的大小分佈（94~273 @1280 stage），
// 高度依各圖實際比例（3:2 / 4:5 / 1:1）換算，避免 cover 裁切
// （module scope：defineProps 的 default 會被 hoist，不能引用 setup 區域變數）
const DESIGN_SLIDES: ShowcaseSlide[] = [
  { w: 273, h: 182, src: '/img/data/udn75_pic30_01' },
  { w: 208, h: 139, src: '/img/data/udn75_pic30_02' },
  { w: 241, h: 161, src: '/img/data/udn75_pic30_03' },
  { w: 173, h: 216, src: '/img/data/udn75_pic30_04' },
  { w: 237, h: 158, src: '/img/data/udn75_pic30_05' },
  { w: 141, h: 141, src: '/img/data/udn75_pic30_06' },
  { w: 214, h: 143, src: '/img/data/udn75_pic30_07' },
  { w: 94, h: 94, src: '/img/data/udn75_pic30_08' },
  { w: 241, h: 161, src: '/img/data/udn75_pic30_09' },
  { w: 190, h: 127, src: '/img/data/udn75_pic30_10' },
  { w: 273, h: 182, src: '/img/data/udn75_pic30_11' },
  { w: 161, h: 201, src: '/img/data/udn75_pic30_12' },
  { w: 225, h: 150, src: '/img/data/udn75_pic30_13' },
  { w: 120, h: 120, src: '/img/data/udn75_pic30_14' },
  { w: 173, h: 173, src: '/img/data/udn75_pic30_15' },
];
</script>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const props = defineProps({
  /** 卡片清單（設計稿尺寸＋素材）；張數不足會自動循環填滿 count */
  slides: {
    type: Array as () => ShowcaseSlide[],
    default: () => DESIGN_SLIDES,
  },
  /** 同時鋪在路徑上的卡片數（越多越像連續 stream） */
  count: { type: Number, default: 15 },
  /** pin 期間可捲動距離（px）；越大動得越慢 */
  pinDistance: { type: Number, default: 2000 },
  /** 端點最小縮放（路徑兩端） */
  minScale: { type: Number, default: 0.3 },
  /** 峰頂最大縮放 */
  maxScale: { type: Number, default: 1.1 },
  /** 元件寬度：路徑兩端（出現/消失點）占視窗寬的比例。1=貼齊兩側、<1=往內縮、>1=推到畫面外 */
  widthRatio: { type: Number, default: 0.9 },
  /** 每張 rotateX 的分佈上限（度）；各卡分散在 [-range, +range]，±180 = 上下鏡像 */
  rotateXRange: { type: Number, default: 180 },
  /** 每張 scaleY 的下/上限（改各自鐘形的峰高） */
  scaleYMin: { type: Number, default: 0.6 },
  scaleYMax: { type: Number, default: 1.3 },
});

// 【測試用】顯示每張卡片左上角的順序編號；不需要時改成 false 即可拿掉
const DEBUG_SHOW_INDEX = true;

/** 設計稿 stage 寬（卡片尺寸以此換算為 %） */
const DESIGN_W = 1280;

// 母路徑：單峰常態分佈鐘形（左右對稱）。改這條即可調整波形。
const BELL_D =
  'M 120,591 Q 240,538 270,506 Q 300,474 330,431 Q 360,388 390,345.5 ' +
  'Q 420,303 460,276.5 Q 500,250 540,276.5 Q 580,303 610,345.5 ' +
  'Q 640,388 670,431 Q 700,474 730,506 Q 760,538 820,564.5 L 880,591';

const sectionRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
const cardRefs = ref<HTMLDivElement[]>([]);

// 卡片相對尺寸的分母：pad / mob 稿卡片占視窗比例放大
//（pc 241/1280≈19%、pad 333/768≈43%、mob 214/414≈52%），measure() 依斷點更新
const designW = ref(DESIGN_W);

const cards = computed(() =>
  Array.from(
    { length: props.count },
    (_, i) => props.slides[i % props.slides.length]!,
  ),
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

  let S = 0; // 垂直基準（依 min(視窗寬高) 等比）
  let SX = 0; // 水平展開基準（由 widthRatio × 視窗寬 決定）
  const measure = () => {
    const w = section.clientWidth;
    // pad / mob 稿：卡片放大、路徑向視窗外擴（群組寬 pc 903/1280、
    // pad 1246/768、mob 800/414），垂直振幅同步放大
    const isMob = window.matchMedia('(max-width: 767.98px)').matches;
    const isPad = !isMob && window.matchMedia('(max-width: 1279.98px)').matches;
    designW.value = isMob ? 467 : isPad ? 556 : DESIGN_W;
    const spread = isMob ? 2.7 : isPad ? 2.3 : 1;
    const vScale = isMob ? 1.55 : isPad ? 1.3 : 1;
    S = Math.min(w, section.clientHeight) * 0.95 * vScale;
    SX = (props.widthRatio * spread * w) / xExtent; // 路徑兩端落在 ±widthRatio×spread×寬/2
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
      const t = (i / N - state.p + 1) % 1; // 輸送帶：每張各自的相位 − 全域進度（右 → 左）
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
      // 只有 path（hy 乘 cosθ）會 rotate；卡片本身保持正立，不壓縮/翻轉
      el.style.transform = `translate(-50%, -50%) scale(${vs})`;
      el.style.zIndex = String(Math.round(vs * 100));
      el.style.opacity = String(Math.min(1, heightFactor * 2.4)); // 端點淡出，藏接縫
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

<style lang="scss" scoped>
.showcase-gallery {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

// 隱藏母路徑，但保留幾何可量測（不可用 display:none）
.showcase-gallery__path-def {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: visible;
  opacity: 0;
  pointer-events: none;

  path {
    stroke: #fff;
  }
}

.showcase-gallery__stage {
  position: absolute;
  inset: 0;
}

// 灰底為圖片載入前的 backdrop（尺寸依設計稿）
.showcase-gallery__card {
  position: absolute;
  overflow: hidden;
  background: #d9d9d9;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.2));
  will-change: transform, opacity;
  user-select: none;

  // UPic 輸出 picture > img，兩層都撐滿卡片（覆蓋 .u-pic-img 的 height: auto）
  :deep(.u-pic) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(.showcase-gallery__img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 【測試用】卡片左上角的順序編號；不需要時連同 template 內的 DEBUG_SHOW_INDEX 區塊一起刪除
.showcase-gallery__card-index {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 2px 6px;
  background: #fff;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  pointer-events: none;
}
</style>
