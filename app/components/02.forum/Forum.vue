<script setup lang="ts">
// Section 2：face / agenda / recap（智慧論壇）
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section2.json';

const { agenda } = str;

// hero 星空蓋滿後，本區用第二段 pin（forum pin）scrub 驅動 SymbolFace 序列：
//   預設 disperse → face（集合）→ converge（匯聚成點）→ enter（越過門檻 → transitionDone、星空退場揭開議程）。
// 門檻與捲動距離見 ~/utils/orange-core-config 的 SYMBOL_STOPS / SYMBOL_VH。因為 scrub，往回捲會自動倒退。
const {
  transitionDone,
  symbolMode,
  symbolTarget,
  setSymbolProgress,
  forumCoreActive,
  agendaRevealed,
} = useOrangeCoreProgress();

// forum pin：sec2 頂端貼齊視窗頂時釘住，吃掉 SYMBOL_VH 捲動距離 → 進度寫入 symbolProgress。
// enter 後 pin 於尾端解除 → 議程從頂端接著捲入。
// pin 作用在內層 pinRef（agenda + recap）而非 section 本身：GSAP pin 會對被釘元素套
// transform，形成 fixed 子孫的 containing block。把 pin 收在內層 div，section 內、pin 外
// 的 fixed 子孫（如 DevFaceProgress）就不會落入該 containing block 而跑位。
const sec2Ref = ref<HTMLElement | null>(null);
const pinRef = ref<HTMLElement | null>(null);
let symbolST: ScrollTrigger | null = null;

onMounted(() => {
  if (!sec2Ref.value || !pinRef.value) return;
  gsap.registerPlugin(ScrollTrigger);
  symbolST = ScrollTrigger.create({
    trigger: sec2Ref.value, // 起訖仍以 section 頂端計，維持原本 pin 時機
    start: 'top top',
    end: () => `+=${window.innerHeight * SYMBOL_VH}`,
    pin: pinRef.value, // 只釘內層，避免波及 section 內的 fixed 子孫
    pinSpacing: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => setSymbolProgress(self.progress),
    onLeaveBack: () => setSymbolProgress(0), // 捲回 pin 之前 → 回到 disperse、星空重新覆蓋
    onLeave: () => setSymbolProgress(1), //     捲過 pin 之後 → 維持 enter（已進入論壇）
  });
});

onBeforeUnmount(() => {
  symbolST?.kill();
  symbolST = null;
});

// scroll 主導：symbolProgress 解出的目標 → 指派 SymbolFace mode 與 transitionDone。
// 分兩個 watch 只在「值真的改變」時觸發（mode 改變才會讓 SymbolFace 跑補間）。
watch(
  () => symbolTarget.value.mode,
  (m) => (symbolMode.value = m),
  {
    immediate: true,
  },
);
watch(
  () => symbolTarget.value.enter,
  (e) => (transitionDone.value = e),
  {
    immediate: true,
  },
);

// 依場次順序建立時間軸。標記每個時段（上午／下午）的第一場，
// 以便在時間軸中插入時段封面標題（對應 Figma 的上午場／下午場封面）。
const periodInfo = {
  morning: agenda.morning,
  afternoon: agenda.afternoon,
} as const;

const timeline = agenda.sessions.map((session, i) => ({
  ...session,
  periodStart: i === 0 || session.period !== agenda.sessions[i - 1]!.period,
  periodInfo: periodInfo[session.period as keyof typeof periodInfo],
}));
</script>

<template>
  <section id="forum" ref="sec2Ref" class="sec2">
    <!-- SymbolFace 序列（disperse→face→converge→enter）已改由 forum pin scrub 驅動（見 script）；
         原本的手動 switch 已移除。 -->

    <!-- pin 範圍：agenda + recap 才是被 forum pin 釘住的內容；
         DevFaceProgress 刻意留在此 div 外面（見下），才不會被 pin 的 containing block 影響。 -->
    <div
      ref="pinRef"
      class="sec2__pin"
      :class="{ 'sec2__pin--revealed': agendaRevealed }"
    >
      <!-- agenda：議程時間軸 -->
      <div class="sec2__agenda">
        <ol class="sec2__timeline">
          <template v-for="(item, i) in timeline" :key="i">
            <!-- 時段封面標題（上午場／下午場） -->
            <li v-if="item.periodStart" class="sec2__period">
              <span class="sec2__period-label">{{ item.periodInfo.label }}</span>
              <h3 class="sec2__period-title">{{ item.periodInfo.title }}</h3>
              <p class="sec2__period-desc">{{ item.periodInfo.desc }}</p>
            </li>

            <!-- 場次 -->
            <li class="sec2__session" :data-period="item.period">
              <div class="sec2__session-head">
                <span class="sec2__session-time">{{ item.time }}</span>
                <span class="sec2__session-label">{{ item.label }}</span>
              </div>
              <h4 class="sec2__session-title">{{ item.title }}</h4>

              <p class="sec2__info-label">{{ agenda.speakerInfoLabel }}</p>

              <!-- 一般場次：講者列表 -->
              <ul
                v-if="item.speakers && item.speakers.length"
                class="sec2__speakers"
              >
                <li
                  v-for="(sp, j) in item.speakers"
                  :key="j"
                  class="sec2__speaker"
                >
                  <span class="sec2__speaker-role">{{ sp.role }}</span>
                  <span class="sec2__speaker-name">{{ sp.name }}</span>
                </li>
              </ul>

              <!-- 對談場次：主持人 + 分題講者 -->
              <template v-if="item.topics">
                <p v-if="item.moderator" class="sec2__moderator">
                  <span class="sec2__moderator-tag">主持</span>
                  <span class="sec2__speaker-role">{{
                    item.moderator.role
                  }}</span>
                  <span class="sec2__speaker-name">{{
                    item.moderator.name
                  }}</span>
                </p>
                <div
                  v-for="(topic, k) in item.topics"
                  :key="k"
                  class="sec2__topic"
                >
                  <p class="sec2__topic-question">{{ topic.question }}</p>
                  <ul class="sec2__speakers">
                    <li
                      v-for="(sp, l) in topic.speakers"
                      :key="l"
                      class="sec2__speaker"
                    >
                      <span class="sec2__speaker-role">{{ sp.role }}</span>
                      <span class="sec2__speaker-name">{{ sp.name }}</span>
                    </li>
                  </ul>
                </div>
              </template>
            </li>
          </template>
        </ol>
      </div>

      <!-- recap：活動回顧 -->
      <div class="sec2__recap">
        <h3>{{ str.recap.heading }}</h3>
        <p>{{ str.recap.body }}</p>
        <a class="sec2__recap-more" href="#">{{ str.recap.readMore }}</a>
      </div>
    </div>

    <!-- forum 接棒的橘核心（converge → crossfade → 橘方塊，停在黑畫面）。放在 pinRef 外、section 內：
         同 DevFaceProgress 之理，sec2 本身無 transform，此 fixed 元素相對視窗定位、不受 forum pin 影響。 -->
    <ForumCore :active="forumCoreActive" />

    <!-- forum SymbolFace 序列進度（僅 dev）。放在 pinRef 外、section 內：
         section 本身沒有 transform，故此 fixed 元素仍相對視窗定位、不受 pin 影響。 -->
    <DevOnly>
      <DevFaceProgress />
    </DevOnly>
  </section>
