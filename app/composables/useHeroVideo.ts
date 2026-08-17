// Section 1 hero 影片的四階段狀態，抽成全域共享狀態，讓其他元件也能控制。
//   main  主要內容（播一次）
//   loop  主要內容結束後的 loop 段落
//   outro loop 期間向下滾動觸發的最後退場段落
//   gone  退場結束、影片消失 → hero 轉白底、orange core 於正中央淡入
//
// 各階段在影片時間軸上的「秒數」定義於 ~/utils/hero-video-config（HERO_VIDEO_SEGMENTS）；
// 實際推進（timeupdate / ended → 換狀態）由 01.hero/HeroVideo.vue 依該設定驅動，
// 本 composable 只保管狀態本身，不含任何計時器。
//
// 2026-08-16 起退場改由捲動 scrub 驅動（見 architecture/2026-08-16-hero-scrub-dissolve-design.md），
// 本檔不再管任何 fade 計時器 —— 顯隱是 stage 的 opacity 直接綁捲動進度，沒有「淡完」這個時間點。
import { shouldLockHeroScroll } from '~/utils/hero-scroll-lock';

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
  // 這是決策而非疏漏（2026-08-04 確認）：倒帶回 loop 發生在 scrollY 已是 0 的時候，
  // 不鎖也上不去，所以省下重新上鎖的風險 —— iOS 在「往上橡皮筋回彈還在飛」的當下
  // 切 overflow:hidden，畫面可能卡在彈起的位置。
  //
  // ⚠️ 判定點是 gone 而非 outro：2026-08-16 起鎖只剩 main 這一段（見 shouldLockScroll），
  //    outro 起本來就不鎖，這面旗標純粹是「main 還要不要鎖」的記憶。
  const hasLeftLoop = useState('hero-has-left-loop', () => false);

  const isGone = computed(() => state.value === 'gone');

  // 真值表本身是 ~/utils/hero-scroll-lock 的純函式（有單元測試釘住），此處只餵值。
  const shouldLockScroll = computed(() =>
    shouldLockHeroScroll(state.value, hasLeftLoop.value),
  );

  // 這一趟下滑是否已經抵達過 gone（＝退場段已經放完、交棒給 DOM 的 orange core）。
  //
  // 退場段播完是**停在最後一格**，而那一格的構圖就是 gone（橘方塊在正中央，見
  // HERO_OUTRO_CORE_ANCHOR 的交棒）。少了這面旗標，往回捲時 dissolveState 會把狀態
  // 送回 outro，於是淡回畫面上的是那一格凍住的畫面 —— 使用者看到的仍然是 gone，
  // 影片「回不到 loop」（2026-08-16 實測：捲回 y=360 時 state 是 outro、影片停在 38.57s）。
  //
  // 設起的點是 setState('gone')（不是 scrub 的某個門檻）：heroIO 的「捲出視窗就收尾」
  // 也會直接進 gone，那條路徑同樣不該在捲回來時把凍住的退場段搬回畫面上。
  // 清掉的點有二：捲回頂端（p < DISSOLVE_LEAVE，見 HeroVideo 的 applyDissolve）與
  // returnToLoop() —— 兩者都是「重新開始一趟」，下次下滑要再看到完整的退場段。
  const outroSpent = useState('hero-outro-spent', () => false);

  const setState = (s: HeroState) => {
    if (s === 'gone') {
      hasLeftLoop.value = true;
      outroSpent.value = true;
    }
    state.value = s;
  };

  // scrub 可不可以開始寫狀態。
  // 帶 hash 進站（尤其子頁 → logo → /#loop）時，子頁的捲動位置會延續到 Hero 掛載之後，
  // 而落點是在 nextTick 才被 scrollToTopForLoop() 修正的。scrub 若在那之前就寫狀態，
  // 會先讀到一個很大的 p → 判 gone、把影片 seek 到退場段 → 下一 tick 被拉回 → 再倒回
  // loop 又 seek 一次，使用者看到影片抽搐。故由 Hero.vue 在落點確定後才 arm。
  const scrubArmed = useState('hero-scrub-armed', () => false);

  // 「不經 scrub 抵達 gone」發生過沒。
  // SKIP、影片載入失敗、帶 hash 進站都會在 scrollY 0 直接進 gone —— 此時 p 是 0，
  // stage 的 opacity 若純綁 1 − p，影片會賴在畫面上不走。故這個旗標要蓋過 scrub：
  // 為 true 時 stage 一律隱藏，且 scrub 不再驅動狀態（否則往下捲會把已經跳過的人
  // 送回 outro）。
  // 清掉的點有二：returnToLoop()，以及**由下往上回捲跨回 page top**（同 outroSpent 的
  // 重新武裝時機，見 HeroVideo 的 applyDissolve）—— 後者讓按過 SKIP 的人捲回頂端仍能
  // 拿回影片、再往下捲重看一次退場段。
  const openingSkipped = useState('hero-opening-skipped', () => false);

  /** 不經 scrub 直接結束開場。SKIP／載入失敗／帶 hash 進站共用這一條。 */
  const skipOpening = () => {
    openingSkipped.value = true;
    setState('gone');
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
    skipOpening();
  };

  /**
   * 「回到最開始」：由 header logo 觸發（見 ~/utils/home-intent）。
   *
   * ⚠️ 刻意**不**把 hasLeftLoop 設回 false（＝不重新上鎖）。倒帶回 loop 之後頁面可自由
   * 捲動，往下滑會再次驅動 scrub 進 outro —— 這是已接受的行為（見 hero-scroll-lock 的
   * 真值表）。
   *
   * 轉場進度的歸零**不在這裡**做，在 Hero 的 watch(heroState) 裡（見下方 Step 3）——
   * 本 composable 不該去相依 useOrangeCoreProgress，那會把整組 core/forum 狀態
   * 拉進每一個 useHeroVideo() 呼叫者（含掛在所有子頁的 AppHeader）。
   */
  const returnToLoop = ({ skipLoader = true } = {}) => {
    // skipLoader ＝ true（預設，首頁就地倒帶）：直接開閘，畫面立刻是 loop。使用者已經在
    //   首頁上、載入層早就收掉了，這時把它請回來只會像整頁重載。
    // skipLoader ＝ false（帶 #loop 進站）：**載入層留著跑完**。此時 hero 影片可能一次都
    //   沒下載過（直接開子頁再點 logo），開閘會露出一片白 —— HERO_VIDEO_POSTER 三個裝置
    //   都是空字串，canplay 之前 <video> 什麼都不畫。載入層的 :ready="videoReady" 正是
    //   為此而設：進度封頂在 99% 等影片，ready 後才收尾到 100%。
    //   不會死結：緩衝與 canplay 都不看 loaderDone（見 HeroVideo 的 onMounted），
    //   而下面的 setState('loop') 會讓影片在載入層底下先 seek 到 30s 並開始播。
    if (skipLoader) loaderDone.value = true;
    heroStarted.value = true;
    // 按 logo 回來之後 stage 不能繼續被壓著隱藏 —— 否則影片明明重新開始播卻整層透明。
    openingSkipped.value = false;
    // 「回到最開始」＝ 重新開始一趟：退場段要能再放一次，否則按了 logo 回來、再往下捲
    // 只會看到影片淡掉，沒有退場。
    outroSpent.value = false;
    setState('loop');
  };

  return {
    state,
    setState,
    skip,
    returnToLoop,
    isGone,
    shouldLockScroll,
    hasLeftLoop,
    videoReady,
    loaderDone,
    heroStarted,
    currentTime,
    scrubArmed,
    skipOpening,
    openingSkipped,
    outroSpent,
  };
}
