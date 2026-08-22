// 換頁 leave 期間「舊頁被重畫」的回歸探針。
//
// 守的東西：首頁 → 子頁換頁時，畫面不可以閃一下滿版橘。
// 2026-08-22 的成因與逐幀量測見 ~/utils/scroll-trigger 的 killScrollTriggers；
// 一句話版本：Vue 在 layout 的 `out-in` 轉場中，**leave 一開始就跑完整棵舊子樹的
// beforeUnmount**，而舊頁還要在畫面上淡出 220ms —— 期間各元件收尾時 GSAP 的 revert
// 把 scrub 進度打回 0，而 0 那一格是滿版橘（融合拍 fromTo 的 from）。
//
// 怎麼跑：
//   1. 開 dev server，捲到智慧媒體的子頁清單（畫面上不該有橘）
//   2. 把本檔整份貼進 devtools console，或由 Playwright 注入
//   3. const done = __leaveProbe.arm()
//   4. 點任一列子頁連結（或 document.querySelectorAll('.media__row')[0].click()）
//   5. await done  → 回傳 { pass, ... }，pass 為 false 時 violations 列出兇手
//
// ⚠️ 為什麼不用逐幀 rAF 取樣（第一版就是那樣，被推翻）：dev 模式下換頁那一刻主執行緒
//    要編譯／執行子頁的 chunk，rAF 會被餓死好幾百 ms —— 實測 900ms 的視窗只取到 1 幀，
//    「沒看到橘」根本不能當通過。改成**事件驅動**：攔 style 寫入 ＋ 聽 scroll，
//    不論掉幾幀都不會漏掉任何一次寫入。正式 build 下不會餓死，但判定仍以此為準。
//
// ⚠️ 只攔 inline style 的三個屬性。GSAP 走的就是這條（autoAlpha ＝ opacity ＋
//    visibility，形變走 transform），CSS class 的切換不在守備範圍 —— 目前那條路上
//    唯一的底色（`.section3` 的 --outro-white）也是靠 inline CSS var 驅動的，見下方
//    EXTRA_TARGETS。

