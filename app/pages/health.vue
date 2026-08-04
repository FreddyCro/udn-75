<script lang="ts" setup>
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
    <!-- 引言之後第一段 -->
    <div class="sp-col mt-16">
      <p class="sp-p" v-html="c.opening" />
    </div>

    <!-- 縮短社會鴻溝 凝聚行動力 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-8">{{ c.gap.title }}</h2>
      <p class="sp-p" v-html="c.gap.body" />
    </div>

    <!-- 失智社群按鈕 -->
    <div class="mt-8">
      <SubpageCta :label="c.communityCta.label" :url="c.communityCta.url" />
    </div>

    <!-- 媒體不只報導 更提供解方 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-8">{{ c.solution.title }}</h2>
      <p class="sp-p" v-html="c.solution.body" />
    </div>

    <!-- 近年得獎獎項 -->
    <div class="sp-col mt-16">
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
    <div class="sp-full mt-16">
      <PhotoPanels :photos="c.photos" />
    </div>

    <!-- 結語 -->
    <div class="sp-col mt-16">
      <p class="sp-p" v-html="c.closing" />
    </div>

    <!-- 共享按鈕 -->
    <div class="mt-15 mb-8">
      <SubpageCta :lead="c.finalCta.lead" :label="c.finalCta.label" :url="c.finalCta.url" />
    </div>
  </Subpage>
</template>
