// header logo 的「回家意圖」判定（純函式，無 DOM／無 Vue）。
//
// logo 的語意是「回到最開始」＝ **從頭重播整支影片**（restart，2026-08-22 起；在此之前是
// 倒帶到已移除的 loop 段）。見 useHeroVideo 的 restartOpening 與
// architecture/2026-08-22-hero-restart-on-top-design.md。
//
// 從哪一頁點決定要不要換頁：
//   首頁 → 就地把 hero 重播（從 0s），不走路由（省掉整份首頁重新 mount 與 ScrollTrigger 重建）
//   子頁 → client-side 導航回首頁 `/`，並用**旗子**（下方）告訴 Hero「這次要從頭重播」
//
// 抽成純函式而非寫在元件裡：這條判定同時決定「要不要 preventDefault」與「NuxtLink 的
// :to 長什麼樣」兩件事，兩邊必須吃同一份答案，分開寫遲早會漂移。

/** in-page ＝ 就地倒帶（呼叫端要 preventDefault）；navigate ＝ 讓 NuxtLink 導航 */
export type HomeIntentAction = 'in-page' | 'navigate';

export interface HomeIntent {
  action: HomeIntentAction;
  /**
   * NuxtLink 的 :to。in-page 時仍給 '/' —— 一般點擊會被 preventDefault 攔下，
   * 但中鍵／Ctrl 點擊要能正常開新分頁到首頁，故 href 必須是真的。
   */
  to: string;
}

export function resolveHomeIntent(isHome: boolean): HomeIntent {
  return {
    action: isHome ? 'in-page' : 'navigate',
    // ⚠️ 不帶 hash（2026-08-22 之後的修訂，原本是 `/#loop`）。重播意圖放在 URL fragment 有
    //    三個修不掉的副作用：① reload／新分頁會重現一個「跳過 start 閘門」的開場，而 start
    //    閘門是唯一能開聲的地方（header 在影片期間收起來）⇒ 可被分享的靜音開場；
    //    ② 瀏覽器「上一頁」回首頁會再 restart 一次，蓋掉 savedPosition；
    //    ③ `loop` 得當保留字，任何段落 id 都不能撞。旗子活不過整頁載入，三個都消失。
    to: '/',
  };
}

// ── 子頁 → 首頁的「這次要重播」旗子 ────────────────────────────────────
// 只在 logo 的 click handler 設起、Hero 在 setup 內消耗一次。載體是 useHeroVideo 的
// useState（跨 client-side 導航存活、SSR 安全），此處只放不依賴 Vue 的一次性語意。
//
// 為什麼不用「無 hash 的 client-side 導航」直接推導：瀏覽器上一頁回首頁也符合那個條件，
// 但 Nuxt 預設 scrollBehavior 對 pop 導航是還原 savedPosition（落在頁面中段），
// 那時 restart 會把人拉回頂端鎖著看重播。旗子對「導航是怎麼發生的」免疫。

/** ref-like 載體：Vue 的 Ref<boolean> 結構上即滿足，故純函式測得到。 */
export interface RestartIntent {
  value: boolean;
}

export function requestHomeRestart(intent: RestartIntent): void {
  intent.value = true;
}

/** 讀完就清（一次性）：沒清的話下一次進首頁會憑空重播。 */
export function consumeHomeRestart(intent: RestartIntent): boolean {
  const wanted = intent.value;
  intent.value = false;
  return wanted;
}
