<!--
  orange core：影片退場後於第一屏正中央淡入的橘點。
  位置由 HeroCorePath 以 GSAP 驅動（沿驅動線移動）；本元件只負責外觀 / 淡入 /
  依 stage 切換視覺。GSAP 需要真實 DOM 元素，故對外曝露 root el 供父層取得。
-->
<script setup lang="ts">
import type { CoreStage } from '~/composables/useCoreProgress';

defineProps<{
  /** 依移動進度的階段（門檻見 Section1）；驅動各階段視覺 */
  stage: CoreStage;
  /** 影片退場（gone）後才淡入 */
  visible?: boolean;
}>();

// HeroCorePath 以 gsap.set 驅動位置，需要真實 DOM 元素 → 對外曝露 root el。
const root = ref<HTMLElement | null>(null);
defineExpose({ root });
</script>

<template>
  <span
    ref="root"
    class="sec1__core"
    :class="[`sec1__core--stage-${stage}`, { 'is-visible': visible }]"
    aria-hidden="true"
  />
</template>

<style lang="scss" scoped>
$orange: #ff7f00;

// 位置由 HeroCorePath 以 GSAP 驅動（gsap.set x/y + xPercent/yPercent:-50 置中）；
// 故此處 top/left 皆 0、不設 transform，避免與 GSAP 的 transform 衝突。
.sec1__core {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 24px;
  height: 24px;
  background: $orange;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.6s ease;

  // 退場消失（gone）後淡入
  &.is-visible {
    opacity: 1;
  }

  // 依移動進度切換的四個階段效果（門檻 41% / 71% / 90%，見 useCoreProgress）。
  // 目前為佔位，填入各階段要的視覺變化即可。
  &--stage-1 {
    // 0 ~ 41%
  }

  &--stage-2 {
    // 41% ~ 71%
  }

  &--stage-3 {
    // 71% ~ 90%
  }

  &--stage-end {
    // 90% ~ 100%
  }
}

@media (prefers-reduced-motion: reduce) {
  .sec1__core {
    transition: none;
  }
}
</style>
