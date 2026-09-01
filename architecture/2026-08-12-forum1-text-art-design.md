# 論壇一的展示型文字改用稿字形 SVG

論壇一的大標／副標／英文引言／日期地點／講者姓名，在設計稿上**全都是 outline 過的 vector**
（不是文字圖層）。目前的實作是把它們用 Noto Sans TC 反推字級重刻的
（`ForumEvent.vue` 檔頭與各處註解記著那套「由字面寬反推」的換算）。
這份文件定義**把它們換成稿匯出的 SVG 素材**的機制：真文字留在 DOM 給 SEO 與螢幕閱讀器，
畫面吃素材，且**版位與行距一個常數都不用重校**。

範圍：**論壇一的大標與副標，且只有 pc 斷點**。論壇二三四維持 Noto Sans TC，
論壇一的 pad／mob 也維持 Noto Sans TC —— 見第二節與第七節。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/types/forum.ts` | `ForumTextArtSrc` / `ForumTextArt` / `ForumLine` 型別 |
| `app/locales/section2.json` | 論壇一的逐行素材資料（真文字 ＋ 逐斷點素材） |
| `app/components/ui/UArtLine.vue` | 一行文字：有該斷點素材就畫 SVG，否則畫活文字（原 `02.forum/ForumArtLine.vue`，第二個 section 接上後改名搬家） |
| `app/components/02.forum/ForumEvent.vue` | 兩處 `v-for` 換元件；逐斷點的 `--art-base` |
| `public/img/forum/forum1-*-pc.svg` | pc 素材三份 |
| `test/forum-text-art.spec.ts` | 素材與 JSON 對帳 |
| `temp/measure-art-box.mjs` 等 | CDP 量測／截圖探針（見第八節） |

---

## 一、範圍：稿上哪些是 vector

用 `get_metadata` 逐一確認過（設計師只 outline **展示型文字**，小字留活文字）：

| Figma node | 內容 | 稿上型態 | 本次處理 |
| --- | --- | --- | --- |
| `2652:53130` | 大標 `Dr. Mario García 演講` ＋副標兩行 | 全 vector | **本批（僅 pc）** |
| `2652:52741` | 英文引言四行 | 全 vector（逐字） | 下一批 |
| `2652:54851` | `2026` / `09/09` ⊜ ／地點兩行／時間 | 全 vector | 下一批 |
| `2652:52823` | 講者姓名兩行 | vector（但**「講者介紹」是活文字**） | 下一批 |
| — | bio 五段、`論壇一` 標眉、`大師談媒體` | 活文字 | 不動 |

---

## 二、素材粒度：**逐行 × 逐斷點**，各一份

### 逐行

行距在三個斷點不是固定倍率：

| | pc | pad | mob |
| --- | --- | --- | --- |
| 副標 `font-size` / `line-height` | 50 / 63 | 43 / 51 | 32 / 41 |
| 倍率 | 1.260 | 1.186 | 1.281 |

把副標兩行合成一張 SVG 會把行距鎖成 pc 的 1.260，pad 會多出 3px。
逐行成檔則行距仍由 CSS 的 `line-height` 管，三斷點各自正確。

順帶的好處是 **DOM 結構完全不動** —— 現在就是 `<span v-for="line in event.title">`，一行一格。

### 逐斷點（⚠️ 這一點是後來修正的）

初版做成「一份 pc 素材、靠 `font-size` 等比縮放三個斷點」。**那是錯的** ——
三個斷點的稿是不同的 SVG，不是同一份的等比縮放。

實測數字（大標）：

| | pc | pad |
| --- | --- | --- |
| 稿的字面寬 | 709.285 | ？（無 node id） |
| Noto Sans 在該斷點字級的渲染寬 | 728.98（74px） | **531.97**（54px） |
| 等比縮放 pc 素材會畫出 | — | 517.58（＝709.285 × 54/74） |

逐斷點的字級（54 / 35）是照「Noto 的渲染寬去貼該斷點稿寬」反推的，
而 Noto 比稿字形寬約 2.8% —— 所以 pad 稿寬應該接近 531.97，等比縮放的 517.58
**會窄約 2.7%（14.4px）**。故素材必須逐斷點各匯一份。

沒有素材的斷點**退回活文字**，與改動前完全相同（實測 pad／mob 幾何與基準線 byte-identical）。

---

## 三、上色與標記：`<img>`，fill 已是 `#686868`

