import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// 每一個 <video> 的 src / poster 都不能在 SSR 標記裡出現。
//
// 為什麼：裝置（mob / pad / pc）只有 client 才知道，SSR 一律先當 pc。src 寫在 SSR 標記裡
// 的話，手機會先抓 pc 版的 metadata（約 45 KB）與整張 pc poster，掛載後才換成 mob ——
// 實測首頁與子頁各多 2–4 個 request，對限流來說每次都算。
// 修法：`:src="mounted ? videoSrc : undefined"`，mounted 在 onMounted 才翻 true。
const walk = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.vue')) out.push(full);
  }
  return out;
};

/**
 * 只剝掉語法上無歧義的兩種註解：HTML 註解 `<!-- -->` 與區塊註解 `/* *\/`。
 *
 * ⚠️ 刻意**不**剝 `//` 行註解——上一輪 review 已指出，全檔掃 `//` 會誤刪含協定相對
 * URL（例如 `//example.com/x.mp4`）之類的真 markup，那不是註解，砍掉等於扭曲掃描
 * 目標本身。`<!-- -->` 與 `/* *\/` 沒有這個問題：它們的起訖記號是固定字串，不會與
 * 真正的標籤或 URL 語法混淆。
 *
 * 為什麼要接回來：本檔曾經定義過這支函式但沒有任何呼叫端用它（`videoTags` 直接讀
 * 原始碼），後果是**註解散文裡提到的 `<video>` 會被當成標籤掃到**——實測
 * Hero.vue（3 處）、HeroStart.vue、SubpageIntroMedia.vue 共 5 處「幽靈標籤」，
 * 目前因為都不帶 `:src` 才僥倖通過；將來有人在註解裡示範一個帶 `:src` 的 `<video>`
 * 就會無故變紅。
 */
const stripComments = (src: string) =>
  src.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * 取出檔案裡每一個 <video> 開始標籤的完整內容（含跨行屬性）。
 *
 * ⚠️ 不能用 `<video\b[^>]*>` 這種「排除 `>` 的字元類別」寫法：GlitchImage.vue 的
 * <video> 標籤帶 `:ref="(el) => setVideoRef(el, i)"`，箭頭函式裡那個 `>` 落在**雙引號
 * 屬性值內部**，`[^>]*` 完全不管引號、看到它就提早收尾 —— 該檔的 :src 因此從沒被
 * 掃過，測試卻宣稱「全站每個 <video> 都守住」（2026-09 code review 抓到）。
 *
 * 這裡改成逐字元掃描、尊重引號：只有**不在字串內**時看到的 `>` 才算標籤結束；
 * 進了 `"` 或 `'` 就先吞掉直到對應的收尾引號，無論裡面有沒有 `>`。掃描前先過
 * stripComments，避免註解散文裡提到的 `<video>` 被當成真標籤。
 */
const videoTags = (rawSrc: string): string[] => {
  const src = stripComments(rawSrc);
  const out: string[] = [];
  const startRe = /<video\b/g;
  let m: RegExpExecArray | null;
  while ((m = startRe.exec(src))) {
    let i = m.index;
    let quote: string | null = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === '>') {
        i += 1; // 含收尾的 '>'
        break;
      }
    }
    out.push(src.slice(m.index, i));
    startRe.lastIndex = i; // 從標籤結束處繼續找下一個 <video>
  }
  return out;
};

// client-only 旗標允許清單：本測試真正要守的不變式是「有綁定的 :src / :poster 必須被
// 一個只有 client 才會為真的旗標擋住，false 分支要是 undefined」—— **不是**硬鎖
// `mounted` 這個字面字串。用允許清單而不是單一識別字，是因為不同元件的「什麼時候才
// 知道能載」天生不一樣（HeroVideo / UVid 是「掛載了沒」，GlitchImage 是「使用者互動
// 觸發了沒」），把它們都硬套同一個名字反而會逼出不誠實的程式碼。
// 新增別的 client-only 旗標時必須有意識地把它加進這份清單並補註解 ——
// 少了這一步，測試會大聲地紅（找不到旗標名稱），而不是靜默放行任何開頭字串。
const CLIENT_ONLY_GATES = [
  'mounted', // HeroVideo / UVid：onMounted 才翻 true，SSR 與 hydration 首次渲染一律是 false
  'started', // GlitchImage：使用者互動觸發 start() 才翻 true 的 lazy 開關，比 mounted 更晚才知道能載
];
const gateStart = new RegExp(`^(${CLIENT_ONLY_GATES.join('|')})\\s*(\\?|&&)`);
const endsUndefined = /:\s*undefined$/;

