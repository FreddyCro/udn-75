<script setup lang="ts">
// hero：第一屏影片區塊（含 SEO 文字、skip 按鈕、下滑提示）。
// 影片四階段狀態自 useHeroVideo 全域共享；「各階段秒數」與「RWD 影片來源」集中在
// ~/utils/hero-video-config，本元件只負責依設定驅動 <video>（seek / loop / 換狀態）。
import str from '@/locales/section1.json';
import { getDeviceTypeByResolution } from '@/utils/get-device';
import {
  HERO_OUTRO_MAX_MS,
  HERO_OUTRO_STALL_GRACE_MS,
  HERO_SKIP_APPEAR_AT,
  HERO_VIDEO_POSTER,
  HERO_VIDEO_READY_TIMEOUT,
  HERO_VIDEO_SRC,
  heroVideoSegments,
  type HeroVideoDevice,
  type HeroVideoSegment,
} from '@/utils/hero-video-config';
import {
  createHeroGestureAccum,
  heroGestureStep,
  HERO_GESTURE,
} from '@/utils/hero-scroll-intent';

const {
  state: heroState,
  setState,
  skip,
  rewindToLoop,
  isGone,
  videoReady,
  heroStarted,
  currentTime,
} = useHeroVideo();

// skip 按鈕的現身條件（設計稿 #BN skip）：正片播放 HERO_SKIP_APPEAR_AT 秒後淡入，
// 正片播完進 loop 就淡出。
// 綁「影片時間軸」而非 setTimeout：暫停 / 換 RWD 來源重載 / 倒帶回 loop
// 都自動一致，也沒有計時器要清。currentTime 由 onTimeUpdate 寫入（約每 250ms）。
const showSkip = computed(
  () => heroState.value === 'main' && currentTime.value >= HERO_SKIP_APPEAR_AT,
);

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

// Hero 需要 <video> 的螢幕矩形與 videoWidth/Height，才能把影片裡那顆 orange core 的落點
// 換算成螢幕座標（退場交棒，見 ~/utils/hero-core-handoff）。
defineExpose({ videoEl });

const videoSrc = computed(() => `${ASSETS_PATH}${HERO_VIDEO_SRC[device.value]}`);
const videoPoster = computed(() => {
  const poster = HERO_VIDEO_POSTER[device.value];
  return poster ? `${ASSETS_PATH}${poster}` : undefined;
});
// 目前裝置的階段秒數（pad / mob 有覆寫就用覆寫）
const segments = computed(() => heroVideoSegments(device.value));

let readyTimer: ReturnType<typeof setTimeout> | undefined;
// 切換 RWD 來源會重新載入影片：先記住秒數，metadata 就緒後跳回原處續播
let resumeAt = 0;

// 放行 HeroLoader（canplay / 逾時 / 載入失敗都算「不再等影片」）
const markReady = () => {
  videoReady.value = true;
  if (readyTimer) {
    clearTimeout(readyTimer);
    readyTimer = undefined;
  }
};

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
    // ⚠️ 只有「自動播放被封鎖」才放棄整段 hero —— 那時非放棄不可，否則 main / loop 的
    // 捲動鎖會把使用者永久鎖在第一屏。其餘 rejection 幾乎都是 AbortError：
    // promotePreload() 的 load() 撞上掛載時這次 play()、或 RWD 換 :src 造成的中斷。
    // 影片本身沒問題，loadedmetadata / watch(heroState) 會再播一次；
    // 一律當成被封鎖就會讓正常使用者莫名其妙看不到開場。
    if ((err as DOMException | undefined)?.name !== 'NotAllowedError') return;
    markReady();
    setState('gone');
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

// 階段推進的單一真相＝影片時間軸：依 config 的段落秒數判斷何時換狀態 / 循環。
function onTimeUpdate() {
  const v = videoEl.value;
  if (!v) return;
  currentTime.value = v.currentTime;
  const seg = segments.value;

  switch (heroState.value) {
    case 'main':
      if (v.currentTime >= seg.main.end) setState('loop'); // 主要內容播完 → loop 段
      break;
    case 'loop':
      if (v.currentTime >= seg.loop.end) v.currentTime = seg.loop.start; // loop 段循環
      break;
    case 'outro':
      // 退場段播到 outro.end（38.5s，非影片結尾）→ gone（影片淡出、orange core 淡入）
      if (v.currentTime >= segEnd(v, seg.outro)) setState('gone');
      break;
  }
}

