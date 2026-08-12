<script lang="ts" setup>
/**
 * PC（≥1280）錨點列。底線 hover／active 由中心往左右展開。
 */
defineProps<{
  anchors: { title: string; target: string }[];
  activeTarget: string;
}>();

defineEmits<{ select: [target: string] }>();
</script>

<template>
  <nav class="app-header-nav">
    <a
      v-for="anchor in anchors"
      :key="anchor.target"
      class="app-header-nav__link"
      :class="{ 'app-header-nav__link--active': activeTarget === anchor.target }"
      :href="`#${anchor.target}`"
      @click.prevent="$emit('select', anchor.target)"
    >
      {{ anchor.title }}
    </a>
  </nav>
</template>

<style lang="scss" scoped>
.app-header-nav {
  display: none; // <1280 改用漢堡選單

  @include rwd-min('pc') {
    display: flex;
    align-items: center;
    gap: 32px;
  }
}

.app-header-nav__link {
  position: relative;
  flex-shrink: 0;
  padding: 4px 0;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--hd-fg);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: var(--hd-accent);
    transform: scaleX(0); // transform-origin 預設 center → 由中心往兩側展開
    transition: transform 0.2s ease;
  }

  &:hover::after,
  &--active::after {
    transform: scaleX(1);
  }

  // 白底主題的 active 文字換強調色；黑底／橘底維持白字
  .app-header--light &--active {
    color: var(--hd-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header-nav__link::after {
    transition: none;
  }
}
</style>
