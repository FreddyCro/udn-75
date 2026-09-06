import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { spriteBase } from '../app/utils/svg-sprite-ref';

// 為什麼要這支測試（2026-09-06 正式站事故）：
// udn75.udn.com 那份部署的 build 吃到 vip 那份的 NUXT_PUBLIC_APP_ASSETS_PATH
// （https://vip.udn.com/newmedia/2026/udn75），頁面卻服務在 https://udn75.udn.com。
// 三支 sprite 的 <use href> 全部經 useAssetUrl() 組路徑 → 全部跨源 → 瀏覽器**靜默**擋下：
// /subpage 16 支、/news 12 支、首頁 39 支藝術字與 46 支夥伴 logo 全部消失，
// 沒有 console error、沒有網路錯誤、沒有 build 警告。線上實測 use.getBBox() 是 0×0，
// 把 href 換成同源路徑後立刻長回 257×45。
//
// test/asset-host-same-origin.spec.ts 守的是「committed 的 .env.*.example 彼此同源」，
// 但真正 build 時吃的 .env 不在版控裡 —— 選錯檔案它一個字都看不到。所以真正的根治是
// **讓 sprite 的 href 根本組不出 origin**：改吃 app.baseURL（純 pathname，天然同源），
// APP_ASSETS_PATH 設成什麼都不影響。這支測試守的就是那條界線。
//
// ⚠️ 只有 sprite 的 <use> 有這個限制。<img src>、CSS url()／mask-image 跨源都正常，
//    那些仍該走 useAssetUrl()（例如 BlessingPartners 的 png logo）。

const ROOT = join(__dirname, '..');
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');

/** 遞迴列出目錄下的 .vue／.ts（站台根目錄相對路徑） */
const walk = (rel: string): string[] =>
  readdirSync(join(ROOT, rel), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(`${rel}/${e.name}`)
      : /\.(vue|ts)$/.test(e.name)
        ? [`${rel}/${e.name}`]
        : [],
  );

// 名單用掃的而非寫死：日後新增 sprite 消費端會自動被涵蓋
const consumers = walk('app/components').filter((f) =>
  /SpriteHref\(|\/img\/sprites\//.test(read(f)),
);

describe('spriteBase', () => {
  it('baseURL → 純路徑前綴（去掉尾斜線，永遠不帶 origin）', () => {
    expect(spriteBase('/')).toBe('');
    expect(spriteBase('')).toBe('');
    expect(spriteBase('/newmedia/2026/udn75/')).toBe('/newmedia/2026/udn75');
    expect(spriteBase('/udn-75/')).toBe('/udn-75');
    expect(spriteBase('/test/udn75')).toBe('/test/udn75');
  });
});

describe('sprite 的 <use href> 一律同源（不得經過 APP_ASSETS_PATH）', () => {
  it('至少掃到 6 個 sprite 消費端（避免掃描寫錯讓測試空轉）', () => {
    expect(consumers.length).toBeGreaterThanOrEqual(6);
  });

  it.each(consumers)('%s：sprite 路徑用 useSpriteUrl()，不是 useAssetUrl()', (file) => {
    const src = read(file);
    expect(src, `${file} 應以 useSpriteUrl() 組 sprite 路徑`).toMatch(/useSpriteUrl\(\)/);
    // 把 assetUrl 餵進 *SpriteHref()，或直接拿它組 /img/sprites/ 路徑，都會帶進 origin
    expect(src, `${file}: *SpriteHref() 不得吃 assetUrl`).not.toMatch(
      /SpriteHref\([^)]*assetUrl/,
    );
    expect(src, `${file}: assetUrl() 不得用來組 sprite 路徑`).not.toMatch(
      /assetUrl\(\s*['"`][^'"`]*\/img\/sprites\//,
    );
  });
});
