import { describe, expect, it } from 'vitest';
import {
  FORUM_TURN_MIN_ANGLE_DEG,
  FORUM_TURN_MIN_GAP_LEN,
  FORUM_TURN_SAMPLE_LEN,
  FORUM_TURN_SFX,
  pickTurns,
  turnAngleDeg,
} from '../app/utils/forum-path-turns';
import { SOUND_MANIFEST } from '../app/utils/sound-manifest';
import { FORUM_FRONT_NODES } from '../app/utils/forum-node-path';

describe('turnAngleDeg', () => {
  it('直行 ＝ 0°', () => {
    expect(turnAngleDeg([0, 0], [10, 0], [20, 0])).toBeCloseTo(0);
    expect(turnAngleDeg([0, 0], [10, 10], [20, 20])).toBeCloseTo(0);
  });

  it('直角 ＝ 90°', () => {
    expect(turnAngleDeg([0, 0], [10, 0], [10, 10])).toBeCloseTo(90);
  });

  it('完全折回 ＝ 180°（髮夾彎的極限）', () => {
    expect(turnAngleDeg([0, 0], [10, 0], [0, 0])).toBeCloseTo(180);
  });

  // 出聲與轉向無關，故取絕對值 —— 左右對稱的兩個彎必須是同一個數字，
  // 不然門檻會變成「只有某個轉向的彎才響」。
  it('左轉與右轉同值', () => {
    const right = turnAngleDeg([0, 0], [10, 0], [10, 10]);
    const left = turnAngleDeg([0, 0], [10, 0], [10, -10]);
    expect(left).toBeCloseTo(right);
  });

  // 不正規化到 (−180, 180] 的話，「往回折」會算成 260° 之類的值 → 恆過門檻。
  it('鈍角折回不會算出大於 180 的角', () => {
    const a = turnAngleDeg([0, 0], [10, 0], [-5, 3]);
    expect(a).toBeGreaterThan(90);
    expect(a).toBeLessThanOrEqual(180);
  });

  // atan2(0, 0) 沒有方向；回 NaN 會讓 `angle >= 門檻` 靜默恆 false。
  it('相鄰兩點重合回 0，不是 NaN', () => {
    expect(turnAngleDeg([10, 10], [10, 10], [20, 20])).toBe(0);
    expect(turnAngleDeg([0, 0], [10, 10], [10, 10])).toBe(0);
  });
});

