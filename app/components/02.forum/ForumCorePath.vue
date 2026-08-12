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
import { nearestArcLength, type SlashWindow } from '~/utils/forum-slash';
import { refreshScrollTriggers } from '~/utils/scroll-trigger';

const rootEl = ref<HTMLElement | null>(null);
const motionEl = ref<SVGPathElement | null>(null);
const coreEl = ref<HTMLElement | null>(null);
// 彗星尾：可見層固定 dasharray、遮罩層滑動開窗（見模板註解）。
const trailEl = ref<SVGPathElement | null>(null);
const trailMaskEl = ref<SVGMaskElement | null>(null);
const trailMaskPathEl = ref<SVGPathElement | null>(null);
// 可見線：整條由 waypoint 算出來，故只有一個 <path>。
const genEl = ref<SVGPathElement | null>(null);

const {
  setForumPathProgress,
  setForumPathActive,
  setForumSlashWindow,
  setForumCoreCenterOffset,
  forumPathRiding,
  coverHandedOff,
} = useOrangeCoreProgress();

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

// 論壇四之後逐格變形成紙飛機的格數（0..8）；0 = 維持橘方塊。
const planeFrame = ref(0);

// 路徑核心的外觀與 ForumCore 的橘點共用同一份設定：交棒點兩顆重合，尺寸或顏色不同會看到縮一下。
const coreStyle = computed(() => {
  const orange = `rgb(${CORE.orange.join(', ')})`;
  const box = { width: `${CORE.dotSize}px`, height: `${CORE.dotSize}px` };
  // 進到第 1 格之後底色讓給 sprite，改用 color 餵 currentColor。
  return planeFrame.value > 0 ? { ...box, color: orange } : { ...box, background: orange };
});

let st: ScrollTrigger | null = null;
// 驅動線（＝設計線）的總弧長：僅在 build() 幾何重建時量測一次，scrub 每幀直接複用。
// 定位、切線取樣、forumPathProgress 換算都吃這一個值。
// ⚠ 2026-08-12 之前另有 motionLen（含隱形尾段的總長）與 pathLen（設計線長）兩個變數，
//   後半段改走 waypoint、尾段退場後兩者恆等 → 收成一個。日後真的要補回尾段，得**同時**
//   拆回兩個值並改 place() 的切線取樣（見該處的 ⚠），只改一半會靜默錯開整段交棒時機。
let pathLen = 0;
// 驅動線末端的容器 y。ScrollTrigger 的 end 讀它，place() 也用它把捲動進度換算成
// 「此刻位於視窗中央的容器 y」。名稱沿用 tailEndY（architecture/forum-node-path.md 與
// .claude/memory 都以此稱呼）：有尾段的年代它是尾段末端，現在就是設計線末端。
let tailEndY = 0;
// 回中節點表（容器 y ↔ 弧長）：place() 靠它把核心留在視窗中央附近，見 buildArcKnots。
// 與 pathLen 同時在 build() 建立一次，scrub 每幀只做內插。
let knots: ArcKnot[] = [];
// 變身點的弧長。量不到 → null → 全程維持橘方塊、不畫尾跡，但整條線照跑。
let swapLen: number | null = null;

// 沒有可跑的驅動線時清空：核心藏起來，橘點回到原本的 coreOut 淡出（見 forumCoreDotVisible）。
// ⚠ progress 也要歸零，不能只清 active：從 pc 切到 pad/mob 時它會留著上一個斷點的殘值，
//   forumPathRiding 因此卡在 true —— 路徑核心保持可見，而 place() 已因 pathLen=0 提早
//   return，方塊就停在最後一次的 transform 上，變成論壇段裡一顆不會動的橘方塊。
//   planeFrame 是同一型事故：不清的話會停在舊格數（可能是 8），且 coreStyle 在
//   planeFrame > 0 時不輸出 background，殘影會是一架不會動的紙飛機而非橘方塊。
// ⚠ 四條 d 與遮罩尺寸都要清：genEl 在 v-if="nodes" 之下、斷點切換時不會重建，
//   留著上一版的 d 會讓 ?pathdebug 看到兩個斷點的線疊在一起；遮罩尺寸則是 build()
//   依當前幾何寫上去的，不還原會用舊框裁掉新線（移除屬性即退回 SVG 預設的 ±10%）。
function reset() {
  genEl.value?.removeAttribute('d');
  motionEl.value?.removeAttribute('d');
  trailEl.value?.removeAttribute('d');
  trailMaskPathEl.value?.removeAttribute('d');
  trailMaskEl.value?.removeAttribute('width');
  trailMaskEl.value?.removeAttribute('height');
  pathLen = 0;
  tailEndY = 0;
  knots = [];
  swapLen = null;
  planeFrame.value = 0;
  setForumPathActive(false);
  setForumPathProgress(0);
  setForumSlashWindow(null);
  setForumCoreCenterOffset(0);
}

