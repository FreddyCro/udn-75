<!--
  論壇段的設計線：三個斷點都由 ~/utils/forum-node-path 的 FORUM_PATH_NODES[bp]（waypoint）
  ＋ 執行時的 DOM 量測算出，是**單一連續 path**（只有一個 M），可見線與驅動線吃同一個 d
  （稿的線寬全程 4px 等寬 → 中心線就是可見線本身）。

  由單一 scrub ScrollTrigger 以 getPointAtLength 逐幀定位核心並依切線旋轉（引擎同
  01.hero/OrangeCorePath.vue）。起訖兩端都由路徑幾何推導，不掛 DOM endTrigger。

  ⚠ 節點資料、每個點掛哪個 element、想調整時怎麼溝通 —— 完整規則見
    architecture/forum-node-path.md（改動前先讀）。

  註：2026-08-08 之前 pc 前半段是「手貼 Figma 匯出的 d ＋ 整段平移」（FORUM_PATH.pc ＋
  layout()），與 pad / mob 的 waypoint 並存兩套機制。已統一為 waypoint，實測新舊線最大偏差
  2.55px、平均 1.21px。取回舊實作：git show fbaa59e -- 本檔 app/utils/orange-core-config.ts
-->
<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ForumPathMeasure, ForumPathNode } from '~/utils/forum-node-path';
import type { ArcKnot } from '~/utils/forum-path-geometry';

const rootEl = ref<HTMLElement | null>(null);
const motionEl = ref<SVGPathElement | null>(null);
const coreEl = ref<HTMLElement | null>(null);
// 可見線：整條由 waypoint 算出來，故只有一個 <path>。
const genEl = ref<SVGPathElement | null>(null);

const { setForumPathProgress, setForumPathActive, forumPathRiding } =
  useOrangeCoreProgress();

// 回中節點的間距吃視窗高 —— 用單一來源，不讓它隨網址列收合而改變密度。
const { vhPx } = useViewportHeight();

// 移動速度曲線：把 raw 捲動進度重新映射成路徑進度（見 ~/utils/orange-core-config）。
const easeMove = gsap.parseEase(FORUM_MOVE_EASE) ?? ((v: number) => v);

// bp 初值刻意是 null：SSR 與 client 首次渲染都不產出任何線，掛載後才量測並渲染。
// 這一層是純裝飾（aria-hidden）、位置全靠 JS 量測，SSR 產出沒有意義，猜錯斷點還會 hydration mismatch。
const bp = ref<'pc' | 'pad' | 'mob' | null>(null);
const nodes = computed<ForumPathNode[] | null>(() =>
  bp.value ? (FORUM_PATH_NODES[bp.value] ?? null) : null
);

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
// 設計線的長度。切線只在這一段取樣，也用來換算 forumPathProgress。
let pathLen = 0;
// 設計線末端的容器 y（＝路徑段的終點）。
let lineEndY = 0;
// ScrollTrigger 的 end 讀它。整條 waypoint 已走到段落底，故等於 lineEndY。
let tailEndY = 0;
// 回中節點表（容器 y ↔ 弧長）：place() 靠它把核心留在視窗中央附近，見 buildArcKnots。
// 與 motionLen 同時在 build() 建立一次，scrub 每幀只做內插。
let knots: ArcKnot[] = [];

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
  knots = [];
  setForumPathActive(false);
  setForumPathProgress(0);
}

// 重建回中節點表。必須在 motionLen / tailEndY 都定案之後呼叫。
// 間距吃視窗高：畫面越矮，容許的偏移越小，節點就越密（見 FORUM_CENTER_KNOT_VH）。
// 取樣 512 點 ＝ 每 ~26px 弧長一點（mob 最長 13429），只在 build() 跑，不在熱路徑上。
function syncKnots(motion: SVGPathElement) {
  knots = buildArcKnots(
    motionLen,
    tailEndY,
    vhPx(FORUM_CENTER_KNOT_VH),
    (len) => motion.getPointAtLength(len).y,
  );
}

