<script lang="ts" setup>
import meta from '~/locales/meta.json';
import { useTracking } from '~/utils/tracking';
import spriteDefs from '~/assets/generated/sprite-defs.svg?raw';

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
    <!-- 五支 sprite 內被 url(#…) 參照到的 def（漸層、clipPath），由 pnpm assets:sprites 產出。
         ⚠️ WebKit 解析外部 <use href="sprite.svg#id"> 內的 url(#…) 時，是拿**引用端文件**查
         id，不是 sprite 那份外部文件；查不到就靜默壞掉（桌機退成黑色、iOS 整塊不繪製）。
         把同 id 的定義擺進頁面本身，WebKit 才找得到；Chromium 仍在外部文件解析，不受影響。
         掛在 app.vue 而非 BlessingPartners：五支 sprite 分佈在首頁與六篇子頁，一處內聯全部覆蓋。
         尺寸寫在 attribute 與 inline style 而非 SCSS：<svg> 的預設替換尺寸是 300×150，
         等 CSS 下載完才收掉會先把版面撐開一次。 -->
    <svg
      class="sprite-defs"
      width="0"
      height="0"
      style="position: absolute"
      aria-hidden="true"
      focusable="false"
      v-html="spriteDefs"
    />
    <!-- 互動音效宿主：不輸出 DOM，播放一律透過 useSfx() 的 play()。
         掛在 app.vue（而非 index.vue）：子頁的作品清單／智慧媒體清單也有互動音效 -->
    <AppSfx />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
