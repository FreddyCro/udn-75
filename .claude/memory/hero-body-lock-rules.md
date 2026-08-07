---
name: hero-body-lock-rules
description: hero 開場的捲動鎖規則：拍 ①–⑧ 鎖、⑨ gone 起解鎖；例外是看完開場後永不重新上鎖
metadata:
  type: project
---

hero 開場的 **body 捲動鎖規則**（2026-08-04 與使用者逐拍確認；2026-08-07 修正拍 ⑧）：

| 拍 | `heroState` | 鎖 |
| --- | --- | --- |
| ① loader 網格翻面 ② 等影片可播 ③ loader 收尾 ④ start 閘門 ⑤ 按下 start ⑥ `main` | `main` | **鎖** |
| ⑦ `loop` | `loop` | **鎖** |
| ⑧ `outro` | `outro` | **鎖** |
| ⑨ `gone` | `gone` | 解鎖 |

①–⑤ 自動落在鎖內，因為那段期間 `heroState` 一直是 `main`（loader 與 start 閘門都不改狀態）。實作就是 `shouldLockScroll = !hasLeftLoop && (main || loop || outro)`。

**⑧ outro 為什麼也鎖（2026-08-07 使用者裁決，原本是解鎖）**：退場段一解鎖，觸發退場的那個手勢會「同時」啟動退場 **並** 把影片往上捲走 → 影片畫面裡那顆 orange core 與 DOM 的 core（恆在視窗 50vh，見 [[hero-core-screen-locked]]）差一個「使用者滑了多少」，是不可預測的量，怎麼調參數都對不上。鎖住退場那 2.5 秒，影片與視窗維持 1:1，兩顆 core 的落點才可推算。代價是那 2.5 秒滑不動，已接受。

配套：`hasLeftLoop` 的判定點也從 `outro` 移到 `gone`（否則進 outro 就把自己解鎖了）。`rewindToLoop` 只在 `gone` 有作用，故「倒帶時 hasLeftLoop 必為 true」的前提不變。

⚠️ outro 鎖住 → 影片卡住（緩衝／seek 失敗／分頁被切走）就會**整頁鎖死**。`HeroVideo` 進 outro 時另起一支保險絲（`HERO_OUTRO_STALL_GRACE_MS`／`HERO_OUTRO_MAX_MS`），逾時強制進 `gone`。動這段時不要把它拆掉。

**⚠️ 最大的坑：`.is-scroll-locked` 必須同時掛在 `<html>` 與 `<body>`。** `base.scss` 的 `html { overflow-x: clip }`（為了永不出現水平捲軸）讓根元素不再是 `overflow: visible`，依 CSS 的 viewport propagation 規則，**`body` 的 `overflow` 就不會再傳播到視窗** → 只掛 body 時鎖完全無效：垂直捲軸還在、頁面照樣捲得動。這個 bug 從 `b406d38`（導入 demo 影片、加上 `overflow-x: clip` 那次）一直存在到 2026-08-04 才發現。

**判斷鎖有沒有真的生效，要看捲軸而不是 `scrollY`**：`window.innerWidth - document.documentElement.clientWidth` 為 0 才是真的鎖住。`window.scrollTo()` 與多數自動化工具的 scroll 都是**程式捲動**，`overflow: hidden` 本來就不擋，用它們測會得到「沒鎖住」的假象。

**唯一例外（使用者裁決保留）**：`hasLeftLoop` —— 一旦進過 `outro`／`gone`，倒帶回 `loop` 時**不重新上鎖**。理由是那時 `scrollY` 已是 0、不鎖也上不去，而重新上鎖會在 iOS 橡皮筋回彈途中切 `overflow:hidden`、畫面可能卡住。**已接受的代價**：倒帶回 loop 後頁面可自由捲動，往下滑會同時進 outro 又捲走 hero，與第一次的手感不同。

曾經寫錯的理由，別再拿來當論據：「重新上鎖會造成版面位移」**不成立** —— `body.is-scroll-locked` 本來就用 `padding-right: var(--scrollbar-width)` 補回捲軸寬，鎖／解鎖的內容寬是等寬的。

其他不變的邊界規則：

1. **鎖的單一擁有者是 `01.hero/Hero.vue`**；`HeroLoader` 不自行改 `body.overflow`（否則它卸載解鎖、父層下一 tick 才重鎖，中間有「瞬間可捲動」破口）。
2. 上鎖前先 `window.scrollTo(0, 0)` ＋ `history.scrollRestoration = 'manual'`：否則重整後還原到內容區又處於 `main`，會被 `overflow:hidden` 永久鎖死在中途。
3. 影片載入失敗或自動播放被封鎖 → 直接進 `gone` → 解鎖，避免整頁鎖死。
4. **鎖住期間沒有 scroll 事件**，所以離開 `loop` 只能靠 wheel／touchmove／方向鍵手勢（見 `app/utils/hero-scroll-intent.ts`）。

相關：[[hero-core-screen-locked]]、[[hero-outro-core-handoff]]
