// header logo 的「回家意圖」判定（純函式，無 DOM／無 Vue）。
//
// logo 的語意是「回到最開始」。2026-08-22 起這句話的落點從 hero 的 loop 段改成
// **從頭重播整支影片**（restart）—— 設計師回報「帶 hash 從子頁進站的人再也看不到影片」，
// 裁決是「乾脆全部回到 page top 就重看影片」（見 useHeroVideo 的 restartOpening 與
// architecture/2026-08-22-hero-restart-on-top-design.md）。
// 不會是 outro：那只是 2.5 秒的過場、終點必然是 gone，回到那裡等於重播一段動畫又回到原地
// （原始比較見 temp/2026-08-14-logo-return-to-loop-design.md）。
//
// 從哪一頁點決定要不要換頁：
//   首頁 → 就地把 hero 重播（從 0s），不走路由（省掉整份首頁重新 mount 與 ScrollTrigger 重建）
//   子頁 → client-side 導航回首頁，並以 hash 告訴 Hero「這次要從頭重播」
//
// 抽成純函式而非寫在元件裡：這條判定同時決定「要不要 preventDefault」與「NuxtLink 的
// :to 長什麼樣」兩件事，兩邊必須吃同一份答案，分開寫遲早會漂移。

/**
 * 回首頁並「回到最開始」的保留 hash。
 *
 * ⚠️ 名稱仍是 `loop`，但 2026-08-22 起行為是 restart（從 0s 重播）—— 改名要一起動子頁的
 * logo 連結、保留字測試與三份文件，那一輪刻意分開做。讀到 `loop` 時請以本檔頭的語意為準。
 *
 * ⚠️ 這是保留字：任何段落的 id 都不可叫 loop，否則帶 #loop 回首頁時 Hero 會同時
 * 「重播影片」又被 scrollToInitialHash 捲到那個段落。相撞由 test/home-intent.spec.ts
 * 盯著 locales/common.json 的 headerAnchors。
 */
export const HERO_RETURN_HASH = 'loop';

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
  return isHome
    ? { action: 'in-page', to: '/' }
    : { action: 'navigate', to: `/#${HERO_RETURN_HASH}` };
}
