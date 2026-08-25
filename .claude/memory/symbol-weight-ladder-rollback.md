---
name: symbol-weight-ladder-rollback
description: SymbolFace weightSteps 5→1（atlas 120→24 格）的改動還原點：commit e98ba75，另有 temp/rollback-2026-08-26/ 的原檔備份
metadata:
  type: project
---

2026-08-26 依使用者指示做 [[symbol-face-atlas-mip-instability]] 的「B 案」：把啞掉的字重階梯
`weightSteps` 由 5 降到 1，atlas 從 24 字 × 5 階 = 120 格（11×11 × 32px = 352×352）
變成 24 格（5×5 × 32px = 160×160）。

**還原點**：改動前這三個檔案與 `e98ba75`（branch `0.10.0`，"fix: bug list"，2026-08-26 00:35）
完全一致（`git status --porcelain` 對這三檔為空）：

- `app/components/01.hero/Hero.vue`
- `app/components/01a.symbol/SymbolFace.vue`
- `app/utils/symbol-atlas.ts`

還原方式（任一）：

    git checkout e98ba75 -- app/components/01.hero/Hero.vue app/components/01a.symbol/SymbolFace.vue app/utils/symbol-atlas.ts

或直接從 `temp/rollback-2026-08-26/` 覆蓋回去（同一份原檔的實體備份，temp 已 gitignore）。

⚠️ 改動當下工作目錄有大量**其他**未提交變更（section2/3 文案、blessing partners 素材、
forum SVG 等），與本次無關 —— 還原時**只**還原上面三個檔案，不要 `git checkout .`。

程式碼內的標記：三處都留了 `2026-08-26` 的註解說明「為什麼是 1」與量測數據，
搜 `weightSteps` 或 `字重階梯` 就找得到。
