# 符號段開場文字 ＋ 序列節奏

2026-08-09 定案。範圍：`01a.symbol`（開場文案、序列門檻）／`01.hero`（轉場層 slot，文字實際渲染處）／
`02.forum`（門檻交接）。

對應 Figma「智慧論壇05」三個斷點：

| 斷點 | frame | 內文 text node |
| --- | --- | --- |
| pc 1280 | `2065:139729` | `2065:139731` |
| pad 768 | `2065:124197` | `2065:124199` |
| mob 414 | `2065:120218` | `2065:120221` |

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/utils/orange-core-config.ts` | `SYMBOL_INTRO`、`symbolIntroOpacity()`、`SYMBOL_STOPS`、`SYMBOL_VH`、`FORUM_HANDOFF`、`SEQUENCE` |
| `app/components/01a.symbol/SymbolIntro.vue` | 開場文案元件（渲染於 `01.hero` 的轉場層 slot） |
| `app/components/01a.symbol/SymbolScene.vue` | 符號段捲動尺；檔內的「symbolProgress 時序表」是本檔第三節數字的來源 |
| `app/locales/section1.json` | `symbol.intro`（三行文案） |
| `test/symbol-sequence.spec.ts` | 守著門檻之間的關係與 `symbolIntroOpacity()` 的曲線 |

---

## 一、要解決什麼

1. 設計稿「智慧論壇05」的三行內文從未實作（`architecture/PRD.md` 早已列出「智慧論壇05」一列，
   但一直只有黑底符號雨，沒有文字）。
2. `converge`（匯聚成點）那一拍的捲動停留太短。
3. `handoff`（白點 → 橘核心交棒）吃掉的捲動距離過多，應讓給 converge。

不在本次範圍：`hover`（懸停期 50vh）維持不動；交棒 crossfade 的 0.4s CSS transition 維持不動。

---

## 二、開場文字

### 2.1 文案

```
人工智慧的預測五花八門
它既可怕又美好
準備好借力使力與AI共存
```

存放位置：`app/locales/section1.json` 的 `symbol.intro`（字串陣列，三筆），與既有的
`symbol.phrases`（彩蛋句）同一區 —— 兩者都由 `01.hero/Hero.vue` 消費，因為符號段的視覺實體
住在 hero 的轉場層 slot 內。

### 2.2 為什麼是新元件、又為什麼掛在 hero 底下

`<SymbolFace>` 並不住在 `01a.symbol/` 底下 —— 它是 `01.hero/Hero.vue` 傳進
`<HeroSymbolTransition>` slot 的內容（理由見 `HeroSymbolTransition.vue` 檔頭：轉場的
「左右展開範圍內已可見粒子」要求粒子場在 hero 還被 pin 住時就滿版在場）。文字要疊在粒子場上、
且與它同生共死，所以必須進同一個 slot。

新元件 `app/components/01a.symbol/SymbolIntro.vue`：

- **檔案放 `01a.symbol/`**（它是符號段的內容），**渲染位置在 hero 的 slot**（那是唯一在場的地方）。
  這個「目錄歸屬 ≠ 渲染位置」的分裂已是本段的既定架構，`SymbolScene.vue` 檔頭有同樣的說明。
- 不透過 props 接進度：自己讀 `useOrangeCoreProgress()` 的 `symbolProgress`（同 `SymbolScene` 的做法）。
- `watch(symbolProgress)` → 直接寫 `el.style.opacity`，不走 Vue re-render（同
  `HeroSymbolTransition.vue` 的 `apply()`；那條 watch 每幀都會觸發）。
- `aria-hidden="true"`：整段符號序列都是裝飾層，與 `SymbolFace` / `HeroSymbolTransition` 一致。

### 2.3 版面與樣式

- **`pointer-events: none` 是必要條件，不是保險。** `SymbolFace` 的滑鼠斥力監聽掛在 canvas 上，
  而 `HeroSymbolTransition` 特意為那顆 canvas 打開了 `pointer-events: auto`（見該檔 SCSS 末段）。
  文字層若吃事件，畫面正中央那塊會變成互動死區。
- `z-index: 2`：`SymbolFace` 的 `.egg`（彩蛋文字）也是 2，但兩者不同時出現（彩蛋只在 `face`
  拍、開場文字只在 `disperse` 拍），不會互相遮蓋。

字體規格（三個斷點都已對稿）：

| 斷點 | Figma text style | size / line-height / letter-spacing |
| --- | --- | --- |
| mob 414 | `mob/mob_論壇文字` | 22 / 44 / 0.1em |
| pad 768 | `pc/pc_論壇文字` | 24 / 48 / 0.1em |
| pc 1280 | `pc/pc_論壇文字` | 24 / 48 / 0.1em |

**pad 與 pc 共用同一個 text style ⇒ 只有兩階，不是三階。** 三份稿共通：Noto Sans TC / weight 300 /
`#FAFAFA` / 置中。

