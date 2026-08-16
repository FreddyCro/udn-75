import { describe, expect, it, vi } from 'vitest';
import {
  buildNodePathD,
  FORUM_FRONT_NODES,
  FORUM_PATH_NODES,
  type ForumPathAnchor,
  type ForumPathMeasure,
  type ForumPathNode,
  type ForumPathTarget,
  type ForumPathX,
} from '../app/utils/forum-node-path';

/** 量測值：黃金樣本只在乎縱向，橫向補 0（沒有節點掛在 element 的 x 上時用不到）。 */
type Rect = { top: number; height: number; left: number; width: number };
const rect = (r: Partial<Rect> = {}): Rect => ({
  top: 0,
  height: 0,
  left: 0,
  width: 0,
  ...r,
});

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。

// 黃金樣本只驗前半段 —— 後半段的線在 Figma 上是孤兒 vector、位置是我們決定的，
// 沒有稿座標可斷言（見 architecture/forum-node-path.md 第十節）。
const MOB_NODES = FORUM_FRONT_NODES.mob;
const PAD_NODES = FORUM_FRONT_NODES.pad;

const rectKey = (a: ForumPathTarget) => {
  const base = a.event ? `${a.event}/${a.sel.split(',')[0]!.trim()}` : a.sel;
  return a.nth != null ? `${base}#${a.nth}` : base;
};

const measureFrom =
  (rects: Record<string, { top: number; height: number }>): ForumPathMeasure =>
  (a) => {
    const r = rects[rectKey(a)];
    return r ? rect(r) : null;
  };

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
  // 論壇二講者組（2026-08-17 改版：兩張直排卡片 → 單人「照片左、文字右」）。
  // 稿 2566:84799 → 論壇二 y=3014.47 內的 Frame 12742 y=805、180 高。
  // 改版前是 label { 3764.47, 34 } ＋ speaker#0 { 3814.47, 180 } ＋ speaker#1 { 4010.47, 180 }。
  '論壇二/.forum-event__speakers': { top: 3819.47, height: 180 }, // 下緣 3999.47
  // 論壇二矮了 191（1418 → 1227），論壇三整段跟著上移同樣的量。
  '論壇三/.forum-event__meta': { top: 4679.47, height: 199 },
};

// ⚠ P10 之後的四個頂點是**稿的 y 減 191**，不是稿的原值 —— 論壇二的講者組改單人後矮了
//   191，而 mob 線稿沒有重畫（設計 2026-08-17 確認）。線的職責是貼實際版面，故整條線在
//   講者組之後跟著上移；斷言「剛好上移 191」比對著過期的稿座標更有意義
//   （dy／t 打錯仍然會被抓到）。見 architecture/forum-node-path.md 第七節第 8 條。
const MOB_VERTICES: [number, number][] = [
  [207.0, 43], [207.0, 376.5], [291.5, 368.5], [343.0, 763], [59.0, 1069],
  [410.0, 1175], [0.5, 1938], [411.0, 3143.5], [107.0, 3786], [295.32, 3868.92],
  [323.5, 4011], [323.5, 4676.5], [108.0, 4770.5], [198.5, 4827.5],
];

