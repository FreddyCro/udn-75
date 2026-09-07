/**
 * build 前的字型子集守門。`pnpm generate` / `pnpm build` 會先跑這支，**不可繞過**。
 *
 *   node scripts/check-font-subset.mjs
 *
 * 為什麼要有這支，而不是只靠 test/font-subset.spec.ts：
 * 部署路徑是 `deploy-gh.sh` → `pnpm generate`，中間**不經過測試**。只靠測試的話，
 * 「改了文案 → 沒跑 pnpm assets:fonts → 直接部署」這條路徑上沒有任何攔截點，
 * 而漏字的表現是那個字掉到系統字型 —— 看得見、但沒有任何錯誤訊號，很容易一路上線。
 *
 * 這支**不連外網**：它只重算一次字元集合、跟已 commit 的 CSS 對帳，毫秒級。
 * 真的要重新產子集是 `pnpm assets:fonts`（那支才連 Google）。
 */
import process from 'node:process';
import { coverageReport } from './lib/font-subset.mjs';

const ROOT = process.cwd();
const report = coverageReport(ROOT);

if (report.reason) {
  console.error(`\n✗ 字型子集：${report.reason}`);
  console.error('  請跑 `pnpm assets:fonts` 產生子集後再 build。\n');
  process.exit(1);
}

if (!report.ok) {
  const shown = report.missing.slice(0, 30);
  console.error(`\n✗ 字型子集漏了 ${report.missing.length} 個字元 —— 這些字在站上會掉到系統字型：\n`);
  for (const m of shown) {
    console.error(`    ${m.ch}  U+${m.cp.toString(16).toUpperCase().padStart(4, '0')}  （${m.family}）`);
  }
  if (report.missing.length > shown.length) {
    console.error(`    …另外還有 ${report.missing.length - shown.length} 個`);
  }
  console.error('\n  文案改過了但沒重新產子集。請跑：\n');
  console.error('      pnpm assets:fonts\n');
  console.error('  跑完把 app/assets/fonts/ 與 app/assets/styles/generated/ 的產物一起 commit。\n');
  process.exit(1);
}

console.log(
  `✓ 字型子集涵蓋 ${report.glyphCount} 個字元（${report.faces.length} 支 woff2），無漏字`,
);
