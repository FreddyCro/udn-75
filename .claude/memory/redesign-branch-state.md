---
name: redesign-branch-state
description: redesign branch 的改版進度與下一步 issue 位置；0.6.0 branch（7ff9f19）是改版前參考實作
metadata:
  type: project
---

2026-08 起在 **`redesign` branch** 依新設計稿重做首頁。**`0.6.0` branch（HEAD = `7ff9f19`）是改版前的參考實作**，被移除的機制都能從那裡取回。

- 規格文件：`architecture/PRD.md`（唯一一份；2026-08-04 把 PRD-v2 併回來、v2 已刪，舊架構描述不再保留）。
- 下一步的工作單：**`temp/issue-05-forum-core-path.md`**（ForumCorePath：橘核心沿 SVG 路徑貫穿論壇段）。⚠️ `temp/` 不入版控，換機器就沒了。

已完成的首頁流程：影片 → start 閘門（`HeroStart`，音效開關存 `useAppSound`）→ 引言（核心垂直穿透文字）→ 兩段軸向放大轉場（`HeroSymbolTransition`：上下拉長→左右展開成滿版）→ `SymbolScene`（01a.symbol，黑底粒子場，純捲動尺、不用 pin）→ 交棒 `ForumCore` → Forum（上半部待做）。

Forum 的上半部（論壇一~四內容 ＋ 橘色路徑）尚未開始；`.sec2` 現行黑底是舊稿 placeholder，**已決定改白底**。

相關：[[scroll-speed-knob]]、[[section-component-naming]]、[[four-animation-issues]]
