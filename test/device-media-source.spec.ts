import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getDeviceTypeByResolution } from '../app/utils/get-device';
import { PC_BREAKPOINTS, TABLET_BREAKPOINTS } from '../app/utils/constants';

/**
 * 「該抓哪一支影片／哪一張 poster」的界線守門。
 *
 * 素材界線與版型界線（constants / mixins.scss 的 $breakpoints）同為 pc ≥1280、
 * pad 768–1279。同值不代表可以不測 —— 有三件事會靜默壞掉：
 *   ① 有人把 get-device 的預設挪到別的數字 ⇒ iPad Pro 12.9" 直式（1024×1366）會抓到
 *      pc 的 1920×1080 橫片，再被 `object-fit: cover` 左右各裁掉約六成。
 *   ② 有人拿掉子頁那個 pc-from ⇒ 現在剛好同值看不出來，但它表達的是「對齊版型斷點」
 *      這個獨立理由；哪天 hero 影片換剪輯又把預設挪走，子頁會被連帶拖走。
 *   ③ HeroVideo 的 `object-fit: contain` 斷點與來源界線錯開 ⇒ 1024–1279 拿直片去 cover
 *      （左右被裁）或拿橫片去 contain（上下大白邊）。兩邊必須同時是 1280。
 *
 * ⚠️ 設計師裁決**純寬度切**，不看 orientation。已知並接受的代價：1024–1279 不只有
 *    iPad 直式，也含所有 iPad 橫式（mini 1133×744、Air 1180×820、Pro 11" 1194×834），
 *    後者拿到 pad 的 1024×1364 直片 ＋ contain ⇒ 左右各留 250–280px 白邊
 *    （露出的是 .sec1 白底）。
 */

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

/** 用假的 matchMedia 餵一個視窗寬度：只解析 `(max-width: Npx)` 這一種查詢。 */
const withWidth = (width: number) => {
  (globalThis as unknown as { window: unknown }).window = {
    matchMedia: (q: string) => {
      const m = q.match(/max-width:\s*([\d.]+)px/);
      if (!m) throw new Error(`測試的 matchMedia stub 不認得這個查詢：${q}`);
      return { matches: width <= Number(m[1]) };
    },
  };
};

afterEach(() => {
  delete (globalThis as unknown as { window?: unknown }).window;
});

describe('getDeviceTypeByResolution 的預設界線（hero 影片吃這條）', () => {
  it.each([
    [320, 'mob'],
    [767, 'mob'],
    [768, 'pad'],
    [1023, 'pad'],
    [1024, 'pad'], // ← iPad Pro 12.9" 直式（1024×1366）剛好落在這一格
    [1279, 'pad'],
    [1280, 'pc'],
    [1920, 'pc'],
  ])('%ipx → %s', (width, expected) => {
    withWidth(width);
    expect(getDeviceTypeByResolution()).toBe(expected);
  });

  it('預設值就是版型的 pc 斷點，不是另外寫死的字面值', () => {
    const src = read('app/utils/get-device.ts');
    expect(src).toMatch(/pcFrom: number = PC_BREAKPOINTS/);
    expect(src).toMatch(/import \{ PC_BREAKPOINTS \} from '\.\/constants'/);
  });
});

describe('傳 PC_BREAKPOINTS 時的界線（子頁引言媒體吃這條）', () => {
  // 目前與預設同值；仍獨立測，因為 pcFrom 的管線壞掉時預設那組測試看不出來。
  it.each([
    [767, 'mob'],
    [768, 'pad'],
    [1279, 'pad'],
    [1280, 'pc'],
    [1920, 'pc'],
  ])('%ipx → %s', (width, expected) => {
    withWidth(width);
    expect(getDeviceTypeByResolution(PC_BREAKPOINTS)).toBe(expected);
  });

  // mob 那條線不隨 pcFrom 移動 —— 三組素材的 mob 都是同一條 767。
  it('只動 pad/pc 的分界，mob 的 767 界線不受影響', () => {
    for (const width of [320, 767]) {
      withWidth(width);
      expect(getDeviceTypeByResolution(1024)).toBe('mob');
    }
    withWidth(TABLET_BREAKPOINTS);
    expect(getDeviceTypeByResolution(1024)).toBe('pad');
    withWidth(1024);
    expect(getDeviceTypeByResolution(1024)).toBe('pc');
  });
});

describe('子頁引言媒體確實把界線交出去', () => {
  it('SubpageIntroMedia 的 UVid 傳 pc-from，且傳的是常數不是字面值', () => {
    const src = read('app/components/05.subpage/SubpageIntroMedia.vue');
    expect(src).toMatch(/:pc-from="PC_BREAKPOINTS"/);
    expect(src).toMatch(/import \{ PC_BREAKPOINTS \} from '@\/utils\/constants'/);
  });

  it('UVid 把 pcFrom 一路交到 get-device，且 resize 時用同一個值', () => {
    const src = read('app/components/UVid.vue');
    expect(src).toMatch(/getDeviceTypeByResolution\(props\.pcFrom\)/);
    // 只有一處解析裝置 ⇒ 掛載與 resize 不會用到不同界線
    expect(src.match(/getDeviceTypeByResolution\(/g) ?? []).toHaveLength(1);
  });
});

describe('hero 影片的來源界線與版面界線同步', () => {
  const src = () => read('app/components/01.hero/HeroVideo.vue');

  it('HeroVideo 不傳 pc-from（沿用 get-device 的預設）', () => {
    expect(src()).not.toMatch(/pc-from/);
  });

  it("contain 的斷點用 rwd-max('pc')，與來源界線同一條線", () => {
    // 錯開的話 1024–1279 會拿 pad 的直片去 cover ⇒ 左右被裁掉。
    expect(src()).toMatch(/@include rwd-max\('pc'\) \{/);
    expect(src()).not.toMatch(/@include rwd-max\(1024px\)/);
  });
});
