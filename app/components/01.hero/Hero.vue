<script setup lang="ts">
// Section 1：hero 影片 → 引言 → 轉場到 SymbolScene
//   影片播畢 → core 於第一屏中央淡入 → 沿垂直線下降、穿透引言文字 → 停在視窗正中央
//   → transition pin hold 住畫面：橘方塊上下拉長 → 左右展開成滿版（見 HeroSymbolTransition）。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section1.json';
import { anchorLanding, anchorOffsetVh } from '@/utils/anchor-landing';
import { getDeviceTypeByResolution } from '@/utils/get-device';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';
import {
  coverAnchorToScreen,
  isVerticallyOnScreen,
  unrotateDelta,
} from '@/utils/hero-core-handoff';
import {
  HERO_CORE_DROP_IN,
  HERO_CORE_HANDOFF,
  HERO_OUTRO_CORE_ANCHOR,
} from '@/utils/hero-video-config';
import { HERO_RETURN_HASH } from '@/utils/home-intent';

// ── <SymbolFace> 的常數 props ────────────────────────────────────────────
// 提到模組層而不是寫成 template 裡的字面值：本元件的 render effect 會被捲動打到
// （introFade 與 transitionProgress 兩個 onUpdate 都逐幀寫 ref，而兩者都進了 template），
// 於是每一個 scrub tick 都會重建這四個陣列與兩個物件。更貴的是**識別性**：新物件
// 每幀都與上一幀不等，SymbolFace 的 props 因此永遠比對不相等 → 它的 template
// （彩蛋、hint、hint-mob）也跟著逐幀重新 diff，全為了幾個從頭到尾沒變過的值。
const SYMBOL_CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F',
];
const SYMBOL_COLOR_RAMP = ['#000000', '#77c6e0', '#d1f4ff', '#ffffff'];
const SYMBOL_COLOR_STOPS = [0, 0.4, 0.75, 1];
const SYMBOL_GLITCH_ITEMS = [
  { color: '#ff0055', density: 3, fps: 12 },
  { color: '#00ffcc', density: 2, fps: 8 },
];

// ref：
//   sec1Ref       — 座標範圍 / ScrollTrigger trigger
//   orangeCoreRef — orange core 元件（曝露 root / dot：root 供 path 驅動、dot 供進場動畫）
//   heroVideoRef  — hero 影片元件（曝露 <video>：core 進場要量它的螢幕矩形）
//   innerRef      — 含 core / path / 內容的整組（絕對定位原點，也是 transition pin 的目標）
//   introRef      — 引言整段（含 runway）：path 終點與 pin 起點共用的參照
//   introBodyRef  — 引言文字本體（不含 runway）：淡出起點的量測對象
const sec1Ref = ref<HTMLElement | null>(null);
const orangeCoreRef = ref<{
  root: HTMLElement | null;
  dot: HTMLElement | null;
} | null>(null);
const heroVideoRef = ref<{ videoEl: HTMLVideoElement | null } | null>(null);
const innerRef = ref<HTMLElement | null>(null);
const introRef = ref<HTMLElement | null>(null);
const introBodyRef = ref<HTMLElement | null>(null);

// OrangeCore 元件曝露的 root el，交給 OrangeCorePath 以 GSAP 驅動。
const orangeCoreEl = computed(() => orangeCoreRef.value?.root ?? null);

// 轉場進度：全域共享（單一來源，見 useOrangeCoreProgress）。core 在 path 軌上的進度
// 由 OrangeCorePath 自己寫入，本元件不必讀（引言淡出改吃下方 introFade 的量測結果）。
// symbolMode / symbolLayerDone 是給轉場層內那顆 <SymbolFace> 用的：
// 本元件只負責「讓它在場」，序列與撤場時機都由 01a.symbol/SymbolScene 依捲動寫入。
const {
  transitionProgress,
  setTransitionProgress,
  symbolMode,
  symbolLayerDone,
  symbolConvergeAmount,
  symbolCoreWarm,
  symbolBgLight,
} = useOrangeCoreProgress();

// ── 符號人臉的縮放：手機要再小一號 ──────────────────────────────────
// SymbolFace 的 world→px 換算只綁**視窗高**（uWorldToPx = 視窗高 / 559.6，見該元件的
// worldScale 註解），完全不看寬 —— 於是直式手機的「可視 world 寬」只有 559.6 × (390/844)
// ≈ 258.6，而人臉在 worldScale 0.8 時是 274.2 world 寬 ＝ **超出 106%，左右被裁掉**。
// 0.6 → 205.6（佔 80%），留出呼吸空間。桌機 1440×900 有 895 world 寬，怎麼放都夠。
//
// 斷點 767.98 對齊 mixins.scss 的 rwd-max('tablet')；用 matchMedia 而非 resize，
// 手機網址列收合不會誤觸（那只改高度）→ 只有真的跨斷點/轉向才重建粒子。
const SYMBOL_WORLD_SCALE = { pc: 0.9, mob: 0.6 };
const MOB_QUERY = '(max-width: 767.98px)';
// client 端在 setup 就同步取值 → 不會先用桌機值建一次粒子再重建。
// worldScale 不出現在 DOM 上，故 SSR(false) 與 client 首次求值不同也不會 hydration mismatch。
const isMobWidth = ref(
  import.meta.client ? window.matchMedia(MOB_QUERY).matches : false,
);
const symbolWorldScale = computed(() =>
  isMobWidth.value ? SYMBOL_WORLD_SCALE.mob : SYMBOL_WORLD_SCALE.pc,
);

