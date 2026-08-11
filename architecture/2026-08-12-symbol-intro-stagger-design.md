# SymbolIntro 三行依序上浮 + 亂碼落定 — 設計稿

日期：2026-08-12
狀態：**待實作**
相關檔案：`app/components/01a.symbol/SymbolIntro.vue`、`app/components/01a.symbol/SymbolFace.vue`、
`app/utils/orange-core-config.ts`、`app/utils/symbol-scramble.ts`（新）、
`test/symbol-sequence.spec.ts`、`test/symbol-scramble.spec.ts`（新）
前置文件：`architecture/symbol-intro.md`（此段的既有規格）

符號段第一拍（`disperse`）疊著的開場三行文案，目前是**整組同時**淡入淡出的一塊。
本次要讓它變成：三行**依序向上淡入**，且每行的字以 `SymbolFace` 宮格彩蛋那種
**亂碼跑動落定**的方式出現。

---

## 一、為什麼全部掛在 scrub 上，而不是時間軸

這一段從粒子（`uDisperse` / `uConverge`）、底色（`syncBg`）到文案 opacity，全部由
`symbolProgress` 驅動、往回捲自動倒退。若文字改吃時間軸，會出現「捲回去了、文字還在自己跑完」
的不一致 —— 使用者往回捲時看到的不是倒帶而是另一段演出。

代價是：捲很快時亂碼只會一閃（可接受，它是質感不是資訊），以及**停在窗內時亂碼會定格**
（不可接受，半亂碼的定格看起來像壞掉）。後者以一支條件式 rAF 解決，見 §四。

`SymbolFace` 的宮格彩蛋維持它原本的時間軸 —— 它是**滑鼠換格**觸發的，本來就跟捲動無關。
兩邊共用的只有「亂碼長什麼樣」，不是「什麼時候跑」。

---

## 二、共用亂碼純函式

新檔 `app/utils/symbol-scramble.ts`：

```ts
export const SCRAMBLE_CHARS = 'AMFOBI7501<>/\\[]{}#%&@十人工智慧能力未來';

/** reveal 0..1 → 由左到右逐字落定，其餘位置每次呼叫重擲隨機字。
 *  空白與 \n 不參與亂碼：文案的斷行是設計稿定死的，讓 \n 被換成一般字元
 *  會讓整塊在跑亂碼那段先塌成一行再彈回去。 */
export function scrambleText(target: string, reveal: number): string;
```

實作即現行 `SymbolFace.vue` `runScramble()` 內那段組字串的邏輯原封搬出：

```ts
const settled = Math.floor(clamp01(reveal) * target.length);
let s = '';
for (let i = 0; i < target.length; i++) {
  const ch = target[i]!;
  s += i < settled || ch === ' ' || ch === '\n'
    ? ch
    : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}
```

### 對 `SymbolFace.vue` 的改動

`runScramble()` **保留它自己的時間軸 rAF**（`performance.now()` / `SCRAMBLE_MS = 480`），
只把迴圈換成 `displayText.value = scrambleText(target, p)`；
檔內的 `GLITCH_CHARS` 常數與那個 for 迴圈刪除，改 import。

> ⚠️ 不要順手把 `SymbolFace` 也改成 scrub —— 它的觸發源是 `activeEgg`（游標所在宮格），
> 與 `symbolProgress` 無關。

---

## 三、曲線（`app/utils/orange-core-config.ts`）

### 門檻調整

```ts
export const SYMBOL_INTRO = {
  in: 0.02,
  full: 0.14,   // 0.08 → 0.14
  fadeOut: 0.2,
  out: 0.26,
} as const;
```

`full` 往後推 0.06（24vh）換取三行的先後順序讀得出來。
代價是**全亮停留期 48vh → 24vh**。`out < SYMBOL_STOPS[0].until (0.28)` 這條硬關係不變，
其後所有門檻（人像集合、converge、交棒）完全不動。

換算成捲動距離（`SYMBOL_VH = 4.0` ⇒ 400vh）：
8vh 第一行起 → 56vh 第三行落定 → 80vh 淡出起 → 104vh 淡完。

### 每行的窗由行數推導，不寫死

```
stagger = (full - in) / (count - 1 + LINE_SPAN_RATIO)     // LINE_SPAN_RATIO = 2
line i  : [in + i·stagger, in + (i + LINE_SPAN_RATIO)·stagger]
```

`LINE_SPAN_RATIO = 2` ＝「每行窗寬是 stagger 的兩倍」＝ 相鄰兩行重疊一半。
分母那項保證 **i = count−1 的結尾正好落在 `full`**，故行數若從三行變四行，
窗會自動變窄而不是溢出 `full` 去撞淡出段。

三行代入：

| 行 | 窗（progress） | 換算 vh |
|---|---|---|
| 0 | 0.02 – 0.08 | 8 – 32 |
| 1 | 0.05 – 0.11 | 20 – 44 |
| 2 | 0.08 – 0.14 | 32 – 56 |

每行 24vh、彼此錯開 12vh。

### 取代 `symbolIntroOpacity()` 的兩支純函式

原本一支「整組 opacity」不夠用了：退場仍是整組的，進場卻是逐行的。拆成兩支：

