<script lang="ts" setup>
/**
 * SubpageIntroMedia — 子頁內文的 16:9 媒體區塊。
 *
 * 二選一模式（傳 video 就走影片，否則走圖片輪播）：
 * 1. 圖片輪播：多張照片自動輪播，雙層 crossfade（舊圖墊底不透明、新圖淡入覆蓋，
 *    全程不露底色），每張各自帶 Ken Burns 位移；圖說隨張數切換。
 * 2. 影片：單支 UVid 填滿同一個 16:9 框，共用同一套圖說遮罩。
 *
 * 兩種模式共用同一組播放閘（見 isInPlay）：IntersectionObserver 判「在視窗內」、
 * 外部 active prop 判「輪到它演」。沒過閘就不跑輪播計時器、不跑 Ken Burns、影片也不播
 * —— 免得使用者還沒捲到，第一張的位移就已經演完、影片也跑掉一段。
 *
 * 圖說固定疊在框底的漸層遮罩上（設計稿：白字 15/24、寬 636、距底 26），
 * 輪播時遮罩不動，只有文字先淡出舊句、再淡入新句（避免兩句字疊在一起）。
 *
 * 使用範例：
 *   <SubpageIntroMedia
 *     :images="[
 *       { src: '/img/news/udn75_pic29_01', alt: '白板討論', caption: '……' },
 *       { src: '/img/news/udn75_pic29_02', alt: '平板畫面', caption: '……' },
 *     ]"
 *   />
 *
 *   <SubpageIntroMedia
 *     :video="{
 *       src: { mob: '/img/news/udn75_video01', pad: '/img/news/udn75_video01', pc: '/img/news/udn75_video01' },
 *       caption: '……',
 *     }"
 *   />
 */
/** Ken Burns 位移種類；未指定時依張數循環套用（見 DEFAULT_EFFECTS） */
export type IntroMediaEffect = 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'none';

/** UPic 的檔名規則。元件層設一組共用值，個別照片命名不同時可逐張覆寫 */
export interface IntroMediaPicOptions {
  /** 檔名是否帶 _pc/_pad/_mob 後綴 */
  usePrefix?: boolean;
  srcset?: Array<'mob' | 'pad' | 'pc' | 'pcpad'>;
  ext?: string;
  /** 是否有 @2x 檔；沒有卻設 true 會讓高解析裝置抓到不存在的檔 */
  use2x?: boolean;
  webp?: boolean;
}

export interface IntroMediaImage extends IntroMediaPicOptions {
  /** 圖片路徑（不含副檔名與裝置後綴），交給 UPic 前綴 APP_ASSETS_PATH */
  src: string;
  alt?: string;
  /** 該張的圖說；整組都沒有圖說時，底部漸層遮罩也不會出現 */
  caption?: string;
  effect?: IntroMediaEffect;
}

export interface IntroMediaVideo {
  /** 三個裝置尺寸的影片路徑（不含副檔名），同一支就三個 key 給同一個值 */
  src: { mob: string; pad: string; pc: string };
  /**
   * 首幀 poster（不含副檔名，UVid 會補 .jpg）。**不要省略。**
   *
   * 沒有 poster 時 <video> 在解出第一格畫面之前什麼都不畫 —— 露出的是
   * `.intro-media__viewport` 的黑底。這一拍是滿屏的，等於整個畫面是純黑，而且
   * preload="metadata" 讓抓資料延到「輪到它演」才開始，那段等待完全落在使用者眼前
   * （dev 環境 readyState 0→4 約 3 秒，行動網路更久）。萬一影片整支載入失敗，
   * 有 poster 才會優雅降級成一張靜圖，而不是一片黑。
   *
   * 命名與存放沿用 GlitchImage 那組作品影片的慣例：
   *   影片   public/img/<section>/<name>.mp4
   *   poster public/img/<section>/poster/<name>_preview.jpg
   * 三個裝置各一張 —— 三支剪輯的畫面比例不同（mob 720×1280、pad 1024×1364、
   * pc 1920×1080），共用一張會裁錯。
   *
   * ⚠️ 一律抽**第 0 秒**：poster 與影片的第一格不同的話，開始播的瞬間會跳一下。
   *    換剪輯時要一起重做，否則 poster 會是上一版的畫面（同 hero-video-config.ts 的提醒）。
   *    有 ffmpeg 的環境：
   *      ffmpeg -v error -y -i <clip>.mp4 -frames:v 1 -q:v 6 poster/<name>_preview.jpg
   */
  poster?: { mob: string; pad: string; pc: string };
  caption?: string;
  ariaLabel?: string;
}

