<script setup lang="ts">
// 永續祝福的夥伴清單面板（Figma 祝福詞0824：
// pc 3450:107574 / pad 3511:34196 / mob 3451:112446）。
//
// 白底面板、內部垂直捲動、自訂捲軸（軌 #bcbcbc / 把手 #686868、寬 8）。
// 列的排列：pc / pad 是「logo 左 ＋ 語錄右對齊」，mob 改成「logo 上 / 語錄下」，
// 文字框置中但**框內**語錄靠左、企業名置中（見 __text / __name 的 tablet 段）。
//
// logo 放 public/img/blessing/partner-*.svg，一律是設計稿的 232×64 框（2026-09-06 之前
// 紳裝那張稿上是 232×80，靠 __logo 的 object-fit: contain 等比縮進 64 的框；換新版 logo
// 之後全部統一成 232×64，contain 仍留著當防護）。含點陣圖、或路徑
// 太碎以致 SVG 反而比點陣大的那 7 張（dijing／fuyuland／just／ctbc／tcbbank／ypu／darmo）
// 改存 .png，尺寸取 4 倍（928×256）以應付高解析螢幕。
// ⚠️ yungtay 原本也在這一列，2026-09-06 換上設計師的新版 .svg 後移出——但那支是「JPEG 包
//    一層 SVG 外殼」（紅底是 5928×3335 的內嵌 JPEG，只有白字是向量），進 sprite 讓
//    partners.svg 從 553 KB 長到 771 KB。換來的是少一個 request 與白字在高解析下的銳利度。
//    若日後拿得到純向量版（紅底其實只是帶斜向漸層的矩形），換掉可直接省回這 217 KB。
//
// url／quote 皆可為空字串（客戶尚未提供）：空 url 該列就渲染成 <div> 而非 <a>，
// 空 quote 整行不輸出——空的 <p> 會佔掉一行行高、把該列撐高。這兩欄一律保留而不省略。
//
// ⚠️ 2026-09-06 之前這條「欄位一律保留」的理由是「TS 從 JSON import 推型別，缺欄位會讓
//    item.url 報錯」。那個理由現在由下面的 Partner 型別承擔了：**只有部分列會有的例外欄位
//    （quoteBreak／logoScale）宣告成 optional 即可，不必為了型別去補 52 筆空值**。
//    必填欄位仍然一列都不能少——少了型別對不上，一樣會炸。
import str from '@/locales/section3.json';
import { gaClickButton } from '~/utils/tracking-event';
import { isSvgPath, spriteSymbolId } from '~/utils/svg-sprite-ref';

// near：父層（Blessing.vue）用文件流內的軌道量出「清單一屏內」才翻 true。
// false 時不渲染任何圖（連 <img> 也不渲染），避免 pin 的 fixed 瞬間把整份清單抓下來。
defineProps<{ near: boolean }>();

const assetUrl = useAssetUrl();

/**
 * 一列夥伴。必填欄位是 JSON 每一列都有的；後兩個是**逐筆的例外開關**，只有稿上有特別
 * 要求的那幾筆才寫，其餘省略：
 *   quoteBreak: 'mob' — 語錄裡的 <br/> 只在 mob 生效（目前只有中租控股）
 *   logoScale        — logo 的靜止倍率，稿上要求放大的才給（目前只有寶璽建築機構 1.15）
 * 宣告成 optional 是為了讓 JSON 保持乾淨——沒有它，TS 會從 JSON 推出聯集型別，
 * 存取這兩欄就會報錯，只能反過來去補 52 筆空值。
 */
type Partner = {
  name: string;
  quote: string;
  logo: string;
  gaTerm: string;
  url: string;
  quoteBreak?: string;
  logoScale?: number;
};

const partner = str.partner as { tiers: { label: string; partners: Partner[] }[] };

// 每列企業祝福詞的 hover／click 音效。useSfx() 一定要在 setup 期間取（它此刻要讀
// runtimeConfig，見 useSfx.ts）；音效池由 app.vue 的 <AppSfx> 持有，開關關著時靜默。
const { play } = useSfx();

