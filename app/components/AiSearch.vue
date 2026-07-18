<script lang="ts" setup>
/**
 * AiSearch — 「聯合報數位版 AI 搜尋」體驗區塊（data 頁）。
 *  - 搜尋框內輪播顯示熱門關鍵字（6 組、約 2s 轉換，向上滑出／滑入）。
 *  - 點擊搜尋框或「AI 搜尋」按鈕 → 說明面板向下展開，摘要文字逐字依序出現
 *    （打字機效果）；展開期間關鍵字輪播暫停，收合後恢復。
 *  - 進入視窗才開始輪播（IntersectionObserver）；reduced-motion 直接整段顯示。
 * TODO(figma): 視覺樣式先照聯合報數位版 AI 搜尋介面估值，取得檔案權限後對稿；
 *   summary 目前為佔位示意文案，待正式內容。
 */
export interface AiKeyword {
  term: string;
  summary: string;
}

const props = withDefaults(
  defineProps<{
    /** 輪播關鍵字組（term＋展開摘要） */
    keywords?: AiKeyword[];
    /** 關鍵字轉換間隔（ms） */
    interval?: number;
    /** 逐字出現速度（ms/字） */
    typeSpeed?: number;
  }>(),
  {
    keywords: () => [],
    interval: 2000,
    typeSpeed: 45,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const current = ref(0); // 輪播中的關鍵字 index
const expanded = ref(false);
const typed = ref(''); // 已打出的摘要文字
const typing = ref(false);

let rotateTimer: ReturnType<typeof setInterval> | null = null;
let typeTimer: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;
let reduced = false;

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
  const kw = props.keywords[current.value];
  if (!kw) return;
  stopRotate(); // 展開期間輪播暫停
  stopType();
  expanded.value = true;
  if (reduced) {
    typed.value = kw.summary; // 降級：整段直接顯示
    return;
  }
  typed.value = '';
  typing.value = true;
  const chars = [...kw.summary];
  typeTimer = setInterval(() => {
    typed.value += chars[[...typed.value].length] ?? '';
    if ([...typed.value].length >= chars.length) stopType();
  }, props.typeSpeed);
}

function collapse() {
  stopType();
  expanded.value = false;
  typed.value = '';
  startRotate(); // 收合後恢復輪播
}

function toggle() {
  if (expanded.value) collapse();
  else expand();
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 進入視窗才開始輪播、離開即停，避免背景空轉
  observer = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting && !expanded.value) startRotate();
    else stopRotate();
  });
  if (rootRef.value) observer.observe(rootRef.value);
});

onBeforeUnmount(() => {
  stopRotate();
  stopType();
  observer?.disconnect();
});
</script>

<template>
  <div ref="rootRef" class="ai-search">
    <!-- 搜尋框：放大鏡＋輪播關鍵字＋AI 搜尋按鈕 -->
    <button
      class="ai-search__bar"
      type="button"
      :aria-expanded="expanded"
      @click="toggle"
    >
      <svg
        class="ai-search__icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.6" />
        <path
          d="M15.5 15.5L20 20"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>

      <span class="ai-search__term-clip" aria-live="polite">
        <Transition name="ai-search-roll">
          <span :key="current" class="ai-search__term">
            {{ keywords[current]?.term }}
          </span>
        </Transition>
      </span>

      <span class="ai-search__cta">AI 搜尋</span>
    </button>

    <!-- 說明面板：向下展開，摘要逐字出現 -->
    <div class="ai-search__panel" :class="{ 'ai-search__panel--open': expanded }">
      <div class="ai-search__panel-body">
        <p class="ai-search__answer" aria-live="polite">
          {{ typed }}<span v-if="typing" class="ai-search__caret" aria-hidden="true" />
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-search {
  width: 100%;
  max-width: var(--subpage-content-w); // 與內文窄欄對齊
  margin: 0 auto;
  padding: 0 20px;
}

// 搜尋框（整顆可點）
.ai-search__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  font: inherit;
  text-align: left;
  color: var(--color-body);
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--color-orange);
    box-shadow: 0 4px 16px rgba(255, 127, 0, 0.12);
  }
}

.ai-search__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  color: var(--color-gray);
}

// 關鍵字輪播窗：固定行高裁切，舊字上滑出、新字下滑入
.ai-search__term-clip {
  position: relative;
  display: block;
  flex: 1;
  height: 28px;
  overflow: hidden;
}

.ai-search__term {
  position: absolute;
  inset: 0;
  font-size: var(--text-body);
  line-height: 28px;
  font-weight: 300;
  white-space: nowrap;
}

.ai-search-roll-enter-active,
.ai-search-roll-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.ai-search-roll-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.ai-search-roll-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.ai-search__cta {
  flex-shrink: 0;
  padding: 6px 18px;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: #fff;
  background: var(--color-orange);
  border-radius: 999px;
}

// 說明面板：grid-rows 0fr ↔ 1fr 平滑展開
.ai-search__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}

.ai-search__panel--open {
  grid-template-rows: 1fr;
}

.ai-search__panel-body {
  min-height: 0;
  overflow: hidden;
}

.ai-search__answer {
  margin: 16px 4px 0;
  padding: 20px 24px;
  min-height: 76px;
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;
  color: var(--color-body);
  text-align: left;
  background: var(--color-bg-muted);
  border-radius: 16px;
}

// 打字游標
.ai-search__caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: var(--color-orange);
  animation: ai-search-blink 0.8s steps(1) infinite;
}

@keyframes ai-search-blink {
  50% {
    opacity: 0;
  }
}
</style>