// 影片播到尾（config 的 end 設得比影片長時會先發生）：視為當前段落結束。
function onEnded() {
  const seg = segments.value;
  if (heroState.value === 'main') {
    setState('loop'); // 下方 watch 會把時間拉到 loop 起點
    return;
  }
  if (heroState.value === 'loop') {
    const v = videoEl.value;
    if (v) v.currentTime = seg.loop.start;
    void play();
    return;
  }
  if (heroState.value === 'outro') setState('gone');
}

function onError() {
  // 影片載入失敗：放行載入層並直接進 gone —— 否則捲動鎖會把整頁鎖死。
  markReady();
  setState('gone');
}

// ── 退場段的保險絲 ──────────────────────────────────────────────────
// outro 期間頁面鎖住（見 useHeroVideo 的 shouldLockScroll），影片若卡住就永遠等不到 gone、
// 整頁鎖死。timeupdate / @ended 都靠影片自己前進，卡住時兩者都不會來，故另起一支計時器。
let outroTimer: ReturnType<typeof setTimeout> | undefined;

function clearOutroTimer() {
  if (outroTimer) {
    clearTimeout(outroTimer);
    outroTimer = undefined;
  }
}

// ── hero 捲出視窗 → 直接收尾 ────────────────────────────────────────
// orange core 綁在 gone 上（見 Hero.vue 的 coreVisible），影片沒播完 core 就不會出現。
// 影片都已經捲出視窗了，繼續播只是讓 core 遲到 —— 直接進 gone。兩種情形都吃得到：
//   ① 退場播到一半被捲走 → 不必等剩下的秒數
//   ② 倒帶回 loop 後用捲軸 / End 鍵跳走（沒有 wheel 手勢 → 永遠不會進 outro）
//      → 否則影片在畫面外無限循環，core 永遠不出現
// main / loop 期間頁面鎖著、hero 不可能離開視窗，故這條實際上只在「離開過 loop」之後生效。
let heroIO: IntersectionObserver | null = null;

function armOutroTimer(v: HTMLVideoElement) {
  const seg = segments.value.outro;
  const end = segEnd(v, seg);
  const ms = Number.isFinite(end)
    ? (end - seg.start) * 1000 + HERO_OUTRO_STALL_GRACE_MS
    : HERO_OUTRO_MAX_MS;
  outroTimer = setTimeout(() => {
    if (heroState.value === 'outro') setState('gone');
  }, ms);
}

// 狀態改變（SKIP / 手勢 / 自動推進）→ 對齊該段起點並續播；gone 則停住影片。
// 已落在目標段內就不 seek：main → loop 是相接的，自動推進不會有跳動。
// loop → outro 則必定 seek（33 → 36 中間刻意留白，見 hero-video-config 的段落表）。
watch(heroState, (s) => {
  clearOutroTimer(); // 離開 outro（正常播完或倒帶）都要拆掉保險絲
  const v = videoEl.value;
  if (!v) return;
  if (s === 'gone') {
    v.pause();
    return;
  }
  // 不在目標段內才 seek。用 segEnd 而非 seg.end：end 若填 HERO_VIDEO_END(Infinity)，
  // 直接比會把「影片已播完」也算在段內 → play() 對已 ended 的影片會從 0 重播整支。
  const seg = segments.value[s];
  if (v.currentTime < seg.start || v.currentTime >= segEnd(v, seg)) {
    v.currentTime = seg.start;
  }
  void play();
  if (s === 'outro') armOutroTimer(v);
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

// ── 方向手勢：loop 往下 → outro；gone 且在頂端往上 → 倒帶回 loop ──────────
// loop 期間 body 鎖住（沒有 scroll 事件），故一律從 wheel / touchmove 的位移自行累積；
// 判定邏輯在 ~/utils/hero-scroll-intent（純函式，有單元測試）。
// 累積器用普通變數而非 ref：每次事件只讀寫數字，不需要驅動畫面（<script setup> 內
// 的變數本身就是每個元件實例各一份）。
let gesture = createHeroGestureAccum();

function feedGesture(delta: number) {
  // 兩個出口都只在 loop / gone 開著，main 與 outro 怎麼滑都不會有意圖 —— 這幾支監聽
  // 掛在 window 上、整頁生命週期都在，不必陪著跑。
  // ⚠️ **不要**再加上 atTop 的早退把 gone 也擋掉：gone 期間即使還沒回到頂端也必須持續
  //    累積，回滑時的第一個負值才有東西可以反向清掉、立刻算數 —— 那正是 heroGestureStep
  //    的 reversed 分支在處理的手感（見 hero-scroll-intent 的註解 ②）。
  const inLoop = heroState.value === 'loop';
  if (!inLoop && !isGone.value) return;

  const { intent, accum } = heroGestureStep(
    gesture,
    {
      delta,
      now: performance.now(),
      inLoop,
      isGone: isGone.value,
      atTop: window.scrollY <= 0,
    },
    HERO_GESTURE,
  );
  gesture = accum;
  if (intent === 'to-outro') setState('outro');
  else if (intent === 'to-loop') rewindToLoop();
}

// passive：本監聽不 preventDefault（loop 期間 body 已鎖、gone 在頂端也無處可捲），
// 宣告 passive 讓瀏覽器不必等我們就能處理捲動。
function onWheel(e: WheelEvent) {
  feedGesture(e.deltaY);
}

let touchY = 0;
function onTouchStart(e: TouchEvent) {
  touchY = e.touches[0]?.clientY ?? 0;
}
function onTouchMove(e: TouchEvent) {
  const y = e.touches[0]?.clientY ?? touchY;
  feedGesture(touchY - y); // 手指往上移 ＝ 內容往下捲 ＝ delta 為正
  touchY = y;
}

// 鍵盤：一次按鍵直接給滿門檻（鍵盤沒有「累積位移」的概念）
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    feedGesture(HERO_GESTURE.toOutroPx);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home') {
    feedGesture(-HERO_GESTURE.toLoopPx);
  }
}

