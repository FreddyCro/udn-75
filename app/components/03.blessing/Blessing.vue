<script setup lang="ts">
// Section 3：永續祝福（partner）。
//
// 兩段構造：
//   ① 逐格臉屏 —— 一段 BLESSING_VH 高的捲動尺，內含一張 sticky 滿屏（橘底）。
//      臉的格號由 blessingProgress 解出（見 useOrangeCoreProgress 的 blessingFrame）。
//      對應 Figma 永續祝福01–03（pc 2065:140462 / pad 2065:125534 / mob 2065:121838）。
//   ② 夥伴清單 —— 階梯線 ＋ 清單面板。
//
// 兩者住在同一個剛體（`.section3__unit`）裡 —— 相對位置由版面固定，捲動全程不會有
// 一個先滑走。定格因此不能用 sticky（一個元素只有一個錨點，這段需要兩個），改成
// 手動 pin：定格窗口內 fixed、窗口外 absolute 停在軌道兩端。詳見下方剛體區塊。
//
// 仍然不用 GSAP 的 pin：少一層 pin-spacer／transform／containing block 的雷
//（同 SymbolScene 的取捨），而且同一個元素也不能被兩條 trigger 各 pin 一次。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section3.json';
// 明寫 import（本檔其他常數都吃 auto-import）：它是在 **template** 裡消費的，
// 而 auto-import 只掃 script（同 BlessingFace.vue 的 FACE_GRID）。
import { BLESSING_ANCHOR_VH } from '@/utils/orange-core-config';
import { gaSectionViewOnce } from '@/utils/tracking-event';
import {
  killScrollTriggers,
  refreshScrollTriggers,
} from '@/utils/scroll-trigger';

const { partner } = str;
// 階梯線的逐格進場是否已播完（stairsDone）—— 播完才讓夥伴清單面板淡入。
// 由 <BlessingStairs> 以 v-model:done 雙向控制：使用者捲回階梯線上方時它會轉回 false，
// 下次由上往下進入就重播（重置時面板在畫面外，淡出看不到）。詳見該元件檔頭。
// 它住在 useOrangeCoreProgress 而非本檔的區域 ref：SEQUENCE 的 blessing.stairs 是
// 'time' part，除錯 dashboard 要讀它才判得出 idle / done。雙向綁定行為不變。
const {
  blessingProgress,
  blessingFrame,
  setBlessingProgress,
  stairsDone,
  blessingOutProgress,
  setBlessingOutProgress,
  partnersOpacity,
  setCoverProgress,
  coverOrange,
  coverSeed,
  coverSeedVisible,
  coverFaceVisible,
  coverHandoff,
  coverDone,
  outroWhite,
} = useOrangeCoreProgress();

// 逐格笑臉開始畫的音效。
//
// 觸發點取 frame 0 → 1 而非 progress > 0：第 0 格是一塊白方塊、還不是臉
// （見 ~/utils/blessing-face-frames），從那裡出聲會早半格。
//
// 減少動態時不會響：**不是**因為 blessingFrame 從掛載起就固定在最後一格 ——
// useOrangeCoreProgress 的 reduceMotion 是 useState、初值 false，要到 onMounted 的
// probeReduceMotion() 才翻成 true；此時 cue 的 watcher 早已就位（設定當下
// blessingFrame 還是 0），reduceMotion 一翻、blessingFrame 立刻從 0 跳到最後一格，
// 上升緣其實成立。真正擋住它的是「首次載入時 soundOn 恆為 false」（useAppSound
// 沒有持久化）→ play() no-op。
//
// 這條防線很脆弱：若日後有人給 soundOn 加上 localStorage 記憶，減少動態模式下
// 頁面一載入就會播出 3.3 秒的笑臉音。第二道防線是 useSfxCue 的 settle 閘門
// （CUE_SETTLE_MS，見該檔）——掛載後一小段時間內的變化只更新基準、不出聲，
// 但這道防線同樣不該被當成唯一保障。
const { cueOn } = useSfxCue();
cueOn(() => blessingFrame.value >= 1, 'benedictionSmile');

// 夥伴清單整塊的現身時機。
//
// 它從頭到尾都貼著臉的下緣（同一個剛體，見 style 裡 margin-top 的算式），所以這個
// 門檻現在**只管敘事**：臉逐格畫完（progress 1）才輪到清單，在那之前雖然頂端已經
// 露在畫面裡，但透明。改版前它還兼著遮住「清單從畫面底部滑上來」的過程 ——
// 那個問題已經從幾何上消失了。
//
// 門檻做遲滯（進 0.999 / 出 0.9）而非單一值：交界處微幅上下捲不會反覆閃爍，
// 真的往回看臉的動畫才收回去、下次重新現身。
const partnersIn = ref(false);
watch(blessingProgress, (p) => {
  if (p >= 0.999) partnersIn.value = true;
  else if (p < 0.9) partnersIn.value = false;
});

// 面板淡入閘：階梯線畫完**且 outro 尚未開始**才淡入 —— 連續快捲時 stairsDone
// 會落在淡出窗口內，面板閃一下就消失。已顯示的面板不收回，stairsDone 重置才收回。
const panelIn = ref(false);
watchEffect(() => {
  if (!stairsDone.value) panelIn.value = false;
  else if (partnersOpacity.value >= 1) panelIn.value = true;
});

// 閘門擋不住「已在飛行中的淡入」（淡入到一半整塊才開始淡出＝仍會閃），
// 所以 outro 一開始就把面板 opacity 凍在當下值、關掉 transition，回捲到 opacity 1 才解凍。
const panelRef = ref<HTMLElement | null>(null);
watch(
  () => partnersOpacity.value < 1,
  (out) => {
    const el = panelRef.value;
    if (!el) return;
    if (out) {
      el.style.opacity = getComputedStyle(el).opacity;
      el.style.transition = 'none';
    } else {
      el.style.opacity = '';
      el.style.transition = '';
    }
  },
);

// outro 期間把夥伴清單裁到 veil 的現行寬度：veil 收得比清單窄後，露在橘柱外的
// 白字落在白底上會憑空消失 —— 裁掉後文字改由橘柱邊緣「掃掉」。窗口外一律清除裁切。
const veilRef = ref<HTMLElement | null>(null);
watch(blessingOutProgress, (p) => {
  const block = partnersRef.value;
  const v = veilRef.value;
  if (!block || !v) return;
  if (p <= 0 || p >= 1) {
    block.style.clipPath = '';
    return;
  }
  const vr = v.getBoundingClientRect();
  // veil 還沒現身（rect 為 0，如 reduced-motion 不建 timeline）就別裁
  if (!vr.width) {
    block.style.clipPath = '';
    return;
  }
  const br = block.getBoundingClientRect();
  const left = Math.max(0, vr.left - br.left);
  const right = Math.max(0, br.right - vr.right);
  block.style.clipPath =
    left > 0.5 || right > 0.5 ? `inset(0 ${right}px 0 ${left}px)` : '';
});

// 逐格臉量尺的高度。ScrollTrigger 是 top top → bottom bottom，可跑的捲動距離＝「尺高 − 100vh」，
// 所以要 +1，實際動畫距離才等於 BLESSING_VH × 100vh（見 ~/utils/orange-core-config）。
// 寫成 BLESSING_VH × 100vh 是錯的 —— 動畫只會剩 (BLESSING_VH − 1) 個視窗高可跑。
// 用 vhLength 而非字面 vh：視窗高有單一來源（--vh），見 ~/utils/viewport-height。
const faceTrackHeight = vhLength(1 + BLESSING_VH);

