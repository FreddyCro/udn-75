import { describe, expect, it } from 'vitest';
import {
  buildNodePathD,
  FORUM_PATH_NODES,
  type ForumPathAnchor,
  type ForumPathMeasure,
  type ForumPathNode,
} from '../app/utils/forum-node-path';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。

const MOB_NODES = FORUM_PATH_NODES.mob!;
const PAD_NODES = FORUM_PATH_NODES.pad!;

const rectKey = (a: ForumPathAnchor) => {
  const base = a.event ? `${a.event}/${a.sel.split(',')[0]!.trim()}` : a.sel;
  return a.nth != null ? `${base}#${a.nth}` : base;
};

const measureFrom =
  (rects: Record<string, { top: number; height: number }>): ForumPathMeasure =>
  (a) =>
    rects[rectKey(a)] ?? null;

/** 從 d 取出每個指令的終點（＝ waypoint） */
function endpoints(d: string): [number, number][] {
  return [...d.matchAll(/[MLC]([-\d.\s]+)/g)].map((m) => {
    const n = m[1]!.trim().split(/\s+/).map(Number);
    return [n[n.length - 2]!, n[n.length - 1]!] as [number, number];
  });
}

// ── 黃金樣本：拿設計稿的 element 位置驅動產生器，結果就該落在稿的頂點上 ────
// 換算流程見 architecture/forum-node-path.md。

const MOB_RECTS: Record<string, { top: number; height: number }> = {
  '.sec2__path': { top: 0, height: 7149 },
  '論壇一/.forum-event__tag': { top: 375.4, height: 34 },
  '論壇一/.forum-event__head': { top: 375.4, height: 393.2 }, // 下緣 768.6
  '論壇一/.forum-event__venue': { top: 928.6, height: 144.87 }, // 下緣 1073.47
  '論壇一/.forum-event__photo': { top: 1073.47, height: 233 },
  '論壇一/.forum-event__speakers': { top: 1073.47, height: 1838 },
  '[data-forum-anchor="論壇二"]': { top: 3105.47, height: 140 },
  '論壇二/.forum-event__speaker-label': { top: 3764.47, height: 34 },
  '論壇二/.forum-event__speaker#0': { top: 3814.47, height: 180 },
  '論壇二/.forum-event__speaker#1': { top: 4010.47, height: 180 }, // 下緣 4190.47
  '論壇三/.forum-event__meta': { top: 4870.47, height: 199 },
};

const MOB_VERTICES: [number, number][] = [
  [207.0, 43], [207.0, 376.5], [291.5, 368.5], [343.0, 763], [59.0, 1069],
  [410.0, 1175], [0.5, 1938], [411.0, 3143.5], [107.0, 3786], [295.32, 3868.92],
  [323.5, 4202], [323.5, 4867.5], [108.0, 4961.5], [198.5, 5018.5],
];

// pad：768 稿的 論壇一二三 frame（Figma 2652:53307）內座標
const PAD_RECTS: Record<string, { top: number; height: number }> = {
  '.sec2__path': { top: 0, height: 6145 },
  '論壇一/.forum-event__tag': { top: 348, height: 34 }, // 標眉 348–382
  '論壇一/.forum-event__head': { top: 348, height: 380.65 }, // 下緣 728.65
  '論壇一/.forum-event__meta': { top: 816.65, height: 284 }, // 日期＋地點 下緣 1100.65
  '論壇一/.forum-event__photo': { top: 1100.65, height: 233 },
  '論壇二/.forum-event__meta': { top: 3226.37, height: 366.65 },
  '論壇二/.forum-event__speakers': { top: 3593.02, height: 390 },
  '論壇三/.forum-event__tag': { top: 4095.02, height: 34 },
  '論壇三/.forum-event__meta': { top: 4525.02, height: 228 }, // 下緣 4753.02
};

const PAD_VERTICES: [number, number][] = [
  [386.9, 191.0], [386.9, 398.5], [571.4, 339.0], [665.9, 792.5], [232.4, 1066.5],
  [549.9, 1308.5], [619.9, 3219.5], [380.9, 3312.0], [246.0, 3595.0], [109.0, 3627.0],
  [5.5, 3877.5], [123.0, 4087.0], [629.9, 4519.5], [201.4, 4778.0],
];

// 容差預設 1px，且**分軸**——否則某軸的刻意偏離會把另一軸的真實誤差一起放過。
// 每一筆都對應 architecture/forum-node-path.md 記錄的一條刻意偏離。
type Tol = { x?: number; y?: number };
//   P0 ：稿 y=43 → 歸零，保交棒零跳點
//   P5/P6：釘容器邊緣 ±2，稿是 410 / 0.5
//   P13：x 釘中心，稿 198.5
const MOB_TOL: Record<string, Tol> = {
  P0: { y: 44 },
  P5: { x: 2 },
  P6: { x: 2 },
  P13: { x: 9 },
};
//   Q0 ：稿 y=191 → 歸零；x 釘中心（384），稿是 386.9
//   Q1 ：x 同樣釘中心
//   Q10：釘容器左緣（EDGE_INSET 2），稿是 5.5
const PAD_TOL: Record<string, Tol> = {
  Q0: { x: 3, y: 192 },
  Q1: { x: 3 },
  Q10: { x: 4 },
};

