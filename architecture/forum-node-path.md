# 論壇段設計線 · waypoint 路徑產生器（pc / pad / mob）

三個斷點的線都**由程式依版面即時算出來**。pad / mob 從一開始就是（理由見第一節）；
pc 前半段原本是「手貼 Figma 匯出的 `d` ＋ 單點平移對位」（見
[`forum-core-path.md`](./forum-core-path.md)，已成歷史文件），2026-08-08 一併遷過來 ——
少一套機制，也不必再為了「標題行數變了」重算平移的 `offset.y`（歷史上改過兩次）。

這份文件管三件事：**線是怎麼算出來的**、**每個點掛在哪個 element 上**、
以及**你想調整時要怎麼跟我說**。

| | 全部三個斷點 |
| --- | --- |
| 幾何來源 | `FORUM_PATH_NODES[bp]` 的 waypoint ＋ 產生器 |
| 對位方式 | 每個點各自量測，逐點定位 |
| 隨視窗寬 | 橫向按容器寬比例縮放 |
| 隨文字高度 | 全部跟著量測值走 |
| 前半段編號 | pc `W0–W28` / pad `Q0–Q13` / mob `P0–P13` |
| 後半段編號 | pc `R0–R6` / pad `S0–S6` / mob `T0–T7` |

> pc 的節點是從舊的手貼中心線抽出來的（不必回 Figma —— 那份 `motion` 本來就是中心線）。
> 抽法與實測誤差見 `app/utils/forum-node-path.ts` 的 `PC_FRONT_NODES` 檔頭註解：
> 擬合偏差 2.36px、新舊線實測最大差 2.55px／平均 1.21px。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/utils/forum-node-path.ts` | 型別 ＋ `FORUM_PATH_NODES`（waypoint 資料）＋ `FORUM_PATH_STROKE` ＋ `buildNodePathD()` |
| `app/components/02.forum/ForumCorePath.vue` | 該斷點有 waypoint 就走 `buildFromNodes()`，否則走既有 `segs` 分支 |
| `test/forum-node-path.spec.ts` | 兩個斷點的黃金樣本 ＋ 各旋鈕的單元測試 |
| `temp/pad.svg` | pad 稿的中心線（真描邊，`stroke-width 4` / `stroke-opacity 0.1`）|
| Figma（file `HOt7xNcSTpina7WqNv9MVn`）| 線稿：pad `2679:90235`＋`Vector 276`、mob `2584:35109`；<br>版面：pad `2652:53307`、mob `2566:84799` |

---

## 一、為什麼 pad / mob 不能寫死

1. **稿的寬度只是一個點，斷點是一段區間。** mob 稿 414、斷點 ≤767；pad 稿 768、
   斷點 768–1279。兩張稿的線本來就撞到左右緣（mob P5/P6/P7、pad Q10），
   而現有機制**只平移不縮放** —— mob 實測在 320 寬會超出畫面約 94px。
2. **這兩個斷點的版面是流排版。** `.forum-event` 在 pad / mob 被整組退回 flex 直排
   （`position: static` ＋ `display: flex`），只有 pc 是絕對定位釘死在 1280 座標。
   所以垂直位置隨字數、字體 fallback、視窗寬一起變 —— 寫死的 y 一定會飄。
   實測：同一份內容在 pad 1279 寬時容器高 4768，768 寬時 5164（差 396px）。
3. **稿本身就是照版面拉的。** 兩張稿各 14 個轉折點，y 幾乎都落在某個版面區塊的
   上緣或下緣（mob 誤差 1–6px、pad 2–34px，見第四節）。既然設計意圖是「貼著區塊」，
   就該直接量那個區塊，而不是把量測結果的快照抄成常數。
4. **pad 的線更是非做不可。** `Vector 276` 是一條跨越三場的連續線，**必須同時咬住
   多個位置**；單點平移只能釘住一個點，其餘會慢慢飄掉
   （`forum-core-path.md:217` 早已預告過這件事）。

---

## 二、資料模型

線 ＝ **有序的 waypoint 陣列**。每個點自己決定橫向位置與縱向錨點，
點與點之間用「直線」或「彎」連起來。整條線是單一連續 `d`（只有一個 `M`）。

```ts
/** 錨點的查找方式（縱橫共用） */
export type ForumPathTarget = {
  /** 限定在哪一場之內（＝ data-forum-anchor 的值）；省略則全域查 */
  event?: string;
  /** 在上述 scope 內的選擇器 */
  sel: string;
  /** 同一選擇器命中多個時取第幾個（預設 0） */
  nth?: number;
};

/** 縱向錨點：掛哪個 element 的哪一邊 */
export type ForumPathAnchor = ForumPathTarget & {
  /** top＝上緣、bottom＝下緣、fraction＝元素高度的 t 處 */
  edge: 'top' | 'bottom' | 'fraction';
  /** edge 為 'fraction' 時的比例（0–1） */
  t?: number;
  /** 再往下偏移幾 px（可負） */
  dy?: number;
};

