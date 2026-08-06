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
