<script setup lang="ts">
// 永續祝福的夥伴清單面板（Figma 永續祝福04：
// pc 2065:140521 / pad 2065:125593 / mob 2065:121897）。
//
// 白底面板、內部垂直捲動、自訂捲軸（軌 #bcbcbc / 把手 #686868、寬 8）。
// 列的排列：pc / pad 是「logo 左 ＋ 語錄右對齊」，mob 改成「logo 上 / 語錄下」並置中。
//
// 🚧 各夥伴的正式 logo 檔尚未提供 —— section3.json 的 logo 欄位目前一律指向同一支
//    udn75_logo03_01.svg（設計稿原生尺寸 232×64，與 pc 的 logo 框等寬高）。
//    檔案到齊後只要逐列改 JSON 的 logo 路徑即可，元件不需再動。
import str from '@/locales/section3.json';

const assetUrl = useAssetUrl();

const { partner } = str;
</script>

<template>
  <div
    class="blessing-partners"
    tabindex="0"
    role="group"
    aria-label="夥伴祝福名單，可捲動"
  >
    <ul class="blessing-partners__list">
      <template v-for="(tier, tierIndex) in partner.tiers" :key="tierIndex">
        <li class="blessing-partners__tier">{{ tier.label }}</li>
        <li
          v-for="(item, i) in tier.partners"
          :key="`${tierIndex}-${i}`"
          class="blessing-partners__row"
        >
          <!-- 外框尺寸固定為設計稿的 logo 框，圖以 contain 內縮，換不同比例的 logo 也不變形 -->
          <img
            class="blessing-partners__logo"
            :src="assetUrl(item.logo)"
            :alt="item.name"
            loading="lazy"
          />

          <div class="blessing-partners__text">
            <p class="blessing-partners__quote">「{{ item.quote }}」</p>
            <p class="blessing-partners__name">—{{ item.name }}</p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.blessing-partners {
  width: 100%;
  max-width: 1064px;
  height: 600px;
  margin: 0 auto;
  // overflow-y 為 auto 時，overflow-x 的 clip 計算值會被降級為 hidden（CSS Overflow L3），
  // 故直接寫 hidden，避免誤導成「clip 可避免建立捲動容器」。
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;

  // 自訂捲軸（設計稿：寬 8、軌 #bcbcbc、把手 #686868）
  scrollbar-color: var(--color-gray) #bcbcbc;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #bcbcbc;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray);
  }

  // 純鍵盤使用者需要能把焦點移進面板才能用方向鍵捲動（WCAG 2.1.1）
  &:focus-visible {
    outline: 2px solid var(--color-orange);
    outline-offset: 2px;
  }

  @include rwd-max('pc') {
    max-width: 639px;
    height: 830px;
  }

  @include rwd-max('tablet') {
    max-width: none;
    height: 600px;
  }
}

.blessing-partners__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.blessing-partners__tier {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 8px 10px;
  font-size: var(--text-h5); // 20 / 32
  line-height: var(--text-h5--line-height);
  letter-spacing: 4px;
  color: var(--color-gray-light);
  border-top: 1px solid var(--color-line);

  @include rwd-max('tablet') {
    justify-content: center;
    font-size: var(--text-body); // 18 / 32
    line-height: 32px;
    letter-spacing: 3.6px;
    color: var(--color-gray);
  }
}

.blessing-partners__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 137px;
  min-height: 98px;
  padding: 8px 32px;
  border-bottom: 1px solid var(--color-line);

  @include rwd-max('pc') {
    gap: 12px;
    padding: 8px 0;
  }

  @include rwd-max('tablet') {
    flex-direction: column;
    gap: 4px;
    padding: 8px 4px;
    border-top: 1px solid var(--color-line);
    border-bottom: 0;
  }
}

.blessing-partners__logo {
  display: block;
  flex-shrink: 0;
  width: 232px;
  height: 64px;
  object-fit: contain;

  @include rwd-max('pc') {
    width: 160px;
    height: 45px;
  }

  @include rwd-max('tablet') {
    width: 180px;
    height: 51px;
  }
}

.blessing-partners__text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  width: 588px;
  text-align: right;

  @include rwd-max('pc') {
    width: 440px;
  }

  @include rwd-max('tablet') {
    align-items: center;
    width: 100%;
    text-align: center;
  }
}

.blessing-partners__quote {
  margin: 0;
  font-size: 28px;
  font-weight: 300;
  line-height: 46px;
  color: var(--color-gray);

  @include rwd-max('pc') {
    font-size: 24px;
    line-height: 38px;
    color: var(--color-body);
  }

  @include rwd-max('tablet') {
    font-size: 17px;
    line-height: 28px;
  }
}

.blessing-partners__name {
  margin: 0;
  font-size: var(--text-body); // 18 / 36
  font-weight: 300;
  line-height: var(--text-body--line-height);
  color: #808080; // 設計稿 Figma 的 black/B4 色，專案 token 表已無對應變數故寫字面值

  @include rwd-max('tablet') {
    font-size: var(--text-caption); // 15 / 24
    line-height: 24px;
  }
}
</style>
