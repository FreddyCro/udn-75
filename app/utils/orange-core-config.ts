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

// ── forum 接棒門檻：converge 之後「白點 → 橘核心」的 crossfade（symbolProgress 0..1）──
// coreIn ：SymbolFace 收斂點淡出、同時 ForumCore 橘方塊淡入（crossfade）。＝ converge 段終點，
//          也是 enter 段的起點。
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
  coreIn: 0.75,
  coreOut: 1.0,
  agendaIn: 0.9,
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

// ── 進場方塊的邊長（px）──────────────────────────────────────────────
// 「載入層橘塊 → HeroStart cube」是同一顆方塊在兩層之間交接：載入層淡出的那一刻，
// 使用者看到的必須是「白底那層消失」，而不是「方塊換了個大小」。故兩邊尺寸不能各寫一份。
//
// 這個值同時是 **HeroLoader 整份網格的格子邊長**（tileSize 的預設）—— 收尾時中央那格
// 就是交接橘塊，格子與橘塊本來就是同一個東西，一份數字管到底，中央那顆不可能比別人大。
// 對稿 95px（設計稿 1774:61076 的 cube）。HeroStart 的 hover 目標 131 是相對此值的比例。
// 註：設計稿 loading-1~7 的格子在 1280×720 稿上是 83.333px（比 cube 小 11.7px）——
//     此處刻意讓網格跟著 cube 放大，換取「全程只有一個方塊尺寸」。
//
// ⚠️ 下限 ≈ 80px：方塊上會依序疊兩串字 —— 載入層的「100%」（32px/300，Noto Sans TC 實測
//    80.07px 寬）與 cube 內的「start」（28px/400/ls 1.4，66.40px 寬）。**較寬的是「100%」**，
//    故它才是尺寸下限的來源。調小到 80 以下，「100%」會從橘塊左右緣溢出到白色網格上；
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
//   forum.face.59% → symbolProgress = 0.15 + 0.59 × (0.58 − 0.15) = 0.404
//                  → 距符號段起點 129.2vh（SYMBOL_VH 3.2 ＝ 320vh）
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
  | 'blessing';

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
  blessing: BLESSING_VH,
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
      { key: 'disperse', label: '粒子分散', drive: 'scrub', track: 'symbol', from: 0, until: SYMBOL_STOPS[0]!.until },
      { key: 'face', label: '集合人像（最長的一拍）', drive: 'scrub', track: 'symbol', from: SYMBOL_STOPS[0]!.until, until: SYMBOL_STOPS[1]!.until },
      { key: 'converge', label: '匯聚成點', drive: 'scrub', track: 'symbol', from: SYMBOL_STOPS[1]!.until, until: FORUM_HANDOFF.coreIn },
      { key: 'handoff', label: `交棒：白點→橘核心（agendaIn ${FORUM_HANDOFF.agendaIn}）`, drive: 'scrub', track: 'symbol', from: FORUM_HANDOFF.coreIn, until: 1 },
      // 符號段捲完 → 黑白接縫再升 50vh 才到視窗中央，橘點在這段停著不動。
      // 幾何下限，見 FORUM_HANDOFF 的註解。
      { key: 'hover', label: '懸停期（橘點停在中央）', drive: 'none', vh: 0.5 },
      { key: 'path', label: '核心沿設計線蛇行', drive: 'scrub', track: 'forumPath' },
      { key: 'agenda', label: '議程／報導／論壇四', drive: 'none' },
    ],
  },
  {
    key: 'blessing',
    label: '永續祝福',
    parts: [
      { key: 'face', label: `逐格臉（尾 ${BLESSING_HOLD * 100}% 停格）`, drive: 'scrub', track: 'blessing' },
      { key: 'stairs', label: '階梯線逐格進場', drive: 'time', flag: 'stairs' },
      { key: 'partners', label: '夥伴清單', drive: 'none' },
    ],
  },
];
