import { describe, expect, it } from 'vitest';
import { shouldLockHeroScroll } from '../app/utils/hero-scroll-lock';

// 捲動鎖的真值表。2026-08-16 起只剩「正片且還沒看完過」一條。
describe('shouldLockHeroScroll', () => {
  it('正片期間鎖住 —— 品牌開場不可跳過', () => {
    expect(shouldLockHeroScroll('main', false)).toBe(true);
  });

  it('loop 起解鎖 —— 不解鎖就沒有捲動可以驅動 scrub，會死結', () => {
    expect(shouldLockHeroScroll('loop', false)).toBe(false);
    expect(shouldLockHeroScroll('outro', false)).toBe(false);
    expect(shouldLockHeroScroll('gone', false)).toBe(false);
  });

  it('看完過開場之後連正片都不鎖（倒帶回來不重新上鎖）', () => {
    expect(shouldLockHeroScroll('main', true)).toBe(false);
  });
});
