<!--
  一行展示型文字（稿上 outline 過的就吃 SVG 素材，其餘走活文字）。

  ⚠️ **名字騙人：它已經不只論壇在用。** Section 3 的「永續祝福」標題也是這一支
     （見 03.blessing/Blessing.vue）。之所以還放在 02.forum/、還叫 ForumArtLine，
     是因為改名要動三十幾處註解引用與兩份設計文件，值得單獨一個 commit 做，
     不該混在功能改動裡。要改的話：檔案搬到 components/ui/、class 前綴
     forum-art-line → u-art-line，消費端只有 Forum.vue／ForumEvent.vue／Blessing.vue。

  稿上 outline 過的行給物件（走 SVG 素材），其餘給字串（走活文字，與改動前完全相同）。
  為什麼逐行成檔、為什麼行盒高度必須保留、素材怎麼定位，
  全部寫在 architecture/2026-08-12-forum1-text-art-design.md —— 改這支之前先讀那份。

  ⚠️ 素材**逐斷點各一份**（三個斷點的稿是不同的 SVG，不是等比縮放）。
     沒填的斷點退回活文字。要加斷點就是：資料多一筆 ＋ 下方 SCSS 的對應 media
     區塊填上，兩處都做才會生效。

  ⚠️ 素材是 CSS **背景**，不是 <img>。這一點不是風格選擇，是必須的：
     <img> 版本會讓瀏覽器把三個斷點的素材**全部**抓下來（display: none 照樣抓，
     實測每個斷點都請求 46 個檔、pc 共 968 KB，其中 617 KB 用不到）。
     背景圖只在符合的 media query 內被引用，因此只會抓到當下斷點那一份。

  ⚠️ 消費端要在祖先掛**無單位**的 --art-base（＝該組在該斷點的字級，見 ForumEvent.vue）。
     沒掛的話 calc() 整式無效、素材寬塌成 0（fail-loud，看得出來）。
-->
<script setup lang="ts">
import type { ForumLine, ForumTextArt } from '~/types/forum';

const props = defineProps<{ line: ForumLine }>();

// locales JSON 的路徑是「站台根目錄」寫法（/img/...），塞進 url() 前必須補上
// APP_ASSETS_PATH，否則子路徑部署（GitHub Pages 的 /udn-75/）會解析到 origin 根而 404。
const assetUrl = useAssetUrl();

// 物件才是素材；字串一律當活文字。
const art = computed<ForumTextArt | null>(() =>
  typeof props.line === 'string' ? null : props.line,
);

/** 畫面上（或 visually-hidden）的真文字 —— 只有這一份，不做第二份 SR 複本 */
const text = computed(() => (typeof props.line === 'string' ? props.line : props.line.text));

/** 每個有素材的斷點掛一個 class，讓 SCSS 的對應 media 區塊接手 */
const artClasses = computed(() =>
  Object.keys(art.value?.art ?? {}).map((bp) => `forum-art-line--art-${bp}`),
);

/**
 * 逐斷點的 CSS 變數：路徑、原生寬、原生高。
 * url() 寫在變數裡、只在對應 media query 內被引用 —— 未命中的斷點不會產生請求。
 */
const artVars = computed(() =>
  Object.fromEntries(
    Object.entries(art.value?.art ?? {}).flatMap(([bp, src]) => [
      [`--art-url-${bp}`, `url("${assetUrl(src.src)}")`],
      [`--art-w-${bp}`, src.w],
      [`--art-h-${bp}`, src.h],
    ]),
  ),
);
</script>

<template>
  <span class="forum-art-line" :class="artClasses" :style="artVars">
    <!-- 真文字只有這一份：素材斷點下由 SCSS 轉成 visually-hidden（仍在無障礙樹與 SEO 內），
         沒有素材的斷點就是畫面上的字。不做第二份 SR 複本 —— 那會在活文字斷點被唸兩次。 -->
    <span class="forum-art-line__text">{{ text }}</span>
  </span>
</template>

<style lang="scss" scoped>
// 純活文字（沒有任何 --art-* modifier）**刻意沒有任何規則** ——
// 論壇二三四要跟改動前完全一樣，多一條都是回歸風險。

// 素材斷點下的行盒與素材定位。逐斷點重複三次，故收成 mixin。
//
// ⚠️ ::before 的 ZWSP 只能在**素材斷點內**生效：活文字若吃到它，會連帶吃到
//    letter-spacing（大標 0.02em）→ 整行文字往右位移約 1.5px，靜默偏掉。
// ⚠️ 寬度掛在 span 上：::after 是絕對定位、不進流排版，行盒寬得由 span 自己給 ——
//    pc 的 .forum-event__head（絕對定位、shrink-to-fit）靠它才不會塌掉。
@mixin art-active($bp) {
  position: relative;
  display: block;
  width: calc(var(--art-w-#{$bp}) / var(--art-base) * 1em);

  // 撐出一個正好 = line-height 的行盒。
  // ⚠️ 這一行是整套機制的支點：少了它行盒塌成 0，.forum-event__title 的高度變 0，
  //    設計線的 W3／Q3／T1 全部偏掉（見 architecture/forum-node-path.md）。
  &::before {
    content: '\200B';
  }

  // 素材本體。垂直置中即對稿：活文字的字面上緣偏移 15.17、置中是 14.31，
  // 差 0.86px，不值得為此引入一組逐行的垂直常數（推導見設計文件第四節）。
  // background-size: 100% 100% 不會變形 —— 盒子的寬高都是素材原生尺寸 ÷ 同一個
  // --art-base，比例與素材一致。
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: calc(var(--art-h-#{$bp}) / var(--art-base) * 1em);
    background: var(--art-url-#{$bp}) no-repeat 0 0 / 100% 100%;
    transform: translateY(-50%);
  }

  // 真文字退場但留在無障礙樹與 SEO 裡（＝ base.scss 的 .visually-hidden，
  // 這裡不能 @extend：跨檔 ＋ scoped，故照抄那六條）。
  .forum-art-line__text {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
}

// pc（≥1280）
.forum-art-line--art-pc {
  @include rwd-min('pc') {
    @include art-active('pc');
  }
}

// pad（768–1279）。巢狀兩個 mixin 會編成 (min-width: 768px) and (max-width: 1279px)。
.forum-art-line--art-pad {
  @include rwd-min('tablet') {
    @include rwd-max('pc') {
      @include art-active('pad');
    }
  }
}

// mob（<768）
.forum-art-line--art-mob {
  @include rwd-max('tablet') {
    @include art-active('mob');
  }
}
</style>
