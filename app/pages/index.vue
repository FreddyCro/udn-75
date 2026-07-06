<script lang="ts" setup>
import meta from '~/locales/meta.json';

// hero → section 2 轉場的離場狀態，提升到 page 層由此協調（Hero 寫入、此處/Forum 可覆寫）。
const { transitionDone } = useOrangeCoreProgress();

const config = useRuntimeConfig();
const APP_MODE = config.public.APP_MODE;
const ASSETS_PATH = config.public.APP_ASSETS_PATH;

useSeoMeta({
  title: meta.metaTitle,
  description: meta.metaDesc,
  'og:title': meta.metaTitle,
  'og:description': meta.metaXDesc,
  'og:image': `${ASSETS_PATH}/img/${meta.metaImage}`,
  'twitter:title': meta.metaTitle,
  'twitter:description': meta.metaXDesc,
  twitterCard: 'summary_large_image',
  keywords: meta.metaKeywords,
  robots: APP_MODE === 'production' ? 'index, follow' : 'noindex, nofollow',
});
</script>

<template>
  <div>
    <!-- 01 -->
    <Hero />

    <!-- 02 -->
    <Forum />

    <!-- Yumi  -->
    <!-- 03 -->
    <Blessing />

    <!-- 04 -->
    <Media />
  </div>
</template>

<style scoped></style>
