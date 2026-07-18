<script setup lang="ts">
// Section 4：newmedia（智慧「心」媒體）
//  - 整個 section hover 時浮現 HeartMetaball 互動底紋（觸控裝置常駐顯示，
//    元件自身在 hover:none 環境會切換成自動遊走）。
//  - 內容層 pointer-events: none 讓游標事件穿透到底紋 canvas；
//    連結恢復 auto 維持可點擊。
//  - list 為四個子頁入口，hover 文字放大。
//
// ── 開場 motion（7 步驟，ScrollTrigger 進場觸發一次）──
//  1. 80vw 橘色塊左右縮小成直條
//  2. 直條上下縮小成中心點
//  3. 標題文字與兩側 bar 從中心點向兩側出現
//  4. 兩側 bar 在文字到位後消失
//  5. 中心點抽高成與文字同高的直線
//  6. 直線展開成上下引號「」
//  7. 中心字「心」出現
//  標題以 JSON 字串逐字拆 span（智慧／「／心／」／媒體），動畫結束後
//  即為自然排版的 live text；reduced-motion 或無 JS 時直接顯示完整標題。
//
// TODO(figma): 色塊尺寸／節奏／bar 樣式先照規格描述估值，取得檔案權限後對稿。
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
const morphRef = ref<HTMLElement | null>(null);
const barLRef = ref<HTMLElement | null>(null);
const barRRef = ref<HTMLElement | null>(null);

let tl: gsap.core.Timeline | null = null;
let trigger: ScrollTrigger | null = null;

onMounted(() => {
  const section = sectionRef.value;
  const title = titleRef.value;
  const morph = morphRef.value;
  const barL = barLRef.value;
  const barR = barRRef.value;
  if (!section || !title || !morph || !barL || !barR) return;
  // 降級：不跑動畫，直接顯示標題（初始隱藏全靠 JS set，不寫在 CSS）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const parts = Array.from(
    title.querySelectorAll<HTMLElement>('.media__title-part'),
  );
  gsap.set(parts, { autoAlpha: 0 });

  trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    once: true,
    onEnter: () => {
      // 觸發當下量測（字型已載入），把每個字的起點設在標題中心
      const titleRect = title.getBoundingClientRect();
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
      quotes.forEach((el) => gsap.set(el, { x: dxOf(el) }));
      gsap.set(heart, { scale: 0.6, transformOrigin: '50% 50%' });

      // 兩側 bar：與文字同高的直條，從中心跟著文字的前緣往外走
      const lineH = titleRect.height;
      const barDist = titleRect.width / 2 + 24;
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
  <section id="media" ref="sectionRef" class="media">
    <!-- 互動底紋（hover 浮現；aria-hidden 純裝飾） -->
    <div class="media__bg" aria-hidden="true">
      <HeartMetaball :idle-blob-min="0.1" :idle-blob-max="0.2" :life="3" />
    </div>

    <div class="media__inner">
      <a class="media__entry" href="#">{{ newmedia.entryLabel }}</a>

      <!-- 標題＋開場 motion：morph 色塊與兩側 bar 均為裝飾層 -->
      <div class="media__title-stage">
        <div ref="morphRef" class="media__morph" aria-hidden="true" />
        <div ref="barLRef" class="media__bar" aria-hidden="true" />
        <div ref="barRRef" class="media__bar" aria-hidden="true" />
        <h2 ref="titleRef" class="media__title">
          <span
            v-for="(c, i) in titleChars"
            :key="i"
            class="media__title-part"
            >{{ c.ch }}</span
          >
        </h2>
      </div>

      <p class="media__body">{{ newmedia.body }}</p>

      <!-- 四個子頁入口：hover 文字放大 -->
      <ul class="media__list">
        <li v-for="a in subpageAnchors" :key="a.url" class="media__item">
          <NuxtLink class="media__link" :to="a.url">{{ a.title }}</NuxtLink>
        </li>
      </ul>
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

// 底紋層：預設隱藏，section hover 時淡入；觸控環境（無 hover）常駐顯示
.media__bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;

  // HeartMetaball 自帶 height: 100vh，改為填滿本層
  :deep(.metaballs) {
    height: 100%;
  }

  .media:hover & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }
}

// 內容層：pointer-events 穿透到底紋 canvas，連結恢復可互動
.media__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 96px 20px;
  text-align: center;
  pointer-events: none;
}

.media__entry {
  color: var(--color-orange);
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  text-decoration: none;
  pointer-events: auto;

  &:hover {
    text-decoration: underline;
  }
}

// 標題舞台：morph 色塊／bar 以標題為定位基準置中
.media__title-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
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

.media__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-h3);
  line-height: var(--text-h3--line-height);
  font-weight: 700;

  @include rwd-mobile {
    font-size: var(--text-h4);
    line-height: var(--text-h4--line-height);
  }
}

// 逐字 span：inline-block 供 transform；動畫結束後即自然排版
.media__title-part {
  display: inline-block;
  will-change: transform;
}

.media__body {
  max-width: var(--subpage-content-w);
  margin: 24px 0 0;
  color: var(--color-body);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;
}

.media__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 64px 0 0;
  padding: 0;
  list-style: none;
}

.media__link {
  display: inline-block;
  color: var(--color-text);
  font-size: var(--text-h4);
  line-height: var(--text-h4--line-height);
  font-weight: 400;
  text-decoration: none;
  transition: transform 0.2s ease, color 0.2s ease;
  pointer-events: auto;

  &:hover {
    color: var(--color-orange);
    transform: scale(1.15); // list hover 文字放大
  }

  @include rwd-mobile {
    font-size: var(--text-h5);
    line-height: var(--text-h5--line-height);
  }
}
</style>
