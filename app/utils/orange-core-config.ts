// orange core 連動序列的「設定台」（hero → forum，未來可往後續 section 延伸）。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useOrangeCoreProgress 與各 hero/forum 元件共用同一份。
// 這裡集中「序列骨幹」：時間軸門檻、pin/移動距離、core 形變、星空遮罩尺寸（從 core 推導）、路徑幾何。
// 刻意「不含」子元件自身外觀參數：HeroLoader（方塊/顏色）、SymbolFace（粒子物理/取樣/配色）——那些留在各元件。
//
// 延伸做法：orange core 走到後續 section 時，在此新增該段的 *_STOPS / *_VH / 幾何，
// 再於 useOrangeCoreProgress 加一條對應的 progress 軌 + resolver（照 path/pin/symbol 模式）。

// ── stage 門檻：要調時間點，改這裡 ──────────────────────────────────
// 單一 progress 軌（path，0..1；OrangeCorePath scrub 寫入）解出「目前 stage」
// ＋該 stage 內 local progress（stageProgress）。
// 🚧 舊的 stage 4–6（pin 軌：橘→黑變色 → 星空斜角撐大 → 蓋滿）已隨 date 段與 pinST 一併移除
//    （新稿無此動作）。新稿的後續 checkpoint（引言 → 人臉 → 論壇 path）待定案後在此新增。
export const STAGE_STOPS = [
  { until: 0.41, stage: 1 },
  { until: 0.71, stage: 2 },
  { until: 1.0, stage: 3 },
] as const;

// ── core 移動「速度曲線」（stage 1–3 沿 path 移動時套用）──────────────
// scrub 本身等速綁定捲動；此 ease 重新分配「捲動 → path 進度」的節奏（不改整體距離）。
// GSAP ease 名稱：'none' 等速 / 'power2.in' 慢起快收 / 'power2.out' 快起慢收 / 'power2.inOut' 兩端慢中間快。
// 註：ease 同時作用於「定位」與「stage 判定」，故 stage 門檻仍對齊路徑幾何位置（不會錯位）。
export const MOVE_EASE = 'none';

// ── 引言文字淡出：core 接近視窗中央時，引言整段淡出讓位給轉場 ─────────────
// path 進度到此門檻開始淡出，p=1（core 抵達視窗中央）時完全消失。
export const INTRO_FADE_FROM = 0.7;

// ── hero → SymbolScene 轉場（設計稿標註「綁滾動」＝ 全程 scrub，非定時動畫）──
// core 停在視窗正中央後，由 Hero 的 transition pin scrub 驅動「兩段軸向放大」：
//   0 → growY ：上下拉長到滿高（同時 橘 → 深色），左右維持原寬
//   growY → 1 ：左右展開到滿寬 → 蓋滿視窗，交棒給 <SymbolScene>
// 對應設計分鏡 2065:143082（引言轉場論壇）。
export const TRANSITION_VH = 1.2; // pin 吃掉的捲動距離（× 視窗高）＝ 轉場快慢旋鈕
export const SYMBOL_TRANSITION = {
  growY: 0.55, // 上下拉長段的終點（其後為左右展開段）
  colorSpan: 0.35, // 橘→深色在「拉長段」的前這個比例內完成
  faceIn: 0.5, // <SymbolFace> 粒子場在「展開段」的前這個比例內淡入（分鏡 ⑤ 展開中已見粒子）
  // 深色目標：必須等於 SymbolFace 的 bgColor，否則粒子場淡入時會有色階跳動。
  dark: [0, 0, 0] as [number, number, number],
};

// 註：以下常數已於 2026-08-03 隨 date 段 / pinST / 星空斜角轉場一併移除，需要時從 git 取回：
//   MOVE_VH   — 在 date 之前墊 vh spacer 拉長 scrub 距離＝相對速度旋鈕（見 .claude/memory/scroll-speed-knob.md）
//   PIN_VH    — pin 釘住距離（Hero pinST 與 OrangeCorePath 的 end 共用同一值）
//   CROSSFADE — stage 5 星空淡入所占比例（避免大片半透明星空透出白底而 washy）
//   TRANSITION— 星空遮罩起點尺寸（由 CORE.dotSize × lineScaleX 推導，永遠對齊那條 core 線）

