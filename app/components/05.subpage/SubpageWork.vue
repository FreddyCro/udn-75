<script lang="ts" setup>
/** SubpageWork — 「得獎作品」清單的單一列；有 url 時整列為連結。 */
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
      <div v-if="desc" class="award-work__desc-wrap">
        <p class="award-work__desc">{{ desc }}</p>
      </div>
    </div>

    <span class="award-work__more">
      <span class="award-work__label">點擊看專題</span>
      <img
        class="award-work__arrow"
        src="/img/udn75_nav_prev.svg"
        alt=""
        aria-hidden="true"
      />
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

  @include rwd-max('tablet') {
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

// 描述收合／展開：grid-template-rows 0fr ↔ 1fr 平滑過渡（內容高度未知也可動畫）
.award-work__desc-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;

  .award-work:hover & {
    grid-template-rows: 1fr;
  }

  @media (hover: none) {
    grid-template-rows: 1fr; // 觸控環境無 hover → 一律展開
  }
}

.award-work__desc {
  margin: 0;
  min-height: 0;
  overflow: hidden;
  font-size: var(--text-caption); // 15 / 22
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  color: var(--color-body);
}

.award-work__more {
  position: relative;
  z-index: 3; // 連結在縮圖之上
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: var(--color-gray);
}

.award-work__label {
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  white-space: nowrap;
  opacity: 0; // 收合時只露圓框箭頭，hover 才浮現文字
  transition: opacity 0.2s ease;

  .award-work:hover & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }
}

.award-work__arrow {
  display: block;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  transform: scaleX(-1); // 素材箭頭朝左 → 鏡射指向右側
}
</style>
