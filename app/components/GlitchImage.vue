<template>
  <div ref="rootRef" class="glitch-stage" :style="{ aspectRatio: String(aspectRatio) }">
    <!-- 最多 3 張卡片：依 images 長度渲染前 N 個 slot，各自 absolute 定位 + glitch -->
    <div
      v-for="(card, i) in cards"
      :key="i"
      class="glitch-card"
      :style="{
        left: `${card.x}%`,
        top: `${card.y}%`,
        width: `${card.w}%`,
        zIndex: card.z,
      }"
    >
      <img
        :ref="(el) => setImgRef(el, i)"
        class="glitch-card__img"
        :src="card.src"
        :alt="card.alt"
      />
      <div
        :ref="(el) => setOverlayRef(el, i)"
        class="glitch-card__overlay"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

/**
 * 多卡 glitch 進場：最多 3 張圖以「疊卡版面」呈現（大卡置中、小卡左上/右下溢出），
 * 每張卡各自跑四階段收斂式 glitch、依序 stagger 出現：
 *   a. 看不到圖片（短暫留白）
 *   b. 隨機圖片碎塊 + 目標圖的破碎色塊（從目標圖採樣顏色的純色矩形）
 *   c. 目標圖色塊 + 目標圖真實碎片交錯
 *   d. 碎片全數歸位，拼湊出完整目標圖
 */
type Slot = { x: number; y: number; w: number; z?: number };

const props = withDefaults(
  defineProps<{
    /** 目標圖（最多 3 張，依序對應 layout 的 slot：main → 左上 → 右下） */
    images: string[];
    /** 各圖 alt 文字（依序對應 images） */
    alt?: string[];
    /** 三卡版面：每個 slot 的 x/y/w（佔舞台寬高 %）與 z；預設對應設計附圖 */
    layout?: Slot[];
    /** 卡片間依序啟動的間隔（秒） */
    stagger?: number;
    /** 舞台寬高比（width / height）：定位座標的參考框 */
    aspectRatio?: number;
    /** 卡片陰影（CSS box-shadow） */
    shadow?: string;
    /** 單卡序列總時長（秒） */
    duration?: number;
    /** 單卡切塊數量 */
    pieces?: number;
    /**
     * 頁面背景色：部分色塊改用此色繪製，等於把圖片該區域「挖掉」，
     * 製造圖片破碎消失感（不傳則全部色塊用目標圖採樣色）
     */
    bgColor?: string;
    /** 色塊使用背景色的比例（0–1，僅在有 bgColor 時生效） */
    bgRatio?: number;
  }>(),
  {
    alt: () => [],
    layout: () => [
      { x: 16, y: 1, w: 60, z: 1 }, // main：大卡，置中偏上
      { x: 0, y: 8, w: 22, z: 2 }, // 左上小卡，向左溢出、疊在大卡上
      { x: 65, y: 56, w: 31, z: 2 }, // 右下小卡，向右下溢出、疊在大卡上
    ],
    stagger: 0.4,
    aspectRatio: 1.6,
    shadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
    duration: 2,
    pieces: 24,
    bgColor: undefined,
    bgRatio: 0.35,
  },
);

const rootRef = ref<HTMLElement | null>(null);
// v-for 動態 ref：以 index 收集每張卡的 img / overlay 元素
const imgEls: (HTMLImageElement | null)[] = [];
const overlayEls: (HTMLElement | null)[] = [];
const setImgRef = (el: any, i: number) => {
  imgEls[i] = el as HTMLImageElement | null;
};
const setOverlayRef = (el: any, i: number) => {
  overlayEls[i] = el as HTMLElement | null;
};

// 取前 3 張圖，各自配上對應 slot（slot 不足則退回最後一個）
const cards = computed(() =>
  props.images.slice(0, props.layout.length || 3).map((src, i) => {
    const slot = props.layout[i] ?? props.layout[props.layout.length - 1]!;
    return { src, alt: props.alt[i] ?? '', x: slot.x, y: slot.y, w: slot.w, z: slot.z ?? 1 };
  }),
);

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

