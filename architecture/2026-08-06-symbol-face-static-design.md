# SymbolFace 靜態質感移植設計（對齊 gemini-code ASCII matrix）

日期：2026-08-06
相關檔案：`app/components/01a.symbol/SymbolFace.vue`、`gemini-code-1785912047417.html`
相關回饋：`architecture/LIU_FEEDBACK_3.md` — 「Face 1. 顏色深，文字大、顏色淺，文字深」

## 目標

設計師希望 `SymbolFace.vue` 的**靜態外觀**貼近 gemini-code 產出的 HTML（Canvas 2D ASCII matrix），
**動態效果與 3D 相關功能維持 SymbolFace 原本的邏輯**：

- reveal / disperse / converge 三態與 GSAP 補間
- IntersectionObserver 觸發、整體漂浮 sway + micro
- 滑鼠真空斥力、慣性物理（動量 + 指數 ease）、群體避讓、autoMouse
- 宮格彩蛋 + scramble 文字
- three.js 場景、resize、dispose

以上一律不動。

## 兩者差異摘要

### 根本架構

| 面向 | gemini HTML | SymbolFace.vue（現況） |
|---|---|---|
| 繪圖 | Canvas 2D，逐格 `ctx.fillText()` | WebGL / three.js `THREE.Points` + glyph sprite atlas |
| 字型 | `monospace`，每格重設 `font = "${weight} ${size}px"` | atlas 烘成 `bold 50px "Courier New"`，只有一種字重 |
| 遮罩 | 無，整張矩形鋪滿 | `alpha < 0.5` 剔除（人像去背）— 刻意保留 |
| 背景 | 用色標 1（c1）填滿畫布 | 獨立 `bgColor` |

### 排列與取樣

| 面向 | gemini HTML | SymbolFace.vue（現況） |
|---|---|---|
| 版面 | 嚴格網格 `cols × rows`，字元置中於固定 cell | 依 `sampleStep` 掃描原圖像素座標，另加 z ±4 隨機 |
| 疏密 | 每格必畫（映射到空白字元則不畫），由 `cols` / `spacing` 決定 | `minDensity + (1-minDensity)·dark^gamma` 機率丟點，再受 `maxParticles` 二次隨機抽樣 |
| 橫縱比 | `rows` 有做 `cellW/cellH` 校正（monospace 字比高窄） | 無，橫縱等距 |
| 數量級 | 130 cols × 123 rows ≈ 15,990 格（`face.png` 1013×1478，cell 比 0.65） | `maxParticles` 6,000（demo 10,000） |

### 字元映射（質感差距主因）

| 面向 | gemini HTML | SymbolFace.vue（現況） |
|---|---|---|
| 選字依據 | `getSortedChars()` 用離屏 canvas 量測每字非零 alpha 像素數，依墨水量排序，前面補空白 → 亮度直接對應墨水階 | `glyph[i] = floor(random() × chars.length)`，與亮度完全無關 |
| 暗部 | 映射到 `' '` → 不畫，留黑 | 暗部反而最密最大 |
| 換字閃爍 | 無（字元固定），動態感改由 glitch 跳色提供 | 每 1/3 秒 `h > 0.92` 隨機換字 |

### 字級 / 字重

| 面向 | gemini HTML | SymbolFace.vue（現況） |
|---|---|---|
| 字級 | `minS + (maxS-minS) × brightness` → 亮 → 大 | `sizeMin + (sizeMax-sizeMin) × dark` → 暗 → 大 |
| 字重 | `minW + (maxW-minW) × brightness`，量化成 100 階真 font-weight | 無 |
| 字級 vs 格距 | 解耦：cell 固定，字大只是塞滿格 | 耦合：`sampleStep` 決間距、`size` 獨立變 → 重疊 |

### 色彩與色調

| 面向 | gemini HTML | SymbolFace.vue（現況） |
|---|---|---|
| 漸層 | 4 色標 + 可調位置（pos2 40%、pos3 75%） | 1D ramp texture，色標等距、不可調位置 |
| 取色 | `brightness → 漸層` | `vT = 1 - aDark`（暗→左端）；demo 設定下暗部為白、亮部為深藍，與 HTML 相反 |
| 透明度 | 全不透明 | `vAlpha` 含 `mix(0.55, 1.0, aDark)` → 亮部半透明、邊緣發霧 |
| 額外明暗 | 無 | `vShade = mix(1.15, 0.6, aDark)` 再乘一層，與漸層互相打架 |
| 對比 | `((b/255-0.5) × contrast + 0.5)` 繞中灰的真對比 | `darkBoost` 乘法增益後 clamp，只會提亮暗部、壓縮高光 |
| 負片 | `isInverted` 開關 | 無 |
| 亮度公式 | 0.299 / 0.587 / 0.114 | 相同 |

