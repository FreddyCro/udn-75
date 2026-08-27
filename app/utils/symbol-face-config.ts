// <SymbolFace> 的設定鍵清單與固定上限。
//
// 抽成獨立檔案而不是寫死在元件裡：SYMBOL_CONFIG_KEYS 決定「哪些 prop 會被抄進 cfg」
// （cfg ＝ three.js 實際讀的設定，見 SymbolFace 的 cfg 宣告處），
// 而 SYMBOL_MAX_GLITCH_ITEMS 同時被 JS 與 GLSL 讀，必須只有一個來源。

/**
 * 會被抄進 cfg 的 prop 名。加新的可調參數時，prop 與這張表要同時加 ——
 * 漏了這裡，prop 進得來但 three.js 那側永遠讀不到（cfg 沒有那個鍵）。
 *
 * ⚠️ 順序無意義（只是照 SymbolFace 的 props 宣告順序排，方便對照）。
 * ⚠️ 不含 mode / active / hint / hintMob 等「非 three.js 設定」的 prop：
 *    那些是每次變動都要即時反應的互動狀態，直接讀 props 而非 cfg。
 */
export const SYMBOL_CONFIG_KEYS: string[] = [
  // 顏色
  'color',
  'colorStops',
  'glitchItems',
  'colorMode',
  'bgColor',
  'convergeBgColor',
  'convergeColor',
  'phraseColor',
  // 圖像 / 採樣
  'src',
  'chars',
  'cols',
  'charAspect',
  'contrast',
  'invert',
  'sizeMin',
  'sizeMax',
  'weightSteps',
  'weightMin',
  'weightMax',
  'jitter',
  'maxParticles',
  'fitWidth',
  'fitHeight',
  'worldScale',
  // 場景 / 節奏
  'revealDuration',
  'disperseDuration',
  'disperseSpread',
  'disperseAlpha',
  'disperseLift',
  'convergeSize',
  'convergeStagger',
  'convergeKeep',
  'inkGamma',
  'twinkleAmp',
  'breathAmp',
  // 漂浮
  'floatAmp',
  'floatMicro',
  'floatSpeed',
  // 斥力 / 物理
  'holeRadius',
  'holeSpread',
  'returnEase',
  'friction',
  'impulseStrength',
  'impulseSpray',
  'impulseSprayZ',
  'velocityFollow',
  'maxSpeed',
  // 避讓 / 滑鼠
  'groupShift',
  'groupShiftNear',
  'groupShiftFar',
  'mouseEase',
  'autoMouse',
  'autoMouseSpeed',
  // 彩蛋
  'phrases',
  'gridCols',
  'gridRows',
];

/** glitch 組數上限。GLSL ES 1.0 的陣列 uniform 必須是固定長度，SymbolFace 以
 *  GLITCH_SLOTS 讀這個常數、再插值進 shader（宣告長度與迴圈上界）—— 故這裡是**唯一**
 *  的來源，改這個數字就會一路帶到 shader。
 *  6 是 2026-08-20 設計師 preset 的組數（見 temp/matrix_preset_.json）。 */
export const SYMBOL_MAX_GLITCH_ITEMS = 6;
