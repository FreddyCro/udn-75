<script setup lang="ts">
// hero：第一屏影片區塊（含 SEO 文字、skip 按鈕、下滑提示）。
// 影片四階段狀態自 useHeroVideo 全域共享；「各階段秒數」與「RWD 影片來源」集中在
// ~/utils/hero-video-config，本元件只負責依設定驅動 <video>（seek / loop / 換狀態）。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import str from '@/locales/section1.json';
import { getDeviceTypeByResolution } from '@/utils/get-device';
import {
  HERO_DISSOLVE_VH,
  HERO_SKIP_APPEAR_AT,
  HERO_VIDEO_POSTER,
  HERO_VIDEO_READY_TIMEOUT,
  HERO_VIDEO_SRC,
  heroVideoSegments,
  type HeroVideoDevice,
  type HeroVideoSegment,
} from '@/utils/hero-video-config';
import {
  DISSOLVE_ENTER,
  DISSOLVE_LEAVE,
  dissolveState,
} from '@/utils/hero-dissolve';
// ── PoC：退場改由「sticky ＋ 揭露雙條件」驅動（2026-08-20 起）─────────
// 取代原本的「stage opacity ＝ 1 − p」溶解。設計師的三條需求是：outro 走完才接 intro、
// 不要 body lock、不要因為捲太快而看不到 outro。
//
// 三條全部由**揭露的雙條件**滿足（見 applyDissolve）：影片播完 ＋ 捲動走完。
// 影片全程以 1× 播放，不 seek、不變速、不暫停 —— 兩條被實測否決的路留在紀錄裡：
//   逐幀 seek     三支剪輯關鍵幀平均間距 4.2s，退場段內 pc/pad 各 1 個、mob 0 個，
//                 每次 seek 要重解 57–143 幀（實測 38–157ms）＝ 畫面只能更新 6–26 次／秒
//   倍速追趕      連續值在固定刷新率螢幕上必然 cadence judder；改離散 {1,2} 後每次
//                 改變 playbackRate 都讓媒體管線重新同步（約 200ms 擾動）反而更糟
//                 （詳見 tickOutro 的註解）

const {
  state: heroState,
  setState,
  skip,
  videoReady,
  heroStarted,
  currentTime,
  scrubArmed,
  skipOpening,
  openingSkipped,
  outroSpent,
  outroForced,
} = useHeroVideo();

// 視窗高的單一來源（--vh）：scrub 的 end 吃它，不吃 window.innerHeight
// （後者在行動裝置上會隨網址列收合而變，見 useViewportHeight）。
const { vhPx } = useViewportHeight();

// skip 按鈕的現身條件（設計稿 #BN skip）：正片播放 HERO_SKIP_APPEAR_AT 秒後淡入，
// 正片播完進 loop 就淡出。
// 綁「影片時間軸」而非 setTimeout：暫停 / 換 RWD 來源重載 / 倒帶回 loop
// 都自動一致，也沒有計時器要清。currentTime 由 onTimeUpdate 寫入（約每 250ms）。
const showSkip = computed(
  () => heroState.value === 'main' && currentTime.value >= HERO_SKIP_APPEAR_AT,
);

// 按下 skip 前先把 focus 交還：skip() 會讓 heroState 離開 main → showSkip 轉 false，
// 按鈕當下就要消失，focus 沒有留在原處的理由，直接退回 body。
// 不倚賴 inert 幫忙：實測 Chrome 的 inert 是「下一個 frame」才把 focus 移出（設下去的那個
// tick 仍是 activeElement），中間那段空窗期不該存在 —— 這裡同步做掉。
// ⚠️ 順序不可換：先 blur 再改狀態。
function onSkipClick(e: MouseEvent) {
  (e.currentTarget as HTMLElement | null)?.blur();
  skip();
}

// 全站音效開關：開啟時本影片不 muted（見 composables/useAppSound）。
const { soundOn } = useAppSound();

// 資源路徑前綴同 UVid / UPic（dev/prod 為空字串）
const runtime = useRuntimeConfig();
const ASSETS_PATH = runtime.public.APP_ASSETS_PATH;

// SSR 安全：先以 'pc' 為預設（與初次 client render 一致，避免 hydration mismatch），
// 掛載後再依實際解析度校正並監聽 resize（同 UVid）。
const device = ref<HeroVideoDevice>('pc');
const videoEl = ref<HTMLVideoElement | null>(null);
const heroEl = ref<HTMLElement | null>(null);
const stageEl = ref<HTMLElement | null>(null);

// Hero 需要 <video> 的螢幕矩形與 videoWidth/Height，才能把影片裡那顆 orange core 的落點
// 換算成螢幕座標（退場交棒，見 ~/utils/hero-core-handoff）。
defineExpose({ videoEl });

const videoSrc = computed(() => `${ASSETS_PATH}${HERO_VIDEO_SRC[device.value]}`);
const videoPoster = computed(() => {
  const poster = HERO_VIDEO_POSTER[device.value];
  return poster ? `${ASSETS_PATH}${poster}` : undefined;
});
// 目前裝置的階段秒數（pad / mob 有覆寫就用覆寫）
const segments = computed(() => heroVideoSegments(device.value));

let readyTimer: ReturnType<typeof setTimeout> | undefined;
// 切換 RWD 來源會重新載入影片：先記住秒數，metadata 就緒後跳回原處續播
let resumeAt = 0;

// 這一顆 <video> 自己的可播放狀態。與全域 videoReady 分開：後者是給 HeroLoader 的握手用的、
// 跨導航不重設，拿來當「本元素可不可以顯示」會在重新掛載時失準 —— 首頁 → 子頁 → 點 logo
// 回來時元素是全新的（readyState 0），全域旗標卻還是上一次的 true，防白閃的守衛就整條失效。
const elementReady = ref(false);

// 放行 HeroLoader（canplay / 逾時 / 載入失敗都算「不再等影片」）
const markReady = () => {
  videoReady.value = true;
  elementReady.value = true;
  if (readyTimer) {
    clearTimeout(readyTimer);
    readyTimer = undefined;
  }
};

