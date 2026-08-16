# hero 退場 → 引言現身 — 決策紀錄

日期：2026-08-16
狀態：**已實作，但同日被推翻** —— 見 `architecture/2026-08-16-hero-scrub-dissolve-design.md`
分支：`feat/hero-intro-reveal`

> **⚠️ 這份設計已被取代，但刻意保留。**
> 它的鎖住方案在**首次觀看**是正確的（實測全數通過），壞在**重播路徑**：
> 第三-4 節我把「重播時 outro 會鎖在半路」的偏移估成「約 60px、畫面靜止、判定無害」——
> 實測快速甩一下是 **400px 以上**，滿版影片會凍在半路並吃掉引言第一段。
> 那個誤判就是推翻它的原因，也是取代方案「整類機制都不要」的由來。
> 本檔第五節的量測紀律（看捲軸不看 scrollY、真實輸入、rAF 取樣）仍然有效，新設計沿用。
相關檔案：`app/components/01.hero/HeroVideo.vue`、`Hero.vue`、`Hero.scss`、
`app/composables/useHeroVideo.ts`、`app/utils/hero-video-config.ts`、
新增 `app/utils/hero-scroll-lock.ts`、`test/hero-scroll-lock.spec.ts`
連帶要改：`.claude/memory/hero-body-lock-rules.md`

設計師要的（逐字）：

> hero video 退場後，能夠看到 intro 文字，並且不會因為滑走導致沒看到內容

拆成四條可驗收的需求：

| | 需求 |
|---|---|
| R1 | 退場播完、使用者還沒開始捲的那一刻，畫面 ＝ 白底 ＋ 中央 core ＋ 引言從下緣露出一角 |
| R2 | 引言**不疊進第一屏**；它的顯示不吃任何遮罩、狀態旗標或 hero 狀態（第三節的 `fadeHold` 只管捲動鎖，不碰引言） |
| R3 | 退場段一律鎖住捲動，含「看完過一次再倒帶回 loop」的重播路徑 |
| R4 | 引言不會因為使用者在退場期間往下滑而被錯過 |

---

## 〇、先講一個不舒服但必須寫下來的幾何事實

**R1 ＋ 滿版影片 ⇒「影片蓋住引言頂端」不可避免。** 第一屏就那麼大，引言要在裡面、影片又要滿版，
兩者必然重疊。能消滅的不是重疊本身，是為了處理它而長出來的**機制**。

2026-08-15 曾經連續試了三版都不好，全都栽在這裡：

| 版本 | 做法 | 為什麼不好 |
|---|---|---|
| 一 | 引言負 margin 疊進第一屏 ＋ 整組 `opacity: 0`，`gone` 才淡入 | 重疊只在文件座標的那一段，整組藏起來連「本來就在影片框外」的部分也藏了 → 退場期間往下滑，引言在看不見的狀態下捲過去 |
| 二 | 改用 `clip-path` 切齊 hero 底緣，只遮重疊那段 | 機制正確但複雜；且「引言被切掉」在使用者眼中就是「被影片蓋住」 |
| 三 | 拿掉遮罩，讓引言壓在影片上 | 開場全程看得到三行字印在影片上 |

**共同的錯誤前提是「引言要被拉進 hero 的地盤」。** 本設計反過來：引言待在原位不動，
**縮短 hero 佔的捲動距離**，讓第一屏自己容得下它。

---

## 一、幾何：`.sec1__hero` 從「一屏影片」降級為「佔位」

```scss
$hero-stage: 0.85;   // 影片在文件流裡吃掉的捲動距離
                     // 1 − 此值 ＝ 靜止時引言露出的量（0.85 ⇒ 15vh ≈ 3 行）
```

| | 現在 | 改後 |
|---|---|---|
| `.sec1__hero` 流高度 | `vh(1)` | `calc(#{vh($hero-stage)} - var(--chrome-inset))` |
| 影片渲染高度 | 同上（100vh） | 仍 100vh，往下溢出約 15vh |
| `overflow: hidden`（裁 cover 溢出） | 在 `.sec1__hero` | 移到新的 stage 層 |

