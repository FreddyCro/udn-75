// ── 論壇段設計線 · mob 路徑產生器 ──────────────────────────────────────
// pc / pad 的線是手貼 Figma 匯出的 d ＋ 整段平移（見 orange-core-config 的 FORUM_PATH）；
// mob 不能那樣做 —— 稿是 414 寬、線本來就撞到左右緣，而現有機制只平移不縮放，
// 在 320 寬視窗會超出畫面約 94px；且 mob 的版面是流排版（.forum-event 退回 flex 直排），
// 垂直位置隨字數／字體／視窗寬一起變，寫死的 y 一定會飄。
//
// 故 mob 改成「宣告 waypoint → 執行時量 DOM → 算出 d」。
// ⚠ 完整規則（每個點掛哪個 element、五個可調旋鈕、與稿的已知差異）見
//   architecture/forum-mob-path.md。改動前先讀。

/** 橫向位置：釘左右緣／中心，或容器寬的比例（0–1） */
export type MobPathX = 'left' | 'center' | 'right' | number;

/** 縱向錨點：掛哪個 element 的哪一邊 */
export type MobPathAnchor = {
  /** 限定在哪一場之內（＝ data-forum-anchor 的值）。省略則在 .sec2__path 全域查。 */
  event?: string;
  /** 選擇器（在上述 scope 內） */
  sel: string;
  /** 同一選擇器命中多個時取第幾個（預設 0） */
  nth?: number;
  /** top＝上緣、bottom＝下緣、fraction＝元素高度的 t 處 */
  edge: 'top' | 'bottom' | 'fraction';
  /** edge 為 'fraction' 時的比例（0–1） */
  t?: number;
  /** 再往下偏移幾 px（可負） */
  dy?: number;
};

/**
 * 到下一點的連法。
 * 角度是**相對兩點連線（chord）**的夾角，故視窗變寬變窄、文字撐高撐矮時
 * chord 跟著旋轉縮放，彎的形狀不會變形。螢幕座標 y 向下 → 正角度＝順時針。
 */
export type MobPathJoin =
  | 'line'
  | {
      /** 出發角（度，相對 chord） */
      relIn: number;
      /** 到達角（度，相對 chord） */
      relOut: number;
      /** 出發側 handle 長度 ÷ 兩點距離（越大彎越鼓） */
      hIn: number;
      /** 到達側 handle 長度 ÷ 兩點距離 */
      hOut: number;
    };

export type MobPathNode = {
  /** 穩定編號，永不重排（要插入就用 P7a）。溝通時直接喊這個。 */
  id: string;
  x: MobPathX;
  anchor: MobPathAnchor;
  /** 到下一點的連法；最後一點省略 */
  join?: MobPathJoin;
  /** 刻意偏離設計稿時寫理由（同步記到 architecture/forum-mob-path.md 第七節） */
  note?: string;
};

/** 量測介面：吃錨點吐「相對容器的上緣 ＋ 高度」；量不到回 null */
export type MobPathMeasure = (
  a: MobPathAnchor
) => { top: number; height: number } | null;

/** 設計線線寬（實測稿的 outline 帶寬 4.0px 等寬 → 驅動線＝可見線） */
export const FORUM_MOB_STROKE = 4;

/** 釘邊時距容器邊緣的內縮（＝半個描邊，讓線齊邊又不被裁掉） */
const EDGE_INSET = FORUM_MOB_STROKE / 2;

