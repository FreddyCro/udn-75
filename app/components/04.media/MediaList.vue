<script setup lang="ts">
/** 智慧媒體 01–04 子頁清單（common.json subpageAnchors 驅動） */
import common from '@/locales/common.json';

const { subpageAnchors } = common;
// 編號藝術字路徑來自 common.json，inline url() 是 runtime 才組出來的 → 須自行補資產前綴
const assetUrl = useAssetUrl();

const rowEls: HTMLElement[] = [];
const setRow = (el: any, i: number) => {
  if (el) rowEls[i] = el as HTMLElement;
};

/** 供 useMediaIntroMotion 取清單列（settle 尾端 stagger 淡入的目標） */
defineExpose({ getRows: () => rowEls.filter(Boolean) });
</script>

<template>
  <!-- 01–04 清單：編號＋標題：副標＋單位／作者，hover 放大（frame 76） -->
  <ol class="media__list">
    <li
      v-for="(a, i) in subpageAnchors"
      :key="a.url"
      :ref="(el) => setRow(el, i)"
      class="media__item"
    >
      <NuxtLink class="media__row" :to="a.url">
        <!-- text 在 pad 以上攤平成 grid 欄位（display: contents），
             mob 稿收成直排文字塊；break 只在 mob 稿於「：」後換行 -->
        <span class="media__text">
          <!-- 編號藝術字（同 SubpageAnchor：mask 上色，資料共用 numImg） -->
          <span
            class="media__num"
            :style="{ '--mask': `url('${assetUrl(a.numImg)}')` }"
            aria-hidden="true"
          />
          <span class="media__row-title"
            >{{ a.title }}：<br class="media__break" />{{ a.subtitle }}</span
          >
          <!-- 單位／作者合併一則：pad 以上在標題右側自成一欄、mob 移到標題下方 -->
          <span class="media__author">{{ a.unit }}／{{ a.author }}</span>
        </span>
        <img
          class="media__arrow"
          src="/img/udn75_arrow_circle.svg"
          width="40"
          height="40"
          alt=""
        />
      </NuxtLink>
    </li>
  </ol>
</template>

<style lang="scss" scoped>
// 本檔為 mobile-first：基底＝mob 稿（≤767），rwd-min('tablet')＝pad 以上、
// rwd-min('pc')＝pc 稿
.media__list {
  margin: 0; // 與內文的間距由 Media.vue 的 .media__roam 底紋活動帶佔位
  padding: 0;
  list-style: none;
}

// 清單列：上緣分隔線（mob 稿線內縮於欄內、末列補底線；pad 以上橫貫整個視窗）
.media__item {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: 1px;
    background: var(--color-line);
    transform: translateX(-50%);

    @include rwd-min('tablet') {
      // 100vw 含垂直捲軸寬 → 直接用會左右各溢出半個捲軸寬而撐出水平捲軸，故扣掉
      width: calc(100vw - var(--scrollbar-width));
    }
  }
}

.media__row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px 0;
  color: var(--color-gray);
  text-decoration: none;
  pointer-events: auto;
}

// 文字塊：mob 稿直排
.media__text {
  display: block;
  padding-left: 4px;

  @include rwd-min('tablet') {
    display: contents;
  }
}

// 編號藝術字：高度＝文字行高，hover 以尺寸放大（真實佔位）
.media__num {
  display: inline-block;
  height: 22px;
  aspect-ratio: 16.9 / 12; // udn75_anchor_num_0x.svg 原始比例，寬度隨高自算
  background: currentColor;
  mask: var(--mask) no-repeat left center / contain;
  -webkit-mask: var(--mask) no-repeat left center / contain;
  vertical-align: -2px;
  margin-right: 8px;
  transition: height 0.25s ease;

  .media__row:hover & {
    height: 30px; // ≈1.25 倍
  }

  @include rwd-min('tablet') {
    height: 24px;
    margin-right: 0;
  }
}

.media__row-title {
  font-size: 22px;
  line-height: 36px;
  font-weight: 400;
  // hover 改 font-size 而非 transform：真實佔位，flex 會把作者列往右推
  transition: font-size 0.25s ease;

  .media__row:hover & {
    font-size: 30px; // 20 × 1.51（行高固定 46，列高不跳動）
  }

  @include rwd-min('tablet') {
    font-size: var(--text-h5); // 20
    line-height: 46px;
  }
}

// mob 稿標題固定於「：」後換行（pad 以上單行）
.media__break {
  @include rwd-min('tablet') {
    display: none;
  }
}

// 單位／作者：mob 稿置於標題下方，pad 以上在標題右側自成一欄
//（pad 欄寬 260 允許折行；pc 欄寬 350 單行）
.media__author {
  display: block;
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 300;

  @include rwd-min('tablet') {
    margin-top: 0;
  }

  @include rwd-min('pc') {
    white-space: nowrap;
  }
}

// 箭頭圓鈕：mob 48、pad 40（Figma buttons/Arrow right-circle）；pc 稿沒有
.media__arrow {
  display: block;
  width: 48px;
  height: 48px;
  justify-self: end;
  margin-left: auto;

  @include rwd-min('tablet') {
    width: 36px;
    height: 36px;
  }
}
</style>
