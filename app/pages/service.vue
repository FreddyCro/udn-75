<script lang="ts" setup>
import type { SubpageContent } from '~/components/05.subpage/Subpage.vue';
import raw from '~/locales/service.json';

definePageMeta({ layout: 'subpage' });

// JSON import 會把 variant: "gold" 寬化成 string，斷言回 SubpageContent
const content = raw as SubpageContent;
</script>

<template>
  <Subpage :content="content" />
</template>

<style></style>
