<script lang="ts" setup>
/**
 * AiImageQuiz — 「哪一張是AI生成圖?」二選一測驗（visual 頁）。
 * 作答後鎖定：展開解說、非 AI 的照片蓋上遮罩。
 */
export interface QuizOption {
  /** UPic 圖片路徑（不含副檔名與裝置後綴） */
  src: string;
  alt?: string;
  /** 作答按鈕文字 */
  label?: string;
  /** 這張是否為 AI 生成圖（= 正確答案） */
  isAi?: boolean;
  /** 作答後顯示的解說 */
  explain?: string;
}

const props = withDefaults(
  defineProps<{
    options?: QuizOption[];
    correctLabel?: string;
    wrongLabel?: string;
  }>(),
  {
    options: () => [],
    correctLabel: '正確',
    wrongLabel: '錯誤',
  },
);

const picked = ref(-1); // 使用者選的 index；-1 = 未作答
const answered = computed(() => picked.value >= 0);
const isCorrect = computed(() => props.options[picked.value]?.isAi === true);
const explain = computed(() => props.options[picked.value]?.explain ?? '');

function pick(i: number) {
  if (answered.value) return;
  picked.value = i;
}
</script>

<template>
  <div class="ai-quiz">
    <!-- 兩張圖同高並排（寬度依 @1x 素材比例分配） -->
    <div class="ai-quiz__options">
      <figure
        v-for="(o, i) in options"
        :key="i"
        class="ai-quiz__option"
        :class="{ 'ai-quiz__option--masked': answered && !o.isAi }"
        :style="{ flex: `${i === 0 ? 394 : 235} 0 0%` }"
      >
        <UPic
          classname="ai-quiz__img"
          :src="o.src"
          :use-prefix="false"
          :srcset="['mob']"
          :alt="o.alt ?? ''"
        />
      </figure>
    </div>

    <!-- 作答按鈕：pc / pad 為圓鈕＋文字；mob 稿改為邊框盒＋像素箭頭（兩顆均分欄寬） -->
    <div class="ai-quiz__controls">
      <button
        v-for="(o, i) in options"
        :key="i"
        class="ai-quiz__btn"
        type="button"
        :disabled="answered"
        :aria-pressed="picked === i"
        @click="pick(i)"
      >
        <img
          v-if="i === 0"
          class="ai-quiz__btn-icon"
          src="/img/udn75_nav_prev.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          v-if="i === 0"
          class="ai-quiz__btn-pixel ai-quiz__btn-pixel--left"
          src="/img/udn75_arrow_pixel.svg"
          alt=""
          aria-hidden="true"
        />
        <span class="ai-quiz__btn-label">{{ o.label }}</span>
        <img
          v-if="i !== 0"
          class="ai-quiz__btn-pixel ai-quiz__btn-pixel--right"
          src="/img/udn75_arrow_pixel.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          v-if="i !== 0"
          class="ai-quiz__btn-icon ai-quiz__btn-icon--flip"
          src="/img/udn75_nav_prev.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>

    <div class="ai-quiz__panel">
      <p class="ai-quiz__hint">說明：</p>
      <div class="ai-quiz__body" :class="{ 'ai-quiz__body--open': answered }">
        <div class="ai-quiz__body-inner">
          <p class="ai-quiz__badge" aria-live="polite">
            <svg
              class="ai-quiz__badge-icon"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="14" cy="14" r="12.5" stroke="#fff" stroke-width="1.5" />
              <path
                v-if="isCorrect"
                d="m8.5 14.5 3.8 3.8 7.2-8"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                v-else
                d="M9.5 9.5 18.5 18.5M18.5 9.5 9.5 18.5"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            {{ isCorrect ? correctLabel : wrongLabel }}
          </p>
          <p v-if="explain" class="ai-quiz__explain">{{ explain }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-quiz {
  width: 100%;
  max-width: var(--subpage-content-w); // 窄欄 630，對稿
  margin: 0 auto;
  padding: 0 20px;

  // pad 稿：與內文欄同寬（570 含 padding 20 → 530）
  @include rwd-max('pc') {
    max-width: 570px;
  }

  // mob 稿：滿版、左右邊距 26
  @include rwd-max('tablet') {
    max-width: none;
    padding: 0 26px;
  }
}

.ai-quiz__options {
  display: flex;
}

.ai-quiz__option {
  position: relative;
  margin: 0;

  // 遮罩層：作答後蓋在非 AI 的照片上（對稿指定 45% 黑）
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
}

.ai-quiz__option--masked::after {
  opacity: 1;
}

.ai-quiz__option :deep(.ai-quiz__img) {
  display: block;
  width: 100%;
  height: auto;
}

.ai-quiz__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;

  // mob 稿：兩顆邊框盒按鈕置中均分（177 + 8 + 177 = 362）
  @include rwd-max('tablet') {
    gap: 8px;
    margin-top: 14px;
  }
}

.ai-quiz__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-gray);
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  // mob 稿：177×60 邊框盒，箭頭貼外側、文字靠內
  @include rwd-max('tablet') {
    flex: 1;
    gap: 16px;
    justify-content: flex-start;
    height: 60px;
    padding: 0 20px;
    border: 0.5px solid var(--color-gray);

    &:last-child {
      justify-content: flex-end;
    }
  }
}

.ai-quiz__btn-icon {
  display: block;
  width: 48px;
  height: 48px;

  &--flip {
    transform: scaleX(-1);
  }

  @include rwd-max('tablet') {
    display: none;
  }
}

// mob 稿專用像素箭頭（素材 22×12 朝下，旋轉指向外側）
.ai-quiz__btn-pixel {
  display: none;

  @include rwd-max('tablet') {
    display: block;
    width: 22px;
    height: 12px;
  }

  &--left {
    transform: rotate(90deg);
  }

  &--right {
    transform: rotate(-90deg);
  }
}

.ai-quiz__btn-label {
  font-size: var(--text-body); // Button_M 18 / 36 Light、字距 10%
  line-height: var(--text-body--line-height);
  font-weight: 300;
  letter-spacing: 0.1em;

  // mob 稿：Button_S 15 / 26 Light
  @include rwd-max('tablet') {
    font-size: 15px;
    line-height: 26px;
  }
}

// 說明面板：淺灰底，「說明：」常駐；作答後 body 以 grid-rows 0fr ↔ 1fr 下展
.ai-quiz__panel {
  margin-top: 28px; // 對稿：按鈕 → 面板 28
  padding: 16px 24px;
  background: #f7f7f7; // 對稿近似（面板淺灰底，非全站 token）
}

.ai-quiz__hint {
  margin: 0;
  font-size: 16px; // 對稿「解釋文字」樣式 16 / 24 Light
  line-height: 24px;
  font-weight: 300;
  color: var(--color-gray-light);
}

.ai-quiz__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}

.ai-quiz__body--open {
  grid-template-rows: 1fr;
}

.ai-quiz__body-inner {
  min-height: 0;
  overflow: hidden;
}

.ai-quiz__badge {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin: 12px auto 0;
  padding: 7px 16px;
  font-size: var(--text-h5);
  line-height: var(--text-h5--line-height);
  font-weight: 400;
  color: #fff;
  background: var(--color-orange);
}

.ai-quiz__badge-icon {
  display: block;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
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
