---
name: section-component-naming
description: agenda 議程時間軸其實在 02.forum（不在 section 3）；section 3 已 rename 為 blessing
metadata:
  type: project
---

`app/components/` 的 section 內容配置容易找錯位置：

- `02.forum/Forum.vue`（`id="forum"`，用 `section2.json`）＝ section 2「智慧論壇」，內含三塊：face（人物牆）、**agenda 議程時間軸**、recap。議程時間軸（12 個 Figma 畫格 → 2 個時段封面「上午場／下午場」＋ 10 場 session）就在這裡——雖名為「議程」，卻**不在**任何 `agenda` 命名的資料夾。
- `03.blessing/Blessing.vue`（`id="blessing"`，用 `section3.json` 的 `partner`）＝ section 3「永續祝福」（策略／共創／倡議／響應夥伴）。2026-07 已由舊名 `03.agenda/Agenda.vue` rename 回 `03.blessing/Blessing.vue`（元件名 `<Blessing>`），元件／資料夾／錨點三者對齊，先前「資料夾叫 agenda 其實是祝福」的誤導已消除。

Figma 主檔 fileKey：`eTBurp9FALjEEgmeVyMEya`。議程 12 畫格中 `501-24994`（上午場封面）與 `501-26092`（下午場封面）為時段封面，其餘 10 個為實際場次。

**Why:** 未來要動「議程」時，直覺會往 section 3 或找 `agenda` 命名處，但議程其實在 section 2（`02.forum`）；section 3（`03.blessing`）是永續祝福，改錯地方。
**How to apply:** 要改議程時間軸／12 場次，編輯 [[i18n-convention]] 所述的 `app/locales/section2.json` 與 `app/components/02.forum/Forum.vue`。