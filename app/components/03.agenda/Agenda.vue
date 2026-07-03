<script setup lang="ts">
// Section 3：partner（永續祝福）
import str from '@/locales/section3.json';

const { partner } = str;
</script>

<template>
  <section id="blessing" class="section3">
    <div class="section3__intro">
      <h2>{{ partner.title }}</h2>
      <p>{{ partner.body }}</p>
    </div>

    <div
      v-for="(tier, i) in partner.tiers"
      :key="i"
      class="section3__tier"
    >
      <h3 class="section3__tier-label">{{ tier.label }}</h3>
      <ul class="section3__partners">
        <li
          v-for="(item, j) in tier.partners"
          :key="j"
          class="section3__partner"
        >
          <span class="section3__partner-name">{{ item.name }}</span>
          <blockquote class="section3__partner-quote">{{ item.quote }}</blockquote>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
