<script lang="ts" setup>
import meta from '~/locales/meta.json';

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
    <AppHeader />
    <main class="main-content">
      <!-- 正式開發從這裡開始 -->
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped></style>
