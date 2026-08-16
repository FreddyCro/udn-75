import { describe, expect, it } from 'vitest';
import { stepToward, targetSlotAt } from '../app/utils/agenda-active';
import { CORE } from '../app/utils/orange-core-config';

// 實測的七組累積邊界（1440×900，各組高 285/189/189/125/101/189/125）。
const BOUNDS = [0, 285, 474, 663, 788, 889, 1078, 1203];
// 界外槽位：-1 ＝ 議程之上、7 ＝ 議程之下。
const BELOW = BOUNDS.length - 1;
// 播放頭是核心中心，故兩端各內縮半顆核心（見 targetSlotAt 的 inset）。
const HALF = CORE.dotSize / 2;

describe('targetSlotAt', () => {
  it('播放頭在議程上方 → -1', () => {
    expect(targetSlotAt(BOUNDS, -1)).toBe(-1);
  });

  it('落在第一組', () => {
    expect(targetSlotAt(BOUNDS, 0)).toBe(0);
    expect(targetSlotAt(BOUNDS, 284.9)).toBe(0);
  });

  it('邊界值歸下一組（上緣含、下緣不含）', () => {
    expect(targetSlotAt(BOUNDS, 285)).toBe(1);
    expect(targetSlotAt(BOUNDS, 663)).toBe(3);
  });

  // 最短的一組（AI與教育，101px）也必須能被指到 —— 它就是快捲時被跳掉的那種。
  it('落在最短的那一組', () => {
    expect(targetSlotAt(BOUNDS, 788)).toBe(4);
    expect(targetSlotAt(BOUNDS, 888.9)).toBe(4);
  });

  it('播放頭到達或超過議程底緣 → 議程之下（不夾在最後一組）', () => {
    expect(targetSlotAt(BOUNDS, 1203)).toBe(BELOW);
    expect(targetSlotAt(BOUNDS, 99999)).toBe(BELOW);
  });

  // 這兩組斷言就是「箭頭不可以在核心還看得見的時候出現或消失」。
  it('核心整顆進了議程，第一組才亮', () => {
    expect(targetSlotAt(BOUNDS, HALF - 0.1, HALF)).toBe(-1);
    expect(targetSlotAt(BOUNDS, HALF, HALF)).toBe(0);
  });

  it('核心一開始露出議程底緣，最後一組就熄', () => {
    expect(targetSlotAt(BOUNDS, 1203 - HALF - 0.1, HALF)).toBe(6);
    expect(targetSlotAt(BOUNDS, 1203 - HALF, HALF)).toBe(BELOW);
  });

  it('inset 不影響組與組之間的邊界（那裡仍以核心中心判定）', () => {
    expect(targetSlotAt(BOUNDS, 285, HALF)).toBe(1);
    expect(targetSlotAt(BOUNDS, 284.9, HALF)).toBe(0);
  });

  it('沒有群組時回 -1，不炸', () => {
    expect(targetSlotAt([0], 10)).toBe(-1);
    expect(targetSlotAt([], 10)).toBe(-1);
  });
});

describe('stepToward', () => {
  it('已經到位就不動', () => {
    expect(stepToward(3, 3)).toBe(3);
    expect(stepToward(-1, -1)).toBe(-1);
  });

  // 這組斷言是當初修跳號 bug 的核心：一次只能走一步，故不可能出現 1 2 4 的跳號。
  it('往下一次只走一步', () => {
    expect(stepToward(0, 6)).toBe(1);
    expect(stepToward(1, 6)).toBe(2);
  });

  it('往上一次只走一步', () => {
    expect(stepToward(6, 0)).toBe(5);
    expect(stepToward(2, 0)).toBe(1);
  });

  it('從議程上方進入時從第一組開始，不直接跳到目標', () => {
    expect(stepToward(-1, 4)).toBe(0);
  });

  it('往回捲出議程時逐組退回，最後才回到界外', () => {
    expect(stepToward(2, -1)).toBe(1);
    expect(stepToward(1, -1)).toBe(0);
    expect(stepToward(0, -1)).toBe(-1);
  });

  // 往下捲出議程是**離開最後一組**，不是倒退回第 0 組再出去 ——
  // 兩側界外若共用同一個值就會變成後者（箭頭沿議程反向倒帶一遍）。
  it('往下捲出議程時直接離開最後一組，不倒帶', () => {
    expect(stepToward(6, BELOW)).toBe(BELOW);
  });

  // 反覆套用必須走完每一個中間槽位 —— 這就是「每組都必須觸發一次」的保證。
  it('反覆套用會走訪每一個中間槽位', () => {
    const visited: number[] = [];
    let cur = -1;
    for (let n = 0; n < 20 && cur !== BELOW; n++) {
      cur = stepToward(cur, BELOW);
      visited.push(cur);
    }
    expect(visited).toEqual([0, 1, 2, 3, 4, 5, 6, BELOW]);
  });
});
