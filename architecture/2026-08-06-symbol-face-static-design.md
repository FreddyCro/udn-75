# SymbolFace 靜態質感移植 — 決策紀錄

日期：2026-08-06（2026-08-07 壓縮，原 382 行的完整設計稿見 git 歷史）
狀態：**已實作完畢**（`8dcded3` → `fcb740b` 色彩校準 → `1cedb2a` 畫面外停 rAF）
相關檔案：`app/components/01a.symbol/SymbolFace.vue`、`app/utils/symbol-atlas.ts`、`app/utils/symbol-sampler.ts`
相關回饋：`architecture/LIU_FEEDBACK_3.md`

把 `SymbolFace.vue` 的**靜態外觀**改成 gemini-code HTML 的 ASCII matrix 質感（網格化取樣、
字元依墨水量對應明暗、多字重、可調 stop 漸層）。動態與 3D 邏輯完全沒動——reveal / disperse /
converge 三態、GSAP 補間、滑鼠斥力、慣性物理、群體避讓、宮格彩蛋、resize、dispose 全部原樣。

實作細節（props 清單、取樣管線、shader 差異、atlas 格式、dev 面板欄位）現在都能從
上述三個檔案直接讀到，不再抄一份。以下只留**程式碼讀不出來的決策與推導**。

---

## 一、已定案的決策

1. **映射方向照 gemini 原樣：亮 → 大 / 粗 / 淺色。**
   `face.png` 是中灰調 3D render（額頭鼻樑亮、眼窩兩頰暗），套此邏輯得到「光雕人臉」。
   ⚠️ `LIU_FEEDBACK_3.md` 字面寫「顏色深，文字大」與此**相反**，已確認以 gemini 為準。
   之後若有人拿那句回饋來質疑，答案在這裡。
2. **排列完全網格化。** 移除機率抽樣與 z 隨機抖動，暗部靠「空白字元階」自然留空。
   代價是少了原本 z 抖動的立體層次感 → 開了 `jitter` prop（預設 0）當退路。
3. **微動態四項全採**：隨機換字改成 glitch 跳色（字元固定）、拿掉 `vShade` 額外明暗層、
   靜態半透明改不透明（reveal/disperse 的淡入淡出保留）、twinkle / breath 幅度降低但開成 prop。

## 二、`cols = 85` 而非 gemini 的 130

gemini 的 canvas 是 1183px 寬可捲動，我們是滿版 100vh 舞台。
`face.png` contain-fit 進 500×500 後 world 寬 342.7，視窗高 1080 時 = 661 螢幕 px。

| cols | cellW | 墨水寬 | 觀感 |
|---|---|---|---|
| 130 | 5.1px | 4.7px | 退化成彩色點陣，數字不可辨 |
| **85** | 7.8px | 7.2px | ≈ gemini 截圖的 7.5px/欄 |

「130 欄」與「gemini 那樣的字級」在滿版一屏上**無法同時成立**，必須二選一；85 是保字級那一邊。
已於 props-only 驗證（`3d3e32c`）目視確認。`cols` 是 dev 面板可調欄位，要更細的點陣質感可自行往上調。

若真要 130 欄的細密感，唯一的路是把人像放大到超出視窗（調 `fitWidth` / `fitHeight` /
`worldScale`）並接受裁切——那是版面決策，不在本次範圍。

## 三、兩個數字的來歷（動之前先看）

### `uWorldToPx`：字級與格距必須同單位

改動前 `gl_PointSize = aSize × uPixelRatio × (300/-mv.z)`，**位置**吃 world→px 換算（隨視窗縮放）、
**字級**吃寫死的 0.5（不隨視窗變）——兩套單位，導致墨水/格距的填充率隨視窗高度漂移：

| 視窗高 | 格距 | 墨水 / 格距 |
|---|---|---|
| 800 | 7.15px | 105%（貼死、開始糊） |
| 1080 | 9.65px | 78%（尚可） |
| 1440 | 12.87px | 58%（過疏） |

解法是 `aSize` 改成 world 單位、`uWorldToPx = viewH / (2 × uCamZ × tan(fov/2))`，
且 `uCamZ` 由 camera 讀出不硬編。resize 時要一併更新 `uWorldToPx`（`SymbolFace.vue` 的 resize 分支）。

> 2026-08-06 更正：本節原先判定「字比格距大 1.66 倍、必定重疊」是**錯的**——那是拿 point sprite
> 外框比格距，沒計入 atlas 留白（×0.78）與 monospace 墨水比（×0.6）。真正的缺陷是上表的漂移，
> 不是固定超標。修法不變，但別再引用「必定重疊」當論據。

### `GLYPH_FONT_SCALE = 0.78`：atlas 留白的抵銷項

`buildGlyphAtlas` 把字烘在 `CELL × 0.78` 的字級上，sprite 四周有 22% 是空的。
`size` 最終變成 `gl_PointSize`（sprite 邊長），不除掉這一項，`sizeMax = 1.0` 畫出來的字級
只有格高的 0.78 倍（墨水寬 `0.72 × cellW`，gemini 是 `0.92 × cellW`）。

**它宣告在 `symbol-sampler.ts`**（無 DOM／無 three.js，測試碰得到），由 `symbol-atlas.ts` import 回去用。
兩邊必須是同一個數，分開寫遲早不同步。

## 四、素材實測值

`face.png` 實測 **1013×1478**（早期文件記 1024×1470 有誤），alpha 覆蓋率 80%，
亮度平均 0.533、0.2–0.8 均勻分佈——是**中間調** 3D render 而非暗調，
所以 `contrast` 用「繞中灰做對比」`(b-0.5) × contrast + 0.5` 是對的做法，
不能退回舊的 `darkBoost` 乘法增益（那只會提亮暗部、壓縮高光）。

## 五、已知取捨

- **做不到 gemini 截圖的「130 欄 × 可辨識數字」**，理由見 § 二。
- 字級是 5 階量化（`weightSteps`）＋ atlas mipmap 縮放，不是 gemini 的連續 `fillText`，
  小字級下會略軟一階。若覺得糊，退路是把 atlas 的 `CELL` 由 64 降到 32。
- 不移植 gemini 的匯入設定檔 UI（dev 面板已有 Export JSON，匯入無人用）與「上傳圖片」（`src` prop 已可換圖）。
- `legacy/SymbolFaceScatter.vue` 是改寫前的原封備份，只有 demo 頁引用、不再維護，
  首頁 bundle 不受影響。
