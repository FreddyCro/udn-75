<script lang="ts" setup>
import content from '~/locales/news.json';

definePageMeta({ layout: 'subpage' });
</script>

<template>
  <Subpage :content="content" />
</template>

<style></style>