// 引言淡出進度（0..1）：由下方 introFadeST 的 scrub 寫入。
// 刻意不掛在 pathProgress 的門檻上 —— 那條軌的進度換算成「文字還剩幾行沒被穿過」會隨
// 視窗高與文字行數浮動，門檻寫死就會像先前那樣在方塊還在字裡時就開始淡。
const introFade = ref(0);
const introOpacity = computed(() => String(1 - introFade.value));

// 引言的 runway：50vh（core 從文字底緣走到視窗中央所需）＋ 淡出窗口，兩者都由
// INTRO_FADE_VH 推出 → 淡出必然剛好在 pin 接手的同一刻結束（見 orange-core-config）。
const introRunway = vhLength(0.5 + INTRO_FADE_VH);

// hero 影片四階段（main/loop/outro/gone）全域共享，定義見 composables/useHeroVideo。
// 此處只讀狀態驅動畫面與捲動鎖：2026-08-16 起真值表縮成一條 ——
// 只有 main 且未離開過 loop（!hasLeftLoop）才鎖，其餘（含 outro）皆不鎖，
// 詳見下方 applyScrollLock 與 ~/utils/hero-scroll-lock 的 shouldLockHeroScroll。
//
// 載入層與影片的握手也走同一份全域狀態：
//   videoReady — HeroVideo 的 <video> canplay（或逾時 / 載入失敗）時設 true → HeroLoader 收尾條件。
//   loaderDone — HeroLoader @done 時由本元件設 true → HeroVideo 才開始播 main（避免被載入層蓋住白播）。
const {
  state: heroState,
  setState,
  isGone,
  shouldLockScroll,
  videoReady,
  loaderDone,
  heroStarted,
  returnToLoop,
  hasLeftLoop,
  skipOpening,
  scrubArmed,
} = useHeroVideo();

// 視窗高的單一來源（--vh）：轉場與引言淡出的尺長都吃它，不吃 window.innerHeight。
const { vhPx } = useViewportHeight();

// ── 帶 hash 進站：略過開場閘門 ────────────────────────────────────────
// （子頁漢堡選單的錨點會導到 /#forum 等；子頁的「返回」也是 /#media 這類連結。）
// 走既有的 gone 路徑而非新增旗標 —— setState('gone') 令 hasLeftLoop 為 true，
// shouldLockScroll 隨即 false，onMounted 的 applyScrollLock() 那一輪就不會上鎖
// （必須搶在它之前，否則會先上鎖再解鎖、中間閃一下並被 scrollTo(0,0) 拉回頂端）。
//
// ⚠️ 判定必須在 **render 之前**，不能等 onMounted —— 晚一個 render，HeroLoader 就會先
//    掛上一輪，再在使用者正要看的那一段上蓋一次 0.6s 的白色全螢幕淡出。
//    fragment 不會送到伺服器，故只有 client 讀得到 hash，分兩種情形：
//      client-side 導航（子頁 → /#media）：沒有 SSR 那一輪，在此就擋掉，載入層完全不進 DOM。
//      首次載入（hydration）：SSR 必然已經吐出載入層，此刻改值會 hydration mismatch →
//        留到 onMounted，改以 loaderBypass 把淡出換成瞬間移除（見 template 的 :name）。
const initialHash = import.meta.client ? window.location.hash.slice(1) : '';
// 只管**轉場樣式**：true → loader-cut（零時長、瞬間移除）。#loop 不設它，因為那條要走
// 正常的 loader-fade 淡出（載入層是跑完的，不是被抽掉的）。
const loaderBypass = ref(false);
// 只管**這個 hash 的進站處理跑過了沒**。原本是拿 loaderBypass 兼任，但 #loop 已經不設
// 那面旗子了 —— 不拆開的話 onMounted 會再跑一次 bypassForInitialHash()。
let hashHandled = false;

// 載入層的自走秒數。帶 #loop 回來時它的職責只是「等影片可播放」，不是首次進站的品牌開場，
// 故比較短 —— 影片已在 disk cache 時（從首頁進子頁再點 logo，最常見）這就是全部的等待時間。
// 影片還沒下載完則不受此值限制：進度封頂在 99% 等 videoReady（見 HeroLoader 的 ready）。
const LOADER_DURATION = { first: 2, returnToLoop: 1.2 };
const loaderDuration =
  initialHash === HERO_RETURN_HASH
    ? LOADER_DURATION.returnToLoop
    : LOADER_DURATION.first;

function bypassLoader() {
  loaderBypass.value = true;
  loaderDone.value = true;
  heroStarted.value = true;
  // 走 skipOpening() 而非 setState('gone')：後者不會設 openingSkipped，畫面上沒有
  // 影片可淡（loader-cut，影片根本沒播過），之後 scrub 讀到的 p 只要越過門檻仍會
  // 把 stage 淡回來 —— 等於把從未出現過的影片「復原」在畫面上。
  skipOpening();
}

