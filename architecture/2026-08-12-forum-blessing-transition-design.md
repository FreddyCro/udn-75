# 02.forum → 03.blessing 過場 — 設計稿

日期：2026-08-12
狀態：**已實作**（分支 `feat/forum-blessing-cover`；實測數字見第十二節。
文中標「實測修正」的兩處是實作過程中推翻本稿原本寫法的地方，已就地更正。）
相關檔案：`app/components/02.forum/Forum.vue`、`app/components/02.forum/ForumCorePath.vue`、
`app/components/03.blessing/Blessing.vue`、`app/composables/useOrangeCoreProgress.ts`、
`app/composables/useCoreSequence.ts`、`app/utils/orange-core-config.ts`、
`app/utils/forum-node-path.ts`、`test/blessing-cover.spec.ts`、`test/forum-node-path.spec.ts`
設計稿：pc 四張分鏡 **永續祝福1–4**＝`2065:145459` / `2065:145381` / `2065:145577` / `2065:145653`
（pad／mob 分鏡未提供，本次以 pc 稿推導、三個斷點共用同一套機制）

設計師描述（逐字）：

> 1. 下個 section 往上蓋，section 顏色改成淺藍色
> 2. #永續祝福｜綁滾動（ENG）：精彩活動 fix 在畫面中心、下個 section 往上蓋。
>    小飛機碰觸到下方色塊時：色塊變橘色、小飛機變成方塊。
>    底色變橘時，會看到原本位置的白字標題「永續祝福」和引言

四拍，依序、不重疊（全程 scrub、可逆）：

1. 淺藍色塊往上蓋過被定住的 forum
2. 色塊上緣碰到紙飛機 → 色塊轉橘、飛機沒入、白方塊從接縫長出（標題與引言同步淡入）
3. 白方塊沉到「臉的第 01 格」位置，色塊升到滿版
4. 交棒給現有的逐格臉（`blessingProgress` → `BlessingFace` 01→17）

---

## 一、分鏡讀出來的事實

四張分鏡是同一段捲動的四個時刻（Figma 圖層名就是 1–4）。量到的座標：

| 分鏡 | 色塊上緣 y | forum 內容 y | 色塊顏色 | 飛機／方塊 |
|---|---|---|---|---|
| 永續祝福1 | 597（83% 畫面高） | 77 | 淺藍 `#9FD6FF` | 不在畫面上 |
| 永續祝福2 | 480（67%） | 83 | 橘 | 飛機在接縫上、機鼻已沒入；接縫下方 35×27 白方塊 |
| 永續祝福3 | 127（18%） | 84（只從 header 下的白縫露出一絲） | 橘 | 已是白方塊，在臉的第 01 格位置 |
| 永續祝福4 | 4（≈0） | −424（已放行，反正看不見） | 橘 | 臉已長成完整笑臉 |

三個關鍵推論：

**① forum 真的被定住。** 分鏡 1→3 的 forum y 是 77 / 83 / 84（幾乎不動），色塊上緣卻從 597 升到 127。
分鏡3 的截圖上還看得到「精彩活動回顧」在 header 下方那條白縫裡露出來 —— 反證 forum 沒有跟著捲。
分鏡4 的 forum 跑到 y = −424，那是**覆蓋完成後 sticky 放行**、恢復一般捲動，此時 forum 已全被蓋住、
位置不構成約束。

**② blessing 的標題／引言／臉是黏在色塊上跟著升的**，不是淡入。分鏡3／4 的「標題距色塊上緣 146、
臉距 135」是同一組偏移，所以設計師說的「原本位置的白字標題」＝ 它們一直在版位上，只是被色塊帶進畫面。
（分鏡1／2 的內層偏移是 280／429，與 3／4 差約 134 —— 那是設計師中途挪過內容，兩張都還在畫面外、
不影響讀圖。）

**③ 接縫上那架飛機是 sprite 的最後一格。** `Frame 12745` 是 72×56，裡面包一個 **72×88** 的 group，
而 `FORUM_PLANE_FRAMES` 第 9 格正好是 `w: 72, h: 88`。路徑末段 R5→R6 是往下走 → 機鼻朝下、
下半截 32px 沒入色塊，與外框的裁切量吻合。

顏色：色塊藍是 Figma 變數 `main/light blue` = `#9FD6FF` = 專案已有的 `--color-blue`
（`tailwind.css` 的註解寫它是「逐格臉本格新增的生長邊緣」）。**同一個 token，不新增色值。**

---

## 二、幾何：cover 這段的長度不是設定值

定義 **接縫 S** ＝ `.sec2__pin` 下緣 ＝ `.section3` 的視覺上緣。

整段 cover ＝「S 從視窗底緣升到視窗頂緣」＝ **幾何上剛好 100vh**。
它與 `BLESSING_VH` 那種旋鈕不同類：沒有可調的長度，調它就等於改變「色塊上升速度 ≠ 捲動速度」，
而色塊上緣就是 `.section3` 的上緣、在一般流裡跟捲動 1:1，不存在第二種可能。

