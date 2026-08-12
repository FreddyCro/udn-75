# 論壇一的展示型文字改用稿字形 SVG

論壇一的大標／副標／英文引言／日期地點／講者姓名，在設計稿上**全都是 outline 過的 vector**
（不是文字圖層）。目前的實作是把它們用 Noto Sans TC 反推字級重刻的
（`ForumEvent.vue` 檔頭與各處註解記著那套「由字面寬反推」的換算）。
這份文件定義**把它們換成稿匯出的 SVG 素材**的機制：真文字留在 DOM 給 SEO 與螢幕閱讀器，
畫面吃素材，且**版位與行距一個常數都不用重校**。

範圍限定論壇一。論壇二三四維持 Noto Sans TC —— 同一頁四場字形不一致是已知且被接受的取捨
（見第七節）。

相關檔案：

| 檔案 | 角色 |
| --- | --- |
| `app/types/forum.ts` | `ForumTextArt` / `ForumArtLine` 型別 |
| `app/locales/section2.json` | 論壇一的逐行素材資料（真文字 ＋ 路徑 ＋ 原生尺寸） |
| `app/components/02.forum/ForumArtLine.vue` | 一行文字：字串走活文字、物件走 SVG 素材 |
| `app/components/02.forum/ForumEvent.vue` | 逐行 `v-for` 換成 `<ForumArtLine>`，SCSS 掛 `--art-base` |
| `public/img/forum/` | 素材檔 |
| `test/forum-text-art.spec.ts` | 素材存在性、`w`/`h` 對上 `viewBox` |

---

## 一、範圍：稿上哪些是 vector

用 `get_metadata` 逐一確認過（設計師只 outline **展示型文字**，小字留活文字）：

| Figma node | 內容 | 稿上型態 | 本次處理 |
| --- | --- | --- | --- |
| `2652:53130` | 大標 `Dr. Mario García 演講` ＋副標兩行 | 全 vector | **第一批** |
| `2652:52741` | 英文引言四行 | 全 vector（逐字） | 第二批 |
| `2652:54851` | `2026` / `09/09` ⊜ ／地點兩行／時間 | 全 vector | 第二批 |
| `2652:52823` | 講者姓名兩行 | vector（但**「講者介紹」是活文字**） | 第二批 |
| — | bio 五段、`論壇一` 標眉、`大師談媒體` | 活文字 | 不動 |

第一批只做 `2652:53130`（大標＋副標），驗過實際效果再決定其餘三組。

---

## 二、素材粒度：**每「行」一份**，不是每組一份

因為**行距在三個斷點不是固定倍率**：

| | pc | pad | mob |
| --- | --- | --- | --- |
| 副標 `font-size` / `line-height` | 50 / 63 | 43 / 51 | 32 / 41 |
| 倍率 | 1.260 | 1.186 | 1.281 |

把副標兩行合成一張 SVG 會把行距鎖成 pc 的 1.260，pad 會多出 3px、mob 少 0.7px。
逐行成檔則行距仍由 CSS 的 `line-height` 管，三斷點各自正確。

順帶的好處是 **DOM 結構完全不動** —— 現在就是 `<span v-for="line in event.title">`，
一行一格，與逐行素材一對一。

---

## 三、上色與標記：`<img>`，fill 烤死

選 `<img src>`，fill 統一正規化成 `#686868`（＝ `--color-gray`，`.sec2` 的文字色）。

沿用 [`MediaTitle.vue`](../app/components/04.media/MediaTitle.vue) 已經在用的 pattern：
靜態 SVG 放 `public/img/<section>/`、`<img>` 帶 `width`/`height`、SEO 靠 `.visually-hidden`
（helper 在 `base.scss:155`）。

### 為什麼不是另外兩個做法

**inline SVG（`currentColor`）** —— 顏色跟著 CSS、可逐字動畫，但路徑字串會塞進 JS bundle
（引言那組光是 82 個 `<path>`），且失去瀏覽器快取。論壇一這幾組文字恆為 `--color-gray`、
沒有換色也沒有逐字動畫的需求，換不到任何東西。

**`mask-image` ＋ `background: currentColor`** —— 顏色回到 CSS 手上、仍是外部檔，
但多一層抽象換一個這裡不存在的需求。

