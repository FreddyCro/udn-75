# 02.forum → 03.blessing 過場 — 決策紀錄

日期：2026-08-12（2026-08-12 壓縮，原 596 行的完整設計稿見 `git show e0840bd:architecture/2026-08-12-forum-blessing-transition-design.md`）
狀態：**已實作**
相關檔案：`app/components/02.forum/Forum.vue`、`ForumCorePath.vue`、`app/components/03.blessing/Blessing.vue`、
`app/composables/useOrangeCoreProgress.ts`、`app/utils/orange-core-config.ts`、`app/utils/forum-node-path.ts`、
`test/blessing-cover.spec.ts`
設計稿：pc 四張分鏡 **永續祝福1–4**＝`2065:145459` / `2065:145381` / `2065:145577` / `2065:145653`
（pad／mob 分鏡未提供，以 pc 稿推導、三個斷點共用同一套機制）

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

常數、曲線與 SCSS 都在上述檔案裡（`COVER_CONTACT` / `coverContactAlign()` / `coverOrangeAt()` /
`seedTravelAt()`），以下只留**程式碼讀不出來的推導與踩過的坑**。

---

## 一、分鏡讀出來的三個事實

| 分鏡 | 色塊上緣 y | forum 內容 y | 色塊顏色 | 飛機／方塊 |
|---|---|---|---|---|
| 永續祝福1 | 597（83% 畫面高） | 77 | 淺藍 `#9FD6FF` | 不在畫面上 |
| 永續祝福2 | 480（67%） | 83 | 橘 | 飛機在接縫上、機鼻已沒入；接縫下方 35×27 白方塊 |
| 永續祝福3 | 127（18%） | 84（只從 header 下的白縫露出一絲） | 橘 | 已是白方塊，在臉的第 01 格位置 |
| 永續祝福4 | 4（≈0） | −424（已放行，反正看不見） | 橘 | 臉已長成完整笑臉 |

**① forum 真的被定住。** 分鏡 1→3 的 forum y 幾乎不動（77 / 83 / 84），色塊上緣卻從 597 升到 127。
分鏡3 還看得到「精彩活動回顧」在 header 下方那條白縫裡露出來 —— 反證 forum 沒有跟著捲。
分鏡4 的 −424 是**覆蓋完成後 sticky 放行**、恢復一般捲動。

**② blessing 的標題／引言／臉是黏在色塊上跟著升的**，不是淡入。分鏡3／4 的「標題距色塊上緣 146、
臉距 135」是同一組偏移 —— 設計師說的「原本位置的白字標題」＝ 它們一直在版位上，只是被色塊帶進畫面。

**③ 接縫上那架飛機是 sprite 的最後一格。** `Frame 12745` 是 72×56，裡面包一個 **72×88** 的 group，
而 `FORUM_PLANE_FRAMES` 第 9 格正好是 `w: 72, h: 88`。路徑末段 R5→R6 往下走 → 機鼻朝下、
下半截 32px 沒入色塊，與外框的裁切量吻合。

色塊藍是 Figma 變數 `main/light blue` = `#9FD6FF` = 專案已有的 `--color-blue`。**不新增色值。**

---

## 二、幾何：cover 這段的長度不是設定值

定義 **接縫 S** ＝ `.sec2__pin` 下緣 ＝ `.section3` 的視覺上緣。
整段 cover ＝「S 從視窗底緣升到視窗頂緣」＝ **幾何上剛好 100vh**。
它與 `BLESSING_VH` 那種旋鈕不同類：沒有可調的長度 —— 色塊上緣就是 `.section3` 的上緣、
在一般流裡跟捲動 1:1，不存在第二種可能。

骨架：`.sec2__pin`（sticky，定住最後一屏）→ `.sec2__seam`（`height: 0`，真正的接縫標記，
**不 sticky**）→ `.sec2__cover-hold`（`vhLength(1)`，sticky 的活動範圍）；`.section3` 吃
`margin-top: calc(#{vh()} * -1)` ＋ `z-index: 1`。

### ⚠️ 夾點必須用 `top`，不是 `bottom`（實測推翻本稿原本寫法）

本稿最初寫 `bottom: 0`，**那是錯的**，實作後在真實頁面上量出來完全沒有定住效果。

`bottom: 0` 的語意是「不讓下緣掉到視窗底緣**以下**」：它在你還沒捲到那一塊時先把它往
**上**拉進畫面，捲過去就放行 —— **它永遠不會把元素往下推**。而「捲過去時原地不動」
需要的正是往下推。`top` 才是往下推的那一側。

