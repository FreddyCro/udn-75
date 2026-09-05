import { describe, expect, it } from 'vitest';
import { artSpriteHref, pickArtBreakpoint } from '../app/utils/art-sprite';

const id = (p: string) => p;

describe('artSpriteHref', () => {
  it('sprite 檔依斷點、fragment 依檔名', () => {
    expect(artSpriteHref('/img/forum/forum1-title-pc-1.svg', 'pc', id)).toBe('/img/sprites/art-pc.svg#forum1-title-pc-1');
    expect(artSpriteHref('/img/blessing/blessing-title-mob.svg', 'mob', id)).toBe('/img/sprites/art-mob.svg#blessing-title-mob');
  });
  it('資產前綴套在 sprite 路徑上', () => {
    expect(artSpriteHref('/img/forum/x-pad-2.svg', 'pad', (p) => `https://vip.udn.com/newmedia/2026/udn75${p}`))
      .toBe('https://vip.udn.com/newmedia/2026/udn75/img/sprites/art-pad.svg#x-pad-2');
  });
});

// 斷點界線必須與 UArtLine.vue 的 SCSS 一致：pc ≥1280（rwd-min('pc')）、pad 768–1279、mob <768。
describe('pickArtBreakpoint', () => {
  it('1280 起是 pc、768–1279 是 pad、767 以下是 mob', () => {
    expect(pickArtBreakpoint(1280)).toBe('pc');
    expect(pickArtBreakpoint(1279)).toBe('pad');
    expect(pickArtBreakpoint(768)).toBe('pad');
    expect(pickArtBreakpoint(767)).toBe('mob');
    expect(pickArtBreakpoint(320)).toBe('mob');
  });
});
