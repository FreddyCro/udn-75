<script setup lang="ts">
// Section 3：永續祝福（partner）。
//
// 兩段構造：
//   ① 逐格臉屏 —— 一段 BLESSING_VH 高的捲動尺，內含一張 sticky 滿屏（橘底）。
//      臉的格號由 blessingProgress 解出（見 useOrangeCoreProgress 的 blessingFrame）。
//      對應 Figma 永續祝福01–03（pc 2065:140462 / pad 2065:125534 / mob 2065:121838）。
//   ② 夥伴清單 —— 階梯線 ＋ 清單面板。
//
// 不 pin：sticky 就夠，少一層 transform／containing block 的雷（同 SymbolScene 的取捨）。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section3.json';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';

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
  setBlessingOutProgress,
  partnersOpacity,
  setCoverProgress,
  coverOrange,
  coverSeed,
  coverSeedVisible,
  coverFaceVisible,
} = useOrangeCoreProgress();

// 夥伴清單整塊的現身時機。
//
// 捲動尺跑完（progress 1）的那一刻，sticky 臉屏剛好釋放，而 .section3__partners 的頂端
// 也剛好與臉的下緣重合（見 style 裡 margin-top 的算式）—— 只有這一刻它是「貼著臉」的，
// 所以淡入要壓在這裡，才不會看到它從畫面底部滑上來。之後整段一起往上捲。
//
// 門檻做遲滯（進 0.999 / 出 0.9）而非單一值：交界處微幅上下捲不會反覆閃爍，
// 真的往回看臉的動畫才收回去、下次重新現身。
const partnersIn = ref(false);
watch(blessingProgress, (p) => {
  if (p >= 0.999) partnersIn.value = true;
  else if (p < 0.9) partnersIn.value = false;
});

// 捲動尺高度。ScrollTrigger 是 top top → bottom bottom，可跑的捲動距離＝「尺高 − 100vh」，
// 所以要 +1，實際動畫距離才等於 BLESSING_VH × 100vh（見 ~/utils/orange-core-config）。
// 寫成 BLESSING_VH × 100vh 是錯的 —— 動畫只會剩 (BLESSING_VH − 1) 個視窗高可跑。
// 用 vhLength 而非字面 vh：視窗高有單一來源（--vh），見 ~/utils/viewport-height。
const faceTrackHeight = vhLength(1 + BLESSING_VH);

const { vhPx } = useViewportHeight();

// 夥伴清單的閱讀定格行程。必須是 `.section3` 的**子元素**才算進 sticky 的活動範圍
//（sticky 看父層的 content box，padding 不算 —— 見 BLESSING_PARTNERS_HOLD_VH 的註解）。
const partnersHoldHeight = vhLength(BLESSING_PARTNERS_HOLD_VH);

const sectionRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);
const screenRef = ref<HTMLElement | null>(null);
const faceRef = ref<HTMLElement | null>(null);
const partnersRef = ref<HTMLElement | null>(null);
let coverST: ScrollTrigger | null = null;
let faceST: ScrollTrigger | null = null;
let outroST: ScrollTrigger | null = null;
let innerRO: ResizeObserver | null = null;
let partnersRO: ResizeObserver | null = null;

// 夥伴清單塊是否定住閱讀。**只在它塞得進視窗（扣掉 header）時才定住** ——
// 塊高逐斷點不同（pc 778 / pad 1044 / mob 769），pad 在 1024 高、mob 在 667 高的
// 視窗都比視窗還高。那種情形定住會讓下緣永久留在畫面外（改成貼底則換成階梯線被切），
// 使用者反而看得更少，所以退回原本的自然捲動、spacer 收成 0。
//
// 用 vhPx() 的凍結值而非 window.innerHeight：後者會隨行動裝置網址列收合而變，
// 會讓這個判斷在捲動途中翻面 —— 連帶把 100vh 的 spacer 加進／拿掉，版面直接跳。
const partnersHeld = ref(false);
const syncPartnersHeld = () => {
  const el = partnersRef.value;
  if (!el) return;
  const headerH =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--header-height',
      ),
    ) || 0;
  partnersHeld.value = el.offsetHeight <= vhPx(1) - headerH;
};

