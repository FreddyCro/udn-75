import { describe, expect, it } from 'vitest';
import { coreHandoffBackY } from '../app/utils/hero-core-handoff';

// 實測基準（Chromium 1522×868，?pathdebug 的 __udnST）：
//   dissolveST  start 0    end 1042 ＝ vh(HERO_DISSOLVE_VH 1.2)
//   pathST      start 1042 end 2181
//   路徑起點 sy ＝ vh(1.2) + vh(0.5) ＝ 1042 + 434 ＝ 1476（**文件座標**）
const VH = 868;
const HALF = VH * 0.5; // 434
const PATH_START = 1042; // vh(1.2)
const SY = PATH_START + HALF; // 1476

describe('coreHandoffBackY', () => {
  it('進度 > 0（core 已在驅動線上）：完全不插手，用路徑算出來的 y', () => {
    expect(coreHandoffBackY(0.19, 1600, 1259, HALF)).toBe(1600);
    expect(coreHandoffBackY(1, 2615, 2181, HALF)).toBe(2615);
  });

  it('進度剛好 0 且捲動位置正是路徑起點：與路徑起點同值 → 接縫零跳動', () => {
    expect(coreHandoffBackY(0, SY, PATH_START, HALF)).toBe(SY);
  });

  it('進度 clamp 在 0（回捲到退場區間）：core 螢幕位置維持 50vh ＝ 影片那顆 core 的位置', () => {
    // 這三個捲動位置正是實測到 core 往下漂出視窗的那一段
    for (const scrolled of [1000, 700, 300, 0]) {
      const y = coreHandoffBackY(0, SY, scrolled, HALF);
      expect(y - scrolled).toBe(HALF); // 螢幕座標恆為 50vh
    }
  });

  it('回歸：舊行為（一律用路徑起點）會讓 core 隨文件 1:1 往下漂', () => {
    // scrollY 0 時舊行為的螢幕位置是 1476 —— 落在 868 高的視窗**外**，
    // 也就是實測到的「core 停在引言、滑出視窗下緣」。
    expect(SY - 0).toBeGreaterThan(VH);
    expect(coreHandoffBackY(0, SY, 0, HALF)).toBe(HALF);
  });
});
