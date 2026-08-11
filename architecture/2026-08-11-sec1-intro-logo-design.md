# Section 1 引言（`sec1__scene`）對齊設計稿 ＋ 段末 logo — 設計稿

日期：2026-08-11
狀態：**待實作**
相關檔案：`app/components/01.hero/Hero.vue`、`app/components/01.hero/Hero.scss`、`app/locales/section1.json`
設計稿：Figma mob `3104:84993`／pad `3104:84900`／pc `3104:84714`（檔案 `Rv5FZniHD1NErLTtsPSSm8`）
影響文件：`architecture/PRD.md`、`architecture/viewport-height.md`（兩處都寫著淡出 trigger 是 `p.sec1__intro-body`）

引言段落照設計稿改成三段、段末補上聯合報系 logo，並把 `sec1__scene` 一組的欄寬／留白對齊三份稿。

---

## 一、與現況的差異

三份稿量測後，`sec1__scene` 有三項與現況不同：

1. **引言是三段，不是一整塊。** `section1.json` 的 `intro.body` 是單一字串，段落界線只用半形空格 ——
   渲染出來是連續的一大塊。稿子是三段、段間空一個行高。
2. **段末有 logo。** 162×48 置中，位於引言文字下方。現況沒有。
3. **pad 欄寬 530px。** 現況 `intro-body` 的 `max-width: 630px` 在 pad（768–1279）會撐到 630，
   比稿子寬 100px。

字級三稿一致，不需要動：以「行數 × 行高」回推稿子的文字區塊高度可驗證 —— pc 8 行 × 36 ＋ 2 × 36 ＝ 360 ✓、
pad 10 行 ＝ 432 ✓、mob 14 行 ＝ 576 ✓，全部落在既有的 18px / line-height 36px 上。
段間距因此就是**一個行高 36px**。

## 二、文案（`app/locales/section1.json`）

`intro.body` 由字串改成三元素陣列，拆點即現有字串裡那兩個半形空格（`從未動搖。 站在`、`的期盼。 這不只是`）。
新增 `intro.logoAlt` 供 logo 的替代文字，維持「元件不綁文案」的慣例（見 CLAUDE.md 文案外部化）。

```json
"intro": {
  "body": [
    "一九五一年，聯合報在台灣扎根，…，從未動搖。",
    "站在七十五周年的歷史節點，…對這片土地的期盼。",
    "這不只是一場慶典，…共書下一個七十五年的璀璨篇章。"
  ],
  "logoAlt": "聯合報系 United Daily News Group"
}
```

`intro.body` 目前只有 `Hero.vue` 一個消費端（`SymbolIntro.vue`、`HeroVideo.vue`、`HeroStart.vue`、
`pages/demo.vue` 讀的是同一份 JSON 的其他鍵），改型別不會波及他處。

## 三、DOM 結構（`Hero.vue`）

```html
<div ref="introRef" class="sec1__intro" :style="{ opacity: introOpacity, '--intro-runway': introRunway }">
  <div ref="introBodyRef" class="sec1__intro-body">
    <p v-for="(p, i) in str.intro.body" :key="i" class="sec1__intro-p">{{ p }}</p>
    <div class="sec1__intro-logo">
      <UPic
        src="/img/logo"
        ext="png"
        :use-prefix="false"
        :use2x="false"
        :webp="false"
        :width="162"
        :height="48"
        loading="eager"
        :alt="str.intro.logoAlt"
      />
    </div>
  </div>
</div>
```

### `introBodyRef` 從 `<p>` 移到外層 group

`introBodyRef` 是引言淡出那條 ScrollTrigger 的 trigger（`start: 'bottom center'`）。它改掛在
**包住「三段文字 ＋ logo」的 `<div>`** 上，於是淡出起點的語意從「文字底緣升到視窗中央」變成
**「整組內容底緣升到視窗中央」** —— 仍然是既有註解寫的那件事：*方塊剛穿出內容的最後一個元素*。

視覺後果：橘方塊會**從 logo 後方穿過**（`.sec1__scene` 在 `z-index: 3`、`OrangeCore` 在 2，
本來就是這個層序，不需另設 z-index），穿出 logo 底緣後整組才開始淡出。這是刻意的選擇。

### 捲動幾何不用改

`--intro-runway`（`padding-bottom`）與 transition pin 的 `start: 'bottom bottom'` 都掛在**外層
`introRef`**，不動。runway ＝「內容底緣 → 視窗中央」的 50vh ＋ 淡出窗口，把 logo 併入「內容」
之後這條數學依然成立 —— `orange-core-config` 的 `INTRO_FADE_VH` / `TRANSITION_VH` 與
`OrangeCorePath` 的 `endTrigger` 一行都不必改。

### logo 用 `UPic`，外面再包一層 `div`

走 `UPic` 的「單檔圖」用法（該元件註解的案例 3）：`ext="png"`、`:use-prefix="false"`、
`:use2x="false"`、`:webp="false"`。理由是 `src` 由元件內部前綴 `APP_ASSETS_PATH`，
部署到子路徑／CDN 時不會 404；`width`/`height` 一併給，避免 CLS。
`loading="eager"`（案例 5）：logo 落在第一屏的捲動範圍內，預設的 lazy 會讓它在橘方塊
經過的那一刻才冒出來。

