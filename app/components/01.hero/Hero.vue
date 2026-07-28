<script setup lang="ts">
// Section 1：hero / intro / date
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section1.json';

// core path overlay 需要的元素 ref：
//   sec1Ref      — 座標範圍 / ScrollTrigger trigger
//   orangeCoreRef — orange core 元件（曝露 root el 供 GSAP 驅動）
//   dateTitleRef — date 大標（曲線錨定原點）
//   dateRef      — date 整組（pin 的 trigger：決定「何時」釘住）
//   innerRef     — 含 core / path / date 的整組（pin 目標：讓三者一起 fixed、不脫節）
const sec1Ref = ref<HTMLElement | null>(null);
const orangeCoreRef = ref<{ root: HTMLElement | null } | null>(null);
const dateTitleRef = ref<HTMLElement | null>(null);
const dateRef = ref<HTMLElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);

// OrangeCore 元件曝露的 root el，交給 OrangeCorePath 以 GSAP 驅動。
const orangeCoreEl = computed(() => orangeCoreRef.value?.root ?? null);

// core 階段模型（stage 1..6）＋ 各段 local progress：全域共享（單一來源）。
//   - OrangeCorePath 寫 path 軌（stage 1–3）；本元件的 pinST 寫 pin 軌（stage 4–6，見下 setPinProgress）。
//   - stage / stageProgress 驅動 OrangeCore（變長 / 變色）與 HeroForumTransition（星空放大）。門檻見 ~/utils/orange-core-config。
//   - transitionDone：轉場是否已離場（跨元件共享）。本元件的 pinST 寫入；index.vue / Forum 亦可控制。
const { stage, stageProgress, setPinProgress, transitionDone, symbolMode } =
  useOrangeCoreProgress();

// core 移動速度旋鈕：在 date 之前墊出 MOVE_VH 的捲動距離（見 ~/utils/orange-core-config 的 MOVE_VH）。
const moveSpacerHeight = `${MOVE_VH * 100}vh`;

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

// inner 滑到底後把整組釘住（pin ＝ position:fixed）並延展 PIN_VH 捲動深度的 ScrollTrigger。
let pinST: ScrollTrigger | null = null;

// 視窗尺寸變動（拖拉視窗、開關 DevTools、行動裝置轉向）後要重新量測 pin：
// pinSpacing 會把「當下量到的 px 寬高」寫死在 pin-spacer 上，不重量的話會沿用舊寬 ——
// 視窗變窄時撐出水平捲軸、變寬時右側留白。debounce 避免拖拉期間狂重算。
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
function onWindowResize() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}

