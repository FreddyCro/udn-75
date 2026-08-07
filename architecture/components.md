# UI 元件清單與建置流程

共用 UI 元件（原子與可複用區塊）的長期清單。動到 `app/components/ui/` 或 design token 前先讀這份。

---

## 規則

### 位置與命名

- 新元件放 `app/components/ui/`，扁平不分子資料夾（超過 ~15 支再考慮分）。
- `U` 前綴 + PascalCase：`UButton`、`UTitle`、`UTag`。`U` 代表「共用件」，不代表資料夾位置。
- 註冊：`nuxt.config.ts` 的 `components` 陣列加 `{ path: '~/components/ui', pathPrefix: false }`，放在 `'~/components'` 之前。
- **現存元件全部不搬**。`UPic`、`UVid` 留在 `app/components/` 根目錄；`AiSearch`、`FormulaBlocks`、`GlitchImage`、`AppHeader`、`AppFooter`、`AwardTimeline`、`PhotoPanels`、`ShowcaseGallery`、`PixelRail`、`PixelBranch`、`AiImageQuiz` 是功能區塊，也留原地。

### 不改的範圍

以下已完成並驗收，元件化與 token 替換都不碰。掃描時仍會列出命中位置，但一律標為不改並註明本條：

- `app/components/05.subpage/`（子頁四頁，見 `.claude/memory/` 的各 subpage RWD 紀錄）
- `AiSearch`、`FormulaBlocks`、`AwardTimeline`、`PhotoPanels`、`PixelRail`、`PixelBranch`、`AiImageQuiz`
- `app/components/legacy/`
- dev 工具與 dev 頁：`Dev*.vue`、`app/pages/demo.vue`

### design token 落點

依「誰需要讀它」決定，不是依語意分類。

| 落點 | 放什麼 | 為什麼 |
| --- | --- | --- |
| `app/assets/styles/tailwind.css` 的 `@theme static` | 色票、字級、間距 | 要同時產出 utility class（`text-orange`）與 CSS 變數（`var(--color-orange)`） |
| `app/assets/styles/base.scss` 的 `:root` | z-index 層級、動畫時長、header 高度 | 只在 SCSS/JS 讀取，不需 utility class |
| `app/assets/styles/mixins.scss` | 斷點、mixin 參數 | 編譯期就要用，CSS 變數在 media query 條件裡無效 |

### 每支元件的 SOP

1. **讀 Figma node** — 拿 variables、尺寸、狀態。
2. **定向掃 codebase** — grep 出所有長得像它的區塊。這步在定 API 之前：先看到真實的 3–5 個使用情境，才知道要幾個 variant，不憑設計稿猜。
3. **提 API 草案確認** — 只確認 props / slot / variant 的形狀。樣式細節事後改一支檔案即可；API 改了要動所有呼叫端。
4. **實作**。
5. **替換命中的區塊 + 目測驗證**。

### 清單格式與狀態

三種狀態：`📋 待建`（已談過 API、還沒寫）／`🔨 已建`（元件存在、舊區塊還沒換）／`✅ 已替換`（命中位置都換完，或已註明為何不換）。

替換位置用 checkbox。**未打勾的必須寫一句原因**——否則三週後看到未打勾的項目，分不清是漏了還是刻意跳過。

Figma node ID 只寫在這份文件，元件檔案的註解裡不出現（見 `.claude/memory/comment-style.md`）。

---

## 總覽

| 元件 | 狀態 | 用途 |
| --- | --- | --- |
| design token：字型與顏色 | ✅ 已替換 | 全站字體載入與色票 |

---

## design token：字型與顏色

- **Figma**：`node-id=1587-45470`（規格頁）

### 顏色

Figma 定義五個 variable。與現有 `tailwind.css` 對照：

| Figma variable | 值 | codebase token | 處理 |
| --- | --- | --- | --- |
| `main/orange` | `#FF7F00` | `--color-orange` | 不動 |
| `main/dark gray` | `#686868` | `--color-gray` | 不動（名字不同，值相符） |
| `main/light gray` | `#898989` | `--color-gray-light` | 不動（名字不同，值相符） |
| `main/light blue` | `#9FD6FF` | `--color-blue` | 不動（名字不同，值相符） |
| `light white` | `#FAFAFA` | — | **新增 `--color-white-light`** |

**命名不對齊 Figma 是刻意的**：改名要動 tailwind utility class（`text-gray` → `text-dark-gray`）與所有 `var()` 引用，撐到很多檔案，換不到實際好處。對照表放這裡，跟設計師溝通時查表即可。

`--color-body`（`#404040`，註解標 "B3"）與 `--color-line`（`#d8d8d8`，註解標 "B5"）**不在這份 Figma node 的色票裡**。兩者都在子頁用著，保留；來源疑似另一套 UDN 標準色，待查證。