// muted 的最終值由 JS 決定：template 上的 muted 屬性只是「JS 跑起來之前」的保險
// （SSR / hydration 下 template 的 muted 不一定落到 DOM property，且絕不能先漏音）。
// soundOn 為 true 時不 muted —— 播放一律由 start 按鈕那次點擊觸發（有使用者手勢），
// 故有聲播放不會被瀏覽器封鎖；仍保留下方 catch 的 fallback 以防萬一。
async function play() {
  const v = videoEl.value;
  if (!v || heroState.value === 'gone') return;
  v.muted = !soundOn.value;
  try {
    await v.play();
  } catch (err) {
    // ⚠️ 只有「自動播放被封鎖」才放棄整段 hero —— 那時非放棄不可，否則 main / loop 的
    // 捲動鎖會把使用者永久鎖在第一屏。其餘 rejection 幾乎都是 AbortError：
    // promotePreload() 的 load() 撞上掛載時這次 play()、或 RWD 換 :src 造成的中斷。
    // 影片本身沒問題，loadedmetadata / watch(heroState) 會再播一次；
    // 一律當成被封鎖就會讓正常使用者莫名其妙看不到開場。
    if ((err as DOMException | undefined)?.name !== 'NotAllowedError') return;
    // 自動播放被封鎖是第四條「不經 scrub 進 gone」的路徑（其餘三條 skip() / onError() /
    // bypassLoader() 都已呼叫 skipOpening()）：呼叫 skipOpening() 而非裸 setState('gone')，
    // 否則 openingSkipped 不會被設，下一次捲動 scrub 讀到 p 落在 (ENTER, 1) 會判成 outro，
    // 把影片 seek 回退場段再 play() → 再被擋 → 又 setState('gone') → 狀態在 outro / gone
    // 之間每個捲動幀來回震盪、影片每幀重新 seek（2026-08-16 於 iOS 低耗電模式實測到）。
    markReady();
    skipOpening();
  }
}

function onCanPlay() {
  markReady();
}

function onLoadedMetadata() {
  const v = videoEl.value;
  if (!v) return;
  // 換來源（RWD）後跳回原本秒數
  if (resumeAt > 0) {
    v.currentTime = resumeAt;
    resumeAt = 0;
  } else {
    // watch(heroState) 只在「狀態改變」時對齊，但狀態可能在本元件存在之前就已經設好：
    // 帶 #loop 進站時 Hero 於自己的 setup 內就把 heroState 設成 loop，那時本元件（子層）
    // 還沒建立、watcher 也還沒註冊 —— Vue 的 watch 不會補發早於它的變更。
    // 不補這一次對齊，影片會從 0s 播整段正片，直到 33s 才跳回 loop 起點。
    alignToSegment(v);
  }
  // 使用者已按下 start 才播（首次載入時通常還沒按，由下方 watch(heroStarted) 接手）
  if (heroStarted.value) void play();
}

// 段落的實際結束秒數。config 的 end 為 HERO_VIDEO_END（＝播到影片結束）時改以 duration 推，
// 留 0.1s 餘裕當收尾點：與 @ended 互為保險 —— seek 過的影片偶有不觸發 ended 的情形，
// 那時 gone 永遠不來、orange core 就接不上。duration 還沒讀到就回 Infinity（等 @ended）。
function segEnd(v: HTMLVideoElement, seg: HeroVideoSegment) {
  if (Number.isFinite(seg.end)) return seg.end;
  return v.duration ? v.duration - 0.1 : Infinity;
}

// 把影片對齊到目前狀態該在的段落：已在段內就不動（避免自動推進時多跳一下）。
// 用 segEnd 而非 seg.end：end 若填 HERO_VIDEO_END(Infinity)，直接比會把「影片已播完」
// 也算在段內 → play() 對已 ended 的影片會從 0 重播整支。
function alignToSegment(v: HTMLVideoElement) {
  const s = heroState.value;
  if (s === 'gone') return;
  const seg = segments.value[s];
  if (v.currentTime < seg.start || v.currentTime >= segEnd(v, seg)) {
    v.currentTime = seg.start;
  }
}

// 退場影片自己的進度（0 ＝ 剛進退場段、1 ＝ 已播到最後一格）。
// 讀 <video> 而非從捲動推算：「影片播完了沒」的唯一真相在影片身上，而揭露引言的條件
// 有一半就是它（見 applyDissolve 的兩個條件）。
function outroProgress(v: HTMLVideoElement) {
  const seg = segments.value.outro;
  return (v.currentTime - seg.start) / (seg.end - seg.start);
}

// 階段推進的單一真相＝影片時間軸：依 config 的段落秒數判斷何時換狀態 / 循環。
function onTimeUpdate() {
  const v = videoEl.value;
  if (!v) return;
  currentTime.value = v.currentTime;
  const seg = segments.value;

  switch (heroState.value) {
    case 'main':
      if (v.currentTime >= seg.main.end) setState('loop'); // 主要內容播完 → loop 段
      break;
    case 'loop':
      if (v.currentTime >= seg.loop.end) v.currentTime = seg.loop.start; // loop 段循環
      break;
    case 'outro':
      // 退場段播到 outro.end（38.5s，非影片結尾）：停在最後一格，不再自己 setState('gone')。
      // ⚠️ outro → gone 的唯一權威是 scrub（dissolveState，見 applyDissolve）。這裡若也
      // 寫狀態，會與 scrub 變成兩個互相打架的驅動源：退場段只有 2.5 秒，使用者若捲得比
      // 這慢（或捲進退場後停住），影片會先自己播完被判 gone；之後任何一點捲動讓 p 落回
      // (ENTER, 1) 又會被 dissolveState 判回 outro，把影片 seek 回 36s 重播（2026-08-16
      // 實測到的抽搐）。故這裡只暫停影片、把「該不該進 gone」整個交給 p 是否 ≥ 1。
      // !v.paused 早退：避免 timeupdate 每幀（~250ms）都重複呼叫 pause()。
      if (v.currentTime >= segEnd(v, seg.outro) && !v.paused) v.pause();
      break;
  }
}

