<!--
  core 的移動路徑 + 驅動（section 級 overlay，1:1 px，無 viewBox）。

  驅動線（不可見，stroke:none）：core 起點（第一屏正中央）→ 垂直下降穿透引言文字 →
  終點停在「視窗正中央」（＝ .sec1 底緣貼齊視窗底的那一刻），交棒給 HeroSymbolTransition。
  單一 scrub ScrollTrigger 驅動整條 path（getPointAtLength 取樣 → 定位 core），
  一條連續 path、一個 tween → 接縫零頓挫。

  幾何無寫死座標：x = section 水平中心（引言文字也置中，故一路穿過文字），
  起點 y = vh($exit) + 50vh（＝ core 現身那一刻的畫面正中央），
  終點 y = 起點 ＋ **本尺的捲動距離** ⇒ 路徑長 ≡ 捲動距離，core 因此恆在螢幕正中央
  （1:1 是構造上的不變式，不是兩個算式碰巧相等，見 build 的 ⚠️ 2026-08-23）。
  ⚠️ 「終點在哪」的唯一來源是 ST 的 endTrigger（endEl 的 bottom bottom）；本檔**不再量**
     endEl，因為它住在被 hero 轉場 pin 的 .sec1__inner 裡，帶著 pin 位移的量測會讓 core
     掉出視窗。GSAP 那一份量測的免疫由 `pinnedContainer` 負責。
  ⚠️ endEl 尾端仍必須留 ≥ 50vh 的 runway（見 Hero.scss 的 .sec1__intro padding-bottom，
     實際值為 50vh ＋ 引言淡出窗口 INTRO_FADE_VH）—— 否則 core 抵達視窗中央（pin 接手）
     的那一刻還沒穿出文字。
  ⚠️ 起訖與 endEl 都刻意避開 .sec1 的 bottom：Hero 的 transition pin 會在 .sec1 內插入
     pin-spacer 把 section 撐高，用 .sec1 的 bottom 當基準會變成循環依賴（量到的高度含 spacer）。

  🚧 舊稿的可見灰線（設計中心線：stub 垂直段 + C/L 曲線，錨定 date 大標左上角、尾端落在日期
     的「/」）已隨 date 段移除。新稿 hero 段沒有可見設計線（影片結尾那條階梯線在影片裡）。
     論壇段那條長曲線（Figma path1 / path2）之後可匯出 d 字串，沿用本檔的引擎重建。
-->
<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  killScrollTriggers,
  refreshScrollTriggers,
  refreshOnFontsReady,
} from '@/utils/scroll-trigger';
// 進度 clamp 在 0 那一段（回捲到退場區間）改成螢幕鎖定，見 place()。
import { coreHandoffBackY } from '@/utils/hero-core-handoff';
// hero 退場吃掉的捲動距離：core 現身的那一刻＝退場結束，故起點與它綁在一起
// （見下方 build 的 `sy` 與 ST 的 `start`）。
import { HERO_DISSOLVE_VH } from '@/utils/hero-video-config';

const props = defineProps<{
  /** .sec1：core / path 的座標範圍，也是 ScrollTrigger 的 trigger */
  sectionEl: HTMLElement | null;
  /** orange core：被驅動沿線移動的元素 */
  orangeCoreEl: HTMLElement | null;
  /** 路徑終點的參照元素（引言整段）：其底緣貼齊視窗底時，core 抵達視窗正中央 */
  endEl: HTMLElement | null;
  /**
   * 被 hero 轉場 pin 住的容器（`.sec1__inner`）—— `endEl` 住在它裡面。
   * 交給 ScrollTrigger 的 `pinnedContainer`，它才會在量 `endEl` 之前先把那個 pin 拆掉。
   * 少了它的症狀見下方 ST 的 ⚠️（core 掉出視窗）。
   */
  pinnedEl: HTMLElement | null;
}>();

// core 沿線移動進度（0..1）→ 寫入全域共享 path 軌（stage 1–3 來源），供顯示與效果讀取。
const { setPathProgress } = useOrangeCoreProgress();

// 路徑的起訖都定義成「半個視窗高」，而 endEl 的 runway 是 CSS 的 --vh ——
// 兩者必須是同一把尺，否則終點會落在文字之內或超出 runway。
const { vhPx } = useViewportHeight();

// 移動速度曲線：把 raw 捲動進度重新映射成 path 進度（見 ~/utils/orange-core-config 的 MOVE_EASE）。
const easeMove = gsap.parseEase(MOVE_EASE) ?? ((v: number) => v);

