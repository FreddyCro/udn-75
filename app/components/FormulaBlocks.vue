<script lang="ts" setup>
/**
 * FormulaBlocks — 「Publish X 議題智囊包」放射圖（news 頁）。
 * 三段式版面：pc 中央放射 2×2、pad 上下兩排、mob 直排＋左側 rail；
 * 連接線由像素元件（PixelBranch／PixelRail)生成。中央塊常駐，
 * 捲動 scrub 驅動（不 pin、回捲倒退），**舞台以 sticky 定在畫面中央播完**：
 *   分鏡從「Publish X 中央塊走到畫面正中」那一刻才起跑（見 build 的 start），
 *   其後 HOLD_VH 個視窗高的捲動距離全程黏在中央，演完才隨頁面捲走。
 *   不這麼做的話幾何上放不下：section 只有一屏高，中央塊抵達畫面中央時，
 *   離它捲出上緣只剩約 150px —— 動態不是提早演完（原本 start: 'top 80%' 就是
 *   在中央塊還在畫面下緣時就跑完），就是四格會在半空中被裁掉。
 *   定住用 CSS sticky 而非 GSAP pin：同 useMediaIntroMotion 的理由（觸控 pin 卡頓、
 *   pin-spacer 需全站 refresh，且會把 z-index 抄走 —— 見 Subpage 的 .pin-spacer 註解）。
 *   pc/pad：四格自中央塊後方現身 → 經 2×2 堆疊散開到四角，分支黏著格子角於末段推出。
 *   mob：中央塊常駐，由上而下逐組「rail 往下畫完 → 議題框原地現身」。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  killScrollTriggers,
  refreshScrollTriggers,
} from '@/utils/scroll-trigger';

export interface FormulaItem {
  /** 藝術字標題圖（SVG 路徑；無圖時 fallback 為 title 文字） */
  titleImg?: string;
  /** 標題文字（作為 alt 與 fallback） */
  title?: string;
  /** 列點（15px 活字） */
  points?: string[];
}

withDefaults(
  defineProps<{
    /** 中央塊：藝術字圖（img）+ 副標（title）；eyebrow 作為圖的 alt 與 fallback */
    center?: { img?: string; eyebrow?: string; title?: string };
    /** 四角格子（依序：左上、右上、左下、右下） */
    items?: FormulaItem[];
  }>(),
  {
    center: () => ({ title: '議題智囊包' }),
    items: () => [],
  },
);

// 藝術字路徑由呼叫端從 locales/*.json 傳入（純字串）→ 須自行補資產前綴
const assetUrl = useAssetUrl();

const POS = ['tl', 'tr', 'bl', 'br'] as const;
// 分支方向：tl/br「\」、tr/bl 鏡射「/」；push＝收合方向（朝中央塊，視覺座標、與 flip 無關）
const BRANCH: Record<
  (typeof POS)[number],
  { flip: boolean; push: { x: number; y: number } }
> = {
  tl: { flip: false, push: { x: 1, y: 1 } },
  tr: { flip: true, push: { x: -1, y: 1 } },
  bl: { flip: true, push: { x: 1, y: -1 } },
  br: { flip: false, push: { x: -1, y: -1 } },
};

// pc/pad 時序（捲動進度 0..1，at＝起點、span＝長度）：box＝四格位移段（分支同步）
const STOPS = {
  box: { at: 0, span: 0.5 },
  settle: 0.75,
} as const;

// mob 時序：由上而下逐組（rail 畫完 → 議題框原地現身），四框最後才一起轉灰
const MOB_STOPS = {
  step: { at: 0.12, span: 0.19 }, // 每組佔的進度長度（rail 畫完後留拍再進下一組）
  rail: 0.12, // 組內 rail 畫線長度，畫到底議題框即現身
  settle: 0.94,
} as const;

// mob 直排由上而下的視覺順序 → POS 索引（tl → bl → tr → br，見 .formula__box 定位）
const MOB_ORDER = [0, 2, 1, 3];

// 舞台黏在畫面中央的捲動距離（視窗高的倍數）＝ 整段分鏡的長度。
// 0.8 是照舊值挑的：原本 start 'top 80%' → end 'bottom 70%' 在 1440×900 量到 690px，
// 0.8 個視窗高（720px）與它同量級，節奏不會因為這次改動而變快或變慢。
const HOLD_VH = 0.8;

// 三段式舞台（Figma 座標系）：斷點切換版面、<舞台寬時整體 scale
const STAGES = {
  pc: { w: 1064, h: 524 },
  pad: { w: 610, h: 600 },
  mob: { w: 360, h: 882 },
} as const;

