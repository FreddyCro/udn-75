<!--
  進場閘門：HeroLoader 收尾後**不直接播影片**，先停在這一屏等使用者按 start。
  設計稿 1774:61076（start播放影片，預設）／1774:61082（start hover）。

  兩個狀態的差異（依設計稿）：
    預設   cube 95×95 ＋ 白色 "start" 字；音效 icon 為靜音版、背後有橘色同心圓、下方兩行提示。
    hover  cube 放大到 131×131 且 "start" 字消失。
  同心圓與提示只是「開場提示」：呼吸 PULSE_COUNT 次後一起淡出，收成 1774:61082 的乾淨狀態
  （icon 保留可點）；使用者中途自己點開音效也立刻收掉。

  為什麼需要這道閘門：有聲自動播放會被瀏覽器封鎖，必須綁在一次使用者手勢上。
  按下 start 的那一下同時「解鎖播放」與「套用當前音效選擇」，故 hero 影片可直接有聲播。
-->
<script setup lang="ts">
import str from '@/locales/section1.json';

const emit = defineEmits<{ start: [] }>();

const { soundOn, toggleSound } = useAppSound();

// 音效提示（同心圓呼吸 ＋ 建議文字）的時間常數。
// 同一份數值同時餵給 CSS（--pulse-*）與收尾計時器 —— 兩邊各寫一份必然漂移。
const PULSE_DURATION = 1.5; // 單一圈由 icon 中心擴到最外圈的秒數
const PULSE_STAGGER = 0.75; // 第二圈的相位差（＝半個週期，故畫面上同時見到中圈＋外圈）
const PULSE_COUNT = 3; // 呼吸幾次後收掉

const pulseVars = {
  '--pulse-dur': `${PULSE_DURATION}s`,
  '--pulse-stagger': `${PULSE_STAGGER}s`,
  '--pulse-count': String(PULSE_COUNT),
};

// 提示是否還在場（同心圓＋文字共用同一個開關，一起淡出）
const hintOn = ref(true);
let hintTimer: ReturnType<typeof setTimeout> | undefined;

const dismissHint = () => {
  clearTimeout(hintTimer);
  hintOn.value = false;
};

onMounted(() => {
  // 用計時器而非 animationend 收尾：prefers-reduced-motion 下同心圓不跑動畫、
  // 不會有 animationend，提示仍必須消失。
  hintTimer = setTimeout(
    dismissHint,
    (PULSE_DURATION * PULSE_COUNT + PULSE_STAGGER) * 1000,
  );
});

onBeforeUnmount(() => clearTimeout(hintTimer));

// 使用者自己點開音效 → 提示已達成目的，不等呼吸跑完就收掉
const onSoundClick = () => {
  toggleSound();
  dismissHint();
};
</script>

<template>
  <div class="hero-start" :style="pulseVars">
    <!-- start：按下才開始播影片（emit 由 Hero 轉成 heroStarted）。
         只有 cube 在 flow 內 → cube 中心＝視窗正中心，延續載入層橘塊的位置。 -->
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
        type="button"
        :aria-pressed="soundOn"
        :aria-label="soundOn ? str.start.soundOnAria : str.start.soundOffAria"
        @click="onSoundClick"
      >
        <!--
          呼吸提示：設計稿 1774:61097（96×96）匯出的三層同心圓 —— 實心點 r=8.726、
          中圈 r=25.678（描邊 1）、外圈 r=47.743（描邊 0.5）。描邊「由內而外變細」正好等於
          同一顆 r=47.743 圓被 scale 縮小時的視覺結果（描邊寬度 ∝ 1/scale），故兩圈擴散波
          用 scale 0.1828→1 就能重現設計稿那張定格。
        -->
        <Transition name="hero-start-fade">
          <svg
            v-if="hintOn"
            class="hero-start__sound-pulse"
            viewBox="0 0 95.9863 95.9863"
            aria-hidden="true"
          >
            <circle cx="47.9943" cy="47.9943" r="8.72603" fill="#ff7f00" />
            <circle
              class="hero-start__sound-wave"
              cx="47.9932"
              cy="47.9932"
              r="47.7432"
            />
            <circle
              class="hero-start__sound-wave hero-start__sound-wave--late"
              cx="47.9932"
              cy="47.9932"
              r="47.7432"
            />
          </svg>
        </Transition>

        <!-- icon：設計稿 instance 1774:61083（50×40 外框，leaf 34px 高、置於 left 2 / top 3）。
             有聲＝Default 變體（喇叭＋兩段音波）／靜音＝Close 變體（喇叭＋兩條斜槓）。 -->
        <svg
          v-if="soundOn"
          class="hero-start__sound-icon"
          viewBox="0 0 50 40"
          aria-hidden="true"
        >
          <g
            transform="translate(2 3)"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <path
              d="M22.5 31.2539L9.58789 22.9629L9.21777 22.7246H1.5V11.2754H9.21777L9.58789 11.0371L22.5 2.74512V31.2539Z"
            />
            <path d="M30 23C32.7614 23 35 20.3137 35 17C35 13.6863 32.7614 11 30 11" />
            <path d="M30 31C36.6274 31 42 24.732 42 17C42 9.26801 36.6274 3 30 3" />
          </g>
        </svg>
        <svg
          v-else
          class="hero-start__sound-icon"
          viewBox="0 0 50 40"
          aria-hidden="true"
        >
          <g transform="translate(2 3)">
            <path
              d="M22.5 31.2539L9.58789 22.9629L9.21777 22.7246H1.5V11.2754H9.21777L9.58789 11.0371L22.5 2.74512V31.2539Z"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />
            <rect
              x="44.4053"
              y="9.12012"
              width="22.1854"
              height="2.8"
              transform="rotate(128.159 44.4053 9.12012)"
              fill="currentColor"
            />
            <rect
              width="22.1854"
              height="2.8"
              transform="matrix(0.617851 0.786295 0.786295 -0.617851 28 9.12012)"
              fill="currentColor"
            />
          </g>
        </svg>
      </button>

      <!-- 提示：與同心圓同進同退（呼吸完就不再建議） -->
      <Transition name="hero-start-fade">
        <p v-if="hintOn" class="hero-start__sound-hint">
          {{ str.start.soundHint }}
        </p>
      </Transition>
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
  align-items: center;
  justify-content: center;
  background: #fff;
}

