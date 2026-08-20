<script lang="ts" setup>
// 首頁換頁轉場改用 page-fade（純 opacity、不帶 transform）。
// Hero 有 ScrollTrigger pin 與 position: fixed 疊層，父層若在進場期間帶著 scale，
// fixed 會以該變形層為定位基準而跳位、pin 也會量到縮放後的尺寸。
definePageMeta({
  pageTransition: { name: 'page-fade', mode: 'out-in' },
});

// 除錯 dashboard 的開關拉到這一層，讓它連「載入」都是條件性的。
// 元件內部原本也有一份同樣的 `visible` computed，但那只擋渲染 —— 它的 onMounted
// 仍會無條件掛上 scroll listener，而且整個元件（含 forum-path-events /
// forum-path-turns / useCoreSequence 這些 import）都躺在 production 的主 chunk 裡。
// 配 Lazy 前綴＝dynamic import，`?pathdebug` 在 production preview 照樣能開
// （這是它刻意不包 <DevOnly> 的原因，見該檔開頭），但沒開的人不必付這筆帳。
const route = useRoute();
const pathDebug = computed(() => route.query.pathdebug !== undefined);
</script>

<template>
  <div>
    <!-- 01 -->
    <Hero />

    <!-- 01a：符號星空 / 人臉序列（黑底，獨立段落；粒子場本體渲染在 Hero 的轉場層 slot 內） -->
    <SymbolScene />

    <!-- 02 -->
    <Forum />

    <!-- 03 -->
    <Blessing />

    <!-- 04 -->
    <Media />

    <!-- 捲動序列除錯 dashboard（?pathdebug 才顯示）。掛在這裡而非各 section 內：
         它顯示的是跨章節的整條序列，跟著某個 section 走就會在別段卸載。
         Lazy + v-if：沒開 debug 的人不載入這支元件（見 script 的說明）。 -->
    <LazyDevCoreProgress v-if="pathDebug" />
  </div>
</template>

<style scoped></style>