// 影片播到尾（config 的 end 設得比影片長時會先發生）：視為當前段落結束。
function onEnded() {
  const seg = segments.value;
  if (heroState.value === 'main') {
    setState('loop'); // 下方 watch 會把時間拉到 loop 起點
    return;
  }
  if (heroState.value === 'loop') {
    const v = videoEl.value;
    if (v) v.currentTime = seg.loop.start;
    void play();
    return;
  }
  // outro 播到底（@ended，通常先被上面 onTimeUpdate 的暫停攔到，這裡是保險）：
  // 影片已經自然停在最後一幀，不必再做什麼。狀態改變交給 scrub（理由同 onTimeUpdate）。
}

function onError() {
  // 影片載入失敗：放行載入層並直接跳過開場 —— 否則捲動鎖會把整頁鎖死。
  // ⚠️ 呼叫 skipOpening() 而非 setState('gone')：後者不會設 openingSkipped，
  //    畫面上沒有影片可淡，之後 scrub 讀到的 p 只要越過門檻仍會把 stage 淡回來、
  //    等於把一支根本沒播出來的影片「復原」在畫面上。
  markReady();
  skipOpening();
}

// ── hero 捲出視窗 → 直接收尾 ────────────────────────────────────────
// orange core 綁在 gone 上（見 Hero.vue 的 coreVisible），影片沒播完 core 就不會出現。
// 影片都已經捲出視窗了，繼續播只是讓 core 遲到 —— 直接進 gone。兩種情形都吃得到：
//   ① 退場播到一半被捲走 → 不必等剩下的秒數
//   ② 倒帶回 loop 後用捲軸 / End 鍵跳走（跳得比 dissolveST 的 end 還遠，scrub 來不及
//      判定就已經離開視窗）→ 否則影片在畫面外無限循環，core 永遠不出現
// main 期間頁面鎖著（見 useHeroVideo 的 shouldLockScroll），hero 不可能離開視窗，
// 故這條實際上只在「離開過 loop」之後生效。
let heroIO: IntersectionObserver | null = null;

// 狀態改變（SKIP / scrub / 自動推進）→ 對齊該段起點並續播；gone 則停住影片。
// 已落在目標段內就不 seek：main → loop 是相接的，自動推進不會有跳動。
// loop → outro 則必定 seek（33 → 36 中間刻意留白，見 hero-video-config 的段落表）。
watch(heroState, (s) => {
  const v = videoEl.value;
  // 離開退場就一定要收掉追趕迴圈（含 v 為 null 的情形），否則 rAF 會一直空轉。
  stopOutroTick();
  if (!v) return;
  if (s === 'gone') {
    v.pause();
    return;
  }
  // 倍速歸位：main／loop 一律 1×，且回捲離開退場時要把上一輪殘留的倍速清掉 ——
  // 不清的話 loop 段會以 2× 循環播放。
  v.playbackRate = 1;
  alignToSegment(v);
  void play();
  // 這個 rAF 只在退場期間有工作（見 tickOutro）。
  if (s === 'outro') outroRaf = requestAnimationFrame(tickOutro);
});

// 按下 start 後才開始播 main（見 useHeroVideo 的 heroStarted）
watch(heroStarted, (started) => {
  if (started) void play();
});

// 音效開關可在播放中被切換（例如未來在 Header 加上按鈕）→ 即時套用到 <video>。
watch(soundOn, (on) => {
  const v = videoEl.value;
  if (v) v.muted = !on;
});

// ── 退場：sticky 保持影片在畫面上，這條 ST 只讀進度 ──────────────────
// 不 pin（理由寫在 .sec1__hero 的 SCSS 註解：兩種 pinType 在這個 DOM 結構下都會抖）。
let dissolveST: ScrollTrigger | null = null;
// 上一次 applyDissolve 收到的 p：用來辨識「回捲跨過 DISSOLVE_LEAVE」那一刻（見下方）。
let lastDissolveP = 0;
// 退場期間的 rAF（見 tickOutro）。
let outroRaf = 0;

function buildDissolveST() {
  if (!heroEl.value) return;
  dissolveST = ScrollTrigger.create({
    // ⚠️ 用**數值** start／end，不要 trigger ＋ 'top top'（2026-08-21 修正）：
    //    以 .sec1__hero 當 trigger 時，ScrollTrigger 量到的起點是 scrollY 1080 而不是 0
    //    —— 那是個 position: sticky 元素，量測會拿到它「黏住之後」的位置。實測基準線
    //    （sticky ＋ 'top top'）：y=1080 時 stage 的 opacity 還是 1、y=1620 才 0.5，
    //    反推起點 1080、終點 2160，整段退場落在錯的捲動區間、而 sticky 早在 1298 脫黏。
    //    退場的起點在語意上就是 page top（scrollY 0），寫成數值最直接、也繞開量測。
    // vhPx 而非 window.innerHeight：後者在行動裝置上會隨網址列收合而變（見 useViewportHeight）。
    start: 0,
    end: () => vhPx(HERO_DISSOLVE_VH),
    // scrub 已移除：它只對「掛在 ST 上的 animation」有意義，本 ST 沒有動畫、只讀 progress。
    invalidateOnRefresh: true,
    onUpdate: (self) => applyDissolve(self.progress),
    // 快速捲過整段時 onUpdate 不保證收到端點值 —— 明確補上，否則影片會賴在畫面上不走。
    onLeave: () => applyDissolve(1),
    onLeaveBack: () => applyDissolve(0),
    onRefresh: (self) => applyDissolve(self.progress),
  });
}

