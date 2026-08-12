# 講者照的藍塊刷開（inactive → active）

論壇一、二的講者照有一個 **inactive 狀態：整張照片被淺藍方塊蓋住**；觸發後藍塊帶著橘色上緣
往下退出，照片由上往下露出。稿的註解是「撞到藍方塊，色塊刷過，照片出現」——
撞的是橘核心，所以這個效果**最終要綁在論壇段設計線的節點事件上**。

這份文件管三件事：**元件的 prop 介面為什麼是三態**、**遮罩的盒子從哪裡來**、
以及**時機怎麼綁到節點事件上**（第六節，含實測出來的偏移值）。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/components/02.forum/ForumEvent.vue` | `photoReveal` prop、`.forum-event__photo-box` 包裝層、遮罩與 transition |
| `app/components/02.forum/Forum.vue` | 把事件值傳給 `<ForumEvent>` |
| `app/utils/forum-photo-reveal.ts` | 場次名 → 事件 key 的具名對照 |
| `app/utils/forum-path-events.ts` | `forum1PhotoReveal` / `forum2PhotoReveal` 兩個事件與逐斷點的 `dLen` |
| `app/utils/forum-node-path.ts` | `W5` / `Q5` / `P5`（論壇一照片錨點）、`W17`（論壇二照片錨點） |
| `test/forum-photo-reveal.spec.ts` | 對照表健檢 ＋ 與 `section2.json`、事件表的交叉比對 |

---

## 一、範圍

| 場次 | 講者照 | 有這個效果？ |
| --- | --- | --- |
| 論壇一 | 1 張大照（pc 268、pad／mob 233） | ✅ |
| 論壇二 | 2 張並排卡（pc 250、pad 210、mob 180） | ✅ **同場一起刷** |
| 論壇三 | 無講者 | —（資料上就沒有 `speakers`） |
| 論壇四 | 2 張並排卡 | ❌ 不做 |

「同場一起刷」＝ 一個 boolean 管同場所有講者照，論壇二的兩張卡同時開始。
不做逐張錯開，故不需要 stagger 或 per-speaker 狀態。

往回捲時**藍塊會蓋回來**（可逆），與 `forumSlashDraw`（那一撇往回捲會收回）的語意一致 ——
路徑事件本來就是 `progress >= mark` 的比較，回捲自然轉 false。

---

## 二、prop 介面：為什麼是三態

```ts
const props = withDefaults(
  defineProps<{
    event: ForumEvent;
    /**
     * 講者照的刷開狀態：
     *   undefined → 這一場不做這個效果，**遮罩連 DOM 都不渲染**（論壇四）
     *   false     → 藍塊蓋住整張照片（inactive）
     *   true      → 藍塊帶橘上緣往下退出（active）
     */
    photoReveal?: boolean;
  }>(),
  { photoReveal: undefined },
);
```

### ⚠️ `{ photoReveal: undefined }` 這個 default 是**必要的**，不是贅寫

Vue 對**宣告成 `Boolean` 型別**的 prop 有特殊的 absence casting：沒傳且**沒有 default** 時，
值會被轉成 `false`，不是 `undefined`。少了那個明寫的 default，三態會塌成兩態 ——
論壇四會變成「有遮罩且蓋住」，講者照直接消失在藍塊底下。

（Vue 的 `resolvePropValue`：`isAbsent && !hasDefault` 才轉 `false`；明寫 `default: undefined`
讓 `hasDefault` 為真，值就維持 `undefined`。）

### 三態換到的兩個好處

**① 不會閃。** 遮罩掛 `v-if="photoReveal !== undefined"`。之後接上路徑事件時傳的是
`forumPathActive ? forumPathEvents.<key> : undefined`：線還沒量好時遮罩不在 DOM 裡，
線量好的那一刻元素才掛上、**首次渲染就是藍色**（CSS transition 不會在初次渲染跑）。
若改成「預設 true、事件翻 false」，那一刻會看到藍塊由下往上蓋回照片 —— 一次多餘的反向動畫。

**② 失敗方向是安全的。** [forum-node-path.md](forum-node-path.md) 第二節記著
「任何一個必要錨點量不到 → 整條線放棄」，那時 `forumPathActive` 為 false、所有事件恆 false。
若預設是「蓋住」，照片會**永久停在藍塊底下**，而且是靜默的（正是 2026-08-09 那次
`photo-slot` 事故的形狀）。現在的失敗方向是退化成「沒有動畫、照片直接看得到」。

---

## 三、遮罩的盒子：新增 `.forum-event__photo-box`

```html
<span class="forum-event__photo-box" :class="{ 'is-revealed': photoReveal }">
  <UPic v-if="sp.photo" … classname="forum-event__photo" />
  <span v-else class="forum-event__photo-slot" aria-hidden="true">{{ sp.photoNo }}</span>
  <i v-if="photoReveal !== undefined" class="forum-event__photo-mask" aria-hidden="true" />