### 三件事湊出「定住 ＋ 覆蓋」

```
.sec2
  .sec2__path        （不動）
  .sec2__pin         position: sticky;               ← 定住最後一屏
                     top: calc(vh() - var(--sec2-pin-h))
  .sec2__seam        height: 0                       ← 真正的接縫標記（不 sticky）
  .sec2__cover-hold  height: vhLength(1)             ← sticky 的活動範圍
  <ForumCore>        （fixed，順序無關）
.section3            margin-top: calc(#{vh()} * -1); z-index: 1
```

### ⚠️ 夾點必須用 `top`，不是 `bottom`（2026-08-12 實測修正）

本設計稿最初寫的是 `bottom: 0`，**那是錯的**，實作後在真實頁面上量出來完全沒有定住效果。

`bottom: 0` 的語意是「不讓下緣掉到視窗底緣**以下**」：它在你還沒捲到那一塊時先把它往
**上**拉進畫面，捲過去就放行 —— **它永遠不會把元素往下推**。而「捲過去時原地不動」
需要的正是往下推。`top` 才是往下推的那一側。

因為 `.sec2__pin` **比視窗高**（pc 實測 4243 vs 900），夾點要放在 `vh() − 塊高`：
把「頂端」夾在那裡，等價於把「下緣」夾在視窗底緣。

1440×900、`?highlights=1`，取 cover 窗口的 p = 0 / 0.25 / 0.5 / 0.75 / 1，
量 `.sec2__pin` 下緣相對視窗底緣：

| 夾點 | 五個取樣點的偏移 | 結果 |
|---|---|---|
| `bottom: 0` | 0, −225, −450, −675, −900 | 以 1:1 跟著捲動走 ＝ **完全沒定住** |
| `top: calc(vh() − 塊高)` | 0, 0, 0, 0, 0 | **整段 100vh 誤差 0px** |

兩者的面板上緣都是 900 → 675 → 450 → 225 → 0 線性上升（那一半本來就是對的）。

時機也剛好：夾點觸發的條件是「自然頂端升過 `vh() − 塊高`」＝「自然下緣升過視窗底緣」，
而自然下緣就是接縫 —— 也就是 cover 的起點，不會提早定住；放行則由容器（`.sec2`）
下緣決定，也就是 `.sec2__cover-hold` 用完的那一刻。

塊高隨內容、字體、斷點與 `?highlights` 開關變，CSS 算不出來 → 由 JS 量進
`--sec2-pin-h`（`ResizeObserver`，同 `Blessing.vue` 量 `--face-block-h` 的作法）。
fallback 刻意給大到不可能的值，夾點變成極負數、sticky 永不觸發 → 退回「不定住」的
原本行為。**量不到時寧可沒有效果，不要一個錯的定住**（fallback 給 0 會讓夾點變成
`100vh`，整個 forum 尾段被往下推出畫面）。

- **頁面總高不變**：`.sec2` 被 spacer 撐高 100vh，`.section3` 的負 margin 又扣回來 → 淨零。
  `Media`（04）不位移，`2026-08-11-blessing-media-transition-design.md` 那段過場**不需要重調**。
- **`.section3` 開始上升的捲動位置完全沒變**：它的流位置 ＝ `.sec2__pin` 下緣（spacer 前），
  也就是今天的接縫。
- **定住的 100vh 與上升的 100vh 是同一段**：`.sec2__pin` 的 sticky 活動範圍就是那個 spacer，
  而 spacer 的起點就是接縫。兩段首尾自動對齊，**不需要第二條 trigger 去同步**。
- **定住的是「forum 最後一屏」**（夾點等價於下緣貼視窗底緣，見下方 ⚠️），與尾端是精彩活動
  還是論壇四無關 —— `ForumHighlights` 維持 `?highlights=1` 的預設關閉，日後打開自動就是
  設計稿的樣子。

⚠️ **spacer 高度與負 margin 必須是同一個值**，否則頁面總高會變、`Media` 位移。
兩邊都從 `--vh` 取（JS 的 `vhLength(1)`、SCSS 的 `vh()`），故恆等。不要把任何一邊寫成字面 `100vh`
—— 那會在行動裝置網址列收合時與另一邊脫鉤（見 `architecture/viewport-height.md`）。

### 層序

只給 `.section3` 加 `z-index: 1`，**不要**給 `.sec2` 加 z-index。
`.sec2__path` 也是 `z-index: 1`，同值由 DOM 順序決勝 → `.section3` 在後、贏。
給 `.sec2` 加 z-index 會讓它變成 stacking context，把裡面 `<ForumCore>` 的 `z-index: 20` 關進去
—— 那顆現在不會在這個時機出現，但沒有理由去製造一個未來才會爆的耦合。

---

## 三、接觸點：一個旋鈕，不是兩個

`ForumCorePath` 現在那條 ScrollTrigger 的 `end` 是 `top+=<tailEndY> center`，意思是
「接縫升到**視窗中央**時飛機走完路徑」，而路徑最後一個節點就錨在接縫上 —— 也就是說：

