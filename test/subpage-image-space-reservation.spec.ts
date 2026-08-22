import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 子頁內文圖的「版位保留」守門。
//
// 為什麼需要這支：ScrollTrigger 的 pin start／end 是**量完就固定的絕對捲動座標**。
// 高度由載入後的圖決定（CSS height: auto、沒有 width/height 屬性、沒有 aspect-ratio）
// 的圖，在 lazy 載入前佔 0 高、載入後撐開 —— 那一撐把它下面所有 pin 的實際位置往下推，
// 而 pin 不知道。連續閱讀頁（/subpage）六篇串在一起，症狀就是**下一篇的 hero 以
// position: fixed 疊在上一篇的內文上**（舞台是透明的，白底只在 .subpage__content）。
//
// utils/scroll-trigger 的 refreshOnContentResize() 是守結果的通解（長高了就重算），
// 這支守的是源頭：**讓它一開始就不要長高**。兩道一起才完整 —— 重算再快也是事後補救，
// 補救的那一刻使用者已經看到位移。
//
// 對帳方式沿用 subpage-hero-art-band.spec.ts：把宣告在程式碼裡的比例，與 public/img 下
// **實際素材**的畫布比例比對。素材換了、比例變了而忘了改程式碼，這支會紅。

/** 宣告值與素材實際比例的容許落差 */
const RATIO_TOLERANCE = 0.02;

/* ── 讀素材的畫布尺寸 ─────────────────────────────────────────────── */

/** SVG：優先 viewBox，退回 width/height 屬性（同 subpage-hero-art-band.spec.ts） */
const svgSize = (buf: Buffer): { w: number; h: number } => {
  const src = buf.toString('utf8');
  const vb = src.match(/viewBox="([\d.\s-]+)"/);
  if (vb?.[1]) {
    const n = vb[1].trim().split(/\s+/).map(Number);
    return { w: n[2]!, h: n[3]! };
  }
  const w = src.match(/\swidth="([\d.]+)"/);
  const h = src.match(/\sheight="([\d.]+)"/);
  if (!w || !h) throw new Error('SVG 讀不到尺寸');
  return { w: Number(w[1]), h: Number(h[1]) };
};

/** JPEG：掃到 SOF 標記（0xFFC0–0xFFCF，扣掉非 SOF 的 C4/C8/CC）就有寬高 */
const jpegSize = (buf: Buffer): { w: number; h: number } => {
  let i = 2; // 跳過 SOI
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
      i += 2;
      continue;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error('JPEG 找不到 SOF 標記');
};

const assetSize = (rel: string): { w: number; h: number } => {
  const buf = readFileSync(join('public', rel));
  if (rel.endsWith('.svg')) return svgSize(buf);
  if (rel.endsWith('.jpg') || rel.endsWith('.jpeg')) return jpegSize(buf);
  throw new Error(`不支援的副檔名：${rel}`);
};

const ratioOf = (rel: string) => {
  const { w, h } = assetSize(rel);
  return w / h;
};

const src = (rel: string) => readFileSync(rel, 'utf8');

/** 取某個 selector 的規則區塊（大括號配對，含巢狀的 @include） */
const ruleBlock = (source: string, selector: string): string => {
  const head = source.indexOf(`\n${selector} {`);
  if (head < 0) return '';
  let depth = 0;
  for (let i = source.indexOf('{', head); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(head, i + 1);
  }
  return '';
};

/** 規則區塊裡宣告的所有 aspect-ratio，依出現順序（基底 → 各斷點） */
const declaredRatios = (block: string): number[] =>
  [...block.matchAll(/aspect-ratio:\s*([\d.]+)\s*\/\s*([\d.]+)/g)].map(
    (m) => Number(m[1]) / Number(m[2]),
  );

/* ── ① CSS aspect-ratio：高度不隨素材走的那幾張 ───────────────────── */

const FORMULA = 'app/components/FormulaBlocks.vue';
const VISUAL = 'app/components/05.subpage/articles/VisualArticle.vue';
const SERVICE = 'app/components/05.subpage/articles/ServiceArticle.vue';

