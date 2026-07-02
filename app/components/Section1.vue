<script setup lang="ts">
// Section 1：hero / intro / date
import str from '@/locales/section1.json';

// LoadingHero 蓋在最上層，等 hero 影片可播放後才收尾並淡出移除。
const loaderDone = ref(false);

// 影片是否已可播放，作為 LoadingHero 的收尾條件。
// 目前 hero 影片尚未提供，暫用 CSS 假影片，onMounted 後即視為可播放。
// TODO: 換成真實 <video> 後，移除下方 onMounted 設值，改綁定 <video> 的
//       @canplaythrough="videoReady = true"（並視需要 preload）。
const videoReady = ref(false);
onMounted(() => {
  videoReady.value = true;
});
</script>

<template>
  <section class="sec1">
    <Transition name="loader-fade">
      <LoadingHero
        v-if="!loaderDone"
        :duration="2"
        :ready="videoReady"
        @done="loaderDone = true"
      />
    </Transition>

    <!-- hero -->
    <div class="sec1__hero" id="app-hero">
      <!-- video placeholder（影片尚未提供，暫用 CSS 動畫模擬動態影像） -->
      <div
        class="sec1__hero-video w-full h-screen flex justify-center items-center flex-col"
        aria-hidden="true"
      >
        <span>(video)</span>
        <h1 class="sec1__hero-title">
          {{ str.hero.title }}
        </h1>
        <p class="sec1__hero-subtitle">
          {{ str.hero.subtitle }}
        </p>
      </div>

      <!-- 文字保留於 DOM 供 SEO / 螢幕閱讀器，視覺上不顯示 -->
      <h1 class="visually-hidden">{{ str.hero.title }}</h1>
      <p class="visually-hidden">{{ str.hero.subtitle }}</p>

      <!-- 下滑看更多：文字 + 向下延伸細線（末端貼齊 hero 底緣），純視覺無功能 -->
      <div class="sec1__hero-scroll">
        <span class="sec1__hero-scroll-text">{{ str.hero.scrollHint }}</span>
        <span class="sec1__hero-scroll-line" aria-hidden="true" />
      </div>
    </div>

    <!-- intro → date：orange core 貫穿的內容場景（core 移動路線尚未實作） -->
    <div class="sec1__scene">
      <!--
        orange core：intro 起始時位於畫面正中的橘色方塊，
        設計上會沿一條曲線路徑「貫穿全場」直到 date 區。
        目前僅為靜態佔位（初始位置），尚未實作移動動畫。
      -->
      <span class="sec1__core" aria-hidden="true" />

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
// Figma design tokens（與 AppHeader 一致）
$orange: #ff7f00;
$gray: #686868;
$light-gray: #898989;

.sec1 {
  &__hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
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

  // orange core：初始置於場景第一屏正中央的橘色方塊（靜態佔位）
  &__core {
    position: absolute;
    top: clamp(210px, 44vh, 360px);
    left: 50%;
    width: 24px;
    height: 24px;
    transform: translate(-50%, -50%);
    background: $orange;
  }

  // ---- intro 引言 ----
  &__intro {
    // 預留上方 core「舞台」空間：往下滑，引言文字才進入視窗
    padding-top: clamp(420px, 88vh, 720px);
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

  &__intro-cta {
    display: block;
    width: fit-content;
    margin: 40px auto 0;
    padding: 4px 0;
    color: $orange;
    font-size: 16px;
    text-decoration: underline;
    text-underline-offset: 4px;
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
