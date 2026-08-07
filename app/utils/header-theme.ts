// header 底色跟著段落走：段落用 data-header-theme 宣告，這裡只做「哪一段跨過偵測線」的判定。
export type HeaderTheme = 'light' | 'dark' | 'orange';

export interface ThemeSpan {
  /** getBoundingClientRect().top，相對視窗頂端 */
  top: number;
  /** getBoundingClientRect().bottom */
  bottom: number;
  theme: HeaderTheme;
}

/**
 * 挑出跨過 header 底緣那一段的主題。
 * bottom 用開區間（bottom > headerBottom）：兩段相鄰時交界歸下面那段，避免交界瞬間閃回 fallback。
 * 重疊時取最後一個命中者 —— spans 依 DOM 順序傳入，在後者視為疊在上層。
 */
export function pickHeaderTheme(
  spans: ThemeSpan[],
  headerBottom: number,
  fallback: HeaderTheme = 'light',
): HeaderTheme {
  let hit: HeaderTheme | null = null;

  for (const s of spans) {
    if (s.top <= headerBottom && s.bottom > headerBottom) hit = s.theme;
  }

  return hit ?? fallback;
}
