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

    <p v-if="event.quoteEn" class="forum-event__quote">
      <span v-for="(line, i) in event.quoteEn" :key="i">{{ line }}</span>
    </p>

    <p v-if="event.body" class="forum-event__body">{{ event.body }}</p>

    <a v-if="event.cta" class="forum-event__cta" href="#">{{ event.cta }}</a>

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

    <div v-if="event.speakers?.length" class="forum-event__speakers">
      <p v-if="event.speakerLabel" class="forum-event__speaker-label">
        {{ event.speakerLabel }}
      </p>
      <div
        v-for="(sp, i) in event.speakers"
        :key="i"
        class="forum-event__speaker"
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
    // letter-spacing 會在最後一字後多留一格，補回左側才視覺置中。
    text-indent: 0.15em;
  }

  .forum-event__tag-name {
    color: var(--accent);
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.15em;
  }
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

.forum-event__quote {
  display: flex;
  flex-direction: column;
  margin: 0 0 40px;
  font-size: 40px;
  font-weight: 300;
  line-height: 48px;
  text-align: right;
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
  text-indent: 0.1em;
}

// 日期大字：ForumCorePath 的錨點元素（見檔頭）。
// 104px／line-height 0.93 由設計稿字框反推（數字高 73.6、兩行基線距 97.6）。
.forum-event__date {
  display: flex;
  flex-direction: column;
  margin: 0 0 24px;
  font-size: 104px;
  font-weight: 300;
  line-height: 0.93;

  .forum-event__date-md {
    display: flex;
    align-items: baseline;
  }

  .forum-event__date-weekday {
    margin-left: 20px;
    font-size: 24px;
  }
}

// 核心停靠點：核心經過時化為這一撇（Task 7 讀它的 rect 定位）。
// 左右各 10px：設計稿的「/」比字型的 advance 寬，補回才對得上「09/09」總寬 295。
.forum-event__slash {
  margin: 0 10px;
  color: var(--accent);
}

.forum-event__venue {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 42px;
  font-weight: 300;
  line-height: 58px;
}

.forum-event__speakers {
  display: flex;
  flex-wrap: wrap;
  gap: 48px 28px;
  margin-top: 160px;
}

.forum-event__speaker-label {
  width: 100%;
  margin: 0;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.15em;
}

// 不給固定寬：有 bio 的場次由 bio 撐成 709（論壇一），沒有的就收到照片寬（論壇二兩張並排）。
.forum-event__speaker {
  min-width: 268px;
}

// UPic 把 classname 掛在內層 <img>，scoped 選不到，故用 :deep。
:deep(.forum-event__photo) {
  display: block;
  width: 268px;
  margin-bottom: 12px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

// 照片 placeholder：尺寸與實圖一致（設計稿講者圖為正方形），中央印編號方便日後對照補圖。
.forum-event__photo-slot {
  display: grid;
  place-items: center;
  width: 268px;
  aspect-ratio: 1 / 1;
  margin-bottom: 12px;
  border: 1px dashed var(--accent);
  color: var(--accent);
  font-size: 32px;
  letter-spacing: 0.1em;
}

.forum-event__speaker-name {
  display: flex;
  flex-direction: column;
  margin: 0 0 8px;
  font-size: 42px;
  font-weight: 300;
  line-height: 56px;
}

.forum-event__speaker-role {
  margin: 0 0 16px;
  color: #898989;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.05em;
}

.forum-event__bio {
  width: 709px;
  max-width: 100%;
  margin: 0 0 36px;
  font-size: 18px;
  font-weight: 300;
  line-height: 36px;
  text-align: justify;
}
</style>
