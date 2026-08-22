---
name: subpage-hero-100vh
description: 子頁首屏判讀：設計稿 canvas＝裝置視窗 → hero 滿版 100svh、文案距頂固定、進場 fade-up（不做 sticky）
metadata:
  type: project
---

2026-08-02 判讀（/news 先行，四子頁共用 Subpage.vue）：三斷點「首屏動畫」frame 尺寸＝裝置視窗（mob 414×736、pad 768×1024、pc 1280×720），且 header instance 疊在 frame 內上層（y 0–83）→ **hero＝滿版 100vh（非 100vh − header）**。斷點對應見 [[rwd-breakpoint-mapping]]。

**How to apply:**
- hero `min-height: 100vh` ＋ `100svh` 覆寫；文案距視窗頂固定（主標頂 mob 148／pad 180／pc 163），非垂直置中。
- **例外（2026-08-22）：pin 版型下的滿屏媒體層改吃 `100dvh`**（`bottom: auto`＋媒體拍 `overflow: visible`）——100svh 是工具列展開時的小視口，iOS Safari 捲動中工具列收合後視口變高，滿屏照片底部會露一條 50–70pt 的縫。舞台高與 pin 距離**維持 svh 不動**（scrub 幾何不受影響），只有媒體層伸出去。hero 維持 svh（底下是白底，縫看不見）。
- hero **保留 `position: relative`**：hero-bg 是 `position: absolute`，少了它 containing block 會掉回 initial containing block，`bottom: %` 變成量視窗高而非 hero 高，`overflow: hidden` 也不再生效。
- 設計稿標註「文字畫面：定住」**經確認不做 sticky**（2026-08-02 決策），首屏只要「像 AOS 一樣由下往上淡入」。`.subpage__hero-inner` 以 GSAP `gsap.from`（autoAlpha 0 → 1、y 32 → 0、0.4s power2.out）進場；引言同款但掛 ScrollTrigger `once: true`。`prefers-reduced-motion` 時不建 tween，內容維持 CSS 可見狀態。
- 後續內容仍包進 `.subpage__content`（`position: relative` ＋白底、z-index 維持 auto）——目的不是蓋過 hero，而是**不建立 stacking context**：右側 rail 與底部錨點列都是 `position: fixed` 且住在它裡面，這層一旦有 z-index，它們就跨不出去、會被外面隨便一個滿版區塊蓋掉。
- **疊層總表（2026-08-16 定案，寫在 `assets/styles/subpage.scss` 的 `.sp-full`）**：`1100` 滿屏引言媒體 ＞ `1000` AppHeader ＞ `960` SubpageAnchorBar ＞ `950` `.sp-full` 滿版嵌入元件 ＞ `900` SubpageAnchor（pc 右側 rail）。rail 由 z1 抬到 900 是為了蓋過一般內文；滿版嵌入元件再抬到 950 蓋回 rail（滿版就要滿版）。底部錨點列不跟 rail 同值 —— 它是 <1280 唯一的導覽，被照片牆蓋掉等於沒有導覽。
- hero-bg（KV icon）**mob／pad 距底＝滿版 frame 的底部 gap 比例**：mob 172/736≈23%、pad 265/1024≈26%（hero 改滿版後這些 % 才真正對位）。
- **pc（≥1280）不走距底，改「跟在副標下方、左緣切齊文案」**（2026-08-17 依 Figma node 2065:134371 調整）：文案欄 `max-width: 1064px; padding: 0`（＝稿的 1280 − 108×2，故 pc 不能沿用 tablet 的 `min(79vw,1104px)` ＋ padding 20，那會讓左緣落在 154.5）；icon `top: 411px`（163 padding-top ＋ 72 主標 ＋ 32 ＋ 64 副標 ＋ 80 稿距）、`left: calc(50% - 532px)`、`width: auto`、`height: clamp(0px, calc(100svh - 494px), 224px)`。距頂維持 163 未跟稿的 144（使用者決定）。
  - 稿的 480×224 是**上限**，視窗不足時依剩餘高度縮（底部固定留 83）；width 交給 auto 由高度帶，因為六頁素材比例微異（856×400／858×399／856×399），寫死 480 會壓扁 education／health。
  - `clamp` 下限 0 是防呆：裸寫 `calc(100svh - 494px)` 在矮視窗算出負值會讓宣告失效、退回 `height: auto`＝素材原寬 856px 而爆版，且是靜默的。
  - 六頁可共用同一組定值，因為主／副標高度是 CSS 寫死的 72／64（health 素材 74.2／66.6 也會被壓回），文案群組總高一致；且六頁副標換算 64 高後最寬 796 ＜ 1064，pc 不會觸發 `max-width: 100%`（tablet 會，副標在 768 時被夾到 578.8，屬既有行為）。

**Why:** 設計稿無 vh 文字標註，但 canvas 尺寸與 header 疊層即是規格。SubpageContent interface 已把 hero 各欄／intro／sections／nav 設為必填（四份 JSON 結構一致），僅 nav.next 保留 optional（data.json 是最後一篇）；頁面統一 `raw as SubpageContent` 斷言（JSON import 會把 "center"/"gold" 寬化成 string）。