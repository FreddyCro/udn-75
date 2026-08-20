import type { HeaderTheme } from '~/utils/header-theme';

// 轉場「開窗」時，窗內那一段 header 反白 —— 窗的座標由轉場自己交出來，header 只管畫。
//
// 設計稿 Figma 2065:142710（智慧論壇6）的圖層結構就是這個做法：`Mask group` 裡除了深色
// 粒子場，還放了**第二份 header**（反白版），與色場吃同一個遮罩。也就是「同一份 header 疊
// 兩層、反白那層套用與展開動畫相同的窗形」。本檔是那個窗的單一來源。
//
// 為什麼是 CSS 變數而不是 useState：
//   窗的左右緣**逐幀**變（轉場全程由 scroll scrub 驅動），走 reactive 等於每幀一次
//   re-render；而 header 需要的其實只是兩個數字進到 CSS。故幾何寫 documentElement 的
//   inline style（繼承給整棵樹），只有「有沒有開窗／窗內是什麼主題」這種**很少變**的狀態
//   才是 useState —— 那個要驅動 v-if。
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

// 寫入目標：header 本體，不是 documentElement。
//
// 這兩個是**會繼承**的自訂屬性，寫在根節點等於每一幀讓整棵樹的 computed style 失效
// （轉場全程逐幀寫），而真正的消費者只有 AppHeader 底下那兩層。改寫在 header 上，
// 失效範圍從整份文件縮到 header 子樹，繼承照舊成立、CSS 一個字都不用改。
// 元素以 data- 屬性尋址（同 data-header-theme／data-morph-veil 的慣例）；查一次快取，
// 找不到就退回 documentElement（例如某頁沒有 header —— 行為與改版前相同）。
let bandEl: HTMLElement | null = null;
// 上一次寫進去的值（字串比對，見 syncHeaderBand）。換了目標元素必須一併清掉，
// 否則新元素身上沒有這兩個變數、快取卻說「值沒變」，反白窗會停在錯誤位置
let lastLeft = '';
let lastRight = '';
const bandTarget = () => {
  // 只在「真的找到」時才快取 —— 若 fallback 也存進 bandEl，documentElement 永遠
  // isConnected，header 之後掛上來也不會被重新認出
  if (bandEl?.isConnected) return bandEl;
  const found = document.querySelector<HTMLElement>('[data-header-band]');
  if (found !== bandEl) {
    lastLeft = '';
    lastRight = '';
  }
  bandEl = found;
  return found ?? document.documentElement;
};

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
    const s = bandTarget().style;
    // 值沒變就不寫：座標是 toFixed(1) 之後的字串，收窄／展開的慢段常常好幾幀同值
    const l = `${rect!.left.toFixed(1)}px`;
    const r = `${rect!.right.toFixed(1)}px`;
    if (l !== lastLeft) {
      lastLeft = l;
      s.setProperty(VAR_LEFT, l);
    }
    if (r !== lastRight) {
      lastRight = r;
      s.setProperty(VAR_RIGHT, r);
    }
    if (bandTheme.value !== rect!.theme) bandTheme.value = rect!.theme;
  };

  return { bandTheme, syncHeaderBand };
}
