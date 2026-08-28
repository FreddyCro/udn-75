<script setup lang="ts">
import {
  NmdAuthor,
  NmdFooter,
  NmdShare,
} from '@udn-digital-center/common-components';
import { shareURL_fb, shareURL_twitter, useLineShareUrl } from '@/utils/share';
import strFooter from '@/locales/footer.json';
import common from '@/locales/common.json';
import { anchorSlug } from '~/utils/subpage-stream';

const lineHref = useLineShareUrl();

const CURRENT_YEAR = new Date().getFullYear();

const route = useRoute();

// 連續閱讀頁的最後一篇（＝ health）。從資料推而不寫死，清單順序一改就自己跟著走。
const LAST_SLUG = anchorSlug(
  common.subpageAnchors[common.subpageAnchors.length - 1]?.url ?? '',
);

/**
 * 頁尾的 section_view term：首頁是 `editor`，子頁是 `{page}_editor`（事件表 §3.11／§3.12）。
 *
 * ⚠️ 必須是 computed —— 這個元件掛在 layout 上，跨子頁導航（news → visual）時**元素不會
 *    重建**，只有 term 變。`v-ga-view` 的 updated 會把新值寫回屬性，且去重是按 term 記的
 *    （見 plugins/ga-section-view.client.ts 與 utils/tracking-event.ts），所以同一顆 DOM
 *    可以先回報 news_editor、再回報 visual_editor。
 *
 * ⚠️ 連續閱讀頁（<768 的 /subpage）六篇在同一份文件、頁尾只有一份，且它排在最後一篇
 *    之後 —— 看得到它就必然已經讀完最後那一篇，故固定回報 LAST_SLUG。
 *    不用當下的 hash：/subpage 的 hash 會隨捲動被改寫（見 pages/subpage.vue 的
 *    resolveLanding 說明），拿它當 term 會變成「捲到哪就報哪」的隨機值。
 */
const gaViewTerm = computed(() => {
  const path = route.path;
  if (path === '/') return 'editor';
  if (path === '/subpage') return `${LAST_SLUG}_editor`;
  const slug = anchorSlug(path);
  return slug ? `${slug}_editor` : 'editor';
});
</script>

<template>
  <!-- v-ga-view：正常流段落的 section_view（見 plugins/ga-section-view.client.ts）。
       掛在既有的 #editor 上，不另插 marker 元素。 -->
  <div v-ga-view="gaViewTerm" id="editor" class="app-footer">
    <div class="app-footer__info">
      <!--
        names 裡的「、」與半形空白都是 NmdAuthor 的斷行點：它會把每個名字包成
        <span>、分隔符另成一個 flex item，再靠 --maxWidth（見下方 style）換行。
        半形空白不會被畫出來，是「只在窄螢幕換行、寬螢幕接回同一行」用的
        —— 例如「聯合報新聞部 視覺設計中心」在 mob 斷成兩行、pad/pc 併回一行。
      -->
      <NmdAuthor>
        <template
          v-for="credit in strFooter.credits"
          :key="credit.title"
          #[credit.title]
        >
          {{ credit.names }}
        </template>
        <template #上線日期>{{ strFooter.date }}</template>
      </NmdAuthor>
      <!-- 單檔圖用法（見 UPic.vue 案例 3）：logo.png 只有 1x、無 webp、無裝置後綴。 -->
      <div class="app-footer__logo">
        <UPic
          src="/img/logo"
          ext="png"
          :use-prefix="false"
          :use2x="false"
          :webp="false"
          :width="145"
          :height="43"
          :alt="strFooter.logoAlt"
        />
      </div>
      <ClientOnly>
        <NmdShare
          :facebook="{ href: shareURL_fb }"
          :line="{ href: lineHref, target: '_blank' }"
          :twitter="{ href: shareURL_twitter }"
          twitter-icon="x"
        />
      </ClientOnly>
    </div>
    <!-- <NmdToTop /> -->
    <NmdFooter :year="CURRENT_YEAR" />
  </div>
</template>

<style lang="scss">
.app-footer {
  &__info {
    // 上緣的留白由 NmdAuthor 自己的 padding-top 給（mob 60 / pc 80），
    // 這裡只補分享列到站台 footer 之間的 50px（對稿：share_button 的 py-50）。
    padding-bottom: 50px;
    background-color: #f1f1f1;

    // NmdAuthor 名字欄的寬度上限（它的 grid 第二欄是 minmax(auto, var(--maxWidth, 8em))）。
    // 對稿：mob 120px、pad / pc 180px。名單裡每個名字與「、」都是各自的 flex item，
    // 所以這個寬度就直接決定斷行位置 —— 180px 剛好三個名字＋頓號、120px 剛好兩個。
    //
    // ⚠️ 曾經改成 8em / 12em，想讓欄寬跟著 in-app 被放大的字一起長 —— 無效，已改回 px。
    //    `em` 是從 **specified** font size 解析的（Blink 的
    //    CSSToLengthConversionData::FontSizes），而 in-app 的 text zoom 乘在 **computed**
    //    font size 上（FontBuilder::GetComputedSizeFromSpecifiedSize）→ 8em 在 LINE 裡
    //    仍然是 8 × 15px ＝ 120px，與寫死 px 的結果完全一樣，斷行照樣擠爆。
    //    真正的解法是全站把字級除掉量測到的倍率（`--tz`），見 build/text-zoom-normalize.ts；
    //    字級回到設計值之後，這裡就該是單純的對稿 px。
    //    （2026-08-27 Pixel 9a ╱ LINE 實機把 em / ch / text-size-adjust 逐一驗掉。）
    --maxWidth: 120px;

    @include rwd-min('tablet') {
      --maxWidth: 180px;
    }

    // NmdAuthor 自己的 padding-top 是 mob 60 / ≥1280 才 80，但 pad 稿也要 80。
    // padding-bottom 原生 50，稿的名單→logo 只留 32（三斷點同值）。
    .author-grid {
      padding-bottom: 32px;

      @include rwd-min('tablet') {
        padding-top: 80px;
      }
    }
  }

  // 145×43（logo.png 原生 162×48，等比縮），三斷點同尺寸；下方 50 是到分享列的間距。
  &__logo {
    width: 145px;
    margin: 0 auto 50px;
  }
}
</style>
