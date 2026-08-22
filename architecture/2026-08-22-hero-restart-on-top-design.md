# hero 開場改成「順播到退場 ＋ 回頂端重播」— 決策紀錄

日期：2026-08-22
狀態：**已實作並實測**（branch `feat/hero-restart-on-top`，未 commit 前的實測見第四節）
相關檔案：`app/utils/hero-dissolve.ts`、`app/utils/hero-scroll-lock.ts`、`app/utils/hero-video-config.ts`、
`app/composables/useHeroVideo.ts`、`app/components/01.hero/Hero.vue`、`HeroVideo.vue`、
`app/components/ui/AppHeader.vue`、`app/utils/home-intent.ts`
取代：`2026-08-16-hero-scrub-dissolve-design.md` 的狀態機部分、`hero-body-lock-rules` memory 的鎖規則

---

## 〇、兩個來源，一次改完

**設計師回報**：帶 hash 從子頁進站的人（`/#forum`／`/#blessing`／`/#media`，含子頁「返回」）
**再也看不到影片**。那條路徑走 `bypassLoader()` → `skipOpening()` → `gone`，舞台被
`openingSkipped` 壓著隱藏，而使用者落在段落中間、hero 根本不在畫面上。

**使用者裁決**（逐條確認）：

| # | 決策 | 選擇 |
|---|---|---|
| 1 | 「回到最開始」的落點 | **從 0s 重播整支影片**（restart），不再是 loop 段 |
| 2 | 哪些路徑算「回到最開始」 | 三條全部：`/#loop` 進站、首頁 logo 就地、**回捲到 page top** |
| 3 | loop 段（30–33） | **順播**：正片一路播到 33（loop 段當正片尾巴播一次），`loop` 狀態移除 |
| 4 | 解鎖時機 | **退場段播完（38.5s）才解鎖** |
| 5 | 回捲時的畫面 | 影片進 `gone` 時 seek 回 **frame 0**（原定「回捲看到靜止第一幀」，但第一幀本身有橘塊 → 已於第六節改成回捲全程不露出影片）|
| 6 | start 閘門 | 重播時不再出現（按 logo 本身就是使用者手勢） |
| 7 | 保留字 `#loop` | 先不改名，只改行為 |
| 8 | 退場 scrub 距離（1.6vh） | 先不動，實機看過再說 |

關鍵發現：「回到 page top 就把影片還給使用者」的機制**早就存在** —— `applyDissolve()` 的
`returnedToTop` 跨越判定會清掉 `openingSkipped`（原本是為「按過 SKIP 的人」設的）。
本次只是把「還什麼」從 loop 段換成從 0s 的完整影片，於是子頁進站的人也一併被涵蓋。

---

## 一、狀態機（四狀態 → 三狀態）

```
main   0 → 33s     正片（原 loop 段 30–33 併進來，播一次不循環）   ┐
                   ↓ 影片時間軸自動推進（順播）                      │ 鎖住
outro  36 → 38.5s  退場段（seek 過去；33–36 刻意不播，剪輯要求）    ┘
                   ↓ 播完：暫停在最後一格 ＋ **解鎖** ＋ 下滑提示現身
                   ↓ 使用者捲動 0 → vh(1.6)：按住 ＋ 緩慢放大
gone   p ≥ 1       硬切消失 ＋ **seek 回 0s** ＋ core 交棒 ＋ 引言淡入
                   ↓ 跨回 page top（p < LEAVE ≈ 7px）
main   0 → …       重播（重新上鎖）
```

`loop` 狀態、`DISSOLVE_ENTER`（進遲滯）、`outroForced`（SKIP 那面栓）、`hasLeftLoop`
（「看完過就不再上鎖」）**全部移除**。剩下的旗標各有單一職責：

| 旗標 | 意思 | 設起 | 清掉 |
|---|---|---|---|
| `outroWatched` | 退場段已播到最後一格 ＝ **解鎖 ＋ 自動捲到引言的觸發點** | 影片播到 38.5s；退場鎖保險絲逾時（**不含 `skip()`**，見第八節）| `setState('main')` |
| `outroSpent` | 這一趟已交棒過（到過 `gone`） | `setState('gone')` | 跨回頂端、`restartOpening()` |
| `openingSkipped` | 舞台強制隱藏（SKIP／載入失敗／帶 hash 進站） | 那三條路徑 | 跨回頂端、`restartOpening()` |
| `scrubArmed` | scrub 可不可以開始寫狀態（落點確定後才開） | Hero 的 `armScrub()` | 元件卸載 |

