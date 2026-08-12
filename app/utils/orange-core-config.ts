// orange core 連動序列的「設定台」（hero → forum，未來可往後續 section 延伸）。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useOrangeCoreProgress 與各 hero/forum 元件共用同一份。
// 這裡集中「序列骨幹」：時間軸門檻、pin/移動距離、core 形變、星空遮罩尺寸（從 core 推導）、路徑幾何。
// 刻意「不含」子元件自身外觀參數：HeroLoader（方塊/顏色）、SymbolFace（粒子物理/取樣/配色）——那些留在各元件。
//
// 延伸做法：orange core 走到後續 section 時，在此新增該段的 *_STOPS / *_VH / 幾何，
// 再於 useOrangeCoreProgress 加一條對應的 progress 軌 + resolver（照 path/pin/symbol 模式）。

// 註：舊的 STAGE_STOPS（在 path 軌內部再切 stage 1–3）已於 2026-08-08 移除。
// 它自 date 段下架後就沒有 production 消費者，且「stage」一詞與本檔末的 SEQUENCE
// （章節 → part → progress 定址）撞名，留著只會讓溝通出錯。定址請一律用 SEQUENCE。
// 取回：git show 33abe7a:app/utils/orange-core-config.ts

// ── core 移動「速度曲線」（stage 1–3 沿 path 移動時套用）──────────────
// scrub 本身等速綁定捲動；此 ease 重新分配「捲動 → path 進度」的節奏（不改整體距離）。
// GSAP ease 名稱：'none' 等速 / 'power2.in' 慢起快收 / 'power2.out' 快起慢收 / 'power2.inOut' 兩端慢中間快。
// 註：ease 同時作用於「定位」與「stage 判定」，故 stage 門檻仍對齊路徑幾何位置（不會錯位）。
export const MOVE_EASE = 'none';

// ── 引言文字淡出：core 走出文字之後才開始，淡出窗口的長度（× 視窗高）─────────
// 起點不是 path 進度門檻，而是量出來的：引言文字**底緣升到視窗中央**（＝ core 所在高度，
// 見 .claude/memory/hero-core-screen-locked.md）的那一刻 —— 即方塊剛穿出最後一行。
// 其後吃掉這段捲動距離把整段淡完（＝「慢慢淡出」的旋鈕，越大越慢）。
//
// ⚠️ 這個值同時決定引言的 runway：`.sec1__intro` 的 padding-bottom 必須是
//    `50vh + INTRO_FADE_VH × 100vh`，淡出才會剛好在轉場 pin 接手的同一刻結束
//    （50vh 是 core 從文字底緣走到視窗中央所需，見 OrangeCorePath）。
//    故 Hero.vue 直接由本值算出 `--intro-runway` 餵給 SCSS，不需兩邊手動同步。
export const INTRO_FADE_VH = 0.4;

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
//   MOVE_VH   — 相對速度旋鈕：在 trigger 區間**內**墊一個空 div 拉長 scrub 距離，同一段動畫要
//               捲更多才走完 → 看起來變慢。與 ease 正交（ease 只改同一段距離內的節奏分佈）。
//               spacer 若落在 trigger 元素之外、或 end 用固定 `+=px`，墊高完全不起作用。
//               取回：git show 7ff9f19:app/utils/orange-core-config.ts（常數）
//                     git show 7ff9f19:app/components/01.hero/Hero.vue（template spacer）
//   PIN_VH    — pin 釘住距離（Hero pinST 與 OrangeCorePath 的 end 共用同一值）
//   CROSSFADE — stage 5 星空淡入所占比例（避免大片半透明星空透出白底而 washy）
//   TRANSITION— 星空遮罩起點尺寸（由 CORE.dotSize × lineScaleX 推導，永遠對齊那條 core 線）

