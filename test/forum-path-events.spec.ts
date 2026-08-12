import { describe, expect, it } from 'vitest';
import {
  FORUM_PATH_EVENTS,
  forumEventOn,
  resolveForumEventMarks,
  unknownEventNodes,
  type ForumBp,
  type ForumPathEvent,
} from '../app/utils/forum-path-events';
import { FORUM_PATH_NODES } from '../app/utils/forum-node-path';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。

const BPS = ['pc', 'pad', 'mob'] as const satisfies readonly ForumBp[];

/** 假的節點弧長表：測試不碰 DOM（實務上這張表由量尺 path 的 getTotalLength 產生）。 */
const lenFrom =
  (m: Record<string, number>) =>
  (id: string): number | undefined =>
    m[id];

// ── 事件表健檢 ────────────────────────────────────────────────────────
// 這一組是本機制最重要的防線：事件表打錯節點編號的話事件永遠不觸發，
// 而畫面上少一個效果不會有人立刻發現（見設計文件第五節）。
describe('FORUM_PATH_EVENTS（事件表）', () => {
  it('key 不重複 —— key 是地址主鍵，撞名會讓兩個事件互相蓋掉', () => {
    const keys = FORUM_PATH_EVENTS.map((e) => e.key);
    expect(new Set(keys).size, keys.join(',')).toBe(keys.length);
  });

  it('每個事件都有 label（dashboard 要顯示）', () => {
    const blank = FORUM_PATH_EVENTS.filter((e) => !e.label.trim()).map((e) => e.key);
    expect(blank).toEqual([]);
  });

  it.each(BPS)('%s：引用的節點編號全部存在於節點表（打錯字就會被抓出來）', (bp) => {
    const ids = FORUM_PATH_NODES[bp].map((n) => n.id);
    const bad = unknownEventNodes(bp, ids);
    expect(
      bad,
      bad.map((b) => `${b.key} → "${b.id}"`).join('; '),
    ).toEqual([]);
  });

  it('沒有「三個斷點都是 null」的死事件', () => {
    const dead = FORUM_PATH_EVENTS.filter((e) =>
      BPS.every((bp) => e.at[bp] === null),
    ).map((e) => e.key);
    expect(dead).toEqual([]);
  });
});

