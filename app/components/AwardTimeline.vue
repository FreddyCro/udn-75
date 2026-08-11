<script lang="ts" setup>
/**
 * AwardTimeline — 獲獎歷程橫向時間軸（pin + scrub，news 頁）。
 * pin 的是本元件的 root，故小標要一起釘住就得放進來：用 #title slot，
 * 會渲染在 __stage 內（100vh flex column），與軌道同框垂直置中。
 * reduced-motion 改原生橫向捲動。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';

export interface TimelineAward {
  /** 獎項機構 */
  org: string;
  /** 獎項名稱（多個獎項 = 多行） */
  titles: string[];
  /** 作品名（「作品：」前綴由元件補） */
  work?: string;
}

export interface TimelineItem {
  year: string;
  /** 欄寬（px，對稿各欄不同；預設 277） */
  width?: number;
  awards: TimelineAward[];
}

const props = withDefaults(
  defineProps<{
    items?: TimelineItem[];
    /** pin 期間可捲動距離（px） */
    pinDistance?: number;
  }>(),
  {
    items: () => [],
    pinDistance: 1600,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const lineRef = ref<HTMLElement | null>(null);
const trailRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);
const activeIdx = ref(0);
const itemEls: HTMLElement[] = [];
const setItem = (el: any, i: number) => {
  if (el) itemEls[i] = el as HTMLElement;
};

let tl: gsap.core.Timeline | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function build() {
  const root = rootRef.value;
  const stage = stageRef.value;
  const track = trackRef.value;
  const line = lineRef.value;
  const arrow = arrowRef.value;
  if (!root || !stage || !track || !line || !arrow || itemEls.length === 0)
    return;

  // 軌道超出舞台的量（函式值 + invalidateOnRefresh：resize 後 refresh 即重算）
  const shift = () => Math.max(0, track.scrollWidth - stage.clientWidth);
  const n = itemEls.length;

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      // 舞台為內容自然高度（非滿版）→ 置中時釘住；超過一屏退回貼頂（同 PhotoPanels）
      start: () =>
        root.clientHeight >= window.innerHeight ? 'top top' : 'center center',
      end: `+=${props.pinDistance}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        activeIdx.value = Math.min(n - 1, Math.floor(self.progress * n));
      },
    },
  });
  // 藍線靜態鋪滿；箭頭綁滾動沿線右移到線尾（函式值：resize refresh 後重算）
  tl.fromTo(
    arrow,
    { x: 0 },
    { x: () => Math.max(0, line.offsetWidth - arrow.offsetWidth), ease: 'none', duration: 1 },
    0,
  );
  // 橘色軌跡與箭頭同步（同 timeline、同線性 ease）：scaleX 長到箭頭左緣即可，
  // 箭頭自己的尾線（同高、橘色）接續其餘 153px，走過的線因此整段是橘的
  const trail = trailRef.value;
  if (trail) {
    tl.fromTo(
      trail,
      { scaleX: 0 },
      {
        scaleX: () =>
          Math.max(0, line.offsetWidth - arrow.offsetWidth) / Math.max(1, line.offsetWidth),
        ease: 'none',
        duration: 1,
      },
      0,
    );
  }
  itemEls.forEach((el, i) => {
    tl!.fromTo(
      el,
      { opacity: 0.5 },
      { opacity: 1, duration: 0.12, ease: 'none' },
      (i / n) * 0.85 + 0.05, // 箭頭抵達該欄的近似時間點
    );
  });
  if (shift() > 0) {
    tl.fromTo(track, { x: 0 }, { x: () => -shift(), ease: 'none', duration: 1 }, 0);
  }
}

function teardown() {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
  gsap.set(
    [trackRef.value, lineRef.value, trailRef.value, arrowRef.value, ...itemEls].filter(
      Boolean,
    ),
    { clearProps: 'all' },
  );
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  // end 固定、其餘皆函式值 → refresh 即可，免重建
  resizeTimer = setTimeout(refreshScrollTriggers, 200);
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rootRef.value?.classList.add('award-timeline--static');
    return;
  }
  build();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer);
  window.removeEventListener('resize', onResize);
  teardown();
});
</script>

<template>
  <section ref="rootRef" class="award-timeline">
    <div ref="stageRef" class="award-timeline__stage">
      <!-- 小標：放在 stage 內才會一起被 pin 住；間距由頁面在 slot 內容上標 -->
      <slot name="title" />

      <div ref="trackRef" class="award-timeline__track">
        <!-- 歷程線（藍，靜態鋪滿）+ 橘色軌跡（箭頭走過的段落）+ 橘色像素箭頭（隨捲動沿線右移） -->
        <div class="award-timeline__head" aria-hidden="true">
          <img
            ref="lineRef"
            class="award-timeline__line"
            src="/img/news/udn75_news_timeline_line.svg"
            alt=""
          />
          <span ref="trailRef" class="award-timeline__trail" />
          <img
            ref="arrowRef"
            class="award-timeline__arrow"
            src="/img/news/udn75_news_timeline_arrow.svg"
            alt=""
          />
        </div>

        <ol class="award-timeline__list">
          <li
            v-for="(item, i) in items"
            :key="i"
            :ref="(el) => setItem(el, i)"
            class="award-timeline__item"
            :style="{ '--w': `${item.width ?? 277}px` }"
          >
            <img
              class="award-timeline__year"
              :src="`/img/news/${item.year}.svg`"
              :alt="item.year"
            />
            <div
              v-for="(a, j) in item.awards"
              :key="j"
              class="award-timeline__award"
            >
              <p class="award-timeline__org">{{ a.org }}</p>
              <p v-for="(t, k) in a.titles" :key="k" class="award-timeline__title">
                {{ t }}
              </p>
              <p v-if="a.work" class="award-timeline__work">作品：{{ a.work }}</p>
            </div>
          </li>
        </ol>
      </div>

      <!-- 分頁點（進度指示，置中且不隨軌道平移） -->
      <div class="award-timeline__dots" aria-hidden="true">
        <span
          v-for="(_, i) in items"
          :key="i"
          class="award-timeline__dot"
          :class="{ 'award-timeline__dot--active': i === activeIdx }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.award-timeline {
  width: 100%;
  background: #fff;
}

// 舞台為內容自然高度（不撐 100vh）：pin 改在置中時釘住（見 build 的 start）
.award-timeline__stage {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

// 水平軌道：寬度跟著內容長（歷程線才能鋪滿全部年份欄位），過寬時由 timeline 左移
.award-timeline__track {
  width: max-content;
  min-width: 100%;
  padding: 0 26px;
  will-change: transform;

  @include rwd-min('tablet') {
    padding: 0 119px;
  }
  @include rwd-min('pc') {
    padding: 0 108px;
  }
}

// 歷程線列（44 高）：藍線落在 y20–24，與箭頭尾線同高；箭頭疊在線上隨捲動右移
.award-timeline__head {
  position: relative;
  height: 44px;
}

.award-timeline__line {
  position: absolute;
  top: 20px;
  left: 0;
  display: block;
  width: 100%;
  height: 4px;
}

// 箭頭走過的橘色軌跡：疊在藍線上、與藍線同幾何，scaleX 由 build() 的 timeline
// 隨捲動從 0 長到箭頭左緣（reduced-motion 靜態版維持 0 → 只見藍線）
.award-timeline__trail {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--color-orange);
  transform: scaleX(0);
  transform-origin: left center;
}

.award-timeline__arrow {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 153px;
  height: 44px;
}

// 對稿：三斷點同欄寬（--w）與 gap 48，pad/mob 靠軌道平移看完整排
.award-timeline__list {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

// 年份欄位：寬度對稿各欄不同（--w 由 template 帶入）
.award-timeline__item {
  flex-shrink: 0;
  width: var(--w, 277px);
}

// 年份數字：對稿向量字（/img/news/{year}.svg）
.award-timeline__year {
  display: block;
  height: 23px;
  margin: 0 0 8px;
}

.award-timeline__award {
  margin-top: 8px;
}

.award-timeline__org {
  margin: 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 400;
  color: var(--color-orange);
}

.award-timeline__title {
  margin: 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 400;
  color: var(--color-gray);
}

.award-timeline__work {
  margin: 0;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 300;
  color: var(--color-gray-light);
  text-align: justify; // 對稿：作品行左右對齊
}

.award-timeline__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.award-timeline__dot {
  width: 6px;
  height: 6px;
  background: var(--color-gray-light);
  opacity: 0.4;

  &--active {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
}

// reduced-motion 降級：原生橫向捲動、全部顯示
.award-timeline--static .award-timeline__stage {
  height: auto;
  padding: 64px 0;
  overflow-x: auto;
}
</style>