### 字型

Figma 規格：`Noto Sans TC`，weight 300 / 400 / 500。

**現況問題：字型根本沒載入。** 全 codebase 沒有任何 `fonts.googleapis` / `@font-face` / `useHead` 的 link。`base.scss` 只寫了 `font-family: 'Noto Sans TC', sans-serif`，而 Noto Sans TC 不是 Windows/macOS 預裝字體 → 目前全站中文實際走 `sans-serif` fallback（Windows 落到微軟正黑體、macOS 落到蘋方），不是設計稿字體。

**做法**：裝 `@nuxt/fonts`（目前未安裝，`nuxt.config.ts` 連 `modules` 都還沒有）。

```ts
modules: ['@nuxt/fonts'],
fonts: {
  families: [{ name: 'Noto Sans TC', provider: 'google', weights: [300, 400, 500] }],
},
```

選 `@nuxt/fonts` 而非 Figma 給的 CDN link：它在 build 時把字體檔下載到本地自架，不依賴外部 CDN，且自動產生帶 `unicode-range` 的分段 `@font-face`。

**待驗證的兩個風險**（本專案特有）：

1. **baseURL 前綴**。專案用 `NUXT_URL` 推導 `app.baseURL`，且圖片走 `APP_ASSETS_PATH` 在 runtime 組路徑（見 `UPic`/`UVid`）。`@nuxt/fonts` 產出的字體檔走 Nuxt 的 `/_fonts/`，要確認 baseURL 正確套用、部署到子路徑時不 404。
2. **prerender 產出檔案數**。CJK 字體會被切成上百個 unicode-range subset，三個 weight 相乘。要確認 `nuxt generate` 的產出量與建置時間可接受。

**weight 落差（本波不改，待辦）**：Figma 只給 300/400/500，但實際用量為 `300`×39、`400`×24、`700`×13、`600`×5、`500`×4。載入 300/400/500 後，那 18 處 600/700 會變成瀏覽器合成的假粗體。改 weight 會直接改變現有版面觀感、需逐處對設計稿確認，不搭在 token 這波做。

`base.scss:24` 的註解寫「weight 300 / 400 / **700**」與 Figma 不符，一併修正成 500。

### 替換位置

掃出 42 行硬編碼（扣掉 `tailwind.css` 的 token 定義本身）：A 類 8、B 類 13、C 類 5、D 類 9、dev／legacy 6、指定不改 1。要改的是 **A 類 8 處 + B 類 13 處，共 21 處**。

**A 類：SCSS 區域變數重新宣告了已存在的 token。** 刪掉 8 行 `$` 宣告、14 個使用點改成 `var(--color-*)`。

已確認這四個檔案的 `$gray` / `$orange` / `$blue` / `$light-gray` 全部只用於 `color:` / `background:` / `background-color:` / `stroke:` 直接賦值，**沒有任何一處餵給 Sass 色彩函式**（`rgba()` / `darken()` / `mix()`），所以換 `var()` 不會踩到「CSS 變數不能進 Sass 函式」。

較省的替代做法是保留 `$gray: var(--color-gray)`（只動 8 行而非 22 行），但那留下一層 file-local 別名；直接寫 `var()` 可全站 grep 得到，值得多改這 14 行。

- [x] `app/components/01.hero/Hero.scss:1` — `$gray`（用於 :37）
- [x] `app/components/01.hero/HeroStart.vue:174` — `$gray`（用於 :243、:320）
- [x] `app/components/01.hero/HeroStart.vue:175` — `$orange`（用於 :199、:257、:276）
- [x] `app/components/01.hero/HeroVideo.vue:351` — `$gray`（用於 :411、:472）
- [x] `app/components/01.hero/HeroVideo.vue:352` — `$light-gray`（用於 :484）
- [x] `app/components/AppHeader.vue:213` — `$orange`（用於 :264、:338、:349）
- [x] `app/components/AppHeader.vue:214` — `$blue`（用於 :259）
- [x] `app/components/AppHeader.vue:215` — `$gray`（用於 :327）

**B 類：直接寫在 CSS 屬性裡。**

- [x] `app/components/01.hero/HeroLoader.vue:226` — `background-color: #9fd6ff`
- [x] `app/components/01.hero/HeroLoader.vue:240` — `color: #686868`
- [x] `app/components/01.hero/HeroStart.vue:95` — inline SVG `fill="#ff7f00"`。presentation attribute 不吃 `var()`，需加 class 後用 CSS 規則 `fill: var(--color-orange)`
- [x] `app/components/02.forum/Agenda.vue:46` — `--agenda-line: #898989`
- [x] `app/components/02.forum/Agenda.vue:105` — `color: #fafafa`
- [x] `app/components/02.forum/Agenda.vue:110` — `background: #686868`
- [x] `app/components/02.forum/AgendaReport.vue:60` — `background: #686868`
- [x] `app/components/02.forum/Forum.vue:79` — `--accent: #ff7f00`
- [x] `app/components/02.forum/Forum.vue:82` — `color: #686868`
- [x] `app/components/02.forum/ForumEvent.vue:222` — `color: #898989`
- [x] `app/components/02.forum/ForumEvent.vue:494` — `color: #898989`
- [x] `app/components/02.forum/ForumHighlights.vue:116` — `color: #898989`
- [x] `app/pages/resources.vue:393` — `background-color: #fafafa`

