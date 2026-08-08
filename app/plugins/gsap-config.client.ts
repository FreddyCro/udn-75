// ScrollTrigger 的全域設定。必須在任何 ScrollTrigger.create() 之前跑完，
// 故放在 plugin（Nuxt plugin 早於元件的 onMounted）。
//
// ── ignoreMobileResize ────────────────────────────────────────────────
// 行動裝置捲動時網址列會收合／展開，視窗高因此變動 → 觸發 resize → ScrollTrigger
// 全體 refresh → 每條尺的 start / end 重算 → 畫面在捲動途中跳一下。
//
// 這不是假設，是量出來的（見 scripts/vh-probe.js 與 temp/vh-baseline/）：
// 視窗高變動 60px 時，Hero 轉場 pin 的尺長 884 → 812、pin-spacer 2670 → 2598，
// **其下整份文件往上位移 72px**；同一個捲動位置的進度最多差 0.077（7.7%）。
// 祝福段的臉屏格號、符號段的臉部序列都吃這個進度，7.7% 是看得見的跳格。
//
// GSAP 內建的 ignoreMobileResize 就是為此而生：觸控裝置上「只有高度小幅變動」
// 的 resize 一律不 refresh。這是純 JS 判斷，沒有 CSS 單位的支援度問題
// （dvh / svh 要 2022 年後的瀏覽器，本專案的受眾舊裝置比例高）。
//
// ⚠️ 這是 **GSAP 全域**設定，沒有 per-section 版本 —— media / subpage /
//    AwardTimeline / PhotoPanels 也會一併受益（少做幾次 refresh 對它們只有好處，
//    refresh 本來就是它們跑版的來源之一，見 refresh-scroll-triggers.client.ts）。
//
// 它**不能**單獨解決全部問題：真正的橫向位移（版面重排）仍需要 refresh，而
// 「CSS 的 100vh 與 JS 的 innerHeight 不是同一個數」這件事本身還在 —— 那是步驟 2/3
// 的工作（單一視窗高來源）。本設定只是先把「捲動中途被 refresh 打斷」擋掉。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
});
