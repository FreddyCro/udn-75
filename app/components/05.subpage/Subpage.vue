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
          gsap.to(targets, { autoAlpha: 1, ...dy(0), duration: 0.4, ease: 'power2.out', overwrite: 'auto' }),
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
        { autoAlpha: 1, ...dy(0), duration: REVEAL.duration, ease: REVEAL.ease, overwrite: 'auto' },
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
  // 媒體只淡不位移（見 makeFade 的 shift）
  const mediaFade = makeFade(mediaTarget, { shift: false });

  // 載入即播 hero 進場；後面兩塊先藏著等進度線
  if (heroTargets.length) tweens.push(gsap.from(heroTargets, REVEAL));
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

          // 退場線給 1：媒體一路演到 pin 結束，中間的淡出由下面的 scrub 負責。
          const wantMedia = blockState(p, lines.mediaIn, 1);
          if (wantMedia !== mediaState) {
            mediaState = wantMedia;
            mediaAlpha = 1; // 離開 shown 就把 scrub 的記錄歸位，下次進來才會重新套
            if (wantMedia === 'shown') {
              mediaActive.value = true;
              mediaFade.show(jumped);
            } else {
              // 輪播要等淡出播完才停，否則會在淡出途中倒回第一張（被看見）；
              // 停播即倒回第一張，回捲重看時才會從頭演（見 SubpageIntroMedia 的 active）。
              // 但淡出播完時得重新確認「現在確實還不用演」—— 回捲落在淡出最後一格 frame 時
              // 這個 onComplete 會晚於 show 才跑，不擋掉就會把剛打開的輪播又關掉且不會恢復
              // （見 deferredStopStillApplies）
              mediaFade.hide(HIDE_Y[wantMedia], jumped, () => {
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
        },
        // pin 結束＝舞台演完 → 錨點出現（pc rail 淡入、<1280 底部列滑入）；回捲進 pin 段則收回
        onLeave: () => {
          anchorVisible.value = true;
          // 退場的收尾保險：scrub 要 progress 剛好等於 1 才會把 alpha 帶到 0，而 onUpdate
          // 不保證收得到那一格。漏收的話照片會留在畫面上，舞台的 z-index 1100 還會壓著
          // 內文擋掉點擊 —— 而且是靜默的。onLeave 一定會在越過 end 時觸發，補一刀。
          if (mediaTarget.length) {
            mediaAlpha = 0;
            gsap.set(mediaTarget, { autoAlpha: 0, overwrite: 'auto' });
            mediaActive.value = false;
          }
        },
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
      :class="{
        'subpage__stage--pinned': stagePinned,
        // 媒體那一拍要蓋掉 header —— 抬的是整個舞台，不是媒體本身（見 SCSS）
        'subpage__stage--media': mediaActive,
      }"
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
          class="subpage__col subpage__col--hero subpage__hero-inner"
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
          <!-- <p class="subpage__unit">{{ content.hero.unit }}／{{ content.hero.author }}</p> -->
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

    <!-- 舞台之後的內容：不透明背景，維持 rail(z1) / 滿版區塊(z2) 的疊層約定。
         --under-stage：上拉一屏墊到舞台後面，媒體淡出就直接見內文（見 SCSS） -->
    <div
      class="subpage__content"
      :class="{ 'subpage__content--under-stage': stagePinned && !!introMedia }"
    >
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

.subpage__col--hero {
  padding: 0 26px;

  @include rwd-min('tablet') {
    padding: 0 20px;
    max-width: min(79vw, 1104px);
  }
}

// 寬欄（hero／引言）：pad 起照 pc 稿比例流體縮放，≥1280 錨定回定寬。
// min() 取兩者較小 → 1280 以下走 84.375vw（= 1080/1280，與視窗等比），
.subpage__col--wide {
  padding: 0 26px;

  @include rwd-min('tablet') {
    padding: 0 20px;
    max-width: min(85vw, var(--subpage-wide-w));
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

// 上拉，墊到舞台後面 —— 照片溶解時內文已經在後面接著，不必再乾捲一屏才看得到。
//
// 為什麼需要：pin-spacer ＝ 舞台自身一屏 ＋ pin 距離，內文接在 spacer 之後。unpin 那一刻
// 舞台雖然空了，那一屏仍在文件流裡要整屏捲掉，內文才輪得到 —— 沒有上拉時實測
// （1440×900）照片消失在 2700、內文到頂要 3664，中間 964px ≒ 一屏全白。
//
// **為什麼是 65svh 而不是滿滿一屏**：拉滿（100svh）的話溶解結束時內文上緣已經在 64，
// 等於「文章早就就定位、照片只是從它身上淡掉」，溶解全程都看得到字。留 35svh 的話
// 文章是**從下面進場**的 —— 實測 1440×900：
//   溶解開始 2475 → 上緣 604（只露下面約三分之一）
//   溶解結束 2700 → 上緣 379
//   到頂     3079 → 上緣 0（溶解完再 379px，有進場感但不會空一屏）
// 這個數字純粹是視覺取捨、可以單獨調（不影響 scrub 的正確性）：
// 調大越接近「就定位」，調小越接近「空一屏」；上限 100svh、拿掉就是空一屏的原樣。
//
// ⚠️ 綁 `stagePinned && introMedia`，兩個條件都不能少：
//    ① 沒有 pin（no-JS／reduced-motion）時三塊各佔一屏走文件流，上拉會吃掉媒體那屏。
//    ② 沒有第三拍時 beats=1、pin 只有一屏，上拉會讓內文在 hero 那拍就從下緣冒出來
//       —— 引言層是透明的，擋不住。目前六頁子頁都有 introMedia，但版型分支還在，別拿掉。
// ⚠️ 疊層剛好是對的，不用另外排：媒體那一拍舞台是 z-index 1100（見下方 --media），
//    內文 z-index: auto 在它下面 → 照片淡掉就露出內文。其餘拍舞台雖然只有 auto，
//    但那時內文上緣還在視窗外（實測引言退場的 1215 時仍在 1774），不會偷跑。
.subpage__content--under-stage {
  margin-top: -65vh;
  margin-top: -65svh; // 與 .subpage__stage--pinned 的高度同單位，行動裝置才對得齊
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
    bottom: calc(265 / 1024 * 100%);
    width: 428px;
  }
  @include rwd-min('pc') {
    right: 8vw;
    bottom: 10vh;
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
