<script lang="ts" setup>
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import raw from '~/locales/education.json';

definePageMeta({ layout: 'subpage' });

/** education 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface EducationContent extends SubpageContent {
  opening: string;
  closing: string;
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

    <!-- 結語 -->
    <div class="sp-col mt-16">
      <p class="sp-p" v-html="c.closing" />
    </div>

    <!-- 線上特輯按鈕 -->
    <div class="mt-8 mb-16 md:mb-8">
      <SubpageCta :label="c.cta.label" :url="c.cta.url" />
    </div>
  </Subpage>
</template>