// 45 支 svg logo 合成一支 sprite（見 scripts/build-svg-sprites.mjs）：一個 request 取代 45 個。
// 8 支 png logo 不進 sprite，維持 <img>。
// ⚠️ 外部 <use href> 必須同源：四個部署目標的 APP_ASSETS_PATH 都與頁面同 host。
const SPRITE = assetUrl('/img/sprites/partners.svg');
const spriteHref = (logo: string) => `${SPRITE}#${spriteSymbolId(logo)}`;
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
        <!-- --logo-scale 掛在 <li>：logo 有三種渲染分支（sprite／png／佔位框），
             掛在祖先讓三者共用同一個值，不必逐分支重複 :style。 -->
        <li
          v-for="(item, i) in tier.partners"
          :key="`${tierIndex}-${i}`"
          class="blessing-partners__item"
          :style="item.logoScale ? { '--logo-scale': item.logoScale } : undefined"
        >
          <!-- 版面（flex／內距／分隔線）掛在內層而非 <li>：有官網的夥伴整列要可點，
               <a> 得自己當 flex 容器；沒官網的退回 <div>，兩者版面完全一致。 -->
          <component
            :is="item.url ? 'a' : 'div'"
            class="blessing-partners__row"
            :href="item.url || undefined"
            :target="item.url ? '_blank' : undefined"
            :rel="item.url ? 'noopener' : undefined"
            @mouseenter="play('sfx01Short')"
            @click="play('sfx01Short'); item.gaTerm && gaClickButton('partner', item.gaTerm)"
          >
            <!-- 外框尺寸固定為設計稿的 logo 框，圖以 contain 內縮，換不同比例的 logo 也不變形 -->
            <!-- 圖片載入閘：near 之前只放一個同尺寸的空框（版面不動），near 之後
                 svg logo 走 sprite（<use>，整份清單共 1 個 request）、png 走 <img>。 -->
            <svg
              v-if="near && isSvgPath(item.logo)"
              class="blessing-partners__logo"
              role="img"
              :aria-label="item.name"
            >
              <use :href="spriteHref(item.logo)" />
            </svg>
            <img
              v-else-if="near"
              class="blessing-partners__logo"
              :src="assetUrl(item.logo)"
              :alt="item.name"
              loading="lazy"
            />
            <span v-else class="blessing-partners__logo" aria-hidden="true" />

            <div class="blessing-partners__text">
              <!-- 語錄的斷行是設計稿手動排的（不是自然折行），故由文案自己帶 <br/>、
                   以 v-html 輸出 —— 同 subpage 各頁 sp-p／AgendaReport cta 的既有慣例。
                   絕大多數的斷點位置三個斷點一致，故單一 <br/> 即可，不必逐斷點分文案。
                   例外走 quoteBreak：目前只有中租控股，稿上 mob 才斷、pc／pad 不斷 ——
                   文案照樣只寫一個 <br/>，由下面的 modifier 決定它在哪些斷點生效
                   （同 Subpage 的 introBreakFrom，開關放資料、不把 class 塞進文案）。 -->
              <p
                v-if="item.quote"
                class="blessing-partners__quote"
                :class="{ 'blessing-partners__quote--break-mob': item.quoteBreak === 'mob' }"
                v-html="item.quote"
              />
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
  // 逐筆的靜止倍率（資料的 logoScale，由 <li> 掛成 --logo-scale）。預設 1 ＝ 照原尺寸；
  // 稿上要求放大的那幾筆才不是 1（目前只有寶璽建築機構 1.15）。
  transform: scale(var(--logo-scale, 1));
  transition: transform 0.3s ease;

  // 滑過整列就放大 logo。與 __name 變橘那條不同，這裡不限定 [href] ——
  // 沒官網的列（<div>）一樣要有回饋。
  // ⚠️ 乘上 --logo-scale 而不是寫死 1.2：hover 的意義是「在自己的尺寸上再放大一個檔次」，
  //    寫死會讓有放大倍率的那筆 hover 時反而縮回去（1.15 → 1.2 幾乎沒動）。
  .blessing-partners__item:hover & {
    transform: scale(calc(var(--logo-scale, 1) * 1.2));
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

  // mob（3451:112446）的語錄與企業名是兩個**等寬 210 的文字框**，靠 __row 的
  // align-items: center 置中，框內兩者都置中（稿上兩個 <p> 都是 text-center w-210）。
  // 故這裡是 stretch（讓兩個框都撐滿 210）而非 center（那會 shrink-to-fit）——
  // 兩個框等寬，短的企業名才會跟語錄共用同一條中軸線。
  //
  // 210 是稿寬：稿子畫在 414 的框上，列寬 310 扣掉左右各 50。用 max-width 夾住而不
  // 寫死 width —— 窄機（375／360／320）的列內容寬分別是 271／256／216，都還大於 210，
  // 所以夾住就夠，不必再按視窗縮（同 .section3__title-art 那條的顧慮）。
  @include rwd-max('tablet') {
    align-items: stretch;
    width: 100%;
    max-width: 210px;
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

  // 只有 mob 斷行的那幾筆（資料的 quoteBreak: 'mob'）：文案裡的 <br/> 在 ≥768 收掉，
  // 兩段接回同一行、交給瀏覽器自然折 —— 與 Agenda 的 __title-break 同一套做法，方向相反。
  // 需要 :deep()：語錄走 v-html，那個 <br> 拿不到 scoped 的屬性選擇器。
  &--break-mob {
    @include rwd-min('tablet') {
      :deep(br) {
        display: none;
      }
    }
  }
}

.blessing-partners__name {
  margin: 0;
  font-size: var(--text-body); // 18 / 36
  font-weight: 300;
  line-height: var(--text-body--line-height);
  color: #808080; // 設計稿 Figma 的 black/B4 色，專案 token 表已無對應變數故寫字面值

  // 歸屬記號（「語錄」— 企業名）。**pc／pad 有、mob 沒有**：
  //   pc  3450:107574 ／ pad 3511:34196 — 都是「—台新新光金控」
  //   mob 3451:112446             — 全列都是純企業名，沒有破折號
  // 由 CSS 出而不是寫進 template：它逐斷點存在與否不同，那是排版的事
  //（同 __row 換方向、__text 換對齊都在這份 SCSS 裡）；寫成文字節點就得靠 JS 量斷點。
  // 也不是文案 —— 它是版面上的標點，不進 locales。
  &::before {
    content: '—';

    @include rwd-max('tablet') {
      content: none;
    }
  }

  // 置中不必在這裡再寫一次 —— 已由 __text 的 tablet 段一起給（語錄、企業名同樣置中）。
  @include rwd-max('tablet') {
    font-size: var(--text-caption); // 15 / 24
    line-height: 24px;
  }
}
</style>