// ── 論壇二 09/15 那一撇的觸發窗口 ────────────────────────────────────
// 值是 forumPath 軌的 0..1，也就是 SEQUENCE 的 `forum.path.40%` 那個地址 ——
// dashboard（?pathdebug）顯示的窗口可以直接貼回這裡。
//
// null ＝ 由 ForumCorePath.build() 依幾何推導（撇的兩端在驅動線上的最近弧長）。
// 推導是預設值，因為版面一動（標題行數、講者照片、字體 fallback）百分比就會變 ——
// 寫死等於把量測快照抄成常數，正是 architecture/forum-node-path.md 第七節警告的事。
//
// 填數字則以填的為準，給「設計到切版有落差、要手動對」用。三個斷點各自獨立。
//
// ⚠ 2026-08-12：三個斷點都從 [0.40, 0.41] 改回 null。那組數字是 pc 的實測快照，卻被當成
//   三個斷點的初值填了下去 —— 於是 syncSlashWindow() 的 override 分支永遠先返回，
//   幾何推導（含 nearestArcLength）在 production 完全跑不到，而 pad / mob 是流排版、
//   那一撇會在核心根本不在 09/15 的位置畫出來。改回 null 後 pc 應仍落在 0.40 附近
//   （那個值本來就是推導結果的快照），pad / mob 則各自算自己的。
//   要手動覆寫時**只填需要覆寫的那一個斷點**，不要三個一起填。
//
// ⚠ 這裡**不放**那一撇的外觀（長寬比、傾角）—— 那是排版數字，由 --date-size 推導，
//   跟 --stair-x1 一起住在 ForumEvent.vue 的 SCSS 裡。改字級只該動一個檔案。
export const FORUM_SLASH_AT: Record<'pc' | 'pad' | 'mob', [number, number] | null> = {
  pc: null,
  pad: null,
  mob: null,
};

// ── 論壇段核心的移動速度曲線 ──────────────────────────────────────────
// 同 hero 的 MOVE_EASE 語意：scrub 本身等速綁定捲動，此 ease 只重新分配「捲動 → 路徑進度」
// 的節奏，不改總距離。'none' 等速 / 'power2.inOut' 兩端慢中間快。
// ⚠ 非 'none' 會破壞下面那個「核心留在畫面中央」的保證（見 buildArcKnots 的說明）。
export const FORUM_MOVE_EASE = 'none';

// ── 論壇段核心的回中節點間距（以視窗高為單位）────────────────────────
// 核心每走過 這個高度 的 y，就精準回到視窗中央一次；節點之間仍照弧長等比前進，
// 故「橫向繞路時衝得快」的手感保留，只是偏移不會一路累積到滑出畫面。
// 完整原理與量測見 ~/utils/forum-path-geometry 的 buildArcKnots。
//
// 調整方向：**小** ＝ 更貼齊畫面中央、但弧長速度變化更劇烈（橫向繞路那幾段會更急）；
//           **大** ＝ 手感更接近等速，但核心離中央更遠。經驗法則：偏移 ≲ 間距的一半
//（test/forum-path-geometry.spec.ts 有守這條），而間距吃視窗高 → 螢幕越矮自動越貼齊。
//
// 逐格捲動實測，數字是**核心中心相對視窗中央**的偏移（負＝偏上），括號是橫向速度上限：
//   1440×900 −280/+123 (2.70 px/px)   1024×900 −198/+170 (2.30)   414×896 −138/+88 (1.54)
//   1440×700 −204/+142 (3.16)         375×667  −119/+63  (1.62)   375×667 不帶 ?highlights −115/+67
// 對照改動前的等比映射（同一批線稿算出來的）：pc −689/+445、pad −686/+120、mob −429/+60
//   —— 900 高的半屏只有 450，等比那組會整顆滑出畫面，這就是本設定要解決的問題。
export const FORUM_CENTER_KNOT_VH = 0.5;

// ── forum 接棒門檻：converge 之後「白點 → 橘核心」的交接（symbolProgress 0..1）──
// coreIn ：SymbolFace 收斂點交棒給 ForumCore 橘方塊。＝ converge 段終點，也是 enter 段的起點。
//          **硬切、不是 crossfade** —— 收斂點在收攏末段（vSolid）已由白轉橘（SymbolFace 的
//          convergeColor ＝ CORE.orange），到這裡兩顆同色同尺寸同位置，直接換人畫。
//          白→橘那一段跟著 converge 的 2.2s 補間走，不吃捲動，故與本門檻的位置無關。
// coreOut：橘核心的**黑底**淡出。coreIn~coreOut 之間橘核心停在黑畫面。
// agendaIn：`.sec2__path` 與議程整組淡入。刻意**早於** coreOut，讓那 0.4s 發生在畫面外
//          （此時符號段底緣還在視窗底下方，見 SymbolScene 的時序表），否則會在畫面底緣看到淡入。
// 淡出入為「固定時間」（見 ForumCore 的 CSS transition）；往回捲自動倒退（CSS 轉場可逆）。
//
// ⚠ coreOut 只負責黑底，不負責橘點消失 —— 橘點要撐到論壇段路徑接手（見 useOrangeCoreProgress
//   的 forumCoreDotVisible）。coreOut 與交棒點之間橘點停在視窗中央不動，這段「懸停期」
//   ＝ 50vh（見下）。
// ⚠ 懸停期有 **50vh 的幾何下限**，coreOut 已推到 1.0（＝符號段捲完的同一刻），無法再縮：
//   交棒點是「黑白接縫升到視窗中央」＝ 符號段捲完再 +50vh，而那個位置被「路徑起點必須落在
//   視窗正中央」的零跳點幾何鎖死（見 ForumCorePath 的 start: 'top center'）。要更短就得動
//   交棒幾何、犧牲零跳點保證，或改成「懸停期間橘點跟著接縫往下漂」的另一種設計。
export const FORUM_HANDOFF = {
  // 2026-08-09：0.75 → 0.84。converge（匯聚成點）那一拍的停留太短、交棒段又佔太多，
  // 把 coreIn 往後推 ＝ converge 吃進 handoff 的距離。
  // 400vh 下：converge 54.4 → 88vh（+62%）、handoff 80 → 64vh（−20%）。
  coreIn: 0.84,
  coreOut: 1.0,
  // 2026-08-09：0.9 → 0.92。這個門檻用**絕對距離**定錨、不隨 SYMBOL_VH 等比縮放：
  // 它的作用是「讓那 0.4s 的淡入發生在畫面外」，判準是符號段底緣距視窗底多遠。
  // 0.92 × 400vh ＝ 368vh，距段尾 32vh —— 與 SYMBOL_VH 3.2 時代的 0.9 等距。
  agendaIn: 0.92,
} as const;

