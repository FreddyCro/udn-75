import { describe, expect, it } from 'vitest';
import {
  GLYPH_FONT_SCALE,
  computeGrid,
  sampleImageToGrid,
  sampleImageToGridWithLimit,
  toneMap,
  type ImageLike,
} from '../app/utils/symbol-sampler';

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
  // face.png 實測 1013×1478（早期記成 1024×1470 有誤）；cols 預設為 85，
  // 不是 gemini 的 130 —— 滿版一屏放不下 130 欄的可辨識字級，見 spec § 2。
  const base = {
    cols: 85,
    charAspect: 0.65,
    fitWidth: 500,
    fitHeight: 500,
    worldScale: 1,
  };

  it('contain-fit 取較小的縮放比', () => {
    // 1013x1478 塞進 500x500：min(500/1013, 500/1478) = 500/1478
    const g = computeGrid(1013, 1478, base);
    expect(close(g.scale, 500 / 1478)).toBe(true);
  });

  it('face.png 在預設 cols 85 下是 85 欄 80 列', () => {
    const g = computeGrid(1013, 1478, base);
    expect(g.cols).toBe(85);
    expect(g.rows).toBe(80);
  });

  it('cols 130 時是 130 欄 123 列', () => {
    const g = computeGrid(1013, 1478, { ...base, cols: 130 });
    expect(g.cols).toBe(130);
    expect(g.rows).toBe(123);
  });

  it('cellH 由 charAspect 撐高，做出 monospace 的縱向拉伸', () => {
    const g = computeGrid(1013, 1478, base);
    expect(close(g.cellH, g.cellW / 0.65)).toBe(true);
    expect(g.cellH).toBeGreaterThan(g.cellW);
  });

  it('halfW / halfH 是 contain-fit 後圖片本身的一半，不是 fitWidth 的一半', () => {
    const g = computeGrid(1013, 1478, base);
    expect(close(g.halfW, (1013 * (500 / 1478)) / 2)).toBe(true);
    expect(close(g.halfH, 500 / 2)).toBe(true);
  });

  it('worldScale 等比放大', () => {
    const a = computeGrid(1013, 1478, base);
    const b = computeGrid(1013, 1478, { ...base, worldScale: 2 });
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

/** 產生單色不透明的測試圖：lum 0..1、alpha 0..1 */
const solidImage = (
  width: number,
  height: number,
  lum: number,
  alpha = 1,
): ImageLike => {
  const v = Math.round(lum * 255);
  const a = Math.round(alpha * 255);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = a;
  }
  return { data, width, height };
};

const sampleOpts = {
  cols: 20,
  charAspect: 1,
  fitWidth: 20,
  fitHeight: 20,
  worldScale: 1,
  contrast: 1,
  invert: false,
  charCount: 9, // 空白 + 8 個字元
  weightSteps: 5,
  sizeMin: 0.43,
  sizeMax: 1,
  jitter: 0,
};

describe('sampleImageToGrid', () => {
  it('全白不透明 → 每格都產生粒子', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(s.cols).toBe(20);
    expect(s.rows).toBe(20);
    expect(s.count).toBe(400);
  });

  it('全黑 → 落在空白階，一顆都不產生', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 0), sampleOpts);
    expect(s.count).toBe(0);
    expect(s.positions.length).toBe(0);
  });

  it('alpha < 0.5 的區域被遮罩剔除（去背輪廓外）', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1, 0.2), sampleOpts);
    expect(s.count).toBe(0);
  });

  it('invert 讓全黑變成全亮，每格都產生', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 0), {
      ...sampleOpts,
      invert: true,
    });
    expect(s.count).toBe(400);
  });

  it('最亮時取最後一個字元階與最高字重階', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    // charIdx = 8（charCount-1），weightIdx = 4（weightSteps-1）
    // glyph = (8-1)*5 + 4 = 39
    expect(s.glyphs[0]).toBe(39);
  });

  it('亮度寫進 brights，供 shader 取漸層色', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(s.brights[0]).toBeCloseTo(1);
  });

  it('字級是格高乘上 sizeMin..sizeMax 的插值，再除掉 atlas 留白（world 單位）', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    // b=1 → sizeMax=1 → 字級 = cellH；sizes 存的是 sprite 邊長 → 再 / 0.78
    expect(s.sizes[0]).toBeCloseTo(s.cellH / GLYPH_FONT_SCALE);
  });

  it('sizes 是 sprite 邊長，恆大於對應字級', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(GLYPH_FONT_SCALE).toBeLessThan(1);
    expect(s.sizes[0]).toBeGreaterThan(s.cellH);
  });

  it('jitter=0 時座標落在格中心，完全規則', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    // 第 0 格：col 0 row 0
    expect(s.positions[0]).toBeCloseTo(0.5 * s.cellW - s.halfW);
    expect(s.positions[1]).toBeCloseTo(s.halfH - 0.5 * s.cellH);
    expect(s.positions[2]).toBe(0);
  });

  it('jitter>0 時以注入的 random 位移，可重現', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), {
      ...sampleOpts,
      jitter: 0.5,
      random: () => 1, // (1-0.5)=0.5 → 位移 +0.5 * cell * jitter
    });
    const centerX = 0.5 * s.cellW - s.halfW;
    expect(s.positions[0]).toBeCloseTo(centerX + 0.5 * s.cellW * 0.5);
    expect(s.positions[2]).toBeCloseTo(0.5 * s.cellH * 0.5);
  });

  it('回傳的 typed array 長度與 count 相符', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(s.positions.length).toBe(s.count * 3);
    expect(s.sizes.length).toBe(s.count);
    expect(s.glyphs.length).toBe(s.count);
    expect(s.brights.length).toBe(s.count);
  });

  it('weightSteps=1 時所有粒子的 weightIdx 都是 0', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), {
      ...sampleOpts,
      weightSteps: 1,
    });
    // charIdx=8 → glyph = (8-1)*1 + 0 = 7
    expect(s.glyphs[0]).toBe(7);
  });
});

describe('sampleImageToGridWithLimit', () => {
  it('沒超標時直接回傳，cols 不變', () => {
    const s = sampleImageToGridWithLimit(
      solidImage(20, 20, 1),
      sampleOpts,
      10000,
    );
    expect(s.cols).toBe(20);
    expect(s.count).toBe(400);
  });

  it('超標時遞減 cols 直到符合上限', () => {
    const s = sampleImageToGridWithLimit(
      solidImage(200, 200, 1),
      { ...sampleOpts, cols: 200, fitWidth: 200, fitHeight: 200 },
      2000,
    );
    expect(s.count).toBeLessThanOrEqual(2000);
    expect(s.cols).toBeLessThan(200);
  });

  it('降到下限 20 仍超標時就停手，不無限迴圈', () => {
    const s = sampleImageToGridWithLimit(solidImage(20, 20, 1), sampleOpts, 1);
    expect(s.cols).toBe(20);
    expect(s.count).toBeGreaterThan(1);
  });

  it('回傳的 typed array 與最終 cols 相符', () => {
    const s = sampleImageToGridWithLimit(
      solidImage(200, 200, 1),
      { ...sampleOpts, cols: 200, fitWidth: 200, fitHeight: 200 },
      2000,
    );
    expect(s.positions.length).toBe(s.count * 3);
    expect(s.count).toBe(s.cols * s.rows);
  });
});