> **飛機走完路徑 ＝ 色塊上緣碰到飛機。** 這件事今天就已經成立，不需要新的量測或門檻。

而且飛機的螢幕位置本來就被回中節點表拉在視窗中央附近（見 `buildArcKnots`），
所以「接縫升到視窗中央」與「接縫升到飛機所在高度」是同一件事 —— 與論壇段入口
`start: 'top center'` 的零跳點交棒是同一招。

於是接觸點做成單一常數，並讓路徑的 `end` **由它導出**：

```ts
// ── forum → blessing 覆蓋過場 ────────────────────────────────────────
// cover 軌吃的捲動距離恆等於 100vh（幾何鎖死，見設計稿第二節），故不需要 *_VH 常數。
//
// COVER_CONTACT：紙飛機碰到色塊上緣的時機（cover 軌 0..1）。
// 它同時是 ForumCorePath 那條 ScrollTrigger 的 end 對齊位置 —— 兩者**必須**一致，
// 所以只有這一個來源，那邊改讀 coverContactAlign()。
// 0.5 ＝ 接縫升到視窗中央 ＝ 今天 `center` 的行為，行為不變。
// 設計稿的接觸點在畫面 67%（＝ 0.333）；改它會連帶拉長整條 forum 路徑的捲動尺、
// 飛機全程變慢，所以維持 0.5，要對稿再調這一個數字。
export const COVER_CONTACT = 0.5;

/** ForumCorePath 的 ScrollTrigger end 對齊字串（接縫此刻的視窗位置）。 */
export function coverContactAlign(): string {
  return `${(1 - COVER_CONTACT) * 100}%`;
}

// 藍→橘（與標題／引言淡入）在接觸後吃掉的 cover 進度。設計師的描述是「碰觸時變橘」，
// 所以要短到讀起來像瞬間；但不做成 0：滿版色塊硬切會閃。
// 0.06 × 100vh，pc 900 高約 54px 捲動 ≈ 一兩格滑鼠滾輪。
export const COVER_ORANGE_FADE = 0.06;
```

`ForumCorePath` 側：

```js
end: () => `top+=${tailEndY} ${coverContactAlign()}`,
```

---

## 四、四拍與各自的門檻

| 拍 | cover 進度 | 畫面 | 誰負責 |
|---|---|---|---|
| ① 藍色塊升起 | 0 → `COVER_CONTACT` | `#9FD6FF` 滿版塊往上蓋；forum 尾段定住；臉／標題／引言全藏著 | `.section3` 背景 ＋ 顯隱門檻 |
| ② 接觸 | `COVER_CONTACT` → ＋`COVER_ORANGE_FADE` | 色塊轉橘；飛機沒入（被色塊蓋住）；白方塊從接縫長出；標題與引言淡入 | `coverOrangeAt()` |
| ③ 白方塊歸位 | `COVER_CONTACT` → 1 | 色塊升到滿版；白方塊從接縫沉到臉的第 01 格 | `seedTravelAt()` |
| ④ 逐格臉 | （cover 結束） | `.section3` 上緣抵達視窗頂 → 現有 `faceST` 接手 | 既有 `blessingProgress` |

②③ 的起點相同、長度不同（②短、③走到底），刻意重疊：色塊轉橘的同時方塊就開始動，
不需要在中間插一個空拍。

④ 與 cover 首尾相接不重疊：`faceST` 的 `start: 'top top'` 就是 cover 軌的 `end: 'top top'`。

### 曲線（純函式，住在 `orange-core-config.ts`）

```ts
/** cover 軌 p 時「橘的比例」（0 ＝ 全藍、1 ＝ 全橘）。標題／引言的 opacity 共用同一條。 */
export function coverOrangeAt(p: number): number {
  return smoothstep(COVER_CONTACT, COVER_CONTACT + COVER_ORANGE_FADE, p);
}

/** cover 軌 p 時白方塊走完「接縫 → 臉的第 01 格」的比例（0 ＝ 貼在接縫上、1 ＝ 就位）。 */
export function seedTravelAt(p: number): number {
  return smoothstep(COVER_CONTACT, 1, p);
}
```

沿用檔內既有的 `smoothstep`（同 `partnersFadeAt` / `symbolIntroOpacity`）：兩端一階導數為 0，
scrub 的頭尾沒有硬轉折，且本身已夾在 `[0, 1]`。
`seedTravelAt` 用 smoothstep 而非線性有額外的好處：接觸後方塊幾乎不動一小段
（讀起來像「從邊緣冒出來」），末端才緩緩落進格子。

---

## 五、白方塊：橫向數字全部對得上，只有縱向偏移要量

**35px ＝ 臉的一個 2×2 格**：`blessing-face-frames.ts` 是 16×16 網格、方塊多為 2×2 單位，
pc 的臉 280px → 一格 17.5px → 2×2 ＝ 35px。分鏡的 `Group 12479` 每個 rect 都是 35×35，
`Rectangle 8554` 也是 35 寬。

