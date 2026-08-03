# 產品需求文件 PRD v2 — 聯合七五・智慧未來

> 依 2026-08 新設計稿（Figma `主頁_pc` node `2065:138483`）重寫的版本。
> 舊版見 [PRD.md](PRD.md)；本檔只描述**變更後**的首頁敘事與對應的程式處置。
>
> **範圍限制**：本檔依據 `主頁_pc`（1280 寬）分鏡撰寫。mob / pad 分鏡尚未比對。

---

## 核心概念：橘核心貫穿全頁

舊版的橘核心（26px 橘方塊）是 Hero 專屬、終點在大型日期「09/16」的斜槓。
新稿把它升級為**貫穿四個 section 的主角**：影片 → 引言 → 符號人臉 → 四場論壇 → 撐滿成永續祝福的橘底 → 收回成「智慧『心』媒體」的引號。

---

## 捲動分鏡（主頁_pc）

| #   | Figma frame                        | 畫面                                                                   | 核心（橘方塊）做什麼                                     |
| --- | ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| 0   | 影片結尾 `2065:138488`             | **這一格是 hero 影片本身的最後一段**，非另做的靜態畫面：左右藍/橘像素格柱、標題「聯合七五・智慧未來」、藍色階梯線、播放 icon、提示下滑 | 藍線下折成階梯、橘核心從階梯掉出——**都在影片裡**。DOM 端只負責接棒 |
| 1   | 引言 `2065:139397`                 | 白底，26px 橘方塊置中在文前 ＋ 三段引言                                | 核心於此**接手成 DOM 元素**，垂直**穿透引言文字**後停在視窗中央，接著上下拉長 → 左右展開成滿版（見下方 01.hero 詳規） |
| 2   | 智慧論壇05 `2065:139729`           | 黑底 coding 符號雨（`coding 特效` 1800×875 出血層）＋ 三行內文          | disperse                                                 |
| 3   | 智慧論壇06 `2065:139732`           | 半調點陣人臉（`ai face3 code負片`）＋ 圓形游標提示「游標移動 探尋隱藏的心聲」 | face，滑鼠互動                                           |
| 4   | 智慧論壇07 `2065:139741`           | 符號字元人臉崩解旋渦 ＋ 橘字彩蛋「AI真假難辨／我們還能相信誰？」       | 崩解 ＋ 文字彩蛋                                         |
| 5   | 智慧論壇08 `2065:139745`           | 人臉裂成四片向中心收攏 → 中央 16px **白**方塊                          | converge → 白核心                                        |
| 6   | 論壇 `2652:52648`（8743 高）       | 白底 ＋ 橘色曲線 `path1`/`path2` 貫穿論壇一~四、沿途漂浮 cube 方塊     | 白核心→橘核心，沿 path 往下拖出四場論壇；**經過日期時就是那個「/」** |
| 7   | 活動回顧 `2076:79563`              | 精彩活動回顧 4 則圖文                                                  | —                                                        |
| 8   | 永續祝福01–03                      | 滿版**橘底** ＋ 白色像素臉（三格表情變化）＋ 標題說明                  | 核心撐滿全屏＝橘底（🚧 中間張未提供，待確認）            |
| 9   | 永續祝福04 `2065:140521`           | 橘底 ＋ 白色像素階梯線 ＋ 夥伴祝福清單（策略／共創夥伴，內捲動）       | 階梯線＝同一條線的回聲                                   |
| 10  | 智慧心媒體01–02                    | 橘塊（900×720）縮小 → 白底中央細橘豎條（24×180）                       | 橘底收回成核心                                           |
| 11  | 智慧心媒體03–04                    | 智慧 ● 媒體 → 智慧**「心」**媒體（橘色引號）                            | 核心點展開成「心」的引號                                 |
| 12  | 智慧心媒體_錨點 `2524:82034`       | 標題 ＋ 說明 ＋ 像素圖 ＋ 01–06 子頁錨點列                             | —                                                        |
| 13  | footer/pc `2542:126041`            | —                                                                      | —                                                        |