describe('pickTurns', () => {
  /** 造測資：id → 角度、id → 弧長。pathLen 取最大弧長。 */
  const build = (
    angles: Record<string, number>,
    lens: Record<string, number>,
  ) => ({
    order: Object.keys(angles),
    angleAt: (id: string) => angles[id],
    lenAt: (id: string) => lens[id],
    pathLen: Math.max(...Object.values(lens)) || 1,
  });

  it('只選轉角過門檻的節點，近直線的補點落選', () => {
    const turns = pickTurns({
      ...build(
        { A: 0, B: 120, C: 4, D: 130, E: 0 },
        { A: 0, B: 1000, C: 2000, D: 3000, E: 4000 },
      ),
      minAngleDeg: 90,
      minGapLen: 0,
    });
    expect(turns.map((t) => t.id)).toEqual(['B', 'D']);
  });

  // 路徑端點的排除**不在這裡**：它靠 angleAt 在兩端取樣越界時回 undefined（見下一支）。
  // pickTurns 本身不按索引跳過首尾 —— 曾經那樣寫，結果把「第一個量得到角度的節點」誤殺
  // （端點已經在剔除那一步消失了，索引 0 其實是第一個有效節點）。
  // 實測 mob 的 P1（線頭那個 147° 的硬右轉）就是這樣整個斷點少掉最明顯的一個彎。
  it('第一個有效節點就能入選（端點的排除不靠索引）', () => {
    const turns = pickTurns({
      ...build({ A: 147, B: 4, C: 120 }, { A: 400, B: 500, C: 1000 }),
      minAngleDeg: 90,
      minGapLen: 300,
    });
    expect(turns.map((t) => t.id)).toEqual(['A', 'C']);
  });

  // 髮夾彎的頂點與回程點都是大轉角，而兩者弧長只差百來 px ——
  // 這道閘門就是為了不在同一個彎裡連響兩聲。
  it('弧長太近的第二個彎被濾掉', () => {
    const angles = { A: 0, B: 120, C: 118, D: 130, E: 0 };
    const lens = { A: 0, B: 1000, C: 1100, D: 3000, E: 4000 };
    const near = pickTurns({ ...build(angles, lens), minAngleDeg: 90, minGapLen: 300 });
    expect(near.map((t) => t.id)).toEqual(['B', 'D']);
    // 間隔放寬到 0 → C 也會入選，證明它本來就過角度門檻、是被間隔濾掉的
    const all = pickTurns({ ...build(angles, lens), minAngleDeg: 90, minGapLen: 0 });
    expect(all.map((t) => t.id)).toEqual(['B', 'C', 'D']);
  });

  // 連續三個大轉角時，中間那個被間隔濾掉不該讓第三個「接著通過」——
  // 否則密集彎區還是會連響。故比的是「前一個入選」而非「前一個節點」。
  it('間隔比的是前一個入選的轉折，不是前一個節點', () => {
    const turns = pickTurns({
      ...build(
        { A: 0, B: 120, C: 118, D: 130, E: 0 },
        { A: 0, B: 1000, C: 1100, D: 1200, E: 4000 },
      ),
      minAngleDeg: 90,
      minGapLen: 300,
    });
    // C 距 B 100（濾掉）、D 距 B 200 也不足 300 → 只有 B
    expect(turns.map((t) => t.id)).toEqual(['B']);
  });

  // 角度量不到（兩端越界）或弧長查不到（optional 節點被 ?highlights 跳掉）→ 剔除。
  it('角度或弧長查不到的節點被剔除', () => {
    const turns = pickTurns({
      order: ['A', 'NO_ANGLE', 'B', 'NO_LEN', 'C'],
      angleAt: (id) => ({ A: 0, NO_LEN: 150, B: 120, C: 0 })[id],
      lenAt: (id) => ({ A: 0, NO_ANGLE: 500, B: 1000, C: 2000 })[id],
      pathLen: 2000,
      minAngleDeg: 90,
      minGapLen: 0,
    });
    expect(turns.map((t) => t.id)).toEqual(['B']);
  });

  it('mark ＝ len / pathLen，與路徑事件同一個座標系', () => {
    const turns = pickTurns({
      ...build({ A: 0, B: 120, C: 0 }, { A: 0, B: 1000, C: 4000 }),
      minAngleDeg: 90,
      minGapLen: 0,
    });
    expect(turns[0]!.mark).toBeCloseTo(0.25);
  });

  // NaN / Infinity 的 mark 在面板上只會顯示成壞掉，看不出真正的原因是線還沒量好。
  it('pathLen ≤ 0 回空表，不回 NaN 的 mark', () => {
    const turns = pickTurns({
      order: ['A', 'B', 'C'],
      angleAt: (id) => ({ A: 0, B: 120, C: 0 })[id],
      lenAt: (id) => ({ A: 0, B: 1000, C: 2000 })[id],
      pathLen: 0,
    });
    expect(turns).toEqual([]);
  });
});

describe('設定值', () => {
  // 打錯 key 會讓 useSfx 的 play() 直接 return —— 完全靜默。型別本來就守著，
  // 這支是給「音效檔被移出 SOUND_MANIFEST」那種情形的第二道網。
  it('FORUM_TURN_SFX 在音效清單裡', () => {
    expect(Object.hasOwn(SOUND_MANIFEST, FORUM_TURN_SFX)).toBe(true);
  });

  // 這些門檻只要有一個被設成 0 或負數，整套判定就退化（0° ＝ 每個節點都是轉折；
  // 取樣半徑 0 ＝ 三個點重合 → turnAngleDeg 一律回 0 → 完全不出聲，而且是靜默的）。
  it('門檻與取樣半徑都是正數', () => {
    expect(FORUM_TURN_MIN_ANGLE_DEG).toBeGreaterThan(0);
    expect(FORUM_TURN_MIN_GAP_LEN).toBeGreaterThan(0);
    expect(FORUM_TURN_SAMPLE_LEN).toBeGreaterThan(0);
  });

  // 取樣半徑必須遠小於最小間隔，否則「前後各取一點」會跨進鄰近的彎，把折角抹平。
  it('取樣半徑遠小於最小間隔', () => {
    expect(FORUM_TURN_SAMPLE_LEN * 4).toBeLessThan(FORUM_TURN_MIN_GAP_LEN);
  });

  // pickTurns 依賴 order 是「線上順序」（轉角看前後鄰居、間隔跟前一個入選比）。
  // 三個斷點的前半段節點表就是那個順序的來源，至少要有三個點才算得出一個轉角。
  it('三個斷點的前半段都有足夠的節點算轉角', () => {
    for (const bp of ['pc', 'pad', 'mob'] as const) {
      expect(FORUM_FRONT_NODES[bp].length).toBeGreaterThanOrEqual(3);
    }
  });
});
