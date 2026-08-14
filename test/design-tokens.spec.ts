import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// tailwind.css 的 @theme static 是色票唯一真值，這支守住「別處不要再寫死同一個 hex」。
const TOKEN_HEX: Record<string, string> = {
  '#ff7f00': '--color-orange',
  '#686868': '--color-gray',
  '#898989': '--color-gray-light',
  '#9fd6ff': '--color-blue',
  '#fafafa': '--color-white-light',
  '#404040': '--color-body',
  '#d8d8d8': '--color-line',
};

// 允許寫死 token hex 的路徑（見 architecture/components.md「不改的範圍」）
const ALLOWED_PREFIXES = [
  'app/assets/styles/tailwind.css', // token 定義本身
  'app/components/legacy/',
  'app/components/05.subpage/',
  'app/components/AiSearch.vue',
  'app/components/FormulaBlocks.vue',
  'app/components/AwardTimeline.vue',
  'app/components/PhotoPanels.vue',
  'app/components/PixelRail.vue',
  'app/components/PixelBranch.vue',
  'app/components/AiImageQuiz.vue',
  'app/pages/demo.vue',
];

// C 類：WebGL / canvas 需要 hex 字串，CSS 變數取代不了。只有這一支放行，
// 且僅限單引號包住的字串；其餘位置（含 inline style binding）一律視為違規。
const QUOTED_HEX_ALLOWED = ['app/components/04.media/HeartMetaball.vue'];

const SCAN_EXT = ['.vue', '.ts', '.scss', '.css'];

// 註解提到色值不算違規。三種都要剝：/* */（CSS/JS）、//（JS/SCSS）、<!-- -->（.vue template）。
// 副作用：字串裡的 // 之後會被切掉，但那不會憑空造出 hex，
// 最多漏抓同行 // 之後的違規，可接受。
const stripComments = (src: string) =>
  src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

const walk = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
};

const findViolations = (src: string, rel: string): string[] => {
  const quotedOk = QUOTED_HEX_ALLOWED.includes(rel);
  const hits: string[] = [];
  stripComments(src)
    .split('\n')
    .forEach((line, i) => {
      for (const m of line.matchAll(/(.?)(#[0-9a-fA-F]{6})\b/g)) {
        const hex = m[2]!.toLowerCase();
        if (!(hex in TOKEN_HEX)) continue;
        if (quotedOk && m[1] === "'") continue; // C 類：JS/WebGL 材質參數
        hits.push(`${i + 1}: ${line.trim()} → 應用 var(${TOKEN_HEX[hex]})`);
      }
    });
  return hits;
};

describe('design token 不重複寫死', () => {
  it('token 色值只出現在 tailwind.css 與允許清單內', () => {
    const report: string[] = [];
    for (const file of walk('app')) {
      const rel = relative('.', file).split(sep).join('/');
      if (ALLOWED_PREFIXES.some((p) => rel.startsWith(p))) continue;
      const hits = findViolations(readFileSync(file, 'utf8'), rel);
      if (hits.length) report.push(`${rel}\n  ${hits.join('\n  ')}`);
    }
    expect(report.join('\n')).toBe('');
  });
});
