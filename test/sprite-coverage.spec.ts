import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import section2 from '../app/locales/section2.json';
import section3 from '../app/locales/section3.json';
import { isSvgPath, spriteSymbolId } from '../app/utils/svg-sprite-ref';
import { listSpriteSources } from '../scripts/lib/sprite-sources.mjs';

// sprite 是 commit 進 repo 的產物；換了 logo 忘了跑 `pnpm assets:sprites`，畫面會少一顆 logo
// 而且沒有任何錯誤。這裡把 JSON 引用的每個 svg 與 sprite 內的 symbol id 對帳。
const spriteIds = (file: string) => {
  const svg = readFileSync(join(__dirname, '..', 'public/img/sprites', file), 'utf8');
  return new Set([...svg.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]));
};

describe('partners.svg 涵蓋 section3.json 的每個 svg logo', () => {
  const ids = spriteIds('partners.svg');
  const logos = section3.partner.tiers.flatMap((t) => t.partners.map((p) => p.logo));

  it('至少有 40 個 svg logo（避免 JSON 路徑改了讓測試空轉）', () => {
    expect(logos.filter(isSvgPath).length).toBeGreaterThanOrEqual(40);
  });

  it('每個 svg logo 都有對應 symbol', () => {
    for (const logo of logos.filter(isSvgPath)) {
      expect(ids.has(spriteSymbolId(logo)), logo).toBe(true);
    }
  });
});

// 收集 section2 / section3 內所有 { src, w, h } 形狀的素材路徑（與 test/forum-text-art.spec.ts 同一種掃法）
const collectArt = (node: unknown, out: string[] = []): string[] => {
  if (Array.isArray(node)) node.forEach((n) => collectArt(n, out));
  else if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    if (typeof o.src === 'string' && typeof o.w === 'number' && typeof o.h === 'number' && o.src.endsWith('.svg')) out.push(o.src);
    Object.values(o).forEach((v) => collectArt(v, out));
  }
  return out;
};

describe('art-{pc,pad,mob}.svg 涵蓋 section2 / section3 的每個藝術字素材', () => {
  // header 錨點藝術字走的是 data URI（見 app/utils/inline-art.ts），不是這裡的 sprite；
  // 這個 filter 目前恆為 true（section2/section3 收集不到 /header/ 開頭的路徑），但留著
  // 且不刪——它是「header 藝術字走 data URI、論壇／祝福藝術字走 sprite」這條分界唯一的
  // 可執行痕跡，之後真的有人把 header 路徑塞進這兩份 JSON，這裡會把它正確地排除掉。
  const arts = [...collectArt(section2), ...collectArt(section3)].filter((s) => !s.includes('/header/'));
  const ids = { pc: spriteIds('art-pc.svg'), pad: spriteIds('art-pad.svg'), mob: spriteIds('art-mob.svg') };

  it('至少 80 筆素材', () => expect(arts.length).toBeGreaterThanOrEqual(80));

  it('每筆素材都在對應斷點的 sprite 裡', () => {
    for (const src of arts) {
      const bp = src.match(/-(pc|pad|mob)(-\d+)?\.svg$/)?.[1] as 'pc' | 'pad' | 'mob' | undefined;
      expect(bp, `${src} 檔名沒有 -pc/-pad/-mob`).toBeDefined();
      expect(ids[bp!].has(spriteSymbolId(src)), src).toBe(true);
    }
  });
});

// sprite-coverage 只驗「symbol id 存不存在」，抓不到「檔名沒變、內容換了」——
// 把某支 logo 的圖換掉但忘了重跑 `pnpm assets:sprites`，上面兩組測試依然全線通過，
// 網站卻繼續顯示舊圖。這裡用 sources.json 記的 sha256 對帳每一支來源檔的實際內容，
// 並用 listSpriteSources（build-svg-sprites.mjs 建 sprite 時同一份清單邏輯）反查
// 「現在應該進 sprite 的檔案」，連同「新增／刪除來源檔卻沒重跑」也一起抓。
describe('sprite 來源檔內容與 sources.json 對帳', () => {
  const root = join(__dirname, '..');
  const sources = JSON.parse(
    readFileSync(join(root, 'public/img/sprites/sources.json'), 'utf8'),
  ) as Record<string, string>;
  const RERUN_HINT = '請重跑 `pnpm assets:sprites` 並把 public/img/sprites/ 下的產物一起 commit。';

  // 與 build-svg-sprites.mjs 用同一份 listSpriteSources：規則只有一個真值，
  // 不會出現「腳本認的來源」與「測試認的來源」兩份會分岔的 glob。
  const expectedFiles = Object.values(listSpriteSources(root))
    .flat()
    .map(({ file }: { file: string }) => relative(root, file).split(sep).join('/'))
    .sort();

  it('sources.json 至少記錄 100 支來源檔（避免路徑或 glob 寫錯讓測試空轉）', () => {
    expect(Object.keys(sources).length).toBeGreaterThanOrEqual(100);
  });

  it('現在應該進 sprite 的檔案與 sources.json 記錄的一致（抓新增／刪除來源檔）', () => {
    const recorded = Object.keys(sources).sort();
    expect(expectedFiles, RERUN_HINT).toEqual(recorded);
  });

  it('每一支來源檔的目前內容 sha256 都與 sources.json 相符（抓內容換了但忘記重跑）', () => {
    for (const [rel, hash] of Object.entries(sources)) {
      const actual = createHash('sha256').update(readFileSync(join(root, rel))).digest('hex');
      expect(actual, `${rel} 內容與 sources.json 記錄的不同。${RERUN_HINT}`).toBe(hash);
    }
  });
});