// ── waypoint 資料 ─────────────────────────────────────────────────────
// 數字全部從 Figma 2584:35109（file HOt7xNcSTpina7WqNv9MVn）反推，
// 換算流程見 architecture/forum-mob-path.md 第九節。稿的內座標寫在每列註解，
// 之後稿改版時可以直接對照。
export const FORUM_MOB_NODES: MobPathNode[] = [
  {
    id: 'P0',
    x: 'center',
    // 稿是容器 y=43，這裡刻意歸零：交棒點幾何要求路徑起點落在視窗正中央
    // ＝ 容器 y=0（見 forum-core-path.md 的 start: 'top center'）。照稿會跳 43px。
    anchor: { sel: '.sec2__path', edge: 'top', dy: 0 },
    note: '刻意偏離稿 +43 → 0，保交棒零跳點',
    join: 'line',
  },
  {
    id: 'P1', // 稿 (207.0, 376.5)；標眉上緣 375.4
    x: 'center',
    anchor: { event: '論壇一', sel: '.forum-event__tag', edge: 'top', dy: 1 },
    join: { relIn: -54.2, relOut: 57.4, hIn: 0.41, hOut: 0.57 },
  },
  {
    id: 'P2', // 稿 (291.5, 368.5)。彎的肩點，沒有對應區塊 → 掛 P1 同一個 element
    x: 0.704,
    anchor: { event: '論壇一', sel: '.forum-event__tag', edge: 'top', dy: -7 },
    join: { relIn: -23.7, relOut: 7.2, hIn: 0.07, hOut: 0.75 },
  },
  {
    id: 'P3', // 稿 (343.0, 763)；標眉＋英文名組下緣 768.6
    x: 0.829,
    // 掛 __head 而非 __subtitle：稿上這條界線是「標眉＋英文名組」整組的下緣，
    // __head 正是那一組（tag → title → subtitle）。實測兩者下緣目前相同（647.7），
    // 但日後若在 head 內補 __body，只有 __head 會跟著長。
    anchor: { event: '論壇一', sel: '.forum-event__head', edge: 'bottom', dy: -6 },
    join: { relIn: 111.2, relOut: -35.8, hIn: 0.23, hOut: 1.01 }, // 髮夾彎
  },
  {
    id: 'P4', // 稿 (59.0, 1069)；日期／地點組下緣 1073.5
    x: 0.143,
    anchor: { event: '論壇一', sel: '.forum-event__venue', edge: 'bottom', dy: -4 },
    join: { relIn: -55.9, relOut: 42.5, hIn: 0.22, hOut: 0.7 },
  },
  {
    id: 'P5', // 稿 (410.0, 1175)；照片上緣 1073.5 ⚠ 錨點待量測確認
    x: 'right',
    anchor: {
      event: '論壇一',
      sel: '.forum-event__photo, .forum-event__photo-slot',
      edge: 'top',
      dy: 102,
    },
    join: 'line', // 稿 bulge 僅 0.1% of L → 直線
  },
  {
    id: 'P6', // 稿 (0.5, 1938)；講者組（照片上緣 1073.5 → bio 末端 2911.5）的 0.470 處
    x: 'left',
    // 用 fraction 而非 dy：這一段是整頁高度變動最大的地方（5 段 bio），
    // 寫死「上緣 +457」沒有視覺意義。
    // ⚠ 掛 __speakers 而非 __bio：__bio 是 v-for 出來的 5 個 <p>，querySelectorAll 只會
    //   抓到第一段（實測 216 高，整組是 1905）→ 撞左牆的點會落在整段開頭。
    // ⚠ 也不能掛 __speaker：論壇一的它在 pad/mob 是 display: contents（見 forum-rwd memory
    //   的「兩處靠 display: contents 重排」），rect 全 0，量不到。
    anchor: { event: '論壇一', sel: '.forum-event__speakers', edge: 'fraction', t: 0.4704 },
    join: 'line',
  },
  {
    id: 'P7', // 稿 (411.0, 3143.5)；論壇二日期組上緣 3105.5
    x: 'right',
    anchor: { sel: '[data-forum-anchor="論壇二"]', edge: 'top', dy: 38 },
    join: 'line',
  },
  {
    id: 'P8', // 稿 (107.0, 3786)；論壇二講者介紹列上緣 3764.5
    x: 0.259,
    anchor: { event: '論壇二', sel: '.forum-event__speaker-label', edge: 'top', dy: 22 },
    join: { relIn: -69, relOut: 53.2, hIn: 0.43, hOut: 0.69 },
  },
  {
    id: 'P9', // 稿 (295.3, 3868.9)；講者一組上緣 3814.5
    x: 0.713,
    anchor: { event: '論壇二', sel: '.forum-event__speaker', nth: 0, edge: 'top', dy: 54 },
    join: { relIn: -6.4, relOut: 4.1, hIn: 0.34, hOut: 0.17 },
  },
  {
    id: 'P10', // 稿 (323.5, 4202)；講者二組下緣 4190.5
    x: 0.781,
    anchor: { event: '論壇二', sel: '.forum-event__speaker', nth: 1, edge: 'bottom', dy: 12 },
    join: 'line',
  },
  {
    id: 'P11', // 稿 (323.5, 4867.5)；論壇三 time 組上緣 4870.5
    x: 0.781,
    // 這三點掛論壇三的 __meta 而非 __date：稿的 `time` 組是 199 高（日期＋時間兩塊），
    // 而實作的 __date 只有日期（實測 112）、時間在 __venue 裡 —— __meta（實測 204）才是
    // 對應那一組的框。P12 / P13 用 fraction，__meta 高度變動時兩點會等比跟著走。
    anchor: { event: '論壇三', sel: '.forum-event__meta', edge: 'top', dy: -3 },
    join: { relIn: 81.9, relOut: -51.8, hIn: 0.41, hOut: 0.53 }, // 髮夾彎
  },
  {
    id: 'P12', // 稿 (108.0, 4961.5)＝ time 組的 0.457 處
    x: 0.261,
    anchor: { event: '論壇三', sel: '.forum-event__meta', edge: 'fraction', t: 0.4574 },
    join: { relIn: -62, relOut: 53.2, hIn: 0.29, hOut: 0.69 },
  },
  {
    id: 'P13', // 稿 (198.5, 5018.5)＝ time 組的 0.744 處。終點：稿之後那段拱與箭頭在 mob 不畫
    x: 'center',
    anchor: { event: '論壇三', sel: '.forum-event__meta', edge: 'fraction', t: 0.7439 },
    note: '終點釘中心（稿 198.5，差 8.5px）；稿的箭頭與最後一段拱不畫，線比稿短 93px',
  },
];

