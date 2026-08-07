---
name: forum-rwd
description: 動到 02.forum 之前先讀：設計線對位的觸發清單、pad/mob 三斷點策略、特異度陷阱與已知差異
metadata:
  type: project
---

## 動任何 02.forum 版面之前

**先讀 [`architecture/forum-core-path.md`](../../architecture/forum-core-path.md)。**
橘核心蛇行路徑靠版面座標對位，會影響它的改動不只「改路徑」本身——下列任何一項都算：

- 換／調整 `ForumCorePath.vue` 的可見線 svg，或 `FORUM_PATH` 的任何欄位
- 改 `.forum-event__date` 的版位（它是錨點元素）
- 改 `.sec2__heading` 的行數、字級、margin
- 改 `.forum-event` 的 padding，或任何會讓三場之間垂直距離變動的版面調整
- 補 pad / mob 的線稿或版型

那份文件有定位模型、「什麼會自動跟上」對照表、重新對位的逐步流程（含可貼 console 的量測片段），
以及三個降低維護成本的提案。

## 三斷點版型（2026-08-07 完成）

依 mob（Figma `2566-84799`）與 pad（`2652-53307`）稿補齊。
Figma fileKey：`HOt7xNcSTpina7WqNv9MVn`（此檔為 Copy；舊主檔 `eTBurp9FALjEEgmeVyMEya` 是改版前的稿，勿混用）。

**覆蓋策略刻意用 desktop-first（`rwd-max('pc')` / `rwd-max('tablet')`）**，不是 mixins.scss 建議的
mobile-first。原因：pc 版是「整段絕對定位到 1280 設計稿座標」且橘核心設計線靠它對位，
改成 mobile-first 等於重寫 pc。pad/mob 的做法是把那套座標系整組退回 flex 直排
（`position: static` ＋ `display: flex`）。

兩處靠 `display: contents` 重排，動 DOM 順序前先看它們：

- `.forum-event__head`（mob 的論壇二）：讓標眉～CTA 成為 `.forum-event` 的 flex 子項，
  CTA 才能用 `order` 排到講者組之後（pad 稿 CTA 仍緊接內文）。
- `.forum-event__speaker`（pad/mob 的論壇一）：讓照片／標籤／姓名／介紹攤平成單欄，
  用 order 排成「照片 → 講者介紹 → 姓名 → 介紹」。

⚠️ **特異度陷阱**：`.forum-event--quote/--stair/--right .forum-event__venue` 之類的版式限定規則
（0,2,0）會蓋掉寫在 `.forum-event__venue` 這一層 rwd 區塊（0,1,0）的字級。凡是 pc 已用版式選擇器
指定過的屬性，pad/mob 的值也必須寫進各版式底下，不能寫在基底。

**與設計稿的已知差異**（都因為 `section2.json` 的 `venue: string[]` 只有兩行）：

- mob 的論壇二／三：稿是「台灣大學」放大成獨立一行、其餘小一級共四行；實作為統一字級三行。
- pad 的論壇一：稿把「台北漢來大飯店3樓鉑金C廳」併成一行；實作照 JSON 斷成兩行。

要照稿就得把 venue 拆成三筆，但那會讓 pc 也變三行（pc 稿是兩行），故未動。

相關：[[rwd-breakpoint-mapping]]、[[comment-style]]、[[no-auto-commit]]
