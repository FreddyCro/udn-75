import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Ref } from 'vue';

/** MediaTitle 分件元素（getEls() 回傳；任一缺件時為 null，motion 降級不播） */
export interface MediaTitleEls {
  /** h2 容器：motion 的置中／縮放以其中心為基準 */
  title: HTMLElement;
  /** 完成態完整標題 media_title.svg（settle 尾端交棒） */
  final: HTMLImageElement;
  /** motion 分件層（預設隱藏，起播時疊在完成態上組字） */
  motion: HTMLElement;
  /** [智慧, 媒體] */
  sides: HTMLElement[];
  /** [上引號, 下引號] */
  quotes: HTMLImageElement[];
  heart: HTMLImageElement;
}

interface MediaIntroMotionTargets {
  section: Ref<HTMLElement | null>;
  /** sticky 畫面組（底紋＋內容＋舞台）：hold 期間定在視窗頂 */
  hold: Ref<HTMLElement | null>;
  /** hold 緩衝 spacer：高度由本檔寫入＝sticky 定住的捲動距離 */
  buffer: Ref<HTMLElement | null>;
  bg: Ref<HTMLElement | null>;
  body: Ref<HTMLElement | null>;
  morph: Ref<HTMLElement | null>;
  barL: Ref<HTMLElement | null>;
  barR: Ref<HTMLElement | null>;
  lineL: Ref<HTMLElement | null>;
  lineR: Ref<HTMLElement | null>;
  titleEls: () => MediaTitleEls | null;
  rows: () => HTMLElement[];
}

/**
 * 智慧媒體開場 motion：morph 色塊分鏡組字 → settle 交棒完成態標題。
 * 定住用 CSS sticky 而非 GSAP pin（觸控 pin 卡頓、pin-spacer 需全站 refresh）：
 * .media__hold 定在視窗頂，定住距離＝buffer 高度（HOLD_BUFFER，由本檔寫入；
 * no-JS／reduced-motion 不寫＝不 hold）。timeline 以 scrub 綁定這段捲動，
 * 捲完 buffer 剛好播完、sticky 同時解除。
 * 分鏡稿：pc / pad＝951-40360（橫向、有 bar）、mob＝6070-56570（直向、無 bar）；
 * 分件位置全在 D／BAR／QUOTE／HOME 常數表（分鏡稿 px、777 基準），改稿改表。
 */
