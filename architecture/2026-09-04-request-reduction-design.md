# 降低正式站 request 數（429 對策）— 規格與量測依據

日期：2026-09-04
說明：本文件是「降低正式站 request 數（429 對策）」的設計依據，原存放於
`temp/plans/2026-09-04-request-reduction-spec.md`（gitignored，理由已隨階段一 15 個
commit 落地一併搬進版控）。**階段一（首頁，字型以外）與階段二（子頁，字型以外）皆已完成**
——階段二最後一個 commit 為 `6a25859`；**階段三（字型 subset）經使用者裁示暫緩**
（理由：文案會持續修改，subset 字集會漂移），改為執行兩項不受文案影響的字型優化，見 §7.x。第 5 節已補上階段一、
二完成後的實測結果與範圍落差（目標值當初漏算了什麼、實際數字是多少），第 6 節仍是
尚未執行部分的範圍紀錄，供對照。
範圍：Nuxt 端能做的事。伺服器端（Cloudflare cache rule、限流規則排除靜態路徑、`Cache-Control: immutable`）另案，與本計畫並行。

## 1. 問題

正式站 udn75.udn.com 對 `_nuxt/*.js|css`、`_fonts/*`、`img/*` 回 429（Too Many Requests）。
限流算的是**時間窗內的 request 次數**，不是 bytes。因此有效手段只有兩種：減少每位訪客的 request 數、把 request 攤到捲動過程中。

實測環境：`.output/public`（production 設定 build）架在本機、補上正式站同樣的 `Cache-Control: public, max-age=300`，Chrome 152（Playwright）。

⚠️ **字型那兩列原本寫「約 105–145」是推估，且推估錯了。** 2026-09-05 補量（把產物 CSS 的
`local("…")` 拿掉後再測，模擬沒裝 Noto Sans TC 的一般訪客）：**首頁 36、子頁 35**。
推估之所以偏高，是誤以為「切片數 × 字重數」；實際上 @nuxt/fonts 對 300/400/500 解析出來的
是**同一支可變字型檔**，三條 `@font-face` 指向同一個 URL，瀏覽器只抓一次。詳見 §7 的決策紀錄。

## 2. 首頁現況（桌機 1440×900）

| 類別 | 冷載入首屏 | 捲到底 | 備註 |
|---|---|---|---|
| HTML | 1（528 KB） | 1 | 內含 320 條重複的 `@font-face`（約 400 KB） |
| 字型切片 `_fonts/` | **36**（2026-09-05 實測） | 同 | 首頁文字命中 35/105 片 Noto Sans TC ＋ 1 片 Noto Sans。三個字重指向同一支可變字型檔，故不是 ×3。Noto Serif TC 是 @nuxt/fonts 掃到 common-components CSS 自動補的（108 片），但沒有選擇器在用，瀏覽器不會抓 |
| SVG | 112（101 支不重複） | 160 | 夥伴 logo 45 svg + 8 png、論壇藝術字 pc 39、media 8、header 錨點 3、編號 6、箭頭 2、logo 1 |
| JS | 11 | 29 | 8 支 < 6 KB；捲到底多出的 18 支是 NuxtLink 視窗內 prefetch |
| CSS | 4 | 13 | 同上，9 支是 prefetch |
| app manifest `_nuxt/builds/meta/*.json` | 1（被 429 時 ofetch 立刻重試 1 次） | 1 | 純靜態站用不到 |
| `_payload.json` | 1（69 bytes） | 8 | 全站沒有 useAsyncData / useFetch |
| mp3 | 6 | 6 | `AppSfx` 一掛載就 `prime()` 全部預抓 |
| hero mp4 + poster | 2–3 | 同 | faststart 已正確 |
| 點陣圖 png/webp | 12 | 15 | `face.webp` 被抓 2 次：`<link rel=prefetch>` 沒帶 crossorigin、`Image()` 用 `crossOrigin='anonymous'` |
| **打自家網域合計** | **約 260–300** | **約 345–385** | 外部追蹤碼另計 12–14 |

重複抓取（同一 URL）：`logo.svg` 5 次（`<img>` 與 CSS mask 的抓取模式不同、快取 key 不同）、header 錨點 SVG 各 2–3 次、編號 SVG 各 3 次。