因為 `.sec2__pin` **比視窗高**（pc 實測 4243 vs 900），夾點要放在 `vh() − 塊高`：
把「頂端」夾在那裡，等價於把「下緣」夾在視窗底緣。

| 夾點 | cover 窗口 p = 0/.25/.5/.75/1 時，`.sec2__pin` 下緣相對視窗底緣 | 結果 |
|---|---|---|
| `bottom: 0` | 0, −225, −450, −675, −900 | 以 1:1 跟著捲動走 ＝ **完全沒定住** |
| `top: calc(vh() − 塊高)` | 0, 0, 0, 0, 0 | **整段 100vh 誤差 0px** |

時機也剛好：夾點觸發的條件是「自然頂端升過 `vh() − 塊高`」＝「自然下緣升過視窗底緣」，
而自然下緣就是接縫 —— 也就是 cover 的起點，不會提早定住。

塊高隨內容、字體、斷點與 `?highlights` 開關變，CSS 算不出來 → 由 JS 量進 `--sec2-pin-h`
（`ResizeObserver`）。**fallback 刻意給大到不可能的值**，夾點變成極負數、sticky 永不觸發 →
退回「不定住」的原本行為。**量不到時寧可沒有效果，不要一個錯的定住**
（fallback 給 0 會讓夾點變成 `100vh`，整個 forum 尾段被往下推出畫面）。

其他三個結論：

- **頁面總高不變**：`.sec2` 被 spacer 撐高 100vh，`.section3` 的負 margin 又扣回來 → 淨零。
  `Media`（04）不位移，`2026-08-11-blessing-media-transition-design.md` 那段過場不需要重調。
  ⚠️ **spacer 高度與負 margin 必須是同一個值**，兩邊都從 `--vh` 取（`vhLength(1)` / `vh()`）。
  不要把任何一邊寫成字面 `100vh` —— 行動裝置網址列收合時會脫鉤（見 `architecture/viewport-height.md`）。
- **定住的 100vh 與上升的 100vh 是同一段**：`.sec2__pin` 的 sticky 活動範圍就是那個 spacer，
  spacer 的起點就是接縫。兩段首尾自動對齊，**不需要第二條 trigger 去同步**。
- **層序**：只給 `.section3` 加 `z-index: 1`，**不要**給 `.sec2` 加。`.sec2__path` 也是 1，
  同值由 DOM 順序決勝 → `.section3` 在後、贏。給 `.sec2` 加 z-index 會讓它變成堆疊脈絡，
  把裡面 `<ForumCore>` 的 `z-index: 20` 關進去。

---

## 三、接觸點：一個旋鈕，不是兩個

`ForumCorePath` 的 ScrollTrigger `end` 是「接縫升到**視窗中央**時飛機走完路徑」，
而路徑最後一個節點就錨在接縫上 —— 也就是說：

> **飛機走完路徑 ＝ 色塊上緣碰到飛機。** 這件事今天就已經成立，不需要新的量測或門檻。

而且飛機的螢幕位置本來就被回中節點表拉在視窗中央附近，所以「接縫升到視窗中央」與
「接縫升到飛機所在高度」是同一件事 —— 與論壇段入口 `start: 'top center'` 是同一招零跳點交棒。

於是接觸點做成單一常數 `COVER_CONTACT = 0.5`，**路徑的 `end` 由 `coverContactAlign()` 導出**。
兩邊各寫一份就會在調值時脫鉤，症狀是「飛機已經被色塊蓋住但底色還是藍的」。

**不改成設計稿的 67%**（`COVER_CONTACT = 0.333` 可以精準對稿）：那會拉長整條 forum 路徑的
捲動尺、飛機全程變慢，而 0.5 是專案既有的零跳點慣例。差 17vh，要對稿改一個常數即可。

### 藍→橘後來改成事件觸發（2026-08-12 依回饋）

原本是 `smoothstep(COVER_CONTACT, COVER_CONTACT + COVER_ORANGE_FADE, p)`，
現在 `coverOrangeAt()` 是**二元**的（`p >= COVER_CONTACT ? 1 : 0`），補間交給 CSS transition。
理由：在 scrub 上疊 transition 會讓每一幀都追一次補間、手感發黏；改成只跨越一次就沒有這個問題。
（`COVER_ORANGE_FADE` 因此退場。）

---

## 四、白方塊：橫向數字全部對得上，只有縱向偏移要量

