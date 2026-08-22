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

/* ────────────────────────────────────────────────────────────────────────────
 * 內容高度變動後重算
 * ──────────────────────────────────────────────────────────────────────────── */

/** 變動停止多久之後才重算（ms）。要蓋得過最長的一段版面過渡，見下方 SubpageWork。 */
export const CONTENT_RESIZE_SETTLE_MS = 350;
/** 變動一直不停時的最長等待（ms）—— 沒有上限的話 debounce 會被連續變動餓死。 */
export const CONTENT_RESIZE_MAX_WAIT_MS = 1000;

/**
 * 這次變動還要等多久才落定：debounce（等安靜下來）＋ 最長等待上限（別被餓死）。
 *
 * @param firstPendingAt 這一輪**第一次**變動的時間戳
 * @param now            現在
 */
export function settleDelay(
  firstPendingAt: number,
  now: number,
  settleMs = CONTENT_RESIZE_SETTLE_MS,
  maxWaitMs = CONTENT_RESIZE_MAX_WAIT_MS,
): number {
  return Math.max(0, Math.min(settleMs, firstPendingAt + maxWaitMs - now));
}

/** 高度差小於這個量就不重算（子像素抖動不值得打一次全站重算） */
const CONTENT_RESIZE_EPS = 2;

/**
 * 內容高度一變就重算 —— **整個 app 只註冊一次**，回傳解除掛鉤的函式。
 *
 * 為什麼需要：ScrollTrigger 的 start／end 是量完就固定的**絕對捲動座標**，量測之後才
 * 發生的版面長高完全不會讓它自己更新。既有的補刀都是點狀的（轉場結束、字體載入、
 * --vh 重算），漏掉的那些是靜默的：
 *
 *   ・冷啟動時陸續載入的內文圖 —— 實測 /subpage 有 48 張內文圖，44 張沒有保留尺寸
 *     （無 width/height、無 aspect-ratio），載入前佔 0 高
 *   ・SubpageWorks 的列展開（grid-template-rows 0fr→1fr，0.3s）—— 實測 +136px，
 *     而且是**捲動途中**反覆展開收合
 *
 * 在連續閱讀頁（/subpage）這會直接毀版：六篇串在同一份文件裡，上游長高多少，下面每一篇
 * pin 的起點就早了多少；而舞台是透明的（白底在 .subpage__content 上），提早 pin ＝
 * 下一篇的 hero 以 position: fixed 蓋在上一篇的內文上，兩篇的字疊成一團。
 * 實測 390×844：把 service 的內文撐高 600px，data 的 pin-spacer 從 26503 移到 27097，
 * pin 卻仍在 26188 觸發 —— 誤差 909px。
 *
 * ⚠️ 為什麼是 ResizeObserver 而不是再補一個點狀 hook：上面兩項的共同點只有「高度變了」，
 *    來源列不完（往後新增的區塊只會更多）。守住結果比守住每一個成因可靠。
 * ⚠️ 為什麼要節流：列展開是 0.3s 的過渡，每一幀都會回報一次；全站重算（六個舞台 pin
 *    ＋ 各篇內文的 pin）不能跟著每幀打。settleDelay 等它安靜，上限則保證捲動途中
 *    持續變動時仍會定期落定一次。
 * ⚠️ 為什麼在 setTimeout 裡才 refresh：在 ResizeObserver 的 callback 內動版面會噴
 *    「ResizeObserver loop completed with undelivered notifications」。
 * ⚠️ 回授迴圈的防呆：refresh 自己會改寫 pin-spacer 的 padding ⇒ 高度再變一次 ⇒ RO 再叫。
 *    故落定後把基準更新成**重算後**的高度，下一次比對就不會再被自己觸發。
 */
let contentResizeHooked = false;
export function refreshOnContentResize(): () => void {
  if (contentResizeHooked) return () => {};
  if (typeof ResizeObserver === 'undefined') return () => {};
  contentResizeHooked = true;

  const target = document.body;
  let lastHeight = target.getBoundingClientRect().height;
  let firstPendingAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const settle = () => {
    timer = null;
    firstPendingAt = 0;
    const h = target.getBoundingClientRect().height;
    if (Math.abs(h - lastHeight) < CONTENT_RESIZE_EPS) return;
    refreshScrollTriggers();
    lastHeight = target.getBoundingClientRect().height;
  };

  const observer = new ResizeObserver(() => {
    const now = performance.now();
    if (!firstPendingAt) firstPendingAt = now;
    if (timer) clearTimeout(timer);
    timer = setTimeout(settle, settleDelay(firstPendingAt, now));
  });
  observer.observe(target);

  return () => {
    observer.disconnect();
    if (timer) clearTimeout(timer);
    timer = null;
    contentResizeHooked = false;
  };
}
