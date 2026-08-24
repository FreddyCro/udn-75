// ── 論壇段設計線的「轉折」──────────────────────────────────────────────
//
// 核心沿線蛇行時，每遇到一個轉折就出一聲音效（見 ForumCorePath 的 place()）。
// 這個檔只回答一個問題：**哪些節點算轉折、它們在線上的弧長是多少**。
//
// 為什麼是算出來的、不是手寫節點清單：
//   ① 三個斷點的節點表完全不通用（pc W/R、pad Q/S、mob P/T），手寫要維護三份名單，
//      而節點一增刪就靜默失準 —— 同 forum-path-events 檔頭那段「手寫 % 會飄」的理由。
//   ② 節點表裡混著**補點**（為了把擬合偏差壓到 3px 以內插進去的點，例如 pc 的 W17）。
//      那些點視覺上就在線上，不是轉折；用幾何判就自動落選，不必逐一標註。
//
// 職責切法同 forum-path-events：量測留在元件裡（ForumCorePath 用量尺 path 算弧長），
// 算得出來的東西放這裡，vitest 直接跑、不需要 jsdom。

import type { SoundKey } from '~/utils/sound-manifest';

export type ForumTurn = {
  /** 節點編號（＝溝通用的地址，「W3 那一聲太早」） */
  id: string;
  /** 折線轉角（度，見 turnAngleDeg） */
  angle: number;
  /** 在驅動線上的弧長（px）。撞擊（出聲＋擠壓）的判定比的是這個值，
   *  見 ForumCorePath 的 hitTurnsCrossed。 */
  len: number;
  /** len / pathLen（forumPath 軌的 0..1）。**只給 dashboard 顯示用** ——
   *  與路徑事件的門檻同一個座標系，兩區的 % 才對得起來。 */
  mark: number;
};

/**
 * 三點夾出的轉角（度）。0 ＝ 直行、180 ＝ 完全折回（髮夾彎的極限）。
 * 左轉右轉同值（取絕對值）—— 出聲與轉向無關。
 *
 * 實務上三個點是**在節點弧長 ±FORUM_TURN_SAMPLE_LEN 處對路徑取樣**得到的
 *（見 ForumCorePath 的 syncTurns），也就是量「線本身在那裡折了多少」。
 *
 * ⚠ 一開始的版本改拿**相鄰三個節點的座標**（折線轉角）判，那是錯的：pc 有 29 個節點、
 *   折線貼著曲線走，量得準；但 pad / mob 只有 14 個，彎度幾乎都在 relIn / relOut 的
 *   控制點裡而不在節點位置上 —— 實測 pad 的 Q3（稿上就標著「髮夾彎」）折線只有 58.8°、
 *   切線量出來 109°，整個斷點因此只選到 2 個轉折（pc 是 10 個）。
 *   節點密度是實作分工，不該決定音效密度，所以判準必須是線本身。
 *
 * 退化情形（相鄰兩點重合）回 0：那不是轉折，而且 atan2(0,0) 的方向沒有意義。
 * 回 NaN 會讓 `angle >= minAngleDeg` 靜默恆 false —— 那種靜默正是本專案要避免的。
 */
export function turnAngleDeg(
  prev: readonly [number, number],
  at: readonly [number, number],
  next: readonly [number, number],
): number {
  const inX = at[0] - prev[0];
  const inY = at[1] - prev[1];
  const outX = next[0] - at[0];
  const outY = next[1] - at[1];
  if ((!inX && !inY) || (!outX && !outY)) return 0;
  const deg =
    (Math.atan2(outY, outX) - Math.atan2(inY, inX)) * (180 / Math.PI);
  // 正規化到 (−180, 180] 再取絕對值：不正規化的話「往回折」會算成 260° 之類的值。
  return Math.abs(((((deg + 180) % 360) + 360) % 360) - 180);
}

/** 取樣半徑（px 弧長）：在節點的前後各這麼遠取一點，量線在那裡折了多少。
 *
 *  太小 → 吃到 getPointAtLength 的數值雜訊；太大 → 把折角平滑掉（實測 δ=4 時 pad 的 Q3
 *  只剩 19°，δ=8 起才穩定在 109–131°）。8 是「小於任何一個彎的尺度、大於雜訊」的區間。
 *  平滑節點（join 連續）不論 δ 多大都趨近 0，故這個值只影響折角的判定靈敏度。 */
export const FORUM_TURN_SAMPLE_LEN = 8;

/** 轉角至少幾度才算轉折。
 *
 *  90 會選到「拱的肩點」那類轉折 —— 那在稿上是拱頂，本來就是一個彎。
 *  只要髮夾彎與撞牆的硬轉角就往上拉（實測髮夾彎多在 110–165°、硬轉角 115–130°）。 */
export const FORUM_TURN_MIN_ANGLE_DEG = 90;

