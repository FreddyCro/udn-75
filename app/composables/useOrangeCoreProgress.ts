// orange core 連動序列的「狀態機」＋全域共享進度（單一來源）。
//
// 純狀態 / 行為；所有可調數值（門檻、距離、幾何）集中在 ~/utils/orange-core-config。
// progress 軌（0..1）：
//   - path  ：core 沿驅動線移動（OrangeCorePath scrub 寫入）→ 依 STAGE_STOPS 解出 stage 1–3。
//   - symbol：符號人臉序列（SymbolScene 的 pin scrub 寫入）→ 依 SYMBOL_STOPS 解出 mode。
//
// 🚧 舊的 pin 軌（stage 4–6：橘→黑 → 星空撐大）已隨 date 段與 pinST 移除。
// 延伸：orange core 走到後續 section 時，於 orange-core-config 新增該段門檻/距離，
// 再在此加一條 useState progress 軌 + resolver + expose（照 path / symbol 模式）。
import {
  STAGE_STOPS,
  SYMBOL_STOPS,
  FORUM_HANDOFF,
} from '~/utils/orange-core-config';

export type CoreStage = 1 | 2 | 3;

// SymbolFace 的三態（互斥）：集合成人像 / 分散漂浮 / 匯聚成點。
// 提升為全域共享：SymbolScene 綁 v-model 給 <SymbolFace>，並由自己的 pin scrub 指派。
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
  // SymbolFace 三態：SymbolScene 的 <SymbolFace> 綁 v-model:mode，由同元件的 symbol pin scrub 指派切換。
  const symbolMode = useState<SymbolMode>('symbol-mode', () => 'disperse');
  // symbol pin 的捲動進度（0..1）：SymbolScene 寫入，driving SymbolFace 序列（見 SYMBOL_STOPS）。
  const symbolProgress = useState<number>('symbol-progress', () => 0);

  const setPathProgress = (p: number) => (pathProgress.value = clamp01(p));
  const setTransitionProgress = (p: number) =>
    (transitionProgress.value = clamp01(p));
  const setSymbolProgress = (p: number) => (symbolProgress.value = clamp01(p));

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

  // forum 議程揭露：越過 coreOut（橘核心開始淡出）才顯示議程。coreOut 之前一律藏著，
  // 確保 SymbolFace↔橘核心 crossfade 期間（兩層黑底皆未達全滿）下方議程不會短暫露餡；
  // coreOut 時議程隨橘核心淡出而淡入，剛好接上。捲回會自動反向。
  const agendaRevealed = computed(
    () => symbolProgress.value >= FORUM_HANDOFF.coreOut,
  );

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
    agendaRevealed,
    setPathProgress,
    setSymbolProgress,
    stage,
    stageProgress,
  };
}
