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
      <!-- lazy：started 之前不綁 src → 不會在網站初始 loading 時就下載 -->
      <img
        :ref="(el) => setImgRef(el, i)"
        class="glitch-card__img"
        :src="started ? card.src : undefined"
        :alt="card.alt"
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
 * 多卡 glitch 「懸浮縮圖」：最多 3 張圖以疊卡版面呈現（大卡置中、小卡左上/右下溢出），
 * 每張卡各自跑四階段收斂式 glitch、依序 stagger 出現：
 *   a. 看不到圖片（短暫留白）
 *   b. 隨機圖片碎塊 + 目標圖的破碎色塊（從目標圖採樣顏色的純色矩形）
 *   c. 目標圖色塊 + 目標圖真實碎片交錯
 *   d. 碎片全數歸位，拼湊出完整目標圖
 *
 * 觸發改為 API 控制：不自動播放，由外層呼叫 start()（或 active prop）。圖片 lazy 載入
 * （start 後才下載，不影響網站初始 loading）。reveal 完成後卡片持續微微懸浮飄移，
 * 電腦版另疊一層滑鼠追蹤的些微視差偏移。
 *
 * NOTE 影片可行性：卡片內容目前為 <img>；要支援影片時，把卡片元素換成 <video>
 *   （preload="none"、start() 後才 load()/play()），glitch reveal 與 float/parallax 流程不變。
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
  },
);

const rootRef = ref<HTMLElement | null>(null);
// v-for 動態 ref：以 index 收集每張卡的 card / img / overlay 元素
const cardEls: (HTMLElement | null)[] = [];
const imgEls: (HTMLImageElement | null)[] = [];
const overlayEls: (HTMLElement | null)[] = [];
const setCardRef = (el: any, i: number) => {
  cardEls[i] = el as HTMLElement | null;
};
const setImgRef = (el: any, i: number) => {
  imgEls[i] = el as HTMLImageElement | null;
};
const setOverlayRef = (el: any, i: number) => {
  overlayEls[i] = el as HTMLElement | null;
};

// 取前 N 張圖，各自配上對應 slot（slot 不足則退回最後一個）
const cards = computed(() =>
  props.images.slice(0, props.layout.length || 3).map((src, i) => {
    const slot = props.layout[i] ?? props.layout[props.layout.length - 1]!;
    return { src, alt: props.alt[i] ?? '', x: slot.x, y: slot.y, w: slot.w, z: slot.z ?? 1 };
  }),
);

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

/** 對單一張卡跑四階段 glitch。delay 用於依序 stagger 啟動。回傳 timeline 供 kill。 */
const playCard = async (
  img: HTMLImageElement,
  overlay: HTMLElement,
  src: string,
  delay: number,
): Promise<gsap.core.Timeline | null> => {
  try {
    await img.decode();
  } catch {
    gsap.set(img, { autoAlpha: 1 });
    return null;
  }

  const D = props.duration;
  const others = props.images.filter((s) => s !== src);
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
  tl.set({}, {}, D);
  return tl;
};

// ---------- 觸發 / 播放 / 重置 ----------
let tls: gsap.core.Timeline[] = [];
let captionCall: gsap.core.Tween | null = null;

const play = () => {
  // 降級：直接顯示完整圖 + 陰影 + 文字，不跑動畫
  if (reducedMotion()) {
    cards.value.forEach((_, i) => {
      const img = imgEls[i];
      if (img) gsap.set(img, { autoAlpha: 1 });
      if (cardEls[i]) cardEls[i]!.style.boxShadow = props.shadow;
    });
    captionVisible.value = true;
    return;
  }

  cards.value.forEach((_, i) => {
    const img = imgEls[i];
    if (img) gsap.set(img, { autoAlpha: 0 });
  });

  let maxEnd = 0;
  cards.value.forEach((card, i) => {
    const img = imgEls[i];
    const overlay = overlayEls[i];
    if (!img || !overlay) return;
    const delay = i * props.stagger; // 依序 stagger
    maxEnd = Math.max(maxEnd, delay + props.duration);
    void playCard(img, overlay, card.src, delay).then((tl) => {
      if (tl) tls.push(tl);
    });
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
  // 也支援以 prop 觸發
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
