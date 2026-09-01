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
 * ⚠️ sfx01Short（0.27s）刻意不在組內：按鈕聲與撞擊聲要能疊在動畫音之上，
 *    不然使用者一點按鈕就會把正在跑的氛圍音切斷。
 *
 * sfx01（2.11s）於 2026-08-28 入組（設計師指定）。它的歷史是：2026-08-25 的
 * `efc4b81` 把音檔由 0.27s 換成 2.11s（檔名沒變，見 sound-manifest），本段原本
 * 寫的「sfx01（0.4s）」因此失效；同月 26／28 兩次改動把它的舊呼叫端全部換掉，
 * 一度歸零；28 日再以兩個新時機重新啟用（media 拍 ⓪ 與 hero 轉場的黑色長條）。
 * 後者已於 08-31 由設計師拿掉，現存掛點只剩 MEDIA_BEAT_SFX 的拍 ⓪ 與拍 ③。
 *
 * 註：2026-08-31 之前 hero 轉場有兩聲（起手音＋p≥0.32 的黑色窄長條 sfx01），兩支同組、
 *    只相距 38vh（約 1.5s），起手音每次都被切掉尾巴 —— 那是當時的取捨（長條那聲是主音）。
 *    設計師已把長條那一聲拿掉，本組在 hero 轉場不再有互切；起手音 aiFaceBg 會整支播完。
 *    sfx01 現存的掛點（media 拍 ⓪ 與拍 ③）相距約 2.45 timeline 單位，也不會互切。
 */
export const LONG_SFX_KEYS: readonly SoundKey[] = [
  'sfx01',
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

/**
 * 播放頭由 prev 前進到 next 之間跨過了 marks 的哪幾個 —— 回它們的索引。
 *
 * risingEdge 的連續量版本：那支判「布林門檻翻正」，這支判「時間軸上跨過某幾個時刻」，
 * 而規則是同一條（出處同見 risingEdge 的說明）：
 *   ・倒退（next <= prev）回空陣列 —— 往回捲不出聲。
 *   ・prev 為 null ＝ 尚未定錨，只回空陣列（＝ ForumCorePath 的 lastTurnLen 首次呼叫
 *     只記位置那一招）。重新載入時捲動位置被瀏覽器還原到段落中段，不會一次噴完
 *     前面所有的拍。
 *   ・一次呼叫跨過多個 mark（快速捲動）會全部回報，由呼叫端決定要不要合併 ——
 *     不像撞擊音那樣天然合併，因為這裡每個 mark 可以是不同的音效。
 *
 * 區間取 (prev, next]：與撞擊點的 `t > prev && t <= len` 完全相同，故連續兩次呼叫
 * 不會把同一個 mark 算兩次。
 */
export function crossedForward(
  prev: number | null,
  next: number,
  marks: readonly number[],
): number[] {
  if (prev == null || next <= prev) return [];
  const hit: number[] = [];
  marks.forEach((t, i) => {
    if (t > prev && t <= next) hit.push(i);
  });
  return hit;
}

/**
 * media 開場 motion 的四個音效拍，各播哪一支。
 *
 * 索引與 useMediaIntroMotion 交給 crossedForward 的 marks **一一對應**，順序即時序：
 *   ⓪ 拍 1 結束 —— 橘色色塊左右收成 28px 直條，站在空白畫面中央
 *   ① 'text'    —— 短棒縮成點、「智慧」「媒體」由中線滑開到中停
 *   ② 'quotes'  —— 直線分裂成兩個引號、文字同拍撐開到定位
 *   ③ 'newchar' —— 引號之間的「新」淡入（＝ 'quotes'+0.6，標題組字的最後一件）
 *
 * ⚠️ 改長度時兩邊要一起改。marks 多一個而本表沒跟上，那一拍會靜靜地不出聲
 *    （play 端讀到 undefined 直接跳過），畫面上不會有任何東西壞掉喊出來。
 *    長度由 test/sfx-cue.spec.ts 守著。
 *
 * ⓪ 用 sfx01：設計師 2026-08-28 附截圖指定（dashboard 位址讀作 blessing.outro.100%
 *    —— 那是位址飽和的假象，media 不在 SEQUENCE 裡，整段 media motion 都讀成 100%；
 *    真正的時刻由截圖裡那根 28px 橘色長條釘住，也就是拍 1 結束）。
 *    ⚠️ 這支音原本也掛在 hero 轉場的黑色窄長條上 —— 兩處是同一個視覺母題的兩次出現
 *    （一根約 28px 寬的長條站在空白中央）。hero 那一處 2026-08-31 由設計師拿掉，
 *    母題只剩這裡出聲。
 *
 * ③ 也用 sfx01：設計師 2026-08-31 指定 udn75_sfx01_01.mp3（＝ sfx01，同 ⓪ 那支）。
 *    與 ⓪ 相距 timeline 上約 2.45（≈ 一千多 px 捲動），正常捲速下前一聲早已播完，
 *    不會像 hero 轉場那樣互切（見上方 LONG_SFX_KEYS 的已知代價）。
 *
 * ⚠️ ① ② 的 null ＝ **音檔還沒到**。設計師（2026-08-26）指定了這兩個時機，但沒有
 *    附檔案，所以觸發點先接好、鑰匙留空 —— play 端遇到 null 直接跳過，不會有靜默的
 *    錯誤。檔案一到只要兩步：把檔丟進 public/sounds/ 並在 SOUND_MANIFEST 加一行，
 *    再把這裡的 null 換成那個 key。**不要**拿 sfx01Short 之類的既有短音暫代：
 *    那是互動音，掛在這兩拍上會讓人以為音效已經定案。
 *
 * 型別綁 SoundKey → 打錯字或音效檔被移出清單時編譯期就報錯（同 FORUM_TURN_SFX 的理由）。
 */
export const MEDIA_BEAT_SFX: readonly (SoundKey | null)[] = [
  'sfx01',
  null,
  null,
  'sfx01',
];
