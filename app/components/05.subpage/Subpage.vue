<script lang="ts" setup>
/**
 * Subpage — 四個「類分頁」共用版型骨架：hero／引言／錨點／進場動畫／下一篇導覽。
 * 內文兩種寫法：
 *   1. 預設 slot（news）：內文直接寫在頁面上，區塊間距逐塊標 Tailwind mt-*。
 *   2. content.sections（visual / data / service）：JSON 驅動 SubpageSection。
 * header / footer 由 subpage layout 提供。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface SubpageAward {
  name?: string;
  year?: string;
  category?: string;
  variant?: 'gold' | 'dark';
}
export interface SubpageWork {
  title?: string;
  desc?: string;
  url?: string;
  /** 懸浮縮圖（單張；與 thumbs 擇一，thumbs 優先） */
  thumb?: string;
  /** 懸浮縮圖多重疊圖（最多 3 張：主卡 → 左上小卡 → 右下小卡） */
  thumbs?: string[];
}
export interface SubpageSectionData {
  title?: string;
  /** 版面變體：center = 置中導言（H4 標題＋置中引導句，如 Publish X 議題智囊包） */
  variant?: 'center';
  /** H3 小標置中（pc / pad；mob 稿仍靠左），如「近年得獎獎項」 */
  titleCenter?: boolean;
  desc?: string[];
  img?: string;
  imgAlt?: string;
  caption?: string;
  awards?: SubpageAward[];
  works?: SubpageWork[];
  placeholder?: string;
  /** 嵌入的互動元件名（SubpageSection EMBEDS 白名單 key） */
  component?: string;
  /** 嵌入元件的 props（原樣 v-bind 傳入） */
  componentProps?: Record<string, unknown>;
}
export interface SubpageNavData {
  backUrl: string;
  next?: { title: string; url: string };
}
export interface SubpageContent {
  hero: {
    title: string;
    subtitle: string;
    /** 主標題藝術字（SVG 完整路徑）；title 文字作為 alt */
    titleImg: string;
    /** 副標藝術字（SVG 完整路徑）；subtitle 文字作為 alt */
    subtitleImg: string;
    unit: string;
    author: string;
    /** 首屏背景圖（單檔 jpg，不含副檔名），如 /img/news/udn75_bg_news */
    bg: string;
  };
  /**
   * 引言：單一字串，段落之間用 <br/> 斷行、以 v-html 輸出（文案為本地靜態檔）。
   * 引言為 justify，但強制斷行前的那一行算「末行」（text-align-last: auto），
   * 不會被拉開，與早期拆成多個 <p> 的排版等價。
   */
  intro: string;
  /** JSON 驅動的內文區塊；改用預設 slot 在頁面直接寫內文時可省略 */
  sections?: SubpageSectionData[];
  nav: SubpageNavData;
}

defineProps<{ content: SubpageContent }>();

const heroInnerRef = ref<HTMLElement | null>(null);
const introInnerRef = ref<HTMLElement | null>(null);

// header, intro內容由下往上、透明度 0→100%，translate 0.4s
const REVEAL = { autoAlpha: 0, y: 200, duration: 0.4, ease: 'power2.out' };

let tweens: gsap.core.Tween[] = [];

onMounted(() => {
  // 降級：不建 tween，內容維持 CSS 的可見狀態
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // hero 在首屏、一載入就播；引言捲進視窗才播（once，回捲不重播）
  if (heroInnerRef.value) tweens.push(gsap.from(heroInnerRef.value, REVEAL));
  if (introInnerRef.value) {
    tweens.push(
      gsap.from(introInnerRef.value, {
        ...REVEAL,
        scrollTrigger: { trigger: introInnerRef.value, start: 'top 80%', once: true },
      }),
    );
  }
});

onBeforeUnmount(() => {
  tweens.forEach((t) => {
    t.scrollTrigger?.kill();
    t.kill();
  });
  tweens = [];
});
</script>

<template>
  <article class="subpage">
    <header class="subpage__hero">
      <UPic
        :src="content.hero.bg"
        classname="subpage__hero-bg"
        :use-prefix="false"
        :use2x="false"
        :webp="false"
        loading="eager"
        alt=""
      />
      <div ref="heroInnerRef" class="subpage__col subpage__col--wide subpage__hero-inner">
        <h1 class="subpage__title">
          <img
            class="subpage__title-img"
            :src="content.hero.titleImg"
            :alt="content.hero.title"
          />
        </h1>
        <p class="subpage__subtitle">
          <img
            class="subpage__subtitle-img"
            :src="content.hero.subtitleImg"
            :alt="content.hero.subtitle"
          />
        </p>
        <p class="subpage__unit">{{ content.hero.unit }}／{{ content.hero.author }}</p>
      </div>
    </header>

    <!-- hero 之後的內容：不透明背景，維持 rail(z1) / 滿版區塊(z2) 的疊層約定 -->
    <div class="subpage__content">
      <!-- <1280 錨點列（取代 pc 的右側 rail） -->
      <SubpageAnchorBar />

      <div class="subpage__intro">
        <div ref="introInnerRef" class="subpage__col subpage__col--wide">
          <p class="subpage__intro-text" v-html="content.intro" />
        </div>
      </div>

      <!-- 內文：頁面給了預設 slot 就直接用（間距在頁面上逐塊標 Tailwind mt-*），
           沒給才回退到 content.sections 的 JSON 驅動版型 -->
      <div class="subpage__body">
        <slot>
          <SubpageSection
            v-for="(s, i) in content.sections"
            :key="i"
            v-bind="s"
          />
        </slot>
      </div>

      <SubpageNav :back-url="content.nav.backUrl" :next="content.nav.next" />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.subpage {
  width: 100%;
  color: var(--color-body); // 內文／H3 = B3 #404040
}

