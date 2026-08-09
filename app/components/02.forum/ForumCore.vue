<!--
  forum 接棒的「橘核心」：SymbolFace 收斂成點後，於視窗正中央接手的橘方塊。
  刻意獨立於 hero 的 OrangeCore（不含 stage 形變機制），只沿用 ~/utils/orange-core-config 的
  CORE 外觀設定（橘色 / 尺寸），確保與 hero 橘核心、論壇段路徑核心三者視覺一致。

  - 對位：SymbolFace 收斂到 world 原點＝canvas 中心，本層滿版置中＝視窗中心，兩者天然對齊、
    不需讀粒子座標（也符合「不用 SymbolFace 直接轉變」）。
    ⚠️ 前提是那張 canvas 的尺寸有跟著視窗走 —— 捲軸出現時 window resize 不會觸發，
       SymbolFace 因此改用 ResizeObserver，否則收斂點會偏右半個捲軸寬（見該元件的說明）。
  - 交棒是**硬切**、不是 crossfade：收斂點在收攏末段已由白轉橘（SymbolFace 的 convergeColor
    ＝ CORE.orange），到 coreIn 時兩顆同色同尺寸同位置，直接換人畫看不出接縫。
  - 黑底與橘點是兩層、吃兩個條件：黑底只在 [coreIn, coreOut) 現身（其下方 .sec2 是白底，
    提早淡出會露出白階跳動），走 0.4s 淡入 —— 那段期間上下都是黑的，看不出來；橘點要撐到
    論壇段路徑接手，故用 dotVisible（見 useOrangeCoreProgress 的 forumCoreDotVisible）。
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
//
// 出現是**瞬間**的（見 is-dot-visible 內的 transition: none）：coreIn 那一刻 SymbolFace 的
// 收斂點已經是同色（convergeColor ＝ CORE.orange）、同尺寸（convergeSize ＝ CORE.dotSize）、
// 同位置的橘方塊，硬切上來看不出接縫，比 crossfade 期間兩層都半透明乾淨。
// 這裡的 transition 只給「消失」用 —— transition 取的是**變化後**那組計算樣式，
// 加上 is-dot-visible 時吃到 none（瞬間出現），移除時吃到本規則的 0.4s（淡出）。
.forum-core__dot {
  position: relative;
  display: block;
  opacity: 0;
  transition: opacity 0.4s ease;

  .forum-core.is-dot-visible & {
    opacity: 1;
    transition: none;
  }

  // 交棒（路徑核心接手）時的消失必須是瞬間的：兩顆在交棒點重合，但路徑核心隨即沿線離開，
  // 若還淡出 0.4s，中央會留一顆停著的殘影 —— 那正是「全程只看到一顆」要避免的。
  // pad/mob 無線稿時 instantHide 恆為 false，coreOut 照舊走上面那 0.4s 淡出。
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