// 退場期間每幀跑一次，唯一的工作是補叫 applyDissolve。
//
// 為什麼需要它：揭露引言的條件有一半是「影片播完」，而那**不由捲動事件驅動** ——
// 使用者可能早就停下手了。少了這一條，影片播完也不會有人去揭露引言。
// applyDissolve 是幂等的（同一個 p 重複呼叫只會寫回相同的 class、setState 只在改變時發），
// 故直接每幀呼叫，不必多養一面「已播完」的旗子。
//
// ── 為什麼這裡不再調 playbackRate ────────────────────────────────────
// 曾經有一版讓影片以倍速「追趕」捲動（2026-08-21 刪除，見 git 紀錄的
// hero-outro-rate.ts）。刪掉的理由是量測結果：
//   ① 連續變化的倍速在固定刷新率螢幕上必然抖 —— 影片 30fps、螢幕 60Hz，只有 1× 與 2×
//      能整除，中間值會讓影格在 1 與 2 次刷新之間不規則交替（cadence judder）。
//   ② 改成離散 {1, 2} 之後**更糟**：每次**改變** playbackRate 都讓媒體管線重新同步
//      （約 200ms 的節奏擾動），而切換頻繁時比連續值還難看。加了 600ms 最小駐留把
//      切換壓到 0–1 次仍留有殘影。
//   （附帶結論：每幀寫入**相同**值是無害的，代價全在改變那一刻。）
//
// 而「追趕」換到的好處其實很小：揭露條件本來就會等影片播完，倍速只影響「捲很快的人
// 在最後等多久」（1.25s vs 2.5s）。用一個看得見的擾動換那個，不划算。
//
// 恆定 1× ⇒ 零次節奏改變，而設計師的三條需求一條都沒掉：退場照樣完整播完
// （揭露的雙條件保證）、不鎖捲動、不會因為捲太快而看不到退場。
function tickOutro() {
  outroRaf = 0;
  if (!videoEl.value || heroState.value !== 'outro') return;
  applyDissolve(dissolveST?.progress ?? 0);
  outroRaf = requestAnimationFrame(tickOutro);
}

function stopOutroTick() {
  if (outroRaf) cancelAnimationFrame(outroRaf);
  outroRaf = 0;
}

function applyDissolve(p: number) {
  const stage = stageEl.value;
  const v = videoEl.value;

  // ── 回到頂端 ＝ 整趟重新武裝（連「開場已被跳過」也解除）──────────────
  // 判的是**跨越**而非 p < LEAVE 本身：SKIP／載入失敗／帶 hash 進站都發生在 p ＝ 0，
  // 若只看當下值，skipOpening() 觸發的這次 applyDissolve 會立刻把旗子清回去，
  // 影片根本不會消失（SKIP 等於失效）。只有「先離開過門檻、再回捲跨回來」才算數 ——
  // 那正是使用者由下往上捲回 page top 的軌跡。
  // 未 arm 期間的 p 是子頁帶過來的雜訊（見 scrubArmed），跨越照樣吞掉不處理。
  const returnedToTop = p < DISSOLVE_LEAVE && lastDissolveP >= DISSOLVE_LEAVE;
  lastDissolveP = p;
  // 清掉後下方 alpha 才算得出 1（同一次呼叫內影片就淡回來，不必等下一個捲動事件）。
  if (returnedToTop && scrubArmed.value) openingSkipped.value = false;

  // ── 揭露引言：兩個條件都要成立 ──────────────────────────────────────
  // ① 影片播完 —— 設計師要的「outro 走完才接 intro」。
  // ② 捲動走完（p ≥ 1）—— 少了這條，慢慢捲的人會在 scrollY 600 就看到影片消失，
  //    而引言上緣還在螢幕下方一千多 px 處，等於揭露到一片空白。
  // 「影片播完但還沒捲完」不是新狀態：它就是現在 SKIP 的畫面（退場停在最後一格 ＋
  // 下滑提示在場），已經核准過。
  //
  // ⚠️ outroSpent 要短路掉條件 ①：這一趟已經交棒過的話，影片早就被 seek 回 loop 段
  //    （見 dissolveState 的 outroSpent 規則），outroProgress 會是負的、永遠等不到 1，
  //    再往下捲就永遠揭露不了引言。已經看過退場的人不必再等它一次。
  const videoDone = outroSpent.value || !v || outroProgress(v) >= 1;
  // opacity 這行必須不論 scrubArmed／openingSkipped 都跑：SKIP／載入失敗當下 scrub
  // 可能還沒 arm（或已被跳過鎖死），stage 若少了這行會維持初始的完全不透明，
  // 影片永遠蓋在畫面上不走。
  const revealed = openingSkipped.value || (p >= 1 && videoDone);
  // 顯隱交給一個 class，淡出長度與 visibility 的時序都在 SCSS（見 .sec1__hero-stage）。
  // 每幀重複 toggle 同一個值對 DOM 是 no-op，不會反覆重啟 transition。
  if (stage) stage.classList.toggle('is-revealed', revealed);
  if (!scrubArmed.value || openingSkipped.value) return;
  // 捲回頂端 ＝ 重新武裝：下一趟下滑要再放一次完整的退場段。
  // （設起的點在 setState('gone')，見 useHeroVideo 的 outroSpent。）
  if (p < DISSOLVE_LEAVE) outroSpent.value = false;
  // 使用者真的開始捲了 → SKIP 那面栓退場，其後一切照常規則走。
  // ⚠️ 不清的話，捲到一半再回頂端會卡在 outro 回不去 loop（栓會擋掉「回 loop」那一條）。
  if (p >= DISSOLVE_ENTER) outroForced.value = false;
  // 影片還沒播完就把 p 壓在 1 之下：dissolveState 是以 p ≥ 1 判 gone，而 gone 現在必須
  // 等影片播完（否則 orange core 會在退場還在演的時候就接手）。壓 p 而不改 dissolveState
  // —— 那支純函式與它的測試維持原樣，退場規則的真值表不因這個 PoC 而動。
  const pEff = revealed ? p : Math.min(p, 1 - 1e-6);
  const next = dissolveState(
    pEff,
    heroState.value,
    outroSpent.value,
    outroForced.value,
  );
  if (next !== heroState.value) setState(next);
}