**第 01 格水平居中於臉**：`FACE_FRAMES[0]` 只有 `[7,0,2,2]`，網格 x 7..9 of 16 → 中心 8 ＝ 網格正中。

**現有版面已經把那一格放在設計稿要白方塊出現的位置**：

```
.section3__face-inner: width 100%, padding 0 108px, justify-content center, gap 180
內容塊 = 臉 280 + gap 180 + intro 507 = 967，置中於視窗 → 臉框中心 = 視窗中心 − 343.5
第 01 格中心 = 臉框中心（水平居中）→ pc 1280 時 = 296.5，格子佔 x 279–314
設計稿 Rectangle 8554 = x 277–312          ← 差 2px
```

於是白方塊做成 `.section3__face` 的**子元素**、用百分比定位，**不需要任何 JS 量測**：

```scss
// 白方塊：飛機沒入色塊後從接縫長出來的那一格，就是逐格臉的第 01 格
// （FACE_FRAMES[0] = [7,0,2,2] → 網格 7/16 起、佔 2/16，水平居中於臉）。
// 位移的起點是「色塊上緣」＝ 臉屏上緣，故 translateY 的幅度就是臉框在臉屏內的 y
// （--face-cell-y，由 JS 量，見下）。進度到 1 時歸零 → 與 BlessingFace 第 0 格像素重合。
.section3__face-seed {
  position: absolute;
  top: 0;
  left: 43.75%;   // 7 / 16
  width: 12.5%;   // 2 / 16
  aspect-ratio: 1;
  background: #fff;
  transform: translateY(calc((var(--cover-seed) - 1) * var(--face-cell-y, 0px)));
}
```

`.section3__face` 要補 `position: relative`（目前沒有定位）。
方塊與臉的 svg 是**兄弟**、同住在 `.section3__face` 裡（見下一節的顯隱門檻：
不能靠藏 `.section3__face` 來藏臉，那會把方塊一起藏掉）。

### `--face-cell-y` 為什麼一定要量

pc 的臉在 `.section3__face-inner` 的**第一個** flex item，臉框上緣 ＝ face-inner 上緣，
可以用既有的 `--face-block-h` 純 CSS 推出來（`50vh − --face-block-h / 2`）。
但 **pad／mob 的 `.section3__face` 是 `order: 2`、排在文字下方**，臉框上緣還要加上 intro 高度與 gap
—— 那個值 CSS 算不出來。

所以延用既有的 `syncFaceBlockHeight()`（以及它那顆 ResizeObserver）多量一個值：
`.section3__face` 的 `getBoundingClientRect().top − .section3__face-screen` 的 `top`，
寫進 `.section3` 的 `--face-cell-y`。一次量測、三個斷點同一條路徑。

⚠️ 與 `--face-block-h` 一樣**必須寫在 section 根節點**：`.section3__face-seed` 讀得到是因為自訂屬性
往下繼承；寫在別處會靜靜退回 fallback `0px`（方塊乾脆不動，看起來像 bug 而不是壞掉）。

### 交棒

cover 進度到 1 時方塊已就位、與 `BlessingFace` 的第 0 格（同一格、同色 `#fff`）像素完全重合
→ **硬切**：藏方塊、露臉。刻意不做 crossfade，理由同 `.forum-path__core` 的註解
（兩顆一模一樣時淡入淡出反而會看到兩者都不是全不透明的那一瞬間）。

### 飛機終點要往左挪，才落在那一格上

| 斷點 | 現值 | 改成 | 推導 |
|---|---|---|---|
| pc `R6.x` | `0.261`（334px） | **`0.2316`** | 臉框中心 ＝ 視窗中心 − 343.5；`.forum-path` 是 1280 置中 → 296.5 / 1280。**與視窗寬無關**（兩者都錨在視窗中心） |
| pad `S6.x` | `0.472` | **`'center'`** | pad 的臉框水平置中於視窗，而第 01 格居中於臉框 → 就是視窗中心 |
| mob `T7.x` | `0.495` | **`'center'`** | 同上（現值 0.495 已經幾乎是了）。⚠️ mob 的末節點是 **T7**，`T6` 是精彩活動那一點 |

`x: 'center'` 是 `forum-node-path` 本來就支援的寫法，不必新增格式。
改末節點的 x 只動到那條**看不見**的設計線尾端（`stroke: transparent`，只有 `?pathdebug` 才現形）。

---

## 六、色塊換色與三個顯隱門檻

### 背景

```scss
.section3 {
  // 退路：不支援 color-mix 的瀏覽器會整條丟掉下面那個宣告，若沒有這一行，色塊會**沒有背景**
  // —— 變透明、露出底下的 forum，整段覆蓋直接破功。給純橘 ＝ 降級成「全程橘、少了藍色那一拍」，
  // 那是這段轉場最安全的落點（橘是它最終、也是最長的狀態）。
  // ⚠️ 順序是關鍵：退路必須在前，寫在後面會贏過 color-mix、把效果殺掉。
  background: var(--color-orange);
  background: color-mix(
    in srgb,
    var(--color-orange) calc(var(--cover-orange, 1) * 100%),
    var(--color-blue)
  );
}
```

