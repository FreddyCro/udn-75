<!--
  符號段的開場三行文案（Figma 智慧論壇05 的「內文」：
  pc 2065:139731 / pad 2065:124199 / mob 2065:120221）。

  ⚠️ 檔案放 01a.symbol/，但**渲染位置在 01.hero/Hero.vue 傳給 <HeroSymbolTransition> 的 slot 內**
     —— 那是 <SymbolFace> 唯一在場的地方（理由見 HeroSymbolTransition.vue 檔頭：轉場的
     「左右展開範圍內已可見粒子」要求粒子場在 hero 還被 pin 住時就滿版在場）。文字要疊在
     粒子場上、與它同生共死，就必須進同一個 slot。
     「目錄歸屬 ≠ 渲染位置」是本段的既定架構，SymbolScene.vue 檔頭有同樣的說明。

  ⚠️ 本層 absolute inset: 0 且**整個符號段（SYMBOL_VH ＝ 284vh）都在場** —— 從 hero 轉場就已經在視窗內了，
     所以「滑到位置」判不得用 IntersectionObserver 看自己，只能用 symbolProgress 的門檻。

  **兩把尺各管一半**（2026-08-26 改版，見 architecture/2026-08-26-symbol-intro-scroll-exit-design.md）：
    進場  吃**時間軸**：滑到 SYMBOL_INTRO.in 就自己跑完 2.0s（依序上浮 ＋ 逐字亂碼落定），
          停在原地不動也看得完整。symbolProgress 在這半段只當觸發器。
    停留  **無限長**：三行到位之後就停在全亮，不會自己消失。
    退場  吃**捲動**：SYMBOL_INTRO.exit → out 這段距離逐幀 scrub，捲多少退多少、
          往回捲文字會回來（退場沒有狀態，這正是它可逆的原因）。
  ⚠️ 這推翻了 2026-08-12 那版「連退場也吃時間軸」的結論（那版的 hold ＝ 3s 是在賭
     使用者三秒內讀完三行）。該版的進場、職責分工、reduce-motion 兩態退化仍然有效。

  **判斷全在純函式、本檔只有狀態與寫入**：進場曲線 symbolIntroLineAt()、退場曲線
  symbolIntroExitK() / symbolIntroExitAt()、合成 symbolIntroLineState()、閘門 symbolIntroGate()
  （皆在 ~/utils/orange-core-config，有單元測試）、亂碼 scrambleText()
  （~/utils/symbol-scramble，與 SymbolFace 的宮格彩蛋共用）。
  opacity / transform / textContent 都直接寫 DOM（不觸發 Vue re-render），同 HeroSymbolTransition 的 apply()。
-->
<script setup lang="ts">
import str from '~/locales/section1.json';

const { symbolProgress, reduceMotion } = useOrangeCoreProgress();

// 三行引言開始 reveal 的音效。state 是普通 let（不是 ref），故不走 useSfxCue 的
// watch，改在 onProgress() 內自己判邊緣 —— 判的是「elapsed 由 null 翻成 0」那一次。
const { play } = useSfx();

const rootRef = ref<HTMLElement | null>(null);
const lines = str.symbol.intro;
const TOTAL = symbolIntroTotal(lines.length);

// 逐幀要寫的三個值（每行的 opacity / transform / 亂碼字串）一律**直接寫 DOM**，
// 不經 Vue 響應式 —— 同 HeroSymbolTransition 的 apply()。
// 亂碼每幀重擲，走 vdom 的話等於每幀 diff 三個文字節點。
//
// ⚠️ 行元素在 onMounted 用 querySelectorAll 取一次，而不是 v-for 的 template ref 陣列：
//    Vue 明說 v-for 的 ref 陣列**不保證與來源順序一致**，而這裡的順序就是「第幾行」，
//    錯位會讓 stagger 亂掉。文案是靜態的（來自 locale JSON），查一次就夠。
let lineEls: HTMLElement[] = [];

// 進場時間軸的播放狀態（語意見 SymbolIntroState）。所有轉換都經 symbolIntroGate()，
// 本檔不自己判斷「該不該起播」。退場不在這裡 —— 它沒有狀態，每幀由 progress 直接算。
let state: SymbolIntroState = SYMBOL_INTRO_IDLE;
let raf = 0;
let lastFrame = 0;

// 最近一次的捲動進度。退場逐幀吃它，而 rAF 的 tick 拿不到 watch 的參數，故存一份。
// 初值 0 ＝ 還沒捲到 exit ⇒ 退場乘數為 1，掛載時的第一次 paint() 不會誤退。
let progress = 0;

// 單幀 delta 上限。切分頁時瀏覽器停掉 rAF，回來的第一幀 delta 會是好幾秒 ——
// clamp 之後 elapsed 在背景等於凍結、切回來從原處續播。
// 三行文案是**資訊**不只是質感，不能因為切了一下分頁就被跳過。
const MAX_DELTA = 100;

/** 把當前狀態寫進 DOM。冪等（純函式輸出），重複呼叫無副作用。 */
const paint = () => {
  const root = rootRef.value;
  if (!root) return;
  // SCSS 那個 opacity: 0 只為了「JS 沒跑起來時不露出半成品」，掛載後就交回逐行控制。
  // 根層不再承載任何乘數（保底清場已隨退場改吃捲動一起刪除，見 orange-core-config）。
  root.style.opacity = '1';
  for (let i = 0; i < lineEls.length; i++) {
    const { opacity, shift, reveal } = symbolIntroLineState(
      state,
      progress,
      i,
      lines.length,
      reduceMotion.value,
    );
    const el = lineEls[i]!;
    el.style.opacity = String(opacity);
    el.style.transform = `translateY(${shift}px)`;
    el.textContent = scrambleText(lines[i]!, reveal);
  }
};

