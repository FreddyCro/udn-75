import { describe, expect, it } from 'vitest';
import {
  FORUM_HANDOFF,
  SYMBOL_INTRO,
  SYMBOL_STOPS,
  SYMBOL_VH,
  symbolIntroOpacity,
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

describe('symbolIntroOpacity', () => {
  it('文案期之外恆為 0', () => {
    expect(symbolIntroOpacity(0)).toBe(0);
    expect(symbolIntroOpacity(SYMBOL_INTRO.in)).toBe(0);
    expect(symbolIntroOpacity(SYMBOL_INTRO.out)).toBe(0);
    expect(symbolIntroOpacity(0.5)).toBe(0);
    expect(symbolIntroOpacity(1)).toBe(0);
  });

  it('全亮期恆為 1', () => {
    expect(symbolIntroOpacity(SYMBOL_INTRO.full)).toBe(1);
    expect(symbolIntroOpacity(0.14)).toBe(1);
    expect(symbolIntroOpacity(SYMBOL_INTRO.fadeOut)).toBe(1);
  });

  it('淡入段單調遞增', () => {
    const a = symbolIntroOpacity(0.04);
    const b = symbolIntroOpacity(0.06);
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(a);
    expect(b).toBeLessThan(1);
  });

  it('淡出段單調遞減', () => {
    const a = symbolIntroOpacity(0.22);
    const b = symbolIntroOpacity(0.24);
    expect(a).toBeLessThan(1);
    expect(b).toBeLessThan(a);
    expect(b).toBeGreaterThan(0);
  });

  // 捲動可能超出 0..1（ScrollTrigger 已 clamp，但這支函式不該假設呼叫端做過）
  it('超出範圍的輸入不會回傳 NaN 或負值', () => {
    expect(symbolIntroOpacity(-1)).toBe(0);
    expect(symbolIntroOpacity(2)).toBe(0);
  });
});
