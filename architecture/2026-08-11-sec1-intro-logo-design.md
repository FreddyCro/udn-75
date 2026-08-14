# Section 1 引言（`sec1__scene`）對齊設計稿 ＋ 段末 logo — 決策紀錄

日期：2026-08-11（2026-08-12 壓縮，原 158 行見
`git show e0840bd:architecture/2026-08-11-sec1-intro-logo-design.md`）
狀態：**已實作**
相關檔案：`app/components/01.hero/Hero.vue`、`Hero.scss`、`app/locales/section1.json`
設計稿：Figma mob `3104:84993`／pad `3104:84900`／pc `3104:84714`（檔案 `Rv5FZniHD1NErLTtsPSSm8`）

三份稿量測後 `sec1__scene` 有三項與現況不同：引言是**三段**而非一整塊、段末有 **162×48 的
聯合報系 logo**、pad 欄寬應為 **530px**（現況 630）。字級三稿一致不需要動 ——
以「行數 × 行高」回推可驗證：pc 8 行 × 36 ＋ 2 × 36 ＝ 360 ✓、pad 10 行 ＝ 432 ✓、
mob 14 行 ＝ 576 ✓，全落在既有的 18px / line-height 36px 上，**段間距因此就是一個行高 36px**。

版位數值都在 `Hero.scss`、DOM 在 `Hero.vue`（該處註解已寫明 `UPic` 的用法理由），以下只留決策。

---

## 一、`introBodyRef` 從 `<p>` 移到外層 group

`introBodyRef` 是引言淡出那條 ScrollTrigger 的 trigger（`start: 'bottom center'`）。它改掛在
**包住「三段文字 ＋ logo」的 `<div>`** 上，於是淡出起點的語意從「文字底緣升到視窗中央」變成
**「整組內容底緣升到視窗中央」** —— 仍然是既有註解寫的那件事：*方塊剛穿出內容的最後一個元素*。

視覺後果：橘方塊會**從 logo 後方穿過**（`.sec1__scene` 在 `z-index: 3`、`OrangeCore` 在 2，
本來就是這個層序），穿出 logo 底緣後整組才開始淡出。這是刻意的選擇。

**捲動幾何不用改**：`--intro-runway`（`padding-bottom`）與 transition pin 的
`start: 'bottom bottom'` 都掛在**外層 `introRef`**。runway ＝「內容底緣 → 視窗中央」的 50vh
＋ 淡出窗口，把 logo 併入「內容」之後這條數學依然成立 —— `INTRO_FADE_VH` / `TRANSITION_VH` 與
`OrangeCorePath` 的 `endTrigger` 一行都不必改。

## 二、logo 用 `UPic`，外面再包一層 `div`

**為什麼不把 `classname` 直接給 `UPic`**：`UPic` 的 `classname` 綁在**內層 `<img>`** 上，
而 `Hero.scss` 是 `scoped` —— Vue 的 scoped CSS 只會把 scope id 蓋在子元件的**根**元素
（`<picture>`）上，選不到內層 `<img>`，`.sec1__intro-logo` 那條規則會整條失效。
包一層自家的 `div` 後，尺寸與間距寫在自己的 BEM element 上，既不必動用 `:deep()`，
也不必為了樣式去改 `UPic`。

**為什麼是 `UPic` 而非裸 `<img>`**：`src` 由元件內部前綴 `APP_ASSETS_PATH`，部署到子路徑／CDN
時不會 404；`width`/`height` 一併給，避免 CLS。走「單檔圖」用法（`UPic.vue` 案例 3）：
`ext="png"`、`:use-prefix="false"`、`:use2x="false"`、`:webp="false"`。
`loading="eager"`：logo 落在第一屏的捲動範圍內，預設的 lazy 會讓它在橘方塊經過的那一刻才冒出來。

尺寸傳遞：`UPic` 的全域規則 `.u-pic-img { width: 100%; height: auto }` 讓 `<img>` 撐滿容器，
故**寬度由 `.sec1__intro-logo` 的 `width: 162px` 決定**。容器另加 `line-height: 0` 收掉 inline
`<picture>` 的行框餘隙 —— 否則 group 底緣會多出幾 px，連帶把引言淡出的起點往下推。

## 三、順手改成 mobile-first

`Hero.scss` 原本把 mob 規則放在檔尾一個獨立的 `@media (max-width: 767.98px)` 區塊，違反
CLAUDE.md SCSS 規則 2。本次動到的正是那個區塊裡的兩個 class（`.sec1__scene`、`.sec1__intro`），
故一併收乾淨：該 `@media` 整塊移除，兩者改為 mobile-first 基底 ＋ 內部 `rwd-min('tablet')` 覆蓋。
（`.loader-fade-*` 兩條 transition 不在 `.sec1` 之下、與斷點無關，留在原位。）

## 四、不做的事

- **不補 `logo@2x.png` / svg。** `public/img/logo.png` 實測 162×48、只有 1x，retina 上會偏軟。
  日後拿到 2x 或 svg，把 `:use2x` 打開（或改 `ext="svg"`）即一行的差別。
- **不動 `padding-top` 的量值。** 引言的垂直落點由捲動動畫決定，稿上的 y 座標是靜態示意；
  現行 `clamp(360px, 78vh, 560px)` / `100px` 只調整了書寫位置（mobile-first）。
- **不動 `INTRO_FADE_VH` / `TRANSITION_VH` / `OrangeCorePath`。** 見第一節。
- **不動 `.sec1__intro` 的 opacity 驅動方式。** 仍由 `Hero.vue` 寫 inline style，
  logo 因為在 `introRef` 之內，自然跟著整段一起淡出。
- **`orange-core-config.ts` 與 `OrangeCorePath.vue` 提到「文字底緣」的註解不改。**
  那兩處講的是 runway 與終點的**數學**（內容底緣 − 50vh），語意未變、值也未變 ——
  避免把一次排版調整擴散成跨檔註解重寫。
