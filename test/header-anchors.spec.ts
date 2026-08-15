import { describe, expect, it } from 'vitest';
import common from '../app/locales/common.json';
import { SUBPAGE_HEADER_ANCHOR } from '../app/utils/constants';

describe('SUBPAGE_HEADER_ANCHOR', () => {
  // 對不上的話，子頁 header 的 active 底線會靜默消失（activeTarget 比不到任何一個錨點）。
  it('必須是 headerAnchors 其中一個 target', () => {
    const targets = common.headerAnchors.map((a) => a.target);
    expect(targets).toContain(SUBPAGE_HEADER_ANCHOR);
  });
});
