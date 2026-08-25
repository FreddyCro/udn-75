import { describe, expect, it } from 'vitest';
import {
  CORE,
  COVER_CONTACT,
  COVER_HANDOFF_SPAN,
  coverContactAlign,
  coverHandoffAt,
  coverOrangeAt,
  planeSubmergedAt,
  PLANE_DIVE_MARGIN_PX,
  seedTravelAt,
  SEQUENCE,
  TRACK_VH,
} from '../app/utils/orange-core-config';
import { FORUM_PLANE_FRAMES } from '../app/utils/forum-plane-frames';

// 這支守的是曲線的**形狀**與「接觸點只有一個來源」，不是 0.5 這個值 ——
// 值本來就該能在真實畫面上調，形狀壞了才會出現說不清楚的破圖：
// 色塊帶著藍進入逐格臉那一屏、或白方塊沒落到格子上就換成臉。
describe('coverOrangeAt（藍 → 橘，標題／引言淡入共用）', () => {
  // 二元階梯：補間交給 CSS transition，不在這裡做（見函式註解）
  it('接觸前是藍', () => {
    expect(coverOrangeAt(0)).toBe(0);
    expect(coverOrangeAt(COVER_CONTACT * 0.5)).toBe(0);
  });

  it('接觸的那一刻就翻橘，其後維持橘', () => {
    expect(coverOrangeAt(COVER_CONTACT)).toBe(1);
    expect(coverOrangeAt(1)).toBe(1);
  });

  it('只有一個轉換點，就在 COVER_CONTACT', () => {
    const eps = 1e-6;
    expect(coverOrangeAt(COVER_CONTACT - eps)).toBe(0);
    expect(coverOrangeAt(COVER_CONTACT + eps)).toBe(1);
  });

  it('定義域外夾住（scrub 會餵進 0..1 之外的值）', () => {
    expect(coverOrangeAt(-1)).toBe(0);
    expect(coverOrangeAt(2)).toBe(1);
  });
});

describe('seedTravelAt（白方塊：接縫 → 臉的第 01 格）', () => {
  // 沉的起點 ＝ 長完的那一刻（見函式註解）。取樣點一律由它推算，不寫絕對值。
  const FROM = COVER_CONTACT + COVER_HANDOFF_SPAN;
  const span = 1 - FROM;

  it('接觸時貼在接縫上，cover 結束時正好就位', () => {
    expect(seedTravelAt(COVER_CONTACT)).toBe(0);
    expect(seedTravelAt(1)).toBe(1);
  });

  it('接觸之前不動', () => {
    expect(seedTravelAt(0)).toBe(0);
    expect(seedTravelAt(COVER_CONTACT * 0.5)).toBe(0);
  });

  // **這條守的是「從接縫長出來」這件事本身**：長大的整個窗口內方塊都不可以動，
  // 上緣一離開接縫，看起來就變成浮在色塊裡的一塊白（2026-08-14 的回饋）。
  it('長大的整個窗口內都還貼在接縫上', () => {
    for (const k of [0, 0.25, 0.5, 0.75, 1]) {
      expect(seedTravelAt(COVER_CONTACT + k * COVER_HANDOFF_SPAN)).toBe(0);
    }
  });

  it('區間內單調遞增', () => {
    const xs = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((k) => FROM + k * span);
    for (let i = 1; i < xs.length; i++) {
      expect(seedTravelAt(xs[i]!)).toBeGreaterThan(seedTravelAt(xs[i - 1]!));
    }
  });

  it('定義域外夾住', () => {
    expect(seedTravelAt(-1)).toBe(0);
    expect(seedTravelAt(2)).toBe(1);
  });

  // 兩端一階導數為 0（smoothstep 的性質）→ 起步像「從色塊邊緣被推出來」、
  // 末端緩緩落進格子，而不是硬轉折。用「靠端點的變化量遠小於中段」間接驗證。
  it('頭尾平滑：端點附近的變化量小於中段', () => {
    const step = span * 0.08;
    const d = (a: number, b: number) => seedTravelAt(b) - seedTravelAt(a);
    const head = d(FROM, FROM + step);
    const mid = d(FROM + span * 0.5 - step / 2, FROM + span * 0.5 + step / 2);
    const tail = d(1 - step, 1);
    expect(head).toBeLessThan(mid);
    expect(tail).toBeLessThan(mid);
  });
});

