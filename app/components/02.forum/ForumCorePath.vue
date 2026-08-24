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
import {
  nearestArcLength,
  slashAlignment,
  slashCoreScaleAt,
  type SlashArcWindow,
  type SlashWindow,
} from '~/utils/forum-slash';
import {
  resolveForumEventMarks,
  unknownEventNodes,
  type ForumEventMarks,
} from '~/utils/forum-path-events';
import {
  FORUM_TURN_SAMPLE_LEN,
  FORUM_TURN_SFX,
  pickTurns,
  squashScaleAt,
  turnAngleDeg,
  type ForumTurn,
} from '~/utils/forum-path-turns';
import {
  killScrollTriggers,
  refreshScrollTriggers,
  refreshOnFontsReady,
} from '~/utils/scroll-trigger';
import { pointKey } from '~/utils/sample-cache';
import {
  forumKnotCache as knotCache,
  forumSlashCache as slashCache,
  forumSwapCache as swapCache,
  forumTurnCache as turnCache,
  forumNodeLenCache,
} from '~/utils/forum-path-cache';

const rootEl = ref<HTMLElement | null>(null);
const motionEl = ref<SVGPathElement | null>(null);
const coreEl = ref<HTMLElement | null>(null);
// 彗星尾：可見層固定 dasharray、遮罩層滑動開窗（見模板註解）。
const trailEl = ref<SVGPathElement | null>(null);
const trailMaskEl = ref<SVGMaskElement | null>(null);
const trailMaskPathEl = ref<SVGPathElement | null>(null);
// 可見線：整條由 waypoint 算出來，故只有一個 <path>。
const genEl = ref<SVGPathElement | null>(null);
// 量尺：只在 build() 用來逐段累加弧長（見 syncEventMarks），量完就清掉 d、不呈現任何東西。
const probeEl = ref<SVGPathElement | null>(null);

const {
  setForumPathProgress,
  setForumPathActive,
  setForumSlashWindow,
  setForumPathMarks,
  setForumTurns,
  setForumCoreCenterOffset,
  forumPathRiding,
  coverHandoff,
  coverHandedOff,
} = useOrangeCoreProgress();

// 轉折音效。play() 在音效總開關關著時本身就是 no-op（見 useSfx），故這裡不必再加閘門。
const { play } = useSfx();

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

// 橘方塊變身成紙飛機的那一刻響一聲（使用者裁決：只響變身這一下，
// 不是紙飛機那一段的每個撞擊點 —— 撞擊點另有 FORUM_TURN_SFX 那條線）。
// planeFrame 0 → 1 ＝ 弧長跨過 swapLen（見下方 morphFrame）。
const { cueOn } = useSfxCue();
cueOn(() => planeFrame.value > 0, 'sfx01');

// 路徑核心的外觀與 ForumCore 的橘點共用同一份設定：交棒點兩顆重合，尺寸或顏色不同會看到縮一下。
const coreStyle = computed(() => {
  const orange = `rgb(${CORE.orange.join(', ')})`;
  const box = { width: `${CORE.dotSize}px`, height: `${CORE.dotSize}px` };
  // 進到第 1 格之後底色讓給 sprite，改用 color 餵 currentColor。
  return planeFrame.value > 0 ? { ...box, color: orange } : { ...box, background: orange };
});

// 取樣結果快取（knotCache / slashCache / swapCache / turnCache）住在
// ~/utils/forum-path-cache —— **不能**寫在這裡：`<script setup>` 的頂層會被編譯進
// setup()，每個實例重跑一次，換頁 remount 就等於沒有快取。理由詳見該檔的 ⚠。
//
// ⚠ 只快取「取樣結果」，不快取副作用（setForumTurns / setForumSlashWindow /
//   lastTurnLen 歸零等）——那些每輪都要照跑，否則命中時共享軌不會被寫入。

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
// 上一次寫進尾跡遮罩的開窗值（見 place 末段）：值沒變就不寫屬性。NaN ＝ 尚未寫過。
let lastTrailDash = NaN;
let lastTrailOffset = NaN;
// 那一撇的窗口換算成**弧長**（px）＋ 核心縮成筆尖的目標倍率。
// 兩者都在 build() 定案（見 syncSlash），place() 每幀只做內插 —— 窗口本身是 0..1 的軌位置，
// 在這裡先乘一次 pathLen，不要每幀再乘一遍。
// null / 1 ＝ 沒有窗口或量不到脊寬 → 核心全程維持原尺寸（見 slashCoreScaleAt 的 fail-soft）。
let slashLens: SlashArcWindow | null = null;
let slashTipScale = 1;
// 轉折的弧長（升冪，見 ~/utils/forum-path-turns）＋ 上一幀核心走到的弧長。
// ⚠ lastTurnLen 為 null ＝ **尚未定錨**，下一次 place() 只記位置、不出聲。
//   每次幾何重建（build / 斷點切換）都要歸 null：弧長全部換算過了，拿舊值比會噴一串音效
//   —— 而 refresh 在本專案很常發生（視窗改變、字體載入、?highlights 切換）。
let turnLens: number[] = [];
let lastTurnLen: number | null = null;

