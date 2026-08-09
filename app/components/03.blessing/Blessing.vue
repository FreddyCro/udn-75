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

const { partner } = str;
// 階梯線的逐格進場是否已播完（stairsDone）—— 播完才讓夥伴清單面板淡入。
// 由 <BlessingStairs> 以 v-model:done 雙向控制：使用者捲回階梯線上方時它會轉回 false，
// 下次由上往下進入就重播（重置時面板在畫面外，淡出看不到）。詳見該元件檔頭。
// 它住在 useOrangeCoreProgress 而非本檔的區域 ref：SEQUENCE 的 blessing.stairs 是
// 'time' part，除錯 dashboard 要讀它才判得出 idle / done。雙向綁定行為不變。
const { blessingProgress, blessingFrame, setBlessingProgress, stairsDone } =
  useOrangeCoreProgress();

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

const sectionRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);
let faceST: ScrollTrigger | null = null;
let innerRO: ResizeObserver | null = null;

// 把臉＋文字這一整塊的實際高度寫進 --face-block-h，供 .section3__partners 的負 margin
// 與臉屏的 min-height 用。量 offsetHeight 而非寫死數字：pad / mob 是直排，
// 塊高會隨文案斷行改變。
//
// ⚠️ 一定要寫在 section 根節點：.section3__partners 是 .section3__face-track 的**兄弟**，
//    自訂屬性只往下繼承，寫在臉屏上它讀不到（會靜靜退回 fallback 280px —— pc 剛好對，
//    pad / mob 就整個歪掉）。
const syncFaceBlockHeight = () => {
  if (!sectionRef.value || !innerRef.value) return;
  sectionRef.value.style.setProperty(
    '--face-block-h',
    `${innerRef.value.offsetHeight}px`,
  );
};

onMounted(() => {
  syncFaceBlockHeight();
  // 臉屏是 align-items: center（不是 stretch）→ 內層的高度由內容決定，不會被臉屏的
  // min-height 回頭撐大，所以不會有 observe → 改高 → 再觸發 observe 的迴圈。
  if (innerRef.value && typeof ResizeObserver !== 'undefined') {
    innerRO = new ResizeObserver(syncFaceBlockHeight);
    innerRO.observe(innerRef.value);
  }

  if (!trackRef.value) return;
  gsap.registerPlugin(ScrollTrigger);
  faceST = ScrollTrigger.create({
    trigger: trackRef.value,
    start: 'top top',
    end: 'bottom bottom',
    invalidateOnRefresh: true,
    onUpdate: (self) => setBlessingProgress(self.progress),
    onLeaveBack: () => setBlessingProgress(0),
    onLeave: () => setBlessingProgress(1),
  });
});

onBeforeUnmount(() => {
  innerRO?.disconnect();
  innerRO = null;
  faceST?.kill();
  faceST = null;
});
</script>

<template>
  <section
    id="blessing"
    ref="sectionRef"
    class="section3"
    data-header-theme="orange"
  >
    <!-- ① 逐格臉屏 -->
    <div
      ref="trackRef"
      class="section3__face-track"
      :style="{ height: faceTrackHeight }"
    >
      <div class="section3__face-screen">
        <div ref="innerRef" class="section3__face-inner">
          <div class="section3__face">
            <BlessingFace :frame="blessingFrame" />
          </div>

          <div class="section3__intro">
            <h2 class="section3__title">{{ partner.title }}</h2>
            <p class="section3__body">{{ partner.body }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ② 夥伴清單：整塊在臉的捲動尺跑完、且已貼齊臉的下緣時淡入，
         接著階梯線逐格畫、畫完面板再淡入 -->
    <div class="section3__partners" :class="{ 'is-in': partnersIn }">
      <BlessingStairs v-model:done="stairsDone" :armed="partnersIn" />

      <div
        class="section3__partners-panel"
        :class="{ 'is-in': stairsDone }"
      >
        <BlessingPartners />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section3 {
  position: relative;
  background: var(--color-orange);
  color: #fff;
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

.section3__intro {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 36px;
  width: 507px;

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

// 設計稿的「永續祝福」是外框化向量（Figma Group 12474），寬度就是整個 intro 欄寬：
// pc 507×104.04 / pad 340×69.77 / mob 362×74.29 —— 也就是標題與下方內文同寬（pad 的
// 內文較寬 530，標題 340 置中）。四個字都是全形，Noto Sans TC 的字幅各 1em，
// 所以 font-size 取「設計稿寬 ÷ 4」字盒才會剛好對齊；line-height 直接取向量高度。
.section3__title {
  margin: 0;
  font-size: 126.75px; // 507 / 4
  font-weight: 300;
  line-height: 104px;
  white-space: nowrap; // 字盒與欄寬等寬，四捨五入的誤差不該讓它斷成兩行

  @include rwd-max('pc') {
    font-size: 85px; // 340 / 4
    line-height: 70px;
  }

  @include rwd-max('tablet') {
    font-size: 90.5px; // 362 / 4
    line-height: 74px;
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
