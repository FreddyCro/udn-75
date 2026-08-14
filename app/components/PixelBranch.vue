<script lang="ts" setup>
/**
 * PixelBranch — 4px 像素方塊沿 45° 階梯延伸的分支線（FormulaBlocks 用）。
 * 三條平行階梯、每步右下 +4px；預設「\」方向，flip 鏡射成「/」。
 * 兩種端面切法對稿兩份素材（同一支階梯，只差端面與步數）：
 *   bevel＝pc 分支線 1837:73149（44×44、9 步，起點錯開成 45° 斜切）
 *   flat ＝pad 斜帶 udn75_news_formula_link_*（76×60、15 步，三條齊步平切）
 * progress（0..1）換算已現身格數；order 依 from 決定從哪端長出（四條都要自中央塊往外）。
 */
const props = withDefaults(
  defineProps<{
    /** 畫線進度（0..1）：0 整條隱藏、1 整條現身；由父層的捲動進度驅動 */
    progress?: number;
    /** 鏡射為「/」方向（預設「\」） */
    flip?: boolean;
    /** 逐格出現的起點端：start = 圖形左上端、end = 右下端 */
    from?: 'start' | 'end';
    /** 階梯步數（pc 9／pad 15） */
    steps?: number;
    /** 端面切法：bevel = 45° 斜切（pc）、flat = 平切（pad） */
    cut?: 'bevel' | 'flat';
  }>(),
  { progress: 0, flip: false, from: 'start', steps: 9, cut: 'bevel' },
);

// 三條平行階梯的起點（px）：bevel 起點錯開（端面呈 45°）、flat 同列起步（端面齊平）
const RAYS = {
  bevel: [
    { x: 4, y: 4 },
    { x: 8, y: 0 },
    { x: 0, y: 8 },
  ],
  flat: [
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: 16, y: 0 },
  ],
} as const;

// bevel 為正方（階梯 + 兩端斜切各 8）；flat 高＝階梯長、寬多出三條的橫向間距 16
const box = computed(() => {
  const run = props.steps * 4;
  return props.cut === 'flat'
    ? { w: run + 16, h: run }
    : { w: run + 8, h: run + 8 };
});
// 已現身的格數（取整 → progress 連續變化只在跨格時觸發重繪）
const revealed = computed(() =>
  Math.round(Math.min(1, Math.max(0, props.progress)) * props.steps),
);
const squares = computed(() =>
  RAYS[props.cut].flatMap((r) =>
    Array.from({ length: props.steps }, (_, i) => ({
      x: r.x + i * 4,
      y: r.y + i * 4,
      order: props.from === 'start' ? i : props.steps - 1 - i,
    })),
  ),
);
</script>

<template>
  <div
    class="pixel-branch"
    :class="{ 'pixel-branch--flip': flip }"
    :style="{ width: `${box.w}px`, height: `${box.h}px` }"
    aria-hidden="true"
  >
    <i
      v-for="(s, i) in squares"
      :key="i"
      class="pixel-branch__px"
      :class="{ 'is-on': s.order < revealed }"
      :style="{ left: `${s.x}px`, top: `${s.y}px` }"
    />
  </div>
</template>

<style lang="scss" scoped>
.pixel-branch {
  position: relative;
}

.pixel-branch--flip {
  transform: scaleX(-1);
}

// 像素風不淡入：進度跨過該格就整格現身
.pixel-branch__px {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-orange);
  opacity: 0;

  &.is-on {
    opacity: 1;
  }
}
</style>
