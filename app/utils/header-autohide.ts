// header 的「下滑順滑隱藏、上滑顯示」判定 —— 純函式，不碰 DOM。
// 量 scrollY、決定什麼時候該套用（斷點、選單、轉場開窗…）都是呼叫端的事，
// 見 AppHeader.vue 的 updateAutoHide。
//
// 邏輯對齊 @udn-digital-center/common-components 的 NmdHeader：
//   下滑藏、上滑顯、回到頂端一律顯示。
// 差別是多一道**位移門檻**。NmdHeader 靠 useScroll 的 throttle 100ms 逐次比較，
// 本站首頁滿是 ScrollTrigger 的 pin，pin/unpin 交界的 scrollY 會有次像素級的來回，
// 沒有門檻的話 header 會在那些交界不停閃動（NmdHeader 的頁面沒有 pin，遇不到）。

/** 判定為「一次真正的捲動」所需的最小位移（px）。小於此值視為抖動，維持原狀。 */
export const HEADER_AUTOHIDE_THRESHOLD_PX = 8;

export interface HeaderAutoHideInput {
  /** 這一幀的 window.scrollY */
  y: number;
  /** 上一次判定時的 scrollY */
  prevY: number;
  /** 目前的顯示狀態；位移未達門檻時原樣回傳 */
  shown: boolean;
  /** 覆寫門檻，預設 HEADER_AUTOHIDE_THRESHOLD_PX */
  threshold?: number;
}

export function nextHeaderShown({
  y,
  prevY,
  shown,
  threshold = HEADER_AUTOHIDE_THRESHOLD_PX,
}: HeaderAutoHideInput): boolean {
  // 回到（或越過）頂端一律顯示，不看方向 —— 負值是 iOS 的橡皮筋，
  // 從負值彈回 0 那幾幀方向是「下滑」，不加這道會在頁首閃一下。
  if (y <= 0) return true;

  const delta = y - prevY;
  if (Math.abs(delta) < threshold) return shown;
  return delta < 0;
}
