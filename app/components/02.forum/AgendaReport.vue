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
      :id="cta.id"
      variant="gray"
      class="agenda-report__cta"
      :href="cta.href"
      @click="play('sfx01')"
    >
      <!-- 文案含「mob 才斷行」的 <br/>（見 locales 的 cta.label 與下方 :deep(br)），
           故走 v-html —— 同 subpage 各頁 sp-h3／sp-lead 的既有慣例。
           包一層 span 而非把 v-html 掛在 <UBtn> 上：v-html 會 fallthrough 成根節點的
           innerHTML，等於在 render 後蓋掉 <slot/>，跟元件搶同一塊 DOM。 -->
      <span class="agenda-report__cta-label" v-html="cta.label" />
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

// CTA：設計稿 600×80 深灰底白字（非橘色，與議程的 primary 按鈕區隔）——
// 配色在 <UBtn variant="gray">，這裡只給尺寸與版位。pad 稿 440×80、mob 稿 362×98
// （362 ＝ 414 稿寬 − 本區塊左右各 26 的 padding，故 mob 寬給 100% 而非寫死）。
// mob 高 98 是因為文案在那裡折成兩行（見 __cta-label）：2×36 行距 ＋ 上下留白。
// margin 的 auto 置中吃得到，是因為 UBtn 的根節點是 display: grid（block-level）。
.agenda-report__cta {
  --u-btn-w: 600px;
  --u-btn-h: 80px;

  margin: 40px auto 0;

  @include rwd-max('pc') {
    --u-btn-w: 440px;

    margin-top: 24px;
  }

  @include rwd-max('tablet') {
    --u-btn-w: 100%;
    // 高度給 auto ＋ min-height 而非寫死 98：mob 稿的 98 是「兩行」的高度，
    // 但 320 這種窄機扣掉本區塊左右各 26 只剩 268，後半段 13 字（20px ＋ 0.1em
    // 字距 ≈ 286）放不下會折成三行 —— 寫死就會從固定高的盒子上下溢出。
    // 414／390／375 內容高（72）都小於 98，min-height 勝出＝仍是稿上的 98。
    --u-btn-h: auto;

    min-height: 98px;
    margin-top: 32px;
  }
}

// 斷行位置逐斷點不同：mob 稿折成「AI時代」／「跨世代永續與未來生活大調查」兩行，
// pad／pc 稿一行。走專案既有慣例 —— JSON 內寫「前段 <br/>後段」，pad 以上把 <br>
// 藏掉就只剩那個半形空格（mob 則是行尾空白被 trim，看不出多一格）。
//
// ⚠️ 為什麼不靠自然換行：CJK 預設可在任意字之間斷，mob 寬度不夠時會斷在
//    「…未來生」這種地方，不會剛好斷在空格上。也不用 word-break: keep-all ——
//    那會讓 320 這種窄機完全不准斷，直接撐破按鈕；<br/> 是「指定一個斷點」，
//    真的更窄時後半段仍可自然折行，壞得比較溫和。
// ⚠️ :deep() 不可省：v-html 產生的 <br> 拿不到 scoped 的 data-v 屬性，
//    直接寫 `br { … }` 會編成 `br[data-v-xxx]`，選不到。
.agenda-report__cta-label {
  :deep(br) {
    @include rwd-min('tablet') {
      display: none;
    }
  }
}
</style>
