<script setup lang="ts">
// Section 4：newmedia（智慧「心」媒體）— 版面對齊 Figma 智慧心媒體7（658:33068）
//  - 標題左上（live text，SVG 藝術字待設計師補圖）、內文左欄 509px、
//    下方 01–04 清單（編號＋標題：副標＋單位＋撰文者，全寬分隔線）。
//  - HeartMetaball 互動底紋墊在內容下層、常駐顯示（閒置時自動遊走成
//    像素心團 = 設計稿右側圖樣）；section 掛 data-metaball-scope，
//    游標移到內容/清單上方也持續追蹤（對應 hover 列底紋跟隨，frame 658:33384）。
//  - list hover：編號與標題放大（frame「76」）。
//
// ── 開場 motion（分鏡 智慧心媒體1→7，ScrollTrigger 進場觸發一次）──
//  1. 80vw 橘色塊左右縮成直條　2. 直條上下縮成中心點
//  3. 標題文字與兩側 bar 從中心點向兩側出現　4. bar 消失
//  5. 中心點抽高成與文字同高的直線　6. 直線展開成上下引號（橘）
//  7. 中心字「心」出現
//  8. 銜接最終版面：標題從畫面中央移回左上、引號轉灰，
//     內文、清單列（01→04 依序）與底紋淡入。
//  標題以 JSON 字串逐字拆 span；reduced-motion 或無 JS 直接顯示完成態。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section4.json';
import common from '@/locales/common.json';

const { newmedia } = str;
const { subpageAnchors } = common;

/** 標題逐字拆分：依「」與其中的字分組，供 motion 分別操作 */
type CharRole = 'left' | 'open' | 'heart' | 'close' | 'right';
const titleChars = (() => {
  const t = [...newmedia.title];
  const open = t.indexOf('「');
  const close = t.indexOf('」');
  return t.map((ch, i) => {
    let role: CharRole = 'left';
    if (i === open) role = 'open';
    else if (i === close) role = 'close';
    else if (open >= 0 && i > open && i < close) role = 'heart';
    else if (close >= 0 && i > close) role = 'right';
    return { ch, role };
  });
})();

const sectionRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);
const bgRef = ref<HTMLElement | null>(null);
const morphRef = ref<HTMLElement | null>(null);
const barLRef = ref<HTMLElement | null>(null);
const barRRef = ref<HTMLElement | null>(null);
const rowEls: HTMLElement[] = [];
const setRow = (el: any, i: number) => {
  if (el) rowEls[i] = el as HTMLElement;
};

let tl: gsap.core.Timeline | null = null;
let trigger: ScrollTrigger | null = null;

