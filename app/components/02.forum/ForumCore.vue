<!--
  forum 接棒的「橘核心」：SymbolFace 收斂成點後，於視窗正中央 crossfade 淡入的橘方塊。
  刻意獨立於 hero 的 OrangeCore（不含 stage 形變機制），只沿用 ~/utils/orange-core-config 的
  CORE 外觀設定（橘色 / 尺寸），確保與 hero 橘核心視覺一致。

  - 對位：SymbolFace 收斂到 world 原點＝視窗正中央；本層滿版置中，故白點與橘核心天然對齊、
    不需讀粒子座標（也符合「不用 SymbolFace 直接轉變」）。
  - crossfade：coreIn 時 SymbolFace 層（HeroForumTransition, z-index 10）由 transitionDone 同步淡出，
    本層黑底補上 → 露出時仍是純黑（橘核心停在黑畫面），下方議程維持被蓋住。淡出入為固定時間
    （CSS transition，非 scrub）＝ 決策「crossfade 用時間、移動綁 scrub」。
  - active 由 forum pin 的 scrub 進度（useOrangeCoreProgress 的 forumCoreActive）以 boolean 切換，
    往回捲自動反向。
  - z-index 20：高於轉場層（10）、低於 AppHeader（1000），故 header 全程可見。
-->
<script setup lang="ts">
defineProps<{
  /** forum 接棒視窗內（[coreIn, coreOut)）為 true → 黑底 + 橘核心淡入 */
  active?: boolean;
}>();

// 只借用外觀（尺寸 / 橘色），不含 hero 的 stage 形變邏輯。
const dotStyle = {
  width: `${CORE.dotSize}px`,
  height: `${CORE.dotSize}px`,
  background: `rgb(${CORE.orange.join(', ')})`,
};
</script>

<template>
  <div class="forum-core" :class="{ 'is-active': active }" aria-hidden="true">
    <span class="forum-core__dot" :style="dotStyle" />
  </div>
</template>

<style lang="scss" scoped>
.forum-core {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;

  &.is-active {
    opacity: 1;
  }
}

.forum-core__dot {
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .forum-core {
    transition: none;
  }
}
</style>
