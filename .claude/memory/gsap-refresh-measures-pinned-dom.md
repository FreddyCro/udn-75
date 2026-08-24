---
name: gsap-refresh-measures-pinned-dom
description: ScrollTrigger 的 refreshInit 早於 revert pin ⇒ 在 pin 生效／跑完時做的量測會多算一整段 pin 距離
metadata:
  type: project
---

`ScrollTrigger.refresh()` 的順序是（`node_modules/gsap/ScrollTrigger.js`）：

```
L495  _dispatch("refreshInit")     ← 掛在這裡的 listener 量到的是「pin 還套著」的 DOM
L497  _sort && ScrollTrigger.sort()   ← _sortY 也是此刻量的（同樣帶著 pin 位移）
L498  _revertAll()                 ← pin 才被拆掉
L508  每條尺 .refresh()             ← 過程中 pin 會被重新套上 ⇒ 後面才 refresh 的尺也可能量錯
L568  _dispatch("refresh")         ← 此時 pin 已重套，一樣不是乾淨的量測時機
```

也就是說：**「refresh 時重新量測版面」這件事，只要量的元素住在某個 pin 的子樹裡，就不保證量得到 in-flow 位置。** 被 pin 的那條尺自己是對的（GSAP 量自己之前會先 revert 自己的 pin）；壞的是**別人**去量 pin 內的元素。GSAP 對這件事的官方解法是 `pinnedContainer`（trigger／endTrigger 在被 pin 的元素內時必須宣告）。

**實測（1527×868，`.sec1__inner` 被 hero 轉場 pin，pin 距離 `TRANSITION_VH × --vh` ＝ 1041.6px）**
`OrangeCorePath.build()` 掛 `refreshInit`、量 `.sec1__intro`（在 pin 內）：

| refresh 發生的 scrollY | 路徑終點 ey | `introFadeST` 區間 |
|---|---|---|
| 20 / 1300 / 2000（pin 起點之前） | 2614 ✓ | 1833/2181 ✓ |
| 2600（pin 進行中，inner 是 fixed） | 3033（+419，隨位置浮動） | −348/0 |
| 3400 / 8000（pin 已跑完，inner 被推下 pin 距離） | 3655（+1041.6） | 2874/3222（+1041.6） |

後果（2026-08-23 使用者回報「core 常常沒出現、黑色劃開的轉場也沒出現」的根因）：路徑長 2180 而捲動範圍仍是 1139 ⇒ core 以 **1.91×** 速度往下墜，scrollY≈1560 就掉出視窗底（實測 1600 → 螢幕 944）；轉場開窗錨在 core 的螢幕矩形，錨點跑到視窗外 ⇒ 黑色長條不是從中央長出來。

**How to apply:**
- 症狀會**自癒**（之後任何一次在 pin 起點之前發生的 refresh 就量回正確值）⇒ 表現是「常常」而不是「總是」，別因為重現不到就當成沒事。
- 觸發源不必是手動 refresh，實測兩條都會自己來：① body 高度變動（延遲載入的圖，+60px 就夠）→ `refreshOnContentResize`；② 任何 `resize` 事件（拉視窗、Ctrl±、開 DevTools、轉向）→ GSAP 自己的 refresh。所以「捲到 symbol／forum 段時圖載完」或「途中拉一下視窗」就會踩到。
- hero 這兩處已於 2026-08-23 修掉（守門在 `test/hero-pinned-container.spec.ts`）：`OrangeCorePath` 不再量 `endEl`（`ey = sy + (st.end − st.start)`，1:1 變成構造上的不變式）、幾何重建從全域 `refreshInit` 改掛本尺的 `onRefresh`，並給它與 `introFadeST` 都加上 `pinnedContainer: .sec1__inner`。
- 別處若還要在 refresh 時量 pin 內的元素，**不要**只靠 `refreshInit`：改成不量 pin 內的元素，或給那條尺宣告 `pinnedContainer`（GSAP 會在量測前先把那個 pin 拆掉）。
- 這一類錯位不會噴任何錯誤，驗收只能靠量：用 `?pathdebug` 的 `__udnST` 在**不同捲動位置**各做一次 refresh，比對 path 的 `d` 與各尺的 start/end。

相關：[[hero-core-screen-locked]]、[[verify-scroll-driven-visuals]]
