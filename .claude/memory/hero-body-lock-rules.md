---
name: hero-body-lock-rules
description: hero 開場的捲動鎖規則：正片 ＋ 還沒播完的退場段都鎖（含回到 page top 的 restart 重播），退場播完才解鎖；配兩根防死結保險絲
metadata:
  type: project
---

hero 開場的 **body 捲動鎖規則**（2026-08-04 與使用者逐拍確認；2026-08-16 因重播路徑會把畫面鎖在半路而拿掉 outro 鎖；**2026-08-22 兩次改動：先移除「看完過就不再上鎖」的例外，再把鎖延長到退場段播完**，見下方兩節）：

| 拍 | `heroState` | 鎖 |
| --- | --- | --- |
| ① loader 網格翻面 ② 等影片可播 ③ loader 收尾 ④ start 閘門 ⑤ 按下 start ⑥ 正片 0–33s | `main` | **鎖** |
| ⑦ 退場段 36–38.5s（由正片**順播**進來，不是捲動觸發） | `outro` | **鎖** —— 這就是「不要因為捲太快而看不到 outro」的實作 |
| ⑧ 退場播完（停在最後一格） | `outro` ＋ `outroWatched` | **解鎖起點** —— 同一刻 Hero 自動捲到引言可讀位置（`scrollToIntroReading`）；不解鎖就沒有捲動可以驅動溶解，會死結 |
| ⑨ `gone` | `gone` | 解鎖 |

①–⑤ 自動落在鎖內，因為那段期間 `heroState` 一直是 `main`（loader 與 start 閘門都不改狀態）。實作是 `~/utils/hero-scroll-lock` 的 `shouldLockHeroScroll(state, outroWatched)`：**`state === 'main' || (state === 'outro' && !outroWatched)`**，一條純函式，沒有計時器、沒有手勢累積器（有單元測試釘住，改動就當場失敗而不是靜默劣化）。

## 2026-08-22（下午）：鎖延長到退場播完，`loop` 狀態移除

`loop`（原 30–33s 的等待循環段）沒有用處了 —— 正片改成 0–33 一路播、播完 seek 到 36 播退場，**整段都鎖著**，播完才解鎖。於是設計師「不要因為捲太快而看不到 outro」第一次真正成立（此前是已記錄的取捨：大部分人只看到 45–90%）。

**為什麼這次鎖 outro 是安全的**（別拿 2026-08-16 的紀錄當理由改回去）：當時的失敗模式是「`loop` 解鎖 → 使用者先自由捲一段（實測快速甩 > 400px）→ 才觸發退場 → 鎖在**半路**介入 → 畫面凍在 scrollY 400 長達 2.5 秒」。現在退場是在 scrollY 0、還鎖著的狀態下由正片自動接進來的，鎖從頭到尾沒鬆開過，沒有「半路上鎖」這回事。

**代價是兩個新的死結風險，各配一根只看牆上時間的保險絲**（`HeroVideo`，鎖住而畫面全靜是必須自動解開的狀態）：

| 保險絲 | 情境 | 逾時 | 動作 |
| --- | --- | --- | --- |
| `armStallFuse` | 在 `main` 但影片始終不能播。restart 這條路徑**沒有載入層也沒有 start 閘門**把關，而 `.is-loading` 是 `opacity: 0` ⇒ 使用者被鎖在一片白，SKIP 又綁影片時間軸（`currentTime >= HERO_SKIP_APPEAR_AT`）永不出現 | `HERO_VIDEO_READY_TIMEOUT` 8s | `skipOpening()` → `gone` → 解鎖 |
| `armOutroLockFuse` | 鎖著的退場段卡住（緩衝／解碼／被瀏覽器暫停）⇒ 沒有任何東西會把鎖打開（SKIP 只在 `main` 出現） | 退場長度 ＋ `HERO_OUTRO_LOCK_GRACE_MS` 2.5s | `outroWatched = true` → 解鎖 |

第二根正是 2026-08-16 連同 outro 鎖一起刪掉的那類機制（`HERO_OUTRO_STALL_GRACE_MS` / `HERO_OUTRO_MAX_MS`）—— 刪掉的理由是「outro 不鎖之後影片卡住只是影片卡住」，退場重新上鎖那個理由就失效了。這次只留一根、只看牆上時間，不做進度偵測。

**SKIP 不設 `outroWatched`**（2026-08-22 下午修正）：SKIP 只跳過正片，影片 seek 到退場段後**照樣鎖著**，播到最後一格才解鎖。曾經為了「按了逃生口不該又被鎖 2.5 秒、而 skip 按鈕此刻已消失」而讓 `skip()` 直接設起它 —— 自動捲到引言的功能上線後那個顧慮消失了（使用者不必自己捲，畫面會自己過去），於是 `outroWatched` 回到單一語意：**影片真的播到最後一格**（或退場鎖保險絲逾時）。