### 2.1 夥伴 logo 的 `loading="lazy"` 已失效

- 53 張 logo 已是 `<img loading="lazy">`，卻在距視窗 16,000 px 時全部下載（10 次重跑中 7 次）。
- 純 SSR 版面（擋掉 JS）下 0 張下載 → lazy 本身沒問題。
- 二分：把 `.section3__unit` 設成 `position: fixed` **一個 frame** 再改回，Chrome 立刻下載 12–53 張。`is-pin-face` / `is-pin-list` 正是 fixed。
- 結論：不要對 pin 段落內的圖依賴原生 lazy；`src` 改由觀察**文件流內**的 `.section3__unit-track` 的 IntersectionObserver 控制。

### 2.2 hero 影片在手機多抓 pc 版

`HeroVideo.vue:97` 的 `device` 在 SSR 預設 `pc`，`<video src>` 與 `poster` 寫在 SSR 標記裡；手機先抓 `_pc.mp4`（metadata 約 45 KB）與 pc poster，掛載後才換 mob。

## 3. 子頁現況（`/subpage` 連續閱讀頁，手機 390×844）

| 類別 | 冷載入首屏 | 捲到底 | 備註 |
|---|---|---|---|
| HTML | 1（986 KB） | 1 | 六篇 hero 藝術字已 `?raw` 內嵌（37 個 inline svg），這部分正確 |
| 字型切片 | **35**（2026-09-05 實測） | 同 | 1,315 個相異字元，命中 34/105 片 ＋ 1 片 Noto Sans |
| JS | 23 | 23 | 六篇 route chunk 全部 modulepreload |
| CSS | 13 | 13 | |
| SVG | 47（36 支不重複） | 54 | 六個 `*_hero_title.svg` 各 2–3 次、header menu 錨點各 2 次、logo 3 次 |
| mp4 | 5 | 16 | 兩支 UVid 先抓 `_pc.mp4` + pc poster（白抓 4 次）；9 支引言影片 `preload="metadata"` 捲到各發一次 |
| `_payload.json` | 4 | 4 | 同一個 URL 抓 3 次（六個 `/subpage#xxx` 連結各自 prefetch） |
| 點陣圖 | 23 | 53 | 只抓 mob 版，RWD 正確 |
| mp3 | 6 | 6 | |
| **打自家網域合計** | **約 230–270** | **約 280–320** | |

首屏就下載、但距離視窗 8,000–40,000 px 的 19 張點陣圖：六篇 hero 底圖 `loading="eager"`（6）、引言媒體 `i === 0` 一律 eager（4）、PhotoPanels 沒掛 lazy（9）。原生 lazy 在這一頁是有效的（28 張 lazy 只載 2 張）。

## 4. 正式站回應標頭（2026-09-04 實測）

```
Server: cloudflare
x-mhn: newmedia-wordpress
Cache-Control: public, max-age=300
cf-cache-status: EXPIRED   （_nuxt/entry.*.css）
```

hashed 資產只有 5 分鐘 TTL，且 edge 過期後回 origin。這是伺服器端要改的（`immutable` 一年 + Cloudflare cache rule），Nuxt 端無法設。

## 5. 目標

| 頁面 | 首屏打自家網域（基線，§2、§3） | 目標 | 實測（階段一、二完成後） |
|---|---|---|---|
| 首頁桌機 | 約 260–300 | 約 30 | **17** |
| 首頁捲到底 | 約 345–385 | 約 40 | **23** |
| subpage 手機首屏 | 約 230–270 | 約 35 | **66**（未達標，見下） |
| subpage 手機捲到底 | 約 280–320 | 未訂 | **128** |

首頁兩項達標（優於目標，且與階段一單獨量測時相同，無回歸）。subpage 首屏
**66 個未達 ≤35 的目標**——原因不是階段二沒做完，而是 **≤35 這個目標值是照 §3 的
盤點訂的，而 §3 漏算了文章內容素材**：§3 只盤點了六篇 hero 底圖、header／錨點素材與
nav 圖示，沒把六篇文章各自內文用到的 SVG 算進去。實測子頁首屏 27 支 SVG 拆解為兩類：
六篇的 hero 標題藝術字（news／visual／service／data／education／health 各一，共
**6 支**，錨點列要列出全部六篇故都會被抓）與文章內容素材（新聞篇 12、資料篇 6、
健康篇 2、視覺篇 1，共 **21 支**）。文章內容素材的 21 支**不在階段二任何 task 的
範圍內**；hero 標題的 6 支則是階段二評估過、已嘗試內嵌又撤回的部分（見 §7）。