// 撞擊擠壓的補間狀態（見 orange-core-config 的 FORUM_TURN_SQUASH）。
// squash.v ＝ 壓了多少：0 原尺寸、1 稿上的 32×17、負值 ＝ 回彈那一下的拉長。
// 用一個純資料物件當補間目標而非直接補 DOM：核心的 transform 只能有**一個作者**
// （writeCore），這裡補的是那個作者的輸入，不是它的輸出（同 place() 裡 scale 那段的理由）。
const squash = { v: 0 };
let squashTw: gsap.core.Timeline | null = null;

// 撞擊：出一聲 ＋ 壓一下。兩者同一個觸發點，故寫在同一支（見 hitTurnsCrossed）。
//
// 每次撞擊都把上一次的補間 kill 掉重跑：連續兩個轉折靠得很近時（間隔下限是
// FORUM_TURN_MIN_GAP_LEN 的 300px 弧長，快速捲動下可以是幾十毫秒），疊上去會讓
// 第二次從「還沒彈回的形狀」起跳、越壓越扁。重跑 ＝ 每一次撞擊都是完整的一下。
//
// prefers-reduced-motion 下整段跳過（音效照出、核心照走）：這是本元件唯一一個**不吃捲動**
// 的動作 —— 使用者停著不動它也會自己彈，正是那個設定在講的東西。核心沿線移動不在此列，
// 那是捲動的直接結果。查詢每次現查：使用者可以在不重整頁面的情況下改系統設定。
function hitSquash() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const { inDur, outDur, inEase, outEase } = FORUM_TURN_SQUASH;
  squashTw?.kill();
  squashTw = gsap
    .timeline({
      // 補間期間捲動可能是靜止的（撞擊是時間驅動的，見 FORUM_TURN_SQUASH 的註解），
      // place() 不會被呼叫 —— 所以要自己把每一幀寫回去。
      onUpdate: () => writeCore(),
      onComplete: () => {
        squash.v = 0; // ease 的落點理論上就是 0，明確歸零避免累積誤差殘留在 transform 上
        writeCore();
      },
    })
    .to(squash, { v: 1, duration: inDur, ease: inEase })
    .to(squash, { v: 0, duration: outDur, ease: outEase });
}

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
  probeEl.value?.removeAttribute('d');
  pathLen = 0;
  tailEndY = 0;
  knots = [];
  swapLen = null;
  // 尾跡開窗的「上次寫入值」也要清：幾何重建後同一組數字仍該被寫回去（見 place 末段）
  lastTrailDash = NaN;
  lastTrailOffset = NaN;
  planeFrame.value = 0;
  // 姿態快取也要清：留著上一個斷點的座標，下潛的 watch 會把核心寫回那個位置
  // —— 同 planeFrame 那條，殘影會是一架停在錯誤位置的紙飛機。
  pose = null;
  // 露出量是**該斷點該次幾何**的量測值（旋轉角隨設計線走），換斷點要重量。
  planeOverhang = null;
  setForumPathActive(false);
  setForumPathProgress(0);
  setForumSlashWindow(null);
  // 核心的筆尖縮放也要歸位，理由同上面 planeFrame：不清的話殘影會停在縮小後的尺寸上。
  slashLens = null;
  slashTipScale = 1;
  // 路徑事件的門檻表 —— 整套機制刻意只有這一條軌要清，事件表加到幾十個也一樣。
  setForumPathMarks(null);
  turnLens = [];
  lastTurnLen = null;
  setForumTurns(null);
  // 撞擊擠壓也要收：它是**時間**驅動的，幾何重建（refresh／斷點切換）不會讓它自己停 ——
  // 不 kill 的話補間會繼續 writeCore()，把剛清成 null 的 pose 之前那筆殘姿再寫一次。
  // v 一併歸零，否則下一次定位會用上一輪壓到一半的形狀畫第一幀。
  squashTw?.kill();
  squashTw = null;
  squash.v = 0;
  setForumCoreCenterOffset(0);
}

// 重建回中節點表。必須在 pathLen / tailEndY 都定案之後呼叫。
// 間距吃視窗高：畫面越矮，容許的偏移越小，節點就越密（見 FORUM_CENTER_KNOT_VH）。
// 取樣 512 點 ＝ 每 ~26px 弧長一點（mob 最長 13429），只在 build() 跑，不在熱路徑上。
function syncKnots(motion: SVGPathElement, d: string) {
  // 鍵含全部輸入：d（決定整條幾何）＋ 三個純量。同鍵必得同結果，故快取是精確的。
  knots = knotCache.get(
    `${d}|${pathLen}|${tailEndY}|${vhPx(FORUM_CENTER_KNOT_VH)}`,
    () =>
      buildArcKnots(
        pathLen,
        tailEndY,
        vhPx(FORUM_CENTER_KNOT_VH),
        (len) => motion.getPointAtLength(len).y,
      ),
  );
}

