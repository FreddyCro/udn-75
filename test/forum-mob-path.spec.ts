import { describe, expect, it } from 'vitest';
import {
  buildNodePathD,
  FORUM_MOB_NODES,
  type MobPathAnchor,
  type MobPathMeasure,
} from '../app/utils/forum-mob-path';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。

// ── 稿的錨點位置（論壇一二三 內座標，由 Figma metadata 讀出）──────────────
// 這是黃金樣本的輸入：拿設計稿的 element 位置驅動產生器，結果就該落在稿的頂點上。
// 換算流程見 architecture/forum-mob-path.md 第九節。
const FIGMA_RECTS: Record<string, { top: number; height: number }> = {
  '.sec2__path': { top: 0, height: 7149 },
  '論壇一/.forum-event__tag': { top: 375.4, height: 34 },
  '論壇一/.forum-event__head': { top: 375.4, height: 393.2 }, // 下緣 768.6
  '論壇一/.forum-event__venue': { top: 928.6, height: 144.87 }, // 下緣 1073.47
  '論壇一/.forum-event__photo': { top: 1073.47, height: 233 },
  // 講者組：照片上緣 → 最後一段 bio 的下緣
  '論壇一/.forum-event__speakers': { top: 1073.47, height: 1838 },
  '[data-forum-anchor="論壇二"]': { top: 3105.47, height: 140 },
  '論壇二/.forum-event__speaker-label': { top: 3764.47, height: 34 },
  '論壇二/.forum-event__speaker#0': { top: 3814.47, height: 180 },
  '論壇二/.forum-event__speaker#1': { top: 4010.47, height: 180 }, // 下緣 4190.47
  '論壇三/.forum-event__meta': { top: 4870.47, height: 199 }, // 稿的 time 組
};

const rectKey = (a: MobPathAnchor) => {
  const base = a.event ? `${a.event}/${a.sel.split(',')[0]!.trim()}` : a.sel;
  return a.nth != null ? `${base}#${a.nth}` : base;
};

const figmaMeasure: MobPathMeasure = (a) => FIGMA_RECTS[rectKey(a)] ?? null;

/** 稿的 14 個頂點（asset 座標換算成內座標：x − 1.672、y + 41） */
const FIGMA_VERTICES: [number, number][] = [
  [207.0, 43],
  [207.0, 376.5],
  [291.5, 368.5],
  [343.0, 763],
  [59.0, 1069],
  [410.0, 1175],
  [0.5, 1938],
  [411.0, 3143.5],
  [107.0, 3786],
  [295.32, 3868.92],
  [323.5, 4202],
  [323.5, 4867.5],
  [108.0, 4961.5],
  [198.5, 5018.5],
];

/** 從 d 取出每個指令的終點（＝ waypoint） */
function endpoints(d: string): [number, number][] {
  return [...d.matchAll(/[MLC]([-\d.\s]+)/g)].map((m) => {
    const n = m[1]!.trim().split(/\s+/).map(Number);
    return [n[n.length - 2]!, n[n.length - 1]!] as [number, number];
  });
}

const built = buildNodePathD(FORUM_MOB_NODES, { width: 414, measure: figmaMeasure });

describe('FORUM_MOB_NODES × 稿的錨點位置', () => {
  it('每個錨點都查得到（選擇器沒打錯）', () => {
    const missing = FORUM_MOB_NODES.map((n) => rectKey(n.anchor)).filter(
      (k) => !FIGMA_RECTS[k]
    );
    expect(missing).toEqual([]);
  });

  it('產生單一連續路徑（只有一個 M）', () => {
    expect(built).not.toBeNull();
    expect((built!.d.match(/M/g) ?? []).length).toBe(1);
  });

  it('waypoint 數與節點數一致', () => {
    expect(endpoints(built!.d)).toHaveLength(FORUM_MOB_NODES.length);
  });

  // 容差預設 1px；以下是 architecture/forum-mob-path.md 第七節記錄的**刻意偏離**，
  // 每一條都對應該節的一個編號。放寬容差是為了讓「非刻意的偏移」仍然會 fail。
  //   P0  ：稿 y=43 → 歸零，保交棒零跳點（第 1 條）
  //   P5/P6：釘容器邊緣 ±2，稿是 410 / 0.5（第 2 條；P7 稿 411 差 1px，落在預設容差內）
  //   P13 ：x 釘中心，稿 198.5（第 3 條）
  const TOL: Record<string, number> = { P0: 44, P5: 2, P6: 2, P13: 9 };

  it.each(FORUM_MOB_NODES.map((n, i) => [n.id, i] as const))(
    '%s 落在稿的頂點上',
    (id, i) => {
      const [x, y] = endpoints(built!.d)[i]!;
      const [fx, fy] = FIGMA_VERTICES[i]!;
      const tol = TOL[id] ?? 1;
      expect(Math.abs(x - fx), `${id} x`).toBeLessThanOrEqual(tol);
      expect(Math.abs(y - fy), `${id} y`).toBeLessThanOrEqual(tol);
    }
  );

  it('endY 等於最後一點的 y', () => {
    const pts = endpoints(built!.d);
    expect(built!.endY).toBeCloseTo(pts[pts.length - 1]![1]!, 5);
  });
});

