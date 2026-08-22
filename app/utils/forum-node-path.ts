// ── 論壇段設計線 · waypoint 路徑產生器 ────────────────────────────────
// 有兩種畫線方式並存：
//   pc  → 手貼 Figma 匯出的 d ＋ 整段平移（見 orange-core-config 的 FORUM_PATH）
//   pad / mob → 本檔：宣告 waypoint → 執行時量 DOM → 算出 d
//
// pad / mob 不能用平移那套，因為：
//   1. 稿是 768 / 414 寬，而斷點涵蓋 768–1279 與 ≤767，線本來就撞到左右緣；
//      平移不縮放的話窄視窗會超出畫面（mob 實測在 320 寬溢出約 94px）。
//   2. 這兩個斷點的版面是流排版（.forum-event 退回 flex 直排），垂直位置隨字數、
//      字體 fallback、視窗寬一起變 —— 寫死的 y 一定會飄。
//   3. pad 的線（Vector 276）是一條跨越三場的連續線，必須同時咬住多個位置；
//      單點平移只能釘住一個點，其餘會慢慢飄掉。
//
// ⚠ 完整規則（每個點掛哪個 element、五個可調旋鈕、與稿的已知差異）見
//   architecture/forum-node-path.md。改動前先讀。

/** 錨點的查找方式（縱橫共用）：在哪一場的哪個 element 上 */
export type ForumPathTarget = {
  /** 限定在哪一場之內（＝ data-forum-anchor 的值）。省略則在 .sec2__path 全域查。 */
  event?: string;
  /** 選擇器（在上述 scope 內） */
  sel: string;
  /** 同一選擇器命中多個時取第幾個（預設 0） */
  nth?: number;
};

/** 縱向錨點：掛哪個 element 的哪一邊 */
export type ForumPathAnchor = ForumPathTarget & {
  /** top＝上緣、bottom＝下緣、fraction＝元素高度的 t 處 */
  edge: 'top' | 'bottom' | 'fraction';
  /** edge 為 'fraction' 時的比例（0–1） */
  t?: number;
  /** 再往下偏移幾 px（可負） */
  dy?: number;
};

/**
 * 橫向錨點：把 x 掛在某個 element 上，而不是容器寬的比例。
 *
 * pad 的議程用這招 —— `.agenda`（608 置中）與 `.sec2__path`（固定 768 置中）
 * 相對位移恆為 80px，比例已經很接近了，仍掛 element 是因為：
 *   1. 視窗 768 帶傳統捲軸時容器吃不滿 768（實測 ~753），比例值會跟著偏；
 *   2. 讓線與 `.agenda` 的 608 解耦 —— `.agenda` 改寬度時這裡不用跟著重算比例。
 *
 * fallback 是量不到時的退路（容器寬的比例，語意同數字型的 x）—— 刻意不整條放棄：
 * 橫向錯位只是線歪掉，比整條消失好；而且退路值就是原本寫死的稿比例，行為等同改動前。
 */
export type ForumPathXAnchor = ForumPathTarget & {
  /** left＝左緣、center＝水平中心、right＝右緣（皆為 border box） */
  edge: 'left' | 'center' | 'right';
  /** 再往右偏移幾 px（可負） */
  dx?: number;
  /** 量不到時退回容器寬的比例（0–1） */
  fallback: number;
};

/** 橫向位置：釘左右緣／中心、容器寬的比例（0–1），或掛在某個 element 上 */
export type ForumPathX = 'left' | 'center' | 'right' | number | ForumPathXAnchor;

/**
 * 到下一點的連法。
 * 角度是**相對兩點連線（chord）**的夾角，故視窗變寬變窄、文字撐高撐矮時
 * chord 跟著旋轉縮放，彎的形狀不會變形。螢幕座標 y 向下 → 正角度＝順時針。
 *
 * handle 長度為 0 時該側退化成硬轉角（此時同側的角度沒有意義、填 0 即可）——
 * pad 的 Q10 就是這種「撞左牆」的轉角。
 */
export type ForumPathJoin =
  | 'line'
  | {
      /** 出發角（度，相對 chord） */
      relIn: number;
      /** 到達角（度，相對 chord） */
      relOut: number;
      /** 出發側 handle 長度 ÷ 兩點距離（越大彎越鼓；0 ＝ 硬轉角） */
      hIn: number;
      /** 到達側 handle 長度 ÷ 兩點距離 */
      hOut: number;
    };

export type ForumPathNode = {
  /** 穩定編號，永不重排（要插入就用 P7a）。溝通時直接喊這個。 */
  id: string;
  x: ForumPathX;
  anchor: ForumPathAnchor;
  /** 到下一點的連法；最後一點省略 */
  join?: ForumPathJoin;
  /** 量不到錨點時：true ＝ 跳過這個點，false／省略 ＝ 整條放棄（見 buildNodePathD） */
  optional?: boolean;
  /** 刻意偏離設計稿時寫理由（同步記到 architecture/forum-node-path.md） */
  note?: string;
};

/** 量測介面：吃錨點吐「相對容器的 border box」；量不到回 null */
export type ForumPathMeasure = (
  t: ForumPathTarget
) => { top: number; height: number; left: number; width: number } | null;

/** 設計線線寬（三斷點的稿都是 4px 等寬 → 驅動線＝可見線） */
export const FORUM_PATH_STROKE = 4;

/** 釘邊時距容器邊緣的內縮（＝半個描邊，讓線齊邊又不被裁掉） */
const EDGE_INSET = FORUM_PATH_STROKE / 2;

/**
 * 議程的箭頭欄 —— 線穿過議程時要落在這一欄上，核心才「剛好接到箭頭」。
 *
 * 掛 `.agenda__rows` 的左緣而非 `.agenda__arrow` 本身：那條 1px 的 border-left 就是箭頭的
 * 中軸（箭頭是 absolute、left: −0.5px − u/2、寬 u，中心正好落在 border 中心），而箭頭
 * 平常 opacity: 0、mob 更是 display: none —— 掛在會消失的東西上不穩。
 * dx 0.5 ＝ 半個 border，把 border box 左緣推到 border 中心。
 *
 * pad 的 `.agenda`（608 置中）與 `.sec2__path`（固定 768 置中）相對位移恆為 80 →
 * 箭頭中軸 x = 202.5；`fallback` 0.262 × 768 = 201.2，只差 1.3px。視窗 768 帶傳統
 * 捲軸時容器吃不滿 768（實測 ~753），箭頭落在 195、fallback 197.3 → 差 2.3px。
 * 仍掛 element 是因為：① 上述捲軸情境比例值會偏；② 讓線與 `.agenda` 的 608 解耦，
 * 那邊改寬度時這裡不用跟著重算。見 ForumPathXAnchor。
 *
 * 只有 pad 掛它：pc 的 `.agenda`（1064）與 `.forum-path`（1280 上限）同樣置中於視窗，
 * 相對位移是常數、不會隨寬度飄；mob 沒有豎線也沒有箭頭（見 Agenda.vue）。
 */
