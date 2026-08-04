<!--
  現場精彩活動清單：資料來自 locales/section2.json 的 highlights。
  顯隱時機由外層 .sec2__pin 控制。
  縮圖的 img 留空即顯示虛線佔位，填入路徑就自動換成實圖、不需改程式碼
  （同 <ForumEvent> 的講者照片作法）。
-->
<script setup lang="ts">
import str from '@/locales/section2.json';

const { heading, items } = str.highlights;
</script>

<template>
  <section class="highlights">
    <h3 class="highlights__heading">{{ heading }}</h3>

    <ul class="highlights__list">
      <li v-for="(item, i) in items" :key="i" class="highlights__item">
        <UPic
          v-if="item.img"
          :src="item.img"
          :use-prefix="false"
          :alt="item.title"
          classname="highlights__thumb"
        />
        <span v-else class="highlights__thumb-slot" aria-hidden="true" />

        <div class="highlights__detail">
          <p class="highlights__title">{{ item.title }}</p>
          <p class="highlights__excerpt">{{ item.excerpt }}</p>
          <a class="highlights__cta" :href="item.href">
            {{ item.cta }}
            <img
              class="highlights__arrow"
              src="/img/udn75_arrow_circle.svg"
              width="40"
              height="40"
              alt=""
            />
          </a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
// 容器寬度同 <Agenda> 的 1064，兩區左右邊界對齊。
.highlights {
  max-width: 1064px;
  margin: 0 auto;
  padding-bottom: 120px;
}

// 段落標題：設計稿置中、字級 33。
.highlights__heading {
  margin: 0 0 48px;
  font-size: 33px;
  font-weight: 400;
  line-height: 48px;
  letter-spacing: 0.05em;
  text-align: center;
}

.highlights__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 每列：縮圖左、文字右；列距 40。
.highlights__item {
  display: flex;
  gap: 32px;

  & + & {
    margin-top: 40px;
  }
}

// UPic 的外層是 <picture class="u-pic">，它才是 flex item，故寬度要掛在它身上；
// 只設內層 <img> 會讓 picture 自行伸縮而跑版（<ForumEvent> 有同一坑的紀錄）。
.highlights__item :deep(.u-pic) {
  flex: 0 0 240px;
}

// UPic 把 classname 掛在內層 <img>，scoped 選不到，故用 :deep。
:deep(.highlights__thumb) {
  display: block;
  width: 240px;
  height: 160px;
  object-fit: cover;
}

// 縮圖佔位：尺寸同實圖，虛線語彙同 <ForumEvent> 的講者照片 placeholder。
.highlights__thumb-slot {
  flex: 0 0 240px;
  height: 160px;
  border: 1px dashed var(--accent);
}

.highlights__detail {
  flex: 1 1 0;
  min-width: 0;
}

.highlights__title {
  margin: 0;
  font-size: 21px;
  font-weight: 400;
  line-height: 32px;
}

.highlights__excerpt {
  margin: 8px 0 0;
  color: #898989;
  font-size: 17px;
  font-weight: 300;
  line-height: 28px;
  text-align: justify;
}

// 「閱讀完整報導」＋箭頭圓鈕：設計稿靠列的右下角。
.highlights__cta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  color: inherit;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.05em;
  text-decoration: none;
}

.highlights__arrow {
  display: block;
  width: 40px;
  height: 40px;
}
</style>
