<script lang="ts" setup>
/** SubpageNav — 子頁最下方的「返回 / 下一篇」導覽。 */
withDefaults(
  defineProps<{
    backUrl?: string;
    backLabel?: string;
    next?: { title?: string; url?: string };
  }>(),
  { backUrl: '/', backLabel: '返回' },
);
</script>

<template>
  <nav class="subpage-nav">
    <div class="subpage-nav__inner">
      <!-- 用 NuxtLink 而非原生 <a>：原生 href 是整頁重載，不走 vue-router，
           換頁轉場（app.pageTransition）不會觸發。to 收乾淨的 route path，baseURL 由 NuxtLink 處理。 -->
      <NuxtLink class="subpage-nav__link subpage-nav__link--back" :to="backUrl">
        <img
          class="subpage-nav__icon subpage-nav__icon--prev"
          src="/img/udn75_nav_prev.svg"
          alt=""
          aria-hidden="true"
        />
        <span class="subpage-nav__label">{{ backLabel }}</span>
      </NuxtLink>

      <NuxtLink
        v-if="next?.url"
        class="subpage-nav__link subpage-nav__link--next"
        :to="next.url"
      >
        <span class="subpage-nav__label">{{ next.title }}</span>
        <!-- 兩段音波（同 HeroStart 音效提示）：兩圈相位差半個週期的擴散波，墊在圓鈕背後 -->
        <span class="subpage-nav__next-wrap">
          <svg class="subpage-nav__pulse" viewBox="0 0 96 96" aria-hidden="true">
            <circle class="subpage-nav__pulse-wave" cx="48" cy="48" r="47.75" />
            <circle
              class="subpage-nav__pulse-wave subpage-nav__pulse-wave--late"
              cx="48"
              cy="48"
              r="47.75"
            />
          </svg>
          <img
            class="subpage-nav__icon subpage-nav__icon--next"
            src="/img/udn75_nav_next.svg"
            alt=""
            aria-hidden="true"
          />
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-nav {
  background: #fff;
  display: none;
  @include rwd-min('tablet') {
    display: block;
  }
}

.subpage-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--subpage-wide-w); // 與內文寬欄對齊
  margin: 0 auto;
  padding: 32px;
}

.subpage-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--color-gray);
  text-decoration: none;

  &:hover .subpage-nav__label {
    text-decoration: underline;
  }
}

.subpage-nav__label {
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;
  letter-spacing: 1.8px;
  white-space: normal;

  @include rwd-min('tablet') {
    white-space: nowrap;
  }
}

.subpage-nav__icon {
  display: block;
  flex-shrink: 0;
}

.subpage-nav__icon--prev {
  width: 68px;
  height: 68px;
}

.subpage-nav__icon--next {
  position: relative; // 疊在音波之上（同層繪製順序，不用 z-index）
  width: 84px;
  height: 84px;
}

// 音波的定位基準：只包圓鈕，寬度不含左側文字
.subpage-nav__next-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.subpage-nav__pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 128px;
  height: 128px;
  transform: translate(-50%, -50%);
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
}

// 與 HeroStart 音效提示同款：兩圈擴散波、相位差半個週期，惟此處為常駐 CTA → infinite
.subpage-nav__pulse-wave {
  fill: none;
  stroke: var(--color-orange);
  stroke-width: 0.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: subpage-nav-pulse 1.5s ease-out infinite both;

  &--late {
    animation-delay: 0.75s;
  }
}

// scale 起點 = 圓鈕邊緣（84 / 128），擴散到外框後淡出
@keyframes subpage-nav-pulse {
  0% {
    opacity: 0;
    transform: scale(0.656);
  }

  10% {
    opacity: 1;
  }

  60% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