四場論壇（原本是單日上午／下午時間軸）：

| 場次   | 主題                      | 日期      | 地點                     | 內容             |
| ------ | ------------------------- | --------- | ------------------------ | ---------------- |
| 論壇一 | 大師談媒體 Dr. Mario García 演講 | 2026/09/09 | 台北漢來大飯店 3F 鉑金C廳 | 講者介紹長文     |
| 論壇二 | 台積電・跨世代共問 AI時代共答 | 2026/09/15 | 台大集思會館蘇格拉底廳   | 立即報名 ＋ 雙講者 |
| 論壇三 | AI永續・AI時代永續未來共識 | 2026/09/18 | 台大集思會館蘇格拉底廳   | **完整 timetable** ＋ 下載議程 ＋ 報名 |
| 論壇四 | 台積電文教基金會・青年永續築夢論壇 | 2026/09/30 | 成功大學國際會議中心     | 立即報名 ＋ 雙講者 |

---

## 01.hero 詳規：core 穿透引言 → 轉場到 SymbolFace

設計稿分鏡：`2065:143082`（section「引言轉場論壇」）。設計標註為**「綁滾動」＝ 全程 scrub**，非定時動畫。Header 在整段轉場中皆可見。

| 拍  | Figma frame  | 畫面                                                          |
| --- | ------------ | ------------------------------------------------------------- |
| ①   | —（引言段）  | core 自第一屏中央沿垂直線下降，**穿透引言文字**（文字同步淡出） |
| ②   | `2652:51000` | 文字淡出完畢，core 停在**視窗正中央**（仍為橘色方塊）          |
| ③   | `2652:51227` | **上下拉長**成窄長條，同時**橘 → 深色**                       |
| ④   | `2065:142597` | 長條上下**貫穿整個視窗**（滿高、窄寬），左右仍是白底           |
| ⑤   | `2065:142710` | **左右展開**，展開範圍內已可見青色符號粒子                     |
| ⑥   | `2065:142938` | 展開到滿版 → 交棒給 `<SymbolScene>`（智慧論壇05 的三行文案浮現） |

實作要點：

- 穿透 ＋ 停在中央：由 `OrangeCorePath` 的 path scrub 完成（終點＝視窗中央）。
- ③–⑥ 需要 **hold 住畫面**才跑得完 → 一段 pin（scrub 寫入 transition 進度），與舊稿 `pinST` 同構但語意不同：舊的是「釘住 date 做斜角 wipe」，新的是「釘住做軸向兩段放大」。
- 放大是**兩段軸向**（先 `scaleY` 後 `scaleX`），非等比、非斜角 —— 舊 `HeroForumTransition` 的平行四邊形 `clip-path` 數學不適用，但「讀 core 螢幕矩形當起點」「逐幀寫 `el.style`」兩段邏輯可沿用（見 `components/legacy/`）。
- ⑤ 的「展開範圍內已有粒子」是**真的粒子**：轉場發生在 hero 還被 pin 住的時候，所以 `<SymbolFace>` 必須在此刻就在場、滿版渲染 → 它住在**轉場層的 slot 內**。三張轉場稿的 frame 名稱都是 `智慧論壇5`，設計本來就把「展開完成」與「智慧論壇05」當同一個畫面。
- 因此 `02.symbol/SymbolScene` **不畫任何東西**，只是一把捲動尺（見下）。

---

## 02.forum 範圍與核心層接力

**範圍界定**：02.forum ＝ `2652:55137`（只有四場論壇的內容）。核心的路徑與裝飾是它的**兄弟節點**、掛在外層 `2652:52648`。

| 在 02.forum 內             | 在 02.forum 外（核心層）                                        |
| -------------------------- | --------------------------------------------------------------- |
| 論壇一 / 二 / 三 / 四 內容 | 26px 橘方塊、`path1`、`path2`、`arrow`、`cube grame`、連接小點 |

