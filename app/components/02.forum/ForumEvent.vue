<!--
  單一論壇場次區塊（論壇一~三），純 props 驅動、無動態。
  版位一律以 pc 設計稿 1280 座標系標註（x 直接對應 CSS px，y 以本區標眉頂端為 0）。
  .forum-event__date 是 ForumCorePath 可見線的錨點元素，改動其版位需同步 ForumPathSeg 的 anchor / offset。
-->
<script setup lang="ts">
import type { ForumEvent } from '~/types/forum';

const props = defineProps<{ event: ForumEvent }>();

const dateParts = computed(() => props.event.date.split('/'));

// 階梯式日期（論壇二）不畫實體斜線：設計稿把 09 與 15 之間的對角空隙留給橘核心當那一撇。
const hasSlash = computed(() => props.event.layout !== 'stair');

// 設計稿的講者版式分兩種：單人是「照片左／文字右」，多人（論壇二）是並排卡片。
const isSpeakerCards = computed(() => (props.event.speakers?.length ?? 0) > 1);
</script>

<template>
  <article class="forum-event" :class="`forum-event--${event.layout}`">
    <div class="forum-event__head">
      <p class="forum-event__tag">
        <span class="forum-event__tag-no">{{ event.no }}</span>
        <span class="forum-event__tag-name">{{ event.tag }}</span>
      </p>

      <p v-if="event.brand" class="forum-event__brand">{{ event.brand }}</p>

      <h3 class="forum-event__title">
        <span v-for="(line, i) in event.title" :key="i">{{ line }}</span>
      </h3>

      <p v-if="event.subtitle" class="forum-event__subtitle">
        <span v-for="(line, i) in event.subtitle" :key="i">{{ line }}</span>
      </p>

      <p v-if="event.body" class="forum-event__body">{{ event.body }}</p>

      <!-- TODO 報名連結未定，暫用 # 佔位（同 AppHeader 的待補外連）。 -->
      <a v-if="event.cta" class="forum-event__cta" href="#">{{ event.cta }}</a>
    </div>

    <!-- 日期／地點／引言：三場的排列差很多，故整層攤平成設計稿座標，各群組自行定位。 -->
    <div class="forum-event__meta">
      <p v-if="event.quoteEn" class="forum-event__quote">
        <span v-for="(line, i) in event.quoteEn" :key="i">{{ line }}</span>
      </p>

      <!-- data-forum-anchor：ForumCorePath 依這個值（＝場次名）選錨點，不靠文件順序索引，
           故增刪／重排場次不會讓設計線靜默錨到別場身上。 -->
      <div class="forum-event__date" :data-forum-anchor="event.no">
        <span class="forum-event__date-year">{{ event.year }}</span>
        <span class="forum-event__date-mm">{{ dateParts[0] }}</span>
        <span v-if="hasSlash" class="forum-event__date-slash">/</span>
        <span class="forum-event__date-dd">{{ dateParts[1] }}</span>
        <span class="forum-event__date-weekday">{{ event.weekday }}</span>
      </div>

      <p class="forum-event__venue">
        <span v-for="(line, i) in event.venue" :key="i">{{ line }}</span>
        <span v-if="event.time">{{ event.time }}</span>
      </p>
    </div>

    <div v-if="event.speakers?.length" class="forum-event__speakers">
      <p v-if="event.speakerLabel" class="forum-event__speaker-label">
        {{ event.speakerLabel }}
      </p>
      <div
        v-for="(sp, i) in event.speakers"
        :key="i"
        class="forum-event__speaker"
        :class="{ 'forum-event__speaker--card': isSpeakerCards }"
      >
        <!-- photo 未填時顯示帶編號的 placeholder；填了路徑就自動換成實圖，不需改程式碼。 -->
        <UPic
          v-if="sp.photo"
          :src="sp.photo"
          :use-prefix="false"
          :alt="sp.name"
          classname="forum-event__photo"
        />
        <span v-else class="forum-event__photo-slot" aria-hidden="true">{{ sp.photoNo }}</span>

        <p class="forum-event__speaker-name">
          <span>{{ sp.name }}</span>
          <span v-if="sp.nameZh">{{ sp.nameZh }}</span>
        </p>
        <p v-if="sp.role" class="forum-event__speaker-role">{{ sp.role }}</p>
        <p v-for="(para, j) in sp.bio ?? []" :key="j" class="forum-event__bio">
          {{ para }}
        </p>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
