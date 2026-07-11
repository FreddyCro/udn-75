<script lang="ts" setup>
/**
 * SubpageSection — 子頁內文的單一區塊。結構統一為：小標(title) → 內文(desc) → 圖(img)／得獎項目(awards)／得獎作品(works)。
 * 各元素之間、以及 section 之間的間距，全部走共用 token（--sp-*），四頁一致。
 * 欄寬由內容決定：一般文字用窄欄(630)；含 awards（桂冠）／works（得獎作品）的區塊改用寬欄(1064)。
 *
 * ── 得獎作品「懸浮縮圖」POC ──
 *  hover 得獎作品清單的每一列（電腦）／滾動至畫面中央（手機）時，該列文字背後浮出縮圖：
 *   先 glitch 雜訊分割 → feTurbulence 像素溶解出現 → 微微懸浮飄移；電腦另有滑鼠追蹤跟隨。
 *  觸發區是「列」本身（非桂冠 ART）；縮圖圖片 hover／滾入時才設 src（不影響初始 loading）。
 */
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';

export interface AwardItem {
  name?: string;
  year?: string;
  category?: string;
  variant?: 'gold' | 'dark';
  thumb?: string;
}
export interface AwardWorkItem {
  title?: string;
  desc?: string;
  url?: string;
  thumb?: string;
}

const props = defineProps<{
  title?: string;
  desc?: string[];
  img?: string;
  imgAlt?: string;
  caption?: string;
  awards?: AwardItem[];
  works?: AwardWorkItem[];
  placeholder?: string;
}>();

// 含桂冠或得獎作品清單的區塊改用寬欄。
const isWide = () => !!(props.awards?.length || props.works?.length);

/* ── 懸浮縮圖狀態（觸發區＝得獎作品清單的每一列）── */
const worksWrap = ref<HTMLElement | null>(null);
const thumbEl = ref<HTMLElement | null>(null);
const filterSvg = ref<SVGSVGElement | null>(null);
const thumb = reactive({ active: false, src: '' });

const pos = { x: 0, y: 0, ex: 0, ey: 0 }; // target / eased（相對 wrap）
let canHover = false;
let rafId = 0;
let onScroll: (() => void) | null = null;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function playReveal(w: AwardWorkItem) {
  thumb.src = w.thumb ?? ''; // 換 src（不重建 <img>，避免空白幀閃爍）
  thumb.active = true;
  nextTick(() => {
    const el = thumbEl.value;
    if (el) {
      // 移除 → 強制 reflow → 重加，讓 glitch 動畫每次 hover 重播
      el.classList.remove('is-revealing');
      void el.offsetWidth;
      el.classList.add('is-revealing');
    }
    // 同步觸發濾鏡內所有 SMIL：條狀位移 + RGB 色差一起收斂 → 雜訊分割後出現圖
    filterSvg.value
      ?.querySelectorAll('animate')
      .forEach((a) => (a as SVGAnimateElement).beginElement?.());
  });
}

function applyTransform() {
  if (thumbEl.value) {
    thumbEl.value.style.transform =
      `translate(${pos.ex}px, ${pos.ey}px) translate(-50%, -50%)`;
  }
}

function loop() {
  pos.ex += (pos.x - pos.ex) * 0.12;
  pos.ey += (pos.y - pos.ey) * 0.12;
  applyTransform();
  rafId = requestAnimationFrame(loop);
}

/* 電腦：hover 該列觸發 + 滑鼠追蹤 */
function onEnter(w: AwardWorkItem) {
  if (!canHover) return;
  playReveal(w);
}
function onMove(e: MouseEvent) {
  if (!canHover || !worksWrap.value) return;
  const r = worksWrap.value.getBoundingClientRect();
  pos.x = clamp(e.clientX - r.left, 0, r.width);
  pos.y = clamp(e.clientY - r.top, 0, r.height);
}
function onLeave() {
  if (!canHover) return;
  thumb.active = false;
}

