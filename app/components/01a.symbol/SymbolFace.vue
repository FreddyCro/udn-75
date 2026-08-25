<script setup lang="ts">
// @ts-nocheck
import * as THREE from 'three';
import { gsap } from 'gsap';
// 512×747 lossless WebP（268 KB），由 `node scripts/hero-assets.mjs --face` 從
// face.png（1013×1478 RGBA、1.62 MB）降尺寸而來。
//
// 為什麼可以降：這張圖**只被拿去取樣粒子位置**，而 buildFromImage 自己會先縮到
// cols(89) × SAMPLE_PX_PER_CELL(4) = 356 px 寬再取樣（見該處註解）—— 1013 px 有 2.8 倍
// 是白付的頻寬，而且它在 onMounted 就開抓，正好和 9.8 MB 的開場影片搶同一段。
//
// 實測等價（temp/face-sample-equiv.mjs，對兩張圖跑同一條 sampleImageToGrid）：
//   網格 89×84 相同 · 粒子數 5,981 ↔ 5,981 完全相同 · 位置偏差 0.000000 world
//   字元階 98/5,981 顆不同 (1.64%) · 平均亮度差 0.00075
// 也就是輪廓與密度逐點相同，只有少數卡在亮度階界的格子換了字元。
//
// ⚠️ 用 lossless 而非有損：sampler 以 alpha ≥ 0.5 判斷「去背輪廓內」（symbol-sampler.ts），
//    有損 WebP 的 alpha 量化會直接改變粒子數。
// ⚠️ 換素材時目標寬度不可低於 cols × SAMPLE_PX_PER_CELL，否則取樣解析度不足。
// （face.png 原檔留在 repo 供對照；沒有 import 就不會進 bundle。）
import portraitUrl from '~/assets/img/face.webp';
// import portraitUrl from '~/assets/img/einstein.png';
import {
  buildColorRamp,
  buildGlyphAtlas,
  buildWeightLadder,
  sortCharsByInk,
  type GlyphAtlas,
} from '~/utils/symbol-atlas';
import { sampleImageToGridWithLimit } from '~/utils/symbol-sampler';
import { FACE_HOVER_INFLUENCE, faceUv } from '~/utils/symbol-hint';
import { EGG_CLOSED, nextEggIndex, tapEggIndex } from '~/utils/symbol-egg';
import {
  SYMBOL_CONFIG_KEYS,
  SYMBOL_MAX_GLITCH_ITEMS,
} from '~/utils/symbol-face-config';
import { scrambleText } from '~/utils/symbol-scramble';
import type { SymbolMode } from '~/composables/useOrangeCoreProgress';

const props = defineProps({
  /** 人像圖片（需含透明背景，alpha 即輪廓遮罩） */
  src: { type: String, default: portraitUrl },
  /** 符號字元集。2026-08-20 起為設計師定案的集合（見 temp/matrix_preset_.json 的
   *  customChars）—— 取自 "UDN75 ANNIVERSERIY/:_+.=)(#\"><" 去空白後的 24 個唯一字元。
   *  ⚠️ 順序無意義：sortCharsByInk 會去重並**依墨水量重排**，字元是按該格亮度指派的，
   *     畫面上不會排出可讀的單字（故原字串把 ANNIVERSARY 拼成 ANNIVERSERIY 不影響輸出，
   *     但也不要「順手修正」—— 那會少一個 I、多一個 A ＝ 換掉字元集）。 */
  chars: {
    type: Array as () => string[],
    default: () => [
      'U', 'D', 'N', '7', '5',
      'A', 'I', 'V', 'E', 'R', 'S', 'Y',
      '/', ':', '_', '+', '.', '=', ')', '(', '#', '"', '>', '<',
    ],
  },
  /** 顏色：單色字串，或多色標漸層陣列（如 ['#000','#77c6e0','#fff']），依 colorMode 取色 */
  color: {
    type: [String, Array] as () => string | string[],
    default: '#88beef',
  },
  /** 漸層取色方式：'tone' 依明暗對應（暗→左端、亮→右端）/ 'random' 每顆隨機取色 */
  colorMode: { type: String, default: 'tone' },
  /** 目標框寬（world 單位）：圖以 contain 方式塞入，正規化 render 大小 */
  fitWidth: { type: Number, default: 500 },
  /** 目標框高（world 單位）：圖以 contain 方式塞入，正規化 render 大小 */
  fitHeight: { type: Number, default: 500 },
  /** 貼合後的額外縮放倍率（1 = 純貼合目標框）。
   *  ⚠️ 這是**唯一**的「整張臉等比縮放」旋鈕：cellW ∝ worldW、cellH = cellW/charAspect、
   *     aSize ∝ cellH（見 symbol-sampler 的 computeGrid / sampleImageToGrid）——
   *     故它同時縮外框、間距、符號大小，三者比例不變，粒子數也不變。
   *     改 cols / sizeMax 都只動內部比例，臉的外框大小紋風不動。
   *  ⚠️ 縮小後不會跟著縮的是所有 world 單位的互動/動畫量：holeRadius、holeSpread、
   *     groupShift、floatAmp、floatMicro、disperseSpread、impulseStrength、maxSpeed。
   *     它們相對於變小的人臉會等比變大（真空洞看起來更兇、飄得更晃），要維持原本手感
   *     得自己一起乘。convergeSize 則相反 —— 它是螢幕 px、要與 ForumCore 的橘方塊
   *     硬切對位，不可跟著縮。 */
  worldScale: { type: Number, default: 1.0 },
  /** 橫向格數＝疏密主控，clamp 到 20..400。
   *  89 ＝ 設計師 preset 的值（見 temp/matrix_preset_.json）。他的產生器畫在 578×840 的
   *  canvas 上、cellW 6.5 / cellH 10 → 89 × 84 格；我們在 face.png（1013×1478）以
   *  fit 500 × worldScale 0.9 取樣，computeGrid 算出的也是 89 × 84 —— 兩邊同一個格網，
   *  故他的 px 級參數（sizeMin/sizeMax）可以直接除以 10 換成本檔的「佔格高比例」。
   *  （曾為 85，理由是「滿版一屏放不下 gemini 預設的 130 欄」——89 同樣遠低於 130，
   *    那個結論不受影響。） */
  cols: { type: Number, default: 89 },
  /** monospace 寬高比：cellH = cellW / charAspect。0.65 取自 gemini 的 baseFontSize × 0.65 */
  charAspect: { type: Number, default: 0.65 },
  /** 對比：繞中灰 0.5 放大明暗差（取代舊的 darkBoost 乘法增益）。
   *  1.4 ＝ 設計師 preset；公式與他的產生器完全相同（見 symbol-sampler 的 toneMap）。 */
  contrast: { type: Number, default: 1.4 },
  /** 負片：反轉明暗，決定人臉是「光雕」還是「陰影雕」 */
  invert: { type: Boolean, default: false },
  /** 字重階數；1 ＝ 單一字重 */
  weightSteps: { type: Number, default: 5 },
  /** 暗部字重 */
  weightMin: { type: Number, default: 100 },
  /** 亮部字重。500 ＝ 設計師 preset；與 weightMin 100 搭 weightSteps 5 恰好是他的產生器
   *  在 100..500 間做 round(w/100)*100 的那 5 階。
   *  ⚠️ 未驗證：atlas 烘字用 "Courier New", monospace（非可變字型，只有 regular/bold），
   *     canvas 對 100–500 很可能一律選 regular ＝ 這五階畫出來一樣粗、字重滑桿是啞的。
   *     他的產生器用 monospace 也有同樣限制，故兩邊一致、不是我們這邊的 bug；
   *     真的要連續字重得換成 variable mono font。 */
  weightMax: { type: Number, default: 500 },
  /** 漸層色標位置（0..1），長度需與 color 相同；空陣列＝等距 */
  colorStops: { type: Array as () => number[], default: () => [] },
  /** glitch 跳色：依 fps 隨機把少量粒子染色（取代舊的隨機換字），最多 4 組 */
  glitchItems: {
    type: Array as () => { color: string; density: number; fps: number }[],
    default: () => [],
  },
  /** 格點隨機位移比例；0 ＝ 全規則格點 */
  jitter: { type: Number, default: 0 },
  /** 暗部字級佔格高的比例（0..1）。0.40 ＝ 設計師 preset 的 minSize 4px ÷ 他的 cellH 10px。 */
  sizeMin: { type: Number, default: 0.4 },
  /** 亮部字級佔格高的比例。0.80 ＝ 設計師 preset 的 maxSize 8px ÷ 他的 cellH 10px
   *  （1.0 ＝ 字級等於格高、墨水寬 ≈ 0.92 × cellW；超過約 1.08 開始橫向重疊成塊）。
   *  ⚠️ 待校準：inkGamma 的 0.6 是在 sizeMax = 1.0 下對照他的產生器校出來的。降到 0.8 後
   *     sprite 由 ~10.3px 縮到 ~8.2px，而 atlas 烘的是 25px → 放大倍率 2.4 升到 3.0、
   *     多吃一層 mipmap，筆劃會再被攤薄，預期 inkGamma 要往下調才追得回濃度。
   *     這一項只能目視／量墨水量校，不能純換算，故先不動 inkGamma。 */
  sizeMax: { type: Number, default: 0.8 },
  /** 粒子數上限；超過時自動遞減 cols 重新取樣（不隨機淘汰，那會打壞矩陣） */
  maxParticles: { type: Number, default: 24000 },

  // ---------- 場景 / 動畫節奏 ----------
  /** 背景色（集合 / 散場漂浮時的底色） */
  bgColor: { type: String, default: '#ffffff' },
  /** 匯聚成點狀態的背景色：這段序列走完時整片底色會是這個顏色。
   *  翻過去的**時機**由 syncBg 的驅動源決定，依序取 bgLightAmount → convergeAmount →
   *  mode ＋ disperseDuration。正式站傳 bgLightAmount，故底色是在粒子收攏**之後**、
   *  跟著那顆白 core 轉橘的同一段窗口才翻白（見 orange-core-config 的 CORE_WARM_VH）；
   *  反向（往回捲）會沿原路退回去。
   *  ⚠️ 這是整片畫面的底色，不是元件外框 —— canvas 是滿版不透明的，翻的是 scene.background。 */
  convergeBgColor: { type: String, default: '#ffffff' },
  /** 組合（reveal）動畫秒數 */
  revealDuration: { type: Number, default: 3 },
  /** 散場（disperse）動畫秒數 */
  disperseDuration: { type: Number, default: 2.2 },
  /** 散場擴散範圍 [x, y, z] */
  disperseSpread: {
    type: Array as () => number[],
    default: () => [900, 520, 240],
  },
  /** 匯聚成點時那顆點的螢幕邊長（CSS px）。
   *  預設 ＝ CORE.dotSize（見 ~/utils/orange-core-config）：converge 終點要與 ForumCore 的
   *  橘方塊硬切交棒（FORUM_HANDOFF.coreIn），兩者同尺寸才不會在接棒那刻跳大小。
   *  ⚠️ 這是「實心方塊」的邊長，不是字級 —— 收攏末段整個 sprite 會被補成不透明
   *     （見 vertexShader 的 solid / fragmentShader 的 mix(a, 1.0, vSolid)）。
   *     沒有那道實心化的話，sprite 邊長 26px 畫出來的可見墨水只有約 12px：
   *     atlas 烘字只佔 cell 的 GLYPH_FONT_SCALE(0.78)，字身墨水又只有字級的 ~0.6。 */
  convergeSize: { type: Number, default: CORE.dotSize },
  /** 匯聚成點時那顆點的**最終**顏色。預設 ＝ CORE.orange（同 ForumCore 的橘方塊）。
   *  ⚠️ 只作用在**實心化之後**（vSolid，＝ uConverge 的最後 10%），且套用的量另外由
   *     warmAmount 決定（vWarm ＝ solid × uWarm）—— 收攏途中粒子仍走原本的 color ramp。
   *     所以順序是「那團符號收緊、凝成一顆**白**方塊，之後才由白轉橘」。
   *     白→橘讓接棒不需要 crossfade：兩顆同色同尺寸同位置，直接硬切。 */
  convergeColor: {
    type: String,
    default: CORE_ORANGE_HEX,
  },
  /** 匯聚進度（0..1）由外部**逐幀**餵進來；null ＝ 沿用 mode 觸發的 disperseDuration 補間。
   *
   *  正式站傳 `symbolConvergeAmount`（＝ convergeAmountAt(symbolProgress)，見
   *  ~/utils/orange-core-config），因為那一拍要能**往回捲倒帶**：定時補間只知道
   *  「mode 剛剛翻了」，不知道捲到哪裡，於是往回滑時整拍靜止、補間要到離開那一拍
   *  才開始跑 —— 使用者看到的就是連續 96vh 一片白什麼都不動。完整推導在那支函式上方。
   *
   *  null ＝ 走元件自己的定時補間（mode 一翻就跑一次 disperseDuration）：沒有捲動
   *  可綁的用法（單純掛著切 mode）只有這條看得到動作。
   *  所以這是**兩種驅動方式**，不是新舊版本 —— 兩條路都要留著。
   *
   *  ⚠️ 2026-08-17 起它**只**接管 uConverge（粒子的收攏）。底色與白→橘各自有自己的
   *     驅動值（bgLightAmount / warmAmount），因為那兩件事已經搬到收攏**之後**的窗口
   *     去發生了，見 orange-core-config 的 CORE_WARM_VH。
   *     ——「只接管一半會脫鉤」那條警告仍然成立，只是現在有三個一半，正式站三個都要傳。
   *  ⚠️ disperse ↔ face 不受影響，仍走 mode ＋ disperseDuration。 */
  convergeAmount: { type: Number as PropType<number | null>, default: null },
  /** 那顆已實心的 core 由白轉橘的量（0..1），由外部**逐幀**餵進來；
   *  null ＝ 沿用 mode 觸發的補間（與 uConverge 同一組 duration / ease，
   *  ＝ 改版前「實心化的同時就是橘的」那個行為）。
   *
   *  正式站傳 `symbolCoreWarm`（＝ coreWarmAt(symbolProgress)）。
   *  ⚠️ 只作用在已實心化的粒子上（vWarm ＝ solid × uWarm），所以收攏途中把它推到 1
   *     也不會讓半空中的符號變橘。 */
  warmAmount: { type: Number as PropType<number | null>, default: null },
  /** 整片底色由 bgColor 翻到 convergeBgColor 的量（0..1），由外部**逐幀**餵進來；
   *  null ＝ 退回吃 convergeAmount（再沒有就走 mode 補間，見 syncBg）。
   *
   *  正式站傳 `symbolBgLight`（＝ symbolBgLightAt(symbolProgress)）。它與 warmAmount
   *  **同時起跑但刻意不同步**：底色殿後，理由見 orange-core-config 的 CORE_WARM_COLOR_SPAN。 */
  bgLightAmount: { type: Number as PropType<number | null>, default: null },
  /** 匯聚的「速差」：每顆粒子起跑點的散佈比例（0..0.9）。
   *  0 ＝ 全員同步收攏 —— 那等同對原點做等比縮放，看起來是「整張臉變小」而不是
   *  「符號各自飛進核心」。>0 則把每顆的起跑點依 aSeed 亂序散在 0..此值，
   *  窗寬固定為 (1 - 此值)，故最慢的那顆仍剛好在 uConverge=1 抵達
   *  —— 終點全員對齊是硬需求（要與 ForumCore 的橘方塊同尺寸同位置硬切交棒）。
   *  ⚠️ 不可設到 1：窗寬會變 0，smoothstep 兩端相等＝除以 0。 */
  convergeStagger: { type: Number, default: 0.5 },

  // ---------- 無互動時的整體漂浮 ----------
  /** 整體漂浮幅度（全部 symbol 同步隨機遊走，做出「整片在飄」） */
  floatAmp: { type: Number, default: 22 },
  /** 每顆 symbol 額外微擾幅度（organic 感） */
  floatMicro: { type: Number, default: 4 },
  /** 漂浮速度倍率 */
  floatSpeed: { type: Number, default: 1.0 },
  /** glyph alpha 的 gamma（<1 會讓字變飽滿）。
   *  atlas 縮放時 mipmap 把筆劃攤成半透明，實測總 alpha 只剩原生 fillText 的 0.746，
   *  整片會比 gemini 暗一截。這一項把部分覆蓋的像素拉回來，1 = 不補償。
   *  0.6 是對照 gemini 實測校準的：畫面總墨水量（ink bbox 內總亮度／面積）
   *  1.0→52%、0.55→112%、**0.6→101%**、0.65→97%。 */
  inkGamma: { type: Number, default: 0.6 },
  /** 透明度明滅幅度（原本寫死 0.18） */
  twinkleAmp: { type: Number, default: 0.06 },
  /** 字級呼吸幅度（原本寫死 0.12） */
  breathAmp: { type: Number, default: 0.06 },

  // ---------- 滑鼠真空（斥力） ----------
  /** 真空半徑：游標圈內完全清空 */
  holeRadius: { type: Number, default: 90 },
  /** 擴散範圍：圈外再延伸多遠做遞減外推（柔化邊界、擴散到周圍） */
  holeSpread: { type: Number, default: 140 },

  // ---------- 慣性物理（動量 + 指數 ease 回位；撞散→帶動量四散→平順歸位，不 overshoot） ----------
  // 對照 LIU_FEEDBACK_2 #2-3：脫離「果凍感」＝回位改「指數 ease」而非彈簧力
  // （彈簧回復力加到速度會 overshoot→bounce＝果凍）。參考 codepen BaxvVdJ：
  // x += (vx *= friction) + (origin - x) * ease —— 速度只保留動量（往外散），位置直接對原位做 lerp（單調趨近）。
  /** 回位速率（1/秒）：對原位做指數 ease；越大回得越快，但始終單調趨近、不 overshoot。越小＝回彈更慢更遠、更散 */
  returnEase: { type: Number, default: 2.5 },
  /** 動量衰減 friction（1/秒）：速度每幀 ×exp(-friction·dt)。越小越「滑」、滯空越久越散；越大越快靜止 */
  friction: { type: Number, default: 1.8 },
  /** 游標外推力道：越大洞越大、撞得越開 */
  impulseStrength: { type: Number, default: 6000 },
  /** 撞散方向發散角（弧度）：0=整齊徑向放射；越大每顆旋轉固定隨機角 → 炸裂不規則四散 */
  impulseSpray: { type: Number, default: 0.9 },
  /** z 方向散射倍率：撞散時往鏡頭前後散開的立體炸開感（維持人臉平面感，宜小） */
  impulseSprayZ: { type: Number, default: 0.6 },
  /** 沿游標移動方向甩出的比例：拖曳時粒子順移動方向飛濺（0=只有徑向斥力） */
  velocityFollow: { type: Number, default: 0.35 },
  /** 粒子速度上限（world 單位/秒）：friction 值偏低（動量保留高）時避免無限加速、維持炸裂又穩定 */
  maxSpeed: { type: Number, default: 2600 },

  // ---------- 整體避讓（symbol 群閃避游標） ----------
  /** 游標越遠，整群往反方向（遠離游標）位移的最大量（微微一動） */
  groupShift: { type: Number, default: 11 },
  /** 此距離內（游標貼近/重疊群中心）不位移，以保留中心環形真空 */
  groupShiftNear: { type: Number, default: 120 },
  /** 游標離群中心到此距離時達最大位移、之後停住 */
  groupShiftFar: { type: Number, default: 380 },
  /** 滑鼠互動平滑速度：越大越跟手、越小越柔（進入/移動/離開都會緩動，不瞬移） */
  mouseEase: { type: Number, default: 8 },
  /** 自動游標：無 hover 環境（手機）以虛擬游標在人像內隨機遊走，沿用真空/避讓效果 */
  autoMouse: { type: Boolean, default: false },
  /** 自動游標遊走速度倍率 */
  autoMouseSpeed: { type: Number, default: 1.0 },

  // ---------- 彩蛋：宮格 → 句子 ----------
  /** 句子陣列：index 以 row-major 對應宮格（空字串或不足格數的格子不顯示） */
  phrases: {
    type: Array as () => string[],
    default: () => ['1', '2', '3', '4', '5', '6'],
  },
  /** 宮格欄數（橫向切幾格） */
  gridCols: { type: Number, default: 3 },
  /** 宮格列數（縱向切幾格） */
  gridRows: { type: Number, default: 2 },
  /** 彩蛋文字顏色。設計稿 Figma 1145:41559：main/orange（＝ CORE.orange） */
  phraseColor: { type: String, default: CORE_ORANGE_HEX },

  /** 是否在場：false → 停掉 rAF 迴圈（不做物理積分、不上傳 buffer、不 render）。
   *  ⚠️ 為什麼需要這個 prop、而不是在元件內自己判斷：本元件在 Hero 是住在
   *     HeroSymbolTransition 的 slot 內，那層是 fixed inset:0、以 visibility:hidden 隱藏
   *     —— 幾何上永遠滿版落在視口，IntersectionObserver 恆為 intersecting
   *     （IO 只看幾何與 display:none，visibility / opacity 都不算），元件自己偵測不到
   *     「其實看不見」。唯一便宜的替代是每幀 getComputedStyle，那是強制 style recalc。
   *     故由做出隱藏決定的那一層把「本層在場嗎」傳進來。
   *  預設 true：一般 in-flow 用法不必傳，交給下方 IntersectionObserver 判斷即可。 */
  active: { type: Boolean, default: true },

  /** PC 互動提示文字（≥1280px，空字串＝不顯示）。換行用 \n，樣式端以 white-space: pre-line 呈現。
   *  設計稿 Figma 2065:139734：圓環圖示 + 兩行說明橫排，錨在人像右下臉頰（見 HINT_ICON_UV）。
   *  游標真的碰到人像就收起（收多久見 hintOnce）。 */
  hint: { type: String, default: '' },
  /** 平板互動提示文字（768–1279px，空字串＝不顯示）。
   *  **版位與 hint 同一套**（圓環圖示 + 右側兩行橫排，見 .hint__text 的斷點），只有文案不同
   *  —— 這一段的操作邏輯跟手機一樣是點擊（見 TAP_QUERY），沿用 hint 的「游標移動」
   *  等於叫使用者移動一個不存在的游標。故是獨立一份文案、不是獨立一套版位。 */
  hintPad: { type: String, default: '' },
  /** 手機版互動提示文字（＜768px，空字串＝不顯示）。設計稿 Figma 2065:120222。
   *  與 hint / hintPad 的差別是**版位**：手機的說明不排在圖示右邊，而是單行置中排在人像下方
   *  （見 .hint-mob）。圓環圖示本身三個斷點共用。 */
  hintMob: { type: String, default: '' },
  /** 下滑提示的說明文字（空字串＝不渲染這顆按鈕）。設計稿 Figma 2065:139741。
   *  圖示本體、漂移動態與「點了往下捲一屏」都在 <UBtnScrollHint>，本元件只給版位。
   *  ⚠️ 有文案**不等於**會出現：顯示時機是三個條件的交集（2026-08-23 定案，見 scrollHintOn）
   *     —— 本層在場 ＋ 停超過十秒沒捲動 ＋ 手機版互動提示不在畫面上。 */
  scrollHint: { type: String, default: '' },
  /** 提示是否「整個生命週期只出現一次」。
   *  false（預設）＝ 每次**重新完整集合**都再出現一次；游標碰到人像仍立即收起，
   *    但那次收起只對這一輪集合有效（見 faceFormed 的 watch）。
   *    捲回去重看、或散場後再聚回來的使用者，會重新拿到這個提示。
   *  true ＝ 碰過一次就永久收起，之後再怎麼重新集合都不再出現（提示是教學，學會就不該再打擾）。
   *  ⚠️ 兩種模式都不受 resize / 離開視窗影響，差別只在「重新集合時要不要復原」。 */
  hintOnce: { type: Boolean, default: false },
});