const AGENDA_ARROW_X: ForumPathXAnchor = {
  sel: '.agenda__rows',
  edge: 'left',
  dx: 0.5,
  fallback: 0.262, // ＝ 稿寬 768 下的箭頭位置，也是改動前寫死的值
};

/**
 * 論壇二 09/15 那一撇 —— 撇的兩端**就是**路徑上的兩個節點。
 *
 * 那一撇是核心「畫」出來的（見 ForumEvent 的 .forum-event__date-coreslash 與
 * ~/utils/forum-slash），所以「核心經過哪裡」與「撇畫在哪裡」必須是同一個真值。
 * 撇的版位住在 ForumEvent.vue 的 --coreslash-x/y（逐斷點、且有目視微調），日期文案一改
 * （月份變兩位數、行數變了、字級調了）它就跟著動 —— 節點掛它自己，兩邊才永遠同步。
 *
 * ⚠ **不要**在這裡抄一份稿座標或改掛 `__date` + dy。那會有兩份真值，漂掉時畫面上是
 *   「撇畫在 A、核心在 B」，而兩邊都不報錯 —— 2026-08-22 修的 mob bug 就是這樣來的
 *   （撇在 x 158–207，線卻走 x 235–370，差 126–168px）。
 *
 * ⚠ 兩點之間的 join 必須是 `'line'`：那一段**就是**撇本身，撇是直線。
 *
 * optional 是必要的：`slash` 不是 'core' 的場次沒有這個元素，量不到就跳過這兩點 ——
 * 少一撇只是少一個裝飾，讓整條線放棄會讓橘核心在論壇段整段消失。
 */
const SLASH_SEL = '.forum-event__date-coreslash';
/** 撇的進入端（右上角）。fallback 是稿寬下的比例，只在撇不存在時用得到。 */
const slashEnterX = (fallback: number): ForumPathXAnchor => ({
  event: '論壇二',
  sel: SLASH_SEL,
  edge: 'right',
  fallback,
});
/** 撇的離開端（左下角） */
const slashExitX = (fallback: number): ForumPathXAnchor => ({
  event: '論壇二',
  sel: SLASH_SEL,
  edge: 'left',
  fallback,
});
const SLASH_ENTER_Y: ForumPathAnchor = {
  event: '論壇二',
  sel: SLASH_SEL,
  edge: 'top',
};
const SLASH_EXIT_Y: ForumPathAnchor = {
  event: '論壇二',
  sel: SLASH_SEL,
  edge: 'bottom',
};