const props = withDefaults(
  defineProps<{
    /** 輪播來源（影片模式時忽略） */
    images?: IntroMediaImage[];
    /** 影片來源；有值即切換為影片模式 */
    video?: IntroMediaVideo;
    /**
     * 填滿父層而非固定 16:9。用於「舞台滿屏」的場合（見 Subpage 的第三拍）：
     * 框改吃父層高度、圖仍 cover，圖說才會貼在視窗底而不是被裁在框外。
     */
    fill?: boolean;
    /**
     * 外部開關：false 時停播並倒回第一張。
     * 用於「元件在畫面內、但還輪不到它演」的場合（例如疊在舞台裡、靠透明度藏著），
     * 這種情況 IntersectionObserver 看不出來（它不管 opacity／visibility）。
     */
    active?: boolean;
    /** 每張停留時間（ms），不含轉場 */
    interval?: number;
    /** 雙層 crossfade 時間（ms） */
    fade?: number;
    /**
     * 整組共用的 UPic 檔名規則，逐張可覆寫（見 IntroMediaImage）。
     * 預設對應本區塊素材的實況：三個裝置各一張（_pc/_pad/_mob）、沒有 @2x。
     */
    pic?: IntroMediaPicOptions;
  }>(),
  {
    images: () => [],
    fill: false,
    active: true,
    interval: 2500,
    fade: 750,
    pic: () => ({
      usePrefix: true,
      srcset: ['pc', 'pad', 'mob'],
      ext: 'jpg',
      use2x: false,
      webp: true,
    }),
  },
);

/** 未指定 effect 時的循環序列（對稿：放大 → 左移 → 放大 → 縮小） */
const DEFAULT_EFFECTS: IntroMediaEffect[] = ['zoom-in', 'pan-left', 'zoom-in', 'zoom-out'];

const isVideo = computed(() => !!props.video);

/** 逐張把「effect 循環值」與「檔名規則（張自己的優先，其次整組共用）」算好 */
const slides = computed(() =>
  props.images.map((img, i) => ({
    src: img.src,
    alt: img.alt ?? '',
    caption: img.caption ?? '',
    effect: img.effect ?? DEFAULT_EFFECTS[i % DEFAULT_EFFECTS.length]!,
    pic: {
      usePrefix: img.usePrefix ?? props.pic.usePrefix ?? true,
      srcset: img.srcset ?? props.pic.srcset ?? ['pc', 'pad', 'mob'],
      ext: img.ext ?? props.pic.ext ?? 'jpg',
      use2x: img.use2x ?? props.pic.use2x ?? false,
      webp: img.webp ?? props.pic.webp ?? true,
    },
  })),
);

/** 目前這張（最上層淡入）與上一張（墊底維持不透明，轉場結束才退場） */
const activeIndex = ref(0);
const prevIndex = ref(-1);

/** 影片模式的圖說＝單句；輪播模式逐張比對，靠 class 控制先淡出再淡入 */
const captions = computed(() =>
  isVideo.value ? [props.video?.caption ?? ''] : slides.value.map((s) => s.caption),
);

/** 一句圖說都沒有就整層不渲染 —— 文案還沒到位時不要留一條空的黑漸層 */
const hasCaption = computed(() => captions.value.some((t) => !!t));

/**
 * Ken Burns 動畫需涵蓋「停留 + 下一張淡入」的全長，圖才不會在轉場中途停住；
 * 文字的淡出/淡入各佔 crossfade 的一半，錯開才不會兩句疊字。
 */
const timingVars = computed(() => ({
  '--intro-media-fade': `${props.fade}ms`,
  '--intro-media-anim': `${props.interval + props.fade}ms`,
  '--intro-media-caption-fade': `${props.fade / 2}ms`,
}));

const rootRef = ref<HTMLElement | null>(null);
/** 是否在視窗內（沒有 IntersectionObserver 的環境一律視為在內） */
const inView = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;

/**
 * 播放閘：在視窗內（IO）且輪到它演（外部 active）。圖片與影片共吃這一個判斷 ——
 * 影片交給 UVid 的反應式 autoplay，Ken Burns 交給 .intro-media--playing。
 */
const isInPlay = computed(() => inView.value && props.active);

/** 輪播計時器另外要求「輪播模式 + 兩張以上」 */
const shouldPlay = computed(() => !isVideo.value && slides.value.length > 1 && isInPlay.value);

function next() {
  prevIndex.value = activeIndex.value;
  activeIndex.value = (activeIndex.value + 1) % slides.value.length;
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

watch(shouldPlay, (play) => {
  stop();
  if (play) {
    timer = setInterval(next, props.interval);
    return;
  }
  // 停播即倒回第一張：下次輪到它演時一定從頭開始，而不是接在上次停住的地方
  activeIndex.value = 0;
  prevIndex.value = -1;
});

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    inView.value = true;
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => (inView.value = !!entry?.isIntersecting),
    { threshold: 0.1 },
  );
  if (rootRef.value) observer.observe(rootRef.value);
});

