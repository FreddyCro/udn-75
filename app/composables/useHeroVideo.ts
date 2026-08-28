// Section 1 hero 影片的三階段狀態，抽成全域共享狀態，讓其他元件也能控制。
//   main  正片（0 → 36，播一次）—— 頁面鎖住
//   outro 退場段（36 → 38.5）：由正片**自動順播**進來（秒數相接、不 seek，
//         2026-08-25 起跳段已移除），播完才解鎖，之後等捲動溶解
//   gone  溶解走完、影片硬切消失 → hero 轉白底、orange core 於正中央淡入
//
// 2026-08-22（使用者裁決）**loop 狀態已移除**。它原本是「正片播完等使用者下滑」的循環段，
// 而現在正片直接順播到退場、退場播完才解鎖 —— 沒有等待階段可言。連帶簡化的還有：
//   - `outroForced`（SKIP 在 page top 放 outro 的那面栓）：restart 改由「跨回頂端」這個
//     事件觸發（見 ~/utils/hero-dissolve），不再用「p 落在 LEAVE 以下」判定，栓失去用途。
//   - 「回捲重播 loop 段」整條路徑：影片進 gone 時就 seek 回 frame 0（見 HeroVideo 的
//     watch(heroState)），回捲看到的是靜止的第一幀，不會再看到凍住的退場尾幀。
//
// 各階段在影片時間軸上的「秒數」定義於 ~/utils/hero-video-config（HERO_VIDEO_SEGMENTS）；
// 實際推進（timeupdate / ended → 換狀態）由 01.hero/HeroVideo.vue 依該設定驅動，
// 本 composable 只保管狀態本身，不含任何計時器。
//
// 2026-08-16 起退場的**溶解**改由捲動 scrub 驅動（見 architecture/2026-08-16-hero-scrub-dissolve-design.md），
// 本檔不再管任何 fade 計時器 —— 顯隱是 stage 的 opacity 直接綁捲動進度，沒有「淡完」這個時間點。
import { shouldLockHeroScroll } from '~/utils/hero-scroll-lock';

export type HeroState = 'main' | 'outro' | 'gone';

