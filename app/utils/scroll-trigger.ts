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
 *
 * ⚠ 本檔以外**不該**出現裸的 `ScrollTrigger.refresh()` —— 元件、composable、plugin 都算。
 *   2026-08-12 補完最後 5 處（hero 的 OrangeCorePath ×2 與 Hero 的 hash 落點、blessing 的
 *   partners spacer、viewport-height plugin 的 --vh 重算），現在整份 app/ 只有這一個入口。
 *   漏掉的症狀是靜默的：pin 起點少算了上游某段佔位，那條尺提早觸發，但不會報錯。
 */
export function refreshScrollTriggers() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

/**
 * 字體載入完成後重算一次 —— **整個 app 只註冊一次**。
 *
 * 原本三個元件（02.forum/Agenda、02.forum/ForumCorePath、01.hero/OrangeCorePath）各自
 * 寫 `document.fonts?.ready.then(() => refreshScrollTriggers())`。`fonts.ready` 只會
 * resolve 一次，三個 callback 因此落在**同一個 microtask batch** → 載入時連續三次全站
 * 重算：3 × (refreshInit → ForumCorePath.build() 整條線重新量測) ＋ 3 × Agenda.measure()
 * ＋ 3 × 頁面上其餘每一條尺。ForumCorePath 自己的註解早就在講這一類浪費
 * （它把單一元件內的三次 build 收成一次），只是跨元件那份重複還留著。
 *
 * 模組層的旗標（不是元件實例層）：換頁回來時元件會 remount，但字體早就載完了，
 * `fonts.ready` 也早已 resolve —— 再註冊一次只會多打一次無意義的全站重算。
 */
let fontsRefreshHooked = false;
export function refreshOnFontsReady() {
  if (fontsRefreshHooked) return;
  fontsRefreshHooked = true;
  document.fonts?.ready.then(() => refreshScrollTriggers());
}
