import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 全體 ScrollTrigger 重算（單一入口）。
 *
 * pin 的觸發點依賴「它上方所有 pin 的佔位（pin-spacer）」都已被算進去，
 * 但 GSAP 的 refresh 順序預設＝建立順序 —— 本專案的 pin 分散在多個元件、
 * 各自 onMounted／跨斷點重建（FormulaBlocks、PhotoPanels），建立順序無法
 * 保證由上到下；只要有一個 pin 晚建（或重建被排到隊尾），它下面所有 pin
 * 的起點就會漏算一段佔位而提早觸發。
 *
 * 因此凡是「手動 refresh」或「teardown 後重建 pin」，一律呼叫本函式：
 * 先 sort()（把重算順序改成照觸發點位置由上到下，與建立順序脫鉤）再 refresh()。
 * 不要在元件內直接呼叫 ScrollTrigger.refresh()。
 */
export function refreshScrollTriggers() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
