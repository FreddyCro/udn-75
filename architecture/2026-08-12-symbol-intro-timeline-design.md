# SymbolIntro 三行改吃時間軸 — 決策紀錄

日期：2026-08-12
狀態：**已實作**
相關檔案：`app/components/01a.symbol/SymbolIntro.vue`、`app/components/01a.symbol/SymbolScene.vue`、
`app/utils/orange-core-config.ts`、`test/symbol-sequence.spec.ts`
前置文件：`architecture/symbol-intro.md`（此段的既有規格）、
`architecture/2026-08-12-symbol-intro-stagger-design.md`（依序上浮 ＋ 亂碼落定的實作）

> ⚠️ **本文推翻前置文件第一節「為什麼全部掛在 scrub 上，而不是時間軸」。**
> 那一節的結論（三行必須跟著捲動逐幀倒帶）自本次起不再成立，理由見第一節。
> 前置文件的第二節（共用亂碼純函式）、第四節（逐幀直接寫 DOM）維持有效。

符號段第一拍（`disperse`）疊著的開場三行文案，原本三個動作（依序淡入、全亮停留、整組淡出）
全部由 `symbolProgress` 逐幀驅動。本次改成：**`symbolProgress` 只當觸發器，動畫本身走時間軸**，
且退場也改成依序。滑到位置就自己跑完，停在原地不動也看得完整段。

---

## 一、為什麼改吃時間軸（推翻前一版的結論）

前一版的理由是一致性：這一段從粒子（`uDisperse` / `uConverge`）、底色（`syncBg`）到文案
opacity 全是 scrub，文字若吃時間軸會出現「捲回去了、文字還在自己跑完」。

那個理由換來的代價比預期大：**scrub 把「讀完三行」的責任推給使用者的捲動行為**。
停下來的人看到的是定格的半成品（亂碼定格已經用一支條件式 rAF 補救過，但位移與 opacity
仍然是定格的）；捲得快的人整段一閃而過。三行文案是**資訊**、不只是質感，
它需要一段與捲動速度無關的播放時間。

新的一致性由「重置 ＋ 重播」提供：往回捲不是倒帶，而是**回到未播狀態**，再進來從頭播一次。
這仍然是可預期的（不會有殘留文字掛在黑畫面上），只是可預期的東西從「幀」變成「狀態」。

## 二、三塊職責

| 塊 | 職責 | 讀什麼 |
| --- | --- | --- |
| 閘門 | arm / reset / 強制清場 —— 只在門檻翻轉時動一次 | `symbolProgress`（`watch`，非逐幀） |
| 時間軸 | 純函式：ms → 每行的 `{ opacity, shift, reveal }`（`symbolIntroLineAt` / `symbolIntroLineState`），以及「還要不要繼續推進 rAF」的判斷（`symbolIntroRunning`） | rAF 累加的 elapsed、`reduceMotion` |
| 寫入 | 直接寫 `el.style` / `textContent`（沿用前一版作風） | 時間軸輸出 |

`symbolProgress` 從「逐幀驅動源」降級成「觸發器」，這是本次改動的核心。

> ⚠️ **元件內不留任何動畫語意的判斷**：`symbolIntroLineState`（含 reduce-motion 的兩態退化，
> 見第五節）與 `symbolIntroRunning`（rAF 該不該繼續，見第六節）都收進純函式層，
> `SymbolIntro.vue` 只負責持有狀態、推進 rAF、寫 DOM。這條是 review 逼出來的：計畫原稿把
> 這兩支判斷寫在元件裡，與 Global Constraint「判斷全在純函式」互相矛盾，使用者裁定
> Constraint 優先。值得記錄理由 —— `symbolIntroRunning` 原本留在元件裡時，是全案唯一
> 沒有單元測試的動畫邏輯，也正是唯一寫錯的那一支（見第六節的 bug）。

### 閘門的三條規則

- `p ≥ SYMBOL_INTRO.in`（8vh）且尚未起播 → 起播，開 rAF
- `p < SYMBOL_INTRO.in` → 整組回進場前狀態、清掉 elapsed（下次再進來從頭播）
- `p ≥ SYMBOL_INTRO.out`（104vh）→ 強制清場：整組 `clearDur` 快速淡出後結束

