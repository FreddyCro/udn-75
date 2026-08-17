import { describe, expect, it } from 'vitest';
import { EGG_CLOSED, nextEggIndex, tapEggIndex } from '../app/utils/symbol-egg';

// 這支守的是手機版彩蛋的切換規則：點人臉依序換下一句（走到底繞回第一句）、
// 點人臉以外的地方才關閉。同一套 nextEggIndex 也給 3 秒自動輪播用。
//
// 抽出來測的理由同 symbol-hint：元件本身是 WebGL + rAF，這段決策在裡面測不到，
// 而「繞回第一句」與「點臉外才關」正是使用者唯一看得見的規則 —— 寫反了畫面上
// 只會像是「彩蛋怪怪的」，很難查。
describe('nextEggIndex', () => {
  it('關閉狀態 → 第一句（首次點擊從 0 起，不是從 1）', () => {
    expect(nextEggIndex(EGG_CLOSED, 6)).toBe(0);
  });

  it('依序前進', () => {
    expect(nextEggIndex(0, 6)).toBe(1);
    expect(nextEggIndex(1, 6)).toBe(2);
    expect(nextEggIndex(4, 6)).toBe(5);
  });

  it('最後一句再換一次 → 繞回第一句', () => {
    expect(nextEggIndex(5, 6)).toBe(0);
  });

  it('沒有句子時維持關閉，不做除以零', () => {
    expect(nextEggIndex(EGG_CLOSED, 0)).toBe(EGG_CLOSED);
    expect(nextEggIndex(3, 0)).toBe(EGG_CLOSED);
  });
});

describe('tapEggIndex', () => {
  it('點在人臉上 → 換下一句', () => {
    expect(tapEggIndex(EGG_CLOSED, 6, true)).toBe(0);
    expect(tapEggIndex(0, 6, true)).toBe(1);
    expect(tapEggIndex(5, 6, true)).toBe(0);
  });

  it('點在人臉以外 → 關閉（這是唯一的關閉入口，手指離開不算）', () => {
    expect(tapEggIndex(EGG_CLOSED, 6, false)).toBe(EGG_CLOSED);
    expect(tapEggIndex(3, 6, false)).toBe(EGG_CLOSED);
  });

  it('沒有句子時點人臉也不會開', () => {
    expect(tapEggIndex(EGG_CLOSED, 0, true)).toBe(EGG_CLOSED);
  });
});
