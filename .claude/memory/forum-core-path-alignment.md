---
name: forum-core-path-alignment
description: 動到論壇段設計線、日期版位、段落主標或 02.forum 版面之前，先讀 architecture/forum-core-path.md
metadata:
  type: project
---

**論壇段的設計線（橘核心蛇行路徑）相關改動，一律先讀 [`architecture/forum-core-path.md`](../../architecture/forum-core-path.md)。**

會影響它的改動不只「改路徑」本身 —— 下列任何一項都算，動之前先讀：

- 換／調整 `ForumCorePath.vue` 的可見線 svg，或 `FORUM_PATH` 的任何欄位
- 改 `.forum-event__date` 的版位（它是錨點元素）
- 改 `.sec2__heading` 的行數、字級、margin
- 改 `.forum-event` 的 padding，或任何會讓三場之間垂直距離變動的版面調整
- 補 pad / mob 的線稿或版型

那份文件有定位模型、什麼會自動跟上的對照表、重新對位的逐步流程（含可貼 console 的量測片段），
以及三個降低維護成本的提案。相關：[[comment-style]]、[[redesign-branch-state]]
