// 論壇段驅動線的「回中節點表」：把捲動進度換算成弧長，讓核心每走過固定的 y 距離就精準
// 回到視窗中央一次（節點之間仍照弧長等比前進，保留橫向繞路衝得快的手感）。
//
// 純數值運算，無 DOM、無 Vue import → 可直接用 vitest 測（test/forum-path-geometry.spec.ts）。
//
// 註：本檔原本還有一組 d 字串處理（normalizeD / translateD / joinSegments / appendTail /
// firstPoint / lastPoint），服務的是 pc「手貼線稿 ＋ 整段平移 ＋ 段間補連接段」那套。
// 2026-08-08 pc 前半段改用 waypoint 產生器後，三個斷點都只剩單一連續 d，那組全部無用而移除。
// 取回：git show fbaa59e:app/utils/forum-path-geometry.ts

/**
 * 「回中節點」：容器 y ↔ 驅動線弧長 的對照點。y 必須遞增，len 必須遞增不減。
 * knots[0] 是 (0, 0)、最後一個是 (捲動尺終點 y, 驅動線總長)。
 */
export type ArcKnot = { y: number; len: number };

/**
 * 建立回中節點表。
 *
 * 問題：驅動線是蛇行的，弧長比垂直跨距長（pc 1.50 倍、pad 1.41、mob 1.16）。
 * 若「捲動進度 → 弧長」直接等比，核心在橫向繞路多的地方就落後於視窗中央、在近垂直的
 * 地方又超前，而且**誤差會一路累積**：實測 pc −689/+445、pad −686/+120、mob −429px，
 * 都足以整顆滑出畫面（900 高的半屏只有 450）。
 *
 * 解法：每 spacing px 的 y 放一個節點，節點的弧長用「y 反查」求得 → 核心經過節點時
 * 精準回到視窗中央；節點之間仍照弧長等比前進，故局部的快慢感（橫向繞路時橫向衝得快）
 * 完全保留，只是誤差不再跨段累積。實測 spacing ＝ 半個視窗高時偏移收斂到 ±240 以內，
 * 而弧長速度最高只從 1.50 升到 2.51 px/px（沒有瞬移）。
 *
 * ⚠ 不要改成「把 y 硬釘在視窗中央」（spacing → 0）。線上有近水平的段（pc 在 y≈7400 有
 *   340px 弧長、dy≈0），y 一被釘住，那 340px 就得在幾 px 的捲動內走完 —— 實測橫向速度
 *   會飆到 77 px/px，看起來就是核心瞬移。節點式的重點正是「粗尺度對齊、細尺度放行」。
 *
 * sampleY 由呼叫端提供（瀏覽器裡是 getPointAtLength(len).y），故本函式仍然無 DOM 依賴、可測。
 * 取樣後的 y 取累積最大值做單調化 —— 弧線上偶有微幅回頭，會讓反查沒有唯一解。
 */
export function buildArcKnots(
  totalLen: number,
  endY: number,
  spacing: number,
  sampleY: (len: number) => number,
  samples = 512,
): ArcKnot[] {
  if (!(totalLen > 0) || !(endY > 0)) return [];

  const ys: number[] = [];
  let max = -Infinity;
  for (let i = 0; i <= samples; i++) {
    max = Math.max(max, sampleY((i / samples) * totalLen));
    ys.push(max);
  }

  // 反查：單調表上二分找 y 落在哪兩個取樣點之間，再線性內插回弧長。
  const arcAtY = (target: number) => {
    if (target <= ys[0]!) return 0;
    if (target >= ys[samples]!) return totalLen;
    let lo = 0;
    let hi = samples;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (ys[mid]! <= target) lo = mid;
      else hi = mid;
    }
    const span = ys[hi]! - ys[lo]!;
    const f = span > 0 ? (target - ys[lo]!) / span : 0;
    return ((lo + f) / samples) * totalLen;
  };

  const count = Math.max(1, Math.round(endY / Math.max(1, spacing)));
  const knots: ArcKnot[] = [];
  for (let k = 0; k <= count; k++) {
    const y = (k / count) * endY;
    // 兩端寫死 0 / totalLen：反查在端點受取樣誤差影響最大，而這兩點必須精準
    //（起點是交棒點、終點是段落底緣的錨點）。
    knots.push({ y, len: k === 0 ? 0 : k === count ? totalLen : arcAtY(y) });
  }
  // 弧長強制單調不減：取樣誤差若讓相鄰節點倒退，核心會在那裡往回跳一下。
  for (let k = 1; k <= count; k++) {
    if (knots[k]!.len < knots[k - 1]!.len) knots[k]!.len = knots[k - 1]!.len;
  }
  return knots;
}

/**
 * 把「目前落在視窗中央的容器 y」換算成驅動線上的弧長。
 *
 * ScrollTrigger 的 start / end 都錨在 center，故 rawP × tailEndY ＝ 此刻位於視窗中央的
 * 容器 y。節點表（見 buildArcKnots）之間線性內插即得弧長。
 *
 * ease 重新分配「捲動 → y」的節奏（identity 時等速）。⚠ 它會同時破壞回中保證：
 * 非 identity 的 ease 讓核心的 y 不再跟著視窗中央走，偏移會回頭放大。
 * 現行設定 FORUM_MOVE_EASE = 'none'，故實際上是 identity。
 */
export function arcAtCenterY(
  centerY: number,
  knots: ArcKnot[],
  ease: (v: number) => number = (v) => v,
): number {
  const last = knots.length - 1;
  if (last < 1) return 0;
  const endY = knots[last]!.y;
  if (endY <= 0) return 0;

  const y = ease(Math.min(1, Math.max(0, centerY / endY))) * endY;
  // 節點數是「跨距 ÷ 半個視窗高」≈ 20 個，故線性掃描就夠（每幀 20 次比較）。
  // 刻意不用「等距 → 直接算索引」：那會偷偷要求節點等距，未來想把節點改掛在 waypoint 上就會壞。
  let i = 0;
  while (i < last - 1 && knots[i + 1]!.y <= y) i++;
  const a = knots[i]!;
  const b = knots[i + 1]!;
  const span = b.y - a.y;
  const f = span > 0 ? Math.min(1, Math.max(0, (y - a.y) / span)) : 0;
  return a.len + f * (b.len - a.len);
}
