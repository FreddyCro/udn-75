<script lang="ts" setup>
/**
 * SubpageSection — 子頁內文的單一區塊。結構統一為：小標(title) → 內文(desc) → 圖(img)／得獎項目(awards)／得獎作品(works)。
 * 各元素之間、以及 section 之間的間距，全部走共用 token（--sp-*），四頁一致。
 * 欄寬由內容決定：一般文字用窄欄(630)；含 awards（桂冠）／works（得獎作品）的區塊改用寬欄(1064)。
 *
 * ── 得獎作品「懸浮縮圖」（GlitchImage）──
 *  hover 得獎作品清單的每一列（電腦）／滾動至畫面中央（手機）時，浮出該列縮圖，
 *  以 GlitchImage 跑多階段 glitch reveal。縮圖水平固定在畫面正中央、蓋在文字上層
 *  （不跟隨滑鼠）；垂直依該列在視窗的位置決定顯示於列的上方或下方。
 */
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { Component } from 'vue';
import ShowcaseGallery from '~/components/ShowcaseGallery.vue';
import AiSearch from '~/components/AiSearch.vue';
import AiImageQuiz from '~/components/AiImageQuiz.vue';
import FormulaBlocks from '~/components/FormulaBlocks.vue';
import PhotoPanels from '~/components/PhotoPanels.vue';
import AwardTimeline from '~/components/AwardTimeline.vue';

/** JSON 可嵌入的互動元件白名單（section 的 component 欄位 → 實際元件） */
const EMBEDS: Record<string, Component> = {
  ShowcaseGallery,
  AiSearch,
  AiImageQuiz,
  FormulaBlocks,
  PhotoPanels,
  AwardTimeline,
};

export interface AwardItem {
  name?: string;
  year?: string;
  category?: string;
  variant?: 'gold' | 'dark';
  thumb?: string;
}
export interface AwardWorkItem {
  title?: string;
  desc?: string;
  url?: string;
  /** 懸浮縮圖（單張；與 thumbs 擇一，thumbs 優先） */
  thumb?: string;
  /** 懸浮縮圖多重疊圖（最多 3 張，依序 = 主卡 → 左上小卡 → 右下小卡）
   *  TODO: 影片素材支援待 GlitchImage 加入 <video> 卡片後開通 */
  thumbs?: string[];
}

const props = defineProps<{
  title?: string;
  desc?: string[];
  img?: string;
  /** SVG 圖表（不含副檔名），pcpad / mob 兩斷點，如 /img/news/udn75_chart19_01 */
  chart?: string;
  imgAlt?: string;
  caption?: string;
  awards?: AwardItem[];
  works?: AwardWorkItem[];
  placeholder?: string;
  /** 嵌入的互動元件名（EMBEDS 白名單 key），滿版呈現於該 section 內容之後 */
  component?: string;
  /** 嵌入元件的 props（原樣 v-bind 傳入） */
  componentProps?: Record<string, unknown>;
}>();

// 含桂冠或得獎作品清單的區塊改用寬欄。
const isWide = () => !!(props.awards?.length || props.works?.length);

/* ── 懸浮縮圖狀態（觸發區＝得獎作品清單的每一列）── */
const worksWrap = ref<HTMLElement | null>(null);
const thumbBox = ref<HTMLElement | null>(null);
const thumb = reactive({
  visible: false,
  images: [] as string[],
  key: 0, // 每次觸發 +1 → 強制 GlitchImage 重掛，換列 hover 也必定重播 glitch
  top: 0,
});

const THUMB_GAP = 24; // 縮圖與列的垂直間距（px）

let canHover = false;
let activeIdx = -1; // 觸發中的列，避免重複觸發（手機滾動每 frame 進來）
let onScroll: (() => void) | null = null;

/** 顯示第 i 列的縮圖：水平固定畫面中央（CSS）；
 *  垂直如 tooltip——依該列在視窗（100vh）的位置決定貼列的上方或下方 */