## 2026-08-22：`main` 會重來，所以「不重新上鎖」的例外被移除

設計師回報「帶 hash 從子頁進站（`/#forum` 這類）就再也看不到影片」，使用者裁決「**乾脆全部回到 page top 就重看影片**」（restart，完整紀錄見 `architecture/2026-08-22-hero-restart-on-top-design.md`）。於是 `heroState` 會再回到 `main`——三條路徑：子頁 logo → 導航回 `/` 並帶 `restartIntent` 旗子（原本是 `/#loop`，2026-08-22 同日改掉，見該文件第十一節）、首頁 logo 就地、由下往上捲回 page top（`dissolveState` 的 `p < DISSOLVE_LEAVE`）。

配套改動：
- **`hasLeftLoop` 整個移除**（含 `setState('gone')` 裡的設值）。留著等於「重播不上鎖」，而重播那一趟不鎖就會被使用者自己的下一個捲動事件立刻打斷 —— 等於沒有重播。真值表因此只剩一個輸入。
- **`applyScrollLock()` 的 `scrollTo(0, 0)` 改為無條件**。它現在同時吸收下面那個 iOS 顧慮：restart 由 scrub 觸發的那一刻捲動可能還帶著慣性／橡皮筋還在回彈，先歸零再上鎖，畫面就不會凍在彈起的位置。實測（Chromium、桌機）三條路徑都是 `scrollY 0` ＋ `innerWidth - clientWidth === 0`。
- **逃生口是 SKIP**（正片 **2s** 後淡入，2026-08-22 由稿上的 3s 改短），不是捲動。而 SKIP 綁影片時間軸 ⇒ 影片完全拉不動時它不會出現，那個死結由 `HeroVideo` 的 `armStallFuse()` 兜著：身處 `main` 且影片還不能播就上一根 `HERO_VIDEO_READY_TIMEOUT` 的保險絲，逾時 `skipOpening()` → `gone` → 解鎖。**這是 restart 這條路徑特有的破口**：它沒有載入層也沒有 start 閘門把關（原本 `main` 只會在首訪出現，那時兩者都在）。
- 「播到一半緩衝卡住」仍未守備（要回頭做進度偵測，正是 2026-08-16 刪掉的那類機制）；此時 SKIP 通常已現身。

## 歷史紀錄：outro 為什麼曾經也鎖，以及為什麼在 2026-08-16 整條拿掉

**2026-08-07 曾裁決 outro 也鎖**：退場段一解鎖，觸發退場的那個手勢會「同時」啟動退場又把影片往上捲走 → 影片畫面裡那顆 orange core 與 DOM 的 core（恆在視窗 50vh，見 [[hero-core-screen-locked]]）差一個「使用者滑了多少」，是不可預測的量，怎麼調參數都對不上。鎖住退場那 2.5 秒讓影片與視窗維持 1:1，兩顆 core 的落點才可推算。

**2026-08-16 因重播路徑出包而整條移除**：這個鎖只在**首次觀看**是對的；`loop` 沿既有的 `hasLeftLoop` 例外不鎖，所以「回到 loop 後再往下滑」會先讓頁面自由捲一段——實測快速甩一下可捲超過 400px，手勢累積到門檻才觸發 outro，這時鎖才介入，把畫面**凍結在半路**（例如 scrollY 400）長達 2.5 秒，而滿版影片層此刻剛好蓋住引言第一段，使用者看到的是「網頁卡住、被影片擋住看不到內文」。原本估計這個偏移只有手勢門檻量級（約 60px、畫面近乎靜止），判定無害；快速甩動的實測推翻了這個估計，這是判斷錯誤，不是實作偏離設計。結論不是把鎖調得更精準，而是這一整類機制（鎖 ＋ 手勢累積器 ＋ 撐鎖計時器）都不要——退場改綁捲動 scrub 直接驅動後，「淡出與捲動賽跑」這個前提本身不存在了，這批東西一起拿掉。完整經過見 `architecture/2026-08-16-hero-scrub-dissolve-design.md`。

同一天一併拿掉的還有：
- **`gone` 之後撐鎖到影片淡完才真的解鎖的 `fadeHold` 機制**（`HERO_VIDEO_FADE_MS`／`HERO_FADE_HOLD_GRACE_MS`）——退場不再是時間動畫，opacity 直接綁捲動進度 `p`，沒有「淡完」這個時間點可撐，這套機制連存在的前提都沒了。
- **outro 鎖住期間防止「影片卡住整頁鎖死」的保險絲**（`HERO_OUTRO_STALL_GRACE_MS`／`HERO_OUTRO_MAX_MS`）——outro 不鎖之後，影片卡住只是影片卡住，不會連帶鎖死頁面，保險絲失去存在理由。

