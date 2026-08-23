import type { Plugin } from 'vite';

/**
 * 把 CSS 產物裡「逐位元組完全相同」的 top-level `@font-face` 去重，只留第一次出現的那條。
 *
 * ## 為什麼需要這個
 *
 * `@nuxt/fonts` 的注入策略是「**每一個提到已註冊家族的 font-family 宣告點**，各注入一整組
 * 帶 unicode-range 的 `@font-face`」。而 `@udn-digital-center/common-components` 的 CSS
 * （58 KB，被 AppFooter import）在裡面把 `Noto Sans TC` 寫了 9 次、`Noto Serif TC` 寫了 3 次，
 * 於是同一組 subset 宣告被複製了 9／3 份：
 *
 *   Noto Sans TC   105 subset × 3 字重 × 9 個宣告點 = 2,835 條（相異只有 315 條）
 *   Noto Serif TC  108 × 3 個宣告點              =   324 條（相異只有 108 條）
 *   ─────────────────────────────────────────────────────────────────────
 *   實測 AppFooter.css：3,172 條 → 相異 436 條，3,327,444 B → 約 480 KB
 *
 * 而那支 CSS 被 Nuxt 掛成**每一頁 `<head>` 裡的 render-blocking `<link>`**，
 * gzip 後仍有 1.28 MB —— 是整個首頁 JS（gzip ~305 KB）的四倍。在效能差的手機上
 * 這筆下載會跟 hero 影片搶頻寬，是「跑完 loading 影片出不來」那條連鎖的第一環。
 *
 * ## 為什麼這樣做是安全的
 *
 * 1. 只比對**逐位元組完全相同**的區塊 —— 相同的 `@font-face` 重複宣告，CSS 語意上
 *    後者只是覆蓋前者成同一個結果，刪掉純屬無損。不做任何正規化或語意比對。
 * 2. 只處理 `depth === 0` 的區塊。巢在 `@media` / `@supports` 裡的 `@font-face`
 *    在不同條件下語意不同，不可跨層去重（實測目前產物 3,219 條全在 top level、
 *    0 條巢狀，此保護是為了將來）。
 * 3. 掃描時會跳過字串常值，避免 `url("...{...}")` 這類內容干擾 brace 深度計數。
 *
 * ⚠️ 這裡**不碰字體檔案本身**。227 支 woff2 靠 unicode-range 分片，瀏覽器只會抓用到的
 *    片段，那部分本來就是對的。壞的一直只有「宣告它們的 CSS」。
 */
export function dedupeTopLevelFontFace(css: string): string {
  const AT = '@font-face';
  // 先便宜地判斷：連兩條都沒有就不必掃。
  if (css.indexOf(AT) === -1) return css;

  const BACKSLASH = String.fromCharCode(92);
  const seen = new Set<string>();
  const out: string[] = [];
  let depth = 0;
  let quote = '';
  let i = 0;

  while (i < css.length) {
    const ch = css[i]!;

    // ── 字串常值：整段照抄，不參與 brace 計數 ──
    if (quote) {
      out.push(ch);
      if (ch === BACKSLASH && i + 1 < css.length) {
        out.push(css[i + 1]!);
        i += 2;
        continue;
      }
      if (ch === quote) quote = '';
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      out.push(ch);
      i += 1;
      continue;
    }

    // ── top-level @font-face：整塊取出、比對、決定留或丟 ──
    if (depth === 0 && css.startsWith(AT, i)) {
      let j = i + AT.length;
      while (j < css.length && /\s/.test(css[j]!)) j += 1;
      if (css[j] === '{') {
        const end = css.indexOf('}', j);
        if (end !== -1) {
          const block = css.slice(i, end + 1);
          if (seen.has(block)) {
            // 重複 → 整塊丟棄（含前面的 at-keyword）
            i = end + 1;
            continue;
          }
          seen.add(block);
          out.push(block);
          i = end + 1;
          continue;
        }
      }
    }

    if (ch === '{') depth += 1;
    else if (ch === '}') depth = Math.max(0, depth - 1);
    out.push(ch);
    i += 1;
  }

  return out.join('');
}

/**
 * Vite build plugin：對每一支輸出的 `.css` 資產跑 {@link dedupeTopLevelFontFace}。
 *
 * `enforce: 'post'` ＋ `generateBundle`：等 `@nuxt/fonts` 注入完、CSS 也 minify 完了才動手，
 * 這樣看到的就是最終產物，不必猜它的處理順序。
 *
 * ⚠️ 只涵蓋 Vite 輸出的 `_nuxt/*.css`。預算頁 `<head>` 內嵌的 `<style>` 由 Nitro 在
 *    prerender 階段吐出，不走這條 hook —— 那一份的重複來源是「宣告點數量」，
 *    對策是別在元件裡重新宣告家族名（見 AppHeader.vue 的註解）。
 */
export function dedupeFontFace(): Plugin {
  let saved = 0;
  let removed = 0;

  return {
    name: 'udn75:dedupe-font-face',
    apply: 'build',
    enforce: 'post',

    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset') continue;
        if (!chunk.fileName.endsWith('.css')) continue;

        const before =
          typeof chunk.source === 'string'
            ? chunk.source
            : Buffer.from(chunk.source).toString('utf8');
        const after = dedupeTopLevelFontFace(before);
        if (after.length === before.length) continue;

        chunk.source = after;
        saved += before.length - after.length;
        removed += 1;
      }
    },

    closeBundle() {
      if (!saved) return;
      // 這筆數字值得留在 build log 上：它是首頁關鍵路徑最大的單一變因，
      // 哪天升級 common-components 之後掉回 0，就是注入策略又變了。
      this.info?.(
        `dedupe-font-face: ${removed} 支 CSS 共省下 ${(saved / 1024).toFixed(0)} KB 重複的 @font-face`,
      );
    },
  };
}