// openingSkipped 翻面時要立刻重套一次 —— applyDissolve 平常只由 ScrollTrigger 的
// 回呼驅動，而 SKIP／載入失敗／帶 hash 進站都可能發生在 scrollY 0（根本沒有捲動事件），
// 少了這一條，影片會賴在畫面上直到使用者捲動才被 scrub 淡掉（2026-08-16 實測發現）。
// 讀 dissolveST?.progress 而非假設 0：returnToLoop() 也會把這面旗子清回 false，
// 而那次翻轉可能發生在非 0 的捲動位置。若翻轉發生在 p ≥ 1（使用者已經捲過整段 pin、
// 引言早就接上了），假設 0 會把舞台重新蓋回引言上。
watch(openingSkipped, () => applyDissolve(dissolveST?.progress ?? 0));

// scrubArmed 翻面（true）時要重新推導一次狀態 —— 它只是「開不開閘」，本身不改變 heroState。
// heroState 是 useState，跨導航存活：若在低 p（甚至 0）時重新掛載又還沒 arm，畫面會停在
// 上一輪殘留的 gone（不透明度已被上面那行帶回實體），此時若只是「打開閘門」而不重新推導，
// 就要等使用者捲動才會觸發 applyDissolve、狀態才追上 p —— 中間那格會先閃一次不透明的
// 首幀、接著第一次捲動又直接跳去 outro（而非 loop），而非讓 arm 當下就把狀態拉回與 p
// 相符的那一格。故 arm 的當下要主動呼叫 applyDissolve，等同「補一次 onRefresh」。
watch(scrubArmed, (on) => {
  if (on) applyDissolve(dissolveST?.progress ?? 0);
});

function onResize() {
  const next = getDeviceTypeByResolution();
  if (next === device.value) return;
  resumeAt = videoEl.value?.currentTime ?? 0; // 換來源會重新載入，記住進度
  device.value = next;
}

// ── preload 升級：metadata → auto ────────────────────────────────────
// template 上刻意只給 preload="metadata"。<video> 是 SSR 就吐出來的，preload="auto" 會讓
// 瀏覽器在 **HTML 解析階段**（bundle 都還沒下載完）就開始拉整支影片 —— pc 版 9.4MB（pad 6.6MB / mob 4.1MB），直接跟
// Nuxt bundle 搶頻寬與連線 → hydration 被推遲。而載入層在 hydration 之前是「SSR 吐出的
// 靜態 0%」（沒有方塊、沒有 JS 在跑，見 HeroLoader），影片拖多久、那個 0% 就定格多久。
//
// 故把緩衝挪到掛載之後才開始：此時 bundle 早已下載完，讓影片去搶已經無所謂，而載入層
// 至少要跑 duration 秒、外加 HERO_VIDEO_READY_TIMEOUT 的 99% 等待，時間綽綽有餘。
//
// nextTick：上面的 onMounted 會先呼叫 onResize() 校正 device，src 要等 DOM 更新才寫進去；
// 立刻 load() 會去拉舊的（SSR 預設的 pc）來源，手機上就是白拉 70MB —— 正好是要避免的事。
function promotePreload() {
  void nextTick(() => {
    const v = videoEl.value;
    if (!v || v.readyState >= 3) return;
    v.preload = 'auto';
    // 只改 preload 屬性不保證瀏覽器立刻續拉（各家實作不一），load() 才確定重啟緩衝。
    // ⚠️ load() 會把 currentTime 重置回 0。原本這裡假設「此刻必為 0（還沒播過）」——
    //    帶 #loop 進站時不成立：watch(heroState) 已經 seek 到 loop.start（30s）。
    //    沿用 RWD 換來源那條路，記進 resumeAt、由 onLoadedMetadata 跳回去。
    if (v.currentTime > 0) resumeAt = v.currentTime;
    v.load();
  });
}

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);

  gsap.registerPlugin(ScrollTrigger);
  buildDissolveST();

  // threshold 0 ＝ 完全沒有交集才算離開，與 Hero 判斷「從哪裡進場」用的
  // isVerticallyOnScreen 同一條界線（見 ~/utils/hero-core-handoff）。
  if (heroEl.value) {
    heroIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.isIntersecting || heroState.value === 'gone') return;
        setState('gone');
      },
      { threshold: 0 },
    );
    heroIO.observe(heroEl.value);
  }

  // ⚠️ <video> 是 SSR 就吐出來的，canplay 有可能在 hydration 掛上 @canplay 之前就已經觸發
  // （來源在快取裡時）→ 事件永遠等不到，載入層會一路卡在 99% 直到 HERO_VIDEO_READY_TIMEOUT
  // 才放行。故掛載時先補查 readyState（HAVE_FUTURE_DATA 以上＝已可播放），把漏掉的事件補回來。
  const v = videoEl.value;
  if (v && v.readyState >= 3) markReady();
  else {
    readyTimer = setTimeout(markReady, HERO_VIDEO_READY_TIMEOUT); // 遲遲無法播放時的保險
    promotePreload();
  }

  // 同上一則的理由：來源在快取裡時 loadedmetadata 也可能早於 hydration 就觸發，
  // 那樣 onLoadedMetadata 的對齊就漏掉了 —— 掛載時補查一次（HAVE_METADATA 以上）。
  if (v && v.readyState >= 1) alignToSegment(v);

  if (heroStarted.value) void play(); // HMR / 重新掛載時可能已按過 start
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  if (readyTimer) clearTimeout(readyTimer);
  stopOutroTick();
  heroIO?.disconnect();
  heroIO = null;
  dissolveST?.kill();
  dissolveST = null;
});
</script>

