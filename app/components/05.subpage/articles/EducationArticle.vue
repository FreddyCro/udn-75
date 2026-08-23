<script lang="ts" setup>
// education 子頁的完整內容。抽成元件的理由見 NewsArticle.vue 檔頭。
import type { SubpageContent } from '../Subpage.vue';
import raw from '~/locales/education.json';

/** education 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface EducationContent extends SubpageContent {
  opening: string;
  cta: { label: string; url: string };
}

// JSON import 會把字面值寬化成 string，須斷言回 EducationContent
const c = raw as EducationContent;
</script>

<template>
  <Subpage :content="c">
    <!-- 引言之後第一段：無小標，接在引言的 padding-bottom 之下 -->
    <div class="sp-col mt-16">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 線上特輯按鈕 -->
    <div v-ga-view="'education_competition20'" class="mt-8 lg:mt-16 mb-16 md:mb-8">
      <SubpageCta :label="c.cta.label" :url="c.cta.url" ga-term="competition20" />
    </div>
  </Subpage>
</template>