`color-mix()` 本身沒問題 —— 專案已經在用（`AppHeader.vue` 的 `--hd-bg`），`100dvh` / `100svh`
也已在 `Media.vue` / `Subpage.vue` 用著；`viewport-height.ts` 與 `mixins.scss` 那些「不用 2022 年後
語法」的註解是針對 `--vh` 單一來源機制的決定，不是全域禁令。**要補的只是退路**：那兩處不支援時
只是少個底色濃淡，這裡不支援卻會讓整段覆蓋破功，blast radius 不同（2026-08-12 補上）。

`--cover-orange` 由 `coverOrangeAt(coverProgress)` 餵入，預設 `1`（純橘）——
SSR 與任何還沒建好 trigger 的時刻都落在橘色，不會閃一下藍。
兩個色都是 token，`test/design-tokens.spec.ts` 的「不重複寫死色值」照樣成立。

### 三個門檻

| 元素 | 現身時機 | 理由 |
|---|---|---|
| `.section3__intro`（標題＋引言） | `coverOrangeAt > 0`，opacity 跟著它走 | 白字。它的版位在臉屏內約 panel-local 220，cover 進度 0.31 就進畫面了 —— 比接觸（0.5）**早**，不擋掉會有一段白字疊在淺藍上。設計師說「底色變橘時，會看到…白字標題」，所以與換色同一條曲線 |
| `.section3__face-art`（掛在 `<BlessingFace>` 上的 class） | cover 進度 ＝ 1 | 在那之前臉的第 01 格與白方塊會同時出現在同一個位置（兩顆白方塊）。⚠️ 門檻掛在**臉的 svg** 上，不是 `.section3__face` —— 白方塊住在後者裡面，藏外層會把方塊一起藏掉 |
| `.section3__face-seed`（白方塊） | 接觸 → cover 進度 1 | 接觸前它會貼在色塊上緣、比飛機先出現 |

**intro 與臉的 svg** 用 opacity 而非 `v-if`：`--face-cell-y` 是量 `.section3__face` 相對臉屏的偏移，
那兩個元素得一直在版面上，量測才成立。

**白方塊用 `v-if`**（2026-08-12 實作時修正本節原本「三者都用 opacity」的說法 —— 那句話寫得過廣）：
它是 `position: absolute`，本來就不參與 `.section3__face` 的排版，藏或不藏都影響不到 `--face-cell-y`；
而 `v-if` 才給得出 reduce-motion 下「**根本沒有方塊**」的行為（`opacity: 0` 只是看不見，元素還在）。
scrub 驅動的那兩個（intro、seed）**不要**加 `transition`
—— 理由同 `.section3__partners.is-out` 的註解（補間會讓每一幀滯後於捲動，手感發黏）。

### header 不用改

`pickHeaderTheme` 重疊時取 DOM 順序在後者，而 `.section3` 帶的是 `data-header-theme="orange"`。
`.section3` 上緣越過 header 底緣（83px / 720 → cover 進度 ≈ 0.88）時它自動接手，
那時色塊早就變橘（0.5）→ 不會出現「橘 header 配淺藍底」。
在那之前上緣還在 header 底緣**下方**，`s.top <= headerBottom` 不成立，命中的仍是 forum 的 `light`
—— 而畫面上緣此刻確實是被定住的 forum 白底。**現有機制天然正確，這次不動它。**

---

## 七、共享軌與 SEQUENCE

`useOrangeCoreProgress.ts`，照檔頭「延伸」那段的做法加一條：

```ts
// forum → blessing 覆蓋過場的捲動進度（0..1）：由 Blessing.vue 的第三條 ScrollTrigger
// （`.section3` 的 top bottom → top top，幾何上恆為 100vh）寫入，故往回捲自動倒帶。
const coverProgress = useState<number>('blessing-cover-progress', () => 0);
const setCoverProgress = (p: number) => (coverProgress.value = clamp01(p));

const coverOrange = computed(() => coverOrangeAt(coverProgress.value));
const coverSeed = computed(() => seedTravelAt(coverProgress.value));

// 減少動態時逐格臉直接停在完成的笑臉（見 blessingFrame）→ 沒有「第 01 格」可以交棒，
// 白方塊沉下去之後會看到完整笑臉硬換上來。那種情形乾脆不要方塊、臉從 cover 起就在。
const coverSeedVisible = computed(
  () => !reduceMotion.value
    && coverProgress.value >= COVER_CONTACT
    && coverProgress.value < 1,
);
const coverFaceVisible = computed(
  () => reduceMotion.value || coverProgress.value >= 1,
);
```

`coverOrange` **刻意不吃 `reduceMotion`**：它是綁在捲動上的換色、不是自走動畫，
理由與 `partnersOpacity` 那條註解相同。

`orange-core-config.ts`：

