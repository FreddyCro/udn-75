<!--
  一行展示型文字：稿上 outline 過的行給物件（走 SVG 素材），其餘給字串（走活文字）。

  跨 section 共用，故住在 ui/：目前的消費端是論壇段（大標／副標／引言／日期／地點／
  講者姓名，見 02.forum/ForumEvent.vue 與 Forum.vue）與永續祝福的標題
  （03.blessing/Blessing.vue）。原本叫 ForumArtLine、住在 02.forum/ ——
  第二個 section 接上來之後名字就騙人了，故改名搬家。

  為什麼逐行成檔、為什麼行盒高度必須保留、素材怎麼定位，
  全部寫在 architecture/2026-08-12-forum1-text-art-design.md —— 改這支之前先讀那份。

  ⚠️ 素材**逐斷點各一份**（三個斷點的稿是不同的 SVG，不是等比縮放）。
     沒填的斷點退回活文字。要加斷點就是：資料多一筆 ＋ 下方 SCSS 的對應 media
     區塊填上，兩處都做才會生效。

  ⚠️ 素材走 sprite 的 `<svg><use>`，斷點由 client 端決定、只抓當下斷點那一支 sprite
     （見 utils/art-sprite.ts）。不要改回 `<img>`：那會讓三個斷點的素材全部下載。

  ⚠️ 消費端要在祖先掛**無單位**的 --art-base（＝該組在該斷點的字級，見 ForumEvent.vue
     的各群組與 Blessing.vue 的 .section3__title）。
     沒掛的話 calc() 整式無效、素材寬塌成 0（fail-loud，看得出來）。
-->
<script setup lang="ts">
// ⚠️ 型別還留在 ~/types/forum：ForumLine／ForumTextArt 與它們依賴的 ForumBp
//    （在 ~/utils/forum-path-events）都是論壇段先定義的。把那三個一起改成中性名稱
//    會擴散到 forum.ts、ForumEvent.vue 與 spec，屬於另一次改名，本次刻意不做。
import type { ForumLine, ForumTextArt } from '~/types/forum';
import { artSpriteHref } from '~/utils/art-sprite';

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
  Object.keys(art.value?.art ?? {}).map((bp) => `u-art-line--art-${bp}`),
);

/**
 * 逐斷點的 CSS 變數：原生寬、原生高。行盒幾何（寬、::before 的 ZWSP）與掛載前後
 * 完全不變，靠的就是這組變數 SSR 就照樣輸出 —— 換成 sprite 之後不再需要 --art-url-*
 * （素材本體改由下方的 <svg><use> 負責，路徑走 spriteHref）。
 */
const artVars = computed(() =>
  Object.fromEntries(
    Object.entries(art.value?.art ?? {}).flatMap(([bp, src]) => [
      [`--art-w-${bp}`, src.w],
      [`--art-h-${bp}`, src.h],
    ]),
  ),
);

// 素材改走 sprite（見 art-sprite.ts）。斷點只有 client 知道 → SSR 不渲染 <svg>，
// 但 artClasses 照樣輸出：行盒幾何（寬、::before 的 ZWSP、真文字 visually-hidden）
// 全部由 SCSS 撐住，ScrollTrigger 量到的高度在掛載前後不變；掛載後只是把圖補進去。
// 這些行都在摺線下 5,000 px 以外，補上的那一瞬間看不到。
const bp = useArtBreakpoint();
const spriteHref = computed(() => {
  const current = bp.value;
  const src = current ? art.value?.art[current] : undefined;
  return current && src ? artSpriteHref(src.src, current, assetUrl) : null;
});
const spriteViewBox = computed(() => {
  const current = bp.value;
  const src = current ? art.value?.art[current] : undefined;
  return src ? `0 0 ${src.w} ${src.h}` : undefined;
});
</script>

<template>
  <span class="u-art-line" :class="artClasses" :style="artVars">
    <!-- 真文字只有這一份：素材斷點下由 SCSS 轉成 visually-hidden（仍在無障礙樹與 SEO 內），
         沒有素材的斷點就是畫面上的字。不做第二份 SR 複本 —— 那會在活文字斷點被唸兩次。 -->
    <span class="u-art-line__text">{{ text }}</span>
    <!-- 素材本體：sprite 內的 symbol。SSR 不渲染（斷點未知），掛載後補上。
         位置與尺寸由 SCSS 的 .u-art-line__svg 給（＝原本 ::after 的那組規則）。 -->
    <svg
      v-if="spriteHref"
      class="u-art-line__svg"
      :viewBox="spriteViewBox"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <use :href="spriteHref" />
    </svg>
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

  // 素材原生寬常常正好等於稿的滿欄寬（論壇一 mob 大標 362 ＝ 414 − 26×2），
  // 而實作的容器會被捲軸吃掉、窄機更小 → 沒有上限就會撐出內容欄。
  // 實測 414 視窗：容器 398.7、內容欄 346.7，大標 362 溢出 15.3；375 機溢出 54。
  max-width: 100%;

  // 撐出一個正好 = line-height 的行盒。
  // ⚠️ 這一行是整套機制的支點：少了它行盒塌成 0，.forum-event__title 的高度變 0，
  //    設計線的 W3／Q3／T1 全部偏掉（見 architecture/forum-node-path.md）。
  &::before {
    content: '\200B';
  }

  // 素材本體（原本是 ::after 的 background，改成 <svg><use> 後規則照搬）。
  // preserveAspectRatio="none" ＋ 盒子的寬高比恆等於素材原生比例 ⇒ 等價 background-size 100% 100%。
  //
  // 垂直置中即對稿：活文字的字面上緣偏移 15.17、置中是 14.31，差 0.86px，
  // 不值得為此引入一組逐行的垂直常數（推導見設計文件第四節）。
  //
  // ⚠️ 高度走 aspect-ratio 而非 `--art-h / --art-base * 1em`，是為了讓上面那個
  //    max-width 夾住寬度時高度跟著等比縮（寫死高度會壓扁素材）。
  //    沒被夾住時兩者**完全等值**：(W/base em) × (H/W) ＝ H/base em，故是零回歸的改法。
  .u-art-line__svg {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    aspect-ratio: var(--art-w-#{$bp}) / var(--art-h-#{$bp});
    transform: translateY(-50%);
  }

  // 真文字退場但留在無障礙樹與 SEO 裡（＝ base.scss 的 .visually-hidden，
  // 這裡不能 @extend：跨檔 ＋ scoped，故照抄那六條）。
  .u-art-line__text {
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
.u-art-line--art-pc {
  @include rwd-min('pc') {
    @include art-active('pc');
  }
}

// pad（768–1279）。巢狀兩個 mixin 會編成 (min-width: 768px) and (max-width: 1279px)。
.u-art-line--art-pad {
  @include rwd-min('tablet') {
    @include rwd-max('pc') {
      @include art-active('pad');
    }
  }
}

// mob（<768）
.u-art-line--art-mob {
  @include rwd-max('tablet') {
    @include art-active('mob');
  }
}
</style>
