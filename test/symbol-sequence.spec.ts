import { describe, expect, it } from 'vitest';
import {
  AGENDA_IN_LEAD_VH,
  ASSUMED_READING_VH_PER_S,
  CORE_WARM_START,
  CORE_WARM_VH,
  FACE_GATHER_END,
  FACE_GATHER_VH,
  FORUM_HANDOFF,
  INTRO_EXIT_STAGGER_RATIO,
  INTRO_LINE_SHIFT,
  INTRO_REVEAL_SPAN,
  INTRO_TIMELINE,
  SEAM_AT_HANDOFF_VH,
  SYMBOL_BEAT_VH,
  SYMBOL_HOVER_VH,
  SYMBOL_INTRO,
  SYMBOL_INTRO_IDLE,
  SYMBOL_RAIL_VH,
  SYMBOL_STOPS,
  SYMBOL_VH,
  convergeAmountAt,
  convergeLightAt,
  coreWarmAt,
  disperseAmountAt,
  headerTintAt,
  symbolBgLightAt,
  symbolIntroExitAt,
  symbolIntroExitK,
  symbolIntroGate,
  symbolIntroLineAt,
  symbolIntroLineState,
  symbolIntroRunning,
  symbolIntroTotal,
  symbolScrollHintPinnedAt,
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
  // 它抓的是本檔最容易犯、最靜默的錯 —— 有人調了尺長卻沒同步門檻（或反之）。
  // 那種錯不會壞掉任何東西，只會讓四拍的絕對距離全部偏掉，畫面上僅表現為「節奏怪怪的」。
  // 上面那支「until 嚴格遞增」在那種情況下還是綠的，正是它給假保證的地方。
  it('門檻反推回來的每拍距離 ＝ SYMBOL_BEAT_VH 宣告的值', () => {
    // mode → SYMBOL_BEAT_VH 的鍵。'enter' 是 SYMBOL_STOPS 的用語、'handoff' 是 SEQUENCE
    // 與 SYMBOL_BEAT_VH 的用語，指同一拍（見 orange-core-config 的 SEQUENCE forum 章節）。
    const beatOf = { disperse: 'disperse', face: 'face', converge: 'converge', enter: 'handoff' } as const;

    let prev = 0;
    for (const stop of SYMBOL_STOPS) {
      const vh = (stop.until - prev) * SYMBOL_RAIL_VH;
      // 容差 1e-9 吸收「相加再相除再相減」的 IEEE754 誤差，不是放寬門檻本身：
      // 真的錯位會差好幾個 0.01（＝ 幾個 vh），不會被這個容差蓋過去。
      expect(vh).toBeCloseTo(SYMBOL_BEAT_VH[beatOf[stop.mode]], 9);
      prev = stop.until;
    }
  });

  // 尺長是四拍的總和 —— 不是另外手寫的數字。這條翻掉的話上面那支會整批壞掉，
  // 但錯誤訊息會指向「某一拍不對」而非真正的原因，故單獨守一條。
  //
  // ⚠️ 2026-08-22 起「尺長」與「段落高度」是兩個值（見 SYMBOL_HOVER_VH）：
  //    四拍的總和是**尺長**，段高比它短半個視窗。所有 progress 門檻的分母都是尺長。
  it('SYMBOL_RAIL_VH ＝ 四拍 vh 的總和', () => {
    const sum = Object.values(SYMBOL_BEAT_VH).reduce((a, b) => a + b, 0);
    expect(SYMBOL_RAIL_VH).toBeCloseTo(sum, 9);
  });

  // 三個門檻要依序落在第一拍內。這條只是必要條件（真正該守的性質見下一條），
  // 但它壞掉時的錯誤訊息最直接，故單獨留一支。
  it('開場文案的三個門檻依序落在第一拍內', () => {
    expect(SYMBOL_INTRO.in).toBeLessThan(SYMBOL_INTRO.exit);
    expect(SYMBOL_INTRO.exit).toBeLessThan(SYMBOL_INTRO.out);
    expect(SYMBOL_INTRO.out).toBeLessThan(SYMBOL_STOPS[0]!.until);
  });

  // 下滑提示的常駐窗口（2026-08-27）。守的同樣是「關係」不是值：
  // 起點要壓在文案起播上（不能提早涵蓋 hero 轉場）、終點要壓在 disperse→face 的交界上
  // （＝進入 face 才開始十秒規則）。理由見 symbolScrollHintPinnedAt。
  it('下滑提示常駐窗口 ＝ 三行文案起播 → 粒子開始集合', () => {
    // 端點：起點含、終點不含（face 那一拍立刻交回十秒規則）
    expect(symbolScrollHintPinnedAt(SYMBOL_INTRO.in)).toBe(true);
    expect(symbolScrollHintPinnedAt(SYMBOL_STOPS[0]!.until)).toBe(false);

    // hero 轉場（本尺還沒起跑，p 恆 0）與文案起播之前：不常駐
    expect(symbolScrollHintPinnedAt(0)).toBe(false);
    expect(symbolScrollHintPinnedAt(SYMBOL_INTRO.in / 2)).toBe(false);

    // 文案的全亮期與退場期都在窗口內 —— 停著不動時提示要一直在
    expect(symbolScrollHintPinnedAt(SYMBOL_INTRO.exit)).toBe(true);
    expect(symbolScrollHintPinnedAt(SYMBOL_INTRO.out)).toBe(true);

    // face 之後（含 converge 與段尾）一律交回十秒規則
    for (const p of [SYMBOL_STOPS[1]!.until, FORUM_HANDOFF.coreIn, 1]) {
      expect(symbolScrollHintPinnedAt(p)).toBe(false);
    }
  });

  // 這條才是「文字要在粒子集合成人像之前淡乾淨」的本體。
  //
  // ⚠️ 2026-08-12～08-26 之間它只能是**條件保證** —— 清場吃時間（clearDur），
  //    越過 out 那一刻文字還在，得看捲速夠不夠慢才淡得完，故當時守的是
  //    「marginVh / ASSUMED_READING_VH_PER_S ≥ clearDur」這條換算關係。
  //    退場改吃捲動距離後它回到**構造上**成立：越過 out 之後不論捲多快、
  //    時間軸停在哪、是不是 reduce-motion，最終 opacity 都恆為 0 ——
  //    所以這裡把那幾個維度整個掃一遍，而不是再驗一次換算。
  it('越過 out 之後三行必然全空，與捲速、時間軸位置、reduce-motion 無關', () => {
    const COUNT = 3;
    for (const p of [SYMBOL_INTRO.out, SYMBOL_STOPS[0]!.until, 1]) {
      for (const elapsed of [null, 0, 123, symbolIntroTotal(COUNT)]) {
        for (let i = 0; i < COUNT; i++) {
          for (const reduceMotion of [false, true]) {
            expect(
              symbolIntroLineState({ elapsed }, p, i, COUNT, reduceMotion)
                .opacity,
            ).toBe(0);
          }
        }
      }
    }
  });

  // 論壇主標與議程那 0.4s 的淡入要在**轉場層還蓋著**的時候跑完。
  //
  // ⚠️ 2026-08-22 判準換了。改版前守的是「距段尾至少 32vh ＝ 發生在畫面外」，
  //    而接縫現在在交棒**之前**就升進畫面了（見 SYMBOL_HOVER_VH），那條已不成立 ——
  //    改守「前置距離換算成秒數蓋得住那 0.4s」，遮蔽物換成轉場層。
  // ⚠️ 硬寫 0.4 是刻意的：那是 `.sec2__path` 的 CSS transition，程式讀不到。
  //    改 SCSS 的那個值要回來改這裡（同 ASSUMED_READING_VH_PER_S 的用法）。
  it('議程淡入的前置距離，換算成閱讀捲速下的秒數要蓋得住那 0.4s', () => {
    const leadVh = (FORUM_HANDOFF.coreIn - FORUM_HANDOFF.agendaIn) * SYMBOL_RAIL_VH * 100;
    // 容差 1e-9：吸收「相減再相乘」的 IEEE754 誤差，不是放寬門檻本身。
    expect(leadVh).toBeCloseTo(AGENDA_IN_LEAD_VH * 100, 9);
    expect(leadVh / ASSUMED_READING_VH_PER_S).toBeGreaterThanOrEqual(0.4 - 1e-9);
  });

  it('agendaIn 早於交棒點；coreOut 收在尺尾（＝接縫抵達視窗中央）', () => {
    expect(FORUM_HANDOFF.agendaIn).toBeLessThan(FORUM_HANDOFF.coreIn);
    expect(FORUM_HANDOFF.coreOut).toBe(1.0);
  });
});

