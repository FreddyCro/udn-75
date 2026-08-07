<template>
  <div ref="rootRef" class="loader" aria-label="載入中" role="img">
    <!-- 網格比視窗略大且置中，溢出等量裁掉 → 中間格中心 = 視窗正中心 -->
    <div class="grid">
      <div v-for="i in count" :key="i" ref="tileRefs" class="tile" />
    </div>
    <div ref="counterRef" class="counter">0%</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  /** 自動播放總秒數（0 → 100%）；越小越快 */
  duration: { type: Number, default: 3.2 },
  /** 方塊邊長（px）；固定尺寸，欄列數由視窗推算。設計稿 loading-1~7：1280×720 稿上 83.333px */
  tileSize: { type: Number, default: 83.333 },
  /** 橘色「處理中」前緣的方塊數（同時有幾顆橘）。設計稿 loading-6（96%）為 1 顆橘＋2 顆藍 */
  orangeTiles: { type: Number, default: 1 },
  /** 底色（未載入） */
  blue: { type: String, default: '#9FD6FF' },
  /** 前緣「處理中」色 / 收尾中央色 */
  orange: { type: String, default: '#FF7F00' },
  /** 載入完成色（=背景） */
  white: { type: String, default: '#ffffff' },
  /** 計數文字色 */
  textColor: { type: String, default: '#686868' },
  /** 計數文字大小（CSS 長度，可含 clamp()）；微調數字大小用。設計稿 32px */
  counterFontSize: { type: String, default: '32px' },
  /** 進站後延遲幾秒才開始 */
  startDelay: { type: Number, default: 0.2 },
  /** 進度到達此比例（0~1，對應數字百分比）時，中央格就提早翻橘，與後續「100%」數字重疊一段時間 */
  centerOrangeAt: { type: Number, default: 0.8 },
  /**
   * 影片（或主要素材）是否已可播放。
   * false 時進度會封頂在 99%「等載入」，即使 duration 已到也不收尾；
   * 轉為 true 後才會補到 100% 並 emit done。預設 true → 單獨使用時照 duration 跑完。
   */
  ready: { type: Boolean, default: true },
});

const emit = defineEmits<{ done: [] }>();

const rootRef = ref<HTMLDivElement | null>(null);
const counterRef = ref<HTMLDivElement | null>(null);
const tileRefs = ref<HTMLDivElement[]>([]);

// 網格欄列數與總格數（resize 時重算）；cols/rows 強制為奇數，保證有「正中間一格」
const cols = ref(0);
const count = ref(0);
let rows = 0;
let centerIndex = 0; // 正中央那格的 index（最先翻白、最後翻橘、且中心對齊視窗正中心）

// 每格在翻白順序中的「名次」（0..N-1）；名次越小越早翻白
let order: number[] = [];
// 上一幀每格狀態，避免重複寫入 DOM
let prevState: number[] = [];
// 橘色前緣寬度（格數）；僅隨 orangeTiles 變動，故於 buildOrder 算一次。
let band = 1;

let raf = 0;
let prevNow = -1;
let elapsed = 0; // 累積「可見」秒數（隱藏時不累積，避免切回分頁時快轉）
let finished = false;

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// 取 >= v/tile 的最小「奇數」欄列數：奇數才有正中間那一格
const oddCover = (size: number, tile: number) => {
  let n = Math.ceil(size / tile);
  if (n % 2 === 0) n += 1;
  return Math.max(3, n);
};

const computeGrid = () => {
  const vw = rootRef.value?.clientWidth || window.innerWidth;
  const vh = rootRef.value?.clientHeight || window.innerHeight;
  const tile = props.tileSize;
  const c = oddCover(vw, tile);
  const r = oddCover(vh, tile);
  cols.value = c;
  rows = r;
  count.value = c * r;
  // 奇數網格的正中間格：中心即整個網格中心；網格置中後 = 視窗正中心
  centerIndex = Math.floor(r / 2) * c + Math.floor(c / 2);
  if (rootRef.value) {
    rootRef.value.style.setProperty('--cols', String(c));
    rootRef.value.style.setProperty('--tile', `${tile}px`);
  }
};

// 洗牌產生翻白順序（Fisher–Yates），並強制「正中央」為第一個翻白（名次 0）
const buildOrder = (n: number) => {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  // arr[k] = 第 k 名要翻白的「格子 index」。把中央格換到第 0 名。
  const pos = arr.indexOf(centerIndex);
  [arr[0], arr[pos]] = [arr[pos]!, arr[0]!];
  // 轉成 rank：order[格子 index] = 該格的名次
  order = new Array(n);
  for (let rank = 0; rank < n; rank++) order[arr[rank]!] = rank;
  prevState = new Array(n).fill(-1);
  band = Math.max(1, Math.round(props.orangeTiles)); // 橘色前緣寬度
};

