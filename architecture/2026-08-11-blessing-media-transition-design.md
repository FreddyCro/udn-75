# 03.blessing → 04.media 過場 — 設計稿

日期：2026-08-11
狀態：**待實作**
相關檔案：`app/components/03.blessing/Blessing.vue`、`app/composables/useMediaIntroMotion.ts`、
`app/composables/useOrangeCoreProgress.ts`、`app/utils/orange-core-config.ts`、`app/components/04.media/Media.vue`
設計稿：**無**（`architecture/LIU_FEEDBACK_4.md`「永續祝福 3. 過場再接上『智慧心媒體』，目前還未串接在一起」）

三拍，依序、不重疊：

1. blessing 的夥伴清單淡出，留下純橘畫面
2. 滿版橘底左右收窄
3. 收到 `BLOCK_VW`（60vw），接上 media 現有的開場 timeline

---

## 一、現況：接縫在哪，以及已經對齊了什麼

`.media__stage` 是 `position: absolute; top: 0; height: 100vh`，`.media__morph` 置中於其中，
而 timeline 第一拍的 from-state 是 `60vw × 100vh` 的橘塊。三件事疊起來的結果是：

> **橘塊上緣恆等於 `.media` 的 section 上緣，也就是接縫本身**；塊高等於
> `window.innerHeight`（與 `.media__stage` 的 `100dvh` 同尺）。

加上 GSAP 在 progress 0 就 render from-state，所以從「`.media` 上緣進入視窗底緣」到
「`.media` 上緣抵達視窗頂」這 100vh 之間，**接縫下方永遠被滿版高的橘塊填滿**，
與 blessing 的橘底同色 —— 縱向早就無縫，使用者分不出接縫在哪。

唯一的破口是**橫向寬度在接縫處硬跳一階**：滿版（blessing 橘底）→ 60vw（media 橘塊）。

而第一拍本來就是「橘塊左右縮成 28px 直條」—— **「變窄」這個動作已經存在，只是起點不是滿版。**

### 為什麼「變窄」不能比 `top top` 更早開始

橘塊上緣＝接縫。接縫上方是 blessing 的滿版橘底、下方是橘塊。**一旦橘塊在接縫還看得到的時候收窄，
接縫就變成一道看得見的橫向缺口**（上滿版、下 60vw，左右各露出一塊白底）。

所以可以開始收窄的最早時機，就是接縫離開視窗頂的那一刻 —— `start: 'top top'`，
也就是現有 ScrollTrigger 的起點，它已經在最早的位置了。

推論：**把 morph 往上挪、或把 pin 提早起算，買不到收窄的跑道。** 那段行程只能拿來
「維持滿版不動」，畫面上與什麼都不做完全等價，卻要付出 Media 去操作 Blessing DOM 的跨段耦合成本。
唯一能讓①②重疊的做法是移交底色所有權（見第五節「不做的事」）。

### 捲動預算（pc、視窗 900）

夥伴清單那一塊高約 778px（`20 padding-top + 58 stairs + 40 gap + 600 panel + 60 padding-bottom`）。

| 事件 | 位置 |
|---|---|
| 夥伴清單塊完整在畫面上 | `.section3` 下緣抵達視窗底緣 |
| ↕ **100vh 免費跑道**（幾何保證）← ①淡出 | |
| 接縫離開視窗頂 | `.media` 的 `top top`＝現有 `start` |
| ↕ 拍 0（新）`100vw → BLOCK_VW` ← ②③ | |
| ↕ 拍 1 起：現有 timeline 原封不動 | |

---

## 二、media 側：timeline 前面插一拍

**`app/composables/useMediaIntroMotion.ts`**

原本的拍 1 是 `fromTo`，把 from-state 讓給新的拍 0，自己退化成純 `.to`：

