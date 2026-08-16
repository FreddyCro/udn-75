/**
 * 子頁舞台（Subpage 的 hero／引言／媒體疊同屏）的節奏算式。
 *
 * 舞台一「拍」＝捲過一屏，pin 距離＝拍數 × 一屏。各塊在拍與拍的交界原地交接：
 * 過 BEAT_OUT 送走前一塊、過 BEAT_IN 迎進下一塊（兩條線間隔小，快速捲過≈交叉淡化）。
 *
 * 門檻一律除以拍數，所以「第幾拍的第幾條線」換算成絕對捲動距離時與拍數無關 ——
 * 加減一拍不會挪動既有各塊的時間點（見 subpage-stage-beats.spec.ts 的不變式）。
 */

/** 拍內送走前一塊的線 */
export const BEAT_OUT = 0.35;
/** 拍內迎進下一塊的線 */
export const BEAT_IN = 0.5;
/**
 * 最後一塊**開始退場**的線。它沒有下一塊要迎進，所以不走 BEAT_OUT 的交接節奏。
 *
 * ⚠ 與前面兩塊不同，最後一塊的退場是 **scrub（綁 progress）而不是 0.4s 的時間動畫**，
 *   從這條線一路淡到 pin 結束。理由見 mediaFadeAlpha。
 *
 * 這條線到 1 之間就是**淡出的捲動距離**（3 拍時 ＝ 25vh，1440×900 下 225px）。
 * 太短會變成瞬間消失、也失去 scrub 的意義；太長則照片賴著不走。
 */
export const BEAT_LAST_FADE_FROM = 0.75;

/** 藏起來時的 y 位移：還沒進場的藏在下方（回捲原路退回），演完的往上送走（與 hero 退場同向） */
export const HIDE_Y = { before: 200, after: -120 } as const;

/** before＝還沒進場、shown＝正在演、after＝演完（最後一塊之前的塊會被下一塊接手） */
export type StageBlockState = 'before' | 'shown' | 'after';

/** 有媒體＝三拍（hero → 引言 → 媒體）；沒有＝hero／引言收在一拍內 */
export function stageBeats(hasMedia: boolean): number {
  return hasMedia ? 3 : 1;
}

/** 各塊的進出線，值域為整段 pin 的 progress（0..1） */
export interface StageLines {
  heroOut: number;
  introIn: number;
  introOut: number;
  mediaIn: number;
  /** 媒體**開始**淡出的線（不是淡完的線）—— 之後一路 scrub 到 progress 1 */
  mediaFadeFrom: number;
}

/**
 * 拍號寫死是刻意的：沒有媒體時 beats=1，媒體（甚至引言的退場）那幾條線會落在 1 之後，
 * 永遠過不了，對應的狀態機自然整段不啟用。
 */
export function stageLines(beats: number): StageLines {
  /** 第 beat 拍（0-based）的第 offset 條線 */
  const line = (beat: number, offset: number) => (beat + offset) / beats;
  return {
    heroOut: line(0, BEAT_OUT),
    introIn: line(0, BEAT_IN),
    introOut: line(1, BEAT_OUT),
    mediaIn: line(1, BEAT_IN),
    mediaFadeFrom: line(2, BEAT_LAST_FADE_FROM),
  };
}

/**
 * 媒體退場的透明度：**綁 progress，不綁時間**。
 *
 * ⚠ 為什麼最後一塊不能沿用 0.4s 的時間動畫：內文用 `--under-stage` 上拉一屏墊在舞台
 *   後面，是**跟著捲動 1:1 走**的。用時間動畫的話，觸發之後那 0.4 秒使用者還在捲，
 *   照片消失時內文已經滑掉「捲動速度 × 0.4s」—— 實測 1440×900：400px/s 滑掉 53px、
 *   800px/s 滑掉 221px、1600px/s 滑掉 573px、甩一下（3000px/s）第一屏整個過去。
 *   綁 progress 之後重疊量恆為 0，照片歸零的位置與捲動速度無關。
 *
 * fadeTo 預設 1 ＝ 淡完正好是 unpin。fadeTo ≤ fadeFrom（理論上不會發生）時退化成
 * 硬切，不吐 NaN／Infinity —— 那會讓 opacity 變成無效值而靜默不套用。
 */
export function mediaFadeAlpha(progress: number, fadeFrom: number, fadeTo = 1): number {
  if (progress <= fadeFrom) return 1;
  if (progress >= fadeTo) return 0;
  if (!(fadeTo > fadeFrom)) return 0;
  return 1 - (progress - fadeFrom) / (fadeTo - fadeFrom);
}

/** 引言與媒體共用：由 progress 決定該塊此刻該是哪一態（進線含、出線含） */
export function blockState(progress: number, inLine: number, outLine: number): StageBlockState {
  if (progress < inLine) return 'before';
  return progress >= outLine ? 'after' : 'shown';
}

/**
 * 「等淡出播完才停播」的延後副作用，執行當下還算不算數。
 *
 * ⚠ 淡出 tween 的 onComplete 不等於「這塊現在確實不用演了」：回捲若落在淡出的最後一格
 *   frame，gsap 的 `overwrite: 'auto'` 要等新 tween 首次 render 才砍掉舊 tween，舊的淡出
 *   會先播完並觸發 onComplete，把剛被 show 打開的播放狀態又關掉 —— 照片看得見卻停在
 *   第一張，而且此時狀態已是 'shown'、同一拍內不會再換態，那條分支不會再進，
 *   **不會自己恢復**，得捲出那一拍再捲回來。（見 test/subpage-media-active.spec.ts）
 *
 * 所以延後的停播要在執行當下重新確認該塊是不是真的還沒在演，不能只靠「onComplete
 * 沒被觸發」來代表它已被接手。
 */
export function deferredStopStillApplies(stateNow: StageBlockState): boolean {
  return stateNow !== 'shown';
}
