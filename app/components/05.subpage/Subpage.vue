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
        <p v-if="content.hero.unit" class="subpage__unit">
          {{ content.hero.unit }}
        </p>
        <p v-if="content.hero.author" class="subpage__author">
          撰文／{{ content.hero.author }}
        </p>
      </div>
    </header>

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
}

.subpage__hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
  overflow: hidden;
}

// 首屏裝飾圖：像素風圖樣（素材 856x400 = @2x，自然顯示 428x200），
// 定尺寸置於 hero 右側，不滿版鋪底。
// TODO(figma): 確切位置待設計稿 hero 畫面確認（目前對照智慧心媒體版面
// 「標題左、像素圖右」的構圖估位）。
:deep(.subpage__hero-bg) {
  position: absolute;
  top: 50%;
  right: 6vw;
  z-index: -1;
  width: min(428px, 34vw);
  height: auto;
  transform: translateY(-50%);
  pointer-events: none;

  @include rwd-mobile {
    top: auto;
    right: 20px;
    bottom: 8%;
    width: min(300px, 64vw);
    transform: none;
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

// SVG 藝術字：依設計稿定高（主標 72、副標 64），寬度隨比例、超出欄寬等比縮小
.subpage__title-img {
  display: block;
  width: auto;
  height: 72px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;

  @include rwd-tablet {
    height: 54px;
  }
  @include rwd-mobile {
    height: 42px;
  }
}

.subpage__subtitle-img {
  display: block;
  width: auto;
  height: 64px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;
  // 設計稿主標(163+72)→副標(267) 間距 32；蓋掉 subtitle 文字版的 12px margin
  margin-top: 20px;

  @include rwd-tablet {
    height: 48px;
  }
  @include rwd-mobile {
    width: 100%;
    height: auto;
    margin-top: 12px;
  }
}

.subpage__unit {
  margin: 24px 0 0;
  font-size: var(--text-unit);
  line-height: var(--text-unit--line-height);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--color-gray);

  @include rwd-mobile {
    font-size: var(--text-h5);
    line-height: var(--text-h5--line-height);
  }
}

.subpage__author {
  margin: 4px 0 0;
  font-size: var(--text-body);
  line-height: 32px;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--color-gray-light);
  opacity: 0.7;
}

.subpage__intro {
  padding: 96px 0;

  @include rwd-mobile {
    padding: 56px 0;
  }
}

.subpage__intro-text {
  margin: 0;
  font-size: var(--text-intro); // Figma 引言 36 / 60 / Light
  line-height: var(--text-intro--line-height);
  font-weight: 300;
  color: var(--color-gray);
  text-align: justify;

  @include rwd-tablet {
    font-size: var(--text-h3);
    line-height: var(--text-h3--line-height);
  }
  @include rwd-mobile {
    font-size: var(--text-h4);
    line-height: var(--text-h4--line-height);
  }
}

// 內文結束後由 SubpageNav 的 padding-top(60) 拉開與導覽的距離，故此處不再留下方留白。
.subpage__body {
  padding-bottom: 0;
}
</style>
