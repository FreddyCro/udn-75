import { setHeaderVar } from '~/utils/header-css-var';
import type { HeaderTheme } from '~/utils/header-theme';

// 轉場「開窗」時，窗內那一段 header 反白 —— 窗的座標由轉場自己交出來，header 只管畫。
//
// 設計稿 Figma 2065:142710（智慧論壇6）的圖層結構就是這個做法：`Mask group` 裡除了深色
// 粒子場，還放了**第二份 header**（反白版），與色場吃同一個遮罩。也就是「同一份 header 疊
// 兩層、反白那層套用與展開動畫相同的窗形」。本檔是那個窗的單一來源。
//
// 為什麼是 CSS 變數而不是 useState：
//   窗的左右緣**逐幀**變（轉場全程由 scroll scrub 驅動），走 reactive 等於每幀一次
//   re-render；而 header 需要的其實只是兩個數字進到 CSS。故幾何寫 header 元素的
//   inline style（繼承給它的子樹，寫入細節與快取見 ~/utils/header-css-var），只有
//   「有沒有開窗／窗內是什麼主題」這種**很少變**的狀態才是 useState —— 那個要驅動 v-if。
//
// 為什麼 header 那層要 v-if 而不是常駐（clip 成空）：
//   反白層是整份 bar 的副本，裡面有 <AppHeaderShare>（onMounted 掛 document 監聽）。
//   常駐等於整站生命週期都多一組監聽與一份 DOM，只為了兩段各約兩秒的轉場。
//
// ⚠️ 座標系：窗與 header 都是 fixed 貼齊視窗左上（且都不含捲軸寬），故驅動端算出來的
//    left / right 可以**直接**交給 header，不需要任何換算。用 `field.clientWidth` 之類
//    「不含捲軸」的尺量出來的值才成立；混到 window.innerWidth（含捲軸）會整體偏移。
//
// ⚠️ 目前有一個驅動端（01.hero/HeroSymbolTransition，theme 'dark'）。
//    03 → 04 的融合橘幕（Blessing 的 `.section3__veil`，收窄而非展開）之後要接上時，
//    在它的 tween onUpdate 裡呼叫同一支 syncHeaderBand，theme 傳 'orange' 即可 ——
//    header 端不必再改。**同一時間只能有一個驅動端**（後寫的蓋掉前一個），這對目前
//    兩段轉場成立（它們在捲動軸上不重疊）。

export interface HeaderBandRect {
  /** 窗內那段 header 的主題（01→02 深色場 → 'dark'；03→04 橘幕 → 'orange'） */
  theme: HeaderTheme;
  /** 窗的左緣（視窗座標 px） */
  left: number;
  /** 窗的右緣（視窗座標 px） */
  right: number;
  /** 窗的上緣（視窗座標 px）；預設 0 ＝ 窗本來就滿高。見下方 top 的判斷。 */
  top?: number;
}

const VAR_LEFT = '--hd-band-l';
const VAR_RIGHT = '--hd-band-r';

// 寫入目標（header 本體）、值沒變就不寫、換了元素就清快取 —— 這三件事搬到
// ~/utils/header-css-var 了，因為 useHeaderTint 需要**同一份**（那裡的快取失效
// 時機才是真正微妙的地方，複製一份等於複製那些坑）。理由與細節見該檔檔頭。

export function useHeaderBand() {
  const bandTheme = useState<HeaderTheme | null>('header-band', () => null);

  /**
   * 每幀呼叫：傳 rect ＝ 現在的窗，傳 null ＝ 沒有窗（收掉反白）。
   *
   * 「要不要反白」的判定收在這裡、不放各驅動端，理由是那條不變量與**做法**綁在一起：
   * 亮列是用一條**水平**的 linear-gradient 遮罩挖洞的（見 AppHeader 的 .has-band），
   * 表達不了垂直邊界 —— 窗還沒蓋滿 header 那一列（top > 0）就挖洞的話，缺口上半會直接
   * 穿幫成 hero 的白底。所以 top > 0 一律不反白。
   *
   * 對 01 → 02：拉長段那條 26px 的窄長條爬到頂（top 收成 0）正好等於展開段開始，
   * 於是反白與「左右打開」同時發生。對 03 → 04：橘幕本來就滿高，top 恆為 0，不受影響。
   */
  const syncHeaderBand = (rect: HeaderBandRect | null) => {
    if (!import.meta.client) return;

    const open = !!rect && rect.right > rect.left && (rect.top ?? 0) <= 0;
    if (!open) {
      if (bandTheme.value !== null) bandTheme.value = null;
      return;
    }

    // ⚠️ 順序：先寫幾何、後翻 bandTheme。翻 theme 會觸發 v-if 掛上反白層，
    //    而 Vue 的 DOM 更新是下一個 tick —— 那時變數早就是對的值，不會有一幀
    //    用著上一輪殘留的 l / r 畫出來的錯位反白。
    // 座標 toFixed(1)：收窄／展開的慢段常常好幾幀同值，setHeaderVar 靠字串比對擋掉重寫。
    setHeaderVar(VAR_LEFT, `${rect!.left.toFixed(1)}px`);
    setHeaderVar(VAR_RIGHT, `${rect!.right.toFixed(1)}px`);
    if (bandTheme.value !== rect!.theme) bandTheme.value = rect!.theme;
  };

  return { bandTheme, syncHeaderBand };
}
