<script lang="ts" setup>
// data 子頁的完整內容。抽成元件的理由見 NewsArticle.vue 檔頭。
import type { SubpageContent } from '../Subpage.vue';
import type { AiKeyword } from '~/components/AiSearch.vue';
import raw from '~/locales/data.json';

/** data 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface DataContent extends SubpageContent {
  aiSearch: { title: string; lead: string; ctaUrl: string; keywords: AiKeyword[] };
  recommend: string;
  closing: string;
}

// JSON import 會把字面值寬化成 string，須斷言回 DataContent
const c = raw as DataContent;
</script>

<template>
  <Subpage :content="c">
    <!-- AI搜尋 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-1">{{ c.aiSearch.title }}</h2>
      <p class="sp-p" v-html="c.aiSearch.lead" />
    </div>
    <div class="mt-4">
      <AiSearch :cta-url="c.aiSearch.ctaUrl" :keywords="c.aiSearch.keywords" />
    </div>

    <!-- AI推薦：無小標，接在體驗區之下 -->
    <div class="sp-col mt-16">
      <p class="sp-p" v-html="c.recommend" />
    </div>

    <!-- 專題作品輪播 -->
    <div class="sp-full mt-16">
      <ShowcaseGallery />
    </div>

    <!-- 結語：與 SubpageNav 之間留 mb-16 -->
    <div class="sp-col mt-16 mb-16">
      <p class="sp-p" v-html="c.closing" />
    </div>
  </Subpage>
</template>
