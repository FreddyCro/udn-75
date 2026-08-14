<script lang="ts" setup>
/**
 * SubpageAnchorBar — <1280 的子頁錨點列（固定在視窗下緣，捲過 hero 才滑入）；
 * pc 改用右側 rail（SubpageAnchor）。
 * 顯隱由 Subpage.vue 以 hero 的 ScrollTrigger 決定，本元件只負責呈現。
 */
import str from '~/locales/common.json';

defineProps<{
  /** true 時滑入；預設隱藏在視窗下緣之外 */
  visible?: boolean;
}>();

const { subpageAnchors } = str;
const route = useRoute();
// 藝術字路徑來自 common.json，inline url() 是 runtime 才組出來的 → 須自行補資產前綴
const assetUrl = useAssetUrl();

const listRef = ref<HTMLElement | null>(null);

// 六項總寬（6×70 + 5×22 = 530）超出 mob 視窗 → 列可左右滑動；
// 載入時把當前頁的項目捲到列中央（clamp 交給瀏覽器）
onMounted(() => {
  const list = listRef.value;
  const active = list?.querySelector<HTMLElement>('.subpage-anchor-bar__link--active');
  if (!list || !active) return;
  const item = active.parentElement ?? active;
  const delta = item.getBoundingClientRect().left - list.getBoundingClientRect().left;
  list.scrollLeft += delta - (list.clientWidth - item.clientWidth) / 2;
});
</script>

<template>
  <nav
    class="subpage-anchor-bar"
    :class="{ 'subpage-anchor-bar--visible': visible }"
    aria-label="子頁導覽"
  >
    <ul ref="listRef" class="subpage-anchor-bar__list">
      <li v-for="a in subpageAnchors" :key="a.url" class="subpage-anchor-bar__item">
        <NuxtLink
          class="subpage-anchor-bar__link"
          :class="{ 'subpage-anchor-bar__link--active': route.path === a.url }"
          :to="a.url"
        >
          <span
            class="subpage-anchor-bar__title"
            :style="{ '--mask': `url('${assetUrl(a.titleImg)}')` }"
          />
          <span class="subpage-anchor-bar__text">{{ a.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-anchor-bar {
  // 固定在視窗下緣（子頁 navbar 下方沒有內容，不需要 sticky 佔版面）：
  // 預設收在視窗外，捲過 hero 後由 --visible 滑入。
  // z-index 900：高於滿版區塊(z2)／rail(z1) 的疊層約定（見 SubpageAnchor），低於 header(1000)。
  position: fixed;
  inset: auto 0 0 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  // 與 app-header__bar-wrap 同款背景：半透明白＋毛玻璃
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  transform: translateY(100%);
  transition: transform 0.3s ease;

  &--visible {
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @include rwd-min('pc') {
    display: none;
  }
}

// 六欄固定寬（6 欄各 70 + 欄距 22 = 530）超出 mob 視窗 → 列本身為橫向捲動容器
// （左右排列可滑動、藏捲軸）；pad 以上容得下時由外層 flex 置中。
// 邊距留在捲動容器內，滑到端點時項目不被裁切。
.subpage-anchor-bar__list {
  display: flex;
  align-items: center;
  gap: 22px;
  max-width: 100%;
  margin: 0;
  padding: 0 26px;
  overflow-x: auto;
  list-style: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.subpage-anchor-bar__item {
  flex: 0 0 70px;
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