選 `<img src>`。Figma 匯出的 fill 本來就是 `#686868`（＝ `--color-gray`，`.sec2` 的文字色），
不需改色。

沿用 [`MediaTitle.vue`](../app/components/04.media/MediaTitle.vue) 已經在用的 pattern：
靜態 SVG 放 `public/img/<section>/`、`<img>` 帶 `width`/`height`、真文字留在 DOM。

### 為什麼不是另外兩個做法

**inline SVG（`currentColor`）** —— 顏色跟著 CSS、可逐字動畫，但路徑字串會塞進 JS bundle
（引言那組光是 82 個 `<path>`），且失去瀏覽器快取。論壇一這幾組文字恆為 `--color-gray`、
沒有換色也沒有逐字動畫的需求，換不到任何東西。

**`mask-image` ＋ `background: currentColor`** —— 多一層抽象換一個這裡不存在的需求。

⚠️ `test/design-tokens.spec.ts` 那支「不准別處寫死 token hex」的掃描，`SCAN_EXT` 只含
`.vue/.ts/.scss/.css`，**`.svg` 不在內** —— 素材裡的 `#686868` 不會誤判。

---

## 四、機制：行盒高度保留，素材絕對疊在裡面

這是整件事唯一有回歸風險的地方，先講它。

`.forum-event__title` 是設計線錨點（mob 的 `T1` 讀它的 `fraction` 0.2292），
`.forum-event__head` 的下緣是 `W3` / `Q3` 的錨點（見 `forum-node-path.ts`）。
**只要每行的行盒高度不變，那些 `dy` 一個都不用重校。**

`UArtLine.vue` 的每個斷點都套同一個 mixin（以 pc 為例展開）：

```scss
.u-art-line--art-pc {
  @include rwd-min('pc') {
    position: relative;
    display: block;
    width: calc(var(--art-w-pc) / var(--art-base) * 1em);

    // 零寬空格撐出一個正好 = line-height 的行盒。
    // ⚠️ 這一行是整套機制的支點。
    &::before { content: '\200B'; }

    // 真文字退場但留在無障礙樹與 SEO 裡
    .u-art-line__text { position: absolute; width: 1px; height: 1px; … }

    .u-art-line__art--pc {
      display: block; position: absolute; top: 50%; left: 0;
      width: 100%; height: auto; transform: translateY(-50%);
    }
  }
}
```

⚠️ **`.u-art-line__art` 這個元素已經不存在了。** 這一段記的是本批的 `<img>` 版；
後來為了「只抓當下斷點那一份」改成 `::after` 的 `background-image`（見第三節末的補記與
`UArtLine.vue`）。垂直置中與行盒的邏輯不變，只有承載素材的節點換了。

### ① 只有一份真文字，不做第二份 SR 複本

`.u-art-line__text` 恆存在：**有素材的斷點**把它變成 visually-hidden（仍在無障礙樹與 SEO 內），
**沒有素材的斷點**它就是畫面上的字。

若改成「一份 `visually-hidden` 複本 ＋ 一份可見文字」，在活文字斷點會有兩份相同文字，
螢幕閱讀器唸兩次。

### ② `::before` 的 ZWSP 只能在素材斷點內生效

活文字若也吃到那個零寬字元，它會連帶吃到 `letter-spacing`（大標 0.02em）→
整行往右位移約 1.5px。論壇二三四與論壇一的 pad／mob 會全部靜默偏掉。

### ③ 寬度掛在 span 上，而不是只掛在 `<img>` 上

`<img>` 是絕對定位、不進流排版。若寬度只掛在 img 上，行盒的 max-content 寬就只剩 ZWSP 的
那一點點 —— 而 `.forum-event__head` 在 pc 是**絕對定位、shrink-to-fit**，它的寬度由最寬的子項
決定，大標從 709 塌到近 0 會把 `__head` 一起帶塌。

