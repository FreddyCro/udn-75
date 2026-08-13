import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import section2 from '../app/locales/section2.json';

// vitest 沒設 alias（見 vitest.config.ts），故一律相對路徑 import；
// 檔案路徑相對 cwd（＝專案根，同 design-tokens.spec.ts 的做法）。
//
// 這支守的是「素材與文案對得上」。失敗方向本來就溫和 —— 素材缺檔只會讓
// 那一行看不見（真文字仍在、行盒仍由 ZWSP 撐住），所以缺檔在畫面上是靜默的，
// 只有這支會爆。機制見 architecture/2026-08-12-forum1-text-art-design.md

// 稿字形素材的一筆（＝ app/types/forum.ts 的 ForumTextArt）。
// 這裡刻意不 import 那個型別：要驗的正是「JSON 長得對不對」，
// 拿型別來斷言等於用假設驗假設。
type ArtSrc = { src: string; w: number; h: number };
type Art = { text: string; art: Record<string, ArtSrc> };

const BPS = ['pc', 'pad', 'mob'];

const isArt = (v: unknown): v is Art =>
  typeof v === 'object'
  && v !== null
  && !Array.isArray(v)
  && typeof (v as Art).text === 'string'
  && typeof (v as Art).art === 'object'
  && (v as Art).art !== null;

/** 深走訪整棵 JSON，撈出所有物件形式的「一行」 */
const collectArts = (node: unknown, out: Art[] = []): Art[] => {
  if (isArt(node)) {
    out.push(node);
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((n) => collectArts(n, out));
    return out;
  }
  if (typeof node === 'object' && node !== null) {
    Object.values(node).forEach((n) => collectArts(n, out));
  }
  return out;
};

/** 從 SVG 取畫布尺寸：優先 viewBox，退回 width/height 屬性 */
const svgSize = (src: string): { w: number; h: number } => {
  const vb = src.match(/viewBox="([\d.\s-]+)"/);
  if (vb?.[1]) {
    const nums = vb[1].trim().split(/\s+/).map(Number);
    return { w: nums[2]!, h: nums[3]! };
  }
  return {
    w: Number(src.match(/\bwidth="([\d.]+)"/)?.[1]),
    h: Number(src.match(/\bheight="([\d.]+)"/)?.[1]),
  };
};

const arts = collectArts(section2);
// 攤平成 (斷點, 素材) —— 逐筆斷言用
const entries = arts.flatMap((a) =>
  Object.entries(a.art).map(([bp, src]) => ({ text: a.text, bp, src })),
);

describe('論壇稿字形素材（ForumTextArt）與 section2.json 對帳', () => {
  // 這一道是「別的斷言別被空陣列蒙過去」的守門員：
  // 若哪天論壇一的 title 被改回純字串，下面的 it.each 會一條都不跑而全綠。
  it('至少有三筆素材（論壇一的大標 ＋ 副標兩行）', () => {
    expect(entries.length).toBeGreaterThanOrEqual(3);
  });

  it('每一筆都有真文字（SEO / SR 的唯一來源）', () => {
    const empty = arts.filter((a) => a.text.trim().length === 0);
    expect(empty).toEqual([]);
  });

  it('每一筆至少填一個斷點 —— art: {} 會讓那一行永遠是活文字，是資料錯誤', () => {
    const noBp = arts.filter((a) => Object.keys(a.art).length === 0).map((a) => a.text);
    expect(noBp).toEqual([]);
  });

  it('斷點名稱只能是 pc / pad / mob（拼錯會靜默沒有效果）', () => {
    const bad = entries.filter((e) => !BPS.includes(e.bp)).map((e) => `${e.text} → ${e.bp}`);
    expect(bad).toEqual([]);
  });

  it.each(entries.map((e) => [`${e.bp} ${e.src.src}`, e] as const))(
    '%s 的素材與資料對得上',
    (_name, e) => {
      const file = join('public', e.src.src.replace(/^\//, ''));
      expect(existsSync(file), `素材不存在：${file}`).toBe(true);

      // w / h 拿來算 em 寬與預留空間；與素材畫布不一致就會擠壓或留白
      const size = svgSize(readFileSync(file, 'utf8'));
      expect(size.w).toBeCloseTo(e.src.w, 2);
      expect(size.h).toBeCloseTo(e.src.h, 2);
    },
  );
});

// ── 日期大字（dateArt）─────────────────────────────────────────────────────
// 與上面那組分開驗，因為它的形狀不同：**沒有 text 欄位**（真文字是從
// year / date / weekday 組出來的，見 ForumEvent.vue 的 dateLines），所以 collectArts
// 撈不到它，得自己走一遍。
//
// 這一組的失敗方向比別的群組**嚴重**：星期的圓框烤在素材裡，缺哪個斷點那個斷點就
// 只剩沒有圓框的活文字 —— 所以這裡要求三個斷點全滿，不接受部分覆蓋。
type DateEvent = {
  no: string;
  layout: string;
  dateArt?: Record<string, ArtSrc>[];
};

const { events, event4 } = section2.forum as unknown as {
  events: DateEvent[];
  event4: DateEvent;
};
// ⚠️ 論壇四不在 events 裡（它排在議程之後、不屬於 .sec2__path，見 Forum.vue）——
//    只掃 events 會漏掉第四場而全綠。
const dateEvents = [...events, event4];

describe('日期大字的稿字形素材（dateArt）', () => {
  it('四場都在（漏掉論壇四是這支最容易犯的錯）', () => {
    expect(dateEvents.map((e) => e.no)).toEqual(['論壇一', '論壇二', '論壇三', '論壇四']);
  });

  it.each(dateEvents.map((e) => [e.no, e] as const))('%s 的行數對得上版式', (_no, ev) => {
    // 行數由資料決定、元件照著切真文字（2 行 → 「2026」／「09/09 三」，
    // 3 行 → 「2026」／「09」／「15 二」）。階梯式（論壇二）是三階，其餘兩行。
    expect(ev.dateArt?.length).toBe(ev.layout === 'stair' ? 3 : 2);
  });

  it.each(dateEvents.map((e) => [e.no, e] as const))('%s 的每一行都填滿三個斷點', (_no, ev) => {
    const missing = (ev.dateArt ?? []).map((line, i) =>
      BPS.filter((bp) => !line[bp]).map((bp) => `第 ${i + 1} 行缺 ${bp}`),
    );
    expect(missing.flat()).toEqual([]);
  });

  it.each(
    dateEvents.flatMap((ev) =>
      (ev.dateArt ?? []).flatMap((line, i) =>
        Object.entries(line).map(
          ([bp, src]) => [`${ev.no} 第 ${i + 1} 行 ${bp}`, src] as const,
        ),
      ),
    ),
  )('%s 的素材與資料對得上', (_name, src) => {
    const file = join('public', src.src.replace(/^\//, ''));
    expect(existsSync(file), `素材不存在：${file}`).toBe(true);
    const size = svgSize(readFileSync(file, 'utf8'));
    expect(size.w).toBeCloseTo(src.w, 2);
    expect(size.h).toBeCloseTo(src.h, 2);
  });
});
