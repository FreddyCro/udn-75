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
   */
  dLen?: number;
};

/** 事件鍵 → 觸發門檻（forumPath 軌的 0..1）。缺 key ＝ 該斷點不觸發。 */
export type ForumEventMarks = Record<string, number>;

// ── 事件表 ────────────────────────────────────────────────────────────
//
// 🔧 探針事件（key 以 probe 開頭）：**沒有消費端**，只在 ?pathdebug 的面板現形。
//    它們是這套機制的驗收樣本，涵蓋四種情形：前半段節點、後半段節點、
//    某斷點不觸發（null）、以及 dLen 偏移。真實事件進來之後可以整段刪掉。
export const FORUM_PATH_EVENTS: readonly ForumPathEvent[] = [
  {
    // 論壇一的講者照：三個斷點的節點本來就錨在照片上（W5 上緣 +15、Q5 +208、P5 +102），
    // 所以「核心走到照片」與「藍塊開始退」是同一件事，不需要 dLen。
    // 場次 → key 的對照在 ~/utils/forum-photo-reveal，外觀在 ForumEvent 的 SCSS。
    key: 'forum1PhotoReveal',
    label: '論壇一講者照：藍塊刷開',
    at: { pc: 'W5', pad: 'Q5', mob: 'P5' },
  },
  {
    // 論壇二的兩張講者卡（同場一起刷）。pc 的 W17 錨在照片的 0.4674 處；
    // pad／mob 沒有照片錨點，取最近的 Q8（講者組上緣 +2）與 P9（講者一組上緣 +54）。
    // ⚠️ 後兩者是「最近的節點」而不是照片本身 —— 時機要微調就動 dLen，
    //    **不要**回頭改節點的 dy，那是設計線的幾何。
    key: 'forum2PhotoReveal',
    label: '論壇二講者卡：藍塊刷開（兩張一起）',
    at: { pc: 'W17', pad: 'Q8', mob: 'P9' },
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
    out[e.key] = clamp01((len + (e.dLen ?? 0)) / pathLen);
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
