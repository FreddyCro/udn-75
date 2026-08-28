<script setup lang="ts">
// hero：第一屏影片區塊（含 SEO 文字、skip 按鈕、下滑提示）。
// 影片三階段狀態自 useHeroVideo 全域共享；「各階段秒數」與「RWD 影片來源」集中在
// ~/utils/hero-video-config，本元件只負責依設定驅動 <video>（seek / 順播 / 換狀態）。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section1.json';
import { getDeviceTypeByResolution } from '@/utils/get-device';
import {
  HERO_DISSOLVE_VH,
  HERO_MAIN_STALL_FUSE_MS,
  HERO_OUTRO_LOCK_GRACE_MS,
  HERO_SKIP_APPEAR_AT,
  HERO_VIDEO_POSTER,
  HERO_VIDEO_READY_TIMEOUT,
  HERO_VIDEO_SRC,
  heroVideoSegments,
  type HeroVideoDevice,
  type HeroVideoSegment,
} from '@/utils/hero-video-config';
import {
  DISSOLVE_LEAVE,
  dissolveState,
  outroHoldScale,
} from '@/utils/hero-dissolve';
import { killScrollTriggers } from '@/utils/scroll-trigger';
// ── 退場：兩階段，A 由本元件負責 ─────────────────────────────────────
// 完整設計見 architecture/2026-08-21-hero-two-phase-exit-design.md。
//   A（本元件）  0 → vh(HERO_DISSOLVE_VH)：影片 sticky 黏在畫面上播退場，走完**硬切**消失
//   B（Hero.vue）影片消失那一刻起，**時間驅動**：引言在原地淡入，orange core 同時
//                從畫面中心淡入。B 不吃額外捲動距離（見 HERO_INTRO_REVEAL）。
//
// ⚠️ 2026-08-22 起設計師的「不要因為捲太快而看不到 outro」**成立了**，但不是靠這段距離：
//    退場段是由正片順播進來、在還鎖著的時候播完的（見 ~/utils/hero-scroll-lock）。
//    A 階段的捲動距離現在純粹是「按住 ＋ 緩慢放大 ＋ 走完硬切」的收尾手勢。
//
// 影片全程以 1× 播放，不 seek、不變速、不暫停 —— 兩條被實測否決的路留在紀錄裡：
//   逐幀 seek     三支剪輯關鍵幀平均間距 4.2s，退場段內 pc/pad 各 1 個、mob 0 個，
//                 每次 seek 要重解 57–143 幀（實測 38–157ms）＝ 畫面只能更新 6–26 次／秒
//   倍速追趕      連續值在固定刷新率螢幕上必然 cadence judder（影片 30fps／螢幕 60Hz，
//                 只有 1× 與 2× 整除）；改離散 {1,2} 後**更糟** —— 每次**改變**
//                 playbackRate 都讓媒體管線重新同步（約 200ms 擾動），加 600ms 最小駐留
//                 仍有殘影。附帶結論：每幀寫入**相同**值無害，代價全在改變那一刻。
//                 換到的好處也小（只影響捲很快的人最後等 1.25s 還是 2.5s），故恆定 1×。

const {
  state: heroState,
  setState,
  skip,
  videoReady,
  heroStarted,
  currentTime,
  scrubArmed,
  introAutoScrolling,
  skipOpening,
  openingSkipped,
  outroSpent,
  outroWatched,
} = useHeroVideo();

// 視窗高的單一來源（--vh）：scrub 的 end 吃它，不吃 window.innerHeight
// （後者在行動裝置上會隨網址列收合而變，見 useViewportHeight）。
const { vhPx } = useViewportHeight();

// skip 按鈕的現身條件：正片播放 HERO_SKIP_APPEAR_AT 秒（2026-08-22 起是 2s，稿上是 3s）後淡入，
// 順播進退場段就淡出。
// 綁「影片時間軸」而非 setTimeout：暫停 / 換 RWD 來源重載 / restart 重播
// 都自動一致，也沒有計時器要清。currentTime 由 onTimeUpdate 寫入（約每 250ms）。
// ⚠️ 2026-08-22 起這顆按鈕同時是**正片期間的唯一逃生口**（main 一律上鎖，見
//    ~/utils/hero-scroll-lock）。按下去只跳過正片：影片 seek 到退場段、頁面仍鎖著，
//    退場播完才解鎖並自動捲到引言（見 useHeroVideo 的 skip）。
//    它綁影片時間軸 ⇒ 影片完全動不起來時它不會出現，
//    那個死結由 armStallFuse 的保險絲兜著（見下方）。
const showSkip = computed(
  () => heroState.value === 'main' && currentTime.value >= HERO_SKIP_APPEAR_AT,
);

// 按下 skip 前先把 focus 交還：skip() 會讓 heroState 離開 main → showSkip 轉 false，
// 按鈕當下就要消失，focus 沒有留在原處的理由，直接退回 body。
// 不倚賴 inert 幫忙：實測 Chrome 的 inert 是「下一個 frame」才把 focus 移出（設下去的那個
// tick 仍是 activeElement），中間那段空窗期不該存在 —— 這裡同步做掉。
// ⚠️ 順序不可換：先 blur 再改狀態。
function onSkipClick(e: MouseEvent) {
  (e.currentTarget as HTMLElement | null)?.blur();
  skip();
}

// 全站音效開關：開啟時本影片不 muted（見 composables/useAppSound）。
const { soundOn } = useAppSound();

// 資源路徑前綴同 UVid / UPic（dev/prod 為空字串）
const runtime = useRuntimeConfig();
const ASSETS_PATH = runtime.public.APP_ASSETS_PATH;

// SSR 安全：先以 'pc' 為預設（與初次 client render 一致，避免 hydration mismatch），
// 掛載後再依實際解析度校正並監聽 resize（同 UVid）。
const device = ref<HeroVideoDevice>('pc');
const videoEl = ref<HTMLVideoElement | null>(null);
const heroEl = ref<HTMLElement | null>(null);
const stageEl = ref<HTMLElement | null>(null);

// Hero 需要 <video> 的螢幕矩形與 videoWidth/Height，才能把影片裡那顆 orange core 的落點
// 換算成螢幕座標（退場交棒，見 ~/utils/hero-core-handoff）。
defineExpose({ videoEl });

const videoSrc = computed(
  () => `${ASSETS_PATH}${HERO_VIDEO_SRC[device.value]}`,
);
const videoPoster = computed(() => {
  const poster = HERO_VIDEO_POSTER[device.value];
  return poster ? `${ASSETS_PATH}${poster}` : undefined;
});
// 目前裝置的階段秒數（pad / mob 有覆寫就用覆寫）
const segments = computed(() => heroVideoSegments(device.value));

let readyTimer: ReturnType<typeof setTimeout> | undefined;
// 切換 RWD 來源會重新載入影片：先記住秒數，metadata 就緒後跳回原處續播
let resumeAt = 0;

// 這一顆 <video> 自己的可播放狀態。與全域 videoReady 分開：後者是給 HeroLoader 的握手用的、
// 跨導航不重設，拿來當「本元素可不可以顯示」會在重新掛載時失準 —— 首頁 → 子頁 → 點 logo
// 回來時元素是全新的（readyState 0），全域旗標卻還是上一次的 true，防白閃的守衛就整條失效。
const elementReady = ref(false);

