# 講者照的藍塊刷開（inactive → active）

論壇一、二的講者照有一個 **inactive 狀態：整張照片被淺藍方塊蓋住**；觸發後藍塊帶著橘色上緣
往下退出，照片由上往下露出。稿的註解是「撞到藍方塊，色塊刷過，照片出現」——
撞的是橘核心，所以這個效果**最終要綁在論壇段設計線的節點事件上**。

這份文件管三件事：**元件的 prop 介面為什麼是三態**、**遮罩的盒子從哪裡來**、
以及**之後接上路徑事件時要改哪裡**。

本次實作**只做元件層 ＋ 一個 dev 旗標**，路徑事件綁定是下一步（見第六節）。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/components/02.forum/ForumEvent.vue` | `photoReveal` prop、`.forum-event__photo-box` 包裝層、遮罩與 transition |
| `app/components/02.forum/Forum.vue` | 傳 prop；`?photohold` dev 旗標（暫時的，見第六節） |
| `app/utils/forum-path-events.ts` | 下一步要加的兩個事件 key |
| `app/utils/forum-node-path.ts` | `W5` / `Q5` / `P5`（論壇一照片錨點）、`W17`（論壇二照片錨點） |

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
.forum-event {
  --photo-mask-edge: 12px;                  // pad 10px / mob 8px（rwd 覆寫）
}

.forum-event__photo-mask {
  position: absolute;
  inset: 0;
  border-top: var(--photo-mask-edge) solid var(--accent);
  background: var(--color-blue);            // #9fd6ff，既有色票
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.forum-event__photo-box.is-revealed .forum-event__photo-mask {
  transform: translateY(100%);
}
```

**用 `translateY` 而不是 `scaleY` 或 `height`**：`scaleY` 會把 `border-top` 的粗細一起壓扁
（橘線越刷越細），`height` 動畫不吃合成器。藍塊滑出照片下緣後由 box 的 `overflow: hidden`
裁掉，橘線就從上緣一路走到下緣然後消失 —— 稿上的「色塊刷過」。

`0.6s cubic-bezier(0.22, 1, 0.36, 1)` ＝ 稿寫的「timing function smooth」：起步快、尾端漸止，
對得上「橘方塊撞上來把藍塊推下去」的因果感。

⚠️ **`--photo-mask-edge` 的 12 / 10 / 8 是估計值。** 從附圖量的：中間那格的橘帶約佔照片寬
4.8%，268 寬換算約 13px。參考影片（Google Drive）讀不到，故先給一組視覺相近的值，
比對影片後改這一處即可。若設計師要的是「隨照片寬等比」而非固定值，改成
`calc(<box 寬> * 0.048)`；但那要在每個變體各寫一次，所以先不做。

`aria-hidden` ＋ `<i>`：純裝飾，不進無障礙樹，也不吃 `pointer-events`。

---

## 五、驗收

沒有自動化測試：這一層是純 CSS 幾何，專案的 vitest 只跑純函式（同 `forum-node-path` 的切法）。

| 項目 | 方法 |
| --- | --- |
| inactive 外觀 | `?photohold` → 論壇一二停在藍塊，三斷點各截一張比稿 |
| 刷過的中間態 | devtools 手動 toggle `.is-revealed`，錄一段或截中間幀 |
| active 外觀 | 不帶 `?photohold` → 與今天的畫面**逐像素相同**（遮罩不渲染） |
| 論壇四未受影響 | 同上，且 DOM 裡不該出現 `.forum-event__photo-mask` |
| **錨點沒偏** | `?pathdebug` 目視 `W5`／`W17`（pc）、`Q5`（pad）、`P5`（mob）的錨點框仍貼著照片 |

最後一項是這次唯一有回歸風險的地方。`W5` / `W17` / `Q5` / `P5` 都掛
`.forum-event__photo, .forum-event__photo-slot`；照片改成「在同尺寸盒子內 `inset: 0`」後
rect 理論上不變，也不會變成 0×0（那會觸發
[forum-node-path.md](forum-node-path.md) 第二節的整條放棄）。理論歸理論，要看過。

---

## 六、下一步：接上路徑事件（不在本次範圍）

三個動作：

**① `app/utils/forum-path-events.ts` 加兩個 key**（順手把 probe 那批刪掉 —— 它們的註解
已經寫明「真實事件進來之後可以整段刪掉」）：

| key | pc | pad | mob | 備註 |
| --- | --- | --- | --- | --- |
| `forum1PhotoReveal` | `W5` | `Q5` | `P5` | 三個斷點的節點**本來就錨在論壇一的照片上**，直接可用 |
| `forum2PhotoReveal` | `W17` | `Q8` | `P9` | pc 的 `W17` 錨在論壇二照片的 0.4674 處；pad／mob 沒有照片錨點，最近的是 `Q8`（講者組上緣 +2）與 `P9`（講者一組上緣 +54） |

時機微調用 `dLen`（px 弧長，正 ＝ 晚），不要改節點的 `dy` —— 那是設計線的幾何。

**② `Forum.vue` 把 `?photohold` 換成事件**：

```ts
:photo-reveal="forumPathActive ? forumPathEvents[photoRevealKey(e.no)] : undefined"
```

`e.no` → key 的對照要**具名**（`論壇一` → `forum1PhotoReveal`），不用 `v-for` 的索引 ——
理由同 `data-forum-anchor` 與節點編號永不重排。論壇三查不到 key ⇒ `undefined` ⇒ 不渲染遮罩，
與它沒有講者的事實自然一致。

**③ 移除 `?photohold`。** 它只是本次的驗收工具，不是要長住的 dev 旗標。

⚠️ `Q8` / `P9` 是「最近的節點」而不是照片本身 —— 綁上去之後要實際看橘核心撞到照片上緣的那一刻
是否就是藍塊開始退的那一刻。差太多就換節點或調 `dLen`，**不要**回頭改節點的錨點。
