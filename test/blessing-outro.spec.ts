import { describe, expect, it } from 'vitest';
import {
  BLESSING_OUT_FADE,
  BLESSING_OUT_VH,
  outroWhiteAt,
  partnersFadeAt,
  SEQUENCE,
  TRACK_VH,
} from '../app/utils/orange-core-config';

// 這支守的是曲線的**形狀**，不是 0.65 這個值 —— 值本來就該能自由微調（節奏要在
// 真實畫面上調），但形狀壞了會出現說不清楚的破圖：淡出沒收乾淨就開始收窄。
//
// 2026-08-18：呼吸拍（1 − BLESSING_OUT_FADE）已刻意歸零，故它不再是本支要守的性質。
// 剩下的不變量是「窗口結束時一定已經淡乾淨」——FADE ≤ 1 就成立，而 FADE > 1 會讓
// 夥伴清單殘留到 media 開始收窄之後（見該常數的 ⚠️）。
describe('partnersFadeAt', () => {
  it('窗口起點全不透明', () => {
    expect(partnersFadeAt(0)).toBe(1);
  });

  // FADE = 1.0 時兩個斷言落在同一點（呼吸拍歸零）；調回 < 1 時第二個斷言才另外
  // 守住「其後維持 0」。刻意兩個都留，旋鈕來回調都不必改測試。
  it('淡出門檻處已全透明，窗口結束時仍是 0', () => {
    expect(partnersFadeAt(BLESSING_OUT_FADE)).toBe(0);
    expect(partnersFadeAt(1)).toBe(0);
  });

  // FADE > 1 會讓淡出在接縫離開視窗頂之後才收完 —— 那時 media 已在收窄，
  // 夥伴清單會殘留在橘塊上。這是那個常數唯一的硬上限。
  it('淡出不得晚於窗口結束', () => {
    expect(BLESSING_OUT_FADE).toBeGreaterThan(0);
    expect(BLESSING_OUT_FADE).toBeLessThanOrEqual(1);
  });

  // 取樣點一律用 BLESSING_OUT_FADE 的比例，不寫絕對值 —— 那個常數是要在真實畫面上
  // 反覆調的，寫死的取樣點會在調值後落到曲線的其他區段，測試就失去意義了。
  it('區間內單調遞減', () => {
    const xs = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map(
      (k) => k * BLESSING_OUT_FADE,
    );
    for (let i = 1; i < xs.length; i++) {
      expect(partnersFadeAt(xs[i]!)).toBeLessThan(partnersFadeAt(xs[i - 1]!));
    }
  });

  it('定義域外夾住（scrub 會餵進 0..1 之外的值）', () => {
    expect(partnersFadeAt(-1)).toBe(1);
    expect(partnersFadeAt(2)).toBe(0);
  });

  // 兩端一階導數為 0（smoothstep 的性質）→ scrub 淡出的頭尾沒有硬轉折。
  // 用「靠端點的變化量遠小於中段」來間接驗證。
  it('頭尾平滑：端點附近的變化量小於中段', () => {
    const F = BLESSING_OUT_FADE;
    const step = F * 0.08;
    const d = (a: number, b: number) => partnersFadeAt(a) - partnersFadeAt(b);
    const head = d(0, step);
    const middle = d(F * 0.5 - step / 2, F * 0.5 + step / 2);
    const tail = d(F - step, F);
    expect(head).toBeLessThan(middle);
    expect(tail).toBeLessThan(middle);
  });
});

// veil 與底色切白必須同生共死。任一單獨生效都是破圖：
//   只有白底 ＝ blessing 變成白底白字（reduce-motion / 無 JS / #media 深連結）
//   只有 veil ＝ 收窄後兩側露出的是橘、不是白，接縫變成一條可見的橫線
// 閘門是「media 的 timeline 真的建起來了嗎」（mediaMotionArmed）。
describe('outroWhiteAt', () => {
  it('timeline 沒建起來時恆為 0（三條降級路徑）', () => {
    expect(outroWhiteAt(false, 0)).toBe(0);
    expect(outroWhiteAt(false, 0.5)).toBe(0);
    expect(outroWhiteAt(false, 1)).toBe(0);
  });

  it('窗口還沒開始時是 0', () => {
    expect(outroWhiteAt(true, 0)).toBe(0);
  });

  // 硬切、不補間：切換那一刻 veil 剛好是滿版（fromTo 的起點），完全遮住底色。
  // 補間會多出一條要與 veil 對齊的曲線，那是白花的風險。
  it('窗口一開始就是 1，全程維持', () => {
    expect(outroWhiteAt(true, 0.001)).toBe(1);
    expect(outroWhiteAt(true, 0.5)).toBe(1);
    expect(outroWhiteAt(true, 1)).toBe(1);
  });
});

describe('永續祝福退場在 SEQUENCE 上的位置', () => {
  const blessing = SEQUENCE.find((c) => c.key === 'blessing')!;

  it('blessing 章尾端是 outro，吃 blessingOut 軌', () => {
    const last = blessing.parts.at(-1);
    expect(last?.key).toBe('outro');
    expect(last?.drive).toBe('scrub');
    expect(last?.track).toBe('blessingOut');
  });

  // 軌長是設定值而非量測值，dashboard 才給得出 vh。斷言的是「兩邊同一個來源」，
  // 不是 0.6 這個數字 —— 長度本來就要在真實畫面上調。
  it('blessingOut 軌長就是 BLESSING_OUT_VH，沒有第二份數字', () => {
    expect(TRACK_VH.blessingOut).toBe(BLESSING_OUT_VH);
  });

  // 窗口的終點鎖在接縫（media 的 top top），起點往回退 BLESSING_OUT_VH 個視窗高。
  // 超過 1 的話起點會退到 section 下緣還在視窗底下方 —— 那時 media 尚未進場，
  // 淡出會在使用者看不到接縫的位置就開始，且 ScrollTrigger 的 start 會早於 end。
  it('退場窗口不超過一個視窗高', () => {
    expect(BLESSING_OUT_VH).toBeGreaterThan(0);
    expect(BLESSING_OUT_VH).toBeLessThanOrEqual(1);
  });

  // 無軌 part 的「結束了沒」靠下一段反推（見 useCoreSequence 的 ②），
  // 所以 partners 後面一定要有東西 —— 在 outro 之前它是序列末端，
  // 永遠停在未完成，dashboard 的游標會卡在那裡。
  it('夥伴清單（無軌 part）後面有軌可以反推它結束', () => {
    const i = blessing.parts.findIndex((p) => p.key === 'partners');
    expect(i).toBeGreaterThanOrEqual(0);
    expect(blessing.parts[i + 1]?.drive).toBe('scrub');
  });

  // 攤平後檢查（useCoreSequence 是跨章節攤平成單一序列的）
  it('攤平後沒有相鄰的兩個無軌 part', () => {
    const flat = SEQUENCE.flatMap((c) => c.parts);
    for (let i = 1; i < flat.length; i++) {
      const adjacent =
        flat[i]!.drive === 'none' && flat[i - 1]!.drive === 'none';
      expect(adjacent).toBe(false);
    }
  });
});
