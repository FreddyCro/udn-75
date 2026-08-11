// 亂碼跑動的共用定義。
// ⚠️ 這裡只定義「亂碼長什麼樣」，不定義「什麼時候跑」—— 兩個呼叫端的時鐘不同，不要合併：
//    ・SymbolFace 的宮格彩蛋：時間軸（游標換格觸發，480ms 內跑完，與捲動無關）
//    ・SymbolIntro 的開場三行：捲動 scrub（reveal 由 symbolProgress 換算，往回捲自動倒退）

export const SCRAMBLE_CHARS = 'AMFOBI7501<>/\\[]{}#%&@十人工智慧能力未來';

/** 由左到右逐字落定：前 reveal 比例的字元已是目標字，其餘每次呼叫重擲隨機字。
 *  ⚠️ 空白與 \n 不參與亂碼 —— 文案的斷行是設計稿定死的（Figma 1145:41559），
 *     若讓 \n 被換成一般字元，跑亂碼那段整塊會先塌成一行再彈回去。
 *  回傳長度恆等於 target.length（呼叫端逐幀寫 textContent，長度一變版面就會抖）。 */
export function scrambleText(target: string, reveal: number): string {
  const r = Math.min(1, Math.max(0, reveal));
  const settled = Math.floor(r * target.length);
  let s = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i]!;
    s +=
      i < settled || ch === ' ' || ch === '\n'
        ? ch
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }
  return s;
}
