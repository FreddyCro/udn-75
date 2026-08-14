// 序列定址：把 useOrangeCoreProgress 那幾條 progress 軌，解析成「章節.part.progress」。
//
// 這裡**不驅動任何東西**，純粹是讀取層 —— 驅動仍在各段的 ScrollTrigger，軌在
// useOrangeCoreProgress，切段的資料在 ~/utils/orange-core-config 的 SEQUENCE。
// 分成獨立 composable 而非併進 useOrangeCoreProgress：後者是「軌」的單一來源，
// 定址是疊在上面的一層語意，且它要讀 useHeroVideo，併進去會讓軌那層多一個相依。
//
// 用途是溝通：dashboard 顯示 `forum.2 face · 59%`，正式書寫用 `forum.face.59%`，
// 而 raw / vh 兩欄讓那個地址能直接反算回 config 的門檻值。
import {
  SEQUENCE,
  TRACK_VH,
  type SequencePart,
  type SequenceTrack,
} from '~/utils/orange-core-config';

export type PartState = 'idle' | 'live' | 'done';

export type ResolvedPart = {
  /** 章節 key（hero / forum / blessing） */
  chapter: string;
  /** 章節內序號（1-based）。**顯示用**，不是主鍵 —— 插入新 part 會位移。 */
  index: number;
  part: SequencePart;
  /** 地址（不含 progress），例：`forum.face` */
  address: string;
  state: PartState;
  /** 'scrub' → 該 part 內的 local 進度 0..1；其餘為 null */
  progress: number | null;
  /** 該 part 所屬軌的原始值 0..1（可直接貼回 config 當門檻）；非 scrub 為 null */
  raw: number | null;
  /** 這段吃掉的捲動距離（vh）。量測幾何（path / forumPath）與無長度資訊者為 null */
  vh: number | null;
};

// 攤平成單一線性序列（章節只是分組，捲動順序才是真的順序）。靜態，模組載入時算一次。
const FLAT = SEQUENCE.flatMap((ch) =>
  ch.parts.map((part, i) => ({
    chapter: ch.key,
    index: i + 1,
    part,
    address: `${ch.key}.${part.key}`,
  })),
);

const clamp01 = (p: number) => (p < 0 ? 0 : p > 1 ? 1 : p);

export function useCoreSequence() {
  const core = useOrangeCoreProgress();
  const { state: heroState } = useHeroVideo();

  const trackValue = (t: SequenceTrack): number =>
    ({
      path: core.pathProgress.value,
      transition: core.transitionProgress.value,
      symbol: core.symbolProgress.value,
      forumPath: core.forumPathProgress.value,
      cover: core.coverProgress.value,
      blessing: core.blessingProgress.value,
      blessingOut: core.blessingOutProgress.value,
    })[t];

  // 'time' part 的完成旗標。這類 part 只有 idle / done 兩態 —— 不追時間軸進度，
  // 因為那個進度不是捲動比例，拿來當地址會讓人以為可以在中間掛捲動門檻。
  const flagDone = (f: NonNullable<SequencePart['flag']>): boolean =>
    f === 'heroVideo' ? heroState.value === 'gone' : core.stairsDone.value;

  const parts = computed<ResolvedPart[]>(() => {
    // ① 各 part 自身可判定的部分（無軌 part 留待 ② 由下一段反推）
    const rows = FLAT.map((row) => {
      const { part } = row;
      const from = part.from ?? 0;
      const until = part.until ?? 1;
      const span = until - from || 1;

      let raw: number | null = null;
      let progress: number | null = null;
      let begun = false;
      let complete = false;
      let vh: number | null = null;

      if (part.drive === 'scrub' && part.track) {
        raw = trackValue(part.track);
        progress = clamp01((raw - from) / span);
        begun = raw > from;
        complete = raw >= until;
        const trackVh = TRACK_VH[part.track];
        if (trackVh !== undefined) vh = trackVh * span * 100;
      } else if (part.drive === 'time' && part.flag) {
        complete = flagDone(part.flag);
        begun = complete;
      } else {
        // drive: 'none' —— 沒有任何訊號，begun / complete 在 ② 反推
        if (part.vh !== undefined) vh = part.vh * 100;
      }

      return { ...row, raw, progress, begun, complete, vh };
    });

    // ② 無軌 part 的「結束了沒」＝「下一段開始了沒」。由後往前掃，
    //    故連續兩個無軌 part 也不會讀到未解析的值（但 SEQUENCE 本來就不允許相鄰，
    //    見該檔註解 —— 相鄰時前一個會永遠停在未完成）。
    for (let i = rows.length - 1; i >= 0; i--) {
      const r = rows[i]!;
      if (r.part.drive !== 'none') continue;
      const next = rows[i + 1];
      r.complete = next ? next.begun : false;
      r.begun = r.complete;
    }

    // ③ 游標＝第一個尚未完成的 part。成立的前提是各軌首尾相接、嚴格照捲動順序排列
    //    （見各 ScrollTrigger 的 start/end：symbol 的 'top bottom' 就接在 hero pin 釋放那刻）。
    let cursor = 0;
    while (cursor < rows.length - 1 && rows[cursor]!.complete) cursor++;

    return rows.map((r, i) => ({
      chapter: r.chapter,
      index: r.index,
      part: r.part,
      address: r.address,
      state: (i < cursor ? 'done' : i === cursor ? 'live' : 'idle') as PartState,
      progress: r.progress,
      raw: r.raw,
      vh: r.vh,
    }));
  });

  /** 目前所在的 part */
  const current = computed(() => parts.value.find((p) => p.state === 'live')!);

  /** 下一個 part（序列末端為 null） */
  const next = computed(() => {
    const i = parts.value.findIndex((p) => p.state === 'live');
    return i >= 0 ? (parts.value[i + 1] ?? null) : null;
  });

  /** 完整地址字串：`forum.face.59%`（無 progress 的 part 省略百分比） */
  const address = computed(() => {
    const c = current.value;
    if (!c) return '';
    return c.progress === null
      ? c.address
      : `${c.address}.${Math.round(c.progress * 100)}%`;
  });

  /** 距離下一個 part 還有多少 vh（長度未知時為 null） */
  const toNextVh = computed(() => {
    const c = current.value;
    if (!c || c.vh === null || c.progress === null) return null;
    return c.vh * (1 - c.progress);
  });

  return { parts, current, next, address, toNextVh };
}
