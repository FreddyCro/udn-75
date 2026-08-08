// 論壇段驅動線的幾何處理：把 FORUM_PATH 的中心線片段平移到 .forum-path 的座標系，
// 再串成單一連續 path 供 getPointAtLength 取樣。
//
// 純字串／數值運算，無 DOM、無 Vue import → 可直接用 vitest 測（test/forum-path-geometry.spec.ts）。
//
// 下游一律假設「座標 x,y 交替」，所以入口必須先過 normalizeD 把 V / H 展開成 L ——
// 那兩個指令只帶單一座標，會讓奇偶判斷整條錯位，而且**不會報錯**。
// Figma 匯出的 stroke path 很常見 V（例：temp/vector276-asset.svg 的 'M383.554 2V209.5C…'）。

const NUM = /-?\d*\.?\d+/g;
// 只切這五個指令：實際線稿用不到 S / Q / T / A（弧線）。真的遇到的話，
// 它們會被歸進前一個指令的 body 而算錯 —— 換線稿時先掃一遍指令字母。
const CMD = /([MLCVH])([^MLCVH]*)/g;

/** 把 V / H 展開成等效的 L（補上另一軸的目前座標），讓下游只需處理 M / L / C。 */
export function normalizeD(d: string): string {
  let x = 0;
  let y = 0;
  return d.replace(CMD, (_, cmd: string, body: string) => {
    const n = (body.match(NUM) ?? []).map(Number);
    if (cmd === 'V') {
      return n
        .map((v) => {
          y = v;
          return `L${x} ${y}`;
        })
        .join('');
    }
    if (cmd === 'H') {
      return n
        .map((v) => {
          x = v;
          return `L${x} ${y}`;
        })
        .join('');
    }
    // M / L / C：最後一組 (x, y) 就是新的目前點（C 的最後一組是曲線終點）。
    x = n[n.length - 2] ?? x;
    y = n[n.length - 1] ?? y;
    return cmd + n.join(' ');
  });
}

/** 把一段中心線 d 的所有座標平移 (tx, ty)。形狀尺寸不變 → 尾端精準落在錨點。 */
export function translateD(d: string, tx: number, ty: number): string {
  return d.replace(CMD, (_, cmd: string, body: string) => {
    const moved = (body.match(NUM) ?? [])
      .map(Number)
      .map((n, i) => (i % 2 === 0 ? n + tx : n + ty).toFixed(2));
    return cmd + moved.join(' ');
  });
}

/** 取一段 d 的第一個座標（＝該段起點）。前提：已 normalizeD。 */
export function firstPoint(d: string): [number, number] {
  const n = (d.match(NUM) ?? []).map(Number);
  return [n[0]!, n[1]!];
}

/** 取一段 d 的最後一個座標（＝該段終點）。前提：已 normalizeD。 */
export function lastPoint(d: string): [number, number] {
  const n = (d.match(NUM) ?? []).map(Number);
  return [n[n.length - 2]!, n[n.length - 1]!];
}

// 串成單一連續 path：後段的 M 換成從前段末端拉過去的 L（連接段），
// 長度隨兩個錨點的實際距離動態變化。必須只留一個 M —— 多個 M 會讓
// getPointAtLength 在段落之間跳點，接縫就會頓一下。
// 只有一段時原樣回傳、不加連接段（pad 的單一連續線稿走這條）。
export function joinSegments(ds: string[]): string {
  return ds.reduce((acc, d) => {
    if (!acc) return d;
    const [x, y] = firstPoint(d);
    const rest = d.replace(/^M[^LC]*/, '');
    return `${acc}L${x.toFixed(2)} ${y.toFixed(2)}${rest}`;
  }, '');
}

// 在末端追加一段直線（論壇段的「隱形尾段」：從設計線末端直下穿過議程）。
// 保持單一 M，故 getPointAtLength 在接縫不跳點。
export function appendTail(d: string, x: number, y: number): string {
  if (!d) return d;
  return `${d}L${x.toFixed(2)} ${y.toFixed(2)}`;
}

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