const tick = (now: number) => {
  const delta = Math.min(MAX_DELTA, now - lastFrame);
  lastFrame = now;
  const { elapsed } = state;
  state = { elapsed: elapsed === null ? null : Math.min(TOTAL, elapsed + delta) };
  paint();
  raf = symbolIntroRunning(state, reduceMotion.value, lines.length)
    ? requestAnimationFrame(tick)
    : 0;
};

const run = () => {
  if (raf || !symbolIntroRunning(state, reduceMotion.value, lines.length)) return;
  lastFrame = performance.now();
  raf = requestAnimationFrame(tick);
};

// 捲動每動一次都會走這裡：閘門管進場時間軸的狀態轉換（只在門檻翻轉時真的動一次），
// 退場則是逐幀 scrub —— 所以這裡跟改版前不同，**不是**「狀態沒變就什麼都不做」。
const onProgress = (p: number) => {
  const prev = progress;
  progress = p;
  const next = symbolIntroGate(state, p, lines.length);
  // 整段只在起跑那一次出聲：elapsed 由 null（還沒開始）翻成 0（從頭播）。
  // ⚠️ 判 `=== 0` 而不是 `!== null`：越過 out 時閘門會把 elapsed 直接設成 TOTAL
  //    （見 symbolIntroGate），那一跳沒有任何東西在演，不該出聲。
  // 三行是逐行 reveal，但音只響一次 —— 音檔本身 2.3s，已經蓋過整段。
  // 減少動態時不出聲：那個模式下文字是直接落定的，沒有「跑」這回事。
  const started = state.elapsed === null && next.elapsed === 0;
  const changed = next !== state;
  state = next;
  if (started && !reduceMotion.value) play('aiFaceText');
  // 退場區間內每一幀都要重寫（scrub）；區間外退場乘數是常數（0 或 1），
  // 只有狀態真的變了才需要重畫 —— 否則整段 334vh 的每一次捲動都在白重擲亂碼。
  // ⚠️ 用 prev 一起判：從區間內一步跳出去（捲很快、或直接 anchor 跳轉）時，
  //    最後一幀必須落在區間端點的精確值上，不能停在跳出前那個半退狀態。
  const inExitRange = (q: number) =>
    q >= SYMBOL_INTRO.exit && q <= SYMBOL_INTRO.out;
  if (changed || inExitRange(p) || inExitRange(prev)) paint();
  run();
};

// watch 不能用 immediate：setup 階段 rootRef 還是 null，第一次要等 onMounted。
watch(symbolProgress, onProgress);
onMounted(() => {
  lineEls = Array.from(
    rootRef.value?.querySelectorAll<HTMLElement>('.symbol-intro__line') ?? [],
  );
  // ⚠️ 這裡讀 reduceMotion.value 時它已經是正確值，但**只是因為**本檔開頭
  //    useOrangeCoreProgress() 那一行比本元件更早呼叫 onMounted 去偵測
  //    prefers-reduced-motion —— Vue 的 onMounted 依註冊順序執行，兩者剛好卡對。
  //    這是隱性依賴，不是顯性保證：若那行被搬到生命週期鉤子之下，reduce-motion
  //    使用者會靜默地看到完整動畫首幀（見 useOrangeCoreProgress 對這件事的另一段說明）。
  paint();
  // 重新整理落在符號段中段時 symbolProgress 初值仍是 0（ScrollTrigger refresh 後才寫入
  // 真值 → 由 watch 接手），故這裡多半是 no-op；留著是為了不假設那個順序。
  onProgress(symbolProgress.value);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  raf = 0;
});
</script>

<template>
  <div ref="rootRef" class="symbol-intro" aria-hidden="true">
    <p v-for="(line, i) in lines" :key="i" class="symbol-intro__line">
      {{ line }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.symbol-intro {
  position: absolute;
  inset: 0;
  // 與 SymbolFace 的 .egg（彩蛋文字）同層。兩者不同時出現（彩蛋只在 face 拍、
  // 本層只在 disperse 拍），不會互相遮蓋。
  z-index: 2;
  display: grid;
  place-items: center;
  // 預設 align-content: stretch 會把三行攤到滿高；要的是整組置中。
  align-content: center;
  // ⚠️ 必要，不是保險：SymbolFace 的滑鼠斥力監聽掛在 canvas 上，而 HeroSymbolTransition
  //    特意為那顆 canvas 打開了 pointer-events: auto（見該檔 SCSS 末段）。
  //    本層若吃事件，畫面正中央那塊會變成互動死區。
  pointer-events: none;
  opacity: 0; // 進場前的初始值；掛載後由 JS 寫成 1，逐行的值才是真正在動的東西（見 paint）
  will-change: opacity;
}

.symbol-intro__line {
  margin: 0;
  // 進場前的初始值：在定位下方 INTRO_LINE_SHIFT(24px) 處、全透明。
  // 掛載後由 JS 逐幀覆寫；JS 沒跑起來時整組根層仍是 opacity 0，不會露出半成品。
  opacity: 0;
  transform: translateY(24px);
  color: var(--color-white-light);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-align: center;
  will-change: transform, opacity;
  // 對稿：mob 用 mob_論壇文字 22/44；pad 與 pc 共用 pc_論壇文字 24/48（＝ --text-unit），
  // 故只有一個斷點。mob 的 22/44 全庫僅此一處用到，不為它開 token。
  font-size: 22px;
  line-height: 44px;

  @include rwd-min('tablet') {
    font-size: var(--text-unit);
    line-height: var(--text-unit--line-height);
  }
}
</style>
