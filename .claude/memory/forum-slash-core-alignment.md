---
name: forum-slash-core-alignment
description: 論壇二 09/15 那一撇是核心畫出來的 —— 撇的位置與驅動線必須是同一個真值；pad/mob 靠節點錨在撇上綁死，pc 只有守衛
metadata:
  type: project
---

論壇二日期的那一撇（`/`）**不是字元，是橘核心畫出來的**：`.forum-event__date-coreslash`
只提供外框，`--slash-draw`（0..1）隨核心的路徑進度長出來。於是有一條硬性不變量：

> **「撇畫在哪」與「核心經過哪」必須是同一個真值。**

撇的版位是 CSS（`ForumEvent.vue` 的 `--coreslash-x/y/w/h`，逐斷點、都經過目視微調），
核心的位置是驅動線（pad/mob 由 `forum-node-path.ts` 生成、pc 是手貼的 `d`）。
**兩邊各自可以被改，漂掉時畫面上是「撇畫在 A、核心在 B」，而兩邊都不會報錯。**

**Why:** 2026-08-22 發現 mob 壞了 —— `slash: 'core'` 是場次資料（`section2.json`）、沒有
逐斷點，所以 mob 也畫那一撇；但 mob 稿的線根本不經過它（稿的斜線是獨立的靜態圖稿），
實測核心在離撇 **167.9 / 126.0px** 的地方「畫」出那一撇，一直沒人發現。

**How to apply:**

1. **pad / mob 已用程式綁死** —— 節點 `Q7a`/`Q7b`、`P7a`/`P7b` 的 x 與 y 都錨在撇本身
   （`forum-node-path.ts` 的 `SLASH_SEL`），兩點之間 `join: 'line'`（撇是直線）。
   撇怎麼動線就跟著動：**改文案、改字級、改 `--coreslash-x/y`、版面重排都不用重算。**
   ⚠ 不要把撇的座標抄一份到 `forum-node-path.ts`，那就變成兩份真值了。
2. **pc 沒有程式保證** —— 它的 `d` 是手貼的 Figma 匯出。動 pc 的 `FORUM_PATH`，
   或動 pc 的 `--coreslash-x/y`，**一定要回頭確認撇還在線上**。
3. **守衛**：`computeSlashWindow()` 量撇兩端到驅動線的距離，超過
   `FORUM_SLASH_CORE.alignTol`（`max(12px, 對角線 × 0.12)`）就不畫那一撇、dev console 警告。
   看到 `[forum-slash] 那一撇與驅動線沒對齊` 就是這件事。
   （跨斷點拉視窗時會短暫吼一次，那是 bp 更新晚一拍，可忽略；持續吼才是真的壞了。）
4. **驗法**：量撇的 `getBoundingClientRect()` 右上／左下兩角到 `.forum-path__motion path`
   的最近距離。修好後實測 pc 1.2 / 11.7、pad 0.8 / 0.7、mob 0.6 / 1.4。
   更強的驗法是逐幀比對「核心中心」與「撇的畫出頭」——
   `head = (右上角) + draw × (左下角 − 右上角)`，兩者應該逐 px 相等。
   見 [[verify-scroll-driven-visuals]]。
5. 完整脈絡（含 mob 為什麼把 `P7` 的 dy 從 +38 改成 −312）在
   `architecture/forum-node-path.md` 第三節「那一撇」。動線之前先讀，同 [[forum-rwd]]。