export const HERO_STATES: HeroState[] = ['main', 'outro', 'gone'];

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

  // 2026-08-22：`hasLeftLoop`（「看完過開場就永不重新上鎖」）已移除，理由見
  // ~/utils/hero-scroll-lock 的檔頭 —— restart 規則讓 heroState 會再回到 main，
  // 而那條例外正好會讓重播不上鎖、被使用者的下一個捲動事件立刻打斷。

  const isGone = computed(() => state.value === 'gone');

  // 退場段已經播到最後一格。**這就是解鎖的那一刻**，也是「自動捲到引言」的觸發點
  // （見 Hero.vue 的 scrollToIntroReading）。
  //
  // 2026-08-22 新增：鎖從「main 期間」延長到「main ＋ 還沒播完的 outro」，於是設計師
  // 「不要因為捲太快而看不到 outro」第一次真正成立。2026-08-07 也曾鎖住 outro 而在
  // 08-16 被推翻，但那次的失敗模式（鎖在半路介入、畫面凍在 scrollY 400）在新流程下
  // 不可能發生 —— outro 是在 scrollY 0、還鎖著的狀態下由正片自動接進來的。
  //
  // 設起的點：影片播到 outro.end（HeroVideo 的 onTimeUpdate／onEnded），或退場卡住時的
  // 保險絲逾時（armOutroLockFuse）。**SKIP 不設它** —— SKIP 只是跳到退場段，其後照常
  // 播完才解鎖（理由見下方 skip 的註解）。
  // 清掉的點只有一個：setState('main')（＝重新開始一趟，見下方）。
  const outroWatched = useState('hero-outro-watched', () => false);

  // 真值表本身是 ~/utils/hero-scroll-lock 的純函式（有單元測試釘住），此處只餵值。
  const shouldLockScroll = computed(() =>
    shouldLockHeroScroll(state.value, outroWatched.value),
  );

  // 這一趟下滑是否已經抵達過 gone（＝退場段已經放完、交棒給 DOM 的 orange core）。
  //
  // 用途（2026-08-22 起）：回捲時**不要再把狀態送回 outro**。送回去的話影片會 seek 回
  // 36s 重播退場段，而使用者要的是「回捲不要看到 outro」——`dissolveState` 因此在
  // outroSpent 為真時一律維持 gone，影片則停在 frame 0（見 HeroVideo 的 watch(heroState)）。
  //
  // 設起的點是 setState('gone')（不是 scrub 的某個門檻）：heroIO 的「捲出視窗就收尾」
  // 也會直接進 gone，那條路徑同樣不該在捲回來時把退場段搬回畫面上。
  // 清掉的點有二：跨回 page top（見 HeroVideo 的 applyDissolve）與 restartOpening()
  // —— 兩者都是「重新開始一趟」，下次順播要再看到完整的退場段。
  const outroSpent = useState('hero-outro-spent', () => false);

  // 這一趟使用者有沒有**往下讀過至少一個視窗高**（scrollY ≥ vh(1)）。
  // 「回到 page top 就重播」的前提（2026-08-28 使用者裁決）：沒有「去過」就沒有「回來」。
  // 動機是 iPhone 無限重播 —— 退場播完解鎖、自動捲到引言的途中，Safari 導覽列收合會
  // 讓捲動位置短暫回到 0，被判成「跨回頂端」→ restart → 播完又解鎖 → 又回 0…。
  // 自動捲動的落點只有 vh(HERO_INTRO_READ_AT + …) ≈ 0.85vh，不可能武裝這面旗子；
  // 帶 hash 進站的人落點都在 1vh 以下，一樣會武裝，設計師要的「捲回頂端就重看」照舊。
  // 由 HeroVideo 的 foldST 設起、進 main（restart）時清掉。
  const readPastFold = useState('hero-read-past-fold', () => false);

  const setState = (s: HeroState) => {
    if (s === 'gone') outroSpent.value = true;
    // 進 main ＝ 重新開始一趟（首訪、restart 重播都是）：退場的保護要跟著回來，
    // 否則重播播到退場那一刻不會再上鎖，捲太快照樣看不到（也就是這次改動的目的）。
    if (s === 'main') {
      outroWatched.value = false;
      readPastFold.value = false;
    }
    state.value = s;
  };

  // 子頁 logo → 首頁的「這次要從頭重播」旗子。子頁的 AppHeader 在 click handler 設起、
  // Hero 在自己的 setup 內消耗一次（一次性語意是 ~/utils/home-intent 的純函式，有測試釘住）。
  // 用 useState 而非 URL hash：旗子活不過整頁載入，於是 reload／新分頁不會重現一個
  // 「跳過 start 閘門」的靜音開場，瀏覽器上一頁也不會再 restart 一次（理由見 home-intent）。
  const restartIntent = useState('hero-restart-intent', () => false);

  // scrub 可不可以開始寫狀態。
  // 帶 hash 進站（子頁選單的 /#forum 這類）或 logo 帶著 restartIntent 回來時，子頁的捲動
  // 位置會延續到 Hero 掛載之後，而落點是在 nextTick 才被修正的。scrub 若在那之前就寫狀態，
  // 會先讀到一個很大的 p → 判 gone、把影片 seek 到退場段 → 下一 tick 被拉回又 seek 一次，
  // 使用者看到影片抽搐。故由 Hero.vue 在落點確定後才 arm。
  const scrubArmed = useState('hero-scrub-armed', () => false);

  // 「不經 scrub 抵達 gone」發生過沒。
  // SKIP、影片載入失敗、帶 hash 進站都會在 scrollY 0 直接進 gone —— 此時 p 是 0，
  // stage 的 opacity 若純綁 1 − p，影片會賴在畫面上不走。故這個旗標要蓋過 scrub：
  // 為 true 時 stage 一律隱藏，且 scrub 不再驅動狀態（否則往下捲會把已經跳過的人
  // 送回 outro）。
  // 清掉的點有二：restartOpening()，以及**由下往上回捲跨回 page top**（同 outroSpent 的
  // 重新武裝時機，見 HeroVideo 的 applyDissolve）—— 後者讓「按過 SKIP」與「帶 hash 從
  // 子頁進站」的人捲回頂端就拿回影片，2026-08-22 起還是從 0s 的完整影片（restart）。
  // 那正是設計師回報「從子頁進來就看不到影片」的解方。
  const openingSkipped = useState('hero-opening-skipped', () => false);

  // 2026-08-22：`outroForced`（「這個 outro 是 SKIP 在 p ＝ 0 手動放的」那面栓）已移除。
  // 它存在的唯一理由是 dissolveState 用「p 落在 LEAVE 以下」判定要不要倒回 —— 而在
  // page top 放 outro 的情形正好命中那條。restart 改由「**跨回**頂端」這個事件觸發
  // （見 ~/utils/hero-dissolve 的 returnedToTop），停在頂端不算事件，栓就不需要了。
  // 這同時擋掉一個順播帶來的新陷阱：正片播完自動進 outro 時 p 也是 0，若還用位置判定，
  // 會立刻被判成 restart → 重播 → 又進 outro → **無限重播**。

  /** 不經 scrub 直接結束開場。SKIP／載入失敗／帶 hash 進站共用這一條。 */
  const skipOpening = () => {
    openingSkipped.value = true;
    setState('gone');
  };

  /**
   * SKIP：在 main 時「跳過正片，直接進退場段」（2026-08-17 使用者裁決；在此之前
   * 是直接進 gone、連退場段都不放）。非 main 時無作用。
   * 觸發者是 HeroVideo 右下角的 skip 按鈕（正片 3s 後淡入，見 HERO_SKIP_APPEAR_AT）。
   *
   * 收尾**不由這裡決定**：影片 seek 到 36s 播完 2.5 秒後停在最後一格（此時 p 仍是 0，
   * 舞台全實），要等使用者捲動才溶解進 gone —— outro → gone 的唯一權威仍是 scrub
   * （見 HeroVideo 的 onTimeUpdate 註解）。故這裡不設 openingSkipped：舞台若被強制隱藏，
   * 退場段等於放給空氣看。
   *
   * ⚠️ **刻意不設 `outroWatched`**（2026-08-22 使用者裁決；曾經設過，見下）：SKIP 的語意是
   *    「跳到退場段」，之後的一切照正常流程走 —— 退場播到最後一格才解鎖，並由 Hero 的
   *    `scrollToIntroReading()` 自動把畫面帶到引言。
   *    先前設它的理由是「按了逃生口不該又被鎖 2.5 秒，而 skip 按鈕此刻已經消失」；
   *    自動捲動上線後那個顧慮消失了 —— 使用者不必自己捲，畫面會自己過去。於是
   *    `outroWatched` 回到單一語意：**影片真的播到退場最後一格**（另有卡住時的保險絲）。
   */
  const skip = () => {
    if (state.value !== 'main') return;
    setState('outro');
  };

  /**
   * 「回到最開始」＝ **從頭重播整支影片**（restart，2026-08-22 使用者裁決；在此之前是
   * 倒帶到 loop 段、只剩 3 秒循環，而 loop 段本身已於同日移除）。由 header logo 觸發
   * （見 ~/utils/home-intent）。
   *
   * 動機是設計師的回報：帶 hash 從子頁進站的人落在 gone，等於再也看不到影片。裁決是
   * 「乾脆全部回到 page top 就重看影片」，故三條路徑共用同一個語意：
   *   ① 子頁 logo → 帶著 restartIntent 導航回 `/`（Hero 的 bypassToRestart）
   *   ② 首頁 logo 就地（本函式，skipLoader 預設 true）
   *   ③ 由下往上捲回 page top（scrub，見 ~/utils/hero-dissolve 的 dissolveState）
   *
   * 落在 `main` 就會**重新上鎖**（見 ~/utils/hero-scroll-lock）—— 重播就是重播，
   * 逃生口是 SKIP（正片 3s 後淡入）。影片 seek 回 0 不在這裡做：狀態一變成 main，
   * HeroVideo 的 watch(heroState) → alignToSegment 就會把 currentTime 拉回 0
   * （影片進 gone 時本來就已經被 seek 回 0，見 HeroVideo 的 watch(heroState)）。
   *
   * ⚠️ start 閘門刻意**不**再出現一次（heroStarted 保持 true）：按 logo 本身就是使用者
   * 手勢，有聲播放不會被封鎖，再擺一次閘門會像整頁重載。
   *
   * 轉場進度的歸零**不在這裡**做，在 Hero 的 watch(heroState) 裡 ——
   * 本 composable 不該去相依 useOrangeCoreProgress，那會把整組 core/forum 狀態
   * 拉進每一個 useHeroVideo() 呼叫者（含掛在所有子頁的 AppHeader）。
   */
  const restartOpening = ({ skipLoader = true } = {}) => {
    // skipLoader ＝ true（預設，首頁就地重播）：直接開閘，畫面立刻是正片第一幀。使用者已經在
    //   首頁上、載入層早就收掉了，這時把它請回來只會像整頁重載。
    // skipLoader ＝ false（子頁 logo 帶 restartIntent 進站）：**載入層留著跑完**。此時 hero 影片可能一次都
    //   沒下載過（直接開子頁再點 logo），開閘會露出一片白 —— HERO_VIDEO_POSTER 三個裝置
    //   都是空字串，canplay 之前 <video> 什麼都不畫。載入層的 :ready="videoReady" 正是
    //   為此而設：進度封頂在 99% 等影片，ready 後才收尾到 100%。
    //   不會死結：緩衝與 canplay 都不看 loaderDone（見 HeroVideo 的 onMounted），
    //   而下面的 setState('main') 會讓影片在載入層底下就從 0s 開始播。
    if (skipLoader) loaderDone.value = true;
    heroStarted.value = true;
    // 按 logo 回來之後 stage 不能繼續被壓著隱藏 —— 否則影片明明重新開始播卻整層透明。
    openingSkipped.value = false;
    // 「回到最開始」＝ 重新開始一趟：退場段要能再放一次，否則按了 logo 回來、再往下捲
    // 只會看到影片淡掉，沒有退場。
    outroSpent.value = false;
    setState('main');
  };

  return {
    state,
    setState,
    skip,
    restartOpening,
    isGone,
    shouldLockScroll,
    videoReady,
    loaderDone,
    heroStarted,
    currentTime,
    scrubArmed,
    restartIntent,
    skipOpening,
    openingSkipped,
    outroSpent,
    outroWatched,
    readPastFold,
  };
}
