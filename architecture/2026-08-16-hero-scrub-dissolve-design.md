# hero 退場改綁捲動（sticky ＋ scrub）— 決策紀錄

日期：2026-08-16
狀態：**設計已確認，未實作**
分支：`feat/hero-intro-reveal`
取代：`architecture/2026-08-16-hero-intro-reveal-design.md`（同日稍早，鎖住捲動的版本 —— 見第〇節）
相關檔案：`app/components/01.hero/HeroVideo.vue`、`Hero.vue`、`Hero.scss`、
`app/composables/useHeroVideo.ts`、`app/utils/hero-video-config.ts`、
刪除 `app/utils/hero-scroll-intent.ts`／`hero-scroll-lock.ts` 及其測試
連帶要改：`.claude/memory/hero-body-lock-rules.md`（大部分內容將失效）

---

## 〇、為什麼推翻同日稍早那份設計

前一份設計用「退場段一律鎖住捲動 ＋ 鎖延長到淡出結束」來消滅「淡出與捲動賽跑」。
它在**首次觀看**是正確的（實測：拍 ①–⑧ 全鎖、解鎖那一幀影片 opacity 已是 0、引言完整露出）。

但它在**重播路徑**壞掉，而且是我在該份 spec 第三-4 節親手判定「無害」的那個副作用失控：

使用者回報的重現步驟（先往下滑、再往回滑，反覆來回），實測：

```
往下滑 → scrollY 2800，影片 opacity 0（gone）
往回滑 → scrollY 0，影片 opacity 1 ＋ loop 箭頭   ← rewindToLoop，影片淡回、loop 不鎖
再往下 → LOCK @ scrollY 400，影片 opacity 1       ← 鎖在半路
```

`loop` 在重播時不鎖（`hasLeftLoop` 的既有例外），所以「甩一下」會先讓頁面自由捲 400px，
手勢累積到門檻才觸發 `outro` —— 然後鎖就把頁面凍在 scrollY 400 長達 2.5 秒。
此時滿版影片層蓋住螢幕 −400～500，**正好吃掉引言的第一段**。畫面見
`temp/repro-frozen-midscroll.png`，與使用者截圖一致。

我當初估的偏移是「約 60px（手勢門檻），畫面靜止，判定無害」。那個估算只在慢慢滾時成立；
**快速甩一下就是 400px 以上**。這是判斷錯誤，不是實作偏離設計。

⇒ 結論不是「把鎖調得更聰明」，而是**這一類機制整個不要**。鎖、手勢累積器、撐鎖計時器、
`hasLeftLoop` 例外，全都是為了對抗「時間動畫 vs 捲動」這場賽跑而長出來的；把退場改綁捲動，
賽跑不存在，這批東西一起消失。

---

## 一、機制：唯一的驅動源是捲動進度

`.sec1__hero` 改成 `position: sticky; top: 0`，影片層因此恆定佔滿螢幕、不隨捲動移動；
引言在它底下往上捲。一條**不 pin** 的 scrub ScrollTrigger 讀進度 `p`，`p` 是唯一驅動源：

| `p` | 狀態 | 影片 |
|---|---|---|
| 0 | `loop` | 播 loop 段 |
| 跨越 0 的那一刻 | `outro` | seek 到退場段並播（只做一次，之後不干預播放） |
| 0 < p < 1 | `outro` | 依自己的時間軸播；stage opacity ＝ 1 − p |
| p ≥ 1 | `gone` | stage `visibility: hidden`，停止合成 |
| 從 `gone` 往回捲（p 落回 < 1） | 回 `loop` | seek 回 loop 段 |
| 往回捲 p → 0 | `loop` | 續播 loop 段 |

倒帶因此是**免費的**：scrub 天生可逆，往回捲就是往回演。不需要「到頂 ＋ 往上累積 140px」的判定。

⚠️ 跨越 0 那一處要加遲滯：`p > 0.02` 才進 `outro`、`p < 0.005` 才回 `loop`。
沒有遲滯的話，停在邊界上的微小抖動（觸控板慣性、橡皮筋）會反覆 seek 影片。

### ⚠️ 抵達過 `gone` 之後，往回捲不得再回到 `outro`

本節原本寫的是「`p ≥ 1` 那一端不需要處理 —— 越過即 `gone`，退回是連續的溶解、沒有 seek」。
**這一句是錯的**，2026-08-16 實測推翻：