/** 相鄰兩個轉折至少要相隔幾 px 弧長。
 *
 *  ⚠ 這道閘門不是可有可無的：髮夾彎的**回程點**也是大轉角（pc 的 W4 實測 98.4°），
 *    而它距頂點 W3 只有約 107px 弧長 —— 沒有間隔限制就會在同一個彎裡連響兩聲。
 *  單位與 FORUM_PLANE.morphLen / forum-path-events 的 dLen 相同（px 弧長）。 */
export const FORUM_TURN_MIN_GAP_LEN = 300;

/** 轉折要播哪一支音效。三個斷點、每個轉折都是同一支（見 sound-manifest 的清單）。
 *
 *  型別綁 SoundKey → 打錯字或音效檔被移出清單時編譯期就報錯，不會變成靜默的 no-op
 *  （useSfx 的 play() 對不認識的 key 直接 return）。 */
export const FORUM_TURN_SFX: SoundKey = 'sfx01';

/**
 * 撞擊擠壓的倍率：把「壓了多少」（amount）換算成方塊的 [scaleX, scaleY]。
 *
 * amount 0 ＝ 原尺寸、1 ＝ 稿上的撞擊形狀（size，見 FORUM_TURN_SQUASH）。
 * 兩軸各自線性內插，故 amount 是 gsap 補間的唯一一個數 —— 形狀由稿決定、節奏由 ease 決定，
 * 兩件事不互相污染。
 *
 * ⚠ **不 clamp**：回彈的 ease（back.out）會讓 amount 越過 0 變負，那是刻意的
 *   「壓扁 → 彈過頭拉長一下 → 回正」，夾掉就沒有彈性了（見 FORUM_TURN_SQUASH 的註解）。
 *   amount 由補間產生、範圍受 ease 保證，不是外部輸入。
 *
 * 退化：base ≤ 0（量不到原尺寸）→ 回 [1, 1]。**不可能讓方塊塌成 0** ——
 * 同 slashCoreScaleAt 的 fail-soft：形變壞掉時該看到的是「沒有形變」，不是核心消失。
 */
export function squashScaleAt(
  amount: number,
  size: readonly [number, number],
  base: number,
): [number, number] {
  if (!(base > 0)) return [1, 1];
  return [
    1 + amount * (size[0] / base - 1),
    1 + amount * (size[1] / base - 1),
  ];
}

/**
 * 挑出轉折。
 *
 * `order` 必須是**線上順序**的節點編號（＝節點表的順序，弧長遞增）：間隔要跟前一個入選的
 * 比，依賴這個順序。實務上傳 FORUM_FRONT_NODES[bp] 的 id（＝議程之前那一段），
 * 故不必再過濾弧長範圍。
 *
 * `angleAt` / `lenAt` 由呼叫端注入（ForumCorePath 對驅動線取樣的結果），故本函式不碰 DOM
 * —— 職責切法同 forum-path-events：量測在元件裡，篩選規則在這裡、vitest 直接跑。
 * 任一個查不到就剔除該節點（optional 節點被 `?highlights` 跳掉時就是這種情形）。
 *
 * 路徑端點自然不入選：`angleAt` 在那裡取樣會越界 → 回 undefined → 被剔除。
 * ⚠ **不要再按索引跳過 `live` 的首尾** —— 端點已經在上一步被剔掉了，再跳一次會誤殺
 *   「第一個量得到角度的節點」。實測 mob 的 P1（線頭那個 147° 的硬右轉，緊接在核心出現
 *   之後）就是這樣被吃掉的，而它是那個斷點最明顯的一個彎。
 *

 * ⚠ pathLen ≤ 0 回空表（同 resolveForumEventMarks）：那時 mark 會是 NaN 或 Infinity，
 *   而 dashboard 顯示 NaN% 只會讓人以為面板壞了，看不出真正的原因是線還沒量好。
 */
export function pickTurns(args: {
  order: readonly string[];
  angleAt: (id: string) => number | undefined;
  lenAt: (id: string) => number | undefined;
  pathLen: number;
  minAngleDeg?: number;
  minGapLen?: number;
}): ForumTurn[] {
  const {
    order,
    angleAt,
    lenAt,
    pathLen,
    minAngleDeg = FORUM_TURN_MIN_ANGLE_DEG,
    minGapLen = FORUM_TURN_MIN_GAP_LEN,
  } = args;
  if (!(pathLen > 0)) return [];

  const live: { id: string; angle: number; len: number }[] = [];
  for (const id of order) {
    const angle = angleAt(id);
    const len = lenAt(id);
    if (angle == null || len == null) continue;
    live.push({ id, angle, len });
  }

  const out: ForumTurn[] = [];
  let lastLen: number | null = null;
  for (const cur of live) {
    if (cur.angle < minAngleDeg) continue;
    // 與**前一個入選**比，不是與前一個節點比：連續三個大轉角時，中間那個被濾掉
    // 不該讓第三個因此通過（否則密集彎區還是會連響）。
    if (lastLen != null && cur.len - lastLen < minGapLen) continue;
    out.push({ id: cur.id, angle: cur.angle, len: cur.len, mark: cur.len / pathLen });
    lastLen = cur.len;
  }
  return out;
}
