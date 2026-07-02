<script setup lang="ts">
// Section 1：hero / intro / date
import str from '@/locales/section1.json';
import { useHeroVideo } from '~/composables/useHeroVideo';

// LoadingHero 蓋在最上層，等 hero 影片可播放後才收尾並淡出移除。
const loaderDone = ref(false);

// 影片是否已可播放，作為 LoadingHero 的收尾條件。
// 目前 hero 影片尚未提供，暫用 CSS 假影片，onMounted 後即視為可播放。
// TODO: 換成真實 <video> 後，移除下方 onMounted 設值，改綁定 <video> 的
//       @canplaythrough="videoReady = true"（並視需要 preload）。
const videoReady = ref(false);

// hero 影片四階段狀態改為全域共享（見 composables/useHeroVideo）：
//   main 主要內容 / loop 循環段 / outro 退場段 / gone 退場消失（白底 + core）
// main / loop 期間鎖住頁面捲動（body overflow hidden）；outro 起解鎖。
// 狀態切換 UI 已抽到 <HeroVideoControls>（dev 用）；此處只讀狀態驅動畫面。
const { state: heroState, isGone, shouldLockScroll } = useHeroVideo();

// main / loop 期間鎖住 body 捲動；其餘（outro / gone）解鎖。
function applyScrollLock() {
  if (shouldLockScroll.value) {
    // 上鎖前先回頂端：否則重整後瀏覽器把位置還原到內容區、又處於 main/loop，
    // 會被 overflow:hidden 永久鎖死在中途。
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

onMounted(() => {
  videoReady.value = true;
  // hero 影片體驗一律從頂端開始：停用瀏覽器捲動位置還原，
  // 避免重整後還原到內容區、卻因 main/loop 狀態把 body 鎖死在中途。
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
});

// LoadingHero 淡出移除後才套用捲動鎖。用 nextTick 延到 LoadingHero 卸載
// （其 onBeforeUnmount 會把 body overflow 還原為 ''）之後，避免上的鎖被覆蓋。
function onLoaderGone() {
  nextTick(applyScrollLock);
}

watch(heroState, applyScrollLock);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <section class="sec1">
    <Transition name="loader-fade" @after-leave="onLoaderGone">
      <LoadingHero
        v-if="!loaderDone"
        :duration="2"
        :ready="videoReady"
        @done="loaderDone = true"
      />
    </Transition>

    <!-- hero -->
    <div class="sec1__hero" id="app-hero">
      <!-- video placeholder（影片尚未提供，暫用 CSS 動畫模擬動態影像）；
           退場消失（gone）時淡出，露出 hero 白底 -->
      <div
        class="sec1__hero-video w-full h-screen flex justify-center items-center flex-col"
        :class="{ 'is-ended': isGone }"
        aria-hidden="true"
      >
        <span>(video：{{ heroState }})</span>
      </div>

      <!-- 文字保留於 DOM 供 SEO / 螢幕閱讀器，視覺上不顯示 -->
      <h1 class="visually-hidden">{{ str.hero.title }}</h1>
      <p class="visually-hidden">{{ str.hero.subtitle }}</p>

      <!-- 下滑看更多：僅 loop 狀態顯示（提示使用者向下滾動以觸發退場） -->
      <div v-if="heroState === 'loop'" class="sec1__hero-scroll">
        <span class="sec1__hero-scroll-text">{{ str.hero.scrollHint }}</span>
        <span class="sec1__hero-scroll-line" aria-hidden="true" />
      </div>

      <!-- 影片狀態切換列（dev 用：狀態切換 + SKIP）；定位在 hero 內、水平置中 -->
      <HeroVideoControls dev />
    </div>

    <!--
      orange core：影片結束後於第一屏（影片區塊）正中央淡入 —— 這是 core 的起點。
      設計上之後會沿一條曲線 path「貫穿全場」直到 date 區（移動本身尚未實作）。
    -->
    <span
      class="sec1__core"
      :class="{ 'is-visible': isGone }"
      aria-hidden="true"
    />

    <!--
      桌機版 core 的移動路徑（temp/hero-path.svg）。目前僅靜態疊放對位，尚未驅動 core。
      起點 (viewBox x≈61,y≈0) 錨定在 core 起點；依設計稿約 1:1 比例（485 單位 ≈ 1280 稿 485px）。
    -->
    <svg
      class="sec1__core-path"
      viewBox="0 0 485 1075"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M62.4658 1.5V0H59.4658V1.5H60.9658H62.4658ZM60.9658 177.615H59.4658V182.083L62.162 178.52L60.9658 177.615ZM482.626 667.36L481.511 668.364L484.675 671.878L484.116 667.183L482.626 667.36ZM161.02 751.463L162.371 752.114L162.388 752.078L162.404 752.041L161.02 751.463ZM4.54417 1074C4.81783 1074.78 5.67355 1075.19 6.45547 1074.92L19.1976 1070.46C19.9795 1070.18 20.3916 1069.33 20.1179 1068.54C19.8442 1067.76 18.9885 1067.35 18.2066 1067.62L6.88025 1071.59L2.91618 1060.26C2.64252 1059.48 1.7868 1059.07 1.00488 1059.34C0.222958 1059.62 -0.189068 1060.47 0.0845933 1061.25L4.54417 1074ZM113.46 850.238L114.811 850.889V850.889L113.46 850.238ZM60.9658 1.5H59.4658V177.615H60.9658H62.4658V1.5H60.9658ZM60.9658 177.615C62.162 178.52 62.1619 178.52 62.1623 178.519C62.1628 178.518 62.1635 178.518 62.1647 178.516C62.1671 178.513 62.1709 178.508 62.1761 178.501C62.1866 178.487 62.2029 178.466 62.225 178.437C62.269 178.38 62.3361 178.293 62.4259 178.178C62.6056 177.948 62.8762 177.604 63.2358 177.158C63.955 176.266 65.0299 174.962 66.4444 173.327C69.2736 170.056 73.4598 165.461 78.8739 160.182C89.7066 149.62 105.431 136.344 125.016 125.453C164.138 103.699 218.62 91.4648 280.487 129.437L281.272 128.158L282.056 126.88C219.039 88.2015 163.368 100.695 123.558 122.832C103.677 133.887 87.7411 147.346 76.7796 158.034C71.2966 163.38 67.0523 168.038 64.1754 171.364C62.7368 173.027 61.6396 174.358 60.9001 175.276C60.5303 175.734 60.2498 176.09 60.0608 176.332C59.9662 176.453 59.8946 176.546 59.846 176.61C59.8217 176.641 59.8031 176.665 59.7904 176.682C59.784 176.69 59.7791 176.697 59.7757 176.701C59.7739 176.704 59.7724 176.706 59.7716 176.707C59.7704 176.708 59.7697 176.709 60.9658 177.615ZM281.272 128.158L280.487 129.437C311.397 148.408 338.243 181.404 361.421 222.896C384.589 264.37 404.026 314.213 420.177 366.728C452.479 471.758 471.583 587.298 481.137 667.538L482.626 667.36L484.116 667.183C474.55 586.846 455.419 471.111 423.045 365.846C406.858 313.214 387.347 263.155 364.04 221.433C340.744 179.729 313.589 146.233 282.056 126.88L281.272 128.158ZM482.626 667.36C483.741 666.357 483.74 666.355 483.738 666.353C483.736 666.351 483.733 666.348 483.73 666.345C483.724 666.337 483.714 666.327 483.701 666.313C483.676 666.285 483.639 666.245 483.591 666.191C483.493 666.085 483.349 665.928 483.159 665.724C482.779 665.316 482.216 664.718 481.478 663.952C480.001 662.42 477.824 660.218 475.01 657.526C469.383 652.141 461.207 644.792 451.002 636.92C430.607 621.189 402.028 603.31 369.425 594.911C336.781 586.501 300.084 587.596 263.62 609.862C227.199 632.102 191.19 675.353 159.636 750.885L161.02 751.463L162.404 752.041C193.82 676.841 229.496 634.214 265.183 612.423C300.828 590.657 336.661 589.568 368.676 597.816C400.732 606.074 428.941 623.693 449.169 639.296C459.276 647.091 467.37 654.368 472.936 659.693C475.718 662.355 477.867 664.529 479.318 666.034C480.044 666.786 480.595 667.372 480.963 667.768C481.147 667.966 481.285 668.116 481.377 668.216C481.423 668.267 481.457 668.304 481.48 668.329C481.491 668.341 481.499 668.35 481.504 668.356C481.507 668.359 481.509 668.361 481.51 668.363C481.511 668.364 481.511 668.364 482.626 667.36ZM161.02 751.463L159.668 750.812L112.108 849.587L113.46 850.238L114.811 850.889L162.371 752.114L161.02 751.463ZM113.46 850.238L112.108 849.587L4.60847 1072.85L5.95996 1073.5L7.31146 1074.15L114.811 850.889L113.46 850.238Z"
        fill="#898989"
      />
    </svg>

    <!-- intro → date：orange core 貫穿的內容場景（core 移動路線尚未實作） -->
    <div class="sec1__scene">
      <!-- intro 引言：置中窄欄，往下滑才進入視窗 -->
      <div class="sec1__intro">
        <p class="sec1__intro-body">{{ str.intro.body }}</p>
      </div>

      <!-- date 論壇資訊 -->
      <div class="sec1__date">
        <h2 class="sec1__date-title">{{ str.date.title }}</h2>
        <p class="sec1__date-desc">{{ str.date.desc }}</p>

        <div class="sec1__date-info">
          <!-- 大型日期：階梯狀排列 2026 / 09 / 16 -->
          <p class="sec1__date-when">
            <span class="visually-hidden">{{ str.date.dateLabel }}：</span>
            <span class="sec1__date-num">{{ str.date.year }}</span>
            <span class="sec1__date-num sec1__date-num--m">{{ str.date.month }}</span>
            <span class="sec1__date-num sec1__date-num--d">{{ str.date.day }}</span>
          </p>

          <!-- 地點與時間 -->
          <p class="sec1__date-where">
            <span class="visually-hidden">{{ str.date.locationLabel }}：</span>
            <span class="sec1__date-venue">{{ str.date.venue }}</span>
            <span class="sec1__date-time">{{ str.date.time }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// figma design tokens（與 AppHeader 一致）
$orange: #ff7f00;
$gray: #686868;
$light-gray: #898989;

.sec1 {
  position: relative;

  &__hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #fff; // 影片淡出後露出的白底
  }

  // 假影片：多層漸層 + 緩慢平移／色相位移，模擬動態影像；待真影片到位後移除。
  &__hero-video {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        120% 120% at 20% 25%,
        rgba(68, 0, 255, 0.55),
        transparent 60%
      ),
      radial-gradient(
        120% 120% at 82% 30%,
        rgba(159, 214, 255, 0.7),
        transparent 55%
      ),
      radial-gradient(
        140% 140% at 50% 88%,
        rgba(90, 65, 148, 0.3),
        transparent 62%
      ),
      linear-gradient(120deg, #9fd6ff, #ffffff 45%, #ffe6cc);
    background-size:
      220% 220%,
      220% 220%,
      220% 220%,
      220% 220%;
    animation: sec1-fake-video 14s ease-in-out infinite alternate;
    will-change: background-position, filter;
    transition: opacity 0.8s ease;

    // 影片播放完畢：淡出，露出 hero 白底
    &.is-ended {
      opacity: 0;
    }
  }

  // 下滑看更多：文字置中、下方一條細線垂直延伸至 hero 底緣
  &__hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__hero-scroll-text {
    color: $gray;
    font-weight: 300; // Noto Sans TC Light
    font-size: 12px;
    line-height: 1;
    letter-spacing: 1.2px;
    white-space: nowrap;
  }

  &__hero-scroll-line {
    width: 1px;
    height: 30px;
    margin-top: 8px;
    background: $light-gray;
  }

  // ===== intro → date 內容場景 =====
  // 對齊 Figma 1280 設計稿：內容置中、左右留白 56px
  &__scene {
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 56px;
  }

  // orange core：影片結束後於第一屏（影片區塊）正中央淡入；此為起點。
  &__core {
    position: absolute;
    top: 50vh; // 第一屏（影片區塊）正中央
    left: 50%;
    z-index: 2;
    width: 24px;
    height: 24px;
    transform: translate(-50%, -50%) scale(0.6);
    background: $orange;
    opacity: 0;
    transition:
      opacity 0.6s ease,
      transform 0.6s ease;

    // 退場消失（gone）後淡入
    &.is-visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  // 桌機 core 路徑：起點錨定在 core 起點（50vw, 50vh），依設計稿約 1:1 疊放。
  // 485 單位 ≈ 1280 稿 485px → 37.89vw；translateX(-12.58%) 讓 path 起點(x≈61/485)對齊 50%。
  &__core-path {
    position: absolute;
    top: 50vh;
    left: 50%;
    z-index: 1;
    width: 37.89vw;
    height: auto;
    transform: translateX(-12.58%);
    pointer-events: none;
  }

  // ---- intro 引言 ----
  &__intro {
    // 預留上方 core「舞台」空間：往下滑，引言文字才進入視窗
    padding-top: 100px;
  }

  &__intro-body {
    max-width: 630px;
    margin: 0 auto; // 置中窄欄（設計稿左右留白對稱）
    color: $gray;
    font-weight: 300; // Noto Sans TC Light
    font-size: 18px;
    line-height: 36px;
    text-align: justify;
  }

  // ---- date 論壇資訊 ----
  &__date {
    margin-top: clamp(120px, 22vh, 200px);
  }

  // 大標「智慧未來 AI永續論壇」
  &__date-title {
    max-width: 688px;
    margin: 0;
    color: $gray;
    font-weight: 400;
    font-size: clamp(56px, 10.5vw, 134px);
    line-height: 1;
    letter-spacing: 0.02em;
  }

  &__date-desc {
    max-width: 688px;
    margin: 44px 0 0;
    color: $gray;
    font-weight: 300;
    font-size: 22px;
    line-height: 40px;
    text-align: justify;
  }

  &__date-info {
    display: flex;
    align-items: flex-start;
    margin-top: clamp(96px, 16vh, 168px);
  }

  // 大型日期：2026 / 09 / 16 階梯狀往右下錯開
  &__date-when {
    margin: 0 0 0 clamp(0px, 18vw, 245px);
    color: $gray;
    font-weight: 300;
    font-size: clamp(64px, 13vw, 132px);
    line-height: 0.95;
  }

  &__date-num {
    display: block;

    &--m {
      margin-left: 1.3em;
    }

    &--d {
      margin-left: 2.7em;
    }
  }

  // 地點與時間：靠右、頂端對齊日期
  &__date-where {
    margin: 0 0 0 auto;
    color: $gray;
    font-weight: 400;
    font-size: clamp(24px, 3.6vw, 46px);
    line-height: 1.25;

    span {
      display: block;
    }
  }
}

// ---- 手機（<768px）：縮排、日期與地點改為上下堆疊 ----
@media screen and (max-width: 767.98px) {
  .sec1__scene {
    padding: 0 20px;
  }

  .sec1__intro {
    padding-top: clamp(360px, 78vh, 560px);
  }

  .sec1__date-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .sec1__date-when {
    margin-left: 0;
  }

  .sec1__date-where {
    margin: 32px 0 0;
  }
}

@keyframes sec1-fake-video {
  0% {
    background-position:
      0% 50%,
      100% 50%,
      50% 0%,
      0% 0%;
    filter: hue-rotate(0deg) saturate(1);
  }
  50% {
    filter: hue-rotate(-6deg) saturate(1.12);
  }
  100% {
    background-position:
      100% 50%,
      0% 50%,
      50% 100%,
      100% 100%;
    filter: hue-rotate(6deg) saturate(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sec1__hero-video {
    animation: none;
    transition: none;
  }

  .sec1__core {
    transition: none;
  }
}

// LoadingHero 收尾後淡出移除
.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
