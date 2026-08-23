<script setup lang="ts">
import str from '@/locales/common.json';
import logoUrl from '@/assets/img/logo.svg';
import { PC_BREAKPOINTS, SUBPAGE_HEADER_ANCHOR } from '@/utils/constants';
import {
  pickHeaderTheme,
  type HeaderTheme,
  type ThemeSpan,
} from '@/utils/header-theme';
import { pickActiveAnchor } from '@/utils/anchor-spy';
import { anchorLanding, anchorOffsetVh } from '@/utils/anchor-landing';
import { requestHomeRestart, resolveHomeIntent } from '@/utils/home-intent';
import type { HeaderAnchor } from '@/types/header';

/**
 * AppHeader — 底色隨捲動段落切換白／黑／橘（見 data-header-theme、updateTheme）。
 * - ≥1280：logo 靠左 ＋ AppHeaderNav 錨點列 ＋ 音效 ＋ share，合併於頂部單一列。
 * - <1280：頂部 navbar（logo 置中／靠左 ＋ 音效 ＋ 漢堡）＋ 漢堡開啟 AppHeaderMenu 全螢幕選單。
 * - 頂部閱讀進度條（橘色進度 / 淺藍底軌）。
 * - 轉場開窗時，窗內那一段反白（見下方 layers 與 useHeaderBand）。
 */

const props = defineProps({
  /**
   * 是否啟用「捲過 hero 才顯示」的自動隱藏行為。
   * - true（預設）：首頁等有 #app-hero 的頁面；hero 完全捲離視窗後 header 才滑入。
   * - false：其他頁（無 hero）；header（含進度條）自始常駐顯示，不監看 hero。
   */
  autoHide: { type: Boolean, default: true },
});

const route = useRoute();
const { play } = useSfx();

// 錨點列首頁與子頁共用；只在 ≥1280 顯示（由 AppHeaderNav 自己的 CSS 決定，不必在此判斷）。
// 子頁量不到 #forum / #blessing / #media 這些段落 → activeTarget 恆為 ''，
// 故改用 navActiveTarget：子頁一律標成 SUBPAGE_HEADER_ANCHOR（見該常數的說明）。
const navActiveTarget = computed(() =>
  route.path === '/' ? activeTarget.value : SUBPAGE_HEADER_ANCHOR,
);

// logo 的目的地與點擊行為都由 resolveHomeIntent 決定（單一判定來源）。
// 原本這裡用 runtimeConfig 的 APP_URL（絕對網址）+ 原生 <a>，那是整頁重載 ——
// 首頁所有 section 重新 mount、全部 ScrollTrigger 重建。子頁改走 NuxtLink 後
// baseURL 由 router 自己套，子路徑部署（GitHub Pages 的 /udn-75/）不必再靠絕對網址。
const homeIntent = computed(() => resolveHomeIntent(route.path === '/'));
const { restartOpening, isGone, restartIntent } = useHeroVideo();
// 錨點落點要換算「段落宣告的深度（× 視窗高）」，見 scrollToTarget。
const { vhPx } = useViewportHeight();

const router = useRouter();
// 原生 <a> 的 href 要自己套 router base：子路徑部署（GitHub Pages 的 /udn-75/）下
// 直接寫 "/" 會連到網域根 —— 那正是這支 logo 原本用絕對網址要避開的事，
// 中鍵／Ctrl 點擊會真的走到它。router.resolve() 回傳的 href 已含 base。
const logoHref = computed(() => router.resolve(homeIntent.value.to).href);

const progress = ref(0);
// 幾何 scroll-spy 推導出來的錨點（下方 IntersectionObserver 寫入）。
const spyTarget = ref<string>('');
// 段落主動宣告的錨點**優先於**幾何判定。幾何 spy 假設「段落在文件流裡的位置 ＝ 它在畫面上
// 的位置」，那對 fixed 滿版視覺的段落不成立（01a.symbol 只是一把捲動尺）——
// 那種段落自己有尺、知道自己何時開演，見 ~/composables/useAnchorClaim。
// header 照舊不認得任何 section：它只讀「有沒有人宣告」，不知道宣告者是誰。
const { anchorClaim } = useAnchorClaim();
const activeTarget = computed(() => anchorClaim.value ?? spyTarget.value);
const menuOpen = ref(false);
const theme = ref<HeaderTheme>('light');
let themeEls: HTMLElement[] = [];
// hero 是否已完全捲離視窗（由下方 heroObserver 寫入）。autoHide=false 時無人監看，
// 直接視為 true —— 那些頁面根本沒有 #app-hero。
const heroOut = ref(!props.autoHide);

// header 是否顯示。autoHide=false 時恆為 true（含 SSR），避免子頁載入時的滑入動畫。
//
// autoHide=true（首頁）有兩個顯示條件，任一成立即顯示：
//   heroOut  hero 完全捲離視窗 —— 原本的唯一條件。
//   isGone   影片退場結束。2026-08-16 起 .sec1__hero 是 sticky 且高 2.05 個視窗，
//            「完全捲離視窗」要到 scrollY 4000 以上才成立（實測 1440×900 約 4223），
//            整段引言與轉場都還看不到 header。設計要的是「影片一消失 header 就在」，
//            那正是 gone，故直接讀狀態，不再另外量幾何。
//   ⚠️ 影片重新回到畫面上（logo 就地重播／回捲到頂端 restart）時 isGone 轉 false，header 會跟著收回去 ——
//      這是對的：那時影片又回到畫面上了。
const isVisible = computed(
  () => !props.autoHide || heroOut.value || isGone.value,
);
const anchors = str.headerAnchors as HeaderAnchor[];
// logo 的替代文字與漢堡的 aria-label 一律走文案檔（locales/common.json 的 header），
// 元件內不寫死中文 —— 校稿時只需要改 JSON。
// 刻意不取名 header：模板根節點是 <header>，同名讀起來會混淆（原生標籤不受影響，純為可讀性）。
const labels = str.header;

