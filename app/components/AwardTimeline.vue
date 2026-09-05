<script lang="ts" setup>
/**
 * AwardTimeline — 獲獎歷程橫向時間軸（pin + scrub，news 頁）。
 * pin 的是本元件的 root，故小標要一起釘住就得放進來：用 #title slot，
 * 會渲染在 __stage 內（100vh flex column），與軌道同框垂直置中。
 * reduced-motion 改原生橫向捲動。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  killScrollTriggers,
  refreshScrollTriggers,
} from '@/utils/scroll-trigger';
import {
  articleSpriteHref,
  articleSpriteViewBox,
} from '@/utils/article-sprite';

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

// 年份圖是 runtime 才組出來的路徑，Vite 編譯期無法改寫成 base 感知的 URL，
// 得自己補 APP_ASSETS_PATH（同 useAssetUrl.ts 的說明）。
const assetUrl = useAssetUrl();

// 歷程線／箭頭／年份數字都走 article sprite（見 utils/article-sprite.ts）：
// 原本 7 個 request（線 1、箭頭 1、年份 5），現在與其他內文素材共用同一支、共 1 個。
const LINE_SRC = '/img/news/udn75_news_timeline_line.svg';
const ARROW_SRC = '/img/news/udn75_news_timeline_arrow.svg';
const yearSrc = (year: string) => `/img/news/${year}.svg`;
const artHref = (src: string) => articleSpriteHref(src, assetUrl);

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

/** 箭頭尖端走到欄寬的幾分之幾就讓該欄 active（0.1 = 一進欄位就亮） */
const ITEM_ACTIVE_AT = 0.1;

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

  // active 判定改看實際幾何（欄寬各異，用 progress 等分會失準）：
  // 箭頭尖端（右緣，見 svg 箭頭在 x129–153）越過「該欄左緣 + 10% 欄寬」即 active。
  // marks[i] 存成箭頭的 x 值門檻，onUpdate 只比數字、不觸發 reflow。
  const head = arrow.parentElement!; // .award-timeline__head，箭頭的 offsetParent
  let marks: number[] = [];
  const measure = () => {
    const base = head.offsetLeft; // 與 li 的 offsetLeft 同基準（head 非 li 的祖先）
    marks = itemEls.map(
      (el) => el.offsetLeft - base + el.offsetWidth * ITEM_ACTIVE_AT - arrow.offsetWidth,
    );
  };

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      // 舞台為內容自然高度（非滿版）→ 置中時釘住；超過一屏退回貼頂（同 PhotoPanels）
      start: () =>
        root.clientHeight >= window.innerHeight ? 'top top' : 'center center',
      end: `+=${props.pinDistance}`,
      pin: true,
      // 不設 anticipatePin：它依速度提早釘住，center center 起點快捲時會把整塊
      // 提前跳到置中定位、壓住上方還沒捲走的段落（4:3 高視窗實測提早 259px、
      // 疊字 195px 並停格）。準時 pin 最多晚一幀在自己的留白內回吸，碰不到文字。
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: measure, // 版面／欄寬變動後重量門檻
      onUpdate: () => {
        // 讀 GSAP 快取的 x（非 DOM 量測）：找出尖端已越過的最後一欄
        const x = gsap.getProperty(arrow, 'x') as number;
        let idx = 0;
        for (let i = 0; i < marks.length; i++) {
          if (x >= marks[i]!) idx = i;
        }
        activeIdx.value = idx;
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
  // 年份欄位的 opacity 一律由 CSS 固定 0.5／1（走過的欄位），這裡不做 tween
  if (shift() > 0) {
    tl.fromTo(track, { x: 0 }, { x: () => -shift(), ease: 'none', duration: 1 }, 0);
  }
  measure(); // onRefresh 之外先量一次，確保首屏就有門檻可比
}

/**
 * 只有卸載路徑會呼叫（無跨斷點重建）→ 一律不 revert、不 clearProps：舊頁還要在畫面上
 * 淡出 220ms，拔掉 pin-spacer 會讓下方版面跳一段而被看見（見 utils/scroll-trigger 的
 * killScrollTriggers）。DOM 下一刻就丟掉，收拾 inline 樣式沒有實際效益。
 */
