# 永續祝福 → 智慧媒體：橘塊融合過場（03 → 04）

2026-08-18

## 一、問題

03 → 04 之間有一段「滿版純橘、畫面上什麼都不動」的空窗期。使用者兩次回報，第二次附圖是
夥伴清單還在畫面上、接縫落在視窗約 57% 高處、整片橘完全靜止的那一幀。

拆開來是三截相連的橘：

| 截 | 長度 | 那段畫面在做什麼 |
| --- | --- | --- |
| blessing outro 前段 | `BLESSING_OUT_FADE × BLESSING_OUT_VH` | 夥伴清單淡出（唯一在動的東西） |
| blessing outro 尾端「呼吸拍」 | `(1 − BLESSING_OUT_FADE) × BLESSING_OUT_VH` | 完全靜止（2026-08-18 已先歸零） |
| media 拍 0 | `NARROW_DUR` | 滿版橘塊左右收窄到 `BLOCK_VW` |

清單淡完之後，橘就一路靜止到 media 拍 0 開始收窄。而收窄**不能提早**，原因寫在
`useMediaIntroMotion` 拍 0 的 ⚠️：`.media__stage` 是 `absolute top: 0`、塊高一個可視高，
所以

> morph 上緣 ≡ `.media` 上緣 ≡ 接縫

是構造上的恆等式。接縫還在畫面中段時收窄，橘柱會在接縫那條線上被水平切斷——下半是收窄中
的柱子、上半是 blessing 的滿版橘。缺口只是換了位置。

**結論：會動的那塊橘必須不受接縫位置限制，也就是它得是滿版的。**

## 二、順帶釘死的一個誤判

第一次診斷時把畫面上那條全寬橘帶讀成「blessing 的底色」。它不是——blessing 在拍 0 那一刻
一個 pixel 都不在畫面上。那條帶子是 header 自己：

```scss
// AppHeader.vue
&--orange { --hd-bg: color-mix(in srgb, var(--color-orange) 70%, transparent); }
```

70% 半透明橘疊在頁面上，於是橘塊一收窄，header 帶就被切成三塊（兩側 70% 橘疊白＝淺橘、
中間 70% 橘疊橘＝飽和橘），看起來像兩層東西。這件事與本設計正交，但**必須一起修**，
否則 veil 一開始收窄就立刻露出同一個破圖（見第六節）。

## 三、設計：一層 veil，與 morph 綁在同一拍

新增一層滿版橘幕 `.section3__veil`，**與 morph 由同一個 tween 驅動**。整段過場只有一塊橘，
它從 blessing 的滿版底色一路變成 media 的 morph——中間沒有第二個橘色元素接手。

```
                    融合拍（＝ blessing outro 窗口 ＝ media 拍 0，同一個窗口）
                    ├────────────────────────────────────────────────┤
接縫位置       60vh 處 ····································· 抵達視窗頂
veil（fixed）  滿版 ──────────── 同一個 tween、同一條 ease ──────── BLOCK_VW → 隱藏
morph          滿版 ──────────────────────────────────────────── BLOCK_VW → 接手
.section3 底色 橘 ─┤硬切成白（被 veil 遮著，看不到切換）
夥伴清單       全不透明 ──── 淡出 ────→ 0
```

### 3.1 為什麼 veil 必須住在 `.section3` 裡

它要同時滿足三個疊層條件：

1. 在 `.section3` 自己的底色**之上**（底色要能切白，白色由 veil 遮住）
2. 在 `.section3` 的內容（臉屏、夥伴清單）**之下**（清單要照舊淡出，不能被橘幕蓋掉）
3. 在 `.media`（含 morph）**之上**（`.section3` 有 `z-index: 1`、`.media` 是 auto，天然成立）

條件 1＋2 只有「`.section3` 的第一個子元素」滿足，而且**靠 DOM 順序就夠、不需要 z-index**：
veil 是 positioned 且 z-index auto，後面的兄弟（`.section3__face-track` 是 `relative`、
`.section3__partners` 是 `relative`／`sticky`）依樹序畫在它之上。

> ⚠️ 因此 veil 必須是 `.section3` 的**第一個**子元素。挪到後面就會蓋掉夥伴清單。

### 3.2 為什麼是 `fixed` 而不是 `sticky`

veil 要在融合拍期間覆蓋**整個視窗**（含接縫以下——那裡 morph 正以同寬同步收窄，兩者重疊
不可見）。`fixed; inset: 0` 直接成立。

