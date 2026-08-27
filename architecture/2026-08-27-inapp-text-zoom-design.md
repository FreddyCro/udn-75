# in-app 字級放大：全站把字級除掉 `--tz` — 決策紀錄

日期：2026-08-27
狀態：**已實作**
相關檔案：`build/text-zoom-normalize.ts`、`nuxt.config.ts`（`TZ_PROBE` 與 `vite:extendConfig`）、
`app/assets/styles/base.scss`（`--tz` 總開關、`.tz-off`、`body` 字級）、
`app/components/ui/AppFooter.vue`、`test/text-zoom-normalize.spec.ts`、
`test/footer-author-width.spec.ts`
探針頁（已刪，需要時從歷史撿回）：`app/pages/zoom-probe.vue` @ `a919df4`

> ⚠️ **本文推翻 `c6687af` 裡「footer 改用 em」那次修正。**
> 那次把 `--maxWidth` 從 `120px / 180px` 改成 `8em / 12em`，理由是「`em` 會跟著放大的字一起長」。
> 實機驗證：**無效**，`8em` 在 in-app 仍然是 8 × 15px ＝ 120px，與寫死 px 完全等價。
> 該次的註解對機制的描述也有兩處錯誤（見第二節），已一併更正。

---

## 一、問題：只有 in-app 會壞，而且是「只放大字」

Android WebView（LINE／FB／IG 的 in-app 瀏覽器）把系統「字體大小」設定當 **text zoom** 套用：
**字放大、版面的 px 不動** → 固定寬容器內的文字擠爆、斷行位置跑掉。回報案例是 footer
製作團隊名單：mob 兩個名字實寬 7 個全形字 ＝ 105px，欄寬 120px 只剩一個字的餘裕，
系統字級往上調一格就擠不下，斷成一行一個名字。

同一支手機的 Chrome 不會壞，但**不是因為 Chrome 不跟隨系統字級** ——
Chrome for Android 自 M113 起把系統字級改成走**整頁縮放**（page zoom），字與版面等比放大，
所以版面完好。Chromium 的 PSA 明確說明 page zoom **不涵蓋 WebView**，WebView 仍是舊的
text zoom。這也解釋了「in-app 看起來比 Chrome 大」：Chrome 那邊字級是設計值，in-app 是 ×s。

iOS 的 WKWebView 預設不把 Dynamic Type 套到網頁文字 → **本問題只發生在 Android**。

## 二、為什麼只能用除法（實機把其他路都走死了）

2026-08-27 以 `app/pages/zoom-probe.vue` 在 Pixel 9a ╱ LINE（系統字級調到最大）逐一驗證：

| 候選 | 結果 |
| --- | --- |
| `--maxWidth: 8em`（`c6687af` 的修法） | ❌ 無效。`em` 從 **specified** font size 解析，追不上放大的字 |
| `--maxWidth: 14.4ch` | ❌ 斷行更糟（分隔號「、」自己一行） |
| `-webkit-text-size-adjust: none / 100%` | ❌ 沒用。它只 gate text **autosizer**，不 gate text zoom |
| `--maxWidth: calc(120px * var(--tz))` | ✅ 不跑版，但字仍比 Chrome 大（補了版面、沒補字） |
| `--maxWidth: 1fr` | ✅ 不溢出，但斷行與設計稿不同（一行三名） |
| **`font-size: calc(15px / var(--tz))`** | ✅ **字級與斷行都與 Chrome 一致 ← 採用** |

原始碼層面的原因（Blink）：text zoom 乘在 **computed** font size
（`FontBuilder::GetComputedSizeFromSpecifiedSize` 裡的 `zoom_factor *= frame->TextZoomFactor()`），
而 `em` / `rem` 是從 **specified** font size 解析的
（`CSSToLengthConversionData::FontSizes` 取 `style.SpecifiedFontSize()`）。
**結論：沒有任何 CSS 長度單位追得上放大後的字。** 只能反過來把 specified 字級除掉倍率 s，
讓 WebView 再乘回來。

> `c6687af` 註解裡的兩處錯誤：(1)「`em` 欄寬會跟著放大的字一起長」——不會；
> (2)「Chrome for Android 有自己獨立的文字縮放偏好、預設 100%，故不受影響」——
> Chrome 其實會跟隨系統字級，只是走整頁縮放所以不跑版。

## 三、機制

### 3.1 量測 `--tz-measured`

`nuxt.config.ts` 的 `TZ_PROBE`，以 inline script 掛在 **bodyOpen**：

- 探針是 `font-size: 100px; line-height: 1` 的區塊，**高度 ÷ 100 就是 s**
  （行框高 ＝ 1 × computed font size）。這條路徑不經過字型度量 → 字型還沒載入也準。
- 順手記下 10 個全形字的 `max-content` 寬 ÷ 1000（漢字 advance 恆等於 1em）當交叉檢查，
  兩個讀數寫進 `<html data-tz="行高法/全形字法">` 供 QA 目視。
- `s = clamp(1, s, 2)`，全段包 try/catch；失敗就不寫，CSS 端 fallback 1。
- 結果以 `<style>:root{--tz-measured:s}</style>` 注入（不寫 inline style，避免與 unhead
  管理的 html 屬性打架）。

**為什麼是 bodyOpen 而不是 head**：量測需要 layout，而 `<head>` 階段還沒有 `<body>`，
探針只能塞進 `<html>`（規格未定的位置）。bodyOpen 已經有 body、但仍在 SSR 內容之前 →
一樣早於首次繪製，不會看到字級跳動。SSR 產物實測順序：`body@405455 < script@405973 < #__nuxt@406148`。

### 3.2 改寫（`build/text-zoom-normalize.ts`，掛在 PostCSS）

