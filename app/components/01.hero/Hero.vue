<script setup lang="ts">
// Section 1：hero 影片 → 引言 → 轉場到 SymbolScene
//   影片播畢 → core 於第一屏中央淡入 → 沿垂直線下降、穿透引言文字 → 停在視窗正中央
//   → transition pin hold 住畫面：橘方塊上下拉長 → 左右展開成滿版（見 HeroSymbolTransition）。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section1.json';

// ref：
//   sec1Ref       — 座標範圍 / ScrollTrigger trigger
//   orangeCoreRef — orange core 元件（曝露 root el 供 GSAP 驅動）
//   innerRef      — 含 core / path / 內容的整組（絕對定位原點，也是 transition pin 的目標）
//   introRef      — 引言整段（含 60vh runway）：path 終點與 pin 起點共用的參照
const sec1Ref = ref<HTMLElement | null>(null);
const orangeCoreRef = ref<{ root: HTMLElement | null } | null>(null);
const innerRef = ref<HTMLElement | null>(null);
const introRef = ref<HTMLElement | null>(null);

// OrangeCore 元件曝露的 root el，交給 OrangeCorePath 以 GSAP 驅動。
const orangeCoreEl = computed(() => orangeCoreRef.value?.root ?? null);

// core 移動進度（path 軌）＋ 轉場進度：全域共享（單一來源，見 useOrangeCoreProgress）。
// symbolMode / symbolLayerDone 是給轉場層內那顆 <SymbolFace> 用的：
// 本元件只負責「讓它在場」，序列與撤場時機都由 02.symbol/SymbolScene 依捲動寫入。
const {
  pathProgress,
  transitionProgress,
  setTransitionProgress,
  symbolMode,
  symbolLayerDone,
} = useOrangeCoreProgress();

// 引言淡出：core 接近視窗中央（path 進度過 INTRO_FADE_FROM）時整段淡出，讓位給轉場。
const introOpacity = computed(() => {
  const p =
    (pathProgress.value - INTRO_FADE_FROM) / (1 - INTRO_FADE_FROM || 1);
  return String(1 - Math.min(1, Math.max(0, p)));
});

// hero 影片四階段（main/loop/outro/gone）全域共享，定義見 composables/useHeroVideo。
// 此處只讀狀態驅動畫面與捲動鎖：main / loop 鎖捲動、outro 起解鎖。
//
// 載入層與影片的握手也走同一份全域狀態：
//   videoReady — HeroVideo 的 <video> canplay（或逾時 / 載入失敗）時設 true → HeroLoader 收尾條件。
//   loaderDone — HeroLoader @done 時由本元件設 true → HeroVideo 才開始播 main（避免被載入層蓋住白播）。
const {
  state: heroState,
  isGone,
  shouldLockScroll,
  videoReady,
  loaderDone,
} = useHeroVideo();

watch(heroState, applyScrollLock);

// core 於轉場開始後隱去：其後畫面上那個方塊由 HeroSymbolTransition 接手畫
// （避免兩層各畫一次而 drift）。以 opacity 隱藏而非 display:none —— 轉場層仍要讀它的螢幕矩形。
const coreVisible = computed(
  () => isGone.value && transitionProgress.value <= 0,
);

// transition pin：core 抵達視窗正中央時釘住整組，吃掉 TRANSITION_VH 捲動距離 scrub 兩段軸向放大。
// ⚠️ trigger 用 introRef 而非 .sec1 —— pin 會在 .sec1 內插入 pin-spacer 把 section 撐高，
//    拿 .sec1 的 'bottom bottom' 當 start 會變成循環依賴（量到的高度含 spacer）。
//    introRef 在被 pin 的 .sec1__inner 之內，幾何不受 spacer 影響；OrangeCorePath 的
//    endTrigger 用同一個元素，故「core 抵達中央」與「pin 開始」必然同一刻。
// ⚠️ pin 會在 .sec1__inner 寫入 transform，使其成為 fixed 子孫的 containing block →
//    HeroLoader 與 HeroSymbolTransition 都必須掛在 inner「外面」，否則改以 inner 為基準而跑位。
let transitionST: ScrollTrigger | null = null;

onMounted(() => {
  // hero 影片體驗一律從頂端開始：停用瀏覽器捲動位置還原，
  // 避免重整後還原到內容區、卻因 main/loop 狀態把 body 鎖死在中途。
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // 捲動鎖由本元件「單一擁有」：載入層一掛上就上鎖（此時為 main），一路持有到
  // outro/gone 才解鎖。HeroLoader 不再自行改 body.overflow —— 否則它卸載時
  // 先解鎖、本元件下一 tick 才重新上鎖，中間會出現「瞬間可捲動」的破口。
  applyScrollLock();

  if (!introRef.value || !innerRef.value) return;
  gsap.registerPlugin(ScrollTrigger);
  transitionST = ScrollTrigger.create({
    trigger: introRef.value,
    start: 'bottom bottom', // 引言整段（含 runway）底緣抵達視窗底 ＝ core 剛好停在視窗正中央
    end: () => `+=${window.innerHeight * TRANSITION_VH}`,
    pin: innerRef.value,
    pinSpacing: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => setTransitionProgress(self.progress),
    onLeaveBack: () => setTransitionProgress(0), // 捲回 pin 之前 → 收回轉場
    onLeave: () => setTransitionProgress(1), //     捲過 pin 之後 → 維持滿版，等 SymbolScene 接手
  });
});

