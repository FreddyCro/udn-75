<template>
  <div class="subpage-layout">
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

<style lang="scss" scoped>
/**
 * TODO(header/layout 統一調整)：
 * .app-header__toc 是「首頁區塊錨點」的手機底部列，子頁沒有那些區塊 —— 子頁改用
 * SubpageAnchorBar（同樣 fixed 在視窗下緣，捲過 hero 才滑入）。兩者會疊在同一位置，
 * 因此在子頁 layout 就地關掉 header 的 TOC。
 *
 * 這裡是「暫時擺放位置」：之後由 header／layout 統一處理（例如給 AppHeader 一個
 * 顯隱 TOC 的 prop）時，整段連同 !important 一併移除。
 * !important 的用意：本規則與 AppHeader 內 scoped 規則特異度相同，靠檔案順序決勝
 * 不可靠，故明確壓過。
 */
.subpage-layout :deep(.app-header__toc) {
  display: none !important;
}
</style>
