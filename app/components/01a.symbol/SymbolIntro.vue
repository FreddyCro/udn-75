<!--
  符號段的開場三行文案（Figma 智慧論壇05 的「內文」：
  pc 2065:139731 / pad 2065:124199 / mob 2065:120221）。

  ⚠️ 檔案放 01a.symbol/，但**渲染位置在 01.hero/Hero.vue 傳給 <HeroSymbolTransition> 的 slot 內**
     —— 那是 <SymbolFace> 唯一在場的地方（理由見 HeroSymbolTransition.vue 檔頭：轉場的
     「左右展開範圍內已可見粒子」要求粒子場在 hero 還被 pin 住時就滿版在場）。文字要疊在
     粒子場上、與它同生共死，就必須進同一個 slot。
     「目錄歸屬 ≠ 渲染位置」是本段的既定架構，SymbolScene.vue 檔頭有同樣的說明。

  進度來源與 SymbolScene 相同：自己讀 useOrangeCoreProgress 的 symbolProgress，不透過 props 接線。
  opacity 直接寫 el.style（不觸發 Vue re-render），同 HeroSymbolTransition 的 apply()。
  曲線在 symbolIntroOpacity()（~/utils/orange-core-config，有單元測試），本檔只負責寫入。
-->
<script setup lang="ts">
import str from '~/locales/section1.json';

const { symbolProgress } = useOrangeCoreProgress();

const rootRef = ref<HTMLElement | null>(null);
const lines = str.symbol.intro;

const apply = (p: number) => {
  const el = rootRef.value;
  if (!el) return;
  el.style.opacity = String(symbolIntroOpacity(p));
};

// watch 不能用 immediate：setup 階段 rootRef 還是 null，第一次要等 onMounted。
watch(symbolProgress, apply);
onMounted(() => apply(symbolProgress.value));
</script>

<template>
  <div ref="rootRef" class="symbol-intro" aria-hidden="true">
    <p v-for="(line, i) in lines" :key="i" class="symbol-intro__line">
      {{ line }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.symbol-intro {
  position: absolute;
  inset: 0;
  // 與 SymbolFace 的 .egg（彩蛋文字）同層。兩者不同時出現（彩蛋只在 face 拍、
  // 本層只在 disperse 拍），不會互相遮蓋。
  z-index: 2;
  display: grid;
  place-items: center;
  // 預設 align-content: stretch 會把三行攤到滿高；要的是整組置中。
  align-content: center;
  // ⚠️ 必要，不是保險：SymbolFace 的滑鼠斥力監聽掛在 canvas 上，而 HeroSymbolTransition
  //    特意為那顆 canvas 打開了 pointer-events: auto（見該檔 SCSS 末段）。
  //    本層若吃事件，畫面正中央那塊會變成互動死區。
  pointer-events: none;
  opacity: 0; // 由 JS 依 symbolProgress 逐幀寫入
  will-change: opacity;
}

.symbol-intro__line {
  margin: 0;
  color: var(--color-white-light);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-align: center;
  // 對稿：mob 用 mob_論壇文字 22/44；pad 與 pc 共用 pc_論壇文字 24/48（＝ --text-unit），
  // 故只有一個斷點。mob 的 22/44 全庫僅此一處用到，不為它開 token。
  font-size: 22px;
  line-height: 44px;

  @include rwd-min('tablet') {
    font-size: var(--text-unit);
    line-height: var(--text-unit--line-height);
  }
}
</style>
