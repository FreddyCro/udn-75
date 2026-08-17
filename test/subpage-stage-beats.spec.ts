import { describe, expect, it } from 'vitest';
import {
  BEAT_LAST_FADE_FROM,
  blockState,
  mediaFadeAlpha,
  stageBeats,
  stageLines,
} from '../app/utils/subpage-stage-beats';

/** 把 progress 換回「從舞台頂算起捲了幾 vh」：pin 距離＝拍數 × 100vh */
const vh = (progress: number, beats: number) => progress * beats * 100;

describe('stageBeats', () => {
  it('有媒體三拍、沒有就一拍', () => {
    expect(stageBeats(true)).toBe(3);
    expect(stageBeats(false)).toBe(1);
  });
});

describe('stageLines', () => {
  it('三拍時各條線落在設計的捲動距離上', () => {
    const l = stageLines(3);
    expect(vh(l.heroOut, 3)).toBeCloseTo(35);
    expect(vh(l.introIn, 3)).toBeCloseTo(50);
    expect(vh(l.introOut, 3)).toBeCloseTo(135);
    expect(vh(l.mediaIn, 3)).toBeCloseTo(150);
    expect(vh(l.mediaFadeFrom, 3)).toBeCloseTo(275);
  });

  it('媒體的淡出窗口是一段真正的捲動距離，且淡完正好是 unpin', () => {
    // 退場綁 progress（見 mediaFadeAlpha），所以這段距離就是「淡出要捲多久」。
    // 太短會變成瞬間消失、scrub 沒有意義；太長則照片賴著不走。
    const l = stageLines(3);
    const win = vh(1, 3) - vh(l.mediaFadeFrom, 3);
    expect(win).toBeGreaterThan(10);
    expect(win).toBeLessThan(50);
  });

  it('加減一拍不挪動既有各塊的時間點（除以拍數的用意）', () => {
    const three = stageLines(3);
    const one = stageLines(1);
    for (const key of ['heroOut', 'introIn', 'introOut'] as const) {
      expect(vh(three[key], 3)).toBeCloseTo(vh(one[key], 1));
    }
  });

  it('沒有媒體時媒體的兩條線落在 1 之後 —— 狀態機整段不啟用', () => {
    const l = stageLines(1);
    expect(l.mediaIn).toBeGreaterThan(1);
    expect(l.mediaFadeFrom).toBeGreaterThan(1);
    // 引言的退場線也一樣過不了，引言會留到 unpin（與加入媒體前的行為相同）
    expect(l.introOut).toBeGreaterThan(1);
  });

  it('進線一律在退場線之前，兩者不會打結', () => {
    const l = stageLines(3);
    expect(l.heroOut).toBeLessThan(l.introIn);
    expect(l.introIn).toBeLessThan(l.introOut);
    expect(l.introOut).toBeLessThan(l.mediaIn);
    expect(l.mediaIn).toBeLessThan(l.mediaFadeFrom);
  });
});

// ── mediaFadeAlpha（退場的 scrub）─────────────────────────────────────
describe('mediaFadeAlpha', () => {
  const { mediaFadeFrom } = stageLines(3);

  it('淡出窗口之前恆為 1，淡完（progress 1）恆為 0', () => {
    expect(mediaFadeAlpha(0, mediaFadeFrom)).toBe(1);
    expect(mediaFadeAlpha(mediaFadeFrom, mediaFadeFrom)).toBe(1);
    expect(mediaFadeAlpha(1, mediaFadeFrom)).toBe(0);
    expect(mediaFadeAlpha(1.5, mediaFadeFrom)).toBe(0); // 越過 end 也不會變負
  });

  it('窗口內線性遞減 —— 同一個 progress 一定得到同一個 alpha（與捲動速度無關）', () => {
    const mid = mediaFadeFrom + (1 - mediaFadeFrom) / 2;
    expect(mediaFadeAlpha(mid, mediaFadeFrom)).toBeCloseTo(0.5);
    const q = mediaFadeFrom + (1 - mediaFadeFrom) / 4;
    expect(mediaFadeAlpha(q, mediaFadeFrom)).toBeCloseTo(0.75);
  });

  it('單調遞減，不會中途回頭', () => {
    let prev = 1;
    for (let p = mediaFadeFrom; p <= 1.0001; p += 0.005) {
      const a = mediaFadeAlpha(p, mediaFadeFrom);
      expect(a).toBeLessThanOrEqual(prev);
      prev = a;
    }
  });

  it('fadeTo ≤ fadeFrom 時退化成硬切，不吐 NaN／Infinity', () => {
    // NaN 餵給 opacity 是無效值 → 靜默不套用，照片會留在畫面上，正是要避免的失敗模式
    for (const v of [mediaFadeAlpha(0.9, 0.5, 0.5), mediaFadeAlpha(0.9, 0.5, 0.4)]) {
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBe(0);
    }
  });
});

describe('blockState', () => {
  // 媒體的退場線由 Subpage 傳 1（一路演到 pin 結束，淡出交給 scrub），這裡照那個用法測
  const { mediaIn } = stageLines(3);
  const OUT = 1;

  it('三態依序照 progress 推進', () => {
    expect(blockState(0, mediaIn, OUT)).toBe('before');
    expect(blockState(0.49, mediaIn, OUT)).toBe('before');
    expect(blockState(0.7, mediaIn, OUT)).toBe('shown');
    expect(blockState(1, mediaIn, OUT)).toBe('after');
  });

  it('邊界：進線含（該進場了）、退場線含（該送走了）', () => {
    expect(blockState(mediaIn, mediaIn, OUT)).toBe('shown');
    expect(blockState(OUT, mediaIn, OUT)).toBe('after');
  });

  it('回捲會原路退回 before，不會卡在 after', () => {
    expect(blockState(OUT, mediaIn, OUT)).toBe('after');
    expect(blockState(mediaIn - 0.01, mediaIn, OUT)).toBe('before');
  });

  it('退場線在 1 之後（無媒體的引言）永遠進不了 after', () => {
    const { introIn, introOut } = stageLines(1);
    expect(blockState(1, introIn, introOut)).toBe('shown');
  });

  it('媒體的淡出起點就是那一拍的 BEAT_LAST_FADE_FROM', () => {
    const { mediaFadeFrom } = stageLines(3);
    expect(mediaFadeFrom * 3 - 2).toBeCloseTo(BEAT_LAST_FADE_FROM);
  });
});
