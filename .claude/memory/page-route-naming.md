---
name: page-route-naming
description: 子頁路由與單位對應（2026-07-18 對調後），以及素材資料夾命名維持不動的決定
metadata:
  type: project
---

子頁路由 ↔ 單位對應（2026-07-18 定案，2026-08-04 增兩頁）：

- `/news` = 數位革命／新聞部×數據發展部（`news.json`，原 `digital.json`）
- `/service` = 永續影響／新聞營運中心（`service.json`，原舊版 `news.json`）
- `/visual` = 視覺敘事／視覺設計中心
- `/data` = 智慧新聞／數據中心
- `/education` = 青春印記／教育事業部（`education.json`，素材 `public/img/education/`）
- `/health` = 行動倡議／健康事業部（`health.json`，素材 `public/img/health/`）

閱讀順序（下一篇鏈）：news → visual → service → data → education → health（health 無 next）。
六頁清單（首頁 media__list、mob 錨點列、pc 右側 rail）皆由 `common.json` 的 `subpageAnchors` 驅動。
