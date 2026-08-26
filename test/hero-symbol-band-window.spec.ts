import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// hero → symbol 轉場：展開段的窗必須**精確**滿高（2026-08-26）。
//
// 症狀（使用者回報「來回滾動 header 被遮住」）：整個展開段 header 都不反白，
// base 那條 rgb(255 255 255 / 0.7) + blur(2px) 原封不動糊在粒子場上 ＝ 一條灰霧帶
// 蓋住窗內 header 那一列。時好時壞，換個視窗高就不見。
//
// 成因是一條**正的**次像素殘留：HeroSymbolTransition 的 apply() 把窗的上緣算成
// `Math.max(0, cy - h / 2)`（cy ＝ 量到的 core 中心）。拉長段跑完之後 h ＝ vh，
// 這條式子只有在 core 像素級正中時才給 0；而 header 反白的閘門是 `top <= 0`
// （見 ~/composables/useHeaderBand：亮列用水平 gradient 挖洞、表達不了垂直邊界，
// 故窗還沒蓋滿 header 那一列就一律不反白）—— 差 0.2px 就整段不反白。
// `Math.max(0, …)` 擋不住：它擋的是負值。
//
// 實測（Chromium、pad 斷點 1160×875，DPR 縮放讓視窗高帶小數）：
//   field.height 875.3333740234375 → vh / 2 ＝ 437.66668701171875
//   core 中心 cy ＝ 437.86688232421875
//   ⇒ top ＝ 0.2001953125px，clip 寫出 `inset(0.2px 345.7px 0px)`，band 整段沒開。
// 視窗高剛好是整數時 cy 正好等於中心 → 沒事，這就是「時好時壞」的來源。
//
// 治法與同檔 `pX >= 1` 那個「展開完成 → 直接寫死滿版」的分支同一招，只是換一根軸：
// 拉長段跑完（pY ＝ 1）之後垂直方向寫死 0，不由 cy 反推。
//
// 這支用源碼守門（同 test/hero-pinned-container.spec.ts 的理由）：apply() 是逐幀寫
// el.style 的 DOM 程式，純函式測不到；而失效是靜默的（不會有任何錯誤訊息）。
// vitest 沒設 alias（見 vitest.config.ts），故用相對 cwd 的路徑讀檔。

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

const TRANSITION = 'app/components/01.hero/HeroSymbolTransition.vue';
const BAND = 'app/composables/useHeaderBand.ts';

// 上面那組實測值。留在這裡是為了讓「為什麼不能靠 cy 反推」有一個可重跑的證據，
// 而不只是註解裡的一句話。
const MEASURED = {
  vh: 875.3333740234375,
  cy: 437.86688232421875,
};

describe('hero → symbol 轉場：反白窗的垂直邊界', () => {
  it('靠 cy 反推會留下正的次像素殘留（＝這條守門存在的理由）', () => {
    const { vh, cy } = MEASURED;
    // 拉長段跑完 → h ＝ vh
    const derived = Math.max(0, cy - vh / 2);
    expect(derived).toBeGreaterThan(0);
    expect(derived).toBeCloseTo(0.2, 3);
  });

  it('閘門對那 0.2px 是零容忍 —— 故驅動端必須交出精確的 0', () => {
    // useHeaderBand 的判定：top > 0 一律不開窗（水平 gradient 表達不了垂直邊界）
    expect(read(BAND)).toMatch(/\(rect\.top \?\? 0\) <= 0/);
  });

  it('展開段（pY ＝ 1）的上下緣寫死 0，不由 cy 反推', () => {
    const src = read(TRANSITION);
    expect(src).toMatch(/const vFull = pY >= 1;/);
    expect(src).toMatch(/const top = vFull \? 0 :/);
    expect(src).toMatch(/const bottom = vFull \? 0 :/);
  });

  it('左右緣仍由 cx 反推（只有垂直那根軸有閘門，水平不可一起寫死）', () => {
    const src = read(TRANSITION);
    expect(src).toMatch(/const left = Math\.max\(0, cx - w \/ 2\);/);
    expect(src).toMatch(/const right = Math\.max\(0, vw - \(cx \+ w \/ 2\)\);/);
  });

  it('交給 header 的 top 就是上面那個 top（沒有第二條算式）', () => {
    expect(read(TRANSITION)).toMatch(/bandTop = top;/);
  });
});