// spacer 的高度一變，`.section3` 的高度就跟著變 → 兩條 ScrollTrigger 量到的位置全部過期。
// 必須自己 refresh：spacer 是靠 inline style 長出來的，既不觸發 resize、也不在 GSAP
// 自動 refresh 的時機上。等 nextTick 是因為 partnersHeld 是 ref，樣式下一個 tick 才進 DOM
// —— SSR 是 false，hydration 後才翻 true，而那時 ScrollTrigger 已經建好了。
// 走 refreshScrollTriggers()（先 sort 再 refresh）而非裸 refresh：spacer 改變的是
// `.section3` 的高度，下游 Media 段的 pin 起點全部跟著移動 —— 那些 pin 的建立順序
// 與位置順序無關，不先 sort 就可能用舊的佔位重算（見 utils/scroll-trigger）。
watch(partnersHeld, async () => {
  await nextTick();
  refreshScrollTriggers();
});

// 把臉＋文字這一整塊的實際高度寫進 --face-block-h，供 .section3__partners 的負 margin
// 與臉屏的 min-height 用。量 offsetHeight 而非寫死數字：pad / mob 是直排，
// 塊高會隨文案斷行改變。
//
// ⚠️ 一定要寫在 section 根節點：.section3__partners 是 .section3__face-track 的**兄弟**，
//    自訂屬性只往下繼承，寫在臉屏上它讀不到（會靜靜退回 fallback 280px —— pc 剛好對，
//    pad / mob 就整個歪掉）。
//
// --face-cell-y ＝ 臉框上緣在臉屏內的 y ＝ 白方塊要走的距離
// （起點是臉屏上緣，而 cover 期間臉屏上緣就是色塊上緣＝接縫）。
//
// ⚠️ 一定要量、不能用 --face-block-h 推：pc 的臉是 .section3__face-inner 的第一個
//    flex item（臉框上緣 ＝ inner 上緣），但 **pad／mob 的 .section3__face 是
//    order: 2、排在文字下方**，臉框上緣還要加上 intro 高度與 gap，CSS 算不出來。
//
// 量相對值（兩個 rect 相減）而非絕對座標：臉屏是 sticky，絕對座標會隨 sticky 是否
// engage 而變，相對值不會 —— 這個偏移純粹是版面內部的事。
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

  gsap.registerPlugin(ScrollTrigger);

  // 02 → 03 覆蓋過場：色塊上緣從視窗底緣升到視窗頂緣。
  // `top bottom` → `top top` 幾何上恆為一個視窗高，不需要（也不該有）長度旋鈕。
  // trigger 用 sectionRef 而非 trackRef：量的是 section 的上緣 ＝ 色塊上緣 ＝ 接縫。
  // 與 faceST 首尾相接不重疊：那條的 start（`.section3__face-track` 的 top top）
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
  // 終點固定在「section 下緣抵達視窗頂」，也就是 media 那條 ScrollTrigger 的起點
  //（`top top`）—— 兩段首尾相接、不重疊。起點則往回退 BLESSING_OUT_VH 個視窗高，
  // 那個常數就是整段退場的長度旋鈕（見 orange-core-config）。
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
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncPartnersHeld);
  partnersRO?.disconnect();
  partnersRO = null;
  innerRO?.disconnect();
  innerRO = null;
  coverST?.kill();
  coverST = null;
  faceST?.kill();
  faceST = null;
  outroST?.kill();
  outroST = null;
});
</script>

<template>
  <section
    id="blessing"
    ref="sectionRef"
    class="section3"
    data-header-theme="orange"
    :style="{ '--cover-orange': coverOrange }"
  >
    <!-- ① 逐格臉屏 -->
    <div
      ref="trackRef"
      class="section3__face-track"
      :style="{ height: faceTrackHeight }"
    >
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
                 只有位移的幅度要量（--face-cell-y，見 script）。 -->
            <span
              v-if="coverSeedVisible"
              class="section3__face-seed"
              :style="{ '--cover-seed': coverSeed }"
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
    </div>

    <!-- ② 夥伴清單：整塊在臉的捲動尺跑完、且已貼齊臉的下緣時淡入，
         接著階梯線逐格畫、畫完面板再淡入；段落尾端再整塊淡出（過場第一拍） -->
    <div
      ref="partnersRef"
      class="section3__partners"
      :class="{
        'is-in': partnersIn,
        'is-out': partnersOpacity < 1,
        'is-held': partnersHeld,
      }"
      :style="{ '--partners-out': partnersOpacity }"
    >
      <BlessingStairs v-model:done="stairsDone" :armed="partnersIn" />

      <div
        class="section3__partners-panel"
        :class="{ 'is-in': stairsDone }"
      >
        <BlessingPartners />
      </div>
    </div>

    <!-- 閱讀定格行程：撐出 .section3__partners 的 sticky 活動範圍。
         沒定住（塊比視窗高）時收成 0，否則會多出一段空橘 -->
    <div
      class="section3__partners-hold"
      :style="{ height: partnersHeld ? partnersHoldHeight : '0px' }"
      aria-hidden="true"
    />
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
  background: color-mix(
    in srgb,
    var(--color-orange) calc(var(--cover-orange, 1) * 100%),
    var(--color-blue)
  );
  color: #fff;

  // 藍 → 橘的補間交給 CSS：--cover-orange 現在是二元的（見 coverOrangeAt），
  // 只在接觸點跨越一次，所以 transition 不會有「每一幀追補間」的發黏問題。
  // 0.4s ease 對齊本檔其他淡入淡出（.section3__partners / .section3__partners-panel）。
  transition: background-color 0.4s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.section3__face-track {
  position: relative;
  // height 由 inline style 給（BLESSING_VH × 100vh）
}

