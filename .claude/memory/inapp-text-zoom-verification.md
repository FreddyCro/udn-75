---
name: inapp-text-zoom-verification
description: in-app 字級跑版不能在桌機用「把 font-size 乘大」模擬——那會讓 em 方案假性通過；正確的模擬是設 --tz-measured
metadata:
  type: feedback
---

LINE／FB／IG 的 in-app 瀏覽器（Android WebView）把系統字體大小當 **text zoom** 套用：
只放大字、版面 px 不動。桌機沒有這個機制，所以很容易用錯的方式模擬它。

**❌ 錯的模擬**：在 devtools 把某個元素的 `font-size` 乘 1.15。
這會讓 `em` 長度跟著一起長 → 看起來「用 em 寫欄寬就解決了」。
實機上不會：text zoom 乘在 **computed** font size，而 `em`／`rem` 從 **specified** font size
解析 → em 完全追不上放大的字。2026-08-27 之前 footer 就是這樣「修好」了一個沒修好的 bug
（`--maxWidth: 8em`，實際等於寫死 120px）。

**✅ 對的驗證**（兩層）：
1. 桌機模擬：`document.documentElement.style.setProperty('--tz-measured', '1.15')`，
   然後比對「字級是否精確 ÷1.15」與「padding／margin 是否 0 筆變動」。
   ⚠️ 文字驅動的 intrinsic width（`max-content`、shrink-to-fit）在桌機模擬下會縮小，
   那是模擬的假警報 —— 真機上字被乘回設計值，寬度自然回來，不要追。
2. 實機 LINE（系統字體大小調到最大）：這是唯一能證實的地方。倍率 s 的自我校準量法：
   `font-size: 100px; line-height: 1` 的區塊高 ÷ 100（不依賴字型度量），
   或 10 個全形漢字的 `max-content` 寬 ÷ 1000（漢字 advance 恆等於 1em）。兩者應一致。

`-webkit-text-size-adjust` 不要再試了：它只 gate text autosizer，不 gate text zoom（實機驗過）。

機制本身與開關寫在 `build/text-zoom-normalize.ts`、`app/assets/styles/base.scss`（`--tz`）。
相關：[[dev-server-port-ownership]]（同一輪測試踩到「使用者自己也開著一支 dev server」）
