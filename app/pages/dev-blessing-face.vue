<script setup lang="ts">
// 臨時對照頁：把 17 格並排，用來跟 Figma 2065:131760 逐格比對。實作完成後刪除。
import { FACE_FRAME_COUNT } from '~/utils/blessing-face-frames';
</script>

<template>
  <div class="dev-strip">
    <div v-for="n in FACE_FRAME_COUNT" :key="n" class="dev-strip__cell">
      <BlessingFace :frame="n - 1" />
      <span class="dev-strip__label">{{ String(n).padStart(2, '0') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dev-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 40px;
  background: var(--color-orange);
}

.dev-strip__cell {
  width: 144px;
  color: #fff;
}

.dev-strip__label {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
}
</style>
