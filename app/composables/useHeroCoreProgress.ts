// orange core 的階段模型（stage 1..6）＋ 全域共享進度（單一來源）。
//
// 兩條 progress 軌（各自 0..1，互不干擾；交界＝斜槓＝pin 起點，屬結構性、不當可調數字）：
//   - path：core 沿驅動線移動的進度（HeroCorePath 每幀 scrub 寫入）→ stage 1–3。
//   - pin ：inner 釘住後（長度＝PIN_VH）的進度（Hero 的 pinST scrub 寫入）→ stage 4–6。
//
// 依下方 STAGE_STOPS 合成「目前 stage」與「該 stage 內的 local progress（stageProgress, 0..1）」，
// 各元件只需拿 stageProgress 漸進自己的視覺：stage3 變長 / stage4 變色 / stage5 星空放大。
// 要調整各段時間點 → 只改 STAGE_STOPS 的門檻即可。
export type CoreStage = 1 | 2 | 3 | 4 | 5 | 6;

// ── stage 門檻 config：要調時間點，改這裡 ────────────────────────────
export const STAGE_STOPS = {
  // stage 1–3：沿 core 移動路徑（path scrub，progress 0..1）
  path: [
    { until: 0.41, stage: 1 }, // 1 引段（單純往下）
    { until: 0.71, stage: 2 }, // 2 曲線
    { until: 1.0, stage: 3 }, // 3 直線尾段 ＋ 變長
  ],
  // stage 4–6：pin 的 100vh 內（pin scrub，progress 0..1）
  pin: [
    { until: 0.25, stage: 4 }, // 4 變色（橘→黑）
    { until: 0.9, stage: 5 }, // 5 星空放大（HeroTransition 接手）
    { until: 1.0, stage: 6 }, // 6 end：fixed 成 section 2 底
  ],
} as const;

// ── core 移動「速度曲線」config（stage 1–3 沿 path 移動時套用）──────────
// scrub 本身是等速綁定捲動；此 ease 重新分配「捲動 → path 進度」的節奏（不改整體距離）。
// GSAP ease 名稱：
//   'none'        等速（linear，預設）
//   'power2.in'   慢起快收（越往斜槓越快）
//   'power2.out'  快起慢收（接近斜槓時放慢，收尾更穩）
//   'power2.inOut' 兩端慢、中間快
// 註：ease 同時作用於「定位」與「stage 判定」，故 stage 門檻仍對齊路徑幾何位置（不會錯位）。
export const MOVE_EASE = 'none';

// ── pin 釘住距離 config（× 視窗高）─────────────────────────────────
// stage 4–6 的捲動距離：core 停在斜槓後，變色 → 星空放大 → fixed 都在這段內完成。
//   - Hero.vue 的 pinST：end = `+=${innerHeight * PIN_VH}`（釘住多久）。
//   - HeroCorePath 的 path scrub：end = `bottom bottom-=${innerHeight * PIN_VH}`
//     （尾端扣掉同樣的量，讓 core 剛好在 pin 起點抵達斜槓）。
// 兩處共用此值 → 必須一致，否則 core 會在 pin 期間繼續移動、脫離斜槓。
export const PIN_VH = 0.3;

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

export function useHeroCoreProgress() {
  // useState → SSR 安全的跨元件共享（同 key 全站一份）
  const pathProgress = useState<number>('core-path-progress', () => 0);
  const pinProgress = useState<number>('core-pin-progress', () => 0);

  const setPathProgress = (p: number) => (pathProgress.value = clamp01(p));
  const setPinProgress = (p: number) => (pinProgress.value = clamp01(p));

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
    setPathProgress,
    setPinProgress,
    stage,
    stageProgress,
  };
}
