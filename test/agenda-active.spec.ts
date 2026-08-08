import { describe, expect, it } from 'vitest';
import { stepToward, targetIndexAt } from '../app/utils/agenda-active';

// 實測的七組累積邊界（1440×900，各組高 285/189/189/125/101/189/125）。
const BOUNDS = [0, 285, 474, 663, 788, 889, 1078, 1203];

describe('targetIndexAt', () => {
  it('播放頭在議程上方 → null', () => {
    expect(targetIndexAt(BOUNDS, -1)).toBe(null);
  });

  it('落在第一組', () => {
    expect(targetIndexAt(BOUNDS, 0)).toBe(0);
    expect(targetIndexAt(BOUNDS, 284.9)).toBe(0);
  });

  it('邊界值歸下一組（上緣含、下緣不含）', () => {
    expect(targetIndexAt(BOUNDS, 285)).toBe(1);
    expect(targetIndexAt(BOUNDS, 663)).toBe(3);
  });

  // 最短的一組（AI與教育，101px）也必須能被指到 —— 它就是快捲時被跳掉的那種。
  it('落在最短的那一組', () => {
    expect(targetIndexAt(BOUNDS, 788)).toBe(4);
    expect(targetIndexAt(BOUNDS, 888.9)).toBe(4);
  });

  it('播放頭到達或超過議程底緣 → 夾在最後一組', () => {
    expect(targetIndexAt(BOUNDS, 1203)).toBe(6);
    expect(targetIndexAt(BOUNDS, 99999)).toBe(6);
  });

  it('沒有群組時回 null，不炸', () => {
    expect(targetIndexAt([0], 10)).toBe(null);
    expect(targetIndexAt([], 10)).toBe(null);
  });
});

describe('stepToward', () => {
  it('已經到位就不動', () => {
    expect(stepToward(3, 3)).toBe(3);
    expect(stepToward(null, null)).toBe(null);
  });

  // 這組斷言是這次修 bug 的核心：一次只能走一步，故不可能出現 1 2 4 的跳號。
  it('往下一次只走一步', () => {
    expect(stepToward(0, 6)).toBe(1);
    expect(stepToward(1, 6)).toBe(2);
  });

  it('往上一次只走一步', () => {
    expect(stepToward(6, 0)).toBe(5);
    expect(stepToward(2, 0)).toBe(1);
  });

  it('從議程外進入時從第一組開始，不直接跳到目標', () => {
    expect(stepToward(null, 4)).toBe(0);
  });

  it('往回捲出議程時逐組退回，最後才回 null', () => {
    expect(stepToward(2, null)).toBe(1);
    expect(stepToward(1, null)).toBe(0);
    expect(stepToward(0, null)).toBe(null);
  });

  // 反覆套用必須走完每一個中間索引 —— 這就是「每組都必須觸發一次」的保證。
  it('反覆套用會走訪每一個中間索引', () => {
    const visited: (number | null)[] = [];
    let cur: number | null = null;
    for (let n = 0; n < 20 && cur !== 6; n++) {
      cur = stepToward(cur, 6);
      visited.push(cur);
    }
    expect(visited).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
