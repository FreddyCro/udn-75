<script lang="ts" setup>
/**
 * Subpage — 六個「類分頁」共用版型骨架：hero／引言／錨點／進場動畫／下一篇導覽。
 * 內文由各頁以預設 slot 直接撰寫（.sp-* 排版基元 + 逐塊 Tailwind mt-* 與 mb-*）。
 * header / footer 由 subpage layout 提供。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  killScrollTriggers,
  refreshScrollTriggers,
} from '@/utils/scroll-trigger';
import {
  HIDE_Y,
  blockState,
  deferredStopStillApplies,
  mediaFadeAlpha,
  stageBeats,
  stageLines,
  type StageBlockState,
} from '@/utils/subpage-stage-beats';
import type { IntroMediaImage, IntroMediaVideo } from './SubpageIntroMedia.vue';

export interface SubpageNavData {
  backUrl: string;
  next?: { title: string; url: string };
}

/**
 * 引言之後的滿屏媒體（舞台第三拍）。二選一：
 * - images：多張照片自動輪播，每張各自帶圖說
 * - video：單支影片
 * 兩者皆空（或 src 為空字串）＝ 該頁不放媒體，舞台只剩 hero／引言，pin 距離收回一屏。
 */
export interface SubpageIntroMediaData {
  images?: IntroMediaImage[];
  video?: IntroMediaVideo;
}
export interface SubpageContent {
  hero: {
    title: string;
    subtitle: string;
    /** 主標題藝術字（SVG 完整路徑）；title 文字作為 alt */
    titleImg: string;
    /** 副標藝術字（SVG 完整路徑）；subtitle 文字作為 alt */
    subtitleImg: string;
    unit: string;
    author: string;
    /** 首屏背景圖（單檔 jpg，不含副檔名），如 /img/news/udn75_bg_news */
    bg: string;
  };
  /**
   * 引言：單一字串，段落之間用 <br/> 斷行、以 v-html 輸出（文案為本地靜態檔）。
   * 引言為 justify，但強制斷行前的那一行算「末行」（text-align-last: auto），
   * 不會被拉開，與早期拆成多個 <p> 的排版等價。
   */
  intro: string;
  /** 引言之後的滿屏媒體；沒給（或內容為空）就不渲染、舞台也不多一拍 */
  introMedia?: SubpageIntroMediaData;
  nav: SubpageNavData;
}

const props = defineProps<{ content: SubpageContent }>();

/**
 * 過濾掉「結構在、內容還沒填」的情形（locales 先留了空殼給編輯填）：
 * 圖片要有 src 才算數，影片要有 pc 來源才算數。回傳 null ＝ 這頁沒有媒體。
 */
const introMedia = computed(() => {
  const m = props.content.introMedia;
  if (!m) return null;
  if (m.video?.src?.pc) return { video: m.video };
  const images = (m.images ?? []).filter((img) => !!img.src);
  return images.length ? { images } : null;
});

