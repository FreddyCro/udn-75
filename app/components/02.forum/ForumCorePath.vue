<!--
  論壇段的可見設計線：每個斷點的線稿都存在 ~/utils/orange-core-config 的 FORUM_PATH[bp]，
  一段一個 ForumPathSeg（line＝可見線的 d、motion＝驅動用中心線、kind 決定吃 fill 還是 stroke）。
  template 是 v-for，故段數不固定 —— pc 是兩段，單一連續線稿也跑得動。
  pc 的 motion 由 scripts/extract-centerline.mjs 從可見線抽出，可見線一旦重貼就必須重跑該腳本。

  驅動線（stroke:none）＝ 各段中心線平移到本層座標系、段間補動態直線連接段，串成單一連續 path，
  由單一 scrub ScrollTrigger 以 getPointAtLength 逐幀定位核心並依切線旋轉（引擎同
  01.hero/OrangeCorePath.vue）。起訖兩端都由路徑幾何推導，不掛 DOM endTrigger。

  ⚠ 對位／改版的完整規則見 architecture/forum-core-path.md（改動前先讀）。
-->
<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ForumPathSeg } from '~/utils/orange-core-config';

const rootEl = ref<HTMLElement | null>(null);
const motionEl = ref<SVGPathElement | null>(null);
const coreEl = ref<HTMLElement | null>(null);

const { setForumPathProgress, setForumPathActive, forumPathRiding } =
  useOrangeCoreProgress();

// 移動速度曲線：把 raw 捲動進度重新映射成路徑進度（見 ~/utils/orange-core-config）。
const easeMove = gsap.parseEase(FORUM_MOVE_EASE) ?? ((v: number) => v);

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

// 路徑核心的外觀與 ForumCore 的橘點共用同一份設定：交棒點兩顆重合，尺寸或顏色不同會看到縮一下。
const coreStyle = {
  width: `${CORE.dotSize}px`,
  height: `${CORE.dotSize}px`,
  background: `rgb(${CORE.orange.join(', ')})`,
};

let st: ScrollTrigger | null = null;
// 驅動線總長：僅在 build() 幾何重建時量測一次，scrub 每幀直接複用（避免 getTotalLength 熱路徑）。
let motionLen = 0;
// 驅動線末端的容器 y：ScrollTrigger 的 end 讀它（見 onMounted）。
let lineEndY = 0;

// 依錨點量測，算出每段 svg 的平移量（只平移、不縮放），並回傳給 build() 建驅動線。
// ⚠ 只在 mount／字體就緒／refresh／斷點改變時量一次並鎖住：錨點捲離視窗後逐幀讀 rect
// 會讓圖層跟著跑掉。
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

// 沒有可跑的驅動線時清空：核心藏起來，橘點回到原本的 coreOut 淡出（見 forumCoreDotVisible）。
// ⚠ progress 也要歸零，不能只清 active：從 pc 切到 pad/mob 時它會留著上一個斷點的殘值，
//   forumPathRiding 因此卡在 true —— 路徑核心保持可見，而 place() 已因 motionLen=0 提早
//   return，方塊就停在最後一次的 transform 上，變成論壇段裡一顆不會動的橘方塊。
function reset() {
  motionEl.value?.removeAttribute('d');
  motionLen = 0;
  lineEndY = 0;
  setForumPathActive(false);
  setForumPathProgress(0);
}

// 依當前版面重建驅動線：各段中心線平移到本層座標系 → 段間補直線連接段 → 串成單一連續 path。
// 曲線段只被平移、形狀尺寸不變，故尾端永遠精準咬住錨點；連接段長度隨錨點的實際距離變化。
function build() {
  const motion = motionEl.value;
  if (!motion) return;

  const list = segs.value;
  // 該斷點沒有線稿（pad / mob 目前是空陣列）→ 不建驅動線。
  if (!list.length) return reset();

  const placements = layout();
  // motion 先過 normalizeD：Figma 匯出常有 V / H，它們只帶單一座標，會讓 translateD 的
  // x/y 交替假設整條錯位而且不報錯（見 ~/utils/forum-path-geometry 的檔頭）。
  const ds = list.map((seg, i) => {
    const p = placements[i];
    return p ? translateD(normalizeD(seg.motion), p.tx, p.ty) : null;
  });
  if (ds.some((d) => d === null)) return reset();

  const d = joinSegments(ds as string[]);
  motion.setAttribute('d', d);
  motionLen = motion.getTotalLength();
  lineEndY = lastPoint(d)[1];
  setForumPathActive(true);

  place(st ? st.progress : 0);
}