</span>
```

新增這一層是因為**照片框的幾何目前散在四組規則裡**：`:deep(.forum-event__photo)` 的基底
（quote-pc，absolute 268）、`.forum-event__speaker--card :deep(...)`（static 250/210/180）、
`.forum-event--quote :deep(...)`（pad／mob static 233），而 `.forum-event__photo-slot`
又把同一組數字鏡射一遍；`order` 與 `grid-row` 還另外掛在 `.u-pic` 上。

### 收斂後的分工

| 層 | 負責 |
| --- | --- |
| `.forum-event__photo-box` | position／width／`aspect-ratio`／`order`／`grid-row`／`overflow: hidden` —— **所有變體差異只在這一層** |
| `:deep(.forum-event__photo)` | `position: absolute; inset: 0; width/height: 100%; object-fit: cover` —— **一條規則，無變體** |
| `.forum-event__photo-slot` | `position: absolute; inset: 0` ＋ 虛線框與編號字 —— **一條規則，無變體** |
| `.forum-event__photo-mask` | `inset: 0` ＋ 藍底橘上緣 ＋ transform transition |

淨結果 SCSS 變短：照片與 placeholder 各從四組覆寫收成一條。

### 為什麼不是另外兩個做法

**遮罩當 `.forum-event__speaker` 的絕對定位兄弟、自己再寫一份幾何** —— 268/233/250/210/180
會存在兩處，改稿時漂掉的那一份不會有人發現（本專案文件反覆警告的「兩份真值」）。
而且論壇一在 pad／mob 是 `display: contents`、**沒有 box**，遮罩會錨到
`.forum-event__speakers` 上，只因為「照片剛好排第一個」才對得上，`speaker-label` 的 `order`
一動就破。

**塞進 `UPic` 或用 `.u-pic::after`** —— 為一個 section 的效果汙染共用元件；且 placeholder
情形沒有 `.u-pic`，quote-pc 的 `<picture>` 因為 img 絕對定位而塌成零高、沒有參考框。

### 三個要注意的既有陷阱（都不會被這次改動破壞）

1. **`.forum-event__speaker` 的 `padding: 102px 0 0 312px`** 是 margin collapse 的對策
   （見該處註解）。quote-pc 的 box 與今天的 img 一樣是絕對定位、不在流內，那個對策照樣成立；
   卡片變體的 box 是 static in-flow，與今天的 static img 同構。**不動它。**
2. **靜態變體的 box 必須是 `position: relative`。** 內層照片改絕對定位後，它的 containing
   block 是「最近的定位祖先」；`.u-pic`（`<picture>`）不帶 position，所以基準會落到 box 上 ——
   前提是 box 自己有定位。漏掉的話照片會跑去錨 `.forum-event__speakers`。
3. **遮罩要在 DOM 順序上排在照片之後**，兩者都絕對定位、同 z-index，靠繪製順序疊上去。

---

## 四、視覺

```scss
.forum-event__photo-box {
  --photo-mask-edge: 12px;                  // pad 10px / mob 8px（rwd 覆寫）
}

