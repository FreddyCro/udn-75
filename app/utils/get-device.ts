/**
 * 依視窗寬度判斷該取哪一組裝置素材（mob / pad / pc）。
 *
 * ⚠️ 這裡的界線與 SCSS 的 `$breakpoints`（mixins.scss）**不是同一組**，是刻意的：
 *    版型的 pc 斷點是 1280（PC_BREAKPOINTS），而**素材**的界線由那組素材當初是照什麼
 *    尺寸剪的決定。hero 影片三支變體就是照 768 / 1024 剪的（見 HeroVideo.vue 的
 *    「pad 只涵蓋 768–1023」與 hero-video-config.ts），所以預設留在 1024。
 *
 * @param pcFrom pc 的下界（含），預設 1024 ＝ 專案原本的界線。
 *        素材是照別的界線剪的時候才傳 —— 例如子頁引言媒體要與版型的 pc 斷點對齊，
 *        傳 PC_BREAKPOINTS（1280）⇒ pad 涵蓋 768–1279（見 SubpageIntroMedia）。
 *        ⚠️ 傳值只影響 pad/pc 的分界，mob 的 767 界線不動（三組素材的 mob 都同一條線）。
 */
function getDeviceTypeByResolution(pcFrom = 1024) {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mob';
  if (window.matchMedia(`(max-width: ${pcFrom - 1}px)`).matches) return 'pad';
  return 'pc';
}

export { getDeviceTypeByResolution };
