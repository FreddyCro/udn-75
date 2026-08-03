<!--
  orange core：影片退場後淡入的橘方塊，沿驅動線移動到引言文首。
  位置與切線旋轉由 OrangeCorePath 以 GSAP 驅動（需要真實 DOM 元素 → 對外曝露 root el）。
  本元件只負責外觀（顏色 / 尺寸 / 淡入）。
  🚧 舊稿的 stage 形變（stage 3 point→line 落在日期「/」、stage 4 橘→黑、stage 5 放大淡出）
     已隨 date 段與星空轉場移除，故不再吃 stage / stageProgress —— 新稿的階段視覺待定案。
-->
<script setup lang="ts">
defineProps<{
  /** 影片退場（gone）後才淡入 */
  visible?: boolean;
}>();

// OrangeCorePath 以 gsap.set 驅動位置，需要真實 DOM 元素 → 對外曝露 root el。
const root = ref<HTMLElement | null>(null);
defineExpose({ root });
</script>

<template>
  <!--
    外層 root：位置 + 切線 rotation 由 OrangeCorePath 的 GSAP 驅動（x/y/rotation + xPercent/yPercent:-50）；
    此處不設 transform，避免覆蓋 GSAP。
  -->
  <span
    ref="root"
    class="sec1__orange-core"
    :class="{ 'is-visible': visible }"
    aria-hidden="true"
  >
    <span class="sec1__orange-core-dot" />
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

// 內層 dot：橘方塊本體。留一層是為了「外層走 GSAP 的 transform、內層走自己的形變」不互撞
// （新稿的階段形變定案後可在此加 transform，不必動外層）。
.sec1__orange-core-dot {
  display: block;
  width: 100%;
  height: 100%;
  background: rgb(255, 127, 0);
  transform-origin: center;
}

@media (prefers-reduced-motion: reduce) {
  .sec1__orange-core {
    transition: none;
  }
}
</style>