代價是它在 02 → 03 覆蓋過場期間也會滿版——那會讓 blessing 的橘塊還沒升上來就已經滿版，
整段覆蓋過場直接破功。故 veil 由 `coverDone`（`coverProgress >= 1`）開關：那一刻整個視窗
已經是 `.section3` 的橘，一塊同色滿版矩形出現不可見。

> ⚠️ 必須是 **`v-show` 而不是 `v-if`**。timeline 在 Media.vue 的 `onMounted` 就建好，
> 那時 cover 還沒跑完 —— `v-if` 之下 veil 根本不在 DOM，GSAP 拿不到 target，整拍靜靜
> 不播。`v-show` 保留元素、只切 `display`，而 `display: none` 與 GSAP 的 `autoAlpha`
> （寫 `visibility` / `opacity`）互不干擾，兩層閘門可以疊。
> veil 只吃 `scaleX`、不需要量測，`display: none` 期間被 GSAP 寫入 transform 也無害。

> ⚠️ `fixed` 的定位基準是視窗，前提是祖先沒有 `transform` / `filter` / `backdrop-filter` /
> `will-change`。`.section3` 目前只有 `position: relative` 與 `z-index: 1`。**任何人給
> `.section3` 加 transform，veil 會安靜地退化成 section 相對定位**——註解要寫在元素上。

已評估並否決的替代方案：`position: sticky; top: 0; height: 100vh` ＋ `margin-bottom: -100vh`
（sticky 會自己在接縫處停下，不需 `v-if`）。否決理由是那個負 margin 落在
`.section3__partners` 的負 margin 算式旁邊——那組算式是本段最脆弱的地方（見 Blessing.vue
`.section3__partners` 的註解），淨值雖為零，但把兩個負 margin 疊在一起沒有任何人能一眼
複查。可讀性優先。

### 3.3 為什麼 veil 與 morph 要在**同一個 tween** 裡

交棒的前提是「同色同寸同位硬切」——本專案既有的交棒全部靠這一條（白方塊↔臉、直線↔引號、
方塊↔紙飛機）。若 veil 走 CSS var、morph 走 GSAP timeline，兩條在同一幀的值不保證一致，
交棒那一幀就可能看到寬度跳一下。

把 veil 加成拍 0 的第二個 target，寬度一致就是**構造上的**，不是靠對齊參數得到的：

```ts
tl.fromTo(morph,
    { scaleX: innerWidth / MORPH_W, scaleY: innerHeight / MORPH_H, autoAlpha: 1 },
    { scaleX: (innerWidth * MEDIA_BLOCK_VW) / MORPH_W, duration: NARROW_DUR, ease: FUSE_EASE })
  .fromTo(veil,
    { scaleX: 1, autoAlpha: 1 },
    { scaleX: MEDIA_BLOCK_VW, duration: NARROW_DUR, ease: FUSE_EASE }, 0)
  .set(veil, { autoAlpha: 0 });   // 拍 0 結束：veil 與 morph 同色同寬同位 → 硬切不可見
```

`BLOCK_VW` 因此不能再是 `useMediaIntroMotion` 的區域 const——它現在是**兩個元件共用的
交棒尺寸**，要搬到 `orange-core-config` 成為 `MEDIA_BLOCK_VW`。同理 `FUSE_EASE` 一份。

> veil 的元素在 Blessing.vue、timeline 在 Media.vue，所以 `useMediaIntroMotion` 要跨元件
> 取得 handle：`document.querySelector('[data-morph-veil]')`。這在本專案是既有慣例
> （AppHeader 就是 `querySelectorAll('[data-header-theme]')`），而且因為 3.2 節決定用
> `v-show`、元素恆在 DOM 裡，「查不到」不是常態而是真的壞了 —— 故它加進 `buildMotion()`
> 開頭那組 `if (!morph || !barL ...) return;` 的必要元素守衛：查不到就整段 motion 降級
> （標題直接顯示完成態），`mediaMotionArmed` 停在 false，blessing 底色不會切白。
> 用 `data-` 屬性而不是 class：class 是樣式的名字，改名重構不該把 motion 打斷。

### 3.4 窗口：blessing outro 與 media 拍 0 合併成同一段

ScrollTrigger 的 `start` 從 `'top top'` 提前 `BLESSING_OUT_VH` 個視窗高，`end` 等量延長：

