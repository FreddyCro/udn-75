# 產品需求文件 PRD — 聯合七五・智慧未來

> UDN 75 — Shaping An Intelligent Future
> 聯合報 75 週年數位專題網站
>
> **本檔為唯一 PRD**（2026-08-04 由舊 PRD 與 PRD v2 合併，v2 已移除）。描述的是**目前程式的實際架構**與對應設計稿；已被取代的舊架構（stage 4–6 pin 軌、星空斜角 wipe、單日上午／下午議程）不再記錄於此，需要時查 git 或 `app/components/legacy/`。
>
> 設計依據：Figma `主頁_pc` node `2065:138483`（1280 寬）。
> **範圍限制**：分鏡描述以 pc 稿為準，mob / pad 分鏡尚未逐格比對（見文末「待確認」）。

---

## 概述

單一頁面、垂直滾動式的敘事型專題網站。首頁依滾動順序分為五個段落（四個 section ＋ 一個純捲動尺段落），搭配常駐 Header / Footer。切分原則：**Page → Section → Component**，功能以表格條列；跨 section 的共用功能另立一張表。

- 正式敘事頁：`/`（[index.vue](../app/pages/index.vue)），版面容器 [layouts/default.vue](../app/layouts/default.vue)
- 子頁：`/data`、`/education`、`/health`、`/news`、`/service`、`/visual` 走 [subpage.vue](../app/layouts/subpage.vue) layout ＋ `05.subpage` 元件家族。內容規格不在本檔範圍
- 其他：`/demo`、`/resources` 走預設 layout（開發／資源頁，不納入本 PRD）

### 元件目錄慣例

每個段落一個「前綴 ＋ 語意名」資料夾（`01.hero` / `01a.symbol` / `02.forum` / `03.blessing` / `04.media` / `05.subpage`），使檔案總管依序排列。`nuxt.config.ts` 對這些資料夾設 `pathPrefix: false`，故 auto-import 元件名**只取檔名、不含前綴**（`<Hero>` / `<SymbolScene>` / `<Forum>` …）。新增段落時：建 `NN.名稱/` ＋ 在 `nuxt.config.ts` 的 `components` 陣列補一筆。

符號段落用**字母後綴** `01a` 而非新數字，理由是排序：`'.'(0x2E) < 'a'(0x61)` 故 `01a.symbol` 排在 `01.hero` 之後，開頭 `01 < 02` 故排在 `02.forum` 之前 → 檔案總管順序 ＝ 頁面順序 ＝ 註冊順序。（`01.5.symbol` 會因 `'5' > '.'` 排到 `01.hero` **前面**；早期的 `02.symbol` 會因 `f < s` 讓 `02.forum` 排到它前面 —— 兩者皆與頁面順序相反，故不採用。）字母後綴同時避免牽動 `03`/`04`/`05` 的 `.sec3`/`.sec4` BEM block 改名；新段落的 BEM block 為 `.sec-symbol`（非數字，因無編號可用）。

### 元件命名慣例

`pathPrefix: false` 下元件名＝檔名且**全域唯一**。orange core 相關的 runtime 元件用 `OrangeCore*` 家族名，與 `useOrangeCoreProgress` / `orange-core-config` 對齊；除錯元件一律加 `Dev` 前綴（`DevHeroVideoControls` / `DevCoreProgress`），掃檔案樹即可辨識「非 production UI」。跨章節的除錯元件（`DevCoreProgress`）掛在 `pages/index.vue` 而非某個 section 底下 —— 跟著 section 走會在別段卸載。

### 元件目錄現況

```
app/components/
  01.hero/      Hero, HeroVideo, HeroLoader, HeroStart, HeroSymbolTransition,
                OrangeCore, OrangeCorePath, DevHeroVideoControls
  01a.symbol/   SymbolScene, SymbolFace
  02.forum/     Forum, ForumEvent, ForumCore, ForumCorePath, Agenda
  03.blessing/  Blessing, BlessingFace, BlessingStairs, BlessingPartners
  04.media/     Media, MediaTitle, MediaList, HeartMetaballPatch（現役底紋）,
                HeartMetaball（前一版底紋，僅 demo 對照）
  05.subpage/   Subpage, SubpageNav, SubpageAnchor, SubpageAnchorBar, SubpageCta, SubpageWork(s)
  legacy/       HeroForumTransition, SymbolFace, ParticleScene   ← 僅供參考，無人引用
```

---

## 核心概念：橘核心貫穿全頁

26px 橘方塊不是「出現又消失」的裝飾，而是**貫穿全頁的主角**，一路 morph：

影片內的階梯線缺口掉出 → 穿透引言 → 拉長展開成滿版黑幕（符號人臉的舞台）→ 收斂成白點 → 轉橘、沿曲線串起四場論壇（經過日期時就是那個「/」）→ 撐滿成永續祝福的橘底 → 收回成「智慧『心』媒體」的引號。

---

## 捲動分鏡（主頁_pc）

| #   | Figma frame                  | 畫面                                                                                                                                       | 核心（橘方塊）做什麼                                                              |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 0   | 影片結尾 `2065:138488`       | **這一格是 hero 影片本身的最後一段**，非另做的靜態畫面：左右藍/橘像素格柱、標題「聯合七五・智慧未來」、藍色階梯線、播放 icon、提示下滑    | 藍線下折成階梯、橘核心從階梯掉出——**都在影片裡**。DOM 端只負責接棒                 |
| 1   | 引言 `2065:139397`           | 白底，26px 橘方塊置中在文前 ＋ 三段引言                                                                                                    | 核心於此**接手成 DOM 元素**，垂直**穿透引言文字**後停在視窗中央，接著上下拉長 → 左右展開成滿版（詳規見 Section 1） |
| 2   | 智慧論壇05 `2065:139729`     | 黑底 coding 符號雨（`coding 特效` 1800×875 出血層）＋ 三行內文                                                                              | disperse                                                                          |
| 3   | 智慧論壇06 `2065:139732`     | 半調點陣人臉（`ai face3 code負片`）＋ 圓形游標提示「游標移動 探尋隱藏的心聲」                                                               | face，滑鼠互動                                                                    |
| 4   | 智慧論壇07 `2065:139741`     | 符號字元人臉崩解旋渦 ＋ 橘字彩蛋「AI真假難辨／我們還能相信誰？」                                                                            | 崩解 ＋ 文字彩蛋                                                                  |
| 5   | 智慧論壇08 `2065:139745`     | 人臉裂成四片向中心收攏 → 中央 16px **白**方塊                                                                                              | converge → 白核心                                                                 |
| 6   | 論壇 `2652:52648`（8743 高） | 白底 ＋ 橘色曲線 `path1`/`path2` 貫穿論壇一~四、沿途漂浮 cube 方塊                                                                          | 白核心→橘核心，沿 path 往下拖出四場論壇；**經過日期時就是那個「/」**               |
| 7   | 活動回顧 `2076:79563`        | 精彩活動回顧 4 則圖文                                                                                                                      | —                                                                                 |
| 8   | 永續祝福01–03                | 滿版**橘底** ＋ 白色像素臉（逐格表情變化）＋ 標題說明                                                                                       | 核心撐滿全屏＝橘底（🚧 中間張未提供，待確認）                                      |
| 9   | 永續祝福04 `2065:140521`     | 橘底 ＋ 白色像素階梯線 ＋ 夥伴祝福清單（策略／共創夥伴，內捲動）                                                                            | 階梯線＝同一條線的回聲                                                            |
| 10  | 智慧心媒體01–02              | 橘塊（900×720）縮小 → 白底中央細橘豎條（24×180）                                                                                           | 橘底收回成核心                                                                    |
| 11  | 智慧心媒體03–04              | 智慧 ● 媒體 → 智慧**「心」**媒體（橘色引號）                                                                                                | 核心點展開成「心」的引號                                                          |
| 12  | 智慧心媒體_錨點 `2524:82034` | 標題 ＋ 說明 ＋ 像素圖 ＋ 01–06 子頁錨點列                                                                                                  | —                                                                                 |
| 13  | footer/pc `2542:126041`      | —                                                                                                                                          | —                                                                                 |

