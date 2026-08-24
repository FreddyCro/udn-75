# 交棒的同一屏就要看到論壇主標

2026-08-22 定案、**已實作**。
需求原話：「symbol face 聚合 orange core 後，視窗內要看到下方論壇的文字資訊。」

範圍：`01a.symbol`（捲動尺的 end）／`app/utils/orange-core-config.ts`（拍點與門檻）／
`02.forum`（ForumCore 的滿版白底移除）。

| 檔案 | 改了什麼 |
| --- | --- |
| `app/utils/orange-core-config.ts` | 新增 `SYMBOL_HOVER_VH`、`SYMBOL_RAIL_VH`、`SEAM_AT_HANDOFF_VH`、`AGENDA_IN_LEAD_VH`；`SYMBOL_VH` 改為推導值（尺長 − 懸停期）；`SYMBOL_BEAT_VH.handoff` 0.4 → 0.1；`FORUM_HANDOFF.agendaIn` 改由 `coreIn` 反推；移除 `AGENDA_OFFSCREEN_VH`；`SEQUENCE` 移除 `hover` part |
| `app/components/01a.symbol/SymbolScene.vue` | 捲動尺 `end: 'bottom bottom'` → `'bottom center'`；時序表重寫 |
| `app/components/02.forum/ForumCore.vue` | 移除 `.forum-core__bg`（滿版白底）與 `active` prop，只剩橘點 |
| `app/composables/useOrangeCoreProgress.ts` | 移除 `forumCoreActive` |
| `app/components/02.forum/Forum.vue`、`DevCoreProgress.vue` | 跟著撤掉那個旗標 |
| `test/symbol-sequence.spec.ts` | 換掉「議程淡入距段尾 32vh」那條不變量；新增一組「交棒那一刻的接縫位置」 |

---

## 一、問題：那 90vh 不是節奏，是空白

改版前，交棒點（`coreIn`，粒子收攏成橘 core、轉場層交棒給 `ForumCore`）之後還有：

- `handoff` 那一拍的 **40vh** —— 滿版白底 ＋ 中央一顆 26px 橘方塊，下方什麼都沒有；
- 無軌的「懸停期」**50vh** —— 接縫（`.sec2` 頂端）從視窗底緣升到視窗中央。

論壇主標又在接縫下方 140px（`.sec2__path` 的 `padding-top`）。換算到 1440×700：
交棒那一刻主標頂端在視窗底緣**下方 53vh**、要捲到 66vh 之後才讀得完整。

## 二、為什麼「調符號段的長度」修不掉

接縫在 progress `p` 時的螢幕高度是

```
接縫 y = SYMBOL_VH + 1 − p × 尺長          （單位：視窗高）
```

改版前尺長 ＝ 段高（`end: 'bottom bottom'`），代入 `coreIn = BEAT_END.converge / 尺長`：

```
接縫 y @coreIn = SYMBOL_VH + 1 − BEAT_END.converge
               = 1 + SYMBOL_BEAT_VH.handoff        ← 總長被約掉了
```

也就是說**交棒點到接縫的距離恆等於 `handoff` 那一拍，與總長無關**。
拉長或縮短 disperse / face / converge 一點用都沒有；而 `handoff` 當時的下限是
`AGENDA_OFFSCREEN_VH`（32vh）＋ 8vh 停留，最多只能省 8vh。
更根本的是 `end: 'bottom bottom'` 的構造保證：**`p < 1` ⟺ 接縫在視窗底緣以下**，
而 `coreIn` 恆 `< 1` —— 就算把 `handoff` 壓到 0，接縫也只是剛好貼在底緣，
主標仍在 140px padding 之下。

⇒ 這件事**不可能**用「調 symbol face scroll height」達成。要動的是尺的 end 對齊。

## 三、方案：把懸停期併進尺內

`end: 'bottom bottom'` → **`'bottom center'`**。於是

```
尺長 SYMBOL_RAIL_VH = 四拍總和 = 3.34（334vh）      ← 所有門檻的分母
段高 SYMBOL_VH      = 尺長 − SYMBOL_HOVER_VH = 2.84（284vh）
接縫 y @coreIn      = SYMBOL_HOVER_VH + handoff = 0.6（60vh）＝ SEAM_AT_HANDOFF_VH
```

`p = 1` 的意義從「段落捲完」變成「接縫抵達視窗中央」—— 而那正是
`ForumCorePath` 的 `start: 'top center'`，兩軌因此仍然首尾相接、路徑接手零跳點
（實測交棒前後兩顆核心都在 `(712, 350)`，同一像素）。

那 50vh 不再是 `drive: 'none'` 的無軌區間，`SEQUENCE` 的 `hover` part 隨之刪除。
它當年保留的「符號段黑底 → 論壇段白底」換色延伸點，早已由 2026-08-17 的
`CORE_WARM_VH` 窗口實作掉了。

### 新的順序（vh 為距尺起點）

