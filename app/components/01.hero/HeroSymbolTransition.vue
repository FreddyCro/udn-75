<!--
  hero → SymbolScene 轉場層（fixed 滿版，z-index 10、低於 AppHeader 1000 → header 全程可見）。

  設計分鏡 2065:143082「引言轉場論壇」，標註「綁滾動」＝ 全程由 scroll scrub：
    ① core 停在視窗正中央（橘方塊）
    ② 上下拉長成窄長條，同時 橘 → 深色
    ③ 長條上下貫穿視窗（滿高、窄寬）
    ④ 左右展開，展開範圍內浮現符號星空
    ⑤ 蓋滿視窗 → 交棒 <SymbolScene>

  做法：本層是「fixed 滿版的色場 ＋ clip-path inset 開窗」，**slot 內放真正的 <SymbolFace>**。
  ・窗的起始尺寸/位置 = core 元素的螢幕矩形 → p≈0 時本層與 core 像素重合，看起來就是
    「那個橘方塊自己長大」（core 於 p>0 時交由 Hero 隱去，避免兩層各畫一次而 drift）。
  ・色場與 slot 都是 fixed 滿版、只有 clip 在變 → 粒子場不會被拉伸變形。這是用 clip-path
    而非縮放 div 的原因，也是 slot 能直接吃真 canvas 的原因。
  ・逐幀直接寫 el.style，不觸發 Vue re-render。

  ⚠️ 生命週期：<SymbolFace> 住在本層 slot 內 → 本層必須撐到**整段符號序列跑完**
     （disperse→face→converge，由 01a.symbol/SymbolScene 的捲動驅動）才能撤場，
     故 done 讀的是 symbolLayerDone（序列越過 enter、交棒給 ForumCore），不是「轉場放大完成」。
  ⚠️ 以 opacity 而非 display 隱藏：本層一開始就要有真實尺寸，three.js 才量得到 canvas 大小。
-->
<script setup lang="ts">
const props = defineProps<{
  /** 轉場進度（0..1）：Hero 的 transition pin scrub 寫入 */
  progress: number;
  /** core 元素：讀螢幕矩形作為開窗起點（隱形但仍在版面上，故 rect 有效） */
  coreEl?: HTMLElement | null;
  /** 符號序列已交棒給論壇 → 本層淡出（見上方生命週期說明） */
  done?: boolean;
}>();

const fieldRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);

const { growY, colorSpan, faceIn, dark } = SYMBOL_TRANSITION;
const { orange } = CORE;

// p>0 且尚未交棒才可見：p=0 時整層透明，避免在 core 移動途中疊一層同色方塊。
const active = computed(() => !props.done && props.progress > 0);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

// 開窗起點（core 的螢幕矩形）在轉場開始時量一次就鎖住，之後整段沿用。
// ⚠️ 不能每幀重量：轉場 pin 一釋放，core 就跟著 section 捲離視窗，
//    此時再讀它的 rect 會讓已經滿版的開窗跟著跑掉（symbol 序列期間畫面破掉）。
//    pin 期間 core 本來就固定在視窗正中央，所以「量一次」與逐幀量的結果相同。
// resize 時清掉重量（見 onResize）。
let anchor: { cx: number; cy: number; w: number; h: number } | null = null;

// vw / vh 由呼叫端傳入（＝ field 自己的框，見 apply 的說明），fallback 才會與開窗同一座標系。
function readAnchor(vw: number, vh: number) {
  if (anchor) return anchor;
  const r = props.coreEl?.getBoundingClientRect();
  // 量不到 core（父層 template ref 尚未就緒）→ 這次先用中心頂著，但**不快取**。
  // ⚠️ watch 是 immediate，第一次 apply(0) 常常早於 coreEl 就緒；若連 fallback 一起鎖住，
  //    整段轉場都會用錯的錨點（core 之後就緒也不會重量），長條位置與 core 對不上。
  if (!r?.width) {
    return { cx: vw / 2, cy: vh / 2, w: CORE.dotSize, h: CORE.dotSize };
  }
  anchor = {
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
    w: r.width,
    h: r.height,
  };
  return anchor;
}

