// 論壇二 09/15 那一撇的算式層（無 DOM、無 Vue）。
//
// 職責切法同 forum-node-path：量測留在元件裡（ForumCorePath 讀 rect、ForumEvent 渲染），
// 算得出來的東西放這裡，vitest 才能直接跑、不需要 jsdom。
//
// 這一撇的完整脈絡（為什麼是補筆、為什麼不畫在路徑上）見 architecture/forum-node-path.md。

/** 那一撇的觸發窗口：forumPath 軌的 [起, 迄]，0..1。 */
export type SlashWindow = [number, number];

/** 同一個窗口換算成**弧長**（px）的形式。核心的縮放吃這一種 ——
 *  place() 手上本來就是弧長，而「縮小要吃掉多少距離」講 px 才有意義（講 % 會隨線長飄）。 */
export type SlashArcWindow = [number, number];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// GLSL 的 smoothstep：兩端一階導數為 0，縮放的起手與落點都不會有硬轉折。
// ⚠ 與 orange-core-config 裡那支是同一個算式的第二份 —— 刻意不共用：本檔的定位是
//   「不依賴任何東西的純算式層」（vitest 直接跑），而那邊是設定台、會 import 一堆常數。
//   為了一行 GLSL 原語讓算式層反向依賴設定台不值得。
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

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
 * 核心在弧長 len 處該縮到多小（回傳倍率，1 ＝ 原尺寸 26px）。
 *
 * 為什麼要縮：那一撇的脊寬只有 9.6px（pc）／6.25（pad）／5.67（mob），而核心是 26px 的
 * 方塊 —— 不縮的話畫面上是一顆大方塊拖著一條細線，看起來不是它畫出來的。縮到脊寬之後
 * 它就是那支筆的筆尖。
 *
 * 時機是**進窗口前就縮完**：窗口起點之前預留 shrinkLen 的弧長縮小、終點之後同樣一段還原，
 * 於是那一撇的第一個 pixel 出現時核心已經是筆尖大小。若改成在窗口內縮，撇的頭一小段會是
 * 被大方塊畫出來的 —— 那正是本次要解決的觀感。
 *
 * tipScale 由呼叫端**量**脊寬算出（ForumCorePath 的 measureSlashTipScale），不寫在這裡：
 * 脊寬是排版數字，住在 ForumEvent 的 SCSS（同 orange-core-config 對 FORUM_SLASH_AT 的分工）。
 *
 * 退化與 fail-soft：
 *   lens 為 null（沒有窗口）→ 恆 1，什麼都不縮。
 *   tipScale 不在 (0, 1) 內（量不到、或量出比核心還大）→ 恆 1。**不可能讓核心塌成 0**。
 *   shrinkLen ≤ 0 → 退化成兩端硬切（合法用法：想讓它瞬間變小），不做除以零。
 */
export function slashCoreScaleAt(
  len: number,
  lens: SlashArcWindow | null,
  shrinkLen: number,
  tipScale: number,
): number {
  if (!lens) return 1;
  if (!(tipScale > 0) || tipScale >= 1) return 1;

  const [from, until] = lens;
  const ramp = shrinkLen > 0 ? shrinkLen : 0;
  // 窗口之內維持筆尖（撇正在被畫出來的整段）。
  // ⚠ 這一條必須在下面那條**之前**：ramp = 0 時兩條的邊界重合（from − 0 ＝ from），
  //   順序反過來就會在窗口的兩個端點各回一次原尺寸 —— 硬切的那一幀反而是大方塊。
  if (len >= from && len <= until) return tipScale;
  // 兩側的斜坡之外一律原尺寸。ramp = 0 時這一條同時也擋掉了下面的除以零。
  if (len <= from - ramp || len >= until + ramp) return 1;

  // k：0 ＝ 原尺寸、1 ＝ 筆尖。進場斜坡遞增，出場斜坡遞減。
  const k =
    len < from
      ? smoothstep(from - ramp, from, len)
      : 1 - smoothstep(until, until + ramp, len);
  return 1 + (tipScale - 1) * k;
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
