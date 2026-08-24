<script setup lang="ts">
/**
 * UVid — 響應式影片元件（Responsive Video Component）
 *
 * 依目前裝置解析度（mob / pad / pc）從 src 物件挑對應來源，輸出單一 <video>。
 * 路徑會被 runtimeConfig 的 APP_ASSETS_PATH 前綴（dev/prod 為空字串），
 * 並自動補上副檔名：影片 .mp4、poster .jpg。預設 autoplay + loop，
 * 靜音預設跟隨全站音效開關（見 muted prop）。
 * autoplay 是**反應式**的播放開關，不只是初始屬性（見 autoplay prop）。
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
 * 4. 把播放權交給可見性判斷（進視窗才播、離開就停）：
 *    <UVid :src="{ ... }" :autoplay="isInPlay" preload="metadata" />
 *
 * 命名規則：src 傳「不含副檔名」的路徑，元件會補 .mp4；poster 補 .jpg。
 */
import { onMounted, onUnmounted, ref, watch } from 'vue';
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
  /**
   * 「現在該不該播」的**反應式**開關，不只是初始屬性：切成 false 就暫停、
   * 切回 true 就續播（接在原處，不倒回開頭；要從頭演由呼叫端自己處理）。
   *
   * 用途是把播放權交給呼叫端的可見性判斷 —— 例如 SubpageIntroMedia 用
   * IntersectionObserver ＋ active 兩道閘。原生 autoplay 屬性是一 mount 就播，
   * 瀏覽器雖然對 muted 影片有「看不見就不播」的節流慣例，但那是各家自訂的啟發式、
   * 且全站音效一開（muted 變 false）就不適用 —— 不能當機制依賴。
   */
  autoplay?: boolean;
  loop?: boolean;
  /**
   * 未指定時跟隨全站音效開關（useAppSound）：使用者在 hero 的 start 閘門開啟音效後，
   * 後續所有影片一併不 muted。明確傳入 :muted 的呼叫端優先（例如純裝飾的背景影片）。
   */
  muted?: boolean;
  preload?: string;
  classname?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  loop: true,
  muted: undefined,
  preload: 'auto',
  ariaLabel: 'Udn newmeida center',
});

const { soundOn } = useAppSound();
const isMuted = computed(() => props.muted ?? !soundOn.value);

// 與 UPic 一致：改用 Nuxt runtimeConfig（本專案是 NUXT_PUBLIC_APP_ASSETS_PATH，
// 而非 Vite 的 VITE_ASSETS_PATH）。
const config = useRuntimeConfig();
const ASSETS_PATH = config.public.APP_ASSETS_PATH;

// SSR 安全：伺服器端沒有 window，先以 'pc' 為預設（與初次 client render 一致，
// 避免 hydration mismatch），掛載後再依實際解析度校正並掛上 resize 監聽。
const deviceType = ref<DeviceType>('pc');

const videoRef = ref<HTMLVideoElement | null>(null);

// autoplay 當開關用。flush 'post' 讓 DOM 上的 autoplay 屬性先同步完，再下 play/pause 指令。
watch(
  () => props.autoplay,
  (play) => {
    const el = videoRef.value;
    if (!el) return;
    if (!play) {
      el.pause();
      return;
    }
    // 非 muted 的影片在沒有使用者手勢時會被瀏覽器擋掉 —— 吞掉 rejection，不要噴 console
    void el.play().catch(() => {});
  },
  { flush: 'post' },
);

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
    ref="videoRef"
    class="u-vid"
    :class="classname || ''"
    :src="`${ASSETS_PATH}${src[deviceType]}.mp4`"
    type="video/mp4"
    :poster="poster ? `${ASSETS_PATH}${poster[deviceType]}.jpg` : ''"
    playsinline
    :autoplay="autoplay"
    :loop="loop"
    :muted="isMuted"
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
