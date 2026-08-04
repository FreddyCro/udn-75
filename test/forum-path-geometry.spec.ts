import { describe, expect, it } from 'vitest';
import {
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
