<script lang="ts" setup>
// news 子頁的完整內容（hero／引言／內文），與版型骨架 <Subpage> 一起構成一篇文章。
//
// 為什麼獨立成元件而不是留在 app/pages/news.vue：手機版的連續閱讀頁（app/pages/subpage.vue）
// 要把六篇串在同一份文件裡，兩邊必須吃同一份內容 —— 否則文案與排版會分岔成兩套。
// pages/news.vue 因此變成只掛 layout 的薄殼。
import type { SubpageContent } from '../Subpage.vue';
import type { FormulaItem } from '~/components/FormulaBlocks.vue';
import type { PanelPhoto } from '~/components/PhotoPanels.vue';
import type { TimelineItem } from '~/components/AwardTimeline.vue';
import raw from '~/locales/news.json';

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
    <div v-ga-view="'news_digitization'" class="sp-col mt-16">
      <h2 class="sp-h3 mb-4" v-html="c.growth.title" />
      <p class="sp-p" v-html="c.growth.body" />
    </div>

    <!-- Publish X 議題智囊包：置中導言 + 滿版四宮格分鏡 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h4 mb-4 text-center sm:mb-2">{{ c.publishX.title }}</h2>
      <p class="sp-lead" v-html="c.publishX.lead" />
    </div>
    <div class="sp-full">
      <FormulaBlocks v-bind="c.publishX.formula" />
    </div>

    <div class="sp-col mt-8">
      <p class="sp-p" v-html="c.curateX" />
    </div>

    <!-- 橫向捲動照片牆 -->
    <div class="sp-full mt-16">
      <PhotoPanels :photos="c.photos" />
    </div>

    <!-- AI革命全面進化 -->
    <div v-ga-view="'news_ai_revolution'" class="sp-col mt-16">
      <h2 class="sp-h3 mb-4" v-html="c.aiRevolution.title" />
      <p class="sp-p" v-html="c.aiRevolution.body" />
    </div>

    <!-- 獲獎歷程時間軸 -->
    <div v-ga-view="'news_award'" class="sp-full mt-16">
      <AwardTimeline :items="c.awards.timeline">
        <template #title>
          <div class="sp-col">
            <h2 class="sp-subtitle">{{ c.awards.title }}</h2>
          </div>
        </template>
      </AwardTimeline>
    </div>

    <!-- 結語 -->
    <div class="sp-col mt-8 mb-16 sm:mt-12 lg:mt-16">
      <p class="sp-p" v-html="c.closing" />
    </div>
  </Subpage>
</template>
