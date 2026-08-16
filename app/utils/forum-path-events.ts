// ── 論壇段路徑事件：以「設計線的節點編號」定址的捲動事件表 ────────────────
//
// 「核心走到線上某處 → 某個區塊有反應」的事件都寫在這裡。門檻**不是手寫的百分比**，
// 而是由節點在每次 ScrollTrigger refresh 依實際幾何重算出來的 —— 手寫 % 在 RWD 下會飄
// （節點之間的弧長比例隨文字高度變動，且三個斷點的節點數與弧長分佈完全不同）。
// 完整推導見 architecture/2026-08-12-forum-path-events-design.md 第一節。
//
// 職責切法同 forum-slash / forum-trail：量測留在元件裡（ForumCorePath 用量尺 path 算出
// 每個節點的弧長），算得出來的東西放這裡，vitest 才能直接跑、不需要 jsdom。
//
// ⚠ 這裡**只管時機**，不放外觀。長寬、傾角、顏色、transition 時長留在消費元件的 SCSS
//   （同 FORUM_SLASH_AT 的註解精神）—— 改字級不該動到這個檔案。

export type ForumBp = 'pc' | 'pad' | 'mob';

export type ForumPathEvent = {
  /**
   * 事件鍵。消費端讀 `forumPathEvents.<key>` 取 boolean。
   * **永不重命名**，理由同節點編號永不重排：地址會寫進 issue／對話／commit。
   */
  key: string;
  /** dashboard（?pathdebug）顯示的一句話說明 */
  label: string;
  /**
   * 觸發節點（每個斷點各自的編號 —— pc 是 W/R、pad 是 Q/S、mob 是 P/T，本來就不通用）。
   * null ＝ 該斷點不觸發這個事件。那是真實需求：稿上那一撇在 mob 就不畫，
   * 因為線在那個 y 帶根本不經過 09/15（見 forum-node-path.md 第三節）。
   */
  at: Record<ForumBp, string | null>;
  /**
   * 沿線再往前（正）／往後（負）偏移幾 px 弧長。預設 0。
   * 單位與 FORUM_PLANE.morphLen / tailLen 相同 —— 專案裡已經用 px 弧長思考沿線距離。
   * 正 ＝ 晚一點觸發（核心要多走這麼多 px），負 ＝ 提前。
   *
   * 給單一數字 ＝ 三斷點共用；也可以逐斷點各給一個（缺的斷點視為 0）。
   * **逐斷點是常態，不是例外**：`at` 本來就指向三個不同的節點，而那些節點離「真正想觸發
   * 的位置」的距離自然不同。實例 —— `forum1PhotoReveal` 要的是「核心碰到講者照上緣」：
   *   pc  的 `W5` 稿上的彎頂本來就進到照片裡（上緣 +15）→ 不必偏移
   *   pad 的 `Q5` 錨在照片上緣 +208，而 pad 照片只有 233 高 → 要 −205 拉回上緣
   *   mob 的 `P5` 錨在照片上緣 +102（照片 233 高）→ 要 −103
   * 硬要三斷點共用一個數字就會有斷點對不上。更極端的例子是 2026-08-16 之前的
   * `forum2PhotoReveal`：同樣要「碰到照片上緣」，pc 要 −122 而 pad 要 +181，**方向相反**。
   *
   * 反過來說，**能把 at 指到一個語意正確的節點時就不要靠 dLen 硬拉** —— dLen 是量出來的
   * 常數，版面伸縮時不會跟著走；節點是即時量測的，會跟著走（見 forum2PhotoReveal）。
   */
  dLen?: number | Partial<Record<ForumBp, number>>;
};

/** 事件鍵 → 觸發門檻（forumPath 軌的 0..1）。缺 key ＝ 該斷點不觸發。 */
export type ForumEventMarks = Record<string, number>;

