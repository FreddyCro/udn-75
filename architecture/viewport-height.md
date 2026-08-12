# 視窗高的單一來源（`--vh`）

2026-08-09 改版。範圍：`01.hero` / `01a.symbol` / `02.forum` / `03.blessing` ＋ 共用層。

## 一、問題

**行動裝置上，CSS 的 `vh` 與 JS 的 `window.innerHeight` 不是同一個數。**
CSS `100vh` **不變**（等同 `lvh`，固定為「網址列隱藏」的高度）；`window.innerHeight` **會變**
（等同 `dvh`）。改版前本專案兩邊都在用：SCSS 寫 `100vh`（凍結的大值）、JS 讀 `innerHeight`
（會動的小值），版面與捲動幾何因此各走各的尺。

### 量出來的代價

四條捲動尺的長度**精確等於「VH 常數 × 視窗高」** —— 整份序列的節奏掛在視窗高上：

| 尺 | span（視窗高 736 時）| ＝ |
| --- | --- | --- |
| `div.sec1__intro-body` | 294 | `INTRO_FADE_VH 0.4 × 736` |
| `div.sec1__intro`（pin）| 884 | `TRANSITION_VH 1.2 × 736` |
| `section.sec-symbol` | 2532 | `SYMBOL_VH 3.44 × 736` |
| `div.section3__face-track` | 884 | `BLESSING_VH 1.2 × 736` |

把 `innerHeight` 由 736 改成 676（−60px，典型網址列高度）：Hero pin 的 span **884 → 812**、
pin-spacer **2670 → 2598**，**其下每一條尺的 start / end 一律 −72**（pin-spacer 縮短造成的整份
文件位移），同一個絕對捲動位置進度最多差 **+0.077**。7.7% 的進度差，在祝福段是**跳好幾格臉**。

## 二、決定

**量「CSS 認為的 `100vh`」，寫成 `--vh`，CSS 與 JS 都讀它。**

**為什麼不用 `dvh` / `svh` / `lvh`**：支援度要 2022 年後的瀏覽器（Chrome 108 / Safari 15.4 /
Firefox 101），而本專案受眾的舊裝置比例高。CSS 自訂屬性回溯到 2016、`vh` 更早 ——
「探測 ＋ 變數」等效且更保險。

**為什麼量 CSS 的 `100vh` 而不是 `innerHeight`**：

1. CSS 的 `vh` 在行動裝置上**本來就不隨網址列變動** → 量它等於天生穩定，不必額外做凍結邏輯。
2. 量 `innerHeight` 會抓到「進站當下網址列展開」的小值；等網址列收合後，每個滿版區塊都短一截、
   露出下一段。
3. 最重要的是 **CSS 與 JS 從此讀同一個數字，是構造上一致，不是靠對齊。**

少數舊 Android 瀏覽器的 `vh` 會跟著動態視窗跑 —— 對它們，下面的「重量時機」就是真正的凍結。
兩種瀏覽器都不會比改版前差。

## 三、怎麼用

| 場合 | 寫法 | 定義在 |
| --- | --- | --- |
| SCSS | `height: vh();` `padding: vh(0.78);` | `app/assets/styles/mixins.scss` |
| JS 拼 CSS 字串 | `vhLength(3.2)` → `calc(var(--vh, 1vh) * 320)` | `app/utils/viewport-height.ts` |
| JS 數值 | `vhPx(1.2)` → `1.2 × 視窗高` | `app/composables/useViewportHeight.ts` |
| 純 CSS 區塊（無 `lang="scss"`）| `calc(var(--vh, 1vh) * 100)` | 手寫，全庫僅 `SymbolFace.vue` 一處 |

`--vh` 的值 ＝ **1vh 的 px**（視窗高 736 → `--vh: 7.36px`），由
`app/plugins/viewport-height.client.ts` 以離屏探測元素量出後寫進 `:root`。

**fallback 一定要留 `1vh`**：SSR 與 hydration 之前 `--vh` 還不存在，退回原生單位才不會塌成 0。
兩者在載入當下本來就相等 → 不會有 hydration 閃動。

### 重量時機

不能真的凍死（轉螢幕、拉視窗必須跟上），也不能每次 `resize` 都更新（那正是網址列收合會觸發的事）：

