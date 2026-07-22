<script lang="ts" setup>
/**
 * PixelBranch — 4px 像素方塊沿 45° 階梯延伸的分支線（FormulaBlocks 用）。
 * 圖形對稿 Figma 1837:73149 的分支線素材（44×44）：三條平行階梯
 * （起點：中 (4,4)、上 (8,0)、下 (0,8)），每步右下 +4px，9 步 = 44×44。
 * 預設「\」方向，flip 鏡射成「/」。
 * active 後逐格出現：delay + order × 0.03s；order 依 from 決定從哪端長出，
 * 讓四條線都能「從中央塊往外畫」。
 */
const props = withDefaults(
  defineProps<{
    /** 觸發逐格進場（false 時整條隱藏） */
    active?: boolean;
    /** 鏡射為「/」方向（預設「\」） */
    flip?: boolean;
    /** 逐格出現的起點端：start = 圖形左上端、end = 右下端 */
    from?: 'start' | 'end';
    /** 階梯步數（對稿素材為 9） */
    steps?: number;
    /** 第一格出現前的延遲（秒） */
    delay?: number;
  }>(),
  { active: false, flip: false, from: 'start', steps: 9, delay: 0 },
);

// 三條平行階梯的起點（px），對照 44×44 素材
const RAYS = [
  { x: 4, y: 4 },
  { x: 8, y: 0 },
  { x: 0, y: 8 },
];

const size = computed(() => props.steps * 4 + 8);
const squares = computed(() =>
  RAYS.flatMap((r) =>
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
    :class="{ 'pixel-branch--flip': flip, 'is-on': active }"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      '--delay': `${delay}s`,
    }"
    aria-hidden="true"
  >
    <i
      v-for="(s, i) in squares"
      :key="i"
      class="pixel-branch__px"
      :style="{ left: `${s.x}px`, top: `${s.y}px`, '--order': s.order }"
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

.pixel-branch__px {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-orange);
  opacity: 0;

  .pixel-branch.is-on & {
    // steps(1) + both：到 delay 時間點瞬間現身（像素風，不淡入）
    animation: pixel-branch-in 0.01s steps(1) both;
    animation-delay: calc(var(--delay, 0s) + var(--order) * 0.03s);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
    }
  }
}

@keyframes pixel-branch-in {
  to {
    opacity: 1;
  }
}
</style>
