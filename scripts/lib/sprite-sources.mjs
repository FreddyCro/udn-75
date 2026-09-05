/**
 * 列出「會被打進某支 sprite」的來源 SVG 檔案清單（只給檔名／路徑，不讀內容）。
 *
 * 為什麼獨立成一支共用模組：build-svg-sprites.mjs 用它決定要讀哪些檔案來建 sprite
 * 與寫 sources.json；test/sprite-coverage.spec.ts 用它重新列出「現在應該進 sprite
 * 的檔案」來對帳 sources.json（抓「新增／刪除來源檔」這種光比對內容 hash 抓不到的
 * 情況）。兩邊各寫一份 glob 規則遲早會分岔——共用同一份函式，規則只有一個真值。
 *
 * 回傳形狀對齊 scripts/build-svg-sprites.mjs 的四支 sprite：
 *   { partners: [...], 'art-pc': [...], 'art-pad': [...], 'art-mob': [...] }
 * 每筆 { id, file }：id ＝ 檔名去副檔名（與 app/utils/svg-sprite-ref.ts 同一條規則），
 * file ＝ 絕對路徑。
 */
import fs from 'node:fs';
import path from 'node:path';

const listSvg = (dir, filter) =>
  fs
    .readdirSync(dir)
    .filter((n) => n.endsWith('.svg') && filter(n))
    .sort()
    .map((n) => ({ id: n.replace(/\.svg$/, ''), file: path.join(dir, n) }));

/**
 * 文章內文素材 sprite（article.svg）的收錄名單。
 *
 * ⚠️ 這裡**只能收「用 `<img src>` 消費」的素材**。sprite 是靠 `<use href="…#id">` 引用的，
 *    而同目錄下的 hero 標題／副標（`udn75_*_hero_{title,subtitle}.svg`）是走 CSS
 *    `mask-image: url(...)`，對外部 SVG 的 fragment 參照瀏覽器支援不一致，不能進來。
 *    照片類（`udn75_pic*`）走 UPic，也不進來。所以用明確名單而非目錄 glob。
 *
 * 收錄依據＝實測手機版連續閱讀頁首屏會抓的 16 支內文 SVG，外加 quiz_correct
 * （與 quiz_wrong 同元件、成對出現，作答當下才抓）。各自的消費端：
 *   news/20xx、timeline_*      → AwardTimeline.vue
 *   news/udn75_news_title_*    → FormulaBlocks.vue（b.titleImg）
 *   data/udn75_data_*          → AiSearch.vue
 *   visual/udn75_quiz_*        → AiImageQuiz.vue
 *
 * ⚠️ health/udn75_pic32_0{1,2}（HealthArticle 的 awards 清單）**刻意不收**：它們是
 *    `loading="lazy"`、不在首屏那個 burst 裡，收進來對限流沒有幫助；而且那兩張帶著
 *    width/height 版位保留的契約（test/subpage-image-space-reservation.spec.ts 對帳
 *    186×120），換成 <svg> 等於為了零收益去動一條有測試守著的不變量。
 */
const ARTICLE_ART = {
  news: (n) =>
    /^20\d{2}\.svg$/.test(n) || // 年份數字向量字，AwardTimeline 用 `${item.year}.svg` 組出來
    n === 'udn75_news_timeline_line.svg' ||
    n === 'udn75_news_timeline_arrow.svg' ||
    /^udn75_news_title_(bl|br|tl|tr|publishx)\.svg$/.test(n),
  data: (n) =>
    n === 'udn75_data_ai_search.svg' ||
    n === 'udn75_data_icon_udnnews.svg' ||
    n === 'udn75_data_icon_udnvip.svg',
  visual: (n) => /^udn75_quiz_(correct|wrong)\.svg$/.test(n),
};

export function listSpriteSources(root) {
  const groups = {
    partners: listSvg(path.join(root, 'public/img/blessing'), (n) => n.startsWith('partner-')),
    article: Object.entries(ARTICLE_ART).flatMap(([dir, filter]) =>
      listSvg(path.join(root, 'public/img', dir), filter),
    ),
  };

  for (const bp of ['pc', 'pad', 'mob']) {
    const re = new RegExp(`-${bp}(-\\d+)?\\.svg$`);
    groups[`art-${bp}`] = [
      ...listSvg(path.join(root, 'public/img/forum'), (n) => re.test(n)),
      ...listSvg(path.join(root, 'public/img/blessing'), (n) => re.test(n) && !n.startsWith('partner-')),
    ];
  }

  return groups;
}
