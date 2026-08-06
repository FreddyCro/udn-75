// 符號字元集 → glyph sprite atlas 與漸層貼圖。
//
// 本檔分兩層：
//   ・純函式（rankCharsByInk / atlasGridSize / glyphIndex / buildWeightLadder）——
//     無 DOM、無 three.js 相依，由 test/symbol-atlas.spec.ts 覆蓋。
//   ・DOM 函式（measureInkWithCanvas / sortCharsByInk / buildGlyphAtlas / buildColorRamp）——
//     需要 canvas 與 THREE，不進測試，靠 demo 頁目視驗證。
// 這樣切是因為專案 vitest 跑 node 環境（見 vitest.config.ts），碰 document 會直接爆。

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
