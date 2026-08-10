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

// 追上目標的節奏：跟不上時每組至少亮這麼久才走下一步。
const STEP_MS = 100;

const rootEl = ref<HTMLElement | null>(null);
// 作用中的群組。區域 state：沒有跨元件消費者，故不進 useOrangeCoreProgress。
const activeIndex = ref<number | null>(null);

// 各組的累積邊界（相對議程頂端）與議程頂端抵達視窗中央時的 scrollY。
// ⚠ 刻意不逐幀量測：這些值只隨版面（字體／斷點）變化，不隨捲動變化。
let bounds: number[] = [];
let startScroll = 0;
// 播放頭當下該落在哪一組（可以跳號）。activeIndex 一次只走一步去追它，故不會跳號。
let target: number | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

// 邊界相對議程自身頂端，故不受上游 pin spacer 的絕對位移影響；startScroll 是絕對值，
// 所以只在 refresh **之後**（GSAP 已把 pin spacer 算完）量，不在 refreshInit。
// 用 querySelectorAll 而非 v-for 的 ref 陣列：Vue 不保證 ref 陣列順序與來源陣列一致，
// 而這裡的索引必須精準對應群組（錯位會靜默點亮別組）。DOM 順序就是 v-for 順序。
function measure() {
  const root = rootEl.value;
  if (!root) return;
  const rootTop = root.getBoundingClientRect().top;
  const next = [0];
  root.querySelectorAll<HTMLElement>('.agenda__group').forEach((el) => {
    next.push(el.getBoundingClientRect().bottom - rootTop);
  });
  bounds = next;
  startScroll = rootTop + window.scrollY - window.innerHeight / 2;
  sync();
}

// 播放頭在議程內的偏移 ＝ 已捲過議程頂端抵達視窗中央的距離。
function sync() {
  if (bounds.length < 2) return;
  setTarget(targetIndexAt(bounds, window.scrollY - startScroll));
}

// 追上目標：立刻走一步，之後每 STEP_MS 走一步。正常捲速下 target 一次只變一格，
// 第一步就到位、感覺不到延遲；只有快捲跳號時才會排隊逐組補上。
function pump() {
  timer = null;
  if (activeIndex.value === target) return;
  activeIndex.value = stepToward(activeIndex.value, target);
  timer = setTimeout(pump, STEP_MS);
}

function setTarget(next: number | null) {
  target = next;
  if (!timer) pump();
}

// 用 scroll 事件而非 ScrollTrigger 的 onUpdate 當目標來源：onUpdate 只在 trigger 的
// 作用區間內發火，若一次 tick 直接從議程上方飛到下方，區間內沒有任何一幀 → 完全不發火。
// scroll 事件沒有這個死角。ScrollTrigger 仍負責 refresh 時機（resize / 字體 / 斷點）。
onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);
  await nextTick();
  measure();
  window.addEventListener('scroll', sync, { passive: true });
  ScrollTrigger.addEventListener('refresh', measure);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', sync);
  ScrollTrigger.removeEventListener('refresh', measure);
  if (timer) clearTimeout(timer);
  timer = null;
});
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
// 核心穿過議程時要藏在議程背後 —— 線從論壇三垂直落下、經過議程這一段看不見，
// 到議程底緣才續行到論壇四（見 forum-node-path 的 Q13 → S0 → S1 三點同 x）。
//
// 為什麼要議程自己出底：核心住在 .sec2__path，而那層帶 z-index: 1、刻意畫在 .sec2__pin
// 之上，好讓核心在後半段的論壇四／精彩活動看得見（見 Forum.vue）。所以 .sec2__pin 的白底
// 遮不到它，得由議程再高一層並自備不透明底。z-index 2 仍遠低於 ForumCore 的 20，
// 交棒的 fixed 黑底照樣蓋得住議程。
//
// 底只鋪到欄寬（pc 1064）就夠：線在議程段固定落在箭頭欄 —— 距欄左緣 208px（pad 126px，
// ＝ .agenda__category 的 192／110 加 16 的 gap），26px 的核心 ±13px 進不到欄外。
//
// ⚠️ 這個 z-index 能與 .sec2__path 相比，前提是 .sec2__pin 不自成堆疊脈絡
//    （它 opacity: 1、position: relative、z-index: auto → 不會）。議程淡入的那 0.4s
//    內 opacity < 1 會暫時成脈絡、議程被關在裡面，但那時核心還在段落上方，看不到差別。
.agenda {
  --agenda-line: var(--color-gray-light);

  position: relative;
  z-index: 2;
  max-width: 1064px;
  margin: 0 auto;
  background: #fff;

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
