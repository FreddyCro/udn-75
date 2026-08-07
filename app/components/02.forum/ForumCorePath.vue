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
import type { MobPathMeasure } from '~/utils/forum-mob-path';

const rootEl = ref<HTMLElement | null>(null);
const motionEl = ref<SVGPathElement | null>(null);
const coreEl = ref<HTMLElement | null>(null);
const slashEl = ref<SVGLineElement | null>(null);
// mob 專用：整條線由 waypoint 算出來，故只有一個 <path>（見下方 buildMob）。
const genEl = ref<SVGPathElement | null>(null);

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
// 驅動線總長（含尾段）：僅在 build() 幾何重建時量測一次，scrub 每幀直接複用。
let motionLen = 0;
// 追加尾段**之前**的長度。分段映射用它切「路徑段 / 尾段」，也用來換算 forumPathProgress。
let pathLen = 0;
// 設計線末端的容器 y（＝路徑段的終點）。
let lineEndY = 0;
// 尾段末端的容器 y（＝議程底緣）。ScrollTrigger 的 end 讀它。無尾段時等於 lineEndY。
let tailEndY = 0;
// 那一撇（＝直線連接段）在驅動線上的弧長區間，place() 用它算 dashoffset。len 為 0 表示沒有
// 連接段（單段線稿，如 pad 的 Vector 276）→ 不畫斜線。
let slash = { startLen: 0, len: 0 };

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

// 尾段終點（容器 y）＝ 議程底緣。議程不在 .sec2__path 裡，但 rect 跨子樹可用；
// 量不到就回 null → 不建尾段，行為退回改動前。
function measureTailEndY(): number | null {
  const root = rootEl.value;
  const agenda = document.querySelector('[data-core-tail-end]');
  if (!root || !agenda) return null;
  return agenda.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
}

// 沒有可跑的驅動線時清空：核心藏起來，橘點回到原本的 coreOut 淡出（見 forumCoreDotVisible）。
// ⚠ progress 也要歸零，不能只清 active：從 pc 切到 pad/mob 時它會留著上一個斷點的殘值，
//   forumPathRiding 因此卡在 true —— 路徑核心保持可見，而 place() 已因 motionLen=0 提早
//   return，方塊就停在最後一次的 transform 上，變成論壇段裡一顆不會動的橘方塊。
function reset() {
  motionEl.value?.removeAttribute('d');
  motionLen = 0;
  pathLen = 0;
  lineEndY = 0;
  tailEndY = 0;
  slash = { startLen: 0, len: 0 };
  drawSlash(0);
  setForumPathActive(false);
  setForumPathProgress(0);
}

// 那一撇的「畫出多少」：0 完全沒出現、1 整條畫完。用 dashoffset 而非改 x2/y2，
// 幾何才只在 build() 算一次。
function drawSlash(t: number) {
  const el = slashEl.value;
  if (!el) return;
  el.style.strokeDasharray = `${slash.len}`;
  el.style.strokeDashoffset = `${slash.len * (1 - t)}`;
}

// 依當前版面重建驅動線：各段中心線平移到本層座標系 → 段間補直線連接段 → 串成單一連續 path。
// 曲線段只被平移、形狀尺寸不變，故尾端永遠精準咬住錨點；連接段長度隨錨點的實際距離變化。
function build() {
  const motion = motionEl.value;
  if (!motion) return;

  // mob 走產生器：整條線依 waypoint 即時算出，不吃 FORUM_PATH（見 buildMob）。
  if (bp.value === 'mob') return buildMob(motion);

  const list = segs.value;
  // 該斷點沒有線稿（pad 目前是空陣列）→ 不建驅動線。
  if (!list.length) return reset();

  const placements = layout();
  // motion 先過 normalizeD：Figma 匯出常有 V / H，它們只帶單一座標，會讓 translateD 的
  // x/y 交替假設整條錯位而且不報錯（見 ~/utils/forum-path-geometry 的檔頭）。
  const ds = list.map((seg, i) => {
    const p = placements[i];
    return p ? translateD(normalizeD(seg.motion), p.tx, p.ty) : null;
  });
  if (ds.some((d) => d === null)) return reset();

  const list2 = ds as string[];
  // 先只放第一段量弧長，再換成完整路徑 —— 為了知道「連接段從驅動線的哪個弧長開始」。
  // 借用同一個 <path> 而不另開元素：build() 只在幾何重建時跑，三次 setAttribute 不在熱路徑上。
  motion.setAttribute('d', list2[0]!);
  const firstLen = motion.getTotalLength();

  const d = joinSegments(list2);
  motion.setAttribute('d', d);
  pathLen = motion.getTotalLength();
  lineEndY = lastPoint(d)[1];

  // 隱形尾段：從設計線末端直下到議程底緣。核心在這一段恆停在視窗中央，
  // 由議程（.sec2__pin 的不透明白底）從上方咬住它 —— 全程看不見，故不需要淡出。
  const tail = measureTailEndY();
  tailEndY = tail !== null && tail > lineEndY ? tail : lineEndY;
  motion.setAttribute(
    'd',
    tailEndY > lineEndY ? appendTail(d, lastPoint(d)[0], tailEndY) : d,
  );
  motionLen = motion.getTotalLength();

  // 那一撇 ＝ seg1 末端 → seg2 起點 的直線連接段（不寫死幾何，故核心永遠沿著它走）。
  // 只有恰好兩段時才有單一連接段；單段線稿（pad 的 Vector 276）沒有 → 不畫。
  const line = slashEl.value;
  if (line && list2.length === 2) {
    const [ax, ay] = lastPoint(list2[0]!);
    const [bx, by] = firstPoint(list2[1]!);
    line.setAttribute('x1', `${ax}`);
    line.setAttribute('y1', `${ay}`);
    line.setAttribute('x2', `${bx}`);
    line.setAttribute('y2', `${by}`);
    slash = { startLen: firstLen, len: Math.hypot(bx - ax, by - ay) };
  } else {
    slash = { startLen: 0, len: 0 };
  }

  setForumPathActive(true);
  place(st ? st.progress : 0);
}