這 21 支文章內容 SVG 列為**後續工作**，目前不在任何階段的範圍裡。最自然的做法是
比照 Task 7／8（夥伴 logo、論壇祝福藝術字）替每篇文章各做一支 sprite——sprite +
`<use>` 這套機制在階段一已驗證過兩次（見 §7 決策紀錄），沿用不必重新設計，
只是還沒排進任何 task。

分三階段交付，每階段結束都是可部署狀態：

1. **首頁（字型以外）**：Nuxt 內建多餘 request、SVG 內嵌 / sprite、夥伴 logo 真正 lazy、音效延後、hero 影片 SSR 不指定來源。
2. **子頁（字型以外）**：UVid SSR 不指定來源、連續閱讀頁只有第一篇 eager、影片近視窗才掛載、
   nav 圖示與錨點編號內嵌（hero title 內嵌**已嘗試並撤回**，見 §7「hero 標題不內嵌」）。
3. **字型**：依實際字集 subset、自架單一可變字型檔、拆掉 @nuxt/fonts 與 dedupe 外掛，再開 `inlineStyles`。

## 6. 不在範圍

- `app.cdnURL` 把 `_nuxt/`、`_fonts/` 搬到別的網域：需要另一個 host，屬部署決策。
- hydration mismatch（整棵頁面樹在載入約 1.4 s 時被重建）：與 429 無關，另開一題。
- 外部追蹤碼（GTM / comScore / rec.udn.com）。

## 7. 決策紀錄

- SVG **不**全部 inline 進 HTML：夥伴 logo 1.08 MB、論壇藝術字三斷點 1.61 MB，HTML 會從 528 KB 長到 3.5 MB。改用 sprite（每組 1 個 request）+ 小圖 data URI。
- 論壇藝術字 sprite 用 `<svg><use href="sprite.svg#id">`，斷點在 client 端用 matchMedia 決定、只抓一支 sprite。SSR 仍輸出同一組 class 讓行盒幾何不變（ScrollTrigger 量測依賴它），素材本身在掛載後補上；這些行都在摺線下 5,000 px 以外，看不到補上的瞬間。外部 `<use>` 需同源，四個部署目標的 `NUXT_PUBLIC_APP_ASSETS_PATH` 都與頁面同 host。
- 字型改用 Google Fonts 的可變字型（`NotoSansTC[wght].ttf`）subset 成單一 woff2、`font-weight: 300 500`：1 個 request 取代 105 個。字集來源＝`app/**/*.{vue,ts,json}` 掃出的 1,939 個 CJK／全形字元 + ASCII；common-components 沒有額外字元。字集以測試守住，文案新增字元時測試會失敗提醒重跑 subset。
- `experimental.emitRouteChunkError` 改 `manual` 並自寫 plugin：429 期間 chunk 失敗時延遲 3 秒、每個 session 最多 reload 一次，避免連鎖。
- **hero 標題不內嵌（Task 15，已嘗試並撤回）**：六篇文章的 hero 標題藝術字合計約 122 KB。
  承載這批內嵌表的模組被 `SubpageAnchor` / `SubpageAnchorBar` 匯入，而這兩個元件是 Nuxt
  全域自動匯入的元件；加上 `experimentalMinChunkSize` 的 chunk 合併，它們的相依會落在
  **首頁也會載入**的共用 chunk 裡。**決定 bundle 落點的是模組圖，不是「誰是消費端」**——
  「只有子頁用得到」不代表首頁的 bundle 不會載入它。
  實測（對照組，只切換 nuxt.config.ts）：首頁的 JS 請求數從 5 變 6；那 122 KB 的 chunk
  照樣被抓，因為它在首頁主 chunk 裡是**靜態 import**，拿掉 `<link rel=modulepreload>`
  只是少了預抓提示、切不斷 import 鏈，反而從並行預抓變成序列抓取。淨效果：首頁多背
  122 KB ＋ 1 個 request，換子頁少 6 個 request——方向與本計畫目標相反，故整個撤回。
  要重做的前提：真正的路由層 code splitting，或改用 sprite；但 CSS `mask` 對外部 SVG 的
  fragment 參照（`mask-image: url(sprite.svg#id)`）瀏覽器支援不一致，得先驗證才能用。