// hero 主／副標藝術字走 build-time 內嵌（?raw）而非 <img> request：
// SVG 與 DOM 同時渲染（SSR 直接進 payload），進場動畫播放時素材保證已在場，
// 不會再有「淡入播完、字才蹦出來」的載入時間差。
const heroArtRaw = import.meta.glob('~~/public/img/*/udn75_*_hero_*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * 取出內嵌 SVG 並做兩件整形：
 * 1. 命名空間化被 url(#…) 引用的 id（clipPath 等）—— 連續閱讀頁會把六篇共 12 個
 *    SVG inline 進同一份文件，Figma 匯出的 id 會撞名（education 的主副標都叫
 *    clip0_0_4），後者的 clip 會誤指到前者的定義。
 * 2. 補 preserveAspectRatio="xMinYMid"，等價原本 <img> 的
 *    object-fit: contain + object-position: left center（窄幅縮小時字形靠左）。
 *    aria-hidden：無障礙文字由外層 wrapper 的 aria-label 提供。
 */
function inlineHeroArt(path: string): string {
  const raw = Object.entries(heroArtRaw).find(([k]) => k.endsWith(path))?.[1];
  if (!raw) return '';
  const ns = path.replace(/^.*\//, '').replace(/\.svg$/, '');
  let svg = raw;
  for (const id of new Set(
    [...raw.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]),
  )) {
    svg = svg
      .replaceAll(`id="${id}"`, `id="${ns}-${id}"`)
      .replaceAll(`url(#${id})`, `url(#${ns}-${id})`);
  }
  return svg.replace(
    '<svg ',
    '<svg aria-hidden="true" preserveAspectRatio="xMinYMid" ',
  );
}

const titleSvg = computed(() => inlineHeroArt(props.content.hero.titleImg));
const subtitleSvg = computed(() =>
  inlineHeroArt(props.content.hero.subtitleImg),
);

const stageRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);
const heroInnerRef = ref<HTMLElement | null>(null);
const introInnerRef = ref<HTMLElement | null>(null);
const mediaRef = ref<HTMLElement | null>(null);

// ⚠️ 舞台**不再驅動錨點的顯隱**：pc rail 與 <1280 底部列都改成全程顯示（一進入子頁就在），
//    由 layouts/subpage.vue 直接傳 visible。原本這裡有一面 useSubpageAnchor 的 visible 旗子，
//    由 pin 的 onLeave／onEnterBack 寫入（「舞台演完才滑入」），連同它的 scroll 模式閂鎖
//    與 reduced-motion 專用 trigger 一起移除了 —— 恆真的旗子不必留著。
//    只有 mode／activeSlug 還留在 useSubpageAnchor（active 判定與點擊語意仍要分兩種）。

/**
 * 舞台是否啟用 pin 模式（hero／引言／媒體疊在同一屏）。
 * SSR／no-JS／reduced-motion 維持 false：各塊照文件流各佔一屏、全程可見，不疊不藏。
 */
const stagePinned = ref(false);

/**
 * 第三拍的媒體是否「輪到它演」。pin 模式下它整段都在視窗內、只是靠透明度藏著，
 * 元件自己的 IntersectionObserver 判斷不出來，所以由舞台把進度線的結果傳下去，
 * 輪播才會在使用者捲到那一拍時從第一張開始。非 pin（降級）維持 true。
 */
const mediaActive = ref(true);

// hero 進場：由下往上、透明度 0→100%，0.8s（藝術字已內嵌，可放心拉長不怕素材遲到）
const REVEAL = { autoAlpha: 0, y: 200, duration: 0.8, ease: 'power2.out' };

let tweens: gsap.core.Tween[] = [];
let triggers: ScrollTrigger[] = [];

/** 過線就播 0.4s 的淡入/淡出；overwrite 讓兩個方向對打時直接接手，不疊 tween。
 *  instant = 程式化跳捲（換頁回頂等）的狀態同步：直接 set 到位，不播過場。
 *
 *  shift = false → **只淡，不做垂直位移**（滿屏媒體用）。文字塊往上抽是「這段講完了」的
 *  語彙，但整屏的照片跟著平移會讀成「頁面在滑掉」，而且滿版圖平移會露出後面的底色。
 *  此時 hide() 的 y 參數會被忽略 —— 呼叫端維持與 intro 相同的寫法，不必分支。 */
function makeFade(targets: HTMLElement[], { shift = true } = {}) {
  /** shift 關掉時整個不碰 y，gsap 就不會在元素上留下 inline transform */
  const dy = (y: number) => (shift ? { y } : {});
  const show = (instant = false) =>
    instant
      ? gsap.set(targets, { autoAlpha: 1, ...dy(0), overwrite: 'auto' })
      : tweens.push(
          gsap.to(targets, {
            autoAlpha: 1,
            ...dy(0),
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          }),
        );
  /** onComplete 在淡出真的播完才呼叫（instant 則立即）：給「等看不見了再收拾」的副作用用。
   *  被 overwrite 接手而中止的 tween 不會觸發，所以淡出中途改回淡入不會誤收。 */
  const hide = (y: number, instant = false, onComplete?: () => void) => {
    if (instant) {
      gsap.set(targets, { autoAlpha: 0, ...dy(y), overwrite: 'auto' });
      onComplete?.();
      return;
    }
    tweens.push(
      gsap.to(targets, {
        autoAlpha: 0,
        ...dy(y),
        duration: 0.4,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete,
      }),
    );
  };
  /** 跳捲回到 hero 時重播進場（由下往上淡入，與載入進場一致） */
  const reveal = () =>
    tweens.push(
      gsap.fromTo(
        targets,
        { autoAlpha: 0, ...dy(REVEAL.y) },
        {
          autoAlpha: 1,
          ...dy(0),
          duration: REVEAL.duration,
          ease: REVEAL.ease,
          overwrite: 'auto',
        },
      ),
    );
  return { show, hide, reveal };
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);

  // 降級：不 pin、不藏內容，三塊照文件流各佔一屏全程可見 —— 什麼都不用接。
  // （原本這裡有一條只為錨點顯隱而存在的 trigger，錨點改成全程顯示後就不需要了。）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 切到 pin 版型（引言改為疊在 hero 上的同屏 overlay），等 DOM 套完再量測
  stagePinned.value = true;
  await nextTick();

  // 主/副標藝術字（hero-inner）與裝飾圖一組進出。
  // 裝飾圖的定位 transform（mob/pad 的 translateX(-50%)）由 CSS 負責；gsap 動 y 時會把
  // 既有 transform 拆成分量後保留 x，再疊上自己的 y，不會蓋掉置中。
  const heroTargets = [
    heroInnerRef.value,
    heroRef.value?.querySelector<HTMLElement>('.subpage__hero-bg') ?? null,
  ].filter((el): el is HTMLElement => !!el);
  const introTarget = introInnerRef.value ? [introInnerRef.value] : [];
  const mediaTarget = mediaRef.value ? [mediaRef.value] : [];

  const heroFade = makeFade(heroTargets);
  const introFade = makeFade(introTarget);
  // 媒體只淡不位移（見 makeFade 的 shift）
  const mediaFade = makeFade(mediaTarget, { shift: false });

  // hero 進場：**自己的舞台進視窗才播，只播一次**；後面兩塊先藏著等進度線。
  //
  // ⚠️ 為什麼不是 onMounted 直接播（原本的寫法）：連續閱讀頁（pages/subpage.vue）把六篇
  //    串在同一份文件裡，六個 hero 會在載入那一刻同時演完 —— 使用者捲到第三篇時只看到
  //    靜態畫面，進場動畫早就演給沒人看的畫面外區域了。
  //
  // 改綁舞台位置之後**兩種頁面共用同一條規則**，不必分支：獨立子頁（與連續閱讀頁的第一篇）
  // 載入時舞台頂端已經在視窗底之上，ScrollTrigger 建立即判定已越過 start 而補觸發 onEnter，
  // 等價於原本的「載入即播」。
  //
  // start 取 'top bottom'（舞台頂端碰到視窗底）而非更晚的線：晚於此的話 hero 會先以完整
  // 樣貌露臉、再倒回透明重播一次，那是明顯的破格。
  //
  // ⚠️ 這面旗子是 applyStage 的守衛：pin 的 onRefresh 會**強制**把三塊同步到當下進度
  //    （force: true），而 hero 在進度 0 的狀態就是「顯示」—— 沒有守衛的話，任何一次
  //    refresh 都等於把還沒輪到的 hero 直接設成 autoAlpha 1、y 0。連續閱讀頁載入時
  //    refreshScrollTriggers() 至少跑六次（六篇各一次，見下方 onMounted 末尾），
  //    第 2～6 篇的 hero 於是在讀者捲到之前就被點亮，once 的進場動畫成了空砲。
  let heroRevealed = !(heroTargets.length && stageRef.value);
  if (heroTargets.length && stageRef.value) {
    gsap.set(heroTargets, { autoAlpha: 0, y: REVEAL.y });
    triggers.push(
      ScrollTrigger.create({
        trigger: stageRef.value,
        start: 'top bottom',
        once: true,
        onEnter: () => {
          heroRevealed = true;
          tweens.push(
            gsap.to(heroTargets, {
              autoAlpha: 1,
              y: 0,
              duration: REVEAL.duration,
              ease: REVEAL.ease,
              overwrite: 'auto',
            }),
          );
        },
      }),
    );
  }
  gsap.set(introTarget, { autoAlpha: 0, y: HIDE_Y.before });
  // 沒有第三拍時 mediaTarget 是空陣列，gsap 會警告 target not found。
  // 這裡同樣不給 y —— 起手就位移的話第一次淡入會從偏移處滑回來。
  if (mediaTarget.length) gsap.set(mediaTarget, { autoAlpha: 0 });

  /**
   * 舞台 pin 的距離＝拍數 × 一屏：各塊疊在這幾屏內依序交接，
   * 滾動進度只當開關（各 0.4s，回捲反向）。交接發生在原地，
   * 不需要捲過每塊各自的 100vh，就不會有空白捲動段。
   * 各條線的算式與用意見 utils/subpage-stage-beats。
   */
  const beats = stageBeats(mediaTarget.length > 0);
  const lines = stageLines(beats);

  // 進 pin 版型後媒體先歸位到「還沒輪到」，由下方進度線接手
  mediaActive.value = false;

  let heroShown = true;
  // 引言與媒體同為三態（見 blockState）；hero 一開始就在演，只有 shown/退場兩態
  let introState: StageBlockState = 'before';
  let mediaState: StageBlockState = 'before';
  /** 最近一次 scrub 套到媒體上的 alpha；1 ＝ 還沒進退場窗（見 onUpdate 的 scrub 段） */
  let mediaAlpha = 1;
  // ⚠️ 首頁 → 子頁換的是 layout，Nuxt 的 scrollBehavior 會等 layout 轉場結束才回捲到頂，
  //    同步狀態（不播過場），跳回 hero 則重播進場 → 只留「hero 淡入」。
  let lastScroll: number | null = null; // null = 尚未收到 update，初次一律視為跳捲

  /**
   * 依舞台進度套用三塊（hero／引言／媒體）的狀態。
   *
   * - instant：直接 set 到位，不播 0.4s 過場（跳捲、以及 refresh 後的同步）
   * - replayHero：回到 hero 那一拍時重播進場動畫（跳捲時才要）
   * - force：無視「狀態沒變就不動」的守衛，一律重新套一次。refresh 後同步用 ——
   *   那時三塊的視覺可能與進度脫鉤，比對狀態變數會誤判成「不用動」。
   */
  function applyStage(
    p: number,
    { instant = false, replayHero = false, force = false } = {},
  ) {
    const wantHero = p < lines.heroOut;
    if (force || wantHero !== heroShown) {
      if (!wantHero) {
        heroShown = false;
        heroFade.hide(HIDE_Y.after, instant);
      } else if (heroRevealed) {
        heroShown = true;
        if (replayHero) heroFade.reveal();
        else heroFade.show(instant);
      }
      // else：進場還沒播過 —— 維持藏著（heroShown 留 false），顯示交給 once 那條線。
      // 這裡搶著顯示等於把進場動畫吃掉，理由見 heroRevealed 的宣告處。
    }

    // 沒有第三拍時 introOut 落在 1 之後，永遠進不了 after，行為與加入媒體前相同
    const wantIntro = blockState(p, lines.introIn, lines.introOut);
    if (force || wantIntro !== introState) {
      introState = wantIntro;
      if (wantIntro === 'shown') introFade.show(instant);
      else introFade.hide(HIDE_Y[wantIntro], instant);
    }

    // 退場線給 1：媒體一路演到 pin 結束，中間的淡出由下面的 scrub 負責。
    const wantMedia = blockState(p, lines.mediaIn, 1);
    if (force || wantMedia !== mediaState) {
      mediaState = wantMedia;
      mediaAlpha = 1; // 離開 shown 就把 scrub 的記錄歸位，下次進來才會重新套
      if (wantMedia === 'shown') {
        mediaActive.value = true;
        mediaFade.show(instant);
      } else {
        // 輪播要等淡出播完才停，否則會在淡出途中倒回第一張（被看見）；
        // 停播即倒回第一張，回捲重看時才會從頭演（見 SubpageIntroMedia 的 active）。
        // 但淡出播完時得重新確認「現在確實還不用演」—— 回捲落在淡出最後一格 frame 時
        // 這個 onComplete 會晚於 show 才跑，不擋掉就會把剛打開的輪播又關掉且不會恢復
        // （見 deferredStopStillApplies）
        mediaFade.hide(HIDE_Y[wantMedia], instant, () => {
          if (deferredStopStillApplies(mediaState)) mediaActive.value = false;
        });
      }
    }

    // 媒體退場：**綁 progress 的 scrub**，不是 0.4s 時間動畫。內文墊在它後面且
    // 隨捲動 1:1 走，用時間動畫的話照片消失時內文已經滑掉「速度 × 0.4s」
    // （實測 800px/s 滑 221px、1600px/s 滑 573px）。理由詳見 mediaFadeAlpha。
    //
    // 只在值真的變了才寫：淡入那段 a 恆為 1、mediaAlpha 也是 1 → 不寫，
    // 才不會用 gsap.set 把 show() 的 0.4s 淡入 tween 蓋掉變成瞬間出現。
    if (mediaState === 'shown' && mediaTarget.length) {
      const a = mediaFadeAlpha(p, lines.mediaFadeFrom);
      if (a !== mediaAlpha) {
        mediaAlpha = a;
        gsap.set(mediaTarget, { autoAlpha: a, overwrite: 'auto' });
        // 淡光了才停輪播（停播＝倒回第一張，太早停會在還看得見時被看到）；
        // 回捲時 a 會沿原路升回來，同一行就把它復播。
        mediaActive.value = a > 0;
      }
    }
  }

  if (stageRef.value) {
    triggers.push(
      ScrollTrigger.create({
        trigger: stageRef.value,
        start: 'top top',
        end: `+=${beats * 100}%`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const sc = self.scroll();
          const jumped =
            lastScroll === null ||
            Math.abs(sc - lastScroll) > window.innerHeight;
          lastScroll = sc;
          applyStage(self.progress, { instant: jumped, replayHero: jumped });
        },
        // refresh 之後以新進度重新同步一次，不播過場。
        //
        // ⚠️ 為什麼非有不可：**捲動位置沒變時 ScrollTrigger 不會呼叫 onUpdate**，但 refresh
        //    會重算 start／end ⇒ 同一個 scrollY 對應到的 progress 變了，三塊卻停在舊進度。
        //    實測（390×844，直接開 /subpage#health）：字體載入完成後版面重排、落點重新對齊，
        //    幾何完全正確（stage 已 pin 在 top 0、progress 0），畫面上卻是**引言媒體**
        //    —— hero opacity 0、media opacity 1，停在重排前那個進度的狀態。
        // ⚠️ 這不只是連續閱讀頁的問題：獨立子頁在 resize／轉向（會觸發 refresh）時同樣會
        //    脫鉤，只是沒有落點跳動來提示，更難發現。
        onRefresh: (self) => {
          const sc = self.scroll();
          lastScroll = sc;
          // ⚠️ 不讀 self.progress：refresh 期間它可能還是重算前的值（pin 的量測與 progress
          //    的更新不保證在這個 callback 之前完成）。start／end 這時已是新值，故自己算 ——
          //    這也是「以新版面為準」語意上唯一正確的算法。
          const span = self.end - self.start;
          const p =
            span > 0 ? Math.min(1, Math.max(0, (sc - self.start) / span)) : 0;
          applyStage(p, { instant: true, force: true });
        },
        onLeave: () => {
          // 退場的收尾保險：scrub 要 progress 剛好等於 1 才會把 alpha 帶到 0，而 onUpdate
          // 不保證收得到那一格。漏收的話照片會留在畫面上，舞台的 z-index 1100 還會壓著
          // 內文擋掉點擊 —— 而且是靜默的。onLeave 一定會在越過 end 時觸發，補一刀。
          if (mediaTarget.length) {
            mediaAlpha = 0;
            gsap.set(mediaTarget, { autoAlpha: 0, overwrite: 'auto' });
            mediaActive.value = false;
          }
        },
      }),
    );

    // 舞台 pin 位在頁面最上方卻最晚建立（內文各 pin 先在子元件 onMounted 建好），
    // 且佔位（pin-spacer）此刻才插進 DOM —— 立即全體重算，讓內文各 pin 以最終版面
    // 取得正確起點（sort 保證由上到下的重算順序，見 utils/scroll-trigger）。
    refreshScrollTriggers();
  }
});