| 屬性 | 專案 token |
| --- | --- |
| font-family | `base.scss` 已全域設定 Noto Sans TC，不需重寫 |
| font-weight | 直接寫 `300` |
| font-size / line-height（pad＋pc） | `var(--text-unit)` / `var(--text-unit--line-height)`（24/48） |
| font-size / line-height（mob） | 直接寫 `22px` / `44px`（無對應 token，且全庫只此一處用到） |
| letter-spacing | 直接寫 `0.1em`（全斷點相同） |
| color | `var(--color-white-light)`（＝ `#FAFAFA`） |

**不新增 token**：`--text-unit`（24/48、tracking 0.1em）與 `--color-white-light` 已存在且吻合
（weight 稿是 300，token 註解寫 400，但 weight 不在 token 定義內，不衝突）。mob 的 22/44 只有本
元件用得到，為它開一組 token 不划算。RWD 依 CLAUDE.md 的 SCSS 規則寫在 `.symbol-intro__line`
內部、用 `rwd-min('tablet')` 包住，不按斷點拆檔。

### 2.4 進出場時機

門檻常數 `SYMBOL_INTRO`（`app/utils/orange-core-config.ts`）：

```ts
export const SYMBOL_INTRO = {
  in: 0.02,      // 淡入起
  full: 0.08,    // 全亮
  fadeOut: 0.2,  // 淡出起
  out: 0.26,     // 淡完（早於 disperse→face 的 0.28）
} as const;
```

opacity 由 `symbolProgress` 換算成 0..1，公式與曲線特性（`p < in` 與 `p > out` 皆為 0、
`full`–`fadeOut` 之間恆為 1、頭尾用 smoothstep 不硬轉折）見純函式 `symbolIntroOpacity()`
（同檔），關係由 `test/symbol-sequence.spec.ts` 守著 —— 不在本文重複數學式，改門檻時看那支測試
就知道有沒有踩到不變量。

換算成捲動距離（`SYMBOL_VH = 4.0` ⇒ 400vh）：

| 事件 | progress | 距符號段起點 |
| --- | --- | --- |
| 淡入起 | 0.02 | 8vh |
| 全亮 | 0.08 | 32vh |
| 淡出起 | 0.20 | 80vh |
| 淡完 | 0.26 | 104vh |
| 進 face（`SYMBOL_STOPS[0].until`） | 0.28 | 112vh |

⚠️ **`out`（0.26）必須早於 `SYMBOL_STOPS[0].until`（0.28）**——文字要在粒子開始集合成人像之前
淡乾淨，兩件事同時發生會互相搶焦點，這條關係由上述測試檔守著。

轉場層的 `.hero-symbol-transition__stage` 在「左右展開段」就把 opacity 拉到 1，文字跟著滿版一起
在場，符合分鏡 ⑥「展開到滿版 → 智慧論壇05 的三行文案浮現」（`architecture/PRD.md` 的轉場分鏡表）。
文字自己的淡入從 `symbolProgress` 0.02 起算，與展開完成相差 8vh，肉眼是同一刻，但驅動來源只有一個。

---

## 三、序列節奏

`SYMBOL_VH` 3.2 → **4.0**；`FORUM_HANDOFF.coreIn` 0.75 → **0.84**；`agendaIn` 0.9 → **0.92**。

| 拍 | 舊（320vh） | 新（400vh） | 差 |
| --- | --- | --- | --- |
| disperse（含開場文字） | 0–0.15 ＝ 48vh | 0–0.28 ＝ **112vh** | +64 |
| face | 0.15–0.58 ＝ 137.6vh | 0.28–0.62 ＝ 136vh | −1.6 |
| converge | 0.58–0.75 ＝ 54.4vh | 0.62–0.84 ＝ **88vh** | **+33.6（+62%）** |
| handoff | 0.75–1.0 ＝ 80vh | 0.84–1.0 ＝ **64vh** | **−16（−20%）** |
| hover（無軌） | 50vh | 50vh | 不動 |

- **face 只差 1.6vh**，等於沒動 —— 它本來就是「最長的一拍」，不該被這次改動波及。
- **converge 縮放無風險**：那一拍的動畫是 `SymbolFace` 內部 2.2s 的 GSAP 補間
  （`disperseDuration`），段落長度只決定「停留多久」、不決定動畫速度。延長 88vh 是純粹的停留，
  不影響粒子匯聚的視覺節奏。
- **`agendaIn` 用絕對距離定錨、不是等比縮放**：它的作用是「讓 0.4s 的議程淡入發生在畫面外」，
  判準是「符號段底緣距視窗底部還有多遠」。0.92 × 400vh ＝ 368vh，距段尾 32vh —— 與
  `SYMBOL_VH = 3.2` 時代的 0.9（288vh，距 320vh 段尾同樣 32vh）等距。若照舊等比例留 0.9，
  換算成 400vh 會變成 40vh（更安全但沒必要）；照比例縮反而是錯的，因為判準是絕對距離，不是比例。
  `test/symbol-sequence.spec.ts` 守著「距段尾至少 32vh」這條關係，不是守 0.92 這個數字本身。
