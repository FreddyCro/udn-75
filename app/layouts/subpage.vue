<template>
  <div>
    <!-- 子頁無 hero：關閉自動隱藏，header（含進度條）常駐顯示 -->
    <AppHeader :auto-hide="false" />
    <!-- 右側錨點：四個子頁名稱，點擊跳頁（position: fixed，不占版面） -->
    <SubpageAnchor />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