const { vhPx } = useViewportHeight();

const sectionRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const unitTrackRef = ref<HTMLElement | null>(null);
const unitRef = ref<HTMLElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);
const screenRef = ref<HTMLElement | null>(null);
const faceRef = ref<HTMLElement | null>(null);
const partnersRef = ref<HTMLElement | null>(null);
let coverST: ScrollTrigger | null = null;
let faceST: ScrollTrigger | null = null;
let outroST: ScrollTrigger | null = null;
let pinST: ScrollTrigger | null = null;
let innerRO: ResizeObserver | null = null;
let partnersRO: ResizeObserver | null = null;
let unitRO: ResizeObserver | null = null;

// 夥伴清單是否定住閱讀。**只在它塞得進視窗（扣掉 header）時才定住** ——
// 塊高逐斷點不同（pc 778 / pad 1044 / mob 769），pad 在 1024 高、mob 在 667 高的
// 視窗都比視窗還高。那種情形定住會讓下緣永久留在畫面外（改成貼底則換成階梯線被切），
// 使用者反而看得更少，所以退回原本的自然捲動、定格行程收成 0。
//
// 用 vhPx() 的凍結值而非 window.innerHeight：後者會隨行動裝置網址列收合而變，
// 會讓這個判斷在捲動途中翻面 —— 連帶把 100vh 的行程加進／拿掉，版面直接跳。
const partnersHeld = ref(false);
const headerPx = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--header-height',
    ),
  ) || 0;
const syncPartnersHeld = () => {
  const el = partnersRef.value;
  if (!el) return;
  partnersHeld.value = el.offsetHeight <= vhPx(1) - headerPx();
};

/* ── 剛體（.section3__unit）：臉屏 ＋ 夥伴清單 ───────────────────────────
 *
 * 兩塊住在同一個元素裡，相對位置純粹由版面決定 → 捲動全程恆定，不會有一個先滑走。
 * 代價是「定格」不能再交給 sticky：一個元素只有一個 sticky 錨點，而這段需要兩個 ——
 *
 *   ① 臉屏定格（臉在畫面正中）→ ② 自由捲一段 → ③ 清單定格（清單頂貼 header）
 *
 * 所以改成手動 pin：定格窗口內 position: fixed，窗口外 position: absolute 停在軌道
 * 兩端（top: 0 / bottom: 0）。這正是 GSAP pin 在做的事，但不經過 pin-spacer ——
 * 檔頭那句「不 pin：少一層 transform／containing block 的雷」仍然成立，而且同一個
 * 元素本來就不能被兩條 trigger 各 pin 一次（兩個 pin-spacer 會打架），這段偏偏要兩段。
 *
 * 軌道（.section3__unit-track）的高度 ＝ 剛體高 ＋ ① 的長度 ＋ ③ 的長度，展開後
 * 恰好等於改版前「face-track ＋ 清單（含負 margin）＋ 定格 spacer」的總和 ——
 * `.section3` 的總高一格未變，下游 media 的 pin 起點因此零位移
 * （算式與等價性見 blessingUnitTrackHeight，由 test/blessing-unit-track.spec.ts 守著）。
 */
const unitH = ref(0);
const syncUnitHeight = () => {
  const el = unitRef.value;
  if (!el) return;
  unitH.value = el.offsetHeight;
};

// 量到之前（SSR 與 hydration 之前）不給 inline height，由 SCSS 的估值頂著。
const unitTrackStyle = computed(() =>
  unitH.value
    ? {
        height: `${blessingUnitTrackHeight(
          unitH.value,
          vhPx(1),
          partnersHeld.value,
        )}px`,
      }
    : undefined,
);

// 軌道高度一變，`.section3` 的高度就跟著變 → 每一條 ScrollTrigger 量到的位置全部過期。
// 必須自己 refresh：它是靠 inline style 長出來的，既不觸發 resize、也不在 GSAP
// 自動 refresh 的時機上。等 nextTick 是因為它綁在 ref 上，樣式下一個 tick 才進 DOM
// —— SSR 沒有這個高度，hydration 後才寫進去，而那時 ScrollTrigger 已經建好了。
// 走 refreshScrollTriggers()（先 sort 再 refresh）而非裸 refresh：改變的是
// `.section3` 的高度，下游 Media 段的 pin 起點全部跟著移動 —— 那些 pin 的建立順序
// 與位置順序無關，不先 sort 就可能用舊的佔位重算（見 utils/scroll-trigger）。
watch(unitTrackStyle, async () => {
  await nextTick();
  refreshScrollTriggers();
});

// 剛體的狀態。'flow' 是還沒接手前的自然流（SSR 與 hydration 之前），
// 其餘五個見 style 裡的 .section3__unit。
type PinState = 'flow' | 'enter' | 'pin-face' | 'transit' | 'pin-list' | 'exit';

// 定格幾何。全部在 refresh 時算一次 —— 捲動途中只比大小，不量 rect。
let pinStart = 0; // 軌道上緣的文件座標（＝ pinST.start）
let pinRunway = 0; // ① 的長度 ＝ faceST 的可跑距離
let pinHoldTop = 0; // ③ 的錨點：剛體上緣的視窗 y（負值）
let pinPark = 0; // ④ 的起點：軌道上緣的視窗 y
let pinState: PinState = 'flow';

const measurePin = (start: number) => {
  const unit = unitRef.value;
  const partners = partnersRef.value;
  if (!unit || !partners) return;
  pinStart = start;
  pinRunway = BLESSING_VH * vhPx(1);
  // 清單在剛體內的 y。量 offsetTop 而非用 (100vh + --face-block-h) / 2 推：量到的值
  // 自動跟著負 margin、padding 與斷點走，不必在 JS 再抄一份 CSS 的算式。
  // （offsetParent 在 'flow' 態是 `.section3`、其餘態是剛體本身，但軌道與剛體的上緣
  //   都疊在 section 上緣，兩種情形量到的是同一個數。）
  pinHoldTop = headerPx() - partners.offsetTop;
  // ④ 的起點：剛體以 bottom: 0 停在軌道下緣時，它的上緣正好落在 ③ 的錨點上 ——
  //   剛體上緣 ＝ ty + 軌道高 − 剛體高 ＝ pinHoldTop
  //   而 軌道高 − 剛體高 ＝ (BLESSING_VH ＋ 定格) × 視窗高（見 blessingUnitTrackHeight）
  // 兩段因此無縫接上：③ 放手的那一刻剛體正好貼在軌道下緣，位置零位移。
  // 用算式而非量 DOM：軌道的 inline height 是 ref 驅動的，要下一個 tick 才進 DOM，
  // 量 offsetHeight 會在剛掛載那一瞬間拿到還沒套上的舊值。
  // 沒有定格（清單塞不進視窗）時後面那一項是 0 → ③ 的窗口自然收成 0，不必特判。
  pinPark =
    pinHoldTop -
    pinRunway -
    (partnersHeld.value ? BLESSING_PARTNERS_HOLD_VH * vhPx(1) : 0);
  unit.style.setProperty('--unit-transit-top', `${pinRunway}px`);
  unit.style.setProperty('--unit-hold-top', `${pinHoldTop}px`);
};

