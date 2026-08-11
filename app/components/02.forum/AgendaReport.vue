<!--
  灰底報告區塊：《AI時代 跨世代永續與未來生活大調查》的導流帶。
  資料來自 locales/section2.json 的 report；顯隱時機由外層 .sec2__pin 控制。
  灰底能左右滿版是因為 .sec2 已收掉水平 padding（見 Forum.vue 的 .sec2 註解），
  故此處不需負 margin 或 100vw 之類的破版技巧。
-->
<script setup lang="ts">
import str from '@/locales/section2.json';

const { heading, body, cta } = str.report;
</script>

<template>
  <section class="agenda-report">
    <h3 class="agenda-report__heading">
      <span v-for="(line, i) in heading" :key="i">{{ line }}</span>
    </h3>

    <p class="agenda-report__body">{{ body }}</p>

    <UBtn variant="gray" class="agenda-report__cta" :href="cta.href">
      {{ cta.label }}
    </UBtn>
  </section>
</template>

<style lang="scss" scoped>
// 滿版灰底、內容置中；總高約 490（設計稿反推值 ≈473）由上下 padding 撐出。
// pad／mob 沒有對應設計稿，僅按各斷點的內容寬度（608／26 邊界）等比收斂。
.agenda-report {
  padding: 72px 0 80px;
  background: #ebebeb;
  text-align: center;

  @include rwd-max('pc') {
    padding: 64px 80px 72px;
  }

  @include rwd-max('tablet') {
    padding: 48px 26px 56px;
  }
}

// 兩行標題：設計稿字級 40、行進距 56。
.agenda-report__heading {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  line-height: 56px;

  @include rwd-max('pc') {
    font-size: 32px;
    line-height: 48px;
  }

  @include rwd-max('tablet') {
    font-size: 24px;
    line-height: 36px;
  }
}

// 內文：設計稿欄寬 633 置中，剛好兩行。
.agenda-report__body {
  width: 633px;
  margin: 40px auto 0;
  font-size: 21px;
  font-weight: 300;
  line-height: 38px;
  text-align: justify;

  @include rwd-max('pc') {
    width: auto;
    margin-top: 32px;
    font-size: 20px;
    line-height: 36px;
  }

  @include rwd-max('tablet') {
    font-size: 18px;
    line-height: 32px;
  }
}

// CTA：設計稿 422×74 深灰底白字（非橘色，與議程的 primary 按鈕區隔）——
// 配色在 <UBtn variant="gray">，這裡只給尺寸與版位。
// margin 的 auto 置中吃得到，是因為 UBtn 的根節點是 display: grid（block-level）。
.agenda-report__cta {
  --u-btn-w: 422px;
  --u-btn-h: 74px;

  margin: 40px auto 0;

  @include rwd-max('pc') {
    --u-btn-w: 296px;
    --u-btn-h: 70px;

    margin-top: 32px;
  }

  @include rwd-max('tablet') {
    --u-btn-w: 100%;
  }
}
</style>
