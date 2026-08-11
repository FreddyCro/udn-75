<script lang="ts" setup>
/**
 * Subpage — 六個「類分頁」共用版型骨架：hero／引言／錨點／進場動畫／下一篇導覽。
 * 內文由各頁以預設 slot 直接撰寫（.sp-* 排版基元 + 逐塊 Tailwind mt-* 與 mb-*）。
 * header / footer 由 subpage layout 提供。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';
import {
  HIDE_Y,
  blockState,
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

// 藝術字路徑來自 locales/*.json，需補上資產前綴才吃得到子路徑／CDN 部署（bg 走 UPic，內部已前綴）
const assetUrl = useAssetUrl();

const stageRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);
const heroInnerRef = ref<HTMLElement | null>(null);
const introInnerRef = ref<HTMLElement | null>(null);
const mediaRef = ref<HTMLElement | null>(null);

/** 錨點（pc 右側 rail 與 <1280 底部列）是否出現：捲過 hero/引言舞台後才顯示 */
const anchorVisible = ref(false);

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

// hero 進場：由下往上、透明度 0→100%，0.4s
const REVEAL = { autoAlpha: 0, y: 200, duration: 0.4, ease: 'power2.out' };

let tweens: gsap.core.Tween[] = [];
let triggers: ScrollTrigger[] = [];

/** 過線就播 0.4s 的淡入/淡出；overwrite 讓兩個方向對打時直接接手，不疊 tween。
 *  instant = 程式化跳捲（換頁回頂等）的狀態同步：直接 set 到位，不播過場。 */
function makeFade(targets: HTMLElement[]) {
  const show = (instant = false) =>
    instant
      ? gsap.set(targets, { autoAlpha: 1, y: 0, overwrite: 'auto' })
      : tweens.push(
          gsap.to(targets, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }),
        );
  /** onComplete 在淡出真的播完才呼叫（instant 則立即）：給「等看不見了再收拾」的副作用用。
   *  被 overwrite 接手而中止的 tween 不會觸發，所以淡出中途改回淡入不會誤收。 */
  const hide = (y: number, instant = false, onComplete?: () => void) => {
    if (instant) {
      gsap.set(targets, { autoAlpha: 0, y, overwrite: 'auto' });
      onComplete?.();
      return;
    }
    tweens.push(
      gsap.to(targets, {
        autoAlpha: 0,
        y,
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
        { autoAlpha: 0, y: REVEAL.y },
        { autoAlpha: 1, y: 0, duration: REVEAL.duration, ease: REVEAL.ease, overwrite: 'auto' },
      ),
    );
  return { show, hide, reveal };
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);

  // 降級：不 pin、不藏內容，只補一個錨點列的顯隱 trigger（純換 class）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (stageRef.value) {
      triggers.push(
        ScrollTrigger.create({
          trigger: stageRef.value,
          start: 'bottom top',
          onEnter: () => (anchorVisible.value = true),
          onLeaveBack: () => (anchorVisible.value = false),
        }),
      );
    }
    return;
  }

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
  const mediaFade = makeFade(mediaTarget);

  // 載入即播 hero 進場；後面兩塊先藏著等進度線
  if (heroTargets.length) tweens.push(gsap.from(heroTargets, REVEAL));
  gsap.set(introTarget, { autoAlpha: 0, y: HIDE_Y.before });
  // 沒有第三拍時 mediaTarget 是空陣列，gsap 會警告 target not found
  if (mediaTarget.length) gsap.set(mediaTarget, { autoAlpha: 0, y: HIDE_Y.before });

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
  // ⚠️ 首頁 → 子頁換的是 layout，Nuxt 的 scrollBehavior 會等 layout 轉場結束才回捲到頂，
  //    同步狀態（不播過場），跳回 hero 則重播進場 → 只留「hero 淡入」。
  let lastScroll: number | null = null; // null = 尚未收到 update，初次一律視為跳捲
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
            lastScroll === null || Math.abs(sc - lastScroll) > window.innerHeight;
          lastScroll = sc;
          const p = self.progress;
          if (heroShown && p >= lines.heroOut) {
            heroShown = false;
            heroFade.hide(HIDE_Y.after, jumped);
          } else if (!heroShown && p < lines.heroOut) {
            heroShown = true;
            if (jumped) heroFade.reveal();
            else heroFade.show();
          }

          // 沒有第三拍時 introOut 落在 1 之後，永遠進不了 after，行為與加入媒體前相同
          const wantIntro = blockState(p, lines.introIn, lines.introOut);
          if (wantIntro !== introState) {
            introState = wantIntro;
            if (wantIntro === 'shown') introFade.show(jumped);
            else introFade.hide(HIDE_Y[wantIntro], jumped);
          }

          const wantMedia = blockState(p, lines.mediaIn, lines.mediaOut);
          if (wantMedia !== mediaState) {
            mediaState = wantMedia;
            if (wantMedia === 'shown') {
              mediaActive.value = true;
              mediaFade.show(jumped);
            } else {
              // 輪播要等淡出播完才停，否則會在淡出途中倒回第一張（被看見）；
              // 停播即倒回第一張，回捲重看時才會從頭演（見 SubpageIntroMedia 的 active）
              mediaFade.hide(HIDE_Y[wantMedia], jumped, () => {
                mediaActive.value = false;
              });
            }
          }
        },
        // pin 結束＝舞台演完 → 錨點出現（pc rail 淡入、<1280 底部列滑入）；回捲進 pin 段則收回
        onLeave: () => (anchorVisible.value = true),
        onEnterBack: () => (anchorVisible.value = false),
      }),
    );

    // 舞台 pin 位在頁面最上方卻最晚建立（內文各 pin 先在子元件 onMounted 建好），
    // 且佔位（pin-spacer）此刻才插進 DOM —— 立即全體重算，讓內文各 pin 以最終版面
    // 取得正確起點（sort 保證由上到下的重算順序，見 utils/scroll-trigger）。
    refreshScrollTriggers();
  }
});

