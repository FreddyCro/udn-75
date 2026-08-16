import { describe, expect, it } from 'vitest';
import {
  ASSUMED_READING_VH_PER_S,
  CORE_WARM_START,
  CORE_WARM_VH,
  FORUM_HANDOFF,
  INTRO_LINE_SHIFT,
  INTRO_REVEAL_SPAN,
  INTRO_TIMELINE,
  SYMBOL_BEAT_VH,
  SYMBOL_INTRO,
  SYMBOL_INTRO_IDLE,
  SYMBOL_STOPS,
  SYMBOL_VH,
  convergeAmountAt,
  convergeLightAt,
  coreWarmAt,
  symbolBgLightAt,
  symbolIntroClear,
  symbolIntroGate,
  symbolIntroLineAt,
  symbolIntroLineState,
  symbolIntroOutPhase,
  symbolIntroRunning,
  symbolIntroTotal,
  type SymbolIntroState,
} from '../app/utils/orange-core-config';

// 這支守的是「門檻之間的關係」，不是門檻的值 —— 值本來就該能自由微調，
// 但一旦某個關係被打破，畫面上會出現說不清楚的破圖（文字沒淡完就開始集合人像、
// 議程在視窗底緣被看到淡入）。關係寫成測試，值就能放心改。
describe('符號段序列門檻', () => {
  it('SYMBOL_STOPS 的 until 嚴格遞增且以 1 收尾', () => {
    const untils = SYMBOL_STOPS.map((s) => s.until);
    for (let i = 1; i < untils.length; i++) {
      expect(untils[i]!).toBeGreaterThan(untils[i - 1]!);
    }
    expect(untils.at(-1)).toBe(1);
  });

  it('converge 的終點就是交棒點（coreIn），不是另外手寫的數字', () => {
    const converge = SYMBOL_STOPS.find((s) => s.mode === 'converge');
    expect(converge?.until).toBe(FORUM_HANDOFF.coreIn);
  });

  // 2026-08-13 起門檻由 SYMBOL_BEAT_VH（四拍各吃多少 vh）累加推導，不再手寫小數。
  // 這支守的是那條**反算關係**：從門檻反推回每一拍的 vh，要對得上宣告的值。
  //
  // 它抓的是本檔最容易犯、最靜默的錯 —— 有人調了 SYMBOL_VH 卻沒同步門檻（或反之）。
  // 那種錯不會壞掉任何東西，只會讓四拍的絕對距離全部偏掉，畫面上僅表現為「節奏怪怪的」。
  // 上面那支「until 嚴格遞增」在那種情況下還是綠的，正是它給假保證的地方。
  it('門檻反推回來的每拍距離 ＝ SYMBOL_BEAT_VH 宣告的值', () => {
    // mode → SYMBOL_BEAT_VH 的鍵。'enter' 是 SYMBOL_STOPS 的用語、'handoff' 是 SEQUENCE
    // 與 SYMBOL_BEAT_VH 的用語，指同一拍（見 orange-core-config 的 SEQUENCE forum 章節）。
    const beatOf = { disperse: 'disperse', face: 'face', converge: 'converge', enter: 'handoff' } as const;

    let prev = 0;
    for (const stop of SYMBOL_STOPS) {
      const vh = (stop.until - prev) * SYMBOL_VH;
      // 容差 1e-9 吸收「相加再相除再相減」的 IEEE754 誤差，不是放寬門檻本身：
      // 真的錯位會差好幾個 0.01（＝ 幾個 vh），不會被這個容差蓋過去。
      expect(vh).toBeCloseTo(SYMBOL_BEAT_VH[beatOf[stop.mode]], 9);
      prev = stop.until;
    }
  });

  // 總長是四拍的總和 —— 不是另外手寫的數字。這條翻掉的話上面那支會整批壞掉，
  // 但錯誤訊息會指向「某一拍不對」而非真正的原因，故單獨守一條。
  it('SYMBOL_VH ＝ 四拍 vh 的總和', () => {
    const sum = Object.values(SYMBOL_BEAT_VH).reduce((a, b) => a + b, 0);
    expect(SYMBOL_VH).toBeCloseTo(sum, 9);
  });

  // 改吃時間軸後，「文字在粒子集合前淡乾淨」不再由 progress 自動保證
  // （時間軸不知道捲動位置），全靠 out 這道保底清場的閘門補回 ——
  // 所以這條關係比改版前更重要，不是比較不重要。
  it('開場文案的保底清場必須早於進入 face', () => {
    expect(SYMBOL_INTRO.in).toBeLessThan(SYMBOL_INTRO.out);
    expect(SYMBOL_INTRO.out).toBeLessThan(SYMBOL_STOPS[0]!.until);
  });

  // ⚠️ 上面那條 `out < until` **本身不足以**保證「文字在人像集合前淡乾淨」——
  // 清場改成吃時間（clearDur）之後，越過 out 那一刻文字還在，要再 0.3s 才淡完，
  // 而這段時間使用者仍在往下捲。真正該守的是**距離換算成時間後還夠不夠清完**：
  //   marginVh / ASSUMED_READING_VH_PER_S ≥ clearDur
  // 這條會在有人「把 clearDur 調長」或「把 out 往後推 / 把 until 往前拉」時大聲壞掉，
  // 而 `out < until` 在那兩種情況下都還是綠的 —— 那正是它給假保證的地方。
  it('out 到人像集合的距離，換算成閱讀捲速下的秒數要夠跑完清場', () => {
    const marginVh = (SYMBOL_STOPS[0]!.until - SYMBOL_INTRO.out) * SYMBOL_VH * 100;
    const marginSec = marginVh / ASSUMED_READING_VH_PER_S;
    // 容差 1e-9：吸收 0.28 − 0.26 的 IEEE754 誤差，不是放寬門檻。
    expect(marginSec).toBeGreaterThanOrEqual(INTRO_TIMELINE.clearDur / 1000 - 1e-9);
  });

  // 「清場一定比自然退場快」是整個保底機制的前提：清場的意義就是把最壞情況從
  // 「一行一行退完」壓成單一次整組淡出。這條翻過來的話，越過 out 反而變慢。
  it('清場比自然退場快（clearDur < outDur）', () => {
    expect(INTRO_TIMELINE.clearDur).toBeLessThan(INTRO_TIMELINE.outDur);
  });

  // agendaIn 的作用是讓議程那 0.4s 的淡入發生在畫面外，判準是「符號段底緣還在
  // 視窗底下方多遠」。現況 32vh 是已驗證可行的距離，不得因為等比縮放而變小。
  it('議程淡入距段尾至少 32vh（發生在畫面外）', () => {
    const gapVh = (FORUM_HANDOFF.coreOut - FORUM_HANDOFF.agendaIn) * SYMBOL_VH * 100;
    // 容差 1e-9：純粹吸收 IEEE754 浮點數表示 0.92 / 1.0 的誤差（實測差 ≈1.4e-14 vh），
    // 不是放寬門檻本身 —— 真的退步到 32vh 以下會差好幾個 vh，不會被這個容差蓋過去。
    expect(gapVh).toBeGreaterThanOrEqual(32 - 1e-9);
  });

  it('agendaIn 早於 coreOut，coreOut 收在段尾', () => {
    expect(FORUM_HANDOFF.agendaIn).toBeLessThan(FORUM_HANDOFF.coreOut);
    expect(FORUM_HANDOFF.coreOut).toBe(1.0);
  });
});