onMounted(() => {
  const section = sectionRef.value;
  const title = titleRef.value;
  const morph = morphRef.value;
  const barL = barLRef.value;
  const barR = barRRef.value;
  if (!section || !title || !morph || !barL || !barR) return;
  // 降級：不跑動畫，直接顯示完成態（初始隱藏全靠 JS set，不寫在 CSS）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const parts = Array.from(
    title.querySelectorAll<HTMLElement>('.media__title-part'),
  );
  const revealEls = [bgRef.value, bodyRef.value, ...rowEls].filter(Boolean);
  gsap.set(parts, { autoAlpha: 0 });
  gsap.set(revealEls, { autoAlpha: 0 });

  trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    once: true,
    onEnter: () => {
      // 觸發當下量測（字型已載入）
      const secRect = section.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      // 每字相對標題中心的偏移：必須在整體位移「之前」量測（自然版面座標），
      // 否則字會從搬移前的標題位置聚合，而不是從畫面中心點出現
      const centerX = titleRect.left + titleRect.width / 2;
      const byRole = (r: CharRole) =>
        parts.filter((_, i) => titleChars[i]!.role === r);
      const dxOf = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return centerX - (r.left + r.width / 2);
      };

      const sides = [...byRole('left'), ...byRole('right')];
      const quotes = [...byRole('open'), ...byRole('close')];
      const heart = byRole('heart');
      sides.forEach((el) => gsap.set(el, { x: dxOf(el) }));
      quotes.forEach((el) => gsap.set(el, { x: dxOf(el), color: '#ff7f00' }));
      gsap.set(heart, { scale: 0.6, transformOrigin: '50% 50%' });

      // 標題於 motion 期間放大並組裝在 section 中心 → settle 再縮回左上定位
      // （設計稿：中央組裝態約為定位態的 1.45 倍，TODO(figma) 可微調）
      const SCALE = 1.45;
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

      // 兩側 bar：與（放大後）文字同高的直條，從中心跟著文字的前緣往外走
      const lineH = titleRect.height * SCALE;
      const barDist = (titleRect.width * SCALE) / 2 + 24;
      gsap.set([barL, barR], { height: lineH, x: 0, autoAlpha: 0 });

      tl = gsap.timeline();
      tl
        // 1. 80vw 色塊左右縮小成直條
        .fromTo(
          morph,
          { width: '80vw', height: 160, autoAlpha: 1 },
          { width: 4, duration: 0.7, ease: 'power3.inOut' },
        )
        // 2. 直條上下縮小成中心點
        .to(morph, { height: 4, duration: 0.45, ease: 'power3.inOut' })
        // 3. 文字與兩側 bar 從中心點兩側出現
        .addLabel('text')
        .to(
          sides,
          { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' },
          'text',
        )
        .to(barL, { x: -barDist, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 'text')
        .to(barR, { x: barDist, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 'text')
        // 4. 兩側 bar 在文字出現後消失
        .to([barL, barR], { autoAlpha: 0, duration: 0.25 }, 'text+=0.6')
        // 5. 中心點抽高成與文字同高的直線
        .to(morph, { height: lineH, duration: 0.4, ease: 'power3.inOut' }, 'text+=0.7')
        // 6. 直線展開成上下引號
        .addLabel('quotes')
        .to(quotes, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, 'quotes')
        .to(morph, { autoAlpha: 0, duration: 0.25 }, 'quotes+=0.12')
        // 7. 中心字「心」出現
        .to(
          heart,
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
          'quotes+=0.35',
        )
        // 8. 銜接最終版面：標題從中央縮回左上定位、引號轉灰、內容依序淡入
        .addLabel('settle', '+=0.35')
        .to(
          title,
          { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.inOut' },
          'settle',
        )
        .to(quotes, { color: '#686868', duration: 0.5 }, 'settle+=0.2')
        .to(bgRef.value, { autoAlpha: 1, duration: 0.6 }, 'settle+=0.3')
        .to(bodyRef.value, { autoAlpha: 1, y: 0, duration: 0.5 }, 'settle+=0.4')
        .to(
          rowEls,
          { autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          'settle+=0.55',
        );
    },
  });
});

onBeforeUnmount(() => {
  tl?.kill();
  trigger?.kill();
});
</script>

<template>
  <section id="media" ref="sectionRef" class="media" data-metaball-scope>
    <!-- 互動底紋：常駐（閒置自動遊走成像素心團），墊在內容下層 -->
    <div ref="bgRef" class="media__bg" aria-hidden="true">
      <HeartMetaball :idle-blob-min="0.1" :idle-blob-max="0.2" :life="3" />
    </div>

    <div class="media__inner">
      <h2 ref="titleRef" class="media__title">
        <span
          v-for="(c, i) in titleChars"
          :key="i"
          class="media__title-part"
          >{{ c.ch }}</span
        >
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

    <!-- 開場 motion 舞台：morph 色塊與兩側 bar（絕對置中於 section） -->
    <div class="media__stage" aria-hidden="true">
      <div ref="morphRef" class="media__morph" />
      <div ref="barLRef" class="media__bar" />
      <div ref="barRRef" class="media__bar" />
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

.media__title {
  width: fit-content; // 收縮到文字寬：motion 的置中/縮放都以「文字中心」為基準
  margin: 0;
  color: var(--color-gray); // 對齊 Figma：主標 #686868
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1.32;
  font-weight: 400;
  letter-spacing: 0.04em;
}

// 逐字 span：inline-block 供 transform；動畫結束後即自然排版
.media__title-part {
  display: inline-block;
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

// 開場 morph 色塊：80vw 色塊 → 直條 → 中心點 → 直線（尺寸由 timeline 控制）
.media__morph {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--color-orange);
  transform: translate(-50%, -50%);
  visibility: hidden; // 初始不可見，timeline fromTo 起播才現身
}

// 兩側 bar：與文字同高的直條，從中心跟著文字前緣往外走後消失
.media__bar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 0;
  background: var(--color-orange);
  transform: translate(-50%, -50%);
  visibility: hidden;
}
</style>
