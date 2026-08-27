import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// 全站只有 hero 影片可以有聲，**其他每一支 <video> 都無條件靜音**。
//
// 為什麼要用測試守：
//   1. 瀏覽器政策 —— 非靜音的自動播放只有在「play() 發生於使用者手勢之內」才允許。
//      hero 影片的播放綁在 start 按鈕那一下點擊上（＝手勢內），過得了；其餘影片的
//      播放都由捲動／可見性驅動，**捲動不算手勢**，一律會被擋。
//   2. 而且是靜默失敗 —— play() 的 rejection 被吞掉、watcher 只在值變化時才跑
//      ⇒ 沒有重試，一次被擋就整段黑到底。實測 /visual（390×844、Chrome 的
//      document-user-activation-required 政策）：媒體拍已啟動、readyState 4，
//      但 paused: true / currentTime: 0，只留下一筆 NotAllowedError。
//   3. 音效開關（useAppSound 的 soundOn）是全站共享狀態，且 hero 的 start 閘門與
//      AppHeaderSound 兩處都能打開它 —— 任何「影片的 muted 跟隨 soundOn」的寫法，
//      都會讓那支影片在使用者開過音效之後永遠不播。這正是它被拿掉的原因。
//
// 寫法沿用 viewport-height.spec.ts（掃原始碼 ＋ 白名單）。

/** 唯一允許有聲的影片：hero。它的 muted 由 useAppSound 驅動，播放綁在 start 那一下點擊。 */
const SOUND_ALLOWED = ['app/components/01.hero/HeroVideo.vue'];

const walk = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.vue')) out.push(full);
  }
  return out;
};

const stripComments = (src: string) =>
  src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

/**
 * 取出檔案裡每一個 <video> **開始標籤**的完整內容（含跨行屬性）。
 *
 * `<video` 後面要求一個空白字元：註解與說明文字裡寫的是字面的 `<video>`（無屬性），
 * 那些不是標籤、不該被當成違規。跨行是常態（本專案的 <video> 屬性都分行寫）。
 *
 * ⚠️ 屬性值要先整段吃掉再找 `>`，不能簡單用 `[^>]*` —— 屬性值裡有箭頭函式時
 *    （`:ref="(el) => setVideoRef(el, i)"`）那個 `>` 會讓標籤在中途被截斷，
 *    後面的 muted 就掃不到，測試會吐出假警報。
 */
const videoTags = (src: string): string[] =>
  [...stripComments(src).matchAll(/<video\s(?:"[^"]*"|'[^']*'|[^>])*>/g)].map((m) => m[0]);

describe('全站影片一律靜音（hero 除外）', () => {
  const files = walk('app').map((f) => ({
    rel: relative('.', f).split(sep).join('/'),
    src: readFileSync(f, 'utf8'),
  }));

  // 白名單腐爛防線：hero 影片被搬走／改名時，這條先失敗，而不是讓白名單默默放行不存在的檔。
  it('白名單裡的檔案都還存在，且真的含 <video> 標籤', () => {
    const bad = SOUND_ALLOWED.filter((p) => {
      const f = files.find((x) => x.rel === p);
      return !f || videoTags(f.src).length === 0;
    });
    expect(bad).toEqual([]);
  });

  it('每一支 <video> 都帶靜態 muted 屬性', () => {
    const report: string[] = [];
    for (const { rel, src } of files) {
      if (SOUND_ALLOWED.includes(rel)) continue;
      for (const tag of videoTags(src)) {
        // 靜態 muted＝屬性名單獨出現（不是 :muted / v-bind:muted / muted="..."）
        if (!/(^|\s)muted(\s|>)/.test(tag)) {
          report.push(`${rel} 的 <video> 少了靜態 muted`);
        }
      }
    }
    expect(report).toEqual([]);
  });

  it('沒有任何 <video> 把 muted 綁成反應式的值', () => {
    const report: string[] = [];
    for (const { rel, src } of files) {
      if (SOUND_ALLOWED.includes(rel)) continue;
      for (const tag of videoTags(src)) {
        if (/(:muted|v-bind:muted)/.test(tag)) {
          report.push(`${rel} 的 <video> 把 muted 綁成變數 —— 靜音必須是無條件的`);
        }
      }
    }
    expect(report).toEqual([]);
  });

  // UVid 是全站唯一的通用影片元件。它一度讓 muted 預設跟隨 soundOn，
  // 那就是 subpage intro media 在手機上不播的根因 —— 不要再接回去。
  it('UVid 不再依賴全站音效開關（useAppSound）', () => {
    const uvid = files.find((x) => x.rel === 'app/components/UVid.vue');
    expect(uvid, '找不到 app/components/UVid.vue').toBeTruthy();
    expect(stripComments(uvid!.src)).not.toMatch(/useAppSound|soundOn/);
  });
});