/** 把目標圖縮畫到低解析 canvas，依百分比座標取該處的區域平均色 */
const sampleColors = (img: HTMLImageElement, res = 32) => {
  const c = document.createElement('canvas');
  c.width = res;
  c.height = res;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0, res, res);
  const data = ctx.getImageData(0, 0, res, res).data;
  return (xPct: number, yPct: number) => {
    const col = Math.min(res - 1, Math.floor((xPct / 100) * res));
    const row = Math.min(res - 1, Math.floor((yPct / 100) * res));
    const i = (row * res + col) * 4;
    return `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
  };
};

type PieceRect = { x: number; y: number; w: number; h: number };

/**
 * legacy GlitchImage 風格的隨機矩形：大小懸殊、長寬不等、可重疊。
 * 不保證蓋滿全卡 —— 縫隙由結尾換上完整 <img> 的瞬間補滿。
 */
const randomRects = (count: number): PieceRect[] =>
  Array.from({ length: count }, () => {
    const w = rand(10, 46);
    const h = rand(7, 36);
    return { x: rand(0, 100 - w), y: rand(0, 100 - h), w, h };
  });

/**
 * 對單一張卡跑四階段 glitch。delay 用於依序 stagger 啟動。
 * 回傳 timeline 供卸載時 kill。
 */
const playCard = async (
  img: HTMLImageElement,
  overlay: HTMLElement,
  src: string,
  delay: number,
): Promise<gsap.core.Timeline | null> => {
  // 採樣需要已解碼的圖
  try {
    await img.decode();
  } catch {
    gsap.set(img, { autoAlpha: 1 });
    return null;
  }

  const D = props.duration;
  // 雜訊期隨機圖：其餘卡的圖優先，沒有就退回自己
  const others = props.images.filter((s) => s !== src);
  const noiseImages = others.length ? others : [src];

  let colorAt: (xPct: number, yPct: number) => string;
  try {
    colorAt = sampleColors(img);
  } catch {
    // 取色失敗（理論上同源資產不會發生）→ 灰階退路
    colorAt = () => `rgb(128, 128, 128)`;
  }

  const tl = gsap.timeline({
    delay,
    onComplete: () => overlay.replaceChildren(),
  });

  // 階段時間軸（皆為 D 的比例）
  const B0 = 0.08; // a → b：留白結束、雜訊開始
  const C0 = 0.42; // b → c：隨機圖退場，只剩目標圖元素
  const D0 = 0.72; // c → d：碎片開始陸續定格
  const D1 = 0.9; // 全圖完成

  for (const { x, y, w, h } of randomRects(props.pieces)) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.style.width = `${w}%`;
    el.style.height = `${h}%`;
    el.style.backgroundRepeat = 'no-repeat';
    // 背景撐滿整個卡片，再以百分比 background-position 對齊到本塊區域
    el.style.backgroundSize = `${1e4 / w}% ${1e4 / h}%`;
    el.style.backgroundPosition = `${w >= 100 ? 0 : (x / (100 - w)) * 100}% ${
      h >= 100 ? 0 : (y / (100 - h)) * 100
    }%`;
    overlay.appendChild(el);

    const mosaicColor = colorAt(x + w / 2, y + h / 2);
    // 色塊取色：依比例改用頁面背景色 → 該區域視覺上被挖空，圖片像缺了一塊
    const blockColor = () =>
      props.bgColor && Math.random() < props.bgRatio ? props.bgColor : mosaicColor;
    // 共用的「熄滅」排程
    const off = (t: number) => tl.set(el, { autoAlpha: 0 }, t + rand(0.03, 0.09) * D);

    // ---------- 階段 b：隨機圖碎塊 + 目標圖破碎色塊 ----------
    const bFlashes = randInt(1, 3);
    for (let k = 0; k < bFlashes; k++) {
      const t = rand(B0, C0 - 0.05) * D;
      if (Math.random() < 0.5) {
        // 隨機圖碎塊：換來源圖 + 錯位 + 偶發過曝
        tl.set(
          el,
          {
            autoAlpha: 1,
            backgroundImage: `url(${pick(noiseImages)})`,
            backgroundColor: 'transparent',
            xPercent: rand(-60, 60),
            yPercent: rand(-60, 60),
            filter: Math.random() < 0.4 ? `brightness(${rand(1.3, 1.9).toFixed(2)})` : 'none',
          },
          t,
        );
      } else {
        // 目標圖破碎色塊：本塊平均色的純色塊，停在原位
        tl.set(
          el,
          {
            autoAlpha: 1,
            backgroundImage: 'none',
            backgroundColor: blockColor(),
            xPercent: 0,
            yPercent: 0,
            filter: 'none',
          },
          t,
        );
      }
      off(t);
    }

    // ---------- 階段 c：目標圖色塊 + 目標圖碎片交錯 ----------
    const cFlashes = randInt(1, 3);
    for (let k = 0; k < cFlashes; k++) {
      const t = rand(C0, D0 - 0.03) * D;
      if (Math.random() < 0.45) {
        tl.set(
          el,
          {
            autoAlpha: 1,
            backgroundImage: 'none',
            backgroundColor: blockColor(),
            xPercent: 0,
            yPercent: 0,
            filter: 'none',
          },
          t,
        );
      } else {
        // 目標圖碎片：對位顯示本塊圖像，殘留少量錯位（隨時間收斂）
        const decay = 1 - (t / D - C0) / (D0 - C0);
        tl.set(
          el,
          {
            autoAlpha: 1,
            backgroundImage: `url(${src})`,
            backgroundColor: 'transparent',
            xPercent: rand(-25, 25) * decay,
            yPercent: rand(-25, 25) * decay,
            filter: Math.random() < 0.3 ? `saturate(${rand(1.4, 2.2).toFixed(2)})` : 'none',
          },
          t,
        );
      }
      off(t);
    }

    // ---------- 階段 d：本塊定格為目標圖碎片，等 <img> 現身補滿縫隙 ----------
    tl.set(
      el,
      {
        autoAlpha: 1,
        backgroundImage: `url(${src})`,
        backgroundColor: 'transparent',
        xPercent: 0,
        yPercent: 0,
        filter: 'none',
      },
      rand(D0, D1) * D,
    );
  }

  // 碎片可重疊但全部對位，<img> 現身瞬間補上縫隙 = 完成拼圖，再把整層收掉
  tl.set(img, { autoAlpha: 1 }, D1 * D);
  tl.set(overlay, { autoAlpha: 0 }, D1 * D + 0.02 * D);
  // 陰影只在 reveal 完成後才浮現：動畫進行中（白卡/碎塊階段）不顯示卡片陰影
  if (overlay.parentElement) tl.set(overlay.parentElement, { boxShadow: props.shadow }, D1 * D);
  tl.set({}, {}, D);
  return tl;
};

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;

  // 降級：直接顯示完整圖（無動畫，圖片現身 + 陰影直接套上）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.value.forEach((_, i) => {
      const img = imgEls[i];
      if (img) gsap.set(img, { autoAlpha: 1 }); // 覆蓋 CSS 的預設隱藏
      const card = img?.parentElement as HTMLElement | null;
      if (card) card.style.boxShadow = props.shadow;
    });
    return;
  }

  // 動畫前先把所有卡的 <img> 藏起來（glitch overlay 接手），各卡背景由 overlay 拼出
  cards.value.forEach((_, i) => {
    const img = imgEls[i];
    if (img) gsap.set(img, { autoAlpha: 0 });
  });

  const tls: gsap.core.Timeline[] = [];

  const play = () => {
    cards.value.forEach((card, i) => {
      const img = imgEls[i];
      const overlay = overlayEls[i];
      if (!img || !overlay) return;
      // 依序 stagger：第 i 張卡延遲 i * stagger 秒啟動
      void playCard(img, overlay, card.src, i * props.stagger).then((tl) => {
        if (tl) tls.push(tl);
      });
    });
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      play();
    },
    { threshold: 0.3 },
  );
  observer.observe(root);

  onBeforeUnmount(() => {
    observer.disconnect();
    tls.forEach((tl) => tl.kill());
  });
});
</script>

<style scoped>
.glitch-stage {
  position: relative;
  width: 100%;
  /* 卡片溢出與陰影需露出 */
  overflow: visible;
}

.glitch-card {
  position: absolute;
}

.glitch-card__img {
  display: block;
  width: 100%;
  height: auto;
  /* 動畫開始前先隱藏（從首次繪製就藏），避免重新整理時整張圖閃一下；
     之後由 JS（glitch reveal 或 reduced-motion 分支）才顯示。
     visibility:hidden 仍佔版面 → 卡片高度/overlay 尺寸正確 */
  visibility: hidden;
}

.glitch-card__overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>