// 色票字串 → uniform 用的 vec3，**不做色彩空間轉換**。
// ⚠️ 不能寫 new THREE.Color(hex)：r152 起 ColorManagement 預設開啟，setStyle 會把 sRGB
//    轉成 linear-sRGB。而本元件是 raw ShaderMaterial —— gl_FragColor 直接寫進 framebuffer，
//    沒有 three 的 output 轉換鏈把它轉回來；漸層那張 CanvasTexture 也沒設 colorSpace
//    （＝原樣取樣）。整份是一致的「naive sRGB」，這裡若多轉一次，同一個色號會比 ramp
//    暗一階：#ff7f00 會畫成偏紅的 rgb(255, 55, 0)。
//    第二個參數指定 working space ＝ 告訴 three「輸入已在目標空間」→ 不轉換。
const srgbColor = (style: string) =>
  new THREE.Color().setStyle(style, THREE.LinearSRGBColorSpace);

const wrapRef = ref<HTMLDivElement | null>(null);
const eggRef = ref<HTMLDivElement | null>(null);
// 目前顯示的彩蛋句 index（EGG_CLOSED ＝ 不顯示），只在換句時更新 → slot 內容僅換句才 re-render。
// 兩種驅動方式（見下方 TAP_QUERY 那段）：桌機是游標所在宮格逐幀推導，手機／平板是 tap／計時器寫入。
const activeEgg = ref(EGG_CLOSED);

// 彩蛋換句的音效。⚠️ **不要**掛在 watch(activeEgg) 上 —— 那個 watcher 對自動換句
// 與使用者換句一視同仁，而自動換句是每 3 秒一輪（EGG_AUTO_MS），音檔卻有 2.3s，
// 掛上去等於不間斷的嗡嗡聲。故只掛在兩個使用者驅動點：手機 tap 與桌機 hover 換宮格。
const { play: playSfx } = useSfx();

// 彩蛋切換時的「亂碼跑動」出現動畫：activeEgg 換格時，文字由隨機字元逐步落定成句子，
// 讓「切換到另一則彩蛋」更明顯。displayText 取代直接顯示 phrases[activeEgg]。
const displayText = ref('');
const SCRAMBLE_MS = 480;
let scrambleRaf = 0;
// 時鐘是**時間軸**（換格觸發後 480ms 跑完），亂碼的長相則與 SymbolIntro 共用
// 同一支 scrambleText（見 ~/utils/symbol-scramble 檔頭）。
const runScramble = (target: string) => {
  cancelAnimationFrame(scrambleRaf);
  if (!target) {
    displayText.value = '';
    return;
  }
  const startT = performance.now();
  const tick = (nowT: number) => {
    const p = Math.min((nowT - startT) / SCRAMBLE_MS, 1);
    displayText.value = scrambleText(target, p);
    if (p < 1) scrambleRaf = requestAnimationFrame(tick);
    else displayText.value = target;
  };
  scrambleRaf = requestAnimationFrame(tick);
};
watch(activeEgg, (idx) => {
  runScramble(idx >= 0 ? (cfg.phrases[idx] ?? '') : '');
});

// ---------- 彩蛋：tap 驅動（手機 ＋ 平板）----------
// 手機與平板都沒有 hover，故 <1280px 走另一套：點人臉**任一處**就依序換下一句（不分宮格，
// 規則見 ~/utils/symbol-egg），開啟後每 EGG_AUTO_MS 自動換下一句，且**不因手指離開而收起**
// —— 只有點在人臉以外、或整個離開集合態（見 faceFormed 的 watch）才關。
// 桌機維持宮格 hover 對位，兩套只在 animate() 的彩蛋段分流。
//
// ⚠️ 這裡有**兩把不同的尺**，別再併回同一個查詢（2026-08-23 拆開）：
//   TAP_QUERY(<1280) ── 互動模式。平板是觸控，界線得畫在 pc 那一格才吃得到 tap。
//                       併回 768 的話 768–1279 會落在「走 hover 那套、但機器沒有 hover」
//                       的縫裡 ＝ 彩蛋整段摸不到。
//   MOB_QUERY(<768)  ── hint **版位**（HINT_ICON_UV 的 mob/pc 版位、.hint-mob 的存在）。
//                       稿只有 mob 與 pc 兩版，平板沿用 pc 版位、只換文案（見 hintPad）。
// 也就是說平板 ＝ 「pc 的版位 ＋ mob 的操作」，這正是它掉在縫裡的原因。
// ⚠️ 已知取捨：768–1279 外接滑鼠的機器（Surface、iPad + 觸控板）也走 tap ——
//    hover 不再開彩蛋，要點一下。改用 (hover: none) 能分辨，但會與吃寬度的 hint 版位脫鉤，
//    故依專案慣例一律走斷點。
const TAP_QUERY = '(max-width: 1279.98px)'; // ＝ mixins.scss 的 rwd-max('pc')
const MOB_QUERY = '(max-width: 767.98px)'; // ＝ mixins.scss 的 rwd-max('tablet')
// 非 reactive：animate() 每幀讀它分流，包成 ref 等於在熱迴圈多一次 getter。
// 真正需要重繪的狀態是 activeEgg，那個才是 ref。初值與後續變動見 onMounted 的 matchMedia。
let isTapMode = false;
// 版位那把尺的反應式副本：這兩支要進 template（文案來源、.hint-mob 的存在），
// 不在熱迴圈裡，故用 ref。與 isTapMode 在同一批地方一起更新（onMounted 的 matchMedia）。
const isMobView = ref(false);
/** 768–1279：pc 的 hint 版位 ＋ mob 的 tap 操作。 */
const isPadView = ref(false);
/** 自動換下一句的間隔（ms）。扣掉 480ms 的亂碼動畫還有 2.5 秒可讀。 */
const EGG_AUTO_MS = 3000;
let eggAutoTimer = 0;
const advanceEgg = () => {
  activeEgg.value = nextEggIndex(activeEgg.value, cfg.phrases.length);
};
const stopEggAuto = () => {
  clearInterval(eggAutoTimer);
  eggAutoTimer = 0;
};
/** 開始／重新計時。點擊本身就是一次「剛換過」，故要從頭算，不是接著上一輪的殘餘。 */
const startEggAuto = () => {
  stopEggAuto();
  eggAutoTimer = window.setInterval(advanceEgg, EGG_AUTO_MS);
};
// 彩蛋開著時真空是「定住」的（見 onLeave），關閉就得有人把它鬆開，
// 否則捲離集合態再回來時，influence 會停在 1 → 一回到人臉就有一個沒人點過的洞。
// onMounted 內指派（targetInfluence 住在那層）。
let releaseMouseFn: (() => void) | null = null;
const closeEgg = () => {
  stopEggAuto();
  activeEgg.value = EGG_CLOSED;
  releaseMouseFn?.();
};

onBeforeUnmount(() => {
  cancelAnimationFrame(scrambleRaf);
  stopEggAuto();
});
// 三種狀態：'face' = 集合（人像）/ 'disperse' = 分散（散場漂浮）/ 'converge' = 匯聚成點。
// 三態互斥，由 uDisperse / uConverge 兩個 uniform 表示（同一時間至多一個為 1）。
// v-model 由父層決定預設值並隨意切換（正式站是 SymbolScene 依捲動指派）。
// 型別取自 useOrangeCoreProgress（驅動端 SymbolScene 寫的就是那個 useState）——
// 兩邊各宣告一份的話，哪天多一個狀態就會只改到一邊。
const mode = defineModel<SymbolMode>('mode', { default: 'face' });
let disperseFn: ((animated?: boolean) => void) | null = null;

// 狀態改變時，可逆地補間 uDisperse / uConverge / uWarm（0↔1）與整片底色（見 syncBg）。
// 全部吃同一組 duration / ease，故在「外部沒接管」那條路徑上，
// 「收攏」「轉橘」「翻底色」是同一個動作。
// ⚠️ 外部有接管的那幾樣改由捲動驅動，這兩支會讓開（見 convergeAmount / warmAmount /
//    bgLightAmount 三個 prop）；mode 本身照舊翻面 —— disperse↔face 仍歸它管，
//    faceFormed 也還讀它。
let syncBgFn: ((animated?: boolean) => void) | null = null;
watch(mode, () => {
  disperseFn?.(true);
  syncBgFn?.(true);
});

