<script setup lang="ts">
/** 智慧媒體標題藝術字：完成態 media_title.svg ＋ 開場 motion 分件層 */
import type { MediaTitleEls } from '@/composables/useMediaIntroMotion';
import str from '@/locales/section4.json';

const { newmedia } = str;

const titleRef = ref<HTMLElement | null>(null);
// 完成態完整標題（media_title.svg）與 motion 分件層（motion 結束後交棒）
const titleFinalRef = ref<HTMLImageElement | null>(null);
const titleMotionRef = ref<HTMLElement | null>(null);
// 標題藝術字分件：全為 img（智慧／媒體兩側、上下引號、心，各自成檔可獨立操作）
const partLRef = ref<HTMLElement | null>(null);
const partRRef = ref<HTMLElement | null>(null);
const quoteORef = ref<HTMLImageElement | null>(null);
const quoteCRef = ref<HTMLImageElement | null>(null);
const heartRef = ref<HTMLImageElement | null>(null);

/** 供 useMediaIntroMotion 取分件元素；任一缺件回傳 null（motion 降級不播） */
const getEls = (): MediaTitleEls | null => {
  const title = titleRef.value;
  const final = titleFinalRef.value;
  const motion = titleMotionRef.value;
  const partL = partLRef.value;
  const partR = partRRef.value;
  const quoteO = quoteORef.value;
  const quoteC = quoteCRef.value;
  const heart = heartRef.value;
  if (!title || !final || !motion || !partL || !partR) return null;
  if (!quoteO || !quoteC || !heart) return null;
  return {
    title,
    final,
    motion,
    sides: [partL, partR],
    quotes: [quoteO, quoteC],
    heart,
  };
};

defineExpose({ getEls });
</script>

<template>
  <h2 ref="titleRef" class="media__title">
    <span class="visually-hidden">{{ newmedia.title }}</span>
    <!-- 完成態：完整標題藝術字（撐出版面；motion 尾端交棒、
         無 JS / reduced-motion 直接顯示） -->
    <img
      ref="titleFinalRef"
      class="media__title-final"
      src="/img/media/media_title.svg"
      width="518"
      height="87"
      alt=""
    />
    <!-- 開場 motion 分件層：預設隱藏，起播時疊在完成態上組字。
         各分件依 media_title.svg 內的相對位置絕對定位 -->
    <span
      ref="titleMotionRef"
      class="media__title-motion"
      aria-hidden="true"
    >
      <img
        ref="partLRef"
        class="media__title-part media__title-part--wisdom"
        src="/img/media/wisdom.svg"
        width="191"
        height="78"
        alt=""
      />
      <!-- 「心」分件群：引號（quote_open/close.svg）與心（heart.svg）各自成檔，
           依 heart_with_sign.svg 內的相對位置絕對定位。引號素材為橘色，
           轉灰用 CSS 灰階 filter（motion 起播時還原橘） -->
      <span class="media__title-part media__title-part--heart">
        <img
          ref="quoteORef"
          class="media__quote media__quote--open"
          src="/img/media/quote_open.svg"
          width="39"
          height="84"
          alt=""
        />
        <img
          ref="heartRef"
          class="media__heart"
          src="/img/media/heart.svg"
          width="116"
          height="95"
          alt=""
        />
        <img
          ref="quoteCRef"
          class="media__quote media__quote--close"
          src="/img/media/quote_close.svg"
          width="39"
          height="84"
          alt=""
        />
      </span>
      <img
        ref="partRRef"
        class="media__title-part media__title-part--media"
        src="/img/media/media.svg"
        width="191"
        height="78"
        alt=""
      />
    </span>
  </h2>
</template>

<style lang="scss" scoped>
// 標題藝術字：完成態 media_title.svg 撐出版面，motion 分件層絕對疊其上；
// em 基準＝Figma px / 64（64px 時 1em = 64px）。mobile-first：基底＝mob 稿
.media__title {
  position: relative;
  width: fit-content; // 收縮到藝術字寬：motion 的置中/縮放都以「標題中心」為基準
  margin: 0;
  // mob 稿：滿版寬（414 稿＝362），em 基準隨視窗等比縮放、上限回到 518
  font-size: min(calc((100vw - 52px) / 8.0938), 64px);

  // pad 稿：標題定尺寸（518）水平置中
  @include rwd-min('tablet') {
    margin-inline: auto;
    font-size: 64px;
  }

  // pc 稿：靠左
  @include rwd-min('pc') {
    margin-inline: 0;
  }
}

// 完成態完整標題（518×87）
.media__title-final {
  display: block;
  width: 8.0938em; // 518 / 64
  height: auto;
}

// motion 分件層：與完成態同框，預設隱藏（JS 起播現身、settle 尾端交棒）
.media__title-motion {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

// 分件：智慧／媒體素材為「裁齊字形」的畫布（無留白，框中心＝字形中心）；
// left / width 依 media_title.svg 內的字形實際邊界換算，垂直置中
.media__title-part {
  position: absolute;
  top: 50%;
  height: auto;
  transform: translateY(-50%);
  will-change: transform;

  &--wisdom {
    left: 0.177em; // 字形左緣 11.3 / 64
    width: 2.448em; // 字形寬 156.7 / 64
  }

  &--heart {
    left: 2.9622em; // 189.58 / 64
    width: 2.1803em; // 139.54 / 64
    aspect-ratio: 210 / 98; // 沿用 heart_with_sign.svg 的整體外框
  }

  &--media {
    left: 5.505em; // 字形左緣 352.3 / 64
    width: 2.479em; // 字形寬 158.7 / 64
  }
}

// 上下引號：依 heart_with_sign.svg 內的相對位置絕對定位（% 以 210×98 外框換算）
.media__quote {
  position: absolute;
  width: 18.57%; // 39 / 210
  height: auto;
  will-change: transform;
  // 完成態引號為灰：橘 #FF7F00 灰階後亮度 145，×0.717 ≈ #686868
  filter: grayscale(1) brightness(0.717);

  &--open {
    top: 0;
    left: 0;
  }

  &--close {
    right: 0;
    bottom: 0;
  }
}

// 「心」：置於引號之間（依 heart_with_sign.svg 內的相對位置）
.media__heart {
  position: absolute;
  top: 0;
  left: 22.38%; // 47 / 210
  width: 55.24%; // 116 / 210
  height: auto;
  will-change: transform;
}
</style>