// 算出那一撇的觸發窗口（forumPath 軌的 0..1）。null ＝ 不畫那一撇。
//
// 撇是 "/"，核心在這一帶是往左下走 → 進入端是外框的**右上角**、結束端是**左下角**。
// 那不是近似值：外框的尺寸就是脊線旋轉後的軸對齊外框（見 ForumEvent 的 SCSS），
// 兩個對角正好是脊線的兩端。外框刻意不套 transform，故畫出比例是 0 時 rect 也不會塌。
//
// 為什麼用算的而不是寫死百分比：版面一動（標題行數、講者照片、字體 fallback）弧長比例
// 就會變。config 的 FORUM_SLASH_AT 只是「設計到切版有落差時」的手動覆寫，預設 null。
//
// 只在 build() 幾何重建時跑一次（512 + 64 次 getPointAtLength），不在逐幀熱路徑上。
function computeSlashWindow(
  motion: SVGPathElement,
  d: string,
): SlashWindow | null {
  const b = bp.value;
  if (!b || !pathLen) return null;

  const override = FORUM_SLASH_AT[b];
  if (override) return override;

  const root = rootEl.value;
  // 搜尋範圍同 buildNodesD：取 .sec2 而非 .sec2__path，座標原點則仍是 .forum-path。
  const scope = root?.closest('.sec2');
  const el = scope?.querySelector<HTMLElement>('.forum-event__date-coreslash');
  // 量不到就不畫那一撇（可能是資料沒標 'core'）—— 這裡**不**走 reset()：
  // 少一撇只是少一個裝飾，整條線與核心都還是對的，不該把整段停掉。
  if (!root || !el) return null;

  const rootRect = root.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const enter = { x: r.right - rootRect.left, y: r.top - rootRect.top };
  const exit = { x: r.left - rootRect.left, y: r.bottom - rootRect.top };

  // 量測（便宜）在快取外、兩次 nearestArcLength（各 512+64 次取樣，本元件最貴的一段）
  // 在快取內。鍵含 d 與兩個端點座標 —— 版面真的動了，rect 就會變、快取自然 miss。
  return slashCache.get(
    `${d}|${pointKey(enter.x, enter.y)}|${pointKey(exit.x, exit.y)}`,
    () => {
      const sample = (len: number) => motion.getPointAtLength(len);
      const aLen = nearestArcLength(enter, sample, pathLen);
      const zLen = nearestArcLength(exit, sample, pathLen);

      // 對齊守衛：撇的兩端必須**落在**驅動線上，否則核心會在別的地方「畫」它。
      // pad／mob 由節點錨在撇本身保證（forum-node-path 的 SLASH_SEL）；pc 的 d 是手貼的，
      // 只有這道守衛。不通過就不畫（少一個裝飾 ≫ 畫在錯的地方），dev 吼一聲。
      const dist = (p: { x: number; y: number }, len: number) => {
        const q = sample(len);
        return Math.hypot(q.x - p.x, q.y - p.y);
      };
      const align = slashAlignment(
        dist(enter, aLen),
        dist(exit, zLen),
        Math.hypot(exit.x - enter.x, exit.y - enter.y),
        FORUM_SLASH_CORE.alignTol,
      );
      if (!align.ok) {
        // dev only：production 走 fail-soft（少一撇），不對使用者的 console 吼。
        // ⚠ 跨斷點拉拉視窗時會**短暫**吼一次：bp 的更新比版面重排晚一拍，那一瞬間確實
        //   是「用上一個斷點的線 ＋ 這個斷點的版面」，守衛拒畫是對的。停下來之後會再
        //   build 一次、恢復正常。持續吼才是真的沒對齊。
        if (import.meta.dev) {
          console.warn(
            `[forum-slash] 那一撇與驅動線沒對齊，不畫：偏差 ${align.worst.toFixed(1)}px ` +
              `> 容差 ${align.limit.toFixed(1)}px（bp=${b}）。` +
              '撇的位置在 ForumEvent.vue 的 --coreslash-x/y、線在 forum-node-path ' +
              '（pad／mob 的 P7a/P7b、Q7a/Q7b 就錨在撇上）—— 兩邊必須指同一條線。' +
              '拉視窗跨斷點時的單次警告可忽略。',
          );
        }
        return null;
      }

      // 排序而非假設 enter 在前：萬一日後線的走向反過來，這裡不該靜默畫成負向。
      const a = aLen / pathLen;
      const z = zLen / pathLen;
      return a <= z ? [a, z] : [z, a];
    },
  );
}

