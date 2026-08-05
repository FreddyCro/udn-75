<script lang="ts" setup>
/**
 * FormulaBlocks — 「Publish X 議題智囊包」放射圖（news 頁）。
 * 三段式版面：pc 中央放射 2×2、pad 上下兩排、mob 直排＋左側 rail；
 * 連接線三版皆由像素元件生成（PixelBranch／PixelRail）而非 SVG 素材，才能逐格畫。
 *
 * 兩份分鏡稿、兩套時序（皆以捲動 scrub，往回捲自動倒退）：
 *   pc/pad 6043:77372（五格）：中央塊 → 四格同時往四角滑出 → 四線同時往外畫 → 議題框轉灰。
 *     五格的頁面位置不動 → pin 住舞台跑固定捲動距離。
 *   mob 6100:64117（四格）：中央塊 → 由上而下逐組「rail 往下畫 → 議題框現身」→ 四框轉灰。
 *     舞台 882 高塞不進一屏 → 不 pin，改以整段自身的捲動行程當進度（見 build()）。
 * 進度以 `--p`（0..1）交給 CSS，形變算在 CSS 端。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface FormulaItem {
  /** 藝術字標題圖（SVG 路徑；無圖時 fallback 為 title 文字） */
  titleImg?: string;
  /** 標題文字（作為 alt 與 fallback） */
  title?: string;
  /** 列點（15px 活字） */
  points?: string[];
}

const props = withDefaults(
  defineProps<{
    /** 中央塊：藝術字圖（img）+ 副標（title）；eyebrow 作為圖的 alt 與 fallback */
    center?: { img?: string; eyebrow?: string; title?: string };
    /** 四角格子（依序：左上、右上、左下、右下） */
    items?: FormulaItem[];
    /** pad 以上 pin 期間可捲動距離（px）＝整段分鏡的捲動長度 */
    pinDistance?: number;
  }>(),
  {
    center: () => ({ title: '議題智囊包' }),
    items: () => [],
    pinDistance: 1400,
  },
);

// 藝術字路徑由呼叫端從 locales/*.json 傳入（純字串）→ 須自行補資產前綴
const assetUrl = useAssetUrl();

const POS = ['tl', 'tr', 'bl', 'br'] as const;
// 分支線方向：tl/br 為「\」、tr/bl 鏡射為「/」；from = 靠中央塊的那端（往外畫）
const BRANCH: Record<
  (typeof POS)[number],
  { flip: boolean; from: 'start' | 'end' }
> = {
  tl: { flip: false, from: 'end' },
  tr: { flip: true, from: 'end' },
  bl: { flip: true, from: 'start' },
  br: { flip: false, from: 'start' },
};

// 分鏡時序（捲動進度 0..1）：at＝該段起點、span＝長度。
// pc/pad：四格與四線皆不逐格錯開（分鏡稿是齊步的）；settle 之後留白維持定版。
const STOPS = {
  center: { at: 0, span: 0.16 },
  box: { at: 0.16, span: 0.34 },
  conn: { at: 0.54, span: 0.26 },
  settle: 0.86,
} as const;

// mob：改為由上而下依序跑四組，每組先畫 rail、rail 接到框後該框才進場；
// 四框最後才一起轉灰（分鏡稿第三格仍是橘、第四格才全灰）。
const MOB_STOPS = {
  center: { at: 0, span: 0.12 },
  step: { at: 0.12, span: 0.19 }, // 每組（rail + 議題框）佔的進度長度
  rail: 0.12, // 組內 rail 畫線長度，其餘為議題框進場
  settle: 0.94,
} as const;

// mob 直排由上而下的視覺順序 → POS 索引（tl → bl → tr → br，見 .formula__box 定位）
const MOB_ORDER = [0, 2, 1, 3];

// 三段式舞台（Figma 座標系）：斷點切換版面、<舞台寬時整體 scale
const STAGES = {
  pc: { w: 1064, h: 524 },
  pad: { w: 610, h: 600 },
  mob: { w: 360, h: 882 },
} as const;

