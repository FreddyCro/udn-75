import { describe, expect, it } from 'vitest';
import {
  FORUM_PHOTO_REVEAL_KEYS,
  photoRevealKeyFor,
} from '../app/utils/forum-photo-reveal';
import section2 from '../app/locales/section2.json';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import。

describe('photoRevealKeyFor', () => {
  it('論壇一／二 各有自己的事件 key', () => {
    expect(photoRevealKeyFor('論壇一')).toBe('forum1PhotoReveal');
    expect(photoRevealKeyFor('論壇二')).toBe('forum2PhotoReveal');
  });

  it('論壇三／四 回 undefined —— 不是空字串', () => {
    // undefined 是 <ForumEvent> 的 photoReveal 的「這一場不做這個效果」狀態；
    // 空字串在呼叫端是 falsy，但若哪天被當成有值傳下去，遮罩就會渲染出來。
    expect(photoRevealKeyFor('論壇三')).toBeUndefined();
    expect(photoRevealKeyFor('論壇四')).toBeUndefined();
  });

  it('沒對照到的場次名回 undefined，不丟例外', () => {
    expect(photoRevealKeyFor('論壇九')).toBeUndefined();
    expect(photoRevealKeyFor('')).toBeUndefined();
  });

  it('Object 原型上的名字不算命中（constructor / __proto__）', () => {
    // 對照表是普通物件，少了 hasOwn 這一道，'constructor' 會查到 Object 的建構子
    // → truthy → 那一場莫名長出遮罩。
    expect(photoRevealKeyFor('constructor')).toBeUndefined();
    expect(photoRevealKeyFor('__proto__')).toBeUndefined();
  });

  it('key 不重複 —— 兩場撞到同一個 key 會被綁成一起刷', () => {
    const keys = Object.values(FORUM_PHOTO_REVEAL_KEYS);
    expect(new Set(keys).size, keys.join(',')).toBe(keys.length);
  });
});

// ── 與實際資料的對照 ──────────────────────────────────────────────────
// 這一組守的是最靜默的失敗：section2.json 把場次名改掉（或對照表打錯一個字），
// 效果就整場消失，而畫面上少一塊藍不會有人立刻發現。
describe('對照表 vs section2.json', () => {
  // JSON import 推出來的型別各場次不一致（論壇三沒有 speakers 欄位），故收成最小形狀。
  type Ev = { no: string; speakers?: unknown[] };
  const events = [...section2.forum.events, section2.forum.event4] as unknown as Ev[];

  it('對照表的每個場次名都真的存在於資料裡', () => {
    const names = new Set(events.map((e) => e.no));
    const missing = Object.keys(FORUM_PHOTO_REVEAL_KEYS).filter((no) => !names.has(no));
    expect(missing, missing.join(',')).toEqual([]);
  });

  it('對照表提到的場次都真的有講者照可以刷', () => {
    const noSpeakers = Object.keys(FORUM_PHOTO_REVEAL_KEYS).filter(
      (no) => !events.find((e) => e.no === no)?.speakers?.length,
    );
    expect(noSpeakers, noSpeakers.join(',')).toEqual([]);
  });
});
