<script setup lang="ts">
// 永續祝福清單上方的白色像素階梯線（Figma 永續祝福04：
// pc 2065:140521 / pad 2065:125593 / mob 2065:121897）。
//
// 形狀三斷點相同：直列 4 塊 ＋ 往右下 3 階斜梯，底部左右各一條橫桿。
// 三斷點只換 CSS 變數（方塊尺寸、直列 x 的百分比），不重寫座標。
//
// ── 逐格進場動畫（Figma 2652:56912…57022，11 格）────────────────────
// 01–04：直列與斜梯由上往下一格一格長出（第 n 格＝直列 n 塊、斜梯 n−1 塊）。
// 05–10：形狀長完，兩條橫桿從缺口往左右**對稱**推進，每格各多一塊。
// 11   ：兩條橫桿一次衝到滿版（左 191 / 右 838，即設計稿的最終長度）。
//
// 驅動方式：進場自動播（IntersectionObserver 觸發、固定 fps），不綁捲動 ——
// 臉那段已經吃掉 2.2 個視窗高的捲動，再接一條 scrub 尺會把清單推得很遠；
// 且 scrub 可往回捲，會讓下方的夥伴清單反覆出現／消失。
// 播完把 v-model:done 設為 true，由 <Blessing> 讓 <BlessingPartners> 淡入。
//
// ── 重播規則：只在「使用者回到階梯線上方」時重置 ──────────────────────
// 版面順序是「階梯線在上、面板（600px）在下」，所以**由下往上**進入時面板會先進視窗。
// 若一離開就重置，往上捲回來會盯著一塊空白面板等動畫跑完 —— 因此只在階梯線落到
// 視窗**下方**（＝使用者捲到它上方）時才重置；從下方往上進入維持完成狀態、面板不消失。
// 方向由 IntersectionObserver 的 entry 直接判斷，不必自己追捲動量。
// 已知取捨：若先往上捲觸發重置、再直接跳到本段下方往回看，會看到動畫從頭播一次
// （面板短暫空白 ≤0.8s）。此路徑罕見，不為它加額外狀態。
const COLUMN_STEPS = 4; // 直列方塊數
const DIAGONAL_STEPS = 3; // 斜梯階數
const FRAME_COUNT = 11; // 逐格總格數
const FPS = 14; // 播放速率（格/秒）：11 格約 0.8 秒
// 觸發播放時，要求階梯線已捲離視窗底緣這個比例 —— 階梯線只有 58px 高又緊貼在
// sticky 臉屏下方，不推高觸發點的話動畫會在螢幕最下緣播完，使用者看不到。
const PLAY_MARGIN = '0px 0px -25% 0px';
// 重置的遲滯：階梯線要落到視窗下方這個距離以外才算「使用者在它上方」，
// 避免在觸發線附近微幅捲動就反覆重播。
const RESET_MARGIN = '0px 0px 40% 0px';

// 逐格是否已播完 —— 由 <Blessing> 綁 v-model:done，控制夥伴清單面板的淡入。
const done = defineModel<boolean>('done', { default: false });

const rootRef = ref<HTMLElement | null>(null);
// 目前格號（0-based）。SSR 與首次 render 都是第 0 格＝只有直列第一塊。
const frame = ref(0);

// 第 n 格各部位的可見量（見檔頭的序列說明）
const visibleColumn = computed(() => Math.min(COLUMN_STEPS, frame.value + 1));
const visibleDiagonal = computed(() => Math.min(DIAGONAL_STEPS, frame.value));
// 橫桿：第 4 格（0-based）起每格各推進一塊；未到則為 0（不顯示）
const barBlocks = computed(() => Math.max(0, frame.value - 3));
// 最後一格：橫桿直接到設計稿的滿版長度
const barsFull = computed(() => frame.value >= FRAME_COUNT - 1);

// 橫桿長度：滿版時用「到容器邊緣」的算式，否則是 n 塊寬。
// 左桿靠右錨定（right 固定在缺口）→ 往左長；右桿靠左錨定 → 往右長。
const leftBarWidth = computed(() =>
  barsFull.value
    ? 'calc(var(--stair-col-x) + var(--stair-bw))'
    : `calc(${barBlocks.value} * var(--stair-bw))`,
);
const rightBarWidth = computed(() =>
  barsFull.value
    ? 'calc(100% - var(--stair-col-x) - 4 * var(--stair-bw))'
    : `calc(${barBlocks.value} * var(--stair-bw))`,
);

let raf = 0;
let playObserver: IntersectionObserver | null = null;
let resetObserver: IntersectionObserver | null = null;
let playing = false;

const stop = () => {
  cancelAnimationFrame(raf);
  raf = 0;
  playing = false;
};

const finish = () => {
  stop();
  frame.value = FRAME_COUNT - 1;
  done.value = true;
};

