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
| `app/utils/forum-node-path.ts` | `W5` / `Q5` / `P5`（論壇一照片錨點）、`W15` / `Q8` / `P8`（論壇二觸發用的轉彎） |
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

> **2026-08-17 更新**：`.forum-event__speaker--card` 已隨「論壇二／四改單人講者」一併移除
> （版式改由 `--stair` / `--youth` 決定，不再由人數決定）。上面那段記的是收斂前的狀況，
> 保留是為了說明這一層為什麼存在；現行的照片框尺寸是 pc 280 / pad 233 / mob 180，
> 見 `ForumEvent.vue` 的 `.forum-event__photo-box`。

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

> **2026-08-16 更新：論壇二已不再走這一節。** 設計上要求它比「碰到照片」更早，
> 改成把 `at` 直接指到照片前面那個轉彎（`W16` / `Q7` / `P8`）、`dLen` 歸零。
> 下面的推導與實測表**只對 `forum1PhotoReveal` 仍然成立**；論壇二那三列留著當歷史紀錄，
> 也是「一個共用 `dLen` 修不好三個斷點」最強的證據（pc −122 vs pad +181，方向相反）。
>
> 順帶學到的原則：**能把 `at` 指到語意正確的節點時，就不要靠 `dLen` 硬拉** ——
> `dLen` 是量死的常數，版面伸縮時不會跟著走；節點是即時量測的，會跟著走。

想要的語意三個斷點是同一件事：**核心碰到講者照上緣的那一刻，藍塊開始往下退**。
但 `at` 本來就指向三個不同節點，而那些節點離照片上緣的距離差很多 ——
一個共用的 `dLen` 不可能同時修好（實測 `forum2PhotoReveal` 的 pc 要 −199、pad 要 **+152**，
方向相反）。故 `ForumPathEvent.dLen` 除了單一數字，也接受逐斷點的 `Partial<Record<ForumBp, number>>`。

量法（逐格捲動）：先二分找出事件翻轉的 `scrollY`，再二分找出「核心中心正好落在照片上緣」的
`scrollY`，兩者之差 × 該斷點的 progress／px 斜率 × `pathLen` ＝ 需要的弧長偏移。

⚠️ **那個換算只是一階估計，一定要跑第二輪修正。** `progress` 對 scroll 是線性的，但核心沿線的
位置經過**回中節點表**重映射（[forum-node-path.md](forum-node-path.md) 第五節），所以
「弧長偏移 → 核心移動多少」不是常數。實測 pc 的論壇二第一輪估 `−199` 就過頭 57.7px，
第二輪修成 `−122` 才對。

⚠️ 誤差容許到「核心中心落在照片上緣下方 **0～15px**」—— pc 的 `W5` 本來就錨在上緣 +15
（稿的意圖是彎頂進到照片裡），那個範圍就是設計本身的語意。

| key | 斷點 | 節點 | 節點落在哪 | 第一輪（未修正） | 最終 `dLen` | 收斂後 |
| --- | --- | --- | --- | --- | --- | --- |
| `forum1PhotoReveal` | pc | `W5` | 照片上緣 +15 | +13.8 | **0** | **+13.7** |
| | pad | `Q5` | 照片上緣 +208 | +208.1（照片 233 高 → 89%，太晚） | **−205** | **+12.8** |
| | mob | `P5` | 照片上緣 +102 | +103.9（233 高 → 45%） | **−103** | **+8.0** |
| ~~`forum2PhotoReveal`~~ | pc | `W17` | 照片 0.4674 處 | +117.2（250 高 → 46.9%） | ~~**−122**~~ | +6.9 |
| （已於 2026-08-16 改掉） | pad | `Q8` | 講者組上緣 +2 | **−42.4**（照片在「講者介紹」標籤下面 → 提前） | ~~**+181**~~ | −4.2 |
| | mob | `P9` | 講者一組上緣 +54 | +55.9（180 高 → 31%） | ~~**−46**~~ | +10.9 |