// 2026-08-22：捲動尺的 end 從「段落底緣抵達視窗底緣」改成「抵達視窗中央」，把原本
// drive: 'none' 的 50vh 懸停期併進尺內，好讓交棒那一刻論壇主標已經在畫面上
// （需求：「symbol face 聚合 orange core 後，視窗內要看到下方論壇的文字資訊」）。
// 這一組守的是那個改動的**幾何**，不是它的數值。
describe('交棒那一刻的接縫位置（聚合完成就看得到論壇文字）', () => {
  // 尺比段落長出的那半個視窗就是舊的懸停期。這條翻掉就代表 SymbolScene 的
  // end: 'bottom center' 與段落高度的關係被拆開了。
  it('段落高度 ＝ 尺長 − 懸停期', () => {
    expect(SYMBOL_VH).toBeCloseTo(SYMBOL_RAIL_VH - SYMBOL_HOVER_VH, 9);
  });

  // **這條是整個改動的推導。** 接縫（`.sec2` 頂端）在螢幕上的高度
  // ＝ SYMBOL_VH + 1 − p × 尺長；代入交棒點之後總長全部約掉，只剩 懸停期 ＋ handoff。
  // ⚠️ 它同時證明了「調段落總長修不掉這件事」—— 右邊那個式子裡根本沒有總長。
  it('接縫高度由 懸停期 ＋ handoff 決定，與尺的總長無關', () => {
    const seamAtCoreIn = SYMBOL_VH + 1 - FORUM_HANDOFF.coreIn * SYMBOL_RAIL_VH;
    expect(seamAtCoreIn).toBeCloseTo(SEAM_AT_HANDOFF_VH, 9);
    expect(SEAM_AT_HANDOFF_VH).toBeCloseTo(SYMBOL_HOVER_VH + SYMBOL_BEAT_VH.handoff, 9);
  });

  // 需求本體：交棒那一刻論壇主標要完整落在畫面內。
  // ⚠️ 硬寫 38（vh）是刻意的：那是主標吃掉的空間在**最矮的實測尺寸 1440×700** 上的換算
  //    （`.sec2__path` 的 padding-top 140px ＋ 兩行主標到字形底緣 265.7px，÷ 700）。
  //    CSS 與字形素材的尺寸程式讀不到 —— 改 padding-top、主標行數或字級要回來改這裡。
  it('接縫距視窗底留得下論壇主標（1440×700 需要 38vh）', () => {
    expect((1 - SEAM_AT_HANDOFF_VH) * 100).toBeGreaterThanOrEqual(38);
  });

  // 接縫必須在交棒**之前**就升進畫面 —— 那是「轉場層一掀開就看得到字」的前提。
  // 等價於 SEAM_AT_HANDOFF_VH < 1，但寫成「接縫穿越視窗底緣的位置」更看得懂在講什麼。
  it('接縫在交棒之前就已越過視窗底緣', () => {
    const seamCrossesFoldAtVh = SYMBOL_VH * 100;
    const coreInAtVh = FORUM_HANDOFF.coreIn * SYMBOL_RAIL_VH * 100;
    expect(seamCrossesFoldAtVh).toBeLessThan(coreInAtVh);
  });

  // handoff 的下限：交棒到路徑接手之間，轉場層那 0.35s 的淡出要跑得完，否則畫面中央
  // 會同時有「正在淡出的收斂點」與「已經開始沿線移動的路徑核心」——那正是
  // forumCoreDotVisible 的 instantHide 在防的「全程只看到一顆」。
  // ⚠️ 硬寫 0.35 同上：那是 HeroSymbolTransition 的 CSS transition，程式讀不到。
  it('交棒後的停留蓋得住轉場層那 0.35s 的淡出', () => {
    const holdVh = SYMBOL_BEAT_VH.handoff * 100;
    expect(holdVh / ASSUMED_READING_VH_PER_S).toBeGreaterThanOrEqual(0.35 - 1e-9);
  });
});

