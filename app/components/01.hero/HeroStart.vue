<!--
  進場閘門：HeroLoader 收尾後**不直接播影片**，先停在這一屏等使用者按 start。
  設計稿 1774:61076（start播放影片，預設）／1774:61082（start hover）。

  兩個狀態的差異（依設計稿）：
    預設   cube 95×95 ＋ 白色 "start" 字；音效鈕有橘色圓框、icon 為靜音、下方兩行提示。
    hover  cube 放大到 131×131 且 "start" 字消失；提示文字隱藏（設計稿標 hidden）。
  音效開啟後（soundOn）：圓框與提示收掉、icon 換成有音波版本。

  為什麼需要這道閘門：有聲自動播放會被瀏覽器封鎖，必須綁在一次使用者手勢上。
  按下 start 的那一下同時「解鎖播放」與「套用當前音效選擇」，故 hero 影片可直接有聲播。
-->
<script setup lang="ts">
import str from '@/locales/section1.json';

const emit = defineEmits<{ start: [] }>();

const { soundOn, toggleSound } = useAppSound();
</script>

<template>
  <div class="hero-start">
    <!-- start：按下才開始播影片（emit 由 Hero 轉成 heroStarted） -->
    <button
      class="hero-start__cube"
      type="button"
      :aria-label="str.start.startAria"
      @click="emit('start')"
    >
      <span class="hero-start__cube-label">{{ str.start.label }}</span>
    </button>

    <!-- 音效開關：狀態存在全域（useAppSound），影響後續所有影片 -->
    <div class="hero-start__sound">
      <button
        class="hero-start__sound-btn"
        :class="{ 'is-on': soundOn }"
        type="button"
        :aria-pressed="soundOn"
        :aria-label="soundOn ? str.start.soundOnAria : str.start.soundOffAria"
        @click="toggleSound()"
      >
        <!--
          TODO(設計): sound icon 佔位。設計稿 instance 1774:61069（50×40），
          兩種樣式：靜音（喇叭 ＋ 斜線）／有聲（喇叭 ＋ 音波）。
          待正式 SVG 貼上時，請整段替換下面兩個 <svg>，尺寸維持 50×40。
        -->
        <svg
          v-if="soundOn"
          class="hero-start__sound-icon"
          viewBox="0 0 50 40"
          aria-hidden="true"
        >
          <path
            d="M4 15h8l10-8v26l-10-8H4z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M30 13a12 12 0 0 1 0 14M36 9a18 18 0 0 1 0 22"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
        <svg
          v-else
          class="hero-start__sound-icon"
          viewBox="0 0 50 40"
          aria-hidden="true"
        >
          <path
            d="M4 15h8l10-8v26l-10-8H4z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M30 14l14 12M44 14L30 26"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </button>

      <!-- 提示：僅在「尚未開啟音效」時出現（開啟後就不需要再建議） -->
      <p v-if="!soundOn" class="hero-start__sound-hint">
        {{ str.start.soundHint }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$gray: #686868;
$orange: #ff7f00;

// 滿版白底蓋住影片：本層在 .sec1__inner「外面」（見 Hero.vue），故 fixed 不受 pin 影響。
.hero-start {
  position: fixed;
  inset: 0;
  z-index: 1500; // 高於轉場層(10)/Header(1000)、低於 HeroLoader(2000)
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
}

// cube：設計稿 95×95，垂直置中於視窗（cube 中心 ≈ 360/720）。
// hover 放大到 131×131 且文字消失 —— 用 scale 而非改寬高，避免推動下方元素。
.hero-start__cube {
  position: relative;
  width: 95px;
  height: 95px;
  padding: 0;
  border: 0;
  background: $orange;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover,
  &:focus-visible {
    transform: scale(calc(131 / 95));

    .hero-start__cube-label {
      opacity: 0;
    }
  }
}

.hero-start__cube-label {
  color: #fff;
  font-weight: 300;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.02em;
  transition: opacity 0.2s ease;
}

// 音效區：設計稿 cube 底(407) → 圓框頂(428) 相距 21px。
.hero-start__sound {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 21px;
}

// 圓框：設計稿 96×96 橘色圈，只在「未開啟音效」時出現（強調可以點）。
.hero-start__sound-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  padding: 0;
  color: $gray;
  background: none;
  border: 1px solid $orange;
  border-radius: 50%;
  cursor: pointer;
  transition:
    border-color 0.3s ease,
    color 0.3s ease;

  // 已開啟：圓框收掉（設計稿 hover/開啟狀態沒有圈）
  &.is-on {
    border-color: transparent;
  }

  &:hover {
    color: $orange;
  }
}

.hero-start__sound-icon {
  width: 50px;
  height: 40px;
}

// 提示：兩行、置中。設計稿文字頂(504) 與圓框底(524) 略有重疊，故用負 margin 貼回。
.hero-start__sound-hint {
  margin: -20px 0 0;
  color: $gray;
  font-weight: 300;
  font-size: 12px;
  line-height: 1.8;
  letter-spacing: 0.05em;
  text-align: center;
  white-space: pre-line; // soundHint 用 \n 斷成兩行
}

@media (prefers-reduced-motion: reduce) {
  .hero-start__cube,
  .hero-start__cube-label {
    transition: none;
  }
}
</style>