const motionEl = ref<SVGPathElement | null>(null);
let st: ScrollTrigger | null = null;
// 退場區間（scrollY 0 → path 起點）的補刀尺，只在由下往上回捲時有事做，見 init()。
let parkST: ScrollTrigger | null = null;
let ready = false;
// 驅動線總長：僅在 build() 幾何重建時量測一次，scrub 每幀直接複用（避免 getTotalLength 熱路徑）。
let motionLen = 0;
// 驅動線的切線角（度）。同樣在 build() 定案一次 —— 這條 d 是直線，切線是常數（見 build）。
let motionAngle = 0;

// 依當前版面量測，重建驅動線的 d（imperative，避免 Vue patch 造成幾何延遲）。
function build() {
  const sec = props.sectionEl;
  const motion = motionEl.value;
  if (!sec || !motion || !st) return;

  const x = sec.getBoundingClientRect().width / 2; // 垂直線：沿 section 水平中心（引言文字亦置中）

  // 起點：**core 該現身的那一刻**的畫面正中央。
  //
  // ⚠️ 2026-08-21 修正。原本是 `vhPx(0.5)`，語意是「進度 0 ⇔ core 在畫面正中央」——
  //    但 ST 的起點在 scrollY 0，而 core 是在 hero 退場結束（scrollY = vh(HERO_DISSOLVE_VH)）
  //    才現身的。於是現身那一刻進度早已前進一大段，core 落在畫面外。
  //    實測（1440×900，含改動前的 0.9.0 基準線）：core 的螢幕中心在 scrollY 1080–2400
  //    之間一直是 1400 上下，只有 scrollY 0 時是 450 —— 這就是「退場交棒銜接失效」的成因。
  //    把 ST 起點與路徑起點**一起**平移到退場結束，進度 0 才真的等於「畫面正中央」：
  //      螢幕位置 = sy − scrollY = (vh(exit) + 50vh) − vh(exit) = 50vh ✓
  //    路徑長度與捲動範圍同時各縮短 vh(exit)，故「1:1 鎖在畫面中央」的性質不變。
  //
  // ⚠️ 不在本次範圍：路徑**中段**因 MOVE_EASE 而偏離 50vh 是既有且刻意的（雲霄飛車感）。
  //    需求是「從畫面中心**出現**」，不是「全程鎖在中心」，故只修進度 0 的落點。
  const sy = vhPx(HERO_DISSOLVE_VH) + vhPx(0.5);
  // 終點 ＝ 起點 ＋ **這條尺自己的捲動距離** ⇒ 路徑長 ≡ 捲動距離，1:1 是構造上的不變式。
  //
  // ⚠️ 2026-08-23 改，原本是「endEl 底緣 − section 頂 − 50vh」（自己量 endEl 的 rect）。
  //    那讓 1:1 變成「兩個算式碰巧相等」，而 endEl 住在被 hero 轉場 pin 的 .sec1__inner 裡，
  //    帶著 pin 位移的量測會直接破壞等式：實測 pin 之後 ey +1041.6（一整段 pin 距離）⇒
  //    core 以 1.91× 往下墜、scrollY≈1560 掉出視窗，連轉場開窗（錨在 core 的螢幕矩形）
  //    一起消失。成因、量法與另外兩處同型錯位見
  //    .claude/memory/gsap-refresh-measures-pinned-dom.md。
  //    ⇒ 本檔不再量任何 pin 內的元素；「終點在哪」只剩 ST 的 endTrigger 一個來源
  //      （那一份的免疫由下方 pinnedContainer 負責）。
  //    順帶修掉行動裝置的殘留漂移：`bottom bottom` 吃真實視窗高、sy 吃凍結的 --vh，
  //    兩把尺差一個 --chrome-inset（實測 57px）原本會沿路漂掉。
  //
  // ⚠️ 代價：`.sec1__intro` 的 runway 不再能改變「core 在螢幕上移動多少」（只改變文字捲多快
  //    與淡出可用的距離）。要讓 core 真的位移得動 MOVE_EASE 或另立一段尺。
  const ey = sy + (st.end - st.start);

  motion.setAttribute(
    'd',
    `M${x.toFixed(3)} ${sy.toFixed(3)}L${x.toFixed(3)} ${ey.toFixed(3)}`,
  );

  // 幾何已定，量一次總長供 place() 每幀複用。
  motionLen = motion.getTotalLength();

  // 切線角也在這裡定案，理由同總長：這條 d 是 `M{x} {sy}L{x} {ey}` ＝ 一條直線，
  // 整條線上的切線是同一個值。原本 place() 每幀為它多做兩次 getPointAtLength
  // （前後各取 1px 的鄰點）—— 兩次 SVG 幾何查詢換一個常數。
  // 保留 rotation 的寫入本身（見 place 的說明：為之後論壇段的曲線路徑留位），
  // 之後真的接上曲線時，把這裡的一次性計算改回 place() 裡的逐幀取樣即可。
  const behind = motion.getPointAtLength(0);
  const ahead = motion.getPointAtLength(motionLen);
  motionAngle =
    (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;

  place(st.progress);
}

// 依 raw 捲動進度把 core 定位到驅動線上的點，並轉到該處的路徑切線方向（雲霄飛車感）。
// 先過 easeMove（MOVE_EASE 速度曲線）→ 得 path 進度 p，再定位。p 同時寫回 path 軌，
// 故 stage 判定與定位一致。
// 切線 rotation 對正方形 dot 無視覺差異，保留是為了之後論壇段的曲線路徑；角度本身是
// build() 算好的常數（這條 d 是直線），逐幀只剩一次 getPointAtLength。
function place(rawP: number) {
  const core = props.orangeCoreEl;
  const motion = motionEl.value;
  const sec = props.sectionEl;
  if (!core || !motion || !motionLen || !sec) return;
  const p = easeMove(rawP); // 套用移動速度曲線
  const pt = motion.getPointAtLength(p * motionLen);
  // 進度 clamp 在 0（＝捲動位置在 ST 起點之前，也就是由下往上回捲進退場區間）時，
  // 路徑點凍在**文件座標** `sy` ⇒ core 會 1:1 隨文件往下漂、停在引言裡再滑出視窗下緣。
  // 那一段要維持「螢幕正中央」＝ 影片那顆 core 的位置（推導與實測見 coreHandoffBackY）。
  // 傳 rawP 而非 p：判定要看 ScrollTrigger 的原始 clamp，不受 MOVE_EASE 影響。
  const y = coreHandoffBackY(
    rawP,
    pt.y,
    -sec.getBoundingClientRect().top, // 捲動位置換算到 section 座標系（同 build 的基準）
    vhPx(0.5),
  );
  gsap.set(core, { x: pt.x, y, rotation: motionAngle });
  setPathProgress(p);
}

function init() {
  if (
    ready ||
    !props.sectionEl ||
    !props.orangeCoreEl ||
    !props.endEl ||
    // pinnedEl 也是必要條件：少了它 ST 就沒有 pin 位移的免疫（見下方 pinnedContainer），
    // 而那是靜默失效。它與 endEl 是同一份 template 裡的元素 ref，兩者同時就緒。
    !props.pinnedEl
  )
    return;
  ready = true;

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(props.orangeCoreEl, { xPercent: -50, yPercent: -50 }); // 讓 (x,y) 對齊 core 中心

  // ⚠️ 建尺**先於** build()：`ey` 由這條尺的捲動距離反推（見 build），沒有尺就沒有幾何。
  //    create() 內部會 refresh 一次，其 onRefresh 就是第一次 build，故不必額外呼叫。
  st = ScrollTrigger.create({
    // ⚠️ **數值** start ＝ hero 退場結束（core 現身的那一刻），與上方 `sy` 成對。
    //    兩者必須一起改，否則進度 0 就不再等於「畫面正中央」（見 build 的推導）。
    //    用數值而非 `trigger` ＋ `'top top'` 還順帶避開一個坑：.sec1__hero 是
    //    position: sticky，拿它量測會得到「黏住之後」的位置（HeroVideo 的
    //    buildDissolveST 踩過，實測起點被量成 vh(1.2) 而非 0）。
    start: () => vhPx(HERO_DISSOLVE_VH),
    // 終點與 Hero 的 transition pin 共用同一時機（同一個 endEl 的 'bottom bottom'）：
    // core 抵達視窗中央的同一刻 pin 接手 hold 住畫面，pin 期間 path 不再前進 → core 穩定停在中央。
    endTrigger: props.endEl,
    end: 'bottom bottom',
    // ⚠️ endEl 住在被 hero 轉場 pin 的 `.sec1__inner` 裡 —— 不宣告 pinnedContainer 的話，
    //    GSAP 量 endEl 時可能量到帶著 pin 位移的位置（refresh 期間 pin 會被別的尺重新套上，
    //    誰先誰後只由 _triggers 的排序決定）。宣告之後 GSAP 會在量測前先把那個 pin 拆掉。
    //    這裡的 start 是**數值**，故 pinnedContainer 不會給它加任何 pin 位移補償
    //    （ScrollTrigger.js L1412 的 `isNaN(parsedStart)`），start/end 的語意不變。
    pinnedContainer: props.pinnedEl ?? undefined,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => place(self.progress),
    // 幾何重建掛在**這裡**，不是全域的 refreshInit：後者早於 pin 的 revert、也早於本尺
    // 自己重算 start/end，量到的與讀到的都是上一輪的值。onRefresh 是 start/end 定案後才發，
    // 且不論「單獨 refresh」或「全站 refresh」兩條路徑都會發一次（ScrollTrigger.js L565／L1608）。
    onRefresh: build,
  });

  // ── 退場區間（scrollY 0 → path 起點）的補刀尺 ────────────────────────
  // 上面那條在這一段的進度恆為 0，而 ScrollTrigger 的 onUpdate **只在 clamp 後的進度
  // 改變時才發**（ScrollTrigger.js 的 `clipped !== prevProgress`）—— 由下往上回捲跨過
  // path 起點之後就再也收不到一個 tick，core 於是凍在文件座標上隨頁面往下漂：
  // 實測 1522×868，scrollY 1000 → 螢幕 463、scrollY 0 → 1463（早就掉出視窗下緣），
  // 也就是「core 停在引言、不回到影片那顆 core 的位置」。
  //
  // 兩條尺不會打架，也不倚賴 _triggers 的更新順序：本條只在主尺**還沒動起來**
  // （progress 恰為 0）時寫入，而那一刻兩邊算出同一個值 ——
  // `coreHandoffBackY(0, sy, vh($exit), vh(0.5)) === sy`，有測試釘住。
  // 用 `st.progress === 0` 而非 `self.progress < 1`：後者在接縫（scrollY 恰為 path 起點）
  // 那一格會變成兩條尺都不寫（實測 core 留在上一格的位置、螢幕 −608）。
  parkST = ScrollTrigger.create({
    start: 0,
    end: () => vhPx(HERO_DISSOLVE_VH),
    invalidateOnRefresh: true,
    onUpdate: () => {
      if (st && st.progress === 0) place(0);
    },
  });

  // 手動 refresh 一律走 refreshScrollTriggers()（先 sort 再 refresh）—— 見 utils/scroll-trigger。
  // 這裡尤其需要 sort：本元件的 trigger 在 .sec1 頂端，而 Hero 的 transition pin 就在它下方
  // 同一個 section 裡，兩者的建立順序取決於誰先 onMounted。
  refreshScrollTriggers();

  // 字體載入會改變引言文字高度 → section 高度變動 → 重新量測。
  // 註冊集中在 utils/scroll-trigger（refreshOnFontsReady）：三個元件各掛一份的話，
  // fonts.ready 一 resolve 就是連續三次全站重算 —— 每一次都含論壇段整條驅動線的重新量測。
  if (typeof document !== 'undefined') refreshOnFontsReady();
}

onMounted(() => {
  init();
  // props 來自父層 template ref，可能於下一 tick 才就緒。
  if (!ready) {
    const stop = watch(
      () => [
        props.sectionEl,
        props.orangeCoreEl,
        props.endEl,
        props.pinnedEl,
      ],
      () => {
        init();
        if (ready) stop();
      },
    );
  }
});

onBeforeUnmount(() => {
  // build 隨 st 一起收（它現在是 st 的 onRefresh，不再是全域 refreshInit listener）。
  // kill(false)：換頁時舊頁還在畫面上淡出，revert 會把畫面打回起始態而被看見
  // （見 utils/scroll-trigger 的 killScrollTriggers）
  killScrollTriggers(st, parkST);
  st = null;
  parkST = null;
});
</script>

<template>
  <svg
    class="sec1__orange-core-path"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path ref="motionEl" fill="none" stroke="none" />
  </svg>
</template>

<style lang="scss" scoped>
.sec1__orange-core-path {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: visible; // path 座標超出 svg box（起點在第一屏影片區）仍需可見
  pointer-events: none;
  z-index: 1;
}
</style>
