<!--
  hero → section 2 轉場遮罩。
  pin 期間由 scroll progress（0..1）scrub 驅動：從斜槓處那條 core 線的位置/角度出發，
  沿斜角長成一條對角平行四邊形，透出後方 section 2 星空 —— 放大到蓋滿視窗即完成，Hero 隨後解除 pin。

  星空目前用 CSS 模擬（placeholder）；正式版由 section 2 的 SymbolFace（three.js 粒子）接手。
  遮罩形狀直接讀 core 元素的螢幕位置與旋轉角，故與橘色 core 線無縫接上（橘→黑→放大）。
-->
<script setup lang="ts">
import type { CoreStage } from '~/composables/useHeroCoreProgress';

const props = defineProps<{
  /** 目前 stage（1..6）：只在 stage 5（放大）/ 6（已蓋滿）現身 */
  stage: CoreStage;
  /** 該 stage 內的 local progress（0..1）：stage 5 用來撐大遮罩 */
  stageProgress: number;
  /** core 元素：讀取斜槓的螢幕位置與角度，作為遮罩起點/方向 */
  coreEl?: HTMLElement | null;
  /** 已捲過 pin 進入 section 2 → 整層淡出，露出真正的 section 2 */
  done?: boolean;
}>();

const fieldRef = ref<HTMLElement | null>(null);

// 放大進度：stage 5 用 stageProgress 撐大；stage 6 維持全滿；其餘為 0（未啟動）。
const revealP = computed(() => {
  if (props.stage === 5) return props.stageProgress;
  if (props.stage >= 6) return 1;
  return 0;
});
// 只有 stage ≥5 且尚未離場才顯示（stage 4 只做變色，遮罩還不出現）。
const active = computed(() => !props.done && props.stage >= 5);

// 由 core 元素讀出中心點（螢幕 px）與旋轉角（GSAP 以 tangent 設定 rotation → 從 transform matrix 取）。
function readCore() {
  const el = props.coreEl;
  const fallback = {
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2,
    angle: -Math.PI / 3,
  };
  if (!el) return fallback;
  const r = el.getBoundingClientRect();
  const t = getComputedStyle(el).transform;
  let angle = fallback.angle;
  if (t && t !== 'none') {
    const m = new DOMMatrixReadOnly(t);
    angle = Math.atan2(m.b, m.a);
  }
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, angle };
}

// core 於 stage 3 拉長後那條「線」的半尺寸（＝遮罩起點）：對齊 Core.vue 的 LINE_SCALE_X × 24 / 2。
// 遮罩於 stage 5 起始（revealP≈0）時就等於這條線，故看起來是「（已變黑的）線 → 撐大」的同一個東西。
const LINE_HALF_LEN = 120; // 24 × scaleX(10) / 2
const LINE_HALF_THICK = 12; // 24 × scaleY(1) / 2

// 依進度計算對角平行四邊形 clip-path（field 為 fixed 滿版 → 座標即 viewport px）。
// 長度與半寬都從 core 線的尺寸「長出來」，一路撐到覆蓋整個視窗對角。
function computeClip(p: number) {
  const { cx, cy, angle } = readCore();
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy; // 斜角的法線方向（半寬沿此增長）
  const ny = dx;
  const diag = Math.hypot(window.innerWidth, window.innerHeight);
  const L = LINE_HALF_LEN + (diag * 1.5 - LINE_HALF_LEN) * p; // 沿斜角半長：線長 → 拉出視窗外
  const w = LINE_HALF_THICK + (diag - LINE_HALF_THICK) * p; // 垂直半寬：線厚 → 對角長（蓋滿）
  const pts = [
    [cx + dx * L + nx * w, cy + dy * L + ny * w],
    [cx + dx * L - nx * w, cy + dy * L - ny * w],
    [cx - dx * L - nx * w, cy - dy * L - ny * w],
    [cx - dx * L + nx * w, cy - dy * L + ny * w],
  ];
  return `polygon(${pts
    .map(([x, y]) => `${x!.toFixed(1)}px ${y!.toFixed(1)}px`)
    .join(', ')})`;
}

// 放大進度變動時直接寫 style（避免每幀觸發 Vue re-render）。
watch(
  revealP,
  (p) => {
    const el = fieldRef.value;
    if (el) el.style.clipPath = computeClip(p);
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="hero-transition"
    :class="{ 'is-hidden': !active }"
    aria-hidden="true"
  >
    <div ref="fieldRef" class="hero-transition__field" />
  </div>
</template>

<style lang="scss" scoped>
.hero-transition {
  position: fixed;
  inset: 0;
  // 在 hero 內容之上、但預期低於固定的 AppHeader（logo / nav 轉場時仍需可見）。
  z-index: 10;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.35s ease;

  &.is-hidden {
    opacity: 0;
  }
}

.hero-transition__field {
  position: absolute;
  inset: 0;
  // === CSS 模擬 section 2 星空（placeholder，待 SymbolFace 接手）===
  // 刻意用「深藍綠」底色而非純黑：與白色 hero 對比更強、遮罩放大的變化一眼看得出來。
  // 底色漸層 + 多層互質尺寸/位移的點陣，攤開成散布感的青綠色符號星空。
  background-color: #0a1c2b;
  background-image:
    radial-gradient(circle, rgba(160, 224, 255, 0.95) 0.7px, transparent 1.7px),
    radial-gradient(circle, rgba(127, 208, 255, 0.7) 0.6px, transparent 1.6px),
    radial-gradient(circle, rgba(136, 190, 239, 0.8) 0.5px, transparent 1.4px),
    radial-gradient(circle, rgba(127, 208, 255, 0.5) 0.5px, transparent 1.4px),
    linear-gradient(125deg, #06283b 0%, #0a1c2b 45%, #071726 100%);
  background-size: 67px 83px, 113px 97px, 89px 71px, 149px 127px, 100% 100%;
  background-position: 0 0, 29px 41px, 53px 17px, 91px 63px, 0 0;
  will-change: clip-path;
}
</style>