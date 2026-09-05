# CLAUDE.md

## Language

回答用繁體中文和英文，避免使用簡體字和中國慣用語。

## Memory

優先將 memory 存放在本專案的 `.claude/memory/` 目錄（`.claude\memory\`），而非全域 memory 目錄。MEMORY.md index 同樣存放於此目錄。

## Output Files

所有 skill 或任務產生的暫存、輸出檔案，優先寫入 `temp/` 目錄。若該子目錄不存在，先建立再寫入。

## Cleanup

每次工作告一段落（交還控制權給使用者前），必須清掉自己開的執行環境：

1. **關閉所有 dev server**：結束自己啟動的 `pnpm dev` / `nuxt dev` 等背景行程，不要留著佔用 port。
   ⚠️ 只用 `TaskStop` 不夠 —— 它結束的是 pnpm 包裝行程，底下的 node 仍在監聽。
   要用 `Get-NetTCPConnection -LocalPort <port> -State Listen` 找出真正的 PID，
   `Stop-Process -Id <pid> -Force` 殺掉，再確認 port 真的釋放。
2. **關閉所有 worktree**：移除自己建立的 git worktree（`git worktree remove`），並確認 `git worktree list` 只剩主工作目錄。

清完後回報實際結果（關掉了哪些、port 是否釋放）。使用者原本就自己開著的行程不要動。

## Figma

讀取 Figma 時，優先使用 Figma MCP（`mcp__claude_ai_Figma__*` 工具），避免直接呼叫 Figma API。

## 文案（所謂的 i18n）

本專案**沒有多語系切換**，`i18n` 一詞在這裡指的是**文案外部化慣例**，且**不使用任何 i18n 套件**（無 `@nuxtjs/i18n`、無 `vue-i18n`），新增 section 時也不要引入。

- 文字依 section / component 分檔放 `app/locales/*.json`，元件直接 `import str from '~/locales/section-x.json'`。
- 共用檔：`meta.json`（SEO，在 `app.vue` 用 `useSeoMeta` 消費）、`common.json`（header/nav）、`footer.json`（製作團隊名單）。
- `meta.json` 的圖片路徑用 runtimeConfig 的 `APP_ASSETS_PATH` 組：`${ASSETS_PATH}/img/${meta.metaImage}`。

目的是把中文文案與排版分離，方便編輯校稿。

## SVG sprite（產物要 commit）

正式站對 `_nuxt/*`、`img/*` 依**時間窗內的 request 次數**限流（429），不是 bytes
（詳見 `architecture/2026-09-04-request-reduction-design.md`）。夥伴 logo（`section3.json`
的 partner 清單）、論壇／祝福藝術字（`UArtLine.vue` 消費的逐行素材）與**六篇子頁的內文
素材**因此走 sprite：一組幾十支 SVG 合成一支 `<svg><symbol>`，元件用
`<svg><use href="sprite.svg#id">` 引用，一組只剩 1 個 request。產物在
`public/img/sprites/`（`partners.svg`、`article.svg`、`art-pc.svg`、`art-pad.svg`、
`art-mob.svg`、對帳用的 `sources.json`），**已納入版控**。

- 改了任何 `public/img/blessing/partner-*.svg`、
  `public/img/{forum,blessing}/*-{pc,pad,mob}*.svg`，或 `article.svg` 收錄的內文素材
  （名單在 `scripts/lib/sprite-sources.mjs` 的 `ARTICLE_ART`）之後，**必須跑
  `pnpm assets:sprites` 並把 `public/img/sprites/` 下的產物一起 commit** ——
  build 不會自動重跑這支腳本。
- `article.svg` 還會多產一份 `app/utils/article-sprite-viewbox.json`（symbol id → viewBox），
  **同樣要 commit**。外部 `<use>` 的 viewBox 在 `<symbol>` 上、外層 `<svg>` 沒有內在尺寸，
  消費端只要有一邊尺寸是 auto（如 `.award-timeline__year` 只定 height）就得靠它算比例。
- ⚠️ 只有「用 `<img src>` 消費」的素材能進 sprite。走 CSS `mask-image: url(...)` 的
  （子頁 hero 標題／副標）不能 —— 瀏覽器對外部 SVG 的 fragment 參照支援不一致。
- 沒跑的話 `test/sprite-coverage.spec.ts` 會失敗：它不只驗 symbol id 存不存在，
  也會重算來源檔的 sha256 與 `sources.json` 對帳，內容換了但忘記重跑一樣會紅。
- 規則只有一條、兩邊共用：symbol id ＝ 檔名去副檔名（`app/utils/svg-sprite-ref.ts`），
  改元件消費的路徑或加新素材時想一下這條規則有沒有被打破。
- 來源檔看到 Figma 連畫布一起匯出的深灰底板（`<rect fill="#515151">` 那一整疊）**不用手動清**：
  `stripCanvasBackdrop()`（`scripts/lib/svg-sprite.mjs`）在進 sprite 前會剪掉整版不透明
  底板以下的內容。不清會在 `transform: scale()` 時從小數點像素的邊緣透出一圈黑邊
  （夥伴 logo hover 放大就踩到過）。守門條件不成立的素材原樣放行，不會剪錯。

## 新增一支小 SVG 時走哪一條

避免多一個 SVG request 有三種機制並存，加新素材前先對照這張表，不要憑感覺選：

| 機制 | 檔案放哪 | 怎麼引用 | 程式在哪 | 為什麼是這條界線 |
|---|---|---|---|---|
| Vite `assetsInlineLimit` 白名單 | `app/assets/img/` | `import x from '@/assets/…'` 或 SCSS `url('../assets/…')` | `build/inline-svg-assets.ts` | build 期的靜態 import／`url()` 就能決定要不要內嵌，服務「路徑在 build 時就固定」的素材，最單純。 |
| `?raw` glob ＋ `svgDataUri` | `public/img/` | runtime 用 locales JSON 存的站台根目錄路徑字串查表 | `app/utils/inline-art.ts`、`app/utils/media-art.ts` | locales JSON 存的是站台根目錄路徑字串、要到 runtime 才解析出實際素材，機制 1 的 build-time import 服務不到。 |
| sprite ＋ `<use>` | `public/img/{forum,blessing}/`（來源），產物在 `public/img/sprites/` | `<svg><use href="sprite.svg#id">` | `app/utils/art-sprite.ts`、`app/utils/svg-sprite-ref.ts` | 素材數量多、合計體積大（夥伴 logo 1.08 MB、論壇藝術字 1.61 MB）；全部內嵌進 HTML 實測過並否決（HTML 會從 528 KB 長到 3.5 MB），改用 sprite 換成一組 1 個 request。 |

新增一支小 SVG（通常幾 KB）：路徑在 build 時就固定 → 機制 1；locales JSON 存路徑、
要到 runtime 才查 → 機制 2；同一組有幾十支、合計體積大 → 機制 3。不要為了省一個
request 就自創第四種。

## SCSS

1. 優先使用 BEM（`block__element--modifier`）命名。
2. RWD 寫在 BEM element 內部，用 `rwd-xxx` mixin 包住，不要按斷點把整份 scss 切成多區。同一個 class 只定義一次，其各斷點樣式集中在同一處。
3. **BEM 最多一層 element**：巢狀結構用連字號延伸，不可疊兩個。
