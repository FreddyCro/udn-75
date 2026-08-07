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

const forum = str.forum as { heading: string[]; events: ForumEvent[] };
</script>

<template>
  <section id="forum" class="sec2" data-header-theme="light">
    <!-- 上半段（路徑段）：論壇一~三的內容 ＋ 核心沿設計線蛇行下行（見 temp/issue-05）。
         段落主標只在論壇一之前出現一次，故由本層渲染、不進 <ForumEvent>。
         設計線依錨點定位、核心沿驅動線移動（見 ForumCorePath）。 -->
    <div
      class="sec2__path"
      :class="{ 'sec2__path--revealed': agendaRevealed }"
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

      <!-- TODO 論壇四（青年永續築夢論壇，青年對話（二）／台積電文教基金會）：
           設計稿版式未定，先以虛線框佔位。定案後把這一塊換成正式版式或抽成元件即可，
           不必動 <Agenda>／<AgendaReport>／<ForumHighlights>。
           注意它位在 agenda 之後，不屬於 .sec2__path，故拿不到 <ForumCorePath> 的錨點。 -->
      <div class="sec2__forum4">論壇四・青年永續築夢論壇（版式待補）</div>

      <ForumHighlights />
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
// position + 白底是為了讓核心「從議程背後穿過」：.sec2__path 是 positioned（z-index auto）、
// 本層原本是 static，positioned 會畫在 static 之上 → 核心會浮在議程上面。兩者同層之後由
// DOM 順序決定，本層在後 → 在上；白底則是遮蔽本身（原本靠 .sec2 的白底，那是祖先遮不到）。
// 不需要 z-index。AgendaReport 的灰底是子層，畫在這層白底之上，不受影響。
.sec2__pin {
  position: relative;
  background: #fff;
  opacity: 0;
  transition: opacity 0.4s ease;

  &--revealed {
    opacity: 1;
  }
}

// 論壇四佔位框：虛線語彙沿用 <ForumEvent> 的講者照片 placeholder，一眼可辨為待補。
// 寬度取設計稿內容邊界（1280 − 左右各 108 ＝ 1064），高度為目測佔位值。
.sec2__forum4 {
  display: grid;
  place-items: center;
  max-width: 1064px;
  min-height: 1000px;
  margin: 80px auto;
  border: 1px dashed var(--accent);
  color: var(--accent);
  font-size: 32px;
  letter-spacing: 0.1em;

  // pad／mob 版式同樣未定，僅按各斷點內容寬度等比收斂，避免佔位框本身爆版。
  @include rwd-max('pc') {
    max-width: 608px;
    min-height: 600px;
    margin: 60px auto;
    font-size: 24px;
  }

  // justify-items 改回 stretch：place-items: center 會讓文字撐成 max-content 而不換行。
  @include rwd-max('tablet') {
    justify-items: stretch;
    max-width: none;
    min-height: 400px;
    margin: 40px 26px;
    padding: 0 16px;
    font-size: 18px;
    text-align: center;
  }
}
</style>
