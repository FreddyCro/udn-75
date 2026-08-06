---
name: no-auto-commit
description: 絕不自行 commit；到該 commit 的時機停下來，提供 commit message 讓使用者決定
metadata:
  type: feedback
---

**絕不自行執行 `git commit`。** 工作做到該 commit 的時機就停下來，把擬好的 commit message 貼給使用者，由他決定要不要 commit、何時 commit。

**Why:** 使用者要自己掌握版本紀錄的節奏與內容，commit 是他的決策點，不是流程的自動步驟。

**How to apply:** 完成一段工作後，回報改了什麼、附上建議的 commit message（含 `Co-Authored-By` 尾行），然後交還控制權。不要執行 `git add` + `git commit`。skill 流程（如 superpowers:brainstorming）要求「commit 設計文件」時同樣停下來——寫檔可以，commit 不行。