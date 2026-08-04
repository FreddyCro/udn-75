<script setup lang="ts">
// 永續祝福的逐格像素臉 —— 只負責「把第 N 格畫出來」的笨渲染器。
//
// 不含任何捲動邏輯（格號由父層算好傳進來），也不決定自身尺寸
// （由外部 CSS 給寬高；viewBox 是 16×16 網格，等比撐滿）。
// 顏色走 currentColor：橘底上的白臉由父層 `color: #fff` 指定。
import { FACE_FRAMES, FACE_FRAME_COUNT, FACE_GRID } from '~/utils/blessing-face-frames';

const props = withDefaults(
  defineProps<{
    /** 0-based 格號；越界自動 clamp 到 [0, 16] */
    frame?: number;
  }>(),
  { frame: 0 },
);

const rects = computed(() => {
  // frame 未來會由捲動進度換算而來，換算過程若除以零或取值失敗可能產生 NaN；
  // 非有限數時直接退回第 0 格，避免 FACE_FRAMES[NaN] 取到 undefined 傳進 template。
  const raw = props.frame;
  const safe = Number.isFinite(raw) ? raw : 0;
  const i = Math.min(FACE_FRAME_COUNT - 1, Math.max(0, Math.round(safe)));
  return FACE_FRAMES[i]!;
});
</script>

<template>
  <svg
    class="blessing-face"
    :viewBox="`0 0 ${FACE_GRID} ${FACE_GRID}`"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      v-for="(r, i) in rects"
      :key="i"
      :x="r[0]"
      :y="r[1]"
      :width="r[2]"
      :height="r[3]"
      fill="currentColor"
    />
  </svg>
</template>

<style lang="scss" scoped>
.blessing-face {
  display: block;
  width: 100%;
  height: 100%;
  // 像素風：不要任何邊緣柔化
  shape-rendering: crispEdges;
}
</style>
