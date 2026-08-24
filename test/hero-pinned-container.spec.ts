import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// hero 段「量到帶著 pin 位移的 DOM」的守門（2026-08-23）。
//
// GSAP 的 refresh 順序是 `_dispatch("refreshInit")`（ScrollTrigger.js L495）→ `sort()`
// → `_revertAll()`（L498）→ 各尺 refresh（過程中 pin 會被重新套上）。於是「在 refresh 時
// 量一個住在 pin 內的元素」不保證量到 in-flow 位置 —— `.sec1__intro` / `.sec1__intro-body`
// 都住在被 hero 轉場 pin 的 `.sec1__inner` 裡。
//
// 實測（Chromium 1527×868，?pathdebug 的 __udnST，在 pin 之後做一次 refresh）：
//   驅動線終點 2614.6 → 3655.6（＋1041.6 ＝ TRANSITION_VH × --vh）
//     ⇒ 路徑長 2180 對捲動距離 1139 ＝ core 以 1.91× 往下墜，scrollY≈1560 掉出視窗底，
//       轉場開窗（錨在 core 的螢幕矩形）跟著整段長在視窗外 ＝「core 與轉場都沒出現」
//   引言淡出窗口 1833/2181 → 2874/3222（pin 進行中時是 −348/0）
//
// 兩者都是靜默失效（不會有任何錯誤訊息），且會被「之後某次在 pin 之前發生的 refresh」
// 修回去 ⇒ 症狀是「常常」而不是「總是」，肉眼很難逼出來。故用源碼守門。
// 完整成因見 .claude/memory/gsap-refresh-measures-pinned-dom.md。

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

const HERO = 'app/components/01.hero/Hero.vue';
const PATH = 'app/components/01.hero/OrangeCorePath.vue';

describe('hero：pin 內的量測', () => {
  it('轉場 pin 的目標仍是 .sec1__inner（下面兩條的前提）', () => {
    const src = read(HERO);
    expect(src).toMatch(/pin:\s*innerRef\.value/);
  });

  it('引言淡出的尺宣告 pinnedContainer —— trigger 在被 pin 的容器內', () => {
    // introFadeST 那一段（trigger: introBodyRef）必須帶 pinnedContainer
    const src = read(HERO);
    const block = src.slice(src.indexOf('trigger: introBodyRef.value'));
    expect(block.slice(0, 1400)).toMatch(/pinnedContainer:\s*innerRef\.value/);
  });

  it('驅動線的尺宣告 pinnedContainer —— endTrigger 在被 pin 的容器內', () => {
    expect(read(PATH)).toMatch(/pinnedContainer:\s*props\.pinnedEl/);
  });

  it('驅動線的幾何不自己量 endEl，改由本尺的捲動距離反推（1:1 是不變式）', () => {
    const src = read(PATH);
    // 終點必須是「起點 ＋ 捲動距離」
    expect(src).toMatch(/const ey = sy \+ \(st\.end - st\.start\)/);
    // 不得再出現任何對 endEl 的量測
    expect(src).not.toMatch(/endRect/);
    expect(src).not.toMatch(/props\.endEl\s*\.\s*getBoundingClientRect/);
  });

  it('幾何重建掛在本尺的 onRefresh，不是全域 refreshInit', () => {
    const src = read(PATH);
    expect(src).toMatch(/onRefresh:\s*build/);
    expect(src).not.toMatch(/addEventListener\(\s*'refreshInit'/);
  });
});