---

## 狀態與設定台

全站的捲動敘事由兩個全域 composable 作單一狀態來源（`useState`，SSR 安全、跨元件共享），可調數值一律外移到 `~/utils` 的設定台模組（純資料、無 Vue runtime、auto-import）。**要調時間點與距離，只改設定台。**

| 模組                                                                    | 角色          | 內容                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [useHeroVideo.ts](../app/composables/useHeroVideo.ts)                   | 狀態機        | hero 影片四階段 `main / loop / outro / gone`，衍生 `shouldLockScroll` / `isGone` / `hasLeftLoop`；與載入層的握手 `videoReady` / `loaderDone` / `heroStarted`；`currentTime`（dev 讀數）。狀態本身不含計時器，推進由 HeroVideo 依影片時間軸驅動 |
| [hero-video-config.ts](../app/utils/hero-video-config.ts)               | 設定台        | `HERO_VIDEO_SRC` / `HERO_VIDEO_POSTER`（mob／pad／pc 三段，**RWD 預留**，目前三者共用 pc 版）、`HERO_VIDEO_SEGMENTS`（四階段的秒數區間，段落相接）、`HERO_VIDEO_SEGMENTS_BY_DEVICE`、`HERO_VIDEO_READY_TIMEOUT`、`HERO_GESTURE`（手勢門檻與冷卻） |
| [useOrangeCoreProgress.ts](../app/composables/useOrangeCoreProgress.ts) | 狀態機        | 五條 progress 軌（見下表）＋ 由它們解出的 `symbolTarget` / `symbolMode` / `symbolLayerDone` / `forumCoreActive` / `agendaRevealed` / `blessingFrame`，以及 `reduceMotion` / `stairsDone`。**不含**「章節.part」定址（那在 `useCoreSequence`） |
| [orange-core-config.ts](../app/utils/orange-core-config.ts)             | 設定台        | 門檻與距離：`MOVE_EASE`、`INTRO_FADE_VH`、`TRANSITION_VH`、`SYMBOL_TRANSITION`、`SYMBOL_STOPS`、`SYMBOL_VH`、`FORUM_HANDOFF`、`BLESSING_VH`、`BLESSING_HOLD`；序列定址表：`SEQUENCE` / `TRACK_VH`；幾何與外觀：`CORE`、`FORUM_PATH`。刻意**不含**子元件自身外觀參數（HeroLoader 的方塊／SymbolFace 的粒子物理），那些留在各元件 |
| [blessing-face-frames.ts](../app/utils/blessing-face-frames.ts)         | 設定台        | 永續祝福逐格像素臉的格資料（`FACE_FRAME_COUNT` 17 格）                                                                                                                                                                   |
| [hero-scroll-intent.ts](../app/utils/hero-scroll-intent.ts)             | 純函式        | loop ↔ outro 的方向手勢判定（body 鎖住時沒有 scroll 事件，故由 wheel／touchmove／方向鍵位移累積判定）。有 vitest 覆蓋                                                                                                     |

### progress 軌一覽

四條互相獨立、各自 0..1 的捲動軌。每條都由一個 ScrollTrigger 寫入，並在 `onLeaveBack` / `onLeave` 夾到 0 / 1，故**往回捲全部自動倒退**。

| 軌                    | 寫入者                   | 捲動尺                                                            | 距離                        | 解出                                                          |
| --------------------- | ------------------------ | ----------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------- |
| `pathProgress`        | `OrangeCorePath`（scrub）| `trigger: .sec1`、`start: 'top top'`、`endTrigger: .sec1__intro`、`end: 'bottom bottom'` | 由版面決定                  | core 沿線位置（`SEQUENCE` 的 `hero.core`）                      |
| `transitionProgress`  | `Hero.vue` 的 transition pin | `trigger: .sec1__intro`、`start: 'bottom bottom'`、`end: +=TRANSITION_VH×vh` | **120vh**（`TRANSITION_VH` 1.2） | `SYMBOL_TRANSITION` → 兩段軸向放大（見 Section 1 詳規）        |
| `symbolProgress`      | `SymbolScene`            | `trigger: .sec-symbol`、`start: 'top bottom'`、`end: 'bottom bottom'` | **320vh**（`SYMBOL_VH` 3.2） | `SYMBOL_STOPS` → `symbolMode` / `symbolLayerDone`；`FORUM_HANDOFF` → `forumCoreActive` / `agendaRevealed` |
| `blessingProgress`    | `Blessing.vue`           | `trigger: .section3__face-track`、`start: 'top top'`、`end: 'bottom bottom'` | **120vh**（`BLESSING_VH` 1.2） | `blessingFrame`（17 格逐格臉，尾端 `BLESSING_HOLD` 停在最後一格） |

> 引言淡出**不在**這四條軌上：它由 `Hero.vue` 自己的一條 scrub ScrollTrigger 驅動（`trigger: .sec1__intro-body`、`start: 'bottom center'`、`end: +=INTRO_FADE_VH×vh`），起點是量出來的幾何（文字底緣升到視窗中央 ＝ core 剛穿出最後一行），不是 path 進度門檻。詳見 Section 1 的 ⑤。

> 🚧 舊的 `STAGE_STOPS` / `stage` / `stageProgress`（在 path 軌內部再切 stage 1–3）已於 2026-08-08 移除：自 date 段下架後就沒有 production 消費者，且「stage」一詞與下面的 `SEQUENCE` 定址撞名。

### 序列定址：`章節.part.progress`

上面那幾條軌是**實作單位**；跨章節溝通用的是 [`SEQUENCE`](../app/utils/orange-core-config.ts)（資料）＋ [`useCoreSequence`](../app/composables/useCoreSequence.ts)（解析）定義的座標系，寫法 `forum.face.59%`。