export function useMediaIntroMotion(targets: MediaIntroMotionTargets) {
  const route = useRoute();
  // scrub 行程（px）＝sticky 定住距離＝buffer 高度
  const HOLD_BUFFER = 2000;
  let tl: gsap.core.Timeline | null = null;
  let st: ScrollTrigger | null = null;

  const buildMotion = () => {
    const section = targets.section.value;
    const hold = targets.hold.value;
    const buffer = targets.buffer.value;
    const els = targets.titleEls();
    const bg = targets.bg.value;
    const body = targets.body.value;
    const morph = targets.morph.value;
    const barL = targets.barL.value;
    const barR = targets.barR.value;
    const lineL = targets.lineL.value;
    const lineR = targets.lineR.value;
    const rows = targets.rows();
    if (!section || !hold || !buffer || !els) return;
    if (!morph || !barL || !barR || !lineL || !lineR) return;
    const { title, final: titleFinal, motion: titleMotion, sides, quotes, heart } = els;
    const heartBox = heart.parentElement as HTMLElement; // 引號＋心的外框
    const all: Element[] = [...sides, ...quotes, heart];

    const isMob = window.matchMedia('(max-width: 767.98px)').matches;
    // 分鏡素材相對定位態標題的放大倍率（mob 素材同寸、定版標題較小 → 倍率較大）
    const SCALE = isMob ? 2.15 : 1.5;
    const BLOCK_VW = 0.6; // 分鏡 1 色塊寬（vw），三版共用
    const hasBars = !isMob; // 分鏡 4 左右 bar：mob 分鏡無此件

    const revealEls = [bg, body, ...rows].filter(Boolean);

    // 重播（如 HMR）殘留的 inline 樣式會讓量測失準，先全部清掉
    st?.kill();
    tl?.kill();
    gsap.set(
      [title, titleFinal, titleMotion, ...all, heartBox, morph, barL, barR, lineL, lineR],
      { clearProps: 'all' },
    );
    gsap.set(titleMotion, { autoAlpha: 1 });
    gsap.set(titleFinal, { autoAlpha: 0 });
    gsap.set(all, { autoAlpha: 0 });
    gsap.set(revealEls, { autoAlpha: 0 });

    // 素材皆已裁齊字形（框中心＝字形中心），只需量標題外框，其餘用常數表
    const titleRect = title.getBoundingClientRect();
    const centerX = titleRect.left + titleRect.width / 2;

    // ── 分鏡距離表（與標題中心的距離，分鏡稿 px）──────────────────────────
    // f＝現場 px／分鏡稿 px；分鏡稿的組裝態標題寬 777（518×1.5）
    const f = (titleRect.width * SCALE) / 777;
    const sgn = [-1, 1]; // [智慧, 媒體]＝[左/上, 右/下]
    // 貼齊中線（butt＝字形半寬/半高）→ 中停 →（pc/pad 隨 bar 外挪）→ 撐開
    const D = isMob
      ? { butt: 48, inner: 96, inner2: 96, stack: 143 } // 直向走 y
      : { butt: 118, inner: 152, inner2: 162, stack: 0 }; // 橫向走 x
    const BAR_IN = 281; // bar 中停（貼文字外緣）
    const BAR_OUT = 315; // bar 甩出
    const lineH = 96 * f; // 直線 8×96
    const HOME = [-254, 259]; // settle 回家：字形中心在 media_title.svg 內的位置
    // 引號中心相對心外框（210×98）中心的位置：上引號在左上、下引號在右下
    const QUOTE = 85; // 水平（±）
    const QUOTE_Y = 7; // 垂直（∓）
    const QUOTE_H = 84; // 引號素材高（分鏡 6 直線收成此高再交棒）

    // 分件在放大 SCALE 倍的標題座標系內 → 分鏡距離除回 SCALE
    const dist = (d: number) => (d * f) / SCALE;
    const partAt = (i: number, d: number) =>
      isMob ? { x: 0, y: sgn[i]! * dist(d) } : { x: sgn[i]! * dist(d), y: 0 };
    const spreadAt = (i: number) =>
      isMob ? partAt(i, D.stack) : { x: dist(HOME[i]!) };

    // 分件錨點統一移到標題中心，之後的 x/y＝與中心的距離。
    // gsap 設 x/y 會整段取代 CSS transform，置中須交給 xPercent/yPercent 承接
    gsap.set([...sides, heartBox], {
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
    });

    // 起始定位：文字貼齊中線；引號留在字形原位（橘色素材，先還原灰階 filter）
    sides.forEach((el, i) => gsap.set(el, partAt(i, D.butt)));
    gsap.set(quotes, { x: 0, filter: 'grayscale(0) brightness(1)' });
    // bar／直線同上：置中交給 xPercent/yPercent
    gsap.set([barL, barR, lineL, lineR], {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      autoAlpha: 0,
    });

    // 標題放大並組裝在舞台中心（以 morph 實際位置為準）；settle 再縮回定位
    const morphRect = morph.getBoundingClientRect();
    const wrapDx = morphRect.left + morphRect.width / 2 - centerX;
    const wrapDy =
      morphRect.top + morphRect.height / 2 - (titleRect.top + titleRect.height / 2);
    gsap.set(title, {
      x: wrapDx,
      y: wrapDy,
      scale: SCALE,
      transformOrigin: '50% 50%',
    });

    // morph 基準尺寸＝bar.svg（12×82），全程以 scale 變形（不觸發 reflow）
    const MORPH_W = 12;
    const MORPH_H = 82;

    buffer.style.height = `${HOLD_BUFFER}px`;

    tl = gsap.timeline({ paused: true });

    // trigger 掛 in-flow 的 section（sticky 的 hold 不可當 trigger）；
    // 行程與 buffer 同長，捲完剛好播完
    st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${HOLD_BUFFER}`,
      animation: tl,
      scrub: true,
    });

    tl
      // 1. 色塊（BLOCK_VW×100vh）左右縮成直條
      .fromTo(
        morph,
        {
          scaleX: (window.innerWidth * BLOCK_VW) / MORPH_W,
          scaleY: window.innerHeight / MORPH_H,
          autoAlpha: 1,
        },
        { scaleX: 28 / MORPH_W, duration: 1, ease: 'power3.inOut' },
      )
      // 2→3. 直條縮成短棒；文字貼齊中線淡入
      .to(morph, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power3.inOut' })
      .to(sides, { autoAlpha: 1, duration: 0.3 }, '-=0.3')
      // 3→4. 短棒縮成點；文字滑開到中停（'text' 標籤由首次引用釘在此時間點）
      .to(
        morph,
        {
          scaleX: 8 / MORPH_W,
          scaleY: 8 / MORPH_H,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        'text',
      )
      .to(sides[0]!, { ...partAt(0, D.inner), duration: 0.6, ease: 'power2.inOut' }, 'text')
      .to(sides[1]!, { ...partAt(1, D.inner), duration: 0.6, ease: 'power2.inOut' }, 'text')
      // ── phase2：morph 已收成點、（pc/pad）bar 也已甩出消失 ──
      .addLabel('phase2', `text+=${hasBars ? 0.9 : 0.6}`)
      // 5. 中心點抽高成直線
      .to(
        morph,
        { scaleY: lineH / MORPH_H, duration: 0.35, ease: 'power3.inOut' },
        'phase2',
      )
      // 6. 直線分裂成兩個引號：兩線飛到上／下引號的中心並收成引號高，
      //    抵達時原地交棒（線淡出、引號自窄條展開）；文字同拍撐開到定位
      .addLabel('quotes')
      .set(
        [lineL, lineR],
        { x: 0, y: 0, scaleX: 8 / MORPH_W, scaleY: lineH / MORPH_H, autoAlpha: 1 },
        'quotes',
      )
      .set(morph, { autoAlpha: 0 }, 'quotes')
      .to(sides[0]!, { ...spreadAt(0), duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to(sides[1]!, { ...spreadAt(1), duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to(
        lineL,
        {
          x: -QUOTE * f,
          y: -QUOTE_Y * f,
          scaleY: (QUOTE_H * f) / MORPH_H,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        'quotes',
      )
      .to(
        lineR,
        {
          x: QUOTE * f,
          y: QUOTE_Y * f,
          scaleY: (QUOTE_H * f) / MORPH_H,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        'quotes',
      )
      // 交棒：線在引號位置淡出，引號同時自窄條展開補上字形（等寬同心 → 無重疊）
      .to([lineL, lineR], { autoAlpha: 0, duration: 0.2 }, 'quotes+=0.5')
      .fromTo(
        quotes,
        { scaleX: 0.2, autoAlpha: 0 },
        { scaleX: 1, autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
        'quotes+=0.5',
      )
      // 7. 「心」淡入
      .to(heart, { autoAlpha: 1, duration: 0.4 }, 'quotes+=0.6')
      // 8. settle：標題縮回定位、內容依序淡入
      .addLabel('settle', '+=0.35')
      .to(
        title,
        { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.inOut' },
        'settle',
      )
      // 文字滑回 media_title.svg 字形原位；心外框原本就在中心，不需回家
      .to(sides[0]!, { x: dist(HOME[0]!), y: 0, duration: 0.8, ease: 'power3.inOut' }, 'settle')
      .to(sides[1]!, { x: dist(HOME[1]!), y: 0, duration: 0.8, ease: 'power3.inOut' }, 'settle')
      // 引號轉灰：與 CSS 完成態同值（#FF7F00 灰階後亮度 145，×0.717 ≈ #686868）
      .to(
        quotes,
        { filter: 'grayscale(1) brightness(0.717)', duration: 0.5 },
        'settle+=0.2',
      )
      // 交棒：位移途中 crossfade 給完成態，位移會遮住分件與完成態的細微錯位
      .to(titleMotion, { autoAlpha: 0, duration: 0.5 }, 'settle+=0.25')
      .to(titleFinal, { autoAlpha: 1, duration: 0.5 }, 'settle+=0.25')
      // 內容（底紋＋內文＋清單）整體淡入
      .to(revealEls, { autoAlpha: 1, duration: 0.6 }, 'settle+=0.3');

    // 分鏡 4／4b（pc / pad 限定）：bar 分裂飛到文字外緣，再變細甩出；文字同拍外挪
    if (hasBars) {
      tl.to(sides[0]!, { ...partAt(0, D.inner2), duration: 0.3, ease: 'power1.inOut' }, 'text+=0.6')
        .to(sides[1]!, { ...partAt(1, D.inner2), duration: 0.3, ease: 'power1.inOut' }, 'text+=0.6')
        .to([barL, barR], { autoAlpha: 1, duration: 0.2 }, 'text')
        .to(barL, { x: -BAR_IN * f, duration: 0.6, ease: 'power2.inOut' }, 'text')
        .to(barR, { x: BAR_IN * f, duration: 0.6, ease: 'power2.inOut' }, 'text')
        .to(
          barL,
          { x: -BAR_OUT * f, scaleX: 3 / MORPH_W, autoAlpha: 0, duration: 0.3, ease: 'power2.in' },
          'text+=0.6',
        )
        .to(
          barR,
          { x: BAR_OUT * f, scaleX: 3 / MORPH_W, autoAlpha: 0, duration: 0.3, ease: 'power2.in' },
          'text+=0.6',
        );
    }
  };

  onMounted(() => {
    const section = targets.section.value;
    const els = targets.titleEls();
    if (!section || !targets.hold.value || !targets.buffer.value || !els) return;
    if (!targets.morph.value || !targets.barL.value || !targets.barR.value) return;
    // 降級：不建 timeline，直接顯示完成態（初始隱藏全靠 JS set，不寫在 CSS）
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // /#media 深連結：錨點在 section 頂＝scrub 進度 0，同降級直接顯示完成態
    if (route.hash === '#media') return;

    gsap.registerPlugin(ScrollTrigger);
    buildMotion();
  });

  onBeforeUnmount(() => {
    st?.kill();
    st = null;
    tl?.kill();
    tl = null;
  });
}
