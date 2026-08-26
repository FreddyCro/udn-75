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

  /**
   * 撇的兩端與驅動線的最大容許距離 —— 超過就**不畫**那一撇，並在 dev 吼一聲
   *（算式與實測值見 ~/utils/forum-slash 的 slashAlignment）。
   *
   * 這是「撇畫在 A、核心在 B」的唯一防線。pad／mob 的線已經把節點錨在撇本身
   *（forum-node-path 的 SLASH_SEL），程式保證重合；**pc 的 d 是手貼的**，只有這道守衛。
   * 動 pc 的 FORUM_PATH，或動任何斷點的 --coreslash-x/y，都先看 console 有沒有這則警告。
   */
  alignTol: { px: 12, ratio: 0.12 },
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
// 那些門檻只在某一個總長之下才對應到想要的絕對距離。動了總長就整批靜默錯位 ——
// 四拍的 vh 全部跑掉，而畫面上只會覺得「節奏怪怪的」，沒有任何東西會壞掉喊出來。
// 改成 vh 當來源之後 SYMBOL_RAIL_VH ＝ 四拍總和、門檻由累加推導，總長與各拍再也不可能對不上
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
//               ⚠ handoff 已接近下限：40 ＝ 8vh 停留 ＋ 當時的「議程淡入要在畫面外」32vh。
//                 （那條下限已於 2026-08-22 消失，見 AGENDA_IN_LEAD_VH。）
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
//   2026-08-22  handoff 0.4 → 0.1，且捲動尺延長到「接縫抵達視窗中央」（見 SYMBOL_HOVER_VH）。
//               需求是「聚合成 orange core 的同一屏就要看到論壇主標」。前三拍的絕對距離
//               一字不動（112 / 136 / 76vh）—— 改掉的全是交棒**之後**那 90vh 的空白：
//               舊的 40vh 黑畫面停留 ＋ 舊的 50vh 無軌懸停期 → 只剩 10vh。
//               ⚠ handoff 的**語意變了**：它不再是「交棒後還要多久才捲完段落」，而是
//                 「交棒後到論壇段路徑接手的停留」，且它直接決定交棒那一刻接縫在螢幕上的
//                 高度（見 SEAM_AT_HANDOFF_VH）—— 也就是「看得到多少論壇文字」。
export const SYMBOL_BEAT_VH = {
  disperse: 1.12,
  face: 1.36,
  // 收攏 56vh ＋ 尾端 CORE_WARM_VH（白 core → 橘、底色翻白）。兩段的分界是 CORE_WARM_START。
  converge: 0.76,
  // 交棒之後、論壇段路徑接手之前的停留。
  // **上限**來自「交棒時論壇主標要完整可見」（見 SEAM_AT_HANDOFF_VH）；
  // **下限**來自轉場層那 0.35s 的淡出要跑得完（0.35s × ASSUMED_READING_VH_PER_S ≈ 8.75vh）
  // —— 沒跑完就換路徑核心接手，中央會同時有「正在淡出的收斂點」與「開始移動的路徑核心」。
  // 兩邊都由 test/symbol-sequence.spec.ts 守著。
  handoff: 0.1,
} as const;

// ── 懸停期：接縫（`.sec2` 頂端）從視窗底緣升到視窗中央的那 50vh ──────────────
// **幾何常數，不是旋鈕。** 論壇段路徑的起點被「零跳點」鎖在 `.sec2__path` 頂端抵達視窗
// 正中央那一刻（ForumCorePath 的 start: 'top center'），而接縫從視窗底緣走到中央恆為半個視窗。
//
// 2026-08-22 起這 50vh **併進捲動尺內**（SymbolScene 的 end 由 'bottom bottom' 改成
// 'bottom center'），不再是 SEQUENCE 裡那個 drive: 'none' 的無軌區間。
//
// ⚠ 為什麼非得動尺的 end、而不是調段落長度：舊尺的 end 綁在段落底緣
//   ⇒ progress = 1 ⟺ 接縫剛好在視窗底緣，而交棒點恆 < 1
//   ⇒ **交棒那一刻接縫必然還在畫面外**，一個論壇的字都看不到。
//   而且交棒點到接縫的距離 ＝ SYMBOL_VH − BEAT_END_VH.converge ＝ SYMBOL_BEAT_VH.handoff
//   （總長全部約掉）—— 所以「把符號段拉長／縮短」對這件事**完全無效**，
//   前三拍怎麼調都動不到它，就算把 handoff 壓到 0 也只是讓接縫貼在視窗底緣。
//   尺延長到接縫抵達中央之後，段落高度反而變短（SYMBOL_VH ＝ 尺長 − 本值），
//   接縫因此得以在交棒**之前**就升進畫面。
export const SYMBOL_HOVER_VH = 0.5;

/** 累計到每一拍**結束**時、距**捲動尺**起點的距離（× 視窗高）。門檻就從這裡換算。 */
const BEAT_END_VH = {
  disperse: SYMBOL_BEAT_VH.disperse,
  face: SYMBOL_BEAT_VH.disperse + SYMBOL_BEAT_VH.face,
  converge:
    SYMBOL_BEAT_VH.disperse + SYMBOL_BEAT_VH.face + SYMBOL_BEAT_VH.converge,
} as const;

