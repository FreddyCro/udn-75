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

// ── 論壇段的可見設計線（核心層 path1 / path2）────────────────────────
// 貼上流程：Figma 選該 vector → 匯出 SVG 存 temp/forum-path{1,2}.svg →
//   d = <path d="…"> 整串；w/h = 匯出 svg 的 viewBox 尺寸；x/y = 該 vector 在核心層外框內的左上角。
// d 留空 = 尚未貼上，<ForumCorePath> 不渲染該段（不會報錯）。
// 🚧 x 待從 Figma 補；designW 依 pc 稿 canvas 1280，若外框另有自己的寬度需一併改。
export type ForumPathSeg = {
  x: number;
  y: number;
  w: number;
  h: number;
  d: string;
};

export const FORUM_PATH: {
  designW: number;
  designH: number;
  segs: Record<'path1' | 'path2', ForumPathSeg>;
} = {
  designW: 1280,
  designH: 8743, // 核心層外框總高
  segs: {
    path1: { x: 0, y: 58, w: 857, h: 3694, d: '' }, // 論壇一全段 ＋ 論壇二前半
    path2: { x: 0, y: 4082, w: 814, h: 1435, d: '' }, // 論壇二尾 → timetable 起點
  },
};