onBeforeUnmount(() => {
  // ⚠️ 非 killScrollTriggers（＝ kill(false)）不可：裸 kill() 會 revert，而 revert 會把
  //    舞台的 pin-spacer 從 DOM 拔掉。此刻舊頁還要在畫面上淡出 220ms（out-in 的 leave
  //    一開始就呼叫 beforeUnmount），而 `--pinned` 與 `--under-stage` 是 Vue 旗子驅動的、
  //    不會跟著消失 —— 佔位沒了、`margin-top: vh(-0.65)` 的上拉還在，內文就整段跳到
  //    0.35 屏處疊在 hero 上（實測 1446×1155：contentTop 3933 → 468，16 幀全程可見）。
  killScrollTriggers(...triggers);
  triggers = [];
  tweens.forEach((t) => t.kill());
  tweens = [];
});
</script>

<template>
  <article class="subpage">
    <div
      ref="stageRef"
      class="subpage__stage"
      :class="{
        'subpage__stage--pinned': stagePinned,
        // 媒體那一拍要蓋掉 header —— 抬的是整個舞台，不是媒體本身（見 SCSS）
        'subpage__stage--media': mediaActive,
      }"
    >
      <header ref="heroRef" class="subpage__hero">
        <div ref="heroInnerRef" class="subpage__col--hero subpage__hero-inner">
          <!-- 文字組與 KV 圖拆成兩個 flex 子項，間距由 gap 直接標稿值（48/80/120）。
               ⚠️ 六頁要疊得起來（用右側 rail 切頁時 KV 不上下跳）的前提是**文字組總高
                  六頁一致** —— 而主／副標是 inline SVG，高度得由 CSS 的字帶比例定死，
                  不能讓各檔 viewBox 反推（六份匯出稿比例不一致，差到 7px）。
                  見下方 .subpage__title-img 的 aspect-ratio 與 test/subpage-hero-art-band.spec.ts -->
          <div class="subpage__hero-text">
            <h1 class="subpage__title">
              <span
                class="subpage__title-img"
                role="img"
                :aria-label="content.hero.title"
                v-html="titleSvg"
              />
            </h1>
            <p class="subpage__subtitle">
              <span
                class="subpage__subtitle-img"
                role="img"
                :aria-label="content.hero.subtitle"
                v-html="subtitleSvg"
              />
            </p>
          </div>
          <UPic
            :src="content.hero.bg"
            classname="subpage__hero-bg"
            :use-prefix="false"
            :use2x="false"
            :webp="false"
            loading="eager"
            alt=""
          />
        </div>
      </header>

      <div class="subpage__intro">
        <div ref="introInnerRef" class="subpage__col subpage__col--wide">
          <p class="subpage__intro-text" v-html="content.intro" />
        </div>
      </div>

      <div v-if="introMedia" ref="mediaRef" class="subpage__media">
        <SubpageIntroMedia
          fill
          :active="mediaActive"
          :images="introMedia.images"
          :video="introMedia.video"
        />
      </div>
    </div>

    <div
      class="subpage__content"
      :class="{ 'subpage__content--under-stage': stagePinned && !!introMedia }"
    >
      <!-- ⚠️ 錨點導覽（SubpageAnchor rail / SubpageAnchorBar 底部列）**不在這裡渲染**，
           改由 layouts/subpage.vue 渲染一次：連續閱讀頁（pages/subpage.vue）把六篇串在
           同一份文件裡，留在這裡就會疊出六份底部錨點列。
           顯隱也不由本元件管 —— 兩者都全程顯示，layout 直接傳 visible（見上方註解）。 -->

      <!-- 內文：各頁以預設 slot 撰寫，間距在頁面上逐塊標 Tailwind mt-*/mb-* -->
      <div class="subpage__body">
        <slot />
      </div>

      <SubpageNav :back-url="content.nav.backUrl" :next="content.nav.next" />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.subpage {
  width: 100%;
  color: var(--color-body); // 內文／H3 = B3 #404040
}

