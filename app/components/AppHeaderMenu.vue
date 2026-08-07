<script lang="ts" setup>
/**
 * <1280 的全螢幕選單。首頁與子頁列同一份三錨點；子頁點擊改用路由跳回首頁對應段落。
 * 開啟時 header 一律切白底（設計稿只有白面板一版），由 AppHeader 控制。
 */
const props = defineProps<{
  open: boolean;
  anchors: { title: string; target: string }[];
  activeTarget: string;
}>();

const emit = defineEmits<{ close: []; select: [target: string] }>();

const route = useRoute();
const panelRef = ref<HTMLElement | null>(null);

const isHome = computed(() => route.path === '/');

// 首頁：就地捲動；子頁：走路由回首頁帶 hash（不能用原生 <a href="/#x">，那會整頁重載）
async function onSelect(target: string) {
  emit('close');

  if (isHome.value) {
    emit('select', target);
    return;
  }

  await navigateTo(`/#${target}`);
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;

  if (e.key === 'Escape') {
    emit('close');
    return;
  }

  if (e.key !== 'Tab') return;

  // focus trap：面板開啟時 Tab 不得跑到底下的頁面內容
  const focusables = panelRef.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])',
  );
  if (!focusables?.length) return;

  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// 開啟前的 focus，關閉時要還給它（通常是漢堡鈕，但用 activeElement 記錄，不寫死選取器）
let previouslyFocused: HTMLElement | null = null;
let focusRaf1 = 0;
let focusRaf2 = 0;

function cancelPendingFocus() {
  if (focusRaf1) cancelAnimationFrame(focusRaf1);
  if (focusRaf2) cancelAnimationFrame(focusRaf2);
  focusRaf1 = 0;
  focusRaf2 = 0;
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
    cancelPendingFocus();

    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      // nextTick 只保證 vdom patch 完成、--open 的 class 已寫進 DOM，
      // 不保證瀏覽器已跑完 style/layout；此時 visibility 仍可能是 hidden，
      // .focus() 對還不可 focus 的元素是靜默失敗。雙層 rAF 等排版真正定案。
      focusRaf1 = requestAnimationFrame(() => {
        focusRaf2 = requestAnimationFrame(() => {
          if (!props.open) return; // 這幾幀內又被關掉，不搶焦點
          panelRef.value?.querySelector('a')?.focus();
        });
      });
    } else {
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  },
);

onMounted(() => document.addEventListener('keydown', onKeydown));

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
  cancelPendingFocus();
});
</script>

<template>
  <div
    class="app-header-menu"
    :class="{ 'app-header-menu--open': open }"
    :aria-hidden="!open"
  >
    <div class="app-header-menu__scrim" @click="emit('close')" />

    <div ref="panelRef" class="app-header-menu__panel">
      <nav class="app-header-menu__nav">
        <a
          v-for="anchor in anchors"
          :key="anchor.target"
          class="app-header-menu__link"
          :class="{
            'app-header-menu__link--active': isHome && activeTarget === anchor.target,
          }"
          :href="isHome ? `#${anchor.target}` : `/#${anchor.target}`"
          :tabindex="open ? 0 : -1"
          @click.prevent="onSelect(anchor.target)"
        >
          {{ anchor.title }}
        </a>
      </nav>

      <div class="app-header-menu__share">
        <AppHeaderShare layout="inline" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header-menu {
  position: fixed;
  inset: 3px 0 0 0; // 讓出頂端 3px 進度條
  z-index: 1; // 疊在頁面內容之上、header 主列（z-index 2）之下
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease;

  &--open {
    visibility: visible;
    opacity: 1;
  }

  @include rwd-min('pc') {
    display: none;
  }
}

.app-header-menu__scrim {
  position: absolute;
  inset: 0;
  background-color: #000;
  opacity: 0.2;
}

.app-header-menu__panel {
  position: relative;
  // 高度由內容撐出，不寫死 568：頂端讓開 header 主列，底部留 30
  padding: calc(var(--header-height) - 3px) 32px 30px;
  background-color: #fff;

  // 面板恆為白底，故覆寫 --hd-fg 而非跟 AppHeaderShare 搶 color 的特異度
  --hd-fg: var(--color-gray-light);
}

.app-header-menu__nav {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-top: 86px; // 166 − 80（header 主列已由 panel 的 padding-top 佔掉）
}

.app-header-menu__link {
  position: relative;
  align-self: flex-start;
  font-size: 46px;
  line-height: 1.15;
  color: var(--color-gray);
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: -4px;
    left: 0;
    height: 3px;
    background-color: var(--color-orange);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }

  &--active::after {
    transform: scaleX(1);
  }
}

.app-header-menu__share {
  margin-top: 104px; // 505 − 401
}

@media (prefers-reduced-motion: reduce) {
  .app-header-menu,
  .app-header-menu__link::after {
    transition: none;
  }
}
</style>