與現有架構一致：核心路徑做成 **section 級 overlay**（如 `OrangeCorePath`），與內容元件解耦。

### 核心在論壇段是「四段接力」，不是一條線貫穿

外層 `2652:52648` 座標（總高 8743）。內容位置：論壇一 231–2991、論壇二 2991–4698、論壇三 4698–7365、論壇四 7365–8623。

| 圖層                | y 範圍      | 對應                                                       |
| ------------------- | ----------- | ---------------------------------------------------------- |
| 26px 橘方塊         | 48          | 論壇一之前 ＝ core 抵達                                    |
| `path1` 857×3694    | 58 → 3752   | 論壇一全段 ＋ 論壇二前半，尾端收在 09/15 日期區            |
| 斜線 vector 104×206 | 3887        | 疑似 **09/15 的橘色「/」**（尺寸符合 132px 字級的斜槓）     |
| `path2` 814×1435    | 4082 → 5517 | 論壇二尾 → 論壇三 timetable 起點（timetable 在 5477）      |
| `arrow` 45×1194     | 5528 → 6722 | **timetable 左側的橘色分組軸**，7 段                       |
| Group 12888 243×169 | 7425        | 論壇四開頭的橘色虛線箭頭裝飾                               |
| `cube grame` 884×3224 | 461 → 3685 | 漂浮方塊群，幾乎只在論壇一區域                             |

⚠️ **`arrow` 是最大的耦合風險**：7 段高度 262/168/168/104/75/169/104 對應 timetable 的 7 個分組（3/2/2/1/1/2/1 列）。注意「跨界對談」1 列是 104、「AI與教育」1 列是 75 —— 因為對談列多了主持人／與談人兩行。**分段高度跟著渲染後的實際內容高度跑**，overlay 必須從 DOM 量分組高度回推，不能寫死。

### 四場的共同積木與差異

|          | 論壇一             | 論壇二             | 論壇三                    | 論壇四           |
| -------- | ------------------ | ------------------ | ------------------------- | ---------------- |
| 高度     | 2760               | 1707               | 2667                      | 1258             |
| tag      | 大師談媒體         | 青年對話(一)       | AI永續                    | 青年對話(二)     |
| 日期     | 2026 09/09 ⊜       | 2026 09 15 ⊜（階梯三行） | 2026 09/18 ㊄       | 2026 09/30 ⊜     |
| 日期位置 | 左                 | 左（右側配地點）   | **右**                    | **右**           |
| desc     | ✗（改英文副標）    | ✓                  | ✓                         | ✓                |
| CTA      | ✗                  | 立即報名           | 下載完整議程 ＋ 立即報名  | 立即報名         |
| 講者     | 1 位 ＋ **五段長 bio**（唯一） | 2 位   | ✗                         | 2 位             |
| timetable| ✗                  | ✗                  | **✓ 12 列 / 7 分組**      | ✗                |
| 額外     | —                  | —                  | 灰底「乘載AI的鋒芒／刻下永續的年輪」＋ 融媒體世代訪談報告網站 | — |

共同積木：tag 列、主標、desc、大型日期＋星期圓框、地點時間、講者介紹、CTA → 可抽一個資料驅動元件，論壇三的 timetable 與灰底區塊當額外插槽。

### 資料結構意涵

[section2.json](../app/locales/section2.json) 現為 `agenda.morning / afternoon / sessions[]`（單日、時段分組）→ **整組換掉**。新形狀約為 `events[]`（四場：tag / title / desc / date / venue / time / speakers / cta），論壇三另有 `timetable`（`groups[] → rows[]`，含對談列的主持人與與談人）。`period` 概念消失。

### 要先問設計的兩點

