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
 *  @param outroSpent 這一趟下滑是否已經抵達過 gone（＝退場段已經放完、交棒給 DOM core）。
 *    由呼叫端保管，抵達 gone 時設起、p 落回 LEAVE 之下（回到頂端）時清掉。
 *
 *  @param outroForced 這個 outro 是 SKIP 手動放的（見 useHeroVideo 的 skip）。
 *    由呼叫端保管，`p` 越過 ENTER（使用者真的開始捲了）時清掉。
 *
 *  ⚠️ `main` 直接原樣返回：正片期間頁面是鎖住的、p 恆為 0，若讓它推導就會把狀態打成
 *     `loop`，等於正片被跳掉。scrub 只負責 loop 之後的事。
 *  ⚠️ 遲滯帶（LEAVE..ENTER）內維持現狀：停在邊界上的微小抖動（觸控板慣性、橡皮筋）
 *     若每次都翻面，影片會在 loop 段與退場段之間反覆 seek。 */
export function dissolveState(
  p: number,
  current: HeroState,
  outroSpent = false,
  outroForced = false,
): HeroState {
  if (current === 'main') return 'main';
  if (p >= 1) return 'gone';
  // 已交棒過就不再回到 outro —— 退場段播完是**停在最後一格**，而那一格的構圖就是
  // gone（橘方塊在正中央，見 HERO_OUTRO_CORE_ANCHOR）。往回捲時若把狀態送回 outro，
  // 淡回畫面上的是那一格凍住的畫面，使用者看到的仍是 gone、影片回不到 loop
  // （2026-08-16 實測：捲回 y=360 時 state 是 outro、影片停在 38.57s）。
  // 這一條擺在 gone 之後：再往下捲仍要收尾，否則 orange core 接不上。
  if (outroSpent) return 'loop';
  if (p > DISSOLVE_ENTER) return 'outro';
  // SKIP 放的 outro 只擋下面那一條「還在頂端所以回 loop」—— 它發生在 p ＝ 0 的當下，
  // 沒有這面栓的話使用者捲一點點就會被送回 loop、影片 seek 回 30s，再捲多一點又跳
  // 回 outro seek 36s。上面兩條（抵達 1 收尾、越過 ENTER 進 outro）都在栓之前，
  // 故栓不會把任何一條正常路徑關掉。
  if (outroForced) return current;
  if (p < DISSOLVE_LEAVE) return 'loop';
  return current;
}