// ── pad（768 稿，Figma Vector 276 / temp/pad.svg）─────────────────────
// 換算：artboard 座標 ＝ asset 座標 ＋ (3.356, 189.0)
//   （來自 temp/vector276.svg 的 <rect width="768" height="6145"
//     transform="translate(-2.99394 -168.609) scale(0.892109)">）
// 驗證：線的起點 asset (383.554, 2) → artboard (386.9, 191.0)，而 768 稿的水平中心是
//   384 —— 差 2.9px，與 pc(640)、mob(207) 一樣從容器中心進場，確認換算正確。
// 稿是真描邊（stroke-width 4、stroke-opacity 0.1、單一 M、指令只有 MVCL），
// 中心線就是 d 本身，故控制點直接讀得到、不必做 outline 擬合。
const PAD_NODES: ForumPathNode[] = [
  {
    id: 'Q0',
    x: 'center',
    // 稿是 artboard y=191，這裡刻意歸零：交棒點幾何要求路徑起點落在視窗正中央
    // ＝ 容器 y=0（見 forum-node-path.md 第五節的 start: 'top center'）。照稿會跳 191px。
    anchor: { sel: '.sec2__path', edge: 'top', dy: 0 },
    note: '刻意偏離稿 +191 → 0，保交棒零跳點',
    join: 'line',
  },
  {
    id: 'Q1', // 稿 (386.9, 398.5)；標眉 348–382
    x: 'center',
    anchor: { event: '論壇一', sel: '.forum-event__tag', edge: 'bottom', dy: 17 },
    join: { relIn: -47.8, relOut: 58.8, hIn: 0.3, hOut: 0.516 },
  },
  {
    id: 'Q2', // 稿 (571.4, 339)。拱的肩點，掛 Q1 同一個 element（同 mob 的 P2）
    x: 0.744,
    anchor: { event: '論壇一', sel: '.forum-event__tag', edge: 'top', dy: -9 },
    join: { relIn: -37.3, relOut: 11.8, hIn: 0.257, hOut: 0.229 },
  },
  {
    id: 'Q3', // 稿 (665.9, 792.5)；日期／地點組上緣 816.65
    x: 0.867,
    // 與 mob 的 P3 同一個修正（見該處）：原本掛 __head 下緣 +64，而實作的 __head
    // 不含引言 → 頂點落在引言區塊**裡面**（實測 689.9，引言 657.9–797.9）。
    anchor: { event: '論壇一', sel: '.forum-event__date', edge: 'top', dy: -24 },
    join: { relIn: 95.2, relOut: -47.2, hIn: 0.347, hOut: 0.661 }, // 髮夾彎
  },
  {
    id: 'Q4', // 稿 (232.4, 1066.5)；日期／地點組下緣 1100.65
    x: 0.303,
    anchor: { event: '論壇一', sel: '.forum-event__meta', edge: 'bottom', dy: -34 },
    join: { relIn: -76.8, relOut: 42.2, hIn: 0.359, hOut: 0.672 },
  },
  {
    id: 'Q5', // 稿 (549.9, 1308.5)；講者照片 1100.65 起、233 高
    x: 0.716,
    anchor: {
      event: '論壇一',
      sel: '.forum-event__photo, .forum-event__photo-slot',
      edge: 'top',
      dy: 208,
    },
    // 橫跨論壇一整段長 bio 的大弧（稿 chord 1912）—— 高度變動最大的區域交給它吸收
    join: { relIn: -8.4, relOut: 2.1, hIn: 0.194, hOut: 0.225 },
  },
  {
    id: 'Q6', // 稿 (619.9, 3219.5)；論壇二日期／地點組上緣 3226.37
    x: 0.807,
    anchor: { event: '論壇二', sel: '.forum-event__meta', edge: 'top', dy: -7 },
    join: { relIn: 90.9, relOut: -44.5, hIn: 0.395, hOut: 0.936 },
  },
  {
    id: 'Q7', // 稿 (380.9, 3312)；論壇二日期組內 +86
    x: 0.496,
    anchor: { event: '論壇二', sel: '.forum-event__meta', edge: 'top', dy: 86 },
    join: 'line',
  },
  // ── 09/15 那一撇（見 SLASH_SEL 那一段）──────────────────────────────
  // pad 的稿本來就把 Q7→Q8 那條直線畫成「順著撇的角度穿過去」（實測線 120.9°、
  // 撇 116.4°，只差 4.5°），這兩點只是把它從「差 5–7px」釘成「精準重合」。
  // 三段折角各 ~10°、每段只有 40–70px，看起來仍是一條直線。
  {
    id: 'Q7a', // 撇的右上角；稿寬 768 下 x ≈ 339.3
    x: slashEnterX(0.4418),
    anchor: SLASH_ENTER_Y,
    optional: true,
    join: 'line', // ⚠ 這一段就是撇本身，必須是直線
  },
  {
    id: 'Q7b', // 撇的左下角；稿寬 768 下 x ≈ 270
    x: slashExitX(0.3516),
    anchor: SLASH_EXIT_Y,
    optional: true,
    join: 'line',
  },
  // ⚠ Q8～Q10 的 dy 在 2026-08-17 重校過：論壇二的講者組從「兩張並排卡片 ＋ 上方標籤列」
  //   （稿上緣 3593.02、高 390）改成「單人照片左、文字右」（稿上緣 3614、高 233）。
  //   **pad 的線稿沒有重畫**（`Vector 276` 2652:53744 與改版前完全一致），論壇三的位置也
  //   沒動，故這三點改用新的 dy 把它們釘回稿上原本的頂點 —— 三個都精準對回，線形不變。
  {
    id: 'Q8', // 稿 (246, 3595)；論壇二講者組上緣 3614 − 19
    x: 0.32,
    anchor: { event: '論壇二', sel: '.forum-event__speakers', edge: 'top', dy: -19 },
    join: { relIn: 68.2, relOut: -47.4, hIn: 0.434, hOut: 0.632 },
  },
  {
    id: 'Q9', // 稿 (109, 3627)；講者組上緣 +13
    x: 0.142,
    anchor: { event: '論壇二', sel: '.forum-event__speakers', edge: 'top', dy: 13 },
    // hOut 0 → 到達側是硬轉角（撞左牆），relOut 因此沒有意義
    join: { relIn: 7, relOut: 0, hIn: 0.487, hOut: 0 },
  },
  {
    id: 'Q10', // 稿 (5.5, 3877.5)＝撞左牆的硬轉角；講者組下緣 3847 + 30.5
    // 5.5 / 768 ＝ 稿的精確 x。容器在 pad 固定 768 之後（見
    // architecture/2026-08-12-forum-pad-container-design.md），4px 描邊落在
    // 3.5–7.5、本來就在容器內，不需要再用 'left' 的 EDGE_INSET 保護。
    //
    // ⚠ 改版前是 fraction 0.7294（組高 390 時剛好落在稿的頂點）。組矮成 233 之後同一個
    //   比例會落在 3784、比稿高 93px，故改掛 bottom —— 稿上這個角本來就在講者組**下方**。
    x: 0.00716,
    anchor: {
      event: '論壇二',
      sel: '.forum-event__speakers',
      edge: 'bottom',
      dy: 30.5,
    },
    // hIn 0 → 出發側同樣是硬轉角，relIn 沒有意義
    join: { relIn: 0, relOut: -0.6, hIn: 0, hOut: 0.668 },
  },
  {
    id: 'Q11', // 稿 (123, 4087)；論壇三標眉上緣 4095.02
    x: 0.16,
    anchor: { event: '論壇三', sel: '.forum-event__tag', edge: 'top', dy: -8 },
    join: { relIn: -81.8, relOut: 40.1, hIn: 0.476, hOut: 0.453 },
  },
  {
    id: 'Q12', // 稿 (629.9, 4519.5)；論壇三日期組上緣 4525.02
    x: 0.82,
    anchor: { event: '論壇三', sel: '.forum-event__meta', edge: 'top', dy: -5 },
    join: { relIn: 78.1, relOut: -47.2, hIn: 0.283, hOut: 0.688 },
  },
  {
    id: 'Q13', // 稿 (201.4, 4778)；論壇三日期組下緣 4753.02 +25。終點
    // 稿的 201.4 就是議程箭頭欄（768 寬下箭頭在 202.5）→ 改掛箭頭，寬視窗才不會分家。
    // Q13 → S0 是一條直線，兩點同 x ＝ 線垂直穿過議程、核心正好走在箭頭上。
    x: AGENDA_ARROW_X,
    anchor: { event: '論壇三', sel: '.forum-event__meta', edge: 'bottom', dy: 25 },
  },
];