// 核心縮成筆尖的目標倍率（脊寬 ÷ CORE.dotSize）。**量出來的，不是設定值** ——
// 理由見 FORUM_SLASH_CORE 的 ⚠：脊寬由 --date-size 推導、住在 ForumEvent 的 SCSS，
// 在這裡或 config 再寫一個比例就會有兩份，改字級時只有一邊跟上。
//
// ⚠ 用 getComputedStyle 而不是 getBoundingClientRect：那條脊線套了
//   `rotate(26.7deg) scaleY(--slash-draw)` —— 尚未畫出來時（draw = 0）它的 rect 寬會是
//   脊寬 × cos26.7°，甚至整個塌成 0，於是筆尖會**隨著這一刻的捲動位置**縮成不同大小。
//   computed width 讀的是 used value（未經 transform），與捲動位置無關。
// 量不到 → 回 1 ＝ 不縮（fail-soft）。撇照畫，只是核心維持 26px，就是改動前的樣子。
function measureSlashTipScale(): number {
  const scope = rootEl.value?.closest('.sec2');
  const spine = scope?.querySelector<HTMLElement>('.forum-event__date-coreslash i');
  if (!spine) return 1;
  const w = Number.parseFloat(getComputedStyle(spine).width);
  if (!Number.isFinite(w) || w <= 0 || w >= CORE.dotSize) return 1;
  return w / CORE.dotSize;
}

// 把窗口寫進共享軌（給 ForumEvent 的 --slash-draw），並備好 place() 要用的兩個值。
// 一起做是刻意的：三者同源，分開呼叫就可能只更新其中一個，症狀是「撇畫在 A 處、
// 核心在 B 處縮小」——而兩邊都不會報錯。
function syncSlash(motion: SVGPathElement, d: string) {
  const w = computeSlashWindow(motion, d);
  setForumSlashWindow(w);
  slashLens = w && pathLen ? [w[0] * pathLen, w[1] * pathLen] : null;
  slashTipScale = w ? measureSlashTipScale() : 1;
}

// 變身節點在驅動線上的弧長。節點本來就在線上，故最近點即精確值。
// 髮夾彎會讓線多次經過鄰近位置，但變身節點與後段各點的 y 差很遠，不會選錯分支。
function syncSwapLen(
  motion: SVGPathElement,
  points: Map<string, [number, number]>,
  d: string,
): number | null {
  const b = bp.value;
  if (!b || !pathLen) return null;
  const pt = points.get(FORUM_PLANE.node[b]!);
  if (!pt) return null;
  // 鍵含 d 與該節點座標；節點座標本身就來自這條 d 的產生器，故同鍵必得同結果。
  return swapCache.get(`${d}|${pointKey(pt[0]!, pt[1]!)}`, () => {
    const sample = (len: number) => motion.getPointAtLength(len);
    return nearestArcLength({ x: pt[0]!, y: pt[1]! }, sample, pathLen);
  });
}

// 路徑事件的觸發門檻表：先量出**每個節點在驅動線上的弧長**，再交給純算式換成 0..1。
//
// 量法是逐段累加：`segs[i]` 是「終止於第 i 個節點」的那一小段 d，串起來餵給量尺 path
// 讀 getTotalLength() —— 節點數（約 35）次呼叫，只在 build() 跑。對照之下
// syncSlashWindow() 單一個窗口就要 512 + 64 次 getPointAtLength，事件多了會線性惡化。
//
// ⚠ 為什麼用量尺而不是自己積分算 cubic 弧長：量尺與 pathLen **用同一把尺**（同一個瀏覽器
//   實作），不會有兩套長度分歧 —— 而所有門檻最終都要跟 place() 的 len 比大小。
// ⚠ 為什麼另開一個 <path> 而不是複用 motionEl：驅動線必須全程持有完整的 d。量尺放在同一個
//   <svg> 內是為了保證它有 layout box（detached 元素的 getTotalLength 跨瀏覽器行為不一致）。
// 量出**每個節點在驅動線上的弧長**。路徑事件的門檻與轉折清單都吃這一份，故獨立成一支
// —— 兩邊各量一次會是 70 次 getTotalLength，而且兩份值萬一分歧會靜默錯開其中一邊。
// 快取鍵吃完整的 d（見 forumNodeLenCache）：同一條 d 必然對應同一組 segs 與同一組
// 弧長，而 build() 每次 refreshInit 都會來一輪。原本這是 build() 裡唯一沒快取的量測。
function measureNodeLens(
  segs: { id: string; d: string }[],
  d: string,
): Map<string, number> | null {
  const probe = probeEl.value;
  if (!probe || !pathLen || !segs.length) return null;

  const entries = forumNodeLenCache.get(d, () => {
    const out: [string, number][] = [];
    let acc = '';
    for (const s of segs) {
      acc += s.d;
      probe.setAttribute('d', acc);
      out.push([s.id, probe.getTotalLength()]);
    }
    probe.removeAttribute('d'); // 量完就清，別讓它以完整長度留在 DOM 上
    return out;
  });
  const lenAt = new Map(entries);

  // 末端必須等於驅動線總長。不符 ＝ segs 與 d 已經對不上（產生器改動最可能的破法），
  // 那會**靜默錯開所有事件與轉折** —— 故大聲說出來。門檻仍照算，少一點總比整段停掉好。
  const tail = lenAt.get(segs[segs.length - 1]!.id) ?? 0;
  if (Math.abs(tail - pathLen) > 0.5) {
    console.warn(
      `[forum-path-events] 量尺末端 ${tail.toFixed(2)} ≠ pathLen ${pathLen.toFixed(2)}，事件門檻不可信`,
    );
  }
  return lenAt;
}

