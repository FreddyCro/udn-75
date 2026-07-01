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

const anchors = str.headerAnchors as Anchor[];

// 頂部固定列的高度（用於錨點捲動時的偏移補償）
const HEADER_OFFSET = 83;

const progress = ref(0);
const activeTarget = ref<string>('');

// NmdHeaderShare 內部會 inject 'isHeaderShown'（原本由 NmdHeader 提供）。
// 這裡自行提供，避免 console 警告；本 header 常駐顯示故固定為 true。
provide('isHeaderShown', ref(true));

let observer: IntersectionObserver | null = null;
let rafId = 0;

function updateProgress() {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  progress.value = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0;
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
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

function scrollToTop(e?: Event) {
  e?.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  updateProgress();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // scroll-spy：以各區塊在視窗中央的可見度決定「當前錨點」
  const sections = anchors
    .map((a) => document.getElementById(a.target))
    .filter((el): el is HTMLElement => !!el);

  if (sections.length) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeTarget.value = entry.target.id;
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer?.observe(el));
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (rafId) window.cancelAnimationFrame(rafId);
  observer?.disconnect();
});
</script>

<template>
  <header class="app-header">
    <!-- 閱讀進度 -->
    <div class="app-header__progress">
      <div class="app-header__progress-bar" :style="{ width: `${progress}%` }" />
    </div>

    <!-- 頂部列（桌機：全部 / 手機：logo ＋ share） -->
    <div class="app-header__bar">
      <a class="app-header__logo" href="#" aria-label="聯合七五・智慧未來" @click="scrollToTop">
        <img :src="logoUrl" alt="聯合七五・智慧未來 UDN 75 — Shaping An Intelligent Future" />
      </a>

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

    <!-- 手機底部 TOC -->
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
$orange: #ff7f00;
$blue: #9fd6ff;
$gray: #686868;
$bar-bg: rgba(255, 255, 255, 0.7);
$pc-min: 1024px;

.app-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  font-family: 'Noto Sans TC', sans-serif;
}

.app-header__progress {
  position: relative;
  width: 100%;
  height: 3px;
  background-color: $blue;
}

.app-header__progress-bar {
  height: 100%;
  background-color: $orange;
  transition: width 0.15s linear;
}

.app-header__bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 80px;
  padding: 0 20px;
  margin: 0 auto;
  max-width: 1320px;
  background-color: $bar-bg;
  backdrop-filter: blur(2px);
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

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.app-header__share {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* 錨點連結（桌機 nav ＋ 手機 TOC 共用） */
.app-header__link {
  position: relative;
  flex-shrink: 0;
  padding: 4px 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  color: $gray;
  text-decoration: none;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: $orange;
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }

  &:hover::after,
  &.is-active::after {
    transform: scaleX(1);
  }

  &.is-active {
    color: $orange;
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
    height: 80px;
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