**為什麼要扣 `--chrome-inset`**：鎖住期間手機網址列永遠不會收合（見
`.claude/memory/hero-body-lock-rules.md` 規則 #5），解鎖那一刻的可視高度是 small viewport。
不扣的話 15vh ≈ 127px 減掉約 86px 工具列，手機只露得出**一行**。桌機 `--chrome-inset` 為 0、
完全不受影響。這與 skip 按鈕、下滑提示當初補 `--chrome-inset` 是同一個道理（2026-08-09 修）。

### DOM：加一層 stage，不跨元件搬家

```
.sec1__hero            佔位，id=app-hero（heroIO 的觀察對象）
└─ .sec1__hero-stage   absolute / inset 0 0 auto 0 / height vh(1) / overflow hidden / z-index 4
   ├─ .sec1__hero-video
   ├─ .sec1__hero-skip
   └─ .sec1__hero-scroll
```

多這一層是為了 **skip 與下滑提示的底部錨定**。它們是 `bottom: calc(44px + var(--chrome-inset))`、
相對 `.sec1__hero`；佔位一縮短，兩顆會浮高約 15vh。收進 stage 就自動錨在影片的 100vh 上，
那兩組稿上座標一個字都不用改。全部在 `HeroVideo.vue` 內完成。

**刻意不用 `position: fixed`**（另一個看起來更漂亮的選項）：fixed 才需要把 `<HeroVideo>` 搬出
`.sec1__inner`（inner 帶著 pin 寫入的 transform，fixed 子孫會改以它為基準 —— HeroLoader /
HeroStart / HeroSymbolTransition 三層在外面就是這個原因），而且 `#app-hero` 是 `heroIO` 的觀察
對象、不能是 fixed，元件得拆成兩塊分屬不同父層。fixed 買到的是「影片與視窗 1:1 的構造保證」，
而那件事第三節的鎖已經免費給了。**日後若要拿掉鎖，再從這裡升級到 fixed，引言那側完全不用重寫。**

### 層序：只剩三行，沒有任何機制

`.sec1__scene`（3）必須 > `OrangeCore`（2），影片必須 > `.sec1__scene`
⇒ **stage 4、skip 與 chevron 5**。就這樣。沒有 `clip-path`、沒有 `is-ready`、沒有 opacity 閘門。

### 引言：只刪不加

`.sec1__intro` 的 `padding-top`（mob `clamp(360px, vh(0.78), 560px)`／pad+pc `100px`）**刪除** ——
它原本的職責是「預留 core 舞台空間」，那件事現在由佔位高度表達。旋鈕從兩個收成一個。
`padding-bottom`（`--intro-runway`）不動。

### 查過沒問題的連帶

- **`OrangeCorePath`**：`sy = 50vh` 不變；`ey = introBottom − 50vh` 與 ScrollTrigger 的捲動距離
  同時縮短約 15vh。`hero-core-screen-locked` 那條「路徑長 ＝ 捲動長 ＝ `introBottom − 100vh`」
  的等式**兩邊等量變化**，core 恆在 50vh 仍成立。
- **`runCoreEntrance`**：量的是 `<video>` 自己的 `getBoundingClientRect()`（stage 內仍是滿版），
  交棒換算不受影響。
- **`heroIO`**：觀察對象仍是 `#app-hero`，只是它早約 15vh 離開視窗。它是保險絲，不影響正確性。

---

## 二、退場：淡出仍是時間動畫，靠鎖消滅賽跑

子頁 `SubpageIntroMedia` 那份筆記（`temp/issue-pinned-stage-handoff.md` 第四條）指出：
**時間動畫的退場會與捲動賽跑**，滑掉的距離 ＝ 捲動速度 × 淡出秒數，跟 pin 多長無關；
它的解法是把退場淡出綁 scrub。

**本段刻意不採用 scrub**，理由是 R1：

- scrub 表示「要捲才會淡」。使用者不捲的話影片就停在畫面上 —— 靜止畫面會是影片的最後一格，
  不是 R1 要的 core ＋ 引言。
