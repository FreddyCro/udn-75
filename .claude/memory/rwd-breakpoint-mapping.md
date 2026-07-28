---
name: rwd-breakpoint-mapping
description: 三段式 RWD 設計稿對應：mob 稿套 ≤767、pad 稿套 768–1279、pc 稿 ≥1280
metadata:
  type: project
---

RWD 設計稿與視窗範圍的對應（2026-07-28 使用者指定並修正，智慧心媒體先行）：

- **mob 稿**（414 canvas）→ 套用 **≤767**（版面流動縮放，不在 414 再細切）
- **pad 稿**（768 canvas）→ 套用 **768–1279**（元素多為固定 px，如標題 518 置中）
- **pc 稿**（1280 canvas）→ **≥1280**（既有基準樣式）

**How to apply:** 樣式沿用專案 desktop-first 慣例：基準寫 pc，`@include rwd-max('pc')`（≤1279）蓋 pad 稿、`@include rwd-max('tablet')`（≤767）蓋 mob 稿，切點即既有 `'tablet': 768px`，不需新增斷點。JS 判斷用 `matchMedia('(max-width: 767.98px)')` / `1279.98px`。

**Why:** 設計稿只出三套，切點與 canvas 同寬（768 起套 pad 稿、1280 起套 pc 稿）。注意使用者最初誤說 mob 到 1023，已更正為 767——勿再引用 1024 當 mob/pad 切點。

相關：共用箭頭圓鈕素材 `/img/udn75_arrow_circle.svg`（像素箭頭為 fill 縮放不變形；外圈 stroke 0.5 會隨 img 縮放等比，若需定寬可在 circle 加 `vector-effect="non-scaling-stroke"`）。智慧心媒體 mob 開場 motion 為直向組字（[[four-animation-issues]]）。
