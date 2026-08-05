<!--
  ============================================================================
  HeartMetaball — 游標互動的像素馬賽克揭露效果（中心橘・外圍藍 / Canvas 2D）
  ============================================================================

  【狀態】前一版底紋，已不在 Section 4 使用（現役為 HeartMetaballPatch——改為
  「4 塊紋理 patch 漂移重疊」；差異對照見該檔檔頭）。本檔僅保留在 demo page
  供效果對照，如需調整正式底紋請改 HeartMetaballPatch。

  【整體】
  畫面是一張被網格量化的「蓋章式 metaball 場」當作柔邊遮罩：游標移動時沿軌跡
  蓋下會漸縮消失的圓章，疊出有機團塊；無互動 IDLE_DELAY 秒後進入閒置漂浮，
  團塊以多頻率 sin 在畫面中央緩慢游移。只有落在場內（Σ r²/d² ≥ 閾值）的格子
  才會被填色，因此邊緣是隨游標生長/消退的柔邊，而非硬邊形狀。門檻分兩級：
  中心圖案需足額閾值、外圍只需 PERI_TH 倍 → 藍色暈染半徑約為中心的兩倍。
  配色：中心橘為主（~90%）、外圍藍（LIU_FEEDBACK_2 #3）。

  【兩區：中心 vs 外圍】（核心規格）
  以游標為焦點 (centerX,centerY) 定義一個「會擴散的圓角方形」中心區，其餘場內
  區域為外圍。中心區半邊長 centerR 由 0 緩動長到 CENTER_MAX（擴散感）並跟隨游標。

    1. 形狀：用「超橢圓」判定中心區 |dx|^n + |dy|^n ≤ r^n（n = cornerExp）。
       n=2 為正圓、n 越大越方；預設 4 → 圓角方形，避免生硬直角。

    2. 中心圖案 = 「變寬棋盤」（橘為主）：
       - 水平方向是寬度帶 1,2,3,6 循環（單元寬 12 格），SEG[p] = 該格所屬帶序 k(0~3)。
       - 上色由 (k + gy) 的奇偶決定：相鄰帶反色、相鄰列也反色（棋盤二染色），
         但格子是不等寬的長方塊。每一列都畫 → 視覺上是橫向條紋律動。
       - 局部多底紋（variant system）：把畫面切成 accentBlock 格見方的區塊，每塊持有
         一個 variant=(pattern, color)。pattern 有兩種：變寬棋盤、線段紋（偶數列鋪
         橫線、逐列相位偏移、每段隨機斷點）。多數區塊維持 base（變寬棋盤×橘），
         accentRatio 比例的區塊偏離 base——半數只換線段紋維持橘、其餘換藍
         → 中心藍佔比 ≈ accentRatio/2（預設 0.2 → 橘 ~90%，LIU #3）。
       - Step 2 局部隨機切換：每塊的 variant 由「區塊座標 × epoch」的穩定 hash 決定。
         epoch = floor(t / switchPeriod + 逐塊相位)，相位由區塊 hash 偏移 → 各塊在
         不同時間點硬切、此起彼落；同一 epoch 內每幀同值 → 不閃爍。switchPeriod 控制節奏。

    3. 外圍圖案：只在偶數列上，以 3 格為一段用 hash 隨機散布短橫條（藍），
       密度 = peripheryDensity × 距離衰減——rn=1（中心邊界）全額、到
       rn=peripheryFalloff 衰減為 0 → 越遠越稀疏、散成孤立小塊。

    4. 邊界羽化（自然 spread）：用超橢圓正規化半徑 rn（中心 0、邊界 1）算「保留中心」
       機率 keep（核心內 1、接近邊界經 smoothstep 降到 0）；以抖動 hash 機率性把
       邊緣的中心格子「讓位」給外圍紋理 → 兩種紋理在過渡帶交融、邊界自然溶解，
       不會看到生硬的圓角方形邊。edgeFeather 控制過渡帶寬度。

  【穩定性】外圍與羽化都用「同座標每幀同值」的 hash（非 Math.random），所以圖案
  不會逐幀閃爍；只有 metaball 場邊緣的隨機生死閾值 cellThresholds 提供毛糙感。

  【效能】每幀只跑活動 bounding box 內的格子；render loop 由 IntersectionObserver
  控制（不在視窗內就停）。

  【Props】
    bgColor          畫布底色
    maxBalls         同時存活的 metaball 上限（ring buffer 大小）
    life             單顆 ball 壽命（秒）
    cellSize         馬賽克格子尺寸（px）— 控制顆粒粗細
    color            外圍藍（中心少數藍區塊同色）
    accentColor      中心主色（橘）— 中心 base variant 用此色
    accentRatio      區塊偏離 base 的佔比（0~1）— 半數換藍，中心藍佔比 ≈ 此值/2
    accentBlock      區塊邊長（格數）— 越大每塊變化越大顆
    switchPeriod     Step 2 局部隨機切換週期（秒）— 越大變化越慢
    centerCells      中心圓角方形半邊長（格數）— 控制中心區大小
    peripheryDensity 外圍藍條密度（0~1）
    peripheryFalloff 外圍密度衰減終點（rn 倍數）— 越大藍色外圍延伸越遠
    cornerExp        中心區超橢圓指數（2=圓、4=圓角方、越大越方）
    edgeFeather      邊緣羽化寬度（佔半徑比例 0~1，越大散越開）
    idleRoamRange    閒置自動遊走範圍（佔短邊比例，移動範圍）
    idleRoamSpeed    閒置遊走速度倍率
    idleBlobMin/Max  閒置團塊半徑下/上限（顯示範圍，佔短邊比例；同游標的隨機半徑）
    autoRoam         強制只自動遊走、不綁手指（觸控環境自動啟用）— 解 4-2

  【閒置自動遊走 / 4-2 手機】
  無 pointer 互動 IDLE_DELAY 秒後，團塊在畫面中央一帶以多個不可公度頻率疊加做
  「平滑隨機遊走」（非原地抖動），範圍/速度/大小皆 prop 可調。補章只沿「移動路徑」
  做（距離門檻，不做時間定點補章）→ 舊章隨壽命留在身後淡出，呈現像游標的「彗星
  拖尾」、且不再原地一蹦一蹦像心跳。閒置補章與游標完全相同（每章 min~max 間隨機半徑），
  無任何時間性脹縮／呼吸 → 純粹是「慢慢移動的游標」；移動速度由 idleRoamSpeed 控制。
  另在遊走焦點補一顆「不衰減的持久頭部球」（半徑固定 = (min+max)/2）：遊走偶爾趨近靜止、
  距離補章補不到時 trail 會衰減殆盡，這顆球確保團塊永不完全消失，且固定大小不脹縮。
  pad / mob 斷點（≤1279）、觸控環境（hover:none）或 autoRoam 時不綁游標、
  一律自走 → 對應 4-2；pc 斷點才追蹤滑鼠軌跡。
  ============================================================================
