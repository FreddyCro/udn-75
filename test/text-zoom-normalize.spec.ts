import { describe, expect, it } from 'vitest';
import { normalizeValue } from '../build/text-zoom-normalize';

// in-app（Android WebView）把系統字體大小當 text zoom 套用：只放大字、版面 px 不動。
// 唯一有效的解法是把 specified 字級除掉量測到的倍率 --tz，讓 WebView 再乘回來
// （2026-08-27 Pixel 9a ╱ LINE 實機驗證；em / ch / text-size-adjust 全部無效）。
// 這支測試守住改寫規則的邊界 —— 改寫錯了會是「全站字級歪掉」等級的事故。
describe('normalizeValue：font-size 除以 --tz', () => {
  it('絕對長度包成除法', () => {
    expect(normalizeValue('font-size', '15px')).toBe(
      'calc((15px) / var(--tz, 1))',
    );
  });

  it('var() 與 calc() 這類複合值也包（外層括號保證巢套安全）', () => {
    expect(normalizeValue('font-size', 'var(--text-body)')).toBe(
      'calc((var(--text-body)) / var(--tz, 1))',
    );
    expect(normalizeValue('font-size', 'calc(20 / 375 * 100vw)')).toBe(
      'calc((calc(20 / 375 * 100vw)) / var(--tz, 1))',
    );
    expect(normalizeValue('font-size', 'clamp(22px, 3vw, 32px)')).toBe(
      'calc((clamp(22px, 3vw, 32px)) / var(--tz, 1))',
    );
  });

  it('相對字級不動 —— 繼承鏈上的父層已經除過，再除一次會變 s²', () => {
    for (const v of ['1.2em', '120%', '1.5rem', '2ex', '3ch']) {
      expect(normalizeValue('font-size', v)).toBe(v);
    }
  });

  it('關鍵字字級不動', () => {
    for (const v of ['inherit', 'larger', 'xx-small', 'INHERIT']) {
      expect(normalizeValue('font-size', v)).toBe(v);
    }
  });

  it('已經帶補償的值不重複包（PostCSS 8 會 re-visit 改過的節點）', () => {
    const done = 'calc((15px) / var(--tz, 1))';
    expect(normalizeValue('font-size', done)).toBe(done);
  });

  it('@font-face 內不動', () => {
    expect(
      normalizeValue('font-size', '15px', { inFontFace: true }),
    ).toBe('15px');
  });
});

describe('normalizeValue：em 長度乘回 --tz', () => {
  it('字級被除小之後，em 長度要乘回來才維持設計值', () => {
    expect(normalizeValue('letter-spacing', '0.1em')).toBe(
      'calc(0.1em * var(--tz, 1))',
    );
    expect(normalizeValue('max-width', '12em')).toBe(
      'calc(12em * var(--tz, 1))',
    );
  });

  it('shorthand 裡逐個換，其他單位不碰', () => {
    expect(normalizeValue('margin', '1em 2px 0.5em 0')).toBe(
      'calc(1em * var(--tz, 1)) 2px calc(0.5em * var(--tz, 1)) 0',
    );
  });

  it('rem 不動（rem 讀 root 的 specified 字級，而 root 沒有被改寫）', () => {
    expect(normalizeValue('margin-top', '1.5rem')).toBe('1.5rem');
  });

  it('0em 不動（乘了也是 0，只是雜訊）', () => {
    expect(normalizeValue('letter-spacing', '0em')).toBe('0em');
  });

  it('自訂屬性宣告不動 —— 存的可能不是長度，補償要落在消費它的那條', () => {
    expect(normalizeValue('--maxWidth', '12em')).toBe('12em');
    expect(normalizeValue('--maxWidth', '1fr')).toBe('1fr');
  });

  it('非長度的屬性不碰', () => {
    expect(normalizeValue('font-family', 'Emphasis, sans-serif')).toBe(
      'Emphasis, sans-serif',
    );
    expect(normalizeValue('content', '"1em"')).toBe('"1em"');
    expect(normalizeValue('background', 'url(a-1em.png)')).toBe(
      'url(a-1em.png)',
    );
  });
});