// 設計稿的大標／日期／地點是 outline 過的 vector，Figma 量到的是「字面」外框；
// live text 的 top 量的是行框頂，兩者差 ＝ line-height ÷ 2 − 字面上緣（Noto Sans TC：CJK 0.405em、數字 0.315em）。
// 以下所有 top 都已扣掉這段差值，註解則寫設計稿原始座標，方便回頭對稿。
// 水平方向的字面內縮只有 3~5% em（≤7px），不另外補正，left/right 直接就是設計稿座標。

// 講者組頂端（padding-top）與段落結尾留白（padding-bottom）皆為設計稿值；
// 講者組走一般流排版，論壇一的長 bio 變長只會往下撐開，不會壓到上面的群組。
// --date-size / --date-lh 在此給預設值：三個版式 modifier 都會蓋掉它，
// 但資料漏填 layout 時（型別擋不到 runtime JSON）至少日期不會失去字級。
// 階梯式日期（論壇二）逐行的位移與行進距抽成變數：三斷點各給一組 px。
// 不改用 em 換算是為了不讓 pc 的值產生零點幾 px 的位移 —— 那條設計線靠它對位
// （見 architecture/forum-core-path.md）。
.forum-event {
  --date-size: 105px;
  --date-lh: 98px;
  --stair-x1: 154px;
  --stair-x2: 324px;
  --stair-row1: 127.3px;
  --stair-row2: 114.5px;

  position: relative;

  // pad／mob：pc 那套「整段絕對定位到設計稿座標」的模型整組退回一般流排版，改由 flex 直排。
  @include rwd-max('pc') {
    display: flex;
    flex-direction: column;
  }

  &--quote {
    --date-size: 105px;
    --date-lh: 98px;

    padding: 1097px 0 280px;

    @include rwd-max('pc') {
      --date-size: 86px;
      --date-lh: 80px;

      padding: 32px 80px 80px;
    }

    @include rwd-max('tablet') {
      --date-size: 62px;
      --date-lh: 58px;

      padding: 32px 26px 100px;
    }
  }

  &--stair {
    --date-size: 132px;
    --date-lh: 124px;

    padding: 1157px 0 120px;

    @include rwd-max('pc') {
      --date-size: 86px;
      --date-lh: 80px;
      --stair-x1: 99px;
      --stair-x2: 215px;
      --stair-row1: 80px;
      --stair-row2: 80px;

      padding: 32px 80px 80px;
    }

    @include rwd-max('tablet') {
      --date-size: 78px;
      --date-lh: 73px;
      --stair-x1: 77px;
      --stair-x2: 163px;
      --stair-row1: 73px;
      --stair-row2: 73px;

      padding: 32px 26px 140px;
    }
  }

  &--right {
    --date-size: 122px;
    --date-lh: 114px;

    padding: 779px 0 40px;

    @include rwd-max('pc') {
      --date-size: 86px;
      --date-lh: 80px;

      padding: 32px 80px 40px;
    }

    @include rwd-max('tablet') {
      --date-size: 57px;
      --date-lh: 56px;

      padding: 32px 26px 32px;
    }
  }
}

// 標眉～CTA 整落：設計稿都靠左 x=108，抽離文件流後底下的講者組不受其行數影響。
.forum-event__head {
  position: absolute;
  top: 0;
  left: 108px;

  @include rwd-max('pc') {
    position: static;
  }

  // mob 的論壇二把「立即報名」排到講者組之後（pad 稿仍緊接在內文下方）。
  // display: contents 讓標眉～CTA 直接成為 .forum-event 的 flex 子項，CTA 才能用 order 移到最後。
  @include rwd-max('tablet') {
    .forum-event--stair & {
      display: contents;
    }
  }
}