// ── mob（414 稿，Figma 2584:35109）────────────────────────────────────
// 換算流程見 architecture/forum-node-path.md 第九節。稿的內座標寫在每列註解。
const MOB_NODES: ForumPathNode[] = [
  {
    id: 'P0',
    x: 'center',
    // 稿是容器 y=43，這裡刻意歸零（理由同 pad 的 Q0）。
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
    id: 'P3', // 稿 (343.0, 763)；日期／地點組上緣 768.6
    x: 0.829,
    // ⚠️ 2026-08-17 之前掛 `.forum-event__head` 下緣 −6。稿上這條界線是
    //    「標眉＋大標＋副標＋**引言**」整組的下緣（＝日期組上緣 768.6），但實作的
    //    __head 只到副標 —— 引言是 __meta 的子項，不在 __head 裡。於是髮夾彎的頂點
    //    整整高了一個引言區塊（實測 590.7，該落在 818.7），線從副標下方就折回去。
    //    黃金樣本沒抓到：fixture 直接把 __head 的 rect 填成稿的整組值（下緣 768.6），
    //    產生器吃到對的數字、瀏覽器卻是錯的。
    //    改掛日期組上緣後與 P4（掛 __venue 下緣）對稱 —— 一個咬這組的頭、一個咬尾。
    anchor: { event: '論壇一', sel: '.forum-event__date', edge: 'top', dy: -6 },
    join: { relIn: 111.2, relOut: -35.8, hIn: 0.23, hOut: 1.01 }, // 髮夾彎
  },
  {
    id: 'P4', // 稿 (59.0, 1069)；日期／地點組下緣 1073.5
    x: 0.143,
    anchor: { event: '論壇一', sel: '.forum-event__venue', edge: 'bottom', dy: -4 },
    join: { relIn: -55.9, relOut: 42.5, hIn: 0.22, hOut: 0.7 },
  },
  {
    id: 'P5', // 稿 (410.0, 1175)；照片上緣 1073.5
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
    // ⚠ **刻意偏離稿 dy +38 → −312**（撞右牆的位置往上移 350）。理由是下面那一撇：
    //    dy +38 時 P7→P7a 的 chord 幾乎是水平的（171°），而撇是 116.5° —— 線得先橫著
    //    掃 190px 再急轉 55° 才進得去撇，而且那個轉角會讓 P7 的折角從 66° 變成 94°、
    //    越過 90° 門檻多冒一顆轉折音（見 forum-path-turns）。
    //    往上移到「撇的延長線上」之後 P7→P7a→P7b 幾乎共線（chord 116.6° vs 撇 116.5°），
    //    撇就是一條長直線的一部分 —— 這正是 pc／pad 稿的語彙（實測 pc 在撇的前後各有
    //    120／150px 的直線）。折角回到 P7 42°／P7a 0°／P7b 5°，轉折音也回到 5 顆。
    //    −312 ＝ 190.1（撇到右牆的水平距離）× tan(撇的角度) 反推，故三段共線。
    anchor: { sel: '[data-forum-anchor="論壇二"]', edge: 'top', dy: -312 },
    note: '刻意偏離稿 dy +38 → −312：讓 P7→撇→P8 共線（見 P7a）',
    join: 'line',
  },
  // ── 09/15 那一撇（見 SLASH_SEL 那一段）──────────────────────────────
  // ⚠ **刻意偏離 mob 線稿**：稿上這一段是 P7→P8 的一條長直線，撇則是獨立的靜態圖稿
  //   （Figma 2574:87050），兩者在稿上就差 150–200px —— 稿沒有把 mob 的撇當成核心畫的。
  //   實作三個斷點共用 `slash: 'core'`（section2.json 的場次資料，沒有逐斷點），
  //   所以 mob 也會畫，只能讓線去咬撇。要改回「mob 不畫撇」就是把資料改成逐斷點，
  //   那是另一件事（見 architecture/forum-node-path.md 第三節）。
  {
    id: 'P7a', // 撇的右上角；稿寬 414 下 x ≈ 206.6
    x: slashEnterX(0.499),
    anchor: SLASH_ENTER_Y,
    optional: true,
    note: '刻意偏離稿：稿的 mob 線不經過那一撇，這兩點把線拉去咬撇',
    join: 'line', // ⚠ 這一段就是撇本身，必須是直線
  },
  {
    id: 'P7b', // 撇的左下角；稿寬 414 下 x ≈ 158
    x: slashExitX(0.3816),
    anchor: SLASH_EXIT_Y,
    optional: true,
    // 往 P8 只差 5°（實測撇 116.5°、P7b→P8 121.7°）→ 直線接下去，看起來是同一筆
    join: 'line',
  },
  // ⚠ P8～P10 在 2026-08-17 重接過。論壇二的講者組從「標籤列 ＋ 兩張直排卡片」
  //   （稿上緣 3764.5、下緣 4190.5）改成「單人照片左、文字右」（稿上緣 3819.5、高 180），
  //   於是：
  //     ① P10 原本掛 `.forum-event__speaker` 的 **nth: 1** —— 第二位講者不存在了，那是
  //        必要錨點，量不到會讓**整條 mob 線放棄**、橘核心在論壇段整段消失
  //        （與 2026-08-09 那次事故同型，見本檔頭與 forum-node-path.md 第二節）。
  //     ② 標籤已經不在照片上方、而是移進右邊文字欄，P8 掛它已無版面意義。
  //   三點一律改掛 `.forum-event__speakers`（單人時它的 rect ＝ 照片框的 rect），dy 則
  //   重校成稿上原本的頂點。**mob 線稿沒有重畫**，所以 P8／P9 精準落回稿；P10 是
  //   「講者組下緣 +12」，語意不變、絕對位置隨組變矮往上移 191（記在第七節）。
  {
    id: 'P8', // 稿 (107.0, 3786)；論壇二講者組上緣 3819.5 − 33（角落在照片正上方）
    x: 0.259,
    anchor: { event: '論壇二', sel: '.forum-event__speakers', edge: 'top', dy: -33 },
    join: { relIn: -69, relOut: 53.2, hIn: 0.43, hOut: 0.69 },
  },
  {
    id: 'P9', // 稿 (295.3, 3868.9)；講者組上緣 +49（點落在照片裡）
    x: 0.713,
    anchor: { event: '論壇二', sel: '.forum-event__speakers', edge: 'top', dy: 49 },
    join: { relIn: -6.4, relOut: 4.1, hIn: 0.34, hOut: 0.17 },
  },
  {
    id: 'P10', // 稿 (323.5, 4202)＝改版前的講者組下緣 +12；現為 3999.5 + 12
    x: 0.781,
    anchor: { event: '論壇二', sel: '.forum-event__speakers', edge: 'bottom', dy: 12 },
    note: '講者組改單人後比稿高 191（稿 4202 → 4011.5）；語意仍是「講者組下緣 +12」',
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
    id: 'P13', // 稿 (198.5, 5018.5)＝ time 組的 0.744 處。終點：稿的箭頭與最後一段拱不畫
    x: 'center',
    anchor: { event: '論壇三', sel: '.forum-event__meta', edge: 'fraction', t: 0.7439 },
    note: '終點釘中心（稿 198.5，差 8.5px）；稿的箭頭與最後一段拱不畫，線比稿短 93px',
  },
];

