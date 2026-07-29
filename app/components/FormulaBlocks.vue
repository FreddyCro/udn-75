<script lang="ts" setup>
/**
 * FormulaBlocks — 「Publish X 議題智囊包」放射圖（news 頁）。
 * 三段式版面：pc 中央放射 2×2、pad 上下兩排＋斜向棋盤格連接、
 * mob 直排＋左側垂直棋盤格 rail（連接線為 SVG 素材）。
 */
export interface FormulaItem {
  /** 藝術字標題圖（SVG 路徑；無圖時 fallback 為 title 文字） */
  titleImg?: string;
  /** 標題文字（作為 alt 與 fallback） */
  title?: string;
  /** 列點（15px 活字） */
  points?: string[];
}

withDefaults(
  defineProps<{
    /** 中央塊：藝術字圖（img）+ 副標（title）；eyebrow 作為圖的 alt 與 fallback */
    center?: { img?: string; eyebrow?: string; title?: string };
    /** 四角格子（依序：左上、右上、左下、右下） */
    items?: FormulaItem[];
  }>(),
  {
    center: () => ({ title: '議題智囊包' }),
    items: () => [],
  },
);

const POS = ['tl', 'tr', 'bl', 'br'] as const;
// 分支線方向：tl/br 為「\」、tr/bl 鏡射為「/」；from = 靠中央塊的那端（往外畫）
const BRANCH: Record<
  (typeof POS)[number],
  { flip: boolean; from: 'start' | 'end' }
> = {
  tl: { flip: false, from: 'end' },
  tr: { flip: true, from: 'end' },
  bl: { flip: true, from: 'start' },
  br: { flip: false, from: 'start' },
};

// 進場時序（秒）：中央塊 → 四格滑出 → 分支線逐格畫 → 橘轉灰定版
const BOX_DELAY = 0.3;
const BRANCH_DELAY = 0.65;
const SETTLE_DELAY_MS = 1000;

// 三段式舞台（Figma 座標系）：斷點切換版面、<舞台寬時整體 scale
const STAGES = {
  pc: { w: 1064, h: 524 },
  pad: { w: 610, h: 600 },
  mob: { w: 360, h: 882 },
} as const;

// mob 垂直 rail（左側 x=0，依序接到四個格子；第一段接中央塊故較短）
const RAILS = [
  { src: '/img/news/udn75_news_formula_rail_01.svg', y: 156, h: 132 },
  { src: '/img/news/udn75_news_formula_rail_02.svg', y: 284, h: 180 },
  { src: '/img/news/udn75_news_formula_rail_02.svg', y: 460, h: 180 },
  { src: '/img/news/udn75_news_formula_rail_02.svg', y: 636, h: 180 },
];

const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const on = ref(false);
const settled = ref(false); // 分支線接上後四格橘轉灰
const scale = ref(1);
const mode = ref<keyof typeof STAGES>('pc');

let io: IntersectionObserver | null = null;
let settleTimer: number | undefined;

function onResize() {
  const vw = window.innerWidth;
  mode.value = vw >= PC_BREAKPOINTS ? 'pc' : vw >= TABLET_BREAKPOINTS ? 'pad' : 'mob';
  // 量 viewport（padding 內側）而非 section，縮放後才保得住左右留白
  const w = viewportRef.value?.clientWidth ?? STAGES[mode.value].w;
  scale.value = Math.min(1, w / STAGES[mode.value].w);
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    on.value = true; // 直接呈現完成態（CSS 端同時停用 animation）
    settled.value = true;
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        on.value = true;
        settleTimer = window.setTimeout(() => {
          settled.value = true;
        }, SETTLE_DELAY_MS);
        io?.disconnect();
        io = null;
      }
    },
    { threshold: 0.35 },
  );
  if (rootRef.value) io.observe(rootRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  io?.disconnect();
  window.clearTimeout(settleTimer);
});
</script>