退場段播完是**停在最後一格**，而那一格的構圖就是 `gone`（橘方塊在正中央 —— 那正是
`HERO_OUTRO_CORE_ANCHOR` 交棒給 DOM core 的那一格）。於是從 `gone` 往回捲時，狀態被送回
`outro`、影片 seek 回 36s 再播 2.5 秒又凍住，畫面淡回來的是那格凍住的退場末幀 ——
使用者看到的仍然是 `gone`，影片「回不到 loop」（實測：捲回 y=360 時 state 是 `outro`、
影片停在 38.57s、stage opacity 0.67）。只有捲到 `p < 0.005`（＝ scrollY < 5px）才會翻回
`loop`，而那是整段捲動範圍的最後 0.5%。

規則：狀態機多吃一個輸入 `outroSpent`（這一趟下滑抵達過 `gone` 沒有）。

| | |
|---|---|
| 設起 | `setState('gone')` —— 不綁 scrub 的門檻，`heroIO` 的「捲出視窗就收尾」也算 |
| 清掉 | `p < 0.005`（捲回頂端）與 `returnToLoop()` —— 兩者都是「重新開始一趟」 |
| 效果 | 為 true 時 `p < 1` 一律判 `loop`；`p ≥ 1` 仍判 `gone`（否則 orange core 接不上） |

換段發生在 `p` 剛落回 1 之下，此時 stage opacity ≈ 0（實測 0.004），故 seek 看不見。
代價是**同一趟裡再往下捲不會重播退場段**（維持 `loop` 淡出到 `gone`）—— 這是刻意的：
退場已經看過了，而在半透明處硬切回退場段起點才是看得見的破綻。捲回頂端就重新武裝。

### ⚠️ scrub 不是唯一能進 `gone` 的路，stage 的顯隱要蓋過它

SKIP、影片載入失敗（`onError`）、帶 hash 進站（`bypassLoader`）都會**在 scrollY 0 直接進
`gone`**。此時 `p` 是 0，若 stage 的 opacity 純粹由 `1 − p` 決定，影片會留在畫面上不走。

規則：

```
stage 可見度 = 已跳過開場 ? 隱藏 : (1 − p)
```

「已跳過開場」＝ **不經 scrub 而抵達 `gone`**，由 `skip()` / `onError()` / `bypassLoader()`
設定；設定後 scrub 不再驅動狀態（否則往下捲會把已經跳過的人送回 `outro`）。
`returnToLoop()`／回捲跨回 `p < LEAVE` 要清掉它，倒帶才能正常回到 loop。

⚠️ 清除條件判的是**跨越**，不是 `p < LEAVE` 這個當下值（2026-08-17 修正）：三條短路路徑
本來就發生在 `p = 0`，只看當下值的話，設旗子那一刻觸發的 `applyDissolve` 會立刻把它清回去
＝ SKIP 失效。要「先離開過門檻、再回捲跨回來」才算 —— 那正是使用者由下往上捲回 page top
的軌跡，與 `outroSpent` 的重新武裝同一刻。

⇒ 這個旗標很可能就是現有的 `hasLeftLoop` 改個語意來擔任。**故第四節「`hasLeftLoop`
可能可以刪除」要以此為準重新評估** —— 它多半留得下來，只是職責從「要不要重新上鎖」
換成「scrub 還算不算數」。

### 捲動鎖只剩一條

```
shouldLockScroll = state === 'main' && !hasLeftLoop
```

`main`（33 秒正片）**維持鎖住** —— 品牌開場不可跳過，這是既有的使用者裁決，本次不動。
`loop` 起解鎖：那顆閃爍的下滑箭頭本來就是「請往下捲」，讓捲動直接生效比要求一個
累積到 60px 的手勢更誠實；而且不解鎖就沒有捲動可以驅動 scrub，會死結。

### opacity 寫在 stage，不寫在影片層

scrub 每幀寫 opacity，會與 CSS transition 打架。分工：

- `.sec1__hero-stage` 的 opacity ＝ **scrub**（溶解）
- `.sec1__hero-video` 的 opacity ＝ 維持它自己的 `is-loading` 時間淡入（canplay 之前防白閃）

