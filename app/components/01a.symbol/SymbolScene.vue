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

const {
  symbolMode,
  symbolProgress,
  symbolTarget,
  setSymbolProgress,
  symbolLayerDone,
  symbolConvergeLight,
  symbolHeaderTint,
} = useOrangeCoreProgress();

// 段落高度 ＝ SYMBOL_VH × 視窗高（見 ~/utils/orange-core-config）＝ 序列的捲動長度。
// 用 vhLength 而非字面 `320vh`：視窗高在本專案有單一來源（--vh），見 ~/utils/viewport-height。
const sceneHeight = vhLength(SYMBOL_VH);

// 捲動尺：本段頂端進入視窗底（＝ hero 轉場 pin 剛釋放的那一刻）起算，到本段捲完為止。
//   ・start 'top bottom' 只看「sec1 底緣抵達視窗底」→ 與本段高度無關，故不論 SYMBOL_VH 調多少，
//     都精準接在 hero 轉場 pin 釋放的同一刻（兩軌首尾相接、不重疊）。
//   ・end 'bottom bottom' → 捲動距離＝本段高度＝ SYMBOL_VH × 100vh。
//   ・往回捲自動倒退（converge→…→disperse）：靠 onUpdate 直接讀 self.progress，
//     不是 scrub —— 本 trigger 沒有掛動畫，沒有東西需要被 scrub 平滑補間。
//
// ── symbolProgress 時序表 ────────────────────────────────────────────────
// ⚠️ 這是換算結果、不是資料來源：**唯一來源是 SYMBOL_BEAT_VH**（四拍各吃多少 vh），
//    progress 門檻與本表都是它的換算結果。改動那個常數後要回來手動同步這張表。
//    下表為 SYMBOL_VH = 3.64（總長 364vh），括號內 px 是視窗高 1080 的換算。
//
//   step  mode / 事件                              progress      累計距離（起→迄）        該段距離
//   ①     disperse 分散（前段疊開場三行文案）        0 → 30.77%    0    → 112vh   (0→1210px)     112vh
//         └ 文案 8vh 起播 → 自走 6.4s 時間軸（2.0s 三行到位／停留 3.0s／1.4s 依序退場）
//           104vh 保底清場（越過就強制淡出）。門檻在 SYMBOL_INTRO、節奏在 INTRO_TIMELINE
//   ②     face 集合（人像）＝最長的一拍              30.77 → 68.13%  112 → 248vh (1210→2678px)  136vh
//   ③     converge 收攏成一顆**白** core（底色仍黑） 68.13 → 83.52%  248 → 304vh (2678→3283px)   56vh
//   ③b    白 core → 橘 ＋ 整片底色黑→白             83.52 → 89.01%  304 → 324vh (3283→3499px)   20vh
//         └ 顏色先收齊（窗口的 55% 處）、底色殿後到 1，見 CORE_WARM_COLOR_SPAN
//   ④     coreIn 交棒：本層淡出＋ForumCore 硬切上場  89.01%        324vh          (3499px)        —
//   ⑤     enter 橘核心停在白畫面（原地停住）          89.01 → 91.21%  324 → 332vh (3499→3586px)    8vh
//   ⑥     agendaIn 議程 reveal（仍在畫面外）         91.21%        332vh          (3586px)        —
//   ⑦     coreOut 滿版白底淡出、段落捲完（onLeave→鎖 1） 100%       364vh          (3931px)        32vh
//
// ⑤＋⑦ ＝ handoff 那一拍的 40vh。⑦ 的 32vh 是 AGENDA_OFFSCREEN_VH 的硬下限（議程淡入必須
// 發生在畫面外），故 handoff 再縮就只能吃掉 ⑤ 的 8vh 停留 —— 見 FORUM_HANDOFF 的註解。
//
// ⑦ 之後還有一段「懸停期」不在本尺內：黑白接縫要再升 50vh 才抵達視窗中央，橘點在那段期間
// 停在中央不動，然後由論壇段路徑接手（見 ForumCorePath 的 start: 'top center'）。
// 那 50vh 是零跳點幾何的下限，見 FORUM_HANDOFF 的註解。
//
// 前一軌（hero 轉場）為 TRANSITION_VH = 1.2 ＝ 120vh，故 hero 轉場 ＋ 本段合計 484vh。
//
// ⚠️ ① 與 ② 的交界（mode 切換）只是「觸發」SymbolFace 那 2.2s 的 gsap 補間
//    （disperseDuration），本表只管門檻位置、不管補間跑多久。
//    ③／③b **是例外**：2026-08-13 起綁 scrub —— 三個值都由 symbolProgress 的純函式
//    逐幀決定（Hero 以 converge-amount / warm-amount / bg-light-amount 餵進去）。
//    改的理由是往回捲：定時補間永遠貼在區段前緣，往回滑時 ③ 整拍靜止、補間要到離開
//    這一拍才跑，於是 ③＋⑤＋⑦ 連續 96vh 一片白什麼都不動。推導見 convergeAmountAt。
//    ⚠️ ③ 與 ③b 是**兩段不接續的窗口**（2026-08-17 拆的）：收攏在 304vh 就跑完，
//       其後那 20vh 粒子已全部到位、畫面上只有顏色在變。拆開的理由見 CORE_WARM_VH。
// ⚠️ reveal（粒子淡入）不在本表內：它由 SymbolFace 的執行閘門啟動 ——
//    ＝ 轉場層 active（transitionProgress > 0，比本段的起點更早）＋ 進入視口 ＋ 分頁在前景。
//    也就是說 reveal 發生在前一軌（hero 轉場的拉長段）裡，本段接手時粒子已在場。
//    三個訊號在 reveal 跑完前任一個轉為 false（例如使用者又捲回 hero），SymbolFace 會把它
//    收回起點並允許重跑 —— 這段動畫的用意就是「要有人看見」，不是計時器。
const sceneRef = ref<HTMLElement | null>(null);
let symbolST: ScrollTrigger | null = null;

