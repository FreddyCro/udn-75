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
