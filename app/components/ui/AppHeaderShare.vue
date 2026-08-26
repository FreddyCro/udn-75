<script lang="ts" setup>
/**
 * header 分享鈕。dropdown（PC 列，點擊向下展開）／inline（選單內，常駐平鋪）兩種排列。
 * 展開節奏沿用 NmdHeaderShare：第 n 顆移到 top: n*116% 並淡入。
 */
import { shareURL_fb, shareURL_twitter, useLineShareUrl } from '@/utils/share';

const props = withDefaults(
  defineProps<{ layout?: 'dropdown' | 'inline' }>(),
  { layout: 'dropdown' },
);

// LINE 的手機／PC 網址不同，且只有瀏覽器才判得出來 —— 掛載後才換值（見 utils/share）。
const lineHref = useLineShareUrl();

const { play } = useSfx();

// glyph：該圖示在 36 見方外框內的原生高度佔比（設計稿 fb 25.31 / LINE 27.87 / X 22.75）。
// 三個 glyph 的長寬比不同，撐滿外框會讓 X 比框寬 3.8px —— 外框只是版位，glyph 不填滿。
const links = computed(() => [
  { key: 'facebook', href: shareURL_fb, label: '分享到 Facebook', ga: 'share-facebook-top', glyph: 70 },
  { key: 'line', href: lineHref.value, label: '分享到 LINE', ga: 'share-line-top', glyph: 77 },
  { key: 'x', href: shareURL_twitter, label: '分享到 X', ga: 'share-twitter-top', glyph: 63 },
] as const);

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
        ...(layout === 'dropdown' ? { '--i': i } : {}),
      }"
      :href="link.href"
      :aria-label="link.label"
      :tabindex="shown ? 0 : -1"
      :data-ga="link.ga"
      target="_blank"
      rel="noreferrer noopener"
      @mouseenter="play('sfx01Short')"
      @click="play('sfx01Short')"
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
      @mouseenter="play('sfx01Short')"
      @click="open = !open; play('sfx01Short')"
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

  // 稿（Figma 3547:29512，note 寫著「分享icon，和header距離12px，三個icon距離12px」）：
  // 展開的三顆各是 36 見方的框（＝ inline 那組同一個元件，glyph 佔比也相同），
  // 第一顆上緣離主列底緣 12px、之後每顆間距 12px（故節距 48）。
  &--dropdown {
    --drop-box: 36px;
    --drop-gap: 12px;
  }
}

.app-header-share__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  // 展開的三顆與 toggler 疊在同一欄。框比 toggler 寬（36 vs --hd-icon-w 27.5），
  // 故用 left: 50% ＋ translateX(-50%) 對齊兩者的**中軸**——
  // 若寫 left: 0，glyph 會整欄往右偏 (36 − 27.5) / 2 ＝ 4.25px。
  .app-header-share--dropdown & {
    position: absolute;
    top: 0;
    left: 50%;
    width: var(--drop-box);
    height: var(--drop-box);
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%);
    transition:
      top 0.25s,
      opacity 0.25s;
  }

  .app-header-share--inline & {
    width: 36px;
    height: 36px;
  }

  // 落點（--i 從 0 起算）：主列底緣 ＋ 12 ＋ 第 n 顆 × 節距。
  //
  // 起點用「50% ＋ 半個主列高」而不是寫死 63px：本體（＝ toggler 那一格）在主列裡是
  // 垂直置中的（.app-header__bar 與 .app-header__icons 都 align-items: center），
  // 故 50% 就是主列中線，加半個主列高正好落在主列底緣 ——
  // --header-height 或 icon 版位改了都不必回來改這裡。
  // 原本是 top: calc(var(--i) * 116%)（節距 ＝ 116% 的 22px 框 ≈ 25.5px、第一顆還在
  // 主列**內**），那是沿用 NmdHeaderShare 的節奏，不是本站的稿。
  &--shown {
    .app-header-share--dropdown & {
      top: calc(
        50% + (var(--header-height) - 3px) / 2 + var(--drop-gap) + var(--i) *
          (var(--drop-box) + var(--drop-gap))
      );
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
  width: var(--hd-icon-w);
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
