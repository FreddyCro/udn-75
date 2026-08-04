---
name: data-subpage-rwd
description: 智慧新聞（/data）三斷點 RWD 完成紀錄：AiSearch 欄寬、ShowcaseGallery 斷點縮放參數
metadata:
  type: project
---

/data 三斷點 RWD 於 2026-07-29 完成（斷點對應見 [[rwd-breakpoint-mapping]]）：

- **AiSearch**：容器同內文欄——pc 630、pad 570 含 padding 20（→530）、mob 邊距 26。搜尋列 placeholder 色 #bcbcbc、AI 摘要面板底 #fafafa（皆非全站 token）。CTA「深入體驗聯合報數位版」280×68 置中，上距 pc/pad 32、mob 28。
- **ShowcaseGallery（綁滾動多圖輪播）**：正式素材 udn75_pic30_01~15 已於 2026-08-04 接上（UPic、無裝置後綴、webp+@2x；slide 寬沿用設計稿分佈、高依實圖比例 3:2／4:5／1:1，count=15）。卡片占視窗比例三斷點不同——`designW` ref：pc 1280、pad 556、mob 467（對稿卡寬 241 → pc 19%／pad 43%／mob 52% 視窗寬）；路徑水平外擴 spread pc 1／pad 2.3／mob 2.7、垂直振幅 vScale pc 1／pad 1.3／mob 1.55，於 measure()（refreshInit 觸發）依 matchMedia 更新。
- **設計稿 node 備忘**：data pc=6082:56572、pad=951:24485、mob=6072:56578（Frame 12669）。data 頁無「前往下一篇」（pc 稿該按鈕 hidden，data.json nav 只有 backUrl）✓。