// 共用內容欄：置中、小螢幕留左右邊距。內文用窄欄(630)、hero/引言用寬欄(1064)。
.subpage__col {
  width: 100%;
  max-width: var(--subpage-content-w);
  margin: 0 auto;
  padding: 0 20px;
}

.subpage__col--wide {
  max-width: var(--subpage-wide-w);
  padding: 0 26px;

  @include rwd-min('tablet') {
    padding: 0 57px;
  }
  @include rwd-min('pc') {
    padding: 0 20px;
  }
}

// 設計稿 canvas＝裝置視窗且 header 疊在 frame 內 → 首屏滿版 100vh（非 100vh − header）；
// 文案距視窗頂為固定距離（padding-top），非垂直置中。
.subpage__hero {
  position: relative; // hero-bg 的定位基準（%距底要量 hero 高，不是視窗高）
  min-height: 100vh;
  min-height: 100svh; // 行動裝置以最小視窗計，避免網址列收合時版面跳動
  padding-top: 148px;
  overflow: hidden;

  @include rwd-min('tablet') {
    padding-top: 180px;
  }
  @include rwd-min('pc') {
    padding-top: 163px;
  }
}

// hero 之後的內容底。z-index 須維持 auto，否則會建立 stacking context，
// 破壞 rail(z1) / 滿版區塊(z2) 的約定（見 SubpageAnchor）。
.subpage__content {
  position: relative;
  background: #fff;
}

// 首屏裝飾圖：素材 856×400 為 @2x，自然顯示 428×200。
// 距底用 % 而非固定值 —— 對稿距底是滿版 frame 的比例，視窗變高才跟著走。
:deep(.subpage__hero-bg) {
  position: absolute;
  bottom: 23%;
  left: 50%;
  z-index: -1;
  width: min(261px, 64vw);
  height: auto;
  transform: translateX(-50%);
  pointer-events: none;

  @include rwd-min('tablet') {
    bottom: 26%;
    width: 428px;
  }
  @include rwd-min('pc') {
    right: 8vw;
    bottom: 11%;
    left: auto;
    width: min(428px, 34vw);
    transform: none;
  }
}

.subpage__title {
  margin: 0;
}

// SVG 藝術字：定高、寬度隨比例，超出欄寬時等比縮小
.subpage__title-img {
  display: block;
  width: auto;
  height: 40px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;

  @include rwd-min('tablet') {
    height: 68px;
  }
  @include rwd-min('pc') {
    height: 72px;
  }
}

.subpage__subtitle-img {
  display: block;
  width: auto;
  height: 29px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;
  margin-top: 16px;

  @include rwd-min('tablet') {
    height: 48px;
    margin-top: 32px;
  }
  @include rwd-min('pc') {
    height: 64px;
  }
}

.subpage__unit {
  margin-top: 20px;
  font-size: 18px;
  line-height: 36px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--color-gray);

  @include rwd-min('tablet') {
    font-size: var(--text-unit);
    line-height: var(--text-unit--line-height);
    font-weight: 400;
    margin-top: 38px;
  }

  @include rwd-min('pc') {
    margin-top: 24px;
  }
}

// 引言同為滿版一屏：mob/pad 對稿上下留白相等 → 垂直置中；pc 對稿不置中，
// 改以「靠下 + 底距 80」表達，視窗高度一離開 720 也不會失準。
// 滿版區塊須依 SubpageAnchor 的約定：relative + z-index 2 + 白底，蓋過 rail(z1)。
.subpage__intro {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  background: #fff;
  padding: 56px 0; // 內容超過一屏時（窄機／放大字級）自然撐高，不裁切

  @include rwd-min('tablet') {
    padding: 96px 0;
  }
  @include rwd-min('pc') {
    align-items: flex-end;
    padding-bottom: 80px;
  }
}

.subpage__intro-text {
  margin: 0;
  font-size: 22px;
  line-height: 40px;
  font-weight: 300;
  color: var(--color-gray);
  text-align: justify;

  @include rwd-min('tablet') {
    font-size: var(--text-intro);
    line-height: var(--text-intro--line-height);
  }
}

// 與導覽的距離由 SubpageNav 的 padding-top 負責，此處不再留下方留白。
.subpage__body {
  padding-bottom: 0;
}
</style>
