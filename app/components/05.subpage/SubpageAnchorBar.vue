<script lang="ts" setup>
/**
 * SubpageAnchorBar — <1280 的子頁錨點列（貼在 hero 下方、隨內容捲動）；
 * pc 改用右側 rail（SubpageAnchor）。
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
          <span
            class="subpage-anchor-bar__title"
            :style="{ '--mask': `url('${a.titleImg}')` }"
          />
          <span class="subpage-anchor-bar__text">{{ a.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-anchor-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 0 26px; // 對稿只有置中不留邊；此處補窄機（<398）的安全邊距
  background: #fff;

  @include rwd-min('pc') {
    display: none;
  }
}

// 對稿為固定寬（4 欄各 70 + 欄距 22 = 346）；此處改成「等分欄 + max-width」，
// 窄機時四欄一起等比收窄，藝術字以 contain 跟著縮，不擠壓也不換行。
.subpage-anchor-bar__list {
  display: flex;
  align-items: center;
  gap: 22px;
  width: 100%;
  max-width: 346px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.subpage-anchor-bar__item {
  flex: 1 1 70px;
  min-width: 0;
}

.subpage-anchor-bar__link {
  display: block;
  padding-bottom: 7px;
  color: var(--color-gray);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;

  &:hover {
    border-bottom-color: var(--color-orange);
  }

  &--active {
    border-bottom-color: var(--color-orange);
  }
}

// 藝術字（與 hero 主標同一套）：以 mask + currentColor 上色，才能跟著 active/hover 變色
.subpage-anchor-bar__title {
  display: block;
  height: 14px;
  background: currentColor;
  mask: var(--mask) no-repeat center / contain;
  -webkit-mask: var(--mask) no-repeat center / contain;
}

// 無障礙用文字（視覺以藝術字呈現）
.subpage-anchor-bar__text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
