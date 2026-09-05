import { PC_BREAKPOINTS, TABLET_BREAKPOINTS } from './constants';
import { spriteSymbolId } from './svg-sprite-ref';

export type ArtBp = 'pc' | 'pad' | 'mob';

/**
 * 藝術字素材 → sprite 內的位址。sprite 每斷點一支（scripts/build-svg-sprites.mjs），
 * 只抓當下斷點那一支：39 個 request 變 1 個。
 *
 * ⚠️ 外部 `<use href>` 必須同源：這裡組出的 href 帶著 `assetUrl()` 的完整路徑（含
 * `APP_ASSETS_PATH`），跨源的 `<use>` 會被瀏覽器**靜默**擋下——沒有 console error、
 * 沒有網路錯誤、圖就是不見。三支 sprite、104 個 symbol 全部經過這支函式；四個部署目標
 * 的 `NUXT_PUBLIC_APP_ASSETS_PATH` 目前都與頁面同 host（見 `.env.*.example`，
 * `test/asset-host-same-origin.spec.ts` 守著），但如果哪天為了同一個 429 問題改用
 * `app.cdnURL` 把資產搬去別的 host，這裡會整組跨源、整組消失且沒有任何錯誤訊號。
 * 同樣的警告也寫在 BlessingPartners.vue（partners.svg 的 `<use>`）。
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
