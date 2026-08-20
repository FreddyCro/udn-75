<template>
  <div class="loader" aria-label="載入中" role="img">
    <!-- 舞台：與影片層 / start 閘門共用的尺寸上限（見 base.scss 的 --hero-stage-max-*），
         置中；方塊只鋪在舞台內，外面留白底。網格改以「舞台」為量測基準（見 computeGrid）。 -->
    <div ref="stageRef" class="stage">
      <!-- 網格比舞台略大且置中，溢出等量裁掉 → 中間格中心 = 舞台正中心 -->
      <div class="grid">
        <div v-for="i in count" :key="i" ref="tileRefs" class="tile" />
      </div>
      <div ref="counterRef" class="counter">0%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  /** 自動播放總秒數（0 → 100%）；越小越快 */
  duration: { type: Number, default: 3.2 },
  /**
   * 方塊邊長（px）；固定尺寸，欄列數由視窗推算。
   * 預設取共用常數 HANDOFF_CUBE —— 中央那格是「留白位」：數字全程壓在它上面，載入層淡出後
   * HeroStart 的 cube 也落在同一處。邊長取同一個常數，那塊留白才剛好等於接手的 cube
   * （否則交接時會看到白洞比方塊大或小一圈）。見 ~/utils/orange-core-config。
   * 註：設計稿 loading-1~7 的格子是 1280×720 稿上的 83.333px，比 cube 小 11.7px；此處
   * 刻意選「整份跟著 cube 放大」而非兩者各留一份數字。
   */
  tileSize: { type: Number, default: HANDOFF_CUBE },
  /** 橘色「處理中」前緣的**最少**方塊數（尾聲）。設計稿 loading-6（96%）為 1 顆橘＋2 顆藍 */
  orangeTiles: { type: Number, default: 1 },
  /**
   * 橘色前緣寬度佔「尚未翻白格數」的比例。前緣不是固定寬度，而是隨剩餘量收斂：
   * 開頭剩得多 → 一整片橘同時在跑（固定 1 顆時，200＋格的網格裡幾乎看不出有橘色）；
   * 越接近 100% 剩越少 → 自動收到 orangeTiles 的下限，尾聲仍是設計稿的 1 顆橘。
   */
  orangeRatio: { type: Number, default: 0.12 },
  /** 進站後延遲幾秒才開始 */
  startDelay: { type: Number, default: 0.2 },
  /**
   * 影片（或主要素材）是否已可播放。
   * false 時進度會封頂在 99%「等載入」，即使 duration 已到也不收尾；
   * 轉為 true 後才會補到 100% 並 emit done。預設 true → 單獨使用時照 duration 跑完。
   */
  ready: { type: Boolean, default: true },
});

const emit = defineEmits<{ done: [] }>();

const stageRef = ref<HTMLDivElement | null>(null);
const counterRef = ref<HTMLDivElement | null>(null);
const tileRefs = ref<HTMLDivElement[]>([]);

// 三種狀態的顏色（0=藍 1=橘 2=白）。色值的單一來源是 tailwind.css 的 CSS 變數 ——
// 原本是三個 props，但呼叫端從未傳過，等於在元件裡又抄一份色碼、改主色時會漏掉這裡。
const TILE_COLOR = ['var(--color-blue)', 'var(--color-orange)', '#fff'] as const;

// 總格數（resize 時重算）；欄列數各自強制為奇數，保證有「正中間一格」。
// 欄數只寫進 --cols 給 CSS grid 用，列數只用來算 centerIndex，兩者都不必留在 JS 這側。
const count = ref(0);
// 正中央那格的 index：**全程留白**，且中心對齊視窗正中心 —— 百分比數字永遠壓在乾淨白底上，
// 不會被橘色前緣掃過而讀不清。邊長＝tileSize＝HANDOFF_CUBE＝HeroStart 的 cube，
// 置中方式也與 cube 等效（奇數網格置中 ⇔ flex 置中），故載入層淡出後 cube 正好補進這格。
let centerIndex = 0;

// 每格在翻白順序中的「名次」（0..N-1）；名次越小越早翻白
let order: number[] = [];
// 上一幀每格狀態，避免重複寫入 DOM
let prevState: number[] = [];
// 橘色前緣的最少格數（下限）；僅隨 orangeTiles 變動，故於 buildOrder 算一次。
let minBand = 1;

let raf = 0;
let prevPct = -1; // 上一次寫進計數器的整數百分比（見 frame）
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

// 量的是「舞台」而非視窗：舞台在 pc 有尺寸上限（--hero-stage-max-*），方塊只鋪滿舞台，
// 外面露白底 —— 與影片層同一條規則。舞台已置中，故下面的「網格中心」仍等於視窗正中心。
const computeGrid = () => {
  const vw = stageRef.value?.clientWidth || window.innerWidth;
  const vh = stageRef.value?.clientHeight || window.innerHeight;
  const tile = props.tileSize;
  const c = oddCover(vw, tile);
  const r = oddCover(vh, tile);
  count.value = c * r;
  // 奇數網格的正中間格：中心即整個網格中心；網格置中後 = 舞台正中心 = 視窗正中心
  centerIndex = Math.floor(r / 2) * c + Math.floor(c / 2);
  if (stageRef.value) {
    stageRef.value.style.setProperty('--cols', String(c));
    stageRef.value.style.setProperty('--tile', `${tile}px`);
  }
};

