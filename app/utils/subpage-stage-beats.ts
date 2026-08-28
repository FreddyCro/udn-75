/**
 * 子頁舞台（Subpage 的 hero／引言／媒體疊同屏）的節奏算式。
 *
 * 舞台一「拍」＝捲過一屏，pin 距離＝拍數 × 一屏。各塊在拍與拍的交界原地交接：
 * 過 BEAT_OUT 送走前一塊、過 BEAT_IN 迎進下一塊（兩條線間隔小，快速捲過≈交叉淡化）。
 *
 * 門檻一律除以拍數，所以「第幾拍的第幾條線」換算成絕對捲動距離時與拍數無關 ——
 * 加減一拍不會挪動既有各塊的時間點（見 subpage-stage-beats.spec.ts 的不變式）。
 */

/** 拍內送走前一塊的線 */
export const BEAT_OUT = 0.35;
/** 拍內迎進下一塊的線 */
export const BEAT_IN = 0.5;
/**
 * 最後一塊**開始退場**的線。它沒有下一塊要迎進，所以不走 BEAT_OUT 的交接節奏。
 *
 * ⚠ 與前面兩塊不同，最後一塊的退場是 **scrub（綁 progress）而不是 0.4s 的時間動畫**，
 *   從這條線一路淡到 pin 結束。理由見 mediaFadeAlpha。
 *
 * 這條線到 1 之間就是**淡出的捲動距離**（3 拍時 ＝ 25vh，1440×900 下 225px）。
 * 太短會變成瞬間消失、也失去 scrub 的意義；太長則照片賴著不走。
 */
export const BEAT_LAST_FADE_FROM = 0.75;

/** 藏起來時的 y 位移：還沒進場的藏在下方（回捲原路退回），演完的往上送走（與 hero 退場同向）。
 *
 * `before` 36 ＝ 引言淡入時往上走的距離（2026-08-16 由 200 改；200 讀起來像整段滑進來，
 * 不是「浮上來」）。實際只有引言吃得到：滿屏媒體走 shift: false（見 Subpage 的 makeFade），
 * y 參數整個被忽略；hero 的載入進場另有自己的 REVEAL.y。
 * `after` 維持 -120：那是「這段講完、被下一拍推走」的語彙，與進場不是同一件事。 */
export const HIDE_Y = { before: 36, after: -120 } as const;

/** before＝還沒進場、shown＝正在演、after＝演完（最後一塊之前的塊會被下一塊接手） */
export type StageBlockState = 'before' | 'shown' | 'after';

/** 有媒體＝三拍（hero → 引言 → 媒體）；沒有＝hero／引言收在一拍內 */
export function stageBeats(hasMedia: boolean): number {
  return hasMedia ? 3 : 1;
}

/** 各塊的進出線，值域為整段 pin 的 progress（0..1） */
export interface StageLines {
  heroOut: number;
  introIn: number;
  introOut: number;
  mediaIn: number;
  /** 媒體**開始**淡出的線（不是淡完的線）—— 之後一路 scrub 到 progress 1 */
  mediaFadeFrom: number;
}

/**
 * 拍號寫死是刻意的：沒有媒體時 beats=1，媒體（甚至引言的退場）那幾條線會落在 1 之後，
 * 永遠過不了，對應的狀態機自然整段不啟用。
 */
export function stageLines(beats: number): StageLines {
  /** 第 beat 拍（0-based）的第 offset 條線 */
  const line = (beat: number, offset: number) => (beat + offset) / beats;
  return {
    heroOut: line(0, BEAT_OUT),
    introIn: line(0, BEAT_IN),
    introOut: line(1, BEAT_OUT),
    mediaIn: line(1, BEAT_IN),
    mediaFadeFrom: line(2, BEAT_LAST_FADE_FROM),
  };
}

/**
 * 媒體退場的透明度：**綁 progress，不綁時間**。
 *
 * ⚠ 為什麼最後一塊不能沿用 0.4s 的時間動畫：內文用 `--under-stage` 上拉一屏墊在舞台
 *   後面，是**跟著捲動 1:1 走**的。用時間動畫的話，觸發之後那 0.4 秒使用者還在捲，
 *   照片消失時內文已經滑掉「捲動速度 × 0.4s」—— 實測 1440×900：400px/s 滑掉 53px、
 *   800px/s 滑掉 221px、1600px/s 滑掉 573px、甩一下（3000px/s）第一屏整個過去。
 *   綁 progress 之後重疊量恆為 0，照片歸零的位置與捲動速度無關。
 *
 * fadeTo 預設 1 ＝ 淡完正好是 unpin。fadeTo ≤ fadeFrom（理論上不會發生）時退化成
 * 硬切，不吐 NaN／Infinity —— 那會讓 opacity 變成無效值而靜默不套用。
 */
