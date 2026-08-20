<script lang="ts" setup>
// SymbolFace 調參頁：左邊是滿高的粒子場，右邊是 <SymbolFaceDevPanel> 側欄。
// 側欄收合時 canvas 回到滿版 ＝ 正式站（Hero 轉場層內）的真實比例，要比對構圖時按一下。
import section1 from '~/locales/section1.json';
import type { SymbolMode } from '~/composables/useOrangeCoreProgress';

// 不套 layout：AppHeader 是 fixed 滿版頂條（z-index 1000），會壓在側欄標題與
// canvas 上緣；而且這頁要的是「與正式站同比例的乾淨預覽」，header / footer 都是雜訊。
definePageMeta({ layout: false });

// 'face' = 集合（人像）/ 'disperse' = 分散（漂浮）/ 'converge' = 匯聚成點。
// 正式站由 SymbolScene 依捲動指派，這裡由側欄底部的三顆按鈕切換。
const symbolMode = ref<SymbolMode>('face');

// 面板 ↔ SymbolFace 的接線：面板只吐設定，套用一律由這裡轉呼叫元件方法。
//   ・live  → applyColors()：只換 ramp texture 與 uniform，拖色票即時看到結果
//   ・apply → applyConfig()：整組重建（按 ↻ Refresh 才會走到）
const faceRef = ref<{
  config: Record<string, any>;
  gridStats: { cols: number; rows: number; count: number };
  applyConfig: (c: Record<string, any>) => void;
  applyColors: (c: Record<string, any>) => void;
} | null>(null);

// 面板的 draft 初值 ＝ SymbolFace 併入 default 後的實際設定。
// 不能直接把下面那串 props 給它 —— 那串只寫了要覆寫的項目，src / fitWidth / 漂浮速度…
// 這些吃 default 的欄位會變成 undefined。子元件的 onMounted 早於父層，故這裡拿得到。
const faceConfig = ref<Record<string, any> | null>(null);
onMounted(() => {
  faceConfig.value = faceRef.value?.config ?? null;
});

const panelOpen = ref(true);

// 字元集提到這裡而不是寫在模板的 :chars="[...]" 裡：集合內含 `"`，而屬性值本身是用雙引號
// 界定的 —— 寫成 '"' 會提前把屬性關掉（要留在模板就得寫成 &quot; 靠 HTML 實體解碼，太脆）。
// 值與 Hero.vue 的 SYMBOL_CHARS 相同，來源見 SymbolFace 的 chars 註解。
const SYMBOL_CHARS = [
  'U', 'D', 'N', '7', '5',
  'A', 'I', 'V', 'E', 'R', 'S', 'Y',
  '/', ':', '_', '+', '.', '=', ')', '(', '#', '"', '>', '<',
];

// 彩蛋句與互動提示：與正式站共用同一份文案（見 locales/section1.json）
const symbolPhrases = section1.symbol.phrases;
const symbolHint = section1.symbol.hint;
const symbolHintMob = section1.symbol.hintMob;
</script>

<template>
  <div class="lab" :class="{ 'lab--closed': !panelOpen }">
    <div class="lab__canvas">
      <!-- 參數與 Hero.vue 那顆正式站的 <SymbolFace> 對齊；差異只在這裡可以即時調 -->
      <SymbolFace
        ref="faceRef"
        v-model:mode="symbolMode"
        :phrases="symbolPhrases"
        :hint="symbolHint"
        :hint-mob="symbolHintMob"
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
        :world-scale="0.7"
        :float-amp="18"
        :float-micro="0.5"
        :chars="SYMBOL_CHARS"
        :color="['#000000', '#77c6e0', '#d1f4ff', '#ffffff']"
        :color-stops="[0, 0.55, 0.81, 1]"
        :cols="89"
        :char-aspect="0.65"
        :contrast="1.4"
        :invert="false"
        :size-min="0.4"
        :size-max="0.8"
        :weight-steps="5"
        :weight-min="100"
        :weight-max="500"
        :glitch-items="[
          { color: '#ffe357', density: 2, fps: 2 },
          { color: '#33ffd6', density: 3, fps: 5 },
          { color: '#ff8800', density: 4, fps: 2 },
          { color: '#54dd22', density: 2, fps: 4 },
          { color: '#ffa3d9', density: 3, fps: 2 },
          { color: '#57beff', density: 8, fps: 4 },
        ]"
      />
    </div>

    <div class="lab__panel">
      <SymbolFaceDevPanel
        v-model:mode="symbolMode"
        :initial="faceConfig"
        :stats="faceRef?.gridStats ?? { cols: 0, rows: 0, count: 0 }"
        @apply="faceRef?.applyConfig($event)"
        @live="faceRef?.applyColors($event)"
      />
    </div>

    <button class="lab__toggle" type="button" @click="panelOpen = !panelOpen">
      {{ panelOpen ? '✕' : '⚙' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.lab {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #080808;
}

// canvas 區塊：側欄開合時寬度跟著變，SymbolFace 內部靠 ResizeObserver 自己重算，
// 不必額外通知。min-width: 0 是必要的 —— flex item 預設 min-width: auto，
// 子層那顆 canvas 會把它撐開、把側欄擠出畫面。
.lab__canvas {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
}

// 收合走 flex-basis → 0 而不是 v-if：面板 unmount 會連 draft 一起丟掉，
// 展開後所有調到一半的值都會退回初值。
.lab__panel {
  flex: 0 0 380px;
  height: 100%;
  overflow: hidden;
  transition: flex-basis 0.25s ease;

  .lab--closed & {
    flex-basis: 0;
  }
}

// 固定在視窗右上角：側欄開著時浮在它的標題列旁（.panel__title 已留出右側空間），
// 收起後是唯一叫得回面板的入口。
.lab__toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 32px;
  height: 32px;
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  color: #77c6e0;
  background: #2b2b2b;
  border: 1px solid #77c6e0;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: #000;
    background: #77c6e0;
  }
}
</style>
