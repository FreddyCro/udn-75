<script setup lang="ts">
/**
 * Section 4 智慧媒體：容器編排（互動底紋、標題、內文、清單、motion 舞台）。
 * 開場 motion 時間軸在 useMediaIntroMotion；標題分件在 MediaTitle、清單在 MediaList。
 */
import str from '@/locales/section4.json';
import MediaTitle from './MediaTitle.vue';
import MediaList from './MediaList.vue';

const { newmedia } = str;

const sectionRef = ref<HTMLElement | null>(null);
// sticky 畫面組（hold）＋緩衝 spacer（buffer）：motion 期間整組內容（含摺疊
// 線下的清單）由 CSS sticky 定住，定住的捲動距離＝buffer 高度，由
// useMediaIntroMotion 寫入（no-JS／reduced-motion 不寫 → 無 hold，正常文件流）。
// buffer 必須是 section 的「內容」——sticky 的活動範圍是父層 content box，
// 用 padding 當緩衝 sticky 不會動
const holdRef = ref<HTMLElement | null>(null);
const bufferRef = ref<HTMLElement | null>(null);
const bgRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);
// motion 舞台：morph 色塊、兩側 bar、分裂直線（分鏡 6）
const morphRef = ref<HTMLElement | null>(null);
const barLRef = ref<HTMLElement | null>(null);
const barRRef = ref<HTMLElement | null>(null);
const lineLRef = ref<HTMLElement | null>(null);
const lineRRef = ref<HTMLElement | null>(null);

const titleRef = ref<InstanceType<typeof MediaTitle> | null>(null);
const listRef = ref<InstanceType<typeof MediaList> | null>(null);

// pad / mob 底紋活動範圍：整個第一屏（hold 頂緣 → 清單上緣、滿版寬），量成
// 「相對 hold 的正規化矩形」傳給 HeartMetaball。團塊（含羽化外緣）只在帶內漂移，
// 不會侵入清單，但**會蓋過標題與內文** —— 這是刻意的：
// 舊版只量 .media__roam（內文與清單之間那條 30vh 留白）以避開文字，代價是帶高
// 永遠是最窄的軸 → clusterScale 由它決定 → 垂直振幅恆為 0，團塊還被縮到 43%。
// 換成滿屏後窄軸變成寬度（mob 半寬 187 < 叢集名目半徑 286），雙軸都留得下振幅。
// pc 追蹤游標、用不到此值。
// .media__roam 保留為「清單上緣」的量測把手（它是 .media__head 的最後一個子元素，
// 下緣即清單頂），同時仍負責把清單推離內文。
const roamRef = ref<HTMLElement | null>(null);
const bgRoamArea = ref<
  { x: number; y: number; width: number; height: number } | undefined
>();
// 遊走速度倍率：只在量到 roamArea（＝pad / mob）時提到 1.5，pc 維持元件預設 1。
// 不能改 HeartMetaball 的 idleRoamSpeed 預設值 —— 那顆 prop 兩條分支共用，動它
// 會連帶把 pc 的閒置遊走一起加速。
// pad / mob 只有速度可調：振幅由 .media__roam 的幾何算死（idleRoamRange 在
// roamArea 分支根本沒被讀），且垂直振幅恆為 0 —— 帶高 30vh 永遠是最窄的軸，
// clusterScale 會把內縮量剛好吃滿半高。
// 附帶把尾巴救回來：蓋章閘門是「移動滿 SPAWN_DIST 28px 才蓋一章」，原本 mob
// 峰值 6.5px/s 慢到同時存活不到一章（tailAmount 等於沒作用），提速後約 1.2 章。
const bgRoamSpeed = ref(1);
onMounted(() => {
  if (!window.matchMedia('(max-width: 1279.98px)').matches) return;
  // 量測基準＝hold（＝底紋 .media__bg 的覆蓋範圍）；section 還含 track 的
  // hold 緩衝 padding，拿它正規化會把帶子壓扁
  const sec = holdRef.value;
  const roam = roamRef.value;
  if (!sec || !roam) return;
  const s = sec.getBoundingClientRect();
  const r = roam.getBoundingClientRect();
  bgRoamArea.value = {
    // 滿版寬、自 hold 頂緣起算：hold 是 sticky top: 0，其頂緣＝第一屏頂緣
    x: 0,
    y: 0,
    width: 1,
    // r.bottom＝.media__head 下緣＝清單上緣（清單沒有 margin-top，緊接在後）
    height: (r.bottom - s.top) / s.height,
  };
  bgRoamSpeed.value = 1.5;
});

