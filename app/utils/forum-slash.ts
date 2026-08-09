// 論壇二 09/15 那一撇的算式層（無 DOM、無 Vue）。
//
// 職責切法同 forum-node-path：量測留在元件裡（ForumCorePath 讀 rect、ForumEvent 渲染），
// 算得出來的東西放這裡，vitest 才能直接跑、不需要 jsdom。
//
// 這一撇的完整脈絡（為什麼是補筆、為什麼不畫在路徑上）見 architecture/forum-node-path.md。

/** 那一撇的觸發窗口：forumPath 軌的 [起, 迄]，0..1。 */
export type SlashWindow = [number, number];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * 那一撇畫出多少（0..1）：0 完全沒出現、1 整條畫完。
 *
 * window 為 null ＝ 尚未建線，或該斷點沒有驅動線 → 一律 0（撇不出現）。
 * 這與 forumPathActive 的語意一致：沒有線可跑時什麼都不畫，而不是停在殘值上。
 *
 * 窗口長度為 0 時退化成硬切（越過起點就是 1），不做除以零 ——
 * 手動覆寫填成同一個數字（例如想讓它瞬間出現）是合法用法，不該吐 NaN。
 */
export function slashDrawAt(progress: number, window: SlashWindow | null): number {
  if (!window) return 0;
  const [from, until] = window;
  const span = until - from;
  if (span <= 0) return progress >= from ? 1 : 0;
  return clamp01((progress - from) / span);
}

/**
 * 在弧長 0..totalLen 上找出離 target 最近的弧長。
 *
 * sample(len) 由呼叫端注入（實務上是 SVGPathElement.getPointAtLength），故本函式不碰 DOM。
 * 兩輪均勻取樣：第一輪 samples 點掃全長，第二輪在最佳點 ±step 內再取 64 點。
 * 不用三分法 —— 距離函式沿路徑不保證單峰（蛇行的線會有多個局部極小），
 * 粗掃選出全域最佳再局部細化才不會收斂到錯的凹處。
 *
 * samples 預設 512 ＝ 與 ForumCorePath 的 syncKnots 同密度（pc 每 ~20px 一點）；
 * 只在 build() 幾何重建時跑一次，不在逐幀熱路徑上。
 */
export function nearestArcLength(
  target: { x: number; y: number },
  sample: (len: number) => { x: number; y: number },
  totalLen: number,
  samples = 512,
): number {
  if (totalLen <= 0) return 0;

  const d2 = (len: number) => {
    const p = sample(len);
    const dx = p.x - target.x;
    const dy = p.y - target.y;
    return dx * dx + dy * dy;
  };

  const step = totalLen / samples;
  let best = 0;
  let bestD = d2(0);
  for (let i = 1; i <= samples; i++) {
    const len = i * step;
    const cur = d2(len);
    if (cur < bestD) {
      bestD = cur;
      best = len;
    }
  }

  // 第二輪：粗掃的解析度是 step，在 best ± step 內再取 64 點把誤差收到 step/32。
  const lo = Math.max(0, best - step);
  const hi = Math.min(totalLen, best + step);
  const step2 = (hi - lo) / 64;
  for (let i = 0; i <= 64; i++) {
    const len = lo + i * step2;
    const cur = d2(len);
    if (cur < bestD) {
      bestD = cur;
      best = len;
    }
  }

  return best;
}
