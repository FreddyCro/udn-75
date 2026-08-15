export const PC_BREAKPOINTS = 1280;
export const TABLET_BREAKPOINTS = 768;
export const MOBILE_BREAKPOINTS = 414;

/**
 * 子頁在 header 錨點列上歸屬的段落。
 *
 * 六篇子頁都是「智慧心媒體」底下的文章 —— 各 locale 的 `nav.backUrl` 一律是 `/#media`
 * （見 app/locales/{news,visual,service,data,education,health}.json）。子頁沒有
 * `#forum` / `#blessing` / `#media` 這些段落，scroll-spy 量不到東西、activeTarget 恆為 ''，
 * 故子頁一律把這個段落標成 active（見設計稿：子頁 PC 的「智慧心媒體」帶橘色底線）。
 *
 * ⚠️ 值必須是 locales/common.json 的 headerAnchors 之一，由 test/header-anchors.spec.ts 盯著。
 */
export const SUBPAGE_HEADER_ANCHOR = 'media';
