<script setup lang="ts">
import str from '@/locales/section2.json';
import type { ForumEvent } from '~/types/forum';

// Section 2：agenda / recap（智慧論壇）
// 議程整組（時間軸＋recap）的內容與樣式已抽成 <Agenda>（02.forum/Agenda.vue），
// 本區只保留 pin 容器與顯隱時機。

// SymbolFace 序列（disperse→face→converge→enter）已搬到獨立的 <SymbolScene>（01a.symbol）：
// symbolProgress 寫入與 mode 指派都由該元件擁有，本區只「讀」它解出的結果：
//   forumCoreDotVisible — 橘點的顯隱：coreIn 起撐到論壇段路徑接手為止。
//   forumPathRiding     — 路徑已接手 → 橘點的消失改為瞬間（見 ForumCore 的 SCSS）。
//   agendaRevealed      — 越過 agendaIn → 論壇主標與議程揭露（在轉場層底下淡入）。
// 門檻見 ~/utils/orange-core-config 的 SYMBOL_STOPS / FORUM_HANDOFF。
const {
  forumCoreDotVisible,
  forumPathRiding,
  agendaRevealed,
  coverHoldArmed,
  forumPathActive,
  forumPathEvents,
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

// 設計線平常完全看不見 —— 它預設 stroke: transparent，開發時要對位才需要看見，
// 故用 ?pathdebug 把它上色（實際的上色規則在 ForumCorePath 的 .sec2__path--debug）。
// production 不帶參數 → 行為完全不變。
// ⚠️ 它**只**上色、不改層序：議程群組那一段的線仍被 .agenda__group 的白底遮住（那是刻意的，
//    否則就看不出核心該藏在哪裡）。要臨時看穿，把該處的 z-index 調到 2 以上。
const pathDebug = computed(() => route.query.pathdebug !== undefined);

// 講者照的藍塊：由橘核心走到照片時刷開（事件表的 forum1PhotoReveal / forum2PhotoReveal）。
// 完整設計見 architecture/2026-08-12-forum-speaker-photo-reveal-design.md。
//
// ⚠️ 設計線還沒量好、或整條線放棄時（forumPathActive 為 false）一律傳 undefined ——
//    遮罩連 DOM 都不渲染，照片直接看得到。兩個理由：
//    ① 線量好那一刻元素才掛上，CSS transition 不會在首次渲染跑（不會反向刷一次給人看）
//    ② 錨點量不到會讓整條線放棄、事件恆 false；預設蓋住的話照片會永久停在藍塊底下，
//       而且是靜默的（同 2026-08-09 那次 photo-slot 事故的形狀）
//    forumPathEvents 在 marks 還沒建起來時本來就回 false，但那正是「該蓋住」的值 ——
//    所以這道 forumPathActive 不是多餘的，它管的是「遮罩存不存在」而非「蓋不蓋住」。
const photoRevealOf = (no: string): boolean | undefined => {
  const key = photoRevealKeyFor(no);
  if (!key || !forumPathActive.value) return undefined;
  return forumPathEvents[key] === true;
};

// 覆蓋過場的 sticky 活動範圍高度。`.sec2__pin` 靠它才定得住那 100vh。
// ⚠️ 必須與 `.section3` 的負 margin-top 同值 —— 兩邊都從 `--vh` 取（這裡是
//    vhLength(1)、那裡是 SCSS 的 vh()），故恆等。任何一邊寫成字面 100vh 就會
//    在行動裝置網址列收合時脫鉤，頁面總高跟著變。
const coverHoldHeight = vhLength(1);

// `.sec2__pin` 的高度，寫進它自己的 `--sec2-pin-h` 供 sticky 的 top 算式用（見 SCSS）。
//
// 為什麼要量：定住的做法是把「頂端」夾在 vh() − 塊高，等價於把「下緣」夾在視窗底緣
// （理由見 SCSS 的 ⚠️）。而塊高隨內容、字體、斷點變，`?highlights` 開關也會改它，
// CSS 算不出來 —— 同 Blessing.vue 量 `--face-block-h` 的作法。
//
// 不會有「量測 → 改樣式 → 再觸發量測」的迴圈：top 只是 sticky 的夾點，不影響本塊的高度。
const pinRef = ref<HTMLElement | null>(null);
let pinRO: ResizeObserver | null = null;

const syncPinHeight = () => {
  if (!pinRef.value) return;
  pinRef.value.style.setProperty('--sec2-pin-h', `${pinRef.value.offsetHeight}px`);
};

onMounted(() => {
  syncPinHeight();
  if (pinRef.value && typeof ResizeObserver !== 'undefined') {
    pinRO = new ResizeObserver(syncPinHeight);
    pinRO.observe(pinRef.value);
  }
  // 兩個訊號都要聽，理由同 Blessing.vue 的 syncPartnersHeld：
  // ResizeObserver 是預設的 **content-box** 模式，而本塊的 padding-bottom 吃視窗高
  // （見 SCSS 的 min(vh(0.2), 200px)）—— 純粹的視窗變高只改 padding、不改內容高，
  // RO 因此完全不會發火，夾點就停在舊的塊高上（覆蓋過場的定住會歪掉那個差值）。
  // 不改用 { box: 'border-box' }：那個選項要 Safari 15.4+，而本專案受眾的舊裝置比例高
  // （同 architecture/viewport-height.md 不用 dvh 的理由），退化時又是靜默的。
  // 網址列收合造成的 resize 不會有副作用：--vh 刻意凍結 → padding 不變 → 寫回同一個值。
  window.addEventListener('resize', syncPinHeight, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncPinHeight);
  pinRO?.disconnect();
  pinRO = null;
});
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
      <!-- 逐行交給 <UArtLine>：稿字形素材（橘色）＋ visually-hidden 的真文字。
           見 architecture/2026-08-12-forum1-text-art-design.md。
           ⚠️ 素材寬要靠下方 SCSS 的 --art-base（＝該斷點的 font-size）才算得出來。 -->
      <h2 class="sec2__heading">
        <UArtLine v-for="(line, i) in forum.heading" :key="i" :line="line" />
      </h2>

      <!-- photo-reveal ＝ 講者照的藍塊狀態（三態，見 <ForumEvent> 的 prop 說明）。
           對照用場次名而非 v-for 索引：論壇三查不到 key ⇒ undefined ⇒ 不渲染遮罩，
           與它沒有講者的事實自然一致。 -->
      <ForumEvent
        v-for="(e, i) in forum.events"
        :key="i"
        :event="e"
        :photo-reveal="photoRevealOf(e.no)"
      />

      <ForumCorePath />
    </div>

    <!-- 議程整組：agendaRevealed（越過 coreOut）才淡入，見下方 .sec2__pin 註解。
         （原本這層同時是 forum pin 的釘住目標，該 pin 已隨 SymbolFace 序列移除 —— <SymbolScene>
           改用「不 pin 的捲動尺」，見該元件註解。） -->
    <div
      ref="pinRef"
      class="sec2__pin"
      :class="{
        'sec2__pin--revealed': agendaRevealed,
        'sec2__pin--held': coverHoldArmed,
      }"
    >
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

    <!-- 接縫標記：零高度、**不** sticky，位置恆等於 .sec2__pin 的自然下緣。
         它是 <ForumCorePath> 的末節點錨點（forum-node-path 的 SEAM_END）——
         不直接量 .sec2__pin 是因為它現在是 sticky，量測若發生在 sticky 已 engage 時
         rect 會是位移後的值。見設計稿第八節。 -->
    <div class="sec2__seam" aria-hidden="true" />

    <!-- 覆蓋過場：撐出 .sec2__pin 的 sticky 活動範圍（＝ 定住最後一屏的 100vh）。
         這 100vh 由 .section3 的負 margin-top 蓋回來，頁面總高淨零。 -->
    <div
      class="sec2__cover-hold"
      :style="{ height: coverHoldHeight }"
      aria-hidden="true"
    />

    <!-- forum 接棒的橘核心（收斂點 → 硬切 → 橘方塊）。fixed 置中、由 SymbolScene 寫入的
         symbolProgress 隔空驅動，故放在議程整組之外。coreIn 起現身、撐到論壇段路徑接手
         （見 ForumCore 與 useOrangeCoreProgress 的 forumCoreDotVisible）。
         （進度除錯已整合成跨章節的 <DevCoreProgress>，掛在 pages/index.vue，?pathdebug 開啟 ——
           就是本檔下方 pathDebug 用的同一個參數。） -->
    <ForumCore :dot-visible="forumCoreDotVisible" :instant-hide="forumPathRiding" />
  </section>
