import { describe, expect, it } from 'vitest';
import {
  BEAT_LAST_FADE_FROM,
  MEDIA_ONLY_PIN_VH,
  blockState,
  mediaFadeAlpha,
  shouldRunMediaPin,
  shouldRunStage,
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

// ── 手機版「只 pin 媒體」（2026-08-28）────────────────────────────────────────
// 設計師改口：滿版媒體在手機上也要定住（推翻設計稿的「一樣滾動離開」，其餘不變）。
// 這一組守的是那條路徑的**兩條硬需求**：與三拍舞台互斥、reduced-motion 不鬆綁；
// 以及距離的換算關係（曲線本身沿用 mediaFadeAlpha，上面已經測過）。
describe('shouldRunMediaPin（手機版只 pin 媒體）', () => {
  it('窄螢幕且沒要求減少動態 → 跑', () => {
    expect(shouldRunMediaPin({ reducedMotion: false, narrow: true })).toBe(true);
  });

  // 寬螢幕由三拍舞台接手（媒體在它的第三拍裡本來就會定住），這條路徑不該重複插手。
  it('寬螢幕 → 不跑（交給 shouldRunStage 那套）', () => {
    expect(shouldRunMediaPin({ reducedMotion: false, narrow: false })).toBe(
      false,
    );
  });

  // reduced-motion 是無障礙需求、不是設計偏好 —— 不隨這次改口鬆綁。
  it('reduced-motion → 一律不跑（連窄螢幕也不跑）', () => {
    expect(shouldRunMediaPin({ reducedMotion: true, narrow: true })).toBe(false);
    expect(shouldRunMediaPin({ reducedMotion: true, narrow: false })).toBe(
      false,
    );
  });

  // 互斥是版型的不變量：兩條同時為真 ⇒ 三拍舞台與單獨的媒體 pin 會各自對 mediaRef
  // 排一份 pin 與一份 alpha，畫面上是照片閃爍＋pin-spacer 疊兩層。
  it('與 shouldRunStage 恆互斥（四種輸入組合都不會同時為真）', () => {
    for (const reducedMotion of [false, true]) {
      for (const narrow of [false, true]) {
        const stage = shouldRunStage({ reducedMotion, narrow });
        const mediaPin = shouldRunMediaPin({ reducedMotion, narrow });
        expect(stage && mediaPin, `${reducedMotion} / ${narrow}`).toBe(false);
      }
    }
  });
});

// 手機版的距離是**感知量**（設計師實機定的），不像淡出距離那樣可以推導 —— 所以這裡
// 不釘住它的值，只釘住「它是整段定住」這件語意，以及不要退化成桌機那種可推導的東西。
describe('MEDIA_ONLY_PIN_VH（手機版的 pin 距離 ＝ 定住距離）', () => {
  // 初版取 1（＝ 由舊的非 pin 時長換算），設計師實機回報「沒有感覺 pin 住」後改為 2。
  // 這條守的是「不要有人又把它改回一屏」——1 屏是已經被否決過的值。
  it('至少兩屏（一屏已被實機否決）', () => {
    expect(MEDIA_ONLY_PIN_VH).toBeGreaterThanOrEqual(2);
  });

  // 沒有淡出（設計師追加：pin 前後都維持 opacity 1）⇒ 整段 pin 都是定住，
  // 距離不必再扣掉淡出窗。這條同時是「別又把淡出加回來卻忘了上拉」的提醒。
  it('整段都是定住：手機版路徑不再匯出任何淡出參數', async () => {
    const mod = await import('../app/utils/subpage-stage-beats');
    expect(Object.keys(mod).filter((k) => /^MEDIA_ONLY_.*FADE/.test(k))).toEqual(
      [],
    );
  });
});