/** 橫向錨點：把 x 也掛在某個 element 上（見下方「x 也可以掛 element」） */
export type ForumPathXAnchor = ForumPathTarget & {
  edge: 'left' | 'center' | 'right';
  dx?: number;
  /** 量不到時退回容器寬的比例（0–1） */
  fallback: number;
};

/** 橫向位置：釘左右緣／中心、容器寬的比例（0–1），或掛在某個 element 上 */
export type ForumPathX = 'left' | 'center' | 'right' | number | ForumPathXAnchor;

/** 到下一點的連法 */
export type ForumPathJoin =
  | 'line'
  | {
      /** 出發角：相對兩點連線的夾角（度） */
      relIn: number;
      /** 到達角：同上 */
      relOut: number;
      /** 出發側 handle 長度 ÷ 兩點距離 */
      hIn: number;
      /** 到達側 handle 長度 ÷ 兩點距離 */
      hOut: number;
    };

export type ForumPathNode = {
  /** 穩定編號，永不重排（要插入就用 P7a）。溝通時直接喊這個。 */
  id: string;
  x: ForumPathX;
  anchor: ForumPathAnchor;
  /** 到下一點的連法；最後一點省略 */
  join?: ForumPathJoin;
  /** 刻意偏離設計稿時寫理由（同步記到第七節） */
  note?: string;
};
```

### 兩個公式

**縱向位置**（`m` ＝ 量到的元素矩形，相對容器）：

```
edge 'top'      → y = m.top + dy
edge 'bottom'   → y = m.top + m.height + dy
edge 'fraction' → y = m.top + m.height × t + dy
```

**橫向位置**（`W` ＝ 容器寬，`amplitude` 預設 1）：

```
'left'   → 2
'right'  → W − 2
'center' → W / 2
數字 t   → t × W

以上一律再過 amplitude：x = W/2 + (x − W/2) × amplitude

ForumPathXAnchor（m ＝ 量到的元素矩形）：
  edge 'left'   → m.left + dx
  edge 'center' → m.left + m.width / 2 + dx
  edge 'right'  → m.left + m.width + dx
  量不到        → 退回 fallback × W
  ⚠️ 這一種**不過 amplitude**
```

`'left'` / `'right'` 取 ±2 而不是 0 / W，是為了讓 4px 描邊剛好齊邊不被裁掉。

### x 也可以掛 element

比例（`t × W`）的前提是「要咬住的東西隨容器等比縮放」。**不成立時就得量。**

實例 —— pad 穿過議程的那條垂直線（`Q13` / `S0` / `S1`）：
`.agenda` 是**定寬 608 置中**，`.forum-path` 卻是流動的（`.sec2__path` 上限 1280）。
稿寬 768 時箭頭欄在 202.5、比例 0.262 剛好對上（稿的頂點就是 201.4 ——
設計本來就把線畫在箭頭上），但視窗一寬兩者就分家：

| 視窗寬 | 箭頭 x | `0.262 × W` | 差 |
|---|---|---|---|
| 768 | 194.8 | 197.2 | 2.4 |
| 1021 | 321.5 | 263.6 | **57.9** |
| 1279 | 450.5 | 331.2 | **119.3** |

改掛 `AGENDA_ARROW_X`（`.agenda__rows` 左緣 ＋ 0.5）後三個寬度都是 **0**。

兩個實作決定：

- **掛 `.agenda__rows` 而非 `.agenda__arrow`。** 那條 1px 的 `border-left` 就是箭頭的中軸
  （箭頭是 `absolute`、`left: −0.5px − u/2`、寬 `u`，中心正好落在 border 中心），
  而箭頭平常 `opacity: 0`、mob 更是 `display: none` —— 掛在會消失的東西上不穩。
- **量不到退回 `fallback`，不整條放棄。** 橫向錯位只是線歪掉，比整條消失好；
  而且退路值就是原本寫死的稿比例，行為等同改動前。這與縱向錨點「大聲失敗」的規則
  不同 —— 縱向少一個點會讓後面全部接到錯的鄰居身上（見下一節）。

**三點要一起改。** `Q13 → S0 → S1` 是一條垂直線，只改中間一點會變成斜線。

pc / mob 不需要：pc 的 `.agenda`（1064）與 `.forum-path`（1280 上限）同樣置中於視窗，
相對位移是常數；mob 沒有豎線也沒有箭頭。

**彎的重建**（`L` ＝ 兩點距離，`chord` ＝ 兩點連線的角度）：

```
c1 = p0 + hIn  × L × unit(chord + relIn)
c2 = p1 − hOut × L × unit(chord + relOut)
→ C c1 c2 p1
```

角度是**相對 chord** 的，所以視窗變寬變窄、文字撐高撐矮時 chord 跟著旋轉縮放，
**彎的形狀不會變形**。螢幕座標 y 向下，故正角度＝順時針。

### 產生器的介面

量測與計算刻意分開：**產生器是純函式，DOM 只出現在注入的 `measure` 裡。**
這樣 vitest 可以直接餵假的量測值跑黃金樣本，不需要 jsdom。

```ts
/** 量測介面：吃錨點吐「相對容器的 border box」；量不到回 null */
export type ForumPathMeasure = (
  t: ForumPathTarget
) => { top: number; height: number; left: number; width: number } | null;