## 二、規則表（改動前 → 改動後）

| # | 觸發 | 落腳狀態 | 影片 | 捲動鎖 |
|---|---|---|---|---|
| 1 | 直接開 `/`（首訪） | `main` | 0s → 33s → 順播 36s | 鎖到 38.5s（原本鎖到 30s） |
| 2 | 子頁 logo → `/#loop` | `loop` → **`main`** | seek 30s → **0s 從頭** | 不鎖 → **鎖** |
| 3 | 子頁 nav／返回 → `/#forum` 等 | `gone`（不變） | 暫停（不變） | 不鎖（不變） |
| 4 | 首頁 logo 就地 | `loop` → **`main`** | seek 30s → **0s 從頭** | 不鎖 → **鎖** |
| 5 | 首頁同頁錨點 | 不變 | 不變 | — |
| 6 | SKIP（正片 **2s** 後） | `outro`（不變） | seek 36s（不變） | **仍鎖**，退場播完才解鎖（見第八節） |
| 7 | 載入失敗／autoplay 封鎖 | `gone`（不變） | 不播 | 不鎖（不變） |
| 8 | hero 捲出視窗（heroIO） | `gone`（不變） | 暫停 ＋ **seek 0** | 不鎖（不變） |
| 9 | **回捲到 page top** | `loop` → **`main`** | seek 30s → **0s 從頭** | 不鎖 → **鎖** |
| 10 | 回捲但沒到頂（LEAVE..1） | `loop` → **維持 `gone`** | seek 30s 重播 → **停在 frame 0、舞台隱藏**（見第六節）| 不鎖（不變） |

第 3 列的人怎麼看到影片：捲回 page top 就走第 9 列。這就是設計師需求的解法。

### 三個容易踩回去的點

1. **restart 必須由「跨回頂端」這個事件觸發，不能用「p < LEAVE」這個位置。**
   正片播完自動進 `outro` 時 p 還是 0 —— 用位置判定會立刻把剛進 outro 的狀態判成
   restart → 重播 → 又進 outro → **無限重播**。`outroForced` 那面栓當初就是為了補這個洞，
   改成事件之後栓連帶不需要了。
2. ~~**SKIP 必須同時設 `outroWatched`。**~~ **已於第八節推翻**（自動捲動上線後不需要）。當時的理由是「又被鎖 2.5 秒，而 SKIP
   自己已經消失（只在 `main` 出現）」—— 逃生口變成第二道牢門。
3. **鎖著的退場段需要保險絲。** 見下節。

## 三、鎖回到退場段：為什麼這次是安全的

2026-08-07 曾裁決「outro 也鎖」，2026-08-16 整條移除。**那次的失敗模式在新流程下不可能
發生**：當時 `loop` 是解鎖的，使用者可以先自由捲一段（實測快速甩動 > 400px）才觸發退場，
鎖於是在**半路**介入、把畫面凍在 scrollY 400 長達 2.5 秒。現在退場是在 scrollY 0、還鎖著的
狀態下由正片自動接進來的，鎖從頭到尾沒有鬆開過，沒有「半路上鎖」這回事。

代價是兩個新的死結風險，各配一根只看牆上時間的保險絲（`HeroVideo`）：

| 保險絲 | 情境 | 逾時 | 動作 |
|---|---|---|---|
| `armStallFuse` | 在 `main` 但影片始終不能播（restart 沒有載入層／閘門把關；`.is-loading` 是 opacity 0 ⇒ 使用者被鎖在一片白，而 SKIP 綁影片時間軸永不出現） | `HERO_VIDEO_READY_TIMEOUT` 8s | `skipOpening()` → `gone` → 解鎖 |
| `armOutroLockFuse` | 鎖著的退場段卡住（緩衝／解碼／被瀏覽器暫停）⇒ 沒有任何東西會把鎖打開 | 退場長度 ＋ `HERO_OUTRO_LOCK_GRACE_MS` 2.5s | `outroWatched = true` → 解鎖 |

