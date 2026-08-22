import { describe, expect, it } from 'vitest';
import { shouldLockHeroScroll } from '../app/utils/hero-scroll-lock';

// 捲動鎖的真值表。2026-08-22（順播 ＋ restart）起：
//   鎖住 = 正片（main）＋ 還沒播完的退場段（outro && !outroWatched）
describe('shouldLockHeroScroll', () => {
  it('正片期間鎖住 —— 品牌開場不可跳過', () => {
    expect(shouldLockHeroScroll('main', false)).toBe(true);
    // outroWatched 是上一趟的殘值也不影響 main：setState('main') 會把它清掉，
    // 這裡只是釘住「main 不看第二個輸入」這件事。
    expect(shouldLockHeroScroll('main', true)).toBe(true);
  });

  it('退場段還沒播完 → 繼續鎖著，這才是「捲太快看不到 outro」的解法', () => {
    // 退場是由正片順播進來的（scrollY 0、鎖從未鬆開），故不會有 2026-08-07 那次
    // 「鎖在半路介入、畫面凍在 scrollY 400」的失敗模式。
    expect(shouldLockHeroScroll('outro', false)).toBe(true);
  });

  it('退場段播完（或被 SKIP 放棄）→ 解鎖，讓捲動去驅動溶解', () => {
    // 不解鎖就沒有捲動可以驅動 scrub，會死結。
    expect(shouldLockHeroScroll('outro', true)).toBe(false);
  });

  it('gone 一律不鎖', () => {
    expect(shouldLockHeroScroll('gone', false)).toBe(false);
    expect(shouldLockHeroScroll('gone', true)).toBe(false);
  });
});
