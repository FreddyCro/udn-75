// hero 退場「溶解」的兩條純判定（無 DOM／無 Vue）。
//
// 2026-08-16 起 hero 的退場不再是時間動畫、也不再靠捲動鎖保護，而是由一條 scrub
// ScrollTrigger 的進度 p 直接驅動。抽成純函式的理由同 hero-scroll-intent（那支已刪）：
// 這類判定壞掉時畫面上不會有任何東西喊出來，只會是「影片留一層殘影」或
// 「影片反覆 seek 抽搐」，都要試玩很久才發現。
//
// 2026-08-22 大幅簡化（見 architecture/2026-08-22-hero-restart-on-top-design.md）：
// `loop` 狀態移除、退場改由正片順播進來（不再由 scrub 觸發），於是這裡只剩三件事 ——
// 「回到頂端就重播」、「捲完就收尾」、「已交棒過就別把退場搬回來」。
//
// 完整設計見 architecture/2026-08-16-hero-scrub-dissolve-design.md（第一、三節已被
// 2026-08-21 與 2026-08-22 兩份取代）。
import type { HeroState } from '~/composables/useHeroVideo';

/** 「已經回到 page top」的門檻：p 落在此值之下才算。
 *
 *  0.005 × vh(1.6) ≈ 7px ⇒ 只有真的捲回最頂端才算，不是「往上捲一點」。
 *  ⚠️ 判定用的是**跨越**這條線的事件，不是「p 現在在線下」這個狀態（見 dissolveState 的
 *     returnedToTop）—— 差別在於「停在頂端」不該一直觸發重播。 */
export const DISSOLVE_LEAVE = 0.005;

// 2026-08-22：`DISSOLVE_ENTER`（進遲滯，原本是「p 越過就從 loop 進 outro」）已移除。
// 退場現在由影片時間軸自動接續（main.end → outro），沒有任何一條路徑靠 scrub 進 outro，
// 那條門檻與它撐起的遲滯帶都失去了對象。回捲的穩定性改由 `outroSpent`（一律維持 gone）
// 提供，不再需要兩條門檻夾出的遲滯帶。

// 2026-08-21：`dissolveAlpha` 已刪除。影片這一層改成**硬切**（p ≥ 1 就消失，
// 使用者裁決），柔和度由 B 階段引言的原地淡入承擔，不再由影片的不透明度承擔。
// 歷史上試過三種曲線都被否決：全程線性 `1 − p`（整段行程都有半透明疊影）、
// 尾段線性（仍與 core 交棒的重疊糾纏）、以及與影片進度取小的版本
// （見 architecture/2026-08-21-hero-two-phase-exit-design.md）。

/** 退場期間影片的「被按住」縮放幅度（最大加成比例）。 */
export const OUTRO_HOLD_SCALE = 0.06;

/** 捲動進度 p → 影片的縮放倍率（1 → 1 + OUTRO_HOLD_SCALE）。
 *
 *  這是退場期間**唯一**跟捲動連動的視覺。為什麼需要它：退場那段行程裡視窗整個落在
 *  hero 自己的佔位框內，畫面上除了影片沒有任何東西可以動，於是「影片被釘住」這件事
 *  沒有對比可以被感知，捲與不捲畫面一模一樣（2026-08-21 逐點實測）。
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
 *  @param flags.returnedToTop 這一次 update **跨過** DISSOLVE_LEAVE 回到頂端了沒
 *    （由呼叫端比較前後兩次的 p 算出，見 HeroVideo 的 applyDissolve）。
 *  @param flags.outroSpent 這一趟是否已經抵達過 gone（＝退場段放完、交棒給 DOM core）。
 *    由呼叫端保管，抵達 gone 時設起、跨回頂端或 restartOpening() 時清掉。
 *
 *  ⚠️ 為什麼 returnedToTop 是「事件」而不是「p < LEAVE」這個狀態：正片播完會**自動**接
 *     退場，而那一刻 p 還是 0 —— 用狀態判定的話會立刻把剛進 outro 的狀態判成重播，
 *     然後重播播完又進 outro、又被判重播…… **無限重播**。SKIP 在 page top 放的 outro 同理
 *     （那正是已移除的 `outroForced` 那面栓當初存在的理由）。
 *  ⚠️ `main` 直接原樣返回：正片期間頁面是鎖住的、p 恆為 0；重播期間同理。scrub 不插手。 */
export function dissolveState(
  p: number,
  current: HeroState,
  flags: { returnedToTop?: boolean; outroSpent?: boolean } = {},
): HeroState {
  const { returnedToTop = false, outroSpent = false } = flags;
  if (current === 'main') return 'main';
  // 回到 page top ＝ 從頭重看影片（2026-08-22 使用者裁決）。動機是設計師回報「帶 hash
  // 從子頁進站的人（落在 gone）再也看不到影片」——「回到頂端就把影片還給使用者」的
  // 機制本來就在（applyDissolve 會在同一刻清掉 openingSkipped），這裡只是把還的東西
  // 從 loop 段換成從 0s 的完整影片。
  if (returnedToTop) return 'main';
  if (p >= 1) return 'gone';
  // 已交棒過就維持 gone：往回捲**不重播退場**（使用者裁決「回捲不要看到 outro」）。
  // 影片此時停在 frame 0（進 gone 時就 seek 回去了），故舞台淡回畫面上顯示的是第一幀。
  // 這一條擺在 p >= 1 之後：再往下捲仍要收尾，否則 orange core 接不上。
  if (outroSpent) return 'gone';
  return current;
}