onMounted(() => {
  if (!sceneRef.value) return;
  gsap.registerPlugin(ScrollTrigger);
  symbolST = ScrollTrigger.create({
    trigger: sceneRef.value,
    start: 'top bottom',
    end: 'bottom bottom',
    // 刻意沒有 invalidateOnRefresh：它是「refresh 時對綁定的動畫呼叫 invalidate()」，
    // 而本 trigger 沒有掛動畫 → 純粹的 no-op。start/end 是字串，refresh 本來就會重算。
    onUpdate: (self) => setSymbolProgress(self.progress),
    // ⚠️ onRefresh 不是可有可無的（同 Blessing 三條軌的理由）：symbolProgress 是 useState，
    //    **跨 client-side 導航存活**，而下面三個回呼都只在「狀態改變」時才寫入。
    //    子頁換回首頁時本元件 remount，這支 trigger 是全新的、自己的 progress 從 0 起算：
    //    onUpdate 因為沒變化不觸發、onLeaveBack 因為從沒進去過也不觸發 —— 於是上一輪捲到
    //    論壇之後留下的 1 沒人寫回 0。後果是 ForumCore 的橘點（forumCoreDotVisible 的第一個
    //    條件就是 symbolProgress ≥ coreIn）在 scrollY 0 的 hero 影片上憑空現身。
    //    refresh 一定會在 create() 當下跑一次，補在這裡才是「不論怎麼進到這頁都對得上」。
    onRefresh: (self) => setSymbolProgress(self.progress),
    onLeaveBack: () => setSymbolProgress(0), // 捲回本段之前 → 回到 disperse
    onLeave: () => setSymbolProgress(1), //     捲過本段之後 → 維持 enter（已進入論壇）
  });
});

onBeforeUnmount(() => {
  symbolST?.kill();
  symbolST = null;
});

// 錨點列的「論壇」要在**開場三行文案的第一行浮現**時就亮 —— 那是本章節在畫面上真正
// 開演的時刻。交給 header 的幾何 spy 會晚 37vh：`.sec-symbol` 只是一把尺，畫面住在
// hero 的 slot 裡 fixed 滿版（見檔頭），文字已經在視窗正中央演了一陣子，這個空佔位才
// 剛捲進中央帶。所以改由本段自己宣告（見 ~/composables/useAnchorClaim）。
// 起點與 <SymbolIntro> 的起播閘門是**同一個** SYMBOL_INTRO.in，不是另外抄一個數字。
//
// ⚠ 上界是 1（＝本段捲完）而不是「一路亮到底」：
//   ① symbolProgress 在 onLeave 之後恆為 1、且跨導航存活 —— 不放手的話後面兩個錨點
//      永遠亮不起來（claim 蓋過幾何 spy）。
//   ② 放手之後不會有空窗：那一刻 `.sec-symbol` 早已橫跨整條中央帶（頂端在 −2.64vh、
//      底緣正在視窗底），幾何 spy 靠它宣告的 data-anchor-target 接著亮同一個錨點。
const { setAnchorClaim } = useAnchorClaim();
const symbolOnScreen = computed(
  () => symbolProgress.value >= SYMBOL_INTRO.in && symbolProgress.value < 1,
);
watch(symbolOnScreen, (on) => setAnchorClaim(on ? 'forum' : null), {
  immediate: true,
});
// 換到子頁時本元件會 unmount，但 useState 活著 —— watch 停了就沒人放手了。
onBeforeUnmount(() => setAnchorClaim(null));

