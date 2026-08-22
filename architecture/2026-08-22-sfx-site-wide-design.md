# 全站音效佈建 — 設計與決策紀錄

日期：2026-08-22
狀態：**設計已定案，尚未實作**
相關檔案：`public/sounds/*.mp3`、`app/utils/sound-manifest.ts`、`app/composables/useSfx.ts`、
`app/composables/useAppSound.ts`、`app/components/AppSfx.vue`、
`app/components/ui/AppHeader*.vue`、`app/components/01.hero/HeroSymbolTransition.vue`、
`app/components/01a.symbol/SymbolIntro.vue`、`SymbolFace.vue`、
`app/components/02.forum/{Agenda,AgendaReport,ForumEvent,ForumHighlights,ForumCorePath}.vue`、
`app/components/03.blessing/{Blessing,BlessingStairs,BlessingPartners}.vue`
來源：設計師逐段截圖標註（9 批，2026-08-22）

---

## 〇、既有機制（本次不重做）

| 層 | 檔案 | 職責 |
|---|---|---|
| 清單 | `app/utils/sound-manifest.ts` | key → 檔名，型別 `SoundKey` |
| 播放 | `app/composables/useSfx.ts` | `play/stop/stopAll` ＋ `prime/unlock/release` |
| 開關 | `app/composables/useAppSound.ts` | `soundOn`（全站唯一，hero start 閘門 ＋ header 按鈕） |
| 宿主 | `app/components/AppSfx.vue` | 掛在 `app.vue`，負責預載／iOS 解鎖／卸載 |
| 測試 | `test/sound-manifest.spec.ts` | manifest ↔ `public/sounds/` 雙向對照 |

`play()` 的既有語意：**soundOn 關閉時 no-op；重複觸發時 `currentTime` 歸零重播、不疊音。**
本次沿用，不改。

---

## 一、關鍵查證：音檔其實都是 2–3 秒的 one-shot

規劃期間一度假設那四支 600 KB 的新音檔是長背景音，因而考慮替 `useSfx` 加 loop／fade。
**查證後推翻。** 環境無 ffmpeg，改由 MP3 frame header 推算：

| 檔案 | 檔案大小 | ID3 標籤 | 實際音訊 | 位元率 | 時長 |
|---|---|---|---|---|---|
| `udn75_sfx01_01.mp3` | 3 KB | 0 | 3 KB | 64 kbps | **0.40s** |
| `udn75_sfx_ai_face_bg.mp3` | 619 KB | **509 KB** | 110 KB | 320 kbps | **2.81s** |
| `udn75_sfx_ai_face_text.mp3` | 599 KB | **509 KB** | 90 KB | 320 kbps | **2.30s** |
| `udn75_sfx_benediction_line.mp3` | 599 KB | **509 KB** | 90 KB | 320 kbps | **2.30s** |
| `udn75_sfx_benediction_smile.mp3` | 636 KB | **509 KB** | 128 KB | 320 kbps | **3.26s** |

**結論一：都是 one-shot，`useSfx` 的既有語意夠用，不加 loop／fade。**

**結論二：四支各夾帶 509 KB 的 ID3 標籤（內含 129 KB 的 APIC 封面圖），音訊本體只佔 15–20%。**
`AppSfx` 的 `prime()` 在每次頁面載入就把全部抓下來，故這約 2 MB 是全站首載的淨浪費。

---

## 二、使用者裁決（逐條確認）

| # | 決策點 | 選擇 |
|---|---|---|
| 1 | BlessingPartners 的音效語意（口述「出現時」vs 標註「hover & click」） | **每列 hover ＋ click**（依標註） |
| 2 | 紙飛機段（口述「變成紙飛機時」vs 標註「撞擊點」） | **只在變身那一刻響一聲** |
| 3 | 手機（無真實 hover）要不要出 hover 聲 | **要**，全站 hover 音不加斷點守衛 |
| 4 | 彩蛋自動換句（每 ~3s）要不要出聲 | **不要**，只有使用者 hover/tap 才響 |
| 5 | ID3 標籤那 2 MB | **剝掉標籤、改寫 `public/sounds/` 的檔案**（原檔先備份） |

### 未經詢問、直接沿用既有慣例的規則

