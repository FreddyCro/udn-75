<!--
  SymbolFace 序列進度的除錯顯示（fixed 右側，僅 dev 環境）。對應 hero 的 DevOrangeCoreProgress。
  讀取全域共享的 useOrangeCoreProgress：symbolProgress（由 SymbolScene 的捲動尺寫入）
  與解出的目標 mode / enter。
-->
<script setup lang="ts">
const { symbolProgress, symbolTarget } = useOrangeCoreProgress();

const pct = (v: number) => Math.round(v * 100);
// 目前狀態：越過 enter 門檻顯示 enter（已揭開議程），否則顯示目標 mode。
const label = computed(() =>
  symbolTarget.value.enter ? 'enter' : symbolTarget.value.mode,
);
</script>

<template>
  <div
    class="face-progress fixed z-1000 right-4 top-1/2 mt-1 px-2 py-1 rounded-xl text-white"
    aria-hidden="true"
  >
    face · {{ label }}
    <span class="face-progress__raw">· {{ pct(symbolProgress) }}%</span>
  </div>
</template>

<style lang="scss" scoped>
.face-progress {
  background: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  line-height: 1.4;
}

.face-progress__raw {
  opacity: 0.6;
}
</style>
