# SymbolFace 靜態質感移植 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `SymbolFace.vue` 的靜態外觀改成 gemini-code HTML 的 ASCII matrix 質感（網格化取樣、字元依墨水量對應明暗、多字重、可調 stop 漸層），動態與 3D 邏輯完全不動。

**Architecture:** 把「圖 → 粒子屬性」與「字元集 → glyph atlas / 漸層貼圖」兩段邏輯從 `SymbolFace.vue` 抽成 `app/utils/` 下的兩個模組。核心計算寫成無 DOM 相依的純函式（吃 `{ data, width, height }` 而非 `HTMLImageElement`，墨水量測以函式注入），這樣才能在專案既有的 node 環境 vitest 下測。`SymbolFace.vue` 只保留 three.js 場景、CPU 物理積分、mode 三態、彩蛋與 dev 面板。

**Tech Stack:** Nuxt 4 / Vue 3.5 / TypeScript / three.js 0.184 / gsap 3.15 / vitest 4

## Global Constraints

- 設計依據：`architecture/2026-08-06-symbol-face-static-design.md`。實作與該 spec 有出入時以 spec 為準，除非本計畫明確標註為具體化。
- **動態與 3D 邏輯一律不動**：reveal / disperse / converge 三態與 GSAP 補間、IntersectionObserver、整體漂浮 sway + micro、滑鼠真空斥力、慣性物理（動量 + 指數 ease）、群體避讓、autoMouse、宮格彩蛋 + scramble、resize、dispose。
- vitest 是 **node 環境**（`vitest.config.ts` 未設 `environment`）→ `test/` 下的測試**不得**觸碰 `document`、`canvas`、`Image`、`THREE`。
- vitest **沒有設 alias** → 測試一律用相對路徑 import（見 `test/forum-path-geometry.spec.ts` 的註解）。
- 測試檔放 `test/*.spec.ts`；跑全部用 `pnpm test`，跑單檔用 `pnpm vitest run test/<name>.spec.ts`。
- `app/utils/` 放無 Vue runtime 相依的模組（見 `app/utils/orange-core-config.ts` 開頭註解的慣例）。
- 註解用繁體中文，避免簡體字與中國慣用語。
- 元件 auto-import 規則見 `nuxt.config.ts` 的 `components`：`~/components/01a.symbol` 設 `pathPrefix: false`（故是 `<SymbolFace>`），`~/components` 為預設規則（故 `legacy/Foo.vue` 是 `<LegacyFoo>`）。
- Shader 是 GLSL ES 1.0（three.js `ShaderMaterial` 未指定 `glslVersion`）→ 迴圈上界必須是常數，動態次數用常數上界 + `break`。

**參照值**：`cols` **85**、`charAspect` 0.65、`contrast` 1.2、字重 100–900 五階、`sizeMin` 0.43 / `sizeMax` 1.0、色標位置 0% / 40% / 75% / 100%。
`cols` 是唯一偏離 gemini 的一項（它是 130）—— 滿版一屏放不下 130 欄的可辨識字級，理由見 spec § 2。

---

## 執行進度（2026-08-06 更新）

| Task | 狀態 | commit |
|---|---|---|
| 1 備份 legacy + demo 切換 | ✅ | `cc4f22f` |
| 2 `symbol-atlas.ts` 純函式 | ✅ | `b193a4b` |
| 3 `symbol-atlas.ts` DOM 部分 | ✅ | `cae00a0` |
| 4 `symbol-sampler.ts` 色調 / 格數 | ✅ | `6a2d187` |
| 5 `sampleImageToGrid` | ⬜ | |
| 6 `sampleImageToGridWithLimit` | ⬜ | |
| 7 SymbolFace.vue 接上 utils | ⬜ | ← 唯一會改變畫面的一步 |
| 8 dev 面板 glitch 欄位 | ⬜ | |
| 9 Hero / demo props 同步 | ⬜ | |

⚠️ Task 2–4 的產物目前**只有測試檔在 import**，`SymbolFace.vue` 完全沒接上，
所以 demo 頁的「新版 矩陣」與「舊版 散點」除了 5 行註解外是同一份程式碼。

`3d3e32c` 是一次 props-only 的方向驗證（只改 demo.vue，元件零改動），
證實色盤／密度／字級方向正確，並修正了本計畫兩處推導錯誤，見下方「已更正的推導」。

### 已更正的推導（2026-08-06）

1. **atlas 留白**：`aSize` 是 point sprite 邊長，但 `buildGlyphAtlas` 只把字烘在
   `CELL × 0.78` 上。`sizeMax = 1.0` 若不除掉這 0.78，字級只有格高的 78%。
   → Task 5 新增 `GLYPH_FONT_SCALE` 常數並套進 size 公式。
2. **原判定「字級比格距大 1.66 倍必定重疊」是錯的** —— 那是拿 sprite 外框比格距，
   未計入 atlas 留白（×0.78）與 monospace 墨水比（×0.6）。實際墨水/格距在 58%–105%，
   缺陷是「隨視窗高度漂移」而非「固定超標」。修法不變（Task 7 的 `uWorldToPx`），
   但 Task 7 的程式碼註解要改寫，見該 Task。
3. **`face.png` 實測 1013×1478**（原記 1024×1470），alpha 覆蓋 80%，亮度平均 0.533、
   0.2–0.8 均勻分佈 —— 中間調，不是暗調。

---

## File Structure

| 檔案 | 動作 | 責任 |
|---|---|---|
| `app/components/legacy/SymbolFaceScatter.vue` | 建立 | 現行版本的原封不動備份，不再維護 |
| `app/utils/symbol-atlas.ts` | 建立 | 字元集 → 墨水量排序、glyph atlas、漸層 ramp。純函式與 DOM 函式分離 |
| `app/utils/symbol-sampler.ts` | 建立 | 像素 → 網格粒子屬性。完全無 DOM |
| `test/symbol-atlas.spec.ts` | 建立 | `symbol-atlas.ts` 的純函式測試 |
| `test/symbol-sampler.spec.ts` | 建立 | `symbol-sampler.ts` 的測試 |
| `app/components/01a.symbol/SymbolFace.vue` | 修改 | 移除取樣/atlas 邏輯改為呼叫 utils、改 props、改 shader、改 dev 面板 |
| `app/components/01.hero/Hero.vue` | 修改 | 同步 props（`:sample-step` 等已移除的要換掉） |
| `app/pages/demo.vue` | 修改 | 新舊版切換 + 同步 props |

---

### Task 1: 備份現行版本並在 demo 頁加新舊版切換

先做這一步，之後所有改動都有可即時對照的基準。此時 `SymbolFace.vue` 還沒改，切換後兩邊應該長得一模一樣。

**Files:**
- Create: `app/components/legacy/SymbolFaceScatter.vue`（`app/components/01a.symbol/SymbolFace.vue` 的完整複製）
- Modify: `app/pages/demo.vue`

**Interfaces:**
- Consumes: 無
- Produces: `<LegacySymbolFaceScatter>` — 與現行 `<SymbolFace>` 完全相同的 props 與 `v-model:mode` 介面

- [ ] **Step 1: 複製檔案**

```bash
cp app/components/01a.symbol/SymbolFace.vue app/components/legacy/SymbolFaceScatter.vue
```

`legacy/` 下已有一份 `SymbolFace.vue`（更早的 einstein 原型，`<LegacySymbolFace>`，目前無人引用）—— **不要動它**，新檔用 `SymbolFaceScatter.vue` 這個名字就不會撞名。

- [ ] **Step 2: 在複製品最上方加一段來歷註解**

在 `app/components/legacy/SymbolFaceScatter.vue` 的 `<script setup lang="ts">` 下一行插入：

```ts
// ⚠️ 這是 01a.symbol/SymbolFace.vue 在 2026-08-06「靜態質感移植」改寫前的快照。
//    特徵：機率抽樣散點分布（minDensity / densityGamma）、隨機 glyph、暗部為主體。
//    新版改成 gemini-code 式的網格矩陣（見 architecture/2026-08-06-symbol-face-static-design.md）。
//    保留供 demo 頁對照用，不再維護；新版的 props / shader 變更不同步回來。
//    元件名：<LegacySymbolFaceScatter>（~/components 預設 pathPrefix 規則）。
```

其餘一行都不要改。

- [ ] **Step 3: demo.vue 加切換狀態**

在 `app/pages/demo.vue` 的 `<script lang="ts" setup>` 內，`symbolMode` 宣告後面加：

```ts
// SymbolFace 版本對照：'matrix' = 新版網格矩陣 / 'scatter' = 改寫前的機率散點版
// 用 v-if 一次只掛一個：兩者都是 100vh 滿版 WebGL，同時掛載會有兩個 three.js
// 場景與兩組 RAF（約 30k 粒子），低階機會掉幀。切換時舊元件的 onBeforeUnmount
// 會 dispose 場景，資源乾淨釋放。
const symbolVersion = ref<'matrix' | 'scatter'>('matrix');
```