function syncEventMarks(
  list: ForumPathNode[],
  lenAt: Map<string, number> | null,
): ForumEventMarks | null {
  const b = bp.value;
  if (!b || !lenAt) {
    setForumPathMarks(null);
    return null;
  }

  // 事件表打錯節點編號是本機制最容易犯、最靜默的錯（事件永遠不觸發，而畫面上少一個效果
  // 不會有人立刻發現）。這裡點名，test/forum-path-events.spec.ts 也守著同一條。
  // ⚠ 拿 list（＝ FORUM_PATH_NODES[bp]）比對而不是 lenAt 的 key：後者不含被跳過的
  //   optional 節點，會把「?highlights 沒帶」誤報成打錯字。
  for (const { key, id } of unknownEventNodes(b, list.map((n) => n.id))) {
    console.warn(
      `[forum-path-events] 事件 "${key}" 的 ${b} 節點 "${id}" 不在節點表裡（打錯字？）`,
    );
  }

  const marks = resolveForumEventMarks(b, (id) => lenAt.get(id), pathLen);
  setForumPathMarks(marks);
  return marks;
}

// 轉折清單（＝音效的觸發點）。篩選規則見 ~/utils/forum-path-turns，這裡只負責量。
//
// 量法：在節點弧長的前後各 FORUM_TURN_SAMPLE_LEN 處對**驅動線**取樣，用三點夾角量
// 「線在那裡折了多少」。不是拿相鄰節點的座標算折線轉角 —— 那在 pad / mob 會失準，
// 理由見 turnAngleDeg 的 ⚠（節點密度是實作分工，不該決定音效密度）。
// 成本：每個前半段節點 2 次 getPointAtLength（pc 最多 58 次），只在 build() 跑。
//
// 範圍取 FORUM_FRONT_NODES ＝ **議程之前**那一段：後半段（論壇四、精彩活動）不出聲。
// 那個常數原本只給黃金樣本測試用（前半段才對得到設計稿），語意正好就是這裡要的範圍。
function syncTurns(
  motion: SVGPathElement,
  lenAt: Map<string, number> | null,
  pathD: string,
): ForumTurn[] | null {
  const b = bp.value;
  turnLens = [];
  // ⚠ 一併歸 null：弧長剛剛全部重算過，拿上一次的位置比大小會噴一串音效。
  //   這條在快取命中時**同樣要跑** —— 它清的是「上一幀走到哪」，與取樣結果無關。
  lastTurnLen = null;
  if (!b || !lenAt) {
    setForumTurns(null);
    return null;
  }

  const d = FORUM_TURN_SAMPLE_LEN;
  const angleAt = (id: string): number | undefined => {
    const len = lenAt.get(id);
    // 兩端取樣會越界 → 不給角度 → pickTurns 直接剔除（首尾本來就不該出聲）。
    if (len == null || len - d < 0 || len + d > pathLen) return undefined;
    const p = motion.getPointAtLength(len);
    const before = motion.getPointAtLength(len - d);
    const after = motion.getPointAtLength(len + d);
    return turnAngleDeg([before.x, before.y], [p.x, p.y], [after.x, after.y]);
  };

  // 鍵含 d、斷點、取樣間距，以及 lenAt 的完整內容 —— 後者是 angleAt 的取樣位置來源，
  // 少放進鍵就會在「同一條線但節點弧長換了」時回舊答案（?highlights 增刪節點即是）。
  const turns = turnCache.get(
    `${pathD}|${b}|${d}|${[...lenAt].map(([id, len]) => `${id}:${len}`).join(',')}`,
    () =>
      pickTurns({
        order: FORUM_FRONT_NODES[b].map((n) => n.id),
        angleAt,
        lenAt: (id) => lenAt.get(id),
        pathLen,
      }),
  );
  turnLens = turns.map((t) => t.len);
  setForumTurns(turns);
  return turns;
}

// 核心從 lastTurnLen 走到 len 之間跨過任何轉折 → 撞一下：出一聲 ＋ 方塊壓扁再彈回。
//
// 音效與擠壓是**同一個事件的兩個表現**，故共用這一個判定 —— 分兩處判會在門檻或方向條件
// 哪天被改掉一邊時，變成「有聲音沒動作」或反之，而那種不同步不會有人立刻發現。
//
// ・往回捲不撞（只更新位置）—— 來回微調捲動位置時不該被轟炸，「核心往前跑」的方向感
//   也因此更明確。回頭再往下捲會再響一次，那與 useSfx 的重複觸發語意一致。
// ・一幀跨過多個轉折（快速捲動）合併成一次：some() 短路，且 play() 本身不疊音。
// ・首次呼叫（lastTurnLen 為 null）只定錨。這是「重新載入時捲動位置被瀏覽器還原到論壇段
//   中段」不會一次噴完前面所有轉折的原因。
function hitTurnsCrossed(len: number) {
  const prev = lastTurnLen;
  lastTurnLen = len;
  if (prev == null || len <= prev || !turnLens.length) return;
  if (!turnLens.some((t) => t > prev && t <= len)) return;
  play(FORUM_TURN_SFX);
  hitSquash();
}