// ── pc（1280 稿）─────────────────────────────────────────────────────
// 2026-08-08：pc 前半段從「手貼 Figma 匯出的 d ＋ 整段平移」改成 waypoint，三個斷點自此
// 共用同一套產生器（原本 pc 前半段走 segs 分支、後半段走 waypoint，一個斷點跑兩套機制）。
//
// 抽法與 pad / mob 不同 —— 不必回 Figma：舊的 `FORUM_PATH.pc[*].motion` 本來就是
// scripts/extract-centerline.mjs 抽出來的中心線，直接拿它當來源即可（腳本也因此一併刪除）。
//   1. 解析兩段 motion 的 cubic，剔除弧長 < 2px 的退化段（抽中心線留下的數值雜訊，seg2 有 15 段）
//   2. 轉折點 ＝ cusp（前後段切線夾角 ≥ 25°）∪ 顯著的 y 局部極值（拱的肩點，同 pad 的 Q2）
//   3. 對誤差 > 3px 的段落從弧長中點補一個節點，反覆到全部達標
//   4. 每段擬合成單一 cubic，取 chord 相對的 relIn / relOut / hIn / hOut
//   5. y 對回版面區塊（落在區塊內 → fraction；落在區塊之間的留白 → 最近邊 ＋ dy）
//
// **最大擬合偏差 2.36px**（對照 pad / mob 從稿抽的 1.9–2.5px）。29 個節點裡 21 個用 fraction
// （隨內容伸縮），7 個落在區塊之間的留白只能用 dy（pad 是 14 取 9，比例更高），
// W0 是交棒零跳點、釘 `.sec2__path` 頂端。
//
// ⚠ 容器座標註解是 1440 寬的實測值，只作對照用；實際位置一律由錨點即時量測。
// ⚠ W13 → W14 的 'line' 就是原本 seg1 / seg2 之間那條動態連接段（＝ 09/15 的那一撇）。
//   那一撇的「隨核心畫出」已隨本次改動移除（它在加了後半段 waypoint 之後就沒在跑了），
//   之後要做會改成用 SEQUENCE 的地址表示觸發時機，見 architecture/forum-node-path.md。
const PC_FRONT_NODES: ForumPathNode[] = [
  // ── 論壇一 → 論壇二（原 FORUM_PATH.pc[0]）──
  {
    id: 'W0', // 容器 (640, 2)
    x: 'center',
    anchor: { sel: '.sec2__path', edge: 'top' },
    note: '交棒零跳點：路徑起點必須落在視窗正中央（同 pad Q0 / mob P0）',
    join: 'line',
  },
  {
    id: 'W1', // 容器 (640, 466)
    x: 'center',
    anchor: { event: '論壇一', sel: '.forum-event__title', edge: 'fraction', t: 0.2292 },
    join: { relIn: -32.1, relOut: 31.7, hIn: 0.28, hOut: 0.44 },
  },
  {
    id: 'W2', // 容器 (719, 415)。拱的肩點（同 pad 的 Q2）
    x: 0.562,
    anchor: { event: '論壇一', sel: '.forum-event__tag', edge: 'fraction', t: 0.4866 },
    join: { relIn: -64.4, relOut: 24.7, hIn: 0.14, hOut: 0.7 },
  },
  {
    id: 'W3', // 容器 (930, 888)。髮夾彎（右側頂點）
    x: 0.726,
    anchor: { event: '論壇一', sel: '.forum-event__date', edge: 'top', dy: -80 },
    join: { relIn: 29.3, relOut: -31.9, hIn: 0.34, hOut: 0.38 },
  },
  {
    id: 'W4', // 容器 (839, 830)
    x: 0.656,
    anchor: { event: '論壇一', sel: '.forum-event__date', edge: 'top', dy: -138 },
    join: { relIn: 63.8, relOut: -15.7, hIn: 0.22, hOut: 0.4 },
  },
  {
    id: 'W5', // 容器 (535, 1509)。髮夾彎（左下）—— 稿上這個彎頂**進到照片裡**（碰到講者照）
    x: 0.418,
    // dy 原為 -87：那是照片還被 margin collapse 壓低 102 時量出來的（見 ForumEvent.vue
    // .forum-event__speaker 的說明）。照片歸位後同一個容器 y 對應的 dy ＝ -87 + 102 ＝ 15，
    // 也就是彎頂落在照片上緣下方 15 —— 與稿一致（稿：彎頂 1581.75、照片上緣 1566.9）。
    anchor: { event: '論壇一', sel: '.forum-event__photo, .forum-event__photo-slot', edge: 'top', dy: 15 },
    join: { relIn: 32.7, relOut: -34.9, hIn: 0.34, hOut: 0.38 },
  },
  {
    id: 'W6', // 容器 (434, 1437)
    x: 0.339,
    anchor: { event: '論壇一', sel: '.forum-event__venue', edge: 'bottom', dy: 90 },
    join: { relIn: 69.2, relOut: -13.2, hIn: 0.2, hOut: 0.44 },
  },
  {
    id: 'W7', // 容器 (194, 2155)。補點：原本 W6→W8 一段 chord 1516、偏差 4.82px
    x: 0.152,
    // t 原為 0.5368：同 W5，是講者組還被壓低 102（頂端 1199、高 1042）時的比例。
    // 歸位後頂端 1097、高 1144（下緣 2241 不變），同一個容器 y ⇒ (1758.3-1097)/1144 ＝ 0.5781。
    anchor: { event: '論壇一', sel: '.forum-event__speakers', edge: 'fraction', t: 0.5781 },
    join: { relIn: 3.4, relOut: -3.9, hIn: 0.36, hOut: 0.26 },
  },
  {
    id: 'W8', // 容器 (174, 2935)。撞左牆的硬轉角
    x: 0.136,
    anchor: { event: '論壇二', sel: '.forum-event__tag', edge: 'fraction', t: 0.4375 },
    join: { relIn: -24.3, relOut: 32.7, hIn: 0.38, hOut: 0.36 },
  },
  {
    id: 'W9', // 容器 (469, 2740)
    x: 0.367,
    anchor: { event: '論壇一', sel: '.forum-event__speakers', edge: 'bottom', dy: 102 },
    join: { relIn: -40.5, relOut: 22.9, hIn: 0.4, hOut: 0.32 },
  },
  {
    id: 'W10', // 容器 (868, 3094)。補點：原本 W9→W11 一段 chord 1046、偏差 3.76px
    x: 0.678,
    anchor: { event: '論壇二', sel: '.forum-event__title', edge: 'fraction', t: 0.2115 },
    join: { relIn: -8.7, relOut: 8.4, hIn: 0.34, hOut: 0.34 },
  },
  {
    id: 'W11', // 容器 (1026, 3629)。髮夾彎（右緣）
    x: 0.801,
    anchor: { event: '論壇二', sel: '.forum-event__venue', edge: 'fraction', t: 0.1109 },
    join: { relIn: 31, relOut: -37.1, hIn: 0.34, hOut: 0.4 },
  },
  {
    id: 'W12', // 容器 (902, 3532)
    x: 0.705,
    anchor: { event: '論壇二', sel: '.forum-event__cta', edge: 'fraction', t: 0.9062 },
    join: { relIn: 40, relOut: -20.2, hIn: 0.4, hOut: 0.26 },
  },
  {
    id: 'W13', // 容器 (735, 3680)＝原 seg1 末端
    x: 0.574,
    anchor: { event: '論壇二', sel: '.forum-event__venue', edge: 'fraction', t: 0.3844 },
    note: '到 W14 的直線＝原本 seg1／seg2 之間的動態連接段（09/15 的那一撇）',
    join: 'line',
  },
  // ── 論壇二 → 論壇三（原 FORUM_PATH.pc[1]）──
  {
    id: 'W14', // 容器 (569, 3994)＝原 seg2 起點
    x: 0.444,
    anchor: { event: '論壇二', sel: '.forum-event__date', edge: 'fraction', t: 0.8943 },
    join: 'line',
  },
  {
    id: 'W15', // 容器 (546, 4046)。髮夾彎
    x: 0.426,
    anchor: { event: '論壇二', sel: '.forum-event__date', edge: 'bottom', dy: 13 },
    join: { relIn: 116.9, relOut: -29.7, hIn: 0.06, hOut: 0.52 },
  },
  {
    id: 'W16', // 容器 (438, 3981)
    x: 0.342,
    anchor: { event: '論壇二', sel: '.forum-event__date', edge: 'fraction', t: 0.8569 },
    join: { relIn: 47.3, relOut: -22.8, hIn: 0.18, hOut: 0.6 },
  },
  {
    id: 'W17', // 容器 (212, 4236)。補點：原本 W16→W18 一段 chord 668、偏差 3.02px
    x: 0.165,
    anchor: { event: '論壇二', sel: '.forum-event__photo, .forum-event__photo-slot', edge: 'fraction', t: 0.4674 },
    join: { relIn: 7.5, relOut: -97.6, hIn: 0.5, hOut: 0.02 },
  },
  {
    id: 'W18', // 容器 (152, 4588)。撞左牆
    x: 0.119,
    anchor: { event: '論壇三', sel: '.forum-event__tag', edge: 'top', dy: -37 },
    join: { relIn: -25.5, relOut: 29.9, hIn: 0.38, hOut: 0.36 },
  },
  {
    id: 'W19', // 容器 (306, 4499)
    x: 0.239,
    anchor: { event: '論壇二', sel: '.forum-event__speakers', edge: 'fraction', t: 0.9859 },
    join: { relIn: -43.3, relOut: 23.6, hIn: 0.24, hOut: 0.54 },
  },
  {
    id: 'W20', // 容器 (586, 4774)
    x: 0.458,
    anchor: { event: '論壇三', sel: '.forum-event__title', edge: 'fraction', t: 0.4187 },
    join: { relIn: -20.7, relOut: 27.5, hIn: 0.36, hOut: 0.36 },
  },
  {
    id: 'W21', // 容器 (711, 4707)
    x: 0.556,
    anchor: { event: '論壇三', sel: '.forum-event__title', edge: 'fraction', t: 0.1342 },
    join: { relIn: -49.9, relOut: 26.8, hIn: 0.28, hOut: 0.46 },
  },
  {
    id: 'W22', // 容器 (966, 5018)。髮夾彎（右）
    x: 0.755,
    anchor: { event: '論壇三', sel: '.forum-event__head', edge: 'fraction', t: 0.9051 },
    join: { relIn: 34.1, relOut: -35.3, hIn: 0.36, hOut: 0.42 },
  },
  {
    id: 'W23', // 容器 (906, 4974)
    x: 0.708,
    anchor: { event: '論壇三', sel: '.forum-event__head', edge: 'fraction', t: 0.804 },
    join: { relIn: 49.2, relOut: -27.3, hIn: 0.28, hOut: 0.48 },
  },
  {
    id: 'W24', // 容器 (771, 5134)。髮夾彎
    x: 0.602,
    anchor: { event: '論壇三', sel: '.forum-event__date', edge: 'fraction', t: 0.4114 },
    join: { relIn: 28.9, relOut: -32, hIn: 0.34, hOut: 0.42 },
  },
  {
    id: 'W25', // 容器 (707, 5093)
    x: 0.552,
    anchor: { event: '論壇三', sel: '.forum-event__date', edge: 'fraction', t: 0.2331 },
    join: { relIn: 57.7, relOut: -22.6, hIn: 0.22, hOut: 0.56 },
  },
  {
    id: 'W26', // 容器 (512, 5417)。髮夾彎
    x: 0.4,
    anchor: { event: '論壇三', sel: '.forum-event__venue', edge: 'fraction', t: 0.9879 },
    join: { relIn: 27.1, relOut: -37.5, hIn: 0.42, hOut: 0.34 },
  },
  {
    id: 'W27', // 容器 (412, 5338)
    x: 0.322,
    anchor: { event: '論壇三', sel: '.forum-event__venue', edge: 'fraction', t: 0.4223 },
    join: { relIn: 35.8, relOut: -31, hIn: 0.44, hOut: 0.3 },
  },
  {
    id: 'W28', // 容器 (327, 5400)＝前半段終點，其後接 PC_TAIL_NODES
    x: 0.256,
    anchor: { event: '論壇三', sel: '.forum-event__venue', edge: 'fraction', t: 0.8678 },
    join: 'line',
  },
];