**捲動驅動音效一律「前進觸發、倒退靜音」。** 依據是 `ForumCorePath.vue:472` 的既有寫法
`turnLens.some((t) => t > prev && t <= len)` —— 往回捲時 `len < prev`，區間為空故不出聲；
回頭再往下捲會再響一次。全站新增的捲動音效都照這條，不另立規則。

### 已更正的錯誤前提

規劃初期曾把 `SubpageWorks.vue:136` 的 `hoverMode` 守衛描述成「手機不出 hover 聲」，
並據此說它與 `MediaList` 不一致。**這是錯的。** <1280 時該清單沒有 hover 路徑，
列是**捲到畫面中央自動浮出**的，守衛擋的是捲動觸發、不是手機的 hover。
兩處並不矛盾，該守衛**維持原狀不動**。

---

## 三、新機制：捲動／動畫驅動的單次觸發

第 5.2 節的八個動畫觸發點裡，有七個是同一種形狀：**某個 reactive 值往前跨過門檻 → 響一次。**
（F3 是使用者驅動、不是捲動驅動，直接呼叫 `play()` 即可，不走新機制。）
`useSfx` 現在只有「呼叫就播」，沒有這個能力。

新增 `app/composables/useSfxCue.ts`：

| API | 語意 | 用於 |
|---|---|---|
| `cueOn(source, key)` | `false → true` 響一次；倒退靜音；來回會再響 | F1、F2、F4、E1、B1、B2 |
| `cueOnChange(source, key)` | 值一變就響 | A1（Agenda 箭頭） |

邊緣判定本身是純邏輯，抽進 `app/utils/` 讓 vitest 直接跑 ——
比照專案既有切法（量測在元件、規則在 utils，見 `forum-path-turns.ts`）。

**reduce-motion：動畫不跑就不出聲。** B1／B2 在該模式下直接跳到完成格
（`useOrangeCoreProgress.ts:294`、`BlessingStairs.vue` 的 `onMounted` 分支），
故 cue 不得觸發。

### 長音互斥

新的四支是 2–3 秒，各自持有獨立 Audio 物件，天然會疊在一起。
規則：**播其中一支之前，先停掉另外三支。** `sfx01`（0.4s）不受影響，維持現有行為。

---

## 四、音檔與 manifest

剝 ID3（只動 metadata，不重新編碼音訊），原檔備份到 `temp/sounds-backup/`。
2.45 MB → 約 440 KB。

```ts
export const SOUND_MANIFEST = {
  sfx01: 'udn75_sfx01_01.mp3',
  aiFaceBg: 'udn75_sfx_ai_face_bg.mp3',
  aiFaceText: 'udn75_sfx_ai_face_text.mp3',
  benedictionLine: 'udn75_sfx_benediction_line.mp3',
  benedictionSmile: 'udn75_sfx_benediction_smile.mp3',
} as const;
```

⚠️ `test/sound-manifest.spec.ts` **目前是紅燈**（四支檔在硬碟上卻沒登記，orphans 檢查失敗）。
這一步就會讓它轉綠 —— 實作時應先確認它確實從紅轉綠，而不是一開始就綠。

---

## 五、掛載點總表（21 處，其中 M1 與 P1 已實作 → 待做 19 處）

### 5.1 hover ＋ click（一律 `sfx01`，無斷點守衛）

| # | 位置 | 元素 | 現況 |
|---|---|---|---|
| H1 | `ui/AppHeader.vue:440,456` | logo（首頁 `<a>` ／子頁 `<NuxtLink>` **兩份都要**） | 新增 |
| H2 | `ui/AppHeaderNav.vue:42,58` | 三個 nav 連結（同樣兩份） | 新增 |
| H3 | `ui/AppHeaderSound.vue:9` | 音效開關 | 新增，見下方特例 |
| H4 | `ui/AppHeaderShare.vue:76` | share 展開鈕 | 新增 |
| H5 | `ui/AppHeaderShare.vue:59` | 展開後的各分享連結 | 新增 |
| H6 | `ui/AppHeader.vue:485` | 漢堡選單開關 | 新增 |
| H7 | `ui/AppHeaderMenu.vue:134,148,157` | 選單項目 ＋ scrim | 新增 |
| A2 | `02.forum/Agenda.vue:217` | 「下載完整議程」「立即報名」 | click ✅／補 hover |
| A3 | `02.forum/AgendaReport.vue:30` | 「融媒體世代訪談報告網站」 | click ✅／補 hover |
| E2 | `02.forum/ForumEvent.vue:128` | 「立即報名」 | click ✅／補 hover |
| G1 | `02.forum/ForumHighlights.vue:35` | 「閱讀完整報導」（`v-for` 出來的 `<a>`，含箭頭圓鈕，整顆掛一次） | 新增（連 `useSfx` 都未 import） |
| B3 | `03.blessing/BlessingPartners.vue` | 每列企業祝福詞 | 新增 |
| M1 | `04.media/MediaList.vue:56,57` | 類分頁選單各列 | ✅ **已實作** |