let observer: IntersectionObserver | null = null;
let heroObserver: IntersectionObserver | null = null;
let docObserver: ResizeObserver | null = null;
let mqPc: MediaQueryList | null = null;
let rafId = 0;
let heroRafId = 0;

// 放大到 ≥1280 時漢堡與選單都 display:none，menuOpen 若還留著 true，選單的捲動鎖
// （AppHeaderMenu 的 .is-menu-locked）就沒人來解 → 整頁鎖死且看不到能關的 UI。
function closeMenuOnPc(e: MediaQueryListEvent) {
  if (e.matches) menuOpen.value = false;
}

onMounted(() => {
  updateProgress();
  themeEls = Array.from(
    document.querySelectorAll<HTMLElement>('[data-header-theme]'),
  );
  spans = themeEls.map((el) => ({
    top: 0,
    bottom: 0,
    theme: (el.dataset.headerTheme ?? 'light') as HeaderTheme,
  }));
  updateTheme();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  // 文件高度變了就讓 scrollTotal 失效（見 updateProgress）。RO 只在真的變動時才發，
  // 遠比每幀讀一次 scrollHeight 便宜
  docObserver = new ResizeObserver(invalidateDocMetrics);
  docObserver.observe(document.documentElement);
  docObserver.observe(document.body);

  mqPc = window.matchMedia(`(min-width: ${PC_BREAKPOINTS}px)`);
  mqPc.addEventListener('change', closeMenuOnPc);

  // scroll-spy：以各區塊在視窗中央的可見度決定「當前錨點」。
  // 觀察對象有兩種來源：錨點本體的 id，以及用 data-anchor-target 宣告「我屬於哪個錨點」
  // 的前導段落 —— 01a.symbol 是論壇章節的開場（Figma 智慧論壇05–08）且高達 SYMBOL_VH 個
  // 視窗高，不納進來的話 header 一滑入就有整整數個螢幕高沒有任何錨點是 active。
  // 宣告權在段落自己（同 data-header-theme 的分工），header 不認得任何 section class。
  const anchorOrder = anchors.map((a) => a.target);
  const sectionTargets = new Map<HTMLElement, string>();

  anchors.forEach((a) => {
    const el = document.getElementById(a.target);
    if (el) sectionTargets.set(el, a.target);
  });
  document
    .querySelectorAll<HTMLElement>('[data-anchor-target]')
    .forEach((el) => {
      const target = el.dataset.anchorTarget;
      if (target && anchorOrder.includes(target)) sectionTargets.set(el, target);
    });

  if (sectionTargets.size) {
    // 維護「目前與中央帶重疊的區塊」集合，再由它推導 activeTarget。
    // 只在 isIntersecting 時設值（不處理離開）會讓錨點永遠停在第一個曾命中的區塊上：
    // hero 期間 ScrollTrigger 還沒建立 pin spacer，文件較短、#forum 位置偏高會誤觸一次，
    // 之後就再也清不掉 —— 表現就是 hero 時「論壇」已經是 active。
    //
    // 集合存元素而非 target 字串：symbol 與 #forum 共用 'forum'，交界處兩段會同時落在
    // 中央帶，存字串的話 symbol 離開時會把還在場的 #forum 一起刪掉、錨點閃斷一下。
    const visible = new Set<HTMLElement>();
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(el);
          else visible.delete(el);
        });
        // 同時命中兩區塊時取文件順序較前者（＝ anchors 的順序）。
        spyTarget.value = pickActiveAnchor(
          anchorOrder,
          sectionTargets,
          visible,
        );
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    sectionTargets.forEach((_, el) => observer?.observe(el));
  }

  // autoHide=false 的頁面：header 常駐顯示（isVisible 初始已為 true），不需監看 hero。
  if (props.autoHide) {
    // header 顯示時機：觀察 Section1 hero，hero「完全」捲離視窗後才滑入
    // （threshold: 0 → 與視窗零交集時 isIntersecting 為 false，此時才顯示）。
    // 找不到 hero 時先重試數幀，避免頁面內容尚未掛載（掛載順序 / dev HMR）就誤判並提前顯示 header。
    let heroRetries = 0;
    const setupHeroObserver = () => {
      const hero = document.getElementById('app-hero');
      if (hero) {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry) heroOut.value = !entry.isIntersecting;
          },
          { threshold: 0 },
        );
        heroObserver.observe(hero);
        return;
      }
      if (heroRetries < 10) {
        heroRetries += 1;
        heroRafId = window.requestAnimationFrame(setupHeroObserver);
        return;
      }
      // 連續數幀仍找不到 hero → 保底直接顯示。
      heroOut.value = true;
    };
    setupHeroObserver();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  mqPc?.removeEventListener('change', closeMenuOnPc);
  if (rafId) window.cancelAnimationFrame(rafId);
  if (heroRafId) window.cancelAnimationFrame(heroRafId);
  observer?.disconnect();
  heroObserver?.disconnect();
  docObserver?.disconnect();
});

// 頂部固定列的高度（用於錨點捲動時的偏移補償），從 CSS variable --header-height 取得。
//
// 快取：getComputedStyle() 會強制 style flush，而這支原本每個捲動幀都被 updateTheme
// 呼叫一次。--header-height 只隨斷點變（媒體查詢），捲動中是常數 → 失效點只有 resize。
let headerOffsetPx: number | null = null;
function getHeaderOffset() {
  if (headerOffsetPx === null) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(
      '--header-height',
    );
    headerOffsetPx = parseFloat(raw) || 0;
  }
  return headerOffsetPx;
}