// 放行 HeroLoader（canplay / 逾時 / 載入失敗都算「不再等影片」）
const markReady = () => {
  videoReady.value = true;
  elementReady.value = true;
  if (readyTimer) {
    clearTimeout(readyTimer);
    readyTimer = undefined;
  }
  // ⚠️ 這裡**刻意不清** armStallFuse 那根絲（2026-08-22 code review 修正）。原本清掉，
  //    造成兩個問題：① 兩者同用 HERO_VIDEO_READY_TIMEOUT 且這支註冊得早 ⇒ markReady 先跑、
  //    把絲清掉，它永遠不會觸發；② canplay 之後才卡住（緩衝斷掉）就再也沒有保險。
  //    留著不清是安全的：那根絲在逾時當下才判斷影片能不能播，能播就什麼都不做。
};

// ── 保險絲：鎖在 main 卻沒有影片可看 ──────────────────────────────────
// 2026-08-22 起只要身處 main 就上鎖（含 restart 重播，見 ~/utils/hero-scroll-lock），
// 而 restart 這條路徑**沒有載入層也沒有 start 閘門**把關：影片此刻若拉不動（快取被清
// ＋ 網路慢、或直接離線），使用者會被鎖在一片白 —— stage 的 .is-loading 是 opacity 0，
// 露出來的是 .sec1 的白底 —— 而 SKIP 的現身條件綁影片時間軸（currentTime ≥ HERO_SKIP_APPEAR_AT），
// 影片不動就永遠不出現 ⇒ **整頁鎖死，且畫面上沒有任何東西喊出來**。
//
// 故「身處 main」就上一根保險絲，逾時當下若影片**仍然不能播**就走 skipOpening()
// （→ gone → 解鎖）。
//
// ⚠️ 判斷條件是 `readyState < HAVE_FUTURE_DATA`，**不是 elementReady**（2026-08-22 code
//    review 修正）。elementReady 的語意是「載入層別再等了」—— 逾時放行時也會設起，
//    拿它當條件等於在最需要保險的情形（影片始終不能播）判成「不必上絲」。
// ⚠️ 逾時值另立 HERO_MAIN_STALL_FUSE_MS（15s）而**不沿用載入層那支 8s**：同值時
//    markReady 的計時器註冊得早、會先把絲清掉；而且 8s 對慢速網路太短 —— 那時影片
//    往往只是還沒開始播，不該把整段開場跳掉。
// ⚠️ 守備範圍因此也含「canplay 之後才卡住」：只要逾時當下 readyState 掉回 3 以下就算。
let stallTimer: ReturnType<typeof setTimeout> | undefined;

function clearStallFuse() {
  if (!stallTimer) return;
  clearTimeout(stallTimer);
  stallTimer = undefined;
}

function armStallFuse() {
  clearStallFuse();
  if (heroState.value !== 'main') return;
  stallTimer = setTimeout(() => {
    stallTimer = undefined;
    // 逾時當下才判：還在 main（使用者可能已按 SKIP 離開），而影片仍然不能播。
    if (heroState.value !== 'main') return;
    const v = videoEl.value;
    if (v && v.readyState >= 3) return; // HAVE_FUTURE_DATA 以上 ＝ 能播，不必動它
    skipOpening();
  }, HERO_MAIN_STALL_FUSE_MS);
}

// ── 退場鎖的解除 ────────────────────────────────────────────────────
// 2026-08-22：退場段是在**還鎖著**的狀態下進來的（正片順播，或按 SKIP 跳過來 —— 兩條都鎖），
// 播到最後一格才解鎖 —— 這就是「不要因為捲太快而看不到 outro」的實作。
// 解鎖 ＝ 設 outroWatched，而那面旗標同時是 Hero「自動捲到引言」的觸發點
// （見 Hero.vue 的 scrollToIntroReading）—— 所以這裡是「一鎖換一滑」的交接點。
function releaseOutroLock() {
  clearOutroLockFuse();
  outroWatched.value = true;
}

// 鎖著的退場段若卡住（緩衝、解碼失敗、被瀏覽器暫停）就沒有任何東西會把鎖打開：
// SKIP 只在 main 出現、`onTimeUpdate` 也不會再被呼叫 ⇒ **整頁鎖死且畫面全靜**。
// 故進退場的同時上一根只看牆上時間的保險絲：退場段長度 ＋ 寬限之後無論如何解鎖。
// （2026-08-16 曾把這類保險絲整組刪掉，理由是「outro 不鎖之後影片卡住不會鎖死頁面」——
//  退場重新上鎖之後那個理由失效，見 HERO_OUTRO_LOCK_GRACE_MS 的註解。）
let outroLockTimer: ReturnType<typeof setTimeout> | undefined;

function clearOutroLockFuse() {
  if (!outroLockTimer) return;
  clearTimeout(outroLockTimer);
  outroLockTimer = undefined;
}

function armOutroLockFuse() {
  clearOutroLockFuse();
  if (heroState.value !== 'outro' || outroWatched.value) return;
  const seg = segments.value.outro;
  // 段落長度取不到（end 是 HERO_VIDEO_END）時退回 0，保險絲就只剩寬限那一段。
  const spanMs = Number.isFinite(seg.end)
    ? Math.max(0, (seg.end - seg.start) * 1000)
    : 0;
  outroLockTimer = setTimeout(() => {
    outroLockTimer = undefined;
    if (heroState.value !== 'outro' || outroWatched.value) return;
    outroWatched.value = true;
  }, spanMs + HERO_OUTRO_LOCK_GRACE_MS);
}

// muted 的最終值由 JS 決定：template 上的 muted 屬性只是「JS 跑起來之前」的保險
// （SSR / hydration 下 template 的 muted 不一定落到 DOM property，且絕不能先漏音）。
// soundOn 為 true 時不 muted —— 播放一律由 start 按鈕那次點擊觸發（有使用者手勢），
// 故有聲播放不會被瀏覽器封鎖；仍保留下方 catch 的 fallback 以防萬一。
async function play() {
  const v = videoEl.value;
  if (!v || heroState.value === 'gone') return;
  v.muted = !soundOn.value;
  try {
    await v.play();
  } catch (err) {
    // ⚠️ 只有「自動播放被封鎖」才放棄整段 hero —— 那時非放棄不可，否則正片／退場段的
    // 捲動鎖會把使用者永久鎖在第一屏。其餘 rejection 幾乎都是 AbortError：
    // promotePreload() 的 load() 撞上掛載時這次 play()、或 RWD 換 :src 造成的中斷。
    // 影片本身沒問題，loadedmetadata / watch(heroState) 會再播一次；
    // 一律當成被封鎖就會讓正常使用者莫名其妙看不到開場。
    if ((err as DOMException | undefined)?.name !== 'NotAllowedError') return;
    // 自動播放被封鎖是第四條「不經 scrub 進 gone」的路徑（其餘三條 skip() / onError() /
    // bypassLoader() 都已呼叫 skipOpening()）：呼叫 skipOpening() 而非裸 setState('gone')，
    // 否則 openingSkipped 不會被設，下一次捲動 scrub 讀到 p 落在 (ENTER, 1) 會判成 outro，
    // 把影片 seek 回退場段再 play() → 再被擋 → 又 setState('gone') → 狀態在 outro / gone
    // 之間每個捲動幀來回震盪、影片每幀重新 seek（2026-08-16 於 iOS 低耗電模式實測到）。
    markReady();
    skipOpening();
  }
}

function onCanPlay() {
  markReady();
}

