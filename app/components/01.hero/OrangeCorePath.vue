<!--
  core 的移動路徑 + 驅動（section 級 overlay，1:1 px，無 viewBox）。

  驅動線（不可見，stroke:none）：core 起點（第一屏正中央）→ 垂直下降穿透引言文字 →
  終點停在「視窗正中央」（＝ .sec1 底緣貼齊視窗底的那一刻），交棒給 HeroSymbolTransition。
  單一 scrub ScrollTrigger 驅動整條 path（getPointAtLength 取樣 → 定位 core），
  一條連續 path、一個 tween → 接縫零頓挫。

  幾何全由量測推導、無寫死座標：x = section 水平中心（引言文字也置中，故一路穿過文字），
  終點 y = endEl 底緣 − 半個視窗高（endEl 底緣貼齊視窗底時，該點正好是視窗正中央）。
  ⚠️ endEl 尾端必須留 ≥ 50vh 的 runway（見 Hero.scss 的 .sec1__intro padding-bottom，
     實際值為 50vh ＋ 引言淡出窗口 INTRO_FADE_VH），否則終點會落在文字之內、
     core 還沒穿出文字就停住。
  ⚠️ 起訖與 endEl 都刻意避開 .sec1 的 bottom：Hero 的 transition pin 會在 .sec1 內插入
     pin-spacer 把 section 撐高，用 .sec1 的 bottom 當基準會變成循環依賴（量到的高度含 spacer）。
     endEl 位於被 pin 的 .sec1__inner 之內，其幾何不受 spacer 影響。

  🚧 舊稿的可見灰線（設計中心線：stub 垂直段 + C/L 曲線，錨定 date 大標左上角、尾端落在日期
     的「/」）已隨 date 段移除。新稿 hero 段沒有可見設計線（影片結尾那條階梯線在影片裡）。
     論壇段那條長曲線（Figma path1 / path2）之後可匯出 d 字串，沿用本檔的引擎重建。
-->
<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';

const props = defineProps<{
  /** .sec1：core / path 的座標範圍，也是 ScrollTrigger 的 trigger */
  sectionEl: HTMLElement | null;
  /** orange core：被驅動沿線移動的元素 */
  orangeCoreEl: HTMLElement | null;
  /** 路徑終點的參照元素（引言整段）：其底緣貼齊視窗底時，core 抵達視窗正中央 */
  endEl: HTMLElement | null;
}>();

// core 沿線移動進度（0..1）→ 寫入全域共享 path 軌（stage 1–3 來源），供顯示與效果讀取。
const { setPathProgress } = useOrangeCoreProgress();

// 路徑的起訖都定義成「半個視窗高」，而 endEl 的 runway 是 CSS 的 --vh ——
// 兩者必須是同一把尺，否則終點會落在文字之內或超出 runway。
const { vhPx } = useViewportHeight();

// 移動速度曲線：把 raw 捲動進度重新映射成 path 進度（見 ~/utils/orange-core-config 的 MOVE_EASE）。
const easeMove = gsap.parseEase(MOVE_EASE) ?? ((v: number) => v);

const motionEl = ref<SVGPathElement | null>(null);
let st: ScrollTrigger | null = null;
let ready = false;
// 驅動線總長：僅在 build() 幾何重建時量測一次，scrub 每幀直接複用（避免 getTotalLength 熱路徑）。
let motionLen = 0;

// 依當前版面量測，重建驅動線的 d（imperative，避免 Vue patch 造成幾何延遲）。
function build() {
  const sec = props.sectionEl;
  const end = props.endEl;
  const motion = motionEl.value;
  if (!sec || !end || !motion) return;

  const secRect = sec.getBoundingClientRect();
  const endRect = end.getBoundingClientRect();
  const x = secRect.width / 2; // 垂直線：一路沿 section 水平中心（引言文字亦置中）

  // 起點：第一屏正中央（＝影片退場後 core 淡入的位置）。
  const sy = vhPx(0.5);
  // 終點：endEl 底緣往上半個視窗高 → 該底緣貼齊視窗底時，core 正好在視窗正中央。
  const ey = endRect.bottom - secRect.top - vhPx(0.5);

  motion.setAttribute(
    'd',
    `M${x.toFixed(3)} ${sy.toFixed(3)}L${x.toFixed(3)} ${ey.toFixed(3)}`,
  );

  // 幾何已定，量一次總長供 place() 每幀複用。
  motionLen = motion.getTotalLength();

  place(st ? st.progress : 0);
}

// 依 raw 捲動進度把 core 定位到驅動線上的點，並轉到該處的路徑切線方向（雲霄飛車感）。
// 先過 easeMove（MOVE_EASE 速度曲線）→ 得 path 進度 p，再定位；切線由前後各取 1px 的鄰近點
// 連線求得，兩端皆穩定（不會因 eps=0 歸零）。p 同時寫回 path 軌，故 stage 判定與定位一致。
// 切線 rotation 對正方形 dot 無視覺差異，保留是為了之後論壇段的曲線路徑。
function place(rawP: number) {
  const core = props.orangeCoreEl;
  const motion = motionEl.value;
  if (!core || !motion || !motionLen) return;
  const p = easeMove(rawP); // 套用移動速度曲線
  const len = p * motionLen;
  const pt = motion.getPointAtLength(len);
  const d = 1; // 取樣間距（px）
  const behind = motion.getPointAtLength(Math.max(0, len - d));
  const ahead = motion.getPointAtLength(Math.min(motionLen, len + d));
  const angle =
    (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
  gsap.set(core, { x: pt.x, y: pt.y, rotation: angle });
  setPathProgress(p);
}

function init() {
  if (ready || !props.sectionEl || !props.orangeCoreEl || !props.endEl) return;
  ready = true;

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(props.orangeCoreEl, { xPercent: -50, yPercent: -50 }); // 讓 (x,y) 對齊 core 中心
  build();

  st = ScrollTrigger.create({
    trigger: props.sectionEl,
    start: 'top top',
    // 終點與 Hero 的 transition pin 共用同一時機（同一個 endEl 的 'bottom bottom'）：
    // core 抵達視窗中央的同一刻 pin 接手 hold 住畫面，pin 期間 path 不再前進 → core 穩定停在中央。
    endTrigger: props.endEl,
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => place(self.progress),
  });
  ScrollTrigger.addEventListener('refreshInit', build);
  // 手動 refresh 一律走 refreshScrollTriggers()（先 sort 再 refresh）—— 見 utils/scroll-trigger。
  // 這裡尤其需要 sort：本元件的 trigger 在 .sec1 頂端，而 Hero 的 transition pin 就在它下方
  // 同一個 section 裡，兩者的建立順序取決於誰先 onMounted。
  refreshScrollTriggers();

  // 字體載入會改變引言文字高度 → section 高度變動 → 重新量測。
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => refreshScrollTriggers());
  }
}

onMounted(() => {
  init();
  // props 來自父層 template ref，可能於下一 tick 才就緒。
  if (!ready) {
    const stop = watch(
      () => [props.sectionEl, props.orangeCoreEl, props.endEl],
      () => {
        init();
        if (ready) stop();
      },
    );
  }
});

onBeforeUnmount(() => {
  ScrollTrigger.removeEventListener('refreshInit', build);
  st?.kill();
  st = null;
});
</script>

<template>
  <svg
    class="sec1__orange-core-path"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path ref="motionEl" fill="none" stroke="none" />
  </svg>
</template>

<style lang="scss" scoped>
.sec1__orange-core-path {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: visible; // path 座標超出 svg box（起點在第一屏影片區）仍需可見
  pointer-events: none;
  z-index: 1;
}
</style>
