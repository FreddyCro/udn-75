import { describe, expect, it } from 'vitest';
import { collectText } from '../scripts/lib/collect-glyphs.mjs';

// subset 的字集 ＝ 原始碼裡出現過的每個字元 ＋ ASCII 可列印字元。
// 少一個字就是那個字掉到系統字型（看得出來但不會報錯），所以字集要可測、可重現。
describe('collectText', () => {
  it('去重、含全形標點、永遠包含 ASCII 可列印字元', () => {
    const text = collectText(['聯合報 75，智慧未來。', '聯合 UDN']);
    expect(text).toContain('聯');
    expect(text).toContain('，');
    expect(text).toContain('。');
    expect(text).toContain('A');
    expect(text).toContain('~');
    expect(text.split('').filter((c) => c === '聯')).toHaveLength(1);
  });
  it('不含換行、tab 與零寬字元', () => {
    const text = collectText(['a\nb\tc\u200Bd']);
    expect(text).not.toMatch(/[\n\t\u200B]/);
  });
});