## 已定案的決策

1. **映射方向照 gemini 原樣：亮 → 大 / 粗 / 淺色。**
   `face.png` 是中灰調 3D render（額頭鼻樑亮、眼窩兩頰暗），套此邏輯得到「光雕人臉」。
   註：`LIU_FEEDBACK_3.md` 字面寫「顏色深，文字大」與 gemini 實際邏輯相反，已確認以 gemini 為準。
2. **排列完全網格化。** 移除機率抽樣與 z 隨機抖動，暗部靠「空白字元階」自然留空。
3. **微動態處理**（四項全採）：
   - 隨機換字 → 改成 gemini 的 glitch 跳色（字元固定，依 fps 隨機把少量粒子染成 glitch 色）
   - 拿掉 `vShade` 額外明暗層
   - `vAlpha` 的靜態半透明改成不透明（reveal / disperse 的淡入淡出仍保留）
   - twinkle / breath 幅度降低但保留，並開成 prop
4. **實作範圍：全套一次到位**，取樣邏輯抽成獨立純函式模組。

## 移植時的三個技術關鍵

### ① 多字重 atlas

atlas cell 數 = `字元數 × 字重階數`。8 字 × 5 階 = 40 cells → 7×6 grid × 64px = 448×384 貼圖。
`aGlyph` 改成 `charIdx × weightSteps + weightIdx`，fragment shader 不需改動，只是 `uAtlasGrid` 變大。

### ② 字級與格距用兩套單位 → 填充率隨視窗高度漂移

> 2026-08-06 更正：本節原先判定「字比格距大 1.66 倍、必定重疊」，那是拿 point sprite
> 的外框在跟格距比，沒有計入 atlas 留白與墨水比。實測後現行值並未明顯超標，真正的缺陷
> 是比例會隨視窗高度漂移。以下為更正後的推導。

現行 `gl_PointSize = aSize × uPixelRatio × (300/-mv.z)`，camera z=600 → 螢幕 px ≈ `aSize × 0.5`。
fov 50°、z=600 下可視高度 = `2 × 600 × tan(25°)` ≈ 559.6 world units；視窗 1080px 時 1 world ≈ 1.93 px。
**位置**吃後者（隨視窗縮放），**字級**吃前者（寫死 0.5，不隨視窗變）—— 兩套單位。

`aSize` 是 point sprite 的邊長，不是字的墨水寬。sprite 內還有兩層縮減：
`buildGlyphAtlas` 把字烘在 `CELL × 0.78` 的字級上（22% 留白），
monospace digit 的墨水寬又只有字級的 ~0.6。故

```
墨水寬（螢幕 px） ≈ aSize × 0.5 × 0.78 × 0.6 = aSize × 0.234
格距（螢幕 px）   =  sampleStep × viewH / 559.6
```

以 demo 的 `sizeMax = 32` / `sampleStep = 5` 代入，墨水寬固定 7.5px，格距卻隨視窗高度變：

| 視窗高 | 格距 | 墨水 / 格距 |
|---|---|---|
| 800 | 7.15px | 105%（貼死、開始糊） |
| 1080 | 9.65px | 78%（尚可） |
| 1440 | 12.87px | 58%（過疏） |

無法定案的是這個 58%–105% 的漂移，不是絕對值。

**解法**：`aSize` 改成 world 單位，
`gl_PointSize = aSize × uWorldToPx × (uCamZ / -mv.z) × breath × local × uPixelRatio`，
其中 `uWorldToPx = viewH / (2 × uCamZ × tan(fov/2))`、`uCamZ = camera.position.z`。
兩者都不硬編 600 / 25°，一律由 camera 讀出，resize 時更新 `uWorldToPx`。
`z = 0` 的粒子 `-mv.z = uCamZ` → 透視項為 1；有 z 位移時仍保留遠近大小差。
字級與格距同單位 → 填充率固定、視窗縮放整體等比、透視深度感保留。

另需把上面那層 atlas 留白抵銷掉，見 § 3 的 `GLYPH_FONT_SCALE`。

### ③ 粒子數

