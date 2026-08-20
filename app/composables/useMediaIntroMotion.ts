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
  /** 引號之間的「新」 */
  newChar: HTMLImageElement;
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
  /**
   * 底紋（`.media__bg`）是否已淡入。整段 motion 有將近九成的 scrub 行程把底紋
   * 設成 `autoAlpha: 0`（＝`visibility: hidden`），而 HeartMetaball 內部的
   * IntersectionObserver 看不到 visibility —— 隱藏的元素仍有 layout box，IO 照樣
   * 回報 isIntersecting，於是那顆 canvas 會在完全看不見的情況下全速渲染，時間點
   * 剛好是本檔在 scrub 三十條 tween 的時候。「可見」這件事只有這裡知道，所以由
   * 這裡明說。未接（undefined）時 HeartMetaball 維持常跑，行為與改版前相同。
   */
  onBgReveal?: (revealed: boolean) => void;
}

/**
 * 智慧媒體開場 motion：morph 色塊分鏡組字 → settle 交棒完成態標題。
 * 定住用 CSS sticky 而非 GSAP pin（觸控 pin 卡頓、pin-spacer 需全站 refresh）：
 * .media__hold 定在視窗頂，定住距離＝buffer 高度（HOLD_BUFFER，由本檔寫入；
 * no-JS／reduced-motion 不寫＝不 hold）。timeline 以 scrub 綁定這段捲動，
 * 捲完 buffer 剛好播完、sticky 同時解除。
 * 分鏡稿：pc / pad＝951-40360（橫向、有 bar）、mob＝6070-56570（直向、無 bar）；
 * 組裝態（分鏡 04）的字組改版為「智慧『新』媒體」＝2065-140592（753×96）。
 * 分件位置全在 D／BAR／QUOTE／HOME 常數表（分鏡稿 px、753 基準），改稿改表。
 */