配套（**已於 2026-08-22 作廢，見上方**）：`hasLeftLoop` 曾在 `setState('gone')` 時設為 `true`，只影響「`main` 還要不要鎖」這一件事。當時的例外是「`hasLeftLoop` 為真時連 `main` 都不鎖」，理由是那時 `scrollY` 已是 0、不鎖也上不去，而重新上鎖會在 iOS 橡皮筋回彈途中切 `overflow:hidden`、畫面可能卡住；前提是「`heroState` 不會再回到 `main`（只會回 `loop`）」。restart 規則讓那個前提不成立，例外與旗標一起移除，iOS 顧慮改由無條件的 `scrollTo(0, 0)` 承擔。

曾經寫錯的理由，別再拿來當論據：「重新上鎖會造成版面位移」**不成立** —— `body.is-scroll-locked` 本來就用 `padding-right: var(--scrollbar-width)` 補回捲軸寬，鎖／解鎖的內容寬是等寬的。

**⚠️ 最大的坑：`.is-scroll-locked` 必須同時掛在 `<html>` 與 `<body>`。** `base.scss` 的 `html { overflow-x: clip }`（為了永不出現水平捲軸）讓根元素不再是 `overflow: visible`，依 CSS 的 viewport propagation 規則，**`body` 的 `overflow` 就不會再傳播到視窗** → 只掛 body 時鎖完全無效：垂直捲軸還在、頁面照樣捲得動。這個 bug 從 `b406d38`（導入 demo 影片、加上 `overflow-x: clip` 那次）一直存在到 2026-08-04 才發現。

**判斷鎖有沒有真的生效，要看捲軸而不是 `scrollY`**：`window.innerWidth - document.documentElement.clientWidth` 為 0 才是真的鎖住。`window.scrollTo()` 與多數自動化工具的 scroll 都是**程式捲動**，`overflow: hidden` 本來就不擋，用它們測會得到「沒鎖住」的假象。

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

1. **`.is-scroll-locked` 這把鎖的單一擁有者是 `01.hero/Hero.vue`**（開機腳本只是它 hydration 之前的代班）；`HeroLoader` 不自行改 `body.overflow`（否則它卸載解鎖、父層下一 tick 才重鎖，中間有「瞬間可捲動」破口）。
   另有第二把鎖 `.is-menu-locked`（<1280 漢堡選單，`AppHeaderMenu.vue`，2026-08-12 加）：**刻意不共用 `.is-scroll-locked`** —— hero 的 `applyScrollLock()` 只要 `heroState` 一變就會 `remove` class，共用會把選單的鎖一起清掉。兩把鎖的 CSS 宣告相同（`base.scss` 併選擇器），同時成立也沒事。配套：`AppHeader` 用 `matchMedia('(min-width: 1280px)')` 在放大到 pc 時強制 `menuOpen = false`，否則漢堡與選單都 `display:none`、沒人能解鎖 → 整頁鎖死。
2. 上鎖前先 `window.scrollTo(0, 0)` ＋ `history.scrollRestoration = 'manual'`：否則重整後還原到內容區又處於 `main`，會被 `overflow:hidden` 永久鎖死在中途。
3. 影片載入失敗或自動播放被封鎖 → 直接進 `gone` → 解鎖，避免整頁鎖死。
4. **鎖住期間（`main`）沒有 scroll 事件，但這件事現在不重要了**：離開 `loop` 不必再偵測手勢——`loop` 本身就是解鎖的，使用者一捲動就是真正的 `scroll` 事件，直接餵給 `~/utils/hero-dissolve` 的 scrub（見 `HeroVideo.vue` 的 `applyDissolve`）。2026-08-16 之前這裡靠的是 `wheel`／`touchmove`／方向鍵手勢累積器（`app/utils/hero-scroll-intent.ts`，已刪除）去猜「使用者想不想離開 loop」；退場改綁捲動之後，這一整組手勢判定變得多餘，拿掉。
5. **鎖住期間手機網址列永遠不會收合** → 滿版區塊（高 `--vh` ＝ large viewport）的底部 60–115px 全程在可視範圍外。開場期間任何 `bottom` 錨定的 UI（skip 按鈕、「下滑看更多」）都必須加 `var(--chrome-inset)` 補回來，否則手機上**完全看不到**（2026-08-09 修）。理由與算式見 `architecture/viewport-height.md`。

相關：[[hero-core-screen-locked]]、[[hero-outro-core-handoff]]