<template>
  <section
    ref="rootRef"
    class="formula"
    :class="{ 'is-on': on, 'is-settled': settled }"
  >
    <div
      ref="viewportRef"
      class="formula__viewport"
      :style="{ height: `${STAGES[mode].h * scale}px` }"
    >
      <div class="formula__stage" :style="{ transform: `translateX(-50%) scale(${scale})` }">
        <!-- 中央 Publish X 塊 -->
        <div class="formula__center">
          <img
            v-if="center.img"
            class="formula__center-logo"
            :src="center.img"
            :alt="center.eyebrow ?? ''"
          />
          <p v-else-if="center.eyebrow" class="formula__center-eyebrow">
            {{ center.eyebrow }}
          </p>
          <p class="formula__center-title">{{ center.title }}</p>
        </div>

        <!-- pc：四條像素分支線，從中央塊角落逐格往四角畫出 -->
        <PixelBranch
          v-for="p in POS"
          :key="p"
          class="formula__branch"
          :class="`formula__branch--${p}`"
          :active="on"
          :flip="BRANCH[p].flip"
          :from="BRANCH[p].from"
          :delay="BRANCH_DELAY"
        />

        <!-- pad：上下排與中央塊之間的斜向棋盤格連接（SVG 素材） -->
        <img
          v-for="p in POS"
          :key="`link-${p}`"
          class="formula__link"
          :class="`formula__link--${p}`"
          :src="`/img/news/udn75_news_formula_link_${p}.svg`"
          alt=""
          aria-hidden="true"
        />

        <!-- mob：左側垂直棋盤格 rail，逐格接到各格子 -->
        <img
          v-for="(r, i) in RAILS"
          :key="`rail-${i}`"
          class="formula__rail"
          :src="r.src"
          :style="{ top: `${r.y}px`, height: `${r.h}px` }"
          alt=""
          aria-hidden="true"
        />

        <!-- 四角議題格子 -->
        <div
          v-for="(b, i) in items.slice(0, 4)"
          :key="i"
          class="formula__box"
          :class="`formula__box--${POS[i]}`"
          :style="{ '--delay': `${BOX_DELAY}s` }"
        >
          <p class="formula__box-head">
            <img
              v-if="b.titleImg"
              class="formula__box-logo"
              :src="b.titleImg"
              :alt="b.title ?? ''"
            />
            <span v-else>{{ b.title }}</span>
          </p>
          <ul class="formula__box-list">
            <li v-for="(pt, j) in b.points" :key="j" class="formula__box-item">
              {{ pt }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// 像素外框：4px 線、角落缺 8px 再於 4px 內縮處補一格 4px 方塊（對稿 Figma 拼法）。
// 以多重背景繪製 → 盒子寬高伸縮時線寬與角點恆為 4px，不變形。
@mixin pixel-frame($c) {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient($c, $c) left 8px top 0 / calc(100% - 16px) 4px no-repeat,
    linear-gradient($c, $c) left 8px bottom 0 / calc(100% - 16px) 4px no-repeat,
    linear-gradient($c, $c) left 0 top 8px / 4px calc(100% - 16px) no-repeat,
    linear-gradient($c, $c) right 0 top 8px / 4px calc(100% - 16px) no-repeat,
    linear-gradient($c, $c) left 4px top 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) right 4px top 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) left 4px bottom 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) right 4px bottom 4px / 4px 4px no-repeat;
}

.formula {
  width: 100%;
  padding: 24px 20px;
  background: #fff;
}

.formula__viewport {
  position: relative;
  width: 100%;
}

// 舞台依斷點定尺寸（Figma 座標系），視窗小於舞台寬時整體 scale
.formula__stage {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1064px;
  height: 524px;
  transform-origin: top center;

  @include rwd-max('pc') {
    width: 610px;
    height: 600px;
  }
  @include rwd-max('tablet') {
    width: 360px;
    height: 882px;
  }
}

// ── 中央 Publish X 塊：像素外框（橘）+ 內縮 12px 橘色填色 ──
// pad 置於兩排之間（400×172）；mob 置頂（360×160）
.formula__center {
  position: absolute;
  top: 182px;
  left: 352px;
  z-index: 1; // 高於四角格子：進場時格子自中央塊「後方」滑出
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 360px;
  height: 160px;
  opacity: 0;

  @include rwd-max('pc') {
    top: 214px;
    left: 102px;
    width: 400px;
    height: 172px;
  }
  @include rwd-max('tablet') {
    top: 0;
    left: 0;
    width: 360px;
    height: 160px;
  }

  &::before {
    @include pixel-frame(var(--color-orange));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 12px;
    z-index: 0;
    background: var(--color-orange);
  }

  .formula.is-on & {
    animation: formula-center-in 0.45s ease both;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
    }
  }
}

.formula__center-logo {
  z-index: 1;
  display: block;
  width: 257px;
  height: auto;

  @include rwd-max('pc') {
    width: 275px;
  }
  @include rwd-max('tablet') {
    width: 257px;
  }
}

.formula__center-eyebrow {
  z-index: 1;
  margin: 0;
  font-size: var(--text-h4);
  font-weight: 500;
  color: #fff;
}

.formula__center-title {
  z-index: 1;
  margin: 0;
  font-size: 24px;
  line-height: 36px;
  font-weight: 500;
  letter-spacing: 3.6px;
  text-indent: 3.6px; // 抵銷末字 letter-spacing，維持視覺置中
  color: #fff;
}

// ── pc 分支線位置（對稿 Figma：與中央塊/格子角落各斜疊 8px 對接）──
// 註：加上 .formula__stage 提高特異性，蓋過 PixelBranch 根元素自帶的
// position: relative（兩者同為單一 class，僅靠載入順序會不穩定）。
.formula__stage .formula__branch {
  position: absolute;

  &--tl {
    top: 146px;
    left: 316px;
  }
  &--tr {
    top: 146px;
    left: 704px;
  }
  &--bl {
    top: 334px;
    left: 316px;
  }
  &--br {
    top: 334px;
    left: 704px;
  }

  @include rwd-max('pc') {
    display: none;
  }
}

