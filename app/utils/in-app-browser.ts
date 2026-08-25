// in-app WebView（LINE／Facebook／Instagram 的內建瀏覽器）偵測。
//
// 為什麼需要它：這頁大概率是從 LINE 分享出去的，而 iOS 的 in-app 瀏覽器是 WKWebView ——
// WebKit 看到 <a download> 會在 navigation policy 階段就判定「這是下載」，轉交給
// WKDownloadDelegate；host App 沒實作就直接取消，使用者點下去**完全沒反應、也沒有錯誤訊息**。
// 注意那一步比「要不要開新分頁」更早，所以 target="_blank" 救不到，只有拿掉 download 才行。
// Android 版的 LINE WebView 同樣的毛病，故這裡不分平台一起認。
//
// 沒有 feature detect 可以問「這個 WebView 支不支援下載」，只能認 UA。認不出來的冷門
// WebView 就吃不到這條保護，但 LINE／FB／IG 已覆蓋分享流量的絕大多數。
//
// UA 樣本：
//   LINE iOS      ... Line/14.2.0
//   Facebook      ... FBAN/FBIOS;FBAV/456.0...   （Android 版只有 FBAV）
//   Instagram     ... Instagram 300.0.0 (iPhone...)
const IN_APP_UA = /Line\/|FBAN|FBAV|Instagram/i;

/**
 * 目前是否跑在 in-app WebView 裡。
 *
 * ⚠️ 只能在瀏覽器端（onMounted 之後）呼叫來**改變**已渲染的 DOM 屬性。
 *    SSR／prerender 沒有 navigator，這裡回 false，讓首次渲染一律走「正常瀏覽器」那條；
 *    呼叫點掛載後才換值 —— 同 ~/utils/share.ts 的 useLineShareUrl()，
 *    在模組頂層或 setup 期間就依 UA 定案會造成 hydration attribute mismatch。
 */
export function detectInAppBrowser() {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return false;
  }

  return IN_APP_UA.test(navigator.userAgent);
}
