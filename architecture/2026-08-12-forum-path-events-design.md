# 論壇段路徑事件（節點定址的捲動事件）

論壇段前半段（論壇一 → 論壇二 → 論壇三 → 議程）要掛一批「核心走到線上某處就觸發」的事件。
這份文件管三件事：**為什麼用節點定址而不是百分比**、**資料模型與資料流**、**新增事件時怎麼寫**。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/utils/forum-path-events.ts` | 型別 ＋ `FORUM_PATH_EVENTS`（事件表）＋ `resolveForumEventMarks()`（純算式） |
| `app/utils/forum-node-path.ts` | `buildNodePathD()` 多回傳 `segs`（每個節點的 `d` 片段） |
| `app/components/02.forum/ForumCorePath.vue` | 量尺 `<path>`、`syncEventMarks()`、`reset()` |
| `app/composables/useOrangeCoreProgress.ts` | `forumPathMarks` 軌 ＋ `forumPathEvents`（每 key 一個 computed） |
| `app/components/DevCoreProgress.vue` | `?pathdebug` 的事件列 |
| `test/forum-path-events.spec.ts` | 事件表健檢 ＋ 門檻算式 |

---

## 一、為什麼不是手寫百分比

原本的想法是用 `SEQUENCE` 的地址 `forum.path.40%` 掛事件。**病根不是 `%` 這個表示法，是「人手寫的 `%`」。**

`forumPathProgress` 是**弧長比例**。節點本身咬在版面元素上、很穩，但兩個節點**之間**的比例會隨那一區的
文字高度浮動：實測 pad 從 1279 縮到 768，容器高 4768 → 5164（+396px），弧長整個重分配，同一個
`40%` 就落到不同的版面位置。而且三個斷點的節點數（pc 29+7 / pad 14+7 / mob 14+8）與弧長分佈完全
不同，一個 `%` 值本來就不可能三斷點共用。

`FORUM_SLASH_AT` 已經踩過這個坑（2026-08-12 的 ⚠ 註解）：pc 的實測快照 `[0.40, 0.41]` 被當成三個
斷點的初值填下去，pad / mob 於是在核心根本不在 09/15 的位置畫出那一撇。

**解法：門檻值由節點在每次 `refreshInit` 重算。** 底層仍然吃現有的 `forumPathProgress` 軌 ——
只是那個 `%` 是程式依實際幾何算出來的，不是寫在 config 裡的快照。好處有三個：

1. 不必新增逐幀軌（`forumPathProgress` 本來就逐幀更新）
2. `?pathdebug` 印出來的數字可以直接跟 `SEQUENCE` 的 `forum.path.%` 對話
3. 事件的位置與設計線用同一套編號協定溝通（「`W10` 那個事件太早」直接對得回程式碼）

### 這不是新機制，是既有做法的推廣

專案裡已經有三套定址法並存：

| 定址法 | 現有案例 | 評價 |
| --- | --- | --- |
| 手寫百分比 | `FORUM_SLASH_AT`（手動覆寫）、`SEQUENCE` 的 `forum.path.40%` | RWD 不精準，見上 |
| **節點編號** | `FORUM_PLANE.node = { pc:'R1', pad:'S1', mob:'T1' }`（紙飛機變身點） | **本文採用** |
| 元素錨點 | `syncSlashWindow()` 量 `.forum-event__date-coreslash` 的 rect | 留作逃生門，見第六節 |

---

## 二、資料模型

```ts
export type ForumPathEvent = {
  key: string;                                   // 事件鍵，consumer 用它取 boolean
  label: string;                                 // dashboard 顯示的一句話
  at: Record<'pc' | 'pad' | 'mob', string | null>; // 觸發節點（null ＝ 該斷點不觸發）
  dLen?: number;                                 // 沿線再往前（正）／往後（負）偏移幾 px 弧長
};
```

**`key` 永不重命名**，理由同節點編號永不重排：地址會寫進 issue／對話／commit。

**`at[bp]` 可以是 `null`。** 「該斷點不觸發這個事件」是真實需求 —— 稿上那一撇在 mob 就不畫
（見 `forum-node-path.md` 第三節），線在那個 y 帶根本不經過 09/15。

**`dLen` 是弧長 px，不是比例。** 與 `FORUM_PLANE.morphLen` / `tailLen` 同單位，專案裡已經用這個
單位思考沿線距離。正 ＝ 晚一點觸發（核心要多走 `dLen` px），負 ＝ 提前。

### 刻意不做的兩件事

**不做段內比例（`to` + `t`）。** `dLen` 已經能微調。真的遇到「事件必須落在兩節點正中間、而那段會
隨版面伸縮」再加，加法是：`at` 與 `to` 各解一次弧長，`mark = lerp(lenAt(at), lenAt(to), t) / pathLen`，
`resolveForumEventMarks()` 內部改一行、型別加兩個 optional 欄位，consumer 與軌都不動。

**事件表不放外觀。** 同 `FORUM_SLASH_AT` 的註解精神：長寬、傾角、顏色、transition 時長留在元件的
SCSS，這裡只管**時機**。改字級不該動到這個檔案。

---

## 三、資料流

```
FORUM_PATH_NODES[bp]  ──┐
                        ├─→ buildNodePathD() ─→ { d, endY, points, segs }