// 帶 #loop 進站（子頁 header logo 點回來、或直接開 /#loop）：略過 start 閘門，落在 loop
// 而非 gone —— 使用者按 logo 要的是「回到最開始」，不是回到已經看完的狀態。
//
// ⚠️ 與其他 hash 不同，**載入層要留著跑完 0%→100%**，故不設 loaderBypass、
//    也不開 loaderDone 的閘（skipLoader: false，理由見 useHeroVideo 的 returnToLoop）。
//    原本這裡是瞬間開閘，於是：
//      client-side 導航 → 載入層完全不出現，影片沒快取時就是一片白等 10 秒以上；
//      直接開 /#loop → SSR 已吐出載入層，onMounted 才開閘 → 0% 閃現約 90ms 再跳掉。
//    兩種都是「進度停在 0% 就跳走」的觀感。留著跑完才有可讀的等待。
function bypassToLoop() {
  returnToLoop({ skipLoader: false });
}

// #loop 走倒帶、其餘 hash（子頁選單的 /#forum 這類）維持既有的「直接進 gone」。
function bypassForInitialHash() {
  if (hashHandled) return;
  hashHandled = true;
  if (initialHash === HERO_RETURN_HASH) bypassToLoop();
  else bypassLoader();
}

// ⚠️ 這一行**必須排在下面兩個 watch(heroState) 之後**（原本在它們之前）。
//    bypassToLoop() / bypassLoader() 會呼叫 setState()，而清理工作（resetCoreEntrance、
//    setTransitionProgress(0)）掛在 watch 裡 —— 監聽器還沒註冊，那次狀態改變就沒人接，
//    core 與轉場層會帶著上一輪的殘留狀態進場。搬到 watch 之後仍在 setup 內，
//    依舊搶在首次 render 之前，故上方「判定必須在 render 之前」的前提不受影響。
//    （宣告提升讓函式在此可用；watch 的 callback 也不會在註冊當下就跑。）

// ── 開場捲動鎖的「預設值」：SSR 就先鎖住 ──────────────────────────────
// 下方 applyScrollLock() 掛在 onMounted，**要等 hydration**。SSR 吐出的 HTML 到
// hydration 之間頁面是能自由捲的，手機上這段好幾百 ms，正好是使用者拿到畫面就往下
// 甩的時機。這裡在 SSR 階段就把 .is-boot-locked 掛上 <html>，讓「鎖住」是首次繪製
// 就成立的狀態；規則本體與 .is-scroll-locked 並排住在 assets/styles/base.scss。
//
// 為什麼用 useHead 掛 class 而不是把規則寫死在全域 CSS：規則必須**只在首頁生效**，
// 而 dev 的 Vite 不做 per-route CSS 分割（子頁一樣會載到 Hero 的樣式）—— 靠打包行為
// 判斷路由並不可靠。掛在 Hero 上則是構造上正確的：Hero 只出現在首頁。
// 換頁離開時 unhead 會自行把這個 class 收掉（它只管自己加的 token，不會動到下方
// 直接操作的 .is-scroll-locked 與 data-scroll-lock）。
useHead({ htmlAttrs: { class: 'is-boot-locked' } });

// 綁 shouldLockScroll 而非 heroState：鎖不鎖的真值表吃兩個輸入（state、hasLeftLoop，
// 見 ~/utils/hero-scroll-lock），只看 state 會漏掉 hasLeftLoop 單獨翻面的情形。
watch(shouldLockScroll, applyScrollLock);

// gone ＝ core 的進場時機。fromOutro 只用來回答「影片畫面裡有沒有一顆 core 可以交棒」——
// 不是所有 gone 都經過退場段（SKIP、hero 捲出視窗的強制收尾都會直接跳過來）。
watch(heroState, (s, prev) => {
  if (s !== 'gone') {
    resetCoreEntrance(); // 倒帶回 loop：收掉動畫、dot 歸位
    // 轉場進度一併歸零。header 在轉場期間刻意保持可點（見 AppHeader 的 z-index 註解），
    // 使用者真的會在轉場進行到一半時按 logo 回 loop —— 不歸零的話 HeroSymbolTransition
    // 會留在 active，在剛倒帶回來的影片上蓋一層近乎滿版的黑色 clip。
    // onBeforeUnmount 有同一行清理，但那條只在換頁時跑得到；就地倒帶不 unmount。
    setTransitionProgress(0);
    return;
  }
  runCoreEntrance(prev === 'outro');
});

// 帶 hash 進站的處理（見上方 bypassForInitialHash 的 ⚠）：排在兩個 watch 之後，
// 才接得到它自己觸發的那次 setState()。
if (initialHash && !useNuxtApp().isHydrating) bypassForInitialHash();

// core 於轉場開始後隱去：其後畫面上那個方塊由 HeroSymbolTransition 接手畫
// （避免兩層各畫一次而 drift）。以 opacity 隱藏而非 display:none —— 轉場層仍要讀它的螢幕矩形。
const coreVisible = computed(
  () => isGone.value && transitionProgress.value <= 0,
);

