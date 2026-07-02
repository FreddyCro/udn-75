<template>
  <div>
    <!-- 子頁無 hero：關閉自動隱藏，header（含進度條）常駐顯示 -->
    <AppHeader :auto-hide="false" />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
