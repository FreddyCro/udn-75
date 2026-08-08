// 視窗高改版的基準量測探針（步驟 0）。
//
// 用途：在改動「視窗高從哪來」之前後各跑一次，比對每條捲動尺的幾何與進度映射。
// 這一層沒有任何自動化覆蓋（vitest 只跑純函式），而失效模式是「捲到某處進度差 6%」
// 這種肉眼看不出來的漂移 —— 所以先有量尺，再改東西。
//
// 怎麼跑：
//   1. 開 dev server，網址帶 ?pathdebug（gsap-debug-bridge 才會掛上 window.__udnST）
//   2. 把本檔整份貼進 devtools console，或由 Playwright 注入
//   3. await __vhProbe.snapshot()  → 回傳可 JSON.stringify 的量測結果
//   4. 存到 temp/vh-baseline/<標籤>.json
//
// 比對：__vhProbe.diff(before, after) 回傳有變化的欄位。
//
// ⚠️ 探針**不改變頁面狀態**，只有 snapshot() 會捲動；跑完會捲回原位。
//
// ── 實測筆記（2026-08-09，桌機 Chrome）────────────────────────────────
// 想在桌機上模擬「網址列收合」，直覺做法是用 Object.defineProperty 蓋掉
// window.innerHeight（讓 JS 看到小值、CSS 的 100vh 維持大值）。實測結果：
//
//   ・**我們自己**呼叫 innerHeight 的地方會跟著變 —— Hero 的兩條尺立刻縮短，
//     pin-spacer 少 72px，其下整份文件往上位移 72px。
//   ・**GSAP 內部**解析 'bottom bottom' 的視窗高**不受影響**。連同 documentElement
//     .clientHeight 一起蓋、再 refresh() 也一樣 —— 它的視窗高另有來源。
//
// 所以那個手法只能量到「我們自己的 innerHeight 呼叫」造成的那一半，量不到 GSAP
// 那一半。要量總靈敏度就得真的改視窗高（Playwright resize）—— 代價是 CSS 的 100vh
// 也會跟著動，與真機不同。兩種都不完美，**報數字時要講清楚是哪一種**。

