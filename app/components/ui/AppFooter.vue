<script setup lang="ts">
import {
  NmdAuthor,
  NmdFooter,
  NmdShare,
  NmdToTop,
} from '@udn-digital-center/common-components';
import { shareURL_fb, shareURL_twitter, useLineShareUrl } from '@/utils/share';
import strFooter from '@/locales/footer.json';

const lineHref = useLineShareUrl();

const CURRENT_YEAR = new Date().getFullYear();
</script>

<template>
  <div id="editor" class="app-footer">
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
    <NmdToTop />
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
