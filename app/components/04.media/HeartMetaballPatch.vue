<!--
  ============================================================================
  HeartMetaballPatch — 三紋路固定 patch 漂移重疊（Section 4 現役底紋 / Canvas 2D）
  ============================================================================

  【與 HeartMetaball 的差異】（本檔為 Section 4 現役；HeartMetaball 為前一版，
   保留在 demo page 供對照，勿混用）
  同樣以「蓋章式 metaball 場 + 逐格隨機閾值」收邊，差別在**場內畫什麼**：

    面向        HeartMetaball（前一版）         HeartMetaballPatch（本檔）
    ─────────  ──────────────────────────────  ──────────────────────────────
    版面結構    中心圓角方形 + 外圍兩區         4 個矩形紋理 patch 拼貼
    紋理來源    變寬棋盤(1,2,3,6 帶) / 線段紋   1格棋盤 / 2格棋盤 / 線段紋
    紋理分佈    accentBlock 區塊逐塊換 variant  每 patch 一種紋理、固定不換
    構圖變化    區塊 variant 慢速換抽           patch 在定點附近些微漂移
    重疊交織    無（同一格只屬一區）            有（透空格讓位下層 → 雙紋交織）
    顆粒        cellSize 14px                   cellSize 4px（貼合設計稿）
    橘色配置    中心 base 色、外圍藍            圓形核心內慢速換抽變橘
    外緣收邊    場遮罩 + 中心區超橢圓羽化       場遮罩 + 每 patch 超橢圓羽化

  換言之：前一版是「一個團塊、內部分區換紋理」，本檔是「多塊紋理拼貼、彼此重疊
  交織」，更貼近設計稿「隨機組合效果（部分重疊＆不重疊、邊緣造型隨機）」。
  收邊／彗星尾／互動模式（pc 追游標、pad/mob 自走）兩版一致。

  【組成】
  1. patch 陣容固定（ROSTER）：每個 patch 固定尺寸、固定疊放順序（後者在上）、
     固定 base 偏移；逐 patch 以不可公度頻率 sin 在定點附近「些微」漂移
     （振幅 = 短邊 × driftRatio/2，預設僅數格）→ 四塊永遠保持重疊、不跑遠。
     patch 本體以「超橢圓正規化半徑」羽化（同正式版中心區）：中心 keep=1、
     邊緣經 smoothstep 降到 0 + 抖動 hash 讓位 → 圓角方形、四邊溶解，
     不見方形直角。紋理錨定畫布絕對格座標，patch 移動時圖案不滑動。
  2. 逐格上色：由上往下找第一個「覆蓋該格且紋理實格」的 patch（透空格讓位下層
     → 重疊區兩紋理自然交織）；未被任何 patch 接手的格子不畫。
  3. 中心變橘（慢速換抽・圓弧收邊）：橘色是「圓形核心＋羽化過渡帶」（參考正式
     版中心區的羽化）——核心內（rn ≤ 1-orangeFeather）機率 = orangeMax 全額，
     過渡帶經 smoothstep 降到 0（rn=1 即 orangeCells×CELL px 處）；以 accentBlock
     格見方區塊為單位、由「區塊 × epoch」穩定 hash 決定、相位逐塊錯開
     （switchPeriod）→ 橘核心是圓弧邊、區塊此起彼落地變橘/變回、不閃爍。
  4. 收邊（參考正式版・圓弧）：metaball 場（游標/漂移沿路蓋章 + 逐格隨機閾值）
     作為總遮罩，且持久球半徑「小於」叢集名目半徑 → 場的圓形等值線切進 patch
     外緣，矩形直邊只保留在內部、外緣被收成圓弧＋隨機閾值毛糙；移動時舊章隨
     壽命衰減留在身後 → 紋理碎片組成的彗星尾。持久球常駐，
     確保 patch 群永不被遮罩吃光（需求 2：不消失）。
     逐格閾值 = 穩定 hash × 慢速 epoch（edgePeriod，相位逐格錯開）：同 epoch 內
     每幀同值不閃爍，每隔約 edgePeriod 秒逐格錯落重抽 → 完全靜止時
     邊緣也會微微呼吸，不會定格。

  【Props】
    bgColor        畫布底色
    maxBalls       同時存活的 metaball 上限
    life           單顆 ball 壽命（秒）— 越長彗星尾越長
    cellSize       馬賽克格子尺寸（px）— 設計稿以 4px 為單位
    color          底色藍
    accentColor    強調色（橘）
    accentBlock    變橘區塊邊長（格數）
    switchPeriod   變橘慢速換抽週期（秒）
    orangeCells    橘色圓形核心半徑（距叢集中心格數，含羽化帶）
    orangeMax      核心內的變橘機率（0~1）
    orangeFeather  橘色邊緣羽化帶寬（佔半徑比例 0~1）— 越大圓弧邊越散
    patchScale     patch 整體縮放倍率
    driftRatio     漂移振幅（佔 patch 短邊比例）— 越大越散、太大會失去重疊
    driftSpeed     漂移速度倍率
    coreScale      持久球半徑倍率 — 越大遮罩核心越大、外緣溶解帶越往外
    edgePeriod     邊緣呼吸週期（秒）— 逐格閾值重抽間隔，越大呼吸越慢
    idleRoamRange  閒置自動遊走範圍（佔短邊比例）
    roamArea       閒置遊走活動範圍（正規化矩形）— 叢集含外緣不出帶、必要時縮小
    idleRoamSpeed  閒置遊走速度倍率
    idleBlobMin/Max 拖尾章半徑下/上限（佔短邊比例）
    autoRoam       強制只自動遊走、不綁游標
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
    /** 單顆 ball 從出現到消失的總壽命（秒）：越長彗星尾越長 */
    life?: number;
    /** 馬賽克格子尺寸（CSS px）；設計稿紋理以 4px 為單位 */
    cellSize?: number;
    /** 底色藍 */
    color?: string;
    /** 強調色（橘）：中心區塊慢速換抽用此色 */
    accentColor?: string;
    /** 變橘區塊邊長（格數）：越大橘色色塊越大顆 */
    accentBlock?: number;
    /** 變橘慢速換抽的週期（秒）：各區塊相位錯開、此起彼落 */
    switchPeriod?: number;
    /** 橘色圓形核心半徑（距叢集中心的格數，含羽化帶；rn=1 處機率歸零） */
    orangeCells?: number;
    /** 核心內（羽化帶以內）的變橘機率（0~1） */
    orangeMax?: number;
    /** 橘色邊緣羽化帶寬（佔半徑比例 0~1）：核心內全額、過渡帶 smoothstep 降到 0
     *  → 橘核心呈圓弧邊、與藍色交錯溶解（參考正式版中心羽化） */
    orangeFeather?: number;
    /** patch 整體縮放倍率 */
    patchScale?: number;
    /** 漂移振幅佔 patch 短邊的比例（振幅 = 短邊 × 此值 / 2）：預設僅些微晃動，
     *  patch 停留在定點附近、不跑遠 */
    driftRatio?: number;
    /** 漂移速度倍率 */
    driftSpeed?: number;
    /** 持久球半徑倍率：以 patch 叢集名目半徑為基準 */
    coreScale?: number;
    /** 邊緣呼吸週期（秒）：逐格閾值每隔約這麼久重抽一次（相位逐格錯開）
     *  → 靜止時邊緣也微微呼吸；越大呼吸越慢 */
    edgePeriod?: number;
    /** 閒置自動遊走的範圍（佔畫面短邊比例） */
    idleRoamRange?: number;
    /** 閒置遊走活動範圍（相對畫布的正規化矩形 0~1）：未提供＝整畫布置中、幅度
     *  idleRoamRange；提供時 patch 叢集「含羽化外緣」被限制在矩形內（幅度內縮
     *  叢集半徑；帶塞不下時整體等比縮小），不會壓到範圍外的內容 */
    roamArea?: { x: number; y: number; width: number; height: number };
    /** 閒置遊走速度倍率 */
    idleRoamSpeed?: number;
    /** 拖尾章半徑下限（佔短邊比例） */
    idleBlobMin?: number;
    /** 拖尾章半徑上限（佔短邊比例） */
    idleBlobMax?: number;
    /** 強制「只自動遊走、不綁游標互動」（觸控環境自動啟用） */
    autoRoam?: boolean;
  }>(),
  {
    bgColor: '#ffffff',
    maxBalls: 64,
    life: 2.5,
    cellSize: 4,
    color: '#9FD6FF',
    accentColor: '#FF7F00',
    accentBlock: 6,
    switchPeriod: 3,
    orangeCells: 24,
    orangeMax: 0.9,
    orangeFeather: 0.45,
    patchScale: 1,
    driftRatio: 0.25,
    driftSpeed: 1,
    coreScale: 1,
    edgePeriod: 2.5,
    idleRoamRange: 0.3,
    idleRoamSpeed: 1,
    idleBlobMin: 0.08,
    idleBlobMax: 0.14,
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
  const ACCENT = props.accentColor;
  const ACCENT_BLOCK = Math.max(1, Math.round(props.accentBlock));
  const SWITCH_PERIOD = Math.max(0.1, props.switchPeriod);
  const EDGE_PERIOD = Math.max(0.1, props.edgePeriod); // 邊緣呼吸週期（秒）
  const ORANGE_R = props.orangeCells * CELL; // 變橘衰減終點（px）

  // 穩定的偽隨機（同輸入每幀同值 → 不閃爍）
  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  // 三輸入版（多帶一個 epoch 維度）：用於「區塊 × 時間」決定變橘
  const hash3 = (x: number, y: number, z: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  };

  // 平滑階梯：x≤a 回 0、x≥b 回 1，中間為 S 形漸變
  const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  };

  // ---------- 三種紋理：純函式 (tex, gx, gy) → 該格是否實心 ----------
  // 皆以畫布絕對格座標取樣 → patch 漂移時圖案錨定不滑動
  const DASH_SEG = 6; // 線段紋每段長（格）：斷點以段為單位抽
  const texOn = (tex: number, gx: number, gy: number): boolean => {
    if (tex === 0) return ((gx + gy) & 1) === 0; // 紋路1｜1格棋盤（4px）
    if (tex === 1) return (((gx >> 1) + (gy >> 1)) & 1) === 0; // 紋路2｜2格棋盤（8px）
    // 紋路3｜線段紋：偶數列鋪橫線、逐列相位偏移、每段約 28% 機率斷開
    if ((gy & 1) !== 0) return false;
    const shift = Math.floor(hash(gy * 3.31, 8.83) * DASH_SEG);
    const seg = Math.floor((gx + shift) / DASH_SEG);
    return hash(seg * 1.71, gy * 0.93) > 0.28;
  };

  // ---------- 固定 patch 陣容：尺寸/基準偏移/疊放順序都不變，只漂移 ----------
  // 需求 1：線段紋 ×2、1格棋盤 ×1、2格棋盤 ×1。陣列順序 = 疊放順序（後者在上）。
  // 垂直基準偏移刻意拉開（±12~22）且垂直漂移振幅縮小（DRIFT_Y_MUL）：
  // 確保四塊不會漂到垂直對齊、聯集變成扁平帶狀，讓上下直邊露進圓形遮罩內
  const ROSTER = [
    { tex: 1, w: 72, h: 40, ox: 14, oy: 12, phase: 0.0 }, // 2格棋盤（底層）
    { tex: 0, w: 64, h: 44, ox: -16, oy: -16, phase: 1.7 }, // 1格棋盤
    { tex: 2, w: 60, h: 36, ox: -4, oy: 20, phase: 3.9 }, // 線段紋
    { tex: 2, w: 52, h: 30, ox: 6, oy: -22, phase: 5.2 }, // 線段紋（頂層）
  ];
  const DRIFT_Y_MUL = 0.35; // 垂直漂移振幅倍率（相對水平）
  // patch 本體羽化（超橢圓，同正式版中心區）：以正規化半徑 rn 判定，中心 keep=1、
  // 邊緣（1-PATCH_FEATHER ~ 1）smoothstep 降到 0 + 抖動 hash 讓位 → 圓角方形、
  // 四邊溶解，不見方形直角。也同時是「聯集縮到遮罩以內」時的防線：
  // 露出來的 patch 邊永遠是溶解圓角，不會出現生硬直線
  const PATCH_FEATHER = 0.4; // 羽化帶寬（佔半徑比例）
  const SUPER_N = 4; // 超橢圓指數：4 ≈ 圓角方形（2=橢圓、越大越方）
  // 叢集名目半徑（px）：最遠 patch 邊緣 + 漂移振幅。持久球半徑以此為基準
  let extentC = 0;
  for (const p of ROSTER) {
    const ampC = Math.min(p.w, p.h) * 0.5 * props.driftRatio;
    extentC = Math.max(
      extentC,
      Math.abs(p.ox) + p.w / 2 + ampC,
      Math.abs(p.oy) + p.h / 2 + ampC * DRIFT_Y_MUL,
    );
  }
  const EXTENT_PX = extentC * props.patchScale * CELL;

  // 叢集焦點：pc 追游標、其餘閒置自走；spread 由 0 緩動到 1（掛載擴散現身）
  let centerX = -9999;
  let centerY = -9999;
  let spread = 0;
  // roamArea 帶塞不下叢集名目半徑時的等比縮小倍率（patch 與持久球同乘）
  let clusterScale = 1;

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;

  const setSize = () => {
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.max(width * dpr, 1);
    canvas.height = Math.max(height * dpr, 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
  };
  setSize();

  // ---------- 蓋章式 metaball：沿移動路徑生成、隨壽命漸縮（同正式版） ----------
  type Stamp = { x: number; y: number; r0: number; born: number };
  const stamps: Stamp[] = Array.from({ length: MAX }, () => ({
    x: -9999,
    y: -9999,
    r0: 0,
    born: -Infinity,
  }));
  let stampIndex = 0;
  const lastSpawn = { x: -9999, y: -9999 };
  const SPAWN_DIST = 26; // 移動超過此距離才蓋下一章

  const now = () => performance.now() / 1000;

  const addStamp = (x: number, y: number, rScaleMin: number, rScaleMax: number) => {
    const base = Math.min(width, height);
    const count = 1 + (Math.random() < 0.35 ? 1 : 0);
    for (let n = 0; n < count; n++) {
      const s = stamps[stampIndex]!;
      stampIndex = (stampIndex + 1) % MAX;
      const spreadPx = base * 0.05;
      s.x = x + (Math.random() - 0.5) * spreadPx * 2;
      s.y = y + (Math.random() - 0.5) * spreadPx * 2;
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
    addStamp(x, y, props.idleBlobMin, props.idleBlobMax);
  };

  // ---------- 互動：pc 追游標；觸控 / 窄幅 / autoRoam 一律閒置自走 ----------
  const IDLE_DELAY = 1.2;
  let lastPointerAt = -Infinity;

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    lastPointerAt = now();
    centerX = e.clientX - rect.left;
    centerY = e.clientY - rect.top;
    spawn(centerX, centerY);
  };
  const roamOnly =
    props.autoRoam ||
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(max-width: 1279.98px)').matches;
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

    // 閒置：焦點以多個不可公度頻率平滑遊走，沿路徑蓋章 → 彗星尾。
    // roamArea：遊走中心＝矩形中心，逐軸幅度＝半寬/半高內縮叢集半徑；
    // 帶塞不下名目半徑時整體等比縮小（clusterScale）→ 叢集含外緣都不出帶。
    // （可見範圍 = patch ∩ 遮罩，故只需以 patch 聯集半徑計算，拖尾章不會外溢）
    if (isIdle) {
      const base = Math.min(width, height);
      const area = props.roamArea;
      let cx0: number;
      let cy0: number;
      let ampX: number;
      let ampY: number;
      if (area) {
        const halfW = (width * area.width) / 2;
        const halfH = (height * area.height) / 2;
        clusterScale = Math.min(1, halfW / EXTENT_PX, halfH / EXTENT_PX);
        const ext = EXTENT_PX * clusterScale;
        cx0 = width * (area.x + area.width / 2);
        cy0 = height * (area.y + area.height / 2);
        ampX = Math.max(0, halfW - ext);
        ampY = Math.max(0, halfH - ext);
      } else {
        clusterScale = 1;
        cx0 = width * 0.5;
        cy0 = height * 0.5;
        ampX = base * props.idleRoamRange;
        ampY = ampX;
      }
      const s = t * props.idleRoamSpeed;
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
      spawn(centerX, centerY);
    } else {
      clusterScale = 1;
    }

    // 掛載擴散：patch 叢集由 0 緩動到全尺寸
    spread += (1 - spread) * 0.12;

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
      minX = Math.min(minX, s.x - r * 2.5);
      maxX = Math.max(maxX, s.x + r * 2.5);
      minY = Math.min(minY, s.y - r * 2.5);
      maxY = Math.max(maxY, s.y + r * 2.5);
    }

    // 持久球（常駐，非只閒置）：確保 patch 群永不被遮罩吃光（需求 2：不消失）。
    // 半徑刻意「小於」叢集名目半徑（×0.55）→ 場的圓形等值線切進 patch 外緣，
    // 矩形直邊只保留在內部、外緣被收成圓弧＋隨機閾值毛糙（圓弧收邊，參考正式版）
    if (centerX > -9000 && width > 0) {
      const headR = EXTENT_PX * 0.62 * props.coreScale * spread * clusterScale;
      if (headR > 1) {
        live.push({ x: centerX, y: centerY, r: headR });
        minX = Math.min(minX, centerX - headR * 2.5);
        maxX = Math.max(maxX, centerX + headR * 2.5);
        minY = Math.min(minY, centerY - headR * 2.5);
        maxY = Math.max(maxY, centerY + headR * 2.5);
      }
    }

    const gx0 = Math.max(Math.floor(minX / CELL), 0);
    const gx1 = Math.min(Math.ceil(maxX / CELL), cols);
    const gy0 = Math.max(Math.floor(minY / CELL), 0);
    const gy1 = Math.min(Math.ceil(maxY / CELL), rows);

    // ---------- 本幀的 4 個 patch 矩形（格座標）：基準偏移 + 逐 patch 漂移 ----------
    const focalGX = Math.round(centerX / CELL);
    const focalGY = Math.round(centerY / CELL);
    const ds = t * props.driftSpeed;
    const rects = ROSTER.map((p) => {
      const ampC = Math.min(p.w, p.h) * 0.5 * props.driftRatio;
      // 不可公度頻率 + 逐 patch 相位 → 各走各的有機路徑、不同步
      const dx =
        (Math.sin(ds * 0.1 + p.phase) * 0.6 +
          Math.sin(ds * 0.17 + p.phase * 2.3) * 0.4) *
        ampC;
      const dy =
        (Math.cos(ds * 0.08 + p.phase * 1.7) * 0.6 +
          Math.cos(ds * 0.15 + p.phase * 0.9) * 0.4) *
        ampC *
        DRIFT_Y_MUL;
      const f = props.patchScale * spread * clusterScale;
      const w = Math.max(2, Math.round(p.w * f));
      const h = Math.max(2, Math.round(p.h * f));
      const cx = focalGX + Math.round((p.ox + dx) * f);
      const cy = focalGY + Math.round((p.oy + dy) * f);
      const x0 = cx - (w >> 1);
      const y0 = cy - (h >> 1);
      return {
        x0,
        x1: x0 + w,
        y0,
        y1: y0 + h,
        // 超橢圓羽化用：矩形中心（格）與半寬/半高
        cx: x0 + (w - 1) / 2,
        cy: y0 + (h - 1) / 2,
        hw: w / 2,
        hh: h / 2,
        tex: p.tex,
      };
    });

    ctx.clearRect(0, 0, width, height);

    // 逐格：先查 patch（便宜的矩形/紋理測試），命中才算 metaball 場（貴），
    // 場強 ≥ 該格隨機閾值才畫 → patch 拼貼被場遮罩收邊、外緣有機溶解
    for (let gy = gy0; gy < gy1; gy++) {
      for (let gx = gx0; gx < gx1; gx++) {
        // 由上往下找第一個「覆蓋該格且紋理實格」的 patch；透空格讓位下層
        let hit = false;
        for (let pi = rects.length - 1; pi >= 0; pi--) {
          const r = rects[pi]!;
          if (gx < r.x0 || gx >= r.x1 || gy < r.y0 || gy >= r.y1) continue;
          // 超橢圓羽化：中心 keep=1、邊緣降到 0 + 抖動 hash 讓位
          // → patch 呈圓角方形、四邊溶解，不見方形直角
          const nx = Math.abs(gx - r.cx) / r.hw;
          const ny = Math.abs(gy - r.cy) / r.hh;
          const rn = Math.pow(
            Math.pow(nx, SUPER_N) + Math.pow(ny, SUPER_N),
            1 / SUPER_N,
          );
          const keep = 1 - smoothstep(1 - PATCH_FEATHER, 1, rn);
          if (keep <= 0) continue;
          if (
            keep < 1 &&
            hash(gx * 1.37 + pi * 7.7, gy * 2.11 + pi * 3.3) > keep
          )
            continue;
          if (!texOn(r.tex, gx, gy)) continue;
          hit = true;
          break;
        }
        if (!hit) continue;
        // 閾值 = 穩定 hash × 慢速 epoch（相位逐格錯開）：同 epoch 內每幀同值
        // 不閃爍；每隔約 EDGE_PERIOD 秒逐格錯落重抽 → 靜止時邊緣也微微呼吸
        const thEpoch = Math.floor(t / EDGE_PERIOD + hash(gx * 3.7, gy * 9.1));
        const th = 0.6 + hash3(gx + 5.2, gy + 8.4, thEpoch + 2.6);
        const cx = (gx + 0.5) * CELL;
        const cy = (gy + 0.5) * CELL;
        let field = 0;
        for (const b of live) {
          const dx = cx - b.x;
          const dy = cy - b.y;
          // 平移後的 inverse-square：在 d = 2.5r 處歸零（同正式版）
          const q = (b.r * b.r) / (dx * dx + dy * dy + 1) - 0.16;
          if (q > 0) field += q;
        }
        if (field >= th) {
          // 顏色：預設藍；橘色 = 圓形核心＋羽化過渡帶（圓弧收邊，參考正式版）。
          // 核心內（rn ≤ 1-orangeFeather）機率全額 orangeMax、過渡帶 smoothstep
          // 降到 0；區塊 × epoch 穩定 hash 慢速換抽、相位逐塊錯開 → 不閃爍
          const bx = Math.floor(gx / ACCENT_BLOCK);
          const by = Math.floor(gy / ACCENT_BLOCK);
          const bPhase = hash(bx * 7.1 + 1.3, by * 7.1 + 2.7);
          const epoch = Math.floor(t / SWITCH_PERIOD + bPhase);
          const rn = Math.hypot(cx - centerX, cy - centerY) / ORANGE_R;
          const p =
            props.orangeMax *
            (1 - smoothstep(1 - props.orangeFeather, 1, rn));
          ctx.fillStyle =
            p > 0 && hash3(bx, by, epoch + 0.5) < p ? ACCENT : COLOR;
          ctx.fillRect(gx * CELL, gy * CELL, CELL, CELL);
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
