<script setup lang="ts">
// Section 1：hero / intro / date
import str from '@/locales/section1.json';
</script>

<template>
  <section class="section1">
    <!-- hero -->
    <div class="section1__hero">
      <h1>{{ str.hero.title }}</h1>
      <p class="section1__hero-subtitle">{{ str.hero.subtitle }}</p>
      <p class="section1__hero-scroll">{{ str.hero.scrollHint }}</p>
    </div>

    <!-- intro -->
    <div class="section1__intro">
      <p>{{ str.intro.body }}</p>
      <a class="section1__intro-cta" href="#">{{ str.intro.forumCta }}</a>
    </div>

    <!-- date -->
    <div class="section1__date">
      <h2>{{ str.date.title }}</h2>
      <p class="section1__date-desc">{{ str.date.desc }}</p>
      <dl class="section1__date-meta">
        <dt>{{ str.date.dateLabel }}</dt>
        <dd>{{ str.date.year }} / {{ str.date.month }} / {{ str.date.day }}</dd>
        <dt>{{ str.date.locationLabel }}</dt>
        <dd>{{ str.date.venue }}・{{ str.date.time }}</dd>
      </dl>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>