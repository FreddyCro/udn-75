import { PC_BREAKPOINTS, TABLET_BREAKPOINTS } from './constants';
import { spriteSymbolId } from './svg-sprite-ref';

export type ArtBp = 'pc' | 'pad' | 'mob';

/**
 * 藝術字素材 → sprite 內的位址。sprite 每斷點一支（scripts/build-svg-sprites.mjs），
 * 只抓當下斷點那一支：39 個 request 變 1 個。
 *
 * ⚠️ 外部 `<use href>` 必須同源，跨源會被瀏覽器**靜默**擋下——沒有 console error、
 * 沒有網路錯誤、圖就是不見。三支 sprite、104 個 symbol 全部經過這支函式，所以 `urlFn`
 * **必須是 `useSpriteUrl()`（只吃 app.baseURL ＝ 純路徑）而不是 `useAssetUrl()`**
 * （吃 APP_ASSETS_PATH，是絕對 URL，代理前台改寫不到）。2026-09-06 正式站就是踩這個：
 * 頁面在 udn75.udn.com、sprite href 卻指向 vip.udn.com，整組藝術字與夥伴 logo 無聲消失。
 * 界線由 `test/sprite-same-origin-href.spec.ts` 守著；同樣的警告見 article-sprite.ts
 * 與 BlessingPartners.vue（partners.svg 的 `<use>`）。
 */
export const artSpriteHref = (
  src: string,
  bp: ArtBp,
  assetUrl: (path: string) => string,
): string => `${assetUrl(`/img/sprites/art-${bp}.svg`)}#${spriteSymbolId(src)}`;

/**
 * 視窗寬 → 斷點。界線＝ UArtLine.vue 的 SCSS：pc 從 PC_BREAKPOINTS(1280) 起、
 * pad 從 TABLET_BREAKPOINTS(768) 起、其餘 mob。純函式，給 useArtBreakpoint 與測試共用。
 */
export const pickArtBreakpoint = (width: number): ArtBp =>
  width >= PC_BREAKPOINTS ? 'pc' : width >= TABLET_BREAKPOINTS ? 'pad' : 'mob';
