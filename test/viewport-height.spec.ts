import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// 視窗高在本專案有**單一來源** `--vh`（CSS 用 vh() / vhLength()、JS 用 vhPx()）。
// 這支守住「別處不要再直接寫 100vh 或讀 window.innerHeight」。
//
// 為什麼要守：行動裝置上 CSS 的 vh 與 JS 的 innerHeight 不是同一個數（前者是
// large viewport、收合網址列不變，後者是 dynamic viewport、會變）。混用會讓版面
// 與捲動幾何各走各的尺 —— 實測差 60px 時整份文件位移 72px、進度差 0.077。
// 完整脈絡見 architecture/viewport-height.md。
//
// 寫法沿用 design-tokens.spec.ts（掃原始碼 ＋ 白名單），兩支的維護方式一致。

const SCAN_EXT = ['.vue', '.ts', '.scss', '.css'];

// ── 不在本次改版範圍內的路徑 ──────────────────────────────────────────
// 加新段落時**不要**順手加進來，除非那一段真的與捲動敘事無關。
const OUT_OF_SCOPE = [
  'app/components/legacy/', //     已停用
  'app/components/04.media/', //   刻意排除（見 architecture/viewport-height.md「唯一的例外」）
  'app/composables/useMediaIntroMotion.ts',
  'app/components/05.subpage/', // 已用 100svh 雙寫，本來就穩
  'app/pages/demo.vue', //         開發用示範頁
  'app/components/ShowcaseGallery.vue',
  'app/components/AwardTimeline.vue',
  'app/components/PhotoPanels.vue',
  'app/components/GlitchImage.vue',
];

// ── vh 字面量：逐行例外 ───────────────────────────────────────────────
// 用「檔案 ＋ 該行片段」而非整檔放行，否則同一支檔案裡其他地方寫死也會被放過。
const VH_LINE_EXCEPTIONS = [
  {
    file: 'app/plugins/viewport-height.client.ts',
    snippet: 'height:100vh',
    why: '探測元素本身 —— 它就是在量 CSS 的 100vh',
  },
  {
    file: 'app/components/01a.symbol/SymbolFace.vue',
    snippet: 'max-height: calc(100vh - 68px)',
    why: 'dev 設定面板的高度上限，不屬於敘事版面；貼合「此刻看得到的範圍」才對',
  },
];

// ── window.innerHeight：整檔放行 ──────────────────────────────────────
// 這些地方問的是「使用者此刻看得到什麼」，本來就該用會變動的值。
const INNER_HEIGHT_ALLOWED: Record<string, string> = {
  'app/composables/useViewportHeight.ts': '單一來源自己的 fallback',
  'app/components/01.hero/Hero.vue': 'isVerticallyOnScreen：影片現在在不在畫面上',
  'app/components/01.hero/HeroLoader.vue': '磁磚格數，且元素框優先、innerHeight 只是 fallback',
  'app/components/AppHeader.vue': '捲動進度條分母＝真實最大可捲距離',
  'app/components/DevCoreProgress.vue': 'dashboard 要顯示真相',
  'app/components/02.forum/Agenda.vue': '播放頭的「視窗中央」；且只在 measure() 跑',
};

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

const inScope = (rel: string) => !OUT_OF_SCOPE.some((p) => rel.startsWith(p));

const scan = (
  check: (line: string, rel: string) => string | null,
): string[] => {
  const report: string[] = [];
  for (const file of walk('app')) {
    const rel = relative('.', file).split(sep).join('/');
    if (!inScope(rel)) continue;
    const hits: string[] = [];
    stripComments(readFileSync(file, 'utf8'))
      .split('\n')
      .forEach((line, i) => {
        const msg = check(line, rel);
        if (msg) hits.push(`${i + 1}: ${line.trim()} → ${msg}`);
      });
    if (hits.length) report.push(`${rel}\n  ${hits.join('\n  ')}`);
  }
  return report;
};

describe('視窗高只有一個來源', () => {
  it('CSS 不直接寫 vh 長度（用 vh() / vhLength()）', () => {
    const report = scan((line, rel) => {
      // `var(--vh, 1vh)` 的 fallback 是這套機制的一部分，先剝掉再找。
      const rest = line.replace(/var\(\s*--vh\s*,\s*1vh\s*\)/g, '');
      if (!/\d+(\.\d+)?vh\b/.test(rest)) return null;
      if (VH_LINE_EXCEPTIONS.some((e) => e.file === rel && line.includes(e.snippet)))
        return null;
      return 'CSS 用 vh()（mixins.scss）、JS 拼字串用 vhLength()';
    });
    expect(report.join('\n')).toBe('');
  });

  it('JS 不直接讀 window.innerHeight（用 vhPx()）', () => {
    const report = scan((line, rel) => {
      if (!/\bwindow\.innerHeight\b/.test(line)) return null;
      if (rel in INNER_HEIGHT_ALLOWED) return null;
      return '尺長／幾何請用 vhPx()；若確實需要「此刻可見高度」，補進白名單並寫理由';
    });
    expect(report.join('\n')).toBe('');
  });

  // 白名單本身也要守：路徑打錯或檔案改名時要立刻知道，否則規則會靜默失效。
  it('白名單指到的檔案都還在', () => {
    const missing = [
      ...Object.keys(INNER_HEIGHT_ALLOWED),
      ...VH_LINE_EXCEPTIONS.map((e) => e.file),
      ...OUT_OF_SCOPE.filter((p) => !p.endsWith('/')),
    ].filter((p) => {
      try {
        statSync(p);
        return false;
      } catch {
        return true;
      }
    });
    expect(missing).toEqual([]);
  });

  // 逐行例外最容易腐爛：那一行被改掉時例外就對不上，規則會**變嚴**而非變鬆
  // （測試會失敗），但失敗訊息會指向錯的地方。這一條讓原因直接說清楚。
  it('逐行例外的片段都還存在於該檔案內', () => {
    const stale = VH_LINE_EXCEPTIONS.filter(
      (e) => !readFileSync(e.file, 'utf8').includes(e.snippet),
    ).map((e) => `${e.file} 找不到「${e.snippet}」（${e.why}）`);
    expect(stale).toEqual([]);
  });
});