**35px ＝ 臉的一個 2×2 格**：`blessing-face-frames.ts` 是 16×16 網格、方塊多為 2×2 單位，
pc 的臉 280px → 一格 17.5px → 2×2 ＝ 35px。分鏡的 `Group 12479` 每個 rect 都是 35×35。

**第 01 格水平居中於臉**：`FACE_FRAMES[0]` 只有 `[7,0,2,2]`，網格 x 7..9 of 16 → 中心 8 ＝ 網格正中。

**現有版面已經把那一格放在設計稿要白方塊出現的位置**：

```
.section3__face-inner: width 100%, padding 0 108px, justify-content center, gap 180
內容塊 = 臉 280 + gap 180 + intro 507 = 967，置中於視窗 → 臉框中心 = 視窗中心 − 343.5
第 01 格中心 = 臉框中心（水平居中）→ pc 1280 時 = 296.5，格子佔 x 279–314
設計稿 Rectangle 8554 = x 277–312          ← 差 2px
```

所以白方塊是 `.section3__face` 的**子元素**、用百分比定位（`left: 43.75%` ＝ 7/16、
`width: 12.5%` ＝ 2/16），**橫向不需要任何 JS 量測**。

### `--face-cell-y` 為什麼一定要量

pc 的臉是 `.section3__face-inner` 的**第一個** flex item，臉框上緣 ＝ face-inner 上緣，
可以用既有的 `--face-block-h` 純 CSS 推出來。但 **pad／mob 的 `.section3__face` 是 `order: 2`、
排在文字下方**，臉框上緣還要加上 intro 高度與 gap —— 那個值 CSS 算不出來。

實測證據：pad 的 `--face-block-h` 是 598，照 pc 的算式 `(vh − 塊高)/2` 會得 151，
與實際 469 差 318px（＝ intro 高 ＋ gap）。三個斷點量到 310 / 469 / 491，全都不同。

⚠️ 與 `--face-block-h` 一樣**必須寫在 section 根節點**：`.section3__face-seed` 讀得到是因為
自訂屬性往下繼承；寫在別處會靜靜退回 fallback `0px`（方塊乾脆不動，看起來像 bug 而不是壞掉）。

### 交棒

cover 進度到 1 時方塊已就位、與 `BlessingFace` 的第 0 格（同格同色 `#fff`）像素完全重合 →
**硬切**：藏方塊、露臉。刻意不做 crossfade，理由同 `.forum-path__core`（兩顆一模一樣時
淡入淡出反而會看到兩者都不是全不透明的那一瞬間）。

### 飛機終點要往左挪，才落在那一格上

| 斷點 | 舊值 | 現值 | 推導 |
|---|---|---|---|
| pc `R6.x` | `0.261`（334px） | **`0.2316`** | 臉框中心 ＝ 視窗中心 − 343.5；`.forum-path` 是 1280 置中 → 296.5 / 1280。**與視窗寬無關**（兩者都錨在視窗中心） |
| pad `S6.x` | `0.472` | **`'center'`** | pad 的臉框水平置中於視窗，而第 01 格居中於臉框 → 就是視窗中心 |
| mob `T7.x` | `0.495` | **`'center'`** | 同上。⚠️ mob 的末節點是 **T7**，`T6` 是精彩活動那一點 |

改末節點的 x 只動到那條**看不見**的設計線尾端（`stroke: transparent`，只有 `?pathdebug` 才現形）。

---

## 五、三個顯隱門檻與一個 CSS 退路

| 元素 | 現身時機 | 理由 |
|---|---|---|
| `.section3__intro`（標題＋引言） | 跟著 `coverOrangeAt` 走 | 白字。它的版位在臉屏內約 panel-local 220，cover 進度 0.31 就進畫面了 —— 比接觸（0.5）**早**，不擋掉會有一段白字疊在淺藍上 |
| `.section3__face-art`（臉的 svg） | cover 進度 ＝ 1 | 在那之前臉的第 01 格與白方塊會同時出現在同一個位置（兩顆白方塊）。⚠️ 門檻掛在**臉的 svg** 上，不是 `.section3__face` —— 白方塊住在後者裡面，藏外層會把方塊一起藏掉 |
| `.section3__face-seed`（白方塊） | 接觸 → cover 進度 1 | 接觸前它會貼在色塊上緣、比飛機先出現 |

