import { describe, expect, it } from 'vitest';
import {
  LONG_SFX_KEYS,
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

  // sfx01 是 0.4s 的短音，連點時本來就該歸零重播、不該去停別人。
  it('不包含短音 sfx01', () => {
    expect(isLongSfx('sfx01')).toBe(false);
  });

  it('四支 2-3 秒的音都在組內', () => {
    expect(isLongSfx('aiFaceBg')).toBe(true);
    expect(isLongSfx('aiFaceText')).toBe(true);
    expect(isLongSfx('benedictionLine')).toBe(true);
    expect(isLongSfx('benedictionSmile')).toBe(true);
  });
});

describe('sfxStopList', () => {
  // 播長音前停掉其他長音，否則兩段 2-3 秒的音會疊在一起糊成一團。
  it('播長音時列出組內其他成員', () => {
    expect(sfxStopList('aiFaceBg').sort()).toEqual(
      ['aiFaceText', 'benedictionLine', 'benedictionSmile'].sort(),
    );
  });

  // 不含自己：停自己是多餘的，play() 本來就會把 currentTime 歸零重播。
  it('不含自己', () => {
    expect(sfxStopList('aiFaceText')).not.toContain('aiFaceText');
  });

  // 短音不受長音影響：按鈕聲要能疊在動畫音之上，不然點按鈕會把氛圍音切斷。
  it('長音不會停掉短音', () => {
    expect(sfxStopList('benedictionLine')).not.toContain('sfx01');
  });

  it('播短音時誰也不停', () => {
    expect(sfxStopList('sfx01')).toEqual([]);
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
