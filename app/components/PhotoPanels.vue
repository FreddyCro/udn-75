<script lang="ts" setup>
/**
 * PhotoPanels — 數張照片綁滾動（news 頁）。
 *  - section pin 住，滾動推進：照片一張張從畫面下方滑入，帶少量旋轉，
 *    依預設版位（錯落擺放）堆疊成相片牆。
 *  - 版位表循環使用，照片數量不限；reduced-motion 直接呈現完成態。
 * TODO(figma): 版位／尺寸先照參考站（doodle p-top-about__panels-wrap）
 *   估值，取得檔案權限後對稿；圖片為佔位圖。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface PanelPhoto {
  src: string;
  alt?: string;
}

const props = withDefaults(
  defineProps<{
    photos?: PanelPhoto[];
    /** pin 期間可捲動距離（px） */
    pinDistance?: number;
  }>(),
  {
    photos: () => [],
    pinDistance: 2000,
  },
);

/** 錯落版位表（相對 stage 中心的 % 位移與旋轉），照片多於表長時循環 */
const LAYOUT = [
  { x: -26, y: -10, r: -7 },
  { x: 24, y: -16, r: 6 },
  { x: -12, y: 14, r: -4 },
  { x: 27, y: 12, r: 8 },
  { x: 0, y: -2, r: 2 },
  { x: -30, y: 4, r: 5 },
];

const slotOf = (i: number) => LAYOUT[i % LAYOUT.length]!;

const rootRef = ref<HTMLElement | null>(null);
const photoEls: HTMLElement[] = [];
const setPhoto = (el: any, i: number) => {
  if (el) photoEls[i] = el as HTMLElement;
};

let tl: gsap.core.Timeline | null = null;

onMounted(() => {
  const root = rootRef.value;
  if (!root || photoEls.length === 0) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: `+=${props.pinDistance}`,
      pin: true,
      scrub: 0.5,
    },
  });
  photoEls.forEach((el, i) => {
    tl!.from(
      el,
      {
        yPercent: 180,
        rotation: slotOf(i).r + (i % 2 === 0 ? 18 : -18),
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.out',
      },
      i * 0.85,
    );
  });
  tl.to({}, { duration: 0.3 }); // 尾端停留
});

onBeforeUnmount(() => {
  tl?.scrollTrigger?.kill();
  tl?.kill();
});
</script>

<template>
  <section ref="rootRef" class="photo-panels">
    <div class="photo-panels__stage">
      <div
        v-for="(p, i) in photos"
        :key="i"
        :ref="(el) => setPhoto(el, i)"
        class="photo-panels__item"
        :style="{
          '--px': `${slotOf(i).x}%`,
          '--py': `${slotOf(i).y}%`,
          '--pr': `${slotOf(i).r}deg`,
          zIndex: i + 1,
        }"
      >
        <img class="photo-panels__img" :src="p.src" :alt="p.alt ?? ''" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.photo-panels {
  width: 100%;
  background: #fff;
}

.photo-panels__stage {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// 版位：以 stage 中心為原點，用 CSS 變數擺到各自定位（動畫終點）
.photo-panels__item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(34vw, 480px);
  transform: translate(-50%, -50%) translate(var(--px), var(--py))
    rotate(var(--pr));

  @include rwd-mobile {
    width: 64vw;
  }
}

.photo-panels__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.18);
}
</style>
