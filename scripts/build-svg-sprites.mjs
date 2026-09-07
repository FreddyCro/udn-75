/**
 * 產生站上用到的 SVG sprite。改了任何一支來源 SVG（或新增／刪除來源檔）都要重跑，
 * 產物 commit 進 repo（build 不會自動跑：產物要進 public/，且 test/sprite-coverage.spec.ts
 * 會對帳；規則同時寫進 CLAUDE.md「SVG sprite」一節，避免只有這裡的檔頭知道）。
 *
 *   node scripts/build-svg-sprites.mjs
 *
 * 產出：
 *   public/img/sprites/partners.svg   ← public/img/blessing/partner-*.svg（png 不進 sprite）
 *   public/img/sprites/article.svg    ← 六篇子頁的內文素材（明確名單，見 sprite-sources.mjs）
 *   public/img/sprites/art-pc.svg     ← public/img/{forum,blessing} 內檔名含 -pc 的藝術字
 *   public/img/sprites/art-pad.svg    ← 同上 -pad
 *   public/img/sprites/art-mob.svg    ← 同上 -mob
 *   public/img/sprites/sources.json   ← 每一支進了 sprite 的來源檔 → 其內容的 sha256，
 *                                        給 test/sprite-coverage.spec.ts 對帳「內容換了但忘記
 *                                        重跑」（只驗 symbol id 存在與否驗不到這種情況）。
 *
 * symbol id ＝ 檔名去副檔名（與 app/utils/svg-sprite-ref.ts 同一條規則）。
 * 來源檔清單來自 scripts/lib/sprite-sources.mjs——test 也讀同一份，避免兩邊 glob 分岔。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildSprite, collectSpriteDefs } from './lib/svg-sprite.mjs';
import { listSpriteSources } from './lib/sprite-sources.mjs';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public/img/sprites');
fs.mkdirSync(OUT_DIR, { recursive: true });

const groups = listSpriteSources(ROOT);

// 每個來源檔的內容只讀一次，sha256 與 svgo 輸入用同一份字串——sources.json 記的是
// 「原始檔案內容」的雜湊，不是 svgo 優化後的結果（優化是確定性的，但沒必要讓 sources.json
// 依賴 svgo 版本／設定的變動）。
const sources = {};
const readItems = (list) =>
  list.map(({ id, file }) => {
    const svg = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    sources[rel] = createHash('sha256').update(svg).digest('hex');
    return { id, svg };
  });

// 每支 sprite 內被 url(#…) 參照到的 def，最後合成一份給頁面內聯（見檔尾）。
const spriteDefs = new Map();

const write = async (name, list) => {
  const items = readItems(list);
  const out = await buildSprite(items);
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, out);
  for (const { id, markup } of collectSpriteDefs(out)) {
    const prev = spriteDefs.get(id);
    // id 由 svgo 的 prefixIds 前綴成 symbol id，symbol id 又是全站唯一的檔名——
    // 撞號代表那條前提破了，內聯後會互相指錯，寧可停在這裡。
    if (prev && prev.markup !== markup) throw new Error(`[svg-sprite] def id 跨 sprite 撞號：${id}（${prev.from} vs ${name}）`);
    spriteDefs.set(id, { markup, from: name });
  }
  console.log(`${name}: ${items.length} symbols, ${(out.length / 1024).toFixed(0)} KB`);
};

await write('partners.svg', groups.partners);
await write('article.svg', groups.article);

/**
 * article 這一組另外產一份 symbol id → viewBox 的對照表。
 *
 * 為什麼只有這一組需要：`<use href="sprite.svg#id">` 時 viewBox 在 <symbol> 上，
 * **外層 `<svg>` 沒有內在尺寸**。partners 與 art-* 的消費端 CSS 都同時定死了 width 與
 * height，所以不需要；但文章素材有幾處只定 height 讓寬度自己長（如
 * `.award-timeline__year` 只有 `height: 23px`、`.formula__box-logo` 是 `width: auto`），
 * 那就得把 viewBox 補回外層 `<svg>` 才算得出比例。年份 2022–2026 的原始寬高就各不相同
 * （76×24 / 78×24 / 73×22…），寫死一個值會變形。
 *
 * 放 app/utils/ 而不是 public/：它要被 bundle 進 JS 查表用，不是拿來下載的資產
 * ——放 public/ 等於多一個 request，正好與這支 sprite 的目的相反。
 */
const viewBoxes = Object.fromEntries(
  groups.article.map(({ id, file }) => {
    const svg = fs.readFileSync(file, 'utf8');
    const m = svg.match(/<svg\b[^>]*\bviewBox="([^"]+)"/);
    if (!m) throw new Error(`[svg-sprite] ${id}：來源檔沒有 viewBox，無法產對照表`);
    return [id, m[1].trim()];
  }),
);
const viewBoxFile = path.join(ROOT, 'app/utils/article-sprite-viewbox.json');
fs.writeFileSync(viewBoxFile, `${JSON.stringify(viewBoxes, null, 2)}\n`);
console.log(`article-sprite-viewbox.json: ${Object.keys(viewBoxes).length} 筆`);

for (const bp of ['pc', 'pad', 'mob']) {
  await write(`art-${bp}.svg`, groups[`art-${bp}`]);
}

const sourcesFile = path.join(OUT_DIR, 'sources.json');
fs.writeFileSync(sourcesFile, `${JSON.stringify(sources, null, 2)}\n`);
console.log(`sources.json: ${Object.keys(sources).length} 個來源檔`);

/**
 * 五支 sprite 內被 url(#…) 參照到的 def（漸層、clipPath），合成一份給 app.vue 內聯。
 *
 * ⚠️ WebKit 解析外部 `<use href="sprite.svg#id">` 內的 `url(#…)` 時是拿**引用端文件**
 * 查 id，不是 sprite 那份外部文件（Chromium／Gecko 則是在外部文件查，都正常）。
 * 查不到就沒有任何錯誤訊號：桌機 WebKit 把漸層退成黑色、iOS 整塊不繪製 ——
 * 2026-09-06 設計師回報「金格／長春藤／麗寶的 logo 在 iPhone 不見了」就是這個。
 * 這份 defs 內聯進頁面後，WebKit 在引用端就查得到同 id 的定義；Chromium 不受影響。
 * 完整的成因與實測見 scripts/lib/svg-sprite.mjs 的 collectSpriteDefs()。
 *
 * 放 app/assets/ 而不是 public/：它要被內聯進 HTML，不是拿來下載的資產——放 public/
 * 等於多一個 request，正好與 sprite 的目的相反（同 article-sprite-viewbox.json 的理由）。
 */
const defsFile = path.join(ROOT, 'app/assets/generated/sprite-defs.svg');
fs.mkdirSync(path.dirname(defsFile), { recursive: true });
const defs = [...spriteDefs.values()].map(({ markup }) => markup).join('');
fs.writeFileSync(defsFile, `<defs>${defs}</defs>\n`);
console.log(`sprite-defs.svg: ${spriteDefs.size} 個 def, ${(defs.length / 1024).toFixed(1)} KB`);
