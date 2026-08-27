import { describe, expect, it } from 'vitest';
import {
  coreHandoffBackY,
  videoAnchorToScreen,
  isVerticallyOnScreen,
  unrotateDelta,
  type HeroCoreAnchor,
} from '../app/utils/hero-core-handoff';

const CENTER: HeroCoreAnchor = { x: 0.5, y: 0.5, size: 0.02 };

// 視窗左上角就是元素左上角的常見情形；需要偏移時再覆寫
const box = (over: Partial<{ left: number; top: number; width: number; height: number }> = {}) => ({
  left: 0,
  top: 0,
  width: 1000,
  height: 1000,
  ...over,
});

describe('videoAnchorToScreen', () => {
  it('畫面正中心永遠落在元素正中心（不論被裁的是哪一邊）', () => {
    // 影片比元素寬 → 左右被裁
    const wide = videoAnchorToScreen(box(), 2000, 1000, CENTER)!;
    expect(wide.x).toBeCloseTo(500);
    expect(wide.y).toBeCloseTo(500);

    // 影片比元素高 → 上下被裁
    const tall = videoAnchorToScreen(box(), 1000, 2000, CENTER)!;
    expect(tall.x).toBeCloseTo(500);
    expect(tall.y).toBeCloseTo(500);
  });

  it('偏離中心的 anchor 會依 cover 放大倍率換算，不是元素比例', () => {
    // frame 2000×1000 進 1000×1000 的框：scale=1，畫面橫跨 −500..1500
    const p = videoAnchorToScreen(box(), 2000, 1000, { x: 0.25, y: 0.5, size: 0.02 })!;
    expect(p.x).toBeCloseTo(0); // 畫面 1/4 處剛好被裁到元素左緣
    // 若誤用「元素比例」會得到 250 —— 差 250px，正是這個函式要防的錯
    expect(p.x).not.toBeCloseTo(250);
  });

  it('size 依畫面寬的放大倍率換算', () => {
    // frame 1920×1080 進 1280×720 的框：scale = 1280/1920，畫面寬放大後仍為 1280
    const p = videoAnchorToScreen(
      box({ width: 1280, height: 720 }),
      1920,
      1080,
      { x: 0.5, y: 0.5, size: 39 / 1920 },
    )!;
    expect(p.size).toBeCloseTo(26); // ＝ CORE.dotSize
  });

  // ── contain（pad / mob，見 HeroVideo 的 .sec1__hero-video-el）────────────
  // 2026-08-26 之前這裡只有 cover：換算寫死 Math.max，而 SCSS 早已把 pad / mob 改成
  // contain ⇒ 兩處交棒在那兩個斷點一路算錯。這組案例就是釘住「fit 有跟上」。
  it('contain 的放大倍率取 min（不是 max），中心仍落在元素中心', () => {
    const args = [box({ width: 390, height: 844 }), 720, 1280] as const;
    const anchor = { x: 0.5, y: 0.5, size: 18 / 720 };

    const contain = videoAnchorToScreen(...args, anchor, { fit: 'contain' })!;
    expect(contain.x).toBeCloseTo(195);
    expect(contain.y).toBeCloseTo(422); // 留白上下等分 → 畫面中心仍是元素中心
    expect(contain.size).toBeCloseTo(18 * (390 / 720)); // 9.75

    // 同一個框用 cover 算會放大 22%（＝改動前 mob 交棒起點偏大的那個量）
    const cover = videoAnchorToScreen(...args, anchor)!;
    expect(cover.size).toBeCloseTo(18 * (844 / 1280)); // 11.87
    expect(cover.size / contain.size).toBeCloseTo(1.217, 2);
  });

  it('contain 時偏離中心的 anchor 依「留白後的畫面高」換算', () => {
    // mob 尾幀那顆實測停在 y = 603/1280 ＝ 中心上方 37 frame px
    const p = videoAnchorToScreen(
      box({ width: 390, height: 844 }),
      720,
      1280,
      { x: 0.5, y: 603 / 1280, size: 18 / 720 },
      { fit: 'contain' },
    )!;
    // 畫面高 1280 × (390/720) ＝ 693.33，上下各留白 75.33
    expect(p.y).toBeCloseTo(75.33 + (603 / 1280) * 693.33, 1);
    expect(422 - p.y).toBeCloseTo(20, 0); // 螢幕上在中心之上 20px
  });

  it('元素本身的螢幕位移要計入（頁面捲動 / 元素不在原點時）', () => {
    const p = videoAnchorToScreen(box({ left: 100, top: -300 }), 1000, 1000, CENTER)!;
    expect(p.x).toBeCloseTo(600);
    expect(p.y).toBeCloseTo(200);
  });

  it('object-position 非 center 時裁切分配跟著改', () => {
    // frame 2000×1000 進 1000×1000：溢出 1000px 全部裁右邊 → 畫面左緣貼齊元素左緣
    const p = videoAnchorToScreen(box(), 2000, 1000, CENTER, {
      objectPosition: { x: 0, y: 0 },
    })!;
    expect(p.x).toBeCloseTo(1000); // 畫面中心在元素座標 1000
  });

  it('metadata 還沒到（videoWidth/Height 為 0）回 null，呼叫端就退回單純淡入', () => {
    expect(videoAnchorToScreen(box(), 0, 0, CENTER)).toBeNull();
    expect(videoAnchorToScreen(box({ width: 0, height: 0 }), 1920, 1080, CENTER)).toBeNull();
  });
});

