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

// pad / mob 底紋活動範圍：內文與清單之間的留白帶由 .media__roam 佔位，
// 量成「相對 section 的正規化矩形」傳給 HeartMetaball——團塊（含半徑）
// 只在帶內漂移，不會壓到上下文字；pc 追蹤游標、用不到此值
const roamRef = ref<HTMLElement | null>(null);
const bgRoamArea = ref<
  { x: number; y: number; width: number; height: number } | undefined
>();
onMounted(() => {
  if (!window.matchMedia('(max-width: 1279.98px)').matches) return;
  const sec = sectionRef.value;
  const roam = roamRef.value;
  if (!sec || !roam) return;
  const s = sec.getBoundingClientRect();
  const r = roam.getBoundingClientRect();
  bgRoamArea.value = {
    x: (r.left - s.left) / s.width,
    y: (r.top - s.top) / s.height,
    width: r.width / s.width,
    height: r.height / s.height,
  };
});

useMediaIntroMotion({
  section: sectionRef,
  bg: bgRef,
  body: bodyRef,
  morph: morphRef,
  barL: barLRef,
  barR: barRRef,
  lineL: lineLRef,
  lineR: lineRRef,
  titleEls: () => titleRef.value?.getEls() ?? null,
  rows: () => listRef.value?.getRows() ?? [],
});
</script>

<template>
  <section id="media" ref="sectionRef" class="media" data-metaball-scope>
    <!-- 互動底紋 -->
    <div ref="bgRef" class="media__bg" aria-hidden="true">
      <HeartMetaball
        :idle-blob-min="0.1"
        :idle-blob-max="0.2"
        :life="3"
        :roam-area="bgRoamArea"
      />
    </div>

    <div class="media__inner">
      <MediaTitle ref="titleRef" />

      <p ref="bodyRef" class="media__body">{{ newmedia.body }}</p>

      <!-- 底紋活動帶：mob 固定高、pad 以上彈性撐開（同時把清單推到視窗底） -->
      <div ref="roamRef" class="media__roam" aria-hidden="true" />

      <MediaList ref="listRef" />
    </div>

    <!-- 開場 motion 舞台：morph 色塊、兩側 bar 與分裂直線（絕對置中於 section） -->
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
  </section>
</template>

<style lang="scss" scoped>
.media {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #fff;
}

// 底紋層：常駐顯示（開場 motion 結束後淡入）
.media__bg {
  position: absolute;
  inset: 0;

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
  @include rwd-min('tablet') {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 80px 28px 0;
  }

  @include rwd-min('pc') {
    padding: 46px 108px 0;
  }
}

.media__body {
  max-width: 530px;
  margin: 16px 0 0;
  color: var(--color-gray);
  font-size: 18px;
  line-height: 36px;
  font-weight: 300;
  text-align: justify;

  // pad 稿：欄寬 500 隨標題置中
  @include rwd-min('tablet') {
    margin-inline: auto;
  }

  // pc 稿：欄寬 509、18/32 Light、靠左
  @include rwd-min('pc') {
    max-width: 509px;
    margin: 28px 0 0;
    line-height: 32px;
  }
}

// 底紋活動帶：內文與清單之間讓給互動底紋的留白（mob 稿固定 384；pad 以上
// flex 彈性撐開＝把清單推到視窗底的推擠來源），也是 JS 量測漂移範圍的依據
.media__roam {
  height: 384px;

  @include rwd-min('tablet') {
    flex: 1 1 0;
    height: auto;
    min-height: 40px; // 視窗過矮時與清單的最小間距
  }
}

// motion 舞台：置中於 section「第一屏」（section 在 mob / pad 高於一屏，
// 若以整個 section 置中，色塊與組字會落在摺疊線下），純裝飾
.media__stage {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  height: 100vh;
  height: 100dvh; // 對齊 JS 量測的 window.innerHeight（行動裝置網址列收合時）
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
