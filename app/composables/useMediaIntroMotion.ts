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
 * section 頂到視窗頂即 pin 定住，整段分鏡以捲動 scrub 驅動（捲多少播多少、
 * 回捲倒帶，同 FormulaBlocks pc）；prefers-reduced-motion 直接顯示完成態。
 * 分鏡稿：pc / pad＝951-40360（橫向、有 bar）、mob＝6070-56570（直向、無 bar）；
 * 分件位置全在 D／BAR／LINE_X／HOME 常數表（分鏡稿 px、777 基準），改稿改表。
 */
export function useMediaIntroMotion(targets: MediaIntroMotionTargets) {
  // pin 期間可捲動距離（px）＝整段分鏡的捲動長度（timeline 約 5s ≈ 400px/s）
  const PIN_DISTANCE = 2000;
  let tl: gsap.core.Timeline | null = null;

  const buildMotion = () => {
    const section = targets.section.value;
    const els = targets.titleEls();
    const bg = targets.bg.value;
    const body = targets.body.value;
    const morph = targets.morph.value;
    const barL = targets.barL.value;
    const barR = targets.barR.value;
    const lineL = targets.lineL.value;
    const lineR = targets.lineR.value;
    const rows = targets.rows();
    if (!section || !els) return;
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
    const LINE_X = 100; // 分鏡 6 直線騎引號外緣
    const lineH = 96 * f; // 直線 8×96
    const HOME = [-254, 259]; // settle 回家：字形中心在 media_title.svg 內的位置
    const QUOTE = 85; // 引號聚合距（心外框中心 ↔ 引號角落中心）

    // 分件在放大 SCALE 倍的標題座標系內 → 分鏡距離除回 SCALE
    const dist = (d: number) => (d * f) / SCALE;
    const partAt = (i: number, d: number) =>
      isMob ? { x: 0, y: sgn[i]! * dist(d) } : { x: sgn[i]! * dist(d), y: 0 };
    const spreadAt = (i: number) =>
      isMob ? partAt(i, D.stack) : { x: dist(HOME[i]!) };

    // 分件錨點統一移到標題中心：motion 期間座標＝與中心的距離，對齊由構造保證。
    // 注意 gsap 設 x/y 會「整段取代」CSS transform 的位移，分件的 translateY(-50%)
    // 置中必須交給 xPercent/yPercent 承接，否則會被吃掉
    gsap.set([...sides, heartBox], {
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
    });

    // 起始定位：文字貼齊中線、引號聚到心外框中心（素材為橘色，先還原灰階 filter）
    sides.forEach((el, i) => gsap.set(el, partAt(i, D.butt)));
    quotes.forEach((el, i) =>
      gsap.set(el, {
        x: -sgn[i]! * dist(QUOTE),
        filter: 'grayscale(0) brightness(1)',
      }),
    );
    gsap.set([barL, barR, lineL, lineR], { x: 0, autoAlpha: 0 });

    // 標題放大並組裝在舞台中心（以 morph 實際位置為準＝section 第一屏中心，
    // 與 bar／直線必然同點）；settle 再縮回定位
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

    // pin＋scrub：section 頂到視窗頂定住、分鏡由捲動進度驅動（可逆）。
    // 不設 invalidateOnRefresh——各 tween 的目標值是建置時量好的常數，
    // refresh 重抓起始值反而會在捲動中途污染狀態。
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
      },
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
      // 5. 中心點抽高成直線
      .to(
        morph,
        { scaleY: lineH / MORPH_H, duration: 0.35, ease: 'power3.inOut' },
        'text+=0.85',
      )
      // 6. 直線分裂騎引號外緣飛出；引號滑入、文字撐開到定位
      .addLabel('quotes')
      .set(
        [lineL, lineR],
        { x: 0, scaleX: 8 / MORPH_W, scaleY: lineH / MORPH_H, autoAlpha: 1 },
        'quotes',
      )
      .set(morph, { autoAlpha: 0 }, 'quotes')
      .to(quotes, { autoAlpha: 1, duration: 0.25 }, 'quotes')
      .to(quotes, { x: 0, duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to(sides[0]!, { ...spreadAt(0), duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to(sides[1]!, { ...spreadAt(1), duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to(lineL, { x: -LINE_X * f, duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to(lineR, { x: LINE_X * f, duration: 0.55, ease: 'power2.inOut' }, 'quotes')
      .to([lineL, lineR], { autoAlpha: 0, duration: 0.2 }, 'quotes+=0.55')
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
    if (!section || !els || !targets.morph.value || !targets.barL.value || !targets.barR.value)
      return;
    // 降級：不建 timeline 也不 pin，直接顯示完成態（初始隱藏全靠 JS set，不寫在 CSS）
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    // 掛載即建置（scrub 的 timeline 必須先於捲動存在）；量測只需 layout 完成，
    // 不需 section 進到視窗。進到 pin 起點前 timeline 停在 0＝分鏡 1 色塊蓋版。
    buildMotion();
  });

  onBeforeUnmount(() => {
    tl?.scrollTrigger?.kill();
    tl?.kill();
  });
}
