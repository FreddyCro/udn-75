---
name: section-component-naming
description: Section 資料夾編號與內容不符的陷阱，agenda timeline 其實在 02.forum
metadata:
  type: project
---

`app/components/` 的 section 資料夾編號與實際內容不一致，導覽時容易找錯：

- `02.forum/Forum.vue`（`id="forum"`，用 `section2.json`）＝ section 2「智慧論壇」，內含三塊：face（人物牆）、**agenda 議程時間軸**、recap。議程時間軸（12 個 Figma 畫格 → 2 個時段封面「上午場／下午場」＋ 10 場 session）就在這裡，**不在** `03.agenda`。
- `03.agenda/Agenda.vue`（`id="blessing"`，用 `section3.json` 的 `partner`）其實是 section 3「永續祝福」（策略／共創／倡議／響應夥伴），資料夾名稱 `agenda` 是誤導的殘留。

Figma 主檔 fileKey：`eTBurp9FALjEEgmeVyMEya`。議程 12 畫格中 `501-24994`（上午場封面）與 `501-26092`（下午場封面）為時段封面，其餘 10 個為實際場次。

**Why:** 未來要動「議程」時，直覺會去開 `03.agenda`，但那是夥伴祝福，改錯地方。
**How to apply:** 要改議程時間軸／12 場次，編輯 [[i18n-convention]] 所述的 `app/locales/section2.json` 與 `app/components/02.forum/Forum.vue`。