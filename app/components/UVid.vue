<script setup lang="ts">
/**
 * UVid — 響應式影片元件（Responsive Video Component）
 *
 * 依目前裝置解析度（mob / pad / pc）從 src 物件挑對應來源，輸出單一 <video>。
 * 路徑會被 runtimeConfig 的 APP_ASSETS_PATH 前綴（dev/prod 為空字串），
 * 並自動補上副檔名：影片 .mp4、poster .jpg。預設 autoplay + loop + muted。
 *
 * 使用範例（對應本專案 public/img，完整清單見 pages/resources.vue）：
 *
 * 1. 有裝置變體（三個尺寸各一支）：
 *    <UVid :src="{ mob: '/img/hero_mob', pad: '/img/hero_pad', pc: '/img/hero_pc' }" />
 *
 * 2. 單一檔案、無裝置變體（三個 key 指向同一支）：
 *    <UVid :src="{
 *      mob: '/img/visual/udn75_video07_01',
 *      pad: '/img/visual/udn75_video07_01',
 *      pc:  '/img/visual/udn75_video07_01',
 *    }" preload="metadata" />
 *
 * 3. 搭配 poster 首幀、關閉自動播放：
 *    <UVid :src="{ ... }" :poster="{ mob: '...', pad: '...', pc: '...' }" :autoplay="false" />
 *
 * 命名規則：src 傳「不含副檔名」的路徑，元件會補 .mp4；poster 補 .jpg。
 */
import { onMounted, onUnmounted, ref } from 'vue';
import { getDeviceTypeByResolution } from '@/utils/get-device';

type DeviceType = 'mob' | 'pad' | 'pc';

interface Props {
  src: {
    mob: string;
    pad: string;
    pc: string;
  };
  poster?: {
    mob: string;
    pad: string;
    pc: string;
  };
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: string;
  classname?: string;
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  autoplay: true,
  loop: true,
  muted: true,
  preload: 'auto',
  ariaLabel: 'Udn newmeida center',
});

// 與 UPic 一致：改用 Nuxt runtimeConfig（本專案是 NUXT_PUBLIC_APP_ASSETS_PATH，
// 而非 Vite 的 VITE_ASSETS_PATH）。
const config = useRuntimeConfig();
const ASSETS_PATH = config.public.APP_ASSETS_PATH;

// SSR 安全：伺服器端沒有 window，先以 'pc' 為預設（與初次 client render 一致，
// 避免 hydration mismatch），掛載後再依實際解析度校正並掛上 resize 監聽。
const deviceType = ref<DeviceType>('pc');

function onResize() {
  deviceType.value = getDeviceTypeByResolution();
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <video
    class="u-vid"
    :class="classname || ''"
    :src="`${ASSETS_PATH}${src[deviceType]}.mp4`"
    type="video/mp4"
    :poster="poster ? `${ASSETS_PATH}${poster[deviceType]}.jpg` : ''"
    playsinline
    :autoplay="autoplay"
    :loop="loop"
    :muted="muted"
    :preload="preload"
    :aria-label="ariaLabel"
  />
</template>

<style lang="scss">
.u-vid {
  width: 100%;
  max-width: 100%;
  pointer-events: none;
}
</style>
