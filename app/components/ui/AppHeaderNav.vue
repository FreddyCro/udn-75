<script lang="ts" setup>
/**
 * 錨點列（≥1280）。底線 hover／active 由中心往左右展開。
 *
 * 首頁與子頁共用同一列：首頁就地捲動（emit select），子頁走 NuxtLink 導航回首頁對應段落。
 * 子頁也要渲染的理由 —— 漢堡在 ≥1280 是 display:none，錨點列若又只在首頁渲染，
 * 子頁 PC 的 header 就只剩 logo ＋ 音效 ＋ share，完全沒有導覽。
 */
defineProps<{
  anchors: { title: string; target: string }[];
  activeTarget: string;
}>();

const emit = defineEmits<{ select: [target: string] }>();

const route = useRoute();
const isHome = computed(() => route.path === '/');

// 首頁：攔下路由、就地捲動。子頁：不攔，讓 NuxtLink 導航（並吃到 viewport prefetch）。
function onSelect(target: string, e: MouseEvent) {
  // 修飾鍵點擊＝開新分頁的意圖，一律放行給瀏覽器。
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (!isHome.value) return;
  e.preventDefault();
  emit('select', target);
}
</script>

<template>
  <nav class="app-header-nav">
    <NuxtLink
      v-for="anchor in anchors"
      :key="anchor.target"
      class="app-header-nav__link"
      :class="{ 'app-header-nav__link--active': activeTarget === anchor.target }"
      :to="`/#${anchor.target}`"
      @click="onSelect(anchor.target, $event)"
    >
      {{ anchor.title }}
    </NuxtLink>
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