onMounted(() => {
  // hero 影片體驗一律從頂端開始：停用瀏覽器捲動位置還原，
  // 避免重整後還原到內容區、卻因 main/loop 狀態把 body 鎖死在中途。
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // 捲動鎖由本元件「單一擁有」：載入層一掛上就上鎖（此時為 main），一路持有到
  // outro/gone 才解鎖。HeroLoader 不再自行改 body.overflow —— 否則它卸載時
  // 先解鎖、本元件下一 tick 才重新上鎖，中間會出現「瞬間可捲動」的破口。
  applyScrollLock();

  // date 整組底緣（含 padding-bottom）抵達視窗底時，把 inner（core / path / date）整組
  // 一起 pin 住並吃掉 PIN_VH 捲動距離。trigger 用 date 決定「何時」；pin 用 inner 讓三者一起 fixed
  // → core / path 不會脫離斜槓（解決先前的脫節問題）。
  if (dateRef.value && innerRef.value) {
    gsap.registerPlugin(ScrollTrigger);
    pinST = ScrollTrigger.create({
      trigger: dateRef.value,
      start: 'bottom bottom', // date 底緣（含 padding-bottom）抵達視窗底 → 釘住
      end: () => `+=${window.innerHeight * PIN_VH}`, // 釘住 PIN_VH（見 ~/utils/orange-core-config）
      pin: innerRef.value,
      pinSpacing: true,
      invalidateOnRefresh: true, // 視窗高變動時重算釘住距離
      // pin 期間的捲動進度 → pin 軌（stage 4–6）：變色 → 星空放大 → fixed。
      // 注意：不在此自動關閉轉場層 —— HeroForumTransition 出現後會一直停留，
      //       只有 section 2（Forum）的按鈕把 transitionDone 設 true 才會消失。
      onUpdate: (self) => {
        setPinProgress(self.progress);
      },
      onLeaveBack: () => {
        setPinProgress(0); // 回到 pin 之前 → 退回 stage 1–3（path 軌）
      },
    });
  }

  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  document.body.classList.remove('is-scroll-locked');
  window.removeEventListener('resize', onWindowResize);
  clearTimeout(refreshTimer);
  pinST?.kill();
  pinST = null;
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
         fixed 子孫的 containing block，loader 放進去會改以 inner 為基準而跑位（同 HeroForumTransition）。
         @after-leave 再確認捲動鎖；HeroLoader 不碰 body.overflow，故無需等它卸載。 -->
    <Transition name="loader-fade" @after-leave="applyScrollLock">
      <HeroLoader
        v-if="!loaderDone"
        :duration="2"
        :ready="videoReady"
        @done="loaderDone = true"
      />
    </Transition>

    <!-- 視覺內容整組包一層 inner：core / path / date 的絕對定位原點，也是 pin 目標。
         pin 時整組一起 fixed → core / path 不脫離斜槓（見 script 的 pinST）。 -->
    <div ref="innerRef" class="sec1__inner">
      <!-- hero：第一屏影片區塊（已抽為子元件 01.hero/HeroVideo.vue） -->
      <HeroVideo />

      <!--
        orange core：影片結束後於第一屏（影片區塊）正中央淡入 —— 這是 core 的起點。
        位置由 OrangeCorePath 以 GSAP 驅動（沿驅動線移動）；此處只保留外觀與淡入。
      -->
      <OrangeCore
        ref="orangeCoreRef"
        :stage="stage"
        :stage-progress="stageProgress"
        :visible="isGone"
      />

      <!--
        core 移動路徑 overlay（section 級、1:1 px）：可見灰線 + 不可見驅動線。
        需要 .sec1（座標範圍 / trigger）、core（被驅動）、date 大標（錨定原點）三個元素。
      -->
      <OrangeCorePath
        :section-el="sec1Ref"
        :orange-core-el="orangeCoreEl"
        :anchor-el="dateTitleRef"
      />

      <!-- intro → date：orange core 貫穿的內容場景 -->
      <div class="sec1__scene">
        <!-- intro 引言：置中窄欄，往下滑才進入視窗 -->
        <div class="sec1__intro">
          <p class="sec1__intro-body">{{ str.intro.body }}</p>
        </div>

        <!-- 移動速度 spacer：在 date 之前墊出 MOVE_VH 的捲動距離 → 拉長 core 旅程 = 相對視窗變慢。 -->
        <div
          class="sec1__move-spacer"
          :style="{ height: moveSpacerHeight }"
          aria-hidden="true"
        />

        <!-- date 論壇資訊：整組以絕對定位對齊設計稿 501:21162 相對位置（RWD 之後再處理）。
           core 路徑已抽到 section 級 overlay，尾端仍以此區大標為錨點對齊。 -->
        <div ref="dateRef" class="sec1__date">
          <h2 ref="dateTitleRef" class="sec1__date-title">
            {{ str.date.title }}
          </h2>
          <p class="sec1__date-desc">{{ str.date.desc }}</p>

          <!-- 大型日期：階梯狀排列 2026 / 09 / 16 -->
          <p class="sec1__date-when">
            <span class="visually-hidden">{{ str.date.dateLabel }}：</span>
            <span class="sec1__date-num">{{ str.date.year }}</span>
            <span class="sec1__date-num sec1__date-num--m">{{
              str.date.month
            }}</span>
            <span class="sec1__date-num sec1__date-num--d">
              {{ str.date.day }}
              <!-- 星期（三）：置於圓框內，緊接「16」右下（對應設計 683:51624） -->
              <span class="sec1__date-mark">{{ str.date.weekDay }}</span>
            </span>
          </p>

          <!-- 地點與時間 -->
          <p class="sec1__date-where">
            <span class="visually-hidden">{{ str.date.locationLabel }}：</span>
            <span class="sec1__date-venue">{{ str.date.venue }}</span>
            <span class="sec1__date-time">{{ str.date.time }}</span>
          </p>
        </div>
      </div>
    </div>

    <!--
      hero → section 2 轉場遮罩（fixed 滿版）：stage 5 起由 stageProgress 撐大，
      從斜槓處 core 線沿斜角長成對角遮罩、透出 section 2 星空，stage 6 蓋滿視窗。
    -->
    <HeroForumTransition
      :stage="stage"
      :stage-progress="stageProgress"
      :orange-core-el="orangeCoreEl"
      :done="transitionDone"
    >
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
    </HeroForumTransition>
  </section>
</template>

<style src="./Hero.scss" lang="scss" scoped />