**為什麼不把 `classname` 直接給 `UPic`**：`UPic` 的 `classname` 綁在**內層 `<img>`** 上
（見 `UPic.vue` template 的 `:class="classname || ''"`），而 `Hero.scss` 是 `scoped` ——
Vue 的 scoped CSS 只會把 scope id 蓋在子元件的**根**元素（`<picture>`）上，選不到內層
`<img>`，`.sec1__intro-logo` 那條規則會整條失效。包一層自家的 `div` 後，尺寸與間距寫在
自己的 BEM element 上，既不必動用 `:deep()`，也不必為了樣式去改 `UPic`。

尺寸傳遞：`UPic` 的全域規則 `.u-pic-img { width: 100%; height: auto }` 讓 `<img>` 撐滿容器，
故**寬度由 `.sec1__intro-logo` 的 `width: 162px` 決定**，高度由 `width`/`height` 屬性的
長寬比推出 48px。容器另加 `line-height: 0` 收掉 inline `<picture>` 的行框餘隙 ——
否則 group 底緣會多出幾 px，連帶把引言淡出的起點往下推。

## 四、樣式（`app/components/01.hero/Hero.scss`）

| element | mob（基底，≤767） | pad `rwd-min('tablet')` | pc `rwd-min('pc')` |
|---|---|---|---|
| `&__scene` `padding-inline` | 26px（現 20px） | 56px | — |
| `&__intro` `padding-top` | `clamp(360px, #{vh(0.78)}, 560px)` | 100px | — |
| `&__intro-body` `max-width` | 無（撐滿 ＝ 362px @414） | 530px | 630px |
| `&__intro-p` | 18px / 36px、`var(--color-gray)`、weight 300、`text-align: justify` | — | — |
| `&__intro-p + &__intro-p` `margin-top` | 36px | — | — |
| `&__intro-logo` | `width: 162px`；`margin: 64px auto 0`；`line-height: 0` | `margin-top: 80px` | — |

`intro-body` 保留 `margin: 0 auto`；`intro-p` 不再自帶 `max-width`／`margin: 0 auto`（欄寬統一由
外層 group 決定，才不會與 logo 的置中基準脫鉤）。

### 順手改成 mobile-first

現行 `Hero.scss` 把 mob 規則放在檔尾一個獨立的 `@media screen and (max-width: 767.98px)` 區塊，
違反 CLAUDE.md SCSS 規則 2（RWD 寫在 BEM element 內部、同一 class 只定義一次）。本次動到的
正是那個區塊裡的兩個 class（`.sec1__scene`、`.sec1__intro`），故一併收乾淨：

- 檔尾該 `@media` 區塊整塊移除。
- `&__scene` / `&__intro` 改為 mobile-first 基底 ＋ 內部 `@include rwd-min('tablet')` 覆蓋。

`.loader-fade-*` 兩條 transition 規則不在 `.sec1` 之下、與斷點無關，留在原位不動。

BEM 皆為單層 element ＋ 連字號延伸（`intro-body` / `intro-p` / `intro-logo`），符合規則 3。

## 五、附帶要更新的文件

`introBodyRef` 的宿主元素從 `<p>` 變成 `<div>` group、量測對象從「文字」變成「文字 ＋ logo」，
以下敘述會失準，要一併跟上：

- `architecture/viewport-height.md` 第 24 行：表格內的 `p.sec1__intro-body` 改為
  `div.sec1__intro-body`。
- `architecture/PRD.md` 第 101 行（四條捲動軌表格下方的引述）：`trigger: .sec1__intro-body`
  仍成立，但「文字底緣升到視窗中央 ＝ core 剛穿出最後一行」要改為「內容 group 底緣 ＝
  剛穿出最後一個元素」。
- `architecture/PRD.md` 第 148 行（Section 1 的 ⑤）：「穿出最後一行後引言才開始淡出」
  改為「穿出段末 logo 後」。
- `app/components/01.hero/Hero.vue` 第 158–160 行與第 440 行的註解：同上，「文字底緣」／
  「最後一行」的措辭改為「內容 group 底緣」／「最後一個元素」。

`app/utils/orange-core-config.ts`（第 23、28 行）與 `OrangeCorePath.vue`（第 13 行）的註解也
提到「文字底緣」／「穿出文字」。那兩處講的是 runway 與終點的**數學**（內容底緣 − 50vh），
語意未變、值也未變，本次不動，避免把一次排版調整擴散成跨檔註解重寫。

## 六、不做的事

- **不補 `logo@2x.png` / svg。** `public/img/logo.png` 實測 162×48、只有 1x，retina 上會偏軟。
  本次照指定的 png 實作；日後拿到 2x 或 svg，把 `:use2x` 打開（或改 `ext="svg"`）即一行的差別。
- **不動 `padding-top` 的量值。** 引言的垂直落點由捲動動畫決定，稿上的 y 座標是靜態示意，
  現行 `clamp(360px, 78vh, 560px)` / `100px` 已在用，只調整其書寫位置（mobile-first）。
- **不動 `INTRO_FADE_VH` / `TRANSITION_VH` / `OrangeCorePath`。** 見第三節「捲動幾何不用改」。
- **不動 `.sec1__intro` 的 opacity 驅動方式。** 仍由 `Hero.vue` 寫 inline style，logo 因為在
  `introRef` 之內，自然跟著整段一起淡出。
