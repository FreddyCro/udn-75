<!--
  forum 接棒的「橘核心」：SymbolFace 收斂成點後，於視窗正中央 crossfade 淡入的橘方塊。
  刻意獨立於 hero 的 OrangeCore（不含 stage 形變機制），只沿用 ~/utils/orange-core-config 的
  CORE 外觀設定（橘色 / 尺寸），確保與 hero 橘核心、論壇段路徑核心三者視覺一致。

  - 對位：SymbolFace 收斂到 world 原點＝視窗正中央；本層滿版置中，故白點與橘核心天然對齊、
    不需讀粒子座標（也符合「不用 SymbolFace 直接轉變」）。
  - 黑底與橘點是兩層、吃兩個條件：黑底只在 [coreIn, coreOut) 現身（其下方 .sec2 是白底，
    提早淡出會露出白階跳動）；橘點要撐到論壇段路徑接手，故用 dotVisible（見
    useOrangeCoreProgress 的 forumCoreDotVisible）。淡出入為固定時間（CSS transition，
    非 scrub）＝ 決策「crossfade 用時間、移動綁 scrub」。
  - 往回捲自動反向（boolean 觸發的 CSS 轉場可逆）。
  - z-index 20：低於 AppHeader（1000），故 header 全程可見。
-->
<script setup lang="ts">
defineProps<{
  /** forum 接棒視窗內（[coreIn, coreOut)）為 true → 黑底淡入 */
  active?: boolean;
  /** 橘點是否可見：coreIn 起一路撐到論壇段路徑接手 */
  dotVisible?: boolean;
  /** 橘點的消失要瞬間完成（＝路徑核心已接手，見下方 SCSS 的理由） */
  instantHide?: boolean;
}>();

// 只借用外觀（尺寸 / 橘色），不含 hero 的 stage 形變邏輯。
const dotStyle = {
  width: `${CORE.dotSize}px`,
  height: `${CORE.dotSize}px`,
  background: `rgb(${CORE.orange.join(', ')})`,
};
</script>

<template>
  <div
    class="forum-core"
    :class="{
      'is-active': active,
      'is-dot-visible': dotVisible,
      'is-instant-hide': instantHide,
    }"
    aria-hidden="true"
  >
    <span class="forum-core__bg" />
    <span class="forum-core__dot" :style="dotStyle" />
  </div>
</template>

<style lang="scss" scoped>
// 容器本身不再帶 opacity：黑底與橘點的淡出時機不同，共用一個 opacity 就沒辦法讓橘點活過 coreOut。
.forum-core {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.forum-core__bg {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  transition: opacity 0.4s ease;

  .forum-core.is-active & {
    opacity: 1;
  }
}

// position: relative 是必要的 —— 黑底是 absolute（已定位），未定位的元素會先繪製，
// 橘點若維持 static 就會被黑底蓋住。兩者都定位後由 DOM 順序決定，橘點在上。
.forum-core__dot {
  position: relative;
  display: block;
  opacity: 0;
  transition: opacity 0.4s ease;

  .forum-core.is-dot-visible & {
    opacity: 1;
  }

  // 交棒（路徑核心接手）時的消失必須是瞬間的：兩顆在交棒點重合，但路徑核心隨即沿線離開，
  // 若還淡出 0.4s，中央會留一顆停著的殘影 —— 那正是「全程只看到一顆」要避免的。
  // 只在「已交棒且橘點該消失」時關掉 transition，故 coreIn 的淡入（與 SymbolFace 的
  // crossfade）仍是 0.4s；pad/mob 無線稿時 instantHide 恆為 false，coreOut 照舊淡出。
  .forum-core.is-instant-hide:not(.is-dot-visible) & {
    transition: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .forum-core__bg,
  .forum-core__dot {
    transition: none;
  }
}
</style>
