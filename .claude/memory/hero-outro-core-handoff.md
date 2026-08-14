---
name: hero-outro-core-handoff
description: hero 退場結束時 orange core 的兩種進場（影片交棒／從上緣滑入）：anchor 在 config、cover 換算 + 旋轉補償在 hero-core-handoff.ts
metadata:
  type: project
---

`outro → gone` 是 orange core 的進場時機，`Hero.vue` 的 `runCoreEntrance()` 依「影片還在不在畫面上」二選一。落點永遠是 `OrangeCorePath` 驅動的位置（恆在視窗 50vh，見 [[hero-core-screen-locked]]），這裡只決定「從哪裡滑過來」；位移寫在內層 `.sec1__orange-core-dot`，外層仍歸 path 管、兩邊不互撞。

**影片在畫面上 → 交棒**（`HERO_CORE_HANDOFF`，0.55s）。退場段最後幾秒影片畫面裡就有一顆 orange core，直接淡入會跳一下；把 DOM core 疊到影片那顆身上（位置＋尺寸）再滑回落點。前提是 outro 期間鎖住捲動（見 [[hero-body-lock-rules]] 拍 ⑧）—— 影片與視窗維持 1:1，落點才可推算。

**影片已捲出視窗 → 從畫面上緣滑入**（`HERO_CORE_DROP_IN`，0.9s，比交棒長因為要走約半個視窗高）。走到這條的是**倒帶那條路**：`hasLeftLoop` 為 true 之後不重新上鎖，再往下滑影片就會被捲走。那時沒有可對齊的目標，硬套交棒會讓 core 從幾千 px 外飛進來。判斷用 `isVerticallyOnScreen()`；影片只剩一角露在上緣時**仍走交棒** —— 算出來的起點自然落在畫面外偏上，與滑入是連續的。

**⚠️ 配套：hero 捲出視窗 → `HeroVideo` 的 `heroIO` 強制進 `gone`。** core 綁在 `gone` 上（`Hero.vue` 的 `coreVisible`），少了這條會有兩個症狀：①退場播到一半被捲走，還要等剩下的秒數 core 才出現；②倒帶回 `loop` 後用**捲軸／End 鍵**跳走（沒有 wheel 手勢 → 永不進 `outro`），影片在畫面外無限循環、**core 永遠不出現**。所以 `runCoreEntrance(fromOutro)` 的旗標不能改回 `prev === 'outro'` 判斷 —— 強制收尾時 `prev` 可能是 `loop`。

**How to apply:**

- 影片剪輯換了 → 只改 `HERO_OUTRO_CORE_ANCHOR`（`~/utils/hero-video-config`）。座標是**影片畫面**的正規化比例（pc 版畫面 1920×1080），不是螢幕比例；換視窗尺寸／斷點都不必重量。預設 `{0.5, 0.5, 39/1920}` ＝ 畫面正中心、在 1280×720 視窗上剛好 26px。
- **不能直接拿元素矩形的比例算**：`<video>` 是 `object-fit: cover`，畫面被等比放大並裁掉溢出部分。換算在 `~/utils/hero-core-handoff` 的 `coverAnchorToScreen()`（有單元測試）。視窗越高，影片被 cover 放得越大、畫面裡那顆 core 在螢幕上就越大（1280×871 實測 31.45px 而非 26px）——尺寸也要跟著換算，不能寫死。改 SCSS 的 `object-position` 要一起改那裡的 `objectPosition` 參數。
- **旋轉補償不可省**：`OrangeCorePath` 在 core 外層寫入路徑切線 `rotation`（hero 段恆 90°），子層的 translate 會跟著轉，故要先過 `unrotateDelta()` 換回 local 座標 —— 少了它，水平位移會整個跑到垂直方向去（實測差 320px）。
- SKIP（`main`/`loop` → `gone`）**兩種都不做**：那時影片還沒播退場，維持單純淡入。`prefers-reduced-motion` 也跳過。
