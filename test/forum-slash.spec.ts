import { describe, expect, it } from 'vitest';
import { nearestArcLength, slashDrawAt } from '../app/utils/forum-slash';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。

describe('slashDrawAt', () => {
  it('窗口為 null（尚未建線／該斷點沒有線）→ 完全不畫', () => {
    expect(slashDrawAt(0.5, null)).toBe(0);
  });

  it('尚未走到窗口起點 → 0', () => {
    expect(slashDrawAt(0.39, [0.4, 0.41])).toBe(0);
  });

  it('走到窗口中點 → 0.5', () => {
    expect(slashDrawAt(0.405, [0.4, 0.41])).toBeCloseTo(0.5, 6);
  });

  it('越過窗口終點 → 1（畫完就留著，不會再變）', () => {
    expect(slashDrawAt(0.9, [0.4, 0.41])).toBe(1);
  });

  it('往回捲會回退（同一個函式，不需要額外狀態）', () => {
    expect(slashDrawAt(0.4025, [0.4, 0.41])).toBeCloseTo(0.25, 6);
  });

  it('窗口長度為 0 → 退化成硬切，不做除以零', () => {
    expect(slashDrawAt(0.39, [0.4, 0.4])).toBe(0);
    expect(slashDrawAt(0.4, [0.4, 0.4])).toBe(1);
    expect(Number.isNaN(slashDrawAt(0.4, [0.4, 0.4]))).toBe(false);
  });
});

describe('nearestArcLength', () => {
  // 合成路徑：一條長 1000 的水平線，弧長就是 x。
  const horizontal = (len: number) => ({ x: len, y: 0 });

  it('垂直投影到水平線上 → 回傳該點的 x', () => {
    const got = nearestArcLength({ x: 250, y: 40 }, horizontal, 1000);
    expect(got).toBeCloseTo(250, 0);
  });

  it('目標在起點之前 → 夾在 0', () => {
    expect(nearestArcLength({ x: -50, y: 0 }, horizontal, 1000)).toBeCloseTo(0, 0);
  });

  it('目標在終點之後 → 夾在 totalLen', () => {
    expect(nearestArcLength({ x: 1200, y: 0 }, horizontal, 1000)).toBeCloseTo(1000, 0);
  });

  // 合成 L 形：前 100 往右、後 100 往下。轉角在弧長 100、座標 (100, 0)。
  const elbow = (len: number) =>
    len <= 100 ? { x: len, y: 0 } : { x: 100, y: len - 100 };

  it('L 形的轉角外側 → 收斂到轉角的弧長', () => {
    const got = nearestArcLength({ x: 130, y: -30 }, elbow, 200);
    expect(got).toBeCloseTo(100, 0);
  });

  it('L 形的下半段 → 收斂到該段的弧長', () => {
    const got = nearestArcLength({ x: 140, y: 60 }, elbow, 200);
    expect(got).toBeCloseTo(160, 0);
  });

  it('totalLen 為 0（尚未建線）→ 回 0，不會無限迴圈', () => {
    expect(nearestArcLength({ x: 5, y: 5 }, horizontal, 0)).toBe(0);
  });
});
