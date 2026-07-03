<script setup lang="ts">
// hero：第一屏影片區塊（含 SEO 文字、下滑提示、dev 狀態切換列）。
// 影片四階段狀態自 useHeroVideo 全域共享；此處只讀狀態驅動外觀。
import str from '@/locales/section1.json';
import { useHeroVideo } from '~/composables/useHeroVideo';

const { state: heroState, isGone } = useHeroVideo();
</script>

<template>
  <!-- id 供 AppHeader 以 IntersectionObserver 監看 hero（捲離後才顯示 header） -->
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

// 假影片：多層漸層 + 緩慢平移／色相位移，模擬動態影像；待真影片到位後移除。
.sec1__hero-video {
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
}
</style>