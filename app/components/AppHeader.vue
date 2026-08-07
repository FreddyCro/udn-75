<script setup lang="ts">
import { NmdHeaderShare } from '@udn-digital-center/common-components';
import { shareURL_fb, shareURL_line, shareURL_twitter } from '@/utils/share';
import str from '@/locales/common.json';
import logoUrl from '@/assets/img/logo.svg';

/**
 * AppHeader — 只做白底版本。
 * - 桌機（≥1024px）：logo 靠左 ＋ 錨點導覽 ＋ share，合併於頂部單一列。
 * - 手機（<1024px）：頂部 navbar（logo 置中 ＋ share）＋ 底部 TOC（三個錨點）。
 * - 頂部閱讀進度條（橘色進度 / 淺藍底軌）。
 * 沿用原 app header 的 share 功能（NmdHeaderShare）。
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

const progress = ref(0);
const activeTarget = ref<string>('');
// header 是否顯示。autoHide=false 時自始為 true（含 SSR），避免子頁載入時的滑入動畫；
// autoHide=true 時初始隱藏，待 hero 完全捲離視窗才顯示。
const isVisible = ref(!props.autoHide);
const anchors = str.headerAnchors as Anchor[];

// NmdHeaderShare 內部會 inject 'isHeaderShown'（原本由 NmdHeader 提供）。
// 這裡自行提供，避免 console 警告；本 header 常駐顯示故固定為 true。
provide('isHeaderShown', ref(true));

let observer: IntersectionObserver | null = null;
let heroObserver: IntersectionObserver | null = null;
let rafId = 0;
let heroRafId = 0;

onMounted(() => {
  updateProgress();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // scroll-spy：以各區塊在視窗中央的可見度決定「當前錨點」
  const sections = anchors
    .map((a) => document.getElementById(a.target))
    .filter((el): el is HTMLElement => !!el);

  if (sections.length) {
    // 維護「目前與中央帶重疊的區塊」集合，再由它推導 activeTarget。
    // 只在 isIntersecting 時設值（不處理離開）會讓錨點永遠停在第一個曾命中的區塊上：
    // hero 期間 ScrollTrigger 還沒建立 pin spacer，文件較短、#forum 位置偏高會誤觸一次，
    // 之後就再也清不掉 —— 表現就是 hero 時「論壇」已經是 active。
    const visible = new Set<string>();
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        // 同時命中兩區塊時取文件順序較前者（＝ anchors 的順序）。
        activeTarget.value =
          anchors.find((a) => visible.has(a.target))?.target ?? '';
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    sections.forEach((el) => observer?.observe(el));
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

function onScroll() {
  if (rafId) return;
  rafId = window.requestAnimationFrame(() => {
    updateProgress();
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
</script>

<template>
  <header class="app-header" :class="{ 'is-visible': isVisible }">
    <!-- 閱讀進度 -->
    <div v-show="isVisible" class="app-header__progress">
      <div
        class="app-header__progress-bar"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- 頂部列（桌機：全部 / 手機：logo ＋ share） -->
    <div class="app-header__bar-wrap">
      <div class="app-header__bar">
        <a
          class="app-header__logo"
          href="#"
          aria-label="聯合七五・智慧未來"
          @click="scrollToTop"
        >
          <img
            :src="logoUrl"
            alt="聯合七五・智慧未來 UDN 75 — Shaping An Intelligent Future"
          />
        </a>

        <div class="app-header__nav-wrap">
          <nav class="app-header__nav">
            <a
              v-for="anchor in anchors"
              :key="anchor.target"
              class="app-header__link"
              :class="{ 'is-active': activeTarget === anchor.target }"
              :href="`#${anchor.target}`"
              @click="scrollToTarget(anchor.target, $event)"
            >
              {{ anchor.title }}
            </a>
          </nav>

          <div class="app-header__share">
            <ClientOnly>
              <NmdHeaderShare
                :facebook="{ href: shareURL_fb }"
                :line="{ href: shareURL_line, target: '_blank' }"
                :twitter="{ href: shareURL_twitter }"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <!--
      手機底部 TOC（首頁區塊錨點）。
      注意：子頁（layouts/subpage.vue）用 SubpageAnchorBar 佔住視窗下緣同一位置，
      目前由該 layout 以 :deep(.app-header__toc) { display: none } 就地關掉；
      待 header／layout 統一調整時改為由此元件控制（見該 layout 的 TODO）。
    -->
    <nav class="app-header__toc">
      <a
        v-for="anchor in anchors"
        :key="anchor.target"
        class="app-header__link"
        :class="{ 'is-active': activeTarget === anchor.target }"
        :href="`#${anchor.target}`"
        @click="scrollToTarget(anchor.target, $event)"
      >
        {{ anchor.title }}
      </a>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
$bar-bg: rgba(255, 255, 255, 0.7);
$pc-min: 1024px;

.app-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  font-family: 'Noto Sans TC', sans-serif;
}

/* 顯示/隱藏：捲過 hero 後才滑入。
   注意：transform 不可加在 .app-header 上，否則會成為底部 fixed TOC 的
   containing block，害 .app-header__toc 的 bottom 定位跑掉。因此上方列與
   底部 TOC 各自做位移動畫。 */