⚠️ `test/design-tokens.spec.ts` 那支「不准別處寫死 token hex」的掃描，`SCAN_EXT` 只含
`.vue/.ts/.scss/.css`，**`.svg` 不在內** —— 素材裡出現 `#686868` 不會誤判。

---

## 四、機制：行盒高度保留，素材絕對疊在裡面

這是整件事唯一有回歸風險的地方，先講它。

`.forum-event__title` 是設計線錨點（mob 的 `T1` 讀它的 `fraction` 0.2292），
`.forum-event__head` 的下緣是 `W3` / `Q3` 的錨點（見 `forum-node-path.ts`）。
**只要每行的行盒高度不變，那些 `dy` 一個都不用重校。**

```scss
// 素材模式（modifier）。活文字模式（.forum-art-line 本體）不加任何規則 ——
// 論壇二三四要跟改動前**完全一樣**。
.forum-art-line--art {
  position: relative;
  display: block;
  // 行盒寬度也要對 —— 見下方「② 為什麼寬度掛在 span 上」
  width: calc(var(--art-w) / var(--art-base) * 1em);

  // 零寬空格撐出一個正好 = line-height 的行盒。
  // ⚠️ 這一行是整套機制的支點：少了它，行盒塌成 0，
  //    .forum-event__title 的高度變成 0，W3／Q3／T1 全部偏掉。
  &::before {
    content: '\200B';
  }
}

.forum-art-line__art {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%; // ＝ span 的寬，算式只寫一次
  height: auto;
  transform: translateY(-50%);
}
```

⚠️ `::before` **只能掛在 modifier 上，不能掛在 `.forum-art-line` 本體**。活文字模式若也吃到
ZWSP，它會連帶吃到 `letter-spacing`（大標 0.02em）→ 文字整行往右位移約 1.5px。
論壇二三四全部靜默偏掉，而且是「看起來沒事」的那種偏。

### ① 垂直靠置中，不引入逐行常數

現有的活文字是靠「行框頂 → 字面上緣 ＝ `line-height` ÷ 2 − 字面上緣（CJK 0.405em）」
對稿的（`ForumEvent.vue` 檔頭那段換算）。改成把素材在行盒內垂直置中，兩者差：

| | 行盒高 | 素材高 | 置中偏移 | 活文字偏移 | 差 |
| --- | --- | --- | --- | --- | --- |
| 大標（pc 74px） | 90.28 | 61.663 | 14.31 | 15.17 | **0.86px** |

不值得為 0.86px 引入一組逐行的垂直常數。

### ② 為什麼寬度掛在 span 上，而不是只掛在 `<img>` 上

`<img>` 是絕對定位、不進流排版。若寬度只掛在 img 上，行盒的 max-content 寬就只剩 ZWSP 的
那一點點 —— 而 `.forum-event__head` 在 pc 是**絕對定位、shrink-to-fit**，它的寬度由最寬的子項
決定。大標從 709 塌到近 0，`__head` 的寬度會跟著從 709 掉到標眉那一行的寬度。

第一批看不出來（大標副標都靠左），但這是**留給第二批的地雷**：英文引言在 pc 稿是
`text-align: right` 切齊右緣 1172，寬度一塌就整組跑掉。所以寬度從一開始就掛在 span 上，
img 吃 `width: 100%`。

### ③ `font-size` 一個旋鈕同時管行高與素材寬

- `--art-base`：該組在 **pc 稿**的字級（大標 74、副標 50），掛在 `.forum-event__title` /
  `.forum-event__subtitle` 上（大標的 74 只在 `--quote` 版式底下，故要寫在該層）。
- `--art-w`：該行素材的 Figma 原生寬，由 `ForumArtLine` 用 inline style 掛在 **span** 上。

⚠️ 兩者都是**無單位的數字**（`--art-base: 74`，不是 `74px`）—— `calc()` 裡是
「無單位 ÷ 無單位 × 1em」，任一個帶了 `px` 整個算式就無效（`px / px * em` 不合法）。

pc 時 `1em = 74px` → 寬度算出 709.285px（＝稿）。pad 的 `font-size: 54px` 一改，
寬度自動變 54/74 倍，`line-height` 也自動跟著 1.22 倍率走。
**不用新增任何逐斷點常數**，現有 SCSS 那組 74 / 54 / 35 原封不動繼續用。

