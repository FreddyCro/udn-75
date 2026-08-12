<!--
  論壇區塊的「一行」展示型文字。

  稿上 outline 過的行給物件（走 SVG 素材），其餘給字串（走活文字，與改動前完全相同）。
  為什麼逐行成檔、為什麼行盒高度必須保留、為什麼寬度掛在 span 而不是 img，
  全部寫在 architecture/2026-08-12-forum1-text-art-design.md —— 改這支之前先讀那份。

  ⚠️ 素材**逐斷點各一份**（三個斷點的稿是不同的 SVG，不是等比縮放）。
     目前只有 pc 有素材，pad／mob 退回活文字。要加斷點就是：資料多一筆 ＋ 下方
     SCSS 的對應 media 區塊填上，兩處都做才會生效。

  ⚠️ 消費端要在祖先掛**無單位**的 --art-base（＝該組在該斷點的字級，見 ForumEvent.vue）。
     沒掛的話 calc() 整式無效、素材寬塌成 0（fail-loud，看得出來）。
-->
<script setup lang="ts">
import type { ForumLine, ForumTextArt } from '~/types/forum';
import type { ForumBp } from '~/utils/forum-path-events';

const props = defineProps<{ line: ForumLine }>();

// 物件才是素材；字串一律當活文字。
const art = computed<ForumTextArt | null>(() =>
  typeof props.line === 'string' ? null : props.line,
);

/** 畫面上（或 visually-hidden）的真文字 —— 兩種形式都只有這一份，不做第二份 SR 複本 */
const text = computed(() => (typeof props.line === 'string' ? props.line : props.line.text));

/** 有素材的斷點；空陣列＝純活文字 */
const artBps = computed(() => Object.keys(art.value?.art ?? {}) as ForumBp[]);

// 每個有素材的斷點掛一個 class 與一個寬度變數，讓 SCSS 的對應 media 區塊接手。
const artClasses = computed(() => artBps.value.map((bp) => `forum-art-line--art-${bp}`));
const artVars = computed(() =>
  Object.fromEntries(
    Object.entries(art.value?.art ?? {}).map(([bp, src]) => [`--art-w-${bp}`, src.w]),
  ),
);
</script>

<template>
  <span class="forum-art-line" :class="artClasses" :style="artVars">
    <!-- 真文字只有這一份：素材斷點下由 SCSS 轉成 visually-hidden（仍在無障礙樹與 SEO 內），
         沒有素材的斷點就是畫面上的字。不做第二份 SR 複本 —— 那會在活文字斷點被唸兩次。 -->
    <span class="forum-art-line__text">{{ text }}</span>
    <!-- 素材是純裝飾（真文字已在上面）→ alt=""。 -->
    <img
      v-for="(src, bp) in art?.art ?? {}"
      :key="bp"
      class="forum-art-line__art"
      :class="`forum-art-line__art--${bp}`"
      :src="src.src"
      :width="src.w"
      :height="src.h"
      alt=""
    />
  </span>
</template>

<style lang="scss" scoped>
// 純活文字（沒有任何 --art-* modifier）**刻意沒有任何規則** ——
// 論壇二三四要跟改動前完全一樣，多一條都是回歸風險。

// 素材斷點下的行盒與素材定位。逐斷點重複三次，故收成 mixin。
//
// ⚠️ ::before 的 ZWSP 只能在**素材斷點內**生效：活文字若吃到它，會連帶吃到
//    letter-spacing（大標 0.02em）→ 整行文字往右位移約 1.5px，靜默偏掉。
// ⚠️ 寬度掛在 span 上而不是只掛 img：img 絕對定位、不進流排版，只掛 img 的話
//    行盒寬只剩 ZWSP 那一點 —— pc 的 .forum-event__head（絕對定位、shrink-to-fit）
//    會跟著塌掉，右對齊的版位（第二批的英文引言）就會跑版。
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

  .forum-art-line__art--#{$bp} {
    // 垂直置中即對稿：活文字的字面上緣偏移 15.17、置中是 14.31，差 0.86px，
    // 不值得為此引入一組逐行的垂直常數（推導見設計文件第四節）。
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: auto;
    transform: translateY(-50%);
  }
}

// 預設全部藏起來：某個斷點有資料卻還沒補下方的 media 區塊時，
// 失敗方向是「素材不顯示、活文字照常」，而不是一張沒定位的圖壓在版面上。
.forum-art-line__art {
  display: none;
}

// pc（≥1280）：目前唯一有素材的斷點。
.forum-art-line--art-pc {
  @include rwd-min('pc') {
    @include art-active('pc');
  }
}

// pad（768–1279）：素材尚未匯出，這一段先備位。
// 巢狀兩個 mixin 會編成 (min-width: 768px) and (max-width: 1279px)。
.forum-art-line--art-pad {
  @include rwd-min('tablet') {
    @include rwd-max('pc') {
      @include art-active('pad');
    }
  }
}

// mob（<768）：素材尚未匯出，這一段先備位。
.forum-art-line--art-mob {
  @include rwd-max('tablet') {
    @include art-active('mob');
  }
}
</style>
