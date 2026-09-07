<!--
  現場精彩活動清單：資料來自 locales/section2.json 的 highlights。
  顯隱時機由外層 .sec2__pin 控制。
  縮圖的 img 留空即顯示虛線佔位，填入路徑就自動換成實圖、不需改程式碼
  （同 <ForumEvent> 的講者照片作法）。

  版式（三份稿都對過）：
  - mob（414）：直排，照片滿欄、文字在下，段首 100 段尾 64
  - pad（768）：直排，照片 340 置中、標題置中，容器固定 768 內縮 119（＝內容欄 530）
  - pc（1280）：照片左（363）／文字右（494），gap 32，整組 889 置中
-->
<script setup lang="ts">
import str from '@/locales/section2.json';
import { gaClickNews } from '~/utils/tracking-event';

const { heading, items } = str.highlights;

// 「閱讀完整報導」的 hover／click 音效。useSfx() 一定要在 setup 期間取（它此刻要讀
// runtimeConfig，見 useSfx.ts）；音效池由 app.vue 的 <AppSfx> 持有，開關關著時靜默。
const { play } = useSfx();
</script>

<template>
  <section class="highlights">
    <!-- 標題在 pad／mob 稿是兩行、pc 稿一行 → 斷點由 <br> 控制（稿的斷句不是自然折行
         能撞到的位置，交給瀏覽器會斷在「系」之後）。heading 因此存成兩段字串。 -->
    <h3 class="highlights__heading">
      {{ heading[0] }}<br class="highlights__heading-break" />{{ heading[1] }}
    </h3>

    <ul class="highlights__list">
      <li v-for="(item, i) in items" :key="i" class="highlights__item">
        <!-- 縮圖只有一張橫幅（無 _pc/_pad/_mob 後綴，僅 @2x ＋ WebP 密度變體）
             → srcset 收成單一組、use-prefix 關掉，同 <ForumEvent> 的講者照。
             不收的話三個斷點會各產一組指向同一個檔的 <source>（6 個，全同源）。 -->
        <UPic
          v-if="item.img"
          :src="item.img"
          :use-prefix="false"
          :srcset="['mob']"
          :alt="item.title"
          classname="highlights__thumb"
        />
        <span v-else class="highlights__thumb-slot" aria-hidden="true" />

        <div class="highlights__detail">
          <p class="highlights__title">{{ item.title }}</p>
          <p class="highlights__excerpt">{{ item.excerpt }}</p>
          <a
            :id="item.id"
            class="highlights__cta"
            :href="item.href"
            @mouseenter="play('sfx01Short')"
            @click="play('sfx01Short'); gaClickNews(item.gaTerm)"
          >
            <span class="highlights__cta-label">{{ item.cta }}</span>
            <span class="highlights__arrow" aria-hidden="true" />
          </a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
// 本檔為 mobile-first：基底＝mob 稿（≤767），rwd-min('tablet')＝pad 稿、
// rwd-min('pc')＝pc 稿。
//
// 容器：pad 固定 768 置中再內縮 119（＝稿的內容欄 530），同 .sec2__path／.sec2__forum4
// 的作法 —— 流動容器會讓內容欄在每個視窗寬度長得不一樣。pc 則收成 889
// （＝363 ＋ gap 32 ＋ 494），置中後與 1280 稿的座標一致。
//
// ⚠️ 段首留白（mob 100 / pad 64 / pc 32）是本區自己的稿值。mob 那 100 原本被併在
//    <ForumEvent> --youth 的 padding-bottom 180 裡（80 ＋ 100），補上這裡的同時
//    那邊已扣回 80 —— 兩邊都留了註解，改一邊要記得看另一邊。
.highlights {
  padding: 100px 26px 64px;

  @include rwd-min('tablet') {
    max-width: 768px;
    margin: 0 auto;
    padding: 64px 119px;
  }

  @include rwd-min('pc') {
    max-width: 889px;
    padding: 32px 0 64px;
  }
}

// 段落標題：mob_H2 32/46、pad／pc 稿同為 pc_H2 42/56，皆 Light 置中。
.highlights__heading {
  margin: 0 0 32px;
  font-size: 32px;
  font-weight: 300;
  line-height: 46px;
  text-align: center;

  @include rwd-min('tablet') {
    margin-bottom: 54px;
    font-size: 42px;
    line-height: 56px;
  }

  @include rwd-min('pc') {
    margin-bottom: 32px;
  }
}

// pc 稿標題單行 → 把 pad／mob 的斷行收掉。
.highlights__heading-break {
  @include rwd-min('pc') {
    display: none;
  }
}

.highlights__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 每列：mob／pad 直排（照片上、文字下），pc 轉橫排（照片左、文字右）。
// ⚠️ .highlights__item 是設計線的 optional 錨點（見 forum-node-path.ts 的 HL_ITEM），
//    class 名不可改。
.highlights__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  & + & {
    margin-top: 60px;
  }

  @include rwd-min('tablet') {
    & + & {
      margin-top: 48px;
    }
  }

  @include rwd-min('pc') {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 32px;

    & + & {
      margin-top: 32px;
    }
  }
}

