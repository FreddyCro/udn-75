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
  const loaderDone = useState('hero-loader-done', () => false);

  // 使用者是否已按下 start（見 01.hero/HeroStart.vue）。
  // 載入層收掉後先停在 start 閘門，按下才開始播 main：
  //   ① 避免 main 前幾秒被載入層蓋住而白播
  //   ② 有聲播放必須綁在使用者手勢上（見 useAppSound）
  const heroStarted = useState('hero-started', () => false);

  // 影片目前秒數（HeroVideo 於 timeupdate 寫入）：dev 控制列顯示，方便對照 / 調整 config 秒數。
  const currentTime = useState('hero-video-time', () => 0);

  const setState = (s: HeroState) => {
    state.value = s;
  };

  /**
   * SKIP：在 main / loop 時「跳過整支影片」— 直接進 gone，效果等同 dev 控制列的「4.消失」
   * （影片淡出、orange core 於第一屏正中央淡入）。非 main / loop 時無作用。
   *
   * 刻意「不」先播退場段：outro 是 37s → 影片結束（約 3 秒，見 hero-video-config 的
   * HERO_VIDEO_SEGMENTS），按了 SKIP 還要等它播完才看到結果，對開發與試看都是浪費。
   * 要單獨預覽退場段請按 dev 控制列的「3.退場」。
   */
  const skip = () => {
    if (state.value !== 'main' && state.value !== 'loop') return;
    setState('gone');
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
    heroStarted,
    currentTime,
  };
}
