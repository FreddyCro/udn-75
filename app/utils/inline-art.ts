/**
 * 「每頁固定要、幾 KB 到幾十 KB」的稿字形 SVG，build 時內嵌成 data URI，不再各發一個 request。
 *
 * 涵蓋：header 錨點列（pc）與漢堡選單（menu）的三組藝術字、MediaList / SubpageAnchor 的
 * 編號 01–06。
 * 這些檔在 locales JSON 裡是「站台根目錄」寫法（/img/header/anchor-forum-pc.svg），
 * 元件拿到路徑後查這張表；查不到（未列入的圖）就回 null，呼叫端退回原本的 assetUrl() 路徑。
 *
 * 為什麼：實測這批圖一頁被抓 2–5 次（<img> 與 CSS mask 的抓取模式不同、快取 key 不同），
 * 首頁 header 三張各 19–23 次（pin 段落造成的重複套用）。data URI 沒有 request，問題整組消失。
 *
 * ⚠️ 走 `?raw` 再自己編碼，不用 Vite 的 `?inline`：public/ 下的檔案 Vite 不允許用一般 asset
 *    語法 import，`?raw` 是專案既有、已驗證可用的路徑（見 Subpage.vue 的 heroArtRaw）。
 */
import { svgDataUri } from './svg-data-uri';

const rawByPath = import.meta.glob(
  [
    '~~/public/img/header/anchor-*.svg',
    '~~/public/img/udn75_anchor_num_*.svg',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

// glob 的 key 是 `/public/img/...`（相對專案根）；locales 寫的是 `/img/...`。統一成後者。
const uriByPublicPath = new Map<string, string>();
for (const [key, raw] of Object.entries(rawByPath)) {
  const idx = key.indexOf('/img/');
  // fail-loud：上面的 glob pattern 寫死在 public/img 下，正常情況 idx 必為非負。
  // 一旦 glob 改動讓 key 不再含 `/img/`，indexOf 回 -1、slice(-1) 會靜默切出錯誤的
  // key（掉最後一個字元），查表全部失效卻沒有任何錯誤訊號——寧可在這裡直接炸掉。
  if (idx === -1) throw new Error(`[inline-art] glob 匹配到非預期路徑：${key}`);
  const publicPath = key.slice(idx);
  uriByPublicPath.set(publicPath, svgDataUri(raw));
}

export function inlineArtUrl(publicPath: string): string | null {
  return uriByPublicPath.get(publicPath) ?? null;
}
