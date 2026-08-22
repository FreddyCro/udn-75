---
name: dev-server-stale-vite-error
description: 除錯畫面異常前先檢查 vite-error-overlay——dev server 會卡在過期編譯錯誤，HMR 樣式全失效，製造出程式碼裡不存在的幽靈 bug
metadata:
  type: project
---

2026-08-22 除錯 blessing 夥伴清單「閃爍消失」時，追了多輪才發現使用者的 dev server
卡在 Subpage.vue 的過期編譯錯誤（`Unknown word //`＝sass 前處理沒跑）。檔案內容
當下是合法的、硬重載也清不掉——是先前存檔到一半的暫態把 Vite module graph 弄壞，
之後 HMR 樣式更新全部失效（如 `.is-in { opacity: 1 }` 沒套上），畫面行為與程式碼
脫鉤，且每次觀察結果不一致。重啟 dev server 後一切正常。

**Why:** 長時間開著的 Nuxt dev server ＋ 頻繁編輯存檔，會出現「錯誤狀態殭屍化」；
在這種頁面上除錯視覺問題，會把幽靈現象當成真 bug 追。

**How to apply:**
1. 接到「畫面異常／閃爍」回報時，第一步先用 Playwright 查
   `document.querySelector('vite-error-overlay')`（使用者可能已按 Esc 關掉 overlay，
   但壞狀態仍在）。
2. 有 overlay 或懷疑 HMR 汙染時，用 `NUXT_IGNORE_LOCK=1` ＋另一個 port 起乾淨
   server 對照（不動使用者自己開的 server），行為不同＝環境問題，請使用者重啟。
3. 使用者一邊測試一邊編輯檔案時，每輪量測前先確認沒有 HMR 波打斷（console 會有
   `hmr` 記錄），被打斷的量測直接作廢重跑。