.forum-event__tag {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;

  @include rwd-max('pc') {
    margin-bottom: 28px;
  }
}

.forum-event__tag-no {
  display: grid;
  place-items: center;
  width: 113px;
  height: 38px;
  background: var(--accent);
  color: #fff;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.15em;
  // letter-spacing 會在最後一字後多留一格，補回它的一半才視覺置中。
  text-indent: 0.075em;

  @include rwd-max('pc') {
    height: 34px;
    font-size: 18px;
    line-height: 24px;
  }
}

.forum-event__tag-name {
  color: var(--accent);
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.15em;

  @include rwd-max('pc') {
    font-size: 18px;
  }
}

// 「台積電」：設計稿字面 y=70、寬 161。
.forum-event__brand {
  margin: 21px 0 0;
  font-size: 56px;
  font-weight: 300;
  line-height: 1.2;

  @include rwd-max('pc') {
    margin: 0 0 24px;
    font-size: 49px;
  }

  @include rwd-max('tablet') {
    margin-bottom: 20px;
    font-size: 35px;
  }
}

// 大標：論壇二／三為 5~6 個 CJK 字、字面寬 520／621，反推 96px ＋ 0.1em 字距、行距 118。
// 論壇一是長英文名，設計稿字面寬 709，故縮到 74px ＋ 0.02em。
.forum-event__title {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-weight: 300;
  font-size: 96px;
  line-height: 118px;
  letter-spacing: 0.1em;

  @include rwd-max('pc') {
    font-size: 67px;
    line-height: 78px;
  }

  @include rwd-max('tablet') {
    font-size: 48px;
    line-height: 56px;
  }

  .forum-event--quote & {
    margin-top: 10px;
    font-size: 74px;
    line-height: 1.22;
    letter-spacing: 0.02em;

    @include rwd-max('pc') {
      margin-top: 0;
      font-size: 54px;
    }

    // 35：設計稿這行剛好切齊 362 的內容寬，再大一級就會斷成兩行。
    @include rwd-max('tablet') {
      font-size: 35px;
    }
  }

  .forum-event--stair & {
    margin-top: 0;
  }

  .forum-event--right & {
    margin-top: 12px;

    @include rwd-max('pc') {
      margin-top: 0;
    }
  }
}

// 副標（論壇一）：設計稿字面 y=155.7、行距 62.9。
.forum-event__subtitle {
  display: flex;
  flex-direction: column;
  margin: 7px 0 0;
  font-size: 50px;
  font-weight: 300;
  line-height: 63px;
  letter-spacing: 0.02em;

  @include rwd-max('pc') {
    margin-top: 28px;
    font-size: 43px;
    line-height: 51px;
  }

  @include rwd-max('tablet') {
    margin-top: 16px;
    font-size: 32px;
    line-height: 41px;
  }
}

// 內文：設計稿 y=378（論壇二）／302（論壇三），欄寬 623，剛好三行。
.forum-event__body {
  width: 623px;
  margin: 16px 0 0;
  color: var(--color-gray-light);
  font-size: 24px;
  line-height: 44px;
  text-align: justify;

  @include rwd-max('pc') {
    width: auto;
    max-width: 460px;
    margin-top: 32px;
    font-size: 20px;
    line-height: 36px;
  }

  @include rwd-max('tablet') {
    max-width: none;
    font-size: 18px;
  }
}

