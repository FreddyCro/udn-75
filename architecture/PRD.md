# 產品需求文件 PRD — 聯合七五・智慧未來

> UDN 75 — Shaping An Intelligent Future
> 聯合報 75 週年數位專題網站

## 概述

單一頁面、垂直滾動式的敘事型專題網站。全站僅一個正式頁面（首頁），內容依滾動順序分為四個 section，搭配常駐 Header / Footer。切分原則：**Page → Section → Component**，功能以表格條列；跨 section 的共用功能另立一張表。

- 正式頁面：`/`（[index.vue](app/pages/index.vue)）
- 版面容器：[layouts/default.vue](app/layouts/default.vue)（Header + 內容 + Footer）
- 開發測試頁（非正式產品，不納入本 PRD）：`/demo`、`/data`、`/digital`、`/news`、`/visual`

---

## Page：首頁 `/`

由四個 section 依序組成，對應 Header 三個錨點（`forum` / `blessing` / `media`）。

### Section 1 — Hero／開場（[Section1.vue](app/components/Section1.vue)）

| 元件 / 區塊 | 功能 | 說明 |
| --- | --- | --- |
| hero（`#app-hero`） | 開場主視覺 | 兼作 Header 顯示時機的觀察目標：`id="app-hero"` 供 [AppHeader.vue](app/components/AppHeader.vue) 以 IntersectionObserver 監看，**hero 完全捲離視窗（在畫面中完全消失）後 Header 才滑入**；只要 hero 還有任一部分在畫面內，Header 保持隱藏。修改 hero 結構時請保留此 id。 |
| hero 影片捲動鎖 | **重整一律從頂端重來** | hero 影片播放期間（`main` / `loop` 狀態）鎖住頁面捲動（`body { overflow: hidden }`）。重整後影片狀態會重置為 `main`，若瀏覽器將捲動位置還原到影片後方的內容區，將被 `overflow: hidden` 永久鎖死於中途、無法捲動。因此 **hero 影片體驗一律從頂端重新開始**：<br>・`onMounted` 設定 `history.scrollRestoration = 'manual'`，停用瀏覽器的捲動位置還原。<br>・上鎖（`applyScrollLock`）前先 `window.scrollTo(0, 0)`，確保鎖定當下停在 hero 頂端。<br>兩者確保影片狀態與捲動位置始終同步於頂端，不會出現「鎖死於中途」。 |
| orange core（`.sec1__core`） | 貫穿全場的橘色核心 | hero 影片播畢轉白底（`gone`）後，於**第一屏正中央**淡入（CSS `opacity`）；隨後沿 core path、由捲動驅動一路移動到 date 區，收在大型日期「09／16」之間的橘色「/」。**位置由 [HeroCorePath.vue](app/components/HeroCorePath.vue) 以 GSAP 驅動**（`gsap.set` 的 `x/y` + `xPercent/yPercent:-50` 置中）。<br>⚠️ `.sec1__core` **不可**再設 CSS `transform`（含置中、`scale` 淡入）——會與 GSAP 寫入的 `transform` 衝突；置中一律交給 GSAP，淡入只用 `opacity`。 |
| core 移動路徑（[HeroCorePath.vue](app/components/HeroCorePath.vue)） | 驅動 core 的路徑 overlay | `.sec1` 級絕對定位 overlay（`inset:0`、1:1 px、無 `viewBox`、`pointer-events:none`），在**同一像素座標系**畫兩條線：<br>・**可見灰線**：設計中心線（stub 垂直段 + 曲線），以 **date 大標左上角為錨點**（位移 `left 525 / top −112`）定位 → 尾端固定落在「/」。<br>・**驅動線**（不可見，`stroke:none`）：`core 第一屏中央 →（動態直線引段）→ 曲線`；單一 **scrub `ScrollTrigger`**（`trigger:.sec1`、`start:'top top'`、`end:'bottom bottom'`、`scrub:true`）+ `path.getPointAtLength()` 逐幀定位 core。<br>**設計規則**：<br>① 整段動作是**一條連續 path、一個 tween** → 接縫零頓挫（**不採**「直落 + 交棒 MotionPath 兩段式」，避免交界頓挫）。<br>② **引段（直線）長度隨視窗高度動態重算**，吸收 core（`50vh`）與 date 之間的 vh 動態距離。<br>③ **曲線段只被平移、形狀/尺寸不變**，故 core 尾端一律精準落在「/」。<br>重建時機：`ScrollTrigger` 的 `refreshInit`、`document.fonts.ready`、resize。<br>相依：由 [Section1.vue](app/components/Section1.vue) 傳入 `.sec1` / core / date 大標三個元素（`sectionEl` / `coreEl` / `anchorEl`）。<br>🚧 未實作（規劃中）：沿途殘影 **trail dots**（設計 motion frame）、**RWD 手機版**另畫直式 path（不縮放桌機弧線）、`prefers-reduced-motion` 可改為直接定位起/終點；若 core 抵達「/」時機需微調，改 `ScrollTrigger` 的 `end`。 |

### Section 2 — 智慧論壇 `#forum`（[Section2.vue](app/components/Section2.vue)）

| 元件 / 區塊 | 功能 | 說明 |
| --- | --- | --- |

### Section 3 — 永續祝福 `#blessing`（[Section3.vue](app/components/Section3.vue)）

| 元件 / 區塊 | 功能 | 說明 |
| --- | --- | --- |

### Section 4 — 智慧「心」媒體 `#media`（[Section4.vue](app/components/Section4.vue)）

| 元件 / 區塊 | 功能 | 說明 |
| --- | --- | --- |

---

## 跨 Section 共用功能

常駐於 [default.vue](app/layouts/default.vue)，作用於整個頁面。

| 元件 | 功能 | 說明 |
| --- | --- | --- |
| [AppHeader.vue](app/components/AppHeader.vue) | 頂部固定 Header（logo／錨點導覽／share／閱讀進度條） + 手機底部 TOC | **滾動顯示**（由 prop `autoHide` 控制，含閱讀進度條 `.app-header__progress`）：<br>・`autoHide`（預設 `true`，用於**首頁** `default.vue`）：頁首 hero（`#app-hero`）只要還有任一部分在畫面內，Header 就保持隱藏；hero 完全捲離視窗後才滑入。找不到 `#app-hero` 時會重試數幀，避免頁面內容尚未掛載時誤判。<br>・`autoHide="false"`（用於**其他頁** `subpage.vue`，無 hero）：Header（含進度條）自始常駐顯示、不監看 hero；`isVisible` 初始即 `true`（含 SSR），避免載入時多一次滑入動畫。<br>高度統一由 CSS variable `--header-height`（[base.scss](app/assets/styles/base.scss)）定義，JS 與 CSS 皆取自此變數（錨點捲動偏移補償）。<br>⚠️ 顯示/隱藏動畫**不可**加在 `.app-header` 上——`transform` 會使其成為底部 `position: fixed` TOC 的 containing block，害 TOC 定位跑掉；上方列與底部 TOC 需各自做位移。 |

### 視覺元件庫（規劃中／可跨 section 複用）

| 元件 | 功能 | 說明 |
| --- | --- | --- |
