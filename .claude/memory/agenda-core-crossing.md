---
name: agenda-core-crossing
description: 議程作用中群組為何是「目標／當前分離＋一次走一步」而非每 tick 取樣、箭頭幾何由單位 u 推導
metadata:
  type: project
---

2026-08-07 完成議程的「orange core 穿透」互動與三斷點對稿校正；2026-08-08 因快捲跳號改寫判定機制；
2026-08-11 把判定線從視窗中央改成核心自己、遮蔽粒度從整個議程改成群組。

**判定線 ＝ 核心自己**（2026-08-11 起；原本是視窗中央）。`activeIndex` 是 `Agenda.vue` 的區域
state（沒有跨元件消費者，故不進 `useOrangeCoreProgress`）。

⚠ **視窗中央不等於核心的位置。** 回中節點表只讓核心「大致」跟著中央（pc 實測 −280/+123px，
比議程一組還高），拿中央當播放頭，第一組的箭頭會在核心真正進入群組**之前**就亮、最後一組會在
核心離開**之前**就熄（Liu feedback 4-1「進入前 arrow 不會出現，出去前 arrow 不會消失」）。
修法是 `ForumCorePath.place()` 把 `pt.y − rawP × tailEndY`（＝核心相對視窗中央的偏移，兩個值
都已在手上、不必量 DOM）寫進共享軌 `forumCoreCenterOffset`，Agenda 的播放頭改成
`(scrollY − startScroll) + 偏移`。刻意拆成「主項 ＋ 修正項」而不是傳絕對座標：主項仍由
scroll 事件驅動（見下方的不漏組保證），且絕對座標只能在 `refresh` 之後量。

**遮蔽的粒度是群組，不是整個議程**（同日）：`.agenda__group` 帶 `z-index: 2` ＋ 白底 →
核心穿過整疊群組看不見；`.agenda__actions` 刻意什麼都不掛 → 核心畫在 CTA **之上**，
穿完最後一組就現形。組與組邊界貼齊（下緣線在盒內），故不會在組間閃一下。
⚠ `?pathdebug` 只給設計線上色、不改層序（三處註解曾寫成「把路徑層提到議程之上」，那是錯的）。

⚠️ **「每 tick 取樣、報告播放頭底下那一組」這個做法在快捲時會跳號，已被換掉。**
每組的作用區間長度**正好等於它自己的高度**（top 抵達中央 → bottom 抵達中央），而最短的
一組只有 101px。任何一次 tick 間位移超過該高度的捲動，那一組就從沒有任何一幀被觀察到是
作用中。實測（1440×900）：**200px/幀 得到 `0 1 2 4 5 6`（跳掉 3），30px/幀 才完整**。
跳掉哪一組取決於步伐邊界落在哪裡，所以症狀看起來是隨機的。

**換成 IntersectionObserver 也一樣會跳** —— 它同樣是取樣式的。這是架構性質，不是某個 API 的缺陷。
（原本選 ScrollTrigger 而非 IO 的理由是 `center` 與 `ForumCorePath` 同一個基準；那個理由仍然成立，
但它不能解決跳號。）

**現行機制：目標與當前分離。**
- `target` 由播放頭直接算出（`targetIndexAt`，可以跳號）
- `activeIndex` 一次只走一步（`stepToward`，`±1`），跟不上時每 100ms 補一步
- 兩者都是 `~/utils/agenda-active` 的純函式，有 vitest 覆蓋

反覆套用 `stepToward` 必然走訪每一個中間索引 → 「不跳號」與「每組都觸發一次」同時成立，
上下兩個方向都成立。

⚠️ **代價（無法兩全）**：快捲時 `activeIndex` 會**落後**於播放頭，不再逐幀等於核心底下
那一組。要嘛允許跳號、要嘛允許落後，不可能都要。

⚠️ **目標的主項用 `window` 的 scroll 事件，不是 ScrollTrigger 的 `onUpdate`。**
`onUpdate` 只在 trigger 的作用區間內發火 —— 若一次 tick 直接從議程上方飛到下方，
區間內沒有任何一幀，完全不發火。scroll 事件沒有這個死角（已實測：單次 tick 飛越整段仍完整補完 `0…6`）。
ScrollTrigger 仍負責 refresh 時機（resize / 字體 / 斷點）。
偏移那個修正項來自 `onUpdate`，故有死角 —— 但它只是修正項（±240px 上限），主項照樣把每一組掃過。
另外掛了 `watch(forumCoreCenterOffset, sync)`：ScrollTrigger 走 rAF，比 scroll 事件晚一拍，
只靠 scroll 事件會讓最後一次判定吃到上一幀的偏移。

⚠️ `startScroll`（議程頂端抵達視窗中央時的 scrollY）是**絕對**座標，只能在 `refresh`
**之後**量，不能在 `refreshInit` —— 上游 SymbolScene 的 pin spacer 那時還在重算。
`bounds` 相對議程自身頂端，不受這個影響。

**箭頭幾何全由單位 `u` 推導**（pc 9 / pad 6，pad 無稿取 2/3）：箭桿寬 `u`、上下滿撐
`.agenda__rows`；箭尖飾片 `5u × 2u`、底緣距箭桿底 `1u`，四塊 `u × u` 在 `(0,0) (4u,0) (u,u) (3u,u)`。
`left: calc(-0.5px - u / 2)` —— absolute 的 `left: 0` 是 padding 邊，1px border-left 的中心在其左 0.5px。

⚠️ **驗證箭桿置中的公式容易寫反。** `getBoundingClientRect().x` 是 **border-box 最外緣**，
所以 1px 的 `border-left` 佔據 `[R.x, R.x + bw]`、中心在 `R.x + bw/2`（**加**，不是減）。
而 absolute 子元素的 `left: 0` 對齊的是 **padding 邊**（`R.x + bw`），兩者差 `bw/2`。
2026-08-07 的實作計畫把它寫成 `R.x - 0.5`，方向反了，量出來會有系統性 1px 誤差。

`bw` 要讀 `getComputedStyle(rows).borderLeftWidth` 的 used value，不能假設是 1px ——
DPR 非整數時（例如 Playwright 預設的 1.5）hairline 會被裝置像素吸附成 0.667px。
CSS 裡寫死的 `-0.5px` 因此在 DPR 1.5 下會有 0.17px 殘差（DPR 1 時為 0），可忽略。

⚠ **群組上下留白刻意維持 12，不改成稿的 14。** 稿上列區內縮 14、豎線內縮 12（豎線比列區高 2px），
CSS 用 `border-left` 做不出這 2px 差。維持 12 讓 `.agenda__rows` 高度正好等於稿的豎線高 262，
箭頭才對得上；代價是文字內縮差 2px。改成 14 會反過來（文字準、箭頭短 4px）。

mob 作用中是橫幅底色轉橘 ＋ 該組線色轉橘（覆寫 `--agenda-line`）；**pc / pad 不轉線色**，
稿上那兩個斷點只有豎線換成箭頭。這個不對稱是稿本身的。

核心的延續見 `architecture/forum-node-path.md` 第五節的「隱形尾段」。

相關：[[forum-rwd]]、[[rwd-breakpoint-mapping]]、[[hero-core-screen-locked]]
