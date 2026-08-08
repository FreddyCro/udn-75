<script setup lang="ts">
import str from '@/locales/section2.json';
import type { ForumEvent } from '~/types/forum';

// Section 2：agenda / recap（智慧論壇）
// 議程整組（時間軸＋recap）的內容與樣式已抽成 <Agenda>（02.forum/Agenda.vue），
// 本區只保留 pin 容器與顯隱時機。

// SymbolFace 序列（disperse→face→converge→enter）已搬到獨立的 <SymbolScene>（01a.symbol）：
// symbolProgress 寫入與 mode 指派都由該元件擁有，本區只「讀」它解出的結果：
//   forumCoreActive     — symbolProgress ∈ [coreIn, coreOut) → ForumCore 的黑底現身（接棒）。
//   forumCoreDotVisible — 橘點的顯隱：coreIn 起撐到論壇段路徑接手為止（比黑底晚很多）。
//   forumPathRiding     — 路徑已接手 → 橘點的消失改為瞬間（見 ForumCore 的 SCSS）。
//   agendaRevealed      — 越過 coreOut → 議程揭露。
// 門檻見 ~/utils/orange-core-config 的 SYMBOL_STOPS / FORUM_HANDOFF。
const {
  forumCoreActive,
  forumCoreDotVisible,
  forumPathRiding,
  agendaRevealed,
} = useOrangeCoreProgress();

const forum = str.forum as {
  heading: string[];
  events: ForumEvent[];
  event4: ForumEvent;
};

// 現場精彩活動：活動尚未發生，**預設不顯示**，帶 ?highlights=1 才出現。
// 用 useRoute().query 而非直接讀 location：SSR 與 client 拿到同一個值，不會 hydration mismatch。
// 活動結束後把預設改成顯示即可（把條件反過來）。
// ⚠ 這一段的顯隱會改變後半段設計線的可用錨點 —— 掛在它身上的 waypoint 必須標 optional，
//   見 architecture/forum-node-path.md 的「大聲失敗的規則，與它的例外」。
const route = useRoute();
const highlightsVisible = computed(() => route.query.highlights === '1');

// 設計線的後半段（議程之後）平常看不見 —— .sec2__pin 是 .sec2__path 的後續兄弟且有
// 不透明白底，會整片蓋在路徑層上。那是刻意的：核心要「從議程背後穿過」。
// 但開發時需要看得到那半條線才能對位，故用 ?pathdebug 把路徑層提到議程之上。
// production 不帶參數 → 行為完全不變。
const pathDebug = computed(() => route.query.pathdebug !== undefined);
</script>

<template>
  <section id="forum" class="sec2" data-header-theme="light">
    <!-- 上半段（路徑段）：論壇一~三的內容 ＋ 核心沿設計線蛇行下行（見 temp/issue-05）。
         段落主標只在論壇一之前出現一次，故由本層渲染、不進 <ForumEvent>。
         設計線依錨點定位、核心沿驅動線移動（見 ForumCorePath）。 -->
    <div
      class="sec2__path"
      :class="{
        'sec2__path--revealed': agendaRevealed,
        'sec2__path--debug': pathDebug,
      }"
    >
      <h2 class="sec2__heading">
        <span v-for="(line, i) in forum.heading" :key="i">{{ line }}</span>
      </h2>

      <ForumEvent v-for="(e, i) in forum.events" :key="i" :event="e" />

      <ForumCorePath />
    </div>

    <!-- 議程整組：agendaRevealed（越過 coreOut）才淡入，見下方 .sec2__pin 註解。
         （原本這層同時是 forum pin 的釘住目標，該 pin 已隨 SymbolFace 序列移除 —— <SymbolScene>
           改用「不 pin 的捲動尺」，見該元件註解。） -->
    <div class="sec2__pin" :class="{ 'sec2__pin--revealed': agendaRevealed }">
      <Agenda />
      <AgendaReport />

      <!-- 論壇四（青年永續築夢論壇）：結構與前三場相同，故直接用 <ForumEvent>，
           版式是它專屬的 layout: 'youth'（見 types/forum.ts）。
           它在議程之後、不屬於 .sec2__path，而 <ForumEvent> 的 pc 版位是絕對定位到
           1280 設計稿座標 —— .sec2__pin 沒有 max-width，故外面補一層同寬的容器。
           ⚠️ 也因為不在 .sec2__path 內，<ForumCorePath> 的錨點查找範圍必須涵蓋這一塊
           （後半段路徑會掛在它身上）。 -->
      <div class="sec2__forum4">
        <ForumEvent :event="forum.event4" />
      </div>

      <ForumHighlights v-if="highlightsVisible" />
    </div>

    <!-- forum 接棒的橘核心（converge → crossfade → 橘方塊）。fixed 滿版、由 SymbolScene 寫入的
         symbolProgress 隔空驅動，故放在議程整組之外。黑底在 coreOut 淡出，橘點則撐到論壇段
         路徑接手（見 ForumCore 與 useOrangeCoreProgress 的 forumCoreDotVisible）。
         （DevFaceProgress 已隨序列搬到 <SymbolScene>，避免同頁出現兩個進度顯示。） -->
    <ForumCore
      :active="forumCoreActive"
      :dot-visible="forumCoreDotVisible"
      :instant-hide="forumPathRiding"
    />
  </section>