// 洗牌產生翻白順序（Fisher–Yates），並強制「正中央」為第一個翻白（名次 0）——
// 中央格另外被硬鎖成白（見 frame()），排在名次 0 只是讓它不佔用前緣掃描的位置。
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
  minBand = Math.max(1, Math.round(props.orangeTiles)); // 橘色前緣寬度下限
};

// 橘色前緣寬度：隨「尚未翻白的格數」收斂（見 orangeRatio），故開頭寬、尾聲只剩 minBand。
const bandWidth = (remaining: number) =>
  Math.max(minBand, Math.round(remaining * props.orangeRatio));

// tileRefs 是 ref([])，`.value` 是個 reactive Proxy —— paint() 每格都要經過一次
// get trap，而一幀要跑 273~459 格。每幀取一次 raw 陣列，迴圈裡就是純索引存取。
let tiles: HTMLDivElement[] = [];
const syncTiles = () => {
  tiles = toRaw(tileRefs.value);
};

// 0=藍 1=橘 2=白（見 TILE_COLOR）
const paint = (idx: number, state: number) => {
  const el = tiles[idx];
  if (!el || prevState[idx] === state) return;
  prevState[idx] = state;
  el.style.backgroundColor = TILE_COLOR[state] ?? TILE_COLOR[0];
};

const finish = () => {
  finished = true;
  syncTiles();
  const n = count.value;
  // 全部翻白（含中央格）：載入層收在一片乾淨白底上，數字同時淡出。
  // 橘色交接不在本層做 —— 淡出那 0.6s 內 HeroStart 的 cube 由白底浮現，落點與尺寸
  // 正是中央那格（tileSize＝HANDOFF_CUBE），視覺上就是「白底中央長出橘塊」。
  for (let idx = 0; idx < n; idx++) paint(idx, 2);
  if (counterRef.value) counterRef.value.style.opacity = '0';
  emit('done');
};

const frame = (now: number) => {
  syncTiles();
  if (prevNow < 0) prevNow = now;
  // clamp 單幀 dt：分頁切回/掉幀時不會把進度一次推完
  const dt = Math.min((now - prevNow) / 1000, 0.05);
  prevNow = now;
  elapsed += dt;

  const n = count.value;

  // 中央格全程白，且必須搶在 startDelay 之前 —— .tile 的 CSS 底色是藍的，晚一步「0%」
  // 就會有 startDelay 那段時間壓在藍底上。收尾後這格留白由 HeroStart 的 cube 直接補上。
  paint(centerIndex, 2);

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
  const band = bandWidth(n - whiteCount);

  // 依名次決定狀態：已過 → 白；前緣 band 內 → 橘；其餘 → 藍（中央格上面已鎖成白）
  for (let idx = 0; idx < n; idx++) {
    if (idx === centerIndex) continue;
    const rank = order[idx]!;
    paint(idx, rank < whiteCount ? 2 : rank < whiteCount + band ? 1 : 0);
  }

  // 字串只有約 100 種，卻每幀都寫一次（每次賦值都換掉整個 text node）→ 值變了才寫
  const pct = Math.round(p * 100);
  if (pct !== prevPct && counterRef.value) {
    prevPct = pct;
    counterRef.value.textContent = `${pct}%`;
  }

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
  prevPct = -1; // 重跑要能寫回 0%
  elapsed = 0;
  finished = false;
  if (counterRef.value) counterRef.value.style.opacity = '1';
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
};

// resize 只重排網格，**不重跑計時** —— start() 會把 elapsed 歸零，載入中途轉向、
// 軟鍵盤彈出、桌機拖幾 px 視窗都會讓進度從 85% 倒回 0% 再跑滿一次 duration。
// 格數沒變（多數 resize 都是）連翻白順序都不必重建：order 依格子 index 排，格數相同即仍有效。
const onResize = () => {
  if (finished) return; // 播完不再重排
  const prevCount = count.value;
  computeGrid();
  if (count.value === prevCount) return;
  // 格數真的變了 → 重抽順序（含新的 centerIndex）。elapsed 不動，進度從原處接著跑；
  // 代價是已翻白的格子會重洗一次，但只發生在網格確實換尺寸的時候。
  buildOrder(count.value);
};

onMounted(() => {
  // 計數的字級／顏色只寫在下方 <style>（原本 JS 這裡又設一次，同一件事兩份來源）。
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
  /* 覆蓋整個視窗的載入層（蓋在 header 之上，z-index > .app-header 的 1000）。
     底色白：舞台有尺寸上限時，上限之外露出的就是這片白（同影片層淡出後的白底）。 */
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: hidden;
  background: #fff;
  /* 舞台置中 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 舞台：三層共用的尺寸上限（見 base.scss 的 --hero-stage-max-*，pc 2560×1440；
   其餘斷點為 none ＝ 滿版）。overflow 在這一層裁：網格比舞台略大且置中，
   溢出等量被裁 → 正中間那一格中心 = 舞台正中心 = 視窗正中心。 */
.stage {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: var(--hero-stage-max-w);
  max-height: var(--hero-stage-max-h);
  overflow: hidden;
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
