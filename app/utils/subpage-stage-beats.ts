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
 * 最後一塊的退場線。它沒有下一塊要迎進，所以不走 BEAT_OUT 的交接節奏，
 * 而是貼在自己那一拍的尾巴：淡出播完後只剩一小段就 unpin，
 * 接著由 subpage__content 從視窗下緣接上。
 */
export const BEAT_LAST_OUT = 0.85;

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
  mediaOut: number;
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
    mediaOut: line(2, BEAT_LAST_OUT),
  };
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