</template>

<style lang="scss" scoped>
// placeholder：先給 section 2 一個與 HeroForumTransition 星空同底色的深藍綠背景，
// 讓 hero pin 轉場層淡出交棒時不會閃白。正式版由 SymbolFace（three.js 星空）取代。
// padding-top：SymbolFace 序列改由 forum pin（見 script）hold 住，不再需要 100vh 墊高；
// 只保留讓議程 enter 後不被固定 header 壓到的上緣間距。
.sec2 {
  --accent: #ff7f00;

  min-height: 100vh;
  padding: 140px 24px 120px;
  color: #fff;
  background-color: #000;
}

// pinRef（議程＋recap 整組）：coreOut 前一律藏著，避免 SymbolFace↔橘核心 crossfade 期間
// （淡出的星空層與淡入的橘核心黑底皆未達全滿）從縫隙短暫露餡；
// --revealed（agendaRevealed）時隨橘核心淡出而淡入，剛好接上。捲回自動反向。
.sec2__pin {
  opacity: 0;
  transition: opacity 0.4s ease;

  &--revealed {
    opacity: 1;
  }
}

.sec2__face {
  max-width: 720px;
  margin: 0 auto 120px;
  text-align: center;

  &-hint {
    color: var(--accent);
    letter-spacing: 0.2em;
  }

  &-body {
    opacity: 0.7;
  }
}

// ── agenda 時間軸 ──
.sec2__agenda {
  max-width: 720px;
  margin: 0 auto;
}

.sec2__timeline {
  position: relative;
  margin: 0;
  padding: 0 0 0 40px;
  list-style: none;

  // 垂直軸線
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: 7px;
    width: 2px;
    background: rgba(255, 255, 255, 0.15);
  }
}

// 時段封面標題
.sec2__period {
  position: relative;
  margin: 48px 0 32px;

  &:first-child {
    margin-top: 0;
  }

  &-label {
    display: inline-block;
    color: var(--accent);
    font-size: 14px;
    letter-spacing: 0.3em;
  }

  &-title {
    margin: 12px 0;
    font-size: 32px;
    font-weight: 300;
    line-height: 1.3;
  }

  &-desc {
    margin: 0;
    max-width: 560px;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.9;
    opacity: 0.75;
    text-align: justify;
  }
}

// 單一場次
.sec2__session {
  position: relative;
  margin: 0 0 48px;

  // 時間軸圓點
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: -40px;
    width: 16px;
    height: 16px;
    background: var(--accent);
  }

  &-head {
    display: flex;
    align-items: baseline;
    gap: 16px;
    flex-wrap: wrap;
  }

  &-time {
    color: var(--accent);
    font-size: 22px;
    letter-spacing: 0.05em;
  }

  &-label {
    padding: 3px 10px;
    border: 0.5px solid rgba(255, 255, 255, 0.8);
    font-size: 14px;
    letter-spacing: 0.15em;
    opacity: 0.9;
  }

  &-title {
    margin: 16px 0 20px;
    font-size: 26px;
    font-weight: 300;
    line-height: 1.4;
  }
}

.sec2__info-label {
  margin: 0 0 12px;
  font-size: 12px;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.sec2__speakers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sec2__speaker {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &-role {
    font-size: 12px;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }

  &-name {
    font-size: 18px;
    letter-spacing: 0.05em;
  }
}

// 對談：主持人
.sec2__moderator {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 20px;

  .sec2__moderator-tag {
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 12px;
    letter-spacing: 0.15em;
  }

  .sec2__speaker-name {
    font-size: 16px;
  }
}

// 對談：分題
.sec2__topic {
  margin: 0 0 24px;
  padding-left: 16px;
  border-left: 2px solid rgba(255, 127, 0, 0.4);

  &-question {
    margin: 0 0 12px;
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.9;
  }
}

// ── recap ──
.sec2__recap {
  max-width: 720px;
  margin: 120px auto 0;
  text-align: center;

  &-more {
    display: inline-block;
    margin-top: 16px;
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
  }
}
</style>
