// 把 ScrollTrigger 掛到 window，供外部量測腳本讀取（見 scripts/vh-probe.js）。
//
// 為什麼需要：ScrollTrigger 是模組作用域的，從 Playwright / devtools 取不到，
// 而「每條尺的 start / end / progress」正是視窗高改動唯一能客觀驗收的東西 ——
// 這一層的自動化覆蓋率是 0（vitest 只跑純函式，見 vitest.config.ts），
// 沒有它就只能靠肉眼比對，而漂移 6% 肉眼看不出來。
//
// 只在帶 ?pathdebug 時掛上（同 <DevCoreProgress> 的閘門）：不做 import.meta.dev 判斷，
// 因為 preview build 也要能量測；不帶參數的 production 頁面則什麼都不掛。
export default defineNuxtPlugin(() => {
  const route = useRoute();
  if (route.query.pathdebug === undefined) return;

  // 動態 import：不帶參數時完全不進 bundle 的執行路徑。
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    (window as unknown as Record<string, unknown>).__udnST = ScrollTrigger;
  });
});