// 把整塊往上拉「臉下方那塊空橘色」的高度 ——
//
//   臉屏是一個視窗高、內容置中 → 臉的下緣在 (V + h)/2；
//   本塊在一般流裡的自然位置是捲動尺的底部，也就是 V（sticky 釋放的那一刻＝畫面底緣）；
//   兩者要重合 → margin-top ＝ (V + h)/2 − V ＝ h/2 − V/2（負值）。
//
// 於是「捲動尺跑完」與「貼齊臉的下緣」是同一個瞬間，臉隨即釋放，整段一起往上捲。
// h 由 --face-block-h 帶入（JS 量 .section3__face-inner，見 script）；
// fallback 280px ＝ pc 臉的高度，SSR 與 hydration 之前不會歪。
//
// padding-top ＝ 設計稿的「臉下緣 → 階梯線」距離：
//   pc  20 ＝ 永續祝福04 的階梯線 y20（臉貼齊帶底 420）
//   pad 64 ＝ 帶底剩 826 − (513.77+280) ≈ 32，再加階梯線 y32
//   mob 27 ＝ 階梯線 y27（臉貼齊帶底 596）
// gap 則是設計稿的「階梯線 → 面板」距離。
//
// 淡入壓在 progress 1（見 script 的 partnersIn）：在那之前它雖然已經在版面上、
// 也已經捲進視窗，但還沒貼到臉的下緣 —— 藏著才不會看到它滑上來的過程。
.section3__partners {
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

  // 閱讀定格：塊高與視窗高之差就是它「完整在畫面上」的捲動距離（pc ≈122px），
  // 不定住來不及看。定住行程由後面的 .section3__partners-hold 撐出來。
  // 由 JS 上 class 而非純 CSS：條件是「塊塞得進視窗」—— 那是量測不是斷點（見 script）。
  // top 貼 header 底緣，階梯線與第一個分層標題才不會被壓在 header 底下。
  // 負 margin 不受影響 —— sticky 從正常流位置起算偏移，「貼齊臉下緣」的算式照舊。
  &.is-held {
    position: sticky;
    top: var(--header-height);
  }

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

// 閱讀定格行程：高度由 inline style 給（BLESSING_PARTNERS_HOLD_VH），這裡不定樣式。
// 它是 .section3 的子元素而非 padding，sticky 的活動範圍才算得進去。

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

// 臉屏＝一個視窗高、內容置中 → pin 住的整段，臉這一塊的垂直中心恆等於畫面正中，
// 與視窗高、內容高都無關。臉與階梯線之間那塊空橘色不在這裡處理，
// 由 .section3__partners 的負 margin-top 收掉（見下方）。
//
// min-height 是給「視窗比內容還矮」的橫置手機用的：置中 ＋ overflow: hidden 會上下都切掉，
// 至少讓臉屏長到容得下內容。
.section3__face-screen {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: vh();
  min-height: var(--face-block-h, 280px);
  overflow: hidden;
}

// pc：臉在左、文字在右；pad / mob：文字在上、臉在下
.section3__face-inner {
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
.section3__face-seed {
  position: absolute;
  top: 0;
  left: 43.75%; // 7 / 16
  width: 12.5%; // 2 / 16
  aspect-ratio: 1;
  background: #fff;
  transform: translateY(calc((var(--cover-seed, 1) - 1) * var(--face-cell-y, 0px)));
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