// 2026-08-13：converge 從「mode 觸發的 2.2s 補間」改成「progress 的純函式」，
// 為的是修掉「往回滑會連續 96vh 一片白什麼都不動」。這一組守的就是那個改動的**目的**
// 與它的兩條硬需求（端點精確、翻面跟著底色），不是曲線的長相。
describe('convergeAmountAt（匯聚那一拍：捲動 → 收攏量）', () => {
  const start = SYMBOL_STOPS[1]!.until; // face 那一拍的終點 ＝ 開始收攏
  const end = CORE_WARM_START; //         收成一顆白 core ＝ 白→橘窗口的起點

  // 這支是整個改動的用意：值只由 progress 決定，於是往回捲**必然**沿原路倒退。
  // 改版前那個定時補間做不到這件事 —— 它只知道「mode 剛剛翻了」，不知道捲到哪裡。
  it('同一個 progress 恆得同一個值（可逆、與捲動方向無關）', () => {
    const forward: number[] = [];
    for (let i = 0; i <= 20; i++) forward.push(convergeAmountAt(start + ((end - start) * i) / 20));
    const backward: number[] = [];
    for (let i = 20; i >= 0; i--) backward.unshift(convergeAmountAt(start + ((end - start) * i) / 20));
    expect(backward).toEqual(forward);
  });

  // 終點的 1 是「與 ForumCore 的橘方塊同尺寸同位置硬切」的前提（見 FORUM_HANDOFF.coreIn）——
  // 差一點點就會在接棒那一幀看到縮一下，而那是本專案的不變量之一。
  // 2026-08-17 起終點提前到 CORE_WARM_START：其後那段窗口要是一顆**不動**的 core 在轉色，
  // 收攏若還沒跑完就會變成「邊收邊轉橘」——那正是這次改版要拆開的兩件事。
  it('端點精確：face 收尾時 0、白→橘窗口起點時 1', () => {
    expect(convergeAmountAt(start)).toBe(0);
    expect(convergeAmountAt(end)).toBe(1);
  });

  it('收攏在交棒點之前就已經跑完（窗口內 core 不再移動）', () => {
    expect(end).toBeLessThan(FORUM_HANDOFF.coreIn);
    expect(convergeAmountAt(FORUM_HANDOFF.coreIn)).toBe(1);
    // 窗口中段也已經是 1 —— 不是「快到 1」
    expect(convergeAmountAt((end + FORUM_HANDOFF.coreIn) / 2)).toBe(1);
  });

  it('區間外夾住：之前恆 0、之後（含窗口與段尾 handoff 整拍）恆 1', () => {
    for (const p of [0, start / 2, start - 1e-6]) expect(convergeAmountAt(p)).toBe(0);
    for (const p of [(end + 1) / 2, 1, 2]) expect(convergeAmountAt(p)).toBe(1);
  });

  it('區間內嚴格遞增', () => {
    let prev = -1;
    for (let i = 0; i <= 20; i++) {
      const v = convergeAmountAt(start + ((end - start) * i) / 20);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('中點恰為 0.5（smoothstep 兩端一階導數為 0，收攏的起手與落點都是柔的）', () => {
    expect(convergeAmountAt((start + end) / 2)).toBeCloseTo(0.5);
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const p of [-10, 10, Number.MAX_SAFE_INTEGER]) {
      expect(Number.isNaN(convergeAmountAt(p))).toBe(false);
    }
  });

});

// 2026-08-17：「白 core → 橘」與「底色黑→白」從收攏裡拆出來，搬到 converge 那一拍尾端
// 那段 CORE_WARM_VH 的窗口。這一組守的是那個改動的**順序**與它的三條硬需求：
// 收攏先跑完、顏色在交棒點前收齊、底色不准跑在顏色前面。
describe('coreWarmAt / symbolBgLightAt（白 core → 橘 ＋ 底色翻白的窗口）', () => {
  const start = CORE_WARM_START;
  const end = FORUM_HANDOFF.coreIn;
  const at = (t: number) => start + (end - start) * t; // 窗口內的相對位置 → progress

  it('窗口的長度就是 CORE_WARM_VH（不是另外手寫的門檻）', () => {
    expect((end - start) * SYMBOL_VH).toBeCloseTo(CORE_WARM_VH, 9);
  });

  // 這是整個改動的用意：白 core 要出現在**黑**底上。底色若在收攏期間就開始泛灰，
  // 那顆白 core 根本沒有機會被看見 —— 那就是改版前的狀況。
  it('收攏全程底色維持全黑（白 core 出現在黑底上）', () => {
    expect(symbolBgLightAt(SYMBOL_STOPS[1]!.until)).toBe(0);
    expect(symbolBgLightAt((SYMBOL_STOPS[1]!.until + start) / 2)).toBe(0);
    expect(symbolBgLightAt(start)).toBe(0);
    expect(coreWarmAt(start)).toBe(0); // 同一刻 core 也還是白的
  });

  // 交棒是硬切，兩顆必須同色 —— 顏色沒收齊就會在接棒那一幀看到變色。
  // 這裡要求它比交棒點**更早**收齊（見 CORE_WARM_COLOR_SPAN），故不是「恰好在終點到 1」。
  it('白→橘在交棒點之前就收齊到 1', () => {
    expect(coreWarmAt(end)).toBe(1);
    const done = at(0.9);
    expect(coreWarmAt(done)).toBe(1);
    expect(done).toBeLessThan(end);
  });

  // 底色的終點則必須**精確**壓在交棒點：轉場層在那裡開始淡出（吃時間），
  // 底下露出的是白底，canvas 沒翻完就會看到黑閃。
  it('底色端點精確：窗口起點 0、交棒點 1', () => {
    expect(symbolBgLightAt(start)).toBe(0);
    expect(symbolBgLightAt(end)).toBe(1);
  });

  // **這條是白 core 不會消失的守則。** core 的橘落在黑與白之間，底色掃過去時必有一刻
  // 與它等亮；讓顏色恆不落後於底色，就不會出現「底色已經很亮、core 卻還是白的」——
  // 那種情形下 core 會整顆溶進背景。反過來（底色跑在前面）沒有任何補救辦法。
  it('顏色恆不落後於底色（core 不會溶進背景）', () => {
    for (let i = 0; i <= 20; i++) {
      const p = at(i / 20);
      expect(coreWarmAt(p)).toBeGreaterThanOrEqual(symbolBgLightAt(p));
    }
  });

  it('兩條都是 progress 的純函式（同一個位置恆得同值、可逆）', () => {
    const fwd: number[] = [];
    for (let i = 0; i <= 20; i++) fwd.push(coreWarmAt(at(i / 20)) + symbolBgLightAt(at(i / 20)));
    const back: number[] = [];
    for (let i = 20; i >= 0; i--) back.unshift(coreWarmAt(at(i / 20)) + symbolBgLightAt(at(i / 20)));
    expect(back).toEqual(fwd);
  });

  it('區間外夾住：窗口之前恆 0、之後（含段尾 handoff 整拍）恆 1', () => {
    for (const p of [0, start / 2, start - 1e-6]) {
      expect(coreWarmAt(p)).toBe(0);
      expect(symbolBgLightAt(p)).toBe(0);
    }
    for (const p of [(end + 1) / 2, 1, 2]) {
      expect(coreWarmAt(p)).toBe(1);
      expect(symbolBgLightAt(p)).toBe(1);
    }
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const p of [-10, 10, Number.MAX_SAFE_INTEGER]) {
      expect(Number.isNaN(coreWarmAt(p))).toBe(false);
      expect(Number.isNaN(symbolBgLightAt(p))).toBe(false);
    }
  });

  // 段落底色與 header 主題要跟著**真正的底色**走。綁 mode 的話會退回 face 那一拍的終點
  // （提早 66vh）；綁收攏量的話會退回收攏中點（提早 28vh）——兩者都會讓 header 在畫面
  // 還全黑時就宣告自己站在淺色底上、改用深色內容。
  it('翻成淺色的時機落在白→橘的窗口內，不在收攏期間', () => {
    expect(convergeLightAt(SYMBOL_STOPS[1]!.until)).toBe(false);
    expect(convergeLightAt(start)).toBe(false);
    expect(convergeLightAt(end)).toBe(true);
    expect(convergeLightAt(at(0.4))).toBe(false);
    expect(convergeLightAt(at(0.6))).toBe(true);
  });
});

// 這三支守的是「依序」「重疊一半」「窗由行數推導」這些關係，不是常數的絕對值 ——
// 6.4s 這個節奏本來就該能自由微調。
describe('symbolIntroLineAt（逐行進場 / 逐行退場的時間軸）', () => {
  const COUNT = 3;
  const line = (t: number, i: number) => symbolIntroLineAt(t, i, COUNT);
  const ALL_IN = (COUNT - 1) * INTRO_TIMELINE.inStagger + INTRO_TIMELINE.inDur;
  const TOTAL = symbolIntroTotal(COUNT);

  it('t = 0 時三行都還沒開始，且都在下方 INTRO_LINE_SHIFT px', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(line(0, i).opacity).toBe(0);
      expect(line(0, i).reveal).toBe(0);
      expect(line(0, i).shift).toBe(INTRO_LINE_SHIFT);
    }
  });

  it('退場起點＝三行到位再加上全亮停留期', () => {
    expect(symbolIntroOutPhase(COUNT)).toBe(ALL_IN + INTRO_TIMELINE.hold);
  });

  it('全亮停留期間三行都到位、不位移、字已落定', () => {
    for (const t of [ALL_IN, ALL_IN + INTRO_TIMELINE.hold / 2]) {
      for (let i = 0; i < COUNT; i++) {
        expect(line(t, i).opacity).toBe(1);
        expect(line(t, i).shift).toBe(0);
        expect(line(t, i).reveal).toBe(1);
      }
    }
  });

  it('進場依序：任一刻前面的行不落後於後面的行', () => {
    for (const t of [200, 500, 800, 1100, 1400, 1700]) {
      expect(line(t, 0).opacity).toBeGreaterThanOrEqual(line(t, 1).opacity);
      expect(line(t, 1).opacity).toBeGreaterThanOrEqual(line(t, 2).opacity);
    }
    // 且中段真的拉得開（不是三行同時跑）
    expect(line(INTRO_TIMELINE.inDur, 0).opacity).toBe(1);
    expect(line(INTRO_TIMELINE.inDur, 2).opacity).toBe(0);
  });

  it('退場同順序（第一行先退），且位移為負＝繼續往上離場', () => {
    const out0 = symbolIntroOutPhase(COUNT);
    for (const t of [out0 + 200, out0 + 500, out0 + 800]) {
      expect(line(t, 0).opacity).toBeLessThanOrEqual(line(t, 1).opacity);
      expect(line(t, 1).opacity).toBeLessThanOrEqual(line(t, 2).opacity);
    }
    expect(line(out0 + 200, 0).shift).toBeLessThan(0);
  });

  it('退場不跑亂碼（reveal 恆為 1）', () => {
    const out0 = symbolIntroOutPhase(COUNT);
    for (let i = 0; i < COUNT; i++) {
      expect(line(out0 + 200, i).reveal).toBe(1);
      expect(line(TOTAL, i).reveal).toBe(1);
    }
  });

  it('total 之後三行全數退場完畢、停在上方 INTRO_LINE_SHIFT px', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(line(TOTAL, i).opacity).toBe(0);
      expect(line(TOTAL, i).shift).toBe(-INTRO_LINE_SHIFT);
    }
  });

  it('reveal 早於 opacity 收尾（最後一段是已可讀的整行升到定位）', () => {
    // 取「亂碼已落定、但整行還沒升到定位」那段的中點
    const t = INTRO_TIMELINE.inDur * (INTRO_REVEAL_SPAN + (1 - INTRO_REVEAL_SPAN) / 2);
    expect(line(t, 0).reveal).toBe(1);
    expect(line(t, 0).opacity).toBeLessThan(1);
  });

  // 守「重疊一半」這條關係要看**行為**，不是把常數的算式抄一遍（`inStagger * 2 === inDur`
  // 只是把設定值重寫成斷言，改設定就一起改，守不住任何東西）。
  // smoothstep 在窗的正中央恰為 0.5 ⇒ 下一行起跑那一刻，前一行剛好升到一半。
  it('相鄰兩行重疊一半：後一行起跑時前一行正好半亮（進場）', () => {
    expect(line(INTRO_TIMELINE.inStagger, 0).opacity).toBeCloseTo(0.5);
    expect(line(INTRO_TIMELINE.inStagger, 1).opacity).toBe(0); // 這一刻才起跑
  });

  it('相鄰兩行重疊一半：後一行開始退場時前一行正好半亮（退場）', () => {
    const t = symbolIntroOutPhase(COUNT) + INTRO_TIMELINE.outStagger;
    expect(line(t, 0).opacity).toBeCloseTo(0.5);
    expect(line(t, 1).opacity).toBe(1); // 這一刻才開始退
  });

  // 進場／停留分支與退場分支在自己那條接縫上必須接得起來，否則越過那一幀會跳一下。
  // ⚠️ 退場分支在 k = 0 時 shift 是 **−0**，而 expect(-0).toBe(0) 會失敗
  //    （Object.is(-0, 0) 為 false）—— 故用 toBeCloseTo。
  it('進場→退場的接縫不跳（每行在自己的退場起點兩側值相同）', () => {
    for (let i = 0; i < COUNT; i++) {
      const seam = symbolIntroOutPhase(COUNT) + i * INTRO_TIMELINE.outStagger;
      const holdEnd = line(seam - 1, i); // 停留段末值
      const exitStart = line(seam, i); //   退場段首值
      expect(holdEnd).toEqual({ opacity: 1, shift: 0, reveal: 1 });
      expect(exitStart.opacity).toBe(holdEnd.opacity);
      expect(exitStart.shift).toBeCloseTo(holdEnd.shift);
      expect(exitStart.reveal).toBe(holdEnd.reveal);
    }
  });

  it('換行數時退場起點與 total 跟著推導，不寫死', () => {
    for (const count of [1, 2, 4, 5]) {
      const allIn = (count - 1) * INTRO_TIMELINE.inStagger + INTRO_TIMELINE.inDur;
      expect(symbolIntroOutPhase(count)).toBe(allIn + INTRO_TIMELINE.hold);
      expect(symbolIntroTotal(count)).toBe(
        allIn +
          INTRO_TIMELINE.hold +
          (count - 1) * INTRO_TIMELINE.outStagger +
          INTRO_TIMELINE.outDur,
      );
      // 最後一行在 allIn 這一刻正好到位，在那之前還沒到（窗真的有寬度）
      expect(symbolIntroLineAt(allIn, count - 1, count).opacity).toBe(1);
      expect(
        symbolIntroLineAt(allIn - 1, count - 1, count).opacity,
      ).toBeLessThan(1);
    }
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const t of [-1000, TOTAL * 10]) {
      const r = line(t, 1);
      expect(Number.isNaN(r.opacity)).toBe(false);
      expect(Number.isNaN(r.shift)).toBe(false);
      expect(Number.isNaN(r.reveal)).toBe(false);
    }
  });
});

