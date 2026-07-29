---
name: service-subpage-rwd
description: 永續影響（/service）三斷點 RWD 完成紀錄：沿用 visual 版型、chart19 svg 正規化、figures pad 32
metadata:
  type: project
---

/service 三斷點 RWD 於 2026-07-29 完成，全面沿用 [[visual-subpage-rwd]] 建立的共用版型（works 作用中列、titleCenter、圖表原寸規則），無新增元件。差異處：

- 「近年得獎專題」依 pc 稿改字為「近年得獎獎項」＋`titleCenter: true`（service.json）。
- **chart svg 規範**：桂冠圖 pcpad 版一律含 32px 上下留白（mob 版不含，靠 CSS margin 32/64 補）。chart06 原生如此；`udn75_chart19_01_pcpad.svg` 原本無留白，已改 viewBox `0 -32 633 327` 正規化。之後新圖表照此規範，共用間距規則才成立。
- figures 兩圖並排 gap：pc 40／pad 32（249+32+249=530）／mob 直排 gap 24。
- **設計稿 node 備忘**：service pc=6080:56571、pad=951:24094、mob=**6072:56577**（Frame 12668；定稿 mob 包在 Frame 1266x 系列：visual 56576、service 56577、data 56578，page dump 列舉不到，猜相鄰 id 才找到）。543:53821 是舊版 mob（hero 分行、得獎交錯版型）勿參考。
- mob 定稿補對後的修正：figures 直排 gap 24→32、並排圖圖說間距 8（`__figures-item` 內縮限，全站 --sp-img-caption 12 不動）、`udn75_chart19_01_mob.svg` viewBox 裁掉 16px 內建垂直留白（對齊 chart06_mob 無留白規範）。
