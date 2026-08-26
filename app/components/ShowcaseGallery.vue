<template>
  <section ref="sectionRef" class="showcase-gallery">
    <!-- 隱藏的母路徑（單峰常態分佈鐘形）；getPointAtLength 取沿線座標 -->
    <svg class="showcase-gallery__path-def" viewBox="0 0 1000 1000" aria-hidden="true">
      <path ref="pathRef" :d="BELL_D" fill="none" />
    </svg>

    <div ref="stageRef" class="showcase-gallery__stage">
      <div
        v-for="(c, i) in cards"
        :key="i"
        ref="cardRefs"
        class="showcase-gallery__card"
        :class="{
          'showcase-gallery__card--blank': c.src === '',
          'showcase-gallery__card--vector': isVector(c),
        }"
        :style="{
          width: `${((c.w * (c.scale ?? 1)) / designW) * 100}%`,
          aspectRatio: `${c.w} / ${c.h}`,
        }"
      >
        <UPic
          v-if="c.src"
          :src="c.src"
          :ext="c.ext"
          :use-prefix="false"
          :srcset="['mob']"
          :use2x="!isVector(c)"
          :webp="!isVector(c)"
          classname="showcase-gallery__img"
          :alt="c.alt ?? ''"
        />
        <!-- 【測試用】左上角白底黑字的順序編號，僅供確認卡片排序／滾動方向；
             正式上線時把 DEBUG_SHOW_INDEX 設為 false（或整段連同樣式一起刪除） -->
        <span v-if="DEBUG_SHOW_INDEX" class="showcase-gallery__card-index">
          {{ i + 1 }}
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/** 單張卡片：設計稿尺寸（px @1280 stage）＋（可選）正式素材 */
export interface ShowcaseSlide {
  w: number;
  h: number;
  /** 圖片路徑。有值＝顯示圖；'' ＝留白（佔位但不畫）；省略＝只有灰底 backdrop */
  src?: string;
  alt?: string;
  /** 副檔名（預設 jpg）；'svg' ＝透明底的向量卡（無 @2x／webp，去灰底與陰影） */
  ext?: string;
  /** 卡片放大倍率（預設 1）；只放大版面盒子，不影響路徑上的動態縮放與疊層 */
  scale?: number;
}

// 「綁滾動多圖輪播」正式素材：校稿後由 15 張精簡為 11 張（抽掉 pic30_05／07／08／10），
// 順序與放大倍率依校稿表指定；寬度沿用設計稿的大小分佈（120~273 @1280 stage），
// 高度依各圖實際比例（3:2 / 4:5 / 1:1）換算，避免 cover 裁切
// （module scope：defineProps 的 default 會被 hoist，不能引用 setup 區域變數）
// 留白（src: ''）＝該張抽掉不顯示，但保留原尺寸佔位撐開節奏；scale 為校稿指定的放大倍率
// 第 3／6／9 張為 AI 數據向量卡（428:574 直式）：沿用原留白格的高度換算寬度，避免比例被拉伸
const DESIGN_SLIDES: ShowcaseSlide[] = [
  { w: 273, h: 182, src: '/img/data/udn75_pic30_01' },
  { w: 161, h: 201, src: '/img/data/udn75_pic30_12', scale: 1.5 },
  {
    w: 120,
    h: 161,
    src: '/img/data/udn75_data_stat_03',
    ext: 'svg',
    scale: 1.5,
    alt: 'AI 搜尋累積使用人次 20,000+',
  },
  { w: 173, h: 173, src: '/img/data/udn75_pic30_15', scale: 2 },
  { w: 173, h: 216, src: '/img/data/udn75_pic30_04' },
  {
    w: 105,
    h: 141,
    src: '/img/data/udn75_data_stat_06',
    ext: 'svg',
    scale: 1.5,
    alt: 'AI 搜尋累積回應人次 50,000+',
  },
  { w: 120, h: 120, src: '/img/data/udn75_pic30_14', scale: 2 },
  { w: 208, h: 139, src: '/img/data/udn75_pic30_02' },
  {
    w: 120,
    h: 161,
    src: '/img/data/udn75_data_stat_09',
    ext: 'svg',
    scale: 1.5,
    alt: 'AI 每日推薦文章累計使用人次 40,000+',
  },
  { w: 225, h: 150, src: '/img/data/udn75_pic30_13', scale: 1.7 },
  { w: 273, h: 182, src: '/img/data/udn75_pic30_11', scale: 1.2 },
];
</script>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { killScrollTriggers } from '@/utils/scroll-trigger';

