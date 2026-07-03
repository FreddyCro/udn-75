// orange core 沿驅動線的移動進度，抽成全域共享狀態（單一來源）。
//   - 寫入端：HeroCorePath 的 place(p)（每幀 scrub）。
//   - 讀取端：Core（依 stage 切換視覺）、CoreProgress（dev 顯示）。
// 進度為 0..1，並衍生語意化的「階段（stage）」供效果切換使用。
export type CoreStage = '1' | '2' | '3' | 'end';

// 階段門檻（可調整 / 擴充）。progress 落在 [prev, until) 即為該 stage。
const STAGE_STOPS: { until: number; stage: CoreStage }[] = [
  { until: 0.41, stage: '1' },
  { until: 0.71, stage: '2' },
  { until: 0.9, stage: '3' },
  { until: Infinity, stage: 'end' },
];

/**
 * 全域 orange core 進度。任一元件皆可讀取 / 寫入：
 *
 *   const { progress, stage, setProgress } = useCoreProgress();
 *   setProgress(0.42);          // 寫入（HeroCorePath 每幀呼叫）
 *   watch(stage, ...);          // 依階段切換效果
 */
export function useCoreProgress() {
  // useState → SSR 安全的跨元件共享狀態（同一 key 全站共用一份）
  const progress = useState<number>('core-progress', () => 0);

  const setProgress = (p: number) => {
    // 夾在 0..1，避免 scrub 邊界溢出
    progress.value = p < 0 ? 0 : p > 1 ? 1 : p;
  };

  const stage = computed<CoreStage>(
    () => STAGE_STOPS.find((s) => progress.value < s.until)?.stage ?? 'end',
  );

  return { progress, stage, setProgress };
}
