import { describe, expect, it } from 'vitest';
import {
  consumeHomeRestart,
  requestHomeRestart,
  resolveHomeIntent,
} from '../app/utils/home-intent';

describe('resolveHomeIntent', () => {
  it('首頁：就地倒帶，不走路由', () => {
    expect(resolveHomeIntent(true)).toEqual({ action: 'in-page', to: '/' });
  });

  it('首頁的 to 仍是首頁：中鍵／新分頁開啟要有正確目標', () => {
    expect(resolveHomeIntent(true).to).toBe('/');
  });

  it('子頁：導航回首頁，**不帶 hash**', () => {
    expect(resolveHomeIntent(false)).toEqual({ action: 'navigate', to: '/' });
  });

  // 這條釘住 2026-08-22 的裁決：重播意圖改由旗子傳遞，不再放在 URL fragment。
  // 放回 hash 的話：reload／新分頁會重現一個跳過 start 閘門的靜音開場，
  // 且瀏覽器「上一頁」回首頁會再 restart 一次、蓋掉 savedPosition。
  it('回首頁的目的地永遠不含 hash', () => {
    for (const isHome of [true, false]) {
      expect(resolveHomeIntent(isHome).to).not.toContain('#');
    }
  });
});

describe('requestHomeRestart / consumeHomeRestart', () => {
  it('沒有人請求過：消耗回傳 false（＝照首訪流程走）', () => {
    expect(consumeHomeRestart({ value: false })).toBe(false);
  });

  it('請求過：消耗回傳 true', () => {
    const intent = { value: false };
    requestHomeRestart(intent);
    expect(consumeHomeRestart(intent)).toBe(true);
  });

  it('一次性：消耗過就清掉，第二次回傳 false', () => {
    const intent = { value: false };
    requestHomeRestart(intent);
    consumeHomeRestart(intent);
    expect(consumeHomeRestart(intent)).toBe(false);
  });

  // 上一頁／之後任何一次進首頁都不該重播 —— 旗子只由 logo 點擊設起。
  it('消耗後旗子本身也是 false（不留幽靈狀態）', () => {
    const intent = { value: false };
    requestHomeRestart(intent);
    consumeHomeRestart(intent);
    expect(intent.value).toBe(false);
  });
});