- [ ] **Step 4: demo.vue 加切換 UI 與 legacy 元件**

把 `<SymbolFace ... />` 那整段（含前面的 `<!-- :auto-mouse="true" -->` 註解）替換成：

```vue
      <div class="symbol-switch">
        <button
          type="button"
          :class="{ 'symbol-switch__btn--active': symbolVersion === 'matrix' }"
          class="symbol-switch__btn"
          @click="symbolVersion = 'matrix'"
        >
          新版 矩陣
        </button>
        <button
          type="button"
          :class="{ 'symbol-switch__btn--active': symbolVersion === 'scatter' }"
          class="symbol-switch__btn"
          @click="symbolVersion = 'scatter'"
        >
          舊版 散點
        </button>
      </div>

      <!-- :auto-mouse="true" -->
      <SymbolFace
        v-if="symbolVersion === 'matrix'"
        v-model:mode="symbolMode"
        :dev="true"
        :phrases="symbolPhrases"
        :hole-radius="25"
        :hole-spread="50"
        :return-ease="1.5"
        :friction="1.8"
        :impulse-strength="10000"
        :impulse-spray="0.9"
        :impulse-spray-z="0.6"
        :velocity-follow="0.1"
        :max-speed="3000"
        :max-particles="10000"
        :color="['#ffffff', '#9fd6ff', '#77c6e0', '#3f8fb5']"
        bg-color="#000"
        :sample-step="5"
        :size-min="16"
        :size-max="32"
        :min-density="0.7"
        :density-gamma="2.4"
        :dark-boost="1.8"
        :float-amp="18"
        :float-micro="0.5"
      />
      <!-- 改寫前的快照，props 沿用舊介面、與新版互不牽動（見 legacy/SymbolFaceScatter.vue） -->
      <LegacySymbolFaceScatter
        v-else
        v-model:mode="symbolMode"
        :dev="true"
        :phrases="symbolPhrases"
        :hole-radius="25"
        :hole-spread="50"
        :return-ease="1.5"
        :friction="1.8"
        :impulse-strength="10000"
        :impulse-spray="0.9"
        :impulse-spray-z="0.6"
        :velocity-follow="0.1"
        :max-speed="3000"
        :max-particles="10000"
        :color="['#ffffff', '#9fd6ff', '#77c6e0', '#3f8fb5']"
        bg-color="#000"
        :sample-step="5"
        :size-min="16"
        :size-max="32"
        :min-density="0.7"
        :density-gamma="2.4"
        :dark-boost="1.8"
        :float-amp="18"
        :float-micro="0.5"
      />
```

注意：此時 `<SymbolFace>` 還沒改，所以兩邊 props 完全一樣。Task 9 才會把新版的 props 換掉。

- [ ] **Step 5: demo.vue 加切換鈕樣式**

在 `<style scoped>` 內加：

```css
/* 新舊版 SymbolFace 對照切換：z-index 高於 SymbolFace dev 面板（5） */
.symbol-switch {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 20;
  display: flex;
  gap: 6px;
}

.symbol-switch__btn {
  padding: 8px 14px;
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(20, 22, 28, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  cursor: pointer;
}

.symbol-switch__btn--active {
  color: #10141b;
  background: #ffb060;
  border-color: #ffb060;
}
```

- [ ] **Step 6: 驗證**

Run: `pnpm dev`，開 `/demo`

Expected:
- 左上角出現兩顆切換鈕，預設「新版 矩陣」為選取態
- 兩邊切換後畫面表現一致（此時本來就是同一份程式碼）
- 切到舊版再切回來，dev 面板正常、人像重新 reveal、不報錯
- Console 無錯誤

- [ ] **Step 7: Commit**

```bash
git add app/components/legacy/SymbolFaceScatter.vue app/pages/demo.vue
git commit -m "chore: 備份 SymbolFace 改寫前版本為 LegacySymbolFaceScatter，demo 頁加新舊版切換"
```

---

### Task 2: symbol-atlas.ts 的純函式（墨水量排序 / atlas 格數 / glyph 索引）

**Files:**
- Create: `app/utils/symbol-atlas.ts`
- Test: `test/symbol-atlas.spec.ts`

**Interfaces:**
- Consumes: 無
- Produces:
  - `rankCharsByInk(chars: string[], measureInk: (ch: string) => number): string[]`
  - `atlasGridSize(cellCount: number): { cols: number; rows: number }`
  - `glyphIndex(charIdx: number, weightIdx: number, weightSteps: number): number`
  - `buildWeightLadder(steps: number, min: number, max: number): number[]`

- [ ] **Step 1: 寫失敗的測試**

Create `test/symbol-atlas.spec.ts`：

```ts
import { describe, expect, it } from 'vitest';
import {
  atlasGridSize,
  buildWeightLadder,
  glyphIndex,
  rankCharsByInk,
} from '../app/utils/symbol-atlas';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。
// 這裡只測「無 DOM」的純函式；真正拿 canvas 量墨水量的部分不在測試範圍。

// 假的墨水量測：字元愈後面墨水愈多，方便驗證排序
const inkOf = (map: Record<string, number>) => (ch: string) => map[ch] ?? 0;

describe('rankCharsByInk', () => {
  it('依墨水量由少到多排序，並在最前面補一個空白', () => {
    const measure = inkOf({ '.': 1, 'o': 5, '#': 9 });
    expect(rankCharsByInk(['#', '.', 'o'], measure)).toEqual([' ', '.', 'o', '#']);
  });

  it('把多字元字串展開成單一字元', () => {
    const measure = inkOf({ A: 3, B: 1 });
    expect(rankCharsByInk(['AB'], measure)).toEqual([' ', 'B', 'A']);
  });

  it('去除重複字元', () => {
    const measure = inkOf({ A: 3, B: 1 });
    expect(rankCharsByInk(['A', 'B', 'A', 'B'], measure)).toEqual([' ', 'B', 'A']);
  });

  it('濾掉空白與空字串', () => {
    const measure = inkOf({ A: 3 });
    expect(rankCharsByInk([' ', '', 'A', '\t'], measure)).toEqual([' ', 'A']);
  });

  it('墨水量相同時以字元本身決勝，結果穩定', () => {
    const measure = () => 4;
    expect(rankCharsByInk(['C', 'A', 'B'], measure)).toEqual([' ', 'A', 'B', 'C']);
  });

  it('沒有可用字元時回傳空陣列（呼叫端據此不建粒子）', () => {
    expect(rankCharsByInk([], () => 1)).toEqual([]);
    expect(rankCharsByInk(['  ', ''], () => 1)).toEqual([]);
  });
});

describe('atlasGridSize', () => {
  it('8 字 × 5 階 = 40 cells → 7 欄 6 列', () => {
    expect(atlasGridSize(40)).toEqual({ cols: 7, rows: 6 });
  });

  it('完全平方數剛好方形', () => {
    expect(atlasGridSize(16)).toEqual({ cols: 4, rows: 4 });
  });

  it('1 cell 也要有 1×1', () => {
    expect(atlasGridSize(1)).toEqual({ cols: 1, rows: 1 });
  });

  it('0 cell 退回 1×1，不產生 0 尺寸貼圖', () => {
    expect(atlasGridSize(0)).toEqual({ cols: 1, rows: 1 });
  });
});

describe('glyphIndex', () => {
  it('charIdx 1（排序後第一個非空白字）搭配 weightIdx 0 → 0', () => {
    expect(glyphIndex(1, 0, 5)).toBe(0);
  });

  it('charIdx 1 的最後一階字重 → 4', () => {
    expect(glyphIndex(1, 4, 5)).toBe(4);
  });

  it('charIdx 2 從第二組開始 → 5', () => {
    expect(glyphIndex(2, 0, 5)).toBe(5);
  });

  it('單一字重時等同 charIdx-1', () => {
    expect(glyphIndex(3, 0, 1)).toBe(2);
  });
});

describe('buildWeightLadder', () => {
  it('5 階 100–900 等距', () => {
    expect(buildWeightLadder(5, 100, 900)).toEqual([100, 300, 500, 700, 900]);
  });

  it('只有 1 階時取最大值（亮部字重）', () => {
    expect(buildWeightLadder(1, 100, 900)).toEqual([900]);
  });

  it('階數小於 1 一律 clamp 成 1 階', () => {
    expect(buildWeightLadder(0, 100, 900)).toEqual([900]);
  });

  it('數值四捨五入成整數', () => {
    expect(buildWeightLadder(3, 100, 800)).toEqual([100, 450, 800]);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `pnpm vitest run test/symbol-atlas.spec.ts`
Expected: FAIL — `Failed to resolve import "../app/utils/symbol-atlas"`

- [ ] **Step 3: 寫最小實作**

Create `app/utils/symbol-atlas.ts`：

```ts
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
```

- [ ] **Step 4: 跑測試確認通過**

Run: `pnpm vitest run test/symbol-atlas.spec.ts`
Expected: PASS，24 個測試全綠

- [ ] **Step 5: Commit**

```bash
git add app/utils/symbol-atlas.ts test/symbol-atlas.spec.ts
git commit -m "feat(symbol): 加入字元墨水量排序與 atlas 索引計算的純函式"
```

---

### Task 3: symbol-atlas.ts 的 DOM 部分（量測 / atlas / 漸層 ramp）

**Files:**
- Modify: `app/utils/symbol-atlas.ts`

**Interfaces:**
- Consumes: Task 2 的 `rankCharsByInk` / `atlasGridSize` / `glyphIndex`
- Produces:
  - `sortCharsByInk(chars: string[]): string[]`
  - `buildGlyphAtlas(chars: string[], weights: number[]): GlyphAtlas`，其中
    `interface GlyphAtlas { texture: THREE.CanvasTexture; cols: number; rows: number; cellCount: number }`
  - `buildColorRamp(color: string | string[], stops?: number[]): THREE.CanvasTexture`

無單元測試：這三個都直接操作 canvas / THREE，在 node 環境跑不起來。驗證靠 Task 9 的 demo 目視與截圖比對。

- [ ] **Step 1: 在檔案最上方加入 THREE import**

在 `app/utils/symbol-atlas.ts` 的檔頭註解之後、`rankCharsByInk` 之前插入：

```ts
import * as THREE from 'three';

