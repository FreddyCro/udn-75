import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// NmdAuthor 的名字欄寬度上限（--maxWidth）決定名單的斷行位置，對稿是 mob 120 / pad-pc 180px。
//
// ⚠️ 這裡曾經反過來要求「一律用 em、不可寫死 px」，想讓欄寬跟著 in-app 被放大的字一起長。
//    那是錯的：`em` 從 **specified** font size 解析，而 Android WebView 的 text zoom 乘在
//    **computed** font size 上 → 8em 在 LINE 裡仍然是 8 × 15px ＝ 120px，與寫死 px 完全一樣。
//    2026-08-27 於 Pixel 9a ╱ LINE 實機驗證（em / ch / -webkit-text-size-adjust 全部無效）。
//
// 真正的解法是全站把字級除掉量測到的倍率 --tz（build/text-zoom-normalize.ts）；字級回到
// 設計值之後，這裡就該是單純的對稿 px —— 用 em 只會讓下一個人以為問題已經處理掉了。
describe('AppFooter 的 --maxWidth', () => {
  const src = readFileSync('app/components/ui/AppFooter.vue', 'utf8');
  const decls = [...src.matchAll(/--maxWidth:([^;]+);/g)].map((m) =>
    m[1].trim(),
  );

  it('mob 與 tablet 各宣告一次', () => {
    expect(decls).toHaveLength(2);
  });

  it('用對稿 px，不可用 em（em 追不上 in-app 的 text zoom，會誤導）', () => {
    for (const v of decls) expect(v).toMatch(/^[0-9.]+px$/);
  });

  it('值就是設計稿的 120 / 180px', () => {
    expect(decls.map((v) => Number.parseFloat(v))).toEqual([120, 180]);
  });
});
