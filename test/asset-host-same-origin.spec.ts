import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 為什麼要這支測試：app/utils/art-sprite.ts 與 BlessingPartners.vue 都用
// `<svg><use href="...">` 引用外部 sprite（見兩處的「⚠️ 外部 <use href> 必須同源」
// 註解）。跨源的 `<use>` 會被瀏覽器**靜默**擋下——沒有 console error、沒有 build 失敗、
// 沒有測試失敗，104 個 symbol、跨三支 sprite 的藝術字與 45 支夥伴 logo 會無聲消失。
// 這支測試守的就是「四個部署目標的 NUXT_PUBLIC_APP_ASSETS_PATH 與 NUXT_URL 同源」這個
// 前提——一旦有人為了同一個 429 問題改用 app.cdnURL 把資產搬去別的 host，這裡要先紅。
//
// 判斷「同源」不能只比較兩邊的 host：同 host 不同 scheme（例如資產是 http://，頁面是
// https://）對 <use> 來說仍是跨源，必須比對完整的 origin（scheme + host + port）。
// 也不能直接兩邊都丟給 `new URL()` 比 origin：開發用的 .env.development.example 是
// NUXT_URL=/（相對路徑、沒有 origin）、ASSETS_PATH=''（空字串，assetUrl() 直接吃相對
// 路徑）—— 這種組合本來就是同源（兩者都相對於目前頁面的 origin），`new URL('/')` 沒有
// base 會直接丟例外，必須先特判。

/** 讀出一個 origin，"沒有 origin"（相對路徑／空字串）一律回傳 null，代表「跟目前頁面同源」。 */
const originOf = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '/') return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    // 不是完整 URL（例如純路徑），視為相對於目前頁面，同樣算「沒有 origin」。
    return null;
  }
};

const ENV_DIR = join(__dirname, '..');
const exampleFiles = readdirSync(ENV_DIR).filter(
  (name) => name.startsWith('.env.') && name.endsWith('.example'),
);

const readVar = (content: string, key: string): string => {
  const m = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return m ? m[1] : '';
};

describe('部署設定的 assets 與頁面必須同源（sprite 的 <use> 跨源會靜默失敗）', () => {
  it('至少掃到 5 個 .env.*.example（避免 glob 寫錯讓測試空轉）', () => {
    expect(exampleFiles.length).toBeGreaterThanOrEqual(5);
  });

  it.each(exampleFiles)('%s：ASSETS_PATH 與 NUXT_URL 同源（origin）', (file) => {
    const content = readFileSync(join(ENV_DIR, file), 'utf8');
    const nuxtUrl = readVar(content, 'NUXT_URL');
    const assetsPath = readVar(content, 'NUXT_PUBLIC_APP_ASSETS_PATH');
    expect(
      originOf(assetsPath),
      `${file}: ASSETS_PATH=${assetsPath} vs NUXT_URL=${nuxtUrl}`,
    ).toBe(originOf(nuxtUrl));
  });
});
