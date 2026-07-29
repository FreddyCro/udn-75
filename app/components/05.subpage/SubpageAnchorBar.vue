<script lang="ts" setup>
/**
 * SubpageAnchorBar — <1280 的子頁錨點列（貼在 hero 下方、隨內容捲動），
 * 對應 pc 的右側 rail（SubpageAnchor）。當前頁以橘色底線標示。
 */
import str from '~/locales/common.json';

const { subpageAnchors } = str;
const route = useRoute();
</script>

<template>
  <nav class="subpage-anchor-bar" aria-label="子頁導覽">
    <ul class="subpage-anchor-bar__list">
      <li v-for="a in subpageAnchors" :key="a.url" class="subpage-anchor-bar__item">
        <NuxtLink
          class="subpage-anchor-bar__link"
          :class="{ 'subpage-anchor-bar__link--active': route.path === a.url }"
          :to="a.url"
        >
          {{ a.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-anchor-bar {
  display: none;
  height: 60px;
  background: #fff;

  @include rwd-max('pc') {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.subpage-anchor-bar__list {
  display: flex;
  align-items: center;
  gap: 32px;
  margin: 0;
  padding: 0;
  list-style: none;

  @include rwd-max('tablet') {
    gap: 22px;
  }
}

.subpage-anchor-bar__link {
  display: block;
  padding-bottom: 4px; // 文字與 active 底線的間距（對稿 22 高含 2px 線）
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0.125em;
  color: var(--color-gray);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-orange);
  }

  &--active {
    border-bottom-color: var(--color-orange);
  }
}
</style>