// ── forum 接棒門檻：converge 之後「白點 → 橘核心」的 crossfade（symbolProgress 0..1）──
// coreIn ：SymbolFace 收斂點淡出、同時 ForumCore 橘方塊淡入（crossfade）。＝ converge 段終點，
//          也是 enter 段的起點。
// coreOut：橘核心淡出 → 露出下方議程。coreIn~coreOut 之間橘核心停在黑畫面（原地停住）。
// 淡出入為「固定時間」（見 ForumCore 的 CSS transition）；停留長度＝(coreOut−coreIn) 這段 scrub 捲動距離。
// 往回捲會自動倒退（boolean 觸發的 CSS 轉場可逆）。此處只做 handoff；橘核心接手後的「移動」動態待後續。
export const FORUM_HANDOFF = {
  coreIn: 0.75,
  coreOut: 0.9,
} as const;

// ── 星空 SymbolFace 序列（獨立黑底段落自己的捲動尺，見 01a.symbol/SymbolScene.vue）──
// 該段落的捲動進度（symbolProgress, 0..1）依門檻切換 SymbolFace 的 mode。
// 因為 scrub，往回捲會自動倒退。狀態：disperse → face（集合）→ converge（匯聚成點）
// → enter（收斂點淡出，交棒給 ForumCore 橘核心，見 FORUM_HANDOFF）。
// 只改 until 即可調每個狀態起點；converge 終點對齊 FORUM_HANDOFF.coreIn（＝交棒時機）。
// ⚠️ 改這裡（或 FORUM_HANDOFF / SYMBOL_VH）之後，要同步 SymbolScene.vue 內的「symbolProgress
//    時序表」註解 —— 那張表是本檔門檻 × SYMBOL_VH 的 vh 換算結果，不會自己更新。
export const SYMBOL_STOPS: readonly {
  until: number;
  mode: 'disperse' | 'face' | 'converge' | 'enter';
}[] = [
  { until: 0.15, mode: 'disperse' }, //                0.00–0.15 分散（預設）
  { until: 0.58, mode: 'face' }, //                    0.15–0.58 集合（人像）＝最長的一拍
  { until: FORUM_HANDOFF.coreIn, mode: 'converge' }, // 0.58–coreIn 匯聚成點
  { until: 1.0, mode: 'enter' }, //                    coreIn–1.00 enter → 收斂點淡出、橘核心接棒
];

// 這段序列吃掉的捲動距離（× 視窗高）＝ 速度旋鈕（越大每個狀態停留越久）。
// 2026-08-04：1.6 → 3.2（整段距離拉長一倍），讓 disperse / face / converge 各拍都有更長的停留。
// 門檻（SYMBOL_STOPS / FORUM_HANDOFF）是比例值，故各拍的相對節奏不變、只是全部等比變慢。
export const SYMBOL_VH = 3.2;

// ── core dot 外觀 ────────────────────────────────────────────────────
// dotSize：dot 邊長（px），亦為 HeroSymbolTransition 讀不到 core 時的退回尺寸。
// 🚧 設計稿為 26px、此處仍為 24px（OrangeCore / ForumCore 的 SCSS 亦寫死 24）—— 尺寸對稿待辦。
export const CORE = {
  dotSize: 24,
  orange: [255, 127, 0] as [number, number, number],
};

// 註：原有 PATH（桌機設計中心線幾何：stub 垂直段 + C/L 曲線片段 + 相對 date 大標左上角的
// anchorOffset）已隨 date 段移除。新稿 hero 段的路徑是「第一屏中央 → 視窗正中央」的垂直線，
// 幾何直接由 section 量測推導、不需常數（見 OrangeCorePath.vue 的 build()）。