// 可捲動總距離。scrollHeight 是**強制整份文件 layout** 的讀取，同樣不該每幀來一次；
// 它只在版面真的變高變矮時才變 → 交給下方的 ResizeObserver 與 resize 標記失效。
// （pin-spacer 撐開、Media 的 hold buffer 寫入、字體載入後重排，全都會改到 body
// 的高度，RO 都收得到 —— 不必去認識 ScrollTrigger 的 refresh 事件。）
let scrollTotal = -1;
function invalidateDocMetrics() {
  scrollTotal = -1;
}

function updateProgress() {
  if (scrollTotal < 0) {
    scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  }
  progress.value =
    scrollTotal > 0 ? Math.min(100, (window.scrollY / scrollTotal) * 100) : 0;
}

// 偵測線＝header 底緣。段落用 data-header-theme 宣告顏色，子頁不標 → 回落 light。
// spans 預先配置、逐幀就地覆寫：元素數量固定（章節數），原本每幀重配一個陣列與
// 每個章節一個物件字面值。rect 本身沒得快取 —— 它隨捲動變，那正是這支要問的事。
let spans: ThemeSpan[] = [];
function updateTheme() {
  const headerBottom = getHeaderOffset();
  for (let i = 0; i < themeEls.length; i++) {
    const el = themeEls[i]!;
    const r = el.getBoundingClientRect();
    const span = spans[i]!;
    span.top = r.top;
    span.bottom = r.bottom;
    span.theme = (el.dataset.headerTheme ?? 'light') as HeaderTheme;
  }
  theme.value = pickHeaderTheme(spans, headerBottom);
}

function onScroll() {
  if (rafId) return;
  rafId = window.requestAnimationFrame(() => {
    updateProgress();
    updateTheme();
    rafId = 0;
  });
}

// resize 走自己的入口：斷點可能換了（--header-height）、視窗高也變了（scrollTotal）
function onResize() {
  headerOffsetPx = null;
  invalidateDocMetrics();
  onScroll();
}

// 錨點列與漢堡選單的就地捲動。落點的算式不在這裡 —— 段落可以宣告
// data-anchor-offset-vh 把落點推進段落內某一刻（`#blessing` 就是這樣落在「笑臉逐格
// 走完」那一格），見 ~/utils/anchor-landing。header 只負責量與捲。
function scrollToTarget(target: string, e?: Event) {
  const el = document.getElementById(target);
  if (!el) return;
  e?.preventDefault();
  const { top } = anchorLanding({
    elementTop: el.getBoundingClientRect().top + window.scrollY,
    headerOffset: getHeaderOffset(),
    offsetVh: anchorOffsetVh(el.dataset.anchorOffsetVh),
    // 凍結值而非 window.innerHeight：宣告的深度是一把捲動尺上的位置，而那些尺全部
    // 以 --vh 為單位（見 ~/composables/useViewportHeight），兩邊必須同一把尺。
    vh: vhPx(),
  });
  window.scrollTo({ top, behavior: 'smooth' });
}