// 共用內容欄：置中、小螢幕留左右邊距。內文用窄欄(630)、hero/引言用寬欄(1064)。
.subpage__col {
  width: 100%;
  max-width: var(--subpage-content-w);
  margin: 0 auto;
  padding: 0 20px;
}

.subpage__col--hero {
  padding: 0 23px;

  @include rwd-min('mobile') {
    padding: 0 37px;
  }
  @include rwd-min('tablet') {
    padding: 0 89px;
  }
  @include rwd-min('pc') {
    padding-right: 0;
    padding-left: calc(108 / 1280 * 100vw);
    max-width: 796px;
  }
  @include rwd-min('ultra') {
    padding-left: calc(162 / 1920 * 100vw);
    max-width: calc(1194px + calc(162 / 1920 * 100vw));
  }
}
// 文字組與 KV 圖的間距直接標稿值（gap），不再靠 space-between 從「容器高 − 子項高」
// 長出來 —— 但這也意味著**沒有一段可變空隙可以吸收誤差**了：子項高度只要六頁不一致，
// 差多少就整段往下推多少。故主／副標的字帶比例必須寫死（見 .subpage__title-img）。
.subpage__hero-inner {
  display: flex;
  flex-direction: column;
  height: calc(234.05 / 320 * 100vw);
  gap: 48px;

  @include rwd-min('mobile') {
    height: calc(285 / 414 * 100vw);
  }
  @include rwd-min('tablet') {
    height: calc(490.71 / 768 * 100vw);
    gap: 80px;
  }
  @include rwd-min('pc') {
    height: calc(473.66 / 1280 * 100vw);
    gap: 120px;
    margin-top: 5vh;
  }
  @include rwd-min('ultra') {
    height: calc(710.49 / 1920 * 100vw);
  }
}

