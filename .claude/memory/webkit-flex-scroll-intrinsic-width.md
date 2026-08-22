---
name: webkit-flex-scroll-intrinsic-width
description: iOS/WebKit 對「flex 容器裡的 overflow-x 捲動 flex item」intrinsic 寬度算錯 → 這類容器寬度必須寫死，置中用首尾 auto margin
metadata:
  type: project
---

2026-08-22 修 SubpageAnchorBar「iPhone 上 nav 顯示不完整」時確認：WebKit（iOS Safari／Playwright WebKit 皆重現）對**巢狀 flex 裡帶 `overflow-x: auto` 的 flex item** 會算錯 intrinsic 寬度——六項（582px 內容）在 393pt 視窗只算出 162px（恰兩項＋一 gap），被外層 `justify-content: center` 置中後左右項目像被裁掉。Chromium 會算成滿寬，**桌機模擬完全看不出來**。

**Why:** flex 自動尺寸（`flex: 0 1 auto` ＋ `max-width: 100%`）對捲動容器的 max-content 計算是 WebKit 的老 bug 區；不能依賴。

**How to apply:**
- 橫向捲動列（錨點列、tab 列等）在 flex 父層內時，寬度**寫死** `width: 100%`，不要用 `max-width: 100%` 靠 flex 自動收斂。
- 「容得下時置中、超出時可捲」不要用外層 `justify-content: center`（overflow 時列首滑不到），改在**首尾 item 掛 `margin-left/right: auto`**——overflow 時 auto margin 自動歸零。
- 驗 iOS 版面問題用 Playwright **WebKit** ＋ `devices['iPhone 15']`（webkit binary 需 `npx playwright install webkit`）；行動版 WebKit 不支援 `mouse.wheel`，捲動改 `page.evaluate(() => scrollBy(...))`，要先派發一次 touchstart 才會標記 userMoved（見 pages/subpage.vue）。
- 斷點對應見 [[rwd-breakpoint-mapping]]；錨點列疊層規則見 [[subpage-hero-100vh]]。
