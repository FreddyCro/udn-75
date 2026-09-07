import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { headerBandOpen } from '../app/utils/header-band-window';

// 轉場開窗 → header 反白的閘門（見 ~/utils/header-band-window 的檔頭）。
//
// 這支釘的是 2026-09-06 的回報：閘門問「窗有沒有到**視窗頂端**」，但畫面上要問的是
// 「窗有沒有碰到 **header 那一列**」。兩者差一個 --header-height，色柱在那段距離內
// 已經被 header 蓋住、閘門卻還沒開 ⇒ base 的 70% 白 + blur 糊成一條灰霧帶。

// --header-height（app/assets/styles/base.scss，全站唯一一處、無斷點變體）
const HEADER_BOTTOM = 83;
const W = { left: 699.3, right: 725.3 }; // 拉長段那條 26px 窄長條的實測左右緣

describe('header 反白窗的閘門', () => {
  it('沒有窗就不開', () => {
    expect(headerBandOpen(null, HEADER_BOTTOM)).toBe(false);
    expect(headerBandOpen(undefined, HEADER_BOTTOM)).toBe(false);
  });

  it('寬度收成 0（或反轉）不開 —— 挖一條沒有寬度的洞沒有意義', () => {
    expect(headerBandOpen({ left: 700, right: 700, top: 0 }, HEADER_BOTTOM)).toBe(
      false,
    );
    expect(headerBandOpen({ left: 700, right: 690, top: 0 }, HEADER_BOTTOM)).toBe(
      false,
    );
  });

  it('窗滿高（top 省略或 0）—— 一直都成立的那一檔', () => {
    expect(headerBandOpen({ ...W }, HEADER_BOTTOM)).toBe(true);
    expect(headerBandOpen({ ...W, top: 0 }, HEADER_BOTTOM)).toBe(true);
  });

  // ── 這次要修的 ──────────────────────────────────────────────────────
  it('窗已經爬進 header 那一列、還沒到視窗頂 → 要開', () => {
    // 01 → 02 拉長段實測（1440×900）：scrollY 2250 時 clip 的 top ＝ 34.6
    expect(headerBandOpen({ ...W, top: 34.6 }, HEADER_BOTTOM)).toBe(true);
    // 剛碰到那一列的最底下一格
    expect(headerBandOpen({ ...W, top: 82.9 }, HEADER_BOTTOM)).toBe(true);
    // 03 → 04 實測（1440×900）：scrollY 19000 時橘柱上緣 ＝ 50.3
    expect(headerBandOpen({ left: 699.3, right: 725.3, top: 50.3 }, HEADER_BOTTOM)).toBe(
      true,
    );
  });

  it('窗還在 header 那一列以下 → 不開（那一列底下沒有 header 可以擋）', () => {
    expect(headerBandOpen({ ...W, top: HEADER_BOTTOM }, HEADER_BOTTOM)).toBe(false);
    expect(headerBandOpen({ ...W, top: 200 }, HEADER_BOTTOM)).toBe(false);
    expect(headerBandOpen({ ...W, top: 431.9 }, HEADER_BOTTOM)).toBe(false);
  });

  it('次像素殘留不再是零容忍（舊 bug 的實測值）', () => {
    // test/hero-symbol-band-window.spec.ts 記的那 0.2001953125px：
    // 舊閘門（top <= 0）會因此整個展開段都不反白。現在它落在那一列內 → 照開，
    // 而 --hd-band-t 會讓缺口精確地從 0.2px 起算。
    expect(headerBandOpen({ ...W, top: 0.2001953125 }, HEADER_BOTTOM)).toBe(true);
  });
});

// ── 消費端的源碼守門 ────────────────────────────────────────────────────
// 上面那組真值表證明「判定」對了，但畫面對不對還取決於三件 DOM／CSS 的事，
// 而它們全部是**靜默**失效（沒有錯誤訊息，只是顏色不對）。同 hero-symbol-band-window
// 與 hero-pinned-container 的理由：逐幀寫 style 與 mask 疊層測不了純函式，用源碼守門。
const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

