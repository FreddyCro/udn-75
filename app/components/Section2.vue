<script setup lang="ts">
// Section 2：face / agenda / recap（智慧論壇）
import str from '@/locales/section2.json';

const { agenda } = str;
</script>

<template>
  <section id="forum" class="section2">
    <!-- face：人物牆 -->
    <div class="section2__face">
      <p class="section2__face-hint">{{ str.face.hint }}</p>
      <p class="section2__face-body">{{ str.face.body }}</p>
    </div>

    <!-- agenda：議程時間軸 -->
    <div class="section2__agenda">
      <!-- 上午場 -->
      <div class="section2__agenda-period">
        <h3>{{ agenda.morning.label }}</h3>
        <p>{{ agenda.morning.desc }}</p>
      </div>
      <!-- 下午場 -->
      <div class="section2__agenda-period">
        <h3>{{ agenda.afternoon.label }}</h3>
        <p>{{ agenda.afternoon.desc }}</p>
      </div>

      <!-- 場次列表 -->
      <ul class="section2__agenda-sessions">
        <li
          v-for="(session, i) in agenda.sessions"
          :key="i"
          class="section2__session"
          :data-period="session.period"
        >
          <span class="section2__session-time">{{ session.time }}</span>
          <span class="section2__session-label">{{ session.label }}</span>
          <h4 class="section2__session-title">{{ session.title }}</h4>

          <p class="section2__session-info-label">{{ agenda.speakerInfoLabel }}</p>

          <!-- 一般場次：講者列表 -->
          <ul v-if="session.speakers" class="section2__speakers">
            <li v-for="(sp, j) in session.speakers" :key="j">
              <span class="section2__speaker-role">{{ sp.role }}</span>
              <span class="section2__speaker-name">{{ sp.name }}</span>
            </li>
          </ul>

          <!-- 對談場次：主持人 + 分題講者 -->
          <template v-if="session.topics">
            <p v-if="session.moderator" class="section2__moderator">
              <span class="section2__speaker-role">{{ session.moderator.role }}</span>
              <span class="section2__speaker-name">{{ session.moderator.name }}</span>
            </p>
            <div
              v-for="(topic, k) in session.topics"
              :key="k"
              class="section2__topic"
            >
              <p class="section2__topic-question">{{ topic.question }}</p>
              <ul class="section2__speakers">
                <li v-for="(sp, l) in topic.speakers" :key="l">
                  <span class="section2__speaker-role">{{ sp.role }}</span>
                  <span class="section2__speaker-name">{{ sp.name }}</span>
                </li>
              </ul>
            </div>
          </template>
        </li>
      </ul>
    </div>

    <!-- recap：活動回顧 -->
    <div class="section2__recap">
      <h3>{{ str.recap.heading }}</h3>
      <p>{{ str.recap.body }}</p>
      <a class="section2__recap-more" href="#">{{ str.recap.readMore }}</a>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>