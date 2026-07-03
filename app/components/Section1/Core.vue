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
  <!--
    外層 root：由 HeroCorePath 以 GSAP 驅動（位置 x/y + 切線 rotation）。
    內層 dot：實際橘色視覺；stage 3 起用 CSS scaleX/scaleY 把「點」拉成沿前進方向的「線」。
    分兩層 → GSAP 只碰外層 transform、CSS 只碰內層 transform，互不衝突。
  -->
  <span
    ref="root"
    class="sec1__core"
    :class="[`sec1__core--stage-${stage}`, { 'is-visible': visible }]"
    aria-hidden="true"
  >
    <span class="sec1__core-dot" />
  </span>
</template>

<style lang="scss" scoped>
$orange: #ff7f00;

// 外層 root：位置 + 切線 rotation 全由 HeroCorePath 的 GSAP 驅動
// （gsap.set x/y/rotation + xPercent/yPercent:-50 置中）；故此處不設任何 transform，
// 避免覆蓋 GSAP 的 transform。橘色視覺與 stage 變形都放到內層 dot。
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

  // 依移動進度切換的四個階段效果（門檻 41% / 71% / 90%，見 useCoreProgress）。
  // end（90%~100%）把內層 dot 從「點」拉成沿前進方向的「線」；因外層已轉到路徑切線角，
  // 這條線會自動順著路徑方向 → 抵達日期「/」時自然貼合斜槓。
  &--stage-end .sec1__core-dot {
    // scaleX：沿本地 +x（即路徑前進方向）拉長；scaleY：壓薄成線。數值可微調。
    transform: scaleX(10) scaleY(1);
  }
}

// 內層 dot：實際橘色視覺。預設為方點，stage 3/end 被上方規則拉成線。
.sec1__core-dot {
  display: block;
  width: 100%;
  height: 100%;
  background: $orange;
  transform-origin: center;
  transform: scale(1);
  transition: transform 0.5s ease;
}

@media (prefers-reduced-motion: reduce) {
  .sec1__core {
    transition: none;
  }

  .sec1__core-dot {
    transition: none;
  }
}
</style>