.forum-event__photo-mask {
  position: absolute;
  // top 負一個線寬 → 橘線待在照片框之外，被 overflow: hidden 裁掉
  inset: calc(-1 * var(--photo-mask-edge)) 0 0;
  border-top: var(--photo-mask-edge) solid var(--accent);
  background: var(--color-blue);            // #9fd6ff，既有色票
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.forum-event__photo-box.is-revealed .forum-event__photo-mask {
  transform: translateY(100%);
}
```

### inactive 是**純藍方塊、沒有橘線**

稿上最右邊那一格就是純藍的 —— 橘線是「開始刷」才出現的前緣，不是 inactive 的一部分。
做法是把橘線擺到**照片框之外**：本層 `top` 負一個線寬、`bottom: 0`，所以它比照片框高了正好
一個線寬；靜止時橘線落在框外被 `overflow: hidden` 裁掉，藍色的 padding box 則剛好蓋滿照片。
一開始位移，橘線就從上方帶進來，走完時也一起被裁掉。

⚠️ 因此 `translateY(100%)` 剛好夠用（100% ＝ 照片高 ＋ 一個線寬），**不要**把 `inset` 改回 `0`
—— 那會讓 inactive 露出橘線，而且 `100%` 會少走一個線寬、末端留一條橘線在下緣。

實測（三個狀態的可見高度，照片框 268）：

| 狀態 | 照片 | 橘線 | 藍塊 |
| --- | --- | --- | --- |
| inactive | 0 | **0** | 268 |
| 刷到 40% | 100 | 12 | 156 |
| active | 268 | 0 | 0 |

**用 `translateY` 而不是 `scaleY` 或 `height`**：`scaleY` 會把 `border-top` 的粗細一起壓扁
（橘線越刷越細），`height` 動畫不吃合成器。

`0.6s cubic-bezier(0.22, 1, 0.36, 1)` ＝ 稿寫的「timing function smooth」：起步快、尾端漸止，
對得上「橘方塊撞上來把藍塊推下去」的因果感。

⚠️ **`--photo-mask-edge` 的 12 / 10 / 8 是估計值。** 從附圖量的：中間那格的橘帶約佔照片寬
4.8%，268 寬換算約 13px。參考影片（Google Drive）讀不到，故先給一組視覺相近的值，
比對影片後改這一處即可。若設計師要的是「隨照片寬等比」而非固定值，改成
`calc(<box 寬> * 0.048)`；但那要在每個變體各寫一次，所以先不做。

`aria-hidden` ＋ `<i>`：純裝飾，不進無障礙樹，也不吃 `pointer-events`。

---

## 五、驗收（實測結果）

外觀與 DOM 這一層沒有自動化測試：純 CSS 幾何，專案的 vitest 只跑純函式（同 `forum-node-path`
的切法）。純函式那半 —— 場次對照、與 `section2.json` 與事件表的交叉比對、`dLen` 的兩種形式
—— 由 `test/forum-photo-reveal.spec.ts` 與 `test/forum-path-events.spec.ts` 守著。

| 項目 | 結果 |
| --- | --- |
| 三態 prop | 遮罩數 quote **1**／stair **2**／right **0**／youth **0**（youth 仍有 2 個照片框）—— `undefined` 那一態確實不渲染 |
| inactive 外觀 | 淺藍 `#9fd6ff` 滿版、**沒有橘線**（可見高 0），藍色 padding box 與照片框重合 |
| 橘線粗細 | pc 12px（照片 268 → 4.5%）、卡片 250 → 4.8%；mob 8px。刷到 40% 時仍是 8px（**沒被壓扁** ＝ 沒誤用 `scaleY`） |
| 刷過的中間態 | 照片上段可見、橘線、下方藍塊 —— 與稿的中間那一格一致 |
| active 外觀 | 藍塊與橘線完全離開照片框 |
| 不帶事件時 | 遮罩 **0** 個、照片框 5 個、`is-revealed` 0 個 |
| **錨點沒偏** | 三斷點 × 三場講者組的完整幾何指紋（標籤／照片／姓名／頭銜／5 段 bio 的相對 x/y/w/h ＋ 組尺寸）逐項比對**全部相同**；四個照片錨點在 `.sec2__path` 座標系下的 rect 亦相同 |

最後一項是整件事唯一有回歸風險的地方（`W5` / `W17` / `Q5` / `P5` 都掛
`.forum-event__photo, .forum-event__photo-slot`）。照片改成「在同尺寸盒子內 `inset: 0`」後
rect 不變，也不會變成 0×0（那會觸發
[forum-node-path.md](forum-node-path.md) 第二節的整條放棄）。

⚠️ 量測方法值得留著重用：**與其目視比截圖，不如把整組相對幾何抓成指紋再逐項 diff**。
`.u-pic` 的 `order` / `margin-bottom` 被搬走會不會影響姓名與 bio，用眼睛看不出 1px 的差別。

---

## 六、時機：綁在節點上，偏移逐斷點

`Forum.vue` 傳的是：

```ts
const photoRevealOf = (no: string): boolean | undefined => {
  const key = photoRevealKeyFor(no);
  if (!key || !forumPathActive.value) return undefined;
  return forumPathEvents[key] === true;
};
```

場次 → key 的對照**具名**（`論壇一` → `forum1PhotoReveal`），不用 `v-for` 的索引 ——
理由同 `data-forum-anchor` 與節點編號永不重排。論壇三查不到 key ⇒ `undefined` ⇒ 不渲染遮罩，
與它沒有講者的事實自然一致。

⚠️ `forumPathActive` 那道**不是多餘的**。`forumPathEvents` 在 marks 還沒建起來時本來就回
`false`，但 `false` 正是「該蓋住」的值 —— 這道守的是「遮罩存不存在」，不是「蓋不蓋住」。

### `dLen` 為什麼必須逐斷點

想要的語意三個斷點是同一件事：**核心碰到講者照上緣的那一刻，藍塊開始往下退**。
但 `at` 本來就指向三個不同節點，而那些節點離照片上緣的距離差很多 ——
一個共用的 `dLen` 不可能同時修好（實測 `forum2PhotoReveal` 的 pc 要 −199、pad 要 **+152**，
方向相反）。故 `ForumPathEvent.dLen` 除了單一數字，也接受逐斷點的 `Partial<Record<ForumBp, number>>`。

實測（逐格捲動：先二分找出事件翻轉的 `scrollY`，再二分找出「核心中心正好落在照片上緣」的
`scrollY`，兩者之差 × 該斷點的 progress／px 斜率 × `pathLen` ＝ 需要的弧長偏移）：

| key | 斷點 | 節點 | 節點落在哪 | 翻轉時核心相對照片上緣 | `dLen` |
| --- | --- | --- | --- | --- | --- |
| `forum1PhotoReveal` | pc | `W5` | 照片上緣 +15 | +13.8 | **0**（稿的意圖就是「彎頂進到照片裡」） |
| | pad | `Q5` | 照片上緣 +208 | +208.1（照片 233 高 → 89%，太晚） | **−205** |
| | mob | `P5` | 照片上緣 +102 | +103.9（233 高 → 45%） | **−81** |
| `forum2PhotoReveal` | pc | `W17` | 照片 0.4674 處 | +117.2（250 高 → 46.9%） | **−199** |
| | pad | `Q8` | 講者組上緣 +2 | **−42.4**（照片在「講者介紹」標籤下面 → 提前） | **+152** |
| | mob | `P9` | 講者一組上緣 +54 | +55.9（180 高 → 31%） | **−46** |

`W17` 之所以落在照片中段純屬順帶 —— 它在節點表裡是**補點**
（「原本 `W16`→`W18` 一段 chord 668、偏差 3.02px」），不是設計上的觸碰點。

⚠️ 要調時機**只動 `dLen`**，不要回頭改節點的 `dy` —— 那是設計線的幾何，一動整條線就偏。

⚠️ 這些值量在 pc 1440、pad 1024、mob 414。pad 的容器已固定 768 置中，故 pad 值與視窗寬無關；
mob 仍是流動容器（414 vs 375 弧長分佈會小幅移動），數十 px 的誤差在 0.6s 的刷過裡看不出來。

**探針事件（`probe*`）先留著。** `forum-path-events.ts` 的註解說真實事件進來後可以整段刪掉，
但那六個探針目前是「某斷點不觸發（`null`）」與「`optional` 節點被跳過」在**真實事件表**裡的
唯一活體樣本，而這兩個新事件都不涵蓋（三斷點皆有節點、不掛 optional 節點）。
`dLen` 那一項現在由這兩個事件涵蓋了。清理是獨立的一件事，要做就單獨開一個 commit。