const props = defineProps({
  /** 卡片清單（設計稿尺寸＋素材）；張數不足會自動循環填滿 count */
  slides: {
    type: Array as () => ShowcaseSlide[],
    default: () => DESIGN_SLIDES,
  },
  /** 同時鋪在路徑上的卡片數（越多越像連續 stream）；與 slides 張數一致才不會出現重複素材 */
  count: { type: Number, default: 11 },
  /** pin 期間可捲動距離（px）；越大動得越慢 */
  pinDistance: { type: Number, default: 2000 },
  /** 端點最小縮放（路徑兩端） */
  minScale: { type: Number, default: 0.3 },
  /** 峰頂最大縮放 */
  maxScale: { type: Number, default: 1.1 },
  /**
   * 元件寬度：路徑兩端（出現/消失點）占視窗寬的比例。1=貼齊兩側、<1=往內縮、>1=推到畫面外。
   * 卡片相位固定為 1/count，所以這條就是「卡片間距」的總開關 —— 調大＝路徑拉長＝間距變鬆
   * （卡片大小由 designW 決定，不會跟著變）。
   */
  widthRatio: { type: Number, default: 1.1 },
  /** 每張 rotateX 的分佈上限（度）；各卡分散在 [-range, +range]，±180 = 上下鏡像 */
  rotateXRange: { type: Number, default: 180 },
  /**
   * 照片 scaleY 的下/上限（改各自鐘形的峰高）。實際值還會被 measure() 壓在數據卡振幅
   * 之下（見 PHOTO_AMP_RATIO），所以窄視窗下抽到的上限不一定吃得到。
   */
  scaleYMin: { type: Number, default: 0.6 },
  scaleYMax: { type: Number, default: 1.3 },
  /**
   * AI 數據向量卡專用的峰高（希望值）。高於 scaleYMax，讓三張數據卡的峰頂就是整個波段的
   * 最高／最低點。measure() 會再依當前視窗把它夾到「峰頂不被 overflow:hidden 切到」的上限，
   * 所以這裡可以放心給大值：窄視窗自動讓步，寬視窗才吃得到全部。
   */
  vectorScaleY: { type: Number, default: 1.5 },
});

// 【測試用】顯示每張卡片左上角的順序編號；不需要時改成 false 即可拿掉
const DEBUG_SHOW_INDEX = false;

/** 設計稿 stage 寬（卡片尺寸以此換算為 %） */
const DESIGN_W = 1280;

// 母路徑：單峰常態分佈鐘形（左右對稱）。改這條即可調整波形。
const BELL_D =
  'M 120,591 Q 240,538 270,506 Q 300,474 330,431 Q 360,388 390,345.5 ' +
  'Q 420,303 460,276.5 Q 500,250 540,276.5 Q 580,303 610,345.5 ' +
  'Q 640,388 670,431 Q 700,474 730,506 Q 760,538 820,564.5 L 880,591';

const sectionRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
const cardRefs = ref<HTMLDivElement[]>([]);

// 卡片相對尺寸的分母：pad / mob 稿卡片占視窗比例放大
//（pc 241/1280≈19%、pad 333/768≈43%、mob 214/414≈52%），measure() 依斷點更新
const designW = ref(DESIGN_W);

const cards = computed(() =>
  Array.from(
    { length: props.count },
    (_, i) => props.slides[i % props.slides.length]!,
  ),
);

/** 向量卡（SVG）：沒有 @2x／webp 變體，樣式也不畫灰底與陰影 */
const isVector = (c: ShowcaseSlide) => c.ext === 'svg';

// 向量卡的 z-index 加成：照片依縮放落在 30~110，加 1000 讓 SVG 數據卡永遠疊在照片之上
//（透明底的橘字被照片壓住會像斷字），彼此之間仍照縮放前後排序
const VECTOR_Z_BOOST = 1000;

// 三張 AI 數據向量卡的峰頂朝向（依卡片出現順序，即第 3／6／9 張）：
// -1 ＝ rotateX 180° 上下鏡像，峰頂朝下（落在波段最低點）；+1 ＝ 峰頂朝上（最高點）。
// 校稿指定「下、上、下」。
const VECTOR_PEAK_DIRS = [-1, 1, -1];

/** 向量卡峰頂與視窗邊緣保留的空隙（px）：貼齊 0 會因為次像素捨入而看起來被削一刀 */
const VECTOR_EDGE_GAP = 8;

