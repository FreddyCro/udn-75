/**
 * 產生「只含站上真的出現過的字」的字型子集。**文案改了就要重跑**，產物 commit 進 repo
 * （build 不會自動跑，規則同 assets:sprites；test/font-subset.spec.ts 會對帳，
 * 也寫進 CLAUDE.md「字型子集」一節，避免只有這裡的檔頭知道）。
 *
 *   node scripts/build-font-subset.mjs      （= pnpm assets:fonts）
 *
 * 產出：
 *   app/assets/fonts/noto-sans-tc-subset-{1..n}.woff2  ← 全部 2,094 字
 *   app/assets/fonts/noto-sans-subset-1.woff2          ← 非 CJK 的那些
 *   app/assets/styles/generated/font-subset.css        ← @font-face，掛在 nuxt.config 的 css[]
 *
 * 做法：跟 Google Fonts css2 要 `text=<我們的字>`，它回傳一支剛好包含那些字的 woff2，
 * 下載下來自架。不需要本地 subsetter，也不需要 vendor 一份 6.76 MB 的完整字型。
 *
 * ⚠️ woff2 放 app/assets/（不是 public/）：讓 Vite 處理路徑與 hash。public/ 的檔要自己
 *    組 base path，而本站有四個部署目標、base 各不相同（見 .env.*.example）；交給 Vite
 *    就不會有這個問題，而且產物落在 _nuxt/ 拿得到 immutable 快取。
 *
 * ⚠️ 這支腳本在 build 時**不會**被呼叫。理由是它需要連外網——把連外網塞進四個部署目標的
 *    generate 流程，失敗時的表現會比「測試在 CI 紅一條」難懂得多。
 */
import fs from 'node:fs';
import path from 'node:path';
import { collectText, readGlyphSources } from './lib/collect-glyphs.mjs';
import {
  BATCH_MAX,
  FAMILIES,
  WEIGHT,
  charsFor,
  splitBatches,
  unicodeRange,
} from './lib/font-subset.mjs';

const ROOT = process.cwd();
const FONT_DIR = path.join(ROOT, 'app/assets/fonts');
const CSS_OUT = path.join(ROOT, 'app/assets/styles/generated/font-subset.css');

// Google 依 UA 決定回 woff2 還是舊格式；固定一個現代 UA，產物才不會因執行環境而變。
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const css2Url = (family, text) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}` +
  `:wght@300..500&display=swap&text=${encodeURIComponent(text)}`;

async function fetchSubset(family, text) {
  const res = await fetch(css2Url(family, text), { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`[font-subset] ${family}: css2 回 ${res.status}`);
  const css = await res.text();
  const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);

  // ⚠️ 這一關是整支腳本的重點。text= 超過上限時 Google 回的是 HTTP 200 ＋ 完整的
  //    105 片切片清單，看起來完全正常——只驗 status 會把「第一片切片」當成子集存下來，
  //    產物靜默錯誤（開發時實測踩過：1,050 字的批次存出 9 KB 的檔還以為成功了）。
  //    子集必定只有一個 url()。
  if (urls.length !== 1) {
    throw new Error(
      `[font-subset] ${family}: 期望 1 個 url()，實得 ${urls.length}。` +
        `這代表這一批的字數（${[...text].length}）超過 text= 的 800 字上限，` +
        `Google 已靜默忽略 text=。請調小 scripts/lib/font-subset.mjs 的 BATCH_MAX。`,
    );
  }

  const bin = await fetch(urls[0], { headers: { 'User-Agent': UA } });
  if (!bin.ok) throw new Error(`[font-subset] ${family}: 字型檔回 ${bin.status}`);
  return Buffer.from(await bin.arrayBuffer());
}

const text = collectText(readGlyphSources(ROOT));
console.log(
  `收集到 ${[...text].length} 個字元（來源：app/**/*.{vue,ts,json} ＋ common-components dist）`,
);

// 每次重跑都先清掉舊產物：文案變動會讓批次數改變，殘留的舊檔會被 CSS 漏掉卻留在版控裡。
fs.rmSync(FONT_DIR, { recursive: true, force: true });
fs.mkdirSync(FONT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });

const cssBlocks = [];
let totalBytes = 0;
let totalFiles = 0;

for (const family of FAMILIES) {
  const chars = charsFor(family, text);
  const batches = splitBatches(chars, BATCH_MAX);
  console.log(`\n${family.google} → ${chars.length} 字 / ${batches.length} 批`);

  for (const [i, batch] of batches.entries()) {
    const name = `${family.slug}-subset-${i + 1}.woff2`;
    const buf = await fetchSubset(family.google, batch.join(''));
    fs.writeFileSync(path.join(FONT_DIR, name), buf);
    totalBytes += buf.length;
    totalFiles += 1;
    console.log(`  ${name}  ${batch.length} 字 / ${(buf.length / 1024).toFixed(0)} KB`);

    cssBlocks.push(
      `@font-face {\n` +
        `  font-family: '${family.google}';\n` +
        `  font-style: normal;\n` +
        `  font-weight: ${WEIGHT};\n` +
        `  font-display: swap;\n` +
        `  src: url('../../fonts/${name}') format('woff2');\n` +
        `  unicode-range: ${unicodeRange(batch.map((c) => c.codePointAt(0)))};\n` +
        `}`,
    );
  }
}

const header =
  `/* 由 scripts/build-font-subset.mjs 產生，不要手改。改了文案後跑 \`pnpm assets:fonts\`。\n` +
  `   涵蓋範圍由 test/font-subset.spec.ts 對帳：站上出現、這裡卻沒收的字會讓測試變紅。 */\n`;
fs.writeFileSync(CSS_OUT, header + cssBlocks.join('\n\n') + '\n');

console.log(`\n完成：${totalFiles} 支 woff2 / 合計 ${(totalBytes / 1024).toFixed(0)} KB`);
console.log(`  ${path.relative(ROOT, CSS_OUT).split(path.sep).join('/')}`);