CSS 變數會穿過元件邊界繼承，所以 `--art-base` 掛在父層、`--art-w` 掛在子層的 `<img>`，
兩者在同一個 `calc()` 裡相遇，不需要 prop 傳遞。

### ④ 為什麼高度在數學上不可能變

`font-size` 與 `line-height` 一個都沒動；ZWSP 產生的行盒高度恆等於 `line-height`；
`<img>` 與 `.visually-hidden` 都是絕對定位、不進流排版。

⚠️ 但仍要實際量一次 `getBoundingClientRect()` 前後對照，不靠推論結案 ——
`forum-node-path.md` 記著的每一次跑版都是「推論說不會動」開頭的。

---

## 五、資料結構

### 型別（`app/types/forum.ts`）

```ts
/** 稿上 outline 過的展示型文字：畫面用 SVG 素材，真文字留給 SR / SEO */
export type ForumTextArt = {
  /** 真文字。同時餵給 .visually-hidden 與工程對稿 */
  text: string;
  /** SVG 路徑（public 下） */
  art: string;
  /** 素材在 Figma 的原生寬高，用來算 em 寬並讓瀏覽器預留空間 */
  w: number;
  h: number;
};

/** 一行文字：字串＝活文字（論壇二三四維持原樣），物件＝SVG 素材 */
export type ForumLine = string | ForumTextArt;
```

⚠️ 型別叫 `ForumLine`、元件叫 `ForumArtLine`，**刻意不同名** —— 同名的話
`ForumArtLine.vue` 內部要 `import type { ForumArtLine }`，會與 Nuxt 自動註冊的同名元件相撞。

`title` / `subtitle` / `quoteEn` / `venue` 的元素型別從 `string` **放寬**成 `ForumLine`，
而不是新開一組欄位 —— 論壇二三四的 `string[]` 仍然合法，一個字都不用改。

⚠️ 放寬**跟著批次走**：第一批只放寬 `title` / `subtitle`（＝這批真的會接上 `<ForumArtLine>`
的兩個欄位），`quoteEn` / `venue` 留到第二批。提前放寬會讓 `{{ line }}`
在型別上合法、runtime 卻印出 `[object Object]` —— 型別擋不到的靜默失敗。

⚠️ 這個放寬只覆蓋**陣列型**的欄位。日期組（`year` / `date` / `weekday` / `time`）是
scalar `string`，且 `date` 還會被 `split('/')` 拆成兩格 grid 子項、`weekday` 外面套 CSS 圓框
—— 那組要怎麼吃素材**本文件不涵蓋**，留到第二批單獨設計。

### JSON（`section2.json` 論壇一那筆）

```json
"title": [
  { "text": "Dr. Mario García 演講", "art": "/img/forum/forum1-title.svg", "w": 709.285, "h": 61.663 }
],
"subtitle": [
  { "text": "手機與AI如何改變", "art": "/img/forum/forum1-sub-1.svg", "w": 401.58, "h": 39.633 },
  { "text": "我們說故事的方式", "art": "/img/forum/forum1-sub-2.svg", "w": 394.084, "h": 39.836 }
]
```

真文字與素材綁在同一筆，兩者不會各自漂走。校稿的人看 `text`，與原本一樣。

### 元件（`app/components/02.forum/ForumArtLine.vue`）

```
props: { line: ForumLine }

根一律是 <span class="forum-art-line">，素材模式再加 --art modifier 與 --art-w。

line 是 string → 直接輸出文字（等同現在的行為）
line 是物件    → <span class="visually-hidden">{{ text }}</span>
                 ＋ <img class="forum-art-line__art" :src="art" :width="w" :height="h" alt="">
```

⚠️ 刻意**不**叫 `ForumLine` —— 這個 codebase 裡「線」專指橘核心那條設計線，會誤讀。

`alt=""` 而非 `alt="{{ text }}"`：真文字已經在 `.visually-hidden` 裡，重複會讓螢幕閱讀器唸兩次。

第一批只換 `ForumEvent.vue` 的**兩處** `<span v-for>`（title / subtitle）；
引言那處留到第二批。template 的形狀不變。

---

## 六、素材

匯出用 Figma MCP 的 `download_assets`（`defaultFormat: 'svg'`），節點就是稿上那三個 `Union`：

