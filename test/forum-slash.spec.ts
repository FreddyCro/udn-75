import { describe, expect, it } from 'vitest';
import {
  nearestArcLength,
  slashCoreScaleAt,
  slashDrawAt,
} from '../app/utils/forum-slash';
import section2 from '../app/locales/section2.json';
import { CORE, FORUM_SLASH_AT, FORUM_SLASH_CORE } from '../app/utils/orange-core-config';

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

// 核心縮成筆尖。窗口用弧長 [1000, 1200]、斜坡 80、筆尖倍率 0.37（≈ pc 的 9.6 / 26）。
describe('slashCoreScaleAt', () => {
  const lens: [number, number] = [1000, 1200];
  const tip = 9.6 / CORE.dotSize;
  const at = (len: number, ramp = 80, t = tip) =>
    slashCoreScaleAt(len, lens, ramp, t);

  it('斜坡之外維持原尺寸（前後都要）', () => {
    expect(at(500)).toBe(1);
    expect(at(920)).toBe(1); // 正好是斜坡起點
    expect(at(1280)).toBe(1); // 正好是斜坡終點
    expect(at(5000)).toBe(1);
  });

  it('窗口起點之前就已經縮完 —— 撇的第一個 pixel 是筆尖畫的', () => {
    expect(at(1000)).toBeCloseTo(tip, 10);
  });

  it('整個窗口內維持筆尖，不隨畫出比例再變', () => {
    expect(at(1000)).toBeCloseTo(tip, 10);
    expect(at(1100)).toBeCloseTo(tip, 10);
    expect(at(1200)).toBeCloseTo(tip, 10);
  });

  it('離開窗口後還原成原尺寸', () => {
    expect(at(1200 + 80)).toBe(1);
  });

  it('斜坡上單調遞減／遞增，且兩端一階導數為 0（smoothstep）', () => {
    const ramp = [920, 940, 960, 980, 1000].map((l) => at(l));
    for (let i = 1; i < ramp.length; i++) {
      expect(ramp[i]!).toBeLessThan(ramp[i - 1]!);
    }
    // 斜坡中點 ＝ 兩端的算術中點（smoothstep(0.5) = 0.5）
    expect(at(960)).toBeCloseTo((1 + tip) / 2, 10);
    // 兩端平緩：頭尾各 5% 的位移量遠小於中段同樣寬度的位移量
    const head = 1 - at(924);
    const mid = at(958) - at(962);
    expect(head).toBeLessThan(mid);
  });

  it('窗口為 null（沒有那一撇）→ 恆 1', () => {
    expect(slashCoreScaleAt(1100, null, 80, tip)).toBe(1);
  });

  it('量不到脊寬（tipScale 落在 (0,1) 之外）→ 恆 1，核心不可塌成 0', () => {
    for (const bad of [0, -1, 1, 2, Number.NaN]) {
      expect(slashCoreScaleAt(1100, lens, 80, bad)).toBe(1);
      expect(slashCoreScaleAt(960, lens, 80, bad)).toBe(1);
    }
  });

  it('斜坡為 0 → 退化成硬切，不做除以零', () => {
    expect(at(999.9, 0)).toBe(1);
    expect(at(1000, 0)).toBeCloseTo(tip, 10);
    expect(at(1200, 0)).toBeCloseTo(tip, 10);
    expect(at(1200.1, 0)).toBe(1);
    expect(Number.isNaN(at(1000, 0))).toBe(false);
  });

  it('全程夾在 [tipScale, 1] 內 —— 不會過衝出比原尺寸更大／比筆尖更小', () => {
    for (let len = 800; len <= 1400; len += 7) {
      const s = at(len);
      expect(s).toBeGreaterThanOrEqual(tip);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it('shrinkLen 是正數 —— 0 會讓兩端各跳一下（見 FORUM_SLASH_CORE 的取捨）', () => {
    expect(FORUM_SLASH_CORE.shrinkLen).toBeGreaterThan(0);
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

// section2.json 的結構：論壇一~三在 forum.events[]，論壇四單獨掛在 forum.event4
//（它在版面上與前三場分離 —— 在議程之後）。兩處都要驗，才守得住「只有論壇二交給核心」。
describe('資料層', () => {
  const events = section2.forum.events as { no: string; layout: string; slash?: boolean | string }[];
  const event4 = section2.forum.event4 as { no: string; layout: string; slash?: boolean | string };

  it('論壇一~三之中只有論壇二把那一撇交給核心畫', () => {
    const core = events.filter((e) => e.slash === 'core').map((e) => e.no);
    expect(core).toEqual(['論壇二']);
  });

  it('論壇四是階梯式但自己畫實體斜線（不受本次改動影響）', () => {
    expect(event4.no).toBe('論壇四');
    expect(event4.layout).toBe('youth');
    expect(event4.slash).toBe(true);
  });

  it('三個斷點各有一組窗口設定（null ＝ 由幾何推導）', () => {
    expect(Object.keys(FORUM_SLASH_AT).sort()).toEqual(['mob', 'pad', 'pc']);
    for (const w of Object.values(FORUM_SLASH_AT)) {
      if (w === null) continue;
      expect(w[0]).toBeGreaterThanOrEqual(0);
      expect(w[1]).toBeLessThanOrEqual(1);
      expect(w[0]).toBeLessThanOrEqual(w[1]);
    }
  });

  // 2026-08-12 的實際事故：三個斷點初值都填了 pc 實測的 [0.40, 0.41] —— override 分支
  // 因此永遠先返回，幾何推導在 production 完全跑不到，而 pad / mob 是流排版，
  // 那一撇會在核心根本不在 09/15 的位置畫出來。指紋就是「三個斷點同一組數字」。
  it('override 是逐斷點的例外，不可三個斷點填同一組數字', () => {
    const filled = Object.values(FORUM_SLASH_AT).filter((w) => w !== null);
    if (filled.length < 3) return; // 至少有一個走推導 → 沒有這個問題
    const uniq = new Set(filled.map((w) => w!.join(',')));
    expect(uniq.size).toBeGreaterThan(1);
  });
});