/* 手機：滾動至畫面中央的列自動浮出 */
function setupMobile() {
  const wrap = worksWrap.value;
  if (!wrap) return;
  const items = Array.from(wrap.querySelectorAll<HTMLElement>('.award-work'));
  onScroll = () => {
    const cy = window.innerHeight / 2;
    let best = -1;
    let bestD = Infinity;
    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - cy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    const w = best >= 0 ? props.works?.[best] : undefined;
    if (!w || bestD > window.innerHeight * 0.5) {
      thumb.active = false;
      return;
    }
    playReveal(w);
    const r = wrap.getBoundingClientRect();
    pos.x = r.width / 2;
    pos.y = clamp(cy - r.top, 0, r.height);
    pos.ex = pos.x;
    pos.ey = pos.y;
    applyTransform();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

onMounted(() => {
  if (!props.works?.length) return;
  canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    rafId = requestAnimationFrame(loop);
  } else {
    setupMobile();
  }
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (onScroll) window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <section
    class="subpage-section"
    :class="{ 'subpage-section--wide': isWide() }"
  >
    <div class="subpage-section__inner">
      <h2 v-if="title" class="subpage-section__title">{{ title }}</h2>

      <div v-if="desc?.length" class="subpage-section__desc">
        <p v-for="(p, i) in desc" :key="i" class="subpage-section__para">
          {{ p }}
        </p>
      </div>

      <figure v-if="img" class="subpage-section__figure">
        <img
          class="subpage-section__img"
          :src="img"
          :alt="imgAlt ?? caption ?? ''"
        />
        <figcaption v-if="caption" class="subpage-section__caption">
          {{ caption }}
        </figcaption>
      </figure>

      <!-- 得獎項目（ART 桂冠 + 文字） -->
      <div v-if="awards?.length" class="subpage-section__awards-wrap">
        <div class="subpage-section__awards">
          <SubpageAward
            v-for="(a, i) in awards"
            :key="i"
            :name="a.name"
            :year="a.year"
            :category="a.category"
            :variant="a.variant"
          />
        </div>
      </div>

      <!-- 得獎作品（一列一列清單）＋ 懸浮縮圖 POC（hover 每一列觸發） -->
      <div v-if="works?.length" ref="worksWrap" class="subpage-section__works-wrap">
        <!-- glitch 雜訊分割濾鏡：條狀位移 + RGB 色差，hover 由 JS 同步觸發所有 animate -->
        <svg ref="filterSvg" class="subpage-section__filter" aria-hidden="true">
          <filter
            id="award-dissolve"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            color-interpolation-filters="sRGB"
          >
            <!-- 低 X 頻率→寬橫條、高 Y 頻率→多條 = 水平條狀噪點 -->
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.55"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <!-- 雜訊分割：依噪點做水平位移，量 large→0（改 dur 調整精簡秒數） -->
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              xChannelSelector="R"
              yChannelSelector="G"
              scale="0"
              result="disp"
            >
              <animate
                attributeName="scale"
                from="55"
                to="0"
                dur="0.45s"
                begin="indefinite"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.16 0.8 0.24 1"
              />
            </feDisplacementMap>
            <!-- RGB 色差分裂：紅通道右移、青(綠+藍)通道左移，位移 large→0 後合一 -->
            <feColorMatrix
              in="disp"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="chR"
            />
            <feOffset in="chR" dy="0" result="chRo">
              <animate
                attributeName="dx"
                from="12"
                to="0"
                dur="0.45s"
                begin="indefinite"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.16 0.8 0.24 1"
              />
            </feOffset>
            <feColorMatrix
              in="disp"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="chC"
            />
            <feOffset in="chC" dy="0" result="chCo">
              <animate
                attributeName="dx"
                from="-12"
                to="0"
                dur="0.45s"
                begin="indefinite"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.16 0.8 0.24 1"
              />
            </feOffset>
            <feBlend in="chRo" in2="chCo" mode="screen" />
          </filter>
        </svg>

        <div
          ref="thumbEl"
          class="award-thumb"
          :class="{ 'is-active': thumb.active }"
          aria-hidden="true"
        >
          <div class="award-thumb__inner">
            <img v-if="thumb.src" class="award-thumb__img" :src="thumb.src" alt="" />
          </div>
        </div>

        <div class="subpage-section__works">
          <SubpageWork
            v-for="(w, i) in works"
            :key="i"
            :title="w.title"
            :desc="w.desc"
            :url="w.url"
            @mouseenter="onEnter(w)"
            @mousemove="onMove"
            @mouseleave="onLeave"
          />
        </div>
      </div>

      <!-- 其餘互動／圖表區塊佔位 -->
      <div v-if="placeholder" class="subpage-section__placeholder">
        {{ placeholder }}
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.subpage-section + .subpage-section {
  margin-top: var(--sp-section);

  @include rwd-tablet {
    margin-top: 56px;
  }
  @include rwd-mobile {
    margin-top: 48px;
  }
}

// 內容欄：一般窄欄(630)置中；寬欄(1064)用於桂冠／得獎作品。
.subpage-section__inner {
  width: 100%;
  max-width: var(--subpage-content-w);
  margin: 0 auto;
  padding: 0 20px;
}

.subpage-section--wide .subpage-section__inner {
  max-width: var(--subpage-wide-w);
}

.subpage-section__title {
  margin: 0;
  font-size: var(--text-h3);
  line-height: var(--text-h3--line-height);
  font-weight: 400;

  @include rwd-mobile {
    font-size: var(--text-h4);
    line-height: var(--text-h4--line-height);
  }
}

.subpage-section__title + .subpage-section__desc {
  margin-top: var(--sp-title-desc);
}

.subpage-section__para {
  margin: 0;
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;

  & + & {
    margin-top: var(--sp-para);
  }
}

// 圖／得獎項目／得獎作品：接在內文或小標之後都拉開 --sp-desc-img。
.subpage-section__desc + .subpage-section__figure,
.subpage-section__title + .subpage-section__figure,
.subpage-section__desc + .subpage-section__awards-wrap,
.subpage-section__title + .subpage-section__awards-wrap,
.subpage-section__desc + .subpage-section__works-wrap,
.subpage-section__title + .subpage-section__works-wrap,
.subpage-section__awards-wrap + .subpage-section__works-wrap {
  margin-top: var(--sp-desc-img);
}

.subpage-section__figure {
  margin: 0;
}

.subpage-section__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.subpage-section__caption {
  margin-top: var(--sp-img-caption);
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: var(--color-gray);
}

// 得獎項目：桂冠 grid 置中
.subpage-section__awards-wrap {
  max-width: var(--subpage-awards-w);
  margin: 0 auto;
}

.subpage-section__awards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px 24px;
  padding: 0;
  list-style: none;

  @include rwd-tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  @include rwd-mobile {
    grid-template-columns: 1fr;
  }
}

.subpage-section__filter {
  position: absolute;
  width: 0;
  height: 0;
}

/* ── 懸浮縮圖 ── */
.award-thumb {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2; // 分隔線(z1)之上、列文字(z3)之下
  width: var(--thumb-w, 300px);
  height: var(--thumb-h, 380px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease; // 快速淡入，不與 glitch 打架
  will-change: transform;

  @include rwd-mobile {
    --thumb-w: 240px;
    --thumb-h: 304px;
  }
}

.award-thumb.is-active {
  opacity: 1;
}

.award-thumb__inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
}

// glitch 抖動：只動 transform（含 scale≥1 避免露邊），不碰 opacity → 不閃爍。
// 每次 hover 由 JS 加 .is-revealing 重播；--glitch-dur 調整精簡秒數。
.award-thumb.is-revealing .award-thumb__inner {
  animation: award-glitch var(--glitch-dur, 0.22s) steps(3, end) 1;
}

.award-thumb__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: url(#award-dissolve); // 靜止 scale=0（乾淨），hover 觸發溶解
  animation: award-float 6s ease-in-out infinite; // 出現後微微懸浮飄移
}

@keyframes award-glitch {
  0% {
    transform: translate3d(-2.5%, 0, 0) scale(1.06);
  }
  33% {
    transform: translate3d(1.8%, 0, 0) scale(1.05);
  }
  66% {
    transform: translate3d(-1%, 0, 0) scale(1.04);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes award-float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(0, -9px) rotate(0.5deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .award-thumb.is-revealing .award-thumb__inner,
  .award-thumb__img {
    animation: none;
  }
}

// 得獎作品：wrap 建立獨立堆疊脈絡，三層 → 分隔線(z1) < 縮圖(z2) < 文字(z3)
.subpage-section__works-wrap {
  position: relative;
  z-index: 0;
}

.subpage-section__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
  text-align: center;
  color: var(--color-gray);
  border: 1px dashed var(--color-line);
  background: var(--color-bg-muted);
}
</style>
