import { describe, expect, it } from 'vitest';
import {
  HEADER_AUTOHIDE_THRESHOLD_PX,
  nextHeaderShown,
} from '../app/utils/header-autohide';

const T = HEADER_AUTOHIDE_THRESHOLD_PX;

describe('nextHeaderShown', () => {
  it('下滑超過門檻 → 隱藏', () => {
    expect(nextHeaderShown({ y: 500 + T, prevY: 500, shown: true })).toBe(false);
  });

  it('上滑超過門檻 → 顯示', () => {
    expect(nextHeaderShown({ y: 500 - T, prevY: 500, shown: false })).toBe(true);
  });

  it('位移未達門檻 → 維持原狀（不因 pin/unpin 的次像素抖動閃動）', () => {
    expect(nextHeaderShown({ y: 501, prevY: 500, shown: true })).toBe(true);
    expect(nextHeaderShown({ y: 501, prevY: 500, shown: false })).toBe(false);
    expect(nextHeaderShown({ y: 499, prevY: 500, shown: true })).toBe(true);
    expect(nextHeaderShown({ y: 499, prevY: 500, shown: false })).toBe(false);
  });

  it('位移正好等於門檻 → 算數（門檻是開區間）', () => {
    expect(nextHeaderShown({ y: 500 + T, prevY: 500, shown: true })).toBe(false);
    expect(nextHeaderShown({ y: 500 - T, prevY: 500, shown: false })).toBe(true);
  });

  it('回到頂端 → 一律顯示，不看方向', () => {
    expect(nextHeaderShown({ y: 0, prevY: 0, shown: false })).toBe(true);
    // iOS 橡皮筋：從負值往下彈回 0，方向是「下滑」但不該藏
    expect(nextHeaderShown({ y: 0, prevY: -30, shown: false })).toBe(true);
  });

  it('scrollY 為負（iOS 橡皮筋往上拉）→ 顯示', () => {
    expect(nextHeaderShown({ y: -40, prevY: 0, shown: false })).toBe(true);
  });

  it('可自訂門檻', () => {
    expect(nextHeaderShown({ y: 504, prevY: 500, shown: true, threshold: 2 })).toBe(false);
    expect(nextHeaderShown({ y: 504, prevY: 500, shown: true, threshold: 100 })).toBe(true);
  });
});