// ── 星空 SymbolFace 序列（獨立黑底段落自己的捲動尺，見 01a.symbol/SymbolScene.vue）──
// 該段落的捲動進度（symbolProgress, 0..1）依門檻切換 SymbolFace 的 mode。
// 因為 scrub，往回捲會自動倒退。狀態：disperse → face（集合）→ converge（匯聚成點）
// → enter（收斂點淡出，交棒給 ForumCore 橘核心，見 FORUM_HANDOFF）。
// 只改 until 即可調每個狀態起點；converge 終點對齊 FORUM_HANDOFF.coreIn（＝交棒時機）。
// ⚠️ 改這裡（或 FORUM_HANDOFF / SYMBOL_VH）之後，要同步 SymbolScene.vue 內的「symbolProgress
//    時序表」註解 —— 那張表是本檔門檻 × SYMBOL_VH 的 vh 換算結果，不會自己更新。
// ── 開場三行文案（Figma 智慧論壇05：pc 2065:139731 / pad 2065:124199 / mob 2065:120221）──
// 疊在第一拍（disperse）上的一層純文字，見 01a.symbol/SymbolIntro.vue。
// 四個門檻都是 symbolProgress（scrub，往回捲自動倒退）：
//   in → full   三行**依序**向上淡入 + 逐字亂碼落定（每行的窗見 symbolIntroLine）
//   full → fadeOut  全亮停留（讀完三行）
//   fadeOut → out   整組一起淡出（symbolIntroOutOpacity）—— 退場不再依序，
//                   它的作用只是清場給人像集合，再演一次會拖到下一拍
//
// ⚠️ out 必須早於 SYMBOL_STOPS[0].until（＝ disperse→face 的交界）——
//    文字要在粒子開始集合成人像之前淡乾淨，兩件事同時發生會互相搶焦點。
//    test/symbol-sequence.spec.ts 守著這條。
//
// 2026-08-12：full 0.08 → 0.14。三行改依序進場後，24vh 切成三段重疊的窗每行只剩約 10vh，
//    快捲的人讀不出先後順序。多要的 24vh 從全亮停留期扣（48 → 24vh），其後門檻全部不動。
//
// 換算成捲動距離（SYMBOL_VH = 4.0 ⇒ 400vh）：
//   8vh 第一行起 → 56vh 第三行落定 → 80vh 淡出起 → 104vh 淡完。
export const SYMBOL_INTRO = {
  in: 0.02,
  full: 0.14,
  fadeOut: 0.2,
  out: 0.26,
} as const;

// 每行的窗寬 ＝ stagger × 此值。2 ＝ 相鄰兩行重疊一半（前一行升到一半，下一行才起跑）。
export const INTRO_LINE_SPAN_RATIO = 2;
// 每行由多少 px 的下方升到定位。24px 對 44/48px 的行高約半行 —— 看得出來但不誇張。
export const INTRO_LINE_SHIFT = 24;
// 亂碼在自己那扇窗的多少比例處就落定完畢。< 1 ⇒ 最後一小段是「已可讀的整行」升到定位，
// 而不是升定的同一刻才落最後一個字。
export const INTRO_REVEAL_SPAN = 0.8;

