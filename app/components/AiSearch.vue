<script lang="ts" setup>
/**
 * AiSearch — 「聯合報數位版 AI 搜尋」體驗區塊（data 頁）。
 * 搜尋框輪播關鍵字；點擊展開 AI 摘要面板、內文逐字打出；
 * reduced-motion 直接整段顯示。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface AiKeyword {
  term: string;
  /** 展開摘要（段落陣列；相容單一字串） */
  summary: string | string[];
}

const props = withDefaults(
  defineProps<{
    /** 輪播關鍵字組（term＋展開摘要） */
    keywords?: AiKeyword[];
    /** 「深入體驗聯合報數位版」連結（待正式網址） */
    ctaUrl?: string;
    /** 關鍵字轉換間隔（ms） */
    interval?: number;
    /** 逐字出現速度（ms/字） */
    typeSpeed?: number;
  }>(),
  {
    keywords: () => [],
    ctaUrl: '#',
    interval: 2000,
    typeSpeed: 30,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const foldRef = ref<HTMLElement | null>(null);
const current = ref(0); // 輪播中的關鍵字 index
const expanded = ref(false);
const typedCount = ref(0); // 已打出的總字數（跨段落）
const typing = ref(false);
const done = ref(false); // 摘要打完 → 顯示資料來源與聲明

let rotateTimer: ReturnType<typeof setInterval> | null = null;
let typeTimer: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let reduced = false;

/** 摘要展開/收合/逐字打字都會改變頁面高度 → debounce 重算下方 pin 區塊的 ScrollTrigger 起點 */
function scheduleRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    ScrollTrigger.refresh();
  }, 250);
}

/** 目前關鍵字的摘要段落 */
const paragraphs = computed(() => {
  const s = props.keywords[current.value]?.summary ?? [];
  return Array.isArray(s) ? s : [s];
});

const totalChars = computed(() =>
  paragraphs.value.reduce((n, p) => n + [...p].length, 0),
);

/** 依 typedCount 將字數分配到各段落（逐段依序打出） */
const typedParas = computed(() => {
  let left = typedCount.value;
  return paragraphs.value.map((p) => {
    const chars = [...p];
    const take = Math.min(chars.length, Math.max(0, left));
    left -= chars.length;
    return chars.slice(0, take).join('');
  });
});

function startRotate() {
  if (rotateTimer || props.keywords.length < 2) return;
  rotateTimer = setInterval(() => {
    current.value = (current.value + 1) % props.keywords.length;
  }, props.interval);
}

function stopRotate() {
  if (rotateTimer) {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }
}

function stopType() {
  if (typeTimer) {
    clearInterval(typeTimer);
    typeTimer = null;
  }
  typing.value = false;
}

/** 展開目前關鍵字的摘要，逐字打出 */
function expand() {
  stopRotate(); // 展開期間輪播暫停
  stopType();
  expanded.value = true;
  done.value = false;
  if (reduced) {
    typedCount.value = totalChars.value; // 降級：整段直接顯示
    done.value = true;
    return;
  }
  typedCount.value = 0;
  typing.value = true;
  typeTimer = setInterval(() => {
    typedCount.value += 1;
    if (typedCount.value >= totalChars.value) {
      stopType();
      done.value = true;
    }
  }, props.typeSpeed);
}

function collapse() {
  stopType();
  expanded.value = false;
  done.value = false;
  typedCount.value = 0;
  startRotate(); // 收合後恢復輪播
}

function toggle() {
  if (expanded.value) collapse();
  else expand();
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 進入視窗才開始輪播、離開即停，避免背景空轉
  observer = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting && !expanded.value) startRotate();
    else stopRotate();
  });
  if (rootRef.value) observer.observe(rootRef.value);
  // 摺疊面板高度一變（展開/收合/打字）就重算 ScrollTrigger，避免下方 pin 區起點跑掉
  resizeObserver = new ResizeObserver(scheduleRefresh);
  if (foldRef.value) resizeObserver.observe(foldRef.value);
});

onBeforeUnmount(() => {
  stopRotate();
  stopType();
  observer?.disconnect();
  resizeObserver?.disconnect();
  if (refreshTimer) clearTimeout(refreshTimer);
});
</script>