describe.each([
  ['mob', MOB_NODES, MOB_RECTS, MOB_VERTICES, 414, MOB_TOL],
  ['pad', PAD_NODES, PAD_RECTS, PAD_VERTICES, 768, PAD_TOL],
] as const)('%s × 稿的錨點位置', (bp, nodes, rects, vertices, width, tol) => {
  const measure = measureFrom(rects);
  const built = buildNodePathD(nodes, { width, measure });

  it('每個錨點都查得到（選擇器沒打錯）', () => {
    const missing = nodes.map((n) => rectKey(n.anchor)).filter((k) => !rects[k]);
    expect(missing).toEqual([]);
  });

  it('產生單一連續路徑（只有一個 M）', () => {
    expect(built).not.toBeNull();
    expect((built!.d.match(/M/g) ?? []).length).toBe(1);
  });

  it('waypoint 數與節點數一致', () => {
    expect(endpoints(built!.d)).toHaveLength(nodes.length);
  });

  it.each(nodes.map((n, i) => [n.id, i] as const))('%s 落在稿的頂點上', (id, i) => {
    const [x, y] = endpoints(built!.d)[i]!;
    const [fx, fy] = vertices[i]!;
    const t = tol[id] ?? {};
    expect(Math.abs(x - fx), `${id} x`).toBeLessThanOrEqual(t.x ?? 1);
    expect(Math.abs(y - fy), `${id} y`).toBeLessThanOrEqual(t.y ?? 1);
  });

  it('endY 等於最後一點的 y', () => {
    const pts = endpoints(built!.d);
    expect(built!.endY).toBeCloseTo(pts[pts.length - 1]![1]!, 5);
  });

  it(`起點釘在容器水平中心（${bp} 的交棒零跳點）`, () => {
    expect(endpoints(built!.d)[0]![0]).toBe(width / 2);
  });
});

describe('錨點量不到時', () => {
  const measure = measureFrom(MOB_RECTS);

  it('必要錨點量不到 → 整條放棄，不吐一條少一個點的線', () => {
    const partial: ForumPathMeasure = (a) =>
      a.sel === '.forum-event__venue' ? null : measure(a);
    expect(buildNodePathD(MOB_NODES, { width: 414, measure: partial })).toBeNull();
  });

  it('optional 錨點量不到 → 跳過該點，其餘照畫', () => {
    const nodes: ForumPathNode[] = [
      { id: 'A', x: 'left', anchor: { sel: 'a', edge: 'top' }, join: 'line' },
      { id: 'B', x: 'center', anchor: { sel: 'gone', edge: 'top' }, join: 'line', optional: true },
      { id: 'C', x: 'right', anchor: { sel: 'c', edge: 'top', dy: 100 } },
    ];
    const m: ForumPathMeasure = (a) =>
      a.sel === 'gone' ? null : { top: 0, height: 0 };
    const out = buildNodePathD(nodes, { width: 100, measure: m })!;
    expect(out).not.toBeNull();
    // A → C 直接相連（B 被跳過）
    expect(endpoints(out.d)).toEqual([
      [2, 0],
      [98, 100],
    ]);
  });

  it('optional 點存在時照樣畫進去', () => {
    const nodes: ForumPathNode[] = [
      { id: 'A', x: 'left', anchor: { sel: 'a', edge: 'top' }, join: 'line' },
      { id: 'B', x: 'center', anchor: { sel: 'b', edge: 'top', dy: 50 }, join: 'line', optional: true },
      { id: 'C', x: 'right', anchor: { sel: 'c', edge: 'top', dy: 100 } },
    ];
    const out = buildNodePathD(nodes, {
      width: 100,
      measure: () => ({ top: 0, height: 0 }),
    })!;
    expect(endpoints(out.d)).toHaveLength(3);
  });

  it('跳到只剩一個點 → 回 null（畫不出線）', () => {
    const nodes: ForumPathNode[] = [
      { id: 'A', x: 'left', anchor: { sel: 'a', edge: 'top' }, join: 'line' },
      { id: 'B', x: 'center', anchor: { sel: 'gone', edge: 'top' }, optional: true },
    ];
    const m: ForumPathMeasure = (a) => (a.sel === 'gone' ? null : { top: 0, height: 0 });
    expect(buildNodePathD(nodes, { width: 100, measure: m })).toBeNull();
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
  const yOf = (anchor: ForumPathAnchor) =>
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
  const measure = measureFrom(MOB_RECTS);
  const xs = (amplitude: number) =>
    endpoints(buildNodePathD(MOB_NODES, { width: 414, measure, amplitude })!.d).map(
      (p) => p[0]
    );

  it('1 ＝ 照稿', () => {
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
    const lenBig = Math.hypot(big.c1[0]!, big.c1[1]!);
    const lenSmall = Math.hypot(small.c1[0]!, small.c1[1]!);
    expect(lenBig / lenSmall).toBeCloseTo(Math.hypot(100, 200) / Math.hypot(100, 100), 5);
  });

  it('hOut 只影響到達側的 handle，不動端點', () => {
    expect(handles(200).end).toEqual([100, 200]);
  });

  it('handle 為 0 → 該側退化成硬轉角（控制點與端點重合）', () => {
    const d = buildNodePathD(
      [
        {
          id: 'A',
          x: 0,
          anchor: { sel: 's', edge: 'top' },
          join: { relIn: 0, relOut: 0, hIn: 0, hOut: 0.5 },
        },
        { id: 'B', x: 1, anchor: { sel: 's', edge: 'top', dy: 100 } },
      ],
      { width: 100, measure: () => ({ top: 0, height: 0 }) }
    )!.d;
    const n = d.match(/C([-\d.\s]+)/)![1]!.trim().split(/\s+/).map(Number);
    expect([n[0], n[1]]).toEqual([0, 0]); // c1 ＝ 起點
  });
});
