<script lang="ts" setup>
/**
 * SubpageWorks — 「得獎作品」清單（visual / service 頁）＋懸浮縮圖（GlitchImage）。
 * ≥1280 hover 列觸發、<1280 滾至畫面中央的列自動浮出。
 * 獨立元件，供頁面以預設 slot 排版時直接使用（原為 JSON 驅動版型的一部分）。
 */
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';

export interface SubpageWorkItem {
  title?: string;
  desc?: string;
  url?: string;
  /** 懸浮縮圖（單張；與 thumbs 擇一，thumbs 優先） */
  thumb?: string;
  /** 懸浮縮圖多重疊圖（最多 3 張，依序對應 thumbLayout 的 slot）。
   *  .mp4 結尾 = 影片：GlitchImage 以第一格 poster 跑 glitch，結束後接播影片 */
  thumbs?: string[];
  /** 縮圖舞台寬（px；未給時走 CSS 預設） */
  thumbW?: number;
  /** 縮圖舞台寬高比（w / h；未給時走 GlitchImage 預設） */
  thumbRatio?: number;
  /** 各張縮圖的版面 slot（x/y/w 為舞台寬高 %、z 疊序；未給時走預設三卡版面） */
  thumbLayout?: { x: number; y: number; w: number; z?: number }[];
}

const props = defineProps<{ works: SubpageWorkItem[] }>();

// locales JSON 存的是站台根路徑（/img/...），縮圖是 runtime 才綁上 :src → 需自行前綴，
// 否則部署到子路徑／CDN 時瀏覽器會解析到 origin 根目錄而 404。
const assetUrl = useAssetUrl();

/* ── 懸浮縮圖狀態（觸發區＝得獎作品清單的每一列）── */
const worksWrap = ref<HTMLElement | null>(null);
const thumbBox = ref<HTMLElement | null>(null);
const thumb = reactive({
  visible: false,
  images: [] as string[],
  key: 0, // 每次觸發 +1 → 強制 GlitchImage 重掛（首次觸發播 glitch，已播過的列走 instant）
  instant: false, // 該列已播過 glitch → 重掛後直接顯示完成態
  top: 0,
  // per-work 版面（null = 走預設）
  w: null as number | null,
  ratio: null as number | null,
  layout: null as { x: number; y: number; w: number; z?: number }[] | null,
});

const THUMB_GAP = 24; // 縮圖與列的垂直間距（px）
const PC_BREAKPOINT = 1280;

let hoverMode = false; // ≥1280 = hover 觸發；<1280 = 滾動觸發
// 觸發中的列：避免重複觸發（滾動模式每 frame 進來）；
// 同時傳給 SubpageWork，<1280 由它展開說明與「點擊看專題」
const activeIdx = ref(-1);
// 已播過 glitch 的列：每列只播一次，之後再觸發直接顯示完成態
const playedIdx = new Set<number>();
let onScroll: (() => void) | null = null;
let mq: MediaQueryList | null = null;

/** 顯示第 i 列的縮圖：水平固定畫面中央（CSS）；
 *  垂直如 tooltip——依該列在視窗（100vh）的位置決定貼列的上方或下方 */
async function activate(i: number, rowEl: HTMLElement) {
  const wrap = worksWrap.value;
  const w = props.works?.[i];
  if (!wrap || !w) return;
  const images = w.thumbs?.length ? w.thumbs : w.thumb ? [w.thumb] : [];
  if (!images.length) return;
  if (i === activeIdx.value && thumb.visible) return;
  activeIdx.value = i;

  thumb.images = images.map(assetUrl); // hover／滾入才設 src → GlitchImage lazy 載入
  thumb.w = w.thumbW ?? null;
  thumb.ratio = w.thumbRatio ?? null;
  thumb.layout = w.thumbLayout ?? null;
  thumb.instant = playedIdx.has(i); // 已播過 → 直接顯示完成態，不重播 glitch
  playedIdx.add(i);
  thumb.key++; // 重掛 → :active 於 onMounted 自動觸發（播 glitch 或 instant 顯示）
  thumb.visible = true;

  // 等 GlitchImage 掛載（stage 依 aspect-ratio 即有高度）再量測、決定上下位置
  await nextTick();
  const box = thumbBox.value;
  if (!box) return;
  const wrapRect = wrap.getBoundingClientRect();
  const rowRect = rowEl.getBoundingClientRect();
  // 說明是 0fr→1fr 過渡展開，此刻 rect 尚未含展開高度 →
  // 以說明內容高推得展開後的底線位置，縮圖貼線外側才不會蓋到說明
  const descEl = rowEl.querySelector<HTMLElement>('.award-work__desc');
  const descWrap = rowEl.querySelector<HTMLElement>('.award-work__desc-wrap');
  let grow = 0;
  if (descEl && descWrap) {
    const currentH =
      descWrap.getBoundingClientRect().height +
      (parseFloat(getComputedStyle(descWrap).marginTop) || 0);
    // 8 = 展開後 desc-wrap 的 margin-top（見 SubpageWork.vue）
    grow = Math.max(0, descEl.scrollHeight + 8 - currentH);
  }
  const rowBottom = rowRect.bottom + grow;
  const rowCenterY = rowRect.top + (rowRect.height + grow) / 2;
  // 列在視窗上半 → 縮圖貼列下方；列在下半 → 貼列上方（展開向下長，上緣不動）
  const showBelow = rowCenterY < window.innerHeight / 2;
  thumb.top = showBelow
    ? rowBottom - wrapRect.top + THUMB_GAP
    : rowRect.top - wrapRect.top - THUMB_GAP - box.offsetHeight;
}