// CTA：設計稿 y=542。
.forum-event__cta {
  display: grid;
  place-items: center;
  width: 371px;
  height: 80px;
  margin: 32px 0 0;
  background: var(--accent);
  color: #fff;
  font-size: 22px;
  line-height: 36px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-indent: 0.05em;

  @include rwd-max('pc') {
    width: 296px;
    height: 70px;
    font-size: 18px;
  }

  // mob：滿版且排到最後（見 .forum-event__head 的 display: contents）。
  @include rwd-max('tablet') {
    order: 1;
    width: 100%;
    font-size: 20px;
  }
}

// 定位層本身不佔高度，內部三組各自吃設計稿座標。
.forum-event__meta {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  @include rwd-max('pc') {
    position: static;
    width: auto;
  }

  // 論壇二的日期與地點在 pad／mob 稿是左右交錯疊在一起的，故這層仍當定位框。
  .forum-event--stair & {
    @include rwd-max('pc') {
      position: relative;
      margin-top: 100px;
    }

    @include rwd-max('tablet') {
      margin-top: 80px;
    }
  }

  // 論壇一的這層以英文引言開頭（緊接副標），故留白掛在引言與日期身上，不掛這層。
  // mob 的論壇三跟論壇二一樣是交錯疊放（地點在右上、日期在左下），pad 則是右切齊的直排。
  .forum-event--right & {
    @include rwd-max('pc') {
      margin-top: 60px;
    }

    @include rwd-max('tablet') {
      position: relative;
      margin-top: 80px;
    }
  }
}

// 英文引言（論壇一）：設計稿 x=718 / 字面 y=720.9，欄寬 454 切齊右緣 1172、右對齊。
.forum-event__quote {
  position: absolute;
  top: 470px;
  left: 718px;
  display: flex;
  flex-direction: column;
  width: 454px;
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  line-height: 50px;
  text-align: right;

  // pad／mob 稿把引言收回副標下方、改靠左。
  @include rwd-max('pc') {
    position: static;
    width: auto;
    margin-top: 32px;
    font-size: 28px;
    line-height: 35px;
    text-align: left;
  }

  @include rwd-max('tablet') {
    margin-top: 28px;
    font-size: 22px;
    line-height: 28px;
  }
}

// 日期大字：ForumCorePath 的錨點元素（見檔頭）。
// 字級由設計稿數字字框反推（論壇一寬 234.9／高 73.6，論壇二、三為其 1.253／1.165 倍）；
// 設計稿字體的數字比 Noto Sans TC 寬，故取寬、高兩種反推值的折衷。
// 版位：論壇一字面 (108, 587.4)、論壇二 (301, 769)、論壇三右緣切齊 1172、字面 y=434。
.forum-event__date {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(4, max-content);
  width: max-content;
  font-size: var(--date-size);
  font-weight: 300;
  line-height: var(--date-lh);

  @include rwd-max('pc') {
    position: static;
  }

  .forum-event--quote & {
    top: 571px;
    left: 108px;

    // pad／mob 稿改切齊右緣，且緊接在英文引言之後。
    @include rwd-max('pc') {
      margin: 88px 0 0 auto;
    }
  }

  // 階梯式：三行逐行往右下，位移 ＝ 設計稿字面 x 差（09 ＋154、15 ＋324）與 y 差（127.3、114.5）。
  .forum-event--stair & {
    top: 749px;
    left: 301px;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: var(--stair-row1) var(--stair-row2) auto;

    // pad／mob 稿把階梯挪回左緣，地點則絕對定位到右上角（見 __venue）。
    @include rwd-max('pc') {
      margin-top: 46px;
    }

    @include rwd-max('tablet') {
      margin-top: 50px;
    }
  }

  .forum-event--right & {
    top: 415px;
    right: 108px;

    @include rwd-max('pc') {
      margin-left: auto;
    }

    // mob 稿改成兩階：2026 靠左，月／日那行再往右下錯開（見 __date-mm）。
    @include rwd-max('tablet') {
      margin: 92px 0 0;
    }
  }
}

.forum-event__date-year {
  grid-area: 1 / 1 / 2 / -1;

  .forum-event--right & {
    justify-self: end;

    @include rwd-max('tablet') {
      justify-self: start;
    }
  }

  .forum-event--quote & {
    @include rwd-max('pc') {
      justify-self: end;
    }
  }
}