**C 類：JS / props default / WebGL 材質參數 — 不改。** 這兩支都是 client-only canvas / WebGL，技術上可在 mount 時讀 `getComputedStyle` 取 CSS 變數，但為 5 個值引入 composable 與 SSR fallback 分支不划算。改 token 值時需連帶改這裡：

- `app/components/01.hero/HeroLoader.vue:20,22,26` — `blue` / `orange` / `textColor` props default
- `app/components/04.media/HeartMetaball.vue:177-178` — `color` / `accentColor`

> 也曾考慮抽一份 `design-tokens.ts` 常數檔，但 CSS 無法 import TS，hex 真值仍留在 `tailwind.css` 的 `@theme` → 變成兩份真值並存。那是把重複從 5 處收攏到 1 處，不是消除重複，不值得新增一個要維護的檔案。

**不動的其餘位置**：

- `app/components/AiSearch.vue:335` — `background: #fafafa`，落在「不改的範圍」。（附記：該行原註解寫「面板專用底色，非全站 token」，此說法已不成立——同色另有兩處各自硬編碼，Figma 也把它列為 variable。註解留著不動。）
- `app/components/01.hero/DevHeroVideoControls.vue:68-69`、`app/pages/demo.vue:108,237` — dev 工具與 dev 頁
- `app/components/legacy/HeartMetaballBlock.vue:140-141` — legacy
- 純註解提及 token 值的 9 處：`ForumCorePath.vue:317`、`BlessingPartners.vue:5,55`、`MediaTitle.vue:181`、`Subpage.vue:131`、`useMediaIntroMotion.ts:251`、`blessing-face-frames.ts:11,24`、`orange-core-config.ts:57` — 不是程式碼

`05.subpage/` 依規則排除。實際掃描結果是該目錄唯一命中為 `Subpage.vue:131` 的註解，本來就屬不改的 D 類，所以此排除不影響上面任何一項。

### 驗收

- `pnpm dev` 開首頁與 `/resources`，DevTools 確認 `document.fonts` 載入 Noto Sans TC，中文字形不是系統 fallback。
- A/B 兩類改完後，hero 進場、Agenda 時間軸、Forum 段、`/resources` 目測與改前一致。
- `pnpm generate` 成功，檢查產出的字體檔路徑帶正確 baseURL 前綴。

### 完成紀錄（2026-08-07）

實作時發現四件與當初假設不符、值得留下的事實：

**1. `local()` 排在 `url()` 之前，所以裝了字型的機器看不出差異。** `@nuxt/fonts` 產生的 `@font-face` 是 `src: local("Noto Sans TC Light"), url("/_fonts/…")`。開發機裝有 Noto Sans TC，因此頁面對 `/_fonts/` 的網路請求為 **0 筆**，中文一直用本機字型渲染。這是合理預設（省流量），但代表**本機無法驗證「沒裝字型的使用者會下載 woff2」**。已驗證的替代證據：該 `url()` 直接 `fetch()` 回 `200`、`content-length: 60208`。

順帶一個排查陷阱：`document.fonts.check('300 16px "Noto Sans TC"')` 不帶第二個 `text` 參數時，預設只測一個空格（Basic Latin），證明不了 CJK 子集；且它在**完全找不到相符 `@font-face`** 時也回 `true`。要測中文得傳字串，例如 `check('400 16px "Noto Sans TC"', '祝福')`。

**2. 產出目錄是 `.output/public/`，不是 `dist/`。** `_fonts/` 共 213 檔 / 7.6M。

**3. baseURL 前綴以相對路徑形式帶上。** Vite 輸出 `url(../_fonts/xxx.woff2)` 而非絕對路徑；CSS 位於 `<baseURL>/_nuxt/` 下，解析後等價，不會 404。3474 筆 font url() 已全數檢查一致。

**4. `Noto Serif TC` 被連帶下載，且它套用在全站標題。** `@nuxt/fonts` 會掃 CSS 裡所有 `font-family` 自動供應，而相依套件 `@udn-digital-center/common-components` 的 CSS 有一條**全域元素選擇器**：

```css
.graphics-text,.quote-title,.quote,h6,h5,h4,h3,h2,h1{font-family:"Noto Serif TC",source-han-serif-tc,serif}
```