onBeforeUnmount(() => {
  stop();
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <figure
    ref="rootRef"
    class="intro-media"
    :class="{ 'intro-media--fill': fill, 'intro-media--playing': isInPlay }"
    :style="timingVars"
  >
    <div class="intro-media__viewport">
      <!-- 影片模式：單支影片填滿 16:9 框 -->
      <UVid
        v-if="isVideo && video"
        :src="video.src"
        :poster="video.poster"
        classname="intro-media__video"
        :aria-label="video.ariaLabel"
        :autoplay="isInPlay"
        preload="metadata"
      />

      <!-- 輪播模式：所有 slide 疊在同層，用 class 決定誰在最上層淡入、誰墊底 -->
      <template v-else>
        <div
          v-for="(slide, i) in slides"
          :key="`${slide.src}-${i}`"
          class="intro-media__slide"
          :class="{
            'intro-media__slide--active': i === activeIndex,
            'intro-media__slide--prev': i === prevIndex && i !== activeIndex,
          }"
        >
          <UPic
            :src="slide.src"
            :alt="slide.alt"
            :classname="`intro-media__img intro-media__img--${slide.effect}`"
            :use-prefix="slide.pic.usePrefix"
            :srcset="slide.pic.srcset"
            :ext="slide.pic.ext"
            :use2x="slide.pic.use2x"
            :webp="slide.pic.webp"
            :loading="i === 0 ? 'eager' : 'lazy'"
          />
        </div>
      </template>

      <!-- 圖說：遮罩固定不動，只有文字換句 -->
      <figcaption v-if="hasCaption" class="intro-media__caption">
        <p
          v-for="(text, i) in captions"
          :key="i"
          class="intro-media__caption-text"
          :class="{ 'intro-media__caption-text--active': isVideo || i === activeIndex }"
          :aria-hidden="!isVideo && i !== activeIndex"
        >
          {{ text }}
        </p>
      </figcaption>
    </div>
  </figure>
</template>

<style lang="scss" scoped>
.intro-media {
  margin: 0;
  width: 100%;
  // 滿屏模式：高度交給父層決定，框不再自己算 16:9（圖照樣 cover，只是裁切比例跟著視窗）
  &--fill {
    height: 100%;

    // z-index: auto ＋ static 都不會進疊層比較，但本層的 `--fill` 在 ≥768 要抬過 header，
    // 故基底就給 relative（z-index 為 auto 時它**不**建立疊層脈絡，flow 版型不受影響）。
    position: relative;

    // ── 抬過 header：**只給 ≥768** ────────────────────────────────────────────
    // 疊在 AppHeader（z-index 1000）之上 —— pin 版型的滿屏媒體要蓋掉常駐頂條。
    // 1100 沿用本專案的疊層約定：> header(1000)，仍低於 HeroStart(1500) 與 HeroLoader(2000)。
    // 抬過 header 就要配 pointer-events: none，否則這一屏蓋住的頂條全部點不到
    //（理由與 Subpage.vue 的 .subpage__stage--media 相同，數字兩處要一起改）。
    // 本元件沒有可互動元素，整層放行不犧牲功能；捲動不受 pointer-events 影響。
    //
    // ⚠️ **為什麼一定要關在 tablet 以上**：<768 的手機版走 flow 版型（見 Subpage.vue 的
    //    shouldRunStage），那時舞台是文件流、一路到 body 都沒有疊層脈絡把 1100 關住 ⇒
    //    這一屏會**跟著捲動經過** header（不像 pin 那樣停在原地），症狀是「照片捲過頂條時
    //    頂條與底部錨點列消失約一屏、之後再回來」。手機版不要這個行為（設計確認），
    //    所以整組只給 ≥768。
    // ⚠️ 只給 --fill，**不給常態的 16:9 內文區塊** —— 內文那種會隨頁面捲到 header 底下，
    //    抬上去就變成內文圖蓋住頂條。要蓋掉 header 的只有 pin 版型的「滿屏那一拍」。
    // ⚠️ pin 版型下祖先其實會把它關住：`.subpage__stage--pinned` 被 ScrollTrigger 設成
    //    position: fixed ⇒ 自成疊層脈絡，而它自己 z-index: auto，裡面再高也出不去。
    //    那條路徑改由 `.subpage__stage--media` 抬整層，見 Subpage.vue。
    //    這裡的 1100 因此只在 ≥768 的降級（no-JS／reduced-motion，舞台仍是文件流）生效。
    @include rwd-min('tablet') {
      z-index: 1100;
      pointer-events: none;
    }

    .intro-media__viewport {
      height: 100%;
      aspect-ratio: auto;
    }
  }
}

// 16:9 舞台。黑底只是保險：雙層 crossfade 全程都有一張不透明的圖墊著，正常不會露出。
.intro-media__viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

// 三種狀態：閒置(z1, 透明) / 墊底(z2, 不透明) / 淡入中(z3)。
// 舊圖維持不透明留在下層，新圖從 0 蓋上來，交替瞬間才不會閃底色。
.intro-media__slide {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  transition: opacity var(--intro-media-fade) cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;

  &--prev {
    z-index: 2;
    opacity: 1;
  }

  &--active {
    z-index: 3;
    opacity: 1;
  }
}

// UPic 內層 <img> 預設 height:auto，且外層 <picture> 是 inline 撐不出高度 ——
// 直接讓 <img> 絕對定位填滿 slide，尺寸就與 <picture> 無關。
// 動畫掛在 active/prev 兩態，圖才會在「停留 + 被下一張蓋掉」的全程持續位移。
:deep(.intro-media__img) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

// Ken Burns 上播放閘：animation 是 forwards 的一次性動畫，不擋的話第一張在 mount 當下
// 就把 interval+fade 演完並停在終點 —— 使用者捲到時圖已經不動了。
// 出閘會抽掉 animation 讓 transform 彈回原點，那一刻媒體已淡光（見 Subpage 的 mediaActive）。
.intro-media--playing .intro-media__slide--active,
.intro-media--playing .intro-media__slide--prev {
  :deep(.intro-media__img--zoom-in) {
    animation: intro-media-zoom-in var(--intro-media-anim) cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
  :deep(.intro-media__img--zoom-out) {
    animation: intro-media-zoom-out var(--intro-media-anim) cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
  :deep(.intro-media__img--pan-left) {
    animation: intro-media-pan-left var(--intro-media-anim) cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
  :deep(.intro-media__img--pan-right) {
    animation: intro-media-pan-right var(--intro-media-anim) cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
}

:deep(.intro-media__video) {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 固定圖說遮罩：整寬、由下往上的黑色漸層（對稿 146/720 ≈ 20.3% 高）
.intro-media__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  // 所有句子疊在同一個 grid 格：容器高度取最長的一句，換句時遮罩不會被撐破或跳動
  display: grid;
  grid-template-columns: minmax(0, 636px);
  justify-content: center;
  align-items: end;
  min-height: 20.3%;
  padding: 40px 20px 16px;
  background: linear-gradient(
    to top,
    rgb(0 0 0 / 85%) 0%,
    rgb(0 0 0 / 45%) 60%,
    rgb(0 0 0 / 0%) 100%
  );
  pointer-events: none;

  @include rwd-min('tablet') {
    padding: 48px 20px 26px;
  }
}

// 每句都放在同一個 grid 格、靠下對齊。
// 淡出 0.375s → 淡入 0.375s（delay 讓兩句不同框），總長對齊圖片的 crossfade。
.intro-media__caption-text {
  grid-area: 1 / 1;
  margin: 0;
  align-self: end;
  color: #fff;
  font-size: 13px;
  line-height: 22px;
  font-weight: 300;
  text-align: justify;
  word-break: break-word;
  opacity: 0;
  transition: opacity var(--intro-media-caption-fade) ease;

  @include rwd-min('tablet') {
    font-size: var(--text-caption);
    line-height: var(--text-caption--line-height);
  }

  &--active {
    opacity: 1;
    transition: opacity var(--intro-media-caption-fade) ease var(--intro-media-caption-fade);
  }
}

@keyframes intro-media-zoom-in {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.04);
  }
}

@keyframes intro-media-zoom-out {
  0% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes intro-media-pan-left {
  0% {
    transform: scale(1.04) translateX(3%);
  }
  100% {
    transform: scale(1.04) translateX(-3%);
  }
}

@keyframes intro-media-pan-right {
  0% {
    transform: scale(1.04) translateX(-3%);
  }
  100% {
    transform: scale(1.04) translateX(3%);
  }
}

// 減動偏好：拿掉 Ken Burns 位移，crossfade 收短；輪播本身保留，
// 否則沒有控制項的情況下只會停在第一張、其餘照片與圖說永遠看不到。
@media (prefers-reduced-motion: reduce) {
  .intro-media__slide {
    transition-duration: 0.2s;
  }

  .intro-media__slide--active,
  .intro-media__slide--prev {
    :deep(.intro-media__img) {
      animation: none !important;
    }
  }
}
</style>