- **`experimentalMinChunkSize: 20_000` 的代價**：這個設定在階段一替首頁省下 8 個請求，
  應該留著；但它也是上面「hero 標題不內嵌」會撤回的成因之一——chunk 合併會把「只有
  子頁要用」的模組併進首頁也會載入的共用 chunk，讓子頁專屬的相依「搭便車」上首頁。
  階段三會動到 chunk（拆 @nuxt/fonts、改 `inlineStyles`），這個取捨要先寫下來，
  避免重新踩一次同樣的坑才想起來。
- **sprite 讓失敗集中**：sprite 把一組素材合成一個 request，代價是「全有全無」——
  一個 `partners.svg` 被擋掉會一次少 45 顆夥伴 logo，一個 `art-pc.svg` 被擋掉會少 40 行
  論壇／祝福藝術字（真正的文字內容是 `visually-hidden`，讀者看不到任何字）。
  這是正確的取捨（總請求數少很多，被 429 擋到的機率也低很多），但要記下來——
  sprite 素材比逐檔內嵌更值得被排進錯誤／可用性監控。

### 7.x 可變字型與 Noto Serif TC（2026-09-05）

**背景**：使用者裁示階段三（subset）暫緩 —— 文案會持續修改，subset 字集會跟著漂移。
改為執行兩項「不怕文案改」的優化。

**做了什麼**（`nuxt.config.ts` 的 `fonts.families`）：

1. `weights: [300, 400, 500]` → `weights: ['300 500']`（含空白的字串 ＝ 要 weight range）。
   unifont 的 `prepareWeights` 看到含空白、且該家族有 `wght` 軸，就轉成 Google css2 的
   `wght@300..500`，回傳 `font-weight: 300 500` 的可變 `@font-face`。
2. 新增 `{ name: 'Noto Serif TC', provider: 'none' }`。它來自 common-components 的 CSS，
   @nuxt/fonts 掃到 `font-family` 就自動去 Google 解析並注入 108 條 `@font-face` ＋ 下載
   108 支 woff2，但引用它的三個 class（`.nmd-header` / `.nmd-menu` / `.nmd-service-title`）
   在本站渲染出來的 HTML 裡一次都沒出現。

**實測結果 —— request 數完全沒變，這一項原本的預期是錯的：**

| | 舊設定 | 新設定 |
|---|---|---|
| 首頁首屏 request（字型） | 36 | **36** |
| 首頁首屏 request（總計） | 51 | **51** |
| 產物 CSS 總計 | 676,544 B | **350,506 B**（−48%） |
| `default.*.css`（每頁都載） | 516,339 B | **198,709 B**（−62%） |
| `@font-face` 宣告數 | 483 | **129** |
| `_fonts/` 檔數 | 227 | **119** |

**為什麼 request 沒變**：查產物 CSS 發現，舊設定下 Noto Sans TC 的 weight 300／400／500
**各自的 105 個 URL 完全相同**（實測共用檔案數 105/105）。也就是 @nuxt/fonts 本來就只下載
一份可變字型，只是把它宣告了三次。瀏覽器對同一個 URL 只發一次 request，所以三個靜態字重
從來沒有變成 3 倍。新舊兩次量測抓到的 36 支檔案**交集也是 36**（同一組檔）。

**所以真正的收穫是 bytes 不是次數**：CSS 少 326 KB（`default.css` 少 318 KB，那是每頁都要
下載、且會阻塞繪製的那支），部署產物少 108 支永遠用不到的 woff2。`_fonts/` 檔數 227→119
全部來自拿掉 Noto Serif TC，與可變字型無關。

**驗證**：`pnpm test` 1 failed / 929 passed（唯一紅燈是既存的 `viewport-height.spec.ts`）。
瀏覽器實測 300/400/500 三個字重的渲染寬度確實不同（1598.52 / 1627.76 / 1649.43 px），
可變軸正常作用；weight 700 夾到 500，與舊設定挑最近字重的行為一致。
全頁掃描 computed `font-family`，落在 serif 的元素數為 0 —— 確認拿掉 Noto Serif TC 安全。

