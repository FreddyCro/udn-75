# SymbolIntro 三行依序上浮 + 亂碼落定 — 決策紀錄

日期：2026-08-12（同日壓縮，原 209 行的設計稿見
`git show e0840bd:architecture/2026-08-12-symbol-intro-stagger-design.md`）
狀態：**部分已被推翻** —— 第一節（掛 scrub 不掛時間軸）已由
`architecture/2026-08-12-symbol-intro-timeline-design.md` 取代；
第二節（共用亂碼純函式）與第四節的「逐幀直接寫 DOM」仍有效。
相關檔案：`app/components/01a.symbol/SymbolIntro.vue`、`SymbolFace.vue`、
`app/utils/orange-core-config.ts`、`app/utils/symbol-scramble.ts`、
`test/symbol-sequence.spec.ts`、`test/symbol-scramble.spec.ts`
前置文件：`architecture/symbol-intro.md`（此段的既有規格）

符號段第一拍（`disperse`）疊著的開場三行文案，原本是**整組同時**淡入淡出的一塊。
本次改成：三行**依序向上淡入**，且每行的字以 `SymbolFace` 宮格彩蛋那種**亂碼跑動落定**的方式出現。

常數（`INTRO_LINE_SPAN_RATIO` / `INTRO_LINE_SHIFT` / `INTRO_REVEAL_SPAN`）與兩支曲線函式
都在 `orange-core-config.ts`，公式與註解已寫在那裡。以下只留決策。

---

## 一、為什麼全部掛在 scrub 上，而不是時間軸

> ⚠️ **本節結論已於同日被推翻**，理由見
> `architecture/2026-08-12-symbol-intro-timeline-design.md` 第一節：
> scrub 把「讀完三行」的責任推給使用者的捲動速度，而三行文案是資訊、不只是質感。
> 以下保留原文以記錄當時的權衡。

這一段從粒子（`uDisperse` / `uConverge`）、底色（`syncBg`）到文案 opacity，全部由
`symbolProgress` 驅動、往回捲自動倒退。若文字改吃時間軸，會出現「捲回去了、文字還在自己跑完」
的不一致 —— 使用者往回捲時看到的不是倒帶而是另一段演出。

代價是：捲很快時亂碼只會一閃（可接受，它是質感不是資訊），以及**停在窗內時亂碼會定格**
（不可接受，半亂碼的定格看起來像壞掉）。後者以一支條件式 rAF 解決，見第四節。

⚠️ `SymbolFace` 的宮格彩蛋維持它原本的時間軸 —— 它是**滑鼠換格**觸發的，本來就跟捲動無關。
兩邊共用的只有「亂碼長什麼樣」（`symbol-scramble.ts`），不是「什麼時候跑」。
**不要順手把 `SymbolFace` 也改成 scrub。**

## 二、共用亂碼純函式

`scrambleText(target, reveal)`：`reveal` 0..1 → 由左到右逐字落定，其餘位置每次呼叫重擲隨機字。

**空白與 `\n` 不參與亂碼**：文案的斷行是設計稿定死的，讓 `\n` 被換成一般字元會讓整塊在跑亂碼
那段先塌成一行再彈回去。

`SymbolFace.runScramble()` 保留它自己的時間軸 rAF（`performance.now()` / `SCRAMBLE_MS = 480`），
只把組字串的迴圈換成呼叫這支；檔內的 `GLITCH_CHARS` 常數刪除，改 import `SCRAMBLE_CHARS`
（字元集內容不變）。

## 三、曲線

> ⚠️ 本節描述的是**吃 progress** 的舊曲線。`full` / `fadeOut` 兩個門檻已刪除，
> `symbolIntroOpacity` 的兩個後繼（`symbolIntroOutOpacity` / `symbolIntroLine`）也已被
> `symbolIntroLineAt()` / `symbolIntroClear()` 取代。仍然有效的是「窗由行數推導、
> 不寫死」這條原則（現在推導的是 ms 而不是 progress）與 `reveal` 用線性的理由。

