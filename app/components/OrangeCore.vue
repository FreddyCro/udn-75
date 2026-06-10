<template>
  <div ref="trackRef" class="orange-core">
    <div ref="layerRef" class="orange-core__layer" aria-hidden="true">
      <div ref="boxRef" class="orange-core__box">
        <svg viewBox="0 0 300 300">
          <rect
            v-for="(cell, i) in CELLS"
            :key="i"
            class="orange-core__cell"
            :x="cell.x"
            :y="cell.y"
            width="100"
            height="100"
            :fill="color"
          />
        </svg>
      </div>
    </div>
    <div class="orange-core__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

withDefaults(
  defineProps<{
    /** 方塊色票（待設計稿確認） */
    color?: string;
  }>(),
  { color: '#ff6a00' },
);

// 3×3 九宮格（row-major）；「5 位置」= 九宮格編號第 5 格，即中心格
const CELLS = Array.from({ length: 9 }, (_, i) => ({
  x: (i % 3) * 100,
  y: Math.floor(i / 3) * 100,
}));
const CENTER_INDEX = 4;
const OUTER_INDICES = [0, 1, 2, 3, 5, 6, 7, 8];

// 核心於內容前/後穿梭：content 固定 z-index 1，layer 在兩值之間切換
const Z_FRONT = 2;
const Z_BACK = 0;