```
寬度變了（含轉螢幕）          → 更新
寬度沒變、但高度變動超過 25%   → 更新（分割畫面等真實版面改變）
其餘（網址列收合 ≈ 8–15%）     → 忽略
```

與 `plugins/gsap-config.client.ts` 的 `ignoreMobileResize` **刻意同一套判準** ——
否則會出現「尺重算了但 `--vh` 沒跟上」的半套狀態。

### 底部錨定要的是反過來的東西：`--chrome-inset`

（2026-08-09 補。起因：手機上 hero 的 skip 按鈕與「下滑看更多」全程看不到。）

凍結是有代價的：滿版區塊高 `--vh` ＝ large viewport，而手機**剛進站時網址列／底部工具列是
展開的**，可視高比它少 60–115px（iPhone Safari 實測 ~86px）。任何 `bottom` 錨定的元素都落在
工具列底下。hero 開場期間頁面又是鎖住的（見 `.claude/memory/hero-body-lock-rules.md`）→
**網址列永遠不會收合** → 那塊區域永遠露不出來。這不是 `--vh` 改版造成的：改版前寫死的
`height: 100vh` 一樣是 large viewport（`git show 99c9fac` 可驗）。

所以底部錨定不是問「一個視窗高是多少」，而是問「工具列此刻吃掉多少」—— 它是**活值**：

```scss
bottom: calc(20.67px + var(--chrome-inset)); // 設計稿的值 ＋ 補償
```

| | 定義 | 更新時機 |
| --- | --- | --- |
| `--vh` | large viewport ÷ 100 | 吃重量門檻（寬度變 or 高度劇變） |
| `--chrome-inset` | `max(0, 100vh − innerHeight)` | **每次 resize 都跟上**（含 `visualViewport`） |

算式是純函式 `chromeInset()`（`app/utils/viewport-height.ts`，有單元測試），兩個變數由同一支
`plugins/viewport-height.client.ts` 寫入 —— 它是**唯一**獲准直接讀 `window.innerHeight` 的
尺長相關檔案（已列入回歸測試白名單）。

目前使用者：`HeroVideo.vue` 的 `.sec1__hero-skip` 與 `.sec1__hero-scroll`。
之後任何「絕對定位在滿版區塊底部」的 UI 都該吃它。

## 四、什麼該換、什麼不該換

| 類別 | 定義 | 處置 |
| --- | --- | --- |
| **凍結** | 決定「尺有多長」「幾何錨在哪」。網址列收合**不該**改變它。 | `vhPx()` / `vh()` |
| **活值** | 回答「使用者此刻看得到什麼」。網址列收合**本來就該**改變它。 | 維持 `window.innerHeight` |
| **不動** | 量的是**元素框**不是視窗。 | 不碰 |

> 判錯「凍結 → 活值」＝ 漂移沒修掉；判錯「活值 → 凍結」＝ **引入新的錯位**。兩個方向都要看。

**已換（凍結）**：`Hero.vue` 的轉場 pin `end`／引言淡出 `end`／`--intro-runway`、
`OrangeCorePath.vue` 路徑起訖、`ForumCorePath.vue` 回中節點間距、`SymbolScene.vue` 段落高、
`Blessing.vue` 尺高、以及 `Blessing` / `SymbolFace` / `HeroVideo` / `Forum` 的滿版與
`Hero.scss` 兩處（runway fallback、`clamp()` 中項）。

**刻意沒換（活值）**：

| 位置 | 為什麼 |
| --- | --- |
| `AppHeader.vue` 的 `scrollHeight - innerHeight` | 這是**真實的最大可捲距離**；凍結會讓進度條到不了 100% |
| `Hero.vue` 的 `isVerticallyOnScreen` | 問的就是「影片現在在不在畫面上」 |
| `DevCoreProgress.vue` | dashboard 要顯示真相，凍結就看不到問題了 |
| `HeroLoader.vue` | 元素框優先、`innerHeight` 只是 fallback；磁磚多一列無害 |
| `Agenda.vue` 的播放頭 | 只在 `measure()`（mount ＋ refresh）跑，現況已等同凍結；語意上也該是活的 |

