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
//
// url／quote 皆可為空字串（客戶尚未提供）：空 url 該列就渲染成 <div> 而非 <a>，
// 空 quote 整行不輸出——否則會印出一組空的「」引號。欄位一律保留而不省略，
// 是為了讓 JSON 的每一列型別一致（TS 從 JSON import 推型別，缺欄位會讓 item.url 報錯）。
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
          class="blessing-partners__item"
        >
          <!-- 版面（flex／內距／分隔線）掛在內層而非 <li>：有官網的夥伴整列要可點，
               <a> 得自己當 flex 容器；沒官網的退回 <div>，兩者版面完全一致。 -->
          <component
            :is="item.url ? 'a' : 'div'"
            class="blessing-partners__row"
            :href="item.url || undefined"
            :target="item.url ? '_blank' : undefined"
            :rel="item.url ? 'noopener' : undefined"
          >
            <!-- 外框尺寸固定為設計稿的 logo 框，圖以 contain 內縮，換不同比例的 logo 也不變形 -->
            <img
              class="blessing-partners__logo"
              :src="assetUrl(item.logo)"
              :alt="item.name"
              loading="lazy"
            />

            <div class="blessing-partners__text">
              <p v-if="item.quote" class="blessing-partners__quote">
                「{{ item.quote }}」
              </p>
              <!-- 名字前面那個破折號是**歸屬記號**，不是名字的一部分，且逐斷點不同
                   （pc／pad 有、mob 沒有）→ 由 CSS 出，見 __name 的 ::before。 -->
              <p class="blessing-partners__name">{{ item.name }}</p>
            </div>
          </component>
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
  // pc／pad 的列只畫 border-bottom，分組標題與該組第一列之間沒人畫線，
  // 所以下緣線由 tier 自己補（設計稿標題上下各一條）。
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);

  // 第二組以後，上緣線已由前一列的 border-bottom 畫過，再留 border-top 會疊成 2px。
  &:not(:first-child) {
    border-top: 0;

    // mob 的列改用 border-top、不畫 border-bottom，分組上緣線得由 tier 自己負責。
    @include rwd-max('tablet') {
      border-top: 1px solid var(--color-line);
    }
  }

  @include rwd-max('tablet') {
    justify-content: center;
    font-size: var(--text-body); // 18 / 32
    line-height: 32px;
    letter-spacing: 3.6px;
    color: var(--color-gray);
    // 下緣線改由該組第一列的 border-top 提供，這裡再畫就重複了
    border-bottom: 0;
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
  color: inherit;
  text-decoration: none;

  // hover 的回饋只有 logo 放大（見 __logo），文字一律維持原色不變。
  // 鍵盤操作的可視焦點由下面的 outline 負責。

  // outline-offset 收成負值：列與列之間沒有間隙，外擴的框會被上下兩列的邊線切到
  &[href]:focus-visible {
    outline: 2px solid var(--color-orange);
    outline-offset: -2px;
  }

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
  transition: transform 0.3s ease;

  // 滑過整列就放大 logo。與 __name 變橘那條不同，這裡不限定 [href] ——
  // 沒官網的列（<div>）一樣要有回饋。
  .blessing-partners__item:hover & {
    transform: scale(1.2);
  }

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

  // 歸屬記號（「語錄」— 企業名）。**pc／pad 有、mob 沒有**：
  //   pc  2065:140521 ／ pad 2065:125593 — 都是「—台新新光金控」
  //   mob 3511:46714              — 三列都是純企業名，沒有破折號
  // 由 CSS 出而不是寫進 template：它逐斷點存在與否不同，那是排版的事
  //（同 __row 換方向、__text 改置中都在這份 SCSS 裡）；寫成文字節點就得靠 JS 量斷點。
  // 也不是文案 —— 與 __quote 的「」同一類，是版面上的標點，不進 locales。
  &::before {
    content: '—';

    @include rwd-max('tablet') {
      content: none;
    }
  }

  @include rwd-max('tablet') {
    font-size: var(--text-caption); // 15 / 24
    line-height: 24px;
  }
}
</style>
