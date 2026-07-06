<script setup lang="ts">
// Section 2：face / agenda / recap（智慧論壇）
import str from '@/locales/section2.json';
import type { SymbolMode } from '~/composables/useHeroCoreProgress';

const { agenda } = str;

// hero → section 2 星空轉場：由 section 2 決定何時關閉（不自動消失）。
// 星空蓋滿（stage 6）後才出現「進入論壇」按鈕，按下才把 transitionDone 設 true → 星空退場、露出論壇。
// symbolMode：SymbolFace 三態，同樣提升到全域，由本區的 switch 切換（Hero 端 v-model 綁定）。
const { stage, transitionDone, symbolMode } = useHeroCoreProgress();

// symbol 狀態切換 switch 選項：對應 SymbolFace 的三個互斥態。
const SYMBOL_MODES: { value: SymbolMode; label: string }[] = [
  { value: 'disperse', label: '01.分散' },
  { value: 'face', label: '02.集合' },
  { value: 'converge', label: '03.匯聚成點' },
];

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
  <section id="forum" class="sec2">
    <!-- 星空蓋滿後出現的「進入論壇」按鈕：按下才關閉 hero 星空轉場（fixed，浮在星空之上）。 -->

    <!-- symbol 狀態 switch：stage ≥5 後常駐（進入論壇後也不消失），切換集合／分散／匯聚。 -->
    <div v-if="stage >= 5" class="sec2__symbol-switch">
      <!-- 進入 / 返回論壇：toggle transitionDone —— 未進入時「進入論壇」揭開議程；
           已進入時「返回論壇」回到星空轉場（SymbolFace 重新現身）。 -->
      <button
        v-if="stage >= 6"
        class="sec2__enter"
        type="button"
        @click="transitionDone = !transitionDone"
      >
        {{ transitionDone ? '返回論壇' : '進入論壇' }}
      </button>
      <button
        v-for="m in SYMBOL_MODES"
        :key="m.value"
        class="sec2__symbol-mode"
        :class="{ 'is-active': symbolMode === m.value }"
        type="button"
        @click="symbolMode = m.value"
      >
        {{ m.label }}
      </button>
    </div>

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
  </section>
</template>

<style lang="scss" scoped>
// placeholder：先給 section 2 一個與 HeroTransition 星空同底色的深藍綠背景，
// 讓 hero pin 轉場層淡出交棒時不會閃白。正式版由 SymbolFace（three.js 星空）取代。
// 注意：padding-top: 100vh 是刻意保留，供 hero pin 轉場交棒使用，
// 議程內容因此位於第一個 viewport 之下。
.sec2 {
  --accent: #ff7f00;

  min-height: 100vh;
  padding: 100vh 24px 120px;
  color: #fff;
  background-color: #000;
}

// 「進入論壇」按鈕：固定於畫面、浮在 HeroTransition 星空（z-index 10）之上、header（1000）之下。
.sec2__enter {
  z-index: 50;
  padding: 14px 36px;
  margin-right: 20px;
  font-size: 15px;
  letter-spacing: 0.15em;
  color: #fff;
  background: rgba(255, 127, 0, 0.9);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

// symbol 狀態 switch：固定於畫面頂端置中，與「進入論壇」同層浮在星空之上。
.sec2__symbol-switch {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  gap: 6px;
  padding: 6px;
  background: rgba(10, 28, 43, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.sec2__symbol-mode {
  padding: 8px 18px;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: #fff;
  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  &.is-active {
    color: #10141b;
    background: rgba(255, 127, 0, 0.95);
  }

  &.is-active:hover {
    background: rgba(255, 127, 0, 0.95);
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
