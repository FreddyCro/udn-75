<!--
  core 沿線移動進度的除錯顯示（fixed 右下角，僅 dev 環境）。
  直接讀取全域共享的 useCoreProgress（單一來源），顯示百分比與當前 stage；
  正式環境整個元件不 render，故不需外部傳 prop、也不涉入任何行為驅動。
-->
<script setup lang="ts">
const { progress, stage } = useCoreProgress();

const percent = computed(() => Math.round(progress.value * 100));
</script>

<template>
  <div
    class="core-progress fixed right-4 bottom-1/2 px-2 py-1 rounded-xl text-white"
    aria-hidden="true"
  >
    {{ percent }}% · {{ stage }}
  </div>
</template>

<style lang="scss" scoped>
.core-progress {
  background: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  line-height: 1;
}
</style>