onBeforeUnmount(() => {
  document.body.classList.remove('is-scroll-locked');
  transitionST?.kill();
  transitionST = null;
});

// main / loop 期間鎖住 body 捲動；其餘（outro / gone）解鎖。
// 樣式集中在 base.scss 的 body.is-scroll-locked：overflow:hidden ＋ padding-right
// 補回捲軸寬（--scrollbar-width，由 plugins/scrollbar-width.client.ts 量測）——
// 否則上鎖期間沒有捲軸、可用寬多 15px，解鎖後捲軸回來就會撐出水平捲軸。
function applyScrollLock() {
  if (shouldLockScroll.value) {
    // 上鎖前先回頂端：否則重整後瀏覽器把位置還原到內容區、又處於 main/loop，
    // 會被 overflow:hidden 永久鎖死在中途。
    window.scrollTo(0, 0);
    document.body.classList.add('is-scroll-locked');
  } else {
    document.body.classList.remove('is-scroll-locked');
  }
}
</script>

<template>
  <section ref="sec1Ref" class="sec1">
    <!-- core 沿線移動進度（fixed 右下角，直接讀 useOrangeCoreProgress）。
         <DevOnly>：production build 會整個編譯掉、不進 bundle。 -->
    <DevOnly>
      <DevOrangeCoreProgress />
    </DevOnly>

    <!-- 載入層：必須掛在 .sec1__inner「外面」——pinST 會在 inner 寫入 transform，使其成為
         fixed 子孫的 containing block，loader 放進去會改以 inner 為基準而跑位。
         @after-leave 再確認捲動鎖；HeroLoader 不碰 body.overflow，故無需等它卸載。 -->
    <Transition name="loader-fade" @after-leave="applyScrollLock">
      <HeroLoader
        v-if="!loaderDone"
        :duration="2"
        :ready="videoReady"
        @done="loaderDone = true"
      />
    </Transition>

    <!-- 視覺內容整組包一層 inner：core / path 的絕對定位原點，也是 transition pin 的目標。 -->
    <div ref="innerRef" class="sec1__inner">
      <!-- hero：第一屏影片區塊（已抽為子元件 01.hero/HeroVideo.vue） -->
      <HeroVideo />

      <!--
        orange core：影片結束後於第一屏正中央淡入 —— 這是 core 在 DOM 端的起點。
        位置由 OrangeCorePath 以 GSAP 驅動；此處只保留外觀與淡入。
        🚧 淡入點目前為「第一屏正中央」＝沿用舊稿的 placeholder。新稿的核心是從影片
           最後一幀的階梯線缺口掉出（設計稿約在 x 515/1280），待正式影片到位後對齊。
      -->
      <OrangeCore ref="orangeCoreRef" :visible="coreVisible" />

      <!--
        core 移動路徑 overlay（section 級、1:1 px）：只有不可見的驅動線
        （新稿 hero 段沒有可見的設計線 —— 影片結尾那條階梯線在影片裡）。
        需要 .sec1（座標範圍 / trigger）與 core（被驅動）兩個元素。
      -->
      <OrangeCorePath
        :section-el="sec1Ref"
        :orange-core-el="orangeCoreEl"
        :end-el="introRef"
      />

      <div class="sec1__scene">
        <!-- intro 引言：置中窄欄；core 垂直穿透這段文字，接近視窗中央時整段淡出讓位給轉場。
             本元素（含 60vh runway）的底緣＝path 終點與 transition pin 起點的共用參照。 -->
        <div ref="introRef" class="sec1__intro" :style="{ opacity: introOpacity }">
          <p class="sec1__intro-body">{{ str.intro.body }}</p>
        </div>
      </div>
    </div>

    <!--
      hero → SymbolScene 轉場層（fixed 滿版）：橘方塊上下拉長 → 左右展開成滿版。
      必須掛在 .sec1__inner「外面」—— pin 會在 inner 寫入 transform，成為 fixed 子孫的
      containing block，掛進去會改以 inner 為定位基準而跑位。
    -->
    <HeroSymbolTransition
      :progress="transitionProgress"
      :core-el="orangeCoreEl"
      :done="symbolLayerDone"
    >
      <!--
        真正的符號粒子場：住在轉場層的 slot 內，故「左右展開時窗內已見粒子」是真的粒子。
        序列（disperse→face→converge）由 02.symbol/SymbolScene 依捲動指派 symbolMode，
        本處只負責「在場」與外觀參數；兩邊透過 useOrangeCoreProgress 的 symbolMode 對接。
      -->
      <SymbolFace
        v-model:mode="symbolMode"
        :dev="false"
        :hole-radius="25"
        :hole-spread="50"
        :return-ease="1.5"
        :friction="1.8"
        :impulse-strength="10000"
        :impulse-spray="0.9"
        :impulse-spray-z="0.6"
        :velocity-follow="0.1"
        :max-speed="3000"
        :max-particles="10000"
        :color="['#ffffff', '#9fd6ff', '#77c6e0', '#3f8fb5']"
        bg-color="#000"
        :sample-step="5"
        :size-min="16"
        :size-max="32"
        :min-density="0.7"
        :density-gamma="2.4"
        :dark-boost="1.8"
        :float-amp="18"
        :float-micro="0.5"
      />
    </HeroSymbolTransition>
  </section>
</template>

<style src="./Hero.scss" lang="scss" scoped />
