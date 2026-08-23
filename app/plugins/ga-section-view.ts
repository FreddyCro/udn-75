// section_view 的「正常流」觸發來源：`v-ga-view="term"` 指令。
//
// ⚠️ 本檔**不能**是 .client.ts。本專案 ssr: true，而 Vue 的 SSR renderer 遇到模板上的
//    自訂指令時會去查 app 上註冊的那一份並讀它的 getSSRProps —— 指令只在 client 註冊的話
//    伺端查到 undefined，整頁 500（`Cannot read properties of undefined (reading
//    'getSSRProps')`）。故指令本身雙端註冊，只有 IntersectionObserver 與 router 那部分
//    用 import.meta.client 圈起來（mounted／updated 本來就只在 client 跑）。
//    順帶讓 SSR 也輸出 data-ga-view 屬性，與本專案「屬性在 SSR 就要在」的既有慣例一致
//    （見 Media.vue 的 data-header-theme 註解）。
//
// ── 為什麼是指令，而不是參考專案的「掃 class」 ─────────────────────────────
// the-love-report 的 useGaSectionView 在 app.vue 的 onMounted 掃一次
// `document.querySelectorAll('.js-ga-sec-view')`。本專案不能這樣：
// 六個子頁是 client-side 導航（NuxtLink ＋ layoutTransition out-in），新頁的段落是在
// **離場動畫跑完之後**才掛上 DOM 的 —— 掃描的時機要嘛太早（掃不到）、要嘛得靠猜秒數。
// 指令的 mounted／unmounted 剛好就是「元素進／出 DOM」那一刻，沒有時序可以猜錯。
//
// ── 為什麼不 unobserve ─────────────────────────────────────────────────────
// 參考專案觸發後就 unobserve 當作「只送一次」。本專案的「只送一次」收在
// gaSectionViewOnce 那個閘門（見 utils/tracking-event.ts），這裡一律持續觀測。
// 差別在頁尾：`#editor` 掛在 layout 上，跨子頁導航時**元素不會重建**，只有 term 從
// news_editor 變成 visual_editor。unobserve 過的元素就再也不會回報新的 term 了。
// 四十來個元素的觀測成本可以忽略，少一條分支換掉一整類 bug。
//
// ── 為什麼不是 threshold ───────────────────────────────────────────────────
// threshold: 0 一進一個 px 就算看到，太寬鬆；threshold: 0.25 則是**本專案不能用的**——
// 很多段落（論壇各場、子頁得獎清單）比視窗還高，可見比例永遠到不了 0.25，等於永不觸發。
// 改用 threshold 0 ＋ 底部負 rootMargin：把視窗下緣往上收 25%，元素要真的進到那條線
// 以上才算「看到」。這與專案既有的錨點 scroll-spy「中央帶」是同一套判定思路
// （見 utils/anchor-spy.ts）。
//
// ⚠️ pin／sticky／fixed 段落**不走這支**。那些元素在被釘住期間恆在視窗內，IO 會在 pin
//    一開始就成立；更根本的是它們「被看到」的時機只存在於既有 ScrollTrigger 的進度上
//    （Hero 的引言、子頁的 KV→引言→媒體三拍都是靠 progress 淡入的，DOM 位置沒有意義）。
//    那些段落直接呼叫 gaSectionViewOnce()，掛在自己那條尺的門檻上。
import type { Directive } from 'vue';
import { gaSectionViewOnce, resetSectionViews } from '~/utils/tracking-event';

const ATTR = 'data-ga-view';

/** 指令的 term 型別。空字串／undefined ＝ 這一刻還不該回報（見各呼叫點的閘門） */
type GaViewValue = string | undefined;

// 讓 template 認得 v-ga-view（Vue 3.5 的 GlobalDirectives）。
// 少了這段，開 strictTemplates 的編輯器會報「找不到 vGaView」。
declare module 'vue' {
  interface GlobalDirectives {
    vGaView: Directive<HTMLElement, GaViewValue>;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null;

  // 惰性建立：IO 只在真的有元素要觀測時才存在（首頁全段都是 pin/sticky 的極端情況下
  // 也就不會白開一個 observer）。只會從 mounted／updated 進來，故必然在 client。
  const getObserver = () => {
    if (observer) return observer;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // 讀屬性而不是閉包裡的 term：term 可能被 updated 改過（頁尾的 {page}_editor）。
          gaSectionViewOnce(
            (entry.target as HTMLElement).getAttribute(ATTR) ?? '',
          );
        }
      },
      { threshold: 0, rootMargin: '0px 0px -25% 0px' },
    );
    return observer;
  };

  nuxtApp.vueApp.directive<HTMLElement, GaViewValue>('gaView', {
    // SSR：只把屬性寫進 HTML，不做任何觀測（伺端沒有視窗可言）。
    // 這一支同時是「指令在伺端存在」的證明 —— 少了它整頁 500，見檔頭警告。
    getSSRProps: (binding) =>
      binding.value ? { [ATTR]: binding.value } : {},

    mounted(el, binding) {
      if (!binding.value) return;
      // 屬性同時是除錯用的標記：在 devtools 直接看得出哪個元素掛了哪個 term。
      el.setAttribute(ATTR, binding.value);
      getObserver().observe(el);
    },

    updated(el, binding) {
      if (binding.value === binding.oldValue) return;
      if (!binding.value) {
        el.removeAttribute(ATTR);
        return;
      }
      el.setAttribute(ATTR, binding.value);
      // ⚠️ 一定要 unobserve 再 observe，不能只 observe：IntersectionObserver 只在
      //    「相交狀態**改變**」時回呼，對已在觀測中的元素再 observe 一次是 no-op。
      //    而這裡最重要的兩個情境，元素在 term 變化前後**都已經在視窗內**：
      //      ・論壇後半段：term 綁 `agendaRevealed ? 'symposium_agenda' : ''`，
      //        揭露的那一刻元素早就進畫面了（它只是 opacity 0）。
      //      ・頁尾：跨子頁導航時 #editor 不重建，只有 news_editor → visual_editor。
      //    重新註冊會讓 IO 對新目標補送一次「當前狀態」的初始回呼，term 才報得出去。
      const io = getObserver();
      io.unobserve(el);
      io.observe(el);
    },

    unmounted(el) {
      observer?.unobserve(el);
    },
  });

  if (!import.meta.client) return;

  // 換頁重算：GA4 的 section_view 是「這次 page_view 看到了哪些段落」。
  // ⚠️ 只在 path 真的變了才清 —— 首頁的錨點是 hash 導航（/#forum），那不是新的 page_view，
  //    清掉會讓同一頁的段落在來回捲動時反覆回報。
  const router = useRouter();
  router.afterEach((to, from) => {
    if (to.path !== from.path) resetSectionViews();
  });
});