```ts
start: () => `top ${BLESSING_OUT_VH * 100}%`,
end:   () => `+=${HOLD_BUFFER + BLESSING_OUT_VH * vhPx(1)}`,
```

sticky 定住距離仍是 `HOLD_BUFFER`（buffer 高度不動），timeline 仍與 sticky 同時結束——
提早的那段跑在 sticky engage **之前**，`.media__hold` 還在正常流裡。

於是 `BLESSING_OUT_VH` 成為整段融合拍的**唯一長度旋鈕**：清單淡出、veil 收窄、morph 收窄
全部吃這一段，而且從第一幀就同時開始（使用者明確要求「跟清單淡出完全重疊」）。

`NARROW_DUR` 改為**推導值**，不再手寫：拍 0 佔掉的 px 必須等於提早的跑道，否則收窄會在
跑道跑完前就結束（留下一段靜止的 60vw 柱子，等於把空窗期換個寬度重演）。

```
NARROW_DUR = restDuration × (BLESSING_OUT_VH × vh) / HOLD_BUFFER
```

`restDuration` ＝ 不含拍 0 的 timeline 長度（pc 5.1 / mob 4.8，本來就逐斷點不同）。實作上
先建拍 1 之後的所有拍、讀 `tl.duration()`、再把拍 0 插到 time 0。

> ⚠️ 這條取代了原本手寫 `NARROW_DUR` ＋ 手算 `HOLD_BUFFER ≈ (5.1 + NARROW_DUR) × 392` 的
> 雙向手動同步。`HOLD_BUFFER` 回到 2000（＝ 5.1 × 392，拍 0 不再佔用 buffer 的行程）。

### 3.5 ease：頭快尾慢

- **頭必須快**：使用者要的就是「這一拍整個橘色區域在動」。`power2.inOut` 的慢起讓開頭幾乎
  看不出白邊在長，那正是 2026-08-18 第一輪改成 `power2.out` 的理由，保留。
- **尾必須慢**：拍 1 是 `power3.inOut`（慢起）。拍 0 若在交界處還是全速，兩拍之間看得到轉折。
  `power2.out` 的尾端一階導數為 0，接得上。

> ⚠️ 不可改成 `'none'` 或 `power2.in`。

### 3.6 `.section3` 底色切白

veil 一收窄，兩側露出來的必須是白：接縫以上是 `.section3`、以下是 `.media` 的 `#fff`。
兩邊同色，接縫才不會變成一條可見的橫線。

底色**硬切**、不補間——切換那一刻 veil 剛好是滿版（`fromTo` 的起點），完全遮住，所以看不到
硬切；反過來說，補間會多出一條要與 veil 對齊的曲線，那是白花的風險。

條件：`blessingOutProgress > 0`。與 veil 的 `fromTo` 起點是同一個捲動位置。

實作走既有的 `--cover-orange` 同一套（CSS 自訂屬性餵進 `background`），巢狀 `color-mix`：

```scss
background: color-mix(in srgb, #fff calc(var(--outro-white, 0) * 100%),
              color-mix(in srgb, var(--color-orange) calc(var(--cover-orange, 1) * 100%),
                        var(--color-blue)));
```

`--outro-white` 是二元的（0 或 1），故 `transition` 安全（同 `--cover-orange` 的既有取捨）。
不支援 `color-mix` 的瀏覽器會丟掉整條宣告、退回上一行的純橘 fallback——那條 fallback 已經
存在，行為與今天相同（降級成全程橘）。

## 四、拍 0 之前的那段

融合拍開始**之前**（使用者還在讀夥伴清單、接縫在 60vh 以下），timeline 停在 time 0，
ScrollTrigger 會渲染 `fromTo` 的起點 → veil 與 morph 都是滿版橘、`autoAlpha: 1`。

這是**對的**：那時 `.section3` 底色還是橘（`--outro-white` 為 0），veil 滿版橘疊在上面不可見；
接縫以下由 morph 的滿版橘接續，與今天完全相同（今天也是靠這個「時間 0 就渲染起點」讓拍 0 的
滿版起手成為 blessing 橘底的延續）。

> ⚠️ 這是本設計唯一依賴 GSAP「scrub timeline 在 start 之前渲染 time 0」這個行為的地方。
> 它同時也是今天既有的行為，不是新增的賭注。

## 五、降級路徑