.app-header__bar-wrap {
  transition: transform 0.3s ease;
  transform: translateY(-100%);
}

.app-header__toc {
  transition: transform 0.3s ease;
  transform: translateY(100%);
}

.app-header.is-visible {
  .app-header__bar-wrap,
  .app-header__toc {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header__progress,
  .app-header__bar-wrap,
  .app-header__toc {
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

.app-header__bar-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  background-color: $bar-bg;
  backdrop-filter: blur(2px);
}

.app-header__bar {
  position: relative;
  width: 100%;
  max-width: 1920px;
  height: calc(var(--header-height) - 3px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 20px;
}

.app-header__logo {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  img {
    display: block;
    width: auto;
    height: 37px;
  }
}

.app-header__nav-wrap {
  display: flex;
  align-items: center;
  gap: 32px;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

/* NmdHeaderShare 的圖示顏色（設計稿：只有 fb／line／X 用 light gray，其餘用 dark gray）。
   三顆社群圖示的 svg 內建深色 fill（#232323 / #0F1419）寫死在 path 上，只能 :deep 蓋掉；
   同層的 <rect> 都是 fill="none"，故選 path 不會誤填背景。
   toggler 的 share 圖示本來就吃 --color（預設 #222222），改給 dark gray 即可。 */
.app-header__share {
  flex-shrink: 0;
  display: flex;
  align-items: center;

  :deep(.nmd-share-buttons__share-button .nmd-share-button__icon path) {
    fill: var(--color-gray-light);
  }

  :deep(.nmd-share-buttons__toggler) {
    --color: var(--color-gray);
  }
}

/* 錨點連結（桌機 nav ＋ 手機 TOC 共用） */
.app-header__link {
  position: relative;
  flex-shrink: 0;
  padding: 4px 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-gray);
  text-decoration: none;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: var(--color-orange);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }

  &:hover::after,
  &.is-active::after {
    transform: scaleX(1);
  }

  &.is-active {
    color: var(--color-orange);
  }
}

/* 手機底部 TOC（預設隱藏，<1024px 顯示） */
.app-header__toc {
  display: none;
}

/* ---- 手機（<1024px） ---- */
@media screen and (max-width: #{$pc-min - 0.02px}) {
  .app-header__bar {
    justify-content: center;
    height: calc(var(--header-height) - 3px);
  }

  .app-header__nav {
    display: none;
  }

  .app-header__logo img {
    height: 34px;
  }

  .app-header__share {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .app-header__toc {
    position: fixed;
    inset: auto 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    height: 60px;
    padding: 0 16px;
    background-color: $bar-bg;
    backdrop-filter: blur(2px);
  }
}
</style>