// 以經過時間換算格號（而非每幀 +1）→ 與螢幕更新率無關，分頁切回也不會補跑一大段
const play = () => {
  if (playing || done.value) return;
  playing = true;
  const startT = performance.now();
  const tick = (now: number) => {
    const i = Math.floor(((now - startT) / 1000) * FPS);
    if (i >= FRAME_COUNT - 1) {
      finish();
      return;
    }
    frame.value = i;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
};

// 回到起點，讓下次由上往下進入時重播（面板同時淡出；此時它已在畫面外，看不到）
const reset = () => {
  if (!playing && !done.value) return;
  stop();
  frame.value = 0;
  done.value = false;
};

onMounted(() => {
  // 減少動態：不播、也不重播，直接停在完成的階梯線並讓清單現身
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }
  // 無 IntersectionObserver 可用時直接播，避免清單永遠不出現
  if (!rootRef.value || typeof IntersectionObserver === 'undefined') {
    play();
    return;
  }

  playObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) play();
    },
    { threshold: 0.6, rootMargin: PLAY_MARGIN },
  );
  playObserver.observe(rootRef.value);

  resetObserver = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (!e || e.isIntersecting || !e.rootBounds) return;
      // 只有「階梯線整個落在視窗下方」＝使用者捲到它上方，才重置。
      // 反向（階梯線在視窗上方＝使用者在它下方）不動作，面板保持顯示。
      if (e.boundingClientRect.top >= e.rootBounds.bottom) reset();
    },
    { threshold: 0, rootMargin: RESET_MARGIN },
  );
  resetObserver.observe(rootRef.value);
});

onBeforeUnmount(() => {
  stop();
  playObserver?.disconnect();
  playObserver = null;
  resetObserver?.disconnect();
  resetObserver = null;
});
</script>

<template>
  <div ref="rootRef" class="blessing-stairs" aria-hidden="true">
    <!-- 直列：x 固定，往下最多 4 塊 -->
    <i
      v-for="i in visibleColumn"
      :key="`c${i}`"
      class="blessing-stairs__px"
      :style="{
        left: 'var(--stair-col-x)',
        top: `calc(${i - 1} * var(--stair-bh))`,
      }"
    />

    <!-- 斜梯：每階往右下各一格 -->
    <i
      v-for="i in visibleDiagonal"
      :key="`d${i}`"
      class="blessing-stairs__px"
      :style="{
        left: `calc(var(--stair-col-x) + ${i} * var(--stair-bw))`,
        top: `calc(${i} * var(--stair-bh))`,
      }"
    />

    <span
      v-show="barBlocks > 0"
      class="blessing-stairs__bar blessing-stairs__bar--left"
      :style="{ width: leftBarWidth }"
    />
    <span
      v-show="barBlocks > 0"
      class="blessing-stairs__bar blessing-stairs__bar--right"
      :style="{ width: rightBarWidth }"
    />
  </div>
</template>

<style lang="scss" scoped>
.blessing-stairs {
  --stair-bw: 11.6px; // 方塊寬
  --stair-bh: 11.6px; // 方塊高
  --stair-col-x: 16.84%; // 直列 x（占容器寬）：pc 179.17 / 1064
  --stair-bar-y: 46px; // 橫桿頂端 y（＝ 4 × 11.6 取整）

  position: relative;
  width: 100%;
  max-width: 1064px;
  height: 58px;
  margin: 0 auto;

  @include rwd-max('pc') {
    --stair-col-x: 50.12%; // pad：326.92 / 652.25
    max-width: 652.25px;
  }

  @include rwd-max('tablet') {
    // mob 稿（2065:121897）的方塊本來就是 10.362×11.6 的長方形（非正方），
    // 故只覆寫寬、高維持 11.6；--stair-bar-y 與容器 height 亦沿用 bh=11.6 推出的值。
    --stair-bw: 10.362px;
    --stair-col-x: 46.4%; // mob：147.54 / 318
    max-width: none; // mob 涵蓋到 767px，面板在此區為滿版，階梯線改為等寬（--stair-col-x 為百分比會自動等比縮放）
  }
}

.blessing-stairs__px {
  position: absolute;
  width: var(--stair-bw);
  height: var(--stair-bh);
  background: #fff;
}

.blessing-stairs__bar {
  position: absolute;
  top: var(--stair-bar-y);
  height: 12px;
  background: #fff;
  // 寬度由 JS 逐格指定（見 leftBarWidth / rightBarWidth）；像素風＝瞬間換格，不做補間
}

// 右緣錨定在缺口 → 逐格往左長
.blessing-stairs__bar--left {
  right: calc(100% - var(--stair-col-x) - var(--stair-bw));
}

// 左緣錨定在斜梯末端 → 逐格往右長
.blessing-stairs__bar--right {
  left: calc(var(--stair-col-x) + 4 * var(--stair-bw));
}
</style>
