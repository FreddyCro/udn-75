import { setHeaderVar } from '~/utils/header-css-var';

// header 配色的**逐幀漸變**：某一段捲動距離內，三顆色票在 dark 與 light 之間連續插值，
// 取代 data-header-theme 那種「在門檻上硬翻一次」。
//
// 為什麼要有這支（2026-08-22）：符號段收攏之後有一段 20vh 的窗口，整片底色在那裡由黑
// 轉白（見 orange-core-config 的 CORE_WARM_VH）。header 原本是在那個窗口的**正中央**
// 硬翻 dark → light，而且只有底色吃到 CSS 的 0.3s 補間、文字與 icon 是瞬間跳 ——
// 使用者回報的「進入 forum 直接切換主題」就是那一下。
//
// 分工：離散三檔（light / dark / orange）**不動**，全站其他段落一字不改；本頻道只是
// 在窗口期間**疊一層覆寫**，窗口外放手交還給 data-header-theme。放手不會看到跳色 ——
// 判定端保證窗口兩端的插值結果與接手的那一檔完全同色，見 headerTintAt 的註解。
//
// 為什麼是 CSS 變數而不是 useState（同 useHeaderBand 的理由）：
//   量逐幀變（全程由 scroll 驅動），走 reactive 等於每幀讓整個 AppHeader re-render ——
//   而它底下有錨點列、音效、share 面板。header 需要的其實只是**一個數字**進到 CSS。
//   故量寫 header 的 inline style（見 ~/utils/header-css-var），只有「現在有沒有在漸變」
//   這種**很少變**的布林才是 useState —— 那個要驅動 class。
//
// ⚠️ 目前只有一對端點（dark → light），故 CSS 那邊直接把兩組色票寫死在 .--tint 區塊裡，
//    沒有做成 from / to 參數。之後真的出現第二對（例如 orange → light）再抽 —— 那時
//    要把兩端的三顆色票變成變數，CSS 會膨脹三倍，現在付這個成本沒有回報。
//
// ⚠️ 同一時間只能有一個驅動端（後寫的蓋掉前一個）。這對目前唯一的驅動端
//    （01a.symbol/SymbolScene）當然成立；之後要多一個，先確認兩段在捲動軸上不重疊。
//    與 useHeaderBand 是**互不相干的兩個頻道**（各自的變數、各自的 class），band 的
//    驅動端在 hero 轉場（120vh）、tint 在符號段尾（304–324vh），不重疊也不必協調。

const VAR_TINT = '--hd-tint';

export function useHeaderTint() {
  /** 現在是否在漸變中。false ＝ 放手，配色回到 data-header-theme 的離散三檔。 */
  const headerTinted = useState<boolean>('header-tint', () => false);

  /**
   * 每幀呼叫：傳 0..1 ＝ 現在的漸變量（0 ＝ dark 端、1 ＝ light 端），傳 null ＝ 放手。
   *
   * ⚠️ 放手一定要呼叫，不能只是「停止呼叫」：旗標是 useState、**跨 client-side 導航
   *    存活**，留著 true 會讓 tint 黏在後面的段落上（例如把 blessing 那段的橘主題
   *    混成淺色）。驅動端的 unmount 也要補一次 null，見 SymbolScene。
   */
  const syncHeaderTint = (amount: number | null) => {
    if (!import.meta.client) return;

    if (amount === null) {
      if (headerTinted.value) headerTinted.value = false;
      return;
    }

    // ⚠️ 順序：先寫量、後翻旗標（同 useHeaderBand 的理由）。翻旗標會掛上 .--tint 那組
    //    覆寫，而 Vue 的 DOM 更新是下一個 tick —— 那時變數早就是對的值，不會有一幀
    //    用著上一輪殘留的量畫出錯誤的顏色。
    // toFixed(4)：窗口只有 20vh（1080 高的視窗約 216px），每 px 的步進約 0.005，
    // 四位小數遠比一個像素細；截成字串才有得比對，捲動停住時每一幀都會被擋掉。
    setHeaderVar(VAR_TINT, amount.toFixed(4));
    if (!headerTinted.value) headerTinted.value = true;
  };

  return { headerTinted, syncHeaderTint };
}