**intro 與臉的 svg 用 opacity 而非 `v-if`**：`--face-cell-y` 是量 `.section3__face` 相對臉屏的
偏移，那兩個元素得一直在版面上，量測才成立。
**白方塊用 `v-if`**：它是 `position: absolute`、本來就不參與排版，而 `v-if` 才給得出
reduce-motion 下「**根本沒有方塊**」的行為（`opacity: 0` 只是看不見，元素還在）。
scrub 驅動的兩個**不要**加 `transition` —— 補間會讓每一幀滯後於捲動，手感發黏。

### `color-mix` 一定要有純橘退路

```scss
background: var(--color-orange);        // ⚠️ 退路必須在前
background: color-mix(in srgb, var(--color-orange) calc(var(--cover-orange, 1) * 100%), var(--color-blue));
```

不支援 `color-mix` 的瀏覽器會整條丟掉第二個宣告，沒有第一行的話色塊會**沒有背景** ——
變透明、露出底下的 forum，整段覆蓋直接破功。給純橘 ＝ 降級成「全程橘、少了藍色那一拍」，
那是這段轉場最安全的落點（橘是它最終、也是最長的狀態）。**順序是關鍵**：退路寫在後面會贏過
`color-mix`、把效果殺掉。

`--cover-orange` 預設 `1`（純橘）—— SSR 與任何還沒建好 trigger 的時刻都落在橘色，不會閃一下藍。

> `color-mix()` 本身沒問題（`AppHeader.vue` 的 `--hd-bg` 已在用）。`viewport-height.ts` 與
> `mixins.scss` 那些「不用 2022 年後語法」的註解是針對 `--vh` 單一來源機制的決定，不是全域禁令。
> 差別在 blast radius：那兩處不支援時只是少個底色濃淡，這裡不支援卻會讓整段覆蓋破功。

### header 不用改

`pickHeaderTheme` 重疊時取 DOM 順序在後者，而 `.section3` 帶的是 `data-header-theme="orange"`。
`.section3` 上緣越過 header 底緣（cover 進度 ≈ 0.88）時它自動接手，那時色塊早就變橘（0.5）。
在那之前命中的仍是 forum 的 `light` —— 而畫面上緣此刻確實是被定住的 forum 白底。
**現有機制天然正確。**

### `onRefresh` 不是可有可無的

`coverST` 與 `faceST` 都要掛：header 的 `#blessing` 是深連結，直接落在段落中段時 `onUpdate`
不保證會發火，`coverProgress` 留在 0 → **滿版淺藍色塊**。

---

## 六、一個真的地雷：sticky 會污染路徑的量測

`.sec2__pin` 一旦是 sticky，`ForumCorePath.build()` 在 `refreshInit` 量測時，若此刻 sticky 正
engage，`getBoundingClientRect()` 拿到的是**被黏住之後**的位置。而後半段的錨點幾乎都在
`.sec2__pin` 裡面 —— 量錯不會報錯，整條線靜默歪掉，正是 `architecture/forum-node-path.md`
第二節那種事故。

**兩道防護：**

① **接縫改錨到一個不 sticky 的零高度標記** `.sec2__seam`（在 `.sec2__pin` 之後、spacer 之前，
普通流的零高度 div → 位置恆等於 `.sec2__pin` 的自然下緣，天生免疫 sticky）。
舊的 `PIN_END` 一併改名為 `SEAM_END` —— 它已經不指 `.sec2__pin` 了，留著舊名字只會讓人
以為錨點沒動。（順帶讓 `tailEndY` 的語意更精確：它量的是「接縫」，而不是「某個剛好在接縫上的區塊」。）

② **量測期間把 sticky 關掉**：`build()` 在跑產生器**之前**給 `.sec2` 上 `data-path-measuring`
（SCSS 對應 `position: static`），量完立刻拿掉。設值 → 量測 → 還原都在同一個 task 內完成，
中間不會 paint，畫面不會跳；也仍符合「先把所有錨點量完再算，不在中途寫任何 style」
（那條規則要避免的是量測**之間**插入寫入）。

---

## 七、不做的事

- **不用 GSAP pin 定住 forum。** pin-spacer 會改 `.sec2` 的高度與 `.sec2__pin` 的位置，
  而路徑的 `tailEndY` 與 ScrollTrigger 的 `end` 都是從那裡量的；pin 還會建立 transform
  containing block，撞到 `<ForumCore>` 的 `position: fixed`。
- **不新增獨立的過場元件（fixed 幕簾）。** 幕簾的橘要跟 `.section3` 的橘底做 pixel-perfect
  交棒，而 `2026-08-11-blessing-media-transition-design.md` 已經為同一件事做過決定。
  而且幕簾之下的 forum 不會被定住，設計師的「fix 在畫面中心」拿不到。
