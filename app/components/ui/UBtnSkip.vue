<!--
  跳過按鈕（Skip）：對應設計稿的 component set 2065:130287（Property 1 = Default / hover）。

  本元件只畫「Skip 文字 ＋ 雙箭頭」與它的兩個狀態（預設 40%、hover 100%），
  不管它出現在哪、什麼時候出現 —— 位置、淡入時機、可及性狀態都留給呼叫點，
  因為那些是 hero 影片狀態機的事（見 HeroVideo.vue 的 .sec1__hero-skip）。

  ⚠️ 兩個 opacity 分屬不同層，別合併：
     根節點的 opacity 留給呼叫點做「淡入 / 淡出」，本元件的 40% ↔ 100% 畫在 __row 上。
     opacity 是乘算的，故可見時實際為 1 × .4，hover 為 1 × 1，與稿一致；
     若兩者都寫在根節點就會互相覆蓋（且跨 scoped 樣式的勝負不可靠）。
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 顯示文字（稿上為 "Skip"）；文案由呼叫點自 locales 傳入 */
    label?: string;
  }>(),
  { label: 'Skip' },
);
</script>

<template>
  <!--
    type 寫死 button：本元件不做表單送出，也避免落在 <form> 內時誤觸 submit。
    aria-label / tabindex / aria-hidden / @click 都靠 fallthrough 落在這顆 <button> 上，
    不另外宣告成 prop —— 根節點就是按鈕本體，轉一手只會多一層要維護的對照表。
  -->
  <button class="u-btn-skip" type="button">
    <span class="u-btn-skip__row">
      <span class="u-btn-skip__text">{{ label }}</span>
      <!--
        雙箭頭（稿上是 instance 「提示下滑」×2，各 12×22，並排無間距）：
        原稿每個箭頭是 11 顆 2×2 實心方塊排成階梯狀 chevron（匯出的 vector 就是 2×2 方塊），
        這裡照 inset 換算出的整數座標重畫成同一組 rect，幾何與原稿逐點相同。
        第二個箭頭直接把座標 +12 寫進同一條 path —— 共用元件可能有多個實例，
        用 <use href="#id"> 會有撞名風險，寧可多幾個字。
        shape-rendering 保住像素邊緣（同 BlessingFace 的像素風處理）。
      -->
      <svg
        class="u-btn-skip__icon"
        viewBox="0 0 24 22"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M0 0h2v2H0z M2 2h2v2H2z M4 4h2v2H4z M6 6h2v2H6z M8 8h2v2H8z M10 10h2v2H10z M8 12h2v2H8z M6 14h2v2H6z M4 16h2v2H4z M2 18h2v2H2z M0 20h2v2H0z M12 0h2v2H12z M14 2h2v2H14z M16 4h2v2H16z M18 6h2v2H18z M20 8h2v2H20z M22 10h2v2H22z M20 12h2v2H20z M18 14h2v2H18z M16 16h2v2H16z M14 18h2v2H14z M12 20h2v2H12z"
        />
      </svg>
    </span>
  </button>
</template>

<style lang="scss" scoped>
// 設計稿 2065:130287：外框 100×48、padding 11 10 9、flex-col + items-start。
//
// 尺寸一律照稿上的絕對值（1:1），不做換算。
// ⚠️ 這與 hero 其餘 UI 的慣例不同：start cube（95）、載入層方塊（83.333）畫在 1280×720 稿上，
// 而本按鈕的稿畫在 1920×1080 的「影片稿」上 —— 若要與影片內容、其餘 UI 同比例，
// 應該整組 ÷1.5（20px 字 → 13.33px）。這裡刻意不那麼做，取稿上的絕對字級，
// 故本按鈕在 1280 寬的視窗會比影片裡的等價物大 1.5 倍。要改回同比例就整組 ÷1.5，
// 並同步改 HeroVideo 的 right / bottom。
//
// column + flex-start 是照稿：稿高 48、內容只有 44，多出來的 4px 全留在底部（而非上下均分）。
.u-btn-skip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100px;
  height: 48px;
  padding: 11px 10px 9px;
  color: var(--color-gray); // ＝ 稿上的 #686868
  background: none;
  border: 0;
}

.u-btn-skip__row {
  display: flex;
  align-items: center;
  gap: 12px;
  // 稿上的 Default 態。淡入／淡出是呼叫點在根節點做的，兩者相乘（見檔頭）。
  opacity: 0.4;
  transition: opacity 0.2s ease;

  // :focus-visible 與 :active 一併吃：稿只畫了 hover，但鍵盤與按下時同樣該給完整不透明度
  // （比照 HeroStart 的 cube）。
  .u-btn-skip:hover &,
  .u-btn-skip:focus-visible &,
  .u-btn-skip:active & {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

// 設計稿 1864:52374：Noto Sans TC Regular / 20px / line-height 20（＝ 1）。
// padding-bottom 承自稿上文字外框的 pb 4 —— 讓文字視覺中線與雙箭頭對齊。
.u-btn-skip__text {
  padding-bottom: 4px;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  white-space: nowrap;
}

// 雙箭頭：稿上 24×22（兩個 12×22 並排，無間距）；fill 跟著按鈕的 color 走
.u-btn-skip__icon {
  display: block;
  flex: none;
  width: 24px;
  height: 22px;
  fill: currentColor;
}
</style>