// class 用 classList 直接寫、不走 ref → template。ref 要等下一個 tick 才進 DOM，
// 而這裡切的是 fixed / absolute：慢一幀就是使用者看得到的一下跳動。
// （同一份取捨見上面 panelRef 的 opacity 凍結。）
const setPinState = (next: PinState) => {
  const el = unitRef.value;
  if (!el || next === pinState) return;
  el.classList.remove(`is-${pinState}`);
  el.classList.add(`is-${next}`);
  pinState = next;

  // GA section_view：benediction。
  //
  // ⚠️ 不掛 v-ga-view：這一段是**手動 pin**（is-pin-face / is-pin-list 會把剛體切成
  //    position: fixed，見下方 .section3__unit），釘住期間它恆在視窗內，
  //    IntersectionObserver 會在剛體剛接手時就成立、之後永遠成立。
  // 用 'enter' 之後的第一個狀態當門檻：'enter' 只代表軌道上緣還在視窗內（段落正在進場），
  // 'pin-face' 才是臉屏真的被定住、使用者確實在看這一段。
  if (next !== 'flow' && next !== 'enter') gaSectionViewOnce('benediction');
};

const applyPinState = (scroll: number) => {
  // ty ＝ 軌道上緣此刻的視窗 y（往下捲遞減）。用 start − scroll 而非量 rect：
  // 捲動途中讀 getBoundingClientRect 會逼出一次同步版面計算。
  const ty = pinStart - scroll;
  setPinState(
    ty > 0
      ? 'enter'
      : ty > -pinRunway
        ? 'pin-face'
        : ty > pinHoldTop - pinRunway
          ? 'transit'
          : ty > pinPark
            ? 'pin-list'
            : 'exit',
  );
};

// 把臉＋文字這一整塊的實際高度寫進 --face-block-h，供 .section3__partners 的負 margin
// 與臉屏的 min-height 用。量 offsetHeight 而非寫死數字：pad / mob 是直排，
// 塊高會隨文案斷行改變。
//
// ⚠️ 一定要寫在 section 根節點：.section3__partners 是臉屏的**兄弟**，自訂屬性只往下
//    繼承，寫在臉屏上它讀不到（會靜靜退回 fallback 280px —— pc 剛好對，
//    pad / mob 就整個歪掉）。
//
// --face-cell-y ＝ 臉框上緣在臉屏內的 y ＝ 白方塊要走的距離
// （起點是臉屏上緣，而 cover 期間臉屏上緣就是色塊上緣＝接縫）。
//
// ⚠️ 一定要量、不能用 --face-block-h 推：pc 的臉是 .section3__face-inner 的第一個
//    flex item（臉框上緣 ＝ inner 上緣），但 **pad／mob 的 .section3__face 是
//    order: 2、排在文字下方**，臉框上緣還要加上 intro 高度與 gap，CSS 算不出來。
//
// 量相對值（兩個 rect 相減）而非絕對座標：臉屏會隨剛體在 absolute / fixed 之間切換而
// 換座標系，相對值不會 —— 這個偏移純粹是版面內部的事。
// 這也是「臉屏維持一個視窗高、內容置中」不能省的理由之一：cover 期間剛體停在
// 軌道上緣（＝ section 上緣 ＝ 接縫），臉屏上緣就是接縫，量到的 y 正好是白方塊的行程。
const syncFaceMetrics = () => {
  if (!sectionRef.value || !innerRef.value) return;
  sectionRef.value.style.setProperty(
    '--face-block-h',
    `${innerRef.value.offsetHeight}px`,
  );

  if (!screenRef.value || !faceRef.value) return;
  const y =
    faceRef.value.getBoundingClientRect().top -
    screenRef.value.getBoundingClientRect().top;
  sectionRef.value.style.setProperty('--face-cell-y', `${y}px`);
};

onMounted(() => {
  syncFaceMetrics();
  // 臉屏是 align-items: center（不是 stretch）→ 內層的高度由內容決定，不會被臉屏的
  // min-height 回頭撐大，所以不會有 observe → 改高 → 再觸發 observe 的迴圈。
  if (innerRef.value && typeof ResizeObserver !== 'undefined') {
    innerRO = new ResizeObserver(syncFaceMetrics);
    innerRO.observe(innerRef.value);
  }

  // 塊高（斷點、logo 到齊）與視窗高都會變，所以兩個訊號都要聽：
  // ResizeObserver 只看元素，純粹的視窗變高不會觸發它。
  syncPartnersHeld();
  if (partnersRef.value && typeof ResizeObserver !== 'undefined') {
    partnersRO = new ResizeObserver(syncPartnersHeld);
    partnersRO.observe(partnersRef.value);
  }
  window.addEventListener('resize', syncPartnersHeld, { passive: true });

  // 剛體高 → 軌道高。不會回授：軌道長高不會回頭改變剛體的高度（剛體是絕對定位、
  // 左右撐滿、高度由內容決定），所以沒有 observe → 改高 → 再觸發 observe 的迴圈。
  syncUnitHeight();
  if (unitRef.value && typeof ResizeObserver !== 'undefined') {
    unitRO = new ResizeObserver(syncUnitHeight);
    unitRO.observe(unitRef.value);
  }

  gsap.registerPlugin(ScrollTrigger);

  // 02 → 03 覆蓋過場：色塊上緣從視窗底緣升到視窗頂緣。
  // `top bottom` → `top top` 幾何上恆為一個視窗高，不需要（也不該有）長度旋鈕。
  // trigger 用 sectionRef 而非 trackRef：量的是 section 的上緣 ＝ 色塊上緣 ＝ 接縫。
  // 與 faceST 首尾相接不重疊：那條的 start（`.section3__ruler` 的 top top）
  // 就是本條的 end。
  //
  // onRefresh 不是可有可無的：header 的 #blessing 是深連結，直接落在段落中段時
  // onUpdate 不保證會發火 → coverProgress 留在 0 → 使用者看到滿版淺藍色塊。
  if (sectionRef.value) {
    coverST = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'top top',
      invalidateOnRefresh: true,
      onUpdate: (self) => setCoverProgress(self.progress),
      onRefresh: (self) => setCoverProgress(self.progress),
      onLeaveBack: () => setCoverProgress(0),
      onLeave: () => setCoverProgress(1),
    });
  }

  if (!trackRef.value) return;
  faceST = ScrollTrigger.create({
    trigger: trackRef.value,
    start: 'top top',
    end: 'bottom bottom',
    invalidateOnRefresh: true,
    onUpdate: (self) => setBlessingProgress(self.progress),
    // 深連結（header 的 #blessing）直接落在段落中段時 onUpdate 不保證發火，
    // 進度會留在 0 → 臉停在第 0 格。同 coverST 的理由。
    onRefresh: (self) => setBlessingProgress(self.progress),
    onLeaveBack: () => setBlessingProgress(0),
    onLeave: () => setBlessingProgress(1),
  });

  // 03 → 04 過場第一拍：夥伴清單淡出。
  // 終點固定在「section 下緣抵達視窗頂」；起點往回退 BLESSING_OUT_VH 個視窗高
  // （那個常數是整段退場的長度旋鈕，見 orange-core-config）。
  //
  // ⚠️ 它與 media 拍 0（融合拍）現在是**同一段窗口**，不是首尾相接的兩段：
  //   本條的起點就是 media 那條 ScrollTrigger 的 start（同一個捲動位置，
  //   見 useMediaIntroMotion 的 st——它的 start 提前 runwayPx＝BLESSING_OUT_VH
  //   個視窗高，與這裡的 outroBack 是同一個 BLESSING_OUT_VH）。清單淡出、veil
  //   收窄、morph 收窄三件事吃的是同一段捲動距離，BLESSING_OUT_VH 是共用的
  //   長度旋鈕，兩邊各自算自己的百分比只是因為 trigger 元素不同。
  //
  // 百分比先 Math.round：0.6 × 100 在 IEEE754 下是 60.000000000000006，
  // 直接內插會餵給 ScrollTrigger 一串沒必要的小數。
  //
  // trigger 用 sectionRef 而非 trackRef：量的是整段的下緣（＝與 media 的接縫）。
  const outroBack = Math.round((1 - BLESSING_OUT_VH) * 100);
  outroST = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: `bottom bottom-=${outroBack}%`,
    end: 'bottom top',
    invalidateOnRefresh: true,
    onUpdate: (self) => setBlessingOutProgress(self.progress),
    onRefresh: (self) => setBlessingOutProgress(self.progress),
    onLeaveBack: () => setBlessingOutProgress(0),
    onLeave: () => setBlessingOutProgress(1),
  });

  // 剛體的手動 pin。**不餵任何 progress、也不掛 animation** —— 它只在四個門檻上換
  // class（見 applyPinState），上面三條 scrub 的 trigger / start / end 完全沒動。
  //
  // 範圍取「軌道上緣抵達視窗頂」→「軌道下緣抵達視窗頂」：整段狀態機都在裡面，
  // 兩端之外由 onLeaveBack / onLeave 補上終端狀態（同上面三條的理由 —— 深連結
  // 直接落在段落中段時 onUpdate 不保證發火）。
  //
  // onRefresh 一定要重量：--vh、斷點、字體到齊都會改變 pinHoldTop 與 pinPark，
  // 而它們是 fixed 的錨點 —— 過期的話定格會定在錯的地方。
  if (unitTrackRef.value) {
    pinST = ScrollTrigger.create({
      trigger: unitTrackRef.value,
      start: 'top top',
      end: 'bottom top',
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        measurePin(self.start);
        applyPinState(self.scroll());
      },
      onUpdate: (self) => applyPinState(self.scroll()),
      onLeaveBack: () => setPinState('enter'),
      onLeave: () => setPinState('exit'),
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncPartnersHeld);
  partnersRO?.disconnect();
  partnersRO = null;
  innerRO?.disconnect();
  innerRO = null;
  unitRO?.disconnect();
  unitRO = null;
  // kill(false)：換頁時舊頁還在畫面上淡出，而 outroST 的 revert 會把 --outro-white
  // 打回 0 —— 本段底色從白硬切回橘，整屏橘閃一下。coverST 同理（--cover-orange）。
  // pinST 沒有 revert 的問題（它不掛 animation、也不寫進度），但一樣走同一個入口。
  // 完整機制見 utils/scroll-trigger 的 killScrollTriggers。
  killScrollTriggers(coverST, faceST, outroST, pinST);
  coverST = null;
  faceST = null;
  outroST = null;
  pinST = null;
});
</script>