// cube：設計稿 95×95，中心＝視窗正中心（312+95/2 ≈ 360）——「載入層橘塊 → cube → core」
// 三者同一點，故 cube 必須是唯一在 flow 內的元素（音效區改絕對定位，見下）。
// hover 放大到 131×131 且文字消失 —— 用 scale 而非改寬高，避免推動下方元素。
.hero-start__cube {
  display: flex;
  align-items: center;
  justify-content: center;
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

// 設計稿 951:36775：28px / weight 400 / line-height 32 / letter-spacing 1.4px
.hero-start__cube-label {
  color: #fff;
  font-weight: 400;
  font-size: 28px;
  line-height: 32px;
  letter-spacing: 1.4px;
  transition: opacity 0.2s ease;
}

// 音效區：設計稿 icon 頂 456，視窗中心 360 → 中心下方 96px。
// 絕對定位（不進 flow）才不會把 cube 從視窗正中心往上推。
.hero-start__sound {
  position: absolute;
  top: calc(50% + 96px);
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

// 按鈕本身只有 icon 大小（50×40），命中區用 ::after 外擴 —— 這樣提示文字才能
// 依設計稿貼在 icon 底下 8px，而不必用負 margin 把它拉回來。
.hero-start__sound-btn {
  position: relative;
  display: block;
  width: 50px;
  height: 40px;
  padding: 0;
  color: $gray;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: -28px -23px; // 命中區 96×96 ＝ 設計稿同心圓的範圍
  }

  &:hover,
  &:focus-visible {
    color: $orange;
  }
}

// 同心圓：與 icon 同圓心（設計稿兩者都在 (640, 476)），position:relative 的 icon
// 疊在其上 —— 圓在 icon「背後」靠的是這個繪製順序，不用 z-index 負值
// （負 z-index 會掉到 .hero-start 的白底之後而看不見）。
.hero-start__sound-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 96px;
  height: 96px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hero-start__sound-wave {
  fill: none;
  stroke: $orange;
  stroke-width: 0.5;
  transform-box: fill-box;
  transform-origin: center;
  // fill-mode: both —— 否則 delay 期間與跑完之後會退回「靜止的滿版外圈」
  animation: hero-start-pulse var(--pulse-dur) ease-out var(--pulse-count) both;

  &--late {
    animation-delay: var(--pulse-stagger);
  }
}

// scale 0.1828 = 8.726 / 47.743（設計稿實心點 → 外圈的半徑比）
@keyframes hero-start-pulse {
  0% {
    opacity: 0;
    transform: scale(0.1828);
  }

  10% {
    opacity: 1;
  }

  60% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.hero-start__sound-icon {
  position: relative; // 疊在同心圓之上（見 .hero-start__sound-pulse 說明）
  display: block;
  width: 50px;
  height: 40px;
}

// 提示：設計稿 1774:61090 —— 15px / line-height 24 / 無字距；
// icon 底 496 → 文字頂 504，故 margin-top 8px。
.hero-start__sound-hint {
  margin: 8px 0 0;
  color: $gray;
  font-weight: 300;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  white-space: pre-line; // soundHint 用 \n 斷成兩行
}

// 提示（同心圓＋文字）收場：淡出後才移出 DOM，動畫也隨之停止
.hero-start-fade-enter-active,
.hero-start-fade-leave-active {
  transition: opacity 0.4s ease;
}

.hero-start-fade-enter-from,
.hero-start-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .hero-start__cube,
  .hero-start__cube-label {
    transition: none;
  }

  // 不擴散：直接定在設計稿的靜態三層（中圈 25.678/47.743、外圈原尺寸）。
  // 收尾由 JS 計時器負責，故提示照樣會在同一時間消失。
  .hero-start__sound-wave {
    animation: none;
    transform: scale(0.5378);

    &--late {
      transform: scale(1);
    }
  }
}
</style>
