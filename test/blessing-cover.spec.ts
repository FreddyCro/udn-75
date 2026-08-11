import { describe, expect, it } from 'vitest';
import {
  COVER_CONTACT,
  COVER_ORANGE_FADE,
  coverContactAlign,
  coverOrangeAt,
  seedTravelAt,
  SEQUENCE,
  TRACK_VH,
} from '../app/utils/orange-core-config';

// 這支守的是曲線的**形狀**與「接觸點只有一個來源」，不是 0.5 / 0.06 這兩個值 ——
// 值本來就該能在真實畫面上調，形狀壞了才會出現說不清楚的破圖：
// 色塊帶著藍進入逐格臉那一屏、或白方塊沒落到格子上就換成臉。
describe('coverOrangeAt（藍 → 橘，標題／引言淡入共用）', () => {
  it('接觸前全藍', () => {
    expect(coverOrangeAt(0)).toBe(0);
    expect(coverOrangeAt(COVER_CONTACT)).toBe(0);
  });

  it('淡出窗口末端已全橘，其後維持 1', () => {
    expect(coverOrangeAt(COVER_CONTACT + COVER_ORANGE_FADE)).toBe(1);
    expect(coverOrangeAt(1)).toBe(1);
  });

  // 取樣點一律用常數推出來，不寫絕對值 —— 那兩個常數要在真實畫面上反覆調，
  // 寫死的取樣點會在調值後落到曲線的其他區段，測試就失去意義了。
  it('窗口內單調遞增', () => {
    const xs = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map(
      (k) => COVER_CONTACT + k * COVER_ORANGE_FADE,
    );
    for (let i = 1; i < xs.length; i++) {
      expect(coverOrangeAt(xs[i]!)).toBeGreaterThan(coverOrangeAt(xs[i - 1]!));
    }
  });

  it('定義域外夾住（scrub 會餵進 0..1 之外的值）', () => {
    expect(coverOrangeAt(-1)).toBe(0);
    expect(coverOrangeAt(2)).toBe(1);
  });

  // 轉橘必須在 cover 結束前完成，否則色塊會帶著藍進入逐格臉那一屏。
  it('轉橘在 cover 結束前完成', () => {
    expect(COVER_ORANGE_FADE).toBeGreaterThan(0);
    expect(COVER_CONTACT + COVER_ORANGE_FADE).toBeLessThan(1);
  });
});

describe('seedTravelAt（白方塊：接縫 → 臉的第 01 格）', () => {
  it('接觸時貼在接縫上，cover 結束時正好就位', () => {
    expect(seedTravelAt(COVER_CONTACT)).toBe(0);
    expect(seedTravelAt(1)).toBe(1);
  });

  it('接觸之前不動', () => {
    expect(seedTravelAt(0)).toBe(0);
    expect(seedTravelAt(COVER_CONTACT * 0.5)).toBe(0);
  });

  it('區間內單調遞增', () => {
    const span = 1 - COVER_CONTACT;
    const xs = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map(
      (k) => COVER_CONTACT + k * span,
    );
    for (let i = 1; i < xs.length; i++) {
      expect(seedTravelAt(xs[i]!)).toBeGreaterThan(seedTravelAt(xs[i - 1]!));
    }
  });

  it('定義域外夾住', () => {
    expect(seedTravelAt(-1)).toBe(0);
    expect(seedTravelAt(2)).toBe(1);
  });

  // 兩端一階導數為 0（smoothstep 的性質）→ 接觸後像「從色塊邊緣冒出來」、
  // 末端緩緩落進格子，而不是硬轉折。用「靠端點的變化量遠小於中段」間接驗證。
  it('頭尾平滑：端點附近的變化量小於中段', () => {
    const span = 1 - COVER_CONTACT;
    const step = span * 0.08;
    const d = (a: number, b: number) => seedTravelAt(b) - seedTravelAt(a);
    const head = d(COVER_CONTACT, COVER_CONTACT + step);
    const mid = d(
      COVER_CONTACT + span * 0.5 - step / 2,
      COVER_CONTACT + span * 0.5 + step / 2,
    );
    const tail = d(1 - step, 1);
    expect(head).toBeLessThan(mid);
    expect(tail).toBeLessThan(mid);
  });
});

// 接觸點是「飛機走完路徑」與「色塊變橘」共用的**單一**來源：ForumCorePath 的
// ScrollTrigger end 讀 coverContactAlign()。兩邊各寫一份就會在調值時脫鉤 ——
// 症狀是飛機已經被色塊蓋住但底色還是藍的（或反過來）。
describe('coverContactAlign（ForumCorePath 的 end 對齊字串）', () => {
  it('由 COVER_CONTACT 導出，0.5 → 視窗中央', () => {
    expect(coverContactAlign()).toBe(`${(1 - COVER_CONTACT) * 100}%`);
  });

  it('改動前的行為是 center（＝ 50%），故預設值必須是 0.5', () => {
    expect(COVER_CONTACT).toBe(0.5);
    expect(coverContactAlign()).toBe('50%');
  });

  it('接觸點落在 cover 軌之內', () => {
    expect(COVER_CONTACT).toBeGreaterThan(0);
    expect(COVER_CONTACT).toBeLessThan(1);
  });
});

describe('cover 在 SEQUENCE 上的位置', () => {
  const blessing = SEQUENCE.find((c) => c.key === 'blessing')!;

  it('blessing 章的第一個 part 是 cover，吃 cover 軌', () => {
    const first = blessing.parts[0];
    expect(first?.key).toBe('cover');
    expect(first?.drive).toBe('scrub');
    expect(first?.track).toBe('cover');
  });

  it('cover 之後緊接著逐格臉', () => {
    expect(blessing.parts[1]?.key).toBe('face');
  });

  // 軌長是幾何常數（`top bottom` → `top top` 恆為一個視窗高），不像 path / forumPath
  // 要量測，所以 dashboard 給得出 vh。斷言 1 是因為它**不是**可調旋鈕。
  it('cover 軌長恆為一個視窗高', () => {
    expect(TRACK_VH.cover).toBe(1);
  });

  it('攤平後沒有相鄰的兩個無軌 part', () => {
    const flat = SEQUENCE.flatMap((c) => c.parts);
    for (let i = 1; i < flat.length; i++) {
      const adjacent =
        flat[i]!.drive === 'none' && flat[i - 1]!.drive === 'none';
      expect(adjacent).toBe(false);
    }
  });
});