第二根正是 2026-08-16 連同 outro 鎖一起刪掉的那類機制（`HERO_OUTRO_STALL_GRACE_MS`）。
刪掉的理由是「outro 不鎖之後，影片卡住只是影片卡住，不會連帶鎖死頁面」—— 退場重新上鎖，
那個理由就失效了。這次只留一根、只看牆上時間，不做進度偵測。

## 四、實測（Chromium、dev server、視窗高 868）

| # | 情境 | 結果 |
|---|---|---|
| 1 | 首訪、按 start、正片播放中 | 鎖著（`innerWidth − clientWidth = 0`）、SKIP 現身、無下滑提示 ✔ |
| 2 | 把 `currentTime` 推到 32s（正片尾） | 立刻 seek 到 36.02 續播、**仍鎖著**、SKIP 開始淡出 ✔ |
| 3 | 退場播到 38.61s | 影片暫停、**解鎖**（捲軸回來）、**下滑提示現身** ✔ |
| 4 | 捲過 vh(1.6) | 舞台 `opacity 0` ＋ `visibility hidden`、**影片 currentTime 歸零**、core opacity 1（交棒完成）✔ |
| 5 | 回捲到 p≈0.5 與 p≈0.12 | 影片**停在 0s**、完全看不到 outro 尾幀 ✔（舞台可見與否見第六節的修訂）|
| 6 | 跨回 page top | 上鎖、影片從 0 播（1.34s → 2.84s）、core 收回 ✔ |
| 7 | 正片中按 SKIP | 0.3s 內：seek 36.25、SKIP 消失 ✔（**當時**會立刻解鎖；第八節起改成仍鎖著、播完才解鎖）|
| 8 | 子頁 `/education` → 返回 `/#media` | 落點 y=19878、未鎖、舞台隱藏、影片停在 0s ✔ |
| 9 | 由 #8 捲回 page top | 上鎖、`video.played` 只有 `[0, 1.5]` ⇒ 確實從 0s 起播 ✔ |

單元測試：`test/hero-dissolve.spec.ts`（三條規則 ＋「停在頂端不算重播」）與
`test/hero-scroll-lock.spec.ts`（四種組合）改寫後通過；全套 623 passed（唯一失敗是既有的
`sound-manifest.spec.ts`，與本次無關）。

**尚未驗**：真實 iOS（橡皮筋回彈途中上鎖的觀感、`--chrome-inset` 變動下的落點）、
兩根保險絲的逾時路徑（要斷網／模擬卡頓才驗得到）、退場 2.5 秒的鎖在行動裝置上的體感。

## 五、已接受的代價

- **開場的強制觀看時間從 30s 變成 35.5s**（正片 33 ＋ 退場 2.5）。逃生口是 SKIP（2s 後），按下之後仍要看完退場那 2.5 秒。
- **回到 page top 會被鎖住看重播**。使用者只是想回頂端用 header nav 時也會遇到。
- **退場 scrub 距離 1.6vh 的原始理由已失效**（那是為了「給退場播放時間」而拉長的，
  而現在退場在解鎖前就播完了）。使用者裁決先不動，實機看過再決定要不要縮回 1.0
  —— 縮回的話 `.sec1__inner` 的 `$sticky-floor` 保底會一併變成不作用（見
  `2026-08-21-hero-two-phase-exit-design.md` 第八節）。
- ~~**保留字 `#loop` 與行為不一致**（名稱是 loop、行為是 restart，而 `loop` 狀態已不存在）。
  三處註解已標明，改名留待下一輪。~~ → **已解決，見第十一節**（不改名，直接拿掉 hash）。

---

## 六、修訂：「兩顆橘塊」（同日回報並修正）

使用者回報退場期間看到**兩顆橘塊同時出現**（iPad Air 820×1180 截圖：一顆約 54px 在畫面
中央、一顆 26px 在下方）。已重現並修正。

### 成因（兩件事疊起來）