// ── pc→ultra 的 clamp ────────────────────────────────────────────────────────
// hero 的三個寬度（.subpage__hero-bg／.subpage__title／.subpage__subtitle）在 ≥1280
// 一律寫成 `clamp(pc 稿值, vw 等比, ultra 稿值)`：1280 落在 pc 稿、1280→1920 隨視窗
// 線性放大、≥1920 凍結在 ultra 稿。與 .subpage__col--wide 的「≥1920 錨定回定寬」同思路。
//
// **為什麼一條 clamp 就夠、不必再寫 ultra 覆寫**：三組的 pc／ultra 稿值恰好是同一個
// vw 比例（1920/1280 = 1.5，而三組 ultra 值都正好是 pc 值 ×1.5）——
//   bg    480/1280 = 720/1920  = 37.5%
//   title 350/1280 = 525/1920  = 27.34%
//   sub   796.08/1280 = 1194.12/1920 = 62.19%
// 所以中間那項 `calc(pc 稿值 / 1280 * 100vw)` **依建構**就會在 1280 等於下限、在 1920
// 等於上限，兩端接得起來，中間全程線性。多寫一條 `@include rwd-min('ultra')` 只會
// 是同一個值的重複（而且日後改稿容易只改到一邊）。
// ⚠️ 這個等比關係是這三組的性質，不是通則：.subpage__col--hero 的 max-width（796 vs
//    1356）就**不是**同一比例，故它仍保留 pc／ultra 兩條。
:deep(.subpage__hero-bg) {
  padding: 0 12px;

  @include rwd-min('mobile') {
    padding: 0 10px;
  }
  @include rwd-min('tablet') {
    padding: 0 15px;
  }
  @include rwd-min('pc') {
    width: clamp(480px, calc(480 / 1280 * 100vw), 720px);
    padding: 0;
  }
}