function onLoadedMetadata() {
  const v = videoEl.value;
  if (!v) return;
  // 換來源（RWD）後跳回原本秒數
  if (resumeAt > 0) {
    v.currentTime = resumeAt;
    resumeAt = 0;
  } else {
    // watch(heroState) 只在「狀態改變」時對齊，但狀態可能在本元件存在之前就已經設好：
    // restartIntent 進站時 Hero 於自己的 setup 內就把 heroState 設成 main，
    // 那時本元件（子層）還沒建立、watcher 也還沒註冊 —— Vue 的 watch
    // 不會補發早於它的變更。restart 的目標秒數恰好是 0，但這一行仍不可省：換 RWD 來源
    // 或狀態是 outro 時（例如 HMR 重新掛載）少了它就會播錯段落。
    alignToSegment(v);
  }
  // 使用者已按下 start 才播（首次載入時通常還沒按，由下方 watch(heroStarted) 接手）
  if (heroStarted.value) void play();
}

// 段落的實際結束秒數。config 的 end 為 HERO_VIDEO_END（＝播到影片結束）時改以 duration 推，
// 留 0.1s 餘裕當收尾點：與 @ended 互為保險 —— seek 過的影片偶有不觸發 ended 的情形，
// 那時 gone 永遠不來、orange core 就接不上。duration 還沒讀到就回 Infinity（等 @ended）。
function segEnd(v: HTMLVideoElement, seg: HeroVideoSegment) {
  if (Number.isFinite(seg.end)) return seg.end;
  return v.duration ? v.duration - 0.1 : Infinity;
}

// 把影片對齊到目前狀態該在的段落：已在段內就不動（避免自動推進時多跳一下）。
// 用 segEnd 而非 seg.end：end 若填 HERO_VIDEO_END(Infinity)，直接比會把「影片已播完」
// 也算在段內 → play() 對已 ended 的影片會從 0 重播整支。
function alignToSegment(v: HTMLVideoElement) {
  const s = heroState.value;
  if (s === 'gone') return;
  const seg = segments.value[s];
  if (v.currentTime < seg.start || v.currentTime >= segEnd(v, seg)) {
    v.currentTime = seg.start;
  }
}

// 階段推進的單一真相＝影片時間軸：依 config 的段落秒數判斷何時換狀態。
function onTimeUpdate() {
  const v = videoEl.value;
  if (!v) return;
  currentTime.value = v.currentTime;
  const seg = segments.value;

  switch (heroState.value) {
    case 'main':
      // 正片播完 → **順播進退場段**（2026-08-22；原本是進 loop 等使用者下滑）。
      // 頁面此刻仍鎖著；main.end 與 outro.start 相接（2026-08-25 起不再跳段）⇒ 下方
      // watch(heroState) 的 alignToSegment 判定「已在段內」而不 seek，影片就這樣播下去。
      if (v.currentTime >= seg.main.end) setState('outro');
      break;
    case 'outro':
      // 退場段播到 outro.end（38.5s，非影片結尾）：停在最後一格 ＋ **解鎖**，
      // 不自己 setState('gone')。
      // ⚠️ outro → gone 的唯一權威是 scrub（dissolveState，見 applyDissolve）。這裡若也
      // 寫狀態，會與 scrub 變成兩個互相打架的驅動源（2026-08-16 實測到的抽搐）。
      // 故這裡只做兩件事：暫停影片、把鎖放開；「該不該進 gone」整個交給 p 是否 ≥ 1。
      // !v.paused 早退：避免 timeupdate 每幀（~250ms）都重複呼叫 pause()。
      if (v.currentTime >= segEnd(v, seg.outro) && !v.paused) {
        v.pause();
        releaseOutroLock();
      }
      break;
  }
}

// 影片播到尾（config 的 end 設得比影片長時會先發生）：視為當前段落結束。
function onEnded() {
  if (heroState.value === 'main') {
    setState('outro'); // 下方 watch 會把時間 seek 到退場段起點
    return;
  }
  // outro 播到底（@ended，通常先被上面 onTimeUpdate 攔到，這裡是保險）：影片已經自然
  // 停在最後一幀，只要把鎖放開。狀態改變交給 scrub（理由同 onTimeUpdate）。
  if (heroState.value === 'outro') releaseOutroLock();
}

function onError() {
  // 影片載入失敗：放行載入層並直接跳過開場 —— 否則捲動鎖會把整頁鎖死。
  // ⚠️ 呼叫 skipOpening() 而非 setState('gone')：後者不會設 openingSkipped，
  //    畫面上沒有影片可淡，之後 scrub 讀到的 p 只要越過門檻仍會把 stage 淡回來、
  //    等於把一支根本沒播出來的影片「復原」在畫面上。
  markReady();
  skipOpening();
}

// ── hero 捲出視窗 → 直接收尾 ────────────────────────────────────────
// orange core 綁在 gone 上（見 Hero.vue 的 coreVisible），影片沒播完 core 就不會出現。
// 影片都已經捲出視窗了，繼續播只是讓 core 遲到 —— 直接進 gone。兩種情形都吃得到：
//   ① 退場播到一半被捲走 → 不必等剩下的秒數
//   ② 退場播完解鎖後用捲軸 / End 鍵跳走（跳得比 dissolveST 的 end 還遠，scrub 來不及
//      判定就已經離開視窗）→ 否則影片在畫面外無限循環，core 永遠不出現
// main 期間頁面鎖著（見 useHeroVideo 的 shouldLockScroll），hero 不可能離開視窗，
// 故這條實際上只在解鎖之後生效 —— 2026-08-22 的兩次改動都沒有改變這件事：
// 重播回到 main 的同時也重新上鎖，而退場段播完之前也還鎖著。
let heroIO: IntersectionObserver | null = null;

// 狀態改變（順播推進 / SKIP / scrub）→ 對齊該段起點並續播；gone 則停住影片並歸零。
// 已落在目標段內就不 seek ⇒ main → outro 這個順播交界**不會** seek（兩段秒數相接，
// 見段落表）。真的會 seek 的只剩 SKIP（正片中途跳到退場段）與 restart（回到 0）。
watch(heroState, (s) => {
  const v = videoEl.value;
  // 進 main（首訪／restart 重播）＝ 又被鎖起來了 → 補上保險絲；離開 main 則收掉。
  armStallFuse();
  // 進 outro ＝ 鎖還在（要等它播完）→ 補上退場鎖的保險絲；離開 outro 則收掉。
  armOutroLockFuse();
  if (!v) return;
  if (s === 'gone') {
    v.pause();
    // ── 進 gone 就把影片歸零（2026-08-22 使用者裁決）──────────────────
    // 這一刻影片剛被**硬切**藏起來（見 applyDissolve），所以這個 seek 沒有人看得到；
    // 而它讓「之後任何一次影片重新出現」看到的都是第一幀，不是凍住的退場尾幀 ——
    // 使用者往回捲時原本會看到已經播完的 outro 那格，那是他明確不要的。
    // 交棒不受影響：runCoreEntrance 讀的是 <video> 的**幾何**（元素矩形 ＋
    // HERO_OUTRO_CORE_ANCHOR），不是畫面上的像素。
    v.currentTime = segments.value.main.start;
    return;
  }
  // 倍速歸位：一律 1×，且回捲離開退場時要把上一輪殘留的倍速清掉。
  v.playbackRate = 1;
  alignToSegment(v);
  void play();
});

// 按下 start 後才開始播 main（見 useHeroVideo 的 heroStarted）
watch(heroStarted, (started) => {
  if (started) void play();
});

// 音效開關可在播放中被切換（例如未來在 Header 加上按鈕）→ 即時套用到 <video>。
watch(soundOn, (on) => {
  const v = videoEl.value;
  if (v) v.muted = !on;
});

