<script lang="ts" setup>
/**
 * data — 數據中心。
 *
 * 分工：文案在 locales/data.json（區塊用語意 key），版面與間距寫在本頁 template。
 *   ・區塊間距 → Tailwind mt-* / mb-*（4px 級距，mt-6 = 24px）。斷點 sm = 768、lg = 1280。
 *     一律寫成 mt-* mb-* 兩側分開（不用 my-*），相鄰兩塊要各自微調時不必先拆。
 *     注意相鄰區塊的 mb + mt 會 margin collapse，實際間距取兩者較大值而非相加。
 *   ・字級／欄寬 → assets/styles/subpage.scss 的 .sp-* 類。
 *   ・每個內文區塊是「一段 string」，段落之間用 <br/><br/> 斷行、以 v-html 輸出
 *     （文案為本地靜態檔，非使用者輸入）。
 *
 * hero／引言／nav 仍走 Subpage 外殼（四頁一致，含 100vh、進場動畫、疊層約定）。
 */
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import type { AiKeyword } from '~/components/AiSearch.vue';
import raw from '~/locales/data.json';

definePageMeta({ layout: 'subpage' });

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
    <!-- AI搜尋：小標 + 引導句 + 滿版體驗區 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-4">{{ c.aiSearch.title }}</h2>
      <p class="sp-p" v-html="c.aiSearch.lead" />
    </div>
    <div class="sp-full mt-10">
      <AiSearch :cta-url="c.aiSearch.ctaUrl" :keywords="c.aiSearch.keywords" />
    </div>

    <!-- AI推薦：無小標，接在體驗區之下 -->
    <div class="sp-col mt-8 mb-8">
      <p class="sp-p" v-html="c.recommend" />
    </div>

    <!-- 專題作品輪播 -->
    <div class="sp-full mt-8 mb-8">
      <ShowcaseGallery />
    </div>

    <!-- 結語：與 SubpageNav 之間留 mb-16 -->
    <div class="sp-col mt-8 mb-16">
      <p class="sp-p" v-html="c.closing" />
    </div>
  </Subpage>
</template>