// 0=藍 1=橘 2=白
const paint = (idx: number, state: number) => {
  const el = tileRefs.value[idx];
  if (!el || prevState[idx] === state) return;
  prevState[idx] = state;
  el.style.backgroundColor = state === 2 ? props.white : state === 1 ? props.orange : props.blue;
};

const finish = () => {
  finished = true;
  const n = count.value;
  // 其餘翻白、正中央格「直接」翻橘（同一幀）：不再有先全白、隔一段才冒出橘色的空檔；
  // 橘塊精準落在視窗正中心，數字同時淡出（被橘塊取代/遮蓋）
  for (let idx = 0; idx < n; idx++) paint(idx, idx === centerIndex ? 1 : 2);
  if (counterRef.value) counterRef.value.style.opacity = '0';
  emit('done');
};

const frame = (now: number) => {
  if (prevNow < 0) prevNow = now;
  // clamp 單幀 dt：分頁切回/掉幀時不會把進度一次推完
  const dt = Math.min((now - prevNow) / 1000, 0.05);
  prevNow = now;
  elapsed += dt;

  const n = count.value;

  const active = elapsed - props.startDelay;
  if (active <= 0) {
    raf = requestAnimationFrame(frame);
    return;
  }

  const t = Math.min(active / props.duration, 1);
  // 影片尚不可播放時，進度封頂在 0.99（數字停在 99%），等 ready 後才收尾到 100%
  let p = easeInOutQuad(t);
  if (!props.ready) p = Math.min(p, 0.99);
  const whiteCount = Math.floor(p * n);

  // 進度到 centerOrangeAt（如 80%）就先讓中央格翻橘（此時數字仍在跑 → 橘塊與「100%」重疊一段）
  const centerOrangeNow = p >= props.centerOrangeAt;

  // 依名次決定狀態：已過 → 白；前緣 band 內 → 橘；其餘 → 藍
  for (let idx = 0; idx < n; idx++) {
    const rank = order[idx]!;
    let state = rank < whiteCount ? 2 : rank < whiteCount + band ? 1 : 0;
    if (idx === centerIndex && centerOrangeNow) state = 1; // 中央格提早翻橘
    paint(idx, state);
  }

  if (counterRef.value) counterRef.value.textContent = `${Math.round(p * 100)}%`;

  // duration 已到、且影片可播放才收尾；否則持續等待（RAF 續跑，ready 轉 true 後自動收尾）
  if (t >= 1 && props.ready) {
    if (!finished) finish();
    return; // 停止 RAF
  }
  raf = requestAnimationFrame(frame);
};

const start = () => {
  buildOrder(count.value);
  prevNow = -1;
  elapsed = 0;
  finished = false;
  if (counterRef.value) counterRef.value.style.opacity = '1';
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
};

const onResize = () => {
  if (finished) return; // 播完不再重排
  computeGrid();
  nextTick(() => start());
};

onMounted(() => {
  if (counterRef.value) {
    counterRef.value.style.color = props.textColor;
    counterRef.value.style.fontSize = props.counterFontSize;
  }
  // 捲動鎖統一由父層 Hero 擁有（載入期間即已上鎖），本元件不碰 body.overflow，
  // 避免卸載解鎖與父層重新上鎖之間出現「瞬間可捲動」的破口。
  computeGrid();
  nextTick(() => start());
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.loader {
  /* 覆蓋整個視窗的載入層（蓋在 header 之上，z-index > .app-header 的 1000） */
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: hidden;
  background: #fff;
  /* 把略大於視窗的網格置中：溢出等量被裁，正中間那一格中心 = 視窗正中心 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), var(--tile));
  grid-auto-rows: var(--tile);
  flex: none;
}

.tile {
  width: var(--tile);
  height: var(--tile);
  background-color: var(--color-blue);
  /* 翻色帶一點點過渡，避免硬切；前緣波看起來會「流動」 */
  transition: background-color 0.18s linear;
}

.counter {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 設計稿 loading-1~6：32px / weight 300 / 無字距（字體用專案主字體 Noto Sans TC） */
  font-size: 32px;
  font-weight: 300;
  color: var(--color-gray);
  pointer-events: none;
  transition: opacity 0.4s ease;
}
</style>
