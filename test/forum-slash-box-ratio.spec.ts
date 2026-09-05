import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 論壇二 09/15 那一撇：外框比例必須配得上寫死的旋轉角。
//
// 為什麼要守這件事：那一撇是**核心畫出來的**，而它有兩個各自獨立的真值 ——
//   1. 可見的脊線：`.forum-event__date-coreslash i`，長 `--coreslash-h / cos(26.7°)`、
//      `rotate(26.7deg)`，錨在外框的**右上角**。
//   2. 觸發窗口：`ForumCorePath.computeSlashWindow()` 讀**外框的 rect**，把它兩角投影到
//      驅動線上，得到「核心走到哪 → 撇畫多少」的弧長區間。
//
// 兩者要對得上，唯一條件是外框的右上／左下兩角正好是脊線的兩端，也就是
// **w / h ≡ tan(26.7°)**。不成立時外框會比脊線實際畫到的範圍寬，於是窗口的弧長
// 比脊線長 —— 核心跑在畫出頭前面，撇畫完的那一刻核心已經越過筆尖。
//
// ⚠️ 這個坑靜默：`FORUM_SLASH_CORE.alignTol` 是 `max(12px, 對角線 × 0.12)`，pc 上等於
// 24px，而實際偏差 15px —— 守衛放行，dev console 什麼都不說。
// 2026-09-06 實測 pc（103×175 ＝ 0.589 ／ 30.5°）：撇畫完前核心已超前 3.9px，
// draw 飽和後隨即跳開 21.9px。修法是把 w 收到 88（＝175 × tan26.7°），
// 並把 --coreslash-x 反向補 +15 讓外框右緣不動（脊線錨在右緣，撇本身一格都沒移）。
//
// 失敗時**不要放寬容差** —— 回去改 --coreslash-w，並記得同步補 --coreslash-x。

const SRC = join(process.cwd(), 'app/components/02.forum/ForumEvent.vue');

/** 容許落差（px）。pad 0.73 / mob 0.34 是設計稿本來就有的次像素差，pc 修好後是 0.02。 */
const TOLERANCE_PX = 1;

const readNumbers = (src: string, prop: string): number[] =>
  [...src.matchAll(new RegExp(`--${prop}:\\s*([\\d.]+)px`, 'g'))].map((m) =>
    Number(m[1]),
  );

describe('那一撇的外框比例', () => {
  const src = readFileSync(SRC, 'utf8');

  it('脊線的旋轉角是寫死的單一數字（有兩個就代表有人改了一半）', () => {
    const angles = [...src.matchAll(/transform:[^;]*\brotate\(([\d.]+)deg\)/g)].map((m) =>
      Number(m[1]),
    );
    expect(angles).toHaveLength(1);
    expect(angles[0]).toBeCloseTo(26.7, 5);
  });

  it('三個斷點的 w / h 都等於 tan(旋轉角)', () => {
    const angle = Number(
      /transform:[^;]*\brotate\(([\d.]+)deg\)/.exec(src)![1],
    );
    const tan = Math.tan((angle * Math.PI) / 180);

    const ws = readNumbers(src, 'coreslash-w');
    const hs = readNumbers(src, 'coreslash-h');
    // 宣告順序固定是 w 緊接著 h，三個斷點各一組
    expect(ws).toHaveLength(3);
    expect(hs).toHaveLength(3);

    const report = ws
      .map((w, i) => {
        const h = hs[i]!;
        const want = h * tan;
        return { w, h, want, diff: Math.abs(w - want) };
      })
      .filter((r) => r.diff > TOLERANCE_PX)
      .map(
        (r) =>
          `  ${r.w}×${r.h}（w/h=${(r.w / r.h).toFixed(4)}）` +
          ` → w 應為 ${r.want.toFixed(2)}，差 ${r.diff.toFixed(2)}px`,
      );

    expect(
      report.join('\n'),
      '外框比例配不上寫死的 rotate 角，核心會跑在撇的畫出頭前面',
    ).toBe('');
  });

  it('脊線長度的除數是 cos(旋轉角)', () => {
    // height: calc(var(--coreslash-h) / 0.8934) —— 0.8934 ＝ cos(26.7°)。
    // 角度改了這個數字也要跟著改，否則脊線的長度與外框的高度對不上。
    const angle = Number(
      /transform:[^;]*\brotate\(([\d.]+)deg\)/.exec(src)![1],
    );
    const divisor = Number(
      /--coreslash-h\)\s*\/\s*([\d.]+)\)/.exec(src)![1],
    );
    expect(divisor).toBeCloseTo(Math.cos((angle * Math.PI) / 180), 3);
  });
});
