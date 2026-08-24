---
name: symbol-rail-vs-section-height
description: 符號段的「捲動尺長」與「段落高度」是兩個值（尺多 50vh）；交棒點到論壇接縫的距離只由 handoff 那一拍決定，調總長無效
metadata:
  type: project
---

2026-08-22 起 `01a.symbol` 的**捲動尺長 ≠ 段落高度**：

- `SYMBOL_RAIL_VH`（3.34 ＝ 四拍總和）＝ 尺長，**所有 progress 門檻的分母**
- `SYMBOL_VH`（2.84）＝ `.sec-symbol` 的 height ＝ 尺長 − `SYMBOL_HOVER_VH`（0.5）
- 尺的 `end` 是 `'bottom center'`，故 `progress = 1` 的意義是「段落底緣抵達視窗**中央**」——
  那多出來的半個視窗就是舊的「懸停期」，且它與 `ForumCorePath` 的 `start: 'top center'`
  是同一個幾何位置（兩軌首尾相接、零跳點）

**Why（真正該記住的那條）：** 論壇接縫（`.sec2` 頂端）在螢幕上的高度是
`SYMBOL_VH + 1 − p × 尺長`。代入交棒點 `coreIn = BEAT_END.converge / 尺長` 之後總長**全部約掉**：

```
接縫 y @coreIn = SYMBOL_HOVER_VH + SYMBOL_BEAT_VH.handoff     （＝ SEAM_AT_HANDOFF_VH）
```

⇒ **「把符號段拉長／縮短」對「交棒時看得到多少論壇內容」完全無效**，前三拍怎麼調都動不到它。
改版前尺長 ＝ 段高（`end: 'bottom bottom'`）時更硬：`p < 1` ⟺ 接縫在視窗底緣以下、而
`coreIn` 恆 `< 1`，所以交棒那一刻**必然**一個論壇的字都看不到，就算把 `handoff` 壓到 0 也一樣。
這是構造保證，不是參數沒調對（同 [[hero-core-screen-locked]] 那類「兩邊是同一個式子」的陷阱）。

**How to apply:**
- 要調「交棒時看得到多少論壇文字」＝ 改 `SYMBOL_BEAT_VH.handoff`。它同時是交棒到路徑接手的停留，
  上限「主標要完整可見」（1440×700 最緊，只剩 6px 餘裕）、下限「轉場層 0.35s 淡出要跑得完」，
  兩邊都有測試守著。
- 要調段落長度 ＝ 改前三拍。不要去改 `SYMBOL_VH`，它是推導值。
- 接縫在 284vh 就越過視窗底緣（在 `converge` 那一拍中段），論壇內容從那裡開始升進畫面 ——
  **看不見是因為轉場層不透明**（`HeroSymbolTransition`，fixed 滿版 z-index 10，撐到 coreIn 才淡出）。
  這也是 `agendaIn` 那 0.4s 淡入的遮蔽物；判準已從舊的「發生在畫面外」換成「在轉場層底下跑完」。
- `ForumCore` 只剩橘點了：原本吃 `[coreIn, coreOut)` 的滿版白底整層移除（它會蓋掉剛升上來的主標，
  而它要保證的白由 `.sec-symbol--light` 與 `.sec2` 自己成立）。`coreOut` 語意收窄成「無設計線斷點上
  橘點的收場點」。

完整推導與實測：`architecture/2026-08-22-forum-heading-in-handoff-viewport-design.md`。
驗法見 [[verify-scroll-driven-visuals]]。
