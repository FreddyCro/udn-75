<!--
  議程表＋段末 CTA 按鈕：分類 × 時間列與兩顆 CTA，資料來自 locales/section2.json 的 agenda。
  顯隱時機（agendaRevealed 淡入）由外層 .sec2__pin 控制。
  mob 版型（分類轉滿版橫幅、時間列平列）純由 CSS 切換，DOM 三斷點共用。
  data-core-tail-end 是 <ForumCorePath> 尾段的終點錨（核心從此處之上一路藏在議程背後）。
-->
<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section2.json';

const { groups, actions } = str.agenda;

const rootEl = ref<HTMLElement | null>(null);
// 作用中的群組（＝被視窗中央那條線切到的那一組）。區域 state：沒有跨元件消費者，
// 故不進 useOrangeCoreProgress。
const activeIndex = ref<number | null>(null);

let triggers: ScrollTrigger[] = [];

// 判定線用 'center' 而非 IntersectionObserver 的 rootMargin：'center' 就是 <ForumCorePath>
// 的 start / end 用的同一個視窗中央，頭尾對齊因此是構造上的、不是兩套機制湊巧同意。
// 群組彼此相鄰無 margin → 區間天然互斥，同一時間只有一組作用中。
// 用 querySelectorAll 而非 v-for 的 ref 陣列：Vue 不保證 ref 陣列順序與來源陣列一致，
// 而這裡的索引必須精準對應群組（錯位會靜默點亮別組）。DOM 順序就是 v-for 順序。
function buildTriggers() {
  killTriggers();
  const root = rootEl.value;
  if (!root) return;
  root.querySelectorAll<HTMLElement>('.agenda__group').forEach((el, i) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        // 只清掉自己，理由見 ~/utils/agenda-active
        onToggle: (self) => {
          activeIndex.value = nextActiveIndex(
            activeIndex.value,
            i,
            self.isActive,
          );
        },
      }),
    );
  });
  // 建立時若已經有一組在區間內（例如帶 #forum 直接進站），onToggle 不一定補發，故補一次。
  triggers.forEach((t, i) => {
    if (t.isActive) activeIndex.value = i;
  });
}

function killTriggers() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);
  await nextTick();
  buildTriggers();
  // 字體載入會改變群組高度 → start / end 要重算。resize 由 ScrollTrigger 自己的
  // autoRefreshEvents 涵蓋，且 trigger 是 DOM 元素（非固定 px），故斷點切換不必重建。
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});

onBeforeUnmount(killTriggers);
</script>

<template>
  <div ref="rootEl" class="agenda" data-core-tail-end>
    <div
      v-for="(group, i) in groups"
      :key="i"
      class="agenda__group"
      :class="{ 'agenda__group--active': activeIndex === i }"
    >
      <p class="agenda__category">{{ group.category }}</p>

      <div class="agenda__rows">
        <span class="agenda__arrow" aria-hidden="true">
          <svg class="agenda__arrow-head" viewBox="0 0 5 2" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="1" height="1" />
            <rect x="4" y="0" width="1" height="1" />
            <rect x="1" y="1" width="1" height="1" />
            <rect x="3" y="1" width="1" height="1" />
          </svg>
        </span>

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
  --agenda-line: var(--color-gray-light);

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

  // mob 稿的作用中組：標題橫幅轉橘，該組的列分隔線一起轉橘（--agenda-line 宣告在 .agenda，
  // 在這一層覆寫就只影響本組）。pc / pad 不轉線色 —— 稿上那兩個斷點只有豎線換成箭頭。
  &--active {
    @include rwd-max('tablet') {
      --agenda-line: var(--accent);
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
    color: var(--color-white-light);
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    letter-spacing: 0.15em;
    background: var(--color-gray);
    transition: background-color 0.3s ease;

    .agenda__group--active & {
      background: var(--accent);
    }
  }
}

// border-left 當豎線：高度自然等於內容高，不需另外量固定值。
// padding-left 是稿上「豎線到列區」的距離（pc 16 / pad 12）；mob 無豎線故為 0。
.agenda__rows {
  position: relative; // 箭頭的定位基準
  flex: 1 1 0;
  min-width: 0;
  padding-left: 16px;
  border-left: 1px solid var(--agenda-line);

  @include rwd-max('pc') {
    padding-left: 12px;
  }

  @include rwd-max('tablet') {
    padding-left: 0;
    border-left: 0;
    border-bottom: 1px solid var(--agenda-line);
    transition: border-color 0.3s ease;
  }
}

// 作用中的豎線：稿上是 9px 寬的橘色像素箭頭。常態的 1px 灰線是 .agenda__rows 的
// border-left，本層只負責疊上去淡入（箭桿 9px 寬，會完整蓋住那條 1px 灰線）。
// left 的 −0.5px：absolute 的 left: 0 是 padding 邊，1px border-left 的中心在其左 0.5px。
.agenda__arrow {
  --agenda-arrow-u: 9px;

  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(-0.5px - var(--agenda-arrow-u) / 2);
  width: var(--agenda-arrow-u);
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  .agenda__group--active & {
    opacity: 1;
  }

  // pad 無箭頭稿，取 2/3 等比縮小。
  @include rwd-max('pc') {
    --agenda-arrow-u: 6px;
  }

  // mob 是橫幅變色，沒有豎線。
  @include rwd-max('tablet') {
    display: none;
  }
}

// 箭尖飾片：5u × 2u，底緣距箭桿底 1u。viewBox 是 5×2 的方塊格，故隨 u 精準縮放。
.agenda__arrow-head {
  position: absolute;
  bottom: var(--agenda-arrow-u);
  left: 50%;
  width: calc(var(--agenda-arrow-u) * 5);
  height: calc(var(--agenda-arrow-u) * 2);
  fill: var(--accent);
  transform: translateX(-50%);
  shape-rendering: crispEdges;
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
    padding: 8px 0 8px 4px;
    border-top: 1px solid var(--agenda-line);
    transition: border-color 0.3s ease;

    // 蓋掉 pc 的 & + &（specificity 較高，padding-top 需再宣告一次）。
    & + & {
      margin-top: 0;
      padding-top: 8px;
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

  // mob 稿的時間比 pad 大一級（稿上字框寬 83）。
  @include rwd-max('tablet') {
    font-size: 28px;
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

  // pad：兩顆各 296 剛好併滿 608 的內容寬；mob 轉直排滿版。
  @include rwd-max('pc') {
    gap: 16px;
    margin: 40px 0 80px;
  }

  @include rwd-max('tablet') {
    flex-direction: column;
    margin-top: 32px;
  }
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

    // pad／mob 稿的「下載完整議程」是深灰細框、深灰字（與橘色的報名鈕拉開層級）。
    @include rwd-max('pc') {
      border-color: var(--color-gray);
      color: var(--color-gray);
      font-weight: 300;
    }
  }

  &--primary {
    background: var(--accent);
    color: #fff;
  }

  @include rwd-max('pc') {
    flex: 1 1 0;
    width: auto;
    height: 70px;
    font-size: 18px;
  }

  @include rwd-max('tablet') {
    flex: 0 0 auto;
    font-size: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agenda__arrow,
  .agenda__category,
  .agenda__row,
  .agenda__rows {
    transition: none;
  }
}
</style>
