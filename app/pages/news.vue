<script lang="ts" setup>
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
    <!-- 引言之後第一段 -->
    <div class="sp-col mt-16">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 衝流量到拚訂閱 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-4" v-html="c.growth.title" />
      <p class="sp-p" v-html="c.growth.body" />
    </div>

    <!-- Publish X 議題智囊包：置中導言 + 滿版四宮格分鏡 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h4 mb-4 sm:mb-2">{{ c.publishX.title }}</h2>
      <p class="sp-lead">{{ c.publishX.lead }}</p>
    </div>
    <div class="sp-full">
      <FormulaBlocks v-bind="c.publishX.formula" />
    </div>

    <!-- 智慧內容 Curate X：無小標，接在分鏡之下 -->
    <div class="sp-col mt-8 sm:mt-4">
      <p class="sp-p" v-html="c.curateX" />
    </div>

    <!-- 橫向捲動照片牆 -->
    <div class="sp-full mt-16">
      <PhotoPanels :photos="c.photos" />
    </div>

    <!-- AI革命全面進化 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-4" v-html="c.aiRevolution.title" />
      <p class="sp-p" v-html="c.aiRevolution.body" />
    </div>

    <!-- 獲獎歷程時間軸 -->
    <div class="sp-full mt-16">
      <AwardTimeline :items="c.awards.timeline">
        <template #title>
          <div class="sp-col mb-4">
            <h2 class="sp-h3">{{ c.awards.title }}</h2>
          </div>
        </template>
      </AwardTimeline>
    </div>

    <!-- 結語：接在時間軸之下，與 SubpageNav 之間留 mb-16 -->
    <div class="sp-col mt-16 mb-16">
      <p class="sp-p" v-html="c.closing" />
    </div>
  </Subpage>
</template>