const BAND = 'app/composables/useHeaderBand.ts';
const HEADER = 'app/components/ui/AppHeader.vue';
const MEDIA = 'app/composables/useMediaIntroMotion.ts';

describe('反白窗的垂直邊界：消費端', () => {
  it('composable 逐幀交出窗的上緣（--hd-band-t）', () => {
    const src = read(BAND);
    expect(src).toMatch(/const VAR_TOP = '--hd-band-t';/);
    // 夾 0：驅動端交出負的上緣時，遮罩不該往 header 之外長
    expect(src).toMatch(/setHeaderVar\(VAR_TOP, `\$\{Math\.max\(0, rect!\.top \?\? 0\)\.toFixed\(1\)\}px`\)/);
  });

  it('反白層的 clip-path 吃 --hd-band-t（否則反白會畫在色柱以外）', () => {
    const css = read(HEADER);
    expect(css).toMatch(/clip-path: inset\(\s*var\(--hd-band-t, 0px\)/);
  });

  it('base 的遮罩有垂直那一層，且**宣告在會畫東西的那兩個元素上**', () => {
    const css = read(HEADER);
    // 兩層相加：水平缺口 ＋ 垂直的 cap
    expect(css).toMatch(/var\(--hd-band-mask\) 0 0 \/ 100% 100% repeat,\s*var\(--hd-band-cap\) 0 0 \/ 100% 100% no-repeat/);

    // ⚠️ 這一條是實際踩過的坑（2026-09-06）：--hd-band-cap 原本和 --hd-band-mask 作伴
    //    宣告在 .app-header__layer--base 上，看起來很合理，但自訂屬性裡的 var() 是在
    //    **宣告它的那個元素**上就地代換完才往下繼承的 —— 於是裡面的 var(--hd-band-cap-y)
    //    拿到 layer 自己的值（沒有 ⇒ fallback 0px），兩個子元素都收到「上緣 0」的漸層，
    //    等於整層不存在。症狀：進度條在色柱那一段被挖掉一個缺口，而灰霧帶照舊。
    //    守法是位置比對：cap 的宣告必須落在 mask 那條規則**之後**（＝同一個區塊裡），
    //    不能在 --hd-band-mask 附近。
    // ⚠️ 位置比對要用正則、不可用 indexOf 硬字串：本 repo 的工作副本是 CRLF
    //    （git 的 autocrlf），寫死 '\n' 的樣板永遠找不到，測試會假紅。
    const capAt = css.indexOf('--hd-band-cap: linear-gradient');
    const maskVarAt = css.indexOf('--hd-band-mask: linear-gradient');
    const selectorAt =
      css.match(/\.app-header__progress,\s*\.app-header__bar-wrap \{/)?.index ?? -1;
    expect(capAt).toBeGreaterThan(-1);
    expect(selectorAt).toBeGreaterThan(-1);
    expect(capAt).toBeGreaterThan(selectorAt); // 在那兩個元素的規則內
    expect(capAt).toBeGreaterThan(maskVarAt);
  });

  it('cap 的邊界各自扣掉自己的框上緣（--hd-band-t 是視窗座標）', () => {
    const css = read(HEADER);
    // 進度條的框從 0 起算 → 直接用
    expect(css).toMatch(/\.app-header__progress \{\s*--hd-band-cap-y: var\(--hd-band-t, 0px\);/);
    // bar-wrap 的框從進度條底緣（3px）起算 → 扣掉
    expect(css).toMatch(/--hd-band-cap-y: max\(0px, calc\(var\(--hd-band-t, 0px\) - 3px\)\);/);
  });

  it('03 → 04 不在拍 1 結束那一幀硬收窗，改交出橘柱真正的上緣', () => {
    const src = read(MEDIA);
    expect(src).toMatch(/top: lightPhase \? r\.top : 0,/);
    // 舊寫法：lightPhase 直接收掉。收窗的時機現在由 headerBandOpen 依幾何決定。
    expect(src).not.toMatch(/if \(lightPhase\) \{\s*syncHeaderBand\(null\);/);
  });
});
