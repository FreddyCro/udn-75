/**
 * 逐格變形：由弧長決定第幾格，故往回捲會自動逆向變回方塊。
 * swapLen 為 null（變身節點量不到）時恆為第 0 格 —— 退回橘方塊，不中斷整條線。
 */
export function morphFrame(
  len: number,
  swapLen: number | null,
  morphLen: number,
  frameCount = 9,
): number {
  if (swapLen == null || morphLen <= 0) return 0;
  const t = (len - swapLen) / morphLen;
  if (t <= 0) return 0;
  // 夾住上界：t === 1 時 floor(1 × 9) 會是 9，超出格數。
  return Math.min(frameCount - 1, Math.floor(t * frameCount));
}

/**
 * 彗星尾視窗 → 遮罩 path 的 dasharray 頭段長度與 dashoffset。
 * rearOffset ＝ 機尾相對路徑點的後退量：尾跡前端要退同樣距離才會貼著機尾。
 * dash 為 0 時遮罩不透出任何像素，offset 沒有意義。
 */
export function trailWindow(
  len: number,
  swapLen: number | null,
  tailLen: number,
  rearOffset: number,
): { dash: number; offset: number } {
  if (swapLen == null) return { dash: 0, offset: 0 };
  const head = len - rearOffset;
  const s = Math.max(swapLen, head - tailLen);
  return { dash: Math.max(0, head - s), offset: -s };
}
