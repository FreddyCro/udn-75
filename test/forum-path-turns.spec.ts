import { describe, expect, it } from 'vitest';
import {
  FORUM_TURN_MIN_ANGLE_DEG,
  FORUM_TURN_MIN_GAP_LEN,
  FORUM_TURN_SAMPLE_LEN,
  FORUM_TURN_SFX,
  FORUM_TURN_WALL_PAD,
  isWallContact,
  pickTurns,
  squashScaleAt,
  turnAngleDeg,
} from '../app/utils/forum-path-turns';
import { SOUND_MANIFEST } from '../app/utils/sound-manifest';
import { FORUM_FRONT_NODES } from '../app/utils/forum-node-path';
import { CORE, FORUM_TURN_SQUASH } from '../app/utils/orange-core-config';

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

  // 第二條入選路徑（2026-08-26）：角度不夠但貼邊也算撞擊。實地成因見
  // FORUM_TURN_WALL_PAD —— mob 的 P5/P6/P7 與 pad 的 Q10 都是 36–51° 的大弧擦牆。
  it('角度不夠但貼邊的節點也入選，並標記 wall', () => {
    const turns = pickTurns({
      ...build(
        { A: 0, B: 40, C: 130, D: 0 },
        { A: 0, B: 1000, C: 2000, D: 3000 },
      ),
      minAngleDeg: 90,
      minGapLen: 0,
      wallHit: (id) => id === 'B',
    });
    expect(turns.map((t) => t.id)).toEqual(['B', 'C']);
    expect(turns.find((t) => t.id === 'B')?.wall).toBe(true);
  });

  // 角度本來就過門檻的不該被標成 wall —— dashboard 上那個旗子要能回答
  // 「這一聲是靠貼邊撈回來的嗎」，兩者混在一起就失去意義。
  it('角度過門檻的節點不標 wall，即使它同時貼邊', () => {
    const turns = pickTurns({
      ...build({ A: 130 }, { A: 1000 }),
      minAngleDeg: 90,
      minGapLen: 0,
      wallHit: () => true,
    });
    expect(turns[0]?.wall).toBeUndefined();
  });

  // 不傳 wallHit ＝ 既有行為（只看角度）。這支守的是「補這條規則沒有改動舊路徑」。
  it('不傳 wallHit 時只用角度判', () => {
    const turns = pickTurns({
      ...build({ A: 40, B: 130 }, { A: 1000, B: 2000 }),
      minAngleDeg: 90,
      minGapLen: 0,
    });
    expect(turns.map((t) => t.id)).toEqual(['B']);
  });

  // 兩種入選方式共用同一個 lastLen：各記一個游標的話，「貼邊點緊接在硬轉角後面」
  // 會連響兩聲 —— 而那正是 mob 的 P11(143°) → P12 型態，間隔只有 273px。
  it('貼邊點與硬轉角共用同一道間隔閘門', () => {
    const turns = pickTurns({
      ...build({ A: 130, B: 40 }, { A: 1000, B: 1100 }),
      minAngleDeg: 90,
      minGapLen: 200,
      wallHit: (id) => id === 'B',
    });
    expect(turns.map((t) => t.id)).toEqual(['A']);
  });
});