// ?pathdebug 才掛：外部量測腳本（Playwright）要驗「事件門檻是否精準落在節點上」，
// 而 out.points 與 marks 都是本元件的區域值，從外面取不到 —— 這一層的自動化覆蓋率是 0
// （vitest 只跑純函式），沒有它就只能靠肉眼比對，而 1px 的錯位肉眼看不出來。
// 閘門與理由同 plugins/gsap-debug-bridge.client.ts：不做 import.meta.dev 判斷，
// 因為 preview build 也要能量測；不帶參數的 production 頁面什麼都不掛。
const route = useRoute();
const pathDebug = computed(() => route.query.pathdebug !== undefined);

function exposeDebug(
  points: Map<string, [number, number]>,
  marks: ForumEventMarks | null,
  turns: ForumTurn[] | null,
) {
  if (!pathDebug.value) return;
  (window as unknown as Record<string, unknown>).__udnForumPath = {
    bp: bp.value,
    pathLen,
    tailEndY,
    nodes: Object.fromEntries(points),
    marks,
    turns,
    // 那一撇：窗口的弧長與筆尖倍率。兩者都是量出來的，肉眼分不出「縮到脊寬」有沒有對，
    // 故一併吐出來給量測腳本比對（tipScale × 26 應等於脊線的 computed width）。
    slash: slashLens ? { lens: slashLens, tipScale: slashTipScale } : null,
  };
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
    swapLen = syncSwapLen(motion, out.points, out.d);
    syncKnots(motion, out.d);
    // 節點表建不出來（pathLen 或 tailEndY ≤ 0）就整條放棄，**不能**只讓 place() 提早
    // return：下面的 setForumPathActive(true) ＋ 殘留的 forumPathProgress 會讓
    // forumPathRiding 卡在 true —— 正是 reset() 註解說「不可發生」的那顆不會動的橘方塊。
    if (!knots.length) return reset();
    syncSlash(motion, out.d);
    // 事件門檻要在 pathLen 定案之後算（它是分母）。放在 setForumPathActive(true) 之前：
    // active 翻上去的同一幀消費端就會讀 marks，晚一步會有一幀讀到上一個斷點的表。
    const lenAt = measureNodeLens(out.segs, out.d);
    const marks = syncEventMarks(list, lenAt);
    // 也要在下面 place() 之前：place() 會拿 turnLens 比大小並定錨 lastTurnLen。
    const turns = syncTurns(motion, lenAt, out.d);

    setForumPathActive(true);
    exposeDebug(out.points, marks, turns);
    // 幾何重建了 → 末端切線（＝機身的旋轉角）可能跟著變，露出量要重量。
    planeOverhang = null;
    place(st ? st.progress : 0);
  } finally {
    scope?.removeAttribute('data-path-measuring');
  }
}

// 核心在驅動線上的姿態（容器座標）。快取起來是給下潛用的：路徑在接觸點就跑完了
// （ScrollTrigger 的 end ＝ COVER_CONTACT），其後 place() 不再被呼叫，而下潛還要繼續走。
// null ＝ 還沒定位過（含 reset 之後）→ 下潛無事可做。
type CorePose = { x: number; y: number; angle: number; scale: number };
let pose: CorePose | null = null;

// 機身露在定位點上方的高度（px）＝ 下潛真正要走完的距離。null ＝ 還沒量。
//
// 為什麼用量的而不是算的：幾何是「sprite 底部貼核心框底部、整組繞定位點旋轉」，
// 算得出來，但要在這裡複製一份 sprite 的尺寸表與錨定規則 —— 那份副本壞掉時不會有人
// 發現（飛機只是沒鑽乾淨）。量一次就沒有第二份事實。
//
// 只在下潛開始的那一幀量一次（此時路徑已跑完、機身停在最後一格、旋轉角不再變），
// 不在逐幀的熱路徑上。定位點取核心框的**中心**：框是旋轉的，但中心是旋轉不變量。
let planeOverhang: number | null = null;

function measurePlaneOverhang(): number {
  const core = coreEl.value;
  const sprite = core?.querySelector('svg');
  if (!core || !sprite) return 0;
  const cr = core.getBoundingClientRect();
  const sr = sprite.getBoundingClientRect();
  return Math.max(0, cr.top + cr.height / 2 - sr.top);
}

/**
 * 把核心的 transform 寫進 DOM，並疊上「鑽進色塊」的位移。
 *
 * 下潛是**沿著末端切線**繼續往前推 PLANE_DIVE_PX（見 coverHandoffAt）—— 不是垂直往下：
 * 飛機在接縫上是斜的（設計線末端切線 112°），沿切線推才像它自己飛進去，
 * 垂直推會看起來像被人往下壓。
 *
 * 推完之後它就在色塊底下（層序見 coverHandoffAt 的註解），**不需要每幀追接縫** ——
 * 飛機與接縫在同一個座標系裡 1:1 一起捲動。
 *
 * x / y / rotation / scale 一律同一次 gsap.set 寫入：它們是同一顆方塊在同一幀的狀態，
 * 分兩次寫等於讓 transform 有兩個作者（同 place() 裡 scale 那段的理由）。
 */
