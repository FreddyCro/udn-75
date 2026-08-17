import { describe, expect, it } from 'vitest';
import common from '../app/locales/common.json';
import { HERO_RETURN_HASH, resolveHomeIntent } from '../app/utils/home-intent';

describe('resolveHomeIntent', () => {
  it('首頁：就地倒帶，不走路由', () => {
    expect(resolveHomeIntent(true)).toEqual({ action: 'in-page', to: '/' });
  });

  it('首頁的 to 仍是首頁：中鍵／新分頁開啟要有正確目標', () => {
    expect(resolveHomeIntent(true).to).toBe('/');
  });

  it('子頁：導航回首頁並帶上 loop 的保留 hash', () => {
    expect(resolveHomeIntent(false)).toEqual({
      action: 'navigate',
      to: '/#loop',
    });
  });
});

describe('HERO_RETURN_HASH', () => {
  // 相撞的話，帶 #loop 回首頁會同時「進 loop」又被捲到那個段落。
  // 這條測試盯著 common.json —— 之後新增錨點若取名 loop 會當場失敗。
  it('不可與任何 header 錨點的 target 相撞', () => {
    const targets = common.headerAnchors.map((a) => a.target);
    expect(targets).not.toContain(HERO_RETURN_HASH);
  });
});
