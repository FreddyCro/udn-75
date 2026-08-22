// orange core 連動序列的「設定台」（hero → forum，未來可往後續 section 延伸）。
//
// 純資料模組（無 Vue runtime），Nuxt auto-import；由 useOrangeCoreProgress 與各 hero/forum 元件共用同一份。
// 這裡集中「序列骨幹」：時間軸門檻、pin/移動距離、core 形變、星空遮罩尺寸（從 core 推導）、路徑幾何。
// 刻意「不含」子元件自身外觀參數：HeroLoader（方塊/顏色）、SymbolFace（粒子物理/取樣/配色）——那些留在各元件。
//
// 延伸做法：orange core 走到後續 section 時，在此新增該段的 *_STOPS / *_VH / 幾何，
// 再於 useOrangeCoreProgress 加一條對應的 progress 軌 + resolver（照 path/pin/symbol 模式）。

// 唯一的 import，且同樣是純資料模組（無 Vue runtime）：blessingFrameAt 要把 blessing 軌的
// 進度換成格號，格數只有畫格資料本身知道。反向 import（讓畫格資料讀 BLESSING_HOLD）也可以，
// 但那會讓「一份純畫格座標」變成依賴序列設定 —— 序列的行為歸這裡。
import { FACE_FRAME_COUNT } from './blessing-face-frames';

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

// ── 論壇段路徑事件的設定在別的檔案 ────────────────────────────────────
// 「核心走到線上某處 → 某個區塊有反應」那批離散事件的表在 ~/utils/forum-path-events
// （`FORUM_PATH_EVENTS`）。它們的門檻**不寫在這裡也不寫成百分比** —— 是由節點編號在每次
// ScrollTrigger refresh 依實際幾何算出來的，因為手寫的 % 在 RWD 下會飄（正是下面
// FORUM_SLASH_AT 2026-08-12 那則 ⚠ 記的事故）。
// 完整設計見 architecture/2026-08-12-forum-path-events-design.md。

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