<template>
  <!-- data-anchor-offset-vh：header 按下「永續祝福」時要落在段落內多深（× 視窗高）。
       段落上緣是 02 → 03 覆蓋過場的接縫 —— 那一刻臉還沒開始畫，設計師要的落點是
       「第一顆笑臉逐格走完」的那一刻。深度由本段自己宣告（header 不認得任何 section，
       同 data-header-theme／data-anchor-target 的分工），算式與理由見 BLESSING_ANCHOR_VH
       與 ~/utils/anchor-landing。 -->
  <!-- data-header-theme 跟著底色走：融合拍一開始底色就硬切成白（--outro-white，見下方
       .section3 的 background），此時畫面上僅存的橘是那塊會收窄的 veil／morph。
       那塊橘由 header 的反白窗負責（useMediaIntroMotion 把它的左右緣交給 useHeaderBand），
       段落這邊就該老實宣告「我的底色是白的」—— 否則窗**外**那段會維持橘主題，
       疊成「白底上一條 70% 橘」的淡橘列，與收窄後應該露白的設計不符。
       ⚠️ 綁定不影響 SSR：outroWhite 初值 0 → 輸出仍是 orange，屬性本身在 SSR 就存在，
          符合 AppHeader onMounted 收集 [data-header-theme] 的前提。 -->
  <section
    id="blessing"
    ref="sectionRef"
    class="section3"
    :class="{ 'is-outro': outroWhite }"
    :data-header-theme="outroWhite ? 'light' : 'orange'"
    :data-anchor-offset-vh="BLESSING_ANCHOR_VH"
    :style="{ '--cover-orange': coverOrange, '--outro-white': outroWhite }"
  >
    <!-- 融合橘幕：03 → 04 過場那塊會收窄的橘。它與 `.media__morph` 是**同一個 GSAP
         tween 的兩個 target**（見 useMediaIntroMotion 拍 0），收窄到 MEDIA_BLOCK_VW
         時同色同寬同位，硬切交棒。設計見
         architecture/2026-08-18-blessing-media-morph-fusion-design.md。

         ⚠️ 必須是 `.section3` 的**第一個**子元素：它要在本段底色之上（底色會切白，
            由 veil 遮住）、在臉屏與夥伴清單**之下**（清單要照舊淡出，不能被橘幕蓋掉）。
            兩件事靠 DOM 順序就成立，不需要 z-index —— 後面的兄弟都是 positioned
            （relative / sticky），依樹序畫在它之上。挪到後面就會蓋掉夥伴清單。
         ⚠️ 必須是 `v-show` 而不是 `v-if`：timeline 在 Media.vue 的 onMounted 就建好，
            那時 cover 還沒跑完 —— `v-if` 之下元素不在 DOM，GSAP 抓不到 target，
            整拍靜靜不播。`display: none` 與 GSAP 的 autoAlpha 互不干擾，兩層閘門可疊。
         ⚠️ 掛載時機是 coverDone（覆蓋過場跑完）：veil 是 fixed 滿版，更早掛會在覆蓋
            過場期間就蓋掉整個視窗，那段過場直接破功。 -->
    <div
      v-show="coverDone"
      ref="veilRef"
      class="section3__veil"
      data-morph-veil
      aria-hidden="true"
    />

    <!-- 逐格臉的量尺：faceST 唯一的 trigger。
         **絕對定位、不佔流內高度** —— 它的上緣就是 section 上緣、高度仍是
         (1 + BLESSING_VH) × 100vh，所以 `top top` → `bottom bottom` 量到的
         start / end / progress 與改版前逐幀相同（見 architecture 的設計筆記）。
         改版前這個角色由 `.section3__face-track` 兼任（既是量尺、又是 sticky 臉屏的
         容納塊）；現在臉屏與夥伴清單合併成一個手動 pin 的剛體，容納塊換成
         `.section3__unit-track`，量尺就得自己獨立出來、且不能再佔流內高度。 -->
    <div
      ref="trackRef"
      class="section3__ruler"
      :style="{ height: faceTrackHeight }"
      aria-hidden="true"
    />

    <!-- 剛體的軌道 ＝ 本段**全部**的流內高度（＝改版前 face-track ＋ 清單 ＋ 定格
         spacer 三者的總和，見 script 的 unitTrackHeight）。剛體本身是絕對定位、
         不佔位，所以這裡的高度必須明寫 —— 就是 GSAP pin-spacer 在做的事。 -->
    <div
      ref="unitTrackRef"
      class="section3__unit-track"
      :style="unitTrackStyle"
    >
      <!-- ①＋② 剛體：臉屏與夥伴清單的相對位置由**版面**決定，捲動過程中恆定不變。
           它的四個狀態（enter / pin-face / transit / pin-list / exit）由 pinST 以
           class 切換，見 script 的 applyPinState。 -->
      <div ref="unitRef" class="section3__unit">
        <!-- ① 逐格臉屏 -->
        <div ref="screenRef" class="section3__face-screen">
          <div ref="innerRef" class="section3__face-inner">
            <div ref="faceRef" class="section3__face">
              <!-- 逐格臉：cover 跑完才現身，與白方塊交棒（兩者同格同色同位置 → 硬切）。
                   門檻掛在 svg 自己身上，**不是** .section3__face —— 白方塊住在後者裡面，
                   藏外層會把方塊一起藏掉。 -->
              <BlessingFace
                class="section3__face-art"
                :class="{ 'is-in': coverFaceVisible }"
                :frame="blessingFrame"
              />

              <!-- 白方塊：紙飛機沒入色塊後從接縫長出來的那一格 ＝ 逐格臉的第 01 格
                   （FACE_FRAMES[0] = [7,0,2,2]）。位置用網格比例寫死、不需量測；
                   只有位移的幅度要量（--face-cell-y，見 script）。
                   --cover-grow ＝ 從接縫「長出來」的高度比例，與飛機下潛共用同一條
                   曲線（coverHandoff）—— 兩者同一個 x、同一個窗口，是同一個變身。 -->
              <span
                v-if="coverSeedVisible"
                class="section3__face-seed"
                :style="{
                  '--cover-seed': coverSeed,
                  '--cover-grow': coverHandoff,
                }"
                aria-hidden="true"
              />
            </div>

            <div class="section3__intro">
              <!-- 稿字形素材（白字）＋ visually-hidden 的真文字，機制見
                   architecture/2026-08-12-forum1-text-art-design.md。行盒仍是 line-height
                   撐出來的，故標題高度不變 —— 下面那兩個量測值（--face-block-h／--face-cell-y）
                   靠它。⚠️ <UArtLine> 現在不只論壇在用（見它的檔頭）。 -->
              <h2 class="section3__title">
                <UArtLine class="section3__title-art" :line="partner.title" />
              </h2>
              <p class="section3__body">{{ partner.body }}</p>
            </div>
          </div>
        </div>

        <!-- ② 夥伴清單：位置由版面固定在臉的下緣（負 margin，見 style），
             捲動過程中永遠貼著臉；淡入仍壓在臉的捲動尺跑完那一刻（partnersIn），
             但那已經只是「就地淡入」—— 它不會再從畫面下方滑上來。
             段落尾端整塊淡出（過場第一拍）。 -->
        <div
          ref="partnersRef"
          class="section3__partners"
          :class="{
            'is-in': partnersIn,
            'is-out': partnersOpacity < 1,
          }"
          :style="{ '--partners-out': partnersOpacity }"
        >
          <BlessingStairs v-model:done="stairsDone" :armed="partnersIn" />

          <div
            ref="panelRef"
            class="section3__partners-panel"
            :class="{ 'is-in': panelIn }"
          >
            <BlessingPartners />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section3 {
  position: relative;
  // 疊在 forum 之上：覆蓋過場 ＝「forum 尾段 sticky 定住 ＋ 本段負 margin 蓋上去」。
  // ⚠️ 負 margin 必須與 Forum.vue 的 .sec2__cover-hold 同值（兩邊都從 --vh 取），
  //    否則頁面總高會變、Media 位移，blessing → media 那段過場的節奏就得重調。
  // ⚠️ 只給本段 z-index，**不要**給 .sec2 —— 那會讓 .sec2 變成 stacking context，
  //    把裡面 <ForumCore> 的 z-index: 20 關進去。.sec2__path 也是 z-index: 1，
  //    同值由 DOM 順序決勝，本段在後、贏。
  z-index: 1;
  margin-top: calc(#{vh()} * -1);
  // 藍 → 橘：--cover-orange 由 coverOrangeAt(coverProgress) 餵入（見 script）。
  // 設計師：「小飛機碰觸到下方色塊時色塊變橘色」→ 接觸點前是淺藍。
  // fallback 1（純橘）→ SSR 與 trigger 建好之前都不會閃一下藍。
  // 兩個色都是 token，不寫死色值（test/design-tokens.spec.ts 守著）。
  // 退路：不支援 color-mix 的瀏覽器會整條丟掉下面那個宣告，若沒有這一行，色塊會**沒有背景**
  // ——變透明、露出底下的 forum，整段覆蓋直接破功。給純橘 ＝ 降級成「全程橘、少了藍色那一拍」，
  // 那是這段轉場最安全的落點（橘是它最終、也是最長的狀態）。
  background: var(--color-orange);
  // 藍 → 橘 → 白：外層那次 mix 是 03 → 04 融合拍的「底色切白」（--outro-white 由
  // outroWhiteAt 餵入，二元），內層維持原本的藍 → 橘（--cover-orange）。
  // 切白那一刻 `.section3__veil` 剛好是滿版、完全遮住，所以看不到硬切。
  background: color-mix(
    in srgb,
    #fff calc(var(--outro-white, 0) * 100%),
    color-mix(
      in srgb,
      var(--color-orange) calc(var(--cover-orange, 1) * 100%),
      var(--color-blue)
    )
  );
  color: #fff;

  // 藍 → 橘的補間交給 CSS：--cover-orange 現在是二元的（見 coverOrangeAt），
  // 只在接觸點跨越一次，所以 transition 不會有「每一幀追補間」的發黏問題。
  // 0.4s ease 對齊本檔其他淡入淡出（.section3__partners / .section3__partners-panel）。
  transition: background-color 0.4s ease;

  // 退場翻白必須是**真的**硬切 —— 這一條就是 outroWhiteAt 那句「硬切、不補間」在
  // CSS 這端的另一半。上面那個 0.4s 是給藍 → 橘（--cover-orange）用的，但兩個變化
  // 走同一個 background，補間會把 --outro-white 的硬切一起拉成 0.4s。
  //
  // 為什麼不能拉：硬切之所以看不到，前提是「切換那一刻 veil 剛好滿版、完全遮住底色」。
  // 補間讓那個「一刻」變成 0.4s，而拍 0 的 FUSE_EASE 頭段很快（power2.out）——
  // 2026-08-22 實測（1440×900）：底色跑完 0 → 400ms 的補間時，veil 早已收到 81% 寬，
  // 兩側因此漏出一條還沒轉白的淡橘，接縫上下變成兩種白。
  //
  // ⚠️ 往回捲（is-outro 移除）時補間會被復原，白 → 橘那一下仍會補間 0.4s；那一刻
  //    veil 正回到滿版、把它整個蓋住，所以看不到 —— 與硬切同一個前提，方向相反。
  &.is-outro {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

// 融合橘幕：03 → 04 過場那塊會收窄的橘（見 template 的三條 ⚠️）。
// 全程只吃 scaleX（GSAP 寫入），不觸發 reflow。
//
// ⚠️ `fixed` 的定位基準是視窗，前提是祖先沒有 transform / filter / backdrop-filter /
//    will-change。`.section3` 目前只有 position: relative 與 z-index: 1 ——
//    **任何人給 `.section3` 加 transform，本層會安靜地退化成 section 相對定位**，
//    症狀是過場期間橘幕只蓋住 section 自己的範圍、接縫變成看得見的橫線。
// ⚠️ 不設 z-index：疊層完全靠 DOM 順序（見 template）。給了 z-index 反而要同時
//    維護後面每個兄弟的值。
// ⚠️ 初始 visibility: hidden（同 `.media__morph`）：timeline 的 fromTo 起播才現身。
//    這同時是兩條降級路徑（reduce-motion / 無 JS）的正確落點 —— 那些路徑
//    不建 timeline，本層就永遠不現身，而底色也不會切白（見 outroWhiteAt）。
// ⚠️ width: 100vw（不是 inset: 0 / width: 100%）＋ left: 50% ＋ GSAP 的
//    xPercent: -50 置中（同 .media__bar / .media__line 那招）：這是與 morph 共用
//    寬度基準的唯一手段。`100vw` 含捲軸寬，`inset: 0` 的 ICB（＝documentElement.
//    clientWidth）不含；而 morph 的 scaleX 吃的是 window.innerWidth（含捲軸）。
//    2026-08-19 實測（1465×863、捲軸 15px）：inset: 0 版位量到 1450，
//    比 innerWidth 少 15px，收窄終點因此恆定少 9px（15 × MEDIA_BLOCK_VW 0.6）
//    ——即使 useMediaIntroMotion.ts 試著在 build time 量 clientWidth 除回去也救不了，
//    因為 buildMotion() 跑在 onMounted，那一刻捲軸還沒撐出來，量到的其實是
//    innerWidth（見該檔拍 0 的舊 ⚠️，已移除）。換成 inset: 0 或 width: 100% 都會
//    重現這個落差，因為兩者的 ICB 都不含捲軸。
.section3__veil {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 100vw;
  background: var(--color-orange);
  transform-origin: 50% 50%;
  visibility: hidden;
  pointer-events: none;
}

// 逐格臉的量尺（faceST 的 trigger）。絕對定位、不佔流內高度、不吃事件 ——
// 它唯一的作用是提供「上緣 ＝ section 上緣、高 ＝ (1 + BLESSING_VH) × 100vh」這組幾何，
// 讓改版後的 start / end / progress 與改版前逐幀相同（見 template 的說明）。
.section3__ruler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  // height 由 inline style 給（(1 + BLESSING_VH) × 100vh）
}

// 剛體的軌道 ＝ 本段全部的流內高度。
//
// height 由 JS 量測後以 inline style 覆蓋（見 script 的 unitTrackStyle）。**量到之前
// 刻意留 auto** —— 那一刻剛體還是 static（見下方），軌道高就等於剛體高，SSR 與
// hydration 之前的版面因此是「臉屏 100vh ＋ 清單」自然堆疊，不會塌成 0
//（若在這裡寫死估值，就等於把 BLESSING_VH / BLESSING_PARTNERS_HOLD_VH 這兩個
//  只存在於 TS 的旋鈕再抄一份到 SCSS —— 兩份會各自漂走）。
//
// ⚠️ 必須是 positioned：剛體 pin 起來之後是 absolute，要以本層為定位基準；同時它也是
//    template 裡橘幕那條「後面的兄弟都是 positioned，依樹序畫在它之上」的一環。
.section3__unit-track {
  position: relative;
}

// 剛體：臉屏 ＋ 夥伴清單。base 是「還沒量到、還沒接手」的自然流狀態，其餘五個由
// applyPinState 依捲動位置切換（見 script 的 PinState）：
//
//   .is-enter     進場前 —— 停在軌道上緣，隨頁面上來（cover 過場就在這個狀態）
//   .is-pin-face  ① 臉屏定格 —— 臉在畫面正中
//   .is-transit   ② 自由捲 —— 停在軌道內 BLESSING_VH 個視窗高處，隨頁面上移
//   .is-pin-list  ③ 閱讀定格 —— 清單頂貼 header（錨點是負值，臉退到 header 後面）
//   .is-exit      ④ 退場 —— 停在軌道下緣，隨頁面捲走
//
// 兩個定格用 fixed 而非 sticky：sticky 一個元素只有一個錨點，這裡需要 ① 與 ③ 兩個
// （完整理由見 script 的剛體區塊）。--unit-transit-top / --unit-hold-top 由 measurePin
// 在 refresh 時寫入，捲動途中不會變。
//
// ⚠️ fixed 的定位基準是視窗，前提是祖先沒有 transform / filter / backdrop-filter /
//    will-change —— 與 `.section3__veil` 同一條約束（見它上方的 ⚠️）。給 `.section3`
//    或 `.section3__unit-track` 加 transform 會讓兩個定格通通退化成相對定位。
// ⚠️ pointer-events: none 是縱深防線（子層各自收回 auto）：剛體是一整塊比視窗還高的
//    透明盒子，定格期間鋪滿畫面，本層自己絕不該接到任何事件。
// ⚠️ 五個狀態都要 right / left: 0：離開一般流之後寬度不再自動撐滿，少了就會塌成
//    shrink-to-fit，臉與清單的欄寬、置中全部歪掉。fixed 兩態的 ICB 寬度（不含捲軸）
//    與 absolute 兩態的軌道寬度相同 —— 切換時不會有橫向跳動。
.section3__unit {
  pointer-events: none;

  &.is-enter,
  &.is-pin-face,
  &.is-transit,
  &.is-pin-list,
  &.is-exit {
    right: 0;
    left: 0;
  }

  &.is-enter {
    position: absolute;
    top: 0;
  }

  &.is-pin-face {
    position: fixed;
    top: 0;
  }

  &.is-transit {
    position: absolute;
    top: var(--unit-transit-top, 0px);
  }

  &.is-pin-list {
    position: fixed;
    top: var(--unit-hold-top, 0px);
  }

  &.is-exit {
    position: absolute;
    bottom: 0;
  }
}

// 把整塊往上拉「臉下方那塊空橘色」的高度 ——
//
//   臉屏是一個視窗高、內容置中 → 臉的下緣在 (V + h)/2；
//   本塊在剛體裡的自然位置是臉屏的下緣，也就是 V；
//   兩者要重合 → margin-top ＝ (V + h)/2 − V ＝ h/2 − V/2（負值）。
//
// **這條負 margin 就是「相對位置固定」的全部** —— 臉屏與本塊住在同一個剛體裡，
// 兩者的距離純粹由版面決定，與捲動位置、與剛體處在哪一個 pin 狀態都無關。
// （改版前兩塊是各自 sticky 的兄弟，只有在臉的捲動尺跑完那一瞬間才對齊，
//   ① 期間本塊從下方逼近、③ 期間臉往上跑掉，這就是「其中一個會先滑走」。）
// h 由 --face-block-h 帶入（JS 量 .section3__face-inner，見 script）；
// fallback 280px ＝ pc 臉的高度，SSR 與 hydration 之前不會歪。
//
// padding-top ＝ 設計稿的「臉下緣 → 階梯線」距離：
//   pc  20 ＝ 永續祝福04 的階梯線 y20（臉貼齊帶底 420）
//   pad 64 ＝ 帶底剩 826 − (513.77+280) ≈ 32，再加階梯線 y32
//   mob 27 ＝ 階梯線 y27（臉貼齊帶底 596）
// gap 則是設計稿的「階梯線 → 面板」距離。
//
// 淡入仍壓在 progress 1（見 script 的 partnersIn）：本塊在 ① 期間就已經定在臉的
// 下緣、頂端甚至已經露在畫面裡，藏著是為了「臉畫完才輪到清單」的敘事 ——
// 而不再是為了遮住它滑上來的過程（現在它根本不會滑）。
.section3__partners {
  // ⚠️ **不可以是 static。** 上面那個負 margin 讓本塊的頂端疊進 .section3__face-screen
  //    的最後 (100vh − h)/2 px，而臉屏是 position: relative、DOM 又在前。
  //    static 之下本塊依繪製順序落在它**之下**，面板頂端那一條就變成
  //    「看得到、摸不到」：hit test 命中的是臉屏那塊空白（它沒有背景，所以看不出來），
  //    內卷軸完全捲不動。fixed 的 .section3__veil 同理會蓋掉整份清單（見 template）。
  //
  //    2026-08-23 實測（834×1120 ＝ iPad Pro 11" 二代直立在 Safari 的可視高）：
  //    死區 107px，elementFromPoint 命中 .section3__face-screen；改成 positioned 後
  //    4/4 命中面板。當時的中獎條件是 906 < --vh < 1127，現在死區與定格與否無關
  //    （重疊區恆等於 (100vh − h)/2），所以**每一台**都會中 —— 這條更不能拿掉。
  //    規則由 test/blessing-partners-hit-test.spec.ts 守著。
  //
  //    relative 而非別的：無偏移的 relative 與 static 的算繪結果完全相同（負 margin、
  //    --face-block-h 的算式全部不變），只是把本塊抬進 positioned 那一層。
  //    z-index 一律不給 —— 疊層全靠 DOM 順序（同 template 裡橘幕那三條 ⚠️）。
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: calc(var(--face-block-h, 280px) * 0.5 - #{vh(0.5)});
  padding: 20px 108px 60px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;

  &.is-in {
    opacity: 1;
    pointer-events: auto;
  }

  // 閱讀定格（塊高與視窗高之差就是它「完整在畫面上」的捲動距離，pc ≈122px，不定住
  // 來不及看）不在本塊上做了 —— 定住的是整個剛體（.section3__unit 的 .is-pin-list），
  // 錨點換算成「清單頂貼 header」，臉跟著一起定住。是否啟用仍由 partnersHeld 決定
  //（條件是「塊塞得進視窗」，那是量測不是斷點，見 script）。

  // 退場（過場第一拍）：scrub 驅動，**必須**關掉 transition —— 0.4s 補間會讓
  // 每一幀都滯後於捲動，手感發黏。
  // 與 .is-in 特異度相同（0,2,0），寫在後面所以贏；回捲到 opacity 1 時 class
  // 被移除、由 .is-in 的 opacity: 1 接上，值相同不會跳。
  // 刻意不寫 pointer-events：讓它從 .is-in 繼續繼承 auto，淡出過程中面板仍可
  // 捲動、可聚焦。
  &.is-out {
    opacity: var(--partners-out);
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @include rwd-max('pc') {
    gap: 32px;
    padding: 64px 57.875px 60px;
  }

  @include rwd-max('tablet') {
    gap: 24px;
    padding: 27px 48px 60px;
  }
}

// 閱讀定格行程（BLESSING_PARTNERS_HOLD_VH）不再是一個 spacer 元素，改為算進
// `.section3__unit-track` 的高度裡（見 blessingUnitTrackHeight）—— 手動 pin 的
// 活動範圍就是那條軌道，不像 sticky 要靠父層的 content box 撐。

// 夥伴清單面板：等階梯線逐格畫完（BlessingStairs 的 done）才淡入。
// 用 opacity 而非 v-if／display，讓面板一直佔位、版面不會在淡入時跳動；
// 未現身前擋掉指標事件，避免使用者捲到看不見的清單。
.section3__partners-panel {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;

  &.is-in {
    opacity: 1;
    pointer-events: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

// 臉屏＝一個視窗高、內容置中 → ① 定格期間（剛體 .is-pin-face，top: 0）臉這一塊的
// 垂直中心恆等於畫面正中，與視窗高、內容高都無關。臉與階梯線之間那塊空橘色不在這裡處理，
// 由 .section3__partners 的負 margin-top 收掉（見上方）。
//
// **不再是 sticky**：定格改由剛體整塊做（見 .section3__unit）。本層留著 100vh 這個高度
// 有三個作用：① 的置中、--face-cell-y 的量測基準（cover 期間本層上緣＝接縫）、
// 以及下面那條「信箱式空白不吃指標事件」的縱深防線。
//
// min-height 是給「視窗比內容還矮」的橫置手機用的：置中 ＋ overflow: hidden 會上下都切掉，
// 至少讓臉屏長到容得下內容。
// 臉屏整層不吃指標事件，內容（.section3__face-inner）再收回來 —— 這是上面
// .section3__partners 那條「不可以是 static」的第二道防線：本層是一整個視窗高、
// 內容置中，上下各留 (100vh − --face-block-h)/2 的**透明空白**，而那塊空白正好就是
// 夥伴清單頂端疊上來的位置。空白不接事件之後，就算哪天疊層又被改壞，
// 面板頂端也不會再變成「看得到、摸不到」。
//
// 為什麼要把 inner 收回 auto 而不是整層放生：本層裝的不只有裝飾用的臉，還有
// .section3__intro 的 <h2> 與引言 —— 整層 none 會讓那兩段文字不能選取。
// 放行 inner 不會把死區放回來：重疊區恆等於「inner 之外的空白」，兩者互斥。
.section3__face-screen {
  // relative 而非 static：夥伴清單靠負 margin 疊上來，兩者都是 positioned 時
  // 由 DOM 順序決勝（清單在後、贏）—— 見 .section3__partners 的第一條 ⚠️。
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: vh();
  min-height: var(--face-block-h, 280px);
  overflow: hidden;
  pointer-events: none;
}

// pc：臉在左、文字在右；pad / mob：文字在上、臉在下
.section3__face-inner {
  // 把臉屏那層 pointer-events: none 收回來（理由見臉屏的註解）——
  // 標題與引言要能選取，臉本身是 aria-hidden 的裝飾，順帶放行不影響任何事。
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 180px;
  width: 100%;
  // 不加 padding-bottom：這一塊的 offsetHeight 就是 --face-block-h，多出來的內距會讓
  // 「下緣＝臉屏下緣」不成立，也會把置中算式推歪。臉→階梯線的距離一律由
  // .section3__partners 的 padding-top 給。
  padding: 0 108px;

  @include rwd-max('pc') {
    flex-direction: column;
    align-items: center;
    gap: 120px;
  }

  @include rwd-max('tablet') {
    gap: 60px;
    padding: 0 26px;
  }
}

.section3__face {
  position: relative; // 白方塊（.section3__face-seed）是絕對定位的子元素，要以本框為定位基準。
  flex-shrink: 0;
  width: 280px;
  height: 280px;
  // pad / mob 的排列是「文字在上、臉在下」→ 用 order 換位，DOM 順序維持臉在前
  // （臉是裝飾、aria-hidden，放前面不影響朗讀順序）
  @include rwd-max('pc') {
    order: 2;
  }

  @include rwd-max('tablet') {
    width: 200px;
    height: 200px;
  }
}

// 逐格臉的 svg：cover 跑完才現身（見 template）。用 opacity 而非 v-if／display，
// 讓它一直佔位 —— --face-cell-y 是量出來的，元素不在版面上就量不到。
// scrub 驅動，刻意不加 transition（與白方塊是硬切交棒，補間反而會看到兩者都不是
// 全不透明的那一瞬間 —— 同 .forum-path__core 的取捨）。
.section3__face-art {
  opacity: 0;

  &.is-in {
    opacity: 1;
  }
}

// 白方塊：飛機沒入色塊後從接縫長出來的那一格。
// 網格比例寫死 —— FACE_FRAMES[0] = [7,0,2,2] 在 16×16 網格上是 x 7/16 起、佔 2/16，
// 所以它**水平居中於臉框**（7+1 = 8 ＝ 網格中心），三個斷點都不必分開寫。
// 位移：起點是色塊上緣（＝ 臉屏上緣，故幅度就是 --face-cell-y），終點是 0（就位）。
// --cover-seed 由 seedTravelAt(coverProgress) 餵入，scrub 驅動故不加 transition。
// fallback 0px：量到之前不動，不會亂飛。
//
// 「長出來」（2026-08-14）：--cover-grow 由 coverHandoff 餵入，scaleY 0 → 1。
// 改版前它是以完整尺寸憑空出現的（使用者回饋「白方塊直接出現」）。
//
// ⚠️ transform-origin 必須是 top：方塊的上緣在接觸點精準貼齊色塊上緣
//    （2026-08-12 紀錄第八節實測 0.0px），以上緣為原點縮放才是「從接縫往下長出來」。
//    預設的 50% 50% 會變成從中間往兩邊長，上緣會脫離接縫、看起來像浮在色塊裡。
// ⚠️ 順序也不能反：先 translateY 再 scaleY ——「先位移到接縫、再從那裡長」。
//    反過來的話縮放發生在位移之前的座標系，長出來的位置會隨 --cover-seed 飄。
// ⚠️ 只長縱向：分鏡「永續祝福2」是 35×27（滿寬、未滿高），飛機是從上方鑽進來的，
//    橫向一起長會變成「從中心點放大」，那是另一種敘事。
// fallback 1：任何還沒餵值的時刻都是完整尺寸，不會整塊消失。
.section3__face-seed {
  position: absolute;
  top: 0;
  left: 43.75%; // 7 / 16
  width: 12.5%; // 2 / 16
  aspect-ratio: 1;
  background: #fff;
  transform: translateY(calc((var(--cover-seed, 1) - 1) * var(--face-cell-y, 0px)))
    scaleY(var(--cover-grow, 1));
  transform-origin: top;
}

.section3__intro {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 36px;
  width: 507px;
  // 白字，所以色塊還是淺藍時必須藏著：它的版位在臉屏內約 220px，cover 進度 0.31 就
  // 進畫面了 —— 比接觸（COVER_CONTACT 0.5）**早**，不擋掉會有一段白字疊在淺藍上。
  // 直接吃 --cover-orange：與換色同一條曲線 → 底色變橘的同時它現身，正是設計師說的
  // 「底色變橘時，會看到原本位置的白字標題和引言」。
  // --cover-orange 現在是二元的（見 coverOrangeAt），故補間交給下方的 CSS transition。
  opacity: var(--cover-orange, 1);

  // 與換色同一條曲線、同一個補間：--cover-orange 是二元的，所以這裡加 transition 是安全的
  // （原本的「scrub 驅動不可加 transition」是針對連續映射的量，見 coverOrangeAt 的註解）。
  transition: opacity 0.4s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @include rwd-max('pc') {
    order: 1;
    gap: 32px;
    width: 100%;
    max-width: 530px;
    text-align: center;
  }

  @include rwd-max('tablet') {
    max-width: 362px;
    text-align: left;
  }
}

// 設計稿的「永續祝福」是外框化向量（pc 2065:140384 / pad 2065:125424 / mob 2065:121728），
// 寬度就是整個 intro 欄寬：pc 507×104.04 / pad 340×69.77 / mob 362×74.29 —— 也就是標題與
// 下方內文同寬（pad 的內文較寬 530，標題 340 置中）。
//
// 現在畫面吃的是那三份 SVG（見 template 的 <UArtLine>），font-size 只剩兩個作用：
// 撐行盒、以及當素材的寬度基準 --art-base。四個字都是全形、Noto Sans TC 的字幅各 1em，
// 所以「設計稿寬 ÷ 4」同時是「素材退回活文字時字盒剛好對齊欄寬」的值 —— 兩邊都對，
// 故沿用不動。line-height 直接取向量高度。
.section3__title {
  // 素材的寬度基準（見 <UArtLine>）：**無單位**，恆等於本區塊的 font-size。
  // 帶了 px 整個 calc() 無效、素材寬會塌成 0（fail-loud，看得出來）。
  --art-base: 126.75;

  margin: 0;
  font-size: 126.75px; // 507 / 4
  font-weight: 300;
  line-height: 104px;
  white-space: nowrap; // 字盒與欄寬等寬，四捨五入的誤差不該讓它斷成兩行

  @include rwd-max('pc') {
    --art-base: 85;

    font-size: 85px; // 340 / 4
    line-height: 70px;
  }

  @include rwd-max('tablet') {
    --art-base: 90.5;

    font-size: 90.5px; // 362 / 4
    line-height: 74px;
  }
}

// 素材在 pad 要自己置中。
// ⚠️ 不能靠 .section3__intro 的 text-align: center —— 素材模式下這個 span 是
//    **固定寬的 block**（width 由 --art-w ÷ --art-base 算出），text-align 管不到它。
//    稿在 pad 是「標題 340 置中於 530 的內文欄」，pc（欄寬 ＝ 標題寬）與 mob（稿靠左，
//    見 __intro 的 text-align: left）都不需要，故只在 pad 那一段給。
.section3__title-art {
  @include rwd-min('tablet') {
    @include rwd-max('pc') {
      margin-inline: auto;
    }
  }
}

// mob 素材要服貼欄寬。
// 稿寬 362 是畫在 414 的框上（362 ＋ 左右各 26 內距，見 .section3__face-inner），
// 但 <UArtLine> 的 span 是**固定寬**的 block（art-w ÷ --art-base × 1em），
// 視窗比 414 窄（375、360、320…）就會撐破 .section3__title 溢出畫面。
//
// 收成 max-width: 100% 之後，::after 原本寫死的 height 會讓 background-size: 100% 100%
// 把素材壓扁，故改用 aspect-ratio 讓高度跟著寬度走 —— 沒被夾住時
// width × h/w 恰好等於原本的 art-h ÷ --art-base × 1em，寬鬆情況下是零變化。
//
// 只改這裡、不動 UArtLine 的 mixin：那支是跨 section 共用的，論壇段的
// .forum-event__head 是絕對定位 shrink-to-fit，加上 max-width 會有回歸風險。
// 選擇器多帶一層 .section3__title 是為了穩定壓過 UArtLine 內部同特異度的 ::after 規則
//（兩邊都是 0,2,0，靠檔案順序決勝不可靠）。
.section3__title .section3__title-art {
  @include rwd-max('tablet') {
    max-width: 100%;

    &::after {
      height: auto;
      aspect-ratio: var(--art-w-mob) / var(--art-h-mob);
    }
  }
}

.section3__body {
  margin: 0;
  font-size: var(--text-h5); // 20 / 32
  font-weight: 400;
  line-height: var(--text-h5--line-height);
  text-align: justify;

  @include rwd-max('tablet') {
    font-size: var(--text-body); // 18 / 30
    line-height: 30px;
  }
}
</style>
