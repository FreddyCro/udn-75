// 逐幀寫進 header 的 CSS 自訂屬性 —— 目前有兩個頻道共用這一支：
//   ・反白窗的幾何（--hd-band-l / --hd-band-r，見 ~/composables/useHeaderBand）
//   ・配色的漸變量（--hd-tint，見 ~/composables/useHeaderTint）
//
// 為什麼抽出來共用而不是各自寫一份：真正微妙的不是 setProperty，是下面兩層快取的
// **失效時機**（見 resolveHost 的兩個 ⚠️）。複製一份等於複製那兩個坑，而它們壞掉的
// 症狀都是「畫面停在上一輪的值」—— 不會報錯，只會看起來怪。
//
// 為什麼寫在 header 本體、不是 documentElement：
// 這些是**會繼承**的自訂屬性，寫在根節點等於每一幀讓整棵樹的 computed style 失效
// （轉場全程逐幀寫），而真正的消費者只有 AppHeader 底下那幾層。改寫在 header 上，
// 失效範圍從整份文件縮到 header 子樹，繼承照舊成立、CSS 一個字都不用改。
//
// 元素以 data- 屬性尋址（同 data-header-theme／data-morph-veil／data-metaball-scope 的
// 慣例）—— class 是樣式的名字，改名重構不該把轉場打斷。

/** header 上的宿主屬性。屬性名叫 vars 而不是某個頻道的名字：它是**所有**逐幀變數的家。 */
const HOST_ATTR = '[data-header-vars]';

let host: HTMLElement | null = null;
/** 上一次寫進去的值（字串比對，見 setHeaderVar）。key ＝ 變數名。 */
const lastValues = new Map<string, string>();

const resolveHost = (): HTMLElement => {
  // ⚠️ 只在「真的找到」時才快取 —— 若 fallback 也存進 host，documentElement 永遠
  //    isConnected，header 之後掛上來也不會被重新認出。
  if (host?.isConnected) return host;
  const found = document.querySelector<HTMLElement>(HOST_ATTR);
  // ⚠️ 換了目標元素必須一併清掉值快取：新元素身上沒有這些變數、快取卻說「值沒變」，
  //    於是永遠不寫 —— 反白窗會停在錯誤位置、tint 會卡在上一輪的量。
  if (found !== host) lastValues.clear();
  host = found;
  // 找不到就退回 documentElement（例如某頁沒有 header）——「不作用」而不是丟例外。
  return found ?? document.documentElement;
};

/**
 * 寫一個逐幀變數。**呼叫端不必自己做節流**：
 * 值沒變就不寫 —— 逐幀呼叫時同值的幀很多（座標 toFixed 之後常常好幾幀相同，
 * 而捲動停住時每一幀都同值），少一次 setProperty 就少一次 style 失效。
 *
 * client-only（碰 document）；在 server 上是 no-op，呼叫端不必再包一層判斷。
 */
export function setHeaderVar(name: string, value: string): void {
  if (!import.meta.client) return;
  const el = resolveHost();
  if (lastValues.get(name) === value) return;
  lastValues.set(name, value);
  el.style.setProperty(name, value);
}