// ── 論壇段路徑（可見設計線 ＋ 驅動線）────────────────────────────────
// 可見線：Figma 匯出的 outline 填色 svg，直接貼在 ForumCorePath.vue 的 template。
// 驅動線 motion：由 temp/extract-centerline.mjs 從可見線抽出的中心線（同一 viewBox 座標系）。
//   🚧（規劃）兩段之間的空隙預計由執行時算出的直線連接段補上 → 串成單一連續 path、一個
//   tween；這個 scrub 引擎本身尚未實作。
// 以斷點為 key：pad / mob 的設計線尚未提供，陣列留空。但目前 ForumCorePath.vue 的
// segs() 是寫死只回傳 .pc，尚未依斷點切換 —— 之後補上 pad / mob 線稿時，
// 除了填這裡的陣列，也要同步把 segs() 改成依斷點判斷，否則填了也不會生效。
export type ForumPathSeg = {
  /** 匯出 svg 的 viewBox 尺寸（寬／高） */
  w: number;
  h: number;
  /** 錨點：日期大字上 data-forum-anchor 的值（＝場次名 event.no），不是文件順序索引 */
  anchor: string;
  /** svg 左上角相對該錨點元素左上角的位移（px，瀏覽器實測 ＋ 幾何推導校正後的最終值） */
  offset: { x: number; y: number };
  /** 抽出的中心線 d（驅動用） */
  motion: string;
};

