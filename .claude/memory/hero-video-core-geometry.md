---
name: hero-video-core-geometry
description: 三支開場影片裡那顆 orange core 的實測幾何（首幀／尾幀），以及「hero 各層必須站在 --vh 這把尺上」這條規則
metadata:
  type: project
---

2026-08-26 用 headless Chrome 逐格解三支剪輯、掃橘色 bbox 量出來的**真值**。要改進場／退場交棒之前先讀這一份，不要憑設計稿推。

## 影片裡那顆 core（source px，各自的畫面解析度）

| | 畫面 | 首幀 | 靜止到 | 尾段收在 | 收定於 |
| --- | --- | --- | --- | --- | --- |
| pc | 1920×1080 | **64px** @ (0.5, 0.5) | t=0.4s | **26px** @ (0.5, **0.5**) | t≈38.8s |
| pad | 1024×1364 | **64px** @ (0.5, 0.5) | t=0.4s | **17px** @ (0.5, **0.5**) | t≈38.9s |
| mob | 720×1280 | **64px** @ (0.5, 0.5) | t=0.4s | **18px** @ (0.5, **0.4711**) | t≈38.9s |

- **首幀三支都是 64 source px**（不是同一個畫面比例）⇒ 畫面上的邊長 ＝ 64 × fit 放大倍率，隨視窗連續變化：1280×720 42.7px、1920×1080 64px、2560×1440 85.3px、768×1024 48px、390×844 34.7px。t=0.45 才開始長大（t=1 → 104、t=1.1 → 316），故 `EXIT_DURATION` 0.45s 剛好卡在靜止窗口內、**不能再加長**。
- **尾幀**：核心是由畫面下方往上收的。`HERO_VIDEO_SEGMENTS.outro.end = 38.5` 停在**移動中**（pc 還差 12.5 frame px），而 `pause()` 掛在 `timeupdate`（~250ms 一次）⇒ **實際停格散在 38.50–38.75、每次不同**，那段每 100ms 走約 7 frame px ⇒ 誤差有一半是隨機的，光調 anchor 修不掉。
- mob 的尾幀核心**不停在畫面正中心**（0.4711 ＝ 603/1280，中心上方 37 frame px），pc / pad 才會回到正中心。

## 待辦（2026-08-26 仍未做，刻意留著）

`HERO_OUTRO_CORE_ANCHOR` 三個裝置共用的 `39/1920` **量的是 DOM core 不是影片**（＝ 26 CSS px 在 1280 視窗上換算回 1920 影片稿），起點尺寸恆偏大 pc 1.50×／pad 1.22–1.32×。正確的一步是先把 `outro.end` 推到停定之後（38.9 或播到 `@ended`，代價是捲動鎖多 0.4 秒），再換成 pc `26/1920`、pad `17/1024`、mob `{y: 0.4711, size: 18/720}`。兩件事是同一個決定，改一半只是換一種錯法。詳細算式寫在 `hero-video-config.ts` 該常數上方。

## ⚠️ 兩把尺：hero 各層一律站在 `--vh` 上

`.sec1__hero-stage`（影片）是 `inset: 0 0 auto 0` ＋ `height: vh(1)` ＝ **`--vh`（CSS 100vh ＝ large viewport、凍結）**；而 `HeroLoader` 的 `.loader` 與 `HeroStart` 的 `.hero-start` 是 `fixed; inset: 0` ＝ **活視窗**。兩邊各自 flex 置中，中心就差 `--chrome-inset / 2`。開場期間頁面鎖著、手機網址列**永遠不會收合**（見 [[hero-body-lock-rules]] #5）⇒ 手機上這個偏移是必然的：實機 Android Chrome 1080×2424 上 cube 與影片首幀那顆橘塊中心差 **37 CSS px**（使用者截圖裡兩顆橘塊同時在畫面上、大小也不同）。

修法是在兩層各加一層 `.ruler`（`inset: 0 0 auto 0` ＋ `height: vh(1)`）接手置中，白底仍留 `inset: 0`。

**不要走這兩條**：
- 把影片往上位移（`object-position` 或 `translateY(-chrome-inset/2)`）—— `--chrome-inset` 是**活值**，解鎖那一刻網址列收合、inset 歸零 ⇒ 影片畫面當場跳 37px，而那時影片還在畫面上溶解。載入層／start 閘門在解鎖前就被移除，掛在凍結的尺上沒有這個風險。
- 在載入層／閘門補 `translateY(calc(var(--chrome-inset) / 2))` —— 等於賭「`fixed` 的 `inset: 0` 到底等於哪個 viewport」，各家不一致。改成同一把尺是構造上正確。

另外：`.ruler` **不可以**套 `--hero-stage-max-h`。套了之後 `--vh` > 1440 時它只有 1440 高、又錨在 `top: 0` ⇒ 中心變成 720，而影片畫面中心仍是 `vhPx(0.5)`。上限只屬於「內容盒」（影片那側也是分兩層：舞台吃 `vh(1)`、`<video>` 自己吃上限）。

⚠️ `HeroLoader.vue` 的 style 原本是**純 CSS**（`<style scoped>`），`vh()` 會被整條丟棄而**不報錯** —— 症狀是 `.ruler` 變成 auto 高（等於網格高，實測 855px）。已改成 `lang="scss"`。加 `vh()` 到任何元件前先確認那個 style 區塊是 scss。

## `<video>` 的 object-fit 要從 computed style 讀

SCSS 是 pc `cover` ／ ≤1023.98 `contain`（`.sec1__hero-video-el`）。2026-08-26 之前換算寫死 `Math.max`（cover），pad / mob 的交棒尺寸因此一路算錯（mob 390×844 差 22%）。`videoAnchorToScreen` 現在吃 `fit`，呼叫端一律 `getComputedStyle(video).objectFit` —— 不要照斷點在 JS 再寫一份。

相關：[[hero-outro-core-handoff]]、[[hero-core-screen-locked]]、[[hero-body-lock-rules]]
