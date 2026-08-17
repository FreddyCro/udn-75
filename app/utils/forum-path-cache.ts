import type { ArcKnot } from './forum-path-geometry';
import type { SlashWindow } from './forum-slash';
import type { ForumTurn } from './forum-path-turns';
import { createSampleCache } from './sample-cache';

/**
 * ForumCorePath 的取樣結果快取（真・模組層單例）。
 *
 * ⚠️ **為什麼住在這個檔案，而不是 ForumCorePath.vue 的 `<script setup>` 頂層**：
 *    `<script setup>` 的頂層程式碼會被編譯進 `setup()`，**每個元件實例都重跑一次** ——
 *    寫在那裡的 `const cache = createSampleCache()` 是 per-instance，不是 per-module。
 *    子頁換回首頁時元件會 remount，快取跟著重建，第一輪 build() 照樣要整條重新取樣
 *    （實測：4 輪 build 裡 3 輪命中、1 輪 miss ＝ 仍有 2397 次 getPointAtLength）。
 *    放進 .ts 模組才是整個 SPA 生命週期共用一份，返回時第一輪就命中。
 *
 * 快取的都是「同一條 d ＋ 同一組輸入 → 必然同結果」的純取樣（見各 cache 的鍵組成，
 * 在 ForumCorePath.vue 的呼叫端）。版面真的變了，鍵就會變、自然 miss 並重算。
 *
 * 容量吃 createSampleCache 的預設 8 —— 同一個斷點也不只一條 d（返回首頁的落點不同，
 * 論壇段的圖片載入狀態就不同，錨點有次像素差異），理由詳見該函式的註解。
 */
export const forumKnotCache = createSampleCache<ArcKnot[]>();
export const forumSlashCache = createSampleCache<SlashWindow | null>();
export const forumSwapCache = createSampleCache<number>();
export const forumTurnCache = createSampleCache<ForumTurn[]>();

/** 測試與除錯用：一次清掉四份。 */
export function clearForumPathCaches() {
  forumKnotCache.clear();
  forumSlashCache.clear();
  forumSwapCache.clear();
  forumTurnCache.clear();
}
