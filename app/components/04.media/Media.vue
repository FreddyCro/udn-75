<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section4.json';
import common from '@/locales/common.json';

const { newmedia } = str;
const { subpageAnchors } = common;

const sectionRef = ref<HTMLElement | null>(null);
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

/** 收集 motion 分件：sides（兩側滑入）、quotes（上下引號）、heart（心） */
const getTitleParts = () => {
  const sides = [partLRef.value, partRRef.value].filter(Boolean) as HTMLElement[];
  const quotes = [quoteORef.value, quoteCRef.value].filter(
    Boolean,
  ) as HTMLImageElement[];
  const heart = heartRef.value;
  return {
    sides,
    quotes,
    heart,
    all: [...sides, ...quotes, ...(heart ? [heart] : [])] as Element[],
  };
};
const bodyRef = ref<HTMLElement | null>(null);
const bgRef = ref<HTMLElement | null>(null);
const morphRef = ref<HTMLElement | null>(null);
const barLRef = ref<HTMLElement | null>(null);
const barRRef = ref<HTMLElement | null>(null);
// 分鏡 6：中央直線分裂成兩條、騎著引號外緣飛出
const lineLRef = ref<HTMLElement | null>(null);
const lineRRef = ref<HTMLElement | null>(null);
const rowEls: HTMLElement[] = [];
const setRow = (el: any, i: number) => {
  if (el) rowEls[i] = el as HTMLElement;
};

let tl: gsap.core.Timeline | null = null;
let trigger: ScrollTrigger | null = null;