// ── 事件表 ────────────────────────────────────────────────────────────
//
// 🔧 探針事件（key 以 probe 開頭）：**沒有消費端**，只在 ?pathdebug 的面板現形。
//    它們是這套機制的驗收樣本，涵蓋四種情形：前半段節點、後半段節點、
//    某斷點不觸發（null）、以及 dLen 偏移。真實事件進來之後可以整段刪掉。
export const FORUM_PATH_EVENTS: readonly ForumPathEvent[] = [
  // ── 講者照的藍塊刷開 ──────────────────────────────────────────────
  // 兩場的時機語意**已經不同**，別把它們當成同一組看：
  //   論壇一 → 核心碰到講者照上緣的那一刻（下面的 dLen 是實測校出來的）
  //   論壇二 → 落在照片前面那個轉彎上，比碰到照片更早（2026-08-16 改，見該筆註解）
  //
  // forum1PhotoReveal 的每個數字都是逐格捲動實測出來的：
  // 先二分找出事件翻轉的 scrollY，再二分找出「核心中心正好落在照片上緣」的 scrollY，
  // 兩者之差乘上該斷點的 progress／px 斜率與 pathLen ＝ 需要的弧長偏移。
  //
  // ⚠️ 那個換算只是**一階估計，要跑第二輪修正**。progress 對 scroll 是線性的，但核心沿線的
  //    位置經過回中節點表重映射（見 forum-node-path.md 第五節），所以「弧長偏移 → 核心
  //    移動多少」不是常數。實測論壇二（舊版校照片上緣時）pc 第一輪估 −199 就過頭 57.7px，
  //    第二輪修成 −122 才對。量完務必再跑一次驗算，別只算一次就收工。
  // ⚠️ 誤差容許到「核心中心落在照片上緣下方 0～15px」—— pc 的 W5 本來就錨在上緣 +15
  //    （稿的意圖是彎頂進到照片裡），那個範圍就是設計本身的語意。
  // ⚠️ 要調時機請動這裡的 at／dLen，**不要**回頭改節點的 dy —— 那是設計線的幾何，
  //    一動整條線就偏（見 architecture/forum-node-path.md）。
  {
    // pc 的 W5 錨在照片上緣 +15，稿上那個彎頂本來就「進到照片裡（碰到講者照）」，
    // 實測翻轉時核心中心在上緣下方 13.8px ⇒ 就是設計要的，pc 不給偏移。
    // pad 的 Q5 是上緣 +208，而 pad 照片只有 233 高 → 核心走到照片 89% 才刷（太晚）。
    // mob 的 P5 是上緣 +102（照片 233 高）→ 走到 45% 才刷。
    key: 'forum1PhotoReveal',
    label: '論壇一講者照：藍塊刷開',
    at: { pc: 'W5', pad: 'Q5', mob: 'P5' },
    dLen: { pad: -205, mob: -103 },
  },
  {
    // 兩張卡同場一起刷（一個事件管整場，見 ~/utils/forum-photo-reveal）。
    //
    // 2026-08-16：從「碰到照片上緣」**提前到照片前面那個轉彎**（設計要求）。
    // 舊版是 at W17/Q8/P9 ＋ dLen −122/+181/−46 —— 那三個位置都校在照片上緣，但都落在
    // 兩節點之間的線段中（W17 是補點、剛好在照片中段，「純屬順帶」）。現在 at 直接指到
    // 那個轉彎節點、dLen 歸零：觸發點就是那個彎本身，不必逐斷點校，版面伸縮時也會
    // 跟著彎一起走（節點是即時量測的，dLen 是量死的常數）。
    //
    // 落點由設計師逐斷點指定（截圖對位），**不是機械地「取前一個節點」** ——
    // 三個斷點的節點分佈不同：pc 往前跨了兩個（W17 → W15），pad 只是把 +181 拿掉
    // （還是 Q8），mob 退一個（P9 → P8）。實測（pc 1920 / pad 820 / mob 414；
    // 「上方 n px」＝ 觸發時核心中心在照片上緣之上 n px）：
    //   pc  W15 —— .forum-event__date 下緣 +13 的髮夾彎，**就是 09/15 那一撇的下端**
    //              上方 74px。（W16 那個駝峰在上方 139px，設計上太早）
    //   pad Q8  —— .forum-event__speakers 上緣 +2，貼著「講者介紹」標籤左上角
    //              上方 42px。（Q7 在上方 344px，退到日期組裡，太早）
    //   mob P8  —— 「講者介紹」標籤列 +22 的折角，上方 26px
    //
    // ⚠️ pc 的 W15 在**版面上比 W16 低**（y 4044 vs 3979），但在**線上比 W16 早** ——
    //    核心先俯衝到那一撇的下端（W15），再翻上駝峰（W16）才往左下走 W17。
    //    只看 y 會覺得矛盾，要看弧長順序。
    key: 'forum2PhotoReveal',
    label: '論壇二講者卡：藍塊刷開（兩張一起，落在照片前的轉彎）',
    at: { pc: 'W15', pad: 'Q8', mob: 'P8' },
  },
  {
    key: 'probeForum1Turn',
    label: '探針：論壇一髮夾彎',
    at: { pc: 'W3', pad: 'Q3', mob: 'P3' },
  },
  {
    key: 'probeForum1TurnLate',
    label: '探針：同上再往前 400px 弧長（驗 dLen）',
    at: { pc: 'W3', pad: 'Q3', mob: 'P3' },
    dLen: 400,
  },
  {
    key: 'probeForum2Enter',
    label: '探針：進入論壇二',
    at: { pc: 'W10', pad: 'Q6', mob: 'P7' },
  },
  {
    key: 'probeSlashSpot',
    label: '探針：09/15 那一撇（mob 不觸發）',
    at: { pc: 'W13', pad: 'Q7', mob: null },
  },
  {
    key: 'probeAgendaTop',
    label: '探針：議程底（後半段第一點）',
    at: { pc: 'R0', pad: 'S0', mob: 'T0' },
  },
  {
    // 掛在唯一的 optional 節點上（`.highlights__item`）：不帶 ?highlights=1 時整個精彩活動
    // 不渲染 → 節點被跳過 → marks 缺這個 key → 事件恆 false，而**不是**當成打錯字。
    key: 'probeHighlights',
    label: '探針：精彩活動第二則（?highlights 關掉時節點被跳過）',
    at: { pc: 'R5', pad: 'S5', mob: 'T6' },
  },
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** 該斷點的沿線偏移（見 ForumPathEvent.dLen）。單一數字 ＝ 共用；逐斷點時缺的視為 0。 */
export function dLenFor(e: ForumPathEvent, bp: ForumBp): number {
  const d = e.dLen;
  if (d == null) return 0;
  return typeof d === 'number' ? d : (d[bp] ?? 0);
}

/**
 * 事件表 ＋ 節點弧長查表 → 門檻表（forumPath 軌的 0..1）。
 *
 * lenAt 由呼叫端注入（實務上是 ForumCorePath 用量尺 path 逐段累加 getTotalLength 得到的
 * Map），故本函式不碰 DOM。回 undefined ＝ 那個節點不存在或被跳過。
 *
 * 兩種「查不到」刻意**不在這裡分辨**：
 *   ① 事件表打錯節點編號 → 是 bug
 *   ② 節點標了 optional 且被跳過（?highlights=1 沒帶時整個精彩活動不渲染）→ 合法
 * 分辨要比對節點表，那是呼叫端的事（見 unknownEventNodes）；本函式維持純粹、可測。
 *
 * ⚠ pathLen ≤ 0 回空表，不回 NaN 門檻：NaN 的比較永遠是 false，事件會靜默永不觸發。
 */
export function resolveForumEventMarks(
  bp: ForumBp,
  lenAt: (id: string) => number | undefined,
  pathLen: number,
  events: readonly ForumPathEvent[] = FORUM_PATH_EVENTS,
): ForumEventMarks {
  if (!(pathLen > 0)) return {};

  const out: ForumEventMarks = {};
  for (const e of events) {
    const id = e.at[bp];
    if (!id) continue; // null ＝ 該斷點不觸發
    const len = lenAt(id);
    if (len == null) continue;
    // 夾在 [0, 1]：dLen 開太大時退化成「線頭就觸發」或「線尾才觸發」，
    // 而不是一個永遠比不到的門檻（那會是靜默的）。面板上會看到 0% / 100%。
    out[e.key] = clamp01((len + dLenFor(e, bp)) / pathLen);
  }
  return out;
}

/**
 * 事件是否已越過（forumPath 軌的 progress vs 門檻）。
 *
 * mark 為 undefined ＝ 該斷點不觸發（at[bp] 為 null）、節點是 optional 且被跳過、
 * 或整份 marks 還沒建起來 → 一律 false。取 `>=` 而非 `>`：門檻是 0 的事件
 * （dLen 夾到線頭）語意上就該從第一幀起是 on。
 */
export function forumEventOn(progress: number, mark: number | undefined): boolean {
  return mark != null && progress >= mark;
}

/**
 * 事件表裡引用了「不存在於該斷點節點表」的編號 —— 一律是打錯字。
 *
 * 這是本機制最容易犯、最靜默的錯：事件永遠不觸發，而畫面上少一個效果不會有人立刻發現。
 * 故同時由 ForumCorePath 的 console.warn 與 test/forum-path-events.spec.ts 守著。
 */
export function unknownEventNodes(
  bp: ForumBp,
  nodeIds: readonly string[],
  events: readonly ForumPathEvent[] = FORUM_PATH_EVENTS,
): { key: string; id: string }[] {
  const known = new Set(nodeIds);
  const out: { key: string; id: string }[] = [];
  for (const e of events) {
    const id = e.at[bp];
    if (id && !known.has(id)) out.push({ key: e.key, id });
  }
  return out;
}
