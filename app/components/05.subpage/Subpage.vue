<script lang="ts" setup>
/**
 * Subpage — 六個「類分頁」共用版型骨架：hero／引言／錨點／進場動畫／下一篇導覽。
 * 內文由各頁以預設 slot 直接撰寫（.sp-* 排版基元 + 逐塊 Tailwind mt-* 與 mb-*）。
 * header / footer 由 subpage layout 提供。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshScrollTriggers } from '@/utils/scroll-trigger';
import type { IntroMediaImage, IntroMediaVideo } from './SubpageIntroMedia.vue';

export interface SubpageNavData {
  backUrl: string;
  next?: { title: string; url: string };
}

/**
 * 引言之後的滿屏媒體（舞台第三拍）。二選一：
 * - images：多張照片自動輪播，每張各自帶圖說
 * - video：單支影片
 * 兩者皆空（或 src 為空字串）＝ 該頁不放媒體，舞台維持 hero／引言兩拍。
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

/** 錨點列（SubpageAnchorBar）是否滑入：捲過 hero/引言舞台後才固定在視窗下緣出現 */
const anchorBarVisible = ref(false);

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

/**
 * 舞台一「拍」＝捲過一屏；拍內過 BEAT_OUT 送走前一塊、過 BEAT_IN 迎進下一塊
 * （兩條線間隔小，快速捲過≈交叉淡化）。
 * 有 introMedia 就是兩拍（hero → 引言 → 媒體），pin 距離同步加長成 200%，
 * 所以門檻要除以拍數才會落在同樣的「每屏 0.35 / 0.5」節奏上。
 */
const BEAT_OUT = 0.35;
const BEAT_IN = 0.5;

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
  const hide = (y: number, instant = false) =>
    instant
      ? gsap.set(targets, { autoAlpha: 0, y, overwrite: 'auto' })
      : tweens.push(
          gsap.to(targets, { autoAlpha: 0, y, duration: 0.4, ease: 'power2.in', overwrite: 'auto' }),
        );
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
          onEnter: () => (anchorBarVisible.value = true),
          onLeaveBack: () => (anchorBarVisible.value = false),
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
  gsap.set(introTarget, { autoAlpha: 0, y: 200 });
  // 沒有第三拍時 mediaTarget 是空陣列，gsap 會警告 target not found
  if (mediaTarget.length) gsap.set(mediaTarget, { autoAlpha: 0, y: 200 });

  /**
   * 舞台 pin 的距離＝拍數 × 一屏：各塊疊在這幾屏內依序交接，
   * 滾動進度只當開關（各 0.4s，回捲反向）。交接發生在原地，
   * 不需要捲過每塊各自的 100vh，就不會有空白捲動段。
   */
  const beats = mediaTarget.length ? 2 : 1;
  /** 第 beat 拍（0-based）的第 offset 條線，換算成整段 pin 的進度值 */
  const line = (beat: number, offset: number) => (beat + offset) / beats;
  const HERO_OUT = line(0, BEAT_OUT);
  const INTRO_IN = line(0, BEAT_IN);
  const INTRO_OUT = line(1, BEAT_OUT);
  const MEDIA_IN = line(1, BEAT_IN);

  // 進 pin 版型後媒體先歸位到「還沒輪到」，由下方進度線接手
  mediaActive.value = false;

  let heroShown = true;
  // 引言有三態：before＝還沒進場（藏在下方）、shown、after＝已被媒體接手（往上送走）
  let introState: 'before' | 'shown' | 'after' = 'before';
  let mediaShown = false;
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
          if (heroShown && p >= HERO_OUT) {
            heroShown = false;
            heroFade.hide(-120, jumped);
          } else if (!heroShown && p < HERO_OUT) {
            heroShown = true;
            if (jumped) heroFade.reveal();
            else heroFade.show();
          }

          // 沒有第三拍時 INTRO_OUT 落在 1 之後，永遠進不了 after，行為與原本相同
          const wantIntro =
            p < INTRO_IN ? 'before' : p >= INTRO_OUT ? 'after' : 'shown';
          if (wantIntro !== introState) {
            introState = wantIntro;
            if (wantIntro === 'shown') introFade.show(jumped);
            // before 藏回下方（回捲時原路退回）、after 往上送走（與 hero 退場同向）
            else introFade.hide(wantIntro === 'before' ? 200 : -120, jumped);
          }

          if (!mediaShown && p >= MEDIA_IN) {
            mediaShown = true;
            mediaActive.value = true;
            mediaFade.show(jumped);
          } else if (mediaShown && p < MEDIA_IN) {
            mediaShown = false;
            mediaActive.value = false;
            mediaFade.hide(200, jumped);
          }
        },
        // pin 結束＝舞台演完 → 錨點列於視窗下緣滑入；回捲進 pin 段則收回
        onLeave: () => (anchorBarVisible.value = true),
        onEnterBack: () => (anchorBarVisible.value = false),
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
      <!-- <1280 錨點列（取代 pc 的右側 rail）：固定在視窗下緣，舞台演完才滑入 -->
      <SubpageAnchorBar :visible="anchorBarVisible" />

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
// 不設 z-index／自身底色：引言不遮蓋右側 rail（SubpageAnchor），錨點照樣疊在上面。
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