onBeforeUnmount(() => {
  triggers.forEach((st) => st.kill());
  triggers = [];
  tweens.forEach((t) => t.kill());
  tweens = [];
});
</script>

<template>
  <article class="subpage">
    <!-- hero＋引言舞台：pin 模式下兩塊疊同一屏，滾動進度觸發交接；
         降級（no-JS／reduced-motion）維持文件流各佔一屏 -->
    <div
      ref="stageRef"
      class="subpage__stage"
      :class="{ 'subpage__stage--pinned': stagePinned }"
    >
      <header ref="heroRef" class="subpage__hero">
        <UPic
          :src="content.hero.bg"
          classname="subpage__hero-bg"
          :use-prefix="false"
          :use2x="false"
          :webp="false"
          loading="eager"
          alt=""
        />
        <div
          ref="heroInnerRef"
          class="subpage__col subpage__col--wide subpage__hero-inner"
        >
          <h1 class="subpage__title">
            <img
              class="subpage__title-img"
              :src="assetUrl(content.hero.titleImg)"
              :alt="content.hero.title"
            />
          </h1>
          <p class="subpage__subtitle">
            <img
              class="subpage__subtitle-img"
              :src="assetUrl(content.hero.subtitleImg)"
              :alt="content.hero.subtitle"
            />
          </p>
          <p class="subpage__unit">{{ content.hero.unit }}／{{ content.hero.author }}</p>
        </div>
      </header>

      <div class="subpage__intro">
        <div ref="introInnerRef" class="subpage__col subpage__col--wide">
          <p class="subpage__intro-text" v-html="content.intro" />
        </div>
      </div>

      <!-- 舞台第三拍：引言之後的滿屏媒體（照片輪播或影片）。
           內容由各頁 locales 的 content.introMedia 提供，沒填就整塊不存在、舞台回到兩拍 -->
      <div v-if="introMedia" ref="mediaRef" class="subpage__media">
        <SubpageIntroMedia
          fill
          :active="mediaActive"
          :images="introMedia.images"
          :video="introMedia.video"
        />
      </div>
    </div>

    <!-- 舞台之後的內容：不透明背景，維持 rail(z1) / 滿版區塊(z2) 的疊層約定 -->
    <div class="subpage__content">
      <!-- 錨點導覽（皆 position: fixed，不占版面）：舞台演完才出現、回捲則收回。
           pc = 右側 rail、<1280 = 視窗下緣錨點列，顯隱共用同一條進度線 -->
      <SubpageAnchor :visible="anchorVisible" />
      <SubpageAnchorBar :visible="anchorVisible" />

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

