import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 帶 ScrollTrigger pin 的頁面不能吃「page」轉場（帶 transform: scale(0.96)）。
//
// 為什麼：app.pageTransition 是 { name: 'page', mode: 'out-in' }，而 out-in 下**新頁在
// enter 一開始就 mount** —— 此刻 .page-enter-active 的 scale(0.96) 還掛在頁面根元素上，
// 於 onMounted 建立的 pin 量到的是縮小 4% 的幾何，並把它**寫成 inline style 鎖住**
// （實測 1440×900：stage 的 width 1425 → 1368、height 900 → 864、pin-spacer 3600 → 3456）。
// 轉場結束、transform 移除，但 inline 尺寸留著 → 內容靜靜停在偏右偏上的位置；直到
// plugins/refresh-scroll-triggers.client.ts 補的那次 refresh 才改對 —— 那一下就是
// 使用者看到的「切換瞬間往左下彈 28.5 / 18px」。
//
// 治法是讓這些頁面吃純 opacity 的 page-fade（無 transform ⇒ pin 一開始就量到對的尺寸）。
// index.vue 早就因為同一個理由這麼做了（見 assets/styles/base.scss 的 .page-fade-* 註解）。
// 這支守的是「別再有新的子頁漏掉這個 override」—— 漏掉的症狀是靜默的：不會報錯，
// 只是切頁時彈一下。

const PAGES_DIR = join('app', 'pages');

const pages = readdirSync(PAGES_DIR)
  .filter((f) => f.endsWith('.vue'))
  .map((f) => ({ name: f, src: readFileSync(join(PAGES_DIR, f), 'utf8') }));

/** 用 subpage layout ＝ 內含 Subpage 元件 ＝ 有舞台 pin */
const pinned = pages.filter((p) => /layout:\s*'subpage'/.test(p.src));

describe('帶 pin 的頁面不吃帶 scale 的 page 轉場', () => {
  // 守門員：pages 目錄若改結構（或 layout 宣告方式變了），下面的 it.each 會一條都不跑而全綠
  it('找得到用 subpage layout 的頁面（六個獨立子頁 ＋ 連續閱讀頁）', () => {
    expect(pinned.map((p) => p.name).sort()).toEqual([
      'data.vue',
      'education.vue',
      'health.vue',
      'news.vue',
      'service.vue',
      'subpage.vue',
      'visual.vue',
    ]);
  });

  it.each(pinned.map((p) => [p.name, p] as const))(
    '%s 宣告了 page-fade 轉場',
    (_name, page) => {
      expect(
        /pageTransition:\s*\{\s*name:\s*'page-fade'/.test(page.src),
        `${_name} 沒有 override pageTransition → 會吃到帶 scale(0.96) 的 page 轉場，`
          + '舞台 pin 會鎖住縮放後的尺寸，切頁時彈一下',
      ).toBe(true);
    },
  );

  // 首頁也有 pin（hero），它的 override 是這條規則的先例 —— 一起守著別被拿掉
  it('index.vue 的 page-fade override 還在（這條規則的先例）', () => {
    const index = pages.find((p) => p.name === 'index.vue')!;
    expect(/pageTransition:\s*\{\s*name:\s*'page-fade'/.test(index.src)).toBe(
      true,
    );
  });
});