// 重建回中節點表。必須在 pathLen / tailEndY 都定案之後呼叫。
// 間距吃視窗高：畫面越矮，容許的偏移越小，節點就越密（見 FORUM_CENTER_KNOT_VH）。
// 取樣 512 點 ＝ 每 ~26px 弧長一點（mob 最長 13429），只在 build() 跑，不在熱路徑上。
function syncKnots(motion: SVGPathElement) {
  knots = buildArcKnots(
    pathLen,
    tailEndY,
    vhPx(FORUM_CENTER_KNOT_VH),
    (len) => motion.getPointAtLength(len).y,
  );
}

// 算出那一撇的觸發窗口（forumPath 軌的 0..1）並寫進共享軌。
//
// 撇是 "/"，核心在這一帶是往左下走 → 進入端是外框的**右上角**、結束端是**左下角**。
// 那不是近似值：外框的尺寸就是脊線旋轉後的軸對齊外框（見 ForumEvent 的 SCSS），
// 兩個對角正好是脊線的兩端。外框刻意不套 transform，故畫出比例是 0 時 rect 也不會塌。
//
// 為什麼用算的而不是寫死百分比：版面一動（標題行數、講者照片、字體 fallback）弧長比例
// 就會變。config 的 FORUM_SLASH_AT 只是「設計到切版有落差時」的手動覆寫，預設 null。
//
// 只在 build() 幾何重建時跑一次（512 + 64 次 getPointAtLength），不在逐幀熱路徑上。
function syncSlashWindow(motion: SVGPathElement) {
  const b = bp.value;
  if (!b || !pathLen) return setForumSlashWindow(null);

  const override = FORUM_SLASH_AT[b];
  if (override) return setForumSlashWindow(override);

  const root = rootEl.value;
  // 搜尋範圍同 buildNodesD：取 .sec2 而非 .sec2__path，座標原點則仍是 .forum-path。
  const scope = root?.closest('.sec2');
  const el = scope?.querySelector<HTMLElement>('.forum-event__date-coreslash');
  // 量不到就不畫那一撇（可能是資料沒標 'core'）—— 這裡**不**走 reset()：
  // 少一撇只是少一個裝飾，整條線與核心都還是對的，不該把整段停掉。
  if (!root || !el) return setForumSlashWindow(null);

  const rootRect = root.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const enter = { x: r.right - rootRect.left, y: r.top - rootRect.top };
  const exit = { x: r.left - rootRect.left, y: r.bottom - rootRect.top };

  const sample = (len: number) => motion.getPointAtLength(len);
  const a = nearestArcLength(enter, sample, pathLen) / pathLen;
  const z = nearestArcLength(exit, sample, pathLen) / pathLen;
  // 排序而非假設 enter 在前：萬一日後線的走向反過來，這裡不該靜默畫成負向。
  const w: SlashWindow = a <= z ? [a, z] : [z, a];
  setForumSlashWindow(w);
}

