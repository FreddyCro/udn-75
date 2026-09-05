/**
 * 多個 SVG → 一支 sprite（每檔一個 <symbol id viewBox>）。
 *
 * 為什麼要 sprite：夥伴 logo 45 支、論壇藝術字每斷點 39 支，各是一個 request；正式站限流
 * 算的是次數不是 bytes。sprite 讓一組變 1 個 request，元件用 <svg><use href="sprite.svg#id">。
 *
 * svgo 做兩件事：preset-default 瘦身（Figma 匯出平均 24 KB/logo，通常能砍四到六成）、
 * prefixIds 把各檔內部 id（clipPath 等）加上 symbol id 前綴 —— Figma 匯出的 id 全都叫
 * clip0_0_4 之類，合進同一份文件不加前綴就會互相指錯。
 *
 * 純函式、不碰檔案系統，讓 vitest 能直接測。
 */
import { optimize } from 'svgo';

const viewBoxOf = (svg, id) => {
  const vb = svg.match(/<svg\b[^>]*\bviewBox="([^"]+)"/);
  if (vb) return vb[1].trim();
  const w = svg.match(/<svg\b[^>]*\bwidth="([\d.]+)/);
  const h = svg.match(/<svg\b[^>]*\bheight="([\d.]+)/);
  if (w && h) return `0 0 ${w[1]} ${h[1]}`;
  throw new Error(`[svg-sprite] ${id}：沒有 viewBox 也沒有 width/height，無法決定 symbol 尺寸`);
};

/**
 * 根 `<svg>` 上要一起搬到 `<symbol>` 的屬性。
 *
 * ⚠️ 這裡搬的是**會往下繼承的呈現屬性**，最關鍵的是 `fill`：Figma 匯出的 SVG 一律在根
 * 元素寫 `fill="none"`（本專案 150 支來源檔全部如此），子元素只在需要上色時才自帶
 * `fill`。只取 innerHTML 放進 `<symbol>` 的話那個 `fill="none"` 就不見了，沒自帶
 * `fill` 的描邊路徑會退回 SVG 的初始值 **black**，logo 上多出黑塊。
 * 實測 45 支夥伴 logo 有 9 支因此與原檔渲染不同（gentlemen 6.1%、vedan 2.1%、teca 1.5% 像素）。
 *
 * 排除清單的理由：
 *   ・`xmlns` / `xmlns:*`：命名空間宣告屬於 sprite 的根 `<svg>`，不該重複在每個 symbol 上。
 *   ・`width` / `height` / `x` / `y` / `viewBox`：symbol 的尺寸由 viewBoxOf() 決定，
 *     消費端 `<use>` 的外層 `<svg>` 負責實際大小。
 *   ・`preserveAspectRatio`：由消費端決定（`UArtLine.vue` 靠外層 svg 的
 *     `preserveAspectRatio="none"` 做拉伸）。symbol 自帶一份會蓋掉那個意圖。
 *   ・`id`：symbol 的 id 是我們自己給的。
 *   ・`version` / `baseProfile`：SVG 1.1 的遺留宣告，對 symbol 無意義。
 */
const DROP_ROOT_ATTRS = /^(xmlns(:.+)?|width|height|x|y|viewBox|preserveAspectRatio|id|version|baseProfile)$/;

const rootAttrsOf = (svg) => {
  const open = svg.slice(svg.indexOf('<svg'), svg.indexOf('>', svg.indexOf('<svg')) + 1);
  const attrs = [...open.matchAll(/([:A-Za-z_][-.:\w]*)\s*=\s*"([^"]*)"/g)];
  return attrs
    .filter(([, name]) => !DROP_ROOT_ATTRS.test(name))
    .map(([, name, value]) => ` ${name}="${value}"`)
    .join('');
};

const innerOf = (svg) => {
  const open = svg.indexOf('>', svg.indexOf('<svg'));
  const close = svg.lastIndexOf('</svg>');
  if (open < 0 || close < 0) throw new Error('[svg-sprite] 不是完整的 <svg>…</svg>');
  return svg.slice(open + 1, close).trim();
};

/**
 * Figma 匯出的畫布底板：剪掉「被蓋住、卻會在縮放時從邊緣透出來」的那幾層。
 *
 * 夥伴 logo 45 支的共同形狀（Figma 把畫布連同 logo 一起匯出來了）：
 *
 *   <rect 整版 fill="#515151"/>                       ← 畫布深灰
 *   <g><path 巨大 fill="#888888"/>                     ← 畫布灰、10% 黑陰影、又一層 #6E6E6E…
 *     <g><g clip-path="url(#clip0)">
 *       <path d="M232 0H0V64H232V0Z" fill="white"/>   ← 不透明白底，把上面那些全蓋掉
 *       …真正的 logo…
 *
 * 靜止時看不出來（白底 100% 蓋住深灰），但 BlessingPartners 的 hover 會
 * `transform: scale(1.2)`：232×64 變 278.4×76.8，四個邊界落在小數點裝置像素上，
 * 邊界那一排像素每一層都只拿到部分覆蓋率，白底蓋不滿，底下的深灰就從縫裡透出來
 * ——就是回報的「hover 後 logo 出現一圈黑邊」。小數點像素只是觸發條件，成因是這些底板。
 *
 * 為什麼刪得掉：整版不透明底板「以下」的內容在數學上就是看不見的，移除可證明無損
 * （實測 45 支在 scale(1) 下與原檔像素一致）。守門條件見下面三個 helper，任何一條
 * 不成立就整支原樣放行——寧可留著也不要剪錯圖。
 *
 * 為什麼放在 build 而不是直接清 45 支來源檔：來源保持 Figma 匯出原樣，日後設計重匯出
 * 一樣會被清掉，不會又長回來；sources.json 記的是原始檔內容的 sha256，也不受影響。
 */

// 掃描時要跳過的容器：裡面的 <rect>／<path> 是定義（clipPath 的裁切框、漸層的色標），
// 不是畫在畫面上的東西。partner SVG 的 clipPath 裡正好有一塊和 viewBox 同尺寸的 rect，
// 誤判成切點會把整張圖剪光。
const DEFS_TAGS = /^(defs|clipPath|mask|pattern|marker|symbol|filter|linearGradient|radialGradient)$/;

// 帶這些屬性就不算「整版不透明底板」：它們都會讓這一塊不再是 100% 覆蓋。
const NOT_OPAQUE = /\s(fill-opacity|opacity|mask|filter|clip-path|style|transform)\s*=/;

const numAttr = (tag, name, dflt) => {
  const m = tag.match(new RegExp(String.raw`\s${name}="([-\d.]+)`));
  return m ? Number(m[1]) : dflt;
};

const attrNamesOf = (tag) => [...tag.matchAll(/\s([:A-Za-z_][-.:\w]*)\s*=/g)].map(([, n]) => n);

/** 這個標籤是不是「鋪滿整個 viewBox 的不透明色塊」 */
const isFullBleedCover = (tag, w, h) => {
  const fill = tag.match(/\sfill="([^"]*)"/);
  if (!fill || /^(none|transparent)$/i.test(fill[1].trim())) return false;
  if (NOT_OPAQUE.test(tag)) return false;
  if (/^<rect\b/.test(tag)) {
    return numAttr(tag, 'x', 0) === 0 && numAttr(tag, 'y', 0) === 0
      && numAttr(tag, 'width', -1) >= w && numAttr(tag, 'height', -1) >= h;
  }
  // Figma 匯出的整版色塊是 path，不是 rect：從右上角順時針繞一圈。
  if (/^<path\b/.test(tag)) {
    const d = tag.match(/\sd="([^"]*)"/);
    return !!d && d[1].replace(/\s+/g, ' ').trim() === `M${w} 0H0V${h}H${w}V0Z`;
  }
  return false;
};