// 依 raw 捲動進度把核心定位到驅動線上的點，並轉到該處的路徑切線方向（雲霄飛車感）。
// 先過 easeMove 得路徑進度 p 再定位；切線由前後各取 1px 的鄰近點連線求得，兩端皆穩定
// （不會因 eps=0 歸零）。p 同時寫回全域軌，故交棒判定與定位一致。
function place(rawP: number) {
  const core = coreEl.value;
  const motion = motionEl.value;
  if (!core || !motion || !motionLen) return;
  const p = easeMove(rawP);
  const len = p * motionLen;
  const pt = motion.getPointAtLength(len);
  const d = 1; // 取樣間距（px）
  const behind = motion.getPointAtLength(Math.max(0, len - d));
  const ahead = motion.getPointAtLength(Math.min(motionLen, len + d));
  const angle =
    (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
  gsap.set(core, { x: pt.x, y: pt.y, rotation: angle });
  setForumPathProgress(p);
}

let mqPc: MediaQueryList | null = null;
let mqPad: MediaQueryList | null = null;

// 斷點改變 → 換線稿 → 必須等 v-for 換完 DOM 才能量測，故先 await nextTick()，
// 再由 refresh 觸發 refreshInit → build()（同時重算 ScrollTrigger 的 start / end）。
async function onBpChange() {
  const next = detectBp();
  if (next === bp.value) return;
  bp.value = next;
  await nextTick();
  ScrollTrigger.refresh();
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);
  bp.value = detectBp();
  mqPc = window.matchMedia(`(min-width: ${PC_BREAKPOINTS}px)`);
  mqPad = window.matchMedia(`(min-width: ${TABLET_BREAKPOINTS}px)`);
  mqPc.addEventListener('change', onBpChange);
  mqPad.addEventListener('change', onBpChange);

  await nextTick(); // 等第一次把 svg 渲染出來再量
  gsap.set(coreEl.value, { xPercent: -50, yPercent: -50 }); // 讓 (x,y) 對齊核心中心
  build();

  // 用 .sec2__path 當 trigger 而非 .forum-path：後者未來若被斷點收掉就量不到 rect。
  // 兩者的 top 相同（.forum-path 是 inset: 0 的絕對定位子元素）。
  const trigger = rootEl.value?.closest('.sec2__path') as HTMLElement | null;
  if (!trigger) return; // 理論上不會發生；真的找不到就只保留可見線定位，不建 scrub。

  st = ScrollTrigger.create({
    trigger,
    // 路徑起點在容器 (640, 0)＝黑白接縫，而 ForumCore 的橘點釘在視窗正中央 ——
    // 「容器頂端抵達視窗中央」的那一刻兩者是同一點，交棒不需要任何補償值。
    start: 'top center',
    // 終點同理：路徑末端抵達視窗中央。lineEndY 由 build() 從實際幾何算出，
    // refreshInit → build() 先跑，故每次 refresh 都是最新值。
    // ⚠ 刻意不掛 endTrigger：.forum-event__date 是 position: absolute，量不到有效高度；
    //   也刻意不碰 .sec2 的 bottom —— 上游 SymbolScene 的 pin-spacer 會撐高它，變成循環依賴。
    end: () => `top+=${lineEndY} center`,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => place(self.progress),
  });

  ScrollTrigger.addEventListener('refreshInit', build);
  // 字體載入會改變文字高度 → 錨點位移 → 重新量測。resize 由 ScrollTrigger 自己的
  // autoRefreshEvents 涵蓋（預設含 resize），故不另外掛 resize 監聽。
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  ScrollTrigger.refresh();
});

onBeforeUnmount(() => {
  mqPc?.removeEventListener('change', onBpChange);
  mqPad?.removeEventListener('change', onBpChange);
  ScrollTrigger.removeEventListener('refreshInit', build);
  st?.kill();
  st = null;
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

    <!-- 驅動線：stroke:none，只給 getPointAtLength 取樣用，不呈現。 -->
    <svg class="forum-path__motion" xmlns="http://www.w3.org/2000/svg">
      <path ref="motionEl" fill="none" stroke="none" />
    </svg>

    <!-- 路徑核心：p=0（尚未交棒）時必須藏著 —— 它是隨頁面捲動的 absolute 元素，
         若一直可見，段落進場到交棒點之間畫面上會同時有它與中央那顆固定橘點。 -->
    <span
      ref="coreEl"
      class="forum-path__core"
      :class="{ 'is-riding': forumPathRiding }"
      :style="coreStyle"
    />
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

// 驅動線的座標可能超出 svg box（連接段與後段偏移量較大）→ overflow: visible 才不被裁掉。
.forum-path__motion {
  position: absolute;
  inset: 0;
  overflow: visible;
}

// 位置由 place() 逐幀以 gsap transform 寫入；top/left 只是把 transform 的原點釘在容器左上角。
// 顯隱是瞬間的、刻意不加 transition：交棒點上它與 ForumCore 的固定橘點重合（同位置／同尺寸／
// 同色），瞬切看不出來；若淡入，那 0.4s 內兩顆都不是全不透明，反而會看到閃一下。
.forum-path__core {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  opacity: 0;

  &.is-riding {
    opacity: 1;
  }
}
</style>