- `SequenceTrack` 加 `'cover'`。
- `TRACK_VH.cover = 1.0`。**這條軌的長度是幾何常數**（`top bottom` → `top top` 恆為一個視窗高），
  不像 `path` / `forumPath` 得靠量測，所以 dashboard 給得出 vh。
- `SEQUENCE` 的 blessing 章**開頭**插一個 part（在 `face` 之前）：

```ts
{ key: 'cover', label: `色塊往上蓋（${COVER_CONTACT * 100}% 處接觸、轉橘）`,
  drive: 'scrub', track: 'cover' },
```

檢查過「表中不可出現相鄰的兩個 `none`」：`forum.agenda`(none) → `blessing.cover`(scrub) ✓。

### 觸發

`Blessing.vue` 第三條 ScrollTrigger（與臉、退場那兩條並存）：

```js
coverST = ScrollTrigger.create({
  trigger: sectionRef.value,
  start: 'top bottom',
  end: 'top top',
  invalidateOnRefresh: true,
  onUpdate: (self) => setCoverProgress(self.progress),
  onRefresh: (self) => setCoverProgress(self.progress),
  onLeaveBack: () => setCoverProgress(0),
  onLeave: () => setCoverProgress(1),
});
```

`onBeforeUnmount` 一併 `coverST?.kill()`。

`onRefresh` 不是可有可無的：header 的 `#blessing` 是深連結，直接落在段落中段時
`onUpdate` 不保證會發火，`coverProgress` 留在 0 → **滿版淺藍色塊**。
`faceST` 有同一個潛在問題（深連結落在臉的中段會停在第 0 格），順手一起補上同樣的 `onRefresh`。

---

## 八、一個真的地雷：sticky 會污染路徑的量測

`.sec2__pin` 一旦是 sticky，`ForumCorePath.build()` 在 `refreshInit` 量測時，
若此刻 sticky 正 engage，`getBoundingClientRect()` 拿到的是**被黏住之後**的位置。
而後半段的錨點幾乎都在 `.sec2__pin` 裡面（論壇四的 tag／cta／speakers、精彩活動的 item），
量錯不會報錯 —— 整條線靜默歪掉，正是 `architecture/forum-node-path.md` 第七節警告的那種事故。

兩道防護：

**① 接縫改錨到一個不 sticky 的零高度標記。** 既有的 `PIN_END` 一併改名（它已經不指
`.sec2__pin` 了，留著舊名字只會讓人以為錨點沒動）：

```ts
const SEAM_END: ForumPathAnchor = { sel: '.sec2__seam', edge: 'top' };
```

`.sec2__seam` 在 `.sec2__pin` **之後**、spacer 之前，是普通流的零高度 div
→ 位置恆等於 `.sec2__pin` 的自然下緣，天生免疫 sticky。
（順帶讓 `tailEndY` 的語意更精確：它量的是「接縫」，而不是「某個剛好在接縫上的區塊」。）

**② 量測期間把 sticky 關掉。**

`build()` 在跑 `buildNodesD()` / `syncSlashWindow()` **之前**給 `.sec2` 上 `data-path-measuring`，
量完立刻拿掉：

```scss
.sec2__pin {
  position: sticky;
  // 夾點用 top 而非 bottom，且要減掉塊高 —— 理由與實測數字見第二節的 ⚠️。
  top: calc(#{vh()} - var(--sec2-pin-h, 100000px));

  // 量測期間退回一般流：sticky 位移會污染 .sec2__pin 內所有錨點的 rect（見設計稿第八節）。
  // 設值 → 量測 → 還原都在同一個 task 內完成，中間不會 paint，畫面不會跳。
  .sec2[data-path-measuring] & {
    position: static;
  }
}
```

設值與還原各自是一次寫入，中間才是那一整批量測 —— 仍然符合 `buildNodesD` 的
「先把所有錨點量完再算，不在中途寫任何 style」（那條規則要避免的是量測**之間**插入寫入）。

---

## 九、測試

`test/blessing-cover.spec.ts`（新增，照 `test/blessing-outro.spec.ts` 的寫法）

- `COVER_CONTACT` ∈ (0, 1)；`COVER_CONTACT + COVER_ORANGE_FADE` < 1
  （轉橘必須在 cover 結束前完成，否則色塊會帶著藍進入逐格臉那一屏）
- `coverContactAlign() === '50%'`，並註明它與 `ForumCorePath` 的 `end` 是同一個來源
- `coverOrangeAt(0) === 0`、`coverOrangeAt(COVER_CONTACT) === 0`、
  `coverOrangeAt(COVER_CONTACT + COVER_ORANGE_FADE) === 1`、`coverOrangeAt(1) === 1`，區間內單調遞增
- `seedTravelAt(COVER_CONTACT) === 0`、`seedTravelAt(1) === 1`，區間內單調遞增
- 定義域外夾住：兩條在 `-1` 與 `2` 都不越界

`test/forum-node-path.spec.ts`（既有檔案，**必須改**）