// UPic 的外層是 <picture class="u-pic">，它才是 flex item，故寬度要掛在它身上；
// 只設內層 <img> 會讓 picture 自行伸縮而跑版（<ForumEvent> 有同一坑的紀錄）。
// mob 稿照片滿欄（362 ＝ 414 − 26×2）、pad 稿 340 置中、pc 稿 363。
.highlights__item :deep(.u-pic) {
  display: block;
  width: 100%;

  @include rwd-min('tablet') {
    width: 340px;
  }

  @include rwd-min('pc') {
    flex: 0 0 363px;
    width: 363px;
  }
}

// UPic 把 classname 掛在內層 <img>，scoped 選不到，故用 :deep。
// 三份稿的照片都是 3:2（363×242／340×227／362×241），故只留 aspect-ratio 不寫死高度。
:deep(.highlights__thumb) {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

// 縮圖佔位：尺寸同實圖，虛線語彙同 <ForumEvent> 的講者照片 placeholder。
.highlights__thumb-slot {
  width: 100%;
  aspect-ratio: 3 / 2;
  border: 1px dashed var(--accent);

  @include rwd-min('tablet') {
    width: 340px;
  }

  @include rwd-min('pc') {
    flex: 0 0 363px;
    width: 363px;
  }
}

// 文字欄：內容靠右收（CTA 貼右緣是三份稿的共通點），標題／內文自己再撐滿寬度。
.highlights__detail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
  min-width: 0;

  @include rwd-min('tablet') {
    gap: 8px;
  }

  @include rwd-min('pc') {
    flex: 0 0 494px;
    gap: 4px;
    width: 494px;
  }
}

// 標題：mob_H4 22/36 靠左；pad 稿改 pc_H4 28/46 置中；pc 稿同字級但回到靠左。
.highlights__title {
  width: 100%;
  margin: 0;
  font-size: 22px;
  font-weight: 400;
  line-height: 36px;

  @include rwd-min('tablet') {
    font-size: 28px;
    line-height: 46px;
    text-align: center;
  }

  @include rwd-min('pc') {
    text-align: left;
  }
}

// 內文：P 18/36 Light，稿的灰是 #686868 ＠80%（＝ .sec2 的 --color-gray 加透明度），
// 不是 --color-gray-light。
.highlights__excerpt {
  width: 100%;
  margin: 0;
  color: inherit;
  opacity: 0.8;
  font-size: var(--text-body);
  font-weight: 300;
  line-height: var(--text-body--line-height);
  text-align: justify;
}

// 「閱讀完整報導」＋箭頭圓鈕：三份稿都貼在文字欄右下。
// tracking 三個斷點都是 0.1em（1.6/16、1.3/13）。
.highlights__cta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.1em;
  text-decoration: none;

  @include rwd-min('tablet') {
    gap: 12px;
  }

  @include rwd-min('pc') {
    gap: 8px;
    font-size: 13px;
    font-weight: 300;
  }
}

// 只有文字是 80%，圓鈕維持全不透明（同稿）。
.highlights__cta-label {
  opacity: 0.8;
}

// 箭頭圓鈕：mob 60、pad 54、pc 44（Figma buttons/Arrow right-circle）。
// hover 比照 <MediaList>：灰色線框態／橘底 hover 態各佔一層 pseudo-element 交叉淡入，
// pad 以上再外加 scale(1.45) 放大 —— hover 素材是雙色（橘底＋白箭頭），mask 上色做不出來，
// 只能整張當 background 圖；灰色態素材單色，維持 mask 上色。
// mask 不能掛在本體上，否則 ::after 的橘圓會被裁成箭頭形。
// scale 走合成器、不佔版面，列高與右緣對齊全程不動。
.highlights__arrow {
  position: relative;
  display: block;
  width: 60px;
  height: 60px;
  transition: transform 0.25s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transition: opacity 0.25s ease;
  }

  &::before {
    background: var(--color-gray);
    mask: url('../../assets/img/udn75_arrow_circle.svg') no-repeat center / contain;
    -webkit-mask: url('../../assets/img/udn75_arrow_circle.svg') no-repeat center / contain;
  }

  &::after {
    background: url('../../assets/img/udn75_arrow_circle_hover.svg') no-repeat center /
      contain;
    opacity: 0;
  }

  // mob 不放大：那是觸控裝置，hover 只會在點下去之後殘留一下，放大反而突兀
  // （圓鈕本身已是 60，比 pad／pc 大）。橘底的交叉淡入三個斷點都留著。
  .highlights__cta:hover & {
    &::before {
      opacity: 0;
    }

    &::after {
      opacity: 1;
    }

    @include rwd-min('tablet') {
      transform: scale(1.45);
    }
  }

  @include rwd-min('tablet') {
    width: 54px;
    height: 54px;
  }

  @include rwd-min('pc') {
    width: 44px;
    height: 44px;
  }
}
</style>
