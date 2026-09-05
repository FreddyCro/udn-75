import type { InjectionKey } from 'vue';

/** 連續閱讀頁提供給每篇 <Subpage> 的脈絡：誰是文件裡的第一篇 */
export type SubpageStream = { firstSlug: string };

/**
 * 型別參數刻意含 `| null`：這樣消費端能寫 `inject(SUBPAGE_STREAM_KEY, null)`，傳一個
 * 型別上合法的 default。Vue 只在「完全沒傳 default」且 key 找不到時才會在 dev 模式印
 * `injection "..." not found.` 警告 —— 六支單篇子頁（news／visual／…）本來就不會
 * provide，那是正常路徑，不該每次開頁都噴警告。若型別參數不含 `null`，
 * `inject(KEY, null)` 會型別不過，逼著改成不傳 default，警告就回來了。
 */
export const SUBPAGE_STREAM_KEY: InjectionKey<SubpageStream | null> = Symbol('subpage-stream');

/**
 * hero 底圖與引言第一幀該不該 eager。單篇子頁沒有 stream ⇒ true；連續閱讀頁只有第一篇 true。
 *
 * stream 允許 null／undefined 兩種「沒有 stream」的表達：實際呼叫路徑是 `null`
 * （`Subpage.vue` 用 `inject(SUBPAGE_STREAM_KEY, null)`，見上方 key 的型別註解）；
 * `undefined` 不是目前會走到的路徑，只是讓這支純函式的契約同時涵蓋兩種寫法
 * （避免日後有人改用不傳 default 的 `inject()` 時，這裡的型別先擋下）。
 */
export const shouldEagerHero = (
  stream: SubpageStream | null | undefined,
  slug: string,
): boolean => !stream || stream.firstSlug === slug;
