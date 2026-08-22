// hero 開場期間「該不該鎖住頁面捲動」的判定（純函式，無 DOM／無 Vue）。
//
// 2026-08-22（順播 ＋ restart 規則，見 architecture/2026-08-22-hero-restart-on-top-design.md）：
//
//   鎖住 = 正片（main）＋ **還沒播完的退場段**（outro && !outroWatched）
//
// 也就是「品牌開場不可跳過」延伸到退場那 2.5 秒 —— 正片播完會自動順播進退場（見
// hero-video-config 的段落表），整段都鎖著，播完才解鎖讓使用者捲動溶解。設計師
// 「不要因為捲太快而看不到 outro」這條需求到此才真正成立。
//
// ⚠️ 2026-08-07 也曾鎖住 outro，並在 08-16 被推翻 —— **那次的失敗模式在新流程下不可能
//    發生**，別拿它當理由把這裡改回去。當時 `loop` 是解鎖的，使用者可以先自由捲一段
//    （實測快速甩動 > 400px）才觸發退場，鎖於是在**半路**介入、把畫面凍在 scrollY 400
//    長達 2.5 秒。現在退場是在 scrollY 0、還鎖著的狀態下由正片自動接進來的，鎖從頭到尾
//    沒有鬆開過，沒有「半路上鎖」這回事。
// ⚠️ 逃生口是 SKIP（正片 2s 後淡入），但它**只跳過正片**：按下之後影片 seek 到退場段，
//    這裡照樣鎖著直到那 2.5 秒播完（2026-08-22 使用者裁決；SKIP 曾經直接把 `outroWatched`
//    設起，那是自動捲動上線前的權衡）。使用者不必自己捲 —— 退場播完的同一刻 Hero 會把
//    畫面自動帶到引言（`scrollToIntroReading`）。
// ⚠️ 影片完全卡住時另有兩根保險絲（見 HeroVideo 的 armStallFuse / armOutroLockFuse）——
//    鎖住而畫面上沒有東西在動是**必須自動解開**的狀態，這條規則壞掉時畫面上不會有任何
//    東西喊出來。
//
// 這條規則今年已經改過五次。留一支測試釘住它，改動就當場失敗而不是靜默劣化。
import type { HeroState } from '~/composables/useHeroVideo';

export function shouldLockHeroScroll(
  state: HeroState,
  outroWatched: boolean,
): boolean {
  if (state === 'main') return true;
  return state === 'outro' && !outroWatched;
}