`face.png` 實測 **1013×1478**（原記 1024×1470 有誤），alpha 覆蓋率 80%，
亮度平均 0.533、0.2–0.8 均勻分佈 —— 是中間調 3D render，不是暗調，
故 `contrast` 繞中灰做對比是對的做法。

`cols = 85`（取值理由見 § 2）、charAspect 0.65 → cellW 4.03 / cellH 6.20 world
→ rows = 80 → 6,800 格；扣掉去背外與空白階，實際約 4.5k–5.4k 顆。
若日後把 `cols` 拉回 130 則是 15,990 格、約 9k–12k 顆。
CPU 物理迴圈 O(n)，20k 顆約 0.8M flops/frame、attribute 上傳 240KB/frame，在預算內。
`maxParticles` 由 6,000 提高到 24,000 —— 對 cols 85 綽綽有餘，留的是設計師往上調 cols 的空間。

## 設計

### § 1. 檔案結構

| 檔案 | 動作 | 內容 |
|---|---|---|
| `app/utils/symbol-atlas.ts` | 新增 | `sortCharsByInk()` / `buildGlyphAtlas()` / `buildColorRamp()` |
| `app/utils/symbol-sampler.ts` | 新增 | `sampleImageToGrid()`：圖 → 粒子屬性陣列 |
| `app/components/legacy/SymbolFaceScatter.vue` | 新增 | 現行版本的**原封不動複製**（改寫前先備份）。見 § 8 |
| `app/components/01a.symbol/SymbolFace.vue` | 修改 | 移除上述邏輯、改 shader、改 props；約 1445 → 950 行 |
| `app/components/01.hero/Hero.vue` | 修改 | 同步 props |
| `app/pages/demo.vue` | 修改 | 同步 props，並加新舊版切換。見 § 8 |
| `test/symbol-atlas.spec.ts` | 新增 | vitest |
| `test/symbol-sampler.spec.ts` | 新增 | vitest |

放 `app/utils/` 而非 `app/composables/`：這兩個模組無 Vue runtime 相依，與 `orange-core-config.ts`
同類（該檔註解已載明此慣例）。

three.js 場景、物理積分、mode 三態、彩蛋、resize、dispose 全部原封不動。

### § 2. Props 變更

新增：

| prop | 預設 | 說明 |
|---|---|---|
| `cols` | `85` | 橫向格數 = 疏密主控。**刻意不取 gemini 的 130**，理由見下方 |
| `charAspect` | `0.65` | monospace 寬高比，`cellH = cellW / charAspect`（值取自 gemini 的 `baseFontSize × 0.65`） |
| `contrast` | `1.2` | `(b-0.5) × contrast + 0.5`，繞中灰的真對比 |
| `invert` | `false` | 負片 |
| `weightSteps` | `5` | 字重階數 |
| `weightMin` | `100` | 暗部字重 |
| `weightMax` | `900` | 亮部字重 |
| `colorStops` | `[]` | 與 `color` 同長度的 0..1 位置；空陣列＝等距 |
| `glitchItems` | `[]` | `{ color: string; density: number; fps: number }[]`，最多 4 組 |
| `twinkleAmp` | `0.06` | 原本寫死 0.18 |
| `breathAmp` | `0.06` | 原本寫死 0.12 |
| `jitter` | `0` | 格點隨機位移比例（0 = 全規則）。保留給「太平」時微調用 |

語意變更：

| prop | 舊 | 新 |
|---|---|---|
| `sizeMin` | `18`，螢幕 px，暗驅動 | `0.43`，**字級**佔格高比例，亮驅動 |
| `sizeMax` | `36`，螢幕 px，暗驅動 | `1.0`，**字級**佔格高比例，亮驅動。`1.0` ＝ 亮部字級等於格高（同 gemini 的 `maxSize = cellHeight`） |
| `maxParticles` | `6000` | `24000` |

移除：`sampleStep`、`minDensity`、`densityGamma`、`darkBoost`。
（機率抽樣消失；對比改由 `contrast` 負責。）

`sizeMin` / `sizeMax` 是**字級**對格高的比例，**不是 point sprite 邊長對格高的比例** ——
sprite 還要再除以 atlas 的 0.78 留白，換算見 § 3。
`sizeMax = 1.0` 時墨水寬 ≈ `0.6 × cellH = 0.92 × cellW`，與 gemini 一致；
超過約 `1.08` 開始橫向重疊成塊，等同 gemini 的負 `spacing`，故不另開 `spacing` prop。

