<!--
  orange core：影片退場後於第一屏中央淡入的橘點，沿驅動線移動、依 stage 變化。
  位置與切線旋轉由 OrangeCorePath 以 GSAP 驅動（需要真實 DOM 元素 → 對外曝露 root el）。
  本元件只負責 dot 的外觀：
    stage 1–2：點（移動中）
    stage 3  ：point → line（隨 stageProgress 漸進變長）
    stage 4  ：橘 → 黑（隨 stageProgress 漸進變色；黑＝section 2 星空底色）
    stage 5  ：邊放大邊淡出，與星空淡入同步交融（CROSSFADE 控制快慢）
    stage 6  ：已隱去，放大後續由 HeroForumTransition 星空遮罩承接
-->
<script setup lang="ts">
import type { CoreStage } from '~/composables/useOrangeCoreProgress';

const props = defineProps<{
  /** 目前 stage（1..6，見 useOrangeCoreProgress） */
  stage: CoreStage;
  /** 該 stage 內的 local progress（0..1）→ 漸進變長 / 變色 */
  stageProgress: number;
  /** 影片退場（gone）後才淡入 */
  visible?: boolean;
}>();

// OrangeCorePath 以 gsap.set 驅動位置，需要真實 DOM 元素 → 對外曝露 root el。
const root = ref<HTMLElement | null>(null);
defineExpose({ root });

// ── 視覺參數：集中在 ~/utils/orange-core-config 的 CORE（dot 形變量與橘→黑顏色）──
const { lineScaleX, revealGrow, orange, dark } = CORE;

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

// dot 的 transform / 顏色 / 透明度完全由 stage + stageProgress 驅動；scrub 值直接跟手，不加 transition。
const dotStyle = computed(() => {
  const s = props.stage;
  const sp = props.stageProgress;

  let scaleX = 1;
  let scaleY = 1;
  let opacity = 1;

  if (s === 3) {
    scaleX = 1 + (lineScaleX - 1) * sp; // point → line
  } else if (s === 4) {
    scaleX = lineScaleX; // line（變色階段）
  } else if (s === 5) {
    // 放大 + 淡出：接續線繼續長大；淡出與星空淡入同步（CROSSFADE 控制快慢）。
    // CROSSFADE=0 → 星空立即實色接手、core 立即隱去（無 washy）。
    scaleX = lineScaleX + revealGrow * sp;
    scaleY = 1 + revealGrow * sp;
    const fade = CROSSFADE <= 0 ? 1 : Math.min(1, sp / CROSSFADE);
    opacity = 1 - fade;
  } else if (s >= 6) {
    // 已完全交棒給星空 → 藏起（維持已放大狀態，避免殘影）
    scaleX = lineScaleX + revealGrow;
    scaleY = 1 + revealGrow;
    opacity = 0;
  }

  // 變色：stage 4 漸進 橘→黑；stage ≥5 維持黑；stage ≤3 維持橘
  let c = orange;
  if (s === 4) c = [mix(orange[0], dark[0], sp), mix(orange[1], dark[1], sp), mix(orange[2], dark[2], sp)];
  else if (s >= 5) c = dark;

  return {
    transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
    background: `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
    opacity: String(opacity),
  };
});
</script>

<template>
  <!--
    外層 root：位置 + 切線 rotation 由 OrangeCorePath 的 GSAP 驅動（x/y/rotation + xPercent/yPercent:-50）；
    此處不設 transform，避免覆蓋 GSAP。內層 dot 的形狀/顏色由 dotStyle（stage 驅動）決定。
  -->
  <span
    ref="root"
    class="sec1__orange-core"
    :class="{ 'is-visible': visible }"
    aria-hidden="true"
  >
    <span class="sec1__orange-core-dot" :style="dotStyle" />
  </span>
</template>

<style lang="scss" scoped>
.sec1__orange-core {
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
.sec1__orange-core-dot {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

@media (prefers-reduced-motion: reduce) {
  .sec1__orange-core {
    transition: none;
  }
}
</style>