// 引言欄：照 subpage__col--hero 的作法對稿全等比 —— mob 兩檔走固定邊距
//（320 稿 20、414 稿 26），pad 起改 vw 等比欄寬（654/768），pc 與 ultra
// 稿恰為同一比例（1040/1280 = 1560/1920 = 81.25vw），一條規則吃兩檔，
// ≥1920 錨定回 1560 定寬（與 hero 的 ultra 錨定同思路）。
.subpage__col--wide {
  @include rwd-min('mobile') {
    padding: 0 26px;
  }
  @include rwd-min('tablet') {
    padding: 0;
    max-width: calc(654 / 768 * 100vw);
  }
  @include rwd-min('pc') {
    max-width: calc(1040 / 1280 * 100vw); // = 1560/1920，pc 與 ultra 同比例
  }
  @include rwd-min('ultra') {
    max-width: 1560px;
  }
}

// hero＋引言舞台。預設（SSR／no-JS／reduced-motion）為文件流，兩塊各佔一屏、全程可見；
// --pinned（JS 啟用動畫後）收成一屏，hero 與引言改為絕對定位疊在同層，
// 由 ScrollTrigger pin 住、滾動進度觸發兩者交接（見 script 的 onUpdate）。
.subpage__stage--pinned {
  position: relative;
  height: vh(1);
  overflow: hidden;

  .subpage__hero,
  .subpage__intro,
  .subpage__media {
    position: absolute;
    inset: 0;
    min-height: 0; // 高度由 inset 決定（= 舞台一屏），不再各自撐 vh(1)
    height: auto;
  }
}

// 媒體那一拍：整個舞台抬到 header（z-index 1000）之上，滿屏照片／影片才蓋得掉頂條。
//
// ⚠️ 為什麼抬的是**舞台**而不是 `.subpage__media` 或 `.intro-media`：
//    pin 之後 `.subpage__stage--pinned` 是 position: fixed ⇒ 自成堆疊脈絡，而它自己
//    z-index: auto —— 裡面設多高都出不去。要跨過 header 只能抬到「與 header 同一個
//    堆疊脈絡」的這一層。（降級版型沒有 pin、沒有這層脈絡，由 .intro-media 自己的 1100 處理。）
// ⚠️ 綁 --media 而非常態生效：舞台是滿版 fixed，抬上去就會蓋住整個 header。
//    只在媒體那一拍抬 —— 其餘拍讓 header 正常疊在最上層。
// ⚠️ 淡入的 0.4s 內舞台已經在上面，但 hero／引言層是透明的，header 仍看得見，
//    直到照片真的蓋上來。不會有「header 先消失一拍」的破綻。
.subpage__stage--pinned.subpage__stage--media {
  z-index: 1100; // 與 SubpageIntroMedia 的 .intro-media 同值，兩處要一起改
  // ⚠️ 這裡曾有一條 `overflow: visible`：舞台吃 svh、媒體層吃 dvh，工具列收合後媒體得能
  //    伸出舞台才不露縫。改吃 --vh（＝ large viewport，收合網址列不變）之後舞台本來就
  //    比可視範圍高，那個補丁連同它放開的 overflow 一起拿掉 —— 全程維持 hidden，
  //    hero 進出場的位移才不會超出舞台。
}