- **part 的名字才是主鍵**，序號只是 dashboard 顯示用 —— 中間插入新 part 會讓序號整批位移，而地址已經寫進 issue 了。
- **`drive` 決定那個地址能不能綁捲動**：`scrub`（綁捲動、可逆，才能在任意 % 掛門檻）／`time`（時間軸，只有 idle/done）／`none`（無軌區間，講得出位置但沒有 %）。混用會下出做不到的指令。
- 章節切分依**設計稿**而非元件目錄：符號段（`01a.symbol`）在稿上是「智慧論壇05–08」，故歸在 `forum` 章節下。
- media（04）暫不納入 —— 整段是時間軸驅動（`useMediaIntroMotion` 的 `gsap.timeline`），用捲動 % 定址會誤導。
- 反算回 config：`forum.face.59%` → `symbolProgress = 0.15 + 0.59 × (0.58 − 0.15) = 0.404` → 距符號段起點 129.2vh。`DevCoreProgress` 直接印出 raw 值，不必手算。

| 章節       | parts（依捲動順序）                                                                      |
| ---------- | ---------------------------------------------------------------------------------------- |
| `hero`     | `video`(time) → `core`(scrub/path) → `transition`(scrub/transition)                        |
| `forum`    | `disperse` → `face` → `converge` → `handoff`（皆 scrub/symbol）→ `hover`(none, 50vh) → `path`(scrub/forumPath) → `agenda`(none) |
| `blessing` | `face`(scrub/blessing) → `stairs`(time) → `partners`(none)                                 |

> ⚠️ `SEQUENCE` 中**不可出現相鄰的兩個 `none`**：無軌 part 的「結束了沒」是靠下一段有沒有開始反推的，兩個連在一起就推不出來（見 `useCoreSequence`）。

---

## Section 1 — Hero／開場（[Hero.vue](../app/components/01.hero/Hero.vue)）

開場是一段連續的捲動敘事：**載入層 → start 閘門 → hero 影片（四階段）→ orange core 沿垂直線下降穿透引言 → transition pin 釘住做兩段軸向放大 → 交棒給符號段落**。

### orange core 生命週期（✅ 已實作／🚧 規劃中）

```
┌─ 進站／載入 ──────────────────────────────────────  [HeroLoader, RAF] ─┐
│ ✅ ① 方塊網格翻面，收尾「正中央格翻橘」＝ core 視覺種子（對齊視窗中心）  │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ @done 淡出
┌─ start 閘門 ─────────────────┴────────────────────────────  [HeroStart] ─┐
│ ✅ ② 停在這一屏等使用者按 start（有聲播放必須綁使用者手勢，見 useAppSound）│
└──────────────────────────────┬────────────────────────────────────────┘
┌─ hero 影片（#app-hero）───────┴───────────────────────  [useHeroVideo] ─┐
│ 🚧 ③ main→loop→outro：core 應在影片中就已在場／可見（缺口，尚未實作）   │
│      現況：core DOM 在場但 opacity:0、不可見；影片為 pc 版 demo 剪輯     │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ gone（影片淡出 → 白底）
   ✅ ④ core 淡入（isGone）於第一屏正中央 ＝ 載入層橘塊的位置（延續同一點）
                               │
╞═ path 軌 ════════════════════╪══════════════════════  [OrangeCorePath] ═╡
   ✅ ⑤ **從引言文字後方**垂直穿過（`.sec1__scene` z-index 3 疊在 core 之上 → 只有
        筆畫遮住方塊）；穿出最後一行後引言才開始淡出，吃掉 INTRO_FADE_VH 淡完
   ✅ ⑥ 停在**視窗正中央**（path 終點 ＝ 引言整段底緣 − 50vh）；引言淡完＝pin 接手
        （runway ＝ 50vh ＋ INTRO_FADE_VH×100vh，由 --intro-runway 綁定，故必然同刻）
                               │
╞═ transition 軌 ══════════════╪════════════════  [Hero transition pin] ══╡
   ✅ ⑦ 上下拉長成窄長條，同時 橘 → 黑（#000）
   ✅ ⑧ 左右展開到滿版，展開範圍內已見真實粒子 → 交棒給符號段落
                               │ 續捲（不需點擊）
┌─ 01a 符號段落 ───────────────┴──────────────────────────  [SymbolScene] ─┐
│ ✅ ⑨ symbolProgress scrub：disperse → face → converge                   │
│ ✅ ⑩ coreIn 交棒：轉場層（含粒子場）淡出、ForumCore 橘核心淡入（crossfade）│
│      停在黑畫面 → coreOut 橘核心淡出、論壇內容淡入                       │
│ 🚧 ⑪ 橘核心沿 path1/path2 串起四場論壇的移動動態（僅完成 handoff）        │
└─────────────────────────────────────────────────────────────────────────┘
┌─ 03 永續祝福 ／ 04 智慧心媒體 ────────────────────────────────────────────┐
│ 🚧 ⑫ 核心撐滿成橘底 ／ 收回成「心」的引號（兩段進出場動態未做）           │
└─────────────────────────────────────────────────────────────────────────┘
```

> 🚧 缺口③：影片播放期間（main/loop/outro）core 目前 `opacity:0`、不可見；「從 hero 影片就延續在場的橘核心」尚未實作。補完後才真正達成「貫穿全場」。core 的淡入點仍是「第一屏正中央」（舊稿 placeholder），新稿是從影片最後一幀的階梯線缺口掉出（設計稿約 x 515/1280），待正式影片到位後對齊。

### 轉場詳規：core 穿透引言 → 展開成符號舞台

設計稿分鏡 `2065:143082`（section「引言轉場論壇」）。設計標註**「綁滾動」＝ 全程 scrub**，非定時動畫。Header 在整段轉場中皆可見（轉場層 z-index 10 < Header 1000）。

| 拍  | Figma frame   | 畫面                                                          |
| --- | ------------- | ------------------------------------------------------------- |
| ①   | —（引言段）   | core 自第一屏中央沿垂直線下降，**穿透引言文字**（文字同步淡出） |
| ②   | `2652:51000`  | 文字淡出完畢，core 停在**視窗正中央**（仍為橘色方塊）          |
| ③   | `2652:51227`  | **上下拉長**成窄長條，同時**橘 → 深色**                       |
| ④   | `2065:142597` | 長條上下**貫穿整個視窗**（滿高、窄寬），左右仍是白底           |
| ⑤   | `2065:142710` | **左右展開**，展開範圍內已可見青色符號粒子                     |
| ⑥   | `2065:142938` | 展開到滿版 → 交棒給 `<SymbolScene>`（智慧論壇05 的三行文案浮現） |

`transitionProgress` 時序（`TRANSITION_VH` 1.2 ＝ **120vh**；px 為視窗高 1080 的換算）：

| step | 動作                                              | 進度      | 累計距離        |
| ---- | ------------------------------------------------- | --------- | --------------- |
| ①    | pin 上鎖，core 停在視窗正中央                     | 0%        | 0vh             |
| ②    | 橘 → 黑完成（`SYMBOL_TRANSITION.colorSpan` 0.35） | 19.25%    | 23.1vh (250px)  |
| ③    | 上下拉長段結束（`growY` 0.55），h 24px → 100vh    | 55%       | 66vh (713px)    |
| ④    | 粒子場淡入完成（`faceIn` 0.5）                    | 77.5%     | 93vh (1004px)   |
| ⑤    | 左右展開到滿版、pin 釋放                          | 100%      | 120vh (1296px)  |

