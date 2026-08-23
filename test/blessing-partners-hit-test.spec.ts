import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 夥伴清單面板（`.blessing-partners` 的內卷軸）**全程可以接到指標事件**。
//
// ── 這條規則在守什麼 ──────────────────────────────────────────────────
// `.section3__partners` 的 margin-top 是負值（(--face-block-h − 100vh) / 2），會把整塊
// 往上疊進 `.section3__face-screen` 的最後 (100vh − --face-block-h) / 2 px；而面板本身
// 在塊內從 padding-top ＋ 階梯線 ＋ gap 之後才開始。兩者相減若為正，面板的**頂端**
// 就落在臉屏的 box 裡面 —— 而臉屏是 position: relative 且 DOM 在前。
//
// 於是只要 `.section3__partners` 是 `static`，它就依繪製順序落在臉屏**之下**，
// 面板頂端那一條的 hit test 全部命中 face-screen：
// face-screen 那一段是空的、沒有背景 ⇒ 面板看起來完全正常，但手指／滾輪在那條帶子上
// 完全捲不動內卷軸（事件被判成捲頁面）。**失敗方向是靜默的**。
//
// 2026-08-23 實測（834×1120，＝ iPad Pro 11" 二代直立在 Safari 的可視高）：
//   is-held false → position: static → 面板頂端 107px 的 elementFromPoint
//   命中 `.section3__face-screen`；把塊改成 positioned 後 4/4 命中面板。
//
// ── 當時為什麼是「有時候」，現在為什麼是「一定」──────────────────────
//   當時要同時滿足兩件事才中獎：
//     `.is-held` 不成立（塊高 1044 ≤ --vh − 83 ⇒ --vh ≥ 1127 才會 held）
//     死區為正   ((--vh − 598) / 2 − 154 > 0 ⇒ --vh > 906)
//   交集 906 < --vh < 1127 —— iPad Pro 11"／10.5" 直立正好落在裡面，12.9" 二代直立
//   會 held 所以沒事，橫置則死區為 0。同一台機轉個方向就不重現。
//
//   2026-08-23（剛體改版）之後 `.is-held` 那個逃生口沒有了：閱讀定格改由整個剛體
//   （`.section3__unit`）做，`.section3__partners` 恆為 relative。重疊區也不再受
//   定格與否影響，恆等於 (100vh − --face-block-h) / 2 —— 也就是說，只要有人把
//   base 改回 static，**每一台**都會中，不再是「有時候」。
//
// ── 兩層防線 ──────────────────────────────────────────────────────────
//  ① 根因：`.section3__partners` 基底就是 positioned。
//     這也是 Blessing.vue template 裡橘幕那條 ⚠️ 的前提（「後面的兄弟都是 positioned，
//     依樹序畫在它之上」）—— static 其實打破了那個假設，連帶讓 fixed 的
//     `.section3__veil` 蓋過夥伴清單。
//  ② 縱深：臉屏那層信箱式的空白不吃指標事件（pointer-events: none），
//     但內容要留著（`.section3__face-inner` 收回 auto），否則標題／引言不能選取。
//     臉屏的空白區恆等於「inner 上下各 (100vh − --face-block-h) / 2」，
//     與重疊區完全同一塊 ⇒ 放行 inner 不會把死區放回來。
//     剛體本身（`.section3__unit`）同樣是 pointer-events: none —— 它是一整塊比視窗
//     還高的透明盒子，定格期間鋪滿畫面，絕不該接到事件。
//
// 剛體的結構與 pin 狀態由 test/blessing-rigid-unit.spec.ts 守著。

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

  it('.section3__partners 基底就是 positioned', () => {
    const decls = base('.section3__partners');
    const pos = decls.match(/position:\s*([a-z-]+)/)?.[1];
    expect(
      pos,
      '.section3__partners 基底沒有 position —— 它是 static，會被臉屏／veil 蓋掉頂端',
    ).toBeDefined();
    expect(pos).not.toBe('static');
  });

  it('剛體本身不吃指標事件（縱深防線 ②）', () => {
    expect(
      base('.section3__unit'),
      '.section3__unit 是鋪滿畫面的透明盒子，必須 pointer-events: none',
    ).toMatch(/pointer-events:\s*none/);
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
