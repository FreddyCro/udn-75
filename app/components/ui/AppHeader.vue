<script setup lang="ts">
import str from '@/locales/common.json';
import logoUrl from '@/assets/img/logo.svg';
import { PC_BREAKPOINTS } from '@/utils/constants';
import {
  pickHeaderTheme,
  type HeaderTheme,
  type ThemeSpan,
} from '@/utils/header-theme';
import { pickActiveAnchor } from '@/utils/anchor-spy';

/**
 * AppHeader — 底色隨捲動段落切換白／黑／橘（見 data-header-theme、updateTheme）。
 * - ≥1280：logo 靠左 ＋ AppHeaderNav 錨點列 ＋ 音效 ＋ share，合併於頂部單一列。
 * - <1280：頂部 navbar（logo 置中／靠左 ＋ 音效 ＋ 漢堡）＋ 漢堡開啟 AppHeaderMenu 全螢幕選單。
 * - 頂部閱讀進度條（橘色進度 / 淺藍底軌）。
 */

interface Anchor {
  title: string;
  target: string;
}

const props = defineProps({
  /**
   * 是否啟用「捲過 hero 才顯示」的自動隱藏行為。
   * - true（預設）：首頁等有 #app-hero 的頁面；hero 完全捲離視窗後 header 才滑入。
   * - false：其他頁（無 hero）；header（含進度條）自始常駐顯示，不監看 hero。
   */
  autoHide: { type: Boolean, default: true },
});

// 錨點列只在首頁顯示；子頁改用 SubpageAnchor / SubpageAnchorBar。
// 用路由而非 autoHide 判斷，兩者語意不同，日後子頁若也想 autoHide 不會互相牽動。
const route = useRoute();
const showNav = computed(() => route.path === '/');

// logo 連回站台首頁。硬寫 "/" 在子路徑部署（GitHub Pages 的 /udn-75/、nmdap 的 /test/udn75/）
// 會連到網域根，故改取 .env 的 NUXT_URL（見 nuxt.config 的 runtimeConfig.public.APP_URL）。
const homeUrl = useRuntimeConfig().public.APP_URL;

const progress = ref(0);
const activeTarget = ref<string>('');
const menuOpen = ref(false);
const theme = ref<HeaderTheme>('light');
let themeEls: HTMLElement[] = [];
// header 是否顯示。autoHide=false 時自始為 true（含 SSR），避免子頁載入時的滑入動畫；
// autoHide=true 時初始隱藏，待 hero 完全捲離視窗才顯示。
const isVisible = ref(!props.autoHide);
const anchors = str.headerAnchors as Anchor[];
// logo 的替代文字與漢堡的 aria-label 一律走文案檔（locales/common.json 的 header），
// 元件內不寫死中文 —— 校稿時只需要改 JSON。
// 刻意不取名 header：模板根節點是 <header>，同名讀起來會混淆（原生標籤不受影響，純為可讀性）。
const labels = str.header;

let observer: IntersectionObserver | null = null;
let heroObserver: IntersectionObserver | null = null;
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
  updateTheme();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

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
        activeTarget.value = pickActiveAnchor(
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
            if (entry) isVisible.value = !entry.isIntersecting;
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
      isVisible.value = true;
    };
    setupHeroObserver();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  mqPc?.removeEventListener('change', closeMenuOnPc);
  if (rafId) window.cancelAnimationFrame(rafId);
  if (heroRafId) window.cancelAnimationFrame(heroRafId);
  observer?.disconnect();
  heroObserver?.disconnect();
});

// 頂部固定列的高度（用於錨點捲動時的偏移補償），從 CSS variable --header-height 取得。
function getHeaderOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    '--header-height',
  );
  return parseFloat(raw) || 0;
}

function updateProgress() {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  progress.value =
    total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0;
}

// 偵測線＝header 底緣。段落用 data-header-theme 宣告顏色，子頁不標 → 回落 light。
function updateTheme() {
  const headerBottom = getHeaderOffset();
  const spans: ThemeSpan[] = themeEls.map((el) => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      bottom: r.bottom,
      theme: (el.dataset.headerTheme ?? 'light') as HeaderTheme,
    };
  });
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

function scrollToTarget(target: string, e?: Event) {
  const el = document.getElementById(target);
  if (!el) return;
  e?.preventDefault();
  const top =
    el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: 'smooth' });
}

function scrollToTop(e?: Event) {
  e?.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 選單面板是白底（設計稿只有這一版），開啟期間 header 一併切白底
const effectiveTheme = computed<HeaderTheme>(() =>
  menuOpen.value ? 'light' : theme.value,
);
</script>

<template>
  <header
    class="app-header"
    :class="[`app-header--${effectiveTheme}`, { 'is-visible': isVisible }]"
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
        <a
          class="app-header__logo"
          :href="homeUrl"
          :aria-label="labels.logoLabel"
        >
          <img
            class="app-header__logo-img"
            :src="logoUrl"
            :alt="labels.logoAlt"
          />
          <span class="app-header__logo-mask" aria-hidden="true" />
        </a>

        <div class="app-header__actions">
          <AppHeaderNav
            v-if="showNav"
            :anchors="anchors"
            :active-target="activeTarget"
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

    <AppHeaderMenu
      :open="menuOpen"
      :anchors="anchors"
      :active-target="activeTarget"
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
  --hd-bg: rgb(255 255 255 / 0.7);
  --hd-fg: var(--color-gray);
  --hd-accent: var(--color-orange);

  @include rwd-min('pc') {
    --hd-icon-w: 27.5px;
    --hd-icon-h: 22px;
  }

  &--dark {
    --hd-bg: rgb(0 0 0 / 0.5);
    --hd-fg: #fff;
    --hd-accent: var(--color-orange);
  }

  &--orange {
    --hd-bg: color-mix(in srgb, var(--color-orange) 70%, transparent);
    --hd-fg: #fff;
    --hd-accent: #fff;
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
  z-index: 2; // 疊在選單面板（z-index 1）之上，主列不被面板蓋住
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

.app-header--dark,
.app-header--orange {
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
