import { describe, expect, it } from 'vitest';
import { computeGrid, toneMap } from '../app/utils/symbol-sampler';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。
// 本檔完全不碰 DOM：取樣吃的是 { data, width, height }，不是 HTMLImageElement。

const close = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

describe('toneMap', () => {
  it('contrast 1 且不反轉時原值通過', () => {
    expect(toneMap(0.3, false, 1)).toBeCloseTo(0.3);
    expect(toneMap(0.7, false, 1)).toBeCloseTo(0.7);
  });

  it('invert 反轉明暗', () => {
    expect(toneMap(0.3, true, 1)).toBeCloseTo(0.7);
  });

  it('contrast 繞中灰 0.5 放大差距', () => {
    // (0.7-0.5)*2+0.5 = 0.9
    expect(toneMap(0.7, false, 2)).toBeCloseTo(0.9);
    // (0.3-0.5)*2+0.5 = 0.1
    expect(toneMap(0.3, false, 2)).toBeCloseTo(0.1);
  });

  it('中灰不受 contrast 影響', () => {
    expect(toneMap(0.5, false, 2.5)).toBeCloseTo(0.5);
  });

  it('結果 clamp 在 0..1', () => {
    expect(toneMap(0.9, false, 5)).toBe(1);
    expect(toneMap(0.1, false, 5)).toBe(0);
  });

  it('先反轉再套對比', () => {
    // invert: 0.3 -> 0.7，再 contrast 2 -> 0.9
    expect(toneMap(0.3, true, 2)).toBeCloseTo(0.9);
  });
});

describe('computeGrid', () => {
  const base = {
    cols: 130,
    charAspect: 0.65,
    fitWidth: 500,
    fitHeight: 500,
    worldScale: 1,
  };

  it('contain-fit 取較小的縮放比', () => {
    // 1024x1470 塞進 500x500：min(500/1024, 500/1470) = 500/1470
    const g = computeGrid(1024, 1470, base);
    expect(close(g.scale, 500 / 1470)).toBe(true);
  });

  it('face.png 在預設參數下是 130 欄 121 列', () => {
    const g = computeGrid(1024, 1470, base);
    expect(g.cols).toBe(130);
    expect(g.rows).toBe(121);
  });

  it('cellH 由 charAspect 撐高，做出 monospace 的縱向拉伸', () => {
    const g = computeGrid(1024, 1470, base);
    expect(close(g.cellH, g.cellW / 0.65)).toBe(true);
    expect(g.cellH).toBeGreaterThan(g.cellW);
  });

  it('halfW / halfH 是 contain-fit 後圖片本身的一半，不是 fitWidth 的一半', () => {
    const g = computeGrid(1024, 1470, base);
    expect(close(g.halfW, (1024 * (500 / 1470)) / 2)).toBe(true);
    expect(close(g.halfH, 500 / 2)).toBe(true);
  });

  it('worldScale 等比放大', () => {
    const a = computeGrid(1024, 1470, base);
    const b = computeGrid(1024, 1470, { ...base, worldScale: 2 });
    expect(close(b.scale, a.scale * 2)).toBe(true);
    expect(close(b.cellW, a.cellW * 2)).toBe(true);
    // 格數與縮放無關
    expect(b.rows).toBe(a.rows);
  });

  it('cols clamp 到 20..400', () => {
    expect(computeGrid(100, 100, { ...base, cols: 5 }).cols).toBe(20);
    expect(computeGrid(100, 100, { ...base, cols: 9999 }).cols).toBe(400);
  });

  it('rows 至少 1', () => {
    const g = computeGrid(1000, 1, base);
    expect(g.rows).toBe(1);
  });
});