// mob 左側垂直 rail（x=0，依序接到四個格子）；rows＝垂直段列數，
// 第一段自中央塊長出故較短、首列切半（對稿素材 rail_01／rail_02）
const RAILS = [
  { y: 156, rows: 29, shortStart: true },
  { y: 284, rows: 41 },
  { y: 460, rows: 41 },
  { y: 636, rows: 41 },
];

// 分支線幾何（對稿素材）：pc 44×44 斜切階梯、pad 76×60 平切斜帶；mob 不顯示分支線
const BRANCH_GEO = {
  pc: { steps: 9, cut: 'bevel' },
  pad: { steps: 15, cut: 'flat' },
  mob: { steps: 15, cut: 'flat' },
} as const;

const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const progress = ref(0); // 整段分鏡的捲動進度（0..1，ScrollTrigger scrub 寫入）
const scale = ref(1);
const mode = ref<keyof typeof STAGES>('pc');
const reduced = ref(false);

const isMob = computed(() => mode.value === 'mob');
// mob 舞台 882 高塞不進一屏 → 不 pin（改跑自身捲動行程）；reduced-motion 亦一律不 pin（直接定版）
const isPinned = computed(() => !reduced.value && !isMob.value);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** 某段內的 local 進度（0..1，未套 ease） */
const local = (at: number, span: number) => clamp01((progress.value - at) / span);

const centerP = computed(() => {
  const s = isMob.value ? MOB_STOPS.center : STOPS.center;
  return easeOut(local(s.at, s.span));
});
// pc/pad — 四格共用一份進度（同時往外）：p＝滑出、o＝不透明度（前 12% 就轉滿，見 CSS）
const boxP = computed(() => {
  const t = local(STOPS.box.at, STOPS.box.span);
  return { p: easeOut(t), o: clamp01(t / 0.12) };
});
// pc/pad — 四線共用一份進度；不套 ease，與捲動等速才像逐格描出來
const connP = computed(() => local(STOPS.conn.at, STOPS.conn.span));

/** mob 第 i 組（由上而下）的起點 */
const mobAt = (i: number) => MOB_STOPS.step.at + i * MOB_STOPS.step.span;
// mob 四條 rail 的畫線進度（陣列序＝ RAILS 序，由上而下）；同樣不套 ease
const railP = computed(() => RAILS.map((_, i) => local(mobAt(i), MOB_STOPS.rail)));
// mob 四格議題框的進場進度（陣列序＝ POS 序），rail 畫到底才接著跑
const mobBoxP = computed(() => {
  const out = [0, 0, 0, 0];
  const span = MOB_STOPS.step.span - MOB_STOPS.rail;
  MOB_ORDER.forEach((pos, i) => {
    out[pos] = easeOut(local(mobAt(i) + MOB_STOPS.rail, span));
  });
  return out;
});

const settled = computed(
  () => progress.value >= (isMob.value ? MOB_STOPS.settle : STOPS.settle),
);

let st: ScrollTrigger | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function onResize() {
  const vw = window.innerWidth;
  mode.value = vw >= PC_BREAKPOINTS ? 'pc' : vw >= TABLET_BREAKPOINTS ? 'pad' : 'mob';
  const stage = STAGES[mode.value];
  // 量 viewport（padding 內側）而非 section，縮放後才保得住左右留白
  const w = viewportRef.value?.clientWidth ?? stage.w;
  // pin 模式的舞台要塞進一屏 → 高度也納入縮放
  const fitH = isPinned.value ? window.innerHeight / stage.h : Infinity;
  scale.value = Math.min(1, w / stage.w, fitH);
}

