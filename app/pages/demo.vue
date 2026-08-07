<script lang="ts" setup>
import story from '~/locales/story.json';
import section1 from '~/locales/section1.json';

const config = useRuntimeConfig();

// SymbolFace 狀態：'face' = 集合（人像）/ 'disperse' = 分散（漂浮）/ 'converge' = 匯聚成點
// 改這裡決定預設狀態；之後任何地方指派 symbolMode.value = 'disperse' | 'converge' | 'face' 即可切換
const symbolMode = ref<'face' | 'disperse' | 'converge'>('face');

// SymbolFace 版本對照：'matrix' = 新版網格矩陣 / 'scatter' = 改寫前的機率散點版
// 用 v-if 一次只掛一個：兩者都是 100vh 滿版 WebGL，同時掛載會有兩個 three.js
// 場景與兩組 RAF（約 30k 粒子），低階機會掉幀。切換時舊元件的 onBeforeUnmount
// 會 dispose 場景，資源乾淨釋放。
const symbolVersion = ref<'matrix' | 'scatter'>('matrix');

// GlitchImage 觸發 API（暫用右下角按鈕；之後改由列表 hover/scroll 呼叫 start()）
const glitchRef = ref<{ start: () => void; reset: () => void } | null>(null);
const startGlitch = () => glitchRef.value?.start();

// 彩蛋句子（row-major 對應宮格）：與正式站共用同一份文案，見 locales/section1.json
const symbolPhrases = section1.symbol.phrases;
</script>

<template>
  <div>
    <!-- <AppHeader /> -->
    <main class="main-content">
      <div class="symbol-switch">
        <button
          type="button"
          :class="{ 'symbol-switch__btn--active': symbolVersion === 'matrix' }"
          class="symbol-switch__btn"
          @click="symbolVersion = 'matrix'"
        >
          新版 矩陣
        </button>
        <button
          type="button"
          :class="{ 'symbol-switch__btn--active': symbolVersion === 'scatter' }"
          class="symbol-switch__btn"
          @click="symbolVersion = 'scatter'"
        >
          舊版 散點
        </button>
      </div>

      <!-- :auto-mouse="true" -->
      <!-- 新版：網格矩陣（gemini-code 質感移植）。字元依墨水量對應亮度、逐格字重、
           四色標可調位置的漸層、glitch 跳色；字級是 world 單位，縮放視窗比例不變。 -->
      <SymbolFace
        v-if="symbolVersion === 'matrix'"
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
        :max-particles="24000"
        bg-color="#000"
        :float-amp="18"
        :float-micro="0.5"
        :chars="[
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
          'A', 'B', 'C', 'D', 'E', 'F',
        ]"
        :color="['#000000', '#77c6e0', '#d1f4ff', '#ffffff']"
        :color-stops="[0, 0.4, 0.75, 1]"
        :cols="85"
        :char-aspect="0.65"
        :contrast="1.2"
        :invert="false"
        :size-min="0.43"
        :size-max="1.0"
        :weight-steps="5"
        :weight-min="100"
        :weight-max="900"
        :glitch-items="[
          { color: '#ff0055', density: 3, fps: 12 },
          { color: '#00ffcc', density: 2, fps: 8 },
        ]"
      />
      <!-- 改寫前的快照，props 沿用舊介面、與新版互不牽動（見 legacy/SymbolFaceScatter.vue） -->
      <LegacySymbolFaceScatter
        v-else
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
      <!-- 前一版底紋（已退役、搬到 legacy/，僅此處對照）：中心/外圍兩區 + variant 換抽 -->
      <LegacyHeartMetaballBlock
        :idleBlobMin="0.1"
        :idleBlobMax="0.2"
        :idleRoamSpeed="3"
        :life="3"
      />
      <!-- 現役底紋（Section 4 使用）：三塊紋理 patch 漂移重疊（1格棋盤×1、2格棋盤×1、線段紋×1） -->
      <HeartMetaball :idleRoamSpeed="2" />
      <!-- <section class="glitch-demo">
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
      <ShowcaseGallery /> -->
    </main>
    <!-- 暫用：手動觸發 GlitchImage（之後改由列表 hover/scroll 觸發 start()） -->
    <!-- <AppFooter /> -->
  </div>
</template>

<style scoped>
/* 新舊版 SymbolFace 對照切換：z-index 需高於 SymbolFace dev 面板（5）
   與 layout 的 AppHeader（1000）—— 後者是 fixed 滿版頂條，會蓋住左上角。 */
.symbol-switch {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1001;
  display: flex;
  gap: 6px;
}

.symbol-switch__btn {
  padding: 8px 14px;
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(20, 22, 28, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  cursor: pointer;
}

.symbol-switch__btn--active {
  color: #10141b;
  background: #ffb060;
  border-color: #ffb060;
}

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