/**
 * 依 waypoint 與量測值算出整條線。
 * 回傳的 d 已在 .forum-path 座標系（＝ .sec2__path 的 padding box），
 * 只有一個 M，可直接同時餵給可見線與驅動線。
 * 任何一個錨點量不到 → 回 null（見下）。
 */
export function buildNodePathD(
  nodes: ForumPathNode[],
  ctx: { width: number; measure: ForumPathMeasure; amplitude?: number }
): { d: string; endY: number } | null;
```

`endY` ＝ 最後一點的 y，給 `ScrollTrigger` 的 `end` 用（取代 `lastPoint(d)`）。

### 一個必須「大聲失敗」的規則，與它的例外

**任何一個錨點量不到（`measure` 回 `null`）→ 整條線放棄，不要跳過那個點。**

跳過一個 waypoint 會讓後面所有點的連法接到錯的鄰居身上，線會靜默變形。
這與 `forum-core-path.md` 裡 `layout()` 回傳定長陣列的理由相同：
寧可什麼都不畫（走 `reset()`），也不要畫一條錯的。

**例外：標了 `optional: true` 的點。** 那是「可能整塊不存在」的區域 ——
例如 `?highlights=1` 沒帶時整個精彩活動段落不渲染。這種點量不到就跳過，
由前一個存活點直接連到下一個存活點；因為角度是 chord 相對的，chord 變長時
彎會自然拉開、不變形。

判準很簡單：**這個 element 有沒有可能合法地不存在？**
有 → `optional`；沒有 → 不標，量不到就是 bug，該讓它整條停掉。
（存活點少於 2 個時一樣回 `null` —— 兩點才成線。）

### ⚠️ 事故回顧：必要錨點不可只靠會消失的 placeholder（2026-08-09，`280e727`）

上面那條「大聲失敗」規則曾經**不夠大聲** —— 量不到時是靜默 `return null`，直到下面這個事故
發生才補上 `console.warn`。

**起因**：`ForumEvent.vue` 的講者照片欄位在講者**沒有**照片時渲染
`.forum-event__photo-slot` 佔位符；補上真實照片後改渲染 `.forum-event__photo`，
`-slot` 那個節點整個從 DOM 消失。pc 前半段的節點 `W5`／`W17`（`PC_FRONT_NODES`）當初卻只寫死
`.forum-event__photo-slot` 一種選擇器當**必要**（非 `optional`）錨點。pad／mob 的對應節點
一開始就寫成 `'.forum-event__photo, .forum-event__photo-slot'`（兩者其一存在即可），只有
pc 這兩點漏改。

**症狀**：講者照片補齊之後，`.forum-event__photo-slot` 不再出現 → `measure()` 回 `null`
→ `buildNodePathD` 依規則整條放棄 → `ForumCorePath.build()` 呼叫 `reset()` →
`forumPathActive` 變 false → `forumCoreDotVisible` 退化成 `symbolProgress < coreOut`
這條備援判斷 —— 結果是橘核心 dot 在 `symbolProgress = 1.0` 精準消失、之後永遠不回來，
論壇段設計線整段空白。因為失敗是靜默的，定位耗了不少時間。

**修法（`280e727`）**：

1. 把 pc 的 `W5`／`W17` 改成與 pad／mob 同構的 `'.forum-event__photo, .forum-event__photo-slot'`，
   兩種寫法在 pc 版式下量到的方框一致，講者有沒有照片都能量到。
2. 在 `buildNodePathD` 的必要錨點量不到分支補一行 `console.warn`（點名節點 id 與選擇器），
   把本節開頭那條規則的「大聲失敗」名符其實。
3. `test/forum-node-path.spec.ts` 新增回歸測試：三個斷點的 `FORUM_PATH_NODES` 中，任何
   **非 `optional`** 節點若選擇器提到 `.forum-event__photo-slot`，必須同時涵蓋獨立的
   `.forum-event__photo`（正則排除掉 `-slot` 這個前綴本身，避免天真的字串比對測不出東西）。

**要記住的不變量**：**必要錨點不可以只綁定一個「有可能合法消失」的 DOM 節點** ——
`.forum-event__photo-slot` 是不是存在完全是資料驅動的（有沒有講者照片），這與 `optional`
節點「整塊可能不存在」是同一類風險，差別只在於這裡有備援選擇器可以涵蓋兩種情況，不必整段標
`optional`。新增節點、或稿改版要換錨點時，先問一句：**這個 class 會不會因為資料變了就從 DOM
消失？** 會 → 要嘛涵蓋所有可能渲染出來的變體（像這次的修法），要嘛老實標 `optional`；
絕對不要賭它「現在都有值」。

---

## 三、渲染

線寬全程 4.0px 等寬（實測稿的 outline 帶寬），故：

- `kind` 相當於 `'stroke'` —— **驅動線 ＝ 可見線**，同一個 `d`
- **不需要跑 `scripts/extract-centerline.mjs`**，也不會有可見線與驅動線分家的問題
- 產生器吐出的座標已經在 `.forum-path` 座標系（`inset: 0` of `.sec2__path`），
  不需要 `translateD`
- 單一連續路徑（只有一個 `M`）→ `getPointAtLength` 不會跳點

### ⚠️ 一定要設 `tailEndY`，不只是 `lineEndY`

`ForumCorePath` 的 ScrollTrigger 是 `end: () => \`top+=${tailEndY} center\``，讀的是
**`tailEndY`（隱形尾段末端＝議程底緣）**，不是 `lineEndY`（設計線末端）。
mob 分支必須跟 pc 分支一樣走完整套：

