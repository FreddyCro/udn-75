import { describe, expect, it } from 'vitest';
import { dedupeTopLevelFontFace } from '../build/dedupe-font-face';
import { aliasDemotedPageChunks } from '../build/preload-page-chunks';

describe('dedupeTopLevelFontFace', () => {
  it('留下第一條、丟掉逐位元組相同的重複', () => {
    const block = '@font-face{font-family:"Noto Sans TC";src:url(/a.woff2)}';
    const css = `${block}${block}${block}.x{color:red}`;
    expect(dedupeTopLevelFontFace(css)).toBe(`${block}.x{color:red}`);
  });

  it('內容不同就都保留（不做正規化或語意比對）', () => {
    // 只差一個 unicode-range，是兩條不同的宣告，不可合併。
    const a =
      '@font-face{font-family:"N";src:url(/a.woff2);unicode-range:U+4E00}';
    const b =
      '@font-face{font-family:"N";src:url(/a.woff2);unicode-range:U+4E01}';
    expect(dedupeTopLevelFontFace(a + b)).toBe(a + b);
  });

  it('空白差異視為不同（刻意的：只認逐位元組相同）', () => {
    const a = '@font-face{font-family:"N"}';
    const b = '@font-face { font-family:"N" }';
    expect(dedupeTopLevelFontFace(a + b)).toBe(a + b);
  });

  it('不跨 at-rule 層級去重：@media 內的同名宣告要留著', () => {
    const block = '@font-face{font-family:"N";src:url(/a.woff2)}';
    const css = `${block}@media print{${block}}`;
    // 巢在 @media 裡的那條在不同條件下才生效，語意不同，必須原樣保留。
    expect(dedupeTopLevelFontFace(css)).toBe(css);
  });

  it('離開 @media 之後仍認得 top level（depth 計數要回到 0）', () => {
    const block = '@font-face{font-family:"N";src:url(/a.woff2)}';
    const css = `@media print{.x{color:red}}${block}${block}`;
    expect(dedupeTopLevelFontFace(css)).toBe(
      `@media print{.x{color:red}}${block}`,
    );
  });

  it('字串常值裡的大括號不會打亂 depth 計數', () => {
    // url 帶了 '{' —— 若沒跳過字串常值，depth 會歪掉、後面的重複就抓不到。
    const weird = '.a{background:url("x{y.png")}';
    const block = '@font-face{font-family:"N"}';
    expect(dedupeTopLevelFontFace(`${weird}${block}${block}`)).toBe(
      `${weird}${block}`,
    );
  });

  it('沒有 @font-face 就原樣回傳', () => {
    const css = '.a{color:red}.b{color:blue}';
    expect(dedupeTopLevelFontFace(css)).toBe(css);
  });

  it('重現實測形狀：同一組 subset 被複製 9 份 → 只剩 1 份', () => {
    const subset = Array.from(
      { length: 105 },
      (_, i) =>
        `@font-face{font-family:"Noto Sans TC";src:url(/f-${i}.woff2);unicode-range:U+${i}}`,
    ).join('');
    const out = dedupeTopLevelFontFace(subset.repeat(9));
    expect(out).toBe(subset);
    expect(out.match(/@font-face/g)).toHaveLength(105);
  });
});

describe('aliasDemotedPageChunks', () => {
  it('替共享 chunk 形態的 dynamic entry 補上 pages/<name>.vue 別名', () => {
    const indexEntry = {
      file: 'C7tgiC4b.js',
      name: 'index',
      isDynamicEntry: true,
    };
    const manifest: Record<string, typeof indexEntry> = {
      '_C7tgiC4b.js': indexEntry,
    };
    aliasDemotedPageChunks(manifest);
    // 指向同一個物件（manifest 內部大量共用參考，複製會壞掉）
    expect(manifest['pages/index.vue']).toBe(indexEntry);
  });

  it('不覆蓋已存在的 key', () => {
    const real = { file: 'real.js', name: 'news', isDynamicEntry: true };
    const shared = { file: 'shared.js', name: 'news', isDynamicEntry: true };
    const manifest = { 'pages/news.vue': real, '_shared.js': shared };
    aliasDemotedPageChunks(manifest);
    expect(manifest['pages/news.vue']).toBe(real);
  });

  it('不碰非 dynamic entry、也不碰有 src 對應（無底線前綴）的 key', () => {
    const manifest = {
      '_vendor.js': { file: 'vendor.js', name: 'vendor' }, // 非 dynamic entry
      'components/DevCoreProgress.vue': {
        file: 'Dev.js',
        name: 'DevCoreProgress',
        isDynamicEntry: true,
      },
    };
    aliasDemotedPageChunks(manifest);
    expect(Object.keys(manifest).sort()).toEqual([
      '_vendor.js',
      'components/DevCoreProgress.vue',
    ]);
  });
});
