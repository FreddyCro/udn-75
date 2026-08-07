---
name: rwd-breakpoint-mapping
description: RWD 斷點的權威來源是 mixins.scss；這裡只留它沒寫的三件事（1024 誤傳、JS 判斷值、稿的細切原則）
metadata:
  type: project
---

**斷點值與 mobile-first 寫法的權威來源是 `app/assets/styles/mixins.scss` 開頭的註解**
（mob 稿 ≤767／pad 稿 768–1279／pc 稿 ≥1280，`rwd-min` / `rwd-max` 用法都在那）。
不要在這裡再抄一份。以下只留那份註解沒寫、但踩過的三件事：

1. ⚠️ **勿再引用 1024 當 mob/pad 切點。** 使用者 2026-07-28 最初誤說「mob 到 1023」，
   當天即更正為 767。舊對話與舊註解裡可能還留著 1024，看到請以 767 為準。
2. **JS 端的判斷值**（mixins.scss 只管 SCSS）：`matchMedia('(max-width: 767.98px)')`
   與 `'(max-width: 1279.98px)'`。
3. **mob 稿不在 414 再細切**——414 canvas 的版面直接流動縮放到 ≤767 全段；
   pad 稿則相反，元素多為固定 px（如標題 518 置中），不隨視窗流動。

相關：共用箭頭圓鈕素材 `/img/udn75_arrow_circle.svg`（像素箭頭為 fill，縮放不變形；
外圈 stroke 0.5 會隨 img 縮放等比，若需定寬可在 circle 加 `vector-effect="non-scaling-stroke"`）。