// ── 產生器 ────────────────────────────────────────────────────────────
const RAD = Math.PI / 180;
const r2 = (v: number) => Math.round(v * 100) / 100;

function resolveX(x: MobPathX, w: number, amplitude: number): number {
  const raw =
    x === 'left'
      ? EDGE_INSET
      : x === 'right'
        ? w - EDGE_INSET
        : x === 'center'
          ? w / 2
          : x * w;
  // amplitude 是全域「橫向擺幅」旋鈕：把所有點往容器中心收（1 ＝ 照稿）。
  return w / 2 + (raw - w / 2) * amplitude;
}

function resolveY(a: MobPathAnchor, m: { top: number; height: number }): number {
  const dy = a.dy ?? 0;
  if (a.edge === 'top') return m.top + dy;
  if (a.edge === 'bottom') return m.top + m.height + dy;
  return m.top + m.height * (a.t ?? 0) + dy; // fraction
}

/**
 * 依 waypoint 與量測值算出整條線。
 * 回傳的 d 已在 .forum-path 座標系（＝ .sec2__path 的 padding box），
 * 只有一個 M → getPointAtLength 不會跳點，可同時餵給可見線與驅動線。
 *
 * ⚠ 任何一個錨點量不到就整條放棄（回 null），**不跳過那個點** ——
 *   跳過會讓後面所有點接到錯的鄰居身上，線靜默變形。同 forum-core-path.md
 *   裡 layout() 回傳定長陣列的理由。
 */
export function buildNodePathD(
  nodes: MobPathNode[],
  ctx: { width: number; measure: MobPathMeasure; amplitude?: number }
): { d: string; endY: number } | null {
  const { width, measure, amplitude = 1 } = ctx;
  if (nodes.length < 2) return null;

  const pts: [number, number][] = [];
  for (const n of nodes) {
    const m = measure(n.anchor);
    if (!m) return null;
    pts.push([resolveX(n.x, width, amplitude), resolveY(n.anchor, m)]);
  }

  let d = `M${r2(pts[0]![0])} ${r2(pts[0]![1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const join = nodes[i]!.join ?? 'line';
    if (join === 'line') {
      d += `L${r2(x1)} ${r2(y1)}`;
      continue;
    }
    const len = Math.hypot(x1 - x0, y1 - y0);
    const chord = Math.atan2(y1 - y0, x1 - x0) / RAD;
    const aIn = (chord + join.relIn) * RAD;
    const aOut = (chord + join.relOut) * RAD;
    const c1x = x0 + join.hIn * len * Math.cos(aIn);
    const c1y = y0 + join.hIn * len * Math.sin(aIn);
    const c2x = x1 - join.hOut * len * Math.cos(aOut);
    const c2y = y1 - join.hOut * len * Math.sin(aOut);
    d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(x1)} ${r2(y1)}`;
  }

  // endY 與 d 用同一個捨入值：ScrollTrigger 的 end 與線的末端必須指同一個點。
  return { d, endY: r2(pts[pts.length - 1]![1]!) };
}
