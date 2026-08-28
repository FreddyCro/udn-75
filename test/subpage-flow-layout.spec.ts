/**
 * 子頁「手機版走一般 layout flow」的守門。
 *
 * 設計稿（分頁_414mob）要求 <768 把 hero／引言的淡入淡出、引言的一屏定住、影片退場的
 * scrub 淡出全部拿掉，順順滑下來（滿版圖／影片仍佔滿一屏，但那是版型不是動態）。
 * 實作靠一個閘門：Subpage.vue 的 onMounted 在 flow 條件下直接 return，什麼 GSAP 都不接。
 *
 * 這支測兩件事：
 * ① shouldRunStage 的真值表。
 * ② **JS 的斷點與 SCSS 的斷點是同一個數字**。這條對帳是本次改動最容易靜默壞掉的地方 ——
 *    版型的 flow/pin 分界寫在 SCSS 的 `rwd-min('tablet')`，動態的分界寫在 JS 的閘門，
 *    兩把尺一旦分岔就會出現「JS 建了 pin、CSS 套 flow 版型」的破版，而且只在那個
 *    斷點附近的視窗寬度才看得到。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { shouldRunStage } from '../app/utils/subpage-stage-beats';
import { TABLET_BREAKPOINTS } from '../app/utils/constants';

// vitest 沒設 alias（見 vitest.config.ts），故相對路徑 import；檔案路徑相對 cwd（＝專案根）。
const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

/**
 * 剝掉註解再比對。
 *
 * ⚠️ 非做不可：本專案的註解密度很高，而「這裡**不准**出現 X」這種反向斷言會被
 *    「解釋為什麼不准出現 X」的註解本身命中 —— 第一版就是這樣假紅的（註解裡提到
 *    `window.innerWidth` 與 `rwd-max(376px)`）。只剝整行 `//` 與 `/* *\/` 區塊，
 *    夠涵蓋本專案的註解寫法，也不會誤動字串裡的 `//`（如網址）。
 */
const stripComments = (src: string) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');

describe('shouldRunStage', () => {
  it('兩個條件都不成立 → 跑舞台（≥768 的一般情況）', () => {
    expect(shouldRunStage({ reducedMotion: false, narrow: false })).toBe(true);
  });

  it('<768 → 不跑舞台（手機版走 flow）', () => {
    expect(shouldRunStage({ reducedMotion: false, narrow: true })).toBe(false);
  });

  it('reduced-motion → 不跑舞台（原有的降級路徑）', () => {
    expect(shouldRunStage({ reducedMotion: true, narrow: false })).toBe(false);
  });

  it('兩者同時成立 → 不跑舞台', () => {
    expect(shouldRunStage({ reducedMotion: true, narrow: true })).toBe(false);
  });
});

describe('flow/pin 分界的兩把尺要對得上', () => {
  it('SCSS 的 tablet 斷點 === TABLET_BREAKPOINTS', () => {
    const mixins = read('app/assets/styles/mixins.scss');
    const m = mixins.match(/'tablet':\s*(\d+)px/);
    expect(m, "mixins.scss 找不到 $breakpoints 的 'tablet'").toBeTruthy();
    expect(Number(m![1])).toBe(TABLET_BREAKPOINTS);
  });

  it('Subpage.vue 的閘門用 TABLET_BREAKPOINTS 組 media query，不用寫死數字或 innerWidth', () => {
    const code = stripComments(read('app/components/05.subpage/Subpage.vue'));
    // 閘門必須以常數組出 max-width，否則就是另一把尺
    expect(code).toMatch(/max-width:\s*\$\{TABLET_BREAKPOINTS\s*-\s*0\.02\}px/);
    // innerWidth 含傳統捲軸寬、CSS media query 不含 ⇒ 邊界有 1～15px 的不一致區間，
    // 那個區間裡 JS 會建 pin 而 CSS 已套 flow 版型。本元件不得用它判斷斷點。
    expect(code).not.toMatch(/innerWidth/);
  });
});

describe('引言在 flow 版型下不被裁切', () => {
  const code = stripComments(read('app/components/05.subpage/Subpage.vue'));

  it('<768 的引言沒有 min-height：自然撐高，最長的引言不會被錨點列蓋住', () => {
    // `.subpage__intro` 的基底（＝ <768）不得出現 min-height；一屏高只給 rwd-min('tablet')。
    const block = code.match(/\.subpage__intro \{[\s\S]*?\n\}/)?.[0] ?? '';
    expect(block, '找不到 .subpage__intro 規則').not.toBe('');
    const base = block.split("@include rwd-min('tablet')")[0] ?? '';
    expect(base).not.toMatch(/min-height/);
    expect(base).toMatch(/padding:\s*16px 0 64px/); // 稿值：上 16 下 64
  });

  it('已刪掉 ≤376px 的縮字級 —— 它的前提（pin 舞台 overflow 裁切）在 flow 下不存在', () => {
    expect(code).not.toMatch(/@include\s+rwd-max\(376px\)/);
  });

  it('<768 的引言字級 = 稿值 24/44（同上，字級也在基底）', () => {
    const block = code.match(/\.subpage__intro-text \{[\s\S]*?\n\}/)?.[0] ?? '';
    const base = block.split("@include rwd-min('tablet')")[0] ?? '';
    expect(base).toMatch(/font-size:\s*24px/);
    expect(base).toMatch(/line-height:\s*44px/);
  });
});

describe('手機版的滿版媒體不蓋 header／底部錨點列', () => {
  /**
   * `.intro-media--fill` 的 `z-index: 1100` ＋ `pointer-events: none` 必須關在
   * `rwd-min('tablet')` 內。
   *
   * ⚠️ 為什麼值得一支測試：這是**靜默**的。flow 版型（<768）沒有 pin ⇒ 從 `.intro-media`
   *    一路到 body 都沒有疊層脈絡把 1100 關住（實測逐層確認過），所以那組一旦漏到基底，
   *    滿版照片捲過頂條時 header（1000）與底部錨點列（960）會消失約一屏 —— 不報錯、
   *    只有在那一屏捲動途中才看得到。
   */
  it('1100 與 pointer-events: none 只出現在 rwd-min(tablet) 區塊內', () => {
    const code = stripComments(
      read('app/components/05.subpage/SubpageIntroMedia.vue'),
    );
    const fill = code.match(/&--fill \{[\s\S]*?\n {2}\}/)?.[0] ?? '';
    expect(fill, '找不到 .intro-media 的 &--fill 規則').not.toBe('');

    const base = fill.split("@include rwd-min('tablet')")[0] ?? '';
    expect(base, 'z-index 漏在基底 ⇒ <768 會蓋掉 header').not.toMatch(/z-index/);
    expect(base, 'pointer-events 漏在基底').not.toMatch(/pointer-events/);

    // 而 ≥768 仍要抬得起來（pin 版型的降級路徑靠它）
    const tablet = fill.split("@include rwd-min('tablet')")[1] ?? '';
    expect(tablet).toMatch(/z-index:\s*1100/);
    expect(tablet).toMatch(/pointer-events:\s*none/);
  });
});
