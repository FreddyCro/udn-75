<script setup lang="ts">
/**
 * LPic - Responsive Picture Component
 *
 * 自動處理響應式圖片的元件，支援不同裝置尺寸、WebP 格式和 Retina 顯示
 *
 * 使用範例：
 *
 * 1. 基本用法：
 *    <LPic src="/images/hero" alt="Hero Image" />
 *
 * 2. 自訂 breakpoint 和擴展名：
 *    <LPic src="/images/banner" ext="png" :srcset="['pc', 'mob']" alt="Banner" />
 *
 * 3. 不使用 2x 圖片和前綴：
 *    <LPic src="/images/logo" :use2x="false" :usePrefix="false" alt="Logo" />
 *
 * 4. 預加載重要圖片：
 *    <LPic src="/images/hero" loading="eager" alt="Hero Image" />
 *
 * 圖片命名規則：
 * - 預設：{src}_pc.jpg, {src}_pc@2x.jpg, {src}_pad.jpg, {src}_pad@2x.jpg, {src}_mob.jpg, {src}_mob@2x.jpg
 * - WebP：{src}_pc.webp, {src}_pc@2x.webp, {src}_pad.webp, {src}_pad@2x.webp, {src}_mob.webp, {src}_mob@2x.webp
 * - usePrefix=false：{src}.jpg, {src}@2x.jpg
 */
import { PC_BREAKPOINTS, TABLET_BREAKPOINTS } from '@/utils/constants';

type SrcsetType = Array<'mob' | 'pad' | 'pc'>;

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
  default?: 'mob' | 'pad' | 'pc';

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