1. **大型日期與 section 標題在稿上是 outline / flatten 圖層，不是 text node**：論壇二的日期是 `Union`、論壇四是 `_圖層_1`、最上方「聯合七五・智慧未來／四場系列論壇」也是兩個 `Union`。需決定重新排版（要字體與字距對稿）或匯出 SVG。舊 Hero 的 09/16 是 text＋CSS 排版，可沿用那套。
2. **橘色「/」歸哪一層**：09/15 附近那個 104×206 斜線掛在**核心層**，但 09/18 的橘斜槓在內容層找不到獨立節點，可能被併進 outline 圖層。若四個日期的斜槓都要由核心「化成」，四處都得歸核心層，內容層的日期就不能自帶斜槓。

---

## 舊 → 新 差異

| 項目                          | 舊 PRD                                        | 新設計                                                              |
| ----------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| 影片後第一屏                  | 白底、core 於第一屏正中央淡入                 | 影片自己演完（含階梯線與核心落下），DOM 只接棒                      |
| 大型日期 09/16 ＋ 橘「/」     | Hero 內，core 的終點                          | **移除**。日期散到四場論壇，核心經過時才化為該日期的「/」            |
| stage 4–6（pin、橘→黑變色）   | 有                                            | 新稿已無此動作（**程式先保留**，見下表）                            |
| 星空斜角遮罩 wipe             | HeroForumTransition                           | **移除** → `components/legacy/`                                     |
| SymbolFace 位置               | 掛在 Hero 轉場遮罩的 slot 裡、mode 由 Forum 指派 | **獨立黑底 section**（`02.symbol/SymbolScene.vue`），序列由自己擁有 |
| face 序列                     | disperse→face→converge 三態、無文案           | **四拍各帶文案**，且有**兩種臉**：半調點陣臉（06）與符號字元臉（07） |
| 交棒方式                      | converge → ForumCore crossfade → 議程淡入     | converge 成白方塊 → 轉橘 → 沿 `path1`/`path2` 往下串起四場論壇       |
| 議程結構                      | 單日、上午場／下午場                          | **四場獨立論壇**，只有論壇三有 timetable                            |
| 引言段                        | 已有（`.sec1__intro`）                        | 保留，但核心的路徑終點改為此處                                      |
| Section 3／4                  | PRD 空白                                      | 納入核心敘事：橘底撐滿 → 收回成「心」                               |

---

## 對現有程式碼的處置

✅ 已完成／🚧 待辦

