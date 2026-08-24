<script lang="ts" setup>
// 內容全在 <NewsArticle>：手機版的連續閱讀頁（pages/subpage.vue）要把六篇串成一份文件，
// 兩邊必須吃同一份內容，故本頁只負責掛 layout。
// 舞台有 ScrollTrigger pin，轉場不能帶 transform（會鎖住縮放後的尺寸、切頁時彈一下）：
// 理由與實測數字見 assets/styles/base.scss 的 .page-fade-* 註解。
definePageMeta({
  layout: 'subpage',
  pageTransition: { name: 'page-fade', mode: 'out-in' },
});
</script>

<template>
  <NewsArticle />
</template>
