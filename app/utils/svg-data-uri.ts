/**
 * SVG 原始碼 → data URI。給 CSS `url()`（mask / background）與 `<img src>` 用。
 *
 * 用 encodeURIComponent 而不是 base64：SVG 是文字，percent-encoding 後 gzip 得比 base64 小，
 * 且 `#`（fragment）、`"`（提前結束 url("…")）、`<` 等會壞掉的字元都會被編掉。
 *
 * `encodeURIComponent` 不編 `'`：消費端有兩種 `url()` 包法並存
 * （`useArtMask.ts` 用雙引號 `url("…")`、`MediaList.vue` 用單引號 `url('…')`），
 * 若 SVG 本身帶單引號（屬性值慣例、`<?xml version='1.0'?>` 等），就會在單引號包法那端
 * 把字串提前截斷，且不會有 build error 或測試失敗、只是圖悄悄不見。故額外把 `'` 編成
 * `%27`，讓兩種引號包法都安全。
 */
export const svgDataUri = (svg: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg).replace(/'/g, '%27')}`;