```
pathLen  = 追加尾段前的弧長
lineEndY = 產生器回傳的 endY
tailEndY = measureTailEndY() ?? lineEndY   ← 沒設它就是 0
motionLen= 追加尾段後的總弧長
```

**漏設的後果是靜默的**：`end` 解析成 `top+=0 center`，GSAP 把它夾成 `start + 0.01`
→ 捲動尺零長度 → 核心一進場就跳到路徑末端，看起來像「線畫好了但核心不動」。
2026-08-07 的 prototype 就踩了這個，花了不少時間才定位 —— 徵狀是
`st.end - st.start === 0.01`，那個 `0.01` 就是 GSAP 的夾值指紋。

可見線只吃**路徑段**（`out.d`），尾段只加到驅動線上 —— 尾段全程被議程的不透明白底
遮住，畫出來反而會從縫隙露餡。

**那一撇（論壇二 09/15）在 mob 不畫。** `build()` 只在 `list2.length === 2` 時
畫連接段斜線；mob 是單段，`slash.len` 自然為 0。稿的 09/15 斜線是靜態圖稿
（Figma `2574:87050`，在 `Group 12892` 內），而路徑在那個 y 帶只走到 x 108–148、
不經過它 —— mob 刻意不沿用 pc 的「核心經過時補那一撇」機制。

**稿末端的箭頭（邊長 23.1 的正三角形）不畫。** 它在稿裡是獨立的填色三角形、
不在驅動線上。

---

## 四、waypoint 表

`dy` 由設計稿反推（換算方式見第九節）。⚠️ 標記的項目見第七節。

### pad（`Q0–Q13`，768 稿）

pad 稿是**真描邊**（`stroke-width 4`、單一 `M`、指令只有 `MVCL`），中心線就是 `d` 本身，
控制點直接讀得到 —— 不必像 mob 那樣做 outline 擬合。

| id | x | 錨點 element | 邊 | dy / t | 到下一點 |
| --- | --- | --- | --- | --- | --- |
| **Q0** | `center` | `.sec2__path` | top | **0** ⚠️ | 直線（垂直）|
| **Q1** | `center` | 論壇一 `.forum-event__tag` | bottom | +17 | 彎 |
| **Q2** | 0.744 | 論壇一 `.forum-event__tag` | top | −9 | 彎 |
| **Q3** | 0.867 | 論壇一 `.forum-event__head` | bottom | +64 | 彎（髮夾）|
| **Q4** | 0.303 | 論壇一 `.forum-event__meta` | bottom | −34 | 彎 |
| **Q5** | 0.716 | 論壇一 `.forum-event__photo(-slot)` | top | +208 | 大弧（跨整段 bio）|
| **Q6** | 0.807 | 論壇二 `.forum-event__meta` | top | −7 | 彎 |
| **Q7** | 0.496 | 論壇二 `.forum-event__meta` | top | +86 | 直線 |
| **Q8** | 0.320 | 論壇二 `.forum-event__speakers` | top | +2 | 彎 |
| **Q9** | 0.142 | 論壇二 `.forum-event__speakers` | top | +34 | **硬轉角**（hOut 0）|
| **Q10** | `left` | 論壇二 `.forum-event__speakers` | fraction | **0.7294** | **硬轉角**（hIn 0）|
| **Q11** | 0.160 | 論壇三 `.forum-event__tag` | top | −8 | 彎 |
| **Q12** | 0.820 | 論壇三 `.forum-event__meta` | top | −5 | 彎 |
| **Q13** | `AGENDA_ARROW_X` ⚠️ | 論壇三 `.forum-event__meta` | bottom | +25 | —（終點）|

