<script lang="ts" setup>
import meta from '~/locales/meta.json';
import { useTracking } from '~/utils/tracking';

const config = useRuntimeConfig();
const APP_MODE = config.public.APP_MODE;
const ASSETS_PATH = config.public.APP_ASSETS_PATH;

useSeoMeta({
  title: meta.metaTitle,
  description: meta.metaDesc,
  'og:title': meta.metaTitle,
  'og:description': meta.metaXDesc,
  'og:image': `${ASSETS_PATH}/${meta.metaImage}`,
  'twitter:title': meta.metaTitle,
  'twitter:description': meta.metaXDesc,
  twitterCard: 'summary_large_image',
  keywords: meta.metaKeywords,
  robots: APP_MODE === 'production' ? 'index, follow' : 'noindex, nofollow',
});

// favicon（UDN）
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: 'https://vip.udn.com/static/img/favicon.ico',
    },
  ],
});

// UDN 追蹤碼（GTM / comScore / Alexa / etu…），集中於 utils/tracking.ts
useHead(useTracking());
</script>

<template>
  <div>
    <!-- 互動音效宿主：不輸出 DOM，播放一律透過 useSfx() 的 play()。
         掛在 app.vue（而非 index.vue）：子頁的作品清單／智慧媒體清單也有互動音效 -->
    <AppSfx />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