.forum-event__date-mm {
  grid-area: 2 / 1;

  .forum-event--stair & {
    grid-area: 2 / 1 / 3 / -1;
    margin-left: var(--stair-x1);
  }

  // mob 的論壇三：月／日整行往右錯開，形成兩階（設計稿位移 63）。
  .forum-event--right & {
    @include rwd-max('tablet') {
      margin-left: 63px;
    }
  }
}

// 核心停靠點：核心經過時化為這一撇（Task 7 讀它的 rect 定位），靜態時與日期同色。
// 左右間距取自設計稿字面間隙（0.095em／0.15em）再扣掉數字自身的側邊留白。
.forum-event__date-slash {
  grid-area: 2 / 2;
  margin: 0 0.1em 0 0.05em;
  color: inherit;
}

.forum-event__date-dd {
  grid-area: 2 / 3;

  .forum-event--stair & {
    grid-area: 3 / 1;
    margin-left: var(--stair-x2);
  }
}

// 星期圓框：設計稿直徑 ＝ 數字字級 ×0.46，左側間隙 ×0.19，底緣切齊數字基線。
.forum-event__date-weekday {
  grid-area: 2 / 4;
  display: grid;
  place-items: center;
  align-self: end;
  width: calc(var(--date-size) * 0.46);
  height: calc(var(--date-size) * 0.46);
  margin-left: calc(var(--date-size) * 0.19);
  border: 1px solid currentcolor;
  border-radius: 50%;
  font-size: calc(var(--date-size) * 0.31);
  line-height: 1;

  .forum-event--stair & {
    grid-area: 3 / 2;
  }
}

// 地點時間組：字級由設計稿 CJK 字面寬反推（每字 43.4／47.5／51.9），行距取設計稿字面行進距。
// 論壇一在日期下方靠左，論壇二在日期上方、論壇三在日期下方，兩者都切齊右緣 1172。
// pad／mob 三場的字級一致（30／28），差別只在版位：論壇一、三跟著日期切齊右緣往下排，
// 論壇二則絕對定位在日期階梯的右上角（兩者在設計稿上是交錯疊放的）。
.forum-event__venue {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0;
  font-weight: 300;

  // 字級都寫在各版式底下：pc 的 .forum-event--x .forum-event__venue 特異度較高，
  // 寫在這一層的 rwd 字級會被它蓋掉。
  .forum-event--quote & {
    top: 776px;
    left: 108px;
    font-size: 43px;
    line-height: 58px;

    @include rwd-max('pc') {
      position: static;
      align-items: flex-end;
      margin: 12px 0 0 auto;
      font-size: 30px;
      line-height: 44px;
      text-align: right;
    }

    @include rwd-max('tablet') {
      margin-top: 8px;
      font-size: 28px;
      line-height: 39px;
    }
  }

  .forum-event--stair & {
    top: 690px;
    right: 108px;
    align-items: flex-end;
    font-size: 47px;
    line-height: 62px;

    @include rwd-max('pc') {
      top: 0;
      right: 0;
      // 8.2em ＝ 設計稿地點欄的字數上限；不收窄會橫向壓到左側的日期階梯。
      max-width: 8.2em;
      font-size: 30px;
      line-height: 44px;
      text-align: right;
    }

    @include rwd-max('tablet') {
      font-size: 28px;
      line-height: 39px;
    }
  }

  .forum-event--right & {
    top: 654px;
    right: 108px;
    align-items: flex-end;
    font-size: 52px;
    line-height: 70px;

    @include rwd-max('pc') {
      position: static;
      margin: 12px 0 0 auto;
      font-size: 30px;
      line-height: 44px;
      text-align: right;
    }

    // mob 稿與論壇二同款交錯：地點釘在右上角，日期在它左下方。
    @include rwd-max('tablet') {
      position: absolute;
      top: 0;
      right: 0;
      max-width: 8.2em;
      margin: 0;
      font-size: 28px;
      line-height: 39px;
    }
  }
}

