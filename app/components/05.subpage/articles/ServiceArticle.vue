<script lang="ts" setup>
// service 子頁的完整內容。抽成元件的理由見 NewsArticle.vue 檔頭。
import type { SubpageContent } from '../Subpage.vue';
import type { SubpageWorkItem } from '../SubpageWorks.vue';
import raw from '~/locales/service.json';

/** service 專屬文案結構：Subpage 外殼所需的 hero/intro/nav + 各內文區塊 */
interface ServiceContent extends SubpageContent {
  video: { src: string; alt: string };
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
    <!-- 在演算法時代守住脈絡 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-4">{{ c.context.title }}</h2>
      <p class="sp-p" v-html="c.context.body" />
      <!-- 多圖並排：mob 直排，pad 以上窄欄內均分兩欄 -->
      <div class="mt-16 flex flex-col gap-8 sm:flex-row lg:gap-10">
        <!-- width/height ＝ 素材畫布（兩張同為 295×247）：這一組是 lazy 載入，
             不保留版位的話撐開那一刻會把下面所有 pin 的實際位置推走。
             對帳見 test/subpage-image-space-reservation.spec.ts -->
        <figure v-for="(f, i) in c.context.figures" :key="i" class="min-w-0 flex-1">
          <UPic
            :src="f.src"
            :use-prefix="false"
            :srcset="['mob']"
            :width="295"
            :height="247"
            :alt="f.alt ?? f.caption ?? ''"
          />
          <figcaption v-if="f.caption" class="sp-caption mt-2">{{ f.caption }}</figcaption>
        </figure>
      </div>
    </div>

    <!-- 在AI時代守住現場 -->
    <div class="sp-col mt-16">
      <h2 class="sp-h3 mb-4">{{ c.onSite.title }}</h2>
      <p class="sp-p" v-html="c.onSite.body" />
    </div>

    <!-- 在資訊洪流中守住信任 -->
    <div v-ga-view="'service_algorithm'" class="sp-col mt-16">
      <h2 class="sp-h3 mb-4">{{ c.trust.title }}</h2>
      <p class="sp-p" v-html="c.trust.body" />
    </div>

    <!-- 近年得獎獎項：寬欄；小標 mob 靠左、pad 以上置中 -->
    <div v-ga-view="'service_award'" class="sp-col sp-col--wide mt-16 mb-16">
      <h2 class="sp-subtitle text-center">{{ c.awards.title }}</h2>
      <!-- 桂冠圖表 svg 自帶上下留白 32 → pad 以上貼著小標排即為對稿間距；mob 版 svg 無留白，補 32 -->
      <figure class="award-chart mx-auto mt-8 max-w-140.75 sm:mt-0">
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

<style lang="scss" scoped>
// 桂冠圖表的版位保留。
//
// ⚠️ 為什麼是 CSS 而不是 <img> 的 width/height：這張圖走 UPic 的 pcpad / mob 兩檔，
//    兩檔**比例不同**（mob 直式 362×332、pcpad 橫式 633×327），
//    而 width/height 屬性只能宣告一組。斷點與 UPic 的 pcpad media 對齊（都是 768）。
// ⚠️ 為什麼非保留不可：圖是 lazy 載入的，沒保留就是載入前 0 高、載入後撐開 ——
//    那一撐把下面所有 ScrollTrigger pin 的實際位置推走，而 pin 的起訖是量完就固定的
//    絕對捲動座標（脈絡見 utils/scroll-trigger 的 refreshOnContentResize）。
// 數字＝素材 viewBox，對帳見 test/subpage-image-space-reservation.spec.ts。
.award-chart :deep(.u-pic-img) {
  aspect-ratio: 362 / 332;

  @include rwd-min('tablet') {
    aspect-ratio: 633 / 327;
  }
}
</style>
