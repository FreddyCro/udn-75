<script lang="ts" setup>
/**
 * FormulaBlocks — 「Publish X 議題智囊包」綁滾動區塊（news 頁）。
 *  - section pin 住，滾動推進：中心 block 先現身 → 4 個 block 從中心
 *    向四個角落展開 → 到位後 SVG 階梯格線從中心 block 延伸到四角 block。
 *  - 幾何（block 位移量、格線路徑）在 mount／resize 時實測計算；
 *    reduced-motion 直接呈現完成態（不 pin、線畫滿）。
 * TODO(figma): block 尺寸／格線樣式先照規格描述估值（參考 Junto
 *   CreativeFormula），取得檔案權限後對稿；文案為佔位示意。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface FormulaItem {
  title: string;
  desc?: string;
}

const props = withDefaults(
  defineProps<{
    /** 中心 block：eyebrow 小字＋標題 */
    center?: { eyebrow?: string; title?: string };
    /** 四角 block（依序：左上、右上、左下、右下） */
    items?: FormulaItem[];
    /** pin 期間可捲動距離（px） */
    pinDistance?: number;
  }>(),
  {
    center: () => ({ title: '議題智囊包' }),
    items: () => [],
    pinDistance: 1800,
  },
);

const POS = ['tl', 'tr', 'bl', 'br'] as const;

const rootRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const centerRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const blockEls: HTMLElement[] = [];
const setBlock = (el: any, i: number) => {
  if (el) blockEls[i] = el as HTMLElement;
};
const pathEls: SVGPathElement[] = [];
const setPath = (el: any, i: number) => {
  if (el) pathEls[i] = el as SVGPathElement;
};

let tl: gsap.core.Timeline | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let reduced = false;

/** 中心 block → 四角 block 的階梯格線（三段 Z 形，相對 stage 座標） */
function buildPaths() {
  const stage = stageRef.value;
  const center = centerRef.value;
  const svg = svgRef.value;
  if (!stage || !center || !svg) return;

  const s = stage.getBoundingClientRect();
  const c = center.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);

  blockEls.forEach((el, i) => {
    const path = pathEls[i];
    if (!el || !path) return;
    const b = el.getBoundingClientRect();
    const left = i % 2 === 0; // tl / bl
    const top = i < 2; // tl / tr
    // 起點：中心 block 靠該角的邊角；終點：角落 block 靠中心的邊角
    const x0 = (left ? c.left : c.right) - s.left;
    const y0 = (top ? c.top : c.bottom) - s.top;
    const x1 = (left ? b.right : b.left) - s.left;
    const y1 = (top ? b.bottom : b.top) - s.top;
    const xm = (x0 + x1) / 2;
    path.setAttribute('d', `M ${x0} ${y0} L ${xm} ${y0} L ${xm} ${y1} L ${x1} ${y1}`);
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
  });
}

function build() {
  const root = rootRef.value;
  const center = centerRef.value;
  if (!root || !center || blockEls.length === 0) return;

  // 角落 block 的 CSS 定位即最終位置；量測與中心的差值作為起點位移
  const c = center.getBoundingClientRect();
  const deltas = blockEls.map((el) => {
    const b = el.getBoundingClientRect();
    return {
      dx: c.left + c.width / 2 - (b.left + b.width / 2),
      dy: c.top + c.height / 2 - (b.top + b.height / 2),
    };
  });
  buildPaths();

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: `+=${props.pinDistance}`,
      pin: true,
      scrub: 0.5,
    },
  });
  tl
    // 中心 block 現身
    .from(center, { scale: 0.7, autoAlpha: 0, duration: 0.35, ease: 'power2.out' })
    // 4 block 從中間展開到四角
    .from(blockEls, {
      x: (i: number) => deltas[i]!.dx,
      y: (i: number) => deltas[i]!.dy,
      scale: 0.5,
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.08,
    })
    // 格線從中心延伸到四角
    .to(pathEls, { strokeDashoffset: 0, duration: 0.8, ease: 'none', stagger: 0.1 }, '>-0.1')
    .to({}, { duration: 0.25 }); // 尾端停留
}

function teardown() {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
  gsap.set([...blockEls, centerRef.value].filter(Boolean), { clearProps: 'all' });
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (reduced) {
      buildPaths();
      return;
    }
    teardown();
    build();
    ScrollTrigger.refresh();
  }, 200);
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    buildPaths(); // 完成態：block 在定位、格線畫滿
  } else {
    build();
  }
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer);
  window.removeEventListener('resize', onResize);
  teardown();
});
</script>

<template>
  <section ref="rootRef" class="formula">
    <div ref="stageRef" class="formula__stage">
      <svg ref="svgRef" class="formula__lines" aria-hidden="true">
        <path
          v-for="(_, i) in items.slice(0, 4)"
          :key="i"
          :ref="(el) => setPath(el, i)"
          class="formula__line"
        />
      </svg>

      <div ref="centerRef" class="formula__center">
        <p v-if="center.eyebrow" class="formula__center-eyebrow">
          {{ center.eyebrow }}
        </p>
        <p class="formula__center-title">{{ center.title }}</p>
      </div>

      <div
        v-for="(b, i) in items.slice(0, 4)"
        :key="i"
        :ref="(el) => setBlock(el, i)"
        class="formula__block"
        :class="`formula__block--${POS[i]}`"
      >
        <p class="formula__block-title">{{ b.title }}</p>
        <p v-if="b.desc" class="formula__block-desc">{{ b.desc }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.formula {
  width: 100%;
  background: #fff;
}

.formula__stage {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.formula__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.formula__line {
  fill: none;
  stroke: var(--color-orange);
  stroke-width: 2;
}

// 中心 block
.formula__center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 280px;
  height: 160px;
  padding: 20px;
  text-align: center;
  color: #fff;
  background: var(--color-orange);
  border-radius: 12px;
  transform: translate(-50%, -50%);

  @include rwd-mobile {
    width: 200px;
    height: 120px;
  }
}

.formula__center-eyebrow {
  margin: 0;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  letter-spacing: 0.08em;
}

.formula__center-title {
  margin: 0;
  font-size: var(--text-h4);
  line-height: var(--text-h4--line-height);
  font-weight: 500;

  @include rwd-mobile {
    font-size: var(--text-h5);
    line-height: var(--text-h5--line-height);
  }
}

// 四角 block：CSS 定位即動畫終點
.formula__block {
  position: absolute;
  width: 240px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

  @include rwd-mobile {
    width: 156px;
    padding: 12px 16px;
  }

  &--tl {
    top: 8%;
    left: 6%;
  }
  &--tr {
    top: 8%;
    right: 6%;
  }
  &--bl {
    bottom: 8%;
    left: 6%;
  }
  &--br {
    bottom: 8%;
    right: 6%;
  }
}

.formula__block-title {
  margin: 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 500;
  color: var(--color-text);

  @include rwd-mobile {
    font-size: var(--text-body);
    line-height: 24px;
  }
}

.formula__block-desc {
  margin: 8px 0 0;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  color: var(--color-gray);

  @include rwd-mobile {
    display: none; // 小螢幕只留標題
  }
}
</style>