function writeCore(next?: CorePose) {
  if (next) pose = next;
  const core = coreEl.value;
  if (!core || !pose) return;
  const handoff = coverHandoff.value;
  if (handoff > 0 && planeOverhang === null) {
    planeOverhang = measurePlaneOverhang();
  }
  const dive = handoff * ((planeOverhang ?? 0) + PLANE_DIVE_MARGIN_PX);
  const rad = (pose.angle * Math.PI) / 180;
  // 撞擊擠壓疊在 pose.scale 上（相乘，不是取代）：pose.scale 是「這一段路上核心該多大」
  // （筆尖縮放），擠壓是「此刻被撞成什麼形狀」，兩件事互不知情、合成才對。
  //
  // 寫的是 scaleX / scaleY 而非 scale：方塊已經被 rotation 轉到切線方向（永遠 +90，
  // 機鼻朝 local −y），所以 local y ＝ 行進方向、local x ＝ 側向 —— 稿上「壓成 32×17」
  // 落在這一組軸上就是「沿行進方向壓扁、側向鼓出」，不必再為轉角補任何三角。
  // ⚠ 不要同時給 scale 與 scaleX/scaleY，gsap 的 transform 只認後寫的那一個。
  const [sx, sy] = squashScaleAt(squash.v, FORUM_TURN_SQUASH.size, CORE.dotSize);
  gsap.set(core, {
    x: pose.x + Math.cos(rad) * dive,
    y: pose.y + Math.sin(rad) * dive,
    rotation: pose.angle + 90,
    scaleX: pose.scale * sx,
    scaleY: pose.scale * sy,
  });
}

// 下潛的驅動：coverProgress 由 Blessing 的 coverST 每幀寫入，而本元件的 ScrollTrigger
// 在接觸點就結束了 —— 這條 watch 是接觸點之後唯一還在動核心的東西。
// 註冊在 setup 的同步區間（不是 onMounted 裡）：在生命週期 hook 內建的 watcher
// 不保證掛得進元件的 effect scope，會漏掉自動停止。
watch(coverHandoff, () => writeCore());

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
  // 撞擊掛在 len 上而不是 forumPathProgress 上：轉折本身就是弧長，同一個量比大小
  // 不必再換算，也不會受 progress 那層 clamp 影響。
  hitTurnsCrossed(len);
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
  //
  // scale ＝ 畫那一撇時縮成筆尖（見 slashCoreScaleAt）。與 x / y / rotation 同一個
  // gsap.set 寫入，不另開一支 —— 它們是同一顆方塊在同一幀的狀態，分兩次寫等於讓
  // transform 有兩個作者。縮放中心是方塊自己（transform-origin 預設 50% 50%），
  // 故位置仍精準落在路徑點上。
  // ⚠ 這一段的弧長遠早於變身點（swapLen），故不會與紙飛機的 FORUM_PLANE.scale 疊乘；
  //   真要在飛機身上做縮放事件，得先想清楚兩個來源怎麼合成。
  const scale = slashCoreScaleAt(
    len, slashLens, FORUM_SLASH_CORE.shrinkLen, slashTipScale,
  );
  writeCore({ x: pt.x, y: pt.y, angle, scale });
  planeFrame.value = morphFrame(len, swapLen, FORUM_PLANE.morphLen);

  // 核心相對視窗中央的偏移（正 ＝ 在中央下方）。centerY 就是「此刻在視窗中央的容器 y」，
  // 故兩者相減即得，不需要量任何 DOM。<Agenda> 用它把箭頭的判定線從視窗中央挪到核心本身
  // （見 useOrangeCoreProgress 的 forumCoreCenterOffset）。
  setForumCoreCenterOffset(pt.y - centerY);

  const { dash, offset } = trailWindow(
    len, swapLen, FORUM_PLANE.tailLen, FORUM_PLANE.rearOffset,
  );
  // 值沒變就不寫。morph 節點在議程之後（見 orange-core-config 的 FORUM_PLANE），
  // 故整條路徑的**前半段** trailWindow 一律回 {dash: 0, offset: 0}（見 forum-trail）——
  // 原本那段每一幀都在寫兩個一模一樣的字串、外加兩個模板字面值的配置，
  // 而每次寫入都會讓一個覆蓋整條線的 SVG 遮罩失效。
  const maskPath = trailMaskPathEl.value;
  if (maskPath && (dash !== lastTrailDash || offset !== lastTrailOffset)) {
    lastTrailDash = dash;
    lastTrailOffset = offset;
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
      // scrub 已移除：它只對「掛在 ST 上的 animation」有意義，本 ST 沒有動畫、只讀 progress
      // （同 HeroVideo 的 buildDissolveST）。留著不會讓誰變慢，但會讓人以為這裡有補間。
      invalidateOnRefresh: true,
      onUpdate: (self) => place(self.progress),
    });
  }

  // 字體載入會改變文字高度 → 錨點位移 → 重新量測。resize 由 ScrollTrigger 自己的
  // autoRefreshEvents 涵蓋（預設含 resize），故不另外掛 resize 監聽。
  // refresh 一律走 refreshScrollTriggers()（先 sort 再 refresh）—— 見 utils/scroll-trigger。
  // 走 refreshOnFontsReady()：上面那條「mount 時跑三次」的教訓有一個跨元件的版本 ——
  // 三個元件各自 .then() 的話，fonts.ready 一 resolve 就是連續三次全站重算，
  // 每一次都含這裡的整條線重新量測。
  refreshOnFontsReady();
  refreshScrollTriggers(); // ← 這一次同時完成首次 build()（refreshInit）
});