// transition pin：core 抵達視窗正中央時釘住整組，吃掉 TRANSITION_VH 捲動距離 scrub 兩段軸向放大。
// ⚠️ trigger 用 introRef 而非 .sec1 —— pin 會在 .sec1 內插入 pin-spacer 把 section 撐高，
//    拿 .sec1 的 'bottom bottom' 當 start 會變成循環依賴（量到的高度含 spacer）。
//    introRef 在被 pin 的 .sec1__inner 之內，幾何不受 spacer 影響；OrangeCorePath 的
//    endTrigger 用同一個元素，故「core 抵達中央」與「pin 開始」必然同一刻。
// ⚠️ pin 會在 .sec1__inner 寫入 transform，使其成為 fixed 子孫的 containing block →
//    HeroLoader 與 HeroSymbolTransition 都必須掛在 inner「外面」，否則改以 inner 為基準而跑位。
let transitionST: ScrollTrigger | null = null;
// 引言淡出：start 用量出來的幾何而非進度門檻 —— 'bottom center' ＝ 內容 group 底緣升到視窗中央，
// 而 core 全程定在視窗中央（見 .claude/memory/hero-core-screen-locked.md），
// 故這一刻正是「方塊剛穿出內容的最後一個元素」。其後吃掉 INTRO_FADE_VH 的捲動距離淡完。
// trigger 取內容 group（不含 runway）；scrub → 往回捲自動復原。
let introFadeST: ScrollTrigger | null = null;
// core 的進場動畫（見 runCoreEntrance）：留著才能在倒帶回 loop 時中途收掉。
let entranceTween: gsap.core.Tween | null = null;

onMounted(() => {
  // hero 影片體驗一律從頂端開始：停用瀏覽器捲動位置還原，
  // 避免重整後還原到內容區、卻因 main 狀態（!hasLeftLoop）把 body 鎖死在中途。
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // 轉向／拉視窗跨過 768 時換一組 worldScale（見上方 SYMBOL_WORLD_SCALE）。
  // addEventListener('change') 而非已棄用的 addListener；Safari 14 起支援。
  const mq = window.matchMedia(MOB_QUERY);
  const onMqChange = (e: MediaQueryListEvent) => (isMobWidth.value = e.matches);
  mq.addEventListener('change', onMqChange);
  onBeforeUnmount(() => mq.removeEventListener('change', onMqChange));

  // hydration 那一輪擋不掉（理由見上方 bypassLoader）：補在這裡，仍搶在 applyScrollLock 之前。
  // 重入由 bypassForInitialHash() 自己的 hashHandled 擋掉（client-side 導航時 setup 已經跑過）。
  if (initialHash) bypassForInitialHash();

  // 捲動鎖由本元件「單一擁有」：載入層一掛上就上鎖（此時為 main），直到狀態離開 main
  // （進 loop）才解鎖 —— outro／gone 都不鎖，捲動本身就是驅動 scrub 退場的動作，
  // 鎖住會讓 loop 之後的一切死結（真值表見 ~/utils/hero-scroll-lock 的
  // shouldLockHeroScroll）。HeroLoader 不再自行改 body.overflow —— 否則它卸載時
  // 先解鎖、本元件下一 tick 才重新上鎖，中間會出現「瞬間可捲動」的破口。
  applyScrollLock();

  if (!introRef.value || !innerRef.value) return;
  gsap.registerPlugin(ScrollTrigger);
  transitionST = ScrollTrigger.create({
    trigger: introRef.value,
    start: 'bottom bottom', // 引言整段（含 runway）底緣抵達視窗底 ＝ core 剛好停在視窗正中央
    // vhPx 而非 window.innerHeight：後者在行動裝置上會隨網址列收合而變，
    // 尺長跟著變 → pin-spacer 跟著變 → 其下整份文件位移（見 ~/composables/useViewportHeight）。
    end: () => `+=${vhPx(TRANSITION_VH)}`,
    pin: innerRef.value,
    pinSpacing: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => setTransitionProgress(self.progress),
    // 與 SymbolScene 的 symbolST 同一個缺口（理由詳見該處）：transitionProgress 是 useState、
    // 跨導航存活，而其餘三個回呼只在狀態改變時寫入 → remount 出來的新 trigger 一次都不叫，
    // 上一輪的殘值就留著。這裡目前還有 watch(heroState) 的 setTransitionProgress(0) 兜著，
    // 但那條只在「狀態真的改變」時才跑（回到同一個狀態就不跑），不該當成唯一防線。
    onRefresh: (self) => setTransitionProgress(self.progress),
    onLeaveBack: () => setTransitionProgress(0), // 捲回 pin 之前 → 收回轉場
    onLeave: () => setTransitionProgress(1), //     捲過 pin 之後 → 維持滿版，等 SymbolScene 接手
  });

  if (introBodyRef.value) {
    introFadeST = ScrollTrigger.create({
      trigger: introBodyRef.value,
      start: 'bottom center',
      end: () => `+=${vhPx(INTRO_FADE_VH)}`, // 同上，且必須與 introRunway 同一把尺
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => (introFade.value = self.progress),
      // 捲過整段後 ScrollTrigger 不再 update：明確補到 0 / 1，否則快速捲動會留下殘影透明度。
      onLeave: () => (introFade.value = 1),
      onLeaveBack: () => (introFade.value = 0),
    });
  }

  // ⚠️ arm 一定要排在落點確定之後（兩支函式都在 nextTick 內先 refreshScrollTriggers()
  //    再 scrollTo）。提早 arm 的話，子頁帶過來的捲動位置會讓 scrub 先判 gone、
  //    把影片 seek 到退場段，下一 tick 又被拉回 —— 使用者看到影片抽搐一下。
  if (initialHash === HERO_RETURN_HASH) scrollToTopForLoop().then(armScrub);
  else if (initialHash) scrollToInitialHash(initialHash).then(armScrub);
  else nextTick(armScrub);
});