describe('symbolIntroClear（保底清場的整組乘數）', () => {
  it('觸發當下仍為 1，clearDur 之後為 0', () => {
    expect(symbolIntroClear(0)).toBe(1);
    expect(symbolIntroClear(INTRO_TIMELINE.clearDur)).toBe(0);
  });

  it('單調遞減、中段不外溢', () => {
    const a = symbolIntroClear(INTRO_TIMELINE.clearDur * 0.3);
    const b = symbolIntroClear(INTRO_TIMELINE.clearDur * 0.7);
    expect(a).toBeLessThan(1);
    expect(b).toBeLessThan(a);
    expect(b).toBeGreaterThan(0);
  });

  it('超出範圍的輸入不會回傳 NaN 或負值', () => {
    expect(symbolIntroClear(-1)).toBe(1);
    expect(symbolIntroClear(INTRO_TIMELINE.clearDur * 10)).toBe(0);
  });
});

// 閘門是這次改動唯一新增的「狀態機」，四條規則各有一個會靜默壞掉的失效模式，
// 故每一條都有測試（回傳同一個 reference ＝ 沒變，元件靠這件事跳過重繪）。
describe('symbolIntroGate（閘門：progress → 狀態轉換）', () => {
  const COUNT = 3;
  const gate = (s: SymbolIntroState, p: number) => symbolIntroGate(s, p, COUNT);
  const before = SYMBOL_INTRO.in / 2;
  const inside = (SYMBOL_INTRO.in + SYMBOL_INTRO.out) / 2;
  const after = SYMBOL_INTRO.out + 0.01;

  it('起播點之前不動（回傳同一個 state）', () => {
    expect(gate(SYMBOL_INTRO_IDLE, before)).toBe(SYMBOL_INTRO_IDLE);
    expect(gate(SYMBOL_INTRO_IDLE, 0)).toBe(SYMBOL_INTRO_IDLE);
  });

  it('越過 in 就起播（elapsed 歸 0）', () => {
    expect(gate(SYMBOL_INTRO_IDLE, inside)).toEqual({
      elapsed: 0,
      clearElapsed: null,
    });
  });

  it('已起播後停在窗內不會重播（同一個 state）', () => {
    const playing = { elapsed: 1234, clearElapsed: null };
    expect(gate(playing, inside)).toBe(playing);
  });

  it('退回 in 之前就重置成未播狀態（下次進來從頭播）', () => {
    expect(gate({ elapsed: 1234, clearElapsed: null }, before)).toEqual(
      SYMBOL_INTRO_IDLE,
    );
    expect(gate({ elapsed: 6000, clearElapsed: 100 }, before)).toEqual(
      SYMBOL_INTRO_IDLE,
    );
    // 重置後再進來＝重播
    expect(gate(SYMBOL_INTRO_IDLE, inside)).toEqual({
      elapsed: 0,
      clearElapsed: null,
    });
  });

  it('越過 out：演到一半的話啟動保底清場（clearElapsed 從 0 起跑）', () => {
    expect(gate({ elapsed: 1234, clearElapsed: null }, after)).toEqual({
      elapsed: 1234,
      clearElapsed: 0,
    });
  });

  // 2026-08-13 反轉：原本「已進入退場段就讓它自己跑完」的例外已移除。
  // 那個例外讓最壞情況多留 outDur + (count−1)·outStagger ＝ 1.4s 的尾巴，
  // 而 out 到人像集合只有 8vh（約 0.42–0.5s @16–19vh/s）—— 於是最常見的閱讀捲速
  // 反而是唯一會撞到人像集合的一段。清場乘數乘在逐行 opacity 之上，兩條都是
  // 兩端導數為 0 的遞減 smoothstep，疊起來仍然平滑，只是收得更快 —— 而收得更快正是 out 的目的。
  it('越過 out：即使已進入退場段也照樣啟動清場（不留 1.4s 的尾巴）', () => {
    const exiting = { elapsed: symbolIntroOutPhase(COUNT), clearElapsed: null };
    const next = gate(exiting, after);
    expect(next).not.toBe(exiting);
    expect(next).toEqual({ elapsed: symbolIntroOutPhase(COUNT), clearElapsed: 0 });
  });

  // 退場段更後面（只剩最後一行在退）也一樣要清場
  it('越過 out：退場段末尾也啟動清場', () => {
    const late = { elapsed: symbolIntroTotal(COUNT) - 1, clearElapsed: null };
    expect(gate(late, after)).toEqual({
      elapsed: symbolIntroTotal(COUNT) - 1,
      clearElapsed: 0,
    });
  });

  it('越過 out：從未起播（如重新整理落在段落中段）直接跳到清場終點，不閃文字', () => {
    expect(gate(SYMBOL_INTRO_IDLE, after)).toEqual({
      elapsed: null,
      clearElapsed: INTRO_TIMELINE.clearDur,
    });
  });

  it('清場已在進行中就不重新啟動（同一個 state）', () => {
    const clearing = { elapsed: 1234, clearElapsed: 50 };
    expect(gate(clearing, after)).toBe(clearing);
  });

  it('清場後往前捲回窗內不會重播（要退到 in 之前才重置）', () => {
    const cleared = { elapsed: 1234, clearElapsed: INTRO_TIMELINE.clearDur };
    expect(gate(cleared, inside)).toBe(cleared);
  });

  // 兩個門檻都是 `>=`，上面的案例卻刻意取嚴格內／外側 —— 邊界值本身也要守，
  // 否則有人改成 `>` 這批測試全部照樣綠。
  it('門檻邊界：p 恰等於 in 就起播', () => {
    expect(gate(SYMBOL_INTRO_IDLE, SYMBOL_INTRO.in)).toEqual({
      elapsed: 0,
      clearElapsed: null,
    });
  });

  it('門檻邊界：p 恰等於 out 就清場', () => {
    expect(gate({ elapsed: 1234, clearElapsed: null }, SYMBOL_INTRO.out)).toEqual({
      elapsed: 1234,
      clearElapsed: 0,
    });
  });
});