**H3 特例**：`play()` 讀的是 `soundOn`，故「開」那一下會響、「關」那一下被自己擋掉。
決定：**開 → 響一聲當確認音；關 → 不響**（使用者剛要求安靜，不該再出聲）。不做對稱處理。

### 5.2 動畫觸發（新機制）

| # | 位置 | 觸發點 | 音效 |
|---|---|---|---|
| F1 | `01.hero/HeroSymbolTransition.vue` | `p` 從 0 → >0（方塊遮罩轉場開始） | `aiFaceText` |
| F2 | `01a.symbol/SymbolIntro.vue` | 三行 reveal 開始（`gate()` 翻轉，`state.elapsed` null → 0），整段**一次** | `aiFaceText` |
| F3 | `01a.symbol/SymbolFace.vue:309` | 使用者 hover／tap 換格（`runScramble`）；**自動換句靜音** | `aiFaceText` |
| F4 | `01a.symbol/SymbolFace.vue` | `convergeAmount` 從 0 → >0（粒子收攏） | `aiFaceBg` |
| E1 | `02.forum/ForumCorePath.vue` | `planeFrame` 0 → 1（`swapLen`，變身成紙飛機） | `sfx01` |
| A1 | `02.forum/Agenda.vue` | `activeSlot` 每次換格 | `sfx01` |
| B1 | `03.blessing/Blessing.vue` | `blessingFrame` 0 → 1 | `benedictionSmile` |
| B2 | `03.blessing/BlessingStairs.vue` | 逐格動畫開始 | `benedictionLine` |

**已實作、不動**：P1 `ForumCorePath.vue:472` 的撞擊點（`FORUM_TURN_SFX`）。

---

## 六、實作注意事項

1. **`BlessingStairs.vue` 命名衝突** —— 該檔內部已有一個叫 `play` 的函式（逐格動畫的啟動器）。
   `useSfx()` 解構時必須 alias，例如 `const { play: playSfx } = useSfx()`。

2. **`useSfx()` 必須在 setup 期間取** —— 它此刻要讀 runtimeConfig（見 `useSfx.ts` 註解）。
   所有新掛載點沿用既有寫法，不可在 event handler 裡才呼叫 `useSfx()`。

3. **A1 不節流** —— `activeSlot` 以 `STEP_MS = 100` 一次走一格去追目標，快速捲動會連發。
   逐格追趕本來就是刻意設計成看得見的，每格出聲符合「每個箭頭的音效」的標註。
   若實測過吵，再回頭加節流。

4. **B1 觸發點取 `frame 0 → 1` 而非 `progress > 0`** —— 第 0 格是一塊白方塊、還不是臉。

5. **B2 的重播規則** —— `BlessingStairs` 只在使用者捲到階梯線**上方**時才 `reset()`，
   由下往上進入維持完成狀態。音效跟著這個規則走，故來回捲會重播一次。

---

## 七、後續事項（不在本次範圍）

**P1 撞擊點時機盤點**（使用者指定「之後再盤點」）：
逐一比對實際撞擊點與 `pickTurns` 選出的轉折，找出時機錯誤或漏掉的點，pc／pad／mob 三個斷點各自要看。

⚠️ 已知疑點：`pickTurns` 的說明寫著它吃的是 `FORUM_FRONT_NODES[bp]`（＝**議程之前**那一段）的節點，
而紙飛機是 `swapLen`（論壇四之後）才變身。若候選節點未涵蓋後半段，
紙飛機那段的轉折不是「時機不對」而是**從未進過候選**。盤點時應先驗這一條。

旋鈕在 `app/utils/forum-path-turns.ts`：
`FORUM_TURN_SAMPLE_LEN = 8`、`FORUM_TURN_MIN_ANGLE_DEG = 90`、`FORUM_TURN_MIN_GAP_LEN = 300`。