(() => {
  const ST = () => window.__udnST;

  /** CSS 認為的 100vh —— 這才是 SCSS 那些 100vh 實際拿到的值。 */
  function cssVh() {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:fixed;top:-9999px;left:0;width:0;height:100vh;pointer-events:none;';
    document.body.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return h;
  }

  /** 視窗的三種高：CSS 的（lvh）、JS 的（dvh）、文件的。差值就是問題本身。 */
  function viewport() {
    const css = cssVh();
    return {
      cssVh: +css.toFixed(2),
      innerHeight: window.innerHeight,
      clientHeight: document.documentElement.clientHeight,
      // >0 代表 CSS 與 JS 對「一個視窗高」的認知不一致（行動裝置網址列展開時）
      cssMinusInner: +(css - window.innerHeight).toFixed(2),
      innerWidth: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      dpr: window.devicePixelRatio,
    };
  }

  /**
   * 由 trigger 元素推一個穩定標籤（ScrollTrigger 沒設 vars.id）。
   * ⚠️ 必須跳過 BEM 修飾詞（`--` 開頭的變體）—— 那些 class 會隨狀態開關
   * （`sec2__path--revealed` / `--debug`），拿它當標籤會讓同一條尺在前後兩份
   * 快照裡變成不同名字，diff 就會誤報「消失了」。實測踩過。
   */
  function labelOf(st, seen) {
    const el = st.trigger;
    let base = 'unknown';
    if (el && el.nodeType === 1) {
      const cls = (el.className || '')
        .toString()
        .trim()
        .split(/\s+/)
        .find((c) => c && !c.includes('--'));
      base = cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase();
    }
    const n = (seen[base] = (seen[base] ?? -1) + 1);
    return n ? `${base}#${n}` : base;
  }

  /**
   * 每條尺的幾何。span（＝ end − start）是核心指標：
   * 它就是「這段動畫有多少捲動距離可跑」，視窗高一變它就變。
   */
  function triggers() {
    const st = ST();
    if (!st) return { error: 'window.__udnST 不存在 —— 網址要帶 ?pathdebug' };
    const seen = {};
    return st.getAll().map((t) => ({
      label: labelOf(t, seen),
      start: +t.start.toFixed(2),
      end: +t.end.toFixed(2),
      span: +(t.end - t.start).toFixed(2),
      pinned: !!t.pin,
      // pin 撐出來的 spacer 高：pin 尺長改變時它會跟著改，是文件總高變動的來源
      pinSpacer: t.pin && t.pin.parentNode && t.pin.parentNode.classList.contains('pin-spacer')
        ? +t.pin.parentNode.getBoundingClientRect().height.toFixed(2)
        : null,
    }));
  }

  const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  /**
   * 進度映射：在整份文件上取 N 個絕對捲動位置，記下每條尺當下的 progress。
   * 這是最終要守住的不變量 —— 改完之後，同一個捲動位置該看到同一幀。
   */
  async function progressCurve(samples) {
    const st = ST();
    if (!st) return [];
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const out = [];
    for (let i = 0; i <= samples; i++) {
      const y = Math.round((i / samples) * max);
      window.scrollTo(0, y);
      await raf();
      const seen = {};
      out.push({
        scrollY: y,
        // 只記有在動的尺，全 0 / 全 1 的不佔篇幅
        p: st
          .getAll()
          .map((t) => [labelOf(t, seen), +t.progress.toFixed(4)])
          .filter(([, v]) => v > 0 && v < 1)
          .reduce((acc, [k, v]) => ((acc[k] = v), acc), {}),
      });
    }
    return out;
  }

  async function snapshot({ samples = 40, label = '' } = {}) {
    const restore = window.scrollY;
    const vp = viewport();
    const tg = triggers();
    const curve = await progressCurve(samples);
    window.scrollTo(0, restore);
    await raf();
    return { label, viewport: vp, triggers: tg, curve };
  }

  /** 只列出有差異的欄位。tol 是容許誤差（px / 進度）。 */
  function diff(a, b, tol = 0.5) {
    const out = { viewport: {}, triggers: [], curve: [] };
    for (const k of Object.keys(a.viewport)) {
      if (Math.abs(a.viewport[k] - b.viewport[k]) > 1e-9) {
        out.viewport[k] = [a.viewport[k], b.viewport[k]];
      }
    }
    const bByLabel = Object.fromEntries((b.triggers || []).map((t) => [t.label, t]));
    for (const t of a.triggers || []) {
      const u = bByLabel[t.label];
      if (!u) { out.triggers.push({ label: t.label, gone: true }); continue; }
      const d = {};
      for (const k of ['start', 'end', 'span', 'pinSpacer']) {
        if (t[k] === null && u[k] === null) continue;
        if (Math.abs((t[k] ?? 0) - (u[k] ?? 0)) > tol) d[k] = [t[k], u[k]];
      }
      if (Object.keys(d).length) out.triggers.push({ label: t.label, ...d });
    }
    for (let i = 0; i < Math.min(a.curve.length, b.curve.length); i++) {
      const d = {};
      // ⚠️ 只比**兩邊都有**的軌。curve 只收 0 < p < 1 的尺（見 progressCurve），
      // 所以「缺鍵」的意思是「這條尺此刻在區間外」，不是「進度變成 0」——
      // 當成 0 來比會生出 0.99 → 0 這種假差異（第一版踩過）。
      // 跨越邊界本身是真實變化，但它由 triggers 的 start/end 差異表達，不必在這裡重複報。
      for (const k of Object.keys(a.curve[i].p)) {
        if (!(k in b.curve[i].p)) continue;
        const x = a.curve[i].p[k];
        const y = b.curve[i].p[k];
        if (Math.abs(x - y) > 0.002) d[k] = [x, y];
      }
      if (Object.keys(d).length) out.curve.push({ scrollY: a.curve[i].scrollY, ...d });
    }
    return out;
  }

  window.__vhProbe = { snapshot, viewport, triggers, diff, cssVh };
})();