describe('CSS 宣告的比例與素材對得上', () => {
  it('FormulaBlocks 中央 logo', () => {
    const declared = declaredRatios(
      ruleBlock(src(FORMULA), '.formula__center-logo'),
    );
    expect(declared).toHaveLength(1);
    expect(declared[0]).toBeCloseTo(
      ratioOf('img/news/udn75_news_title_publishx.svg'),
      2,
    );
  });

  // 桂冠圖表是 UPic 的 pcpad / mob 兩檔，**比例不同**（mob 直式、pcpad 橫式）——
  // 所以只能用 CSS 在 768 斷點切，不能靠 <img> 的 width/height 屬性（那只有一組）。
  // 斷點必須與 UPic 的 pcpad media 對齊：兩者都是 768（mixins 的 bp('tablet')
  // ＝ constants 的 TABLET_BREAKPOINTS）。
  it.each([
    {
      name: 'VisualArticle 桂冠圖表',
      file: VISUAL,
      mob: 'img/visual/udn75_chart06_01_mob.svg',
      pcpad: 'img/visual/udn75_chart06_01_pcpad.svg',
    },
    {
      name: 'ServiceArticle 桂冠圖表',
      file: SERVICE,
      mob: 'img/news/udn75_chart19_01_mob.svg',
      pcpad: 'img/news/udn75_chart19_01_pcpad.svg',
    },
  ])('$name（mob / pcpad 兩檔比例不同，要各自宣告）', ({ file, mob, pcpad }) => {
    const block = ruleBlock(src(file), '.award-chart :deep(.u-pic-img)');
    const declared = declaredRatios(block);
    expect(declared).toHaveLength(2); // 基底(mob) + rwd-min('tablet')(pcpad)
    expect(declared[0]).toBeCloseTo(ratioOf(mob), 2);
    expect(declared[1]).toBeCloseTo(ratioOf(pcpad), 2);
    expect(block).toMatch(/rwd-min\('tablet'\)/);
  });
});

/* ── ② width/height 屬性：單一比例的那幾張 ────────────────────────── */

describe('width/height 屬性與素材對得上', () => {
  // AiImageQuiz 的兩張圖：稿寬早就寫死在 flex 比例裡（394 / 235），高度補上去而已。
  it('AiImageQuiz 的兩張選項圖', () => {
    const source = src('app/components/AiImageQuiz.vue');
    const sizes = [
      ...source.matchAll(/\{\s*w:\s*(\d+),\s*h:\s*(\d+)\s*\}/g),
    ].map((m) => Number(m[1]) / Number(m[2]));
    expect(sizes).toHaveLength(2);
    expect(sizes[0]).toBeCloseTo(ratioOf('img/visual/udn75_pic05_01.jpg'), 2);
    expect(sizes[1]).toBeCloseTo(ratioOf('img/visual/udn75_pic05_02.jpg'), 2);
  });

  it.each([
    {
      name: 'ServiceArticle 美選觀測並排圖',
      file: SERVICE,
      assets: ['img/service/udn75_pic18_01.jpg', 'img/service/udn75_pic18_02.jpg'],
      re: /:width="(\d+)"\s*\n?\s*:height="(\d+)"/,
    },
    {
      name: 'HealthArticle 得獎圖示',
      file: 'app/components/05.subpage/articles/HealthArticle.vue',
      assets: ['img/health/udn75_pic32_01.svg', 'img/health/udn75_pic32_02.svg'],
      re: /width="(\d+)"\s+height="(\d+)"/,
    },
  ])('$name', ({ file, assets, re }) => {
    const m = src(file).match(re);
    expect(m, '找不到 width/height 宣告').toBeTruthy();
    const declared = Number(m![1]) / Number(m![2]);
    // 同一個版位裡的圖共用一組宣告 → 素材彼此的比例也必須一致
    for (const a of assets) {
      expect(Math.abs(declared - ratioOf(a)) / ratioOf(a)).toBeLessThan(
        RATIO_TOLERANCE,
      );
    }
  });
});