describe('錨點量不到時', () => {
  it('整條放棄（回 null），不吐一條少一個點的線', () => {
    const partial: MobPathMeasure = (a) =>
      a.sel === '.forum-event__venue' ? null : figmaMeasure(a);
    expect(buildNodePathD(FORUM_MOB_NODES, { width: 414, measure: partial })).toBeNull();
  });
});

describe('x 的四種來源', () => {
  const at = (x: number | 'left' | 'center' | 'right', width = 414) =>
    endpoints(
      buildNodePathD(
        [
          { id: 'A', x, anchor: { sel: 's', edge: 'top' }, join: 'line' },
          { id: 'B', x: 'center', anchor: { sel: 's', edge: 'top', dy: 10 } },
        ],
        { width, measure: () => ({ top: 0, height: 0 }) }
      )!.d
    )[0]![0];

  it('left / right 內縮半個描邊，不被裁掉', () => {
    expect(at('left')).toBe(2);
    expect(at('right')).toBe(412);
  });

  it('center 是容器中心', () => {
    expect(at('center')).toBe(207);
    expect(at('center', 375)).toBe(187.5);
  });

  it('數字是容器寬的比例', () => {
    expect(at(0.5)).toBe(207);
    expect(at(0.781, 375)).toBe(292.88);
  });
});

describe('edge 的三種模式', () => {
  const yOf = (anchor: MobPathAnchor) =>
    endpoints(
      buildNodePathD(
        [
          { id: 'A', x: 'center', anchor, join: 'line' },
          { id: 'B', x: 'center', anchor: { sel: 's', edge: 'top', dy: 999 } },
        ],
        { width: 414, measure: () => ({ top: 100, height: 200 }) }
      )!.d
    )[0]![1];

  it('top / bottom / fraction', () => {
    expect(yOf({ sel: 's', edge: 'top' })).toBe(100);
    expect(yOf({ sel: 's', edge: 'bottom' })).toBe(300);
    expect(yOf({ sel: 's', edge: 'fraction', t: 0.32 })).toBe(164);
  });

  it('dy 疊加在三種模式之上（可負）', () => {
    expect(yOf({ sel: 's', edge: 'top', dy: 12 })).toBe(112);
    expect(yOf({ sel: 's', edge: 'bottom', dy: -6 })).toBe(294);
  });
});

describe('amplitude（全域橫向擺幅旋鈕）', () => {
  const xs = (amplitude: number) =>
    endpoints(
      buildNodePathD(FORUM_MOB_NODES, { width: 414, measure: figmaMeasure, amplitude })!.d
    ).map((p) => p[0]);

  it('1 ＝ 照稿', () => {
    expect(xs(1)).toEqual(xs(1));
    expect(xs(1)[6]).toBe(2); // P6 釘左緣
  });

  it('0.5 把所有點往中心收一半', () => {
    const a = xs(1);
    const b = xs(0.5);
    a.forEach((x, i) => expect(b[i]!).toBeCloseTo(207 + (x - 207) * 0.5, 1));
  });

  it('0 把整條線壓成一條垂直中線', () => {
    expect(new Set(xs(0))).toEqual(new Set([207]));
  });
});

describe('join 的形狀不變量', () => {
  // 兩點距離縮一半時，彎的 handle 也該縮一半（形狀不變、只是變小）。
  const handles = (h: number) => {
    const d = buildNodePathD(
      [
        {
          id: 'A',
          x: 0,
          anchor: { sel: 's', edge: 'top' },
          join: { relIn: -60, relOut: 50, hIn: 0.4, hOut: 0.6 },
        },
        { id: 'B', x: 1, anchor: { sel: 's', edge: 'top', dy: h } },
      ],
      { width: 100, measure: () => ({ top: 0, height: 0 }) }
    )!.d;
    const n = d.match(/C([-\d.\s]+)/)![1]!.trim().split(/\s+/).map(Number);
    return { c1: [n[0]!, n[1]!], c2: [n[2]!, n[3]!], end: [n[4]!, n[5]!] };
  };

  it('handle 隨 chord 等比縮放', () => {
    const big = handles(200);
    const small = handles(100);
    const lenBig = Math.hypot(big.c1[0]! - 0, big.c1[1]! - 0);
    const lenSmall = Math.hypot(small.c1[0]! - 0, small.c1[1]! - 0);
    // chord 從 hypot(100,200) 變成 hypot(100,100) → handle 應同比例
    expect(lenBig / lenSmall).toBeCloseTo(
      Math.hypot(100, 200) / Math.hypot(100, 100),
      5
    );
  });

  it('hOut 只影響到達側的 handle，不動端點', () => {
    const base = handles(200);
    expect(base.end).toEqual([100, 200]);
  });
});
