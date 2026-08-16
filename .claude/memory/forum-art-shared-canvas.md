---
name: forum-art-shared-canvas
description: 論壇「地點／時間」這種多行素材是整組共用畫布，重出 SVG 要從一份群組匯出切成多檔，不是逐行各自匯出
metadata:
  type: reference
---

`architecture/2026-08-12-forum1-text-art-design.md` 第六節寫的是**單行**素材的匯出流程
（`download_assets` → 拿掉 Figma 的 `preserveAspectRatio` / `overflow` / `style`）。
`__venue`（地點兩行＋時間）那種**右切齊的多行群組**還多一層規則：

**三個檔案的 `width` 相同（＝群組最寬那行），差別只在 `viewBox` 的 y 偏移。**
例：論壇二改版前三檔都是 `373.8489` 寬，viewBox 依序 `0 0 …` / `0 63.0009 …` / `0 126.001 …`；
改版後是 `413.547` 寬、`0 0` / `0 65.3062` / `0 133.9409`。
墨跡在畫布內落在稿的真實 x，右切齊因此**烤在素材裡**，CSS 不必（也不能）再對齊一次。

**How to apply（重出多行素材）：**
1. `download_assets` 抓**整個群組**節點（不是逐行），用回傳的 `svgAssets`（純向量層）而非 `export`
   —— `export` 會夾帶背景 `<rect>` 與整頁裁切殘留。
2. 匯出的 path 已在群組座標系內，逐行切檔：`width` ＝ 群組寬，`viewBox` ＝ `0 <該行 y − 群組 y> <群組寬> <該行高>`，
   y 與高從各 `Union` 的 metadata 取。
3. 判斷哪一筆 path 屬於哪一行，用**該 path 第一個 `M` 指令的 y**。
   ⚠️ 不要拿整條 path 算 bbox：`H` / `V` 指令會打斷「座標成對」的 parity，min/max 會摻進 x 值
   （2026-08-17 就這樣把行一的 path 誤配給行二，且不會報錯）。
4. `fill` 寫死 `#686868`，**不能用 `currentColor`** —— `UArtLine` 把素材當 CSS 背景圖不是 inline SVG。
5. `section2.json` 的 `w` 三行都填群組寬，`h` 各填各的。

相關：[[forum-rwd]]（動版面前的必讀清單）
