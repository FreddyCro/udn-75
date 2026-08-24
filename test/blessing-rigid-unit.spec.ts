import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'vue/compiler-sfc';
import type { ElementNode, TemplateChildNode } from '@vue/compiler-core';
import {
  BLESSING_PARTNERS_HOLD_VH,
  BLESSING_VH,
  blessingUnitTrackHeight,
} from '../app/utils/orange-core-config';

// 「臉屏與夥伴清單的相對位置全程固定」這件事，靠的是**兩塊住在同一個元素裡**
// （`.section3__unit`，本檔稱剛體）＋ 一次手動 pin，而不是兩個各自 sticky 的兄弟。
//
// ── 改版前為什麼會分家 ────────────────────────────────────────────────
// 舊版 `.section3__face-screen`（sticky top: 0）與 `.section3__partners`（sticky
// top: header）是兄弟，各自咬合：
//   ① 逐格臉期間：臉屏定住、清單還在下方以捲動速度逼近 → 只有 progress 1 那一刻
//      兩者才對齊（靠 opacity 0 遮住整段逼近過程）
//   ③ 閱讀定格期間：清單定住、臉繼續往上跑掉
// 「其中一個會先滑走」講的就是這兩段。
//
// ── 為什麼不能只換成一個 sticky ───────────────────────────────────────
// 併成一塊之後仍需要兩個**不同**的錨點（① 臉在畫面正中、③ 清單頂貼 header），
// 而一個元素只有一個 sticky 錨點；同一個元素也不能被兩條 ScrollTrigger 各 pin 一次
// （兩個 pin-spacer 會打架）。所以是手動 pin：窗口內 fixed、窗口外 absolute 停在
// 軌道兩端（top: 0 / bottom: 0）。
//
// ── 本檔守什麼 ────────────────────────────────────────────────────────
//  ① 剛體真的是一塊：臉屏與清單都在 `.section3__unit` 的子樹裡。
//     拆回兄弟 → 相對位置又會隨捲動變動，而且**沒有任何測試會紅**，只有肉眼看得出來。
//  ② 定格不在清單自己身上（`.section3__partners` 不得再出現 sticky）。
//  ③ 五個 pin 狀態齊全，兩個定格是 fixed。
//  ④ 量尺（`.section3__ruler`）不佔流內高度 —— 佔了的話本段會憑空多出 (1+1.2) 個
//     視窗高，下游 media 全部位移。
//  ⑤ 軌道高度與改版前的流內高度**逐 px 相等** —— 這是「scrub 事件不變」的實質保證：
//     `.section3` 總高不變 ⇒ outroST 的 start／end 與 media 的 pin 起點零位移。

const SRC = readFileSync(
  join('app', 'components', '03.blessing', 'Blessing.vue'),
  'utf8',
);

/* ── 版面結構 ─────────────────────────────────────────────────────── */

const isElement = (node: TemplateChildNode): node is ElementNode =>
  node.type === 1;

/** 深度優先找第一個符合 `match` 的元素節點。 */
const findEl = (
  nodes: TemplateChildNode[],
  match: (el: ElementNode) => boolean,
): ElementNode | null => {
  for (const node of nodes) {
    if (!isElement(node)) continue;
    if (match(node)) return node;
    const hit = findEl(node.children, match);
    if (hit) return hit;
  }
  return null;
};

/** 元素的靜態 class（`class="…"`，不含 `:class`）。 */
const staticClass = (el: ElementNode): string => {
  const attr = el.props.find((p) => p.type === 6 && p.name === 'class');
  return attr && attr.type === 6 ? (attr.value?.content ?? '') : '';
};

/** 元素的 `ref="…"`。 */
const refName = (el: ElementNode): string => {
  const attr = el.props.find((p) => p.type === 6 && p.name === 'ref');
  return attr && attr.type === 6 ? (attr.value?.content ?? '') : '';
};

const template = parse(SRC).descriptor.template;

describe('祝福段的剛體：臉屏與夥伴清單住在同一塊', () => {
  it('守門員：template 解得開', () => {
    expect(template?.ast?.children.length).toBeGreaterThan(0);
  });

  it('臉屏與夥伴清單都在 .section3__unit 的子樹裡', () => {
    const roots = template?.ast?.children ?? [];
    const unit = findEl(roots, (el) =>
      staticClass(el).split(/\s+/).includes('section3__unit'),
    );
    expect(unit, 'template 找不到 .section3__unit（剛體）').not.toBeNull();

    const screen = findEl(unit!.children, (el) =>
      staticClass(el).split(/\s+/).includes('section3__face-screen'),
    );
    const partners = findEl(unit!.children, (el) =>
      staticClass(el).split(/\s+/).includes('section3__partners'),
    );
    expect(
      screen,
      '臉屏不在剛體裡 —— 兩塊又變成兄弟，相對位置會隨捲動變動',
    ).not.toBeNull();
    expect(
      partners,
      '夥伴清單不在剛體裡 —— 兩塊又變成兄弟，相對位置會隨捲動變動',
    ).not.toBeNull();
  });

  it('量尺是獨立元素、不包任何內容（faceST 的幾何與版面脫鉤）', () => {
    const roots = template?.ast?.children ?? [];
    const ruler = findEl(roots, (el) =>
      staticClass(el).split(/\s+/).includes('section3__ruler'),
    );
    expect(ruler, 'template 找不到 .section3__ruler').not.toBeNull();
    expect(refName(ruler!), '量尺必須是 faceST 的 trigger（trackRef）').toBe(
      'trackRef',
    );
    expect(
      ruler!.children.length,
      '量尺不該裝東西 —— 它只提供「上緣＋高度」這組幾何',
    ).toBe(0);
  });
});