**強制清場沒有例外**（2026-08-13）。原稿為它開了一個：若時間軸已進入退場段
（`elapsed ≥ allIn + hold`）就讓它自己跑完，理由是「已經在淡的東西再疊一層更快的淡出，
看起來是斷掉而不是收尾」。**那個理由不成立，例外已移除**：清場乘數是乘在逐行 opacity 之上，
兩條都是兩端一階導數為 0 的遞減 smoothstep，相乘仍然單調遞減、兩端仍然平滑 ——
沒有任何硬轉折可言。它唯一的效果是**比 1.4s 早收**，而早收正是 `out` 存在的目的。
代價則很具體：那個例外讓最壞情況多留 `outDur + (count−1)·outStagger` ＝ 1.4s 的尾巴，
而 `out` 到人像集合只有 8vh（見下）—— 於是 **16–19vh/s 這段最常見的閱讀捲速反而是唯一
會撞上人像集合的一段**。移除後最壞情況是 `clearDur` ＝ 0.3s。
（教訓也值得記一筆：那句理由與實作出自同一個過程，沒有被獨立檢查過。
兩條 smoothstep 相乘的形狀是可以直接算的，算了就會發現它站不住腳。）

**從未起播就越過 `out`**（重新整理落在符號段中段：`symbolProgress` 初值 0，
ScrollTrigger refresh 後才寫入真值）→ 直接設成已清場的終態，**不跑那 0.3s 淡出**，
否則畫面上會無故閃一下文字。

### 代價一：捲太快會被截斷

觸發點（8vh）到硬門檻（104vh）之間有 96vh 的捲動距離，要完整看完 6.4s 等於捲速需慢於
約 15vh/s。停下來讀的人完全沒問題 —— 這正是不綁 scroll 的用意；一路不停往下捲的人會被截斷，
但那種人在 scrub 版本也只是一閃而過，不算退步。

**硬門檻不能拿掉**：`out < SYMBOL_STOPS[0].until` 這條關係（文字要在粒子開始集合成人像
之前淡乾淨，兩件事同時發生會互相搶焦點）在時間軸下失去自動保證，只能靠這道閘門補回。

**但要誠實說清楚它補到什麼程度**：改版前文字在 `out`（0.26）**構造上**已經淡完，
`out < until` 是嚴格保證；改吃時間軸後清場自己要花 `clearDur`，而 `out` 到人像集合的
margin 只有 `(0.28 − 0.26) × 400vh` ＝ **8vh**。以 8vh→104vh 的平均捲速分段（移除例外之後）：

| 捲速 | 越過 `out` 那一刻的狀態 | 結果 |
| --- | --- | --- |
| ≤ 15vh/s | `elapsed = TOTAL`，早已退場完畢 | ✓ |
| 15–27vh/s | 清場啟動，8vh 走完 ≥ 0.3s | ✓ 淡乾淨才開始集合 |
| **> 27vh/s** | 清場啟動，但 8vh 走完已不到 0.3s | **✗ 短暫重疊** |

> 27vh/s（1080 高螢幕約 290px/s）那一段**沒有任何門檻安排救得回來** —— margin 是
`until − out` 的距離，而 `out` 已經只離 `in` 96vh（再往前縮就連停著讀的人都看不完整段）。
唯一的解法是縮短 `clearDur`，而那會讓清場本身看起來像硬切。**接受這個殘留風險**：
那個速度的人是在滑過去、不是在讀，而且重疊只有幾十毫秒。

守這件事的測試因此改成**換算關係**而不是大小比較（`out < until` 在清場改吃時間之後
已不蘊含該性質，留著它當保證等於給假信心）：
`(until − out) × SYMBOL_VH × 100 / ASSUMED_READING_VH_PER_S ≥ clearDur`。
`ASSUMED_READING_VH_PER_S = 25` 是**假設不是量測**（見該常數的註解），
作用是讓「我們為哪種捲速負責」變成一個顯式、可被測試守住的數字。

### 代價二：清場之後往回捲回窗內不會回來

重置只發生在 `p < in`（8vh）＝ 回到 hero pin 區。所以從 104vh 往回捲到 90vh（仍在窗內）
時，三行**不會重新出現**：狀態還是「已清場」，而閘門對窗內的已播狀態一律不動
（規則見上，`test/symbol-sequence.spec.ts` 的「清場後往前捲回窗內不會重播」守著）。
這是刻意的 —— 窗內任何位置都能重播的話，在門檻附近來回微調捲動會讓文字反覆閃現。
記在這裡是因為**刻意行為若沒寫下來，下一個人看到的就是 bug**。

## 三、時間軸的數學

常數與純函式都放 `orange-core-config.ts`（同前一版的分工：曲線在 config、寫入在元件）。

