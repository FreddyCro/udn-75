<script lang="ts" setup>
/**
 * SubpageAnchor — 子頁右側錨點導覽（pc 限定，<1280 隱藏、改用 SubpageAnchorBar），
 * 資料來自 locales/common.json 的 subpageAnchors。藝術字以 CSS mask + currentColor
 * 上色，換色不需多份素材。hover 與 active 同為「不透明＋放大＋尾端橫線」，不變色。
 * 顯隱：**全程顯示**（layouts/subpage.vue 直接傳 visible）。舞台的 hero／引言兩拍是透明層，
 * 蓋不到 rail；只有滿屏引言媒體那一拍該蓋住它，那由疊層做掉（見下方 z-index）。
 * ⚠️ 與 SubpageAnchorBar 不同步 —— 那條橫在視窗下緣、是實心底，仍維持「舞台演完才滑入」。
 * rail 疊在**一般內文**之上（--subpage-anchor-z，預設 900），但滿版嵌入元件
 * （.sp-full，950）刻意蓋得過它 —— 滿版就要滿版。疊層總表見 subpage.scss 的 .sp-full。
 */
import str from '~/locales/common.json';
import { anchorSlug } from '~/utils/subpage-stream';

defineProps<{
  /** true 時淡入；預設隱藏（舞台 hero／引言還在演） */
  visible?: boolean;
}>();

const { subpageAnchors } = str;
const route = useRoute();

// rail 是 pc 限定、連續閱讀頁是 <768 限定，兩者實務上不同時出現；但 /subpage 的 ≥768
// 導回是 client 端才跑的，那一瞬間 rail 會以寬視窗渲染在連續閱讀頁上 —— 若沿用
// `route.path === a.url`，六項會全部不亮（路徑是 /subpage）。故與底部列吃同一套判定。
const { mode, activeSlug, jumpToSlug } = useSubpageAnchor();

const isActive = (url: string) =>
  mode.value === 'scroll' ? activeSlug.value === anchorSlug(url) : route.path === url;

const linkTo = (url: string) => (mode.value === 'scroll' ? `#${anchorSlug(url)}` : url);

function onClick(e: MouseEvent, url: string) {
  if (mode.value !== 'scroll') return; // route 模式：交給 NuxtLink 換頁
  e.preventDefault();
  const slug = anchorSlug(url);
  jumpToSlug(slug);
  history.replaceState(history.state, '', `#${slug}`);
}
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
          :class="{ 'subpage-anchor__link--active': isActive(a.url) }"
          :to="linkTo(a.url)"
          @click="onClick($event, a.url)"
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
  // 900 ＝ 子頁疊層的最底層（總表見 assets/styles/subpage.scss 的 .sp-full）：
  // 內文的一般段落（z-index auto）蓋不過它，但滿版嵌入元件（.sp-full，950）、
  // 底部錨點列(960)、header(1000)、滿屏引言媒體(1100) 都蓋得過。
  // ⚠️ 與 SubpageAnchorBar(960) 刻意不同值，理由見該檔。
  z-index: var(--subpage-anchor-z, 900);
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

  // 尾端橫線：六項都常駐佔位（預設透明），幾何一律 93 + 8 + 50 = 151
  // → 數字欄在預設／hover／active 三種狀態都對得齊。
  &::after {
    content: '';
    width: 50px;
    height: 1px;
    margin-left: 8px; // 設計稿：數字欄右緣至橫線 8px（線起點 x=100）
    background: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  // hover 與 active 同一組表現：不透明＋藝術字放大＋顯示尾端橫線，不變色
  &:hover,
  &--active {
    opacity: 1;

    .subpage-anchor__art {
      transform: scale(1.13); // 設計稿 active 項換算：162 / 150
    }

    &::after {
      opacity: 1;
    }
  }
}

// 藝術字群組（放大時橫線不縮放，避免超出視窗右緣）
.subpage-anchor__art {
  display: flex;
  align-items: center;
  // 往左放大：數字欄右緣不動，六項數字才能垂直對齊（設計稿 active 項 x 由 14 → 2、右緣不變）
  transform-origin: right center;
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
