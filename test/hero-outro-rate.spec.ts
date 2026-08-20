import { describe, expect, it } from 'vitest';
import {
  OUTRO_LAG_ENGAGE,
  OUTRO_LAG_RELEASE,
  OUTRO_RATE_FAST,
  OUTRO_RATE_MIN_DWELL_MS,
  OUTRO_RATE_SLOW,
  outroPlaybackRate,
} from '../app/utils/hero-outro-rate';

// 駐留時間已過，可以自由換檔
const FREE = OUTRO_RATE_MIN_DWELL_MS + 1;

describe('outroPlaybackRate', () => {
  it('只吐出節奏安全的兩個倍速，不吐中間值', () => {
    // 影片 30fps、螢幕 60Hz，只有 1×（每格 2 次刷新）與 2×（每格 1 次）有固定節奏。
    // 中間值會讓影格在 1 與 2 次刷新之間不規則交替（2026-08-21 以
    // requestVideoFrameCallback 實測到：1 1 1 1 2 1 1 1 1 2 1 1 1 2 …），肉眼即抖動。
    const seen = new Set<number>();
    for (let lag = -0.5; lag <= 1.5; lag += 0.01) {
      for (const cur of [OUTRO_RATE_SLOW, OUTRO_RATE_FAST]) {
        seen.add(outroPlaybackRate(lag, cur, FREE));
        seen.add(outroPlaybackRate(lag, cur, 0));
      }
    }
    expect([...seen].sort()).toEqual([OUTRO_RATE_SLOW, OUTRO_RATE_FAST]);
  });

  it('駐留時間未滿一律維持現狀 —— 這是治抖動的主要手段', () => {
    // 把值域收成 {1, 2} 之後抖動反而更嚴重（32 幀內切換 25 次、節奏出現 1/2/3 三種）：
    // 每次**改變** playbackRate 都讓媒體管線重新同步。每幀寫入相同值無害，代價全在
    // 改變那一刻。故切換必須是稀有事件，不論落後多少。
    expect(outroPlaybackRate(1, OUTRO_RATE_SLOW, 0)).toBe(OUTRO_RATE_SLOW);
    expect(outroPlaybackRate(-1, OUTRO_RATE_FAST, 0)).toBe(OUTRO_RATE_FAST);
    expect(
      outroPlaybackRate(1, OUTRO_RATE_SLOW, OUTRO_RATE_MIN_DWELL_MS - 1),
    ).toBe(OUTRO_RATE_SLOW);
  });

  it('駐留時間已過 ＋ 落後超過 ENGAGE → 加速', () => {
    expect(
      outroPlaybackRate(OUTRO_LAG_ENGAGE + 0.01, OUTRO_RATE_SLOW, FREE),
    ).toBe(OUTRO_RATE_FAST);
    expect(outroPlaybackRate(0.5, OUTRO_RATE_SLOW, FREE)).toBe(OUTRO_RATE_FAST);
  });

  it('只有影片追過捲動才降回 1× —— RELEASE 是負值', () => {
    // 落後還是正的就繼續 2×：在「還落後」時降速只會讓落後再擴大、稍後又得升回去，
    // 那正是顫振的來源。負的落後 ＝ 影片跑在捲動前面 ＝ 使用者停手了。
    expect(outroPlaybackRate(-0.3, OUTRO_RATE_FAST, FREE)).toBe(
      OUTRO_RATE_SLOW,
    );
    expect(
      outroPlaybackRate(OUTRO_LAG_RELEASE - 0.01, OUTRO_RATE_FAST, FREE),
    ).toBe(OUTRO_RATE_SLOW);
    // 仍落後 0.1（在 RELEASE 與 ENGAGE 之間）→ 維持 2×，不降速
    expect(outroPlaybackRate(0.1, OUTRO_RATE_FAST, FREE)).toBe(
      OUTRO_RATE_FAST,
    );
  });

  it('沒在捲時維持 1× 繼續播，不停下來等捲動', () => {
    // 設計師明確要求的行為。
    expect(outroPlaybackRate(-0.3, OUTRO_RATE_SLOW, FREE)).toBe(
      OUTRO_RATE_SLOW,
    );
  });

  it('遲滯帶內維持現狀', () => {
    const mid = (OUTRO_LAG_ENGAGE + OUTRO_LAG_RELEASE) / 2;
    expect(outroPlaybackRate(mid, OUTRO_RATE_SLOW, FREE)).toBe(
      OUTRO_RATE_SLOW,
    );
    expect(outroPlaybackRate(mid, OUTRO_RATE_FAST, FREE)).toBe(
      OUTRO_RATE_FAST,
    );
  });

  it('遲滯帶的兩個門檻不可交錯', () => {
    expect(OUTRO_LAG_RELEASE).toBeLessThan(OUTRO_LAG_ENGAGE);
  });

  it('current 傳進非法值時退回 1×，不把它原樣吐出去', () => {
    const mid = (OUTRO_LAG_ENGAGE + OUTRO_LAG_RELEASE) / 2;
    expect(outroPlaybackRate(mid, 1.37, FREE)).toBe(OUTRO_RATE_SLOW);
    expect(outroPlaybackRate(mid, 0, FREE)).toBe(OUTRO_RATE_SLOW);
    // 駐留期間也不能把非法值原樣吐回去
    expect(outroPlaybackRate(mid, 1.37, 0)).toBe(OUTRO_RATE_SLOW);
  });
});