</template>

<style lang="scss" scoped>
// 交棒期間由 ForumCore（fixed 黑底滿版）遮住，故本區白底不影響 crossfade。
// 白底：新版議程段為淺色稿；水平 padding 收掉，讓 <AgendaReport> 的灰底能滿版。
// 段落頂端的 140 留白掛在 .sec2__path 而非這裡：核心的設計線要從「黑白接縫」進場，
// 而它的座標原點是 .sec2__path 的 padding box —— 留白掛在 .sec2 會讓原點下沉 140，
// 線就少了那一段。見 architecture/forum-core-path.md。
.sec2 {
  --accent: var(--color-orange);

  min-height: 100vh;
  color: var(--color-gray);
  background-color: #fff;
}

// 路徑段：pc 稿 1280 基準，線與內容共用同一像素座標系（線不縮放，故尾端永遠咬住錨點）；
// 超寬視窗只是左右留白，不會讓線與內容產生相對位移。高度已改由三場內容自然撐開。
// 露出時機同議程（coreOut 後），避免 crossfade 期間從縫隙露餡。
.sec2__path {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 140px;
  opacity: 0;
  transition: opacity 0.4s ease;

  &--revealed {
    opacity: 1;
  }

  // 路徑層必須畫在 .sec2__pin 之上，否則橘核心走進後半段（議程／論壇四／精彩活動）
  // 之後就被那層的不透明白底整段蓋住、完全看不見。
  //
  // ⚠️ 這是對原設計的**刻意反轉**：後半段還沒有路徑之前，核心在議程段只是短暫掠過，
  //    「從議程背後穿過」是當時要的效果；現在核心要沿著後半段的線一路走到段落底，
  //    藏在背後就等於不存在。
  // 設計線本身不會因此露出來 —— 它預設是 transparent，只有 ?pathdebug 才上色
  //（見 ForumCorePath 的 .forum-path__line / .forum-path__gen）。
  z-index: 1;

  @include rwd-max('pc') {
    padding-top: 120px;
  }
}

// 段落主標：pc 左右 108 ＝ 設計稿內容邊界，與 <ForumEvent> 對齊；pad／mob 稿改置中。
.sec2__heading {
  display: flex;
  flex-direction: column;
  margin: 0 0 120px;
  padding: 0 108px;
  color: var(--accent);
  font-size: 56px;
  font-weight: 400;
  line-height: 1.22;

  @include rwd-max('pc') {
    align-items: center;
    margin-bottom: 88px;
    padding: 0 80px;
    font-size: 54px;
    line-height: 64px;
  }

  @include rwd-max('tablet') {
    margin-bottom: 140px;
    padding: 0 26px;
    font-size: 40px;
    line-height: 51px;
  }
}

// 議程＋recap 整組：coreOut 前一律藏著，避免 SymbolFace↔橘核心 crossfade 期間
// （淡出的星空層與淡入的橘核心黑底皆未達全滿）從縫隙短暫露餡；
// --revealed（agendaRevealed）時隨橘核心淡出而淡入，剛好接上。捲回自動反向。
//
// position + 白底原本是為了讓核心「從議程背後穿過」（本層在 DOM 後面 → 畫在上面）。
// ⚠️ 那個效果已經**刻意取消**：後半段的設計線一路走到段落底，核心得看得見才有意義，
//    故 .sec2__path 現在帶 z-index: 1、畫在本層之上（理由寫在那裡）。
// 白底仍然需要 —— 它是本層自身的遮蔽（原本靠 .sec2 的白底，那是祖先遮不到），
// crossfade 期間也靠它避免從縫隙露餡。AgendaReport 的灰底是子層，不受影響。
.sec2__pin {
  position: relative;
  background: #fff;
  opacity: 0;
  transition: opacity 0.4s ease;

  &--revealed {
    opacity: 1;
  }
}

// 論壇四的容器：<ForumEvent> 的 pc 版位是絕對定位到 1280 設計稿座標，
// 而 .sec2__pin 沒有限寬（它要讓 <AgendaReport> 的灰底滿版）→ 這層補上與
// .sec2__path 相同的 1280 置中，論壇四的座標才對得上。
// pad／mob 不需要限寬：那兩個斷點的 <ForumEvent> 已退回流排版、自帶左右 padding。
.sec2__forum4 {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
