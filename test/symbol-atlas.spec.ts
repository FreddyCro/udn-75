import { describe, expect, it } from 'vitest';
import {
  atlasGridSize,
  buildWeightLadder,
  glyphIndex,
  rankCharsByInk,
} from '../app/utils/symbol-atlas';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。
// 這裡只測「無 DOM」的純函式；真正拿 canvas 量墨水量的部分不在測試範圍。

// 假的墨水量測：字元愈後面墨水愈多，方便驗證排序
const inkOf = (map: Record<string, number>) => (ch: string) => map[ch] ?? 0;

describe('rankCharsByInk', () => {
  it('依墨水量由少到多排序，並在最前面補一個空白', () => {
    const measure = inkOf({ '.': 1, 'o': 5, '#': 9 });
    expect(rankCharsByInk(['#', '.', 'o'], measure)).toEqual([' ', '.', 'o', '#']);
  });

  it('把多字元字串展開成單一字元', () => {
    const measure = inkOf({ A: 3, B: 1 });
    expect(rankCharsByInk(['AB'], measure)).toEqual([' ', 'B', 'A']);
  });

  it('去除重複字元', () => {
    const measure = inkOf({ A: 3, B: 1 });
    expect(rankCharsByInk(['A', 'B', 'A', 'B'], measure)).toEqual([' ', 'B', 'A']);
  });

  it('濾掉空白與空字串', () => {
    const measure = inkOf({ A: 3 });
    expect(rankCharsByInk([' ', '', 'A', '\t'], measure)).toEqual([' ', 'A']);
  });

  it('墨水量相同時以字元本身決勝，結果穩定', () => {
    const measure = () => 4;
    expect(rankCharsByInk(['C', 'A', 'B'], measure)).toEqual([' ', 'A', 'B', 'C']);
  });

  it('沒有可用字元時回傳空陣列（呼叫端據此不建粒子）', () => {
    expect(rankCharsByInk([], () => 1)).toEqual([]);
    expect(rankCharsByInk(['  ', ''], () => 1)).toEqual([]);
  });
});

describe('atlasGridSize', () => {
  it('8 字 × 5 階 = 40 cells → 7 欄 6 列', () => {
    expect(atlasGridSize(40)).toEqual({ cols: 7, rows: 6 });
  });

  it('完全平方數剛好方形', () => {
    expect(atlasGridSize(16)).toEqual({ cols: 4, rows: 4 });
  });

  it('1 cell 也要有 1×1', () => {
    expect(atlasGridSize(1)).toEqual({ cols: 1, rows: 1 });
  });

  it('0 cell 退回 1×1，不產生 0 尺寸貼圖', () => {
    expect(atlasGridSize(0)).toEqual({ cols: 1, rows: 1 });
  });
});

describe('glyphIndex', () => {
  it('charIdx 1（排序後第一個非空白字）搭配 weightIdx 0 → 0', () => {
    expect(glyphIndex(1, 0, 5)).toBe(0);
  });

  it('charIdx 1 的最後一階字重 → 4', () => {
    expect(glyphIndex(1, 4, 5)).toBe(4);
  });

  it('charIdx 2 從第二組開始 → 5', () => {
    expect(glyphIndex(2, 0, 5)).toBe(5);
  });

  it('單一字重時等同 charIdx-1', () => {
    expect(glyphIndex(3, 0, 1)).toBe(2);
  });
});

describe('buildWeightLadder', () => {
  it('5 階 100–900 等距', () => {
    expect(buildWeightLadder(5, 100, 900)).toEqual([100, 300, 500, 700, 900]);
  });

  it('只有 1 階時取最大值（亮部字重）', () => {
    expect(buildWeightLadder(1, 100, 900)).toEqual([900]);
  });

  it('階數小於 1 一律 clamp 成 1 階', () => {
    expect(buildWeightLadder(0, 100, 900)).toEqual([900]);
  });

  it('數值四捨五入成整數', () => {
    expect(buildWeightLadder(3, 100, 800)).toEqual([100, 450, 800]);
  });
});
