import { describe, expect, it } from 'vitest';
import {
  FORUM_HANDOFF,
  INTRO_LINE_SHIFT,
  SYMBOL_INTRO,
  SYMBOL_STOPS,
  SYMBOL_VH,
  symbolIntroLine,
  symbolIntroOutOpacity,
} from '../app/utils/orange-core-config';

// 這支守的是「門檻之間的關係」，不是門檻的值 —— 值本來就該能自由微調，
// 但一旦某個關係被打破，畫面上會出現說不清楚的破圖（文字沒淡完就開始集合人像、
// 議程在視窗底緣被看到淡入）。關係寫成測試，值就能放心改。
describe('符號段序列門檻', () => {
  it('SYMBOL_STOPS 的 until 嚴格遞增且以 1 收尾', () => {
    const untils = SYMBOL_STOPS.map((s) => s.until);
    for (let i = 1; i < untils.length; i++) {
      expect(untils[i]!).toBeGreaterThan(untils[i - 1]!);
    }
    expect(untils.at(-1)).toBe(1);
  });

  it('converge 的終點就是交棒點（coreIn），不是另外手寫的數字', () => {
    const converge = SYMBOL_STOPS.find((s) => s.mode === 'converge');
    expect(converge?.until).toBe(FORUM_HANDOFF.coreIn);
  });

  it('開場文案必須在進入 face 之前淡完', () => {
    const disperseUntil = SYMBOL_STOPS[0]!.until;
    expect(SYMBOL_INTRO.in).toBeLessThan(SYMBOL_INTRO.full);
    expect(SYMBOL_INTRO.full).toBeLessThan(SYMBOL_INTRO.fadeOut);
    expect(SYMBOL_INTRO.fadeOut).toBeLessThan(SYMBOL_INTRO.out);
    expect(SYMBOL_INTRO.out).toBeLessThan(disperseUntil);
  });

  // agendaIn 的作用是讓議程那 0.4s 的淡入發生在畫面外，判準是「符號段底緣還在
  // 視窗底下方多遠」。現況 32vh 是已驗證可行的距離，不得因為等比縮放而變小。
  it('議程淡入距段尾至少 32vh（發生在畫面外）', () => {
    const gapVh = (FORUM_HANDOFF.coreOut - FORUM_HANDOFF.agendaIn) * SYMBOL_VH * 100;
    // 容差 1e-9：純粹吸收 IEEE754 浮點數表示 0.92 / 1.0 的誤差（實測差 ≈1.4e-14 vh），
    // 不是放寬門檻本身 —— 真的退步到 32vh 以下會差好幾個 vh，不會被這個容差蓋過去。
    expect(gapVh).toBeGreaterThanOrEqual(32 - 1e-9);
  });

  it('agendaIn 早於 coreOut，coreOut 收在段尾', () => {
    expect(FORUM_HANDOFF.agendaIn).toBeLessThan(FORUM_HANDOFF.coreOut);
    expect(FORUM_HANDOFF.coreOut).toBe(1.0);
  });
});

describe('symbolIntroOutOpacity（整組退場）', () => {
  it('淡出起點之前恆為 1', () => {
    expect(symbolIntroOutOpacity(0)).toBe(1);
    expect(symbolIntroOutOpacity(SYMBOL_INTRO.full)).toBe(1);
    expect(symbolIntroOutOpacity(SYMBOL_INTRO.fadeOut)).toBe(1);
  });

  it('淡出終點之後恆為 0', () => {
    expect(symbolIntroOutOpacity(SYMBOL_INTRO.out)).toBe(0);
    expect(symbolIntroOutOpacity(0.5)).toBe(0);
    expect(symbolIntroOutOpacity(1)).toBe(0);
  });

  it('淡出段單調遞減', () => {
    const a = symbolIntroOutOpacity(0.22);
    const b = symbolIntroOutOpacity(0.24);
    expect(a).toBeLessThan(1);
    expect(b).toBeLessThan(a);
    expect(b).toBeGreaterThan(0);
  });

  it('超出範圍的輸入不會回傳 NaN 或負值', () => {
    expect(symbolIntroOutOpacity(-1)).toBe(1);
    expect(symbolIntroOutOpacity(2)).toBe(0);
  });
});

// 三行的窗由 in / full 與行數推導（見 orange-core-config 的 symbolIntroLine）。
// 這支守的是「依序」與「在 full 收齊」這兩件關係，不是窗的絕對值。
describe('symbolIntroLine（逐行進場）', () => {
  const COUNT = 3;
  const line = (p: number, i: number) => symbolIntroLine(p, i, COUNT);

  it('進場起點之前，三行都還沒開始', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(line(SYMBOL_INTRO.in, i).opacity).toBe(0);
      expect(line(SYMBOL_INTRO.in, i).reveal).toBe(0);
      expect(line(0, i).opacity).toBe(0);
    }
  });

  it('full 之後三行全部到位（第三行的窗結尾正好是 full）', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(line(SYMBOL_INTRO.full, i).opacity).toBe(1);
      expect(line(SYMBOL_INTRO.full, i).reveal).toBe(1);
      expect(line(SYMBOL_INTRO.full, i).shift).toBe(0);
    }
  });

  it('三行嚴格依序：任一點上，前面的行不落後於後面的行', () => {
    for (const p of [0.03, 0.05, 0.07, 0.09, 0.11, 0.13]) {
      expect(line(p, 0).opacity).toBeGreaterThanOrEqual(line(p, 1).opacity);
      expect(line(p, 1).opacity).toBeGreaterThanOrEqual(line(p, 2).opacity);
    }
    // 且中段真的拉得開（不是三行同時跑）
    expect(line(0.08, 0).opacity).toBe(1);
    expect(line(0.08, 2).opacity).toBe(0);
  });

  it('shift 與 opacity 反向：未進場時在下方 INTRO_LINE_SHIFT px、到位時歸零', () => {
    expect(line(SYMBOL_INTRO.in, 0).shift).toBe(INTRO_LINE_SHIFT);
    expect(line(SYMBOL_INTRO.full, 2).shift).toBe(0);
  });

  it('reveal 早於 opacity 收尾（最後一段是已可讀的整行升到定位）', () => {
    // 第一行的窗 = [in, in + 2·stagger]；取窗內 85% 處
    const stagger = (SYMBOL_INTRO.full - SYMBOL_INTRO.in) / (COUNT - 1 + 2);
    const p = SYMBOL_INTRO.in + 2 * stagger * 0.85;
    expect(line(p, 0).reveal).toBe(1);
    expect(line(p, 0).opacity).toBeLessThan(1);
  });

  it('換行數時最後一行的窗仍收在 full', () => {
    for (const count of [1, 2, 4, 5]) {
      const last = symbolIntroLine(SYMBOL_INTRO.full, count - 1, count);
      expect(last.opacity).toBe(1);
      expect(last.reveal).toBe(1);
      // 且在 full 之前尚未到位（窗真的有寬度）
      expect(symbolIntroLine(SYMBOL_INTRO.full - 1e-4, count - 1, count).opacity)
        .toBeLessThan(1);
    }
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const p of [-1, 2]) {
      const r = line(p, 1);
      expect(Number.isNaN(r.opacity)).toBe(false);
      expect(Number.isNaN(r.shift)).toBe(false);
      expect(Number.isNaN(r.reveal)).toBe(false);
    }
  });
});
