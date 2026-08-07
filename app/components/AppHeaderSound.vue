<script lang="ts" setup>
/**
 * header 音效開關。與 hero 的 start 閘門共用 useAppSound 的單一狀態。
 */
const { soundOn, toggleSound } = useAppSound();
</script>

<template>
  <button
    class="app-header-sound"
    type="button"
    :aria-label="soundOn ? '關閉音效' : '開啟音效'"
    :aria-pressed="soundOn"
    @click="toggleSound"
  >
    <AppHeaderIcon :name="soundOn ? 'sound-on' : 'sound-off'" />
  </button>
</template>

<style lang="scss" scoped>
.app-header-sound {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: none;
  color: var(--hd-fg);
  cursor: pointer;

  // 外框由 header 給（--hd-icon-h），glyph 佔外框 85%（設計稿 18.7 / 22）
  height: var(--hd-icon-h);

  :deep(.app-header-icon) {
    height: 85%;
  }
}
</style>