/** glyph sprite sheet 的 cell 邊長（px）。字元實際字級遠小於此，靠 mipmap 縮下去。 */
const CELL = 64;

export interface GlyphAtlas {
  texture: THREE.CanvasTexture;
  cols: number;
  rows: number;
  cellCount: number;
}
```

- [ ] **Step 2: 在檔案結尾加入量測與排序的 DOM 包裝**

```ts
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
```

- [ ] **Step 3: 加入 buildGlyphAtlas**

```ts
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
```

- [ ] **Step 4: 加入 buildColorRamp**

```ts
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
```

- [ ] **Step 5: 確認既有測試沒被 THREE import 影響**

Run: `pnpm test`
Expected: PASS — Task 2 的測試仍全綠。

如果報 three 相關錯誤，代表 vitest 在解析 `import * as THREE from 'three'` 時失敗。three 是專案的正式相依、有 ESM 進入點，正常情況不會有問題；真的失敗的話，把 `import * as THREE` 改成 `import { CanvasTexture, LinearFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping } from 'three'` 讓 tree-shaking 生效。

- [ ] **Step 6: 型別檢查**

Run: `pnpm nuxt typecheck` （若專案未設定此指令則跳過，改在 Task 9 的 `pnpm build` 一併驗證）

- [ ] **Step 7: Commit**

```bash
git add app/utils/symbol-atlas.ts
git commit -m "feat(symbol): 加入多字重 glyph atlas 與可調 stop 的漸層 ramp"
```

---

### Task 4: symbol-sampler.ts 的色調映射與格數計算

**Files:**
- Create: `app/utils/symbol-sampler.ts`
- Test: `test/symbol-sampler.spec.ts`

**Interfaces:**
- Consumes: 無
- Produces:
  - `toneMap(lum: number, invert: boolean, contrast: number): number`
  - `computeGrid(imgW: number, imgH: number, opts: GridOptions): GridMetrics`
  - `interface GridOptions { cols: number; charAspect: number; fitWidth: number; fitHeight: number; worldScale: number }`
  - `interface GridMetrics { scale: number; cellW: number; cellH: number; cols: number; rows: number; halfW: number; halfH: number }`

- [ ] **Step 1: 寫失敗的測試**

Create `test/symbol-sampler.spec.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { computeGrid, toneMap } from '../app/utils/symbol-sampler';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。
// 本檔完全不碰 DOM：取樣吃的是 { data, width, height }，不是 HTMLImageElement。

const close = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

describe('toneMap', () => {
  it('contrast 1 且不反轉時原值通過', () => {
    expect(toneMap(0.3, false, 1)).toBeCloseTo(0.3);
    expect(toneMap(0.7, false, 1)).toBeCloseTo(0.7);
  });

  it('invert 反轉明暗', () => {
    expect(toneMap(0.3, true, 1)).toBeCloseTo(0.7);
  });

  it('contrast 繞中灰 0.5 放大差距', () => {
    // (0.7-0.5)*2+0.5 = 0.9
    expect(toneMap(0.7, false, 2)).toBeCloseTo(0.9);
    // (0.3-0.5)*2+0.5 = 0.1
    expect(toneMap(0.3, false, 2)).toBeCloseTo(0.1);
  });

  it('中灰不受 contrast 影響', () => {
    expect(toneMap(0.5, false, 2.5)).toBeCloseTo(0.5);
  });

  it('結果 clamp 在 0..1', () => {
    expect(toneMap(0.9, false, 5)).toBe(1);
    expect(toneMap(0.1, false, 5)).toBe(0);
  });

  it('先反轉再套對比', () => {
    // invert: 0.3 -> 0.7，再 contrast 2 -> 0.9
    expect(toneMap(0.3, true, 2)).toBeCloseTo(0.9);
  });
});