// 舞台佔位（GSAP 插入的 .pin-spacer）不吃指標事件。
//
// 為什麼是佔位而不是舞台本身：ScrollTrigger 把被 pin 元素的 **computed** z-index 抄成
// 佔位的**行內**樣式，好讓 pin 期間（舞台變 position: fixed）原地的疊層不變。上面那條
// `--media` 的 1100 就這樣被抄了過去 —— 而且**抄過去就不再更新**：實測整支 /news 從
// 載入起，佔位的行內樣式就是 `z-index: 1100`，`--media` 是開是關都一樣。
//
// 後果是靜默的：佔位 position: relative ＋ z-index 1100 ⇒ 自成堆疊脈絡且高於
// header（1000），於是**整段 pin 期間**（三屏、不只媒體那一拍）header 都在它底下 ——
// 畫面上看得見、點不到。實測 /news 捲到 y=600 時，logo 中心的 elementFromPoint
// 命中的是 .subpage__intro，logo 完全點不到。
//
// 修法取 pointer-events 而非去搶 z-index：行內樣式要 !important 才蓋得掉，而那是
// 跟 GSAP 搶同一個屬性的寫法，日後版本一改就是另一個靜默失效。pointer-events 沒有
// 人跟我們搶，且會**繼承**給整個舞台（含滿屏媒體），一條就夠。
// ⚠️ 代價：舞台那三屏的文字（標題／引言）不能反白選取。舞台之後的正文
//    （.subpage__content 在佔位外面）不受影響。舞台內本來就沒有可互動元素。
// ⚠️ 捲動不受影響：pointer-events 不擋滾輪／觸控捲動。
:deep(.pin-spacer) {
  pointer-events: none;
}

.subpage__media {
  height: vh(1);
}