// 判斷搬回純函式（review 裁定 constraint 優先）：元件不該再有動畫語意的條件判斷，
// symbolIntroRunning / symbolIntroLineState 才是唯一的判斷所在。
describe('symbolIntroRunning（還要不要再排下一個 rAF）', () => {
  const COUNT = 3;
  const TOTAL = symbolIntroTotal(COUNT);
  const running = (s: SymbolIntroState, reduceMotion = false) =>
    symbolIntroRunning(s, reduceMotion, COUNT);

  it('未播（IDLE）→ false', () => {
    expect(running(SYMBOL_INTRO_IDLE)).toBe(false);
  });

  it('已起播、時間軸中段 → true', () => {
    expect(running({ elapsed: TOTAL / 2, clearElapsed: null })).toBe(true);
  });

  it('elapsed 已到 total → false', () => {
    expect(running({ elapsed: TOTAL, clearElapsed: null })).toBe(false);
  });

  it('清場中（clearElapsed < clearDur）→ true', () => {
    expect(
      running({ elapsed: TOTAL / 2, clearElapsed: INTRO_TIMELINE.clearDur / 2 }),
    ).toBe(true);
  });

  // ⚠️ 這是 Finding 1 的 bug：清場已跑完是**終態**，不論 elapsed 停在哪都該停 rAF——
  // 舊的判斷（`clearElapsed !== null && clearElapsed < clearDur` 才 return true，
  // 否則落到 elapsed < total）在這個 case 會誤判成 true，讓迴圈對著一個已經
  // opacity 0 的元素空轉到 total（實測約多跑 4.9 秒 ≈ 290 幀）。
  it('清場已完成（clearElapsed === clearDur）但 elapsed 還在時間軸中段 → false（終態，不空轉）', () => {
    expect(
      running({ elapsed: TOTAL / 4, clearElapsed: INTRO_TIMELINE.clearDur }),
    ).toBe(false);
  });

  it('reduce-motion ＋ 已起播 ＋ 未清場 → false（兩態切換沒有補間要跑）', () => {
    expect(running({ elapsed: 1234, clearElapsed: null }, true)).toBe(false);
  });

  it('reduce-motion ＋ 清場中 → true（清場本身不受 reduce-motion 影響）', () => {
    expect(
      running(
        { elapsed: 1234, clearElapsed: INTRO_TIMELINE.clearDur / 2 },
        true,
      ),
    ).toBe(true);
  });
});

