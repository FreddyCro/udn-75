// hero 退場「溶解」的兩條純判定（無 DOM／無 Vue）。
//
// 2026-08-16 起 hero 的退場不再是時間動畫、也不再靠捲動鎖保護，而是由一條 scrub
// ScrollTrigger 的進度 p 直接驅動。抽成純函式的理由同 hero-scroll-intent（那支已刪）：
// 這類判定壞掉時畫面上不會有任何東西喊出來，只會是「影片留一層殘影」或
// 「影片反覆 seek 抽搐」，都要試玩很久才發現。
//
// 完整設計見 architecture/2026-08-16-hero-scrub-dissolve-design.md。
import type { HeroState } from '~/composables/useHeroVideo';

/** 進遲滯：p 越過這裡才算「開始退場」。 */
export const DISSOLVE_ENTER = 0.02;
/** 出遲滯：p 落回這裡之下才算「倒帶回 loop」。刻意低於 ENTER，中間是遲滯帶。 */
export const DISSOLVE_LEAVE = 0.005;

/** 溶解進度 p → stage 的 alpha（1 ＝ 影片全實、0 ＝ 全溶）。
 *
 *  ⚠️ 兩個端點必須**精確**是 1 與 0：0 那端不精確，影片會留一層殘影蓋在引言上；
 *     1 那端不精確，開場第一幀就會看到影片半透明。故明確夾邊，不靠內插湊。 */
export function dissolveAlpha(p: number): number {
  if (p <= 0) return 1;
  if (p >= 1) return 0;
  return 1 - p;
}

/** 溶解進度 p ＋ 目前狀態 → 下一個狀態。
 *
 *  ⚠️ `main` 直接原樣返回：正片期間頁面是鎖住的、p 恆為 0，若讓它推導就會把狀態打成
 *     `loop`，等於正片被跳掉。scrub 只負責 loop 之後的事。
 *  ⚠️ 遲滯帶（LEAVE..ENTER）內維持現狀：停在邊界上的微小抖動（觸控板慣性、橡皮筋）
 *     若每次都翻面，影片會在 loop 段與退場段之間反覆 seek。 */
export function dissolveState(p: number, current: HeroState): HeroState {
  if (current === 'main') return 'main';
  if (p >= 1) return 'gone';
  if (p > DISSOLVE_ENTER) return 'outro';
  if (p < DISSOLVE_LEAVE) return 'loop';
  return current;
}
