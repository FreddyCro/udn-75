<template>
  <div ref="rootRef" class="glitch-image">
    <img ref="imgRef" class="glitch-image__img" :src="images[0]" :alt="alt" />
    <div ref="overlayRef" class="glitch-image__overlay" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

const props = withDefaults(
  defineProps<{
    /** 主圖 + 交替圖（第一張為主圖，glitch 期間隨機切換其餘圖） */
    images: string[];
    /** 主圖 alt 文字 */
    alt?: string;
    /** 純色色塊調色盤 */
    palette?: string[];
    /** glitch 總時長（秒） */
    duration?: number;
    /** 圖片切塊數量 */
    pieces?: number;
  }>(),
  {
    alt: '',
    palette: () => ['#19c2a6', '#0d5a6f'],
    duration: 1.2,
    pieces: 8,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

onMounted(() => {
  const root = rootRef.value;
  const img = imgRef.value;
  const overlay = overlayRef.value;
  if (!root || !img || !overlay) return;

  // 降級：直接顯示完整圖，不跑動畫
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.set(img, { autoAlpha: 0 });

  let tl: gsap.core.Timeline | null = null;

  const play = () => {
    const D = props.duration;
    // glitch 元素全數歸位 / 消失的收斂時間點
    const T_SETTLE = D * 0.78;
    tl = gsap.timeline({
      onComplete: () => overlay.replaceChildren(),
    });

    const makeRect = () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.visibility = 'hidden';
      overlay.appendChild(el);
      return el;
    };

    // ---------- 圖片切塊：顯示主圖對應區域，錯位閃現後逐步歸位 ----------
    for (let i = 0; i < props.pieces; i++) {
      const w = rand(14, 38);
      const h = rand(10, 32);
      const x = rand(0, 100 - w);
      const y = rand(0, 100 - h);

      const el = makeRect();
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.width = `${w}%`;
      el.style.height = `${h}%`;
      el.style.backgroundRepeat = 'no-repeat';
      // 背景撐滿整個容器尺寸，再以 percentage position 對齊切塊的原始區域
      // （全部用 %，容器縮放時切塊跟著縮放，不變形）
      el.style.backgroundSize = `${1e4 / w}% ${1e4 / h}%`;
      el.style.backgroundPosition = `${(x / (100 - w)) * 100}% ${(y / (100 - h)) * 100}%`;

      const flashes = randInt(3, 5);
      for (let k = 0; k < flashes; k++) {
        // 階梯式跳動：純 set 串接，無補間
        const t = (T_SETTLE * (k + rand(0.15, 0.9))) / flashes;
        const decay = 1 - t / D; // 位移幅度隨時間遞減 → 逐步歸位
        const filters = [
          'none',
          `hue-rotate(${randInt(40, 320)}deg) saturate(${rand(1.5, 3).toFixed(2)})`,
          `contrast(${rand(1.3, 1.8).toFixed(2)}) brightness(${rand(1.2, 1.7).toFixed(2)})`,
        ];
        tl.set(
          el,
          {
            autoAlpha: 1,
            xPercent: rand(-70, 70) * decay,
            yPercent: rand(-70, 70) * decay,
            backgroundImage: `url(${pick(props.images)})`,
            filter: pick(filters),
          },
          t,
        );
        // 部分 flash 之間短暫熄滅，製造斷裂感
        if (Math.random() < 0.55) tl.set(el, { autoAlpha: 0 }, t + rand(0.03, 0.08));
      }
      // 歸位：回到原始區域、主圖、無色偏
      tl.set(
        el,
        {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          backgroundImage: `url(${props.images[0]})`,
          filter: 'none',
        },
        T_SETTLE + rand(0, D * 0.06),
      );
    }

    // ---------- 純色色塊：隨機閃現/消失，可溢出圖框 ----------
    const blockCount = Math.max(3, Math.round(props.pieces * 0.6));
    for (let i = 0; i < blockCount; i++) {
      const el = makeRect();
      const flashes = randInt(2, 4);
      for (let k = 0; k < flashes; k++) {
        const t = rand(0, T_SETTLE * 0.9);
        const w = rand(8, 30);
        const h = rand(5, 20);
        tl.set(
          el,
          {
            autoAlpha: 1,
            left: `${rand(-8, 108 - w)}%`,
            top: `${rand(-6, 106 - h)}%`,
            width: `${w}%`,
            height: `${h}%`,
            backgroundColor: pick(props.palette),
          },
          t,
        );
        tl.set(el, { autoAlpha: 0 }, t + rand(0.04, 0.12));
      }
    }

    // ---------- 收斂：顯示完整 <img>，切塊已歸位故視覺無縫，再整層淡出 ----------
    tl.set(img, { autoAlpha: 1 }, T_SETTLE);
    tl.set(overlay, { autoAlpha: 0 }, D * 0.95);
    tl.set({}, {}, D); // 撐滿總時長，確保 onComplete 在 D 才觸發
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
  /* 色塊允許溢出圖框（參考稿風格） */
  overflow: visible;
}

.glitch-image__img {
  display: block;
  width: 100%;
  height: auto;
}

.glitch-image__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