/**
 * 祖先 <g> 只准帶 id，以及「不會縮小覆蓋範圍」的 clip-path。
 * 底板是靠「蓋滿整個 viewBox」證明下層看不見的：祖先只要有 opacity／mask／transform，
 * 或一個把底板裁小的 clip-path，這個證明就不成立，整支放行不動。
 */
const ancestorIsTransparent = (tag, svg, w, h) =>
  attrNamesOf(tag).every((name) => {
    if (name === 'id') return true;
    if (name !== 'clip-path') return false;
    const ref = tag.match(/\sclip-path="url\(#([^)]+)\)"/);
    if (!ref) return false;
    const def = svg.match(new RegExp(String.raw`<clipPath\s[^>]*id="${ref[1]}"[^>]*>([\s\S]*?)</clipPath>`));
    if (!def || /\s(transform|clipPathUnits)\s*=/.test(def[0].slice(0, def[0].indexOf('>')))) return false;
    const children = [...def[1].matchAll(/<[A-Za-z][-\w:]*[^>]*>/g)];
    if (children.length !== 1) return false;
    const rect = children[0][0];
    return /^<rect\b/.test(rect)
      && numAttr(rect, 'x', 0) === 0 && numAttr(rect, 'y', 0) === 0
      && numAttr(rect, 'width', -1) >= w && numAttr(rect, 'height', -1) >= h;
  });

