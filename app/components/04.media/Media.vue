<script setup lang="ts">
// Section 4：newmedia（智慧「心」媒體）
import str from '@/locales/section4.json';

const { newmedia } = str;
</script>

<template>
  <section id="media">
    <a href="#">{{ newmedia.entryLabel }}</a>
    <h2>{{ newmedia.title }}</h2>
    <p>{{ newmedia.body }}</p>
  </section>
</template>

<style lang="scss" scoped></style>