```js
const NARROW_DUR = 0.8; // 拍 0 的長度，也是 header 翻 light 的門檻（見下）

// 拍 0（新）：滿版橘塊 —— 接手 blessing 的橘底 —— 左右收到 BLOCK_VW
.fromTo(morph,
  { scaleX: window.innerWidth / MORPH_W,
    scaleY: window.innerHeight / MORPH_H,
    autoAlpha: 1 },
  { scaleX: (window.innerWidth * BLOCK_VW) / MORPH_W,
    duration: NARROW_DUR, ease: 'power2.inOut' })
// 拍 1（原有）：BLOCK_VW → 28px 直條
.to(morph, { scaleX: 28 / MORPH_W, duration: 1, ease: 'power3.inOut' })
```

`BLOCK_VW = 0.6` 的註解語意改為「**拍 0 的終點寬、拍 1 的起點寬**」（原本是「分鏡 1 色塊寬」）。

`wrapDx / wrapDy` 那段量測不受影響 —— 它在 timeline 建立**之前**讀 `morph.getBoundingClientRect()`，
那時 morph 是 `clearProps: 'all'` 後的 12×82 基準尺寸。

### `HOLD_BUFFER` 2000 → 2300

timeline 總長 pc 5.1 → 5.9、mob 4.8 → 5.6（mob 無 bar，`phase2` 少 0.3）。
等比加長讓既有每一拍的 px 速度不變：pc 需 2314、mob 需 2333 —— 取單一值 **2300**，
兩個斷點都落在現有速度的 1.5% 內。（`HOLD_BUFFER` 本來就是單一常數，兩斷點的
px/拍 現在也不相等，本次不改變這件事。）

### header theme

`.media` 目前**沒標** `data-header-theme`，回落 `light`。改成滿版起手後，收窄期間畫面上緣是整片橘，
header 卻已經是 light —— 而 `pickHeaderTheme` 只比對縱向 `top` / `bottom`，救不了。

- 模板加 `data-header-theme="light"`。寫 `light` 而非 `orange` 有兩個理由：
  ① AppHeader 在 `onMounted` 一次性 `querySelectorAll('[data-header-theme]')` 收集 `themeEls`，
  屬性必須在 SSR 輸出裡就存在才收得到；
  ② `prefers-reduced-motion` 與 `/#media` 深連結這兩條降級路徑不建 timeline、橘塊根本不出現，
  留在 `light` 天然正確。
- `buildMotion()` 末端立刻改成 `orange`（progress 0＝滿版橘）。
- ScrollTrigger 維持狀態：

```js
onUpdate: (self) => {
  const d = tl?.duration() ?? 0;
  const light = d > 0 && self.progress >= NARROW_DUR / d;
  section.dataset.headerTheme = light ? 'light' : 'orange';
},
onLeaveBack: () => { section.dataset.headerTheme = 'orange'; },
onLeave: () => { section.dataset.headerTheme = 'light'; },
```

門檻由 `NARROW_DUR / tl.duration()` 推導而非寫死比例：加減拍數不必重算。
`tl.duration()` 在 `st` 建立時還是 0，但 closure 在捲動時才求值，那時 tween 都已加完。

**為什麼不用 `tl.set(section, { attr: {...} })`**：那要賭 GSAP 零秒 tween 在 scrub 倒帶時的
revert 語意。`onUpdate` 每幀依 progress 重算，可逆性是顯而易見的，不需要驗證框架行為。

**為什麼比對 `self.progress` 而不是 `tl.time()`**：不必假設 ScrollTrigger 在呼叫 `onUpdate` 之前
已經推進過 timeline。

`AppHeader` 每次 scroll 都重讀 `el.dataset.headerTheme`（只有 `themeEls` 是快取的），
所以動態改屬性值有效。

---

## 三、blessing 側：①夥伴清單淡出

夥伴清單目前**完全沒有退場** —— 它一路捲出視窗上緣，`.section3` 的橘底在面板下方 60px 處結束。

### 淡出曲線（純函式）

**`app/utils/orange-core-config.ts`**