```ts
/** 整組退場（Q3：進場依序、退場整片）。1 = 在場，0 = 已淡完。 */
export function symbolIntroOutOpacity(p: number): number {
  return 1 - smoothstep(SYMBOL_INTRO.fadeOut, SYMBOL_INTRO.out, p);
}

/** 第 index 行（共 count 行）在 symbolProgress = p 時的進場狀態。 */
export function symbolIntroLine(
  p: number, index: number, count: number,
): { opacity: number; shift: number; reveal: number };
```

- `opacity`：窗內 `smoothstep`，窗前 0、窗後 1
- `shift`：`INTRO_LINE_SHIFT * (1 - opacity)` px，即由 **24px 下方**升到定位
- `reveal`：窗內**線性**（不是 smoothstep —— 落字要等速），且在窗的
  `INTRO_REVEAL_SPAN = 0.8` 處就跑完 → 最後一小段是「已可讀的整行」升到定位，
  而不是升定的同一刻才落最後一個字

`symbolIntroOpacity()` 刪除（唯一呼叫點是 `SymbolIntro.vue`）。

新增常數：`INTRO_LINE_SHIFT = 24`（px；對 44/48px 行高約半行）、
`LINE_SPAN_RATIO = 2`、`INTRO_REVEAL_SPAN = 0.8`。

---

## 四、元件（`app/components/01a.symbol/SymbolIntro.vue`）

### 寫入方式

沿用本檔既有作風：**逐幀值一律直接寫 DOM，不觸發 Vue re-render**。

- 根層：`el.style.opacity = symbolIntroOutOpacity(p)`
- 每行（`lineRefs` 由 `v-for` 的 ref 收集）：`style.opacity`、
  `style.transform = translateY(shift px)`、`textContent = scrambleText(line, reveal)`

`textContent` 直接寫的另一個好處：文字不再是 Vue 的 render 產物，
每幀重擲亂碼不會產生 vdom diff。

### 亂碼的 rAF 閘門

`watch(symbolProgress)` 只在捲動時觸發；停在窗內時亂碼會定格。故加一支 rAF：

- **啟動條件**：任一行的 `reveal` 落在 `(0, 1)` 開區間內（＝ progress 在 8vh–56vh 這段）
- **停止條件**：不再有任何一行處於該狀態（全部未進場、或全部已落定）
- 迴圈內只重擲亂碼字（`textContent`），opacity / transform 仍由 `apply(p)` 負責 —— 兩者
  都是冪等的純函式輸出，重複寫入無副作用
- `onBeforeUnmount` 取消

切分頁時瀏覽器自己會節流 rAF；捲出視窗則 progress 必然離開該窗、迴圈自動停下，
不需要另接 IntersectionObserver。

### 不動的部分

`aria-hidden="true"`（亂碼不該被朗讀）、`pointer-events: none`（見檔內註解：
會把畫面正中央變成互動死區）、`z-index: 2`、SCSS 的字級斷點 —— 全部原樣保留。
`.symbol-intro__line` 新增 `will-change: transform, opacity`。

---

## 五、測試

### 新增 `test/symbol-scramble.spec.ts`

- `scrambleText(t, 1) === t`
- 長度恆等於 target（含 `reveal = 0` / 超界輸入）
- `reveal = 0` 時：空白與 `\n` 位置原樣保留，其餘位置皆落在 `SCRAMBLE_CHARS` 內
- 落定字數隨 reveal 單調遞增（比較 prefix 相符長度）
- 超界輸入（−1 / 2）不回傳 NaN、不改變長度

### 改寫 `test/symbol-sequence.spec.ts`

**保留不動**：`SYMBOL_STOPS` 遞增、converge 終點 = `coreIn`、
`in < full < fadeOut < out < disperseUntil`、議程 32vh、`agendaIn < coreOut`。

**`symbolIntroOpacity` 那組改寫成**：

- `symbolIntroOutOpacity`：`fadeOut` 前恆 1、`out` 後恆 0、之間單調遞減、超界不 NaN
- `symbolIntroLine`：
  - 三行的窗嚴格依序（`line0.opacity ≥ line1.opacity ≥ line2.opacity`，且在 0.05–0.11
    之間至少有一點是嚴格大於）
  - `p ≤ in` 時三行 opacity 皆 0、`reveal` 皆 0
  - `p ≥ full` 時三行 opacity 皆 1、`reveal` 皆 1（**第三行在 `full` 收齊**是關鍵）
  - `shift` 與 `opacity` 反向：`opacity = 1` ⇒ `shift = 0`
  - 換 `count`（如 4）時，最後一行的結尾仍恰在 `full`

---

## 六、副作用與風險

| 項目 | 影響 |
|---|---|
| `SYMBOL_INTRO.full` 0.08 → 0.14 | 全亮停留期 48vh → 24vh。其後門檻皆不動 |
| `symbolIntroOpacity()` 刪除 | 唯一呼叫點是 `SymbolIntro.vue`，一併改 |
| `SymbolFace.GLITCH_CHARS` 刪除 | 改 import `SCRAMBLE_CHARS`，字元集內容不變 |
| 每幀寫 3 個 `textContent` | 只在 48vh 的窗內發生，且不經 vdom |

不做的事（YAGNI）：`prefers-reduced-motion` 分支（本頁通篇是捲動動畫，單獨為這三行處理
沒有意義）、亂碼速率獨立旋鈕、逐行淡出。
