<script lang="ts" setup>
/**
 * SubpageAnchor — 子頁右側錨點導覽（pc 限定，<1280 隱藏、改用 SubpageAnchorBar），
 * 資料來自 locales/common.json 的 subpageAnchors。藝術字以 CSS mask + currentColor
 * 上色，換色不需多份素材。hover 與 active 同為「不透明＋放大」，不變色。
 * 顯隱與 SubpageAnchorBar 同步：由 Subpage.vue 的舞台 ScrollTrigger 決定，
 * 捲進 subpage__content（舞台演完）才淡入，hero／引言期間不出現。
 * rail 走低 z-index（--subpage-anchor-z，預設 1）：滿版 section 以
 * position: relative + z-index: 2 + 不透明背景即可蓋過，不需 JS 偵測。
 */
import str from '~/locales/common.json';

defineProps<{
  /** true 時淡入；預設隱藏（舞台 hero／引言還在演） */
  visible?: boolean;
}>();

const { subpageAnchors } = str;
const route = useRoute();
// 藝術字路徑來自 common.json，inline url() 是 runtime 才組出來的 → 須自行補資產前綴
const assetUrl = useAssetUrl();
</script>

<template>
  <nav
    class="subpage-anchor"
    :class="{ 'subpage-anchor--visible': visible }"
    aria-label="子頁導覽"
  >
    <ul class="subpage-anchor__list">
      <li v-for="a in subpageAnchors" :key="a.url" class="subpage-anchor__item">
        <NuxtLink
          class="subpage-anchor__link"
          :class="{ 'subpage-anchor__link--active': route.path === a.url }"
          :to="a.url"
        >
          <span class="subpage-anchor__art">
            <span
              class="subpage-anchor__title"
              :style="{ '--mask': `url('${assetUrl(a.titleImg)}')` }"
            />
            <span
              class="subpage-anchor__num"
              :style="{ '--mask': `url('${assetUrl(a.numImg)}')` }"
            />
          </span>
          <span class="subpage-anchor__text">{{ a.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-anchor {
  position: fixed;
  top: 25%;
  right: 24px;
  z-index: var(--subpage-anchor-z, 1); // 滿版區塊 z-index ≥ 2 即蓋過 rail（底層）
  display: none; // <1280 改用 SubpageAnchorBar
  transform: translateY(-50%);
  // 預設藏著（hero／引言舞台期間），舞台演完由 --visible 淡入；
  // visibility 延遲切換 = 淡出播完才真正移出焦點順序
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0s linear 0.3s;

  &--visible {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @include rwd-min('pc') {
    display: block;
  }
}

.subpage-anchor__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.subpage-anchor__link {
  display: flex;
  align-items: center;
  color: var(--color-gray);
  opacity: 0.4;
  text-decoration: none;
  transition: opacity 0.2s ease;

  // hover 不變色，放大效果與 active 一致（尾端橫線仍為 active 限定）
  &:hover {
    opacity: 1;

    .subpage-anchor__art {
      transform: scale(1.25);
    }
  }

  // 目前所在頁：藝術字放大 1.25（設計稿 12 → 15px）＋ 尾端橫線
  &--active {
    opacity: 1;

    .subpage-anchor__art {
      transform: scale(1.25);
    }

    &::after {
      content: '';
      width: 50px;
      height: 1px;
      margin-left: 34px; // 8px 間隔 + 藝術字放大 1.25 後多出的 (75+18)×0.25 ≈ 23px
      background: currentColor;
    }
  }
}

// 藝術字群組（active 時整組放大，橫線不縮放避免超出視窗右緣）
.subpage-anchor__art {
  display: flex;
  align-items: center;
  transform-origin: left center;
  transition: transform 0.2s ease;
}

// 藝術字（mask 上色）：標題欄固定寬 → 標題齊左、數字齊左
.subpage-anchor__title,
.subpage-anchor__num {
  display: block;
  height: 12px;
  background: currentColor;
  mask: var(--mask) no-repeat left center / contain;
  -webkit-mask: var(--mask) no-repeat left center / contain;
}

.subpage-anchor__title {
  width: 75px; // 59px 藝術字 + 至數字欄的間隔
}

.subpage-anchor__num {
  width: 18px;
}

// 無障礙用文字（視覺以藝術字呈現）
.subpage-anchor__text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
