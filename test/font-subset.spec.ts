import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BATCH_MAX,
  CJK_START,
  coverageReport,
  parseFaces,
} from '../scripts/lib/font-subset.mjs';

// 站台字型子集的對帳（產物 = scripts/build-font-subset.mjs，`pnpm assets:fonts`）。
//
// 為什麼要守：子集只含「跑腳本當下站上出現過的字」，而站上**沒有任何保底字型檔**
// （nuxt.config 三個家族都是 provider: 'none'）。文案加了新字卻沒重跑，那個字就掉到
// 系統字型 —— 看得見、但粗細字寬跟正文對不上，**沒有任何錯誤訊號**。
//
// 同一份對帳也綁在 `pnpm generate` / `pnpm build` 前（scripts/check-font-subset.mjs），
// 因為部署路徑（deploy-gh.sh → pnpm generate）不會經過測試。這裡是 CI 那一道。
//
// 反過來，子集比實際需要多收字元是無害的（多幾 KB），所以只驗「有沒有漏」不驗「有沒有多」。

const ROOT = process.cwd();
const CSS = join(ROOT, 'app/assets/styles/generated/font-subset.css');
const FONT_DIR = join(ROOT, 'app/assets/fonts');

describe('站台字型子集', () => {
  const css = existsSync(CSS) ? readFileSync(CSS, 'utf8') : '';

  it('產物存在（沒跑過 `pnpm assets:fonts` 就會在這裡停）', () => {
    expect(existsSync(CSS), `找不到 ${CSS}，請跑 pnpm assets:fonts`).toBe(true);
    expect(css).toContain('@font-face');
  });

  const faces = css ? parseFaces(css) : [];

  it('每個 @font-face 指到的 woff2 都存在且非空', () => {
    expect(faces.length).toBeGreaterThan(0);
    for (const f of faces) {
      const abs = join(FONT_DIR, f.file);
      expect(existsSync(abs), `${f.file} 不存在`).toBe(true);
      expect(statSync(abs).size, `${f.file} 是空檔`).toBeGreaterThan(1024);
    }
  });

  it('每一批的字數不超過 Google text= 的上限', () => {
    // 超過時 Google 不報錯、改回傳完整的 105 片切片清單，build 腳本會擋下來；
    // 這裡多守一道，避免有人手動改了 CSS 或調大 BATCH_MAX 卻沒重跑。
    for (const f of faces) {
      expect(f.codepoints.size, `${f.file} 收了 ${f.codepoints.size} 字`).toBeLessThanOrEqual(
        BATCH_MAX,
      );
    }
  });

  it('站上出現的每個字元都被子集涵蓋（漏字＝忘記重跑 pnpm assets:fonts）', () => {
    // 與 `pnpm generate` 前的守門（scripts/check-font-subset.mjs）共用同一支
    // coverageReport()——兩邊各寫一份規則遲早會分岔。
    const report = coverageReport(ROOT);
    expect(report.reason ?? '').toBe('');
    expect(
      report.missing
        .slice(0, 40)
        .map((m) => `${m.family}: ${m.ch} (U+${m.cp.toString(16).toUpperCase()})`)
        .join('\n'),
      `有 ${report.missing.length} 個字元不在子集裡，請跑 pnpm assets:fonts`,
    ).toBe('');
  });

  it('CJK 只交給 Noto Sans TC 的子集，西文那支不收 CJK', () => {
    // 家族名沿用原名，所以這裡是精確比對 'Noto Sans'（不會誤中 'Noto Sans TC'）
    const sans = faces.filter((f) => f.family === 'Noto Sans');
    const cjk = sans.flatMap((f) => [...f.codepoints]).filter((cp) => cp >= CJK_START);
    expect(cjk, 'Noto Sans 沒有 CJK 字身，收進去只會下載了卻用不到').toHaveLength(0);
  });
});
