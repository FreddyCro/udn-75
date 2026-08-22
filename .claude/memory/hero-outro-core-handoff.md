---
name: hero-outro-core-handoff
description: hero 退場結束時 orange core 的兩種進場（影片交棒／從上緣滑入）：anchor 在 config、cover 換算 + 旋轉補償在 hero-core-handoff.ts
metadata:
  type: project
---

`outro → gone` 是 orange core 的進場時機，`Hero.vue` 的 `runCoreEntrance()` 依「影片還在不在畫面上」二選一。落點永遠是 `OrangeCorePath` 驅動的位置（恆在視窗 50vh，見 [[hero-core-screen-locked]]），這裡只決定「從哪裡滑過來」；位移寫在內層 `.sec1__orange-core-dot`，外層仍歸 path 管、兩邊不互撞。

**影片在畫面上 → 交棒**（`HERO_CORE_HANDOFF`，0.55s）。退場段最後幾秒影片畫面裡就有一顆 orange core，直接淡入會跳一下；把 DOM core 疊到影片那顆身上（位置＋尺寸）再滑回落點。前提是「影片與視窗維持 1:1」，落點才可推算 —— 2026-08-16 起這是由 `.sec1__hero` 的 `position: sticky` 提供的（不再是捲動鎖）。

**影片已捲出視窗 → 從畫面上緣滑入**（`HERO_CORE_DROP_IN`，0.9s，比交棒長因為要走約半個視窗高）。走到這條的是「退場播完解鎖後、影片還在畫面上時捲很遠」那條路（捲軸／End 鍵）。那時沒有可對齊的目標，硬套交棒會讓 core 從幾千 px 外飛進來。判斷用 `isVerticallyOnScreen()`；影片只剩一角露在上緣時**仍走交棒** —— 算出來的起點自然落在畫面外偏上，與滑入是連續的。

**⚠️ 配套：hero 捲出視窗 → `HeroVideo` 的 `heroIO` 強制進 `gone`。** core 綁在 `gone` 上（`Hero.vue` 的 `coreVisible`），少了這條會有兩個症狀：①退場播到一半被捲走，還要等剩下的秒數 core 才出現；②解鎖後用**捲軸／End 鍵**跳走（scrub 來不及判定就已離開視窗），影片在畫面外停著、**core 永遠不出現**。所以 `runCoreEntrance(fromOutro)` 的旗標不能改回 `prev === 'outro'` 判斷 —— 強制收尾時 `prev` 可能不是 `outro`。

**How to apply:**

- 影片剪輯換了 → 只改 `HERO_OUTRO_CORE_ANCHOR`（`~/utils/hero-video-config`）。座標是**影片畫面**的正規化比例（pc 版畫面 1920×1080），不是螢幕比例；換視窗尺寸／斷點都不必重量。預設 `{0.5, 0.5, 39/1920}` ＝ 畫面正中心、在 1280×720 視窗上剛好 26px。
- **不能直接拿元素矩形的比例算**：`<video>` 是 `object-fit: cover`，畫面被等比放大並裁掉溢出部分。換算在 `~/utils/hero-core-handoff` 的 `coverAnchorToScreen()`（有單元測試）。視窗越高，影片被 cover 放得越大、畫面裡那顆 core 在螢幕上就越大（1280×871 實測 31.45px 而非 26px）——尺寸也要跟著換算，不能寫死。改 SCSS 的 `object-position` 要一起改那裡的 `objectPosition` 參數。
- **旋轉補償不可省**：`OrangeCorePath` 在 core 外層寫入路徑切線 `rotation`（hero 段恆 90°），子層的 translate 會跟著轉，故要先過 `unrotateDelta()` 換回 local 座標 —— 少了它，水平位移會整個跑到垂直方向去（實測差 320px）。
- SKIP（`main` → `outro`，退場沒播完就被捲走時的 `gone`）**兩種都不做**：那時影片還沒播退場，維持單純淡入。`prefers-reduced-motion` 也跳過。

**2026-08-22 補充（順播 ＋ frame 0 歸零）**：`gone` 那一刻 `HeroVideo` 會把 `<video>.currentTime` seek 回 0（使用者裁決「回捲不要看到 outro」）。交棒**不受影響** —— `runCoreEntrance()` 讀的是 `<video>` 的幾何（元素矩形 ＋ `HERO_OUTRO_CORE_ANCHOR`）與 `videoWidth/Height`，不是畫面上的像素；而那一刻影片已被硬切藏起來，seek 沒有人看得到。另外退場現在是由正片**順播**進來、且播完才解鎖，故「退場播到一半被捲走」只可能發生在按過 SKIP 的人身上。

**⚠️ 層序陷阱（2026-08-22 實測釘死）**：`.sec1__hero` 是 `position: sticky` ⇒ **建立堆疊脈絡**，所以影片舞台的 `z-index: 4` 只在脈絡內部有效；`.sec1__hero` 對外是 `z-index: auto`（＝0），**輸給** `.sec1__orange-core` 的 2 與 `.sec1__scene` 的 3。也就是 **DOM core 與引言其實都畫在影片之上**（實測：把引言強制 opacity 1 之後，重疊點的最上層是 `.sec1__intro-p`）。`HeroVideo.vue` 原本主張「舞台 z-index 4 蓋住引言，這是整個遮擋機制的全部」是錯的 —— 真正的遮擋是**引言自己的 opacity 0** 與**舞台的 opacity 閘門**。

實際咬到的症狀：影片進 `gone` 時 seek 回 frame 0（而 frame 0 正中央就有一顆橘塊，佔畫面寬 6.15%，是退場尾幀那顆的 3.7 倍），回捲時 `p < 1` 又讓舞台亮回來 ⇒ **兩顆橘塊同時在畫面上**（大的是影片裡的、小的是 26px DOM core）。修法是 `applyDissolve` 的 `revealed` 多一條「交棒過（`outroSpent`）且不在 `main` 就一律隱藏舞台」。同一成因還有一條更早存在的路徑：`heroIO` 強制進 `gone` 時 `p` 可能還 < 1。

**改動 core 或影片層的顯隱／層序時，先回來讀這一段。**
