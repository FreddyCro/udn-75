// 錨點列的 scroll-spy 判定：段落用 data-anchor-target 宣告自己屬於哪個錨點，
// 這裡只做「目前與中央帶重疊的那些段落，該亮哪一個錨點」的推導（DOM／IntersectionObserver
// 在 AppHeader.vue，本檔純函式）。與 header-theme.ts 是同一套分工。

/**
 * 從「目前可見的段落」推導 active 錨點。
 *
 * - `order`：錨點的 target，依文件順序（＝ common.json 的 headerAnchors 順序）。
 * - `sectionTargets`：段落元素 → 它宣告的 target。一個 target 可以由多個段落共用：
 *   01a.symbol 是論壇章節的前導段落，與 #forum 本體同時對應 'forum'。
 * - `visible`：目前與中央帶重疊的段落元素。
 *
 * 參數收元素而不是 target 字串，是因為共用 target 的兩段在交界處會同時落在中央帶：
 * 呼叫端若維護的是字串集合，先離開的那段會把還在場的另一段一併刪掉，錨點就會閃斷。
 * 每次都從元素集合重新推導則沒有這個時序問題。
 *
 * 同時命中多個 target 時取 `order` 在前者（＝文件順序較前的章節）。
 */
export function pickActiveAnchor<T>(
  order: string[],
  sectionTargets: Map<T, string>,
  visible: Iterable<T>,
): string {
  const hit = new Set<string>();

  for (const el of visible) {
    const target = sectionTargets.get(el);
    if (target) hit.add(target);
  }

  return order.find((target) => hit.has(target)) ?? '';
}
