// 「轉場開的那個窗，header 要不要跟著挖洞反白」的**純判定**。
//
// 從 ~/composables/useHeaderBand 抽出來的理由與 header-theme / header-autohide 一樣：
// 判定本身沒有 DOM、沒有 reactive，抽成純函式才測得到；而它壞掉的症狀是靜默的
// —— 窗開得太晚或收得太早，畫面上就是 base 那條 rgb(255 255 255 / 0.7) + blur(2px)
// 糊在色場上的一條灰霧帶，沒有任何錯誤訊號。
//
// ⚠️ 垂直邊界問的是「窗有沒有**碰到 header 那一列**」，不是「有沒有到視窗頂端」。
//    這兩件事差一個 header 高（83px），而那個差就是 2026-09-06 的回報：
//    01 → 02 拉長段的窄長條從畫面中央往上長，上緣進了 header 那一列、還沒到視窗頂的
//    那段（1440×900 實測 scrollY 2188–2299，約 112px 捲動）閘門仍關著 ⇒ 灰霧帶。
//    03 → 04 是同一件事的鏡像：拍 1 結束後橘柱往下收，上緣離開視窗頂、還沒離開
//    header 那一列的那段（實測 scrollY 18920–19005）同樣中。
//
//    當初寫成「到視窗頂」是因為 base 的挖洞遮罩只有水平資訊（一條 linear-gradient
//    to right），表達不了垂直邊界 —— 窗還沒蓋滿那一列就挖，缺口上半會穿幫成底下的
//    hero 白底。現在遮罩補上了垂直那一層（AppHeader 的 --hd-band-cap，靠 --hd-band-t
//    切），窗可以只挖 top 以下，閘門才問得起真正的問題。
export function headerBandOpen(
  rect: { left: number; right: number; top?: number } | null | undefined,
  /** header 那一列的底緣（＝ --header-height，見 ~/utils/header-offset） */
  headerBottom: number,
): boolean {
  if (!rect) return false;
  if (!(rect.right > rect.left)) return false;
  // top 省略 ＝ 窗本來就滿高（03 → 04 的橘幕在拍 0／拍 1 期間就是這樣）。
  // 用 < 而不是 <=：top 正好等於底緣時，窗的任何一部分都不在那一列裡，不必開。
  return (rect.top ?? 0) < headerBottom;
}
