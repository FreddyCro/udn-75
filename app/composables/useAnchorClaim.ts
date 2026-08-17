// 段落主動宣告「現在該亮哪一個錨點」，蓋過 AppHeader 的幾何 scroll-spy。
//
// 幾何 spy（`data-anchor-target` ＋ 視窗中央帶的 IntersectionObserver，見 AppHeader 與
// ~/utils/anchor-spy）的前提是「段落在文件流裡的位置 ＝ 它在畫面上的位置」。
// **這個前提對 fixed 視覺的段落不成立**：01a.symbol 只是一把捲動尺（`.sec-symbol` 是個空的
// SYMBOL_VH 高佔位），真正的畫面住在 hero 的 <HeroSymbolTransition> slot 裡、fixed 滿版 ——
// 開場三行文案已經在視窗正中央演了 37vh，`.sec-symbol` 自己才剛捲到中央帶。
// 那 37vh 不是可以調的參數：它是「rootMargin 45% ↔ 段落起點對齊視窗底」兩套座標的差。
//
// 所以這條軌是給「自己有一把尺、知道自己什麼時候在畫面上」的段落用的。
// 一般段落不需要它 —— 幾何 spy 對它們是對的，別為了「早一點亮」而濫用。
//
// ⚠ 同一時間只有一個宣告者（後寫的蓋掉前一個）。宣告者有責任在自己離場時寫回 null，
//   否則 header 會永遠卡在那個錨點上（`pickActiveAnchor` 取文件順序在前者，而 'forum'
//   正好是第一個 —— 漏放手的話後面兩個錨點再也亮不起來）。
//   ⚠ useState **跨 client-side 導航存活**（同 symbolProgress 的老問題），
//     故宣告者的 onBeforeUnmount 也要清一次，不能只靠捲動時的 watch。
export function useAnchorClaim() {
  const anchorClaim = useState<string | null>('anchor-claim', () => null);
  const setAnchorClaim = (target: string | null) => (anchorClaim.value = target);
  return { anchorClaim, setAnchorClaim };
}