(() => {
  /** 會畫出橘的元素：兩者是同一個 GSAP tween 的兩個 target（融合拍交棒） */
  const TARGETS = ['[data-morph-veil]', '.media__morph'];
  /** 底色由 inline CSS var 驅動的段落：--outro-white 被打回 0 ＝ 白底硬切回橘 */
  const EXTRA_TARGETS = ['#blessing'];
  const WATCHED = ['visibility', 'opacity', 'transform'];

  /** 舊頁 DOM 撤場後多久算收工（ms）—— 只是保險，正常路徑靠元素離開文件收尾 */
  const TIMEOUT_MS = 8000;
  /** 文件高容許誤差（px）：子像素進位不算版面變動 */
  const DOC_H_EPS = 2;

  /** 這次寫入是不是「把它變得看得見」 */
  function makesVisible(prop, val) {
    if (prop === 'visibility') return val !== 'hidden' && val !== 'collapse';
    if (prop === 'opacity') return parseFloat(val) > 0;
    return false; // transform 只記錄，不單獨構成違規
  }

  const restores = [];
  const records = [];
  /** 這一輪被監看的元素（push 要即時問它們還在不在文件裡） */
  let watched = [];
  let t0 = 0;

  /** leave 進行到哪：舊 layout 根元素還在、且 opacity > 0 ＝ 使用者還看得見它 */
  function leaveOpacity() {
    const el = document.querySelector('[class*="page-fade-leave"], [class*="page-leave"]');
    return el ? parseFloat(getComputedStyle(el).opacity) : null;
  }

  /**
   * 舊頁的橘層此刻還在文件裡嗎 —— **判定的唯一界線**。
   *
   * ⚠️ 不可以改用「輪詢發現元素消失的時間」當界線（第一版就是那樣，誤報）：輪詢最多
   *    晚 30ms，而舊頁撤場後 Nuxt 的 scrollBehavior 正好在那個空窗回頂捲動一次 ——
   *    文件高當然變了（少了整個首頁），於是被誤判成違規。撤場後畫面上已經是子頁，
   *    那次捲動不可能被看見。改成**記錄當下**就問，界線就精確到單次寫入。
   */
  function stillAttached() {
    return watched.some((w) => document.contains(w.el));
  }

  function push(entry) {
    records.push({
      t: Math.round(performance.now() - t0),
      y: Math.round(window.scrollY),
      docH: document.documentElement.scrollHeight,
      leaveOpacity: leaveOpacity(),
      attached: stillAttached(),
      ...entry,
    });
  }

  function patch(el, label) {
    const proto = Object.getPrototypeOf(el.style);
    for (const prop of WATCHED) {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (!desc) continue;
      Object.defineProperty(el.style, prop, {
        configurable: true,
        get() {
          return desc.get.call(this);
        },
        set(val) {
          push({ kind: 'style', target: label, prop, val: String(val) });
          return desc.set.call(this, val);
        },
      });
      restores.push(() => delete el.style[prop]);
    }
  }

  /** `.section3` 的底色走 inline CSS var，不是上面那三個屬性 → 另外攔 setProperty */
  function patchCssVars(el, label) {
    const orig = el.style.setProperty.bind(el.style);
    el.style.setProperty = (prop, val, prio) => {
      if (prop.startsWith('--')) {
        push({ kind: 'cssvar', target: label, prop, val: String(val) });
      }
      return orig(prop, val, prio);
    };
    restores.push(() => {
      delete el.style.setProperty;
    });
  }

  function disarm() {
    while (restores.length) restores.pop()();
  }

  /**
   * 裝上探針並回傳一個 promise：舊頁的橘層離開文件（或逾時）後 resolve 成判定結果。
   * 裝好之後才點連結。
   */
  function arm() {
    disarm();
    records.length = 0;
    t0 = performance.now();

    watched = [];
    for (const sel of TARGETS) {
      const el = document.querySelector(sel);
      if (el) {
        patch(el, sel);
        watched.push({ sel, el });
      }
    }
    for (const sel of EXTRA_TARGETS) {
      const el = document.querySelector(sel);
      if (el) {
        patchCssVars(el, sel);
        watched.push({ sel, el });
      }
    }
    if (!watched.length) {
      return Promise.resolve({
        pass: false,
        reason: '找不到任何橘層 —— 是不是還沒捲到智慧媒體那一段？',
      });
    }

    const baseline = {
      y: Math.round(window.scrollY),
      docH: document.documentElement.scrollHeight,
    };
    const onScroll = () => push({ kind: 'scroll' });
    window.addEventListener('scroll', onScroll, { passive: true });
    restores.push(() => window.removeEventListener('scroll', onScroll));

    return new Promise((resolve) => {
      // setInterval 而非 rAF：rAF 在換頁那一刻會被餓死（見檔頭 ⚠️）
      // 這個輪詢只決定「什麼時候收工」，**不決定判定界線**（界線見 stillAttached）
      const timer = setInterval(() => {
        if (stillAttached() && performance.now() - t0 < TIMEOUT_MS) return;
        clearInterval(timer);
        const detachedBy = Math.round(performance.now() - t0);
        disarm();
        resolve(verdict(baseline, detachedBy));
      }, 30);
    });
  }

  function verdict(baseline, detachedBy) {
    // 只採計「舊頁的橘層當下還在文件裡」那些記錄 —— 撤場後畫面上已經是子頁
    const onScreen = records.filter((r) => r.attached);

    const violations = [];

    for (const r of onScreen) {
      if (r.kind === 'style' && makesVisible(r.prop, r.val)) {
        violations.push({
          why: `leave 期間把 ${r.target} 寫成看得見（${r.prop}: ${r.val}）`,
          ...r,
        });
      }
      // --outro-white 被打回 0 ＝ blessing 底色從白硬切回橘
      if (r.kind === 'cssvar' && r.prop === '--outro-white' && parseFloat(r.val) === 0) {
        violations.push({ why: `leave 期間把 ${r.target} 的底色打回橘`, ...r });
      }
      if (r.kind === 'scroll' && Math.abs(r.docH - baseline.docH) > DOC_H_EPS) {
        violations.push({
          why: `leave 期間文件高變了 ${r.docH - baseline.docH}px → 捲軸被 clamp，`
            + '其餘 scrub 尺會跟著倒帶',
          ...r,
        });
      }
    }

    return {
      pass: violations.length === 0,
      baseline,
      /** 收工時間（輪詢粒度 30ms）—— 診斷用，不是判定界線 */
      detachedBy,
      violations,
      // 全部記錄留著給人看：pass 的情況下這裡通常是空的，或只有 attached: false
      // 的那幾筆（舊頁撤場後 scrollBehavior 的回頂捲動，看不見）
      records,
    };
  }

  window.__leaveProbe = { arm, disarm, get records() { return records; } };
  return '__leaveProbe ready — 先 const done = __leaveProbe.arm()，再點子頁連結，然後 await done';
})();