**`cols` 為何取 85 而非 gemini 的 130**

gemini 的 canvas 是 1183px 寬、可捲動；我們是滿版 100vh 舞台。
`face.png` contain-fit 進 500×500 後 world 寬 342.7，視窗高 1080 時 = 661 螢幕 px。

| cols | cellW | 墨水寬 | 觀感 |
|---|---|---|---|
| 130 | 5.1px | 4.7px | 退化成彩色點陣，數字不可辨 |
| **85** | 7.8px | 7.2px | ≈ gemini 截圖的 7.5px/欄 |

「130 欄」與「gemini 那樣的字級」在滿版一屏上無法同時成立，必須二選一；85 是保字級那一邊。
已於 2026-08-06 的 props-only 驗證（commit `3d3e32c`）目視確認。
`cols` 是 dev 面板可調欄位，設計師若偏好更細的點陣質感可自行往上調。

### § 3. 取樣管線 `sampleImageToGrid()`

```
scale  = min(fitWidth/W, fitHeight/H) × worldScale     // contain-fit，維持原樣
cellW  = (W × scale) / cols
cellH  = cellW / charAspect                            // charAspect 0.65 → cellH > cellW
rows   = floor((H × scale) / cellH)
halfW  = (W × scale) / 2
halfH  = (H × scale) / 2

每格 (col, row)：
  取原圖對應矩形區域的平均 lum、平均 alpha            // 整區平均，同現行做法
  if alpha < 0.5              → skip                   // 去背遮罩，保留
  b = invert ? 1 - lum : lum
  b = clamp((b - 0.5) × contrast + 0.5, 0, 1)
  charIdx = floor(b × (sortedChars.length - 1))
  if charIdx === 0            → skip                   // 空白階＝暗部留空
  weightIdx = round(b × (weightSteps - 1))
  glyph     = (charIdx - 1) × weightSteps + weightIdx  // 空白不進 atlas，故 -1
  size      = cellH × (sizeMin + (sizeMax - sizeMin) × b) / GLYPH_FONT_SCALE  // world 單位
  pos       = ((col + 0.5) × cellW - halfW,
               halfH - (row + 0.5) × cellH,
               0)
  aBright   = b
```

**`GLYPH_FONT_SCALE` = 0.78 —— atlas 留白的抵銷項。**
`size` 最終會變成 `gl_PointSize`，也就是 point sprite 的邊長；
但 `buildGlyphAtlas` 是把字烘在 `CELL × 0.78` 的字級上，sprite 四周有 22% 是空的。
若不除掉這一項，`sizeMax = 1.0` 畫出來的字級只有格高的 0.78 倍，橫向留一大截空隙
（墨水寬只有 `0.72 × cellW`，而 gemini 是 `0.92 × cellW`）。

`0.78` 目前是 `buildGlyphAtlas()` 裡的 magic literal。實作時抽成
`export const GLYPH_FONT_SCALE = 0.78`，**宣告在 `symbol-sampler.ts`**（無 DOM／無 three.js，
測試碰得到），由 `symbol-atlas.ts` import 回去用 —— 兩邊必須是同一個數，
分開寫遲早會不同步。

換算檢查：`charAspect = 0.65`、`sizeMax = 1.0` →
sprite = `cellH / 0.78` = `cellW / 0.65 / 0.78` = `1.97 × cellW`。
與 props-only 驗證時實測「sprite ≈ 1.96 × 格距時墨水剛好填滿」吻合。

此處 `cols` 為「圖片內容」的橫向格數（`W × scale` 是 contain-fit 後圖片本身的 world 寬，
非 `fitWidth`），故換圖時格距不隨圖片比例跳動。

`jitter > 0` 時，`pos.x/y` 各加 `(random()-0.5) × cellW × jitter`、
`pos.z` 加 `(random()-0.5) × cellH × jitter`。預設 0 即全規則格點。

現行 `aDark` 屬性改名為 `aBright`，語意反轉。

### § 4. Atlas

`sortCharsByInk(chars)`：直接移植 gemini `getSortedChars()` —— 離屏 canvas 用
`900 16px monospace` 逐字繪製，數非零 alpha 像素數，由少到多排序，最前補 `' '`。
回傳含空白的完整排序陣列。

