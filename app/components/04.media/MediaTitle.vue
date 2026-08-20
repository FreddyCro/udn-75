<script setup lang="ts">
/** 智慧媒體標題藝術字：完成態 media_title.svg ＋ 開場 motion 分件層 */
import type { MediaTitleEls } from '@/composables/useMediaIntroMotion';
import str from '@/locales/section4.json';

const { newmedia } = str;

const titleRef = ref<HTMLElement | null>(null);
// 完成態完整標題（media_title.svg）與 motion 分件層（motion 結束後交棒）
const titleFinalRef = ref<HTMLImageElement | null>(null);
const titleMotionRef = ref<HTMLElement | null>(null);
// 標題藝術字分件：全為 img（智慧／媒體兩側、上下引號、新，各自成檔可獨立操作）
const partLRef = ref<HTMLElement | null>(null);
const partRRef = ref<HTMLElement | null>(null);
const quoteORef = ref<HTMLImageElement | null>(null);
const quoteCRef = ref<HTMLImageElement | null>(null);
const newCharRef = ref<HTMLImageElement | null>(null);

/** 供 useMediaIntroMotion 取分件元素；任一缺件回傳 null（motion 降級不播） */
const getEls = (): MediaTitleEls | null => {
  const title = titleRef.value;
  const final = titleFinalRef.value;
  const motion = titleMotionRef.value;
  const partL = partLRef.value;
  const partR = partRRef.value;
  const quoteO = quoteORef.value;
  const quoteC = quoteCRef.value;
  const newChar = newCharRef.value;
  if (!title || !final || !motion || !partL || !partR) return null;
  if (!quoteO || !quoteC || !newChar) return null;
  return {
    title,
    final,
    motion,
    sides: [partL, partR],
    quotes: [quoteO, quoteC],
    newChar,
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
      width="502"
      height="64"
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
        width="239"
        height="95"
        alt=""
      />
      <!-- 「新」分件群：引號（quote_open/close.svg）與新（newchar.svg）各自成檔，
           依 newchar_with_sign.svg 內的相對位置絕對定位。引號素材為橘色，
           轉灰用 CSS 灰階 filter（motion 起播時還原橘） -->
      <span class="media__title-part media__title-part--newchar">
        <img
          ref="quoteORef"
          class="media__quote media__quote--open"
          src="/img/media/quote_open.svg"
          width="38"
          height="82"
          alt=""
        />
        <img
          ref="newCharRef"
          class="media__newchar"
          src="/img/media/newchar.svg"
          width="113"
          height="95"
          alt=""
        />
        <img
          ref="quoteCRef"
          class="media__quote media__quote--close"
          src="/img/media/quote_close.svg"
          width="38"
          height="82"
          alt=""
        />
      </span>
      <img
        ref="partRRef"
        class="media__title-part media__title-part--media"
        src="/img/media/media.svg"
        width="238"
        height="95"
        alt=""
      />
    </span>
  </h2>
</template>

<style lang="scss" scoped>
// 標題藝術字：完成態 media_title.svg 撐出版面，motion 分件層絕對疊其上；
// em 基準＝Figma px / 64（64px 時 1em = 64px）。素材座標一律取自分鏡稿
// 2065-140592 的 753×96 群組，定位態＝該群組 ÷ 1.5（＝502×64），
// 故「分鏡 px → em」直接除 96。mobile-first：基底＝mob 稿
.media__title {
  position: relative;
  width: fit-content; // 收縮到藝術字寬：motion 的置中/縮放都以「標題中心」為基準
  margin: 0;
  // mob 稿：滿版寬（414 稿＝362），em 基準隨視窗等比縮放、上限回到 502
  font-size: min(calc((100vw - 52px) / 7.8438), 64px);

  // pad 稿：標題定尺寸（502）水平置中
  @include rwd-min('tablet') {
    margin-inline: auto;
    font-size: 64px;
  }

  // pc 稿：靠左
  @include rwd-min('pc') {
    margin-inline: 0;
  }
}

// 完成態完整標題（502×64）
.media__title-final {
  display: block;
  width: 7.8438em; // 753 / 96
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
//
// ⚠️ 本區塊（含 .media__quote、.media__newchar）刻意**不寫** will-change: transform：
//    這六個元素都住在 .media__title-motion 裡，而那層在 settle 尾端就被 timeline
//    設成 autoAlpha: 0 並且再也不回來（見 useMediaIntroMotion 的交棒那拍）。常駐
//    宣告等於為一段約 2500px 的 scrub 換來六個「整個 page lifetime 都掛著」的
//    compositing layer。位移全部是 GSAP 的 transform tween，force3D 預設 'auto'
//    會在補間期間自己套上 translate3d 促成圖層、結束後撤掉 —— 該有的提升本來就有。
.media__title-part {
  position: absolute;
  top: 50%;
  height: auto;
  transform: translateY(-50%);

  &--wisdom {
    left: 0; // 字形左緣即標題左緣
    width: 2.4873em; // 字形寬 238.78 / 96
  }

  &--newchar {
    left: 2.8037em; // 269.16 / 96
    width: 2.2481em; // 215.82 / 96
    aspect-ratio: 215.82 / 96; // 沿用 newchar_with_sign.svg 的整體外框
  }

  &--media {
    left: 5.3642em; // 字形左緣 514.96 / 96
    width: 2.4796em; // 字形寬 238.04 / 96
  }
}

// 上下引號：依 newchar_with_sign.svg 內的相對位置絕對定位（% 以 215.82×96 外框換算）
.media__quote {
  position: absolute;
  width: 17.373%; // 37.5 / 215.82
  height: auto;
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

// 「新」：置於引號之間（依 newchar_with_sign.svg 內的相對位置）
.media__newchar {
  position: absolute;
  top: 0.23%; // 0.22 / 96
  left: 23.447%; // 50.6 / 215.82
  width: 52.272%; // 112.81 / 215.82
  height: auto;
}
</style>