第一批看不出來（大標副標都靠左），但這是**留給下一批的地雷**：英文引言在 pc 稿是
`text-align: right` 切齊右緣 1172，寬度一塌就整組跑掉。

### ④ 垂直靠置中，不引入逐行常數

現有的活文字是靠「行框頂 → 字面上緣 ＝ `line-height` ÷ 2 − 字面上緣（CJK 0.405em）」對稿的。
改成把素材在行盒內垂直置中，兩者差：

| | 行盒高 | 素材高 | 置中偏移 | 活文字偏移 | 差 |
| --- | --- | --- | --- | --- | --- |
| 大標（pc 74px） | 90.28 | 61.663 | 14.31（**實測 14.30**） | 15.17 | 0.87px |

不值得為 0.87px 引入一組逐行的垂直常數。

### ⑤ `--art-base` 逐斷點，恆等於同一區塊的 `font-size`

- `--art-base`：該組在**該斷點**的字級（大標 74 / 54 / 35，副標 50 / 43 / 32），
  掛在 `ForumEvent.vue` 的 `.forum-event__title` / `.forum-event__subtitle`，
  **每個 rwd 區塊都跟著它的 `font-size` 各寫一次**。
- `--art-w-<斷點>`：該行該斷點素材的 Figma 原生寬，由 `UArtLine` 用 inline style 掛在 **span** 上。

⚠️ 兩者都是**無單位的數字**（`--art-base: 74`，不是 `74px`）—— `calc()` 裡是
「無單位 ÷ 無單位 × 1em」，任一個帶了 `px` 整個算式就無效（`px / px * em` 不合法）。

⚠️ 初版把 `--art-base` 寫成三斷點共用 74、靠 `font-size` 帶縮放。改成逐斷點後
這個變數的語意變了：它不再是「pc 稿字級」，而是「本斷點字級」。

---

## 五、資料結構

```ts
/** 一個斷點的稿字形素材 */
export type ForumTextArtSrc = { src: string; w: number; h: number };

export type ForumTextArt = {
  /** 真文字。素材斷點下轉為 visually-hidden，其餘斷點就是畫面上的字 */
  text: string;
  /** 逐斷點的素材；沒填的斷點退回活文字 */
  art: Partial<Record<ForumBp, ForumTextArtSrc>>;
};

/** 一行文字：字串＝活文字，物件＝可能有素材 */
export type ForumLine = string | ForumTextArt;
```

`ForumBp`（`'pc' | 'pad' | 'mob'`）從 `~/utils/forum-path-events` 借過來，不另立一份 ——
斷點名稱只該有一個真值。

`title` / `subtitle` 的元素型別從 `string` **放寬**成 `ForumLine`，而不是新開一組欄位 ——
論壇二三四的 `string[]` 仍然合法，一個字都不用改。

⚠️ 放寬**跟著批次走**：本批只放寬 `title` / `subtitle`。`quoteEn` / `venue` 留到下一批。
提前放寬會讓 `{{ line }}` 型別上合法、runtime 印出 `[object Object]`。

⚠️ 日期組（`year` / `date` / `weekday`）是 scalar `string`，且 `date` 還會被
`split('/')` 拆成兩格 grid 子項、`weekday` 外面套 CSS 圓框 —— 那組要怎麼吃素材本文件不涵蓋。
→ 已在 [2026-08-13 的續篇](./2026-08-13-forum-date-text-art-design.md) 處理：
改成「一行一筆素材、圓框烤在素材裡」，那五個 grid 格子與圓框的 CSS 都移除了。

### JSON（`section2.json` 論壇一那筆）

```json
"title": [
  {
    "text": "Dr. Mario García 演講",
    "art": { "pc": { "src": "/img/forum/forum1-title-pc.svg", "w": 709.285, "h": 61.6624 } }
  }
]
```

真文字與素材綁在同一筆，兩者不會各自漂走。校稿的人看 `text`，與原本一樣。

### 元件

