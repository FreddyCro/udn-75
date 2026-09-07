import { svgDataUri } from './svg-data-uri';

// 7 支分件 SVG（共約 65 KB）build 時內嵌：這一段是首頁固定會捲到的區塊，7 個 request 省下來。
// MediaTitle.vue 與 Media.vue 都會引用 /img/media/*.svg，故抽成共用 util。
//
// newchar_with_sign.svg（6.7 KB）刻意排除在外：MediaTitle.vue 只在**註解**裡把它當定位
// 參考提到（引號與「新」字的相對位置換算依據），從來不會傳給 mediaArt()，跟進來只是
// 平白多塞進 bundle 一份用不到的資產。
//
// ⚠️ 這裡故意不用 `~~` alias：`~~/public/...` 搭配**否定 pattern**（`!pattern`，這裡要用
// 的排除寫法）在目前的 Vite 版本會整個解析失敗（`Invalid glob ...`，alias 沒被展開）——
// 陣列本身不是問題，`inline-art.ts` 就是兩個 `~~` pattern 組成的陣列、build 正常；
// 真正的觸發條件是「否定 pattern 搭配 alias」。改用相對路徑（本檔在 app/utils/，
// 往上兩層到專案根）就沒有這個問題，且排除寫法一樣是標準 glob 語法。
const raw = import.meta.glob(
  ['../../public/img/media/*.svg', '!../../public/img/media/newchar_with_sign.svg'],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

// 檔名 → data URI 的對照表，模組載入時建一次。
//
// ⚠️ 不要改回「呼叫時才 find + encode」：mediaArt() 是從 7 個 template 運算式呼叫的
// （Media.vue 2 處、MediaTitle.vue 5 處），那是 render function 的一部分，Media.vue /
// MediaTitle.vue 每次重繪都會全部重跑一遍。而這 7 支 SVG 合計約 65 KB，
// encodeURIComponent 一趟就是掃過那 65 KB —— 但結果是 build 時就固定的常數，
// 每次重繪重算純屬浪費。改成模組層建表後，重繪只剩一次 Map.get。
const uris = new Map<string, string>(
  Object.entries(raw).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1), svgDataUri(svg)]),
);

/** 檔名 → data URI（media_title.svg、bar.svg …）。找不到就丟錯：少一張分件是資料錯誤。 */
export const mediaArt = (name: string): string => {
  const uri = uris.get(name);
  if (!uri) throw new Error(`[media-art] 找不到 public/img/media/${name}`);
  return uri;
};
