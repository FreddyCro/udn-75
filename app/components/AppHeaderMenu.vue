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

// 選單開啟期間鎖住頁面捲動。樣式在 base.scss 的 .is-menu-locked（overflow:hidden ＋
// padding-right 補回捲軸寬，避免鎖／解鎖時橫向抖動或撐出水平捲軸）。
//
// ⚠️ class 必須同時掛在 <html> 與 <body>：html 有 overflow-x: clip，根元素不再是
//    overflow: visible → body 的 overflow 不會傳播到視窗。原本這裡只寫
//    body.style.overflow = 'hidden'，等於完全沒鎖（同 hero 那把鎖踩過的坑）。
//
// 用獨立的 .is-menu-locked 而非 hero 的 .is-scroll-locked：兩把鎖各自開關，
// hero 那邊 heroState 一變就會 remove class，共用會把選單的鎖一起清掉。
function setScrollLock(locked: boolean) {
  document.documentElement.classList.toggle('is-menu-locked', locked);
  document.body.classList.toggle('is-menu-locked', locked);
}

watch(
  () => props.open,
  (open) => {
    setScrollLock(open);
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
  setScrollLock(false);
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
            'app-header-menu__link--active':
              isHome && activeTarget === anchor.target,
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

// 面板高度是「宣告」出來的，不是被內容 padding 撐出來的：
//   height    = 100%（＝視窗高 − 3px 進度條）− 面板底緣到視窗底的留白（mob 稿 165 / pad 稿 230）
//   max-height= 設計稿面板高，視窗再高也不超過（mob 568 / pad 793）
// 內容則一端各自貼齊：__nav 靠 padding-top 貼上、__share 靠 margin-top:auto 貼下。
// 這樣日後只改上面兩個數字，內部間距不會跟著位移。
// min-height 保底：極矮視窗（如手機橫向）算出的高度小於內容時不裁切。
.app-header-menu__panel {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100% - 165px);
  min-height: fit-content;
  max-height: 568px;
  padding: calc(var(--header-height) - 3px) 32px 30px;
  background-color: #fff;

  @include rwd-min('tablet') {
    height: calc(100vh - 80px);
    max-height: 793px;
    padding-bottom: 40px; // 793.5 − 753（icon 底緣）
  }

  // 面板恆為白底，故覆寫 --hd-fg 而非跟 AppHeaderShare 搶 color 的特異度
  --hd-fg: var(--color-gray-light);
}

// 錨點列貼面板上緣：padding-top ＝ 稿上首個錨點 y − header 主列高（已由 panel 的 padding-top 佔掉）
.app-header-menu__nav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-bottom: 16px;
  gap: 36px;

  @include rwd-min('tablet') {
    padding-bottom: 92px;
  }
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
    bottom: -12px;
    left: 0;
    height: 4px;
    background-color: var(--color-orange);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }

  &--active::after {
    transform: scaleX(1);
  }
}

// 分享列貼面板下緣（padding-bottom 之上）。不寫死與錨點列的間距，
// 面板高度一改就自己跟著走 —— 稿上的 mob 104 / pad 253 會自然算出來。
.app-header-menu__share {
  margin-top: auto;
}

@media (prefers-reduced-motion: reduce) {
  .app-header-menu,
  .app-header-menu__link::after {
    transition: none;
  }
}
</style>