| 路徑 | 今天 | 改後 |
| --- | --- | --- |
| `prefers-reduced-motion` | 不建 timeline，morph 永遠 `visibility: hidden`，接縫處硬切到白 | veil 綁捲動、不是自走動畫，照 `partnersOpacity` 的既有判斷**不吃** reduce-motion；但 timeline 不建 ⇒ veil 的 `fromTo` 不存在 ⇒ veil 停在 CSS 初始態（`visibility: hidden`，同 `.media__morph`）。`--outro-white` 必須同時不生效，否則 blessing 會變成白底沒有 veil。 |
| `/#media` 深連結 | 同上 | 同上 |
| 無 JS | 同上 | 同上 |

三條路徑的共同點是「timeline 沒建起來」，所以閘門就是這一件事本身：`useMediaIntroMotion`
真的走完 `buildMotion()`（含 veil 守衛都通過）時才把 `mediaMotionArmed` 寫成 true
（住 `useOrangeCoreProgress`），`--outro-white` 只在它為 true 時才餵 1。veil 那邊不需要
額外處理——GSAP 沒接手，它就停在 CSS 初始態。

> ⚠️ 「`--outro-white` 與 veil 必須同生共死」是本設計最容易漏的一條：漏了會讓
> reduce-motion 的使用者看到 blessing 整段變白底白字。實作時要有一支測試守它。
>
> ⚠️ `mediaMotionArmed` 由 Media.vue 的 `onMounted` 寫入、Blessing.vue 消費，兩者是
> 反向的（下游寫、上游讀）。它成立是因為值只在使用者捲到 outro 窗口時才被讀，
> 距 mount 很遠；但這個方向要在註解裡寫清楚，否則看起來像資料流搞反了。

## 六、header（必須一起做，否則 veil 一動就露餡）

**6.1 橘主題底色改不透明**

```scss
&--orange { --hd-bg: var(--color-orange); }
```

全站只有兩處宣告 `orange`：`Blessing.vue`（靜態）與 media 拍 0（動態）。兩處 header 背後
本來都是實心橘，70% 橘疊橘 ＝ 橘，所以這是**既有畫面上的零變化**；`.section3` 還是淺藍的
那一段，header 根本還沒進到它上面（接縫升到 header 底緣時 `coverProgress` ≈ 0.87，
早已越過 `COVER_CONTACT` 0.5）。改不透明只影響「背後不是橘」這個唯一的破圖情境。

**6.2 翻 light 的門檻延到拍 1 結束**

現在的門檻在拍 0 結束（柱子還有 60vw 寬）。那時 header 一翻成 70% 白，白帶中央會透出一塊
橘，同一個露餡換個時間重演。延到拍 1 結束（柱子已收成 28px 細條），翻面時帶子背後只剩一條
細縫。門檻仍然是推導的，只是地標往後移一拍：

```ts
// 拍 1 的 duration 是 1（見 timeline），故拍 1 結束＝ NARROW_DUR + 1
self.progress >= (NARROW_DUR + 1) / d ? 'light' : 'orange'
```

> ⚠️ 初稿寫成「宣告權搬回 blessing、Media 改靜態 `light`、整組 header 邏輯刪除」。那是錯的：
> `pickHeaderTheme` 的偵測線是 header 底緣，接縫在融合拍的**最後約一個 header 高**就已經
> 穿過那條線 → 其後由 media 的宣告決勝。media 若靜態 `light`，header 會在拍 1 的**開頭**
> 就翻白，不是結尾。所以 media 的動態 dataset 必須留著，`Blessing.vue` 的
> `data-header-theme` 則維持靜態 `"orange"`（不必改）。

> ⚠️ 代價（本設計唯一需要用眼睛判斷的地方）：融合拍 ＋ 拍 1 合計約 99vh 期間，header 是
> 一條實心橘帶、頁面是白底 ＋ 中央一根收窄的橘柱，讀成一個 T 形。blessing 全段本來就是
> 實心橘 header，所以我判斷它讀得通，但這要在真實畫面上確認。
>
> 若不成立，替代方案是**提早翻 light**（柱子收到約 90vw 時就翻）：那樣帶子是霜面白、
> 橘柱以真實寬度從帶子後面穿過去，寬度完全對齊、不會有「兩層」的錯覺，代價是 logo 變成
> 灰字疊在淺橘上，對比較差。兩者的取捨是「對比」對「對齊」，只能看了決定。