實作要點：

- 穿透 ＋ 停在中央由 `OrangeCorePath` 的 path scrub 完成，終點＝視窗中央。
- ③–⑥ 需要 **hold 住畫面**才跑得完 → 一段 pin，scrub 寫入 `transitionProgress`。
- 放大是**兩段軸向**（先高後寬），非等比、非斜角。做法是 **fixed 滿版色場 ＋ `clip-path: inset()` 開窗**，不是縮放 div —— 色場與 slot 都不動、只有 clip 在變，故 slot 內的真 canvas 不會被拉伸變形。
- ⑤ 的「展開範圍內已有粒子」是**真的粒子**：轉場發生在 hero 還被 pin 住的時候，`<SymbolFace>` 必須那時就在場、滿版渲染 → 它住在**轉場層的 slot 內**（由 Hero 渲染）。三張轉場稿的 frame 名稱都是「智慧論壇5」，設計本來就把「展開完成」與「智慧論壇05」當同一畫面。
- 因此 `01a.symbol/SymbolScene` **不畫任何東西**，只是一把捲動尺（見 Section 1a）。

### 元件與區塊

| 元件 / 區塊                                                                        | 功能                                             | 說明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 載入層（[HeroLoader.vue](../app/components/01.hero/HeroLoader.vue)）                | 進站載入動畫（滿版 fixed，z-index 2000 蓋過 Header） | 方塊網格以 Fisher–Yates 洗牌逐格由藍→橘（處理中前緣）→白翻面，中央計數 0→100%。網格強制奇數欄列並置中，**正中央格對齊視窗正中心**：收尾時中央格翻橘＝orange core 的視覺起點。`ready`（影片可播放）為 false 時進度封頂 99% 等待，轉 true 才補到 100% 並 `@done` 淡出移除。**不自行改 `body.overflow`**（捲動鎖由 Hero 單一擁有），避免卸載解鎖與父層重新上鎖之間出現「瞬間可捲動」破口。<br>`videoReady` 由 HeroVideo 的 `<video>` `@canplay` 設 true（載入失敗或超過 `HERO_VIDEO_READY_TIMEOUT` 也放行，避免卡在 99%）；反向的 `loaderDone` 讓影片等載入層收掉才開播 |
| start 閘門（[HeroStart.vue](../app/components/01.hero/HeroStart.vue)）              | 等使用者手勢再開播                               | 載入層收掉後不直接播影片，先停在這一屏等按 start —— 有聲播放必須綁在使用者手勢上（見 [useAppSound.ts](../app/composables/useAppSound.ts)）。期間 `heroState` 仍為 `main` → body 保持捲動鎖。與載入層同為 fixed 層，**掛在 `.sec1__inner` 外面** |
| hero（`#app-hero`）                                                                | 開場主視覺                                       | 兼作 Header 顯示時機的觀察目標：`id="app-hero"` 供 [AppHeader.vue](../app/components/AppHeader.vue) 以 IntersectionObserver 監看，**hero 完全捲離視窗後 Header 才滑入**。修改 hero 結構時請保留此 id |
| 影片四階段（[HeroVideo.vue](../app/components/01.hero/HeroVideo.vue)）              | 影片播放狀態機                                   | 四階段全域共享：`main`（播一次）→ `loop`（循環段，顯示「下滑看更多」）→ `outro`（loop 期間往下捲或按 SKIP 觸發的退場段）→ `gone`（退場結束、影片淡出露白底 → core 淡入）。<br>**推進的單一真相＝影片時間軸**：`timeupdate` 依 `HERO_VIDEO_SEGMENTS` 判斷段落推進；狀態被外部切換（dev 列／SKIP）時 seek 到該段起點（已在段內則不動，故自動推進不跳動）。載入失敗或自動播放被封鎖時直接進 `gone`，避免捲動鎖把整頁鎖死。<br>`loop` 期間 body 鎖住、沒有 scroll 事件，故「往下捲觸發 outro」改由 wheel／touchmove／方向鍵的位移累積判定（純函式 `hero-scroll-intent.ts`）。**可逆邊界：`loop` 是「家」狀態，`outro ↔ gone` 可逆，`main` 不可逆** —— `gone` 且已在頂端往上回滑過門檻 → `rewindToLoop()` 切回 `loop`，影片淡回並 seek 回 loop 段 |
| 捲動鎖（`Hero.vue` `applyScrollLock`）                                             | **重整一律從頂端重來**                           | 拍 ①–⑦（loader／等載入／loader 收尾／start 閘門／按下 start／`main`／`loop`）一律鎖，⑧ `outro` 起解鎖 —— ①–⑤ 期間 `heroState` 都還是 `main`，故自動落在鎖內。<br>唯一例外：離開 loop 之後**永不重新上鎖**（`hasLeftLoop`），因為倒帶回 loop 時 `scrollY` 已是 0、不鎖也上不去，而在 iOS 橡皮筋回彈途中切 `overflow:hidden` 會卡住畫面。<br>`onMounted` 設 `history.scrollRestoration = 'manual'`、上鎖前先 `scrollTo(0,0)`：否則重整後瀏覽器把位置還原到內容區、又處於 `main`，會被 `overflow:hidden` 永久鎖死在中途。<br>⚠️ `.is-scroll-locked` class 必須同時掛在 `<html>` 與 `<body>`：html 有 `overflow-x: clip`，根元素不再是 `overflow: visible` → body 的 overflow 不會傳播到視窗。樣式含 `padding-right: var(--scrollbar-width)` 補回捲軸寬，否則解鎖時捲軸回來會撐出水平捲軸 |
| orange core（[OrangeCore.vue](../app/components/01.hero/OrangeCore.vue)）           | 貫穿全場的橘色核心                               | 只負責外觀（24px 橘方塊 ＋ `opacity` 淡入 ＋ 曝露 root el）。位置由 `OrangeCorePath` 以 GSAP 驅動。<br>⚠️ **不可**在 `.sec1__orange-core` 再設 CSS `transform`（含置中、`scale` 淡入）—— 會與 GSAP 寫入的 transform 衝突；置中一律交給 GSAP（`xPercent/yPercent: -50`），淡入只用 `opacity`。<br>`transitionProgress > 0` 後由 Hero 隱去（其後畫面上那個方塊由轉場層接手畫，避免兩層各畫一次而 drift）；以 `opacity` 而非 `display` 隱藏 —— 轉場層仍要讀它的螢幕矩形 |
| core 移動路徑（[OrangeCorePath.vue](../app/components/01.hero/OrangeCorePath.vue)） | 驅動 core 的路徑 overlay                         | `.sec1` 級絕對定位 overlay（1:1 px、無 `viewBox`、`pointer-events:none`），內含一條不可見驅動線（`stroke:none`）：第一屏正中央 → 視窗正中央的**垂直線**。單一 scrub ScrollTrigger ＋ `getPointAtLength()` 逐幀定位 core（含切線角度，為之後的曲線路徑預留）。<br>**幾何全由量測推導、無寫死座標**：x ＝ section 水平中心（引言文字也置中，故一路穿過文字），終點 y ＝ `endEl` 底緣 − 50vh。`.sec1__intro` 的 `padding-bottom: 60vh` 是 runway，**必須 > 50vh**，否則終點落在文字之內、core 還沒穿出文字就停住。<br>⚠️ 起訖與 `endEl` 都刻意避開 `.sec1` 的 bottom：transition pin 會在 `.sec1` 內插入 pin-spacer 撐高 section，用 `.sec1` 的 bottom 當基準會是循環依賴。<br>重建時機：`refreshInit`、`document.fonts.ready`、resize。<br>🚧 未實作：沿途殘影 trail dots、手機版另畫直式 path、`prefers-reduced-motion` 直接定位起／終點 |
| transition pin（`Hero.vue` `transitionST`）                                        | 釘住整組跑兩段軸向放大                           | ⚠️ **trigger 是 `.sec1__intro` 而非 `.sec1`** —— pin 會在 `.sec1` 內插入 pin-spacer 撐高 section，拿 `.sec1` 的 `bottom bottom` 當 start 會是循環依賴。`OrangeCorePath` 的 `endTrigger` 用同一元素 → 「core 抵達中央」與「pin 開始」必然同一刻。<br>⚠️ pin 會在 `.sec1__inner` 寫入 `transform`，使其成為 fixed 子孫的 containing block → HeroLoader / HeroStart / HeroSymbolTransition 都必須掛在 inner「**外面**」，否則改以 inner 為定位基準而跑位 |
| 轉場層（[HeroSymbolTransition.vue](../app/components/01.hero/HeroSymbolTransition.vue)） | 色場 ＋ clip 開窗（fixed 滿版，z-index 10）  | 窗的起始尺寸／位置 ＝ core 的螢幕矩形 → p≈0 時本層與 core 像素重合，看起來就是「那個橘方塊自己長大」。先 `h → 100vh`（同時橘→黑），再 `w → 100vw`。逐幀直接寫 `el.style`，不觸發 Vue re-render。slot 內放真正的 `<SymbolFace>`，於展開段依 `faceIn` 淡入。<br>⚠️ **量的是 field 自己的框（`clientWidth/Height`），不是 `window.innerWidth/Height`** —— 本層是 fixed `inset:0` → 寬度不含捲軸，而 `innerWidth` 含捲軸；混用兩套座標會讓開窗少一整個捲軸寬、左偏半個捲軸寬，且 p=1 時右緣殘留一條沒蓋到，剛好在交棒瞬間透出 hero 白底。展開完成後直接寫死 `inset(0px)`，不靠算式剛好等於 0。<br>⚠️ anchor 量到真 rect 才快取：`watch` 是 immediate，第一次 `apply(0)` 常早於 `coreEl` 就緒，若連 fallback 一起鎖住，整段轉場都會用錯的錨點。<br>⚠️ 以 `visibility:hidden`（非 `display:none`、非單純 `opacity:0`）隱藏：`display:none` 會讓 three.js 量到 0 寬高；只設 `opacity:0` 則 fixed 滿版 canvas 仍參與 hit-test，會吞掉影片階段的所有點擊。<br>**生命週期**：因為 canvas 住在本層 slot，本層必須撐到**整段符號序列跑完**才能撤 → `done` 讀的是 `symbolLayerDone`（序列越過 `enter`），不是「放大完成」。撤場走固定時間 crossfade ＝ 決策「**crossfade 用時間、放大綁 scrub**」 |
| dev 工具                                                                           | 開發輔助（僅 dev）                               | [DevHeroVideoControls](../app/components/01.hero/DevHeroVideoControls.vue)：影片四階段切換＋SKIP＋秒數讀數；[DevCoreProgress](../app/components/DevCoreProgress.vue)：整條序列的定址 dashboard（掛在 `pages/index.vue`，`?pathdebug` 才顯示）。前者包在 `<DevOnly>`；後者**刻意不包** —— `?pathdebug` 本來就在 production 可用，deploy 出去的 preview 也要能開 |

