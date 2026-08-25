---
name: symbol-face-atlas-mip-instability
description: SymbolFace 額頭在部分電腦「破掉」的根因是 atlas 32px cell 與 sprite 實際 3.7–28px 的 mipmap 縮放比隨視窗高×DPR 漂移
metadata:
  type: project
---

SymbolFace 的 glyph atlas 烘在固定 `CELL = 32`（字級 24.96px），但 sprite 在螢幕上只有

    sprite_px = 6.841 × (0.4 + 0.4·b) × (視窗高 / 559.6) × min(dpr, 2)

＝ 3.7–28 device px（b 是亮度階）。縮小倍率 1.1×–8.6×，全靠 mipmap，而 atlas **格與格之間沒有留白** →
粗 mip 會把鄰格字混進來，且不同字被模糊後的相對墨水量會重排。

後果：`亮度 → 實際墨水量` 的曲線形狀是「視窗高 × DPR」的函數。mip 交界（sprite = 4 / 8 / 16px）
落在臉的亮度範圍內時，會沿某條等亮度環出現硬邊。**額頭是最大的低梯度平原**（亮度階 17–23 的
中位列是 10–36 列 ＝ 頭頂到眉毛），所以那條環在額頭上是一大片，看起來就是額頭破掉。

實測（`temp/symbol-repro.mjs`，用專案 three 重建同一條管線）：
vh 800 / dpr 1 → 額頭 sprite 7.8px，整片均勻模糊、乾淨；
vh 880–1020 / dpr 1 → 8.6–10.0px，跨過 8px 交界，額頭出現一塊明顯較亮、有硬邊的板。
「乾淨」的條件是 `視窗高 × min(dpr,2)` 落在 409 / 819 / 1634 附近，其餘多數桌機組合都有交界落在臉上。

**不是**成因（已排除）：格網與粒子數（89×84、5980–5983，與視窗／DPR／縮圖濾波無關）、
gl_PointSize 上限（ANGLE 回報 1024）、幀率相關的物理（積分都做了 dt 正規化）。

次要但同樣跨機器的因素：
1. `measureInkWithCanvas` 用系統解析的 generic `monospace` 排序，`buildGlyphAtlas` 卻烘
   `"Courier New", monospace` —— 實測四種字型排出四種順序。逐列相關度仍 0.99，不是主因，
   但會換掉落在額頭的字。
2. 字重階梯是啞的：Courier New 沒有 100–500 變體，五階烘出來 alpha 完全相同 →
   atlas 120 格只有 24 格有效，色階解析度比 preset 假設的低五倍。
3. 亮度量化脆弱：階寬 0.0417 ≈ 7.6 灰階；5% 的格子離階界 < 0.019，
   單格平均亮度差 0.5 灰階就翻掉 388 格（6.5%），換 drawImage 濾波翻 500 格（8.4%）。

診斷腳本留在 `temp/`：`symbol-diag*.mjs`（取樣／墨水量量化）、`symbol-repro.mjs` ＋
`symbol-repro-app.js`（最小 WebGL 重現，起靜態 server 供 three ESM）、`compose.mjs`（裁切並排比對）。
相關：[[playwright-fallback-when-mcp-locked]]