該 CSS 隨 `AppHeader.vue:2` 與 `AppFooter.vue:7` 的 import 每頁注入，專案共 26 個 `<h1>`–`<h6>`，且本專案樣式**沒有任何 heading 的 `font-family` 覆寫**（`base.scss:25` 掛在 `html`，繼承值敵不過元素選擇器的直接宣告）。所以 Serif 子集每頁必然命中，不是「可能用不到」。上述 213 檔 / 7.6M 是兩個家族相加。

**這改變了沒裝字型使用者看到的標題**：改動前落到 generic `serif`（Windows CJK ≈ 新細明體），改動後是真正的 Noto Serif TC。方向是修好而非退步——它讓沒裝字型的人與開發機看到的一致。

⚠️ **未決**：Noto Serif TC 的 `weights` 目前吃 `@nuxt/fonts` 對自動發現家族的預設 `["400 700"]`，不是刻意選的；相依套件哪天改字體堆疊，build 會靜默換一批下載內容。且「襯線標題是否為設計意圖」尚未與設計確認——Figma node `1587-45470` 只寫 Noto Sans TC 300/400/500。見待辦。

### 待辦

- **`font-weight` 600/700 共 18 處**與 Figma 規格（只有 300/400/500）不符，載入後是瀏覽器合成的假粗體。要逐處對設計稿確認、會改變現有版面觀感，故未搭在 token 這波做。
- **`--color-body`（`#404040`）與 `--color-line`（`#d8d8d8`）的來源待查證**——不在 Figma node `1587-45470` 的色票裡，註解標為 "B3" / "B5"，疑似另一套 UDN 標準色。
- **`Noto Serif TC` 兩件未決**（見完成紀錄第 4 點）：① 在 `nuxt.config.ts` 的 `fonts.families` 顯式加一筆並釘住 `weights`，讓「會 ship 什麼」不再由 `@nuxt/fonts` 的預設決定。② 與設計確認襯線標題是否為意圖；若不是，要在 `base.scss` 加 heading 覆寫並排除該家族。
- **`test/design-tokens.spec.ts` 的 `TOKEN_HEX` 是色票表的第二份真值**（`spec.ts:6-14` 手抄 `tailwind.css:6-13`）。這違反本節「`@theme static` 是唯一真值」的目的，且失敗模式是**測試變綠**——下一個人加第八個 token 忘了同步，新 token 完全沒被守住而測試照樣通過。本次新增 `--color-white-light` 就已經必須手動同步兩處。建議改成從 `tailwind.css` 解析 `--color-*: #xxxxxx` 產生，並加 `expect(Object.keys(TOKEN_HEX).length).toBeGreaterThanOrEqual(7)` 防止正則寫壞導致靜默回空表。
- **掃描測試抓不到 8 位帶 alpha 的 hex**：`spec.ts:67` 的 `/(.?)(#[0-9a-fA-F]{6})\b/g` 對 `#ff7f00cc`（主色 80% 透明）第 6 位後接 word char、`\b` 不成立而整條漏掉。改成 `(#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?)\b` 再取前 7 字元查表。
- **`test/design-tokens.spec.ts` 的兩個脆弱點**（都不是現行漏洞，是未來風險）：① `stripComments` 剝除 `//` 時不理解字串上下文，若同一行先出現 `url(https://…)`，其後內容會被一併切掉而漏抓——已量化曝險：`app/` 底下含 `://` 的只有 10 行且全是 `xmlns="http://www.w3.org/2000/svg"`，其中僅 3 行是單行 `<svg>` 開標籤，要漏抓需在那 3 行的 `xmlns` 之後再加 token `fill`。② `walk('app')` 依賴 `process.cwd()` 為專案根目錄；從根目錄跑 `pnpm vitest run` 沒問題，但改由 IDE 測試面板執行會丟 `ENOENT`。一行可修：`walk(fileURLToPath(new URL('../app', import.meta.url)))`，並同步改 `relative()` 的基準。
- **`AiSearch.vue:335`** 的註解「面板專用底色，非全站 token」是主動誤導（同色另有兩處硬編碼、Figma 也列為 variable），而該檔整支被掃描測試 allowlist，永遠不會提醒。改一行註解不動樣式與行為，建議下次順手修掉。
- **`--color-white-light` 為何不叫 `--color-white`**：Tailwind v4 預設 theme 已有 `--color-white: #fff`，`@theme` 是覆寫而非併存，宣告 `--color-white: #fafafa` 會讓全站 `bg-white` / `text-white` 一律變成 `#fafafa`。目前 `text-white` 只有 2 處（都在 dev 元件）故不會爆，但這是地雷——依「`light blue` → `--color-blue`」的規則來「修正命名不一致」就會踩到。此理由應補進 `tailwind.css:13` 的註解。
