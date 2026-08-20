import { describe, expect, it } from 'vitest';
import {
  DISSOLVE_ENTER,
  DISSOLVE_FADE_FROM,
  DISSOLVE_LEAVE,
  OUTRO_HOLD_SCALE,
  dissolveAlpha,
  dissolveState,
  outroHoldScale,
} from '../app/utils/hero-dissolve';

describe('dissolveAlpha', () => {
  it('端點必須精確是 1 與 0', () => {
    // 端點不精確的話：0 那端影片永遠留一層殘影蓋在引言上；
    // 1 那端開場第一幀會看到影片半透明。
    expect(dissolveAlpha(0)).toBe(1);
    expect(dissolveAlpha(1)).toBe(0);
  });

  it('FADE_FROM 之前全程維持全實 —— 疊影只准出現在尾段', () => {
    // 原本是全程線性（1 − x），整段行程都有半透明影片疊在引言上，那是設計要拿掉的。
    expect(dissolveAlpha(0.25)).toBe(1);
    expect(dissolveAlpha(0.5)).toBe(1);
    expect(dissolveAlpha(DISSOLVE_FADE_FROM)).toBe(1);
  });

  it('FADE_FROM 之後線性收到 0', () => {
    const mid = DISSOLVE_FADE_FROM + (1 - DISSOLVE_FADE_FROM) / 2;
    expect(dissolveAlpha(mid)).toBeCloseTo(0.5, 5);
  });

  it('區間外要夾住，不吐出界的值', () => {
    // ScrollTrigger 在 refresh 前後偶爾會給出略超界的 progress。
    expect(dissolveAlpha(-0.3)).toBe(1);
    expect(dissolveAlpha(1.4)).toBe(0);
  });
});

describe('outroHoldScale', () => {
  it('端點：不捲時不縮放、捲完時吃滿', () => {
    expect(outroHoldScale(0)).toBe(1);
    expect(outroHoldScale(1)).toBeCloseTo(1 + OUTRO_HOLD_SCALE, 10);
  });

  it('區間內單調遞增 —— 這就是「捲動有反應」的全部來源', () => {
    // 退場那段行程裡畫面上除了影片沒有東西可以動（引言還在視窗外），
    // 沒有這條連動，捲與不捲畫面一模一樣。
    let prev = outroHoldScale(0);
    for (let p = 0.05; p <= 1; p += 0.05) {
      const now = outroHoldScale(p);
      expect(now).toBeGreaterThan(prev);
      prev = now;
    }
  });

  it('區間外要夾住', () => {
    expect(outroHoldScale(-0.5)).toBe(1);
    expect(outroHoldScale(2)).toBeCloseTo(1 + OUTRO_HOLD_SCALE, 10);
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

  it('outroForced：SKIP 在 page top 放的 outro，不因 p 還是 0 就被收回 loop', () => {
    // skip() 直接把狀態設成 outro，而此時人在 page top、p 是 0 —— 少了這面栓，
    // 使用者捲一點點（p 尚未越過 ENTER）就會被判回 loop、影片 seek 回 30s，
    // 再捲多一點又跳回 outro seek 36s，看起來就是抽一下。
    expect(dissolveState(0, 'outro', false, true)).toBe('outro');
    expect(dissolveState(DISSOLVE_LEAVE - 0.001, 'outro', false, true)).toBe(
      'outro',
    );
  });

  it('outroForced 只擋「回 loop」那一條，其餘規則照舊', () => {
    // 捲到底仍要收尾（否則 orange core 接不上）；越過 ENTER 本來就是 outro；
    // 已交棒過（outroSpent）仍優先 —— 那是「這一趟看過了」，與栓無關。
    expect(dissolveState(1, 'outro', false, true)).toBe('gone');
    expect(dissolveState(0.5, 'loop', false, true)).toBe('outro');
    expect(dissolveState(0, 'gone', true, true)).toBe('loop');
  });
});
