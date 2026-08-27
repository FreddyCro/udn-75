# SymbolIntro 三行：退場改綁捲動、不再自動消失 — 決策紀錄

日期：2026-08-26
狀態：**已實作**
相關檔案：`app/utils/orange-core-config.ts`、`app/components/01a.symbol/SymbolIntro.vue`、
`app/components/01a.symbol/SymbolScene.vue`（時序表註解）、`app/utils/symbol-scramble.ts`（檔頭註解）、
`test/symbol-sequence.spec.ts`
前置文件：`architecture/2026-08-12-symbol-intro-timeline-design.md`（改吃時間軸那次）、
`architecture/symbol-intro.md`（此段的既有規格）

> ⚠️ **本文推翻前置文件的「退場」部分。**
> 那一版把三個動作（依序淡入、全亮停留、依序淡出）全部放上時間軸，`symbolProgress`
> 只當觸發器。本次把**退場**搬回捲動：進場仍吃時間軸，停留變成無限長，
> 退場改成 `exit → out` 這段距離上的 scrub。
> 前置文件的其餘結論**維持有效**：進場吃時間軸的理由（第一節）、三塊職責的分工（第二節）、
> 判斷收在純函式層（第二節的 review 裁定）、reduce-motion 兩態退化（第五節）。

---

## 一、問題：`hold` 是一個賭注

改版前的時間軸是 `2.0s 進場 → hold 3.0s → 1.4s 依序退場`，總長 6.4s。滑到
`SYMBOL_INTRO.in` 就自己跑完，**站著不動 6.4 秒後三行就消失了**。

那個 `hold = 3000` 在賭一件頁面無從得知的事：使用者會在三秒內讀完三行。

- 讀得慢的人：字在眼前淡掉，而且沒有任何辦法叫它回來（往回捲會 reset，再進來是**重播**）。
- 讀完的人：已經想往下走了，還在等那 1.4s 的退場。
- 想回頭再看一次的人：只能退到 `in` 之前再捲進來，重看一次落字動畫。

三行文案是**資訊**。「什麼時候看完」只有讀的人知道，那個決定權不該在時間軸手上。

## 二、方案：兩把尺各管一半

| 段 | 由誰驅動 | 為什麼 |
| --- | --- | --- |
| 進場 | **時間軸**（2.0s，捲到 `in` 觸發） | 逐字亂碼落定的節奏不能交給捲速 —— 這正是 2026-08-12 那次改版的成果，本次不動 |
| 停留 | **無**（無限長） | 停著就一直在。不做任何假設就不會賭錯 |
| 退場 | **捲動**（`exit → out`，逐幀 scrub） | 「要不要收」＝「要不要往下走」，本來就是同一個動作 |

門檻（都用絕對距離定錨，同 `FORUM_HANDOFF.agendaIn`）：

```
 8vh  SYMBOL_INTRO.in    起播（退回這之前 → 重置，再進來從頭播一次，不是倒帶）
80vh  SYMBOL_INTRO.exit  退場起點
104vh SYMBOL_INTRO.out   退場終點（全空）
112vh SYMBOL_STOPS[0]    disperse → face（粒子開始集合成人像）
```

以觀察到的閱讀捲速 16–19vh/s 換算：進場那 2.0s 約走 34vh ⇒ 到 `exit` 還有約 38vh
（≈ 2.2s）的全亮期，而退場的 24vh 約 1.3–1.5s —— 與改版前那段自走退場（1.4s）等長。
**手感沒變，變的只有「什麼時候開始退」由誰決定。**

## 三、順手消滅一個殘留風險

前置文件第三節自承一個**已接受的殘留風險**：清場吃時間（`clearDur = 0.3s`），
而越過 `out` 之後使用者還在往下捲，`out` 到人像集合只有 8vh ——
捲速快過 27vh/s 時文字仍會與人像集合短暫重疊，且「沒有任何門檻安排救得回來」。
當時守著它的是 `ASSUMED_READING_VH_PER_S` 那條換算測試，一條**條件保證**。

退場改吃捲動距離後，這件事回到**構造上**成立：

> `p ≥ out` ⇒ 每行的退場乘數恆為 0 ⇒ 最終 opacity 恆為 0，與捲速無關。

於是整套保底清場一併刪除：`SymbolIntroState.clearElapsed`、`symbolIntroClear()`、
`INTRO_TIMELINE.clearDur`、以及 gate 裡那條「越過 out 就啟動清場」的分支。
`SymbolIntroState` 收成單一欄位 `elapsed`。

`ASSUMED_READING_VH_PER_S` 本身保留 —— 它還有兩個消費端（議程 reveal 的 0.4s、
交棒淡出的 0.35s，都是程式讀不到的 CSS transition），但開場三行不再是其中之一。

## 四、退場曲線：錯開住在距離上

進場的錯開是 `inStagger / inDur = 0.5`（相鄰兩行重疊一半，單位是 ms）。退場沒有秒數可言
——同一段距離，捲得快就退得快——所以錯開改用**比例**表達：

```ts
INTRO_EXIT_STAGGER_RATIO = 0.5   // 單位：一扇退場窗
```

`symbolIntroExitK(p)` 把 `exit → out` 線性映射成 `k ∈ [0, 1]`；
`symbolIntroExitAt(k, i, count)` 把第 `i` 行的窗放在 `[i·ratio, i·ratio + 1]`
（以「一扇窗 ＝ 1」為單位，總長 `span = 1 + (count−1)·ratio`），再把 `k·span` 餵進 smoothstep。
三行代入 ⇒ 三扇窗在 `k` 空間落在 `[0,.5] [.25,.75] [.5,1]`。

