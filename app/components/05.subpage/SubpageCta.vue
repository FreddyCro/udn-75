<script lang="ts" setup>
/** SubpageCta — 子頁置中外連按鈕（可選 lead 引導句，education / health 頁）。 */
defineProps<{
  label: string;
  url: string;
  lead?: string;
}>();
</script>

<template>
  <div class="subpage-cta">
    <p v-if="lead" class="subpage-cta__lead">{{ lead }}</p>
    <a class="subpage-cta__btn" :href="url" target="_blank" rel="noopener">{{ label }}</a>
  </div>
</template>

<style lang="scss" scoped>
.subpage-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.subpage-cta__lead {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-gray-light);
  text-align: center;
}

.subpage-cta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 40px;
  font-size: 18px;
  line-height: 31px;
  font-weight: 300;
  letter-spacing: 1.8px;
  color: var(--color-gray);
  text-decoration: none;
  border: 0.6px solid var(--color-gray);
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover,
  &:focus-visible {
    color: #fff;
    background: var(--color-orange);
    border-color: var(--color-orange);

    // 放大只給 pc 以上（pad／mob 是觸控，hover 不成立）。
    // 比例取自設計稿 hover 態：280×68 → 290×75，非等比。
    @include rwd-min('pc') {
      transform: scale(calc(290 / 280), calc(75 / 68));
    }
  }

  @include rwd-min('tablet') {
    padding: 19px 56px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
}
</style>
