import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 夥伴清單面板（`.blessing-partners` 的內卷軸）**全程可以接到指標事件**。
//
// ── 這條規則在守什麼 ──────────────────────────────────────────────────
// `.section3__partners` 的 margin-top 是負值（(--face-block-h − 100vh) / 2），會把整塊
// 往上疊進 `.section3__face-track` 的最後 (100vh − --face-block-h) / 2 px；而面板本身
// 在塊內從 padding-top ＋ 階梯線 ＋ gap 之後才開始。兩者相減若為正，面板的**頂端**
// 就落在 face-track 的box 裡面 —— 而 face-track 是 position: relative、裡面的
// `.section3__face-screen` 是 position: sticky，兩者都是 positioned 且 DOM 在前。
//
// 於是只要 `.section3__partners` 是 `static`，它就依繪製順序落在那兩個 positioned
// 兄弟**之下**，面板頂端那一條的 hit test 全部命中 face-screen：
// face-screen 那一段是空的、沒有背景 ⇒ 面板看起來完全正常，但手指／滾輪在那條帶子上
// 完全捲不動內卷軸（事件被判成捲頁面）。**失敗方向是靜默的**。
//
// 2026-08-23 實測（834×1120，＝ iPad Pro 11" 二代直立在 Safari 的可視高）：
//   is-held false → position: static → 面板頂端 107px 的 elementFromPoint
//   命中 `.section3__face-screen`；把塊改成 positioned 後 4/4 命中面板。
//
// ── 為什麼是「有時候」──────────────────────────────────────────────
//   `.is-held`（Blessing.vue 的 syncPartnersHeld）條件 ＝ 塊高 1044 ≤ --vh − 83
//     ⇒ 需要 --vh ≥ 1127
//   死區存在        ＝ (--vh − 598) / 2 − 154 > 0  ⇒ 需要 --vh > 906
//   交集 906 < --vh < 1127 才會中獎 —— iPad Pro 11"／10.5" 直立正好落在裡面，
//   12.9" 二代直立（--vh ≈ 1252–1292）會 is-held 所以沒事，橫置則死區為 0。
//   同一台機轉個方向就不重現，所以現場回報一律是「有時候」。
//
// ── 兩層防線 ──────────────────────────────────────────────────────────
//  ① 根因：`.section3__partners` 基底就是 positioned（`.is-held` 只把它換成 sticky）。
//     這也是 Blessing.vue template 裡橘幕那條 ⚠️ 的前提（「後面的兄弟都是 positioned
//     （relative / sticky），依樹序畫在它之上」）—— static 其實打破了那個假設，
//     連帶讓 fixed 的 `.section3__veil` 在不 held 的機器上蓋過夥伴清單。
//  ② 縱深：臉屏那層信箱式的空白不吃指標事件（pointer-events: none），
//     但內容要留著（`.section3__face-inner` 收回 auto），否則標題／引言不能選取。
//     臉屏的空白區恆等於「inner 上下各 (100vh − --face-block-h) / 2」，
//     與重疊區完全同一塊 ⇒ 放行 inner 不會把死區放回來。

const SRC = readFileSync(
  join('app', 'components', '03.blessing', 'Blessing.vue'),
  'utf8',
);

/** 剝掉 `//` 行註解與 `/* *\/` 區塊註解 —— 註解裡的大括號會弄壞下面的配對。 */
const stripComments = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');

const CSS = stripComments(SRC);

/** 取出某個頂層選擇器的規則區塊內容（含巢狀）。找不到回空字串。 */
const ruleBody = (selector: string): string => {
  const at = CSS.indexOf(`\n${selector} {`);
  if (at < 0) return '';
  let i = CSS.indexOf('{', at);
  let depth = 0;
  const start = i + 1;
  for (; i < CSS.length; i++) {
    if (CSS[i] === '{') depth++;
    else if (CSS[i] === '}' && --depth === 0) return CSS.slice(start, i);
  }
  return '';
};

/** 只留基底宣告：巢狀的 `&.x { … }` / `@include rwd-max(…) { … }` 整組挖掉。 */
const baseDecls = (body: string): string => {
  let depth = 0;
  let out = '';
  for (const ch of body) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (depth === 0) out += ch;
  }
  return out;
};

const base = (selector: string): string => baseDecls(ruleBody(selector));

describe('夥伴清單面板全程接得到指標事件', () => {
  it('守門員：四個選擇器都真的抓到了', () => {
    for (const sel of [
      '.section3__partners',
      '.section3__face-screen',
      '.section3__face-inner',
    ]) {
      expect(ruleBody(sel), `Blessing.vue 找不到 ${sel} 的規則區塊`).not.toBe(
        '',
      );
    }
  });

  it('.section3__partners 基底就是 positioned（不能只在 .is-held 才是）', () => {
    const decls = base('.section3__partners');
    const pos = decls.match(/position:\s*([a-z-]+)/)?.[1];
    expect(
      pos,
      '.section3__partners 基底沒有 position —— 它是 static，會被 face-track / veil 蓋掉頂端',
    ).toBeDefined();
    expect(pos).not.toBe('static');
  });

  it('.is-held 仍然是 sticky ＋ top: var(--header-height)（閱讀定格行為不變）', () => {
    const held = ruleBody('.section3__partners').match(
      /&\.is-held\s*\{([^}]*)\}/,
    )?.[1];
    expect(held, '.section3__partners 裡找不到 &.is-held').toBeDefined();
    expect(held).toMatch(/position:\s*sticky/);
    expect(held).toMatch(/top:\s*var\(--header-height\)/);
  });

  it('.section3__face-screen 的空白不吃指標事件', () => {
    expect(base('.section3__face-screen')).toMatch(
      /pointer-events:\s*none/,
    );
  });

  it('.section3__face-inner 把指標事件收回來（標題／引言要能選取）', () => {
    expect(base('.section3__face-inner')).toMatch(/pointer-events:\s*auto/);
  });
});
