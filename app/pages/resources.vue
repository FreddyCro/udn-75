<script lang="ts" setup>
/**
 * resources.vue — 素材總覽
 *
 * 展示 public/img 內的所有素材（圖片 + 影片），依資料夾分類、響應式格線排列。
 * 圖片經 UPic 輸出、影片經 UVid 輸出；同一資料夾的圖片與影片放在同一群組，
 * 檔名前以 emoji 區隔（🖼️ 圖片 / 🎬 影片）。每個縮圖右上角可一鍵複製使用程式碼。
 */

type Variant = 'photo' | 'single' | 'chart' | 'logo' | 'video';

interface AssetItem {
  /** 路徑（不含副檔名與裝置後綴；影片不含 .mp4） */
  src: string;
  /** 副檔名（photo 恆為 jpg、chart 恆為 svg、video 恆為 mp4，可省略） */
  ext?: string;
  variant: Variant;
}

interface AssetGroup {
  title: string;
  desc?: string;
  items: AssetItem[];
}

// --- item builders ---------------------------------------------------------

/** 主要照片：jpg + webp + @2x（無裝置後綴） */
const photo = (src: string): AssetItem => ({ src, variant: 'photo' });
/** 單檔圖：僅一種格式、無 webp / retina */
const single = (src: string, ext = 'jpg'): AssetItem => ({ src, ext, variant: 'single' });
/** 圖表 SVG：pcpad / mob 兩斷點 */
const chart = (src: string): AssetItem => ({ src, variant: 'chart' });
/** Logo SVG：單檔 */
const logo = (src: string): AssetItem => ({ src, variant: 'logo' });
/** 影片：mp4（經 UVid 輸出） */
const video = (src: string): AssetItem => ({ src, variant: 'video' });

/** 產生連號照片，如 seq('/img/udn75_pic01_', 18) → _01 ... _18 */
const seq = (base: string, count: number, start = 1): AssetItem[] =>
  Array.from({ length: count }, (_, i) =>
    photo(`${base}${String(start + i).padStart(2, '0')}`)
  );

/** 依 id 清單產生影片項目，如 videoSeq('/img/x/udn75_video', ['07_01']) */
const videoSeq = (base: string, ids: string[]): AssetItem[] =>
  ids.map((id) => video(`${base}${id}`));

// --- 素材清單（對應 public/img，圖片與影片依資料夾混編） --------------------

const groups: AssetGroup[] = [
  {
    title: '/img',
    items: [
      ...seq('/img/udn75_pic01_', 18),
      ...seq('/img/udn75_pic02_', 2),
      // 子頁上／下一頁按鈕（SubpageNav）
      logo('/img/udn75_nav_prev'),
      logo('/img/udn75_nav_next'),
      // 右側錨點藝術字（SubpageAnchor：標題＋編號）
      logo('/img/udn75_anchor_title_news'),
      logo('/img/udn75_anchor_title_visual'),
      logo('/img/udn75_anchor_title_service'),
      logo('/img/udn75_anchor_title_data'),
      logo('/img/udn75_anchor_num_01'),
      logo('/img/udn75_anchor_num_02'),
      logo('/img/udn75_anchor_num_03'),
      logo('/img/udn75_anchor_num_04'),
      video('/img/udn75_bg_video_opening_pc'),
    ],
  },
  {
    title: 'company',
    items: [logo('/img/company/udn75_logo03_01')],
  },
  {
    title: 'data',
    items: [
      single('/img/data/udn75_bg_data'),
      // 首屏藝術字（Subpage hero）
      logo('/img/data/udn75_data_hero_title'),
      logo('/img/data/udn75_data_hero_subtitle'),
      // AI 搜尋區 icon（AiSearch）
      logo('/img/data/udn75_data_ai_search'),
      logo('/img/data/udn75_data_ai_spark'),
      logo('/img/data/udn75_data_icon_udnvip'),
      logo('/img/data/udn75_data_icon_udnnews'),
    ],
  },
  {
    title: 'news',
    items: [
      single('/img/news/udn75_bg_news'),
      // 首屏藝術字（Subpage hero）
      logo('/img/news/udn75_news_hero_title'),
      logo('/img/news/udn75_news_hero_subtitle'),
      ...seq('/img/news/udn75_pic04_', 6),
      // SVG 圖表：pcpad（≥768px）／ mob 兩斷點
      chart('/img/news/udn75_chart19_01'),
      // 獲獎歷程時間軸素材（AwardTimeline）
      logo('/img/news/udn75_news_timeline_arrow'),
      logo('/img/news/udn75_news_timeline_line'),
    ],
  },
  {
    title: 'service',
    items: [
      single('/img/service/udn75_bg_service'),
      // 首屏藝術字（Subpage hero）
      logo('/img/service/udn75_service_hero_title'),
      logo('/img/service/udn75_service_hero_subtitle'),
      single('/img/service/udn75_pic21_01'),
      single('/img/service/udn75_pic22_01'),
      single('/img/service/udn75_pic24_01'),
      single('/img/service/udn75_pic27_02'),
      ...seq('/img/service/udn75_pic18_', 2),
      ...videoSeq('/img/service/udn75_video', [
        '20_01', '21_02', '21_03', '23_01', '25_01',
        '26_01', '26_02', '26_03', '27_01',
        '28_01', '28_02', '29_01', '29_02',
      ]),
    ],
  },
  {
    title: 'visual',
    items: [
      single('/img/visual/udn75_bg_visual'),
      // 首屏藝術字（Subpage hero）
      logo('/img/visual/udn75_visual_hero_title'),
      logo('/img/visual/udn75_visual_hero_subtitle'),
      ...seq('/img/visual/udn75_pic05_', 2),
      single('/img/visual/udn75_pic09_01'),
      single('/img/visual/udn75_pic11_01'),
      single('/img/visual/udn75_pic16_02'),
      single('/img/visual/udn75_pic17_02', 'png'),
      // SVG 圖表：pcpad（≥768px）／ mob 兩斷點
      chart('/img/visual/udn75_chart06_01'),
      ...videoSeq('/img/visual/udn75_video', [
        '07_01', '07_02', '08_01', '08_02', '09_02', '09_03',
        '10_01', '10_02', '10_03', '11_02', '12_01', '12_02',
        '13_01', '14_01', '14_02', '15_01', '16_01', '17_01',
      ]),
    ],
  },
];