// 2026-08-28：disperse→face 從「mode 觸發的 2.2s 補間」改成「progress 的純函式」。
// 這一組守的是那個改動的**目的**（掉幀時動作只會慢下來、不會跳）與它的三條硬需求：
// 端點精確、窗口是 face 那一拍的前綴（後面要留一張組好的臉）、與 converge 不重疊。
describe('disperseAmountAt（集合那一拍：捲動 → 散開量）', () => {
  const start = SYMBOL_STOPS[0]!.until; // disperse 那一拍的終點 ＝ 開始飛回來組臉
  const end = FACE_GATHER_END; //         人臉組好、可以互動的那一刻

  // 這支是整個改動的用意：值只由 progress 決定 ⇒ 掉幀不會讓它跳過一段，
  // 往回捲也必然沿原路散回去。改版前那個定時補間兩件事都做不到。
  it('同一個 progress 恆得同一個值（可逆、與捲動方向無關）', () => {
    const forward: number[] = [];
    for (let i = 0; i <= 20; i++)
      forward.push(disperseAmountAt(start + ((end - start) * i) / 20));
    const backward: number[] = [];
    for (let i = 20; i >= 0; i--)
      backward.unshift(disperseAmountAt(start + ((end - start) * i) / 20));
    expect(backward).toEqual(forward);
  });

  // 起點的 1：少一點就是「disperse 那一拍的粒子沒有完全散開」，開場三行文案疊在上面時
  // 背後會是一張半組好的臉。終點的 0：faceFormed 的條件之一是 uDisperse ≤ 0.001
  // （見 SymbolFace），差一點點就永遠不成立 ⇒ 宮格彩蛋與 PC 提示整拍都不會出現。
  it('端點精確：disperse 收尾時 1、集合窗口終點時 0', () => {
    expect(disperseAmountAt(start)).toBe(1);
    expect(disperseAmountAt(end)).toBe(0);
  });

  it('區間外夾住：之前恆 1（含整段 hero 轉場）、之後恆 0（含 converge 與段尾）', () => {
    for (const p of [0, start / 2, start - 1e-6])
      expect(disperseAmountAt(p)).toBe(1);
    for (const p of [SYMBOL_STOPS[1]!.until, CORE_WARM_START, 1, 2])
      expect(disperseAmountAt(p)).toBe(0);
  });

  it('區間內嚴格遞減', () => {
    let prev = 2;
    for (let i = 0; i <= 20; i++) {
      const v = disperseAmountAt(start + ((end - start) * i) / 20);
      expect(v).toBeLessThan(prev);
      prev = v;
    }
  });

  it('中點恰為 0.5（smoothstep 兩端一階導數為 0，起手與落點都是柔的）', () => {
    expect(disperseAmountAt((start + end) / 2)).toBeCloseTo(0.5);
  });

  // 窗口必須是 face 那一拍的**前綴**：其後要留下一張已組好、可互動的臉，
  // 吃掉整拍就等於彩蛋與提示都沒有成立的機會（faceFormed 讀 uDisperse 已回到 0）。
  it('集合窗口是 face 那一拍的前綴，且其後仍有停留', () => {
    expect(FACE_GATHER_VH).toBeGreaterThan(0);
    expect(FACE_GATHER_VH).toBeLessThan(SYMBOL_BEAT_VH.face);
    expect(end).toBeGreaterThan(SYMBOL_STOPS[0]!.until);
    expect(end).toBeLessThan(SYMBOL_STOPS[1]!.until);
  });

  // 兩拍不重疊：集合跑完（uDisperse ＝ 0）之後才輪到收攏起跑（uConverge 由 0 開始）。
  // 三態互斥是 shader 的前提（uDisperse / uConverge 同一時間至多一個為正，見 SymbolFace）。
  it('與 convergeAmountAt 不重疊（同一時間至多一個為正）', () => {
    for (let i = 0; i <= 100; i++) {
      const p = i / 100;
      const d = disperseAmountAt(p);
      const c = convergeAmountAt(p);
      expect(Math.min(d, c)).toBe(0);
    }
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const p of [-10, 10, Number.MAX_SAFE_INTEGER]) {
      expect(Number.isNaN(disperseAmountAt(p))).toBe(false);
    }
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
    expect((end - start) * SYMBOL_RAIL_VH).toBeCloseTo(CORE_WARM_VH, 9);
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

  // headerTintAt 是 header 配色在這個窗口內的**逐幀**驅動量（取代 convergeLightAt 那一下
  // 硬翻，見該函式的註解）。這一組守的是它與離散三檔之間的**交界**：窗口外必須放手，
  // 窗口的兩端必須與放手後接到的那一檔同色，否則掛上／脫手那一幀會看到跳色。
  describe('headerTintAt（header 配色的逐幀漸變量）', () => {
    // 放手的判準是「symbolBgLightAt 已被夾成 0 或 1」，不是另外手寫的門檻 ——
    // 兩端各自恆等於離散主題，tint 在那裡沒有事情可做。
    it('窗口外一律回 null（交還給 data-header-theme 的離散三檔）', () => {
      for (const p of [-10, 0, SYMBOL_STOPS[1]!.until, start / 2, start, end, 1, 10]) {
        expect(headerTintAt(p)).toBeNull();
      }
    });

    it('窗口內恆為非 null，且嚴格落在 0 與 1 之間', () => {
      for (let i = 1; i < 20; i++) {
        const t = headerTintAt(at(i / 20));
        expect(t).not.toBeNull();
        expect(t!).toBeGreaterThan(0);
        expect(t!).toBeLessThan(1);
      }
    });

    // **無接縫的守則。** 放手的那一刻，插值算出來的顏色必須與離散主題**完全相同**：
    // 窗口起點還是 dark（底色全黑）、終點已是 light（底色全白）。這靠的是
    // symbolBgLightAt 的端點精確為 0 / 1，故兩者其實是同一條曲線的兩種讀法。
    it('兩端與離散主題對得上（掛上／脫手那一幀不跳色）', () => {
      expect(symbolBgLightAt(start)).toBe(0); //     起點插值 ＝ 0 ＝ dark 端
      expect(convergeLightAt(start)).toBe(false); // 放手後接到的正是 dark
      expect(symbolBgLightAt(end)).toBe(1); //       終點插值 ＝ 1 ＝ light 端
      expect(convergeLightAt(end)).toBe(true); //    放手後接到的正是 light
    });

    // 與底色同一條曲線 —— 不是「另一條長得很像的曲線」。header 要是自己有一份曲線，
    // 調 CORE_WARM_VH 之後兩者就會分家，header 與畫面各走各的。
    it('值就是 symbolBgLightAt（與整片底色同一條曲線）', () => {
      for (let i = 1; i < 20; i++) {
        const p = at(i / 20);
        expect(headerTintAt(p)).toBe(symbolBgLightAt(p));
      }
    });

    it('純函式：同一個位置恆得同值（往回捲自動沿原路退回）', () => {
      const fwd: (number | null)[] = [];
      for (let i = 0; i <= 20; i++) fwd.push(headerTintAt(at(i / 20)));
      const back: (number | null)[] = [];
      for (let i = 20; i >= 0; i--) back.unshift(headerTintAt(at(i / 20)));
      expect(back).toEqual(fwd);
    });

    it('超出範圍的輸入不會回傳 NaN（一律夾成 null）', () => {
      for (const p of [-10, 10, Number.MAX_SAFE_INTEGER]) {
        expect(headerTintAt(p)).toBeNull();
      }
    });
  });
});

// 這幾支守的是「依序」「重疊一半」「窗由行數推導」這些關係，不是常數的絕對值 ——
// 節奏（進場 2.0s、退場 24vh）本來就該能自由微調。
describe('symbolIntroLineAt（逐行進場的時間軸）', () => {
  const COUNT = 3;
  const line = (t: number, i: number) => symbolIntroLineAt(t, i);
  const ALL_IN = symbolIntroTotal(COUNT);

  it('t = 0 時三行都還沒開始，且都在下方 INTRO_LINE_SHIFT px', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(line(0, i).opacity).toBe(0);
      expect(line(0, i).reveal).toBe(0);
      expect(line(0, i).shift).toBe(INTRO_LINE_SHIFT);
    }
  });

  // 這是 2026-08-26 改版的核心：時間軸**沒有退場段**，停留沒有上限。
  // 舊版在 allIn + hold 之後會開始自己退場 —— 那正是這次要拿掉的行為。
  it('三行到位之後就停在全亮，時間軸再怎麼跑都不會自己退場', () => {
    for (const t of [ALL_IN, ALL_IN * 10, 600_000]) {
      for (let i = 0; i < COUNT; i++) {
        expect(line(t, i)).toEqual({ opacity: 1, shift: 0, reveal: 1 });
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

  it('reveal 早於 opacity 收尾（最後一段是已可讀的整行升到定位）', () => {
    // 取「亂碼已落定、但整行還沒升到定位」那段的中點
    const t =
      INTRO_TIMELINE.inDur * (INTRO_REVEAL_SPAN + (1 - INTRO_REVEAL_SPAN) / 2);
    expect(line(t, 0).reveal).toBe(1);
    expect(line(t, 0).opacity).toBeLessThan(1);
  });

  // 守「重疊一半」這條關係要看**行為**，不是把常數的算式抄一遍（`inStagger * 2 === inDur`
  // 只是把設定值重寫成斷言，改設定就一起改，守不住任何東西）。
  // smoothstep 在窗的正中央恰為 0.5 ⇒ 下一行起跑那一刻，前一行剛好升到一半。
  it('相鄰兩行重疊一半：後一行起跑時前一行正好半亮', () => {
    expect(line(INTRO_TIMELINE.inStagger, 0).opacity).toBeCloseTo(0.5);
    expect(line(INTRO_TIMELINE.inStagger, 1).opacity).toBe(0); // 這一刻才起跑
  });

  it('換行數時整段長度跟著推導，不寫死', () => {
    for (const count of [1, 2, 4, 5]) {
      expect(symbolIntroTotal(count)).toBe(
        (count - 1) * INTRO_TIMELINE.inStagger + INTRO_TIMELINE.inDur,
      );
      // 最後一行在 total 這一刻正好到位，在那之前還沒到（窗真的有寬度）
      const total = symbolIntroTotal(count);
      expect(symbolIntroLineAt(total, count - 1).opacity).toBe(1);
      expect(symbolIntroLineAt(total - 1, count - 1).opacity).toBeLessThan(1);
    }
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const t of [-1000, ALL_IN * 10]) {
      const r = line(t, 1);
      expect(Number.isNaN(r.opacity)).toBe(false);
      expect(Number.isNaN(r.shift)).toBe(false);
      expect(Number.isNaN(r.reveal)).toBe(false);
    }
  });
});

describe('symbolIntroExitK（捲動進度 → 退場的正規化進度）', () => {
  const { exit, out } = SYMBOL_INTRO;

  it('exit 之前恆為 0、out 之後恆為 1（兩端 clamp，不外溢）', () => {
    expect(symbolIntroExitK(0)).toBe(0);
    expect(symbolIntroExitK(exit / 2)).toBe(0);
    expect(symbolIntroExitK(exit)).toBe(0);
    expect(symbolIntroExitK(out)).toBe(1);
    expect(symbolIntroExitK(1)).toBe(1);
  });

  // 線性是刻意的：緩動歸每行自己那扇窗，外層再緩一次會把中段壓平
  // （畫面上是三行在區間正中央一起頓一下）。
  // ⚠️ 中點測不出差別 —— smoothstep 在中點也是 0.5。要取 1/4 點才分得開
  //    （同一位置 smoothstep 為 0.15625）。
  it('區間內是線性，不是 smoothstep', () => {
    expect(symbolIntroExitK(exit + (out - exit) / 4)).toBeCloseTo(0.25, 6);
    expect(symbolIntroExitK(exit + (out - exit) / 2)).toBeCloseTo(0.5, 6);
    expect(symbolIntroExitK(exit + ((out - exit) * 3) / 4)).toBeCloseTo(0.75, 6);
  });
});

describe('symbolIntroExitAt（逐行退場：錯開住在捲動距離上）', () => {
  const COUNT = 3;
  const ex = (k: number, i: number) => symbolIntroExitAt(k, i, COUNT);
  // 第 i 行的退場窗在 k 空間的起點（以「一扇窗 ＝ 1」換算回 0..1，見實作）
  const SPAN = 1 + (COUNT - 1) * INTRO_EXIT_STAGGER_RATIO;
  const windowStart = (i: number) => (i * INTRO_EXIT_STAGGER_RATIO) / SPAN;

  it('k = 0 ＝ 還沒開始退：三行都是全亮乘數、零位移', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(ex(0, i).opacity).toBe(1);
      // ⚠️ k = 0 時 shift 是 **−0**，而 expect(-0).toBe(0) 會失敗
      //    （Object.is(-0, 0) 為 false）—— 故用 toBeCloseTo。
      expect(ex(0, i).shift).toBeCloseTo(0);
    }
  });

  it('k = 1 ＝ 已全空：三行 opacity 全 0、停在上方 INTRO_LINE_SHIFT px', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(ex(1, i).opacity).toBe(0);
      expect(ex(1, i).shift).toBe(-INTRO_LINE_SHIFT);
    }
  });

  it('依序退場：任一刻前面的行不慢於後面的行，且位移為負＝繼續往上離場', () => {
    for (const k of [0.2, 0.4, 0.6, 0.8]) {
      expect(ex(k, 0).opacity).toBeLessThanOrEqual(ex(k, 1).opacity);
      expect(ex(k, 1).opacity).toBeLessThanOrEqual(ex(k, 2).opacity);
    }
    expect(ex(0.2, 0).shift).toBeLessThan(0);
  });

  it('單調遞減：捲得越多退得越乾淨（往回捲則相反，這就是可逆）', () => {
    for (let i = 0; i < COUNT; i++) {
      let prev = ex(0, i).opacity;
      for (const k of [0.1, 0.3, 0.5, 0.7, 0.9, 1]) {
        const now = ex(k, i).opacity;
        expect(now).toBeLessThanOrEqual(prev);
        prev = now;
      }
    }
  });

  // 同進場那條：守**行為**（後一行起退時前一行剛好半亮），不是把 ratio 的算式抄一遍。
  it('相鄰兩行重疊一半：後一行開始退時前一行正好半亮', () => {
    const k = windowStart(1);
    expect(ex(k, 0).opacity).toBeCloseTo(0.5);
    expect(ex(k, 1).opacity).toBe(1); // 這一刻才開始退
  });

  // 退場要把整段距離用好用滿：第一行從 k = 0 就起退、最後一行剛好在 k = 1 退完。
  // 收不乾淨（> 0）就會有文字被帶進人像那一拍；提早收完則是白白浪費捲動距離。
  it('不論幾行，第一行從 k = 0 起退、最後一行剛好在 k = 1 退完', () => {
    for (const count of [1, 2, 3, 4, 5]) {
      expect(symbolIntroExitAt(1e-6, 0, count).opacity).toBeLessThan(1);
      expect(symbolIntroExitAt(1, count - 1, count).opacity).toBe(0);
      expect(
        symbolIntroExitAt(1 - 1e-6, count - 1, count).opacity,
      ).toBeGreaterThan(0);
    }
  });

  it('超出範圍的輸入不會回傳 NaN', () => {
    for (const k of [-1, 5]) {
      expect(Number.isNaN(ex(k, 1).opacity)).toBe(false);
      expect(Number.isNaN(ex(k, 1).shift)).toBe(false);
    }
  });
});

