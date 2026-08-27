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
     代價是 slot 內的 WebGL 元件會「看不見但仍在滿版跑」→ 故把 active 當 slot prop 交出去，
     由它自己停掉 rAF（見 SymbolFace 的 active prop）。
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

// 開窗的座標交給 header：窗內那一段 header 反白（設計稿 2065:142710 的 `Mask group` 裡
// 那第二份 header）。本層只負責「窗現在在哪」，反白怎麼畫是 AppHeader 的事。
const { syncHeaderBand } = useHeaderBand();

// p>0 且尚未交棒才可見：p=0 時整層透明，避免在 core 移動途中疊一層同色方塊。
const active = computed(() => !props.done && props.progress > 0);

// 方塊遮罩轉場的起手音（設計標註「方塊遮罩轉場音效」）。
// 觸發點取 p 由 0 翻正的那一刻 ＝ 橘方塊開始長大；整段 scrub 只響這一次。
// 往回捲不響（規則見 ~/composables/useSfxCue）。
const { cueOn } = useSfxCue();
cueOn(() => props.progress > 0, 'aiFaceText');

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

// 開窗起點（core 的螢幕矩形）在轉場開始時量一次就鎖住，之後整段沿用。
// ⚠️ 不能每幀重量：轉場 pin 一釋放，core 就跟著 section 捲離視窗，
//    此時再讀它的 rect 會讓已經滿版的開窗跟著跑掉（symbol 序列期間畫面破掉）。
//    pin 期間 core 本來就固定在視窗正中央，所以「量一次」與逐幀量的結果相同。
// resize 時清掉重量（見 onResize）。
let anchor: { cx: number; cy: number; w: number; h: number } | null = null;

// field 自己的框（不含捲軸，見 apply 的 ⚠️）。-1 ＝ 待重量；與 anchor 共用同一組
// 失效點（onResize / ResizeObserver）。
let fieldW = -1;
let fieldH = -1;