```
INTRO_TIMELINE = {
  inDur: 1000, inStagger: 500,      // 每行進場 1.0s、錯開 0.5s ＝ 相鄰兩行重疊一半
  hold: 3000,                       // 三行全亮停留（讀完三行）
  outDur: 700, outStagger: 350,     // 每行退場 0.7s、錯開 0.35s（同樣重疊一半）
  clearDur: 300,                    // 強制清場的快速淡出
}

inStart(i)  = i · inStagger                            // 0, 500, 1000
allIn       = (count−1) · inStagger + inDur            // 2000
outStart(i) = allIn + hold + i · outStagger            // 5000, 5350, 5700
total       = outStart(count−1) + outDur               // 6400
```

`inStagger / inDur = 0.5` 承接前一版 `INTRO_LINE_SPAN_RATIO = 2` 的語意（重疊一半），
故該常數刪除。行數變動時 `allIn` / `total` 由公式推導，不寫死。

### 單行在 elapsed = t 時的狀態

| 區間 | opacity | shift | reveal |
| --- | --- | --- | --- |
| `t < inStart(i)` | 0 | `+24` | 0 |
| 進場窗 | `smoothstep` | `+24 × (1 − opacity)` | 線性，在窗的 `INTRO_REVEAL_SPAN` 處收完 |
| 停留 | 1 | 0 | 1 |
| 退場窗 | `1 − k`，`k = smoothstep(outStart(i), outStart(i)+outDur, t)` | `−24 × k` | 1 |
| `t ≥ outEnd(i)` | 0 | `−24` | 1 |

**`shift` 的語意改了。** 前一版的 `INTRO_LINE_SHIFT × (1 − opacity)` 只描述得出進場
（永遠是正值、往上收斂到 0）。新函式**直接回傳最終位移、符號自己帶**：進場為正（由下方
24px 升到定位）、退場為負（繼續往上離場 24px）。三行像一列字持續往上飄走，與進場同方向 ——
讀起來是同一個手勢的延續，也讓「第一行最早出現、最早離開」的閱讀節奏一致。

**退場不跑亂碼**（`reveal` 恆 1）。逆向散字會拉長退場、也讓「清場給人像集合」變慢。

### 強制清場的乘數

`symbolIntroClear(tc)` ＝ `1 − smoothstep(0, clearDur, tc)`，`tc` 是**自清場觸發那一刻**起算的 ms
（與時間軸的 elapsed 是兩把獨立的尺）。它寫在**根層**的 `style.opacity`，
乘在逐行的 opacity 之上 —— 正好沿用前一版根層已有的那個欄位（前一版根層裝的是整組退場，
現在整組退場改成逐行的，根層空下來給清場用）。未觸發清場時根層恆為 1。

`INTRO_LINE_SHIFT = 24` / `INTRO_REVEAL_SPAN = 0.8` 兩個常數與其理由沿用前一版，不動。
`reveal` 維持**線性**（落字要等速，smoothstep 會看起來像掉幀）。

### elapsed 用 rAF delta 累加，不用 `now − startedAt`

切分頁時瀏覽器停掉 rAF。若 elapsed 由 `performance.now() − startedAt` 算，切回來會發現
整段已經「播完」了 —— 文案是資訊，不能就這樣被跳過。故改成累加每幀 delta，
並把**單幀 delta clamp 到 100ms**：rAF 停掉期間 elapsed 自然凍結，切回來從原處續播。

## 四、`SYMBOL_INTRO` 收成兩個門檻

`full` / `fadeOut` 的意義（三行收齊、淡出起點）改由時間軸的 `allIn` / `outStart(0)` 表達，
progress 軌上不再有對應的點 → 兩個常數刪除。留下：

- `in` ＝ 觸發點
- `out` ＝ 硬門檻（強制清場）

`out < SYMBOL_STOPS[0].until` 這條硬關係**保留**，但守著它的測試已改成
「margin 換算成假設閱讀捲速下的秒數 ≥ `clearDur`」（見第二節末），
因為單純的大小比較在清場改吃時間之後不再蘊含「文字先淡乾淨」。

## 五、reduce-motion：這次要做

前一版把 `prefers-reduced-motion` 列為 YAGNI，理由是「本頁通篇是捲動動畫，單獨為這三行處理
沒有意義」。**那個理由隨本次改動失效**：改成時間軸之後，這是本頁唯一一段自走播放的動畫，
正好落在 WCAG 2.2.2 的範疇（捲動動畫由使用者的手控制，自走動畫不是）。

