<!--
  議程表＋段末 CTA 按鈕：分類 × 時間列與兩顆 CTA，資料來自 locales/section2.json 的 agenda。
  顯隱時機（agendaRevealed 淡入）由外層 .sec2__pin 控制。
  mob 版型（分類轉滿版橫幅、時間列平列）純由 CSS 切換，DOM 三斷點共用。
-->
<script setup lang="ts">
import str from '@/locales/section2.json';

const { groups, actions } = str.agenda;
</script>

<template>
  <div class="agenda">
    <div v-for="(group, i) in groups" :key="i" class="agenda__group">
      <p class="agenda__category">{{ group.category }}</p>

      <div class="agenda__rows">
        <div v-for="(row, j) in group.rows" :key="j" class="agenda__row">
          <p class="agenda__time">{{ row.time }}</p>
          <div class="agenda__detail">
            <p class="agenda__title">{{ row.title }}</p>
            <p v-for="(note, k) in row.notes" :key="k" class="agenda__note">
              {{ note }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 議程 CTA：設計稿兩顆並排置中。variant 決定橘框（outline）或橘底（primary）。 -->
    <div class="agenda__actions">
      <a
        v-for="(action, i) in actions"
        :key="i"
        class="agenda__action"
        :class="`agenda__action--${action.variant}`"
        :href="action.href"
        >{{ action.label }}</a
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agenda {
  --agenda-line: #898989;

  max-width: 1064px;
  margin: 0 auto;

  @include rwd-max('pc') {
    max-width: 608px;
  }

  @include rwd-max('tablet') {
    max-width: none;
    padding: 0 26px;
  }
}

.agenda__group {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--agenda-line);

  // 只有第一組帶上緣線，其餘靠前一組的下緣線 → 相鄰處不雙線。
  &:first-child {
    border-top: 1px solid var(--agenda-line);
  }

  @include rwd-max('pc') {
    gap: 12px;
  }

  // mob：分類轉橫幅、線改掛在每一列上。
  @include rwd-max('tablet') {
    display: block;
    padding: 0;
    border-bottom: 0;

    &:first-child {
      border-top: 0;
    }
  }
}

.agenda__category {
  flex: 0 0 192px;
  margin: 0;
  padding: 10px;
  font-size: 42px;
  font-weight: 300;
  line-height: 56px;
  text-align: center;

  @include rwd-max('pc') {
    flex-basis: 110px;
    font-size: 24px;
  }

  @include rwd-max('tablet') {
    padding: 4px 10px;
    color: #fafafa;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    letter-spacing: 0.15em;
    background: #686868;
  }
}

// border-left 當豎線：高度自然等於內容高，不需另外量固定值。
.agenda__rows {
  flex: 1 1 0;
  min-width: 0;
  border-left: 1px solid var(--agenda-line);

  @include rwd-max('tablet') {
    border-left: 0;
    border-bottom: 1px solid var(--agenda-line);
  }
}

.agenda__row {
  display: flex;
  align-items: center;
  gap: 48px;
  padding-left: 24px;

  & + & {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--agenda-line);
  }

  @include rwd-max('pc') {
    gap: 20px;
    padding-left: 4px;
  }

  @include rwd-max('tablet') {
    gap: 24px;
    padding: 10px 4px;
    border-top: 1px solid var(--agenda-line);

    // 蓋掉 pc 的 & + &（specificity 較高，padding-top 需再宣告一次）。
    & + & {
      margin-top: 0;
      padding-top: 10px;
    }
  }
}

.agenda__time {
  margin: 0;
  font-size: 42px;
  font-weight: 300;
  line-height: 56px;
  letter-spacing: 0.1em;
  white-space: nowrap;

  @include rwd-max('pc') {
    font-size: 24px;
    line-height: 40px;
  }

  @include rwd-max('tablet') {
    font-weight: 400;
    line-height: 56px;
  }
}

.agenda__detail {
  flex: 1 1 0;
  min-width: 0;
}

.agenda__title {
  margin: 0;
  font-size: 24px;
  font-weight: 400;
  line-height: 40px;

  @include rwd-max('pc') {
    font-size: 18px;
    line-height: 32px;
  }

  @include rwd-max('tablet') {
    font-size: 20px;
  }
}

.agenda__note {
  margin: 0;
  font-size: 18px;
  font-weight: 300;
  line-height: 30px;
}

// 議程 CTA：設計稿兩顆 414×76 並排置中；下方 32 即灰底報告區塊的起始間距。
.agenda__actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 48px 0 32px;
}

// 字級比照 <ForumEvent> 的 .forum-event__cta；
// letter-spacing 會在末字後多留一格，text-indent 補回一半才視覺置中。
.agenda__action {
  display: grid;
  place-items: center;
  width: 414px;
  height: 76px;
  font-size: 22px;
  line-height: 36px;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-indent: 0.05em;

  &--outline {
    border: 1px solid var(--accent);
    color: var(--accent);
  }

  &--primary {
    background: var(--accent);
    color: #fff;
  }
}
</style>
