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

export async function buildSprite(items) {
  const seen = new Set();
  const symbols = [];
  for (const { id, svg } of items) {
    if (seen.has(id)) throw new Error(`[svg-sprite] symbol id 重複：${id}`);
    seen.add(id);
    const { data } = optimize(svg, {
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
