<script setup lang="ts">
// 捲動序列的除錯 dashboard（整合舊的 DevOrangeCoreProgress ＋ DevFaceProgress，並補上 forum 段）。
//
// 掛在 pages/index.vue 一處而非跟著各 section 走：它顯示的是**跨章節的整條序列**，
// 跟著某個 section 走就會在別段卸載。fixed 定位，不受任何 pin / transform 影響。
//
// 開關：`?pathdebug`（沿用 Forum.vue 既有的同一個參數 —— 那邊是把設計線上色，
// 兩者都是「我正在對這條核心軌除錯」的情境，共用一個開關才不會記混）。
// 刻意**不包 <DevOnly>**：`?pathdebug` 本來就在 production 可用，deploy 出去的 preview
// 也要能開。要改成僅 dev，在 index.vue 外面包一層 <DevOnly> 即可。
//
// 顯示什麼、為什麼是這些欄位：
//   ① 定位 —— 現在在哪個章節.part，該 part 內走了幾 %
//   ② 反算 —— 該 part 所屬軌的 raw 值（可直接貼回 orange-core-config 當門檻）
//   ③ 歸因 —— 底部旗標與 dotVisible 推導式，回答「那顆橘點為什麼不在」
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FORUM_HANDOFF } from '~/utils/orange-core-config';
import { FORUM_PATH_EVENTS } from '~/utils/forum-path-events';
import {
  FORUM_TURN_MIN_ANGLE_DEG,
  FORUM_TURN_MIN_GAP_LEN,
} from '~/utils/forum-path-turns';

const route = useRoute();
const visible = computed(() => route.query.pathdebug !== undefined);

const { parts, current, next, address, toNextVh } = useCoreSequence();
const {
  symbolProgress,
  symbolMode,
  symbolLayerDone,
  forumCoreActive,
  forumCoreDotVisible,
  forumPathActive,
  forumPathRiding,
  agendaRevealed,
  blessingFrame,
  reduceMotion,
  forumPathMarks,
  forumPathEvents,
  forumPathProgress,
  forumTurns,
} = useOrangeCoreProgress();

// ── 全域列 ──────────────────────────────────────────────────────────
// 斷點：forumPathActive 在 pad/mob 恆為 false（無線稿），看不到斷點會把它誤判成 bug。
const bp = ref<'pc' | 'pad' | 'mob' | '—'>('—');
const scrollY = ref(0);
const vh = ref(0);
// 幾何重建次數：字體載入、斷點切換、pin-spacer 都會觸發 refresh，對位跑掉時第一個要看的。
const refreshCount = ref(0);

const collapsed = ref(false);

const onScroll = () => (scrollY.value = Math.round(window.scrollY));
const onResize = () => {
  vh.value = window.innerHeight;
  const w = window.innerWidth;
  bp.value = w >= PC_BREAKPOINTS ? 'pc' : w >= TABLET_BREAKPOINTS ? 'pad' : 'mob';
};
const onRefresh = () => refreshCount.value++;

// index.vue 現在用 `v-if` 只在 `?pathdebug` 時才掛載本元件，但這道守衛留著：
// 沒有它，任何直接掛載本元件的地方都會拿到一組「面板不顯示、listener 照跑」的
// 監聽器（原本 production 的每位訪客都在付這筆錢）。
onMounted(() => {
  if (!visible.value) return;
  onScroll();
  onResize();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  ScrollTrigger.addEventListener('refresh', onRefresh);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  ScrollTrigger.removeEventListener('refresh', onRefresh);
});

// ── 格式化 ──────────────────────────────────────────────────────────
const pct = (v: number | null) => (v === null ? '–' : `${Math.round(v * 100)}%`);
const vhText = (v: number | null) => (v === null ? '' : `${Math.round(v)}vh`);
const raw3 = (v: number | null) => (v === null ? '' : v.toFixed(3));

// 章節分組（顯示用；序列本身是線性的）
const chapters = computed(() => {
  const out: { key: string; rows: typeof parts.value }[] = [];
  for (const row of parts.value) {
    const last = out[out.length - 1];
    if (last && last.key === row.chapter) last.rows.push(row);
    else out.push({ key: row.chapter, rows: [row] });
  }
  return out;
});