- 兩者互斥，只能擇一。R1 是設計師點頭的畫面，所以淡出必須是**自動的**（時間）。
- 而賽跑的另一種解法就是**鎖**——使用者已明確接受退場期間鎖住捲動（那是四個選項中唯一沒被
  勾選為「效果不好」的一項）。鎖著就沒有捲動，賽跑不存在。

⇒ **scrub 是用來取代鎖的；既然鎖被接受，scrub 就是多餘的複雜度。** 但那份筆記的診斷仍然成立，
只是解法選了另一條，這件事寫下來免得日後有人以為漏看了。

---

## 三、捲動鎖：兩處改動

```
現在：!hasLeftLoop && (main | loop | outro)
改後：outro                                  ← 一律鎖，不看 hasLeftLoop
   || (!hasLeftLoop && (main | loop))        ← 維持原樣，iOS 橡皮筋那條決策不動
   || fadeHold                               ← 新增：撐到淡出結束
```

### 3-1　outro 一律鎖

現行規則整條吃 `hasLeftLoop`，於是重播時退場段不鎖 —— 使用者會在「影片還蓋著引言」的狀態下
把引言捲過去。`hasLeftLoop` 那條例外（記憶檔標明「使用者裁決保留」）擔心的是
**iOS 在往上橡皮筋回彈途中切 `overflow:hidden`**，而退場是**往下滑**觸發的，不在那個風險情境裡。
兩段可以分開處理，原決策在 main / loop 上完整保留。（2026-08-16 使用者裁決）

### 3-2　解鎖點從 `gone` 延到「影片真的看不見了」

`gone` 觸發時影片才開始 0.8s 的淡出；解鎖在 `gone`，那 0.8 秒是可捲的 —— 賽跑就在這裡。

**不新增第五個狀態**：`isGone` 被 `AppHeader`、`coreVisible`、`HeroVideo` 的 watch 讀，
動狀態機會擴散。改用一個與狀態並存的布林值 `fadeHold`。

**設**：進 `gone` 的那一刻，**若上一刻是鎖著的**。

「上一刻是鎖著的」取的是 **`shouldLockScroll` 在狀態改變前的值**（在 `watch(heroState)` 的
callback 裡讀 `prev` 算，不是去讀 DOM 上的 class）—— class 是 `applyScrollLock()` 的產物，
拿它當輸入會讓兩者互為因果。

這條件精準涵蓋所有路徑：

| 路徑 | 上一刻鎖著？ | 撐 | 為什麼對 |
|---|---|---|---|
| `outro → gone` | 是（3-1） | ✓ | 正常路徑 |
| SKIP：`main`/`loop`（首次，鎖著）→ `gone` | 是 | ✓ | 影片在畫面上正在淡 |
| 重播：`loop`（沒鎖）→ `gone`（heroIO 強制收尾） | 否 | ✗ | 使用者正在往下滑、影片早已捲出視窗；撐下去會無預警凍住畫面 |

**清**：計時器 `HERO_VIDEO_FADE_MS + HERO_FADE_HOLD_GRACE_MS`（＝ 800 + 200）。
寬限只是吸收 transition 起跑的一兩幀延遲，不必像 `HERO_OUTRO_STALL_GRACE_MS`（3000）那麼寬 ——
那條要等的是可能卡住的影片解碼，這條等的是一段已經開始的 CSS 轉場。
記憶檔那條「outro 鎖住 → 影片卡住就整頁鎖死，保險絲不要拆」對任何新的鎖同樣適用，
這支計時器就是 `fadeHold` 的保險絲：它是**唯一**的清除路徑，不倚賴 `transitionend`
（元素被隱藏、轉場被打斷時那個事件不保證會來）。

**reduced-motion 直接不設**：那時 `.sec1__hero-video` 是 `transition: none`、淡出是瞬間的，
撐著只會白鎖一秒。

### 3-3　淡出時間的單一來源

`HERO_VIDEO_FADE_MS = 800` 進 `hero-video-config.ts`，以 CSS 變數餵給 `.sec1__hero-video`
的 `transition-duration`（做法同 `--intro-runway`）。JS 的計時器與 CSS 的轉場吃同一個數字。

### 3-4　重播路徑的 60px 偏移：查過了，不必處理

