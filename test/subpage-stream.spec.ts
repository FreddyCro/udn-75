import { describe, expect, it } from 'vitest';
import { anchorSlug, streamTargetSlug } from '../app/utils/subpage-stream';

// 實況順序＝ locales/common.json 的 subpageAnchors
const SLUGS = ['news', 'visual', 'service', 'data', 'education', 'health'];

describe('anchorSlug', () => {
  it('子頁路徑去掉前導斜線', () => {
    expect(anchorSlug('/news')).toBe('news');
  });

  it('已經是 slug 就原樣回傳（呼叫端不必先判斷是哪一種）', () => {
    expect(anchorSlug('health')).toBe('health');
  });

  it('尾斜線與 hash／query 都吃掉', () => {
    expect(anchorSlug('/visual/')).toBe('visual');
    expect(anchorSlug('/data#awards')).toBe('data');
    expect(anchorSlug('/service?from=index')).toBe('service');
  });

  it('空字串不炸', () => {
    expect(anchorSlug('')).toBe('');
  });
});

describe('streamTargetSlug', () => {
  it('hash 指到某一篇 → 就落在那一篇', () => {
    expect(streamTargetSlug('#health', SLUGS)).toBe('health');
  });

  it('沒有 hash → 落在第一篇（＝錨點編號 01）', () => {
    expect(streamTargetSlug('', SLUGS)).toBe('news');
  });

  it('hash 認不出來 → 退回第一篇，不留空白頁', () => {
    // 舊連結／手打錯字：連續閱讀頁沒有「不落在任何一篇」的狀態
    expect(streamTargetSlug('#nope', SLUGS)).toBe('news');
  });

  it('hash 帶不帶 # 都收', () => {
    expect(streamTargetSlug('data', SLUGS)).toBe('data');
  });

  it('slugs 為空 → 回空字串（不拋例外）', () => {
    expect(streamTargetSlug('#news', [])).toBe('');
  });
});
