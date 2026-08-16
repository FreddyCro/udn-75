import { describe, expect, it } from 'vitest';
import {
  DISSOLVE_ENTER,
  DISSOLVE_LEAVE,
  dissolveAlpha,
  dissolveState,
} from '../app/utils/hero-dissolve';

describe('dissolveAlpha', () => {
  it('端點必須精確是 1 與 0', () => {
    // 端點不精確的話：0 那端影片永遠留一層殘影蓋在引言上；
    // 1 那端開場第一幀會看到影片半透明。
    expect(dissolveAlpha(0)).toBe(1);
    expect(dissolveAlpha(1)).toBe(0);
  });

  it('區間內線性', () => {
    expect(dissolveAlpha(0.25)).toBeCloseTo(0.75, 5);
    expect(dissolveAlpha(0.5)).toBeCloseTo(0.5, 5);
  });

  it('區間外要夾住，不吐出界的值', () => {
    // ScrollTrigger 在 refresh 前後偶爾會給出略超界的 progress。
    expect(dissolveAlpha(-0.3)).toBe(1);
    expect(dissolveAlpha(1.4)).toBe(0);
  });
});

describe('dissolveState', () => {
  it('正片期間 scrub 一律不作數', () => {
    // main 期間頁面鎖著、p 恆為 0，若讓它推導就會把狀態打成 loop、
    // 正片直接被跳掉。
    expect(dissolveState(0, 'main')).toBe('main');
    expect(dissolveState(0.5, 'main')).toBe('main');
    expect(dissolveState(1, 'main')).toBe('main');
  });

  it('p 越過 ENTER 進 outro', () => {
    expect(dissolveState(DISSOLVE_ENTER + 0.001, 'loop')).toBe('outro');
    expect(dissolveState(0.5, 'loop')).toBe('outro');
  });

  it('p 落回 LEAVE 之下回 loop', () => {
    expect(dissolveState(DISSOLVE_LEAVE - 0.001, 'outro')).toBe('loop');
    expect(dissolveState(0, 'outro')).toBe('loop');
  });

  it('遲滯帶內維持現狀 —— 這是不重複 seek 影片的關鍵', () => {
    // 停在邊界上的微小抖動（觸控板慣性、橡皮筋）若沒有遲滯，
    // 會讓影片在 loop 段與退場段之間反覆 seek。
    const mid = (DISSOLVE_ENTER + DISSOLVE_LEAVE) / 2;
    expect(dissolveState(mid, 'loop')).toBe('loop');
    expect(dissolveState(mid, 'outro')).toBe('outro');
  });

  it('p 抵達 1 就是 gone，且往回捲可逆', () => {
    expect(dissolveState(1, 'outro')).toBe('gone');
    expect(dissolveState(1.2, 'gone')).toBe('gone');
    expect(dissolveState(0.5, 'gone')).toBe('outro');
  });

  it('退場已交棒過（outroSpent）→ 往回捲直接回 loop，不再經過 outro', () => {
    // 退場段播完會停在最後一格，而那一格的構圖**就是** gone（橘方塊在正中央，
    // 見 HERO_OUTRO_CORE_ANCHOR 的交棒）。往回捲時若把狀態送回 outro，畫面淡回來的
    // 是那一格凍住的畫面 —— 使用者看到的仍然是 gone，影片「回不到 loop」。
    expect(dissolveState(0.99, 'gone', true)).toBe('loop');
    expect(dissolveState(0.5, 'gone', true)).toBe('loop');
    expect(dissolveState(0.5, 'loop', true)).toBe('loop');
  });

  it('outroSpent 蓋不過 gone —— 再往下捲仍要收尾', () => {
    // 回到 loop 之後再往下捲：這一趟不重播退場段（已經看過），但 p 抵達 1
    // 還是要進 gone，否則 orange core 接不上。
    expect(dissolveState(1, 'loop', true)).toBe('gone');
  });
});