`buildGlyphAtlas(chars, weights)`：對 `chars`（不含空白）× `weights` 逐一烘 cell，
cell 邊長 64px，grid `cols = ceil(sqrt(n))`、`rows = ceil(n / cols)`。
預設 8 字 × 5 階 = 40 cells → 7×6 grid = 448×384。

`buildColorRamp(colors, stops)`：256×1 canvas。`stops` 長度與 `colors` 相同時依其
`addColorStop`，否則等距。單色時直接填滿。

### § 5. Shader 變更

| 位置 | 舊 | 新 |
|---|---|---|
| 字級 | `aSize × uPixelRatio × (300/-mv.z)` | `aSize × uWorldToPx × (uCamZ/-mv.z) × breath × local × uPixelRatio` |
| 取色 | `vT = mix(1.0 - aDark, hash(...), uColorRandom)` | `vT = mix(aBright, hash(...), uColorRandom)` |
| 額外明暗 | `vShade = mix(1.15, 0.6, aDark) × (...)` | 刪除；`gl_FragColor = vec4(col, a)` |
| 透明度 | `local × twinkle × mix(0.55,1.0,aDark) × mix(1.0,0.5,uDisperse)` | `local × twinkle × mix(1.0, 0.5, uDisperse)` |
| 換字閃爍 | `tick` / `hash` 換 glyph | 刪除，`vGlyph = aGlyph` |
| glitch | 無 | 新增：逐組 `hash(aSeed × 127.1 + floor(uTime × fps) × 311.7) < density` → 覆寫顏色，第一個命中即停（同 gemini 的 break） |
| twinkle | 寫死 `0.82 + 0.18 × sin(...)` | `(1.0 - uTwinkleAmp) + uTwinkleAmp × sin(...)` |
| breath | 寫死 `1.0 + 0.12 × sin(...)` | `1.0 + uBreathAmp × sin(...)` |

glitch 在 vertex shader 決定，以兩個 varying 傳給 fragment：
`vGlitchColor`（vec3）與 `vGlitchOn`（float，0 或 1）。fragment 端：

```glsl
vec3 ramp = texture2D(uColorRamp, vec2(clamp(vT, 0.0, 1.0), 0.5)).rgb;
vec3 col  = mix(ramp, vGlitchColor, vGlitchOn);
gl_FragColor = vec4(col, a);
```

新增 uniform：`uGlitchColor[4]`（vec3）、`uGlitchDensity[4]`、`uGlitchFps[4]`、
`uGlitchCount`（int，0 時整段跳過）、`uWorldToPx`、`uCamZ`、`uTwinkleAmp`、`uBreathAmp`。
`uColorRandom`、`uAtlas`、`uAtlasGrid`、`uColorRamp` 保留不變。
GLSL 迴圈上界須為常數，故固定 `for (int i = 0; i < 4; i++)` 搭配 `if (i >= uGlitchCount) break;`。

### § 6. 錯誤與邊界

- `chars` 去重、濾掉空白後若為空 → 不建立粒子系統並 `console.warn`（現行會產生空 atlas）
- `cols` clamp 到 `[20, 400]`
- 實際粒子數超過 `maxParticles` 時**不再隨機抽樣**（會破壞矩陣完整性），改為自動遞減 `cols`
  重新取樣直到符合，並在 dev panel 顯示實際採用的 cols 與粒子數
- `colorStops` 長度與 `color` 不符 → 忽略，退回等距
- `glitchItems` 超過 4 組 → 只取前 4 組並 `console.warn`
- `weightSteps < 1` → clamp 為 1（等同單一字重）

### § 7. dev 面板

`CONFIG_SCHEMA` 同步更新：

- 移除 `sampleStep` / `minDensity` / `densityGamma` / `darkBoost`
- 新增 `cols` / `charAspect` / `contrast` / `invert` / `weightSteps` / `weightMin` /
  `weightMax` / `colorStops` / `twinkleAmp` / `breathAmp` / `jitter`
- `sizeMin` / `sizeMax` 的 label 改為「字級 min（格高比）」「字級 max（格高比）」
- 新增唯讀資訊列：實際 cols、rows、粒子數
- `glitchItems` 因為是物件陣列，dev 面板以 JSON 文字欄位處理（`kind: 'json'`），
  parse 失敗時保留舊值並在欄位旁顯示錯誤

Export JSON 一併帶出新欄位。

### § 8. 舊版保留與 demo 對照

**備份**

改寫 `SymbolFace.vue` 之前，先把現行版本原封不動複製為
`app/components/legacy/SymbolFaceScatter.vue` → auto-import 名 `<LegacySymbolFaceScatter>`。