兩者相乘，互不干擾。`is-ended` class 與 `HERO_VIDEO_FADE_MS`／`HERO_FADE_HOLD_GRACE_MS`
一併刪除 —— 溶解不再有「固定時長」這個概念。

---

## 二、為什麼是 sticky，不是 pin 也不是 fixed

| | 文件高度 | 對其他章節的幾何風險 | 代價 |
|---|---|---|---|
| **sticky（採用）** | **完全不變** | **零** | 對祖先鏈的捲動容器敏感 —— 已查完（見下） |
| `position: fixed` | 不變 | 零 | 影片層必須搬出 `.sec1__inner`，元件要拆成兩塊分屬不同父層 |
| ScrollTrigger `pin` | 多一個 pin-spacer | 高 | 與 `transitionST`／`OrangeCorePath` 互相餵幾何，後面三章的落點全部連動 |

決定性的差別是**失敗方式**：pin 壞掉是安靜的幾何漂移（每段進度偏一點，沒有任何東西喊出來
—— 這個專案吃過最多苦頭的類型）；sticky 根本不改文件高度，這類失敗在構造上不存在。

`fixed` 被排除是因為實測 `.sec1__inner` 從頁面載入起就帶著 `transform: matrix(1,0,0,1,0,0)`
（ScrollTrigger 的 pin 機制先寫上去的），fixed 子孫會改以它為定位基準 —— 這正是
HeroLoader / HeroStart / HeroSymbolTransition 三層掛在 inner 外面的原因。sticky 是對
**捲動容器**定位，不受祖先 transform 影響，故一行 CSS 就好、元件結構完全不動。

**祖先鏈已實測**（`#app-hero` → `<html>`）：中間全部 `overflow: visible`，沒有任何元素會
變成 sticky 的捲動容器。body/html 只在 `main` 期間因捲動鎖而是 `hidden`，解鎖後 html 回到
`overflow-x: clip`，而 clip **不建立捲動容器**（`base.scss` 已依賴這個性質）。
⚠️ 日後若有人在 `.sec1` 到 `<html>` 之間任何一層加上 `overflow: hidden/auto/scroll`，
sticky 會安靜失效 —— 這是本方案唯一的脆弱點，值得在 SCSS 註解裡寫明。

---

## 三、幾何與旋鈕

```scss
$intro-at:  0.85;   // 溶解結束時，引言上緣落在螢幕的哪裡
$dissolve:  1.2;    // 溶解吃掉多少捲動距離（× 視窗高）
// 佔位高 H = $dissolve + $intro-at —— 推導值，不是第三個旋鈕
```

```
引言上緣螢幕位置 = H − scrollY
stage opacity    = 1 − (scrollY / $dissolve)
⇒ scrollY = $dissolve 時，引言上緣 = H − $dissolve = $intro-at
```

⚠️ **佔位高 H ＝ 2.05vh 比視窗還高**，而 sticky 元素「比視窗高時還會不會在 `top: 0` 黏住」
是這個幾何的載重假設。**已實測**（1440×900、實際頁面上插入 1845px 的 sticky 探針）：
scrollY 0 / 300 / 900 / 1800 / 3000 五個點量到的 `getBoundingClientRect().top` 全部是 0。
成立。

⚠️ 對照組：若改成「`.sec1__hero` 不 sticky、由內層 stage 自己 sticky」，stage 只能在
`.sec1__hero` 的框內黏，會在 `H − 1vh` 就脫離 —— 要它撐過溶解就得 `H ≥ $dissolve + 1`，
與 `H = $dissolve + $intro-at`（$intro-at < 1）矛盾。**所以 sticky 必須下在 `.sec1__hero` 上**，
它的容器是很高的 `.sec1__inner`，黏住的範圍才夠。

### ⚠️ 隱含約束：`$dissolve` 有上限，超過就會在溶解途中脫黏

sticky 的黏著範圍被容器底緣限制。實測（1440×900）：

```
.sec1__inner 底緣 3143 − 佔位高 1845 = 1298  ← 釋放點
溶解結束於 1.2 × 900              = 1080  ← 餘裕 218px
```

代入 `H = $dissolve + $intro-at`，釋放點恰好等於**引言的總高**（body ＋ runway）：

```
釋放點 = innerBottom − H = 引言總高
⇒ 約束： $dissolve × vh  <  引言 body 高 + runway(0.5 + INTRO_FADE_VH)×vh
⇒ 900 高代入：body 高需 > (1.2 − 0.9) × vh = 270px（實測 body 約 488px，通過）
```

