<script setup lang="ts">
// hero 影片狀態切換列（切 main/loop/outro/gone + SKIP）。
// dev=false（預設）時完全不渲染；樣式精簡，production 負擔極小。
import { useHeroVideo, HERO_STATES, type HeroState } from '~/composables/useHeroVideo';

defineProps({ dev: { type: Boolean, default: false } });

const { state, setState, skip } = useHeroVideo();

const label: Record<HeroState, string> = {
  main: '主要內容',
  loop: 'Loop',
  outro: '退場',
  gone: '消失',
};
const canSkip = computed(() => state.value === 'main' || state.value === 'loop');
</script>

<template>
  <div v-if="dev" class="video-ctrl">
    <button
      v-for="s in HERO_STATES"
      :key="s"
      type="button"
      :class="{ on: state === s }"
      @click="setState(s)"
    >
      {{ label[s] }}
    </button>
    <button type="button" :disabled="!canSkip" @click="skip()">SKIP</button>
  </div>
</template>

<style scoped>
/* 水平置中、貼在 video（hero）區塊底部；樣式刻意精簡 */
.video-ctrl {
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 10;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.video-ctrl button {
  padding: 4px 10px;
  border: 1px solid #999;
  background: #fff;
  color: #333;
  font-size: 13px;
  cursor: pointer;
}
.video-ctrl button.on {
  border-color: #ff7f00;
  background: #ff7f00;
  color: #fff;
}
.video-ctrl button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
