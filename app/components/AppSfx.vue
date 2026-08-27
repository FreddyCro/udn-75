<script lang="ts" setup>
/**
 * 互動音效的宿主元件 —— 不輸出任何 DOM，只持有 audio pool 的生命週期。
 *
 * 播放請用 useSfx()（見 composables/useSfx.ts），不要透過這個元件的 ref：
 *
 *   const { play } = useSfx();
 *   play('sfx01Short');
 *
 * 為什麼要有這一層、而不是讓 useSfx() 自己 lazy 建 Audio：
 *   ・預載時機 —— 掛載時就把音效抓下來，第一次 play() 不必等下載。
 *   ・解鎖時機 —— iOS 需要借使用者手勢啟動音訊（見 useSfx 的 unlock）。
 *   ・卸載時機 —— 換頁時要停掉並釋放，否則音效會跟著殘留。
 * 這三件事都需要一個明確的「這頁有音效」掛載點，composable 自己沒有。
 *
 * 掛載點在 app.vue（全站唯一一份）：首頁與子頁（作品清單／智慧媒體清單）都有
 * 互動音效，預載由全站扛。
 */
const { prime, unlock, stopAll, release } = useSfx();
const { soundOn } = useAppSound();

onMounted(() => {
  prime();
  // 已經是開的（例如從子頁切回來）就直接解鎖，不必等下一次切換。
  if (soundOn.value) unlock();
});

watch(soundOn, (on) => (on ? unlock() : stopAll()));

onBeforeUnmount(release);
</script>

<template>
  <!-- 無 DOM 輸出：音效由 Audio 物件在 JS 端播放 -->
</template>
