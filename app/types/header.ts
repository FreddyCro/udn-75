// header 錨點（locales/common.json 的 headerAnchors）。
//
// 素材那一筆借用 ForumTextArtSrc（{ src, w, h }）—— 稿字形素材的形狀在專案裡只該有
// 一個真值，論壇段先定義了它（名字帶 Forum 是歷史包袱，見 ~/types/forum.ts 的註解）。
import type { ForumTextArtSrc } from '~/types/forum';

/**
 * 錨點文字的稿字形素材。
 *
 * ⚠️ key 是「版位」而不是斷點：pc ＝ ≥1280 的錨點列（AppHeaderNav，稿 15px 高的墨跡框），
 *    menu ＝ <1280 的漢堡選單（AppHeaderMenu，稿 53px 高、含底線佔位的群組框）。
 *    mob 與 pad 的選單稿是同一份素材（字級都是 46px），故不再逐斷點分檔。
 */
export type HeaderAnchorArt = {
  pc: ForumTextArtSrc;
  menu: ForumTextArtSrc;
};

/**
 * 一顆 header 錨點。
 *
 * title 是真文字（SR／SEO 的唯一來源，畫面上由 art 呈現），
 * target 是首頁段落 id（同時是 test/header-anchors.spec.ts 守著的那組值）。
 */
export type HeaderAnchor = {
  title: string;
  target: string;
  art: HeaderAnchorArt;
};