量測（measure）      ──┘                                        │
                                                                ▼
                                          ForumCorePath.syncEventMarks()
                                          量尺 path 逐段累加 getTotalLength()
                                                                │
                                                    lenAt: (id) => number | undefined
                                                                │
                                          resolveForumEventMarks(bp, lenAt, pathLen)
                                                                │
                                                                ▼
                                          forumPathMarks（軌，build() 寫一次）
                                                                │
       forumPathProgress（軌，place() 逐幀）───────────────────┤
                                                                ▼
                                          forumPathEvents.<key>（每 key 一個 computed）
                                                                │
                                                                ▼
                                          消費端 :class="{ 'is-x': ... }" ＋ CSS transition
```

### 節點弧長怎麼量

`buildNodePathD()` 維持純函式（`forum-node-path.md` 第二節的不變量：DOM 只出現在注入的 `measure`
裡），多回傳一組 `segs`：

```ts
segs: { id: string; d: string }[]
// 不變量：segs.map(s => s.d).join('') === d，且 segs.length === 存活節點數
```

`ForumCorePath` 在 `.forum-path__motion` 裡多放一個量尺 `<path ref="probeEl" stroke="none">`，
逐段累加字串後讀 `getTotalLength()`。約 35 次呼叫，只在 `build()` 跑。

**為什麼用量尺而不是純算式解 cubic 弧長**：量尺和 `pathLen` 用**同一把尺**（同一個瀏覽器實作），
不會有兩套長度分歧。自己用 Gauss-Legendre 積分算得出來、而且可測，但與 `getTotalLength()` 的值
只能「幾乎相等」，而整套系統的門檻都要跟 `place()` 的 `len` 比大小。

**為什麼另開一個 `<path>` 而不是複用 `motionEl`**：驅動線必須全程持有完整的 `d`；在它身上反覆
setAttribute 會讓量測順序與 `pathLen` 的取得糾纏在一起。量尺放在同一個 `<svg>` 內是為了保證
它有 layout box（detached 元素的 `getTotalLength()` 跨瀏覽器行為不一致）。

**對照成本**：現在單一個 `syncSlashWindow()` 就要 512 + 64 次 `getPointAtLength`。改用量尺後，
不管事件表長到幾十個，量測成本都固定是「節點數」次 `getTotalLength()`。

### 為什麼只新增一條軌

| | 內容 |
| --- | --- |
| 新增軌 | `forumPathMarks: Record<string, number> \| null`，`build()` 寫一次 |
| 新增衍生 | `forumPathEvents` —— `reactive` 包住**每個 key 各自一個 `computed`** |
| `reset()` 新增 | 一行 `setForumPathMarks(null)` |

⚠️ **不要把事件做成「單一 computed 回一個物件」。** 它依賴逐幀變動的 `forumPathProgress`，每幀
都會產生新物件 → 所有消費端逐幀 re-render。拆成每 key 一個 computed 之後，每幀只做一次數字比較，
而 Vue 只在**回傳值真的翻轉**時才通知依賴者。這與 `forumPathRiding` 當初收成 boolean 是同一個理由
（見 `useOrangeCoreProgress` 該處註解）。

⚠️ 用 `reactive()` 包住那組 computed 而不是回傳 `Record<key, ComputedRef>`：`reactive` 會自動
unwrap，模板寫 `forumPathEvents.foo` 就好，且**保留每 key 的追蹤粒度**。

**「單一軌」是這個設計最重要的性質。** 事件表長到幾十個，`reset()` 仍然只清一樣東西。
`forum-node-path.md` 記過兩次「忘了歸零」的事故（橘方塊卡在論壇段不動、那一撇在錯的時機長出來），
兩次都是靜默的；一個事件一條 `useState` 會讓那類事故隨事件數線性增加。

---

## 四、全部可逆、純狀態

事件只是「越過了沒」的 boolean：往回捲自動跌回 `false`，補間交給 CSS transition。

這是刻意的選擇，理由是 2026-08-12 那次回饋（`coverOrangeAt` 的註解）：**在 scrub 上疊
transition 會讓每一幀都追一次補間、手感發黏**；改成「只跨越一次的事件 ＋ CSS 補間」就沒有這個問題。

因此機制裡**沒有任何副作用、沒有 watcher、沒有需要清的殘留狀態**。

⚠️ 將來若要加「只能往前觸發一次」的事件（音效、踩一次的 timeline），要在 boolean 之上再加一層
**邊緣偵測**（只在 `false → true` 的那一幀發出），並處理斷點切換與快捲跳過的情形。
那一層是新增的，不必改事件表。

---

## 五、失敗模式（全部 fail-loud）

這條線的事故史都是靜默的，所以每一種失敗都要能被看見。

| 情況 | 行為 |
| --- | --- |
| 事件表引用不存在的節點 id（**打錯字**） | `build()` `console.warn` 點名 key 與 id；測試也守著 |
| 節點是 `optional` 且被跳過（`?highlights=1` 沒帶） | marks 缺該 key → 事件恆 `false`（那塊根本不存在，合理） |
| `at[bp] === null` | 不進 marks → 該斷點恆 `false` |
| `forumPathActive` false／斷點切換／`reset()` | marks ＝ `null` → 全部 `false` |
| 量尺末端 ≠ `pathLen`（差 > 0.5px） | `console.warn` —— 產生器日後改動會靜默錯開**所有**事件 |
| `pathLen <= 0` | 回空表（除以零會讓門檻變 `Infinity` / `NaN`，比較永遠是 false，但那是靜默的） |

「事件表打錯節點 id」是這裡最容易犯、最靜默的錯：事件永遠不觸發，而畫面上少一個效果不會有人
立刻發現。它同時被 `console.warn` 與單元測試守住。

---

## 六、新增事件的流程

1. 開 `?pathdebug`，捲到想觸發的位置，看設計線上哪個節點編號最近（面板會印每個事件的節點與 %）。
2. 在 `FORUM_PATH_EVENTS` 加一列，三個斷點各填一個節點編號（不觸發就填 `null`）。
3. 需要微調就加 `dLen`（px 弧長，正 ＝ 晚一點）。
4. 消費端讀 `forumPathEvents.<key>` 當 class 條件，補間寫在該元件的 SCSS。
5. 跑 `pnpm test` —— 節點 id 打錯會被測試擋下來。

### 什麼時候該用元素錨點而不是節點

事件必須咬住某個版面元素，而**那附近沒有節點**時，才回頭用 `syncSlashWindow()` 那套
（量 rect ＋ `nearestArcLength`）。它的優點是三斷點只寫一份 config，代價是：

- 每個事件 512 + 64 次 `getPointAtLength`，成本隨事件數線性成長
- 髮夾彎有多個局部極小，最近點可能選到錯的分支（`syncSwapLen` 的註解已在擔心這件事）
- 觸發點不是設計線上的節點 → 沒辦法用編號協定溝通

**先找節點；找不到才考慮加一個節點；都不行才用元素錨點。**

---

## 七、與 `SEQUENCE` 的分工

`SEQUENCE` 不變，它是**章節級**的溝通座標系（`forum.path` 是其中一個 `part`）。
本文的節點定址是那個 part **內部**的細粒度地址。

| 粒度 | 寫法 | 用途 |
| --- | --- | --- |
| 章節級 | `forum.path.40%` | 「整段跑到四成」——講位置、算 vh |
| 節點級 | `forum.path@W10` | 「核心走到那個轉折」——掛事件 |

`?pathdebug` 兩個都印，所以既有的對話習慣不會斷掉。

---

## 八、驗證

### 單元測試（`test/forum-path-events.spec.ts`，純函式、無 DOM）

- **事件表每個 `at[bp]` 都存在於 `FORUM_PATH_NODES[bp]`**（守打錯字）
- `key` 不重複；`label` 不空
- `resolveForumEventMarks()`：`lenAt` 回 `undefined` → 缺 key；`dLen` 正負偏移；
  `pathLen <= 0` → 空表；門檻夾在 `[0, 1]`
- 邊界：`p` 剛好等於 mark → `true`

`test/forum-node-path.spec.ts` 補守 `segs` 的兩條不變量（`join('') === d`、長度 ＝ 存活節點數），
否則產生器改動會靜默錯開所有事件。

### 瀏覽器實測（三個斷點都要）

用 `?pathdebug` 逐斷點確認：每個事件的節點 id 對得上、算出來的 `%` 落在合理位置、
捲過去時 on/off 在**該節點的畫面位置**翻轉、往回捲會跌回 off。
斷點切換（pc ↔ pad ↔ mob）後 marks 要整份重算，不能留上一個斷點的值。