**把 `$dissolve` 調大時務必重算這條。** 超過的話 hero 會在溶解途中脫黏、影片邊淡邊往上滑走
—— 而且不會有任何錯誤訊息，只會覺得「怪怪的」。這條要寫進 `.sec1__hero` 的 SCSS 註解。
（2026-08-16 實作 Task 2 時實測發現；原設計沒算到容器底緣這個限制。）

**`$intro-at` 沿用 0.85 是刻意的**：溶解走完那一刻的畫面，正好是使用者先前核准過的那一格
（core 在 50%、引言從 85% 露出約三行）。構圖完整保留，只是觸發方式從「退場後自動出現」
變成「捲完 `$dissolve`」。`--chrome-inset` 仍只從 `$intro-at` 那一段扣（露出量要對可視高度算）。

**`$dissolve = 1.2` 的理由**：拿掉鎖之後，唯一還給退場影片時間的就是捲動距離。

| 值 | 距離（900 高） | 一般捲速看到的退場 |
|---|---|---|
| 0.5 | 450px | 0.6–0.9s / 2.5s |
| **1.2（採用）** | 1080px | 1.4–2.2s / 2.5s |
| 2.0 | 1800px | 2.2–3.6s / 2.5s |

1.2 與同專案的 `TRANSITION_VH`（1.2）同量級，是這份程式碼裡已被接受的節奏。
快速甩過去的人仍會截斷退場、core 交棒退化成單純淡入 —— 這是已裁決的「捲動優先」。

---

## 四、會刪掉的東西

- `app/utils/hero-scroll-intent.ts` **整支** ＋ `test/hero-scroll-intent.spec.ts`
  （`to-outro`／`to-loop` 都由 scrub 取代）
- `app/utils/hero-scroll-lock.ts` 的 `shouldHoldFade`，以及 `useHeroVideo` 的 `fadeHold`、
  `clearFadeHold`、計時器。
  **`hero-scroll-lock.ts` 這個檔案本身保留**（連同測試）：真值表雖然縮成一條
  `state === 'main' && !hasLeftLoop`，但這條規則今年已經改過四次、且壞掉時畫面上不會有
  任何東西喊出來。留一支釘住它的測試，成本是幾行、收益是下次改動會當場失敗而不是靜默劣化。
- `HERO_VIDEO_FADE_MS`、`HERO_FADE_HOLD_GRACE_MS`、`.sec1__hero-video` 的 `is-ended`
- `rewindToLoop`（scrub 可逆，無人呼叫）
- `HERO_GESTURE`、`createHeroGestureAccum` 及 `HeroVideo` 內的 wheel／touch／keydown 監聽

**淨結果是刪的比加的多。** 使用者回報的凍結、以及它之前那三版補丁，都屬於同一類機制。

**待實作時確認、不先承諾**：`heroIO` 在 sticky 之下 hero 不會離開視窗，可能不再需要；
移除前要確認沒有第二個消費者。`hasLeftLoop` 則**預期留下**（見第一節末：它要改任
「scrub 還算不算數」）。

---

## 五、進站路徑（含使用者指定要保住的 `/#loop`）

| 路徑 | 預期 |
|---|---|
| 首頁重整 | `main` 鎖住 → 正片播完 → `loop` 解鎖 → 捲動即溶解 |
| SKIP | **跳到 `outro`**（2026-08-17 改；原本是直接 `gone`）：seek 36s 播完 2.5 秒停在最後一格、舞台全實，等使用者捲動才溶解進 `gone`。不設「已跳過開場」—— 舞台被隱藏的話退場段等於放給空氣看 |
| 子頁 → header logo → `/#loop` | 載入層跑完 → `loop` → 落在 scrollY 0 → 可立即往下捲溶解 |
| 首頁 header logo（就地倒帶） | `scrollTo(0)` → p 歸零 → 自然回 `loop` |
| 其他 hash（`/#forum` 等） | `bypassLoader()` → `gone`，stage 隱藏，不鎖 |