// 閘門只管**進場時間軸**的狀態（退場沒有狀態，那正是它可逆的原因）。
// 三條規則各有一個會靜默壞掉的失效模式，故每一條都有測試
//（回傳同一個 reference ＝ 沒變，也是冪等性可以直接用 toBe 測的原因）。
describe('symbolIntroGate（閘門：progress → 進場時間軸的狀態轉換）', () => {
  const COUNT = 3;
  const TOTAL = symbolIntroTotal(COUNT);
  const gate = (s: SymbolIntroState, p: number) => symbolIntroGate(s, p, COUNT);
  const before = SYMBOL_INTRO.in / 2;
  const inside = (SYMBOL_INTRO.in + SYMBOL_INTRO.out) / 2;
  const after = SYMBOL_INTRO.out + 0.01;

  it('起播點之前不動（回傳同一個 state）', () => {
    expect(gate(SYMBOL_INTRO_IDLE, before)).toBe(SYMBOL_INTRO_IDLE);
    expect(gate(SYMBOL_INTRO_IDLE, 0)).toBe(SYMBOL_INTRO_IDLE);
  });

  it('越過 in 就起播（elapsed 歸 0）', () => {
    expect(gate(SYMBOL_INTRO_IDLE, inside)).toEqual({ elapsed: 0 });
  });

  it('已起播後停在窗內不會重播（同一個 state）', () => {
    const playing = { elapsed: 1234 };
    expect(gate(playing, inside)).toBe(playing);
  });

  it('退回 in 之前就重置成未播狀態（下次進來從頭播）', () => {
    expect(gate({ elapsed: 1234 }, before)).toEqual(SYMBOL_INTRO_IDLE);
    expect(gate({ elapsed: TOTAL }, before)).toEqual(SYMBOL_INTRO_IDLE);
    // 重置後再進來＝重播
    expect(gate(SYMBOL_INTRO_IDLE, inside)).toEqual({ elapsed: 0 });
  });

  // 2026-08-26 反轉：越過 out 不再是「啟動保底清場」——「越過 out 就看不見」
  // 已由退場的 scrub 構造上保證。這條現在管的是**可逆**與**不空轉**。
  it('越過 out：演到一半的話直接跳到進場終點（不是清場、也不是重播）', () => {
    expect(gate({ elapsed: 1234 }, after)).toEqual({ elapsed: TOTAL });
  });

  it('越過 out：從未起播（如重新整理落在段落中段）也是跳到終點，不從 0 起播', () => {
    // 從 0 起播的話畫面上會無故閃一下文字（progress 初值是 0，
    // ScrollTrigger refresh 後才寫入真值）
    expect(gate(SYMBOL_INTRO_IDLE, after)).toEqual({ elapsed: TOTAL });
  });

  it('已在終點就不再動（同一個 state，rAF 不會被叫醒）', () => {
    const done = { elapsed: TOTAL };
    expect(gate(done, after)).toBe(done);
  });

  // 可逆是本次改版的重點：從下方往回捲進窗內時狀態要留在終點（＝全亮），
  // 讓退場的 scrub 把三行帶回來 —— 不是重置、更不是重播一次落字動畫。
  it('從 out 之外往回捲進窗內：維持在終點，讓 scrub 把文字帶回來', () => {
    const done = { elapsed: TOTAL };
    expect(gate(done, inside)).toBe(done);
  });

  // 退場沒有狀態 —— exit 這個門檻完全不參與狀態轉換。
  // 有人把退場也塞回狀態機時這條會壞掉。
  it('exit 門檻不參與狀態轉換', () => {
    const held = { elapsed: TOTAL };
    expect(gate(held, SYMBOL_INTRO.exit)).toBe(held);
    expect(gate(held, SYMBOL_INTRO.exit + 0.001)).toBe(held);
  });

  // 兩個門檻都用 `>=`，上面的案例卻刻意取嚴格內／外側 —— 邊界值本身也要守，
  // 否則有人改成 `>` 這批測試全部照樣綠。
  it('門檻邊界：p 恰等於 in 就起播', () => {
    expect(gate(SYMBOL_INTRO_IDLE, SYMBOL_INTRO.in)).toEqual({ elapsed: 0 });
  });

  it('門檻邊界：p 恰等於 out 就跳到終點', () => {
    expect(gate({ elapsed: 1234 }, SYMBOL_INTRO.out)).toEqual({
      elapsed: TOTAL,
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

  it('已起播、進場中段 → true', () => {
    expect(running({ elapsed: TOTAL / 2 })).toBe(true);
  });

  // 退場不需要 rAF：它逐幀跟著 symbolProgress，由 watch 重繪。
  // 有人把退場搬回 rAF 時這條會壞掉（迴圈會從 total 一路空轉到捲動結束）。
  it('elapsed 已到 total → false（之後停在全亮，退場不靠 rAF）', () => {
    expect(running({ elapsed: TOTAL })).toBe(false);
    expect(running({ elapsed: TOTAL * 10 })).toBe(false);
  });

  it('reduce-motion → 恆為 false（兩態切換沒有補間要跑）', () => {
    expect(running(SYMBOL_INTRO_IDLE, true)).toBe(false);
    expect(running({ elapsed: 0 }, true)).toBe(false);
    expect(running({ elapsed: TOTAL / 2 }, true)).toBe(false);
  });
});

describe('symbolIntroLineState（進場 × 退場的合成，含 reduce-motion 退化）', () => {
  const COUNT = 3;
  const TOTAL = symbolIntroTotal(COUNT);
  const HELD: SymbolIntroState = { elapsed: TOTAL }; // 三行到位、還沒開始退
  const MID_EXIT = (SYMBOL_INTRO.exit + SYMBOL_INTRO.out) / 2;

  // 這支就是使用者要的行為本身：不捲就不消失。
  it('到位之後、還沒捲到 exit → 三行全亮不動（不會自己消失）', () => {
    for (const p of [0, SYMBOL_INTRO.in, SYMBOL_INTRO.exit]) {
      for (let i = 0; i < COUNT; i++) {
        const r = symbolIntroLineState(HELD, p, i, COUNT, false);
        expect(r.opacity).toBe(1);
        expect(r.shift).toBeCloseTo(0);
        expect(r.reveal).toBe(1);
      }
    }
  });

  it('退場中：opacity 是兩條相乘、shift 是兩條相加、reveal 只由進場決定', () => {
    const k = symbolIntroExitK(MID_EXIT);
    for (let i = 0; i < COUNT; i++) {
      const enter = symbolIntroLineAt(TOTAL, i);
      const exit = symbolIntroExitAt(k, i, COUNT);
      const r = symbolIntroLineState(HELD, MID_EXIT, i, COUNT, false);
      expect(r.opacity).toBeCloseTo(enter.opacity * exit.opacity, 12);
      expect(r.shift).toBeCloseTo(enter.shift + exit.shift, 12);
      expect(r.reveal).toBe(enter.reveal); // 退場不跑亂碼
    }
  });

  // 捲很快的人會撞上這個 case，而改版前它不存在（時間軸的進場與退場是互斥的兩段）。
  // 兩條疊起來仍要連續 —— 不連續的話畫面上是「還在浮上來的字突然跳一下」。
  //
  // ⚠️ 取樣點要挑得讓兩條**都真的在半途**（第 1 行：進場窗過 3/4、退場窗過一半），
  //    否則測試會靜默退化成只在驗單邊 —— 故下面先斷言兩個因子都嚴格落在 (0, 1)。
  it('進場還沒跑完就被捲進退場區間：兩條疊起來仍然連續', () => {
    const LINE = 1;
    const s: SymbolIntroState = {
      elapsed: LINE * INTRO_TIMELINE.inStagger + INTRO_TIMELINE.inDur * 0.75,
    };
    const enter = symbolIntroLineAt(s.elapsed!, LINE);
    const exit = symbolIntroExitAt(symbolIntroExitK(MID_EXIT), LINE, COUNT);
    for (const factor of [enter.opacity, exit.opacity]) {
      expect(factor).toBeGreaterThan(0);
      expect(factor).toBeLessThan(1);
    }

    const a = symbolIntroLineState(s, MID_EXIT, LINE, COUNT, false);
    const b = symbolIntroLineState(s, MID_EXIT + 1e-6, LINE, COUNT, false);
    expect(a.opacity).toBeCloseTo(enter.opacity * exit.opacity, 12);
    expect(Math.abs(b.opacity - a.opacity)).toBeLessThan(0.01);
  });

  it('reduce-motion ＋ 未起播 → 未起播的藏狀態', () => {
    expect(symbolIntroLineState(SYMBOL_INTRO_IDLE, 0, 0, COUNT, true)).toEqual({
      opacity: 0,
      shift: INTRO_LINE_SHIFT,
      reveal: 0,
    });
  });

  it('reduce-motion ＋ 已起播 ＋ 還沒捲到 exit → 全亮，且與 elapsed 的值無關', () => {
    const expected = { opacity: 1, shift: 0, reveal: 1 };
    for (const elapsed of [0, 999999]) {
      expect(
        symbolIntroLineState({ elapsed }, SYMBOL_INTRO.exit, 1, COUNT, true),
      ).toEqual(expected);
    }
  });

  // 退場本身是捲動驅動、不受 WCAG 2.2.2 管，故仍保留淡出（否則文字會硬生生消失），
  // 但去掉逐行錯開與位移。
  it('reduce-motion 的退場：整組一起淡、無位移、三行完全同步', () => {
    const first = symbolIntroLineState(HELD, MID_EXIT, 0, COUNT, true);
    expect(first.opacity).toBeGreaterThan(0);
    expect(first.opacity).toBeLessThan(1);
    expect(first.shift).toBe(0);
    for (let i = 1; i < COUNT; i++) {
      expect(symbolIntroLineState(HELD, MID_EXIT, i, COUNT, true)).toEqual(
        first,
      );
    }
  });

  it('非 reduce-motion ＋ elapsed === null → 進場視為 t = 0（全透明）', () => {
    for (let i = 0; i < COUNT; i++) {
      expect(
        symbolIntroLineState(SYMBOL_INTRO_IDLE, 0, i, COUNT, false),
      ).toEqual(symbolIntroLineAt(0, i));
    }
  });
});