---

## Section 1a — 符號人臉序列（[SymbolScene.vue](../app/components/01a.symbol/SymbolScene.vue)）

對應 Figma「智慧論壇05–08」四拍。**本元件不畫任何東西** —— `<SymbolFace>` 住在 Hero 轉場層的 slot 裡（理由見 Section 1 轉場詳規）。因此它退化為一把「捲動尺」：一段 `SYMBOL_VH × 100vh` 高的空 section（黑底，萬一轉場層還沒蓋滿時不露白），把捲動換算成 `symbolProgress`、指派 `symbolMode` 與 `symbolLayerDone`。**不需要 pin**（視覺已是 fixed）→ 少一層 transform / containing block 的雷。

`symbolProgress` 時序（`SYMBOL_VH` 3.2 ＝ **320vh**；px 為視窗高 1080 的換算）：

| step | mode / 事件                                    | 進度      | 累計距離（起→迄）            | 該段距離   |
| ---- | ---------------------------------------------- | --------- | ---------------------------- | ---------- |
| ①    | `disperse` 分散（預設）                        | 0 → 15%   | 0 → 48vh (0→518px)           | 48vh       |
| ②    | `face` 集合（人像）＝最長的一拍                | 15% → 58% | 48 → 185.6vh (518→2004px)    | 137.6vh    |
| ③    | `converge` 匯聚成點                            | 58% → 75% | 185.6 → 240vh (2004→2592px)  | 54.4vh     |
| ④    | `coreIn` 交棒：轉場層淡出 ＋ ForumCore 淡入     | 75%       | 240vh (2592px)               | —          |
| ⑤    | `enter` 橘核心停在黑畫面（原地停住）            | 75% → 90% | 240 → 288vh (2592→3110px)    | 48vh       |
| ⑥    | `coreOut` 橘核心淡出 ＋ 論壇內容 reveal         | 90%       | 288vh (3110px)               | —          |
| ⑦    | 段落捲完（`onLeave` → 鎖 1）                    | 100%      | 320vh (3456px)               | 32vh       |

> ⚠️ 這張表是 `SYMBOL_STOPS` / `FORUM_HANDOFF` 門檻 × `SYMBOL_VH` 的換算結果。動那三個常數要同步更新（`SymbolScene.vue` 檔內也有一份同樣的表）。
>
> 軌 A（hero 轉場 120vh）與軌 B（本段 320vh）**恰好首尾相接**：`start: 'top bottom'` 是在「sec1 底緣抵達視窗底」那一刻觸發，與本段高度無關，故不論 `SYMBOL_VH` 調多少都精準對上 pin 釋放的同一刻。合計 **440vh**。