重播時 outro 是在使用者已滑約 60px（`HERO_GESTURE.toOutroPx`）的位置上鎖，不是 scrollY 0。

**這不會破壞 core 交棒。** `runCoreEntrance` 是**量**影片 rect 再算差值，不假設 0：偏移 60px
只會讓 DOM core 從影片那顆的位置多滑 60px 到中央，銜接仍然連續。2026-08-07 那個 bug 之所以
無解，是因為偏移量在退場期間**持續變化**；鎖住之後它是凍結的、可量的。

故 `applyScrollLock()` 的 `window.scrollTo(0, 0)` 加上 `if (!hasLeftLoop)` —— 重播時就地凍住，
不把使用者正在看的畫面往回扯一截。

**已接受的副作用**：重播時影片停在比視窗高 60px 的位置 ⇒ 螢幕底部提早約 2.5 秒露出約 60px 的
引言。畫面是靜止的，判定無害。

---

## 四、抽成純函式

`app/utils/hero-scroll-lock.ts`（慣例同 `hero-scroll-intent.ts`：判定邏輯抽純函式、單獨測試）：

```ts
shouldLockHeroScroll(state: HeroState, hasLeftLoop: boolean): boolean
shouldHoldFade(wasLocked: boolean, reduceMotion: boolean): boolean
```

這條規則已改過三次（2026-08-04 加 `hasLeftLoop`、08-07 納入 outro、08-16 本次），
而且**壞掉時畫面上不會有任何東西喊出來** —— 只會是「退場能滑走」或「整頁鎖死」，
兩種都要試玩很久才發現。真值表有測試釘住，改動就當場失敗而不是靜默劣化。

---

## 五、驗證方法（含我自己量錯過的兩次）

| 要驗的事 | ❌ 錯法 | ✅ 正確量法 |
|---|---|---|
| 鎖有沒有生效 | 看 `scrollY` 有沒有變 | `innerWidth − documentElement.clientWidth === 0` |
| 使用者滑得動嗎 | `window.scrollBy()` | `page.keyboard.press('End')` 等真實輸入 |
| 某一刻的畫面 | 直接截圖（慢一步拍到下一個狀態） | rAF 迴圈監看狀態翻面的那一幀再取樣 |

`overflow: hidden` **本來就不擋程式捲動**，用 `window.scrollTo` 測會得到「沒鎖住」的假象
（記憶檔 `hero-body-lock-rules` 已載明，2026-08-15 仍踩了一次）。

**R4 的直接證明**：用 rAF 監看 `.is-scroll-locked` 由 `true → false` 的那一幀，讀
`.sec1__hero-video` 的 computed opacity —— **必須是 0**。以 400／800／1600／3000 px/s
各跑一次連續捲動，確認這個不變量與速度無關（跳捲量不出這類問題）。

驗收對照：

| | 怎麼驗 |
|---|---|
| R1 | 三斷點靜止畫面截圖；手機另外注入 `--chrome-inset` 驗第一節的算式 |
| R2 | 讀 diff：`.sec1__intro` 只有刪除，沒有新增 |
| R3 | 真值表單元測試 ＋ 重播路徑真實按鍵 |
| R4 | 上面那個 opacity 不變量 × 四種速度 |

回歸確認：`hero-core-screen-locked` 的「core 恆在 50vh」（逐點取樣）、
重播路徑（偏移 60px）下 `runCoreEntrance` 的交棒仍連續。

dev server：帶 `?pathdebug`，**借用 3000 埠上既有的 server**，不另開
（`verify-scroll-driven-visuals` #5、`dev-server-port-ownership`）。

---

## 六、不做什麼

- **不做 scrub 退場**（理由見第二節）。
- **不改 `main` / `loop` 的鎖規則**：`hasLeftLoop` 那條 iOS 例外原樣保留。
- **不新增 hero 狀態**：四階段 `main / loop / outro / gone` 不動。
- **不動 `--intro-runway`、`INTRO_FADE_VH`、轉場 pin**：引言淡出與 SymbolScene 交棒完全不碰。
- **不把影片改成 `position: fixed` 或 ScrollTrigger pin**（理由見第一節）。