// ── 退場：sticky 保持影片在畫面上，這條 ST 只讀進度 ──────────────────
// 不 pin（理由寫在 .sec1__hero 的 SCSS 註解：兩種 pinType 在這個 DOM 結構下都會抖）。
let dissolveST: ScrollTrigger | null = null;
// 上一次 applyDissolve 收到的 p：用來辨識「回捲跨過 DISSOLVE_LEAVE」那一刻（見下方）。
let lastDissolveP = 0;

function buildDissolveST() {
  if (!heroEl.value) return;
  dissolveST = ScrollTrigger.create({
    // ⚠️ 用**數值** start／end，不要 trigger ＋ 'top top'（2026-08-21 修正）：
    //    以 .sec1__hero 當 trigger 時，ScrollTrigger 量到的起點是 scrollY 1080 而不是 0
    //    —— 那是個 position: sticky 元素，量測會拿到它「黏住之後」的位置。實測基準線
    //    （sticky ＋ 'top top'）：y=1080 時 stage 的 opacity 還是 1、y=1620 才 0.5，
    //    反推起點 1080、終點 2160，整段退場落在錯的捲動區間、而 sticky 早在 1298 脫黏。
    //    退場的起點在語意上就是 page top（scrollY 0），寫成數值最直接、也繞開量測。
    // vhPx 而非 window.innerHeight：後者在行動裝置上會隨網址列收合而變（見 useViewportHeight）。
    start: 0,
    end: () => vhPx(HERO_DISSOLVE_VH),
    // scrub 已移除：它只對「掛在 ST 上的 animation」有意義，本 ST 沒有動畫、只讀 progress。
    invalidateOnRefresh: true,
    onUpdate: (self) => applyDissolve(self.progress),
    // 快速捲過整段時 onUpdate 不保證收到端點值 —— 明確補上，否則影片會賴在畫面上不走。
    onLeave: () => applyDissolve(1),
    onLeaveBack: () => applyDissolve(0),
    onRefresh: (self) => applyDissolve(self.progress),
  });
}

// 2026-08-22（code review）：退場期間每幀補叫 applyDissolve 的那支 rAF（`tickOutro` /
// `stopOutroTick` / `outroRaf`）**已移除**。它存在的唯一理由是「揭露引言的條件有一半是
// 影片播完，而那不由捲動事件驅動」—— 而 2026-08-21 改成硬切之後，揭露只看
// `openingSkipped || p >= 1 || handedOff`，三個輸入沒有一個跟影片時間軸有關；
// p 的變化本來就由 dissolveST 的 onUpdate／onRefresh 送過來（自動捲動也是改捲動位置，
// 一樣會觸發）。留著等於整段鎖著的退場期間每幀寫回一模一樣的 opacity / transform。
// 倍速追趕那一版的實測紀錄搬到本檔檔頭，別再從這裡找。

function applyDissolve(p: number) {
  const stage = stageEl.value;

  // ── 回到頂端 ＝ 整趟重新武裝（連「開場已被跳過」也解除）──────────────
  // 判的是**跨越**而非 p < LEAVE 本身：SKIP／載入失敗／帶 hash 進站都發生在 p ＝ 0，
  // 若只看當下值，skipOpening() 觸發的這次 applyDissolve 會立刻把旗子清回去，
  // 影片根本不會消失（SKIP 等於失效）。只有「先離開過門檻、再回捲跨回來」才算數 ——
  // 那正是使用者由下往上捲回 page top 的軌跡。
  // 未 arm 期間的 p 是子頁帶過來的雜訊（見 scrubArmed），跨越照樣吞掉不處理。
  //
  // ⚠️ 這一條就是設計師「從子頁進來就看不到影片」的解方所在（2026-08-22）：帶 `/#forum`
  //    這類 hash 進站的人 openingSkipped 為 true、舞台被壓著隱藏，而**捲回 page top 會
  //    在這裡把它清掉**，影片於是回到畫面上；同一刻 dissolveState 把狀態判成 main
  //    （restart），使用者看到的就是從 0s 開始的完整影片。
  //
  // ⚠️ 2026-08-28（iPhone 無限重播）：跨越還要**是使用者捲的**才算。兩種不是的情形：
  //   ① ScrollTrigger.isRefreshing —— refresh 途中 pinned trigger 的量測會 scrollTo(0) 再
  //      還原，iOS 的 scroll 事件非同步派送，onRefresh／緊接的 onUpdate 可能拿到 p ＝ 0。
  //      refresh 送來的 p 是量測值，不是行為；這裡照樣記進 lastDissolveP（下一次真正的
  //      onUpdate 才不會又算成一次跨越），但不當事件。
  //   ② introAutoScrolling —— 退場播完後那段自動捲到引言的 tween 正在跑，捲軸不在使用者手上。
  //   解鎖時 body 的 overflow／padding-right 一變、Safari 工具列一收合，body 高度就變，
  //   refreshOnContentResize 的 ResizeObserver 會排一次 refresh —— 正好落在 ② 期間。
  //   狀態層另有 dissolveState 的 `outroSpent` 前提兜底（沒到過 gone 就沒有「回來」）。
  const crossedTop = p < DISSOLVE_LEAVE && lastDissolveP >= DISSOLVE_LEAVE;
  const returnedToTop =
    crossedTop && !ScrollTrigger.isRefreshing && !introAutoScrolling.value;
  lastDissolveP = p;
  // 清掉後下方 alpha 才算得出 1（同一次呼叫內影片就淡回來，不必等下一個捲動事件）。
  if (returnedToTop && scrubArmed.value) openingSkipped.value = false;

  // ── 揭露引言：捲完 A 階段就收掉，**硬切** ────────────────────────────
  // 2026-08-21 起不再等影片播完（使用者裁決，見設計文件第〇節）：滑完 vh(HERO_DISSOLVE_VH)
  // 影片就消失，接著 B 階段讓引言原地淡入。
  // ⚠️ 影片這一層是**硬切**（也是使用者裁決）：不與引言的淡入重疊。柔和度由 B 階段
  //    的淡入承擔，不由這裡。
  //
  // ⚠️ **交棒過（outroSpent）就一律不再露出影片** —— 這一條是為了「兩顆橘塊」：
  //    `.sec1__hero` 是 `position: sticky`，依規範 sticky **會建立堆疊脈絡** ⇒ 舞台的
  //    `z-index: 4` 被關在裡面，而 `.sec1__hero` 對外是 `z-index: auto`（＝0），
  //    輸給 `.sec1__orange-core` 的 `z-index: 2` —— 也就是 **DOM core 一直畫在影片之上**。
  //    以前撞不到，是因為 core 只在 `gone` 可見、而 `gone` 時 `p ≥ 1`、舞台正好隱藏。
  //    2026-08-22 兩件事同時打開了這個洞：影片進 gone 時 seek 回 frame 0（而 frame 0
  //    畫面正中央就有一顆橘塊，實測佔畫面寬 6.15%，是退場尾幀那顆的 3.7 倍），而回捲
  //    時 `p < 1` 又讓舞台亮回來 ⇒ 大顆（影片的）＋ 小顆（DOM core，26px）同時在畫面上
  //    （820×1180 實測：p=0.85 時一顆在 y=590 一顆在 y=860）。
  //    另有一條更早就存在的：`heroIO` 強制進 gone 時 `p` 可能還小於 1，同樣兩顆並存。
  //    修法選「交棒後就不再露出影片」而非「舞台可見時藏 core」—— 後者會讓使用者在
  //    回捲跨過 p=1 的瞬間看到方塊換了大小與位置（影片那顆與 DOM 那顆不同尺寸）。
  //    重播（restart）時 outroSpent 已在上方被清掉，故影片照樣回得來。
  //
  // ⚠️ 狀態推導必須排在下面的 opacity 寫入**之前**（2026-08-22 調整）：restart 那一幀
  //    `outroSpent` 會被清成 false、狀態變成 main，而 handedOff 讀的正是這兩個值。
  //    順序反過來的話那一幀會判成「已交棒 → 隱藏」，而狀態改變不會再叫一次
  //    applyDissolve ⇒ 影片重播了卻整層透明，要等下一個捲動事件才亮回來。
  if (scrubArmed.value && !openingSkipped.value) {
    // 跨回頂端 ＝ 重新武裝：這一趟重播要再看到完整的退場段。
    // （設起的點在 setState('gone')，見 useHeroVideo 的 outroSpent。）
    // ⚠️ 2026-08-28 起改排在 dissolveState **之後**：重播的前提正是「已交棒過」
    //    （見 hero-dissolve 的 outroSpent 說明），得先讓它讀到 true 才判得出 main，
    //    判成 main 之後再清掉、讓這一趟重播能再看到完整退場段。
    const next = dissolveState(p, heroState.value, {
      returnedToTop,
      outroSpent: outroSpent.value,
    });
    if (returnedToTop && next === 'main') outroSpent.value = false;
    if (next !== heroState.value) setState(next);
  }

  const handedOff = outroSpent.value && heroState.value !== 'main';
  const revealed = openingSkipped.value || p >= 1 || handedOff;

  // opacity 這幾行必須不論 scrubArmed／openingSkipped 都跑：SKIP／載入失敗當下 scrub
  // 可能還沒 arm（或已被跳過鎖死），stage 若少了這行會維持初始的完全不透明，
  // 影片永遠蓋在畫面上不走。
  if (stage) {
    stage.style.opacity = revealed ? '0' : '1';
    // 滿版渲染的層 opacity: 0 只是「畫成透明」，瀏覽器仍每幀合成它 ——
    // 額外設 visibility: hidden 才真的停止合成（見設計文件第一節的表）。
    stage.style.visibility = revealed ? 'hidden' : 'visible';
  }
  // 捲動連動的緩慢縮放：退場期間畫面上唯一會隨捲動變化的東西（理由見 outroHoldScale）。
  // 寫在 <video> 上而非 stage：stage 的 opacity 正由上面逐幀寫，兩個屬性分層互不干擾。
  if (videoEl.value) {
    videoEl.value.style.transform = `scale(${outroHoldScale(p).toFixed(4)})`;
  }
}

