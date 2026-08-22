import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import common from '../app/locales/common.json';

// 子頁 hero 藝術字的「字帶」高度守門。
//
// 為什麼需要這支：`.subpage__title-img` / `.subpage__subtitle-img` 只有寬度，
// 高度若不在 CSS 定死，就會由**各檔 SVG 自己的 viewBox 比例**反推 —— 而六頁的
// 匯出稿比例並不一致（title 350×72 ~ 356.124×74.1944、subtitle 781×64 ~ 797×66.57）。
// 於是每頁的文字組總高差到 7px，`hero-inner` 底下的 KV 圖就會跟著上下跳：
// 用右側錨點 rail 一頁一頁切，畫面上就是「每次切換都位移」。
//
// 治法是把字帶比例寫進 CSS（aspect-ratio），讓高度與素材無關；素材各自的比例差
// 交給 SVG 自己的 preserveAspectRatio="xMinYMid" 在字帶內縮放靠左消化。
//
// ⚠️ 稿基準取 news 那組（350×72、797×66）—— 不是隨便挑的，是唯一與版面算式對得上的
//    一組：1280 稿 473.66 − bg 224.3 − gap 80 − 副標 margin 32 = 137.36 ≒ 72 + 65.93；
//    1920 稿 710.49 − 336.45 − 120 − 48 = 206.04 ≒ 108 + 98.87。兩檔都在 1px 內。
// vitest 沒設 alias（見 vitest.config.ts），故相對路徑 import；檔案路徑相對 cwd（＝專案根）。

const SUBPAGE_VUE = join('app', 'components', '05.subpage', 'Subpage.vue');

/** 稿基準字帶比例（w / h），與 SCSS 裡的 aspect-ratio 對帳 */
const SPEC = {
  '.subpage__title-img': { w: 350, h: 72 },
  '.subpage__subtitle-img': { w: 797, h: 66 },
} as const;

/** 素材比例與字帶比例的容許落差：超過就不該再靠 letterbox 硬吞，該回頭對稿 */
const RATIO_TOLERANCE = 0.03;

const source = readFileSync(SUBPAGE_VUE, 'utf8');

/** 取出某個 selector 的規則區塊（大括號配對，含巢狀的 @include / :deep） */
const ruleBlock = (selector: string): string => {
  const head = source.indexOf(`\n${selector} {`);
  if (head < 0) return '';
  let depth = 0;
  for (let i = source.indexOf('{', head); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0)
      return source.slice(head, i + 1);
  }
  return '';
};

/** 從規則區塊讀 aspect-ratio（回傳 w / h 的比值；沒宣告 → null） */
const declaredRatio = (block: string): number | null => {
  const m = block.match(/aspect-ratio:\s*([\d.]+)\s*\/\s*([\d.]+)/);
  return m ? Number(m[1]) / Number(m[2]) : null;
};

/** 從 SVG 取畫布比例：優先 viewBox，退回 width/height 屬性（同 forum-text-art.spec.ts） */
const svgRatio = (src: string): number => {
  const vb = src.match(/viewBox="([\d.\s-]+)"/);
  if (vb?.[1]) {
    const n = vb[1].trim().split(/\s+/).map(Number);
    return n[2]! / n[3]!;
  }
  return (
    Number(src.match(/\bwidth="([\d.]+)"/)?.[1])
    / Number(src.match(/\bheight="([\d.]+)"/)?.[1])
  );
};

// 六頁的主／副標素材：主標路徑來自 common.json 的 subpageAnchors（rail 與 hero 共用同一份
// 檔案），副標則由同一組命名規則推出（..._hero_title.svg → ..._hero_subtitle.svg）——
// hero 的 subtitleImg 寫在各頁的 locales 裡，這裡不逐檔 import，改走命名規則少一份耦合。
const titleImgs = common.subpageAnchors.map((a) => a.titleImg);
const heroArts = [
  ...titleImgs.map((src) => ({ selector: '.subpage__title-img', src })),
  ...titleImgs.map((src) => ({
    selector: '.subpage__subtitle-img',
    src: src.replace('_hero_title.svg', '_hero_subtitle.svg'),
  })),
];

describe('子頁 hero 藝術字的字帶高度與素材無關', () => {
  // 守門員：subpageAnchors 若哪天改形狀，下面的 it.each 會一條都不跑而全綠
  it('六頁的主標素材都在 common.json 裡', () => {
    expect(titleImgs).toHaveLength(6);
  });

  it.each(Object.keys(SPEC))('%s 有宣告 aspect-ratio（否則高度由素材決定）', (sel) => {
    const block = ruleBlock(sel);
    expect(block, `找不到 ${sel} 的規則區塊`).not.toBe('');
    expect(
      declaredRatio(block),
      `${sel} 沒有 aspect-ratio → 字帶高度會由各頁 SVG 的 viewBox 反推，切頁就位移`,
    ).not.toBeNull();
  });

  it.each(Object.entries(SPEC))('%s 的 aspect-ratio 與稿基準相符', (sel, spec) => {
    expect(declaredRatio(ruleBlock(sel))).toBeCloseTo(spec.w / spec.h, 3);
  });

  it.each(heroArts.map((a) => [a.src, a] as const))(
    '%s 的畫布比例落在字帶比例的容許範圍內',
    (_name, art) => {
      const file = join('public', art.src.replace(/^\//, ''));
      expect(existsSync(file), `素材不存在：${file}`).toBe(true);
      const spec = SPEC[art.selector as keyof typeof SPEC];
      const ratio = svgRatio(readFileSync(file, 'utf8'));
      // 落差在容許內 → 字帶內 letterbox 幾乎看不出來；超出 → 素材與稿不同比例，
      // 該改字帶（SPEC 與 SCSS 一起動）而不是放任它在字帶裡縮成小一號。
      expect(Math.abs(ratio / (spec.w / spec.h) - 1)).toBeLessThan(
        RATIO_TOLERANCE,
      );
    },
  );
});