function onResize() {
  const next = getDeviceTypeByResolution();
  if (next === device.value) return;
  resumeAt = videoEl.value?.currentTime ?? 0; // 換來源會重新載入，記住進度
  device.value = next;
}

// ── preload 升級：metadata → auto ────────────────────────────────────
// template 上刻意只給 preload="metadata"。<video> 是 SSR 就吐出來的，preload="auto" 會讓
// 瀏覽器在 **HTML 解析階段**（bundle 都還沒下載完）就開始拉整支影片 —— pc 版 70MB，直接跟
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
    // 此刻 currentTime 必為 0（還沒播過），load() 的重置沒有東西可丟。
    v.load();
  });
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('keydown', onKeydown);

  // threshold 0 ＝ 完全沒有交集才算離開，與 Hero 判斷「從哪裡進場」用的
  // isVerticallyOnScreen 同一條界線（見 ~/utils/hero-core-handoff）。
  if (heroEl.value) {
    heroIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.isIntersecting || heroState.value === 'gone') return;
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

  if (heroStarted.value) void play(); // HMR / 重新掛載時可能已按過 start
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('keydown', onKeydown);
  if (readyTimer) clearTimeout(readyTimer);
  clearOutroTimer();
  heroIO?.disconnect();
  heroIO = null;
});
</script>

