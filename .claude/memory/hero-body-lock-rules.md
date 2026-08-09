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

**鎖在 hydration 之前就先上，而且是純 CSS（2026-08-09 加）**：`applyScrollLock()` 掛在 `onMounted`，**要等 hydration**。SSR 吐出的 HTML 到 hydration 之間頁面是能自由捲的 —— 手機上這段好幾百 ms，正好是使用者拿到畫面就往下甩的時機。

作法（兩個地方，各一行半）：

1. `Hero.vue` 用 `useHead({ htmlAttrs: { class: 'is-boot-locked' } })` 在 **SSR** 就把標記掛上 `<html>`。
2. `base.scss` 與 `.is-scroll-locked` 並排一條 `html.is-boot-locked:not([data-scroll-lock])`。

**交棒寫在選擇器裡**：`applyScrollLock()` 第一件事是蓋上 `data-scroll-lock="hero"`，boot 規則隨即失效，其後一律由 `.is-scroll-locked` 說了算。屬性與 class 在同一個同步區塊內設定，中間不會重繪 → 沒有破口。

踩過的兩個坑，別再走回去：

- **不要用 inline script**（曾經寫在 `nuxt.config.ts` 的 `app.head.script`）：一大串 JS 塞在 config 裡沒人 trace 得到，而且它為了「量捲軸寬」「12 秒保險絲」越長越大 —— 這兩件事後來確認都**不需要**：SSR 同時吐出的 `HeroLoader` 是 `fixed inset:0` 的白色不透明滿版層，捲軸寬那 15px 位移發生在它底下看不到；bundle 掛掉時使用者本來就只看得到那片白，能不能捲毫無差別。
- **不要靠「CSS 隨元件 code-split，所以只有首頁載得到」**：dev 的 Vite 不做 per-route CSS 分割，子頁一樣會載到 Hero 的樣式 → 子頁被永久鎖死（`data-scroll-lock` 永遠不會出現）。必須靠 SSR 掛的 class 判斷，那才是構造上正確的（`Hero` 只出現在首頁）。
- `data-scroll-lock` **不在卸載時清掉**：語意是「JS 已接手」，一旦成立就不再變。SPA 換到子頁時 `is-boot-locked` 由 unhead 自行收掉，兩道保險都在。

其他不變的邊界規則：

1. **鎖的單一擁有者是 `01.hero/Hero.vue`**（開機腳本只是它 hydration 之前的代班）；`HeroLoader` 不自行改 `body.overflow`（否則它卸載解鎖、父層下一 tick 才重鎖，中間有「瞬間可捲動」破口）。
2. 上鎖前先 `window.scrollTo(0, 0)` ＋ `history.scrollRestoration = 'manual'`：否則重整後還原到內容區又處於 `main`，會被 `overflow:hidden` 永久鎖死在中途。
3. 影片載入失敗或自動播放被封鎖 → 直接進 `gone` → 解鎖，避免整頁鎖死。
4. **鎖住期間沒有 scroll 事件**，所以離開 `loop` 只能靠 wheel／touchmove／方向鍵手勢（見 `app/utils/hero-scroll-intent.ts`）。
5. **鎖住期間手機網址列永遠不會收合** → 滿版區塊（高 `--vh` ＝ large viewport）的底部 60–115px 全程在可視範圍外。開場期間任何 `bottom` 錨定的 UI（skip 按鈕、「下滑看更多」）都必須加 `var(--chrome-inset)` 補回來，否則手機上**完全看不到**（2026-08-09 修）。理由與算式見 `architecture/viewport-height.md`。

相關：[[hero-core-screen-locked]]、[[hero-outro-core-handoff]]
