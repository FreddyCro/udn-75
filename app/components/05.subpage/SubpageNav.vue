<script lang="ts" setup>
/** SubpageNav — 子頁最下方的「返回 / 下一篇」導覽。 */
import { gaClickButton } from '~/utils/tracking-event';

// 兩顆導覽鈕的 hover／click 音效。useSfx() 一定要在 setup 期間取（它此刻要讀 runtimeConfig，
// 見 useSfx.ts）；音效池由 app.vue 的 <AppSfx> 持有，聲音開關關著時 play() 靜默。
const { play } = useSfx();

const props = withDefaults(
  defineProps<{
    backUrl?: string;
    backLabel?: string;
    next?: { title?: string; url?: string };
    /** 所在頁的 slug（news／visual／…），GA term 用：{slug}_back ／ {slug}_next */
    slug?: string;
  }>(),
  { backUrl: '/', backLabel: '返回', slug: '' },
);

// term 以「離開哪一篇」命名，而不是「去哪裡」——「使用者從 news 往下一篇」比
// 「使用者去了 visual」更能回答「哪一篇留得住人」，而目的地本來就由順序決定。
const gaNav = (dir: 'back' | 'next') => {
  if (props.slug) gaClickButton('nav', `${props.slug}_${dir}`);
};
</script>

<template>
  <nav class="subpage-nav">
    <div class="subpage-nav__inner">
      <!-- 用 NuxtLink 而非原生 <a>：原生 href 是整頁重載，不走 vue-router，
           換頁轉場（app.pageTransition）不會觸發。to 收乾淨的 route path，baseURL 由 NuxtLink 處理。 -->
      <NuxtLink
        class="subpage-nav__link subpage-nav__link--back"
        :to="backUrl"
        @mouseenter="play('sfx01')"
        @click="play('sfx01'); gaNav('back')"
      >
        <!-- 靜止／hover 同一顆圖示，只換顏色（圓：透明→橘、箭頭：灰→白）與尺寸——
             <img> 載入的 svg 無法用 CSS 上色，故內嵌。
             幾何＝udn75_nav_prev.svg／udn75_nav_prev_hover.svg（兩者箭頭路徑相同，只差顏色）。 -->
        <svg
          class="subpage-nav__icon subpage-nav__icon--prev"
          viewBox="0 0 68 68"
          aria-hidden="true"
        >
          <circle class="subpage-nav__icon-disc" cx="34" cy="34" r="33.75" />
          <path
            class="subpage-nav__icon-arrow"
            d="M22 35.0039L22 38.0039L25 38.0039L25 35.0039L22 35.0039ZM22 29L22 32L25 32L25 29L22 29ZM25 38L25 41L28 41L28 38L25 38ZM25 26L25 29L28 29L28 26L25 26ZM28 41L28 44L31 44L31 41L28 41ZM31 44L31 47L34 47L34 44L31 44ZM28 23L28 26L31 26L31 23L28 23ZM31 20L31 23L34 23L34 20L31 20ZM19 32L19 35L49 35L49 32L19 32Z"
          />
        </svg>
        <span class="subpage-nav__label">{{ backLabel }}</span>
      </NuxtLink>

      <NuxtLink
        v-if="next?.url"
        class="subpage-nav__link subpage-nav__link--next"
        :to="next.url"
        @mouseenter="play('sfx01')"
        @click="play('sfx01'); gaNav('next')"
      >
        <span class="subpage-nav__label">{{ next.title }}</span>
        <!-- 兩段音波（同 HeroStart 音效提示）：兩圈相位差半個週期的擴散波，墊在圓鈕背後；
             hover 時淡出（hover 回饋交給圓鈕停在放大態） -->
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

// 兩邊的 hover 回饋都只落在圓鈕（文字不變色、不加底線）：
// 「返回」換成 84px 實心橘鈕，「下一篇」停在放大態
.subpage-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--color-gray);
  text-decoration: none;
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

// 依設計稿，「返回」靜止＝68px 灰線框鈕＋灰箭頭，hover＝84px 實心橘鈕＋白箭頭。
// 同一顆 svg 只換 fill / stroke 與尺寸，不換素材，顏色才能真的補間。
// 盒維持 68px、放大交給 transform，文字與版面不會被推開。
.subpage-nav__icon--prev {
  width: 68px;
  height: 68px;
  transition: transform 0.2s ease;
}

// fill 用 transparent 而非 none：none 之間無法補間，換色會直接跳
.subpage-nav__icon-disc {
  fill: transparent;
  stroke: var(--color-gray);
  stroke-width: 0.5;
  transition:
    fill 0.2s ease,
    stroke 0.2s ease;
}

.subpage-nav__icon-arrow {
  fill: var(--color-gray);
  transition: fill 0.2s ease;
}

.subpage-nav__link--back:hover {
  .subpage-nav__icon--prev {
    transform: scale(1.2353); // = 84px（84 / 68）
  }

  .subpage-nav__icon-disc {
    fill: var(--color-orange);
    stroke: var(--color-orange);
  }

  .subpage-nav__icon-arrow {
    fill: #fff;
  }
}

// 只留換色，不做放大位移
@media (prefers-reduced-motion: reduce) {
  .subpage-nav__icon--prev {
    transition: none;
  }

  .subpage-nav__link--back:hover .subpage-nav__icon--prev {
    transform: none;
  }
}

// 圓鈕呼吸：盒維持 84×84（版面不動），以 scale 在 68px ↔ 84px 之間起伏；
// hover 移除動畫 = 停在 keyframes 首尾的 scale(1)（84px 放大態），移開再從頭呼吸
.subpage-nav__icon--next {
  position: relative; // 疊在音波之上（同層繪製順序，不用 z-index）
  width: 84px;
  height: 84px;
  animation: subpage-nav-breathe 2s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.subpage-nav__link--next:hover .subpage-nav__icon--next {
  animation: none;
}

@keyframes subpage-nav-breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8095); // = 68px（68 / 84）
  }
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
  transition: opacity 0.2s ease;

  // hover 漣漪淡出，只留停在 84px 的圓鈕
  .subpage-nav__link--next:hover & {
    opacity: 0;
  }

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