/* ── 樣式 ─────────────────────────────────────────────────────────── */

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

/** 套用在 `&.x` 上的所有宣告（含 `&.a, &.b { … }` 這種共用群組）。
 *  只抓單一 modifier 的第一個區塊是不夠的：本檔要驗的 right / left 就寫在群組裡。 */
const nested = (selector: string, modifier: string): string => {
  const body = ruleBody(selector);
  let out = '';
  for (const [, head, decls] of body.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const applies = head
      .split(',')
      .some((s) => s.trim() === `&.${modifier}`);
    if (applies) out += decls;
  }
  return out;
};

describe('祝福段的剛體：pin 狀態', () => {
  it('量尺是絕對定位（不佔流內高度）', () => {
    expect(ruleBody('.section3__ruler')).toMatch(/position:\s*absolute/);
  });

  it('軌道是 positioned（剛體要以它為定位基準）', () => {
    expect(ruleBody('.section3__unit-track')).toMatch(/position:\s*relative/);
  });

  it('五個狀態齊全，兩個定格是 fixed、兩端是 absolute', () => {
    expect(nested('.section3__unit', 'is-enter')).toMatch(
      /position:\s*absolute/,
    );
    expect(nested('.section3__unit', 'is-pin-face')).toMatch(
      /position:\s*fixed/,
    );
    expect(nested('.section3__unit', 'is-transit')).toMatch(
      /position:\s*absolute/,
    );
    expect(nested('.section3__unit', 'is-pin-list')).toMatch(
      /position:\s*fixed/,
    );
    expect(nested('.section3__unit', 'is-exit')).toMatch(/position:\s*absolute/);
  });

  it('③ 的錨點吃 --unit-hold-top、④ 停在軌道下緣（bottom: 0）', () => {
    expect(nested('.section3__unit', 'is-pin-list')).toMatch(
      /top:\s*var\(--unit-hold-top/,
    );
    expect(nested('.section3__unit', 'is-exit')).toMatch(/bottom:\s*0/);
  });

  it('夥伴清單自己不再定格（否則臉又會單獨滑走）', () => {
    expect(
      ruleBody('.section3__partners'),
      '.section3__partners 又出現 sticky —— 閱讀定格必須整個剛體一起做',
    ).not.toMatch(/position:\s*sticky/);
  });

  it('臉屏也不再 sticky（定格改由剛體整塊做）', () => {
    expect(ruleBody('.section3__face-screen')).not.toMatch(
      /position:\s*sticky/,
    );
  });
});

/* ── 軌道高度 ─────────────────────────────────────────────────────── */

/** 改版前 `.section3` 的流內高度：face-track ＋ 清單（含負 margin）＋ 定格 spacer。 */
const legacyHeight = (
  vh: number,
  faceBlockH: number,
  partnersH: number,
  held: boolean,
): number =>
  (1 + BLESSING_VH) * vh +
  (faceBlockH / 2 - vh / 2 + partnersH) +
  (held ? BLESSING_PARTNERS_HOLD_VH : 0) * vh;

/** 剛體高：臉屏一個視窗高 ＋ 清單（同一條負 margin）。 */
const unitHeight = (vh: number, faceBlockH: number, partnersH: number): number =>
  vh + (faceBlockH / 2 - vh / 2) + partnersH;

describe('剛體軌道的高度＝改版前的流內高度', () => {
  // 三個斷點的實測值（見 Blessing.vue 與 BlessingPartners.vue 的稿高註解）
  const CASES = [
    { name: 'pc  1440×900', vh: 900, faceBlockH: 280, partnersH: 778 },
    { name: 'pad 834×1112', vh: 1112, faceBlockH: 598, partnersH: 1044 },
    { name: 'mob 390×667', vh: 667, faceBlockH: 500, partnersH: 769 },
  ];

  for (const c of CASES) {
    for (const held of [true, false]) {
      it(`${c.name}${held ? '（定格）' : '（不定格）'}`, () => {
        expect(
          blessingUnitTrackHeight(
            unitHeight(c.vh, c.faceBlockH, c.partnersH),
            c.vh,
            held,
          ),
        ).toBeCloseTo(
          legacyHeight(c.vh, c.faceBlockH, c.partnersH, held),
          6,
        );
      });
    }
  }

  it('不定格時軌道剛好短一個 BLESSING_PARTNERS_HOLD_VH', () => {
    const u = unitHeight(900, 280, 778);
    expect(blessingUnitTrackHeight(u, 900, true)).toBe(
      blessingUnitTrackHeight(u, 900, false) + BLESSING_PARTNERS_HOLD_VH * 900,
    );
  });
});