<template>
  <!-- id 供 AppHeader 以 IntersectionObserver 監看 hero（捲離後才顯示 header）；
       本元件自己也監看同一個元素 —— 捲出視窗就直接收尾（見上方 heroIO） -->
  <div ref="heroEl" class="sec1__hero" id="app-hero">
    <!-- 影片舞台：.sec1__hero（sticky）的佔位比一個視窗高（$dissolve + $intro-at，
         見下方 style），本舞台只以 inset: 0 0 auto 0 疊在佔位「頂端」那一個視窗高
         （height: vh(1)），並不會溢出佔位之外 —— 佔位本身撐出的高度差就是引言頂端
         被蓋住的那一截，靠 sticky 把舞台一路釘在螢幕上緣直到溶解結束。
         顯隱交給 dissolveST 直接寫 style.opacity（見 script 的 applyDissolve）——
         這是整個遮擋機制的唯一驅動源，不再靠 class 或 transition。
         skip 與下滑提示收在裡面，底部錨定才會對齊「舞台（＝視窗）的下緣」。 -->
    <div ref="stageEl" class="sec1__hero-stage">
      <!-- 影片層：滿版。
           ⚠️ preload 是 "metadata" 而非 "auto"：這裡是 SSR 吐出的標記，auto 會在 HTML 解析階段
           就開始拉整支影片、拖慢 hydration（理由與升級時機見 script 的 promotePreload）。 -->
      <div
        class="sec1__hero-video"
        :class="{ 'is-loading': !elementReady }"
        aria-hidden="true"
      >
        <video
          ref="videoEl"
          class="sec1__hero-video-el"
          :src="videoSrc"
          :poster="videoPoster"
          muted
          playsinline
          preload="metadata"
          disablepictureinpicture
          @canplay="onCanPlay"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @ended="onEnded"
          @error="onError"
        />
      </div>

      <!--
        skip：正片播放 3s 後「原地」淡入，進 loop 段淡出消失。
        按鈕本體（盒子、字級、雙箭頭、40% ↔ hover 100%）都在 <UBtnSkip>，
        本檔的 .sec1__hero-skip 只給版位與「現不現身」。
        刻意不用 v-if + <Transition>：常駐 DOM 只切 class，淡出期間 hover 規則已隨
        .is-visible 一起失效（不會卡在 100% 又被瞬間移除）。
        隱藏時（含淡出中）用 inert：一個屬性同時做掉「不進無障礙樹、不可 focus、不吃指標」，
        而且它會把已經在身上的 focus 逼出去（下一個 frame）—— 這是 tabindex -1 ＋ aria-hidden
        做不到的：那兩者只管「之後還能不能被 tab 到」，已握著的 focus 會留在原處，於是
        aria-hidden 蓋住 focus 元素，瀏覽器警告。
        這條路徑不只有點擊：使用者 tab 到按鈕後正片自然播完（→ loop）也會走到，
        所以 onSkipClick 的 blur 不能替代 inert，兩者各補一半。
        tabindex 仍保留：inert 未支援時至少不會被 tab 進看不見的按鈕。
        pointer-events: none 也留在 scss，那是淡入淡出版位的一部分，不倚賴 inert。
      -->
      <UBtnSkip
        class="sec1__hero-skip"
        :class="{ 'is-visible': showSkip }"
        :label="str.hero.skipLabel"
        :aria-label="str.hero.skipAria"
        :tabindex="showSkip ? 0 : -1"
        :inert="!showSkip"
        @click="onSkipClick"
      />

      <!--
        下滑看更多：loop 與 outro 顯示（提示使用者向下滾動以觸發／繼續退場）。
        outro 也要顯示是因為 SKIP：它把狀態直接放到 outro，而人還在 page top ——
        退場段播完會停在最後一格且全實，此時畫面上必須有個「請往下捲」的指引，
        否則使用者面對的是一格不會動也沒說明的凍結畫面。正常流程的 outro 也吃得到，
        但那時它本來就隨舞台一起在溶解（提示在 stage 內），跟著淡掉不會卡住。
        設計稿只有一個 22×12 的點陣 chevron，沒有文字也沒有那條垂直細線 ——
        文案改掛 .visually-hidden（由元件內部處理，見 label prop）：
        這個提示對讀不到圖形的使用者更重要。

        圖示本體、漂移動態與「點了往下捲一屏」都在 <UBtnScrollHint>；
        本檔的 .sec1__hero-scroll 只給版位與「現不現身」（同 .sec1__hero-skip 的分工）。
      -->
      <UBtnScrollHint
        v-if="heroState === 'loop' || heroState === 'outro'"
        class="sec1__hero-scroll"
        :label="str.hero.scrollHint"
      />
    </div>

    <!-- 文字保留於 DOM 供 SEO / 螢幕閱讀器，視覺上不顯示 -->
    <h1 class="visually-hidden">{{ str.hero.title }}</h1>
    <p class="visually-hidden">{{ str.hero.subtitle }}</p>
  </div>
</template>

<style lang="scss" scoped>
// ── hero 佔位的兩個旋鈕 ───────────────────────────────────────────────
// $intro-at：退場結束時，引言上緣落在螢幕的哪裡（0.85 ＝ 露出約三行，
//            這是設計核准過的那一格構圖）。
// $dissolve：退場吃掉多少捲動距離。**必須與 hero-video-config 的 HERO_DISSOLVE_VH
//            相同**（那邊算 ScrollTrigger 的 end，這邊算佔位高度）。
// 佔位高 = 兩者相加，是推導值、不是第三個旋鈕：
//   引言上緣螢幕位置 = 佔位高 − scrollY ⇒ scrollY = $dissolve 時剛好等於 $intro-at。
$intro-at: 0.85;
$dissolve: 1.2;