| 元件 / 區塊                                                            | 功能                    | 說明                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SymbolFace.vue](../app/components/01a.symbol/SymbolFace.vue)          | three.js 粒子人像星空   | **實際掛在 Hero 轉場層的 slot 內**，由本段依 `symbolProgress` 指派全域 `symbolMode`（Hero 端 `v-model:mode` 綁定）。三態互斥：`disperse` 分散漂浮／`face` 集合成人像／`converge` 匯聚成點；**mode 改變時由元件自身 2.2s GSAP 補間**，故 scroll 只需在門檻「指派」離散 mode、不必逐幀 scrub 進去。<br>**本元件完全不吃 scroll**：reveal 由 IntersectionObserver 一次性啟動（3s），漂浮／滑鼠斥力／慣性物理／彩蛋宮格都在 rAF 內。<br>粒子由符號字元集組成、取自 `face.png` 的 alpha 輪廓，含滑鼠斥力真空與慣性物理（動量 ＋ 指數 ease 回位，脫離「果凍感」）。元件自帶 dev config 面板（可匯出 JSON 參數） |

---

## Section 2 — 智慧論壇 `#forum`（[Forum.vue](../app/components/02.forum/Forum.vue)）

由符號段落的 `coreIn` 交棒進場：`converge` 收斂成點時，轉場層（含粒子場）淡出、[ForumCore](../app/components/02.forum/ForumCore.vue) 的橘方塊在同一中心點淡入（crossfade），停在黑畫面；到 `coreOut` 橘核心淡出、論壇內容淡入。

### 範圍界定與核心層接力

02.forum ＝ `2652:55137`（**只有四場論壇的內容**）。核心的路徑與裝飾是它的**兄弟節點**、掛在外層 `2652:52648`。

| 在 02.forum 內             | 在 02.forum 外（核心層）                                        |
| -------------------------- | --------------------------------------------------------------- |
| 論壇一 / 二 / 三 / 四 內容 | 26px 橘方塊、`path1`、`path2`、`arrow`、`cube grame`、連接小點  |

與現有架構一致：核心路徑做成 **section 級 overlay**（`ForumCorePath`，同 `OrangeCorePath` 的做法），與內容元件解耦。

核心在論壇段是**四段接力**、不是一條線貫穿。外層 `2652:52648` 座標（總高 8743），內容位置：論壇一 231–2991、論壇二 2991–4698、論壇三 4698–7365、論壇四 7365–8623。

| 圖層                  | y 範圍      | 對應                                                    |
| --------------------- | ----------- | ------------------------------------------------------- |
| 26px 橘方塊           | 48          | 論壇一之前 ＝ core 抵達                                 |
| `path1` 857×3694      | 58 → 3752   | 論壇一全段 ＋ 論壇二前半，尾端收在 09/15 日期區          |
| 斜線 vector 104×206   | 3887        | 疑似 **09/15 的橘色「/」**（尺寸符合 132px 字級的斜槓）  |
| `path2` 814×1435      | 4082 → 5517 | 論壇二尾 → 論壇三 timetable 起點（timetable 在 5477）    |
| `arrow` 45×1194       | 5528 → 6722 | **timetable 左側的橘色分組軸**，7 段                    |
| Group 12888 243×169   | 7425        | 論壇四開頭的橘色虛線箭頭裝飾                            |
| `cube grame` 884×3224 | 461 → 3685  | 漂浮方塊群，幾乎只在論壇一區域                          |

⚠️ **`arrow` 是最大的耦合風險**：7 段高度 262/168/168/104/75/169/104 對應 timetable 的 7 個分組（3/2/2/1/1/2/1 列）。注意「跨界對談」1 列是 104、「AI與教育」1 列是 75 —— 因為對談列多了主持人／與談人兩行。**分段高度跟著渲染後的實際內容高度跑**，overlay 必須從 DOM 量分組高度回推，不能寫死。

### 四場論壇

| 場次   | 主題                               | 日期       | 地點                      |
| ------ | ---------------------------------- | ---------- | ------------------------- |
| 論壇一 | 大師談媒體 Dr. Mario García 演講   | 2026/09/09 | 台北漢來大飯店 3F 鉑金C廳 |
| 論壇二 | 台積電・跨世代共問 AI時代共答      | 2026/09/15 | 台大集思會館蘇格拉底廳    |
| 論壇三 | AI永續・AI時代永續未來共識         | 2026/09/18 | 台大集思會館蘇格拉底廳    |
| 論壇四 | 台積電文教基金會・青年永續築夢論壇 | 2026/09/30 | 成功大學國際會議中心      |

|           | 論壇一                         | 論壇二                   | 論壇三                                                        | 論壇四      |
| --------- | ------------------------------ | ------------------------ | ------------------------------------------------------------- | ----------- |
| 高度      | 2760                           | 1707                     | 2667                                                          | 1258        |
| tag       | 大師談媒體                     | 青年對話(一)             | AI永續                                                        | 青年對話(二)|
| 日期      | 2026 09/09 ⊜                   | 2026 09 15 ⊜（階梯三行） | 2026 09/18 ㊄                                                 | 2026 09/30 ⊜|
| 日期位置  | 左                             | 左（右側配地點）         | **右**                                                        | **右**      |
| desc      | ✗（改英文副標）                | ✓                        | ✓                                                             | ✓           |
| CTA       | ✗                              | 立即報名                 | 下載完整議程 ＋ 立即報名                                      | 立即報名    |
| 講者      | 1 位 ＋ **五段長 bio**（唯一） | 2 位                     | ✗                                                             | 2 位        |
| timetable | ✗                              | ✗                        | **✓ 12 列 / 7 分組**                                          | ✗           |
| 額外      | —                              | —                        | 灰底「乘載AI的鋒芒／刻下永續的年輪」＋ 融媒體世代訪談報告網站 | —           |

共同積木：tag 列、主標、desc、大型日期＋星期圓框、地點時間、講者介紹、CTA → 已抽成資料驅動的 `<ForumEvent>`；論壇三的 timetable 與灰底區塊當額外插槽（目前由 `<Agenda>` 承接）。

### 資料結構

[section2.json](../app/locales/section2.json) 已從舊的單日 `agenda.morning / afternoon / sessions[]` 改寫為：

- `forum.heading` — 段落主標（只在論壇一之前出現一次，故由 `Forum.vue` 渲染、不進 `ForumEvent`）
- `forum.events[]` — 每場的 `no / layout / tag / title / subtitle / quoteEn / year / date / weekday / venue / time / speakerLabel / speakers`（型別見 [types/forum.ts](../app/types/forum.ts)）
- `agenda.groups[]`（7 組）＋ `agenda.actions` — 論壇三的 timetable
- `report` — 融媒體世代訪談報告網站區塊

`period`（上午／下午）概念已消失。🚧 `forum.events` 目前只有 3 筆，第四場待補。