// 變身節點在驅動線上的弧長。節點本來就在線上，故最近點即精確值。
// 髮夾彎會讓線多次經過鄰近位置，但變身節點與後段各點的 y 差很遠，不會選錯分支。
function syncSwapLen(
  motion: SVGPathElement,
  points: Map<string, [number, number]>,
): number | null {
  const b = bp.value;
  if (!b || !pathLen) return null;
  const pt = points.get(FORUM_PLANE.node[b]!);
  if (!pt) return null;
  const sample = (len: number) => motion.getPointAtLength(len);
  return nearestArcLength({ x: pt[0]!, y: pt[1]! }, sample, pathLen);
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
    // （理由見 architecture/forum-node-path.md 第四節：錨點是具名的，不是索引）。
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
    // 0×0 ＝ 這個元素沒有 box（display: none / contents）→ 當成量不到。
    // 不擋掉的話 rect 全 0 會被解成「y=0 的合法錨點」，必要錨點的 fail-loud 保證就失效，
    // 整條線靜默接到容器頂端。本專案至少有兩處 display: contents（.forum-event__head
    // 在 stair/youth @mob、.forum-event--quote .forum-event__speaker @pad/mob），
    // forum-node-path 的 P6 註解也已假設這種情形「量不到」。
    // ⚠ 用 && 而不是 ||：零高度的標記元素（.sec2__seam，SEAM_END 錨在它上）寬度不為 0。
    if (!r.width && !r.height) return null;
    return {
      top: r.top - rootRect.top,
      height: r.height,
      // 橫向也回：掛在 element 上的 x（ForumPathXAnchor）要用。以 .forum-path 為原點，
      // 故議程那種「定寬置中於視窗、與本層不同寬」的元素也算得對。
      left: r.left - rootRect.left,
      width: r.width,
    };
  };

  const out = buildNodePathD(list, { width: rootRect.width, measure });
  return out ? { ...out, width: rootRect.width } : null;
}

// 依當前版面重建整條線（前半段＋後半段）。可見線與驅動線吃同一個 d。
function build() {
  const motion = motionEl.value;
  if (!motion) return;
  const list = nodes.value;
  if (!list?.length) return reset();

  // 量測期間讓 .sec2__pin 退回一般流（見該處 SCSS 與設計稿第八節）：它是 sticky，
  // 若此刻 sticky 已 engage，它內部所有錨點的 rect 都是位移後的值 —— 不會報錯，
  // 整條線靜默歪掉。屬性的設與還原之間沒有 yield，故不會 paint、畫面不跳。
  // `return reset()` 走的也是 finally，不會漏掉還原。
  const scope = rootEl.value?.closest('.sec2') as HTMLElement | null;
  scope?.setAttribute('data-path-measuring', '');
  try {
    const out = buildNodesD(list);
    // 必要錨點量不到就整條放棄 —— 少一個點會讓後面全部接到錯的鄰居身上，靜默變形。
    // （標了 optional 的點量不到不算，產生器會自己跳過並重接。）
    if (!out) return reset();

    genEl.value?.setAttribute('d', out.d);
    motion.setAttribute('d', out.d);
    trailEl.value?.setAttribute('d', out.d);
    trailMaskPathEl.value?.setAttribute('d', out.d);
    // 遮罩區預設只有外框 ±10%，會把線裁掉 → 明寫成涵蓋整條線再各留 100 的餘裕。
    trailMaskEl.value?.setAttribute('width', `${out.width + 200}`);
    trailMaskEl.value?.setAttribute('height', `${out.endY + 200}`);
    pathLen = motion.getTotalLength();
    // 後半段的 waypoint 已經走到段落底（.sec2__pin 的下緣），故不再需要隱形尾段；
    // 「核心留在視窗中央」改由回中節點表保證（見 syncKnots / buildArcKnots）。
    // ⚠ tailEndY 不能留 0 —— ScrollTrigger 的 end 讀它，0 會被 GSAP 夾成 start + 0.01，
    //   捲動尺變零長度、核心一進場就跳到路徑末端。
    tailEndY = out.endY;
    swapLen = syncSwapLen(motion, out.points);
    syncKnots(motion);
    // 節點表建不出來（pathLen 或 tailEndY ≤ 0）就整條放棄，**不能**只讓 place() 提早
    // return：下面的 setForumPathActive(true) ＋ 殘留的 forumPathProgress 會讓
    // forumPathRiding 卡在 true —— 正是 reset() 註解說「不可發生」的那顆不會動的橘方塊。
    if (!knots.length) return reset();
    syncSlashWindow(motion);

    setForumPathActive(true);
    place(st ? st.progress : 0);
  } finally {
    scope?.removeAttribute('data-path-measuring');
  }
}