.sec1__hero {
  // ⚠️ 必須是 sticky，**不可以改用 ScrollTrigger 的 pin**（2026-08-21 實測否決）。
  //    pin 只有兩種實作方式，兩條路在這個 DOM 結構下都不通：
  //      pinType: 'fixed'     → position: fixed 的容器塊會變成帶 transform 的
  //                             .sec1__inner，「固定」不再是對視窗固定，影片跟著捲走。
  //      pinType: 'transform' → 位置由主執行緒的 JS 逐事件寫入，而頁面內容是由合成器
  //                             捲動的 ⇒ 影片層**永遠慢一幀**，慢的量等於當幀的捲動距離。
  //                             實測（每幀捲 10px）舞台的 top 恆為 −10；真實滾輪的每幀
  //                             增量是暴衝的（0, 0, 120, 0…），於是影片層每幀上下彈跳
  //                             ＝ 使用者回報的「嚴重不自然抖動」。
  //    sticky 由瀏覽器與捲動同步合成，沒有這一幀的落後，也不動文件高度。
  //
  // ⚠️ sticky 必須下在**本元素**、不能下在內層的 stage：stage 只能在本元素的框內黏，
  //    會在「佔位高 − 1vh」就脫離，撐不過退場。本元素的容器是很高的 .sec1__inner。
  // ⚠️ 脆弱點：日後若有人在 .sec1 到 <html> 之間任何一層加上 overflow: hidden/auto/scroll，
  //    sticky 會**安靜失效**（html 的 overflow-x: clip 不建立捲動容器，base.scss 已依賴此性質）。
  // ⚠️ 黏著範圍被容器底緣卡住：實測（1440×900）釋放點在 scrollY 1298，退場在 1080 走完，
  //    餘裕 218px。**調大 $dissolve 務必重算這條** —— 超過的話沒有錯誤訊息，只會看到
  //    影片還在畫面上就被往上捲走。
  position: sticky;
  top: 0;
  width: 100%;
  // 扣 --chrome-inset 的理由：main 鎖住期間手機網址列不會收合，解鎖那一刻的可視高度是
  // small viewport。不扣的話手機露出的引言會少掉工具列那一段（見 hero-body-lock-rules #5）。
  height: calc(#{vh($dissolve + $intro-at)} - var(--chrome-inset));
  // 黏住之後本元素會永久佔著螢幕上緣一大塊。它自己沒有背景也沒有互動內容
  // （白底在 .sec1、skip 在 .is-visible 時自己覆寫回 auto），一律放行指標。
  pointer-events: none;
}

// 揭露引言那一刻的淡出長度。
// ⚠️ 這個值同時決定 orange core 交棒看不看得出接縫：core 的進場（HERO_CORE_DROP_IN，
//    0.9s）是從影片裡那顆 core 的座標滑進來的，若舞台瞬間消失，core 會從一個「已經
//    沒有東西」的位置滑出來 —— 兩者需要重疊一段。調這個值要連著那邊一起看。
$reveal-fade: 0.25s;

// 影片舞台：只渲染一個視窗高（vh(1)），錨在 .sec1__hero 的頂端（inset: 0 0 auto 0）。
// 舞台被 pin 釘在螢幕上緣，.sec1__hero 剩下的高度就是引言的起點（見上方高度推導）。
.sec1__hero-stage {
  position: absolute;
  inset: 0 0 auto 0;
  height: vh(1);
  // ── 揭露：0.25s 淡出，由 .is-revealed 這個 class 觸發 ────────────────
  // 改用 class ＋ CSS transition 而非逐幀寫 style.opacity：這個 opacity 現在只在
  // **一個離散時刻**改變（影片播完且捲動走完），不再是 scrub 每幀寫入 ——
  // 而「每幀寫入會與 transition 打架」正是原本 1 − p 方案不能用 transition 的唯一理由。
  //
  // visibility 要分開處理：它無法被內插，但滿版影片層在 opacity: 0 之後瀏覽器仍會每幀
  // 合成一層看不見的滿版影片（見設計文件第一節的表），必須真的隱藏。方向不對稱 ——
  // 隱藏要**等淡完**、顯示要**立刻**（回捲時影片得馬上回來）。CSS 取的是**目標狀態**
  // 的 transition，故兩個方向各寫在自己的規則裡。
  opacity: 1;
  visibility: visible;
  transition:
    opacity $reveal-fade ease,
    visibility 0s;

  &.is-revealed {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity $reveal-fade ease,
      visibility 0s linear $reveal-fade;
  }
  // cover 溢出的裁切從 .sec1__hero 移到這裡。
  overflow: hidden;
  // 4 ＞ .sec1__scene 的 3（見 Hero.scss 的層序說明）：引言頂端就是被這一層蓋住的。
  // ⚠️ 這是**整個遮擋機制的全部** —— 沒有 clip-path、沒有狀態旗標、沒有 opacity 閘門。
  // ⚠️ 本元素有 z-index 又是 positioned ⇒ 建立堆疊脈絡 ⇒ 內層的 skip（z-index 2）與
  //    下滑提示都被關在這個脈絡裡，相對順序不變，兩者都**不必**跟著調 z-index。
  z-index: 4;
  // 它是覆蓋在引言上方的視覺層，攔下指標就等於讓露出來的引言選不到、點不到
  // （實測 elementFromPoint 命中的是已經全透明的 .sec1__hero-video，而非底下的引言段落）。
  // .sec1__hero-skip 自己在 .is-visible 時覆寫回 pointer-events: auto，不受影響。
  pointer-events: none;
}

.sec1__hero-video {
  position: absolute;
  inset: 0;
  // 影片本體在 pc 有尺寸上限（見 .sec1__hero-video-el），超過時置中、四周露出 hero 白底。
  // 不用 margin: auto —— 垂直置中也要，flex 一次做完；pad / mob 沒有上限，
  // 子項 100%×100% 仍是滿版，這層 flex 不影響它們。
  display: flex;
  align-items: center;
  justify-content: center;

  // canplay 之前 <video> 什麼都不畫（HERO_VIDEO_POSTER 三個裝置都是空字串），
  // 露出的是 .sec1 的白底。首次載入時看不到（載入層蓋著），但帶 #loop 進站
  // 會略過載入層 —— 那時就是一瞬純白。這與退場溶解無關，純粹是防白閃，
  // 故不隨 dissolveST 一起拆掉。
  //
  // ⚠️ 這條 transition 只管「淡入」（is-loading → 非 is-loading），與退場溶解是兩件事：
  //    退場溶解已經改由 scrub 直接寫 .sec1__hero-stage 的 style.opacity（見 script 的
  //    applyDissolve），這裡的 opacity 只在 canplay 前後那一瞬切換一次。0.8s 是這個
  //    一次性淡入自己的時間常數，原本餵它的常數已隨淡出保留機制一起刪掉，
  //    故直接寫死字面值，不要為了「湊常數」又補一個只有這裡用得到的匯出。
  transition: opacity 0.8s ease;

  &.is-loading {
    opacity: 0;
  }
}

// <video> 本體：滿版裁切置中。
// RWD 影片「來源」在 ~/utils/hero-video-config 依裝置切換；三支剪輯都已到位，且 pad / mob
// 是直式（1024×1364 / 720×1280，與其視窗方向相符）→ cover 置中就是設計要的裁切，
// 下面兩個斷點覆寫目前與預設同值，留著當「要按斷點微調時」的位置。
//
// ⚠️ 改 object-position 要一起改退場交棒的換算：coverAnchorToScreen 預設以 center 分配
//    裁切量（見 ~/utils/hero-core-handoff 與 Hero.vue 的 runCoreEntrance），
//    不同步就會讓 DOM core 疊到影片裡那顆的旁邊。
.sec1__hero-video-el {
  display: block;
  width: 100%;
  height: 100%;
  // 舞台上限（pc 2560×1440，見 base.scss 的 --hero-stage-max-*）—— 與載入層、start
  // 閘門共用同一組值並同樣置中，三層的中心才會落在同一點。
  // 超過上限時影片盒置中、多出來的區域露出 hero 白底（見上層的 flex）；那與 gone 之後
  // 淡出露出的白底同一個顏色，銜接不會有落差。
  //
  // 退場交棒不必跟著改：coverAnchorToScreen 吃的是 <video> 自己的
  // getBoundingClientRect()（見 Hero.vue 的 runCoreEntrance），盒子縮小、置中都算得到。
  max-width: var(--hero-stage-max-w);
  max-height: var(--hero-stage-max-h);
  object-fit: cover;
  object-position: center;
  pointer-events: none;

  @include rwd-max('pc') {
    object-position: center; // pad（直式剪輯）
  }
  @include rwd-max('tablet') {
    object-position: center; // mob（直式剪輯）
  }
}

// skip 按鈕的「版位與現不現身」；按鈕本體（100×48 的盒子、字級、雙箭頭、
// 40% ↔ hover 100%）都在 <UBtnSkip>，見 components/ui/UBtnSkip.vue。
// 右下角座標同樣照稿上絕對值（1920 影片稿的 right 34、bottom 31，不換算 ——
// 理由與尺寸相同，見 UBtnSkip.vue 檔頭的說明）。
//
// 命中區不必外擴：按鈕本體已是 100×48，兩邊都超過 44px 的觸控最小建議尺寸
// （改回 ÷1.5 的 66.67×32 才需要像 HeroStart 音效鈕那樣用 ::after 補）。
//
// ⚠️ 這裡的 opacity 只負責「淡入 / 淡出」，元件內的 40% 畫在它自己的 __row 上 ——
// opacity 是乘算的，故顯示時實際為 1 × .4。兩者不可合併成同一條規則。
// ⚠️ bottom 要加 --chrome-inset：本容器高 vh() ＝ large viewport，手機剛進站時
// 網址列／底部工具列是展開的，容器底部那 60–115px 在可視範圍之外。開場期間頁面
// 又鎖著、工具列永遠不會收合 → 不補這一段，這顆按鈕在手機上全程看不到。
// （見 ~/utils/viewport-height 的 chromeInset()；下方「下滑看更多」同理。）
.sec1__hero-skip {
  position: absolute;
  right: 34px;
  bottom: calc(31px + var(--chrome-inset));
  z-index: 2; // 疊在影片層之上
  // 未到 3s（或已離開正片）：全透明且完全不可點
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
  }
}