```ts
// ── 永續祝福退場：夥伴清單淡出 ──────────────────────────────────────
// 窗口固定為一個視窗高 —— `.section3` 下緣從視窗底緣走到視窗頂緣，幾何保證，不需常數。
// 前 BLESSING_OUT_FADE 淡完，其後是純橘的呼吸拍：接縫離開視窗頂（＝media 的 top top）時
// 畫面上必須只剩橘，收窄才接得無縫。要更長的呼吸拍就調小它。
// 要更長的**淡出**則不是調這裡 —— 窗口長度由幾何鎖死，加長要靠 `.section3` 的 padding-bottom。
// 2026-08-11 實作時實測調整：0.65 → 0.83（呼吸拍 35vh → 17vh，35vh 在畫面上像卡住）
export const BLESSING_OUT_FADE = 0.83;

/** 夥伴清單在退場軌 p 時的 opacity（1 → 0）。曲線由 test/blessing-outro.spec.ts 守著。 */
export function partnersFadeAt(p: number): number {
  return 1 - smoothstep(0, BLESSING_OUT_FADE, p);
}
```

沿用檔內既有的 `smoothstep`（同 `symbolIntroOpacity` 的做法）：兩端一階導數為 0，
scrub 淡出的頭尾不會有硬轉折，且它本身已夾在 `[0, 1]`。

### 共享軌

**`app/composables/useOrangeCoreProgress.ts`**，照檔頭「延伸」那段的做法加一條：

```ts
const blessingOutProgress = useState<number>('blessing-out-progress', () => 0);
const setBlessingOutProgress = (p: number) => (blessingOutProgress.value = clamp01(p));
const partnersOpacity = computed(() => partnersFadeAt(blessingOutProgress.value));
```

`partnersOpacity` 放在 `blessingFrame` 旁邊，角色相同（軌 → 衍生值）。
提升成共享狀態而非 `Blessing.vue` 的區域 ref，理由與 `stairsDone` 相同：
SEQUENCE 有它的 part，dev dashboard 要讀得到才調得動節奏。

### 觸發

**`app/components/03.blessing/Blessing.vue`** 第二條 ScrollTrigger（與臉的那條並存）：

```js
outroST = ScrollTrigger.create({
  trigger: sectionRef.value,
  start: 'bottom bottom',
  end: 'bottom top',
  invalidateOnRefresh: true,
  onUpdate: (self) => setBlessingOutProgress(self.progress),
  onLeaveBack: () => setBlessingOutProgress(0),
  onLeave: () => setBlessingOutProgress(1),
});
```

`onBeforeUnmount` 一併 `outroST?.kill()`。

### 樣式

模板：

```html
<div
  class="section3__partners"
  :class="{ 'is-in': partnersIn, 'is-out': partnersOpacity < 1 }"
  :style="{ '--partners-out': partnersOpacity }"
>
```

SCSS 在既有的 `.section3__partners` 區塊內多一條規則（維持「同一個 class 只定義一次」）：

```scss
&.is-in { opacity: 1; pointer-events: auto; }

// 退場：scrub 驅動，必須關掉 transition —— 0.4s 補間會讓每一幀滯後，手感發黏。
// 刻意不寫 pointer-events：讓它從 .is-in 繼續繼承 auto，淡出過程中面板仍可捲動、可聚焦。
&.is-out { opacity: var(--partners-out); transition: none; }
```

`.section3__partners.is-in` 與 `.section3__partners.is-out` 特異度相同（0,2,0），
`is-out` 寫在後面所以贏。回捲時 `partnersOpacity` 到 1 → `is-out` 移除 → `is-in` 的
`opacity: 1` 接上，值相同不會跳。

進場與退場不會互相干擾：進場門檻是 `blessingProgress ≥ 0.999`（臉的捲動尺跑完，
那一刻面板頂端剛好在視窗底緣），退場窗口起點還在 778px 之後。

### 節奏旋鈕

①要更慢 → **`.section3` 加 `padding-bottom`**，純橘跑道變長、接縫往後推。