// field 自己的視窗座標原點（換算時要先扣掉；本層是 fixed inset:0，正常為 0）。
let fieldLeft = 0;
let fieldTop = 0;

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
    cx: r.left + r.width / 2 - fieldLeft,
    cy: r.top + r.height / 2 - fieldTop,
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
  //
  // 量測結果**快取**（同下面那行的 anchor，理由一樣）：apply() 是逐幀被 scrub 打到的，
  // 而 clientWidth/clientHeight 是強制 layout 的讀取，緊接著這裡又要寫 clipPath /
  // backgroundColor / opacity —— 讀寫交錯正是 layout thrash。field 是 fixed inset: 0，
  // 這兩個值只會在視窗尺寸變動時變，而那條路徑已經有 onResize 在清 anchor 了。
  // ⚠️ 量 getBoundingClientRect() 而**不是** clientWidth / clientHeight —— 兩者只差在
  //    「有沒有四捨五入」，而那個差在頁面被縮放時會露出來：
  //      瀏覽器縮放 110%：clientWidth 1309、rect.width 1309.333
  //      瀏覽器縮放  67%：clientHeight 1343、rect.height 1343.333
  //    clip-path 的 inset 是以**本元素的實際框**（小數）解算的，拿整數的 clientWidth 當
  //    vw，等於整段都用一把短了 0.333px 的尺：右緣與下緣各會殘留一條蓋不滿的縫
  //    （實測 67% 時 `inset(… 0.7px …)`），而那條縫正好落在交棒點上。
  //    core 的錨點本來就是用 rect 量的 —— 統一成同一把尺，cx - w/2 才會**正好**抵銷成 0，
  //    「窗蓋滿 header 那一列」那個閘門（top <= 0）也才不會被 0.333px 的誤差擋掉。
  //    rect 與 clientWidth 一樣**不含捲軸**（fixed inset:0 的框已經扣掉了），
  //    故原本改用 clientWidth 要避開的 innerWidth 問題不會回來。
  if (fieldW < 0) {
    const r = field.getBoundingClientRect();
    fieldW = r.width;
    fieldH = r.height;
    fieldLeft = r.left;
    fieldTop = r.top;
  }
  const vw = fieldW;
  const vh = fieldH;

  const { cx, cy, w: w0, h: h0 } = readAnchor(vw, vh);

  const pY = clamp01(p / growY); // 拉長段進度
  const pX = clamp01((p - growY) / (1 - growY)); // 展開段進度

  // 窗的三條邊，同時餵給自己的 clip-path 與 header 的反白（見檔尾 syncHeaderBand）。
  let bandTop = 0;
  let bandLeft = 0;
  let bandRight = vw;

  if (pX >= 1) {
    // 展開完成 → 直接寫死滿版，不靠 cx/cy 剛好等於中心。
    // core 只要稍微偏心（或 toFixed 進位），下面的算式就會在某一邊留下一條縫，
    // 而那條縫剛好落在交棒點上＝最顯眼的位置。
    field.style.clipPath = 'inset(0px)';
  } else {
    const h = h0 + (vh - h0) * pY;
    const w = w0 + (vw - w0) * pX;

    // clip-path inset：以 core 中心為錨、上下左右對稱長大（負值會被視為無效，故夾 0）。
    //
    // ⚠️ 拉長段跑完（pY ＝ 1）之後垂直方向**寫死滿高**，不由 cy 反推 —— 同下面 pX >= 1
    //    「直接寫死滿版」那個分支的理由，只是換一根軸：core 只要稍微偏心，cy - h/2 就不
    //    是 0，而**這一根軸上那條縫是有後果的** —— header 反白的閘門正是 top <= 0
    //    （見 ~/composables/useHeaderBand：亮列用水平 gradient 挖洞、表達不了垂直邊界，
    //    故窗還沒蓋滿 header 那一列就一律不反白）。差 0.2px 就整個展開段都不反白 ⇒
    //    base 那條 rgb(255 255 255 / 0.7) + blur(2px) 原封不動糊在粒子場上，變成使用者
    //    回報的那條灰霧帶（正是 .has-band 的遮罩存在的理由，見 AppHeader 的註解）。
    //    偏心不是假想：視窗高帶小數（DPR 縮放／瀏覽器縮放）時就會發生 —— 實測 pad 斷點
    //    1160×875.33，cy 437.867 對 vh/2 437.667，差 0.2001953125px，整個展開段都中。
    //    夾 max(0, …) 擋不住：它擋的是負值，這裡殘留的是**正**的 0.2px。
    //    也因此症狀看起來「時好時壞」：視窗高剛好是整數時 cy 正好等於中心，就沒事。
    const vFull = pY >= 1;
    const top = vFull ? 0 : Math.max(0, cy - h / 2);
    const bottom = vFull ? 0 : Math.max(0, vh - (cy + h / 2));
    const left = Math.max(0, cx - w / 2);
    const right = Math.max(0, vw - (cx + w / 2));
    field.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px)`;

    bandTop = top;
    bandLeft = left;
    bandRight = vw - right;
  }

  // header 的反白：與色場**同一組座標**（兩者都是 fixed、都以不含捲軸的框為基準，
  // 故可直接交出去，見 useHeaderBand 的座標系說明）。
  // 條件與本層的 active 一致：p<=0（還沒進轉場）或 done（已交棒給 ForumCore）都要收掉，
  // 否則窗已經不在畫面上、header 卻還留著一條反白。
  // 「窗還沒蓋滿 header 那一列就不反白」那條閘門由 syncHeaderBand 依 top 判斷。
  syncHeaderBand(
    props.done || p <= 0
      ? null
      : { theme: 'dark', left: bandLeft, right: bandRight, top: bandTop },
  );

  // 橘 → 深色：在拉長段的前 colorSpan 內完成（t2 的長條已是深色）。
  const t = clamp01(pY / colorSpan);
  field.style.backgroundColor = `rgb(${mix(orange[0], dark[0], t)}, ${mix(orange[1], dark[1], t)}, ${mix(orange[2], dark[2], t)})`;

  // 粒子場：展開段才淡入（拉長段維持實色長條）。
  if (stageRef.value) {
    stageRef.value.style.opacity = String(clamp01(pX / faceIn));
  }
}

// done 也要重跑一次：交棒是「progress 不動、done 翻面」的情形（symbol 序列跑完才撤場），
// 只看 progress 的話 header 那條反白會留在畫面上到下一次捲動為止。
watch([() => props.progress, () => props.done], () => apply(props.progress), {
  immediate: true,
});

// 視窗尺寸變動時重新量錨點並以當前進度重算（pin 期間轉向 / 拖拉視窗）。
function onResize() {
  anchor = null;
  fieldW = -1; // field 的框與換算倍率也跟著重量（見 apply）
  fieldH = -1;
  apply(props.progress);
}

// ⚠️ 除了 window 的 resize，還要盯 field 自己的框：瀏覽器縮放（Ctrl +/−）會同時改變
//    **區域座標下的尺寸**（1425 → 950）與換算倍率，而那正是上面那組快取的內容。
//    Chrome 的縮放確實會發 resize，但手機網址列收合只改高度、且各家行為不一 ——
//    ResizeObserver 直接看被量的那個元素，是這兩件事共同的正確訊號
//    （同 SymbolFace 用 RO 接住 canvas 尺寸變化的理由）。
//    RO 在 observe 當下會先發一次：那只是多跑一次 apply()，冪等。
let fieldRo: ResizeObserver | null = null;
onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true });
  if (fieldRef.value && 'ResizeObserver' in window) {
    fieldRo = new ResizeObserver(onResize);
    fieldRo.observe(fieldRef.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  fieldRo?.disconnect();
  // ⚠️ bandTheme 是 useState，**跨 client-side 導航存活**（同 useAnchorClaim 的老問題）：
  //    在轉場途中點 logo 進子頁的話，本層卸載但反白層會永遠留在那裡。
  syncHeaderBand(null);
});
</script>

<template>
  <div
    class="hero-symbol-transition"
    :class="{ 'is-hidden': !active }"
    aria-hidden="true"
  >
    <div ref="fieldRef" class="hero-symbol-transition__field">
      <!--
        真正的 <SymbolFace>（由 Hero 傳入）：滿版、隨展開段淡入。
        active 透過 slot prop 交出去：本層是「做出隱藏決定」的那一層，而 slot 內的
        WebGL 元件靠自己偵測不到祖先的 visibility（IntersectionObserver 只看幾何，
        本層又是 fixed 滿版 → 恆為 intersecting）。由這裡交棒，判斷式就只有一份。
      -->
      <div ref="stageRef" class="hero-symbol-transition__stage">
        <slot :active="active" />
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

  // SymbolFace 的 .stage 自帶 background:#fff（元件預設的白底場景）；
  // 這裡要透出下層由 JS 控制的色場（橘→黑），故清掉它的底色。
  //
  // ⚠️ height 也要覆寫掉它的 vh(1)：那是 --vh ＝ **large viewport**（凍結、收合網址列不變），
  //    而本層是 fixed inset:0 ＝ **dynamic viewport**（會隨網址列收合而變）。兩把尺不同時，
  //    canvas 的垂直中心會落在真實視窗中心下方最多約一個 --chrome-inset（實測可達 57px），
  //    而交棒對象 ForumCore 是對齊真實視窗中心 → coreIn 那個硬切會看得出跳動。
  //    改吃 100%（＝本層的框）後兩邊同一把尺；網址列收合造成的高度變化由 SymbolFace 的
  //    ResizeObserver 接住並重算投影（同它修捲軸寬那 7.67px 的機制）。
  //    只在這裡覆寫、不動元件預設：in-flow 用法沒有可繼承高度的父框，得靠 vh(1)。
  :deep(.stage) {
    height: 100%;
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
