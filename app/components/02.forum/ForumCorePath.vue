<!--
  論壇段的可見設計線：每個斷點的線稿都存在 ~/utils/orange-core-config 的 FORUM_PATH[bp]，
  一段一個 ForumPathSeg（line＝可見線的 d、motion＝驅動用中心線、kind 決定吃 fill 還是 stroke）。
  template 是 v-for，故段數不固定 —— pc 是兩段，單一連續線稿也跑得動。
  pc 的 motion 由 scripts/extract-centerline.mjs 從可見線抽出，可見線一旦重貼就必須重跑該腳本。
  ⚠ 對位／改版的完整規則見 architecture/forum-core-path.md（改動前先讀）。
  🚧 驅動線（stroke:none）＋ scrub 逐幀定位核心的引擎尚未接上，做法照 01.hero/OrangeCorePath.vue
     （曲線版見 `git show 7ff9f19:app/components/01.hero/OrangeCorePath.vue`）。
-->
<script setup lang="ts">
import type { ForumPathSeg } from '~/utils/orange-core-config';

const rootEl = ref<HTMLElement | null>(null);

// 目前只有 pc 有線稿；pad / mob 是空陣列 → 什麼都不渲染（見 FORUM_PATH 的骨架註解）。
// bp 初值刻意是 null：SSR 與 client 首次渲染都不產出任何線，掛載後才量測並渲染。
// 這一層是純裝飾（aria-hidden）、位置全靠 JS 量測，SSR 產出沒有意義；而三個斷點的
// 線段數不同（pc 兩段、pad 稿是單一連續線），SSR 猜錯斷點就會 hydration mismatch。
const bp = ref<'pc' | 'pad' | 'mob' | null>(null);
const segs = computed<ForumPathSeg[]>(() => (bp.value ? FORUM_PATH[bp.value] : []));

// 用 constants 的斷點值，不用 ~/utils/get-device 的 getDeviceTypeByResolution()——
// 後者的 pad/pc 界線是 1023，與本專案設計稿的 1280 不合。
function detectBp(): 'pc' | 'pad' | 'mob' {
  if (window.matchMedia(`(min-width: ${PC_BREAKPOINTS}px)`).matches) return 'pc';
  if (window.matchMedia(`(min-width: ${TABLET_BREAKPOINTS}px)`).matches) return 'pad';
  return 'mob';
}

// 依錨點量測，算出每段 svg 的平移量（只平移、不縮放），並回傳給呼叫端（Task 6 的驅動線複用）。
// ⚠ 只在 mount／字體就緒／斷點改變時量一次並鎖住：錨點捲離視窗後逐幀讀 rect 會讓圖層跟著跑掉。
// 用 querySelectorAll 取各段 svg 而非 v-for 的 ref 陣列：Vue 明確不保證 ref 陣列的順序與來源
// 陣列一致，而這裡的索引必須精準對應 segs[i]（錯位會靜默把別段的平移量套上去）。
// DOM 順序就是 v-for 順序，所以 querySelectorAll 反而是可靠的那個。
// 回傳定長陣列（長度恆等於 segs.length）：量不到錨點的段落填 null，而不是整段略過不 push——
// 否則消費端會看到索引被壓縮，把「別段的平移量」誤當成這段的，造成靜默錯位。
function layout(): ({ tx: number; ty: number } | null)[] {
  const segments = segs.value;
  const root = rootEl.value;
  if (!root) return segments.map(() => null);
  const rootRect = root.getBoundingClientRect();
  // 用 closest 往上找 .sec2__path，而非假設 root.parentElement 剛好就是它——
  // <ForumCorePath /> 若被多包一層 div，parentElement 會找錯目標而靜默失敗。
  // 錨點在這個範圍內用 data-forum-anchor 具名選取（見下方 querySelector）。
  const scope = root.closest('.sec2__path');
  const els = root.querySelectorAll<SVGSVGElement>('.forum-path__raw');

  // 先把每段錨點的 rect 讀完，再統一寫入 style：避免 read → write → read 交錯，觸發強制同步 reflow。
  const placements = segments.map((seg, i) => {
    const el = els[i];
    const anchor = scope?.querySelector<HTMLElement>(
      `[data-forum-anchor="${seg.anchor}"]`
    );
    if (!el || !anchor) return null;
    const a = anchor.getBoundingClientRect();
    return {
      el,
      tx: a.left - rootRect.left + seg.offset.x,
      ty: a.top - rootRect.top + seg.offset.y,
    };
  });

  placements.forEach((p) => {
    if (!p) return;
    p.el.style.left = `${p.tx}px`;
    p.el.style.top = `${p.ty}px`;
  });
  return placements.map((p) => (p ? { tx: p.tx, ty: p.ty } : null));
}

let mqPc: MediaQueryList | null = null;
let mqPad: MediaQueryList | null = null;

// 斷點改變 → 換線稿 → 必須等 v-for 換完 DOM 才能量測，故先 await nextTick()。
async function onBpChange() {
  const next = detectBp();
  if (next === bp.value) return;
  bp.value = next;
  await nextTick();
  layout();
}

onMounted(async () => {
  bp.value = detectBp();
  mqPc = window.matchMedia(`(min-width: ${PC_BREAKPOINTS}px)`);
  mqPad = window.matchMedia(`(min-width: ${TABLET_BREAKPOINTS}px)`);
  mqPc.addEventListener('change', onBpChange);
  mqPad.addEventListener('change', onBpChange);

  await nextTick(); // 等第一次把 svg 渲染出來再量
  layout();
  // 字體載入會改變文字高度 → 錨點位移 → 重新量測。
  document.fonts?.ready.then(layout);
});

onBeforeUnmount(() => {
  mqPc?.removeEventListener('change', onBpChange);
  mqPad?.removeEventListener('change', onBpChange);
});
</script>

<template>
  <div ref="rootEl" class="forum-path" aria-hidden="true">
    <svg
      v-for="(seg, i) in segs"
      :key="i"
      class="forum-path__raw"
      :width="seg.w"
      :height="seg.h"
      :viewBox="`0 0 ${seg.w} ${seg.h}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="forum-path__line"
        :class="`forum-path__line--${seg.kind}`"
        :d="seg.line"
        :stroke-width="seg.kind === 'stroke' ? seg.strokeWidth : undefined"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.forum-path {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// 位置由 <script> 的 layout() 依錨點量測寫入 left/top（只平移、不縮放）。
.forum-path__raw {
  position: absolute;
  display: block;
}

// Figma 匯出的描邊有兩種形態：outline（描邊被展開成填色路徑）吃 fill、stroke（真描邊）吃 stroke。
// 匯出自帶的 opacity 與 #898989 / black 一律不採用，統一吃這裡的顏色。
.forum-path__line {
  &--outline {
    fill: var(--accent);
  }

  &--stroke {
    fill: none;
    stroke: var(--accent);
  }
}
</style>