// --- 顯示名稱（含 emoji 區隔） ---------------------------------------------

const isVideo = (item: AssetItem): boolean => item.variant === 'video';

/** 檔名（含副檔名；chart 標示雙檔、video 為 .mp4） */
const fileName = (item: AssetItem): string => {
  const base = item.src.split('/').pop() ?? '';
  if (item.variant === 'video') return `${base}.mp4`;
  if (item.variant === 'photo') return `${base}.jpg`;
  if (item.variant === 'chart') return `${base}_pcpad / _mob.svg`;
  return `${base}.${item.ext ?? 'svg'}`;
};

/** 顯示用檔名：前綴 emoji 區隔圖片 / 影片 */
const displayName = (item: AssetItem): string =>
  `${isVideo(item) ? '🎬' : '🖼️'} ${fileName(item)}`;

// --- UPic props ------------------------------------------------------------

/** UPic 可綁定的 props 子集 */
interface UpicBind {
  src: string;
  ext?: string;
  usePrefix?: boolean;
  use2x?: boolean;
  webp?: boolean;
  srcset?: Array<'mob' | 'pad' | 'pc' | 'pcpad'>;
  default?: 'mob' | 'pad' | 'pc' | 'pcpad';
  alt: string;
}

/** 依 variant 產生對應的 UPic props */
const upicProps = (item: AssetItem): UpicBind => {
  const alt = fileName(item);
  switch (item.variant) {
    case 'photo':
      // 無裝置後綴、僅密度變體 → 單一 source 帶 webp + @2x 即可
      return { src: item.src, usePrefix: false, srcset: ['mob'], alt };
    case 'chart':
      return {
        src: item.src,
        ext: 'svg',
        srcset: ['pcpad', 'mob'],
        default: 'pcpad',
        use2x: false,
        webp: false,
        alt,
      };
    case 'logo':
      return { src: item.src, ext: 'svg', usePrefix: false, use2x: false, webp: false, srcset: ['mob'], alt };
    case 'single':
    default:
      return { src: item.src, ext: item.ext, usePrefix: false, use2x: false, webp: false, srcset: ['mob'], alt };
  }
};

/** UVid src：這些影片無裝置變體 → 三個 key 指向同一支 */
const vidSrc = (item: AssetItem) => ({
  mob: item.src,
  pad: item.src,
  pc: item.src,
});

// --- 複製使用程式碼 --------------------------------------------------------