async function activate(i: number, rowEl: HTMLElement) {
  const wrap = worksWrap.value;
  const w = props.works?.[i];
  if (!wrap || !w) return;
  const images = w.thumbs?.length ? w.thumbs : w.thumb ? [w.thumb] : [];
  if (!images.length) return;
  if (i === activeIdx && thumb.visible) return;
  activeIdx = i;

  thumb.images = images; // hover／滾入才設 src → GlitchImage lazy 載入
  thumb.key++; // 重掛 → :active 於 onMounted 自動重播
  thumb.visible = true;

  // 等 GlitchImage 掛載（stage 依 aspect-ratio 即有高度）再量測、決定上下位置
  await nextTick();
  const box = thumbBox.value;
  if (!box) return;
  const wrapRect = wrap.getBoundingClientRect();
  const rowRect = rowEl.getBoundingClientRect();
  const rowCenterY = rowRect.top + rowRect.height / 2;
  // 列在視窗上半 → 縮圖貼列下方；列在下半 → 貼列上方
  const showBelow = rowCenterY < window.innerHeight / 2;
  thumb.top = showBelow
    ? rowRect.bottom - wrapRect.top + THUMB_GAP
    : rowRect.top - wrapRect.top - THUMB_GAP - box.offsetHeight;
}

function deactivate() {
  activeIdx = -1;
  thumb.visible = false; // v-if 卸載 GlitchImage → 內部 rAF／timeline 自行清理
}

/* 電腦：hover 列觸發；離開整個清單才收起 */
function onEnter(i: number, e: Event) {
  if (!canHover) return;
  activate(i, e.currentTarget as HTMLElement);
}
function onLeaveWrap() {
  if (!canHover) return;
  deactivate();
}

/* 手機：滾動至畫面中央的列自動浮出 */
function setupMobile() {
  const wrap = worksWrap.value;
  if (!wrap) return;
  const items = Array.from(wrap.querySelectorAll<HTMLElement>('.award-work'));
  onScroll = () => {
    const cy = window.innerHeight / 2;
    let best = -1;
    let bestD = Infinity;
    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - cy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (best < 0 || bestD > window.innerHeight * 0.5) {
      deactivate();
      return;
    }
    activate(best, items[best]!);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

onMounted(() => {
  if (!props.works?.length) return;
  canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) setupMobile();
});

onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <section
    class="subpage-section"
    :class="{ 'subpage-section--wide': isWide() }"
  >
    <div class="subpage-section__inner">
      <h2 v-if="title" class="subpage-section__title">{{ title }}</h2>

      <div v-if="desc?.length" class="subpage-section__desc">
        <p v-for="(p, i) in desc" :key="i" class="subpage-section__para">
          {{ p }}
        </p>
      </div>

      <figure v-if="img" class="subpage-section__figure">
        <img
          class="subpage-section__img"
          :src="img"
          :alt="imgAlt ?? caption ?? ''"
        />
        <figcaption v-if="caption" class="subpage-section__caption">
          {{ caption }}
        </figcaption>
      </figure>

      <!-- SVG 圖表：PC/平板共用一張 + 手機一張 -->
      <figure v-else-if="chart" class="subpage-section__figure">
        <UPic
          :src="chart"
          ext="svg"
          :srcset="['pcpad', 'mob']"
          default="pcpad"
          :use2x="false"
          :webp="false"
          :alt="imgAlt ?? caption ?? ''"
        />
        <figcaption v-if="caption" class="subpage-section__caption">
          {{ caption }}
        </figcaption>
      </figure>

      <!-- 得獎項目（ART 桂冠 + 文字） -->
      <div v-if="awards?.length" class="subpage-section__awards-wrap">
        <div class="subpage-section__awards">
          <SubpageAward
            v-for="(a, i) in awards"
            :key="i"
            :name="a.name"
            :year="a.year"
            :category="a.category"
            :variant="a.variant"
          />
        </div>
      </div>

      <!-- 得獎作品（一列一列清單）＋ 懸浮縮圖（GlitchImage，hover 每一列觸發） -->
      <div
        v-if="works?.length"
        ref="worksWrap"
        class="subpage-section__works-wrap"
        @mouseleave="onLeaveWrap"
      >
        <!-- 懸浮縮圖：水平固定畫面中央（CSS）、top 由 JS 依列位置貼列的上方或下方。
             多重疊圖走 GlitchImage 預設三卡版面（主卡＋左上／右下小卡） -->
        <div
          ref="thumbBox"
          class="works-thumb"
          :class="{ 'is-visible': thumb.visible }"
          :style="{ top: `${thumb.top}px` }"
          aria-hidden="true"
        >
          <GlitchImage
            v-if="thumb.visible"
            :key="thumb.key"
            :images="thumb.images"
            :active="true"
            :duration="1.2"
            :pieces="16"
            :parallax-amp="0"
            bg-color="#ffffff"
          />
        </div>

        <div class="subpage-section__works">
          <SubpageWork
            v-for="(w, i) in works"
            :key="i"
            :title="w.title"
            :desc="w.desc"
            :url="w.url"
            @mouseenter="onEnter(i, $event)"
          />
        </div>
      </div>

      <!-- 其餘互動／圖表區塊佔位 -->
      <div v-if="placeholder" class="subpage-section__placeholder">
        {{ placeholder }}
      </div>
    </div>

    <!-- 嵌入互動元件：滿版、蓋過右側錨點 rail（z-index 約定，見 SubpageAnchor） -->
    <div
      v-if="component && EMBEDS[component]"
      class="subpage-section__embed"
    >
      <component :is="EMBEDS[component]" v-bind="componentProps" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.subpage-section + .subpage-section {
  margin-top: var(--sp-section);

  @include rwd-tablet {
    margin-top: 56px;
  }
  @include rwd-mobile {
    margin-top: 48px;
  }
}

// 內容欄：一般窄欄(630)置中；寬欄(1064)用於桂冠／得獎作品。
.subpage-section__inner {
  width: 100%;
  max-width: var(--subpage-content-w);
  margin: 0 auto;
  padding: 0 20px;
}

.subpage-section--wide .subpage-section__inner {
  max-width: var(--subpage-wide-w);
}

.subpage-section__title {
  margin: 0;
  font-size: var(--text-h3);
  line-height: var(--text-h3--line-height);
  font-weight: 400;

  @include rwd-mobile {
    font-size: var(--text-h4);
    line-height: var(--text-h4--line-height);
  }
}

.subpage-section__title + .subpage-section__desc {
  margin-top: var(--sp-title-desc);
}

.subpage-section__para {
  margin: 0;
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;

  & + & {
    margin-top: var(--sp-para);
  }
}

// 圖／得獎項目／得獎作品：接在內文或小標之後都拉開 --sp-desc-img。
.subpage-section__desc + .subpage-section__figure,
.subpage-section__title + .subpage-section__figure,
.subpage-section__desc + .subpage-section__awards-wrap,
.subpage-section__title + .subpage-section__awards-wrap,
.subpage-section__desc + .subpage-section__works-wrap,
.subpage-section__title + .subpage-section__works-wrap,
.subpage-section__awards-wrap + .subpage-section__works-wrap {
  margin-top: var(--sp-desc-img);
}

.subpage-section__figure {
  margin: 0;
}

.subpage-section__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.subpage-section__caption {
  margin-top: var(--sp-img-caption);
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: var(--color-gray);
}

// 得獎項目：桂冠 grid 置中
.subpage-section__awards-wrap {
  max-width: var(--subpage-awards-w);
  margin: 0 auto;
}

.subpage-section__awards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px 24px;
  padding: 0;
  list-style: none;

  @include rwd-tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  @include rwd-mobile {
    grid-template-columns: 1fr;
  }
}

