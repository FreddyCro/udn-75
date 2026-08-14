// hero 影片的「方向手勢」判定（純函式，無 DOM／無 Vue）。
//
// 為什麼不用 scroll 事件：loop 期間 body 是鎖住的（overflow:hidden，見 Hero.vue 的
// applyScrollLock），根本不會有 scroll 事件 → 只能自己累積 wheel / touchmove 的位移。
// 累積、方向、冷卻這三件事最容易出錯，故抽成純函式單獨測試。
//
// 兩個出口：
//   to-outro  在 loop 往下累積過門檻 → 進退場段
//   to-loop   在 gone 且已在頂端往上累積過門檻 → 影片淡回並倒帶回 loop

export type HeroGestureIntent = 'none' | 'to-outro' | 'to-loop';

export interface HeroGestureKnobs {
  /** 往下進 outro 的門檻（px） */
  toOutroPx: number;
  /**
   * 往上回 loop 的門檻（px）。刻意比 toOutroPx 高：到頂後的橡皮筋回彈與細碎滑動
   * 不該把已經退場的影片叫回來。
   */
  toLoopPx: number;
  /** 發出意圖後的冷卻（ms）：避免 loop ↔ outro 抖動來回 */
  cooldownMs: number;
  /** 累積量的衰減視窗（ms）：超過此間隔沒有新輸入就歸零 */
  decayMs: number;
}

export interface HeroGestureAccum {
  /** 累積位移（正 ＝ 往下） */
  delta: number;
  /** 上次輸入的時間（ms） */
  at: number;
  /** 上次發出意圖的時間（ms）；-Infinity ＝ 還沒發過 */
  firedAt: number;
}

export interface HeroGestureInput {
  /** 這次輸入的位移（px，正 ＝ 往下） */
  delta: number;
  /** 事件時間（ms，呼叫端用 performance.now()） */
  now: number;
  /** heroState === 'loop' */
  inLoop: boolean;
  /** heroState === 'gone' */
  isGone: boolean;
  /** 已在頁面頂端（window.scrollY <= 0） */
  atTop: boolean;
}

/** 手勢門檻／冷卻的設定台：要調靈敏度只改這裡。 */
export const HERO_GESTURE: HeroGestureKnobs = {
  toOutroPx: 60,
  toLoopPx: 140,
  cooldownMs: 400,
  decayMs: 300,
};

export function createHeroGestureAccum(): HeroGestureAccum {
  return { delta: 0, at: -Infinity, firedAt: -Infinity };
}

/**
 * 餵入一次位移，回傳該次的意圖與新的累積器（不改原物件，呼叫端自行替換）。
 */
export function heroGestureStep(
  accum: HeroGestureAccum,
  input: HeroGestureInput,
  knobs: HeroGestureKnobs = HERO_GESTURE,
): { intent: HeroGestureIntent; accum: HeroGestureAccum } {
  const { delta, now, inLoop, isGone, atTop } = input;
  if (delta === 0) return { intent: 'none', accum };

  // 歸零條件：① 距上次輸入超過 decayMs（陳舊）② 方向與累積量相反（換方向立即重算）。
  // ② 是必要的：gone 期間往下瀏覽會累積一大筆正值，回滑時第一個負值必須把它清掉，
  //    否則要滑掉那筆正值才開始算 —— 使用者會覺得沒反應。
  const stale = now - accum.at > knobs.decayMs;
  const reversed =
    accum.delta !== 0 && Math.sign(delta) !== Math.sign(accum.delta);
  const base = stale || reversed ? 0 : accum.delta;
  const next: HeroGestureAccum = {
    delta: base + delta,
    at: now,
    firedAt: accum.firedAt,
  };

  // 冷卻中：照樣累積，但不發意圖
  if (now - accum.firedAt < knobs.cooldownMs) return { intent: 'none', accum: next };

  if (inLoop && next.delta >= knobs.toOutroPx) {
    return { intent: 'to-outro', accum: { delta: 0, at: now, firedAt: now } };
  }
  if (isGone && atTop && next.delta <= -knobs.toLoopPx) {
    return { intent: 'to-loop', accum: { delta: 0, at: now, firedAt: now } };
  }
  return { intent: 'none', accum: next };
}
