<script lang="ts" setup>
/**
 * PhotoPanels — 照片橫向軌道綁滾動平移（pin + scrub，news 頁）。
 * mob（<768）改直排圖列不 pin；reduced-motion 改原生橫向捲動。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  killScrollTriggers,
  refreshScrollTriggers,
} from '@/utils/scroll-trigger';

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

/**
 * 近視窗才把 <UPic> 掛上去（＝才發出圖片請求）。在此之前渲染同尺寸的佔位方塊。
 *
 * 為什麼需要：連續閱讀頁（pages/subpage.vue，<768 專用）把六篇串成一份 55,000 px 的
 * 文件，而本元件在 news（第 1 篇）與 health（第 6 篇）各有一組。實測第一屏就下載
 * 全部 9 張，其中 health 那 5 張在 45,000 px 之外。正式站對 request 次數限流，
 * 進子頁那一刻的尖峰是 62 個／秒，這 9 張是其中最容易拿掉的一塊。
 *
 * ⚠️ **只在 <768 開閘門，≥768 一律立即掛載。** 下方 eager 那條註解說的防掉幀理由
 *    （pin + scrub 的水平軌道、pin 期間 position: fixed 使原生 lazy 失效）只在
 *    ≥768 成立 —— build() 的 mq 就是 `min-width: TABLET_BREAKPOINTS`，<768 根本不 pin、
 *    是 CSS 直排圖列。所以在真正會掉幀的斷點上，行為與改動前完全相同。
 *
 * 佔位方塊的 aspect-ratio 用 480/320 ＝ <UPic> 的 width/height 屬性，也就是瀏覽器在
 * 圖片載入完成前本來就會保留的比例 —— 換上真圖時盒子不變，build() 量到的
 * track.scrollWidth 也不變（軌道寬度由 CSS 的 .photo-panels__item 決定，不靠圖片）。
 */
const near = ref(false);
let nearObserver: IntersectionObserver | null = null;

let tl: gsap.core.Timeline | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function build() {
  const root = rootRef.value;
  const stage = stageRef.value;
  const track = trackRef.value;
  if (!root || !stage || !track) return;

  // 軌道超出舞台的量 = 需平移的距離。以函式回傳搭配 invalidateOnRefresh，
  // resize 後 refresh 即重算，不必重建 timeline。
  const shift = () => Math.max(0, track.scrollWidth - stage.clientWidth);
  if (shift() === 0) return; // 照片不夠寬就不動

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      // 舞台為內容自然高度（非滿版）→ 置中時釘住，上下仍看得到前後文；
      // 若自然高度超過一屏（橫式手機等）退回貼頂，避免頂部被裁
      start: () =>
        root.clientHeight >= window.innerHeight ? 'top top' : 'center center',
      end: () => `+=${shift() * 0.7}`,
      pin: true,
      // 不設 anticipatePin：center center 起點的 pin 提早釘住＝可見的跳位，
      // 理由與量測見 AwardTimeline 的同一條註解
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo(track, { x: 0 }, { x: () => -shift(), ease: 'none', duration: 1 });
}

/**
 * @param quiet 卸載路徑傳 true ＝ 不 revert、不 clearProps（同 FormulaBlocks 的 teardown）。
 *   跨斷點重建**要** revert（緊接著重新量測，殘留 inline 樣式會失準）；換頁卸載**不要**
 *   —— 舊頁還在畫面上淡出，拔掉 pin-spacer 會讓下方版面跳一段而被看見。
 */
function teardown(quiet = false) {
  if (quiet) {
    killScrollTriggers(tl?.scrollTrigger);
    tl?.kill();
    tl = null;
    return;
  }
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
  if (trackRef.value) gsap.set(trackRef.value, { clearProps: 'x' });
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(refreshScrollTriggers, 200);
}

// mob（<768）為 CSS 直排圖列，不建 pin；跨斷點時拆掉／重建
let mq: MediaQueryList | null = null;
const onMqChange = (e: MediaQueryListEvent) => {
  // 跨到 ≥768 就直接開閘：那個斷點有 pin + scrub，不該再等 observer
  if (e.matches) openGate();
  teardown();
  if (e.matches) build();
  // 拆掉／重建都改變佔位與隊列順序 → 走共用 sort+refresh 讓下方 pin 重算
  refreshScrollTriggers();
};

