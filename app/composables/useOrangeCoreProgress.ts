// orange core 連動序列的「狀態機」＋全域共享進度（單一來源）。
//
// 純狀態 / 行為；所有可調數值（門檻、距離、幾何）集中在 ~/utils/orange-core-config。
// progress 軌（0..1）：
//   - path  ：core 沿驅動線移動（OrangeCorePath scrub 寫入）。
//   - transition：hero → SymbolScene 的轉場（Hero 的 pin scrub 寫入）。
//   - symbol：符號人臉序列（SymbolScene 的捲動尺 scrub 寫入）→ 依 SYMBOL_STOPS 解出 mode。
//   - forumPath：core 沿論壇段設計線移動（ForumCorePath scrub 寫入）。
//   - blessing：永續祝福逐格臉（Blessing 的捲動尺寫入）。
//
// 這幾條軌怎麼對應到「章節.part.progress」那套定址，見 ~/utils/orange-core-config 的
// SEQUENCE 與 ~/composables/useCoreSequence（本檔只管軌本身，不管定址）。
//
// 🚧 舊的 pin 軌（stage 4–6：橘→黑 → 星空撐大）已隨 date 段與 pinST 移除。
// 延伸：orange core 走到後續 section 時，於 orange-core-config 新增該段門檻/距離，
// 再在此加一條 useState progress 軌 + resolver + expose（照 path / symbol 模式），
// 並在 SEQUENCE 補上對應的 part。
import {
  SYMBOL_STOPS,
  FORUM_HANDOFF,
  BLESSING_HOLD,
  COVER_CONTACT,
  COVER_HANDOFF_SPAN,
  convergeAmountAt,
  convergeLightAt,
  coverHandoffAt,
  coverOrangeAt,
  partnersFadeAt,
  seedTravelAt,
} from '~/utils/orange-core-config';
import { FACE_FRAME_COUNT } from '~/utils/blessing-face-frames';
import { slashDrawAt, type SlashWindow } from '~/utils/forum-slash';
import {
  FORUM_PATH_EVENTS,
  forumEventOn,
  type ForumEventMarks,
} from '~/utils/forum-path-events';
import type { ForumTurn } from '~/utils/forum-path-turns';

// SymbolFace 的三態（互斥）：集合成人像 / 分散漂浮 / 匯聚成點。
// 提升為全域共享：<SymbolFace> 由 Hero 綁 v-model:mode（它住在 HeroSymbolTransition 的 slot），
// 值則由 SymbolScene 依自己的捲動尺指派 —— 渲染在 01.hero、驅動在 01a.symbol，靠本狀態對接。
export type SymbolMode = 'face' | 'disperse' | 'converge';

// 依 symbolProgress 解出「目標 mode」與「是否已越過 enter」（門檻見 SYMBOL_STOPS）。
// enter 段沿用前一個真實 mode（converge），只把 enter 旗標打開 → 視覺不跳、單純觸發退場。
function resolveSymbol(p: number): { mode: SymbolMode; enter: boolean } {
  let last: SymbolMode = 'disperse';
  for (const s of SYMBOL_STOPS) {
    if (p < s.until) {
      return s.mode === 'enter'
        ? { mode: last, enter: true }
        : { mode: s.mode, enter: false };
    }
    if (s.mode !== 'enter') last = s.mode;
  }
  return { mode: last, enter: true }; // p ≥ 最後門檻（1.0）→ enter
}

const clamp01 = (p: number) => (p < 0 ? 0 : p > 1 ? 1 : p);

