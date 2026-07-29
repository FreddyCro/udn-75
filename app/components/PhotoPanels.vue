<script lang="ts" setup>
/**
 * PhotoPanels — 照片橫向軌道綁滾動平移（pin + scrub，news 頁）。
 * mob（<768）改直排圖列不 pin；reduced-motion 改原生橫向捲動。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface PanelPhoto {
  /** UPic 圖片路徑（不含副檔名與裝置後綴，如 /img/news/udn75_pic04_01） */
  src: string;
  alt?: string;
  caption?: string;
}

withDefaults(
  defineProps<{
    photos?: PanelPhoto[];
  }>(),
  {
    photos: () => [],
  },
);

const rootRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

let tl: gsap.core.Timeline | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function build() {
  const root = rootRef.value;
  const stage = stageRef.value;
  const track = trackRef.value;
  if (!root || !stage || !track) return;

  // 軌道超出舞台的量 = 需要平移的距離（含左右緩衝 padding）
  // 以函式回傳 + invalidateOnRefresh：resize 後 refresh 即重算，不必重建
  const shift = () => Math.max(0, track.scrollWidth - stage.clientWidth);
  if (shift() === 0) return; // 照片不夠寬就不動

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${shift()}`, // 捲動距離 = 位移量 → 垂直水平 1:1，不搶拍
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo(track, { x: 0 }, { x: () => -shift(), ease: 'none', duration: 1 });
}

function teardown() {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
  if (trackRef.value) gsap.set(trackRef.value, { clearProps: 'x' });
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  // end / x 皆為函式值 + invalidateOnRefresh → refresh 即重算，免重建
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}

// mob（<768）為 CSS 直排圖列，不建 pin；跨斷點時拆掉／重建
let mq: MediaQueryList | null = null;
const onMqChange = (e: MediaQueryListEvent) => {
  teardown();
  if (e.matches) build();
};

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  // 降級：不 pin，交給 CSS 原生橫向捲動（.photo-panels--static）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rootRef.value?.classList.add('photo-panels--static');
    return;
  }
  mq = window.matchMedia(`(min-width: ${TABLET_BREAKPOINTS}px)`);
  mq.addEventListener('change', onMqChange);
  if (mq.matches) build();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer);
  window.removeEventListener('resize', onResize);
  mq?.removeEventListener('change', onMqChange);
  teardown();
});
</script>

<template>
  <section ref="rootRef" class="photo-panels">
    <div ref="stageRef" class="photo-panels__stage">
      <div ref="trackRef" class="photo-panels__track">
        <figure v-for="(p, i) in photos" :key="i" class="photo-panels__item">
          <UPic
            classname="photo-panels__img"
            :src="p.src"
            :use-prefix="false"
            :srcset="['mob']"
            :width="480"
            :height="320"
            :alt="p.alt ?? ''"
          />
          <figcaption v-if="p.caption" class="photo-panels__caption">
            {{ p.caption }}
          </figcaption>
        </figure>
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
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  @include rwd-max('tablet') {
    height: auto; // mob 直排：不 pin、不滿版
  }
}

// 水平軌道：x 位移由 timeline 依滾動推進（由左至右看完整排照片）
// mob 改直排圖列（gap 32、欄邊距 26、圖說間距 12）
.photo-panels__track {
  display: flex;
  align-items: flex-start; // 照片同尺寸頂端對齊；圖說行數不影響照片水平線
  gap: 80px;
  padding: 0 108px;
  will-change: transform;

  @include rwd-max('pc') {
    padding: 0 119px;
  }
  @include rwd-max('tablet') {
    flex-direction: column;
    width: 100%;
    gap: 32px;
    padding: 0 26px;
    will-change: auto;
  }
}

// 寬度 = 設計稿定值 480px（同 @1x 素材自然尺寸，不放大不失真）
.photo-panels__item {
  flex-shrink: 0;
  width: 480px;
  margin: 0;

  @include rwd-max('tablet') {
    width: 100%;
  }
}

.photo-panels__item :deep(.photo-panels__img) {
  display: block;
  width: 100%;
  height: auto;
}

.photo-panels__caption {
  margin-top: 16px; // 對稿定值（此區 16，非全站 --sp-img-caption 的 12）
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: var(--color-gray);

  @include rwd-max('tablet') {
    margin-top: 12px;
  }
}

// reduced-motion 降級：原生橫向捲動
.photo-panels--static .photo-panels__stage {
  height: auto;
  padding: 40px 0;
  overflow-x: auto;
}
</style>