`Q13` 的 x 掛在議程箭頭欄上（不是比例）—— 稿的 201.4 就是箭頭位置，
但 `.agenda` 定寬置中而容器流動，比例只在 768 稿寬對得上。見第二節「x 也可以掛 element」。
`Q13 → S0 → S1` 三點共用同一個 x，那條垂直線整段落在箭頭上，核心穿過議程時正好接到箭頭。

`Q5→Q6` 是一段 chord 1912 的大弧，橫跨論壇一整段長 bio —— 高度變動最大的區域
交給它吸收，與 mob 用長直線吃掉同一段的作法同構。

`Q9→Q10→Q11` 是**撞左牆的尖角**：兩側 handle 各為 0，退化成硬轉角。
這是 pad 稿特有的語彙（mob 的 P6 是平滑通過）。

### mob（`P0–P13`，414 稿）

| id | x | 錨點 element | 邊 | dy / t | 到下一點 |
| --- | --- | --- | --- | --- | --- |
| **P0** | `center` | `.sec2__path` | top | **0** ⚠️ | 直線（垂直）|
| **P1** | `center` | 論壇一 `.forum-event__tag` | top | +1 | 彎 |
| **P2** | 0.704 | 論壇一 `.forum-event__tag` | top | −7 | 彎 |
| **P3** | 0.829 | 論壇一 `.forum-event__head` | bottom | −6 | 彎（髮夾）|
| **P4** | 0.143 | 論壇一 `.forum-event__venue` | bottom | −4 | 彎 |
| **P5** | `right` | 論壇一 `.forum-event__photo(-slot)` | top | +102 | 直線 |
| **P6** | `left` | 論壇一 `.forum-event__speakers` | fraction | **0.4704** | 直線 |
| **P7** | `right` | `[data-forum-anchor="論壇二"]` | top | +38 | 直線 |
| **P8** | 0.259 | 論壇二 `.forum-event__speaker-label` | top | +22 | 彎 |
| **P9** | 0.713 | 論壇二 `.forum-event__speaker`（nth 0）| top | +54 | 彎 |
| **P10** | 0.781 | 論壇二 `.forum-event__speaker`（nth 1）| bottom | +12 | 直線（垂直）|
| **P11** | 0.781 | 論壇三 `.forum-event__meta` | top | −3 | 彎（髮夾）|
| **P12** | 0.261 | 論壇三 `.forum-event__meta` | fraction | **0.4574** | 彎 |
| **P13** | `center` | 論壇三 `.forum-event__meta` | fraction | **0.7439** | —（終點）|

### ⚠️ 三個不能當錨點的東西（實測踩過）

1. **`.forum-event__bio`** —— 它是 `v-for` 出來的多個 `<p>`（論壇一有 5 段），
   `querySelectorAll(...)[0]` 只會抓到第一段（實測 216 高，整組 1905）。
   P6 因此改掛 `.forum-event__speakers`。
2. **論壇一的 `.forum-event__speaker`** —— pad / mob 用 `display: contents` 攤平重排
   （見 `forum-rwd` memory），**rect 全部是 0**，`getBoundingClientRect()` 量不到。
   論壇二的是 `--card`、有正常 box，所以 P9 / P10 可以掛。
3. **`.forum-event__date`（論壇三）** —— 稿的 `time` 組是 199 高（日期＋時間），
   而實作的 `__date` 只有日期（實測 112）、時間在 `__venue` 裡。
   對應那一組的是 `__meta`（實測 204）。

同理，**論壇二的 `.forum-event__head` 也是 `display: contents`** —— 只有論壇一的可以掛（P3）。

「論壇一 / 二」等前綴的實作方式：以 `[data-forum-anchor="論壇N"]` 的
`closest('.forum-event')` 為 scope 再往下查，**不用文件順序索引** ——
理由同 `forum-core-path.md`「錨點是具名的，不是索引」。

`P13` 是終點，`lineEndY` ＝ 它的 y，`ScrollTrigger` 的 `end` 自動跟著變。

### 為什麼 P2 掛在 P1 的元素上

P2 是彎的**肩點**，沒有對應的版面區塊。掛在跟 P1 同一個 element（`dy: −7`），
它就永遠跟 P1 一起移動、不會被拉開成兩截。

### 為什麼 P6 用 fraction

P6 落在論壇一那段長 bio 裡（稿上是上緣 +457）。bio 是整段裡高度變動最大的東西
（稿上 1431px，字數一改就整段位移），寫死 457 沒有視覺意義 →
改成「bio 高度的 0.32 處」，bio 撐高撐矮它都待在同一個相對位置。

