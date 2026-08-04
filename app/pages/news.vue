<script lang="ts" setup>
/**
 * news — 新聞部×數據發展部。
 *
 * 分工：文案在 locales/news.json（區塊用語意 key，不是 sections 陣列），
 *       版面與間距寫在本頁 template。
 *   ・區塊間距 → Tailwind mt-* / mb-*（4px 級距，mt-6 = 24px）。斷點 sm = 768、lg = 1280。
 *     對稿各區塊間距沒有通則（同樣是小標，上方是內文或滿版元件，間距就不同），
 *     所以不抽共用 token，逐塊標在 class 上、一眼看得到、改一塊不動別塊。
 *     一律寫成 mt-* mb-* 兩側分開（不用 my-*），相鄰兩塊要各自微調時不必先拆。
 *     注意相鄰區塊的 mb + mt 會 margin collapse，實際間距取兩者較大值而非相加。
 *   ・字級／欄寬 → assets/styles/subpage.scss 的 .sp-* 類。
 *   ・每個內文區塊是「一段 string」，段落之間用 <br/> 斷行、以 v-html 輸出
 *     （文案為本地靜態檔，非使用者輸入）。
 *
 * hero／引言／nav 仍走 Subpage 外殼（四頁一致，含 100vh、進場動畫、疊層約定）。
 */
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import type { FormulaItem } from '~/components/FormulaBlocks.vue';
import type { PanelPhoto } from '~/components/PhotoPanels.vue';
import type { TimelineItem } from '~/components/AwardTimeline.vue';
import raw from '~/locales/news.json';

definePageMeta({ layout: 'subpage' });

/** news 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface NewsContent extends SubpageContent {
  opening: string;
  growth: { title: string; body: string };
  publishX: {
    title: string;
    lead: string;
    formula: {
      center: { img: string; eyebrow: string; title: string };
      items: FormulaItem[];
    };
  };
  curateX: string;
  photos: PanelPhoto[];
  aiRevolution: { title: string; body: string };
  awards: { title: string; timeline: TimelineItem[] };
  closing: string;
}

// JSON import 會把字面值寬化成 string，須斷言回 NewsContent
const c = raw as NewsContent;
</script>

<template>
  <Subpage :content="c">
    <!-- 引言之後第一段：無小標，接在引言的 padding-bottom 之下 -->
    <div class="sp-col mt-16 mb-8">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 衝流量到拚訂閱 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-4" v-html="c.growth.title" />
      <p class="sp-p" v-html="c.growth.body" />
    </div>

    <!-- Publish X 議題智囊包：置中導言 + 滿版四宮格分鏡 -->
    <div class="sp-col mt-8">
      <h2 class="sp-h4 mb-4 sm:mb-2">{{ c.publishX.title }}</h2>
      <p class="sp-lead">{{ c.publishX.lead }}</p>
    </div>
    <div class="sp-full">
      <FormulaBlocks v-bind="c.publishX.formula" />
    </div>

    <!-- 智慧內容 Curate X：無小標，接在分鏡之下 -->
    <div class="sp-col mt-8 mb-8 sm:mt-4">
      <p class="sp-p" v-html="c.curateX" />
    </div>

    <!-- 橫向捲動照片牆 -->
    <div class="sp-full mt-8 mb-8">
      <PhotoPanels :photos="c.photos" />
    </div>

    <!-- AI革命全面進化 -->
    <div class="sp-col mt-8">
      <h2 class="sp-h3 mb-4" v-html="c.aiRevolution.title" />
      <p class="sp-p" v-html="c.aiRevolution.body" />
    </div>

    <!-- 獲獎歷程時間軸 -->
    <div class="sp-full mt-8 mb-4">
      <AwardTimeline :items="c.awards.timeline">
        <template #title>
          <div class="sp-col mb-4">
            <h2 class="sp-h3">{{ c.awards.title }}</h2>
          </div>
        </template>
      </AwardTimeline>
    </div>

    <!-- 結語：接在時間軸之下，與 SubpageNav 之間留 mb-16 -->
    <div class="sp-col mt-8 mb-16">
      <p class="sp-p" v-html="c.closing" />
    </div>
  </Subpage>
</template>
