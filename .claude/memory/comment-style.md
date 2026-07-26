---
name: comment-style
description: 註解精簡原則 — 不寫 Figma node ID、不寫敘事型檔頭，只留維護必要資訊
metadata:
  type: feedback
---

註解只保留維護必要的資訊，不要過多說明（2026-07-26 使用者回饋，同 c1e9162 的清理標準）。

**Why:** 敘事型註解（版面尺寸、動畫分鏡逐步描述、字級規格）看程式碼就能得知，會過時且增加閱讀負擔；Figma node ID（如「對稿 Figma 990:59054」）使用者明確表示不需要。

**How to apply:**
- 檔頭 doc block：1～3 行，只寫元件用途與關鍵入口（如 JSON 驅動、觸發方式），不逐條列功能。
- 刪除：Figma node ID、重述程式碼的註解（`// 作答後鎖定`）、純樣式敘述（「深灰 Light 文字」）、多行動畫時序推演。
- 保留：魔術數字推導（`// 68 / 84：縮至 68px`）、跨檔案約定（z-index 層級、「見 SubpageAnchor」）、非顯而易見的技巧（`grid-rows 0fr ↔ 1fr`、`invalidateOnRefresh`）、TODO、props 格式契約（UPic 路徑不含副檔名）。
