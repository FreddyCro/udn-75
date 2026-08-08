// 換頁轉場結束後全體重算 ScrollTrigger。
//
// 為什麼需要：子頁互切（layout 不變）走 app.pageTransition 的「page」轉場，
// 進場期間頁面根元素帶 transform: scale(0.96)（見 assets/styles/base.scss）。
// mode: out-in 下新頁在 enter 一開始就 mount，各 pin section（Subpage 舞台、
// FormulaBlocks、PhotoPanels、AwardTimeline）的 onMounted 於此刻建立並量測 ——
// 量到的是縮小 4% 的位置與尺寸，且 pin 會把該尺寸鎖成 inline style（例如
// 900px 高的舞台被鎖成 864px）。轉場結束 transform 移除後不會有事件再觸發
// refresh（只有 resize），錯誤量測就此固定 → 跑版。
//
// ⚠️ page:transition:finish 發得比想像早：它綁的是「舊頁 onAfterLeave」，
// out-in 下等於新頁 enter 才剛起跑、scale 還掛著 —— 此刻 refresh 量到的仍是
// 縮放中的版面。因此 hook 後先以 rAF 輪詢等 .page-enter-active 從 DOM 消失
// （enter 真正演完、transform 已移除），再多等兩個 rAF 讓 Nuxt scrollBehavior
// 的回頂捲動落定，才做全體重算。3 秒上限是保險：就算 class 沒等到也照樣刷。
// 首頁↔子頁（layout 轉場、純 opacity）本來就沒問題，多刷一次無害。
import { refreshScrollTriggers } from '@/utils/scroll-trigger';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:transition:finish', () => {
    const deadline = performance.now() + 3000;
    const tick = () => {
      if (
        document.querySelector('.page-enter-active') &&
        performance.now() < deadline
      ) {
        requestAnimationFrame(tick);
        return;
      }
      requestAnimationFrame(() => requestAnimationFrame(refreshScrollTriggers));
    };
    tick();
  });
});
