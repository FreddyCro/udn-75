// ── 講者照「藍塊刷開」的場次對照 ─────────────────────────────────────
//
// 論壇一、二的講者照有 inactive 狀態（淺藍方塊蓋住），由橘核心走到照片時刷開。
// 這裡只管「哪一場對應哪個路徑事件」，時機在 forum-path-events，外觀在 ForumEvent 的 SCSS。
//
// ⚠ 對照**用場次名，不用 v-for 的索引**：增刪或重排場次不會讓效果靜默掛到別場身上
//   （同 data-forum-anchor 與節點編號永不重排的理由，見 architecture/forum-node-path.md）。
// ⚠ 2026-08-17 起論壇二只有一位講者（設計改版），所以一場 ＝ 一張照片。這裡的機制本來就是
//   「一個事件管整場」，兩張變一張不需要改任何東西 —— 但別再從註解推論「論壇二有兩張卡」。
// ⚠ 論壇三不在表內是因為它**沒有講者**（資料上就沒有 speakers）；論壇四是設計上不做。
//   兩者都回 undefined ＝ <ForumEvent> 連遮罩都不渲染。
//
// 完整設計見 architecture/2026-08-12-forum-speaker-photo-reveal-design.md。

export const FORUM_PHOTO_REVEAL_KEYS: Readonly<Record<string, string>> = {
  論壇一: 'forum1PhotoReveal',
  論壇二: 'forum2PhotoReveal',
};

/**
 * 該場次講者照的刷開事件 key；`undefined` ＝ 這一場不做這個效果。
 *
 * 用 Object.hasOwn 而非直接索引：少了它，'constructor' 之類的名字會查到 Object 原型上的
 * 成員、變成 truthy，那一場就會莫名長出遮罩。
 */
export function photoRevealKeyFor(no: string): string | undefined {
  return Object.hasOwn(FORUM_PHOTO_REVEAL_KEYS, no)
    ? FORUM_PHOTO_REVEAL_KEYS[no]
    : undefined;
}
