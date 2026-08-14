<script setup lang="ts">
/**
 * UPic — 響應式圖片元件（Responsive Picture Component）
 *
 * 依斷點輸出 <picture>：每個 srcset 斷點產生一組 <source>（WebP + 原格式），
 * 最後附一個 <img> 作為 fallback。支援裝置尺寸、WebP、Retina（@2x）。
 * src 路徑會被 runtimeConfig 的 APP_ASSETS_PATH 前綴（dev/prod 為空字串）。
 *
 * 使用範例（對應本專案 public/img 實況，完整清單見 pages/resources.vue）：
 *
 * 1. 標準多斷點照片（檔名含 _pc/_pad/_mob；usePrefix 預設 true）：
 *    <UPic src="/img/hero" alt="Hero" />
 *
 * 2. 僅密度變體、無裝置後綴（同一張圖 + @2x + WebP）：
 *    <UPic src="/img/udn75_pic01_01" :use-prefix="false" :srcset="['mob']" alt="pic01_01" />
 *
 * 3. 單檔圖（僅一種格式、無 WebP / Retina，例：底圖、PNG）：
 *    <UPic src="/img/service/udn75_bg_service" :use-prefix="false" :use2x="false" :webp="false" alt="bg" />
 *    <UPic src="/img/visual/udn75_pic17_02" ext="png" :use-prefix="false" :use2x="false" :webp="false" alt="pic17" />
 *
 * 4. SVG 圖表，PC／平板共用一張 + 手機一張（pcpad / mob）：
 *    <UPic src="/img/udn75_chart06_01" ext="svg" :srcset="['pcpad', 'mob']"
 *          default="pcpad" :use2x="false" :webp="false" alt="chart06" />
 *
 * 5. 首屏重要圖片改為立即載入：
 *    <UPic src="/img/hero" loading="eager" alt="Hero" />
 *
 * 圖片命名規則：
 * - 預設（usePrefix=true）：{src}_pc.jpg, {src}_pc@2x.jpg, {src}_pad.jpg, {src}_pad@2x.jpg, {src}_mob.jpg, {src}_mob@2x.jpg
 * - WebP：對應上列各檔的 .webp
 * - usePrefix=false：{src}.jpg, {src}@2x.jpg（同一張圖，僅密度變體）
 * - pcpad（PC 與平板共用一張，常用於 SVG 圖表）：
 *   :srcset="['pcpad', 'mob']" → {src}_pcpad.svg（≥768px）, {src}_mob.svg（<768px）
 *   注意：fallback <img> 建議設 default="pcpad"，避免落到不存在的 _pc 檔。
 */
import { PC_BREAKPOINTS, TABLET_BREAKPOINTS } from '@/utils/constants';

type SrcsetType = Array<'mob' | 'pad' | 'pc' | 'pcpad'>;

interface UPicProps {
  /** 圖片的 ID 屬性 */
  id?: string;

  /** 額外的 CSS class */
  classname?: string;

  /** 圖片路徑（不含副檔名和裝置後綴），例如：'/images/hero' */
  src: string;

  /** 指定要生成的響應式圖片類型，預設：['pc', 'pad', 'mob'] */
  srcset?: SrcsetType;

  /** 預設圖片類型（作為 fallback），預設：'pc' */
  default?: 'mob' | 'pad' | 'pc' | 'pcpad';

  /** 圖片副檔名，預設：'jpg' */
  ext?: string;

  /** 圖片寬度（用於 CLS 優化） */
  width?: number | string;

  /** 圖片高度（用於 CLS 優化） */
  height?: number | string;

  /** 圖片替代文字 */
  alt?: string;

  /** aria-labelledby 屬性 */
  altby?: string;

  /** 圖片載入策略，預設：'lazy' */
  loading?: 'eager' | 'lazy';

  /** 是否使用 2x 高解析度圖片，預設：true */
  use2x?: boolean;

  /** 是否在檔名加上裝置前綴（_pc, _pad, _mob），預設：true */
  usePrefix?: boolean;

  /** 是否生成 WebP 格式的 source，預設：true */
  webp?: boolean;

  /** 自訂 PC breakpoint（px），預設使用 constants 中的 PC_BREAKPOINTS */
  pcBreakpoint?: number;
}

const props = withDefaults(defineProps<UPicProps>(), {
  use2x: true,
  usePrefix: true,
  webp: true,
  loading: 'lazy',
});

// 使用 Nuxt 的 runtimeConfig 取得環境變數
const config = useRuntimeConfig();
const ASSETS_PATH = config.public.APP_ASSETS_PATH;
const DEFAULT_SRCSET: SrcsetType = ['pc', 'pad', 'mob'];
const DEFAULT_EXT = 'jpg';

const srcsetValue = computed(() => props.srcset ?? DEFAULT_SRCSET);
const extValue = computed(() => props.ext ?? DEFAULT_EXT);
const use2xValue = computed(() => props.use2x ?? true);
const usePrefixValue = computed(() => props.usePrefix ?? true);

const mediaQueries = {
  pc: `(min-width: ${props.pcBreakpoint || PC_BREAKPOINTS}px)`,
  pad: `(min-width: ${TABLET_BREAKPOINTS}px)`,
  // PC 與平板共用（≥ 平板斷點）；搭配 mob 即可涵蓋全斷點
  pcpad: `(min-width: ${TABLET_BREAKPOINTS}px)`,
  mob: '',
};

const parsedMedia = computed(() =>
  srcsetValue.value.map((type) => mediaQueries[type])
);

function buildSrcset(
  type: 'mob' | 'pad' | 'pc',
  ext: string,
  use2x: boolean,
  usePrefix: boolean
) {
  const prefix = usePrefix ? `_${type}` : '';
  const base = `${ASSETS_PATH}${props.src}${prefix}.${ext} 1x`;
  if (!use2x) return base;
  const retina = `${ASSETS_PATH}${props.src}${prefix}@2x.${ext} 2x`;
  return `${base}, ${retina}`;
}

const parsedSrcset = computed(() =>
  srcsetValue.value.map((type) =>
    buildSrcset(type, extValue.value, use2xValue.value, usePrefixValue.value)
  )
);

const parsedWebpSrcset = computed(() =>
  props.webp
    ? srcsetValue.value.map((type) =>
        buildSrcset(type, 'webp', use2xValue.value, usePrefixValue.value)
      )
    : undefined
);

const parsedDefault = computed(() => {
  const type = props.default ?? 'pc';
  const prefix = usePrefixValue.value ? `_${type}` : '';
  return `${ASSETS_PATH}${props.src}${prefix}.${extValue.value}`;
});
</script>

<template>
  <picture class="u-pic">
    <template v-for="(media, index) in parsedMedia" :key="media + index">
      <source
        v-if="webp"
        :media="media"
        :srcset="parsedWebpSrcset?.[index]"
        type="image/webp"
      />
      <source
        v-if="srcsetValue.length > 0"
        :media="media"
        :srcset="parsedSrcset[index]"
      />
    </template>
    <img
      :id="id"
      class="u-pic-img"
      :class="classname || ''"
      :src="parsedDefault"
      :alt="alt"
      :aria-labelledby="altby"
      :loading="loading"
      :width="width"
      :height="height"
    />
  </picture>
</template>

<style lang="scss">
.u-pic-img {
  width: 100%;
  height: auto;
  pointer-events: none;
}
</style>