</template>

<style lang="scss" scoped>
// 交棒期間由轉場層（fixed 滿版、不透明）遮住，故本區白底不影響交棒。
// 白底：新版議程段為淺色稿；水平 padding 收掉，讓 <AgendaReport> 的灰底能滿版。
// 段落頂端的 140 留白掛在 .sec2__path 而非這裡：核心的設計線要從「黑白接縫」進場，
// 而它的座標原點是 .sec2__path 的 padding box —— 留白掛在 .sec2 會讓原點下沉 140，
// 線就少了那一段。見 architecture/forum-node-path.md 第五節。
.sec2 {
  --accent: var(--color-orange);

  min-height: vh();
  color: var(--color-gray);
  background-color: #fff;
}

// 路徑段：pc 稿 1280 基準，線與內容共用同一像素座標系（線不縮放，故尾端永遠咬住錨點）；
// 超寬視窗只是左右留白，不會讓線與內容產生相對位移。高度已改由三場內容自然撐開。
// 露出時機同議程（agendaIn 後，在轉場層底下淡完）。
// ⚠️ padding-top 那 140px 同時是「交棒時看得到多少主標」的一部分：接縫落在螢幕
//    SEAM_AT_HANDOFF_VH（60vh），主標從它下方 140px 起 —— 動這個值要回頭驗那一屏。
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

  // 路徑層必須畫在 .sec2__pin 之上，否則橘核心走進後半段（論壇四／精彩活動）之後
  // 就被那層的不透明白底整段蓋住、完全看不見。
  //
  // 唯一的例外是議程的**群組那一疊**：核心該從它們背後穿過（穿完就現形，CTA 那塊看得見）。
  // 那是靠 .agenda__group 自己 z-index: 2 ＋ 白底再蓋回來處理的（理由寫在 Agenda.vue），
  // 不是靠這裡的層序 —— 後半段其餘部分仍要露出核心，整層 .sec2__pin 提上來會連論壇四一起遮掉。
  // 設計線本身不會因此露出來 —— 它預設是 transparent，只有 ?pathdebug 才上色
  //（見 ForumCorePath 的 .forum-path__line / .forum-path__gen）。
  z-index: 1;

  // pad 稿是 768 畫布，內容欄 608（＝768 − 80×2，視窗 ≥783 或無捲軸時；768 帶傳統
  // 捲軸時容器吃不滿，內容欄約 593）。固定成 768 置中之後，內容與設計線落在同一個
  // 「稿座標系」上，線的 x 比例（＝稿座標 ÷ 768）就是 1:1 重現。
  // 流動容器的代價見 architecture/2026-08-12-forum-pad-container-design.md 第一節：
  // 1279 時內容欄撐到 1119、容器高度還會隨寬度差 396px，線在每個寬度都長得不一樣。
  @include rwd-max('pc') {
    max-width: 768px;
    padding-top: 120px;
  }

  // ⚠️ rwd-max('pc') 涵蓋 mob，故這裡必須把上限寫回 none（同 .agenda 的作法）。
  @include rwd-max('tablet') {
    max-width: none;
  }
}

