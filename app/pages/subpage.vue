<script lang="ts" setup>
/**
 * 連續閱讀頁（手機版限定）：六篇子頁串成同一份文件，網址 hash 決定落在哪一篇。
 *
 * 為什麼是獨立一頁而不是改六個子頁：六個子頁的 pad/pc 路徑一個字都不用動，
 * prerender 出來的六份 HTML 維持原樣。首頁的清單（MediaList）在 <768 時改指到這裡。
 *
 * 文件順序固定 01→06（＝ common.json 的 subpageAnchors 順序），與錨點編號一致；
 * hash 只決定落點，不改變順序。
 *
 * ⚠️ 內容與六個子頁共用同一組 article 元件（見 05.subpage/articles/），文案與排版沒有
 *    第二份。GSAP 也沒有第二套 —— 子頁的 ScrollTrigger 全部綁在元素自己身上
 *    （trigger: root/section ＋ start: 'top top'），與它在文件裡的絕對位置無關，
 *    所以同一篇放在第 1 屏或第 40 屏，行為完全相同。
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import common from '~/locales/common.json';
import { TABLET_BREAKPOINTS } from '~/utils/constants';
import { pickActiveAnchor } from '~/utils/anchor-spy';
import {
  refreshOnContentResize,
  refreshOnFontsReady,
  refreshScrollTriggers,
} from '~/utils/scroll-trigger';
import { anchorSlug, streamTargetSlug } from '~/utils/subpage-stream';
import NewsArticle from '~/components/05.subpage/articles/NewsArticle.vue';
import VisualArticle from '~/components/05.subpage/articles/VisualArticle.vue';
import ServiceArticle from '~/components/05.subpage/articles/ServiceArticle.vue';
import DataArticle from '~/components/05.subpage/articles/DataArticle.vue';
import EducationArticle from '~/components/05.subpage/articles/EducationArticle.vue';
import HealthArticle from '~/components/05.subpage/articles/HealthArticle.vue';

// 六份舞台各有 ScrollTrigger pin，轉場不能帶 transform（會鎖住縮放後的尺寸、切頁時彈一下）：
// 理由與實測數字見 assets/styles/base.scss 的 .page-fade-* 註解。
definePageMeta({
  layout: 'subpage',
  pageTransition: { name: 'page-fade', mode: 'out-in' },
});

/** slug → 內容元件。文件順序不由這裡決定（見下方 SLUGS），這張表只管對應。 */
const ARTICLES = {
  news: NewsArticle,
  visual: VisualArticle,
  service: ServiceArticle,
  data: DataArticle,
  education: EducationArticle,
  health: HealthArticle,
};

/**
 * 文件順序＝錨點順序，單一來源是 locales/common.json。
 * 對不到元件的項目直接濾掉並在 dev 吼一聲 —— 靜默少一篇比報錯難查太多。
 */
const SLUGS = common.subpageAnchors
  .map((a) => anchorSlug(a.url))
  .filter((slug): slug is keyof typeof ARTICLES => {
    if (slug in ARTICLES) return true;
    if (import.meta.dev) {
      console.warn(`[subpage] common.json 的 ${slug} 沒有對應的 article 元件`);
    }
    return false;
  });

// 錨點列切到「頁內捲動 ＋ scroll-spy」語意。**在 setup 就設**（不是 onMounted）：
// 這樣 prerender 出來的 HTML 裡錨點連結已經是 hash 形式，hydration 不會對不上。
// 還原由 layouts/subpage.vue 的 onBeforeUnmount 負責（見 useSubpageAnchor 檔頭）。
const { mode, activeSlug, jumpToSlug, slugTop } = useSubpageAnchor();
mode.value = 'scroll';

