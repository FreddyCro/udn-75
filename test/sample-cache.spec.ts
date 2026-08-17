import { describe, expect, it, vi } from 'vitest';
import {
  createSampleCache,
  pointKey,
  quantize,
} from '../app/utils/sample-cache';

describe('createSampleCache', () => {
  it('同一個鍵只算一次，之後回快取值', () => {
    const compute = vi.fn(() => 42);
    const cache = createSampleCache<number>();

    expect(cache.get('a', compute)).toBe(42);
    expect(cache.get('a', compute)).toBe(42);
    expect(cache.get('a', compute)).toBe(42);
    expect(compute).toHaveBeenCalledTimes(1);
    expect(cache.stats()).toEqual({ hits: 2, misses: 1 });
  });

  it('不同的鍵各算各的', () => {
    const cache = createSampleCache<string>();
    expect(cache.get('a', () => 'A')).toBe('A');
    expect(cache.get('b', () => 'B')).toBe('B');
    expect(cache.get('a', () => 'should not run')).toBe('A');
    expect(cache.size()).toBe(2);
  });

  it('超過容量時淘汰最久沒用到的那筆', () => {
    const cache = createSampleCache<string>(2);
    cache.get('a', () => 'A');
    cache.get('b', () => 'B');
    cache.get('c', () => 'C'); // 'a' 被擠掉
    expect(cache.size()).toBe(2);

    const recompute = vi.fn(() => 'A2');
    expect(cache.get('a', recompute)).toBe('A2');
    expect(recompute).toHaveBeenCalledTimes(1);
  });

  it('命中會把該筆移到最新，避免常用的被擠掉', () => {
    const cache = createSampleCache<string>(2);
    cache.get('a', () => 'A');
    cache.get('b', () => 'B');
    cache.get('a', () => 'nope'); // 碰一下 'a' → 現在 'b' 才是最舊
    cache.get('c', () => 'C'); // 擠掉的應該是 'b'

    const aAgain = vi.fn(() => 'A2');
    expect(cache.get('a', aAgain)).toBe('A');
    expect(aAgain).not.toHaveBeenCalled();

    const bAgain = vi.fn(() => 'B2');
    expect(cache.get('b', bAgain)).toBe('B2');
    expect(bAgain).toHaveBeenCalledTimes(1);
  });

  it('快取 null 也算命中（量不到就是量不到，不該每輪重試）', () => {
    const compute = vi.fn(() => null);
    const cache = createSampleCache<null>();
    cache.get('k', compute);
    cache.get('k', compute);
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('clear() 之後重新計算', () => {
    const compute = vi.fn(() => 1);
    const cache = createSampleCache<number>();
    cache.get('k', compute);
    cache.clear();
    cache.get('k', compute);
    expect(compute).toHaveBeenCalledTimes(2);
    expect(cache.size()).toBe(1);
  });
});

describe('quantize', () => {
  it('把浮點尾數收到 0.1px 粒度', () => {
    expect(quantize(10.00001)).toBeCloseTo(10, 10);
    expect(quantize(10.04)).toBeCloseTo(10, 10);
    expect(quantize(10.06)).toBeCloseTo(10.1, 10);
  });

  it('量化誤差遠小於 nearestArcLength 自身的解析度', () => {
    // 取樣法誤差 = (totalLen / 512) / 32；pc 的 pathLen 約 13000
    const methodResolution = 13000 / 512 / 32;
    expect(0.1 / 2).toBeLessThan(methodResolution / 5);
  });
});

describe('pointKey', () => {
  it('浮點尾數不同但同一個位置 → 同一個鍵（快取才命中得到）', () => {
    expect(pointKey(100.00001, 200.00002)).toBe(pointKey(100, 200));
  });

  it('真的位移了 → 不同的鍵（版面變了就該重算）', () => {
    expect(pointKey(100, 200)).not.toBe(pointKey(101, 200));
    expect(pointKey(100, 200)).not.toBe(pointKey(100, 200.5));
  });
});
