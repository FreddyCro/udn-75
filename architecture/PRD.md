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
