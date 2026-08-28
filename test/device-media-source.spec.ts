import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getDeviceTypeByResolution } from '../app/utils/get-device';
import { PC_BREAKPOINTS, TABLET_BREAKPOINTS } from '../app/utils/constants';

/**
 * 「該抓哪一支影片／哪一張 poster」的界線守門。
 *
 * 這裡有**兩條不同的界線**，而它們長得很像，正是需要測試的理由：
 *   ・素材界線（~/utils/get-device）—— 預設 pad 768–1023、pc ≥1024。hero 影片的三支
 *     變體就是照這條剪的（見 HeroVideo.vue 的「pad 只涵蓋 768–1023」）。
 *   ・版型界線（constants / mixins.scss 的 $breakpoints）—— pc ≥1280。
 *
 * 子頁引言媒體要吃**版型**那條（2026-08-28 設計師要求：1280 以上才用 pc 版，
 * 768–1279 都用 pad 版），所以它傳 pc-from。兩件事都可能靜默壞掉：
 *   ① 有人為了子頁去改 get-device 的預設 ⇒ hero 影片跟著換界線，1024–1279 的
 *      平板橫向會抓到 pc 那支，而 hero 的 core 定位錨點是按素材尺寸標的。
 *   ② 有人拿掉子頁那個 pc-from ⇒ 768–1279 明明還在 pad 版型裡，卻去抓 pc 那支
 *      1920×1080（service 實測 2.2MB vs pad 1.4MB），而且 poster 也跟著錯。
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
  // 預設不能動：hero 的三支變體是照 768 / 1024 剪的。
  it.each([
    [320, 'mob'],
    [767, 'mob'],
    [768, 'pad'],
    [1023, 'pad'],
    [1024, 'pc'],
    [1920, 'pc'],
  ])('%ipx → %s', (width, expected) => {
    withWidth(width);
    expect(getDeviceTypeByResolution()).toBe(expected);
  });
});

describe('傳 PC_BREAKPOINTS 時的界線（子頁引言媒體吃這條）', () => {
  // 設計師要求：1280 以上才用 pc 版，768–1279 都用 pad 版。
  it.each([
    [767, 'mob'],
    [768, 'pad'],
    [1023, 'pad'], // ← 與預設界線的差別就從這裡開始
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
      expect(getDeviceTypeByResolution(PC_BREAKPOINTS)).toBe('mob');
    }
    withWidth(TABLET_BREAKPOINTS);
    expect(getDeviceTypeByResolution(PC_BREAKPOINTS)).toBe('pad');
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

  it('hero 影片沒有傳 pc-from（維持預設 1024 的素材界線）', () => {
    const src = read('app/components/01.hero/HeroVideo.vue');
    expect(src).not.toMatch(/pc-from/);
  });
});