---

## 五、join 參數表

這些數字是**從設計稿抽出來的形狀不變量**，不是量測到的座標 —— 換視窗寬不必重算。

### pad

| join | 長度（稿）| chord° | relIn° | relOut° | hIn | hOut |
| --- | --- | --- | --- | --- | --- | --- |
| Q0→Q1 | 208 | 90.0 | — | — | — | — |
| Q1→Q2 | 194 | −17.9 | −47.8 | +58.8 | 0.300 | 0.516 |
| Q2→Q3 | 463 | 78.2 | −37.3 | +11.8 | 0.257 | 0.229 |
| Q3→Q4 | 513 | 147.7 | **+95.2** | −47.2 | 0.347 | 0.661 |
| Q4→Q5 | 399 | 37.3 | −76.8 | +42.2 | 0.359 | 0.672 |
| Q5→Q6 | 1912 | 87.9 | −8.4 | +2.1 | 0.194 | 0.225 |
| Q6→Q7 | 256 | 158.8 | **+90.9** | −44.5 | 0.395 | 0.936 |
| Q7→Q8 | 314 | 115.5 | — | — | — | — |
| Q8→Q9 | 141 | 166.9 | +68.2 | −47.4 | 0.434 | 0.632 |
| Q9→Q10 | 271 | 112.4 | +7.0 | （無意義）| 0.487 | **0** |
| Q10→Q11 | 240 | 60.7 | （無意義）| −0.6 | **0** | 0.668 |
| Q11→Q12 | 666 | 40.5 | −81.8 | +40.1 | 0.476 | 0.453 |
| Q12→Q13 | 500 | 148.9 | +78.1 | −47.2 | 0.283 | 0.688 |

handle 為 0 的那一側，控制點與端點重合 → 該側的角度不影響結果，填 0 即可。

### mob

| join | 長度（稿）| chord° | relIn° | relOut° | hIn | hOut |
| --- | --- | --- | --- | --- | --- | --- |
| P0→P1 | 334 | 90.0 | — | — | — | — |
| P1→P2 | 83 | −4.7 | −54.2 | +57.4 | 0.41 | 0.57 |
| P2→P3 | 398 | 82.8 | −23.7 | +7.2 | 0.07 | 0.75 |
| P3→P4 | 419 | 133.1 | **+111.2** | −35.8 | 0.23 | 1.01 |
| P4→P5 | 365 | 17.0 | −55.9 | +42.5 | 0.22 | 0.70 |
| P5→P6 | 866 | 118.4 | — | — | — | — |
| P6→P7 | 1273 | 71.2 | — | — | — | — |
| P7→P8 | 710 | 115.3 | — | — | — | — |
| P8→P9 | 204 | 24.1 | −69.0 | +53.2 | 0.43 | 0.69 |
| P9→P10 | 334 | 85.5 | −6.4 | +4.1 | 0.34 | 0.17 |
| P10→P11 | 665 | 90.0 | — | — | — | — |
| P11→P12 | 237 | 156.7 | **+81.9** | −51.8 | 0.41 | 0.53 |
| P12→P13 | 105 | 32.8 | −62.0 | +53.2 | 0.29 | 0.69 |

`chord°` 只是稿上的實際值，**不是資料**（執行時由兩點算出）；列在這裡是為了讓
`relIn` / `relOut` 的正負號可以回頭對照。

**P3→P4 與 P11→P12 是髮夾彎**（`relIn` 是 +111° / +82°：線先往回上走再折下來）。
這是設計語彙的關鍵，不能用 Catmull-Rom 之類的自動平滑取代 —— 那只會「順順地通過」。

稿上 5 段直線（P0→P1、P5→P6、P6→P7、P7→P8、P10→P11）合計約佔線長 59%，
而且正好落在文字高度最會變動的區域。直線天生吃得下高度變化，這是這套做法能成立的主因。

---

## 六、怎麼調（溝通協定）

### 只有五個旋鈕

| 欄位 | 視覺意義 |
| --- | --- |
| `x` | 橫向位置 |
| `anchor` + `edge` + `dy` / `t` | 縱向位置 |
| `relIn` | 出發角 |
| `relOut` | 到達角 |
| `hIn` / `hOut` | 彎的胖瘦（越大越鼓）|

### 一句話 → 改哪裡

| 說法 | 改的欄位 |
| --- | --- |
| 「P5 太靠右／太靠左」 | `x` |
| 「P5 太高／太低」 | `dy`，或換 `anchor` / `edge` |
| 「P3→P4 那個彎太鼓／太扁」 | `hIn` / `hOut` |
| 「線出來的方向不對」「太早往下轉」 | `relIn` / `relOut` |
| 「這一段應該是直線」 | `join: 'line'` |
| 「線要貼著〇〇跑」 | 換 `anchor.sel` |
| 「線要**橫向**咬住某個 element」 | `x` 改成 `ForumPathXAnchor`（見第二節）|
| 「整條線橫向擺幅太大」 | 全域 `amplitude`（把比例型 x 往中心收；掛 element 的 x 不受影響）|