/** **捲動尺**吃掉的總距離（× 視窗高）＝ 四拍總和，不是另外手寫的數字。所有門檻的分母。
 *
 *  ⚠ 它**不等於段落高度**：尺比段落長出 SYMBOL_HOVER_VH（end: 'bottom center'），見 SYMBOL_VH。
 *    兩者在 2026-08-22 分家；在那之前 SYMBOL_VH 一個值同時是尺長與段高。
 *  ⚠ 捨到 1e-6 是為了清掉 IEEE754 尾數：四拍直接相加得 3.3400000000000003，而這個值會流到
 *    dashboard 的 vh 讀數（TRACK_VH.symbol）上，讀起來像壞掉。
 *    1e-6 個視窗高 ＝ 0.0001vh，遠細於任何有意義的宣告值 → 不會蓋掉真正的宣告錯誤。 */
export const SYMBOL_RAIL_VH =
  Math.round((BEAT_END_VH.converge + SYMBOL_BEAT_VH.handoff) * 1e6) / 1e6;

/** `.sec-symbol` 的高度（× 視窗高）＝ 尺長 − 懸停期。SymbolScene 只吃這一個值。
 *
 *  它是**推導值**：段落之所以比尺短，是因為尺的 end 收在「段落底緣抵達視窗中央」
 *  （見 SYMBOL_HOVER_VH）。要調段落長度請動 SYMBOL_BEAT_VH，不要改這裡。 */
export const SYMBOL_VH =
  Math.round((SYMBOL_RAIL_VH - SYMBOL_HOVER_VH) * 1e6) / 1e6;

/** 交棒那一刻「接縫」在螢幕上的高度（× 視窗高，0 ＝ 視窗頂緣）。
 *
 *  推導：接縫在 progress p 時的螢幕高度 ＝ SYMBOL_VH + 1 − p × SYMBOL_RAIL_VH。
 *  代入 coreIn（＝ BEAT_END_VH.converge / SYMBOL_RAIL_VH）之後總長全部約掉，
 *  只剩 SYMBOL_HOVER_VH + SYMBOL_BEAT_VH.handoff —— 這就是下面那個式子。
 *
 *  **它就是「聚合完成的同一屏看得到多少論壇文字」**：論壇主標從接縫下方 140px 起
 *  （`.sec2__path` 的 padding-top，pad/mob 是 120px），故 1 − 本值 是主標可用的空間。
 *  最矮的實測尺寸 1440×700 需要 38vh（140px padding ＋ 兩行主標到字形底緣 265.7px），
 *  故本值不得大於 0.62；現值 0.6 留 2vh 餘裕。由 test/symbol-sequence.spec.ts 守著。 */
export const SEAM_AT_HANDOFF_VH =
  Math.round((SYMBOL_HOVER_VH + SYMBOL_BEAT_VH.handoff) * 1e6) / 1e6;

/**
 * 距**捲動尺**起點 vh（× 視窗高）→ symbolProgress（0..1）。**本段所有門檻的唯一算式。**
 *
 * 推導出來的門檻因此是無窮小數（0.9700…）而不是漂亮的整數 —— 那是刻意的：
 * 它們是**推導值**，不該看起來像可以直接手改的旋鈕。改節奏請動 SYMBOL_BEAT_VH。
 * dashboard 顯示這些門檻時記得自己捨入（見 SEQUENCE 的 handoff label 與 DevCoreProgress）。
 *
 * ⚠ 分母是尺長、不是段落高度（2026-08-22 起兩者不同，見 SYMBOL_HOVER_VH）。
 */
