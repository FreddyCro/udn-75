import { describe, expect, it } from 'vitest';
import { shouldInlineAsset } from '../build/inline-svg-assets';

// assetsInlineLimit 原本是 0（全部輸出成檔案）——因為 UPic/UVid 的圖是 runtime 組路徑、
// 需要實體檔。這裡只把「被 CSS mask / <img> 引用、每頁都要、幾 KB 到幾十 KB」的小圖
// 轉成 data URI：一次少 5–10 個 request，也解掉 <img> 與 mask 抓取模式不同造成的重複下載。
describe('shouldInlineAsset', () => {
  it('assets/img 下的白名單 SVG 內嵌', () => {
    expect(shouldInlineAsset('C:\\p\\app\\assets\\img\\logo.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_arrow_circle.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_arrow_circle_hover.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_arrow_pixel.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_data_ai_spark.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_nav_next.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_nav_prev.svg')).toBe(true);
    expect(shouldInlineAsset('/p/app/assets/img/udn75_nav_prev_hover.svg')).toBe(true);
  });
  it('其餘一律輸出成檔案（face.webp 要給 Image() 抓、也要留給 canvas）', () => {
    expect(shouldInlineAsset('/p/app/assets/img/face.webp')).toBe(false);
    expect(shouldInlineAsset('/p/app/assets/img/face.png')).toBe(false);
    expect(shouldInlineAsset('/p/public/img/udn75_anchor_num_01.svg')).toBe(false);
  });
});