| 現有                                    | 處置                                                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ✅ `HeroForumTransition.vue`            | 移至 `components/legacy/`（元件名變 `<LegacyHeroForumTransition>`，無人引用故不進 bundle）。檔頭標注三段值得回收的邏輯：`readCore()` 取螢幕位置/角度、`watch → el.style` 逐幀寫入、fixed 層不可掛在 pin 目標內 |
| ✅ `SymbolFace.vue` ＋ `DevFaceProgress.vue` | 從 `02.forum/` 移至 `02.symbol/`。SymbolFace 本來就零耦合（自帶 local `SymbolMode`、只有 props ＋ `v-model:mode`） |
| ✅ 新增 `02.symbol/SymbolScene.vue`     | 序列的**唯一擁有者**（原本散在 Hero ＋ Forum 兩處）。⚠️ 但它**不渲染 SymbolFace**：轉場發生在 hero pin 期間，粒子場必須那時就在場 → canvas 住在 Hero 的轉場層 slot 內。本元件退化為一把「捲動尺」：`height: SYMBOL_VH × 100vh` 的空 section，把捲動換算成 `symbolProgress` → 指派 `symbolMode` / `symbolLayerDone`。**不需要 pin**（視覺已是 fixed）→ 少一層 transform / containing block 的雷 |
| ✅ `Hero.vue`                           | 移除 `<HeroForumTransition>` ＋ 其內的 `<SymbolFace>`；destructure 減去 `transitionDone` / `symbolMode` |
| ✅ `Forum.vue`                          | 移除 symbol pin ＋ 兩個 watch；只讀 `forumCoreActive` / `agendaRevealed`。`.sec2__pin` 保留為議程淡入的容器（已不是 pin 目標） |
| ✅ `nuxt.config.ts`                     | 新增 `{ path: '~/components/02.symbol', pathPrefix: false }`（排在 `02.forum` 之前）              |
| ✅ `.sec1__move-spacer` ／ `MOVE_VH`    | 移除（spacer 原本墊在 intro 與 date 之間，該位置的內容已不存在）。這是「scrub 相對速度旋鈕」的做法，已登錄 [scroll-speed-knob](../.claude/memory/scroll-speed-knob.md)，原始碼在 `7ff9f19`。`MOVE_EASE`（節奏曲線，與距離正交）**保留** |
| ✅ `Hero.vue` 的 `.sec1__date` 整組     | 移除（template ＋ `dateRef`/`dateTitleRef` ＋ Hero.scss 的 `.sec1__date*` 全套絕對定位）。內容將散到四場論壇。`section1.json` 的 `date` 資料**暫留**，待論壇資料改寫時搬家 |
| ✅ `Hero.vue` 的 `pinST`（stage 4–6）   | 移除——它的 trigger 就是 date group，date 一走 pin 無所依附。連同 debounce resize refresh 一併移除（那是為 `pinSpacing` 寫死 px 而加的；ScrollTrigger 預設就會在 resize 時 refresh） |
| ✅ stage 4–6 相關常數                   | `STAGE_STOPS.pin`（扁平成單軌 `STAGE_STOPS`）、`PIN_VH`、`CROSSFADE`、`TRANSITION`、`CORE.lineScaleX`/`revealGrow`/`dark` 全數移除；`CoreStage` 收斂為 `1｜2｜3`，composable 的 `pinProgress`/`setPinProgress` 移除 |
| ✅ `OrangeCore.vue`                     | 只剩「橘方塊 ＋ 淡入 ＋ 曝露 root el」。stage 形變（point→line／橘→黑／放大淡出）全在 date 與星空轉場的語境裡，一併移除 → 不再吃 `stage`/`stageProgress` prop |
| ✅ `OrangeCorePath.vue`                 | 驅動線改為「第一屏正中央 → 引言文首上方」的**直線**；落點由 `anchorEl`（`.sec1__intro-body`）量測推導（水平置中、上緣往上 `CORE.dotSize/2`），無寫死座標。**可見灰線移除**（新稿 hero 段沒有設計線，階梯線在影片裡）。`PATH` 幾何常數整組刪除；`end` 改回 `bottom bottom` |
| ✅ core 穿透引言                        | `OrangeCorePath` 的驅動線改為「第一屏中央 → **視窗正中央**」的垂直線，終點 y ＝ `endEl`（引言整段）底緣 − 50vh。`.sec1__intro` 加 `padding-bottom: 60vh` 當 runway（必須 > 50vh，否則終點落在文字內、core 穿不出去）。引言於 path 進度過 `INTRO_FADE_FROM`(0.7) 後整段淡出 |
| ✅ 新增 `01.hero/HeroSymbolTransition.vue` | fixed 滿版色場 ＋ `clip-path: inset()` 開窗：窗的起點＝core 的螢幕矩形，先 `h → 100vh`（同時橘→黑），再 `w → 100vw`。**色場與 slot 都不動、只有 clip 在變** → 真 canvas 不會被拉伸變形（這既是用 clip 而非縮放 div 的原因，也是 slot 能直接吃 canvas 的原因）。slot 內放真正的 `<SymbolFace>`，於展開段依 `faceIn` 淡入。逐幀寫 `el.style`，不觸發 re-render。以 `opacity` 而非 `display` 隱藏——否則 three.js 量到 0 寬高 |
| ✅ transition pin（新語意的 pin）        | `Hero.vue` 重新建立一段 pin，但 **trigger 是 `.sec1__intro` 而非 `.sec1`** —— pin 會在 `.sec1` 內插入 pin-spacer 撐高 section，拿 `.sec1` 的 `bottom bottom` 當 start 會是循環依賴。`OrangeCorePath` 的 `endTrigger` 用同一元素 → 「core 抵達中央」與「pin 開始」必然同一刻 |
| ✅ `transitionDone` → `symbolLayerDone` | 因為 canvas 住在轉場層，該層必須撐到**整段序列跑完**才能撤 → 撤場時機回到舊架構的語意（序列越過 `enter`／`FORUM_HANDOFF.coreIn` → 交棒 ForumCore）。旗標更名為 `symbolLayerDone`（由 SymbolScene 寫、轉場層讀），撤場走固定時間 crossfade ＝ 決策「crossfade 用時間、放大綁 scrub」 |
| 🚧 core 的淡入位置                      | 仍是「第一屏正中央」（舊稿 placeholder）。新稿核心是從影片最後一幀的階梯線缺口掉出（設計稿約 x 515/1280），待正式影片到位後對齊 |
| 🚧 引言逐行淡出                         | 分鏡 ① 看起來是文字**由上而下**隨 core 經過而淡，目前實作是整段一起淡                              |
| 🚧 `CORE.dotSize`                       | 程式為 24px、設計稿為 26px（`OrangeCore` / `ForumCore` 的 SCSS 亦寫死 24）。尺寸對稿待辦          |
| 🚧 `stage` / `stageProgress`            | stage 1–3 模型保留為新稿 checkpoint 的接點，但目前**無 production 消費者**，只有 dev 讀數在用      |
| 🚧 論壇段的核心路徑                     | 直接沿用 OrangeCorePath 的引擎（SVG path ＋ `getPointAtLength` ＋ 單一 scrub ＋ 切線角度）；`path1`/`path2` 可從 Figma 匯出 `d`。需決定接成一條連續 path（維持「一條 path 一個 tween、接縫零頓挫」）或拆兩個 ScrollTrigger |
| 🚧 `ForumCore.vue`                      | 改為沿 path 移動的核心 → 建議直接復用 `OrangeCore` ＋ path 引擎，不維護兩套                        |
| 🚧 `SYMBOL_STOPS`                       | 三態擴為四拍，各拍配文案                                                                         |
| 🚧 `section2.json`                      | 資料結構改寫：`morning`/`afternoon` → 四場論壇                                                   |
| 🚧 `Blessing.vue` / `Media.vue`         | 新增核心進出場動態（橘底撐滿／收回成「心」）                                                     |

