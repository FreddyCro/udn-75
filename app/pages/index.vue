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
    <!-- <Hero /> -->

    <!-- 01a：符號星空 / 人臉序列（黑底，獨立段落；粒子場本體渲染在 Hero 的轉場層 slot 內） -->
    <!-- <SymbolScene /> -->

    <!-- 02 -->
    <!-- <Forum /> -->

    <!-- 03 -->
    <Blessing />

    <!-- 04 -->
    <Media />
  </div>
</template>

<style scoped></style>