// 底紋 render loop 的閘門：預設 true（降級路徑不建 timeline，底紋一開始就可見），
// 由 useMediaIntroMotion 在 motion 建起來時翻成 false、settle 尾端淡入時翻回來
const bgRevealed = ref(true);

useMediaIntroMotion({
  section: sectionRef,
  hold: holdRef,
  buffer: bufferRef,
  bg: bgRef,
  body: bodyRef,
  morph: morphRef,
  barL: barLRef,
  barR: barRRef,
  lineL: lineLRef,
  lineR: lineRRef,
  titleEls: () => titleRef.value?.getEls() ?? null,
  rows: () => listRef.value?.getRows() ?? [],
  onBgReveal: (revealed) => {
    bgRevealed.value = revealed;
  },
});
</script>

<template>
  <!-- data-header-theme 預設 light：屬性必須在 SSR 輸出裡就存在，AppHeader 才會在
       onMounted 的一次性 querySelectorAll 收到本元素；值由 useMediaIntroMotion 在
       捲動中接管 —— 融合拍與拍 1 期間是 orange（畫面上仍有一大塊橘：先是
       `.section3__veil`，接著是收窄中的橘柱），橘柱收成 28px 細條之後才翻 light
       （門檻見 mediaHeaderLightAt）。reduced-motion 降級路徑不建 timeline，
       veil 與橘塊都不出現，留在 light 天然正確。 -->
  <section
    id="media"
    ref="sectionRef"
    class="media"
    data-metaball-scope
    data-header-theme="light"
  >
    <!-- sticky 畫面組：hold 期間整組（含摺疊線下的清單）定住不動 -->
    <div ref="holdRef" class="media__hold">
      <!-- 互動底紋 -->
      <div ref="bgRef" class="media__bg" aria-hidden="true">
        <!-- 章半徑/壽命一律吃元件預設：舊的 idle-blob-min/max 與 life 是為前一版
               （legacy/HeartMetaballBlock，cellSize 14px）調的，換成 patch 版後
               會讓尾巴大上一倍。尾巴大小改在 HeartMetaball 的 tailBlobMin/Max 調。 -->
        <HeartMetaball
          :roam-area="bgRoamArea"
          :idle-roam-speed="bgRoamSpeed"
          :paused="!bgRevealed"
        />
      </div>

      <div class="media__inner">
        <!-- 上半部：pc 固定高（見 .media__head），清單自其下緣往下順推 -->
        <div class="media__head">
          <MediaTitle ref="titleRef" />

          <p ref="bodyRef" class="media__body">{{ newmedia.body }}</p>

          <!-- 底紋活動帶：mob 固定高、pad 以上彈性撐開（同時把清單推到視窗底） -->
          <div ref="roamRef" class="media__roam" aria-hidden="true" />
        </div>

        <MediaList ref="listRef" />
      </div>

      <!-- 開場 motion 舞台：morph 色塊、兩側 bar 與分裂直線（絕對置中於第一屏） -->
      <div class="media__stage" aria-hidden="true">
        <div ref="morphRef" class="media__morph" />
        <div ref="lineLRef" class="media__line" />
        <div ref="lineRRef" class="media__line" />
        <img
          ref="barLRef"
          class="media__bar"
          src="/img/media/bar.svg"
          width="12"
          height="82"
          alt=""
        />
        <img
          ref="barRRef"
          class="media__bar"
          src="/img/media/bar.svg"
          width="12"
          height="82"
          alt=""
        />
      </div>
    </div>

    <!-- hold 緩衝 spacer：高度由 useMediaIntroMotion 寫入＝整段 motion 的
         scrub 行程。必須是 section 的內容才算進 sticky 活動範圍 -->
    <div ref="bufferRef" class="media__hold-buffer" aria-hidden="true" />
  </section>
</template>

<style lang="scss" scoped>
// ⚠️ 不可設 overflow: hidden —— 會讓內層 sticky 改以本層為捲動基準而失效；
// 水平裁切改由 .media__hold 承接
.media {
  position: relative;
  min-height: vh();
  background: #fff;
}

// sticky 畫面組：後方的 .media__hold-buffer 被捲完前，整組定在視窗頂（原生
// sticky，無 GSAP pin 的 transform 追趕與 pin-spacer）；本體高於一屏時（mob）
// 摺疊線下的清單在 hold 期間同樣不動，解除後隨捲動自然浮上來
.media__hold {
  position: sticky;
  top: 0;
  overflow: hidden; // 承接原本 section 的裁切（morph 滿版色塊、清單 100vw 分隔線）
}

