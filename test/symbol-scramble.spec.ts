import { describe, expect, it } from 'vitest';
import { SCRAMBLE_CHARS, scrambleText } from '../app/utils/symbol-scramble';

// 取自 app/locales/section1.json：intro 第一行（無換行）與 phrases 第一則（有換行）
const LINE = '人工智慧的預測五花八門';
const MULTI = 'AI真假難辨\n眼見還一定為憑嗎\n？';

// 這支守的是「亂碼的形狀」，不是隨機值本身 —— 函式有隨機性，故只斷言
// 長度、已落定的前綴、與未落定處的字元來源這三件確定的事。
describe('scrambleText', () => {
  it('reveal = 1 時等於原字串', () => {
    expect(scrambleText(LINE, 1)).toBe(LINE);
    expect(scrambleText(MULTI, 1)).toBe(MULTI);
  });

  it('長度恆等於 target（含超界輸入）', () => {
    for (const r of [-1, 0, 0.37, 1, 2]) {
      expect(scrambleText(MULTI, r)).toHaveLength(MULTI.length);
    }
  });

  it('前 reveal 比例的字元一定已落定', () => {
    for (const r of [0.25, 0.5, 0.75]) {
      const n = Math.floor(r * LINE.length);
      expect(scrambleText(LINE, r).slice(0, n)).toBe(LINE.slice(0, n));
    }
  });

  it('reveal = 0 時換行與空白原樣保留、其餘皆取自字元集', () => {
    const out = scrambleText(MULTI, 0);
    for (let i = 0; i < MULTI.length; i++) {
      const ch = MULTI[i]!;
      if (ch === '\n' || ch === ' ') expect(out[i]).toBe(ch);
      else expect(SCRAMBLE_CHARS).toContain(out[i]!);
    }
  });

  it('reveal 為負數時等同 0（不會落定任何字、也不會爆長度）', () => {
    const out = scrambleText(LINE, -1);
    expect(out).toHaveLength(LINE.length);
    for (const ch of out) expect(SCRAMBLE_CHARS).toContain(ch);
  });

  it('空字串回傳空字串', () => {
    expect(scrambleText('', 0.5)).toBe('');
  });
});
