import { describe, expect, it } from 'vitest';
import {
  LONG_SFX_KEYS,
  MEDIA_BEAT_SFX,
  isLongSfx,
  risingEdge,
  sfxStopList,
} from '../app/utils/sfx-cue';
import { SOUND_KEYS } from '../app/utils/sound-manifest';

describe('LONG_SFX_KEYS', () => {
  // 互斥組是手寫的名單，manifest 改名時它不會自動跟著改 —— 擋在測試。
  it('每個成員都是合法的 SoundKey', () => {
    const unknown = LONG_SFX_KEYS.filter((key) => !SOUND_KEYS.includes(key));

    expect(unknown).toEqual([]);
  });

  // sfx01Short（0.27s）是全站的互動音：按鈕聲要能疊在動畫音之上，
  // 連點時歸零重播、不該去停別人。它是組內唯一被刻意排除的一支。
  it('不包含互動短音 sfx01Short', () => {
    expect(isLongSfx('sfx01Short')).toBe(false);
  });

  it('五支 2-3 秒的音都在組內', () => {
    expect(isLongSfx('sfx01')).toBe(true);
    expect(isLongSfx('aiFaceBg')).toBe(true);
    expect(isLongSfx('aiFaceText')).toBe(true);
    expect(isLongSfx('benedictionLine')).toBe(true);
    expect(isLongSfx('benedictionSmile')).toBe(true);
  });
});

describe('MEDIA_BEAT_SFX', () => {
  // 表的長度＝ useMediaIntroMotion 交給 crossedForward 的 marks 數量。
  // 兩邊對不上時多出來的拍會靜靜地不出聲（play 端遇到 undefined 直接跳過），
  // 畫面上不會有任何東西壞掉喊出來 —— 故擋在測試。
  it('四拍：直條站定、text 展開、quotes 展開、「新」展開', () => {
    expect(MEDIA_BEAT_SFX).toHaveLength(4);
  });

  // 打錯字或音效檔被移出 manifest 時編譯期就該報錯，但 as const 之外還有
  // 「改了 manifest 卻忘了改這裡」的路徑 —— 同 LONG_SFX_KEYS 的理由。
  it('非 null 的成員都是合法的 SoundKey', () => {
    const unknown = MEDIA_BEAT_SFX.filter(
      (key) => key !== null && !SOUND_KEYS.includes(key),
    );

    expect(unknown).toEqual([]);
  });

  // 拍 1 結束那根 28px 橘色長條 —— 與 hero 轉場的黑色長條共用同一支（設計師指定）。
  it('第一拍是 sfx01', () => {
    expect(MEDIA_BEAT_SFX[0]).toBe('sfx01');
  });

  // 設計師 2026-08-26 指定了這兩個時機但沒附檔案，觸發點先接好、鑰匙留空。
  it('text／quotes 兩拍仍在等音檔', () => {
    expect(MEDIA_BEAT_SFX[1]).toBeNull();
    expect(MEDIA_BEAT_SFX[2]).toBeNull();
  });

  // 「新」淡入 —— 設計師 2026-08-31 指定 udn75_sfx01_01.mp3，與拍 ⓪ 同一支。
  it('第四拍（「新」展開）是 sfx01', () => {
    expect(MEDIA_BEAT_SFX[3]).toBe('sfx01');
  });
});

describe('sfxStopList', () => {
  // 播長音前停掉其他長音，否則兩段 2-3 秒的音會疊在一起糊成一團。
  it('播長音時列出組內其他成員', () => {
    expect(sfxStopList('aiFaceBg').sort()).toEqual(
      ['sfx01', 'aiFaceText', 'benedictionLine', 'benedictionSmile'].sort(),
    );
  });

  // 不含自己：停自己是多餘的，play() 本來就會把 currentTime 歸零重播。
  it('不含自己', () => {
    expect(sfxStopList('aiFaceText')).not.toContain('aiFaceText');
  });

  // 短音不受長音影響：按鈕聲要能疊在動畫音之上，不然點按鈕會把氛圍音切斷。
  it('長音不會停掉互動短音', () => {
    expect(sfxStopList('benedictionLine')).not.toContain('sfx01Short');
  });

  it('播互動短音時誰也不停', () => {
    expect(sfxStopList('sfx01Short')).toEqual([]);
  });

  // sfx01 2026-08-28 入組：它是 2.11s，而它的兩個掛點（hero 轉場的黑色長條、
  // media 拍 1 結束的橘色長條）都緊接在一支 2-3 秒的動畫音之後。
  it('sfx01 入組後會停掉其他四支', () => {
    expect(sfxStopList('sfx01').sort()).toEqual(
      ['aiFaceBg', 'aiFaceText', 'benedictionLine', 'benedictionSmile'].sort(),
    );
  });
});

describe('risingEdge', () => {
  // 「前進觸發、倒退靜音」—— 沿用 ForumCorePath 的既有規則（見 sfx-cue.ts 檔頭）。
  it('false → true 觸發', () => {
    expect(risingEdge(false, true)).toBe(true);
  });

  it('true → false 不觸發（＝往回捲靜音）', () => {
    expect(risingEdge(true, false)).toBe(false);
  });

  it('沒變化就不觸發', () => {
    expect(risingEdge(false, false)).toBe(false);
    expect(risingEdge(true, true)).toBe(false);
  });
});
