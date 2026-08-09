# SymbolFace PC 版互動提示（hint）— 設計稿

日期：2026-08-10
狀態：**待實作**
相關檔案：`app/components/01a.symbol/SymbolFace.vue`、`app/components/01.hero/Hero.vue`、`app/locales/section1.json`
設計稿：Figma `2065:139734`（Group 12416，203×88）

人臉集合（`mode === 'face'`）那一拍，PC 版在人像右下角浮出一組提示，告訴使用者「這裡可以用滑鼠玩」。
使用者一旦真的把游標移進人像範圍，提示立刻消失，且**整個 session 不再出現**。

---

## 一、為什麼寫在 `SymbolFace.vue` 內、而不是另開一個元件

提示的定位錨在**人像 bbox 的右下角**、消失條件是**游標進入人像 bbox**——兩者都要
`halfW` / `halfH`（取樣時算出的人像世界尺寸）與 `smoothMouse` / `influence`（滑鼠緩動狀態），
這些全是 `SymbolFace` 的 `onMounted` 區域變數，沒有對外曝露，也不值得為了一段提示文字曝露。

同一個理由下，它與既有的宮格彩蛋（`.egg`）是同一類東西：**貼在 canvas 上、由 three.js 的世界座標
投影定位的 DOM 圖層**。放在一起，投影換算（`proj.project(camera)`）與 `viewW/viewH` 可以共用。

## 二、規格

### 文案

`app/locales/section1.json` → `symbol.hint`：

```json
"hint": "游標移動\n探尋隱藏的心聲"
```

經新 prop `hint: { type: String, default: '' }` 由 `Hero.vue` 傳入，空字串＝不顯示。
**元件本身不綁文案**，與既有的 `phrases` 同一套慣例（見 CLAUDE.md「文案外部化」）。

### 視覺（照 Figma 2065:139734）

| 項目 | 值 |
|---|---|
| 圖示 | 88×88 inline SVG，三個同心圓：`r=43.75` 描邊 `white/.5` 寬 `0.5`／`r=23.5` 描邊 `white/.75` 寬 `1`／`r=8` 填 `white/.85` |
| 圖示↔文字間距 | 16px |
| 文字 | 13px／line-height 26px／letter-spacing 1.3px／weight 300／`#fff`／`white-space: pre-line` |
| 整組 | 88 + 16 + 99 = 203 寬、88 高，圖示與文字垂直置中對齊 |

圖示用 inline SVG 而非另存檔：專案既有慣例（`AppHeaderIcon.vue`、`HeroStart.vue` 等 9 個元件都是
inline），且這三個圓沒有任何一項需要外部檔案。

### 定位

錨點＝人像 bbox 右下角的世界座標 `(halfW, -halfH, 0)`，用 `.egg` 那套 `proj.project(camera)`
換算成螢幕 px，**整組的中心**對齊該點（`translate(-50%, -50%)`）。

`face.png` 是緊裁的人像，bbox 幾乎等於臉本身，故「中心壓在角上」＝圖示疊在下顎右側、
文字往右下延伸。若之後要改成「整組完全在臉的右外側」，那是這一個 transform 的差別。

⚠️ 與 `.egg` 的差別：`.egg` 跟著游標跑、必須每幀寫 DOM；hint 的錨點在世界座標裡是**不動的**，
只有 resize 與粒子重建會改變它的螢幕位置。故只在 `applySize()` 與 `buildFromImage()` 末端
各算一次寫進 ref，不進 `animate()` 的熱迴圈。

### 顯示條件

三者皆成立才可見，`opacity` 0↔1、`transition: opacity .4s ease`：

1. **視窗寬 ≥ 1280px** — 純 CSS `@media (min-width: 1280px)`，其餘 `display: none`。
   對齊 `mixins.scss` 的 `pc` 斷點（本檔的 `<style>` 是純 CSS 無 `lang="scss"`，故手寫展開式，
   與檔內 `.stage` 的 `--vh` 註解同一個處理方式）。
2. **`mode === 'face'`**，且切入 face 後再等 `disperseDuration`（2.2s）才淡入。
   直接綁 `mode` 會在粒子還在集合途中就冒出來——那 2.2s 畫面上還沒有「臉」可以指。
   離開 face（捲回 disperse 或前進 converge）立即隱藏並清掉計時器。
3. **尚未 dismiss**。

### 消失

在 `animate()` 內判定：`mode === 'face'` 且 `influence > 0.4` 且 `smoothMouse` 落在人像 bbox 內
（`nx, ny ∈ [0,1)`，與宮格彩蛋同一套換算）→ 設 `hintDismissed = true`。

- **永久**：離開 canvas、捲回上一拍、resize 都不復原。提示的用途是教學，學會就不該再打擾。
- `cfg.autoMouse` 為 true 時**跳過**此判定：虛擬游標在人像內遊走，會在提示淡入前就自己戳到。
  （PC 版 Hero 並未開 `autoMouse`，這只是防呆。）
- 判定用 bbox 而非「真的撞散粒子」（`holeRadius` 命中）：後者在臉的空白處移動不會觸發，
  提示會賴著不走。

## 三、不做的事

- **不做 idle 重現**：使用者離開又回來不再提示（見上）。
- **不做觸控版替代提示**：觸控裝置本來就跑 `autoMouse`，粒子自己在動，不需要教學。
- **不動 `.egg`**：兩者位置互斥——hint 在 bbox 角落，egg 只在游標進 bbox 後才出現，
  而那一刻 hint 已經 dismiss，不會同時在場。