function deactivate() {
  activeIdx.value = -1;
  thumb.visible = false; // v-if 卸載 GlitchImage → 內部 rAF／timeline 自行清理
}

/* ≥1280：hover 列觸發；離開整個清單才收起 */
function onEnter(i: number, e: Event) {
  if (!hoverMode) return;
  activate(i, e.currentTarget as HTMLElement);
}
function onLeaveWrap() {
  if (!hoverMode) return;
  deactivate();
}

/* <1280：滾動至畫面中央的列自動浮出 */
function setupMobile() {
  const wrap = worksWrap.value;
  if (!wrap) return;
  const items = Array.from(wrap.querySelectorAll<HTMLElement>('.award-work'));
  onScroll = () => {
    const cy = window.innerHeight * 0.3;
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

/** 依視窗寬切換觸發模式（1280 斷點可能因轉向／縮放跨越，需可來回切換） */
function applyMode(wide: boolean) {
  hoverMode = wide;
  deactivate();
  if (onScroll) {
    window.removeEventListener('scroll', onScroll);
    onScroll = null;
  }
  if (!wide) setupMobile();
}

const onMqChange = (e: MediaQueryListEvent) => applyMode(e.matches);

onMounted(() => {
  if (!props.works?.length) return;
  mq = window.matchMedia(`(min-width: ${PC_BREAKPOINT}px)`);
  mq.addEventListener('change', onMqChange);
  applyMode(mq.matches);
});

onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll);
  mq?.removeEventListener('change', onMqChange);
});
</script>

<template>
  <!-- wrap 建立獨立堆疊脈絡（分隔線 < 文字 < 縮圖） -->
  <div ref="worksWrap" class="subpage-works" @mouseleave="onLeaveWrap">
    <!-- 懸浮縮圖：水平置中由 CSS 固定、top 由 activate() 依列位置算出 -->
    <div
      ref="thumbBox"
      class="subpage-works__thumb"
      :class="{ 'is-visible': thumb.visible }"
      :style="[
        { top: `${thumb.top}px` },
        thumb.w ? { '--thumb-w': `${thumb.w}px` } : null,
      ]"
      aria-hidden="true"
    >
      <GlitchImage
        v-if="thumb.visible"
        :key="thumb.key"
        :images="thumb.images"
        :layout="thumb.layout ?? undefined"
        :aspect-ratio="thumb.ratio ?? undefined"
        :active="true"
        :instant="thumb.instant"
        :duration="1.2"
        :pieces="16"
        :parallax-amp="0"
        bg-color="#ffffff"
      />
    </div>

    <div class="subpage-works__list">
      <SubpageWork
        v-for="(w, i) in works"
        :key="i"
        :title="w.title"
        :desc="w.desc"
        :url="w.url"
        :active="activeIdx === i"
        :dimmed="activeIdx !== -1 && activeIdx !== i"
        @mouseenter="onEnter(i, $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.subpage-works {
  position: relative;
  z-index: 0;

  @include rwd-min('tablet') {
    max-width: 530px;
    margin-inline: auto;
  }

  @include rwd-min('pc') {
    max-width: none;
  }
}

// 懸浮縮圖：works 欄置中於視窗 → left: 50% 即視窗中線；top 由 JS 帶入。
.subpage-works__thumb {
  position: absolute;
  left: 50%;
  z-index: 4; // 分隔線(z1) < 列文字(z3) < 縮圖(z4)
  // --thumb-w 由列資料 inline 帶入；vw 上限為窄視窗保底
  width: min(var(--thumb-w, 280px), 80vw);
  transform: translateX(-50%);
  pointer-events: none; // 不擋列的 hover
  opacity: 0;
  transition: opacity 0.18s ease;

  @include rwd-min('tablet') {
    width: min(var(--thumb-w, 560px), 48vw);
  }

  &.is-visible {
    opacity: 1;
  }
}
</style>
