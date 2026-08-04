<!--
  單一論壇場次區塊（論壇一~三），純 props 驅動、無動態。
  .forum-event__date 是 ForumCorePath 可見線的錨點元素，改動其版位需同步 FORUM_PATH 的 anchorOffset。
  設計稿的大標／日期／地點是 outline 過的 vector，字級由字框反推後改用專案字體 live text（見各處註解）。
-->
<script setup lang="ts">
import type { ForumEvent } from '~/types/forum';

const props = defineProps<{ event: ForumEvent }>();

// 日期大字中的「/」要獨立成一個元素：核心經過時會化為它（見 FORUM_PATH.slash）。
const dateParts = computed(() => props.event.date.split('/'));

// 設計稿的講者版式分兩種：單人是「照片左／文字右」，多人（論壇二）是並排卡片。
const isSpeakerCards = computed(() => (props.event.speakers?.length ?? 0) > 1);
</script>

<template>
  <article class="forum-event">
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

    <a v-if="event.cta" class="forum-event__cta" href="#">{{ event.cta }}</a>

    <!-- 日期時間組（左）與英文引言（右）在設計稿是同一列的兩欄。 -->
    <div class="forum-event__meta">
      <p v-if="event.quoteEn" class="forum-event__quote">
        <span v-for="(line, i) in event.quoteEn" :key="i">{{ line }}</span>
      </p>

      <div class="forum-event__date">
        <span class="forum-event__date-year">{{ event.year }}</span>
        <span class="forum-event__date-md">
          <span>{{ dateParts[0] }}</span>
          <span class="forum-event__slash">/</span>
          <span>{{ dateParts[1] }}</span>
          <span class="forum-event__date-weekday">{{ event.weekday }}</span>
        </span>
      </div>

      <p class="forum-event__venue">
        <span v-for="(line, i) in event.venue" :key="i">{{ line }}</span>
        <span v-if="event.time">{{ event.time }}</span>
      </p>
    </div>

    <div v-if="event.speakers?.length" class="forum-event__speakers">
      <p
        v-if="event.speakerLabel"
        class="forum-event__speaker-label"
        :class="{ 'forum-event__speaker-label--row': isSpeakerCards }"
      >
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
        <span v-else class="forum-event__photo-slot">{{ sp.photoNo }}</span>

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
// 左右 108 ＝ 設計稿 1280 稿的內容邊界（內容寬 1064）。
.forum-event {
  position: relative;
  padding: 0 108px 280px;
}

.forum-event__tag {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 0 24px;
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

.forum-event__brand {
  margin: 0 0 32px;
  font-size: 56px;
  font-weight: 300;
  line-height: 1.2;
}

// 96px：設計稿 CJK 字框每字進距 105.6 ÷ (1 ＋ 0.1em 字距) 反推。
.forum-event__title {
  display: flex;
  flex-direction: column;
  margin: 0 0 32px;
  font-size: 96px;
  font-weight: 300;
  line-height: 1.22;
  letter-spacing: 0.1em;
}

.forum-event__subtitle {
  display: flex;
  flex-direction: column;
  margin: 0 0 220px;
  font-size: 50px;
  font-weight: 300;
  line-height: 1.24;
  letter-spacing: 0.02em;
}

.forum-event__body {
  max-width: 623px;
  margin: 0 0 32px;
  color: #898989;
  font-size: 24px;
  line-height: 44px;
  text-align: justify;
}

.forum-event__cta {
  display: grid;
  place-items: center;
  width: 371px;
  height: 80px;
  margin: 0 0 80px;
  background: var(--accent);
  color: #fff;
  font-size: 22px;
  line-height: 36px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-indent: 0.05em;
}

// 日期時間組與英文引言同一列：設計稿內容框 1064 內，日期組 x=0、引言 x=610 寬 454（切齊右緣）。
.forum-event__meta {
  display: grid;
  grid-template-columns: 610px 454px;
  align-items: start;
}

.forum-event__quote {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 40px;
  font-weight: 300;
  line-height: 48px;
  text-align: right;
}

// 日期大字：ForumCorePath 的錨點元素（見檔頭）。
// 104px／line-height 0.93 由設計稿字框反推（數字高 73.6、兩行基線距 97.6）；
// margin-top 105 ＝ 設計稿裡日期組頂端低於引言頂端的距離。
.forum-event__date {
  grid-row: 1;
  grid-column: 1;
  display: flex;
  flex-direction: column;
  margin: 105px 0 24px;
  font-size: 104px;
  font-weight: 300;
  line-height: 0.93;
}

.forum-event__date-md {
  display: flex;
  align-items: baseline;
}

.forum-event__date-weekday {
  margin-left: 20px;
  font-size: 24px;
}

// 核心停靠點：核心經過時化為這一撇（Task 7 讀它的 rect 定位），靜態時與日期同色。
// 左右各 10px：設計稿的「/」比字型的 advance 寬，補回才對得上「09/09」總寬 295。
.forum-event__slash {
  margin: 0 10px;
  color: inherit;
}

.forum-event__venue {
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 42px;
  font-weight: 300;
  line-height: 58px;
}

// 講者組整組靠右：設計稿 x=463（＝內容框右側 709 寬），標籤與講者各佔一列。
.forum-event__speakers {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 20px 28px;
  margin-top: 160px;
}

// 寬度＝文字欄 396，靠右後正好對齊照片右側的文字欄（設計稿偏移 312 ＝ 268 ＋ 44）。
// --row（多人）：標籤獨佔一列，靠齊並排卡片的左緣（1064 − 268×2 − 28 ＝ 500）。
.forum-event__speaker-label {
  width: 396px;
  margin: 0;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.15em;

  &--row {
    width: 100%;
    padding-left: 500px;
  }
}

// 單人：照片左（268）、文字右（396），欄距 44；bio 橫跨兩欄（設計稿寬 709）。
// --card（多人）：改為照片在上、文字在下的並排卡片。
.forum-event__speaker {
  display: grid;
  grid-template-columns: 268px 396px;
  column-gap: 44px;
  align-content: start;

  &--card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 268px;
  }
}

// UPic 把 classname 掛在內層 <img>，scoped 選不到，故用 :deep。
:deep(.forum-event__photo) {
  grid-row: 1 / span 2;
  grid-column: 1;
  display: block;
  width: 268px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

// 照片 placeholder：尺寸與實圖一致（設計稿講者圖為正方形），中央印編號方便日後對照補圖。
.forum-event__photo-slot {
  grid-row: 1 / span 2;
  grid-column: 1;
  display: grid;
  place-items: center;
  width: 268px;
  aspect-ratio: 1 / 1;
  border: 1px dashed var(--accent);
  color: var(--accent);
  font-size: 32px;
  letter-spacing: 0.1em;
}

.forum-event__speaker-name {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 42px;
  font-weight: 300;
  line-height: 56px;
}

.forum-event__speaker-role {
  grid-row: 2;
  grid-column: 2;
  margin: 0;
  color: #898989;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.05em;
}

.forum-event__bio {
  grid-column: 1 / -1;
  margin: 36px 0 0;
  font-size: 18px;
  font-weight: 300;
  line-height: 36px;
  text-align: justify;
}
</style>