// ── 畫那一撇時核心縮成「筆尖」──────────────────────────────────────────
// 撇的脊寬只有 9.6px（pc）／6.25（pad）／5.67（mob），核心卻是 26px（CORE.dotSize）——
// 不縮的話畫面上是一顆大方塊拖著一條細線，看起來不是它畫出來的。故進窗口前先縮到脊寬、
// 出窗口後再還原（算式與退化見 ~/utils/forum-slash 的 slashCoreScaleAt）。
//
// shrinkLen ＝ 縮小／還原各自吃掉的**弧長**（px），也就是這件事唯一的旋鈕：
//   小 ＝ 縮得急（趨近硬切，會看到跳一下）；大 ＝ 縮得慢，但可能在核心離撇還很遠時就開始變小。
//   80 對照撇本身的長度：pc 的脊線約 196px 弧長，故縮小佔它的四成，肉眼看得出是「準備下筆」。
//
// ⚠ 這裡**只有時機、沒有目標尺寸** —— 縮到多小是量出來的（ForumCorePath 讀那條脊線的
//   computed width）。理由同上面 FORUM_SLASH_AT 的最後一則：脊寬是排版數字、由 --date-size
//   推導，住在 ForumEvent.vue 的 SCSS。在這裡再寫一個比例就是把它複製成兩份，
//   改字級時只會有一邊跟上（而畫面上只是「筆尖粗了一點」，不會有人立刻發現）。
export const FORUM_SLASH_CORE = {
  shrinkLen: 80,
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

// ── 符號段捲動尺：每一拍吃掉的捲動距離（× 視窗高）────────────────────────
// **這是本段唯一的旋鈕。** 四拍對應 Figma「智慧論壇05–08」，也就是 SEQUENCE 裡的
// forum.disperse / face / converge / handoff。要調節奏就改這裡，其餘門檻自己跟上。
//
// 為什麼以「vh」為來源，而不是像改版前那樣手寫 progress 門檻（0.28 / 0.62 / 0.84 / 0.92）：
// 那些門檻只在某一個 SYMBOL_VH 之下才對應到想要的絕對距離。動了總長就整批靜默錯位 ——
// 四拍的 vh 全部跑掉，而畫面上只會覺得「節奏怪怪的」，沒有任何東西會壞掉喊出來。
// 改成 vh 當來源之後 SYMBOL_VH ＝ 四拍總和、門檻由累加推導，總長與各拍再也不可能對不上
//（test/symbol-sequence.spec.ts 有一支直接守這條反算關係）。
//
// 調整史：
//   2026-08-04  總長 1.6 → 3.2（整段拉長一倍），讓 disperse / face / converge 各拍都有更長的停留。
//   2026-08-09  3.2 → 4.0。+80vh 裡 64vh 落在第一拍，疊上開場三行文案（見 SYMBOL_INTRO，
//               disperse 48 → 112vh）—— 文案要有「浮現 → 讀完 → 淡出」的完整節奏，48vh 太趕。
//               同時 coreIn 0.75 → 0.84（converge 54.4 → 88vh、handoff 80 → 64vh）。
//   2026-08-13  4.0 → 3.44。converge 88 → 56vh、handoff 64 → 40vh：這兩拍的視覺是 SymbolFace
//               的 2.2s 補間（吃時間、不吃捲動），補間跑完後的**停留**太長，讀起來像卡住。
//               前兩拍的絕對距離不動（112 / 136vh），省下的 56vh 還給頁面。
//               ⚠ handoff 已接近下限：40 ＝ 8vh 停留 ＋ AGENDA_OFFSCREEN_VH 的 32vh。
//   2026-08-13  converge 改綁 scrub（見下方 convergeAmountAt），距離不動。上面那次縮短
//               只治了順著滑的版本 —— 往回滑時那一拍**整段**沒有動畫，96vh 全是靜止的白。
//               改成 progress 的純函式之後 converge 這一拍在兩個方向都被填滿，
//               於是它的 vh 從「補間跑完後還要傻等多久」變回單純的「收攏要捲多久」。
//   2026-08-17  converge 0.56 → 0.76（總長 3.44 → 3.64）。多出來的 20vh 是尾端切出來的
//               新窗口 CORE_WARM_VH：「白 core → 橘」＋「底色黑→白」都搬到那裡發生。
//               改版前這兩件事是這樣的 —— 實心化與轉橘共用同一個係數（vSolid），
//               所以**根本沒有白 core 這個狀態**（凝成方塊的同一刻就是橘的）；
//               而整片底色從這一拍的第一幀就開始泛灰，人像還完整時畫面已經不是黑的了。
//               **收攏本身的 56vh 一字不動**（見 CORE_WARM_VH 的推導），face 那一拍也不動。
export const SYMBOL_BEAT_VH = {
  disperse: 1.12,
  face: 1.36,
  // 收攏 56vh ＋ 尾端 CORE_WARM_VH（白 core → 橘、底色翻白）。兩段的分界是 CORE_WARM_START。
  converge: 0.76,
  handoff: 0.4,
} as const;

/** 累計到每一拍**結束**時、距符號段起點的距離（× 視窗高）。門檻就從這裡換算。 */
const BEAT_END_VH = {
  disperse: SYMBOL_BEAT_VH.disperse,
  face: SYMBOL_BEAT_VH.disperse + SYMBOL_BEAT_VH.face,
  converge:
    SYMBOL_BEAT_VH.disperse + SYMBOL_BEAT_VH.face + SYMBOL_BEAT_VH.converge,
} as const;

/** 這段序列吃掉的捲動距離（× 視窗高）＝ 四拍總和，不是另外手寫的數字。
 *
 *  ⚠ 捨到 1e-6 是為了清掉 IEEE754 尾數：四拍直接相加得 3.4400000000000004，而這個值會流到
 *    dashboard 的 vh 讀數（TRACK_VH.symbol）與 SymbolScene 的段落高度上，讀起來像壞掉。
 *    1e-6 個視窗高 ＝ 0.0001vh，遠細於任何有意義的宣告值 → 不會蓋掉真正的宣告錯誤。 */
export const SYMBOL_VH =
  Math.round((BEAT_END_VH.converge + SYMBOL_BEAT_VH.handoff) * 1e6) / 1e6;

/**
 * 距符號段起點 vh（× 視窗高）→ symbolProgress（0..1）。**本段所有門檻的唯一算式。**
 *
 * 推導出來的門檻因此是無窮小數（0.8837…）而不是改版前那種漂亮的 0.84 —— 那是刻意的：
 * 它們是**推導值**，不該看起來像可以直接手改的旋鈕。改節奏請動 SYMBOL_BEAT_VH。
 * dashboard 顯示這些門檻時記得自己捨入（見 SEQUENCE 的 handoff label 與 DevCoreProgress）。
 */
export function symbolProgressAt(vh: number): number {
  return vh / SYMBOL_VH;
}

// ── 「白 core → 橘」窗口：converge 那一拍的尾端 ───────────────────────────
// 這段捲動距離內同時發生兩件事（曲線見 coreWarmAt / symbolBgLightAt）：
//   ① 已凝成實心的那顆 core 由**白**轉橘（改版前這是實心化的附帶效果，沒有獨立窗口）
//   ② 整片底色由黑轉白
// 在這之前的 56vh 是純粹的收攏：黑底、粒子收緊、末段凝成一顆**白**方塊。
//
// **這是本段唯一為了這件事新增的旋鈕**，改它就等於改 SYMBOL_BEAT_VH.converge 的尾巴
// （前段的收攏距離 ＝ converge − 本值，故要維持收攏節奏就得兩個一起動）。
//
// ⚠️ 下限來自「底色翻白要花多久」：改版前底色吃滿整拍 56vh，看起來從不刺眼；
//    搬到這裡之後它只剩本值。20vh 在閱讀捲速（ASSUMED_READING_VH_PER_S ＝ 25vh/s）下
//    約 0.8s —— 是一段可以看清楚的淡入。再短就會退化成白閃，那正是這次改版要避免的。
// ⚠️ 上限則是「core 停著不動的時間」：這段期間粒子已經全部到位（uConverge ＝ 1），
//    畫面上唯一在變的只有顏色。拉太長就會變回 2026-08-13 修掉的那種「一片靜止」。
export const CORE_WARM_VH = 0.2;

/** 白→橘在窗口內佔的比例（其後只剩底色還在追）。
 *
 *  < 1 是硬需求，不是美感偏好：core 的橘（相對亮度 ≈ 0.36）落在黑與白**之間**，
 *  所以底色掃過去的途中一定有某一刻與它等亮 —— 那一刻 26px 的 core 會看不見。
 *  改版前是靠「底色幾乎翻完了 core 才轉橘」繞開（白 core 在灰底上對比 2.6:1），
 *  而本次改版要的順序恰好相反，繞不開了。能做的是**縮短**那一刻：
 *  讓顏色先跑完，等亮的交會就只發生在底色自己的後段、且 core 已是最終色，
 *  不會出現「白 core 溶進白底」那種完全消失的狀況。
 *
 *  ⚠️ 這是已接受的殘留風險（同 SYMBOL_INTRO 那段捲速的寫法）：整片畫面正在做
 *     黑→白的大幅度變化，一顆 26px 方塊短暫等亮不會被讀成「東西不見了」。
 *     真要根治只能不讓底色在這裡翻白 —— 那就是改版前的設計。 */
export const CORE_WARM_COLOR_SPAN = 0.55;

/** 窗口起點（symbolProgress）＝ 收攏結束、core 已是一顆白方塊的那一刻。
 *  也就是 convergeAmountAt 的終點與 coreWarmAt / symbolBgLightAt 的起點，一個運算式、不會分家。 */
export const CORE_WARM_START = symbolProgressAt(
  BEAT_END_VH.converge - CORE_WARM_VH,
);

// 議程那 0.4s 的淡入必須發生在**畫面外**，判準是「符號段底緣距視窗底還有多遠」——
// 這就是 agendaIn 距段尾要留的距離（× 視窗高）。已驗證可行，不得變小。
//
// ⚠ test/symbol-sequence.spec.ts 那支測試**刻意硬寫 32、不 import 這個常數**：
//   它要守的就是「這個值不許退步」，import 進去就變成自我證明。
export const AGENDA_OFFSCREEN_VH = 0.32;

// ── forum 接棒門檻：converge 之後「白點 → 橘核心」的交接（symbolProgress 0..1）──
// coreIn ：SymbolFace 收斂點交棒給 ForumCore 橘方塊。＝ converge 段終點，也是 enter 段的起點。
//          **硬切、不是 crossfade** —— 收斂點在本門檻之前那段 CORE_WARM_VH 內已由白轉橘
//          （SymbolFace 的 convergeColor ＝ CORE.orange），到這裡兩顆同色同尺寸同位置，
//          直接換人畫。那段白→橘同樣吃捲動（coreWarmAt），且刻意比本門檻更早收齊到 1，
//          故任何捲速下交棒時都已經是純橘。
// coreOut：橘核心的滿版**白底**淡出。coreIn~coreOut 之間橘核心停在白畫面。
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
// ⚠ 三個值都是**推導的**，不是旋鈕：要調交棒時機請改 SYMBOL_BEAT_VH.converge（往後推交棒點
//   ＝ converge 那一拍變長）、要調黑畫面停留請改 SYMBOL_BEAT_VH.handoff。
export const FORUM_HANDOFF = {
  // converge 那一拍的終點 ＝ 3.04 / 3.44 ＝ 0.8837…（距段起點 304vh）
  coreIn: symbolProgressAt(BEAT_END_VH.converge),
  coreOut: 1.0,
  // 距段尾恆為 AGENDA_OFFSCREEN_VH（32vh）——**絕對距離**定錨、不隨總長等比縮放，
  // 因為它守的是「淡入發生在畫面外」，那件事的判準是 vh 不是比例。
  // 3.12 / 3.44 ＝ 0.9069…（距段起點 312vh）
  agendaIn: symbolProgressAt(SYMBOL_VH - AGENDA_OFFSCREEN_VH),
} as const;

// ── 星空 SymbolFace 序列（獨立黑底段落自己的捲動尺，見 01a.symbol/SymbolScene.vue）──
// 該段落的捲動進度（symbolProgress, 0..1）依門檻切換 SymbolFace 的 mode。
// 因為 scrub，往回捲會自動倒退。狀態：disperse → face（集合）→ converge（匯聚成點）
// → enter（收斂點淡出，交棒給 ForumCore 橘核心，見 FORUM_HANDOFF）。
// 每個狀態的起點由 SYMBOL_BEAT_VH 累加推導（見 SYMBOL_STOPS）；converge 終點就是
// FORUM_HANDOFF.coreIn（＝交棒時機），兩者同一個運算式、不會分家。
// ⚠️ 改 SYMBOL_BEAT_VH 之後，要同步 SymbolScene.vue 內的「symbolProgress 時序表」註解
//    —— 那張表是四拍 vh 的換算結果，不會自己更新。
// ── 開場三行文案（Figma 智慧論壇05：pc 2065:139731 / pad 2065:124199 / mob 2065:120221）──
// 疊在第一拍（disperse）上的一層純文字，見 01a.symbol/SymbolIntro.vue。
//
// 2026-08-12 改版：三行的動畫**不再綁捲動**，改吃時間軸（見 INTRO_TIMELINE）。
// symbolProgress 只剩兩個門檻，作用是「觸發」與「保底」，不再逐幀驅動任何值：
//   in   起播（滑到這裡就自己跑完整段，停著不動也看得完整）
//        退回這之前 → 重置成未播狀態，再進來從頭播一次（不是倒帶）
//   out  保底清場：越過就強制淡出，不管時間軸跑到哪
//
// ⚠️ out 必須早於 SYMBOL_STOPS[0].until（＝ disperse→face 的交界）——
//    文字要在粒子開始集合成人像之前淡乾淨，兩件事同時發生會互相搶焦點。
//    改吃時間軸後這條**不再自動成立**（時間軸不知道捲動位置），out 這道閘門是把它補回來的
//    唯一手段 —— 所以它比改版前更重要，不是比較不重要。
//
//    ⚠️ 但補回來的是「條件保證」，不是改版前那種**構造上**的保證：清場自己要花 clearDur
//    （0.3s），而越過 out 之後使用者還在往下捲。out 到人像集合只有
//    1.12 − 1.04 ＝ 8vh，換算：捲速 ≲ 27vh/s 時 8vh 走得比 0.3s 慢 → 淡乾淨；
//    **更快的捲速仍會短暫重疊**，而且沒有任何門檻安排救得回來（要救只能縮短 clearDur）。
//    這是已接受的殘留風險：那個速度的人是「一路往下滑」而不是在讀，本來就看不到內容。
//    守著這件事的不是 `out < until` 這個大小比較（清場改吃時間後它已不蘊含該性質），
//    而是 ASSUMED_READING_VH_PER_S 那條換算關係，見 test/symbol-sequence.spec.ts。
//
// 決策紀錄：architecture/2026-08-12-symbol-intro-timeline-design.md
//   （它推翻了前一版 architecture/2026-08-12-symbol-intro-stagger-design.md 第一節的 scrub 結論）
//
// 兩個門檻都用**絕對距離**定錨（同 FORUM_HANDOFF.agendaIn）：8vh 起播 → 104vh 保底清場，
// 中間 96vh。它們描述的是「文案在第一拍裡的位置」，第一拍的 vh 不變時就不該跟著總長飄。
// ⇒ 捲速慢於約 15vh/s 才看得完整段 6.4s。停下來讀的人沒問題（這正是不綁 scroll 的用意）；
//   一路不停往下捲的人會被截斷 —— 但那種人在 scrub 版本也只是一閃而過，不算退步。
export const SYMBOL_INTRO = {
  in: symbolProgressAt(0.08), // 8vh
  out: symbolProgressAt(1.04), // 104vh（距第一拍結束 8vh，見上方 clearDur 的說明）
} as const;

// 「一邊讀一邊往下捲」的假設捲速上限（vh/s）。
//
// ⚠️ 這是**假設，不是量測** —— 它描述我們願意為哪種使用者保證「文字在人像集合前淡乾淨」。
//    25vh/s 在 1080 高的螢幕上約 270px/s。實際觀察到的「穩定往下讀」約 170–200px/s
//    （16–19vh/s），故 25 已經是閱讀行為的上緣；再快的就是在滑過去、不是在讀。
//
// 用途只有一個：把「out 到人像集合的 8vh」換算成秒數，跟 clearDur 比大小
//（見 test/symbol-sequence.spec.ts）。調大它＝宣稱要保證更快的捲速，那條測試就會要求
// 更短的 clearDur 或更寬的 margin —— 這正是它存在的意義：讓那個取捨顯式化，不能默默劣化。
export const ASSUMED_READING_VH_PER_S = 25;

// 開場三行的時間軸（ms）。整段長度與各拍起點由行數推導，見 symbolIntroTotal /
// symbolIntroOutPhase —— 行數若從三行變四行，時間軸自己變長，不必手改。
//
// inStagger / inDur = 0.5 ＝ 相鄰兩行重疊一半（前一行升到一半，下一行才起跑），
// 承接改版前 INTRO_LINE_SPAN_RATIO = 2 的語意，故那個常數已刪除；outStagger 同理。
//
// 三行代入：0–2.0s 依序進場、2.0–5.0s 全亮停留（讀完三行）、5.0–6.4s 依序退場。
export const INTRO_TIMELINE = {
  inDur: 1000,
  inStagger: 500,
  hold: 3000,
  outDur: 700,
  outStagger: 350,
  // 保底清場（越過 SYMBOL_INTRO.out）的快速淡出長度。
  clearDur: 300,
} as const;

// 每行由多少 px 的下方升到定位；退場時再往上離場同樣的距離。
// 24px 對 44/48px 的行高約半行 —— 看得出來但不誇張。
export const INTRO_LINE_SHIFT = 24;
// 亂碼在自己那扇**進場**窗的多少比例處就落定完畢。< 1 ⇒ 最後一小段是「已可讀的整行」
// 升到定位，而不是升定的同一刻才落最後一個字。退場不跑亂碼，故與退場無關。
export const INTRO_REVEAL_SPAN = 0.8;

// GLSL 的 smoothstep：兩端一階導數為 0，淡入淡出的頭尾不會有硬轉折。
// 本檔僅此一處用到，不外掛工具檔。
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** 三行全部到位的時刻（ms）。私有：對外只暴露 outPhase / total 兩個時刻。 */
function introAllIn(count: number): number {
  return (count - 1) * INTRO_TIMELINE.inStagger + INTRO_TIMELINE.inDur;
}

/** 第 index 行開始退場的時刻（ms）。 */
function introOutStart(index: number, count: number): number {
  return (
    introAllIn(count) + INTRO_TIMELINE.hold + index * INTRO_TIMELINE.outStagger
  );
}

/** 時間軸進入退場段的時刻（ms）＝ 第一行開始退場。
 *
 *  ⚠️ 這支**沒有 app/ 內的消費端**（2026-08-13 起保底清場不再看它，見 symbolIntroGate 的
 *     那段註解）。留著是因為它是時間軸的**地標**：測試與文件要指涉「退場段」這個區間時
 *     需要一個定址點，刪掉的話那些測試就得在自己那邊重寫
 *     `(count−1)·inStagger + inDur + hold`，把公式抄成兩份 —— 而那份抄寫壞掉時
 *     測試會安靜地開始取樣錯誤的時刻。故它是刻意保留的測試／文件用 API，不是死程式碼。 */
export function symbolIntroOutPhase(count: number): number {
  return introOutStart(0, count);
}

/** 整段時間軸的長度（ms）。elapsed 到這裡＝演完，rAF 可以停。 */
export function symbolIntroTotal(count: number): number {
  return introOutStart(count - 1, count) + INTRO_TIMELINE.outDur;
}

/** 第 index 行（共 count 行）在時間軸 t（ms，自起播起算）時的狀態。
 *
 *  進場窗 [i·inStagger, +inDur]、退場窗 [outStart(i), +outDur]，中間是全亮停留。
 *
 *  ⚠️ shift **直接是最終位移、符號自己帶**（進場為正＝由下方升上來、退場為負＝繼續往上
 *     離場）。改版前的 `INTRO_LINE_SHIFT × (1 − opacity)` 只描述得出進場，
 *     退場也用那個公式的話字會往下掉回來 —— 三行要像一列字持續往上飄走。
 *
 *  ⚠️ reveal 用**線性**而不是 smoothstep：落字要等速，用 smoothstep 會變成
 *     「先慢、中間一次噴完、再慢」，看起來像掉幀。
 *
 *  純函式、不依賴 DOM —— 曲線由 test/symbol-sequence.spec.ts 守著。 */
export function symbolIntroLineAt(
  t: number,
  index: number,
  count: number,
): { opacity: number; shift: number; reveal: number } {
  const outStart = introOutStart(index, count);
  if (t >= outStart) {
    const k = smoothstep(outStart, outStart + INTRO_TIMELINE.outDur, t);
    return { opacity: 1 - k, shift: -INTRO_LINE_SHIFT * k, reveal: 1 };
  }
  const inStart = index * INTRO_TIMELINE.inStagger;
  const opacity = smoothstep(inStart, inStart + INTRO_TIMELINE.inDur, t);
  const local = (t - inStart) / INTRO_TIMELINE.inDur;
  const reveal = Math.min(1, Math.max(0, local / INTRO_REVEAL_SPAN));
  return { opacity, shift: INTRO_LINE_SHIFT * (1 - opacity), reveal };
}

/** 保底清場的**整組** opacity 乘數（1 ＝ 在場、0 ＝ 已清乾淨）。
 *  tc 自清場觸發那一刻起算，與時間軸的 elapsed 是**兩把獨立的尺**。
 *  消費端寫在根層的 style.opacity，乘在逐行的 opacity 之上。 */
export function symbolIntroClear(tc: number): number {
  return 1 - smoothstep(0, INTRO_TIMELINE.clearDur, tc);
}

/** 開場三行的播放狀態。兩個欄位是兩把獨立的尺，都以 null 表示「那把尺還沒起跑」。 */
export interface SymbolIntroState {
  /** 時間軸已跑的 ms；null ＝ 尚未起播（含 reset 之後）。 */
  elapsed: number | null;
  /** 保底清場已跑的 ms；null ＝ 未清場。 */
  clearElapsed: number | null;
}

/** 未播狀態。凍結避免消費端誤改共用物件（狀態轉換一律回傳新物件）。 */
export const SYMBOL_INTRO_IDLE: SymbolIntroState = Object.freeze({
  elapsed: null,
  clearElapsed: null,
});

/** 閘門：symbolProgress = p 時，播放狀態該怎麼變。
 *
 *  **狀態沒變就回傳同一個 reference** —— 消費端靠這件事跳過重繪，
 *  也讓「同一個 p 重複套用不會再變」這條冪等性可以直接用 toBe 測。
 *
 *  這是整套機制唯一的判斷所在：元件只負責持有狀態、推進 rAF、寫 DOM，不做判斷。
 *  四條規則見 architecture/2026-08-12-symbol-intro-timeline-design.md 第二節。 */
export function symbolIntroGate(
  s: SymbolIntroState,
  p: number,
  count: number,
): SymbolIntroState {
  if (p >= SYMBOL_INTRO.out) {
    if (s.clearElapsed !== null) return s; // 已在清場（或已清完）
    // ⚠️ 這裡**沒有**「已進入退場段就讓它自己跑完」的例外（2026-08-13 移除）。
    //    疊清場不會看起來斷掉：清場乘數乘在逐行 opacity 之上，兩條都是兩端一階導數為 0
    //    的遞減 smoothstep，相乘仍然單調遞減、兩端仍然平滑 —— 唯一的效果是**收得更快**，
    //    而收得更快正是 out 存在的目的。有那個例外時最壞情況要多留
    //    outDur + (count−1)·outStagger ＝ 1.4s 的尾巴，而 out 到人像集合只有 8vh
    //    （16–19vh/s 的閱讀捲速走完只要 0.42–0.5s）—— 於是最常見的捲速反而是唯一
    //    會撞上人像集合的一段。移除後最壞情況變成 clearDur ＝ 0.3s。
    // 從未起播就越過（重新整理落在符號段中段：progress 初值 0，
    // ScrollTrigger refresh 後才寫入真值）→ 直接跳到清場終點，
    // 否則畫面上會無故閃一下文字。
    return {
      elapsed: s.elapsed,
      clearElapsed: s.elapsed === null ? INTRO_TIMELINE.clearDur : 0,
    };
  }
  if (p >= SYMBOL_INTRO.in) {
    if (s.elapsed !== null || s.clearElapsed !== null) return s; // 不重播
    return { elapsed: 0, clearElapsed: null };
  }
  // p < in：回未播狀態，下次再進來從頭播一次（不是倒帶）
  return s.elapsed === null && s.clearElapsed === null ? s : SYMBOL_INTRO_IDLE;
}

/** 第 index 行在狀態 s 下該有的值（含 reduce-motion 的退化）。
 *
 *  reduce-motion：改吃時間軸後這三行是本頁唯一一段**自走播放**的動畫
 *  （捲動動畫由使用者的手控制，自走的不是），落在 WCAG 2.2.2 的範疇 ——
 *  故退化成「未起播 → 藏、已起播 → 全亮」的兩態，無 stagger、無亂碼、無位移。 */
export function symbolIntroLineState(
  s: SymbolIntroState,
  index: number,
  count: number,
  reduceMotion: boolean,
): { opacity: number; shift: number; reveal: number } {
  if (reduceMotion) {
    return s.elapsed === null
      ? { opacity: 0, shift: INTRO_LINE_SHIFT, reveal: 0 }
      : { opacity: 1, shift: 0, reveal: 1 };
  }
  return symbolIntroLineAt(s.elapsed ?? 0, index, count);
}

/** 還有東西需要逐幀推進嗎（兩把尺任一未跑完）。
 *
 *  ⚠️ 清場跑完就是**終態**（直到 gate 重置回 SYMBOL_INTRO_IDLE），此時不論 elapsed
 *     到哪都要停 —— 否則整組已經看不見了，rAF 還會為它空轉到 total，
 *     而那段時間正是粒子集合成人像那一拍（頁面最重的一刻），清場的目的就是讓路。 */
export function symbolIntroRunning(
  s: SymbolIntroState,
  reduceMotion: boolean,
  count: number,
): boolean {
  if (s.clearElapsed !== null) return s.clearElapsed < INTRO_TIMELINE.clearDur;
  if (reduceMotion) return false; // 兩態切換，沒有補間要跑
  return s.elapsed !== null && s.elapsed < symbolIntroTotal(count);
}

export const SYMBOL_STOPS: readonly {
  until: number;
  mode: 'disperse' | 'face' | 'converge' | 'enter';
}[] = [
  // 門檻全部由 SYMBOL_BEAT_VH 累加推導（vh 為距段起點的距離，SYMBOL_VH = 3.44 ⇒ 344vh）：
  { until: symbolProgressAt(BEAT_END_VH.disperse), mode: 'disperse' }, // →112vh (32.56%) 分散（疊開場文案，見 SYMBOL_INTRO）
  { until: symbolProgressAt(BEAT_END_VH.face), mode: 'face' }, //        →248vh (72.09%) 集合（人像）＝最長的一拍
  { until: FORUM_HANDOFF.coreIn, mode: 'converge' }, //                  →304vh (88.37%) 匯聚成點
  { until: 1.0, mode: 'enter' }, //                                      →344vh (100%)   收斂點淡出、橘核心接棒
];

/** 匯聚那一拍的收攏量（0 ＝ 還是完整人像、1 ＝ 已收成一顆點）。
 *  SymbolFace 的 uConverge 吃這一個值。
 *
 *  ⚠️ 2026-08-17 起**整片底色不再吃它**（改吃 symbolBgLightAt）：底色翻白已經搬到
 *     收攏之後那段 CORE_WARM_VH 的窗口去。所以這支的終點也從交棒點（coreIn）
 *     縮到 CORE_WARM_START —— 粒子必須在窗口**開始前**就全部到位，
 *     窗口內才會是一顆不動的白 core 在轉橘，而不是邊收邊轉色。
 *
 *  **這是本段唯一一個「值由捲動決定」而不是「由門檻觸發補間」的視覺**，2026-08-13 改的。
 *  改版前 converge 是 mode 翻面後跑一段固定 2.2s 的 gsap 補間（disperseDuration），
 *  而固定時長的補間永遠貼在區段的**前緣** —— 門檻是照「往下滑」排的，於是：
 *    順著滑 converge 那 56vh 的開頭就被補間填滿；
 *    往回滑整整 56vh 完全靜止，補間要到離開這一拍（248vh）才開始跑。
 *  加上其後 handoff 的 40vh 本來就是靜止的交棒段，往回滑會連續 96vh 只有一片白底
 *  ＋中央一顆 26px 橘方塊，什麼都不動（實測 ≈3.8s @25vh/s，順著滑只有 ≈1.6s）。
 *  這是使用者回報的「往回滑留白很久」。改成 progress 的純函式之後方向自然對稱，
 *  越過 304vh 的同一刻粒子就開始散回人像。
 *
 *  ⚠️ 端點必須**精確**是 0 與 1，不能只是「很接近」：終點 1 是與 ForumCore 那顆橘方塊
 *     硬切交棒的前提（同尺寸同位置，見 FORUM_HANDOFF.coreIn 與 SymbolFace 的 convergeSize），
 *     少一點就會在接棒那一幀看到縮一下。smoothstep 自帶夾邊，故區間外也安全。
 *
 *  ⚠️ 用 smoothstep 而不是線性：改版前那 2.2s 補間吃的是 power2.inOut（兩端慢中間快），
 *     smoothstep 是同一種手感的無參數版本，換成線性會讓收攏的起手與落點都變生硬。
 *
 *  純函式、不依賴 DOM —— 曲線由 test/symbol-sequence.spec.ts 守著。 */
export function convergeAmountAt(p: number): number {
  return smoothstep(symbolProgressAt(BEAT_END_VH.face), CORE_WARM_START, p);
}

/** 那顆 core 的「回溫量」：0 ＝ 還是白方塊、1 ＝ 已是 CORE.orange。
 *  SymbolFace 只讓它作用在**已實心化**的粒子上（uWarm × solid，見該元件的 vWarm）。
 *
 *  ⚠️ 終點必須精確是 1，且必須落在 coreIn 或之前 —— 與 ForumCore 那顆橘方塊硬切交棒的
 *     前提是「同色同尺寸同位置」，差一點點就會在接棒那一幀看到變色。
 *     這裡讓它在窗口的 CORE_WARM_COLOR_SPAN 處就到 1（＝ 比交棒點更早收齊），
 *     餘裕留給底色，理由見 CORE_WARM_COLOR_SPAN。
 *
 *  純函式、不依賴 DOM —— 曲線由 test/symbol-sequence.spec.ts 守著。 */
export function coreWarmAt(p: number): number {
  return smoothstep(
    CORE_WARM_START,
    CORE_WARM_START +
      (FORUM_HANDOFF.coreIn - CORE_WARM_START) * CORE_WARM_COLOR_SPAN,
    p,
  );
}

/** 整片底色的翻白量（0 ＝ 全黑、1 ＝ 全白）。SymbolFace 的 scene.background 吃這一個值。
 *
 *  與 coreWarmAt 同一個窗口、**同時起跑**（使用者的描述就是「white core 變成 orange 的
 *  過程，背景才會跟著變成白色」），但走完整個窗口 —— 顏色先收齊、底色殿後。
 *
 *  ⚠️ 終點同樣必須精確是 1：交棒那一刻轉場層開始淡出（0.35s，吃時間），底下露出的是
 *     `.sec-symbol` 與 ForumCore 的白底。canvas 若還沒全白就會在那道接縫看到黑閃 ——
 *     ForumCore 的 .forum-core__bg 註解記過同一類事故。
 *  ⚠️ 這條的安全邊際比改版前小很多：改版前底色在交棒點前 28vh 就幾乎全白，現在是
 *     **貼著**交棒點才到 1。往回捲時 ForumCore 的白底吃 0.4s CSS 淡出、本值吃捲動，
 *     快速往回捲會有短暫的灰（半透明白疊在正在轉黑的底上）。已知、可接受：
 *     那是往回捲專屬、且整片畫面本來就在做黑白翻轉。
 *
 *  純函式、不依賴 DOM —— 曲線由 test/symbol-sequence.spec.ts 守著。 */
export function symbolBgLightAt(p: number): number {
  return smoothstep(CORE_WARM_START, FORUM_HANDOFF.coreIn, p);
}

/** 底色已經過黑白的中點沒有？
 *
 *  段落底色（`.sec-symbol--light`）與 header 主題（data-header-theme）的翻面條件。
 *  它要跟著**真正的底色**走，所以綁的是 symbolBgLightAt —— 這條規則沒變，變的是底色
 *  自己搬去了 CORE_WARM_VH 那個窗口，故翻面點跟著搬（改版前是收攏量的中點）。
 *
 *  歷史：更早之前綁的是 `symbolMode === 'converge'`，那在 converge scrub 化之後會壞掉 ——
 *  mode 在 face 結束的那一刻就翻，底色卻要更晚才開始變白，header 會提早宣告自己站在
 *  淺色底上、改用深色內容，而底下其實還是全黑。這次改版把那個時間差從 56vh 拉到 66vh，
 *  綁 mode 只會錯得更多。
 *
 *  ⚠️ 代價：翻面現在發生在一段只有 CORE_WARM_VH（20vh）的窗口內，header 換色的
 *     那一下比改版前急。要更緩只能加大 CORE_WARM_VH。 */
export function convergeLightAt(p: number): boolean {
  return symbolBgLightAt(p) >= 0.5;
}

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

/** blessing 軌 p 時的逐格臉格號（0-based 整數；**逐格 ＝ 不做補間**）。
 *
 *  尾端 BLESSING_HOLD 這段停在最後一格 —— 臉畫完後定住一下再交棒給夥伴清單。
 *  消費端是 useOrangeCoreProgress 的 blessingFrame（那裡另外處理 reduce-motion：
 *  減少動態時不隨捲動變化，直接停在完成的笑臉）。
 *
 *  抽成純函式而不留在 composable 裡：`#blessing` 的落點（BLESSING_ANCHOR_VH）就是
 *  用這個映射定義的「最後一格出現的時刻」，而那條不變量只有在兩者共用同一份算式時
 *  才守得住（見 test/header-anchors.spec.ts）。 */
export function blessingFrameAt(p: number): number {
  const span = 1 - BLESSING_HOLD;
  const local = span > 0 ? p / span : 1;
  const i = Math.floor(Math.min(1, Math.max(0, local)) * FACE_FRAME_COUNT);
  return Math.min(FACE_FRAME_COUNT - 1, i);
}

/** header 的 `#blessing` 落在段落內多深（× 視窗高）。
 *
 *  設計師指定的落點是「第一顆笑臉逐格走完的那一刻」，不是段落上緣 ——
 *  上緣是 02 → 03 覆蓋過場的**接縫**，那一刻臉還沒開始畫（第 0 格是一塊白方塊）。
 *
 *  ⚠️ 起算點是 `.section3` 的上緣，而落點的定義卻在**臉的捲動尺**（`.section3__face-track`）
 *     的座標系裡 —— 兩者恆等：捲動尺是 `.section3` 的第一個**佔位**子元素（它前面只有
 *     `.section3__veil`，那是 fixed），且 `.section3` 沒有 padding-top。這條性質壞掉的話
 *     落點會整段偏移，畫面上不會有東西壞掉喊出來。
 *
 *  ⚠️ 取停格的起點（1 − BLESSING_HOLD），而不是「最後一格剛出現的那一刻」
 *     （後者是 ×(格數−1)/格數，早 0.05 個進度）：停格的起點就是設計上「臉畫完」的
 *     定義，且它離最後一格的邊界還有 0.05 個進度 ＝ 0.06 個視窗高（1080 高的視窗約
 *     65px）的餘裕 —— 落在邊界上，量測誤差幾 px 就會退回前一格（嘴還沒上揚，不是笑臉）。
 *     由 test/header-anchors.spec.ts 守著「落點必須是最後一格」。 */
export const BLESSING_ANCHOR_VH = BLESSING_VH * (1 - BLESSING_HOLD);

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
//
// 2026-08-18：fade 0.85 → 1.0，**呼吸拍歸零**（窗口長度 0.6 不動）。
//   使用者回饋：03 → 04 之間有一段「滿版純橘、什麼都不動」的空窗期。那段是兩截
//   相連的橘：本檔的呼吸拍 9vh，接著 media 拍 0 的滿版收窄 17.7vh（那截另外處理，
//   見 useMediaIntroMotion 的 NARROW_DUR 與拍 0 的 ease）。呼吸拍是這兩截裡唯一
//   「畫面上真的沒有任何東西在變」的一段 —— 它原本的用意是「接縫離開視窗頂時只剩橘」，
//   而 fade = 1.0 讓淡出**剛好**在接縫抵達視窗頂那一刻收乾淨，同一個保證仍然成立
//   （smoothstep 的尾巴一階導數為 0，p ≈ 0.92 起 opacity 已 < 0.02，肉眼早就淨空）。
//   ⚠️ 這是本值的上限：> 1 會讓淡出在接縫離開視窗頂之後才收完 —— 那時 media 已經
//      在收窄，夥伴清單會殘留在橘塊上。
//
// 2026-08-18（第二次）：fade 1.0 → 0.55。方向與同日第一次相反，因為窗口的性質變了。
//   第一次把它推到 1.0 是為了吃掉尾端那段靜止的呼吸拍（不淡完也沒事做）。融合拍改版
//   之後**整段窗口都在動**（veil 與 morph 同步收窄），而夥伴清單面板約 72vw 寬、比
//   veil 的終點 MEDIA_BLOCK_VW 寬 —— 清單若撐到窗口尾端才淡完，卡片（白底白框）的
//   邊緣會落在已經露白的兩側上、失去輪廓。故清單必須比 veil 收到底更早淡乾淨。
//   ⚠️ 下限來自「淡出要看得出是一個動作」：0.55 × 60vh ＝ 33vh，閱讀捲速下約 1.3s。
//
// 2026-08-18：本值同時成為 **media 拍 0 的跑道長度**（ScrollTrigger 提早這麼多），
//   也就是整段融合拍的唯一長度旋鈕 —— 清單淡出、veil 收窄、morph 收窄全部吃這一段。
//   見 narrowDurationFor 與融合設計文件。
//
// 2026-08-21：0.6 → 0.5，整段融合拍變快約 17%。
//   ⚠️ **只調本值，OUT_FADE 不要跟著動。** 兩條曲線都活在「拍內進度」的座標系裡
//      （清單淡出吃 outroST 的 normalized progress，veil／morph 收窄吃 timeline 的
//      normalized ease），不是絕對 px —— 所以縮短跑道**只改速度，不改任何一組相對
//      關係**：交棒點（narrowDurationFor 由本值推導）、「清單必須比 veil 收到底更早
//      淡乾淨」（上一則）、header 翻 light 的門檻（mediaHeaderLightAt 由 timeline 地標
//      推導）全部等比跟著縮。動 OUT_FADE 才會把那些關係一次弄壞。
//   代價是拿上一則那條下限換的：0.55 × 50vh ＝ 27.5vh，閱讀捲速下約 1.1s（原 1.3s）。
//      要再更短就繼續調本值，不要碰 OUT_FADE。
//   ⚠️ **不要**改用「讓 veil 直接消失」來省掉這一段。2026-08-21 實測過，會露餡兩處
//      （接縫變成一條可見橫線、header 反白窗變白字疊白底），記錄見融合設計文件末節。
export const BLESSING_OUT_VH = 0.5;
export const BLESSING_OUT_FADE = 0.55;

// ── 03 → 04 融合拍：veil 與 morph 的交棒 ──────────────────────────────
// 完整設計見 architecture/2026-08-18-blessing-media-morph-fusion-design.md。
//
// MEDIA_BLOCK_VW：分鏡 1 的色塊寬（× 視窗寬）＝ 拍 0 的終點寬 ＝ 拍 1 的起點寬。
//
// ⚠️ 這個值原本是 useMediaIntroMotion 的區域 const `BLOCK_VW`。它現在是**兩個元件
//    共用的交棒尺寸**（`.section3__veil` 與 `.media__morph` 在拍 0 結束時必須同寬），
//    所以只能有一份。各寫一份就會在調值時脫鉤，而畫面上只是「交棒那一幀寬度跳一下」，
//    不會有任何東西壞掉喊出來。
export const MEDIA_BLOCK_VW = 0.6;

// 拍 0 的 ease：veil 與 morph **共用同一條**（同一拍的兩個 target）。
//
// 頭必須快：使用者要的是「這一拍整個橘色區域在動」。power2.inOut 的慢起讓開頭幾乎
//   看不出白邊在長，滿版橘因此讀成「停住不動」—— 那正是本次改版要消掉的空窗期。
// 尾必須慢：拍 1 是 power3.inOut（慢起），拍 0 若在交界處還是全速就看得到轉折。
//   power2.out 的尾端一階導數為 0，接得上。
// ⚠️ 不可改成 'none' 或 'power2.in'。
export const FUSE_EASE = 'power2.out';

/** 拍 0 的 timeline 長度（單位同 timeline）。
 *
 *  **推導值，不是旋鈕** —— 要調融合拍的長短請改 BLESSING_OUT_VH（它同時是
 *  ScrollTrigger 提早的跑道長度）。
 *
 *  推導：timeline 總長 `rest + narrow` 對映到捲動距離 `holdBuffer + runway`，
 *  而拍 0 佔掉的 px 必須恰好等於 runway（提早的那段跑道）：
 *
 *      narrow / (rest + narrow) × (holdBuffer + runway) = runway
 *      ⇒ narrow = rest × runway / holdBuffer
 *
 *  對不上的症狀是空窗期換個寬度重演：收窄提早結束 → 留下一段靜止的
 *  MEDIA_BLOCK_VW 寬橘柱；收窄太晚結束 → 接縫已到頂、交棒點卻還沒到。
 *
 *  ⚠️ 這條取代了改版前「手寫 NARROW_DUR ＋ 手算 HOLD_BUFFER ≈ (5.1 + NARROW_DUR) × 392」
 *     的雙向手動同步。rest 逐斷點不同（pc 5.1 / mob 4.8，mob 無 bar），故必須是參數，
 *     不能寫死。
 *
 *  純函式、不依賴 DOM —— 關係由 test/media-fuse.spec.ts 守著。 */
export function narrowDurationFor(
  restDuration: number,
  runwayPx: number,
  holdBufferPx: number,
): number {
  return (restDuration * runwayPx) / holdBufferPx;
}

/** media 開場 motion：progress 走到這裡時 header 該翻 light 了嗎。
 *
 *  `beat1EndTime` ＝ 拍 1 結束的 timeline 時刻（＝ 拍 0 長度 ＋ 拍 1 長度）。門檻放在
 *  這裡而不是拍 0 結束：拍 0 結束時橘柱還有 MEDIA_BLOCK_VW 寬，header 一翻成 70% 白
 *  就會在白帶中央透出一塊橘 —— 那正是 2026-08-18 使用者回報的「露餡」。收成 28px
 *  細條之後翻，帶子背後只剩一條細縫。
 *
 *  ⚠️ duration 為 0（timeline 還沒建好）時回 false（＝ orange）：那一刻畫面上是滿版橘，
 *     提前宣告 light 會讓 header 用深色內容疊在橘底上。
 *
 *  純函式、不依賴 DOM —— 由 test/media-fuse.spec.ts 守著。 */
export function mediaHeaderLightAt(
  progress: number,
  beat1EndTime: number,
  duration: number,
): boolean {
  return duration > 0 && progress >= beat1EndTime / duration;
}

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

/** `.section3` 底色的「翻白量」（0 ＝ 照原本的藍→橘、1 ＝ 白）。
 *
 *  二元、不內插 —— 切換的那一刻 `.section3__veil` 剛好是滿版（拍 0 `fromTo` 的起點），
 *  底色被完全遮住，所以硬切看不到。補間只會多出一條要與 veil 對齊的曲線。
 *
 *  `armed` ＝ media 的 timeline 真的建起來了嗎（見 useMediaIntroMotion）。
 *  ⚠️ 這個參數不是防禦性程式碼，是**必要條件**：reduce-motion / `/#media` 深連結 / 無 JS
 *     三條路徑都不建 timeline ⇒ veil 停在 CSS 初始態不會現身，此時若底色照樣翻白，
 *     blessing 整段會變成白底白字。veil 與底色必須同生共死。
 *
 *  純函式、不依賴 DOM —— 由 test/blessing-outro.spec.ts 守著。 */
export function outroWhiteAt(armed: boolean, outProgress: number): 0 | 1 {
  return armed && outProgress > 0 ? 1 : 0;
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
 *  smoothstep 的頭段幾乎不動 → 讀起來像「從色塊邊緣冒出來」，末端才緩緩落進格子。
 *
 *  ⚠️ 起點是**長完之後**（COVER_CONTACT + COVER_HANDOFF_SPAN），不是接觸點：
 *     兩件事重疊的話方塊會邊長邊沉，上緣立刻脫離接縫，看起來是浮在色塊裡的一塊白
 *     （2026-08-14 實測，長到 75% 時已離開接縫 8.7px）。「從接縫長出來」要成立，
 *     上緣就必須在長完之前一直貼著接縫。
 *     終點仍是 1（cover 跑完＝就位），故沉的距離不變、只是晚 COVER_HANDOFF_SPAN 才起跑。 */
export function seedTravelAt(p: number): number {
  return smoothstep(COVER_CONTACT + COVER_HANDOFF_SPAN, 1, p);
}

// ── 接觸點的變身：飛機鑽進色塊 ／ 白方塊從接縫長出來 ────────────────────
// 2026-08-14 改版。改版前這兩件事都是**瞬間**的：飛機在接觸點直接 opacity: 0、
// 白方塊在同一刻以完整尺寸憑空出現（使用者回饋「碰到 blessing 就直接消失／直接出現」）。
// 現在兩者都吃下面這一條曲線，在接觸點之後的 COVER_HANDOFF_SPAN 內同時發生：
// 飛機沿末端切線繼續往前推、被色塊遮住；白方塊同一個位置從接縫長出來。
// 兩者的 x 本來就重合（設計線末節點刻意挪到臉的第 01 格上，見 2026-08-12 紀錄第四節），
// 所以它讀起來是**同一個變身**，不是兩個各自的動畫 —— 故共用一個旋鈕，不拆成兩個。
//
// 為什麼「鑽進去」遮得住、而且不需要持續追蹤：
//   `.sec2__path`（飛機在裡面）與 `.section3` 都是 z-index: 1，同值由 DOM 順序決勝
//   → 色塊畫在飛機之上（見 2026-08-12 紀錄第二節「層序」）。
//   而飛機的路徑末節點錨在 `.sec2__seam`、色塊上緣就是同一個位置，兩者在同一個座標系裡
//   1:1 一起捲動 —— 推下去之後它**永遠**在色塊之下，不必每幀去追接縫。
//   （這也是改版前它會「一路露在畫面上緣」的原因：不推的話它就黏在接縫上。）
export const COVER_HANDOFF_SPAN = 0.15;

// 飛機沉到「機身最上緣剛好沒入接縫」之後，再多推的餘裕（px）。
//
// **推的總距離不是常數，是量出來的**（見 ForumCorePath 的 planeOverhang）：
// 真正要走完的只有「機身露在接縫上方的那一截」，而它在接觸點就已經很小了 ——
// pc 實測 13.8px（設計線末端切線幾乎垂直，sprite 旋轉近 180° 之後大半本來就在接縫下）。
//
// ⚠️ 這裡曾經寫成一個固定的 90px（＝ hypot(72/2, 88−13) 那個旋轉不變的最壞半徑）。
//    那個值「一定遮得住」，但它讓 easeOutQuad 的前段吃掉整段距離 —— 實測**捲 7px**
//    機身就看不見了，等於還是「直接消失」，改版的目的完全沒達到。
//    改成量測之後，那 13.8px 會鋪滿窗口的前 ~40%（pc ≈ 53px 捲動），才看得出是鑽進去的。
// ⚠️ 餘裕別再放大：它是加在「已經看不見」之後的，只會把可見的那一段壓縮回去。
export const PLANE_DIVE_MARGIN_PX = 8;

/** 二次 ease-out。**起點的一階導數不為 0**，終點為 0。
 *
 *  ⚠️ 這裡刻意不用本檔其他地方慣用的 smoothstep：它兩端導數都是 0，而飛機在接觸的前一刻
 *     還在以捲動速度飛 —— 起手停一下再動看得出來（「卡了一下才鑽進去」）。
 *     ease-out 則是「保持衝勁進去、被吞掉時減速」，也順帶讓白方塊像是被頂出來的。 */
function easeOutQuad(t: number): number {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  return 1 - (1 - k) * (1 - k);
}

/** cover 軌 p 時「接觸點變身」的進度（0 ＝ 接觸的那一刻、1 ＝ 變身完成）。
 *
 *  三個消費端共讀它：飛機的下潛距離（× PLANE_DIVE_PX）、彗星尾的淡出（1 − 本值）、
 *  白方塊的 scaleY。**一個值餵三個視覺**是它們同步的唯一保證。
 *
 *  ⚠️ 端點要精確：0 才保證接觸前飛機不會提早離開接縫、白方塊不會提早露出來；
 *     1 是飛機已完全沒入（coverHandedOff 在同一點把 opacity 收掉當保險）。
 *     easeOutQuad 自帶夾邊，故區間外也安全。
 *
 *  純函式、不依賴 DOM —— 曲線由 test/blessing-cover.spec.ts 守著。 */
export function coverHandoffAt(p: number): number {
  return easeOutQuad((p - COVER_CONTACT) / COVER_HANDOFF_SPAN);
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
//   forum.face.59% → symbolProgress = 0.3077 + 0.59 × (0.6813 − 0.3077) = 0.5281
//                  → 距符號段起點 192.24vh（SYMBOL_VH 3.64 ＝ 364vh）
//   ⚠️ 地址講的是**該拍內的比例**，所以 vh 只隨那一拍的 SYMBOL_BEAT_VH 變，不隨總長變 ——
//      2026-08-13 把總長從 400 縮到 344vh 之後，face 的 vh 換算（112 + 0.59 × 136）一字不動，
//      只有 progress 那個中間值變了。這正是「地址寫節點／拍，不寫 %」的用意。
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
      // converge 那一拍在 dashboard 上切成兩段：前段收攏（底色仍是黑）、後段白 core 轉橘
      // ＋底色翻白。兩段的分界是 CORE_WARM_START，與 convergeAmountAt / coreWarmAt 同一個值。
      { key: 'converge', label: '匯聚成一顆白點（底色仍黑）', drive: 'scrub', track: 'symbol', from: SYMBOL_STOPS[1]!.until, until: CORE_WARM_START },
      { key: 'warm', label: `白點轉橘、底色翻白（${CORE_WARM_VH * 100}vh）`, drive: 'scrub', track: 'symbol', from: CORE_WARM_START, until: FORUM_HANDOFF.coreIn },
      // agendaIn 是推導值（無窮小數），label 要自己捨入 —— 直接內插會印出 0.9069767441860465。
      { key: 'handoff', label: `交棒：白點→橘核心（agendaIn ${(FORUM_HANDOFF.agendaIn * 100).toFixed(1)}%）`, drive: 'scrub', track: 'symbol', from: FORUM_HANDOFF.coreIn, until: 1 },
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
      // label 不寫「其後純橘」：這句話靠的是 BLESSING_OUT_FADE ≤ 1 這個性質（百分比
      // 是內插進來的），不是它目前的數值 —— 旋鈕調到任何 ≤ 1 的值都成立，不必再改一次。
      // ⚠️ 百分比要 Math.round：BLESSING_OUT_FADE 不保證是能被 100 整除的「乾淨」小數
      //   （0.55 × 100 在 IEEE754 下是 55.00000000000001），捨入前那串尾數會直接流進
      //   dashboard 的 label 字串，讀起來像壞掉；捨到整數 % 對這個顯示用途夠精細。
      { key: 'outro', label: `夥伴清單淡出（窗口前 ${Math.round(BLESSING_OUT_FADE * 100)}% 淡完）`, drive: 'scrub', track: 'blessingOut' },
    ],
  },
];
