<script lang="ts" setup>
import meta from './locales/meta.json';
import story from './locales/story.json';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import glitch1 from '~/assets/img/glitch-01.jpg';
import glitch2 from '~/assets/img/glitch-02.jpg';
import glitch3 from '~/assets/img/glitch-03.jpg';

const config = useRuntimeConfig();
const APP_MODE = config.public.APP_MODE;
const ASSETS_PATH = config.public.APP_ASSETS_PATH;

// SymbolPortraitScene 狀態：false = 集合（人像）/ true = 分散（漂浮）
// 改這裡決定預設狀態；之後任何地方 symbolDispersed.value = !symbolDispersed.value 即可切換
const symbolDispersed = ref(false);

// 彩蛋句子（row-major 對應宮格）
const symbolPhrases = [
  '逼真 AI 詐騙究竟如何分辨？',
  'AI 算力是否耗盡電力資源？',
  'AI 可以協助翻轉人口老化外流嗎？',
  '無法被 AI 取代的核心能力是什麼？',
  'AI 讓老後生活更便利還是更孤單？',
  '不學 AI 就會被時代淘汰嗎？',
];

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
    <NuxtRouteAnnouncer />
    <!-- <AppHeader /> -->
    <main class="main-content">
      <LoadingHero :duration="3" />
      <OrangeCore>
        <section
          v-for="(section, i) in story.sections"
          :key="i"
          class="story-section"
        >
          <h2 class="story-section__title">
            <template v-if="section.titleHead"
              >{{ section.titleHead
              }}<span class="orange-core-anchor" aria-hidden="true" />{{
                section.titleTail
              }}</template
            >
            <template v-else>{{ section.title }}</template>
          </h2>
          <p class="story-section__body">{{ section.body }}</p>
        </section>
      </OrangeCore>
      <!-- :auto-mouse="true" -->
      <SymbolPortraitScene
        v-model:dispersed="symbolDispersed"
        :phrases="symbolPhrases"
        :hole-radius="25"
        :max-particles="16000"
        :color="['#ffffff', '#d1f4ff', '#77c6e0', '#000000']"
        bg-color="#000"
        :sample-step="4"
        :size-min="16"
        :size-max="20"
        :min-density="0.01"
        :density-gamma="4.2"
        :dark-boost="1.2"
      />
      <MetaballsReveal />
      <section class="glitch-demo">
        <GlitchImage
          class="glitch-demo__item"
          :images="[glitch3, glitch1, glitch2]"
          :duration="1.2"
          :pieces="12"
          bg-color="#ffffff"
          alt="Glitch 收斂進場示意圖"
        />
      </section>
    </main>
    <!-- <AppFooter /> -->
  </div>
</template>

<style scoped>
.story-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 24px;
  text-align: center;
}

.story-section__title {
  margin: 0 0 16px;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
}

/* orange-core step 0 的句中佔位字位（透明，OrangeCore 的核心方塊全程對齊在此） */
.orange-core-anchor {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin: 0 0.12em;
  vertical-align: -0.08em;
}

.story-section__body {
  max-width: 32em;
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 300;
}

.glitch-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30vh;
  padding: 30vh 24px;
}

.glitch-demo__item {
  width: min(100%, 640px);
}
</style>
