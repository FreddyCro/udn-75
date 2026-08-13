# Memory Index

- [Dev server port ownership](dev-server-port-ownership.md) — 清 dev server 前先比對 PID 啟動時間；自己的 nuxt dev 可能落在 3001，殺 3000 會誤殺使用者的
- [No auto commit](no-auto-commit.md) — 絕不自行 commit；停下來給 commit message，由使用者決定
- [Comment style](comment-style.md) — 註解精簡原則：不寫 Figma node ID、不寫敘事型檔頭，只留維護必要資訊
- [UI component workflow](ui-component-workflow.md) — 共用元件建置流程與清單在 architecture/components.md；ui/ + U 前綴、五步 SOP
- [RWD breakpoint mapping](rwd-breakpoint-mapping.md) — 斷點權威來源是 mixins.scss；這裡只留 1024 誤傳的更正、JS matchMedia 值、稿的細切原則
- [Page route naming](page-route-naming.md) — 六子頁路由↔單位對應與閱讀順序（下一篇鏈）；JSON 改名史
- [Hero body lock rules](hero-body-lock-rules.md) — hero 開場捲動鎖逐拍規則；.is-scroll-locked 必須同時掛 html 與 body 否則完全無效
- [Hero core screen-locked](hero-core-screen-locked.md) — hero orange core 螢幕上完全不動（恆 50vh），是文字捲上去穿過它；程式註解本身會誤導
- [Hero outro core handoff](hero-outro-core-handoff.md) — 影片裡的 core → DOM core 交棒：anchor 在 config、cover 換算與旋轉補償在 hero-core-handoff.ts
- [Forum RWD](forum-rwd.md) — 動 02.forum 版面前先讀 architecture/forum-node-path.md；desktop-first 例外的理由、特異度陷阱
- [Subpage hero 100vh](subpage-hero-100vh.md) — 子頁首屏滿版 100svh＋進場 fade-up（不做 sticky）；hero 須保留 position: relative
- [Agenda core crossing](agenda-core-crossing.md) — 議程作用中判定為何不能每 tick 取樣（快捲跳號）、目標／當前分離＋一次走一步、箭頭幾何由單位 u 推導、群組留白刻意留 12