describe('isWallContact', () => {
  const W = 375; // mob 實測容器寬

  it('貼左緣且 x 是局部最小 → 撞牆', () => {
    expect(isWallContact(40, 2, 40, W)).toBe(true);
  });

  it('貼右緣且 x 是局部最大 → 撞牆', () => {
    expect(isWallContact(340, 373, 340, W)).toBe(true);
  });

  // 沿著邊緣「直行」不是撞擊 —— 少了極值條件，路過的每個節點都會出聲。
  it('貼著邊緣直行不算撞牆', () => {
    expect(isWallContact(2, 5, 8, W)).toBe(false); // 一路往右，不是局部最小
    expect(isWallContact(373, 370, 367, W)).toBe(false); // 一路往左，不是局部最大
  });

  // 畫面中央的髮夾彎由角度那條路負責，不該被貼邊規則重複收進來。
  it('離邊緣夠遠的極值不算撞牆', () => {
    expect(isWallContact(200, 187, 200, W)).toBe(false);
    expect(isWallContact(100, 54, 100, W)).toBe(false); // mob P4：距邊 54，最近的非貼邊節點
  });

  // 幾何還沒量好時（build 之前、斷點切換途中）座標不可信，寧可少一聲。
  it('width ≤ 0 回 false', () => {
    expect(isWallContact(40, 2, 40, 0)).toBe(false);
    expect(isWallContact(40, 2, 40, -1)).toBe(false);
  });

  // 實測值回歸：這四個是設計師回報「碰到邊沒聲音」的那四個節點。
  it('實測的四個貼邊節點都判為撞牆', () => {
    expect(isWallContact(300, 373, 300, 375)).toBe(true); // mob P5  x=373
    expect(isWallContact(60, 2, 60, 375)).toBe(true); // mob P6  x=2
    expect(isWallContact(300, 373, 300, 375)).toBe(true); // mob P7  x=373
    expect(isWallContact(80, 5, 80, 768)).toBe(true); // pad Q10 x=5
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
    expect(FORUM_TURN_WALL_PAD).toBeGreaterThan(0);
  });

  // 實測的安全區間：貼邊節點量到 2–5px、最近的非貼邊節點 54px（見 FORUM_TURN_WALL_PAD）。
  // 掉出這個區間就會漏掉貼邊點或收進不貼邊的緩彎，而兩種都只有耳朵聽得出來。
  it('貼邊門檻落在實測的安全區間內', () => {
    expect(FORUM_TURN_WALL_PAD).toBeGreaterThan(5);
    expect(FORUM_TURN_WALL_PAD).toBeLessThan(54);
  });

  // 貼邊判定吃的是核心「半寬」的尺度：路徑中心離邊緣不到半個核心寬，方塊就抵著邊緣了。
  // 門檻比半寬小就等於要求核心陷進邊緣才算撞到。
  it('貼邊門檻不小於核心半寬', () => {
    expect(FORUM_TURN_WALL_PAD).toBeGreaterThanOrEqual(CORE.dotSize / 2);
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

describe('squashScaleAt', () => {
  const { size } = FORUM_TURN_SQUASH;
  const base = CORE.dotSize;

  it('amount 0 ＝ 原尺寸（撞擊之外的每一幀都必須完全不動）', () => {
    const [sx, sy] = squashScaleAt(0, size, base);
    expect(sx).toBe(1);
    expect(sy).toBe(1);
  });

  // 這條是與稿的唯一對帳：26×26 壓到 32×17（2652-52697 → 2652-52711）。
  it('amount 1 ＝ 稿上的撞擊形狀', () => {
    const [sx, sy] = squashScaleAt(1, size, base);
    expect(sx * base).toBeCloseTo(32);
    expect(sy * base).toBeCloseTo(17);
  });

  // 壓的是「沿行進方向」那一軸（local y），側向鼓出去。反過來就是撞到側面了。
  it('側向鼓出、行進方向壓扁', () => {
    const [sx, sy] = squashScaleAt(1, size, base);
    expect(sx).toBeGreaterThan(1);
    expect(sy).toBeLessThan(1);
  });

  // back.out 的回彈會讓 amount 越過 0 變負 ＝ 反向的拉長（「再彈起」）。
  // 夾掉就沒有彈性了，故這裡明確守著「不 clamp」。
  it('負的 amount ＝ 反向拉長，不被夾成 1', () => {
    const [sx, sy] = squashScaleAt(-0.1, size, base);
    expect(sx).toBeLessThan(1);
    expect(sy).toBeGreaterThan(1);
  });

  it('兩軸都線性內插', () => {
    const [sx, sy] = squashScaleAt(0.5, size, base);
    expect(sx * base).toBeCloseTo((26 + 32) / 2);
    expect(sy * base).toBeCloseTo((26 + 17) / 2);
  });

  // fail-soft 同 slashCoreScaleAt：形變壞掉時看到的該是「沒有形變」，不是核心塌成 0。
  it('base ≤ 0 → 不形變', () => {
    expect(squashScaleAt(1, size, 0)).toEqual([1, 1]);
    expect(squashScaleAt(1, size, -26)).toEqual([1, 1]);
    expect(squashScaleAt(1, size, Number.NaN)).toEqual([1, 1]);
  });
});

describe('FORUM_TURN_SQUASH', () => {
  // 撞上去要比彈回來快 —— 兩段等長會像在呼吸，不像撞擊。
  it('壓下去比彈回來快，且兩段都是正的秒數', () => {
    expect(FORUM_TURN_SQUASH.inDur).toBeGreaterThan(0);
    expect(FORUM_TURN_SQUASH.outDur).toBeGreaterThan(FORUM_TURN_SQUASH.inDur);
  });

  // 整段撞擊要短於「快速捲動下兩個轉折的最短間隔」的量級 —— 拖太長會變成一路壓著跑。
  it('整段撞擊在半秒以內', () => {
    expect(FORUM_TURN_SQUASH.inDur + FORUM_TURN_SQUASH.outDur).toBeLessThan(0.5);
  });

  // 壓扁不該把面積放大到誇張（那會看起來像變大而不是被壓）。
  it('撞擊形狀的面積不大於原尺寸', () => {
    const [w, h] = FORUM_TURN_SQUASH.size;
    expect(w * h).toBeLessThanOrEqual(CORE.dotSize * CORE.dotSize);
  });
});
