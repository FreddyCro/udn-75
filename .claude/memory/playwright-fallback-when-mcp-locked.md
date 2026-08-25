---
name: playwright-fallback-when-mcp-locked
description: Playwright MCP 的 Chrome profile 被別的 session 佔住時，改用 npx cache 那份 playwright ＋ 系統 Chrome 跑腳本
metadata:
  type: reference
---

Playwright MCP 有時會回 `Browser is already in use for ...\ms-playwright-mcp\mcp-chrome-<hash>`
（別的 Claude session 佔著，本機沒有 SingletonLock、也殺不到 process，等於無解）。
此時**不要放棄視覺驗證**，改自己寫 node 腳本：

1. 套件：專案沒裝 playwright，但 npx cache 有一份可直接 require：
   `C:/Users/fredd/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright`
   （用 `createRequire` 引入；路徑會隨 npx cache 變動，先掃 `_npx/*/node_modules/playwright-core` 確認）。
2. 瀏覽器：`ms-playwright` 底下**沒有**下載好的 chromium，`chromium.launch()` 會失敗。
   改指系統 Chrome：`executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'`，
   `args: ['--headless=new']`。
3. 腳本與截圖寫進 `temp/`（已 gitignore）。3000 埠借用使用者自己的 dev server，見
   [[dev-server-port-ownership]]；截圖注意事項見 [[verify-scroll-driven-visuals]]。

驗 canvas 類視覺時，比肉眼可靠的做法是直接讀畫布像素算 bbox：
`ctx.getImageData(...)` 掃 alpha > 8 的格子取 min/max，再乘 `clientWidth / canvas.width` 換回 CSS px，
多幀取樣就能量出「團塊實際佔了哪個矩形／中心漂移多少」。
