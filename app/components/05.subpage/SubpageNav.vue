<script lang="ts" setup>
/** SubpageNav — 子頁最下方的「返回 / 下一篇」導覽。 */
withDefaults(
  defineProps<{
    backUrl?: string;
    backLabel?: string;
    next?: { title?: string; url?: string };
  }>(),
  { backUrl: '/', backLabel: '返回' },
);
</script>

<template>
  <nav class="subpage-nav">
    <div class="subpage-nav__inner">
      <a class="subpage-nav__link subpage-nav__link--back" :href="backUrl">
        <img
          class="subpage-nav__icon subpage-nav__icon--prev"
          src="/img/udn75_nav_prev.svg"
          alt=""
          aria-hidden="true"
        />
        <span class="subpage-nav__label">{{ backLabel }}</span>
      </a>

      <a
        v-if="next?.url"
        class="subpage-nav__link subpage-nav__link--next"
        :href="next.url"
      >
        <span class="subpage-nav__label">{{ next.title }}</span>
        <img
          class="subpage-nav__icon subpage-nav__icon--next"
          src="/img/udn75_nav_next.svg"
          alt=""
          aria-hidden="true"
        />
      </a>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.subpage-nav {
  background: #fff;
}

.subpage-nav__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  max-width: var(--subpage-wide-w); // 與內文寬欄對齊
  margin: 0 auto;
  padding: 40px 26px 16px;

  @include rwd-min('tablet') {
    flex-direction: row;
    align-items: center;
    gap: 0;
    padding: 60px 32px 16px;
  }
  @include rwd-min('pc') {
    padding: 60px 20px 16px;
  }
}

.subpage-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--color-gray);
  text-decoration: none;

  &:hover .subpage-nav__label {
    text-decoration: underline;
  }
}

.subpage-nav__label {
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;
  letter-spacing: 1.8px;
  white-space: normal;

  @include rwd-min('tablet') {
    white-space: nowrap;
  }
}

.subpage-nav__icon {
  display: block;
  flex-shrink: 0;
}

.subpage-nav__icon--prev {
  width: 68px;
  height: 68px;
}

// 68~84px 循環呼吸縮放；hover 取消 keyframes、以 transition 收斂停在放大態
.subpage-nav__icon--next {
  width: 84px;
  height: 84px;
  animation: subpage-nav-breathe 2.4s ease-in-out infinite;
  transition: transform 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  .subpage-nav__link--next:hover & {
    animation: none;
    transform: scale(1);
  }
}

@keyframes subpage-nav-breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8095); // 68 / 84：縮至 68px
  }
}
</style>