/**
 * 落點 slug：**延後到真的讀到 hash 才決定**，而且只認一次（之後 hash 隨捲動被
 * replaceState 改掉，不能再當落點）。讀不到就回 null ＝「現在不要介入捲軸」。
 *
 * ⚠️ 為什麼不能在 setup 算好（踩過兩次）：
 *    ① `useRoute().hash` 在 prerender 的 production 頁上是空字串（初始路由是從 prerender
 *      的路徑還原的，那裡沒有 hash）；dev 模式反而讀得到，所以只在正式環境現形。
 *    ② 連 `window.location.hash` 在 setup 那一刻也還是空的 —— Nuxt 初始導航會先正規化網址。
 *    實測 production 的執行序（/subpage?v=3#data）：
 *      2848 mount target=news   ← 在 setup 算，只能算出 fallback
 *      3569 fix 27244->0        ← 於是我們親手把瀏覽器已經正確捲到的位置**拉回第一篇**
 *    比「沒有落地」更糟：是主動破壞原生 hash 捲動的正確結果。
 *
 * ⚠️ 回 null 時什麼都不做，剛好也是「使用者開的是沒有 hash 的 /subpage」該有的行為 ——
 *    那本來就該停在第一篇（＝文件頂端），不需要任何介入。
 */
let landingSlug: string | null = null;
function resolveLanding(): string | null {
  if (landingSlug) return landingSlug;
  if (!import.meta.client) return null;
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return null; // 還沒讀到（或本來就沒有）→ 不介入
  landingSlug = streamTargetSlug(raw, SLUGS);
  return landingSlug;
}

// 本頁是六篇的聚合，內容與 /news…/health 重複 → 不進索引。
// 六個獨立子頁維持可索引：我們**不做** /news → /subpage 的轉址，所以不會出現
// 「行動版爬蟲被導進 noindex 頁、正式內容從索引消失」那個坑。
useSeoMeta({ robots: 'noindex, follow' });

/** 六篇的包裝元素 → slug；scroll-spy 與頁內捲動都靠這張表 */
const sectionEls = new Map<HTMLElement, string>();
const setSection = (el: unknown, slug: string) => {
  if (el instanceof HTMLElement) sectionEls.set(el, slug);
};

let observer: IntersectionObserver | null = null;

/** 使用者一動就不再自動校正落點（見 onRefresh） */
let userMoved = false;
const markUserMoved = () => {
  userMoved = true;
};
const USER_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/** 落點容許誤差（px）：小於此值就當已就位，不再寫捲軸 */
const LANDING_EPSILON = 2;
/**
 * 「按住落點」的硬上限（ms）。
 * 正常的結束條件是**使用者介入**（userMoved），這個上限只是防呆：萬一某個環境永遠不發
 * 使用者事件，也不能無限期霸著捲軸。給到 8 秒是因為結束條件不是「等版面穩定」——
 * 實測有晚到的角色會把捲軸拉回 0（見 holdLanding 的說明），時間上限開太小就會漏接。
 */
const LANDING_HOLD_MS = 8000;
/** rAF 排不到時（分頁不可見）的備援發車時間（ms） */
const LANDING_KICK_FALLBACK_MS = 250;
/** 按住落點的確認間隔（ms）；約當一幀，但不依賴 rAF */
const LANDING_TICK_MS = 16;
/**
 * 等 hash 出現的上限（ms）。逾時就當「沒有 hash」處理（＝停在第一篇、不介入捲軸）。
 * 需要這段等待是因為 hash 在 setup 當下讀不到（見 resolveLanding 的說明）。
 */
const LANDING_DECIDE_MS = 1000;

/**
 * 落點相關的計時器一律走這裡登記，離場時 clearLandingTimers() 一起清。
 *
 * ⚠️ 非清不可：holdLanding 與 awaitLandingDecision 都是 setTimeout 自我遞迴的迴圈，
 *    結束條件是「使用者動了」或 8 秒／1 秒的上限 —— **換頁不在結束條件裡**。沒清的話
 *    離場後它們照跑，對著下一個路由的文件量 offsetTop、呼叫 window.scrollTo。
 *    現在只是因為 slugTop 在新文件裡回 null 才沒出事，那是巧合不是設計。
 */
