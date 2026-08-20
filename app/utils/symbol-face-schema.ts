// <SymbolFace> 開發面板（<SymbolFaceDevPanel>）的欄位表。
//
// 抽成獨立檔案是因為有兩個消費者：
//   ・SymbolFaceDevPanel —— 依這張表把每個欄位渲染成 slider / 色票 / 開關。
//   ・SymbolFace —— 依 SYMBOL_CONFIG_KEYS 從 props 撈出 cfg 初值（＝三.js 實際讀的設定）。
// 兩邊各抄一份鍵名的話，加一個 prop 就會只改到一邊，面板悄悄少一格。
//
// ⚠️ 本表**不含** color / colorStops / glitchItems 這三項。它們不是「一列一個欄位」，
//    而是面板裡手寫的專用元件（漸層色票列、色標位置滑桿、glitch 卡片），
//    見 SymbolFaceDevPanel 的「顏色」與「Glitch 跳色」兩段。

export type SymbolFieldKind =
  | 'range' // 滑桿 + 可輸入的數字框（需要 min/max）
  | 'num' //   純數字框（沒有合理上下界）
  | 'bool'
  | 'color'
  | 'select'
  | 'text'
  | 'csvNum' //  逗號分隔數字 → number[]
  | 'csvStr'; // 逗號分隔字串 → string[]

export interface SymbolField {
  key: string;
  label: string;
  kind: SymbolFieldKind;
  group: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  /** 顯示在數值後面的單位（純提示，不參與轉型） */
  unit?: string;
}

/** 「顏色」組永遠排第一、預設展開；其餘依序往後、預設收合。見 SymbolFaceDevPanel。 */
export const SYMBOL_COLOR_GROUP = '顏色';