-->
<template>
  <section ref="wrapRef" class="metaballs" :style="{ background: bgColor }">
    <canvas ref="canvasRef" />
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 畫布底色 */
    bgColor?: string;
    /** 同時存活的 metaball 上限（ring buffer 大小） */
    maxBalls?: number;
    /** 單顆 ball 從出現到消失的總壽命（秒） */
    life?: number;
    /** 矩陣格子尺寸（CSS px） */
    cellSize?: number;
    /** 外圍藍（中心少數換藍的區塊同色） */
    color?: string;
    /** 中心主色（橘）：中心 base variant（變寬棋盤×橘）用此色 */
    accentColor?: string;
    /** 區塊「偏離 base」的佔比（0~1）：中心切成 accentBlock 格見方的區塊，此比例的
     *  區塊偏離 base（變寬棋盤橘）——半數只換線段紋維持橘、其餘換藍
     *  → 中心藍佔比 ≈ 此值/2（預設 0.2 → 橘 ~90%） */
    accentRatio?: number;
    /** 區塊邊長（格數）：越大每塊變化越大顆。穩定 hash 依區塊座標決定該塊的 variant */
    accentBlock?: number;
    /** Step 2 局部隨機切換的週期（秒）：每塊每隔約這麼久重抽一次 variant；
     *  各塊相位錯開 → 此起彼落地切換。越大變化越慢 */
    switchPeriod?: number;
    /** 中心正方形半邊長（格數）；方塊會由 0 緩動擴散到此大小並跟隨游標 */
    centerCells?: number;
    /** 外圍隨機藍條的密度（0~1，偶數列上每段為藍的機率；會再乘距離衰減） */
    peripheryDensity?: number;
    /** 外圍密度衰減終點（超橢圓正規化半徑 rn 的倍數）：rn=1（中心邊界）密度全額、
     *  到此倍數處衰減為 0；越大藍色外圍延伸越遠 */
    peripheryFalloff?: number;
    /** 中心區形狀的超橢圓指數：2 = 正圓、越大越接近方形；4 左右為圓角方形 */
    cornerExp?: number;
    /** 邊緣羽化寬度（佔半徑比例 0~1）：越大過渡帶越寬、中心越自然散開融入外圍 */
    edgeFeather?: number;
    /** 閒置自動遊走的範圍（佔畫面短邊比例）：團塊在遊走中心±此比例內平滑亂走 */
    idleRoamRange?: number;
    /** 閒置遊走活動範圍（相對畫布的正規化矩形 0~1）：未提供＝整畫布置中、幅度
     *  idleRoamRange；提供時團塊「含半徑」被限制在矩形內（幅度內縮團塊半徑、
     *  團塊尺寸基準改用帶高），不會壓到範圍外的內容 */
    roamArea?: { x: number; y: number; width: number; height: number };
    /** 閒置遊走速度倍率：越大走越快 */
    idleRoamSpeed?: number;
    /** 閒置團塊半徑下限（顯示範圍／佔短邊比例）：每章在 min~max 間隨機取半徑（同游標） */
    idleBlobMin?: number;
    /** 閒置團塊半徑上限（顯示範圍／佔短邊比例）：與 min 設相近＝大小幾乎固定 */
    idleBlobMax?: number;
    /** 強制「只自動遊走、不綁手指互動」（觸控環境會自動啟用，桌機可用此 prop 預覽手機行為） */
    autoRoam?: boolean;
  }>(),
  {
    bgColor: '#ffffff',
    maxBalls: 64,
    life: 1.6,
    cellSize: 14,
    color: '#9FD6FF',
    accentColor: '#FF7F00',
    accentRatio: 0.2,
    accentBlock: 6,
    switchPeriod: 3,
    centerCells: 12,
    peripheryDensity: 0.5,
    peripheryFalloff: 3,
    cornerExp: 4,
    edgeFeather: 0.5,
    idleRoamRange: 0.4,
    idleRoamSpeed: 1,
    idleBlobMin: 0.05,
    idleBlobMax: 0.09,
    autoRoam: false,
  },
);

const wrapRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const wrap = wrapRef.value;
  const canvas = canvasRef.value;
  if (!wrap || !canvas) return;

  const ctx = canvas.getContext('2d')!;
  const CELL = props.cellSize;
  const MAX = props.maxBalls;
  const COLOR = props.color;
  const ACCENT = props.accentColor; // 強調色（橘）
  const ACCENT_BLOCK = Math.max(1, Math.round(props.accentBlock)); // 區塊邊長（格）
  const SWITCH_PERIOD = Math.max(0.1, props.switchPeriod); // 切換週期（秒）
  // 外圍的場門檻倍率：外圍短橫條只需 field ≥ th×此值即可畫（中心仍需足額 th）
  // → 藍色暈染半徑約為中心著色半徑的兩倍（field ∝ 1/d²），越遠越難達標、自然衰減
  const PERI_TH = 0.25;

  // 中心「變寬棋盤」：水平寬度帶 1,2,3,6 循環（單元寬 12 格），SEG[p] = 該位置所屬帶序 k(0~3)。
  // 顏色 = (k + gy) 奇偶交錯 → 相鄰帶、相鄰列皆反色；錨定格子絕對座標，圖案固定不滑動。
  const WIDTHS = [1, 2, 3, 6];
  const SEG: number[] = [];
  WIDTHS.forEach((w, k) => {
    for (let i = 0; i < w; i++) SEG.push(k);
  });
  const UNIT_W = SEG.length; // 12

  // 穩定的逐格偽隨機（同座標每幀同值 → 外圍圖案不閃爍）
  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  // 三輸入版（多帶一個 epoch 維度）：用於「區塊 × 時間」決定 variant
  const hash3 = (x: number, y: number, z: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  };

  // 平滑階梯：x≤a 回 0、x≥b 回 1，中間為 S 形漸變
  const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  };

  // 第二種 pattern「線段紋」：偶數列鋪橫線、逐列相位偏移、每段（DASH_SEG 格）
  // 約 28% 機率斷開 → 不等長橫線段。錨定絕對格座標，穩定不閃爍
  const DASH_SEG = 6;
  const dashOn = (gx: number, gy: number) => {
    if (gy % 2 !== 0) return false;
    const shift = Math.floor(hash(gy * 3.31, 8.83) * DASH_SEG);
    const seg = Math.floor((gx + shift) / DASH_SEG);
    return hash(seg * 1.71, gy * 0.93) > 0.28;
  };

  // 中心正方形：跟隨游標的焦點 (centerX,centerY)，半邊長 centerR(px) 由 0 緩動擴散到 CENTER_MAX
  let centerX = -9999;
  let centerY = -9999;
  let centerR = 0;
  const CENTER_MAX = props.centerCells * CELL;

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  // 每格的生死閾值：metaball 等值線本身是平滑的，被網格量化後會切出
  // 整排同列的直線與直角階梯；給每格隨機閾值讓輪廓毛糙、產生離群像素
  let cellThresholds: (number | undefined)[] = [];

  const setSize = () => {
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.max(width * dpr, 1);
    canvas.height = Math.max(height * dpr, 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
    cellThresholds = new Array(cols * rows);
  };
  setSize();

  // ---------- 蓋章式 metaball：游標軌跡上生成，隨壽命漸縮 ----------
  type Stamp = { x: number; y: number; r0: number; born: number };
  const stamps: Stamp[] = Array.from({ length: MAX }, () => ({
    x: -9999,
    y: -9999,
    r0: 0,
    born: -Infinity,
  }));
  let stampIndex = 0;
  const lastSpawn = { x: -9999, y: -9999 };
  const SPAWN_DIST = 26; // 游標移動超過此距離才蓋下一章

  const now = () => performance.now() / 1000;

  const addStamp = (
    x: number,
    y: number,
    rScaleMin: number,
    rScaleMax: number,
    sizeBase?: number, // 半徑基準：預設畫布短邊；閒置＋roamArea 時改用帶高
  ) => {
    const base = sizeBase ?? Math.min(width, height);
    const count = 1 + (Math.random() < 0.35 ? 1 : 0);
    for (let n = 0; n < count; n++) {
      const s = stamps[stampIndex]!;
      stampIndex = (stampIndex + 1) % MAX;
      const spread = base * 0.05;
      s.x = x + (Math.random() - 0.5) * spread * 2;
      s.y = y + (Math.random() - 0.5) * spread * 2;
      s.r0 = base * (rScaleMin + Math.random() * (rScaleMax - rScaleMin));
      s.born = now();
    }
  };

  const spawn = (x: number, y: number) => {
    const dx = x - lastSpawn.x;
    const dy = y - lastSpawn.y;
    if (dx * dx + dy * dy < SPAWN_DIST * SPAWN_DIST) return;
    lastSpawn.x = x;
    lastSpawn.y = y;
    addStamp(x, y, 0.05, 0.12);
  };

  // ---------- 閒置漂浮：無互動時在畫面中央維持一小團，緩慢漂移 ----------
  const IDLE_DELAY = 1.2; // 秒：最後一次 pointer 活動後多久進入閒置自走
  let lastPointerAt = -Infinity;

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    lastPointerAt = now();
    centerX = e.clientX - rect.left;
    centerY = e.clientY - rect.top;
    spawn(centerX, centerY);
  };
  // 互動模式：pc（≥1280）追蹤滑鼠軌跡；pad / mob 斷點改「預設中心範圍隨機
  // 偏移」自動遊走。觸控環境（hover:none）手指感應不佳，同樣一律自走；
  // autoRoam prop 可在桌機強制此行為以預覽。
  const roamOnly =
    props.autoRoam ||
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(max-width: 1279.98px)').matches;
  // 事件綁定範圍：預設綁自己；若外層有 [data-metaball-scope]（如 Media section
  // 把 canvas 墊在內容下層），改綁該祖先 → 游標移到內容上方也能持續追蹤。
  const listenEl =
    (wrap.closest('[data-metaball-scope]') as HTMLElement | null) ?? wrap;
  if (!roamOnly) {
    listenEl.addEventListener('pointermove', onPointerMove);
    listenEl.addEventListener('pointerdown', onPointerMove);
  }

  // ---------- render loop（IntersectionObserver 控制啟停） ----------
  let raf = 0;
  let running = false;

  const animate = () => {
    if (!running) return;
    const t = now();
    const isIdle = t - lastPointerAt > IDLE_DELAY;

    // 閒置時：團塊在畫面中央一帶「平滑隨機遊走」（多個不可公度頻率疊加 → 不重複的
    // 有機路徑，而非原地抖動）。範圍 idleRoamRange、速度 idleRoamSpeed 皆可調。
    // pointer 互動會暫停，停止互動 IDLE_DELAY 後回到自走（觸控環境則一律自走）。
    if (isIdle) {
      const base = Math.min(width, height);
      // roamArea：遊走中心＝矩形中心，逐軸幅度＝半寬/半高內縮團塊半徑，
      // 團塊尺寸基準改用帶高（帶比畫布短邊窄時縮小團塊才塞得進帶內）
      const area = props.roamArea;
      const sizeBase = area ? Math.min(base, height * area.height) : base;
      const blobMax = sizeBase * props.idleBlobMax;
      const cx0 = width * (area ? area.x + area.width / 2 : 0.5);
      const cy0 = height * (area ? area.y + area.height / 2 : 0.5);
      const ampX = area
        ? Math.max(0, (width * area.width) / 2 - blobMax)
        : base * props.idleRoamRange;
      const ampY = area
        ? Math.max(0, (height * area.height) / 2 - blobMax)
        : base * props.idleRoamRange;
      const s = t * props.idleRoamSpeed;
      // 每幀更新焦點 → 中心方塊跟著遊走路徑走；權重和為 1，最大擺幅 = amp
      centerX =
        cx0 +
        (Math.sin(s * 0.13) * 0.5 +
          Math.sin(s * 0.21 + 1.7) * 0.3 +
          Math.sin(s * 0.07 + 4.1) * 0.2) *
          ampX;
      centerY =
        cy0 +
        (Math.cos(s * 0.11) * 0.5 +
          Math.cos(s * 0.19 + 0.7) * 0.3 +
          Math.sin(s * 0.05 + 2.3) * 0.2) *
          ampY;
      // 彗星拖尾：像游標一樣「只沿移動路徑」距離補章（移動超過 SPAWN_DIST 才補一章）。
      // 不再用時間定點補章 → 不會在原地一蹦一蹦像心跳；舊章隨壽命衰退留在身後 →
      // 形成隨移動方向淡出的尾巴。多頻遊走持續移動，故團塊不會因停滯而消失。
      const dx = centerX - lastSpawn.x;
      const dy = centerY - lastSpawn.y;
      if (dx * dx + dy * dy > SPAWN_DIST * SPAWN_DIST) {
        lastSpawn.x = centerX;
        lastSpawn.y = centerY;
        // 與游標完全相同：每章在 min~max 間隨機取半徑，沿移動路徑鋪章。
        // 無任何時間性脹縮 → 純粹是「慢慢移動的游標」。
        addStamp(centerX, centerY, props.idleBlobMin, props.idleBlobMax);
      }
    }

    // 中心半邊長緩動擴散到目標值（擴散感）
    centerR += (CENTER_MAX - centerR) * 0.12;

    // 計算每顆 stamp 的當前半徑（快進慢出），並求活動範圍 bounding box
    const live: { x: number; y: number; r: number }[] = [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < MAX; i++) {
      const s = stamps[i]!;
      const age = t - s.born;
      const grow = Math.min(age / 0.15, 1);
      const decay = 1 - Math.min(Math.max((age - 0.3) / (props.life - 0.3), 0), 1);
      const r = s.r0 * grow * decay * decay;
      if (r <= 1) continue;
      live.push({ x: s.x, y: s.y, r });
      // 2.5r = 場函式的有限支撐半徑：超過此距離場精確為 0，
      // 因此 bounding box 裁切處不可能有活格子，不會切出直線
      minX = Math.min(minX, s.x - r * 2.5);
      maxX = Math.max(maxX, s.x + r * 2.5);
      minY = Math.min(minY, s.y - r * 2.5);
      maxY = Math.max(maxY, s.y + r * 2.5);
    }

    // 閒置「持久頭部」：在遊走焦點補一顆「不衰減」的球（固定半徑）。多頻遊走偶爾趨近
    // 靜止、距離補章補不到時，trail 會在 life 內衰減殆盡 → 整團消失；這顆持久球確保
    // 團塊永不完全消失，又因固定大小不會脹縮。身後的衰減 trail 仍形成彗星尾。
    if (isIdle && width > 0) {
      const base = Math.min(width, height);
      const headR = base * (props.idleBlobMin + props.idleBlobMax) * 0.5;
      live.push({ x: centerX, y: centerY, r: headR });
      minX = Math.min(minX, centerX - headR * 2.5);
      maxX = Math.max(maxX, centerX + headR * 2.5);
      minY = Math.min(minY, centerY - headR * 2.5);
      maxY = Math.max(maxY, centerY + headR * 2.5);
    }

    const gx0 = Math.max(Math.floor(minX / CELL), 0);
    const gx1 = Math.min(Math.ceil(maxX / CELL), cols);
    const gy0 = Math.max(Math.floor(minY / CELL), 0);
    const gy1 = Math.min(Math.ceil(maxY / CELL), rows);

    ctx.clearRect(0, 0, width, height);

    // 逐格判斷是否在 metaball 場內（Σ r²/d² ≥ 閾值）：在場內才依「中心/外圍」
    // 規則上色（見檔頭 spec）；離開場則重設該格閾值，下次經過重新抽。
    for (let gy = 0; gy < rows; gy++) {
      const inY = gy >= gy0 && gy < gy1;
      for (let gx = 0; gx < cols; gx++) {
        const idx = gy * cols + gx;
        if (!inY || gx < gx0 || gx >= gx1 || live.length === 0) {
          if (cellThresholds[idx] !== undefined) cellThresholds[idx] = undefined;
          continue;
        }
        const cx = (gx + 0.5) * CELL;
        const cy = (gy + 0.5) * CELL;
        let field = 0;
        for (const b of live) {
          const dx = cx - b.x;
          const dy = cy - b.y;
          // 平移後的 inverse-square：在 d = 2.5r 處歸零（0.16 = 1/2.5²），
          // 純 r²/d² 永不歸零，會讓 bounding box 邊界變成可見的直線
          const q = (b.r * b.r) / (dx * dx + dy * dy + 1) - 0.16;
          if (q > 0) field += q;
        }
        // 閾值在進入活動範圍時抽一次、存活期間固定（避免邊緣閃爍），
        // 離開範圍後重設，下次經過再重抽
        let th = cellThresholds[idx];
        if (th === undefined) {
          th = 0.6 + Math.random();
          cellThresholds[idx] = th;
        }
        if (field >= th * PERI_TH) {
          // 中心區用超橢圓正規化半徑 rn（中心=0、邊界=1），圓角方形不見生硬直角
          const cdx = Math.abs(cx - centerX);
          const cdy = Math.abs(cy - centerY);
          const e =
            Math.pow(cdx, props.cornerExp) + Math.pow(cdy, props.cornerExp);
          const rn = Math.pow(e, 1 / props.cornerExp) / Math.max(centerR, 0.0001);
          // 羽化：核心內 keep=1 全保留中心圖案；接近邊界 keep 漸降到 0，
          // 以抖動 hash 機率性讓位給外圍 → 兩種紋理在過渡帶交融、邊界自然溶解
          const keep = 1 - smoothstep(1 - props.edgeFeather, 1, rn);
          // 中心需足額場強（field ≥ th）；外圍門檻較低 → 藍色暈染範圍比中心大
          const isCenter =
            field >= th && keep > 0 && hash(gx + 31.4, gy + 17.2) < keep;
          let fill: string | null = null;
          if (isCenter) {
            // 中心 = 局部多底紋：把畫面切成 ACCENT_BLOCK 格見方的區塊，每塊在每個時刻
            // 持有一個 variant=(pattern, color)。多數維持 base（變寬棋盤×橘），accentRatio
            // 比例的區塊偏離 base（線段橘／變寬藍／線段藍）→ 中心橘為主。
            // Step 2：variant 由「區塊座標 × epoch」的穩定 hash 決定，epoch 相位逐塊錯開
            //         → 各塊在不同時間點硬切、此起彼落；同一 epoch 內每幀同值 → 不閃。
            const bx = Math.floor(gx / ACCENT_BLOCK);
            const by = Math.floor(gy / ACCENT_BLOCK);
            const phase = hash(bx * 7.1 + 1.3, by * 7.1 + 2.7); // 0~1 逐塊相位
            const epoch = Math.floor(t / SWITCH_PERIOD + phase);
            let usePattern = 0; // 0=變寬棋盤 1=線段紋
            let useColor = ACCENT; // base = 變寬棋盤 × 橘（中心橘為主）
            if (hash3(bx, by, epoch + 0.5) < props.accentRatio) {
              // 此塊偏離 base：半數只換線段紋（維持橘）、其餘換藍
              // → 中心藍佔比 ≈ accentRatio / 2（預設 0.2 → 橘 ~90%，LIU #3）
              const r = hash3(bx + 0.7, by + 0.3, epoch + 11.5);
              if (r < 0.5) {
                usePattern = 1; // 線段紋 × 橘
              } else if (r < 0.75) {
                useColor = COLOR; // 變寬棋盤 × 藍
              } else {
                usePattern = 1;
                useColor = COLOR; // 線段紋 × 藍
              }
            }
            // 由 variant 的 pattern 決定該格是否上色
            let on: boolean;
            if (usePattern === 0) {
              // 變寬棋盤：帶序 k 查 SEG，顏色 (k + gy) 奇偶交錯，每列都畫
              const k = SEG[((gx % UNIT_W) + UNIT_W) % UNIT_W]!;
              on = (k + gy) % 2 === 0;
            } else {
              // 線段紋：不等長橫線段
              on = dashOn(gx, gy);
            }
            if (on) fill = useColor;
          } else if (gy % 2 === 0) {
            // 外圍（含過渡帶讓位的格子）：偶數列以 3 格為一段散布短橫條，
            // 密度隨 rn 衰減（中心邊界全額 → peripheryFalloff 處歸零）
            // → 越遠越稀疏、散成孤立小塊
            const falloff = 1 - smoothstep(1, props.peripheryFalloff, rn);
            const seg = Math.floor(gx / 3);
            if (hash(seg * 1.71, gy) < props.peripheryDensity * falloff)
              fill = COLOR;
          }
          if (fill) {
            ctx.fillStyle = fill;
            ctx.fillRect(gx * CELL, gy * CELL, CELL, CELL);
          }
        }
      }
    }

    raf = requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver(([entry]) => {
    const shouldRun = entry?.isIntersecting ?? false;
    if (shouldRun && !running) {
      running = true;
      animate();
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  observer.observe(wrap);

  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(wrap);

  onBeforeUnmount(() => {
    running = false;
    cancelAnimationFrame(raf);
    observer.disconnect();
    resizeObserver.disconnect();
    listenEl.removeEventListener('pointermove', onPointerMove);
    listenEl.removeEventListener('pointerdown', onPointerMove);
  });
});
</script>

<style scoped>
.metaballs {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.metaballs canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