**若日後要回頭砍字型 request**：36 → 1 只有 subset 一途，但不必自己寫 build 腳本 ——
unifont 的 google provider 支援 `experimental.glyphs`，會把字集丟給 Google css2 的
`&text=` 參數做伺服器端 subset，直接回傳單一切片。代價與自己 subset 相同：文案新增字元
就會缺字，需要對帳測試守住。

### 7.y 子頁 429：動線量測與第一波改善（2026-09-05）

**問題回報**：子頁也會 429，尤其「從首頁進入子頁」，連 CSS／JS 都可能被擋掉而跑版。

**量測方法**：手機 390×844，載入首頁 → 停留 → 點選單進 `/subpage#news`（<768 才會走
連續閱讀頁，見 `MediaList.vue` 的 `linkFor`）。伺服器端 log 帶時間戳，CSS 先去掉
`local()` 模擬未裝 Noto Sans TC 的一般訪客。

**改善前**：整趟 113 個 request（首頁 51 ＋ 子頁 62）。尖峰在**點進子頁那一刻，
1 秒內 62 個**，其中 12 支 JS ＋ 9 支 CSS 是渲染關鍵 —— 它們與 22 支 SVG、10 張 webp
擠在同一個 burst，限流器不會因為瀏覽器內部把 CSS 排前面就放行。回報的跑版由此而來。

**這一波做了兩件（#2、#3）：**

| # | 做法 | 子頁首屏省下 |
|---|---|---|
| 2 | 16 支內文素材 SVG 合成 `article.svg`（見 `app/utils/article-sprite.ts`） | 15 |
| 3 | `PhotoPanels` 加 IntersectionObserver 閘門，**只在 <768 開閘** | 9 |

#3 的斷點條件很重要：`PhotoPanels` 只在 ≥768 才 `pin + scrub`，而 `/subpage` 是 <768
專用 —— 也就是說在連續閱讀頁上它根本沒有水平軌道，原本「eager 防掉幀」（§7 的 R24）
的理由在那裡不成立。≥768 維持立即載入，行為與改動前完全相同。
開閘前渲染同比例（480/320）的佔位方塊，實測文件高度 55,157 px **前後不變**，
不會推走任何 ScrollTrigger pin。

**改善後（同一套量測）：**

| | 前 | 後 |
|---|---|---|
| 整趟動線 | 113 | **89** |
| 子頁階段 | 62 | **38** |
| 進子頁的 1 秒尖峰 | 62 | **30** |
| 子頁直接載入首屏 | 108 | **84** |
| 其中 SVG | 27 | **12** |
| 其中 webp | 10 | **1** |

**剩下的 38 個**：12 JS ＋ 9 CSS（見下方 #1）、8 字型、6 支 hero 標題藝術字、
1 支 sprite、news 篇的首圖與底圖各 1。

**#1（合併六篇文章的 chunk）實驗後暫緩。** 六篇 article 元件同時被 `pages/subpage.vue`
與六個桌機頁匯入，Rollup 因此把它們各自抽成共用 chunk（11 支小 chunk 合計只有 100 KB
卻占 11 個 request）。實測加上 `manualChunks` 之後：子頁 108 → 89、桌機 `/news` 69 → 63，
**但首頁的 JS+CSS 從 1,570 KB 漲到 2,140 KB** —— 命名 chunk 被
`experimentalMinChunkSize: 20_000` 吸收進一支所有頁面共用的大 chunk，首頁因此背了
六篇文章的程式碼（產物裡驗到 `AwardTimeline` / `AiImageQuiz` / `quiz_wrong`）。
把 `experimentalMinChunkSize` 設為 0 則首頁的小 chunk 又散開（9 → 20 支），兩個目標打架。
需要更精準的分組寫法，找到之前不做。**這與 §7「hero 標題不內嵌」是同一個機制。**

**#4（6 支 hero 標題）未做**：它們走 CSS `mask`（`SubpageAnchor.vue` 的錨點列），
不能用 sprite fragment。可行方向是把 data URI 寫進子頁 layout 的 SCSS（首頁不載那支
CSS，可繞開 §7 那個 bundle 落點的坑），但依 §7 的教訓要先實測再決定。