// ── resolveForumEventMarks ────────────────────────────────────────────
describe('resolveForumEventMarks', () => {
  const events: ForumPathEvent[] = [
    { key: 'a', label: 'A', at: { pc: 'W1', pad: 'Q1', mob: 'P1' } },
    { key: 'b', label: 'B', at: { pc: 'W2', pad: 'Q2', mob: null } },
    { key: 'c', label: 'C', at: { pc: 'W1', pad: 'Q1', mob: 'P1' }, dLen: 100 },
  ];
  const lenAt = lenFrom({ W1: 250, W2: 500, Q1: 250, Q2: 500, P1: 250 });

  it('門檻 ＝ 節點弧長 ÷ 總長', () => {
    const marks = resolveForumEventMarks('pc', lenAt, 1000, events);
    expect(marks.a).toBeCloseTo(0.25, 10);
    expect(marks.b).toBeCloseTo(0.5, 10);
  });

  it('dLen 沿線偏移（正 ＝ 晚一點觸發）', () => {
    const marks = resolveForumEventMarks('pc', lenAt, 1000, events);
    expect(marks.c).toBeCloseTo(0.35, 10);
  });

  it('dLen 為負 ＝ 提前觸發', () => {
    const early: ForumPathEvent[] = [
      { key: 'e', label: 'E', at: { pc: 'W1', pad: null, mob: null }, dLen: -150 },
    ];
    expect(resolveForumEventMarks('pc', lenAt, 1000, early).e).toBeCloseTo(0.1, 10);
  });

  it('at[bp] 為 null → 該斷點不進表（不是 0，而是根本沒有這個 key）', () => {
    const marks = resolveForumEventMarks('mob', lenAt, 1000, events);
    expect('b' in marks).toBe(false);
    expect(marks.a).toBeCloseTo(0.25, 10);
  });

  it('節點查不到（被跳過的 optional）→ 缺 key，其餘照算', () => {
    const partial = lenFrom({ W1: 250 }); // W2 量不到
    const marks = resolveForumEventMarks('pc', partial, 1000, events);
    expect('b' in marks).toBe(false);
    expect(marks.a).toBeCloseTo(0.25, 10);
  });

  it('pathLen ≤ 0 → 空表，不吐 NaN／Infinity 門檻', () => {
    // NaN 的比較永遠是 false → 事件會靜默永不觸發，那正是要避免的失敗模式。
    expect(resolveForumEventMarks('pc', lenAt, 0, events)).toEqual({});
    expect(resolveForumEventMarks('pc', lenAt, -1, events)).toEqual({});
  });

  it('門檻夾在 [0, 1] —— dLen 開太大時退化成線頭／線尾，不是比不到的門檻', () => {
    const wild: ForumPathEvent[] = [
      { key: 'over', label: '', at: { pc: 'W2', pad: null, mob: null }, dLen: 99999 },
      { key: 'under', label: '', at: { pc: 'W1', pad: null, mob: null }, dLen: -99999 },
    ];
    const marks = resolveForumEventMarks('pc', lenAt, 1000, wild);
    expect(marks.over).toBe(1);
    expect(marks.under).toBe(0);
  });

  it('預設吃真正的事件表（不傳 events 時）', () => {
    const ids = Object.fromEntries(
      FORUM_PATH_NODES.pc.map((n, i) => [n.id, i * 10]),
    );
    const marks = resolveForumEventMarks('pc', lenFrom(ids), 1000);
    // 探針事件至少要有一個算得出來，否則等於整套機制沒接上
    expect(Object.keys(marks).length).toBeGreaterThan(0);
  });
});

// ── forumEventOn（越過判定）────────────────────────────────────────────
describe('forumEventOn', () => {
  it('progress 剛好等於門檻就算越過（>=，不是 >）', () => {
    expect(forumEventOn(0.5, 0.5)).toBe(true);
    expect(forumEventOn(0.4999, 0.5)).toBe(false);
    expect(forumEventOn(0.6, 0.5)).toBe(true);
  });

  it('門檻 0 ＝ 從第一幀起就是 on', () => {
    expect(forumEventOn(0, 0)).toBe(true);
  });

  it('沒有門檻（undefined）→ 恆 false，不當成 0', () => {
    // marks 尚未建起來、該斷點不觸發、節點被跳過，三種情形都走這裡。
    expect(forumEventOn(1, undefined)).toBe(false);
    expect(forumEventOn(0, undefined)).toBe(false);
  });

  it('往回捲會自動跌回 false（純狀態、無記憶）', () => {
    const mark = 0.3;
    expect(forumEventOn(0.4, mark)).toBe(true);
    expect(forumEventOn(0.2, mark)).toBe(false);
  });
});

// ── unknownEventNodes ────────────────────────────────────────────────
describe('unknownEventNodes', () => {
  const events: ForumPathEvent[] = [
    { key: 'ok', label: '', at: { pc: 'W1', pad: null, mob: null } },
    { key: 'typo', label: '', at: { pc: 'W99', pad: null, mob: null } },
    { key: 'skipped', label: '', at: { pc: null, pad: 'Q1', mob: null } },
  ];

  it('抓出打錯的節點編號，點名 key 與 id', () => {
    expect(unknownEventNodes('pc', ['W1', 'W2'], events)).toEqual([
      { key: 'typo', id: 'W99' },
    ]);
  });

  it('at[bp] 為 null 不算打錯字', () => {
    expect(unknownEventNodes('mob', [], events)).toEqual([]);
  });
});
