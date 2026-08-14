---
name: dev-server-port-ownership
description: 清理 dev server 前必先確認 PID 是不是自己開的 —— 自己的 nuxt dev 常落在 3001 而非 3000
metadata:
  type: feedback
---

CLAUDE.md 的 Cleanup 要求「殺掉自己開的 dev server、不要動使用者原本的行程」。實作上有個陷阱：
**`pnpm dev` 不保證拿到 port 3000** —— 3000 被別的行程佔著時 nuxt 會退到 3001，於是「殺 3000 的 listener」
殺掉的是別人的，自己的還活著。2026-08-13 就這樣誤殺了使用者在 3000 上的行程，自己留在 3001。

**Why:** nuxt dev 只在 port 衝突時才換號，而換號的訊息在 `pnpm dev | tail -N` 這種寫法下看不到
（tail 會緩衝到行程結束才輸出）—— 沒有輸出可看時很容易假設「我的就在 3000」。

**How to apply:**
1. 啟動 dev server 一律直接重導到檔案（`pnpm dev > dev.log 2>&1`），**不要接 `| tail`**，才看得到實際 port。
2. 清理前用 `Get-CimInstance Win32_Process -Filter "ProcessId=$pid"` 比對 `CreationDate`／`CommandLine`，
   確認是自己這次啟動的那支再殺；時間對不上就留著。
3. Nuxt 的 dev lock 也可當線索：重複啟動時它會印出既有 server 的 URL / PID / 啟動時間。

相關：[[no-auto-commit]]（同樣是「動使用者的東西前先停下來」）