// pad：768 稿的 論壇一二三 frame 內座標（node id 見 architecture/forum-node-path.md 的相關檔案表）
const PAD_RECTS: Record<string, { top: number; height: number }> = {
  '.sec2__path': { top: 0, height: 6145 },
  '論壇一/.forum-event__tag': { top: 348, height: 34 }, // 標眉 348–382
  '論壇一/.forum-event__head': { top: 348, height: 380.65 }, // 下緣 728.65
  '論壇一/.forum-event__meta': { top: 816.65, height: 284 }, // 日期＋地點 下緣 1100.65
  '論壇一/.forum-event__photo': { top: 1100.65, height: 233 },
  '論壇二/.forum-event__meta': { top: 3226.37, height: 366.65 },
  // 講者組改單人（稿 2652:53305 → 論壇二 y=2527.37 內的「講者」3399:29051 y=1086.63、233 高）。
  // 改版前是 { 3593.02, 390 }。論壇二段落總高沒變（1541），故論壇三以下不受影響。
  '論壇二/.forum-event__speakers': { top: 3614.0, height: 233 }, // 下緣 3847.0
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
const PAD_TOL: Record<string, Tol> = {
  Q0: { x: 3, y: 192 },
  Q1: { x: 3 },
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

describe('完整路徑（前半段 ＋ 後半段）', () => {
  it.each(['pc', 'pad', 'mob'] as const)('%s 的 waypoint 編號不重複', (bp) => {
    const ids = FORUM_PATH_NODES[bp]!.map((n) => n.id);
    expect(new Set(ids).size, ids.join(',')).toBe(ids.length);
  });

  it.each(['pad', 'mob'] as const)('%s ＝ 前半段接後半段，且前半段在前', (bp) => {
    const full = FORUM_PATH_NODES[bp]!;
    const front = FORUM_FRONT_NODES[bp];
    expect(full.slice(0, front.length)).toEqual(front);
    expect(full.length).toBeGreaterThan(front.length);
  });

  it('前半段的末點沒有 join → 預設直線，正好接成原本的隱形尾段', () => {
    expect(FORUM_FRONT_NODES.mob.at(-1)!.join).toBeUndefined();
    expect(FORUM_FRONT_NODES.pad.at(-1)!.join).toBeUndefined();
  });

  it.each(['pc', 'pad', 'mob'] as const)('%s 只有精彩活動那一點是 optional', (bp) => {
    const opt = FORUM_PATH_NODES[bp]!.filter((n) => n.optional);
    expect(opt).toHaveLength(1);
    expect(opt[0]!.anchor.sel).toBe('.highlights__item');
  });

  it.each(['pc', 'pad', 'mob'] as const)('%s 的最後一點掛在接縫（不受開關影響）', (bp) => {
    const last = FORUM_PATH_NODES[bp]!.at(-1)!;
    // 錨在零高度的 .sec2__seam 而非 .sec2__pin：後者是 sticky（覆蓋過場要定住 forum
    // 最後一屏），量測若發生在 sticky 已 engage 時會拿到位移後的 rect。
    expect(last.anchor.sel).toBe('.sec2__seam');
    expect(last.anchor.edge).toBe('top');
    expect(last.optional).toBeUndefined();
  });

  // 末節點的 x 要讓紙飛機正好落在「逐格臉的第 01 格」上 —— 白方塊就從那裡長出來，
  // 對不上會看到方塊橫向跳一下（違反本專案「交棒不可看到縮一下」的不變量）。
  // FACE_FRAMES[0] = [7,0,2,2]，網格 x 7..9 of 16 → 那一格**水平居中於臉框**。
  it('pc 末節點的 x ＝ 臉框中心（296.5 / 1280）', () => {
    // 臉框中心 ＝ 視窗中心 − 343.5（內容塊 280 + gap 180 + intro 507 置中）；
    // .forum-path 是 1280 置中 → 兩者都錨在視窗中心，故此比例與視窗寬無關。
    expect(FORUM_PATH_NODES.pc.at(-1)!.x).toBe(0.2316);
  });

  it.each(['pad', 'mob'] as const)('%s 末節點的 x 是 center（臉框置中於視窗）', (bp) => {
    expect(FORUM_PATH_NODES[bp]!.at(-1)!.x).toBe('center');
  });
});

describe('錨點量不到時', () => {
  const measure = measureFrom(MOB_RECTS);

  it('必要錨點量不到 → 整條放棄，不吐一條少一個點的線；且大聲警告哪個節點量不到', () => {
    // buildNodePathD 在這條「整條放棄」的路徑上會 console.warn 一行，把靜默失敗變大聲失敗
    // （見 architecture/forum-node-path.md 大聲失敗的規則、以及 forum-path bugfix 事故報告）。
    // 這裡攔截掉，斷言「有警告」而非讓它污染測試輸出。
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const partial: ForumPathMeasure = (a) =>
      a.sel === '.forum-event__venue' ? null : measure(a);
    expect(buildNodePathD(MOB_NODES, { width: 414, measure: partial })).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]![0]).toContain('.forum-event__venue');
    warn.mockRestore();
  });

  it('optional 錨點量不到 → 跳過該點，其餘照畫', () => {
    const nodes: ForumPathNode[] = [
      { id: 'A', x: 'left', anchor: { sel: 'a', edge: 'top' }, join: 'line' },
      { id: 'B', x: 'center', anchor: { sel: 'gone', edge: 'top' }, join: 'line', optional: true },
      { id: 'C', x: 'right', anchor: { sel: 'c', edge: 'top', dy: 100 } },
    ];
    const m: ForumPathMeasure = (a) =>
      a.sel === 'gone' ? null : rect();
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
      measure: () => (rect()),
    })!;
    expect(endpoints(out.d)).toHaveLength(3);
  });

  it('跳到只剩一個點 → 回 null（畫不出線）', () => {
    const nodes: ForumPathNode[] = [
      { id: 'A', x: 'left', anchor: { sel: 'a', edge: 'top' }, join: 'line' },
      { id: 'B', x: 'center', anchor: { sel: 'gone', edge: 'top' }, optional: true },
    ];
    const m: ForumPathMeasure = (a) => (a.sel === 'gone' ? null : rect());
    expect(buildNodePathD(nodes, { width: 100, measure: m })).toBeNull();
  });
});