1. **層序（既有缺陷，一直沒被看見）**：`.sec1__hero` 是 `position: sticky`，依規範
   **sticky 會建立堆疊脈絡** ⇒ 舞台的 `z-index: 4` 只在該脈絡內部有效，而 `.sec1__hero`
   對外是 `z-index: auto`（＝0），**輸給** `.sec1__orange-core` 的 2 與 `.sec1__scene` 的 3。
   也就是 **DOM core 一直畫在影片之上**。以前撞不到，是因為 core 只在 `gone` 可見，
   而 `gone` 時 `p ≥ 1`、舞台正好隱藏。
   （順帶更正：`HeroVideo.vue` 原註解主張「舞台 z-index 4 蓋住引言、這是整個遮擋機制的
   全部」是**錯的** —— 實測把引言強制 opacity 1 之後，同一點的最上層是 `.sec1__intro-p`。
   真正讓引言在退場期間看不見的是引言自己的 `opacity: 0`。兩處註解已更正。）
2. **本次改動打開了它**：影片進 `gone` 時 seek 回 frame 0，而**frame 0 畫面正中央本來就有
   一顆橘塊** —— 用 canvas 掃像素實測：`t=0` 是 63×64px、佔畫面寬 **6.15%**，是退場尾幀
   （17×16px、1.66%）的 **3.7 倍**。而回捲時 `p < 1` 又讓舞台亮回來 ⇒ 兩顆並存。

另有一條**更早就存在**的同類路徑：`heroIO`（hero 捲出視窗）強制進 `gone` 時 `p` 可能還
小於 1，那時舞台仍可見 → 退場尾幀那顆 ＋ DOM core 並存。

### 修法

`applyDissolve` 的 `revealed` 多一條：**交棒過（`outroSpent`）且不在 `main`，舞台一律隱藏**。

```js
const handedOff = outroSpent.value && heroState.value !== 'main';
const revealed = openingSkipped.value || p >= 1 || handedOff;
```

- 選這個而非「舞台可見時藏 core」：後者會讓使用者在回捲跨過 `p = 1` 的瞬間看到方塊換了
  大小與位置（影片那顆與 DOM 那顆不同尺寸、不同落點）。
- 連帶的行為變化：**回捲全程看不到影片**（原本裁決是「看到靜止的第一幀」—— 而第一幀
  正好是問題來源）。到 page top 重播時影片照樣回來。
- `frame 0 歸零`仍然保留且仍有用：重播那一刻舞台轉為可見，若影片還停在 38.5s，
  第一個畫出來的就是退場尾幀（seek + play 是下一個 tick 才生效）—— 歸零後不會有那一閃。
- ⚠️ **順序**：狀態推導（含清掉 `outroSpent`、`setState('main')`）必須排在 opacity 寫入
  **之前**。反過來的話重播那一幀會被判成「已交棒 → 隱藏」，而狀態改變不會再叫一次
  `applyDissolve` ⇒ 影片重播了卻整層透明，要等下一個捲動事件才亮回來。

### 實測（反覆）

以「舞台可見 ＋ core 不透明」為違規判定，跨 147 個取樣點：

| 輪 | 視窗 | 涵蓋 | 違規 |
|---|---|---|---|
| 3 輪 × 29 點 | 820×1180 | 順播 → 解鎖 → 下捲（含 p=0.999／1.05）→ 每 0.05 一格細步回捲 → 回頂重播 | **0** |
| 60 點 | 1440×900 | SKIP 那條、p=1 邊界快速抖動 30 次、End 鍵式跳走（heroIO）後回捲、回頂重播 | **0** |
| 9 點 | 820×1180 | 子頁 `/#media` 進站 → 一路回捲到頂 → restart | **0** |

原本壞掉的那一點（820×1180、回捲 p=0.85）截圖確認：只剩一顆 26px 的 DOM core。

**未修（已知、留紀錄）**：`.sec1__hero` 沒有 z-index，層序與註解的原意不符。要讓它相符
就得補上（例如 4）—— loader 2000／start 1500／轉場 10 都遠高於它，不會被影響，但那是
繪製順序的改動，應獨立決定。目前所有相關情境都靠 opacity 閘門收斂，沒有可見症狀。

---

## 七、新增：退場播完 → 自動捲到引言的可讀位置

使用者要求：「影片播到 outro，直接滑到 intro 出現的位置」，並附了截圖（iPad Air 820×1180，
三段引言都在畫面內）。

### 落點怎麼定

截圖比對出來的位置是 **引言上緣落在畫面 60% 高**（`scrollY ≈ vh(1.85)`）。與既有的兩個
參考點對照：

