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
import { refreshScrollTriggers } from '~/utils/scroll-trigger';
import { anchorSlug, streamTargetSlug } from '~/utils/subpage-stream';
import NewsArticle from '~/components/05.subpage/articles/NewsArticle.vue';
import VisualArticle from '~/components/05.subpage/articles/VisualArticle.vue';
import ServiceArticle from '~/components/05.subpage/articles/ServiceArticle.vue';
import DataArticle from '~/components/05.subpage/articles/DataArticle.vue';
import EducationArticle from '~/components/05.subpage/articles/EducationArticle.vue';
import HealthArticle from '~/components/05.subpage/articles/HealthArticle.vue';

definePageMeta({ layout: 'subpage' });

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

const route = useRoute();
const target = streamTargetSlug(route.hash, SLUGS);

// 錨點列切到「頁內捲動 ＋ scroll-spy」語意。**在 setup 就設**（不是 onMounted）：
// 這樣 prerender 出來的 HTML 裡錨點連結已經是 hash 形式，hydration 不會對不上。
// 還原由 layouts/subpage.vue 的 onBeforeUnmount 負責（見 useSubpageAnchor 檔頭）。
const { mode, activeSlug, jumpToSlug } = useSubpageAnchor();
mode.value = 'scroll';
activeSlug.value = target;

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

/**
 * 對齊落點。
 *
 * ⚠️ 一定要先 refreshScrollTriggers()：六篇的 pin 各自在 onMounted 建立，建立順序不保證
 *    由上到下，而 pin 的觸發點依賴上方所有 pin 的佔位都已算進去（理由見 utils/scroll-trigger
 *    的檔頭）。少這一刀，落點會漏算上游幾段佔位而偏高，且不會報錯。
 */
function realign() {
  refreshScrollTriggers();
  jumpToSlug(target);
}

/**
 * 落地之後的自動校正：字體載入、--vh 重算（viewport-height plugin）等都會晚一步觸發
 * refresh，各 pin 的絕對起點跟著變 → 已經對好的落點會漂掉。故在使用者還沒動之前，
 * 每次 refresh 都重新對齊；使用者一動就永久停手 —— 那之後再校正就是把人從閱讀位置拽走。
 */
function onRefresh() {
  if (userMoved) return;
  jumpToSlug(target);
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

onMounted(async () => {
  // ≥768 沒有連續閱讀版型（pad/pc 稿是一篇一頁，右側 rail 的語意也不對）→ 導回獨立子頁。
  // 分享連結與平板轉向都會走到這裡。**只在初次載入判斷、不監聽 resize**：
  // pc 使用者縮視窗時把人讀到一半傳送走，比版型不完美更糟。
  if (window.innerWidth >= TABLET_BREAKPOINTS) {
    await navigateTo(`/${target}`, { replace: true });
    return;
  }

  // 落點自己算，不讓瀏覽器插手：瀏覽器的捲動還原會在我們對齊之後才把位置搶回去，
  // 而它記的是上一次的文件高度（那時 pin 還沒建立）。離場時還原成 'auto'。
  history.scrollRestoration = 'manual';

  USER_EVENTS.forEach((e) =>
    window.addEventListener(e, markUserMoved, { passive: true, once: true }),
  );

  // 等六篇的 onMounted 跑完 —— 它們各自是 async（切 pin 版型 → nextTick → 建 pin）。
  // 子元件的 onMounted 早於本頁，但那個 await 之後的部分要等一次微任務；
  // 兩個 rAF 之後版面才是「pin 全部建好」的最終高度，此時量 offsetTop 才準。
  await nextTick();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      realign();
      startSpy();
    }),
  );
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  sectionEls.clear();
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
    <div
      v-for="slug in SLUGS"
      :key="slug"
      :ref="(el) => setSection(el, slug)"
      :data-subpage-anchor="slug"
    >
      <component :is="ARTICLES[slug]" />
    </div>
  </div>
</template>
