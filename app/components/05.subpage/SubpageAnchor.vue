<script lang="ts" setup>
/**
 * SubpageAnchor — 子頁右側錨點導覽（pc 限定，<1280 隱藏、改用 SubpageAnchorBar），
 * 資料來自 locales/common.json 的 subpageAnchors。藝術字以 CSS mask + currentColor
 * 上色，換色不需多份素材。hover 與 active 同為「不透明＋放大＋尾端橫線」，不變色。
 * 顯隱：**全程顯示**（layouts/subpage.vue 直接傳 visible）。舞台的 hero／引言兩拍是透明層，
 * 蓋不到 rail；只有滿屏引言媒體那一拍該蓋住它，那由疊層做掉（見下方 z-index）。
 * 唯一例外是頁尾收尾區（得獎作品清單／返回導覽）：那些是白底內容、疊不過 rail（900），
 * rail 會壓在清單文字上 —— 故收尾區捲上來時 rail 自行淡出（見 covered）。
 * ⚠️ 與 SubpageAnchorBar 不同步 —— 那條橫在視窗下緣、是實心底，仍維持「舞台演完才滑入」。
 * rail 疊在**一般內文**之上（--subpage-anchor-z，預設 900），但滿版嵌入元件
 * （.sp-full，950）刻意蓋得過它 —— 滿版就要滿版。疊層總表見 subpage.scss 的 .sp-full。
 */
import str from '~/locales/common.json';
import { inlineArtUrl } from '~/utils/inline-art';
import { anchorSlug } from '~/utils/subpage-stream';
import { gaClickAnchor } from '~/utils/tracking-event';

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

// 錨點的 hover／click 音效。useSfx() 一定要在 setup 期間取（見 useSfx.ts 檔頭）。
const { play } = useSfx();

function onClick(e: MouseEvent, url: string) {
  // ⚠️ GA 必須排在下面那道 return **之前**：route 模式（獨立子頁）會早退把導航交給
  //    NuxtLink，埋在後面就只有連續閱讀頁的點擊會被記到。兩種模式都是同一個 click_anchor。
  gaClickAnchor(anchorSlug(url));

  // 修飾鍵點擊＝開新分頁的意圖，不算本頁互動、不出聲（同 AppHeaderNav.onAwaySelect）。
  // 排在 GA 之後：那一下仍是一次錨點點擊，只是換了落地的視窗。
  if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) play('sfx01Short');

  if (mode.value !== 'scroll') return; // route 模式：交給 NuxtLink 換頁
  e.preventDefault();
  const slug = anchorSlug(url);
  jumpToSlug(slug);
  history.replaceState(history.state, '', `#${slug}`);
}
// 藝術字路徑來自 common.json，inline url() 是 runtime 才組出來的 → 須自行補資產前綴
const assetUrl = useAssetUrl();
// hero 標題（titleImg）刻意不內嵌：已嘗試（獨立模組）並撤回——首頁的 JS 請求數
// 從 5 變 6、那 122 KB 因靜態 import 照樣被抓，淨效果比不做還糟。完整推理與實測
// 數字見 architecture/2026-09-04-request-reduction-design.md §7「hero 標題不內嵌」。
// numImg（編號 01–06）不同：首頁的 MediaList 本來就共用同一份 inline-art
// 內嵌表，內嵌不會多付任何首頁成本，維持走 inlineArtUrl。
const numUrl = (path: string) => inlineArtUrl(path) ?? assetUrl(path);

// 收尾區判定：得獎作品清單（.subpage-works）或返回導覽（.subpage-nav__inner）的頂端
// 越過 rail 下緣 → rail 淡出讓位；之後（footer）保持隱藏，回捲上來才復現。
// 用「頂端越過下緣」而非重疊判定：收尾區之下沒有 rail 該出現的內容，
// 若用重疊判定，footer 夠高時收尾區會整段捲過 rail、讓 rail 又亮回來。
// 元素每次檢查都重查（querySelectorAll）而非掛載時綁定：rail 由 layout 渲染、跨子頁導航
// 不重掛，收尾區卻在各頁子樹內會整批換掉 —— 重查就不必跟著換頁重新接線。
const railRef = ref<HTMLElement | null>(null);
const covered = ref(false);
let coverRaf = 0;

function checkCovered() {
  coverRaf = 0;
  const rail = railRef.value?.getBoundingClientRect();
  if (!rail) return;
  const zones = document.querySelectorAll('.subpage-works, .subpage-nav__inner');
  covered.value = [...zones].some(
    (z) => z.getBoundingClientRect().top < rail.bottom,
  );
}

// rAF 節流：scroll 每 frame 可能進來多次，量測一次就夠
function onViewportChange() {
  if (!coverRaf) coverRaf = requestAnimationFrame(checkCovered);
}

onMounted(() => {
  window.addEventListener('scroll', onViewportChange, { passive: true });
  window.addEventListener('resize', onViewportChange, { passive: true });
  checkCovered();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onViewportChange);
  window.removeEventListener('resize', onViewportChange);
  if (coverRaf) cancelAnimationFrame(coverRaf);
});
</script>

<template>
  <nav
    ref="railRef"
    class="subpage-anchor"
    :class="{
      'subpage-anchor--visible': visible,
      'subpage-anchor--covered': covered,
    }"
    aria-label="子頁導覽"
  >
    <ul class="subpage-anchor__list">
      <li v-for="a in subpageAnchors" :key="a.url" class="subpage-anchor__item">
        <NuxtLink
          class="subpage-anchor__link"
          :class="{ 'subpage-anchor__link--active': isActive(a.url) }"
          :to="linkTo(a.url)"
          @mouseenter="play('sfx01Short')"
          @click="onClick($event, a.url)"
        >
          <span class="subpage-anchor__art">
            <span
              class="subpage-anchor__title"
              :style="{ '--mask': `url('${assetUrl(a.titleImg)}')` }"
            />
            <span
              class="subpage-anchor__num"
              :style="{ '--mask': `url('${numUrl(a.numImg)}')` }"
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

  // 收尾區（得獎作品清單／返回導覽）捲到 rail 下緣時讓位（見 script 的 covered）。
  // 寫在 --visible 之後（同特異度）才蓋得過它；visibility 延遲切換與預設隱藏同一套
  // —— 淡出播完才真正移出焦點順序。
  &--covered {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease,
      visibility 0s linear 0.3s;
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