// ⚠️ 以下是 Task 4 當時寫進 test/symbol-sampler.spec.ts 的原樣（已 commit `6a2d187`）。
//    其中的 1024×1470 與 cols 130 事後證實過期 —— 由 Task 5 Step 0 修正，此處保留歷史。
describe('computeGrid', () => {
  const base = {
    cols: 130,
    charAspect: 0.65,
    fitWidth: 500,
    fitHeight: 500,
    worldScale: 1,
  };

  it('contain-fit 取較小的縮放比', () => {
    // 1024x1470 塞進 500x500：min(500/1024, 500/1470) = 500/1470
    const g = computeGrid(1024, 1470, base);
    expect(close(g.scale, 500 / 1470)).toBe(true);
  });

  it('face.png 在預設參數下是 130 欄 121 列', () => {
    const g = computeGrid(1024, 1470, base);
    expect(g.cols).toBe(130);
    expect(g.rows).toBe(121);
  });

  it('cellH 由 charAspect 撐高，做出 monospace 的縱向拉伸', () => {
    const g = computeGrid(1024, 1470, base);
    expect(close(g.cellH, g.cellW / 0.65)).toBe(true);
    expect(g.cellH).toBeGreaterThan(g.cellW);
  });

  it('halfW / halfH 是 contain-fit 後圖片本身的一半，不是 fitWidth 的一半', () => {
    const g = computeGrid(1024, 1470, base);
    expect(close(g.halfW, (1024 * (500 / 1470)) / 2)).toBe(true);
    expect(close(g.halfH, 500 / 2)).toBe(true);
  });

  it('worldScale 等比放大', () => {
    const a = computeGrid(1024, 1470, base);
    const b = computeGrid(1024, 1470, { ...base, worldScale: 2 });
    expect(close(b.scale, a.scale * 2)).toBe(true);
    expect(close(b.cellW, a.cellW * 2)).toBe(true);
    // 格數與縮放無關
    expect(b.rows).toBe(a.rows);
  });

  it('cols clamp 到 20..400', () => {
    expect(computeGrid(100, 100, { ...base, cols: 5 }).cols).toBe(20);
    expect(computeGrid(100, 100, { ...base, cols: 9999 }).cols).toBe(400);
  });

  it('rows 至少 1', () => {
    const g = computeGrid(1000, 1, base);
    expect(g.rows).toBe(1);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `pnpm vitest run test/symbol-sampler.spec.ts`
Expected: FAIL — `Failed to resolve import "../app/utils/symbol-sampler"`

- [ ] **Step 3: 寫最小實作**

Create `app/utils/symbol-sampler.ts`：

```ts
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
```

- [ ] **Step 4: 跑測試確認通過**

Run: `pnpm vitest run test/symbol-sampler.spec.ts`
Expected: PASS，14 個測試全綠

- [ ] **Step 5: Commit**

```bash
git add app/utils/symbol-sampler.ts test/symbol-sampler.spec.ts
git commit -m "feat(symbol): 加入網格幾何計算與繞中灰的對比映射"
```

---

### Task 5: sampleImageToGrid — 像素 → 粒子屬性

**Files:**
- Modify: `app/utils/symbol-sampler.ts`
- Modify: `app/utils/symbol-atlas.ts:140`（`CELL * 0.78` 改用共用常數，見 Step 5）
- Test: `test/symbol-sampler.spec.ts`

**Interfaces:**
- Consumes: Task 4 的 `toneMap` / `computeGrid` / `ImageLike` / `GridMetrics`
- Produces:
  - `const GLYPH_FONT_SCALE = 0.78`
  - `interface SampleOptions extends GridOptions { contrast: number; invert: boolean; charCount: number; weightSteps: number; sizeMin: number; sizeMax: number; jitter: number; random?: () => number }`
  - `interface GridSample extends GridMetrics { positions: Float32Array; sizes: Float32Array; glyphs: Float32Array; brights: Float32Array; count: number }`
  - `sampleImageToGrid(pixels: ImageLike, opts: SampleOptions): GridSample`

`charCount` 是 `sortCharsByInk()` 的回傳長度（**含**前置空白），例如 8 個字元時是 9。

**`GLYPH_FONT_SCALE` 是這個 Task 新增的跨檔常數。** `sizes` 存的是 point sprite 的邊長，
不是字級；`buildGlyphAtlas` 把字烘在 `CELL × 0.78` 上，sprite 四周有 22% 空白。
故 `sizes = 字級 / 0.78`，否則 `sizeMax = 1.0` 畫出來只有格高的 78%。

宣告在 `symbol-sampler.ts`（無 DOM、測試碰得到），`symbol-atlas.ts` 反過來 import ——
`buildGlyphAtlas` 現在的 `CELL * 0.78` magic literal 一併換掉（本 Task Step 5）。
兩邊必須是同一個數，分開寫遲早不同步。

- [ ] **Step 0: 先修掉 Task 4 留下的過期常數**

`test/symbol-sampler.spec.ts` 用 `1024×1470` 當 face.png 的尺寸，實測是 `1013×1478`；
且 `base` 裡的 `cols: 130` 已不是預設值（改 85）。這些不影響 `computeGrid` 的正確性，
但測試名在說謊，會誤導後面的人。把該檔的 `computeGrid` 那一組改成：

```ts
const base = {
  cols: 85,
  charAspect: 0.65,
  fitWidth: 500,
  fitHeight: 500,
  worldScale: 1,
};

it('contain-fit：取寬高比較小的那一邊', () => {
  // 1013x1478 塞進 500x500：min(500/1013, 500/1478) = 500/1478
  const g = computeGrid(1013, 1478, base);
  expect(close(g.scale, 500 / 1478)).toBe(true);
});

it('face.png 在預設 cols 85 下是 85 欄 80 列', () => {
  const g = computeGrid(1013, 1478, base);
  expect(g.cols).toBe(85);
  expect(g.rows).toBe(80);
});

it('cols 130 時是 130 欄 123 列', () => {
  const g = computeGrid(1013, 1478, { ...base, cols: 130 });
  expect(g.rows).toBe(123);
});
```

該檔其餘用到 `computeGrid(1024, 1470, ...)` 的案例，一律把引數改成 `1013, 1478`
（`halfW` 那一條的期望值 `(1024 * (500 / 1470)) / 2` 同步改成 `(1013 * (500 / 1478)) / 2`）。

Run: `pnpm vitest run test/symbol-sampler.spec.ts` → 應全綠。

- [ ] **Step 1: 寫失敗的測試**

先把 `test/symbol-sampler.spec.ts` 檔頭的 import 換成：

```ts
import {
  GLYPH_FONT_SCALE,
  computeGrid,
  sampleImageToGrid,
  toneMap,
  type ImageLike,
} from '../app/utils/symbol-sampler';
```

再在檔尾加：

```ts
/** 產生單色不透明的測試圖：lum 0..1、alpha 0..1 */
const solidImage = (
  width: number,
  height: number,
  lum: number,
  alpha = 1,
): ImageLike => {
  const v = Math.round(lum * 255);
  const a = Math.round(alpha * 255);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = a;
  }
  return { data, width, height };
};

const sampleOpts = {
  cols: 20,
  charAspect: 1,
  fitWidth: 20,
  fitHeight: 20,
  worldScale: 1,
  contrast: 1,
  invert: false,
  charCount: 9, // 空白 + 8 個字元
  weightSteps: 5,
  sizeMin: 0.43,
  sizeMax: 1,
  jitter: 0,
};

describe('sampleImageToGrid', () => {
  it('全白不透明 → 每格都產生粒子', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(s.cols).toBe(20);
    expect(s.rows).toBe(20);
    expect(s.count).toBe(400);
  });

  it('全黑 → 落在空白階，一顆都不產生', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 0), sampleOpts);
    expect(s.count).toBe(0);
    expect(s.positions.length).toBe(0);
  });

  it('alpha < 0.5 的區域被遮罩剔除（去背輪廓外）', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1, 0.2), sampleOpts);
    expect(s.count).toBe(0);
  });

  it('invert 讓全黑變成全亮，每格都產生', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 0), {
      ...sampleOpts,
      invert: true,
    });
    expect(s.count).toBe(400);
  });

  it('最亮時取最後一個字元階與最高字重階', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    // charIdx = 8（charCount-1），weightIdx = 4（weightSteps-1）
    // glyph = (8-1)*5 + 4 = 39
    expect(s.glyphs[0]).toBe(39);
  });

  it('亮度寫進 brights，供 shader 取漸層色', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(s.brights[0]).toBeCloseTo(1);
  });

  it('字級是格高乘上 sizeMin..sizeMax 的插值，再除掉 atlas 留白（world 單位）', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    // b=1 → sizeMax=1 → 字級 = cellH；sizes 存的是 sprite 邊長 → 再 / 0.78
    expect(s.sizes[0]).toBeCloseTo(s.cellH / GLYPH_FONT_SCALE);
  });

  it('sizes 是 sprite 邊長，恆大於對應字級', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(GLYPH_FONT_SCALE).toBeLessThan(1);
    expect(s.sizes[0]).toBeGreaterThan(s.cellH);
  });

  it('jitter=0 時座標落在格中心，完全規則', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    // 第 0 格：col 0 row 0
    expect(s.positions[0]).toBeCloseTo(0.5 * s.cellW - s.halfW);
    expect(s.positions[1]).toBeCloseTo(s.halfH - 0.5 * s.cellH);
    expect(s.positions[2]).toBe(0);
  });

  it('jitter>0 時以注入的 random 位移，可重現', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), {
      ...sampleOpts,
      jitter: 0.5,
      random: () => 1, // (1-0.5)=0.5 → 位移 +0.5 * cell * jitter
    });
    const centerX = 0.5 * s.cellW - s.halfW;
    expect(s.positions[0]).toBeCloseTo(centerX + 0.5 * s.cellW * 0.5);
    expect(s.positions[2]).toBeCloseTo(0.5 * s.cellH * 0.5);
  });

  it('回傳的 typed array 長度與 count 相符', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), sampleOpts);
    expect(s.positions.length).toBe(s.count * 3);
    expect(s.sizes.length).toBe(s.count);
    expect(s.glyphs.length).toBe(s.count);
    expect(s.brights.length).toBe(s.count);
  });

  it('weightSteps=1 時所有粒子的 weightIdx 都是 0', () => {
    const s = sampleImageToGrid(solidImage(20, 20, 1), {
      ...sampleOpts,
      weightSteps: 1,
    });
    // charIdx=8 → glyph = (8-1)*1 + 0 = 7
    expect(s.glyphs[0]).toBe(7);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `pnpm vitest run test/symbol-sampler.spec.ts`
Expected: FAIL — `sampleImageToGrid is not a function`

- [ ] **Step 3: 寫最小實作**

在 `app/utils/symbol-sampler.ts` 檔尾加：

```ts
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
```

註：`glyphs.push((charIdx - 1) * weightSteps + weightIdx)` 與 `symbol-atlas.ts` 的
`glyphIndex()` 是同一條公式。這裡不 import 它，因為 `symbol-atlas.ts` 有 THREE 相依，
而本檔要維持零相依；兩處若要改公式必須同時改，已在此註記。

- [ ] **Step 4: 跑測試確認通過**

Run: `pnpm vitest run test/symbol-sampler.spec.ts`
Expected: PASS，全部 28 個測試綠

- [ ] **Step 5: 讓 symbol-atlas.ts 改用同一個常數**

`app/utils/symbol-atlas.ts` 目前把 0.78 寫死在 `buildGlyphAtlas()` 裡。把 import 補上：

```ts
import { GLYPH_FONT_SCALE } from './symbol-sampler';
```

再把烘字那行（約 140 行）改成：

```ts
      ctx.font = `${w} ${CELL * GLYPH_FONT_SCALE}px "Courier New", monospace`;
```

相依方向是 `symbol-atlas` → `symbol-sampler`（有 THREE 的 import 沒 THREE 的），
不會把 THREE 拉進 `symbol-sampler.spec.ts`。

- [ ] **Step 6: 跑全部測試，確認沒把 atlas 的測試弄壞**

Run: `pnpm test`
Expected: PASS（`symbol-atlas.spec.ts` 只測純函式，不碰 `buildGlyphAtlas`，應不受影響）

- [ ] **Step 7: Commit**

```bash
git add app/utils/symbol-sampler.ts app/utils/symbol-atlas.ts test/symbol-sampler.spec.ts
git commit -m "feat(symbol): 加入網格化取樣，字元/字重/字級依亮度對應"
```

---

### Task 6: sampleImageToGridWithLimit — 粒子數超標時自動降 cols

**Files:**
- Modify: `app/utils/symbol-sampler.ts`
- Test: `test/symbol-sampler.spec.ts`

**Interfaces:**
- Consumes: Task 5 的 `sampleImageToGrid` / `SampleOptions` / `GridSample`
- Produces: `sampleImageToGridWithLimit(pixels: ImageLike, opts: SampleOptions, maxParticles: number): GridSample`

spec § 6 要求超標時**不再隨機抽樣**（會破壞矩陣完整性），改為遞減 `cols` 重新取樣。

- [ ] **Step 1: 寫失敗的測試**

把 `test/symbol-sampler.spec.ts` 檔頭 import 的 `sampleImageToGrid,` 下一行補上
`sampleImageToGridWithLimit,`，再於檔尾加：

```ts
describe('sampleImageToGridWithLimit', () => {
  it('沒超標時直接回傳，cols 不變', () => {
    const s = sampleImageToGridWithLimit(solidImage(20, 20, 1), sampleOpts, 10000);
    expect(s.cols).toBe(20);
    expect(s.count).toBe(400);
  });

  it('超標時遞減 cols 直到符合上限', () => {
    const s = sampleImageToGridWithLimit(
      solidImage(200, 200, 1),
      { ...sampleOpts, cols: 200, fitWidth: 200, fitHeight: 200 },
      2000,
    );
    expect(s.count).toBeLessThanOrEqual(2000);
    expect(s.cols).toBeLessThan(200);
  });

  it('降到下限 20 仍超標時就停手，不無限迴圈', () => {
    const s = sampleImageToGridWithLimit(solidImage(20, 20, 1), sampleOpts, 1);
    expect(s.cols).toBe(20);
    expect(s.count).toBeGreaterThan(1);
  });

  it('回傳的 typed array 與最終 cols 相符', () => {
    const s = sampleImageToGridWithLimit(
      solidImage(200, 200, 1),
      { ...sampleOpts, cols: 200, fitWidth: 200, fitHeight: 200 },
      2000,
    );
    expect(s.positions.length).toBe(s.count * 3);
    expect(s.count).toBe(s.cols * s.rows);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `pnpm vitest run test/symbol-sampler.spec.ts`
Expected: FAIL — `sampleImageToGridWithLimit is not a function`

- [ ] **Step 3: 寫最小實作**

在 `app/utils/symbol-sampler.ts` 檔尾加：

```ts
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
```

- [ ] **Step 4: 跑測試確認通過**

Run: `pnpm test`
Expected: PASS — 三個測試檔全綠

- [ ] **Step 5: Commit**

```bash
git add app/utils/symbol-sampler.ts test/symbol-sampler.spec.ts
git commit -m "feat(symbol): 粒子數超標時遞減 cols 而非隨機抽樣淘汰"
```

---

### Task 7: SymbolFace.vue 改用新 utils（props / 取樣 / shader）

這是唯一不可再分的大任務：props、取樣、shader 三者互相依賴，中間態無法運作。

**Files:**
- Modify: `app/components/01a.symbol/SymbolFace.vue`

**Interfaces:**
- Consumes: `sortCharsByInk` / `buildGlyphAtlas` / `buildColorRamp` / `buildWeightLadder`（`~/utils/symbol-atlas`）、`sampleImageToGridWithLimit`（`~/utils/symbol-sampler`）
- Produces: `<SymbolFace>` 的新 props 介面（Task 9 的 Hero.vue / demo.vue 依此傳值）

- [ ] **Step 1: 換掉 import 與工具函式**

在 `<script setup lang="ts">` 的 import 區塊，`import portraitUrl` 之後加：

```ts
import {
  buildColorRamp,
  buildGlyphAtlas,
  buildWeightLadder,
  sortCharsByInk,
  type GlyphAtlas,
} from '~/utils/symbol-atlas';
import { sampleImageToGridWithLimit } from '~/utils/symbol-sampler';
```

然後刪掉檔案中的 `makeGlyphAtlas` 與 `makeColorRamp` 兩個函式定義（原第 484–531 行區塊）—— 它們已被 utils 取代。

- [ ] **Step 2: 改 props**

刪除這四個 props：`sampleStep`、`minDensity`、`densityGamma`、`darkBoost`。

把 `sizeMin` / `sizeMax` / `maxParticles` 改成：

```ts
  /** 暗部字級佔格高的比例（0..1） */
  sizeMin: { type: Number, default: 0.43 },
  /** 亮部字級佔格高的比例；1.0 ＝ 字級等於格高（墨水寬 ≈ 0.92 × cellW，同 gemini），
   *  超過約 1.08 開始橫向重疊成塊 */
  sizeMax: { type: Number, default: 1.0 },
  /** 粒子數上限；超過時自動遞減 cols 重新取樣（不隨機淘汰，那會打壞矩陣） */
  maxParticles: { type: Number, default: 24000 },
```

在 `worldScale` 之後插入新 props：

```ts
  /** 橫向格數＝疏密主控，clamp 到 20..400。
   *  85 而非 gemini 的 130：滿版一屏放不下 130 欄的可辨識字級（見 spec § 2 的對照表） */
  cols: { type: Number, default: 85 },
  /** monospace 寬高比：cellH = cellW / charAspect。0.65 取自 gemini 的 baseFontSize × 0.65 */
  charAspect: { type: Number, default: 0.65 },
  /** 對比：繞中灰 0.5 放大明暗差（取代舊的 darkBoost 乘法增益） */
  contrast: { type: Number, default: 1.2 },
  /** 負片：反轉明暗，決定人臉是「光雕」還是「陰影雕」 */
  invert: { type: Boolean, default: false },
  /** 字重階數；1 ＝ 單一字重 */
  weightSteps: { type: Number, default: 5 },
  /** 暗部字重 */
  weightMin: { type: Number, default: 100 },
  /** 亮部字重 */
  weightMax: { type: Number, default: 900 },
  /** 漸層色標位置（0..1），長度需與 color 相同；空陣列＝等距 */
  colorStops: { type: Array as () => number[], default: () => [] },
  /** glitch 跳色：依 fps 隨機把少量粒子染色（取代舊的隨機換字），最多 4 組 */
  glitchItems: {
    type: Array as () => { color: string; density: number; fps: number }[],
    default: () => [],
  },
  /** 格點隨機位移比例；0 ＝ 全規則格點 */
  jitter: { type: Number, default: 0 },
  /** 透明度明滅幅度（原本寫死 0.18） */
  twinkleAmp: { type: Number, default: 0.06 },
  /** 字級呼吸幅度（原本寫死 0.12） */
  breathAmp: { type: Number, default: 0.06 },
```

- [ ] **Step 3: 改 CONFIG_SCHEMA**

在「圖像 / 採樣」群組內，刪掉 `sampleStep` / `minDensity` / `densityGamma` / `darkBoost` 四筆，
改成（放在 `worldScale` 之後、`sizeMin` 之前）：

```ts
  { key: 'cols', label: '格數(疏密)', kind: 'num', step: 5, group: '圖像 / 採樣' },
  { key: 'charAspect', label: '字寬高比', kind: 'num', step: 0.05, group: '圖像 / 採樣' },
  { key: 'contrast', label: '對比', kind: 'num', step: 0.1, group: '圖像 / 採樣' },
  { key: 'invert', label: '負片', kind: 'bool', group: '圖像 / 採樣' },
  { key: 'jitter', label: '格點抖動', kind: 'num', step: 0.05, group: '圖像 / 採樣' },
```

把 `sizeMin` / `sizeMax` 兩筆的 label 與 step 改成：

```ts
  { key: 'sizeMin', label: '字級 min(格高比)', kind: 'num', step: 0.01, group: '圖像 / 採樣' },
  { key: 'sizeMax', label: '字級 max(格高比)', kind: 'num', step: 0.01, group: '圖像 / 採樣' },
```

在 `color` 之後插入：

```ts
  { key: 'colorStops', label: '色標位置(逗號)', kind: 'csvNum', group: '圖像 / 採樣' },
  { key: 'weightSteps', label: '字重階數', kind: 'num', step: 1, group: '圖像 / 採樣' },
  { key: 'weightMin', label: '字重 min', kind: 'num', step: 100, group: '圖像 / 採樣' },
  { key: 'weightMax', label: '字重 max', kind: 'num', step: 100, group: '圖像 / 採樣' },
```

在「場景 / 節奏」群組結尾（`disperseSpread` 之後）插入：

```ts
  { key: 'twinkleAmp', label: '明滅幅度', kind: 'num', step: 0.01, group: '場景 / 節奏' },
  { key: 'breathAmp', label: '呼吸幅度', kind: 'num', step: 0.01, group: '場景 / 節奏' },
```

`glitchItems` 這一輪先不進面板（Task 8 才加 JSON 欄位），但 `cfg.glitchItems` 仍要能從 props 讀到 —— 因為 `cfg` 是照 `CONFIG_SCHEMA` 迴圈初始化的，不在 schema 裡就不會被填。在 `for (const f of CONFIG_SCHEMA)` 迴圈之後補一行：

```ts
// glitchItems 是物件陣列，Task 8 才進面板；先直接從 props 帶進 cfg。
cfg.glitchItems = props.glitchItems;
```

- [ ] **Step 4: 加入 world → 螢幕像素的換算**

在 `onMounted` 內、`camera` 建立之後加：

```ts
  // world → 螢幕 px 的換算：gl_PointSize 原本用寫死的 300/-mv.z，導致「字級是螢幕 px、
  // 格距是 world」兩套單位 —— 墨水/格距的填充率會隨視窗高度在 58%(1440px) 到
  // 105%(800px) 之間漂移，調不出一組能定案的值。改成 aSize 直接是 world 單位，
  // 這裡算轉換係數，resize 時一併更新 uWorldToPx。
  const worldToPx = () =>
    wrap.clientHeight /
    (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360));
```

- [ ] **Step 5: 改寫 buildFromImage**

把 `buildFromImage` 開頭到 `geom.setAttribute('aSeed', ...)` 之間的內容（原第 599–718 行）整段替換成：

```ts
  // sortedChars 由 buildParticles 算好（atlas 與取樣要用同一份）
  let sortedChars: string[] = [];

  // ---------- 圖片亮度採樣：網格化，亮部大/粗/淺色 ----------
  const buildFromImage = (img: HTMLImageElement) => {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx2d = c.getContext('2d')!;
    ctx2d.drawImage(img, 0, 0);
    const imageData = ctx2d.getImageData(0, 0, W, H);

    const sample = sampleImageToGridWithLimit(
      { data: imageData.data, width: W, height: H },
      {
        cols: cfg.cols,
        charAspect: cfg.charAspect,
        fitWidth: cfg.fitWidth,
        fitHeight: cfg.fitHeight,
        worldScale: cfg.worldScale,
        contrast: cfg.contrast,
        invert: cfg.invert,
        charCount: sortedChars.length,
        weightSteps: cfg.weightSteps,
        sizeMin: cfg.sizeMin,
        sizeMax: cfg.sizeMax,
        jitter: cfg.jitter,
      },
      cfg.maxParticles,
    );

    const count = sample.count;
    if (count === 0) {
      console.warn('[SymbolFace] 取樣結果為 0 顆粒子，請檢查 contrast / invert / 圖片 alpha');
      return;
    }
    if (count > cfg.maxParticles) {
      console.warn(
        `[SymbolFace] 粒子數 ${count} 已達 cols 下限仍超過上限 ${cfg.maxParticles}`,
      );
    }
    gridStats.value = { cols: sample.cols, rows: sample.rows, count };

    // 人像置中於原點；自動游標在 ~70% 內遊走
    halfW = sample.halfW;
    halfH = sample.halfH;
    roamX = halfW * 0.7;
    roamY = halfH * 0.7;

    const target = sample.positions;
    const start = new Float32Array(count * 3);
    const floatPos = new Float32Array(count * 3);
    const order = new Float32Array(count);
    const seed = new Float32Array(count);

    const FLOAT_X = cfg.disperseSpread[0] ?? 900;
    const FLOAT_Y = cfg.disperseSpread[1] ?? 520;
    const FLOAT_Z = cfg.disperseSpread[2] ?? 240;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ang = Math.random() * Math.PI * 2;
      const r = 80 + Math.random() * 120;
      start[i3] = target[i3]! + Math.cos(ang) * r;
      start[i3 + 1] = target[i3 + 1]! + Math.sin(ang) * r;
      start[i3 + 2] = target[i3 + 2]!;
      floatPos[i3] = (Math.random() - 0.5) * FLOAT_X;
      floatPos[i3 + 1] = (Math.random() - 0.5) * FLOAT_Y;
      floatPos[i3 + 2] = (Math.random() - 0.5) * FLOAT_Z;
      order[i] = Math.random() * 0.85;
      seed[i] = Math.random();
    }

    geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(start.slice(), 3));
    geom.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
    geom.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geom.setAttribute('aFloat', new THREE.BufferAttribute(floatPos, 3));
    geom.setAttribute('aOrder', new THREE.BufferAttribute(order, 1));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sample.sizes, 1));
    geom.setAttribute('aBright', new THREE.BufferAttribute(sample.brights, 1));
    geom.setAttribute('aGlyph', new THREE.BufferAttribute(sample.glyphs, 1));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
```

其後「慣性物理：附加位移 aDisp」那段保持不變（`dispArr = new Float32Array(count * 3)` 起）。

- [ ] **Step 6: 加入 gridStats ref**

在 `<script setup>` 的 `const panelOpen = ref(true);` 附近加：

```ts
// dev 面板的唯讀資訊：實際採用的格數與粒子數（cols 可能因 maxParticles 被降過）
const gridStats = ref({ cols: 0, rows: 0, count: 0 });
```

- [ ] **Step 7: 改 uniforms**

把 `mat = new THREE.ShaderMaterial({ ... uniforms: { ... } })` 的 uniforms 區塊改成：

```ts
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uDisperse: { value: 0 },
        uConverge: { value: 0 },
        uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
        uMouseInfluence: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uWorldToPx: { value: worldToPx() },
        uCamZ: { value: camera.position.z },
        uFloatAmp: { value: cfg.floatAmp },
        uFloatMicro: { value: cfg.floatMicro },
        uFloatSpeed: { value: cfg.floatSpeed },
        uTwinkleAmp: { value: cfg.twinkleAmp },
        uBreathAmp: { value: cfg.breathAmp },
        uHoleRadius: { value: cfg.holeRadius },
        uHoleSpread: { value: cfg.holeSpread },
        uGroupShift: { value: cfg.groupShift },
        uGroupNear: { value: cfg.groupShiftNear },
        uGroupFar: { value: cfg.groupShiftFar },
        uAtlas: { value: atlas!.texture },
        uAtlasGrid: { value: new THREE.Vector2(atlas!.cols, atlas!.rows) },
        uColorRamp: { value: colorRamp },
        uColorRandom: { value: cfg.colorMode === 'random' ? 1 : 0 },
        uGlitchCount: { value: glitchCount },
        uGlitchColor: { value: glitchColors },
        uGlitchDensity: { value: glitchDensity },
        uGlitchFps: { value: glitchFps },
      },
```

並在 `mat = new THREE.ShaderMaterial({` 之前準備 glitch uniform 資料：

```ts
    // glitch 跳色：GLSL ES 1.0 的陣列 uniform 必須是固定長度，故一律備 4 組，
    // 未使用的以 uGlitchCount 擋掉（density 0 也不會命中）。
    const items = (cfg.glitchItems ?? []).slice(0, 4);
    if ((cfg.glitchItems ?? []).length > 4) {
      console.warn('[SymbolFace] glitchItems 最多 4 組，其餘已忽略');
    }
    const glitchCount = items.length;
    const glitchColors = Array.from(
      { length: 4 },
      (_, i) => new THREE.Color(items[i]?.color ?? '#000000'),
    );
    const glitchDensity = Array.from(
      { length: 4 },
      (_, i) => (items[i]?.density ?? 0) / 100,
    );
    const glitchFps = Array.from({ length: 4 }, (_, i) => items[i]?.fps ?? 0);
```

`density` 除以 100 是因為 gemini 的 density 單位是百分比（1–30）。

- [ ] **Step 8: 改 vertex shader**

把 `vertexShader` 的 attribute / uniform / varying 宣告區改成：

```glsl
        attribute vec3 aStart;
        attribute vec3 aTarget;
        attribute vec3 aFloat;
        attribute vec3 aDisp;
        attribute float aOrder;
        attribute float aSize;
        attribute float aGlyph;
        attribute float aSeed;
        attribute float aBright;
        uniform float uProgress;
        uniform float uTime;
        uniform float uDisperse;
        uniform float uConverge;
        uniform vec3 uMouse;
        uniform float uMouseInfluence;
        uniform float uPixelRatio;
        uniform float uWorldToPx;
        uniform float uCamZ;
        uniform float uFloatAmp;
        uniform float uFloatMicro;
        uniform float uFloatSpeed;
        uniform float uTwinkleAmp;
        uniform float uBreathAmp;
        uniform float uHoleRadius;
        uniform float uHoleSpread;
        uniform float uGroupShift;
        uniform float uGroupNear;
        uniform float uGroupFar;
        uniform float uColorRandom;
        uniform int uGlitchCount;
        uniform vec3 uGlitchColor[4];
        uniform float uGlitchDensity[4];
        uniform float uGlitchFps[4];
        varying float vAlpha;
        varying float vGlyph;
        varying float vT;
        varying vec3 vGlitchColor;
        varying float vGlitchOn;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }
```

（`uGlyphCount` 與 `vShade` 兩個宣告一併刪除。）

把「隨機換字閃爍」整段（`float tick = floor(uTime * 3.0);` 到 `vGlyph = ...` 那三行）替換成：

```glsl
          // 字元固定不變：glyph 由亮度決定（ink ramp），換字會直接打壞圖像。
          // 動態感改由下方 glitch 跳色提供（同 gemini-code 的做法）。
          vGlyph = aGlyph;

          // glitch 跳色：每組各自的 fps 決定換幀速率，density 決定命中比例。
          // GLSL ES 1.0 迴圈上界必須是常數，故固定 4 次搭配 break。
          vGlitchColor = vec3(0.0);
          vGlitchOn = 0.0;
          for (int i = 0; i < 4; i++) {
            if (i >= uGlitchCount) break;
            if (uGlitchFps[i] > 0.0 && uGlitchDensity[i] > 0.0) {
              float frame = floor(uTime * uGlitchFps[i]);
              float r = hash(aSeed * 127.1 + frame * 311.7 + float(i) * 57.3);
              if (r < uGlitchDensity[i]) {
                vGlitchColor = uGlitchColor[i];
                vGlitchOn = 1.0;
                break;
              }
            }
          }
```

把 twinkle / vAlpha / vT / vShade 那四行替換成：

```glsl
          float twinkle = (1.0 - uTwinkleAmp) + uTwinkleAmp * sin(uTime * 2.2 + aSeed * 40.0);
          // 不透明（gemini 邊緣銳利）；只保留 reveal(local) 與散場的淡入淡出
          vAlpha = local * twinkle * mix(1.0, 0.5, uDisperse);
          // 取色位置：tone=依亮度（亮→漸層右端＝高光色）/ random=每顆隨機
          vT = mix(aBright, hash(aSeed * 53.7), uColorRandom);
```

把最後三行的 gl_PointSize 區塊替換成：

```glsl
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float breath = 1.0 + uBreathAmp * sin(uTime * 2.0 + aSeed * 9.0);
          float size = aSize * mix(1.0, 0.65, uDisperse) * mix(1.0, 0.6, uConverge);
          // aSize 是 world 單位 → 乘 uWorldToPx 換成螢幕 px；(uCamZ/-mv.z) 保留透視深度差
          gl_PointSize = size * uWorldToPx * (uCamZ / -mv.z) * breath * local * uPixelRatio;
```

- [ ] **Step 9: 改 fragment shader**

整段替換成：

```glsl
        uniform sampler2D uAtlas;
        uniform vec2 uAtlasGrid;
        uniform sampler2D uColorRamp;
        varying float vAlpha;
        varying float vGlyph;
        varying float vT;
        varying vec3 vGlitchColor;
        varying float vGlitchOn;
        void main() {
          vec2 cell = vec2(mod(vGlyph, uAtlasGrid.x), floor(vGlyph / uAtlasGrid.x));
          vec2 uv = vec2(
            (cell.x + gl_PointCoord.x) / uAtlasGrid.x,
            1.0 - (cell.y + gl_PointCoord.y) / uAtlasGrid.y
          );
          float a = texture2D(uAtlas, uv).a * vAlpha;
          if (a < 0.02) discard;
          vec3 ramp = texture2D(uColorRamp, vec2(clamp(vT, 0.0, 1.0), 0.5)).rgb;
          vec3 col = mix(ramp, vGlitchColor, vGlitchOn);
          gl_FragColor = vec4(col, a);
        }
```

- [ ] **Step 10: 改 buildParticles**

把 `buildParticles` 內的 atlas / ramp 建立替換成：

```ts
  const buildParticles = () => {
    if (!loadedImg) return;
    if (points) scene.remove(points);
    geom?.dispose();
    mat?.dispose();
    atlas?.texture.dispose();
    colorRamp?.dispose();

    sortedChars = sortCharsByInk(cfg.chars);
    if (sortedChars.length === 0) {
      console.warn('[SymbolFace] chars 去重濾空白後為空，不建立粒子系統');
      points = null;
      return;
    }
    const weights = buildWeightLadder(cfg.weightSteps, cfg.weightMin, cfg.weightMax);
    atlas = buildGlyphAtlas(sortedChars.slice(1), weights);
    const stops =
      Array.isArray(cfg.colorStops) && cfg.colorStops.length
        ? cfg.colorStops
        : undefined;
    colorRamp = buildColorRamp(cfg.color, stops);
    revealStarted = false; // 讓 reveal 重跑（新材質 uProgress 從 0 起）
    buildFromImage(loadedImg);
  };
```

並把 `atlas` 的型別宣告從 `ReturnType<typeof makeGlyphAtlas> | null` 改成 `GlyphAtlas | null`。

- [ ] **Step 11: resize 時更新 uWorldToPx**

在 `onResize` 內、`renderer.setSize(w, h);` 之後加：

```ts
    // world 單位的字級要跟著視窗高度重算，否則縮放視窗時字與格距的比例會跑掉
    if (mat) mat.uniforms.uWorldToPx!.value = worldToPx();
```

- [ ] **Step 12: 驗證**

Run: `pnpm dev`，開 `/demo`

Expected:
- 人臉以規整矩陣呈現，亮部（額頭、鼻樑）是密集的大字／粗體／淺色，暗部（眼窩、兩頰）留空
- 字元之間不重疊
- 三態切換（集合／分散／匯聚）、滑鼠真空、彩蛋、漂浮都與舊版行為一致
- 縮放瀏覽器視窗，字與格距的比例維持不變
- Console 無錯誤、無 shader 編譯警告

Run: `pnpm test`
Expected: PASS — utils 的測試不受影響

- [ ] **Step 13: Commit**

```bash
git add app/components/01a.symbol/SymbolFace.vue
git commit -m "feat(symbol): SymbolFace 改為網格矩陣，字元依亮度取墨水階、字級改 world 單位"
```

---

### Task 8: dev 面板的 glitch JSON 欄位與唯讀統計列

**Files:**
- Modify: `app/components/01a.symbol/SymbolFace.vue`

**Interfaces:**
- Consumes: Task 7 的 `gridStats` ref 與 `cfg.glitchItems`
- Produces: 無（純 dev 工具）

- [ ] **Step 1: 加入 json kind 的轉換**

在 `toDraft` 加一行（`if (kind === 'csvNum' ...)` 之前）：

```ts
  if (kind === 'json') return JSON.stringify(val ?? [], null, 0);
```

在 `fromDraft` 加一行（同樣放最前面）：

```ts
  // parse 失敗直接 throw，由 applyRefresh 攔下並保留舊值
  if (kind === 'json') return JSON.parse(String(val));
```

- [ ] **Step 2: 把 glitchItems 加進 CONFIG_SCHEMA**

在「場景 / 節奏」群組的 `breathAmp` 之後加：

```ts
  {
    key: 'glitchItems',
    label: 'glitch(JSON)',
    kind: 'json',
    group: '場景 / 節奏',
  },
```

同時刪掉 Task 7 Step 3 補的那行 `cfg.glitchItems = props.glitchItems;` —— 現在它已經在 schema 裡，初始化迴圈會處理。

- [ ] **Step 3: applyRefresh 攔截 parse 失敗**

加一個錯誤訊息 ref（放在 `panelOpen` 附近）：

```ts
// 面板欄位轉型失敗的訊息（目前只有 glitch JSON 會發生），顯示在 footer
const cfgError = ref('');
```

把 `applyRefresh` 整個換成：

```ts
const applyRefresh = () => {
  cfgError.value = '';
  const next: Record<string, any> = {};
  for (const f of CONFIG_SCHEMA) {
    try {
      next[f.key] = fromDraft(draft[f.key], f.kind);
    } catch {
      // 該欄位保留舊值，其餘照常套用
      cfgError.value = `${f.label} 格式錯誤，已保留原值`;
      next[f.key] = cfg[f.key];
    }
  }
  Object.assign(cfg, next);
  rebuildParticles?.();
};
```

`exportConfig` 同樣要防 throw，把它的迴圈改成：

```ts
  for (const f of CONFIG_SCHEMA) {
    try {
      snapshot[f.key] = fromDraft(draft[f.key], f.kind);
    } catch {
      snapshot[f.key] = cfg[f.key];
    }
  }
```

- [ ] **Step 4: 面板加統計列與錯誤訊息**

在 `<div class="cfg__footer">` 內、`<div class="cfg__modes">` 之前插入：

```vue
          <div class="cfg__stats">
            {{ gridStats.cols }} × {{ gridStats.rows }} 格 ／
            {{ gridStats.count.toLocaleString() }} 顆
          </div>
          <div v-if="cfgError" class="cfg__error">{{ cfgError }}</div>
```

- [ ] **Step 5: 加樣式**

在 `<style scoped>` 的 `.cfg__footer` 之後加：

```css
.cfg__stats {
  font-size: 12px;
  color: #7fd0ff;
  letter-spacing: 0.04em;
}

.cfg__error {
  font-size: 12px;
  color: #ff9a9a;
}
```

- [ ] **Step 6: 驗證**

Run: `pnpm dev`，開 `/demo`

Expected:
- dev 面板底部顯示「85 × 80 格 ／ 5,xxx 顆」之類的統計
- glitch(JSON) 欄位填入 `[{"color":"#ff0055","density":3,"fps":12}]` 後按 Refresh，畫面出現少量粉紅色跳動字元
- 把該欄位改成 `[{bad json` 後按 Refresh，面板顯示「glitch(JSON) 格式錯誤，已保留原值」，其餘設定照常套用、畫面不崩
- Export JSON 內含所有新欄位

- [ ] **Step 7: Commit**

```bash
git add app/components/01a.symbol/SymbolFace.vue
git commit -m "feat(symbol): dev 面板加 glitch JSON 欄位與格數/粒子數統計"
```

---

### Task 9: Hero.vue / demo.vue props 同步與截圖比對

**Files:**
- Modify: `app/components/01.hero/Hero.vue:208-232`
- Modify: `app/pages/demo.vue`

**Interfaces:**
- Consumes: Task 7 的新 props 介面
- Produces: 無

- [ ] **Step 1: 改 demo.vue 的新版 props**

⚠️ demo.vue 已在 `3d3e32c`（props-only 方向驗證）改過一輪，現況與本計畫初稿不同。
`<SymbolFace v-if="symbolVersion === 'matrix'" ... />` 目前是：

```
        :chars="['0'…'F']"     ← 保留
        :color="[…4 色…]"       ← 保留
        :sample-step="4"        ← 刪（prop 已不存在）
        :min-density="1"        ← 刪
        :dark-boost="1"         ← 刪
        :density-gamma="1"      ← 刪
        :size-min="31"          ← 改（語意從螢幕 px 變成格高比）
        :size-max="13"          ← 改（同上，且不再需要 min>max 的翻轉技巧）
        :max-particles="14000"  ← 改
```

刪掉前四個，把後三個連同新 props 換成：

```
        :cols="85"
        :char-aspect="0.65"
        :contrast="1.2"
        :invert="false"
        :size-min="0.43"
        :size-max="1.0"
        :weight-steps="5"
        :weight-min="100"
        :weight-max="900"
        :color-stops="[0, 0.4, 0.75, 1]"
        :max-particles="24000"
```

`:chars` 與 `:color` 維持不動 —— Step 0 已把它們調成 gemini 的值。
`:size-min` / `:size-max` 這裡回到正常的 min < max：Step 0 之所以要傳 `31 / 13`
（min > max）是因為舊公式 `sizeMin + (sizeMax-sizeMin) × dark` 是暗驅動，
只能靠倒傳來翻方向；新的 `sampleImageToGrid` 已改成亮驅動，不需要這個技巧。

一併刪掉 demo.vue 裡那段以 `⚠️ Step 0：純 props 的「方向驗證」` 開頭的註解 ——
它列的六項限制此時全部已解決，留著會誤導。

`<LegacySymbolFaceScatter>` 那一段**完全不動**（它吃的是舊 props）。

- [ ] **Step 2: 改 Hero.vue 的 props**

同樣把 `app/components/01.hero/Hero.vue` 內 `<SymbolFace>` 的
`:sample-step="5"`、`:size-min="16"`、`:size-max="32"`、`:min-density="0.7"`、
`:density-gamma="2.4"` 換成與 Step 1 相同的那一組，並確認沒有殘留 `:dark-boost`。

`bg-color="#000"` 必須保留 —— `app/utils/orange-core-config.ts` 的 `SYMBOL_TRANSITION.dark`
註明「深色目標必須等於 SymbolFace 的 bgColor，否則粒子場淡入時會有色階跳動」。

- [ ] **Step 3: 全域搜尋殘留的舊 props**

Run:

```bash
grep -rn "sample-step\|min-density\|density-gamma\|dark-boost\|sampleStep\|minDensity\|densityGamma\|darkBoost" app/
```

Expected: 只剩 `app/components/legacy/` 底下的命中（那是快照，本來就該有）。若 `app/components/01a.symbol/` 或 `app/pages/` 還有命中，補改掉。

- [ ] **Step 4: build 驗證**

Run: `pnpm build`
Expected: 成功，無 TypeScript 錯誤

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 首頁目視驗證**

Run: `pnpm dev`，開 `/`，捲到 hero → symbol 轉場段

Expected:
- 橘方塊展開時已可見粒子（`SYMBOL_TRANSITION.faceIn` 的行為不變）
- 人臉段呈現網格矩陣、亮部為主體
- 捲動經過 disperse → face → converge 三態，補間正常
- 捲回上一段再往下，行為一致

- [ ] **Step 6: 截圖比對**

用 Playwright MCP：

1. `browser_navigate` 到 `http://localhost:3000/demo`
2. `browser_resize` 到 1920×1080
3. `browser_take_screenshot` 存新版
4. 另開 `file://` 載入 `gemini-code-1785912047417.html`，上傳 `app/assets/img/face.png`，
   設 **cols 85**（不是它預設的 130）/ contrast 1.2 / 字重 100–900 / 字級 6–14 /
   色標 `#000000`,`#77c6e0`,`#d1f4ff`,`#ffffff` 位置 40%,75%
5. `browser_take_screenshot` 存 gemini 版
6. 目視比對：明暗分布方向、字元濃淡階梯、矩陣規整度

第 4 步的 cols 必須與我方一致，否則比到的是「每欄幾 px」的差異而非移植品質
（gemini 的 canvas 可捲動、我方是滿版一屏，同樣 130 欄下每欄寬度差近一倍）。

- [ ] **Step 6b: 視窗高度迴歸**

`browser_resize` 到 1920×800 與 1920×1440 各截一張，確認字與格距等比縮放、
填充率不變（這是 Step 4 `uWorldToPx` 的迴歸點；舊版在此會從 105% 漂到 58%）。

截圖存 `temp/`（依 CLAUDE.md 的輸出檔規則；目錄不存在先建立）。

差異若集中在整體亮度或對比，調 `contrast` 與 `colorStops` 即可，不需改程式。

- [ ] **Step 7: 舊版回歸驗證**

在 `/demo` 切到「舊版 散點」

Expected: 行為與 Task 1 當時完全一致（機率散點分布、隨機字元、暗部為主體、dev 面板可用）

- [ ] **Step 8: Commit**

```bash
git add app/components/01.hero/Hero.vue app/pages/demo.vue
git commit -m "feat(symbol): Hero 與 demo 同步新版 SymbolFace props"
```

---

## Self-Review

**Spec coverage**

| Spec 章節 | 對應 Task |
|---|---|
| § 1 檔案結構 | Task 1（legacy）、2–3（symbol-atlas）、4–6（symbol-sampler）、7（SymbolFace） |
| § 2 Props 變更 | Task 7 Step 2 |
| § 3 取樣管線 | Task 4 Step 3、Task 5 Step 3 |
| § 4 Atlas | Task 2 Step 3、Task 3 Step 2–4 |
| § 5 Shader 變更 | Task 7 Step 7–9、Step 11 |
| § 6 錯誤與邊界 | chars 為空 → Task 7 Step 10；cols clamp → Task 4 Step 3；不隨機抽樣改降 cols → Task 6；colorStops 長度不符 → Task 3 Step 4；glitchItems > 4 → Task 7 Step 7；weightSteps < 1 → Task 2 Step 3 |
| § 7 dev 面板 | Task 7 Step 3、Task 8 |
| § 8 舊版保留與 demo 對照 | Task 1、Task 9 Step 7 |
| § 9 驗證 | Task 9 Step 4–7（含 Step 6b 的視窗高度迴歸） |
| § 10 已知取捨 | `jitter` prop 於 Task 7 Step 2 定義、Task 5 實作；cols 85 的取捨見 Task 7 Step 2 註解 |

**未在計畫內的 spec 項目**：無。

**2026-08-06 修訂涵蓋**（見檔頭「已更正的推導」）：
`GLYPH_FONT_SCALE` → Task 5 Interfaces / Step 3 / Step 5；
`cols` 130 → 85 → Global Constraints、Task 7 Step 2、Task 8、Task 9 Step 1 / Step 6；
`face.png` 尺寸與 Task 4 過期測試 → Task 5 Step 0；
「1.66 倍必定重疊」的錯誤註解 → Task 7 Step 4。

**Placeholder 掃描**：無 TBD / TODO / 「類似 Task N」/ 無程式碼的程式步驟。

**型別一致性**：`GlyphAtlas`（Task 3 定義 → Task 7 Step 10 使用）、`ImageLike` / `GridMetrics` / `GridOptions`（Task 4 定義 → Task 5–6 延伸）、`SampleOptions` / `GridSample`（Task 5 定義 → Task 6 使用）、`gridStats`（Task 7 Step 6 定義 → Task 8 Step 4 使用）、`cfgError`（Task 8 Step 3 定義 → Step 4 使用）皆一致。glyph 索引公式在 `symbol-atlas.ts` 的 `glyphIndex()` 與 `symbol-sampler.ts` 內各有一份（後者為維持零相依），已於 Task 5 Step 3 註記需同步修改。