// ── 後半段（議程之後：論壇四 ＋ 精彩活動）────────────────────────────
// ⚠ 這三條線在 Figma 上是**頁面層的孤兒 vector**（pc 2584:35143、pad 2679:90235、
//   mob 2584:35141），沒有 artboard 座標可對 —— **稿只給形狀、不給位置**。
//   所以「哪個頂點掛哪個區塊」是我們決定的，不是量出來的；請用編號協定微調
//   （見 architecture/forum-node-path.md 第六節）。
//
// 決定位置的兩條原則：
//   1. 橫向：垂直進場點接在**前半段末端的 x** 上，核心才連得起來。套下去三個斷點的
//      線都剛好落在內容欄內（pc 265–1051 / 內容 108–1172；pad 86–679 / 80–688；
//      mob 70–382 / 26–389）。其餘各點按線稿的相對 x 換算成容器寬比例。
//   2. 縱向：把線稿頂點的相對高度對到後半段的區塊邊界（議程底 → 論壇四 → 精彩活動）。
//
// 形狀不變量（relIn/relOut/hIn/hOut）則是**從稿抽的**，誤差 1.9–2.5px ——
// 那個 ~2px 是中心線與 outline 單側的固定偏移，不是模型誤差（同前半段 mob）。
//
// 精彩活動可被 ?highlights=1 關掉 → 掛在它身上的點標 optional，關掉時整條會自己重接。
const AGENDA_END: ForumPathAnchor = { sel: '.agenda', edge: 'bottom' };
/** 接縫：`.sec2` 與 `.section3` 的交界。
 *  錨在零高度的 `.sec2__seam` 而非 `.sec2__pin` —— 後者是 sticky（覆蓋過場要定住 forum
 *  最後一屏），量測若發生在 sticky 已 engage 時會拿到位移後的 rect，整條線靜默歪掉。
 *  `.sec2__seam` 在 `.sec2__pin` 之後、spacer 之前，位置恆等於 `.sec2__pin` 的自然下緣。
 *  見 architecture/2026-08-12-forum-blessing-transition-design.md 第八節。 */
const SEAM_END: ForumPathAnchor = { sel: '.sec2__seam', edge: 'top' };
/** 精彩活動的第二則（關掉時不存在 → optional） */
const HL_ITEM: ForumPathAnchor = { sel: '.highlights__item', nth: 1, edge: 'top' };

