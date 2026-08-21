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

// 2026-08-21：`dissolveAlpha` 已刪除。影片這一層改成**硬切**（p ≥ 1 就消失，
// 使用者裁決），柔和度由 B 階段引言的原地淡入承擔，不再由影片的不透明度承擔。
// 歷史上試過三種曲線都被否決：全程線性 `1 − p`（整段行程都有半透明疊影）、
// 尾段線性（仍與 core 交棒的重疊糾纏）、以及與影片進度取小的版本
// （見 architecture/2026-08-21-hero-two-phase-exit-design.md）。

/** 退場期間影片的「被按住」縮放幅度（最大加成比例）。 */
export const OUTRO_HOLD_SCALE = 0.06;

/** 捲動進度 p → 影片的縮放倍率（1 → 1 + OUTRO_HOLD_SCALE）。
 *
 *  這是退場期間**唯一**跟捲動連動的視覺。為什麼需要它：退場那 1280px 的行程裡，
 *  視窗整個落在 hero 自己的佔位框內 —— 引言上緣還在 2045，要到 scrollY > 1145 才進
 *  視窗。也就是畫面上除了影片沒有任何東西可以動，於是「影片被釘住」這件事沒有對比
 *  可以被感知，捲與不捲畫面一模一樣（2026-08-21 逐點實測）。
 *
 *  ⚠️ 為什麼是縮放而不是位移：位移由 JS 逐幀寫入時會慢一幀，而慢一幀的**位移**讀起來
 *     是反向運動（那正是 pin 版本的抖動來源，實測位移量等於當幀捲動距離、真實滾輪
 *     一格 100–140px）。縮放慢一幀只是 0.5% 的尺寸差，不構成同向運動，故安全。
 *  ⚠️ 縮放不會露出邊緣（放大只會裁掉更多），這是它比視差位移安全的第二個理由 ——
 *     位移必須先放大留出餘裕，那會改變設計核准過的裁切構圖。 */
export function outroHoldScale(p: number): number {
  const clamped = p <= 0 ? 0 : p >= 1 ? 1 : p;
  return 1 + OUTRO_HOLD_SCALE * clamped;
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