onBeforeUnmount(() => {
  mqPc?.removeEventListener('change', onBpChange);
  mqPad?.removeEventListener('change', onBpChange);
  ScrollTrigger.removeEventListener('refreshInit', build);
  // kill(false)：換頁時舊頁還在畫面上淡出，revert 會把畫面打回起始態而被看見
  // （見 utils/scroll-trigger 的 killScrollTriggers）
  killScrollTriggers(st);
  st = null;
  // 撞擊擠壓不掛在 ScrollTrigger 上（時間驅動），killScrollTriggers 收不到它 ——
  // 留著的話補間會在元件卸載後繼續 onUpdate → writeCore()，對著已經沒人要的節點寫 transform。
  squashTw?.kill();
  squashTw = null;
});
</script>

<template>
  <div ref="rootEl" class="forum-path" aria-hidden="true">
    <!-- 可見線：由 build() 寫入 d。座標已在本層座標系，故不需要 left/top。
         描邊 4px（＝稿的線寬），驅動線吃同一個 d。 -->
    <svg v-if="nodes" class="forum-path__gen" xmlns="http://www.w3.org/2000/svg">
      <path ref="genEl" :stroke-width="FORUM_PATH_STROKE" />
    </svg>

    <!-- 驅動線：stroke:none，只給 getPointAtLength 取樣用，不呈現。
         量尺（__probe）同層：build() 逐段累加 d 讀 getTotalLength()，算出每個節點的弧長
         給路徑事件當門檻（見 syncEventMarks）。量完就清掉 d，平常是空的。
         放在同一個 <svg> 內是為了保證它有 layout box —— detached 元素的 getTotalLength
         跨瀏覽器行為不一致。 -->
    <svg class="forum-path__motion" xmlns="http://www.w3.org/2000/svg">
      <path ref="motionEl" fill="none" stroke="none" />
      <path ref="probeEl" fill="none" stroke="none" />
    </svg>

    <!-- 尾跡：可見層吃固定 dasharray（＝虛線釘在弧長上），遮罩層滑動開窗。
         遮罩描邊取可見層的 2 倍才蓋得乾淨。 -->
    <!-- 尾跡跟著飛機的下潛淡出（scrub，見 coverHandoff）。它的幾何釘在路徑上、
         沒辦法跟著往下沉，但機身還在飛的時候尾巴不能先不見 —— 讀起來會像尾巴自己
         斷掉。淡出用 inline style 而非 class：那是逐幀的量，class 只能給二元的。 -->
    <svg
      class="forum-path__trail"
      :style="{ opacity: 1 - coverHandoff }"
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
      <!-- class 純粹是**定位用的把手**（DevTools／量測腳本要找到這條可見尾跡），
           不掛任何樣式 —— 外觀全由上面那些 attribute 給。別因為「沒有對應的 SCSS 規則」
           就當成死碼刪掉。 -->
      <path
        ref="trailEl"
        class="forum-path__trail-line"
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
    // stroke: none 而非 transparent —— 一條約 13000px 的路徑，「完全透明的描邊」仍要
    // 走一遍描邊的產生與合成，`none` 直接不畫。debug 那條規則在下面照樣覆蓋得回來。
    stroke: none;
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
  // 淡出由 inline style 逐幀寫入（見模板）。**刻意不加 transition** ——
  // scrub 上疊補間會讓每一幀都滯後於捲動，手感發黏。
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

  // 完全沒入色塊之後才收掉（見 useOrangeCoreProgress 的 coverHandedOff）。
  //
  // ⚠️ 這**不是**飛機消失的機制 —— 它是被色塊遮住的（幾何遮蔽，見 writeCore）。
  //    切在它早就看不見的時候，所以不會被看到；純粹是保險，防止某個斷點的 sprite
  //    比 PLANE_DIVE_PX 推的距離還長、機尾留在接縫上方。
  //    刻意不加 transition：既然看不見，補間只是讓「保險」變得不可預測。
  &.is-gone {
    opacity: 0;
  }
}
</style>
