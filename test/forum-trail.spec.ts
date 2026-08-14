import { describe, expect, it } from 'vitest';
import { morphFrame, trailWindow } from '../app/utils/forum-trail';

const SWAP = 1000;
const MORPH = 240;
const TAIL = 130;
const REAR = 13;

describe('morphFrame', () => {
  it('變身點之前恆為第 0 格', () => {
    expect(morphFrame(0, SWAP, MORPH)).toBe(0);
    expect(morphFrame(SWAP - 1, SWAP, MORPH)).toBe(0);
    expect(morphFrame(SWAP, SWAP, MORPH)).toBe(0);
  });

  it('窗口末端與其後恆為最後一格（不會溢出成 9）', () => {
    expect(morphFrame(SWAP + MORPH, SWAP, MORPH)).toBe(8);
    expect(morphFrame(SWAP + MORPH * 10, SWAP, MORPH)).toBe(8);
  });

  it('窗口中段按比例分格', () => {
    expect(morphFrame(SWAP + MORPH * 0.5, SWAP, MORPH)).toBe(4);
    expect(morphFrame(SWAP + MORPH * (1 / 9), SWAP, MORPH)).toBe(1);
  });

  it('swapLen 為 null（量不到變身節點）時恆為第 0 格', () => {
    expect(morphFrame(99999, null, MORPH)).toBe(0);
  });

  it('對 len 單調不遞減', () => {
    let prev = -1;
    for (let len = SWAP - 100; len <= SWAP + MORPH + 100; len += 7) {
      const f = morphFrame(len, SWAP, MORPH);
      expect(f).toBeGreaterThanOrEqual(prev);
      prev = f;
    }
  });
});

describe('trailWindow', () => {
  it('機尾還沒越過變身點時不畫', () => {
    expect(trailWindow(SWAP, SWAP, TAIL, REAR).dash).toBe(0);
    // len = SWAP + REAR 時 head 恰好等於 SWAP，仍是 0
    expect(trailWindow(SWAP + REAR, SWAP, TAIL, REAR).dash).toBe(0);
  });

  it('成長中：尾巴長度等於機尾到變身點的距離', () => {
    const { dash, offset } = trailWindow(SWAP + 63, SWAP, TAIL, REAR);
    expect(dash).toBe(50); // head = 1050，s = 1000
    expect(offset).toBe(-SWAP);
  });

  it('長滿之後夾在 tailLen', () => {
    const { dash, offset } = trailWindow(SWAP + 300, SWAP, TAIL, REAR);
    expect(dash).toBe(TAIL);
    expect(offset).toBe(-(SWAP + 300 - REAR - TAIL));
  });

  it('dash > 0 時尾跡前端恆貼著機尾', () => {
    for (const len of [SWAP + 63, SWAP + 200, SWAP + 5000]) {
      const { dash, offset } = trailWindow(len, SWAP, TAIL, REAR);
      expect(dash).toBeGreaterThan(0);
      expect(-offset + dash).toBeCloseTo(len - REAR, 6);
    }
  });

  it('往回捲時尾巴跟著縮，不留殘影', () => {
    const far = trailWindow(SWAP + 300, SWAP, TAIL, REAR).dash;
    const near = trailWindow(SWAP + 60, SWAP, TAIL, REAR).dash;
    expect(near).toBeLessThan(far);
  });

  it('swapLen 為 null 時不畫', () => {
    expect(trailWindow(99999, null, TAIL, REAR).dash).toBe(0);
  });
});
