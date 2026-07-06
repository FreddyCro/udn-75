<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { getDeviceTypeByResolution } from '@/utils/get-device';

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

const deviceType = ref(getDeviceTypeByResolution());
const { VITE_ASSETS_PATH } = import.meta.env as any;

window.addEventListener('resize', onResize);

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});

function onResize() {
  deviceType.value = getDeviceTypeByResolution();
}
</script>

<template>
  <video
    class="u-vid"
    :class="classname || ''"
    :src="`${VITE_ASSETS_PATH}${src[deviceType]}.mp4`"
    type="video/mp4"
    :poster="poster ? `${VITE_ASSETS_PATH}${poster[deviceType]}.jpg` : ''"
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