// 兩段軸向放大：先 h → 視窗高（左右不動），再 w → 視窗寬（高維持滿）。
function apply(p: number) {
  const field = fieldRef.value;
  if (!field) return;

  // 回到轉場之前（p=0）→ 放掉錨點，下次進來重新量（避免沿用上一輪的位置）。
  if (p <= 0) anchor = null;

  // ⚠️ 量 field 自己的框，**不能用 window.innerWidth / innerHeight**。
  //    clip-path 的 inset 以本元素的框為基準，而本層是 fixed inset:0 → 寬度＝視窗**扣掉捲軸**；
  //    innerWidth 卻**含**捲軸。混用兩套座標的話：
  //      可見範圍 = [cx − w/2, cx + w/2 − sb] → 開窗永遠少一個捲軸寬 sb、整體左偏 sb/2
  //      且 p=1 時 left 被夾成 0、right 仍是 sb/2 → **右緣殘留 sb/2 沒蓋到**，
  //      在交棒給 SymbolScene 的那一刻透出 hero 白底（進到 symbol 段後底下換黑底才隱形，
  //      所以只有接縫那一瞬看得見）。
  //    field 的原點與 core rect 都是視窗左上（捲軸在右邊），故 cx / cy 可直接混用不必換算。
  const vw = field.clientWidth;
  const vh = field.clientHeight;

  const { cx, cy, w: w0, h: h0 } = readAnchor(vw, vh);

  const pY = clamp01(p / growY); // 拉長段進度
  const pX = clamp01((p - growY) / (1 - growY)); // 展開段進度

  if (pX >= 1) {
    // 展開完成 → 直接寫死滿版，不靠 cx/cy 剛好等於中心。
    // core 只要稍微偏心（或 toFixed 進位），下面的算式就會在某一邊留下一條縫，
    // 而那條縫剛好落在交棒點上＝最顯眼的位置。
    field.style.clipPath = 'inset(0px)';
  } else {
    const h = h0 + (vh - h0) * pY;
    const w = w0 + (vw - w0) * pX;

    // clip-path inset：以 core 中心為錨、上下左右對稱長大（負值會被視為無效，故夾 0）。
    const top = Math.max(0, cy - h / 2);
    const bottom = Math.max(0, vh - (cy + h / 2));
    const left = Math.max(0, cx - w / 2);
    const right = Math.max(0, vw - (cx + w / 2));
    field.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px)`;
  }

  // 橘 → 深色：在拉長段的前 colorSpan 內完成（t2 的長條已是深色）。
  const t = clamp01(pY / colorSpan);
  field.style.backgroundColor = `rgb(${mix(orange[0], dark[0], t)}, ${mix(orange[1], dark[1], t)}, ${mix(orange[2], dark[2], t)})`;

  // 粒子場：展開段才淡入（拉長段維持實色長條）。
  if (stageRef.value) {
    stageRef.value.style.opacity = String(clamp01(pX / faceIn));
  }
}

watch(() => props.progress, apply, { immediate: true });

// 視窗尺寸變動時重新量錨點並以當前進度重算（pin 期間轉向 / 拖拉視窗）。
function onResize() {
  anchor = null;
  apply(props.progress);
}
onMounted(() => window.addEventListener('resize', onResize));
onBeforeUnmount(() => window.removeEventListener('resize', onResize));
</script>

<template>
  <div
    class="hero-symbol-transition"
    :class="{ 'is-hidden': !active }"
    aria-hidden="true"
  >
    <div ref="fieldRef" class="hero-symbol-transition__field">
      <!-- 真正的 <SymbolFace>（由 Hero 傳入）：滿版、隨展開段淡入 -->
      <div ref="stageRef" class="hero-symbol-transition__stage">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-symbol-transition {
  position: fixed;
  inset: 0;
  z-index: 10; // 在 hero 內容之上、低於 AppHeader(1000)：轉場中 header 仍可見
  pointer-events: none;
  opacity: 1;
  // 撤場（交棒給 ForumCore）走固定時間的 crossfade ＝ 決策「crossfade 用時間、放大綁 scrub」。
  // visibility 一起 transition：淡出時會撐到動畫結束才真正隱藏，淡入時立刻可見。
  transition:
    opacity 0.35s ease,
    visibility 0.35s ease;

  // ⚠️ display:none 會讓 three.js 量到 0 寬高 → 不能用。但**只設 opacity:0 也不行**：
  //    opacity 為 0 的元素仍會參與 hit-test，而本層是 fixed 滿版、內部 canvas 還特意打開了
  //    pointer-events（SymbolFace 的互動監聽掛在 canvas 上）→ 結果是一片看不見的 canvas
  //    蓋住整個畫面，把 hero 影片階段的所有點擊都吞掉。
  //    visibility:hidden 會連子孫一起排除在 hit-test 之外，且（不同於 display:none）保留
  //    版面尺寸，canvas 仍量得到大小。
  &.is-hidden {
    opacity: 0;
    visibility: hidden;
  }
}

.hero-symbol-transition__field {
  position: absolute;
  inset: 0;
  // background-color 由 JS 逐幀寫入（橘 → 深色）
  will-change: clip-path;
}

// 粒子場容器：滿版、opacity 由 JS 於展開段淡入。
// 色場與本層都是 fixed 滿版、只有外層 clip 在變，故 canvas 不會被拉伸。
.hero-symbol-transition__stage {
  position: absolute;
  inset: 0;
  opacity: 0;

  // SymbolFace 的 .stage 自帶 background:#fff（元件預設，demo 頁是白底場景）；
  // 這裡要透出下層由 JS 控制的色場（橘→黑），故清掉它的底色。
  :deep(.stage) {
    background-color: transparent;
  }

}

// SymbolFace 有滑鼠斥力互動，且監聽掛在 canvas 上 → 這顆 canvas 要能收事件
// （外層 .hero-symbol-transition 是 pointer-events:none）。
// ⚠️ 必須限定「本層在場時」：子層的 pointer-events:auto 會蓋掉父層的 none，
//    不加 :not(.is-hidden) 就等於整頁被一片透明 canvas 蓋住（見上方 .is-hidden 註解）。
.hero-symbol-transition:not(.is-hidden) .hero-symbol-transition__stage {
  :deep(canvas) {
    pointer-events: auto;
  }
}
</style>