describe('symbolIntroLineState（逐行當前值，含 reduce-motion 退化）', () => {
  const COUNT = 3;

  it('reduce-motion ＋ elapsed === null → 未起播的藏狀態', () => {
    expect(symbolIntroLineState(SYMBOL_INTRO_IDLE, 0, COUNT, true)).toEqual({
      opacity: 0,
      shift: INTRO_LINE_SHIFT,
      reveal: 0,
    });
  });

  it('reduce-motion ＋ 已起播 → 全亮，且與 elapsed 的值無關', () => {
    const expected = { opacity: 1, shift: 0, reveal: 1 };
    expect(
      symbolIntroLineState({ elapsed: 0, clearElapsed: null }, 1, COUNT, true),
    ).toEqual(expected);
    expect(
      symbolIntroLineState(
        { elapsed: 999999, clearElapsed: null },
        1,
        COUNT,
        true,
      ),
    ).toEqual(expected);
  });

  it('非 reduce-motion → 與 symbolIntroLineAt(elapsed ?? 0, i, count) 逐欄相等', () => {
    const s = { elapsed: 850, clearElapsed: null };
    expect(symbolIntroLineState(s, 2, COUNT, false)).toEqual(
      symbolIntroLineAt(s.elapsed ?? 0, 2, COUNT),
    );
  });

  it('非 reduce-motion ＋ elapsed === null → 視為 0', () => {
    expect(symbolIntroLineState(SYMBOL_INTRO_IDLE, 0, COUNT, false)).toEqual(
      symbolIntroLineAt(0, 0, COUNT),
    );
  });
});
