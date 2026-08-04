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

    <a class="agenda-report__cta" :href="cta.href">{{ cta.label }}</a>
  </section>
</template>

<style lang="scss" scoped>
// 滿版灰底、內容置中；總高約 490（設計稿反推值 ≈473）由上下 padding 撐出。
.agenda-report {
  padding: 72px 0 80px;
  background: #ebebeb;
  text-align: center;
}

// 兩行標題：設計稿字級 40、行進距 56。
.agenda-report__heading {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  line-height: 56px;
}

// 內文：設計稿欄寬 633 置中，剛好兩行。
.agenda-report__body {
  width: 633px;
  margin: 40px auto 0;
  font-size: 21px;
  font-weight: 300;
  line-height: 38px;
  text-align: justify;
}

// CTA：設計稿 422×74 深灰底白字（非橘色，與議程的 primary 按鈕區隔）。
.agenda-report__cta {
  display: grid;
  place-items: center;
  width: 422px;
  height: 74px;
  margin: 40px auto 0;
  background: #686868;
  color: #fff;
  font-size: 22px;
  line-height: 36px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-indent: 0.05em;
}
</style>
