import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import common from '../app/locales/common.json';
import { SUBPAGE_HEADER_ANCHOR } from '../app/utils/constants';
import { anchorLanding, anchorOffsetVh } from '../app/utils/anchor-landing';
import {
  BLESSING_ANCHOR_VH,
  BLESSING_HOLD,
  BLESSING_VH,
  blessingFrameAt,
} from '../app/utils/orange-core-config';
import { FACE_FRAME_COUNT } from '../app/utils/blessing-face-frames';

describe('SUBPAGE_HEADER_ANCHOR', () => {
  // 對不上的話，子頁 header 的 active 底線會靜默消失（activeTarget 比不到任何一個錨點）。
  it('必須是 headerAnchors 其中一個 target', () => {
    const targets = common.headerAnchors.map((a) => a.target);
    expect(targets).toContain(SUBPAGE_HEADER_ANCHOR);
  });
});

// ── 錨點的落點 ────────────────────────────────────────────────────────────
// 失敗方向同樣是**靜默的**：按了錨點頁面照樣捲、只是停在錯的地方（早一格、或被
// header 蓋掉段落開頭），沒有任何東西壞掉喊出來。

describe('anchorLanding（錨點落點）', () => {
  const HEADER = 60;
  const VH = 900;

  it('沒宣告深度的錨點落在段落上緣，並扣掉 header', () => {
    const { top } = anchorLanding({
      elementTop: 5000,
      headerOffset: HEADER,
      offsetVh: 0,
      vh: VH,
    });
    expect(top).toBe(5000 - HEADER);
  });

  // header 扣不扣是這支函式唯一的分支，也是最容易被「順手補上」而壞掉的地方：
  // 宣告了深度的落點是一屏 sticky 動畫裡的某一刻（畫面本來就滿版、header 疊在上面），
  // 扣掉會讓落點往前退一個 header 高 —— 對 #blessing 剛好足以退回前一格。
  it('宣告了深度的錨點往段落內走，且**不**扣 header', () => {
    const { top } = anchorLanding({
      elementTop: 5000,
      headerOffset: HEADER,
      offsetVh: 1.02,
      vh: VH,
    });
    expect(top).toBe(5000 + 1.02 * VH);
  });

  // Nuxt 的 scrollBehavior 只吃 scroll-margin-top（見 Hero 的 scrollToInitialHash），
  // 兩個欄位必須是同一個落點的兩種寫法，否則跨頁導航與就地捲動會停在不同位置。
  it('scroll-margin-top 與落點是同一件事', () => {
    for (const offsetVh of [0, 1.02]) {
      const { top, scrollMarginTop } = anchorLanding({
        elementTop: 5000,
        headerOffset: HEADER,
        offsetVh,
        vh: VH,
      });
      expect(5000 - scrollMarginTop).toBe(top);
    }
  });

  it('讀不到宣告（沒寫／拼錯）就退回段落上緣，不是 NaN', () => {
    expect(anchorOffsetVh(undefined)).toBe(0);
    expect(anchorOffsetVh('')).toBe(0);
    expect(anchorOffsetVh('abc')).toBe(0);
    expect(anchorOffsetVh('1.02')).toBe(1.02);
  });
});

describe('#blessing 的落點（設計師：第一顆笑臉逐格走完的那一刻）', () => {
  // 深度是從 `.section3` 上緣起算，而臉的捲動尺就從那裡開始（見 BLESSING_ANCHOR_VH
  // 的 ⚠️），故落點換算成 blessing 軌的進度就是 深度 ÷ BLESSING_VH。
  const p = BLESSING_ANCHOR_VH / BLESSING_VH;

  it('落在逐格臉的最後一格', () => {
    expect(blessingFrameAt(p)).toBe(FACE_FRAME_COUNT - 1);
  });

  // 落點是實際捲動位置，會被 --vh 與四捨五入推動幾 px；停格的起點離「最後一格開始」
  // 還有 0.05 個進度（≈ 半個 header 高），前後都要還在最後一格上。
  it('前後各有餘裕，抖幾 px 不會退回前一格', () => {
    expect(blessingFrameAt(p - 0.04)).toBe(FACE_FRAME_COUNT - 1);
    expect(blessingFrameAt(p + 0.1)).toBe(FACE_FRAME_COUNT - 1);
  });

  it('不可越過捲動尺尾端（那之後夥伴清單就淡入了，臉已經捲掉）', () => {
    expect(p).toBeLessThan(1);
    // closeTo 而非 toBe：BLESSING_VH × (1 − HOLD) ÷ BLESSING_VH 在 IEEE754 下是
    // 0.8500000000000001。差在第 16 位小數，落點上是不存在的距離。
    expect(p).toBeCloseTo(1 - BLESSING_HOLD, 10);
  });
});

