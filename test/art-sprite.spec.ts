import { describe, expect, it } from 'vitest';
import { artSpriteHref, pickArtBreakpoint } from '../app/utils/art-sprite';

const id = (p: string) => p;

describe('artSpriteHref', () => {
  it('sprite 檔依斷點、fragment 依檔名', () => {
    expect(artSpriteHref('/img/forum/forum1-title-pc-1.svg', 'pc', id)).toBe('/img/sprites/art-pc.svg#forum1-title-pc-1');
    expect(artSpriteHref('/img/blessing/blessing-title-mob.svg', 'mob', id)).toBe('/img/sprites/art-mob.svg#blessing-title-mob');
  });
  // 前綴來自 useSpriteUrl()（app.baseURL 的純路徑），子路徑部署才指得到 sprite。
  // ⚠️ 這裡刻意不吃 useAssetUrl()／APP_ASSETS_PATH：那可能是別的 origin，而跨源的
  //    <use> 會靜默失效（見 test/sprite-same-origin-href.spec.ts 的事故說明）。
  it('部署前綴（baseURL）套在 sprite 路徑上', () => {
    expect(artSpriteHref('/img/forum/x-pad-2.svg', 'pad', (p) => `/newmedia/2026/udn75${p}`))
      .toBe('/newmedia/2026/udn75/img/sprites/art-pad.svg#x-pad-2');
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
