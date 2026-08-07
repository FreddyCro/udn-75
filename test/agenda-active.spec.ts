import { describe, expect, it } from 'vitest';
import { nextActiveIndex } from '../app/utils/agenda-active';

describe('nextActiveIndex', () => {
  it('進入時指向自己', () => {
    expect(nextActiveIndex(null, 3, true)).toBe(3);
    expect(nextActiveIndex(1, 3, true)).toBe(3);
  });

  it('離開自己時清成 null', () => {
    expect(nextActiveIndex(2, 2, false)).toBe(null);
  });

  it('離開別人時不動', () => {
    expect(nextActiveIndex(1, 2, false)).toBe(1);
    expect(nextActiveIndex(null, 2, false)).toBe(null);
  });

  // 這條是這個函式存在的理由：群組交界上事件亂序（新組先 enter、舊組後 leave）時，
  // 舊組的 leave 不可以把新組剛設好的值清掉，否則畫面會閃一幀空白。
  it('交界亂序：舊組的 leave 不清掉新組剛設的值', () => {
    const afterEnter = nextActiveIndex(0, 1, true); // 新組 1 進入
    expect(afterEnter).toBe(1);
    expect(nextActiveIndex(afterEnter, 0, false)).toBe(1); // 舊組 0 才離開
  });
});