`app/components/ui/UArtLine.vue`（本批叫 `02.forum/ForumArtLine.vue`，2026-08-13 永續祝福
標題也接上這套機制之後改名搬到 `ui/` —— 名字不該騙人）。

⚠️ 刻意**不**叫 `ForumLine` / `ULine` —— 這個 codebase 裡「線」專指橘核心那條設計線，
會誤讀；而且型別已經叫 `ForumLine`，同名會與 Nuxt 自動註冊的元件相撞。

⚠️ 放在 `ui/` 的前提是 `nuxt.config.ts` 給 `~/components/ui` 設了 `pathPrefix: false`，
否則元件名會變成 `<UiUArtLine>`（那份設定的註解就是為 `UBtn` 記的）。

`alt=""` 而非 `alt="{{ text }}"`：真文字已經在 `.u-art-line__text` 裡。

⚠️ **加一個斷點要動兩處**：資料多填一筆，**且** `UArtLine.vue` 的對應 media 區塊要存在。
素材是那個斷點的 media query 內才被引用的背景圖，所以只填資料不補 CSS 的失敗方向是
「素材不顯示、活文字照常」，不是一張沒定位的圖壓在版面上。

---

## 六、素材

匯出用 Figma MCP 的 `download_assets`（`defaultFormat: 'svg'`），節點是稿上那三個 `Union`：

| 檔名 | Figma node | viewBox | pc 稿字級 |
| --- | --- | --- | --- |
| `forum1-title-pc.svg` | `2652:54831` | `0 0 709.285 61.6624` | 74 |
| `forum1-sub-1-pc.svg` | `2652:53149` | `0 0 401.58 39.6317` | 50 |
| `forum1-sub-2-pc.svg` | `2652:53159` | `0 0 394.085 39.8362` | 50 |

⚠️ 回應裡有兩個 URL，**要拿 `svgAssets` 那份，不是 `export`**。
`export` 是「帶背景與整頁 context」的渲染（710×62 外加一塊 `#515151` 底 ＋ 整頁的 `<g id="pc">`）；
`svgAssets` 才是乾淨的單一 `<path id="Union">`。

正規化只有一件事：拿掉 Figma 專用的 `preserveAspectRatio="none"` / `overflow="visible"` /
`style="display: block;"`，形狀對齊既有的 `public/img/media/*.svg`。
`viewBox` 與 `width` / `height` **保留不動**（讓瀏覽器預留空間、避免 CLS）。

檔名帶 `-pc` 後綴：pad／mob 素材進來時是 `-pad` / `-mob`。

---

## 七、已知取捨與待辦

### 字形不一致（已接受）

論壇一的 pc 改成稿字形後，同一頁的論壇二三四、以及論壇一自己的 pad／mob 仍是 Noto Sans TC。
這是刻意的分批：機制（型別、元件、命名、匯出流程、量測探針）做成可複用，素材到位就接上。

**後續已接上的批次**（都照第六節流程，此節其餘敘述以本表為準）：
論壇一 pad／mob（2026-08-25）、四場的日期大字（見
`architecture/2026-08-13-forum-date-text-art-design.md`）、
論壇二／四的講者姓名（2026-08-28，`forum2|4-name-<斷點>-1.svg`；
垂直位移的重推見 `ForumEvent.vue` 的 `.forum-event__speaker-name`）。

### 待辦：pad／mob 素材

需要 pad／mob 稿的 node id 才能匯出。到位後要做的事只有三件：
1. 匯出 `forum1-*-pad.svg` / `-mob.svg`（同第六節流程）。
2. `section2.json` 的 `art` 各多填一個 key。
3. 確認 `UArtLine.vue` 的 `--art-pad` / `--art-mob` 區塊（已備位）與
   `ForumEvent.vue` 的逐斷點 `--art-base`（已就位）無誤。

### 素材缺檔時的失敗方向

`<img>` 載不到就是一個空框，真文字仍在 DOM 裡（SEO 不受影響），行盒高度也仍由 ZWSP 撐著
（版位不跑）。**失敗方向是「字看不見」而不是「整段跑版」**，也就是說它在畫面上是靜默的 ——
第八節那支 spec 就是為了讓這種缺檔在 CI 爆掉。