// 講者組：論壇一設計稿 x=463 寬 709，論壇二 x=455 寬 528（兩張 250 卡片 ＋ 28 欄距）。
.forum-event__speakers {
  position: relative;

  .forum-event--quote & {
    width: 709px;
    margin-left: 463px;

    // pad／mob 稿改單欄直排：照片 → 講者介紹 → 姓名 → 介紹，順序見下方各元素的 order。
    @include rwd-max('pc') {
      display: flex;
      flex-direction: column;
      width: auto;
      margin: 60px 0 0;
    }

    @include rwd-max('tablet') {
      margin-top: 88px;
    }
  }

  .forum-event--stair & {
    display: flex;
    gap: 28px;
    width: 528px;
    margin-left: 455px;
    padding-top: 44px;

    // pad：標籤跨滿兩欄、卡片並排切齊右緣；mob 轉單欄（照片左、文字右，見 --card）。
    @include rwd-max('pc') {
      display: grid;
      grid-template-columns: repeat(2, 210px);
      gap: 12px 28px;
      justify-content: end;
      width: auto;
      margin: 100px 0 0 auto;
      padding-top: 0;
    }

    @include rwd-max('tablet') {
      grid-template-columns: 1fr;
      gap: 16px;
      margin: 60px 0 0;
    }
  }
}

// 標籤脫離流排版，才不會被論壇一「照片左、標籤右且下移 58.7」的錯位版式綁住。
.forum-event__speaker-label {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.15em;

  @include rwd-max('pc') {
    position: static;
  }

  @include rwd-max('tablet') {
    font-size: 16px;
  }

  .forum-event--quote & {
    top: 59px;
    left: 312px;

    // pad／mob 稿：標籤排在照片之後、姓名之前。
    @include rwd-max('pc') {
      order: 2;
      margin-bottom: 16px;
    }
  }

  .forum-event--stair & {
    @include rwd-max('pc') {
      grid-column: 1 / -1;
    }
  }
}

// 單人（論壇一）：照片絕對定位在左，文字欄從 x=312 起（設計稿 268 ＋ 44 欄距）。
// --card（多人）：照片在上、文字在下的並排卡片。
.forum-event__speaker {
  position: relative;
  min-height: 268px;
  padding-left: 312px;

  &--card {
    display: flex;
    flex-direction: column;
    width: 250px;
    min-height: 0;
    padding-left: 0;

    @include rwd-max('pc') {
      width: 210px;
    }

    // mob 稿的論壇二不是卡片，是「照片左、頭銜＋姓名右」的橫列。
    // 頭尾兩條 1fr 是撐開用的空列：照片跨滿四列時，文字才會在照片高度內垂直置中。
    @include rwd-max('tablet') {
      display: grid;
      grid-template-columns: 180px 1fr;
      grid-template-rows: 1fr min-content min-content 1fr;
      column-gap: 24px;
      width: 100%;
    }
  }

  // 論壇一在 pad／mob 沒有自己的版位，讓照片／標籤／姓名／介紹直接參與講者組的直排。
  .forum-event--quote & {
    @include rwd-max('pc') {
      display: contents;
    }
  }
}