const trackRef = ref<HTMLDivElement | null>(null);
const layerRef = ref<HTMLDivElement | null>(null);
const boxRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const track = trackRef.value;
  const layer = layerRef.value;
  const box = boxRef.value;
  if (!track || !layer || !box) return;
  const cells = Array.from(box.querySelectorAll<SVGRectElement>('.orange-core__cell'));

  // step 0：slot 內容裡的 .orange-core-anchor 是句中的「透明」佔位字位，
  // 核心本身全程就是那顆方塊（ride 區段跟著文字捲入），沒有第二顆方塊要交接。
  const anchor = track.querySelector<HTMLElement>('.orange-core-anchor');

  const CELL_SCALE = 0.92; // 格與格之間留縫用的縮放

  gsap.set(layer, { autoAlpha: 0, zIndex: Z_FRONT });
  gsap.set(cells, { opacity: 0, scale: CELL_SCALE, transformOrigin: '50% 50%' });
  gsap.set(cells[CENTER_INDEX]!, { opacity: 1 });

  // 核心對齊 anchor 所需的位移與縮放（anchor 尺寸 = 一格，box 為 3 格寬）。
  // a.top - t.top 不受當下捲動位置影響，refresh 時重算即可。
  const anchorState = () => {
    if (!anchor) return { x: 0, y: 0, scale: 1 };
    const a = anchor.getBoundingClientRect();
    const t = track.getBoundingClientRect();
    // 中心基準用 layer 實際渲染矩形：window.innerWidth 含捲軸寬度，
    // 直接用會讓核心相對 anchor 偏移半個捲軸寬。
    const l = layer.getBoundingClientRect();
    return {
      x: a.left + a.width / 2 - (l.left + l.width / 2),
      y: a.top - t.top + a.height / 2 - (l.top + l.height / 2),
      // 中心格實際渲染寬 = box/3 × CELL_SCALE，補償留縫縮放才會與 anchor 等寬
      scale: (a.width * 3) / ((box.offsetWidth || 1) * CELL_SCALE),
    };
  };

  // 放大後需覆蓋整個 viewport：中心格先放大 3 倍補滿整個 box，
  // box 再放大覆蓋全螢幕。box 橫向錨在 anchor 字位（非畫面中央），
  // 需以較遠一側的半寬計算，加 10% 餘裕。
  const coverScale = () => {
    const offsetX = Math.abs(anchorState().x);
    const half = Math.max(window.innerWidth / 2 + offsetX, window.innerHeight / 2);
    return ((half * 2) / (box.offsetWidth || 1)) * 1.1;
  };

  // ST 從 track 進入畫面就啟動：核心先以 ride 區段跟著文字捲入（同一顆方塊），
  // track 頂到達畫面頂後才開始跑三階段。
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        gsap.to(layer, {
          autoAlpha: self.isActive ? 1 : 0,
          duration: 0.25,
          overwrite: 'auto',
        });
      },
    },
  });

  // Step 0 — ride [0, 1]：核心本身就是句中那顆方塊，ease none 跟著第一段文字
  // 等速捲入（位置 = anchor 字位 + 一個視窗高的起始偏移，與滾動完全同步）。
  tl.fromTo(
    box,
    {
      x: () => anchorState().x,
      y: () => anchorState().y + layer.clientHeight,
      scale: () => anchorState().scale,
    },
    {
      x: () => anchorState().x,
      y: () => anchorState().y,
      scale: () => anchorState().scale,
      duration: 1,
      ease: 'none',
      immediateRender: true,
    },
    0,
  );

  // 三階段子 timeline：內部仍以 0..3 配置（每階段 1 單位），
  // 最後壓縮成 2 單位接在 ride 之後（master 總長 3 = ride 1 + phases 2）。
  const phases = gsap.timeline({ defaults: { ease: 'none' } });

  // Phase 1 — mosaic：對應第一段文字。格子以隨機順序硬切出現/消失，
  // 每格 3 次 toggle 平均散佈在整段滾動區間（慢速閃爍），收尾為可見。
  // 核心沿原 x 軸直直下移到畫面垂直中央（x 保持在 anchor 字位上，不橫移），
  // 同時從字級大小放大到完整尺寸。
  phases.addLabel('mosaic', 0);
  phases.fromTo(
    box,
    {
      x: () => anchorState().x,
      y: () => anchorState().y,
      scale: () => anchorState().scale,
    },
    {
      x: () => anchorState().x,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: 'power2.inOut',
      immediateRender: false,
    },
    0.1,
  );
  for (const cell of cells) {
    const times = Array.from({ length: 3 }, () => 0.05 + Math.random() * 0.9).sort(
      (a, b) => a - b,
    );
    times.forEach((t, k) => phases.set(cell, { opacity: k % 2 === 0 ? 1 : 0 }, t));
  }

  // Phase 2 — converge：對應第二段文字。核心退到內容後方，
  // 外圍 8 格各自急閃一下後熄滅，閃爍停止，只留中心（5 號位）恆亮。
  phases.addLabel('converge', 1);
  phases.set(layer, { zIndex: Z_BACK }, 1);
  phases.set(cells[CENTER_INDEX]!, { opacity: 1 }, 1);
  for (const i of OUTER_INDICES) {
    const t = 1.05 + Math.random() * 0.5;
    phases.set(cells[i]!, { opacity: 0 }, t);
    phases.set(cells[i]!, { opacity: 1 }, t + 0.06);
    phases.set(cells[i]!, { opacity: 0 }, t + 0.12);
  }

  // Phase 3 — expand：對應第三段文字。5 號位放大佔滿轉場，覆蓋 viewport 作為背景。
  phases.addLabel('expand', 2);
  phases.to(cells[CENTER_INDEX]!, { scale: 3, duration: 0.7, ease: 'power2.inOut' }, 2);
  phases.to(box, { scale: () => coverScale(), duration: 0.8, ease: 'power2.in' }, 2.1);
  phases.to({}, { duration: 0.1 }, 2.9); // 撐滿 track 末段，維持全螢幕背景

  phases.duration(2);
  tl.add(phases, 1);

  onBeforeUnmount(() => {
    tl.scrollTrigger?.kill();
    tl.kill();
  });
});
</script>

<style scoped>
.orange-core {
  position: relative;
}

.orange-core__layer {
  position: fixed;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

.orange-core__box {
  width: 38vmin;
  height: 38vmin;
  will-change: transform;
}

.orange-core__box svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.orange-core__content {
  position: relative;
  z-index: 1;
}
</style>