兩個刻意的選擇：

1. **外層 `k` 是線性、緩動只在窗裡。** 兩層都 smoothstep 會把中段壓平 ——
   畫面上是三行在區間正中央一起頓一下。這與進場那邊「`t` 是線性的時間、窗才是 smoothstep」
   是同一個分工。
2. **以「窗」為單位換算，而不是先算窗長再相加。** 先算 `1/span` 再逐行累加時，
   `count = 4` 的最後一行窗尾會是 `1.0000000000000002`，`k = 1` 那一刻 opacity 是
   `~1e-16` 而不是 0 —— 畫面上看不出來，但第三節那條**等式**就退化成近似，
   守它的測試也只能改成 `toBeCloseTo`。以窗為單位則精確落在 1。

合成方式（`symbolIntroLineState`）：**opacity 相乘、shift 相加、reveal 只由進場決定**
（退場不跑亂碼）。兩條都是兩端一階導數為 0 的 smoothstep，相乘仍然平滑。
捲很快的人會讓兩條同時發生（進場還沒跑完就越過 `exit`）——這是改版前不存在的情形，
位移互相抵消一部分，正是「還沒站定就被帶走」該有的樣子。

## 五、閘門的三條規則：`out` 之後不是清場，是「跳到終點」

```
p < in    → 重置成未播（下次進來從頭播一次，不是倒帶）
in ≤ p    → 起播（已播過就不重播）
p ≥ out   → 直接跳到進場終點，不起播、不跑 rAF
```

第三條**不是**「清場」——「越過 out 就看不見」已由退場的 scrub 保證了。它管兩件事：

- **可逆。** 從下方往回捲進來時，三行要以全亮狀態被 scrub 帶回來，
  不該重跑一次落字動畫（那段已經演過了）。
- **不空轉。** 若改成在 `p ≥ out` 起播，rAF 會為一個 opacity 恆 0 的東西跑滿 2s，
  而那 2s 正好落在粒子集合成人像那一拍（頁面最重的一刻）。

同一條也順手處理「重新整理落在符號段中段」：`symbolProgress` 初值是 0、
ScrollTrigger refresh 後才寫入真值，跳到終點而不是從 0 起播，畫面上不會無故閃一下文字。

## 六、rAF 只服務進場

`symbolIntroRunning()` 只看進場：`elapsed !== null && elapsed < symbolIntroTotal(count)`。
退場不需要 rAF —— 它逐幀跟著 `symbolProgress`，由 `watch` 重繪；捲動停下來時
本來就不該有任何東西在跑。改版前那條「清場跑完是終態、不論 elapsed 到哪都要停」的例外
（Finding 1 的 bug 修正）隨保底清場一起刪除。

元件端因此換了一個判斷：改版前是「狀態沒變就不重繪」，現在是

```ts
if (changed || inExitRange(p) || inExitRange(prev)) paint();
```

- `inExitRange(p)`：退場區間內每一幀都要重寫（這就是 scrub）。
- `inExitRange(prev)`：從區間內**一步跳出去**時（捲很快、或 anchor 跳轉），
  最後一幀必須落在端點的精確值上，不能停在跳出前那個半退狀態。
- 區間外退場乘數是常數（0 或 1），只有狀態真的變了才重繪 ——
  否則整段 334vh 的每一次捲動都在白重擲亂碼。

## 七、reduce-motion

進場維持兩態（未起播 → 藏、已起播 → 全亮），無 stagger、無亂碼、無位移 ——
它是本頁唯一一段自走播放的動畫，落在 WCAG 2.2.2 的範疇。

退場本身是**捲動驅動**，不受 2.2.2 管，故保留淡出（否則文字會硬生生消失），
但去掉逐行錯開與位移：三行一起淡，`1 − smoothstep(0, 1, k)`。

## 八、測試

`test/symbol-sequence.spec.ts`。守的仍然是**關係**與**行為**，不是常數的值：

| 守什麼 | 怎麼守 |
| --- | --- |
| 不會自己消失 | `symbolIntroLineAt` 在 `t = total × 10`、`600_000` 時仍是全亮 |
| 越過 out 必然全空 | 掃 `p × elapsed × 行 × reduceMotion` 的組合，斷言 `opacity` 恆 `toBe(0)`（等式，不是 `toBeCloseTo`） |
| 退場依序、重疊一半 | 後一行起退時前一行正好半亮（行為，不抄 ratio 的算式） |
| 距離用好用滿 | 不論幾行：第一行從 `k = 0` 起退、最後一行剛好在 `k = 1` 退完 |
| 可逆 | gate：從 `out` 之外往回捲進窗內 → 維持在終點（同一個 reference） |
| 退場沒有狀態 | gate：`exit` 門檻完全不參與狀態轉換 |
| 合成沒有斷點 | 進場未完就越過 `exit` 時，先斷言兩個因子都嚴格落在 `(0, 1)`（否則測試會靜默退化成只驗單邊），再驗連續 |
| 退場不靠 rAF | `symbolIntroRunning({ elapsed: total })` → `false` |

改版前那兩支換算測試（「out 到人像集合的秒數要夠跑完清場」、「clearDur < outDur」）
隨保底清場一起刪除 —— 它們守的是一個不再存在的機制。
