import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { spriteBase } from '../app/utils/svg-sprite-ref';

// 為什麼要這支測試（2026-09-06 正式站事故）：
// 站台只有一份 build（.env.production，部署在 vip.udn.com/newmedia/2026/udn75；兩台的
// Nuxt buildId 完全相同可證）。udn75.udn.com 不是轉址，是把那份部署代理出去的前台：
// 它把 HTML 裡「引號後接 /newmedia/2026/udn75」的**相對**路徑改寫成 /（_nuxt、payload 裡
// 的 baseURL 都被改到了），但改不到 APP_ASSETS_PATH 組出來的**絕對** URL。
// 於是頁面 origin 是 https://udn75.udn.com，而三支 sprite 的 <use href> 指向
// https://vip.udn.com/... → 全部跨源 → 瀏覽器**靜默**擋下：/subpage 16 支、/news 12 支、
// 首頁 39 支藝術字與 46 支夥伴 logo 全部消失，沒有 console error、沒有網路錯誤、
// 沒有 build 警告。線上實測 use.getBBox() 是 0×0，把 href 換成同源路徑後立刻長回 257×45。
//
// ⚠️ 不是 server 擋的：vip 那台回 200 並且正確帶了
//    Access-Control-Allow-Origin: https://udn75.udn.com，同一支檔案在同一頁用 fetch(cors)
//    與 <img> 都拿得到；只有 <use> 不肯用。外部 <use> 的同源限制是瀏覽器自己的規則，
//    CORS 標頭解不開，所以這件事無法靠調 server 修。
//
// 根治的做法是**讓 sprite 的 href 根本組不出 origin**：改吃 app.baseURL —— 它是相對路徑，
// 前台會連它一起改寫，因此 vip 與 udn75 兩邊都指得到。這支測試守的就是那條界線。
//
// ⚠️ 反過來說 APP_ASSETS_PATH **應該**維持絕對 URL（app.vue 的 og:image 靠它組出可分享的
//    完整網址），而且 <img src>、CSS url()／mask-image 跨源本來就正常 —— 那些仍走
//    useAssetUrl()（例如 BlessingPartners 的 png logo）。兩者職責不同，不要合併。

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