// ── 整條線由 waypoint 算出（三個斷點共用）─────────────────────────────
// 稿的寬度只是一個點、斷點卻是一段區間，而 pad / mob 的版面是流排版（.forum-event 退回
// flex 直排），垂直位置隨字數／字體一起變 —— 所以線必須依 FORUM_PATH_NODES[bp] ＋
// 即時量測算出來，不能寫死。pc 版面雖是絕對定位、錨點很穩，仍走同一套：
// 少一套機制，而且不必再為了「標題行數變了」去重算平移的 offset.y（歷史上改過兩次）。
// 線寬全程 4px 等寬 → **驅動線＝可見線**，同一個 d 餵兩邊。
// ⚠ 完整規則見 architecture/forum-node-path.md。
function buildNodesD(list: ForumPathNode[]) {
  const root = rootEl.value;
  // 錨點的搜尋範圍取 .sec2 而非 .sec2__path：後半段的錨點（論壇四、議程、精彩活動）
  // 都在 .sec2__pin 裡，而座標原點仍是 .forum-path（見 rootRect）。
  // 兩者同屬 .sec2，故一個 querySelector 就涵蓋前後半段。
  const scope = root?.closest('.sec2');
  if (!root || !scope || !list.length) return null;

  // 座標原點取 .forum-path 自身（同 layout()）：它是 inset: 0 的絕對定位子元素，
  // 而 padding box 的上緣就是 .sec2__path 的 border box 上緣 ＝ 黑白接縫。
  const rootRect = root.getBoundingClientRect();

  // 先把所有錨點量完再算，不在中途寫任何 style → 不會觸發強制同步 reflow。
  const measure: ForumPathMeasure = (a) => {
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
    return {
      top: r.top - rootRect.top,
      height: r.height,
      // 橫向也回：掛在 element 上的 x（ForumPathXAnchor）要用。以 .forum-path 為原點，
      // 故議程那種「定寬置中於視窗、與本層不同寬」的元素也算得對。
      left: r.left - rootRect.left,
      width: r.width,
    };
  };

  return buildNodePathD(list, { width: rootRect.width, measure });
}

// 依當前版面重建整條線（前半段＋後半段）。可見線與驅動線吃同一個 d。
function build() {
  const motion = motionEl.value;
  if (!motion) return;
  const list = nodes.value;
  if (!list?.length) return reset();

  const out = buildNodesD(list);
  // 必要錨點量不到就整條放棄 —— 少一個點會讓後面全部接到錯的鄰居身上，靜默變形。
  // （標了 optional 的點量不到不算，產生器會自己跳過並重接。）
  if (!out) return reset();

  genEl.value?.setAttribute('d', out.d);
  motion.setAttribute('d', out.d);
  pathLen = motion.getTotalLength();
  motionLen = pathLen;
  lineEndY = out.endY;
  // 後半段的 waypoint 已經走到段落底（.sec2__pin 的下緣），故不再需要隱形尾段；
  // 「核心留在視窗中央」改由回中節點表保證（見 syncKnots / buildArcKnots）。
  // ⚠ tailEndY 不能留 0 —— ScrollTrigger 的 end 讀它，0 會被 GSAP 夾成 start + 0.01，
  //   捲動尺變零長度、核心一進場就跳到路徑末端。
  tailEndY = lineEndY;
  syncKnots(motion);

  setForumPathActive(true);
  place(st ? st.progress : 0);
}

// 依 raw 捲動進度把核心定位到驅動線上的點，並轉到該處的路徑切線方向（雲霄飛車感）。
// 先過 easeMove 得路徑進度 p 再定位；切線由前後各取 1px 的鄰近點連線求得，兩端皆穩定
// （不會因 eps=0 歸零）。p 同時寫回全域軌，故交棒判定與定位一致。
function place(rawP: number) {
  const core = coreEl.value;
  const motion = motionEl.value;
  if (!core || !motion || !motionLen || !knots.length) return;
  // rawP × tailEndY ＝ 此刻落在視窗中央的容器 y（start / end 都錨在 center，故線性）。
  // 節點表把它換算成弧長 —— 節點上核心精準落在視窗中央，節點之間才照弧長等比走。
  const len = arcAtCenterY(rawP * tailEndY, knots, easeMove);
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

  // 語意維持「設計線走完的比例」，下游的 forumPathRiding 因此不變。
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
    <!-- 可見線：由 build() 寫入 d。座標已在本層座標系，故不需要 left/top。
         描邊 4px（＝稿的線寬），驅動線吃同一個 d。 -->
    <svg v-if="nodes" class="forum-path__gen" xmlns="http://www.w3.org/2000/svg">
      <path ref="genEl" :stroke-width="FORUM_PATH_STROKE" />
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

// 設計線本身是**開發用輔助線**：production 一律不畫，只有 ?pathdebug 才以高對比顯示
// （見下方的 .sec2__path--debug）。核心不受影響 —— 它是產品功能，不是輔助線。
// ⚠️ 稿上的水印值是描邊 `rgba(#000, .1)`；哪天要讓線在 production 現形，把 transparent 換掉即可。
.forum-path__gen {
  position: absolute;
  inset: 0;
  overflow: visible;

  path {
    fill: none;
    stroke: transparent;
  }
}

// ── ?pathdebug：開發時把整條線畫出來 ──────────────────────────────────
// 設計線平常完全不畫（見上方的 transparent），只有帶參數時才以高對比橘現形。
// .sec2__path--debug 由 <Forum> 依 query 掛上（同一個 class 也負責把路徑層提到議程之上）。
// 選擇器的祖先在本元件之外，但 scoped CSS 只會把 data 屬性加在最後一個選擇器上，故成立。
.sec2__path--debug {
  .forum-path__gen path {
    stroke: rgba(255, 90, 0, 0.75);
  }
}

// 驅動線的座標可能超出 svg box → overflow: visible 才不被裁掉。
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