/** 照片振幅相對「最矮那張數據卡」的比例上限：留 15% 差距，極值點才看得出是數據卡 */
const PHOTO_AMP_RATIO = 0.85;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  const section = sectionRef.value;
  const stage = stageRef.value;
  const path = pathRef.value;
  if (!section || !stage || !path) return;

  const total = path.getTotalLength();

  // 取樣路徑量出 x / y 範圍（path 改了也自動跟著）
  let yMin = Infinity;
  let yMax = -Infinity;
  let xMin = Infinity;
  let xMax = -Infinity;
  for (let s = 0; s <= 1; s += 0.02) {
    const pp = path.getPointAtLength(s * total);
    if (pp.y < yMin) yMin = pp.y;
    if (pp.y > yMax) yMax = pp.y;
    if (pp.x < xMin) xMin = pp.x;
    if (pp.x > xMax) xMax = pp.x;
  }
  const ySpan = yMax - yMin || 1;
  const xExtent = (xMax - xMin) / 1000 || 1; // 路徑水平總寬（正規化 0..1）
  const yPeakNorm = Math.abs((yMin - 500) / 1000); // 峰頂距中線的正規化距離（乘 sclY×S ＝實際 px）

  const N = props.count;

  // 每張一條不同的 path：同一條 base bell 套各自的 rotateX(θ) + scaleY。
  // 照片：θ 與 scaleY 皆「隨機」取，使相鄰路徑之間的差距不固定（非等差）。
  // AI 數據向量卡：不進隨機池。隨機的 θ 可能落在 ±90° 附近使 cosθ≈0，路徑會被壓成一條
  // 水平直線、那張卡就一路貼著中線滑過去，走不到波段的高低點。改成寫死 cosθ = ±1（滿振幅
  // 不壓扁），方向照 VECTOR_PEAK_DIRS。峰高與「照片不得超過數據卡」的夾擠都在 measure()，
  // 因為兩者都跟視窗尺寸有關，resize 要重算。
  const DEG = Math.PI / 180;
  const cosθ: number[] = []; // rotateX 的 cos（=垂直 scaleY；負值=上下鏡像、0=俯視收成一線）
  const sclYBase: number[] = []; // 抽到的峰高（照片＝隨機值、向量卡＝vectorScaleY 希望值）
  const sclY: number[] = []; // 實際使用的峰高：由 measure() 依當前視窗從 sclYBase 換算
  let vectorSeen = 0;
  for (let i = 0; i < N; i++) {
    if (isVector(cards.value[i]!)) {
      cosθ[i] = VECTOR_PEAK_DIRS[vectorSeen % VECTOR_PEAK_DIRS.length]!;
      sclYBase[i] = props.vectorScaleY;
      vectorSeen++;
      continue;
    }
    const theta = (Math.random() * 2 - 1) * props.rotateXRange * DEG; // 隨機 θ ∈ [-range, +range]
    cosθ[i] = Math.cos(theta);
    sclYBase[i] =
      props.scaleYMin + Math.random() * (props.scaleYMax - props.scaleYMin); // 隨機峰高
  }

  let S = 0; // 垂直基準（依 min(視窗寬高) 等比）
  let SX = 0; // 水平展開基準（由 widthRatio × 視窗寬 決定）
  const measure = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    // pad / mob 稿：卡片放大、路徑向視窗外擴（群組寬 pc 903/1280、
    // pad 1246/768、mob 800/414），垂直振幅同步放大
    const isMob = window.matchMedia('(max-width: 767.98px)').matches;
    const isPad = !isMob && window.matchMedia('(max-width: 1279.98px)').matches;
    designW.value = isMob ? 467 : isPad ? 556 : DESIGN_W;
    const spread = isMob ? 2.7 : isPad ? 2.3 : 1;
    const vScale = isMob ? 1.55 : isPad ? 1.3 : 1;
    S = Math.min(w, h) * 0.95 * vScale;
    SX = (props.widthRatio * spread * w) / xExtent; // 路徑兩端落在 ±widthRatio×spread×寬/2

    // 向量卡帶數字，峰頂被 section 的 overflow:hidden 切到就會斷字。但 S 綁在 min(寬,高)、
    // 卡片尺寸卻綁在視窗寬度 —— 超寬螢幕（如 21:9）卡片變大而振幅沒變，vectorScaleY 直上
    // 會頂出畫面。所以固定值不夠，這裡依當前視窗反推「峰頂剛好貼齊上/下緣」的峰高上限。
    // 朝上的那張還要多讓開 fixed header：卡片 z-index 是 1000+，比 header 的 1000 高，
    // 不讓的話數字會直接壓在 logo／nav 上面。
    const headerH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height',
        ),
      ) || 0;
    let minVectorAmp = Infinity; // 三張數據卡裡最小的振幅（照片要壓在它之下）
    for (let i = 0; i < N; i++) {
      const c = cards.value[i]!;
      if (!isVector(c)) continue;
      const cardW = ((c.w * (c.scale ?? 1)) / designW.value) * w;
      const halfH = ((cardW * c.h) / c.w) * props.maxScale * 0.5; // 峰頂時 scale ＝ maxScale
      const inset = (cosθ[i]! > 0 ? headerH : 0) + VECTOR_EDGE_GAP;
      const cap = (h * 0.5 - halfH - inset) / (yPeakNorm * S);
      sclY[i] = Math.min(sclYBase[i]!, Math.max(0, cap));
      minVectorAmp = Math.min(minVectorAmp, sclY[i]!); // 向量卡 |cosθ| ＝ 1，峰高即振幅
    }

    // 照片壓在數據卡振幅之下 —— 上一步的視窗夾擠可能把數據卡壓到比隨機照片還矮，
    // 那「三張數據卡是波段極值」就不成立了。振幅 ＝ sclY × |cosθ|，所以反推 sclY 上限。
    const photoAmpLimit = minVectorAmp * PHOTO_AMP_RATIO;
    for (let i = 0; i < N; i++) {
      if (isVector(cards.value[i]!)) continue;
      const absCos = Math.abs(cosθ[i]!);
      sclY[i] =
        absCos > 1e-3
          ? Math.min(sclYBase[i]!, photoAmpLimit / absCos)
          : sclYBase[i]!; // cosθ≈0：路徑已被壓平，本來就沒振幅
    }
  };
  measure();

  const state = { p: 0 };

  const render = () => {
    const els = cardRefs.value;
    const list = cards.value;
    for (let i = 0; i < N; i++) {
      const el = els[i];
      if (!el) continue;
      const t = (i / N - state.p + 1) % 1; // 輸送帶：每張各自的相位 − 全域進度（右 → 左）
      const pt = path.getPointAtLength(t * total);
      const c = cosθ[i]!;
      // rotateX（正交投影）：軌跡 Y 乘 cosθ → 同一條 bell 被垂直壓縮/翻轉成各自路徑
      const hx = (pt.x - 500) / 1000; // 水平不受 rotateX 影響
      const hy = ((pt.y - 500) / 1000) * sclY[i]! * c; // scaleY 峰高 × rotateX 垂直翻轉
      const heightFactor = (yMax - pt.y) / ySpan; // 0=端、1=峰
      const vs =
        props.minScale + (props.maxScale - props.minScale) * heightFactor;
      el.style.left = `calc(50% + ${hx * SX}px)`;
      el.style.top = `calc(50% + ${hy * S}px)`;
      // 只有 path（hy 乘 cosθ）會 rotate；卡片本身保持正立，不壓縮/翻轉
      el.style.transform = `translate(-50%, -50%) scale(${vs})`;
      const zBoost = isVector(list[i]!) ? VECTOR_Z_BOOST : 0;
      el.style.zIndex = String(Math.round(vs * 100) + zBoost);
      el.style.opacity = String(Math.min(1, heightFactor * 2.4)); // 端點淡出，藏接縫
    }
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${props.pinDistance}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.to(state, { p: 1, ease: 'none', onUpdate: render });

  render(); // 初始定位

  const onRefresh = () => {
    measure();
    render();
  };
  ScrollTrigger.addEventListener('refreshInit', onRefresh);

  onBeforeUnmount(() => {
    ScrollTrigger.removeEventListener('refreshInit', onRefresh);
    killScrollTriggers(tl.scrollTrigger); // 卸載路徑不 revert，見 utils/scroll-trigger
    tl.kill();
  });
});
</script>