`useOrangeCoreProgress()` 已有 `reduceMotion`。兩態退化住在純函式 `symbolIntroLineState()`，
不是元件：未起播（`elapsed === null`）→ 藏（`opacity: 0`），已起播 → 直接全亮
（`opacity: 1`、`shift: 0`、`reveal: 1`，無 stagger、無亂碼、無位移）；非 reduce-motion 時
委派 `symbolIntroLineAt()`。`symbolIntroRunning()` 對 reduce-motion 恆回傳 `false`
（兩態切換沒有補間要跑，不開 rAF）。越過 `out` 的淡出不是這支函式的事 ——
根層的 `symbolIntroClear()` 乘數（第三節）套在 `paint()` 裡，不分 reduce-motion 都會套用，
所以強制清場對兩態切換的使用者一樣有效。

## 六、rAF 閘門簡化

前一版那支條件式 rAF（「任一行 `reveal` 落在開區間 (0,1) 才自轉亂碼」）**整支刪掉** ——
它存在的唯一目的是補救 scrub 停在窗內時的亂碼定格，時間軸下不會停格。
每幀寫完整三件事（`style.opacity` / `style.transform` / `textContent`），
停止條件交給純函式 `symbolIntroRunning()`，結束後停下、`onBeforeUnmount` 取消。

停止條件不是單純的「`elapsed < total` → 續跑」，正確語意是：**清場一旦跑完就是終態**
（`clearElapsed !== null` 時只看 `clearElapsed < clearDur`，不管 `elapsed` 到哪；直到 gate
把狀態重置回 `SYMBOL_INTRO_IDLE` 才會離開這個終態）。

> ⚠️ 這是本次改動修掉的一個 bug，值得記一筆為什麼重要：原本的判準只看 `elapsed < TOTAL`。
> 快速往下捲越過 `out` 觸發保底清場時，`elapsed` 完全不受影響、繼續累加 —— 於是整組早已
> 被清場乘數壓到看不見，rAF 卻還要為它空轉到 `elapsed` 追上 `TOTAL` 為止，最多近 5 秒
> （約 290 幀，每幀三次 `scrambleText` 字串配置與 `textContent` 覆寫）。而那段時間正是
> 粒子集合成人像那一拍、頁面最重的一刻 —— 保底清場存在的目的就是替它讓路，
> 讓路本身卻在背景繼續燒 CPU 是自我矛盾。

## 七、變更清單

| 檔案 | 動作 |
| --- | --- |
| `app/utils/orange-core-config.ts` | 新增 `INTRO_TIMELINE`、`symbolIntroLineAt(t, i, count)`、`symbolIntroClear(t)`、`symbolIntroLineState(s, i, count, reduceMotion)`、`symbolIntroRunning(s, reduceMotion, count)`（後兩支是 review 後為滿足 Global Constraint 補的，見第二節）；刪 `symbolIntroLine()` / `symbolIntroOutOpacity()` / `INTRO_LINE_SPAN_RATIO`；`SYMBOL_INTRO` 收成 `{ in, out }` |
| `app/components/01a.symbol/SymbolIntro.vue` | 改寫 `<script setup>`（閘門 ＋ rAF 時間軸 ＋ reduce-motion 分支）、檔頭註解重寫。template / SCSS 不動 |
| `test/symbol-sequence.spec.ts` | `symbolIntroOutOpacity` / `symbolIntroLine` 兩個 describe 改寫成吃 ms；門檻關係那支去掉 `full` / `fadeOut` 的斷言、保留 `out < SYMBOL_STOPS[0].until` |
| `app/components/01a.symbol/SymbolScene.vue` | 檔頭時序表「文案 8vh 第一行起／56vh…」那一列改寫 —— 現在只有起點與硬門檻是 vh，中間是秒 |
| `architecture/2026-08-12-symbol-intro-stagger-design.md` | 第一節加註「已被本文推翻」的指標；第三節曲線、第五節 YAGNI 清單同步 |
| `architecture/symbol-intro.md` | 第 8–11 行的改版註記與第三節門檻語意更新 |

**不動**：`aria-hidden="true"`、`pointer-events: none`、`z-index: 2`、字級斷點、
`symbol-scramble.ts`、`SymbolFace` 的宮格彩蛋時間軸、`SYMBOL_STOPS` / `FORUM_HANDOFF` /
`SYMBOL_VH` 等其後所有門檻。

## 八、不做的事（YAGNI）

- **亂碼速率獨立旋鈕**：`INTRO_REVEAL_SPAN` 已經是它的旋鈕。
- **退場逆向散字**：見第三節。
- **每個斷點不同節奏**：6.4s 三個斷點共用。文案長度相同，沒有理由分歧。
- **`visibilitychange` 監聽**：rAF delta 累加已經涵蓋切分頁（見第三節末），不需要另接事件。
