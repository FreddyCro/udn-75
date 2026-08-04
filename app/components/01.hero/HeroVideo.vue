<script setup lang="ts">
// hero：第一屏影片區塊（含 SEO 文字、下滑提示、dev 狀態切換列）。
// 影片四階段狀態自 useHeroVideo 全域共享；「各階段秒數」與「RWD 影片來源」集中在
// ~/utils/hero-video-config，本元件只負責依設定驅動 <video>（seek / loop / 換狀態）。
import str from '@/locales/section1.json';
import { getDeviceTypeByResolution } from '@/utils/get-device';
import {
  HERO_VIDEO_POSTER,
  HERO_VIDEO_READY_TIMEOUT,
  HERO_VIDEO_SRC,
  heroVideoSegments,
  type HeroVideoDevice,
  type HeroVideoSegment,
} from '@/utils/hero-video-config';

const {
  state: heroState,
  setState,
  isGone,
  videoReady,
  heroStarted,
  currentTime,
} = useHeroVideo();

// 全站音效開關：開啟時本影片不 muted（見 composables/useAppSound）。
const { soundOn } = useAppSound();

// 資源路徑前綴同 UVid / UPic（dev/prod 為空字串）
const runtime = useRuntimeConfig();
const ASSETS_PATH = runtime.public.APP_ASSETS_PATH;

// SSR 安全：先以 'pc' 為預設（與初次 client render 一致，避免 hydration mismatch），
// 掛載後再依實際解析度校正並監聽 resize（同 UVid）。
const device = ref<HeroVideoDevice>('pc');
const videoEl = ref<HTMLVideoElement | null>(null);

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

// 狀態改變（dev 控制列 / SKIP / 自動推進）→ 對齊該段起點並續播；gone 則停住影片。
// 已落在目標段內就不 seek，所以「段落相接」的自動推進不會有跳動。
watch(heroState, (s) => {
  const v = videoEl.value;
  if (!v) return;
  if (s === 'gone') {
    v.pause();
    return;
  }
  // 不在目標段內才 seek。用 segEnd 而非 seg.end：outro 的 end 是 HERO_VIDEO_END(Infinity)，
  // 直接比會把「影片已播完」也算在段內 → play() 對已 ended 的影片會從 0 重播整支。
  const seg = segments.value[s];
  if (v.currentTime < seg.start || v.currentTime >= segEnd(v, seg)) {
    v.currentTime = seg.start;
  }
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

function onResize() {
  const next = getDeviceTypeByResolution();
  if (next === device.value) return;
  resumeAt = videoEl.value?.currentTime ?? 0; // 換來源會重新載入，記住進度
  device.value = next;
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);

  // ⚠️ <video> 是 SSR 就吐出來的（帶 src + preload="auto"），瀏覽器在 HTML 解析階段就開始載入，
  // canplay 很可能在 hydration 掛上 @canplay 之前就已經觸發 → 事件永遠等不到，
  // 載入層會一路卡在 99% 直到 HERO_VIDEO_READY_TIMEOUT 才放行。
  // 故掛載時先補查 readyState（HAVE_FUTURE_DATA 以上＝已可播放），把漏掉的事件補回來。
  const v = videoEl.value;
  if (v && v.readyState >= 3) markReady();
  else readyTimer = setTimeout(markReady, HERO_VIDEO_READY_TIMEOUT); // 遲遲無法播放時的保險

  if (heroStarted.value) void play(); // HMR / 重新掛載時可能已按過 start
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  if (readyTimer) clearTimeout(readyTimer);
});
</script>

<template>
  <!-- id 供 AppHeader 以 IntersectionObserver 監看 hero（捲離後才顯示 header） -->
  <div class="sec1__hero" id="app-hero">
    <!-- 影片層：滿版；退場消失（gone）時淡出，露出 hero 白底 -->
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
        preload="auto"
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

    <!-- 下滑看更多：僅 loop 狀態顯示（提示使用者向下滾動以觸發退場） -->
    <div v-if="heroState === 'loop'" class="sec1__hero-scroll">
      <span class="sec1__hero-scroll-text">{{ str.hero.scrollHint }}</span>
      <span class="sec1__hero-scroll-line" aria-hidden="true" />
    </div>

    <!-- 影片狀態切換列（dev 用：狀態切換 + SKIP + 秒數讀數）；定位在 hero 內、水平置中 -->
    <DevHeroVideoControls dev />
  </div>
</template>

<style lang="scss" scoped>
// figma design tokens（與 AppHeader 一致）
$gray: #686868;
$light-gray: #898989;

.sec1__hero {
  position: relative;
  width: 100%;
  height: 100vh;
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

// 下滑看更多：文字置中、下方一條細線垂直延伸至 hero 底緣
.sec1__hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sec1__hero-scroll-text {
  color: $gray;
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
  background: $light-gray;
}

@media (prefers-reduced-motion: reduce) {
  .sec1__hero-video {
    transition: none;
  }
}
</style>
