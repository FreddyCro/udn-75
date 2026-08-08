// 議程作用中群組的狀態轉移（純函式，無 DOM / Vue 依賴）。
//
// ⚠ 為什麼不是「每 tick 取樣、報告播放頭底下那一組」：那種做法在快速捲動時會跳號。
// 每組的作用區間長度**正好等於它自己的高度**（top 抵達視窗中央 → bottom 抵達視窗中央），
// 最短的一組只有 101px，所以任何一次 tick 間位移超過該高度的捲動，那一組就從沒有任何一幀
// 被觀察到是作用中 —— 實測 200px/幀 會得到 0 1 2 4 5 6（跳掉 3），30px/幀 才完整。
// 跳掉哪一組取決於步伐邊界落在哪裡，故症狀看起來是隨機的。
// 換成 IntersectionObserver 也一樣 —— 它同樣是取樣式的，這是架構性質而非某個 API 的缺陷。
//
// 解法：把「目標」與「當前」分開。目標由播放頭直接算出（可以跳），當前一次只走一步（不能跳），
// 跟不上時排隊補上。代價是快捲時作用中的組會落後於播放頭，不再逐幀等於視窗中央底下那一組。

/**
 * 播放頭在議程內的偏移 y（相對議程頂端，px）落在第幾組。
 *
 * `bounds` 是各組的累積邊界，長度 ＝ 組數 + 1，`bounds[0]` 為 0。
 * 上緣含、下緣不含；y 超過議程底緣時夾在最後一組（播放頭已飛出下方）。
 * y 為負（播放頭還在議程上方）或沒有群組時回 null。
 */
export function targetIndexAt(bounds: number[], y: number): number | null {
  const count = bounds.length - 1;
  if (count < 1 || y < 0) return null;
  for (let i = 0; i < count; i++) {
    if (y < bounds[i + 1]!) return i;
  }
  return count - 1;
}

/**
 * 朝 target 走一步（±1），故不可能跳號。
 *
 * `null` 代表「議程之外」，它在序列上排在第 0 組之前：從 null 進入一律先落在第 0 組，
 * 往回捲出議程則逐組退到 0 再回 null。反覆套用會走訪每一個中間索引 ——
 * 這就是「每組都必須觸發一次」的保證。
 */
export function stepToward(
  current: number | null,
  target: number | null,
): number | null {
  if (current === target) return current;
  if (current === null) return 0;
  if (target === null) return current === 0 ? null : current - 1;
  return current + Math.sign(target - current);
}
