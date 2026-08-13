<!--
  進場閘門：HeroLoader 收尾後**不直接播影片**，先停在這一屏等使用者按 start。
  設計稿 1774:61076（start播放影片，預設）。

  畫面：cube 95×95 ＋ 白色 "start" 字；音效 icon 為靜音版、背後有橘色同心圓、下方兩行提示。
  同心圓與提示只是「開場提示」：呼吸 PULSE_COUNT 次後一起淡出，收成 1774:61082 的乾淨狀態
  （icon 保留可點）；使用者中途自己點開音效也立刻收掉。
  hover 態依設計稿：cube 放大到 131×131、"start" 字淡掉（見 HOVER_CUBE）。純 transform，
  不動 width/height，故不影響 flow、cube 中心也還是釘在視窗正中心。

  這一屏的三段時序（都圍繞「橘塊在畫面正中心原地不動」這件事）：
    進場  載入層收在**全白**、中央那格是留白位（HeroLoader 的中央格全程不翻橘），
          用 0.6s 淡掉（Hero.scss 的 .loader-fade-leave-active）；本層瞬間就位，於是橘塊
          由白底原地浮現、落點與尺寸恰好等於那格留白，接著 "start" 字才淡入（見 LABEL_*）。
    等待  同心圓呼吸 PULSE_COUNT 次後提示收掉。
    退場  按下 start：白底與音效區淡出讓影片透出，橘塊**只縮不淡** —— 維持實色縮到 26×26，
          那正是影片之後接手的橘核心尺寸（CORE.dotSize，見 OrangeCore.vue），故縮完的那顆
          與核心對得起來。白底因此用 background-color 的 alpha 淡、不用 opacity（否則會乘到
          橘塊身上），音效區則自己補一條淡出（見各自的 SCSS 註解）。

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

// 「start」字淡入：本層是「瞬間就位、由載入層淡掉來揭露」（loader-fade 只有 leave，見 Hero.scss），
// 故字必須等那 0.6s 走完才出現 —— 否則會與載入層還沒淡掉的「100%」在同一個橘塊上疊字。
// ⚠ LABEL_DELAY 需 ≥ Hero.scss `.loader-fade-leave-active` 的 0.6s；那個值改了要一起調
//   （兩份數值分屬 scss 與 ts，無法共用，只能靠這行註解追）。
const LABEL_DELAY = 0.6;
const LABEL_DURATION = 0.5;

// 退場（按下 start）：白底淡出 ＋ 橘塊縮小淡掉。時長由 CSS 單一來源 --exit-dur 控制，
// 故 Hero.vue 那邊的 <Transition name="hero-start-exit"> 不必也寫一份秒數。
const EXIT_DURATION = 0.45;

// hover 態的 cube 邊長（設計稿 131×131）與過渡時長。
const HOVER_CUBE = 131;
const HOVER_DURATION = 0.3;

