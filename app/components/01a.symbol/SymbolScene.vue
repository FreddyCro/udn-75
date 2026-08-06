<script setup lang="ts">
// Section 01a.symbol：符號星空 / 人臉序列的**捲動驅動段落**（對應 Figma「智慧論壇05–08」四拍）。
//
// ⚠️ 本元件不畫任何東西 —— <SymbolFace> 住在 Hero 的 <HeroSymbolTransition> slot 裡。
//    原因見設計分鏡 2065:143082：轉場（橘方塊上下拉長 → 左右展開）發生在 **hero 還被 pin 住**
//    的時候，且「展開範圍內已可見粒子」，所以粒子場必須在 hero 轉場期間就在場、滿版渲染。
//    轉場層是 fixed 滿版色場 ＋ clip 開窗，slot 內就是那顆真的 canvas。
//
// 因此本元件只是一把「捲動尺」：把自身高度換算成 symbolProgress，指派 mode 與撤場旗標。
// 也因為視覺已經是 fixed，**不需要 pin**（少一層 transform / containing block 的雷）。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { symbolMode, symbolTarget, setSymbolProgress, symbolLayerDone } =
  useOrangeCoreProgress();

// 段落高度 ＝ SYMBOL_VH × 視窗高（見 ~/utils/orange-core-config）＝ 序列的捲動長度。
const sceneHeight = `${SYMBOL_VH * 100}vh`;

// 捲動尺：本段頂端進入視窗底（＝ hero 轉場 pin 剛釋放的那一刻）起算，到本段捲完為止。
//   ・start 'top bottom' 只看「sec1 底緣抵達視窗底」→ 與本段高度無關，故不論 SYMBOL_VH 調多少，
//     都精準接在 hero 轉場 pin 釋放的同一刻（兩軌首尾相接、不重疊）。
//   ・end 'bottom bottom' → 捲動距離＝本段高度＝ SYMBOL_VH × 100vh。
//   ・scrub 特性 → 往回捲自動倒退（converge→…→disperse）。
//
// ── symbolProgress 時序表 ────────────────────────────────────────────────
// ⚠️ 這是換算結果、不是資料來源：門檻在 SYMBOL_STOPS / FORUM_HANDOFF，距離＝門檻 × SYMBOL_VH。
//    改動那三個常數後要回來手動同步這張表。下表為 SYMBOL_VH = 3.2（總長 320vh），
//    括號內 px 是視窗高 1080 的換算。
//
//   step  mode / 事件                              progress    累計距離（起→迄）        該段距離
//   ①     disperse 分散（預設）                     0 → 15%     0    → 48vh    (0→518px)      48vh
//   ②     face 集合（人像）＝最長的一拍              15% → 58%   48   → 185.6vh (518→2004px)   137.6vh
//   ③     converge 匯聚成點                         58% → 75%   185.6→ 240vh   (2004→2592px)  54.4vh
//   ④     coreIn 交棒：本層淡出＋ForumCore 淡入      75%         240vh          (2592px)        —
//   ⑤     enter 橘核心停在黑畫面（原地停住）          75% → 90%   240  → 288vh   (2592→3110px)  48vh
//   ⑥     agendaIn 議程 reveal（仍在畫面外）         90%         288vh          (3110px)        —
//   ⑦     coreOut 黑底淡出、段落捲完（onLeave→鎖 1） 100%        320vh          (3456px)        32vh
//
// ⑦ 之後還有一段「懸停期」不在本尺內：黑白接縫要再升 50vh 才抵達視窗中央，橘點在那段期間
// 停在中央不動，然後由論壇段路徑接手（見 ForumCorePath 的 start: 'top center'）。
// 那 50vh 是零跳點幾何的下限，見 FORUM_HANDOFF 的註解。
//
// 前一軌（hero 轉場）為 TRANSITION_VH = 1.2 ＝ 120vh，故 hero 轉場 ＋ 本段合計 440vh。
//
// ⚠️ SymbolFace 內部並不吃 scroll：上表的 mode 切換只是「觸發」它 2.2s 的 gsap 補間
//    （disperseDuration）。本表只管門檻位置。
// ⚠️ reveal（粒子淡入）不在本表內：它由 SymbolFace 的執行閘門一次性啟動 ——
//    ＝ 轉場層 active（transitionProgress > 0，比本段的起點更早）＋ 進入視口 ＋ 分頁在前景。
//    也就是說 reveal 發生在前一軌（hero 轉場的拉長段）裡，本段接手時粒子已在場。
const sceneRef = ref<HTMLElement | null>(null);
let symbolST: ScrollTrigger | null = null;

onMounted(() => {
  if (!sceneRef.value) return;
  gsap.registerPlugin(ScrollTrigger);
  symbolST = ScrollTrigger.create({
    trigger: sceneRef.value,
    start: 'top bottom',
    end: 'bottom bottom',
    invalidateOnRefresh: true,
    onUpdate: (self) => setSymbolProgress(self.progress),
    onLeaveBack: () => setSymbolProgress(0), // 捲回本段之前 → 回到 disperse
    onLeave: () => setSymbolProgress(1), //     捲過本段之後 → 維持 enter（已進入論壇）
  });
});

onBeforeUnmount(() => {
  symbolST?.kill();
  symbolST = null;
});

// scroll 主導：symbolProgress 解出的目標 → 指派 SymbolFace 的 mode 與轉場層的撤場旗標。
// 分兩個 watch 只在「值真的改變」時觸發（mode 改變才會讓 SymbolFace 跑 2.2s 補間）。
watch(() => symbolTarget.value.mode, (m) => (symbolMode.value = m), {
  immediate: true,
});
watch(() => symbolTarget.value.enter, (e) => (symbolLayerDone.value = e), {
  immediate: true,
});
</script>

<template>
  <!-- 純捲動尺：無內容。黑底是為了萬一轉場層還沒蓋滿時不露白。 -->
  <section
    ref="sceneRef"
    class="sec-symbol"
    :style="{ height: sceneHeight }"
    aria-hidden="true"
  >
    <!-- symbol 序列進度（僅 dev）。fixed 定位，本 section 無 transform 故不受影響。 -->
    <DevOnly>
      <DevFaceProgress />
    </DevOnly>
  </section>
</template>

<style lang="scss" scoped>
.sec-symbol {
  position: relative;
  background-color: #000;
}
</style>
