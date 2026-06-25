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
    /** 格子色票 */
    palette?: string[];
  }>(),
  {
    bgColor: '#ffffff',
    maxBalls: 64,
    life: 1.6,
    cellSize: 14,
    palette: () => ['#9cc9f0', '#bdddf7', '#dcedfb'],
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

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  // 每格目前的顏色：undefined = 未激活；null = 此次激活抽到留白；string = 色票
  // 格子離開 metaball 場便重設，再次經過時重新隨機 → 每次圖案都不同
  let cellColors: (string | null | undefined)[] = [];
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
    cellColors = new Array(cols * rows);
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
    spawn(e.clientX - rect.left, e.clientY - rect.top);
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
    if (t - lastPointerAt > IDLE_DELAY && t - lastAmbientAt > AMBIENT_INTERVAL) {
      lastAmbientAt = t;
      const base = Math.min(width, height);
      const x =
        width * 0.5 +
        (Math.sin(t * 0.35) * 0.6 + Math.sin(t * 0.13 + 1.7) * 0.4) * base * 0.1;
      const y =
        height * 0.5 +
        (Math.cos(t * 0.28) * 0.6 + Math.sin(t * 0.17 + 0.7) * 0.4) * base * 0.1;
      addStamp(x, y, 0.035, 0.075);
    }

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

    // 逐格判斷是否在 metaball 場內（Σ r²/d² ≥ 1）：
    // 在場內 → 長出格子（首次激活時隨機配色，偏好延續左鄰顏色形成橫紋）
    // 離開場 → 重設，下次經過重新隨機
    for (let gy = 0; gy < rows; gy++) {
      const inY = gy >= gy0 && gy < gy1;
      for (let gx = 0; gx < cols; gx++) {
        const idx = gy * cols + gx;
        if (!inY || gx < gx0 || gx >= gx1 || live.length === 0) {
          if (cellColors[idx] !== undefined) cellColors[idx] = undefined;
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
          let c = cellColors[idx];
          if (c === undefined) {
            const left = gx > 0 ? cellColors[idx - 1] : undefined;
            if (left !== undefined && Math.random() < 0.6) {
              c = left; // 延續左鄰 → 橫向色帶感
            } else {
              c =
                Math.random() < 0.78
                  ? props.palette[Math.floor(Math.random() * props.palette.length)]!
                  : null;
            }
            cellColors[idx] = c;
          }
          if (c) {
            ctx.fillStyle = c;
            ctx.fillRect(gx * CELL, gy * CELL, CELL, CELL);
          }
        } else if (cellColors[idx] !== undefined) {
          cellColors[idx] = undefined;
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
