// 錨點的「落點」算式 —— header 錨點列、漢堡選單、深連結三條路共用同一份。
//
// 預設落點是「段落上緣貼齊 header 底緣」（扣掉 fixed header 的高度），段落的開頭才不會
// 被 header 蓋住。但有些段落的看點**不在**它的上緣：
//
//   `#blessing` 的上緣是 02 → 03 覆蓋過場的接縫（那一刻畫面上只有一塊剛升到頂的色塊），
//   設計師指定的落點是其後約一個視窗高、**逐格臉剛畫完**的那一刻（見 BLESSING_ANCHOR_VH）。
//
// 那個深度由段落自己用 `data-anchor-offset-vh` 宣告，header 不認得任何 section ——
// 同 `data-header-theme`（主題）與 `data-anchor-target`（scroll-spy 歸屬）的分工。
//
// ⚠️ 單位是**視窗高**而不是 px：所有段落的捲動尺都以視窗高為單位（見 orange-core-config
//    的 *_VH），寫成 px 的話每次 resize 都會過期，而落點錯了畫面上不會有東西壞掉喊出來
//    —— 只是使用者按了錨點之後看到序列中間的某一格。
//
// 純函式（不碰 DOM）：呼叫端負責量 elementTop 與 header 高度。由
// test/header-anchors.spec.ts 守著。

/** 錨點落點（同一件事的兩種寫法，見 anchorLanding）。 */
export interface AnchorLanding {
  /** 落點的文件座標，餵給 `window.scrollTo`。 */
  top: number;
  /**
   * 同一個落點寫成元素的 `scroll-margin-top`。
   *
   * Nuxt 的 scrollBehavior 只吃這個屬性（見 Hero.vue 的 scrollToInitialHash）——
   * 跨頁導航進站時它會在頁面轉場結束後「再捲一次」，蓋掉我們自己那次 scrollTo。
   * 兩邊寫同一個落點，誰後捲都一樣。深度往段落內走時它是**負值**，那是對的。
   */
  scrollMarginTop: number;
}

/**
 * 讀段落宣告的落點深度（`data-anchor-offset-vh`）。
 *
 * 認不出來（沒宣告／拼錯／NaN）一律回 0 ＝ 照預設落在段落上緣 —— 絕大多數錨點都是
 * 這一種，缺值不是異常。
 */
export function anchorOffsetVh(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * 錨點的落點。
 *
 * @param elementTop 錨點元素上緣的文件座標（`rect.top + scrollY`）
 * @param headerOffset fixed header 的高度（`--header-height`）
 * @param offsetVh 段落宣告的落點深度（× 視窗高）；0 ＝ 沒宣告
 * @param vh 一個視窗高（px，走 useViewportHeight 的 vhPx()）
 */
export function anchorLanding(input: {
  elementTop: number;
  headerOffset: number;
  offsetVh: number;
  vh: number;
}): AnchorLanding {
  const { elementTop, headerOffset, offsetVh, vh } = input;

  // 有宣告深度的錨點**不扣 header**：那種落點是一屏 sticky 動畫裡的某一個時刻，
  // 畫面本來就是滿版、header 疊在上面才是設計稿的樣子（沒有會被蓋住的段落開頭）。
  // 扣掉的話落點會往前退一個 header 高 —— 對 `#blessing` 是 0.06 個進度，
  // 剛好足以退回逐格臉的**前一格**（那一格的嘴還沒上揚，不是笑臉）。
  const top = offsetVh ? elementTop + offsetVh * vh : elementTop - headerOffset;

  return { top, scrollMarginTop: elementTop - top };
}
