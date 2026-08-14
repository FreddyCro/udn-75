import { describe, expect, it } from 'vitest';
import {
  createHeroGestureAccum,
  heroGestureStep,
  type HeroGestureInput,
  type HeroGestureKnobs,
} from '../app/utils/hero-scroll-intent';

// 測試用參數：與 HERO_GESTURE 的預設值相同，但明確寫出來，改預設值不會弄壞測試
const K: HeroGestureKnobs = {
  toOutroPx: 60,
  toLoopPx: 140,
  cooldownMs: 400,
  decayMs: 300,
};

// 只覆寫關心的欄位，其餘給中性值
const input = (over: Partial<HeroGestureInput>): HeroGestureInput => ({
  delta: 0,
  now: 1000,
  inLoop: false,
  isGone: false,
  atTop: false,
  ...over,
});

describe('heroGestureStep', () => {
  it('在 loop 往下但未達門檻時不發意圖，只累積', () => {
    const r = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: 30, inLoop: true }),
      K,
    );
    expect(r.intent).toBe('none');
    expect(r.accum.delta).toBe(30);
  });

  it('在 loop 往下累積過門檻 → to-outro，並把累積量歸零', () => {
    const a = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: 30, now: 1000, inLoop: true }),
      K,
    );
    const b = heroGestureStep(a.accum, input({ delta: 40, now: 1100, inLoop: true }), K);
    expect(b.intent).toBe('to-outro');
    expect(b.accum.delta).toBe(0);
  });

  it('不在 loop（例如 main）往下滑再多都不發意圖', () => {
    const r = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: 500, inLoop: false }),
      K,
    );
    expect(r.intent).toBe('none');
  });

  it('gone 且已在頂端往上累積過門檻 → to-loop', () => {
    const r = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: -200, isGone: true, atTop: true }),
      K,
    );
    expect(r.intent).toBe('to-loop');
    expect(r.accum.delta).toBe(0);
  });

  it('gone 但還沒到頂端往上滑不發意圖', () => {
    const r = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: -200, isGone: true, atTop: false }),
      K,
    );
    expect(r.intent).toBe('none');
  });

  it('回 loop 的門檻比進 outro 高（-100 不夠、-140 才夠）', () => {
    const a = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: -100, now: 1000, isGone: true, atTop: true }),
      K,
    );
    expect(a.intent).toBe('none');
    const b = heroGestureStep(
      a.accum,
      input({ delta: -40, now: 1100, isGone: true, atTop: true }),
      K,
    );
    expect(b.intent).toBe('to-loop');
  });

  it('換方向立即歸零重算：先往下 50 再往上 50 不會互相抵銷成 0', () => {
    const a = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: 50, now: 1000, isGone: true, atTop: true }),
      K,
    );
    const b = heroGestureStep(
      a.accum,
      input({ delta: -50, now: 1050, isGone: true, atTop: true }),
      K,
    );
    expect(b.accum.delta).toBe(-50);
  });

  it('冷卻期內不再發第二次意圖', () => {
    const fired = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: 100, now: 1000, inLoop: true }),
      K,
    );
    expect(fired.intent).toBe('to-outro');
    const soon = heroGestureStep(
      fired.accum,
      input({ delta: 300, now: 1200, inLoop: true }),
      K,
    );
    expect(soon.intent).toBe('none');
    const later = heroGestureStep(
      soon.accum,
      input({ delta: 300, now: 1500, inLoop: true }),
      K,
    );
    expect(later.intent).toBe('to-outro');
  });

  it('超過衰減視窗沒有新輸入就歸零，細碎滑動不會慢慢累積成誤觸', () => {
    const a = heroGestureStep(
      createHeroGestureAccum(),
      input({ delta: 50, now: 1000, inLoop: true }),
      K,
    );
    const b = heroGestureStep(a.accum, input({ delta: 50, now: 1400, inLoop: true }), K);
    expect(b.accum.delta).toBe(50);
    expect(b.intent).toBe('none');
  });
});