| 落點 | 引言上緣 | 畫面 |
|---|---|---|
| 退場終點 `vh($exit)` ＝ 硬切那一刻 | `$intro-at` ＝ **0.85vh** | 只露兩三行（設計核准的那一格構圖）|
| **本功能的落點** | `HERO_INTRO_READ_AT` ＝ **0.6vh** | 三段引言都在畫面內（＝使用者截圖）|

寫成「引言上緣要落在畫面的幾成高」而不是寫死 scrollY，也不用 vh 湊算式：引言上緣的文件
位置**當場量**（`introRef`），那個值就是 hero 的佔位高，而佔位高只存在於 SCSS（`$exit +
$intro-at`）—— JS 側湊算式就會變成第三份雙寫。量測是單一來源，改 `$exit` 不必跟著調。

⚠️ `HERO_INTRO_READ_AT` **必須 ≤ `$intro-at`（0.85）**，否則落點會落在退場終點之前 ⇒
`p` 永遠到不了 1、溶解走不完、影片留在畫面上。`scrollToIntroReading()` 另有一道 clamp。

### 觸發點：綁 `outroWatched`，不綁 `heroState`

`outroWatched` 就是「解鎖」的定義（見 `~/utils/hero-scroll-lock`），於是三條解鎖路徑自動
共用同一個行為：退場自然播完、按下 SKIP、退場卡住時的保險絲。觸發當下 `scrollY` 必為 0
（在此之前頁面一直鎖著），故不必判斷方向、不必防重入。

### 實作

`gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.1, ease: 'power2.inOut' })`
（`HERO_INTRO_AUTO_SCROLL`）。用 ScrollToPlugin 而非 `window.scrollTo({ behavior: 'smooth' })`：
要自訂時長／曲線，更重要的是 **`autoKill`** —— 使用者在動畫途中一捲就中止，不跟他搶捲軸。
`prefers-reduced-motion` 直接瞬跳。tween 在「進 `main`（重播）」與元件卸載時都會 kill
（否則它會與 restart 的 `scrollTo(0, 0)` 搶捲軸、或在換頁後繼續捲新頁面）。

這段自動捲動同時把退場溶解走完：影片的按住縮放、`p ≥ 1` 的硬切、core 交棒、引言淡入全都
照原順序發生，只是驅動它們的是這支 tween 而不是使用者的滾輪。

### 實測

| 情境 | 結果 |
|---|---|
| 首訪 → 正片推到 32s → 順播退場 | 退場播放中仍鎖、`y = 0` ✔ |
| 解鎖那一刻 | 自動捲動起跑（+0.9s 量到 y=271，仍在滑行）✔ |
| +1.7s 落定（868 高視窗） | `y = 1606 = vh(1.85)`、**引言上緣 0.6vh**、引言 opacity 1、舞台隱藏、core 顯示、影片已歸零 ✔ |
| 820×1180 落定 | `y = 2183`、引言上緣 0.6vh，截圖與使用者提供的畫面一致 ✔ |
| 滑行途中使用者往上捲 | tween 當場中止（停在 y=0，沒有繼續飛到 1606）✔ |
| 中斷後回頂端 → restart | 上鎖、影片從 0 播、tween 不殘留 ✔ |
| 自動捲動全程 60 點取樣「兩顆橘塊」 | 0 次違規 ✔ |

**已知取捨**：落點在退場終點之後 0.25vh，故引言的「原地淡入」有 0.25vh 的位移邊淡邊移
（設計文件 2026-08-21 已接受同類取捨：「使用者若在淡入期間繼續捲，引言會邊淡邊移動」）。
要完全原地淡入就把 `HERO_INTRO_READ_AT` 設成 0.85（＝落在硬切那一格），代價是只露兩三行。

---

## 八、修訂：SKIP 與自動捲動的衝突（同日）

自動捲到引言上線後，`skip()` 裡那句 `outroWatched = true` 變成 bug 的來源：它同時是解鎖旗標
**與**自動捲動的觸發點，於是按下 SKIP 會在退場段**剛開始播**的那一刻就把畫面滑走 —— 使用者
按 SKIP 想跳過正片，結果連退場也一起被跳掉。

使用者裁決：**SKIP 只跳到退場段，等影片播到最後一格才觸發自動捲動。**

改動兩行：