- ⚠️ 既有的「%s 的最後一點掛在段落底（不受開關影響）」斷言 `last.anchor.sel === '.sec2__pin'`
  且 `edge === 'bottom'` —— 改錨之後這條會紅，要一起改成 `.sec2__seam` / `'top'`
- 追加：pc 末節點的 x 是 `0.2316`，並在測試裡寫下推導（296.5 / 1280），避免日後被當成 magic number 改掉
- 追加：pad（`S6`）／mob（`T7`）末節點的 x 是 `'center'`

---

## 十、不做的事

- **不用 GSAP pin 定住 forum。** pin-spacer 會改 `.sec2` 的高度與 `.sec2__pin` 的位置，
  而路徑的 `tailEndY` 與 ScrollTrigger 的 `end` 都是從那裡量的；pin 還會建立 transform
  containing block，撞到 `<ForumCore>` 的 `position: fixed`。
  `Blessing.vue` 檔頭當初就寫了「不 pin：sticky 就夠，少一層 transform／containing block 的雷」。
- **不新增獨立的過場元件（fixed 幕簾）。** 幕簾的橘要跟 `.section3` 的橘底做 pixel-perfect 交棒，
  而 `2026-08-11-blessing-media-transition-design.md` 第五節已經為同一件事做過決定：
  「不新增過場元件、不做兩顆橘塊的交棒」。而且幕簾之下的 forum 不會被定住，
  設計師的「fix 在畫面中心」拿不到。
- **不把接觸點改成設計稿的 67%。** `COVER_CONTACT = 0.333` 可以精準對稿，但那會拉長整條
  forum 路徑的捲動尺、飛機全程變慢，而 0.5 是專案既有的零跳點慣例（同論壇段入口的
  `start: 'top center'`）。差 17vh，要對稿改一個常數即可。
- **不讓紙飛機在俯衝時就轉白。** 設計稿把接縫上的飛機畫成白色，但那張稿它疊在照片上；
  production 那一刻飛機在視窗中央、身後是 forum 的白底 —— 轉白就消失了。
  白色只出現在接縫**下方**那個方塊（分鏡2 的 `Rectangle 8554` 本來就是這樣畫的）。
  真要照字面做，得先保證那一刻飛機身後是暗的，而定住的內容是什麼並不可控。
- **不追分鏡3／4 的「內容距色塊上緣 135／146」。** 那是過場中的暫態；`.section3__face-screen`
  現在的 sticky 置中是從「永續祝福01–03」成稿來的，也是這段的最終定裝
  —— 改成 135 會讓已驗收的定裝畫面跑掉。
- **不動 `ForumHighlights` 的預設顯隱。** 轉場機制寫成與尾端內容無關，旗標日後打開就是設計稿的樣子。
- **不在 cover 期間鎖捲動。** 全程 scrub、可逆，與設計稿標註的「綁滾動」一致。

---

## 十一、驗收

1. **定住**：慢捲過 forum 尾端 → 最後一屏的內容停在原處不動，淺藍色塊從畫面底緣往上蓋過它；
   `?highlights=1` 時被蓋住的是精彩活動，不帶參數時是論壇四尾段，兩者行為相同。
2. **接觸**：色塊上緣碰到紙飛機的**同一刻**，色塊轉橘、飛機沒入、白方塊從接縫長出。
   看不到「飛機已經被蓋住但色塊還是藍的」或反過來的落差。
3. **白字**：標題「永續祝福」與引言在色塊轉橘時才現身，任何時刻都不會有白字疊在淺藍上。
4. **交棒**：白方塊沉到臉的第 01 格 → 換成 `BlessingFace` 時**看不到位移、縮放或閃爍**
   （兩者同格同色同位置）。
5. **整段可逆**：往回捲 → 方塊回到接縫、色塊回藍、標題引言淡出、forum 重新露出來。
6. **頁面總高不變**：套用前後 `document.body.scrollHeight` 相同；`Media` 的開場 timeline
   每一拍的手感不變。
7. **路徑沒歪**：在 cover 進行中（sticky 已 engage）觸發 resize 或字體載入完成 →
   `ScrollTrigger.refresh()` 之後設計線與飛機的位置仍然正確（`?pathdebug` 對照）。
8. **深連結**：直接開 `/#blessing` → 色塊是橘的、臉在該有的格號上，不會看到滿版淺藍。
9. **降級路徑**：`prefers-reduced-motion` 下沒有白方塊，臉從 cover 起就是完成的笑臉，換色照舊。
   ⚠️ **2026-08-12 實測：這一條驗不過，但原因不在本次的程式碼。** `useOrangeCoreProgress` 的
   `reduceMotion`（`useState` ＋ `onMounted` 讀 `matchMedia`）在 render 時始終是 `false`——
   模擬 `prefers-reduced-motion: reduce` 時，JS 的 `matchMedia().matches` 是 `true`、CSS 也生效
   （`.section3__partners` 的 `transition` computed 成 `none`），但 `blessingFrame` 仍停在第 0 格、
   白方塊仍出現。`git show 8932cfb^` 證實那套機制與 `blessingFrame` 的早期 return **在本計畫之前
   就存在且未被本計畫修改** → 既有的「逐格臉停在完成笑臉」本來就沒作用，本段新增的兩個門檻
   讀同一個旗標，因此一併失效（門檻邏輯本身經兩輪 review 確認正確）。屬另案，未在本次處理。
