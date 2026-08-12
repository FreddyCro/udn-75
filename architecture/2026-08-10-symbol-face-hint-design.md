# SymbolFace 互動提示（hint）— 決策紀錄

日期：2026-08-10（2026-08-12 壓縮並更新為實作後現況，原設計稿見
`git show e0840bd:architecture/2026-08-10-symbol-face-hint-design.md`）
狀態：**已實作**
相關檔案：`app/components/01a.symbol/SymbolFace.vue`、`app/utils/symbol-hint.ts`、
`app/components/01.hero/Hero.vue`、`app/locales/section1.json`
設計稿：Figma pc `2065:139734`（Group 12416，203×88）／mob `2065:120222`

人臉集合完成那一拍，在人像旁浮出一組提示告訴使用者「這裡可以互動」；游標真的碰到人像就收起。
**pc 與 mob 兩套版位、兩份文案**（`symbol.hint` / `symbol.hintMob`），圓環圖示共用。

props（`hint` / `hintMob` / `hintOnce`）、錨點常數（`HINT_ICON_UV`）、顯隱邏輯與 SCSS
都在 `SymbolFace.vue`，且該檔註解已寫得比本文詳細。以下只留**決策**。

---

## 一、為什麼寫在 `SymbolFace.vue` 內、而不是另開一個元件

提示的定位錨在**人像 bbox 上的一個點**、消失條件是**游標進入人像 bbox**——兩者都要
`halfW` / `halfH`（取樣時算出的人像世界尺寸）與 `smoothMouse` / `influence`（滑鼠緩動狀態），
這些全是 `SymbolFace` 的 `onMounted` 區域變數，沒有對外曝露，也不值得為了一段提示文字曝露。

同一個理由下，它與既有的宮格彩蛋（`.egg`）是同一類東西：**貼在 canvas 上、由 three.js 的世界
座標投影定位的 DOM 圖層**。放在一起，投影換算與 `viewW/viewH` 可以共用。

「游標在不在人像上」的換算則抽成 `app/utils/symbol-hint.ts`（`faceUv()` /
`FACE_HOVER_INFLUENCE`）：彩蛋與提示用的是同一套數學，寫兩份遲早分岔；而且抽出來才測得到
（元件本身是 WebGL + rAF，沒有測試環境）。

## 二、實作過程推翻設計稿的三件事

1. **綁 `faceFormed`，不是「`mode` 翻成 face 後等 `disperseDuration`」。**
   原稿寫的是後者 —— 那是用固定秒數去**猜**集合完成的時間點，猜不到首次進場的
   `revealDuration`、也猜不到補間被 kill/重跑或迴圈中途被停掉的情形。
2. **`hintOnce` 預設 `false`，不是永久收起。** 原稿主張「提示是教學，學會就不該再打擾」，
   但那讓捲回去重看的人再也拿不到提示。現行行為是「每次**重新完整集合**都再出現一次」，
   永久模式保留成 prop。
   ⚠️ 重置點放在**離開**集合態而不是進入 —— 進入那一刻重置的話，`dismissHint` 與重置會在同一輪
   集合內互踩，游標一停在人像上提示就開始閃爍。
3. **有觸控版。** 原稿寫「不做觸控版替代提示，觸控裝置本來就跑 `autoMouse`」。
   實際上手機沒有游標、稿上也另有一張（文案「點擊人臉尋找隱藏的心聲」，單行置中排在人像下方），
   所以做了 `hintMob`；兩組共用 `hintVisible`，顯隱時機與 dismiss 行為完全一致。

## 三、還成立的幾條

- **文案不綁在元件裡**：由 `Hero.vue` 從 `section1.json` 傳入，空字串＝不顯示
  （同既有的 `phrases`，見 CLAUDE.md「文案外部化」）。
- **圖示用 inline SVG 而非另存檔**：專案既有慣例（`AppHeaderIcon.vue`、`HeroStart.vue` 等
  9 個元件都是 inline），且這三個同心圓沒有任何一項需要外部檔案。
- **錨點只在 `applySize()` 與 `buildFromImage()` 末端各算一次，不進 `animate()` 的熱迴圈。**
  與 `.egg` 的差別：`.egg` 跟著游標跑、必須每幀寫 DOM；hint 的錨點在世界座標裡是**不動的**，
  只有 resize 與粒子重建會改變它的螢幕位置。
- **錨的是圖示中心，不是整組的中心。** pc 稿的說明文字排在圖示右邊（整組 203px 寬），
  拿整組置中會讓圖示被文字推得偏左半個文字寬。對位交給 CSS 的 `transform`。
- **消失判定用 bbox 而非「真的撞散粒子」**（`holeRadius` 命中）：後者在臉的空白處移動不會觸發，
  提示會賴著不走。
- **`cfg.autoMouse` 為 true 時跳過 dismiss 判定**：虛擬游標在人像內遊走，會在提示淡入前就自己
  戳到。（PC 版 Hero 並未開 `autoMouse`，這只是防呆。）
- **不動 `.egg`**：兩者位置互斥 —— egg 只在游標進 bbox 後才出現，而那一刻 hint 已經 dismiss。
