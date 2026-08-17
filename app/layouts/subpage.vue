<template>
  <div class="subpage-layout">
    <!-- 子頁無 hero：關閉自動隱藏，header（含進度條）常駐顯示 -->
    <!-- 右側錨點（SubpageAnchor）改由 Subpage.vue 渲染：顯隱跟著舞台進度線走 -->
    <AppHeader :auto-hide="false" />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
