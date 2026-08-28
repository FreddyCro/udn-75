import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';

// 連續閱讀頁在 ≥768 導回獨立子頁的那一跳，**目標網址一定要帶尾斜線**。
//
// 為什麼：正式站有一條「路徑沒有尾斜線就 301」的規則，而它不只補斜線 ——
//   /newmedia/2026/udn75/data   → 301 → http://newmedia.udn.com.tw/2026/udn75/data/
//   /newmedia/2026/udn75/data/  → 200
// 換 host（vip.udn.com → newmedia.udn.com.tw）、換路徑前綴（少了 /newmedia）、
// 還從 https 降級成 http。落地後 build 內的 baseURL（/newmedia/2026/udn75/）對不上
// 那台的掛載路徑，_nuxt 的 CSS/JS、img、_fonts 全 404（實測 84 個），頁面不 hydrate。
//
// 全站只有這一處是硬導航（location.replace）才會踩到：其餘連結都是 NuxtLink 走
// client-side router，根本不打伺服器；而 prerender 出來的靜態 HTML 裡的 href 由
// nitro 自動改寫成尾斜線形式（`href="/newmedia/2026/udn75/data/"`）。這一條的網址是
// **runtime 才組出來的**，改寫不到 —— 所以它是唯一的破口，也是唯一需要自己補斜線的地方。
//
// 症狀對使用者是「pc 開分享來的 /subpage 連結 → 連轉兩次 → 落在裸 HTML 的別家網域」。

const SRC = readFileSync(join('app', 'pages', 'subpage.vue'), 'utf8');

describe('連續閱讀頁的 pad/pc 導回：目標網址帶尾斜線', () => {
  // 守門員：這行若被搬走或改寫法，下面那條 regex 會靜默地永遠通過
  it('找得到那一行硬導航（location.replace ＋ router.resolve）', () => {
    expect(/location\.replace\(\s*router\.resolve\(/.test(SRC)).toBe(true);
  });

  it('router.resolve 的路徑結尾是斜線', () => {
    const line = SRC.match(/location\.replace\(\s*router\.resolve\(([^\n]*)/)![1]!;
    expect(
      /\/`\)/.test(line),
      '導回目標少了尾斜線 → 正式站會 301 到 http://newmedia.udn.com.tw/…，'
        + '資源全 404。實際寫法：' + line.trim(),
    ).toBe(true);
  });
});

describe('vue-router：帶尾斜線的路徑一樣配得到子頁 route', () => {
  const SLUGS = ['news', 'visual', 'service', 'data', 'education', 'health'];
  // 與 nuxt.config 的 app.baseURL 在正式站的值一致（NUXT_URL 的 pathname）
  const router = createRouter({
    history: createMemoryHistory('/newmedia/2026/udn75/'),
    routes: [
      { path: '/', component: {} },
      { path: '/subpage', component: {} },
      ...SLUGS.map((s) => ({ path: `/${s}`, component: {} })),
    ],
  });

  it.each(SLUGS)('/%s/ 解析得到 route，且 href 保留尾斜線', (slug) => {
    const resolved = router.resolve(`/${slug}/`);
    // 配得到 route：補斜線不會把人導去 404（vue-router 預設 strict: false）
    expect(resolved.matched.length).toBe(1);
    expect(resolved.href).toBe(`/newmedia/2026/udn75/${slug}/`);
  });
});