<template>
  <div ref="rootRef" class="ai-search">
    <!-- 搜尋框：輪播關鍵字＋放大鏡星芒 icon -->
    <button
      class="ai-search__bar"
      type="button"
      :aria-expanded="expanded"
      @click="toggle"
    >
      <span class="ai-search__term-clip" aria-live="polite">
        <Transition name="ai-search-roll">
          <span :key="current" class="ai-search__term">
            大家都在看：{{ keywords[current]?.term }}
          </span>
        </Transition>
      </span>
      <img
        class="ai-search__bar-icon"
        src="/img/data/udn75_data_ai_search.svg"
        alt=""
        aria-hidden="true"
      />
    </button>

    <!-- AI 摘要面板：標題列常駐，內文向下展開、逐字出現 -->
    <div class="ai-search__panel" :class="{ 'ai-search__panel--open': expanded }">
      <button
        class="ai-search__head"
        type="button"
        :aria-expanded="expanded"
        @click="toggle"
      >
        <span class="ai-search__spark" aria-hidden="true" />
        <span>AI摘要</span>
      </button>

      <div ref="foldRef" class="ai-search__fold">
        <div class="ai-search__body">
          <p
            v-for="(p, i) in typedParas"
            v-show="p.length > 0"
            :key="i"
            class="ai-search__answer"
            aria-live="polite"
          >
            {{ p
            }}<span
              v-if="typing && p.length > 0 && (typedParas[i + 1] ?? '') === ''"
              class="ai-search__caret"
              aria-hidden="true"
            />
          </p>

          <div class="ai-search__meta" :class="{ 'ai-search__meta--show': done }">
            <p class="ai-search__sources">
              資料來源：
              <img
                class="ai-search__source-icon"
                src="/img/data/udn75_data_icon_udnvip.svg"
                alt=""
                aria-hidden="true"
              />聯合報數位版、
              <img
                class="ai-search__source-icon"
                src="/img/data/udn75_data_icon_udnnews.svg"
                alt=""
                aria-hidden="true"
              />聯合新聞網
            </p>
            <hr class="ai-search__divider" />
            <p class="ai-search__note">
              <span
                class="ai-search__spark ai-search__spark--note"
                aria-hidden="true"
              />
              以上摘要由 AI
              依據資料來源自動產生，僅作為閱讀輔助參考，不構成完整新聞內容，實際資訊請以原報導為準。
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="ai-search__cta-row">
      <a class="ai-search__cta" :href="ctaUrl" target="_blank" rel="noopener">
        深入體驗聯合報數位版
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 欄寬與 .sp-col 內文窄欄對齊（此元件為滿版 embed，不吃外層欄的內距）
.ai-search {
  width: 100%;
  margin: 0 auto;
  padding: 0 26px;

  @include rwd-min('tablet') {
    max-width: 570px;
    padding: 0 20px;
  }

  @include rwd-min('pc') {
    max-width: var(--subpage-content-w);
    padding: 0;
  }
}

// 搜尋框：整顆可點
.ai-search__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  height: 40px;
  padding: 0 16px 0 25px;
  font: inherit;
  text-align: left;
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--color-gray-light);
  }
}

// 關鍵字輪播窗：固定行高裁切，舊句上滑出、新句下滑入
.ai-search__term-clip {
  position: relative;
  display: block;
  flex: 1;
  height: 36px;
  overflow: hidden;
  font-size: var(--text-body);
  font-weight: 300;
  color: #bcbcbc; // placeholder 灰，非全站 token
}

.ai-search__term {
  position: absolute;
  inset: 0;
  line-height: 36px;
  white-space: nowrap;
}

.ai-search-roll-enter-active,
.ai-search-roll-leave-active {
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;
}

.ai-search-roll-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.ai-search-roll-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.ai-search__bar-icon {
  flex-shrink: 0;
  width: 18px;
  height: 21px;
}

.ai-search__panel {
  margin-top: 16px;
  background: #fafafa; // 面板專用底色，非全站 token
}

.ai-search__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 56px;
  padding: 0 24px;
  font: inherit;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-body);
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
}

// 星芒（mask 上色）：<img> 載入的 svg 無法用 CSS fill，故走 mask + background-color
.ai-search__spark {
  flex-shrink: 0;
  display: block;
  width: 14px;
  height: 15px;
  background: #ce252c; // 同素材原色
  mask: url('/img/data/udn75_data_ai_spark.svg') no-repeat center / contain;
  -webkit-mask: url('/img/data/udn75_data_ai_spark.svg') no-repeat center / contain;
}

// 注意事項的星芒：貼在第一行行首，改灰
.ai-search__spark--note {
  position: absolute;
  top: 4px;
  left: 0;
  background: #646464;
}

// 內文摺疊：grid-rows 0fr ↔ 1fr 平滑展開
.ai-search__fold {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;

  .ai-search__panel--open & {
    grid-template-rows: 1fr;
  }
}

.ai-search__body {
  min-height: 0;
  overflow: hidden;
  padding: 0 24px;
}

.ai-search__answer {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 300;
  line-height: 24px;
  color: var(--color-body);
  text-align: left;
  white-space: pre-wrap;
}

// 打字游標
.ai-search__caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: var(--color-gray);
  animation: ai-search-blink 0.8s steps(1) infinite;
}

@keyframes ai-search-blink {
  50% {
    opacity: 0;
  }
}

// 資料來源＋AI 產生聲明：摘要打完後淡入
.ai-search__meta {
  padding-bottom: 16px;
  opacity: 0;
  transition: opacity 0.4s ease;

  &--show {
    opacity: 1;
  }
}

.ai-search__sources {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 13px;
  line-height: 22px;
  color: var(--color-gray);
}

.ai-search__source-icon {
  width: 16px;
  height: 16px;
  margin-right: 7px;
}

.ai-search__divider {
  margin: 12px 0;
  border: 0;
  border-top: 1px solid var(--color-line);
}

.ai-search__note {
  position: relative;
  margin: 0;
  padding-left: 19px;
  font-size: 13px;
  line-height: 22px;
  color: var(--color-gray-light);
}

.ai-search__cta-row {
  display: flex;
  justify-content: center;
  margin-top: 28px;

  @include rwd-min('tablet') {
    margin-top: 32px;
  }
}

.ai-search__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 280px;
  height: 68px;
  padding: 0 24px;
  font-size: var(--text-body);
  font-weight: 300;
  color: var(--color-gray);
  text-decoration: none;
  border: 1px solid var(--color-gray-light);
  transition:
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    color: var(--color-body);
    border-color: var(--color-body);
  }
}
</style>
