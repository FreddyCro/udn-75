import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ── 退場翻白的硬切：CSS 那一半 ────────────────────────────────────────────
//
// outroWhiteAt 是二元的（見 blessing-outro.spec.ts），但那只保證「JS 餵進去的量
// 是硬切的」。畫面上會不會硬切，還取決於 CSS 有沒有把它補間掉 —— `.section3`
// 為了藍 → 橘（--cover-orange）帶著一條 `transition: background-color 0.4s ease`，
// 而兩個變化走的是**同一個 background**，補間會連 --outro-white 的硬切一起吃掉。
//
// 為什麼一定要硬切：硬切之所以看不到，前提是「切換那一刻 `.section3__veil` 剛好
// 滿版、完全遮住底色」。補間把那個「一刻」拉成 0.4s，而拍 0 的 FUSE_EASE 頭段很快
// （power2.out）—— 2026-08-22 實測（1440×900，跳進拍 0 的 p≈0.21）：底色從
// oklab(0.730 0.113 0.148) 補到純白整整走完 400ms，而 veil 在**第一幀就已經收到
// 81% 寬**，兩側因此漏出一條還沒轉白的淡橘，接縫上下變成兩種白。
//
// 這條不變量只活在 .vue 檔裡（class binding ＋ SCSS 規則），純函式測不到，所以讀
// 原始碼。三件事缺一不可，任何一件被拿掉，畫面都會靜靜退化回上面那個症狀 ——
// 而且只在捲動夠快時才看得到，靠人眼回歸測試抓不住。
const SRC_PATH = 'app/components/03.blessing/Blessing.vue';

// 註解裡本來就寫著 is-outro 與 transition（見上），不剝掉會自己驗到自己。
// 三種都要剝：/* */、//、<!-- -->（同 design-tokens.spec.ts）。
const stripComments = (src: string) =>
  src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

/** 取出 header 所指的那個 SCSS 區塊（含巢狀），用大括號配對。
 *
 *  header 收 RegExp 而不是選擇器字串：這裡只有兩個固定選擇器要找，用 regex
 *  literal 就不必在字串裡逃逸一次、再被 RegExp 建構子逃逸一次。 */
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

// 「行首（可縮排）＋ 選擇器 ＋ 空白 ＋ `{`」。所以 .section3 不會誤中
// `.section3__veil {`（`__veil` 不是空白也不是大括號），也不會誤中
// `.section3 .section3__title-art {`。
const SECTION3 = /^[ \t]*\.section3\s*\{/m;
const IS_OUTRO = /^[ \t]*&\.is-outro\s*\{/m;

describe('退場翻白必須是硬切（Blessing.vue 的 CSS 這一半）', () => {
  const src = stripComments(readFileSync(SRC_PATH, 'utf8'));
  const section = scssBlock(src, SECTION3);

  it('.section3 的 SCSS 區塊抓得到（下面幾條的前提）', () => {
    expect(section).not.toBe('');
  });

  // 前提條件，不是重複斷言：哪天藍 → 橘不再靠 CSS 補間、這條 transition 被拿掉了，
  // 下面那條 is-outro 就沒有存在意義了 —— 該回來重讀這一整段的推理，而不是照著改。
  it('.section3 帶著 background-color 的補間（is-outro 存在的唯一理由）', () => {
    expect(section).toMatch(/transition:\s*background-color/);
  });

  it('退場期間補間被關掉：.section3 內有 &.is-outro { transition: none }', () => {
    const outro = scssBlock(section, IS_OUTRO);
    expect(outro).not.toBe('');
    expect(outro).toMatch(/transition:\s*none/);
  });

  // 樣式規則寫好了但沒人掛 class 的話，上面兩條照樣綠燈、畫面照樣破。
  // 刻意只比對 `'is-outro': outroWhite` 這組鍵值，不比對整個 :class 物件 ——
  // 之後同一個物件裡多綁別的 class 不該讓這支紅。
  //
  // ⚠️ 測不到的部分：class 有沒有掛在**帶背景的那個根元素**上。掛錯地方時
  //    `&.is-outro` 永遠不會命中，但這支仍會通過。SCSS 那條巢狀在 `.section3`
  //    裡，兩者合起來才是完整的意思。
  it('template 把 is-outro 綁在 outroWhite 上', () => {
    expect(src).toMatch(/'is-outro':\s*outroWhite/);
  });

  // 綁的是 outroWhite 而不是別的量，這件事的另一半由 blessing-outro.spec.ts 的
  // outroWhiteAt 守著：窗口還沒開始時它是 0（class 不掛、補間留著給藍 → 橘用），
  // 三條降級路徑（reduce-motion / #media / 無 JS）也恆為 0。
  it('只有 is-outro 與 reduce-motion 兩處關掉補間，沒有第三個', () => {
    const count = (section.match(/transition:\s*none/g) ?? []).length;
    expect(count).toBe(2);
  });
});
