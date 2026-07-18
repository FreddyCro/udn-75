<script lang="ts" setup>
/**
 * AwardTimeline — 獲獎歷程綁滾動時間軸（news 頁）。
 *  - 不 pin：中央直線隨滾動進度長高（scrub），行經的里程碑
 *    （年份＋獎項）逐一淡入；桌機左右交錯、手機靠左單欄。
 *  - reduced-motion：全部直接顯示。
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
  }>(),
  {
    items: () => [],
  },
);

const rootRef = ref<HTMLElement | null>(null);
const lineRef = ref<HTMLElement | null>(null);
const itemEls: HTMLElement[] = [];
const setItem = (el: any, i: number) => {
  if (el) itemEls[i] = el as HTMLElement;
};

let lineTween: gsap.core.Tween | null = null;
let itemTweens: gsap.core.Tween[] = [];

onMounted(() => {
  const root = rootRef.value;
  const line = lineRef.value;
  if (!root || !line) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 中線隨滾動長高
  lineTween = gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.4,
      },
    },
  );

  // 里程碑：行經視窗 78% 時淡入（各自觸發一次）
  itemTweens = itemEls.map((el) =>
    gsap.from(el, {
      autoAlpha: 0,
      y: 36,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    }),
  );
});

onBeforeUnmount(() => {
  [lineTween, ...itemTweens].forEach((t) => {
    t?.scrollTrigger?.kill();
    t?.kill();
  });
});
</script>

<template>
  <div ref="rootRef" class="award-timeline">
    <div ref="lineRef" class="award-timeline__line" aria-hidden="true" />
    <ol class="award-timeline__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        :ref="(el) => setItem(el, i)"
        class="award-timeline__item"
        :class="{ 'award-timeline__item--alt': i % 2 === 1 }"
      >
        <span class="award-timeline__dot" aria-hidden="true" />
        <p class="award-timeline__year">{{ item.year }}</p>
        <p class="award-timeline__title">{{ item.title }}</p>
        <p v-if="item.desc" class="award-timeline__desc">{{ item.desc }}</p>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.award-timeline {
  position: relative;
  width: 100%;
  max-width: var(--subpage-wide-w);
  margin: 0 auto;
  padding: 40px 20px 64px;
}

// 中線：桌機置中、手機靠左；scaleY 由 JS 依滾動推進
.award-timeline__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: var(--color-orange);
  transform-origin: 50% 0;

  @include rwd-tablet {
    left: 28px;
  }
}

.award-timeline__list {
  display: flex;
  flex-direction: column;
  gap: 56px;
  margin: 0;
  padding: 0;
  list-style: none;

  @include rwd-tablet {
    gap: 40px;
  }
}

// 桌機左右交錯：預設卡片在左半、節點貼中線；--alt 移到右半
.award-timeline__item {
  position: relative;
  width: calc(50% - 40px);
  text-align: right;

  &--alt {
    align-self: flex-end;
    text-align: left;
  }

  @include rwd-tablet {
    width: auto;
    margin-left: 64px;
    text-align: left;

    &--alt {
      align-self: auto;
    }
  }
}

// 節點：貼中線的橘色方點（像素感）
.award-timeline__dot {
  position: absolute;
  top: 6px;
  right: -46px;
  width: 12px;
  height: 12px;
  background: var(--color-orange);

  .award-timeline__item--alt & {
    right: auto;
    left: -46px;
  }

  @include rwd-tablet {
    right: auto;
    left: -42px;

    .award-timeline__item--alt & {
      left: -42px;
    }
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
</style>
