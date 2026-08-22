<script lang="ts" setup>
/**
 * header 音效開關。與 hero 的 start 閘門共用 useAppSound 的單一狀態。
 */
const { soundOn, toggleSound } = useAppSound();
const { play } = useSfx();

// 本顆刻意**不對稱**：開 → 響一聲當確認音；關 → 不響。
// play() 讀的是 soundOn，故「關」那一下本來就會被自己擋掉 —— 這裡順著它，
// 不特別繞過。理由：使用者剛要求安靜，再回他一聲是反效果。
const onToggle = () => {
  toggleSound();
  play('sfx01');
};
</script>

<template>
  <button
    class="app-header-sound"
    type="button"
    :aria-label="soundOn ? '關閉音效' : '開啟音效'"
    :aria-pressed="soundOn"
    @mouseenter="play('sfx01')"
    @click="onToggle"
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

  // 外框由 header 給（--hd-icon-w / --hd-icon-h），glyph 佔外框高 85%（設計稿 18.7 / 22）
  width: var(--hd-icon-w);
  height: var(--hd-icon-h);

  :deep(.app-header-icon) {
    height: 85%;
  }
}
</style>
