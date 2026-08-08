import { describe, expect, it } from 'vitest';
import {
  appendTail,
  arcAtCenterY,
  buildArcKnots,
  firstPoint,
  joinSegments,
  lastPoint,
  normalizeD,
  translateD,
} from '../app/utils/forum-path-geometry';
import { FORUM_PATH } from '../app/utils/orange-core-config';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。
const nums = (d: string) => (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
const cmds = (d: string) => (d.match(/[A-Za-z]/g) ?? []).join('');

const SEG1 = FORUM_PATH.pc[0]!.motion;
const SEG2 = FORUM_PATH.pc[1]!.motion;

describe('normalizeD', () => {
  it('把 V 展開成 L，補上目前的 x', () => {
    expect(normalizeD('M10 20V50')).toBe('M10 20L10 50');
  });

  it('把 H 展開成 L，補上目前的 y', () => {
    expect(normalizeD('M10 20H50')).toBe('M10 20L50 20');
  });

  it('C 之後的 V 用曲線終點當目前點', () => {
    expect(normalizeD('M0 0C1 1 2 2 3 3V9')).toBe('M0 0C1 1 2 2 3 3L3 9');
  });

  // Vector 276（pad 線稿）就是這個形狀：M…V…C…，若不展開，下游的 x/y 交替假設會靜默錯位。
  it('展開 Vector 276 開頭那段', () => {
    expect(
      normalizeD('M383.554 2V209.5C407.554 156.5 492.554 84.5 568.054 150')
    ).toBe('M383.554 2L383.554 209.5C407.554 156.5 492.554 84.5 568.054 150');
  });

  it('本來就只有 M/L/C 時原樣回傳', () => {
    expect(normalizeD(SEG1)).toBe(SEG1);
    expect(normalizeD(SEG2)).toBe(SEG2);
  });
});

describe('translateD', () => {
  it('平移每個座標，x 加 tx、y 加 ty', () => {
    expect(translateD('M10 20L30 40C50 60 70 80 90 100', 5, -5)).toBe(
      'M15.00 15.00L35.00 35.00C55.00 55.00 75.00 75.00 95.00 95.00'
    );
  });

  // 這條是最關鍵的不變量：用「全域索引奇偶」驗證平移沒有錯位。
  // 它能成立的前提是每個指令組的座標數都是偶數（M:2 / L:2 / C:6）——
  // 也就是為什麼 motion 一定要先過 normalizeD。
  it('實際線稿的每個座標都恰好位移 (tx, ty)，x/y 不錯位', () => {
    for (const d of [SEG1, SEG2]) {
      const before = nums(d);
      const after = nums(translateD(d, 100, -50));
      expect(after).toHaveLength(before.length);
      after.forEach((n, i) => {
        expect(n).toBeCloseTo(before[i]! + (i % 2 === 0 ? 100 : -50), 2);
      });
    }
  });

  it('不改變指令序列', () => {
    expect(cmds(translateD(SEG1, 100, -50))).toBe(cmds(SEG1));
    expect(cmds(translateD(SEG2, 100, -50))).toBe(cmds(SEG2));
  });

  it('平移 0 不改變座標', () => {
    expect(nums(translateD(SEG1, 0, 0))).toEqual(nums(SEG1));
  });
});

describe('firstPoint / lastPoint', () => {
  it('讀出實際線稿的端點', () => {
    expect(firstPoint(SEG1)).toEqual([473.07, 2]);
    expect(lastPoint(SEG1)).toEqual([568.07, 3679.88]);
    expect(firstPoint(SEG2)).toEqual([418.78, 13.69]);
    expect(lastPoint(SEG2)).toEqual([177.16, 1419.87]);
  });
});

describe('joinSegments', () => {
  it('連接段是從前段末端到後段起點的直線', () => {
    expect(joinSegments(['M0 0L10 10', 'M100 100L110 110'])).toBe(
      'M0 0L10 10L100.00 100.00L110 110'
    );
  });

  // 單段不加連接段 —— pad 的 Vector 276 是單一連續 path，必須原樣跑得動。
  it('單一段原樣回傳', () => {
    expect(joinSegments(['M0 0L1 1'])).toBe('M0 0L1 1');
  });

  it('空陣列回傳空字串', () => {
    expect(joinSegments([])).toBe('');
  });

  // 串接後必須是「單一連續 path」：多個 M 會讓 getPointAtLength 在段落之間跳點。
  it('串起實際兩段後只有一個 M，末端等於最後一段的末端', () => {
    const d = joinSegments([
      translateD(SEG1, 167, 0),
      translateD(SEG2, 150, 3840.6),
    ]);
    expect((d.match(/M/g) ?? []).length).toBe(1);
    expect(lastPoint(d)).toEqual([327.16, 5260.47]);
  });
});

describe('appendTail', () => {
  it('在末端追加一段直線', () => {
    expect(appendTail('M0 0L10 10', 10, 500)).toBe('M0 0L10 10L10.00 500.00');
  });

  // 追加後必須仍是單一連續 path —— 多個 M 會讓 getPointAtLength 在接縫跳點。
  it('不新增 M', () => {
    const d = appendTail('M0 0L10 10', 10, 500);
    expect((d.match(/M/g) ?? []).length).toBe(1);
  });

  it('末端就是追加的那個點', () => {
    expect(lastPoint(appendTail('M0 0L10 10', 327.16, 6771.5))).toEqual([
      327.16, 6771.5,
    ]);
  });

  it('空字串原樣回傳（該斷點沒有線稿）', () => {
    expect(appendTail('', 10, 20)).toBe('');
  });

  // 實際線稿：串完兩段再接尾段，末端 x 不變、y 換成尾段終點。
  it('接在實際線稿末端', () => {
    const joined = joinSegments([
      translateD(SEG1, 167, 0),
      translateD(SEG2, 150, 3840.6),
    ]);
    const [ex] = lastPoint(joined);
    const d = appendTail(joined, ex, 6771.5);
    expect((d.match(/M/g) ?? []).length).toBe(1);
    expect(lastPoint(d)).toEqual([327.16, 6771.5]);
  });
});

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
