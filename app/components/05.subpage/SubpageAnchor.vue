<script lang="ts" setup>
/**
 * SubpageAnchor — 子頁右側錨點導覽（桌機限定，≤768px 隱藏）。
 * 固定於視窗右側垂直置中，列出四個子頁名稱（locales/common.json 的
 * subpageAnchors），點擊前往該頁；目前所在頁以橘色高亮。
 *
 *  - 滿版區塊「顯示在底層」：rail 走低 z-index（--subpage-anchor-z，預設 1）。
 *    滿版 section 只要 position: relative + z-index: 2 + 不透明背景，
 *    捲過時 rail 自然被蓋在底層，不需 JS 偵測。
 *  - 位移動態統一 translate 0.2s（規格）。
 *
 * TODO(figma): 視覺（字級、指示符號、間距）先照規格描述估值，
 * 取得檔案權限後對 #側欄錨點｜圖表 校正。
 */
import str from '~/locales/common.json';

const { subpageAnchors } = str;
const route = useRoute();
</script>

<template>
  <nav class="subpage-anchor" aria-label="子頁導覽">
    <ul class="subpage-anchor__list">
      <li v-for="a in subpageAnchors" :key="a.url" class="subpage-anchor__item">
        <NuxtLink
          class="subpage-anchor__link"
          :class="{ 'subpage-anchor__link--active': route.path === a.url }"
          :to="a.url"
        >
          {{ a.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-anchor {
  position: fixed;
  top: 50%;
  right: 24px;
  z-index: var(--subpage-anchor-z, 1); // 滿版區塊 z-index ≥ 2 即蓋過 rail（底層）
  transform: translateY(-50%);

  @include rwd-tablet {
    display: none;
  }
}

.subpage-anchor__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: right;
}

.subpage-anchor__link {
  display: inline-block;
  color: var(--color-gray-light);
  font-size: var(--text-caption); // 15
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  text-decoration: none;
  transition:
    transform 0.2s ease, // 規格：translate 0.2s
    color 0.2s ease;

  &:hover {
    color: var(--color-orange);
  }

  &--active {
    color: var(--color-orange);
    transform: translateX(-6px);
  }
}
</style>
