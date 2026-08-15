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

  // 影片目前秒數（HeroVideo 於 timeupdate 寫入，約每 250ms）：
  // 供「綁影片時間軸」的判定使用 —— 目前是 skip 按鈕的現身時機（見 HERO_SKIP_APPEAR_AT）。
  const currentTime = useState('hero-video-time', () => 0);

  // 是否已經看完過開場（進過 gone）。一旦為 true 就「永不重新上鎖」。
  //
  // 這是決策而非疏漏（2026-08-04 確認）：倒帶回 loop（rewindToLoop）發生在 scrollY 已是 0
  // 的時候，不鎖也上不去，所以省下重新上鎖的風險 —— iOS 在「往上橡皮筋回彈還在飛」的當下
  // 切 overflow:hidden，畫面可能卡在彈起的位置。
  // 已接受的代價：倒帶回 loop 後頁面可自由捲動，往下滑會同時進 outro 又捲走 hero，
  // 與第一次（鎖住時只觸發 outro、頁面不動）的手感略有不同。
  //
  // ⚠️ 判定點是 gone 而非 outro：退場段本身仍要鎖（見下方 shouldLockScroll）。
  //    rewindToLoop 只在 gone 時有作用，故「倒帶時必為 true」這個前提不受影響。
  const hasLeftLoop = useState('hero-has-left-loop', () => false);

  const setState = (s: HeroState) => {
    if (s === 'gone') hasLeftLoop.value = true;
    state.value = s;
  };

  /**
   * SKIP：在 main / loop 時「跳過整支影片」— 直接進 gone（影片淡出、orange core 於第一屏
   * 正中央淡入）。非 main / loop 時無作用。
   * 觸發者是 HeroVideo 右下角的 skip 按鈕（正片 3s 後淡入，見 HERO_SKIP_APPEAR_AT）。
   *
   * 刻意「不」先播退場段：outro 2.5 秒（36–38.5，見 hero-video-config 的 HERO_VIDEO_SEGMENTS），
   * 加上 seek 過去的緩衝，按了 SKIP 還要等它播完才看到結果，對開發與試看都是浪費。
   * 要單獨預覽退場段，直接呼叫 setState('outro')。
   */
  const skip = () => {
    if (state.value !== 'main' && state.value !== 'loop') return;
    setState('gone');
  };

  /**
   * 由下往上回滑到頂端 → 影片倒帶回 loop 段（觸發條件見 HeroVideo 的手勢監聽）。
   * 只在 gone 時有作用，其餘狀態忽略。
   *
   * 這裡只切狀態，其餘都是既有機制自動接手：
   *   影片 seek 回 loop 段起點並續播 → HeroVideo 的 watch(state)
   *   影片層淡回（0.8s）／orange core 淡出（0.6s）→ 綁 isGone 的 class
   * 不重新上鎖（此時 hasLeftLoop 必為 true）。
   */
  const rewindToLoop = () => {
    if (state.value !== 'gone') return;
    setState('loop');
  };

  /**
   * 「回到最開始」：由 header logo 觸發（見 ~/utils/home-intent）。
   *
   * 與 rewindToLoop 的差別有二，故不共用：
   *   ① 不限定 gone —— outro 播到一半、轉場進行到一半點 logo 都要能回。
   *   ② 保證閘門已開（loaderDone / heroStarted）—— 子頁帶 #loop 進站時兩者是初始的
   *      false，不設就會卡在載入層與 start 按鈕前面。
   *
   * ⚠️ 刻意**不**把 hasLeftLoop 設回 false（＝不重新上鎖）。上方那條「倒帶不重新上鎖」
   * 的決策前提是「rewind 必發生在 scrollY 已是 0 的時候」，而 logo 點擊不受此前提保護
   * （子頁回來、首頁捲到一半都會觸發）—— 在非頂端切 overflow:hidden 的 iOS 橡皮筋
   * 風險比 rewind 更高。已接受的代價同 rewindToLoop：回到 loop 後頁面可自由捲動。
   *
   * 例外（不是漏網，是正確的）：從沒進過 gone 的人（直接開子頁、再點 logo）hasLeftLoop
   * 本來就是 false → 這次會上鎖。那正是他們的「第一次」，鎖住等下滑觸發 outro 才對。
   *
   * 轉場進度的歸零**不在這裡**做，在 Hero 的 watch(heroState) 裡（見下方 Step 3）——
   * 本 composable 不該去相依 useOrangeCoreProgress，那會把整組 core/forum 狀態
   * 拉進每一個 useHeroVideo() 呼叫者（含掛在所有子頁的 AppHeader）。
   */
  const returnToLoop = () => {
    loaderDone.value = true;
    heroStarted.value = true;
    setState('loop');
  };

  const isGone = computed(() => state.value === 'gone');
  // main / loop / outro 期間鎖住頁面捲動，gone 才解鎖；但「看完過開場」之後不再上鎖
  // （見 hasLeftLoop）。
  //
  // outro 也鎖是 2026-08-07 的修正：退場段一解鎖，觸發退場的那個手勢會「同時」啟動退場
  // 又把影片往上捲走 → 影片裡那顆 orange core 與 DOM 的 core（恆在視窗 50vh，見
  // .claude/memory/hero-core-screen-locked.md）差一個「使用者滑了多少」，永遠對不上。
  // 鎖住退場那 2.5 秒（36–38.5，外加 seek 過去的緩衝），影片與視窗維持 1:1，
  // 兩顆 core 的落點才是可推算的。
  // 影片卡住不會鎖死：HeroVideo 進 outro 時會起一支保險絲（HERO_OUTRO_STALL_GRACE_MS）。
  const shouldLockScroll = computed(
    () =>
      !hasLeftLoop.value &&
      (state.value === 'main' || state.value === 'loop' || state.value === 'outro'),
  );

  return {
    state,
    setState,
    skip,
    rewindToLoop,
    returnToLoop,
    isGone,
    shouldLockScroll,
    hasLeftLoop,
    videoReady,
    loaderDone,
    heroStarted,
    currentTime,
  };
}