// GLSL 的 smoothstep：兩端一階導數為 0，淡入淡出的頭尾不會有硬轉折。
// 本檔僅此一處用到，不外掛工具檔。
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** 開場三行文案的**整組退場**係數（1 ＝ 在場、0 ＝ 已淡完）。
 *  進場是逐行的（symbolIntroLine），退場是整片的，故兩者分開兩支。
 *  純函式、不依賴 DOM —— 曲線由 test/symbol-sequence.spec.ts 守著。 */
export function symbolIntroOutOpacity(p: number): number {
  return 1 - smoothstep(SYMBOL_INTRO.fadeOut, SYMBOL_INTRO.out, p);
}

/** 第 index 行（共 count 行）在 symbolProgress = p 時的進場狀態。
 *
 *  每行的窗由 in / full 與行數**推導**，不寫死：
 *    stagger = (full − in) / (count − 1 + INTRO_LINE_SPAN_RATIO)
 *    line i  : [in + i·stagger, in + (i + INTRO_LINE_SPAN_RATIO)·stagger]
 *  分母那項保證 i = count−1 的**結尾正好落在 full** —— 行數若從三行變四行，
 *  窗會自動變窄，而不是溢出 full 去撞淡出段。
 *
 *  三行代入：0.02–0.08 / 0.05–0.11 / 0.08–0.14（每行 24vh、彼此錯開 12vh）。
 *
 *  ⚠️ reveal 用**線性**而不是 smoothstep：落字要等速，用 smoothstep 會變成
 *     「先慢、中間一次噴完、再慢」，看起來像掉幀。 */
export function symbolIntroLine(
  p: number,
  index: number,
  count: number,
): { opacity: number; shift: number; reveal: number } {
  const stagger =
    (SYMBOL_INTRO.full - SYMBOL_INTRO.in) / (count - 1 + INTRO_LINE_SPAN_RATIO);
  const start = SYMBOL_INTRO.in + index * stagger;
  const end = start + INTRO_LINE_SPAN_RATIO * stagger;
  const opacity = smoothstep(start, end, p);
  const t = (p - start) / (end - start);
  const reveal = Math.min(1, Math.max(0, t / INTRO_REVEAL_SPAN));
  return { opacity, shift: INTRO_LINE_SHIFT * (1 - opacity), reveal };
}

export const SYMBOL_STOPS: readonly {
  until: number;
  mode: 'disperse' | 'face' | 'converge' | 'enter';
}[] = [
  { until: 0.28, mode: 'disperse' }, //                0.00–0.28 分散（前段疊開場文案，見 SYMBOL_INTRO）
  { until: 0.62, mode: 'face' }, //                    0.28–0.62 集合（人像）＝最長的一拍
  { until: FORUM_HANDOFF.coreIn, mode: 'converge' }, // 0.62–coreIn 匯聚成點
  { until: 1.0, mode: 'enter' }, //                    coreIn–1.00 enter → 收斂點淡出、橘核心接棒
];

// 這段序列吃掉的捲動距離（× 視窗高）＝ 速度旋鈕（越大每個狀態停留越久）。
// 2026-08-04：1.6 → 3.2（整段距離拉長一倍），讓 disperse / face / converge 各拍都有更長的停留。
// 2026-08-09：3.2 → 4.0。+80vh 裡 64vh 落在第一拍，疊上開場三行文案（見 SYMBOL_INTRO，
//             disperse 48 → 112vh）——文案要有「浮現 → 讀完 → 淡出」的完整節奏，48vh 太趕。
//             同時重算 SYMBOL_STOPS 的門檻：face 幾乎不變（137.6 → 136vh），converge 拉長
//             （54.4 → 88vh，+33.6vh），handoff 縮短（80 → 64vh，−16vh）——見 FORUM_HANDOFF。
export const SYMBOL_VH = 4.0;

// ── 進場方塊的邊長（px）──────────────────────────────────────────────
// 「載入層中央留白格 → HeroStart cube」在同一個位置交接：載入層收在全白（中央那格全程
// 不翻橘，見 HeroLoader），淡出那 0.6s 內 cube 由白底原地浮現。cube 要正好補進那格留白，
// 大一圈或小一圈都會露出破綻，故兩邊尺寸不能各寫一份。
//
// 這個值同時是 **HeroLoader 整份網格的格子邊長**（tileSize 的預設）—— 留白位就是中央那格，
// 格子與 cube 本來就該是同一個尺寸，一份數字管到底。
// 對稿 95px（設計稿 1774:61076 的 cube）。HeroStart 的 hover 目標 131 是相對此值的比例。
// 註：設計稿 loading-1~7 的格子在 1280×720 稿上是 83.333px（比 cube 小 11.7px）——
//     此處刻意讓網格跟著 cube 放大，換取「全程只有一個方塊尺寸」。
//
// ⚠️ 下限 ≈ 80px：方塊上會依序疊兩串字 —— 載入層的「100%」（32px/300，Noto Sans TC 實測
//    80.07px 寬）與 cube 內的「start」（28px/400/ls 1.4，66.40px 寬）。**較寬的是「100%」**，
//    故它才是尺寸下限的來源。調小到 80 以下，「100%」會從中央留白格溢出到左右的藍／橘格上；
//    要更小就得同時調 HeroLoader 的 counterFontSize。
//    （兩串字本身不必互相配合寬度：它們是先後兩個狀態，且都不在 flow 內、不會推動版面。）
export const HANDOFF_CUBE = 95;