const landingTimers = new Set<ReturnType<typeof setTimeout>>();
function later(fn: () => void, ms: number) {
  const id = setTimeout(() => {
    landingTimers.delete(id);
    fn();
  }, ms);
  landingTimers.add(id);
}
function clearLandingTimers() {
  landingTimers.forEach(clearTimeout);
  landingTimers.clear();
}

/**
 * 對齊落點，然後在短窗口內**每幀確認一次**，被別人推開就再拉回來。
 *
 * ⚠️ 為什麼不是「對齊一次」就好：初次載入會動到捲軸的不只一個角色 ——
 *    ① Nuxt router 的 scrollBehavior（初次載入會處理 hash／回頂）
 *    ② 六篇的 pin 在各自 onMounted 建立後，上方佔位才進到版面
 *    ③ 字體載入與 --vh 重算（viewport-height plugin）觸發的 ScrollTrigger refresh
 *    實測 390×844 直接開 /subpage#health：對齊後 health 的 offsetTop 仍從 37984
 *    漂到 39322（+1338px）。把這些角色的先後順序一條條排出來既脆又難維護
 *    （而且失敗是靜默的：人就是落在別節），改成「持續確認到穩定」。
 *    每幀重讀目標 offsetTop → 會跟著漂移走，不是死記一個數字。
 *
 * ⚠️ 結束條件是「使用者介入」，**不是**計時器或「版面看起來穩了」。實測用 1.5 秒上限時
 *    落地是時好時壞的：字體已快取時 fonts.ready 立刻 resolve、校正提早跑完，之後仍有
 *    晚到的角色把捲軸拉回 0，就再也沒人糾正（scrollY 停在 0，人落在第一篇）。
 *    只要使用者還沒碰，就持續確認 —— 那才是「他要求的落點」還有效的判準。
 *
 * ⚠️ 一定要先 refreshScrollTriggers()：六篇的 pin 建立順序不保證由上到下，而 pin 的觸發點
 *    依賴上方所有 pin 的佔位都已算進去（理由見 utils/scroll-trigger 的檔頭）。
 *
 * 使用者一動就立刻放手（userMoved）—— 那之後再拉就是把人從閱讀位置拽走。
 */
function holdLanding(slug: string) {
  const deadline = performance.now() + LANDING_HOLD_MS;
  const tick = () => {
    if (userMoved || performance.now() > deadline) return;
    const top = slugTop(slug);
    if (top !== null && Math.abs(window.scrollY - top) > LANDING_EPSILON) {
      window.scrollTo({ top, behavior: 'auto' });
    }
    // 用 setTimeout 而非 rAF：分頁不可見時 rAF 完全不觸發，這個迴圈就停在半路
    // （同 onMounted 裡發車的理由）。只有偏差超過 EPSILON 才寫捲軸，所以逐幀確認不花成本。
    later(tick, LANDING_TICK_MS);
  };
  tick();
}

/**
 * 落地之後的自動校正：字體載入、--vh 重算（viewport-height plugin）等都會晚一步觸發
 * refresh，各 pin 的絕對起點跟著變 → 已經對好的落點會漂掉。故在使用者還沒動之前，
 * 每次 refresh 都重新對齊；使用者一動就永久停手 —— 那之後再校正就是把人從閱讀位置拽走。
 */
function onRefresh() {
  if (userMoved || !landingSlug) return;
  jumpToSlug(landingSlug);
}

/** 只跑一次的發車閘：rAF 與 setTimeout 兩路都會叫它（見 onMounted） */
let kicked = false;
function kick() {
  if (kicked) return;
  kicked = true;
  // 六篇的 pin 建立順序不保證由上到下，而 pin 的觸發點依賴上方所有 pin 的佔位都已算進去
  // （理由見 utils/scroll-trigger 的檔頭）。量任何 offsetTop 之前先補這一刀。
  refreshScrollTriggers();
  awaitLandingDecision(performance.now() + LANDING_DECIDE_MS);
}

