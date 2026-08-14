import { describe, expect, it } from 'vitest';
import {
  BEAT_LAST_OUT,
  blockState,
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
    expect(vh(l.mediaOut, 3)).toBeCloseTo(285);
  });

  it('媒體淡出後仍留一段才 unpin —— 不留空白捲動段，也不會邊淡出邊被捲走', () => {
    const l = stageLines(3);
    const tail = vh(1, 3) - vh(l.mediaOut, 3);
    expect(tail).toBeGreaterThan(0); // 淡出發生在 pin 之內
    expect(tail).toBeLessThan(50); // 尾段不長，淡完就接內文
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
    expect(l.mediaOut).toBeGreaterThan(1);
    // 引言的退場線也一樣過不了，引言會留到 unpin（與加入媒體前的行為相同）
    expect(l.introOut).toBeGreaterThan(1);
  });

  it('進線一律在退場線之前，兩者不會打結', () => {
    const l = stageLines(3);
    expect(l.heroOut).toBeLessThan(l.introIn);
    expect(l.introIn).toBeLessThan(l.introOut);
    expect(l.introOut).toBeLessThan(l.mediaIn);
    expect(l.mediaIn).toBeLessThan(l.mediaOut);
  });
});

describe('blockState', () => {
  const { mediaIn, mediaOut } = stageLines(3);

  it('三態依序照 progress 推進', () => {
    expect(blockState(0, mediaIn, mediaOut)).toBe('before');
    expect(blockState(0.49, mediaIn, mediaOut)).toBe('before');
    expect(blockState(0.7, mediaIn, mediaOut)).toBe('shown');
    expect(blockState(1, mediaIn, mediaOut)).toBe('after');
  });

  it('邊界：進線含（該進場了）、退場線含（該送走了）', () => {
    expect(blockState(mediaIn, mediaIn, mediaOut)).toBe('shown');
    expect(blockState(mediaOut, mediaIn, mediaOut)).toBe('after');
  });

  it('回捲會原路退回 before，不會卡在 after', () => {
    expect(blockState(mediaOut, mediaIn, mediaOut)).toBe('after');
    expect(blockState(mediaIn - 0.01, mediaIn, mediaOut)).toBe('before');
  });

  it('退場線在 1 之後（無媒體的引言）永遠進不了 after', () => {
    const { introIn, introOut } = stageLines(1);
    expect(blockState(1, introIn, introOut)).toBe('shown');
  });

  it('最後一塊的退場線就是那一拍的 BEAT_LAST_OUT', () => {
    const { mediaOut } = stageLines(3);
    expect(mediaOut * 3 - 2).toBeCloseTo(BEAT_LAST_OUT);
  });
});
