<script lang="ts" setup>
/**
 * AwardTimeline — 獲獎歷程「由左至右」綁滾動橫向時間軸（news 頁）。
 *  - section pin 住，滾動推進：水平中線由左往右長出（scaleX），
 *    里程碑（年份＋獎項）依序淡入，卡片上下交錯；
 *    軌道比舞台寬時同步往左平移（小螢幕）。
 *  - reduced-motion：不 pin，全部直接顯示、軌道原生橫向捲動。
 * TODO(figma): 樣式先照參考站（Junto WorkSteps theme-blue → 本站橘）
 *   估值，取得檔案權限後對稿；里程碑內容為佔位示意。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface TimelineItem {
  year: string;
  title: string;
  desc?: string;
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
  if (!root || !stage || !track || !line || itemEls.length === 0) return;

  const shift = Math.max(0, track.scrollWidth - stage.clientWidth);

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: `+=${props.pinDistance}`,
      pin: true,
      scrub: 0.5,
    },
  });
  // 中線由左至右長出；里程碑跟著線頭依序浮現；軌道同步左移（過寬時）
  tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
  itemEls.forEach((el, i) => {
    tl!.from(
      el,
      { autoAlpha: 0, y: 32, duration: 0.18, ease: 'power2.out' },
      (i / itemEls.length) * 0.9 + 0.04, // 線頭抵達該節點的近似時間點
    );
  });
  if (shift > 0) {
    tl.fromTo(track, { x: 0 }, { x: -shift, ease: 'none', duration: 1 }, 0);
  }
}

function teardown() {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
  gsap.set([trackRef.value, lineRef.value, ...itemEls].filter(Boolean), {
    clearProps: 'all',
  });
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    teardown();
    build();
    ScrollTrigger.refresh();
  }, 200);
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
      <div ref="trackRef" class="award-timeline__track">
        <div ref="lineRef" class="award-timeline__line" aria-hidden="true" />
        <ol class="award-timeline__list">
          <li
            v-for="(item, i) in items"
            :key="i"
            :ref="(el) => setItem(el, i)"
            class="award-timeline__item"
            :class="{ 'award-timeline__item--below': i % 2 === 1 }"
          >
            <span class="award-timeline__dot" aria-hidden="true" />
            <div class="award-timeline__card">
              <p class="award-timeline__year">{{ item.year }}</p>
              <p class="award-timeline__title">{{ item.title }}</p>
              <p v-if="item.desc" class="award-timeline__desc">
                {{ item.desc }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.award-timeline {
  width: 100%;
  background: #fff;
}

.award-timeline__stage {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// 水平軌道：內容比舞台寬時由 timeline 左移
.award-timeline__track {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 100%;
  padding: 0 8vw;
  will-change: transform;
}

// 水平中線：置於軌道垂直中央，scaleX 由左至右長出
.award-timeline__line {
  position: absolute;
  top: 50%;
  right: 8vw;
  left: 8vw;
  height: 2px;
  background: var(--color-orange);
  transform-origin: 0 50%;
}

.award-timeline__list {
  display: flex;
  align-items: center;
  gap: 64px;
  margin: 0;
  padding: 0;
  list-style: none;

  @include rwd-mobile {
    gap: 40px;
  }
}

// 里程碑：li 高度 0、被 flex 垂直置中 → 正好落在中線上；
// 卡片以絕對定位放在中線上方，--below 交錯放到下方
.award-timeline__item {
  position: relative;
  flex-shrink: 0;
  width: 240px;
  height: 0;

  @include rwd-mobile {
    width: 200px;
  }
}

// 節點方點（像素感）：貼齊中線
.award-timeline__dot {
  position: absolute;
  top: -6px;
  left: 0;
  width: 12px;
  height: 12px;
  background: var(--color-orange);
}

.award-timeline__card {
  position: absolute;
  bottom: 28px;
  left: 0;
  width: 100%;

  .award-timeline__item--below & {
    top: 28px;
    bottom: auto;
  }
}

.award-timeline__year {
  margin: 0;
  font-size: var(--text-h4);
  line-height: var(--text-h4--line-height);
  font-weight: 700;
  color: var(--color-orange);
}

.award-timeline__title {
  margin: 4px 0 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 500;
  color: var(--color-text);
}

.award-timeline__desc {
  margin: 8px 0 0;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  color: var(--color-gray);
}

// reduced-motion 降級：原生橫向捲動、全部顯示
.award-timeline--static .award-timeline__stage {
  height: auto;
  padding: 64px 0;
  overflow-x: auto;
}
</style>
