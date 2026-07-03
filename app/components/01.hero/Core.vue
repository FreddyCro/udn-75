<!--
  orange core：影片退場後於第一屏中央淡入的橘點，沿驅動線移動、依 stage 變化。
  位置與切線旋轉由 HeroCorePath 以 GSAP 驅動（需要真實 DOM 元素 → 對外曝露 root el）。
  本元件只負責 dot 的外觀：
    stage 1–2：點（移動中）
    stage 3  ：point → line（隨 stageProgress 漸進變長）
    stage 4  ：橘 → 黑（隨 stageProgress 漸進變色；黑＝section 2 星空底色）
    stage 5–6：維持黑線（放大交給 HeroTransition 的星空遮罩承接）
-->
<script setup lang="ts">
import type { CoreStage } from '~/composables/useHeroCoreProgress';

const props = defineProps<{
  /** 目前 stage（1..6，見 useCoreProgress） */
  stage: CoreStage;
  /** 該 stage 內的 local progress（0..1）→ 漸進變長 / 變色 */
  stageProgress: number;
  /** 影片退場（gone）後才淡入 */
  visible?: boolean;
}>();

// HeroCorePath 以 gsap.set 驅動位置，需要真實 DOM 元素 → 對外曝露 root el。
const root = ref<HTMLElement | null>(null);
defineExpose({ root });

// ── 視覺參數（config）──
const LINE_SCALE_X = 10; // stage 3 變長：point(24px) → line(240px)。與 HeroTransition 的 LINE_HALF_* 對齊
const ORANGE: [number, number, number] = [255, 127, 0];
const DARK: [number, number, number] = [10, 28, 43]; // 橘→黑目標（section 2 星空底色）

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

// dot 的 transform / 顏色完全由 stage + stageProgress 驅動；scrub 值直接跟手，不加 transition。
const dotStyle = computed(() => {
  const s = props.stage;
  const sp = props.stageProgress;

  // 變長：stage 3 漸進 1→10；stage ≥4 維持線；stage ≤2 維持點
  let scaleX = 1;
  if (s === 3) scaleX = 1 + (LINE_SCALE_X - 1) * sp;
  else if (s >= 4) scaleX = LINE_SCALE_X;

  // 變色：stage 4 漸進 橘→黑；stage ≥5 維持黑；stage ≤3 維持橘
  let c = ORANGE;
  if (s === 4) c = [mix(ORANGE[0], DARK[0], sp), mix(ORANGE[1], DARK[1], sp), mix(ORANGE[2], DARK[2], sp)];
  else if (s >= 5) c = DARK;

  return {
    transform: `scaleX(${scaleX}) scaleY(1)`,
    background: `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
  };
});
</script>

<template>
  <!--
    外層 root：位置 + 切線 rotation 由 HeroCorePath 的 GSAP 驅動（x/y/rotation + xPercent/yPercent:-50）；
    此處不設 transform，避免覆蓋 GSAP。內層 dot 的形狀/顏色由 dotStyle（stage 驅動）決定。
  -->
  <span
    ref="root"
    class="sec1__core"
    :class="{ 'is-visible': visible }"
    aria-hidden="true"
  >
    <span class="sec1__core-dot" :style="dotStyle" />
  </span>
</template>

<style lang="scss" scoped>
.sec1__core {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 24px;
  height: 24px;
  opacity: 0;
  transition: opacity 0.6s ease;

  // 退場消失（gone）後淡入
  &.is-visible {
    opacity: 1;
  }
}

// 內層 dot：transform / background 皆由 JS（dotStyle）依 stage 驅動。
.sec1__core-dot {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

@media (prefers-reduced-motion: reduce) {
  .sec1__core {
    transition: none;
  }
}
</style>
