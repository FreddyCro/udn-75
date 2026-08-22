<script lang="ts" setup>
import { killAllScrollTriggers } from '~/utils/scroll-trigger';

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

// 離開首頁時先把整頁的 ScrollTrigger 收乾淨（不 revert）。
//
// 這是防護網，不是主修 —— 主修是各元件的 onBeforeUnmount 改用 killScrollTriggers()。
// 它守的是通則：`out-in` 下 Vue 在 leave 一開始就跑完整棵舊子樹的 beforeUnmount，
// 而舊頁還要在畫面上淡出 220ms；期間只要有任何一個元件的收尾改動了文件高度
// （最典型的是 pin-spacer 被拆），瀏覽器就會 clamp 捲軸，還留在 ScrollTrigger 名冊裡
// 的尺便跟著倒帶、把畫面重畫給使用者看。先把名冊清空，這條路就不存在了。
//
// 掛在 page 層而非各元件：Vue 的 beforeUnmount 是父先子後，這一刀因此落在所有子元件
// 的收尾之前。安全性與「為何取代不了各元件那一半」見 utils/scroll-trigger。
onBeforeUnmount(killAllScrollTriggers);
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
