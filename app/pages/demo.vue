<script lang="ts" setup>
import story from '~/locales/story.json';
import glitch1 from '~/assets/img/glitch-01.jpg';
import glitch2 from '~/assets/img/glitch-02.jpg';
import glitch3 from '~/assets/img/glitch-03.jpg';

const config = useRuntimeConfig();

// SymbolFace 狀態：'face' = 集合（人像）/ 'disperse' = 分散（漂浮）/ 'converge' = 匯聚成點
// 改這裡決定預設狀態；之後任何地方指派 symbolMode.value = 'disperse' | 'converge' | 'face' 即可切換
const symbolMode = ref<'face' | 'disperse' | 'converge'>('face');

// GlitchImage 觸發 API（暫用右下角按鈕；之後改由列表 hover/scroll 呼叫 start()）
const glitchRef = ref<{ start: () => void; reset: () => void } | null>(null);
const startGlitch = () => glitchRef.value?.start();

// 彩蛋句子（row-major 對應宮格）
const symbolPhrases = [
  '逼真 AI 詐騙究竟如何分辨？',
  'AI 算力是否耗盡電力資源？',
  'AI 可以協助翻轉人口老化外流嗎？',
  '無法被 AI 取代的核心能力是什麼？',
  'AI 讓老後生活更便利還是更孤單？',
  '不學 AI 就會被時代淘汰嗎？',
];
</script>

<template>
  <div>
    <!-- <AppHeader /> -->
    <main class="main-content">
      <!-- :auto-mouse="true" -->
      <SymbolFace
        v-model:mode="symbolMode"
        :dev="true"
        :phrases="symbolPhrases"
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
      <!-- 前一版底紋（已退出 Section 4，僅此處對照）：中心/外圍兩區 + variant 換抽 -->
      <HeartMetaball
        :idleBlobMin="0.1"
        :idleBlobMax="0.2"
        :idleRoamSpeed="3"
        :life="3"
      />
      <!-- 現役底紋（Section 4 使用）：4 patch 漂移重疊（線段紋×2、1格棋盤×1、2格棋盤×1） -->
      <HeartMetaballPatch :idleRoamSpeed="2" />
      <section class="glitch-demo">
        <GlitchImage
          ref="glitchRef"
          class="glitch-demo__item"
          :images="[glitch3, glitch1, glitch2]"
          :duration="1.2"
          :pieces="12"
          bg-color="#ffffff"
          caption="6 位中途少年的自白，訴說著觸法行為背後的困境與茫然。"
        />
        <button class="glitch-start-btn" type="button" @click="startGlitch">
          start
        </button>
      </section>
      <ShowcaseGallery />
    </main>
    <!-- 暫用：手動觸發 GlitchImage（之後改由列表 hover/scroll 觸發 start()） -->
    <!-- <AppFooter /> -->
  </div>
</template>

<style scoped>
.story-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 24px;
  text-align: center;
}

.story-section__title {
  margin: 0 0 16px;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
}

/* orange-core step 0 的句中佔位字位（透明，OrangeCore 的核心方塊全程對齊在此） */
.orange-core-anchor {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin: 0 0.12em;
  vertical-align: -0.08em;
}

.story-section__body {
  max-width: 32em;
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 300;
}

.glitch-demo {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30vh;
  padding: 30vh 24px;
}

.glitch-demo__item {
  width: min(100%, 640px);
}

/* 暫用：手動觸發 GlitchImage 的按鈕（之後移除，改由列表觸發） */
.glitch-start-btn {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  padding: 10px 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #fff;
  background: #ff7f00;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}
</style>
