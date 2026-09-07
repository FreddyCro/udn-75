/**
 * 把 client manifest 各 entry 的圖片類 assets 拿掉，Nuxt 就不會為它們發
 * `<link rel="prefetch" as="image">`。
 *
 * 為什麼：face.webp 實測被抓兩次 —— prefetch 那條沒帶 crossorigin，而 SymbolFace 用
 * `Image()` + `crossOrigin='anonymous'` 抓（畫進 canvas 要 CORS），兩者的快取 key 不同，
 * prefetch 那份完全白抓。logo.svg 同理。這些圖真正的載入時機由元件自己決定。
 *
 * 只動 assets（圖片 hint），不碰 css / dynamicImports，chunk 的 preload 完全不受影響。
 */
const IMAGE_RE = /\.(webp|svg|png|jpe?g|gif|avif)$/i;

export function stripImagePrefetch(
  manifest: Record<string, { assets?: string[] }>,
): number {
  let removed = 0;
  for (const entry of Object.values(manifest)) {
    if (!entry.assets) continue;
    const kept = entry.assets.filter((a) => !IMAGE_RE.test(a));
    removed += entry.assets.length - kept.length;
    entry.assets = kept;
  }
  return removed;
}
