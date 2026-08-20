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
import { resolveHomeIntent } from '@/utils/home-intent';
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
const { returnToLoop, isGone } = useHeroVideo();
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
//   ⚠️ 倒帶回 loop（logo 就地倒帶／往回捲）時 isGone 轉 false，header 會跟著收回去 ——
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

// logo：回到 hero 的 loop 段。首頁就地倒帶（不換頁），子頁交給 NuxtLink 導航到 /#loop。
function onLogoClick(e: MouseEvent) {
  // 修飾鍵點擊（Ctrl／⌘／Shift／Alt）是「開新分頁／新視窗」的意圖，一律放行給瀏覽器 ——
  // 攔下來會讓使用者按了沒反應。中鍵在現代瀏覽器發的是 auxclick，本來就不會進來。
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  // 選單開著時 logo 仍可點：.app-header__bar-wrap 的 z-index 2 疊在面板（z-index 1）之上。
  // 就地倒帶不換頁 → 面板不會自己消失，.is-menu-locked 也還鎖著 html/body，
  // 使用者會看到「按了 logo，選單沒關、頁面鎖死」。
  menuOpen.value = false;

  if (homeIntent.value.action !== 'in-page') return; // 子頁：讓 NuxtLink 走

  e.preventDefault();
  // auto 而非 smooth：returnToLoop() 是瞬間生效的，smooth 期間影片已經淡回、
  // 轉場層還在漸進收，兩者會打架（理由同 Hero 的 scrollToInitialHash）。
  window.scrollTo({ top: 0, behavior: 'auto' });
  returnToLoop();
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

interface HeaderLayer {
  key: 'base' | 'band';
  theme: HeaderTheme;
}

const layers = computed<HeaderLayer[]>(() => {
  const base: HeaderLayer = { key: 'base', theme: effectiveTheme.value };
  return bandTheme.value
    ? [base, { key: 'band', theme: bandTheme.value }]
    : [base];
});
</script>

<template>
  <!-- data-header-band：useHeaderBand 逐幀寫 --hd-band-l/r 的目標。用 data- 而非 class
       同本專案既有慣例（data-header-theme／data-morph-veil／data-metaball-scope）——
       class 是樣式的名字，改名重構不該把轉場打斷。為什麼不寫在 documentElement 上：
       那兩個變數是會繼承的自訂屬性，寫在根節點等於每一幀讓整棵樹的 computed style
       失效，而真正的消費者只有本元件底下那兩層（見 SCSS 的 --hd-band-mask）。 -->
  <header
    class="app-header"
    data-header-band
    :class="[
      { 'is-visible': isVisible, 'is-menu-open': menuOpen, 'has-band': !!bandTheme },
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
               讓「上一頁」失效。就地倒帶一律走 onLogoClick（捲頂 ＋ returnToLoop）。
               （同 AppHeaderNav / AppHeaderMenu 已修過的順序陷阱。） -->
          <a
            v-if="homeIntent.action === 'in-page'"
            class="app-header__logo"
            :href="logoHref"
            :aria-label="labels.logoLabel"
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
                @click="menuOpen = !menuOpen"
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
  font-family: 'Noto Sans TC', sans-serif;
  // icon 外框：音效／share／漢堡三顆共用同一個版位尺寸（mob／pad 稿 35×28、pc 稿 27.5×22）。
  // 稿上 icon 群組總寬正好是「兩顆外框＋間距」：82 = 35+12+35、75 = 27.5+20+27.5，
  // 故外框寬不可省成 auto，否則群組寬度會隨 glyph 比例漂移。
  // glyph 只吃外框高的百分比、寬度按原生比例縮放，三顆都比外框窄，不會溢出。
  --hd-icon-w: 35px;
  --hd-icon-h: 28px;

  @include rwd-min('pc') {
    --hd-icon-w: 27.5px;
    --hd-icon-h: 22px;
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
  -webkit-mask:
    var(--hd-band-mask) 0 0 / 100% var(--header-height) no-repeat,
    linear-gradient(#000, #000) 0 var(--header-height) / 100% 400px no-repeat;
  mask:
    var(--hd-band-mask) 0 0 / 100% var(--header-height) no-repeat,
    linear-gradient(#000, #000) 0 var(--header-height) / 100% 400px no-repeat;
  mask-clip: no-clip;
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
    background-color 0.3s ease;
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

// 寬度用 min(63vw, 260px) 流動縮放：320 時貼近 320 稿的 204px、414 起卡在 260px 的 mob 稿值，
// 避免窄螢幕下與右側 icon 群組疊在一起（見 task-5-report.md 的 fix 記錄）。
// 高度不能各自寫死，兩顆都用同一份寬度除以 228÷37（pc 稿的原生比例）反推，
// 才不會 img／mask 兩顆尺寸走鐘。
.app-header__logo-img,
.app-header__logo-mask {
  --hd-logo-w: min(63vw, 260px);
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