/** 把外部餵進來的 0..1 夾住；null / undefined ＝ 外部沒有接管，走 mode 補間。 */
const clampAmount = (a: number | null | undefined) =>
  a === null || a === undefined ? null : a < 0 ? 0 : a > 1 ? 1 : a;

const scrubbedConverge = () => clampAmount(props.convergeAmount);
const scrubbedWarm = () => clampAmount(props.warmAmount);
/** 底色的驅動量：沒傳 bgLightAmount 就退回吃 convergeAmount（＝ 2026-08-17 之前的行為）。 */
const scrubbedBgLight = () =>
  clampAmount(props.bgLightAmount) ?? scrubbedConverge();

// 外部接管時的逐幀寫入點。三個值各自獨立：收攏、白→橘、底色翻白在正式站是**三段
// 不同的窗口**（見 convergeAmount prop），共用一個 watch 只會讓其中兩個被多寫幾次。
// 逐幀會被捲動打到，故這裡不做任何配置 —— 見各自的本體。
let applyConvergeFn: (() => void) | null = null;
let applyWarmFn: (() => void) | null = null;
watch(() => props.convergeAmount, () => applyConvergeFn?.());
watch(() => props.warmAmount, () => applyWarmFn?.());
watch(() => props.bgLightAmount, () => syncBgFn?.(false));

// 「完整集合」：mode 是 face、首次進場的 reveal 已跑完（uProgress=1）、且 uDisperse /
// uConverge 都已回到 0。由 animate() 每幀依 uniform 實況推導（只在真的變動時才寫入，
// 故不是每幀觸發 re-render），迴圈停下時一律為 false（見 stopLoop）。
//
// ⚠️ 不能改用 mode 判斷 —— mode 是「指令」不是「狀態」：翻成 face 的那一刻粒子還散在
//    半個畫面，要 disperseDuration(2.2s) 補間才聚攏；首次進場另有 revealDuration(3s)
//    的 uProgress 0→1。彩蛋與 PC 提示都是「臉已經在那裡」才成立的互動邀請，
//    集合途中就出現等於指著一團還在飛的粒子說「移動游標」。
const faceFormed = ref(false);

// 父層告知「本層是否在場」→ 重算執行閘門（onMounted 內指派，見 shouldRun / syncRunning）
let syncActive: (() => void) | null = null;
watch(() => props.active, () => syncActive?.());

// ---------- 設定（cfg）----------
// cfg 是 three.js 實際讀取的設定（初值 = props 併入 default 後的結果；本檔內 three.js
// 讀設定的地方一律讀 cfg 而不是 props）。要抄哪些 prop 見 SYMBOL_CONFIG_KEYS。
//
// 套用只有一條路徑：applyConfig(next) —— 合併後重建 atlas / 幾何 / 材質並重跑 reveal。
const cfg: Record<string, any> = {};
for (const key of SYMBOL_CONFIG_KEYS) {
  cfg[key] = props[key as keyof typeof props];
}

/** glitch 的 uniform 陣列長度。這個數字同時出現在
 *  JS（備幾組 uniform）與 GLSL（陣列宣告與迴圈上界，靠字串插值帶進去），
 *  兩邊分開寫的話擴組數時只會改到一半，多出來的組會安靜地不生效。
 *  ⚠️ GLSL ES 1.0 的陣列 uniform 長度與 for 迴圈上界都必須是**編譯期常數**，
 *     所以不能改成執行期依 glitchItems.length 動態決定。 */
const GLITCH_SLOTS = SYMBOL_MAX_GLITCH_ITEMS;

// glitch 跳色的 uniform 值（建材質時由 buildParticles 呼叫）。
// GLSL ES 1.0 的陣列 uniform 必須是固定長度，故一律備 GLITCH_SLOTS 組，未使用的以
// uGlitchCount 擋掉（density 0 也不會命中）。
// ⚠️ 顏色必須走 srgbColor（理由見該 helper 上方）：直接 new THREE.Color(hex) 會被
//    ColorManagement 轉成 linear-sRGB，而本元件是 raw shader、沒有轉回來的那一段 ——
//    #ff0055 會畫成約 #ff0017、#00ffcc 約 #00ff9a。
// density 除以 100：gemini 的 density 單位是百分比（1–30）。
const glitchUniforms = () => {
  const items = (cfg.glitchItems ?? []).slice(0, GLITCH_SLOTS);
  return {
    count: items.length,
    colors: Array.from({ length: GLITCH_SLOTS }, (_, i) =>
      srgbColor(items[i]?.color ?? '#000000'),
    ),
    density: Array.from(
      { length: GLITCH_SLOTS },
      (_, i) => (items[i]?.density ?? 0) / 100,
    ),
    fps: Array.from({ length: GLITCH_SLOTS }, (_, i) => items[i]?.fps ?? 0),
  };
};

// 在 onMounted 內指派（要有 scene / mat 才做得了事）
let rebuildParticles: (() => void) | null = null;

/** 全套用：合併設定後重建粒子系統（換圖、換格數、換字重…都走這條）。 */
const applyConfig = (next: Record<string, any>) => {
  Object.assign(cfg, next);
  rebuildParticles?.();
};

// cfg 的初值是在 setup 抄一次 props，**之後 props 變動不會自動跟上** —— 這是刻意的：
// cfg 每幀被 animate() 讀很多次，做成 reactive 等於每幀加一整排 proxy trap。
// worldScale 是唯一破例追蹤的一項：正式站用它做 RWD（手機的人臉要再縮一號，見 01.hero/Hero.vue
// 的 SYMBOL_WORLD_SCALE），而那個值會在轉向／跨斷點時才改變 —— 沒有這個 watch，
// 使用者橫轉直的那一刻人臉就會維持桌機尺寸而被切掉左右。
// 走 applyConfig ＝ 整組重建（它改的是取樣幾何），故必然伴隨一次 reveal 重跑；
// 這在「跨斷點」的頻率下可接受。
watch(() => props.worldScale, (v) => applyConfig({ worldScale: v }));

// ---------- 互動提示 ----------
// 顯示條件三個都要成立：人臉已完整集合（faceFormed）、尚未 dismiss、斷點有稿（樣式端擋）。
// 位置由 onMounted 內把人像 bbox 上的錨點投影到螢幕算出，null ＝ 人像還沒建好、先不渲染。

// 圓環圖示的錨點：人像 bbox 內的正規化座標（u 由左、v 由上，0..1）。
// 稿只有兩版版位，故只有兩組（平板沿用 pc 那組，見 MOB_QUERY 那段的兩把尺）：
//   pc  ── 使用者提供的 pc 版位參考圖，量圖示中心相對 bbox 的比例（右下臉頰、壓在下顎線上）
//   mob ── Figma 2065:120222：bbox (62,135) 293×428、圖示 88×88 落在 (269,368)
//          → u=(269+44-62)/293、v=(368+44-135)/428
// ⚠️ 是**圖示中心**不是整組的中心：pc 稿的說明文字排在圖示右邊（整組 203px 寬），
//    若拿整組置中，圖示會被文字推得偏左半個文字寬。對位交給 CSS（見 .hint 的 transform）。
const HINT_ICON_UV = {
  pc: [0.847, 0.859],
  mob: [0.857, 0.647],
};
// 手機版說明文字與人像 bbox 底緣的距離（Figma 2065:120222：bbox 底 563 → 文字頂 594）。
// 實際寫在 .hint-mob 的 margin-top，這裡只是註記出處。
// 版位判定吃 MOB_QUERY 那把尺（＜768 才有這一組），與互動模式的 TAP_QUERY 分開。

/** 圓環圖示右側那段橫排文字（pc 與平板共用版位、只換文案；手機不在這組裡，見 .hint-mob）。 */
const hintText = computed(() =>
  isPadView.value ? props.hintPad : props.hint,
);
/** 當下斷點真的會出現在畫面上的那一份文案 ＝ hint 顯隱的判準（見 syncHintVisible）。
 *  ⚠️ 不能一律讀 props.hint：平板讀的是 hintPad、手機讀的是 hintMob，
 *     用 props.hint 當判準的話，只給了其中一份文案的斷點會整組不出現。 */
const hintCopy = computed(() =>
  isMobView.value ? props.hintMob : hintText.value,
);

const hintVisible = ref(false);
const hintPos = ref<{ x: number; y: number } | null>(null);
// 手機版說明文字的錨點：人像 bbox 底緣中點（水平置中、垂直間距交給 CSS）
const hintMobPos = ref<{ x: number; y: number } | null>(null);
// 非 reactive：只有 animate() 熱迴圈讀寫，不需要觸發 re-render（真正驅動畫面的是 hintVisible）。
let hintDismissed = false;

/** 游標真的碰到人像 → 收起。收多久由 hintOnce 決定：
 *  once ＝ 永久；非 once ＝ 只到下次重新集合為止（重置點在 faceFormed 的 watch）。 */
const dismissHint = () => {
  hintDismissed = true;
  hintVisible.value = false;
};

/** 依當下斷點與集合狀態重算 hint 顯隱。兩個呼叫點：集合狀態改變（faceFormed 的 watch）、
 *  以及拉視窗／轉向跨過斷點（onTierChange）。
 *  ⚠️ 後者是必要的、不是保險：文案來源會跟著斷點換（見 hintCopy），
 *     從有文案的那一格換到沒文案的那一格時，舊的 true 會賴在畫面上。 */
const syncHintVisible = () => {
  hintVisible.value = faceFormed.value && !hintDismissed && !!hintCopy.value;
};

// 綁 faceFormed 而不是 mode：粒子真的聚成人臉那一刻才淡入，離開集合態（捲回 disperse、
// 前進 converge、或捲出視窗停掉迴圈）立即隱藏。
// ⚠️ 這裡不再排 setTimeout —— 舊寫法是「mode 翻成 face 後等 disperseDuration」去**猜**
//    集合完成的時間點：猜不到首次進場的 revealDuration、也猜不到補間被 kill/重跑
//    （見 disperseFn 的 killTweensOf）或迴圈中途被停掉的情形。
// 三份文案與 props.hintOnce 都是靜態常數（文案從 section1.json import，once 由父層寫死），
// 故不納入 watch source；若之後改成動態值，需一併加進來追蹤。
watch(faceFormed, (formed) => {
  // 非 once：離開集合態時把「已收起」還原 → 下一次完整集合會再出現一次。
  // ⚠️ 重置點放在**離開**而不是**進入**集合態：進入那一刻重置的話，
  //    dismissHint 與這裡會在同一輪集合內互踩 —— 游標一停在人像上，
  //    收起與復原會輪流發生，提示變成閃爍。
  if (!formed && !props.hintOnce) hintDismissed = false;
  syncHintVisible();

  // tap 版彩蛋的第二個（也是最後一個）關閉入口：離開集合態 —— 捲到 disperse／converge、
  // 捲出視口、切分頁（見 stopLoop 也會把 faceFormed 收成 false）。
  // ⚠️ 少了這一段，捲到匯聚那一拍畫面只剩一顆橘核心，卻還飄著一句橘字，
  //    而且背景那支 3 秒計時器會一直換句換下去。
  // 桌機寫不寫都一樣：它的 index 由 animate() 每幀依游標重算，下一幀就蓋掉了。
  if (!formed) closeEgg();
});

// ---------- 下滑提示 ----------
// 三個條件同時成立才出現（2026-08-23 定案，取代原本「有文案就常駐」）：
//   ① onStage    ── 本層在場（＝ rAF 的執行閘門 shouldRun：active ＋ inView ＋ 分頁在前景）
//   ② scrollIdle ── 連續 SCROLL_IDLE_MS 沒有捲動
//   ③ !mobHintOn ── 手機版互動提示不在畫面上
//
// ⚠️ ① 刻意用執行閘門、不是 faceFormed：這顆是「還有下文」的指引，使用者停在散開／匯聚
//    那兩拍一樣需要它；faceFormed 是上面兩組「這裡可以互動」提示的判準，語意不同。
// ⚠️ ③ 只擋手機那組：稿上手機的說明排在人像下方、這顆距框底 44px，兩者都擠在下半部，
//    同時出現會變成兩個互搶注意力的提示。PC 那組錨在右下臉頰、與這顆不重疊，故不擋。

/** 停多久算「停下來了」。 */
const SCROLL_IDLE_MS = 10_000;

// 本層是否在場：由 onMounted 內的 syncRunning 寫入 —— inView / docVisible 都住在那層，
// 這裡只收結果（也因此「在場」與「跑不跑 rAF」永遠是同一個判斷，不會各自漂移）。
const onStage = ref(false);
// 連續 SCROLL_IDLE_MS 沒捲動 → true；任何一次捲動立即打回 false 並重新計時。
const scrollIdle = ref(false);
let idleTimer = 0;

/** 重新計時。可重複觸發 —— 使用者每次停下來都會再拿到一次提示（不是一生一次）。
 *  ⚠️ 離開現場時只清計時器、不排新的：回來那一刻 onStage 的 watch 會重新排，
 *     於是「十秒」永遠是從真的看得到這一段開始算。 */
const armIdleTimer = () => {
  scrollIdle.value = false;
  clearTimeout(idleTimer);
  if (!onStage.value) return;
  idleTimer = window.setTimeout(() => {
    scrollIdle.value = true;
  }, SCROLL_IDLE_MS);
};

// 進場／離場都要重排計時（切分頁回來也走這條，見 onDocVisibility → syncRunning）。
watch(onStage, armIdleTimer);

// 手機版互動提示此刻是否真的在畫面上：條件與 .hint-mob 的 v-if ＋ .hint-mob--on 完全一致，
// 外加它只在 <768px 才 display:block 的那道樣式條件（＝ isMobView，同一把尺 MOB_QUERY）。
// ⚠️ 平板不算在內：那一段的說明排在圖示右邊（pc 版位）、與下滑提示不重疊，故不必互斥。
const mobHintOn = computed(
  () =>
    isMobView.value &&
    !!props.hintMob &&
    !!hintMobPos.value &&
    hintVisible.value,
);

/** 下滑提示的顯隱（template 的唯一判斷點）。 */
const scrollHintOn = computed(
  () =>
    !!props.scrollHint &&
    onStage.value &&
    scrollIdle.value &&
    !mobHintOn.value,
);