// ── core dot 外觀 ────────────────────────────────────────────────────
// dotSize：dot 邊長（px），亦為 HeroSymbolTransition 讀不到 core 時的退回尺寸。
// 對稿 26px（2026-08-07）。ForumCore / ForumCorePath / HeroSymbolTransition 都讀這個常數，
// SymbolFace 也讀它當 convergeSize 的預設（匯聚成點那顆＝同尺寸實心方塊，才接得上橘核心）。
// 唯一的例外是 hero 段的 OrangeCore.vue —— 它的 SCSS 寫死同一個值，改這裡要一起改。
export const CORE = {
  dotSize: 26,
  orange: [255, 127, 0] as [number, number, number],
};

// CORE.orange 的 CSS hex 形式（＝ tailwind.css 的 --color-orange）。
// 需要色字串而非 rgb 三元組的地方用這個：SymbolFace 的 convergeColor（WebGL uniform）
// 與 phraseColor（彩蛋文字，寫進 el.style.color）。
// ⚠️ 住在這裡而不是 SymbolFace.vue 內：那邊要拿它當 defineProps 的 default，
//    而 defineProps 會被提升到 setup() 外 —— 只吃得到模組層的 import，
//    <script setup> 裡宣告的 const 會編譯失敗。
// ⚠️ 也不寫成 '#ff7f00' 字面量：test/design-tokens.spec.ts 守著「token 色值不重複寫死」。
export const CORE_ORANGE_HEX = `#${CORE.orange
  .map((v) => v.toString(16).padStart(2, '0'))
  .join('')}`;

// ── 論壇段紙飛機 ─────────────────────────────────────────────────────
// node：變身節點（後半段的節點編號逐斷點不同）。morphLen：九格走完的弧長。
// tailLen：彗星尾長度（稿上尾跡的弧長）。dash：稿值，線寬吃 FORUM_PATH_STROKE。
// rearOffset：機尾相對路徑點的後退量。取 dotSize/2 是為了讓第 1 格（26×26）的中心
// 正好落在路徑點上 ＝ 與交棒那顆方塊完全重合；改 dotSize 要一起改 sprite 第 1 格。
export const FORUM_PLANE = {
  node: { pc: 'R1', pad: 'S1', mob: 'T1' } as Record<'pc' | 'pad' | 'mob', string>,
  morphLen: 240,
  tailLen: 130,
  dash: [16, 16] as [number, number],
  rearOffset: CORE.dotSize / 2,
  // ⚠ 三個斷點都不可小於 1：CORE.dotSize（第 0 格）不隨斷點縮小，第 1 格 24×28 是
  // 設計者刻意貼近 26×26 讓變形起手無縫接軌 —— scale < 1 會讓交棒瞬間「縮一下」，
  // 違反本專案「交棒不可看到縮一下」的不變量。真要縮小機身，得連 CORE.dotSize 也
  // 一起做成隨斷點變化，而不是只縮 sprite。
  scale: { pc: 1, pad: 1, mob: 1 } as Record<'pc' | 'pad' | 'mob', number>,
};

// 註：原有 PATH（桌機設計中心線幾何：stub 垂直段 + C/L 曲線片段 + 相對 date 大標左上角的
// anchorOffset）已隨 date 段移除。新稿 hero 段的路徑是「第一屏中央 → 視窗正中央」的垂直線，
// 幾何直接由 section 量測推導、不需常數（見 OrangeCorePath.vue 的 build()）。

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

