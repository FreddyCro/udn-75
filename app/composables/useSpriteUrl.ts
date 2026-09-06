import { spriteBase } from '~/utils/svg-sprite-ref';

// SVG sprite 的路徑前綴（單一來源）。
//
// 與 useAssetUrl() 的分工：
//   ・useAssetUrl()  → <img src>、CSS url()／mask-image 等**跨源也能用**的素材，吃
//                      APP_ASSETS_PATH（可為絕對 URL，資產得以放到別的 host）。
//   ・useSpriteUrl() → sprite 的 <use href>，只吃 app.baseURL，組出來的一定是純路徑
//                      ＝ 一定同源。理由與事故脈絡見 utils/svg-sprite-ref 的 spriteBase。
//
// baseURL 是 build 期常數（由 NUXT_URL 的 pathname 推出，見 nuxt.config），SSR 與
// client 兩邊一致，不會有 hydration mismatch。
export function useSpriteUrl() {
  const base = spriteBase(useRuntimeConfig().app.baseURL || '');
  return (path: string) => `${base}${path}`;
}
