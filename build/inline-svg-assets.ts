/**
 * Vite `build.assetsInlineLimit` 的判斷函式：哪些 import 進來的資產要轉成 data URI。
 *
 * 專案原本設 0（全部輸出實體檔）—— UPic/UVid 的圖片走 runtimeConfig 的 APP_ASSETS_PATH
 * 在 runtime 組路徑，需要檔案真的存在。那個理由只適用 public/ 下的圖；這裡列的是
 * `app/assets/img/` 內、由 `import` 或 SCSS `url()` 引用的小 SVG：
 *   ・logo.svg：<img> 與 CSS mask 各抓一次（抓取模式不同、快取 key 不同），實測一頁 5 次。
 *   ・箭頭與 AI spark：CSS mask 用，每頁固定要，各 1–4 KB。
 *   ・nav 三顆箭頭（next／prev／prev_hover）：<img> 抓取，子頁 SubpageNav／SubpageWork／
 *     AiImageQuiz 共用，實測各被抓 2–3 次（<img> 快取 key 各自獨立）。
 * 內嵌後這些 request 直接消失。
 *
 * 白名單而不是「所有 SVG」：face.webp 之類的大圖要留給 Image()/canvas 抓實體檔。
 */
const INLINE_NAMES = new Set([
  'logo.svg',
  'udn75_arrow_circle.svg',
  'udn75_arrow_circle_hover.svg',
  'udn75_arrow_pixel.svg',
  'udn75_data_ai_spark.svg',
  'udn75_nav_next.svg',
  'udn75_nav_prev.svg',
  'udn75_nav_prev_hover.svg',
]);

export function shouldInlineAsset(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  if (!/\/app\/assets\/img\//.test(normalized)) return false;
  const name = normalized.slice(normalized.lastIndexOf('/') + 1);
  return INLINE_NAMES.has(name);
}