// ── 永續祝福退場：夥伴清單淡出（03 → 04 過場的第一拍）────────────────
// 窗口的**終點**由幾何鎖死：`.section3` 下緣抵達視窗頂，也就是 media 的 `top top`
//（收窄唯一能開始的最早時機 —— 更早的話接縫還在畫面上，收窄會露出橫向缺口）。
// 起點則是自由的，往回退 BLESSING_OUT_VH 個視窗高，這就是整段退場的長度旋鈕。
//
// BLESSING_OUT_FADE：淡出佔窗口的比例，其後是純橘的呼吸拍（＝ 1 − 本值）。
// 接縫離開視窗頂時畫面上必須只剩橘，滿版橘底與 media 橘塊之間那道寬度差才接得無縫。
//
// 兩個值的分工：**OUT_VH 決定整段多長，OUT_FADE 決定其中多少花在淡出**。
//
// 2026-08-11：窗口 1.0 → 0.6、fade 0.65 → 0.85。
//   原本吃滿一個視窗高沒有理由（起點是自由的），加上 media 拍 0 的 35vh，
//   整段過場 135vh，實測過長。改後 60 + 20 ＝ 80vh。
//   代價：淡出起點提前，此時夥伴清單頂端已被視窗頂切掉約 240px（原本剛好完整）。
//   要換回「面板完整時才開始淡」就把 OUT_VH 調回 0.75 以上。
export const BLESSING_OUT_VH = 0.6;
export const BLESSING_OUT_FADE = 0.85;

// ── 夥伴清單的閱讀定格（× 視窗高）────────────────────────────────────
// `.section3__partners` 是 sticky top: 0，這個值是它定住的捲動距離
//（由 `.section3__partners-hold` spacer 撐出來 —— sticky 的活動範圍是父層的
// **content box**，用 `.section3` 的 padding 撐不出來，見 Media.vue 同一個坑）。
//
// 為什麼需要它：面板塊高約 778px、視窗約 900px，「完整在畫面上」的捲動距離只有
// 兩者之差（≈122px），跟過場長度無關 —— 不定住就一定來不及看。
// 加 `.section3` 的 padding-bottom 不能替代：那會把接縫與整個淡出窗口一起往下推，
// 面板卻不動，等於在淡一個已經捲出畫面的東西。
//
// 定住期間頁面不動但**沒有上鎖**：指標在清單上時 wheel 捲清單（14 家夥伴約 1500px
// 塞在 600px 高的面板裡），捲到底瀏覽器自動把捲動接回頁面。
export const BLESSING_PARTNERS_HOLD_VH = 1;

/** 夥伴清單在退場軌 p 時的 opacity（1 → 0）。
 *  smoothstep 兩端一階導數為 0 → scrub 淡出的頭尾沒有硬轉折，且它本身已夾在 [0,1]。
 *  純函式、不依賴 DOM —— 曲線由 test/blessing-outro.spec.ts 守著。 */
export function partnersFadeAt(p: number): number {
  return 1 - smoothstep(0, BLESSING_OUT_FADE, p);
}

// ── forum → blessing 覆蓋過場（02 → 03）────────────────────────────────
// cover 軌吃的捲動距離**恆等於 100vh**：軌是「`.section3` 上緣從視窗底緣升到視窗頂緣」，
// 而它在一般流裡跟捲動 1:1 —— 幾何鎖死，沒有可調的長度，故本段沒有 *_VH 常數。
// 完整推導見 architecture/2026-08-12-forum-blessing-transition-design.md 第二節。
//
// COVER_CONTACT：紙飛機碰到色塊上緣的時機（cover 軌 0..1）。
// ⚠️ 它同時是 ForumCorePath 那條 ScrollTrigger 的 end 對齊位置 —— 兩者必須一致，
//    所以只有這一個來源（那邊改讀 coverContactAlign()）。各寫一份就會在調值時脫鉤，
//    症狀是「飛機已經被色塊蓋住但底色還是藍的」。
// 0.5 ＝ 接縫升到視窗中央 ＝ 改動前 `center` 的行為，與論壇段入口的 `start: 'top center'`
// 是同一招零跳點交棒（飛機的螢幕位置本來就被回中節點表拉在視窗中央附近，見 buildArcKnots）。
// 設計稿的接觸點在畫面 67%（＝ 0.333）；改它會連帶拉長整條 forum 路徑的捲動尺、
// 飛機全程變慢，故維持 0.5 —— 要對稿只需調這一個數字。
export const COVER_CONTACT = 0.5;

/** ForumCorePath 的 ScrollTrigger end 對齊字串（＝ 接觸那一刻接縫在視窗的位置）。 */
export function coverContactAlign(): string {
  return `${(1 - COVER_CONTACT) * 100}%`;
}

/** cover 軌 p 是否已越過接觸點（0 ＝ 還是藍、1 ＝ 已翻橘）。標題／引言的 opacity 共用。
 *
 *  ⚠️ 這是**二元**的，不是沿捲動內插 —— 換色是「飛機撞上色塊」這個事件的反應，
 *  補間交給 CSS transition（見 Blessing.vue 的 .section3 background）。
 *  原本是 smoothstep(COVER_CONTACT, COVER_CONTACT + COVER_ORANGE_FADE, p)，
 *  2026-08-12 依使用者回饋改為事件觸發 ＋ CSS 補間：在 scrub 上疊 transition 會讓
 *  每一幀都追一次補間、手感發黏，改成只跨越一次就沒有這個問題。
 *
 *  純函式、不依賴 DOM —— 由 test/blessing-cover.spec.ts 守著。 */
