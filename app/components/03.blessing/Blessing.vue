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
const { blessingFrame, setBlessingProgress } = useOrangeCoreProgress();

// 捲動尺高度。尺內的 sticky 畫面自己佔掉 100vh，sticky 只黏住「尺高 − 100vh」，
// 所以要 +1，實際動畫距離才等於 BLESSING_VH × 100vh（見 ~/utils/orange-core-config）。
// 寫成 BLESSING_VH × 100vh 是錯的 —— 動畫只會剩 (BLESSING_VH − 1) 個視窗高可跑。
const faceTrackHeight = `${(1 + BLESSING_VH) * 100}vh`;

const trackRef = ref<HTMLElement | null>(null);
let faceST: ScrollTrigger | null = null;

onMounted(() => {
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
  faceST?.kill();
  faceST = null;
});
</script>

<template>
  <section id="blessing" class="section3">
    <!-- ① 逐格臉屏 -->
    <div
      ref="trackRef"
      class="section3__face-track"
      :style="{ height: faceTrackHeight }"
    >
      <div class="section3__face-screen">
        <div class="section3__face-inner">
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

    <!-- ② 夥伴清單：階梯線 ＋ 面板 -->
    <div class="section3__partners">
      <BlessingStairs />
      <BlessingPartners />
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

.section3__partners {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px 108px 60px;

  @include rwd-max('pc') {
    gap: 32px;
    padding: 32px 57.875px 60px;
  }

  @include rwd-max('tablet') {
    gap: 24px;
    padding: 32px 48px 60px;
  }
}

.section3__face-screen {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}

// pc：臉在左、文字在右；pad / mob：文字在上、臉在下
.section3__face-inner {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 180px;
  width: 100%;
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

.section3__title {
  margin: 0;
  font-size: 72px;
  font-weight: 300;
  line-height: 104px;

  @include rwd-max('pc') {
    font-size: 52px;
    line-height: 70px;
  }

  @include rwd-max('tablet') {
    font-size: 56px;
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
