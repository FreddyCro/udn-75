// header 背後有沒有一張「滿版、逐幀更新」的 canvas。
//
// 為什麼 header 需要知道這件事（2026-08-28）：
//   `.app-header__bar-wrap` 有 `backdrop-filter: blur(2px)`。backdrop-filter 的成本不是
//   一次性的 —— 瀏覽器每一幀都得把它底下那塊區域的合成結果**回讀、模糊、再合成**，
//   而「底下那塊」只要有任何變動就無法沿用上一幀的結果。平常頁面是靜態的，這筆成本
//   一輩子只付一兩次；但符號段那顆 canvas 是 fixed 滿版、**每一幀都在重畫**，於是整段
//   下來每一幀都要付一次滿版寬的 blur ＋ 一次 GPU→合成器的回讀。
//   在行動裝置上這條路徑特別貴，而它偏偏與收攏那段的 fill rate 高原重疊
//   （見 01a.symbol/SymbolFace.vue 的 convergeKeep prop）。
//
// 分工與 useHeaderBand / useHeaderTint 一致：**header 不認得任何段落**，只收一個布林；
// 宣告權在「知道自己正在滿版重畫」的那一層（01.hero/HeroSymbolTransition）。
//
// 為什麼是 useState 而不是 CSS 變數（與那兩支相反）：這個值**很少變**（一段轉場開頭
// 翻一次、交棒時翻回來），而它要驅動的是 class ——「逐幀變的用 CSS 變數、很少變的用
// useState」正是那兩支檔頭寫的同一條規則。
//
// ⚠️ 跨 client-side 導航存活（同 useHeaderBand / useHeaderTint 的老問題）：轉場途中點
//    logo 進子頁的話，本層卸載但旗標會永遠留在 true → 子頁的 header 從此沒有 blur。
//    故驅動端的 onBeforeUnmount 一定要補一次 false。
export function useHeaderCanvasBehind() {
  const canvasBehind = useState<boolean>('header-canvas-behind', () => false);

  /** true ＝ header 背後正在跑滿版 canvas（請放掉 backdrop-filter）；false ＝ 放手。 */
  const syncHeaderCanvasBehind = (on: boolean) => {
    if (!import.meta.client) return;
    if (canvasBehind.value !== on) canvasBehind.value = on;
  };

  return { canvasBehind, syncHeaderCanvasBehind };
}
