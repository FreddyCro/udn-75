<script lang="ts" setup>
/**
 * PhotoPanels — 數張照片「由左至右」綁滾動（news 頁）。
 *  - section pin 住，滾動推進：水平照片軌道往左平移，照片依序
 *    由左至右進入畫面（scrub）；每張照片下方有各自的圖說。
 *  - reduced-motion：不 pin，軌道改為原生橫向捲動。
 * TODO(figma): 照片尺寸／間距先照參考站（doodle p-top-about__panels-wrap）
 *   估值，取得檔案權限後對稿；圖片為佔位圖。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface PanelPhoto {
  src: string;
  alt?: string;
  caption?: string;
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
  const shift = Math.max(0, track.scrollWidth - stage.clientWidth);
  if (shift === 0) return; // 照片不夠寬就不動

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: `+=${props.pinDistance}`,
      pin: true,
      scrub: 0.5,
    },
  });
  tl.fromTo(track, { x: 0 }, { x: -shift, ease: 'none', duration: 1 });
}

function teardown() {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
  if (trackRef.value) gsap.set(trackRef.value, { clearProps: 'x' });
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
  // 降級：不 pin，交給 CSS 原生橫向捲動（.photo-panels--static）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rootRef.value?.classList.add('photo-panels--static');
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
  <section ref="rootRef" class="photo-panels">
    <div ref="stageRef" class="photo-panels__stage">
      <div ref="trackRef" class="photo-panels__track">
        <figure v-for="(p, i) in photos" :key="i" class="photo-panels__item">
          <img class="photo-panels__img" :src="p.src" :alt="p.alt ?? ''" />
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
}

// 水平軌道：x 位移由 timeline 依滾動推進（由左至右看完整排照片）
.photo-panels__track {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 0 8vw;
  will-change: transform;

  @include rwd-mobile {
    gap: 24px;
  }
}

.photo-panels__item {
  flex-shrink: 0;
  width: min(46vw, 660px);
  margin: 0;

  @include rwd-mobile {
    width: 78vw;
  }
}

.photo-panels__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.14);
}

.photo-panels__caption {
  margin-top: var(--sp-img-caption);
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: var(--color-gray);
}

// reduced-motion 降級：原生橫向捲動
.photo-panels--static .photo-panels__stage {
  height: auto;
  padding: 40px 0;
  overflow-x: auto;
}
</style>
