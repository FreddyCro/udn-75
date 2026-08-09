<script lang="ts" setup>
/**
 * AiImageQuiz — 「哪一張是AI生成圖?」二選一測驗（visual 頁）。
 * 作答後展開解說、非 AI 的照片蓋上遮罩；可重複改選另一個選項，解說隨之切換。
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

// 對錯圖示為 runtime 組出的動態路徑，須自行補資產前綴
const assetUrl = useAssetUrl();

const picked = ref(-1); // 使用者選的 index；-1 = 未作答
const answered = computed(() => picked.value >= 0);
const isCorrect = computed(() => props.options[picked.value]?.isAi === true);
const explain = computed(() => props.options[picked.value]?.explain ?? '');

function pick(i: number) {
  picked.value = i;
}
</script>

<template>
  <div class="ai-quiz">
    <!-- 兩張圖同高並排，寬度依 @1x 素材比例分配 -->
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

    <!-- 作答按鈕：pad 以上為圓鈕＋文字，mob 改為邊框盒＋像素箭頭 -->
    <div class="ai-quiz__controls">
      <button
        v-for="(o, i) in options"
        :key="i"
        class="ai-quiz__btn"
        type="button"
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

    <div class="ai-quiz__panel" :class="{ 'ai-quiz__panel--open': answered }">
      <p class="ai-quiz__hint">說明：</p>
      <div class="ai-quiz__body" :class="{ 'ai-quiz__body--open': answered }">
        <div class="ai-quiz__body-inner">
          <!-- 對稿只有圖示不帶文字；對錯文字保留在 alt 供 aria-live 朗讀 -->
          <p class="ai-quiz__badge" aria-live="polite">
            <img
              class="ai-quiz__badge-icon"
              :src="
                assetUrl(
                  isCorrect
                    ? '/img/visual/udn75_quiz_correct.svg'
                    : '/img/visual/udn75_quiz_wrong.svg',
                )
              "
              :alt="isCorrect ? correctLabel : wrongLabel"
            />
          </p>
          <p v-if="explain" class="ai-quiz__explain">{{ explain }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 欄寬與 .sp-col 內文窄欄對齊（此元件為滿版 embed，不吃外層欄的內距）
.ai-quiz {
  width: 100%;
  margin: 0 auto;
  padding: 0 26px;

  @include rwd-min('tablet') {
    max-width: 570px;
    padding: 0 20px;
  }

  @include rwd-min('pc') {
    max-width: var(--subpage-content-w);
  }
}

.ai-quiz__options {
  display: flex;
}

.ai-quiz__option {
  position: relative;
  margin: 0;

  // 遮罩層：作答後蓋在非 AI 的照片上
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
  gap: 8px;
  margin-top: 16px;

  @include rwd-min('tablet') {
    gap: 0;
  }
}

// mob：邊框盒，箭頭貼外側、文字靠內；pad 以上為純文字＋圓框箭頭
.ai-quiz__btn {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  height: 60px;
  padding: 0 20px;
  border: 0.5px solid var(--color-gray);
  background: none;
  color: var(--color-gray);
  cursor: pointer;

  &:last-child {
    justify-content: flex-end;

    @include rwd-min('tablet') {
      justify-content: flex-start;
    }
  }

  @include rwd-min('tablet') {
    flex: 0 1 auto;
    gap: 8px;
    height: auto;
    padding: 0;
    border: 0;
  }
}

.ai-quiz__btn-icon {
  display: none;
  width: 48px;
  height: 48px;

  &--flip {
    transform: scaleX(-1);
  }

  @include rwd-min('tablet') {
    display: block;
  }
}

// mob 專用像素箭頭：素材朝下，旋轉指向外側
.ai-quiz__btn-pixel {
  display: block;
  width: 22px;
  height: 12px;

  @include rwd-min('tablet') {
    display: none;
  }

  &--left {
    transform: rotate(90deg);
  }

  &--right {
    transform: rotate(-90deg);
  }
}

.ai-quiz__btn-label {
  font-size: 15px;
  line-height: 26px;
  font-weight: 300;
  letter-spacing: 0.1em;

  @include rwd-min('tablet') {
    font-size: var(--text-body);
    line-height: var(--text-body--line-height);
  }
}

// 說明面板：「說明：」常駐，作答後 body 以 grid-rows 0fr ↔ 1fr 下展。
// 未展開時底線收邊（面板僅一行「說明：」）；展開後內容自己撐出範圍，底線移除
.ai-quiz__panel {
  margin-top: 28px;
  padding: 16px 24px;
  background: #f7f7f7; // 面板專用底色，非全站 token
  border-bottom: 1px solid #d9d9d9; // 面板收邊線，非全站 token

  &--open {
    border-bottom-color: transparent; // 保留 1px 佔位，展開時不位移
  }
}

.ai-quiz__hint {
  margin: 0;
  font-size: 16px;
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
  justify-content: center;
  margin: 12px 0 0;
}

.ai-quiz__badge-icon {
  display: block;
  width: 48px;
  height: 48px;
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