- **不讓紙飛機在俯衝時就轉白。** 設計稿把接縫上的飛機畫成白色，但那張稿它疊在照片上；
  production 那一刻飛機在視窗中央、身後是 forum 的白底 —— 轉白就消失了。
  白色只出現在接縫**下方**那個方塊。
- **不追分鏡3／4 的「內容距色塊上緣 135／146」。** 那是過場中的暫態；`.section3__face-screen`
  現在的 sticky 置中是從「永續祝福01–03」成稿來的，也是這段的最終定裝。
- **不動 `ForumHighlights` 的預設顯隱。** 轉場機制寫成與尾端內容無關，旗標日後打開就是設計稿的樣子。
- **不在 cover 期間鎖捲動。** 全程 scrub、可逆，與設計稿標註的「綁滾動」一致。

---

## 八、實作後的實測數字

以 Playwright 在真實頁面上量的，供日後改動時當回歸基準。`p` ＝ cover 軌進度。

**頁面總高與骨架**（1440×900、`?highlights=1`）：`document.body.scrollHeight` **23969 → 23969
（delta 0）**；`.sec2` 高 9686 → 10586（＋900 ＝ 一個視窗高），由 `.section3` 的 `margin-top` −900 扣回。

**定住**（`.sec2__pin` 下緣 − 視窗底緣）：

| p | −0.2 | 0 | 0.2 | 0.4 | 0.5 | 0.6 | 0.8 | 1 | 1.2 |
|---|---|---|---|---|---|---|---|---|---|
| 偏移 | +180 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | −180 |

不提早定住、全程 0px、cover 之後正確放行。面板上緣同時 120% → 0% → −20% 線性。

**接觸點**：飛機中心 − 接縫，p=0.5 時 **0px**（＝ `COVER_CONTACT` 的幾何預期）。
**白字未曾疊在藍底上**：p=0.5（最後一格全藍）時 intro 上緣已在畫面 84%，但 opacity 仍為 0。

**白方塊與交棒（三個斷點）**：pc 1440×900 / pad 1024×900 / mob 414×896 的 `--face-cell-y` 分別是
**310 / 469 / 491px**，定住偏移皆 0px，接觸時「方塊上緣 − 色塊上緣」皆 0.0，交棒 dy/dx/dw 皆 **0.00**。

pc 的收斂過程（`--cover-seed` → 方塊與臉第 01 格的 dy）：

| p | 0.5 | 0.52 | 0.7 | 0.9 | 0.99 | 0.999 |
|---|---|---|---|---|---|---|
| `--cover-seed` | 0 | 0.005 | 0.352 | 0.896 | 0.999 | 1.000 |
| dy | −310 | −308.6 | −200.9 | −32.2 | −0.34 | **0.00** |

smoothstep 的形狀看得出來：接觸後只走 1.45px，末端才緩緩落定。臉的 svg 全程 opacity 0。

**深連結**：`/?highlights=1#blessing` 直接落地 → `--cover-orange` = 1、背景橘，不會看到滿版淺藍。

### ⚠️ 唯一驗不過的一條：`prefers-reduced-motion`

模擬 `reduce` 時 CSS 有生效（`.section3__partners` 的 `transition` computed 成 `none`）、
JS 的 `matchMedia().matches` 也是 `true`，但 `blessingFrame` 仍停在第 0 格、白方塊仍出現。
根因是 `useOrangeCoreProgress` 的 `reduceMotion`（`useState` ＋ `onMounted` 讀 `matchMedia`）
在 render 時始終是 `false` —— `git show 8932cfb^` 證實那套機制**在本計畫之前就存在且未被修改**，
既有的「逐格臉停在完成笑臉」本來就沒作用，本段新增的兩個門檻讀同一個旗標因此一併失效
（門檻邏輯本身經兩輪 review 確認正確）。**屬另案，未處理。**

### 量測時的兩個坑（日後重測請注意）

1. **hero 有捲動鎖與 `position: fixed` 疊層**（`.hero-start`，`z-index: 1500`）。`scrollTo` 之後
   版面量測是對的，但畫面會被鎖回 hero → 截圖全是 start 畫面。要先 `.hero-start__cube` click
   再按 Skip，`.hero-start` 卸載後才截得到。
2. **`skip` 之後版面還在沉澱**（ScrollTrigger refresh、pin spacer 釋放），此時算出的
   「cover 起點」會事後漂移。改成**反解**：迭代收斂到「面板上緣 ＝ 目標 px」的捲動位置，對漂移免疫。
