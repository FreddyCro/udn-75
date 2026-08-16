// hero 開場期間「該不該鎖住頁面捲動」的判定（純函式，無 DOM／無 Vue）。
//
// 2026-08-16 起 hero 的退場改綁捲動（見 architecture/2026-08-16-hero-scrub-dissolve-design.md），
// 鎖只剩下**正片**這一段：品牌開場不可跳過。loop 起解鎖 —— 那顆下滑箭頭本來就是
// 「請往下捲」，而且不解鎖就沒有捲動可以驅動 scrub，會死結。
//
// 這條規則今年已經改過四次，而它壞掉時**畫面上不會有任何東西喊出來** ——
// 只會是「開場可以直接滑走」或「整頁鎖死」，兩種都要試玩很久才發現。
// 留一支測試釘住它，改動就當場失敗而不是靜默劣化。
import type { HeroState } from '~/composables/useHeroVideo';

export function shouldLockHeroScroll(
  state: HeroState,
  hasLeftLoop: boolean,
): boolean {
  return state === 'main' && !hasLeftLoop;
}
