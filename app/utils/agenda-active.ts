// 議程作用中群組的狀態轉移（純函式，無 DOM / Vue 依賴）。
//
// 每個群組一個 ScrollTrigger，離開事件的送達順序**不保證**。若離開時無條件把 activeIndex
// 清成 null，群組交界上「新組先 enter、舊組後 leave」就會把剛設好的新值清掉，閃一幀空白。
// 故離開只清掉自己。

/** ScrollTrigger 的 onToggle → 下一個 activeIndex。 */
export function nextActiveIndex(
  current: number | null,
  i: number,
  isActive: boolean,
): number | null {
  if (isActive) return i;
  return current === i ? null : current;
}
