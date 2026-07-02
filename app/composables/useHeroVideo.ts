// Section 1 hero 影片的四階段狀態，抽成全域共享狀態，讓其他元件也能控制。
//   main  主要內容（播一次）
//   loop  主要內容結束後的 loop 段落
//   outro loop 期間向下滾動觸發的最後退場段落
//   gone  退場結束、影片消失 → hero 轉白底、orange core 於正中央淡入
export type HeroState = 'main' | 'loop' | 'outro' | 'gone';

export const HERO_STATES: HeroState[] = ['main', 'loop', 'outro', 'gone'];

/**
 * 全域 hero 影片狀態控制。任一元件皆可讀取 / 控制：
 *
 *   const { state, setState } = useHeroVideo();
 *   setState('outro'); // 例如某個 GSAP callback 觸發退場
 */
export function useHeroVideo() {
  // useState → SSR 安全的跨元件共享狀態（同一 key 全站共用一份）
  const state = useState<HeroState>('hero-video-state', () => 'main');

  const setState = (s: HeroState) => {
    state.value = s;
  };

  const isGone = computed(() => state.value === 'gone');
  // main / loop 期間應鎖住頁面捲動
  const shouldLockScroll = computed(
    () => state.value === 'main' || state.value === 'loop',
  );

  return { state, setState, isGone, shouldLockScroll };
}