| 檔名 | Figma node | 原生尺寸 | pc 稿字級 | `--art-w` / `--art-base` |
| --- | --- | --- | --- | --- |
| `forum1-title.svg` | `2652:54831` | 709.285 × 61.663 | 74 | 9.5849em |
| `forum1-sub-1.svg` | `2652:53149` | 401.580 × 39.633 | 50 | 8.0316em |
| `forum1-sub-2.svg` | `2652:53159` | 394.084 × 39.836 | 50 | 7.8817em |

副標 8 字 × 50px ≈ 408 對上量到的 401.58 —— **反向印證現有 SCSS 那個 50px 沒抄錯**，
可以放心讓素材寬度以它為基準。

匯出後的正規化：

1. fill 統一改成 `#686868`。
2. `viewBox` 與 `width` / `height` 屬性**保留不動** —— 讓瀏覽器能預留空間、避免 CLS。

放 `public/img/forum/`（新目錄；`public/img/media/` 是同構的先例）。

---

## 七、已知取捨與開放風險

### 字形不一致（已接受）

論壇一改成稿字形後，同一頁的論壇二三四仍是 Noto Sans TC。這次刻意只做論壇一 ——
機制（型別、元件、命名、匯出流程）做成可複用，其餘三場之後要跟進時直接接上。

### pad／mob 稿是否等比（開放）

本設計假設 pad／mob 稿的大標是 pc 稿的等比縮放，故 `--art-w` / `--art-base` **一組值走三個斷點**。

旁證：現有 SCSS 的 pad 54 / mob 35 是設計師從 pad／mob 稿的字面寬反推的，
字串相同的話寬度必然成等比。但**沒有直接核對** —— 手上沒有 pad／mob 稿的 node id。

退路：若量出來不成等比，為該斷點覆寫 `--art-base`（一行 CSS），不影響架構。

### 素材缺檔時的失敗方向

`<img>` 載不到就是一個空框，`.visually-hidden` 的真文字仍在 DOM 裡（SEO 不受影響），
行盒高度也仍由 ZWSP 撐著（版位不跑）。**失敗方向是「字看不見」而不是「整段跑版」。**
第八節那支 spec 就是為了讓這種缺檔在 CI 爆掉，而不是上線後靜默消失。

---

## 八、驗收計畫

### 自動化

`test/forum-text-art.spec.ts` —— 走訪 `section2.json` 裡所有 `ForumTextArt`：

- `art` 指到的檔案真的存在於 `public/`
- `w` / `h` 與 SVG 的 `viewBox` 一致（容差 0.01）
- `text` 非空

現有 `test/` 全是純函式 spec，沒有元件測試，這次不破例 —— CSS 幾何那半由下面的人工驗收。

### 人工

| 項目 | 方法 | 通過條件 |
| --- | --- | --- |
| 行盒高度不變 | 改動前後各量一次 `.forum-event__title` / `__subtitle` / `__head` 的 `getBoundingClientRect()` | 三斷點皆完全相同 |
| 設計線沒偏 | `?pathdebug` 上色，pc / pad / mob 各看一次 | 論壇一的 `W3` / `Q3`（`__head` 下緣）與 `T1`（`__title` fraction）位置不變 |
| 對稿 | 三斷點與 Figma 截圖疊比 | 字形、字寬、行距、版位一致 |
| SEO / 無障礙 | 檢查 `<h3>` 內的 `.visually-hidden` 文字 | 真文字在 DOM 內、只出現一次（`alt=""` 沒重複） |

---

## 九、實作順序

1. **型別 ＋ 元件 ＋ 接線**：`ForumTextArt` / `ForumArtLine`、`ForumArtLine.vue`、
   `ForumEvent.vue` 的 title / subtitle 兩處 `v-for` 換掉、SCSS 掛 `--art-base`。
   此時 JSON 還是字串 → **畫面應該完全沒有變化**（走 `string` 分支）。
2. **匯出素材**：三個 `Union` → SVG → fill 正規化 → `public/img/forum/`。
3. **JSON 換成物件**：這一步畫面才真的變。
4. **驗收**（第八節）。
5. **補 spec**。
6. **停手回報** —— 看過大標這組的實際效果，再決定引言／日期／講者姓名要不要照樣做下去。

⚠️ 第 1 步與第 3 步刻意分開：第 1 步結束時畫面必須零變化，
這樣萬一第 3 步之後跑版，可以立刻判定是素材／尺寸的問題，不是接線的問題。