const PC_TAIL_NODES: ForumPathNode[] = [
  { id: 'R0', x: 0.256, anchor: AGENDA_END, join: 'line' },
  { id: 'R1', x: 0.256, anchor: { event: '論壇四', sel: '.forum-event__tag', edge: 'top' },
    join: { relIn: -35.2, relOut: 27, hIn: 0.13, hOut: 0.54 } },
  { id: 'R2', x: 0.59, anchor: { event: '論壇四', sel: '.forum-event__tag', edge: 'top', dy: -110 },
    join: { relIn: -50.8, relOut: 47.2, hIn: 0.4, hOut: 0.44 } },
  { id: 'R3', x: 0.794, anchor: { event: '論壇四', sel: '.forum-event__cta', edge: 'top' },
    join: { relIn: -25.3, relOut: -5.8, hIn: 0.39, hOut: 0.29 } },
  { id: 'R4', x: 0.349, anchor: { event: '論壇四', sel: '.forum-event__speakers', edge: 'top', dy: 140 },
    join: { relIn: 31.2, relOut: -21.6, hIn: 0.27, hOut: 0.45 } },
  { id: 'R5', x: 0.23, anchor: HL_ITEM, optional: true,
    join: { relIn: -8, relOut: 20.7, hIn: 0.53, hOut: 0.22 } },
  // x 對齊「逐格臉的第 01 格」—— 白方塊就從飛機沒入的位置長出來（FACE_FRAMES[0] =
  // [7,0,2,2]，網格 x 7..9 of 16 → 那一格水平居中於臉框）。
  // pc：臉框中心 ＝ 視窗中心 − 343.5（內容塊 280 + gap 180 + intro 507 置中於視窗），
  // 而 .forum-path 是 1280 置中 → 296.5 / 1280 ＝ 0.2316，**與視窗寬無關**。
  { id: 'R6', x: 0.2316, anchor: SEAM_END },
];

const PAD_TAIL_NODES: ForumPathNode[] = [
  // Q13 → S0 → S1 三點同 x：線從論壇三垂直穿過議程、續行到論壇四。
  // 三個都掛箭頭欄，那條垂直線才會整段落在箭頭上（只改中間一點會變成斜線）。
  { id: 'S0', x: AGENDA_ARROW_X, anchor: AGENDA_END, join: 'line' },
  { id: 'S1', x: AGENDA_ARROW_X, anchor: { event: '論壇四', sel: '.forum-event__tag', edge: 'top' },
    join: { relIn: -46, relOut: 38.9, hIn: 0.2, hOut: 0.6 } },
  { id: 'S2', x: 0.764, anchor: { event: '論壇四', sel: '.forum-event__tag', edge: 'top', dy: -3 },
    join: { relIn: -68.5, relOut: 31.8, hIn: 0.39, hOut: 0.38 } },
  { id: 'S3', x: 0.461, anchor: { event: '論壇四', sel: '.forum-event__cta', edge: 'top' },
    join: { relIn: 48.3, relOut: -55.4, hIn: 0.33, hOut: 0.51 } },
  { id: 'S4', x: 0.401, anchor: { event: '論壇四', sel: '.forum-event__speakers', edge: 'top', dy: 120 },
    join: { relIn: -44.8, relOut: 52.3, hIn: 0.43, hOut: 0.4 } },
  { id: 'S5', x: 0.593, anchor: HL_ITEM, optional: true,
    join: { relIn: 40.4, relOut: -6.1, hIn: 0.46, hOut: 0.38 } },
  // pad 的臉框水平置中於視窗，而第 01 格居中於臉框 → 就是視窗中心（見 R6 的註解）。
  { id: 'S6', x: 'center', anchor: SEAM_END },
];

const MOB_TAIL_NODES: ForumPathNode[] = [
  { id: 'T0', x: 'center', anchor: AGENDA_END, join: 'line' },
  { id: 'T1', x: 'center', anchor: { event: '論壇四', sel: '.forum-event__tag', edge: 'top' },
    join: { relIn: -42.6, relOut: 54.4, hIn: 0.59, hOut: 0.21 } },
  { id: 'T2', x: 0.814, anchor: { event: '論壇四', sel: '.forum-event__tag', edge: 'top', dy: -59 },
    join: { relIn: -72, relOut: 43.3, hIn: 0.41, hOut: 0.39 } },
  { id: 'T3', x: 0.655, anchor: { event: '論壇四', sel: '.forum-event__body', edge: 'top' },
    join: { relIn: 44.1, relOut: -37.3, hIn: 0.25, hOut: 0.51 } },
  { id: 'T4', x: 0.337, anchor: { event: '論壇四', sel: '.forum-event__speakers', edge: 'top' },
    join: { relIn: -6.2, relOut: 29.6, hIn: 0.36, hOut: 0.48 } },
  { id: 'T5', x: 0.772, anchor: { event: '論壇四', sel: '.forum-event__speakers', edge: 'bottom' },
    join: { relIn: 9.3, relOut: -33.3, hIn: 0.29, hOut: 0.49 } },
  { id: 'T6', x: 0.413, anchor: HL_ITEM, optional: true,
    join: { relIn: -24, relOut: 4.9, hIn: 0.64, hOut: 0.22 } },
  // 同 S6。⚠️ mob 的末節點是 T7，T6 是精彩活動那一點。
  { id: 'T7', x: 'center', anchor: SEAM_END },
];

/**
 * 以斷點為 key。三個斷點都是「前半段 ＋ 後半段」一整條 —— 接在同一個陣列裡，
 * 中間那段直線（論壇三 → 議程底）正好就是原本的隱形尾段，故不必再 appendTail。
 * 2026-08-08 起 pc 也在此（原本前半段走 FORUM_PATH.pc 的手貼線稿，已移除）。
 */
export const FORUM_PATH_NODES: Record<'pc' | 'pad' | 'mob', ForumPathNode[]> = {
  pc: [...PC_FRONT_NODES, ...PC_TAIL_NODES],
  pad: [...PAD_NODES, ...PAD_TAIL_NODES],
  mob: [...MOB_NODES, ...MOB_TAIL_NODES],
};

/**
 * 只有前半段 —— **黃金樣本測試用**。
 * 前半段對得到設計稿（線是 artboard 的子節點，每個頂點都能驗），後半段對不到
 * （孤兒 vector，位置是我們決定的），兩者不能放在同一組斷言裡。
 */
export const FORUM_FRONT_NODES: Record<'pc' | 'pad' | 'mob', ForumPathNode[]> = {
  pc: PC_FRONT_NODES,
  pad: PAD_NODES,
  mob: MOB_NODES,
};

// ── 產生器 ────────────────────────────────────────────────────────────
const RAD = Math.PI / 180;
const r2 = (v: number) => Math.round(v * 100) / 100;

