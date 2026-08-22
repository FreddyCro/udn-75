import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  CONTENT_RESIZE_MAX_WAIT_MS,
  CONTENT_RESIZE_SETTLE_MS,
  settleDelay,
} from '../app/utils/scroll-trigger';

// ScrollTrigger 的 start／end 是**量完就固定的絕對捲動座標**（pin 還會把量到的尺寸寫成
// inline style）。任何在量測之後才發生的版面長高 —— 圖片載入、字體 swap、清單展開 ——
// 都不會讓它自己重算。
//
// 在連續閱讀頁（/subpage）這件事會直接毀版：六篇串在同一份文件裡，上游任何一段長高，
// 下面每一篇 pin 的起點就早了同樣的距離。而舞台是**透明的**（只有 .subpage__content 有
// 白底），提早 pin ＝ 下一篇的 hero 以 position: fixed 蓋在上一篇的內文上，兩篇的字疊在一起。
//
// 實測（390×844，/subpage）：把 service 的內文撐高 600px 之後，data 的 pin-spacer 從
// 26503 移到 27097，但 pin 仍在 26188 就觸發 —— 誤差 909px。冷啟動時 48 張內文圖有 44 張
// 沒有保留尺寸（無 width/height、無 aspect-ratio），長高的量級就是這個等級。
//
// 治法是把「內容高度變了就重算」接起來（refreshOnContentResize）。這支守住它的節流算式：
// 太急會在 0.3s 的展開過渡中連打好幾次全站重算，太鬆則整段捲動都用著錯的尺。

describe('settleDelay（內容高度變動的節流算式）', () => {
  it('剛開始變動時等滿一個 settle 窗口', () => {
    expect(settleDelay(1000, 1000)).toBe(CONTENT_RESIZE_SETTLE_MS);
  });

  it('變動持續發生時每次都把窗口往後推（debounce）', () => {
    // 第一次變動在 1000，此刻 1200 又變一次 → 仍等滿 settle，總共到 1200+settle
    expect(settleDelay(1000, 1200)).toBe(CONTENT_RESIZE_SETTLE_MS);
  });

  it('變動一直不停時不會被無限延後：撞到上限就立刻落定', () => {
    const now = 1000 + CONTENT_RESIZE_MAX_WAIT_MS;
    expect(settleDelay(1000, now)).toBe(0);
  });

  it('接近上限時只等剩下的那一段，不再等滿 settle', () => {
    const now = 1000 + CONTENT_RESIZE_MAX_WAIT_MS - 50;
    expect(settleDelay(1000, now)).toBe(50);
  });

  it('已經超過上限也不吐負值', () => {
    const now = 1000 + CONTENT_RESIZE_MAX_WAIT_MS + 500;
    expect(settleDelay(1000, now)).toBe(0);
  });

  // 上限必須大於 settle，否則 debounce 整段失效（每次都直接落定）。
  it('上限大於 settle 窗口', () => {
    expect(CONTENT_RESIZE_MAX_WAIT_MS).toBeGreaterThan(CONTENT_RESIZE_SETTLE_MS);
  });

  // 展開過渡是 0.3s（SubpageWork 的 .award-work__desc-wrap），settle 要蓋得過它，
  // 否則過渡演到一半就重算一次、演完再重算一次。
  it('settle 窗口蓋得過 0.3s 的列展開過渡', () => {
    expect(CONTENT_RESIZE_SETTLE_MS).toBeGreaterThanOrEqual(300);
  });
});

// 掛在 plugin 而不是某一頁：pin 的起點會被上游長高推走這件事**不是子頁專屬的**。
// 首頁（Hero／Forum／Blessing／FormulaBlocks）與七個獨立子頁（AwardTimeline／
// PhotoPanels）都有同樣結構的 pin，症狀只是沒有「下一篇 hero 疊上來」那麼刺眼而已。
describe('內容高度變動的重算掛在全站', () => {
  const plugin = join('app', 'plugins', 'content-resize-refresh.client.ts');

  it('有 content-resize-refresh plugin 且呼叫了 refreshOnContentResize', () => {
    const src = readFileSync(plugin, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '');
    expect(src).toMatch(/defineNuxtPlugin/);
    expect(src).toMatch(/refreshOnContentResize\s*\(/);
  });

  // 掛兩次不會出事（模組層旗子擋著），但兩個入口＝兩個要維護的地方。
  it('頁面不再各自掛一份', () => {
    const page = readFileSync(join('app', 'pages', 'subpage.vue'), 'utf8')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '');
    expect(page).not.toMatch(/refreshOnContentResize\s*\(/);
  });
});

describe('連續閱讀頁的離場清理', () => {
  // 剝掉註解：下面幾條在找「有沒有寫這段程式碼」，註解裡引用到的字面不算數。
  const src = readFileSync(join('app', 'pages', 'subpage.vue'), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

  // 自己 await document.fonts.ready 沒有離場守衛：字體載入途中換頁的話，
  // 後半段會對著**下一個路由**跑重算與落點校正。單一入口自帶只註冊一次的旗子。
  it('字體重算走 refreshOnFontsReady()，不自己 await document.fonts.ready', () => {
    expect(src).toMatch(/refreshOnFontsReady\s*\(/);
    expect(src).not.toMatch(/await\s+document\.fonts\.ready/);
  });

  // holdLanding／awaitLandingDecision 都是 setTimeout 自我遞迴的迴圈，結束條件是
  // 「使用者動了」或 8 秒／1 秒上限 —— 換頁不在裡面。沒清的話它們會在下一個路由繼續
  // 量 offsetTop、呼叫 window.scrollTo。
  it('離場時清掉落點校正的計時器', () => {
    const unmount = src.slice(src.indexOf('onBeforeUnmount'));
    expect(unmount).toMatch(/clearLandingTimers\s*\(/);
  });

  // 清得掉的前提是每一個計時器都有登記。裸 setTimeout 會繞過 landingTimers，
  // 清理就靜默漏掉一條 —— 只有 later() 自己那行可以呼叫它。
  it('計時器一律走 later() 登記，不留裸 setTimeout', () => {
    const bare = src
      .split('\n')
      .map((line, i) => ({ line: line.trim(), no: i + 1 }))
      .filter(
        ({ line }) =>
          /\bsetTimeout\s*\(/.test(line) && !/^const id = setTimeout\(/.test(line),
      );
    expect(bare.map((b) => `${b.no}: ${b.line}`)).toEqual([]);
  });
});
