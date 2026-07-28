// Section 1 hero 影片的四階段狀態，抽成全域共享狀態，讓其他元件也能控制。
//   main  主要內容（播一次）
//   loop  主要內容結束後的 loop 段落
//   outro loop 期間向下滾動觸發的最後退場段落
//   gone  退場結束、影片消失 → hero 轉白底、orange core 於正中央淡入
//
// 各階段在影片時間軸上的「秒數」定義於 ~/utils/hero-video-config（HERO_VIDEO_SEGMENTS）；
// 實際推進（timeupdate / ended → 換狀態）由 01.hero/HeroVideo.vue 依該設定驅動，
// 本 composable 只保管狀態本身，不含任何計時器。
export type HeroState = 'main' | 'loop' | 'outro' | 'gone';

export const HERO_STATES: HeroState[] = ['main', 'loop', 'outro', 'gone'];

/**
 * 全域 hero 影片狀態控制。任一元件皆可讀取 / 控制：
 *
 *   const { state, setState, skip } = useHeroVideo();
 *   setState('outro'); // 直接設狀態（HeroVideo 會把影片跳到該段起點）
 *   skip();            // 跳過主要內容，播退場段後自動進 gone
 */
export function useHeroVideo() {
  // useState → SSR 安全的跨元件共享狀態（同一 key 全站共用一份）
  const state = useState<HeroState>('hero-video-state', () => 'main');

  // 影片是否已可播放：HeroVideo 於 canplay（或逾時 / 載入失敗）時設 true，
  // 作為 HeroLoader 的收尾條件（見 Hero.vue 傳入的 :ready）。
  const videoReady = useState('hero-video-ready', () => false);

  // 載入層是否已收尾：Hero.vue 於 HeroLoader @done 時設 true。
  // HeroVideo 等它為 true 才開始播 main —— 否則 main 前幾秒會被載入層蓋住而白播。
  const loaderDone = useState('hero-loader-done', () => false);

  // 影片目前秒數（HeroVideo 於 timeupdate 寫入）：dev 控制列顯示，方便對照 / 調整 config 秒數。
  const currentTime = useState('hero-video-time', () => 0);

  const setState = (s: HeroState) => {
    state.value = s;
  };

  /**
   * SKIP：在 main / loop 時「跳過」— 直接跳到退場段（outro），
   * 退場段播到 config 的 outro.end（或影片結束）後由 HeroVideo 進 gone。
   * 非 main / loop 時無作用。
   */
  const skip = () => {
    if (state.value !== 'main' && state.value !== 'loop') return;
    setState('outro');
  };

  const isGone = computed(() => state.value === 'gone');
  // main / loop 期間應鎖住頁面捲動
  const shouldLockScroll = computed(
    () => state.value === 'main' || state.value === 'loop',
  );

  return {
    state,
    setState,
    skip,
    isGone,
    shouldLockScroll,
    videoReady,
    loaderDone,
    currentTime,
  };
}