// 依 raw 捲動進度把核心定位到驅動線上的點，並轉到該處的路徑切線方向（雲霄飛車感）。
// 先過 easeMove 得路徑進度 p 再定位；切線由前後各取 1px 的鄰近點連線求得，兩端皆穩定
// （不會因 eps=0 歸零）。p 同時寫回全域軌，故交棒判定與定位一致。
function place(rawP: number) {
  const core = coreEl.value;
  const motion = motionEl.value;
  if (!core || !motion || !pathLen || !knots.length) return;
  // rawP × tailEndY ＝ 此刻落在視窗中央的容器 y（start / end 都錨在 center，故線性）。
  // 節點表把它換算成弧長 —— 節點上核心精準落在視窗中央，節點之間才照弧長等比走。
  const centerY = rawP * tailEndY;
  const len = arcAtCenterY(centerY, knots, easeMove);
  const pt = motion.getPointAtLength(len);
  const d = 1; // 取樣間距（px）
  // 取樣點夾在 [0, pathLen] 內，故切線在兩端也穩定（不會因 eps=0 而歸零）。
  // ⚠ 日後若又在設計線之後追加隱形尾段，這裡必須改回「只在設計線那一段取樣」：
  //   尾段是垂直的（90°）而設計線末端的切線是 112°，讓尾段參與取樣會使核心在接縫處
  //   約 2px 捲動內轉正 22° —— 而那正是它唯一露臉的時刻（交接窗 43.5px）。
  const behind = motion.getPointAtLength(Math.max(0, len - d));
  const ahead = motion.getPointAtLength(Math.min(pathLen, len + d));
  const angle =
    (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
  // 一律 +90：sprite 機鼻朝 −y，而 angle 是「朝右為 0°」。第 0 格是正方形，
  // 多轉 90° 看起來完全一樣，故不分支。
  gsap.set(core, { x: pt.x, y: pt.y, rotation: angle + 90 });
  planeFrame.value = morphFrame(len, swapLen, FORUM_PLANE.morphLen);

  // 核心相對視窗中央的偏移（正 ＝ 在中央下方）。centerY 就是「此刻在視窗中央的容器 y」，
  // 故兩者相減即得，不需要量任何 DOM。<Agenda> 用它把箭頭的判定線從視窗中央挪到核心本身
  // （見 useOrangeCoreProgress 的 forumCoreCenterOffset）。
  setForumCoreCenterOffset(pt.y - centerY);

  const { dash, offset } = trailWindow(
    len, swapLen, FORUM_PLANE.tailLen, FORUM_PLANE.rearOffset,
  );
  const maskPath = trailMaskPathEl.value;
  if (maskPath) {
    maskPath.setAttribute('stroke-dasharray', `${dash} 99999`);
    maskPath.setAttribute('stroke-dashoffset', `${offset}`);
  }

  // 語意維持「設計線走完的比例」，下游的 forumPathRiding 因此不變。
  // pathLen > 0 由上方的 guard 保證。
  setForumPathProgress(Math.min(1, len / pathLen));
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
  refreshScrollTriggers();
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

  // 幾何重建掛在 refreshInit 上，且**先註冊再建 trigger**：
  //   1. 下面的 refreshScrollTriggers() 會觸發它，故不必再單獨呼叫一次 build()
  //      （原本 mount 時會跑三次：直接呼叫 → refresh → fonts.ready，每次都是 1100+ 次
  //      getPointAtLength ＋ 全部錨點的 forced layout）。
  //   2. 萬一找不到 trigger（見下），可見線與核心定位仍會隨每次 refresh 更新，
  //      而不是「只建一次、之後永不重算」還不報錯。
  ScrollTrigger.addEventListener('refreshInit', build);

  // 用 .sec2__path 當 trigger 而非 .forum-path：後者未來若被斷點收掉就量不到 rect。
  // 兩者的 top 相同（.forum-path 是 inset: 0 的絕對定位子元素）。
  // 理論上不會找不到；真的找不到就只保留可見線定位，不建 scrub。
  const trigger = rootEl.value?.closest('.sec2__path') as HTMLElement | null;

  if (trigger) {
    st = ScrollTrigger.create({
      trigger,
      // 路徑起點在容器 (640, 0)＝黑白接縫，而 ForumCore 的橘點釘在視窗正中央 ——
      // 「容器頂端抵達視窗中央」的那一刻兩者是同一點，交棒不需要任何補償值。
      start: 'top center',
      // 終點：接縫抵達「接觸點」的視窗位置。對齊字串由 COVER_CONTACT 導出
      // （coverContactAlign()），與 blessing 的色塊換色共用同一個來源 ——
      // 飛機走完路徑的那一刻就是色塊碰到它的那一刻，兩邊不可能脫鉤。
      // COVER_CONTACT = 0.5 → '50%'，與改動前的 `center` 完全相同。
      // tailEndY 由 build() 從實際幾何算出，refreshInit → build() 先跑，故每次 refresh
      // 都是最新值（建立當下它還是 0，但緊接著的 refresh 會重評這個函式）。
      // ⚠ 刻意不掛 endTrigger：.forum-event__date 是 position: absolute，量不到有效高度；
      //   也刻意不碰 .sec2 的 bottom —— 上游 SymbolScene 的 pin-spacer 會撐高它，變成循環依賴。
      end: () => `top+=${tailEndY} ${coverContactAlign()}`,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => place(self.progress),
    });
  }

  // 字體載入會改變文字高度 → 錨點位移 → 重新量測。resize 由 ScrollTrigger 自己的
  // autoRefreshEvents 涵蓋（預設含 resize），故不另外掛 resize 監聽。
  // refresh 一律走 refreshScrollTriggers()（先 sort 再 refresh）—— 見 utils/scroll-trigger。
  document.fonts?.ready.then(() => refreshScrollTriggers());
  refreshScrollTriggers(); // ← 這一次同時完成首次 build()（refreshInit）
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

    <!-- 尾跡：可見層吃固定 dasharray（＝虛線釘在弧長上），遮罩層滑動開窗。
         遮罩描邊取可見層的 2 倍才蓋得乾淨。 -->
    <svg
      class="forum-path__trail"
      :class="{ 'is-gone': coverHandedOff }"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="forum-trail"
        ref="trailMaskEl"
        maskUnits="userSpaceOnUse"
        x="-100"
        y="-100"
      >
        <path ref="trailMaskPathEl" fill="none" stroke="#fff" :stroke-width="FORUM_PATH_STROKE * 2" />
      </mask>
      <path
        ref="trailEl"
        fill="none"
        stroke="currentcolor"
        :stroke-width="FORUM_PATH_STROKE"
        stroke-linecap="square"
        :stroke-dasharray="FORUM_PLANE.dash.join(' ')"
        mask="url(#forum-trail)"
      />
    </svg>

    <!-- 路徑核心：p=0（尚未交棒）時必須藏著 —— 它是隨頁面捲動的 absolute 元素，
         若一直可見，段落進場到交棒點之間畫面上會同時有它與中央那顆固定橘點。 -->
    <span
      ref="coreEl"
      class="forum-path__core"
      :class="{ 'is-riding': forumPathRiding, 'is-gone': coverHandedOff }"
      :style="coreStyle"
    >
      <ForumPlaneSprite
        v-if="planeFrame > 0 && bp"
        :frame="planeFrame"
        :scale="FORUM_PLANE.scale[bp]"
      />
    </span>
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
// .sec2__path--debug 由 <Forum> 依 query 掛上，只做上色、不改層序（見那裡的 ⚠️）。
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

// 尾跡的座標可能超出 svg box → overflow: visible 才不被裁掉（同 __motion）。
// 顏色吃 currentcolor，與核心同一個來源。
.forum-path__trail {
  position: absolute;
  inset: 0;
  overflow: visible;
  color: rgb(255, 127, 0);

  // 同 .forum-path__core.is-gone：機身消失了不該留下彗星尾。
  &.is-gone {
    opacity: 0;
  }
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

  // 交棒給白方塊之後立刻消失（見 useOrangeCoreProgress 的 coverHandedOff）。
  // 刻意不加 transition：白方塊在同一刻從接縫長出來，這是硬切交棒，
  // 淡出會讓兩者同時半透明地並存一小段（同本檔上方 opacity 的取捨）。
  &.is-gone {
    opacity: 0;
  }
}
</style>