**不動（量元素框）**：`HeroSymbolTransition.vue` 的 `field.clientHeight`（**原始碼明文禁止**
改用 `innerHeight` —— 捲軸寬會導致 clip-path 錯位）、`SymbolFace.vue` 的 WebGL 視口換算。

## 五、例外

1. **`04.media`** —— 依專案決定排除。它是全庫**唯一**方向相反的一段：`Media.vue` 的
   `height: 100dvh` 刻意跟著 `window.innerHeight` 走。量過影響：它的兩條 trigger 端點是元素邊緣
   （`'top top'` / `'bottom top'`），本身不吃視窗高；`dvh` 讓 section 高度變動 60px，落在 2905px
   的 span 上約 **2%**，而且吃到的是**開關型** trigger 不是 scrub，所以只是離場偵測早／晚 60px。
   **已知、刻意保留的不一致，不是漏網之魚。**
2. **`05.subpage`** —— 已用 `100svh` 雙寫，本來就穩。但實測發現舞台 pin 的 `end: '+=100%'`
   **是對視窗高解析，不是 trigger 元素高**（合成測試：元素 400px、span 900 ＝ 視窗高）——
   `ignoreMobileResize` 正好把它釘住，與 svh 舞台一致。
3. **`SymbolFace.vue` 的 `.cfg__body`** —— dev 面板的 `max-height: calc(100vh - 68px)` 維持不動。
   面板本來就該貼合「此刻看得到的範圍」。
4. **`SymbolFace.vue` 的 `<style scoped>` 沒有 `lang="scss"`** → `vh()` 不可用，`.stage` 手寫成
   `calc(var(--vh, 1vh) * 100)`。全庫僅此一處。

## 六、驗收

量測工具 `scripts/vh-probe.js`（需帶 `?pathdebug`，由 `gsap-debug-bridge.client.ts` 把
ScrollTrigger 掛上 `window.__udnST`）。它量每條尺的 start / end / span / pin-spacer，
以及 N 個絕對捲動位置上各尺的 progress。

| 項目 | 結果 |
| --- | --- |
| 靜態無回歸（1388×736）| 8 條尺的 start/end/span 與改版前逐項相同、`scrollHeight` 18996 相同 |
| 靈敏度（`innerHeight` −60px）| 位移的尺 **6 條 → 0 條**、進度誤差 **0.077 → 0**、`scrollHeight` 不再變動 |
| 沒有凍死（改成 414×900）| 四條 VH 尺精準跟上：360 / 1080 / 2880 / 1080 ＝ VH 常數 × 900；`--vh` 7.36px → 9px |

`test/viewport-height.spec.ts` 守三件事：CSS 不再出現字面 vh 長度、JS 不再直接讀
`window.innerHeight`、**白名單本身不腐爛**（路徑或例外片段失效時測試會叫）。
新增段落時**不要**順手把自己加進 `OUT_OF_SCOPE`。

## 七、還沒驗證的

- **`ignoreMobileResize` 本身**。GSAP 以 `isTouch` 閘門，桌機 Chrome `ScrollTrigger.isTouch === 0`，
  這條路徑在開發環境進不去。不過它的重要性已下降：**尺長既然不吃 `innerHeight`，就算 GSAP 真的
  refresh，每條尺也會算出同一個值。** 它從「主要修正」退位成「少做幾次無謂 refresh」的最佳化。
- **真機**。iOS Safari / Android Chrome 上下捲動、網址列收合展開時，hero 轉場與祝福段臉屏是否
  還會跳；以及舊裝置（`vh` 可能跟著動態視窗跑的那種）是否如假設般被「重量時機」擋住。
- **`--chrome-inset` 的真機值**。桌機恆為 0。合成驗證做過（強制 86px → skip 按鈕的下緣由
  715.33 移到 629.33，正好落回「可視下緣 650」之內）；真機要確認的是 iOS Safari 在**頁面鎖住**
  時是否仍發得出 resize／`visualViewport` 事件（若完全不發，進站當下量到的那一次就已經是對的值）。
- **GSAP 內部的視窗高來源**。實測蓋掉 `window.innerHeight`（連 `documentElement.clientHeight`
  一起蓋再 `refresh()`）都不影響 GSAP 解析 `'bottom bottom'` 的結果 —— 它另有來源，沒有追下去。
  這也是為什麼上面的靈敏度數字被記為**下界**。
