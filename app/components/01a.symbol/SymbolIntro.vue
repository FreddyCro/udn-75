<!--
  符號段的開場三行文案（Figma 智慧論壇05 的「內文」：
  pc 2065:139731 / pad 2065:124199 / mob 2065:120221）。

  ⚠️ 檔案放 01a.symbol/，但**渲染位置在 01.hero/Hero.vue 傳給 <HeroSymbolTransition> 的 slot 內**
     —— 那是 <SymbolFace> 唯一在場的地方（理由見 HeroSymbolTransition.vue 檔頭：轉場的
     「左右展開範圍內已可見粒子」要求粒子場在 hero 還被 pin 住時就滿版在場）。文字要疊在
     粒子場上、與它同生共死，就必須進同一個 slot。
     「目錄歸屬 ≠ 渲染位置」是本段的既定架構，SymbolScene.vue 檔頭有同樣的說明。

  進度來源與 SymbolScene 相同：自己讀 useOrangeCoreProgress 的 symbolProgress，不透過 props 接線。
  三行**依序向上淡入 + 逐字亂碼落定**，全部掛在 scrub 上（往回捲自動倒退）—— 不用時間軸：
  本段從粒子到底色到文案都是 scrub，混時間軸會出現「捲回去了、文字還在自己跑完」的不一致。
  opacity / transform / textContent 都直接寫 DOM（不觸發 Vue re-render），同 HeroSymbolTransition 的 apply()。
  曲線在 symbolIntroOutOpacity() / symbolIntroLine()（~/utils/orange-core-config，有單元測試）、
  亂碼在 scrambleText()（~/utils/symbol-scramble，與 SymbolFace 的宮格彩蛋共用），本檔只負責寫入。
-->
<script setup lang="ts">
import str from '~/locales/section1.json';

const { symbolProgress } = useOrangeCoreProgress();

const rootRef = ref<HTMLElement | null>(null);
const lines = str.symbol.intro;

// 逐幀要寫的三個值（每行的 opacity / transform / 亂碼字串）一律**直接寫 DOM**，
// 不經 Vue 響應式 —— 同本檔原本的 opacity 寫法與 HeroSymbolTransition 的 apply()。
// 亂碼每幀重擲，走 vdom 的話等於每幀 diff 三個文字節點。
//
// ⚠️ 行元素在 onMounted 用 querySelectorAll 取一次，而不是 v-for 的 template ref 陣列：
//    Vue 明說 v-for 的 ref 陣列**不保證與來源順序一致**，而這裡的順序就是「第幾行」，
//    錯位會讓 stagger 亂掉。文案是靜態的（來自 locale JSON），查一次就夠。
let lineEls: HTMLElement[] = [];

/** 只重擲亂碼字（rAF 迴圈每幀呼叫；opacity / transform 不在這裡動）。 */
const applyText = (p: number) => {
  for (let i = 0; i < lineEls.length; i++) {
    const { reveal } = symbolIntroLine(p, i, lines.length);
    lineEls[i]!.textContent = scrambleText(lines[i]!, reveal);
  }
};

/** 任一行正在落字（reveal 落在開區間 (0,1)）＝ 亂碼需要自轉。 */
const isScrambling = (p: number) =>
  lines.some((_, i) => {
    const { reveal } = symbolIntroLine(p, i, lines.length);
    return reveal > 0 && reveal < 1;
  });

// 亂碼的 rAF 閘門：watch(symbolProgress) 只在**捲動時**觸發，使用者停在窗內時
// 畫面會定格在半亂碼狀態，看起來像壞掉。故在落字期間自轉，落定或尚未進場就停。
// 捲出視窗時 progress 必然離開該窗、迴圈自己會停 —— 不需要另接 IntersectionObserver。
let scrambleRaf = 0;
const tick = () => {
  const p = symbolProgress.value;
  if (!isScrambling(p)) {
    scrambleRaf = 0;
    return;
  }
  applyText(p);
  scrambleRaf = requestAnimationFrame(tick);
};

const apply = (p: number) => {
  const el = rootRef.value;
  if (!el) return;
  // 根層只負責整組退場；進場是逐行的，寫在下面。
  el.style.opacity = String(symbolIntroOutOpacity(p));
  for (let i = 0; i < lineEls.length; i++) {
    const { opacity, shift } = symbolIntroLine(p, i, lines.length);
    const lineEl = lineEls[i]!;
    lineEl.style.opacity = String(opacity);
    lineEl.style.transform = `translateY(${shift}px)`;
  }
  applyText(p);
  if (!scrambleRaf && isScrambling(p)) scrambleRaf = requestAnimationFrame(tick);
};

// watch 不能用 immediate：setup 階段 rootRef 還是 null，第一次要等 onMounted。
watch(symbolProgress, apply);
onMounted(() => {
  lineEls = Array.from(
    rootRef.value?.querySelectorAll<HTMLElement>('.symbol-intro__line') ?? [],
  );
  apply(symbolProgress.value);
});
onBeforeUnmount(() => cancelAnimationFrame(scrambleRaf));
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
  opacity: 0; // 進場前的初始值；掛載後由 JS 依 symbolProgress 逐幀寫入（見 apply）
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