| 元件 / 區塊                                                          | 功能                                        | 說明                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.sec2__path`（路徑段）                                              | 論壇內容 ＋ 核心沿線下行                    | pc 稿 1280 基準，線與內容共用同一像素座標系（線不縮放，故尾端永遠咬住錨點）；超寬視窗只是左右留白。高度由內容自然撐開。以 `agendaRevealed` gate `opacity`：`coreOut` 前一律藏著，避免 crossfade 期間（淡出的轉場層與淡入的橘核心黑底皆未達全滿）從縫隙露餡                                    |
| [ForumEvent.vue](../app/components/02.forum/ForumEvent.vue)          | 單場論壇（資料驅動）                        | 共同積木的渲染單元，`layout` 欄位切換日期左／右版型                                                                                                                                                                                                                                            |
| [ForumCorePath.vue](../app/components/02.forum/ForumCorePath.vue)    | 論壇段核心路徑 overlay                      | 可見線＝Figma 匯出的 outline 填色 svg；驅動線 `motion`＝從可見線抽出的中心線（同一 viewBox 座標系，見 `FORUM_PATH`）。以「第幾個 `.forum-event` 的日期大字」為錨點 ＋ px 位移定位。🚧 `segs()` 目前寫死只回傳 `.pc`；`FORUM_PATH.pad` / `.mob` 為空陣列，補線稿時要同步改 `segs()` 依斷點判斷 |
| [ForumCore.vue](../app/components/02.forum/ForumCore.vue)            | converge 後「白點→橘核心」crossfade（接棒） | 滿版黑底 ＋ 置中橘方塊（沿用 `CORE` 色／尺寸，**刻意不含 hero `OrangeCore` 的形變邏輯、與其解耦**）。`forumCoreActive`（`symbolProgress ∈ [coreIn, coreOut)`）為 true → 淡入。**淡出入為固定時間（CSS `opacity` transition）＝決策「crossfade 用時間、移動綁 scrub」**；boolean 觸發、往回捲自動反向。z-index 20（高於轉場層 10、低於 Header 1000）。放在議程整組之外（不受任何 pin 的 transform 影響） |
| [Agenda.vue](../app/components/02.forum/Agenda.vue)                  | 論壇三 timetable ＋ 活動回顧                | `agendaRevealed` 才淡入。`.sec2__pin` 這個 class 名是歷史殘留（原本是 forum pin 的釘住目標，該 pin 已隨序列搬到 `SymbolScene` 而移除）                                                                                                                                                          |

### 要先問設計的兩點

1. **大型日期與 section 標題在稿上是 outline / flatten 圖層，不是 text node**：論壇二的日期是 `Union`、論壇四是 `_圖層_1`、最上方「聯合七五・智慧未來／四場系列論壇」也是兩個 `Union`。需決定重新排版（要字體與字距對稿）或匯出 SVG。
2. **橘色「/」歸哪一層**：09/15 附近那個 104×206 斜線掛在**核心層**，但 09/18 的橘斜槓在內容層找不到獨立節點，可能被併進 outline 圖層。若四個日期的斜槓都要由核心「化成」，四處都得歸核心層，內容層的日期就不能自帶斜槓。

---

## Section 3 — 永續祝福 `#blessing`（[Blessing.vue](../app/components/03.blessing/Blessing.vue)）

資料鍵 `partner`（[section3.json](../app/locales/section3.json)）。兩段構造，**不 pin** —— sticky 就夠，少一層 transform／containing block 的雷（同 `SymbolScene` 的取捨）。

| 元件 / 區塊                                                              | 功能                     | 說明                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 逐格臉屏（`.section3__face-track`）                                      | 捲動尺 ＋ sticky 滿屏    | 對應 Figma 永續祝福01–03（三張成稿的標題與內文完全相同、只有臉不同）→ 實作為一段捲動尺 ＋ 一張 sticky 橘底滿屏，臉的格號隨捲動走完 17 格。<br>⚠️ **尺高必須是 `(1 + BLESSING_VH) × 100vh`**：尺內的 sticky 畫面自己佔掉 100vh，sticky 只黏住「尺高 − 100vh」，寫成 `BLESSING_VH × 100vh` 動畫只會剩 `(BLESSING_VH − 1)` 個視窗高可跑 |
| [BlessingFace.vue](../app/components/03.blessing/BlessingFace.vue)       | 白色像素臉               | 格資料在 [blessing-face-frames.ts](../app/utils/blessing-face-frames.ts)（17 格）。格號由 `blessingFrame` 解出（**逐格、不補間**），尾端 `BLESSING_HOLD`(0.15) 這段停在最後一格。`prefers-reduced-motion` 時直接停在完成的笑臉 |
| [BlessingStairs.vue](../app/components/03.blessing/BlessingStairs.vue)   | 白色像素階梯線           | 階梯線＝hero 影片那條線的回聲。逐格進場，以 `v-model:done` 對外告知播完；使用者捲回階梯線上方時轉回 false，下次由上往下進入就重播                                                                                                                                                                            |
| [BlessingPartners.vue](../app/components/03.blessing/BlessingPartners.vue) | 夥伴祝福清單             | 策略／共創夥伴分層（`partner.tiers`），階梯線播完（`stairsDone`）才淡入。三斷點已對稿。🚧 內容為 placeholder（灰底空框 ＋「待補」），列數依 pc 稿為 4/5/2/3                                                                                                                                                  |

🚧 核心「撐滿成橘底」的進場動態未做（目前橘底是直接就在那裡）。

---

## Section 4 — 智慧「心」媒體 `#media`（[Media.vue](../app/components/04.media/Media.vue)）

資料鍵 `newmedia`（[section4.json](../app/locales/section4.json)）。容器負責編排（互動底紋、標題、內文、清單、motion 舞台），開場時間軸抽到 [useMediaIntroMotion.ts](../app/composables/useMediaIntroMotion.ts)。

| 元件 / 區塊                                                          | 功能                     | 說明                                                                                                                                                                                                       |
| -------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [MediaTitle.vue](../app/components/04.media/MediaTitle.vue)          | 標題分件                 | 「智慧 ● 媒體 → 智慧『心』媒體」的字組拆件，供 motion 時間軸個別驅動（`getEls()` 對外曝露）                                                                                                                 |
| [MediaList.vue](../app/components/04.media/MediaList.vue)            | 子頁錨點清單             | 01–06 子頁錨點列（`getRows()` 對外曝露供逐列進場）                                                                                                                                                          |
| [HeartMetaballPatch.vue](../app/components/04.media/HeartMetaballPatch.vue) | 互動底紋（現役）   | 4 塊紋理 patch 漂移重疊 ＋ metaball 場遮罩收邊。pc 追蹤游標；pad / mob 改在「內文與清單之間的留白帶」（`.media__roam` 量成相對 section 的正規化矩形）內漂移，patch 叢集含羽化外緣都不會壓到上下文字（帶塞不下時整體等比縮小） |
| motion 舞台                                                          | 開場分鏡                 | morph 色塊、兩側 bar、分裂直線（分鏡 6），由 `useMediaIntroMotion` 統一驅動                                                                                                                                 |

### 底紋版本：HeartMetaballPatch（現役）vs HeartMetaball（前一版）

兩版都以「蓋章式 metaball 場 ＋ 逐格隨機閾值」做外緣收邊與彗星尾，互動模式（pc 追游標／pad·mob 自走）也一致；差別在**場內畫什麼**。[HeartMetaball.vue](../app/components/04.media/HeartMetaball.vue) 已退出正式版面，僅留在 [demo.vue](../app/pages/demo.vue) 供對照，**調整正式底紋請改 Patch 版**。