- `coreOut` 維持 `1.0`，`ForumCore` 的 0.4s crossfade 維持不動。

前一軌 `TRANSITION_VH = 1.2`（120vh）不變 ⇒ hero 轉場 ＋ 符號段合計 440vh → **520vh**。

---

## 四、hover 的換色接口（本次不實作）

未來要在 hover 階段做「符號段黑底 → 論壇段白底」的換色（取代現在的硬接縫）。現在做不到的原因很
具體：**hover 是 `SEQUENCE` 裡 `drive: 'none'` 的無軌區間**，沒有任何 progress 可以綁。

這次不實作，但留三樣東西：

1. **不動 `ForumCore` 的雙層結構。** 黑底（`.forum-core__bg`，fixed 滿版 z-index 20）與橘點
   （`.forum-core__dot`）已經是分離的兩層、吃兩個條件。那層黑底就是未來換色的落點。本次不簡化
   它、不把 `coreOut` 的門檻內聯進元件。
2. **`SEQUENCE` 的 `hover` part 保留 `vh: 0.5` 的長度宣告。** 未來建軌時，那個 0.5 是尺長的
   單一來源。
3. **建軌方法寫在註解裡**：以 `.sec2__path` 為 trigger、`start: 'top bottom'` / `end: 'top center'`
   的 scrub，寫入新的 `hoverProgress`。那兩個端點正好框住這 50vh，且與 `ForumCorePath` 的
   `start: 'top center'` 首尾相接、不重疊。

  ⚠️ 這條建軌方法**實際的落點是 `orange-core-config.ts` 的 `SEQUENCE`，`hover` 那一列 part 定義
  上方的註解**（不是掛在 `FORUM_HANDOFF` 常數上）—— 因為建軌動的是 `SEQUENCE` 裡 `hover` part
  的 `drive`，跟著要改的東西放在一起比較容易同步不漏。

另記一筆供未來參考：hover 那 50vh 的「空白感」有一半來自 `.sec2__path` 的 `padding-top: 140px`
—— 接縫進場後還要再捲 140px 才有第一行內容。那是設計稿的留白，本次不動。

---

## 五、與 spec 的偏離：不新增 `SEQUENCE` 的 `intro` part

規劃階段的草稿曾提議在 `SEQUENCE` 的 `forum` 章節新增一個 `intro` part，與 `disperse`
**重疊**（`from: SYMBOL_INTRO.in, until: SYMBOL_INTRO.out`，放在 `disperse` 之前），理由是
「`SEQUENCE` 的用途是講得出地址，不要求 part 互斥」。

**這個提議在 planning 階段被推翻，理由如下，記錄下來以免有人再提一次：**

`useCoreSequence.ts` 把目前所在的 part 解析成「**第一個尚未完成的 part**」（見該檔步驟 ③ 的
註解：「游標＝第一個尚未完成的 part。成立的前提是各軌首尾相接、嚴格照捲動順序排列」）——
這個演算法**假設 part 互斥且首尾相接**，一次只有一個 part 是 `live`。

若真的插入一個與 `disperse` 重疊的 `intro`（`from: 0.02, until: 0.26`），會發生：

- `intro` 與 `disperse` 都是 `drive: 'scrub', track: 'symbol'`，各自依自己的 `until` 判定
  是否 `complete`。`intro` 要到 `symbolProgress = 0.26` 才算完成；`disperse` 要到 `0.28`
  才算完成。
- 游標邏輯是「從頭找第一個未完成的」，`intro` 排在 `disperse` 前面 → 在 `symbolProgress`
  0–0.26 這整段捲動距離裡，`?pathdebug` dashboard 回報的當前 part 永遠是 `intro`，`disperse`
  即使實際上粒子已經在分散，也只能停在 `idle`，直到 `intro` 完成才輪到它顯示為 `live`
  （屆時只剩 0.26–0.28 這 8vh 可看）。
- 換句話說：把「疊在上面的一層」硬塞進一個假設互斥的線性游標系統，結果不是「兩者同時可見」，
  而是「一個吃掉另一個的顯示時段」——這正是 `useCoreSequence` 的資料結構不支援的用法。

**改採的方案**：不新增 part，直接把既有 `disperse` part 的 `label` 改成
`粒子分散（前段疊開場三行文案）`，把「文字疊在分散拍上」這件事寫進說明文字裡，而不是寫進資料
結構的另一個維度。地址系統本身沒有變動，`intro` 這段時間仍然可以透過 `SYMBOL_INTRO` 的門檻精確
描述，只是不需要、也不應該再開一個地址。

**若未來真的需要「兩個同時進行的敘事層各自有地址」**，`useCoreSequence` 的游標演算法要先改成支援
多游標（例如每個 `track` 各自維護一個游標），不能只是在 `SEQUENCE` 裡疊區間 —— 這是比本次範圍
大得多的改動，暫不處理。