// mob 左側垂直 rail（x=0、依序接到四格）；第一段自中央塊長出故較短、首列切半
const RAILS = [
  { y: 156, rows: 29, shortStart: true },
  { y: 284, rows: 41 },
  { y: 460, rows: 41 },
  { y: 636, rows: 41 },
];

// 分支幾何：pc 44×44 斜切階梯、pad 76×60 平切斜帶；mob 不顯示
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

// 視窗高的單一來源（--vh）：sticky 的偏移與分鏡長度都吃它，不吃 window.innerHeight
// （後者在行動裝置上會隨網址列收合而變，見 useViewportHeight）。
const { vhPx } = useViewportHeight();

const isMob = computed(() => mode.value === 'mob');

// 舞台可視框高：pc 固定 600（舞台 524 垂直置中），其餘＝舞台縮放後的自然高。
// 同時餵給 CSS（--formula-vp-h）算 sticky 的置中偏移，故拉成 computed 而非寫在 template。
const viewportH = computed(() =>
  mode.value === 'pc' ? 600 : Math.round(STAGES[mode.value].h * scale.value),
);

// 分鏡長度＝舞台黏在中央的捲動距離。reduced-motion 不跑分鏡（progress 直接 1），
// 那就不該平白多出一段空捲動 —— 收成 0，版面回到「就是一屏」。
//
// CSS 側走 vhLength()（吐 calc(var(--vh) * n) 字串）而非 px 數字：後者 SSR 算不出來，
// 會與 hydration 後的值不同 → 屬性 mismatch。字串兩邊一模一樣。
// JS 側（ScrollTrigger 的 end）另外用 vhPx()，兩者讀的是同一個 --vh。
const holdLength = computed(() => (reduced.value ? '0px' : vhLength(HOLD_VH)));

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** 某段內的 local 進度（0..1，未套 ease） */
const local = (at: number, span: number) => clamp01((progress.value - at) / span);

// 分支盒尺寸（同 PixelBranch 的幾何換算）：pc bevel 44×44、pad flat 76×60
const branchBox = computed(() => {
  const g = BRANCH_GEO[mode.value];
  const run = g.steps * 4;
  return g.cut === 'flat' ? { w: run + 16, h: run } : { w: run + 8, h: run + 8 };
});

// 四格兩段路徑（與定位點的 xy 偏移）：center＝全疊舞台正中（藏在中央塊後）
// → cluster＝2×2 緊排堆疊（欄距 24、下列疊上列 16px）→ 四角定位。
// mob 未用（--from 寫在 CSS、進度走 mobBoxP）
const BOX_PATH = {
  pc: { center: { x: 370, y: 185 }, cluster: { x: 196, y: 116 } },
  pad: { center: { x: 168, y: 223 }, cluster: { x: 20, y: 154 } },
  mob: null,
} as const;
// 進度前 45%：中央 → 堆疊；其餘：堆疊 → 四角定位
const CLUSTER_SPLIT = 0.45;

// pc/pad 共用進度：量化到 4px 步距（像素感來源；四格不淡入、常駐不透明）
const boxP = computed(() => {
  const path = BOX_PATH[mode.value];
  if (!path) return 0;
  const steps = Math.round(Math.max(path.center.x, path.center.y) / 4) || 1;
  const t = local(STOPS.box.at, STOPS.box.span);
  return Math.round(t * steps) / steps;
});

// 與定位點的當前偏移（未帶方向）：兩段內插、ease 各段自套
//（整段套會讓「中央→堆疊」瞬間衝完、堆疊態一閃而過）
const boxOffset = computed(() => {
  const path = BOX_PATH[mode.value];
  if (!path) return { x: 0, y: 0 };
  const p = boxP.value;
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });
  return p < CLUSTER_SPLIT
    ? lerp(path.center, path.cluster, easeOut(p / CLUSTER_SPLIT))
    : lerp(path.cluster, { x: 0, y: 0 }, easeOut((p - CLUSTER_SPLIT) / (1 - CLUSTER_SPLIT)));
});

// 分支收合位移＝格子剩餘偏移（各軸 cap 在整條尺寸，任一軸達上限即全藏）：
// 格子還在中央塊旁時分支看不見，近定點才被推出、黏著格子角
const branchOffset = computed(() => {
  const o = boxOffset.value;
  const b = branchBox.value;
  return {
    x: Math.min(o.x, b.w),
    y: Math.min(o.y, b.h),
  };
});

