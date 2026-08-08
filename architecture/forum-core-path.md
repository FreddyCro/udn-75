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

重新量測的時機：`onMounted`、`document.fonts.ready`、ScrollTrigger 的 `refreshInit`
（涵蓋 resize —— `autoRefreshEvents` 預設含它，故不另外掛 resize 監聽）、斷點改變
（`await nextTick()` 等 `v-for` 換完 DOM 後再 `refresh()`）。
**刻意不逐幀量測** —— 錨點捲離視窗後逐幀讀 rect 會讓圖層跟著跑掉。

---

## 驅動線與核心

可見線只負責「被看到」，核心實際跑的是**驅動線**（`.forum-path__motion` 內的
`<path stroke="none">`）：各段 `motion` 先過 `normalizeD`，再用 `layout()` 回傳的平移量搬到
`.forum-path` 座標系（`translateD`），段間補一條從前段末端到後段起點的直線連接段，
串成**單一連續 path**（`joinSegments`）。全部在 `~/utils/forum-path-geometry`，有 vitest 覆蓋。

⚠️ **`normalizeD` 不能省。** 下游一律假設「座標 x,y 交替」，而 Figma 匯出的 stroke path
很常帶 `V` / `H`（例：`temp/vector276-asset.svg` 是 `M383.554 2V209.5C…`）——
那兩個指令只帶單一座標，會讓奇偶判斷整條錯位，**而且不會報錯**。

必須只留一個 `M` —— 多個 `M` 會讓 `getPointAtLength` 在段落之間跳點，接縫就頓一下。
連接段長度每次 `build()` 重算，吸收錨點之間隨字體／版面變動的距離。

起訖兩端都由路徑幾何推導，**不掛任何 DOM `endTrigger`**：

| | 設定 | 意義 |
| --- | --- | --- |
| start | `'top center'` | `.sec2__path` 頂端抵達視窗中央 → 路徑起點 (640, 0) 正好在視窗正中央 |
| end | `() => \`top+=${tailEndY} center\`` | 尾段末端（議程底緣，實測容器 y ≈ 6770）抵達視窗中央；量不到議程時退回 `lineEndY`（5400.5） |

刻意避開兩個陷阱：`.forum-event__date` 是 `position: absolute`，當 `endTrigger` 量不到有效
高度；而 `.sec2` 的 bottom 會被上游 `SymbolScene` 的 pin-spacer 撐高，用它當基準是循環依賴。

實測精度（1440×900）：核心到可見線的距離中位數 **0.59px**、連接段以外最大 **2.05px**
（outline 帶寬約 2px，完美居中的點到邊界就是 ~1px）；往回捲 drift **0px**；
核心精準停在線末端 (327.16, 5400.49)（加了尾段之後改停在議程底緣，見下方「隱形尾段」）。
連接段那 3.5% 的路徑刻意沒有可見線（穿過 09/15 空隙）。

### 隱形尾段（穿過議程）

設計線末端之後追加一段**垂直尾段**，從末端 (327.16, 5400.5) 直下到議程底緣
（`[data-core-tail-end]` ＝ `.agenda` 的根節點）。ScrollTrigger 的 `end` 因此改讀 `tailEndY`。

⚠ **尾段必須用 1:1 的映射，不能沿用路徑段的比例。** 現行 ST 把捲動跨距 `lineEndY`（5400.5）
線性對應到**弧長** `motionLen`（9093）—— 比例 1.68。尾段若吃同一個比例，核心每捲 1px 會下沉
1.68px，走完議程就沉出畫面 908px。

> 這條規則已經被下一節的「回中節點表」概括掉了：節點是照 **y** 等距佈的，垂直尾段上
> 「弧長增量 ＝ y 增量」自然成立，不需要為尾段寫特例。後半段補上設計線之後尾段本身也退場了
>（`tailEndY === lineEndY`），這一節留著只是為了說明當初為什麼不能用單一比例。

其中 `y = rawP × tailEndY` ＝ 此刻落在視窗中央的容器 y（start / end 都錨在 `center`，故線性）。

### 回中節點表（核心不會滑出畫面）

只用「捲動進度 → 弧長」等比是不夠的，因為**驅動線是蛇行的**：弧長比垂直跨距長
（pc 1.50 倍、pad 1.41、mob 1.16）。橫向繞路多的地方核心落後於視窗中央、近垂直的地方超前，
而且誤差會一路累積 —— 補上後半段之後實測 pc **−689/+445px**、pad −686/+120、mob −429/+60，
900 高的螢幕半屏只有 450，核心整顆滑出畫面。

`buildArcKnots()`（`~/utils/forum-path-geometry`）在 `build()` 時沿驅動線取樣 512 點、把 y
單調化，再**每 `FORUM_CENTER_KNOT_VH × 視窗高` 的 y 反查一個節點**。`place()` 的
`arcAtCenterY()` 只在節點之間做線性內插：

| | 行為 |
| --- | --- |
| 節點上 | y 精準等於視窗中央 → 偏移歸零，誤差不跨段累積 |
| 節點之間 | 仍照弧長等比 → 「橫向繞路時衝得快」的手感完全保留 |