/** 開閘：掛上真圖，並收掉 observer（near 一旦 true 不再翻回） */
function openGate() {
  near.value = true;
  nearObserver?.disconnect();
  nearObserver = null;
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  // ≥768 立即開閘（那裡有 pin + scrub，見 near 的註解）；<768 才等 observer。
  // 沒有 IntersectionObserver 的環境一律當作已在視窗內 —— 寧可多抓也不要不顯示。
  const wide = window.matchMedia(`(min-width: ${TABLET_BREAKPOINTS}px)`).matches;
  if (wide || !('IntersectionObserver' in window)) {
    openGate();
  } else {
    nearObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) openGate();
      },
      // 1.5 個視窗的提前量（390×844 約 1,266 px）：<768 沒有 pin／scrub，
      // 只要在使用者捲到之前開始抓就夠，不需要 scrub 那種等級的提前量。
      { rootMargin: '150% 0px', threshold: 0 },
    );
    if (rootRef.value) nearObserver.observe(rootRef.value);
  }

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
  nearObserver?.disconnect();
  nearObserver = null;
  teardown(true);
});
</script>

<template>
  <section ref="rootRef" class="photo-panels">
    <div ref="stageRef" class="photo-panels__stage">
      <div ref="trackRef" class="photo-panels__track">
        <figure v-for="(p, i) in photos" :key="i" class="photo-panels__item">
          <!-- eager：軌道是水平平移進場，lazy 圖會在 scrub 途中才解碼、造成掉幀 -->
          <!-- 這裡刻意不用 lazy：此軌道為 pin + scrub 的水平平移，若 lazy 會在 scrub
               途中才解碼造成掉幀；且 pin 期間元素為 position: fixed，Chrome 在該狀態下
               本來就會忽略 loading="lazy"（實測見 architecture/2026-09-04-request-reduction-design.md §2.1）。
               省下的至多 9 個請求，不值得換已知的體驗問題 -->
          <UPic
            v-if="near"
            classname="photo-panels__img"
            :src="p.src"
            :use-prefix="false"
            :srcset="['mob']"
            :width="480"
            :height="320"
            loading="eager"
            :alt="p.alt ?? ''"
          />
          <!-- 佔位：與 <UPic> 載入前同尺寸（480/320 ＝ 上面的 width/height），
               所以開閘前後 track.scrollWidth 不變。見 near 的註解 -->
          <div v-else class="photo-panels__placeholder" aria-hidden="true" />
          <!-- 圖說可含 <a> 外連結（文案為本地靜態檔，非使用者輸入） -->
          <figcaption
            v-if="p.caption"
            class="photo-panels__caption"
            v-html="p.caption"
          />
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
  height: auto;
  overflow: hidden;
}

// mob 直排；pad 以上為水平軌道，x 位移由 timeline 依滾動推進
.photo-panels__track {
  display: flex;
  flex-direction: column;
  align-items: flex-start; // 照片同尺寸頂端對齊；圖說行數不影響照片水平線
  width: 100%;
  gap: 32px;
  padding: 0 26px;
  will-change: auto;

  @include rwd-min('tablet') {
    flex-direction: row;
    width: auto;
    gap: 80px;
    padding: 0 119px;
    will-change: transform;
  }

  @include rwd-min('pc') {
    padding: 0 108px;
  }
}

// pad 以上寬度＝ @1x 素材自然尺寸，不放大不失真
.photo-panels__item {
  flex-shrink: 0;
  width: 100%;
  margin: 0;

  @include rwd-min('tablet') {
    width: 480px;
  }
}

.photo-panels__item :deep(.photo-panels__img) {
  display: block;
  width: 100%;
  height: auto;
}

// 開閘前的佔位：比例與 <UPic> 的 width/height 一致，換上真圖時盒子不變
.photo-panels__placeholder {
  display: block;
  width: 100%;
  aspect-ratio: 480 / 320;
}

.photo-panels__caption {
  margin-top: 8px;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: var(--color-gray);
  font-weight: 300;

  // 圖說內的外連結（v-html 輸出，scoped 樣式須 :deep）
  :deep(a) {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: var(--color-orange);
    }
  }
}

// reduced-motion 降級：原生橫向捲動
.photo-panels--static .photo-panels__stage {
  height: auto;
  padding: 40px 0;
  overflow-x: auto;
}
</style>