### `SYMBOL_INTRO.full` 0.08 → 0.14

三行改依序進場後，24vh 切成三段重疊的窗每行只剩約 10vh，快捲的人讀不出先後順序。
多要的 24vh 從**全亮停留期**扣（48vh → 24vh），`out < SYMBOL_STOPS[0].until` 這條硬關係不變，
其後所有門檻（人像集合、converge、交棒）完全不動。

換算成捲動距離（`SYMBOL_VH = 4.0` ⇒ 400vh）：
8vh 第一行起 → 56vh 第三行落定 → 80vh 淡出起 → 104vh 淡完。

### 每行的窗由行數推導，不寫死

```
stagger = (full - in) / (count - 1 + INTRO_LINE_SPAN_RATIO)     // = 2
line i  : [in + i·stagger, in + (i + INTRO_LINE_SPAN_RATIO)·stagger]
```

`INTRO_LINE_SPAN_RATIO = 2` ＝「每行窗寬是 stagger 的兩倍」＝ 相鄰兩行重疊一半。
分母那一項保證 **i = count−1 的結尾正好落在 `full`**，故行數若從三行變四行，
窗會自動變窄而不是溢出 `full` 去撞淡出段。三行代入：每行 24vh、彼此錯開 12vh。

### 一支拆成兩支

原本一支「整組 opacity」不夠用了：**退場仍是整組的，進場卻是逐行的**。故
`symbolIntroOpacity()` 刪除，改為：

- `symbolIntroOutOpacity(p)` —— 整組退場（進場依序、退場整片）
- `symbolIntroLine(p, index, count)` → `{ opacity, shift, reveal }`
  - `opacity`：窗內 `smoothstep`，窗前 0、窗後 1
  - `shift`：`INTRO_LINE_SHIFT(24px) × (1 - opacity)`，即由 24px 下方升到定位（約半行高）
  - `reveal`：窗內**線性**（不是 smoothstep —— 落字要等速），且在窗的
    `INTRO_REVEAL_SPAN = 0.8` 處就跑完 → 最後一小段是「已可讀的整行」升到定位，
    而不是升定的同一刻才落最後一個字

## 四、元件

**逐幀值一律直接寫 DOM，不觸發 Vue re-render**（沿用本檔既有作風）：根層寫 `style.opacity`，
每行寫 `style.opacity` / `style.transform` / `textContent`。
`textContent` 直接寫的另一個好處：文字不再是 Vue 的 render 產物，每幀重擲亂碼不會產生 vdom diff。

### 亂碼的 rAF 閘門

`watch(symbolProgress)` 只在捲動時觸發，停在窗內時亂碼會定格。故加一支 rAF：

- **啟動**：任一行的 `reveal` 落在 `(0, 1)` 開區間內
- **停止**：不再有任何一行處於該狀態（全部未進場、或全部已落定）
- 迴圈內**只**重擲亂碼字；opacity / transform 仍由 `apply(p)` 負責 —— 兩者都是冪等的純函式輸出，
  重複寫入無副作用
- `onBeforeUnmount` 取消

切分頁時瀏覽器自己會節流 rAF；捲出視窗則 progress 必然離開該窗、迴圈自動停下，
**不需要另接 IntersectionObserver**。

不動的部分：`aria-hidden="true"`（亂碼不該被朗讀）、`pointer-events: none`、`z-index: 2`、
SCSS 的字級斷點。`.symbol-intro__line` 新增 `will-change: transform, opacity`。

## 五、不做的事（YAGNI）

亂碼速率獨立旋鈕（`INTRO_REVEAL_SPAN` 就是它的旋鈕）。

> ⚠️ 原本列在這裡的另兩項已作廢：**逐行淡出**已於 2026-08-12 的時間軸改版實作；
> **`prefers-reduced-motion` 分支**同次補上 —— 原本的理由是「本頁通篇是捲動動畫，
> 單獨為這三行處理沒有意義」，改吃時間軸後這三行變成本頁唯一的自走動畫，那個理由失效。