// header 配色的逐幀漸變：底色黑→白那 20vh 內，header 跟著**同一條曲線**在 dark 與
// light 之間連續插值，取代原本在窗口正中央硬翻一次（使用者回報的「進入 forum 直接
// 切換主題」）。宣告權留在段落自己 —— header 只收一個數字，不認得符號段，同
// data-header-theme／data-anchor-target 的分工。
//
// ⚠ 下面那行 data-header-theme **刻意不改**：tint 是疊在離散三檔之上的覆寫，窗口期間
//   底下那個 0.5 硬翻看不見；窗口外 tint 放手，接手的正是它。兩者是同一段捲動的兩種
//   讀法，不是兩份設定，見 headerTintAt 的註解。
const { syncHeaderTint } = useHeaderTint();
watch(symbolHeaderTint, (t) => syncHeaderTint(t), { immediate: true });
// 換到子頁時本元件會 unmount，但旗標活著 —— watch 停了就沒人放手了（同 setAnchorClaim）。
// 少這一行的症狀是：在窗口中途離開首頁，子頁的 header 會卡在那一刻的混色。
onBeforeUnmount(() => syncHeaderTint(null));

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
  <!-- 純捲動尺：無內容。底色是為了萬一轉場層還沒蓋滿時不露餡，故要跟著序列走：
       收攏之後那 20vh（白 core 轉橘的同一段）才翻白，見下方 SCSS 與 SymbolFace 的
       convergeBgColor。
       data-header-theme 一併跟著翻 —— header 是靠段落宣告的主題決定自身配色，
       底色翻白之後還宣告 dark 的話，header 的內容會白對白看不見。
       （屬性本身在 SSR 就存在，符合 AppHeader onMounted 收集 [data-header-theme] 的前提；
         值由 dataset 每次捲動即時讀取，故動態綁定有效，見 AppHeader 的 updateTheme。）
       （進度除錯已整合成跨章節的 <DevCoreProgress>，掛在 pages/index.vue，?pathdebug 開啟。）

       data-anchor-target：本段是論壇章節的開場（見檔頭：對應 Figma「智慧論壇05–08」），
       故錨點列在這整段就該亮「論壇」。它有 SYMBOL_VH 個視窗高，不宣告的話 header 剛滑入
       就會有那麼長一段三個錨點全不亮。宣告權在段落自己，AppHeader 只讀屬性、不認得
       .sec-symbol —— 同 data-header-theme 的分工。值是靜態的，SSR 就在。
       ⚠ 這個屬性只管得到**本元素捲進中央帶之後**那一段（距段起點 45vh 起）。開頭那 37vh
         畫面上早已是本章節（文案在 8vh 就浮現了），那一段改由上面的 anchor claim 補上。 -->
  <section
    ref="sceneRef"
    class="sec-symbol"
    :class="{ 'sec-symbol--light': symbolConvergeLight }"
    :style="{ height: sceneHeight }"
    aria-hidden="true"
    :data-header-theme="symbolConvergeLight ? 'light' : 'dark'"
    data-anchor-target="forum"
  />
</template>

<style lang="scss" scoped>
// 這段的底色只有在「上面兩層都沒蓋住」時才會被看到，而那正是 coreOut 之後那一小段：
// ForumCore 的滿版白底已淡出、.sec2 還沒捲上來，露出來的就是本段。
// 故它必須跟著序列翻面，否則往下捲會在 forum 前面插一段黑（白 → 黑 → 白）。
//
// 綁 symbolConvergeLight（＝ 底色過黑白中點）而不是 symbolMode === 'converge'：
// mode 在 converge 那一拍的**起點**就翻面，底色卻要到那一拍的最後 20vh 才開始變白 ——
// 綁 mode 的話這裡會提早 66vh 翻白，而 header 也會跟著提早宣告自己站在淺色底上、改用
// 深色內容，但底下其實還是全黑（那 66vh 的 header 等於看不見）。
// symbolBgLightAt 在越過交棒點之後恆為 1，故這個條件照樣涵蓋「一路到段落結束」，
// 往回捲也自動翻回黑 —— 與 SymbolFace 的 convergeBgColor 仍是同一條規則的兩半。
//
// 不做 transition：切換的那一刻本段一定被不透明的轉場層（含滿版 canvas）蓋著，看不到；
// 補一段時間曲線只會多一個要和 disperseDuration 對齊的數字。
.sec-symbol {
  position: relative;
  background-color: #000;
}

.sec-symbol--light {
  background-color: #fff;
}
</style>
