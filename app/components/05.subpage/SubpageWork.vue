<script lang="ts" setup>
/** SubpageWork — 「得獎作品」清單的單一列；有 url 時整列為連結。
 *  active = 觸發中的列（pc hover／<1280 滾至畫面中央），<1280 據此展開說明與連結。 */
withDefaults(
  defineProps<{
    title?: string;
    desc?: string;
    url?: string;
    active?: boolean;
  }>(),
  { url: '' },
);
</script>

<template>
  <component
    :is="url ? 'a' : 'div'"
    class="award-work"
    :class="{ 'award-work--active': active }"
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
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: var(--sp-work-y) 0;
  color: inherit;
  text-decoration: none;

  @include rwd-min('pc') {
    flex-direction: row;
    gap: 40px;
  }

  // 分隔線走底層（z1），會被懸浮縮圖蓋住；只有文字(z3)浮在圖上。
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
  max-width: 847px;
  word-break: break-word;
}

.award-work__title {
  margin: 0;
  font-size: 18px;
  line-height: 30px;
  font-weight: 400;
  color: var(--color-gray);
  transition: color 0.2s ease;

  .award-work:hover & {
    color: var(--color-orange);
  }

  @include rwd-min('pc') {
    font-size: var(--text-h5);
    line-height: var(--text-h5--line-height);
    font-weight: 500;
    color: var(--color-body);
  }
}

// 描述收合／展開：grid-template-rows 0fr ↔ 1fr，內容高度未知也能平滑過渡
// 展開後的 margin-top 若改值，SubpageWorks activate() 內的展開高度推算需同步
.award-work__desc-wrap {
  display: grid;
  grid-template-rows: 0fr;
  // margin 跟著一起過渡，收合列才不會殘留空隙
  margin-top: 0;
  transition:
    grid-template-rows 0.3s ease,
    margin-top 0.3s ease;

  .award-work:hover &,
  .award-work--active & {
    grid-template-rows: 1fr;
    margin-top: 8px;
  }
}

.award-work__desc {
  margin: 0;
  min-height: 0;
  overflow: hidden;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 300;
  color: var(--color-gray);
  text-align: justify;

  @include rwd-min('pc') {
    font-weight: 400;
    color: var(--color-body);
    text-align: left;
  }
}

.award-work__more {
  position: relative;
  z-index: 3; // 連結在縮圖之上
  display: none; // <1280 只在 active 列顯示；pc 常駐
  align-self: flex-end;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: var(--color-gray);

  .award-work--active & {
    display: inline-flex;
  }

  @include rwd-min('pc') {
    display: inline-flex;
    align-self: auto;
  }
}

.award-work__label {
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  font-weight: 400;
  white-space: nowrap;
  opacity: 0; // 收合時只露圓框箭頭，hover 才浮現文字
  transition: opacity 0.2s ease;

  .award-work:hover &,
  .award-work--active & {
    opacity: 1;
  }
}

.award-work__arrow {
  display: block;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  transform: scaleX(-1); // 素材箭頭朝左 → 鏡射指向右側

  @include rwd-min('tablet') {
    width: 30px;
    height: 30px;
  }
}
</style>