function scrollToTop(e?: Event) {
  e?.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// logo：回到最開始 ＝ 從頭重播整支 hero 影片（2026-08-22 起，見 useHeroVideo 的 restartOpening）。
// 首頁就地重播（不換頁），子頁設起 restartIntent 再交給 NuxtLink 導航到 `/`（不帶 hash）。
function onLogoClick(e: MouseEvent) {
  // 修飾鍵點擊（Ctrl／⌘／Shift／Alt）是「開新分頁／新視窗」的意圖，一律放行給瀏覽器 ——
  // 攔下來會讓使用者按了沒反應。中鍵在現代瀏覽器發的是 auxclick，本來就不會進來。
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  play('sfx01');

  // 選單開著時 logo 仍可點：.app-header__bar-wrap 的 z-index 2 疊在面板（z-index 1）之上。
  // 就地倒帶不換頁 → 面板不會自己消失，.is-menu-locked 也還鎖著 html/body，
  // 使用者會看到「按了 logo，選單沒關、頁面鎖死」。
  menuOpen.value = false;

  if (homeIntent.value.action !== 'in-page') {
    // 子頁：讓 NuxtLink 走，但先設起「這次要從頭重播」的旗子（Hero 在 setup 內消耗一次）。
    // 必須排在修飾鍵那道 return 之後：⌘／Ctrl 點擊是開新分頁，那個分頁不該重播（旗子也活
    // 不過整頁載入）。中鍵發的是 auxclick，本來就不會進來。
    // NuxtLink 內建的 handler 雖然**先於**本函式執行（見 template 的說明），但它呼叫的
    // router.push() 是非同步的 —— 本函式這段同步碼必然在導航的 microtask 之前跑完，
    // 故旗子一定趕在 Hero 的 setup 之前設好，不是競態。
    requestHomeRestart(restartIntent);
    return;
  }

  e.preventDefault();
  // auto 而非 smooth：restartOpening() 是瞬間生效的，smooth 期間影片已經淡回、
  // 轉場層還在漸進收，兩者會打架（理由同 Hero 的 scrollToInitialHash）。
  window.scrollTo({ top: 0, behavior: 'auto' });
  restartOpening();
}

// 選單面板是白底（設計稿只有這一版），開啟期間 header 一併切白底
const effectiveTheme = computed<HeaderTheme>(() =>
  menuOpen.value ? 'light' : theme.value,
);

// ── 轉場開窗時的反白層 ────────────────────────────────────────────────
// 設計稿 Figma 2065:142710 的 `Mask group` 裡放了**第二份 header**（反白版），與展開中的
// 深色場吃同一個遮罩 —— 這裡就是那第二份。窗的座標由轉場端交出來（見 ~/composables/
// useHeaderBand），header 不認得任何轉場，只認得「現在有沒有窗、窗內是什麼主題」。
//
// 兩層都是同一份 bar 的渲染結果（下方 v-for，markup 只寫一份）：
//   base ── 常駐，主題吃 effectiveTheme；開窗時被 .has-band 的遮罩挖掉窗內那一條。
//   band ── 只在開窗期間掛上，主題吃 bandTheme，clip 成窗形疊在 base 之上。
// ⚠️ band 那層是**純視覺副本**：inert（不進 tab 序、不吃事件）＋ pointer-events: none。
//    它裡面的 <AppHeaderNav> / <AppHeaderShare> 只是畫出來給人看的，互動一律走 base。
const { bandTheme } = useHeaderBand();

// ── 配色的逐幀漸變（tint）─────────────────────────────────────────────
// 某些段落的底色是**連續**在變的（符號段收攏之後那 20vh 由黑轉白），離散三檔在那裡只能
// 硬翻一次。tint 是疊在三檔（與 band）之上的覆寫：驅動端逐幀交出一個 0..1（見
// ~/composables/useHeaderTint），窗口外放手、配色原封不動地回到 data-header-theme。
// header 一樣不認得任何段落 —— 只認得「現在有沒有在漸變」。
//
// ⚠️ 那一段畫面上看到的 header 是 **band 那層**（窗滿寬 → base 被遮罩整條挖掉），
//    所以漸變的重點在 band：它跑到 1 時與接手的 base(light) 完全同色，coreIn 那一幀的
//    交棒才看不出來。兩層各自的起點與推導見 SCSS 的 .app-header__layer--tint。
//
// ⚠️ 選單開著時一律放棄漸變：面板是白底，header 必須是 light（見 effectiveTheme）。
//    少了這個條件，在窗口中途開選單會得到「白面板 ＋ 半黑 header」。
const { headerTinted } = useHeaderTint();
const tinted = computed(() => headerTinted.value && !menuOpen.value);

interface HeaderLayer {
  key: 'base' | 'band';
  theme: HeaderTheme;
  /** 這一層要不要吃 tint 的覆寫。**兩層都會** —— 各自的起點不同（base 從半透明黑底、
   *  band 從全透明出發），終點都是 light，故 SCSS 分兩個分支，見 .--tint 的註解。
   *  漸變期間畫面上看到的其實是 band 那層（base 被 .has-band 的遮罩整條挖掉）。 */
  tint?: boolean;
}

const layers = computed<HeaderLayer[]>(() => {
  const base: HeaderLayer = {
    key: 'base',
    theme: effectiveTheme.value,
    tint: tinted.value,
  };
  return bandTheme.value
    ? [base, { key: 'band', theme: bandTheme.value, tint: tinted.value }]
    : [base];
});
</script>

<template>
  <!-- data-header-vars：所有**逐幀**寫入的 CSS 變數都掛在這裡 —— 反白窗的 --hd-band-l/r
       （useHeaderBand）與配色漸變的 --hd-tint（useHeaderTint）。用 data- 而非 class
       同本專案既有慣例（data-header-theme／data-morph-veil／data-metaball-scope）——
       class 是樣式的名字，改名重構不該把轉場打斷。為什麼不寫在 documentElement 上：
       那些變數是會繼承的自訂屬性，寫在根節點等於每一幀讓整棵樹的 computed style
       失效，而真正的消費者只有本元件底下那兩層（見 ~/utils/header-css-var）。 -->
  <header
    class="app-header"
    data-header-vars
    :class="[
      {
        'is-visible': isVisible,
        'is-menu-open': menuOpen,
        'has-band': !!bandTheme,
        'has-tint': tinted,
      },
    ]"
  >
    <!--
      base ＋（開窗時）band 兩層，markup 只寫這一份（見 script 的 layers）。
      band 那層是純視覺副本：aria-hidden ＋ inert ＋ pointer-events: none。
      ⚠️ inert 用 `|| undefined` 而不是布林：inert 不在 Vue 的 special boolean attr 名單裡，
         綁 false 會渲染成 inert="false" —— 而 HTML 的 boolean attribute 只看「在不在」，
         那等於把常駐的 base 層也變成不可互動。
    -->
    <div
      v-for="layer in layers"
      :key="layer.key"
      class="app-header__layer"
      :class="[
        `app-header__layer--${layer.key}`,
        `app-header__layer--${layer.theme}`,
        { 'app-header__layer--tint': layer.tint },
      ]"
      :aria-hidden="layer.key === 'band' || undefined"
      :inert="layer.key === 'band' || undefined"
    >
      <!-- 閱讀進度 -->
      <div v-show="isVisible" class="app-header__progress">
        <div
          class="app-header__progress-bar"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- 頂部列（≥1280：logo ＋ 錨點列 ＋ 音效 ＋ share；<1280：logo ＋ 音效 ＋ 漢堡） -->
      <div class="app-header__bar-wrap">
        <div class="app-header__bar">
          <!-- 首頁用原生 <a>，不用 NuxtLink：NuxtLink 內建的 click handler 會**先於**本元件的
               @click 執行，且它是在那個時間點才檢查 e.defaultPrevented —— onLogoClick 的
               preventDefault 還沒跑，攔不住它。結果是推入一次真正的導航到 /，多一筆歷史紀錄、
               讓「上一頁」失效。就地重播一律走 onLogoClick（捲頂 ＋ restartOpening）。
               （同 AppHeaderNav / AppHeaderMenu 已修過的順序陷阱。） -->
          <a
            v-if="homeIntent.action === 'in-page'"
            class="app-header__logo"
            :href="logoHref"
            :aria-label="labels.logoLabel"
            @mouseenter="play('sfx01')"
            @click="onLogoClick"
          >
            <img
              class="app-header__logo-img"
              :src="logoUrl"
              :alt="labels.logoAlt"
            />
            <span class="app-header__logo-mask" aria-hidden="true" />
          </a>

          <!-- 子頁：真的要換頁，交給 NuxtLink（client-side 導航）；onLogoClick 只負責關選單。 -->
          <NuxtLink
            v-else
            class="app-header__logo"
            :to="homeIntent.to"
            :aria-label="labels.logoLabel"
            @mouseenter="play('sfx01')"
            @click="onLogoClick"
          >
            <img
              class="app-header__logo-img"
              :src="logoUrl"
              :alt="labels.logoAlt"
            />
            <span class="app-header__logo-mask" aria-hidden="true" />
          </NuxtLink>

          <div class="app-header__actions">
            <AppHeaderNav
              :anchors="anchors"
              :active-target="navActiveTarget"
              @select="scrollToTarget"
            />

            <div class="app-header__icons">
              <AppHeaderSound />
              <!-- 包一層 div 而非把 class 掛在元件上：兩邊 scoped 樣式同特異度，
                   靠檔案順序決勝不可靠（同 subpage.vue 那個 !important 的教訓） -->
              <div class="app-header__share">
                <AppHeaderShare />
              </div>
              <button
                class="app-header__menu-toggle"
                type="button"
                :aria-label="
                  menuOpen ? labels.menuCloseLabel : labels.menuOpenLabel
                "
                :aria-expanded="menuOpen"
                @mouseenter="play('sfx01')"
                @click="menuOpen = !menuOpen; play('sfx01')"
              >
                <AppHeaderIcon :name="menuOpen ? 'close' : 'menu'" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppHeaderMenu
      :open="menuOpen"
      :anchors="anchors"
      :active-target="navActiveTarget"
      @close="menuOpen = false"
      @select="scrollToTarget"
    />
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  // ⚠️ 這裡刻意**不宣告 font-family**。header 一個文字節點都沒有（logo 與三顆 anchor
  //    全是 <img> SVG、按鈕只有 aria-label），所以宣告了也沒有字要排；而 @nuxt/fonts
  //    是「每一個提到已註冊家族的宣告點，各注入一整組 unicode-range @font-face」，
  //    這一行的代價是每張預算頁多出 320 條 @font-face／約 328 KB 的內嵌 CSS。
  //    真要排字時請走 base.scss 的 html 堆疊（繼承），不要在這裡重新宣告家族名。
  // icon 外框：音效／share／漢堡三顆共用同一個版位尺寸（mob／pad 稿 35×28、pc 稿 27.5×22）。
  // 稿上 icon 群組總寬正好是「兩顆外框＋間距」：82 = 35+12+35、75 = 27.5+20+27.5，
  // 故外框寬不可省成 auto，否則群組寬度會隨 glyph 比例漂移。
  // glyph 只吃外框高的百分比、寬度按原生比例縮放，三顆都比外框窄，不會溢出。
  --hd-icon-w: 35px;
  --hd-icon-h: 28px;

  // 換色補間的時長，**整個 header 子樹共用一個來源**（會繼承，子元件直接吃）。
  // 存在的理由是 tint（見 .has-tint）：離散三檔之間換色是「一次跳」，補一段 0.3s 才
  // 不生硬；但 tint 期間色值本身是**逐幀**在變的，再疊補間就變成 header 慢半拍追著
  // 色場跑（閱讀捲速下約是整段窗口的三成距離，看得很清楚），而「精確跟著真正的底色
  // 走」正是那個漸變存在的理由。
  // ⚠️ 新增任何吃 --hd-fg / --hd-bg 的補間，時長一律寫 var(--hd-color-dur)，別寫死
  //    0.3s —— 寫死的那一個會在 tint 期間獨自落後，變成「其他都跟上了、就它在飄」。
  //    目前的消費者：.app-header__bar-wrap（底色）與 AppHeaderNav 的 .__link（文字色）。
  --hd-color-dur: 0.3s;

  @include rwd-min('pc') {
    --hd-icon-w: 27.5px;
    --hd-icon-h: 22px;
  }

  // 逐幀漸變期間關掉所有換色補間（理由見上）。
  &.has-tint {
    --hd-color-dur: 0s;
  }

  // 選單開啟期間，header 整層抬到子頁疊層之上（見 subpage.scss 的疊層總表）。
  //
  // 為什麼需要這條：子頁舞台被 ScrollTrigger pin 之後，GSAP 產生的 .pin-spacer 帶著
  // **行內** `z-index: 1100`（抄自 `.subpage__stage--media`，且抄過去就不再更新，
  // 見 Subpage.vue 的 :deep(.pin-spacer) 註解）⇒ 整段 pin 期間該佔位都是一個高於
  // header（1000）的堆疊脈絡。AppHeaderMenu 的面板在 header 內（z-index 1），
  // 被自己的祖先關在 1000 這層，於是子頁 pin 期間開選單，舞台的標題／滿屏媒體會
  // 直接畫在白面板之上 —— 那不是選單自己的 z-index 不夠，抬面板毫無作用。
  //
  // 只在選單開著時抬：媒體那一拍本來就該蓋掉 header（滿屏照片要滿屏），
  // 常態抬上去會把那一拍的設計弄壞。選單是 modal，開著時它贏過一切才合理。
  &.is-menu-open {
    z-index: 1200;
  }
}

