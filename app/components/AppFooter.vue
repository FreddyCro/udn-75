<script setup lang="ts">
import {
  NmdAuthor,
  NmdFooter,
  NmdShare,
  NmdToTop,
} from '@udn-digital-center/common-components';
import { shareURL_fb, shareURL_line, shareURL_twitter } from '@/utils/share';
import strFooter from '@/locales/footer.json';

const CURRENT_YEAR = new Date().getFullYear();
</script>

<template>
  <div id="editor" class="app-footer">
    <div class="app-footer__info">
      <NmdAuthor>
        <template #統籌製作>{{ strFooter.editor1 }}</template>
        <template #採訪撰稿>{{ strFooter.editor2 }}</template>
        <template #視覺設計>{{ strFooter.editor3 }}</template>
        <template #插畫>{{ strFooter.editor4 }}</template>
        <template #工程>{{ strFooter.editor5 }}</template>
        <template #監製>{{ strFooter.editor6 }}</template>
        <template #製作單位>{{ strFooter.editor7 }}</template>
        <template #上線日期>{{ strFooter.editor8 }}</template>
      </NmdAuthor>
      <ClientOnly>
        <NmdShare
          :facebook="{ href: shareURL_fb }"
          :line="{ href: shareURL_line, target: '_blank' }"
          :twitter="{ href: shareURL_twitter }"
          twitter-icon="x"
        />
      </ClientOnly>
    </div>
    <NmdToTop />
    <NmdFooter :year="CURRENT_YEAR" />
  </div>
</template>

<style lang="scss">
.app-footer {
  &__info {
    padding: 80px 0;
    background-color: #f1f1f1;
  }
}
</style>
