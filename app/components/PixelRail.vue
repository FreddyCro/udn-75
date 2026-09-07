<script lang="ts" setup>
/**
 * PixelRail — 4px 像素棋盤格的「直下再右轉」連接線（FormulaBlocks 的 mob 版）。
 * 對稿素材 udn75_news_formula_rail_01／02（44 寬、132／180 高）：垂直段為 12 寬棋盤格
 * （偶列 x=0,8、奇列 x=4），末端 4 列轉角後往右接到議題框。
 * ⚠️ 那兩支素材已從 public/ 移除（線是這支元件用 CSS 畫的，從來不發 request）；
 *    要回頭對稿的話從 git 歷史取 public/img/news/udn75_news_formula_rail_0{1,2}.svg。
 * progress（0..1）換算已現身列數，自上（中央塊側）往下逐列畫。
 */
const props = withDefaults(
  defineProps<{
    /** 畫線進度（0..1）：0 整條隱藏、1 整條現身 */
    progress?: number;
    /** 垂直段列數（4px 一列；素材 rail_01 = 29、rail_02 = 41） */
    rows?: number;
    /** 水平臂長（px，含轉角；對稿素材為 44） */
    arm?: number;
    /** 首列只留左半格：第一段自中央塊長出，端面切法與其餘段不同（對稿 rail_01） */
    shortStart?: boolean;
  }>(),
  { progress: 0, rows: 41, arm: 44, shortStart: false },
);

const ARM_ROWS = 4; // 轉角＋水平臂固定 4 列（對稿素材）

/** from 起、每隔 step 到 to（含）的 x 列表 */
const seq = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

const height = computed(() => props.rows * 4 + ARM_ROWS * 4);
// 已現身的列數（取整 → progress 連續變化只在跨列時觸發重繪）
const revealed = computed(() =>
  Math.round(
    Math.min(1, Math.max(0, props.progress)) * (props.rows + ARM_ROWS),
  ),
);

const squares = computed(() => {
  const out: { x: number; y: number; order: number }[] = [];
  // 垂直段棋盤格：偶列兩格（x=0,8）、奇列一格（x=4）
  for (let i = 0; i < props.rows; i++) {
    const xs = props.shortStart && i === 0 ? [0] : i % 2 === 0 ? [0, 8] : [4];
    xs.forEach((x) => out.push({ x, y: i * 4, order: i }));
  }
  // 轉角 → 水平臂（棋盤格往右接到議題框左緣）
  const y0 = props.rows * 4;
  const arm = props.arm;
  [
    [4, 12],
    seq(0, arm - 4, 8),
    seq(4, arm - 8, 8),
    seq(8, arm - 4, 8),
  ].forEach((xs, k) =>
    xs.forEach((x) => out.push({ x, y: y0 + k * 4, order: props.rows + k })),
  );
  return out;
});
</script>

<template>
  <div
    class="pixel-rail"
    :style="{ width: `${arm}px`, height: `${height}px` }"
    aria-hidden="true"
  >
    <i
      v-for="(s, i) in squares"
      :key="i"
      class="pixel-rail__px"
      :class="{ 'is-on': s.order < revealed }"
      :style="{ left: `${s.x}px`, top: `${s.y}px` }"
    />
  </div>
</template>

<style lang="scss" scoped>
.pixel-rail {
  position: relative;
}

// 像素風不淡入：進度跨過該列就整列現身
.pixel-rail__px {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-orange);
  opacity: 0;

  &.is-on {
    opacity: 1;
  }
}
</style>
