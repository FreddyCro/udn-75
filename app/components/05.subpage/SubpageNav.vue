<script lang="ts" setup>
/**
 * SubpageNav — 子頁最下方的「返回 / 下一篇」導覽。
 * 左：左箭頭圓框 + 「返回」；右：下一篇「標題：副標」+ 右箭頭圓框。
 * 皆為橘色 Light 文字；最後一頁（data）無 next，只顯示返回。
 */
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
        <svg
          class="subpage-nav__icon"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="25" cy="25" r="24.5" stroke="currentColor" />
          <path
            d="M27 29.5L23 25L27 21"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="subpage-nav__label">{{ backLabel }}</span>
      </a>

      <a
        v-if="next?.url"
        class="subpage-nav__link subpage-nav__link--next"
        :href="next.url"
      >
        <span class="subpage-nav__label">{{ next.title }}</span>
        <svg
          class="subpage-nav__icon"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="25" cy="25" r="24.5" stroke="currentColor" />
          <path
            d="M23 21L27 25.5L23 29.5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
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
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--subpage-wide-w); // 1064，與內文寬欄對齊
  margin: 0 auto;
  padding: 60px 20px 16px;

  @include rwd-mobile {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 40px 20px 16px;
  }
}

// 返回／前進連結：橘色 Light 文字 + 圓框箭頭（同色，走 currentColor）
.subpage-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--color-orange);
  text-decoration: none;

  &:hover .subpage-nav__label {
    text-decoration: underline;
  }
}

.subpage-nav__label {
  font-size: var(--text-body); // 18 / 36 Light
  line-height: var(--text-body--line-height);
  font-weight: 300;
  white-space: nowrap;

  @include rwd-mobile {
    white-space: normal;
  }
}

.subpage-nav__icon {
  display: block;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
}

// 前往下一篇：圓框箭頭大小循環呼吸縮放；Default＝圓形放大（scale 1）。
// hover 時取消 keyframes、以 transition 收斂回 Default（放大）狀態。
// TODO(figma): 縮放幅度／週期先照規格描述估值，取得檔案權限後對 #大小循環呼吸縮放動態 校正。
.subpage-nav__link--next .subpage-nav__icon {
  animation: subpage-nav-breathe 2.4s ease-in-out infinite;
  transition: transform 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.subpage-nav__link--next:hover .subpage-nav__icon {
  animation: none;
  transform: scale(1);
}

@keyframes subpage-nav-breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.7);
  }
}
</style>