// hold 緩衝 spacer：高度全由 JS 寫（無 JS＝0＝不 hold），這裡不定樣式

// 底紋層：常駐顯示（開場 motion 結束後淡入）
.media__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  // HeartMetaball 自帶 height: 100vh，改為填滿本層
  :deep(.metaballs) {
    height: 100%;
  }
}

// 內容層：pointer-events 穿透到底紋（事件由 section 轉送），連結恢復可互動
// （MediaList 的 .media__row 設回 auto）。本檔為 mobile-first：基底＝mob 稿
.media__inner {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  padding: 32px 20px 112px;
  pointer-events: none;

  // pad 以上：首屏＝一屏高的 flex 欄，清單以 margin-top: auto 貼齊視窗底
  //（取代固定留白，任何視窗高都成立；內容超高時 min-height 讓版面自然變長）
  // vh()＝凍結的 large viewport（同全站）：之前的 100dvh 會在網址列收合時
  // 中途改變高度，sticky 幾何與 bgRoamArea 的一次性量測都跟著失準。
  @include rwd-min('tablet') {
    display: flex;
    flex-direction: column;
    min-height: vh();
    padding: 80px 28px 0;
  }

  @include rwd-min('pc') {
    padding: 80px 108px 0; // 設計稿 951-36596：標題距頂 80
  }
}

// 上半部（標題＋內文＋底紋活動帶）：設計師指定「section 頂 → 清單上緣」固定 672，
// 不隨視窗高變動（Figma 未做此圖層）。672 含 .media__inner 的 padding-top 80，
// 故本區塊自身高度扣掉它；多出來的餘白留在 .media__roam 之後，清單往下順推。
// pad 以下不設限制，維持原本流動版面
.media__head {
  padding-top: 80px;

  @include rwd-min('pc') {
    min-height: 572px - 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 0;
  }
}

.media__title {
  margin-bottom: 16px;

  @include rwd-min('tablet') {
    margin-bottom: 32px;
  }
}

.media__body {
  max-width: 530px;
  margin: 0 0;
  color: var(--color-gray-light);
  font-size: 18px;
  line-height: 36px;
  font-weight: 400;
  text-align: justify;

  @include rwd-min('tablet') {
    font-weight: 300;
    margin-inline: auto;
  }

  @include rwd-min('pc') {
    max-width: 518px;
    margin: 0;
  }
}

// 內文與清單之間的留白：也是底紋活動範圍的下界（量的是它的下緣，見 bgRoamArea）
.media__roam {
  height: vh(0.3);

  @include rwd-min('tablet') {
    min-height: 40px; // 視窗過矮時與清單的最小間距
  }

  @include rwd-min('pc') {
    height: 0;
    min-height: 0;
  }
}

// motion 舞台：置中於 section「第一屏」（section 在 mob / pad 高於一屏，
// 若以整個 section 置中，色塊與組字會落在摺疊線下），純裝飾
//
// ⚠️ 高度必須用**凍結的** vh()、不可用 dvh：buildMotion() 只在 onMounted 量一次組字位置，
//    dvh 在 iOS 網址列收合時把舞台拉高，橘色直條就疊到「媒體」上（iPhone 15 實測約 43px）。
//    JS 側滿版拍的 scaleY 同步吃 vhPx(1)，見 useMediaIntroMotion。
.media__stage {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  height: vh();
  pointer-events: none;
}

// 開場 morph 色塊：基準尺寸＝bar.svg（12×82），timeline 全程以 scale 變形
// （80vw 色塊 → 直條 → 中心點 → 直線）
.media__morph {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 82px;
  background: var(--color-orange);
  transform: translate(-50%, -50%);
  visibility: hidden; // 初始不可見，timeline fromTo 起播才現身
}

// 兩側 bar（bar.svg 12×82）：分鏡4 從中心分裂飛到文字外緣，變細甩出後消失
.media__bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden; // 初始不可見，timeline 起播才現身
}

// 分裂直線（分鏡6）：與 morph 同基準（12×82 橘色塊，timeline 以 scale 調成
// 8×96），從中心騎著引號外緣飛出後淡出
.media__line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 82px;
  background: var(--color-orange);
  transform: translate(-50%, -50%);
  visibility: hidden;
}
</style>