| vh | 事件 | 畫面上 |
| --- | --- | --- |
| 248→304 | `converge` 收攏成一顆**白** core | 黑底；**284vh 處接縫越過視窗底緣**（躲在轉場層底下，看不見） |
| 304 | `agendaIn` | 論壇主標／議程開始那 0.4s 淡入 —— 在轉場層底下跑完 |
| 304→324 | `CORE_WARM` 白 core → 橘 ＋ 底色黑→白 | 顏色在 55% 處收齊、底色殿後到 1 |
| **324** | **`coreIn` 交棒** | 轉場層淡出（0.35s）→ **接縫在 60vh、論壇主標在 73–92vh，同一屏就看得到** |
| 324→334 | `handoff` 停留 | 橘點不動，接縫 60vh → 50vh |
| 334 | 尺捲完 | 論壇段路徑接手 |

頁面總高比改版前少 **80vh**（原本 364 + 50，現在 284 + 50）。

## 四、為什麼接縫可以在交棒前就升上來（而且不必怕露餡）

三件事同時成立才做得到，缺一不可：

1. **轉場層是不透明的滿版 fixed**（`HeroSymbolTransition`，z-index 10），
   一路蓋到 `coreIn` 才淡出。接縫在 284vh 越過底緣、論壇內容在 304vh 淡入，
   兩件事都發生在它底下，**看不見**。
2. **這一段本來就全是白的**：`CORE_WARM` 結束時 canvas 底色已是白，
   `.sec-symbol--light` 是白，`.sec2` 是白 —— 所謂「黑白接縫」在這個階段
   只是座標概念，畫面上沒有任何可見的線。
3. **交棒是硬切**（同色同尺寸同位置），提前或延後都看不出來。

## 五、順帶移除：`.forum-core__bg`

那層 fixed 滿版白底（吃 `[coreIn, coreOut)`）的任務是「保證交棒這段是白的」。
在新順序下它變成**唯一擋住論壇主標的東西** —— 而它要保證的白，上面第 2 點已經
由 `.sec-symbol--light` 與 `.sec2` 自己成立了，是可證明的冗餘。故整層移除，
`forumCoreActive` 一併撤掉，`ForumCore` 只剩那顆橘點。

副作用是好的：它 0.4s 的 CSS 淡出與 `symbolBgLightAt` 吃捲動不同步，
原本會在「快速往回捲」時看到短暫的灰（半透明白疊在正在轉黑的底上）——
那個已知殘留風險跟著消失了。

`coreOut` 保留 `1.0`，語意收窄成「**無設計線的斷點**上橘點的收場點」，
與有設計線時路徑接手的那一刻同時。

## 六、新的不變量（`test/symbol-sequence.spec.ts`）

被換掉的：~~議程淡入距段尾至少 32vh（發生在畫面外）~~ —— 接縫現在在交棒前就進畫面了，
「畫面外」這個判準已不成立。

新的四條：

| 守什麼 | 為什麼 |
| --- | --- |
| 段高 ＝ 尺長 − 懸停期 | 尺的 `end: 'bottom center'` 與段高的關係 |
| 接縫高度 ＝ 懸停期 ＋ handoff（式子裡沒有總長） | 把第二節那個推導寫成測試，下次有人想「調長度解決」時會撞到它 |
| 接縫距視窗底留得下主標（1440×700 需要 38vh） | 需求本體。硬寫 38：`padding-top` 140px ＋ 兩行主標到字形底緣 265.7px ÷ 700 |
| 交棒後停留蓋得住轉場層那 0.35s 淡出 | `handoff` 的下限 —— 沒跑完就換路徑核心接手，中央會同時有兩顆 |
| 議程淡入的前置距離換算成秒數 ≥ 0.4s | 換掉的那條的新版本；遮蔽物從「畫面外」改成「轉場層」 |

`38` / `0.4` / `0.35` 都是**刻意硬寫**的：它們分別來自 CSS 與字形素材的尺寸，
程式讀不到。改 `.sec2__path` 的 `padding-top`、主標行數／字級、或那兩個 CSS
transition，都要回頭改測試。

## 七、實測

1440×700（最矮的實測尺寸，也是最緊的）與 375×667 都在交棒那一刻兩行主標完整可見：

| 尺寸 | 接縫 | 主標 | 視窗高 |
| --- | --- | --- | --- |
| 1440×700 | 418px（0.6vh） | 558 → 694px | 700（餘 6px） |
| 375×667 | 400px（0.6vh） | 517 → 619px | 667（餘 48px） |

⚠️ 1440×700 只剩 6px 餘裕。`SEAM_AT_HANDOFF_VH` 不得再往上調（測試守著 0.62 的上限），
要調就得同時縮 `.sec2__path` 的 `padding-top` —— 但那 140px 同時是設計線的座標原點
（見 `forum-node-path.md` 第五節），動它會讓整條線的 y 位移。
