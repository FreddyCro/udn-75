import { describe, expect, it } from 'vitest';
import { svgDataUri } from '../app/utils/svg-data-uri';

describe('svgDataUri', () => {
  it('產生 CSS url() 與 <img src> 都吃的 data URI，並把會破壞 url("…") 的字元編掉', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0h10v10H0z" fill="#cb2529"/></svg>';
    const uri = svgDataUri(svg);
    expect(uri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
    expect(uri).not.toContain('#');   // # 會被當 fragment
    expect(uri).not.toContain('"');   // 會提前結束 url("…")
    expect(uri).not.toContain('<');
    expect(decodeURIComponent(uri.slice('data:image/svg+xml;charset=utf-8,'.length))).toBe(svg);
  });

  it('屬性值用單引號寫的 SVG，單引號也要被編掉（消費端有 url(\'…\') 這種單引號包法）', () => {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><path d='M0 0h10v10H0z'/></svg>";
    const uri = svgDataUri(svg);
    expect(uri).not.toContain("'"); // 會提前結束 url('…')
    expect(decodeURIComponent(uri.slice('data:image/svg+xml;charset=utf-8,'.length))).toBe(svg);
  });
});
