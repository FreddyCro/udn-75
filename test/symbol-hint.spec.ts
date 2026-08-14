import { describe, expect, it } from 'vitest';
import { FACE_HOVER_INFLUENCE, faceUv } from '../app/utils/symbol-hint';

// 這支守的是「world 座標 → 人像 bbox 正規化座標」的方向與邊界：
// u 是左→右、v 是上→下（world 的 y 軸向上，故 v 要翻轉），右／下邊界為開區間。
// 方向一旦寫反，宮格彩蛋會對到鏡像的句子，而畫面上看起來只是「句子怪怪的」，很難查。
describe('faceUv', () => {
  it('人像中心 → (0.5, 0.5)', () => {
    expect(faceUv(0, 0, 100, 200)).toEqual({ u: 0.5, v: 0.5 });
  });

  it('左上角 → (0, 0)：world 的 +y 是上方', () => {
    expect(faceUv(-100, 200, 100, 200)).toEqual({ u: 0, v: 0 });
  });

  it('u 隨 x 遞增、v 隨 y 遞減', () => {
    const left = faceUv(-50, 0, 100, 200)!;
    const right = faceUv(50, 0, 100, 200)!;
    expect(right.u).toBeGreaterThan(left.u);

    const top = faceUv(0, 100, 100, 200)!;
    const bottom = faceUv(0, -100, 100, 200)!;
    expect(bottom.v).toBeGreaterThan(top.v);
  });

  it('右／下邊界是開區間（落在角上算框外）', () => {
    expect(faceUv(100, 0, 100, 200)).toBeNull();
    expect(faceUv(0, -200, 100, 200)).toBeNull();
    expect(faceUv(100, -200, 100, 200)).toBeNull(); // 真正的角點（右下角）
  });

  it('框外回 null', () => {
    expect(faceUv(101, 0, 100, 200)).toBeNull();
    expect(faceUv(0, 201, 100, 200)).toBeNull();
  });

  it('人像尚未建立（halfW/halfH 為 0）時回 null，不做除以零', () => {
    expect(faceUv(0, 0, 0, 0)).toBeNull();
  });
});

describe('FACE_HOVER_INFLUENCE', () => {
  it('是 0..1 之間的門檻', () => {
    expect(FACE_HOVER_INFLUENCE).toBeGreaterThan(0);
    expect(FACE_HOVER_INFLUENCE).toBeLessThan(1);
  });
});
