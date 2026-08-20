<script lang="ts" setup>
// 內容全在 <NewsArticle>：手機版的連續閱讀頁（pages/subpage.vue）要把六篇串成一份文件，
// 兩邊必須吃同一份內容，故本頁只負責掛 layout。
definePageMeta({ layout: 'subpage' });
</script>

<template>
  <NewsArticle />
</template>
