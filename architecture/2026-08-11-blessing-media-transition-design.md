# 03.blessing → 04.media 過場 — 決策紀錄

日期：2026-08-11（2026-08-12 壓縮並更新為實作後現況，原 280 行的設計稿見
`git show e0840bd:architecture/2026-08-11-blessing-media-transition-design.md`）
狀態：**已實作**
相關檔案：`app/components/03.blessing/Blessing.vue`、`app/composables/useMediaIntroMotion.ts`、
`app/composables/useOrangeCoreProgress.ts`、`app/utils/orange-core-config.ts`、
`app/components/04.media/Media.vue`
設計稿：**無**（來源是 `architecture/LIU_FEEDBACK_4.md`「永續祝福 3. 過場再接上『智慧心媒體』，
目前還未串接在一起」）

三拍，依序、不重疊：① 夥伴清單淡出，留下純橘畫面 → ② 滿版橘底左右收窄 → ③ 收到 `BLOCK_VW`
（60vw），接上 media 現有的開場 timeline。

常數（`BLESSING_OUT_VH` / `BLESSING_OUT_FADE` / `BLESSING_PARTNERS_HOLD_VH` / `NARROW_DUR` /
`HOLD_BUFFER`）與曲線 `partnersFadeAt()` 都在上述檔案，且註解已寫得比本文詳細。以下只留決策。

---

## 一、接縫本來就是無縫的，唯一的破口是「寬度」

`.media__stage` 是 `position: absolute; top: 0; height: 100vh`，`.media__morph` 置中於其中，
而 timeline 第一拍的 from-state 是 `60vw × 100vh` 的橘塊。三件事疊起來的結果是：

> **橘塊上緣恆等於 `.media` 的 section 上緣，也就是接縫本身**；塊高等於 `window.innerHeight`。

加上 GSAP 在 progress 0 就 render from-state，所以從「`.media` 上緣進入視窗底緣」到
「`.media` 上緣抵達視窗頂」這 100vh 之間，**接縫下方永遠被滿版高的橘塊填滿**，與 blessing 的
橘底同色 —— 縱向早就無縫。唯一的破口是**橫向寬度在接縫處硬跳一階**：滿版 → 60vw。

而第一拍本來就是「橘塊左右縮成 28px 直條」—— **「變窄」這個動作已經存在，只是起點不是滿版。**
所以做法是在 media 的 timeline **前面插一拍 0**（滿版 → `BLOCK_VW`），原本的拍 1 從 `fromTo`
退化成純 `.to`。

### 為什麼「變窄」不能比 `top top` 更早開始

橘塊上緣＝接縫。接縫上方是 blessing 的滿版橘底、下方是橘塊。**一旦橘塊在接縫還看得到的時候
收窄，接縫就變成一道看得見的橫向缺口**（上滿版、下 60vw，左右各露出一塊白底）。
所以可以開始收窄的最早時機，就是接縫離開視窗頂的那一刻 —— `start: 'top top'`，
也就是現有 ScrollTrigger 的起點，它已經在最早的位置了。

推論：**把 morph 往上挪、或把 pin 提早起算，買不到收窄的跑道。** 那段行程只能拿來
「維持滿版不動」，畫面上與什麼都不做完全等價，卻要付出 Media 去操作 Blessing DOM 的跨段耦合成本。

### `HOLD_BUFFER` 要跟著 `NARROW_DUR` 走

`HOLD_BUFFER` 是 scrub 行程（px）＝ sticky 定住距離。插了拍 0 之後 timeline 總長變長，
`HOLD_BUFFER` 必須等比加長，否則等於連帶改了**後面每一拍**的 px 速度。
現值 2180 / `NARROW_DUR` 0.45，關係是 `HOLD_BUFFER ≈ (5.1 + NARROW_DUR) × 392`。
⚠️ 改其中一個就要改另一個。

### header theme

`.media` 原本沒標 `data-header-theme`、回落 `light`。改成滿版起手後，收窄期間畫面上緣是整片橘，
header 卻已經是 light，而 `pickHeaderTheme` 只比對縱向 `top` / `bottom`，救不了。

- 模板加 `data-header-theme="light"`。寫 `light` 而非 `orange` 有兩個理由：
  ① `AppHeader` 在 `onMounted` 一次性 `querySelectorAll('[data-header-theme]')` 收集 `themeEls`，
  屬性必須在 SSR 輸出裡就存在才收得到；
  ② `prefers-reduced-motion` 與 `/#media` 深連結這兩條降級路徑不建 timeline、橘塊根本不出現，
  留在 `light` 天然正確。
- `buildMotion()` 末端立刻改成 `orange`（progress 0＝滿版橘），之後由 ScrollTrigger 的
  `onUpdate` 每幀依 progress 重算，門檻由 `NARROW_DUR / tl.duration()` 推導、**不寫死比例**
  （加減拍數不必重算）。
- **為什麼不用 `tl.set(section, { attr: {...} })`**：那要賭 GSAP 零秒 tween 在 scrub 倒帶時的
  revert 語意。`onUpdate` 的可逆性是顯而易見的，不需要驗證框架行為。
- **為什麼比對 `self.progress` 而不是 `tl.time()`**：不必假設 ScrollTrigger 在呼叫 `onUpdate`
  之前已經推進過 timeline。

`AppHeader` 每次 scroll 都重讀 `el.dataset.headerTheme`（只有 `themeEls` 是快取的），
所以動態改屬性值有效。

