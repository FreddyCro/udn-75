<script lang="ts" setup>
// 首頁換頁轉場改用 page-fade（純 opacity、不帶 transform）。
// Hero 有 ScrollTrigger pin 與 position: fixed 疊層，父層若在進場期間帶著 scale，
// fixed 會以該變形層為定位基準而跳位、pin 也會量到縮放後的尺寸。
definePageMeta({
  pageTransition: { name: 'page-fade', mode: 'out-in' },
});
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

    <!-- 互動音效宿主：不輸出 DOM，播放一律透過 useSfx() 的 play()（見 AppSfx.vue） -->
    <AppSfx />

    <!-- 捲動序列除錯 dashboard（?pathdebug 才顯示）。掛在這裡而非各 section 內：
         它顯示的是跨章節的整條序列，跟著某個 section 走就會在別段卸載。 -->
    <DevCoreProgress />
  </div>
</template>

<style scoped></style>
