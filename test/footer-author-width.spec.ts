import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// NmdAuthor 的名字欄寬度上限（--maxWidth）決定名單的斷行位置，而它的字級是固定 15px。
// 寫死 px 時會變成「字放大、欄寬不動」：Android WebView 預設把系統的「字體大小」設定當
// textZoom 套用（LINE 這類 in-app 瀏覽器就是 WebView，且沒呼叫 setTextZoom(100) 關掉它），
// mob 兩個名字實寬 7 個全形字 ＝ 105px，離 120px 只剩一個字的餘裕 —— 系統字級往上調一格
// （約 115%）就擠不下，斷成一行一個名字。用 em 則欄寬跟著放大的字一起長，斷行位置不隨
// 字級縮放而變。完整說明見 app/components/ui/AppFooter.vue 的註解。
describe('AppFooter 的 --maxWidth', () => {
  const src = readFileSync('app/components/ui/AppFooter.vue', 'utf8');
  const decls = [...src.matchAll(/--maxWidth:([^;]+);/g)].map((m) =>
    m[1].trim(),
  );

  it('mob 與 tablet 各宣告一次', () => {
    expect(decls).toHaveLength(2);
  });

  it('一律用 em，不可寫死 px（會被 WebView 的 textZoom 打斷行）', () => {
    for (const v of decls) expect(v).toMatch(/^[0-9.]+em$/);
  });

  it('em 值換算回設計稿的 120 / 180px（NmdAuthor 字級固定 15px）', () => {
    expect(decls.map((v) => Number.parseFloat(v) * 15)).toEqual([120, 180]);
  });
});
