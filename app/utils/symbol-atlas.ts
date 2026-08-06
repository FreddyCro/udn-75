// 符號字元集 → glyph sprite atlas 與漸層貼圖。
//
// 本檔分兩層：
//   ・純函式（rankCharsByInk / atlasGridSize / glyphIndex / buildWeightLadder）——
//     無 DOM、無 three.js 相依，由 test/symbol-atlas.spec.ts 覆蓋。
//   ・DOM 函式（measureInkWithCanvas / sortCharsByInk / buildGlyphAtlas / buildColorRamp）——
//     需要 canvas 與 THREE，不進測試，靠 demo 頁目視驗證。
// 這樣切是因為專案 vitest 跑 node 環境（見 vitest.config.ts），碰 document 會直接爆。

import * as THREE from 'three';

/** glyph sprite sheet 的 cell 邊長（px）。字元實際字級遠小於此，靠 mipmap 縮下去。 */
const CELL = 64;

export interface GlyphAtlas {
  texture: THREE.CanvasTexture;
  cols: number;
  rows: number;
  cellCount: number;
}

/**
 * 依「墨水量」把字元由少到多排序，最前面補一個空白字元。
 *
 * 排序後的 index 就是明暗階：index 0（空白）＝最暗（不畫），愈後面愈亮愈濃。
 * 這是 gemini-code 圖像可辨識度的來源 —— 舊版隨機指定 glyph，明暗完全靠點的有無。
 *
 * measureInk 以參數注入，讓排序邏輯本身可在無 DOM 環境測試。
 *
 * @returns 含前置空白的完整排序；無可用字元時回傳空陣列（呼叫端據此不建粒子）
 */
export function rankCharsByInk(
  chars: string[],
  measureInk: (ch: string) => number,
): string[] {
  const uniq = Array.from(new Set(chars.join('').split(''))).filter(
    (c) => c.trim() !== '',
  );
  if (uniq.length === 0) return [];
  const scored = uniq.map((char) => ({ char, ink: measureInk(char) }));
  // 墨水量相同時以字元本身決勝：Array.prototype.sort 對相同 key 的順序不保證，
  // 沒有 tie-break 的話同一組字元集在不同環境可能排出不同結果。
  scored.sort((a, b) =>
    a.ink === b.ink ? (a.char < b.char ? -1 : 1) : a.ink - b.ink,
  );
  return [' ', ...scored.map((s) => s.char)];
}

/** atlas 的格數 → 盡量接近正方形的 cols × rows（至少 1×1，避免 0 尺寸貼圖）。 */
export function atlasGridSize(cellCount: number): { cols: number; rows: number } {
  const n = Math.max(1, Math.floor(cellCount));
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  return { cols, rows };
}

/**
 * (字元階, 字重階) → atlas cell 索引。
 *
 * charIdx 是「含空白」的排序索引，空白（0）不進 atlas，故要 -1。
 */
export function glyphIndex(
  charIdx: number,
  weightIdx: number,
  weightSteps: number,
): number {
  return (charIdx - 1) * weightSteps + weightIdx;
}

/** 字重階梯：steps 個由 min 等距到 max 的整數；steps ≤ 1 時只取 max（亮部字重）。 */
export function buildWeightLadder(
  steps: number,
  min: number,
  max: number,
): number[] {
  const n = Math.max(1, Math.round(steps));
  if (n === 1) return [Math.round(max)];
  return Array.from({ length: n }, (_, i) =>
    Math.round(min + ((max - min) * i) / (n - 1)),
  );
}

/**
 * 用離屏 canvas 量一個字元的「墨水量」＝非零 alpha 的像素數。
 *
 * 沿用 gemini-code getSortedChars() 的做法：一律以最粗字重（900）量，
 * 這樣排序反映的是字形本身的濃淡，而非某一階字重下的濃淡。
 */
export function measureInkWithCanvas(ch: string): number {
  const c = document.createElement('canvas');
  c.width = 20;
  c.height = 20;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 20, 20);
  ctx.fillStyle = '#fff';
  ctx.font = '900 16px monospace';
  ctx.fillText(ch, 2, 16);
  const data = ctx.getImageData(0, 0, 20, 20).data;
  let count = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i]! > 0) count++;
  }
  return count;
}

/** rankCharsByInk 綁上 canvas 量測的便利版本。 */
export function sortCharsByInk(chars: string[]): string[] {
  return rankCharsByInk(chars, measureInkWithCanvas);
}

/**
 * 把「字元 × 字重」的每個組合烘成一個 cell，排成 sprite sheet。
 *
 * cell 索引 ＝ glyphIndex(charIdx, weightIdx, weights.length)，
 * fragment shader 以 gl_PointCoord + cell offset 取樣（uAtlasGrid 傳 cols/rows）。
 *
 * 預設 8 字 × 5 階 = 40 cells → 7×6 grid × 64px = 448×384。
 *
 * @param chars 已排序、**不含**前置空白的字元（即 sortCharsByInk(...).slice(1)）
 */
export function buildGlyphAtlas(
  chars: string[],
  weights: number[],
): GlyphAtlas {
  const cellCount = chars.length * weights.length;
  const { cols, rows } = atlasGridSize(cellCount);
  const c = document.createElement('canvas');
  c.width = cols * CELL;
  c.height = rows * CELL;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  chars.forEach((ch, ci) => {
    weights.forEach((w, wi) => {
      // ci 是 slice(1) 後的索引，glyphIndex 吃的是含空白的索引，故 +1
      const i = glyphIndex(ci + 1, wi, weights.length);
      const cx = (i % cols) * CELL + CELL / 2;
      const cy = Math.floor(i / cols) * CELL + CELL / 2;
      ctx.font = `${w} ${CELL * 0.78}px "Courier New", monospace`;
      ctx.fillText(ch, cx, cy);
    });
  });
  const texture = new THREE.CanvasTexture(c);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return { texture, cols, rows, cellCount };
}

/**
 * 單色／多色標漸層 → 1D 漸層貼圖，shader 以 vT（＝亮度）取色。
 *
 * stops 給定且長度與 color 相同時依其位置（0..1）配置，否則等距。
 * gemini-code 的四色標預設位置是 0 / 0.4 / 0.75 / 1 —— 高光集中在最亮 25%，
 * 這是它對比感的關鍵，等距漸層做不出來。
 */
export function buildColorRamp(
  color: string | string[],
  stops?: number[],
): THREE.CanvasTexture {
  const colors = Array.isArray(color) ? color : [color];
  const w = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = 1;
  const ctx = c.getContext('2d')!;
  if (colors.length === 1) {
    ctx.fillStyle = colors[0]!;
    ctx.fillRect(0, 0, w, 1);
  } else {
    const usable =
      stops && stops.length === colors.length
        ? stops
        : colors.map((_, i) => i / (colors.length - 1));
    const g = ctx.createLinearGradient(0, 0, w, 0);
    colors.forEach((s, i) =>
      g.addColorStop(Math.min(1, Math.max(0, usable[i]!)), s),
    );
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, 1);
  }
  const texture = new THREE.CanvasTexture(c);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
