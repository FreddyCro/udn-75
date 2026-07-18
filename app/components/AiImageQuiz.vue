<script lang="ts" setup>
/**
 * AiImageQuiz — 「哪一張是 AI 生成圖？」二選一測驗（visual 頁）。
 *  - 兩張圖並排，各自為可點選按鈕。
 *  - 選擇後：解釋面板向下展開（依答對／答錯顯示不同開頭），
 *    非 AI 的錯誤照片蓋上遮罩 rgba(0, 0, 0, 0.45)，AI 圖標上「AI生成」徽章。
 *  - 作答後鎖定不可再選。
 * TODO(figma): 版面（並排比例、徽章、結果樣式）先照規格描述估值，
 *   取得檔案權限後對 #選擇圖片 對稿；圖片目前為佔位圖。
 */
export interface QuizOption {
  src: string;
  alt?: string;
  /** 這張是否為 AI 生成圖（= 正確答案） */
  isAi?: boolean;
}

const props = withDefaults(
  defineProps<{
    options?: QuizOption[];
    /** 答對時的開頭 */
    correctTitle?: string;
    /** 答錯時的開頭 */
    wrongTitle?: string;
    /** 共同解釋文字 */
    explain?: string;
  }>(),
  {
    options: () => [],
    correctTitle: '答對了！',
    wrongTitle: '答錯了，其實是這一張。',
    explain: '',
  },
);

const picked = ref(-1); // 使用者選的 index；-1 = 未作答
const answered = computed(() => picked.value >= 0);
const isCorrect = computed(() => props.options[picked.value]?.isAi === true);

function pick(i: number) {
  if (answered.value) return; // 作答後鎖定
  picked.value = i;
}
</script>

<template>
  <div class="ai-quiz">
    <div class="ai-quiz__options">
      <button
        v-for="(o, i) in options"
        :key="i"
        class="ai-quiz__option"
        :class="{
          'ai-quiz__option--masked': answered && !o.isAi, // 錯誤照片遮罩
          'ai-quiz__option--answer': answered && o.isAi,
          'ai-quiz__option--picked': answered && picked === i,
        }"
        type="button"
        :disabled="answered"
        :aria-pressed="picked === i"
        @click="pick(i)"
      >
        <img class="ai-quiz__img" :src="o.src" :alt="o.alt ?? ''" />
        <span v-if="answered && o.isAi" class="ai-quiz__badge">AI生成</span>
      </button>
    </div>

    <!-- 解釋：選擇後向下展開 -->
    <div class="ai-quiz__panel" :class="{ 'ai-quiz__panel--open': answered }">
      <div class="ai-quiz__panel-body">
        <p class="ai-quiz__result" :class="{ 'ai-quiz__result--correct': isCorrect }">
          {{ isCorrect ? correctTitle : wrongTitle }}
        </p>
        <p v-if="explain" class="ai-quiz__explain">{{ explain }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-quiz {
  width: 100%;
  max-width: var(--subpage-wide-w); // 兩圖並排用寬欄
  margin: 0 auto;
  padding: 0 20px;
}

.ai-quiz__options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @include rwd-mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.ai-quiz__option {
  position: relative;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  // 遮罩層：作答後蓋在錯誤照片上（規格指定 45% 黑）
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: scale(1.02);
  }

  &:disabled {
    cursor: default;
  }
}

.ai-quiz__option--masked::after {
  opacity: 1;
}

.ai-quiz__option--answer {
  border-color: var(--color-orange);
}

.ai-quiz__img {
  display: block;
  width: 100%;
  height: auto;
}

.ai-quiz__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  font-size: var(--text-caption);
  line-height: var(--text-caption--line-height);
  color: #fff;
  background: var(--color-orange);
  border-radius: 999px;
}

// 解釋面板：grid-rows 0fr ↔ 1fr 平滑下展
.ai-quiz__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}

.ai-quiz__panel--open {
  grid-template-rows: 1fr;
}

.ai-quiz__panel-body {
  min-height: 0;
  overflow: hidden;
}

.ai-quiz__result {
  margin: 24px 0 0;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 500;
  color: var(--color-body);

  &--correct {
    color: var(--color-orange);
  }
}

.ai-quiz__explain {
  margin: 12px 0 0;
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-weight: 300;
  color: var(--color-body);
  text-align: left;
}
</style>