<template>
  <!-- id 供 AppHeader 以 IntersectionObserver 監看 hero（捲離後才顯示 header）；
       本元件自己也監看同一個元素 —— 捲出視窗就直接收尾（見上方 heroIO） -->
  <div ref="heroEl" class="sec1__hero" id="app-hero">
    <!-- 影片層：滿版；退場消失（gone）時淡出，露出 hero 白底。
         ⚠️ preload 是 "metadata" 而非 "auto"：這裡是 SSR 吐出的標記，auto 會在 HTML 解析階段
         就開始拉整支影片、拖慢 hydration（理由與升級時機見 script 的 promotePreload）。 -->
    <div
      class="sec1__hero-video"
      :class="{ 'is-ended': isGone }"
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

    <!-- 文字保留於 DOM 供 SEO / 螢幕閱讀器，視覺上不顯示 -->
    <h1 class="visually-hidden">{{ str.hero.title }}</h1>
    <p class="visually-hidden">{{ str.hero.subtitle }}</p>

    <!--
      skip：正片播放 3s 後「原地」淡入，進 loop 段淡出消失。
      按鈕本體（盒子、字級、雙箭頭、40% ↔ hover 100%）都在 <UBtnSkip>，
      本檔的 .sec1__hero-skip 只給版位與「現不現身」。
      刻意不用 v-if + <Transition>：常駐 DOM 只切 class，淡出期間 hover 規則已隨
      .is-visible 一起失效（不會卡在 100% 又被瞬間移除）。
      隱藏時 pointer-events: none ＋ tabindex -1 ＋ aria-hidden → 看不見就完全不可及。
    -->
    <UBtnSkip
      class="sec1__hero-skip"
      :class="{ 'is-visible': showSkip }"
      :label="str.hero.skipLabel"
      :aria-label="str.hero.skipAria"
      :tabindex="showSkip ? 0 : -1"
      :aria-hidden="!showSkip"
      @click="skip()"
    />

    <!--
      下滑看更多：僅 loop 狀態顯示（提示使用者向下滾動以觸發退場）。
      設計稿（mob 2065:120052 / pad 2065:124031 / pc 2065:139395）只有一個 22×12 的
      點陣 chevron，沒有文字也沒有那條垂直細線 —— 文案改掛 .visually-hidden：
      這個提示對讀不到圖形的使用者更重要，稿上沒畫不代表不必說。
    -->
    <div v-if="heroState === 'loop'" class="sec1__hero-scroll">
      <span class="visually-hidden">{{ str.hero.scrollHint }}</span>
      <!--
        點陣 chevron：11 顆 2×2 實心方塊排成階梯狀，與稿逐點相同。
        與 <UBtnSkip> 的雙箭頭是同一個 component「提示下滑」，那邊是轉 90° 的
        12×22（指右），這裡是原方向的 22×12（指下）—— 座標互為轉置。
        同樣沿用該檔的處理：不引外部 svg 檔、直接畫 rect，
        shape-rendering 保住像素邊緣。

        ⚠️ 畫兩顆（稿上是一顆）：這是動態的一部分，不是版面上多了一個圖示 ——
        兩顆疊在同一個位置、跑同一條路徑，只差半個週期（見 --offset 的 delay），
        於是任一瞬間一顆在行程上半段、另一顆在下半段，看起來像一前一後的雙箭頭。
        少了第二顆就補不起每循環約 0.6s 的空檔（參考範例即是如此設計）。
        靜止時（prefers-reduced-motion）兩顆完全重合 ＝ 稿上那一顆。

        v-for 而非把 <svg> 抄兩份：路徑只寫一次，兩顆的差異全在 CSS。
        （<UBtnSkip> 那邊把座標寫進同一條 path 是因為兩箭頭不需各自動畫。）
      -->
      <svg
        v-for="i in 2"
        :key="i"
        class="sec1__hero-scroll-icon"
        :class="{ 'sec1__hero-scroll-icon--offset': i === 2 }"
        viewBox="0 0 22 12"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <path
          d="M0 0h2v2H0z M2 2h2v2H2z M4 4h2v2H4z M6 6h2v2H6z M8 8h2v2H8z M10 10h2v2H10z M12 8h2v2H12z M14 6h2v2H14z M16 4h2v2H16z M18 2h2v2H18z M20 0h2v2H20z"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sec1__hero {
  position: relative;
  width: 100%;
  height: vh();
  overflow: hidden;
  background: #fff; // 影片淡出後露出的白底
}

.sec1__hero-video {
  position: absolute;
  inset: 0;
  transition: opacity 0.8s ease;

  // 影片播放完畢（gone）：淡出，露出 hero 白底
  &.is-ended {
    opacity: 0;
  }
}