---

## 二、blessing 側：夥伴清單淡出

夥伴清單原本**完全沒有退場**，一路捲出視窗上緣。

### 窗口的終點是幾何鎖死的，起點不是

終點 ＝ `.section3` 下緣抵達視窗頂（＝ media 的 `top top`，收窄唯一能開始的最早時機）。
起點則自由：往回退 `BLESSING_OUT_VH` 個視窗高。**兩個值的分工 —— `OUT_VH` 決定整段多長，
`OUT_FADE` 決定其中多少花在淡出**，其後是純橘的呼吸拍。

> **實作時推翻了原稿的兩處**：
> ① 原稿寫「窗口固定為一個視窗高，幾何保證，不需常數」—— 起點其實是自由的，
>    吃滿 100vh 沒有理由。加上 media 拍 0 的 35vh，整段過場 135vh，實測過長 →
>    改成 `OUT_VH 0.6` ＋ fade `0.85`（60 + 20 ＝ 80vh）。
>    代價：淡出起點提前，此時夥伴清單頂端已被視窗頂切掉約 240px。
>    要換回「面板完整時才開始淡」就把 `OUT_VH` 調回 0.75 以上。
> ② 原稿的節奏旋鈕寫「①要更慢 → `.section3` 加 `padding-bottom`」，**那是錯的**：
>    padding 會把接縫與整個淡出窗口一起往下推，面板卻不動，等於在淡一個已經捲出畫面的東西。

### 夥伴清單要 sticky 定住才讀得完（原稿沒有的東西）

面板塊高約 778px、視窗約 900px，「完整在畫面上」的捲動距離只有兩者之差（≈122px），
**跟過場長度無關 —— 不定住就一定來不及看**。故 `.section3__partners` 改 `sticky top: 0`，
定住距離 `BLESSING_PARTNERS_HOLD_VH = 1` 個視窗高，由 `.section3__partners-hold` spacer 撐出來
（sticky 的活動範圍是父層的 **content box**，用 `.section3` 的 padding 撐不出來 ——
`Media.vue` 同一個坑）。

⚠️ **只在它塞得進視窗（扣掉 header）時才定住**。塊高逐斷點不同（pc 778 / pad 1044 / mob 769），
pad 在 1024 高、mob 在 667 高的視窗都比視窗還高；那種情形定住會讓下緣永久留在畫面外
（改成貼底則換成階梯線被切），使用者反而看得更少 → 退回自然捲動、spacer 收成 0。
判斷用 `vhPx()` 的凍結值而非 `window.innerHeight`：後者會隨網址列收合而變，
會讓這個判斷在捲動途中翻面，連帶把 100vh 的 spacer 加進／拿掉，版面直接跳。

定住期間頁面不動但**沒有上鎖**：指標在清單上時 wheel 捲清單（14 家夥伴約 1500px 塞在 600px 高
的面板裡），捲到底瀏覽器自動把捲動接回頁面。

### 曲線與共享軌

`partnersFadeAt()` 沿用檔內既有的 `smoothstep`（同 `symbolIntroClear`）：兩端一階導數為 0，
scrub 淡出的頭尾不會有硬轉折，且它本身已夾在 `[0, 1]`。

`blessingOutProgress` 提升成共享狀態而非 `Blessing.vue` 的區域 ref，理由與 `stairsDone` 相同：
`SEQUENCE` 有它的 part，dev dashboard 要讀得到才調得動節奏。
`TRACK_VH.blessingOut = BLESSING_OUT_VH` —— 這條軌的長度是設定值，不像 `path` / `forumPath`
得靠量測，所以 dashboard 給得出 vh。

樣式上，`.section3__partners.is-out` **必須關掉 transition**：scrub 驅動下 0.4s 補間會讓每一幀
滯後，手感發黏。它與 `.is-in` 特異度相同（0,2,0），寫在後面所以贏；回捲時 `is-out` 移除、
`is-in` 的 `opacity: 1` 接上，值相同不會跳。刻意不寫 `pointer-events`，讓它從 `.is-in` 繼續
繼承 `auto` —— 淡出過程中面板仍可捲動、可聚焦。

---

## 三、不做的事

- **不新增過場元件、不做兩顆橘塊的交棒。** media 的 morph 本來就能從更大尺寸起手；
  多一個元件只是多一道要 pixel-perfect 對齊的接縫（見 `FORUM_PLANE.scale` 的
  「交棒不可看到縮一下」不變量）。
- **不把 morph 往上挪、不提早 pin 起算。** 見第一節：買不到收窄的跑道。
- **不做①②重疊。** 要重疊就得移交底色所有權：`.section3` 的橘底提前結束（改白），
  那一屏的橘改由一個橘幕元素提供、夥伴清單疊在橘幕之上，橘幕才能在接縫之上就開始收窄
  而不露缺口。而橘幕必須住在 blessing（z-order 才自然）→ 又回到兩顆橘塊交棒。
- **不 pin 夥伴清單原地淡出。**（註：後來以 sticky 做了「定住閱讀」，但那是在淡出**之前**的
  獨立一段，不是把淡出本身 pin 住。）
- **不把 04.media 納入 SEQUENCE。** 現有註解說它「整段是時間軸驅動、用捲動 % 定址會誤導」，
  其實它是 `scrub: true`、定址是成立的 —— 但那是獨立的整理。
