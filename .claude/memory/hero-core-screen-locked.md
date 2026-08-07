---
name: hero-core-screen-locked
description: hero 段 orange core 在螢幕上其實完全不動（恆在 50vh），是文字捲上去穿過它
metadata:
  type: project
---

hero 段（01.hero）的 orange core 在**螢幕座標上完全靜止**，恆定停在 50vh —— 不是「core 往下走穿過文字」，而是「文字往上捲穿過一顆定住的方塊」。

**Why:** `OrangeCorePath.build()` 的路徑距離與 ScrollTrigger 的捲動距離**由構造必然相等**，兩者都等於 `introBottom − 100vh`：
- 起點 `sy = 50vh`、終點 `ey = introBottom − 50vh` → 路徑長 `= introBottom − 100vh`
- start `.sec1` `top top`、end `introRef` `bottom bottom` → 捲動長 `= introBottom − 100vh`

`MOVE_EASE = 'none'`（線性）下 `螢幕 y = 50vh + p·D − p·D = 50vh`，恆為常數。程式註解寫的「沿垂直線下降」只在 document 座標成立，容易誤讀。

**How to apply:**
- 改 `.sec1__intro` 的 `padding-bottom` **不會**讓 core 動起來：那個等式對任何 padding 都成立（兩邊都是 `introBottom − 100vh`）。它只改變「文字捲多快」與淡出可用的 runway。
- 要讓 core 在螢幕上真的移動，得破壞等式本身：起訖不要都取 50vh，或另立一段捲動尺。改 `MOVE_EASE` 只會讓它在 50vh 附近前後晃（頭尾仍回到 50vh）。
- 這個「core 恆在 50vh」的事實反而好用：任何「core 走到文字某處」的時機都能寫成「該處升到視窗中央」的 ScrollTrigger（`start: 'bottom center'` 等），不必算進度門檻 —— 引言淡出就是這樣做的（`INTRO_FADE_VH`，見 Hero.vue 的 introFadeST）。

相關：[[scroll-speed-knob]]