// 目前 part 的軌 raw 值換算成「距該軌起點多少 vh」——「反算回 config」的另一半。
const currentVhIntoTrack = computed(() => {
  const c = current.value;
  if (!c || c.raw === null || c.vh === null || c.progress === null) return null;
  const from = c.part.from ?? 0;
  const until = c.part.until ?? 1;
  const span = until - from || 1;
  // 整條軌的 vh ＝ 這段 vh ÷ 這段占整條軌的比例
  return (c.vh / span) * c.raw;
});

// 「那顆橘點為什麼不在」＝ forumCoreDotVisible 的三個輸入攤平（見 useOrangeCoreProgress）
const dotTerms = computed(() => [
  // coreIn 是推導值（無窮小數，見 orange-core-config 的 symbolProgressAt）→ 捨入再顯示。
  {
    label: `sym≥${(FORUM_HANDOFF.coreIn * 100).toFixed(1)}%`,
    ok: symbolProgress.value >= FORUM_HANDOFF.coreIn,
  },
  { label: 'pathActive', ok: forumPathActive.value },
  { label: '!riding', ok: !forumPathRiding.value },
]);

// ── 路徑事件列（節點定址的捲動事件，見 ~/utils/forum-path-events）───────────
// 顯示四個欄位，正好對應調事件時要問的四個問題：
//   key    這是哪個事件
//   節點   它掛在哪個節點（＝ 溝通用的地址，「W10 那個事件太早」）
//   %      門檻算出來是多少（可與 SEQUENCE 的 forum.path.% 對話）
//   ●／○   現在是 on 還是 off
// `–` ＝ 該斷點不觸發（at[bp] 為 null）；`?` ＝ 節點有填但 marks 裡沒有
// （節點被跳過，或編號打錯 —— 後者 ForumCorePath 會 console.warn）。
const eventRows = computed(() =>
  FORUM_PATH_EVENTS.map((e) => {
    const b = bp.value;
    const id = b === '—' ? null : e.at[b];
    const mark = forumPathMarks.value?.[e.key] ?? null;
    return {
      key: e.key,
      label: e.label,
      id,
      mark,
      // marks 缺 key 但節點有填 → 標記成待查（而不是靜靜顯示 off）
      missing: id !== null && mark === null,
      on: forumPathEvents[e.key] === true,
    };
  }),
);

// ── 轉折列（音效觸發點，見 ~/utils/forum-path-turns）─────────────────────
// 角度是量出來的（節點座標的折線轉角），不是設定值 —— 調門檻時就看這一區選中了誰。
const turnMinAngle = FORUM_TURN_MIN_ANGLE_DEG;
const turnMinGap = FORUM_TURN_MIN_GAP_LEN;
const turnRows = computed(() =>
  (forumTurns.value ?? []).map((t) => ({
    id: t.id,
    angle: Math.round(t.angle),
    mark: t.mark,
    passed: forumPathProgress.value >= t.mark,
  })),
);

const flags = computed(() => [
  { label: 'layerDone', ok: symbolLayerDone.value },
  { label: 'coreActive', ok: forumCoreActive.value },
  { label: 'agendaReveal', ok: agendaRevealed.value },
  { label: 'pathActive', ok: forumPathActive.value },
  { label: 'riding', ok: forumPathRiding.value },
]);
</script>

