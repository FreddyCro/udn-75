import { describe, expect, it } from 'vitest';
import { pickActiveAnchor } from '../app/utils/anchor-spy';

// 用字串當「元素」替身：pickActiveAnchor 對元素型別無所謂，只做 Map 查表。
const ORDER = ['forum', 'blessing', 'media'];

// 首頁實況：symbol（論壇章節的前導段落）與 forum 本體共用同一個 target。
const SECTIONS = new Map<string, string>([
  ['symbol', 'forum'],
  ['forum', 'forum'],
  ['blessing', 'blessing'],
  ['media', 'media'],
]);

describe('pickActiveAnchor', () => {
  it('沒有任何段落在中央帶 → 回空字串（錨點全部不亮）', () => {
    expect(pickActiveAnchor(ORDER, SECTIONS, [])).toBe('');
  });

  it('前導段落單獨在中央帶 → 回它宣告的 target', () => {
    expect(pickActiveAnchor(ORDER, SECTIONS, ['symbol'])).toBe('forum');
  });

  it('前導段落與本體同時在中央帶（交界瞬間）→ 仍是同一個 target', () => {
    expect(pickActiveAnchor(ORDER, SECTIONS, ['symbol', 'forum'])).toBe('forum');
  });

  it('交界過後前導段落離開、本體還在 → target 不被誤清掉', () => {
    // 這是把可見集合存成 target 字串會踩的坑：symbol 離開時 delete('forum')
    // 會把還在場的 forum 本體一起抹掉，導致錨點閃斷。
    expect(pickActiveAnchor(ORDER, SECTIONS, ['forum'])).toBe('forum');
  });

  it('兩個不同章節同時命中 → 取文件順序在前者', () => {
    expect(pickActiveAnchor(ORDER, SECTIONS, ['blessing', 'forum'])).toBe(
      'forum',
    );
  });

  it('可見集合的列舉順序不影響結果（由 order 決勝，不是由進場順序）', () => {
    expect(pickActiveAnchor(ORDER, SECTIONS, ['media', 'blessing'])).toBe(
      'blessing',
    );
  });

  it('未登記在 Map 裡的元素 → 忽略', () => {
    expect(pickActiveAnchor(ORDER, SECTIONS, ['hero'])).toBe('');
  });

  it('宣告了不存在於 order 的 target → 忽略，不會亮出幽靈錨點', () => {
    const sections = new Map<string, string>([['ghost', 'nowhere']]);
    expect(pickActiveAnchor(ORDER, sections, ['ghost'])).toBe('');
  });
});