describe('x 的來源', () => {
  const at = (x: ForumPathX, width = 414, measure: ForumPathMeasure = () => rect()) =>
    endpoints(
      buildNodePathD(
        [
          { id: 'A', x, anchor: { sel: 's', edge: 'top' }, join: 'line' },
          { id: 'B', x: 'center', anchor: { sel: 's', edge: 'top', dy: 10 } },
        ],
        { width, measure }
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

  // ── 掛在 element 上（ForumPathXAnchor）──────────────────────────────
  // 用途見 AGENDA_ARROW_X：要咬住的元素不隨容器等比縮放時，比例算不出來。
  const box = (o: Partial<Rect>): ForumPathMeasure => (t) =>
    t.sel === 'box' ? rect({ left: 100, width: 60, ...o }) : rect();

  it('left / center / right 取量到的 border box 三邊', () => {
    expect(at({ sel: 'box', edge: 'left', fallback: 0 }, 414, box({}))).toBe(100);
    expect(at({ sel: 'box', edge: 'center', fallback: 0 }, 414, box({}))).toBe(130);
    expect(at({ sel: 'box', edge: 'right', fallback: 0 }, 414, box({}))).toBe(160);
  });

  it('dx 疊加在三邊之上（可負）', () => {
    expect(at({ sel: 'box', edge: 'left', dx: 0.5, fallback: 0 }, 414, box({}))).toBe(100.5);
    expect(at({ sel: 'box', edge: 'right', dx: -8, fallback: 0 }, 414, box({}))).toBe(152);
  });

  it('不吃 amplitude —— 掛住就是掛住，不會被往中心收', () => {
    const x = endpoints(
      buildNodePathD(
        [
          { id: 'A', x: { sel: 'box', edge: 'left', fallback: 0 }, anchor: { sel: 's', edge: 'top' }, join: 'line' },
          { id: 'B', x: 'center', anchor: { sel: 's', edge: 'top', dy: 10 } },
        ],
        { width: 414, measure: box({}), amplitude: 0.5 }
      )!.d
    )[0]![0];
    expect(x).toBe(100);
  });

  it('量不到 → 退回 fallback 比例，不整條放棄', () => {
    const gone: ForumPathMeasure = (t) => (t.sel === 'box' ? null : rect());
    expect(at({ sel: 'box', edge: 'left', fallback: 0.262 }, 768, gone)).toBeCloseTo(201.22, 2);
  });
});

// pad 的 Q13 / S0 / S1 必須同 x 且掛在議程箭頭欄上 —— 那條垂直線整段落在箭頭上，
// 核心穿過議程時才「接到箭頭」。只改其中一點會變成斜線（見 AGENDA_ARROW_X）。
describe('pad 穿過議程的那條垂直線', () => {
  const run = FORUM_PATH_NODES.pad.filter((n) => ['Q13', 'S0', 'S1'].includes(n.id));

  it('三點都在，且都掛在 .agenda__rows 的左緣', () => {
    expect(run.map((n) => n.id)).toEqual(['Q13', 'S0', 'S1']);
    run.forEach((n) => {
      expect(typeof n.x, n.id).toBe('object');
      const x = n.x as Exclude<ForumPathX, string | number>;
      expect(x.sel, n.id).toBe('.agenda__rows');
      expect(x.edge, n.id).toBe('left');
    });
  });

  it('三點同一個 x 設定 → 量出來必定等寬，線是垂直的', () => {
    expect(new Set(run.map((n) => JSON.stringify(n.x))).size).toBe(1);
  });

  it('議程量不到時退回 0.262 ＝ 稿寬 768 下的箭頭位置', () => {
    const measure: ForumPathMeasure = (t) =>
      t.sel === '.agenda__rows' ? null : rect({ top: 0, height: 100 });
    const xs = endpoints(buildNodePathD(FORUM_PATH_NODES.pad, { width: 768, measure })!.d);
    const q13 = FORUM_PATH_NODES.pad.findIndex((n) => n.id === 'Q13');
    expect(xs[q13]![0]).toBeCloseTo(201.22, 2); // 稿的頂點是 201.4
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
        { width: 414, measure: () => (rect({ top: 100, height: 200 })) }
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
      { width: 100, measure: () => (rect()) }
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
      { width: 100, measure: () => (rect()) }
    )!.d;
    const n = d.match(/C([-\d.\s]+)/)![1]!.trim().split(/\s+/).map(Number);
    expect([n[0], n[1]]).toEqual([0, 0]); // c1 ＝ 起點
  });
});

// ── 事故回歸：必要錨點不能只靠會消失的 placeholder ──────────────────────
// 起因（見 forum-path bugfix 事故報告）：ForumEvent.vue 的講者照片未填時顯示
// `.forum-event__photo-slot` 佔位符，填了照片後改渲染 `.forum-event__photo`、
// slot 整個從 DOM 消失。fa67c1b 補完講者照片後，pc 的 W5／W17 兩個必要節點
// 卻只寫死 `.forum-event__photo-slot`，量不到 → buildNodePathD 整條放棄 →
// ForumCorePath reset → 橘核心 dot 在 symbolProgress=1.0 就消失，後續設計線也不見。
// 佔位符是資料驅動、隨時可能消失，任何必要（非 optional）錨點都不可以只靠它，
// 必須同時涵蓋 `.forum-event__photo`（pad／mob 的寫法本來就是對的，只有 pc 這兩點漏改）。
describe('必要錨點不可只靠會消失的 placeholder（回歸：pc W5／W17 事故）', () => {
  // `.forum-event__photo-slot` 這個字串本身就以 `.forum-event__photo` 開頭，
  // 天真的 .includes('.forum-event__photo') 對它永遠是 true、測不出任何東西 ——
  // 必須用「後面不能接著字母／連字號」的規則，排除掉它只是 -slot 的前綴。
  const mentionsSlot = /\.forum-event__photo-slot\b/;
  const hasStandalonePhoto = /\.forum-event__photo(?![-\w])/;

  it.each(['pc', 'pad', 'mob'] as const)(
    '%s：非 optional 節點若選擇器提到 photo-slot，必須同時涵蓋獨立的 .forum-event__photo',
    (bp) => {
      const offenders = FORUM_PATH_NODES[bp]!
        .filter((n) => !n.optional && mentionsSlot.test(n.anchor.sel))
        .filter((n) => !hasStandalonePhoto.test(n.anchor.sel))
        .map((n) => n.id);
      expect(offenders, `以下節點只靠會消失的 .forum-event__photo-slot：${offenders.join(', ')}`).toEqual([]);
    }
  );
});

describe('buildNodePathD 的 points 回傳', () => {
  const nodes: ForumPathNode[] = [
    { id: 'A', x: 0.25, anchor: { sel: '.a', edge: 'top' }, join: 'line' },
    { id: 'B', x: 0.5, anchor: { sel: '.b', edge: 'top' }, join: 'line' },
    { id: 'C', x: 0.75, anchor: { sel: '.c', edge: 'top' }, optional: true },
  ];
  const measure: ForumPathMeasure = (a) =>
    a.sel === '.c' ? null : rect({ top: a.sel === '.a' ? 100 : 300 });

  it('回傳每個存活節點的座標，key 是節點 id', () => {
    const out = buildNodePathD(nodes, { width: 1000, measure })!;
    expect(out.points.get('A')).toEqual([250, 100]);
    expect(out.points.get('B')).toEqual([500, 300]);
  });

  it('量不到的 optional 節點不會出現在 points 裡', () => {
    const out = buildNodePathD(nodes, { width: 1000, measure })!;
    expect(out.points.has('C')).toBe(false);
  });

  it('d 與 endY 不受影響', () => {
    const out = buildNodePathD(nodes, { width: 1000, measure })!;
    expect(out.d).toBe('M250 100L500 300');
    expect(out.endY).toBe(300);
  });
});

// ── segs：路徑事件的量測基礎 ──────────────────────────────────────────
// ForumCorePath 用量尺 path 逐段累加這些片段讀 getTotalLength()，算出每個節點在驅動線上的
// 弧長 → 路徑事件的門檻。兩條不變量任一破掉，**所有事件的時機都會靜默錯開**
// （見 architecture/2026-08-12-forum-path-events-design.md 第三節）。
describe('buildNodePathD 的 segs 回傳', () => {
  it.each(['pc', 'pad', 'mob'] as const)(
    '%s：串起來逐字元等於 d，且每個存活節點各一段',
    (bp) => {
      // 所有錨點都量得到 → 存活節點 ＝ 全部節點（含 optional 的精彩活動那一點）
      const out = buildNodePathD(FORUM_PATH_NODES[bp], {
        width: 1280,
        measure: () => rect({ top: 100, height: 200, left: 0, width: 600 }),
      })!;
      expect(out).not.toBeNull();
      expect(out.segs.map((s) => s.d).join('')).toBe(out.d);
      expect(out.segs).toHaveLength(FORUM_PATH_NODES[bp].length);
      expect(out.segs.map((s) => s.id)).toEqual(
        FORUM_PATH_NODES[bp].map((n) => n.id),
      );
    },
  );

  it('第一段是那個 M，其後每段各是一個 L 或 C', () => {
    const out = buildNodePathD(
      [
        { id: 'A', x: 0, anchor: { sel: 's', edge: 'top' }, join: 'line' },
        {
          id: 'B',
          x: 1,
          anchor: { sel: 's', edge: 'top', dy: 100 },
          join: { relIn: -30, relOut: 30, hIn: 0.4, hOut: 0.4 },
        },
        { id: 'C', x: 0.5, anchor: { sel: 's', edge: 'top', dy: 200 } },
      ],
      { width: 100, measure: () => rect() },
    )!;
    expect(out.segs.map((s) => s.d[0])).toEqual(['M', 'L', 'C']);
    expect(out.segs.map((s) => s.id)).toEqual(['A', 'B', 'C']);
  });

  it('被跳過的 optional 節點不會有自己的一段（id 對得回存活節點）', () => {
    const nodes: ForumPathNode[] = [
      { id: 'A', x: 'left', anchor: { sel: 'a', edge: 'top' }, join: 'line' },
      { id: 'B', x: 'center', anchor: { sel: 'gone', edge: 'top' }, join: 'line', optional: true },
      { id: 'C', x: 'right', anchor: { sel: 'c', edge: 'top', dy: 100 } },
    ];
    const m: ForumPathMeasure = (a) => (a.sel === 'gone' ? null : rect());
    const out = buildNodePathD(nodes, { width: 100, measure: m })!;
    expect(out.segs.map((s) => s.id)).toEqual(['A', 'C']);
    expect(out.segs.map((s) => s.d).join('')).toBe(out.d);
  });
});