1. `skip()` 不再設 `outroWatched`（`useHeroVideo`）。於是 `outroWatched` 回到單一語意 ——
   **影片真的播到 outro.end**（或退場鎖保險絲逾時）。按下 SKIP 之後頁面**照樣鎖著** 2.5 秒。
   當初設它的理由是「按了逃生口不該又被鎖 2.5 秒，而 skip 按鈕此刻已消失」；自動捲動上線後
   那個顧慮消失了 —— 使用者不必自己捲，畫面會自己過去。第二節第 3 點的「三個容易踩回去的
   點」第 2 條因此作廢。
2. `HERO_SKIP_APPEAR_AT` 由 **3 → 2 秒**（使用者裁決；稿上標的是 3 秒）。開場的強制觀看
   時間隨順播延長到 35.5 秒，逃生口該更早出現。

### 實測

| 情境 | 結果 |
|---|---|
| SKIP 現身時的 `currentTime` | **2.13s**（門檻 2s，`timeupdate` 每約 250ms 一次）✔ |
| 按下 SKIP 後 0.3s | `vt = 36.25`（已跳到退場段）、**仍鎖著**、`y = 0` ✔ |
| ＋1.5s（退場播放中） | 仍鎖著、`y = 0` ✔ |
| ＋2.8s（退場播到 38.62） | **解鎖**、自動捲動起跑（`y = 13`）、下滑提示現身 ✔ |
| ＋3.8s | `y = 1606 = vh(1.85)`、引言上緣 0.6vh、影片已歸零 ✔ |

順帶釐清**下滑提示**的用途：正常流程下它只會出現在那 1.1 秒的滑行途中（進 `gone` 就消失），
真正有用的是**滑行被使用者中斷**（autoKill）那一種 —— 畫面停在半路、影片是凍結影像，
沒有提示使用者不知道還要往下捲。註解已改寫成這個說法。

---

## 九、code review 修正（同日）

| # | 發現 | 判定 | 處置 |
|---|---|---|---|
| 1 | `armStallFuse` 永遠不會觸發：`readyTimer`（`markReady`）與它同用 8s、且註冊得早 ⇒ `markReady` 先跑並 `clearStallFuse()`，之後 `elementReady` latch 成 true、絲再也上不了 | **成立，是死結** | 逾時另立 `HERO_MAIN_STALL_FUSE_MS`（15s）；`markReady` 不再清絲；判定條件從 `elementReady` 改成**逾時當下** `readyState < 3`（順帶把「canplay 之後才卡住」也納入守備） |
| 2 | `armOutroLockFuse()` 沒在 `onMounted` 上（`armStallFuse()` 有，但被夾在「影片還不能播」的 else 裡）。`heroState` / `outroWatched` 跨 client-side 導航存活 ⇒ remount 時狀態已是 `outro` 就鎖著且無絲 | **成立** | 兩根絲都移到 `onMounted` 尾端無條件呼叫，各自的 arm 函式自己判斷該不該上 |
| 3 | `handedOff` 讓 `0 < p < 1` 全程隱藏舞台 ⇒ 回捲時有將近一個視窗高的純白 | **事實正確**（實測 868 高視窗：`y ≤ 833`，約 0.96 視窗高全白），但這是「回捲不要看到影片」這個裁決的必然結果 | 留著，記在此處；要改的話見下方選項 |
| 4 | `tickOutro` 的 rAF 已無工作：揭露條件只剩 `openingSkipped \|\| p >= 1 \|\| handedOff`，沒有一項綁影片時間軸 | **成立** | 移除 `tickOutro` / `stopOutroTick` / `outroRaf`；倍速追趕那版的實測紀錄搬到 `HeroVideo.vue` 檔頭 |

### 第 3 點的三個選項（未決）

| 選項 | 回捲時看到 | 代價 |
|---|---|---|
| **現況** | 引言 → core → 約 1 個視窗高的白 → 到頂重播 | 那段白 |
| 舞台照舊在 `p < 1` 現身、改成隱藏 DOM core | 影片第一幀（含它自己那顆較大的橘塊） | 跨過 `p = 1` 時方塊換大小／落點（實測 pad 影片 frame 0 那顆 cover 後約 54px vs DOM core 26px） |
| 把 restart 的觸發從「page top」提前 | 幾乎沒有白 | 回捲一點點就被拉回頂端重播並上鎖，太侵入 |

