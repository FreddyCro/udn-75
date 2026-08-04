# 論壇段設計線（forum core path）對位規則

橘核心在論壇段沿一條設計線蛇行下行。這份文件說明**線是怎麼被放到正確位置的**、
**改文案／改版時什麼會自動跟上、什麼要手動重算**，以及**重新對位的最省力做法**。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| [`app/components/02.forum/ForumCorePath.vue`](../app/components/02.forum/ForumCorePath.vue) | 可見線的 svg（手貼 Figma 匯出）＋ `layout()` 定位 |
| [`app/utils/orange-core-config.ts`](../app/utils/orange-core-config.ts) → `FORUM_PATH` | 每段線的尺寸、錨點、位移、驅動用中心線 `motion` |
| [`app/components/02.forum/ForumEvent.vue`](../app/components/02.forum/ForumEvent.vue) | 錨點元素 `.forum-event__date`（帶 `data-forum-anchor`） |
| `scripts/extract-centerline.mjs` | 從可見線的 outline 抽出中心線 → `motion` |
| `scripts/verify-centerline.mjs` | 驗證抽出的中心線確實貼合可見線 |

---

## 定位模型

`.sec2__path` 是 `max-width: 1280px; margin: 0 auto; position: relative`，
**它就是設計稿座標系**（pc 稿寬 1280，所以 Figma 的 x 可以直接當 px 用）。

⚠️ 段落頂端那 140px 留白**必須掛在 `.sec2__path` 上，不能掛回 `.sec2`**。
線的座標原點是 `.sec2__path` 的 padding box，留白掛在 `.sec2` 會讓原點下沉 140，
線就不是從黑白接縫進場、而是從主標高度才開始（2026-08-04 修正）。

`.forum-path` 以 `inset: 0` 疊在其上，每段 svg 是它的絕對定位子元素。
`layout()` 每次量測後寫入 `left` / `top`：

```
left = 錨點.left − 容器.left + offset.x
top  = 錨點.top  − 容器.top  + offset.y
```

**線只平移、不縮放**。所以視窗寬於 1280 只是左右留白，線與內容不會產生相對位移。

重新量測的時機只有三個：`onMounted`、`document.fonts.ready`、`resize`（debounce 150ms）。
**刻意不逐幀量測** —— 錨點捲離視窗後逐幀讀 rect 會讓圖層跟著跑掉。

### 錨點是具名的，不是索引

錨點用 `[data-forum-anchor="論壇二"]` 選取（值 ＝ `section2.json` 的 `event.no`），
不是 `querySelectorAll('.forum-event__date')[1]`。增刪場次、重排順序都不會讓線靜默錨到別場身上。

---

## 改東西的時候，什麼會自動跟上

| 你改了什麼 | 線要不要動 | 為什麼 |
| --- | --- | --- |
| 大標／內文／地點的字數 | **不用** | 這些群組都 `position: absolute` 釘在設計稿座標，不推擠任何東西 |
| 論壇一的長 bio 變長變短 | **不用** | 論壇二整段被往下推，但 svg2 錨定在論壇二的日期組，會一起跑 |
| 換字體、字體 fallback | **不用** | `document.fonts.ready` 會重新量一次 |
| 視窗寬度 | **不用** | 只平移不縮放，且容器固定 1280 置中 |
| 日期組本身的版位（`.forum-event__date` 的 `top`/`left`） | **要**，改 `offset` 兩個數字 | offset 是相對錨點的 |
| 段落主標 `forum.heading` 的行數 | **要，而且是隱性的** | 見下方 ⚠️ |
| 換掉可見線 svg | **要**，`w`/`h`/`offset` 全部重算 ＋ 重跑 `extract-centerline.mjs` | |

### ⚠️ 隱性依賴：svg1 的進場點

`FORUM_PATH.pc[0].offset.y` 是反推出來的——目的是讓線的頂端**剛好落在容器 y ＝ 0**
（核心從上一段交棒下來的落點）。它的值就是「論壇一日期組相對容器的 y」取負號。

所以只要 `.sec2__heading` 的行數／字級／margin、或論壇一自身的版位一變，日期組的 y 就變，
線會跟著日期跑，**但它的頂端就不再是 y ＝ 0 了**，而且畫面上不會有任何錯誤訊息。

> 這不是假想的風險：2026-08-04 版位調整後，日期組的 y 從 1034 掉到 827.6，
> 線的起點就跑到容器上方 −204px（往上溢出到 `.sec2` 的 padding 區），offset.y 隨之改為 −828。

改主標或論壇一版位時，用下面第 3 步的 console 片段量一次 `論壇一` 的 y，把負值填回去。

同理，`offset.x = 59` 是「stub 對齊容器水平中心 640」反推的：`640 − 473(stub 在 viewBox 的 x) − 108(錨點 x)`。

---