// <video> 本體：滿版裁切置中。
// RWD 影片「來源」在 ~/utils/hero-video-config 依裝置切換；三支剪輯都已到位，且 pad / mob
// 是直式（1024×1364 / 720×1280，與其視窗方向相符）→ cover 置中就是設計要的裁切，
// 下面兩個斷點覆寫目前與預設同值，留著當「要按斷點微調時」的位置。
//
// ⚠️ 改 object-position 要一起改退場交棒的換算：coverAnchorToScreen 預設以 center 分配
//    裁切量（見 ~/utils/hero-core-handoff 與 Hero.vue 的 runCoreEntrance），
//    不同步就會讓 DOM core 疊到影片裡那顆的旁邊。
.sec1__hero-video-el {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;

  @include rwd-max('pc') {
    object-position: center; // pad（直式剪輯）
  }
  @include rwd-max('tablet') {
    object-position: center; // mob（直式剪輯）
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
// 尺寸寫死 22×12 ＝ 稿上圖示的框：兩顆 chevron 都絕對定位疊在這個框裡（見下方），
// 容器不會被子項的位移撐大或縮成 0 高 —— 於是上面那組底距量到的始終是同一個框。
.sec1__hero-scroll {
  position: absolute;
  left: 50%;
  bottom: calc(44px + var(--chrome-inset));
  width: 22px;
  height: 12px;
  transform: translateX(-50%);

  @include rwd-min('tablet') {
    bottom: calc(72px + var(--chrome-inset));
  }
  @include rwd-min('pc') {
    bottom: calc(44px + var(--chrome-inset));
  }
}

// 一顆 chevron 的行程與週期。兩者是綁在一起的一組數字：
//   $hero-scroll-drift 決定「跑多遠」，$hero-scroll-cycle 決定「多久跑完」，
//   而 --offset 那顆的 delay 是 -半個週期 → 兩顆的間距恆為半個行程（8px）。
// ±8px ＝ 參考範例的 ±2/3 個箭頭尺寸，換算到本圖示的高 12px；
// 換算後兩顆重疊約 4px（1/3 個身高），與參考範例的重疊比例相當 —— 那正是
// 「一前一後、後面那顆像殘影」的來源。改任一個值都會動到這個關係。
$hero-scroll-drift: 8px;
$hero-scroll-cycle: 3s;

// 稿上三個斷點都是 22×12，故不隨斷點變化；色票＝稿上的 main/light gray #898989。
//
// 漂移動態：借 CodePen「SCSS Arrow Animation」的節奏（見 hero-scroll-hint keyframes），
// 只借動態 —— 尺寸、色票、置中、底距皆維持設計稿原樣。
//
// 兩顆都絕對定位在容器的 0,0（容器已固定成 22×12）：它們要疊在同一個位置、跑同一條
// 路徑，靠 delay 錯開，而不是在版面上一上一下排開。
//
// 動畫掛在 <svg> 而非外層 .sec1__hero-scroll：外層的 transform 正在做 translateX(-50%)
// 的水平置中，transform 不能疊加（同一屬性後者整條覆蓋前者），掛上去就會把置中弄掉。
// 分兩層各管一件事最省事。
.sec1__hero-scroll-icon {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 22px;
  height: 12px;
  fill: var(--color-gray-light);
  animation: hero-scroll-hint $hero-scroll-cycle linear infinite;

  // 停用動畫後停在 keyframes 之外的原樣態：無位移、opacity 1 的實色 #898989
  // ＝ 設計稿量到的靜態外觀（此時兩顆完全重合，看起來就是稿上那一顆）。
  // 刻意不比照動畫峰值的 .7 —— 不會動的那一版，該長成稿上的樣子，
  // 而不是某一格動畫的切片。
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

// 第二顆：同一條路徑、倒推半個週期起跑（＝ 參考範例的 animation-delay: $speed/-2）。
// 負延遲代表「一掛上就已經跑到一半」，故不必等一個週期才出現。
// ⚠️ 必須排在基底規則之後：兩者選擇器權重相同，靠順序才蓋得掉 animation 簡寫
//    帶入的 animation-delay: 0s。
.sec1__hero-scroll-icon--offset {
  animation-delay: $hero-scroll-cycle * -0.5;
}

// 從上方淡入、行經設計稿的原位、再往下淡出，一循環 $hero-scroll-cycle
// （節奏與位移比例同參考範例）。
//
// 50% 這格刻意是 translateY(0)：那正是設計稿量到的位置（距底 44 / 72）。故「走到稿上
// 原位的那一刻也是最亮的一刻」，漂移只發生在淡掉的頭尾，不會讓人覺得圖示位置跑掉了。
//
// 峰值 opacity 照參考範例的 .7（＝ #898989 疊在白底上約等於 #a7a7a7），不到稿上的實色 ——
// 最亮的一刻也留一點透明，整段呼吸才不會在中央「頓」一下。
// 10% / 90% 兩格只寫 opacity，transform 交給 0% → 50% → 100% 線性內插（同參考範例）。

@keyframes hero-scroll-hint {
  0% {
    opacity: 0;
    transform: translateY(-$hero-scroll-drift);
  }

  10%,
  90% {
    opacity: 0;
  }

  50% {
    opacity: 0.7;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY($hero-scroll-drift);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sec1__hero-video,
  .sec1__hero-skip {
    transition: none; // skip 改為直接出現 / 消失（時間點不變）
  }
}
</style>