export function useMediaIntroMotion(targets: MediaIntroMotionTargets) {
  const route = useRoute();
  const { vhPx } = useViewportHeight();
  const { setMediaMotionArmed } = useOrangeCoreProgress();
  // scrub 行程（px）＝ HOLD_BUFFER（sticky 定住距離＝buffer 高度）＋ 融合拍的跑道。
  //
  // HOLD_BUFFER 只涵蓋拍 1 之後：拍 0（融合拍）跑在 sticky engage **之前**那段跑道上，
  // 不佔 buffer。故它回到 2000 ＝ 5.1 × 392（pc 原本的 px/單位）。
  //
  // 2026-08-11：2000 → 2180（前面插了拍 0，等比加長讓既有每一拍的 px 速度不變）
  // 2026-08-18：2180 → 2120（NARROW_DUR 0.45 → 0.3）
  // 2026-08-18（第二次）：2120 → 2000。拍 0 搬到 sticky 之前的跑道上，buffer 不再
  //   需要為它加長；`(5.1 + NARROW_DUR) × 392` 那條手算連動同時廢除，
  //   拍 0 的長度改由 narrowDurationFor 推導（見下）。
  const HOLD_BUFFER = 2000;
  // 拍 1（色塊左右縮成直條）的 timeline 長度。**同時是 header 翻 light 的地標**
  // （見 st 的 onUpdate）—— 兩處讀同一個 const，不寫兩份 1。
  const BEAT1_DUR = 1;
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
    // 融合橘幕。跨元件取得（它住在 Blessing.vue）—— 同 AppHeader 的
    // querySelectorAll('[data-header-theme]')，是本專案既有慣例。
    // 用 data- 屬性而不是 class：class 是樣式的名字，改名重構不該把 motion 打斷。
    const veil = document.querySelector<HTMLElement>('[data-morph-veil]');
    if (!section || !hold || !buffer || !els) return;
    if (!morph || !barL || !barR || !lineL || !lineR || !veil) return;
    const { title, final: titleFinal, motion: titleMotion, sides, quotes, newChar } = els;
    const newCharBox = newChar.parentElement as HTMLElement; // 引號＋新的外框
    const all: Element[] = [...sides, ...quotes, newChar];

    const isMob = window.matchMedia('(max-width: 767.98px)').matches;
    // 分鏡素材相對定位態標題的放大倍率（mob 素材同寸、定版標題較小 → 倍率較大）
    const SCALE = isMob ? 2.15 : 1.5;
    const hasBars = !isMob; // 分鏡 4 左右 bar：mob 分鏡無此件

    const revealEls = [bg, body, ...rows].filter(Boolean);

    // 重播（如 HMR）殘留的 inline 樣式會讓量測失準，先全部清掉
    st?.kill();
    tl?.kill();
    gsap.set(
      [title, titleFinal, titleMotion, ...all, newCharBox, morph, barL, barR, lineL, lineR],
      { clearProps: 'all' },
    );
    // veil **不可**併入上面那份 clearProps: 'all' 清單：它是清單裡唯一一個 inline
    // display 屬於別人（Vue 的 v-show，見 Blessing.vue 的 coverDone 條件）的元素。
    // clearProps: 'all' 執行的是 style.cssText = ''，會把整個 inline style 屬性
    // 連同 v-show 寫的 `display: none` 一起清掉；v-show 的 updated 只在值變動時
    // 才重寫，值沒變就不會補回來 —— 於是 veil 在 coverDone 還是 false（覆蓋過場
    // 期間）就變成滿版可見的橘幕，蓋住 `.sec2` 整段過場。只清本檔自己會寫的三個屬性。
    gsap.set(veil, { clearProps: 'transform,opacity,visibility' });
    gsap.set(titleMotion, { autoAlpha: 1 });
    gsap.set(titleFinal, { autoAlpha: 0 });
    gsap.set(all, { autoAlpha: 0 });
    gsap.set(revealEls, { autoAlpha: 0 });
    // 底紋此刻起是 visibility: hidden，直到 settle 尾端的淡入（見 onBgReveal）
    targets.onBgReveal?.(false);

    // 素材皆已裁齊字形（框中心＝字形中心），只需量標題外框，其餘用常數表
    const titleRect = title.getBoundingClientRect();
    const centerX = titleRect.left + titleRect.width / 2;

    // ── 分鏡距離表（與標題中心的距離，分鏡稿 px）──────────────────────────
    // f＝現場 px／分鏡稿 px；分鏡稿（2065-140592）的組裝態標題寬 753（502×1.5）
    const f = (titleRect.width * SCALE) / 753;
    const sgn = [-1, 1]; // [智慧, 媒體]＝[左/上, 右/下]
    // 貼齊中線（butt＝字形半寬/半高）→ 中停 →（pc/pad 隨 bar 外挪）→ 撐開
    const D = isMob
      ? { butt: 48, inner: 96, inner2: 96, stack: 143 } // 直向走 y（智慧半高 95.11/2）
      : { butt: 119.4, inner: 152, inner2: 162, stack: 0 }; // 橫向走 x（智慧半寬 238.78/2）
    const BAR_IN = 281; // bar 中停（貼文字外緣）
    const BAR_OUT = 315; // bar 甩出
    const lineH = 96 * f; // 直線 8×96
    const HOME = [-257.1, 257.5]; // settle 回家：字形中心在 media_title.svg 內的位置
    // 引號中心相對標題中心的位置：上引號在左上、下引號在右下
    const QUOTE = 89.16; // 水平（±）
    const QUOTE_Y = 7.16; // 垂直（∓）
    const QUOTE_H = 81.67; // 引號素材高（分鏡 6 直線收成此高再交棒）

    // 分件在放大 SCALE 倍的標題座標系內 → 分鏡距離除回 SCALE
    const dist = (d: number) => (d * f) / SCALE;
    const partAt = (i: number, d: number) =>
      isMob ? { x: 0, y: sgn[i]! * dist(d) } : { x: sgn[i]! * dist(d), y: 0 };
    const spreadAt = (i: number) =>
      isMob ? partAt(i, D.stack) : { x: dist(HOME[i]!) };

    // 分件錨點統一移到標題中心，之後的 x/y＝與中心的距離。
    // gsap 設 x/y 會整段取代 CSS transform，置中須交給 xPercent/yPercent 承接
    gsap.set([...sides, newCharBox], {
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
    // veil 同招置中：CSS 給的是 left: 50%，實際居中靠這裡的 xPercent: -50
    // （見 Blessing.vue 的 .section3__veil ⚠️）。必須排在上面那組 clearProps
    // 之後 —— clearProps 只清 transform/opacity/visibility 三個屬性（不含 left），
    // 但寫入順序仍得晚於清除，否則這裡設的 xPercent 會被一併清掉。
    gsap.set(veil, { xPercent: -50 });

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
    // progress 0＝滿版橘塊，畫面上緣是整片橘。模板的預設值是 light（給
    // reduced-motion 與 /#media 兩條降級路徑用），真的要播 motion 才改成 orange。
    section.dataset.headerTheme = 'orange';

    tl = gsap.timeline({ paused: true });

    tl
      // 1. 色塊左右縮成直條。整段 motion 的第一拍**在 timeline 上**，但畫面上它接在
      //    融合拍（拍 0）之後 —— 拍 0 稍後插到 time 0，見下方。
      .to(morph, { scaleX: 28 / MORPH_W, duration: BEAT1_DUR, ease: 'power3.inOut' })
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
      // 7. 「新」淡入
      .to(newChar, { autoAlpha: 1, duration: 0.4 }, 'quotes+=0.6')
      // 8. settle：標題縮回定位、內容依序淡入
      .addLabel('settle', '+=0.35')
      .to(
        title,
        { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.inOut' },
        'settle',
      )
      // 文字滑回 media_title.svg 字形原位；「新」外框原本就在中心，不需回家
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
      // 內容（底紋＋內文＋清單）整體淡入。這一拍同時是 HeartMetaball 的 render loop
      // 閘門：往前播＝底紋現身、往回捲＝再度隱形（scrub 兩向都會觸發這兩個回呼）
      .to(
        revealEls,
        {
          autoAlpha: 1,
          duration: 0.6,
          onStart: () => targets.onBgReveal?.(true),
          onReverseComplete: () => targets.onBgReveal?.(false),
        },
        'settle+=0.3',
      );

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

    // ── 拍 0（融合拍）：滿版橘 → MEDIA_BLOCK_VW，veil 與 morph 同步 ──────────
    // 它插在 time 0，而且是最後才建的：長度要由「拍 1 以後的總長」推導，所以得等
    // 上面全部建完才算得出來。
    //
    // 為什麼收窄現在可以比接縫抵達視窗頂更早開始（改版前這裡有一條 ⚠️ 說不行）：
    //   morph 上緣 ≡ .media 上緣 ≡ 接縫，這是構造上的恆等式（.media__stage 是
    //   absolute top: 0、塊高一個可視高），所以 morph 只塗得到接縫**以下**。
    //   單獨讓它提早收窄，橘柱會在接縫那條線上被水平切斷。
    //   補上的那一塊是 `.section3__veil`（fixed 滿版、在 blessing 底色之上）：
    //   它蓋住接縫以上的部分，於是收窄時整個視窗高度同步露白。同時 blessing 的底色
    //   硬切成白（見 outroWhiteAt），兩側露出來的白與 .media 的 #fff 同色，
    //   接縫因此不可見。
    //
    // ⚠️ 新的不變量取代舊的那條：**收窄提早多少，就必須有多少 veil 跑道**。
    //    跑道長度 ＝ BLESSING_OUT_VH × 視窗高 ＝ ScrollTrigger 提早的量，
    //    而拍 0 的 timeline 長度由 narrowDurationFor 從它推導。三者是同一個數字的
    //    三種單位，不可各自手調。
    //
    // ⚠️ veil 與 morph 的寬度基準現在由 CSS 保證同一個值，JS 不再持有任何 px：
    //    veil 是 width: 100vw（見 Blessing.vue），morph 吃 window.innerWidth——
    //    兩者都含捲軸寬，所以 scaleX 可以直接用同一組比例（1 → MEDIA_BLOCK_VW），
    //    不必像 morph 那樣除回 MORPH_W（veil 的基準寬本身就是 1 倍版位，不像 morph
    //    是縮小的 bar.svg）。build time 與 render time 的差異因此不可能再讓兩者脫鉤。
    //
    //    事故記錄（2026-08-19）：這裡曾經在 build time 讀
    //    `document.documentElement.clientWidth` 除回版位寬，想讓交棒時 veil 與 morph
    //    的終點 px 相等。但 buildMotion() 跑在 onMounted，那一刻捲軸還沒撐出來，
    //    `clientWidth` 量到的其實是 innerWidth（Playwright 實測 1465×863、捲軸 15px：
    //    clientWidth 回傳 1465 而非渲染時的 1450），除出來的 scaleX 因此靜靜退化成
    //    跟沒除一樣，交棒時 veil 比 morph 窄了「捲軸寬 × MEDIA_BLOCK_VW」＝9px。
    //    量到的 px 基準與渲染時的實際版位不一致，是與本檔另一條「量了會靜靜退回
    //    innerWidth」失敗模式同源的教訓：能在 CSS 裡用相對單位讓兩者天生同源，
    //    就不要在 JS 裡用一次性量測去追齊。
    const runwayPx = BLESSING_OUT_VH * vhPx(1);
    const NARROW_DUR = narrowDurationFor(tl.duration(), runwayPx, HOLD_BUFFER);
    // 把已建好的每一拍（含 label）整批右移，讓 time 0 空出拍 0 的位置
    tl.shiftChildren(NARROW_DUR, true);

    tl.fromTo(
      morph,
      {
        scaleX: window.innerWidth / MORPH_W,
        scaleY: window.innerHeight / MORPH_H,
        autoAlpha: 1,
      },
      {
        scaleX: (window.innerWidth * MEDIA_BLOCK_VW) / MORPH_W,
        duration: NARROW_DUR,
        ease: FUSE_EASE,
      },
      0,
    )
      .fromTo(
        veil,
        { scaleX: 1, autoAlpha: 1 },
        { scaleX: MEDIA_BLOCK_VW, duration: NARROW_DUR, ease: FUSE_EASE },
        0,
      )
      // 交棒：veil 與 morph 此刻同色同寬同位，硬切不可見。
      // ⚠️ 不可延後：veil 停在 MEDIA_BLOCK_VW 而 morph 繼續收窄的話，veil 會比 morph
      //    寬，整個拍 1 的收窄被它遮住。
      .set(veil, { autoAlpha: 0 }, NARROW_DUR);

    // trigger 掛 in-flow 的 section（sticky 的 hold 不可當 trigger）。
    //
    // start / end 都吃 runwayPx（上面已凍結的 px 值），不重新算 BLESSING_OUT_VH *
    // vhPx(1)：NARROW_DUR 是 buildMotion() 執行當下算出來的一次性數字，onMounted 之後
    // 不會重建。若 start/end 在每次 refresh 各自重新換算 vh，一旦視窗高度真的改變
    // （轉向、網址列收合），runwayPx 會變、NARROW_DUR 卻不會跟著變，三者就脫鉤 ——
    // 症狀正是 narrowDurationFor 文件裡「收窄太晚結束」那條（接縫已到頂、交棒點卻
    // 還沒到）。用同一個凍結值就不可能各自漂移；真的要跟上新的 vh，得整個
    // buildMotion() 重跑（本檔目前沒有 resize 重建，同其餘 build-time 數字的限制一樣）。
    //
    // start 提前 runwayPx（＝融合拍的跑道，也**就是 blessing 的 outro 窗口**，那條
    // 的 start 是 `.section3` 的 bottom bottom-=40%，同一個捲動位置）。兩段從此是
    // 同一段：清單淡出、veil 收窄、morph 收窄全部吃這一段。
    //
    // end ＝ runwayPx ＋ HOLD_BUFFER：跑道跑在 sticky engage 之前，其後 buffer 被捲完
    // 的同一刻 timeline 剛好播完、sticky 同時解除（與改版前同樣的收尾保證）。
    //
    // start / end 仍寫成函式，是因為 ScrollTrigger 每次 refresh 都會重新呼叫它們——
    // 但吃的是同一個凍結常數，值不會變。invalidateOnRefresh 開著是配合 animation
    // （本 trigger 有掛 tl）：它讓 refresh 時對 tl 做 revert({kill:false}).invalidate()，
    // 不是「因為它 start/end 才會重算」——那件事函式本身就會做，與這個旗標無關。
    st = ScrollTrigger.create({
      trigger: section,
      start: () => `top top+=${runwayPx}`,
      end: () => `+=${HOLD_BUFFER + runwayPx}`,
      invalidateOnRefresh: true,
      animation: tl,
      scrub: true,
      // header 底色：融合拍與拍 1 期間畫面上仍有一大塊橘（veil／橘柱），收成 28px
      // 細條之後才翻 light。pickHeaderTheme 只比對縱向 top/bottom、判不出橫向寬度，
      // 故直接改屬性值 —— AppHeader 只快取元素清單，每次 scroll 都重讀 dataset。
      //
      // 門檻是**拍 1 結束**（NARROW_DUR + BEAT1_DUR），不是拍 0 結束：拍 0 結束時
      // 橘柱還有 MEDIA_BLOCK_VW 寬，header 一翻成 70% 白會在白帶中央透出一塊橘。
      // 由 timeline 的地標推導、不寫死比例 → 加減拍數不必重算。
      // 比對 self.progress 而非 tl.time()：不必假設 ScrollTrigger 呼叫 onUpdate
      // 之前已經推進過 timeline。
      // 屬性值整段 scrub 只翻一次，卻是逐幀寫入 —— 加個相同值就不寫的守衛。
      // 便宜，但它正好是 AppHeader 每幀讀 dataset 那個迴圈的寫入端
      onUpdate: (self) => {
        const next = mediaHeaderLightAt(
          self.progress,
          NARROW_DUR + BEAT1_DUR,
          tl?.duration() ?? 0,
        )
          ? 'light'
          : 'orange';
        if (section.dataset.headerTheme !== next) section.dataset.headerTheme = next;
      },
      // 兩端的兜底：越過整段 motion 之後底紋必定已淡入、退回起點之前必定還沒。
      // timeline 的 onStart/onReverseComplete 在 refresh 的 revert 之後可能不會
      // 補發，這兩個回呼保證閘門不會停在跟畫面相反的狀態
      onLeaveBack: () => {
        section.dataset.headerTheme = 'orange';
        targets.onBgReveal?.(false);
      },
      onLeave: () => {
        section.dataset.headerTheme = 'light';
        targets.onBgReveal?.(true);
      },
    });

    // veil 與底色翻白的共同閘門：走到這裡才算真的建起來（含 veil 守衛都通過）。
    setMediaMotionArmed(true);
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
    setMediaMotionArmed(false);
  });
}
