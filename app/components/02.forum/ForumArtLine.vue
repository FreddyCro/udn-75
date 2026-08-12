<!--
  論壇區塊的「一行」展示型文字。

  稿上 outline 過的行給物件（走 SVG 素材），其餘給字串（走活文字，與改動前完全相同）。
  為什麼逐行成檔、為什麼行盒高度必須保留、為什麼寬度掛在 span 而不是 img，
  全部寫在 architecture/2026-08-12-forum1-text-art-design.md —— 改這支之前先讀那份。

  ⚠️ 消費端要在祖先掛**無單位**的 --art-base（＝該組在 pc 稿的字級，見 ForumEvent.vue）。
     沒掛的話 calc() 整式無效、素材寬塌成 0（fail-loud，看得出來）。
-->
<script setup lang="ts">
import type { ForumLine, ForumTextArt } from '~/types/forum';

const props = defineProps<{ line: ForumLine }>();

// 物件才是素材；字串一律原樣輸出。
const art = computed<ForumTextArt | null>(() =>
  typeof props.line === 'string' ? null : props.line,
);
</script>

<template>
  <span
    class="forum-art-line"
    :class="{ 'forum-art-line--art': art }"
    :style="art ? { '--art-w': art.w } : undefined"
  >
    <template v-if="art">
      <!-- 真文字：視覺上隱藏，供 SEO 與螢幕閱讀器。
           img 因此是純裝飾 → alt=""（給 alt 會被唸兩次）。 -->
      <span class="visually-hidden">{{ art.text }}</span>
      <img
        class="forum-art-line__art"
        :src="art.art"
        :width="art.w"
        :height="art.h"
        alt=""
      />
    </template>
    <template v-else>{{ line }}</template>
  </span>
</template>

<style lang="scss" scoped>
// 活文字模式（.forum-art-line 本體）**刻意沒有任何規則** ——
// 論壇二三四要跟改動前完全一樣，多一條都是回歸風險。

// 素材模式。
// ⚠️ ::before 只能掛在這個 modifier 上，不能掛在 .forum-art-line 本體：
//    活文字模式若也吃到 ZWSP，它會連帶吃到 letter-spacing（大標 0.02em）
//    → 整行文字往右位移約 1.5px，論壇二三四全部靜默偏掉。
.forum-art-line--art {
  position: relative;
  display: block;
  // 寬度掛在 span 上而不是只掛 img：img 絕對定位、不進流排版，
  // 只掛 img 的話行盒寬只剩 ZWSP 那一點 —— pc 的 .forum-event__head
  // （絕對定位、shrink-to-fit）會跟著塌掉，第二批右對齊的英文引言就會跑版。
  width: calc(var(--art-w) / var(--art-base) * 1em);

  // 零寬空格撐出一個正好 = line-height 的行盒。
  // ⚠️ 這一行是整套機制的支點：少了它行盒塌成 0，.forum-event__title 的高度變 0，
  //    設計線的 W3／Q3／T1 全部偏掉（見 architecture/forum-node-path.md）。
  &::before {
    content: '\200B';
  }
}

// 垂直置中即對稿：活文字的字面上緣偏移 15.17、置中是 14.31，差 0.86px，
// 不值得為此引入一組逐行的垂直常數（推導見設計文件第四節）。
.forum-art-line__art {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: auto;
  transform: translateY(-50%);
}
</style>