⚠️ **`/#loop` 的已知風險，必須在實作裡處理**：`scrollToTopForLoop()` 掛在 `nextTick`，
而子頁的捲動位置會延續到 Hero 掛載之後。scrub ST 若在 `onMounted` 就開始寫狀態，會先讀到
一個很大的 `p` → 判 `gone`、把影片 seek 到退場段 → 下一 tick 被 `scrollTo(0)` 拉回 → 再倒回
`loop` 又 seek 一次，使用者看到影片抽搐。

處理方向：**scrub 對狀態的寫入延後到落點確定之後**（與 `scrollToInitialHash` 一樣，
先 `refreshScrollTriggers()` 再放行）。這是不變量，驗收時單獨測這條路徑。

⚠️ 行為改變（可接受，但要記錄）：今天帶 `/#loop` 進站會落在 `loop` 且**鎖住**；
新設計裡 loop 不鎖，從子頁按 logo 回來後可以立刻往下捲。

---

## 六、驗證

沿用前一份 spec 已建立的量測紀律（那些教訓不隨設計改變而失效）：

| 要驗的事 | 正確量法 |
|---|---|
| 鎖有沒有生效 | `innerWidth − documentElement.clientWidth === 0`，**不是** `scrollY` |
| 使用者滑得動嗎 | 真實輸入（`page.mouse.wheel` / `keyboard.press`），**不是** `window.scrollBy` |
| 某一刻的畫面 | rAF 監看狀態翻面那一幀，**不是**截圖（截圖總是慢一步） |
| scrub 值 | 設好 scrollY 後**等 400ms ＋ 兩個 rAF** 再讀（150ms 不夠沉澱，會讀到舊 transform） |

必測項目：

1. **使用者回報的重現步驟**：往下滑 → 往回滑 → 再往下滑，反覆數次。全程不得出現
   `is-scroll-locked`（`main` 以外），影片與引言的相對關係要與捲動連續。
2. **四種捲速**（400／800／1600／3000 px/s）連續捲動：溶解結束時引言上緣都應落在
   `$intro-at` 附近，且與速度無關。跳捲量不出這類問題。
3. **`/#loop` 從子頁導航進站**：影片不得抽搐，落點 scrollY 0，狀態為 `loop`。
4. **`main` 仍鎖**：正片期間真實按鍵不能捲動。
5. **短路路徑蓋得過 scrub**：`/#forum` 進站（與影片載入失敗）→ stage 立刻不可見；
   **其後往下捲，影片不得重新出現、狀態不得回到 `outro`**。這一條直接對應第一節末那個洞
   （自我複查時發現：純綁 `1 − p` 的話，`p` 是 0，影片會賴在畫面上）。
   ⚠️ 2026-08-17 起 **SKIP 已不走這條** —— 它改成跳到 `outro`（見第五節路徑表）。
6. **短路之後仍能回頭**（2026-08-17 補）：`/#forum` 進站後捲回 page top → 影片淡回、
   狀態回 `loop`；再往下捲 → 退場段完整重播一次 → `gone`。
7. **SKIP 的接續**（2026-08-17 補）：在 scrollY 0 按 SKIP → 影片 seek 36s、全實播放退場段
   → 停在最後一格且下滑提示在場。**捲一點點（`p` 尚未越過 `ENTER`）不得抽回 `loop`**
   —— 這正是 `outroForced` 那面栓擋的事，也是本次唯一新增的狀態。其後往下捲 → 溶解 →
   `gone`（`prev === 'outro'` ⇒ orange core 走交棒而非單純淡入）→ 捲回頂端 → `loop`。
8. 回歸：core 恆在 50vh、引言淡出與 `transitionST` 接手仍在同一點、`/#forum` 落點。

---

## 七、不做什麼 / 已接受的代價

- **放棄「靜止時就看到引言一角」**（前一份 spec 的 R1）。scrub 的定義就是「不捲就不淡」，
  兩者幾何互斥。使用者 2026-08-16 明確選擇後者。
- **快速捲會截斷退場影片**，core 交棒退化成單純淡入。已裁決的「捲動優先」。
- **不動 `main` 的鎖**、不動 `--intro-runway`／`INTRO_FADE_VH`／`transitionST`。
- **不用 pin**（理由見第二節）。
- 保留前一份 spec 已完成且仍正確的部分：`.sec1__hero-stage` 這一層、它的
  `pointer-events: none`、`.sec1` 的白底、`.sec1__intro` 已刪除的 `padding-top`。
