---
name: news-subpage-rwd
description: 新聞部×數據發展部（/news）三斷點 RWD 完成紀錄：關鍵尺寸、新素材、待確認問題
metadata:
  type: project
---

/news 三斷點 RWD 於 2026-07-29 完成（斷點對應見 [[rwd-breakpoint-mapping]]）：

- 子頁內文欄：pc 630（`--subpage-content-w`）、pad 530（`__inner` max-width 570 含 padding 20）、mob 左右邊距 26。
- FormulaBlocks 三舞台（Figma 座標系整體 scale）：pc 1064×524、pad 610×600、mob 360×882；連接線為 SVG 素材 `udn75_news_formula_link_{tl,tr,bl,br}.svg`（76×60，pad 斜帶）與 `udn75_news_formula_rail_01/02.svg`（44×132／44×180，mob 直 rail，02 重複用三次）。
- GlitchImage works 懸浮縮圖觸發改「視窗寬 1280」判斷（非 hover capability）：≥1280 hover、<1280 滾至畫面中央；matchMedia change 可來回切換（SubpageSection.vue）。
- `SubpageAnchorBar.vue`（<1280 顯示、hero 下方橫向錨點列）取代右側 rail；rail 改 `rwd-max('pc')` 隱藏。
- `--text-intro` 由 36 改 32（Figma 四部門引言 32/60；mob 22/40）。
- SubpageSection 新增 `variant: 'center'`（置中導言：pc 28/46＋引導句 20/32；mob 28/40＋18/30），news.json 的「Publish X 議題智囊包」section 使用。
- hero 單位＋作者合併單行「{unit}／{author}」（四子頁共用，pc/pad 24/48、mob 18/36 Light）。

**2026-07-29 使用者裁定：文字都以 pc 稿為準**。已套用：hero 署名改「熊迺群」；輪播圖說 wording 對齊 pc（攝影／高彬原、圖WAN-IFRA提供、記者張宗智／攝影）；引導句一行含逗號。pc 稿明顯排版雜訊（半形括號、多餘空白如「6 月」「(Curate X  )」）不照抄，維持全形慣例。舊 chart19 圖表三斷點稿皆移除 → news.json 已刪該 section（`udn75_chart19_01_*.svg` 素材仍在）。pc 稿的段落順序有誤置（AI革命 H3 孤立），依 mob/pad 順序實作——「以 pc 為準」僅限文字，不含區塊順序。