export function coverOrangeAt(p: number): number {
  return p >= COVER_CONTACT ? 1 : 0;
}

/** cover 軌 p 時白方塊走完「接縫 → 臉的第 01 格」的比例（0 ＝ 貼在接縫上、1 ＝ 就位）。
 *  smoothstep 的頭段幾乎不動 → 讀起來像「從色塊邊緣冒出來」，末端才緩緩落進格子。 */
export function seedTravelAt(p: number): number {
  return smoothstep(COVER_CONTACT, 1, p);
}

// ── 序列定址表：章節 → part → progress ────────────────────────────────
// 這張表是**溝通用的座標系**，不是新的驅動機制 —— 底下仍是既有那幾條 progress 軌，
// 本表只是把它們切成有名字的段落，讓「在 forum.face.59% 加事件」這種話能對回程式碼。
//
// 地址寫法：`章節.part.progress`，例如 `forum.face.59%`。
//   ⚠️ **part 的 key（名字）才是主鍵**，不是序號。序號會因為中間插入新 part 而整批位移，
//      而地址已經寫進 issue／對話／commit 了。dashboard 顯示 `forum.2 face · 59%`
//      （序號只是方便口頭念），正式書寫一律用 `forum.face.59%`。
//
// 反算回程式碼（dashboard 會直接印出來）：
//   forum.face.59% → symbolProgress = 0.28 + 0.59 × (0.62 − 0.28) = 0.4806
//                  → 距符號段起點 192.24vh（SYMBOL_VH 4.0 ＝ 400vh）
//
// drive（驅動型）決定這個地址能不能拿來綁捲動事件 —— 混用會下出做不到的指令：
//   'scrub' 綁捲動、可逆，progress ＝ 捲動比例。**只有這種能在任意 % 掛門檻。**
//   'time'  時間軸（ScrollTrigger 起播後自己跑完，不隨捲動倒帶）。只有 idle / done 兩態，
//           不追時間軸進度 —— 要在中間插事件得改那條 timeline 本身，不是改捲動門檻。
//   'none'  無軌區間（純捲動距離，沒有任何 progress 寫入）。講得出位置，但沒有 %。
//
// ⚠️ 表中**不可出現相鄰的兩個 'none'**：無軌 part 的「是否結束」是靠下一段有沒有開始
//    反推的（見 useCoreSequence），兩個連在一起就推不出來。
// ⚠️ media（04）暫不納入：它整段是時間軸驅動（見 useMediaIntroMotion 的 gsap.timeline），
//    用捲動 % 定址會誤導。要納入時照 'time' 的寫法加一章。
export type PartDrive = 'scrub' | 'time' | 'none';

/** 'scrub' part 吃的 progress 軌（皆來自 useOrangeCoreProgress） */
export type SequenceTrack =
  | 'path'
  | 'transition'
  | 'symbol'
  | 'forumPath'
  | 'cover'
  | 'blessing'
  | 'blessingOut';

/** 'time' part 吃的完成旗標 */
export type SequenceFlag = 'heroVideo' | 'stairs';

export type SequencePart = {
  /** 地址主鍵（章節內唯一）。插入新 part 不會讓既有地址失效 —— 所以別用序號當主鍵。 */
  key: string;
  /** dashboard 顯示的一句話說明 */
  label: string;
  drive: PartDrive;
  /** drive: 'scrub' 專用 */
  track?: SequenceTrack;
  /** 該 part 在軌上的起點（預設 0） */
  from?: number;
  /** 該 part 在軌上的終點（預設 1） */
  until?: number;
  /** drive: 'time' 專用 */
  flag?: SequenceFlag;
  /** drive: 'none' 且長度已知時的捲動距離（× 視窗高）。'scrub' 由 TRACK_VH 推導。 */
  vh?: number;
};

export type SequenceChapter = {
  key: string;
  label: string;
  parts: SequencePart[];
};

