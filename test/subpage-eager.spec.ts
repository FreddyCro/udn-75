import { describe, expect, it } from 'vitest';
import { shouldEagerHero } from '../app/utils/subpage-eager';

// 連續閱讀頁（/subpage）把六篇串在同一份文件，只有第一篇的 hero 在首屏；
// 其餘五篇的 hero 底圖與引言第一幀在 8,000–40,000 px 外，eager 就是首屏多 10 個 request。
// 單篇子頁（/news 等）沒有 stream，一律 eager（hero 就在首屏）。
describe('shouldEagerHero', () => {
  it('單篇子頁：一律 eager', () => {
    expect(shouldEagerHero(null, 'news')).toBe(true);
  });
  it('stream 為 undefined 時一律 eager（非目前實際路徑，僅為契約完整）', () => {
    // 實際呼叫路徑是 null（Subpage.vue 用 inject(SUBPAGE_STREAM_KEY, null)，見
    // utils/subpage-eager 的註解）；undefined 只是讓這支純函式對「沒有 stream」的兩種
    // 表達方式都成立，不要誤以為這是現行主要路徑。
    expect(shouldEagerHero(undefined, 'news')).toBe(true);
  });
  it('連續閱讀頁：只有第一篇 eager', () => {
    expect(shouldEagerHero({ firstSlug: 'news' }, 'news')).toBe(true);
    expect(shouldEagerHero({ firstSlug: 'news' }, 'visual')).toBe(false);
  });
});