節點間距吃視窗高（不是固定 px）：螢幕越矮容許的偏移越小，節點就自動越密。
經驗法則 **偏移 ≲ 間距的一半**（`test/forum-path-geometry.spec.ts` 有守這條）。

⚠ **不要把間距縮到 0**（＝把 y 硬釘在視窗中央）。線上有近水平的段（pc 在 y≈7400 有 340px 弧長、
dy≈0），y 一被釘住，那段就得在幾 px 的捲動內走完 —— 實測橫向速度飆到 **77 px/px**，看起來就是
核心瞬移。節點式的重點正是「粗尺度對齊、細尺度放行」。

逐格捲動實測（核心中心相對視窗中央，括號是橫向速度上限）：

| 視窗 | 偏移 | 橫向速度 |
| --- | --- | --- |
| 1440×900 `?highlights=1` | −280 / +123 | 2.70 px/px |
| 1024×900 `?highlights=1` | −198 / +170 | 2.30 |
| 414×896 `?highlights=1` | −138 / +88 | 1.54 |
| 1440×700 `?highlights=1` | −204 / +142 | 3.16 |
| 375×667 `?highlights=1` | −119 / +63 | 1.62 |
| 375×667 預設（無精彩活動） | −115 / +67 | 1.61 |

`forumPathProgress` 的語意刻意維持「**設計線**走完的比例」（尾段一律 1），故下游的
`forumPathRiding` 不受影響。

**核心在尾段全程看不見**，靠 `Forum.vue` 的 `.sec2__pin { position: relative; background: #fff }`
遮蔽 —— 原本 `.sec2__path` 是 positioned、`.sec2__pin` 是 static，positioned 會畫在 static 之上，
核心會浮在議程**上面**。兩者同層之後由 DOM 順序決定，`.sec2__pin` 在後 → 在上。白底是必要的：
原本靠 `.sec2` 的白底，那是祖先，遮不到。

實測（1440×900）：設計線末端在 page y 11458.5、`.agenda` 頂緣 11502 → **交接窗只有 43.5px**。
那 43.5px 內核心停在視窗中央不動，議程頂緣升上來咬住它，同一瞬間第一組的箭頭亮起。
加尾段之前的舊行為是核心停住後隨頁面往上飄出畫面（可見約半個視窗）。

### 兩個容易漏掉的顯隱規則

**路徑核心在 `p = 0` 時必須藏著**（`.forum-path__core` 的 `is-riding`）。它是隨頁面捲動的
absolute 元素，若一直可見，段落進場到交棒點之間（50vh）畫面上會同時有它與中央那顆固定橘點
—— 實測相距 200px。顯隱刻意不加 transition：交棒點兩顆重合，瞬切看不出來，淡入反而會閃。

**`reset()` 要把 `forumPathProgress` 一併歸零**，不能只清 `forumPathActive`。從 pc 切到
pad/mob 時它會留著殘值，`forumPathRiding` 卡在 true，而 `place()` 已因 `motionLen = 0` 提早
return，方塊就停在最後一次的 transform 上 —— 變成論壇段裡一顆不會動的橘方塊。

---

## 從符號段交棒

`ForumCore` 的黑底與橘點吃兩個不同條件：黑底在 `[coreIn, coreOut)`，橘點則從 `coreIn`
一路撐到路徑接手（`forumPathProgress > 0`）。交棒那一刻兩顆在同一點（實測相差 1.6px）、
同尺寸、同色，故一幀重疊也看不出來；往回捲時 `p` 回到 0，橘點在視窗中央原地出現。

橘點在交棒時的消失是**瞬間**的（`is-instant-hide`）：兩顆重合但路徑核心隨即沿線離開，
若還淡出 0.4s，中央會留一顆停著的殘影。只在「已交棒且該消失」時關掉 transition，
所以 `coreIn` 的淡入（與 SymbolFace 的 crossfade）仍是 0.4s，pad/mob 的 `coreOut` 淡出也照舊。

⚠️ `coreOut`（320vh ＝ 符號段捲完）與交棒點（370vh）之間有 **50vh** 的「懸停期」，橘點在那段
期間停在視窗中央不動（背景從 `.sec-symbol` 的黑換成 `.sec2` 的白，接縫升上來咬住它）。

**50vh 是幾何下限，不能再縮。** 交棒點 ＝ 符號段捲完再 +50vh，而那個位置被「路徑起點必須落在
視窗正中央」的零跳點幾何鎖死。`coreOut` 已經推到 1.0（2026-08-05，原為 0.9 ＝ 懸停 82vh）。
要更短就得動交棒幾何、犧牲零跳點保證，或改成「懸停期間橘點跟著接縫往下漂」的另一種設計。

也因為 `coreOut` 推到 1.0，議程的淡入拆成獨立的 `FORUM_HANDOFF.agendaIn`（留在 0.9）——
`coreOut` 那一刻符號段底緣剛好抵達視窗底，若淡入跟著它，那 0.4s 會在畫面底緣被看見。

