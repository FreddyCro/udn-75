// 音效觸發規則（純函式，單一來源）。
//
// 為什麼規則不寫在元件裡：全站有七個「捲動／動畫跑到某一點就響一聲」的掛載點，
// 規則若各寫各的，往回捲要不要出聲這種事就會逐處不一致。切法同 forum-path-turns.ts
// —— 量測在元件、規則在這裡、vitest 直接跑。

import type { SoundKey } from './sound-manifest';

/**
 * 互斥組：2–3 秒的長音。
 *
 * 這四支各自持有獨立的 Audio 物件，天然會疊在一起 —— 快速捲動時
 * 轉場音（2.3s）與收攏音（2.8s）會同時響，糊成一團聽不出是哪一段。
 * 故播其中一支前先停掉其他三支。
 *
 * ⚠️ sfx01（0.4s）刻意不在組內：按鈕聲要能疊在動畫音之上，
 *    不然使用者一點按鈕就會把正在跑的氛圍音切斷。
 */
export const LONG_SFX_KEYS: readonly SoundKey[] = [
  'aiFaceBg',
  'aiFaceText',
  'benedictionLine',
  'benedictionSmile',
];

export const isLongSfx = (key: SoundKey): boolean => LONG_SFX_KEYS.includes(key);

/** 播 `key` 之前該先停掉哪幾支。短音回空陣列（誰也不停）。 */
export function sfxStopList(key: SoundKey): SoundKey[] {
  if (!isLongSfx(key)) return [];
  // 不含自己 —— play() 本來就會 currentTime 歸零重播，先停一次是多餘的。
  return LONG_SFX_KEYS.filter((k) => k !== key);
}

/**
 * 前進觸發的邊緣判定：只有 false → true 那一次回 true。
 *
 * 「前進觸發、倒退靜音、來回捲會再響」是專案既有規則，出處是
 * ForumCorePath.vue 的撞擊點判定 `turnLens.some((t) => t > prev && t <= len)`
 * —— 往回捲時 len < prev、區間為空，故不出聲。這裡把同一條規則
 * 套到布林門檻上，讓其餘六個掛載點不必各自重新發明。
 */
export const risingEdge = (prev: boolean, next: boolean): boolean => !prev && next;