（「收斂後」＝ 套上最終 `dLen` 後實測的「翻轉時核心中心相對照片上緣」。）

`W17` 之所以落在照片中段純屬順帶 —— 它在節點表裡是**補點**
（「原本 `W16`→`W18` 一段 chord 668、偏差 3.02px」），不是設計上的觸碰點。
這正是後來改掉它的理由之一。

### 2026-08-16：論壇二改成「落在照片前面那個轉彎」

設計要求論壇二提前，不要等到核心碰到照片。做法是換 `at`、拿掉 `dLen`：

| 斷點 | 舊 | 新 | 新節點錨在哪 | 觸發點在照片上緣**上方** |
| --- | --- | --- | --- | --- |
| pc | `W17` −122 | **`W15`** | `.forum-event__date` 下緣 +13 的髮夾彎 ＝ **09/15 那一撇的下端** | 74px |
| pad | `Q8` +181 | **`Q8`**（僅拿掉 `dLen`） | `.forum-event__speakers` 上緣 +2，貼著「講者介紹」標籤左上角 | 42px |
| mob | `P9` −46 | **`P8`** | 「講者介紹」標籤列 +22 的折角 | 26px |

落點是**設計師逐斷點指定的（截圖對位）**，不是機械地「一律取前一個節點」——
三個斷點的節點分佈本來就不同，pc 往前跨了兩個、pad 原地、mob 退一個。
量在 pc 1920 / pad 820 / mob 414。

被否掉的候選（留著免得又繞回去）：

| 候選 | 上方 | 為什麼不用 |
| --- | --- | --- |
| pc `W16` | 139px | 那個駝峰在撇的**上面**，刷得太早 |
| pad `Q7` | 344px | 退到日期組裡，離講者卡太遠 |

⚠️ pc 的 `W15` 在**版面上比 `W16` 低**（y 4044 vs 3979），但在**線上比 `W16` 早**——
核心先俯衝到撇的下端（`W15`），再翻上駝峰（`W16`）才往左下走 `W17`。只看 y 會覺得矛盾。

量法：讀 `window.__udnForumPath`（`?pathdebug` 才掛），
`marks.forum2PhotoReveal × pathLen` 餵給驅動線的 `getPointAtLength`，與照片 rect 在
`.forum-path` 座標系相減。三個斷點的觸發點都與節點座標**完全重合**（實測翻轉時
核心中心與節點差 dy 0.1px / dx −2.3px），確認 `dLen: 0` 的語意正確、兩張卡同步刷。

⚠️ 這一組**不需要逐格校正**（上面那些數字是驗收，不是校正參數）—— 觸發點就定義成
「那個節點」，不再是「相對照片上緣的某個距離」，版面伸縮時會跟著節點一起走。

同一批實測還確認了：三個斷點的**同場兩張卡同步刷**、**回捲會蓋回來**、
**論壇四的遮罩數為 0**。

⚠️ 要調時機**只動 `at` 與 `dLen`**，不要回頭改節點的 `dy` —— 那是設計線的幾何，一動整條線就偏。

⚠️ 這些 `dLen` 值量在 pc 1440、pad 1024、mob 414。pad 的容器已固定 768 置中，故 pad 值與視窗寬無關；
mob 仍是流動容器（414 vs 375 弧長分佈會小幅移動），數十 px 的誤差在 0.6s 的刷過裡看不出來。

**探針事件（`probe*`）先留著。** `forum-path-events.ts` 的註解說真實事件進來後可以整段刪掉，
但那六個探針目前是「某斷點不觸發（`null`）」與「`optional` 節點被跳過」在**真實事件表**裡的
唯一活體樣本，而這兩個新事件都不涵蓋（三斷點皆有節點、不掛 optional 節點）。
`dLen` 那一項現在由這兩個事件涵蓋了。清理是獨立的一件事，要做就單獨開一個 commit。
