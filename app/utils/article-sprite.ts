import viewBoxMap from './article-sprite-viewbox.json';
import { spriteSymbolId } from './svg-sprite-ref';

/**
 * 六篇子頁的內文素材 → sprite（public/img/sprites/article.svg）內的位址。
 *
 * 為什麼做這一支：實測手機版連續閱讀頁（/subpage）點進去那一刻，一秒內湧出 62 個
 * request，其中 22 個是 SVG。正式站限流算的是時間窗內的次數，而那 62 個裡有 21 個是
 * JS/CSS —— 渲染關鍵的東西跟這些素材擠在同一個 burst，被擋掉就是跑版。
 * 收進 sprite 的 19 支（明確名單見 scripts/lib/sprite-sources.mjs）合起來只剩 1 個 request。
 *
 * ⚠️ 外部 `<use href>` 必須同源。跨源的 `<use>` 會被瀏覽器**靜默**擋下 —— 沒有 console
 * error、沒有網路錯誤、圖就是不見。同樣的警告見 art-sprite.ts 與 BlessingPartners.vue，
 * 由 test/asset-host-same-origin.spec.ts 守著。
 */
export const articleSpriteHref = (
  src: string,
  assetUrl: (path: string) => string,
): string => `${assetUrl('/img/sprites/article.svg')}#${spriteSymbolId(src)}`;

/**
 * 素材路徑 → 它的 viewBox，補到外層 `<svg>` 上。
 *
 * `<use>` 引用外部 sprite 時 viewBox 在 `<symbol>` 上，外層 `<svg>` 沒有內在尺寸；
 * 消費端只要有一邊的尺寸是 auto（`.award-timeline__year` 只定 height、
 * `.formula__box-logo` 是 `width: auto`），就得靠這個 viewBox 算比例，否則會退回
 * 替換元素的預設 300×150。
 *
 * 對照表由 scripts/build-svg-sprites.mjs 產生並 commit；素材換了就重跑
 * `pnpm assets:sprites`（同 sprite 產物本身，見 CLAUDE.md）。
 * 查不到直接丟錯：少一筆代表素材沒進 sprite，靜默退回預設尺寸比報錯難查太多。
 */
export const articleSpriteViewBox = (src: string): string => {
  const id = spriteSymbolId(src);
  const vb = (viewBoxMap as Record<string, string>)[id];
  if (!vb) {
    throw new Error(
      `[article-sprite] ${id} 不在 article.svg 裡。` +
        '新素材要先加進 scripts/lib/sprite-sources.mjs 的 ARTICLE_ART，再跑 pnpm assets:sprites。',
    );
  }
  return vb;
};
