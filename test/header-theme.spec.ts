import { describe, expect, it } from 'vitest';
import {
  pickHeaderTheme,
  type ThemeSpan,
} from '../app/utils/header-theme';

// top / bottom 是 getBoundingClientRect() 的值：相對視窗頂端，可為負
const span = (top: number, bottom: number, theme: ThemeSpan['theme']): ThemeSpan => ({
  top,
  bottom,
  theme,
});

const HEADER_BOTTOM = 83;

describe('pickHeaderTheme', () => {
  it('偵測線落在某段落內 → 回該段落的主題', () => {
    expect(
      pickHeaderTheme([span(-200, 500, 'dark')], HEADER_BOTTOM),
    ).toBe('dark');
  });

  it('偵測線落在段落之間的空隙 → 回 fallback', () => {
    expect(
      pickHeaderTheme([span(-500, 50, 'dark'), span(200, 900, 'orange')], HEADER_BOTTOM),
    ).toBe('light');
  });

  it('兩段相鄰且交界正好等於偵測線 → 取下方那段', () => {
    expect(
      pickHeaderTheme(
        [span(-300, HEADER_BOTTOM, 'dark'), span(HEADER_BOTTOM, 800, 'orange')],
        HEADER_BOTTOM,
      ),
    ).toBe('orange');
  });

  it('多段重疊 → 取 DOM 順序在後者（疊在上層）', () => {
    expect(
      pickHeaderTheme([span(-100, 400, 'dark'), span(0, 300, 'orange')], HEADER_BOTTOM),
    ).toBe('orange');
  });

  it('沒有任何段落 → 回 fallback', () => {
    expect(pickHeaderTheme([], HEADER_BOTTOM)).toBe('light');
  });

  it('可覆寫 fallback', () => {
    expect(pickHeaderTheme([], HEADER_BOTTOM, 'dark')).toBe('dark');
  });
});
