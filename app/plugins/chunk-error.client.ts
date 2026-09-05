/**
 * route chunk 載入失敗時的處理。
 *
 * Nuxt 預設（emitRouteChunkError: 'automatic'）是換頁時 chunk 抓不到就整頁 reload。
 * 正式站被 429 限流時這就是連鎖反應：一支 chunk 被擋 → 整頁重載 → 再打兩三百個 request
 * → 更多 429。故 nuxt.config 改成 'manual'，由這裡接手：
 *   ・延遲 3 秒再 reload，讓限流的時間窗先過去；
 *   ・每個分頁 session 最多 reload 一次（sessionStorage 記號），第二次就放著讓使用者自己重整。
 */
const KEY = 'udn75:chunk-reloaded';
const DELAY_MS = 3000;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:chunkError', () => {
    let already = false;
    try {
      already = sessionStorage.getItem(KEY) === '1';
    } catch {
      /* 隱私模式等情況拿不到 sessionStorage：當作沒 reload 過 */
    }
    if (already) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* 同上 */
    }
    // ⚠️ 不要加 `persistState: true`。它只是把目前的 Nuxt state 寫進 sessionStorage 的
    // `nuxt:reload:state`，**要 `experimental.restoreState` 有開才會在重載後被讀回來**，
    // 而本專案沒開（純靜態站、全站沒有 useAsyncData / useFetch，沒有狀態需要跨重載保留）。
    // 加了等於白寫一份沒人讀的資料進 sessionStorage 再留在那裡。
    setTimeout(() => reloadNuxtApp(), DELAY_MS);
  });
});