// 各軌吃掉的捲動距離（× 視窗高）。path / forumPath 是量出來的幾何（隨版面浮動），
// 沒有常數長度 → dashboard 對那兩段只給 %，不給 vh。
export const TRACK_VH: Partial<Record<SequenceTrack, number>> = {
  transition: TRANSITION_VH,
  symbol: SYMBOL_VH,
  // cover 軌長是**幾何常數**（`.section3` 的 top bottom → top top 恆為一個視窗高），
  // 不像 path / forumPath 要量測，故 dashboard 給得出 vh。它不是旋鈕，不要調。
  cover: 1,
  blessing: BLESSING_VH,
  // 退場窗口的長度是設定值（見 BLESSING_OUT_VH），不像 path / forumPath 要量測，
  // 故 dashboard 給得出 vh。
  blessingOut: BLESSING_OUT_VH,
};

export const SEQUENCE: readonly SequenceChapter[] = [
  {
    key: 'hero',
    label: '開場',
    parts: [
      { key: 'video', label: '影片四階段（捲動鎖住）', drive: 'time', flag: 'heroVideo' },
      { key: 'core', label: 'core 沿垂直線下行', drive: 'scrub', track: 'path' },
      {
        key: 'transition',
        label: '橘塊拉長 → 展開（pin）',
        drive: 'scrub',
        track: 'transition',
      },
    ],
  },
  {
    // 符號星空段（01a.symbol）在設計稿上是「智慧論壇05–08」四拍，故歸在 forum 章節下 ——
    // 它是獨立元件是實作分工，不是章節分界。
    key: 'forum',
    label: '智慧論壇',
    parts: [
      { key: 'disperse', label: '粒子分散（前段疊開場三行文案）', drive: 'scrub', track: 'symbol', from: 0, until: SYMBOL_STOPS[0]!.until },
      { key: 'face', label: '集合人像（最長的一拍）', drive: 'scrub', track: 'symbol', from: SYMBOL_STOPS[0]!.until, until: SYMBOL_STOPS[1]!.until },
      { key: 'converge', label: '匯聚成點', drive: 'scrub', track: 'symbol', from: SYMBOL_STOPS[1]!.until, until: FORUM_HANDOFF.coreIn },
      { key: 'handoff', label: `交棒：白點→橘核心（agendaIn ${FORUM_HANDOFF.agendaIn}）`, drive: 'scrub', track: 'symbol', from: FORUM_HANDOFF.coreIn, until: 1 },
      // 符號段捲完 → 黑白接縫再升 50vh 才到視窗中央，橘點在這段停著不動。
      // 幾何下限，見 FORUM_HANDOFF 的註解。
      //
      // 【延伸點】未來要在這一段做「符號段黑底 → 論壇段白底」的換色（取代現在的硬接縫），
      // 得先給它一條軌 —— 目前是 drive: 'none'，沒有任何 progress 可以綁。建軌方法：
      //   以 .sec2__path 為 trigger、start: 'top bottom' / end: 'top center' 的 scrub，
      //   寫入 useOrangeCoreProgress 的新軌 hoverProgress。
      // 那兩個端點正好框住這 50vh，且與 ForumCorePath 的 start: 'top center' 首尾相接、不重疊。
      // 換色的落點是 ForumCore 的 .forum-core__bg（fixed 滿版 z-index 20，已與橘點分層）。
      // 下面的 vh: 0.5 就是建軌時的尺長單一來源，不要拿掉。
      { key: 'hover', label: '懸停期（橘點停在中央）', drive: 'none', vh: 0.5 },
      { key: 'path', label: '核心沿設計線蛇行', drive: 'scrub', track: 'forumPath' },
      { key: 'agenda', label: '議程／報導／論壇四', drive: 'none' },
    ],
  },
  {
    key: 'blessing',
    label: '永續祝福',
    parts: [
      { key: 'cover', label: `色塊往上蓋（${COVER_CONTACT * 100}% 處接觸、淺藍轉橘）`, drive: 'scrub', track: 'cover' },
      { key: 'face', label: `逐格臉（尾 ${BLESSING_HOLD * 100}% 停格）`, drive: 'scrub', track: 'blessing' },
      { key: 'stairs', label: '階梯線逐格進場', drive: 'time', flag: 'stairs' },
      { key: 'partners', label: `夥伴清單（sticky 定住 ${BLESSING_PARTNERS_HOLD_VH * 100}vh 供閱讀）`, drive: 'none', vh: BLESSING_PARTNERS_HOLD_VH },
      // 03 → 04 過場第一拍。放在 partners 之後還有一個副作用是修掉既有問題：
      // partners 是無軌 part，「結束了沒」靠下一段反推（useCoreSequence 的 ②），
      // 在此之前它是序列末端 → 永遠停在未完成，dashboard 的游標卡在那裡。
      { key: 'outro', label: `夥伴清單淡出（前 ${BLESSING_OUT_FADE * 100}% 淡完，其後純橘）`, drive: 'scrub', track: 'blessingOut' },
    ],
  },
];