**編號永不重排。** 要插入新點就用 `P7a`，不重編號 —— 這樣「P4 往右一點」
永遠指同一個點。理由同 `data-forum-anchor` 用具名而非索引。

### dev overlay：`?pathdebug`

疊在畫面上顯示：每個 waypoint 的**編號標籤 ＋ 實測座標**、它綁的 element 外框、
以及設計稿原線（半透明對照）。

有了它，溝通就是「**P9 要跟講者照片下緣對齊**」，不必猜座標。

---

## 七、與設計稿的已知差異

每一條都是刻意的。改動時連同 `note` 欄位一起更新。

1. **P0 的 dy 是 0，不是稿的 +43。**
   稿的線從容器 y ＝ 41 才開始，但交棒點幾何要求「路徑起點落在視窗正中央」
   ＝ 容器 y ＝ 0（見 `forum-core-path.md` 的 `start: 'top center'`）。
   照稿會在交棒瞬間產生 43px 跳點。P0→P1 是垂直線，多 43px 看不出來。

2. **P5 / P6 / P7 釘在容器邊緣 ±2，稿上是 0.5 / 409 / 411。**
   差 1–3px，換來的是「撞牆反彈」在任何視窗寬都成立，且描邊不被裁掉。

3. **P13 的 x 釘中心（容器 207），稿上是 198.5。**
   差 8.5px。收尾回到中心語意乾淨，且 mob 不畫箭頭（見第三節），
   稿上 P13 之後那一段拱與三角形一併省略 —— 線比稿短 93px。

4. **P6 用 fraction 0.32 取代稿的「上緣 +457」。** 理由見第四節。

5. **那一撇與箭頭不畫、core dot 尺寸不動。** 見第三節。
   （稿的 core dot 標記是 14×14，`CORE.dotSize` 是 26。沒有跟進 ——
   它同時被 `SymbolFace` / `HeroSymbolTransition` 讀，改它要重驗交棒重合。）

6. **實作版面本來就與稿不同，線因此不會與稿重疊。** 2026-08-07 實測（414 視窗、
   容器 398.67）：論壇一標眉在 445（稿 375.4）、論壇二日期組在 3783.7（稿 3105.5）、
   論壇三 `__meta` 在 5190.7（稿 4870.5）—— 累積差最大約 680px。

   **這是預期的，不是 bug。** 線的職責是「貼著實際版面」，不是「重現稿的絕對座標」。
   要驗對位就驗相對關係（線是否從標眉旁出來、是否在講者組下緣轉彎），
   不要拿稿的絕對數字去比對實測值 —— 同 `forum-core-path.md` 那條規則。

   ⚠️ 也**不要為了對上稿去硬調 dy** —— 那等於把量測快照又寫回常數，這條線就白改了。

---

## 八、驗證

### 黃金樣本（`test/forum-node-path.spec.ts`）

1. 把 Figma `2584:35109` 的 outline 用 `extract-centerline.mjs` 抽成真中心線
   （腳本目前把來源寫死成 `ForumCorePath.vue`，要加一個路徑參數），存成 fixture
2. 餵給產生器一組「稿的 element 位置」（＝第四節反推用的那些數字）
3. 比對兩條線的取樣點距離，**容差 1px**
   （pc 實測是中位 0.59 / 最大 2.05px，同一個量級）

好處是**調 P9 不會靜默弄壞 P3**。

刻意偏離稿時：更新 fixture、在該 node 寫 `note`、並補進第七節。
**偏離永遠是明寫的，不是靜默的。**

### 單元測試

- 五個旋鈕各自的效果（改 `hOut` 只影響那一段、`amplitude` 等比收斂…）
- 錨點量不到時回 `null`（不是回一條少一個點的線）
- 五種 x 的解析：`'left'` / `'right'` / `'center'` / 數字 / `ForumPathXAnchor`
  （含「不吃 amplitude」與「量不到退回 fallback」兩條）
- `edge` 三種模式的 y 解析
- pad 的 `Q13 / S0 / S1` 同 x 且都掛在 `.agenda__rows` 左緣（那條垂直線落在箭頭上）

### 瀏覽器實測

沿用 `forum-core-path.md` 的驗證方式，於 dev server 實測：

| 項目 | pad（1024）| mob（414）| pc 參考值 |
| --- | --- | --- | --- |
| 核心到可見線 中位 | **0.629px** | **0.415px** | 0.59px |
| 核心到可見線 最大 | **0.975px** | **0.815px** | 2.05px |
| 往回捲 drift | **0px** | **0px** | 0px |
| 線寬／線色 | 4px / `rgba(0,0,0,.1)` | 同左 | outline / `rgba(0,0,0,.03)` |

