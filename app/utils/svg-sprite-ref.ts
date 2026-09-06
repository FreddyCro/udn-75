/**
 * locales JSON 裡的素材路徑（/img/blessing/partner-shopee.svg）↔ sprite 內的 symbol id。
 * 規則只有一條：id ＝ 檔名去副檔名。scripts/build-svg-sprites.mjs 用同一條規則產 sprite，
 * 兩邊不會分岔（test/sprite-coverage.spec.ts 對帳）。
 */
export const spriteSymbolId = (publicPath: string): string => {
  const name = publicPath.slice(publicPath.lastIndexOf('/') + 1);
  return name.replace(/\.[^.]+$/, '');
};

export const isSvgPath = (publicPath: string): boolean => /\.svg$/i.test(publicPath);

/**
 * sprite 的 URL 前綴：由 `app.baseURL` 組成的**純路徑**（去尾斜線），永遠不帶 origin。
 *
 * ⚠️ 外部 `<use href>` 必須同源，跨源會被瀏覽器**靜默**擋下（沒有 console error、
 * 沒有網路錯誤，圖就是不見）。sprite 因此刻意**不走** `useAssetUrl()`／`APP_ASSETS_PATH`
 * —— 後者是為了「圖片可能放 CDN」而存在的絕對 URL，跟 `<use>` 的同源限制本質衝突：
 * 2026-09-06 正式站踩過：站台只有一份 build（`.env.production`，部署在
 * vip.udn.com/newmedia/2026/udn75），udn75.udn.com 是把它代理出去的前台 —— 它會把 HTML 裡
 * 「引號後接 /newmedia/2026/udn75」的**相對**路徑改寫成 `/`（`_nuxt`、payload 裡的
 * `baseURL` 都被改到了），但改不到 ASSETS_PATH 組出來的**絕對** URL。於是頁面 origin 是
 * udn75、sprite href 卻指向 vip，三支 sprite 整組跨源、無聲消失。
 * 綁 baseURL 之後兩邊都對：vip 上是 /newmedia/2026/udn75/img/sprites/…，udn75 上被前台
 * 改寫成 /img/sprites/…（兩者實測皆 200）。見 test/sprite-same-origin-href.spec.ts。
 *
 * ⚠️ 反過來說 ASSETS_PATH **應該**維持絕對 URL：`app.vue` 的 og:image 靠它組出可分享的
 * 完整網址，改成相對路徑會讓社群爬蟲抓不到縮圖。兩者職責不同，不要合併。
 *
 * sprite 產物在 `public/img/sprites/`，Nuxt 會把 public/ 放到輸出根目錄、掛在 baseURL 底下，
 * 所以 `${spriteBase(baseURL)}/img/sprites/x.svg` 一定指得到（四個部署目標皆已對過）。
 */
export const spriteBase = (baseURL: string): string => baseURL.replace(/\/+$/, '');