function armScrub() {
  scrubArmed.value = true;
}

// 帶 #loop 進站：目標不是某個段落，而是「回到最開始」，所以要捲回頂端。
// 不能倚賴既有的兩條路：
//   ① #loop 對不到元素，vue-router 的 scrollToPosition 會警告後放棄；
//   ② applyScrollLock() 的 scrollTo(0,0) 只在 hasLeftLoop === false（首次體驗）時才跑。
// 已經捲過首頁的人 hasLeftLoop 為 true → 沿用子頁的捲動位置 → #app-hero 不在畫面上
// → HeroVideo 的 heroIO 立刻 setState('gone')，功能在被看見之前就被撤銷。
// nextTick + refreshScrollTriggers 的理由同 scrollToInitialHash：pin spacer 會改變文件高度。
function scrollToTopForLoop() {
  return nextTick(() => {
    refreshScrollTriggers();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
}

// 帶 hash 進站時的落點。必須等 pin 的 pin-spacer 撐開文件（refreshScrollTriggers()）
// 之後才量位置，否則量到的是沒有 spacer 的舊高度、會落在段落上方數個視窗。
// nextTick 等後續段落（Forum / Blessing / Media）掛載完成，它們的 ScrollTrigger 才在。
// ⚠ 這裡最需要 sort()：整份文件的高度是所有 pin 的佔位疊起來的，而各 pin 分散在不同
//   元件、建立順序不保證由上到下 —— 漏算任何一段佔位，落點就少捲那一段的距離。
function scrollToInitialHash(hash: string) {
  return nextTick(() => {
    refreshScrollTriggers();

    const target = document.getElementById(hash);
    if (!target) return;

    // 扣掉常駐 header 高度，落點才不會被 header 蓋住（同 AppHeader 的 getHeaderOffset）
    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height',
        ),
      ) || 0;

    // 落點的算式與 header 錨點列共用一份（見 ~/utils/anchor-landing）：段落可以宣告
    // data-anchor-offset-vh 把落點推進段落內某一刻，`#blessing` 就是這樣落在「笑臉
    // 逐格走完」那一格 —— 深連結與就地捲動落在不同位置的話，是那種沒人會發現的不一致。
    const landing = anchorLanding({
      elementTop: target.getBoundingClientRect().top + window.scrollY,
      headerOffset: headerHeight,
      offsetVh: anchorOffsetVh(target.dataset.anchorOffsetVh),
      vh: vhPx(),
    });

    // ⚠️ 跨頁導航（子頁選單 → /#forum）時 Nuxt 的 scrollBehavior 會等頁面轉場結束後
    //    「再捲一次」到 hash 元素，蓋掉下面這次捲動。它的偏移量取自元素的 scroll-margin-top
    //    （見 nuxt/dist/pages/runtime/router.options 的 _getHashElementScrollMarginTop），
    //    故一併寫上去讓兩邊落在同一點 —— 比賽誰後捲更可靠。
    //    宣告了深度的錨點這個值是**負的**（往段落內走），那是對的。
    target.style.scrollMarginTop = `${landing.scrollMarginTop}px`;

    // auto 而非 smooth：從別頁導進來時使用者預期「已經在那裡」，不是看著頁面自己捲。
    window.scrollTo({ top: landing.top, behavior: 'auto' });
  });
}

onBeforeUnmount(() => {
  document.documentElement.classList.remove('is-scroll-locked');
  document.body.classList.remove('is-scroll-locked');
  // data-scroll-lock 刻意留著（理由見 assets/styles/base.scss 的 .is-boot-locked 那段）
  //
  // scrubArmed 是 useState，跨導航存活，不會自己歸零：不在這裡關掉的話，第二次進站
  // （首頁 → 子頁 → 點 logo 回 /#loop）時它已經是 true，而子元件（HeroVideo）先於本
  // 元件 mounted —— dissolveST 建立時的 onRefresh 會用子頁帶過來的 scrollY 立刻算出
  // 一個很大的 p、直接寫狀態（很可能誤判 gone），之後才被 scrollToTopForLoop() 拉回，
  // 正是 scrubArmed 當初要防的抽搐（見上方 arm 時序的註解）。關掉後每次重新掛載都要
  // 重跑一次 arm 流程，落點確定後才重新武裝。
  // ⚠️ 首頁就地倒帶（returnToLoop()）不會走到這裡（不 unmount），維持 armed 是對的，
  //    不要把這行搬去 returnToLoop 或其他地方。
  scrubArmed.value = false;
  //
  // 轉場進度是全域共享的，必須歸零：header 在轉場期間刻意保持可點（疊在 z-10 的轉場層
  // 之上），使用者真的會在轉場進行到一半時離開。不歸零，下次回到首頁的第一個 render
  // 就會讓 HeroSymbolTransition 處於 active —— 在 ScrollTrigger refresh 之前蓋一層近乎
  // 滿版的黑色 clip。
  setTransitionProgress(0);
  transitionST?.kill();
  transitionST = null;
  introFadeST?.kill();
  introFadeST = null;
  entranceTween?.kill();
  entranceTween = null;
});

