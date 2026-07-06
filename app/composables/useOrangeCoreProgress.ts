// orange core 連動序列的「狀態機」＋全域共享進度（單一來源）。
//
// 純狀態 / 行為；所有可調數值（門檻、距離、形變、幾何）集中在 ~/utils/orange-core-config。
// 兩條 progress 軌（各 0..1，互不干擾；交界＝斜槓＝pin 起點，屬結構性）：
//   - path：core 沿驅動線移動（HeroCorePath scrub 寫入）→ stage 1–3。
//   - pin ：inner 釘住後（長度＝PIN_VH）的進度（Hero 的 pinST scrub 寫入）→ stage 4–6。
// 依 STAGE_STOPS 合成「目前 stage」與該 stage 內 local progress（stageProgress）。
//
// 延伸：orange core 走到後續 section 時，於 orange-core-config 新增該段門檻/距離，
// 再在此加一條 useState progress 軌 + resolver + expose（照 path/pin/symbol 模式）。
import { STAGE_STOPS, SYMBOL_STOPS } from '~/utils/orange-core-config';

export type CoreStage = 1 | 2 | 3 | 4 | 5 | 6;

// SymbolFace 的三態（互斥）：集合成人像 / 分散漂浮 / 匯聚成點。
// 與 transitionDone 一樣提升為全域共享，Hero 綁 v-model、Forum 的 forum pin scrub 指派。
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
  const pinProgress = useState<number>('core-pin-progress', () => 0);
  // hero → section 2 轉場是否已離場（捲過 pin → 轉場層淡出）。跨元件共享：
  // Hero 的 pinST 會寫入，但 index.vue / Forum 也能覆寫控制（例如回到 hero 時強制 false）。
  const transitionDone = useState<boolean>('hero-transition-done', () => false);
  // SymbolFace 三態：Hero 的 <SymbolFace> 綁 v-model:mode，由 Forum 的 forum pin scrub 指派切換。
  const symbolMode = useState<SymbolMode>('symbol-mode', () => 'disperse');
  // 第二段 pin（forum pin）的捲動進度（0..1）：Forum 寫入，driving SymbolFace 序列（見 SYMBOL_STOPS）。
  const symbolProgress = useState<number>('symbol-progress', () => 0);

  const setPathProgress = (p: number) => (pathProgress.value = clamp01(p));
  const setPinProgress = (p: number) => (pinProgress.value = clamp01(p));
  const setSymbolProgress = (p: number) => (symbolProgress.value = clamp01(p));

  // symbolProgress → 目標 mode / enter（供 Forum watch 後指派 symbolMode / transitionDone）。
  const symbolTarget = computed(() => resolveSymbol(symbolProgress.value));

  // pin 一啟動（>0）即進入 stage 4–6；否則依 path 落在 stage 1–3。
  const resolved = computed(() =>
    pinProgress.value > 0
      ? resolveStage(STAGE_STOPS.pin, pinProgress.value)
      : resolveStage(STAGE_STOPS.path, pathProgress.value),
  );

  const stage = computed(() => resolved.value.stage);
  const stageProgress = computed(() => resolved.value.stageProgress);

  return {
    pathProgress,
    pinProgress,
    transitionDone,
    symbolMode,
    symbolProgress,
    symbolTarget,
    setPathProgress,
    setPinProgress,
    setSymbolProgress,
    stage,
    stageProgress,
  };
}
