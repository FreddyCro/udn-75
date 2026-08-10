import { describe, expect, it } from 'vitest';
import { FORUM_PLANE_FRAMES } from '../app/utils/forum-plane-frames';

// 稿上 Frame 12775 的九格外框（全部底部對齊，y + h 皆為 88）。
const SIZES = [
  [26, 26], [24, 28], [32, 34], [40, 40], [40, 47],
  [40, 55], [48, 67], [56, 75], [72, 88],
] as const;

describe('FORUM_PLANE_FRAMES', () => {
  it('剛好九格', () => {
    expect(FORUM_PLANE_FRAMES).toHaveLength(9);
  });

  it('每格宣告的外框與稿一致', () => {
    FORUM_PLANE_FRAMES.forEach((f, i) => {
      expect([f.w, f.h], `第 ${i + 1} 格`).toEqual([SIZES[i]![0], SIZES[i]![1]]);
    });
  });

  // 這條是抓打字錯誤的主力：方塊必須剛好填滿宣告的外框，不多不少。
  it('方塊的實際 bbox 等於宣告的外框', () => {
    FORUM_PLANE_FRAMES.forEach((f, i) => {
      const label = `第 ${i + 1} 格`;
      expect(f.rects.length, label).toBeGreaterThan(0);
      const minX = Math.min(...f.rects.map((r) => r[0]));
      const minY = Math.min(...f.rects.map((r) => r[1]));
      const maxX = Math.max(...f.rects.map((r) => r[0] + r[2]));
      const maxY = Math.max(...f.rects.map((r) => r[1] + r[3]));
      expect([minX, minY], `${label} 左上`).toEqual([0, 0]);
      expect([maxX, maxY], `${label} 右下`).toEqual([f.w, f.h]);
    });
  });

  it('沒有完全重疊的重複方塊', () => {
    FORUM_PLANE_FRAMES.forEach((f, i) => {
      const keys = f.rects.map((r) => r.join(','));
      expect(new Set(keys).size, `第 ${i + 1} 格`).toBe(keys.length);
    });
  });

  it('第 1 格就是核心方塊本身（交棒點要無縫）', () => {
    expect(FORUM_PLANE_FRAMES[0]).toEqual({ w: 26, h: 26, rects: [[0, 0, 26, 26]] });
  });
});