// ── core 的進場（gone 的那一刻）────────────────────────────────────────
// core 的落點由 OrangeCorePath 驅動（恆在視窗正中央，見
// .claude/memory/hero-core-screen-locked.md）；這裡只決定「它從哪裡滑過來」，
// 位移寫在內層 dot，外層仍歸 path 管、兩邊不互撞。三種情形：
//
//   影片在畫面上 ＋ 播過退場 → 交棒：疊到影片裡那顆 orange core 身上（位置＋尺寸）
//     再滑回落點。退場最後幾秒影片畫面裡就有一顆 core，直接淡入會「跳」一下。前提是
//     「影片與視窗維持 1:1」—— 2026-08-16 起這個前提由 .sec1__hero 的 position: sticky
//     提供（舞台被黏在螢幕上緣、跟視窗同尺寸，見 HeroVideo.vue 的 .sec1__hero 註解），
//     **不再是**捲動鎖（outro 期間捲動鎖其實已經解開，見上方 shouldLockScroll 的真值表）。
//     ⚠️ 日後若移除 sticky 改回別的定位方式，這裡的 1:1 前提要重新確認，否則交棒座標
//     換算會悄悄跑掉（同類警告見 HeroVideo.vue 的 .sec1__hero 註解）。
//     影片剪輯若已把 core 收在畫面正中心（＝ HERO_OUTRO_CORE_ANCHOR 的預設值），
//     位移與縮放都是 0、這條等於沒作用；它是吸收剪輯落點誤差的保險。
//
//   影片已捲出視窗 → 從畫面上緣滑進來。沒有可對齊的目標，硬套交棒會讓 core 從幾千 px
//     外飛進來。這條同時涵蓋「退場播到一半被捲走」與「根本沒進過 outro 就被捲走」
//     （兩者都由 HeroVideo 的 heroIO 強制收尾）。
//
//   影片在畫面上但沒播過退場（SKIP）→ 什麼都不做，維持單純淡入：畫面上根本沒有
//     影片那顆 core，硬做交棒會從一個不存在的東西身上滑出來。
//
// 影片只剩一角露在上緣時仍走交棒 —— 算出來的起點自然就落在畫面外偏上，與滑入是連續的。
function runCoreEntrance(fromOutro: boolean) {
  // 減少動態偏好：不做位移，直接在自己的落點淡入（同本檔其餘 reduced-motion 處理）
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const dot = orangeCoreRef.value?.dot ?? null;
  const core = orangeCoreEl.value;
  const video = heroVideoRef.value?.videoEl ?? null;
  if (!dot || !core || !video) return;

  // core 目前的螢幕矩形＝進場的終點（此刻在視窗正中央）
  const to = core.getBoundingClientRect();
  if (!to.width) return;
  const toX = to.left + to.width / 2;
  const toY = to.top + to.height / 2;

  const videoBox = video.getBoundingClientRect();
  const onScreen = isVerticallyOnScreen(videoBox, window.innerHeight);
  if (onScreen && !fromOutro) return; // SKIP

  const fromVideo = onScreen
    ? coverAnchorToScreen(
        videoBox,
        video.videoWidth,
        video.videoHeight,
        HERO_OUTRO_CORE_ANCHOR[getDeviceTypeByResolution()],
      )
    : null;
  // 影片在畫面上卻讀不到 metadata（例如載入失敗直接進 gone）→ 沒有可對齊的目標，
  // 也不該改用滑入（那是為「影片不在畫面上」設計的）→ 退回單純淡入。
  if (onScreen && !fromVideo) return;

  // 滑入：同一條垂直線、起點在視窗上緣之外（整顆看不見），尺寸不變。
  // 落點若本來就在上緣之上（捲得很遠的極端情形）就別動 —— 那會變成由下往上滑。
  if (!fromVideo && toY <= 0) return;
  const from = fromVideo ?? { x: toX, y: -to.height / 2, size: to.width };
  const cfg = fromVideo ? HERO_CORE_HANDOFF : HERO_CORE_DROP_IN;

  // core 外層帶著路徑切線 rotation（hero 段恆為 90°），子層的 translate 會跟著轉 →
  // 先把螢幕位移換回外層的 local 座標，否則水平位移會跑到垂直方向去。
  const rotation = Number(gsap.getProperty(core, 'rotation')) || 0;
  const d = unrotateDelta(from.x - toX, from.y - toY, rotation);

  entranceTween?.kill();
  gsap.set(dot, { x: d.x, y: d.y, scale: from.size / to.width });
  entranceTween = gsap.to(dot, {
    x: 0,
    y: 0,
    scale: 1,
    duration: cfg.duration,
    ease: cfg.ease,
    onComplete: () => (entranceTween = null),
  });
}

function resetCoreEntrance() {
  entranceTween?.kill();
  entranceTween = null;
  const dot = orangeCoreRef.value?.dot;
  if (dot) gsap.set(dot, { clearProps: 'x,y,scale' });
}