/**
 * 四格當前樣式：mob＝該組 rail 畫完才原地現身（無位移）；
 * pc/pad＝與定位點的偏移（--from-* 每幀帶入 → CSS transform translate）
 */
function boxStyle(i: number) {
  if (isMob.value) {
    // rail 長完前整框藏住（像素風不淡入 → visibility 直接切換，回捲會再藏回）
    return { visibility: mobBoxOn.value[i] ? ('visible' as const) : ('hidden' as const) };
  }
  const o = boxOffset.value;
  const sign = BRANCH[POS[i]!].push;
  return {
    '--from-x': `${sign.x * o.x}px`,
    '--from-y': `${sign.y * o.y}px`,
  };
}

/** 分支裁切框樣式：尺寸＋收合位移（方向見 BRANCH.push） */
function branchStyle(p: (typeof POS)[number]) {
  const b = branchBox.value;
  const o = branchOffset.value;
  return {
    width: `${b.w}px`,
    height: `${b.h}px`,
    '--bx': `${BRANCH[p].push.x * o.x}px`,
    '--by': `${BRANCH[p].push.y * o.y}px`,
  };
}

/** mob 第 i 組（由上而下）的起點 */
const mobAt = (i: number) => MOB_STOPS.step.at + i * MOB_STOPS.step.span;
// mob 四條 rail 的畫線進度（陣列序＝ RAILS 序，由上而下）；同樣不套 ease
const railP = computed(() => RAILS.map((_, i) => local(mobAt(i), MOB_STOPS.rail)));
// mob 四格議題框現身與否（陣列序＝ POS 序）：該組 rail 畫到底即原地現身
const mobBoxOn = computed(() => {
  const out = [false, false, false, false];
  MOB_ORDER.forEach((pos, i) => {
    out[pos] = progress.value >= mobAt(i) + MOB_STOPS.rail;
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
  scale.value = Math.min(1, w / stage.w);
}

// 舞台被 sticky 黏住那一刻，root 上緣距視窗頂的距離。
// sticky 的偏移是「(視窗高 − 舞台可視框高) / 2」（見 SCSS 的 .formula__viewport），
// 而 root 上緣還要再往上扣掉自己的 padding-top（pc 0、pad 50、mob 34）——
// 量 computed 而非寫死，斷點改了不必跟著改。
// ⚠️ trigger 用 root 而非 viewport：viewport 是 sticky 的，refresh 若剛好發生在它被黏住的
//    當下，量到的起點會是「當下的捲動位置」而不是它在文件裡的位置。root 不會黏。
function startOffsetPx() {
  const root = rootRef.value;
  const padTop = root
    ? parseFloat(getComputedStyle(root).paddingTop) || 0
    : 0;
  return Math.round((vhPx(1) - viewportH.value) / 2 - padTop);
}

function build() {
  const root = rootRef.value;
  if (!root) return;
  st = ScrollTrigger.create({
    trigger: root,
    // 起跑點＝ Publish X 中央塊走到畫面正中的那一刻（pc/pad 的中央塊正好落在舞台的
    // 垂直中線上，故「舞台置中」＝「中央塊置中」；mob 的中央塊本來就在最上面，
    // 由上而下的 rail 分鏡從它長出來，舞台置中同樣是對的起手式）。
    start: () => `top ${startOffsetPx()}px`,
    end: () => `+=${reduced.value ? 0 : Math.round(vhPx(HOLD_VH))}`,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => (progress.value = self.progress),
    onLeave: () => (progress.value = 1), // 捲過整段 → 停在定版（onUpdate 不再進來）
    onLeaveBack: () => (progress.value = 0),
  });
  progress.value = st.progress; // 中途載入（已捲過部分區段）時先對齊實際位置
}

/**
 * @param quiet 卸載路徑傳 true ＝ `kill(false)`，不 revert。
 *
 * 兩個呼叫端要的相反，所以不能一律：
 *   ・跨斷點重建（下方 watch(isMob)）—— **要** revert：緊接著就 onResize()／build()
 *     重新量測，殘留的 inline 樣式會讓量測失準。
 *   ・onBeforeUnmount —— **不要** revert：換頁時舊頁還在畫面上淡出，revert 會把畫面
 *     打回起始態而被看見（見 utils/scroll-trigger 的 killScrollTriggers）。
 */
function teardown(quiet = false) {
  if (quiet) killScrollTriggers(st);
  else st?.kill();
  st = null;
}

function onWindowResize() {
  onResize();
  if (resizeTimer) clearTimeout(resizeTimer);
  // end 為定值、其餘皆重算 → refresh 即可，免重建
  resizeTimer = setTimeout(refreshScrollTriggers, 200);
}

// 跨 768 斷點時序不同 → 整組重建，並以 refresh 後的實際捲動位置校正進度
watch(isMob, () => {
  if (reduced.value) return;
  teardown();
  onResize();
  build();
  refreshScrollTriggers();
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
  teardown(true); // quiet：卸載路徑不 revert，見 teardown 的說明
});
</script>

<template>
  <section
    ref="rootRef"
    class="formula"
    :class="{ 'is-settled': settled }"
    :style="{
      '--formula-vp-h': `${viewportH}px`,
      '--formula-hold': holdLength,
    }"
  >
    <!-- 舞台可視框：sticky 黏在畫面垂直中央，分鏡演完才隨頁面捲走。
         高度 pc 固定 600（舞台 524 垂直置中）；pad/mob＝舞台縮放後的自然高（見 viewportH） -->
    <div ref="viewportRef" class="formula__viewport">
      <div
        class="formula__stage"
        :style="{
          transform:
            mode === 'pc'
              ? `translate(-50%, -50%) scale(${scale})`
              : `translateX(-50%) scale(${scale})`,
        }"
      >
        <div class="formula__center">
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

        <!-- pc/pad 分支：裁切框定位不動，整條 PixelBranch 以 --bx/--by 平移推出 -->
        <div
          v-for="p in POS"
          :key="p"
          class="formula__branch"
          :class="`formula__branch--${p}`"
          :style="branchStyle(p)"
        >
          <PixelBranch
            :progress="1"
            :flip="BRANCH[p].flip"
            :steps="BRANCH_GEO[mode].steps"
            :cut="BRANCH_GEO[mode].cut"
          />
        </div>

        <!-- mob 左側 rail：自上往下逐列畫到各格子 -->
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
          :style="boxStyle(i)"
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

    <!-- 分鏡的捲動跑道：舞台黏住期間被「吃掉」的那段距離。空 div 而非 padding-bottom ——
         padding 這一維已經被三斷點的左右留白佔用（見 .formula 的 padding），
         再疊一個語意不同的值上去，日後調留白會誤傷分鏡長度。 -->
    <div class="formula__hold" aria-hidden="true" />
  </section>
</template>

<style lang="scss" scoped>
// 像素外框：4px 線、角落缺 8px 再於 4px 內縮處補一格 4px 方塊；
// 多重背景繪製 → 盒子伸縮時線寬與角點恆為 4px
@mixin pixel-frame($c, $bg: null) {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  $frame:
    linear-gradient($c, $c) left 8px top 0 / calc(100% - 16px) 4px no-repeat,
    linear-gradient($c, $c) left 8px bottom 0 / calc(100% - 16px) 4px no-repeat,
    linear-gradient($c, $c) left 0 top 8px / 4px calc(100% - 16px) no-repeat,
    linear-gradient($c, $c) right 0 top 8px / 4px calc(100% - 16px) no-repeat,
    linear-gradient($c, $c) left 4px top 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) right 4px top 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) left 4px bottom 4px / 4px 4px no-repeat,
    linear-gradient($c, $c) right 4px bottom 4px / 4px 4px no-repeat;
  background:
    $frame,
    linear-gradient($bg, $bg) left 4px top 4px / calc(100% - 8px)
      calc(100% - 8px) no-repeat;
}

