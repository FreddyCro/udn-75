import { describe, expect, it } from 'vitest';
import { arcAtCenterY, buildArcKnots } from '../app/utils/forum-path-geometry';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。


describe('buildArcKnots', () => {
  // 等速直線：弧長與 y 同步 → 節點就是等距的對角線。
  it('弧長與 y 同步時，節點是等距的', () => {
    const k = buildArcKnots(1000, 1000, 250, (len) => len);
    expect(k.map((n) => n.y)).toEqual([0, 250, 500, 750, 1000]);
    k.forEach((n) => expect(n.len).toBeCloseTo(n.y, 3));
  });

  // 蛇行：弧長是垂直跨距的兩倍 → 每個節點吃兩倍弧長。
  it('弧長是 y 的兩倍時，節點的弧長也是兩倍', () => {
    const k = buildArcKnots(1000, 500, 250, (len) => len / 2);
    expect(k.map((n) => n.y)).toEqual([0, 250, 500]);
    expect(k.map((n) => n.len)).toEqual([0, 500, 1000]);
  });

  // 兩端必須精準：起點是交棒點、終點是段落底緣的錨點，不能被取樣誤差污染。
  it('兩端固定為 (0, 0) 與 (endY, totalLen)', () => {
    const k = buildArcKnots(997, 613, 100, (len) => (len / 997) * 613);
    expect(k[0]).toEqual({ y: 0, len: 0 });
    expect(k[k.length - 1]).toEqual({ y: 613, len: 997 });
  });

  // 弧線上偶有微幅回頭 → 單調化，否則核心會在那裡往回跳。
  it('y 中途回頭時弧長仍不遞減', () => {
    const k = buildArcKnots(1000, 500, 50, (len) =>
      len < 400 ? len / 2 : len < 600 ? 200 - (len - 400) / 4 : (len - 600) / 0.8 + 200,
    );
    for (let i = 1; i < k.length; i++) {
      expect(k[i]!.len).toBeGreaterThanOrEqual(k[i - 1]!.len);
    }
  });

  it('totalLen 或 endY 非正時回空陣列（reset 後不會被誤用）', () => {
    expect(buildArcKnots(0, 500, 100, (len) => len)).toEqual([]);
    expect(buildArcKnots(1000, 0, 100, (len) => len)).toEqual([]);
  });
});

describe('arcAtCenterY', () => {
  // 假的蛇行驅動線：每 1000 弧長為一段，前 500 只下降 100（橫向繞路）、後 500 下降 500。
  // 等比映射會在每段的前半累積落後 → 正是實機上核心滑出畫面的成因。
  const TOTAL = 4000;
  const END_Y = 2400;
  const sampleY = (len: number) => {
    const b = Math.floor(len / 1000);
    const r = len - b * 1000;
    return b * 600 + (r <= 500 ? (r / 500) * 100 : 100 + ((r - 500) / 500) * 500);
  };
  const knots = buildArcKnots(TOTAL, END_Y, 300, sampleY);

  it('節點上核心精準落在視窗中央', () => {
    for (const n of knots) {
      expect(sampleY(arcAtCenterY(n.y, knots))).toBeCloseTo(n.y, 3);
    }
  });

  const worst = (map: (cy: number) => number) => {
    let m = 0;
    for (let i = 0; i <= 400; i++) {
      const cy = (i / 400) * END_Y;
      m = Math.max(m, Math.abs(sampleY(map(cy)) - cy));
    }
    return m;
  };

  // 這才是整個機制的用途：偏移被節點間距綁住，不會一路累積到滑出畫面。
  it('偏移約束在節點間距的一半以內，且間距越小越貼齊', () => {
    const proportional = worst((cy) => (cy / END_Y) * TOTAL);
    expect(proportional).toBeCloseTo(200, 0); // 等比：每段前半的落後全額保留

    for (const spacing of [600, 300, 150]) {
      const dev = worst((cy) =>
        arcAtCenterY(cy, buildArcKnots(TOTAL, END_Y, spacing, sampleY)),
      );
      expect(dev).toBeLessThan(spacing / 2);
    }
    expect(worst((cy) => arcAtCenterY(cy, buildArcKnots(TOTAL, END_Y, 150, sampleY))))
      .toBeLessThan(worst((cy) => arcAtCenterY(cy, buildArcKnots(TOTAL, END_Y, 600, sampleY))));
  });

  it('單調遞增，且兩端精準對上路徑的頭尾', () => {
    expect(arcAtCenterY(0, knots)).toBe(0);
    expect(arcAtCenterY(END_Y, knots)).toBe(TOTAL);
    let prev = -1;
    for (let i = 0; i <= 200; i++) {
      const len = arcAtCenterY((i / 200) * END_Y, knots);
      expect(len).toBeGreaterThanOrEqual(prev);
      prev = len;
    }
  });

  it('ease 重新分配節奏', () => {
    const ease = (v: number) => v * v;
    // ease 先把 0.5 壓成 0.25 → 等同 centerY 為 0.25 × endY 的位置。
    expect(arcAtCenterY(END_Y / 2, knots, ease)).toBeCloseTo(
      arcAtCenterY(END_Y / 4, knots),
      6,
    );
  });

  it('centerY 超出範圍時夾在兩端', () => {
    expect(arcAtCenterY(-100, knots)).toBe(0);
    expect(arcAtCenterY(END_Y + 5000, knots)).toBe(TOTAL);
  });

  it('節點表為空（reset 後）回 0，不除以零', () => {
    expect(arcAtCenterY(100, [])).toBe(0);
    expect(arcAtCenterY(100, [{ y: 0, len: 0 }])).toBe(0);
    expect(arcAtCenterY(100, [{ y: 0, len: 0 }, { y: 0, len: 0 }])).toBe(0);
  });
});
