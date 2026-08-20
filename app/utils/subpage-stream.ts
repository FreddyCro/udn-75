// 手機版「連續閱讀頁」（pages/subpage.vue）的純函式：把六篇子頁串成一份文件時，
// 錨點 slug 與網址 hash 之間的換算。DOM／捲動在頁面與錨點元件裡，本檔不碰。

/** 各篇在連續閱讀頁上的標記屬性；錨點列的頁內捲動與 scroll-spy 都靠它找段落 */
export const SUBPAGE_ANCHOR_ATTR = 'data-subpage-anchor';

/**
 * 子頁路徑 → 錨點 slug。
 *
 * 資料來源是 locales/common.json 的 subpageAnchors[].url（形如 '/news'），
 * 連續閱讀頁的 hash 與段落標記都用去掉斜線的 slug（'news'）。
 * 容錯：已經是 slug、或帶了尾斜線／hash 的字串都收得下 —— 這條換算有六個呼叫端
 * （錨點列、rail、連續閱讀頁、首頁清單），寫寬一點比讓其中一個靜默失效好。
 */
export function anchorSlug(url: string): string {
  return url
    .trim()
    .replace(/[?#].*$/, '')
    .replace(/^\/+|\/+$/g, '');
}

/**
 * 網址 hash → 該落在哪一篇。
 *
 * `hash` 收 route.hash 原樣（含 '#'，可為空字串）。認不出來就回第一篇：
 * 連續閱讀頁沒有「不落在任何一篇」的狀態，而錯誤的 hash（舊連結、手打）不該讓頁面空白。
 */
export function streamTargetSlug(hash: string, slugs: readonly string[]): string {
  const first = slugs[0] ?? '';
  const want = anchorSlug(hash.replace(/^#/, ''));
  return want && slugs.includes(want) ? want : first;
}