function teardown() {
  killScrollTriggers(tl?.scrollTrigger);
  tl?.kill();
  tl = null;
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
          <!-- ⚠️ ref 掛在 <span> 而不是 <svg>：build() 用 line.offsetWidth /
               arrow.offsetWidth 做幾何量測，而 offsetWidth 是 HTMLElement 的屬性，
               SVGElement 沒有。外層 span 沿用原本的 class（本來就是 display:block
               ＋ 定死尺寸），幾何與改動前完全相同。 -->
          <span ref="lineRef" class="award-timeline__line">
            <!-- preserveAspectRatio="none"：原本是 <img width:100% height:4px>＝
                 拉伸，而 svg 預設會依 viewBox（1064×4）等比留白 -->
            <svg
              class="award-timeline__head-svg"
              :viewBox="articleSpriteViewBox(LINE_SRC)"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <use :href="artHref(LINE_SRC)" />
            </svg>
          </span>
          <span ref="trailRef" class="award-timeline__trail" />
          <span ref="arrowRef" class="award-timeline__arrow">
            <svg
              class="award-timeline__head-svg"
              :viewBox="articleSpriteViewBox(ARROW_SRC)"
              aria-hidden="true"
            >
              <use :href="artHref(ARROW_SRC)" />
            </svg>
          </span>
        </div>

        <ol class="award-timeline__list">
          <li
            v-for="(item, i) in items"
            :key="i"
            :ref="(el) => setItem(el, i)"
            class="award-timeline__item"
            :class="{ 'award-timeline__item--passed': i <= activeIdx }"
            :style="{ '--w': item.width ?? 277 }"
          >
            <!-- viewBox 必填：.award-timeline__year 只定 height、寬度靠比例長出來，
                 而年份 2022–2026 的原始寬高各不相同（76×24 / 78×24 / 73×22…）。
                 外部 <use> 的 viewBox 在 <symbol> 上，外層 svg 沒有內在尺寸。 -->
            <svg
              class="award-timeline__year"
              role="img"
              :aria-label="item.year"
              :viewBox="articleSpriteViewBox(yearSrc(item.year))"
            >
              <use :href="artHref(yearSrc(item.year))" />
            </svg>
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
// <375 等比縮放：mob 稿以 375 為基準，欄寬 400 + 左內距 26 在 320 級窄機上放不下、
// 作品行被裁掉 → 整條時間軸（幾何、字級）一律以 375 稿值等比走 vw。
// JS 端（build/measure）量的都是實際 offsetWidth/offsetLeft，跟著縮放不必另外處理。
@function sm($px) {
  @return calc(#{$px} / 375 * 100vw);
}

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

  @include rwd-max(375px) {
    padding: 0 sm(26);
  }
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

  @include rwd-max(375px) {
    height: sm(44);
  }
}

.award-timeline__line {
  position: absolute;
  top: 20px;
  left: 0;
  display: block;
  width: 100%;
  height: 4px;

  @include rwd-max(375px) {
    top: sm(20);
    height: sm(4);
  }
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

  @include rwd-max(375px) {
    top: sm(20);
    height: sm(4);
  }
}

.award-timeline__arrow {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 153px;
  height: 44px;

  @include rwd-max(375px) {
    width: sm(153);
    height: sm(44);
  }
}

// 線與箭頭的 sprite <svg>：撐滿外層 span（尺寸由 __line / __arrow 定），
// 外層 span 才是 GSAP 量測與位移的對象
.award-timeline__head-svg {
  display: block;
  width: 100%;
  height: 100%;
}

// 對稿：三斷點同欄寬（--w）與 gap 48，pad/mob 靠軌道平移看完整排
.award-timeline__list {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  @include rwd-max(375px) {
    gap: sm(48);
    margin-top: sm(16);
  }
}

// 年份欄位：寬度對稿各欄不同（--w 為 template 帶入的**無單位** px 數，<375 才能拿來算 vw）
// 預設 0.5，箭頭走過（i <= activeIdx）改 1：純 class 切換、無 transition，故是瞬間跳變
.award-timeline__item {
  flex-shrink: 0;
  width: calc(var(--w, 277) * 1px);
  opacity: 0.5;

  &--passed {
    opacity: 1;
  }

  @include rwd-max(375px) {
    width: calc(var(--w, 277) / 375 * 100vw);
  }
}

// 年份數字：對稿向量字（/img/news/{year}.svg）
.award-timeline__year {
  display: block;
  // width 交給 viewBox 的比例算（各年份原始寬度不同），與原本 <img> 的行為一致
  width: auto;
  height: 23px;
  margin: 0 0 8px;

  @include rwd-max(375px) {
    height: sm(23);
    margin-bottom: sm(8);
  }
}

.award-timeline__award {
  margin-top: 8px;

  @include rwd-max(375px) {
    margin-top: sm(8);
  }
}

.award-timeline__org {
  margin: 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 400;
  color: var(--color-orange);

  @include rwd-max(375px) {
    font-size: sm(20); // --text-h5 20/32
    line-height: sm(32);
  }
}

.award-timeline__title {
  margin: 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 400;
  color: var(--color-gray);

  @include rwd-max(375px) {
    font-size: sm(20); // --text-h5 20/32
    line-height: sm(32);
  }
}

.award-timeline__work {
  margin: 0;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 300;
  color: var(--color-gray-light);
  text-align: justify; // 對稿：作品行左右對齊

  @include rwd-max(375px) {
    font-size: sm(15); // --text-caption 15/24
    line-height: sm(24);
  }
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
.award-timeline--static {
  .award-timeline__stage {
    height: auto;
    padding: 64px 0;
    overflow-x: auto;
  }

  // 無 ScrollTrigger → activeIdx 恆為 0，這裡直接讓所有欄位滿版
  .award-timeline__item {
    opacity: 1;
  }
}
</style>
