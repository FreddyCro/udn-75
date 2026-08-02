<script lang="ts" setup>
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import raw from '~/locales/data.json';

definePageMeta({ layout: 'subpage' });

// JSON import 會把字面值寬化成 string，須斷言回 SubpageContent
const content = raw as SubpageContent;
</script>

<template>
  <Subpage :content="content" />
</template>

<style></style>