export const FORUM_PATH: Record<'pc' | 'pad' | 'mob', ForumPathSeg[]> = {
  pc: [
    {
      w: 861,
      h: 3696,
      anchor: '論壇一',
      // stub 對齊容器水平中心（核心從上一段交棒下來的落點）：容器固定 1280 置中，中心恒為
      // 640；stub 在 svg 座標 x=473，兩者差即 left，再扣掉錨點 x 才是 offset.x。
      // top 從 section 最頂端（黑白接縫）進場：可見線頂端在 svg y=0，故 offset.y 就是錨點 y 的負值。
      // ⚠ 這條規則只釘住起點：主標行數或論壇一日期版位一變，錨點 y 就變，這個值必須重算
      //   （2026-08-04 因版位調整由 −1034 → −828，再因段落留白改掛 .sec2__path → −968）。
      //   細節見 architecture/forum-core-path.md。
      offset: { x: 59, y: -968 },
      motion:
        'M473.07 2L473.07 466C483.06 444.37 502.41 427.29 526.24 419.83C550.11 412.36 578.33 414.58 606.57 434C660.69 464.39 699.9 525.79 725.85 605.25C751.81 684.76 764.57 782.61 762.57 888C750.46 864.81 727.41 842.27 697.76 833.77C668.23 825.3 631.92 830.7 593.57 861.5C564.79 889.26 537.25 929.69 512.45 978.97C487.66 1028.22 465.68 1086.19 446.67 1147.41C408.65 1269.84 382.55 1405.09 367.57 1509C356.85 1480.96 333.08 1456.19 304.17 1444.48C275.32 1432.79 241.48 1434.15 211.07 1456C187.62 1477.4 165.51 1510.29 145.82 1553.51C126.15 1596.71 108.97 1650.05 94.02 1710.62C64.13 1831.75 43.22 1981.56 29.13 2136.38C0.95 2446.02 0.08 2775.42 7.07 2935C88.9 2803.51 187.34 2748.24 281.8 2741.21C376.19 2734.19 466.22 2775.36 531.57 2838.5C589.48 2889.31 657.61 2994.1 718.47 3132.26C779.35 3270.47 833.02 3442.27 858.57 3629C837.86 3573.67 783.13 3520.28 710.57 3535.5C638.61 3554.69 600.47 3619.72 568.07 3679.88',
    },
    {
      w: 818,
      h: 1444,
      anchor: '論壇二',
      // 起點對設計稿指定位置：線的起點（svg 座標 418.78, 13.69）要落在容器座標 (569, 3854)
      // ——「15」左側、垂直約在其下半部，即設計稿上核心化為那一撇的落點。
      // 反推：left = 569 − 418.78 = 150.2、top = 3854 − 13.69 = 3840.3，再各自扣掉錨點
      // （第 2 場日期大字，容器座標 301, 3526.6）即為下面兩個值。
      offset: { x: -151, y: 314 },
      motion:
        'M418.78 13.69L395.78 65.69C397.48 64.64 397.48 64.64 397.48 64.63C397.48 64.63 397.48 64.63 397.47 64.63C397.47 64.62 397.46 64.61 397.46 64.6C397.44 64.58 397.43 64.55 397.4 64.52C397.35 64.44 397.28 64.33 397.19 64.19C397 63.9 396.73 63.48 396.37 62.94C395.64 61.87 394.57 60.33 393.15 58.42C390.32 54.62 386.11 49.36 380.61 43.56C369.63 31.96 353.43 18.09 332.63 9.17C311.79 0.23 286.37 -3.73 257.07 4.49C227.81 12.71 194.85 33.03 160.28 73.69C86.64 151.04 47.07 284.92 25.5 398.76C14.71 455.74 8.4 507.82 4.8 545.65C2.99 564.57 1.86 579.93 1.19 590.56C0.85 595.88 0.62 600.01 0.48 602.82C0.41 604.22 0.36 605.29 0.33 606.02C0.31 606.38 0.3 606.65 0.29 606.84C0.29 606.93 0.29 607 0.28 607.04C0.28 607.07 0.28 607.09 0.28 607.1C0.28 607.1 0.28 607.11 0.28 607.11C0.28 607.11 0.28 607.12 2.28 607.19C52.78 532.69 130.38 501.29 210.54 527.34C290.85 553.46 374.27 637.44 435.78 793.19C470.46 753.13 507.4 731.94 544.84 727.13C582.29 722.32 620.54 733.86 656.33 758.59C727.96 808.08 789.38 910.16 815.78 1037.19C808.41 1015.81 793.79 1002.4 776.31 996.61C758.84 990.82 738.76 992.71 718.73 1002.26C678.7 1021.36 638.67 1071.11 620.78 1153.19C607.19 1127.68 585.8 1114.15 561.52 1112.66C537.3 1111.19 510.56 1121.71 484.52 1144.56C432.46 1190.25 382.59 1285.67 361.78 1436.69C337.82 1383.11 300.08 1358.56 263.85 1357.53C227.64 1356.49 193.58 1379 177.16 1419.87',
    },
  ],
  pad: [],
  mob: [],
};

// ── 永續祝福（Section 3）逐格像素臉序列 ──────────────────────────────
// 對應 Figma「永續祝福01–03」（pc `2065:140462` 為第三張）：三張成稿的標題與內文完全相同、
// 只有臉不同 → 實作為一段捲動尺 ＋ 一張 sticky 畫面，臉的格號隨捲動走完 17 格。
//
// BLESSING_VH  ：這段序列**實際吃掉的捲動距離**（× 視窗高）＝ 速度旋鈕。
//                pc 稿三張橫幅共 3×420 = 1260px ≈ 1.17 個 1080 視窗高，取 1.2。
//                ⚠️ 注意：捲動尺的「高度」不等於這個值。尺內的 sticky 畫面本身佔掉 100vh，
//                sticky 只會黏住「尺高 − 100vh」的距離，所以尺高必須是 (1 + BLESSING_VH) × 100vh，
//                動畫距離才會等於 BLESSING_VH × 100vh。見 Blessing.vue 的 faceTrackHeight。
// BLESSING_HOLD：捲動尺尾端「停在最後一格」的比例。臉畫完後定住一下再交棒給夥伴清單。
export const BLESSING_VH = 1.2;
export const BLESSING_HOLD = 0.15;
