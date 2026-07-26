<script lang="ts" setup>
/**
 * FormulaBlocks — 「Publish X 議題智囊包」放射圖（news 頁）。
 * TODO(rwd): 目前為 PC 版定稿；pad 與 mob 版面待做，暫以整體 scale 因應 <1064 的視窗。
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

const STAGE_W = 1064;
const STAGE_H = 524;

const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const on = ref(false);
const settled = ref(false); // 分支線接上後四格橘轉灰
const scale = ref(1);

let io: IntersectionObserver | null = null;
let settleTimer: number | undefined;

function onResize() {
  // 量 viewport（padding 內側）而非 section，縮放後才保得住左右留白
  const w = viewportRef.value?.clientWidth ?? STAGE_W;
  scale.value = Math.min(1, w / STAGE_W);
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
      :style="{ height: `${STAGE_H * scale}px` }"
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

        <!-- 四條像素分支線：從中央塊角落逐格往四角畫出 -->
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

// 舞台固定 1064×524（Figma PC 座標系），<1064 時整體 scale（過渡做法，見 TODO）
.formula__stage {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1064px;
  height: 524px;
  transform-origin: top center;
}

// ── 中央 Publish X 塊：像素外框（橘）+ 內縮 12px 橘色填色 ──
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

// ── 分支線位置（對稿 Figma：與中央塊/格子角落各斜疊 8px 對接）──
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
}

// ── 四角議題格子 ──
// 進場滑出階段為橘色態（--box-c），is-settled 後瞬間轉灰（多重背景外框無法平滑過渡）
.formula__box {
  --box-c: var(--color-orange);
  position: absolute;
  width: 324px;
  height: 154px;
  padding-top: 68px; // 列點區距格子頂（三版一致的固定值）
  opacity: 0;

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

  // --from-*：滑出起點（中央塊正後方）到定位點的位移量
  &--tl {
    top: 0;
    left: 0;
    --from-x: 370px;
    --from-y: 185px;
  }
  &--tr {
    top: 0;
    right: 0;
    --from-x: -370px;
    --from-y: 185px;
  }
  &--bl {
    bottom: 0;
    left: 0;
    --from-x: 370px;
    --from-y: -185px;
  }
  &--br {
    bottom: 0;
    right: 0;
    --from-x: -370px;
    --from-y: -185px;
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
</style>