/* 一層 header。三顆色票掛在**層**上而不是 header 根節點：開窗時兩層同時在場、
   而且各自是不同主題（base 白底灰字、band 反白），掛在根節點就只能有一組。
   icon 外框尺寸仍在根節點（兩層一致，見 .app-header）。 */
.app-header__layer {
  position: relative;
  // 疊在選單面板（z-index 1）之上，主列不被面板蓋住
  z-index: 2;
  --hd-bg: rgb(255 255 255 / 0.7);
  --hd-fg: var(--color-gray);
  --hd-accent: var(--color-orange);
}

.app-header__layer--dark {
  --hd-bg: rgb(0 0 0 / 0.5);
  --hd-fg: #fff;
  --hd-accent: var(--color-orange);
}

// ⚠️ 不透明，不是半透明（2026-08-18）：橘主題原本是
//    color-mix(orange 70%, transparent)，疊在頁面上。這在「背後是實心橘」時
//    看不出差別（70% 橘疊橘 ＝ 橘），但 03 → 04 融合拍期間橘柱會收窄，
//    header 帶兩側的背後變成白 → 帶子被切成三塊（兩側淺橘、中間飽和橘），
//    看起來像兩層東西。那是使用者回報的「露餡」。
//    全站只有兩處宣告 orange（Blessing.vue 靜態、media 拍 0/1 動態），兩處背後
//    本來都是實心橘，故這是既有畫面上的**零變化**；`.section3` 還是淺藍的那一段
//    header 根本還沒進到它上面（接縫升到 header 底緣時 coverProgress ≈ 0.87，
//    早已越過 COVER_CONTACT 0.5）。
.app-header__layer--orange {
  --hd-bg: var(--color-orange);
  --hd-fg: #fff;
  --hd-accent: #fff;
}