/* ── 懸浮縮圖（GlitchImage）── */
// 水平固定在畫面正中央（works 欄置中於視窗 → left: 50% 即視窗中線）；
// top 由 JS 依 hover 列的畫面位置設在該列上方或下方。
// 蓋在列文字之上（不再穿透文字），pointer-events: none 不擋列的 hover。
.works-thumb {
  position: absolute;
  left: 50%;
  z-index: 4; // 分隔線(z1) < 列文字(z3) < 縮圖(z4)
  width: var(--thumb-w, min(560px, 48vw)); // 多卡疊圖版面，主卡約佔 60%
  transform: translateX(-50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease; // 快速淡入，重播交給 GlitchImage

  @include rwd-mobile {
    --thumb-w: 280px;
  }
}

.works-thumb.is-visible {
  opacity: 1;
}

// 得獎作品：wrap 建立獨立堆疊脈絡（分隔線 < 文字 < 縮圖）
.subpage-section__works-wrap {
  position: relative;
  z-index: 0;
}

.subpage-section__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
  text-align: center;
  color: var(--color-gray);
  border: 1px dashed var(--color-line);
  background: var(--color-bg-muted);
}

// 嵌入互動元件：滿版區塊。position + z-index + 不透明背景 → 捲過時
// 蓋過右側錨點 rail（rail z-index: 1，見 SubpageAnchor 的約定）
.subpage-section__embed {
  position: relative;
  z-index: 2;
  margin-top: var(--sp-desc-img);
  background: #fff;
}
</style>