export function useOrangeCoreProgress() {
  // useState → SSR 安全的跨元件共享（同 key 全站一份）
  const pathProgress = useState<number>('core-path-progress', () => 0);
  // hero → SymbolScene 轉場進度（0..1）：Hero 的 transition pin scrub 寫入，
  // 驅動 HeroSymbolTransition 的兩段軸向放大（見 SYMBOL_TRANSITION）。
  const transitionProgress = useState<number>('core-transition-progress', () => 0);

  // 符號星空層是否已離場（符號序列越過 enter 門檻 → 交棒給論壇的 ForumCore）。
  // SymbolScene 依 symbolTarget.enter 寫入；讀取者是 Hero 的 HeroSymbolTransition ——
  // 因為 <SymbolFace> 就住在那層的 slot 裡，該層必須撐到整段序列跑完才能撤。
  const symbolLayerDone = useState<boolean>('symbol-layer-done', () => false);
  // SymbolFace 三態：Hero 的 <SymbolFace> 綁 v-model:mode，由 SymbolScene 的捲動尺指派切換。
  const symbolMode = useState<SymbolMode>('symbol-mode', () => 'disperse');
  // symbol 段落的捲動進度（0..1）：SymbolScene 寫入，driving SymbolFace 序列（見 SYMBOL_STOPS）。
  const symbolProgress = useState<number>('symbol-progress', () => 0);

  // 論壇段路徑進度（0..1）：ForumCorePath 的 scrub 寫入，驅動核心沿設計線移動。
  const forumPathProgress = useState<number>('forum-path-progress', () => 0);
  // 該斷點是否真的有驅動線可跑（pc 有線稿、pad/mob 目前沒有）。由 ForumCorePath 的 build()
  // 寫入，決定橘點是「撐到路徑接手」還是「照舊在 coreOut 淡出」—— 見下方 forumCoreDotVisible。
  const forumPathActive = useState<boolean>('forum-path-active', () => false);

  // 核心中心相對**視窗中央**的縱向偏移（px，正 ＝ 在中央下方）。ForumCorePath.place() 每幀寫入，
  // 消費者是 <Agenda>：它要判定「核心是不是真的走進了某一組」，而視窗中央不等於核心的位置。
  // 回中節點表只保證核心**大致**跟著視窗中央（實測 pc −280/+123px，比議程一組還高），
  // 拿視窗中央當播放頭，箭頭就會早一組亮、晚一組熄（見 forum-node-path.md 第五節）。
  //
  // 為什麼是「偏移」而不是核心的絕對座標：偏移可以完全由 place() 手上的值算出
  // （pt.y − rawP × tailEndY，見該處），不必量任何 DOM。絕對座標則只能在 ScrollTrigger
  // refresh **之後**量（上游 pin spacer 會位移它），Agenda 的 startScroll 已經在處理那件事，
  // 沒必要再開第二個同型的量測。且議程仍由 scroll 事件驅動 —— 偏移只是修正項，
  // 就算某次 tick 沒更新到，主項（視窗中央）照樣把每一組都掃過一遍。
  const forumCoreCenterOffset = useState<number>('forum-core-center-offset', () => 0);

  // 論壇二 09/15 那一撇的觸發窗口（forumPath 軌的 0..1）。
  // 由 ForumCorePath.build() 寫入 —— 它是唯一量得到幾何的人；ForumEvent 只是消費者。
  // 兩者是兄弟元件，這條軌是它們唯一的共享通道（同 forumPathProgress 的角色）。
  //
  // ⚠ reset() 一定要寫回 null。留著上一個斷點的窗口會讓撇在錯的時機長出來 ——
  //   與 ForumCorePath 那次「progress 沒歸零，橘方塊卡在論壇段不動」是同一類事故。
  const forumSlashWindow = useState<SlashWindow | null>('forum-slash-window', () => null);

  // 路徑事件的觸發門檻表（事件 key → forumPath 軌的 0..1）。由 ForumCorePath.build() 依
  // 節點在驅動線上的弧長算出來，每次 refresh 重寫一次 —— 門檻**不是手寫的百分比**
  // （手寫的在 RWD 下會飄，見 architecture/2026-08-12-forum-path-events-design.md 第一節）。
  //
  // ⚠ 這是整套機制刻意只用**一條**軌的地方：事件表長到幾十個，reset() 仍然只清這一樣。
  //   一個事件一條 useState 會讓「忘了歸零」那類事故隨事件數線性增加 —— 本檔上方
  //   forumSlashWindow 與 ForumCorePath 的 reset() 各記過一次，兩次都是靜默的。
  const forumPathMarks = useState<ForumEventMarks | null>('forum-path-marks', () => null);
  const setForumPathMarks = (m: ForumEventMarks | null) => (forumPathMarks.value = m);

  // 轉折清單（議程之前那一段，見 ~/utils/forum-path-turns）。ForumCorePath 在每次 refresh
  // 重寫一次。⚠ **音效不從這裡觸發** —— 出聲是邊緣觸發的副作用，掛在 place() 逐幀比弧長
  // 那裡（同一個 len，不必再換算成 progress）。本狀態純粹給 dashboard 看：
  // 角度門檻與最小間隔只能靠耳朵調，而「這次選中了哪幾個節點」是調它們的唯一依據。
  const forumTurns = useState<ForumTurn[] | null>('forum-turns', () => null);
  const setForumTurns = (t: ForumTurn[] | null) => (forumTurns.value = t);

  const setPathProgress = (p: number) => (pathProgress.value = clamp01(p));
  const setTransitionProgress = (p: number) =>
    (transitionProgress.value = clamp01(p));
  const setSymbolProgress = (p: number) => (symbolProgress.value = clamp01(p));
  const setForumPathProgress = (p: number) =>
    (forumPathProgress.value = clamp01(p));
  const setForumPathActive = (v: boolean) => (forumPathActive.value = v);
  const setForumCoreCenterOffset = (v: number) =>
    (forumCoreCenterOffset.value = v);
  const setForumSlashWindow = (w: SlashWindow | null) => (forumSlashWindow.value = w);

  // 02 → 03 覆蓋過場的捲動進度（0..1）：由 Blessing.vue 的 cover ScrollTrigger
  // （`.section3` 的 top bottom → top top，幾何上恆為一個視窗高）每次 update 寫入，
  // 故往回捲會自動倒帶。與 blessingProgress 首尾相接不重疊：那條的 start 是
  // `.section3__face-track` 的 top top，也就是本條的 end。
  const coverProgress = useState<number>('blessing-cover-progress', () => 0);
  const setCoverProgress = (p: number) => (coverProgress.value = clamp01(p));

  // 永續祝福逐格臉的捲動進度（0..1）：由 Blessing.vue 的 ScrollTrigger 於每次
  // update 讀 self.progress 寫入（無 scrub），故往回捲會自動倒帶。
  const blessingProgress = useState<number>('blessing-progress', () => 0);
  const setBlessingProgress = (p: number) =>
    (blessingProgress.value = clamp01(p));

  // 03 → 04 過場第一拍：夥伴清單淡出的捲動進度（0..1）。由 Blessing.vue 的第二條
  // ScrollTrigger（`.section3` 的 bottom bottom → bottom top）每次 update 寫入，
  // 故往回捲會自動倒帶。與 blessingProgress 是兩條獨立的軌：那條在段落中段跑完，
  // 這條在段落尾端才開始。
  const blessingOutProgress = useState<number>('blessing-out-progress', () => 0);
  const setBlessingOutProgress = (p: number) =>
    (blessingOutProgress.value = clamp01(p));

  // 階梯線逐格是否已播完（<BlessingStairs> 以 v-model:done 雙向控制，播完才讓夥伴清單淡入）。
  // 提升為全域而非 Blessing.vue 的區域 ref：SEQUENCE 的 blessing.stairs 是 'time' part，
  // dev dashboard 要讀它才判得出 idle / done。雙向綁定照舊（useState 回傳的就是 ref）。
  const stairsDone = useState<boolean>('blessing-stairs-done', () => false);

  // symbolProgress → 目標 mode / enter（供 SymbolScene watch 後指派 symbolMode；enter 目前僅 dev 顯示）。
  const symbolTarget = computed(() => resolveSymbol(symbolProgress.value));

  // 匯聚那一拍的收攏量（0..1）。**本段唯一一個綁 scrub 的視覺** —— 其餘（disperse↔face
  // 的散開／集合）仍是 mode 觸發的定時補間，見 convergeAmountAt 那段為什麼只有這一拍要改。
  // 消費端是 Hero 傳給 <SymbolFace> 的 converge-amount（uConverge ＋ 整片底色都吃它）。
  //
  // ⚠ 每幀都變，但它是餵給一個 prop 的數字、不是 class 條件，故不必像 forumPathRiding
  //   那樣收成 boolean（同 forumSlashDraw 的理由）。
  const symbolConvergeAmount = computed(() => convergeAmountAt(symbolProgress.value));

  // 底色／header 主題該不該翻成淺色（＝ 收攏量過半，見 convergeLightAt）。
  // 收成 boolean：它是 class 與 data-attribute 的條件，整拍只翻一次，不該逐幀 re-render。
  const symbolConvergeLight = computed(() => convergeLightAt(symbolProgress.value));

  // forum 接棒視窗：symbolProgress ∈ [coreIn, coreOut) → 橘核心（ForumCore）現身。
  //   進入（≥coreIn）→ SymbolFace 收斂點交棒給橘核心（硬切，兩顆已同色同尺寸，見 FORUM_HANDOFF）；
  //   離開（≥coreOut）→ 滿版底色淡出、露出議程。捲回會自動反向。
  // 越過整段 pin（onLeave → symbolProgress=1）時 ≥coreOut，故 forum 之後橘核心不會殘留蓋住畫面。
  const forumCoreActive = computed(
    () =>
      symbolProgress.value >= FORUM_HANDOFF.coreIn &&
      symbolProgress.value < FORUM_HANDOFF.coreOut,
  );

  // forum 議程揭露：越過 agendaIn 才顯示議程。之前一律藏著，確保 SymbolFace↔橘核心
  // crossfade 期間（兩層滿版底色皆未達全滿）下方議程不會短暫露餡。
  // agendaIn 刻意早於 coreOut，讓這 0.4s 的淡入發生在畫面外（此時符號段底緣還在視窗底
  // 下方 32vh）；若跟著 coreOut（＝符號段捲完那一刻）才淡入，會在畫面底緣看得到。
  // 捲回會自動反向。
  const agendaRevealed = computed(
    () => symbolProgress.value >= FORUM_HANDOFF.agendaIn,
  );

  // 論壇段路徑是否已接手（核心正沿線移動）。boolean 而非直接讀 forumPathProgress：
  // 後者每幀都變，當成 class 條件會讓消費端逐幀 re-render；這個只在交棒點翻一次。
  // 兩個消費端：ForumCorePath 用它決定路徑核心的顯隱（p=0 時必須藏著，否則段落進場到
  // 交棒點之間畫面上會同時有兩顆方塊）；ForumCore 用它讓固定橘點的消失變成瞬間的。
  const forumPathRiding = computed(() => forumPathProgress.value > 0);

  // 路徑事件：核心走到線上某個節點就翻成 true，往回捲自動跌回 false（純狀態、無副作用），
  // 補間交給消費端的 CSS transition。事件表見 ~/utils/forum-path-events。
  //
  // ⚠ **每個 key 各自一個 computed**，不是「單一 computed 回一個物件」。後者依賴逐幀變動的
  //   forumPathProgress，每幀都會產生新物件 → 所有消費端逐幀 re-render。拆開之後每幀只做
  //   一次數字比較，而 Vue 只在**回傳值真的翻轉**時才通知依賴者（同下方 forumPathRiding
  //   收成 boolean 的理由）。
  // ⚠ 用 reactive() 包住那組 computed：它會自動 unwrap，模板寫 forumPathEvents.foo 就好，
  //   且**保留每 key 的追蹤粒度**（回傳 Record<key, ComputedRef> 則模板要寫 .value）。
  //
  // marks 缺 key ＝ 該斷點不觸發（at[bp] 為 null）、或節點是 optional 且被跳過
  // （?highlights=1 沒帶時整個精彩活動不渲染）→ 恆 false。marks 為 null（尚未建線／
  // 斷點切換後的 reset）同理，故不必另外判 forumPathActive。
  const forumPathEvents = reactive(
    Object.fromEntries(
      FORUM_PATH_EVENTS.map((e) => [
        e.key,
        computed(() =>
          forumEventOn(forumPathProgress.value, forumPathMarks.value?.[e.key]),
        ),
      ]),
    ),
  ) as Record<string, boolean>;

  // 那一撇畫出多少（0..1）。ForumEvent 綁成 CSS var --slash-draw。
  // 逐幀會變，但消費端只有一個 style binding、不是 class 條件，故不必像 forumPathRiding
  // 那樣收成 boolean。
  const forumSlashDraw = computed(() =>
    slashDrawAt(forumPathProgress.value, forumSlashWindow.value),
  );

  // 橘核心那顆方塊的顯隱（與 ForumCore 的滿版底色分開）。
  // 底色只在 [coreIn, coreOut) 現身，但橘點必須從 coreIn 一路撐到論壇段路徑接手為止 ——
  // coreOut 到交棒點之間還有約 82vh，若跟著底色淡出，畫面上會有一段沒有核心、
  // 然後又在設計線頂端冒出一顆（就是這次要修掉的斷點）。
  // forumPathActive 為 false（該斷點無線稿）時退化成原本的 [coreIn, coreOut)。
  const forumCoreDotVisible = computed(() => {
    if (symbolProgress.value < FORUM_HANDOFF.coreIn) return false;
    return forumPathActive.value
      ? !forumPathRiding.value
      : symbolProgress.value < FORUM_HANDOFF.coreOut;
  });

  // 使用者要求減少動態時，逐格臉不隨捲動變化，直接停在完成的笑臉。
  // 用 useState 讓 SSR 與 client 一致（初值 false，client 掛載後才量測）。
  //
  // ⚠ 探測掛 onMounted 是為了避開 hydration mismatch（首次 client render 必須與 SSR 同值），
  //   但 onMounted 只能在 setup 內註冊 —— 本 composable 是共享狀態的入口，論壇段就有 7 個
  //   元件各叫一次，未來也可能從 watcher／event handler 裡叫。故：
  //     有元件實例 → 照舊掛 onMounted（保 hydration 一致）
  //     沒有實例   → 直接探測一次（此時已在 client、不在 render 路徑上，不影響 hydration）
  //   不加這層判斷的話，非 setup 的呼叫會噴 Vue 警告並**靜默**拿到 reduceMotion = false。
  const reduceMotion = useState<boolean>('blessing-reduce-motion', () => false);
  if (import.meta.client) {
    const probeReduceMotion = () => {
      reduceMotion.value = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
    };
    if (getCurrentInstance()) onMounted(probeReduceMotion);
    else probeReduceMotion();
  }

  // blessingProgress → 逐格臉的格號（0-based，整數；逐格＝不做補間）。
  // 尾端 BLESSING_HOLD 這段停在最後一格；因 blessingProgress 每次 update 都重讀
  // self.progress 寫入，往回捲會自動倒帶。
  const blessingFrame = computed(() => {
    if (reduceMotion.value) return FACE_FRAME_COUNT - 1;
    const span = 1 - BLESSING_HOLD;
    const local = span > 0 ? blessingProgress.value / span : 1;
    const i = Math.floor(clamp01(local) * FACE_FRAME_COUNT);
    return Math.min(FACE_FRAME_COUNT - 1, i);
  });

  // blessingOutProgress → 夥伴清單的 opacity（曲線見 partnersFadeAt）。
  // 與 blessingFrame 同一個角色：軌是原始值，這個是給模板消費的衍生值。
  // 刻意**不**吃 reduceMotion：它是綁在捲動上的 crossfade、不是自走動畫，
  // 減少動態的使用者一樣需要那個「淡乾淨」的結果，否則收窄時清單還在畫面上。
  const partnersOpacity = computed(() =>
    partnersFadeAt(blessingOutProgress.value),
  );

  // coverProgress → 色塊「橘的比例」（曲線見 coverOrangeAt）。
  // 標題與引言的 opacity 共用同一個值：它們是白字，色塊還是淺藍時必須藏著，
  // 而「底色變橘就看到白字標題」正是設計師的描述。
  // 刻意**不**吃 reduceMotion：它是綁在捲動上的換色、不是自走動畫（同 partnersOpacity）。
  const coverOrange = computed(() => coverOrangeAt(coverProgress.value));

  // 白方塊走完「接縫 → 臉的第 01 格」的比例（曲線見 seedTravelAt）。
  const coverSeed = computed(() => seedTravelAt(coverProgress.value));

  // 白方塊的顯隱：接觸點起、cover 跑完為止（跑完就換成 BlessingFace 的第 0 格）。
  // reduceMotion 時整個不出現 —— 那種情形逐格臉直接停在完成的笑臉（見 blessingFrame），
  // 沒有「第 01 格」可以交棒，方塊沉下去之後會看到完整笑臉硬換上來。
  const coverSeedVisible = computed(
    () =>
      !reduceMotion.value &&
      coverProgress.value >= COVER_CONTACT &&
      coverProgress.value < 1,
  );

  // 逐格臉的 svg 何時現身：cover 跑完（與白方塊交棒，兩者同格同色同位置 → 硬切）。
  // reduceMotion 時從頭就在（見 coverSeedVisible）。
  const coverFaceVisible = computed(
    () => reduceMotion.value || coverProgress.value >= 1,
  );

  // 接觸點的變身進度（0..1，曲線見 coverHandoffAt）。
  //
  // **一個值餵三個視覺**，這是它們同步的唯一保證：
  //   ① 飛機沿末端切線下潛的距離（× PLANE_DIVE_PX，見 ForumCorePath 的 writeCore）
  //   ② 彗星尾的淡出（1 − 本值）—— 機身還在飛的時候尾巴不能先不見
  //   ③ 白方塊從接縫長出來的 scaleY（見 Blessing 的 .section3__face-seed）
  //
  // 逐幀會變，但三個消費端都只是 style binding、不是 class 條件，故不收成 boolean
  //（同 forumSlashDraw 的理由）。
  const coverHandoff = computed(() => coverHandoffAt(coverProgress.value));

  // 紙飛機是否已完全沒入色塊（＝ 變身窗口跑完）。
  //
  // 2026-08-14 起它**不再**是「碰到就消失」的那個門檻（改版前是 p >= COVER_CONTACT，
  // 飛機在接觸點瞬間 opacity: 0）。現在飛機是被色塊**遮住**的 —— 幾何遮蔽，不是淡出 ——
  // 所以到這一點它早就看不見了，opacity: 0 純粹是保險（萬一某個斷點的 sprite 比
  // PLANE_DIVE_PX 推的距離還長，機尾會留在接縫上）。切在看不見的時候，故不會被看到。
  //
  // ⚠ 不要把它改回接觸點：那等於復原成「直接消失」，而畫面上不會有任何東西壞掉喊出來。
  const coverHandedOff = computed(
    () => coverProgress.value >= COVER_CONTACT + COVER_HANDOFF_SPAN,
  );

  // `.sec2__pin` 的 sticky 是否該掛上（＝ 已進入 cover 窗口）。
  //
  // 為什麼要開關而不是一直掛著：`position: sticky` **不論 z-index 都會建立 stacking context**，
  // 會把 `.agenda__group` 的 z-index: 2 關在 `.sec2__pin` 內部 → 它再也升不到
  // `.sec2__path`（z-index 1，核心在裡面）之上，「核心從議程群組背後穿過」就失效了。
  // 而核心穿過議程發生在很早的捲動位置，cover 開始時它早已走完設計線 ——
  // 兩件事在時間上不重疊，所以用開關就能同時成立。
  const coverHoldArmed = computed(() => coverProgress.value > 0);

  return {
    pathProgress,
    transitionProgress,
    setTransitionProgress,
    symbolLayerDone,
    symbolMode,
    symbolProgress,
    symbolTarget,
    symbolConvergeAmount,
    symbolConvergeLight,
    forumCoreActive,
    forumCoreDotVisible,
    agendaRevealed,
    forumPathProgress,
    setForumPathProgress,
    forumPathActive,
    setForumPathActive,
    forumCoreCenterOffset,
    setForumCoreCenterOffset,
    forumSlashWindow,
    setForumSlashWindow,
    forumSlashDraw,
    forumPathMarks,
    setForumPathMarks,
    forumTurns,
    setForumTurns,
    forumPathEvents,
    forumPathRiding,
    setPathProgress,
    setSymbolProgress,
    coverProgress,
    setCoverProgress,
    blessingProgress,
    setBlessingProgress,
    blessingFrame,
    blessingOutProgress,
    setBlessingOutProgress,
    partnersOpacity,
    coverOrange,
    coverSeed,
    coverSeedVisible,
    coverFaceVisible,
    coverHandoff,
    coverHandedOff,
    coverHoldArmed,
    stairsDone,
    reduceMotion,
  };
}
