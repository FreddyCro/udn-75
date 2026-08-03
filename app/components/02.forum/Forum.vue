<script setup lang="ts">
// Section 2：agenda / recap（智慧論壇）
import str from '@/locales/section2.json';

const { agenda } = str;

// SymbolFace 序列（disperse→face→converge→enter）已搬到獨立的 <SymbolScene>（02.symbol）：
// pin、symbolProgress 寫入與 mode 指派都由該元件擁有，本區只「讀」它解出的結果：
//   forumCoreActive — symbolProgress ∈ [coreIn, coreOut) → ForumCore 橘核心現身（接棒）。
//   agendaRevealed  — 越過 coreOut → 議程揭露。
// 門檻見 ~/utils/orange-core-config 的 SYMBOL_STOPS / FORUM_HANDOFF。
const { forumCoreActive, agendaRevealed } = useOrangeCoreProgress();

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
    <!-- 議程整組：agendaRevealed（越過 coreOut）才淡入，見下方 .sec2__pin 註解。
         （原本這層同時是 forum pin 的釘住目標，pin 已隨 SymbolFace 序列搬到 <SymbolScene>。） -->
    <div class="sec2__pin" :class="{ 'sec2__pin--revealed': agendaRevealed }">
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

    <!-- forum 接棒的橘核心（converge → crossfade → 橘方塊，停在黑畫面）。
         fixed 滿版、由 SymbolScene 寫入的 symbolProgress 隔空驅動，故放在議程整組之外。
         （DevFaceProgress 已隨序列搬到 <SymbolScene>，避免同頁出現兩個進度顯示。） -->
    <ForumCore :active="forumCoreActive" />
  </section>
</template>

<style lang="scss" scoped>
// 黑底：與前一段 <SymbolScene>（黑底星空）同色，交棒時不閃白。
// padding-top：SymbolFace 序列已由 SymbolScene 自己的 pin hold 住，本區不需墊高；
// 只保留讓議程 enter 後不被固定 header 壓到的上緣間距。
.sec2 {
  --accent: #ff7f00;

  min-height: 100vh;
  padding: 140px 24px 120px;
  color: #fff;
  background-color: #000;
}

// 議程＋recap 整組：coreOut 前一律藏著，避免 SymbolFace↔橘核心 crossfade 期間
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