// openingSkipped 翻面時要立刻重套一次 —— applyDissolve 平常只由 ScrollTrigger 的
// 回呼驅動，而 SKIP／載入失敗／帶 hash 進站都可能發生在 scrollY 0（根本沒有捲動事件），
// 少了這一條，影片會賴在畫面上直到使用者捲動才被 scrub 淡掉（2026-08-16 實測發現）。
// 讀 dissolveST?.progress 而非假設 0：restartOpening() 也會把這面旗子清回 false，
// 而那次翻轉可能發生在非 0 的捲動位置。若翻轉發生在 p ≥ 1（使用者已經捲過整段 pin、
// 引言早就接上了），假設 0 會把舞台重新蓋回引言上。
watch(openingSkipped, () => applyDissolve(dissolveST?.progress ?? 0));

// scrubArmed 翻面（true）時要重新推導一次狀態 —— 它只是「開不開閘」，本身不改變 heroState。
// heroState 是 useState，跨導航存活：若在低 p（甚至 0）時重新掛載又還沒 arm，畫面會停在
// 上一輪殘留的 gone（不透明度已被上面那行帶回實體），此時若只是「打開閘門」而不重新推導，
// 就要等使用者捲動才會觸發 applyDissolve、狀態才追上 p —— 中間那格會先閃一次不透明的
// 首幀、接著第一次捲動又直接跳去 gone，而非讓 arm 當下就把狀態拉回與 p
// 相符的那一格。故 arm 的當下要主動呼叫 applyDissolve，等同「補一次 onRefresh」。
watch(scrubArmed, (on) => {
  if (on) applyDissolve(dissolveST?.progress ?? 0);
});

function onResize() {
  const next = getDeviceTypeByResolution();
  if (next === device.value) return;
  resumeAt = videoEl.value?.currentTime ?? 0; // 換來源會重新載入，記住進度
  device.value = next;
}

// ── preload 升級：metadata → auto ────────────────────────────────────
// template 上刻意只給 preload="metadata"。<video> 是 SSR 就吐出來的，preload="auto" 會讓
// 瀏覽器在 **HTML 解析階段**（bundle 都還沒下載完）就開始拉整支影片 —— pc 版 9.4MB（pad 6.6MB / mob 4.1MB），直接跟
// Nuxt bundle 搶頻寬與連線 → hydration 被推遲。而載入層在 hydration 之前是「SSR 吐出的
// 靜態 0%」（沒有方塊、沒有 JS 在跑，見 HeroLoader），影片拖多久、那個 0% 就定格多久。
//
// 故把緩衝挪到掛載之後才開始：此時 bundle 早已下載完，讓影片去搶已經無所謂，而載入層
// 至少要跑 duration 秒、外加 HERO_VIDEO_READY_TIMEOUT 的 99% 等待，時間綽綽有餘。
//
// nextTick：上面的 onMounted 會先呼叫 onResize() 校正 device，src 要等 DOM 更新才寫進去；
// 立刻 load() 會去拉舊的（SSR 預設的 pc）來源，手機上就是白拉 70MB —— 正好是要避免的事。
function promotePreload() {
  void nextTick(() => {
    const v = videoEl.value;
    if (!v || v.readyState >= 3) return;
    v.preload = 'auto';
    // 只改 preload 屬性不保證瀏覽器立刻續拉（各家實作不一），load() 才確定重啟緩衝。
    // ⚠️ load() 會把 currentTime 重置回 0。原本這裡假設「此刻必為 0（還沒播過）」，但掛載
    //    當下的 heroState 是跨導航存活的：落在 outro 時 alignToSegment 已經 seek 到 36s
    //    （restart 的目標秒數才是 0）。沿用 RWD 換來源那條路，記進 resumeAt、由
    //    onLoadedMetadata 跳回去。
    if (v.currentTime > 0) resumeAt = v.currentTime;
    v.load();
  });
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);

  gsap.registerPlugin(ScrollTrigger);
  buildDissolveST();

  // threshold 0 ＝ 完全沒有交集才算離開，與 Hero 判斷「從哪裡進場」用的
  // isVerticallyOnScreen 同一條界線（見 ~/utils/hero-core-handoff）。
  if (heroEl.value) {
    heroIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.isIntersecting || heroState.value === 'gone')
          return;
        setState('gone');
      },
      { threshold: 0 },
    );
    heroIO.observe(heroEl.value);
  }

  // ⚠️ <video> 是 SSR 就吐出來的，canplay 有可能在 hydration 掛上 @canplay 之前就已經觸發
  // （來源在快取裡時）→ 事件永遠等不到，載入層會一路卡在 99% 直到 HERO_VIDEO_READY_TIMEOUT
  // 才放行。故掛載時先補查 readyState（HAVE_FUTURE_DATA 以上＝已可播放），把漏掉的事件補回來。
  const v = videoEl.value;
  if (v && v.readyState >= 3) markReady();
  else {
    readyTimer = setTimeout(markReady, HERO_VIDEO_READY_TIMEOUT); // 遲遲無法播放時的保險
    promotePreload();
  }

  // 掛載當下就可能落在「鎖著」的狀態，而 watch(heroState) 只在**狀態改變**時才跑 ——
  // heroState / outroWatched 都是 useState、跨 client-side 導航存活，於是重新掛載時
  // 狀態可能已經是 main（首訪、子頁 logo 帶 restartIntent 進站）或 outro（上一輪還沒播完就
  // 換頁又回來）。兩根絲都在這裡補上一次；各自的 arm 函式會自己判斷該不該上。
  // ⚠️ 2026-08-22 code review：原本只補了 armStallFuse，且被夾在上面那個 else 裡
  //    （＝影片已可播就不上絲），兩件事都是漏洞。
  armStallFuse();
  armOutroLockFuse();

  // 同上一則的理由：來源在快取裡時 loadedmetadata 也可能早於 hydration 就觸發，
  // 那樣 onLoadedMetadata 的對齊就漏掉了 —— 掛載時補查一次（HAVE_METADATA 以上）。
  if (v && v.readyState >= 1) alignToSegment(v);

  if (heroStarted.value) void play(); // HMR / 重新掛載時可能已按過 start
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  if (readyTimer) clearTimeout(readyTimer);
  clearStallFuse();
  clearOutroLockFuse();
  heroIO?.disconnect();
  heroIO = null;
  // kill(false)：換頁時舊頁還在畫面上淡出，revert 會把畫面打回起始態而被看見
  // （見 utils/scroll-trigger 的 killScrollTriggers）
  killScrollTriggers(dissolveST);
  dissolveST = null;
});
</script>

