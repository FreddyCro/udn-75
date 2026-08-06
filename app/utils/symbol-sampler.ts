// 圖片像素 → 網格粒子屬性（SymbolFace 的靜態骨架）。
//
// 對照 gemini-code HTML 的 render()：嚴格網格、每格依亮度取一個「墨水階」字元，
// 最暗階是空白就不畫。舊版 SymbolFace 是機率抽樣丟點、glyph 隨機，明暗全靠點的有無。
//
// 全檔無 DOM、無 three.js：入口吃 { data, width, height }（呼叫端自己用 canvas
// getImageData 轉），故可直接用 vitest 測（test/symbol-sampler.spec.ts）。

/** 等同 ImageData 的最小介面，讓測試能手工組資料。 */
export interface ImageLike {
  data: Uint8ClampedArray | number[];
  width: number;
  height: number;
}

export interface GridOptions {
  /** 橫向格數＝疏密主控（同 gemini 的 cols），clamp 到 20..400 */
  cols: number;
  /** monospace 寬高比：cellH = cellW / charAspect */
  charAspect: number;
  fitWidth: number;
  fitHeight: number;
  worldScale: number;
}

export interface GridMetrics {
  scale: number;
  cellW: number;
  cellH: number;
  cols: number;
  rows: number;
  halfW: number;
  halfH: number;
}

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/**
 * 亮度 → 明暗階：先套負片，再繞中灰 0.5 做對比。
 *
 * 舊版的 darkBoost 是乘法增益後 clamp，只會提亮暗部、壓縮高光；
 * face.png 是中灰調 3D render，沒有真對比會整片糊在中間調。
 */
export function toneMap(lum: number, invert: boolean, contrast: number): number {
  const b = invert ? 1 - lum : lum;
  return clamp((b - 0.5) * contrast + 0.5, 0, 1);
}

/**
 * 圖片尺寸 + 設定 → 網格幾何（world 單位）。
 *
 * cols 是對「contain-fit 後圖片本身的 world 寬」切格，不是對 fitWidth 切，
 * 故換不同長寬比的圖時格距不會跳動。
 */
export function computeGrid(
  imgW: number,
  imgH: number,
  opts: GridOptions,
): GridMetrics {
  const cols = clamp(Math.round(opts.cols), 20, 400);
  const scale =
    Math.min(opts.fitWidth / imgW, opts.fitHeight / imgH) * opts.worldScale;
  const worldW = imgW * scale;
  const worldH = imgH * scale;
  const cellW = worldW / cols;
  const cellH = cellW / opts.charAspect;
  const rows = Math.max(1, Math.floor(worldH / cellH));
  return {
    scale,
    cellW,
    cellH,
    cols,
    rows,
    halfW: worldW / 2,
    halfH: worldH / 2,
  };
}

/**
 * glyph 在 atlas cell 裡的字級佔比 —— `buildGlyphAtlas` 以 `CELL × 此值` 烘字。
 *
 * 放在這裡而不是 symbol-atlas.ts：那邊 import THREE，而本檔要維持無 DOM／無 three.js
 * 才能在 node 環境的 vitest 下測。symbol-atlas.ts 反過來 import 這個常數。
 *
 * 用途：粒子的 `aSize` 是 point sprite 的邊長，sprite 四周有 (1 - 此值) 的空白，
 * 故 sprite 邊長 = 目標字級 / GLYPH_FONT_SCALE。少了這一項，sizeMax = 1.0
 * 畫出來的字級只有格高的 78%，橫向會留一大截空隙。
 */
export const GLYPH_FONT_SCALE = 0.78;

export interface SampleOptions extends GridOptions {
  contrast: number;
  invert: boolean;
  /** sortCharsByInk() 的長度，**含**前置空白（8 個字元時是 9） */
  charCount: number;
  weightSteps: number;
  /** 暗部字級佔格高的比例 */
  sizeMin: number;
  /** 亮部字級佔格高的比例；1.0 ＝ 字級等於格高（墨水寬 ≈ 0.92 × cellW，同 gemini） */
  sizeMax: number;
  /** 格點隨機位移比例，0 ＝ 全規則 */
  jitter: number;
  /** 亂數來源，測試可注入固定值 */
  random?: () => number;
}

export interface GridSample extends GridMetrics {
  positions: Float32Array;
  sizes: Float32Array;
  glyphs: Float32Array;
  brights: Float32Array;
  count: number;
}