/* 反白層：疊在 base 之上，clip 成轉場交出來的窗（見 ~/composables/useHeaderBand）。
   ⚠️ 必須宣告在 --dark / --orange **之後**：band 那層同時帶著兩個 class（例如
      `--band --dark`），特異度相同 → 靠來源順序決勝，這裡的 --hd-bg 才蓋得掉主題的。
   ⚠️ --hd-bg 是 transparent 而不是主題底色：窗內的底色**就是**轉場那層色場本身
      （粒子場／橘幕），稿上是直接透出來的（Figma 2065:142822 那份 header 沒有底色）。 */
.app-header__layer--band {
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 3;
  pointer-events: none;
  --hd-bg: transparent;
  clip-path: inset(0 calc(100% - var(--hd-band-r, 0px)) 0 var(--hd-band-l, 0px));

  // 底色都透明了還糊一層 blur，只會把窗內的粒子糊掉
  .app-header__bar-wrap {
    backdrop-filter: none;
  }
}

/* 開窗時把 base 層在窗內那一條**挖掉**（連 backdrop-filter 一起），窗內才是乾淨的色場。
   只疊一層反白是不夠的：base 的 rgb(255 255 255 / 0.7) + blur(2px) 會蓋在深色場上
   變成一條灰霧帶（見 temp/poc-off-085.png 的對照）。
   ⚠️ 用 mask 而非 clip-path：一條直立缺口會把亮列切成左右**兩塊不連續**的區域，
      clip-path 的單一多邊形表達不了；linear-gradient 遮罩天生就能。
      代價是它只有水平資訊 —— 窗還沒蓋滿 header 那一列時不可以挖，那條閘門收在
      useHeaderBand 的 syncHeaderBand（top > 0 就不開窗）。

   遮罩鋪成**兩層相加**（mask-composite 的初始值就是 add）：
     ① 只鋪主列那一列（高 --header-height）：窗內挖掉 —— 就是上面說的那件事。
     ② 主列底緣以下鋪 400px、整片不透明：什麼都不挖。
   ②不是裝飾，是修 bug（2026-08-20）：AppHeaderShare 的 pc 展開列是掛在主列上、
   **溢出盒外**的絕對定位元素，而遮罩預設 mask-clip: border-box —— 盒外一律當透明
   ⇒ 一開窗，展開中的三顆分享 icon 整排消失。症狀看起來像「被 symbol 的粒子場蓋掉」
   （回報時的說法是 z-index 不夠），其實是被 header 自己的遮罩裁掉的 ——
   base 是 1000、粒子場只有 10，本來就沒有輸的道理。故除了②，還要把 mask-clip 放成
   no-clip，讓它鋪得到盒外那一段。
   ⚠️ 400px 只需蓋住展開列（主列底緣以下 12 + 36×3 + 12×2 ＝ 144，見 AppHeaderShare），
      留了寬鬆餘裕；刻意不寫 vh —— 這與視窗高無關（見 utils/viewport-height 的單一來源）。
   ⚠️ mask-clip 必須寫在 mask／-webkit-mask **之後**：shorthand 會把它重設回 border-box。
   ⚠️ 必須寫 no-repeat：預設的 repeat 會讓①往下一路鋪滿，展開列照樣被挖掉。
   ⚠️ 舊 Safari（<15.4）只認 -webkit-mask-clip，而它沒有 no-clip 值 → 那些瀏覽器維持
      改動前的行為（開窗期間展開列看不見），不是新的破口。 */
