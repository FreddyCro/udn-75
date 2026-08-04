// orange core 連動序列的「狀態機」＋全域共享進度（單一來源）。
//
// 純狀態 / 行為；所有可調數值（門檻、距離、幾何）集中在 ~/utils/orange-core-config。
// progress 軌（0..1）：
//   - path  ：core 沿驅動線移動（OrangeCorePath scrub 寫入）→ 依 STAGE_STOPS 解出 stage 1–3。
//   - symbol：符號人臉序列（SymbolScene 的捲動尺 scrub 寫入）→ 依 SYMBOL_STOPS 解出 mode。
//   - forumPath：core 沿論壇段設計線移動（ForumCorePath scrub 寫入）。
//
// 🚧 舊的 pin 軌（stage 4–6：橘→黑 → 星空撐大）已隨 date 段與 pinST 移除。
// 延伸：orange core 走到後續 section 時，於 orange-core-config 新增該段門檻/距離，
// 再在此加一條 useState progress 軌 + resolver + expose（照 path / symbol 模式）。
import {
  STAGE_STOPS,
  SYMBOL_STOPS,
  FORUM_HANDOFF,
  BLESSING_HOLD,
} from '~/utils/orange-core-config';
import { FACE_FRAME_COUNT } from '~/utils/blessing-face-frames';

export type CoreStage = 1 | 2 | 3;

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

type Stop = { until: number; stage: number };

// 依 stops 找出 p（0..1）落在哪個 stage，並回傳該 stage 內的 local progress（0..1）。
function resolveStage(stops: readonly Stop[], p: number) {
  let prev = 0;
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i]!;
    const isLast = i === stops.length - 1;
    if (p < s.until || isLast) {
      const span = s.until - prev || 1;
      const local = Math.min(1, Math.max(0, (p - prev) / span));
      return { stage: s.stage as CoreStage, stageProgress: local };
    }
    prev = s.until;
  }
  const last = stops[stops.length - 1]!;
  return { stage: last.stage as CoreStage, stageProgress: 1 };
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

  const setPathProgress = (p: number) => (pathProgress.value = clamp01(p));
  const setTransitionProgress = (p: number) =>
    (transitionProgress.value = clamp01(p));
  const setSymbolProgress = (p: number) => (symbolProgress.value = clamp01(p));
  const setForumPathProgress = (p: number) =>
    (forumPathProgress.value = clamp01(p));
  const setForumPathActive = (v: boolean) => (forumPathActive.value = v);

  // 永續祝福逐格臉的捲動進度（0..1）：由 Blessing.vue 的 ScrollTrigger 於每次
  // update 讀 self.progress 寫入（無 scrub），故往回捲會自動倒帶。
  const blessingProgress = useState<number>('blessing-progress', () => 0);
  const setBlessingProgress = (p: number) =>
    (blessingProgress.value = clamp01(p));

  // symbolProgress → 目標 mode / enter（供 SymbolScene watch 後指派 symbolMode；enter 目前僅 dev 顯示）。
  const symbolTarget = computed(() => resolveSymbol(symbolProgress.value));

  // forum 接棒視窗：symbolProgress ∈ [coreIn, coreOut) → 橘核心（ForumCore）現身。
  //   進入（≥coreIn）→ SymbolFace 收斂點淡出、橘核心淡入（crossfade，見 FORUM_HANDOFF）；
  //   離開（≥coreOut）→ 橘核心淡出、露出議程。捲回會自動反向。
  // 越過整段 pin（onLeave → symbolProgress=1）時 ≥coreOut，故 forum 之後橘核心不會殘留蓋住畫面。
  const forumCoreActive = computed(
    () =>
      symbolProgress.value >= FORUM_HANDOFF.coreIn &&
      symbolProgress.value < FORUM_HANDOFF.coreOut,
  );

  // forum 議程揭露：越過 agendaIn 才顯示議程。之前一律藏著，確保 SymbolFace↔橘核心
  // crossfade 期間（兩層黑底皆未達全滿）下方議程不會短暫露餡。
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

  // 橘核心那顆方塊的顯隱（與 ForumCore 的黑底分開）。
  // 黑底只在 [coreIn, coreOut) 現身，但橘點必須從 coreIn 一路撐到論壇段路徑接手為止 ——
  // coreOut 到交棒點之間還有約 82vh，若跟著黑底淡出，畫面上會有一段沒有核心、
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
  const reduceMotion = useState<boolean>('blessing-reduce-motion', () => false);
  onMounted(() => {
    reduceMotion.value = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  });

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

  // path 軌 → stage 1–3 ＋ 該 stage 內的 local progress。
  // 🚧 目前無 production 消費者（stage 4–6 的變色／放大已隨 date 段移除，core 在 1–3 全程都是等速移動的橘點）；
  //    保留此模型作為新稿後續 checkpoint 的接點，dev 端由 DevOrangeCoreProgress 顯示。
  const resolved = computed(() => resolveStage(STAGE_STOPS, pathProgress.value));

  const stage = computed(() => resolved.value.stage);
  const stageProgress = computed(() => resolved.value.stageProgress);

  return {
    pathProgress,
    transitionProgress,
    setTransitionProgress,
    symbolLayerDone,
    symbolMode,
    symbolProgress,
    symbolTarget,
    forumCoreActive,
    forumCoreDotVisible,
    agendaRevealed,
    forumPathProgress,
    setForumPathProgress,
    forumPathActive,
    setForumPathActive,
    forumPathRiding,
    setPathProgress,
    setSymbolProgress,
    blessingProgress,
    setBlessingProgress,
    blessingFrame,
    stage,
    stageProgress,
  };
}
