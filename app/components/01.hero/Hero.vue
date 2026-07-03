<script setup lang="ts">
// Section 1：hero / intro / date
import str from '@/locales/section1.json';
import { useHeroVideo } from '~/composables/useHeroVideo';

// core path overlay 需要的元素 ref：
//   sec1Ref      — 座標範圍 / ScrollTrigger trigger
//   coreRef      — orange core 元件（曝露 root el 供 GSAP 驅動）
//   dateTitleRef — date 大標（曲線錨定原點）
const sec1Ref = ref<HTMLElement | null>(null);
const coreRef = ref<{ root: HTMLElement | null } | null>(null);
const dateTitleRef = ref<HTMLElement | null>(null);

// Core 元件曝露的 root el，交給 HeroCorePath 以 GSAP 驅動。
const coreEl = computed(() => coreRef.value?.root ?? null);

// core 沿線移動進度衍生的階段：全域共享（HeroCorePath 寫入 progress，此處讀 stage）。
// 門檻與對應視覺見 useCoreProgress / Core.vue。
const { stage: coreStage } = useCoreProgress();

// LoadingHero 蓋在最上層，等 hero 影片可播放後才收尾並淡出移除。
const loaderDone = ref(false);

// 影片是否已可播放，作為 LoadingHero 的收尾條件。
// 目前 hero 影片尚未提供，暫用 CSS 假影片，onMounted 後即視為可播放。
// TODO: 換成真實 <video> 後，移除下方 onMounted 設值，改綁定 <video> 的
//       @canplaythrough="videoReady = true"（並視需要 preload）。
const videoReady = ref(false);

// hero 影片四階段狀態改為全域共享（見 composables/useHeroVideo）：
//   main 主要內容 / loop 循環段 / outro 退場段 / gone 退場消失（白底 + core）
// main / loop 期間鎖住頁面捲動（body overflow hidden）；outro 起解鎖。
// 狀態切換 UI 已抽到 <HeroVideoControls>（dev 用）；此處只讀狀態驅動畫面。
const { state: heroState, isGone, shouldLockScroll } = useHeroVideo();

watch(heroState, applyScrollLock);

onMounted(() => {
  videoReady.value = true;
  // hero 影片體驗一律從頂端開始：停用瀏覽器捲動位置還原，
  // 避免重整後還原到內容區、卻因 main/loop 狀態把 body 鎖死在中途。
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // 捲動鎖由本元件「單一擁有」：載入層一掛上就上鎖（此時為 main），一路持有到
  // outro/gone 才解鎖。LoadingHero 不再自行改 body.overflow —— 否則它卸載時
  // 先解鎖、本元件下一 tick 才重新上鎖，中間會出現「瞬間可捲動」的破口。
  applyScrollLock();
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});

// main / loop 期間鎖住 body 捲動；其餘（outro / gone）解鎖。
function applyScrollLock() {
  if (shouldLockScroll.value) {
    // 上鎖前先回頂端：否則重整後瀏覽器把位置還原到內容區、又處於 main/loop，
    // 會被 overflow:hidden 永久鎖死在中途。
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}
</script>

<template>
  <section ref="sec1Ref" class="sec1">
    <!-- 載入層淡出移除後，再確認一次捲動鎖狀態（多半仍為 main → 維持上鎖；若載入期間
         已被切到 outro/gone，watch 也已處理）。因 LoadingHero 不再碰 body.overflow，無需
         nextTick 等它卸載。 -->
    <Transition name="loader-fade" @after-leave="applyScrollLock">
      <LoadingHero
        v-if="!loaderDone"
        :duration="2"
        :ready="videoReady"
        @done="loaderDone = true"
      />
    </Transition>

    <!-- hero：第一屏影片區塊（已抽為子元件 01.hero/HeroVideo.vue） -->
    <HeroVideo />

    <!--
      orange core：影片結束後於第一屏（影片區塊）正中央淡入 —— 這是 core 的起點。
      位置由 HeroCorePath 以 GSAP 驅動（沿驅動線移動）；此處只保留外觀與淡入。
    -->
    <Core ref="coreRef" :stage="coreStage" :visible="isGone" />

    <!--
      core 移動路徑 overlay（section 級、1:1 px）：可見灰線 + 不可見驅動線。
      需要 .sec1（座標範圍 / trigger）、core（被驅動）、date 大標（錨定原點）三個元素。
    -->
    <HeroCorePath
      :section-el="sec1Ref"
      :core-el="coreEl"
      :anchor-el="dateTitleRef"
    />

    <!-- core 沿線移動進度（fixed 右下角，直接讀 useCoreProgress）。
         <DevOnly>：production build 會整個編譯掉、不進 bundle。 -->
    <DevOnly>
      <CoreProgress />
    </DevOnly>

    <!-- intro → date：orange core 貫穿的內容場景 -->
    <div class="sec1__scene">
      <!-- intro 引言：置中窄欄，往下滑才進入視窗 -->
      <div class="sec1__intro">
        <p class="sec1__intro-body">{{ str.intro.body }}</p>
      </div>

      <!-- date 論壇資訊：整組以絕對定位對齊設計稿 501:21162 相對位置（RWD 之後再處理）。
           core 路徑已抽到 section 級 overlay，尾端仍以此區大標為錨點對齊。 -->
      <div class="sec1__date">
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
  </section>
</template>

<style src="./Hero.scss" lang="scss" scoped />