| 面向     | HeartMetaball（前一版）          | HeartMetaballPatch（現役）              |
| -------- | -------------------------------- | --------------------------------------- |
| 版面結構 | 中心圓角方形 ＋ 外圍，共兩區     | 4 個矩形紋理 patch 拼貼                 |
| 紋理     | 變寬棋盤（1,2,3,6 帶）／線段紋   | 1 格棋盤／2 格棋盤／線段紋（設計稿三紋路） |
| 紋理分佈 | `accentBlock` 區塊逐塊換 variant | 每 patch 固定一種紋理，不換             |
| 構圖變化 | 區塊 variant 慢速換抽            | patch 在定點附近些微漂移（不生滅）      |
| 重疊交織 | 無（同一格只屬一區）             | 有（紋理透空格讓位下層 → 雙紋交織）     |
| 顆粒     | `cellSize` 14px                  | `cellSize` 4px（貼合設計稿）            |
| 橘色     | 中心 base 色、外圍藍             | 圓形核心內慢速換抽變橘                  |
| 外緣羽化 | 中心區超橢圓羽化                 | 每個 patch 各自超橢圓羽化（圓角、去方形感） |

改用 Patch 版的原因：設計稿要的是「三種紋路隨機重疊、邊緣造型隨機」，前一版的兩區結構無法產生紋理交織。細節（ROSTER 陣容、羽化參數、變橘機率場）見該檔檔頭。

🚧 核心「橘底收回成『心』的引號」的接續動態未做。

---

## 跨 Section 共用功能

常駐於 [default.vue](../app/layouts/default.vue)，作用於整個頁面。

| 元件                                             | 功能                                                                | 說明                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AppHeader.vue](../app/components/AppHeader.vue) | 頂部固定 Header（logo／錨點導覽／share／閱讀進度條）＋ 手機底部 TOC | **滾動顯示**（由 prop `autoHide` 控制）：<br>・`autoHide`（預設 true，用於**首頁**）：`#app-hero` 只要還有任一部分在畫面內就保持隱藏，hero 完全捲離後才滑入。找不到 `#app-hero` 時會重試數幀，避免內容尚未掛載時誤判。<br>・`autoHide="false"`（用於**子頁**，無 hero）：自始常駐顯示，`isVisible` 初始即 true（含 SSR），避免載入時多一次滑入動畫。<br>高度統一由 CSS variable `--header-height`（[base.scss](../app/assets/styles/base.scss)）定義，JS 與 CSS 皆取自此變數（錨點捲動偏移補償）。<br>⚠️ 顯示／隱藏動畫**不可**加在 `.app-header` 上 —— `transform` 會使其成為底部 `position: fixed` TOC 的 containing block，害 TOC 定位跑掉；上方列與底部 TOC 需各自做位移 |
| [AppFooter.vue](../app/components/AppFooter.vue) | 頁尾                                                                | 資料自 [footer.json](../app/locales/footer.json)                                                                                                                                                                                                                                                                                                                                                                        |
| [useAppSound.ts](../app/composables/useAppSound.ts) | 全站音效／靜音狀態                                              | 有聲播放必須綁在使用者手勢上 → 由 `HeroStart` 的 start 按鈕開啟                                                                                                                                                                                                                                                                                                                                                          |
| `--scrollbar-width`                              | 捲軸寬度量測                                                        | 由 `plugins/scrollbar-width.client.ts` 量測寫入。捲動鎖期間補回 `padding-right`，否則解鎖時捲軸回來會撐出水平捲軸                                                                                                                                                                                                                                                                                                        |

---

## 待辦（🚧）

| 項目                          | 現況與缺口                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 影片內的橘核心                | main/loop/outro 期間 core `opacity:0`、不可見；「從影片就延續在場」尚未實作。core 淡入點仍是第一屏正中央（舊稿 placeholder），待正式影片到位後對齊階梯線缺口（設計稿約 x 515/1280） |
| 引言逐行淡出                  | 分鏡 ① 看起來是文字**由上而下**隨 core 經過而淡，目前是整段一起淡                                                        |
| `CORE.dotSize`                | 程式 24px、設計稿 26px（`OrangeCore` / `ForumCore` 的 SCSS 亦寫死 24）。尺寸對稿待辦                                     |
| `SYMBOL_STOPS` 四拍文案       | 目前三態無文案；設計稿的四拍各帶文案（含 06 半調點陣臉 / 07 符號字元臉兩種臉）                                           |
| 論壇段核心移動                | 僅完成 `coreIn`/`coreOut` 的 handoff crossfade；沿 `path1`/`path2` 的移動未實作。設計線仍是 placeholder；需決定接成一條連續 path（維持「一條 path 一個 tween、接縫零頓挫」）或拆兩個 ScrollTrigger |
| `ForumCorePath` 的 RWD        | `segs()` 寫死只回傳 `.pc`；`FORUM_PATH.pad` / `.mob` 為空陣列。補線稿時要同步改 `segs()` 依斷點判斷，否則填了不生效       |
| `arrow` 分組軸                | timetable 左側 7 段橘色軸尚未實作；必須從 DOM 量分組高度回推，不能寫死                                                   |
| `forum.events` 第四場         | 目前只有 3 筆                                                                                                          |
| 夥伴 logo 與祝福文案          | 尚未提供，清單全為 placeholder                                                                                          |
| 核心進出場（Section 3／4）    | 橘底撐滿 ／ 收回成「心」的兩段動態未做                                                                                  |
| trail dots / reduced-motion   | core 沿途殘影、手機版直式 path、`prefers-reduced-motion` 直接定位起終點皆未做                                            |

---

## 待確認（設計）

1. **06 → 07 是同一套粒子嗎**：06 是半調點陣臉、07 是符號字元臉。現有 SymbolFace 的粒子由 `src` 圖的 alpha 取樣建出，換 `src` 會重建整個系統、無法無縫過渡。需確認是「同一套粒子換 render（點→字元）」還是「06 為獨立圖層與 07 做 crossfade」。
2. **永續祝福的橘底怎麼來**：設計稿只給靜態幀，推測是核心撐滿全屏，缺中間張佐證。
3. **mob / pad 分鏡**：本檔分鏡僅依 `主頁_pc`。
4. **永續祝福的內文文案**：pc 稿 `2065:140462` 用「聯合報系攜手企業盟友，…」，pad 稿 `2065:125534` 用「世代更迭，初心不變。…」。目前程式取後者（`section3.json` 的 `partner.body`），待設計確認。
5. **永續祝福標題字級**：Figma 把「永續祝福」做成外框向量，程式以文字實作（pc 72/104、pad 52/70、mob 56/74 為回推值），待視覺確認；若差異過大改匯出 SVG 字標。
6. **大型日期／section 標題的 outline 圖層**與**橘色「/」的歸屬**：見 Section 2「要先問設計的兩點」。
