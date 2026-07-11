<script lang="ts" setup>
/**
 * SubpageWork — 「得獎作品」清單的單一列。
 * 左：作品標題（H5 Medium）＋描述（caption 灰）；右：橘色「點擊看專題」＋圓框箭頭。
 * 每列上緣一條分隔線；有 url 時整列為連結。
 */
withDefaults(
  defineProps<{
    title?: string;
    desc?: string;
    url?: string;
  }>(),
  { url: '' },
);
</script>

<template>
  <component
    :is="url ? 'a' : 'div'"
    class="award-work"
    :href="url || undefined"
    :target="url ? '_blank' : undefined"
    :rel="url ? 'noopener noreferrer' : undefined"
  >
    <div class="award-work__text">
      <p v-if="title" class="award-work__title">{{ title }}</p>
      <p v-if="desc" class="award-work__desc">{{ desc }}</p>
    </div>

    <span class="award-work__more">
      <span class="award-work__label">點擊看專題</span>
      <svg
        class="award-work__arrow"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="15" cy="15" r="14.5" stroke="currentColor" />
        <path
          d="M13.8 12.6L16.2 15.3L13.8 17.7"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </component>
</template>

<style lang="scss" scoped>
.award-work {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
  padding: var(--sp-work-y) 0;
  color: inherit;
  text-decoration: none;

  @include rwd-mobile {
    flex-direction: column;
    gap: 12px;
  }

  // 分隔線走底層（z1），會被懸浮縮圖(z2)蓋住，只有文字(z3)在圖上。
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 1px;
    background: var(--color-line);
  }

  &:last-child::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 1px;
    background: var(--color-line);
  }
}

.award-work__text {
  position: relative;
  z-index: 3; // 文字在縮圖之上
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 847px;
  word-break: break-word;
}

.award-work__title {
  margin: 0;
  font-size: var(--text-h5); // 20 / 32 Medium
  line-height: var(--text-h5--line-height);
  font-weight: 500;
  color: var(--color-body);
  transition: color 0.2s ease;

  .award-work:hover & {
    color: var(--color-orange);
  }
}

.award-work__desc {
  margin: 0;
  font-size: var(--text-caption); // 15 / 22
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  color: var(--color-body);
}

// 右側連結：橘色文字 + 圓框箭頭（同色，走 currentColor）
.award-work__more {
  position: relative;
  z-index: 3; // 連結在縮圖之上
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: var(--color-orange);
}

.award-work__label {
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  white-space: nowrap;
}

.award-work__arrow {
  display: block;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
}
</style>