### 元件目錄現況

```
app/components/
  01.hero/      Hero, HeroVideo, HeroLoader, OrangeCore, OrangeCorePath, Dev*
  02.symbol/    SymbolScene, SymbolFace, DevFaceProgress      ← 新增
  02.forum/     Forum, ForumCore
  03.blessing/  Blessing
  04.media/     Media, HeartMetaball
  05.subpage/   Subpage*
  legacy/       HeroForumTransition, SymbolFace, ParticleScene  ← 僅參考
```

`02.symbol` 與 `02.forum` 共用 `02` 前綴（同為第二段的兩個子場景），避免牽動 `03`/`04`/`05` 的 `.sec3`/`.sec4` BEM block 改名。新 section 的 BEM block 為 `.sec-symbol`（非數字，因無編號可用）。

---

## 待確認

1. **06 → 07 是同一套粒子嗎**：06 是半調點陣臉、07 是符號字元臉。現有 SymbolFace 的粒子由 `src` 圖的 alpha 取樣建出，換 `src` 會重建整個系統、無法無縫過渡。需確認是「同一套粒子換 render（點→字元）」還是「06 為獨立圖層與 07 做 crossfade」。
2. **永續祝福的橘底怎麼來**：設計稿只給靜態幀，推測是核心撐滿全屏，缺中間張佐證。
3. **mob / pad 分鏡**：本檔僅依 `主頁_pc`。
