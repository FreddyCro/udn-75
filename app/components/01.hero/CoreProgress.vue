<!--
  core 沿線移動進度的除錯顯示（fixed 右下角，僅 dev 環境）。
  直接讀取全域共享的 useOrangeCoreProgress（單一來源），顯示百分比與當前 stage；
  正式環境整個元件不 render，故不需外部傳 prop、也不涉入任何行為驅動。
-->
<script setup lang="ts">
const { stage, stageProgress, pathProgress, pinProgress } =
  useOrangeCoreProgress();

const pct = (v: number) => Math.round(v * 100);
</script>

<template>
  <div
    class="core-progress fixed z-1000 right-4 bottom-1/2 px-2 py-1 rounded-xl text-white"
    aria-hidden="true"
  >
    stage {{ stage }} · {{ pct(stageProgress) }}%
    <span class="core-progress__raw">
      (path {{ pct(pathProgress) }} / pin {{ pct(pinProgress) }})
    </span>
  </div>
</template>

<style lang="scss" scoped>
.core-progress {
  background: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  line-height: 1.4;
}

.core-progress__raw {
  opacity: 0.6;
}
</style>
