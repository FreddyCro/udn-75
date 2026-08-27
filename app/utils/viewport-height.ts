// 「一個視窗高」的單一來源 —— CSS 側。
//
// 為什麼不直接寫 100vh：行動裝置上 `vh` 與 `window.innerHeight` **不是同一個數**。
// `vh` 是 large viewport（網址列隱藏時的高、收合時不變），`innerHeight` 是 dynamic
// viewport（會變）。本專案 CSS 寫 `100vh`、JS 讀 `innerHeight`，兩套尺並存 ——
// 實測視窗高差 60px 時，Hero 的 pin-spacer 少 72px、其下整份文件位移 72px、
// 同一捲動位置的進度差 0.077（見 scripts/vh-probe.js 與該次的量測紀錄）。
//
// 為什麼不用 dvh / svh / lvh：支援度要 2022 年後的瀏覽器，而本專案受眾的舊裝置
// 比例高。CSS 自訂屬性回溯到 2016，`vh` 更早 —— 用「探測 + 變數」等效且更保險。
//
// `--vh` 由 plugins/viewport-height.client.ts 量測後寫進 :root（值 ＝ 1vh 的 px）。
//
// ⚠️ fallback 一定要留 `1vh`：SSR 與 hydration 之前 `--vh` 還不存在，退回原生單位
//    才不會塌成 0（且兩者在載入當下本來就相等 → 不會有 hydration 閃動）。

/** n 個視窗高的 CSS 長度。`vhLength(3.2)` ＝ 原本的 `320vh`。 */
export function vhLength(n: number): string {
  return `calc(var(--vh, 1vh) * ${Math.round(n * 100 * 1000) / 1000})`;
}

// ── `--chrome-inset`：`--vh` 的「活值」對照 ────────────────────────────
//
// `--vh` 刻意凍結成 large viewport（＝網址列收合後的高），尺長才穩。代價是
// **滿版區塊比「此刻看得到的範圍」高一截** —— 手機剛進站時網址列／底部工具列
// 是展開的，兩者差 60–115px。任何 `bottom` 錨定的元素都落在工具列底下。
//
// hero 開場期間頁面還是鎖住的（見 01.hero/Hero.vue 的捲動鎖）→ 網址列永遠不會
// 收合 → skip 按鈕與「下滑看更多」全程露不出來。這不是新 bug：改用 `--vh` 之前
// 寫死的 `height: 100vh` 也是 large viewport，同一回事。
//
// 所以底部錨定要的不是「一個視窗高」，而是「工具列吃掉多少」：
//
//   bottom: calc(<設計稿的值> + var(--chrome-inset));
//
// 依 architecture/viewport-height.md 的分類，這是**活值** —— 它回答「使用者此刻
// 看得到的下緣在哪」，網址列收合本來就該改變它。故它與 `--vh` 相反，**不吃**
// 那套「寬度變了才更新」的重量門檻。

/**
 * 瀏覽器工具列吃掉的高度（px）＝ large viewport −「此刻的可視高」。
 *
 * @param vh100 量到的 CSS `100vh`（large viewport，即 `--vh` × 100）
 * @param innerHeight 此刻的 `window.innerHeight`（dynamic viewport）
 *
 * 夾在 0 以上：桌機兩者相等（0），少數瀏覽器 `innerHeight` 反而較大時也不該吐負值
 * —— 負的 inset 會把元素推到容器外。`vh100` 還沒量到（0）時同樣回 0。
 */
export function chromeInset(vh100: number, innerHeight: number): number {
  if (!vh100) return 0;
  return Math.max(0, vh100 - innerHeight);
}

// ── `--chrome-overscan`：`--chrome-inset` 的鏡像 ───────────────────────
//
// 上面那套的前提是「CSS 的 100vh ＝ large viewport ≥ 此刻可視高」。**in-app 瀏覽器
// 打破這個前提**：webview 的框在原生導覽列隱藏時**變高**，`100vh` 也跟著變高，但
// `--vh` 已經凍在導覽列還在時的小值（門檻見 plugins/viewport-height.client.ts 的
// RESIZE_EPS）。於是滿版區塊比可視範圍**矮**一截，下緣露出墊在後面的東西
// —— 實測 Threads 的 in-app 瀏覽器，子頁滿屏媒體下方漏出白底正文。
//
// `--chrome-inset` 補不了這個方向（它夾在 0 以上，此時恆為 0），所以另立一個鏡像值
// 回答「可視範圍比 --vh 多出多少」：
//
//   height: calc(100% + var(--chrome-overscan));  // 讓滿版層往下溢出補足
//
// 兩者**互斥**：一個為正時另一個必為 0（同一個差值的兩個方向）。正常瀏覽器
// （含 iOS Safari）恆為 0 —— 那裡 100vh 真的是 large viewport，本值不會生效。
// 與 `--chrome-inset` 同為**活值**，故同樣繞過 --vh 的重量門檻，每次 resize 都跟上。

/**
 * 可視範圍比 large viewport 多出來的高度（px）＝「此刻的可視高」− 量到的 100vh。
 *
 * @param vh100 量到的 CSS `100vh`（本該是 large viewport，即 `--vh` × 100）
 * @param innerHeight 此刻的 `window.innerHeight`（dynamic viewport）
 *
 * 夾在 0 以上：正常瀏覽器 `innerHeight ≤ vh100`，吐負值會把滿版層縮得比現在更矮。
 * `vh100` 還沒量到（0）時回 0 —— 那時整個視窗高會被誤當成溢出量。
 */
export function chromeOverscan(vh100: number, innerHeight: number): number {
  if (!vh100) return 0;
  return Math.max(0, innerHeight - vh100);
}