.formula {
  width: 100%;
  padding: 34px 27px;
  background: #fff;
  @include rwd-min('tablet') {
    padding: 26px 20px;
  }
  @include rwd-min('tablet') {
    padding: 50px 20px;
  }
  @include rwd-min('pc') {
    padding: 0;
  }
}

// 舞台可視框：黏在畫面垂直中央（(視窗高 − 本框高) / 2），黏著範圍是 .formula 的
// padding box —— 下面 .formula__hold 撐出的那一段就是它能黏多久。
// 高與 sticky 偏移共用同一個變數（--formula-vp-h，由 script 的 viewportH 寫入），
// 兩者不同步的話舞台就不會真的落在中央。
// ⚠️ vh(1) 而非 100vh：行動裝置的 100vh 會隨網址列收合跳動，偏移跟著跳 → 舞台會抖
//    （--vh 的單一來源見 useViewportHeight）。
// ⚠️ 本框比視窗高時（窄長手機）偏移為負，等於「上緣切齊在視窗上方一點」，仍是置中，
//    不必特別夾住。
// ⚠️ sticky 靠祖先鏈上沒有 overflow: hidden/auto/scroll 才成立；子頁內文那條鏈目前
//    全是 visible（同 Hero 的 .sec1__hero 註解），日後有人加上去這裡會**安靜失效**。
.formula__viewport {
  position: sticky;
  top: calc((#{vh(1)} - var(--formula-vp-h, 600px)) / 2);
  width: 100%;
  height: var(--formula-vp-h, 600px);
}

// 分鏡跑道：舞台黏住期間吃掉的捲動距離（reduced-motion 時為 0，見 script 的 holdPx）
.formula__hold {
  height: var(--formula-hold, 0px);
}

// 舞台依斷點定尺寸（Figma 座標系）；尺寸須與 script 的 STAGES 一致
.formula__stage {
  position: absolute;
  top: 0;
  left: 50%;
  width: 360px;
  height: 882px;
  transform-origin: top center;

  @include rwd-min('tablet') {
    width: 610px;
    height: 600px;
  }

  // pc：viewport 固定 600、舞台 524 垂直置中（transform 由 template 換成
  // translate(-50%, -50%)）
  @include rwd-min('pc') {
    top: 50%;
    width: 1064px;
    height: 524px;
    transform-origin: center;
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
  // 兩行文字整體下移 4px：flex 置中下，padding-top 8px＝內容中心下移 4px。
  // 外框／底色是絕對定位的 ::before／::after（貼 padding box），不受影響。
  padding-top: 8px;

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
    @include pixel-frame(var(--color-orange), #fff);
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
  // 保留版位：沒有這行的話高度由載入後的 SVG 決定，載入前是 0 高。撐開的那一刻
  // 它下面所有 ScrollTrigger pin 的實際位置就被推走，而 pin 的起訖是量完就固定的
  // 絕對座標（脈絡見 utils/scroll-trigger 的 refreshOnContentResize）。
  // 數字＝素材 viewBox，對帳見 test/subpage-image-space-reservation.spec.ts。
  aspect-ratio: 257.001 / 44.623;

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

// 分支＝裁切框（尺寸由 branchStyle() 帶入）：定位不動、overflow 裁切，
// 內部 PixelBranch 以 --bx/--by 平移；與中央塊角落斜疊 8px 對接
.formula__stage .formula__branch {
  position: absolute;
  display: none; // mob 改用 .formula__rail
  overflow: hidden;

  @include rwd-min('tablet') {
    display: block;
  }

  // translate 寫在 scaleX 前（外層座標）：flip 只鏡射圖形，不影響推出方向
  :deep(.pixel-branch) {
    transform: translate(var(--bx, 0px), var(--by, 0px));
  }

  :deep(.pixel-branch--flip) {
    transform: translate(var(--bx, 0px), var(--by, 0px)) scaleX(-1);
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

// mob 左側垂直 rail（top 由 RAILS 帶入；寬高由 PixelRail 自算）
.formula__stage .formula__rail {
  position: absolute;
  left: 0;
  display: block;

  @include rwd-min('tablet') {
    display: none;
  }
}

// 四角議題格子：位移中為橘色（--box-c），is-settled 後瞬間轉灰
//（多重背景外框無法平滑過渡）；三斷點皆不改透明度
.formula__box {
  --box-c: var(--color-orange);
  position: absolute;
  width: 301px;
  height: 154px;
  padding-top: 68px; // 列點區距格子頂，三斷點一致
  transform: translate(var(--from-x, 0px), var(--from-y, 0px));

  @include rwd-min('tablet') {
    width: 273px;
  }
  @include rwd-min('pc') {
    width: 324px;
  }

  &::before {
    @include pixel-frame(var(--box-c), #fff);
  }

  .formula.is-settled & {
    --box-c: var(--color-gray-light);
  }

  // --from-*：pc/pad 由 boxStyle() 每幀帶入（路徑見 BOX_PATH）；mob 無位移，
  // rail 畫完由 visibility 原地現身
  &--tl {
    top: 197px;
    left: 44px;

    @include rwd-min('tablet') {
      top: 0;
      left: 0;
    }
  }
  &--tr {
    top: 545px;
    left: 44px;

    @include rwd-min('tablet') {
      top: 0;
      right: 0;
      left: auto;
    }
  }
  &--bl {
    top: 371px;
    left: 44px;

    @include rwd-min('tablet') {
      top: auto;
      bottom: 0;
      left: 0;
    }
  }
  &--br {
    top: 728px;
    left: 44px;

    @include rwd-min('tablet') {
      top: auto;
      right: 0;
      bottom: 0;
      left: auto;
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
