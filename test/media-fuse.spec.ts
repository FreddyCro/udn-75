import { describe, expect, it } from 'vitest';
import {
  BLESSING_OUT_VH,
  FUSE_EASE,
  MEDIA_BLOCK_VW,
  mediaHeaderLightAt,
  narrowDurationFor,
} from '../app/utils/orange-core-config';

// 這支守的是「拍 0 的捲動長度 ＝ ScrollTrigger 提早的跑道長度」這條推導關係。
// 對不上的症狀是空窗期換個寬度重演：收窄在跑道跑完前就結束，留下一段靜止的
// MEDIA_BLOCK_VW 寬橘柱（或反過來，收窄還沒完接縫就已經到頂）。
describe('narrowDurationFor', () => {
  // total ＝ restDuration + narrow（timeline 單位）對映到 holdBuffer + runway（px），
  // 故拍 0 佔掉的 px ＝ narrow / total × (holdBuffer + runway)，它必須等於 runway。
  const beat0Px = (rest: number, runway: number, buffer: number) => {
    const narrow = narrowDurationFor(rest, runway, buffer);
    return (narrow / (rest + narrow)) * (buffer + runway);
  };

  it('pc（rest 5.1、buffer 2000、跑道 600px）', () => {
    expect(beat0Px(5.1, 600, 2000)).toBeCloseTo(600, 6);
  });

  it('mob（rest 4.8，且視窗較矮 → 跑道較短）', () => {
    expect(beat0Px(4.8, 400, 2000)).toBeCloseTo(400, 6);
  });

  it('跑道越長，拍 0 越長（單調）', () => {
    expect(narrowDurationFor(5.1, 900, 2000)).toBeGreaterThan(
      narrowDurationFor(5.1, 600, 2000),
    );
  });

  it('恆為正數', () => {
    expect(narrowDurationFor(5.1, 600, 2000)).toBeGreaterThan(0);
  });
});

describe('交棒常數', () => {
  // 交棒寬度只能有一份：veil 與 morph 的終點都讀它。各寫一份就會在調值時脫鉤，
  // 症狀是交棒那一幀寬度跳一下。
  it('MEDIA_BLOCK_VW 是合法的視窗寬比例', () => {
    expect(MEDIA_BLOCK_VW).toBeGreaterThan(0);
    expect(MEDIA_BLOCK_VW).toBeLessThan(1);
  });

  // 頭快尾慢：頭快才有「第一幀就在動」，尾慢才接得上拍 1 的 power3.inOut。
  // 'none' / 'power2.in' 會讓收窄在拍 1 交界處還是全速，兩拍之間看得到轉折。
  it('FUSE_EASE 是 ease-out 家族', () => {
    expect(FUSE_EASE).toMatch(/\.out$/);
  });

  // 融合拍的長度旋鈕就是 BLESSING_OUT_VH（跑道 ＝ 它 × 視窗高）。
  it('BLESSING_OUT_VH 仍在一個視窗高以內', () => {
    expect(BLESSING_OUT_VH).toBeGreaterThan(0);
    expect(BLESSING_OUT_VH).toBeLessThanOrEqual(1);
  });
});

// header 翻 light 的門檻。它是**推導的**（timeline 的地標 ÷ 總長），不是寫死的比例，
// 所以加減拍數不必重算。這支守的是「地標對了、方向對了」。
describe('mediaHeaderLightAt', () => {
  const beat1End = 1.53 + 1; // NARROW_DUR + BEAT1_DUR 的一組代表值
  const duration = 1.53 + 5.1;

  it('拍 1 結束之前是 orange', () => {
    expect(mediaHeaderLightAt(0, beat1End, duration)).toBe(false);
    // 拍 0 結束的那一刻：橘柱還有 MEDIA_BLOCK_VW 寬，這裡若翻白，白帶中央會透出橘
    expect(mediaHeaderLightAt(1.53 / duration, beat1End, duration)).toBe(false);
  });

  it('拍 1 結束（橘柱收成細條）起翻 light', () => {
    expect(mediaHeaderLightAt(beat1End / duration, beat1End, duration)).toBe(true);
    expect(mediaHeaderLightAt(1, beat1End, duration)).toBe(true);
  });

  // timeline 還沒建好時 duration 是 0 —— 不可以除以它，也不該提前宣告 light
  // （那一刻畫面上是滿版橘）。
  it('duration 為 0 時退回 orange', () => {
    expect(mediaHeaderLightAt(0.5, beat1End, 0)).toBe(false);
  });
});