// 只有 main 期間鎖住頁面捲動；loop 起解鎖 —— 不解鎖就沒有捲動可以驅動 scrub，會死結
// （真值表見 ~/utils/hero-scroll-lock 的 shouldLockHeroScroll，2026-08-16 起只剩這一條）。
// 樣式集中在 base.scss 的 .is-scroll-locked：overflow:hidden ＋ padding-right
// 補回捲軸寬（--scrollbar-width，由 plugins/scrollbar-width.client.ts 量測）——
// 否則上鎖期間沒有捲軸、可用寬多 15px，解鎖後捲軸回來就會撐出水平捲軸。
//
// ⚠️ class 必須同時掛在 <html> 與 <body>：html 有 overflow-x: clip，根元素不再是
//    overflow: visible → body 的 overflow 不會傳播到視窗，只掛 body 完全鎖不住
//    （見 base.scss 的說明）。
//
// 鎖在 hydration 之前就成立了 —— 見上方 useHead 掛的 .is-boot-locked。
// 蓋上 data-scroll-lock 就是向那條 CSS 宣告「JS 接手了」，其後一律由 class 決定；
// 兩者在同一個同步區塊內完成，中間不會重繪 → 交接沒有破口。
function applyScrollLock() {
  const root = document.documentElement;
  root.dataset.scrollLock = 'hero';
  if (shouldLockScroll.value) {
    // 上鎖前先回頂端：否則重整後瀏覽器把位置還原到內容區、又處於 main，
    // 會被 overflow:hidden 永久鎖死在中途。
    //
    // ⚠️ hasLeftLoop 這條判斷式在目前規則下進到這裡時恆為 false —— shouldLockScroll
    //    只在 state === 'main' && !hasLeftLoop 時為 true（見 ~/utils/hero-scroll-lock），
    //    故能走進上面 if (shouldLockScroll.value) 分支，hasLeftLoop 必為 false。
    //    保留這行判斷式是防禦性寫法：萬一日後真值表再改（例如恢復某個狀態也鎖），
    //    這裡不必跟著改，也留下「這是有意的重新回頂端」這個語意。
    if (!hasLeftLoop.value) window.scrollTo(0, 0);
    root.classList.add('is-scroll-locked');
    document.body.classList.add('is-scroll-locked');
  } else {
    root.classList.remove('is-scroll-locked');
    document.body.classList.remove('is-scroll-locked');
  }
}
</script>

