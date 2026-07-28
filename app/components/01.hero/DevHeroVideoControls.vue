<script setup lang="ts">
// hero 影片狀態切換列（切 main/loop/outro/gone + SKIP + 影片秒數讀數）。
// dev=false（預設）時完全不渲染；樣式精簡，production 負擔極小。
import { HERO_STATES, type HeroState } from '~/composables/useHeroVideo';
import { HERO_VIDEO_SEGMENTS } from '@/utils/hero-video-config';

defineProps({ dev: { type: Boolean, default: false } });

const { state, setState, skip, currentTime } = useHeroVideo();

const label: Record<HeroState, string> = {
  main: '1.主要內容',
  loop: '2.Loop',
  outro: '3.退場',
  gone: '4.消失',
};

// 按鈕 tooltip 顯示該階段在影片時間軸上的秒數（共用值；pad / mob 若有覆寫見 config）。
// gone 已無影片，不占時間軸。
const range = (s: HeroState) => {
  if (s === 'gone') return '影片已結束（淡出）';
  const seg = HERO_VIDEO_SEGMENTS[s];
  return `${seg.start}s – ${seg.end}s`;
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
      :title="range(s)"
      @click="setState(s)"
    >
      {{ label[s] }}
    </button>
    <button type="button" :disabled="!canSkip" @click="skip()">SKIP</button>
    <!-- 影片目前秒數：對照 / 調整 hero-video-config 的段落秒數用 -->
    <span class="time">{{ currentTime.toFixed(1) }}s</span>
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
.video-ctrl .time {
  padding: 4px 8px;
  border: 1px solid #999;
  background: #fff;
  color: #666;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
