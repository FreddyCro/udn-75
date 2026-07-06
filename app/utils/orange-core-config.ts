// orange core 連動序列的「設定台」（hero → forum，未來可往後續 section 延伸）。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useOrangeCoreProgress 與各 hero/forum 元件共用同一份。
// 這裡集中「序列骨幹」：時間軸門檻、pin/移動距離、core 形變、星空遮罩尺寸（從 core 推導）、路徑幾何。
// 刻意「不含」子元件自身外觀參數：HeroLoader（方塊/顏色）、SymbolFace（粒子物理/取樣/配色）——那些留在各元件。
//
// 延伸做法：orange core 走到後續 section 時，在此新增該段的 *_STOPS / *_VH / 幾何，
// 再於 useOrangeCoreProgress 加一條對應的 progress 軌 + resolver（照 path/pin/symbol 模式）。

// ── stage 門檻：要調時間點，改這裡 ──────────────────────────────────
// 兩條 progress 軌（各 0..1）合成「目前 stage」＋該 stage 內 local progress（stageProgress）：
//   path：core 沿驅動線移動（OrangeCorePath scrub）→ stage 1–3。
//   pin ：inner 釘住後（長度＝PIN_VH）→ stage 4–6。
export const STAGE_STOPS = {
  // stage 1–3：沿 core 移動路徑（path scrub，progress 0..1）
  path: [
    { until: 0.41, stage: 1 }, // 1 引段（單純往下）
    { until: 0.71, stage: 2 }, // 2 曲線
    { until: 1.0, stage: 3 }, // 3 直線尾段 ＋ 變長
  ],
  // stage 4–6：pin 內（pin scrub，progress 0..1）
  pin: [
    { until: 0.25, stage: 4 }, // 4 變色（橘→黑）
    { until: 0.9, stage: 5 }, // 5 星空放大（HeroForumTransition 接手）
    { until: 1.0, stage: 6 }, // 6 end：fixed 成 section 2 底
  ],
} as const;

// ── core 移動「速度曲線」（stage 1–3 沿 path 移動時套用）──────────────
// scrub 本身等速綁定捲動；此 ease 重新分配「捲動 → path 進度」的節奏（不改整體距離）。
// GSAP ease 名稱：'none' 等速 / 'power2.in' 慢起快收 / 'power2.out' 快起慢收 / 'power2.inOut' 兩端慢中間快。
// 註：ease 同時作用於「定位」與「stage 判定」，故 stage 門檻仍對齊路徑幾何位置（不會錯位）。
export const MOVE_EASE = 'none';

// ── pin 釘住距離（× 視窗高）：stage 4–6 ─────────────────────────────
// core 停在斜槓後，變色 → 星空放大 → fixed 都在這段內完成。
//   - Hero.vue 的 pinST：end = `+=${innerHeight * PIN_VH}`（釘住多久）。
//   - OrangeCorePath 的 path scrub：end = `bottom bottom-=${innerHeight * PIN_VH}`（尾端扣掉同量，core 剛好在 pin 起點到斜槓）。
// 兩處共用此值 → 必須一致，否則 core 會在 pin 期間繼續移動、脫離斜槓。
export const PIN_VH = 0.3;

// ── core 移動「捲動距離」（× 視窗高）＝ 相對視窗的速度旋鈕 ───────────────
// 在 date 之前由 Hero.vue 墊出這麼多額外捲動距離：core 走同一條路徑要捲越多 → 移動越慢。
//   0 = 目前速度（不額外墊）；1 = 多墊 100vh（明顯變慢）；越大越慢。與 PIN_VH / MOVE_EASE 互相獨立。
export const MOVE_VH = 0;

// ── stage 5：星空淡入的「時間長度」（占 stage 5 的比例，0..1）────────────
// 星空 clip 一開始就長得很快。若同時慢慢淡入 opacity，大片半透明星空會透出 hero 白底 → 灰灰 washy。
//   0   = 立即實色：從 core 線尺寸直接以不透明星空揭開再長大 → 完全無 washy（最乾淨，預設）。
//   0.x = 在 stage 5 前 x 比例內淡入完成；越大越 washy、core 溶入感越強。1 = 整段都在淡入。
// Core.vue 的 dot 淡出與此同步。
export const CROSSFADE = 0.01;