const playMotion = () => {
  const section = sectionRef.value;
  const title = titleRef.value;
  const titleFinal = titleFinalRef.value;
  const titleMotion = titleMotionRef.value;
  const morph = morphRef.value;
  const barL = barLRef.value;
  const barR = barRRef.value;
  const lineL = lineLRef.value;
  const lineR = lineRRef.value;
  const { sides, quotes, heart, all } = getTitleParts();
  if (!section || !title || !titleFinal || !titleMotion) return;
  if (!morph || !barL || !barR || !lineL || !lineR || !heart) return;
  if (sides.length < 2 || quotes.length < 2) return;

  const revealEls = [bgRef.value, bodyRef.value, ...rowEls].filter(Boolean);

  // 起播前重置：清掉可能殘留的 inline transform / filter（如 HMR），
  // 回到自然版面重新隱藏，量測才會正確
  tl?.kill();
  gsap.set(
    [title, titleFinal, titleMotion, ...all, morph, barL, barR, lineL, lineR],
    { clearProps: 'all' },
  );
  // motion 期間：分件層現身、完成態全標題隱藏（settle 尾端才交棒）
  gsap.set(titleMotion, { autoAlpha: 1 });
  gsap.set(titleFinal, { autoAlpha: 0 });
  gsap.set(all, { autoAlpha: 0 });
  gsap.set(revealEls, { autoAlpha: 0 });

  // 觸發當下量測：所有偏移都在自然版面（未加任何 transform）先量完，
  // 否則分件會從搬移後的位置聚合，而不是從畫面中心點出現
  const SCALE = 1.5; // 中央組裝態＝定位態 1.5 倍（分鏡素材原寸，Figma 量測）
  const secRect = section.getBoundingClientRect();
  const titleRect = title.getBoundingClientRect();
  const centerX = titleRect.left + titleRect.width / 2;
  const dxOf = (el: Element) => {
    const r = el.getBoundingClientRect();
    return centerX - (r.left + r.width / 2);
  };
  const sideDxs = sides.map((el) => dxOf(el));
  const quoteDxs = quotes.map((el) => dxOf(el));
  // 分件半寬（組裝態的渲染尺寸）：bar／直線要貼在分件外緣
  const sideHalf = sides.map(
    (el) => (el.getBoundingClientRect().width * SCALE) / 2,
  );
  const quoteHalf = quotes.map(
    (el) => (el.getBoundingClientRect().width * SCALE) / 2,
  );
  // 外推方向：左分件往左（-1）、右分件往右（+1）
  const outSign = (dx: number) => (dx > 0 ? -1 : 1);
  // 相對 1280 設計稿的整體縮放（分鏡座標值換算用）
  const f = titleRect.width / 518;

  // 分鏡 3：文字「貼齊中線」出現（智慧右緣＝媒體左緣＝標題中心）
  const xButt = sideDxs.map(
    (dx, i) => dx + (outSign(dx) * sideHalf[i]!) / SCALE,
  );
  // 分鏡 4：文字滑開到中停點（總距離的 59%，Figma 量測 ∓152）
  const INNER = 0.59;
  const xInner = sideDxs.map((dx) => dx * (1 - INNER));
  // 分鏡 4→4b：bar 淡出時文字再往外挪 10（設計稿 px，依 f 換算）
  const xInner2 = xInner.map(
    (x, i) => x + (outSign(sideDxs[i]!) * 10 * f) / SCALE,
  );
  // bar 目標＝分鏡 4 文字的外緣（左字左緣、右字右緣），與文字同步滑出。
  // 文字位移在 1.5 倍的標題座標系內，bar 在未縮放的 stage 層，故乘上 SCALE
  const barTargets = sideDxs.map(
    (dx, i) => -dx * INNER * SCALE + outSign(dx) * sideHalf[i]!,
  );
  // 分鏡 4b：bar 變細淡出時再往外甩 34（Figma ∓281→∓315）
  const barOut = barTargets.map((t, i) => t + outSign(sideDxs[i]!) * 34 * f);
  // 分鏡 6：兩條直線騎著引號「外緣」飛出（左引號左緣、右引號右緣）
  const lineTargets = quoteDxs.map(
    (dx, i) => -dx * SCALE + outSign(dx) * quoteHalf[i]!,
  );

  // 起始定位：文字貼齊中線（分鏡3）、引號聚在標題中心；引號素材本身是
  // 橘色，motion 期間先拿掉完成態的灰階 filter 還原橘
  sides.forEach((el, i) => gsap.set(el, { x: xButt[i]! }));
  quotes.forEach((el, i) =>
    gsap.set(el, { x: quoteDxs[i]!, filter: 'grayscale(0) brightness(1)' }),
  );
  gsap.set(heart, { scale: 0.6, transformOrigin: '50% 50%' });
  gsap.set([barL, barR, lineL, lineR], { x: 0, autoAlpha: 0 });

  // 標題於 motion 期間放大並組裝在 section 中心 → settle 再縮回左上定位
  const wrapDx =
    secRect.left + secRect.width / 2 - (titleRect.left + titleRect.width / 2);
  const wrapDy =
    secRect.top + secRect.height / 2 - (titleRect.top + titleRect.height / 2);
  gsap.set(title, {
    x: wrapDx,
    y: wrapDy,
    scale: SCALE,
    transformOrigin: '50% 50%',
  });

  // 中央直線（分鏡 5）目標高度：設計稿 8×96，相對完成態標題高 87 換算
  const lineH = (titleRect.height * 96) / 87;

  // morph 基準尺寸＝bar.svg（12×82）：全程以 scale 變形（純 transform 不觸發
  // reflow，避免卡頓）；分鏡 3 的直條即等於 scale(1, 1)
  const MORPH_W = 12;
  const MORPH_H = 82;

  tl = gsap.timeline();
  tl
    // 1. 80vw×100vh 色塊左右縮小成直條
    .fromTo(
      morph,
      {
        scaleX: (window.innerWidth * 0.8) / MORPH_W,
        scaleY: window.innerHeight / MORPH_H,
        autoAlpha: 1,
      },
      { scaleX: 28 / MORPH_W, duration: 1, ease: 'power3.inOut' },
    )
    // 2→3. 直條縮成 12×82 短棒（scale 1,1）；文字同時「貼齊中線」淡入（分鏡3）
    .to(morph, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power3.inOut' })
    .to(sides, { autoAlpha: 1, duration: 0.3 }, '-=0.3')
    // 3→4. 短棒縮成 8×8 點；文字滑開到中停點，bar 從中心分裂飛到文字外緣
    //（同一拍 smart animate：三者同時、同節奏）
    .addLabel('text')
    .to(
      morph,
      {
        scaleX: 8 / MORPH_W,
        scaleY: 8 / MORPH_H,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      'text',
    )
    .to(
      sides,
      { x: (i: number) => xInner[i]!, duration: 0.6, ease: 'power2.inOut' },
      'text',
    )
    .to([barL, barR], { autoAlpha: 1, duration: 0.2 }, 'text')
    .to(barL, { x: barTargets[0], duration: 0.6, ease: 'power2.inOut' }, 'text')
    .to(barR, { x: barTargets[1], duration: 0.6, ease: 'power2.inOut' }, 'text')
    // 4→4b. bar 變細（12→3）往外甩並淡出，文字同步再外挪（分鏡4b）
    .to(
      barL,
      { x: barOut[0], scaleX: 3 / MORPH_W, autoAlpha: 0, duration: 0.3, ease: 'power2.in' },
      'text+=0.6',
    )
    .to(
      barR,
      { x: barOut[1], scaleX: 3 / MORPH_W, autoAlpha: 0, duration: 0.3, ease: 'power2.in' },
      'text+=0.6',
    )
    .to(
      sides,
      { x: (i: number) => xInner2[i]!, duration: 0.3, ease: 'power1.inOut' },
      'text+=0.6',
    )
    // 5. 中心點抽高成 8×96 直線（分鏡5）
    .to(
      morph,
      { scaleY: lineH / MORPH_H, duration: 0.35, ease: 'power3.inOut' },
      'text+=0.85',
    )
    // 6. 直線分裂成兩條、騎著引號外緣飛出；引號滑入、文字同時撐開到定位（分鏡5→6）
    .addLabel('quotes')
    .set(
      [lineL, lineR],
      { x: 0, scaleX: 8 / MORPH_W, scaleY: lineH / MORPH_H, autoAlpha: 1 },
      'quotes',
    )
    .set(morph, { autoAlpha: 0 }, 'quotes')
    .to(quotes, { autoAlpha: 1, duration: 0.25 }, 'quotes')
    .to(quotes, { x: 0, duration: 0.55, ease: 'power2.inOut' }, 'quotes')
    .to(sides, { x: 0, duration: 0.55, ease: 'power2.inOut' }, 'quotes')
    .to(lineL, { x: lineTargets[0], duration: 0.55, ease: 'power2.inOut' }, 'quotes')
    .to(lineR, { x: lineTargets[1], duration: 0.55, ease: 'power2.inOut' }, 'quotes')
    .to([lineL, lineR], { autoAlpha: 0, duration: 0.2 }, 'quotes+=0.55')
    // 7. 中心字「心」出現（引號就定位後，分鏡6→7）
    .to(
      heart,
      { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
      'quotes+=0.6',
    )
    // 8. 銜接最終版面：標題從中央縮回左上定位、引號轉灰、內容依序淡入
    .addLabel('settle', '+=0.35')
    .to(
      title,
      { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.inOut' },
      'settle',
    )
    // 引號轉灰：與 CSS 完成態同值（#FF7F00 灰階後亮度 145，×0.717 ≈ #686868）
    .to(
      quotes,
      { filter: 'grayscale(1) brightness(0.717)', duration: 0.5 },
      'settle+=0.2',
    )
    // 完成態交棒：移動「途中」就 crossfade 給完整標題 media_title.svg——
    // 位移會遮住分件與完成態的細微錯位，抵達定位前（settle+0.75）已換完
    .to(titleMotion, { autoAlpha: 0, duration: 0.5 }, 'settle+=0.25')
    .to(titleFinal, { autoAlpha: 1, duration: 0.5 }, 'settle+=0.25')
    .to(bgRef.value, { autoAlpha: 1, duration: 0.6 }, 'settle+=0.3')
    .to(bodyRef.value, { autoAlpha: 1, y: 0, duration: 0.5 }, 'settle+=0.4')
    .to(
      rowEls,
      { autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      'settle+=0.55',
    );
};

onMounted(() => {
  const section = sectionRef.value;
  const title = titleRef.value;
  if (!section || !title || !morphRef.value || !barLRef.value || !barRRef.value)
    return;
  // 降級：不跑動畫，直接顯示完成態（初始隱藏全靠 JS set，不寫在 CSS）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // 進場前先隱藏（含完成態全標題），避免觸發前內容先閃現
  const { all } = getTitleParts();
  const revealEls = [bgRef.value, bodyRef.value, ...rowEls].filter(Boolean);
  gsap.set([titleFinalRef.value, ...all].filter(Boolean), { autoAlpha: 0 });
  gsap.set(revealEls, { autoAlpha: 0 });

  trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    once: true,
    onEnter: playMotion,
  });
});

onBeforeUnmount(() => {
  tl?.kill();
  trigger?.kill();
});
</script>

<template>
  <section id="media" ref="sectionRef" class="media" data-metaball-scope>
    <!-- 互動底紋 -->
    <div ref="bgRef" class="media__bg" aria-hidden="true">
      <HeartMetaball :idle-blob-min="0.1" :idle-blob-max="0.2" :life="3" />
    </div>

    <div class="media__inner">
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
            width="252"
            height="126"
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
            width="254"
            height="130"
            alt=""
          />
        </span>
      </h2>

      <p ref="bodyRef" class="media__body">{{ newmedia.body }}</p>

      <!-- 01–04 清單：編號＋標題：副標＋單位＋撰文者，hover 放大（frame 76） -->
      <ol class="media__list">
        <li
          v-for="(a, i) in subpageAnchors"
          :key="a.url"
          :ref="(el) => setRow(el, i)"
          class="media__item"
        >
          <NuxtLink class="media__row" :to="a.url">
            <span class="media__num">0{{ i + 1 }}</span>
            <span class="media__row-title"
              >{{ a.title }}：{{ a.subtitle }}</span
            >
            <span class="media__unit">{{ a.unit }}</span>
            <span class="media__author">{{ a.author }}</span>
          </NuxtLink>
        </li>
      </ol>
    </div>

    <!-- 開場 motion 舞台：morph 色塊、兩側 bar 與分裂直線（絕對置中於 section） -->
    <div class="media__stage" aria-hidden="true">
      <div ref="morphRef" class="media__morph" />
      <div ref="lineLRef" class="media__line" />
      <div ref="lineRRef" class="media__line" />
      <img
        ref="barLRef"
        class="media__bar"
        src="/img/media/bar.svg"
        width="12"
        height="82"
        alt=""
      />
      <img
        ref="barRRef"
        class="media__bar"
        src="/img/media/bar.svg"
        width="12"
        height="82"
        alt=""
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.media {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #fff;
}

// 底紋層：常駐顯示（開場 motion 結束後淡入）
.media__bg {
  position: absolute;
  inset: 0;

  // HeartMetaball 自帶 height: 100vh，改為填滿本層
  :deep(.metaballs) {
    height: 100%;
  }
}

// 內容層：pointer-events 穿透到底紋（事件由 section 轉送），連結恢復可互動
.media__inner {
  position: relative;
  z-index: 1;
  max-width: 1152px; // 1280 - 兩側 64（對齊 Figma 658:33068）
  margin: 0 auto;
  padding: 46px 20px 140px;
  pointer-events: none;
}

// 標題藝術字：完成態 media_title.svg 撐出版面，motion 分件層絕對疊其上；
// em 基準沿用原字級 clamp（64px 時 1em = 64px，各尺寸 = Figma px / 64）
.media__title {
  position: relative;
  width: fit-content; // 收縮到藝術字寬：motion 的置中/縮放都以「標題中心」為基準
  margin: 0;
  font-size: clamp(40px, 5vw, 64px);
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

// 分件：素材為定位態 1.5 倍繪製；left / width 依 media_title.svg（Figma
// 智慧心媒體7）內的相對位置換算，垂直置中
.media__title-part {
  position: absolute;
  top: 50%;
  height: auto;
  transform: translateY(-50%);
  will-change: transform;

  &--wisdom {
    left: 0;
    width: 2.625em; // 168 / 64
  }

  &--heart {
    left: 2.9622em; // 189.58 / 64
    width: 2.1803em; // 139.54 / 64
    aspect-ratio: 210 / 98; // 沿用 heart_with_sign.svg 的整體外框
  }

  &--media {
    left: 5.4531em; // 349 / 64
    width: 2.6406em; // 169 / 64
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

.media__body {
  max-width: 509px; // Figma 內文欄寬
  margin: 28px 0 0;
  color: var(--color-gray);
  font-size: 18px;
  line-height: 32px; // Figma 18/32 Light
  font-weight: 300;
  text-align: justify;
}

.media__list {
  margin: 118px 0 0;
  padding: 0;
  list-style: none;
}

// 清單列：上緣全寬分隔線（設計稿線橫貫整個視窗）
.media__item {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 100vw;
    height: 1px;
    background: var(--color-line);
    transform: translateX(-50%);
  }
}

.media__row {
  display: grid;
  grid-template-columns: 96px 1fr 214px 200px;
  align-items: center;
  min-height: 60px;
  padding: 7px 0;
  color: var(--color-gray);
  text-decoration: none;
  pointer-events: auto;

  @include rwd-tablet {
    grid-template-columns: 48px 1fr;
  }
}

.media__num {
  font-size: 24px;
  line-height: 46px;
  font-weight: 300;
  transform-origin: left center;
  transition: transform 0.25s ease;

  .media__row:hover & {
    transform: scale(1.25); // hover 放大（frame 76）
  }
}

.media__row-title {
  font-size: var(--text-h5); // 20
  line-height: 46px;
  font-weight: 400;
  transform-origin: left center;
  transition: transform 0.25s ease;

  .media__row:hover & {
    transform: scale(1.2);
  }

  @include rwd-mobile {
    font-size: var(--text-body);
    line-height: 32px;
  }
}

.media__unit,
.media__author {
  font-size: 16px;
  line-height: 46px;
  font-weight: 300;
  white-space: nowrap;

  @include rwd-tablet {
    display: none; // TODO(figma): 對 mob 稿後補行動版排法
  }
}

// motion 舞台：置中於 section，純裝飾
.media__stage {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

// 開場 morph 色塊：基準尺寸＝bar.svg（12×82），timeline 全程以 scale 變形
// （80vw 色塊 → 直條 → 中心點 → 直線）
.media__morph {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 82px;
  background: var(--color-orange);
  transform: translate(-50%, -50%);
  visibility: hidden; // 初始不可見，timeline fromTo 起播才現身
}

// 兩側 bar（bar.svg 12×82）：分鏡4 從中心分裂飛到文字外緣，變細甩出後消失
.media__bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden; // 初始不可見，timeline 起播才現身
}

// 分裂直線（分鏡6）：與 morph 同基準（12×82 橘色塊，timeline 以 scale 調成
// 8×96），從中心騎著引號外緣飛出後淡出
.media__line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 82px;
  background: var(--color-orange);
  transform: translate(-50%, -50%);
  visibility: hidden;
}
</style>
