// 頂部固定列的高度（--header-height）的單一讀取點。
//
// 原本這支是 AppHeader 內部的區域函式；2026-09-06 抽出來是因為多了第二個消費者：
// 反白窗的閘門（~/composables/useHeaderBand）要問「窗有沒有碰到 header 那一列」，
// 而那一列的底緣**就是**錨點捲動在補償的同一個數字。兩邊各讀一次的話，
// 快取的失效時機也會有兩份 —— 那正是最容易各自漂移的東西。
//
// 快取：getComputedStyle() 會強制 style flush，而這支的兩個消費者都是**逐幀**呼叫
// （updateTheme 每個捲動幀一次、syncHeaderBand 每個轉場幀一次）。--header-height
// 只隨斷點變（媒體查詢），捲動中是常數 → 失效點只有 resize。
//
// ⚠️ 失效的呼叫端只有一個：AppHeader 的 onResize。這是刻意的 —— 本檔不自己掛
//    listener（模組層的 listener 沒有對應的卸載點），而反白窗只有在 header 在場時
//    才有意義，AppHeader 不在就沒人會問這個數字。
let cached: number | null = null;

/** header 那一列的底緣（px）。SSR 回 0 —— 那時沒有版面可量，判定端一律不作用。 */
export function getHeaderOffset(): number {
  if (!import.meta.client) return 0;
  if (cached === null) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(
      '--header-height',
    );
    cached = parseFloat(raw) || 0;
  }
  return cached;
}

/** 斷點可能換了 → 下次重讀。呼叫點見上方 ⚠️。 */
export function invalidateHeaderOffset(): void {
  cached = null;
}
