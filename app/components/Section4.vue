<script setup lang="ts">
// Section 4：newmedia（智慧「心」媒體）
import str from '@/locales/section4.json';

const { newmedia } = str;
</script>

<template>
  <section id="media" class="section4">
    <a class="section4__entry" href="#">{{ newmedia.entryLabel }}</a>
    <h2 class="section4__title">{{ newmedia.title }}</h2>
    <p class="section4__body">{{ newmedia.body }}</p>
  </section>
</template>

<style lang="scss" scoped></style>