### 錨點是具名的，不是索引

錨點用 `[data-forum-anchor="論壇二"]` 選取（值 ＝ `section2.json` 的 `event.no`），
不是 `querySelectorAll('.forum-event__date')[1]`。增刪場次、重排順序都不會讓線靜默錨到別場身上。

⚠️ **`offset` 是相對錨點的，不要拿註解裡的絕對座標去比對實測值。**
`FORUM_PATH.pc[1]` 的註解寫「起點要落在容器 (569, 3854)」，那是論壇二錨點還在 y=3526.6
時推導的；錨點後來隨 140px 留白搬家而下移 140，線一起跟上了，所以現在實測起點是
(568.8, 3994.3) —— **相對關係仍正確**（`15` 字框 x 625–766.3 / y 3908.4–4032.4，起點在其
左側下半部）。2026-08-04 曾因此誤判為「seg2 偏移 140px」，差點改壞一個手工校準過的值。
要驗對位就驗相對關係（起點是否落在該落的字旁邊），不要驗絕對數字。

### 線稿是資料，不是 template

每個斷點的線都放在 `FORUM_PATH[bp]`，一段一個 `ForumPathSeg`：`line` 是可見線的 `d`、
`motion` 是驅動用中心線、`kind` 決定 `line` 吃 `fill`（outline 匯出）還是 `stroke`（真描邊）。
template 是 `v-for`，所以**段數不固定** —— pc 是兩段，單一連續線稿也跑得動。

`kind: 'stroke'` 時 `motion` 直接等於 `line`（描邊 path 的 `d` 本身就是中心線），
不需要跑 `scripts/extract-centerline.mjs`。

斷點由 `ForumCorePath.vue` 的 `bp` ref 決定（`PC_BREAKPOINTS` / `TABLET_BREAKPOINTS`，
**不是** `~/utils/get-device` —— 它的 pad/pc 界線是 1023，與設計稿的 1280 不合）。
`bp` 初值是 `null`：SSR 與 client 首次渲染都不出線，掛載後才量測並渲染。
這是刻意的 —— 這層純裝飾且位置全靠 JS 量測，而各斷點段數不同，SSR 猜錯就 hydration mismatch。

空陣列（目前的 `pad` / `mob`）＝ 不渲染、不建驅動線、`forumPathActive` 為 false。
**填資料就生效，不需要改程式碼。** 但論壇段的文字版位目前全是 pc 1280 座標的絕對定位，
所以錨點在 pad / mob 仍停在 pc 位置 —— 線會忠實地錨到一個錯的地方，要看起來對得先做那個斷點的版位。

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

> **若之後補 pad 線稿**（Vector 276 是一條跨越三場的連續 stroke path，必須同時咬住多個位置），
> (c) 就從加分變成必要。

---

## 其他已知事項

- **「Vector 276」是 pad 斷點的線，不是 pc 的。** `temp/vector276.svg` 的外層是
  `<g id="pad">` → `<g id="主頁_pad">`，`<rect width="768">`；`temp/vector276-asset.svg`
  是同一條線的 1× 匯出（664.554 × 4591.36），兩者座標比恰為 0.892109。
  pc 用的仍是 `FORUM_PATH.pc` 那兩段（已實測校正，svg2 起點誤差 0.2 / 0.3px）。
  Vector 276 是單一連續 stroke path，`kind: 'stroke'` ＋ `motion` 直接等於 `line` 即可貼上，
  不需跑 `extract-centerline.mjs`；`joinSegments` 對單段不加連接段。
- **可見線是 outline 填色、不是 stroke**（Figma 匯出的通病），所以 SCSS 用 `fill` 不是 `stroke`；
  匯出自帶的 `opacity` 與 `#898989`/`black` 已移除，統一吃 `var(--accent)`。
- **`motion` 不可手改**。它是 `extract-centerline.mjs` 從可見線的 outline 抽出來的中心線，
  手改會讓可見線與驅動線分家。可見線換了就重跑腳本，再用 `verify-centerline.mjs` 驗一次。
- **pad / mob 尚未有線稿**。`FORUM_PATH.pad` / `.mob` 是空陣列 → 那兩個斷點不渲染任何線、
  不建驅動線。`segs` 已改成依斷點回傳的 computed，所以**填了陣列就生效，不需要改程式碼**
  （2026-08-04；先前的「還要同步改 `segs()`」已不適用）。

  ⚠️ **768 寬的整頁橫向捲動與設計線無關。** 實測（2026-08-04）收掉線之後文件寬仍是 1172 ——
  元凶是論壇段的文字版位：`.forum-event__quote`（left 718 ＋ width 454）與
  `.forum-event__speakers`（margin-left 463 ＋ width 709）右緣都落在 1172，而設計線的右緣是
  1028，從來不是最寬的東西。本文件先前把它歸因於設計線是**錯的**。
  這屬於「pad/mob 版位未實作」，要連同 `ForumEvent.vue` 那一整套 pc 絕對定位一起處理。