// ── pad 斜向棋盤格連接（76×60，跨排間 60px 縫隙）──
.formula__link {
  position: absolute;
  display: none;
  width: 76px;
  height: 60px;
  opacity: 0;

  @include rwd-max('pc') {
    display: block;
  }
  @include rwd-max('tablet') {
    display: none;
  }

  &--tl {
    top: 154px;
    left: 161px;
  }
  &--tr {
    top: 154px;
    left: 362px;
  }
  &--bl {
    top: 386px;
    left: 161px;
  }
  &--br {
    top: 386px;
    left: 362px;
  }

  .formula.is-on & {
    animation: formula-conn-in 0.01s steps(1) both;
    animation-delay: var(--conn-delay, 0.65s);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
    }
  }
}

// ── mob 左側垂直 rail（44 寬，top/height 由 template 帶入）──
.formula__rail {
  position: absolute;
  left: 0;
  display: none;
  width: 44px;
  opacity: 0;

  @include rwd-max('tablet') {
    display: block;
  }

  .formula.is-on & {
    animation: formula-conn-in 0.01s steps(1) both;
    animation-delay: var(--conn-delay, 0.65s);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
    }
  }
}

// ── 四角議題格子 ──
// 進場滑出階段為橘色態（--box-c），is-settled 後瞬間轉灰（多重背景外框無法平滑過渡）
// 尺寸：pc 324／pad 273／mob 301 寬（高一律 154）
.formula__box {
  --box-c: var(--color-orange);
  position: absolute;
  width: 324px;
  height: 154px;
  padding-top: 68px; // 列點區距格子頂（三版一致的固定值）
  opacity: 0;

  @include rwd-max('pc') {
    width: 273px;
  }
  @include rwd-max('tablet') {
    width: 301px;
  }

  &::before {
    @include pixel-frame(var(--box-c));
  }

  .formula.is-on & {
    animation: formula-box-in 0.55s ease-out both;
    animation-delay: var(--delay, 0s);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
    }
  }

  .formula.is-settled & {
    --box-c: var(--color-gray-light);
  }

  // --from-*：滑出起點（中央塊正後方）到定位點的位移量。
  // 貼齊四角的定位 pc/pad 通用（隨舞台尺寸換算）；mob 改直排、原地淡入。
  &--tl {
    top: 0;
    left: 0;
    --from-x: 370px;
    --from-y: 185px;

    @include rwd-max('pc') {
      --from-x: 165px;
      --from-y: 223px;
    }
    @include rwd-max('tablet') {
      top: 197px;
      left: 44px;
      --from-x: 0px;
      --from-y: 0px;
    }
  }
  &--tr {
    top: 0;
    right: 0;
    --from-x: -370px;
    --from-y: 185px;

    @include rwd-max('pc') {
      --from-x: -171px;
      --from-y: 223px;
    }
    @include rwd-max('tablet') {
      top: 545px;
      right: auto;
      left: 44px;
      --from-x: 0px;
      --from-y: 0px;
    }
  }
  &--bl {
    bottom: 0;
    left: 0;
    --from-x: 370px;
    --from-y: -185px;

    @include rwd-max('pc') {
      --from-x: 165px;
      --from-y: -223px;
    }
    @include rwd-max('tablet') {
      top: 371px;
      bottom: auto;
      left: 44px;
      --from-x: 0px;
      --from-y: 0px;
    }
  }
  &--br {
    bottom: 0;
    right: 0;
    --from-x: -370px;
    --from-y: -185px;

    @include rwd-max('pc') {
      --from-x: -171px;
      --from-y: -223px;
    }
    @include rwd-max('tablet') {
      top: 728px;
      right: auto;
      bottom: auto;
      left: 44px;
      --from-x: 0px;
      --from-y: 0px;
    }
  }
}

.formula__box-head {
  position: absolute;
  top: 12px;
  right: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 0;
  font-size: var(--text-h5);
  font-weight: 500;
  color: #fff;
  background: var(--box-c);
}

.formula__box-logo {
  display: block;
  height: 22px;
  width: auto;
}

.formula__box-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 239px; // 內容區固定寬、格子內置中（padding 差異其實是置中的結果）
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.formula__box-item {
  position: relative;
  padding-left: 13px; // 4px 方塊 bullet + 9px 間距
  font-size: 15px;
  line-height: 15px;
  color: var(--color-gray);

  &::before {
    content: '';
    position: absolute;
    top: 5.5px;
    left: 0;
    width: 4px;
    height: 4px;
    background: var(--box-c);
  }
}

@keyframes formula-center-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

// 起點藏在中央塊正後方；前 12% 快速轉不透明 → 現身瞬間仍被遮蔽，看不到淡入
@keyframes formula-box-in {
  0% {
    opacity: 0;
    transform: translate(var(--from-x), var(--from-y));
  }
  12% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

// 連接線素材（pad 斜帶／mob rail）：到點瞬間現身（像素風，不淡入）
@keyframes formula-conn-in {
  to {
    opacity: 1;
  }
}
</style>