---

## 八、驗收（實測結果）

量測用零依賴的 CDP 探針（Chrome ＋ Node 22 原生 `WebSocket`），不是 Playwright ——
這個環境沒裝，`npx playwright` 會現抓 150MB 瀏覽器。探針留在 `temp/`：
`measure-art-box.mjs`（固定選擇器的前後對照量尺）、`cdp-eval.mjs`（一次性查詢）、
`cdp-shot.mjs`（對稿截圖）。完整數字見 `temp/2026-08-12-forum1-text-art-驗收清單.md`。

| 項目 | 結果 |
| --- | --- |
| **行盒高度** | 三斷點 × `__title`／`__subtitle`／`__head` 的 `h` 與 `line-height` **與改動前完全相同** |
| **設計線** | `.forum-path__gen` 的 `d` 三斷點**逐字 byte-identical**（長度 1350／701／634） |
| pc 寬度 | `__title`／`__subtitle`／`__head` 由 728.98 → **709.28**（＝稿 709.285） |
| pad／mob 寬度 | 608 / 362 不變（那兩個斷點是 `static` block，寬度由容器決定） |
| pc 素材寬 | 709.28 / 401.58 / 394.08 —— 三行都等於稿的原生寬 |
| pc 垂直偏移 | `imgTopOffset` 14.30（推導值 14.31） |
| pad／mob | `img` 的 `display: none`、真文字可見（pad 大標 531.97、mob 344.80） |
| `--art-base` | pc 74/50/50、pad 54/43/43、mob 35/32/32 —— 逐斷點都讀到對的值 |
| SEO | `__title.textContent` ＝ `Dr. Mario García 演講`（三斷點皆同） |
| 無障礙 | `__head` 內非空 `alt` 的 `<img>` 數 ＝ **0**（真文字只唸一次） |
| 對稿 | 三斷點截圖對 `2652:53130`：pc 與稿一致；pad／mob 為 Noto（如預期） |
| 自動化 | `pnpm test` 全過 |

### pc 寬度變化為什麼動不到設計線

`forum-node-path.ts` 裡唯一綁元素寬度的 x 錨點是 `AGENDA_ARROW_X`（`.agenda__rows`）；
論壇一的節點 x 全部用容器比例或 `left`/`right`/`center` 關鍵字，y 來自
`top`／`bottom`／`fraction`（高度不變 ⇒ 下緣不變）。逐字相同的 `d` 是這個推論的實證。

### ⚠️ 量測踩過的坑（留給下一批）

1. **不要等 `Page.loadEventFired`** —— 首屏有 hero 的開場 mp4，load 事件會被拖住甚至等不到。
   改成輪詢選擇器／輪詢 `d` 非空。
2. **`build()` 掛在 GSAP 的 `refreshInit` 上**，`fonts.ready` 之後還要一段時間才寫入 `d`。
   固定 `sleep` 曾量到一次假的「pc 沒有線」（`hasGen: false`）—— 那是檔案剛改動、
   第一個請求撞上 Nuxt 重編。
3. **量測一定要等 `document.fonts.ready`** —— SSR 的 HTML 一到手選擇器就查得到，
   但字體沒落地時量到的是 fallback 字的寬。
4. **截圖三個坑**：`captureBeyondViewport: true` 會把 hero 的 `position: fixed` 層撐到整張圖
   （截出一片白）；`clip` 吃**頁面座標**不是視窗座標；`.sec2__path` 平常是 `opacity: 0`
   （等橘核心進場才淡入），headless 裡要強制打開祖先鏈上的 `opacity: 0`。
5. **基準線要在動手之前量。** 本次是用 `git stash` 暫時還原、量完立刻 `pop`。
   ⚠️ 那個 stash 會連同**工作區裡別人未提交的變更**一起收走 —— 範圍要縮到最小、pop 要立刻。
   後來改成只 `git checkout <commit> -- app/locales/section2.json`（單一自己的檔），更安全。