這裡用 `padding` 是安全的：`.section3__face-screen` 的 sticky 活動範圍是
`.section3__face-track` 的 content box，不是 `.section3` 的
（`Media.vue` 那個「用 padding 當緩衝 sticky 不會動」的坑在這裡踩不到）。
也不影響 `.section3__partners` 的負 `margin-top` 算式 —— 它量的是 `.section3__face-track`，
與 section 的 padding 無關。

---

## 四、SEQUENCE 與測試

**`app/utils/orange-core-config.ts`**

- `SequenceTrack` 加 `'blessingOut'`。
- `TRACK_VH.blessingOut = 1.0`。**這條軌的長度是常數** —— `bottom bottom` → `bottom top`
  幾何上就是一個視窗高，不像 `path` / `forumPath` 得靠量測，所以 dashboard 給得出 vh。
- `SEQUENCE` 的 blessing 章尾端追加：

```ts
{ key: 'outro', label: `夥伴清單淡出（前 ${BLESSING_OUT_FADE * 100}% 淡完，其後純橘）`,
  drive: 'scrub', track: 'blessingOut' },
```

  檢查過「表中不可出現相鄰的兩個 `none`」：`face`(scrub) → `stairs`(time) → `partners`(none)
  → `outro`(scrub)，沒違規。

**`test/blessing-outro.spec.ts`**（新增，照 `test/symbol-sequence.spec.ts` 的寫法）

- `partnersFadeAt(0) === 1`、`partnersFadeAt(BLESSING_OUT_FADE) === 0`、`partnersFadeAt(1) === 0`
- 區間內單調遞減
- 定義域外夾住：`partnersFadeAt(-1) === 1`、`partnersFadeAt(2) === 0`

---

## 五、不做的事

- **不新增過場元件、不做兩顆橘塊的交棒。** media 的 morph 本來就能從更大尺寸起手；
  多一個元件只是多一道要 pixel-perfect 對齊的接縫（見 `FORUM_PLANE.scale` 的
  「交棒不可看到縮一下」不變量）。
- **不把 morph 往上挪、不提早 pin 起算。** 理由見第一節：買不到收窄的跑道。
- **不做①②重疊。** 要重疊就得移交底色所有權：`.section3` 的橘底在下緣前 100vh 就結束（改白），
  那一屏的橘改由一個橘幕元素提供、夥伴清單疊在橘幕之上，橘幕才能在接縫之上就開始收窄
  而不露缺口。而橘幕必須住在 blessing（z-order 才自然）→ 又回到兩顆橘塊交棒。
  先做依序版、在真實畫面上看過節奏再決定要不要付這個成本。
- **不 pin 夥伴清單原地淡出。** 手感更刻意，但面板是 `overflow-y: auto`、600–830px 高且內容超出，
  定住期間使用者的指標大概率就在面板上 → wheel 被面板內部吃掉，會有「捲不動頁面、
  只在捲清單」的卡關感。要做得先處理面板的捲動策略（例如定住期間 `overflow: hidden`），
  範圍會滾大。
- **不把 04.media 納入 SEQUENCE。** 現有註解說它「整段是時間軸驅動、用捲動 % 定址會誤導」，
  其實它是 `scrub: true`、定址是成立的 —— 但那是獨立的整理，不混進這次。

---

## 六、驗收

1. 接縫處寬度不再硬跳：慢捲過 blessing → media，看不出 blessing 的橘底與 media 的橘塊
   是兩個東西。
2. 夥伴清單在接縫前淡乾淨，收窄開始時畫面上只有橘。
3. 收窄期間 header 是橘的，收到 60vw 之後才翻 light。
4. **整段可逆**：往回捲 → 橘塊回滿版、header 回橘、夥伴清單淡回來。
5. 降級路徑：`prefers-reduced-motion` 與 `/#media` 深連結下，`.media` 的 header theme
   維持 `light`、橘塊不出現。
6. 既有 media 開場 motion 的每一拍手感不變（`HOLD_BUFFER` 等比加長的目的）。