function build() {
  const root = rootRef.value;
  if (!root) return;
  st = ScrollTrigger.create({
    trigger: root,
    // pc/pad：pin 住舞台跑固定捲動距離（五格的頁面位置不動）。
    // mob：不 pin，直接把整段自身的捲動行程當進度 —— 線性對應之下，
    // 四格議題框都會在畫面同一高度附近現身（框間距與每組行程幾乎等長）。
    ...(isPinned.value
      ? {
          start: 'top top',
          end: `+=${props.pinDistance}`,
          pin: true,
          anticipatePin: 1,
        }
      : { start: 'top 40%', end: 'bottom bottom' }),
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => (progress.value = self.progress),
    onLeave: () => (progress.value = 1), // 捲過整段 → 停在定版（onUpdate 不再進來）
    onLeaveBack: () => (progress.value = 0),
  });
  progress.value = st.progress; // 中途載入（已捲過部分區段）時先對齊實際位置
}

function teardown() {
  st?.kill();
  st = null;
}

function onWindowResize() {
  onResize();
  if (resizeTimer) clearTimeout(resizeTimer);
  // end 為定值、其餘皆重算 → refresh 即可，免重建
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}

// 跨 768 斷點時 pin 與否會變 → 整組重建
watch(isPinned, () => {
  teardown();
  onResize();
  build();
  ScrollTrigger.refresh();
  // 兩套時序的 start/end 不同 → 以 refresh 後的實際捲動位置重新校正進度
  if (st) progress.value = st.progress;
});

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  onResize();
  window.addEventListener('resize', onWindowResize);
  if (reduced.value) {
    progress.value = 1;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  build();
});

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer);
  window.removeEventListener('resize', onWindowResize);
  teardown();
});
</script>

<template>
  <section
    ref="rootRef"
    class="formula"
    :class="{ 'formula--pin': isPinned, 'is-settled': settled }"
  >
    <div
      ref="viewportRef"
      class="formula__viewport"
      :style="{ height: isPinned ? '100vh' : `${STAGES[mode].h * scale}px` }"
    >
      <div
        class="formula__stage"
        :style="{
          transform: isPinned
            ? `translate(-50%, -50%) scale(${scale})`
            : `translateX(-50%) scale(${scale})`,
        }"
      >
        <div class="formula__center" :style="{ '--p': centerP }">
          <img
            v-if="center.img"
            class="formula__center-logo"
            :src="assetUrl(center.img)"
            :alt="center.eyebrow ?? ''"
          />
          <p v-else-if="center.eyebrow" class="formula__center-eyebrow">
            {{ center.eyebrow }}
          </p>
          <p class="formula__center-title">{{ center.title }}</p>
        </div>

        <!-- pc / pad：四條像素分支線同時自中央塊角落逐格往外畫（幾何差異見 BRANCH_GEO） -->
        <PixelBranch
          v-for="p in POS"
          :key="p"
          class="formula__branch"
          :class="`formula__branch--${p}`"
          :progress="connP"
          :flip="BRANCH[p].flip"
          :from="BRANCH[p].from"
          :steps="BRANCH_GEO[mode].steps"
          :cut="BRANCH_GEO[mode].cut"
        />

        <!-- mob：左側垂直棋盤格 rail，自上往下逐列畫到各格子（四條依序、不齊步） -->
        <PixelRail
          v-for="(r, i) in RAILS"
          :key="`rail-${i}`"
          class="formula__rail"
          :style="{ top: `${r.y}px` }"
          :progress="railP[i]"
          :rows="r.rows"
          :short-start="r.shortStart"
        />

        <div
          v-for="(b, i) in items.slice(0, 4)"
          :key="i"
          class="formula__box"
          :class="`formula__box--${POS[i]}`"
          :style="
            isMob
              ? { '--p': mobBoxP[i], '--o': mobBoxP[i] }
              : { '--p': boxP.p, '--o': boxP.o }
          "
        >
          <p class="formula__box-head">
            <img
              v-if="b.titleImg"
              class="formula__box-logo"
              :src="assetUrl(b.titleImg)"
              :alt="b.title ?? ''"
            />
            <span v-else>{{ b.title }}</span>
          </p>
          <ul class="formula__box-list">
            <li v-for="(pt, j) in b.points" :key="j" class="formula__box-item">
              {{ pt }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// 像素外框：4px 線、角落缺 8px 再於 4px 內縮處補一格 4px 方塊（對稿 Figma 拼法）。
// 以多重背景繪製 → 盒子寬高伸縮時線寬與角點恆為 4px，不變形。
@mixin pixel-frame($c) {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient($c, $c) left 8px top 0 / calc(100% - 16px) 4px no-repeat,
    linear-gradient($c, $c) left 8px bottom 0 / calc(100% - 16px) 4px no-repeat,
    linear-gradient($c, $c) left 0 top 8px / 4px calc(100% - 16px) no-repeat,
    linear-gradient($c, $c) right 0 top 8px / 4px calc(100% - 16px) no-repeat,
    linear-gradient($c, $c) left 4px top 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) right 4px top 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) left 4px bottom 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) right 4px bottom 4px / 4px 4px no-repeat;
}

