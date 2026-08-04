<script lang="ts" setup>
/**
 * health — 健康事業部（失智 KTA 行動倡議）。
 *
 * 分工：文案在 locales/health.json（區塊用語意 key），版面與間距寫在本頁 template。
 *   ・區塊間距 → Tailwind mt-* / mb-*（4px 級距，mt-6 = 24px）。斷點 sm = 768、lg = 1280。
 *     一律寫成 mt-* mb-* 兩側分開（不用 my-*），相鄰兩塊要各自微調時不必先拆。
 *     注意相鄰區塊的 mb + mt 會 margin collapse，實際間距取兩者較大值而非相加。
 *   ・字級／欄寬 → assets/styles/subpage.scss 的 .sp-* 類。
 *   ・每個內文區塊是「一段 string」，段落之間用 <br/><br/> 斷行、以 v-html 輸出
 *     （文案為本地靜態檔，非使用者輸入）。
 *
 * hero／引言／nav 仍走 Subpage 外殼（六頁一致，含 100vh、進場動畫、疊層約定）。
 * 本頁為閱讀順序最後一篇，nav 不設 next。
 */
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import type { PanelPhoto } from '~/components/PhotoPanels.vue';
import raw from '~/locales/health.json';

definePageMeta({ layout: 'subpage' });

/** health 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface HealthContent extends SubpageContent {
  opening: string;
  gap: { title: string; body: string };
  communityCta: { label: string; url: string };
  solution: { title: string; body: string };
  awards: { title: string; items: { img: string; alt: string; body: string }[] };
  photos: PanelPhoto[];
  closing: string;
  finalCta: { lead: string; label: string; url: string };
}

// JSON import 會把字面值寬化成 string，須斷言回 HealthContent
const c = raw as HealthContent;
</script>

<template>
  <Subpage :content="c">
    <!-- 引言之後第一段：無小標，接在引言的 padding-bottom 之下 -->
    <div class="sp-col mt-16 mb-8">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 縮短社會鴻溝 凝聚行動力：小標與內文對稿間距 32 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-8">{{ c.gap.title }}</h2>
      <p class="sp-p" v-html="c.gap.body" />
    </div>

    <!-- 失智社群按鈕 -->
    <div class="mt-8 mb-8">
      <SubpageCta :label="c.communityCta.label" :url="c.communityCta.url" />
    </div>

    <!-- 媒體不只報導 更提供解方 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 mb-8">{{ c.solution.title }}</h2>
      <p class="sp-p" v-html="c.solution.body" />
    </div>

    <!-- 近年得獎獎項：小標 mob 靠左、pad 以上置中；桂冠徽章 mob 置中直排、pad 以上與文字並排 -->
    <div class="sp-col mt-8 mb-8">
      <h2 class="sp-h3 sm:text-center">{{ c.awards.title }}</h2>
      <div class="mt-5 flex flex-col gap-6">
        <div
          v-for="(a, i) in c.awards.items"
          :key="i"
          class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
        >
          <img class="w-[186px] shrink-0" :src="a.img" :alt="a.alt" loading="lazy" />
          <p class="m-0 text-[15px] leading-6 font-light text-(--color-gray)">{{ a.body }}</p>
        </div>
      </div>
    </div>

    <!-- 輪播綁滾動：照片橫向軌道（mob 直排） -->
    <div class="sp-full mt-8 mb-8">
      <PhotoPanels :photos="c.photos" />
    </div>

    <!-- 結語 -->
    <div class="sp-col mt-8 mb-8">
      <p class="sp-p" v-html="c.closing" />
    </div>

    <!-- 共享圖庫按鈕（含引導句）：與 SubpageNav 之間留 mb-16 -->
    <div class="mt-15 mb-16">
      <SubpageCta :lead="c.finalCta.lead" :label="c.finalCta.label" :url="c.finalCta.url" />
    </div>
  </Subpage>
</template>