export function symbolProgressAt(vh: number): number {
  return vh / SYMBOL_RAIL_VH;
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

// `.sec2__path` 與議程整組那 0.4s 的淡入要在**還沒被人看到**的時候跑完；本值就是
// agendaIn 必須早於交棒點的距離（× 視窗高）。
//
// ⚠ 2026-08-22 判準換了。改版前是「發生在畫面外」（接縫還在視窗底下方 32vh）——
//   而現在接縫在交棒**之前**就升進畫面了（見 SYMBOL_HOVER_VH），那條判準已不成立。
//   新的遮蔽物是**轉場層**：fixed 滿版、不透明，直到交棒點才開始淡出
//   （HeroSymbolTransition 的 is-hidden）。於是要守的變成「淡入在轉場層還蓋著時跑完」：
//     本值 / ASSUMED_READING_VH_PER_S ≥ 0.4s（`.sec2__path` 的 CSS transition）
//   20vh / 25vh/s ＝ 0.8s，是 0.4s 的兩倍餘裕。
//
// ⚠ test/symbol-sequence.spec.ts 那支測試**刻意硬寫 0.4**：CSS 的 transition 讀不到，
//   只能人工同步 —— 改 `.sec2__path` 的 0.4s 要回來看這裡。
export const AGENDA_IN_LEAD_VH = 0.2;

// ── forum 接棒門檻：converge 之後「白點 → 橘核心」的交接（symbolProgress 0..1）──
// coreIn ：SymbolFace 收斂點交棒給 ForumCore 橘方塊。＝ converge 段終點，也是 enter 段的起點。
//          **硬切、不是 crossfade** —— 收斂點在本門檻之前那段 CORE_WARM_VH 內已由白轉橘
//          （SymbolFace 的 convergeColor ＝ CORE.orange），到這裡兩顆同色同尺寸同位置，
//          直接換人畫。那段白→橘同樣吃捲動（coreWarmAt），且刻意比本門檻更早收齊到 1，
//          故任何捲速下交棒時都已經是純橘。
//          ⚠ 2026-08-22 起這一刻**同時是論壇內容的現身點**：轉場層一淡出，底下已經是
//            「接縫在螢幕 60vh（SEAM_AT_HANDOFF_VH）、論壇主標在它下方」的畫面。
//            改版前這一刻底下什麼都沒有（接縫還在畫面外 40vh），要再捲 90vh 才看得到字。
// coreOut：橘點的收場點，**只有無設計線的斷點**用得到（見 forumCoreDotVisible）。
//          恆為 1.0 ＝ 接縫抵達視窗中央 ＝ 有設計線時路徑接手的同一刻，兩條路徑因此同時收。
// agendaIn：`.sec2__path` 與議程整組淡入。早於 coreIn 恰好 AGENDA_IN_LEAD_VH，
//          讓那 0.4s 在轉場層還蓋著的時候跑完（判準見該常數）。
// 淡出入為「固定時間」（CSS transition）；往回捲自動倒退（CSS 轉場可逆）。
//
// ⚠ 三個值都是**推導的**，不是旋鈕：要調交棒時機請改 SYMBOL_BEAT_VH.converge
//   （往後推交棒點 ＝ converge 那一拍變長）；要調交棒後的停留、以及「聚合完成時看得到
//   多少論壇文字」，請改 SYMBOL_BEAT_VH.handoff（見 SEAM_AT_HANDOFF_VH）。
// ⚠ 2026-08-22 移除了原本吃 [coreIn, coreOut) 的那層**滿版白底**（ForumCore 的
//   .forum-core__bg）。它的任務是「保證交棒這段是白的」，而交棒點之後畫面上半是
//   `.sec-symbol--light`（白）、下半是 `.sec2`（白），本來就白 ——
//   留著只會把剛升上來的論壇主標整片蓋掉，那正是這次要修的東西。
export const FORUM_HANDOFF = {
  // converge 那一拍的終點 ＝ 3.24 / 3.34 ＝ 0.9700…（距尺起點 324vh）
  coreIn: symbolProgressAt(BEAT_END_VH.converge),
  coreOut: 1.0,
  // 早於 coreIn 恆為 AGENDA_IN_LEAD_VH（20vh）——**絕對距離**定錨、不隨總長等比縮放，
  // 因為它守的是「0.4s 的淡入跑得完」，那件事的判準是 vh 不是比例。
  // 3.04 / 3.34 ＝ 0.9101…（距尺起點 304vh）
  agendaIn: symbolProgressAt(BEAT_END_VH.converge - AGENDA_IN_LEAD_VH),
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
// 2026-08-26 改版：**進場吃時間軸、退場吃捲動**，兩把尺各管一半。
//   進場  捲到 in 就起播，2.0s 內三行依序上浮 ＋ 逐字亂碼落定 ——
//         停在原地不動也看得完整（這是 2026-08-12 改版的成果，本次不動）。
//   停留  三行到位之後就停在全亮，**不會自己消失**。停多久由使用者決定。
//   退場  exit → out 這段距離逐幀 scrub，捲多少退多少；往回捲文字會回來。
//
// 為什麼退場不能也吃時間軸：改版前那個 hold ＝ 3s 是一個**賭注** —— 賭使用者在三秒內
// 讀完三行。讀得慢的人字在眼前消失、讀完的人還得等，兩邊都不對，而頁面無從得知是哪一種。
// 距離不賭這件事：停著就一直在，往下走才收，「要不要收」的決定權回到讀的人手上。
//
// ⚠️ out 必須早於 SYMBOL_STOPS[0].until（＝ disperse→face 的交界）——
//    文字要在粒子開始集合成人像之前淡乾淨，兩件事同時發生會互相搶焦點。
//    退場改吃捲動後，這件事回到**構造上**成立：p ≥ out ⇒ 每行 opacity 恆為 0，與捲速無關。
//    2026-08-12～08-26 之間為此存在的整套保底清場（clearElapsed / clearDur /
//    symbolIntroClear）與那條「距離換算成秒數夠不夠清完」的條件保證，一併隨之消失
//    —— 連同它自承的殘留風險（快捲仍會短暫重疊）。
//
// 決策紀錄：architecture/2026-08-26-symbol-intro-scroll-exit-design.md
//   （它推翻了 architecture/2026-08-12-symbol-intro-timeline-design.md 的**退場**部分；
//     該文的進場、三塊職責、reduce-motion 兩態退化仍然有效）
//
// 三個門檻都用**絕對距離**定錨（同 FORUM_HANDOFF.agendaIn）：8vh 起播 → 80vh 開始退 →
// 104vh 全空。它們描述的是「文案在第一拍裡的位置」，第一拍的 vh 不變時就不該跟著總長飄。
// ⇒ 全亮期至少 38vh（進場以 16–19vh/s 走完約 34vh，之後到 80vh 還有 38vh ≈ 2.2s），
//   而退場的 24vh 換算約 1.3–1.5s，與改版前那段自走退場（1.4s）等長 —— 手感不變，
//   變的只有「什麼時候開始退」由誰決定。
export const SYMBOL_INTRO = {
  in: symbolProgressAt(0.08), // 8vh   起播（退回這之前 → 重置，再進來從頭播一次，不是倒帶）
  exit: symbolProgressAt(0.8), // 80vh  退場起點
  out: symbolProgressAt(1.04), // 104vh 退場終點（全空，距第一拍結束 8vh）
} as const;

// 「一邊讀一邊往下捲」的假設捲速上限（vh/s）。
//
// ⚠️ 這是**假設，不是量測** —— 它描述我們願意為哪種使用者保證「某段 CSS transition
//    在被捲過去之前跑得完」。25vh/s 在 1080 高的螢幕上約 270px/s。實際觀察到的
//    「穩定往下讀」約 170–200px/s（16–19vh/s），故 25 已經是閱讀行為的上緣；
//    再快的就是在滑過去、不是在讀。
//
// 用途：把「某兩個門檻之間的 vh」換算成秒數，跟一段**程式讀不到的 CSS transition**
// 比大小（議程 reveal 的 0.4s、交棒淡出的 0.35s，見 test/symbol-sequence.spec.ts）。
// 調大它＝宣稱要保證更快的捲速，那些測試就會要求更寬的距離 —— 這正是它存在的意義：
// 讓那個取捨顯式化，不能默默劣化。
//
// ⚠️ 開場三行的退場**不再**是它的消費端（2026-08-26 起退場吃捲動距離，
//    「在人像集合前淡乾淨」是構造上成立的，不需要換算）。
export const ASSUMED_READING_VH_PER_S = 25;

// 開場三行的**進場**時間軸（ms）。整段長度由行數推導，見 symbolIntroTotal ——
// 行數若從三行變四行，時間軸自己變長，不必手改。
//
// inStagger / inDur = 0.5 ＝ 相鄰兩行重疊一半（前一行升到一半，下一行才起跑）。
//
// ⚠️ 這裡**只有進場**：停留與退場都不在時間軸上（停留無限長、退場吃捲動，見 SYMBOL_INTRO）。
//    改版前的 hold / outDur / outStagger / clearDur 已刪除；退場的節奏改由
//    INTRO_EXIT_STAGGER_RATIO 在**捲動距離**上表達。
export const INTRO_TIMELINE = {
  inDur: 1000,
  inStagger: 500,
} as const;

// 退場的逐行錯開量。單位是「一扇退場窗的比例」而不是 ms —— 退場住在捲動距離上，
// 沒有秒數可言（同一段距離，捲得快就退得快）。
// 0.5 ＝ 相鄰兩行重疊一半，與進場的 inStagger / inDur 同語意。
// 三行代入：窗長 1 / (1 + 2×0.5) ＝ 0.5，三扇窗落在 [0,.5] [.25,.75] [.5,1]，
// 最後一行剛好收在 k = 1（見 symbolIntroExitAt，比例由行數推導、不手寫）。
export const INTRO_EXIT_STAGGER_RATIO = 0.5;

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

/** 進場時間軸的長度（ms）＝ 三行全部到位的時刻。elapsed 到這裡＝演完，rAF 可以停。
 *  之後三行就停在全亮，直到捲動把它們帶走（見 symbolIntroExitAt）。 */
export function symbolIntroTotal(count: number): number {
  return (count - 1) * INTRO_TIMELINE.inStagger + INTRO_TIMELINE.inDur;
}

/** 第 index 行在**進場**時間軸 t（ms，自起播起算）時的狀態。
 *
 *  進場窗 [i·inStagger, +inDur]，之後恆為到位狀態（opacity 1 / shift 0 / reveal 1）——
 *  時間軸沒有退場段，退場是 symbolIntroExitAt 的事。
 *
 *  ⚠️ 不吃 count：進場的第 i 扇窗只由 i 決定，行數多寡不影響任何一行的起跑時刻
 *     （只影響整段多長，那是 symbolIntroTotal 的事）。退場相反 —— 它要把所有行
 *     塞進同一段固定距離裡，故 symbolIntroExitAt 非吃 count 不可。
 *
 *  ⚠️ reveal 用**線性**而不是 smoothstep：落字要等速，用 smoothstep 會變成
 *     「先慢、中間一次噴完、再慢」，看起來像掉幀。
 *
 *  純函式、不依賴 DOM —— 曲線由 test/symbol-sequence.spec.ts 守著。 */
export function symbolIntroLineAt(
  t: number,
  index: number,
): { opacity: number; shift: number; reveal: number } {
  const inStart = index * INTRO_TIMELINE.inStagger;
  const opacity = smoothstep(inStart, inStart + INTRO_TIMELINE.inDur, t);
  const local = (t - inStart) / INTRO_TIMELINE.inDur;
  const reveal = Math.min(1, Math.max(0, local / INTRO_REVEAL_SPAN));
  return { opacity, shift: INTRO_LINE_SHIFT * (1 - opacity), reveal };
}

/** 捲動進度 p → 退場的正規化進度 k（0 ＝ 還沒開始退、1 ＝ 已全空）。
 *
 *  ⚠️ **線性**，不是 smoothstep：緩動由每行自己那扇窗負責（symbolIntroExitAt），
 *     外層再緩一次會把中段壓平 —— 畫面上是三行在區間正中央一起頓一下。
 *     這與進場那邊「t 是線性的時間、窗才是 smoothstep」是同一個分工。 */
export function symbolIntroExitK(p: number): number {
  const { exit, out } = SYMBOL_INTRO;
  return Math.min(1, Math.max(0, (p - exit) / (out - exit)));
}

/** 第 index 行（共 count 行）在退場進度 k（0..1）時的**退場乘數與位移**。
 *
 *  逐行錯開由 INTRO_EXIT_STAGGER_RATIO 推導：以「一扇窗 ＝ 1」為單位，
 *  第 i 行的窗是 [i·ratio, i·ratio + 1]，整段長 span ＝ 1 + (count−1)·ratio，
 *  再把 k 乘上 span 換進這個單位 ⇒ 最後一行的窗尾**精確**落在 k = 1。
 *  行數變了自己重算，不必手寫任何比例。
 *
 *  ⚠️ 換算的方向是刻意的：先算窗長 1/span 再逐行相加的話，count = 4 時
 *     最後一行的窗尾會是 1.0000000000000002（IEEE754 殘差）—— k = 1 那一刻
 *     opacity 不是 0 而是 ~1e-16，畫面上看不出來，但「越過 out 必然全空」
 *     這條構造上的保證就從等式退化成近似，守它的測試也只能改成 toBeCloseTo。
 *
 *  ⚠️ shift 為負＝繼續往上離場。三行要像一列字持續往上飄走 —— 不是原地淡掉，
 *     更不是往下掉回來（用「SHIFT × (1 − opacity)」描述退場時就會往下掉）。
 *
 *  opacity 是**乘數**、shift 是**增量**：消費端把它們疊在進場的輸出上（見 symbolIntroLineState）。 */
export function symbolIntroExitAt(
  k: number,
  index: number,
  count: number,
): { opacity: number; shift: number } {
  const span = 1 + (count - 1) * INTRO_EXIT_STAGGER_RATIO;
  const start = index * INTRO_EXIT_STAGGER_RATIO;
  const e = smoothstep(start, start + 1, k * span);
  return { opacity: 1 - e, shift: -INTRO_LINE_SHIFT * e };
}

/** 開場三行的播放狀態。
 *
 *  只有一把尺：**進場**時間軸已跑的 ms，null ＝ 尚未起播（含 reset 之後）。
 *  退場不在這裡 —— 它由 symbolProgress 即時算出、沒有需要記住的東西，
 *  而「沒有狀態」正是它可逆（往回捲文字會回來）的原因。 */
export interface SymbolIntroState {
  elapsed: number | null;
}

/** 未播狀態。凍結避免消費端誤改共用物件（狀態轉換一律回傳新物件）。 */
export const SYMBOL_INTRO_IDLE: SymbolIntroState = Object.freeze({
  elapsed: null,
});

/** 閘門：symbolProgress = p 時，**進場時間軸**的狀態該怎麼變。
 *
 *  **狀態沒變就回傳同一個 reference**，讓「同一個 p 重複套用不會再變」這條冪等性
 *  可以直接用 toBe 測。（消費端已改成在退場區間內每幀重繪，不再靠它跳過重繪。）
 *
 *  三條規則：
 *    p < in   → 重置成未播（下次進來從頭播一次，不是倒帶）
 *    in ≤ p   → 起播（已播過就不重播）
 *    p ≥ out  → 直接跳到進場終點，**不起播、不跑 rAF**
 *
 *  ⚠️ 第三條不是「清場」——「越過 out 就看不見」已由退場的 scrub 構造上保證了。
 *     它在管的是**可逆**：從下方往回捲進來時，三行要以全亮狀態被 scrub 帶回來，
 *     不該重跑一次落字動畫（那段文字已經演過了），也不該在粒子集合成人像那一刻
 *     ——頁面最重的時候——為看不見的東西空轉 2s 的 rAF。
 *     同一條也順手處理「重新整理落在符號段中段」（symbolProgress 初值是 0，
 *     ScrollTrigger refresh 後才寫入真值）：跳到終點而不是從 0 起播，畫面上不會無故閃一下文字。 */
export function symbolIntroGate(
  s: SymbolIntroState,
  p: number,
  count: number,
): SymbolIntroState {
  if (p >= SYMBOL_INTRO.out) {
    const done = symbolIntroTotal(count);
    return s.elapsed === done ? s : { elapsed: done };
  }
  if (p >= SYMBOL_INTRO.in) {
    return s.elapsed === null ? { elapsed: 0 } : s;
  }
  return s.elapsed === null ? s : SYMBOL_INTRO_IDLE;
}

/** 第 index 行在狀態 s ＋ 捲動進度 p 下**最終**該有的值（進場 × 退場，含 reduce-motion 退化）。
 *
 *  合成規則：opacity **相乘**、shift **相加**、reveal 只由進場決定（退場不跑亂碼）。
 *  兩條都是兩端一階導數為 0 的 smoothstep，相乘仍然平滑；兩者同時發生時（捲很快、
 *  進場還沒跑完就已越過 exit）位移互相抵消一部分 —— 那正是「還沒站定就被帶走」該有的樣子。
 *
 *  reduce-motion：**進場**是本頁唯一一段自走播放的動畫（捲動動畫由使用者的手控制，
 *  自走的不是），落在 WCAG 2.2.2 的範疇 ⇒ 退化成「未起播 → 藏、已起播 → 全亮」的兩態，
 *  無 stagger、無亂碼、無位移。退場本身是捲動驅動、不受 2.2.2 管，仍保留淡出
 *  （否則文字會硬生生消失），但去掉逐行錯開與位移，整組一起淡。 */
export function symbolIntroLineState(
  s: SymbolIntroState,
  p: number,
  index: number,
  count: number,
  reduceMotion: boolean,
): { opacity: number; shift: number; reveal: number } {
  if (reduceMotion) {
    if (s.elapsed === null) {
      return { opacity: 0, shift: INTRO_LINE_SHIFT, reveal: 0 };
    }
    return {
      opacity: 1 - smoothstep(0, 1, symbolIntroExitK(p)),
      shift: 0,
      reveal: 1,
    };
  }
  const enter = symbolIntroLineAt(s.elapsed ?? 0, index);
  const exit = symbolIntroExitAt(symbolIntroExitK(p), index, count);
  return {
    opacity: enter.opacity * exit.opacity,
    shift: enter.shift + exit.shift,
    reveal: enter.reveal,
  };
}

/** 還要不要再排下一個 rAF ＝ **進場**時間軸還沒跑完嗎。
 *
 *  ⚠️ 退場不出現在這裡，而這不是漏寫：它逐幀跟著 symbolProgress，由 watch 重繪，
 *     捲動停下來時本來就不該有任何東西在跑。改版前那把清場的尺（以及它那條
 *     「清場跑完是終態、不論 elapsed 到哪都要停」的例外）已隨保底清場一起刪除。 */
export function symbolIntroRunning(
  s: SymbolIntroState,
  reduceMotion: boolean,
  count: number,
): boolean {
  if (reduceMotion) return false; // 兩態切換，沒有補間要跑
  return s.elapsed !== null && s.elapsed < symbolIntroTotal(count);
}

export const SYMBOL_STOPS: readonly {
  until: number;
  mode: 'disperse' | 'face' | 'converge' | 'enter';
}[] = [
  // 門檻全部由 SYMBOL_BEAT_VH 累加推導（vh 為距**捲動尺**起點的距離，SYMBOL_RAIL_VH = 3.34 ⇒ 334vh）：
  { until: symbolProgressAt(BEAT_END_VH.disperse), mode: 'disperse' }, // →112vh (33.53%) 分散（疊開場文案，見 SYMBOL_INTRO）
  { until: symbolProgressAt(BEAT_END_VH.face), mode: 'face' }, //        →248vh (74.25%) 集合（人像）＝最長的一拍
  { until: FORUM_HANDOFF.coreIn, mode: 'converge' }, //                  →324vh (97.01%) 匯聚成點 ＋ 白 core 轉橘、底色翻白
  { until: 1.0, mode: 'enter' }, //                                      →334vh (100%)   轉場層淡出、橘核心接棒
];

/** 下滑提示要不要**常駐**（＝跳過 SymbolFace 那道「停十秒沒捲動」的閘門）。
 *  窗口 ＝ 開場三行文案起播（SYMBOL_INTRO.in ＝ 8vh）→ 粒子開始集合成人像
 *  （SYMBOL_STOPS[0].until ＝ disperse→face 的交界 ＝ 112vh）。
 *
 *  為什麼這一段要常駐：三行到位之後**停在全亮不會自己消失**（停留無限長，見 SYMBOL_INTRO），
 *  畫面上沒有任何東西告訴使用者「讀完了往下捲」—— 等十秒才給指引太晚，那十秒他面對的是
 *  三行不動的字。進入 face 之後畫面本身就有事情在演（人像集合、可互動），指引改回十秒規則，
 *  才不會跟那兩組互動提示互搶注意力（互斥關係見 SymbolFace 的 scrollHintOn ③）。
 *
 *  ⚠️ 起點取 in 而不是 0：p ＝ 0 涵蓋**整段 hero 轉場**（本尺那時還沒起跑，見 SymbolScene 檔頭），
 *     那是使用者正在捲的轉場動畫，不需要有人請他往下捲。
 *  ⚠️ 終點取 disperse→face 的交界、不是文案自己的 out（104vh）：那 8vh 之間文字已淡乾淨、
 *     粒子還沒開始集合，讓提示在這裡閃一下再滅掉沒有意義（且那一刻使用者必然正在捲）。
 *
 *  純函式、不依賴 DOM —— 由 test/symbol-sequence.spec.ts 守著。 */
export function symbolScrollHintPinnedAt(p: number): boolean {
  return p >= SYMBOL_INTRO.in && p < SYMBOL_STOPS[0]!.until;
}

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
 *     `.sec-symbol--light`（白，convergeLightAt 在窗口中點就翻好了）與 `.sec2`（白）。
 *     canvas 若還沒全白就會在那道接縫看到黑閃。
 *  ⚠️ 這條的安全邊際很小：改版前底色在交棒點前 28vh 就幾乎全白，現在是**貼著**交棒點
 *     才到 1。2026-08-22 移除滿版白底那一層之後，「往回捲會看到短暫的灰」那個殘留風險
 *     也跟著消失了（灰是那層 0.4s CSS 淡出與本值吃捲動不同步造成的）——
 *     現在底下兩層都是硬翻的白，沒有半透明可疊。
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
 *  ⚠️ 2026-08-22 起 header **不再看這一支**（改吃 headerTintAt 逐幀插值，見下）——
 *     它現在只剩 `.sec-symbol` 的段落底色在用。留著硬翻的理由見那支的註解。 */
export function convergeLightAt(p: number): boolean {
  return symbolBgLightAt(p) >= 0.5;
}

/** header 配色的**逐幀**漸變量：null ＝ 不在窗口內，交還給 data-header-theme 的離散三檔。
 *
 *  2026-08-22 加的。在此之前 header 吃 convergeLightAt —— 在這段只有 CORE_WARM_VH（20vh）
 *  的窗口正中央**硬翻一次**，而且只有底色吃到 CSS 的 0.3s 補間、文字與 icon 是瞬間跳。
 *  使用者回報的「進入 forum 直接切換主題」就是那一下。改成逐幀之後 header 的三顆色票
 *  在同一段捲動距離內連續插值，`.sec-symbol` 的底色與拍點**一字不動**。
 *
 *  值直接回 symbolBgLightAt，不是另外調一條長得很像的曲線 —— header 要跟的就是
 *  **整片底色自己**，兩者同源才不會在調 CORE_WARM_VH 之後分家。
 *
 *  ⚠️ 窗口外必須回 null 而不是 0 / 1，這是 tint 與離散三檔的分工線：
 *     ① 往前不放手 → symbolProgress 是 useState、**跨導航存活**且過了交棒點恆為 1，
 *        tint 會一路黏在後面的段落上，把 blessing 那段的橘主題也混成淺色。
 *     ② 往後不放手 → 同理會蓋掉 hero 的 light。
 *     放手不會在交界看到跳色：symbolBgLightAt 的端點**精確**是 0 與 1（該函式的硬需求，
 *     交棒不能黑閃），故窗口兩端的插值結果與接手的那一檔完全同色。
 *     判準寫成「已被夾成 0 或 1」而不是比對 CORE_WARM_START / coreIn，是為了讓窗口
 *     永遠等於底色自己的窗口 —— 少一個要手動同步的門檻。
 *
 *  純函式、不依賴 DOM —— 交界由 test/symbol-sequence.spec.ts 守著。 */
export function headerTintAt(p: number): number | null {
  const t = symbolBgLightAt(p);
  return t > 0 && t < 1 ? t : null;
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

// ── 轉折的撞擊擠壓 ───────────────────────────────────────────────────
// 核心撞上一個轉折時除了出聲（FORUM_TURN_SFX），方塊還要**先壓扁再彈回**：
// 26×26（原始，稿 2652-52697）→ 32×17（撞擊瞬間，稿 2652-52711）→ 26×26。
//
// 壓的軸向是**行進方向**（見 ForumCorePath 的 writeCore）：方塊全程繞著切線轉，
// 撞上去的那一面永遠是它的 local −y。故稿上那個「32 寬 17 高」量的是
// 「垂直行進方向鼓出 32、沿行進方向被壓成 17」，不是螢幕座標的寬高。
//
// 為什麼是**時間**驅動而非捲動驅動（本段其他東西一律 scrub）：撞擊是一個事件、
// 不是一段路程 —— 與音效同一個觸發點、同一種語意（見 ForumCorePath 的 hitTurnsCrossed）。
// 做成 scrub 的話，慢慢捲過轉折會看到方塊被「按住」壓扁停在那裡，那是擠壓、不是撞擊。
//
// inDur 遠短於 outDur：撞上去是硬的、彈回來是軟的，兩段等長會像在呼吸。
// outEase 用 back.out —— 它的回彈會讓 amount 越過 0 變**負**，也就是反向的拉長
//（back.out(2.2) 實測谷底 amount ≈ −0.15 → 約 25.1×27.4），那正是文字描述裡的「再彈起」。
// 想完全照稿、只要那兩個狀態不要那一下拉長，把它換成 'power2.out' 即可。
export const FORUM_TURN_SQUASH = {
  /** 撞擊瞬間的方塊尺寸（px），對照原始的 CORE.dotSize × CORE.dotSize。
   *  換算成倍率的算式與退化見 ~/utils/forum-path-turns 的 squashScaleAt。 */
  size: [32, 17] as [number, number],
  /** 壓下去吃掉的秒數。 */
  inDur: 0.07,
  /** 彈回吃掉的秒數。 */
  outDur: 0.36,
  inEase: 'power3.out',
  outEase: 'back.out(2.2)',
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
 *  ⚠️ 起算點是 `.section3` 的上緣，而落點的定義卻在**臉的捲動尺**（`.section3__ruler`）
 *     的座標系裡 —— 兩者恆等：量尺是 `.section3` 的絕對定位子元素、`top: 0`，而
 *     `.section3` 沒有 padding-top。這條性質壞掉的話落點會整段偏移，畫面上不會有
 *     東西壞掉喊出來。
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
// 這個值是清單定住的捲動距離。定住的其實是整個剛體（`.section3__unit` 的
// `.is-pin-list`，錨點換算成「清單頂貼 header」），行程則算進
// `.section3__unit-track` 的高度裡（見 blessingUnitTrackHeight）。
//
// 為什麼需要它：面板塊高約 778px、視窗約 900px，「完整在畫面上」的捲動距離只有
// 兩者之差（≈122px），跟過場長度無關 —— 不定住就一定來不及看。
// 加 `.section3` 的 padding-bottom 不能替代：那會把接縫與整個淡出窗口一起往下推，
// 面板卻不動，等於在淡一個已經捲出畫面的東西。
//
// 定住期間頁面不動但**沒有上鎖**：指標在清單上時 wheel 捲清單（14 家夥伴約 1500px
// 塞在 600px 高的面板裡），捲到底瀏覽器自動把捲動接回頁面。
export const BLESSING_PARTNERS_HOLD_VH = 1;

/** `.section3__unit-track`（剛體軌道）的高度（px）。
 *
 *  ＝ 剛體高 ＋ ①逐格臉的行程 ＋ ③閱讀定格的行程。剛體是絕對定位、不佔流內高度，
 *  所以軌道必須明寫這個高度 —— 它就是本段全部的流內高度（GSAP pin-spacer 的角色）。
 *
 *  **與改版前逐 px 相等**，故 `.section3` 的總高、下游 media 的 pin 起點都零位移：
 *
 *    改版前 ＝ (1 + BLESSING_VH)·V          ← .section3__face-track
 *           ＋ (h/2 − V/2) ＋ partnersH      ← .section3__partners（含負 margin）
 *           ＋ hold·V                        ← .section3__partners-hold
 *    剛體高 ＝ V ＋ (h/2 − V/2) ＋ partnersH  ← 臉屏 100vh ＋ 同一條負 margin
 *    ⇒ 改版前 ＝ 剛體高 ＋ BLESSING_VH·V ＋ hold·V ＝ 本函式
 *
 *  `held` ＝ 清單塞得進視窗（見 Blessing.vue 的 partnersHeld）。不定住時行程收成 0,
 *  狀態機的 ③ 窗口也跟著收成 0（見 measurePin 的 pinPark）。
 *
 *  純函式、不依賴 DOM —— 等價性由 test/blessing-unit-track.spec.ts 守著。 */
export function blessingUnitTrackHeight(
  unitHeight: number,
  vh: number,
  held: boolean,
): number {
  return (
    unitHeight + (BLESSING_VH + (held ? BLESSING_PARTNERS_HOLD_VH : 0)) * vh
  );
}

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
 *  ⚠️ 這個參數不是防禦性程式碼，是**必要條件**：reduce-motion / 無 JS
 *     兩條路徑都不建 timeline ⇒ veil 停在 CSS 初始態不會現身，此時若底色照樣翻白，
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
// **推的總距離不是常數，是量出來的**（見 ForumCorePath 的 measurePlaneSpan 的 back）：
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

/** 紙飛機沒入色塊的比例（0 ＝ 機鼻剛碰到接縫、1 ＝ 機尾也沒入）。
 *
 *  ⚠️ 這才是「變身進度」的真相，coverHandoffAt 不是 —— 兩者差一整個機身：
 *     核心的**定位點**（`.forum-path__core` 的中心）抵達接縫的那一刻＝ COVER_CONTACT，
 *     但機身是畫在定位點**前方**的 —— pc 實測機鼻在定位點前 76.6px、機尾只在後 14.5px。
 *     照 coverHandoffAt 走，白方塊開始長的時候飛機早已沒入 84%（2026-08-25 實測，
 *     見 temp/2026-08-25-plane-whitecore-sync.md），使用者看到的就是
 *     「紙飛機已經進 blessing 一點了，white core 才出現」。
 *     所以白方塊的 scaleY／尾跡淡出／底色翻橘一律改吃本函式。
 *
 *  參數都是**量出來的**（見 ForumCorePath 的 measurePlaneSpan），不是常數 ——
 *  機身的跨距隨斷點、末端切線、筆尖縮放一起變，寫死就會在某個斷點再歪一次：
 *    anchorFromSeam ＝ 定位點在接縫下方多少 px（負 ＝ 還在上方；含下潛位移）
 *    lead / back     ＝ 機身最下緣／最上緣相對定位點的垂直距離
 *  extent ≤ 0（還沒量到機身）時回 0：寧可「還沒開始變身」，也不要拿假的比例去長白方塊。
 *
 *  純函式、不依賴 DOM —— 由 test/blessing-cover.spec.ts 守著。 */
export function planeSubmergedAt(
  anchorFromSeam: number,
  lead: number,
  back: number,
): number {
  const extent = lead + back;
  if (!(extent > 0)) return 0;
  const t = (anchorFromSeam + lead) / extent;
  return t < 0 ? 0 : t > 1 ? 1 : t;
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
//   forum.face.59% → symbolProgress = 0.3353 + 0.59 × (0.7425 − 0.3353) = 0.5756
//                  → 距捲動尺起點 192.24vh（SYMBOL_RAIL_VH 3.34 ＝ 334vh）
//   ⚠️ 地址講的是**該拍內的比例**，所以 vh 只隨那一拍的 SYMBOL_BEAT_VH 變，不隨總長變 ——
//      2026-08-13 把總長從 400 縮到 344vh、2026-08-22 又縮到 334vh，face 的 vh 換算
//      （112 + 0.59 × 136）一字不動，只有 progress 那個中間值變了。
//      這正是「地址寫節點／拍，不寫 %」的用意。
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
  // 給的是**尺長**不是段落高度（2026-08-22 起兩者不同，見 SYMBOL_HOVER_VH）——
  // dashboard 這一欄問的是「這條軌吃掉多少捲動」。
  symbol: SYMBOL_RAIL_VH,
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
      // agendaIn 是推導值（無窮小數），label 要自己捨入 —— 直接內插會印出 0.9101796407185628。
      { key: 'handoff', label: `交棒 ＋ 論壇主標現身（agendaIn ${(FORUM_HANDOFF.agendaIn * 100).toFixed(1)}%）`, drive: 'scrub', track: 'symbol', from: FORUM_HANDOFF.coreIn, until: 1 },
      // 2026-08-22 移除了原本排在這裡的 `hover` part（drive: 'none'、vh: 0.5）。
      // 那 50vh 是「接縫從視窗底緣升到中央」的幾何距離，現已**併進 symbol 軌內**
      // （SymbolScene 的 end: 'bottom center'，見 SYMBOL_HOVER_VH）—— 它不再是無軌區間，
      // 而是散在 converge 尾段與上面這個 handoff part 上，故沒有自己的地址。
      // 當年為它保留的「符號段黑底 → 論壇段白底」換色延伸點也已經實作掉了
      // （2026-08-17 的 CORE_WARM_VH 窗口，見 symbolBgLightAt），不必再留 hoverProgress 的接口。
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
      { key: 'partners', label: `夥伴清單（定住 ${BLESSING_PARTNERS_HOLD_VH * 100}vh 供閱讀）`, drive: 'none', vh: BLESSING_PARTNERS_HOLD_VH },
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
