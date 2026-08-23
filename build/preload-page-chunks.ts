/**
 * 把「被降級成共享 chunk、因而在 client manifest 裡失去 `pages/*.vue` key」的頁面 chunk
 * 補回一個別名 key，讓 SSR 的 resource hints 能重新為它發出 `<link rel="modulepreload">`。
 *
 * ## 症狀
 *
 * 實測 build 產物：`news/index.html` 有 17 條 modulepreload（含它自己的 route chunk
 * `DPBhXoNL.js`），而 `index.html` 只有 10 條 —— 缺的正是首頁自己的 route chunk
 * `C7tgiC4b.js`（664,570 B）與它的 `index.*.css`（63,650 B）。
 *
 * 於是首頁變成三段序列瀑布：
 *
 *     index.html → BpqDJIvv.js（308 KB entry）→ C7tgiC4b.js（665 KB route）→ face.png / hero mp4
 *
 * 中間那一跳是白等的：瀏覽器得先把 entry 下載並執行完，才「發現」還要再抓 665 KB。
 *
 * ## 成因
 *
 * `pages/index.vue` 在 manifest 裡**沒有 key**，它的 chunk 被 rollup 命名成 `_C7tgiC4b.js`
 * （底線前綴 ＝ 共享 chunk）。原因是 `app/pages/index.vue` 的 `<LazyDevCoreProgress>`：
 * 那支除錯面板是首頁的 lazy 子節點，但它自己又 static import 了被歸進首頁 chunk 的共用碼，
 * 形成一條回邊（page chunk ← 它的 lazy 子 chunk）。有回邊的 chunk 就不再是單純的
 * dynamic entry，於是失去 `src` 對應。
 *
 * ⚠️ 這**不是** `Lazy` 前綴用錯了 —— 那是刻意的（見 index.vue 的註解：要讓 production
 *    preview 也能用 `?pathdebug`）。真正壞掉的只是 manifest 的鍵值對應，所以這裡補鍵，
 *    不動應用層的決定。
 *
 * ## 做法
 *
 * SSR 期間 `ssrContext.modules` 記的是模組**原始路徑**（如 `pages/index.vue`），
 * vue-bundle-renderer 拿它去 manifest 查表；查不到就什麼 hint 都不發。
 * 這裡替每個「共享 chunk 形態的 dynamic entry」補上 `pages/<name>.vue` 別名，
 * 指向同一個 entry 物件（同一個參考，不複製），查表就會命中。
 *
 * 已存在同名 key 的不覆蓋 —— 正常的頁面（news / visual / …）本來就有 key，不該被碰。
 */
type ManifestEntry = {
  file?: string;
  name?: string;
  src?: string;
  isEntry?: boolean;
  isDynamicEntry?: boolean;
  [key: string]: unknown;
};

export function aliasDemotedPageChunks(
  manifest: Record<string, ManifestEntry>,
  log: (msg: string) => void = () => {},
): void {
  for (const [key, entry] of Object.entries(manifest)) {
    // 只看「底線前綴 ＝ 沒有 src 對應」的共享 chunk。正常頁面的 key 就是 src 路徑。
    if (!key.startsWith('_')) continue;
    if (!entry.isDynamicEntry) continue;
    if (!entry.name) continue;

    const alias = `pages/${entry.name}.vue`;
    if (manifest[alias]) continue;

    // 指向同一個物件，不是複本：manifest 內部大量共用參考（styles / preload 互相引用），
    // 複製一份會讓後續處理看到兩個不同一的 entry。
    manifest[alias] = entry;
    log(`preload-page-chunks: 補上 ${alias} -> ${entry.file} 的 manifest 別名`);
  }
}