/**
 * 等到「落點是哪一篇」有答案，才動捲軸、才啟動 spy。
 *
 * ⚠️ spy 一啟動就會隨捲動 replaceState 改寫 hash。若在落點決定之前就啟動，它會把 hash
 *    改成當下所在的那一篇（初始為第一篇），resolveLanding 之後就只讀得到被覆寫的值 ——
 *    落點永遠是第一篇，而且看起來像「hash 沒作用」。所以順序不能反。
 *
 * 逾時（讀不到 hash）＝ 使用者開的是沒有 hash 的 /subpage：不需要落地，直接啟動 spy。
 */
function awaitLandingDecision(deadline: number) {
  const slug = resolveLanding();
  if (!slug && !userMoved && performance.now() < deadline) {
    later(() => awaitLandingDecision(deadline), LANDING_TICK_MS);
    return;
  }

  // ≥768 沒有連續閱讀版型（pad/pc 稿是一篇一頁，右側 rail 的語意也不對）→ 導回獨立子頁。
  // 分享連結與平板轉向都會走到這裡。**只在初次載入判斷、不監聽 resize**：
  // pc 使用者縮視窗時把人讀到一半傳送走，比版型不完美更糟。
  //
  // ⚠️ 放在落點決定之後：導回的目標就是那一篇，早跑會只導回第一篇。
  // ⚠️ 用 location.replace（整份文件重載）而不是 navigateTo：實測 1440×900 直接開
  //    /subpage#service，navigateTo 被呼叫了卻**永遠不完成** —— 網址沒變、六節還在 DOM 裡。
  //    這是邊緣情境（桌機開到手機版網址），不值得跟 router 的初始生命週期纏鬥。
  //    resolve().href 會帶上 baseURL（本站部署在子路徑，見 nuxt.config 的 app.baseURL）。
  if (window.innerWidth >= TABLET_BREAKPOINTS) {
    location.replace(router.resolve(`/${slug || SLUGS[0]}`).href);
    return;
  }

  activeSlug.value = slug || SLUGS[0] || '';
  if (slug) holdLanding(slug);
  startSpy();
}

function startSpy() {
  // 中央帶判定，與 AppHeader 的幾何 spy 同一套（見 utils/anchor-spy）：
  // rootMargin 把視窗上下各收 45%，只留中間一條窄帶 —— 同一時間只有一篇命中。
  const visible = new Set<HTMLElement>();
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else visible.delete(el);
      }
      const next = pickActiveAnchor(SLUGS, sectionEls, visible);
      if (!next || next === activeSlug.value) return;
      activeSlug.value = next;
      // 網址跟著捲動走，六個 hash 才真的「各自對應一節」（分享得出去）。
      // replace 不堆歷史：上一頁該回到來源（首頁），不是回到上一節。
      history.replaceState(history.state, '', `#${next}`);
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  sectionEls.forEach((_slug, el) => observer?.observe(el));
  ScrollTrigger.addEventListener('refresh', onRefresh);
}

const router = useRouter();

/** refreshOnContentResize() 的解除掛鉤（離場時呼叫） */
let stopContentResize: (() => void) | null = null;