<style lang="scss" scoped>
.showcase-gallery {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

// 隱藏母路徑，但保留幾何可量測（不可用 display:none）
.showcase-gallery__path-def {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: visible;
  opacity: 0;
  pointer-events: none;

  path {
    stroke: #fff;
  }
}

.showcase-gallery__stage {
  position: absolute;
  inset: 0;
}

// 灰底為圖片載入前的 backdrop（尺寸依設計稿）
.showcase-gallery__card {
  position: absolute;
  overflow: hidden;
  background: #d9d9d9;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.2));
  will-change: transform, opacity;
  user-select: none;

  // UPic 輸出 picture > img，兩層都撐滿卡片（覆蓋 .u-pic-img 的 height: auto）
  :deep(.u-pic) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(.showcase-gallery__img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 留白卡：src 給 '' 時只佔位（照樣跑路徑、撐開間距），但不畫灰底與陰影
.showcase-gallery__card--blank {
  background: none;
  filter: none;
}

// 向量卡（ext: 'svg'）：AI 數據圖為透明底，去掉灰底與陰影（陰影會沿著字描邊），改 contain 不裁切
.showcase-gallery__card--vector {
  background: none;
  filter: none;

  :deep(.showcase-gallery__img) {
    object-fit: contain;
  }
}

// 【測試用】卡片左上角的順序編號；不需要時連同 template 內的 DEBUG_SHOW_INDEX 區塊一起刪除
.showcase-gallery__card-index {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 2px 6px;
  background: #fff;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  pointer-events: none;
}
</style>