1. `font-size: <絕對長度 / var() / calc() / clamp() / min()>` → `calc((<原值>) / var(--tz, 1))`
   相對字級（`em` / `rem` / `%` / `ex` / `ch`…）與關鍵字不動 —— 繼承鏈上的父層已經除過，
   再除一次會變 s²。
2. **任何屬性**的 `<n>em` 長度 → `calc(<n>em * var(--tz, 1))`
   specified 字級被除小之後 `em` 長度會等比縮小，要乘回來才維持設計值。
   現況集中在 `letter-spacing`（17 處）、`width` / `max-width`（7 處）等。
3. 跳過：自訂屬性宣告（可能不是長度，如 `--maxWidth: 1fr`；補償要落在消費它的那條）、
   `@font-face`、`url()`、`content` / `font-family` 等非長度屬性、`0em`、已帶 `var(--tz` 的值。

掛 PostCSS 的理由：dev 與 build 都生效；一次涵蓋 SCSS 產出、Tailwind v4 產出與
`@nuxt/fonts` 注入；之後新寫的 `font-size: 20px` 自動納入。
用 `vite:extendConfig` **附加**而非直接寫 `vite.css.postcss`，後者會整份覆蓋掉 Nuxt
預設放進來的 plugins（autoprefixer）。

### 3.3 CSS 契約（`base.scss`）

```scss
:root { --tz: var(--tz-measured, 1); }  // ← 總開關
.tz-off { --tz: 1; }                    // ← 逃生門：這棵子樹維持放大字
body { font-size: 16px; }               // ← 見下
```

`body` 那條明寫的預設字級，值與瀏覽器預設相同（現行渲染完全不變），唯一目的是讓補償
能觸及「整條祖先鏈都沒宣告 `font-size`」的文字 —— PostCSS 只能改寫存在的宣告，
沒有宣告就補償不到，那些文字會變成 in-app 唯一還被放大的一群（實測抓到
`.subpage-anchor__text`、`.subpage-anchor-bar__text`）。
**必須下在 `body` 不可下在 `html`**：`rem` 讀 root 的 specified 字級，改寫 html 會讓
全站 73 處 `rem` 一起縮小 13%（`rem` 沒有補償）；下在 body 則 root 不動、涵蓋範圍不變。

## 四、取捨：這等於抹掉「使用者調大系統字級」的意圖

把字級歸位，換來的是版面與設計稿一致，代價是**不再跟隨使用者的系統字級偏好**
（a11y 上的 resize text 期待）。本站是固定版位的編輯專題，一致性優先，故接受。

需要局部保留放大能力時加 `.tz-off`。若哪天要整站改回「跟隨使用者、但不跑版」，
第二節表格裡的 `1fr` 是唯一能同時滿足兩者的方向（代價是斷行不照稿）。

## 五、驗證

| 要驗的事 | 怎麼驗的 |
| --- | --- |
| 實機真的修好 | Pixel 9a ╱ LINE，系統字級最大：探針頁 A（補償生效）vs B（`.tz-off`）同頁對照，A 與同機 Chrome 一致 |
| 改寫涵蓋率 | 產物 16 支 CSS 有 13 支帶 `var(--tz)`；Tailwind 的 `@layer base/utilities/components` 也在內 |
| `--tz = 1` 完全等價 | `.author-grid` 仍 `15px`、grid 仍 `105px 120px`，與改寫前逐字相同（`calc((15px)/1)` ＝ `15px`） |
| 字級精確除以 s | 桌機設 `--tz-measured: 1.15`，首頁 419 個元素字級精確 ÷1.15 |
| 版面不動 | 同上情境，`padding-top` / `margin-top` **0 筆**變動 |
| em 補償正確 | 83 筆 em 的 `letter-spacing` 維持設計值（`3.6px` 不變） |
| 沒有漏網文字 | `/news` 145 個可見文字元素 0 漏、`/subpage` 603 個 0 漏；root font-size 仍 `16px` |
| 量測兩法一致 | `data-tz` 兩個讀數相同（桌機 `1.000/1.000`，實機 s > 1 亦同） |
| minify 不壓壞 | 產物含 `calc((clamp(13px,1.2vw,16px))/var(--tz, 1))`、`calc((min(…))/var(--tz, 1))`、`calc(.15em*var(--tz, 1))` |
| script 早於首次繪製 | 建置產物 SSR HTML 中 script 位置在 `<body>` 開頭、早於 `#__nuxt` |
| 改寫規則的邊界 | `test/text-zoom-normalize.spec.ts` 14 個測試（相對字級不動、idempotent、`0em`、自訂屬性、`@font-face`…） |

⚠️ **桌機模擬的假警報**：設 `--tz-measured` 後，文字驅動的 intrinsic width
（`max-content`、shrink-to-fit）會縮小 —— 那是模擬的產物，真機上字被乘回設計值、寬度自然回來。
另見 `.claude/memory/inapp-text-zoom-verification.md`：**不可**用「把 `font-size` 乘大」來模擬
in-app，那會讓 `em` 方案假性通過（就是 `c6687af` 誤判修好的原因）。

## 六、回退

改 `base.scss` 一行即可，**不需要 revert plugin、不需要改任何元件**：

```scss
:root { --tz: 1; }   // 原本是 var(--tz-measured, 1)
```

改寫過的 `calc` 在 `--tz: 1` 下與原值等價 → 全站立刻回到「字被放大」的現行行為。
`TZ_PROBE` 可以留著（只是量了不用），要一起拿掉就刪 `app.head.script` 那條。

要改成**逐區塊**套用而非全站：把上面那行寫成 `--tz: 1`，另開
`.tz-fix { --tz: var(--tz-measured, 1) }`，在需要的區塊加 class。
機制完全相同，開關只是選擇器換位置。
