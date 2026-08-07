---
name: ui-component-workflow
description: 共用 UI 元件的建置流程與清單都在 architecture/components.md；動到 ui/ 或 design token 前先讀
metadata:
  type: project
---

2026-08-07 起建立共用 UI 元件庫。**規則與清單集中在 `architecture/components.md`**，動到 `app/components/ui/` 或 design token 前先讀那份。

要點（細節看文件）：

- 新元件放 `app/components/ui/`、`U` 前綴（`UButton`）。**現存元件一律不搬**。
- **不改的範圍**（已驗收，元件化與 token 替換都不碰）：`05.subpage/`、`AiSearch`、`FormulaBlocks`、`AwardTimeline`、`PhotoPanels`、`PixelRail`、`PixelBranch`、`AiImageQuiz`、`legacy/`、dev 工具與 `demo.vue`。
- 每支元件五步 SOP：讀 Figma node → 定向掃 codebase → **提 API 草案給使用者確認** → 實作 → 替換命中區塊。第 3 步是刻意設的關卡，只確認 props/slot/variant 形狀。
- 清單用 checkbox 記替換位置，未打勾的必須寫原因。
- design token 落點依「誰需要讀它」分三處：`tailwind.css` 的 `@theme static`（要 utility class 的色票字級間距）、`base.scss` 的 `:root`（只給 SCSS/JS 讀）、`mixins.scss`（編譯期要用的斷點）。

相關：[[comment-style]]（Figma node ID 只寫在清單、不寫進程式碼註解）、[[no-auto-commit]]