const styleVars = {
  '--pulse-dur': `${PULSE_DURATION}s`,
  '--pulse-stagger': `${PULSE_STAGGER}s`,
  '--pulse-count': String(PULSE_COUNT),
  '--label-delay': `${LABEL_DELAY}s`,
  '--label-dur': `${LABEL_DURATION}s`,
  '--exit-dur': `${EXIT_DURATION}s`,
  // cube 邊長：與 HeroLoader 的中央留白格共用 HANDOFF_CUBE（見 ~/utils/orange-core-config）——
  // cube 要正好補進那格留白，尺寸不能各寫一份。
  '--cube-size': `${HANDOFF_CUBE}px`,
  // hover / 退場的尺寸都用 transform: scale 表達（不動 width/height，見 SCSS），
  // 故兩個目標邊長在這裡先換算成「相對 --cube-size 的比例」，CSS 那側不必再抄一次數字。
  '--cube-hover-dur': `${HOVER_DURATION}s`,
  '--cube-hover-scale': String(HOVER_CUBE / HANDOFF_CUBE),
  // 退場縮到 CORE.dotSize（26px）—— 影片播完後接手的橘核心就是這個大小（OrangeCore.vue
  // 的 SCSS 寫死同值），cube 先縮到同尺寸，交接才不會看到「跳一下」。
  '--cube-exit-scale': String(CORE.dotSize / HANDOFF_CUBE),
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
  <div class="hero-start" :style="styleVars">
    <!-- 舞台：與影片層 / 載入層共用的尺寸上限（見 base.scss 的 --hero-stage-max-*），置中。
         舞台自己置中 ⇒ 舞台中心恆等於視窗正中心，故 cube 與音效區的落點與加上限之前
         完全相同（音效區的 50% 也是量這個舞台）。三層同心，交棒鏈才對得起來。 -->
    <div class="hero-start__stage">
      <!-- start：按下才開始播影片（emit 由 Hero 轉成 heroStarted）。
         只有 cube 在 flow 內 → cube 中心＝舞台正中心＝視窗正中心，延續載入層橘塊的位置。
         ⚠ emit 必須留在 click 內**同步**發出，不可等退場動畫跑完再送：有聲播放綁在這一次
           使用者手勢上，延後 play() 會被 Safari 判為非手勢而靜音/封鎖。故「影片開播」與
           「本層退場」是並行的 —— 影片在淡出的白底後面已經在播了（見 .hero-start-exit-*）。 -->
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
              <circle
                class="hero-start__sound-dot"
                cx="47.9943"
                cy="47.9943"
                r="8.72603"
              />
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
  </div>
</template>

<style lang="scss" scoped>
// 滿版白底蓋住影片：本層在 .sec1__inner「外面」（見 Hero.vue），故 fixed 不受 pin 影響。
// 白底一律滿版（上限只約束舞台，不約束這片白）—— 影片層在上限之外露出的也是白，兩者接得上。
.hero-start {
  position: fixed;
  inset: 0;
  z-index: 1500; // 高於轉場層(10)/Header(1000)、低於 HeroLoader(2000)
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  // 退場：白底淡出 → 後面已經在播的影片透出來。
  // 進場刻意「沒有」transition —— 本層瞬間就位，由 HeroLoader 淡掉來揭露（見檔頭時序表）。
  // 退場期間整層不吃指標：游標多半還停在剛按下的 cube 上，不擋掉的話 :hover 會與退場的
  // scale 搶同一個 transform，方塊會「先放大再縮小」；順帶也防了退場中再點一次。
  //
  // ⚠️ 淡的是 **background-color 的 alpha，不是 opacity**：橘塊要「只縮不淡」，而 opacity
  //    會乘到所有子孫身上（見 .hero-start__cube 的退場註解）。background-color 只影響本層
  //    自己畫的那片白，子孫照舊實色。
  // ⚠️ 也不要改成「白底另拉一層子元素、用 opacity 淡」：Vue 的 <Transition> 是量**根元素**
  //    的 transition 時長來決定何時移除元素，根元素沒有 transition 就會被瞬間移除（退場等於
  //    沒有）—— 那條路得在 Hero.vue 補一份 :duration，秒數就變兩份來源。
  &.hero-start-exit-leave-active {
    transition: background-color var(--exit-dur) ease;
    pointer-events: none;
  }

  &.hero-start-exit-leave-to {
    background-color: rgb(255 255 255 / 0%);
  }
}

// 舞台：三層共用的尺寸上限（見 base.scss 的 --hero-stage-max-*，pc 2560×1440；其餘斷點
// none ＝ 滿版）。本層自己置中，故舞台中心 ≡ 視窗正中心 —— cube（flex 置中）與音效區
// （absolute，量的就是本層的 50%）的落點都與加上限之前相同，加上限不會動到交棒鏈。
// position: relative 是音效區的定位基準（原本是 .hero-start）。
.hero-start__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: var(--hero-stage-max-w);
  max-height: var(--hero-stage-max-h);
}

// cube：設計稿 95×95，中心＝視窗正中心（312+95/2 ≈ 360）——「載入層留白格 → cube → core」
// 三者同一點，故 cube 必須是唯一在 flow 內的元素（音效區改絕對定位，見下）。
// 邊長吃 --cube-size（＝HANDOFF_CUBE），與 HeroLoader 的中央留白格同一來源 → 必然等大。
// hover 與退場的尺寸變化**一律走 transform: scale**，不動 width/height：不觸發 layout，
// cube 中心恆定在視窗正中心，且兩段動態落在同一個屬性上、由來源順序決定勝負（退場寫在後面）。
// 沒有覆寫 outline，鍵盤 focus 仍走瀏覽器預設的 focus ring。
.hero-start__cube {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--cube-size);
  height: var(--cube-size);
  padding: 0;
  border: 0;
  background: var(--color-orange);
  cursor: pointer;
  transition: transform var(--cube-hover-dur) cubic-bezier(0.4, 0, 0.2, 1);

  // hover / 鍵盤 focus：放大到設計稿的 hover 態 131×131（--cube-hover-scale）。
  &:hover,
  &:focus-visible {
    transform: scale(var(--cube-hover-scale));
  }

  // 退場：往正中心縮到 26×26（--cube-exit-scale ＝ CORE.dotSize / HANDOFF_CUBE），
  // 也就是影片播完後 OrangeCore 接手那顆的尺寸；transform-origin 預設 center → 原地縮掉。
  // leave class 掛在本層 root 上，故用 & 反向選；寫在 :hover 之後才壓得過它（同特異度）。
  // ⚠ 橘塊**只縮不淡**（刻意沒有 opacity）：白底淡出讓影片透出的同時，橘塊維持實色一路縮到
  //   核心尺寸 —— 影片開場中央本來就有一顆同尺寸的橘塊，實色縮完正好疊上去，本層被移除時
  //   看不出接手。這也是 root 只能淡 background-color、不能淡 opacity 的原因（見 .hero-start）。
  .hero-start-exit-leave-active & {
    transition: transform var(--exit-dur) cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-start-exit-leave-to & {
    transform: scale(var(--cube-exit-scale));
  }
}