.formula {
  width: 100%;
  padding: 32px 20px;
  background: #fff;
}

// pin 模式：viewport 撐滿一屏（inline style），故左右留白照舊、上下不留
.formula--pin {
  padding-top: 0;
  padding-bottom: 0;
}

.formula__viewport {
  position: relative;
  width: 100%;
}

// 舞台依斷點定尺寸（Figma 座標系）；尺寸須與 script 的 STAGES 一致
.formula__stage {
  position: absolute;
  top: 0;
  left: 50%;
  width: 360px;
  height: 882px;
  transform-origin: top center;

  // pin 模式（transform 由 template 換成 translate(-50%, -50%)）：舞台垂直置中於一屏
  .formula--pin & {
    top: 50%;
    transform-origin: center;
  }

  @include rwd-min('tablet') {
    width: 610px;
    height: 600px;
  }
  @include rwd-min('pc') {
    width: 1064px;
    height: 524px;
  }
}

// ── 中央 Publish X 塊：像素外框 + 內縮 12px 填色 ──
.formula__center {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; // 高於四角格子：進場時格子自中央塊「後方」滑出
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 360px;
  height: 160px;
  // 分鏡 1：現身（--p ＝ script 的 centerP）
  opacity: var(--p, 0);
  transform: scale(calc(0.88 + 0.12 * var(--p, 0)));

  @include rwd-min('tablet') {
    top: 214px;
    left: 102px;
    width: 400px;
    height: 172px;
  }
  @include rwd-min('pc') {
    top: 182px;
    left: 352px;
    width: 360px;
    height: 160px;
  }

  &::before {
    @include pixel-frame(var(--color-orange));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 12px;
    z-index: 0;
    background: var(--color-orange);
  }
}

.formula__center-logo {
  z-index: 1;
  display: block;
  width: 257px;
  height: auto;

  @include rwd-min('tablet') {
    width: 275px;
  }
  @include rwd-min('pc') {
    width: 257px;
  }
}

.formula__center-eyebrow {
  z-index: 1;
  margin: 0;
  font-size: var(--text-h4);
  font-weight: 500;
  color: #fff;
}

.formula__center-title {
  z-index: 1;
  margin: 0;
  font-size: 24px;
  line-height: 36px;
  font-weight: 500;
  letter-spacing: 3.6px;
  text-indent: 3.6px; // 抵銷末字 letter-spacing，維持視覺置中
  color: #fff;
}

// ── 分支線（pad 斜帶／pc 四角斜線，與角落各斜疊 8px 對接）──
// 尺寸由 PixelBranch 依 steps／cut 自算，此處只定位。
// 掛 .formula__stage 提高特異性，蓋過 PixelBranch 根元素自帶的 position: relative
// （兩者同為單一 class，僅靠載入順序會不穩定）。
.formula__stage .formula__branch {
  position: absolute;
  display: none; // mob 改用 .formula__rail

  @include rwd-min('tablet') {
    display: block;
  }

  &--tl {
    top: 154px;
    left: 161px;

    @include rwd-min('pc') {
      top: 146px;
      left: 316px;
    }
  }
  &--tr {
    top: 154px;
    left: 362px;

    @include rwd-min('pc') {
      top: 146px;
      left: 704px;
    }
  }
  &--bl {
    top: 386px;
    left: 161px;

    @include rwd-min('pc') {
      top: 334px;
      left: 316px;
    }
  }
  &--br {
    top: 386px;
    left: 362px;

    @include rwd-min('pc') {
      top: 334px;
      left: 704px;
    }
  }
}