## 重新對位的流程（現行做法）

`offset` 目前的語意是「**svg 畫布左上角**相對錨點左上角的位移」，這個數字沒有視覺意義，
所以流程需要一次瀏覽器量測：

1. **在 Figma 量出目標**：線的起點要落在容器座標的哪裡 → `(Tx, Ty)`
2. **讀起點在 viewBox 裡的座標**：直接抄 `motion` 開頭的 `M` 指令 → `(Sx, Sy)`
   （例：svg2 是 `M418.78 13.69`）
3. **量錨點相對容器的座標**：開 dev server，捲到論壇段，貼這段到 console → `(Ax, Ay)`

   ```js
   const root = document.querySelector('.sec2__path').getBoundingClientRect();
   const a = document.querySelector('[data-forum-anchor="論壇二"]').getBoundingClientRect();
   console.log({ x: a.left - root.left, y: a.top - root.top });
   ```

   ⚠️ `.sec2__path` 在 `agendaRevealed` 之前是 `opacity: 0`，但 opacity 不影響 layout，
   量得到；看不到線的話在 console 下 `document.querySelector('.sec2__path').style.opacity = 1`。

4. **算出 offset**：`offset = (Tx − Sx − Ax, Ty − Sy − Ay)`
5. 填進 `FORUM_PATH.pc[n].offset`，**把推導過程寫進註解**（現有兩段都有，照抄格式）

---

## 想更省力的話（尚未實作，依投報率排序）

### (a) 把 `offset` 的語意換成「線的起點要落在哪」— 約 5 行

```ts
/** 線的起點在 viewBox 裡的座標（直接抄 motion 的 M 指令） */
start: { x: 418.78, y: 13.69 },
/** 起點要落在錨點的右下方多少（在 Figma 上量就有） */
at: { x: 268, y: 327 },
```

`left = 錨點x + at.x − start.x`。這樣上面流程的第 2～4 步整個消失：
**在 Figma 量日期組到落點的距離，填兩個數字就好，不用開瀏覽器、不用做減法。**
投報率最高的一項，也最貼合「只有 svg path 和 Figma layout 可用」的工作方式。

### (b) dev overlay — 約 20 行

`?pathdebug` 時把 Figma 那條設計線按設計稿座標疊在下面，順便印出起點實測值與目標的差。
對位變成「看一眼、微調、再看一眼」，不必每次都靠外部量測工具。

### (c) 兩點定位（起點 ＋ 終點，自動縮放）— 約 20 行

現在**每段只釘住一個點**。若一條線同時要「從容器頂端進場」又要「結束在 09/15 的空隙」，
只能保證其中一個，另一個會隨文字變動慢慢飄掉（就是上面 ⚠️ 那個問題的一般化）。

加上 `end: { anchor, at }` 後，用兩點距離算縮放，文字變動時線自己伸縮，**永遠不用手改**。
代價是曲線會被非等比拉伸（小幅度看不出來）。

> **若之後換成 Figma 現行稿的 Vector 276**（一條跨越三場的連續 stroke path，必須同時咬住多個位置），
> (c) 就從加分變成必要。

---

## 其他已知事項

- **目前貼在 `ForumCorePath.vue` 的兩段 svg 來自舊版 Figma 檔**（尺寸 857×3694 / 814×1435）。
  現行 pc 稿改成單一連續 stroke path「Vector 276」（viewBox 664.554 × 4591.36），尚未換過來。
  換線之後，「兩段之間補直線連接段」的規劃就不需要了。
- **可見線是 outline 填色、不是 stroke**（Figma 匯出的通病），所以 SCSS 用 `fill` 不是 `stroke`；
  匯出自帶的 `opacity` 與 `#898989`/`black` 已移除，統一吃 `var(--accent)`。
- **`motion` 不可手改**。它是 `extract-centerline.mjs` 從可見線的 outline 抽出來的中心線，
  手改會讓可見線與驅動線分家。可見線換了就重跑腳本，再用 `verify-centerline.mjs` 驗一次。
- **pad / mob 尚未有線稿**。`FORUM_PATH.pad` / `.mob` 是空陣列，而且 `ForumCorePath.vue` 的
  `segs()` 寫死只回傳 `.pc`——之後補線稿時，**填了陣列還要同步改 `segs()`**，否則不會生效。

  ⚠️ 副作用：因為 `segs()` 不分斷點，**pc 的線在 pad / mob 也照樣渲染**。實測 768 寬時
  svg 右緣落在 1028（容器只有 753），整頁出現橫向捲動（文件寬 1172）。論壇段的文字版位本來就是
  pc-only（全部絕對定位在 1280 座標系），所以這只是「pad/mob 尚未實作」的其中一個症狀；
  真正處理 pad/mob 時要一併解掉，臨時止血可在 `rwd-max('pc')` 內把 `.forum-path` 收掉。