onMounted(async () => {
  await nextTick();

  // 落點自己算，不讓瀏覽器插手：瀏覽器的捲動還原會在我們對齊之後才把位置搶回去，
  // 而它記的是上一次的文件高度（那時 pin 還沒建立）。離場時還原成 'auto'。
  history.scrollRestoration = 'manual';

  USER_EVENTS.forEach((e) =>
    window.addEventListener(e, markUserMoved, { passive: true, once: true }),
  );

  // 啟動落點對齊與 spy。
  //
  // 上面那個 nextTick 同時也讓六篇的 onMounted 跑完 —— 它們各自是 async（切 pin 版型 →
  // nextTick → 建 pin），子元件的 onMounted 雖然早於本頁，但那個 await 之後的部分要等一次
  // 微任務。再加上兩個 rAF，版面才是「pin 全部建好」的最終高度，此時量 offsetTop 才準。
  //
  // ⚠️ 為什麼不能只靠 rAF：**分頁不可見時 rAF 不會觸發**（背景開連結、從別的 app 切回來
  //    都算），雙 rAF 會一直排不到，落點對齊等於沒跑 —— 實測伺服器重啟後的第一次載入就是
  //    這樣落在第一篇。所以 rAF 與 setTimeout 兩路都發車，誰先到誰算，kick 自帶只跑一次的閘。
  //    仍保留 rAF 那一路：可見時它比 setTimeout 更早、且保證在一次繪製之後（版面已定）。
  requestAnimationFrame(() => requestAnimationFrame(kick));
  later(kick, LANDING_KICK_FALLBACK_MS);

  // 網頁字體載入完成後的重排。
  //
  // ⚠️ 這是實測抓到、而且上面兩道網都攔不到的一項：字體 swap 之後六節的中文內文全部重排，
  //    實測 390×844 的 /subpage 文件高從 47497 長到 48835（+1338），health 的落點跟著
  //    位移約 250px。它發生在 holdLanding 的窗口之後，而**字體 swap 不會觸發
  //    ScrollTrigger 的 refresh**，所以 onRefresh 也攔不到。
  //
  // ⚠️ 走 refreshOnFontsReady() 而不是自己 `await document.fonts.ready`：後者沒有離場
  //    守衛（字體載入途中換頁的話，await 之後的重算與落點校正會落在下一個路由），而且
  //    每次進站都重掛一次。單一入口自帶模組層的只註冊一次旗子。落點校正也不必自己補打 ——
  //    startSpy() 已經把 onRefresh 掛在 ScrollTrigger 的 refresh 事件上，這一刀會順著過去。
  refreshOnFontsReady();

  // 內容高度一變就重算。**這是連續閱讀頁「下一篇 hero 疊到上一篇內文」的解**：
  // pin 的起訖是量完就固定的絕對座標，冷啟動時陸續載入的內文圖（48 張有 44 張沒有保留
  // 尺寸）與 SubpageWorks 的列展開（+136px）都會把下面每一篇的舞台往下推，而 pin 不知道。
  // 完整脈絡與實測數字見 utils/scroll-trigger 的 refreshOnContentResize。
  stopContentResize = refreshOnContentResize();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  sectionEls.clear();
  clearLandingTimers();
  stopContentResize?.();
  stopContentResize = null;
  ScrollTrigger.removeEventListener('refresh', onRefresh);
  USER_EVENTS.forEach((e) => window.removeEventListener(e, markUserMoved));
  if (import.meta.client) history.scrollRestoration = 'auto';
});
</script>

<template>
  <div class="subpage-stream">
    <!-- 固定 01→06。每篇包一層帶 data-subpage-anchor 的 div，供錨點列的頁內捲動與
         scroll-spy 定位（屬性名的單一來源是 utils/subpage-stream 的 SUBPAGE_ANCHOR_ATTR）。
         包裝層不設 position／transform，不會變成 pin（position: fixed）的定位基準。 -->
    <!-- id＝slug：讓 `#health` 這種網址對瀏覽器與 Nuxt router 也有意義（找不到對應元素
         時 scrollBehavior 會直接回頂，等於跟我們的落點對打）。精準對齊仍由 holdLanding
         負責 —— 原生 hash 捲動同樣會被後續的版面漂移甩掉。 -->
    <div
      v-for="slug in SLUGS"
      :id="slug"
      :key="slug"
      :ref="(el) => setSection(el, slug)"
      :data-subpage-anchor="slug"
    >
      <component :is="ARTICLES[slug]" />
    </div>
  </div>
</template>
