---
name: agenda-core-crossing
description: 議程作用中群組的判定線是視窗中央、為何用 ScrollTrigger 而非 IntersectionObserver、箭頭幾何由單位 u 推導
metadata:
  type: project
---

2026-08-07 完成議程的「orange core 穿透」互動與三斷點對稿校正。

**判定線 ＝ 視窗中央**，每個 `.agenda__group` 一個 ScrollTrigger（`top center` → `bottom center`），
寫入 `Agenda.vue` 的區域 `activeIndex`（沒有跨元件消費者，故不進 `useOrangeCoreProgress`）。

**刻意不用 IntersectionObserver**：`center` 就是 `ForumCorePath` 的 `start` / `end` 用的同一個
視窗中央，頭尾對齊因此是構造上的、不是兩套機制湊巧同意；IO 要做 50vh 判定得用
`rootMargin: '-50% 0px -50% 0px'`（零高度 root band），zero-area intersection 的回報行為
跨瀏覽器不保證一致。

⚠ `onToggle` 的 else 分支必須是 `else if (activeIndex === i)`。無條件清成 `null` 會在群組邊界上
出事 —— 離開事件的送達順序不保證，「新組先 enter、舊組後 leave」會把剛設好的新值清掉，閃一幀空白。

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

核心的延續見 `architecture/forum-core-path.md` 的「隱形尾段」一節。

相關：[[forum-rwd]]、[[rwd-breakpoint-mapping]]、[[hero-core-screen-locked]]
