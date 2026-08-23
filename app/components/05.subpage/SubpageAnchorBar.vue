<script lang="ts" setup>
/**
 * SubpageAnchorBar — <1280 的子頁錨點列（固定在視窗下緣）；pc 改用右側 rail（SubpageAnchor）。
 * 由 layouts/subpage.vue 渲染一次。
 * 顯隱：**全程顯示**（layout 直接傳 visible），與 rail 一致 —— 一進入子頁就在。
 * ⚠️ 原本是「舞台演完才滑入」（由 Subpage.vue 的舞台 ScrollTrigger 寫旗子），那面旗子已移除；
 *    --visible 的滑入 transition 留著，是為了未來若要再接條件時不必重寫 CSS。
 * 本元件只負責呈現與兩種點擊語意（route／scroll，見下方 mode）。
 */
import str from '~/locales/common.json';
import { anchorSlug } from '~/utils/subpage-stream';
import { gaClickAnchor } from '~/utils/tracking-event';

defineProps<{
  /** true 時滑入；預設隱藏在視窗下緣之外 */
  visible?: boolean;
}>();

const { subpageAnchors } = str;
const route = useRoute();
// 藝術字路徑來自 common.json，inline url() 是 runtime 才組出來的 → 須自行補資產前綴
const assetUrl = useAssetUrl();

// route / scroll 兩種模式的差異全收在這三個小函式裡（見 useSubpageAnchor）
const { mode, activeSlug, jumpToSlug } = useSubpageAnchor();

/** route 模式看網址；scroll 模式（連續閱讀頁）看 spy 判出的 slug */
const isActive = (url: string) =>
  mode.value === 'scroll' ? activeSlug.value === anchorSlug(url) : route.path === url;

/** scroll 模式的 href 指向同頁 hash —— 長按複製、開新視窗都還是有意義的網址 */
const linkTo = (url: string) => (mode.value === 'scroll' ? `#${anchorSlug(url)}` : url);

function onClick(e: MouseEvent, url: string) {
  // ⚠️ GA 必須排在下面那道 return **之前**（同 SubpageAnchor 的理由）：route 模式會早退
  //    把導航交給 NuxtLink，埋在後面就只有連續閱讀頁的點擊會被記到。
  gaClickAnchor(anchorSlug(url));

  if (mode.value !== 'scroll') return; // route 模式：交給 NuxtLink 換頁
  e.preventDefault();
  const slug = anchorSlug(url);
  jumpToSlug(slug);
  // 網址跟著換（分享得出去），但用 replace 不堆歷史：六篇之間點來點去不該讓上一頁鍵
  // 變成「回上一節」的迷宮 —— 上一頁該回到來源（首頁）。
  history.replaceState(history.state, '', `#${slug}`);
}

const listRef = ref<HTMLElement | null>(null);

// 六項總寬（6×70 + 5×22 = 530）超出 mob 視窗 → 列可左右滑動；
// 把 active 的項目捲到列中央（clamp 交給瀏覽器）
function centerActive() {
  const list = listRef.value;
  const active = list?.querySelector<HTMLElement>('.subpage-anchor-bar__link--active');
  if (!list || !active) return;
  const item = active.parentElement ?? active;
  const delta = item.getBoundingClientRect().left - list.getBoundingClientRect().left;
  list.scrollLeft += delta - (list.clientWidth - item.clientWidth) / 2;
}

onMounted(centerActive);

// scroll 模式：捲過一篇就把該項帶到中央。
// 必須另外接這條 watch，不能只靠 onMounted —— active 是 spy 判出來的，掛載那一刻
// activeSlug 還是空字串，querySelector 找不到 --active 就直接 return 了。
watch(activeSlug, () => nextTick(centerActive));
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
          :class="{ 'subpage-anchor-bar__link--active': isActive(a.url) }"
          :to="linkTo(a.url)"
          @click="onClick($event, a.url)"
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
  // z-index 960：**高於** .sp-full 滿版區塊(950)，低於 header(1000)。
  // 刻意與 pc 右側 rail(900) 不同值：rail 被滿版區塊蓋掉是設計要的（滿版就要滿版），
  // 但這條是 <1280 唯一的導覽、又橫在視窗下緣，被照片牆蓋掉就等於沒有導覽。
  // 完整疊層總表見 assets/styles/subpage.scss 的 .sp-full。
  position: fixed;
  inset: auto 0 0 0;
  z-index: 960;
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
// （左右排列可滑動、藏捲軸）。邊距留在捲動容器內，滑到端點時項目不被裁切。
//
// ⚠️ 寬度必須寫死 100%：iOS/WebKit 對巢狀 flex 裡捲動容器的 intrinsic size 會算錯
//    （實測只剩 162px，六項被裁到剩中間兩項）。置中改由首尾 item 的 auto margin 實現（見 __item）。
.subpage-anchor-bar__list {
  display: flex;
  align-items: center;
  gap: 22px;
  width: 100%;
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

  // 容得下時 auto margin 置中、overflow 時歸零回到靠左可捲動；
  // 不能用 justify-content: center —— overflow 時列首會滑不到。
  &:first-child {
    margin-left: auto;
  }

  &:last-child {
    margin-right: auto;
  }
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