describe('blessingFrameAt（逐格臉的格號）', () => {
  it('起點是第 0 格（那一格是白方塊，與覆蓋過場交棒）', () => {
    expect(blessingFrameAt(0)).toBe(0);
  });

  it('尾端 BLESSING_HOLD 這段停在最後一格', () => {
    expect(blessingFrameAt(1 - BLESSING_HOLD)).toBe(FACE_FRAME_COUNT - 1);
    expect(blessingFrameAt(1)).toBe(FACE_FRAME_COUNT - 1);
  });

  it('整段單調不倒退，且每一格都會被走到（逐格＝不可跳格）', () => {
    const seen = new Set<number>();
    let prev = 0;
    for (let i = 0; i <= 2000; i++) {
      const f = blessingFrameAt(i / 2000);
      expect(f).toBeGreaterThanOrEqual(prev);
      prev = f;
      seen.add(f);
    }
    expect(seen.size).toBe(FACE_FRAME_COUNT);
  });

  it('定義域外夾住（scrub 會餵進 0..1 之外的值）', () => {
    expect(blessingFrameAt(-1)).toBe(0);
    expect(blessingFrameAt(2)).toBe(FACE_FRAME_COUNT - 1);
  });
});

// ── 錨點文字的稿字形素材 ──────────────────────────────────────────────────
// 三顆錨點在稿上是 outline 過的 vector：pc 是錨點列（AppHeaderNav），
// menu 是 <1280 的漢堡選單（AppHeaderMenu，mob／pad 共用同一份）。
//
// 這支守的是「素材與資料對得上」，因為失敗方向是**靜默的**：畫面上的字完全來自
// mask（顏色 currentColor、形狀是素材），缺檔只會讓那顆錨點變成一片空白 ——
// 連結還在、真文字也還在無障礙樹裡，肉眼要盯著 header 才看得出來。
// w／h 掛在 inline style 上當盒子的寬高，與素材畫布不一致就會把字壓扁或拉長。

/** 從 SVG 取畫布尺寸：優先 viewBox，退回 width/height 屬性（同 forum-text-art.spec.ts） */
const svgSize = (src: string): { w: number; h: number } => {
  const vb = src.match(/viewBox="([\d.\s-]+)"/);
  if (vb?.[1]) {
    const nums = vb[1].trim().split(/\s+/).map(Number);
    return { w: nums[2]!, h: nums[3]! };
  }
  return {
    w: Number(src.match(/\bwidth="([\d.]+)"/)?.[1]),
    h: Number(src.match(/\bheight="([\d.]+)"/)?.[1]),
  };
};

const SLOTS = ['pc', 'menu'];

const entries = common.headerAnchors.flatMap((a) =>
  Object.entries(a.art ?? {}).map(([slot, src]) => ({ title: a.title, slot, src })),
);

describe('header 錨點的稿字形素材', () => {
  it('每顆錨點都有 pc 與 menu 兩份（少一份那個版位就變空白）', () => {
    const missing = common.headerAnchors
      .flatMap((a) => SLOTS.filter((s) => !a.art?.[s as keyof typeof a.art]).map((s) => `${a.title} 缺 ${s}`));
    expect(missing).toEqual([]);
  });

  it('版位名稱只能是 pc / menu（拼錯會靜默沒有效果）', () => {
    const bad = entries.filter((e) => !SLOTS.includes(e.slot)).map((e) => `${e.title} → ${e.slot}`);
    expect(bad).toEqual([]);
  });

  it('每顆錨點都有真文字（SR／SEO 的唯一來源，畫面上的字是素材）', () => {
    const empty = common.headerAnchors.filter((a) => a.title.trim().length === 0);
    expect(empty).toEqual([]);
  });

  it.each(entries.map((e) => [`${e.title} ${e.slot}`, e] as const))(
    '%s 的素材與資料對得上',
    (_name, e) => {
      const file = join('public', e.src.src.replace(/^\//, ''));
      expect(existsSync(file), `素材不存在：${file}`).toBe(true);

      const svg = readFileSync(file, 'utf8');
      const size = svgSize(svg);
      expect(size.w).toBeCloseTo(e.src.w, 2);
      expect(size.h).toBeCloseTo(e.src.h, 2);

      // 底線是功能（active／hover 由 CSS 的 ::after 畫、能做 scaleX 動畫），
      // 烤進素材的話會變成「永遠都在的橘線」。稿上的 line 匯出時已拆掉。
      expect(svg, `素材裡還留著底線：${file}`).not.toMatch(/<line\b/);
    },
  );
});