describe('isVerticallyOnScreen', () => {
  const H = 720; // 視窗高

  it('滿版 hero 停在頂端時在畫面上', () => {
    expect(isVerticallyOnScreen({ top: 0, height: 720 }, H)).toBe(true);
  });

  it('只剩一點點露在上緣仍算在畫面上（交棒照走，起點自然落在畫面外偏上）', () => {
    expect(isVerticallyOnScreen({ top: -719, height: 720 }, H)).toBe(true);
  });

  it('完全捲出上緣 → 不在畫面上', () => {
    expect(isVerticallyOnScreen({ top: -720, height: 720 }, H)).toBe(false);
    expect(isVerticallyOnScreen({ top: -3000, height: 720 }, H)).toBe(false);
  });

  it('還在下緣之外（尚未捲到）→ 不在畫面上', () => {
    expect(isVerticallyOnScreen({ top: 720, height: 720 }, H)).toBe(false);
  });
});

// 驗算用：把 local 位移套上父層旋轉，應該要還原成原本的螢幕位移
const rotate = (x: number, y: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  };
};

describe('unrotateDelta', () => {
  it('父層沒轉時原樣回傳', () => {
    expect(unrotateDelta(30, -40, 0)).toEqual({ x: 30, y: -40 });
  });

  it('父層轉 90°（hero 垂直路徑的切線）時水平位移換到另一軸', () => {
    const d = unrotateDelta(30, -40, 90);
    expect(d.x).toBeCloseTo(-40);
    expect(d.y).toBeCloseTo(-30);
  });

  it('套回父層旋轉後等於原本的螢幕位移（各角度皆然）', () => {
    for (const deg of [0, 37, 90, 180, -125]) {
      const d = unrotateDelta(30, -40, deg);
      const back = rotate(d.x, d.y, deg);
      expect(back.x).toBeCloseTo(30);
      expect(back.y).toBeCloseTo(-40);
    }
  });
});

describe('coreHandoffBackY 的 thunk 形式（避免熱路徑 forced reflow）', () => {
  it('rawP > 0 時完全不呼叫 thunk —— 這就是它存在的理由', () => {
    let calls = 0;
    const scrolled = () => {
      calls += 1;
      return 1234;
    };
    for (const rawP of [0.0001, 0.25, 0.5, 1]) {
      expect(coreHandoffBackY(rawP, 777, scrolled, 400)).toBe(777);
    }
    expect(calls).toBe(0);
  });

  it('rawP <= 0 時才求值，且結果與直接傳數字一致', () => {
    let calls = 0;
    const scrolled = () => {
      calls += 1;
      return 1000;
    };
    expect(coreHandoffBackY(0, 777, scrolled, 400)).toBe(1400);
    expect(coreHandoffBackY(0, 777, 1000, 400)).toBe(1400);
    expect(calls).toBe(1);
  });
});
