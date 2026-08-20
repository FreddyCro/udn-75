// 退場影片「追趕捲動」的倍速選擇（純判定，無 DOM／無 Vue）。
//
// 抽成純函式的理由同 hero-dissolve：這類判定壞掉時畫面上不會有東西喊出來，
// 只會是「影片抖動」或「退場追不上捲動」，都要試玩很久才發現。
//
// ── 為什麼值域是離散的兩個值 ─────────────────────────────────────────
// 2026-08-21 實測（requestVideoFrameCallback 量每一格的呈現時間）：以連續變化的
// playbackRate 播放時，影格的呈現間隔換算成螢幕刷新單位是
//
//     1  1  1  1  2  1  1  1  1  2  1  1  1  2  1  1  1  2  1  1  2  1  2  1
//
// 每格被顯示 1 次或 2 次刷新、且不規則交替 —— 這是 cadence judder（3:2 pulldown
// 那一類），肉眼看就是嚴重抖動。
//
// 原因是固定刷新率：影片 30fps、螢幕 60Hz，只有讓 `30 × rate` 整除 60 的倍速
// 才有固定節奏 ——
//     rate 1.0 → 30fps → 每格剛好 2 次刷新
//     rate 2.0 → 60fps → 每格剛好 1 次刷新
// 中間值（1.23、1.5…）無論怎麼平滑都不可能固定，因為問題不在「變化太快」，
// 而在「30 × rate 不整除 60」。故解法不是加緩動，是**把值域收成離散集合**。
//
// ⚠️ 這個集合綁死在「30fps 影片 ＋ 60Hz 螢幕」。120Hz 螢幕上安全值會多出 1.33 與 4；
//    換剪輯改了 fps 也要重算。目前三支剪輯都是 30fps（實測 1222 幀 / 40.70s），
//    而 60Hz 是最保守的假設（在 120Hz 上跑 {1, 2} 仍然整除，只是沒用到多的檔位），
//    故不做動態偵測 —— 多一個會失準的執行期依賴不值得。
/** 追上了：正常速度播。 */
export const OUTRO_RATE_SLOW = 1;
/** 落後了：兩倍速追。這是實測的免費上限（2× ＝ 60fps ＝ 螢幕刷新率，掉 0 幀）。 */
export const OUTRO_RATE_FAST = 2;

/** 落後超過這個比例（相對退場段全長）就加速。2.5s 的退場 ⇒ 約 0.5s。 */
export const OUTRO_LAG_ENGAGE = 0.2;
/** 落後回到這個比例之下才降回 1×。刻意低於 ENGAGE，中間是遲滯帶。 */
export const OUTRO_LAG_RELEASE = -0.05;

/** 換過倍速之後至少要維持這麼久（ms）才允許再換。
 *
 *  ⚠️ 這是治抖動的**主要**手段，遲滯帶只是輔助。2026-08-21 實測：把值域收成 {1, 2}
 *     之後抖動反而更嚴重 —— 節奏出現 1／2／3 三種、32 幀內切換 25 次。原因是每一次
 *     寫入 playbackRate 都讓媒體管線重新同步（那些 3 次刷新的間隔就是同步的痕跡），
 *     而窄遲滯帶讓切換每約 10 幀發生一次。
 *     「每幀寫入**相同**值」是無害的（同日實測 loop 與 outro 的呈現間隔完全相同），
 *     代價全在**改變**那一刻。故真正要壓的是切換次數。
 *     600ms ⇒ 2.5 秒的退場最多換 4 次。 */
export const OUTRO_RATE_MIN_DWELL_MS = 600;

/** 影片落後捲動多少（`pScroll − pVideo`）＋ 目前倍速 ＋ 距上次換檔多久 → 下一個倍速。
 *
 *  @param lag 正值 ＝ 影片落後於捲動；負值 ＝ 影片跑在前面（沒有捲動、影片自己在播）。
 *  @param current 目前的 `playbackRate`。非法值一律當 1×，不把它傳播下去
 *    （呼叫端讀的是 <video>.playbackRate，那顆值可能被別處寫過）。
 *  @param msSinceChange 距離上次換檔的毫秒數。未滿 OUTRO_RATE_MIN_DWELL_MS 一律維持現狀。
 *
 *  ⚠️ RELEASE 是**負值**：只有在影片已經追過捲動（沒在捲了）時才降回 1×。落後還是正的
 *     就繼續 2× —— 在「還落後」的時候降速只會讓落後再擴大、稍後又得升回去，那正是
 *     顫振的來源。 */
export function outroPlaybackRate(
  lag: number,
  current: number,
  msSinceChange: number,
): number {
  const now = current === OUTRO_RATE_FAST ? OUTRO_RATE_FAST : OUTRO_RATE_SLOW;
  if (msSinceChange < OUTRO_RATE_MIN_DWELL_MS) return now;
  if (lag >= OUTRO_LAG_ENGAGE) return OUTRO_RATE_FAST;
  if (lag <= OUTRO_LAG_RELEASE) return OUTRO_RATE_SLOW;
  return now;
}