// ── forum 接棒門檻：converge 之後「白點 → 橘核心」的 crossfade（symbolProgress 0..1）──
// coreIn ：SymbolFace 收斂點淡出、同時 ForumCore 橘方塊淡入（crossfade）。＝ converge 段終點，
//          也是 enter（transitionDone）起點 → HeroForumTransition 星空層同步淡出，改由 ForumCore 黑底補上。
// coreOut：橘核心淡出 → 露出下方議程。coreIn~coreOut 之間橘核心停在黑畫面（原地停住）。
// 淡出入為「固定時間」（見 ForumCore 的 CSS transition）；停留長度＝(coreOut−coreIn) 這段 scrub 捲動距離。
// 往回捲會自動倒退（boolean 觸發的 CSS 轉場可逆）。此處只做 handoff；橘核心接手後的「移動」動態待後續。
export const FORUM_HANDOFF = {
  coreIn: 0.75,
  coreOut: 0.9,
} as const;

// ── 星空 SymbolFace 序列（hero 星空蓋滿後的第二段 pin，見 Forum.vue）────────
// forum pin 的捲動進度（symbolProgress, 0..1）依門檻切換 SymbolFace 的 mode，越過 enter → transitionDone。
// 因為 scrub，往回捲會自動倒退。狀態：disperse → face（集合）→ converge（匯聚成點）
// → enter（收斂點淡出，交棒給 ForumCore 橘核心，見 FORUM_HANDOFF）。
// 只改 until 即可調每個狀態起點；converge 終點對齊 FORUM_HANDOFF.coreIn（＝交棒時機）。
export const SYMBOL_STOPS: readonly {
  until: number;
  mode: 'disperse' | 'face' | 'converge' | 'enter';
}[] = [
  { until: 0.3, mode: 'disperse' }, //                 0.00–0.30 分散（預設）
  { until: 0.58, mode: 'face' }, //                    0.30–0.58 集合（人像）
  { until: FORUM_HANDOFF.coreIn, mode: 'converge' }, // 0.58–coreIn 匯聚成點
  { until: 1.0, mode: 'enter' }, //                    coreIn–1.00 enter → 收斂點淡出、橘核心接棒
];

// 這段序列吃掉的捲動距離（× 視窗高）＝ 速度旋鈕（越大每個狀態停留越久）。
export const SYMBOL_VH = 1.6;

// ── core dot 形變（stage 3 變長 / stage 5 放大）＋ 顏色 ──────────────────
// dotSize：dot 原始邊長（px），變長/放大/遮罩起點尺寸皆以此為基準。
export const CORE = {
  dotSize: 24,
  lineScaleX: 10, // stage 3：point(24) → line(240)
  revealGrow: 15, // stage 5：接續線後再放大的量（邊放大邊淡出，與星空遮罩交融）
  orange: [255, 127, 0] as [number, number, number],
  dark: [10, 28, 43] as [number, number, number], // 橘→黑目標（＝ section 2 星空底色）
};

// ── hero → section 2 星空遮罩「起點尺寸」：一律從 CORE 推導，永遠對齊那條「線」──
// （先前 OrangeCore.vue LINE_SCALE_X 與 HeroForumTransition LINE_HALF_* 靠註解人工同步＝會 drift 的地雷；
//   改為單一推導後，改 CORE.lineScaleX 遮罩起點就跟著變，不會再脫鉤。）
export const TRANSITION = {
  lineHalfLen: (CORE.dotSize * CORE.lineScaleX) / 2, // = 120（半長）
  lineHalfThick: (CORE.dotSize * 1) / 2, // = 12（半寬，scaleY 1）
};

// ── 桌機 core 路徑幾何（設計中心線 viewBox 0 0 481 1073）────────────────
// curve：只含 C / L 的座標片段，x,y 交替、以 x 起始（供 OrangeCorePath 整體平移 shift）。
// anchorOffset：svg(0,0) 相對「date 大標左上角」的位移（沿用驗證過的設計定位）。
export const PATH = {
  stub: { x: 59.3574, bottom: 176.115 },
  curve:
    'C59.3574 176.115 151.779 50.008 276.663 126.658' +
    'C401.548 203.309 458.899 505.284 478.018 665.86' +
    'C478.018 665.86 282.352 448.5 156.411 749.963' +
    'L108.852 848.738L1.35156 1072',
  anchorOffset: { x: 525, y: -112 },
};
