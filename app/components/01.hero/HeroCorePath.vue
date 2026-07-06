<!--
  桌機 core 的移動路徑 + 驅動（section 級 overlay，1:1 px，無 viewBox）。

  兩條線畫在同一個座標系（.sec1 的像素空間）：
  - 可見灰線（lineEl）：設計中心線形狀（stub 垂直 + 曲線），錨定在 date group
    （以大標左上角為原點，沿用已驗證的設計定位）。
  - 驅動線（motionEl，stroke:none）：core 第一屏中央起點 →「動態直線引段」→ 曲線。
    引段長度隨視窗高度變動（吸收 core 與 date 之間的 vh 動態距離），
    曲線段形狀固定、只被平移，故尾端一律精準落在 date 的橘色「/」。

  單一 scrub ScrollTrigger 驅動整條 motionEl（getPointAtLength 取樣 → 定位 core），
  因為只有一條連續 path、一個 tween，接縫零頓挫。
-->
<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const props = defineProps<{
  /** .sec1：core / path 的座標範圍，也是 ScrollTrigger 的 trigger */
  sectionEl: HTMLElement | null;
  /** orange core：被驅動沿線移動的元素 */
  coreEl: HTMLElement | null;
  /** date 大標：設計原點，用來錨定曲線（尾端對齊「/」） */
  anchorEl: HTMLElement | null;
}>();

// core 沿線移動進度（0..1）→ 寫入全域共享 path 軌（stage 1–3 來源），供顯示與效果讀取。
const { setPathProgress } = useOrangeCoreProgress();

// 移動速度曲線：把 raw 捲動進度重新映射成 path 進度（見 ~/utils/orange-core-config 的 MOVE_EASE）。
const easeMove = gsap.parseEase(MOVE_EASE) ?? ((v: number) => v);

// 設計中心線幾何（stub 垂直段 / 曲線段 / 錨定位移）集中在 ~/utils/orange-core-config 的 PATH。
// 沿用原本的 STUB / CURVE / ANCHOR_OFFSET 命名，故下方 build() 內文不動。
const { stub: STUB, curve: CURVE, anchorOffset: ANCHOR_OFFSET } = PATH;

const lineEl = ref<SVGPathElement | null>(null);
const motionEl = ref<SVGPathElement | null>(null);
let st: ScrollTrigger | null = null;
let ready = false;
// 驅動線總長：僅在 build() 幾何重建時量測一次，scrub 每幀直接複用（避免 getTotalLength 熱路徑）。
let motionLen = 0;

// 平移「只含 C / L」的座標片段：座標 x,y 交替、以 x 起始。
function shift(frag: string, tx: number, ty: number) {
  let i = 0;
  return frag.replace(/-?\d*\.?\d+/g, (n) =>
    (parseFloat(n) + (i++ % 2 ? ty : tx)).toFixed(3),
  );
}

// 依當前版面量測，重建兩條 path 的 d（imperative，避免 Vue patch 造成幾何延遲）。
function build() {
  const sec = props.sectionEl;
  const anchor = props.anchorEl;
  const line = lineEl.value;
  const motion = motionEl.value;
  if (!sec || !anchor || !line || !motion) return;

  const secRect = sec.getBoundingClientRect();
  const aRect = anchor.getBoundingClientRect();
  const tx = aRect.left - secRect.left + ANCHOR_OFFSET.x;
  const ty = aRect.top - secRect.top + ANCHOR_OFFSET.y;
  const curve = shift(CURVE, tx, ty);

  // 曲線起點（stub 底 = 曲線第一個控制點）。
  const scx = STUB.x + tx;
  const scy = STUB.bottom + ty;

  // 可見灰線：stub + 曲線（錨定 date）。
  line.setAttribute(
    'd',
    `M${scx.toFixed(3)} ${ty.toFixed(3)}V${scy.toFixed(3)}${curve}`,
  );

  // 驅動線：core 起點（第一屏中央）→ 直線引段 → 曲線。
  const cx = secRect.width / 2;
  const cy = window.innerHeight / 2;
  motion.setAttribute(
    'd',
    `M${cx.toFixed(3)} ${cy.toFixed(3)}L${scx.toFixed(3)} ${scy.toFixed(3)}${curve}`,
  );

  // 幾何已定，量一次總長供 place() 每幀複用。
  motionLen = motion.getTotalLength();

  place(st ? st.progress : 0);
}

// 依 raw 捲動進度把 core 定位到驅動線上的點，並轉到該處的路徑切線方向（雲霄飛車感）。
// 先過 easeMove（MOVE_EASE 速度曲線）→ 得 path 進度 p，再定位；切線由前後各取 1px 的鄰近點
// 連線求得，兩端皆穩定（不會因 eps=0 歸零）。p 同時寫回 path 軌，故 stage 判定與定位一致。
function place(rawP: number) {
  const core = props.coreEl;
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
  if (ready || !props.sectionEl || !props.coreEl || !props.anchorEl) return;
  ready = true;

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(props.coreEl, { xPercent: -50, yPercent: -50 }); // 讓 (x,y) 對齊 core 中心
  build();

  st = ScrollTrigger.create({
    trigger: props.sectionEl,
    start: 'top top',
    // 尾端扣掉 Hero pin 的釘住距離（PIN_VH）：core 於「進入 pin 的那一刻」剛好到達斜槓
    // （progress=1），pin 期間不再前進 → core 穩定停在斜槓。與 Hero pinST 共用同一個 PIN_VH。
    end: () => `bottom bottom-=${window.innerHeight * PIN_VH}`,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => place(self.progress),
  });
  ScrollTrigger.addEventListener('refreshInit', build);
  ScrollTrigger.refresh();

  // 字體載入會位移 date 大標 → 重新量測。
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

onMounted(() => {
  init();
  // props 來自父層 template ref，可能於下一 tick 才就緒。
  if (!ready) {
    const stop = watch(
      () => [props.sectionEl, props.coreEl, props.anchorEl],
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
    class="sec1__core-path"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path ref="lineEl" class="sec1__core-path-line" />
    <path ref="motionEl" fill="none" stroke="none" />
  </svg>
</template>

<style lang="scss" scoped>
.sec1__core-path {
  position: absolute;
  // inset: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: visible; // path 座標超出 svg box（引段往上到 hero）仍需可見
  pointer-events: none;
  z-index: 1;
}

.sec1__core-path-line {
  fill: none;
  stroke: #898989;
  stroke-width: 1;
}
</style>
