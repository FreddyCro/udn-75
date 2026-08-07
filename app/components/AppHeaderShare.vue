<script lang="ts" setup>
/**
 * header 分享鈕。dropdown（PC 列，點擊向下展開）／inline（選單內，常駐平鋪）兩種排列。
 * 展開節奏沿用 NmdHeaderShare：第 n 顆移到 top: n*116% 並淡入。
 */
import { shareURL_fb, shareURL_line, shareURL_twitter } from '@/utils/share';

const props = withDefaults(
  defineProps<{ layout?: 'dropdown' | 'inline' }>(),
  { layout: 'dropdown' },
);

// glyph：該圖示在 36 見方外框內的原生高度佔比（設計稿 fb 25.31 / LINE 27.87 / X 22.75）。
// 三個 glyph 的長寬比不同，撐滿外框會讓 X 比框寬 3.8px —— 外框只是版位，glyph 不填滿。
const links = [
  { key: 'facebook', href: shareURL_fb, label: '分享到 Facebook', ga: 'share-facebook-top', glyph: 70 },
  { key: 'line', href: shareURL_line, label: '分享到 LINE', ga: 'share-line-top', glyph: 77 },
  { key: 'x', href: shareURL_twitter, label: '分享到 X', ga: 'share-twitter-top', glyph: 63 },
] as const;

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

// inline 模式沒有 toggler，三顆一律可見可 focus
const shown = computed(() => props.layout === 'inline' || open.value);

function onDocumentPointerDown(e: PointerEvent) {
  if (!open.value) return;
  if (rootRef.value?.contains(e.target as Node)) return;
  open.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div
    ref="rootRef"
    class="app-header-share"
    :class="`app-header-share--${layout}`"
  >
    <a
      v-for="(link, i) in links"
      :key="link.key"
      class="app-header-share__link"
      :class="{ 'app-header-share__link--shown': shown }"
      :style="{
        '--glyph-h': `${link.glyph}%`,
        ...(layout === 'dropdown' ? { '--i': i + 1 } : {}),
      }"
      :href="link.href"
      :aria-label="link.label"
      :tabindex="shown ? 0 : -1"
      :data-ga="link.ga"
      target="_blank"
      rel="noreferrer noopener"
    >
      <AppHeaderIcon :name="link.key" />
    </a>

    <button
      v-if="layout === 'dropdown'"
      class="app-header-share__toggler"
      :class="{ 'app-header-share__toggler--on': open }"
      type="button"
      aria-label="分享"
      :aria-expanded="open"
      @click="open = !open"
    >
      <AppHeaderIcon name="share" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.app-header-share {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--hd-fg);

  &--inline {
    gap: 16px;
  }
}

.app-header-share__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  .app-header-share--dropdown & {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--hd-icon-h);
    opacity: 0;
    pointer-events: none;
    transition:
      top 0.25s,
      opacity 0.25s;
  }

  .app-header-share--inline & {
    width: 36px;
    height: 36px;
  }

  &--shown {
    .app-header-share--dropdown & {
      top: calc(var(--i) * 116%);
      opacity: 1;
      pointer-events: auto;
    }
  }

  // 外框只是版位，glyph 依各自原生長寬比置中（--glyph-h 由 links 資料帶入）
  :deep(.app-header-icon) {
    height: var(--glyph-h);
  }
}

.app-header-share__toggler {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--hd-icon-h);
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;

  // 展開時只換色，不加圓底（與 NmdHeaderShare 的紅底圓形不同）
  &--on {
    color: var(--hd-accent);
  }

  :deep(.app-header-icon) {
    height: 95%; // 設計稿 20.9 / 22
  }
}

@media (prefers-reduced-motion: reduce) {
  // 特異度須對齊上方 .app-header-share--dropdown & 巢狀規則（0,2,0）；
  // 若只寫 .app-header-share__link（0,1,0）會因特異度較低而永遠贏不了，形同沒寫。
  .app-header-share--dropdown .app-header-share__link {
    transition: none;
  }
}
</style>
