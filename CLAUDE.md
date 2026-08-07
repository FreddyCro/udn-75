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

## SCSS

1. 優先使用 BEM（`block__element--modifier`）命名。
2. RWD 寫在 BEM element 內部，用 `rwd-xxx` mixin 包住，不要按斷點把整份 scss 切成多區。同一個 class 只定義一次，其各斷點樣式集中在同一處。
3. **BEM 最多一層 element**：巢狀結構用連字號延伸，不可疊兩個。