.subpage__col--wide {
  padding: 0 26px;
  
  @include rwd-min('tablet') {
    padding: 0 20px;
    max-width: 694px;
  }
  @include rwd-min('pc') {
    max-width: var(--subpage-wide-w);
  }
}

// hero＋引言舞台。預設（SSR／no-JS／reduced-motion）為文件流，兩塊各佔一屏、全程可見；
// --pinned（JS 啟用動畫後）收成一屏，hero 與引言改為絕對定位疊在同層，
// 由 ScrollTrigger pin 住、滾動進度觸發兩者交接（見 script 的 onUpdate）。
.subpage__stage--pinned {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;

  .subpage__hero,
  .subpage__intro,
  .subpage__media {
    position: absolute;
    inset: 0;
    min-height: 0; // 高度由 inset 決定（= 舞台一屏），不再各自撐 100svh
    height: auto;
  }
}

// 引言之後的滿屏媒體。降級（no-JS／reduced-motion）時照文件流自佔一屏；
// pin 模式改為疊在同層（見上方 --pinned）。媒體以 fill 模式撐滿，圖說才貼在視窗底。
.subpage__media {
  height: 100vh;
  height: 100svh;
}

// 設計稿 canvas＝裝置視窗且 header 疊在 frame 內 → 首屏滿版 100vh（非 100vh − header）；
// 文案距視窗頂為固定距離（padding-top），非垂直置中。
.subpage__hero {
  position: relative; // hero-bg 的定位基準（%距底要量 hero 高，不是視窗高）
  min-height: 100vh;
  min-height: 100svh; // 行動裝置以最小視窗計，避免網址列收合時版面跳動
  padding-top: 148px;
  overflow: hidden;

  @include rwd-min('tablet') {
    padding-top: 180px;
  }
  @include rwd-min('pc') {
    padding-top: 163px;
  }
}

// 舞台之後的內容底。z-index 須維持 auto，否則會建立 stacking context，
// 破壞 rail(z1) / 滿版區塊(z2) 的約定（見 SubpageAnchor）。
.subpage__content {
  position: relative;
  background: #fff;
}

// 首屏裝飾圖：素材 856×400 為 @2x，自然顯示 428×200。
// 距底用 % 而非固定值 —— 對稿距底是滿版 frame 的比例，視窗變高才跟著走。
:deep(.subpage__hero-bg) {
  position: absolute;
  bottom: 23%;
  left: 50%;
  z-index: -1;
  width: min(261px, 64vw);
  height: auto;
  transform: translateX(-50%);
  pointer-events: none;

  @include rwd-min('tablet') {
    bottom: 26%;
    width: 428px;
  }
  @include rwd-min('pc') {
    right: 8vw;
    bottom: 11%;
    left: auto;
    width: min(428px, 34vw);
    transform: none;
  }
}

.subpage__title {
  margin: 0;
}

// SVG 藝術字：定高、寬度隨比例，超出欄寬時等比縮小
.subpage__title-img {
  display: block;
  width: auto;
  height: 40px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;

  @include rwd-min('tablet') {
    height: 68px;
  }
  @include rwd-min('pc') {
    height: 72px;
  }
}

.subpage__subtitle-img {
  display: block;
  width: auto;
  height: 29px;
  max-width: 100%;
  object-fit: contain;
  object-position: left center;
  margin-top: 16px;

  @include rwd-min('tablet') {
    height: 48px;
    margin-top: 32px;
  }
  @include rwd-min('pc') {
    height: 64px;
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

// 引言滿版一屏（pin 模式時 = 舞台那一屏）：mob/pad 對稿上下留白相等 → 垂直置中；
// pc 對稿不置中，改以「靠下 + 底距 80」表達，視窗高度一離開 720 也不會失準。
// 舞台期間右側 rail（SubpageAnchor）整個藏著（進 subpage__content 才淡入），此處不需 z-index。
.subpage__intro {
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  padding: 56px 0; // 內容超過一屏時（窄機／放大字級）自然撐高，不裁切（pin 模式改由 overflow 裁）

  @include rwd-min('tablet') {
    padding: 96px 0;
  }
  @include rwd-min('pc') {
    align-items: flex-end;
    padding-bottom: 80px;
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
}

// 與導覽的距離由 SubpageNav 的 padding-top 負責，此處不再留下方留白。
.subpage__body {
  padding-bottom: 0;
}
</style>