/**
 * 逐格取樣：整格平均亮度 → 明暗階 → 字元／字重／字級／位置。
 *
 * 跳過的格子有兩種：
 *   ・平均 alpha < 0.5 —— 去背輪廓外
 *   ・落在空白階（charIdx 0）—— 暗部留空，這是 gemini 讓圖像成形的方式
 */
export function sampleImageToGrid(
  pixels: ImageLike,
  opts: SampleOptions,
): GridSample {
  const { width: imgW, height: imgH, data } = pixels;
  const g = computeGrid(imgW, imgH, opts);
  const rnd = opts.random ?? Math.random;
  const weightSteps = Math.max(1, Math.round(opts.weightSteps));
  const charTop = Math.max(1, opts.charCount - 1); // 最亮的字元階索引

  // image 空間的格尺寸：cellW / scale 恰為 imgW / cols
  const pxW = imgW / g.cols;
  const pxH = pxW / opts.charAspect;

  const positions: number[] = [];
  const sizes: number[] = [];
  const glyphs: number[] = [];
  const brights: number[] = [];

  for (let row = 0; row < g.rows; row++) {
    const y0 = Math.floor(row * pxH);
    const y1 = Math.min(imgH, Math.max(y0 + 1, Math.ceil((row + 1) * pxH)));
    for (let col = 0; col < g.cols; col++) {
      const x0 = Math.floor(col * pxW);
      const x1 = Math.min(imgW, Math.max(x0 + 1, Math.ceil((col + 1) * pxW)));

      // 整格平均，比單點採樣穩定（原圖紋理噪點大）
      let lumSum = 0;
      let aSum = 0;
      let n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * imgW + x) * 4;
          lumSum +=
            (0.299 * (data[i] ?? 0) +
              0.587 * (data[i + 1] ?? 0) +
              0.114 * (data[i + 2] ?? 0)) /
            255;
          aSum += (data[i + 3] ?? 0) / 255;
          n++;
        }
      }
      if (n === 0) continue;
      if (aSum / n < 0.5) continue; // 去背輪廓外

      const b = toneMap(lumSum / n, opts.invert, opts.contrast);
      const charIdx = Math.floor(b * charTop);
      if (charIdx === 0) continue; // 空白階：暗部留空

      const weightIdx = Math.round(b * (weightSteps - 1));
      // 與 symbol-atlas.ts 的 glyphIndex() 是同一條公式。這裡不 import 它，
      // 因為那邊有 THREE 相依而本檔要維持零相依；兩處要改必須同時改。
      glyphs.push((charIdx - 1) * weightSteps + weightIdx);
      // 字級 = cellH × 插值；sizes 存的是 sprite 邊長，故再除掉 atlas 的 0.78 留白
      sizes.push(
        (g.cellH * (opts.sizeMin + (opts.sizeMax - opts.sizeMin) * b)) /
          GLYPH_FONT_SCALE,
      );
      brights.push(b);

      let x = (col + 0.5) * g.cellW - g.halfW;
      let y = g.halfH - (row + 0.5) * g.cellH;
      let z = 0;
      if (opts.jitter > 0) {
        x += (rnd() - 0.5) * g.cellW * opts.jitter;
        y += (rnd() - 0.5) * g.cellH * opts.jitter;
        z += (rnd() - 0.5) * g.cellH * opts.jitter;
      }
      positions.push(x, y, z);
    }
  }

  return {
    ...g,
    positions: new Float32Array(positions),
    sizes: new Float32Array(sizes),
    glyphs: new Float32Array(glyphs),
    brights: new Float32Array(brights),
    count: sizes.length,
  };
}

/**
 * 取樣並確保粒子數不超過上限。
 *
 * 不用隨機抽樣淘汰（那會在矩陣上打出隨機破洞，正是這次要擺脫的舊行為），
 * 改成每輪把 cols 降到 90% 重新取樣。computeGrid 的下限是 20，
 * 降到 20 仍超標就停手 —— 呼叫端可據 result.count 決定是否 warn。
 */
export function sampleImageToGridWithLimit(
  pixels: ImageLike,
  opts: SampleOptions,
  maxParticles: number,
): GridSample {
  let result = sampleImageToGrid(pixels, opts);
  while (result.count > maxParticles && result.cols > 20) {
    result = sampleImageToGrid(pixels, {
      ...opts,
      cols: Math.floor(result.cols * 0.9),
    });
  }
  return result;
}
