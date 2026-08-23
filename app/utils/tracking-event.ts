// GA4 事件送出（單一出口）。載入端在 ~/utils/tracking.ts，本檔只負責「送」。
//
// 作法比照姊妹專案 the-love-report 的 `app/composables/useTrackingEvent.ts`，但**參數模型不同**：
// 那邊的 sendGA 是 `{ event_category: category, [category]: label }`，而 category 恆為 'term'
// —— 等於一個事件只帶一個自訂參數。本專案的事件表（見 temp/2026-08-23-ga-event-spec.md）
// 要 `area` ＋ `term` 兩個參數，另有 `site`，故簽名改成收任意 params。
//
// 為什麼放 utils 而不是 composables：這裡全是純函式、不碰 Vue context（同 utils/tracking.ts
// 的 useTracking 也是純函式的分工）。需要 onMounted／router 的那半在
// plugins/ga-section-view.client.ts。
//
// gtag() 由 utils/tracking.ts 注入的 inline script 宣告；它本身就是 dataLayer.push 的包裝，
// 故送一次同時餵得到 GA4 與 GTM 容器端的 Custom Event 觸發條件，不必另外 push dataLayer。
//
// 沒有 window.ga（UA / analytics.js）分支：the-love-report 留著那段是歷史包袱，
// 本專案的 tracking.ts 從頭就只載 gtm.js，UA 也已於 2023-07 停止收資料。

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 自訂參數。本專案用到的 key：area / term / site */
export type GAParams = Record<string, string>;

/**
 * 送一筆 GA4 事件。SSR 與「gtag 還沒到位」一律靜默跳過 ——
 * 追蹤碼是外部資源，擋掉或載入失敗時不該讓互動流程噴錯。
 */
export function sendGA(action: string, params: GAParams = {}) {
  if (!import.meta.client || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
}

// ── section_view ────────────────────────────────────────────────────────────
//
// 去重集中在這一個閘門，是整套設計最重要的穩定性保證：
// 觸發來源有三種（IntersectionObserver、既有 ScrollTrigger 的進度門檻、既有 Vue 狀態），
// 而後兩者天生會重複發火 —— ScrollTrigger 的 onUpdate 每幀都跑，onRefresh 在字體 swap、
// 斷點變動、內容長高時還會再跑一輪（見 plugins/content-resize-refresh.client.ts）。
// 把「只送一次」收在出口，來源端就可以無腦亂送，不必各自維護旗子。
const firedSectionViews = new Set<string>();

/** 同一次 page_view 內，同一個 term 只送一次 */
export function gaSectionViewOnce(term: string) {
  if (!import.meta.client || !term || firedSectionViews.has(term)) return;
  firedSectionViews.add(term);
  sendGA('section_view', { term });
}

/**
 * 清空已送紀錄。換頁時呼叫（見 plugins/ga-section-view.client.ts）——
 * GA4 的語意是「每次 page_view 各自計算」，回訪同一頁應該再算一次。
 */
export function resetSectionViews() {
  firedSectionViews.clear();
}

// ── 點擊事件 ────────────────────────────────────────────────────────────────
//
// term 值一律用英文 slug（事件表「主頁」那份的 Parameter_value 欄）。GTM 設定表寫「連結文字」
// 只是欄位說明，不是實際值。

/** 選單／錨點列。term: symposium | benediction | newmedia */
export function gaClickMenu(term: string) {
  sendGA('click_menu', { term });
}

/** 智慧心媒體錨點。term: news | visual | service | data | education | health */
export function gaClickAnchor(term: string) {
  sendGA('click_anchor', { area: 'newmedia', term });
}

/** 現場活動外連新聞。term: garcia | tsmc01 | converged_media | tsmc02 */
export function gaClickNews(term: string) {
  sendGA('click_news', { area: 'symposium', term });
}

/**
 * 外連網頁。area 依連結性質分流（事件表 §3.5–3.10）：
 *   button  事件表原有的 5 顆 CTA
 *   signup  論壇報名／議程下載
 *   partner 永續祝福夥伴 logo
 *   works   子頁得獎作品
 *   inline  內文（v-html）連結
 *   nav     子頁上下篇導覽
 */
export type GAButtonArea =
  | 'button'
  | 'signup'
  | 'partner'
  | 'works'
  | 'inline'
  | 'nav';

export function gaClickButton(area: GAButtonArea, term: string) {
  sendGA('click_button', { area, term });
}

// ── 共用元件事件 ────────────────────────────────────────────────────────────
//
// 站台代號固定 udn75（事件表的 site 參數）。不做成參數：它是專題身份，
// 一個 build 只會有一個值，開成參數只會多一個可以填錯的地方。
const SITE = 'udn75';

/** 分享到社群。net: facebook | line | twitter */
export function gaShare(net: string) {
  sendGA(`share_${net}`, { site: SITE });
}

/** 前往聯合報社群。net: facebook | youtube | line | instagram */
export function gaSocialMedia(net: string) {
  sendGA(`social_media_${net}`, { site: SITE });
}

/** 站台頁尾連結。key: vip | privacy | service */
export function gaFooterLink(key: string) {
  sendGA(`footer_${key}`, { site: SITE });
}

/** 專題 logo */
export function gaLogo() {
  sendGA('logo', { site: SITE });
}
