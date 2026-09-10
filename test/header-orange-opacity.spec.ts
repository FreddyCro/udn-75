import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ── 兩種橘的分家 ────────────────────────────────────────────────────────
//
// header 的橘底有兩個使用者，需求正好相反：
//   03 永續祝福靜態那段（Blessing.vue）── 設計師 2026-09-10 指定底色 70%，與
//     light（70% 白）／dark（50% 黑）一致，捲過去的內容要在 header 底下透出來。
//   03 → 04 融合拍（useMediaIntroMotion）── 必須不透明。那段橘柱會收窄，header
//     帶兩側的背後變成白，70% 的橘疊在白上變淺 ⇒ 整條帶子看起來被切成三塊
//     （兩側淺橘、中間飽和橘）。那是 2026-08-18 使用者回報的「露餡」，當初就是
//     為了它才把橘從半透明改成實心的。
//
// 所以這次是**多開一檔** 'orange-translucent' 給靜態那段，而不是把 'orange' 整條
// 改回半透明。這支守住那條界線：誰漏了、誰被合併回去，都會在這裡紅。
//
// 為什麼是讀原始碼：這條不變量分散在「型別 ＋ template 的 class binding ＋ SCSS
// 變數」三處，沒有純函式可測（pickHeaderTheme 完全不看主題的值）。而畫面上的症狀
// —— 融合拍那條帶子分三塊 —— 只在捲動經過那一秒才看得到，靠人眼回歸抓不住。
const THEME_SRC = 'app/utils/header-theme.ts';
const HEADER_SRC = 'app/components/ui/AppHeader.vue';
const BLESSING_SRC = 'app/components/03.blessing/Blessing.vue';
const MEDIA_SRC = 'app/composables/useMediaIntroMotion.ts';

// 註解裡本來就把兩個主題名字寫滿了，不剝掉會自己驗到自己。
// 三種都要剝：/* */、//、<!-- -->（同 design-tokens.spec.ts）。
const stripComments = (src: string) =>
  src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

/** 取出 header 所指的那個 SCSS 區塊（含巢狀），用大括號配對。（同 blessing-outro-hardcut） */
const scssBlock = (src: string, header: RegExp): string => {
  const m = header.exec(src);
  if (!m) return '';
  const open = src.indexOf('{', m.index);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(open + 1, i);
  }
  return '';
};

// 「行首（可縮排）＋ 選擇器 ＋ 空白 ＋ `{`」。--orange 的規則不會誤中
// --orange-translucent（`-translucent` 不是空白也不是大括號）。
const ORANGE = /^[ \t]*\.app-header__layer--orange\s*\{/m;
const TRANSLUCENT = /^[ \t]*\.app-header__layer--orange-translucent\s*\{/m;
const BAND = /^[ \t]*\.app-header__layer--band\s*\{/m;

const theme = readFileSync(THEME_SRC, 'utf8');
const header = stripComments(readFileSync(HEADER_SRC, 'utf8'));
const blessing = stripComments(readFileSync(BLESSING_SRC, 'utf8'));
const media = stripComments(readFileSync(MEDIA_SRC, 'utf8'));

describe('header 的兩種橘：靜態半透明、融合拍不透明', () => {
  it('HeaderTheme 兩檔都在（下面幾條的前提）', () => {
    expect(theme).toMatch(/'orange'/);
    expect(theme).toMatch(/'orange-translucent'/);
  });

  it('永續祝福靜態那段宣告 orange-translucent', () => {
    expect(blessing).toMatch(
      /:data-header-theme="outroWhite \? 'light' : 'orange-translucent'"/,
    );
  });

  // 反向的那一半：融合拍不可以偷偷跟著改成半透明，否則 2026-08-18 那個
  // 「帶子分三塊」會靜靜回來。
  it('融合拍那段一律用不透明的 orange，一次 orange-translucent 都沒有', () => {
    expect(media).not.toMatch(/orange-translucent/);
    expect(media).toMatch(/headerTheme = 'orange'/);
  });

  it('.--orange 的底色是實心的（沒有 alpha、沒有 color-mix）', () => {
    const block = scssBlock(header, ORANGE);
    expect(block).not.toBe('');
    expect(block).toMatch(/--hd-bg:\s*var\(--color-orange\);/);
    expect(block).not.toMatch(/color-mix|transparent|rgb\(/);
  });

  it('.--orange-translucent 的底色是 70% 橘', () => {
    const block = scssBlock(header, TRANSLUCENT);
    expect(block).not.toBe('');
    expect(block).toMatch(
      /--hd-bg:\s*color-mix\(\s*in srgb,\s*var\(--color-orange\) 70%,\s*transparent\s*\);/,
    );
  });

  // 設計師講的是「**底色**透明度 70%」：字與 icon 還是實心白。寫成整層 opacity
  // 會把 nav 文字、音量／分享 icon、logo mask 一起淡掉 —— 畫面上很像、但不是稿。
  it('半透明是做在底色上，不是整層 opacity', () => {
    const block = scssBlock(header, TRANSLUCENT);
    expect(block).not.toMatch(/(^|[^-])opacity\s*:/);
    expect(block).toMatch(/--hd-fg:\s*#fff;/);
    expect(block).toMatch(/--hd-accent:\s*#fff;/);
  });

  // 橘底配白 logo 是靠 mask 換色（.--dark 也是），漏掉會在永續祝福那段看到彩色 logo。
  it('白 logo 的 mask 規則收得到 --orange-translucent', () => {
    expect(header).toMatch(
      /\.app-header__layer--dark,\s*\.app-header__layer--orange,\s*\.app-header__layer--orange-translucent\s*\{/,
    );
  });

  // 同一顆 --hd-bg 有多個宣告者，靠來源順序決勝（見 AppHeader 那幾條 ⚠️ 註解）：
  // 色票在前、band 與 tint 的覆寫在後。新的一條插錯位置會蓋掉 band 的 transparent。
  it('--orange-translucent 宣告在 --band 之前（來源順序決勝）', () => {
    const translucentAt = header.search(TRANSLUCENT);
    const bandAt = header.search(BAND);
    expect(translucentAt).toBeGreaterThan(-1);
    expect(bandAt).toBeGreaterThan(-1);
    expect(translucentAt).toBeLessThan(bandAt);
  });
});
