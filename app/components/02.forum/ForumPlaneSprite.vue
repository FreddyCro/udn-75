<!--
  紙飛機逐格 sprite。九格外框不同大小但底部對齊，故一律以**底部中心**為錨點：
  外層把它擺在哪，飛機就從那裡往上（＝行進方向）長出去。
-->
<script setup lang="ts">
import { FORUM_PLANE_FRAMES } from '~/utils/forum-plane-frames';

const props = withDefaults(defineProps<{ frame: number; scale?: number }>(), {
  scale: 1,
});

const current = computed(
  () =>
    FORUM_PLANE_FRAMES[
      Math.min(FORUM_PLANE_FRAMES.length - 1, Math.max(0, Math.round(props.frame)))
    ]!,
);
</script>

<template>
  <svg
    class="forum-plane"
    :viewBox="`0 0 ${current.w} ${current.h}`"
    :width="current.w * scale"
    :height="current.h * scale"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      v-for="(r, i) in current.rects"
      :key="i"
      :x="r[0]"
      :y="r[1]"
      :width="r[2]"
      :height="r[3]"
      fill="currentColor"
    />
  </svg>
</template>

<style lang="scss" scoped>
// 底部中心對齊外層的定位點（見檔頭）。外層負責旋轉，本層只管形狀。
.forum-plane {
  position: absolute;
  bottom: 0;
  left: 50%;
  display: block;
  transform: translateX(-50%);
}
</style>