<template>
  <div v-if="visible" class="devseq" aria-hidden="true">
    <button class="devseq__toggle" type="button" @click="collapsed = !collapsed">
      {{ collapsed ? '▸' : '▾' }} {{ address || '—' }}
    </button>

    <template v-if="!collapsed">
      <!-- 全域列 -->
      <div class="devseq__meta">
        {{ bp }} · {{ scrollY }}/{{ vh }}vh · refresh ×{{ refreshCount }} ·
        rm {{ reduceMotion ? 'on' : 'off' }}
      </div>

      <!-- 當前地址 ＋ 反算回 config 的值 -->
      <div v-if="current" class="devseq__now">
        <div class="devseq__now-addr">
          {{ current.chapter }}.{{ current.index }}
          <b>{{ current.part.key }}</b>
          <span v-if="current.progress !== null"> · {{ pct(current.progress) }}</span>
          <span class="devseq__drive">{{ current.part.drive }}</span>
        </div>
        <div class="devseq__now-sub">{{ current.part.label }}</div>
        <div v-if="current.raw !== null" class="devseq__now-raw">
          {{ current.part.track }} {{ raw3(current.raw) }}
          <span v-if="currentVhIntoTrack !== null">· {{ vhText(currentVhIntoTrack) }}</span>
        </div>
        <div v-if="next" class="devseq__now-next">
          → {{ next.chapter }}.{{ next.part.key }}
          <span v-if="toNextVh !== null">· 剩 {{ vhText(toNextVh) }}</span>
        </div>
      </div>

      <!-- 全序列 -->
      <div class="devseq__list">
        <template v-for="ch in chapters" :key="ch.key">
          <div
            v-for="(row, i) in ch.rows"
            :key="row.address"
            class="devseq__row"
            :class="`is-${row.state}`"
          >
            <span class="devseq__ch">{{ i === 0 ? ch.key : '' }}</span>
            <span class="devseq__idx">{{ row.index }}</span>
            <span class="devseq__key">{{ row.part.key }}</span>
            <span class="devseq__pct">
              {{ row.part.drive === 'scrub' ? pct(row.progress) : row.state === 'done' ? 'done' : row.state }}
            </span>
            <span class="devseq__drive">{{ row.part.drive }}</span>
            <span class="devseq__raw">{{ raw3(row.raw) }}</span>
          </div>
        </template>
      </div>

      <!-- 旗標 ＋ 歸因 -->
      <div class="devseq__flags">
        <span
          v-for="f in flags"
          :key="f.label"
          class="devseq__flag"
          :class="{ 'is-on': f.ok }"
        >{{ f.ok ? '●' : '○' }} {{ f.label }}</span>
      </div>

      <div class="devseq__derive">
        dot =
        <span
          v-for="(t, i) in dotTerms"
          :key="t.label"
          :class="{ 'is-on': t.ok }"
        >{{ i ? ' · ' : ' ' }}{{ t.label }} {{ t.ok ? '✓' : '✗' }}</span>
        → {{ forumCoreDotVisible ? '✓' : '✗' }}
      </div>

      <div class="devseq__derive">
        symbolMode {{ symbolMode }} · blessingFrame {{ blessingFrame }}
      </div>

      <!-- 路徑事件：門檻由節點在每次 refresh 重算，故這裡的 % 是量出來的、不是設定值 -->
      <div v-if="eventRows.length" class="devseq__events">
        <div class="devseq__events-head">forum.path 事件（節點定址）</div>
        <div
          v-for="ev in eventRows"
          :key="ev.key"
          class="devseq__event"
          :class="{ 'is-on': ev.on, 'is-missing': ev.missing }"
          :title="ev.label"
        >
          <span class="devseq__event-dot">{{ ev.on ? '●' : '○' }}</span>
          <span class="devseq__event-key">{{ ev.key }}</span>
          <span class="devseq__event-node">{{ ev.id ?? '–' }}</span>
          <span class="devseq__event-pct">
            {{ ev.missing ? '?' : pct(ev.mark) }}
          </span>
        </div>
      </div>

      <!-- 轉折（音效觸發點）：純幾何判定，故這裡顯示的是量出來的角度，不是設定值。
           調 FORUM_TURN_MIN_ANGLE_DEG / MIN_GAP_LEN 的唯一依據就是這一區。
           ● ＝ 核心已走過（拿 forumPathProgress 比大小，只是視覺回饋；真正出聲的判定
           在 ForumCorePath 的 playTurnsCrossed，它比的是弧長且只在往下捲時觸發）。 -->
      <div v-if="turnRows.length" class="devseq__events">
        <div class="devseq__events-head">
          forum.path 轉折 ×{{ turnRows.length }}（≥{{ turnMinAngle }}° · 間隔 ≥{{ turnMinGap }}px）
        </div>
        <div
          v-for="t in turnRows"
          :key="t.id"
          class="devseq__event"
          :class="{ 'is-on': t.passed }"
        >
          <span class="devseq__event-dot">{{ t.passed ? '●' : '○' }}</span>
          <span class="devseq__event-key">{{ t.id }}</span>
          <span class="devseq__event-node">{{ t.angle }}°</span>
          <span class="devseq__event-pct">{{ pct(t.mark) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.devseq {
  position: fixed;
  right: 8px;
  // 讓開常駐 header：面板 z-index 高於它，貼齊視窗頂會蓋掉右側的分享／音效／選單鈕，
  // 而那幾顆在除錯時還要按得到。fallback 0px 是為了子頁沒有該變數時仍能貼頂。
  top: calc(var(--header-height, 0px) + 8px);
  z-index: 2000; // 高於 AppHeader（1000）：除錯面板要壓在所有東西之上
  width: 288px;
  padding: 6px 8px;
  border-radius: 8px;
  // 幾乎不透明：面板會蓋在符號段的粒子場與橘核心之上，太透會讓數字讀不出來
  background: rgba(0, 0, 0, 0.92);
  color: #fff;
  font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 10px;
  line-height: 1.5;
  pointer-events: auto;
  user-select: none;
}

.devseq__toggle {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-orange);
  font: inherit;
  font-size: 11px;
  text-align: left;
  cursor: pointer;
}

.devseq__meta {
  margin-top: 4px;
  opacity: 0.55;
}

.devseq__now {
  margin-top: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.devseq__now-addr {
  font-size: 12px;

  b {
    color: var(--color-orange);
    font-weight: 700;
  }
}

.devseq__now-sub {
  opacity: 0.55;
}

.devseq__now-raw {
  margin-top: 2px;
  color: var(--color-blue);
}

.devseq__now-next {
  opacity: 0.7;
}

.devseq__list {
  margin-top: 6px;
}

// 六欄固定寬：等寬字型 ＋ 固定欄寬，數字跳動時整份表不會左右抖
.devseq__row {
  display: grid;
  grid-template-columns: 52px 12px 1fr 40px 34px 40px;
  gap: 2px;
  opacity: 0.4;

  &.is-done {
    opacity: 0.62;
  }

  &.is-live {
    padding-left: 2px;
    border-left: 2px solid var(--color-orange);
    margin-left: -4px;
    opacity: 1;
  }
}

.devseq__ch {
  opacity: 0.6;
}

.devseq__idx {
  opacity: 0.45;
}

.devseq__pct {
  text-align: right;
}

.devseq__drive {
  padding-left: 4px;
  opacity: 0.4;
  font-size: 9px;
}

.devseq__raw {
  color: var(--color-blue);
  text-align: right;
}

.devseq__flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
  margin-top: 6px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.devseq__flag {
  opacity: 0.4;

  &.is-on {
    color: var(--color-orange);
    opacity: 1;
  }
}

.devseq__derive {
  margin-top: 2px;
  opacity: 0.55;

  .is-on {
    color: var(--color-orange);
    opacity: 1;
  }
}

.devseq__events {
  margin-top: 6px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.devseq__events-head {
  opacity: 0.55;
}

// 四欄固定寬（同 .devseq__row 的理由）：等寬字型 ＋ 固定欄寬，翻轉時整份表不左右抖
.devseq__event {
  display: grid;
  grid-template-columns: 12px 1fr 34px 34px;
  gap: 2px;
  opacity: 0.45;

  &.is-on {
    color: var(--color-orange);
    opacity: 1;
  }

  // 節點有填但 marks 裡查不到 —— 節點被跳過（optional）或編號打錯，兩者都該看得見
  &.is-missing {
    color: #ff5a5a;
    opacity: 1;
  }
}

.devseq__event-node {
  opacity: 0.75;
  text-align: right;
}

.devseq__event-pct {
  text-align: right;
}
</style>
