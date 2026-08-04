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
.forum-event {
  --date-size: 105px;
  --date-lh: 98px;

  position: relative;

  &--quote {
    --date-size: 105px;
    --date-lh: 98px;

    padding: 1097px 0 280px;
  }

  &--stair {
    --date-size: 132px;
    --date-lh: 124px;

    padding: 1157px 0 120px;
  }

  &--right {
    --date-size: 122px;
    --date-lh: 114px;

    padding: 779px 0 40px;
  }
}

// 標眉～CTA 整落：設計稿都靠左 x=108，抽離文件流後底下的講者組不受其行數影響。
.forum-event__head {
  position: absolute;
  top: 0;
  left: 108px;
}

.forum-event__tag {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;
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
}

.forum-event__tag-name {
  color: var(--accent);
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.15em;
}

// 「台積電」：設計稿字面 y=70、寬 161。
.forum-event__brand {
  margin: 21px 0 0;
  font-size: 56px;
  font-weight: 300;
  line-height: 1.2;
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

  .forum-event--quote & {
    margin-top: 10px;
    font-size: 74px;
    line-height: 1.22;
    letter-spacing: 0.02em;
  }

  .forum-event--stair & {
    margin-top: 0;
  }

  .forum-event--right & {
    margin-top: 12px;
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
}

// 內文：設計稿 y=378（論壇二）／302（論壇三），欄寬 623，剛好三行。
.forum-event__body {
  width: 623px;
  margin: 16px 0 0;
  color: #898989;
  font-size: 24px;
  line-height: 44px;
  text-align: justify;
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
}

// 定位層本身不佔高度，內部三組各自吃設計稿座標。
.forum-event__meta {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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

  .forum-event--quote & {
    top: 571px;
    left: 108px;
  }

  // 階梯式：三行逐行往右下，位移 ＝ 設計稿字面 x 差（09 ＋154、15 ＋324）與 y 差（127.3、114.5）。
  .forum-event--stair & {
    top: 749px;
    left: 301px;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: 127.3px 114.5px auto;
  }

  .forum-event--right & {
    top: 415px;
    right: 108px;
  }
}

.forum-event__date-year {
  grid-area: 1 / 1 / 2 / -1;

  .forum-event--right & {
    justify-self: end;
  }
}

.forum-event__date-mm {
  grid-area: 2 / 1;

  .forum-event--stair & {
    grid-area: 2 / 1 / 3 / -1;
    margin-left: 154px;
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
    margin-left: 324px;
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
.forum-event__venue {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0;
  font-weight: 300;

  .forum-event--quote & {
    top: 776px;
    left: 108px;
    font-size: 43px;
    line-height: 58px;
  }

  .forum-event--stair & {
    top: 690px;
    right: 108px;
    align-items: flex-end;
    font-size: 47px;
    line-height: 62px;
  }

  .forum-event--right & {
    top: 654px;
    right: 108px;
    align-items: flex-end;
    font-size: 52px;
    line-height: 70px;
  }
}

// 講者組：論壇一設計稿 x=463 寬 709，論壇二 x=455 寬 528（兩張 250 卡片 ＋ 28 欄距）。
.forum-event__speakers {
  position: relative;

  .forum-event--quote & {
    width: 709px;
    margin-left: 463px;
  }

  .forum-event--stair & {
    display: flex;
    gap: 28px;
    width: 528px;
    margin-left: 455px;
    padding-top: 44px;
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

  .forum-event--quote & {
    top: 59px;
    left: 312px;
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

  .forum-event__speaker--card & {
    position: static;
    width: 250px;
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

  .forum-event__speaker--card & {
    order: 2;
    margin: 0;
  }
}

// 卡片版：照片底 ＋12 起排，並固定佔 68 高，讓兩張卡的姓名對齊同一條基線。
.forum-event__speaker-role {
  order: 1;
  min-height: 68px;
  margin: 12px 0 0;
  color: #898989;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.05em;
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
}

// 論壇一：長 bio 橫跨照片欄與文字欄（設計稿寬 709、字面 y 為講者組頂端下方 316）。
// 負 margin 回推是「照片左、文字右」版式專用，卡片版式若吃到會左右各溢出數百 px，故限定 --quote。
.forum-event--quote .forum-event__bio {
  width: 709px;
  margin: 102px 0 0 -312px;
}

// 選擇器比上一條多一層才蓋得掉那個 102px：第二段之後只留段距。
.forum-event--quote .forum-event__bio + .forum-event__bio {
  margin-top: 36px;
}
</style>
