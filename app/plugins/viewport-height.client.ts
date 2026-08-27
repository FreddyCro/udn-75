// 量測「一個視窗高」，寫進 :root 的 --vh，並存進共用狀態供 JS 讀取。
// 用途與單位選擇的理由見 ~/utils/viewport-height。
//
// ── 量的是什麼 ────────────────────────────────────────────────────────
// 刻意量 **CSS 認為的 100vh**（離屏探測元素），不是 window.innerHeight：
//
//   ・行動裝置上 CSS 的 vh ＝ large viewport，網址列收合時**本來就不變** ——
//     量它等於天生穩定，不必額外凍結。
//   ・量 innerHeight 則會抓到「進站當下網址列展開」的小值，等網址列收合後
//     每個滿版區塊都短一截、露出下一段。
//   ・最重要的是：CSS 與 JS 從此讀同一個數字，是**構造上一致**，不是靠對齊。
//
// 少數舊 Android 瀏覽器的 vh 會跟著動態視窗跑 —— 對它們，下面的「只在寬度變動
// 或高度劇變時才更新」就是真正的凍結。兩種瀏覽器都不會比改動前差。
//
// ── 什麼時候重量 ──────────────────────────────────────────────────────
// 不能真的凍死：轉螢幕、拉視窗都必須跟上。但也不能每次 resize 都更新 ——
// 那正是網址列收合會觸發的事件。判準：
//
//   寬度變了（含轉螢幕）→ 更新
//   寬度沒變、但高度變動超過 25% → 更新（分割畫面等真實版面改變）
//   其餘（＝網址列收合的量級，實測 60–120px ≈ 8–15%）→ 忽略
//
// 這與 GSAP 的 ignoreMobileResize 同一套判準（見 plugins/gsap-config.client.ts），
// 兩者刻意保持一致 —— 否則會出現「尺重算了但 --vh 沒跟上」的半套狀態。
//
// ── 順便量的另兩件事：--chrome-inset／--chrome-overscan ───────────────
// 上面那套「凍結」讓滿版區塊比此刻看得到的範圍高一截（網址列展開時）。底部錨定的
// UI 要的是相反的東西 —— 工具列吃掉多少。理由與用法見 ~/utils/viewport-height 的
// chromeInset()。它是**活值**，故刻意繞過上面的重量門檻，每次 resize 都跟上。
//
// --chrome-overscan 是它的鏡像，補的是**反方向**：in-app 瀏覽器的 webview 框在原生
// 導覽列隱藏時變高，100vh 也跟著變高，但 --vh 已凍在小值 ⇒ 滿版區塊比可視範圍矮，
// 下緣露餡。理由與用法見 chromeOverscan()。同為活值，與 inset 同一條路徑更新。
import { chromeInset, chromeOverscan } from '~/utils/viewport-height';
import { refreshScrollTriggers } from '~/utils/scroll-trigger';

/** 高度變動超過這個比例才視為真實版面改變（網址列收合遠低於此）。 */
const RESIZE_EPS = 0.25;

export default defineNuxtPlugin(() => {
  const vh = useState<number>('viewport-height', () => 0);

  // 離屏探測：不依賴當下畫面狀態，也不觸發任何可見的版面變化。
  //
  // 探測元素**常駐**（原本每次量測都 createElement → appendChild → 讀 rect → remove）：
  // 插入與移除各自讓版面失效一次，等於每個 resize 事件兩次 layout invalidation，
  // 而桌機拖視窗會連續發事件。常駐的成本是一個 width: 0 的 fixed 節點。
  let probe: HTMLDivElement | null = null;
  const measure = () => {
    if (!probe) {
      probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;top:-9999px;left:0;width:0;height:100vh;pointer-events:none;';
      probe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(probe);
    }
    // getBoundingClientRect 而非 offsetHeight：後者取整，DPR 非整數時會少算小數位。
    return probe.getBoundingClientRect().height;
  };

  const commit = (h: number) => {
    vh.value = h;
    document.documentElement.style.setProperty('--vh', `${h / 100}px`);
  };

  // 工具列吃掉的高度，以及它的鏡像（可視範圍反而多出來多少）。兩者跟著 --vh 一起更新
  // （--vh 變了、差值當然要重算），但**也**在 --vh 被門檻擋掉時單獨更新 ——
  // 網址列／in-app 導覽列收合正是它們該跟上的事。
  // 一個函式寫兩個值：它們是同一個差值的兩個方向（必有一邊為 0），分開寫只會漂掉。
  const commitInset = () => {
    const ih = window.innerHeight;
    document.documentElement.style.setProperty(
      '--chrome-inset',
      `${chromeInset(vh.value, ih)}px`,
    );
    document.documentElement.style.setProperty(
      '--chrome-overscan',
      `${chromeOverscan(vh.value, ih)}px`,
    );
  };

  commit(measure());
  commitInset();
  let lastWidth = window.innerWidth;

  const handleResize = () => {
    const widthChanged = window.innerWidth !== lastWidth;
    lastWidth = window.innerWidth;
    const next = measure();
    const jumped = vh.value > 0 && Math.abs(next - vh.value) / vh.value > RESIZE_EPS;
    if (!widthChanged && !jumped) {
      commitInset(); // 網址列收合／展開：--vh 不動，但可視高變了
      return;
    }
    if (next === vh.value) {
      commitInset();
      return; // 寬度變了但高度沒變 → 不必驚動 ScrollTrigger
    }
    commit(next);
    commitInset();
    // 尺長吃 --vh 的元素剛換了高度 → 主動重算，不等 GSAP 自己的 resize 處理，
    // 免得它先用舊值刷一次（ignoreMobileResize 也可能讓它整個跳過）。
    // 走 refreshScrollTriggers()（先 sort 再 refresh）—— 這是全站規模的重算，
    // 吃 --vh 的尺散在各 section，最需要照位置順序算（見 utils/scroll-trigger）。
    refreshScrollTriggers();
  };

  // 每幀最多跑一次：桌機拖視窗會連續發 resize，而這支處理器最重的那條路徑會一路
  // 打到 refreshScrollTriggers()（全站 sort + refresh）。合併到 rAF 後，一次拖曳
  // 從「每個事件一次全站重算」變成「每幀最多一次」。
  let resizeRaf = 0;
  const onResize = () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      handleResize();
    });
  };

  window.addEventListener('resize', onResize, { passive: true });

  // iOS Safari 的網址列收合有時只發 visualViewport 的事件、不發 window resize
  // （尤其在頁面鎖住、只有工具列自己在動的時候）。有就一起聽，沒有（舊瀏覽器）
  // 也不影響 —— 那些瀏覽器的 vh 本來就跟著動態視窗跑，inset 恆為 0。
  window.visualViewport?.addEventListener('resize', commitInset);
});
