import { describe, expect, it } from 'vitest';
import {
  DISSOLVE_LEAVE,
  OUTRO_HOLD_SCALE,
  dissolveState,
  outroHoldScale,
} from '../app/utils/hero-dissolve';

describe('outroHoldScale', () => {
  it('端點：不捲時不縮放、捲完時吃滿', () => {
    expect(outroHoldScale(0)).toBe(1);
    expect(outroHoldScale(1)).toBeCloseTo(1 + OUTRO_HOLD_SCALE, 10);
  });

  it('區間內單調遞增 —— 這就是「捲動有反應」的全部來源', () => {
    // 退場那段行程裡畫面上除了影片沒有東西可以動（引言還在視窗外），
    // 沒有這條連動，捲與不捲畫面一模一樣。
    let prev = outroHoldScale(0);
    for (let p = 0.05; p <= 1; p += 0.05) {
      const now = outroHoldScale(p);
      expect(now).toBeGreaterThan(prev);
      prev = now;
    }
  });

  it('區間外要夾住', () => {
    expect(outroHoldScale(-0.5)).toBe(1);
    expect(outroHoldScale(2)).toBeCloseTo(1 + OUTRO_HOLD_SCALE, 10);
  });
});

// 2026-08-22 起 dissolveState 只剩三條規則：正片期間不插手、跨回頂端就重播、
// 捲完就收尾（已交棒過則一律維持 gone）。退場**不再由 scrub 進入** —— 那改由影片
// 時間軸順播（main.end → outro，見 HeroVideo 的 onTimeUpdate）。
describe('dissolveState', () => {
  it('正片期間 scrub 一律不作數', () => {
    // main 期間頁面鎖著、p 恆為 0，若讓它推導就會把正片直接跳掉。
    // restart 重播落在 main，同一條規則也保證「重播不會被殘留的捲動事件打斷」。
    expect(dissolveState(0, 'main')).toBe('main');
    expect(dissolveState(0.5, 'main')).toBe('main');
    expect(dissolveState(1, 'main')).toBe('main');
    expect(dissolveState(0, 'main', { returnedToTop: true })).toBe('main');
  });

  it('跨回 page top ＝ 從頭重播（restart）', () => {
    // 動機：帶 hash 從子頁進站的人落在 gone，等於再也看不到影片。回到頂端把影片
    // 還給他們的機制本來就在（applyDissolve 會在同一刻清掉 openingSkipped），
    // 這裡只是把還的東西換成「從 0s 的完整影片」。
    //
    // 2026-08-28：重播**必須**已交棒過（outroSpent）—— 「回來」的前提是「去過」。
    // 帶 hash 進站、SKIP、自然播完都經過 setState('gone') 而設起 outroSpent，故都算。
    expect(
      dissolveState(0, 'gone', { returnedToTop: true, outroSpent: true }),
    ).toBe('main');
    expect(
      dissolveState(0, 'outro', { returnedToTop: true, outroSpent: true }),
    ).toBe('main');
  });

  it('還沒交棒過就「跨回」頂端不算重播 —— iOS 無限重播的修法', () => {
    // 退場播完解鎖、自動捲到引言的途中（狀態仍是 outro、p < 1），iOS 上
    // ScrollTrigger.refresh（pin 量測會 scrollTo(0) 再還原）或頂端橡皮筋會送來一次
    // p ＝ 0，被判成 returnedToTop → main → 重播 → 播完又解鎖 → 又 refresh…無限迴圈。
    // 那一趟根本沒抵達過 gone，沒有「回來」可言。
    expect(dissolveState(0, 'outro', { returnedToTop: true })).toBe('outro');
    expect(dissolveState(0, 'gone', { returnedToTop: true })).toBe('gone');
  });

  it('**停在**頂端不算重播 —— 這是順播不會無限重播的關鍵', () => {
    // 正片播完自動進 outro 時 p 還是 0（人還沒捲）。若用「p < LEAVE」這種**位置**判定，
    // 會立刻把剛進 outro 的狀態判成重播 → 重播播完又進 outro → 又被判重播 → 無限迴圈。
    // SKIP 在 page top 放的 outro 同理（那正是已移除的 outroForced 那面栓的理由）。
    expect(dissolveState(0, 'outro')).toBe('outro');
    expect(dissolveState(DISSOLVE_LEAVE - 0.001, 'outro')).toBe('outro');
    expect(dissolveState(0, 'gone', { outroSpent: true })).toBe('gone');
  });

  it('p 抵達 1 就是 gone', () => {
    expect(dissolveState(1, 'outro')).toBe('gone');
    expect(dissolveState(1.2, 'gone')).toBe('gone');
    // 已交棒過仍要能再收尾（回捲到一半又往下捲），否則 orange core 接不上。
    expect(dissolveState(1, 'gone', { outroSpent: true })).toBe('gone');
  });

  it('已交棒過（outroSpent）→ 回捲一律維持 gone，不把退場搬回畫面上', () => {
    // 使用者裁決「回捲不要看到 outro」：狀態送回 outro 會讓影片 seek 回 36s 重播退場段。
    // 維持 gone ＝ 影片停在 frame 0（進 gone 時就 seek 回去了，見 HeroVideo 的
    // watch(heroState)），舞台淡回畫面上顯示的是第一幀。
    expect(dissolveState(0.99, 'gone', { outroSpent: true })).toBe('gone');
    expect(dissolveState(0.5, 'gone', { outroSpent: true })).toBe('gone');
    expect(dissolveState(0.02, 'gone', { outroSpent: true })).toBe('gone');
  });

  it('沒有旗標時維持現狀 —— 溶解進行中不該改狀態', () => {
    // 退場段是順播進來的，scrub 在 (0, 1) 之間只負責縮放與硬切，不動狀態。
    expect(dissolveState(0.3, 'outro')).toBe('outro');
    expect(dissolveState(0.9, 'outro')).toBe('outro');
  });
});