- 命名取其特徵（機率抽樣散點版），對照新版的網格矩陣。
- `legacy/` 下已有一份 `SymbolFace.vue`（更早的 einstein 原型，`<LegacySymbolFace>`，目前無人引用），
  **不動它**，故不會撞名。
- 複製品完全不改動（含 `CONFIG_SCHEMA` 與 dev 面板），可獨立運作、不依賴新的 utils 模組。
- 複製之後不再維護；新版的 props / shader 變更不同步回去。

**demo 頁對照**

`app/pages/demo.vue` 加一組切換鈕（固定於左上角、`z-index` 高於 dev 面板），
以 `v-if` 一次只掛載一個版本：

```
const symbolVersion = ref<'matrix' | 'scatter'>('matrix');

<SymbolFace v-if="symbolVersion === 'matrix'" ... />             // 新版：網格矩陣
<LegacySymbolFaceScatter v-else ... />                            // 舊版：機率散點
```

- 用 `v-if` 而非 `v-show`：兩者皆為 100vh 滿版 WebGL，同時掛載會有兩個 three.js
  場景與兩組 RAF（約 30k 粒子），低階機會掉幀。`v-if` 切換時舊元件的 `onBeforeUnmount`
  會 dispose 場景，資源乾淨釋放。
- 兩版各自的 dev 面板（`:dev="true"`）都保留，可各自調參後 Export JSON 比對。
- 舊版沿用它原本的 props 值（`sampleStep` / `minDensity` / `densityGamma` / `darkBoost` /
  `sizeMin` 16 / `sizeMax` 32），新版用新的一組。兩邊 props 不共用、不互相牽動。
- bundle 影響：`legacy/` 只會被 demo 頁引用，Nuxt 依頁面切 chunk，正式站
  `index.vue` 不引用 → 首頁 bundle 不受影響。

### § 9. 驗證

1. `pnpm test`
   - `sortCharsByInk`：已知字元集的排序結果、空輸入、全空白輸入、重複字元去重
   - `sampleImageToGrid`：格數計算、alpha 遮罩 skip、空白階 skip、`invert` / `contrast`
     的亮度變換、`maxParticles` 觸發降 cols、`jitter=0` 時座標完全規則
2. demo 頁 dev panel 逐項調參目視
3. Playwright 截圖比對：（cols 85 / contrast 1.2 / weight 100–900 /
   sizeMin 0.43 / sizeMax 1.0 / 四色標位置 0%,40%,75%,100%）對照 gemini HTML 的輸出。
   gemini 端要把 `cols` 也調到 85 才是同一個比較基準 —— 直接拿它預設的 130 欄截圖來比，
   比到的是「每欄幾 px」的差異，不是移植品質
4. 視窗高度 800 / 1080 / 1440 各截一張，確認墨水/格距填充率不再漂移（§ 移植關鍵 ② 的迴歸）
5. demo 頁切到舊版，確認 `<LegacySymbolFaceScatter>` 行為與改寫前完全一致
   （dev 面板、三態切換、物理手感、彩蛋）

### § 10. 已知取捨

- 格點全規則會少掉原本 z 抖動的立體層次感。`jitter` prop 預設 0，設計師覺得太平時往上調即可，
  不影響其他邏輯。
- 不移植 gemini 的匯入 / 匯出設定檔 UI：SymbolFace 的 dev 面板已有 Export JSON，
  匯入功能無人使用，YAGNI。
- 不移植 gemini 的「上傳圖片」：`src` prop 已可換圖。
- **做不到 gemini 截圖的「130 欄 × 可辨識數字」。** gemini 的 canvas 是 1183px 寬可捲動，
  我們是滿版一屏；同一張 `face.png` contain-fit 後只有 661 螢幕 px 寬。欄數與字級二選一，
  已選字級（`cols` 85）。若設計師堅持 130 欄的細密感，唯一的路是把人像放大到超出視窗
  （調 `fitWidth` / `fitHeight` / `worldScale`）並接受裁切，屬版面決策，不在本次範圍。
- 字級是 5 階量化（`weightSteps`）＋ atlas mipmap 縮放，不是 gemini 的連續 `fillText`。
  小字級下會略軟一階。若 Task 7 目視覺得糊，退路是把 `CELL` 由 64 降到 32
  （縮放倍率變小、mipmap 層級更貼近實際渲染尺寸）。
