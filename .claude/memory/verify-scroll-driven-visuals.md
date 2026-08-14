---
name: verify-scroll-driven-visuals
description: 用 Playwright 驗捲動驅動的視覺：靠 ?pathdebug 的 __udnST/__udnForumPath 傳送到目標進度，別用 locator.screenshot()
metadata:
  type: reference
---

本專案幾乎所有視覺都綁 scrub，要驗某個進度上的畫面時：

1. 帶 `?pathdebug` → `window.__udnST`（ScrollTrigger）與 `window.__udnForumPath`（pathLen / nodes /
   marks / turns / slash）才會掛上。找到目標那條尺（例如 trigger 是 `.sec2__path` 的那條），
   用 `st.start + p × (st.end − st.start)` 算出 scrollY，`window.scrollTo` 過去，**等兩個 rAF** 再讀值。
2. **不要用 `locator.screenshot()`** —— 它會先 `scrollIntoView`，把剛設好的捲動位置整個弄掉，
   於是截到的是另一個進度的畫面（而且不會報錯）。要截圖就設好 scrollY 後截**整個視窗**。
3. 傳送式捲動會跳過 hero 的開場互動 → `.hero-start`（`position: fixed; z-index: 1500`）留在最上層
   蓋住整個畫面。**這是傳送的副作用，不是 bug**：截圖前把它 `display: none` 即可。
4. 逐幀量測比肉眼可靠：`new DOMMatrixReadOnly(getComputedStyle(el).transform)` 取 `hypot(a, b)`
   得 gsap 寫入的 scale。注意 `getBoundingClientRect()` 讀到的是**旋轉後的外框**
   （邊長 s 的方塊轉 θ 之後外框是 `s × (cosθ + sinθ)`），不是邊長本身。
5. 3000 埠上常有使用者自己的 dev server，直接借用即可，不要另開。見 [[dev-server-port-ownership]]。
