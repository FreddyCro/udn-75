// header 底色跟著段落走：段落用 data-header-theme 宣告，這裡只做「哪一段跨過偵測線」的判定。
//
// 兩種橘是刻意分家的（2026-09-10）—— 同樣是橘底白字，差別只在底色透不透明：
//   'orange'             不透明。只服務 03 → 04 融合拍（useMediaIntroMotion 的 media 段）。
//                        那段橘柱會收窄、header 帶兩側的背後會露白，半透明會讓整條帶子
//                        看起來被切成三塊（見 AppHeader 的 .--orange 註解，那是使用者
//                        回報過的「露餡」）。
//   'orange-translucent' 底色 70% 橘。03 永續祝福靜態那段用（Blessing.vue），與
//                        light（70% 白）／dark（50% 黑）同一個路數：半透明底 ＋ 實心白字。
// 差別只在樣式端（AppHeader 的兩條規則），本支判定完全不看值。
export type HeaderTheme = 'light' | 'dark' | 'orange' | 'orange-translucent';

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