describe('<video> 的來源必須等掛載後才寫入', () => {
  const files = walk(join(__dirname, '..', 'app', 'components')).filter((f) => !f.includes('legacy'));

  it('每個 <video> 的 :src 與 :poster 都以 client-only 旗標守住，且沒有靜態 src=', () => {
    for (const file of files) {
      for (const tag of videoTags(readFileSync(file, 'utf8'))) {
        expect(tag, file).not.toMatch(/\ssrc=/);            // 靜態 src 一律不行
        expect(tag, file).not.toMatch(/\sposter=/);
        const src = tag.match(/:src="([^"]*)"/);
        if (src) {
          // 以允許清單裡的識別字開頭、後面接三元 `?` 或邏輯 `&&`（GlitchImage 的
          // poster 是選用 prop，天生要多一道「有沒有傳」的判斷，兩種形狀都算數，
          // 但 `||` 或把別的條件擺在旗標前面都不行 —— 旗標必須是第一道閘）。
          expect(src[1].trim(), file).toMatch(gateStart);
          // false 分支必須是 undefined，不能是 ''（空字串會讓瀏覽器仍發一個請求）。
          expect(src[1].trim(), file).toMatch(endsUndefined);
        }
        const poster = tag.match(/:poster="([^"]*)"/);
        if (poster) {
          expect(poster[1].trim(), file).toMatch(gateStart);
          expect(poster[1].trim(), file).toMatch(endsUndefined);
        }
      }
    }
  });

  it('至少掃到 HeroVideo、UVid、GlitchImage 三支 <video>，且擷取到的標籤內容完整（避免路徑寫錯或正規式退化讓測試空轉）', () => {
    // ⚠️ 只驗「有沒有抓到東西」（陣列非空）擋不住退化：舊版 `/<video\b[^>]*>/g` 對
    // GlitchImage 一樣會回傳長度 1 的陣列 —— 只是被箭頭函式的 `>` 截斷成
    // `<video … :ref="(el) =>` 這個殘缺片段，仍然「非空」（2026-09 re-review 實測
    // 驗證過）。故這裡改驗**內容**：擷取出來的標籤必須涵蓋到截斷點之後的部分。
    // GlitchImage 的 `:src=` 排在會截斷的 `:ref=` 箭頭函式**之後**，舊正規式的殘缺
    // 片段必然不含 `:src=`，新掃描器抓到的完整標籤則一定含 —— 這條斷言才會在
    // 正規式退化時真的變紅，而不是繼續靜默全綠。三個目標檔用同一條判準檢查，
    // 不特例化 GlitchImage。
    for (const name of ['HeroVideo.vue', 'UVid.vue', 'GlitchImage.vue']) {
      const file = files.find((f) => f.endsWith(name));
      expect(file, `找不到 ${name}`).toBeTruthy();
      const tags = videoTags(readFileSync(file!, 'utf8'));
      expect(tags.some((tag) => tag.includes(':src=')), `${name} 擷取到的 <video> 標籤都不含 :src=`).toBe(true);
    }
  });

  it('stripComments 剝掉 HTML／區塊註解裡的幽靈 <video>，但刻意保留 // 行註解裡的（見上方註解）', () => {
    // HTML 註解、區塊註解（含 JSDoc 的 /** */）裡提到的 <video> 現在會被濾掉：
    expect(videoTags('<!-- <video src="x"/> -->')).toEqual([]);
    expect(videoTags('/** 說明見 <video src="x"/> */')).toEqual([]);
    // `// <video src="x">` 這種行內註解則刻意不濾（理由見 stripComments 檔頭）：
    // 這裡仍然掃得到，是已知且經檢查為無害的殘留——2026-09 實測 Hero.vue:76,170,607、
    // HeroStart.vue:298 四處 // 註解裡的 <video> 字樣正是這種情況，且都不帶 :src/poster，
    // 所以不會觸發上面「靜態 src 一律不行」等斷言。真的有人在 // 註解裡示範一個帶
    // :src 的 <video> 才會讓那些斷言注意到——這是刻意的取捨，不是疏漏。
    expect(videoTags('// <video src="x">')).toHaveLength(1);
  });
});
