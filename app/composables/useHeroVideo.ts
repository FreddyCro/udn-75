// Section 1 hero 影片的四階段狀態，抽成全域共享狀態，讓其他元件也能控制。
//   main  主要內容（播一次）
//   loop  主要內容結束後的 loop 段落
//   outro loop 期間向下滾動觸發的最後退場段落
//   gone  退場結束、影片消失 → hero 轉白底、orange core 於正中央淡入
export type HeroState = 'main' | 'loop' | 'outro' | 'gone';

export const HERO_STATES: HeroState[] = ['main', 'loop', 'outro', 'gone'];

// MOCK：模擬退場段（outro）播放時長；真影片到位後改由退場 <video> 的 @ended 觸發 gone。
const OUTRO_MOCK_MS = 1800;
let skipTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * 全域 hero 影片狀態控制。任一元件皆可讀取 / 控制：
 *
 *   const { state, setState, skip } = useHeroVideo();
 *   setState('outro'); // 直接設狀態
 *   skip();            // 跳過主要內容，播退場段後自動進 gone
 */
export function useHeroVideo() {
  // useState → SSR 安全的跨元件共享狀態（同一 key 全站共用一份）
  const state = useState<HeroState>('hero-video-state', () => 'main');

  const clearSkipTimer = () => {
    if (skipTimer) {
      clearTimeout(skipTimer);
      skipTimer = undefined;
    }
  };

  const setState = (s: HeroState) => {
    clearSkipTimer(); // 任何明確切換都取消 skip 排定的自動 gone
    state.value = s;
  };

  /**
   * SKIP：在 main / loop 時「跳過」— 直接播退場段（outro），退場結束後自動進 gone。
   * 非 main / loop 時無作用。
   * TODO: 真影片到位後，改由退場 <video> 的 @ended 觸發 gone，移除下方 mock 計時器。
   */
  const skip = () => {
    if (state.value !== 'main' && state.value !== 'loop') return;
    setState('outro');
    if (!import.meta.client) return;
    skipTimer = setTimeout(() => setState('gone'), OUTRO_MOCK_MS);
  };

  const isGone = computed(() => state.value === 'gone');
  // main / loop 期間應鎖住頁面捲動
  const shouldLockScroll = computed(
    () => state.value === 'main' || state.value === 'loop',
  );

  return { state, setState, skip, isGone, shouldLockScroll };
}