// 接觸點的變身（飛機鑽進色塊＋白方塊長出來）。這支守的是「一個值餵三個視覺」
// 與那條曲線的形狀 —— 形狀壞了會出現說不清楚的破圖：飛機在接觸點卡一下才動、
// 或白方塊還沒長完就開始往下沉。
describe('coverHandoffAt（飛機下潛／尾跡淡出／白方塊長出，共用一條曲線）', () => {
  it('接觸之前不動', () => {
    expect(coverHandoffAt(0)).toBe(0);
    expect(coverHandoffAt(COVER_CONTACT * 0.5)).toBe(0);
    expect(coverHandoffAt(COVER_CONTACT)).toBe(0);
  });

  it('窗口結束時剛好變身完成，其後維持 1', () => {
    expect(coverHandoffAt(COVER_CONTACT + COVER_HANDOFF_SPAN)).toBe(1);
    expect(coverHandoffAt(1)).toBe(1);
  });

  it('定義域外夾住（scrub 會餵進 0..1 之外的值）', () => {
    expect(coverHandoffAt(-1)).toBe(0);
    expect(coverHandoffAt(2)).toBe(1);
  });

  it('窗口內單調遞增', () => {
    const xs = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map(
      (k) => COVER_CONTACT + k * COVER_HANDOFF_SPAN,
    );
    for (let i = 1; i < xs.length; i++) {
      expect(coverHandoffAt(xs[i]!)).toBeGreaterThan(coverHandoffAt(xs[i - 1]!));
    }
  });

  // **這條是本次改版的重點**：飛機在接觸的前一刻還在以捲動速度飛，起手若像 smoothstep
  // 那樣一階導數為 0，看起來會是「碰到色塊先卡一下才鑽進去」。ease-out 的起手最快。
  // 用「頭段的變化量大於尾段」間接驗證（smoothstep 會是頭尾都小於中段）。
  it('起手最快、末端減速（不是兩端都平滑的 smoothstep）', () => {
    const step = COVER_HANDOFF_SPAN * 0.1;
    const at = (k: number) => coverHandoffAt(COVER_CONTACT + k * COVER_HANDOFF_SPAN);
    const d = (a: number, b: number) => at(b) - at(a);
    const head = d(0, 0.1);
    const mid = d(0.45, 0.55);
    const tail = d(0.9, 1);
    expect(head).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(tail);
    // 起手的斜率必須明顯不為 0（smoothstep 在同一個取樣寬度下約是這個值的 1/7）
    expect(d(0, 0.02)).toBeGreaterThan(0.02);
    expect(step).toBeGreaterThan(0); // 取樣寬度本身要有意義（SPAN > 0）
  });

  it('窗口落在接觸點與 cover 結束之間', () => {
    expect(COVER_HANDOFF_SPAN).toBeGreaterThan(0);
    expect(COVER_CONTACT + COVER_HANDOFF_SPAN).toBeLessThan(1);
  });
});

// 下潛的**距離**是量出來的（ForumCorePath 的 planeOverhang ＝ 機身露在接縫上方的那一截），
// 這裡只守那個餘裕：它加在「已經看不見」之後，放大只會把可見的那一段壓縮回去。
// 上限取機身最後一格的高，超過就表示有人又把它當成「總距離」在調了 —— 那正是
// 改版前 90px 那個版本的錯誤（實測捲 7px 就看不見，等於沒改）。
describe('PLANE_DIVE_MARGIN_PX（沒入之後多推的餘裕）', () => {
  const last = FORUM_PLANE_FRAMES.at(-1)!;

  it('是正的（確實推到接縫之下，不是剛好切齊）', () => {
    expect(PLANE_DIVE_MARGIN_PX).toBeGreaterThan(0);
  });

  it('只是餘裕，不是整段距離', () => {
    expect(PLANE_DIVE_MARGIN_PX).toBeLessThan(CORE.dotSize);
    expect(PLANE_DIVE_MARGIN_PX).toBeLessThan(last.h);
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

// 白方塊該長多少 ＝ 飛機沒入色塊多少。守的是「以機鼻為 0、機尾為 1」這件事 ——
// 2026-08-25 之前這個比例是拿捲動窗口（coverHandoffAt）當代理，而窗口的起點是
// 核心**定位點**抵達接縫，比機鼻晚一整個機身：pc 實測 lead 76.6 / back 14.5，
// 定位點抵達接縫時飛機已經沒入 84%，白方塊卻才要從 0 開始長。
describe('planeSubmergedAt（紙飛機沒入色塊的比例 ＝ 白方塊的 scaleY）', () => {
  const lead = 76.6;
  const back = 14.5;

  it('機鼻剛碰到接縫時是 0（定位點還在接縫上方一個 lead）', () => {
    expect(planeSubmergedAt(-lead, lead, back)).toBe(0);
  });

  it('機尾也沒入時是 1（定位點已在接縫下方一個 back）', () => {
    expect(planeSubmergedAt(back, lead, back)).toBe(1);
  });

  it('定位點抵達接縫時已經沒入一大半 —— 這就是原本的錯位', () => {
    const atContact = planeSubmergedAt(0, lead, back);
    expect(atContact).toBeCloseTo(lead / (lead + back), 5);
    expect(atContact).toBeGreaterThan(0.8);
  });

  it('窗口內線性、且兩端都夾得住', () => {
    expect(planeSubmergedAt((back - lead) / 2, lead, back)).toBeCloseTo(0.5, 5);
    expect(planeSubmergedAt(-1000, lead, back)).toBe(0);
    expect(planeSubmergedAt(1000, lead, back)).toBe(1);
  });

  it('還沒量到機身（跨距 0）時回 0，不拿假比例去長白方塊', () => {
    expect(planeSubmergedAt(0, 0, 0)).toBe(0);
    expect(planeSubmergedAt(500, 0, 0)).toBe(0);
  });
});