export function mediaFadeAlpha(progress: number, fadeFrom: number, fadeTo = 1): number {
  if (progress <= fadeFrom) return 1;
  if (progress >= fadeTo) return 0;
  if (!(fadeTo > fadeFrom)) return 0;
  return 1 - (progress - fadeFrom) / (fadeTo - fadeFrom);
}

/** 引言與媒體共用：由 progress 決定該塊此刻該是哪一態（進線含、出線含） */
export function blockState(progress: number, inLine: number, outLine: number): StageBlockState {
  if (progress < inLine) return 'before';
  return progress >= outLine ? 'after' : 'shown';
}

/**
 * 「等淡出播完才停播」的延後副作用，執行當下還算不算數。
 *
 * ⚠ 淡出 tween 的 onComplete 不等於「這塊現在確實不用演了」：回捲若落在淡出的最後一格
 *   frame，gsap 的 `overwrite: 'auto'` 要等新 tween 首次 render 才砍掉舊 tween，舊的淡出
 *   會先播完並觸發 onComplete，把剛被 show 打開的播放狀態又關掉 —— 照片看得見卻停在
 *   第一張，而且此時狀態已是 'shown'、同一拍內不會再換態，那條分支不會再進，
 *   **不會自己恢復**，得捲出那一拍再捲回來。（見 test/subpage-media-active.spec.ts）
 *
 * 所以延後的停播要在執行當下重新確認該塊是不是真的還沒在演，不能只靠「onComplete
 * 沒被觸發」來代表它已被接手。
 */
export function deferredStopStillApplies(stateNow: StageBlockState): boolean {
  return stateNow !== 'shown';
}

/**
 * 舞台（pin ＋ 三塊交接）要不要啟用。回 false ＝ 走 flow 版型：hero／引言／媒體照
 * 文件流依序滑過，什麼動態都不接（＝ Subpage.vue 的 onMounted 直接 return）。
 *
 * 兩個否決條件：
 * - reducedMotion：使用者要求減少動態。
 * - narrow：<768。設計稿（分頁_414mob）要求手機版走一般 layout flow ——
 *   首屏與引言的淡入淡出刪除、引言不定住一屏、影片退場淡出刪除，順順滑下來。
 *   （滿版圖／影片仍佔滿一屏，但那是版型，不是動態。）
 *
 * ⚠️ 抽成純函式只為了讓真值表進得了測試；**呼叫端只有一處**（Subpage.vue 的
 *    onMounted）。判定用的斷點必須是 TABLET_BREAKPOINTS ＝ SCSS `rwd-min('tablet')`
 *    的同一個數字，否則會出現「JS 建了 pin、CSS 套 flow 版型」的破版
 *    —— 這條對帳由 test/subpage-flow-layout.spec.ts 守著。
 */
export function shouldRunStage({
  reducedMotion,
  narrow,
}: {
  reducedMotion: boolean;
  narrow: boolean;
}): boolean {
  return !reducedMotion && !narrow;
}

// ── 手機版「只 pin 媒體」（2026-08-28）────────────────────────────────────────
//
// 設計師改口：滿版媒體在手機上也要**定住**。上面 shouldRunStage 引的那句設計稿
// 「滿版圖和影片還是要定住一屏，影片退場淡出動態刪除，一樣滾動離開」，當時把
// 「定住一屏」讀成**版型**（`.subpage__media { height: vh(1) }`）＋「一樣滾動離開」＝ 不 pin。
// 這次要的是真的 pin ＋ scrub 淡出，也就是推翻那句的後半。
//
// ⚠️ 只推翻媒體那一項。設計稿其餘仍然有效：**hero／引言維持 flow**（首屏與引言的淡入
//    淡出刪除、引言不定住一屏）。所以這條路徑與 shouldRunStage 那套三拍舞台是**互斥**的
//    兩條路，不是同一套的開關（由 test/subpage-stage-beats.spec.ts 守著互斥）。
// ⚠️ reducedMotion 照樣否決 —— 那是無障礙需求，不是設計偏好，不隨這次改口鬆綁。

