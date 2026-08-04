<script setup lang="ts">
// 永續祝福清單上方的白色像素階梯線（Figma 永續祝福04：
// pc 2065:140521 / pad 2065:125593 / mob 2065:121897）。
//
// 形狀三斷點相同：直列 4 塊 ＋ 往右下 3 階斜梯，底部左右各一條橫桿。
// 三斷點只換 CSS 變數（方塊尺寸、直列 x 的百分比），不重寫座標。
const COLUMN_STEPS = 4; // 直列方塊數
const DIAGONAL_STEPS = 3; // 斜梯階數
</script>

<template>
  <div class="blessing-stairs" aria-hidden="true">
    <!-- 直列：x 固定，往下 4 塊 -->
    <i
      v-for="i in COLUMN_STEPS"
      :key="`c${i}`"
      class="blessing-stairs__px"
      :style="{
        left: 'var(--stair-col-x)',
        top: `calc(${i - 1} * var(--stair-bh))`,
      }"
    />

    <!-- 斜梯：每階往右下各一格 -->
    <i
      v-for="i in DIAGONAL_STEPS"
      :key="`d${i}`"
      class="blessing-stairs__px"
      :style="{
        left: `calc(var(--stair-col-x) + ${i} * var(--stair-bw))`,
        top: `calc(${i} * var(--stair-bh))`,
      }"
    />

    <span class="blessing-stairs__bar blessing-stairs__bar--left" />
    <span class="blessing-stairs__bar blessing-stairs__bar--right" />
  </div>
</template>

<style lang="scss" scoped>
.blessing-stairs {
  --stair-bw: 11.6px; // 方塊寬
  --stair-bh: 11.6px; // 方塊高
  --stair-col-x: 16.84%; // 直列 x（占容器寬）：pc 179.17 / 1064
  --stair-bar-y: 46px; // 橫桿頂端 y（＝ 4 × 11.6 取整）

  position: relative;
  width: 100%;
  max-width: 1064px;
  height: 58px;
  margin: 0 auto;

  @include rwd-max('pc') {
    --stair-col-x: 50.12%; // pad：326.92 / 652.25
    max-width: 652.25px;
  }

  @include rwd-max('tablet') {
    // mob 稿（2065:121897）的方塊本來就是 10.362×11.6 的長方形（非正方），
    // 故只覆寫寬、高維持 11.6；--stair-bar-y 與容器 height 亦沿用 bh=11.6 推出的值。
    --stair-bw: 10.362px;
    --stair-col-x: 46.4%; // mob：147.54 / 318
    max-width: none; // mob 涵蓋到 767px，面板在此區為滿版，階梯線改為等寬（--stair-col-x 為百分比會自動等比縮放）
  }
}

.blessing-stairs__px {
  position: absolute;
  width: var(--stair-bw);
  height: var(--stair-bh);
  background: #fff;
}

.blessing-stairs__bar {
  position: absolute;
  top: var(--stair-bar-y);
  height: 12px;
  background: #fff;
}

.blessing-stairs__bar--left {
  left: 0;
  width: calc(var(--stair-col-x) + var(--stair-bw));
}

.blessing-stairs__bar--right {
  right: 0;
  left: calc(var(--stair-col-x) + 4 * var(--stair-bw));
}
</style>