// 設計稿 951:36775：28px / weight 400 / line-height 32 / letter-spacing 1.4px
// 用 animation 而非 transition 做淡入：本層是 v-if 掛上的，掛上時已是最終狀態，
// transition 沒有「起始幀」可以過渡（要另外補 rAF 才會動）；animation + fill both
// 則能在 --label-delay 的等待期間穩定停在 opacity 0，交接結束才浮出來。
.hero-start__cube-label {
  color: #fff;
  font-weight: 400;
  font-size: 28px;
  line-height: 32px;
  letter-spacing: 1.4px;
  animation: hero-start-label-in var(--label-dur) ease var(--label-delay) both;
  // 設計稿的 hover 態沒有 "start" 字 → 用 color 淡掉而**不是** opacity：上面那條 animation
  // 的 fill: both 會永久持有 opacity，而 animation 的優先序高於一般宣告，任何 opacity 規則
  // 都壓不過它（要壓就得整條 animation: none，一離開 hover 又會連進場淡入一起重播）。
  // color 沒被 animation 佔用，白 → transparent 同樣是平滑的 alpha 過渡。
  transition: color var(--cube-hover-dur) ease;

  .hero-start__cube:hover &,
  .hero-start__cube:focus-visible & {
    color: transparent;
  }

  // 退場也要淡掉，而且是**字自己淡**：橘塊只縮不淡（見上方 .hero-start__cube），字若留著
  // 會被同一個 scale 縮成 26px 核心裡的白色雜點 —— 收完那顆該是乾淨的實色橘。
  // 同樣走 color 而非 opacity（理由同上：animation 的 fill both 永久持有 opacity）。
  // 特異度 (0,2,0) 低於上面的 hover (0,3,0)，但退場期間 root 已 pointer-events: none、
  // :hover 不再命中，故不會被壓過。
  .hero-start-exit-leave-active & {
    transition: color var(--exit-dur) ease;
  }

  .hero-start-exit-leave-to & {
    color: transparent;
  }
}

@keyframes hero-start-label-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// 音效區：設計稿 icon 頂 456，視窗中心 360 → 中心下方 96px。
// 絕對定位（不進 flow）才不會把 cube 從視窗正中心往上推。
// 50% 量的是 .hero-start__stage —— 舞台置中，故仍是「視窗中心下方 96px」。
.hero-start__sound {
  position: absolute;
  top: calc(50% + 96px);
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);

  // 退場要自己淡：整層的淡出改成只淡 background-color（好讓橘塊只縮不淡），子孫不再跟著淡，
  // 音效區不補這一條就會維持實色直到本層被移除 —— 影片都透出來了，icon 卻硬生生消失。
  // ⚠️ 只動 opacity，不要碰 transform：上面那條 translateX(-50%) 是水平置中，覆寫就跑位。
  .hero-start-exit-leave-active & {
    transition: opacity var(--exit-dur) ease;
  }

  .hero-start-exit-leave-to & {
    opacity: 0;
  }
}

// 按鈕本身只有 icon 大小（50×40），命中區用 ::after 外擴 —— 這樣提示文字才能
// 依設計稿貼在 icon 底下 8px，而不必用負 margin 把它拉回來。
.hero-start__sound-btn {
  position: relative;
  display: block;
  width: 50px;
  height: 40px;
  padding: 0;
  color: var(--color-gray);
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
    color: var(--color-orange);
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

.hero-start__sound-dot {
  fill: var(--color-orange);
}

.hero-start__sound-wave {
  fill: none;
  stroke: var(--color-orange);
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
  color: var(--color-gray);
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
  // 字直接在場（不淡入）。animation 收掉後 fill both 也一併消失，故要補回 opacity。
  .hero-start__cube-label {
    animation: none;
    opacity: 1;
  }

  // hover 不放大、退場不縮放（尺寸變化才是這裡要避免的動態；白底的淡出保留，否則會硬切掉）。
  // hover 既然不改尺寸，"start" 字也就沒有理由消失 —— 留著才看得出按鈕還在。
  .hero-start__cube {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }

    &:hover .hero-start__cube-label,
    &:focus-visible .hero-start__cube-label {
      color: #fff;
    }
  }

  // 這條不可省：上面那個 .hero-start__cube 只有 (0,1,0)，壓不過退場那條
  // .hero-start-exit-leave-active .hero-start__cube (0,2,0)。
  //
  // 退場改回「淡出」而不是「只縮不淡」：這裡本來就不縮放，若又不淡，本層被移除的那一刻
  // 會有一顆 95×95 的實色橘塊硬生生消失。沒有尺寸變化的版本，淡出才是唯一收得乾淨的方式。
  .hero-start-exit-leave-active .hero-start__cube {
    transition: opacity var(--exit-dur) ease;
  }

  .hero-start-exit-leave-to .hero-start__cube {
    transform: none;
    opacity: 0;
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