export const stripCanvasBackdrop = (svg, id) => {
  const vb = viewBoxOf(svg, id).split(/[\s,]+/).map(Number);
  if (vb.length !== 4 || vb[0] !== 0 || vb[1] !== 0) return svg;
  const [, , w, h] = vb;

  const headEnd = svg.indexOf('>', svg.indexOf('<svg')) + 1;
  const stack = [];   // 目前開著的 <g>（open tag 原文）
  let skip = 0;       // >0 ＝ 正在 defs 之類的容器裡
  let painted = 0;    // 掃過幾個會畫到畫面上的元素
  let cut = null;     // 最後一個整版底板

  for (const m of svg.slice(headEnd).matchAll(/<\/?[A-Za-z][-\w:]*[^>]*>/g)) {
    const tag = m[0];
    const name = tag.match(/^<\/?([A-Za-z][-\w:]*)/)[1];
    const closing = tag.startsWith('</');
    const selfClosing = tag.endsWith('/>');
    if (skip > 0) {
      if (!selfClosing) skip += closing ? -1 : 1;
      continue;
    }
    if (DEFS_TAGS.test(name)) {
      if (!closing && !selfClosing) skip = 1;
      continue;
    }
    if (name === 'g') {
      if (closing) stack.pop();
      else if (!selfClosing) stack.push(tag);
      continue;
    }
    if (closing) continue;
    painted += 1;
    if (isFullBleedCover(tag, w, h)) cut = { at: headEnd + m.index, ancestors: [...stack], order: painted };
  }

  // 沒有底板，或底板本身就是第一個可見元素（前面沒東西可剪）→ 原樣
  if (!cut || cut.order === 1) return svg;
  if (!cut.ancestors.every((tag) => ancestorIsTransparent(tag, svg, w, h))) return svg;

  // 從底板切開：根 <svg> 的屬性、祖先 <g> 的 open tag 都補回去，
  // 切點之後的原文已經帶著對應的 </g>、<defs> 與 </svg>。
  return svg.slice(0, headEnd) + cut.ancestors.join('') + svg.slice(cut.at);
};

export async function buildSprite(items) {
  const seen = new Set();
  const symbols = [];
  for (const { id, svg } of items) {
    if (seen.has(id)) throw new Error(`[svg-sprite] symbol id 重複：${id}`);
    seen.add(id);
    const { data } = optimize(stripCanvasBackdrop(svg, id), {
      multipass: true,
      plugins: [
        // ⚠️ 這個 svgo（4.1.0）的 preset-default 已經不含 removeViewBox 這個 plugin
        // （官方 preset 名單已移除它，見 node_modules/svgo/plugins/preset-default.js），
        // 所以不必再 override 它 —— 硬加只會逐檔印一行「not part of preset-default」
        // 的 console 警告，viewBox 本來就不會被動。真正必要的是 cleanupIds:false ——
        // preset-default 內建的 cleanupIds 會在 prefixIds 跑之前把 id 縮寫成
        // a/b/c 之類，導致 Figma 原本的 clip0 被改名、prefixIds 前綴到的是縮寫後的
        // 字串（如 a-a 而非 a-clip0），等於白加了前綴。關掉它保留原始 id 給
        // prefixIds 前綴，換來的代價只是 id 字串長一點，不影響正確性。
        {
          name: 'preset-default',
          params: { overrides: { cleanupIds: false } },
        },
        { name: 'prefixIds', params: { prefix: id, delim: '-' } },
      ],
    });
    symbols.push(`<symbol id="${id}" viewBox="${viewBoxOf(data, id)}"${rootAttrsOf(data)}>${innerOf(data)}</symbol>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${symbols.join('')}</svg>\n`;
}