// ── mob：整條線由 waypoint 算出 ───────────────────────────────────────
// 稿是 414 寬、線本來就撞到左右緣，而 pc 那套「整段平移不縮放」在 320 寬會超出畫面 94px；
// 加上 mob 版面是流排版（.forum-event 退回 flex 直排），垂直位置隨字數／字體一起變。
// 故 mob 不吃 FORUM_PATH，改由 FORUM_MOB_NODES ＋ 即時量測算出單一連續 path。
// 線寬全程 4px 等寬 → **驅動線＝可見線**，同一個 d 餵兩邊，不必跑 extract-centerline.mjs。
// ⚠ 完整規則見 architecture/forum-mob-path.md。
function buildMob(motion: SVGPathElement) {
  const root = rootEl.value;
  const scope = root?.closest('.sec2__path');
  if (!root || !scope) return reset();

  // 座標原點取 .forum-path 自身（同 layout()）：它是 inset: 0 的絕對定位子元素，
  // 而 padding box 的上緣就是 .sec2__path 的 border box 上緣 ＝ 黑白接縫。
  const rootRect = root.getBoundingClientRect();

  // 先把所有錨點量完再算，不在中途寫任何 style → 不會觸發強制同步 reflow。
  const measure: MobPathMeasure = (a) => {
    // 限定在某一場之內時，以該場的日期錨點往上找 .forum-event 當 scope ——
    // 用具名的 data-forum-anchor 而非 querySelectorAll 索引，增刪／重排場次都不會錯位
    // （理由同 forum-core-path.md「錨點是具名的，不是索引」）。
    const base = a.event
      ? scope
          .querySelector(`[data-forum-anchor="${a.event}"]`)
          ?.closest('.forum-event')
      : scope;
    if (!base) return null;
    // scope 自己也可能就是目標（P0 掛的是 .sec2__path 本身）→ 先試 matches 再往下查。
    const el = base.matches(a.sel)
      ? base
      : base.querySelectorAll<HTMLElement>(a.sel)[a.nth ?? 0];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top - rootRect.top, height: r.height };
  };

  const out = buildNodePathD(FORUM_MOB_NODES, {
    width: rootRect.width,
    measure,
  });
  // 任何一個錨點量不到就整條放棄 —— 少一個點會讓後面全部接到錯的鄰居身上，靜默變形。
  if (!out) return reset();

  // 可見線只吃路徑段（尾段刻意不可見，見下）。
  genEl.value?.setAttribute('d', out.d);

  motion.setAttribute('d', out.d);
  pathLen = motion.getTotalLength();
  lineEndY = out.endY;

  // 隱形尾段：與 pc 分支同一套機制 —— 從設計線末端直下到議程底緣，核心在這段恆停在
  // 視窗中央、由議程的不透明白底從上方咬住。ScrollTrigger 的 end 讀 tailEndY，
  // ⚠ 沒設它的話 end 會解析成 `top+=0 center`，被 GSAP 夾成 start + 0.01
  //   → 捲動尺零長度、核心一進場就跳到路徑末端。
  const tail = measureTailEndY();
  tailEndY = tail !== null && tail > lineEndY ? tail : lineEndY;
  if (tailEndY > lineEndY) {
    motion.setAttribute('d', appendTail(out.d, lastPoint(out.d)[0], tailEndY));
  }
  motionLen = motion.getTotalLength();

  // 單段線稿沒有連接段 → 論壇二那一撇不畫（mob 稿的 09/15 斜線是靜態圖稿）。
  slash = { startLen: 0, len: 0 };
  drawSlash(0);

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
  // rawP × tailEndY ＝ 此刻落在視窗中央的容器 y（start / end 都錨在 center，故線性）。
  const len = arcAtCenterY(rawP * tailEndY, lineEndY, pathLen, easeMove);
  const pt = motion.getPointAtLength(len);
  const d = 1; // 取樣間距（px）
  // 切線只在路徑段取樣：尾段是垂直的（90°），而設計線末端的切線是 112°，若讓尾段參與取樣，
  // 核心會在接縫處約 2px 捲動內轉正 22° —— 而那正是它唯一露臉的時刻（交接窗 43.5px）。
  // 尾段全程被議程遮住，旋轉停在設計線末端的角度即可。無尾段時 pathLen === motionLen，逐字等價。
  const tanLen = Math.min(len, pathLen || motionLen);
  const behind = motion.getPointAtLength(Math.max(0, tanLen - d));
  const ahead = motion.getPointAtLength(Math.min(pathLen || motionLen, tanLen + d));
  const angle =
    (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
  gsap.set(core, { x: pt.x, y: pt.y, rotation: angle });

  // 那一撇隨核心推進逐段畫出：核心還沒走到連接段起點 → 0（完全沒出現）；
  // 走完連接段 → 1（整條畫完），之後核心從尾端接上 seg2。往回捲自然收回。
  if (slash.len) {
    drawSlash(Math.min(1, Math.max(0, (len - slash.startLen) / slash.len)));
  }

  // 語意維持「設計線走完的比例」（尾段一律 1），下游的 forumPathRiding 因此不變。
  setForumPathProgress(pathLen ? Math.min(1, len / pathLen) : 0);
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
    // 終點：尾段末端（議程底緣）抵達視窗中央。tailEndY 由 build() 從實際幾何算出，
    // refreshInit → build() 先跑，故每次 refresh 都是最新值。
    // ⚠ 刻意不掛 endTrigger：.forum-event__date 是 position: absolute，量不到有效高度；
    //   也刻意不碰 .sec2 的 bottom —— 上游 SymbolScene 的 pin-spacer 會撐高它，變成循環依賴。
    end: () => `top+=${tailEndY} center`,
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

    <!-- mob 的可見線：由 buildMob() 寫入 d。座標已在本層座標系，故不需要 left/top。
         描邊 4px（＝稿的 outline 帶寬），驅動線吃同一個 d。 -->
    <svg
      v-if="bp === 'mob'"
      class="forum-path__gen"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path ref="genEl" :stroke-width="FORUM_MOB_STROKE" />
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

    <!-- 論壇二 09/15 的那一撇：幾何就是驅動線的連接段（由 build() 寫入 x1/y1/x2/y2），
         隨核心推進以 dashoffset 逐段畫出。放在核心之後 → 畫在核心之上。 -->
    <svg class="forum-path__slash" xmlns="http://www.w3.org/2000/svg">
      <line ref="slashEl" :stroke="FORUM_SLASH.color" :stroke-width="FORUM_SLASH.width" />
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
    fill: rgba(#000, 0.03);
  }

  &--stroke {
    fill: none;
    stroke: var(--accent);
  }
}

// mob 的可見線：整條在同一個座標系，故 svg 直接鋪滿本層。線色取稿的「黑 10%」
// （pc 的 outline 是黑 3%；mob 是 4px 描邊，較細故較深）。
.forum-path__gen {
  position: absolute;
  inset: 0;
  overflow: visible;

  path {
    fill: none;
    stroke: rgba(#000, 0.1);
  }
}

// 驅動線的座標可能超出 svg box（連接段與後段偏移量較大）→ overflow: visible 才不被裁掉。
.forum-path__motion {
  position: absolute;
  inset: 0;
  overflow: visible;
}

// 那一撇：與驅動線同一個座標系（都是 .forum-path 的 inset: 0 子元素），故 build() 算出的
// 連接段端點可以直接當 x1/y1/x2/y2 用。linecap 用預設的 butt —— 設計稿的端點切口正是
// 垂直於脊線（見 FORUM_SLASH 註解的解析）。
.forum-path__slash {
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