function resolveX(
  x: ForumPathX,
  w: number,
  amplitude: number,
  measure: ForumPathMeasure
): number {
  // 掛在 element 上：直接回量到的值，**不過 amplitude** ——
  // 這種點的存在意義就是咬住那個 element，往中心收就等於沒咬住。
  if (typeof x === 'object') {
    const m = measure(x);
    if (m) {
      const dx = x.dx ?? 0;
      if (x.edge === 'left') return m.left + dx;
      if (x.edge === 'right') return m.left + m.width + dx;
      return m.left + m.width / 2 + dx; // center
    }
    return resolveX(x.fallback, w, amplitude, measure);
  }
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

/** 角度正規化到 (−180, 180] */
const normDeg = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

/**
 * 楔形夾角保護：把一條切線夾進「相鄰段落容許的角度範圍」內，避免相鄰兩段相交。
 *
 * 為什麼需要：形狀參數（relIn / relOut）是**相對 chord** 的極座標，那是個相似變換模型，
 * 只有等比縮放才保形。但節點的 x 是容器寬的比例、y 是量出來的 —— **兩軸各自縮放**，
 * 而且 y 還會被文字換行改變。於是相鄰兩段各自旋轉不同的角度，原本安全的切線就會
 * 掃過鄰段而相交（實測 mob：稿寬 414 安全，600 寬時 P8 的離開切線越界 30°，畫面上成圈）。
 *
 * 判準（以節點 B、前一點 A、chord B→C 為例）：
 *   spread ＝ 射線 B→A 相對 chord 的夾角。
 *   離開切線若**往 A 的方向轉、且轉過 spread**，就必定切過 A→B 那一段。
 *   故同號時把 |rel| 夾到 |spread| × SAFETY。反向轉（異號）遠離鄰段，不必夾。
 *
 * 代價：極端版面下那個彎會變平一點（往 chord 靠），但不會相交。
 * 稿寬附近完全不作用 —— 三個斷點在自己的稿寬下都有足夠餘裕。
 */
const WEDGE_SAFETY = 0.85;

function clampToWedge(
  rel: number,
  chord: number,
  at: [number, number],
  neighbour: [number, number] | undefined
): number {
  if (!neighbour) return rel; // 首尾沒有鄰段可撞
  const toNeighbour = Math.atan2(neighbour[1] - at[1], neighbour[0] - at[0]) / RAD;
  const spread = normDeg(toNeighbour - chord);
  // 異號 ＝ 往鄰段的反方向轉，不會撞
  if (rel === 0 || spread === 0 || Math.sign(rel) !== Math.sign(spread)) return rel;
  const limit = Math.abs(spread) * WEDGE_SAFETY;
  return Math.abs(rel) <= limit ? rel : Math.sign(rel) * limit;
}

function resolveY(a: ForumPathAnchor, m: { top: number; height: number }): number {
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
 * ⚠ 必要錨點量不到就整條放棄（回 null），**不跳過那個點** ——
 *   跳過會讓後面所有點接到錯的鄰居身上，線靜默變形。完整規則與事故見
 *   architecture/forum-node-path.md 第二節。
 *
 * 標了 optional 的點是例外：那是「可能整塊不存在」的區域（例如 ?highlights 關掉時
 * 的精彩活動）。量不到就跳過，由前一個存活點直接連到下一個存活點；因為角度是
 * chord 相對的，chord 變長時彎會自然拉開、不變形。
 */
export function buildNodePathD(
  nodes: ForumPathNode[],
  ctx: { width: number; measure: ForumPathMeasure; amplitude?: number }
): {
  d: string;
  endY: number;
  points: Map<string, [number, number]>;
  /**
   * 每個存活節點的 `d` 片段（segs[0] 是那個 `M`，其後每一段都終止於對應節點）。
   * 不變量：`segs.map(s => s.d).join('') === d` 且 `segs.length === 存活節點數`。
   *
   * 用途：ForumCorePath 用量尺 path 逐段累加 getTotalLength()，算出**每個節點在驅動線上
   * 的弧長** —— 路徑事件的門檻由此推導（見 forum-path-events 與
   * architecture/2026-08-12-forum-path-events-design.md 第三節）。
   * ⚠ 這兩條不變量由 test/forum-node-path.spec.ts 守著：破掉會靜默錯開**所有**事件。
   */
  segs: { id: string; d: string }[];
} | null {
  const { width, measure, amplitude = 1 } = ctx;

  // 先過濾出「存活的點」：optional 且量不到 → 跳過；必要點量不到 → 整條放棄。
  const live: { node: ForumPathNode; pt: [number, number] }[] = [];
  for (const n of nodes) {
    const m = measure(n.anchor);
    if (!m) {
      if (n.optional) continue;
      console.warn(`[forum-node-path] 必要錨點量不到，整條線放棄：node="${n.id}" sel="${n.anchor.sel}"`);
      return null;
    }
    live.push({
      node: n,
      pt: [resolveX(n.x, width, amplitude, measure), resolveY(n.anchor, m)],
    });
  }
  if (live.length < 2) return null;

  // 逐節點累積 d 片段而非直接串成一個字串：下游要靠「到第 n 個節點為止的子路徑」量弧長。
  // 串起來與舊寫法逐字元相同（黃金樣本因此不動）。
  const segs: { id: string; d: string }[] = [
    { id: live[0]!.node.id, d: `M${r2(live[0]!.pt[0])} ${r2(live[0]!.pt[1])}` },
  ];
  for (let i = 0; i < live.length - 1; i++) {
    const [x0, y0] = live[i]!.pt;
    const [x1, y1] = live[i + 1]!.pt;
    const join = live[i]!.node.join ?? 'line';
    const id = live[i + 1]!.node.id;
    if (join === 'line') {
      segs.push({ id, d: `L${r2(x1)} ${r2(y1)}` });
      continue;
    }
    const len = Math.hypot(x1 - x0, y1 - y0);
    const chord = Math.atan2(y1 - y0, x1 - x0) / RAD;

    // 楔形夾角保護：把切線夾進「相鄰兩條 chord 圍出的角度範圍」內，見 clampToWedge。
    // 出發側看前一點、到達側看後一點；沒有鄰居（首尾）就不夾。
    const prev = live[i - 1]?.pt;
    const after = live[i + 2]?.pt;
    const relIn = clampToWedge(join.relIn, chord, [x0, y0], prev);
    const relOut = clampToWedge(join.relOut, chord, [x1, y1], after);

    const aIn = (chord + relIn) * RAD;
    const aOut = (chord + relOut) * RAD;
    const c1x = x0 + join.hIn * len * Math.cos(aIn);
    const c1y = y0 + join.hIn * len * Math.sin(aIn);
    const c2x = x1 - join.hOut * len * Math.cos(aOut);
    const c2y = y1 - join.hOut * len * Math.sin(aOut);
    segs.push({
      id,
      d: `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(x1)} ${r2(y1)}`,
    });
  }

  // endY 與 d 用同一個捨入值：ScrollTrigger 的 end 與線的末端必須指同一個點。
  // points 給下游依節點 id 反查座標用（紙飛機的變身點）—— 不含被跳過的 optional 節點。
  const points = new Map<string, [number, number]>(
    live.map((l) => [l.node.id, l.pt] as const),
  );
  return {
    d: segs.map((s) => s.d).join(''),
    endY: r2(live[live.length - 1]!.pt[1]!),
    points,
    segs,
  };
}
