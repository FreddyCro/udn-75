<script lang="ts" setup>
/**
 * visual — 視覺設計中心。
 *
 * 分工：文案在 locales/visual.json（區塊用語意 key），版面與間距寫在本頁 template。
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
import type { QuizOption } from '~/components/AiImageQuiz.vue';
import type { SubpageWorkItem } from '~/components/05.subpage/SubpageWorks.vue';
import raw from '~/locales/visual.json';

definePageMeta({ layout: 'subpage' });

/** visual 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface VisualContent extends SubpageContent {
  opening: string;
  quiz: { title: string; options: QuizOption[] };
  aiEra: string;
  creativity: { title: string; body: string };
  experience: { title: string; body: string };
  awards: { title: string; chart: string; chartAlt: string; works: SubpageWorkItem[] };
}

// JSON import 會把字面值（如 isAi: true）寬化，須斷言回 VisualContent
const c = raw as VisualContent;
</script>

<template>
  <Subpage :content="c">
    <!-- 引言之後第一段：無小標，接在引言的 padding-bottom 之下 -->
    <div class="sp-col mt-16 mb-8">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 哪一張是AI生成圖?：小標 + 滿版二選一測驗 -->
    <div class="sp-col mt-8">
      <h2 class="sp-h3">{{ c.quiz.title }}</h2>
    </div>
    <div class="sp-full mt-10">
      <AiImageQuiz :options="c.quiz.options" />
    </div>

    <!-- 資訊超載的時代：無小標，接在測驗之下 -->
    <div class="sp-col mt-8 mb-8">
      <p class="sp-p" v-html="c.aiEra" />
    </div>

    <!-- 創意 因人工智慧飛升 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-4">{{ c.creativity.title }}</h2>
      <p class="sp-p" v-html="c.creativity.body" />
    </div>

    <!-- 體驗 因人味敘事深化 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-4">{{ c.experience.title }}</h2>
      <p class="sp-p" v-html="c.experience.body" />
    </div>

    <!-- 近年得獎獎項：寬欄；小標 mob 靠左、pad 以上置中 -->
    <div class="sp-col sp-col--wide mt-8 mb-16">
      <h2 class="sp-h3 sm:text-center">{{ c.awards.title }}</h2>
      <!-- 桂冠圖表 svg 自帶上下留白 32 → pad 以上貼著小標排即為對稿間距；mob 版 svg 無留白，補 32 -->
      <figure class="mx-auto mt-8 max-w-(--subpage-content-w) sm:mt-0">
        <UPic
          :src="c.awards.chart"
          ext="svg"
          :srcset="['pcpad', 'mob']"
          default="pcpad"
          :use2x="false"
          :webp="false"
          :alt="c.awards.chartAlt"
        />
      </figure>
      <!-- 圖表 → 作品清單：pad 以上須扣掉 svg 自帶的下留白 32 -->
      <div class="mt-16 sm:mt-4 lg:mt-8">
        <SubpageWorks :works="c.awards.works" />
      </div>
    </div>
  </Subpage>
</template>