.subpage__hero {
  position: relative;
  min-height: vh(1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include rwd-min('pc') {
    align-items: flex-start;
  }
}

.subpage__content {
  position: relative;
  background: #fff;
}

// 上拉，墊到舞台後面 —— 照片溶解時內文已經在後面接著，不必再乾捲一屏才看得到。
//
// 為什麼需要：pin-spacer ＝ 舞台自身一屏 ＋ pin 距離，內文接在 spacer 之後。unpin 那一刻
// 舞台雖然空了，那一屏仍在文件流裡要整屏捲掉，內文才輪得到 —— 沒有上拉時實測
// （1440×900）照片消失在 2700、內文到頂要 3664，中間 964px ≒ 一屏全白。
//
// **為什麼是 0.65 屏而不是滿滿一屏**：拉滿（vh(-1)）的話溶解結束時內文上緣已經在 64，
// 等於「文章早就就定位、照片只是從它身上淡掉」，溶解全程都看得到字。留 0.35 屏的話
// 文章是**從下面進場**的 —— 實測 1440×900：
//   溶解開始 2475 → 上緣 604（只露下面約三分之一）
//   溶解結束 2700 → 上緣 379
//   到頂     3079 → 上緣 0（溶解完再 379px，有進場感但不會空一屏）
// 這個數字純粹是視覺取捨、可以單獨調（不影響 scrub 的正確性）：
// 調大越接近「就定位」，調小越接近「空一屏」；上限 vh(-1)、拿掉就是空一屏的原樣。
//
// ⚠️ 綁 `stagePinned && introMedia`，兩個條件都不能少：
//    ① 沒有 pin（no-JS／reduced-motion）時三塊各佔一屏走文件流，上拉會吃掉媒體那屏。
//    ② 沒有第三拍時 beats=1、pin 只有一屏，上拉會讓內文在 hero 那拍就從下緣冒出來
//       —— 引言層是透明的，擋不住。目前六頁子頁都有 introMedia，但版型分支還在，別拿掉。
// ⚠️ 疊層剛好是對的，不用另外排：媒體那一拍舞台是 z-index 1100（見下方 --media），
//    內文 z-index: auto 在它下面 → 照片淡掉就露出內文。其餘拍舞台雖然只有 auto，
//    但那時內文上緣還在視窗外（實測引言退場的 1215 時仍在 1774），不會偷跑。
.subpage__content--under-stage {
  margin-top: vh(-0.65); // 與 .subpage__stage--pinned 的高度同一把尺（--vh）
}

// ≥1280 的寬度走 clamp，理由見上方「pc→ultra 的 clamp」註解。
.subpage__title {
  margin: 0;
  width: calc(150.29 / 320 * 100vw);

  @include rwd-min('mobile') {
    width: calc(197 / 414 * 100vw);
  }
  @include rwd-min('tablet') {
    width: calc(331 / 768 * 100vw);
  }
  @include rwd-min('pc') {
    width: clamp(350px, calc(350 / 1280 * 100vw), 525px);
  }
}

// SVG 藝術字（inline）：wrapper 定「字帶」、svg 撐滿；字形縮放與靠左交給
// SVG 自己的 preserveAspectRatio="xMinYMid"（見 script 的 inlineHeroArt）。
//
// **為什麼字帶比例要寫死**：高度若不宣告，就會由各檔 SVG 自己的 viewBox 反推 ——
// 而六頁的匯出稿比例不一致（主標 350×72 ~ 356.124×74.1944、副標 781×64 ~ 797×66.57），
// 於是每頁文字組總高差到 7px，`hero-inner` 底下的 KV 圖跟著上下跳：用右側錨點 rail
// 一頁一頁切，畫面上就是「每次切換都位移」。寫死之後高度與素材無關，六頁疊得起來。
//
// ⚠️ 比例取 350/72 與 797/66（news 那組）—— 不是隨便挑的，是唯一與版面算式對得上的
//    一組：1280 稿 473.66 − bg 224.3 − gap 80 − 副標 margin 32 = 137.36 ≒ 72 + 65.93；
//    1920 稿 710.49 − 336.45 − 120 − 48 = 206.04 ≒ 108 + 98.87。兩檔都在 1px 內。
// ⚠️ 各檔與此比例的落差（≤3%）由 preserveAspectRatio 在字帶內縮放靠左消化，看不出來；
//    但素材若改成真的不同比例就該連字帶一起改 —— 那道守在
//    test/subpage-hero-art-band.spec.ts（SPEC 與這裡的 aspect-ratio 對帳）。
.subpage__title-img {
  display: block;
  aspect-ratio: 350 / 72;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.subpage__subtitle {
  margin-top: 16px;
  width: calc(272.42 / 320 * 100vw);

  @include rwd-min('mobile') {
    margin-top: 20px;
    width: calc(340 / 414 * 100vw);
  }
  @include rwd-min('tablet') {
    margin-top: 32px;
    width: calc(590.53 / 768 * 100vw);
  }
  @include rwd-min('pc') {
    width: clamp(796.08px, calc(796.08 / 1280 * 100vw), 1194.12px);
  }
  // 1920 稿的上距是 48（不是 tablet 那檔的 32）—— 少這 16px，文字組總高就短一截，
  // 而 .subpage__hero-inner 的 gap 是標稿定值、沒有 space-between 可以吸收，
  // KV 圖會整個往上挪 16px、底下空出約 15px（實測 1920×1080：內容 695 對舞台 710）。
  // 算式對帳見上方 .subpage__title-img 的稿基準註解。
  @include rwd-min('ultra') {
    margin-top: 48px;
  }
}

// 字帶比例同主標，理由與稿基準見 .subpage__title-img
.subpage__subtitle-img {
  display: block;
  aspect-ratio: 797 / 66;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.subpage__unit {
  margin-top: 20px;
  font-size: 18px;
  line-height: 36px;
  font-weight: 300;
  letter-spacing: 2.4px;
  color: var(--color-gray);

  @include rwd-min('tablet') {
    font-size: var(--text-unit);
    line-height: var(--text-unit--line-height);
    font-weight: 400;
    margin-top: 38px;
  }

  @include rwd-min('pc') {
    margin-top: 24px;
  }
}

// 引言滿版一屏（pin 模式時 = 舞台那一屏）：mob/pad 垂直置中 —— 但置中的是
// 「扣掉 fixed header 之後」的剩餘區域（上 padding 多加一個 --header-height，
// flex 置中的內容區就從 header 下緣起算），不是整個視窗；
// pc 對稿不置中，改「靠下 + vh 等比底距」（80/720 = 120/1080，pc 與 ultra 同比例），
// 底距跟著視窗高度縮放，視窗高度離開 720/1080 也不失準。
// 本層沒有背景（透明），故右側 rail（SubpageAnchor，全程顯示）從它底下透出來，
// 不需要在這裡排 z-index —— 會蓋住 rail 的只有滿屏引言媒體那一拍。
.subpage__intro {
  display: flex;
  align-items: center;
  min-height: vh(1);
  // 56px／96px 是內容超過一屏時（窄機／放大字級）的最小留白：自然撐高，不裁切
  //（pin 模式改由 overflow 裁）
  padding: calc(56px + var(--header-height)) 0 56px;

  @include rwd-min('tablet') {
    padding: calc(96px + var(--header-height)) 0 96px;
  }
  @include rwd-min('pc') {
    align-items: flex-end;
    padding-bottom: calc(80 / 720 * #{vh(1)}); // 與舞台一屏同一把尺，底距才貼齊屏底
  }
}

.subpage__intro-text {
  margin: 0;
  font-size: 22px;
  line-height: 40px;
  font-weight: 300;
  color: var(--color-gray);
  text-align: justify;

  @include rwd-min('tablet') {
    font-size: var(--text-intro);
    line-height: var(--text-intro--line-height);
  }
  // pc→ultra 稿是精確的 ×1.5 等比（欄寬 1040→1560、字級 32/60→48/90），
  // 欄寬既走 vw 等比，字級也得跟著走，行數／行長才對得上稿；≥1920 隨欄寬一起錨定。
  @include rwd-min('pc') {
    font-size: calc(32 / 1280 * 100vw);
    line-height: calc(60 / 1280 * 100vw);
  }
  @include rwd-min('ultra') {
    font-size: 48px;
    line-height: 90px;
  }
}

// 與導覽的距離由 SubpageNav 的 padding-top 負責，此處不再留下方留白。
.subpage__body {
  padding-bottom: 0;
}
</style>