// UPic 把 classname 掛在內層 <img>，scoped 選不到，故用 :deep。
// 外層還多一個 <picture>：img 脫離文件流後它會塌成零高，所以卡片版式一定要改回 static，
// 否則補上真圖的當下照片會疊到頭銜／姓名上（placeholder 看不出問題，見下方 __photo-slot）。
:deep(.forum-event__photo) {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 268px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

// :deep() 內不能再接 &，故卡片版式的覆寫獨立寫一條。
.forum-event__speaker--card :deep(.forum-event__photo) {
  position: static;
  width: 250px;

  @include rwd-max('pc') {
    width: 210px;
  }

  @include rwd-max('tablet') {
    width: 180px;
  }
}

// UPic 外層的 <picture> 才是 flex／grid item，故 order 與欄列指派掛它身上，不是內層 <img>。
.forum-event--quote :deep(.u-pic) {
  @include rwd-max('pc') {
    order: 1;
    margin-bottom: 28px;
  }
}

.forum-event--quote :deep(.forum-event__photo) {
  @include rwd-max('pc') {
    position: static;
    width: 233px;
  }
}

.forum-event__speaker--card :deep(.u-pic) {
  @include rwd-max('tablet') {
    grid-row: 1 / -1;
  }
}

// 照片 placeholder：尺寸與實圖一致（設計稿講者圖為正方形），中央印編號方便日後對照補圖。
.forum-event__photo-slot {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: 268px;
  aspect-ratio: 1 / 1;
  border: 1px dashed var(--accent);
  color: var(--accent);
  font-size: 32px;
  letter-spacing: 0.1em;

  .forum-event--quote & {
    @include rwd-max('pc') {
      position: static;
      order: 1;
      width: 233px;
      margin-bottom: 28px;
    }
  }

  .forum-event__speaker--card & {
    position: static;
    width: 250px;

    @include rwd-max('pc') {
      width: 210px;
    }

    @include rwd-max('tablet') {
      grid-row: 1 / -1;
      width: 180px;
    }
  }
}

// 論壇一：姓名字面落在講者組頂端下方 112.7。卡片版式改排在頭銜之後（設計稿是頭銜在上）。
.forum-event__speaker-name {
  display: flex;
  flex-direction: column;
  margin: 102px 0 0;
  font-size: 42px;
  font-weight: 300;
  line-height: 56px;

  .forum-event--quote & {
    @include rwd-max('pc') {
      order: 3;
      margin: 0;
      font-size: 32px;
      line-height: 48px;
    }

    @include rwd-max('tablet') {
      font-size: 29px;
      line-height: 44px;
    }
  }

  .forum-event__speaker--card & {
    order: 2;
    margin: 0;

    @include rwd-max('tablet') {
      grid-area: 3 / 2;
      font-size: 32px;
      line-height: 46px;
    }
  }
}

// 卡片版：照片底 ＋12 起排，並固定佔 68 高，讓兩張卡的姓名對齊同一條基線。
.forum-event__speaker-role {
  order: 1;
  min-height: 68px;
  margin: 12px 0 0;
  color: var(--color-gray-light);
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.05em;

  // mob 的橫列版式改由 grid 指派版位，不再需要那條對齊用的 68 高。
  @include rwd-max('tablet') {
    grid-area: 2 / 2;
    min-height: 0;
    margin: 0;
    font-size: 16px;
    line-height: 24px;
  }

  .forum-event--quote & {
    @include rwd-max('pc') {
      order: 4;
    }
  }
}

.forum-event__bio {
  margin: 0;
  font-size: 18px;
  font-weight: 300;
  line-height: 36px;
  text-align: justify;

  & + & {
    margin-top: 36px;
  }

  @include rwd-max('pc') {
    font-size: 20px;
  }

  @include rwd-max('tablet') {
    font-size: 18px;
  }
}

// 論壇一：長 bio 橫跨照片欄與文字欄（設計稿寬 709、字面 y 為講者組頂端下方 316）。
// 負 margin 回推是「照片左、文字右」版式專用，卡片版式若吃到會左右各溢出數百 px，故限定 --quote。
.forum-event--quote .forum-event__bio {
  width: 709px;
  margin: 102px 0 0 -312px;

  @include rwd-max('pc') {
    order: 5;
    width: auto;
    margin: 32px 0 0;
  }
}

// 選擇器比上一條多一層才蓋得掉那個 102px：第二段之後只留段距。
.forum-event--quote .forum-event__bio + .forum-event__bio {
  margin-top: 36px;
}
</style>