onMounted(() => {
  const wrap = wrapRef.value;
  if (!wrap) return;
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;

  // 兩把尺（理由與界線見 TAP_QUERY / MOB_QUERY 那段）：<1280 走 tap 操作，<768 走 mob 版位。
  // 兩個查詢的 change 共用同一支處理器 —— 跨過任何一條界線都要做同樣三件事：
  //   ① 關掉彩蛋 ── 換到桌機那套後，tap 開的那句沒有人會再收（桌機的 index 由游標重算）
  //   ② 重算 hint 錨點 ── pc 與 mob 的 HINT_ICON_UV 不同
  //   ③ 重算 hint 顯隱 ── 文案來源跟著斷點換（見 syncHintVisible）
  // ⚠️ 每次都重讀兩顆 mq 的 matches、不用事件的 e.matches：一次 change 只告訴你**其中一條**
  //    界線的新值，拿它去寫另一支旗標會寫錯（例如 1280→1200 只有 tapMq 觸發，
  //    此時 isMobView 應維持 false，用 e.matches 會被寫成 true）。
  const tapMq = window.matchMedia(TAP_QUERY);
  const mobMq = window.matchMedia(MOB_QUERY);
  const readTier = () => {
    isTapMode = tapMq.matches;
    isMobView.value = mobMq.matches;
    isPadView.value = tapMq.matches && !mobMq.matches;
  };
  readTier();
  const onTierChange = () => {
    readTier();
    closeEgg();
    updateHintAnchor();
    syncHintVisible();
  };
  tapMq.addEventListener('change', onTierChange);
  mobMq.addEventListener('change', onTierChange);

  const scene = new THREE.Scene();
  // ⚠️ 這顆 Color 物件從頭到尾是同一個 instance（下方 syncBg 就地補間 r/g/b），
  //    不要在別處用 scene.background = new THREE.Color(...) 換掉它 —— 那會把
  //    gsap 正在補間的目標換成孤兒，畫面停在換掉那一刻的顏色。
  const bgColor = new THREE.Color(cfg.bgColor);
  scene.background = bgColor;

  // scrub 接管時的兩端色（下方 syncBg 的第一條分支就地 lerp 它們到 bgColor）。
  // 物件重複使用：那條路徑在捲動中**逐幀**會走到，每幀 new 兩顆 THREE.Color
  // 等於在整段最忙的那一拍餵 GC。每次都重讀 cfg 而不是建構時算一次 ——
  // rebuildParticles 可能換掉這兩個值。
  const bgFrom = new THREE.Color();
  const bgTo = new THREE.Color();
  // 兩端色的**解析結果**也重複使用：THREE.Color.set() 吃的是 CSS 顏色字串，逐幀重解
  // 兩次等於每幀兩次字串剖析。只有 rebuildParticles 才會動到 cfg 的這兩個值，
  // 故拿字串本身當快取鍵 —— 重建後換掉的色照樣立刻生效。
  let bgFromKey = '';
  let bgToKey = '';
  const ensureBgEnds = () => {
    if (cfg.bgColor !== bgFromKey) {
      bgFromKey = cfg.bgColor;
      bgFrom.set(cfg.bgColor);
    }
    if (cfg.convergeBgColor !== bgToKey) {
      bgToKey = cfg.convergeBgColor;
      bgTo.set(cfg.convergeBgColor);
    }
  };
  // scrub 接管後，bgColor 上不可能再有補間（唯一會排補間的是 syncBg 的第二條分支），
  // 故 killTweensOf 只需要在接管的那一刻做一次。它每次呼叫都要走一遍 gsap 的
  // root timeline 找目標，而那條路徑在捲動中是**逐幀**走到的。
  let bgTweenKilled = false;

  // 翻底色。兩條路徑：
  //   scrub（正式站）—— 直接把 bgLightAmount 當 lerp 的 t，往回捲自動沿原路退回。
  //   mode（未接管）—— converge → convergeBgColor、其餘（集合 / 散場）→ bgColor 的可逆補間，
  //                     與 disperseFn 同一套寫法與同一組 duration / ease。
  // animated=false 用於初始定位與重建粒子（scrub 路徑則恆等於 false 的行為）。
  // ⚠️ 這裡用 new THREE.Color(hex) 而不是本檔的 srgbColor()：scene.background 走的是
  //    three 自己的 output 轉換鏈（會轉回 sRGB 再輸出），與 raw shader 的 uniform 不同。
  //    詳見 srgbColor 上方那段。
  const syncBg = (animated = true) => {
    // 外部接管：底色不是「狀態之間的補間」而是**捲動位置的函式**（見 bgLightAmount prop）。
    // animated 在這條路徑上沒有意義 —— 補間的角色由捲動本身扮演。
    const scrub = scrubbedBgLight();
    if (scrub !== null) {
      if (!bgTweenKilled) {
        gsap.killTweensOf(bgColor);
        bgTweenKilled = true;
      }
      ensureBgEnds();
      bgColor.copy(bgFrom).lerp(bgTo, scrub);
      return;
    }

    const target = new THREE.Color(
      mode.value === 'converge' ? cfg.convergeBgColor : cfg.bgColor,
    );
    gsap.killTweensOf(bgColor);
    bgTweenKilled = false; // 這條分支可能排下新的補間 → 鎖打開
    if (animated) {
      gsap.to(bgColor, {
        r: target.r,
        g: target.g,
        b: target.b,
        duration: cfg.disperseDuration,
        ease: 'power2.inOut',
      });
    } else {
      bgColor.copy(target);
    }
  };
  syncBgFn = syncBg;
  syncBg(false); // 套用初始狀態（依 mode 或 convergeAmount 直接定位），不動畫

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
  camera.position.z = 600;

  // world → 螢幕 px 的換算：gl_PointSize 原本用寫死的 300/-mv.z，導致「字級是螢幕 px、
  // 格距是 world」兩套單位 —— 墨水/格距的填充率會隨視窗高度在 58%(1440px) 到
  // 105%(800px) 之間漂移，調不出一組能定案的值。改成 aSize 直接是 world 單位，
  // 這裡算轉換係數，resize 時一併更新 uWorldToPx。
  const worldToPx = (h = wrap.clientHeight) =>
    h / (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360));

  // antialias: false —— 場景裡只有「取樣自 mipmap atlas 的 textured point sprite」，
  // 沒有多邊形邊緣給 MSAA 平滑（字緣的柔邊來自 atlas 貼圖的 LinearFilter，見
  // symbol-atlas.ts）。開著等於在 DPR 2 的全螢幕 canvas 上常駐一份多重取樣緩衝，
  // 白付 fill rate 與 GPU 記憶體，畫面上換不到任何東西。
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  wrap.appendChild(renderer.domElement);

  // ---------- mouse (world coords on z=0 plane) ----------
  const mouse = new THREE.Vector3(9999, 9999, 0); // 原始目標（最後命中點）
  const smoothMouse = new THREE.Vector3(9999, 9999, 0); // 緩動後餵給 shader 的座標
  let targetInfluence = 0; // 目標影響強度（進入=1 / 離開=0）
  let influence = 0; // 緩動後的影響強度，shader 以此淡入淡出整段互動
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  // 手機版彩蛋的錨點（world 座標）：文字與真空洞都停在最後一次點擊的位置。
  // ⚠️ 存 world 而不是螢幕 px —— 轉向、網址列收合、捲軸出現都會改變 canvas 尺寸，
  //    存 px 的話文字會釘在舊像素位置、與人臉脫節；存 world 則由 animate() 每幀投影，
  //    自動跟著人臉走（同 hint 錨點的做法）。
  const eggAnchor = new THREE.Vector3();
  /** tap 版彩蛋開著嗎 ＝ 真空是否該定住不放（見 onLeave）。 */
  const eggHolding = () => isTapMode && activeEgg.value >= 0;

  // canvas 左上角（視窗座標）：clientX/Y → NDC 的換算基準。
  //
  // 快取而不是每個事件都量：getBoundingClientRect() 會強制 style+layout flush，而這顆
  // canvas 在整段轉場（120vh）與符號序列（364vh）都開著 pointer-events: auto —— 觸控
  // 拖曳捲動會一路發 pointermove，等於在「ScrollTrigger 剛寫完 clipPath /
  // backgroundColor / opacity」的同一幀又去讀 layout，典型的 read-after-write 抖動。
  //
  // 失效點：尺寸變動（ResizeObserver → applySize）與捲動。這一層目前是 fixed 滿版、
  // 捲動時 left/top 不會變，但那是**別的元件的 CSS** 說了算（HeroSymbolTransition 的
  // .stage）—— 與其把它當成不變量，不如捲動時把旗標拉起來，代價只是一個布林。
  // 大小改用 viewW/viewH（applySize 已在維護，且是未取整的 contentRect）。
  let rectL = 0;
  let rectT = 0;
  let rectDirty = true;
  const readRect = () => {
    const r = renderer.domElement.getBoundingClientRect();
    rectL = r.left;
    rectT = r.top;
    rectDirty = false;
  };
  const invalidateRect = () => {
    rectDirty = true;
  };
  const toNdc = (clientX: number, clientY: number) => {
    if (rectDirty) readRect();
    ndc.x = ((clientX - rectL) / viewW) * 2 - 1;
    ndc.y = -((clientY - rectT) / viewH) * 2 + 1;
  };

  const onMove = (e: PointerEvent) => {
    toNdc(e.clientX, e.clientY);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      mouse.copy(hit);
      targetInfluence = 1;
    }
  };
  // 離開只把影響淡出，不把座標拉回 9999（否則真空會橫掃到角落）
  const onLeave = () => {
    // 手機且彩蛋開著：不鬆手 —— 真空洞要與文字一起留在點擊處，直到彩蛋關閉為止。
    // 觸控抬指一定會發 pointerleave，照原本淡出的話，手指一離開洞就闔起來、
    // 只剩一句字浮在完好的人臉上。座標拉回錨點是因為抬指前可能滑了一段，
    // 停在最後滑到的位置會讓洞與文字錯開。
    if (eggHolding()) {
      mouse.copy(eggAnchor);
      return;
    }
    targetInfluence = 0;
  };
  // passive：兩支都沒有 preventDefault，宣告出來瀏覽器才不必為了等它而延後捲動
  renderer.domElement.addEventListener('pointermove', onMove, { passive: true });
  renderer.domElement.addEventListener('pointerleave', onLeave, { passive: true });
  // 捲動時做兩件事：作廢 canvas 位置快取（見 invalidateRect），以及把下滑提示的十秒
  // 重新計時（見 armIdleTimer）。併成同一支 listener ＝ 一次事件派發做完，
  // 不為了「兩件事不相干」各掛一支 —— 這支在捲動中是每幀都會被叫的路徑。
  const onScroll = () => {
    invalidateRect();
    armIdleTimer();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // 彩蛋關閉時鬆開真空（closeEgg 走這條，見它的宣告處）。桌機不受影響：
  // 那邊的 influence 一律由游標的進出決定，closeEgg 只是在離開集合態時順手收東西。
  releaseMouseFn = () => {
    if (isTapMode) targetInfluence = 0;
  };

  // tap 版彩蛋（手機 ＋ 平板）：點人臉換下一句、點人臉以外關閉（桌機讓開，走 animate() 的宮格路徑）。
  // ⚠️ 用 click 而不是 pointerdown：捲動拖曳會走 pointercancel、不會合成 click，
  //    故「捲頁時手指掃過人臉」不會誤開彩蛋 —— 這一段畫面本來就是靠捲動推進的。
  const onTap = (e: MouseEvent) => {
    // 集合途中／散場中點下去不該冒出彩蛋（同 PC 提示，理由見 faceFormed 宣告處）
    if (!isTapMode || !faceFormed.value) return;
    toNdc(e.clientX, e.clientY);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(plane, hit)) return;
    // 命中框與桌機宮格同一套（faceUv），差別只在 tap 版不再把它切成 gridCols × gridRows
    const uv = faceUv(hit.x, hit.y, halfW, halfH);
    const next = tapEggIndex(activeEgg.value, cfg.phrases.length, !!uv);
    activeEgg.value = next;
    if (next >= 0) playSfx('aiFaceText'); // next < 0 ＝ 點在臉外＝關閉，不出聲
    // ⚠️ 分支看的是「真的開了嗎」而不是「點在臉上嗎」：沒有文案時（phrases 為空）
    //    點人臉並不會開，那就不該留下一支永遠換不出東西的計時器。
    if (next >= 0) {
      eggAnchor.copy(hit); // next >= 0 蘊含命中人臉，hit 就是這一次的點擊處
      // 真空跟著定位到同一點並拉滿：tap 不像 hover 會持續餵座標，不寫這兩行的話
      // 洞只會靠點擊前那一下 pointermove 短暫出現，抬指就淡掉（見 onLeave）。
      mouse.copy(hit);
      targetInfluence = 1;
      startEggAuto(); // 點擊＝剛換過一句，3 秒從頭算
      // tap 版的提示文案就是「點擊人臉…」，點到了就等於學會了 → 收起（收多久見 hintOnce）
      if (!hintDismissed) dismissHint();
    } else {
      stopEggAuto();
      targetInfluence = 0; // 點在人臉以外＝收工，洞跟著文字一起收掉
    }
  };
  renderer.domElement.addEventListener('click', onTap);

  // atlas / colorRamp / points 改為 let，可在 refresh 時 dispose 重建
  let atlas: GlyphAtlas | null = null;
  let colorRamp: THREE.CanvasTexture | null = null;
  let points: THREE.Points | null = null;

  let geom: THREE.BufferGeometry | null = null;
  let mat: THREE.ShaderMaterial | null = null;
  let unmounted = false;
  // ---- 慣性物理狀態（buildFromImage 建立；animate 每幀積分後寫回 aDisp）----
  let dispArr: Float32Array | null = null; // 相對 formation 的附加位移
  let velArr: Float32Array | null = null; // 對應速度
  let targetArr: Float32Array | null = null; // formation 座標（命中測試用）
  let seedArr: Float32Array | null = null; // 每顆隨機種子（impulse 發散角／z 散射用）
  let dispAttr: THREE.BufferAttribute | null = null;
  // 物理已完全靜止（disp／vel 全部小於 SETTLE_EPS）且沒有新的游標命中 ⇒ 整段積分與
  // aDisp 的 VBO 上傳都可以跳過。
  //
  // 為什麼值得做：aDisp 是 pCount × 3 個 float，實測 5,471 顆 ≈ 64 KB／幀（60fps ≈ 3.8 MB/s）。
  // 而觸控裝置沒有 hover，`canHit` 幾乎恆為 false、disp 恆為 0 —— 這筆頻寬與那 pCount 次
  // 空轉的積分是純白付。**這是首頁在低階手機上唯一「省下來完全看不出差別」的每幀成本。**
  //
  // ⚠️ 判定要同時看 vel：disp 可能剛好路過 0 而 vel 還很大（撞散後回位的過程中），
  //    只看 disp 會把粒子凍在半路上。
  let dispSettled = false;
  const SETTLE_EPS = 0.01; // world 單位。world 寬約 274–560 對應整個視窗寬 ⇒ 0.01 遠低於一個次像素
  let pCount = 0;
  // 人像半寬高 + 自動游標遊走半徑（buildFromImage 依人像實際範圍設定）
  let halfW = 0;
  let halfH = 0;
  let roamX = 150;
  let roamY = 150;

  // sortedChars 由 buildParticles 算好（atlas 與取樣要用同一份）
  let sortedChars: string[] = [];

  // 「沒有粒子」的完整狀態。
  // buildParticles 會先把舊的 geom / mat dispose 掉才呼叫 buildFromImage，而新的要到
  // 該函式下半段才建 —— 中途折返若只是 return，留下的是一堆「已 dispose 但不是 null」的
  // handle：animate() 繼續往上面寫、卸載時又 dispose 一次，而舊的 halfW/halfH 還在 →
  // 畫面明明是空的，宮格彩蛋與 dismissHint() 卻照樣被觸發。
  const clearParticleState = () => {
    geom = null;
    mat = null;
    points = null;
    dispArr = null;
    velArr = null;
    targetArr = null;
    seedArr = null;
    dispAttr = null;
    pCount = 0;
    halfW = 0;
    halfH = 0;
    // null ＝ 人像還沒建好、先不渲染（見 hintPos 宣告處）
    hintPos.value = null;
    hintMobPos.value = null;
  };

  // ---------- 圖片亮度採樣：網格化，亮部大/粗/淺色 ----------
  //
  // 取樣解析度：每個網格 cell 只要幾個像素就足以算出穩定的平均亮度。
  //
  // 原本是把原圖（1013×1478）整張 drawImage → getImageData → 逐像素走完：約 150 萬次
  // 迭代加一個 6 MB 的 Uint8ClampedArray，而 cols 85 的網格每格平均吃掉 12×18 個像素
  // —— 那些細節全被「整格平均」抹掉了。更糟的是 sampleImageToGridWithLimit 在粒子超量
  // 時會降 cols 重新取樣，同一條迴圈可能跑好幾輪。而這一切發生在 onMounted，正好是
  // hero loader 在等 9.8 MB 開場影片的時候。
  //
  // 先讓瀏覽器把圖縮到「每格約 SAMPLE_PX_PER_CELL 像素寬」再取樣：縮放本身就是箱型
  // 濾波，等於預先做了同一件平均，逐格平均值幾乎不變（每格仍有 4×6 ≈ 24 個樣本），
  // 迴圈次數與記憶體都掉一個數量級。
  //
  // ⚠️ 網格幾何只看**長寬比**，不看絕對像素數（見 computeGrid：worldW 是
  //    fitWidth/imgW × imgW，imgW 會消掉）→ 縮圖不會動到任何粒子的 world 座標。
  //    四捨五入造成的長寬比誤差在千分之一以下。
  // ⚠️ 這裡省的是 CPU 與記憶體，**不是頻寬**：1.7 MB 的 face.png 照樣要下載完才能
  //    drawImage。要省那一半得換一張小尺寸素材（原圖全庫只有本檔在用），那是另一件事。
  const SAMPLE_PX_PER_CELL = 4;

  const buildFromImage = (img: HTMLImageElement) => {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    // 不放大：素材本來就比取樣網格小時照原尺寸走
    const sw = Math.max(1, Math.min(W, Math.round(cfg.cols * SAMPLE_PX_PER_CELL)));
    const sh = Math.max(1, Math.round(H * (sw / W)));
    const c = document.createElement('canvas');
    c.width = sw;
    c.height = sh;
    const ctx2d = c.getContext('2d')!;
    // 縮 3 倍用預設的 'low' 會有摩爾紋；'high' 才是真的多階箱型濾波
    ctx2d.imageSmoothingEnabled = true;
    ctx2d.imageSmoothingQuality = 'high';
    ctx2d.drawImage(img, 0, 0, sw, sh);
    let imageData: ImageData;
    try {
      imageData = ctx2d.getImageData(0, 0, sw, sh);
    } catch (err) {
      // loadImage 已設 crossOrigin，正常情況走不到這裡。留著是為了讓「畫布被跨源圖片
      // 污染」這種只會在正式站出現的情形有明確訊息，而不是 onload 裡一個未捕捉的例外。
      console.error('[SymbolFace] 無法讀取圖片像素（canvas 被跨源圖片污染？）', err);
      clearParticleState();
      return;
    }

    const sample = sampleImageToGridWithLimit(
      { data: imageData.data, width: sw, height: sh },
      {
        cols: cfg.cols,
        charAspect: cfg.charAspect,
        fitWidth: cfg.fitWidth,
        fitHeight: cfg.fitHeight,
        worldScale: cfg.worldScale,
        contrast: cfg.contrast,
        invert: cfg.invert,
        charCount: sortedChars.length,
        weightSteps: cfg.weightSteps,
        sizeMin: cfg.sizeMin,
        sizeMax: cfg.sizeMax,
        jitter: cfg.jitter,
      },
      cfg.maxParticles,
    );

    const count = sample.count;
    if (count === 0) {
      console.warn(
        '[SymbolFace] 取樣結果為 0 顆粒子，請檢查 contrast / invert / 圖片 alpha',
      );
      clearParticleState(); // ⚠️ 不能只是 return，理由見該函式
      return;
    }
    if (count > cfg.maxParticles) {
      console.warn(
        `[SymbolFace] 粒子數 ${count} 已達 cols 下限仍超過上限 ${cfg.maxParticles}`,
      );
    }

    // 人像置中於原點；自動游標在 ~70% 內遊走
    halfW = sample.halfW;
    halfH = sample.halfH;
    roamX = halfW * 0.7;
    roamY = halfH * 0.7;

    const target = sample.positions;
    const start = new Float32Array(count * 3);
    const floatPos = new Float32Array(count * 3);
    const order = new Float32Array(count);
    const seed = new Float32Array(count);

    const FLOAT_X = cfg.disperseSpread[0] ?? 900;
    const FLOAT_Y = cfg.disperseSpread[1] ?? 520;
    const FLOAT_Z = cfg.disperseSpread[2] ?? 240;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ang = Math.random() * Math.PI * 2;
      const r = 80 + Math.random() * 120;
      start[i3] = target[i3]! + Math.cos(ang) * r;
      start[i3 + 1] = target[i3 + 1]! + Math.sin(ang) * r;
      start[i3 + 2] = target[i3 + 2]!;
      floatPos[i3] = (Math.random() - 0.5) * FLOAT_X;
      floatPos[i3 + 1] = (Math.random() - 0.5) * FLOAT_Y;
      floatPos[i3 + 2] = (Math.random() - 0.5) * FLOAT_Z;
      order[i] = Math.random() * 0.85;
      seed[i] = Math.random();
    }

    geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(start.slice(), 3));
    geom.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
    geom.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geom.setAttribute('aFloat', new THREE.BufferAttribute(floatPos, 3));
    geom.setAttribute('aOrder', new THREE.BufferAttribute(order, 1));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sample.sizes, 1));
    geom.setAttribute('aBright', new THREE.BufferAttribute(sample.brights, 1));
    geom.setAttribute('aGlyph', new THREE.BufferAttribute(sample.glyphs, 1));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

    // 慣性物理：附加位移 aDisp（初始 0），CPU 每幀積分後上傳
    dispArr = new Float32Array(count * 3);
    velArr = new Float32Array(count * 3);
    targetArr = target;
    seedArr = seed; // 與 aSeed 共用同一份（CPU 只讀）：impulse 發散用
    pCount = count;
    dispAttr = new THREE.BufferAttribute(dispArr, 3);
    dispAttr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute('aDisp', dispAttr);

    // glitch 跳色（固定長度陣列 uniform 的理由見 GLITCH_SLOTS 與 glitchUniforms 的註解）
    if ((cfg.glitchItems ?? []).length > GLITCH_SLOTS) {
      console.warn(
        `[SymbolFace] glitchItems 最多 ${GLITCH_SLOTS} 組，其餘已忽略`,
      );
    }
    const glitch = glitchUniforms();

    mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uDisperse: { value: 0 },
        uConverge: { value: 0 },
        uConvergePx: { value: cfg.convergeSize },
        // clamp 到 0.9：1.0 會讓 per-particle 的 smoothstep 窗寬變 0（見 convergeStagger prop）
        uConvergeStagger: { value: Math.min(Math.max(cfg.convergeStagger, 0), 0.9) },
        // 白→橘的量（0 ＝ 白 core、1 ＝ uSolidColor）。與 uConverge 分開的理由見 warmAmount prop。
        uWarm: { value: 0 },
        uSolidColor: { value: srgbColor(cfg.convergeColor) },
        uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
        uMouseInfluence: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uWorldToPx: { value: worldToPx() },
        uCamZ: { value: camera.position.z },
        uFloatAmp: { value: cfg.floatAmp },
        uFloatMicro: { value: cfg.floatMicro },
        uFloatSpeed: { value: cfg.floatSpeed },
        uTwinkleAmp: { value: cfg.twinkleAmp },
        uBreathAmp: { value: cfg.breathAmp },
        uHoleRadius: { value: cfg.holeRadius },
        uHoleSpread: { value: cfg.holeSpread },
        uGroupShift: { value: cfg.groupShift },
        uGroupNear: { value: cfg.groupShiftNear },
        uGroupFar: { value: cfg.groupShiftFar },
        uAtlas: { value: atlas.texture },
        uAtlasGrid: { value: new THREE.Vector2(atlas.cols, atlas.rows) },
        uColorRamp: { value: colorRamp },
        uInkGamma: { value: cfg.inkGamma },
        uColorRandom: { value: cfg.colorMode === 'random' ? 1 : 0 },
        uGlitchCount: { value: glitch.count },
        uGlitchColor: { value: glitch.colors },
        uGlitchDensity: { value: glitch.density },
        uGlitchFps: { value: glitch.fps },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aStart;
        attribute vec3 aTarget;
        attribute vec3 aFloat;
        attribute vec3 aDisp;
        attribute float aOrder;
        attribute float aSize;
        attribute float aGlyph;
        attribute float aSeed;
        attribute float aBright;
        uniform float uProgress;
        uniform float uTime;
        uniform float uDisperse;
        uniform float uConverge;
        uniform float uConvergePx;
        uniform float uConvergeStagger;
        uniform float uWarm;
        uniform vec3 uMouse;
        uniform float uMouseInfluence;
        uniform float uPixelRatio;
        uniform float uWorldToPx;
        uniform float uCamZ;
        uniform float uFloatAmp;
        uniform float uFloatMicro;
        uniform float uFloatSpeed;
        uniform float uTwinkleAmp;
        uniform float uBreathAmp;
        uniform float uHoleRadius;
        uniform float uHoleSpread;
        uniform float uGroupShift;
        uniform float uGroupNear;
        uniform float uGroupFar;
        uniform float uColorRandom;
        uniform int uGlitchCount;
        uniform vec3 uGlitchColor[${GLITCH_SLOTS}];
        uniform float uGlitchDensity[${GLITCH_SLOTS}];
        uniform float uGlitchFps[${GLITCH_SLOTS}];
        varying float vAlpha;
        varying float vGlyph;
        varying float vT;
        varying vec3 vGlitchColor;
        varying float vGlitchOn;
        varying float vSolid;
        varying float vWarm;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
          float local = smoothstep(aOrder, aOrder + 0.12, uProgress);
          vec3 pos = mix(aStart, aTarget, local);

          // 非集合態（分散或匯聚）的合併強度：任一 → 關閉漂浮/斥力/避讓等「集合態」行為。
          float away = max(uDisperse, uConverge);
          float formed = 1.0 - away;

          // 無互動時的整體漂浮：全粒子同步的低頻隨機遊走（不帶 seed）做出「整片在飄」，
          // 再疊一層每顆微擾（帶 seed）增加 organic 感；散場/匯聚時淡出交棒給下方 drift
          float idle = local * formed;
          float ts = uTime * uFloatSpeed;
          vec3 sway;
          sway.x = (sin(ts * 0.23) + 0.6 * sin(ts * 0.37 + 1.7)) * uFloatAmp;
          sway.y = (cos(ts * 0.19) + 0.6 * cos(ts * 0.31 + 0.5)) * uFloatAmp;
          sway.z = sin(ts * 0.15) * uFloatAmp * 0.4;
          vec3 micro;
          micro.x = sin(ts * 0.50 + aSeed * 6.2831) * uFloatMicro;
          micro.y = cos(ts * 0.44 + aSeed * 5.0)    * uFloatMicro;
          micro.z = sin(ts * 0.62 + aSeed * 3.1416) * uFloatMicro * 0.5;
          pos += (sway + micro) * idle;

          // 離場：target -> 隨機漂浮位置，並持續緩慢漂移
          vec3 drift = aFloat;
          drift.x += sin(uTime * 0.30 + aSeed * 6.2831) * 28.0;
          drift.y += cos(uTime * 0.22 + aSeed * 12.566) * 22.0;
          drift.z += sin(uTime * 0.18 + aSeed * 3.1416) * 10.0;
          pos = mix(pos, drift, uDisperse);

          // 匯聚成點：所有粒子收攏到人像中心(原點)近乎完全重疊 → 收成一顆實心點。
          // 與 uDisperse 互斥（同一時間至多一個為 1），故直接再 mix 一層即可。
          //
          // ⚠️ 每顆各自的進度 cConv，而不是直接用全域的 uConverge：全員同步 mix 到原點
          //    ＝ 對原點做等比縮放，看起來會是「整張臉原封不動地變小」而不是「符號各自
          //    飛進核心」。起跑點依 aSeed 亂序散在 0..uConvergeStagger，窗寬固定
          //    (1 - uConvergeStagger) → 最慢的那顆剛好在 uConverge=1 抵達，早到的則先
          //    停在原點等其餘的。終點全員對齊是硬需求（見下方 solid 與交棒說明）。
          float cOrder = hash(aSeed * 31.7) * uConvergeStagger;
          float cConv = smoothstep(cOrder, cOrder + (1.0 - uConvergeStagger), uConverge);
          pos = mix(pos, vec3(0.0), cConv);

          // 實心化係數：只在最後 10% 補成不透明方塊（見下方 gl_PointSize 與 fragment）。
          // ⚠️ 不能直接用 uConverge —— 收攏途中粒子還散在半個畫面，提早實心化會讓整片人臉
          //    在那 2.2s 裡變成一堆半透明方塊。0.9 時殘餘半徑僅剩人像半寬的 10%（≈ 一顆點的量級），
          //    且 power2.inOut 下這段只佔約 0.2s，看起來就是「那團符號收緊後凝成核心」。
          // ⚠️ 也不能直接用 cConv —— 有速差之後最早那顆在 uConverge 才 0.5 就抵達，
          //    會在其餘符號還飄在半空時就先變成橘方塊。取 min ＝「全域 90% 才實心化，
          //    但還沒到位的不准實心」：交棒時機維持原本的最後 0.2s，落隊的那幾顆則
          //    等自己到位才轉橘。uConverge=1 時兩者皆為 1 → 全員實心，交棒不漏色。
          float solid = smoothstep(0.9, 1.0, min(cConv, uConverge));
          vSolid = solid;

          // 轉橘的量。**乘上 solid** 而不是直接用 uWarm：兩者是不同的窗口（收攏之後才輪到
          // 白→橘，見 orange-core-config 的 CORE_WARM_VH），少了這個乘數，往回捲到收攏
          // 中段時 uWarm 還沒退回 0，半空中的符號會整片泛橘。
          // ⚠️ 這一項與 vSolid 分家是 2026-08-17 改的：改版前顏色直接吃 vSolid，
          //    於是「凝成方塊」與「轉橘」是同一件事 —— 沒有白 core 這個狀態可言。
          vWarm = solid * uWarm;

          // 整體避讓：以游標到群中心(原點)的距離決定整群往反方向(遠離游標)的平移量，
          // uGroupNear 內(重疊)≈0 以保留中心環形真空、到 uGroupFar 達上限即停。
          // uMouseInfluence 由 JS 緩動(進入/離開淡入淡出)；離開集合態後關閉。
          float dCenter = length(uMouse.xy);
          float shiftAmt = uGroupShift * smoothstep(uGroupNear, uGroupFar, dCenter) * uMouseInfluence * formed;
          pos.xy += normalize(-uMouse.xy + 0.0001) * shiftAmt;

          // 慣性位移：游標斥力/回位改由 CPU 端「動量 + 指數 ease」積分（見 animate()），
          // 結果存在 aDisp，這裡直接疊加 → 撞散後帶動量四散、再平順 ease 歸位（不 overshoot、無果凍回彈）。
          // 離開集合態（分散/匯聚）時讓位移淡出，交棒給 drift / 匯聚點。
          pos += aDisp * formed;

          // 字元固定不變：glyph 由亮度決定（ink ramp），換字會直接打壞圖像。
          // 動態感改由下方 glitch 跳色提供（同 gemini-code 的做法）。
          vGlyph = aGlyph;

          // glitch 跳色：每組各自的 fps 決定換幀速率，density 決定命中比例。
          // GLSL ES 1.0 迴圈上界必須是常數，故固定跑 GLITCH_SLOTS 次搭配 break。
          vGlitchColor = vec3(0.0);
          vGlitchOn = 0.0;
          for (int i = 0; i < ${GLITCH_SLOTS}; i++) {
            if (i >= uGlitchCount) break;
            if (uGlitchFps[i] > 0.0 && uGlitchDensity[i] > 0.0) {
              // 引數必須維持在小範圍：hash 是 fract(sin(n)·43758)，而 GLSL 的 sin
              // 在 |n| 大時做不準範圍化，n 到 1e5（uTime 30 秒 × fps × 311.7）就會退化成
              // 非均勻分佈 —— 實測命中率會膨脹到設定密度的數倍。
              // 故 frame 先 mod 回小週期再縮成小數，整條引數壓在 ~30 以內。
              float frame = mod(floor(uTime * uGlitchFps[i]), 251.0) * 0.017;
              float r = hash(aSeed * 17.13 + frame + float(i) * 2.71);
              if (r < uGlitchDensity[i]) {
                vGlitchColor = uGlitchColor[i];
                vGlitchOn = 1.0;
                break;
              }
            }
          }
          // 實心化後關掉 glitch：不然那顆方塊的顏色會隨「最後畫到的那顆有沒有中 glitch」
          // 每幀在漸層色與 glitch 色之間亂跳。
          vGlitchOn *= (1.0 - solid);

          float twinkle = (1.0 - uTwinkleAmp) + uTwinkleAmp * sin(uTime * 2.2 + aSeed * 40.0);
          // 不透明（gemini 邊緣銳利）；只保留 reveal(local) 與散場的淡入淡出
          vAlpha = local * twinkle * mix(1.0, 0.5, uDisperse);
          // 取色位置：tone=依亮度（亮→漸層右端＝高光色）/ random=每顆隨機
          vT = mix(aBright, hash(aSeed * 53.7), uColorRandom);
          // 實心化後所有粒子必須同色：alpha=1 的疊畫是後畫的覆蓋前面，各顆顏色不同的話
          // 那顆方塊會變成「buffer 裡最後一顆」的顏色（換 cols / 換圖就換色）。
          // 這裡先把取色位置收斂到漸層最亮端，最終顏色再由 fragment 的 uSolidColor 蓋掉
          // （收斂點要什麼顏色改 convergeColor prop，不是改這個 1.0）。
          vT = mix(vT, 1.0, solid);

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float breath = 1.0 + uBreathAmp * sin(uTime * 2.0 + aSeed * 9.0);
          float size = aSize * mix(1.0, 0.65, uDisperse);
          // aSize 是 world 單位 → 乘 uWorldToPx 換成螢幕 px；(uCamZ/-mv.z) 保留透視深度差
          float px = size * uWorldToPx * (uCamZ / -mv.z) * breath * local;
          // 匯聚：邊長收成 uConvergePx（＝ core 的 26px）→ 那顆點與橘核心同尺寸交棒。
          // 目標值不吃 breath（core 不呼吸）但保留 local，reveal 期間仍是從 0 長大。
          // uPixelRatio 把 CSS px 換成 device px，故最終畫出來就是 uConvergePx 個 CSS px。
          // 用 cConv 而非 uConverge：字級要跟著**自己**的位移一起收，不然先到原點的粒子
          // 會頂著原字級卡在中心，中央糊成一坨大字、速差反而看不出來。
          gl_PointSize = mix(px, uConvergePx * local, cConv) * uPixelRatio;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uAtlas;
        uniform vec2 uAtlasGrid;
        uniform sampler2D uColorRamp;
        uniform float uInkGamma;
        uniform vec3 uSolidColor;
        varying float vAlpha;
        varying float vGlyph;
        varying float vT;
        varying vec3 vGlitchColor;
        varying float vGlitchOn;
        varying float vSolid;
        varying float vWarm;
        void main() {
          vec2 cell = vec2(mod(vGlyph, uAtlasGrid.x), floor(vGlyph / uAtlasGrid.x));
          vec2 uv = vec2(
            (cell.x + gl_PointCoord.x) / uAtlasGrid.x,
            1.0 - (cell.y + gl_PointCoord.y) / uAtlasGrid.y
          );
          // atlas 縮放後筆劃被 mipmap 攤成半透明（實測總 alpha 只剩 0.746），
          // uInkGamma < 1 把部分覆蓋的像素拉回來，讓整片亮度回到 gemini 的水準
          float a = pow(texture2D(uAtlas, uv).a, uInkGamma) * vAlpha;
          // 匯聚末段（vSolid）把整個 sprite 填成不透明 → 收斂點是精準 uConvergePx 的實心方塊，
          // 與 ForumCore 的橘方塊像素對齊。順手蓋掉 twinkle，核心不該閃。
          a = mix(a, 1.0, vSolid);
          if (a < 0.02) discard;
          vec3 ramp = texture2D(uColorRamp, vec2(clamp(vT, 0.0, 1.0), 0.5)).rgb;
          vec3 col = mix(ramp, vGlitchColor, vGlitchOn);
          // 實心化之後才輪到顏色：vT 已被收斂到漸層最亮端（＝白），再依 vWarm 補到
          // uSolidColor（＝ CORE.orange）。所以畫面上是「凝成一顆白方塊 → 由白轉橘」，
          // 而交棒給 ForumCore 時兩邊同色 → 不需要 crossfade，直接硬切。
          col = mix(col, uSolidColor, vWarm);
          gl_FragColor = vec4(col, a);
        }
      `,
    });

    points = new THREE.Points(geom, mat);
    scene.add(points);
    tryReveal();

    // 外部接管 uConverge 時的寫入點（見 convergeAmount prop）：直接寫值，不排補間。
    // ⚠️ 仍要 killTweensOf：切換驅動方式的那一刻（或重建粒子後）可能還有一段 mode 補間
    //    在飛，不殺掉的話它會和捲動搶同一個 uniform —— 症狀是往回捲時收攏先倒退幾幀
    //    又被捲動拉回去，看起來像抖動。
    //
    // 但那個理由**只在接管的那一刻成立**，之後每幀再殺一次是白工（每次呼叫都要走一遍
    // gsap 的 root timeline 找目標，而這兩支是逐幀被捲動打到的）。故上鎖：
    //   ・鎖宣告在這個區塊裡 → 重建粒子時整段重跑，鎖自動打開（新的 mat、新的補間）
    //   ・disperseFn 是唯一還會排 mode 補間的地方，它自己把鎖打開
    let convergeTweenKilled = false;
    let warmTweenKilled = false;

    applyConvergeFn = () => {
      const scrub = scrubbedConverge();
      if (scrub === null || !mat) return;
      if (!convergeTweenKilled) {
        gsap.killTweensOf(mat.uniforms.uConverge);
        convergeTweenKilled = true;
      }
      mat.uniforms.uConverge!.value = scrub;
      // 底色也在這裡刷一次：沒傳 bgLightAmount 時它退回吃 convergeAmount（見 scrubbedBgLight），
      // 那條路徑沒有自己的 watch。有傳的話這只是多寫一次同一個值。
      syncBg(false);
    };

    // 外部接管 uWarm 時的寫入點（見 warmAmount prop）。與上面分開是因為兩者在正式站是
    // 兩段不接續的窗口 —— 收攏跑完（convergeAmount 停在 1、不再變動）之後，才輪到這支逐幀被打到。
    applyWarmFn = () => {
      const scrub = scrubbedWarm();
      if (scrub === null || !mat) return;
      if (!warmTweenKilled) {
        gsap.killTweensOf(mat.uniforms.uWarm);
        warmTweenKilled = true;
      }
      mat.uniforms.uWarm!.value = scrub;
    };

    // 依目前 mode 補間 uDisperse / uConverge 到對應目標；animated=false 用於初始直接定位。
    // 三態互斥：分散→uDisperse=1、匯聚→uConverge=1、集合→兩者皆 0。
    disperseFn = (animated = true) => {
      if (!mat) return;
      // 這支是唯一還會在 uConverge / uWarm 上排 mode 補間的地方 → 把 applyConvergeFn /
      // applyWarmFn 的「已殺過」鎖打開，下一次接管會再殺一次（見那兩支的說明）
      convergeTweenKilled = false;
      warmTweenKilled = false;
      const dTarget = mode.value === 'disperse' ? 1 : 0;
      const opts = { duration: cfg.disperseDuration, ease: 'power2.inOut' };
      gsap.killTweensOf(mat.uniforms.uDisperse);
      if (animated) gsap.to(mat.uniforms.uDisperse, { value: dTarget, ...opts });
      else mat.uniforms.uDisperse.value = dTarget;

      // uWarm：外部接管時**完全不碰**（同下方 uConverge）。沒接管時跟著 uConverge 一起補間 ——
      // 顏色本來就只作用在已實心的粒子上（vWarm ＝ solid × uWarm），故外部沒接管時切到「匯聚」
      // 看到的仍是「收攏末段凝成核心的同時轉橘」，＝ 2026-08-17 之前的行為。
      const wTarget = mode.value === 'converge' ? 1 : 0;
      if (scrubbedWarm() !== null) applyWarmFn?.();
      else {
        gsap.killTweensOf(mat.uniforms.uWarm);
        if (animated) gsap.to(mat.uniforms.uWarm, { value: wTarget, ...opts });
        else mat.uniforms.uWarm.value = wTarget;
      }

      // uConverge：外部接管時**完全不碰**，交給 applyConvergeFn 依捲動寫入。
      // 否則 mode 翻面（248vh 那一刻，兩種驅動方式都會發生）排下的 2.2s 補間會與捲動
      // 搶同一個 uniform。
      if (scrubbedConverge() !== null) return applyConvergeFn?.();

      const cTarget = mode.value === 'converge' ? 1 : 0;
      gsap.killTweensOf(mat.uniforms.uConverge);
      if (animated) gsap.to(mat.uniforms.uConverge, { value: cTarget, ...opts });
      else mat.uniforms.uConverge.value = cTarget;
    };
    disperseFn(false); // 套用初始預設狀態（不動畫）
    updateHintAnchor(); // 人像尺寸剛算出來（halfW/halfH），hint 的錨點跟著定位
  };

  // ---------- 執行閘門：三個訊號皆為真才跑 rAF（迴圈啟停見下方 syncRunning）----------
  //   props.active — 父層是否讓本層在場（元件看不到祖先的 visibility，見該 prop 的說明）
  //   inView       — 自己的幾何是否落在視口內（in-flow 用法的主訊號）
  //   docVisible   — 分頁是否在前景（切分頁時瀏覽器雖已節流 rAF，仍要自己停以處理恢復接縫）
  let inView = false;
  let docVisible = true;
  const shouldRun = () => props.active && inView && docVisible;

  // reveal（uProgress 0→1）改成「真的看得見才跑」：原本綁 IntersectionObserver 一次性啟動，
  // 但在 Hero 那層 IO 恆真 → mount 就開跑、3 秒後結束，遠早於轉場開窗，
  // 於是這段「粒子從無淡入、從 0 長大」從來沒有觀眾。改綁執行閘門即與可見性同步。
  let revealStarted = false;
  // ⚠️ 留住補間本體：它跑在 gsap 自己的 ticker 上，與本元件的 rAF 是兩套時鐘 ——
  //    stopLoop() 取消 rAF 並不會停下它。少了這個 handle，使用者在那 revealDuration 秒內
  //    捲出去，動畫照樣在背景跑完、revealStarted 也永遠停在 true，捲回來不會再播 ——
  //    正好違背上面那段「reveal 必須有觀眾」的用意。
  let revealTween: gsap.core.Tween | null = null;
  const tryReveal = () => {
    if (!shouldRun() || !mat || revealStarted) return;
    revealStarted = true;
    revealTween = gsap.to(mat.uniforms.uProgress, {
      value: 1,
      duration: cfg.revealDuration,
      ease: 'power2.inOut',
      onComplete: () => (revealTween = null), // 跑完就脫手 → 下面兩支才分得出「跑完」與「跑到一半」
    });
  };

  /** 收回 reveal 到起點並允許重跑（重建粒子系統時用：新材質的 uProgress 本來就從 0 起）。 */
  const resetReveal = () => {
    revealTween?.kill();
    revealTween = null;
    revealStarted = false;
    if (mat) mat.uniforms.uProgress!.value = 0;
  };

  /** 捲出視窗／切分頁：只把**還沒跑完**的 reveal 收回起點，已經跑完的不動。 */
  const rewindRevealIfRunning = () => {
    if (revealTween) resetReveal();
  };

  // 已載入的圖與其 src（refresh 時若 src 未變可直接重採樣，不必重載）
  let loadedImg: HTMLImageElement | null = null;
  let loadedSrc = cfg.src;

  // 依 cfg.color / cfg.colorStops 烘一張 256×1 的漸層 texture。
  // ⚠️ buildColorRamp 要求 stops.length === colors.length，否則**靜靜地**退回等距 ——
  //    所以長度不合時這裡直接不傳，讓「等距」是明講的決定而不是意外。
  const makeColorRamp = () => {
    const colors = Array.isArray(cfg.color) ? cfg.color : [cfg.color];
    const stops = Array.isArray(cfg.colorStops) ? cfg.colorStops : [];
    return buildColorRamp(
      cfg.color,
      stops.length === colors.length ? stops : undefined,
    );
  };

  // 重建粒子系統：dispose 舊的 → 依目前 cfg 重建 atlas / 漸層 / 幾何 / 材質，並重跑 reveal
  const buildParticles = () => {
    if (!loadedImg) return;
    // ⚠️ 先驗證再 dispose。順序反過來的話，chars 為空這條路徑會在「舊的已經拆光」之後
    //    才折返，留下四個「已 dispose 但不是 null」的 handle，卸載時再被 dispose 一次。
    //    驗證失敗一律整組不動 —— 同面板對格式錯誤欄位的處理（保留舊值）。
    const nextChars = sortCharsByInk(cfg.chars);
    if (nextChars.length === 0) {
      console.warn('[SymbolFace] chars 去重濾空白後為空，維持原有粒子系統不變');
      return;
    }

    if (points) scene.remove(points);
    geom?.dispose();
    mat?.dispose();
    atlas?.texture.dispose();
    colorRamp?.dispose();
    // dispose 完就歸 null：其餘地方（animate / onBeforeUnmount）一律以 null 判斷「有沒有東西」，
    // 留著已 dispose 的 handle 就是在製造二次 dispose 與對死物件寫入。
    geom = null;
    mat = null;
    points = null;
    atlas = null;
    colorRamp = null;

    sortedChars = nextChars;
    const weights = buildWeightLadder(
      cfg.weightSteps,
      cfg.weightMin,
      cfg.weightMax,
    );
    atlas = buildGlyphAtlas(sortedChars.slice(1), weights);
    colorRamp = makeColorRamp();
    resetReveal(); // 讓 reveal 重跑（新材質 uProgress 從 0 起）
    buildFromImage(loadedImg);
  };

  // 圖片載入（初次與 refresh 換 src 共用）。
  // ⚠️ crossOrigin：本專案的圖片走 APP_ASSETS_PATH 前綴，正式站可能與頁面不同源 ——
  //    沒有 CORS 的圖畫進 canvas 會「污染」它，buildFromImage 的 getImageData() 就會在
  //    onload 裡丟 SecurityError。同源時設這個屬性無害，跨源時則需伺服器給 CORS 標頭。
  // ⚠️ onerror：少了它，404 或 CORS 被拒的結果就是整段靜靜地一片空白，連 console 都沒東西。
  // src 一定要最後設：快取命中時 onload 可能同步觸發，先設 src 會漏掉 handler。
  const loadImage = (src: string, onReady: (im: HTMLImageElement) => void) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      if (unmounted) return;
      onReady(im);
    };
    im.onerror = () => {
      if (unmounted) return;
      console.error(
        `[SymbolFace] 圖片載入失敗：${src}（檢查路徑是否存在、跨網域是否給了 CORS 標頭）`,
      );
    };
    im.src = src;
  };

  loadImage(cfg.src, (im) => {
    loadedImg = im;
    loadedSrc = cfg.src;
    buildParticles();
  });

  // refresh：套用 cfg（背景色/彩蛋色即時更新）後重建粒子；src 變更則先載入新圖再重建
  rebuildParticles = () => {
    if (unmounted) return;
    syncBg(false); // 就地補色、不換物件（理由見 bgColor 宣告處）
    if (eggRef.value) eggRef.value.style.color = cfg.phraseColor;
    if (cfg.src !== loadedSrc) {
      const nextSrc = cfg.src;
      loadImage(nextSrc, (im) => {
        loadedImg = im;
        loadedSrc = nextSrc;
        buildParticles();
      });
    } else {
      buildParticles();
    }
  };

  const clock = new THREE.Clock();
  let raf = 0;
  let prevT = 0;
  let running = false;
  // 動畫時間：自行累積 dt 而非直接用 clock.getElapsedTime()。clock 在暫停期間照走，
  // 直接餵給 uTime 會讓恢復那一刻 sway / twinkle / breath / glitch 全部跳一大段。
  let simTime = 0;
  // 上一幀游標位置（算游標速度 → 沿移動方向甩出粒子）；9999 = 尚未接觸
  let prevMx = 9999;
  let prevMy = 9999;
  // 彩蛋：world → 螢幕像素投影用；viewW/H 隨 resize 更新
  const proj = new THREE.Vector3();
  let viewW = width;
  let viewH = height;
  /** 把 .egg 的中心對到某個 world 座標（桌機餵游標、手機餵最後點擊處）。 */
  const placeEgg = (el: HTMLElement, world: THREE.Vector3) => {
    proj.copy(world).project(camera);
    const sx = (proj.x * 0.5 + 0.5) * viewW;
    const sy = (-proj.y * 0.5 + 0.5) * viewH;
    el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
  };
  if (eggRef.value) eggRef.value.style.color = cfg.phraseColor;

  // hint 錨點：人像 bbox 上的兩個定點投影到螢幕 px —— 圖示（HINT_ICON_UV）與手機文字（底緣中點）。
  // ⚠️ 與 .egg 的差別 —— .egg 跟著游標跑、必須每幀寫 DOM；hint 的錨點在 world 裡是不動的，
  //    只有 resize 與粒子重建會改變它的螢幕位置，故不進 animate() 的熱迴圈。
  const hintAnchor = new THREE.Vector3();
  const projectAnchor = (x: number, y: number) => {
    hintAnchor.set(x, y, 0).project(camera);
    return {
      x: (hintAnchor.x * 0.5 + 0.5) * viewW,
      y: (-hintAnchor.y * 0.5 + 0.5) * viewH,
    };
  };
  const updateHintAnchor = () => {
    if (halfW <= 0 || halfH <= 0) return;
    // ⚠️ buildFromImage 會在第一幀 render 之前呼叫這裡（img.onload 早於 IntersectionObserver
    //    啟動 rAF），此時 camera.matrixWorldInverse 仍是單位矩陣、position.z 還沒烘進去，
    //    project() 的透視除法會除以 0 → Infinity。先手動更新矩陣，補上 renderer 尚未做的那一步。
    camera.updateMatrixWorld();
    // 版位讀 isMobView（onMounted 內以 matchMedia 初始化並追蹤變動，見 readTier）：
    // 跨斷點時 change 回呼會直接再呼叫本函式一次，不必在這裡重新查詢 media query。
    // ⚠️ 讀的是 **MOB_QUERY 那把尺**、不是互動模式的 isTapMode —— 平板走 pc 版位。
    const [u, v] = isMobView.value ? HINT_ICON_UV.mob : HINT_ICON_UV.pc;
    // uv(0..1，左上原點) → world：x 由 -halfW 到 +halfW、y 由 +halfH 到 -halfH
    hintPos.value = projectAnchor(halfW * (u! * 2 - 1), -halfH * (v! * 2 - 1));
    hintMobPos.value = projectAnchor(0, -halfH);
  };

  const animate = () => {
    const nowT = clock.getElapsedTime();
    const dt = Math.min(nowT - prevT, 0.1); // clamp 避免分頁切回時大跳
    prevT = nowT;
    simTime += dt; // 暫停期間不前進 → 恢復時所有 uTime 驅動的動態都從斷點續上
    const t = simTime;
    // 自動游標：以多頻率正弦疊加做出非重複的平滑遊走，覆寫真實游標
    if (cfg.autoMouse) {
      const at = t * cfg.autoMouseSpeed;
      mouse.set(
        Math.sin(at * 0.7) * roamX * 0.6 +
          Math.sin(at * 0.23 + 1.3) * roamX * 0.4,
        Math.cos(at * 0.53) * roamY * 0.6 +
          Math.cos(at * 0.31 + 0.7) * roamY * 0.4,
        0,
      );
      targetInfluence = 1;
    }
    // 與幀率無關的指數緩動係數
    const k = 1 - Math.exp(-cfg.mouseEase * dt);
    if (influence < 0.001 && targetInfluence > 0) {
      smoothMouse.copy(mouse); // 首次接觸：位置直接到位，靠 influence 淡入強度（不橫掃畫面）
    } else {
      smoothMouse.lerp(mouse, k); // 移動中：座標平滑跟隨
    }
    influence += (targetInfluence - influence) * k;
    if (mat) {
      mat.uniforms.uTime!.value = t;
      mat.uniforms.uMouse!.value.copy(smoothMouse);
      mat.uniforms.uMouseInfluence!.value = influence;
    }

    // ---- 慣性物理：附加位移的「動量 + 指數 ease」積分（撞散→帶動量四散→平順歸位，不 overshoot）----
    // 每顆粒子維持 disp(位移)+vel(速度)：速度只保留動量並靠 friction 衰減（負責往外散）；
    // 位置每幀對原位(0)做指數 lerp（單調趨近、不會回彈）。游標半徑內持續注入外推速度 → 在時開洞、
    // 離開後速度衰減、位置 ease 回原位（脫離果凍感）。
    //
    // dispSettled 這道閘門（宣告處有完整說明）刻意放在最外面：靜止時連 velDecay／easeAmt
    // 這些 Math.exp 都不必算。canHit 得先於閘門求值 —— 它就是「該不該醒過來」的訊號。
    const canHit = mode.value === 'face' && influence > 0.01;
    if (canHit) dispSettled = false;
    if (!dispSettled && dispArr && velArr && targetArr && dispAttr) {
      const disp = dispArr;
      const vel = velArr;
      const tgt = targetArr;
      const seeds = seedArr;
      const velDecay = Math.exp(-cfg.friction * dt); // 與幀率無關的動量衰減（friction）
      const easeAmt = 1 - Math.exp(-cfg.returnEase * dt); // 與幀率無關的回位 lerp 係數（趨近 0）
      const hitR = cfg.holeRadius + cfg.holeSpread;
      const hitR2 = hitR * hitR;
      // 本幀 disp／vel 的最大平方量 → 決定下一幀能不能休息（見 dispSettled）。
      // 存平方而非絕對值：內圈本來就會算 v2，位移也只多一次平方和，省掉 pCount 次 sqrt。
      let settleD2 = 0;
      let settleV2 = 0;
      const mx = smoothMouse.x;
      const my = smoothMouse.y;
      const kick = cfg.impulseStrength * influence;
      const spray = cfg.impulseSpray;
      const sprayZ = cfg.impulseSprayZ;
      const velFollow = cfg.velocityFollow;
      const maxV2 = cfg.maxSpeed * cfg.maxSpeed;
      // 游標移動速度（world/秒）→ 沿移動方向甩出粒子（拖曳發散）；靜止 hover 則 ≈0。
      // prevMx<9000 確保有上一幀有效座標，避免從 9999 起跳造成爆衝；並夾住上限。
      let mvx = 0;
      let mvy = 0;
      if (canHit && prevMx < 9000) {
        const idt = 1 / Math.max(dt, 1e-3);
        mvx = (mx - prevMx) * idt;
        mvy = (my - prevMy) * idt;
        const sp = Math.hypot(mvx, mvy);
        const cap = 4000;
        if (sp > cap) {
          const s = cap / sp;
          mvx *= s;
          mvy *= s;
        }
      }
      prevMx = mx;
      prevMy = my;
      for (let i = 0; i < pCount; i++) {
        const i3 = i * 3;
        // 動量：速度只做 friction 衰減，不加彈簧回復力 → 不會 overshoot/bounce（回位改由下方位置 ease 處理）
        let vx = vel[i3]! * velDecay;
        let vy = vel[i3 + 1]! * velDecay;
        let vz = vel[i3 + 2]! * velDecay;
        // 游標外推 impulse：以 formation+目前位移近似命中（idle sway 幅度小，可忽略）
        if (canHit) {
          const px = tgt[i3]! + disp[i3]! - mx;
          const py = tgt[i3 + 1]! + disp[i3 + 1]! - my;
          const d2 = px * px + py * py;
          if (d2 < hitR2) {
            const d = Math.sqrt(d2) + 0.0001;
            const falloff = 1 - d / hitR; // 近強遠弱
            const mag = kick * falloff * falloff * dt; // 速度增量量級
            // 方向：徑向外推，但每顆旋轉一個「固定」隨機角（由 seed 決定，逐幀穩定不抖），
            // 讓四散方向不規則 → 炸裂感而非整齊放射。spray=0 退回純徑向。
            const sj = seeds ? seeds[i]! : 0.5;
            const ang = (sj - 0.5) * spray;
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);
            const nx = px / d;
            const ny = py / d;
            vx += (nx * ca - ny * sa) * mag;
            vy += (nx * sa + ny * ca) * mag;
            // 沿游標移動方向甩出：拖曳時粒子順移動方向飛濺（靜止 hover 此項 ≈0）
            vx += mvx * velFollow * falloff;
            vy += mvy * velFollow * falloff;
            // z 少量散射：立體炸開（第二組偽隨機由 seed 導出，維持平面感故幅度小）
            const sj2 = Math.sin(sj * 91.7) * 0.5 + 0.5;
            vz += (sj2 - 0.5) * mag * sprayZ;
          }
        }
        // 速度上限：friction 值偏低（動量保留高）時避免持續 impulse 累積成無限加速、維持炸裂又穩定
        const v2 = vx * vx + vy * vy + vz * vz;
        if (v2 > maxV2) {
          const s = cfg.maxSpeed / Math.sqrt(v2);
          vx *= s;
          vy *= s;
          vz *= s;
        }
        vel[i3] = vx;
        vel[i3 + 1] = vy;
        vel[i3 + 2] = vz;
        // 位置：動量位移 + 對原位(0)做指數 ease（disp*(1-easeAmt) 單調趨近，無回彈）。
        // 等價於 reference 的 x += vx + (origin - x)*ease，這裡 origin=0（disp 是相對 formation 的位移）。
        const dx2 = disp[i3]! * (1 - easeAmt) + vx * dt;
        const dy2 = disp[i3 + 1]! * (1 - easeAmt) + vy * dt;
        const dz2 = disp[i3 + 2]! * (1 - easeAmt) + vz * dt;
        disp[i3] = dx2;
        disp[i3 + 1] = dy2;
        disp[i3 + 2] = dz2;
        const d2 = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;
        if (d2 > settleD2) settleD2 = d2;
        if (v2 > settleV2) settleV2 = v2;
      }
      dispAttr.needsUpdate = true;
      // 這一幀已經把 ~0 寫回 VBO 了，所以下一幀起才能休息（不是這一幀就跳過上傳）。
      // 速度也要夠小：VEL_EPS 0.5 world/秒 ＝ 60fps 下每幀約 0.008 world 位移，
      // 低於 SETTLE_EPS，不會出現「凍在半路」。
      if (!canHit) {
        const VEL_EPS = 0.5;
        dispSettled =
          settleD2 < SETTLE_EPS * SETTLE_EPS && settleV2 < VEL_EPS * VEL_EPS;
      }
    }

    // 「完整集合」判定（見 faceFormed 宣告處）：三個 uniform 的實況，不是 mode 這道指令。
    // 用容差而非 ===：補間若被 killTweensOf 中途換掉，殘值可能停在 1e-8 這種量級。
    // 只在真的變動時才寫 ref → 每幀讀 .value 是純 getter，不會觸發 re-render。
    const formedNow =
      mode.value === 'face' &&
      !!mat &&
      mat.uniforms.uProgress!.value >= 0.999 &&
      mat.uniforms.uDisperse!.value <= 0.001 &&
      mat.uniforms.uConverge!.value <= 0.001;
    if (formedNow !== faceFormed.value) faceFormed.value = formedNow;

    // 游標在人像 bbox 內的正規化座標（只在**完整集合**、influence 夠高時才算）。
    // 宮格彩蛋與 PC 提示共用這一份判定，見 ~/utils/symbol-hint。
    const onFace =
      formedNow && influence > FACE_HOVER_INFLUENCE
        ? faceUv(smoothMouse.x, smoothMouse.y, halfW, halfH)
        : null;

    // PC 提示：游標真的碰到人像 → 永久收起。
    // ⚠️ 判定用 bbox 而非「真的撞散粒子」（holeRadius 命中）—— 後者在臉的空白處移動不會觸發，
    //    提示會賴著不走。autoMouse 是無 hover 環境用的虛擬游標，會自己戳到，不算使用者互動。
    // ⚠️ tap 版讓開（!isTapMode）：那邊沒有 hover，收起時機改在 tap（見 onTap）——
    //    不擋的話，手指為了捲動掃過人臉就會把「點擊人臉…」這句提示收掉，而使用者根本沒點過。
    if (onFace && !hintDismissed && !cfg.autoMouse && !isTapMode) dismissHint();

    // 彩蛋：兩套驅動（見 TAP_QUERY 那段）
    //   手機／平板 ── index 由 tap／3 秒計時器寫入，這裡只負責定位；錨點是最後一次點擊處，
    //                 顯隱**不看 influence**（手指早就離開了，看它就會自己淡掉）。
    //   桌機       ── index 由游標所在宮格逐幀推導，文字跟著游標跑、濃度跟著 influence 淡入淡出。
    const eggEl = eggRef.value;
    if (eggEl && halfW > 0) {
      if (isTapMode) {
        const open = activeEgg.value >= 0;
        if (open) placeEgg(eggEl, eggAnchor);
        eggEl.style.opacity = open ? '1' : '0';
      } else {
        let idx = EGG_CLOSED;
        if (onFace && cfg.phrases.length) {
          const col = Math.min(cfg.gridCols - 1, Math.floor(onFace.u * cfg.gridCols));
          const row = Math.min(cfg.gridRows - 1, Math.floor(onFace.v * cfg.gridRows));
          const i = row * cfg.gridCols + col;
          if (i < cfg.phrases.length && cfg.phrases[i]) idx = i;
        }
        if (idx !== activeEgg.value) {
          activeEgg.value = idx; // 僅換格才觸發 re-render
          if (idx >= 0) playSfx('aiFaceText'); // idx < 0 ＝ 滑出人臉＝收起，不出聲
        }
        if (idx >= 0) {
          // 文字中心對齊真空中心（游標位置）
          placeEgg(eggEl, smoothMouse);
          eggEl.style.opacity = String(Math.min(1, influence));
        } else {
          eggEl.style.opacity = '0';
        }
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };

  // ---------- 迴圈啟停 ----------
  // 停下來省掉的是整幀成本：pCount 顆的 CPU 物理積分、aDisp 的 buffer 上傳、
  // 以及那個 point sprite 的 draw call。（cols=85 實測 5,471 顆 → 64KB/幀；
  // maxParticles 只是上限，不是實際顆數。）
  // 這些原本與「有沒有在畫面上」完全無關，只要元件掛著就一直跑。
  const startLoop = () => {
    if (running) return;
    running = true;
    // 恢復接縫：四個會被暫停打斷的狀態要接回去，否則第一幀會被看出來。
    prevT = clock.getElapsedTime(); // 第一幀 dt = 0，不吃暫停期間累積的時間
    prevMx = 9999; // 不拿暫停前的座標算游標速度（mvx/mvy 會爆衝把粒子甩飛）
    prevMy = 9999;
    targetInfluence = 0; // 暫停期間收不到 pointerleave → 強制從「無互動」重新淡入
    influence = 0;
    raf = requestAnimationFrame(animate);
  };
  const stopLoop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    // 迴圈停了就沒人再推導 faceFormed，得在這裡收掉：否則捲出視窗（或父層撤下本層）時
    // 它會凍在 true，PC 提示跟著留在畫面上，捲回來又被 rewindRevealIfRunning 打回未集合。
    faceFormed.value = false;
    // 位移/速度歸零：下次恢復時粒子直接在原位，不會從上次被游標撞開的地方 ease 回來。
    if (dispArr && velArr && dispAttr) {
      dispArr.fill(0);
      velArr.fill(0);
      dispAttr.needsUpdate = true;
      // 已經是全 0 且已上傳 → 恢復後直接從「靜止」起跳，第一個 canHit 會把它叫醒。
      dispSettled = true;
    }
  };
  const syncRunning = () => {
    // 下滑提示吃同一組訊號（見 scrollHintOn 的 ①）：這裡是三個訊號變動的唯一匯流點，
    // 故在場與否也在這裡交出去，不另外再接一套 IO／watch。
    onStage.value = shouldRun();
    if (onStage.value) {
      tryReveal();
      startLoop();
    } else {
      // 順序：先收 reveal 再停迴圈。reveal 跑在 gsap 的 ticker 上、停 rAF 停不掉它，
      // 不收就會在沒有觀眾的情況下跑完（見 rewindRevealIfRunning）。
      rewindRevealIfRunning();
      stopLoop();
    }
  };
  syncActive = syncRunning; // 供 props.active 的 watch 呼叫

  // threshold 0（原為 0.3）：這個 observer 從「一次性的 reveal 觸發器」變成常駐執行閘門，
  // 0.3 會讓「只露出 20%」的期間整個場凍住＝看得見卻不動。rootMargin 提前一點喚醒，
  // 讓粒子在捲進視口前就已在跑（避免入場第一眼是靜止畫面）。
  // ⚠️ 不再 disconnect：要持續收離開/回來的事件。
  const observer = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      syncRunning();
    },
    { threshold: 0, rootMargin: '10%' },
  );
  observer.observe(wrap);

  const onDocVisibility = () => {
    docVisible = document.visibilityState === 'visible';
    syncRunning();
  };
  document.addEventListener('visibilitychange', onDocVisibility);
  docVisible = document.visibilityState === 'visible';
  // 迴圈由 observer 的首次回呼（下一幀）啟動，此處不必先跑 —— inView 尚為 false。

  // 尺寸同步：觀察 .stage 本身，而不是聽 window 的 resize。
  // ⚠️ 捲軸出現／消失**不會**觸發 window resize —— 而 hero 期間 body 是鎖住的（無捲軸），
  //    解鎖那一刻視窗可用寬度縮掉一個捲軸寬，所有 fixed 圖層（含本層的祖先）跟著往左移
  //    半個捲軸。canvas 若沿用 mount 時量到的舊寬，投影中心就留在舊位置 →
  //    converge 收斂點會比 ForumCore 的橘方塊偏右半個捲軸（1388 視窗、捲軸 15.33px
  //    實測 7.67px），交棒那一刻看得出來。改用 RO 後捲軸、--vh 變動、任何祖先版面
  //    改變都會重量。
  // ⚠️ 不會回授循環：.stage 的寬高來自父層與 --vh（見下方 SCSS），與 canvas 尺寸無關。
  // 用 contentRect 而非 clientWidth：後者是四捨五入的整數，1372.67 會變 1373，
  // 投影中心與 DOM 中心又差 0.17px —— 這段修正本來就是在追像素對位，不該自己再引入誤差。
  const applySize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    viewW = w;
    viewH = h;
    invalidateRect(); // 尺寸變了，快取的 canvas 左上角也要重量（見 toNdc）
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    // world 單位的字級要跟著視窗高度重算，否則縮放視窗時字與格距的比例會跑掉
    if (mat) mat.uniforms.uWorldToPx!.value = worldToPx(h);
    updateHintAnchor(); // 視窗尺寸變了 → 投影出來的螢幕位置要跟著重算
  };
  const resizeObs = new ResizeObserver((entries) => {
    const box = entries[0]?.contentRect;
    if (box) applySize(box.width, box.height);
  });
  resizeObs.observe(wrap);

  onBeforeUnmount(() => {
    unmounted = true;
    observer.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onDocVisibility);
    resizeObs.disconnect();
    renderer.domElement.removeEventListener('pointermove', onMove);
    renderer.domElement.removeEventListener('pointerleave', onLeave);
    renderer.domElement.removeEventListener('click', onTap);
    window.removeEventListener('scroll', onScroll);
    clearTimeout(idleTimer); // 下滑提示的十秒計時（由上面那支 onScroll 排的）
    tapMq.removeEventListener('change', onTierChange);
    mobMq.removeEventListener('change', onTierChange);
    revealTween?.kill(); // gsap ticker 上的補間，不會隨 rAF 一起停
    revealTween = null;
    gsap.killTweensOf(bgColor); // 同上：底色補間也跑在 gsap 的 ticker 上
    syncBgFn = null;
    // ⚠️ dispose() 只釋放 three 這側的資源，WebGL context 本身要 forceContextLoss() 才會
    //    還給瀏覽器。每次掛載就佔掉一個 context（開發時 HMR 反覆重掛最容易撞到）——
    //    不還的話大約 8~16 次就到瀏覽器的 context 上限，之後新的 canvas 全黑。
    renderer.forceContextLoss();
    renderer.dispose();
    geom?.dispose();
    mat?.dispose();
    atlas?.texture.dispose();
    colorRamp?.dispose();
    wrap.removeChild(renderer.domElement);
  });
});
</script>

<template>
  <div ref="wrapRef" class="stage">
    <!-- 彩蛋：定位/透明度由 JS 每幀控制；內容走 slot（預設純文字） -->
    <div ref="eggRef" class="egg" aria-hidden="true">
      <slot name="phrase" :index="activeEgg" :text="displayText">
        {{ displayText }}
      </slot>
    </div>

    <!-- 互動提示：圓環圖示錨在人像右下臉頰（位置由 JS 投影寫成 --hint-x/y，對位交給 CSS），
         游標/手指真的碰到人像後收起。圖示照 Figma 2065:139734 的三個同心圓（中／外兩圈
         實作成向外擴散的漣漪，見 .hint__wave），三個斷點共用；
         說明文字 pc／平板排在圖示右邊（.hint__text，兩者文案不同見 hintText）、
         手機排在人像下方（.hint-mob）。 -->
    <div
      v-if="(hint || hintPad || hintMob) && hintPos"
      class="hint"
      :class="{ 'hint--on': hintVisible }"
      :style="{ '--hint-x': `${hintPos.x}px`, '--hint-y': `${hintPos.y}px` }"
      aria-hidden="true"
    >
      <svg
        class="hint__icon"
        width="88"
        height="88"
        viewBox="0 0 88 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="hint__wave" cx="44" cy="44" r="43.75" />
        <circle class="hint__wave hint__wave--late" cx="44" cy="44" r="43.75" />
        <circle class="hint__dot" cx="44" cy="44" r="8" />
      </svg>
      <p class="hint__text">{{ hintText }}</p>
    </div>

    <!-- 手機版說明文字：單行置中，錨在人像 bbox 底緣中點、下移 31px（Figma 2065:120222）。
         與上面那組共用 hintVisible，故顯隱時機、dismiss 行為完全一致。 -->
    <p
      v-if="hintMob && hintMobPos"
      class="hint-mob"
      :class="{ 'hint-mob--on': hintVisible }"
      :style="{
        '--hint-x': `${hintMobPos.x}px`,
        '--hint-y': `${hintMobPos.y}px`,
      }"
      aria-hidden="true"
    >
      {{ hintMob }}
    </p>

    <!-- 下滑提示：水平置中、距舞台底緣 44px（Figma 2065:139741）。
         語意與上面兩組不同 —— 那兩組是「這裡可以互動」的邀請，這顆是「還有下文」的指引；
         但在手機兩者會擠在同一塊，故顯示時機上互斥（三個條件見 scrollHintOn）。 -->
    <UBtnScrollHint
      v-if="scrollHintOn"
      class="scroll-hint"
      :label="scrollHint"
    />
  </div>
</template>

<style lang="scss" scoped>
.stage {
  position: relative;
  width: 100%;
  // 視窗高的單一來源見 app/utils/viewport-height.ts；mixins.scss 由 nuxt.config
  // 的 additionalData 自動注入，不必在此 @use。
  // 這是 in-flow 用法的預設；掛在 hero 轉場層裡時由該層覆寫成 height:100%
  // —— 那層是 fixed inset:0（dynamic viewport），與 --vh（large viewport）不是同一把尺。
  // 理由寫在 01.hero/HeroSymbolTransition.vue 的 :deep(.stage)。
  height: vh(1);
  background: #fff;
  overflow: hidden;
  cursor: crosshair;
}

/* 彩蛋文字：定位/透明度由 JS 每幀以 transform/opacity 控制。
   設計稿 Figma 1145:41559：Noto Sans TC Regular 20 / 32、字距 0、main/orange、置中。
   顏色不寫在這裡 —— 由 phraseColor prop 以 inline style 寫進 el.style.color（面板可即時改），
   inline style 本來就蓋過這條規則，寫了也只是死碼。
   ⚠️ white-space: pre 而非 pre-line：稿上每行都是 nowrap、斷行位置由文案的 \n 定死
   （見 locales/section1.json 的 symbol.phrases），不可讓容器寬度自己再折一次。
   同理不設 max-width —— 那會讓最長的「永遠不會被AI取代」在窄視窗被折斷。 */
.egg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  font-size: 20px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0;
  text-align: center;
  white-space: pre;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  will-change: transform, opacity;
}

// 圓環圖示那一組：位置由 JS 把 bbox 上的錨點投影成螢幕 px，寫進 --hint-x/y。
// 三個斷點都出現。稿只有 mob 與 pc 兩版，平板沿用 pc 版位、只換文案（見 hintPad prop）——
// 2026-08-23 之前 tablet（768–1279）是 display:none，那一段整組提示看不到，而彩蛋也同時
// 卡在「走 hover 那套、但機器沒有 hover」的縫裡（見 script 側 TAP_QUERY 那段）。
// ⚠️ 已知取捨：寬度 ≥1280 的觸控裝置（iPad Pro 橫向、Surface）仍會看到 pc 那句「游標移動」，
//    但那台機器沒有游標。改用 (hover: hover) 能擋掉，此處依專案決定一律走斷點。
$hint-icon-size: 88px;

.hint {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
  // ⚠️ 第二段位移是把**圖示中心**（而非整組的中心）對到錨點：pc 稿的說明文字排在圖示
  //    右邊，整組 203px 寬，用 -50% 會把圖示往左推半個文字寬、離開臉頰。
  //    手機版文字不在這組裡（見 .hint-mob），整組就是圖示，-50% 與此式同值。
  transform: translate(var(--hint-x), var(--hint-y))
    translate(calc($hint-icon-size / -2), -50%);
  pointer-events: none; // 不能擋住 canvas 的 pointermove，否則整個斥力互動會死
  opacity: 0;
  transition: opacity 0.4s ease;
  will-change: opacity;
}

.hint--on {
  opacity: 1;
}

// 設計稿 Figma 2065:139734 / 2065:120222：88×88 三個同心圓（兩個斷點同尺寸）
.hint__icon {
  flex: 0 0 auto;
  width: $hint-icon-size;
  height: $hint-icon-size;
}

// 漣漪：與 HeroStart 的音效提示同一套做法（見 .hero-start__sound-wave）——
// 設計稿那張「中圈 ＋ 外圈」的定格，實作成同一顆最外圈（r=43.75）的兩份副本，
// 各自由圓心擴到最外圈、相位差半個週期，故畫面上同時看得到一內一外兩圈。
// ⚠️ 這兩個秒數與 HeroStart 的 PULSE_DURATION / PULSE_STAGGER 是同一組節奏，
//    分屬 scss 與 ts 無法共用，改一邊要記得跟著改另一邊。
$hint-pulse-dur: 1.5s;
$hint-pulse-stagger: 0.75s;

// scale 0.1829 = 8 / 43.75（設計稿實心點 → 最外圈的半徑比）
@keyframes hint-pulse {
  0% {
    opacity: 0;
    transform: scale(0.1829);
  }

  10% {
    opacity: 1;
  }

  60% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.hint__wave {
  fill: none;
  stroke: #fff;
  stroke-opacity: 0.75; // 設計稿中圈的值 ＝ 漣漪最亮的那一段；擴到最外圈時已在淡出
  stroke-width: 0.5;
  transform-box: fill-box;
  transform-origin: center;
  // 這組提示沒有固定次數（收場由「碰到人像」決定，見 script 的 dismissHint），故 infinite；
  // fill-mode: both 讓 delay 期間也套 0% 那格（透明），第二圈才不會先閃一下靜止的滿版外圈。
  animation: hint-pulse $hint-pulse-dur ease-out infinite both;
  // 平時暫停、整組亮起才跑。用 paused 而不是「亮起時才掛 animation」：整組淡出的那 0.4s
  // （.hint 的 transition）若把動畫拿掉，會先跳回靜止的滿版外圈再淡掉；暫停則是原地凍住。
  animation-play-state: paused;

  &--late {
    animation-delay: $hint-pulse-stagger;
  }
}

.hint--on .hint__wave {
  animation-play-state: running;
}

.hint__dot {
  fill: #fff;
  fill-opacity: 0.85;
}

@media (prefers-reduced-motion: reduce) {
  // 不擴散：直接定在設計稿的靜態三層（中圈 23.5/43.75、外圈原尺寸且較淡）。
  // 顯隱照舊由 .hint--on 的 opacity 過渡負責，故提示該在的時候還是在。
  .hint__wave {
    animation: none;
    transform: scale(0.5371);

    &--late {
      stroke-opacity: 0.5;
      transform: none;
    }
  }
}

// pc 稿的橫排說明：Noto Sans TC Light 13 / 26、字距 1.3、白色（主字體由 base.scss 全域指定）。
// 平板共用這一組版位、只換文案（見 script 側的 hintText），故界線畫在 tablet 而不是 pc。
// 手機不排在圖示旁邊，故 <768 一律不出現 —— 這也讓 .hint 在手機只剩圖示、上面那道
// translate 自然等於置中。
.hint__text {
  display: none;
  margin: 0;
  font-size: 13px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 1.3px;
  color: #fff;
  white-space: pre-line; // 吃文案裡的 \n

  @include rwd-min('tablet') {
    display: block;
  }
}

// 手機版說明：單行置中排在人像下方。設計稿 Figma 2065:120222 —— Noto Sans TC Light
// 20 / 26、字距 4、白色；bbox 底緣（＝ --hint-y 的錨點）再往下 31px。
// margin-top 先作用、transform 後作用，故等同「錨點 + 31px」。
.hint-mob {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: none;
  margin: 31px 0 0;
  transform: translate(var(--hint-x), var(--hint-y)) translate(-50%, 0);
  font-size: 20px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 4px;
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
  will-change: opacity;

  @include rwd-max('tablet') {
    display: block;
  }
}

.hint-mob--on {
  opacity: 1;
}

// 下滑提示的版位（圖示本體、漂移動態與捲動行為都在 <UBtnScrollHint>）。
// 設計稿 Figma 2065:139741（1280×720 的「智慧論壇07」）：22×12 的圖示水平置中
// —— 量到的墨水 bbox 是 x 629..650，中心 640 ＝ 畫面中心；距框底 44px。
// （metadata 回報 x=651 是旋轉過的 instance 的未變換 bbox，不是實際落點。）
// 稿上只有 pc 那一格有這個提示（mob 的 2065:120222 沒有），故三個斷點共用同一組數字。
//
// ⚠️ 不補 --chrome-inset（與 hero 的 .sec1__hero-scroll 不同）：正式站本層住在
//    HeroSymbolTransition 的 fixed inset:0 之內、.stage 被覆寫成 height:100%
//    ＝ dynamic viewport，底緣就是「看得到的」底緣。hero 那邊要補是因為它的容器高是
//    vh() ＝ large viewport（凍結、不隨網址列收合）。
//
// ⚠️ pointer-events: auto 是必要條件，不是保險：外層 .hero-symbol-transition 是
//    pointer-events: none（只有 :deep(canvas) 被打開，見該檔），不覆寫回來這顆按鈕
//    的命中會穿過去掉到下層，點不到。
// z-index 2 ＝ 與 .egg / .hint 同層：三者不重疊，都只需要疊在 canvas 之上
//    （canvas 由 three.js appendChild 進來、未定位，故任何 positioned 子項都在它之上，
//     這個 2 是把意圖寫明、不倚賴那條規則）。
.scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 44px;
  z-index: 2;
  transform: translateX(-50%);
  pointer-events: auto;
}

</style>
