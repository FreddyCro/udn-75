// SymbolFace 手機版彩蛋的切換規則（純函式，無 DOM／無 three）。
//
// 手機沒有 hover，故彩蛋改成 tap 驅動、且不分九宮格：點人臉任一處都是「換下一句」，
// 走到最後一句繞回第一句；開啟後不會因為手指離開而收起，只有點在人臉以外才關。
// 開啟期間另有一支 3 秒計時器同樣呼叫 nextEggIndex 自動往下換。
// （桌機仍是九宮格 hover 對位，走 symbol-hint 的 faceUv，與本檔無關。）

/** 彩蛋關閉時的索引。與 activeEgg 的「-1 ＝ 無」同義，兩邊共用同一個 sentinel。 */
export const EGG_CLOSED = -1;

/**
 * 換下一句：關閉狀態（或任何負值）→ 第一句，最後一句 → 繞回第一句。
 * total ≤ 0（沒有文案）時維持關閉 —— 不可對 0 取餘數。
 */
export function nextEggIndex(current: number, total: number): number {
  if (total <= 0) return EGG_CLOSED;
  if (current < 0) return 0;
  return (current + 1) % total;
}

/**
 * 點擊的決策：點在人臉 bbox 內 → 換下一句；點在以外 → 關閉。
 * onFace 由呼叫端以 symbol-hint 的 faceUv 判定（與桌機共用同一套框）。
 */
export function tapEggIndex(
  current: number,
  total: number,
  onFace: boolean,
): number {
  return onFace ? nextEggIndex(current, total) : EGG_CLOSED;
}
