import type { ForumTextArtSrc } from '~/types/forum';
import { inlineArtUrl } from '~/utils/inline-art';

/**
 * 稿字形素材 → 「mask ＋ currentColor」用的 inline style。
 *
 * 與 <UArtLine>（素材走 background-image）的分工：
 *   UArtLine  文章裡的展示型長文字 —— 逐斷點各一份素材、寬度吃 em，顏色恆定。
 *   本工具    需要**跟著文字色變**的小素材（header 錨點：白底灰字／黑底白字／橘底白字）。
 *             background-image 上不了色，故改用 mask 把素材當形狀、顏色交給 currentColor
 *             （手法同 SubpageAnchorBar／SubpageAnchor 的藝術字）。
 *
 * 寬高直接寫成 px：消費端的稿都是固定字級（錨點列 pc 18px、選單 46px），
 * 不隨視窗流動縮放，故不必像 UArtLine 那樣換算 em。
 * 盒子的寬高比恆等於素材原生比例 → mask-size 用 100% 100% 不會變形。
 */
export function useArtMask() {
  // JSON 的路徑是站台根寫法（/img/...），塞進 url() 前要補 APP_ASSETS_PATH，
  // 否則子路徑部署（GitHub Pages 的 /udn-75/）會解析到 origin 根而 404。
  const assetUrl = useAssetUrl();

  // 內嵌表有的就用 data URI（沒有 request、也沒有重複抓取），沒有的退回資產路徑。
  return (src: ForumTextArtSrc) => ({
    '--art': `url("${inlineArtUrl(src.src) ?? assetUrl(src.src)}")`,
    width: `${src.w}px`,
    height: `${src.h}px`,
  });
}