## 七、`BLESSING_OUT_FADE` 要往回收

2026-08-18 第一輪把它推到 1.0（吃掉呼吸拍）。本設計要把它收回約 **0.5–0.6**：

夥伴清單面板約 72vw 寬、比 60vw 的 veil 終點寬。清單若撐到窗口尾端才淡完，卡片（白底白框）
的邊緣會落在已經露白的兩側上、失去輪廓。所以清單必須比 veil 收到底更早淡乾淨。

方向與第一輪相反，理由是窗口的性質變了：第一輪的窗口尾端是靜止的呼吸拍（不淡完就沒事做），
現在整段都在動。

## 八、觸及檔案

| 檔案 | 改什麼 |
| --- | --- |
| `app/utils/orange-core-config.ts` | 新增 `MEDIA_BLOCK_VW`、`FUSE_EASE`（交棒共用的單一來源）；`BLESSING_OUT_FADE` 0.5–0.6；`BLESSING_OUT_VH` 的註解改寫成「融合拍的唯一長度旋鈕」 |
| `app/components/03.blessing/Blessing.vue` | veil 元素（第一個子元素、`v-show="coverDone"`、`data-morph-veil`）；底色第三態 `--outro-white`。`data-header-theme` **不動** |
| `app/composables/useOrangeCoreProgress.ts` | `coverDone`／`outroWhite` 衍生值；`mediaMotionArmed` 旗標 |
| `app/composables/useMediaIntroMotion.ts` | `start`／`end` 提早與延長；拍 0 加 veil target ＋ 結束時 `.set(autoAlpha: 0)`；`NARROW_DUR` 改推導；`HOLD_BUFFER` 回 2000；header 門檻改 `(NARROW_DUR + 1) / d`；拍 0 那條「收窄不能提早」的 ⚠️ 改寫 |
| `app/components/ui/AppHeader.vue` | `&--orange` 的 `--hd-bg` 改不透明 |
| `test/blessing-outro.spec.ts` | 收窄曲線的端點（`p=0 → 1`、`p=1 → MEDIA_BLOCK_VW`，交棒不變量）與單調性；veil 與 `--outro-white` 同生共死 |

## 九、不變量（實作與 review 要守的）

1. **交棒**：拍 0 結束時 veil 與 morph 同色、同寬、同位。寬度來自同一個 `MEDIA_BLOCK_VW`、
   同一條 `FUSE_EASE`、同一個 tween 時間點——不是靠對齊兩組參數。
2. **veil 是 `.section3` 的第一個子元素**，且用 `v-show`（不是 `v-if`）。挪位置會蓋掉夥伴
   清單；改 `v-if` 會讓 timeline 建立時抓不到 target，整拍靜靜不播。
3. **`--outro-white` 與 veil 同生共死**（共同閘門 `mediaMotionArmed`）。任一單獨生效都是
   破圖：只有白底＝blessing 白底白字；只有 veil＝收窄後兩側露出橘。
4. **`.section3` 不可有 transform**，否則 `fixed` 的 veil 安靜退化。
5. **拍 0 的 px 長度 ＝ 提早的跑道長度**。`NARROW_DUR` 推導而來，不手寫。
6. **`BLOCK_VW` 只有一份**（`MEDIA_BLOCK_VW`）。
7. **veil 與 morph 的寬度算在同一個 px 基準上**。morph 吃 `window.innerWidth`（含捲軸），
   veil 是 `fixed; inset: 0`（＝ `clientWidth`，不含捲軸）—— 直接各自用 1.0 與
   `MEDIA_BLOCK_VW` 當 scaleX，交棒那一幀會差一個「捲軸寬 × 0.6」（Windows Chrome 約
   10px）的跳動。veil 的 scaleX 必須除回自己的實際寬度，讓兩者的**終點 px 相等**。

## 十、驗證

單元測試蓋得到的只有曲線與常數關係（第八節那支）。以下必須在真實畫面上看：

- 融合拍第一幀就有動態（使用者原始需求）
- 接縫不可見：veil 兩側露白時，接縫上下的白是同一個白
- 交棒不可見：拍 0 → 拍 1 之間沒有寬度跳動
- header 的 T 形是否讀得通（第六節的 ⚠️）
- 往回捲對稱：整段可逆，沒有殘留的橘幕
- reduce-motion 與 `/#media`：blessing 仍是橘底，接縫處硬切到白