.app-header.has-band .app-header__layer--base {
  --hd-band-mask: linear-gradient(
    to right,
    #000 0 var(--hd-band-l, 0px),
    transparent var(--hd-band-l, 0px) var(--hd-band-r, 0px),
    #000 var(--hd-band-r, 0px) 100%
  );
  // ⚠️ 遮罩掛在**真正會畫東西的那兩個元素**上，不掛在 layer 上。
  //    掛 layer 看起來對，但 .app-header__bar-wrap 為了滑入動畫帶著 transform ⇒ 被提升成
  //    合成層 ⇒ 在 Chrome 會**逃出祖先的遮罩**：窗內 header 那一列殘留一條比周圍淺的橫帶
  //    （底色沒被清乾淨）。01 → 02 是深色場，那條淺帶看不太出來；03 → 04 疊在滿版橘上
  //    一眼就見（A/B 對照：temp/seam-base-only.png ↔ temp/seam-fixA.png）。
  //    試過在 layer 上加 isolation: isolate 擋不住（temp/seam-isolate.png），
  //    掛在元素自己身上才沒有這條逃逸路徑。
  // 單層遮罩、垂直重複、no-clip：
  //   ・repeat（不是 no-repeat）＋ no-clip ⇒ 那道直立缺口一路延伸到盒外，
  //     share 的展開列（畫在主列底緣以下）因此**不會被裁掉**。
  //   ・單層 ⇒ 沒有「兩層遮罩的邊界」。曾經改用「洞 + 主列以下補一層黑」的兩層寫法，
  //     邊界那一列會在窗內透出一條 1px 亮線（DPR 1／2 都看得到，
  //     見 temp/final-fuse-dpr2.png 的紀錄）；單層就沒有這個接縫。
  //   ・gradient 是水平的，垂直重複只是把同一組直立條紋再鋪一次 ⇒ 缺口位置不變。
  // ⚠️ 代價：展開列若橫向落在窗內，會跟著被挖掉。那是一致的：窗內本來就不該畫 base，
  //    要畫也是 band 那層畫（它的展開列是收合的）。實務上窗置中、share 在最右，
  //    只有窗接近滿版時才重疊，而那時整條 header 本來就被窗蓋滿。
  // ⚠️ mask-clip 必須寫在 mask／-webkit-mask **之後**：shorthand 會把它重設回 border-box。
  .app-header__progress,
  .app-header__bar-wrap {
    -webkit-mask: var(--hd-band-mask) 0 0 / 100% 100% repeat;
    mask: var(--hd-band-mask) 0 0 / 100% 100% repeat;
    mask-clip: no-clip;
  }
}

/* 顯示/隱藏：捲過 hero 後才滑入。
   注意：transform 不可加在 .app-header 上，否則會成為子層 AppHeaderMenu（position: fixed）的
   containing block，害它的 inset 定位跑掉。因此位移動畫只做在 bar-wrap 上。
   這個 class 只能定義一次：曾經拆成兩處（各自宣告 transition），後宣告的 shorthand 會整個
   覆蓋前者、把 transform 那段吃掉，變成滑入動畫失效、reduced-motion 的 transition:none 也
   同時被蓋掉。合併後 transition 要同時列出 transform 與 background-color 兩段。 */
.app-header__bar-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  background-color: var(--hd-bg);
  backdrop-filter: blur(2px);
  transition:
    transform 0.3s ease,
    background-color var(--hd-color-dur) ease;
  transform: translateY(-100%);
}

.app-header.is-visible {
  .app-header__bar-wrap {
    transform: translateY(0);
  }
}

// 必須放在 .app-header__bar-wrap 本體之後：兩者特異度相同，靠來源順序覆蓋。
@media (prefers-reduced-motion: reduce) {
  .app-header__progress,
  .app-header__bar-wrap {
    transition: none;
  }
}


.app-header__progress {
  position: relative;
  width: 100%;
  height: 3px;
  background-color: var(--color-blue);
}

.app-header__progress-bar {
  height: 100%;
  background-color: var(--color-orange);
  transition: width 0.15s linear;
}

.app-header__bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1920px;
  height: calc(var(--header-height) - 3px);
  padding: 0 20px;

  // mob：logo 靠左；pad：logo 置中；pc：logo 靠左＋錨點列
  justify-content: flex-start;

  @include rwd-min('tablet') {
    justify-content: center;
  }

  @include rwd-min('pc') {
    justify-content: space-between;
    gap: 24px;
  }
}

.app-header__logo {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
}

.app-header__logo-img {
  display: block;
}

