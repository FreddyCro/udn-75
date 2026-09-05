import { describe, expect, it } from 'vitest';
import { buildSprite, stripCanvasBackdrop } from '../scripts/lib/svg-sprite.mjs';
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

// ── Figma 畫布底板 ──────────────────────────────────────────────────────
// 夥伴 logo 45 支的共同形狀：真正的圖被包在最內層 <g clip-path>，它的第一個子
// 元素是覆蓋整個 viewBox 的不透明白底，白底以下全是 Figma 連畫布一起匯出的深灰。
const FIGMA = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 232 64" fill="none">',
  '<rect width="232" height="64" fill="#515151"/>',
  '<g id="pc"><path d="M-4491 -18335H50718V17437H-4491Z" fill="#888888"/>',
  '<g id="row"><path d="M-3627 -3627H8354V8354H-3627Z" fill="#6E6E6E"/>',
  '<g id="logo" clip-path="url(#clip0)">',
  '<path d="M232 0H0V64H232V0Z" fill="white"/>',
  '<path d="M10 10h20v20h-20z" fill="#EE4D2D"/>',
  '</g></g></g>',
  '<defs><clipPath id="clip0"><rect width="232" height="64" fill="white"/></clipPath></defs>',
  '</svg>',
].join('');

describe('stripCanvasBackdrop', () => {
  it('剪掉整版不透明底板以下的內容，圖與其祖先 <g> 都留著', () => {
    const out = stripCanvasBackdrop(FIGMA, 'partner-x');
    // 被蓋住的畫布層：整個消失
    expect(out).not.toMatch(/#515151/);
    expect(out).not.toMatch(/#888888/);
    expect(out).not.toMatch(/#6E6E6E/);
    // 圖、圖自己的白底、祖先 <g>（含 clip-path 與根的 fill="none"）都要在
    expect(out).toMatch(/#EE4D2D/);
    expect(out).toMatch(/M232 0H0V64H232V0Z/);
    expect(out).toMatch(/<g id="pc">/);
    expect(out).toMatch(/<g id="logo" clip-path="url\(#clip0\)">/);
    expect(out).toMatch(/<svg[^>]*fill="none"/);
    expect(out).toMatch(/<defs>/);
    // 標籤仍成對
    expect(out.match(/<g\b/g)).toHaveLength(3);
    expect(out.match(/<\/g>/g)).toHaveLength(3);
  });

  it('<defs>／<clipPath> 內的整版 rect 不算底板，不能拿它當切點', () => {
    // FIGMA 的 clipPath 裡也有一塊 232×64 white rect，若誤判成切點會把整張圖剪掉
    expect(stripCanvasBackdrop(FIGMA, 'partner-x')).toMatch(/#EE4D2D/);
  });

  it('祖先 <g> 帶 id 以外的屬性就整支不動——那些屬性可能改變合成結果', () => {
    const risky = FIGMA.replace('<g id="row">', '<g id="row" opacity="0.5">');
    expect(stripCanvasBackdrop(risky, 'partner-x')).toBe(risky);
  });

  it('沒有整版不透明底板的一般素材原樣不動', () => {
    expect(stripCanvasBackdrop(C, 'a')).toBe(C);
  });

  it('底板本身就是第一個可見元素時不用剪，原樣回傳', () => {
    const clean = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="white"/><path d="M1 1h2v2z" fill="red"/></svg>';
    expect(stripCanvasBackdrop(clean, 'a')).toBe(clean);
  });

  it('buildSprite 會先剪再 optimize：sprite 裡不再有畫布深灰', async () => {
    const out = await buildSprite([{ id: 'partner-x', svg: FIGMA }]);
    expect(out).not.toMatch(/515151/i);
    expect(out).toMatch(/EE4D2D/i);
  });
});
