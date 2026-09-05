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
import { buildSprite } from './lib/svg-sprite.mjs';
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

const write = async (name, list) => {
  const items = readItems(list);
  const out = await buildSprite(items);
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, out);
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
