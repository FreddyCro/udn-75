<template>
  <div ref="rootRef" class="glitch-stage" :style="{ aspectRatio: String(aspectRatio) }">
    <!-- 最多 3 張卡片：依 images 長度渲染前 N 個 slot，各自 absolute 定位 + glitch -->
    <div
      v-for="(card, i) in cards"
      :key="i"
      :ref="(el) => setCardRef(el, i)"
      class="glitch-card"
      :style="{
        left: `${card.x}%`,
        top: `${card.y}%`,
        width: `${card.w}%`,
        zIndex: card.z,
      }"
    >
      <!-- lazy：started 之前不綁 src → 不會在網站初始 loading 時就下載。
           影片卡：img 綁定靜態 poster（poster/<名稱>_preview.jpg），glitch 跑在 poster 上 -->
      <img
        :ref="(el) => setImgRef(el, i)"
        class="glitch-card__img"
        :src="started ? (card.video ? card.poster : card.src) : undefined"
        :alt="card.alt"
      />
      <!-- 影片卡：glitch reveal 結束後淡入接手播放。
           preload=none → hover 當下不下載，reveal 呼叫 play() 才開始載入 -->
      <video
        v-if="card.video"
        :ref="(el) => setVideoRef(el, i)"
        class="glitch-card__video"
        :src="started ? card.src : undefined"
        muted
        loop
        playsinline
        preload="none"
      />
      <div
        :ref="(el) => setOverlayRef(el, i)"
        class="glitch-card__overlay"
        aria-hidden="true"
      />

      <!-- 簡介文字：放在第一張（main 大卡）的左下角，reveal 完成後才淡入 -->
      <div
        v-if="caption && i === 0"
        class="glitch-caption"
        :class="{ 'is-visible': captionVisible }"
      >
        {{ caption }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

/**
 * 多卡 glitch 懸浮縮圖：最多 3 張圖疊卡呈現，每張卡各自跑四階段收斂式 glitch、
 * 依序 stagger 出現（階段見 playCard）。由外層以 start()／active prop 觸發，
 * 圖片 lazy 載入。.mp4 項目為影片卡：以第一格 poster 跑 glitch，完成後淡入接播。
 */
type Slot = { x: number; y: number; w: number; z?: number };

const props = withDefaults(
  defineProps<{
    /** 目標圖（最多 3 張，依序對應 layout 的 slot：main → 左上 → 右下） */
    images: string[];
    /** 各圖 alt 文字（依序對應 images） */
    alt?: string[];
    /** 簡介文字（reveal 完成後淡入） */
    caption?: string;
    /** 三卡版面：每個 slot 的 x/y/w（佔舞台寬高 %）與 z；預設對應設計附圖 */
    layout?: Slot[];
    /** 卡片間依序啟動的間隔（秒） */
    stagger?: number;
    /** 舞台寬高比（width / height）：定位座標的參考框 */
    aspectRatio?: number;
    /** 卡片陰影（CSS box-shadow，reveal 後才套上） */
    shadow?: string;
    /** 單卡序列總時長（秒） */
    duration?: number;
    /** 單卡切塊數量 */
    pieces?: number;
    /** 頁面背景色：部分色塊改用此色繪製 → 該區域被「挖空」，製造破碎消失感 */
    bgColor?: string;
    /** 色塊使用背景色的比例（0–1，僅在有 bgColor 時生效） */
    bgRatio?: number;
    /** 閒置懸浮飄移幅度（px）；0 = 關閉 */
    floatAmp?: number;
    /** 電腦版滑鼠追蹤視差幅度（px）；0 = 關閉 */
    parallaxAmp?: number;
    /** 由 prop 控制觸發：true 開始播放、false 重置（與 expose 的 start()/reset() 等效） */
    active?: boolean;
    /** 直接顯示完成態，不跑 glitch（飄移／視差照常）；供「已播過一次」的觸發使用 */
    instant?: boolean;
  }>(),
  {
    alt: () => [],
    caption: '',
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
    floatAmp: 8,
    parallaxAmp: 14,
    active: false,
    instant: false,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const cardEls: (HTMLElement | null)[] = [];
const imgEls: (HTMLImageElement | null)[] = [];
const videoEls: (HTMLVideoElement | null)[] = [];
const overlayEls: (HTMLElement | null)[] = [];
const setCardRef = (el: any, i: number) => {
  cardEls[i] = el as HTMLElement | null;
};
const setImgRef = (el: any, i: number) => {
  imgEls[i] = el as HTMLImageElement | null;
};
const setVideoRef = (el: any, i: number) => {
  videoEls[i] = el as HTMLVideoElement | null;
};
const setOverlayRef = (el: any, i: number) => {
  overlayEls[i] = el as HTMLElement | null;
};

// 取前 N 張圖，各自配上對應 slot（slot 不足則退回最後一個）；.mp4 = 影片卡。
// 影片卡的 glitch 跑在靜態 poster 上（同目錄 poster/ 子夾的 <名稱>_preview.jpg）。
const cards = computed(() =>
  props.images.slice(0, props.layout.length || 3).map((src, i) => {
    const slot = props.layout[i] ?? props.layout[props.layout.length - 1]!;
    const video = /\.mp4$/i.test(src);
    return {
      src,
      video,
      poster: video ? src.replace(/([^/]+)\.mp4$/i, 'poster/$1_preview.jpg') : '',
      alt: props.alt[i] ?? '',
      x: slot.x,
      y: slot.y,
      w: slot.w,
      z: slot.z ?? 1,
    };
  }),
);

/** 影片卡 reveal：淡入 <video> 蓋過 poster 並開始播放 */
const revealVideo = (i: number) => {
  const v = videoEls[i];
  if (!v) return;
  gsap.set(v, { autoAlpha: 1 });
  void v.play().catch(() => {});
};

const started = ref(false); // 是否已觸發（綁定 src 的開關 → lazy 載入）
const captionVisible = ref(false);

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

/** legacy 風格隨機矩形：大小懸殊、長寬不等、可重疊；縫隙由結尾換上完整 <img> 補滿 */
const randomRects = (count: number): PieceRect[] =>
  Array.from({ length: count }, () => {
    const w = rand(10, 46);
    const h = rand(7, 36);
    return { x: rand(0, 100 - w), y: rand(0, 100 - h), w, h };
  });

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 對單一張卡跑四階段 glitch。delay 用於依序 stagger 啟動。回傳 timeline 供 kill。
 *  noiseSrcs：階段 b 亂入碎塊的來源圖（須為可當 CSS background 的圖檔／dataURL）。
 *  onRevealed：拼圖完成（img 現身）當下呼叫——影片卡在此接手播放。 */
const playCard = async (
  img: HTMLImageElement,
  overlay: HTMLElement,
  src: string,
  delay: number,
  noiseSrcs: string[] = [],
  onRevealed?: () => void,
): Promise<gsap.core.Timeline | null> => {
  try {
    await img.decode();
  } catch {
    gsap.set(img, { autoAlpha: 1 });
    onRevealed?.();
    return null;
  }

  const D = props.duration;
  const others = noiseSrcs.filter((s) => s !== src);
  const noiseImages = others.length ? others : [src];

  let colorAt: (xPct: number, yPct: number) => string;
  try {
    colorAt = sampleColors(img);
  } catch {
    colorAt = () => `rgb(128, 128, 128)`;
  }

  const tl = gsap.timeline({ delay, onComplete: () => overlay.replaceChildren() });

  const B0 = 0.08; // a → b
  const C0 = 0.42; // b → c
  const D0 = 0.72; // c → d
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
    el.style.backgroundSize = `${1e4 / w}% ${1e4 / h}%`;
    el.style.backgroundPosition = `${w >= 100 ? 0 : (x / (100 - w)) * 100}% ${
      h >= 100 ? 0 : (y / (100 - h)) * 100
    }%`;
    overlay.appendChild(el);

    const mosaicColor = colorAt(x + w / 2, y + h / 2);
    const blockColor = () =>
      props.bgColor && Math.random() < props.bgRatio ? props.bgColor : mosaicColor;
    const off = (t: number) => tl.set(el, { autoAlpha: 0 }, t + rand(0.03, 0.09) * D);

    // ---------- 階段 b：隨機圖碎塊 + 目標圖破碎色塊 ----------
    const bFlashes = randInt(1, 3);
    for (let k = 0; k < bFlashes; k++) {
      const t = rand(B0, C0 - 0.05) * D;
      if (Math.random() < 0.5) {
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

  // <img> 現身瞬間補上縫隙 = 完成拼圖，再把 overlay 收掉；陰影此刻才浮現
  tl.set(img, { autoAlpha: 1 }, D1 * D);
  tl.set(overlay, { autoAlpha: 0 }, D1 * D + 0.02 * D);
  if (overlay.parentElement) tl.set(overlay.parentElement, { boxShadow: props.shadow }, D1 * D);
  if (onRevealed) tl.call(onRevealed, [], D1 * D); // glitch 結束 → 影片卡開始播放
  tl.set({}, {}, D);
  return tl;
};

// ---------- 觸發 / 播放 / 重置 ----------
let tls: gsap.core.Timeline[] = [];
let captionCall: gsap.core.Tween | null = null;

const play = () => {
  // 降級／instant：直接顯示完整圖（影片直接播放）+ 陰影 + 文字，不跑 glitch；
  // instant（已播過一次的重觸發）仍保留飄移與視差，reduced-motion 全靜止
  if (reducedMotion() || props.instant) {
    cards.value.forEach((card, i) => {
      if (card.video) revealVideo(i);
      else if (imgEls[i]) gsap.set(imgEls[i], { autoAlpha: 1 });
      if (cardEls[i]) cardEls[i]!.style.boxShadow = props.shadow;
    });
    captionVisible.value = true;
    if (!reducedMotion()) startFloat();
    return;
  }

  cards.value.forEach((_, i) => {
    if (imgEls[i]) gsap.set(imgEls[i], { autoAlpha: 0 });
    const v = videoEls[i];
    if (v) {
      v.pause();
      gsap.set(v, { autoAlpha: 0 });
    }
  });

  let maxEnd = 0;
  cards.value.forEach((card, i) => {
    const overlay = overlayEls[i];
    if (!overlay) return;
    const delay = i * props.stagger; // 依序 stagger
    maxEnd = Math.max(maxEnd, delay + props.duration);
    void (async () => {
      // 影片卡：glitch 跑在靜態 poster 圖上；一般卡跑在原圖上
      const src = card.video ? card.poster : card.src;
      const img = imgEls[i];
      if (!img || !src) return;
      // 亂入碎塊來源：各卡的顯示圖（影片卡用 poster）
      const noise = cards.value
        .map((c) => (c.video ? c.poster : c.src))
        .filter((s): s is string => !!s);
      const tl = await playCard(
        img,
        overlay,
        src,
        delay,
        noise,
        card.video ? () => revealVideo(i) : undefined,
      );
      if (tl) tls.push(tl);
    })();
  });

  // 簡介文字在整體 reveal 完成後淡入
  captionCall = gsap.delayedCall(maxEnd * 0.9, () => {
    captionVisible.value = true;
  });

  startFloat();
};

// 觸發：首次會打開 src（lazy 載入）→ 等 DOM 更新後播放；重複呼叫＝重播
const start = async () => {
  if (!started.value) {
    started.value = true;
    await nextTick();
  }
  reset();
  play();
};

const reset = () => {
  tls.forEach((tl) => tl.kill());
  tls = [];
  captionCall?.kill();
  captionCall = null;
  captionVisible.value = false;
  stopFloat();
  cards.value.forEach((_, i) => {
    const img = imgEls[i];
    if (img) gsap.set(img, { autoAlpha: 0 });
    const v = videoEls[i];
    if (v) {
      v.pause();
      gsap.set(v, { autoAlpha: 0 });
    }
    overlayEls[i]?.replaceChildren();
    const card = cardEls[i];
    if (card) {
      card.style.boxShadow = 'none';
      card.style.transform = '';
    }
  });
};

// ---------- 載入後：微懸浮飄移 + 電腦版滑鼠視差 ----------
let floatRaf = 0;
let floatT0 = 0;
let mouseNX = 0; // 游標相對視窗中心的正規化座標 (-1..1)
let mouseNY = 0;
let hoverCapable = false;

const tickFloat = (now: number) => {
  const t = (now - floatT0) / 1000;
  cards.value.forEach((_, i) => {
    const card = cardEls[i];
    if (!card) return;
    const ph = i * 1.7; // 各卡相位錯開
    const fx = Math.sin(t * 0.6 + ph) * props.floatAmp;
    const fy = Math.cos(t * 0.5 + ph) * props.floatAmp;
    const depth = 0.6 + i * 0.3; // 不同卡視差深度不同
    const px = mouseNX * props.parallaxAmp * depth;
    const py = mouseNY * props.parallaxAmp * depth;
    card.style.transform = `translate(${(fx + px).toFixed(2)}px, ${(fy + py).toFixed(2)}px)`;
  });
  floatRaf = requestAnimationFrame(tickFloat);
};

const startFloat = () => {
  if (floatRaf || (props.floatAmp <= 0 && props.parallaxAmp <= 0)) return;
  floatT0 = performance.now();
  floatRaf = requestAnimationFrame(tickFloat);
};
const stopFloat = () => {
  cancelAnimationFrame(floatRaf);
  floatRaf = 0;
};

const onPointerMove = (e: PointerEvent) => {
  mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNY = (e.clientY / window.innerHeight) * 2 - 1;
};

onMounted(() => {
  hoverCapable = window.matchMedia('(hover: hover)').matches;
  if (hoverCapable) window.addEventListener('pointermove', onPointerMove);
  if (props.active) void start();
});

watch(
  () => props.active,
  (v) => {
    if (v) void start();
    else reset();
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove);
  stopFloat();
  captionCall?.kill();
  tls.forEach((tl) => tl.kill());
});

// 對外 API：列表 / 外層觸發用
defineExpose({ start, reset });
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
  will-change: transform;
}

.glitch-card__img {
  display: block;
  width: 100%;
  height: auto;
  /* 動畫開始前先隱藏（從首次繪製就藏），避免閃一下；之後由 JS 顯示。
     visibility:hidden 仍佔版面 → 卡片高度/overlay 尺寸正確 */
  visibility: hidden;
}

/* 影片卡：疊滿整張卡（尺寸由 poster <img> 撐出），reveal 後由 JS 淡入接手 */
.glitch-card__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  visibility: hidden;
  opacity: 0;
}

.glitch-card__overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* 放在 main 卡的左下角（卡內絕對定位 → 隨該卡浮動/視差一起動） */
.glitch-caption {
  position: absolute;
  left: 16px;
  bottom: 16px;
  max-width: 90%;
  font-size: clamp(13px, 1.2vw, 16px);
  line-height: 1.6;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  pointer-events: none;
}

.glitch-caption.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