// 下滑看更多：水平置中、貼齊「看得到的」hero 底緣上方一段距離
// （bottom 吃 --chrome-inset 的理由同上方 skip）。
//
// 底距照三份稿的絕對值（同 skip，不做比例換算）：稿上圖示皆為 22×12、水平置中，
// 只有底距不同 —— mob 414×736 距底 44、pad 768×1024 距底 72、pc 1280×720 距底 44。
// （mob 稿實際落在中心右側 6px，判定為稿上誤差，這裡照 pad / pc 一律置中。）
//
// 22×12 的框與圖示動態都在 <UBtnScrollHint> 裡（元件持有尺寸與色票），
// 本規則只有版位 —— 於是上面那組底距量到的始終是同一個框。
//
// ⚠️ pointer-events: auto 不是保險，是必要條件：.sec1__hero-stage 是 pointer-events: none
//    （它是覆蓋在引言上方的視覺層），不覆寫回來，這顆按鈕的命中會一路穿過那些 none 的
//    祖先掉到 .sec1__inner 去 —— 2026-08-20 實測 elementFromPoint 抓到的就是它。
//    同一個處方見上方 .sec1__hero-skip 的 .is-visible。
// ⚠️ z-index 3 ＞ skip 的 2：兩者不重疊，純粹是把「提示在影片層之上」寫明，
//    不倚賴 DOM 順序（stage 有 z-index 又 positioned ⇒ 兩者都關在它的堆疊脈絡內）。
.sec1__hero-scroll {
  position: absolute;
  left: 50%;
  bottom: calc(44px + var(--chrome-inset));
  z-index: 3;
  transform: translateX(-50%);
  pointer-events: auto;

  @include rwd-min('tablet') {
    bottom: calc(72px + var(--chrome-inset));
  }
  @include rwd-min('pc') {
    bottom: calc(44px + var(--chrome-inset));
  }
}

@media (prefers-reduced-motion: reduce) {
  .sec1__hero-video,
  .sec1__hero-skip,
  .sec1__hero-stage,
  .sec1__hero-stage.is-revealed {
    transition: none; // 一律改為直接出現 / 消失（時間點不變）
  }
}
</style>