// ── mob 左側垂直 rail（top 由 template 的 RAILS 帶入；寬高由 PixelRail 自算）──
.formula__stage .formula__rail {
  position: absolute;
  left: 0;
  display: block;

  @include rwd-min('tablet') {
    display: none;
  }
}

// ── 四角議題格子 ──
// 進場滑出階段為橘色（--box-c），is-settled 後瞬間轉灰——多重背景外框無法平滑過渡
.formula__box {
  --box-c: var(--color-orange);
  position: absolute;
  width: 301px;
  height: 154px;
  padding-top: 68px; // 列點區距格子頂，三斷點一致
  // pc/pad 分鏡 2–3：自中央塊後方（--from-*）滑到定位（位移歸零）。
  // --o 於滑出前 12% 就轉滿 → 現身瞬間仍被中央塊遮住，看不到淡入（像素風不淡入）；
  // mob 則無遮蔽物，改順著 rail 水平臂的方向自左滑入 16px（4 格）＋淡入。
  opacity: var(--o, 0);
  transform: translate(
    calc(var(--from-x) * (1 - var(--p, 0))),
    calc(var(--from-y) * (1 - var(--p, 0)))
  );

  @include rwd-min('tablet') {
    width: 273px;
  }
  @include rwd-min('pc') {
    width: 324px;
  }

  &::before {
    @include pixel-frame(var(--box-c));
  }

  .formula.is-settled & {
    --box-c: var(--color-gray-light);
  }

  // --from-*：進場起點到定位點的位移量（pc/pad 為中央塊正後方；mob 為左方 16px）
  &--tl {
    top: 197px;
    left: 44px;
    --from-x: -16px;
    --from-y: 0px;

    @include rwd-min('tablet') {
      top: 0;
      left: 0;
      --from-x: 165px;
      --from-y: 223px;
    }
    @include rwd-min('pc') {
      --from-x: 370px;
      --from-y: 185px;
    }
  }
  &--tr {
    top: 545px;
    left: 44px;
    --from-x: -16px;
    --from-y: 0px;

    @include rwd-min('tablet') {
      top: 0;
      right: 0;
      left: auto;
      --from-x: -171px;
      --from-y: 223px;
    }
    @include rwd-min('pc') {
      --from-x: -370px;
      --from-y: 185px;
    }
  }
  &--bl {
    top: 371px;
    left: 44px;
    --from-x: -16px;
    --from-y: 0px;

    @include rwd-min('tablet') {
      top: auto;
      bottom: 0;
      left: 0;
      --from-x: 165px;
      --from-y: -223px;
    }
    @include rwd-min('pc') {
      --from-x: 370px;
      --from-y: -185px;
    }
  }
  &--br {
    top: 728px;
    left: 44px;
    --from-x: -16px;
    --from-y: 0px;

    @include rwd-min('tablet') {
      top: auto;
      right: 0;
      bottom: 0;
      left: auto;
      --from-x: -171px;
      --from-y: -223px;
    }
    @include rwd-min('pc') {
      --from-x: -370px;
      --from-y: -185px;
    }
  }
}

.formula__box-head {
  position: absolute;
  top: 12px;
  right: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 0;
  font-size: var(--text-h5);
  font-weight: 500;
  color: #fff;
  background: var(--box-c);
}

.formula__box-logo {
  display: block;
  height: 22px;
  width: auto;
}

.formula__box-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 239px; // 內容區固定寬、格子內置中（三斷點格子寬不同，左右內距因此不等）
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.formula__box-item {
  position: relative;
  padding-left: 13px; // 4px 方塊 bullet + 9px 間距
  font-size: 15px;
  line-height: 15px;
  color: var(--color-gray);

  &::before {
    content: '';
    position: absolute;
    top: 5.5px;
    left: 0;
    width: 4px;
    height: 4px;
    background: var(--box-c);
  }
}
</style>