<template>
  <!-- id 供 AppHeader 以 IntersectionObserver 監看 hero（捲離後才顯示 header）；
       本元件自己也監看同一個元素 —— 捲出視窗就直接收尾（見上方 heroIO） -->
  <div ref="heroEl" class="sec1__hero" id="app-hero">
    <!-- 影片舞台：.sec1__hero（sticky）的佔位比一個視窗高（$exit + $intro-at，
         見下方 style），本舞台只以 inset: 0 0 auto 0 疊在佔位「頂端」那一個視窗高
         （height: vh(1)），並不會溢出佔位之外 —— 佔位本身撐出的高度差就是引言頂端
         被蓋住的那一截，靠 sticky 把舞台一路釘在螢幕上緣直到溶解結束。
         顯隱交給 dissolveST 直接寫 style.opacity（見 script 的 applyDissolve）——
         這是整個遮擋機制的唯一驅動源，不再靠 class 或 transition。
         skip 與下滑提示收在裡面，底部錨定才會對齊「舞台（＝視窗）的下緣」。 -->
    <div ref="stageEl" class="sec1__hero-stage">
      <!-- 影片層：滿版。
           ⚠️ preload 是 "metadata" 而非 "auto"：這裡是 SSR 吐出的標記，auto 會在 HTML 解析階段
           就開始拉整支影片、拖慢 hydration（理由與升級時機見 script 的 promotePreload）。 -->
      <div
        class="sec1__hero-video"
        :class="{ 'is-loading': !elementReady }"
        aria-hidden="true"
      >
        <video
          ref="videoEl"
          class="sec1__hero-video-el"
          :src="videoSrc"
          :poster="videoPoster"
          muted
          playsinline
          preload="metadata"
          disablepictureinpicture
          @canplay="onCanPlay"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @ended="onEnded"
          @error="onError"
        />
      </div>

      <!--
        skip：正片播放 2s 後「原地」淡入，離開正片（跳到／順播進退場段）就淡出消失。
        按鈕本體（盒子、字級、雙箭頭、40% ↔ hover 100%）都在 <UBtnSkip>，
        本檔的 .sec1__hero-skip 只給版位與「現不現身」。
        刻意不用 v-if + <Transition>：常駐 DOM 只切 class，淡出期間 hover 規則已隨
        .is-visible 一起失效（不會卡在 100% 又被瞬間移除）。
        隱藏時（含淡出中）用 inert：一個屬性同時做掉「不進無障礙樹、不可 focus、不吃指標」，
        而且它會把已經在身上的 focus 逼出去（下一個 frame）—— 這是 tabindex -1 ＋ aria-hidden
        做不到的：那兩者只管「之後還能不能被 tab 到」，已握著的 focus 會留在原處，於是
        aria-hidden 蓋住 focus 元素，瀏覽器警告。
        這條路徑不只有點擊：使用者 tab 到按鈕後正片自然播完（→ 順播進退場段）也會走到，
        所以 onSkipClick 的 blur 不能替代 inert，兩者各補一半。
        tabindex 仍保留：inert 未支援時至少不會被 tab 進看不見的按鈕。
        pointer-events: none 也留在 scss，那是淡入淡出版位的一部分，不倚賴 inert。
      -->
      <UBtnSkip
        class="sec1__hero-skip"
        :class="{ 'is-visible': showSkip }"
        :label="str.hero.skipLabel"
        :aria-label="str.hero.skipAria"
        :tabindex="showSkip ? 0 : -1"
        :inert="!showSkip"
        @click="onSkipClick"
      />

      <!--
        下滑看更多：**退場段播完（＝解鎖）之後**才顯示（2026-08-22 改；原本是 loop 與 outro
        全程顯示，而 loop 已移除）。條件與捲動鎖是同一組輸入（見 ~/utils/hero-scroll-lock）：
        退場還在播的時候頁面是鎖著的，那時擺一個「請往下捲」的指引是在騙人。按過 SKIP 的人
        也一樣要等退場播完（SKIP 只跳過正片，見 useHeroVideo 的 skip）。
        ⚠️ 解鎖那一刻 Hero 會自動把畫面帶到引言（scrollToIntroReading），所以這個提示在
        正常流程下只會出現在那 1.1 秒的滑行途中。它真正的用途是**滑行被使用者中斷**時
        （ScrollToPlugin 的 autoKill）—— 那時畫面停在半路、影片是一格不會動的凍結影像，
        沒有這個指引使用者不知道還要往下捲。
        設計稿只有一個 22×12 的點陣 chevron，沒有文字也沒有那條垂直細線 ——
        文案改掛 .visually-hidden（由元件內部處理，見 label prop）：
        這個提示對讀不到圖形的使用者更重要。

        圖示本體、漂移動態與「點了往下捲一屏」都在 <UBtnScrollHint>；
        本檔的 .sec1__hero-scroll 只給版位與「現不現身」（同 .sec1__hero-skip 的分工）。
      -->
      <UBtnScrollHint
        v-if="heroState === 'outro' && outroWatched"
        class="sec1__hero-scroll"
        :label="str.hero.scrollHint"
      />
    </div>

    <!-- 文字保留於 DOM 供 SEO / 螢幕閱讀器，視覺上不顯示 -->
    <h1 class="visually-hidden">{{ str.hero.title }}</h1>
    <p class="visually-hidden">{{ str.hero.subtitle }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use './hero-geometry' as *;

// ── hero 佔位 ─────────────────────────────────────────────────────────
// 兩個旋鈕（$exit ／ $intro-at）的定義與沿革在 _hero-geometry.scss —— Hero.scss 的
// 黏著保險（.sec1__inner 的 min-height）吃同一份，故不在此各留一份。
// 佔位高 = 兩者相加，是推導值、不是第三個旋鈕：
//   引言上緣螢幕位置 = 佔位高 − scrollY ⇒ scrollY = vh($exit) 時剛好等於 vh($intro-at)。
// （B 階段的 $reveal 在 Hero.scss —— 那段由引言自己 sticky 停住，與本佔位無關。）

.sec1__hero {
  // ⚠️ 必須是 sticky，**不可以改用 ScrollTrigger 的 pin**（2026-08-21 實測否決）。
  //    pin 只有兩種實作方式，兩條路在這個 DOM 結構下都不通：
  //      pinType: 'fixed'     → position: fixed 的容器塊會變成帶 transform 的
  //                             .sec1__inner，「固定」不再是對視窗固定，影片跟著捲走。
  //      pinType: 'transform' → 位置由主執行緒的 JS 逐事件寫入，而頁面內容是由合成器
  //                             捲動的 ⇒ 影片層**永遠慢一幀**，慢的量等於當幀的捲動距離。
  //                             實測（每幀捲 10px）舞台的 top 恆為 −10；真實滾輪的每幀
  //                             增量是暴衝的（0, 0, 120, 0…），於是影片層每幀上下彈跳
  //                             ＝ 使用者回報的「嚴重不自然抖動」。
  //    sticky 由瀏覽器與捲動同步合成，沒有這一幀的落後，也不動文件高度。
  //
  // ⚠️ sticky 必須下在**本元素**、不能下在內層的 stage：stage 只能在本元素的框內黏，
  //    會在「佔位高 − 1vh」就脫離，撐不過退場。本元素的容器是很高的 .sec1__inner。
  // ⚠️ 脆弱點：日後若有人在 .sec1 到 <html> 之間任何一層加上 overflow: hidden/auto/scroll，
  //    sticky 會**安靜失效**（html 的 overflow-x: clip 不建立捲動容器，base.scss 已依賴此性質）。
  // ⚠️ 黏著範圍被容器底緣卡住，而**釋放點恰好等於引言的總高**（body ＋ runway）——
  //    代數上：釋放點 = innerBottom − 佔位高 = 引言總高，故佔位高一起長大時釋放點不變。
  //    約束是「A 階段的捲動距離 < 引言總高」，超過就會在退場還沒走完時脫黏，影片邊播
  //    邊被往上捲走，而且**沒有任何錯誤訊息**。
  //    2026-08-22（$exit 1 → 1.6）起這條約束由 .sec1__inner 的 min-height 保底
  //    （$sticky-floor，見 Hero.scss）撐著 —— 桌機引言只撐得出 488px + 0.9vh，1.6vh 靠
  //    自己一定不夠。實測釋放點餘裕（$exit ＝ 1.6，補保底後）：
  //      375×667 +293（引言自己就夠，保底未作用）、768×1024 +52、1440×900 +45、1920×1080 +54
  //    （沿革：vh(1.2) + 200px 在 1920×1080 上是 −16px → 改回 vh(1) 得 +380）。
  //    2026-08-23（$exit → 0.6）起約束回到「引言自己就夠」：引言總高 ≥ runway 的 0.9vh
  //    > 0.6vh 恆成立，保底不再作用（推導見 _hero-geometry.scss）。上面那組實測數字
  //    是 1.6 時代的紀錄，留著是為了下次有人想把 $exit 加回去時知道門檻在哪。
  position: sticky;
  top: 0;
  width: 100%;
  // 扣 --chrome-inset 的理由：main 鎖住期間手機網址列不會收合，解鎖那一刻的可視高度是
  // small viewport。不扣的話手機露出的引言會少掉工具列那一段（見 hero-body-lock-rules #5）。
  height: calc(#{vh($exit + $intro-at)} - var(--chrome-inset));
  // 黏住之後本元素會永久佔著螢幕上緣一大塊。它自己沒有背景也沒有互動內容
  // （白底在 .sec1、skip 在 .is-visible 時自己覆寫回 auto），一律放行指標。
  pointer-events: none;
}

// 影片舞台：只渲染一個視窗高（vh(1)），錨在 .sec1__hero 的頂端（inset: 0 0 auto 0）。
// 舞台被 pin 釘在螢幕上緣，.sec1__hero 剩下的高度就是引言的起點（見上方高度推導）。
.sec1__hero-stage {
  position: absolute;
  inset: 0 0 auto 0;
  height: vh(1);
  // ⚠️ 顯隱由 script 逐幀寫 style.opacity / style.visibility（見 applyDissolve），
  //    這裡**不可以**加 transition —— 逐幀寫入會與 transition 打架（每一幀都在重啟一段
  //    內插，結果是延遲又不平順）。而現在影片是**硬切**（p ≥ 1 就消失），本來就不需要內插
  //    —— 柔和度由 B 階段引言的原地淡入承擔（見 Hero.vue）。
  // cover 溢出的裁切從 .sec1__hero 移到這裡。
  overflow: hidden;
  // ⚠️ **這個 4 對外沒有作用**（2026-08-22 實測更正；原註解主張「4 ＞ .sec1__scene 的 3，
  //    引言頂端就是被這一層蓋住的，這是整個遮擋機制的全部」—— 那是錯的）。
  //    父層 `.sec1__hero` 是 `position: sticky`，依規範 sticky **會建立堆疊脈絡** ⇒ 這個 4
  //    只在該脈絡「內部」有效；`.sec1__hero` 本身是 `z-index: auto`（＝0），對外**輸給**
  //    `.sec1__scene` 的 3 與 `.sec1__orange-core` 的 2。
  //    實測（820×1180，退場期間強制把引言設成 opacity 1）：同一點的最上層元素是
  //    `.sec1__intro-p`，不是本舞台 —— 引言其實畫在影片**之上**。
  //    真正讓引言在退場期間看不見的是**引言自己的 opacity 0**（introReveal 要到 gone 才
  //    跑），不是這個 z-index。同一個成因也讓 DOM core 畫在影片之上（見 script 的
  //    applyDissolve 對「兩顆橘塊」的說明）。
  //    留著這個 4 的理由只剩脈絡內部的順序（skip 2 / 下滑提示 3 疊在影片層之上）。
  //    要讓層序與原本的意圖相符就得給 `.sec1__hero` 補一個 z-index（例如 4）——
  //    那會改動繪製順序，是獨立的一次決定，不在本次改動範圍。
  z-index: 4;
  // 它是覆蓋在引言上方的視覺層，攔下指標就等於讓露出來的引言選不到、點不到
  // （實測 elementFromPoint 命中的是已經全透明的 .sec1__hero-video，而非底下的引言段落）。
  // .sec1__hero-skip 自己在 .is-visible 時覆寫回 pointer-events: auto，不受影響。
  pointer-events: none;
}

.sec1__hero-video {
  position: absolute;
  inset: 0;
  // 影片本體在 pc 有尺寸上限（見 .sec1__hero-video-el），超過時置中、四周露出 hero 白底。
  // 不用 margin: auto —— 垂直置中也要，flex 一次做完；pad / mob 沒有上限，
  // 子項 100%×100% 仍是滿版，這層 flex 不影響它們。
  display: flex;
  align-items: center;
  justify-content: center;

  // canplay 之前 <video> 什麼都不畫（HERO_VIDEO_POSTER 三個裝置都是空字串），
  // 露出的是 .sec1 的白底。首次載入與子頁 logo 進站看不到（兩者載入層都蓋著），但**首頁
  // 就地重播**（restartOpening 的 skipLoader: true）沒有載入層 —— 那時就是一瞬純白。
  // 這與退場溶解無關，純粹是防白閃，
  // 故不隨 dissolveST 一起拆掉。
  //
  // ⚠️ 這條 transition 只管「淡入」（is-loading → 非 is-loading），與退場溶解是兩件事：
  //    退場溶解已經改由 scrub 直接寫 .sec1__hero-stage 的 style.opacity（見 script 的
  //    applyDissolve），這裡的 opacity 只在 canplay 前後那一瞬切換一次。0.8s 是這個
  //    一次性淡入自己的時間常數，原本餵它的常數已隨淡出保留機制一起刪掉，
  //    故直接寫死字面值，不要為了「湊常數」又補一個只有這裡用得到的匯出。
  transition: opacity 0.8s ease;

  &.is-loading {
    opacity: 0;
  }
}

// <video> 本體：置中；pc 裁切滿版（cover），pad / mob 完整收進畫面（contain）。
// RWD 影片「來源」在 ~/utils/hero-video-config 依裝置切換；三支剪輯都已到位，pad / mob
// 是直式（1024×1364 / 720×1280，與其視窗方向相符）—— 但視窗比例只要與剪輯不合，cover
// 仍會把畫面邊緣裁掉，故這兩個斷點改 contain（設計師指定）。留白露出的是 .sec1 的白底，
// 與 gone 之後淡出露出的同一個顏色，銜接不會有落差。
//
// ⚠️ 斷點刻意**不用** rwd-max('pc')（≤1279.98）而是 1024px（≤1023.98）：影片「來源」的
//    裝置界線是 ~/utils/get-device 的 getDeviceTypeByResolution —— pad 只涵蓋 768–1023，
//    1024 以上載入的已經是 pc 那支 1920×1080（橫式）。照 'pc' 斷點寫的話，1024–1279.98
//    這一段會拿橫式剪輯去套 contain ⇒ 上下兩條大白邊。這裡要對齊的是**來源**的斷點，
//    不是版面的斷點；換 HERO_VIDEO_SRC 的裝置界線時，這個值要跟著改。
//    （get-device 用整數 px、本 mixin 是 ±0.02px，1023–1024 之間的小數寬度會有一格
//    落差；那是既有的量測慣例差異，非本規則獨有。）
//
// ⚠️ 改 object-position 要一起改退場交棒的換算：coverAnchorToScreen 預設以 center 分配
//    裁切量（見 ~/utils/hero-core-handoff 與 Hero.vue 的 runCoreEntrance），
//    不同步就會讓 DOM core 疊到影片裡那顆的旁邊。
.sec1__hero-video-el {
  display: block;
  width: 100%;
  height: 100%;
  // 舞台上限（pc 2560×1440，見 base.scss 的 --hero-stage-max-*）—— 與載入層、start
  // 閘門共用同一組值並同樣置中，三層的中心才會落在同一點。
  // 超過上限時影片盒置中、多出來的區域露出 hero 白底（見上層的 flex）；那與 gone 之後
  // 淡出露出的白底同一個顏色，銜接不會有落差。
  //
  // 退場交棒不必跟著改：coverAnchorToScreen 吃的是 <video> 自己的
  // getBoundingClientRect()（見 Hero.vue 的 runCoreEntrance），盒子縮小、置中都算得到。
  max-width: var(--hero-stage-max-w);
  max-height: var(--hero-stage-max-h);
  object-fit: cover;
  object-position: center;
  pointer-events: none;

  @include rwd-max(1024px) {
    object-position: center; // pad（直式剪輯，768–1023 ＝ pad 來源的範圍）
    object-fit: contain;
  }
  // mob 與 pad 目前同值，仍各寫一次 —— 日後把 pad 改回 cover 時 mob 不會跟著被改掉。
  @include rwd-max('tablet') {
    object-position: center; // mob（直式剪輯）
    object-fit: contain;
  }
}

// skip 按鈕的「版位與現不現身」；按鈕本體（100×48 的盒子、字級、雙箭頭、
// 40% ↔ hover 100%）都在 <UBtnSkip>，見 components/ui/UBtnSkip.vue。
// 右下角座標同樣照稿上絕對值（1920 影片稿的 right 34、bottom 31，不換算 ——
// 理由與尺寸相同，見 UBtnSkip.vue 檔頭的說明）。
//
// 命中區不必外擴：按鈕本體已是 100×48，兩邊都超過 44px 的觸控最小建議尺寸
// （改回 ÷1.5 的 66.67×32 才需要像 HeroStart 音效鈕那樣用 ::after 補）。
//
// ⚠️ 這裡的 opacity 只負責「淡入 / 淡出」，元件內的 40% 畫在它自己的 __row 上 ——
// opacity 是乘算的，故顯示時實際為 1 × .4。兩者不可合併成同一條規則。
// ⚠️ bottom 要加 --chrome-inset：本容器高 vh() ＝ large viewport，手機剛進站時
// 網址列／底部工具列是展開的，容器底部那 60–115px 在可視範圍之外。開場期間頁面
// 又鎖著、工具列永遠不會收合 → 不補這一段，這顆按鈕在手機上全程看不到。
// （見 ~/utils/viewport-height 的 chromeInset()；下方「下滑看更多」同理。）
.sec1__hero-skip {
  position: absolute;
  right: 34px;
  bottom: calc(31px + var(--chrome-inset));
  z-index: 2; // 疊在影片層之上
  // 未到 3s（或已離開正片）：全透明且完全不可點
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
  }
}

// 下滑看更多：水平置中、貼齊「看得到的」hero 底緣上方一段距離
// （bottom 吃 --chrome-inset 的理由同上方 skip）。
//
// 底距照三份稿的絕對值（同 skip，不做比例換算）：稿上圖示皆為 22×12、水平置中，
// 只有底距不同 —— mob 414×736 距底 44、pad 768×1024 距底 72、pc 1280×720 距底 44。
// （mob 稿實際落在中心右側 6px，判定為稿上誤差，這裡照 pad / pc 一律置中。）
//
// 22×12 的框與圖示動態都在 <UBtnScrollHint> 裡（元件持有尺寸與色票），
// 本規則只有版位 —— 於是上面那組底距量到的始終是同一個框。
//
// ⚠️ pointer-events: auto 不是保險，是必要條件：.sec1__hero-stage 是 pointer-events: none
//    （它是覆蓋在引言上方的視覺層），不覆寫回來，這顆按鈕的命中會一路穿過那些 none 的
//    祖先掉到 .sec1__inner 去 —— 2026-08-20 實測 elementFromPoint 抓到的就是它。
//    同一個處方見上方 .sec1__hero-skip 的 .is-visible。
// ⚠️ z-index 3 ＞ skip 的 2：兩者不重疊，純粹是把「提示在影片層之上」寫明，
//    不倚賴 DOM 順序（stage 有 z-index 又 positioned ⇒ 兩者都關在它的堆疊脈絡內）。
.sec1__hero-scroll {
  position: absolute;
  left: 50%;
  bottom: calc(44px + var(--chrome-inset));
  z-index: 3;
  transform: translateX(-50%);
  pointer-events: auto;

  @include rwd-min('tablet') {
    bottom: calc(72px + var(--chrome-inset));
  }
  @include rwd-min('pc') {
    bottom: calc(44px + var(--chrome-inset));
  }
}

@media (prefers-reduced-motion: reduce) {
  .sec1__hero-video,
  .sec1__hero-skip {
    transition: none; // skip 改為直接出現 / 消失（時間點不變）
  }

  // 捲動連動的縮放屬於「動態」：關掉動態偏好時不做。script 仍會寫 transform，
  // 這條用 !important 蓋掉 inline style —— 逐幀寫入的 inline 值沒有別的辦法擋。
  .sec1__hero-video-el {
    transform: none !important;
  }
}
</style>