export const SYMBOL_CONFIG_SCHEMA: SymbolField[] = [
  // ---------- 顏色（漸層色票 / 色標 / glitch 由面板手寫，不在此表） ----------
  {
    key: 'colorMode',
    label: '取色模式',
    kind: 'select',
    options: ['tone', 'random'],
    group: SYMBOL_COLOR_GROUP,
  },
  { key: 'bgColor', label: '背景色', kind: 'color', group: SYMBOL_COLOR_GROUP },
  {
    key: 'convergeBgColor',
    label: '匯聚態背景色',
    kind: 'color',
    group: SYMBOL_COLOR_GROUP,
  },
  {
    key: 'convergeColor',
    label: '收斂點顏色',
    kind: 'color',
    group: SYMBOL_COLOR_GROUP,
  },
  {
    key: 'phraseColor',
    label: '彩蛋文字色',
    kind: 'color',
    group: SYMBOL_COLOR_GROUP,
  },

  // ---------- 圖像 / 採樣 ----------
  { key: 'src', label: '圖片路徑', kind: 'text', group: '圖像 / 採樣' },
  { key: 'chars', label: '符號集(逗號)', kind: 'csvStr', group: '圖像 / 採樣' },
  // cols 由元件 clamp 到 20..400（見 SymbolFace 的 prop 註解），滑桿範圍與之一致
  {
    key: 'cols',
    label: '格數(疏密)',
    kind: 'range',
    min: 20,
    max: 400,
    step: 1,
    group: '圖像 / 採樣',
  },
  {
    key: 'charAspect',
    label: '字寬高比',
    kind: 'range',
    min: 0.3,
    max: 1.5,
    step: 0.01,
    group: '圖像 / 採樣',
  },
  {
    key: 'contrast',
    label: '對比',
    kind: 'range',
    min: 0.5,
    max: 2.5,
    step: 0.05,
    group: '圖像 / 採樣',
  },
  { key: 'invert', label: '負片', kind: 'bool', group: '圖像 / 採樣' },
  {
    key: 'sizeMin',
    label: '字級 min(格高比)',
    kind: 'range',
    min: 0,
    max: 1.5,
    step: 0.01,
    group: '圖像 / 採樣',
  },
  {
    key: 'sizeMax',
    label: '字級 max(格高比)',
    kind: 'range',
    min: 0,
    max: 1.5,
    step: 0.01,
    group: '圖像 / 採樣',
  },
  {
    key: 'weightSteps',
    label: '字重階數',
    kind: 'range',
    min: 1,
    max: 9,
    step: 1,
    group: '圖像 / 採樣',
  },
  {
    key: 'weightMin',
    label: '字重 min',
    kind: 'range',
    min: 100,
    max: 900,
    step: 100,
    group: '圖像 / 採樣',
  },
  {
    key: 'weightMax',
    label: '字重 max',
    kind: 'range',
    min: 100,
    max: 900,
    step: 100,
    group: '圖像 / 採樣',
  },
  {
    key: 'jitter',
    label: '格點抖動',
    kind: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    group: '圖像 / 採樣',
  },
  {
    key: 'maxParticles',
    label: '粒子上限',
    kind: 'range',
    min: 2000,
    max: 60000,
    step: 500,
    group: '圖像 / 採樣',
  },
  {
    key: 'fitWidth',
    label: 'fit 寬',
    kind: 'range',
    min: 100,
    max: 1200,
    step: 10,
    group: '圖像 / 採樣',
  },
  {
    key: 'fitHeight',
    label: 'fit 高',
    kind: 'range',
    min: 100,
    max: 1200,
    step: 10,
    group: '圖像 / 採樣',
  },
  {
    key: 'worldScale',
    label: 'world 縮放',
    kind: 'range',
    min: 0.2,
    max: 3,
    step: 0.05,
    group: '圖像 / 採樣',
  },

  // ---------- 場景 / 節奏 ----------
  {
    key: 'revealDuration',
    label: '組合秒數',
    kind: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 's',
    group: '場景 / 節奏',
  },
  {
    key: 'disperseDuration',
    label: '散場秒數',
    kind: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 's',
    group: '場景 / 節奏',
  },
  {
    key: 'disperseSpread',
    label: '散場範圍 xyz',
    kind: 'csvNum',
    group: '場景 / 節奏',
  },
  {
    key: 'convergeSize',
    label: '收斂點邊長',
    kind: 'range',
    min: 1,
    max: 120,
    step: 1,
    unit: 'px',
    group: '場景 / 節奏',
  },
  {
    // 上界 0.9 不是 UI 保守值：1.0 會讓 shader 裡 per-particle 的 smoothstep 窗寬變 0
    key: 'convergeStagger',
    label: '匯聚速差',
    kind: 'range',
    min: 0,
    max: 0.9,
    step: 0.05,
    group: '場景 / 節奏',
  },
  {
    key: 'inkGamma',
    label: '字墨飽滿度',
    kind: 'range',
    min: 0.2,
    max: 2,
    step: 0.05,
    group: '場景 / 節奏',
  },
  {
    key: 'twinkleAmp',
    label: '明滅幅度',
    kind: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    group: '場景 / 節奏',
  },
  {
    key: 'breathAmp',
    label: '呼吸幅度',
    kind: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    group: '場景 / 節奏',
  },

  // ---------- 漂浮 ----------
  {
    key: 'floatAmp',
    label: '整體漂浮幅度',
    kind: 'range',
    min: 0,
    max: 200,
    step: 1,
    group: '漂浮',
  },
  {
    key: 'floatMicro',
    label: '微擾幅度',
    kind: 'range',
    min: 0,
    max: 50,
    step: 0.5,
    group: '漂浮',
  },
  {
    key: 'floatSpeed',
    label: '漂浮速度',
    kind: 'range',
    min: 0,
    max: 5,
    step: 0.1,
    group: '漂浮',
  },

  // ---------- 斥力 / 物理 ----------
  {
    key: 'holeRadius',
    label: '真空半徑',
    kind: 'range',
    min: 0,
    max: 400,
    step: 5,
    group: '斥力 / 物理',
  },
  {
    key: 'holeSpread',
    label: '擴散範圍',
    kind: 'range',
    min: 0,
    max: 600,
    step: 5,
    group: '斥力 / 物理',
  },
  {
    key: 'returnEase',
    label: '回位速率',
    kind: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    group: '斥力 / 物理',
  },
  {
    key: 'friction',
    label: '動量衰減',
    kind: 'range',
    min: 0,
    max: 20,
    step: 0.1,
    group: '斥力 / 物理',
  },
  {
    key: 'impulseStrength',
    label: '外推力道',
    kind: 'range',
    min: 0,
    max: 30000,
    step: 100,
    group: '斥力 / 物理',
  },
  {
    key: 'impulseSpray',
    label: '發散角',
    kind: 'range',
    min: 0,
    max: 3.15,
    step: 0.05,
    unit: 'rad',
    group: '斥力 / 物理',
  },
  {
    key: 'impulseSprayZ',
    label: 'z 散射',
    kind: 'range',
    min: 0,
    max: 3,
    step: 0.05,
    group: '斥力 / 物理',
  },
  {
    key: 'velocityFollow',
    label: '拖曳甩出比例',
    kind: 'range',
    min: 0,
    max: 2,
    step: 0.05,
    group: '斥力 / 物理',
  },
  {
    key: 'maxSpeed',
    label: '速度上限',
    kind: 'range',
    min: 100,
    max: 10000,
    step: 100,
    group: '斥力 / 物理',
  },

  // ---------- 避讓 / 滑鼠 ----------
  {
    key: 'groupShift',
    label: '群閃避量',
    kind: 'range',
    min: 0,
    max: 100,
    step: 1,
    group: '避讓 / 滑鼠',
  },
  {
    key: 'groupShiftNear',
    label: '閃避近界',
    kind: 'range',
    min: 0,
    max: 600,
    step: 10,
    group: '避讓 / 滑鼠',
  },
  {
    key: 'groupShiftFar',
    label: '閃避遠界',
    kind: 'range',
    min: 0,
    max: 1200,
    step: 10,
    group: '避讓 / 滑鼠',
  },
  {
    key: 'mouseEase',
    label: '滑鼠平滑',
    kind: 'range',
    min: 0.5,
    max: 30,
    step: 0.5,
    group: '避讓 / 滑鼠',
  },
  { key: 'autoMouse', label: '自動游標', kind: 'bool', group: '避讓 / 滑鼠' },
  {
    key: 'autoMouseSpeed',
    label: '自動游標速度',
    kind: 'range',
    min: 0,
    max: 5,
    step: 0.1,
    group: '避讓 / 滑鼠',
  },

  // ---------- 彩蛋 ----------
  { key: 'phrases', label: '彩蛋句(逗號)', kind: 'csvStr', group: '彩蛋' },
  {
    key: 'gridCols',
    label: '宮格欄',
    kind: 'range',
    min: 1,
    max: 8,
    step: 1,
    group: '彩蛋',
  },
  {
    key: 'gridRows',
    label: '宮格列',
    kind: 'range',
    min: 1,
    max: 8,
    step: 1,
    group: '彩蛋',
  },
];

