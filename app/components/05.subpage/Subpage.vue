<script lang="ts" setup>
/**
 * Subpage — 四個「類分頁」共用版型骨架，內容由 JSON 驅動：
 * <Subpage :content="content" />（content = ~/locales/xxx.json）。
 * header / footer 由 subpage layout 提供。
 */
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
  backUrl?: string;
  backLabel?: string;
  next?: { title?: string; url?: string };
}
export interface SubpageContent {
  hero: {
    title: string;
    subtitle?: string;
    /** 主標題藝術字（SVG 完整路徑）；title 文字作為 alt */
    titleImg?: string;
    /** 副標藝術字（SVG 完整路徑）；subtitle 文字作為 alt */
    subtitleImg?: string;
    unit?: string;
    author?: string;
    /** 首屏背景圖（單檔 jpg，不含副檔名），如 /img/news/udn75_bg_news */
    bg?: string;
  };
  intro?: string;
  sections?: SubpageSectionData[];
  nav?: SubpageNavData;
}

defineProps<{ content: SubpageContent }>();
</script>

<template>
  <article class="subpage">
    <!-- 首屏 hero -->
    <header class="subpage__hero">
      <UPic
        v-if="content.hero.bg"
        :src="content.hero.bg"
        classname="subpage__hero-bg"
        :use-prefix="false"
        :use2x="false"
        :webp="false"
        loading="eager"
        alt=""
      />
      <div class="subpage__col subpage__col--wide">
        <h1 class="subpage__title">
          <img
            v-if="content.hero.titleImg"
            class="subpage__title-img"
            :src="content.hero.titleImg"
            :alt="content.hero.title"
          />
          <template v-else>{{ content.hero.title }}</template>
        </h1>
        <p v-if="content.hero.subtitle" class="subpage__subtitle">
          <img
            v-if="content.hero.subtitleImg"
            class="subpage__subtitle-img"
            :src="content.hero.subtitleImg"
            :alt="content.hero.subtitle"
          />
          <template v-else>{{ content.hero.subtitle }}</template>
        </p>
        <!-- 對稿：單位與作者合併一行（如「新聞部×數據發展部／林以君」） -->
        <p v-if="content.hero.unit" class="subpage__unit">
          {{ content.hero.unit }}<template v-if="content.hero.author">／{{ content.hero.author }}</template>
        </p>
      </div>
    </header>

    <!-- <1280 內容錨點列（取代右側 rail，貼在 hero 之下） -->
    <SubpageAnchorBar />

    <!-- 引言 -->
    <div v-if="content.intro" class="subpage__intro">
      <div class="subpage__col subpage__col--wide">
        <p class="subpage__intro-text">{{ content.intro }}</p>
      </div>
    </div>

    <!-- 內文 -->
    <div v-if="content.sections?.length" class="subpage__body">
      <SubpageSection
        v-for="(s, i) in content.sections"
        :key="i"
        v-bind="s"
      />
    </div>

    <!-- 最下方：返回 / 下一篇 -->
    <SubpageNav
      v-if="content.nav"
      :back-url="content.nav.backUrl"
      :back-label="content.nav.backLabel"
      :next="content.nav.next"
    />
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

  // pad 稿：引言欄 654（768 − 57×2）；mob 稿：左右邊距 26
  @include rwd-max('pc') {
    padding: 0 57px;
  }
  @include rwd-max('tablet') {
    padding: 0 26px;
  }
}

.subpage__hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
  overflow: hidden;
}

// 首屏裝飾圖：像素風圖樣（素材 856x400 = @2x，自然顯示 428x200）。
// 對稿：pc 靠右下（右 107、距底 11%）；pad/mob 水平置中、貼近下緣。
:deep(.subpage__hero-bg) {
  position: absolute;
  right: 8vw;
  bottom: 11%;
  z-index: -1;
  width: min(428px, 34vw);
  height: auto;
  pointer-events: none;

  @include rwd-max('pc') {
    right: auto;
    bottom: 26%;
    left: 50%;
    width: 428px;
    transform: translateX(-50%);
  }
  @include rwd-max('tablet') {
    bottom: 23%;
    width: min(261px, 64vw);
  }
}

.subpage__title {
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.3;

  @include rwd-tablet {
    font-size: 36px;
  }
  @include rwd-mobile {
    font-size: 28px;
  }
}

.subpage__subtitle {
  margin: 12px 0 0;
  font-size: var(--text-h4);
  line-height: var(--text-h4--line-height);
  font-weight: 400;

  @include rwd-mobile {
    font-size: var(--text-h5);
    line-height: var(--text-h5--line-height);
  }
}

// SVG 藝術字：依設計稿定高（主標 pc 72／pad 68／mob 40），寬度隨比例、超出欄寬等比縮小
.subpage__title-img {
  display: block;
  width: auto;
  height: 72px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;

  @include rwd-max('pc') {
    height: 68px;
  }
  @include rwd-max('tablet') {
    height: 40px;
  }
}

// 副標定高 pc 64／pad 48／mob 29；margin 含 svg 內部留白的補償（對稿視覺間距 32/32/16）
.subpage__subtitle-img {
  display: block;
  width: auto;
  height: 64px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;
  margin-top: 20px;

  @include rwd-max('pc') {
    height: 48px;
    margin-top: 22px;
  }
  @include rwd-max('tablet') {
    height: 29px;
    margin-top: 10px;
  }
}

// 單位＋作者合併行（24/48；mob 18/36 Light）
.subpage__unit {
  margin: 24px 0 0;
  font-size: var(--text-unit);
  line-height: var(--text-unit--line-height);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--color-gray);

  @include rwd-max('tablet') {
    font-size: 18px;
    line-height: 36px;
    font-weight: 300;
  }
}

.subpage__intro {
  padding: 96px 0;

  @include rwd-max('tablet') {
    padding: 56px 0;
  }
}

.subpage__intro-text {
  margin: 0;
  font-size: var(--text-intro); // Figma 四部門引言 32/60 Light；mob 22/40
  line-height: var(--text-intro--line-height);
  font-weight: 300;
  color: var(--color-gray);
  text-align: justify;

  @include rwd-max('tablet') {
    font-size: 22px;
    line-height: 40px;
  }
}

// 內文結束後由 SubpageNav 的 padding-top(60) 拉開與導覽的距離，故此處不再留下方留白。
.subpage__body {
  padding-bottom: 0;
}
</style>
