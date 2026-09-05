import { describe, expect, it } from 'vitest';
import { buildSprite } from '../scripts/lib/svg-sprite.mjs';
import { isSvgPath, spriteSymbolId } from '../app/utils/svg-sprite-ref';

const A = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 232 64"><defs><clipPath id="clip0"><rect width="232" height="64"/></clipPath></defs><g clip-path="url(#clip0)"><rect width="10" height="10" fill="#000"/></g></svg>';
const B = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><defs><clipPath id="clip0"><rect width="100" height="50"/></clipPath></defs><path d="M0 0h1v1z" clip-path="url(#clip0)"/></svg>';
// Figma 匯出的形狀：根元素帶 fill="none"，子元素沒自帶 fill（描邊路徑）。
const C = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="none" stroke="red"><path d="M0 0h1v1z" stroke-width="2"/></svg>';
const D = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M0 0h1v1z" stroke="#000"/></svg>';

describe('buildSprite', () => {
  it('每個檔一個 <symbol>，id 照給、viewBox 保留；沒有 viewBox 的用 width/height 補', async () => {
    const out = await buildSprite([{ id: 'a', svg: A }, { id: 'b', svg: B }]);
    expect(out.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(out).toMatch(/<symbol id="a" viewBox="0 0 232 64">/);
    expect(out).toMatch(/<symbol id="b" viewBox="0 0 100 50">/);
    expect(out.match(/<symbol /g)).toHaveLength(2);
  });

  it('各檔內部 id 加前綴，Figma 匯出的 clip0 撞名不會互相覆蓋', async () => {
    const out = await buildSprite([{ id: 'a', svg: A }, { id: 'b', svg: B }]);
    expect(out).not.toMatch(/id="clip0"/);
    expect(out).toMatch(/id="a-clip0"/);
    expect(out).toMatch(/id="b-clip0"/);
    expect(out).toMatch(/url\(#a-clip0\)/);
    expect(out).toMatch(/url\(#b-clip0\)/);
  });

  it('根 <svg> 的呈現屬性要搬到 <symbol>，尤其是 fill="none"', async () => {
    // Figma 匯出一律在根元素寫 fill="none"，子元素只在要上色時才自帶 fill。
    // 少搬這個屬性，沒自帶 fill 的路徑會退回初始值 black，logo 上多出黑塊。
    const out = await buildSprite([{ id: 'a', svg: C }]);
    expect(out).toMatch(/<symbol id="a" viewBox="0 0 10 10"[^>]*\bfill="none"/);
    expect(out).toMatch(/<symbol id="a"[^>]*\bstroke="red"/);
  });

  it('結構性屬性不搬：symbol 的尺寸與縮放由 viewBox 和消費端決定', async () => {
    // width/height 由 <use> 的外層 svg 決定；preserveAspectRatio 是消費端的意圖
    // （UArtLine.vue 靠外層 svg 的 preserveAspectRatio="none" 拉伸），symbol 自帶會蓋掉它。
    const out = await buildSprite([{ id: 'a', svg: D }]);
    const symbol = out.match(/<symbol[^>]*>/)![0];
    expect(symbol).not.toMatch(/\bwidth=/);
    expect(symbol).not.toMatch(/\bheight=/);
    expect(symbol).not.toMatch(/\bpreserveAspectRatio=/);
    expect(symbol).not.toMatch(/\bxmlns=/);
    expect(symbol).toMatch(/\bviewBox="0 0 10 10"/); // 只有 viewBoxOf() 給的那一份
  });

  it('id 重複要直接丟錯，不能靜默覆蓋', async () => {
    await expect(buildSprite([{ id: 'a', svg: A }, { id: 'a', svg: B }])).rejects.toThrow(/重複/);
  });
});

describe('spriteSymbolId / isSvgPath', () => {
  it('symbol id ＝ 檔名去副檔名', () => {
    expect(spriteSymbolId('/img/blessing/partner-shopee.svg')).toBe('partner-shopee');
    expect(spriteSymbolId('/img/forum/forum1-title-pc-1.svg')).toBe('forum1-title-pc-1');
  });
  it('png 不進 sprite', () => {
    expect(isSvgPath('/img/blessing/partner-yungtay.png')).toBe(false);
    expect(isSvgPath('/img/blessing/partner-shopee.svg')).toBe(true);
  });
});
