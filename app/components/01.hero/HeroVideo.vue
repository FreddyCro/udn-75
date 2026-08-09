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
  } catch {
    // 自動播放被封鎖（muted 影片極少發生）：直接進 gone。
    // 否則 main / loop 的捲動鎖會把使用者永久鎖在第一屏。
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
      // 退場段一路播到影片結束 → gone（影片淡出、orange core 淡入）
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
// 已落在目標段內就不 seek，所以「段落相接」的自動推進不會有跳動。
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
  const { intent, accum } = heroGestureStep(
    gesture,
    {
      delta,
      now: performance.now(),
      inLoop: heroState.value === 'loop',
      isGone: heroState.value === 'gone',
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
      skip：正片播放 3s 後「原地」淡入（預設 40%、hover / 按下 100%），進 loop 段淡出消失。
      設計稿 1957:54965。刻意不用 v-if + <Transition>：常駐 DOM 只切 class，淡出期間
      hover 規則已隨 .is-visible 一起失效（不會卡在 100% 又被瞬間移除）。
      隱藏時 pointer-events: none ＋ tabindex -1 ＋ aria-hidden → 看不見就完全不可及。
    -->
    <button
      class="sec1__hero-skip"
      :class="{ 'is-visible': showSkip }"
      type="button"
      :tabindex="showSkip ? 0 : -1"
      :aria-hidden="!showSkip"
      :aria-label="str.hero.skipAria"
      @click="skip()"
    >
      <span class="sec1__hero-skip-text">{{ str.hero.skipLabel }}</span>
      <!--
        雙箭頭（設計稿 instance 「提示下滑」×2，各 12×22）：原稿是 11 顆 2×2 實心方塊
        （匯出的 vector 就是 2×2 方塊）排成階梯狀 chevron —— 這裡照 inset 換算出的整數
        座標重畫成同一組 2×2 rect，幾何與原稿逐點相同。shape-rendering 保住像素邊緣。
      -->
      <svg
        class="sec1__hero-skip-icon"
        viewBox="0 0 24 22"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <path
          id="sec1-hero-skip-chevron"
          d="M0 0h2v2H0z M2 2h2v2H2z M4 4h2v2H4z M6 6h2v2H6z M8 8h2v2H8z M10 10h2v2H10z M8 12h2v2H8z M6 14h2v2H6z M4 16h2v2H4z M2 18h2v2H2z M0 20h2v2H0z"
        />
        <use href="#sec1-hero-skip-chevron" x="12" />
      </svg>
    </button>

    <!-- 下滑看更多：僅 loop 狀態顯示（提示使用者向下滾動以觸發退場） -->
    <div v-if="heroState === 'loop'" class="sec1__hero-scroll">
      <span class="sec1__hero-scroll-text">{{ str.hero.scrollHint }}</span>
      <span class="sec1__hero-scroll-line" aria-hidden="true" />
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
// RWD 影片「來源」在 ~/utils/hero-video-config 依裝置切換；此處預留各斷點的裁切位置
// （pad / mob 剪輯到位後，再依設計稿調整 object-position / 尺寸）。
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
    object-position: center; // TODO: pad 稿到位後調整
  }
  @include rwd-max('tablet') {
    object-position: center; // TODO: mob 稿到位後調整
  }
}

// skip 按鈕：設計稿 1957:54965（100×48 / padding 11 10 9 / opacity 40%，右下角 right 34、bottom 31）。
//
// ⚠️ 尺寸換算：該稿畫在 1920×1080 的「影片稿」上，而 hero 其餘 UI（start cube 95、載入層方塊
// 83.333）都是 1280×720 稿 —— 兩者剛好 1.5 倍。影片以 object-fit: cover 鋪滿視窗，1920 稿上的
// 20px 在 1280 寬的視窗只佔 13.33px，故此處一律 ÷1.5 落回 1280 稿，才與影片內容、其餘 UI 同比例。
// 若要改成照 1920 稿的絕對字級，把下面的 13.33px / 8px / 16px 乘回 1.5 即可。
// ⚠️ bottom 要加 --chrome-inset：本容器高 vh() ＝ large viewport，手機剛進站時
// 網址列／底部工具列是展開的，容器底部那 60–115px 在可視範圍之外。開場期間頁面
// 又鎖著、工具列永遠不會收合 → 不補這一段，這顆按鈕在手機上全程看不到。
// （見 ~/utils/viewport-height 的 chromeInset()；下方「下滑看更多」同理。）
.sec1__hero-skip {
  position: absolute;
  right: 22.67px; // 34 ÷ 1.5
  bottom: calc(20.67px + var(--chrome-inset)); // 31 ÷ 1.5
  z-index: 2; // 疊在影片層之上
  display: flex;
  align-items: center;
  // 尺寸／padding 照設計稿的固定外框（100×48、padding 11 10 9）÷1.5 —— 命中區與稿一致，
  // 內容靠左排（同稿上 items-start），右側留白也就跟著稿走。
  width: 66.67px;
  height: 32px;
  gap: 8px; // 12 ÷ 1.5
  padding: 7.33px 6.67px 6px;
  color: var(--color-gray);
  background: none;
  border: 0;
  // 未到 3s（或已離開正片）：全透明且完全不可點
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;

  // 命中區外擴到 44×82.67（觸控最小建議尺寸）—— 視覺尺寸維持設計稿的 32 高。
  // 同 HeroStart 音效鈕的作法：用 ::after 外擴，不必為了好按而放大按鈕本體。
  &::after {
    content: '';
    position: absolute;
    inset: -6px -8px;
  }

  // 淡入後的預設態＝設計稿的 40%；hover / focus / 按下 → 100%
  &.is-visible {
    opacity: 0.4;
    pointer-events: auto;
    cursor: pointer;

    &:hover,
    &:focus-visible,
    &:active {
      opacity: 1;
    }
  }
}

// 設計稿 1864:52374：Noto Sans TC Regular / 20px / line-height 20（÷1.5）。
// padding-bottom 承自稿上文字外框的 pb 4 —— 讓文字視覺中線與雙箭頭對齊。
.sec1__hero-skip-text {
  padding-bottom: 2.67px; // 4 ÷ 1.5
  font-weight: 400;
  font-size: 13.33px; // 20 ÷ 1.5
  line-height: 1;
  white-space: nowrap;
}

// 雙箭頭：稿上 24×22（兩個 12×22 並排，無間距）÷1.5；fill 跟著按鈕的 color 走
.sec1__hero-skip-icon {
  display: block;
  flex: none;
  width: 16px; // 24 ÷ 1.5
  height: 14.67px; // 22 ÷ 1.5
  fill: currentColor;
}

// 下滑看更多：文字置中、下方一條細線垂直延伸至「看得到的」hero 底緣
// （bottom 吃 --chrome-inset 的理由同上方 skip）
.sec1__hero-scroll {
  position: absolute;
  left: 50%;
  bottom: var(--chrome-inset);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sec1__hero-scroll-text {
  color: var(--color-gray);
  font-weight: 300; // Noto Sans TC Light
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1.2px;
  white-space: nowrap;
}

.sec1__hero-scroll-line {
  width: 1px;
  height: 30px;
  margin-top: 8px;
  background: var(--color-gray-light);
}

@media (prefers-reduced-motion: reduce) {
  .sec1__hero-video,
  .sec1__hero-skip {
    transition: none; // skip 改為直接出現 / 消失（時間點不變）
  }
}
</style>