// 黑底／橘底用 mask 把彩色 logo 壓成純白（手法同 SubpageAnchor）
// 路徑是編譯期常數，直接寫 SCSS url() 讓 Vite 解析，不必走 v-bind
.app-header__logo-mask {
  display: none;
  background-color: #fff;
  mask-image: url('../../assets/img/logo.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
}

// 寬度流動縮放，三個上限取最小的一個：
//   ① 63vw —— 主曲線（稿上的縮放感）。
//   ② 100vw - 134px —— 右側 icon 群組的**實際佔位**：.app-header__bar 的左右 padding
//      20 + 20、.app-header__icons 的 35 + 12(gap) + 35 = 82，再留 12 的間隙。
//   ③ 260px —— mob 稿的定值上限（414 起卡在這）。
//
// ②是 2026-08-22 補的（320 跑版）：原本只有 ①③，而①只管「別太寬」、沒把右側佔位算進去
// ⇒ 320 時 logo 寬 201.6、右緣落在 221.6，壓在 icon 群組左緣 218 上，音量 icon 直接畫在
// 「未來」兩字上（實測數字，不是估的）。②在 320 給出 186px。
// ⚠️ ①②在 362.2px 交叉（0.37w = 134）⇒ **≥375 完全走①、與改動前逐像素相同**，
//    這正是選「再取一個上限」而不是加 max-width 斷點的理由：沒有硬跳、也不動到 375 以上。
// ⚠️ 代價：320 稿標的 204px 放不下（要放下得同時縮 icon 或 padding，那會動到 375 以上）。
// ⚠️ 134 綁著三處數字：.app-header__bar 的 padding、.app-header__icons 的兩顆 icon 與 gap、
//    以及刻意留的 12px 間隙。任一處改動要回來同步這條。
//
// 高度不能各自寫死，兩顆都用同一份寬度除以 228÷37（pc 稿的原生比例）反推，
// 才不會 img／mask 兩顆尺寸走鐘。
.app-header__logo-img,
.app-header__logo-mask {
  --hd-logo-w: min(63vw, 100vw - 134px, 260px);
  width: var(--hd-logo-w);
  height: calc(var(--hd-logo-w) / 6.1622);

  @include rwd-min('pc') {
    --hd-logo-w: 228px;
  }
}

.app-header__layer--dark,
.app-header__layer--orange {
  .app-header__logo-img {
    display: none;
  }

  .app-header__logo-mask {
    display: block;
  }
}

/* 配色的逐幀漸變（見 script 的 tint 與 ~/composables/useHeaderTint）。
   --hd-tint 由驅動端逐幀寫在 header 上：0 ＝ 該層原本的深色端、1 ＝ light。

   ⚠️ **兩層都要吃**，而且兩層的起點不同 —— 這是 2026-08-22 實測才看清楚的事：
      符號段全程 band 窗是**滿寬**開著的（--hd-band-l/r ＝ 0 → 視窗寬），於是
      `.has-band` 的遮罩把 base 那一條**整條挖掉**，畫面上看到的 header 一直是
      band 層（透明底 ＋ 白字）。也就是說：
        ・base 的三檔在這段期間是看不見的（連 data-header-theme 在 0.5 的硬翻也看不見）；
        ・使用者說的「進入 forum 直接切換主題」是 **coreIn 那一幀 band 層被移除**
          （透明底白字 → 半透明白底灰字，一次跳完）；
        ・順帶還有一個既有問題：band 鎖死 dark（白字），底色翻白之後白字壓在白底上
          幾乎看不見。
      所以 band 的漸變終點刻意就是 --light 的那組值：跑到 1 時它與接手的 base(light)
      **完全同色**，coreIn 的交棒因此變成看不出來。base 也一起漸變，是為了萬一窗不是
      滿寬（base 會露出來）時兩層仍然同調。

   ⚠️ 必須宣告在 --dark / --orange / --band **三個地方**之後：上面的色票區塊、band 的
      覆寫、以及緊接在前面那組 logo 的 display 對調。這也是本區塊為什麼**整包放在
      這裡**、不按功能拆到各自的鄰居旁邊（拆了就會有一半贏不了）。bg 用兩個 class
      的選擇器（0,2,0）而不是靠順序，才蓋得掉 --band 的 transparent。

   ⚠️ 端點的色值與 --dark / --light / --band 是同一組數字，抄成兩份是刻意的取捨：
      做成 from / to 變數要把每一端的三顆色票都變成變數、CSS 膨脹好幾倍。改上面的
      色票要回來同步這裡。

   插值走 in srgb 而不是 oklab：兩端都是灰階（白／黑），srgb 的線性灰階最接近 canvas
   那邊同一刻在做的黑→白 lerp；而 header 本來就是半透明疊在色場上，兩者同調比「感知
   上更均勻」重要。 */
.app-header__layer--tint {
  --hd-fg: color-mix(
    in srgb,
    var(--color-gray) calc(var(--hd-tint, 0) * 100%),
    #fff
  );
  // --hd-accent 兩端同色（都是 orange），沒有東西要插值 —— 不宣告即照舊繼承

  // 常駐層：從 --dark 的半透明黑底出發。
  &.app-header__layer--base {
    --hd-bg: color-mix(
      in srgb,
      rgb(255 255 255 / 0.7) calc(var(--hd-tint, 0) * 100%),
      rgb(0 0 0 / 0.5)
    );
  }

  // 窗內那層：從**透明**出發（原本刻意透出色場本身，見 --band 的註解）。
  // 淡入白底是這個漸變的重點之一：跑到 1 時它就是 --light 的底色，接手的 base(light)
  // 因此不會在 coreIn 那一幀憑空長出一條白 bar。
  // ⚠️ backdrop-filter 沒有跟著回來（band 那層是 none、base 是 blur(2px)）：交棒那一刻
  //    底下已是一片平坦的白，2px 模糊看不出差別，不值得多一道 GPU pass。
  &.app-header__layer--band {
    --hd-bg: color-mix(
      in srgb,
      rgb(255 255 255 / 0.7) calc(var(--hd-tint, 0) * 100%),
      transparent
    );
  }

  // logo 沒辦法插值：淺色是彩色 <img>、深色是 mask 壓成純白的 <span>，原本靠
  // display 對調。漸變期間改成兩顆疊著用 opacity 對衝，吃的是同一個 --hd-tint。
  // ⚠️ 中段會看到兩顆各半透明的 dissolve（白版疊在彩色版上）。已知、可接受：
  //    那一刻整片畫面正在做黑→白，logo 單獨硬切反而才顯眼。
  .app-header__logo {
    position: relative; // 疊放的定位基準；只在漸變期間需要
  }

  .app-header__logo-img {
    display: block;
    opacity: var(--hd-tint, 0);
  }

  // 用 top/left 而不是 inset: 0 —— 尺寸已由上面共用的 width/height 決定，
  // 再給 right/bottom 會過約束（右緣被忽略），白白留一個看不出來的陷阱。
  .app-header__logo-mask {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    opacity: calc(1 - var(--hd-tint, 0));
  }
}

.app-header__actions {
  // mob／pad：icon 群組脫離流排、固定在右緣，logo 才能置中不被推歪
  position: absolute;
  top: 50%;
  right: 20px;
  display: flex;
  align-items: center;
  transform: translateY(-50%);

  @include rwd-min('pc') {
    position: static;
    gap: 32px;
    transform: none;
  }
}

.app-header__icons {
  display: flex;
  align-items: center;
  gap: 12px;

  @include rwd-min('pc') {
    gap: 20px;
  }
}

.app-header__share {
  display: none; // <1280 的 share 在漢堡選單裡

  @include rwd-min('pc') {
    display: flex;
  }
}

.app-header__menu-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--hd-icon-w);
  height: var(--hd-icon-h);
  padding: 0;
  border: 0;
  background: none;
  color: var(--hd-fg);
  cursor: pointer;

  :deep(.app-header-icon) {
    height: 60%; // menu：設計稿 16.8 / 28
  }

  @include rwd-min('pc') {
    display: none;
  }
}
</style>