/** 手機版只 pin 媒體時的 pin 距離（× 一屏）＝ **定住感的旋鈕**。
 *
 *  沿革：
 *   2026-08-28 初版取 1（＝ 舊行為 disperseDuration 2.2s × ASSUMED_READING_VH_PER_S
 *     25vh/s ≈ 55vh，加上 0.25 屏淡出湊成一屏）。**那個錨定是錯的** —— 舊行為本來就不是
 *     pin 而是「照片捲過去」，照一個非 pin 的時長換算，得到的必然是捲過去的感覺。
 *     設計師實測回報「沒有感覺 pin 住」，屬實。
 *   2026-08-28 改取 2（＝ 定住 2 屏 ≈ 8s @25vh/s；沒有淡出，見下方那段，整段都是定住）。
 *     新的錨定是**畫面上真的有幾件事發生完**：定住期間 Ken Burns 與輪播一直在動
 *     （interval 預設 2500ms），所以「被釘住」要能被讀出來，前提是這段時間長於
 *     「換一張」的量級 —— 3s 只夠換一張（讀成一段影片在播），8s 換三張（讀成一組被
 *     留在畫面上的輪播）。
 *
 *  ⚠️ 這是**感知量、只能實機目視定**，不能推導。它唯一的硬約束是拇指成本：每多一屏
 *     就是多一次「滑到底再滑」。要調就只改這一個數字。
 *  ⚠️ 若加長到 3 屏還是讀不出定住感，**下一個該動的不是距離**：一張持續位移／換張的照片
 *     永遠不會讀成「凍住」。那時要動的是定住期間的 Ken Burns 與 interval（見
 *     SubpageIntroMedia 的 --intro-media-anim 與 interval prop），不是繼續往下捲。
 *
 *  ⚠️ 影片那兩頁（service / visual）不受長度限制：兩支都是 12.62s，但 UVid 預設
 *     loop: true 且本區塊沒關掉 ⇒ 任何 pin 長度都是連續畫面，不會播完卡住。
 *  （附帶：2 屏 ≈ 8s，四張輪播 10s 仍跑不完。真要四張都露臉，手機傳 `:interval="1200"`
 *   比繼續拉 pin 便宜得多 —— 拉 pin 是拇指成本、改 interval 不是。） */
export const MEDIA_ONLY_PIN_VH = 2;

// ── 手機版**沒有**淡入淡出（2026-08-28 設計師追加）──────────────────────────
// 「pin 住前後都不需要淡入淡出，直接維持 opacity 1」。所以這條路徑：
//   ・不寫 autoAlpha ⇒ 用不到 mediaFadeAlpha，也沒有「淡出起線」這個概念。
//     （桌機第三拍仍然有，那是 stageLines 的 mediaFadeFrom，兩邊不再共用任何淡出參數。）
//   ・**因此也沒有內文上拉**（初版的 `--under-media`）：那條上拉存在的唯一理由是
//     「照片淡掉時內文已經在後面接著」。沒有淡出還拉的話，不透明的照片會直接壓在內文上。
//     拿掉之後 unpin 那一刻照片正好填滿視窗、內文接在它下緣 ⇒ 照片往上捲走、內文跟著
//     升上來，就是設計稿原本那句「一樣滾動離開」，中間也不會空一屏。
// 於是整段 pin 都是「定住」，MEDIA_ONLY_PIN_VH 就是定住距離本身，不必再扣淡出。

/**
 * 手機版要不要「只 pin 媒體」（hero／引言仍走 flow）。
 * 回 false ＝ 這條路徑整個不啟用（走原本的 flow 版型，什麼都不接）。
 *
 * 與 shouldRunStage **互斥**：寬螢幕由那套三拍舞台接手（媒體在它的第三拍裡已經會定住），
 * 這裡只補窄螢幕那一半。兩者同時為真是矛盾狀態，測試會擋。
 *
 * ⚠️ 抽成純函式的理由同 shouldRunStage（讓真值表進得了測試），且**斷點必須是同一個
 *    TABLET_BREAKPOINTS** —— 呼叫端與 shouldRunStage 共用同一次 matchMedia 量測結果，
 *    不另外再查一次 media query，否則兩者會有機會在邊界各自得到不同答案。
 */
export function shouldRunMediaPin({
  reducedMotion,
  narrow,
}: {
  reducedMotion: boolean;
  narrow: boolean;
}): boolean {
  return !reducedMotion && narrow;
}
