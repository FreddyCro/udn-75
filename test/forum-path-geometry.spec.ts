import { describe, expect, it } from 'vitest';
import {
  appendTail,
  arcAtCenterY,
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

describe('arcAtCenterY', () => {
  // 路徑段：ease 為 identity 時就是等比映射（＝改動前的公式）。
  it('路徑段等比映射到 pathLen', () => {
    expect(arcAtCenterY(0, 5400, 9093)).toBeCloseTo(0, 6);
    expect(arcAtCenterY(2700, 5400, 9093)).toBeCloseTo(4546.5, 6);
    expect(arcAtCenterY(5400, 5400, 9093)).toBeCloseTo(9093, 6);
  });

  it('套用 ease 只影響路徑段的節奏', () => {
    const ease = (v: number) => v * v;
    expect(arcAtCenterY(2700, 5400, 9093, ease)).toBeCloseTo(0.25 * 9093, 6);
  });

  // 尾段 1:1 —— 這就是「核心恆停在視窗中央」的保證。
  it('尾段的弧長增量等於 y 的增量', () => {
    expect(arcAtCenterY(5401, 5400, 9093)).toBeCloseTo(9094, 6);
    expect(arcAtCenterY(6727, 5400, 9093)).toBeCloseTo(10420, 6);
  });

  it('在 lineEndY 兩側連續', () => {
    const left = arcAtCenterY(5400, 5400, 9093);
    const right = arcAtCenterY(5400.001, 5400, 9093);
    expect(right - left).toBeCloseTo(0.001, 6);
  });

  it('centerY 為負時夾到 0', () => {
    expect(arcAtCenterY(-100, 5400, 9093)).toBe(0);
  });

  it('lineEndY 為 0（reset 後）回 0，不除以零', () => {
    expect(arcAtCenterY(100, 0, 0)).toBe(0);
  });
});
