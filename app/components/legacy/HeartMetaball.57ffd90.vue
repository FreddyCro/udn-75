<!--
  ============================================================================
  HeartMetaball — 游標互動的像素馬賽克揭露效果（單色藍 / Canvas 2D）
  ============================================================================

  【整體】
  畫面是一張被網格量化的「蓋章式 metaball 場」當作柔邊遮罩：游標移動時沿軌跡
  蓋下會漸縮消失的圓章，疊出有機團塊；無互動 IDLE_DELAY 秒後進入閒置漂浮，
  團塊以多頻率 sin 在畫面中央緩慢游移。只有落在場內（Σ r²/d² ≥ 閾值）的格子
  才會被填色，因此邊緣是隨游標生長/消退的柔邊，而非硬邊形狀。全程單色藍。

  【兩區：中心 vs 外圍】（核心規格）
  以游標為焦點 (centerX,centerY) 定義一個「會擴散的圓角方形」中心區，其餘場內
  區域為外圍。中心區半邊長 centerR 由 0 緩動長到 CENTER_MAX（擴散感）並跟隨游標。

    1. 形狀：用「超橢圓」判定中心區 |dx|^n + |dy|^n ≤ r^n（n = cornerExp）。
       n=2 為正圓、n 越大越方；預設 4 → 圓角方形，避免生硬直角。

    2. 中心圖案 = 「變寬棋盤」：
       - 水平方向是寬度帶 1,2,3,6 循環（單元寬 12 格），SEG[p] = 該格所屬帶序 k(0~3)。
       - 顏色由 (k + gy) 的奇偶決定：相鄰帶反色、相鄰列也反色（棋盤二染色），
         但格子是不等寬的長方塊。每一列都畫。
         偶數列：1藍 2白 3藍 6白；奇數列：1白 2藍 3白 6藍。

    3. 外圍圖案：只在偶數列上，以 hash 隨機散布 1×1 / 1×2 小藍塊
       （density = peripheryDensity），呈現鬆散像素點。

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
    color            單色藍
    centerCells      中心圓角方形半邊長（格數）— 控制中心區大小
    peripheryDensity 外圍藍塊密度（0~1）
    cornerExp        中心區超橢圓指數（2=圓、4=圓角方、越大越方）
    edgeFeather      邊緣羽化寬度（佔半徑比例 0~1，越大散越開）
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
    /** 單色藍 */
    color?: string;
    /** 中心正方形半邊長（格數）；方塊會由 0 緩動擴散到此大小並跟隨游標 */
    centerCells?: number;
    /** 外圍隨機藍塊的密度（0~1，偶數列上每格為藍的機率） */
    peripheryDensity?: number;
    /** 中心區形狀的超橢圓指數：2 = 正圓、越大越接近方形；4 左右為圓角方形 */
    cornerExp?: number;
    /** 邊緣羽化寬度（佔半徑比例 0~1）：越大過渡帶越寬、中心越自然散開融入外圍 */
    edgeFeather?: number;
  }>(),
  {
    bgColor: '#ffffff',
    maxBalls: 64,
    life: 1.6,
    cellSize: 14,
    color: '#9FD6FF',
    centerCells: 17,
    peripheryDensity: 0.5,
    cornerExp: 4,
    edgeFeather: 0.5,
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

  // 平滑階梯：x≤a 回 0、x≥b 回 1，中間為 S 形漸變
  const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
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
  ) => {
    const base = Math.min(width, height);
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
  const IDLE_DELAY = 1.2; // 秒：最後一次 pointer 活動後多久進入閒置漂浮
  const AMBIENT_INTERVAL = 0.4; // 秒：漂浮團定期補章，避免原地衰減消失
  let lastPointerAt = -Infinity;
  let lastAmbientAt = -Infinity;

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    lastPointerAt = now();
    centerX = e.clientX - rect.left;
    centerY = e.clientY - rect.top;
    spawn(centerX, centerY);
  };
  wrap.addEventListener('pointermove', onPointerMove);
  wrap.addEventListener('pointerdown', onPointerMove);

  // ---------- render loop（IntersectionObserver 控制啟停） ----------
  let raf = 0;
  let running = false;

  const animate = () => {
    if (!running) return;
    const t = now();

    // 閒置時：中央小範圍漂浮（多頻率 sin 疊出緩慢偽 noise 路徑）；
    // pointer 互動會暫停，停止互動 IDLE_DELAY 後回到中央
    if (t - lastPointerAt > IDLE_DELAY) {
      const base = Math.min(width, height);
      // 每幀更新焦點 → 中心方塊跟著漂浮路徑走
      centerX =
        width * 0.5 +
        (Math.sin(t * 0.35) * 0.6 + Math.sin(t * 0.13 + 1.7) * 0.4) * base * 0.1;
      centerY =
        height * 0.5 +
        (Math.cos(t * 0.28) * 0.6 + Math.sin(t * 0.17 + 0.7) * 0.4) * base * 0.1;
      if (t - lastAmbientAt > AMBIENT_INTERVAL) {
        lastAmbientAt = t;
        addStamp(centerX, centerY, 0.035, 0.075);
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
        if (field >= th) {
          // 中心區用超橢圓正規化半徑 rn（中心=0、邊界=1），圓角方形不見生硬直角
          const cdx = Math.abs(cx - centerX);
          const cdy = Math.abs(cy - centerY);
          const e =
            Math.pow(cdx, props.cornerExp) + Math.pow(cdy, props.cornerExp);
          const rn = Math.pow(e, 1 / props.cornerExp) / Math.max(centerR, 0.0001);
          // 羽化：核心內 keep=1 全保留中心圖案；接近邊界 keep 漸降到 0，
          // 以抖動 hash 機率性讓位給外圍 → 兩種紋理在過渡帶交融、邊界自然溶解
          const keep = 1 - smoothstep(1 - props.edgeFeather, 1, rn);
          const isCenter = keep > 0 && hash(gx + 31.4, gy + 17.2) < keep;
          let blue = false;
          if (isCenter) {
            // 中心：變寬棋盤——帶序 k 查 SEG，顏色 (k + gy) 奇偶交錯，每列都畫
            const k = SEG[((gx % UNIT_W) + UNIT_W) % UNIT_W]!;
            blue = (k + gy) % 2 === 0;
          } else if (gy % 2 === 0) {
            // 外圍（含過渡帶讓位的格子）：偶數列隨機散布 1×1 / 1×2 小藍塊
            blue = hash(gx, gy) < props.peripheryDensity;
          }
          if (blue) {
            ctx.fillStyle = COLOR;
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
    wrap.removeEventListener('pointermove', onPointerMove);
    wrap.removeEventListener('pointerdown', onPointerMove);
  });
});
</script>

<style scoped>
.metaballs {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: none;
}

.metaballs canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
