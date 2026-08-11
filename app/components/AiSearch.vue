<script lang="ts" setup>
/**
 * AiSearch — 「聯合報數位版 AI 搜尋」體驗區塊（data 頁）。
 * 搜尋框輪播關鍵字；點擊展開 AI 摘要面板，內文「全文常駐 DOM」、
 * 逐字以 CSS stagger 淡入（每字 delay = 全篇字序 × typeSpeed）——
 * 不截字重排，展開瞬間高度即定案，打字過程不再撐高面板；
 * reduced-motion 直接整段顯示。
 *
 * 摘要「全部出來」（打完字＋來源／聲明淡入）之後輪播會自己接回去跑，
 * 面板仍留著上一筆結果 —— 因此輪播中的關鍵字（current）與面板正在顯示的
 * 關鍵字（activeIndex）要分開記，否則輪播會把已顯示的摘要換掉。
 * 此時再點一次搜尋框，就用「當下輪播到的關鍵字」重跑一次。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';

export interface AiKeyword {
  term: string;
  summary: string;
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

/** 單字淡入時長（ms）：與 SCSS 的 ai-search-char-in 時長一致 */
const CHAR_FADE_MS = 300;

const rootRef = ref<HTMLElement | null>(null);
const foldRef = ref<HTMLElement | null>(null);
const current = ref(0); // 輪播中的關鍵字 index
const activeIndex = ref(0); // 面板正在顯示（點擊時選中）的關鍵字 index
const inView = ref(false); // 區塊是否在視窗內：離開視窗不讓輪播在背景空轉
const expanded = ref(false);
const typing = ref(false); // 逐字淡入進行中（游標顯示期間）
const done = ref(false); // 摘要出完 → 顯示資料來源與聲明
const runId = ref(0); // 每次搜尋 +1：重建內文節點，讓 CSS 逐字動畫從頭播

let rotateTimer: ReturnType<typeof setInterval> | null = null;
let doneTimer: ReturnType<typeof setTimeout> | null = null;
let observer: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let reduced = false;

/** 摘要展開/收合會改變頁面高度 → debounce 重算下方 pin 區塊的 ScrollTrigger 起點
 *（全文常駐 DOM，逐字淡入不再逐步撐高） */
function scheduleRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    refreshScrollTriggers();
  }, 250);
}

/** 面板正在顯示的關鍵字摘要段落（跟著 activeIndex，不跟輪播）：
 *  以 <br/> 切段（連續多個視為一個分隔），每段各自渲染一個 <p>，
 *  br 標記本身不進 totalChars，不會被逐字打出 */
const paragraphs = computed(() => {
  const s = props.keywords[activeIndex.value]?.summary ?? '';
  return s.split(/(?:<br\s*\/?>\s*)+/).filter((p) => p.length > 0);
});

/** 各段的字元陣列與全篇起始字序：每字 delay = (offset + 段內字序) × typeSpeed */
const paraMeta = computed(() => {
  let offset = 0;
  return paragraphs.value.map((p) => {
    const chars = [...p];
    const meta = { chars, offset };
    offset += chars.length;
    return meta;
  });
});

const totalChars = computed(() =>
  paraMeta.value.reduce((n, m) => n + m.chars.length, 0),
);

function startRotate() {
  if (rotateTimer || props.keywords.length < 2 || !inView.value) return;
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
  if (doneTimer) {
    clearTimeout(doneTimer);
    doneTimer = null;
  }
  typing.value = false;
}

/** 以「當下輪播到的關鍵字」展開摘要，全文進 DOM 後逐字淡入；出完才把輪播接回去 */
function expand() {
  stopRotate(); // 逐字期間輪播暫停，避免結果被換掉
  stopType();
  activeIndex.value = current.value;
  expanded.value = true;
  done.value = false;
  runId.value += 1; // 重建內文節點 → CSS stagger 從第一字重播
  if (reduced) {
    done.value = true; // 降級：整段直接顯示（char 動畫也由 media query 關閉）
    startRotate(); // 結果已全部出來 → placeholder 繼續輪播
    return;
  }
  typing.value = true;
  // 逐字動畫由 CSS 自跑，JS 只在「末字淡入播完」時收尾
  doneTimer = setTimeout(
    () => {
      stopType();
      done.value = true; // 來源／聲明淡入＝結果全部出來
      startRotate(); // placeholder 繼續輪播，面板留著這筆結果，可再點一次重跑
    },
    totalChars.value * props.typeSpeed + CHAR_FADE_MS,
  );
}

function collapse() {
  stopType();
  expanded.value = false;
  done.value = false;
  startRotate(); // 收合後恢復輪播
}

/** AI摘要 標題列：純展開／收合（收合後輪播照跑） */
function toggle() {
  if (expanded.value) collapse();
  else expand();
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 進入視窗才開始輪播、離開即停，避免背景空轉；打字中不搶回輪播
  observer = new IntersectionObserver(([e]) => {
    inView.value = !!e?.isIntersecting;
    if (inView.value && !typing.value) startRotate();
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
    <!-- 搜尋框：輪播關鍵字＋放大鏡星芒 icon。
         點擊＝搜尋「當下輪播到的關鍵字」，面板開著也能再點一次換一筆（收合走 AI摘要 標題列） -->
    <button
      class="ai-search__bar"
      type="button"
      :aria-expanded="expanded"
      @click="expand"
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
        <!-- :key="runId"：每次搜尋重建節點，逐字動畫才會從頭播（同關鍵字重搜亦然） -->
        <div :key="runId" class="ai-search__body">
          <!-- 全文常駐 DOM：每字一個 span，delay = 全篇字序 × typeSpeed 依序淡入；
               游標貼各段尾端，僅在該段淡入的時間窗內顯示（--delay/--dur） -->
          <p
            v-for="(m, i) in paraMeta"
            :key="i"
            class="ai-search__answer"
            aria-live="polite"
          >
            <span
              v-for="(ch, j) in m.chars"
              :key="j"
              class="ai-search__char"
              :class="{ 'ai-search__char--in': typing }"
              :style="typing ? { animationDelay: `${(m.offset + j) * typeSpeed}ms` } : undefined"
              >{{ ch }}</span
            ><span
              v-if="typing"
              class="ai-search__caret"
              :style="{
                '--delay': `${m.offset * typeSpeed}ms`,
                '--dur': `${m.chars.length * typeSpeed + CHAR_FADE_MS}ms`,
              }"
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
              以上摘要由 AI 依據資料來源自動產生，僅作為閱讀輔助參考，不構成完整新聞內容，實際資訊請以原報導為準。
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

// 逐字淡入：delay 由 template 帶入（全篇字序 × typeSpeed）。
// fill-mode: both → delay 期間停在 0%（透明），但字始終占位，段落高度不變。
// 沒有 --in（reduced-motion 降級或已收尾）時無動畫＝直接可見。
.ai-search__char--in {
  animation: ai-search-char-in 0.3s ease both; // 時長須與 script 的 CHAR_FADE_MS 一致

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes ai-search-char-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// 打字游標：貼在各段尾端，僅在該段逐字的時間窗內顯示 ——
// 預設 visibility: hidden，window 動畫（--delay 起、--dur 長、fill: none）期間才 visible，
// 播完自動落回 hidden；閃爍交給疊加的 blink 動畫。
.ai-search__caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  visibility: hidden;
  background: var(--color-gray);
  animation:
    ai-search-blink 0.8s steps(1) infinite,
    ai-search-caret-window var(--dur, 0s) linear var(--delay, 0s);
}

@keyframes ai-search-caret-window {
  from,
  to {
    visibility: visible;
  }
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
