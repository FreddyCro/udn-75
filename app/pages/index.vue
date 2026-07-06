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
    <!-- forum SymbolFace 序列進度（僅 dev）；放 page 層避免受 forum pin 的 containing block 影響。 -->
    <DevOnly>
      <FaceProgress />
    </DevOnly>

    <!-- 03 -->
    <Blessing />

    <!-- Yumi  -->
    <!-- 04 -->
    <Media />
  </div>
</template>

<style scoped>
/* dev 按鈕：固定左下角，浮在最上層 */
.dev-transition-reset {
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 2000;
  padding: 8px 12px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  cursor: pointer;
}
</style>