// 段落主標：pc 左右 108 ＝ 設計稿內容邊界，與 <ForumEvent> 對齊；pad／mob 稿改置中。
.sec2__heading {
  // 稿字形素材的寬度基準（見 <UArtLine>）：無單位，恆等於同一區塊的 font-size。
  // 素材本身是橘的（#ff7f00 ＝ --color-orange），故這裡的 color 只服務活文字 fallback。
  --art-base: 56;

  display: flex;
  flex-direction: column;
  margin: 0 0 120px;
  padding: 0 108px;
  color: var(--accent);
  font-size: 56px;
  font-weight: 400;
  line-height: 1.22;

  // pad／mob 置中：素材那一層不必特別處理 —— span 帶明確寬度，
  // 由 align-items: center 把整個 span 置中，img 在 span 內 left: 0 即可。
  @include rwd-max('pc') {
    --art-base: 54;

    align-items: center;
    margin-bottom: 88px;
    padding: 0 80px;
    font-size: 54px;
    line-height: 64px;
  }

  @include rwd-max('tablet') {
    --art-base: 40;

    margin-bottom: 140px;
    padding: 0 26px;
    font-size: 40px;
    line-height: 51px;
  }
}

// 議程＋recap 整組：agendaIn 前一律藏著，那 0.4s 的淡入在轉場層還蓋著的時候跑完
// （見 useOrangeCoreProgress 的 agendaRevealed）。捲回自動反向。
//
// 白底是本層自身的遮蔽（原本靠 .sec2 的白底，那是祖先遮不到），crossfade 期間也靠它
// 避免從縫隙露餡。AgendaReport 的灰底是子層，不受影響。
// ⚠️ 它**遮不住核心** —— .sec2__path 帶 z-index: 1、畫在本層之上（理由寫在那裡）。
//    「核心從議程群組背後穿過」是由 .agenda__group 自己 z-index: 2 ＋ 白底達成，不是靠這層。
//    要讓後半段某一塊也擋住核心，同樣得在那一塊上做，不能改本層。
.sec2__pin {
  // 平時是 relative，**不是** sticky —— sticky 不論 z-index 都會建立 stacking context，
  // 會把 .agenda__group 的 z-index: 2 關進來，讓「核心從議程群組背後穿過」失效。
  // 只有 cover 期間才掛 sticky（--held，由 coverHoldArmed 決定），那時核心早已走完設計線。
  position: relative;
  // forum 尾段與 blessing 色塊之間的留白：視窗高的 20%，上限 200px（三個斷點同式）。
  // 隨視窗高走是因為它是「最後一屏底部的呼吸空間」——矮視窗給固定值會吃掉太多內容；
  // 200px 的上限則是不讓高螢幕把接縫推得太遠（1080 起就卡在 200）。
  // 用 vh() 而非字面 20vh：視窗高在本專案是單一來源（--vh），見 architecture/viewport-height.md。
  //
  // 加在**本塊內部**是唯一正確的放法：接縫（.sec2__seam，本塊的下一個零高度兄弟）是
  // 三件事共用的同一個位置 —— 設計線末節點的錨點、色塊上緣（.sec2__cover-hold 100vh
  // 被 .section3 的負 margin 抵銷後恰好落在此）、以及路徑 ScrollTrigger 的 end
  // （吃 tailEndY）。padding 加在這裡，三者一起下移，耦合不斷；把這段留白塞在接縫
  // **之後**（spacer 前後）則只推色塊、不推末節點，飛機會在接縫上方鑽進一片空白。
  //
  // ⚠️ 本值隨視窗高變 → --sec2-pin-h 必須跟著重量，而 syncPinHeight 的 ResizeObserver
  //    是預設的 content-box 模式、**padding 的變化不會觸發它**（本塊的內容高只隨寬度變）。
  //    所以 script 那邊另外掛了 resize —— 少了它，>25% 的高度變動（分割畫面、轉螢幕）
  //    會讓夾點停在舊的塊高上，症狀是覆蓋過場期間 forum 最後一屏沒有精準定住。
  //
  // 代價（2026-08-20 以 100px 實測，三斷點交棒精準度與定住誤差皆不變）：設計線末段被拉長
  // 同樣的距離，而 join 的控制點是弦相對的 → 末端切線隨弦轉（100px 時 pc 98.6→91.2、
  // pad 120.4→127.6、mob 78.1→72.7，約 5–7°；本值放大則角度差跟著放大），飛機下潛距離
  // 差幾 px。那個角度本來就隨版面浮動（?highlights 一開就會動），故**不**去補償
  // R4/S4/T5 的 join.relOut —— 針對單一視窗尺寸硬調反而讓原本自適應的東西變脆。
  padding-bottom: min(#{vh(0.2)}, 200px);
  background: #fff;
  opacity: 0;
  transition: opacity 0.4s ease;

  &--revealed {
    opacity: 1;
  }

  // 覆蓋過場：定住「forum 最後一屏」讓 blessing 的色塊蓋過去（設計師：精彩活動 fix 在
  // 畫面中心、下個 section 往上蓋）。活動範圍由後面的 .sec2__cover-hold 撐出來，
  // 所以定住的距離恰好等於色塊上升的 100vh，兩段不需要另一條 trigger 去同步。
  // 定住的是下緣貼視窗底緣的「最後一屏」，與尾端是精彩活動還是論壇四無關
  // （靠什麼夾點做到見下方 top 的推導 —— 不是 bottom: 0）。
  &--held {
    position: sticky;
    // ⚠️ 用 top 而**不是** bottom —— 這是本段唯一容易寫錯的地方。
    //   `bottom: 0` 的語意是「不讓下緣掉到視窗底緣**以下**」：它在還沒捲到本塊時先把它
    //   往**上**拉進畫面，捲過去就放行 —— 永遠不會把元素往**下**推。而「捲過去時原地不動」
    //   需要的正是往下推。實測 bottom: 0 完全沒有定住效果（下緣以 1:1 跟著捲動走）。
    //   top 才是往下推的那一側；本塊**比視窗高**，所以夾點要放在 vh() − 塊高 ——
    //   把「頂端」夾在那裡等價於把「下緣」夾在視窗底緣。實測 cover 全程 100vh 誤差 0px。
    //
    //   它也剛好在對的時機開始：夾點觸發的條件是「自然頂端升過 vh() − 塊高」，
    //   等價於「自然下緣升過視窗底緣」，而自然下緣就是接縫 —— 也就是 cover 的起點，
    //   不會提早定住。放行則由容器（.sec2）的下緣決定，也就是 .sec2__cover-hold 用完的那一刻。
    //
    // --sec2-pin-h 由 JS 量（見 script）。fallback 故意給一個大到不可能的值 ——
    // 夾點會變成極負數、sticky 永遠不觸發 → 退回「不定住」的原本行為。
    // 量不到的時候寧可**沒有效果**，也不要一個錯的定住（例如 fallback 給 0 會讓
    // 夾點變成 100vh，整個 forum 尾段被往下推出畫面）。
    top: calc(#{vh()} - var(--sec2-pin-h, 100000px));
  }

  // 量測期間退回一般流：sticky 位移會污染 .sec2__pin **內部**所有錨點的 rect
  // （論壇四的 tag／cta／speakers、精彩活動的 item、議程本身）—— 不會報錯，
  // 整條線／議程的判定線靜默歪掉。見設計稿第八節。
  // 屬性由**兩個**量測者各自在前後開關：ForumCorePath.build()（設計線錨點，掛 refreshInit）
  // 與 Agenda.measure()（群組邊界與 startScroll，掛 refresh）。兩者都是設值 → 量測 → 還原
  // 在同一個 task 內完成，中間不會 paint，畫面不會跳；巢狀設定同一個屬性也無害。
  .sec2[data-path-measuring] & {
    position: static;
  }
}

// 接縫標記：零高度，只用來給路徑量位置（見 template 註解）。
.sec2__seam {
  height: 0;
}

// 覆蓋過場的 sticky 活動範圍：高度由 inline style 給（vhLength(1)），這裡不定高 ——
// 與 .section3__partners-hold 同一個作法（sticky 的活動範圍必須是**子元素**撐出來的，
// 用 .sec2 的 padding 撐不出來）。

// 論壇四的容器：<ForumEvent> 的 pc 版位是絕對定位到 1280 設計稿座標，
// 而 .sec2__pin 沒有限寬（它要讓 <AgendaReport> 的灰底滿版）→ 這層補上與
// .sec2__path 相同的置中容器，論壇四的座標才對得上。
// pad 同樣要跟著收成 768 —— 後半段設計線的 x 是 .sec2__path 寬度的比例，
// 兩層不同寬的話線與論壇四會分家。mob 才退回不限寬（那個斷點自帶左右 padding）。
.sec2__forum4 {
  max-width: 1280px;
  margin: 0 auto;

  @include rwd-max('pc') {
    max-width: 768px;
  }

  @include rwd-max('tablet') {
    max-width: none;
  }
}
</style>
