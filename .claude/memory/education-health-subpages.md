---
name: education-health-subpages
description: /education、/health 兩子頁 2026-08-04 完成紀錄：CTA 佔位連結、SVG 匯出陷阱、錨點列改橫向滑動
metadata:
  type: project
---

2026-08-04 依 [[page-route-naming]] 六頁架構完成 `/education`（青春印記）與 `/health`（行動倡議），沿用 Subpage 外殼 + `.sp-*` 基元 + Tailwind 間距，新元件 `SubpageCta.vue`（置中外連按鈕，可選 lead 引導句，border 0.6px）。

**待補（設計稿未提供）**：三顆 CTA 按鈕連結目前是 `#` 佔位——education「聯合盃二十週年線上特輯」、health「失智・時空記憶的旅人」與「台灣新醫情共享圖庫」，正式網址確定後改 `education.json` / `health.json`。

**SVG 匯出陷阱**：
- Figma MCP `download_assets` 的 `export` 版會帶祖層背景（`#515151` rect），要用 `svgAssets` 版（純向量）。
- 從 Side Anchor Menu 非作用態匯出的藝術字帶 `opacity="0.4"`（06 行動倡議曾因此在 rail 特別淡），mask 用 alpha 上色，須手動移除 opacity 屬性。

**錨點列（SubpageAnchorBar）**：六項（6×70 + 5×22 = 530）超出 mob 視窗，改為列自身 `overflow-x: auto` 藏捲軸、左右滑動，onMounted 把 active 項捲到列中央（末端項會被 clamp，符合設計稿）；pad 以上容得下時由外層 flex 置中。

**health 頁對應**：得獎徽章 `udn75_pic32_01.svg`＝金色亞洲媒體大獎(2025)、`_02.svg`＝灰色魏明光新聞獎(2026)；「輪播綁滾動」直接重用 news 的 `PhotoPanels`（480×320＋圖說、mob 直排）。
