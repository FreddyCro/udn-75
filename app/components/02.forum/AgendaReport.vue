<!--
  灰底報告區塊：《AI時代 跨世代永續與未來生活大調查》的導流帶。
  資料來自 locales/section2.json 的 report；顯隱時機由外層 .sec2__pin 控制。
  灰底能左右滿版是因為 .sec2 已收掉水平 padding（見 Forum.vue 的 .sec2 註解），
  故此處不需負 margin 或 100vw 之類的破版技巧。
-->
<script setup lang="ts">
import str from '@/locales/section2.json';

const { heading, body, cta } = str.report;

// CTA 的點擊音效。useSfx() 一定要在 setup 期間取（它此刻要讀 runtimeConfig，見 useSfx.ts）；
// 音效池由 pages/index.vue 的 <AppSfx> 持有，聲音開關關著時 play() 靜默。
const { play } = useSfx();
</script>

<template>
  <section class="agenda-report">
    <h3 class="agenda-report__heading">
      <span v-for="(line, i) in heading" :key="i">{{ line }}</span>
    </h3>

    <p class="agenda-report__body">{{ body }}</p>

    <UBtn
      variant="gray"
      class="agenda-report__cta"
      :href="cta.href"
      @click="play('sfx01')"
    >
      {{ cta.label }}
    </UBtn>
  </section>
</template>

<style lang="scss" scoped>
// 滿版灰底、內容置中；總高約 490（設計稿反推值 ≈473）由上下 padding 撐出。
// pad 稿：上下 padding 64、內容欄 440 置中。
// ⚠ 水平 padding 在 pad 收成 0 —— 440 是掛在三個子項上的（見下方各自的 max-width），
//   不是靠這層內縮。灰底要滿版，這層不能有水平內縮以外的限寬。
.agenda-report {
  padding: 72px 0 80px;
  background: #ebebeb;
  text-align: center;

  @include rwd-max('pc') {
    padding: 64px 0;
  }

  @include rwd-max('tablet') {
    padding: 48px 26px 56px;
  }
}

// 兩行標題：設計稿字級 40、行進距 56（pad 稿 32／48，欄寬 440）。
.agenda-report__heading {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  line-height: 56px;

  @include rwd-max('pc') {
    max-width: 440px;
    margin-inline: auto;
    font-size: 32px;
    line-height: 48px;
  }

  @include rwd-max('tablet') {
    max-width: none;
    font-size: 24px;
    line-height: 36px;
  }
}

// 內文：設計稿欄寬 633 置中，剛好兩行（pad 稿 440、3 行）。
.agenda-report__body {
  width: 633px;
  margin: 40px auto 0;
  font-size: 21px;
  font-weight: 300;
  line-height: 38px;
  text-align: justify;

  @include rwd-max('pc') {
    width: auto;
    max-width: 440px;
    margin-top: 8px;
    font-size: 20px;
    line-height: 36px;
  }

  @include rwd-max('tablet') {
    max-width: none;
    margin-top: 32px;
    font-size: 18px;
    line-height: 32px;
  }
}

// CTA：設計稿 422×74 深灰底白字（非橘色，與議程的 primary 按鈕區隔）——
// 配色在 <UBtn variant="gray">，這裡只給尺寸與版位。pad 稿 440×80。
// margin 的 auto 置中吃得到，是因為 UBtn 的根節點是 display: grid（block-level）。
.agenda-report__cta {
  --u-btn-w: 422px;
  --u-btn-h: 74px;

  margin: 40px auto 0;

  @include rwd-max('pc') {
    --u-btn-w: 440px;
    --u-btn-h: 80px;

    margin-top: 24px;
  }

  @include rwd-max('tablet') {
    --u-btn-w: 100%;
    --u-btn-h: 70px;

    margin-top: 32px;
  }
}
</style>
