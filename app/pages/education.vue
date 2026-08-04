<script lang="ts" setup>
/**
 * education — 教育事業部（聯合盃二十週年）。
 *
 * 分工：文案在 locales/education.json（區塊用語意 key），版面與間距寫在本頁 template。
 *   ・區塊間距 → Tailwind mt-* / mb-*（4px 級距，mt-6 = 24px）。斷點 sm = 768、lg = 1280。
 *     一律寫成 mt-* mb-* 兩側分開（不用 my-*），相鄰兩塊要各自微調時不必先拆。
 *     注意相鄰區塊的 mb + mt 會 margin collapse，實際間距取兩者較大值而非相加。
 *   ・字級／欄寬 → assets/styles/subpage.scss 的 .sp-* 類。
 *   ・每個內文區塊是「一段 string」，段落之間用 <br/><br/> 斷行、以 v-html 輸出
 *     （文案為本地靜態檔，非使用者輸入）。
 *
 * hero／引言／nav 仍走 Subpage 外殼（六頁一致，含 100vh、進場動畫、疊層約定）。
 */
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import raw from '~/locales/education.json';

definePageMeta({ layout: 'subpage' });

/** education 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface EducationContent extends SubpageContent {
  opening: string;
  figure: { src: string; alt: string; caption: string };
  closing: string;
  cta: { label: string; url: string };
}

// JSON import 會把字面值寬化成 string，須斷言回 EducationContent
const c = raw as EducationContent;
</script>

<template>
  <Subpage :content="c">
    <!-- 引言之後第一段：無小標，接在引言的 padding-bottom 之下 -->
    <div class="sp-col mt-16 mb-8">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 頒獎典禮照片 -->
    <div class="sp-col mt-8 mb-8">
      <figure>
        <UPic :src="c.figure.src" :use-prefix="false" :srcset="['mob']" :alt="c.figure.alt" />
        <figcaption class="sp-caption mt-2">{{ c.figure.caption }}</figcaption>
      </figure>
    </div>

    <!-- 結語 -->
    <div class="sp-col mt-8 mb-8">
      <p class="sp-p" v-html="c.closing" />
    </div>

    <!-- 線上特輯按鈕：與 SubpageNav 之間留 mb-16 -->
    <div class="mt-8 mb-16">
      <SubpageCta :label="c.cta.label" :url="c.cta.url" />
    </div>
  </Subpage>
</template>
