---
name: visual-subpage-rwd
description: 視覺敘事（/visual）三斷點 RWD 完成紀錄：測驗按鈕 mob 新樣式、works 作用中列版型、桂冠圖表原寸
metadata:
  type: project
---

/visual 三斷點 RWD 於 2026-07-29 完成（斷點對應見 [[rwd-breakpoint-mapping]]，文字以 pc 稿為準，同 [[news-subpage-rwd]] 裁定）：

- **AiImageQuiz**：pad 欄寬收 570（含 padding 20 → 530）、mob 邊距 26。作答按鈕 pc/pad 為 48 圓鈕＋18px 字（字距 0.1em，勿再用 10px）；mob 稿是「邊框盒」新樣式——177×60、border 0.5 #686868、像素箭頭（`/img/udn75_arrow_pixel.svg` 22×12 朝下素材，CSS rotate ±90 朝外）＋15/26 Light。按鈕 → 說明面板間距 28。
- **SubpageWork 作用中列**：pc hover／<1280 滾至畫面中央（SubpageSection `activeIdx` ref 傳入 `active` prop）才展開說明與「點擊看專題」。<1280 直排：標題 18/30 Regular #686868、說明 15/22 Light justify、more 靠右（`align-self: flex-end`）、圓鈕 pad 30／mob 48；非作用列只剩灰標題（無箭頭）。標題→說明的 8px 用 desc-wrap 的 margin-top 隨展開出現（收合列高才對稿：pc 64／pad 62／mob 62，作用中 pad 174／mob 236）。
- **桂冠圖表（chart06）**：svg 原寸呈現——pcpad 版 630×309（內建上下留白 32，故緊貼 H3 排、pad 也不縮）、mob 版 362×360（無留白，補 margin-top 32）。寬欄圖表 max-width 改 `var(--subpage-content-w)`（勿再扣 40）。圖表 → works 清單 margin：pc 32／pad 16／mob 64。
- **「近年得獎獎項」H3**：pc/pad 置中、mob 靠左 → SubpageSection 新增 `titleCenter` prop（JSON 設 `"titleCenter": true`），與 `variant: 'center'`（H4 置中導言）不同。
- pad 寬欄（works/awards）清單收 530 置中：`__works-wrap` 的 rwd-max('pc') max-width 530，`__inner` 的 --wide 1064 不動。
- 這些改動同時影響 /service、/data 的 works／chart 區塊（共用元件），之後對稿時直接沿用此版型。
