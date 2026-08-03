<script lang="ts" setup>
/**
 * service — 新聞營運中心。
 *
 * 分工：文案在 locales/service.json（區塊用語意 key），版面與間距寫在本頁 template。
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
import type { SubpageWorkItem } from '~/components/05.subpage/SubpageWorks.vue';
import raw from '~/locales/service.json';

definePageMeta({ layout: 'subpage' });

/** service 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface ServiceContent extends SubpageContent {
  context: {
    title: string;
    body: string;
    figures: { src: string; caption?: string; alt?: string }[];
  };
  onSite: { title: string; body: string };
  trust: { title: string; body: string };
  awards: { title: string; chart: string; chartAlt: string; works: SubpageWorkItem[] };
}

// JSON import 會把字面值寬化成 string，須斷言回 ServiceContent
const c = raw as ServiceContent;
</script>

<template>
  <Subpage :content="c">
    <!-- 在演算法時代守住脈絡：小標 + 內文 + 兩圖並排 -->
    <div class="sp-col mt-16 mb-8">
      <h2 class="sp-h3 mb-4">{{ c.context.title }}</h2>
      <p class="sp-p" v-html="c.context.body" />
      <!-- 多圖並排：mob 直排，pad 以上窄欄內均分兩欄 -->
      <div class="mt-10 flex flex-col gap-8 sm:flex-row lg:gap-10">
        <figure v-for="(f, i) in c.context.figures" :key="i" class="min-w-0 flex-1">
          <UPic :src="f.src" :use-prefix="false" :srcset="['mob']" :alt="f.alt ?? f.caption ?? ''" />
          <figcaption v-if="f.caption" class="sp-caption mt-2">{{ f.caption }}</figcaption>
        </figure>
      </div>
    </div>

    <!-- 在AI時代守住現場 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-4">{{ c.onSite.title }}</h2>
      <p class="sp-p" v-html="c.onSite.body" />
    </div>

    <!-- 在資訊洪流中守住信任 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-4">{{ c.trust.title }}</h2>
      <p class="sp-p" v-html="c.trust.body" />
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