10. **三個斷點**：pad／mob 的白方塊同樣落在臉的第 01 格上（那兩個斷點的臉在文字**下方**，
    靠 `--face-cell-y` 的量測而非 CSS 推導）。

---

## 十二、實作後的實測數字（2026-08-12）

以 Playwright 在真實頁面上量的，供日後改動時當回歸基準。`p` ＝ cover 軌進度。

### 頁面總高與骨架（1440×900、`?highlights=1`）

| 項目 | 改動前 | 改動後 |
|---|---|---|
| `document.body.scrollHeight` | 23969 | **23969**（delta 0） |
| `.sec2` 高 | 9686 | 10586（＋900 ＝ 一個視窗高） |

`.sec2__cover-hold` 高 900 ＝ `.section3` 的 `margin-top` −900（同一個 `--vh`），故淨零。
`.sec2__seam` 高 0、`position: static`、位置恰在 `.sec2__pin` 自然下緣（差 0px）。
`.section3` `z-index: 1`、`.sec2` `z-index: auto`。

### 定住（`.sec2__pin` 下緣 − 視窗底緣）

| p | −0.2 | 0 | 0.2 | 0.4 | 0.5 | 0.6 | 0.8 | 1 | 1.2 |
|---|---|---|---|---|---|---|---|---|---|
| 偏移 | +180 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | −180 |

不提早定住（−0.2 仍在自然位置）、全程 0px、cover 之後正確放行。
面板上緣同時 120% → 100 → 80 → 60 → 50 → 40 → 20 → 0 → −20% 線性。

### 接觸點與換色

飛機中心 − 接縫：p=0.5 時 **0px**（＝ `COVER_CONTACT` 的幾何預期，視窗中央）。

| p | 0 → 0.5 | 0.52 | 0.56 → 1 |
|---|---|---|---|
| `--cover-orange` | 0 | 0.259 | 1 |
| 背景 | `srgb(0.6235, 0.8392, 1)` ＝ `#9FD6FF` | 藍橘混色 | `srgb(1, 0.498, 0)` ＝ `#FF7F00` |
| intro opacity | 0 | 0.259 | 1 |

轉橘於 0.5 起、0.56 完成（＝ `COVER_ORANGE_FADE` 0.06）。
**白字未曾疊在藍底上**：p=0.5（最後一格全藍）時 intro 上緣已在畫面 84%，但 opacity 仍為 0。

### 白方塊與交棒（三個斷點）

| 斷點 | `--face-cell-y` | 定住 | 接觸時「方塊上緣 − 色塊上緣」 | 交棒 dy | dx / dw |
|---|---|---|---|---|---|
| pc 1440×900 | 310px | 0px | 0.0 | **0.00** | 0 / 0 |
| pad 1024×900 | 469px | 0px | 0.0 | **0.00** | 0 / 0 |
| mob 414×896 | 491px | 0px | 0.0 | **0.00** | 0 / 0 |

三個 `--face-cell-y` 都不同，正是「必須量測」的證據：pad 的 `--face-block-h` 是 598，
若照 pc 的算式 `(vh − 塊高)/2` 會得 151，與實際 469 差 318px（＝ intro 高 ＋ gap）。

pc 的收斂過程（`--cover-seed` → 方塊與臉第 01 格的 dy）：

| p | 0.5 | 0.52 | 0.7 | 0.9 | 0.99 | 0.999 |
|---|---|---|---|---|---|---|
| `--cover-seed` | 0 | 0.005 | 0.352 | 0.896 | 0.999 | 1.000 |
| dy | −310 | −308.6 | −200.9 | −32.2 | −0.34 | **0.00** |

smoothstep 的形狀看得出來：接觸後只走 1.45px，末端才緩緩落定。臉的 svg 全程 opacity 0，
不會出現兩顆白方塊。

### 深連結

`/?highlights=1#blessing` 直接落地：`--cover-orange` = 1、背景橘 —— 不會看到滿版淺藍。

### 量測時的兩個坑（日後重測請注意）

1. **hero 有捲動鎖與 `position: fixed` 疊層**（`.hero-start`，`z-index: 1500`）。`scrollTo` 之後
   版面量測是對的，但畫面會被鎖回 hero → 截圖全是 start 畫面。要先 `.hero-start__cube` click
   再按 Skip，`.hero-start` 卸載後才截得到。
2. **`skip` 之後版面還在沉澱**（ScrollTrigger refresh、pin spacer 釋放），此時算出的
   「cover 起點」會事後漂移，取樣點就會對到錯的位置。改成**反解**：迭代收斂到
   「面板上緣 ＝ 目標 px」的捲動位置，對漂移免疫。