pad / mob 比 pc 準，是因為**驅動線 ＝ 可見線**（同一個 `d`），沒有中心線抽取的誤差。

**寬度掃描**（每一格都是 14 點、零溢出、起點落在容器水平中心）：

| 視窗 | 容器寬 | 容器高 | 線的最左／最右 |
| --- | --- | --- | --- |
| pad 768（下限）| 752.7 | 5164 | 2 / 652.6 |
| pad 1024 | 1009 | 4912 | 2 / 874.5 |
| pad 1279（上限）| 1264 | 4768 | 2 / 1095.9 |
| mob 414 | 398.7 | 5427 | 2 / 396.7 |
| mob 375 | 360 | 5777 | 2 / 358 |

同一份內容，pad 從 1279 縮到 768 時容器高 **4768 → 5164（+396px）**、
mob 從 414 縮到 375 時 **5427 → 5777（+350px）**，線全程自己跟著長。
這正是寫死 `d` 做不到的兩件事：窄視窗不溢出、文字變高不飄。

**議程箭頭對位**（2026-08-09，`AGENDA_ARROW_X` 之後）——
量「線穿過議程上／下緣時的 x」與「`.agenda__rows` 的 border 中心」之差：

| 視窗 | 容器寬 | 箭頭 x | 進議程 Δ | 出議程 Δ | 舊比例 `0.262×W` 會落在 |
| --- | --- | --- | --- | --- | --- |
| pad 768 | 752.7 | 194.83 | **0** | **0** | 197.2 |
| pad 1021 | 1006 | 321.50 | **0** | **0** | 263.6 |
| pad 1279 | 1264 | 450.50 | **0** | **0** | 331.2 |

核心自身（`.forum-path__core` 的中心）在 1021 寬實測也是 **Δ 0**。
同批次的自交掃描（4000 取樣點）：pad 768 / 1021 / 1279、pc 1440、mob 414 皆 **0 次相交**。

**待補的實測**：真機（無捲軸）、320 寬下限、字體 fallback 時的表現。

---

## 九、設計稿座標怎麼換算回來的

之後稿改版要重抽數字時照這個流程，不要憑印象。

1. **抓 1× 的線**：Figma MCP `download_assets`（`fileKey` `HOt7xNcSTpina7WqNv9MVn`、
   `nodeId` `2584:35109`、`defaultFormat: 'svg'`）→ 取 `svgAssets` 那份
   （viewBox `414.826 × 5070.5`）。`export` 那份含背景與 0.80781 的縮放，不要用。
2. **拆頂點**：`d` 用 `Z` 切開共 30 段。前 15 段是**端蓋**（每個轉折點一個），
   `M` 後面的座標就是該點的中心線座標；後 15 段是段與段之間的 outline。
3. **換算到版面座標**（`論壇一二三` ＝ Figma `2647:50346` 的內座標）：

   ```
   inner_y = asset_y + 41     // node 在外框 y=431，外框內的 論壇一二三 在 y=390
   inner_x = asset_x − 1.672  // 校準基準：P0 必須落在容器水平中心 207（＝414/2）
   ```

4. **抽 join 參數**：每段 outline 是兩條 cubic，用「端點 ＋ 端點切線方向 ＋
   handle 長度」擬合成**單一** cubic，誤差 0.14–1.50px（最差的兩段是 P2→P3 與
   P9→P10，都是收成垂直的過渡彎；真的不夠再拆回兩條）。
   `relIn` / `relOut` 記得換成**相對 chord**，否則視窗一縮就變形。

   > 參數是從 outline 單側抽的，與中心線差 2px 的法向偏移。
   > 偏移不影響切線角、對 handle 比例的影響 <1%，故直接用。

5. **x 轉比例**：`inner_x / 414`。落在 ±3px 內就釘 `'left'` / `'right'` / `'center'`。

---

## 十、pad / mob 之外

**pc 不需要，也不要動。** 它是絕對定位釘死在 1280 座標，且現有的 `d` 已手工校正到
中位誤差 0.59px。加新斷點時，只要在 `FORUM_PATH_NODES` 填一組 waypoint 陣列就會生效，
產生器與元件都不必動。

**論壇段後半段（論壇四／議程／精彩活動）另有一條線**，三個斷點的稿分別是
pad `2679:90235`、mob `2584:35141`、pc `2584:35143`。⚠️ 那三條在 Figma 上是**頁面層的
孤兒 vector**，沒有 artboard 座標可對 —— 稿只給形狀、不給位置，頂點掛哪個區塊必須自己決定
（做的時候用第六節那套 P 編號協定微調）。前半段這兩條則都對得到稿，別把兩者混為一談。