### 實測（修正後）

| 情境 | 結果 |
|---|---|
| 主流程（正片 → 順播退場 → 解鎖 → 自動捲動） | 退場期間鎖著、`scale(1)` 由 ScrollTrigger 寫入（rAF 移除後照舊）、落點 `y = 1606`、引言上緣 0.6vh ✔ |
| 保險絲**不誤觸**：健康影片在 main 等 16.5s | 仍鎖著、`currentTime` 17.92（＝正常播放中，逾時判定放行）✔ |
| 保險絲**真陽性**：掛載後把 `readyState` 蓋成 1，等 16.5s | 解鎖（捲軸回來）、舞台 `hidden`（走 `skipOpening()` → gone）✔ |
| 單元測試 | 623 passed（唯一失敗是既有的 `sound-manifest.spec.ts`）✔ |

**已知限制**：`armStallFuse` 是**一次性**的（在進 `main` 或掛載時上一根，15s 後判一次）。若影片在
那之後才卡住，就沒有第二次機會 —— 但那時 `currentTime` 早已超過 2s、SKIP 已經現身，使用者
仍有逃生口。真正無法自救的窗口（「連 2 秒都播不到」）由這根絲完整覆蓋。

---

## 十、退場距離 1.6 → 1.2（同日，實機看過）

使用者實機看過覺得 1.6 太久。釐清這個值現在到底管什麼（順播改動後**與影片播放進度無關**）：

1. **文件長度**：從頂端到引言可讀位置 ＝ `vh($exit + 0.25)`（＝落點 `vh($exit + $intro-at − READ_AT)`）
2. **桌機的空捲動**：`$exit` 超過約 `0.85 + 488/vh`（1080 視窗 ≈ **1.30**）才會踩到 `$sticky-floor`，補出來的高度變成轉場滿版後的空捲動 —— 1.6 在 1080 上是約 320px
3. **手動捲動手感**：中斷自動捲動後自己滑的距離，以及 `scale 1 → 1.06` 相對滾輪的變化速率

正常流程使用者**不會自己捲這段** —— 解鎖那一刻由固定 1.1s 的自動捲動滑完。故縮短距離不會縮短
那段滑行的時間（要調那個得改 `HERO_INTRO_AUTO_SCROLL.duration`）。

四個方案（1.6 / 1.2 / 1.0 / 0.8 …）中使用者選 **1.2**。

### 實測（$exit ＝ HERO_DISSOLVE_VH ＝ 1.2）

| 視窗 | 退場終點 | 釋放點 | 餘裕 | 保底補出的空捲動 | 自動捲動落點 |
|---|---|---|---|---|---|
| 1920×1080 | 1296 | 1460 | **+164** | **0** | 1566 ＝ vh(1.45) |
| 1440×900 | 1080 | 1298 | **+218** | **0** | vh(1.45) |
| 768×1024 | 1229 | 1482 | **+253** | **0** | 1485 |
| 375×667 | 801 | 1360 | **+559** | 0 | 968 |
| 1920×1440（高螢幕） | 1728 | 1800 | **+72** | 16px（保底小幅作用）| — |

- 桌機那 320px 空捲動**消失了**（1.2 < 1.30 門檻）；只有 1440 高的螢幕還會補 16px，
  而那正是 `$sticky-floor` 的 `+0.05` 餘裕在做事 —— 保底因此保留，不能拿掉。
- 1440×900 全流程逐點檢查：鎖著期間 `.sec1__hero` 的 `top` 恆為 0（黏得住）、落點
  `y = 1289`（≈ vh(1.43)，取樣落在淡入尾段）、引言上緣 0.62vh、「兩顆橘塊」0 次違規 ✔
- ⚠️ 1920×1080 的 +164 是四個一般尺寸中最薄的一個。它與 2026-08-21 記錄裡「`vh(1.2) + 固定
  200px` 在 1920×1080 上餘裕 −16px」是同一個尺度的兩件事 —— 少了那 200px 就從 −16 變 +164。
  再往上加距離（或改動引言文案長度、行高）都要重量這個數字。

---

## 十一、修訂：回首頁不帶 hash（同日，取代第五節最後一項代價）

