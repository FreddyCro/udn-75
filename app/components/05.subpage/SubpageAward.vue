<script lang="ts" setup>
/**
 * SubpageAward — 近年得獎專題的單一「得獎項目」。
 * 像素桂冠（wreath，取自 Figma 的 ART，以 currentColor 上色）環繞獎名／年份，類別置於下方。
 * variant 決定顏色：gold（首獎／銅牌）為金色、dark（其餘）為深灰。
 * 獎名可含換行（\n）以對齊 Figma 的兩行排版。
 */
withDefaults(
  defineProps<{
    name?: string;
    year?: string;
    category?: string;
    variant?: 'gold' | 'dark';
  }>(),
  { variant: 'dark' },
);
</script>

<template>
  <figure class="award" :class="`award--${variant}`">
    <div class="award__badge">
      <svg
        class="award__wreath"
        viewBox="0 0 203 94"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="47" y="87.29" width="6.71" height="6.71" />
        <rect x="40.29" y="80.57" width="6.71" height="6.71" />
        <rect x="33.57" y="73.86" width="6.71" height="6.71" />
        <rect x="20.14" y="60.43" width="6.71" height="6.71" />
        <rect x="26.86" y="67.14" width="6.71" height="6.71" />
        <rect x="20.14" y="53.71" width="6.71" height="6.71" />
        <rect x="6.71" y="53.71" width="6.71" height="6.71" />
        <rect x="20.14" y="40.29" width="6.71" height="6.71" />
        <rect x="20.14" y="26.86" width="6.71" height="6.71" />
        <rect x="6.71" y="40.29" width="6.71" height="6.71" />
        <rect x="6.71" y="26.86" width="6.71" height="6.71" />
        <rect x="13.43" y="20.14" width="6.71" height="6.71" />
        <rect x="0" y="20.14" width="6.71" height="6.71" />
        <rect x="20.14" y="13.43" width="6.71" height="6.71" />
        <rect x="26.86" y="6.71" width="6.71" height="6.71" />
        <rect x="13.43" y="6.71" width="6.71" height="6.71" />
        <rect x="33.57" y="0" width="6.71" height="6.71" />
        <rect x="33.57" y="80.57" width="6.71" height="6.71" />
        <rect x="20.14" y="67.14" width="6.71" height="6.71" />
        <rect x="26.86" y="73.86" width="6.71" height="6.71" />
        <rect x="13.43" y="60.43" width="6.71" height="6.71" />
        <rect x="13.43" y="47" width="6.71" height="6.71" />
        <rect x="13.43" y="33.57" width="6.71" height="6.71" />
        <rect x="148.41" y="87.29" width="6.71" height="6.71" />
        <rect x="155.13" y="80.57" width="6.71" height="6.71" />
        <rect x="161.84" y="73.86" width="6.71" height="6.71" />
        <rect x="175.27" y="60.43" width="6.71" height="6.71" />
        <rect x="168.56" y="67.14" width="6.71" height="6.71" />
        <rect x="175.27" y="53.71" width="6.71" height="6.71" />
        <rect x="188.7" y="53.71" width="6.71" height="6.71" />
        <rect x="175.27" y="40.29" width="6.71" height="6.71" />
        <rect x="175.27" y="26.86" width="6.71" height="6.71" />
        <rect x="188.7" y="40.29" width="6.71" height="6.71" />
        <rect x="188.7" y="26.86" width="6.71" height="6.71" />
        <rect x="195.41" y="20.14" width="6.71" height="6.71" />
        <rect x="181.98" y="20.14" width="6.71" height="6.71" />
        <rect x="175.27" y="13.43" width="6.71" height="6.71" />
        <rect x="168.56" y="6.71" width="6.71" height="6.71" />
        <rect x="181.98" y="6.71" width="6.71" height="6.71" />
        <rect x="161.84" y="0" width="6.71" height="6.71" />
        <rect x="161.84" y="80.57" width="6.71" height="6.71" />
        <rect x="175.27" y="67.14" width="6.71" height="6.71" />
        <rect x="168.56" y="73.86" width="6.71" height="6.71" />
        <rect x="181.98" y="60.43" width="6.71" height="6.71" />
        <rect x="181.98" y="47" width="6.71" height="6.71" />
        <rect x="181.98" y="33.57" width="6.71" height="6.71" />
      </svg>

      <div class="award__inner">
        <p v-if="name" class="award__name">{{ name }}</p>
        <p v-if="year" class="award__year">{{ year }}</p>
      </div>
    </div>

    <figcaption v-if="category" class="award__cat">{{ category }}</figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.award {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  text-align: center;
  color: var(--color-body); // dark 變體 = B3 #404040
}

.award--gold {
  color: var(--color-gold);
}

.award__badge {
  position: relative;
  width: 100%;
  max-width: 203px;
}

.award__wreath {
  display: block;
  width: 100%;
  height: auto;
  fill: currentColor; // 桂冠顏色跟著 variant
}

// 獎名／年份疊在桂冠中央（避開左右兩臂）
.award__inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24%;
}

.award__name {
  margin: 0;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 400;
  white-space: pre-line; // 吃 \n 換行
}

.award__year {
  margin: 2px 0 0;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 400;
}

.award__cat {
  margin-top: 10px;
  font-size: var(--text-caption); // 15 / 22
  line-height: var(--text-caption--line-height);
}
</style>