/** 面板可編輯的全部設定鍵（含三個手寫欄位）＝ SymbolFace 建 cfg 時要從 props 撈的清單。 */
export const SYMBOL_CONFIG_KEYS: string[] = [
  'color',
  'colorStops',
  'glitchItems',
  ...SYMBOL_CONFIG_SCHEMA.map((f) => f.key),
];

/**
 * 可「即時套用」的顏色鍵：改這些不必重取樣、不必重建 atlas、不必重跑 reveal 動畫，
 * 只要換一張 256×1 的 ramp texture 與幾個 uniform。見 SymbolFace 的 applyColors()。
 * 其餘參數都得走 applyConfig()（＝面板的 Refresh），因為它們決定幾何與材質本身。
 */
export const SYMBOL_LIVE_COLOR_KEYS = [
  'color',
  'colorStops',
  'colorMode',
  'bgColor',
  'convergeBgColor',
  'convergeColor',
  'phraseColor',
  'glitchItems',
] as const;

/** 漸層色票數量上限（純 UI 約束，buildColorRamp 本身沒有上限） */
export const SYMBOL_MAX_COLOR_STOPS = 6;

/** glitch 組數上限。GLSL ES 1.0 的陣列 uniform 必須是固定長度，SymbolFace 以
 *  GLITCH_SLOTS 讀這個常數、再插值進 shader（宣告長度與迴圈上界）—— 故這裡是**唯一**
 *  的來源，改這個數字就會一路帶到 shader 與面板的「+ 新增顏色」上限。
 *  6 是 2026-08-20 設計師 preset 的組數（見 temp/matrix_preset_.json）。 */
export const SYMBOL_MAX_GLITCH_ITEMS = 6;

/** n 個色標的等距位置（0..1）；n=1 時回傳 [0] */
export const equidistantStops = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => (n <= 1 ? 0 : i / (n - 1)));