第五節記的最後一項代價是「保留字 `#loop` 與行為不一致，改名留待下一輪」。重新檢視後**不改名，
直接拿掉 hash**：子頁 logo 改成導航到 `/`，意圖用一面一次性旗子（`restartIntent`）傳遞。

### 為什麼不是改名

改名（`#loop` → `#top` / `#restart`）只解決「名字對不上」，而 fragment 這個載體本身帶進三個
**行為**缺陷 —— 名字換掉之後它們一個都不會消失：

| # | 缺陷 | 為什麼 |
|---|---|---|
| 1 | 可被 reload／分享的**靜音開場** | 那條路徑 `heroStarted = true`，跳過 start 閘門，而 start 閘門是唯一能開聲的地方（`soundOn` 預設 false，header 在影片期間收起來）。整頁載入若也吃這個 hash，訪客的第一次觀看就是靜音且無法開聲 |
| 2 | 瀏覽器**上一頁**回首頁會再 restart 一次 | pop 導航同樣帶著 hash 進 Hero 的 setup，於是蓋掉 Nuxt 還原的 `savedPosition`，把人拉回頂端鎖著看重播 |
| 3 | `loop` 必須當**保留字** | 任何段落 id 都不能撞，要靠 `test/home-intent.spec.ts` 盯 `common.json` |

旗子活不過整頁載入，三個一起消失。

### 為什麼不能只用「無 hash 的 client-side 導航」推導

上一頁回首頁也符合那個條件（見上表第 2 點），但它該還原 `savedPosition` 而不是重播。旗子只由
logo 的 click handler 設起，對「導航是怎麼發生的」免疫。

### 實作

| 位置 | 改動 |
|---|---|
| `app/utils/home-intent.ts` | 移除 `HERO_RETURN_HASH`；`resolveHomeIntent(false).to` 改成 `/`；新增純函式 `requestHomeRestart()` / `consumeHomeRestart()`（一次性語意，吃 ref-like 載體所以測得到） |
| `app/composables/useHeroVideo.ts` | 新增 `restartIntent`（`useState('hero-restart-intent')`），跨 client-side 導航存活 |
| `app/components/ui/AppHeader.vue` | `onLogoClick` 的 navigate 分支設起旗子。⚠️ NuxtLink 內建 handler 先跑，但它的 `router.push()` 是非同步的 —— 同步碼必然搶在導航的 microtask 之前，不是競態 |
| `app/components/01.hero/Hero.vue` | setup 內 `wantsRestart = import.meta.client && consumeHomeRestart(restartIntent)`；`initialHash === HERO_RETURN_HASH` 的三處判定（`loaderDuration`、`bypassForEntry`、落點分派）改吃它；`hashHandled` → `entryHandled`、`bypassForInitialHash()` → `bypassForEntry()` |

`restartOpening({ skipLoader: false })` 那條路徑本身沒動；`scrollToTopForRestart()` 保留（Nuxt 預設
scrollBehavior 對無 hash 的 push 導航雖然會給 `(0, 0)`，但那是 router 的時序，與
`refreshScrollTriggers()` → `armScrub` 的順序無法保證）。

### 代價

- 舊的 `/#loop` 網址進站會落到 `bypassLoader()` → `gone`（看不到影片）。**不做向下相容**：這個 hash
  只由 header logo 產生，沒有對外散布。
- 多一面「一次性」旗子。沒消耗掉就會變幽靈狀態，故消耗點固定在 Hero 的 setup，並由
  `test/home-intent.spec.ts` 釘住一次性語意（連續消耗第二次為 false）。

### 驗到哪裡

| 項目 | 結果 |
|---|---|
| `test/home-intent.spec.ts`（8 條：目的地不含 hash ＋ 旗子一次性） | passed ✔ |
| 全套單元測試 | 688 passed；2 個既有失敗（`sound-manifest`、`viewport-height` 的 `Subpage.vue` 5vh）在乾淨樹上同樣失敗，與本次無關 |
| dev server SSR 輸出 | `/news` 的 logo 是 `<a href="/">`，整份 HTML 無 `#loop` ✔ |
| **未驗（互動路徑）** | 子頁 logo → 載入層跑完 → 影片從 0s ＋ 上鎖；瀏覽器上一頁不重播且還原 `savedPosition`；reload `/` 走首訪（start 閘門）。Playwright 的 Chrome profile 當時被既有工作階段佔用，未實測 |