<template>
  <section ref="sec1Ref" class="sec1">
    <!-- 進度除錯已整合成跨章節的 <DevCoreProgress>，掛在 pages/index.vue（?pathdebug 開啟）。 -->

    <!-- 載入層：必須掛在 .sec1__inner「外面」——pinST 會在 inner 寫入 transform，使其成為
         fixed 子孫的 containing block，loader 放進去會改以 inner 為基準而跑位。
         @after-leave 再確認捲動鎖；HeroLoader 不碰 body.overflow，故無需等它卸載。
         轉場名稱在「帶 hash 進站」時換掉：loader-cut 沒有對應的 CSS（見 Hero.scss），
         Vue 量到零時長就立刻移除 —— 使用者要去的是某個段落，不該先看 0.6s 白色淡出。 -->
    <Transition
      :name="loaderBypass ? 'loader-cut' : 'loader-fade'"
      @after-leave="applyScrollLock"
    >
      <HeroLoader
        v-if="!loaderDone"
        :duration="loaderDuration"
        :ready="videoReady"
        @done="loaderDone = true"
      />
    </Transition>

    <!--
      start 閘門：載入層收掉後不直接播影片，先停在這一屏等使用者按 start
      （有聲播放必須綁在使用者手勢上，見 composables/useAppSound）。
      同樣掛在 .sec1__inner「外面」——它是 fixed 層，不能落進 pin 的 containing block。
      期間 heroState 仍為 main → body 保持捲動鎖，使用者不會先捲走。

      轉場名稱刻意與載入層的 loader-fade 分開：本層只有 leave（按下 start 後「白底淡出 ＋
      橘塊縮小淡掉」），而且要同時動到自己的內層元素 —— 那些規則住在 HeroStart 的 scoped
      style（Hero 的 scoped CSS 選不到別人的子元素），故此處只負責取名。
    -->
    <Transition name="hero-start-exit">
      <HeroStart
        v-if="loaderDone && !heroStarted"
        @start="heroStarted = true"
      />
    </Transition>

    <!-- 視覺內容整組包一層 inner：core / path 的絕對定位原點，也是 transition pin 的目標。 -->
    <div ref="innerRef" class="sec1__inner">
      <!-- hero：第一屏影片區塊（已抽為子元件 01.hero/HeroVideo.vue） -->
      <HeroVideo ref="heroVideoRef" />

      <!--
        orange core：影片退場結束後於第一屏正中央淡入 —— 這是 core 在 DOM 端的起點。
        位置由 OrangeCorePath 以 GSAP 驅動；此處只保留外觀與淡入。
        影片裡那顆 core 的落點若不在畫面正中心，由 runCoreEntrance 在淡入的同一刻補上
        位移／縮放（落點寫在 HERO_OUTRO_CORE_ANCHOR）。
      -->
      <OrangeCore ref="orangeCoreRef" :visible="coreVisible" />

      <!--
        core 移動路徑 overlay（section 級、1:1 px）：只有不可見的驅動線
        （新稿 hero 段沒有可見的設計線 —— 影片結尾那條階梯線在影片裡）。
        需要 .sec1（座標範圍 / trigger）與 core（被驅動）兩個元素。
      -->
      <OrangeCorePath
        :section-el="sec1Ref"
        :orange-core-el="orangeCoreEl"
        :end-el="introRef"
      />

      <div class="sec1__scene">
        <!-- intro 引言：置中窄欄；core 從文字後方垂直穿過，穿出內容的最後一個元素後整段才淡出讓位給轉場。
             本元素（含 runway）的底緣＝path 終點與 transition pin 起點的共用參照；
             runway 長度由 INTRO_FADE_VH 推出（--intro-runway），故淡完＝pin 接手。 -->
        <div
          ref="introRef"
          class="sec1__intro"
          :style="{ opacity: introOpacity, '--intro-runway': introRunway }"
        >
          <!-- introBodyRef 掛在「內容 group」而非單一段落上：淡出起點量的是整組的底緣
               （段落界線由 locales 的 body 陣列表達，見 CLAUDE.md 文案外部化）。 -->
          <div ref="introBodyRef" class="sec1__intro-body">
            <p
              v-for="(paragraph, i) in str.intro.body"
              :key="i"
              class="sec1__intro-p"
            >
              {{ paragraph }}
            </p>

            <!--
              段末 logo。刻意包一層 div 再放 UPic：UPic 的 classname 掛在內層 <img> 上，
              而本檔 <style> 是 scoped —— scoped 只會把 scope id 蓋在子元件的根 <picture>，
              選不到內層 <img>。包一層自家的 div，尺寸與間距就寫在自己的 BEM element 上。
              走 UPic 而非裸 <img>：src 由它前綴 APP_ASSETS_PATH，部署到子路徑／CDN 才不會 404。
              單檔圖用法（見 UPic.vue 案例 3）：logo.png 只有 1x、無 webp、無裝置後綴。
              eager：它在第一屏捲動範圍內，lazy 會讓 logo 在橘方塊經過時才冒出來。
            -->
            <div class="sec1__intro-logo">
              <UPic
                src="/img/logo"
                ext="png"
                :use-prefix="false"
                :use2x="false"
                :webp="false"
                :width="162"
                :height="48"
                loading="eager"
                :alt="str.intro.logoAlt"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
      hero → SymbolScene 轉場層（fixed 滿版）：橘方塊上下拉長 → 左右展開成滿版。
      必須掛在 .sec1__inner「外面」—— pin 會在 inner 寫入 transform，成為 fixed 子孫的
      containing block，掛進去會改以 inner 為定位基準而跑位。
    -->
    <HeroSymbolTransition
      :progress="transitionProgress"
      :core-el="orangeCoreEl"
      :done="symbolLayerDone"
    >
      <!--
        真正的符號粒子場：住在轉場層的 slot 內，故「左右展開時窗內已見粒子」是真的粒子。
        序列（disperse→face→converge）由 01a.symbol/SymbolScene 依捲動指派 symbolMode，
        本處只負責「在場」與外觀參數；兩邊透過 useOrangeCoreProgress 的 symbolMode 對接。
        converge 那一拍例外：它不吃 mode 的定時補間，而是由三個 *Amount 逐幀餵進去
        （那一拍要能往回捲倒帶，理由見 orange-core-config 的 convergeAmountAt）——
        收攏（symbolConvergeAmount）→ 白 core 轉橘（symbolCoreWarm）＋底色翻白
        （symbolBgLight）。後兩者是收攏跑完之後才開始的另一段窗口，見 CORE_WARM_VH。
        phrases 為 face 狀態下的宮格彩蛋句（row-major，對應 gridCols × gridRows）。

        active 由轉場層以 slot prop 交出（＝該層自己的顯隱條件），SymbolFace 據此停/續 rAF：
        轉場開始前與交棒之後，那顆滿版 canvas 是看不見的，不該還在跑幾千顆粒子的
        物理積分 + buffer 上傳 + draw call。
      -->
      <template #default="{ active: symbolLayerActive }">
        <SymbolFace
          :active="symbolLayerActive"
          v-model:mode="symbolMode"
          :converge-amount="symbolConvergeAmount"
          :warm-amount="symbolCoreWarm"
          :bg-light-amount="symbolBgLight"
          :phrases="str.symbol.phrases"
          :hint="str.symbol.hint"
          :hint-mob="str.symbol.hintMob"
          :hole-radius="25"
          :hole-spread="50"
          :return-ease="1.5"
          :friction="1.8"
          :impulse-strength="10000"
          :impulse-spray="0.9"
          :impulse-spray-z="0.6"
          :velocity-follow="0.1"
          :max-speed="3000"
          :max-particles="24000"
          :chars="SYMBOL_CHARS"
          :color="SYMBOL_COLOR_RAMP"
          :color-stops="SYMBOL_COLOR_STOPS"
          bg-color="#000"
          :world-scale="symbolWorldScale"
          :cols="85"
          :char-aspect="0.65"
          :contrast="1.2"
          :invert="false"
          :size-min="0.43"
          :size-max="1.0"
          :weight-steps="5"
          :weight-min="100"
          :weight-max="900"
          :glitch-items="SYMBOL_GLITCH_ITEMS"
          :float-amp="18"
          :float-micro="0.5"
        />

        <!--
          開場三行文案：疊在粒子場之上的純視覺層（見 01a.symbol/SymbolIntro.vue）。
          與 <SymbolFace> 同一個 slot ＝ 同生共死；顯隱由它自己讀 symbolProgress 決定，
          不吃 slot 的 active（那是「要不要跑 rAF」的訊號，文字層沒有 rAF）。
        -->
        <SymbolIntro />
      </template>
    </HeroSymbolTransition>
  </section>
</template>

<style src="./Hero.scss" lang="scss" scoped />