/** 產生該 resource 在頁面實際使用的元件程式碼 */
const snippet = (item: AssetItem): string => {
  const alt = fileName(item);
  switch (item.variant) {
    case 'video':
      return `<UVid\n  :src="{ mob: '${item.src}', pad: '${item.src}', pc: '${item.src}' }"\n  preload="metadata"\n/>`;
    case 'photo':
      return `<UPic src="${item.src}" :use-prefix="false" :srcset="['mob']" alt="${alt}" />`;
    case 'chart':
      return `<UPic\n  src="${item.src}"\n  ext="svg"\n  :srcset="['pcpad', 'mob']"\n  default="pcpad"\n  :use2x="false"\n  :webp="false"\n  alt="${alt}"\n/>`;
    case 'logo':
      return `<UPic src="${item.src}" ext="svg" :use-prefix="false" :use2x="false" :webp="false" alt="${alt}" />`;
    case 'single':
    default:
      return `<UPic src="${item.src}" ext="${item.ext ?? 'jpg'}" :use-prefix="false" :use2x="false" :webp="false" alt="${alt}" />`;
  }
};

const copiedKey = ref<string | null>(null);
let copyTimer: ReturnType<typeof setTimeout> | null = null;

async function copyCode(item: AssetItem) {
  const code = snippet(item);
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // fallback：非安全內容環境 / 舊瀏覽器
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  copiedKey.value = item.src;
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copiedKey.value = null;
  }, 1500);
}

useHead({ title: '素材總覽 · udn 75' });
</script>

<template>
  <main class="resources">
    <header class="resources__head">
      <h1 class="resources__title">素材總覽</h1>
      <p class="resources__legend">🖼️ 圖片（UPic）　🎬 影片（UVid）　右上角按鈕可複製使用程式碼</p>
    </header>

    <section
      v-for="group in groups"
      :key="group.title"
      class="resources__group"
    >
      <h2 class="resources__group-title">
        {{ group.title }}
        <span v-if="group.desc" class="resources__group-desc">{{ group.desc }}</span>
        <span class="resources__group-count">{{ group.items.length }}</span>
      </h2>

      <ul class="resources__grid">
        <li
          v-for="item in group.items"
          :key="item.src"
          class="resources__item"
        >
          <figure class="resources__figure">
            <div
              class="resources__thumb"
              :class="{ 'resources__thumb--video': isVideo(item) }"
            >
              <UVid v-if="isVideo(item)" :src="vidSrc(item)" preload="metadata" />
              <UPic v-else v-bind="upicProps(item)" loading="lazy" />

              <button
                type="button"
                class="resources__copy"
                :class="{ 'is-copied': copiedKey === item.src }"
                :title="copiedKey === item.src ? '已複製' : '複製程式碼'"
                :aria-label="`複製 ${fileName(item)} 的程式碼`"
                @click="copyCode(item)"
              >
                {{ copiedKey === item.src ? '✓' : '⧉' }}
              </button>
            </div>
            <figcaption class="resources__name">{{ displayName(item) }}</figcaption>
          </figure>
        </li>
      </ul>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.resources {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 20px 96px;

  &__head {
    margin-bottom: 40px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.3;
  }

  &__legend {
    margin-top: 8px;
    font-size: 13px;
    color: #666;
  }

  &__group {
    margin-top: 48px;
  }

  &__group-title {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 18px;
    font-weight: 700;
  }

  &__group-desc {
    font-size: 13px;
    font-weight: 400;
    color: #999;
  }

  &__group-count {
    margin-left: auto;
    padding: 2px 10px;
    border-radius: 999px;
    background: #f0f0f0;
    font-size: 12px;
    font-weight: 400;
    color: #666;
  }

  // auto-fill + minmax：本身即響應式，欄數隨視窗寬自動增減，免斷點
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 24px;
    padding: 0;
    list-style: none;

    @include rwd-min('tablet') {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
  }

  &__figure {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
  }

  // 棋盤格底：深淺底圖都看得清邊界；圖片以原始比例置中
  &__thumb {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    background-color: #fafafa;
    background-image:
      linear-gradient(45deg, #eee 25%, transparent 25%),
      linear-gradient(-45deg, #eee 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #eee 75%),
      linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0;
  }

  // 影片：深底 + 固定最小高，讓不同比例的留白一致、載入前不塌陷
  &__thumb--video {
    min-height: 120px;
    background: #111;

    :deep(.u-vid) {
      display: block;
      height: auto;
    }
  }

  // 右上角複製按鈕
  &__copy {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.92);
    color: #333;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s, background 0.15s, color 0.15s, border-color 0.15s;

    &:hover {
      opacity: 1;
      background: #fff;
    }

    &:focus-visible {
      opacity: 1;
      outline: 2px solid #2563eb;
      outline-offset: 1px;
    }

    &.is-copied {
      opacity: 1;
      background: #16a34a;
      border-color: #16a34a;
      color: #fff;
    }
  }

  &__item:hover &__copy {
    opacity: 1;
  }

  &__name {
    font-size: 12px;
    line-height: 1.5;
    color: #555;
    word-break: break-all;
  }
}
</style>
