<template>
  <div ref="rootRef" class="glitch-image">
    <img ref="imgRef" class="glitch-image__img" :src="images[0]" :alt="alt" />
    <div ref="overlayRef" class="glitch-image__overlay" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

/**
 * 四階段收斂式 glitch 進場：
 *   a. 看不到圖片（短暫留白）
 *   b. 隨機圖片碎塊 + 目標圖的破碎色塊（從目標圖採樣顏色的純色矩形）
 *   c. 目標圖色塊 + 目標圖真實碎片交錯
 *   d. 碎片全數歸位，拼湊出完整目標圖
 */
const props = withDefaults(
  defineProps<{
    /** 目標圖 + 雜訊期隨機交替圖（第一張為目標圖） */
    images: string[];
    /** 目標圖 alt 文字 */
    alt?: string;
    /** 序列總時長（秒） */
    duration?: number;
    /** 切塊數量 */
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
    alt: '',
    duration: 2,
    pieces: 24,
    bgColor: undefined,
    bgRatio: 0.35,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);

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
 * 不保證蓋滿全圖 —— 縫隙由結尾換上完整 <img> 的瞬間補滿。
 */
const randomRects = (count: number): PieceRect[] =>
  Array.from({ length: count }, () => {
    const w = rand(10, 46);
    const h = rand(7, 36);
    return { x: rand(0, 100 - w), y: rand(0, 100 - h), w, h };
  });

onMounted(() => {
  const root = rootRef.value;
  const img = imgRef.value;
  const overlay = overlayRef.value;
  if (!root || !img || !overlay) return;

  // 降級：直接顯示完整圖
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.set(img, { autoAlpha: 0 });

  let tl: gsap.core.Timeline | null = null;

  const play = async () => {
    // 採樣需要已解碼的圖
    try {
      await img.decode();
    } catch {
      gsap.set(img, { autoAlpha: 1 });
      return;
    }

    const D = props.duration;
    // 雜訊期隨機圖：交替圖優先，沒有就退回目標圖
    const noiseImages = props.images.length > 1 ? props.images.slice(1) : props.images;

    let colorAt: (xPct: number, yPct: number) => string;
    try {
      colorAt = sampleColors(img);
    } catch {
      // 取色失敗（理論上同源資產不會發生）→ 灰階退路
      colorAt = () => `rgb(128, 128, 128)`;
    }

    tl = gsap.timeline({
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
      // 背景撐滿整個容器，再以百分比 background-position 對齊到本塊區域
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
      const off = (t: number) => tl!.set(el, { autoAlpha: 0 }, t + rand(0.03, 0.09) * D);

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
              backgroundImage: `url(${props.images[0]})`,
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
          backgroundImage: `url(${props.images[0]})`,
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
    tl.set({}, {}, D);
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
    tl?.kill();
  });
});
</script>

<style scoped>
.glitch-image {
  position: relative;
  display: block;
}

.glitch-image__img {
  display: block;
  width: 100%;
  height: auto;
}

.glitch-image__overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>
